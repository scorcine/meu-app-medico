/* Receituário — integração com anamnese e geração de receita */

const MEDHUB_ACTIVE_QUEIXA = 'medhub-active-queixa';
const MEDHUB_ACTIVE_PACIENTE = 'medhub-active-paciente';
const MEDHUB_ACTIVE_IDADE = 'medhub-active-idade';
const MEDHUB_RX_CRM_KEY = 'medhub-rx-crm';

let rxSelectedConditionId = null;
let rxSelectedOptionIds = new Set();
let rxSelectedMedIds = new Set();

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

function rxRemoveMedsForOption (optionId) {
  const condition = rxGetCurrentCondition();
  if (!condition) return;
  condition.groups.forEach(group => {
    group.options.forEach(option => {
      if (option.id !== optionId) return;
      rxGetOptionMeds(option).forEach(m => rxSelectedMedIds.delete(m.id));
    });
  });
}

function rxAutoSelectMedsForOption (option) {
  rxGetOptionMeds(option).forEach(m => {
    if (!m.exclusiveGroup) rxSelectedMedIds.add(m.id);
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

function rxFormatReceitaPrint (condition, medEntries, orientacoesList, validationMessages) {
  const ctx = rxGetPatientContext();
  const user = typeof getSession === 'function' ? getSession() : null;
  const crm = localStorage.getItem(MEDHUB_RX_CRM_KEY) || '____________';
  const date = new Date().toLocaleDateString('pt-BR');
  const paciente = ctx.paciente || '________________________________';
  const idade = ctx.idade ? ctx.idade + ' anos' : '________';

  const lines = [
    '                         RECEITUÁRIO SIMPLES',
    '',
    'Paciente: ' + paciente + '                    Data: ' + date,
    'Idade: ' + idade,
    '',
    'Uso oral:',
    ''
  ];

  medEntries.forEach(({ med }, i) => {
    lines.push((i + 1) + '. ' + med.text);
  });

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
  lines.push('Dr(a). ' + (user?.name || '________________________'));
  lines.push('CRM: ' + crm);
  lines.push('');
  lines.push('— Gerado pelo MedHub. Conteúdo educacional; revisar antes de prescrever.');

  return lines.join('\n');
}

function rxRenderPrintPreview (condition, medEntries, orientacoesList) {
  const preview = document.getElementById('rx-print-preview');
  if (!preview) return;

  const ctx = rxGetPatientContext();
  const user = typeof getSession === 'function' ? getSession() : null;
  const crm = localStorage.getItem(MEDHUB_RX_CRM_KEY) || '____________';
  const date = new Date().toLocaleDateString('pt-BR');

  preview.innerHTML = `
    <div class="rx-print-sheet">
      <h4 class="rx-print-title">RECEITUÁRIO SIMPLES</h4>
      <div class="rx-print-meta">
        <p><strong>Paciente:</strong> ${ctx.paciente || '________________________________'}</p>
        <p><strong>Data:</strong> ${date}</p>
        <p><strong>Idade:</strong> ${ctx.idade ? ctx.idade + ' anos' : '________'}</p>
      </div>
      <p class="rx-print-route"><strong>Uso oral:</strong></p>
      <ol class="rx-print-meds">
        ${medEntries.map(({ med }) => `<li>${med.text}</li>`).join('')}
      </ol>
      ${orientacoesList.length ? `
        <div class="rx-print-orient">
          <strong>Orientações:</strong>
          <ul>${orientacoesList.map(t => `<li>${t}</li>`).join('')}</ul>
        </div>` : ''}
      <div class="rx-print-sign">
        <p>______________________________, ${date}</p>
        <p>Dr(a). ${user?.name || '________________________'}</p>
        <p>CRM: ${crm}</p>
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

function rxRenderMedsPanel () {
  const panel = document.getElementById('rx-meds-panel');
  const condition = rxGetCurrentCondition();
  if (!panel || !condition) return;

  const selections = rxCollectSelectedOptions(condition, rxSelectedOptionIds);
  if (!selections.length) {
    panel.hidden = true;
    panel.innerHTML = '';
    return;
  }

  panel.hidden = false;
  panel.innerHTML = `
    <h3 class="rx-meds-title">Escolha os medicamentos</h3>
    <p class="muted rx-meds-hint">Onde houver alternativas (OU), marque <strong>apenas uma</strong> opção — ex.: naproxeno <em>ou</em> ibuprofeno.</p>
    ${selections.map(({ group, option }) => {
      const meds = rxGetOptionMeds(option);
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
          <legend>${group.label} — ${option.label}</legend>
          ${Object.values(grouped).map(groupMeds => `
            <div class="rx-med-alt-group" role="radiogroup" aria-label="Alternativa">
              <span class="rx-med-alt-label">Escolha uma:</span>
              ${groupMeds.map(m => `
                <label class="rx-med-item rx-med-item--radio">
                  <input type="radio" name="rx-alt-${m.exclusiveGroup}" value="${m.id}"
                    data-med-id="${m.id}" data-opt-id="${option.id}"
                    ${rxSelectedMedIds.has(m.id) ? 'checked' : ''}>
                  <span>${m.text}</span>
                </label>
              `).join('')}
            </div>
          `).join('')}
          ${standalone.map(m => `
            <label class="rx-med-item">
              <input type="checkbox" data-med-id="${m.id}" data-opt-id="${option.id}"
                ${rxSelectedMedIds.has(m.id) ? 'checked' : ''}>
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
      const groupName = input.name;
      panel.querySelectorAll(`input[name="${groupName}"]`).forEach(r => {
        rxSelectedMedIds.delete(r.dataset.medId);
      });
      rxSelectedMedIds.add(input.dataset.medId);
      rxUpdateSelectionBar();
    });
  });

  panel.querySelectorAll('input[type="checkbox"]').forEach(input => {
    input.addEventListener('change', () => {
      if (input.checked) rxSelectedMedIds.add(input.dataset.medId);
      else rxSelectedMedIds.delete(input.dataset.medId);
      rxUpdateSelectionBar();
    });
  });
}

function rxGetValidationState () {
  const condition = rxGetCurrentCondition();
  if (!condition || !rxSelectedOptionIds.size) {
    return { messages: [], medEntries: [], canGenerate: false };
  }

  const optionMessages = rxValidateSchemes(condition, rxSelectedOptionIds);
  const medEntries = rxCollectSelectedMeds(condition, rxSelectedMedIds);
  const medMessages = rxValidateMeds(medEntries);
  const messages = [...optionMessages, ...medMessages];
  const groupsOk = rxExclusiveGroupsComplete(condition, rxSelectedOptionIds, rxSelectedMedIds);
  const hasMeds = medEntries.length > 0;
  const canGenerate = hasMeds && groupsOk && !rxHasValidationErrors(messages);

  return { messages, medEntries, canGenerate, groupsOk, hasMeds };
}

function rxUpdateSelectionBar () {
  const condition = rxGetCurrentCondition();
  const bar = document.getElementById('rx-selection-bar');
  const countEl = document.getElementById('rx-selection-count');
  const generateBtn = document.getElementById('rx-generate');
  const clearBtn = document.getElementById('rx-clear-selection');
  const { messages, medEntries, canGenerate, groupsOk, hasMeds } = rxGetValidationState();

  if (countEl) {
    const optCount = rxSelectedOptionIds.size;
    const medCount = medEntries.length;
    if (!optCount) countEl.textContent = 'Nenhum esquema selecionado';
    else if (!groupsOk) countEl.textContent = `${optCount} esquema(s) — escolha as alternativas (OU) abaixo`;
    else countEl.textContent = `${optCount} esquema(s), ${medCount} medicamento(s) selecionado(s)`;
  }

  if (!groupsOk && condition && rxSelectedOptionIds.size) {
    const pending = [];
    rxCollectSelectedOptions(condition, rxSelectedOptionIds).forEach(({ option }) => {
      const meds = rxGetOptionMeds(option);
      const groups = [...new Set(meds.filter(m => m.exclusiveGroup).map(m => m.exclusiveGroup))];
      groups.forEach(g => {
        if (!meds.some(m => m.exclusiveGroup === g && rxSelectedMedIds.has(m.id))) {
          pending.push({ severity: 'warning', text: `Em “${option.label}”, selecione uma alternativa (OU) antes de gerar a receita.` });
        }
      });
    });
    rxRenderValidation([...messages, ...pending]);
  } else if (!hasMeds && rxSelectedOptionIds.size) {
    rxRenderValidation([...messages, { severity: 'warning', text: 'Selecione ao menos um medicamento abaixo.' }]);
  } else {
    rxRenderValidation(messages);
  }

  if (generateBtn) generateBtn.disabled = !canGenerate;
  if (clearBtn) clearBtn.disabled = rxSelectedOptionIds.size === 0;
  if (bar) bar.hidden = false;
}

function rxToggleOption (optId) {
  const condition = rxGetCurrentCondition();
  if (!condition) return;

  let option = null;
  condition.groups.forEach(g => {
    g.options.forEach(o => { if (o.id === optId) option = o; });
  });
  if (!option) return;

  if (rxSelectedOptionIds.has(optId)) {
    rxSelectedOptionIds.delete(optId);
    rxRemoveMedsForOption(optId);
  } else {
    rxSelectedOptionIds.add(optId);
    rxAutoSelectMedsForOption(option);
  }

  document.querySelectorAll('.rx-option-card').forEach(card => {
    const selected = rxSelectedOptionIds.has(card.dataset.optId);
    card.classList.toggle('rx-option-card--selected', selected);
    card.setAttribute('aria-pressed', selected ? 'true' : 'false');
  });

  rxRenderMedsPanel();
  rxUpdateSelectionBar();

  const resultEl = document.getElementById('rx-result');
  if (resultEl && rxSelectedOptionIds.size === 0) resultEl.hidden = true;
}

function rxGenerateReceita () {
  const condition = rxGetCurrentCondition();
  if (!condition) return;

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

  const text = rxFormatReceitaPrint(condition, medEntries, orientacoesList, messages.filter(m => m.severity === 'warning'));
  const resultEl = document.getElementById('rx-result');
  const textEl = document.getElementById('rx-result-text');
  if (!resultEl || !textEl) return;

  textEl.value = text;
  rxRenderPrintPreview(condition, medEntries, orientacoesList);
  resultEl.hidden = false;
  resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function rxClearSelection () {
  rxSelectedOptionIds.clear();
  rxSelectedMedIds.clear();
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
  rxSelectedMedIds.clear();

  const listView = document.getElementById('rx-list-view');
  const detailView = document.getElementById('rx-detail-view');
  const titleEl = document.getElementById('rx-condition-title');
  const optionsEl = document.getElementById('rx-options-wrap');
  const resultEl = document.getElementById('rx-result');
  const medsPanel = document.getElementById('rx-meds-panel');
  if (!listView || !detailView || !optionsEl) return;

  listView.hidden = true;
  detailView.hidden = false;
  if (titleEl) titleEl.textContent = condition.icon + ' ' + condition.name;
  if (resultEl) resultEl.hidden = true;
  if (medsPanel) { medsPanel.hidden = true; medsPanel.innerHTML = ''; }

  optionsEl.innerHTML = condition.groups.map(group => `
    <fieldset class="ps-rx-fieldset rx-options-group">
      <legend>${group.label}</legend>
      <div class="rx-option-list">
        ${group.options.map(opt => {
          const medCount = rxGetOptionMeds(opt).length;
          return `
          <button type="button" class="rx-option-card" data-opt-id="${opt.id}" aria-pressed="false">
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
  rxSelectedMedIds.clear();
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

function rxPrintReceita () {
  const preview = document.getElementById('rx-print-preview');
  if (!preview || !preview.innerHTML.trim()) return;

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
    <body>${preview.innerHTML}</body>
    </html>
  `);
  win.document.close();
  win.focus();
  win.print();
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
  const printBtn = document.getElementById('rx-print');
  const generateBtn = document.getElementById('rx-generate');
  const clearBtn = document.getElementById('rx-clear-selection');
  const crmInput = document.getElementById('rx-crm');

  if (crmInput) {
    crmInput.value = localStorage.getItem(MEDHUB_RX_CRM_KEY) || '';
    crmInput.addEventListener('change', () => {
      localStorage.setItem(MEDHUB_RX_CRM_KEY, crmInput.value.trim());
    });
  }

  if (search) search.addEventListener('input', () => rxRenderConditionList(search.value));
  if (backBtn) backBtn.addEventListener('click', rxShowList);
  if (copyBtn) copyBtn.addEventListener('click', rxCopyReceita);
  if (printBtn) printBtn.addEventListener('click', rxPrintReceita);
  if (generateBtn) generateBtn.addEventListener('click', rxGenerateReceita);
  if (clearBtn) clearBtn.addEventListener('click', rxClearSelection);

  rxRenderConditionList('');
}

function initAnamneseReceituarioLink () {
  const queixaEl = document.getElementById('anam-queixa');
  if (!queixaEl) return;

  queixaEl.addEventListener('input', () => rxSyncFromAnamnese());
  queixaEl.addEventListener('blur', rxSyncFromAnamnese);
  rxUpdateQueixaHint();
}
