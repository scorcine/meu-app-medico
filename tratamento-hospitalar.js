/* Tratamento hospitalar — condições com medicação IM/EV e navegação */

const MEDHUB_TH_BUILD = 'th-expand-v1';

const TH_CONTENT = Object.assign(
  {},
  typeof TH_CONTENT_1 !== 'undefined' ? TH_CONTENT_1 : {},
  typeof TH_CONTENT_2 !== 'undefined' ? TH_CONTENT_2 : {}
);

const TH_CONDITIONS = [
  { id: 'cefaleia', name: 'Cefaleia (tensional, enxaqueca)', icon: '🤕' },
  { id: 'ansiedade-panico', name: 'Crise de ansiedade / pânico', icon: '😰' },
  { id: 'anafilaxia', name: 'Anafilaxia / urticária grave', icon: '🐝' },
  { id: 'anemia-falciforme', name: 'Anemia falciforme — crise álgica', icon: '🩸' },
  { id: 'abscesso-cutaneo', name: 'Abscesso cutâneo pós-drenagem', icon: '💉' },
  { id: 'abstinencia-alcool', name: 'Abstinência alcoólica / delirium tremens', icon: '🍺' },
  { id: 'agitacao-psiquiatrica', name: 'Agitação psicomotora / delirium', icon: '🧠' },
  { id: 'apendicite', name: 'Apendicite aguda (pré-operatório)', icon: '🩹' },
  { id: 'artralgia-dor-msk', name: 'Artralgia / dor musculoesquelética', icon: '🦴' },
  { id: 'asma-broncoespasmo', name: 'Asma / broncoespasmo', icon: '🌬️' },
  { id: 'celulite-erisipela', name: 'Celulite / erisipela', icon: '🦠' },
  { id: 'cetoacidose-dm', name: 'Cetoacidose diabética', icon: '🩸' },
  { id: 'colica-renal', name: 'Cólica renal', icon: '💎' },
  { id: 'colecistite', name: 'Colecistite aguda', icon: '🫃' },
  { id: 'convulsao-eme', name: 'Crise convulsiva / EME', icon: '⚡' },
  { id: 'crise-hipertensiva', name: 'Crise hipertensiva', icon: '🔴' },
  { id: 'crise-tireotoxica', name: 'Crise tireotóxica / tempestade tiroidiana', icon: '🦋' },
  { id: 'dengue-dor', name: 'Dengue — analgesia hospitalar', icon: '🦟' },
  { id: 'diverticulite', name: 'Diverticulite aguda complicada', icon: '🩹' },
  { id: 'disturbios-eletroliticos', name: 'Distúrbios hidroeletrolíticos sintomáticos', icon: '⚗️' },
  { id: 'dor-abdominal', name: 'Dor abdominal aguda', icon: '🫃' },
  { id: 'dor-toracica', name: 'Dor torácica / SCA suspeita', icon: '❤️‍🔥' },
  { id: 'dpoc-exacerbada', name: 'DPOC exacerbada', icon: '🫁' },
  { id: 'edema-pulmao-ic', name: 'Edema agudo de pulmão / IC descompensada', icon: '🫁' },
  { id: 'flebite', name: 'Flebite / tromboflebite', icon: '🦵' },
  { id: 'gonorreia-ist', name: 'Gonorreia / cervicite ou uretrite', icon: '🔬' },
  { id: 'gota-crise', name: 'Gota — crise aguda', icon: '🦶' },
  { id: 'hda', name: 'Hemorragia digestiva alta', icon: '🩸' },
  { id: 'herpes-zoster', name: 'Herpes zóster (internação / imunossuprimido)', icon: '🔬' },
  { id: 'hipoglicemia', name: 'Hipoglicemia', icon: '🍬' },
  { id: 'influenza-gripe', name: 'Influenza / gripe com complicação', icon: '🤧' },
  { id: 'intoxicacoes-exogenas', name: 'Intoxicações exógenas', icon: '☠️' },
  { id: 'leptospirose', name: 'Leptospirose — forma grave', icon: '🦠' },
  { id: 'lombalgia-ciatalgia', name: 'Lombalgia / ciatalgia', icon: '🦴' },
  { id: 'malaria-grave', name: 'Malária grave', icon: '🦟' },
  { id: 'meningite-bacteriana', name: 'Meningite bacteriana', icon: '🧠' },
  { id: 'nausea-vomitos', name: 'Náusea e vômitos', icon: '🤢' },
  { id: 'pancreatite', name: 'Pancreatite aguda', icon: '🫃' },
  { id: 'pielonefrite', name: 'Pielonefrite / ITU alta', icon: '💧' },
  { id: 'pneumonia', name: 'Pneumonia (internação)', icon: '🫁' },
  { id: 'pre-eclampsia-eclampsia', name: 'Pré-eclâmpsia / eclâmpsia', icon: '🤰' },
  { id: 'profilaxia-antirrabica', name: 'Profilaxia antirrábica', icon: '🐕' },
  { id: 'profilaxia-tetano', name: 'Profilaxia antitetânica', icon: '💉' },
  { id: 'queimadura', name: 'Queimadura — analgesia e hidratação', icon: '🔥' },
  { id: 'sepse-infeccao-grave', name: 'Sepse / infecção grave', icon: '🩸' },
  { id: 'vertigem-vestibular', name: 'Vertigem / síndrome vestibular aguda', icon: '🌀' }
];

function getThConditionHtml (condition) {
  return TH_CONTENT[condition.id] || `
    <p class="coming-soon">Conteúdo de <strong>${condition.name}</strong> em construção.</p>
    <p class="emerg-note">Build Tratamento hospitalar: <strong>${MEDHUB_TH_BUILD}</strong></p>`;
}

TH_CONDITIONS.forEach(c => {
  c.html = getThConditionHtml(c);
});

let currentThConditionId = null;

function initTratamentoHospitalar () {
  const grid = document.getElementById('th-condition-grid');
  if (!grid || grid.dataset.thBound) return;
  grid.dataset.thBound = '1';

  renderThGrid(TH_CONDITIONS);

  const search = document.getElementById('th-search');
  if (search) {
    search.addEventListener('input', () => {
      const q = search.value.trim().toLowerCase();
      const filtered = q
        ? TH_CONDITIONS.filter(c => c.name.toLowerCase().includes(q))
        : TH_CONDITIONS;
      renderThGrid(filtered);
    });
  }

  const backBtn = document.getElementById('th-back');
  if (backBtn) backBtn.onclick = showTratamentoHospitalarHome;
}

function renderThGrid (items) {
  const grid = document.getElementById('th-condition-grid');
  const empty = document.getElementById('th-empty');
  if (!grid) return;

  if (!items.length) {
    grid.innerHTML = '';
    if (empty) empty.hidden = false;
    return;
  }
  if (empty) empty.hidden = true;

  const countEl = document.getElementById('th-count');
  if (countEl) {
    countEl.textContent = items.length === TH_CONDITIONS.length
      ? `${TH_CONDITIONS.length} condições`
      : `${items.length} de ${TH_CONDITIONS.length} condições`;
  }

  grid.innerHTML = items.map(c => `
    <button type="button" class="calc-category-btn" data-th-condition="${c.id}">
      <span class="calc-category-icon">${c.icon}</span>
      <span class="calc-category-name">${c.name}</span>
    </button>
  `).join('');

  grid.querySelectorAll('[data-th-condition]').forEach(btn => {
    btn.addEventListener('click', () => showTratamentoHospitalarCondition(btn.dataset.thCondition));
  });
}

function showTratamentoHospitalarHome () {
  currentThConditionId = null;
  const list = document.getElementById('th-list-view');
  const detail = document.getElementById('th-condition-view');
  if (list) list.hidden = false;
  if (detail) detail.hidden = true;
  const search = document.getElementById('th-search');
  if (search) search.value = '';
  renderThGrid(TH_CONDITIONS);
}

function showTratamentoHospitalarCondition (conditionId) {
  const condition = TH_CONDITIONS.find(c => c.id === conditionId);
  if (!condition) return;

  currentThConditionId = conditionId;
  document.getElementById('th-list-view').hidden = true;
  document.getElementById('th-condition-view').hidden = false;
  document.getElementById('th-condition-title').textContent = `${condition.icon} ${condition.name}`;

  const contentEl = document.getElementById('th-condition-content');
  contentEl.innerHTML = `<div class="emerg-algo-block emerg-algo-single">${condition.html}</div>`;
}
