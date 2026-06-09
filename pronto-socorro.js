/* Prescrições de Pronto Socorro — condições e navegação */

const MEDHUB_PS_BUILD = 'ps-interactive-rx-v3';

const PS_CONTENT = Object.assign(
  {},
  typeof PS_CONTENT_1 !== 'undefined' ? PS_CONTENT_1 : {},
  typeof PS_CONTENT_2 !== 'undefined' ? PS_CONTENT_2 : {},
  typeof PS_CONTENT_3 !== 'undefined' ? PS_CONTENT_3 : {},
  typeof PS_CONTENT_4 !== 'undefined' ? PS_CONTENT_4 : {},
  typeof PS_CONTENT_5 !== 'undefined' ? PS_CONTENT_5 : {}
);

const PS_CONDITIONS = [
  { id: 'abdome-agudo', name: 'Abdome agudo', icon: '🩹' },
  { id: 'abscesso-cutaneo', name: 'Abscesso cutâneo — incisão e drenagem', icon: '💉' },
  { id: 'acidente-ofidico', name: 'Acidente ofídico (envenenamento por serpente)', icon: '🐍', emerg: { topic: 'toxicologia' } },
  { id: 'avc', name: 'Acidente vascular encefálico (isquêmico, extenso, hemorrágico, AIT)', icon: '🧠', emerg: { topic: 'avc' } },
  { id: 'afta-estomatite', name: 'Afta / estomatite', icon: '👄' },
  { id: 'alergia-anafilaxia', name: 'Alergia aguda, urticária, angioedema, choque anafilático', icon: '🐝', emerg: { topic: 'reacoes-metabolicas', protocol: 'anafilaxia' } },
  { id: 'alcoolismo-intox-abstinencia', name: 'Alcoolismo: intoxicação aguda & síndrome de abstinência', icon: '🍺' },
  { id: 'ameaca-aborto', name: 'Ameaça de aborto', icon: '🤰', emerg: { topic: 'obstetricia' } },
  { id: 'apendicite-aguda', name: 'Apendicite aguda', icon: '🩹' },
  { id: 'amigdalite-bacteriana', name: 'Amigdalite bacteriana', icon: '🦠' },
  { id: 'anemia-ferropriva', name: 'Anemia ferropriva', icon: '🩸' },
  { id: 'anemia-falciforme', name: 'Anemia falciforme — crise álgica', icon: '🩸' },
  { id: 'ansiedade-crise', name: 'Ansiedade — crise aguda', icon: '😰' },
  { id: 'antiparasitarios', name: 'Antiparasitários (profilaxia/terapia de helmintíases gerais)', icon: '💊' },
  { id: 'arritmias', name: 'Arritmias: taquiarritmias & bradiarritmias (incl. flutter, FA, TV, BAV)', icon: '💓', emerg: { topic: 'pressao-arritmias', protocol: 'wpw-instavel' } },
  { id: 'artralgia-dor-msk', name: 'Artralgia / dor musculoesquelética aguda', icon: '🦴' },
  { id: 'ascaridiase', name: 'Ascaridíase', icon: '🪱' },
  { id: 'asma-broncoespasmo', name: 'Asma brônquica (crise) e broncoespasmo', icon: '🌬️' },
  { id: 'balanopostite', name: 'Balanopostite', icon: '🔬' },
  { id: 'bronquite-aguda', name: 'Bronquite aguda', icon: '🫁' },
  { id: 'candidiase', name: 'Candidíase (oral, vaginal, balanopostite)', icon: '🔬' },
  { id: 'cardioversao-eletrica', name: 'Cardioversão elétrica (protocolo)', icon: '⚡', emerg: { topic: 'pressao-arritmias', protocol: 'wpw-instavel' } },
  { id: 'cefaleias', name: 'Cefaleias (tensional, enxaqueca, salvas)', icon: '🤕' },
  { id: 'chikungunya', name: 'Chikungunya', icon: '🦟' },
  { id: 'celulite', name: 'Celulite', icon: '🦠' },
  { id: 'cetoacidose-diabetica', name: 'Cetoacidose diabética', icon: '🩸', emerg: { topic: 'reacoes-metabolicas', protocol: 'dka-hhs' } },
  { id: 'colecistite-aguda', name: 'Colecistite aguda', icon: '🫃' },
  { id: 'lombalgia-ciatalgia', name: 'Ciatalgia / lombalgia / radiculopatia / torcicolo', icon: '🦴' },
  { id: 'malaria', name: 'Malária', icon: '🦟' },
  { id: 'cistite-itu-baixa', name: 'Cistite (ITU baixa)', icon: '💧' },
  { id: 'colica-renal', name: 'Cólica renal', icon: '💎' },
  { id: 'conjuntivite', name: 'Conjuntivite (viral, bacteriana, alérgica)', icon: '👁️' },
  { id: 'constipacao', name: 'Constipação intestinal', icon: '🔄' },
  { id: 'corpo-estranho-ocular', name: 'Corpo estranho ocular', icon: '👁️' },
  { id: 'crise-convulsiva-em', name: 'Crise convulsiva & estado de mal epiléptico', icon: '⚡' },
  { id: 'crise-tireotoxica', name: 'Crise tireotóxica', icon: '🦋' },
  { id: 'dengue', name: 'Dengue (classificação A-D)', icon: '🦟' },
  { id: 'desconforto-abdominal', name: 'Desconforto abdominal / flatulência', icon: '🫃' },
  { id: 'diabetes-insulina-hipo', name: 'Diabetes: insulinoterapia hospitalar & hipoglicemia', icon: '💉', emerg: { topic: 'reacoes-metabolicas', protocol: 'hipoglicemia-grave' } },
  { id: 'diarreia-gastroenterite', name: 'Diarreia aguda / gastroenterite', icon: '🚽' },
  { id: 'dispepsia-drge', name: 'Dispepsia, gastrite aguda, DRGE', icon: '🫃' },
  { id: 'diverticulite', name: 'Diverticulite aguda (classificação Hinchey)', icon: '🩹' },
  { id: 'disturbios-eletroliticos', name: 'Distúrbios hidroeletrolíticos (hipo/hiper-natremia, ‑calemia, ‑calcemia)', icon: '⚗️', emerg: { topic: 'reacoes-metabolicas', protocol: 'hipercalemia' } },
  { id: 'dpoc-exacerbada', name: 'DPOC exacerbada', icon: '🫁' },
  { id: 'edema-agudo-pulmao', name: 'Edema agudo de pulmão', icon: '🫁' },
  { id: 'edema-angioneurotico', name: 'Edema angioneurótico', icon: '🐝' },
  { id: 'edema-mmi', name: 'Edema de membros inferiores', icon: '🦵' },
  { id: 'eclampsia-pre-eclampsia', name: 'Pré-eclâmpsia / eclâmpsia', icon: '🤰', emerg: { topic: 'obstetricia' } },
  { id: 'estado-hiperosmolar', name: 'Estado hiperosmolar hiperglicêmico', icon: '🩸', emerg: { topic: 'reacoes-metabolicas', protocol: 'dka-hhs' } },
  { id: 'epistaxe', name: 'Epistaxe (sangramento nasal)', icon: '👃' },
  { id: 'erisipela', name: 'Erisipela', icon: '🦠' },
  { id: 'escabiose', name: 'Escabiose', icon: '🪲' },
  { id: 'escorpionismo', name: 'Escorpionismo (picada de escorpião)', icon: '🦂', emerg: { topic: 'toxicologia' } },
  { id: 'delirium', name: 'Estado confusional agudo (delirium do idoso)', icon: '🧠' },
  { id: 'fissura-anal', name: 'Fissura anal', icon: '🔬' },
  { id: 'flebite', name: 'Flebite', icon: '🦵' },
  { id: 'frieira', name: 'Frieira (tinea pedis)', icon: '🦶' },
  { id: 'furunculose', name: 'Furunculose / furúnculo / carbúnculo', icon: '🦠' },
  { id: 'gonorreia-clamidia', name: 'Gonorreia e cervicite/uretrite por clamídia', icon: '🔬' },
  { id: 'gota', name: 'Gota (crise aguda & profilaxia)', icon: '🦶' },
  { id: 'gripe-influenza', name: 'Gripe / resfriado comum / influenza H1N1', icon: '🤧' },
  { id: 'hda', name: 'Hemorragia digestiva alta', icon: '🩸' },
  { id: 'hemorroidas', name: 'Hemorróidas', icon: '🔬' },
  { id: 'herpes-zoster', name: 'Herpes simples labial & herpes zóster', icon: '🔬' },
  { id: 'crise-hipertensiva', name: 'Hipertensão — crise hipertensiva (urgência & emergência)', icon: '🔴', emerg: { topic: 'pressao-arritmias', protocol: 'crise-hipertensiva' } },
  { id: 'hipoglicemia-grave', name: 'Hipoglicemia grave', icon: '🍬', emerg: { topic: 'reacoes-metabolicas', protocol: 'hipoglicemia-grave' } },
  { id: 'hordeolo', name: 'Hordéolo (terçol)', icon: '👁️' },
  { id: 'impetigo', name: 'Impetigo', icon: '🦠' },
  { id: 'insolacao', name: 'Insolação / queimadura solar', icon: '☀️', emerg: { topic: 'toxicologia', protocol: 'hipertermia-maligna-calor' } },
  { id: 'intoxicacoes-exogenas', name: 'Intoxicações exógenas (abordagem geral)', icon: '☠️', emerg: { topic: 'toxicologia' } },
  { id: 'pielonefrite', name: 'ITU alta / pielonefrite', icon: '💧' },
  { id: 'leptospirose', name: 'Leptospirose', icon: '🦠' },
  { id: 'micoses-superficiais', name: 'Micoses superficiais (tinea corporis, crural, onicomicose, pitiríase versicolor)', icon: '🦶' },
  { id: 'meningite-bacteriana', name: 'Meningite / meningoencefite bacteriana', icon: '🧠' },
  { id: 'mononucleose', name: 'Mononucleose infecciosa', icon: '🦠' },
  { id: 'otite-externa', name: 'Otite externa', icon: '👂' },
  { id: 'otite-media', name: 'Otite média aguda', icon: '👂' },
  { id: 'parasitoses-intestinais', name: 'Parasitoses intestinais (giardíase, amebíase, oxiurose)', icon: '🪱' },
  { id: 'pediculose', name: 'Pediculose', icon: '🪲' },
  { id: 'pancreatite-aguda', name: 'Pancreatite aguda', icon: '🫃' },
  { id: 'pneumonia-comunitaria', name: 'Pneumonia comunitária (protocolos ambulatorial, enfermaria, UTI)', icon: '🫁' },
  { id: 'trauma-atls', name: 'Protocolo de trauma (ATLS)', icon: '🆘', emerg: { topic: 'trauma' } },
  { id: 'profilaxia-antirrabica', name: 'Profilaxia antirrábica (exposição a animal)', icon: '🐕' },
  { id: 'queilite', name: 'Queilite', icon: '👄' },
  { id: 'queimaduras', name: 'Queimaduras (1º–3º grau)', icon: '🔥' },
  { id: 'rinite-alergica', name: 'Rinite alérgica', icon: '🤧' },
  { id: 'sangramento-uterino', name: 'Sangramento vaginal / uterino anormal', icon: '🩸' },
  { id: 'sca-iam', name: 'Síndrome coronariana aguda / infarto agudo do miocárdio', icon: '❤️‍🔥', emerg: { topic: 'sca' } },
  { id: 'sinusite-aguda', name: 'Sinusite aguda', icon: '🤧' },
  { id: 'abstinencia-alcoolica', name: 'Síndrome de abstinência alcoólica', icon: '🍺' },
  { id: 'sepse-choque-septico', name: 'Síndrome do choque séptico & sepse (doses incluídas em ATB)', icon: '🩸', emerg: { topic: 'sepse' } },
  { id: 'sincope', name: 'Síncope / pré-síncope', icon: '💫' },
  { id: 'sindrome-vestibular', name: 'Síndrome vestibular: tontura, vertigem, labirintite', icon: '🌀' },
  { id: 'soluco-persistente', name: 'Soluço persistente', icon: '🫁' },
  { id: 'tep', name: 'Tromboembolismo pulmonar (TEP)', icon: '🫁' },
  { id: 'tinea', name: 'Tinea (pedis, crural, corporis)', icon: '🦶' },
  { id: 'tvp', name: 'Trombose venosa profunda (TVP)', icon: '🦵' },
  { id: 'tosse', name: 'Tosse seca / produtiva (manejo sintomático)', icon: '🫁' },
  { id: 'trauma-ocular', name: 'Trauma ocular', icon: '👁️' },
  { id: 'tuberculose', name: 'Tuberculose pulmonar (esquema RHZE)', icon: '🫁' },
  { id: 'ulcera-varicosa', name: 'Úlcera varicosa', icon: '🦵' },
  { id: 'ulceras-genitais', name: 'Úlceras genitais infecciosas (sífilis, herpes, cancro mole, donovanose, LGV)', icon: '🔬' },
  { id: 'varizes-mmi', name: 'Varizes de membros inferiores', icon: '🦵' },
  { id: 'violencia-sexual-pep', name: 'Violência sexual — profilaxias pós-exposição', icon: '🛡️' },
  { id: 'vomitos-agudos', name: 'Vômitos agudos', icon: '🤢' },
  { id: 'vulvovaginites', name: 'Vulvovaginites (vaginose bacteriana, candidíase, tricomoníase)', icon: '🔬' }
];

function psEmergBtnHtml (condition) {
  if (!condition.emerg) return '';
  const { topic, protocol } = condition.emerg;
  return `
    <p class="ps-emerg-link-wrap">
      <button type="button" class="btn ps-emerg-link" data-emerg-topic="${topic}"${protocol ? ` data-emerg-protocol="${protocol}"` : ''}>
        Abrir protocolo no Guia de emergência
      </button>
    </p>`;
}

function getPsConditionHtml (condition) {
  const body = PS_CONTENT[condition.id] || `
    <p class="coming-soon">Conteúdo de <strong>${condition.name}</strong> em construção — adicione em <code>pronto-socorro-content-*.js</code>.</p>
    <p class="emerg-note">Build Prescrições PS: <strong>${MEDHUB_PS_BUILD}</strong></p>`;
  return body + psEmergBtnHtml(condition);
}

PS_CONDITIONS.forEach(c => {
  c.html = getPsConditionHtml(c);
});

let currentPsConditionId = null;

function initProntoSocorro () {
  const grid = document.getElementById('ps-condition-grid');
  if (!grid || grid.dataset.psBound) return;
  grid.dataset.psBound = '1';

  renderPsGrid(PS_CONDITIONS);

  const search = document.getElementById('ps-search');
  if (search) {
    search.addEventListener('input', () => {
      const q = search.value.trim().toLowerCase();
      const filtered = q
        ? PS_CONDITIONS.filter(c => c.name.toLowerCase().includes(q))
        : PS_CONDITIONS;
      renderPsGrid(filtered);
    });
  }

  const backBtn = document.getElementById('ps-back');
  if (backBtn) backBtn.onclick = showProntoSocorroHome;
}

function renderPsGrid (items) {
  const grid = document.getElementById('ps-condition-grid');
  const empty = document.getElementById('ps-empty');
  if (!grid) return;

  if (!items.length) {
    grid.innerHTML = '';
    if (empty) empty.hidden = false;
    return;
  }
  if (empty) empty.hidden = true;

  const countEl = document.getElementById('ps-count');
  if (countEl) {
    countEl.textContent = items.length === PS_CONDITIONS.length
      ? `${PS_CONDITIONS.length} condições`
      : `${items.length} de ${PS_CONDITIONS.length} condições`;
  }

  grid.innerHTML = items.map(c => `
    <button type="button" class="calc-category-btn" data-ps-condition="${c.id}">
      <span class="calc-category-icon">${c.icon}</span>
      <span class="calc-category-name">${c.name}</span>
    </button>
  `).join('');

  grid.querySelectorAll('[data-ps-condition]').forEach(btn => {
    btn.addEventListener('click', () => showProntoSocorroCondition(btn.dataset.psCondition));
  });
}

function showProntoSocorroHome () {
  currentPsConditionId = null;
  const list = document.getElementById('ps-list-view');
  const detail = document.getElementById('ps-condition-view');
  if (list) list.hidden = false;
  if (detail) detail.hidden = true;
  const search = document.getElementById('ps-search');
  if (search) search.value = '';
  renderPsGrid(PS_CONDITIONS);
}

function showProntoSocorroCondition (conditionId) {
  const condition = PS_CONDITIONS.find(c => c.id === conditionId);
  if (!condition) return;

  currentPsConditionId = conditionId;
  document.getElementById('ps-list-view').hidden = true;
  document.getElementById('ps-condition-view').hidden = false;
  document.getElementById('ps-condition-title').textContent = `${condition.icon} ${condition.name}`;

  const contentEl = document.getElementById('ps-condition-content');
  contentEl.innerHTML = `<div class="emerg-algo-block emerg-algo-single">${condition.html}</div>`;

  contentEl.querySelectorAll('.ps-emerg-link').forEach(btn => {
    btn.addEventListener('click', () => {
      const topicId = btn.dataset.emergTopic;
      const protocolId = btn.dataset.emergProtocol;
      if (typeof showSection === 'function') showSection('guia-emergencia');
      if (typeof showEmergenciaTopic === 'function') showEmergenciaTopic(topicId);
      if (protocolId && typeof showEmergenciaProtocol === 'function') {
        showEmergenciaProtocol(protocolId);
      }
    });
  });

  if (typeof initEmergCalcForms === 'function') initEmergCalcForms(contentEl);
  if (typeof initEmergEcgLightbox === 'function') initEmergEcgLightbox(contentEl);
  if (typeof initPsInteractive === 'function') initPsInteractive(conditionId, contentEl);
}
