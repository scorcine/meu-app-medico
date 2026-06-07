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

  const greetingEl = document.getElementById('user-greeting');
  if (greetingEl) greetingEl.textContent = `Olá, ${user.name}`;

  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', () => showSection(link.dataset.section));
  });

  const hash = window.location.hash.replace('#', '');
  if (hash) showSection(hash);
}

function showSection (sectionId) {
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.classList.toggle('active', link.dataset.section === sectionId);
  });

  document.querySelectorAll('.content-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === `section-${sectionId}`);
  });
}

function redirectLoggedFromHome () {
  if (getSession()) window.location.href = 'dashboard.html';
}
