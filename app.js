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

function showCalcResult (id, html) {
  const el = document.getElementById(id);
  el.innerHTML = html;
  el.hidden = false;
}

function calcDosePeso (e) {
  e.preventDefault();
  const peso = parseFloat(document.getElementById('dose-peso').value);
  const doseKg = parseFloat(document.getElementById('dose-mgkg').value);
  const conc = parseFloat(document.getElementById('dose-conc').value);

  if (!peso || !doseKg) return alert('Informe peso e dose mg/kg.');

  const totalMg = peso * doseKg;
  let html = `<p><strong>Dose total:</strong> ${totalMg.toFixed(2)} mg</p>`;
  if (conc > 0) html += `<p><strong>Volume:</strong> ${(totalMg / conc).toFixed(2)} mL</p>`;

  showCalcResult('dose-resultado', html);
}

function calcImc (e) {
  e.preventDefault();
  const peso = parseFloat(document.getElementById('imc-peso').value);
  const alturaCm = parseFloat(document.getElementById('imc-altura').value);

  if (!peso || !alturaCm) return alert('Informe peso e altura.');

  const alturaM = alturaCm / 100;
  const imc = peso / (alturaM * alturaM);
  let classificacao = 'Obesidade';

  if (imc < 18.5) classificacao = 'Baixo peso';
  else if (imc < 25) classificacao = 'Peso normal';
  else if (imc < 30) classificacao = 'Sobrepeso';

  showCalcResult('imc-resultado',
    `<p><strong>IMC:</strong> ${imc.toFixed(1)} kg/m²</p>
     <p><strong>Classificação:</strong> ${classificacao}</p>`);
}

function calcPam (e) {
  e.preventDefault();
  const pas = parseFloat(document.getElementById('pam-pas').value);
  const pad = parseFloat(document.getElementById('pam-pad').value);

  if (!pas || pad === undefined || pad < 0) return alert('Informe PAS e PAD.');

  const pam = (pas + 2 * pad) / 3;

  showCalcResult('pam-resultado',
    `<p><strong>PAM:</strong> ${pam.toFixed(1)} mmHg</p>`);
}

function calcCreatinina (e) {
  e.preventDefault();
  const idade = parseFloat(document.getElementById('cr-idade').value);
  const peso = parseFloat(document.getElementById('cr-peso').value);
  const creat = parseFloat(document.getElementById('cr-valor').value);
  const sexo = document.getElementById('cr-sexo').value;

  if (!idade || !peso || !creat) return alert('Preencha todos os campos.');

  let clcr = ((140 - idade) * peso) / (72 * creat);
  if (sexo === 'F') clcr *= 0.85;

  showCalcResult('cr-resultado',
    `<p><strong>Clearance (Cockcroft-Gault):</strong> ${clcr.toFixed(1)} mL/min</p>`);
}

function calcAnionGap (e) {
  e.preventDefault();
  const na = parseFloat(document.getElementById('ag-na').value);
  const cl = parseFloat(document.getElementById('ag-cl').value);
  const hco3 = parseFloat(document.getElementById('ag-hco3').value);

  if (!na || !cl || !hco3) return alert('Preencha todos os eletrólitos.');

  const gap = na - (cl + hco3);
  let interpretacao = gap > 12 ? 'Elevado — investigar acidose metabólica com AG aumentado' : 'Dentro do esperado (≤ 12 mEq/L)';

  showCalcResult('ag-resultado',
    `<p><strong>Anion gap:</strong> ${gap.toFixed(1)} mEq/L</p>
     <p><strong>Interpretação:</strong> ${interpretacao}</p>`);
}

function redirectLoggedFromHome () {
  if (getSession()) window.location.href = 'dashboard.html';
}
