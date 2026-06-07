function getSession () {
  const raw = localStorage.getItem('session');
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem('session');
    return null;
  }
}

function requireAuth () {
  const user = getSession();
  if (!user) {
    window.location.href = 'login.html';
    return null;
  }
  return user;
}

function initDashboard () {
  const user = requireAuth();
  if (!user) return;

  const nameEl = document.getElementById('user-name');
  if (nameEl) nameEl.textContent = user.name;

  const greetingEl = document.getElementById('user-greeting');
  if (greetingEl) greetingEl.textContent = `Olá, ${user.name}`;
}

function initApp () {
  const user = requireAuth();
  if (!user) return;

  const nameEl = document.getElementById('user-name');
  if (nameEl) nameEl.textContent = user.name;
}

function redirectLoggedFromHome () {
  if (getSession()) window.location.href = 'dashboard.html';
}
