/* Tratamento hospitalar — condições com medicação IM/EV e navegação */

const MEDHUB_TH_BUILD = 'th-auto-v1';

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

function thParseQueixaSegments (queixa) {
  if (Array.isArray(queixa)) return queixa.map(s => String(s || '').trim()).filter(s => s.length >= 2);
  if (!queixa || !String(queixa).trim()) return [];
  return String(queixa)
    .split(/[,;\n]+|\s+\be\s+|\s+\/\s+|\s+\+\s+/i)
    .map(s => s.trim())
    .filter(s => s.length >= 2);
}

function thMatchScore (cond, norm) {
  if (!norm || norm.length < 2) return 0;
  let score = 0;
  const aliases = cond.aliases || [];
  const nameNorm = thNormText(cond.name);

  if (aliases.some(a => thNormText(a) === norm)) score += 200;
  else if (aliases.some(a => {
    const an = thNormText(a);
    return an.length >= 4 && (norm.includes(an) || an.includes(norm));
  })) score += 120;
  else if (nameNorm.includes(norm) && norm.length >= 4) score += 80;
  else if (norm.includes(nameNorm.split(' ')[0]) && nameNorm.split(' ')[0].length >= 5) score += 60;

  if (/ombro|omalgia|joelho|cervical|musculoesquelet|artralgia|dor muscular/.test(norm) && cond.id === 'artralgia-dor-msk') {
    score += 80;
  }
  if (/cefaleia|dor de cabeca|enxaqueca|migranea|headache/.test(norm) && cond.id === 'cefaleia') {
    score += 80;
  }

  return score;
}

function thMatchConditions (queixa) {
  const segments = thParseQueixaSegments(queixa);
  const queries = segments.length ? segments : [String(queixa || '')];
  const byId = new Map();

  queries.forEach(q => {
    const norm = thNormText(q);
    if (!norm || norm.length < 2) return;
    TH_CONDITIONS.forEach(cond => {
      const score = thMatchScore(cond, norm);
      if (score >= 50) {
        const prev = byId.get(cond.id);
        if (!prev || score > prev.score) byId.set(cond.id, { cond, score });
      }
    });
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

function thSplitMedChoices (liText) {
  const raw = String(liText || '').replace(/\s+/g, ' ').trim();
  if (!raw) return [];

  const colonIdx = raw.search(/:\s/);
  let prefix = '';
  let body = raw;
  if (colonIdx >= 0 && colonIdx < 80) {
    prefix = raw.slice(0, colonIdx).trim();
    body = raw.slice(colonIdx + 1).trim();
  }

  const parts = body
    .split(/\s·\s|\s•\s/)
    .map(p => p.trim())
    .filter(Boolean);

  if (parts.length <= 1) {
    return [{ key: raw, label: raw, prefix: '' }];
  }

  return parts.map((part, i) => ({
    key: `${prefix}::${i}::${part}`,
    label: prefix ? `${prefix}: ${part}` : part,
    prefix
  }));
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
      document.querySelectorAll('#th-condition-content [data-th-med]').forEach(input => {
        input.checked = false;
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

function thBuildSelectableMeds (condition, wrap) {
  wrap.querySelectorAll('ul.ps-med-options').forEach(ul => {
    const items = [...ul.querySelectorAll(':scope > li')];
    const box = document.createElement('div');
    box.className = 'th-med-options';

    items.forEach((li, liIdx) => {
      const choices = thSplitMedChoices(li.textContent);
      const group = document.createElement('div');
      group.className = 'th-med-group';

      choices.forEach((choice, cIdx) => {
        const blocked = thIsMedBlocked(choice.label);
        if (blocked) return;

        const key = `${condition.id}:${liIdx}:${cIdx}`;
        const label = document.createElement('label');
        label.className = 'th-med-option';
        label.innerHTML = `
          <input type="checkbox" data-th-med data-th-key="${key}" data-th-label="${choice.label.replace(/"/g, '&quot;')}"
            ${thSelectedMedKeys.has(key) ? 'checked' : ''}>
          <span>${choice.label}</span>`;
        group.appendChild(label);
      });

      if (group.children.length) box.appendChild(group);
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

  contentEl.querySelectorAll('[data-th-med]').forEach(input => {
    input.addEventListener('change', () => {
      const key = input.dataset.thKey;
      if (input.checked) thSelectedMedKeys.add(key);
      else thSelectedMedKeys.delete(key);
      thUpdateSelectionBar();
    });
  });

  thUpdateSelectionBar();
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
  document.querySelectorAll('#th-condition-content [data-th-med]:checked').forEach((input, i) => {
    lines.push(`${i + 1}. ${input.dataset.thLabel || input.parentElement?.textContent?.trim() || ''}`);
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
