/* Receituário — integração com anamnese e geração de receita */

const MEDHUB_ACTIVE_QUEIXA = 'medhub-active-queixa';
const MEDHUB_ACTIVE_PACIENTE = 'medhub-active-paciente';
const MEDHUB_ACTIVE_IDADE = 'medhub-active-idade';
const MEDHUB_RX_CRM_KEY = 'medhub-rx-crm';
const MEDHUB_RX_CRM_PREFIX = 'CRM-SP';

function rxParseCrmNumber (stored) {
  if (!stored) return '';
  const s = String(stored).trim();
  const prefixed = s.match(/CRM[-\s]*SP\s*(\d+)/i);
  if (prefixed) return prefixed[1];
  return s.replace(/\D/g, '');
}

function rxFormatCrmDisplay (num) {
  const n = rxParseCrmNumber(num);
  return n ? MEDHUB_RX_CRM_PREFIX + ' ' + n : MEDHUB_RX_CRM_PREFIX + ' ____________';
}

function rxGetStoredCrmDisplay () {
  if (typeof medhubGetRxCrmFormatted === 'function') return medhubGetRxCrmFormatted();
  return rxFormatCrmDisplay(localStorage.getItem(MEDHUB_RX_CRM_KEY));
}

function rxGetDoctorName () {
  if (typeof medhubGetRxDoctorName === 'function') return medhubGetRxDoctorName();
  const user = typeof getSession === 'function' ? getSession() : null;
  return (user?.name || '').trim();
}

function rxUpdateProfileHint () {
  const el = document.getElementById('rx-profile-hint');
  if (!el) return;
  const name = rxGetDoctorName();
  const crm = rxGetStoredCrmDisplay();
  const hasCrm = !crm.includes('____________');
  if (name && hasCrm) {
    el.hidden = true;
    return;
  }
  el.hidden = false;
  el.innerHTML = 'Configure <strong>nome e CRM</strong> em Minha conta para aparecer na receita. ' +
    '<button type="button" class="link-btn" onclick="medhubOpenUserProfile()">Abrir configurações</button>';
}

let rxActiveConditionIds = [];
let rxSelectedOptionKeys = new Set();
let rxSelectedMedKeys = new Set();

function rxOptKey (conditionId, optionId) {
  return `${conditionId}|${optionId}`;
}

function rxMedKey (conditionId, medId) {
  return `${conditionId}|${medId}`;
}

function rxParseOptKey (key) {
  const i = key.indexOf('|');
  return i < 0 ? null : { conditionId: key.slice(0, i), optionId: key.slice(i + 1) };
}

function rxParseMedKey (key) {
  const i = key.indexOf('|');
  return i < 0 ? null : { conditionId: key.slice(0, i), medId: key.slice(i + 1) };
}

function rxGetActiveConditions () {
  return rxActiveConditionIds
    .map(id => (typeof rxGetCatalogEntry === 'function' ? rxGetCatalogEntry(id) : null))
    .filter(Boolean);
}

function rxGetCurrentCondition () {
  return rxGetActiveConditions()[0] || null;
}

function rxSyncFromAnamnese () {
  const queixa = document.getElementById('anam-queixa')?.value.trim();
  const paciente = document.getElementById('anam-paciente')?.value.trim();
  const idade = document.getElementById('anam-idade')?.value.trim();
  if (queixa) sessionStorage.setItem(MEDHUB_ACTIVE_QUEIXA, queixa);
  if (paciente) sessionStorage.setItem(MEDHUB_ACTIVE_PACIENTE, paciente);
  if (idade) sessionStorage.setItem(MEDHUB_ACTIVE_IDADE, idade);
  if (typeof clinicalSyncActivePatientFromAnamnese === 'function') {
    clinicalSyncActivePatientFromAnamnese();
  } else if (typeof clinicalSetActiveAllergies === 'function') {
    const alergias = document.getElementById('anam-alergias')?.value?.trim();
    if (alergias) clinicalSetActiveAllergies(alergias);
  }
  rxUpdateQueixaHint();
}

function rxGetActiveQueixa () {
  return sessionStorage.getItem(MEDHUB_ACTIVE_QUEIXA) ||
    document.getElementById('anam-queixa')?.value.trim() || '';
}

function rxGetPatientContext () {
  return {
    paciente: sessionStorage.getItem(MEDHUB_ACTIVE_PACIENTE) ||
      document.getElementById('anam-paciente')?.value.trim() || '',
    idade: sessionStorage.getItem(MEDHUB_ACTIVE_IDADE) ||
      document.getElementById('anam-idade')?.value.trim() || '',
    queixa: rxGetActiveQueixa()
  };
}

function rxRemoveMedsForOption (conditionId, optionId) {
  const condition = typeof rxGetCatalogEntry === 'function' ? rxGetCatalogEntry(conditionId) : null;
  if (!condition) return;
  condition.groups.forEach(group => {
    group.options.forEach(option => {
      if (option.id !== optionId) return;
      rxGetOptionMeds(option, group.label).forEach(m => {
        rxSelectedMedKeys.delete(rxMedKey(conditionId, m.id));
      });
    });
  });
}

function rxAutoSelectMedsForOption (conditionId, option, groupLabel) {
  rxGetOptionMeds(option, groupLabel).forEach(m => {
    if (m.exclusiveGroup) return;
    if (typeof clinicalIsDrugBlocked === 'function' && clinicalIsDrugBlocked(m)) return;
    rxSelectedMedKeys.add(rxMedKey(conditionId, m.id));
  });
}

function rxUpdateQueixaHint () {
  const hint = document.getElementById('anam-queixa-hint');
  if (!hint) return;

  const queixa = document.getElementById('anam-queixa')?.value.trim() || '';
  const matches = typeof rxMatchConditions === 'function' ? rxMatchConditions(queixa) : [];

  if (!queixa || queixa.length < 3 || !matches.length) {
    hint.hidden = true;
    return;
  }

  const totalOpts = matches.reduce((n, c) =>
    n + c.groups.reduce((g, gr) => g + gr.options.length, 0), 0);

  const condLabel = matches.length > 1
    ? `${matches.length} queixas (${matches.map(c => c.name).join(' + ')})`
    : `“${queixa}”`;

  hint.hidden = false;
  hint.innerHTML = `💊 <strong>${totalOpts} opções</strong> em receita combinada para ${condLabel}. ` +
    `<button type="button" class="anamnese-link-rx" id="anam-open-receituario">Abrir Receituário</button>`;

  const btn = document.getElementById('anam-open-receituario');
  if (btn) {
    btn.onclick = () => {
      rxSyncFromAnamnese();
      rxShowCombinedConditions(matches.map(c => c.id), { preserveSelection: false });
      if (typeof showSection === 'function') showSection('receituario');
    };
  }
}

function rxClassifyMedRoute (text) {
  const t = (text || '').toLowerCase();
  if (/^hidratacao|soro de reidratacao|repouso relativo|reforco vacinal nao necessario/.test(t)) return 'geral';
  if (/\b(im|intramuscular)\b/.test(t) || /vacina.*\bim\b|imunoglobulina|penicilina benzatina|soro antitetanico/.test(t)) {
    if (/\bvo\b/.test(t) && !/\bim\b/.test(t)) return 'vo';
    return 'im';
  }
  if (/tenofovir|dolutegravir|emtricitabina|raltegravir|zidovudina|tdf\/|pep hiv|tarv/.test(t)) return 'tarv';
  return 'vo';
}

function rxAppendMedsToLines (lines, entries, startNum) {
  let n = startNum;
  entries.forEach(({ med }) => {
    lines.push(n + '. ' + med.text);
    n += 1;
  });
  return n;
}

function rxFormatReceitaPrint (conditions, medEntries, orientacoesList, validationMessages) {
  const condList = Array.isArray(conditions) ? conditions : (conditions ? [conditions] : []);
  const ctx = rxGetPatientContext();
  const user = typeof getSession === 'function' ? getSession() : null;
  const crm = rxGetStoredCrmDisplay();
  const date = new Date().toLocaleDateString('pt-BR');
  const paciente = ctx.paciente || '________________________________';
  const idade = ctx.idade ? ctx.idade + ' anos' : '________';

  const lines = [
    '                         RECEITUÁRIO SIMPLES',
    '',
    'Paciente: ' + paciente + '                    Data: ' + date,
    'Idade: ' + idade,
    ''
  ];

  if (condList.length > 1) {
    lines.push('Queixas: ' + condList.map(c => c.name).join(' · '));
    lines.push('');
  }

  const byRoute = { vo: [], im: [], tarv: [], geral: [] };
  medEntries.forEach(entry => {
    byRoute[rxClassifyMedRoute(entry.med.text)].push(entry);
  });

  let itemNum = 1;

  if (byRoute.vo.length) {
    lines.push('Uso oral:');
    lines.push('');
    itemNum = rxAppendMedsToLines(lines, byRoute.vo, itemNum);
  }

  if (byRoute.im.length) {
    lines.push('');
    lines.push('Uso IM (aplicar no serviço de saúde):');
    lines.push('');
    itemNum = rxAppendMedsToLines(lines, byRoute.im, itemNum);
  }

  if (byRoute.tarv.length) {
    lines.push('');
    lines.push('PEP HIV / TARV (28 dias — receita especial):');
    lines.push('');
    itemNum = rxAppendMedsToLines(lines, byRoute.tarv, itemNum);
  }

  if (byRoute.geral.length) {
    lines.push('');
    lines.push('Orientações prescritas:');
    lines.push('');
    rxAppendMedsToLines(lines, byRoute.geral, itemNum);
  }

  if (!medEntries.length) {
    lines.push('Uso oral:');
    lines.push('');
  }

  if (orientacoesList.length) {
    lines.push('');
    lines.push('Orientações:');
    orientacoesList.forEach(text => lines.push('• ' + text));
  }

  if (validationMessages.length) {
    lines.push('');
    lines.push('⚠ ATENÇÃO — revisar antes de prescrever:');
    validationMessages.forEach(m => lines.push('• ' + m.text));
  }

  lines.push('');
  lines.push('______________________________, ' + date);
  lines.push('');
  lines.push('Dr(a). ' + (rxGetDoctorName() || '________________________'));
  lines.push('CRM: ' + crm);
  const addr = typeof medhubGetProfileAddressBlock === 'function' ? medhubGetProfileAddressBlock() : '';
  if (addr) {
    lines.push(addr);
  }
  lines.push('');
  lines.push('— Gerado pelo MedHub. Conteúdo educacional; revisar antes de prescrever.');

  return lines.join('\n');
}

function rxRenderPrintPreview (conditions, medEntries, orientacoesList) {
  const condList = Array.isArray(conditions) ? conditions : (conditions ? [conditions] : []);
  const preview = document.getElementById('rx-print-preview');
  if (!preview) return;

  const ctx = rxGetPatientContext();
  const user = typeof getSession === 'function' ? getSession() : null;
  const crm = rxGetStoredCrmDisplay();
  const date = new Date().toLocaleDateString('pt-BR');

  const byRoute = { vo: [], im: [], tarv: [], geral: [] };
  medEntries.forEach(entry => {
    byRoute[rxClassifyMedRoute(entry.med.text)].push(entry);
  });

  const routeBlock = (title, entries) => entries.length
    ? `<p class="rx-print-route"><strong>${title}</strong></p>
       <ol class="rx-print-meds">${entries.map(({ med }) => `<li>${med.text}</li>`).join('')}</ol>`
    : '';

  const queixasLine = condList.length > 1
    ? `<p><strong>Queixas:</strong> ${condList.map(c => c.name).join(' · ')}</p>`
    : '';

  preview.innerHTML = `
    <div class="rx-print-sheet" contenteditable="true" spellcheck="true" lang="pt-BR" aria-label="Receita editável">
      <h4 class="rx-print-title">RECEITUÁRIO SIMPLES</h4>
      <div class="rx-print-meta">
        <p><strong>Paciente:</strong> ${ctx.paciente || '________________________________'}</p>
        <p><strong>Data:</strong> ${date}</p>
        <p><strong>Idade:</strong> ${ctx.idade ? ctx.idade + ' anos' : '________'}</p>
        ${queixasLine}
      </div>
      ${routeBlock('Uso oral:', byRoute.vo)}
      ${routeBlock('Uso IM (aplicar no serviço de saúde):', byRoute.im)}
      ${routeBlock('PEP HIV / TARV (28 dias — receita especial):', byRoute.tarv)}
      ${routeBlock('Orientações prescritas:', byRoute.geral)}
      ${orientacoesList.length ? `
        <div class="rx-print-orient">
          <strong>Orientações:</strong>
          <ul>${orientacoesList.map(t => `<li>${t}</li>`).join('')}</ul>
        </div>` : ''}
      <div class="rx-print-sign">
        <p>______________________________, ${date}</p>
        <p>Dr(a). ${rxGetDoctorName() || '________________________'}</p>
        <p>CRM: ${crm}</p>
        ${(() => {
          const addr = typeof medhubGetProfileAddressBlock === 'function' ? medhubGetProfileAddressBlock() : '';
          return addr ? `<p class="rx-print-address">${addr.replace(/\n/g, '<br>')}</p>` : '';
        })()}
      </div>
    </div>
  `;
}

function rxRenderValidation (messages) {
  const el = document.getElementById('rx-validation');
  if (!el) return;

  if (!messages.length) {
    el.hidden = true;
    el.innerHTML = '';
    return;
  }

  el.hidden = false;
  el.innerHTML = messages.map(m =>
    `<div class="rx-validation-msg rx-validation-msg--${m.severity}">${m.severity === 'error' ? '⛔' : '⚠️'} ${m.text}</div>`
  ).join('');
}

function rxCollectAllSelectedOptions () {
  const out = [];
  rxGetActiveConditions().forEach(condition => {
    const selectedIds = new Set();
    rxSelectedOptionKeys.forEach(key => {
      const parsed = rxParseOptKey(key);
      if (parsed && parsed.conditionId === condition.id) selectedIds.add(parsed.optionId);
    });
    rxCollectSelectedOptions(condition, selectedIds).forEach(item => {
      out.push({ ...item, conditionId: condition.id });
    });
  });
  return out;
}

function rxCollectAllSelectedMeds () {
  const out = [];
  rxGetActiveConditions().forEach(condition => {
    rxSelectedMedKeys.forEach(key => {
      const parsed = rxParseMedKey(key);
      if (!parsed || parsed.conditionId !== condition.id) return;
      const found = rxFindMed(condition, parsed.medId);
      if (found) out.push({ ...found, conditionId: condition.id });
    });
  });
  return out;
}

function rxPurgeBlockedSelectedMeds () {
  if (typeof clinicalIsDrugBlocked !== 'function') return;
  [...rxSelectedMedKeys].forEach(key => {
    const parsed = rxParseMedKey(key);
    if (!parsed) return;
    const condition = typeof rxGetCatalogEntry === 'function' ? rxGetCatalogEntry(parsed.conditionId) : null;
    if (!condition) return;
    const found = rxFindMed(condition, parsed.medId);
    if (found && clinicalIsDrugBlocked(found.med)) rxSelectedMedKeys.delete(key);
  });
}

function rxFilterMedsByAllergy (meds) {
  return typeof clinicalFilterDrugsByAllergy === 'function' ? clinicalFilterDrugsByAllergy(meds) : meds;
}

function rxRenderMedsPanel () {
  const panel = document.getElementById('rx-meds-panel');
  const conditions = rxGetActiveConditions();
  if (!panel || !conditions.length) return;

  rxPurgeBlockedSelectedMeds();

  const selections = rxCollectAllSelectedOptions();
  if (!selections.length) {
    panel.hidden = true;
    panel.innerHTML = '';
    return;
  }

  const allergyBanner = typeof clinicalAllergyBannerHtml === 'function' ? clinicalAllergyBannerHtml() : '';

  panel.hidden = false;
  panel.innerHTML = `
    <h3 class="rx-meds-title">Escolha os medicamentos</h3>
    ${allergyBanner}
    <p class="muted rx-meds-hint">Onde houver alternativas (OU), marque <strong>apenas uma</strong> opção — ex.: naproxeno <em>ou</em> ibuprofeno.</p>
    ${selections.map(({ conditionId, group, option }) => {
      const condition = conditions.find(c => c.id === conditionId);
      const condLabel = condition ? `${condition.icon} ${condition.name}` : conditionId;
      const meds = rxFilterMedsByAllergy(rxGetOptionMeds(option, group.label));
      if (!meds.length) {
        return `
          <fieldset class="rx-meds-group">
            <legend>${condLabel} — ${group.label} — ${option.label}</legend>
            <p class="muted">Nenhuma opção disponível — medicamentos deste esquema foram ocultados por alergia do paciente.</p>
          </fieldset>`;
      }
      const grouped = {};
      const standalone = [];
      meds.forEach(m => {
        if (m.exclusiveGroup) {
          if (!grouped[m.exclusiveGroup]) grouped[m.exclusiveGroup] = [];
          grouped[m.exclusiveGroup].push(m);
        } else {
          standalone.push(m);
        }
      });

      return `
        <fieldset class="rx-meds-group">
          <legend>${condLabel} — ${group.label} — ${option.label}</legend>
          ${Object.values(grouped).map(groupMeds => `
            <div class="rx-med-alt-group" role="radiogroup" aria-label="Alternativa">
              <span class="rx-med-alt-label">Escolha uma:</span>
              ${groupMeds.map(m => `
                <label class="rx-med-item rx-med-item--radio">
                  <input type="radio" name="rx-alt-${conditionId}-${m.exclusiveGroup}" value="${m.id}"
                    data-cond-id="${conditionId}" data-med-id="${m.id}" data-opt-id="${option.id}"
                    ${rxSelectedMedKeys.has(rxMedKey(conditionId, m.id)) ? 'checked' : ''}>
                  <span>${m.text}</span>
                </label>
              `).join('')}
            </div>
          `).join('')}
          ${standalone.map(m => `
            <label class="rx-med-item">
              <input type="checkbox" data-cond-id="${conditionId}" data-med-id="${m.id}" data-opt-id="${option.id}"
                ${rxSelectedMedKeys.has(rxMedKey(conditionId, m.id)) ? 'checked' : ''}>
              <span>${m.text}</span>
            </label>
          `).join('')}
        </fieldset>
      `;
    }).join('')}
  `;

  panel.querySelectorAll('input[type="radio"]').forEach(input => {
    input.addEventListener('change', () => {
      if (!input.checked) return;
      const condId = input.dataset.condId;
      const groupName = input.name;
      panel.querySelectorAll(`input[name="${groupName}"]`).forEach(r => {
        rxSelectedMedKeys.delete(rxMedKey(condId, r.dataset.medId));
      });
      rxSelectedMedKeys.add(rxMedKey(condId, input.dataset.medId));
      rxUpdateSelectionBar();
    });
  });

  panel.querySelectorAll('input[type="checkbox"]').forEach(input => {
    input.addEventListener('change', () => {
      const key = rxMedKey(input.dataset.condId, input.dataset.medId);
      if (input.checked) rxSelectedMedKeys.add(key);
      else rxSelectedMedKeys.delete(key);
      rxUpdateSelectionBar();
    });
  });
}

function rxGetValidationState () {
  const conditions = rxGetActiveConditions();
  if (!conditions.length || !rxSelectedOptionKeys.size) {
    return { messages: [], medEntries: [], canGenerate: false };
  }

  let messages = [];
  let groupsOk = true;

  conditions.forEach(condition => {
    const selectedIds = new Set();
    rxSelectedOptionKeys.forEach(key => {
      const parsed = rxParseOptKey(key);
      if (parsed && parsed.conditionId === condition.id) selectedIds.add(parsed.optionId);
    });
    messages = messages.concat(rxValidateSchemes(condition, selectedIds));
    const selectedMedIds = new Set();
    rxSelectedMedKeys.forEach(key => {
      const parsed = rxParseMedKey(key);
      if (parsed && parsed.conditionId === condition.id) selectedMedIds.add(parsed.medId);
    });
    if (!rxExclusiveGroupsComplete(condition, selectedIds, selectedMedIds)) groupsOk = false;
  });

  const medEntries = rxCollectAllSelectedMeds();
  const medMessages = rxValidateMeds(medEntries);
  const conditionMessages = conditions.flatMap(condition => {
    const subset = medEntries.filter(e => e.conditionId === condition.id);
    return typeof rxValidateConditionMeds === 'function'
      ? rxValidateConditionMeds(condition, subset)
      : [];
  });

  messages = [...messages, ...medMessages, ...conditionMessages];
  const hasMeds = medEntries.length > 0;
  const canGenerate = hasMeds && groupsOk && !rxHasValidationErrors(messages);

  return { messages, medEntries, canGenerate, groupsOk, hasMeds };
}

function rxUpdateSelectionBar () {
  const conditions = rxGetActiveConditions();
  const bar = document.getElementById('rx-selection-bar');
  const countEl = document.getElementById('rx-selection-count');
  const generateBtn = document.getElementById('rx-generate');
  const clearBtn = document.getElementById('rx-clear-selection');
  const { messages, medEntries, canGenerate, groupsOk, hasMeds } = rxGetValidationState();

  if (countEl) {
    const optCount = rxSelectedOptionKeys.size;
    const medCount = medEntries.length;
    const condCount = conditions.length;
    if (!optCount) countEl.textContent = 'Nenhum esquema selecionado';
    else if (!groupsOk) countEl.textContent = `${condCount > 1 ? condCount + ' queixas · ' : ''}${optCount} esquema(s) — escolha as alternativas (OU) abaixo`;
    else countEl.textContent = `${condCount > 1 ? condCount + ' queixas · ' : ''}${optCount} esquema(s), ${medCount} medicamento(s)`;
  }

  if (!groupsOk && rxSelectedOptionKeys.size) {
    const pending = [];
    rxCollectAllSelectedOptions().forEach(({ conditionId, group, option }) => {
      const condition = conditions.find(c => c.id === conditionId);
      if (!condition) return;
      const meds = rxGetOptionMeds(option, group.label);
      const groups = [...new Set(meds.filter(m => m.exclusiveGroup).map(m => m.exclusiveGroup))];
      groups.forEach(g => {
        if (!meds.some(m => m.exclusiveGroup === g && rxSelectedMedKeys.has(rxMedKey(conditionId, m.id)))) {
          pending.push({ severity: 'warning', text: `Em “${option.label}” (${condition.name}), selecione uma alternativa (OU) antes de gerar.` });
        }
      });
    });
    rxRenderValidation([...messages, ...pending]);
  } else if (!hasMeds && rxSelectedOptionKeys.size) {
    rxRenderValidation([...messages, { severity: 'warning', text: 'Selecione ao menos um medicamento abaixo.' }]);
  } else {
    rxRenderValidation(messages);
  }

  if (generateBtn) generateBtn.disabled = !canGenerate;
  if (clearBtn) clearBtn.disabled = rxSelectedOptionKeys.size === 0;
  if (bar) bar.hidden = false;
}

function rxToggleOption (conditionId, optId) {
  const condition = typeof rxGetCatalogEntry === 'function' ? rxGetCatalogEntry(conditionId) : null;
  if (!condition) return;

  let option = null;
  let groupLabel = '';
  condition.groups.forEach(g => {
    g.options.forEach(o => {
      if (o.id === optId) {
        option = o;
        groupLabel = g.label;
      }
    });
  });
  if (!option) return;

  const key = rxOptKey(conditionId, optId);
  if (rxSelectedOptionKeys.has(key)) {
    rxSelectedOptionKeys.delete(key);
    rxRemoveMedsForOption(conditionId, optId);
  } else {
    rxSelectedOptionKeys.add(key);
    rxAutoSelectMedsForOption(conditionId, option, groupLabel);
  }

  document.querySelectorAll('.rx-option-card').forEach(card => {
    const selected = rxSelectedOptionKeys.has(rxOptKey(card.dataset.condId, card.dataset.optId));
    card.classList.toggle('rx-option-card--selected', selected);
    card.setAttribute('aria-pressed', selected ? 'true' : 'false');
  });

  rxRenderMedsPanel();
  rxUpdateSelectionBar();

  const resultEl = document.getElementById('rx-result');
  if (resultEl && rxSelectedOptionKeys.size === 0) resultEl.hidden = true;
}

function rxGenerateReceita () {
  const conditions = rxGetActiveConditions();
  if (!conditions.length) return;

  const { medEntries, messages, canGenerate } = rxGetValidationState();
  if (!canGenerate) return;

  const orientacoesList = [];
  const seenOrient = new Set();
  medEntries.forEach(({ option }) => {
    if (option.orientacoes && !seenOrient.has(option.orientacoes)) {
      seenOrient.add(option.orientacoes);
      orientacoesList.push(option.orientacoes);
    }
  });

  const text = rxFormatReceitaPrint(conditions, medEntries, orientacoesList, messages.filter(m => m.severity === 'warning'));
  const resultEl = document.getElementById('rx-result');
  const textEl = document.getElementById('rx-result-text');
  if (!resultEl || !textEl) return;

  textEl.value = text;
  rxRenderPrintPreview(conditions, medEntries, orientacoesList);
  resultEl.hidden = false;
  resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/** Receituário em branco — só identificação do médico (nome + CRM) */
function rxGenerateBlankReceita () {
  const listView = document.getElementById('rx-list-view');
  const detailView = document.getElementById('rx-detail-view');
  const titleEl = document.getElementById('rx-condition-title');
  const hintEl = document.querySelector('.rx-detail-hint');
  const optionsWrap = document.getElementById('rx-options-wrap');
  const medsPanel = document.getElementById('rx-meds-panel');
  const selectionBar = document.getElementById('rx-selection-bar');
  const validation = document.getElementById('rx-validation');
  const sourceBanner = document.getElementById('rx-source-banner');
  const resultEl = document.getElementById('rx-result');
  const textEl = document.getElementById('rx-result-text');
  const preview = document.getElementById('rx-print-preview');

  if (!resultEl || !preview) return;

  rxActiveConditionIds = [];
  rxSelectedOptionKeys.clear();
  rxSelectedMedKeys.clear();

  if (listView) listView.hidden = true;
  if (detailView) detailView.hidden = false;
  if (titleEl) titleEl.textContent = 'Receituário em branco';
  if (hintEl) hintEl.textContent = 'Apenas nome e CRM do médico. Edite o corpo se quiser anotar à mão após imprimir.';
  if (optionsWrap) { optionsWrap.innerHTML = ''; optionsWrap.hidden = true; }
  if (medsPanel) { medsPanel.hidden = true; medsPanel.innerHTML = ''; }
  if (selectionBar) selectionBar.hidden = true;
  if (validation) { validation.hidden = true; validation.innerHTML = ''; }
  if (sourceBanner) { sourceBanner.hidden = true; sourceBanner.innerHTML = ''; }

  const crm = rxGetStoredCrmDisplay();
  const date = new Date().toLocaleDateString('pt-BR');
  const doctor = rxGetDoctorName() || '________________________';
  const addr = typeof medhubGetProfileAddressBlock === 'function' ? medhubGetProfileAddressBlock() : '';

  const plain = [
    'RECEITUÁRIO EM BRANCO',
    '',
    'Paciente: ________________________________',
    'Data: ' + date,
    'Idade: ________',
    '',
    'Uso oral:',
    '',
    'Uso IM:',
    '',
    'Uso EV:',
    '',
    'Uso tópico:',
    '',
    'Uso inalatório:',
    '',
    'Orientações:',
    '',
    '______________________________, ' + date,
    '',
    'Dr(a). ' + doctor,
    'CRM: ' + crm,
    addr || '',
    '',
    '— Gerado pelo MedHub. Conteúdo educacional; revisar antes de prescrever.'
  ].join('\n');

  if (textEl) textEl.value = plain;

  preview.innerHTML = `
    <div class="rx-print-sheet" contenteditable="true" spellcheck="true" lang="pt-BR" aria-label="Receituário em branco editável">
      <h4 class="rx-print-title">RECEITUÁRIO EM BRANCO</h4>
      <div class="rx-print-meta">
        <p><strong>Paciente:</strong> ________________________________</p>
        <p><strong>Data:</strong> ${date}</p>
        <p><strong>Idade:</strong> ________</p>
      </div>
      <p class="rx-print-route"><strong>Uso oral:</strong></p>
      <p class="rx-print-route"><strong>Uso IM:</strong></p>
      <p class="rx-print-route"><strong>Uso EV:</strong></p>
      <p class="rx-print-route"><strong>Uso tópico:</strong></p>
      <p class="rx-print-route"><strong>Uso inalatório:</strong></p>
      <p class="rx-print-route"><strong>Orientações:</strong></p>
      <div class="rx-print-sign">
        <p>______________________________, ${date}</p>
        <p>Dr(a). ${doctor}</p>
        <p>CRM: ${crm}</p>
        ${addr ? `<p class="rx-print-address">${addr.replace(/\n/g, '<br>')}</p>` : ''}
      </div>
    </div>
  `;

  resultEl.hidden = false;
  const resultTitle = resultEl.querySelector('h3');
  if (resultTitle) resultTitle.textContent = 'Receituário em branco';
  resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function rxClearSelection () {
  rxSelectedOptionKeys.clear();
  rxSelectedMedKeys.clear();
  document.querySelectorAll('.rx-option-card').forEach(card => {
    card.classList.remove('rx-option-card--selected');
    card.setAttribute('aria-pressed', 'false');
  });
  const panel = document.getElementById('rx-meds-panel');
  if (panel) { panel.hidden = true; panel.innerHTML = ''; }
  const resultEl = document.getElementById('rx-result');
  if (resultEl) resultEl.hidden = true;
  rxUpdateSelectionBar();
}

function rxRenderConditionList (filterText) {
  const grid = document.getElementById('rx-condition-grid');
  if (!grid) return;

  const norm = typeof rxNormText === 'function' ? rxNormText(filterText) : '';
  const activeQueixa = rxGetActiveQueixa();
  const fromQueixa = typeof rxMatchConditions === 'function' ? rxMatchConditions(activeQueixa) : [];

  let list = (typeof rxGetCatalog === 'function' ? rxGetCatalog() : []).slice();
  if (norm) {
    list = list.filter(c =>
      rxNormText(c.name).includes(norm) ||
      c.aliases.some(a => rxNormText(a).includes(norm))
    );
  }

  grid.innerHTML = list.map(c => `
    <button type="button" class="calc-category-btn rx-condition-btn" data-rx-id="${c.id}">
      <span class="calc-category-icon">${c.icon}</span>
      <span class="calc-category-name">${c.name}</span>
    </button>
  `).join('');

  grid.querySelectorAll('.rx-condition-btn').forEach(btn => {
    btn.addEventListener('click', () => rxShowCondition(btn.dataset.rxId));
  });

  const suggestEl = document.getElementById('rx-suggest-banner');
  if (suggestEl) {
    if (fromQueixa.length && activeQueixa.length >= 3) {
      suggestEl.hidden = false;
      const multi = fromQueixa.length > 1;
      suggestEl.innerHTML = (multi
        ? `<p class="rx-suggest-lead">Detectadas <strong>${fromQueixa.length} queixas</strong> na anamnese:</p>`
        : `<p class="rx-suggest-lead">Sugerido pela anamnese:</p>`) +
        fromQueixa.map(c =>
          `<button type="button" class="rx-suggest-chip" data-rx-id="${c.id}">${c.icon} ${c.name}</button>`
        ).join(' ') +
        (multi
          ? ` <button type="button" class="btn rx-suggest-combine" id="rx-open-combined">Abrir receita combinada (${fromQueixa.length})</button>`
          : '');
      suggestEl.querySelectorAll('.rx-suggest-chip').forEach(chip => {
        chip.addEventListener('click', () => rxShowCombinedConditions([chip.dataset.rxId]));
      });
      const combineBtn = document.getElementById('rx-open-combined');
      if (combineBtn) {
        combineBtn.addEventListener('click', () => {
          rxShowCombinedConditions(fromQueixa.map(c => c.id));
        });
      }
    } else {
      suggestEl.hidden = true;
    }
  }
}

function rxRenderConditionOptions (condition) {
  return condition.groups.map((group, idx) => `
    <fieldset class="ps-rx-fieldset rx-options-group${condition.hasEtiology ? ' rx-options-group--etiology' : ''}${condition.hasEtiology && idx === 0 ? ' rx-options-group--primary' : ''}">
      <legend>${group.label}</legend>
      <div class="rx-option-list">
        ${group.options.map(opt => {
          const medCount = rxGetOptionMeds(opt, group.label).length;
          const selected = rxSelectedOptionKeys.has(rxOptKey(condition.id, opt.id));
          return `
          <button type="button" class="rx-option-card${selected ? ' rx-option-card--selected' : ''}"
            data-cond-id="${condition.id}" data-opt-id="${opt.id}" aria-pressed="${selected ? 'true' : 'false'}">
            <span class="rx-option-card-head">
              <span class="rx-option-check" aria-hidden="true"></span>
              <span class="ps-rx-tier ps-rx-tier--${opt.tier.replace(/\s+/g, '')}">${opt.tier}</span>
            </span>
            <strong>${opt.label}</strong>
            <span class="rx-option-preview">${medCount} medicamento(s) — escolher na etapa seguinte</span>
          </button>`;
        }).join('')}
      </div>
    </fieldset>
  `).join('');
}

function rxShowCombinedConditions (conditionIds, opts) {
  const preserve = opts && opts.preserveSelection;
  const ids = [...new Set((conditionIds || []).filter(Boolean))];
  const conditions = ids
    .map(id => (typeof rxGetCatalogEntry === 'function' ? rxGetCatalogEntry(id) : null))
    .filter(Boolean);
  if (!conditions.length) return;

  rxActiveConditionIds = conditions.map(c => c.id);
  if (!preserve) {
    rxSelectedOptionKeys.clear();
    rxSelectedMedKeys.clear();
  }

  const listView = document.getElementById('rx-list-view');
  const detailView = document.getElementById('rx-detail-view');
  const titleEl = document.getElementById('rx-condition-title');
  const optionsEl = document.getElementById('rx-options-wrap');
  const resultEl = document.getElementById('rx-result');
  const medsPanel = document.getElementById('rx-meds-panel');
  const detailHint = detailView && detailView.querySelector('.rx-detail-hint');
  if (!listView || !detailView || !optionsEl) return;

  listView.hidden = true;
  detailView.hidden = false;

  if (titleEl) {
    titleEl.textContent = conditions.length > 1
      ? conditions.map(c => c.icon + ' ' + c.name).join(' + ')
      : conditions[0].icon + ' ' + conditions[0].name;
  }
  if (detailHint) {
    if (conditions.length === 1 && conditions[0].hasEtiology) {
      detailHint.textContent = '1) Confirme a etiologia (seções numeradas por frequência). 2) Marque o esquema da seção correta. 3) Escolha os medicamentos e gere a receita.';
    } else if (conditions.length > 1) {
      detailHint.textContent = 'Receita combinada — marque esquemas de cada queixa abaixo. Todos os medicamentos sairão em uma única receita.';
    } else {
      detailHint.textContent = '1) Marque o esquema (ex.: AINE). 2) Escolha o medicamento na lista. 3) Gere a receita para imprimir.';
    }
  }
  if (resultEl) resultEl.hidden = true;
  if (medsPanel) { medsPanel.hidden = true; medsPanel.innerHTML = ''; }

  const sourceBanner = document.getElementById('rx-source-banner');
  if (sourceBanner) {
    if (conditions.length > 1) {
      sourceBanner.hidden = false;
      sourceBanner.innerHTML = '📋 <strong>Receita combinada</strong> — selecione opções em cada queixa. Validações (ex.: dois AINEs) aplicam-se à receita inteira.';
    } else if (conditions[0].source === 'guideline') {
      sourceBanner.hidden = false;
      sourceBanner.innerHTML = conditions[0].hasEtiology
        ? '📋 <strong>Protocolo com múltiplas etiologias</strong> — seções ordenadas da mais comum à menos comum. Prescreva apenas a seção compatível com o quadro.'
        : '📋 Opções extraídas do <strong>protocolo PS MedHub</strong> (diretriz). Selecione o esquema, escolha os medicamentos e edite a receita antes de imprimir.';
    } else if (conditions[0].source === 'reference') {
      sourceBanner.hidden = false;
      sourceBanner.innerHTML = '📖 Condição sem modelo VO detalhado — use o protocolo PS como referência, selecione a opção abaixo e <strong>edite a receita</strong> manualmente.';
    } else {
      sourceBanner.hidden = false;
      sourceBanner.innerHTML = '✓ Modelo completo com apresentações VO revisadas. Selecione esquemas, medicamentos e edite a receita livremente.';
    }
  }

  optionsEl.innerHTML = conditions.map(condition => `
    <section class="rx-multi-block" data-rx-cond-id="${condition.id}">
      <h3 class="rx-multi-title">${condition.icon} ${condition.name}</h3>
      ${condition.hasEtiology && condition.etiologyHint ? `<p class="rx-etiology-hint">${condition.etiologyHint}</p>` : ''}
      ${rxRenderConditionOptions(condition)}
    </section>
  `).join('');

  optionsEl.querySelectorAll('.rx-option-card').forEach(btn => {
    btn.addEventListener('click', () => rxToggleOption(btn.dataset.condId, btn.dataset.optId));
  });

  rxUpdateSelectionBar();
}

function rxShowCondition (conditionId) {
  rxShowCombinedConditions([conditionId]);
}

function rxShowList () {
  const listView = document.getElementById('rx-list-view');
  const detailView = document.getElementById('rx-detail-view');
  if (listView) listView.hidden = false;
  if (detailView) detailView.hidden = true;
  const sourceBanner = document.getElementById('rx-source-banner');
  if (sourceBanner) { sourceBanner.hidden = true; sourceBanner.innerHTML = ''; }
  const optionsWrap = document.getElementById('rx-options-wrap');
  if (optionsWrap) optionsWrap.hidden = false;
  const hintEl = document.querySelector('.rx-detail-hint');
  if (hintEl) {
    hintEl.textContent = '1) Marque o esquema. 2) Escolha o medicamento. 3) Gere a receita.';
  }
  const resultTitle = document.querySelector('#rx-result h3');
  if (resultTitle) resultTitle.textContent = 'Receita gerada';
  rxActiveConditionIds = [];
  rxSelectedOptionKeys.clear();
  rxSelectedMedKeys.clear();
  rxRenderConditionList(document.getElementById('rx-search')?.value || '');
}

function rxGetEditableSheet () {
  return document.querySelector('#rx-print-preview .rx-print-sheet');
}

function rxGetReceitaPlainText () {
  const sheet = rxGetEditableSheet();
  return sheet ? sheet.innerText.trim() : '';
}

function rxCopyReceita () {
  const text = rxGetReceitaPlainText();
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    alert('Receita copiada para a área de transferência.');
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    alert('Receita copiada.');
  });
}

function rxPrintReceita () {
  const sheet = rxGetEditableSheet();
  if (!sheet) return;

  const win = window.open('', '_blank', 'width=720,height=900');
  if (!win) {
    alert('Permita pop-ups para imprimir a receita.');
    return;
  }

  win.document.write(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Receituário — MedHub</title>
      <style>
        body { font-family: Georgia, 'Times New Roman', serif; color: #111; margin: 2rem; line-height: 1.5; }
        .rx-print-title { text-align: center; letter-spacing: 0.08em; font-size: 1.1rem; margin-bottom: 1.5rem; }
        .rx-print-meta p { margin: 0.25rem 0; }
        .rx-print-route { margin: 1.25rem 0 0.5rem; }
        .rx-print-meds { margin: 0.5rem 0 1rem 1.25rem; padding: 0; }
        .rx-print-meds li { margin-bottom: 0.65rem; }
        .rx-print-orient ul { margin: 0.35rem 0 0 1rem; }
        .rx-print-sign { margin-top: 2.5rem; }
        @media print { body { margin: 1.5cm; } }
      </style>
    </head>
    <body>${sheet.outerHTML}</body>
    </html>
  `);
  win.document.close();
  win.focus();
  win.print();
}

function rxOnSectionShow () {
  rxUpdateProfileHint();
  if (typeof clinicalInvalidateAllergyCache === 'function') clinicalInvalidateAllergyCache();
  rxRenderConditionList(document.getElementById('rx-search')?.value || '');
  const activeQueixa = rxGetActiveQueixa();
  const matches = typeof rxMatchConditions === 'function' ? rxMatchConditions(activeQueixa) : [];
  if (matches.length && activeQueixa.length >= 3) {
    rxShowCombinedConditions(matches.map(c => c.id));
  } else if (rxActiveConditionIds.length) {
    rxPurgeBlockedSelectedMeds();
    rxRenderMedsPanel();
    rxUpdateSelectionBar();
  }
}

function initReceituario () {
  const search = document.getElementById('rx-search');
  const backBtn = document.getElementById('rx-back');
  const copyBtn = document.getElementById('rx-copy');
  const printBtn = document.getElementById('rx-print');
  const generateBtn = document.getElementById('rx-generate');
  const clearBtn = document.getElementById('rx-clear-selection');
  const crmInput = document.getElementById('rx-crm');

  if (crmInput) {
    crmInput.value = rxParseCrmNumber(localStorage.getItem(MEDHUB_RX_CRM_KEY));
    const saveCrm = () => {
      const num = crmInput.value.replace(/\D/g, '');
      crmInput.value = num;
      localStorage.setItem(MEDHUB_RX_CRM_KEY, num);
    };
    crmInput.addEventListener('input', () => {
      const num = crmInput.value.replace(/\D/g, '');
      if (crmInput.value !== num) crmInput.value = num;
    });
    crmInput.addEventListener('change', saveCrm);
    crmInput.addEventListener('blur', saveCrm);
  }

  rxUpdateProfileHint();

  if (search) search.addEventListener('input', () => rxRenderConditionList(search.value));
  if (backBtn) backBtn.addEventListener('click', rxShowList);
  if (copyBtn) copyBtn.addEventListener('click', rxCopyReceita);
  if (printBtn) printBtn.addEventListener('click', rxPrintReceita);
  if (generateBtn) generateBtn.addEventListener('click', rxGenerateReceita);
  if (clearBtn) clearBtn.addEventListener('click', rxClearSelection);

  const blankBtn = document.getElementById('rx-blank');
  if (blankBtn && !blankBtn.dataset.bound) {
    blankBtn.dataset.bound = '1';
    blankBtn.addEventListener('click', rxGenerateBlankReceita);
  }

  rxRenderConditionList('');
}

function initAnamneseReceituarioLink () {
  const queixaEl = document.getElementById('anam-queixa');
  if (!queixaEl) return;

  queixaEl.addEventListener('input', () => rxSyncFromAnamnese());
  queixaEl.addEventListener('blur', rxSyncFromAnamnese);
  rxUpdateQueixaHint();
}
