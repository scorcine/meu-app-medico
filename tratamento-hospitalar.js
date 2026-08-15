/* Tratamento hospitalar — condições com medicação IM/EV e navegação */

const MEDHUB_TH_BUILD = 'th-auto-v4';

const TH_CONTENT = Object.assign(
  {},
  typeof TH_CONTENT_1 !== 'undefined' ? TH_CONTENT_1 : {},
  typeof TH_CONTENT_2 !== 'undefined' ? TH_CONTENT_2 : {}
);

const TH_CONDITIONS = [
  { id: 'cefaleia', name: 'Cefaleia (tensional, enxaqueca)', icon: '🤕', aliases: ['cefaleia', 'cefaleias', 'dor de cabeca', 'dor cabeca', 'enxaqueca', 'migranea', 'migraine', 'headache'] },
  { id: 'ansiedade-panico', name: 'Crise de ansiedade / pânico', icon: '😰', aliases: ['ansiedade', 'panico', 'crise de panico', 'crise ansiedade'] },
  { id: 'anafilaxia', name: 'Anafilaxia / urticária grave', icon: '🐝', aliases: ['anafilaxia', 'alergia grave', 'urticaria grave'] },
  { id: 'anemia-falciforme', name: 'Anemia falciforme — crise álgica', icon: '🩸', aliases: ['falciforme', 'crise algica falciforme'] },
  { id: 'abscesso-cutaneo', name: 'Abscesso cutâneo pós-drenagem', icon: '💉', aliases: ['abscesso', 'abscesso cutaneo'] },
  { id: 'abstinencia-alcool', name: 'Abstinência alcoólica / delirium tremens', icon: '🍺', aliases: ['abstinencia alcoolica', 'delirium tremens', 'dt'] },
  { id: 'agitacao-psiquiatrica', name: 'Agitação psicomotora / delirium', icon: '🧠', aliases: ['agitacao', 'agitacao psicomotora', 'delirium'] },
  { id: 'apendicite', name: 'Apendicite aguda (pré-operatório)', icon: '🩹', aliases: ['apendicite'] },
  { id: 'artralgia-dor-msk', name: 'Artralgia / dor musculoesquelética', icon: '🦴', aliases: ['artralgia', 'dor musculoesqueletica', 'dor muscular', 'dor articular', 'ombro', 'dor ombro', 'dor no ombro', 'omalgia', 'dor de ombro', 'joelho', 'dor joelho', 'cervicalgia', 'dor cervical', 'msk'] },
  { id: 'asma-broncoespasmo', name: 'Asma / broncoespasmo', icon: '🌬️', aliases: ['asma', 'broncoespasmo', 'crise asmatica'] },
  { id: 'celulite-erisipela', name: 'Celulite / erisipela', icon: '🦠', aliases: ['celulite', 'erisipela'] },
  { id: 'cetoacidose-dm', name: 'Cetoacidose diabética', icon: '🩸', aliases: ['cetoacidose', 'cad'] },
  { id: 'colica-renal', name: 'Cólica renal', icon: '💎', aliases: ['colica renal', 'calculo renal', 'litíase', 'litiase'] },
  { id: 'colecistite', name: 'Colecistite aguda', icon: '🫃', aliases: ['colecistite'] },
  { id: 'convulsao-eme', name: 'Crise convulsiva / EME', icon: '⚡', aliases: ['convulsao', 'crise convulsiva', 'eme', 'estado de mal'] },
  { id: 'crise-hipertensiva', name: 'Crise hipertensiva', icon: '🔴', aliases: ['crise hipertensiva', 'emergencia hipertensiva'] },
  { id: 'crise-tireotoxica', name: 'Crise tireotóxica / tempestade tiroidiana', icon: '🦋', aliases: ['crise tireotoxica', 'tempestade tiroidiana'] },
  { id: 'dengue-dor', name: 'Dengue — analgesia hospitalar', icon: '🦟', aliases: ['dengue'] },
  { id: 'diverticulite', name: 'Diverticulite aguda complicada', icon: '🩹', aliases: ['diverticulite'] },
  { id: 'disturbios-eletroliticos', name: 'Distúrbios hidroeletrolíticos sintomáticos', icon: '⚗️', aliases: ['hiponatremia', 'hipercalemia', 'eletrolito'] },
  { id: 'dor-abdominal', name: 'Dor abdominal aguda', icon: '🫃', aliases: ['dor abdominal', 'abdomen agudo', 'dor de barriga'] },
  { id: 'dor-toracica', name: 'Dor torácica / SCA suspeita', icon: '❤️‍🔥', aliases: ['dor toracica', 'dor no peito', 'sca', 'infarto'] },
  { id: 'dpoc-exacerbada', name: 'DPOC exacerbada', icon: '🫁', aliases: ['dpoc', 'exacerbacao dpoc'] },
  { id: 'edema-pulmao-ic', name: 'Edema agudo de pulmão / IC descompensada', icon: '🫁', aliases: ['edema pulmonar', 'eap', 'ic descompensada'] },
  { id: 'flebite', name: 'Flebite / tromboflebite', icon: '🦵', aliases: ['flebite', 'tromboflebite'] },
  { id: 'gonorreia-ist', name: 'Gonorreia / cervicite ou uretrite', icon: '🔬', aliases: ['gonorreia', 'uretrite', 'cervicite'] },
  { id: 'gota-crise', name: 'Gota — crise aguda', icon: '🦶', aliases: ['gota', 'crise de gota'] },
  { id: 'hda', name: 'Hemorragia digestiva alta', icon: '🩸', aliases: ['hda', 'hemorragia digestiva'] },
  { id: 'herpes-zoster', name: 'Herpes zóster (internação / imunossuprimido)', icon: '🔬', aliases: ['herpes zoster', 'zoster'] },
  { id: 'hipoglicemia', name: 'Hipoglicemia', icon: '🍬', aliases: ['hipoglicemia'] },
  { id: 'influenza-gripe', name: 'Influenza / gripe com complicação', icon: '🤧', aliases: ['influenza', 'gripe'] },
  { id: 'intoxicacoes-exogenas', name: 'Intoxicações exógenas', icon: '☠️', aliases: ['intoxicacao', 'intoxicacao exogena'] },
  { id: 'leptospirose', name: 'Leptospirose — forma grave', icon: '🦠', aliases: ['leptospirose'] },
  { id: 'lombalgia-ciatalgia', name: 'Lombalgia / ciatalgia', icon: '🦴', aliases: ['lombalgia', 'ciatalgia', 'dor lombar', 'dor nas costas', 'ciatica'] },
  { id: 'malaria-grave', name: 'Malária grave', icon: '🦟', aliases: ['malaria'] },
  { id: 'meningite-bacteriana', name: 'Meningite bacteriana', icon: '🧠', aliases: ['meningite'] },
  { id: 'nausea-vomitos', name: 'Náusea e vômitos', icon: '🤢', aliases: ['nausea', 'nauseas', 'vomito', 'vomitos', 'emese', 'enjoo'] },
  { id: 'pancreatite', name: 'Pancreatite aguda', icon: '🫃', aliases: ['pancreatite'] },
  { id: 'pielonefrite', name: 'Pielonefrite / ITU alta', icon: '💧', aliases: ['pielonefrite', 'itu alta', 'infeccao urinaria alta'] },
  { id: 'pneumonia', name: 'Pneumonia (internação)', icon: '🫁', aliases: ['pneumonia', 'pac'] },
  { id: 'pre-eclampsia-eclampsia', name: 'Pré-eclâmpsia / eclâmpsia', icon: '🤰', aliases: ['pre eclampsia', 'eclampsia'] },
  { id: 'profilaxia-antirrabica', name: 'Profilaxia antirrábica', icon: '🐕', aliases: ['antirrabica', 'raiva'] },
  { id: 'profilaxia-tetano', name: 'Profilaxia antitetânica', icon: '💉', aliases: ['tetano', 'antitetanica'] },
  { id: 'queimadura', name: 'Queimadura — analgesia e hidratação', icon: '🔥', aliases: ['queimadura'] },
  { id: 'sepse-infeccao-grave', name: 'Sepse / infecção grave', icon: '🩸', aliases: ['sepse', 'sepsis', 'infeccao grave'] },
  { id: 'vertigem-vestibular', name: 'Vertigem / síndrome vestibular aguda', icon: '🌀', aliases: ['vertigem', 'labirintite', 'tontura vestibular'] }
];

function thNormText (text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const TH_MIN_QUERY_LENGTH = 4;

function thParseQueixaSegments (queixa) {
  const list = Array.isArray(queixa)
    ? queixa.map(s => String(s || ''))
    : String(queixa || '').split(/[,;\n]+|\s+\be\s+|\s+\/\s+|\s+\+\s+/i);

  return list
    .map(s => s.trim())
    .filter(s => thNormText(s).length >= TH_MIN_QUERY_LENGTH);
}

/** Palavra inteira evita que trechos curtos casem no meio de outro termo */
function thHasWord (haystack, needle) {
  if (!needle || needle.length < 3) return false;
  return new RegExp(`(^|\\s)${needle}(\\s|$)`).test(haystack);
}

function thMatchScore (cond, norm) {
  if (!norm || norm.length < TH_MIN_QUERY_LENGTH) return 0;
  let score = 0;
  const aliases = (cond.aliases || []).map(thNormText);
  const nameNorm = thNormText(cond.name);

  if (aliases.some(a => a === norm)) score += 200;
  else if (aliases.some(a => a.length >= 4 && (thHasWord(norm, a) || thHasWord(a, norm)))) score += 120;
  else if (thHasWord(nameNorm, norm)) score += 90;

  if (/ombro|omalgia|joelho|cervical|musculoesquelet|artralgia|dor muscular/.test(norm) && cond.id === 'artralgia-dor-msk') {
    score += 80;
  }
  if (/cefaleia|dor de cabeca|enxaqueca|migranea|headache/.test(norm) && cond.id === 'cefaleia') {
    score += 80;
  }

  return score;
}

function thMatchConditions (queixa) {
  const queries = thParseQueixaSegments(queixa);
  const byId = new Map();

  queries.forEach(q => {
    const norm = thNormText(q);
    if (norm.length < TH_MIN_QUERY_LENGTH) return;

    let best = null;
    TH_CONDITIONS.forEach(cond => {
      const score = thMatchScore(cond, norm);
      if (score >= 90 && (!best || score > best.score)) best = { cond, score };
    });

    if (best) {
      const prev = byId.get(best.cond.id);
      if (!prev || best.score > prev.score) byId.set(best.cond.id, best);
    }
  });

  return [...byId.values()]
    .sort((a, b) => b.score - a.score)
    .map(entry => entry.cond);
}

function thFilterConditions (query) {
  const q = thNormText(query);
  if (!q) return TH_CONDITIONS;
  const matched = thMatchConditions(query);
  if (matched.length) return matched;
  return TH_CONDITIONS.filter(c => {
    const hay = thNormText([c.name, ...(c.aliases || [])].join(' '));
    return hay.includes(q);
  });
}

function getThConditionHtml (condition) {
  return TH_CONTENT[condition.id] || `
    <p class="coming-soon">Conteúdo de <strong>${condition.name}</strong> em construção.</p>
    <p class="emerg-note">Build Tratamento hospitalar: <strong>${MEDHUB_TH_BUILD}</strong></p>`;
}

TH_CONDITIONS.forEach(c => {
  c.html = getThConditionHtml(c);
});

let currentThConditionId = null;
const thSelectedMedKeys = new Set();
const thSelectedDrugs = new Set();
const thSelectedRoutes = new Map();
const thDrugRoutePref = new Map();

/** Separa por "·" apenas fora de parênteses, para não quebrar "(dor intensa · curto prazo)" */
function thSplitOutsideParens (text) {
  const parts = [];
  let depth = 0;
  let buffer = '';

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '(' || ch === '[') depth++;
    else if (ch === ')' || ch === ']') depth = Math.max(0, depth - 1);

    const isSeparator = depth === 0 && (ch === '·' || ch === '•') &&
      /\s/.test(text[i - 1] || ' ') && /\s/.test(text[i + 1] || ' ');

    if (isSeparator) {
      parts.push(buffer);
      buffer = '';
    } else {
      buffer += ch;
    }
  }
  parts.push(buffer);

  return parts.map(p => p.trim()).filter(Boolean);
}

function thSplitMedChoices (liText) {
  const raw = String(liText || '').replace(/\s+/g, ' ').trim();
  if (!raw) return { prefix: '', choices: [] };

  const colonIdx = raw.search(/:\s/);
  let prefix = '';
  let body = raw;
  if (colonIdx >= 0 && colonIdx < 80) {
    prefix = raw.slice(0, colonIdx).trim().replace(/:$/, '');
    body = raw.slice(colonIdx + 1).trim();
  }

  const parts = thSplitOutsideParens(body);
  if (!parts.length) return { prefix: '', choices: [] };

  return {
    prefix,
    choices: parts.map((part, i) => ({
      index: i,
      text: part,
      label: prefix ? `${prefix}: ${part}` : part
    }))
  };
}

/** Identidade do fármaco para reaproveitar a marcação entre condições */
function thMedIdentity (label) {
  const raw = String(label || '');
  const afterPrefix = raw.includes(':') ? raw.slice(raw.indexOf(':') + 1) : raw;
  const beforeDose = afterPrefix.split(/\d/)[0];
  const words = thNormText(beforeDose)
    .split(' ')
    .filter(w => w.length >= 3 && !['amp', 'ampola', 'linha', 'dose', 'mais'].includes(w));
  return words.slice(0, 2).join(' ');
}

const TH_ROUTE_LABELS = {
  ev: 'EV',
  im: 'IM',
  vo: 'VO',
  sc: 'SC',
  sl: 'SL',
  ir: 'Retal',
  neb: 'Nebulização',
  inal: 'Inalatória',
  nasal: 'Intranasal'
};

/* Vias possíveis por fármaco — impede oferecer via inexistente ou proscrita
   (ex.: diclofenaco e tenoxicam não podem ser EV) */
const TH_DRUG_ROUTES = {
  dipirona: ['ev', 'im', 'vo'],
  diclofenaco: ['im', 'vo'],
  tenoxicam: ['im', 'vo'],
  cetoprofeno: ['ev', 'im', 'vo'],
  ketorolaco: ['ev', 'im', 'vo'],
  ibuprofeno: ['vo'],
  nimesulida: ['vo'],
  paracetamol: ['ev', 'vo'],
  tramadol: ['ev', 'im', 'vo'],
  morfina: ['ev', 'im', 'sc', 'vo'],
  fentanil: ['ev'],
  meperidina: ['ev', 'im'],
  codeina: ['vo'],
  dexametasona: ['ev', 'im', 'vo'],
  metilprednisolona: ['ev', 'im'],
  hidrocortisona: ['ev', 'im'],
  prednisona: ['vo'],
  metoclopramida: ['ev', 'im', 'vo'],
  ondansetrona: ['ev', 'im', 'vo'],
  bromoprida: ['ev', 'im', 'vo'],
  dimenidrinato: ['ev', 'im', 'vo'],
  escopolamina: ['ev', 'im', 'vo'],
  hioscina: ['ev', 'im', 'vo'],
  omeprazol: ['ev', 'vo'],
  pantoprazol: ['ev', 'vo'],
  ranitidina: ['ev', 'im', 'vo'],
  diazepam: ['ev', 'im', 'vo', 'ir'],
  midazolam: ['ev', 'im', 'nasal'],
  haloperidol: ['ev', 'im', 'vo'],
  prometazina: ['im', 'vo'],
  clorpromazina: ['im', 'vo'],
  ciclobenzaprina: ['vo'],
  epinefrina: ['ev', 'im'],
  adrenalina: ['ev', 'im'],
  hidroxizina: ['vo'],
  ceftriaxona: ['ev', 'im'],
  cefazolina: ['ev', 'im'],
  cefepime: ['ev'],
  oxacilina: ['ev'],
  ampicilina: ['ev', 'im'],
  amoxicilina: ['vo'],
  clindamicina: ['ev', 'im', 'vo'],
  vancomicina: ['ev'],
  gentamicina: ['ev', 'im'],
  azitromicina: ['ev', 'vo'],
  claritromicina: ['ev', 'vo'],
  metronidazol: ['ev', 'vo'],
  ciprofloxacino: ['ev', 'vo'],
  levofloxacino: ['ev', 'vo'],
  moxifloxacino: ['ev', 'vo'],
  aciclovir: ['ev', 'vo'],
  oseltamivir: ['vo'],
  salbutamol: ['neb', 'inal'],
  ipratropio: ['neb', 'inal'],
  budesonida: ['neb', 'inal']
};

/** Vias citadas no próprio texto do protocolo, na ordem em que aparecem */
function thExtractRoutesFromText (text) {
  const found = [];
  const push = (route) => { if (route && !found.includes(route)) found.push(route); };
  const re = /\b(IM|EV|IV|VO|SC|SL|VR)\b|nebuliza\w*|inalat\w*|intranasal|via retal/g;
  let match;

  while ((match = re.exec(String(text || '')))) {
    const token = match[0].toLowerCase();
    if (token === 'iv') push('ev');
    else if (token === 'vr' || token === 'via retal') push('ir');
    else if (token.startsWith('nebuliza')) push('neb');
    else if (token.startsWith('inalat')) push('inal');
    else if (token === 'intranasal') push('nasal');
    else push(token);
  }

  return found;
}

function thRoutesForMed (text, drug) {
  const allowed = TH_DRUG_ROUTES[drug];
  const fromText = thExtractRoutesFromText(text);

  if (!allowed) return fromText;
  if (!fromText.length) return allowed;

  const intersection = fromText.filter(r => allowed.includes(r));
  return intersection.length ? intersection : allowed;
}

function thIsMedBlocked (label) {
  if (typeof clinicalIsDrugBlocked !== 'function') return false;
  return clinicalIsDrugBlocked({ text: label, label });
}

function thRenderAllergyPanel () {
  const mount = document.getElementById('th-allergy-mount');
  if (!mount) return;
  if (typeof clinicalAllergyPanelHtml === 'function') {
    mount.innerHTML = clinicalAllergyPanelHtml('th-allergy-input');
    clinicalBindAllergyPanel(mount, () => {
      if (currentThConditionId) showTratamentoHospitalarCondition(currentThConditionId, { skipGate: true });
    });
  }
}

function initTratamentoHospitalar () {
  const grid = document.getElementById('th-condition-grid');
  if (!grid || grid.dataset.thBound) return;
  grid.dataset.thBound = '1';

  thRenderAllergyPanel();
  renderThGrid(TH_CONDITIONS);

  const search = document.getElementById('th-search');
  if (search) {
    search.addEventListener('input', () => {
      renderThGrid(thFilterConditions(search.value));
    });
  }

  const backBtn = document.getElementById('th-back');
  if (backBtn) backBtn.onclick = showTratamentoHospitalarHome;

  const clearBtn = document.getElementById('th-clear-selection');
  if (clearBtn && !clearBtn.dataset.bound) {
    clearBtn.dataset.bound = '1';
    clearBtn.addEventListener('click', () => {
      thSelectedMedKeys.clear();
      thSelectedDrugs.clear();
      thSelectedRoutes.clear();
      thDrugRoutePref.clear();
      document.querySelectorAll('#th-condition-content [data-th-med]').forEach(input => {
        input.checked = false;
        input.closest('.th-med-option')?.classList.remove('th-med-synced');
      });
      document.querySelectorAll('#th-condition-content .th-med-routes').forEach(row => {
        row.hidden = true;
      });
      thUpdateSelectionBar();
    });
  }

  const copyBtn = document.getElementById('th-copy-selection');
  if (copyBtn && !copyBtn.dataset.bound) {
    copyBtn.dataset.bound = '1';
    copyBtn.addEventListener('click', thCopySelection);
  }
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
  thSelectedMedKeys.clear();
  thSelectedDrugs.clear();
  thSelectedRoutes.clear();
  thDrugRoutePref.clear();
  const list = document.getElementById('th-list-view');
  const detail = document.getElementById('th-condition-view');
  if (list) list.hidden = false;
  if (detail) detail.hidden = true;
  const search = document.getElementById('th-search');
  if (search) search.value = '';
  thRenderAllergyPanel();
  renderThGrid(TH_CONDITIONS);
  thUpdateSelectionBar();
}

async function showTratamentoHospitalarCondition (conditionId, opts) {
  return showTratamentoHospitalarConditions([conditionId], opts);
}

function thPickRoute (key, drug, routes) {
  const stored = thSelectedRoutes.get(key);
  if (stored && routes.includes(stored)) return stored;
  const preferred = drug ? thDrugRoutePref.get(drug) : null;
  if (preferred && routes.includes(preferred)) return preferred;
  return routes[0];
}

function thBuildRouteRow (key, drug, routes, checked) {
  const row = document.createElement('div');
  row.className = 'th-med-routes';
  row.hidden = !checked;
  row.dataset.thRouteFor = key;

  const chosen = thPickRoute(key, drug, routes);
  if (checked) thSelectedRoutes.set(key, chosen);

  const caption = document.createElement('span');
  caption.className = 'th-med-routes-label';
  caption.textContent = routes.length > 1 ? 'Via:' : 'Via disponível:';
  row.appendChild(caption);

  routes.forEach(route => {
    if (routes.length === 1) {
      const only = document.createElement('span');
      only.className = 'th-route-fixed';
      only.dataset.thRouteFixed = route;
      only.textContent = TH_ROUTE_LABELS[route] || route.toUpperCase();
      row.appendChild(only);
      return;
    }

    const option = document.createElement('label');
    option.className = 'th-route-option';
    option.innerHTML = `
      <input type="radio" name="th-route-${key}" data-th-route="${route}" data-th-route-key="${key}"
        data-th-route-drug="${drug}" ${route === chosen ? 'checked' : ''}>
      <span>${TH_ROUTE_LABELS[route] || route.toUpperCase()}</span>`;
    row.appendChild(option);
  });

  return row;
}

function thBuildSelectableMeds (condition, wrap) {
  wrap.querySelectorAll('ul.ps-med-options').forEach(ul => {
    const items = [...ul.querySelectorAll(':scope > li')];
    const box = document.createElement('div');
    box.className = 'th-med-options';

    items.forEach((li, liIdx) => {
      const { prefix, choices } = thSplitMedChoices(li.textContent);
      if (!choices.length) return;

      const group = document.createElement('div');
      group.className = 'th-med-group';

      if (prefix) {
        const title = document.createElement('p');
        title.className = 'th-med-group-title';
        title.textContent = prefix;
        group.appendChild(title);
      }

      choices.forEach((choice, cIdx) => {
        const key = `${condition.id}:${liIdx}:${cIdx}`;
        const drug = thMedIdentity(choice.label);
        const blocked = thIsMedBlocked(choice.label);
        const selectedByKey = thSelectedMedKeys.has(key);
        const selectedByDrug = !selectedByKey && !!drug && thSelectedDrugs.has(drug);
        const checked = !blocked && (selectedByKey || selectedByDrug);
        if (checked) thSelectedMedKeys.add(key);

        const item = document.createElement('div');
        item.className = 'th-med-item';

        const label = document.createElement('label');
        label.className = `th-med-option${blocked ? ' th-med-blocked' : ''}${checked && selectedByDrug ? ' th-med-synced' : ''}`;
        label.innerHTML = `
          <input type="checkbox" data-th-med data-th-key="${key}" data-th-drug="${drug}"
            data-th-label="${choice.label.replace(/"/g, '&quot;')}"
            ${checked ? 'checked' : ''} ${blocked ? 'disabled' : ''}>
          <span>${choice.text}${blocked ? ' <em class="th-med-flag">evitar — alergia relatada</em>' : ''}</span>`;
        item.appendChild(label);

        const routes = blocked ? [] : thRoutesForMed(choice.text, drug);
        if (routes.length) {
          item.appendChild(thBuildRouteRow(key, drug, routes, checked));
        }

        group.appendChild(item);
      });

      box.appendChild(group);
    });

    ul.replaceWith(box);
  });
}

async function showTratamentoHospitalarConditions (conditionIds, opts) {
  const ids = [...new Set((conditionIds || []).filter(Boolean))];
  const conditions = ids
    .map(id => TH_CONDITIONS.find(c => c.id === id))
    .filter(Boolean);
  if (!conditions.length) return;

  if (!(opts && opts.skipGate) && typeof clinicalEnsureAllergyGate === 'function') {
    const ok = await clinicalEnsureAllergyGate();
    if (!ok) return;
  }

  currentThConditionId = conditions.map(c => c.id).join(',');
  document.getElementById('th-list-view').hidden = true;
  document.getElementById('th-condition-view').hidden = false;
  document.getElementById('th-condition-title').textContent = conditions.length > 1
    ? `💊 ${conditions.length} tratamentos · ${conditions.map(c => c.name).join(' · ')}`
    : `${conditions[0].icon} ${conditions[0].name}`;

  const contentEl = document.getElementById('th-condition-content');
  const allergyBanner = typeof clinicalAllergyBannerHtml === 'function' ? clinicalAllergyBannerHtml() : '';
  contentEl.innerHTML = allergyBanner;

  if (conditions.length > 1) {
    const note = document.createElement('p');
    note.className = 'muted th-detail-hint';
    note.textContent = 'Marque as medicações de cada condição abaixo. As queixas foram abertas automaticamente.';
    contentEl.appendChild(note);
  }

  conditions.forEach(condition => {
    const section = document.createElement('section');
    section.className = 'th-multi-block';
    section.innerHTML = `<h3 class="th-multi-title">${condition.icon} ${condition.name}</h3>`;
    const wrap = document.createElement('div');
    wrap.className = 'emerg-algo-block emerg-algo-single';
    wrap.innerHTML = condition.html;
    thBuildSelectableMeds(condition, wrap);
    section.appendChild(wrap);
    contentEl.appendChild(section);
  });

  const applySelection = (input) => {
    const key = input.dataset.thKey;
    const row = contentEl.querySelector(`.th-med-routes[data-th-route-for="${key}"]`);

    if (input.checked) {
      thSelectedMedKeys.add(key);
      if (row) {
        row.hidden = false;
        thSyncRouteRow(row, input.dataset.thDrug);
      }
    } else {
      thSelectedMedKeys.delete(key);
      thSelectedRoutes.delete(key);
      if (row) row.hidden = true;
    }
  };

  contentEl.querySelectorAll('[data-th-med]').forEach(input => {
    input.addEventListener('change', () => {
      applySelection(input);

      // Mesmo fármaco em outra condição acompanha a marcação
      const drug = input.dataset.thDrug;
      const ownCondition = String(input.dataset.thKey || '').split(':')[0];
      if (drug) {
        if (input.checked) thSelectedDrugs.add(drug);
        else thSelectedDrugs.delete(drug);

        contentEl.querySelectorAll('[data-th-med]').forEach(twin => {
          if (twin === input || twin.disabled) return;
          if (twin.dataset.thDrug !== drug) return;
          if (String(twin.dataset.thKey || '').split(':')[0] === ownCondition) return;
          if (twin.checked === input.checked) return;
          twin.checked = input.checked;
          applySelection(twin);
          twin.closest('.th-med-option')?.classList.toggle('th-med-synced', input.checked);
        });
      }

      thUpdateSelectionBar();
    });
  });

  contentEl.querySelectorAll('input[data-th-route]').forEach(radio => {
    radio.addEventListener('change', () => {
      if (!radio.checked) return;
      const key = radio.dataset.thRouteKey;
      const drug = radio.dataset.thRouteDrug;
      thSelectedRoutes.set(key, radio.dataset.thRoute);
      if (drug) thDrugRoutePref.set(drug, radio.dataset.thRoute);
    });
  });

  contentEl.querySelectorAll('[data-th-med]:checked').forEach(input => {
    if (input.dataset.thDrug) thSelectedDrugs.add(input.dataset.thDrug);
  });

  thUpdateSelectionBar();
}

/** Aplica a via preferida do fármaco na linha recém-exibida, se disponível ali */
function thSyncRouteRow (row, drug) {
  const key = row.dataset.thRouteFor;
  const radios = [...row.querySelectorAll('input[data-th-route]')];

  if (!radios.length) {
    const fixed = row.querySelector('.th-route-fixed');
    if (fixed) thSelectedRoutes.set(key, fixed.dataset.thRouteFixed);
    return;
  }

  const preferred = drug ? thDrugRoutePref.get(drug) : null;
  const target = radios.find(r => r.dataset.thRoute === preferred) ||
    radios.find(r => r.checked) ||
    radios[0];

  target.checked = true;
  thSelectedRoutes.set(key, target.dataset.thRoute);
}

function thOpenFromQueixas (queixas, opts) {
  const matches = thMatchConditions(queixas);
  if (!matches.length) {
    showTratamentoHospitalarHome();
    const search = document.getElementById('th-search');
    const first = Array.isArray(queixas) ? queixas[0] : String(queixas || '').split(/[;·,]/)[0];
    if (search && first) {
      search.value = first.trim();
      renderThGrid(thFilterConditions(first));
    }
    return false;
  }
  showTratamentoHospitalarConditions(matches.map(c => c.id), { skipGate: !!(opts && opts.skipGate) });
  return true;
}

function thUpdateSelectionBar () {
  const bar = document.getElementById('th-selection-bar');
  const count = document.getElementById('th-selection-count');
  const clearBtn = document.getElementById('th-clear-selection');
  const copyBtn = document.getElementById('th-copy-selection');
  if (!bar) return;

  const n = thSelectedMedKeys.size;
  bar.hidden = !currentThConditionId;
  if (count) count.textContent = n ? `${n} medicação(ões) selecionada(s)` : 'Nenhuma medicação selecionada';
  if (clearBtn) clearBtn.disabled = n === 0;
  if (copyBtn) copyBtn.disabled = n === 0;
}

function thCopySelection () {
  const lines = [];
  const seenDrugs = new Set();
  document.querySelectorAll('#th-condition-content [data-th-med]:checked').forEach(input => {
    const drug = input.dataset.thDrug;
    if (drug && seenDrugs.has(drug)) return;
    if (drug) seenDrugs.add(drug);

    const route = thSelectedRoutes.get(input.dataset.thKey);
    const routeLabel = route ? ` — via ${TH_ROUTE_LABELS[route] || route.toUpperCase()}` : '';
    const text = input.dataset.thLabel || input.closest('.th-med-option')?.textContent?.trim() || '';
    lines.push(`${lines.length + 1}. ${text}${routeLabel}`);
  });
  if (!lines.length) return;
  const text = lines.join('\n');
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).catch(() => {});
  }
  const copyBtn = document.getElementById('th-copy-selection');
  if (copyBtn) {
    const prev = copyBtn.textContent;
    copyBtn.textContent = 'Copiado!';
    setTimeout(() => { copyBtn.textContent = prev; }, 1500);
  }
}

function thOnSectionShow () {
  thRenderAllergyPanel();
  if (!currentThConditionId) showTratamentoHospitalarHome();
}
