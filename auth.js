/* Autenticação — nuvem (Vercel KV) ou local (fallback) */

function getUsers () {
  return JSON.parse(localStorage.getItem('users') || '[]');
}

function saveUsers (arr) {
  localStorage.setItem('users', JSON.stringify(arr));
}

function authGoApp () {
  window.location.href = 'app.html';
}

function redirectIfLogged () {
  if (getSession()) authGoApp();
}

function authNormalizedEmail (email) {
  return String(email || '').trim().toLowerCase();
}

function authClinicalStorageKeys (email) {
  const raw = String(email || '').trim();
  const lower = authNormalizedEmail(email);
  const bases = raw === lower ? [raw] : [raw, lower];
  const types = ['anamneses', 'pacientes', 'consultas'];
  const keys = [];
  bases.forEach(e => {
    types.forEach(t => keys.push('medhub-' + t + '-' + e));
  });
  return keys;
}

function authClearClinicalData (email) {
  authClinicalStorageKeys(email).forEach(key => localStorage.removeItem(key));
}

function authFindUserIndex (email) {
  const norm = authNormalizedEmail(email);
  return getUsers().findIndex(u => authNormalizedEmail(u.email) === norm);
}

async function authResetPassword (email, newPassword) {
  const idx = authFindUserIndex(email);
  if (idx < 0) return { ok: false, error: 'E-mail não cadastrado neste navegador.' };

  const hashed = await medhubHashPassword(newPassword);
  const user = getUsers()[idx];
  const users = getUsers();
  users[idx] = {
    name: user.name,
    email: user.email,
    ...hashed
  };
  saveUsers(users);

  authClearClinicalData(email);
  localStorage.removeItem('session');
  if (typeof medhubClearCloudSession === 'function') medhubClearCloudSession();
  if (typeof medhubClearSessionCrypto === 'function') medhubClearSessionCrypto();

  return { ok: true };
}

async function handleResetPassword (e) {
  e.preventDefault();
  const email = e.target.email.value.trim();
  const pass = e.target.password.value;
  const confirmPass = e.target.passwordConfirm.value;
  const wipeOk = e.target.confirmWipe?.checked;

  if (!email) return alert('Informe o e-mail.');
  if (!authValidatePassword(pass)) return;
  if (pass !== confirmPass) return alert('As senhas não coincidem.');
  if (!wipeOk) return alert('Marque a confirmação sobre os dados criptografados.');

  if (authFindUserIndex(email) < 0) {
    return alert('E-mail não cadastrado neste navegador.');
  }

  if (!confirm(
    'Redefinir a senha apagará anamneses, pacientes e consultas criptografados neste dispositivo.\n\n' +
    'Não há recuperação por e-mail. Backup JSON só ajuda se você ainda souber a senha antiga.\n\n' +
    'Deseja continuar?'
  )) return;

  const result = await authResetPassword(email, pass);
  if (!result.ok) {
    alert(result.error || 'Não foi possível redefinir a senha.');
    return;
  }

  alert('Senha redefinida com sucesso. Faça login com a nova senha.');
  window.location.href = 'login.html';
}

function authValidatePassword (pass) {
  if (!pass || pass.length < 8) {
    alert('A senha deve ter no mínimo 8 caracteres.');
    return false;
  }
  return true;
}

async function handleRegister (e) {
  e.preventDefault();
  const name = e.target.name.value.trim();
  const email = e.target.email.value.trim();
  const pass = e.target.password.value;
  const termsOk = e.target.acceptTerms?.checked;
  const privacyOk = e.target.acceptPrivacy?.checked;

  if (!name || !email || !pass) return alert('Preencha todos os campos!');
  if (!termsOk || !privacyOk) return alert('Aceite o termo de uso e a política de privacidade.');
  if (!authValidatePassword(pass)) return;

  if (typeof medhubIsLocalDev === 'function' && !medhubIsLocalDev()) {
    const config = typeof medhubFetchAuthConfig === 'function'
      ? await medhubFetchAuthConfig(true)
      : { cloudEnabled: false };
    const billing = typeof medhubFetchBillingConfig === 'function'
      ? await medhubFetchBillingConfig()
      : { misconfigured: true };

    if (billing.misconfigured || config.misconfigured) {
      alert('Cadastro indisponível: configure Stripe e login na nuvem (KV + JWT) na Vercel antes de abrir ao público.');
      return;
    }
    if (!config.cloudEnabled) {
      alert('Login na nuvem não está ativo. Conta local só funciona abrindo os arquivos no computador (modo desenvolvimento).');
      return;
    }
  }

  const config = typeof medhubFetchAuthConfig === 'function'
    ? await medhubFetchAuthConfig()
    : { cloudEnabled: false };

  if (config.cloudEnabled && typeof medhubCloudRegister === 'function') {
    const result = await medhubCloudRegister(name, email, pass, termsOk, privacyOk);
    if (!result.ok) {
      if (result.code === 'subscription_required') {
        alert(result.error);
        window.location.href = 'index.html?email=' + encodeURIComponent(email) + '#planos';
        return;
      }
      alert(result.error || 'Erro ao cadastrar.');
      return;
    }

    medhubAcceptLegalLocal(email, config);
    await medhubAfterCloudAuth(result.data, pass);
    return;
  }

  const users = getUsers();
  if (users.find(u => authNormalizedEmail(u.email) === authNormalizedEmail(email))) {
    return alert('Usuário já existe!');
  }

  const hashed = await medhubHashPassword(pass);
  users.push({ name, email, ...hashed });
  saveUsers(users);
  medhubAcceptLegalLocal(email, config);
  localStorage.removeItem('session');
  medhubClearSessionCrypto();
  alert('Cadastro realizado! Faça login.');
  window.location.href = 'login.html';
}

async function handleLogin (e) {
  e.preventDefault();
  const email = e.target.email.value.trim();
  const pass = e.target.password.value;

  if (typeof medhubIsLocalDev === 'function' && !medhubIsLocalDev()) {
    const config = typeof medhubFetchAuthConfig === 'function'
      ? await medhubFetchAuthConfig(true)
      : { cloudEnabled: false };
    const billing = typeof medhubFetchBillingConfig === 'function'
      ? await medhubFetchBillingConfig()
      : { misconfigured: true };

    if (billing.misconfigured || config.misconfigured) {
      alert('Login indisponível: configure Stripe e login na nuvem (KV + JWT) na Vercel antes de abrir ao público.');
      return;
    }
    if (!config.cloudEnabled) {
      alert('Login na nuvem não está ativo. Conta local só funciona abrindo os arquivos no computador (modo desenvolvimento).');
      return;
    }
  }

  const config = typeof medhubFetchAuthConfig === 'function'
    ? await medhubFetchAuthConfig()
    : { cloudEnabled: false };

  if (config.cloudEnabled && typeof medhubCloudLogin === 'function') {
    const result = await medhubCloudLogin(email, pass);
    if (!result.ok) {
      alert(result.error || 'Credenciais inválidas.');
      return;
    }
    await medhubAfterCloudAuth(result.data, pass);
    return;
  }

  const userIdx = getUsers().findIndex(u => authNormalizedEmail(u.email) === authNormalizedEmail(email));
  if (userIdx < 0) return alert('Credenciais inválidas!');

  const user = getUsers()[userIdx];
  if (!(await medhubVerifyPassword(pass, user))) return alert('Credenciais inválidas!');

  const upgraded = await medhubUpgradeLegacyUser(user, pass);
  if (upgraded !== user) {
    const users = getUsers();
    users[userIdx] = upgraded;
    saveUsers(users);
  }

  medhubSetSession(upgraded);
  await medhubUnlockSession(pass, email);

  if (typeof medhubRequireSubscription === 'function') {
    const subOk = await medhubRequireSubscription({ name: upgraded.name, email: upgraded.email });
    if (!subOk) return;
  }

  if (medhubHasAcceptedLegal(email)) {
    authGoApp();
    return;
  }

  medhubShowLegalModal(() => {
    medhubAcceptLegalLocal(email, config);
    authGoApp();
  });
}

function redirectDashboardLegacy () {
  if (getSession()) authGoApp();
  else window.location.href = 'login.html';
}

function logout () {
  localStorage.removeItem('session');
  if (typeof medhubClearCloudSession === 'function') medhubClearCloudSession();
  medhubClearSessionCrypto();
  window.location.href = 'login.html';
}

async function requireAuthAsync () {
  const user = getSession();
  if (!user) {
    window.location.href = 'login.html';
    return null;
  }

  if (typeof medhubValidateCloudSession === 'function') {
    const config = await medhubFetchAuthConfig();
    if (config.cloudEnabled) {
      const valid = await medhubValidateCloudSession();
      if (!valid) {
        logout();
        return null;
      }
    }
  }

  return user;
}

