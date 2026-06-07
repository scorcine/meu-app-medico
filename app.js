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

function calcPediatrica (e) {
  e.preventDefault();

  const peso = parseFloat(document.getElementById('ped-peso').value);
  const doseKg = parseFloat(document.getElementById('ped-dose-kg').value);
  const conc = parseFloat(document.getElementById('ped-conc').value);
  const resultEl = document.getElementById('ped-resultado');

  if (!peso || peso <= 0) return alert('Informe o peso em kg.');
  if (!doseKg || doseKg <= 0) return alert('Informe a dose em mg/kg.');

  const totalMg = peso * doseKg;
  let fluid24h;

  if (peso <= 10) fluid24h = peso * 100;
  else if (peso <= 20) fluid24h = 1000 + (peso - 10) * 50;
  else fluid24h = 1500 + (peso - 20) * 20;

  let html = `<p><strong>Dose total:</strong> ${totalMg.toFixed(2)} mg</p>`;

  if (conc > 0) {
    html += `<p><strong>Volume:</strong> ${(totalMg / conc).toFixed(2)} mL</p>`;
  }

  html += `<p><strong>Hidratação manutenção (24h):</strong> ${Math.round(fluid24h)} mL</p>`;
  html += `<p><strong>Manutenção por hora:</strong> ${(fluid24h / 24).toFixed(1)} mL/h</p>`;

  resultEl.innerHTML = html;
  resultEl.hidden = false;
}

function redirectLoggedFromHome () {
  if (getSession()) window.location.href = 'dashboard.html';
}
