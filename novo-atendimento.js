/* Novo atendimento — coleta inicial e contexto clínico da sessão */

const MEDHUB_NEW_ENCOUNTER_DRAFT = 'medhub-new-encounter-draft';
let novoAtendimentoQueixas = [];

function novoAtendimentoElements () {
  return {
    form: document.getElementById('novo-atendimento-form'),
    nome: document.getElementById('novo-atendimento-nome'),
    sexo: document.getElementById('novo-atendimento-sexo'),
    idade: document.getElementById('novo-atendimento-idade'),
    detalheWrap: document.getElementById('novo-atendimento-alergia-detalhe-wrap'),
    detalhe: document.getElementById('novo-atendimento-alergia-detalhe'),
    limpar: document.getElementById('novo-atendimento-limpar'),
    status: document.getElementById('novo-atendimento-status'),
    identificacaoHeader: document.getElementById('novo-atendimento-identificacao-header'),
    queixasPanel: document.getElementById('novo-atendimento-queixas-panel'),
    queixaForm: document.getElementById('novo-atendimento-queixa-form'),
    queixaInput: document.getElementById('novo-atendimento-queixa-input'),
    queixasList: document.getElementById('novo-atendimento-queixas-list'),
    queixasEmpty: document.getElementById('novo-atendimento-queixas-empty'),
    queixasStatus: document.getElementById('novo-atendimento-queixas-status'),
    salvarQueixas: document.getElementById('novo-atendimento-salvar-queixas'),
    voltarIdentificacao: document.getElementById('novo-atendimento-voltar-identificacao'),
    tratamentoPanel: document.getElementById('novo-atendimento-tratamento-panel'),
    tratamentoResumo: document.getElementById('novo-atendimento-tratamento-resumo'),
    txUnidade: document.getElementById('novo-atendimento-tx-unidade'),
    txCasa: document.getElementById('novo-atendimento-tx-casa'),
    voltarQueixas: document.getElementById('novo-atendimento-voltar-queixas'),
    irTratamento: document.getElementById('novo-atendimento-ir-tratamento'),
    novoPaciente: document.getElementById('novo-atendimento-novo-paciente')
  };
}

function novoAtendimentoAllergyChoice () {
  return document.querySelector('input[name="novo-atendimento-alergia"]:checked')?.value || '';
}

function novoAtendimentoUpdateAllergyField () {
  const { detalheWrap, detalhe } = novoAtendimentoElements();
  const hasAllergy = novoAtendimentoAllergyChoice() === 'sim';
  if (detalheWrap) detalheWrap.hidden = !hasAllergy;
  if (detalhe) {
    detalhe.required = hasAllergy;
    if (!hasAllergy) detalhe.value = '';
  }
}

function novoAtendimentoSetStatus (text, type, target) {
  const el = target || novoAtendimentoElements().status;
  if (!el) return;
  el.textContent = text || '';
  el.className = 'novo-atendimento-status' + (type ? ` novo-atendimento-status--${type}` : '');
  el.hidden = !text;
}

function novoAtendimentoSyncAnamnese (data) {
  const mappings = {
    'anam-paciente': data.nome,
    'anam-sexo': data.sexo,
    'anam-idade': `${data.idade} anos`,
    'anam-alergias': data.alergias,
    'anam-queixa': (data.queixas || []).join('; ')
  };

  Object.entries(mappings).forEach(([id, value]) => {
    const field = document.getElementById(id);
    if (field) field.value = value;
  });
}

function novoAtendimentoReadDraft () {
  try {
    return JSON.parse(sessionStorage.getItem(MEDHUB_NEW_ENCOUNTER_DRAFT) || 'null');
  } catch {
    return null;
  }
}

function novoAtendimentoEscape (text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function novoAtendimentoShowStep (step) {
  const {
    form,
    identificacaoHeader,
    queixasPanel,
    queixaInput,
    tratamentoPanel,
    tratamentoResumo
  } = novoAtendimentoElements();

  const showingIdentificacao = step === 'identificacao';
  const showingQueixas = step === 'queixas';
  const showingTratamento = step === 'tratamento';

  if (identificacaoHeader) identificacaoHeader.hidden = !showingIdentificacao;
  if (form) form.hidden = !showingIdentificacao;
  if (queixasPanel) queixasPanel.hidden = !showingQueixas;
  if (tratamentoPanel) tratamentoPanel.hidden = !showingTratamento;

  if (showingQueixas) window.setTimeout(() => queixaInput?.focus(), 50);

  if (showingTratamento) {
    const data = novoAtendimentoReadDraft();
    if (tratamentoResumo) {
      const queixas = data?.queixas?.length ? data.queixas.join(' · ') : 'sem queixas';
      const nome = data?.nome || 'paciente';
      tratamentoResumo.textContent = `${nome} · ${queixas}. Escolha o local do tratamento.`;
    }

    const { irTratamento } = novoAtendimentoElements();
    if (irTratamento) {
      const aberto = data?.lastTreatment;
      irTratamento.hidden = !aberto;
      irTratamento.textContent = aberto === 'receituario'
        ? 'Voltar ao tratamento para casa →'
        : 'Voltar ao tratamento na unidade →';
    }
  }
}

function novoAtendimentoRenderQueixas () {
  const { queixasList, queixasEmpty } = novoAtendimentoElements();
  if (!queixasList) return;

  queixasList.innerHTML = novoAtendimentoQueixas.map((queixa, index) => `
    <span class="novo-atendimento-complaint-chip">
      <span>${novoAtendimentoEscape(queixa)}</span>
      <button type="button" data-remove-queixa="${index}" aria-label="Remover ${novoAtendimentoEscape(queixa)}">×</button>
    </span>
  `).join('');
  if (queixasEmpty) queixasEmpty.hidden = novoAtendimentoQueixas.length > 0;

  queixasList.querySelectorAll('[data-remove-queixa]').forEach(button => {
    button.addEventListener('click', () => {
      novoAtendimentoQueixas.splice(Number(button.dataset.removeQueixa), 1);
      novoAtendimentoRenderQueixas();
    });
  });
}

function novoAtendimentoAddQueixa (event) {
  event.preventDefault();
  const { queixaInput, queixasStatus } = novoAtendimentoElements();
  const value = queixaInput?.value.trim();
  if (!value) {
    queixaInput?.focus();
    return;
  }

  const exists = novoAtendimentoQueixas.some(item =>
    item.localeCompare(value, 'pt-BR', { sensitivity: 'base' }) === 0
  );
  if (!exists) novoAtendimentoQueixas.push(value);
  if (queixaInput) queixaInput.value = '';
  novoAtendimentoSetStatus('', '', queixasStatus);
  novoAtendimentoRenderQueixas();
  queixaInput?.focus();
}

function novoAtendimentoSave (event) {
  event.preventDefault();
  const { form, nome, sexo, idade, detalhe } = novoAtendimentoElements();
  const allergyChoice = novoAtendimentoAllergyChoice();
  const previous = novoAtendimentoReadDraft();

  novoAtendimentoUpdateAllergyField();
  if (!form?.reportValidity()) return;

  const data = {
    nome: nome.value.trim(),
    sexo: sexo.value,
    idade: String(idade.value).trim(),
    alergias: allergyChoice === 'sim' ? detalhe.value.trim() : 'Nega alergias',
    queixas: previous?.queixas || novoAtendimentoQueixas,
    step: 'queixas',
    startedAt: previous?.startedAt || new Date().toISOString()
  };

  sessionStorage.setItem(MEDHUB_NEW_ENCOUNTER_DRAFT, JSON.stringify(data));
  sessionStorage.setItem('medhub-active-paciente', data.nome);
  sessionStorage.setItem('medhub-active-idade', `${data.idade} anos`);

  if (typeof clinicalBeginEncounter === 'function') {
    clinicalBeginEncounter({
      nome: data.nome,
      sexo: data.sexo,
      idade: data.idade,
      alergias: data.alergias
    });
  }
  if (typeof clinicalSetActiveAllergies === 'function') {
    clinicalSetActiveAllergies(data.alergias);
  }

  novoAtendimentoSyncAnamnese(data);
  novoAtendimentoSetStatus('');
  novoAtendimentoShowStep('queixas');
}

function novoAtendimentoClear () {
  const { form, nome, queixasStatus } = novoAtendimentoElements();
  form?.reset();
  novoAtendimentoQueixas = [];
  sessionStorage.removeItem(MEDHUB_NEW_ENCOUNTER_DRAFT);
  if (typeof clinicalEndEncounter === 'function') clinicalEndEncounter();
  novoAtendimentoUpdateAllergyField();
  novoAtendimentoRenderQueixas();
  novoAtendimentoSetStatus('');
  novoAtendimentoSetStatus('', '', queixasStatus);
  novoAtendimentoShowStep('identificacao');
  nome?.focus();
}

function novoAtendimentoRestore () {
  const data = novoAtendimentoReadDraft();
  if (!data) return;

  const { nome, sexo, idade, detalhe } = novoAtendimentoElements();
  if (nome) nome.value = data.nome || '';
  if (sexo) sexo.value = data.sexo || '';
  if (idade) idade.value = data.idade || '';

  const hasAllergy = data.alergias && data.alergias !== 'Nega alergias';
  const choice = document.querySelector(
    `input[name="novo-atendimento-alergia"][value="${hasAllergy ? 'sim' : 'nao'}"]`
  );
  if (choice) choice.checked = true;
  if (detalhe && hasAllergy) detalhe.value = data.alergias;
  novoAtendimentoQueixas = Array.isArray(data.queixas) ? data.queixas.filter(Boolean) : [];
  novoAtendimentoUpdateAllergyField();
  novoAtendimentoRenderQueixas();

  if (data.step === 'tratamento' && novoAtendimentoQueixas.length) {
    novoAtendimentoShowStep('tratamento');
  } else if (novoAtendimentoQueixas.length || data.step === 'queixas') {
    novoAtendimentoShowStep('queixas');
  } else {
    novoAtendimentoShowStep('identificacao');
  }
}

function novoAtendimentoPrefillSearch (sectionId, query) {
  const map = {
    'tratamento-hospitalar': 'th-search',
    receituario: 'rx-search'
  };
  const inputId = map[sectionId];
  if (!inputId || !query) return;
  window.setTimeout(() => {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.value = query;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }, 80);
}

function novoAtendimentoOpenTreatment (sectionId) {
  const data = novoAtendimentoReadDraft();
  const queixas = data?.queixas?.length ? data.queixas : [];
  const queryText = queixas.join('; ');

  if (data) {
    data.lastTreatment = sectionId;
    sessionStorage.setItem(MEDHUB_NEW_ENCOUNTER_DRAFT, JSON.stringify(data));
  }

  if (typeof showSection === 'function') showSection(sectionId);

  window.setTimeout(() => {
    if (sectionId === 'tratamento-hospitalar' && typeof thOpenFromQueixas === 'function') {
      const opened = thOpenFromQueixas(queixas, { skipGate: true });
      if (!opened) novoAtendimentoPrefillSearch(sectionId, queixas[0] || queryText);
      return;
    }

    if (sectionId === 'receituario') {
      const matches = typeof rxMatchConditions === 'function'
        ? rxMatchConditions(queryText)
        : [];
      if (matches.length && typeof rxShowCombinedConditions === 'function') {
        rxShowCombinedConditions(matches.map(c => c.id), { skipGate: true });
        return;
      }
      novoAtendimentoPrefillSearch(sectionId, queixas[0] || queryText);
    }
  }, 120);
}

function novoAtendimentoSaveQueixas () {
  const { queixaInput, queixasStatus } = novoAtendimentoElements();
  const pending = queixaInput?.value.trim();
  if (pending) {
    const exists = novoAtendimentoQueixas.some(item =>
      item.localeCompare(pending, 'pt-BR', { sensitivity: 'base' }) === 0
    );
    if (!exists) novoAtendimentoQueixas.push(pending);
    if (queixaInput) queixaInput.value = '';
    novoAtendimentoRenderQueixas();
  }

  if (!novoAtendimentoQueixas.length) {
    novoAtendimentoSetStatus('Adicione pelo menos uma queixa para continuar.', 'error', queixasStatus);
    queixaInput?.focus();
    return;
  }

  const data = novoAtendimentoReadDraft();
  if (!data) {
    novoAtendimentoShowStep('identificacao');
    return;
  }

  data.queixas = [...novoAtendimentoQueixas];
  data.step = 'tratamento';
  sessionStorage.setItem(MEDHUB_NEW_ENCOUNTER_DRAFT, JSON.stringify(data));
  sessionStorage.setItem('medhub-active-queixa', data.queixas.join('; '));
  novoAtendimentoSyncAnamnese(data);
  if (typeof rxSyncFromAnamnese === 'function') rxSyncFromAnamnese();

  novoAtendimentoSetStatus('', '', queixasStatus);
  novoAtendimentoShowStep('tratamento');
}

function initNovoAtendimento () {
  const {
    form,
    limpar,
    queixaForm,
    salvarQueixas,
    voltarIdentificacao,
    txUnidade,
    txCasa,
    voltarQueixas,
    irTratamento,
    novoPaciente
  } = novoAtendimentoElements();
  if (!form || form.dataset.bound) return;
  form.dataset.bound = '1';

  form.addEventListener('submit', novoAtendimentoSave);
  limpar?.addEventListener('click', novoAtendimentoClear);
  queixaForm?.addEventListener('submit', novoAtendimentoAddQueixa);
  salvarQueixas?.addEventListener('click', novoAtendimentoSaveQueixas);
  voltarIdentificacao?.addEventListener('click', () => novoAtendimentoShowStep('identificacao'));
  voltarQueixas?.addEventListener('click', () => novoAtendimentoShowStep('queixas'));
  txUnidade?.addEventListener('click', () => novoAtendimentoOpenTreatment('tratamento-hospitalar'));
  txCasa?.addEventListener('click', () => novoAtendimentoOpenTreatment('receituario'));
  irTratamento?.addEventListener('click', () => {
    const data = novoAtendimentoReadDraft();
    novoAtendimentoOpenTreatment(data?.lastTreatment || 'tratamento-hospitalar');
  });
  novoPaciente?.addEventListener('click', novoAtendimentoClear);
  document.querySelectorAll('input[name="novo-atendimento-alergia"]').forEach(input => {
    input.addEventListener('change', novoAtendimentoUpdateAllergyField);
  });

  novoAtendimentoRestore();
}

function novoAtendimentoOnSectionShow () {
  initNovoAtendimento();
  novoAtendimentoResumeStep();

  const { nome, queixasPanel, tratamentoPanel } = novoAtendimentoElements();
  const onIdentificacao = queixasPanel?.hidden && tratamentoPanel?.hidden;
  if (onIdentificacao && nome && !nome.value) window.setTimeout(() => nome.focus(), 50);
}

/** Ao voltar para a aba, retoma o passo onde o atendimento parou */
function novoAtendimentoResumeStep () {
  const data = novoAtendimentoReadDraft();
  if (!data) return;

  if (data.step === 'tratamento' && (data.queixas || []).length) {
    novoAtendimentoShowStep('tratamento');
  } else if (data.step === 'queixas') {
    novoAtendimentoShowStep('queixas');
  }
}
