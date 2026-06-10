/* Consultas — registro local vinculado a pacientes */

let consultasEditingId = null;

const CONSULTA_TIPOS = [
  { value: 'ambulatorial', label: 'Ambulatorial' },
  { value: 'retorno', label: 'Retorno' },
  { value: 'ps', label: 'Pronto-socorro' },
  { value: 'telemedicina', label: 'Telemedicina' },
  { value: 'outro', label: 'Outro' }
];

const CONSULTA_STATUS = [
  { value: 'realizada', label: 'Realizada' },
  { value: 'agendada', label: 'Agendada' },
  { value: 'cancelada', label: 'Cancelada' }
];

function consultasCollectForm () {
  return {
    pacienteId: document.getElementById('cons-paciente-id')?.value || '',
    pacienteNome: (document.getElementById('cons-paciente-nome')?.value || '').trim(),
    data: (document.getElementById('cons-data')?.value || '').trim(),
    tipo: document.getElementById('cons-tipo')?.value || 'ambulatorial',
    status: document.getElementById('cons-status')?.value || 'realizada',
    queixa: (document.getElementById('cons-queixa')?.value || '').trim(),
    conduta: (document.getElementById('cons-conduta')?.value || '').trim(),
    notas: (document.getElementById('cons-notas')?.value || '').trim()
  };
}

function consultasFillForm (c) {
  if (!c) c = {};
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  };
  set('cons-paciente-id', c.pacienteId);
  set('cons-paciente-nome', c.pacienteNome);
  set('cons-data', c.data || new Date().toLocaleString('pt-BR'));
  set('cons-tipo', c.tipo || 'ambulatorial');
  set('cons-status', c.status || 'realizada');
  set('cons-queixa', c.queixa);
  set('cons-conduta', c.conduta);
  set('cons-notas', c.notas);
}

function consultasClearForm () {
  consultasEditingId = null;
  consultasFillForm({ data: new Date().toLocaleString('pt-BR') });
  const title = document.getElementById('cons-form-title');
  if (title) title.textContent = 'Nova consulta';
}

async function consultasLoadAll () {
  return clinicalLoadList('consultas');
}

async function consultasSaveAll (list) {
  await clinicalSaveList('consultas', list);
}

async function consultasPopulatePatientSelect () {
  const select = document.getElementById('cons-paciente-select');
  if (!select) return;

  const patients = await pacientesLoadAll();
  patients.sort((a, b) => (a.nome || '').localeCompare(b.nome || '', 'pt-BR'));

  select.innerHTML = '<option value="">— Digite ou selecione —</option>' +
    patients.map(p => `<option value="${p.id}">${p.nome}${p.idade ? ' (' + p.idade + ')' : ''}</option>`).join('');
}

function consultasOpenForPatient (patient) {
  consultasClearForm();
  consultasFillForm({
    pacienteId: patient.id,
    pacienteNome: patient.nome,
    data: new Date().toLocaleString('pt-BR')
  });
  consultasEditingId = null;
  document.getElementById('cons-form-title').textContent = 'Nova consulta — ' + patient.nome;
}

async function consultasRenderList () {
  const listEl = document.getElementById('cons-list');
  const emptyEl = document.getElementById('cons-empty');
  const lockEl = document.getElementById('cons-locked');
  const filterEl = document.getElementById('cons-filter');
  if (!listEl) return;

  if (lockEl) lockEl.hidden = !clinicalNeedsUnlock('consultas');
  if (clinicalNeedsUnlock('consultas')) {
    listEl.innerHTML = '';
    if (emptyEl) emptyEl.hidden = true;
    return;
  }

  const q = clinicalNorm(filterEl ? filterEl.value : '');
  let list = await consultasLoadAll();
  list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  if (q) {
    list = list.filter(c => clinicalNorm(c.pacienteNome + ' ' + c.queixa + ' ' + c.conduta).includes(q));
  }

  listEl.innerHTML = '';
  if (!list.length) {
    if (emptyEl) emptyEl.hidden = !!q;
    return;
  }
  if (emptyEl) emptyEl.hidden = true;

  list.forEach(c => {
    const tipo = CONSULTA_TIPOS.find(t => t.value === c.tipo)?.label || c.tipo;
    const status = CONSULTA_STATUS.find(s => s.value === c.status)?.label || c.status;
    const li = document.createElement('li');
    li.className = 'clinical-record-item';
    li.innerHTML = `
      <div class="clinical-record-meta">
        <strong>${c.pacienteNome || 'Paciente não informado'}</strong>
        <span>${c.data || '—'} · ${tipo} · ${status}</span>
        ${c.queixa ? '<span class="clinical-record-snippet">' + c.queixa + '</span>' : ''}
      </div>
      <div class="clinical-record-actions">
        <button type="button" class="btn-outline clinical-record-btn" data-cons-action="edit" data-id="${c.id}">Editar</button>
        <button type="button" class="btn-outline clinical-record-btn" data-cons-action="delete" data-id="${c.id}">Excluir</button>
      </div>`;
    listEl.appendChild(li);
  });

  listEl.querySelectorAll('.clinical-record-btn').forEach(btn => {
    btn.addEventListener('click', () => consultasHandleAction(btn.dataset.consAction, btn.dataset.id));
  });
}

async function consultasHandleAction (action, id) {
  const list = await consultasLoadAll();
  const c = list.find(x => x.id === id);
  if (!c) return;

  if (action === 'edit') {
    consultasEditingId = id;
    consultasFillForm(c);
    document.getElementById('cons-form-title').textContent = 'Editar consulta';
    document.getElementById('cons-form')?.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  if (action === 'delete') {
    if (!confirm('Excluir este registro de consulta?')) return;
    await consultasSaveAll(list.filter(x => x.id !== id));
    consultasRenderList();
  }
}

async function consultasHandleSubmit (e) {
  e.preventDefault();
  const data = consultasCollectForm();
  if (!data.pacienteNome) {
    alert('Informe o nome do paciente.');
    return;
  }

  if (data.pacienteId) {
    const patients = await pacientesLoadAll();
    const p = patients.find(x => x.id === data.pacienteId);
    if (p) data.pacienteNome = p.nome;
  }

  const list = await consultasLoadAll();
  const now = new Date().toISOString();
  const user = typeof getSession === 'function' ? getSession() : null;

  if (consultasEditingId) {
    const idx = list.findIndex(c => c.id === consultasEditingId);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...data, updatedAt: now };
    }
  } else {
    list.push({
      id: clinicalNewId(),
      ...data,
      medico: user?.name || '',
      createdAt: now,
      updatedAt: now
    });
  }

  await consultasSaveAll(list);
  consultasClearForm();
  consultasRenderList();
  await consultasPopulatePatientSelect();

  const status = document.getElementById('cons-save-status');
  if (status) {
    status.hidden = false;
    status.textContent = 'Consulta registrada localmente.';
    status.className = 'anamnese-save-status anamnese-save-status--ok';
  }
}

async function consultasRegisterFromAnamnese (anamData) {
  if (!anamData || (!anamData.paciente && !anamData.queixa)) return;

  const list = await consultasLoadAll();
  list.push({
    id: clinicalNewId(),
    pacienteId: '',
    pacienteNome: anamData.paciente || '',
    data: anamData.data || new Date().toLocaleString('pt-BR'),
    tipo: 'ambulatorial',
    status: 'realizada',
    queixa: anamData.queixa || '',
    conduta: anamData.conduta || '',
    notas: 'Registro automático a partir da anamnese.',
    medico: anamData.medico || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  await consultasSaveAll(list);
}

function initConsultas () {
  const form = document.getElementById('cons-form');
  if (!form || form.dataset.consBound) return;
  form.dataset.consBound = '1';

  form.addEventListener('submit', consultasHandleSubmit);

  const clearBtn = document.getElementById('cons-clear');
  if (clearBtn) clearBtn.addEventListener('click', () => {
    if (confirm('Limpar formulário?')) consultasClearForm();
  });

  const filter = document.getElementById('cons-filter');
  if (filter) filter.addEventListener('input', consultasRenderList);

  const patientSelect = document.getElementById('cons-paciente-select');
  if (patientSelect) {
    patientSelect.addEventListener('change', async () => {
      const id = patientSelect.value;
      if (!id) return;
      const p = (await pacientesLoadAll()).find(x => x.id === id);
      if (p) {
        document.getElementById('cons-paciente-id').value = p.id;
        document.getElementById('cons-paciente-nome').value = p.nome;
      }
    });
  }

  consultasClearForm();
  consultasPopulatePatientSelect();
  consultasRenderList();
}

function consultasOnSectionShow () {
  consultasPopulatePatientSelect();
  consultasRenderList();
}
