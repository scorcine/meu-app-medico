/* Login na nuvem — JWT + APIs Vercel (fallback para auth local) */

const MEDHUB_TOKEN_KEY = 'medhub_auth_token';
let _authConfigCache = null;

async function medhubFetchAuthConfig (force) {
  if (_authConfigCache && !force) return _authConfigCache;

  if (window.location.protocol === 'file:') {
    _authConfigCache = { cloudEnabled: false };
    return _authConfigCache;
  }

  try {
    const res = await fetch('/api/auth/config');
    if (!res.ok) {
      _authConfigCache = { cloudEnabled: false };
      return _authConfigCache;
    }
    _authConfigCache = await res.json();
    return _authConfigCache;
  } catch {
    _authConfigCache = { cloudEnabled: false };
    return _authConfigCache;
  }
}

function medhubGetAuthToken () {
  return localStorage.getItem(MEDHUB_TOKEN_KEY) || '';
}

function medhubSetAuthToken (token) {
  if (token) localStorage.setItem(MEDHUB_TOKEN_KEY, token);
  else localStorage.removeItem(MEDHUB_TOKEN_KEY);
}

function medhubAuthHeaders () {
  const token = medhubGetAuthToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = 'Bearer ' + token;
  return headers;
}

function medhubCacheLocalUser (user, passHash, passSalt) {
  if (typeof getUsers !== 'function' || typeof saveUsers !== 'function') return;
  const email = authNormalizedEmail(user.email);
  const users = getUsers().filter(u => authNormalizedEmail(u.email) !== email);
  users.push({
    name: user.name,
    email: user.email,
    passHash,
    passSalt,
    passVersion: 1
  });
  saveUsers(users);
}

async function medhubCloudChangePassword (currentPassword, newPassword) {
  const res = await fetch('/api/auth/me', {
    method: 'POST',
    headers: medhubAuthHeaders(),
    body: JSON.stringify({
      action: 'changePassword',
      currentPassword,
      newPassword
    })
  });
  const data = await res.json();
  if (!res.ok) {
    return { ok: false, error: data.error || 'Erro ao alterar senha.' };
  }
  return { ok: true };
}

async function medhubRequestPasswordReset (email) {
  const res = await fetch('/api/auth/verify-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'requestReset', email: authNormalizedEmail(email) })
  });
  const data = await res.json();
  if (!res.ok) {
    return { ok: false, error: data.error || 'Erro ao enviar e-mail.', code: data.code };
  }
  return { ok: true, message: data.message };
}

async function medhubConfirmPasswordReset (token, newPassword) {
  const res = await fetch('/api/auth/verify-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'confirmReset', token, newPassword })
  });
  const data = await res.json();
  if (!res.ok) {
    return { ok: false, error: data.error || 'Erro ao redefinir senha.', code: data.code };
  }
  return { ok: true, message: data.message, clinicalDataReset: data.clinicalDataReset };
}

async function medhubCloudRegister (name, email, password, acceptTerms, acceptPrivacy, checkoutSessionId) {
  const payload = {
    name,
    email: authNormalizedEmail(email),
    password,
    acceptTerms,
    acceptPrivacy
  };
  if (checkoutSessionId) payload.checkoutSessionId = checkoutSessionId;

  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) {
    return {
      ok: false,
      error: data.error || 'Erro ao cadastrar',
      code: data.code,
      expectedEmail: data.expectedEmail
    };
  }
  return { ok: true, data };
}

async function medhubCloudLogin (email, password) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: authNormalizedEmail(email),
      password
    })
  });
  const data = await res.json();
  if (!res.ok) {
    return { ok: false, error: data.error || 'Credenciais inválidas.' };
  }
  return { ok: true, data };
}

async function medhubCloudMe () {
  const token = medhubGetAuthToken();
  if (!token) return null;

  try {
    const res = await fetch('/api/auth/me', { headers: medhubAuthHeaders() });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function medhubValidateCloudSession () {
  const config = await medhubFetchAuthConfig();
  if (!config.cloudEnabled) return true;

  const token = medhubGetAuthToken();
  if (!token) return false;

  const me = await medhubCloudMe();
  return !!me?.user;
}

async function medhubCloudAcceptLegal () {
  const res = await fetch('/api/auth/accept-legal', {
    method: 'POST',
    headers: medhubAuthHeaders(),
    body: JSON.stringify({ acceptTerms: true, acceptPrivacy: true })
  });
  if (!res.ok) return false;
  const data = await res.json();
  return !!data.user;
}

async function medhubCloudVerifyPassword (email, password) {
  const res = await fetch('/api/auth/verify-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: authNormalizedEmail(email),
      password
    })
  });
  if (!res.ok) return false;
  const data = await res.json();
  return !!data.ok;
}

function medhubApplyCloudSession (loginData, password) {
  medhubSetAuthToken(loginData.token);
  medhubSetSession(loginData.user);
  if (password && typeof medhubHashPassword === 'function') {
    medhubHashPassword(password).then(hashed => {
      medhubCacheLocalUser(loginData.user, hashed.passHash, hashed.passSalt);
    });
  }
}

function medhubClearCloudSession () {
  medhubSetAuthToken('');
}

function medhubSubscriptionBlocked (subscription) {
  if (!subscription) return false;
  if (subscription.devBypass) return false;
  if (subscription.misconfigured) return true;
  return !subscription.active;
}

function medhubRedirectPricing (email) {
  const q = new URLSearchParams({ reason: 'subscription', email: email || '' });
  window.location.href = 'index.html?' + q.toString() + '#planos';
}

async function medhubAfterCloudAuth (loginData, password) {
  medhubApplyCloudSession(loginData, password);
  await medhubUnlockSession(password, loginData.user.email);

  if (typeof medhubCloudSyncAfterUnlock === 'function') {
    await medhubCloudSyncAfterUnlock();
  }

  if (medhubSubscriptionBlocked(loginData.subscription)) {
    medhubClearCloudSession();
    localStorage.removeItem('session');
    medhubClearSessionCrypto();
    medhubRedirectPricing(loginData.user.email);
    return false;
  }

  const config = await medhubFetchAuthConfig();
  const legal = loginData.user?.legal;
  const termsOk = legal?.termsVersion === config.termsVersion;
  const privacyOk = legal?.privacyVersion === config.privacyVersion;

  if (termsOk && privacyOk) {
    medhubAcceptLegalLocal(loginData.user.email, config);
    authGoApp();
    return true;
  }

  medhubShowLegalModal(async () => {
    const cloudOk = await medhubCloudAcceptLegal();
    if (cloudOk) {
      medhubAcceptLegalLocal(loginData.user.email, config);
    } else {
      medhubAcceptLegalLocal(loginData.user.email, config);
    }
    authGoApp();
  });

  return true;
}
