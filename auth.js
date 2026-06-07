/* ========= auth.js =========
   Autenticação local usando localStorage
   – getUsers / saveUsers
   – cadastro, login, logout
   – helpers de redirecionamento
   ========================== */

/* ---------- helpers ---------- */
function getUsers () {
  return JSON.parse(localStorage.getItem('users') || '[]');
}
function saveUsers (arr) {
  localStorage.setItem('users', JSON.stringify(arr));
}
function redirectIfLogged () {
  if (getSession()) window.location.href = 'dashboard.html';
}

/* ---------- cadastro ---------- */
function handleRegister (e) {
  e.preventDefault();
  const name  = e.target.name.value.trim();
  const email = e.target.email.value.trim();
  const pass  = e.target.password.value;
  if (!name || !email || !pass) return alert('Preencha todos os campos!');
  const users = getUsers();
  if (users.find(u => u.email === email)) return alert('Usuário já existe!');
  users.push({ name, email, pass });
  saveUsers(users);
  localStorage.removeItem('session');
  alert('Cadastro realizado! Faça login.');
  window.location.href = 'login.html';
}

/* ---------- login ---------- */
function handleLogin (e) {
  e.preventDefault();
  const email = e.target.email.value.trim();
  const pass  = e.target.password.value;
  const user  = getUsers().find(u => u.email === email && u.pass === pass);
  if (!user) return alert('Credenciais inválidas!');
  localStorage.setItem('session', JSON.stringify(user));
  window.location.href = 'dashboard.html';
}

/* ---------- logout ---------- */
function logout () {
  localStorage.removeItem('session');
  window.location.href = 'login.html';
}