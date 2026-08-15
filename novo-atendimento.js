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
    voltarIdentificacao: document.getElementById('novo-atendimento-voltar-identificacao')
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

function novoAtendimentoShowStep (step) {
  const { form, identificacaoHeader, queixasPanel, queixaInput } = novoAtendimentoElements();
  const showingQueixas = step === 'queixas';
  if (identificacaoHeader) identificacaoHeader.hidden = showingQueixas;
  if (form) form.hidden = showingQueixas;
  if (queixasPanel) queixasPanel.hidden = !showingQueixas;
  if (showingQueixas) window.setTimeout(() => queixaInput?.focus(), 50);
}

function novoAtendimentoRenderQueixas () {
  const { queixasList, queixasEmpty } = novoAtendimentoElements();
  if (!queixasList) return;

  queixasList.innerHTML = novoAtendimentoQueixas.map((queixa, index) => `
    <span class="novo-atendimento-complaint-chip">
      <span>${String(queixa).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span>
      <button type="button" data-remove-queixa="${index}" aria-label="Remover ${String(queixa).replace(/"/g, '&quot;')}">×</button>
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
  novoAtendimentoShowStep('queixas');
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
  sessionStorage.setItem(MEDHUB_NEW_ENCOUNTER_DRAFT, JSON.stringify(data));
  sessionStorage.setItem('medhub-active-queixa', data.queixas.join('; '));
  novoAtendimentoSyncAnamnese(data);
  if (typeof rxSyncFromAnamnese === 'function') rxSyncFromAnamnese();

  novoAtendimentoSetStatus(
    `${data.queixas.length} queixa(s) salva(s): ${data.queixas.join(' · ')}`,
    'ok',
    queixasStatus
  );
}

function initNovoAtendimento () {
  const {
    form,
    limpar,
    queixaForm,
    salvarQueixas,
    voltarIdentificacao
  } = novoAtendimentoElements();
  if (!form || form.dataset.bound) return;
  form.dataset.bound = '1';

  form.addEventListener('submit', novoAtendimentoSave);
  limpar?.addEventListener('click', novoAtendimentoClear);
  queixaForm?.addEventListener('submit', novoAtendimentoAddQueixa);
  salvarQueixas?.addEventListener('click', novoAtendimentoSaveQueixas);
  voltarIdentificacao?.addEventListener('click', () => novoAtendimentoShowStep('identificacao'));
  document.querySelectorAll('input[name="novo-atendimento-alergia"]').forEach(input => {
    input.addEventListener('change', novoAtendimentoUpdateAllergyField);
  });

  novoAtendimentoRestore();
}

function novoAtendimentoOnSectionShow () {
  initNovoAtendimento();
  const { nome, queixasPanel } = novoAtendimentoElements();
  if (queixasPanel?.hidden && nome && !nome.value) window.setTimeout(() => nome.focus(), 50);
}
