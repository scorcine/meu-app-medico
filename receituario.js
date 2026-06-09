/* Receituário — integração com anamnese e geração de receita */

const MEDHUB_ACTIVE_QUEIXA = 'medhub-active-queixa';
const MEDHUB_ACTIVE_PACIENTE = 'medhub-active-paciente';
const MEDHUB_ACTIVE_IDADE = 'medhub-active-idade';
const MEDHUB_RX_CRM_KEY = 'medhub-rx-crm';

let rxSelectedConditionId = null;
let rxSelectedOptionIds = new Set();

function rxSyncFromAnamnese () {
  const queixa = document.getElementById('anam-queixa')?.value.trim();
  const paciente = document.getElementById('anam-paciente')?.value.trim();
  const idade = document.getElementById('anam-idade')?.value.trim();
  if (queixa) sessionStorage.setItem(MEDHUB_ACTIVE_QUEIXA, queixa);
  if (paciente) sessionStorage.setItem(MEDHUB_ACTIVE_PACIENTE, paciente);
  if (idade) sessionStorage.setItem(MEDHUB_ACTIVE_IDADE, idade);
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

function rxGetCurrentCondition () {
  return RX_CATALOG.find(c => c.id === rxSelectedConditionId) || null;
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

  hint.hidden = false;
  hint.innerHTML = `💊 <strong>${totalOpts} receita(s)</strong> disponíveis para “${queixa}”. ` +
    `<button type="button" class="anamnese-link-rx" id="anam-open-receituario">Abrir Receituário</button>`;

  const btn = document.getElementById('anam-open-receituario');
  if (btn) {
    btn.onclick = () => {
      rxSyncFromAnamnese();
      if (matches[0]) rxSelectedConditionId = matches[0].id;
      if (typeof showSection === 'function') showSection('receituario');
    };
  }
}

function rxFormatReceitaMulti (condition, selections, validationMessages) {
  const ctx = rxGetPatientContext();
  const user = typeof getSession === 'function' ? getSession() : null;
  const crm = localStorage.getItem(MEDHUB_RX_CRM_KEY) || '____________';
  const date = new Date().toLocaleDateString('pt-BR');
  const lines = [
    'RECEITUÁRIO SIMPLES',
    '==================',
    '',
    'Paciente: ' + (ctx.paciente || '________________________________'),
    'Idade: ' + (ctx.idade || '________'),
    'Queixa: ' + (ctx.queixa || condition.name),
    '',
    condition.name,
    selections.length === 1
      ? selections[0].group.label + ' — ' + selections[0].option.label
      : selections.length + ' opção(ões) selecionada(s)',
    ''
  ];

  let itemNum = 1;
  selections.forEach(({ group, option }) => {
    if (selections.length > 1) {
      lines.push('— ' + group.label + ': ' + option.label + ' (' + option.tier + ')');
    } else {
      lines.push(option.label + ' (' + option.tier + ')');
    }
    lines.push('');
    option.items.forEach(item => {
      lines.push(itemNum + '. ' + item);
      itemNum += 1;
    });
    lines.push('');
  });

  const orientacoes = selections
    .map(({ option }) => option.orientacoes)
    .filter(Boolean);
  if (orientacoes.length) {
    lines.push('Orientações:');
    orientacoes.forEach(text => lines.push('• ' + text));
    lines.push('');
  }

  if (validationMessages.length) {
    lines.push('⚠ ATENÇÃO — revisar antes de prescrever:');
    validationMessages.forEach(m => lines.push('• ' + m.text));
    lines.push('');
  }

  lines.push('______________________, ' + date);
  lines.push('');
  lines.push('Dr(a). ' + (user?.name || '________________________'));
  lines.push('CRM: ' + crm);
  lines.push('');
  lines.push('— Gerado pelo MedHub. Conteúdo educacional; revisar antes de prescrever.');

  return lines.join('\n');
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

function rxUpdateSelectionBar () {
  const condition = rxGetCurrentCondition();
  const count = rxSelectedOptionIds.size;
  const bar = document.getElementById('rx-selection-bar');
  const countEl = document.getElementById('rx-selection-count');
  const generateBtn = document.getElementById('rx-generate');
  const clearBtn = document.getElementById('rx-clear-selection');
  const messages = condition && count >= 2
    ? rxValidateSelection(condition, rxSelectedOptionIds)
    : [];

  if (countEl) {
    countEl.textContent = count
      ? `${count} opção(ões) selecionada(s)`
      : 'Nenhuma opção selecionada';
  }

  rxRenderValidation(messages);

  if (generateBtn) {
    generateBtn.disabled = count === 0 || rxHasValidationErrors(messages);
  }
  if (clearBtn) {
    clearBtn.disabled = count === 0;
  }
  if (bar) bar.hidden = false;
}

function rxToggleOption (optId) {
  if (rxSelectedOptionIds.has(optId)) rxSelectedOptionIds.delete(optId);
  else rxSelectedOptionIds.add(optId);

  document.querySelectorAll('.rx-option-card').forEach(card => {
    const selected = rxSelectedOptionIds.has(card.dataset.optId);
    card.classList.toggle('rx-option-card--selected', selected);
    card.setAttribute('aria-pressed', selected ? 'true' : 'false');
  });

  rxUpdateSelectionBar();

  const resultEl = document.getElementById('rx-result');
  if (resultEl && rxSelectedOptionIds.size === 0) resultEl.hidden = true;
}

function rxGenerateReceita () {
  const condition = rxGetCurrentCondition();
  if (!condition || !rxSelectedOptionIds.size) return;

  const selections = rxCollectSelectedOptions(condition, rxSelectedOptionIds);
  const messages = rxValidateSelection(condition, rxSelectedOptionIds);
  if (rxHasValidationErrors(messages)) return;

  const resultEl = document.getElementById('rx-result');
  const textEl = document.getElementById('rx-result-text');
  if (!resultEl || !textEl) return;

  textEl.value = rxFormatReceitaMulti(condition, selections, messages);
  resultEl.hidden = false;
  resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function rxClearSelection () {
  rxSelectedOptionIds.clear();
  document.querySelectorAll('.rx-option-card').forEach(card => {
    card.classList.remove('rx-option-card--selected');
    card.setAttribute('aria-pressed', 'false');
  });
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

  let list = RX_CATALOG.slice();
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
      suggestEl.innerHTML = `Sugerido pela anamnese (<strong>${activeQueixa}</strong>): ` +
        fromQueixa.map(c =>
          `<button type="button" class="rx-suggest-chip" data-rx-id="${c.id}">${c.icon} ${c.name}</button>`
        ).join(' ');
      suggestEl.querySelectorAll('.rx-suggest-chip').forEach(chip => {
        chip.addEventListener('click', () => rxShowCondition(chip.dataset.rxId));
      });
      if (!rxSelectedConditionId && fromQueixa[0]) {
        rxShowCondition(fromQueixa[0].id);
      }
    } else {
      suggestEl.hidden = true;
    }
  }
}

function rxShowCondition (conditionId) {
  const condition = RX_CATALOG.find(c => c.id === conditionId);
  if (!condition) return;

  rxSelectedConditionId = conditionId;
  rxSelectedOptionIds.clear();

  const listView = document.getElementById('rx-list-view');
  const detailView = document.getElementById('rx-detail-view');
  const titleEl = document.getElementById('rx-condition-title');
  const optionsEl = document.getElementById('rx-options-wrap');
  const resultEl = document.getElementById('rx-result');
  if (!listView || !detailView || !optionsEl) return;

  listView.hidden = true;
  detailView.hidden = false;
  if (titleEl) titleEl.textContent = condition.icon + ' ' + condition.name;
  if (resultEl) resultEl.hidden = true;

  optionsEl.innerHTML = condition.groups.map(group => `
    <fieldset class="ps-rx-fieldset rx-options-group">
      <legend>${group.label}</legend>
      <div class="rx-option-list">
        ${group.options.map(opt => `
          <button type="button" class="rx-option-card" data-opt-id="${opt.id}" aria-pressed="false">
            <span class="rx-option-card-head">
              <span class="rx-option-check" aria-hidden="true"></span>
              <span class="ps-rx-tier ps-rx-tier--${opt.tier.replace(/\s+/g, '')}">${opt.tier}</span>
            </span>
            <strong>${opt.label}</strong>
            <span class="rx-option-preview">${opt.items[0]}${opt.items.length > 1 ? ' · +' + (opt.items.length - 1) + ' item(ns)' : ''}</span>
          </button>
        `).join('')}
      </div>
    </fieldset>
  `).join('');

  optionsEl.querySelectorAll('.rx-option-card').forEach(btn => {
    btn.addEventListener('click', () => rxToggleOption(btn.dataset.optId));
  });

  rxUpdateSelectionBar();
}

function rxShowList () {
  const listView = document.getElementById('rx-list-view');
  const detailView = document.getElementById('rx-detail-view');
  if (listView) listView.hidden = false;
  if (detailView) detailView.hidden = true;
  rxSelectedConditionId = null;
  rxSelectedOptionIds.clear();
  rxRenderConditionList(document.getElementById('rx-search')?.value || '');
}

function rxCopyReceita () {
  const textEl = document.getElementById('rx-result-text');
  if (!textEl) return;
  textEl.select();
  navigator.clipboard.writeText(textEl.value).then(() => {
    alert('Receita copiada para a área de transferência.');
  }).catch(() => {
    document.execCommand('copy');
    alert('Receita copiada.');
  });
}

function rxOnSectionShow () {
  rxRenderConditionList(document.getElementById('rx-search')?.value || '');
  const activeQueixa = rxGetActiveQueixa();
  const matches = typeof rxMatchConditions === 'function' ? rxMatchConditions(activeQueixa) : [];
  if (matches.length && activeQueixa.length >= 3) {
    rxShowCondition(matches[0].id);
  }
}

function initReceituario () {
  const search = document.getElementById('rx-search');
  const backBtn = document.getElementById('rx-back');
  const copyBtn = document.getElementById('rx-copy');
  const generateBtn = document.getElementById('rx-generate');
  const clearBtn = document.getElementById('rx-clear-selection');
  const crmInput = document.getElementById('rx-crm');

  if (crmInput) {
    crmInput.value = localStorage.getItem(MEDHUB_RX_CRM_KEY) || '';
    crmInput.addEventListener('change', () => {
      localStorage.setItem(MEDHUB_RX_CRM_KEY, crmInput.value.trim());
    });
  }

  if (search) {
    search.addEventListener('input', () => rxRenderConditionList(search.value));
  }
  if (backBtn) backBtn.addEventListener('click', rxShowList);
  if (copyBtn) copyBtn.addEventListener('click', rxCopyReceita);
  if (generateBtn) generateBtn.addEventListener('click', rxGenerateReceita);
  if (clearBtn) clearBtn.addEventListener('click', rxClearSelection);

  rxRenderConditionList('');
}

function initAnamneseReceituarioLink () {
  const queixaEl = document.getElementById('anam-queixa');
  if (!queixaEl) return;

  queixaEl.addEventListener('input', () => {
    rxSyncFromAnamnese();
  });
  queixaEl.addEventListener('blur', rxSyncFromAnamnese);
  rxUpdateQueixaHint();
}
