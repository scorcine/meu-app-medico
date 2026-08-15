/* Novo atendimento — coleta inicial e contexto clínico da sessão */

const MEDHUB_NEW_ENCOUNTER_DRAFT = 'medhub-new-encounter-draft';

function novoAtendimentoElements () {
  return {
    form: document.getElementById('novo-atendimento-form'),
    nome: document.getElementById('novo-atendimento-nome'),
    sexo: document.getElementById('novo-atendimento-sexo'),
    idade: document.getElementById('novo-atendimento-idade'),
    detalheWrap: document.getElementById('novo-atendimento-alergia-detalhe-wrap'),
    detalhe: document.getElementById('novo-atendimento-alergia-detalhe'),
    limpar: document.getElementById('novo-atendimento-limpar'),
    status: document.getElementById('novo-atendimento-status')
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

function novoAtendimentoSetStatus (text, type) {
  const { status } = novoAtendimentoElements();
  if (!status) return;
  status.textContent = text || '';
  status.className = 'novo-atendimento-status' + (type ? ` novo-atendimento-status--${type}` : '');
  status.hidden = !text;
}

function novoAtendimentoSyncAnamnese (data) {
  const mappings = {
    'anam-paciente': data.nome,
    'anam-sexo': data.sexo,
    'anam-idade': `${data.idade} anos`,
    'anam-alergias': data.alergias
  };

  Object.entries(mappings).forEach(([id, value]) => {
    const field = document.getElementById(id);
    if (field) field.value = value;
  });
}

function novoAtendimentoSave (event) {
  event.preventDefault();
  const { form, nome, sexo, idade, detalhe } = novoAtendimentoElements();
  const allergyChoice = novoAtendimentoAllergyChoice();

  novoAtendimentoUpdateAllergyField();
  if (!form?.reportValidity()) return;

  const data = {
    nome: nome.value.trim(),
    sexo: sexo.value,
    idade: String(idade.value).trim(),
    alergias: allergyChoice === 'sim' ? detalhe.value.trim() : 'Nega alergias',
    startedAt: new Date().toISOString()
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
  novoAtendimentoSetStatus(
    `Dados de ${data.nome} salvos. O atendimento está pronto para os próximos passos.`,
    'ok'
  );
}

function novoAtendimentoClear () {
  const { form, nome } = novoAtendimentoElements();
  form?.reset();
  sessionStorage.removeItem(MEDHUB_NEW_ENCOUNTER_DRAFT);
  if (typeof clinicalEndEncounter === 'function') clinicalEndEncounter();
  novoAtendimentoUpdateAllergyField();
  novoAtendimentoSetStatus('');
  nome?.focus();
}

function novoAtendimentoRestore () {
  let data;
  try {
    data = JSON.parse(sessionStorage.getItem(MEDHUB_NEW_ENCOUNTER_DRAFT) || 'null');
  } catch {
    data = null;
  }
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
  novoAtendimentoUpdateAllergyField();
}

function initNovoAtendimento () {
  const { form, limpar } = novoAtendimentoElements();
  if (!form || form.dataset.bound) return;
  form.dataset.bound = '1';

  form.addEventListener('submit', novoAtendimentoSave);
  limpar?.addEventListener('click', novoAtendimentoClear);
  document.querySelectorAll('input[name="novo-atendimento-alergia"]').forEach(input => {
    input.addEventListener('change', novoAtendimentoUpdateAllergyField);
  });

  novoAtendimentoRestore();
}

function novoAtendimentoOnSectionShow () {
  initNovoAtendimento();
  const { nome } = novoAtendimentoElements();
  if (nome && !nome.value) window.setTimeout(() => nome.focus(), 50);
}
