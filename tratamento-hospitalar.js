/* Tratamento hospitalar — condições com medicação IM/EV e navegação */

const MEDHUB_TH_BUILD = 'th-opcoes-v2';

const TH_CONTENT = Object.assign(
  {},
  typeof TH_CONTENT_1 !== 'undefined' ? TH_CONTENT_1 : {}
);

const TH_CONDITIONS = [
  { id: 'cefaleia', name: 'Cefaleia (tensional, enxaqueca)', icon: '🤕' },
  { id: 'dor-abdominal', name: 'Dor abdominal aguda', icon: '🫃' },
  { id: 'colica-renal', name: 'Cólica renal', icon: '💎' },
  { id: 'lombalgia-ciatalgia', name: 'Lombalgia / ciatalgia', icon: '🦴' },
  { id: 'dor-toracica', name: 'Dor torácica / SCA suspeita', icon: '❤️‍🔥' },
  { id: 'nausea-vomitos', name: 'Náusea e vômitos', icon: '🤢' },
  { id: 'asma-broncoespasmo', name: 'Asma / broncoespasmo', icon: '🌬️' },
  { id: 'dpoc-exacerbada', name: 'DPOC exacerbada', icon: '🫁' },
  { id: 'pneumonia', name: 'Pneumonia (internação)', icon: '🫁' },
  { id: 'celulite-erisipela', name: 'Celulite / erisipela', icon: '🦠' },
  { id: 'pielonefrite', name: 'Pielonefrite / ITU alta', icon: '💧' },
  { id: 'sepse-infeccao-grave', name: 'Sepse / infecção grave', icon: '🩸' },
  { id: 'crise-hipertensiva', name: 'Crise hipertensiva', icon: '🔴' },
  { id: 'hipoglicemia', name: 'Hipoglicemia', icon: '🍬' },
  { id: 'convulsao-eme', name: 'Crise convulsiva / EME', icon: '⚡' },
  { id: 'anafilaxia', name: 'Anafilaxia / urticária grave', icon: '🐝' },
  { id: 'gota-crise', name: 'Gota — crise aguda', icon: '🦶' },
  { id: 'artralgia-dor-msk', name: 'Artralgia / dor musculoesquelética', icon: '🦴' },
  { id: 'vertigem-vestibular', name: 'Vertigem / labirintite', icon: '🌀' },
  { id: 'agitacao-psiquiatrica', name: 'Agitação psicomotora / delirium', icon: '🧠' },
  { id: 'pancreatite', name: 'Pancreatite aguda', icon: '🫃' },
  { id: 'colecistite', name: 'Colecistite aguda', icon: '🫃' },
  { id: 'apendicite', name: 'Apendicite aguda (pré-operatório)', icon: '🩹' },
  { id: 'influenza-gripe', name: 'Influenza / gripe com complicação', icon: '🤧' },
  { id: 'dengue-dor', name: 'Dengue — analgesia hospitalar', icon: '🦟' },
  { id: 'hda', name: 'Hemorragia digestiva alta', icon: '🩸' },
  { id: 'flebite', name: 'Flebite / tromboflebite', icon: '🦵' },
  { id: 'profilaxia-tetano', name: 'Profilaxia antitetânica', icon: '💉' },
  { id: 'cetoacidose-dm', name: 'Cetoacidose diabética', icon: '🩸' },
  { id: 'sindrome-vestibular', name: 'Síndrome vestibular aguda', icon: '🌀' }
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
