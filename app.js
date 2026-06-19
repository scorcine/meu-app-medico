function getSession () {
  const raw = localStorage.getItem('session');
  if (!raw) return null;

  try {
    const user = JSON.parse(raw);
    if (user && ('pass' in user || 'passHash' in user) && typeof medhubSetSession === 'function') {
      medhubSetSession(user);
      return { name: user.name, email: user.email };
    }
    return user;
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

  medhubInitComplianceShell();
  medhubRequireTerms(() => {
    const nameEl = document.getElementById('user-name');
    if (nameEl) nameEl.textContent = user.name;

    const greetingEl = document.getElementById('user-greeting');
    if (greetingEl) greetingEl.textContent = `Olá, ${user.name}`;
  });
}

function patchEmergenciaCacheGuard () {
  if (typeof showEmergenciaTopic !== 'function' || showEmergenciaTopic._cacheGuard) return;

  const orig = showEmergenciaTopic;
  const expected = { 'parada-cardio': 6, 'sca': 4, 'avc': 4, 'sepse': 3, 'trauma': 4, 'via-aerea': 3, 'reacoes-metabolicas': 4, 'obstetricia': 3, 'pediatrica': 3, 'toxicologia': 4, 'pressao-arritmias': 2, 'procedimentos': 3 };

  showEmergenciaTopic = function (topicId) {
    orig(topicId);
    const topic = typeof EMERGENCY_TOPICS !== 'undefined'
      ? EMERGENCY_TOPICS.find(t => t.id === topicId)
      : null;
    if (!expected[topicId] || topic?.protocols?.length) return;

    const contentEl = document.getElementById('emerg-topic-content');
    if (!contentEl) return;

    contentEl.innerHTML = `
      <p class="coming-soon"><strong>Arquivo desatualizado no navegador.</strong> Os protocolos de <em>${topic?.name || topicId}</em> já existem no projeto, mas o navegador carregou uma versão antiga de <code>emergency-guide.js</code>.</p>
      <ul>
        <li>Feche esta aba e abra de novo: <code>C:\\Users\\User\\Desktop\\meu-app-medico\\app.html</code></li>
        <li>Pressione <strong>Ctrl+F5</strong> (ou abra em aba anônima)</li>
        <li>No menu lateral deve aparecer: <strong>Build 2026.06.08 · AVC ✓</strong></li>
      </ul>
      <p class="emerg-note">Build esperado do guia: <strong>avc-fix-3</strong> (arquivo <code>emergency-guide.js</code>)</p>`;
  };

  showEmergenciaTopic._cacheGuard = true;
}

function initAccountPanel () {
  const panel = document.getElementById('account-panel');
  if (!panel) return;

  if (typeof medhubFetchAuthConfig !== 'function') {
    panel.hidden = true;
    return;
  }

  medhubFetchAuthConfig().then(config => {
    panel.hidden = !config.cloudEnabled;
  });
}

function initAppCore (user) {
  medhubInitComplianceShell();
  medhubRequireTerms(() => {
    medhubEnsureCryptoUnlock(() => {
      const nameEl = document.getElementById('user-name');
      if (nameEl) nameEl.textContent = user.name;

      const greetingEl = document.getElementById('user-greeting');
      if (greetingEl) greetingEl.textContent = `Olá, ${user.name}`;

      document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', () => showSection(link.dataset.section));
      });

      const logoHome = document.getElementById('medhub-logo-home');
      if (logoHome) {
        logoHome.addEventListener('click', e => {
          e.preventDefault();
          showSection('inicio');
        });
      }

      initCalcEssenciais();
      initGuiaEmergencia();
      initTratamentoHospitalar();
      initProntoSocorro();
      initAnamnese();
      initReceituario();
      initMedicacoes();
      initAnamneseReceituarioLink();
      initExames();
      initInterpretacaoExame();
      initPacientes();
      initConsultas();
      initFerramentas();
      initBackup();
      if (typeof initCloudSyncPanel === 'function') initCloudSyncPanel();
      if (typeof initUserProfilePage === 'function') initUserProfilePage();
      if (typeof initUserProfileHeader === 'function') initUserProfileHeader();
      initAccountPanel();
      patchEmergenciaCacheGuard();

      const hash = window.location.hash.replace('#', '');
      if (hash) showSection(hash);
    });
  });
}

function initApp () {
  requireAuthAsync().then(async user => {
    if (!user) return;

    if (typeof medhubEnsureProfileOnboarding === 'function') {
      const onboardingOk = await medhubEnsureProfileOnboarding();
      if (!onboardingOk) return;
    }

    if (typeof medhubRequireSubscription !== 'function') {
      initAppCore(user);
      return;
    }

    medhubRequireSubscription(user).then(ok => {
      if (ok) initAppCore(user);
    });
  });
}

function showSection (sectionId) {
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.classList.toggle('active', link.dataset.section === sectionId);
  });

  document.querySelectorAll('.content-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === `section-${sectionId}`);
  });

  showCalcCategories();
  if (typeof showEmergenciaCategories === 'function') showEmergenciaCategories();
  if (typeof showTratamentoHospitalarHome === 'function') showTratamentoHospitalarHome();
  if (typeof showProntoSocorroHome === 'function') showProntoSocorroHome();
  if (sectionId === 'receituario' && typeof rxOnSectionShow === 'function') rxOnSectionShow();
  if (sectionId === 'medicacoes' && typeof medShowList === 'function') medShowList();
  if (sectionId === 'exames' && typeof examesOnSectionShow === 'function') examesOnSectionShow();
  if (sectionId === 'interpretacao-exame' && typeof interpOnSectionShow === 'function') interpOnSectionShow();
  if (sectionId === 'pacientes' && typeof pacientesOnSectionShow === 'function') pacientesOnSectionShow();
  if (sectionId === 'consultas' && typeof consultasOnSectionShow === 'function') consultasOnSectionShow();
  if (sectionId === 'anamnese' && typeof anamneseOnSectionShow === 'function') anamneseOnSectionShow();
  if (sectionId === 'perfil' && typeof backupMaybePromptFirstUse === 'function') backupMaybePromptFirstUse();
  if (sectionId === 'calc-pediatrica' && typeof initPediatricCalcPanel === 'function') {
    initPediatricCalcPanel();
    if (typeof medhubRenderPedAppPromo === 'function') {
      medhubRenderPedAppPromo(document.getElementById('medhub-ped-scope-banner'), 'banner');
      medhubRenderPedAppPromo(document.getElementById('medhub-ped-app-footer'), 'footer');
    }
  }
}

function showCalcResultInBlock (form, html) {
  const resultEl = form.parentElement.querySelector('.calc-result');
  resultEl.innerHTML = html;
  resultEl.hidden = false;
}

const CALC_AREAS = [
  {
    id: 'avaliacao-geral',
    icon: '⚙️',
    name: 'Avaliação geral & estratificação de risco',
    calculators: ['charlson', 'news2', 'qsofa', 'sofa', 'apache2', 'saps3', 'lactate-clearance', 'curb65', 'wells', 'mews']  },
  {
    id: 'cardiologia',
    icon: '❤️',
    name: 'Cardiologia',
    calculators: [
      'chads-vasc', 'has-bled', 'grace', 'timi-ua', 'timi-stemi', 'killip',
      'score2', 'framingham', 'wells-tvp', 'wells', 'perc', 'heart',
      'nyha', 'qtc', 'ict'
    ]  },
  {
    id: 'pneumologia',
    icon: '🌬️',
    name: 'Pneumologia & Gasometrias',
    calculators: ['psi', 'curb65', 'mallampati', 'agem-pram', 'vef1', 'aa-pafi', 'rox']  },
  {
    id: 'nefrologia',
    icon: '💧',
    name: 'Nefrologia',
    calculators: ['cockcroft', 'egfr', 'fena', 'rifle-kdigo', 'anion-osm', 'fst']  },
  {
    id: 'hepatologia',
    icon: '🧪',
    name: 'Hepatologia & Gastro',
    calculators: ['child-pugh', 'meld', 'maddrey', 'gb-rockall', 'deritis', 'apri-fib4']  },
  {
    id: 'endocrino',
    icon: '🩸',
    name: 'Endócrino & Metabólico',
    calculators: ['homa', 'frax', 'dka', 'ukpds-ascvd', 'hba1c', 'osm-efetiva']  },
  {
    id: 'oncologia',
    icon: '🎗️',
    name: 'Oncologia',
    calculators: ['mascc', 'kps-ecog', 'apgar-cx', 'capra']  },
  {
    id: 'obstetricia',
    icon: '🤰',
    name: 'Obstetrícia & Ginecologia',
    calculators: ['bishop', 'hellp', 'magee-preeclampsia', 'naegele', 'rcog-vte', 'vbac']  },
  {
    id: 'pediatria',
    icon: '👶',
    name: 'Pediatria',
    calculators: ['silverman', 'downes', 'parkland-ped', 'pcr-ped', 'who-bmi', 'rochester-yos'],
    linkSection: 'calc-pediatrica'
  },
  {
    id: 'urgencia',
    icon: '🆘',
    name: 'Urgência & Trauma',
    calculators: ['gcs', 'rts', 'iss', 'nexus-cspine', 'pecarn', 'lrnec', 'alvarado-air', 'syncope-vpp']  },
  {
    id: 'hematologia',
    icon: '🩸',
    name: 'Hematologia & Trombose',
    calculators: ['padua-improve', '4ts', 'has-bled', 'khorana', 'chads-vasc']  },
  {
    id: 'farmacologia',
    icon: '💊',
    name: 'Farmacologia & Dose',
    calculators: [
      'dose-peso', 'dose-infusion-ped', 'insulina-correcao', 'opioide-conv',
      'gotejamento', 'clcr-dose', 'interacoes'
    ]  },
  {
    id: 'neurologia',
    icon: '🧠',
    name: 'Neurologia',
    calculators: ['nihss', 'abcd2', 'chads-vasc', 'hunt-hess', 'mrs']  },
  {
    id: 'dermatologia',
    icon: '🩹',
    name: 'Dermatologia & Queimaduras',
    calculators: ['regra-9', 'scorten']  },
  {
    id: 'ortopedia',
    icon: '🦴',
    name: 'Ortopedia & Reumatologia',
    calculators: ['frax', 'ottawa', 'hip-oculta']  },
  {
    id: 'extras',
    icon: '📐',
    name: 'Extras de conveniência',
    calculators: [
      'imc', 'pam', 'map-inv', 'conv-medidas', 'datas', 'superficie',
      'temp', 'lab-conv', 'peso-ideal', 'fio2'
    ]  }
];

const CALC_FORMS = {
  'dose-peso': {
    title: 'Dose por peso',
    html: `
      <label>Peso (kg)</label>
      <input name="peso" type="number" step="0.1" min="0.1" required>
      <label>Dose (mg/kg)</label>
      <input name="doseKg" type="number" step="0.01" min="0.01" required>
      <label>Concentração (mg/mL) — opcional</label>
      <input name="conc" type="number" step="0.1" min="0">
    `,
    calculate (form) {
      const peso = parseFloat(form.peso.value);
      const doseKg = parseFloat(form.doseKg.value);
      const conc = parseFloat(form.conc.value);
      if (!peso || !doseKg) return alert('Informe peso e dose mg/kg.');
      const totalMg = peso * doseKg;
      let html = `<p><strong>Dose total:</strong> ${totalMg.toFixed(2)} mg</p>`;
      if (conc > 0) html += `<p><strong>Volume:</strong> ${(totalMg / conc).toFixed(2)} mL</p>`;
      return html;
    }
  },
  imc: {
    title: 'IMC',
    html: `
      <label>Peso (kg)</label>
      <input name="peso" type="number" step="0.1" min="0.1" required>
      <label>Altura (cm)</label>
      <input name="altura" type="number" step="0.1" min="30" required>
    `,
    calculate (form) {
      const peso = parseFloat(form.peso.value);
      const alturaCm = parseFloat(form.altura.value);
      if (!peso || !alturaCm) return alert('Informe peso e altura.');
      const imc = peso / Math.pow(alturaCm / 100, 2);
      let classificacao = 'Obesidade';
      if (imc < 18.5) classificacao = 'Baixo peso';
      else if (imc < 25) classificacao = 'Peso normal';
      else if (imc < 30) classificacao = 'Sobrepeso';
      return `<p><strong>IMC:</strong> ${imc.toFixed(1)} kg/m²</p>
              <p><strong>Classificação:</strong> ${classificacao}</p>`;
    }
  },
  pam: {
    title: 'Pressão arterial média (PAM)',
    html: `
      <label>PAS (mmHg)</label>
      <input name="pas" type="number" step="1" min="1" required>
      <label>PAD (mmHg)</label>
      <input name="pad" type="number" step="1" min="0" required>
    `,
    calculate (form) {
      const pas = parseFloat(form.pas.value);
      const pad = parseFloat(form.pad.value);
      if (!pas || pad < 0) return alert('Informe PAS e PAD.');
      return `<p><strong>PAM:</strong> ${((pas + 2 * pad) / 3).toFixed(1)} mmHg</p>`;
    }
  },
  creatinina: {
    title: 'Clearance de creatinina (Cockcroft-Gault)',
    html: `
      <label>Idade (anos)</label>
      <input name="idade" type="number" step="1" min="1" required>
      <label>Peso (kg)</label>
      <input name="peso" type="number" step="0.1" min="0.1" required>
      <label>Creatinina (mg/dL)</label>
      <input name="creat" type="number" step="0.01" min="0.01" required>
      <label>Sexo</label>
      <select name="sexo" required>
        <option value="M">Masculino</option>
        <option value="F">Feminino</option>
      </select>
    `,
    calculate (form) {
      const idade = parseFloat(form.idade.value);
      const peso = parseFloat(form.peso.value);
      const creat = parseFloat(form.creat.value);
      if (!idade || !peso || !creat) return alert('Preencha todos os campos.');
      let clcr = ((140 - idade) * peso) / (72 * creat);
      if (form.sexo.value === 'F') clcr *= 0.85;
      return `<p><strong>Clearance:</strong> ${clcr.toFixed(1)} mL/min</p>`;
    }
  },
  'anion-gap': {
    title: 'Anion gap',
    html: `
      <label>Sódio (mEq/L)</label>
      <input name="na" type="number" step="0.1" required>
      <label>Cloro (mEq/L)</label>
      <input name="cl" type="number" step="0.1" required>
      <label>Bicarbonato (mEq/L)</label>
      <input name="hco3" type="number" step="0.1" required>
    `,
    calculate (form) {
      const na = parseFloat(form.na.value);
      const cl = parseFloat(form.cl.value);
      const hco3 = parseFloat(form.hco3.value);
      if (!na || !cl || !hco3) return alert('Preencha todos os eletrólitos.');
      const gap = na - (cl + hco3);
      const interp = gap > 12
        ? 'Elevado — investigar acidose metabólica com AG aumentado'
        : 'Dentro do esperado (≤ 12 mEq/L)';
      return `<p><strong>Anion gap:</strong> ${gap.toFixed(1)} mEq/L</p>
              <p><strong>Interpretação:</strong> ${interp}</p>`;
    }
  }
};

if (typeof CALC_RISCO !== 'undefined') {
  Object.assign(CALC_FORMS, CALC_RISCO);
}

if (typeof CALC_CARDIO !== 'undefined') {
  Object.assign(CALC_FORMS, CALC_CARDIO);
}

if (typeof CALC_PNEUMO !== 'undefined') {
  Object.assign(CALC_FORMS, CALC_PNEUMO);
}

if (typeof CALC_NEFRO !== 'undefined') {
  Object.assign(CALC_FORMS, CALC_NEFRO);
}

if (typeof CALC_HEPATO !== 'undefined') {
  Object.assign(CALC_FORMS, CALC_HEPATO);
}

if (typeof CALC_ENDOCRINO !== 'undefined') {
  Object.assign(CALC_FORMS, CALC_ENDOCRINO);
}

if (typeof CALC_ONCO !== 'undefined') {
  Object.assign(CALC_FORMS, CALC_ONCO);
}

if (typeof CALC_OBSTETRICIA !== 'undefined') {
  Object.assign(CALC_FORMS, CALC_OBSTETRICIA);
}

if (typeof CALC_PEDIATRIA !== 'undefined') {
  Object.assign(CALC_FORMS, CALC_PEDIATRIA);
}

if (typeof CALC_URGENCIA !== 'undefined') {
  Object.assign(CALC_FORMS, CALC_URGENCIA);
}

if (typeof CALC_HEMATO !== 'undefined') {
  Object.assign(CALC_FORMS, CALC_HEMATO);
}

if (typeof CALC_FARMA !== 'undefined') {
  Object.assign(CALC_FORMS, CALC_FARMA);
}

if (typeof CALC_NEURO !== 'undefined') {
  Object.assign(CALC_FORMS, CALC_NEURO);
}

if (typeof CALC_DERMA !== 'undefined') {
  Object.assign(CALC_FORMS, CALC_DERMA);
}

if (typeof CALC_ORTO !== 'undefined') {
  Object.assign(CALC_FORMS, CALC_ORTO);
}

if (typeof CALC_EXTRAS !== 'undefined') {
  Object.assign(CALC_FORMS, CALC_EXTRAS);
}

let currentCalcAreaId = null;

const CALC_META = {
  charlson: { icon: '📋' },
  news2: { icon: '🔔' },
  qsofa: { icon: '🦠' },
  sofa: { icon: '🫀' },
  apache2: { icon: '🏥' },
  saps3: { icon: '📊' },
  'lactate-clearance': { icon: '🧪' },
  curb65: { icon: '🫁' },
  wells: { icon: '🩸' },
  mews: { icon: '📈' },
  'chads-vasc': { icon: '💊' },
  'has-bled': { icon: '🩸' },
  grace: { icon: '📉' },
  'timi-ua': { icon: '💔' },
  'timi-stemi': { icon: '🚨' },
  killip: { icon: '🫁' },
  score2: { icon: '📊' },
  framingham: { icon: '❤️' },
  'wells-tvp': { icon: '🦵' },
  perc: { icon: '✅' },
  heart: { icon: '🩺' },
  nyha: { icon: '🏃' },
  qtc: { icon: '⚡' },
  ict: { icon: '🩻' },
  psi: { icon: '🫁' },
  mallampati: { icon: '👅' },
  'agem-pram': { icon: '🌬️' },
  vef1: { icon: '📏' },
  'aa-pafi': { icon: '💨' },
  rox: { icon: '🔥' },
  cockcroft: { icon: '💧' },
  egfr: { icon: '📊' },
  fena: { icon: '🧂' },
  'rifle-kdigo': { icon: '🏥' },
  'anion-osm': { icon: '🧪' },
  fst: { icon: '💉' },
  'child-pugh': { icon: '📋' },
  meld: { icon: '🫀' },
  maddrey: { icon: '🍺' },
  'gb-rockall': { icon: '🩸' },
  deritis: { icon: '📈' },
  'apri-fib4': { icon: '🔬' },
  homa: { icon: '📉' },
  frax: { icon: '🦴' },
  dka: { icon: '⚠️' },
  'ukpds-ascvd': { icon: '❤️' },
  hba1c: { icon: '🔄' },
  'osm-efetiva': { icon: '💧' },
  mascc: { icon: '🌡️' },
  'kps-ecog': { icon: '🏃' },
  'apgar-cx': { icon: '🔪' },
  capra: { icon: '🎯' },
  bishop: { icon: '📏' },
  hellp: { icon: '🩸' },
  'magee-preeclampsia': { icon: '⚠️' },
  naegele: { icon: '📅' },
  'rcog-vte': { icon: '🦵' },
  vbac: { icon: '👶' },
  silverman: { icon: '🫁' },
  downes: { icon: '💨' },
  'parkland-ped': { icon: '🔥' },
  'pcr-ped': { icon: '💉' },
  'who-bmi': { icon: '📊' },
  'rochester-yos': { icon: '🌡️' },
  gcs: { icon: '🧠' },
  rts: { icon: '🚑' },
  iss: { icon: '💥' },
  'nexus-cspine': { icon: '🦴' },
  pecarn: { icon: '👶' },
  lrnec: { icon: '🔥' },
  'alvarado-air': { icon: '🩺' },
  'syncope-vpp': { icon: '💫' },
  'padua-improve': { icon: '🦵' },
  '4ts': { icon: '🩸' },
  khorana: { icon: '🎗️' },
  'dose-infusion-ped': { icon: '💉' },
  'insulina-correcao': { icon: '🩸' },
  'opioide-conv': { icon: '💊' },
  gotejamento: { icon: '💧' },
  'clcr-dose': { icon: '🫘' },
  interacoes: { icon: '⚠️' },
  nihss: { icon: '🧠' },
  abcd2: { icon: '⚡' },
  'hunt-hess': { icon: '🩸' },
  mrs: { icon: '📊' },
  'regra-9': { icon: '🔥' },
  scorten: { icon: '⚠️' },
  ottawa: { icon: '🦶' },
  'hip-oculta': { icon: '🦴' },
  'conv-medidas': { icon: '📐' },
  datas: { icon: '📅' },
  superficie: { icon: '📏' },
  temp: { icon: '🌡️' },
  'lab-conv': { icon: '🧪' },
  'peso-ideal': { icon: '⚖️' },
  fio2: { icon: '💨' },
  'map-inv': { icon: '❤️' },
  'dose-peso': { icon: '💊' },
  imc: { icon: '⚖️' },
  pam: { icon: '❤️' },
  creatinina: { icon: '💧' },
  'anion-gap': { icon: '🧪' }
};

function getCalcIcon (calcId) {
  return CALC_META[calcId]?.icon || '🔢';
}

function initCalcEssenciais () {
  const grid = document.getElementById('calc-category-grid');
  if (!grid) return;

  grid.innerHTML = CALC_AREAS.map(area => `
    <button type="button" class="calc-category-btn" data-area="${area.id}">
      <span class="calc-category-icon">${area.icon}</span>
      <span class="calc-category-name">${area.name}</span>
    </button>
  `).join('');

  grid.querySelectorAll('.calc-category-btn').forEach(btn => {
    btn.addEventListener('click', () => showCalcArea(btn.dataset.area));
  });

  const content = document.getElementById('calc-area-content');
  if (content) {
    content.addEventListener('submit', handleCalcFormSubmit);
  }
}

function showCalcCategories () {
  const categoriesView = document.getElementById('calc-categories-view');
  const areaView = document.getElementById('calc-area-view');
  if (!categoriesView || !areaView) return;

  currentCalcAreaId = null;
  categoriesView.hidden = false;
  areaView.hidden = true;
}

function showCalcArea (areaId) {
  const area = CALC_AREAS.find(a => a.id === areaId);
  if (!area) return;

  currentCalcAreaId = areaId;
  document.getElementById('calc-categories-view').hidden = true;
  document.getElementById('calc-area-view').hidden = false;
  document.getElementById('calc-area-title').textContent = `${area.icon} ${area.name}`;

  const backBtn = document.getElementById('calc-area-back');
  backBtn.textContent = '← Voltar às áreas';
  backBtn.onclick = showCalcCategories;

  let html = '';

  if (area.calculators.length) {
    html += '<p class="muted">Escolha a calculadora que deseja usar:</p>';
    html += '<div class="calc-category-grid">';
    area.calculators.forEach(calcId => {
      const calc = CALC_FORMS[calcId];
      if (!calc) return;
      html += `
        <button type="button" class="calc-category-btn" data-calc-tool="${calcId}">
          <span class="calc-category-icon">${getCalcIcon(calcId)}</span>
          <span class="calc-category-name">${calc.title}</span>
        </button>`;
    });
    html += '</div>';
  }

  if (area.linkSection) {
    html += `
      <div class="calc-link-box">
        <p class="muted">Ferramenta disponível no menu lateral:</p>
        <button type="button" class="btn" data-link-section="${area.linkSection}">Abrir calculadora pediátrica</button>
      </div>`;
  }

  if (area.comingSoon?.length) {
    html += `
      <div class="calc-soon-block">
        <h3>Em breve</h3>
        <ul class="calc-soon-list">
          ${area.comingSoon.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>`;
  }

  if (!area.calculators.length && !area.linkSection && !(area.comingSoon?.length)) {
    html += '<p class="coming-soon">Calculadoras desta área em construção.</p>';
  }

  const content = document.getElementById('calc-area-content');
  content.innerHTML = html;

  content.querySelectorAll('[data-calc-tool]').forEach(btn => {
    btn.addEventListener('click', () => showCalcTool(btn.dataset.calcTool));
  });

  content.querySelectorAll('[data-link-section]').forEach(btn => {
    btn.addEventListener('click', () => showSection(btn.dataset.linkSection));
  });
}

function showCalcTool (calcId) {
  const calc = CALC_FORMS[calcId];
  if (!calc) return;

  const backBtn = document.getElementById('calc-area-back');
  backBtn.textContent = '← Voltar às calculadoras';
  backBtn.onclick = () => showCalcArea(currentCalcAreaId);

  document.getElementById('calc-area-title').textContent =
    `${getCalcIcon(calcId)} ${calc.title}`;

  document.getElementById('calc-area-content').innerHTML = `
    <div class="calc-block calc-block-single">
      <form class="calc-form" data-calc="${calcId}">
        ${calc.html}
        <button type="submit">Calcular</button>
      </form>
      <div class="calc-result" hidden></div>
    </div>`;

  if (typeof calc.onRender === 'function') {
    const form = document.querySelector(`#calc-area-content form[data-calc="${calcId}"]`);
    calc.onRender(form);
  }
}

function handleCalcFormSubmit (e) {
  const form = e.target;
  if (!form.classList.contains('calc-form')) return;
  e.preventDefault();

  const calcId = form.dataset.calc;
  const calc = CALC_FORMS[calcId];
  if (!calc) return;

  const html = calc.calculate(form);
  if (typeof html === 'string') showCalcResultInBlock(form, html);
}

function redirectLoggedFromHome () {
  if (getSession()) window.location.href = 'app.html';
}
