/* Autenticação local — senhas com hash PBKDF2, sessão sem credenciais */

function getUsers () {
  return JSON.parse(localStorage.getItem('users') || '[]');
}

function saveUsers (arr) {
  localStorage.setItem('users', JSON.stringify(arr));
}

function redirectIfLogged () {
  if (getSession()) window.location.href = 'dashboard.html';
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

  if (!name || !email || !pass) return alert('Preencha todos os campos!');
  if (!termsOk) return alert('Aceite o termo de uso para criar a conta.');
  if (!authValidatePassword(pass)) return;

  const users = getUsers();
  if (users.find(u => u.email === email)) return alert('Usuário já existe!');

  const hashed = await medhubHashPassword(pass);
  users.push({ name, email, ...hashed });
  saveUsers(users);
  medhubAcceptTerms(email);
  localStorage.removeItem('session');
  medhubClearSessionCrypto();
  alert('Cadastro realizado! Faça login.');
  window.location.href = 'login.html';
}

async function handleLogin (e) {
  e.preventDefault();
  const email = e.target.email.value.trim();
  const pass = e.target.password.value;
  const userIdx = getUsers().findIndex(u => u.email === email);
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

  const goDashboard = () => { window.location.href = 'dashboard.html'; };

  if (medhubHasAcceptedTerms(email)) {
    goDashboard();
    return;
  }

  medhubShowTermsModal(() => {
    medhubAcceptTerms(email);
    goDashboard();
  });
}

function logout () {
  localStorage.removeItem('session');
  medhubClearSessionCrypto();
  window.location.href = 'login.html';
}
