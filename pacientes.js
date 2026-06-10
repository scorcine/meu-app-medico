/* Pacientes — cadastro local (criptografado) */

let pacientesEditingId = null;

function pacientesCollectForm () {
  return {
    nome: (document.getElementById('pac-nome')?.value || '').trim(),
    idade: (document.getElementById('pac-idade')?.value || '').trim(),
    sexo: (document.getElementById('pac-sexo')?.value || '').trim(),
    telefone: (document.getElementById('pac-telefone')?.value || '').trim(),
    alergias: (document.getElementById('pac-alergias')?.value || '').trim(),
    medicacoes: (document.getElementById('pac-medicacoes')?.value || '').trim(),
    notas: (document.getElementById('pac-notas')?.value || '').trim()
  };
}

function pacientesFillForm (p) {
  if (!p) return;
  const map = {
    'pac-nome': p.nome,
    'pac-idade': p.idade,
    'pac-sexo': p.sexo,
    'pac-telefone': p.telefone,
    'pac-alergias': p.alergias,
    'pac-medicacoes': p.medicacoes,
    'pac-notas': p.notas
  };
  Object.entries(map).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  });
}

function pacientesClearForm () {
  pacientesEditingId = null;
  pacientesFillForm({});
  const title = document.getElementById('pac-form-title');
  if (title) title.textContent = 'Novo paciente';
}

async function pacientesLoadAll () {
  return clinicalLoadList('pacientes');
}

async function pacientesSaveAll (list) {
  await clinicalSaveList('pacientes', list);
}

async function pacientesRenderList () {
  const listEl = document.getElementById('pac-list');
  const emptyEl = document.getElementById('pac-empty');
  const lockEl = document.getElementById('pac-locked');
  const searchEl = document.getElementById('pac-search');
  if (!listEl) return;

  if (lockEl) lockEl.hidden = !clinicalNeedsUnlock('pacientes');
  if (clinicalNeedsUnlock('pacientes')) {
    listEl.innerHTML = '';
    if (emptyEl) emptyEl.hidden = true;
    return;
  }

  const q = clinicalNorm(searchEl ? searchEl.value : '');
  let list = await pacientesLoadAll();
  list.sort((a, b) => (a.nome || '').localeCompare(b.nome || '', 'pt-BR'));

  if (q) {
    list = list.filter(p => clinicalNorm(p.nome + ' ' + p.telefone + ' ' + p.alergias).includes(q));
  }

  listEl.innerHTML = '';
  if (!list.length) {
    if (emptyEl) emptyEl.hidden = !!q;
    return;
  }
  if (emptyEl) emptyEl.hidden = true;

  list.forEach(p => {
    const li = document.createElement('li');
    li.className = 'clinical-record-item';
    li.innerHTML = `
      <div class="clinical-record-meta">
        <strong>${p.nome || 'Sem nome'}</strong>
        <span>${[p.idade, p.sexo].filter(Boolean).join(' · ') || '—'}</span>
        ${p.alergias ? '<span class="clinical-record-tag">Alergias: ' + p.alergias + '</span>' : ''}
      </div>
      <div class="clinical-record-actions">
        <button type="button" class="btn-outline clinical-record-btn" data-pac-action="anamnese" data-id="${p.id}">Anamnese</button>
        <button type="button" class="btn-outline clinical-record-btn" data-pac-action="consulta" data-id="${p.id}">Consulta</button>
        <button type="button" class="btn-outline clinical-record-btn" data-pac-action="edit" data-id="${p.id}">Editar</button>
        <button type="button" class="btn-outline clinical-record-btn" data-pac-action="delete" data-id="${p.id}">Excluir</button>
      </div>`;
    listEl.appendChild(li);
  });

  listEl.querySelectorAll('.clinical-record-btn').forEach(btn => {
    btn.addEventListener('click', () => pacientesHandleAction(btn.dataset.pacAction, btn.dataset.id));
  });
}

async function pacientesHandleAction (action, id) {
  const list = await pacientesLoadAll();
  const p = list.find(x => x.id === id);
  if (!p) return;

  if (action === 'edit') {
    pacientesEditingId = id;
    pacientesFillForm(p);
    document.getElementById('pac-form-title').textContent = 'Editar paciente';
    document.getElementById('pac-form')?.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  if (action === 'delete') {
    if (!confirm('Excluir paciente "' + p.nome + '"? Consultas vinculadas permanecem com o nome.')) return;
    await pacientesSaveAll(list.filter(x => x.id !== id));
    pacientesRenderList();
    return;
  }

  if (action === 'anamnese') {
    if (typeof anamneseFillForm === 'function') {
      anamneseFillForm({
        paciente: p.nome,
        idade: p.idade,
        sexo: p.sexo,
        medicacoes: p.medicacoes,
        alergias: p.alergias
      });
    }
    if (typeof showSection === 'function') showSection('anamnese');
    return;
  }

  if (action === 'consulta') {
    if (typeof consultasOpenForPatient === 'function') {
      consultasOpenForPatient(p);
    }
    if (typeof showSection === 'function') showSection('consultas');
  }
}

async function pacientesHandleSubmit (e) {
  e.preventDefault();
  const data = pacientesCollectForm();
  if (!data.nome) {
    alert('Informe o nome do paciente.');
    return;
  }

  const list = await pacientesLoadAll();
  const now = new Date().toISOString();

  if (pacientesEditingId) {
    const idx = list.findIndex(p => p.id === pacientesEditingId);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...data, updatedAt: now };
    }
  } else {
    list.push({ id: clinicalNewId(), ...data, createdAt: now, updatedAt: now });
  }

  await pacientesSaveAll(list);
  pacientesClearForm();
  pacientesRenderList();

  const status = document.getElementById('pac-save-status');
  if (status) {
    status.hidden = false;
    status.textContent = 'Paciente salvo localmente.';
    status.className = 'anamnese-save-status anamnese-save-status--ok';
  }
}

async function pacientesUpsertFromAnamnese (data) {
  const nome = (data.paciente || '').trim();
  if (!nome) return;

  const list = await pacientesLoadAll();
  const norm = clinicalNorm(nome);
  let p = list.find(x => clinicalNorm(x.nome) === norm);

  const payload = {
    nome,
    idade: data.idade || '',
    sexo: data.sexo || '',
    alergias: data.alergias || '',
    medicacoes: data.medicacoes || ''
  };

  const now = new Date().toISOString();
  if (p) {
    Object.assign(p, payload, { updatedAt: now });
  } else {
    p = { id: clinicalNewId(), ...payload, telefone: '', notas: '', createdAt: now, updatedAt: now };
    list.push(p);
  }
  await pacientesSaveAll(list);
}

function initPacientes () {
  const form = document.getElementById('pac-form');
  if (!form || form.dataset.pacBound) return;
  form.dataset.pacBound = '1';

  form.addEventListener('submit', pacientesHandleSubmit);

  const clearBtn = document.getElementById('pac-clear');
  if (clearBtn) clearBtn.addEventListener('click', () => {
    if (confirm('Limpar formulário?')) pacientesClearForm();
  });

  const search = document.getElementById('pac-search');
  if (search) search.addEventListener('input', pacientesRenderList);

  pacientesClearForm();
  pacientesRenderList();
}

function pacientesOnSectionShow () {
  pacientesRenderList();
}
