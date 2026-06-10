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

function consultasLabel (map, value) {
  return map.find(x => x.value === value)?.label || value;
}

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

function consultasFormatText (c) {
  const lines = [
    'REGISTRO DE CONSULTA — MedHub',
    '============================',
    '',
    'Paciente: ' + (c.pacienteNome || '—'),
    'Data/hora: ' + (c.data || '—'),
    'Tipo: ' + consultasLabel(CONSULTA_TIPOS, c.tipo),
    'Status: ' + consultasLabel(CONSULTA_STATUS, c.status),
    '',
    'QUEIXA / MOTIVO',
    c.queixa || '—',
    '',
    'CONDUTA / PLANO',
    c.conduta || '—',
    '',
    'OBSERVAÇÕES',
    c.notas || '—',
    '',
    '---',
    'Profissional: ' + (c.medico || '—'),
    'Registrado em: ' + (c.createdAt ? new Date(c.createdAt).toLocaleString('pt-BR') : '—'),
    '',
    'Documento gerado pelo MedHub — ferramenta educacional; não substitui prontuário legal.'
  ];
  return lines.join('\n');
}

function consultasBuildFilename (c) {
  const name = (c.pacienteNome || 'consulta').replace(/[^\w\s-áàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ]/gi, '').trim().replace(/\s+/g, '_') || 'consulta';
  const d = c.createdAt ? new Date(c.createdAt) : new Date();
  const stamp = d.toISOString().slice(0, 16).replace('T', '_').replace(':', 'h');
  return 'Consulta_' + name + '_' + stamp + '.pdf';
}

function consultasEscapeHtml (text) {
  return String(text || '—')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>');
}

function consultasExportPdf (c) {
  if (!c) return;

  const tipo = consultasLabel(CONSULTA_TIPOS, c.tipo);
  const status = consultasLabel(CONSULTA_STATUS, c.status);
  const bodyHtml = `
    <div class="cons-print-doc">
      <h1 class="cons-print-title">REGISTRO DE CONSULTA</h1>
      <p class="cons-print-sub">MedHub — documento educacional (não substitui prontuário legal)</p>
      <table class="cons-print-meta">
        <tr><th>Paciente</th><td>${consultasEscapeHtml(c.pacienteNome).replace(/<br>/g, ' ')}</td></tr>
        <tr><th>Data/hora</th><td>${consultasEscapeHtml(c.data).replace(/<br>/g, ' ')}</td></tr>
        <tr><th>Tipo</th><td>${consultasEscapeHtml(tipo).replace(/<br>/g, ' ')}</td></tr>
        <tr><th>Status</th><td>${consultasEscapeHtml(status).replace(/<br>/g, ' ')}</td></tr>
        <tr><th>Profissional</th><td>${consultasEscapeHtml(c.medico).replace(/<br>/g, ' ')}</td></tr>
      </table>
      <h2>Queixa / motivo</h2>
      <p>${consultasEscapeHtml(c.queixa)}</p>
      <h2>Conduta / plano</h2>
      <p>${consultasEscapeHtml(c.conduta)}</p>
      <h2>Observações</h2>
      <p>${consultasEscapeHtml(c.notas)}</p>
      <p class="cons-print-foot">Gerado em ${new Date().toLocaleString('pt-BR')}</p>
    </div>`;

  const win = window.open('', '_blank', 'width=720,height=900');
  if (!win) {
    alert('Permita pop-ups para exportar o PDF.');
    return;
  }

  win.document.write(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>${consultasBuildFilename(c)}</title>
  <style>
    body { font-family: Georgia, 'Times New Roman', serif; color: #111; margin: 2rem; line-height: 1.55; }
    .cons-print-title { text-align: center; font-size: 1.15rem; letter-spacing: 0.06em; margin: 0 0 0.35rem; }
    .cons-print-sub { text-align: center; font-size: 0.82rem; color: #555; margin: 0 0 1.5rem; }
    .cons-print-meta { width: 100%; border-collapse: collapse; margin-bottom: 1.25rem; font-size: 0.95rem; }
    .cons-print-meta th { text-align: left; width: 28%; padding: 0.35rem 0.5rem 0.35rem 0; vertical-align: top; }
    .cons-print-meta td { padding: 0.35rem 0; }
    h2 { font-size: 1rem; margin: 1.1rem 0 0.35rem; border-bottom: 1px solid #ccc; padding-bottom: 0.2rem; }
    p { margin: 0 0 0.75rem; white-space: pre-wrap; }
    .cons-print-foot { margin-top: 2rem; font-size: 0.8rem; color: #666; }
    @media print { body { margin: 1.5cm; } }
  </style>
</head>
<body>${bodyHtml}</body>
</html>`);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 300);
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
    const tipo = consultasLabel(CONSULTA_TIPOS, c.tipo);
    const status = consultasLabel(CONSULTA_STATUS, c.status);
    const li = document.createElement('li');
    li.className = 'clinical-record-item anamnese-history-item';
    li.innerHTML = `
      <div class="clinical-record-meta">
        <strong>${c.pacienteNome || 'Paciente não informado'}</strong>
        <span>${c.data || '—'} · ${tipo} · ${status}</span>
        ${c.queixa ? '<span class="clinical-record-snippet">' + c.queixa + '</span>' : ''}
      </div>
      <div class="clinical-record-actions">
        <button type="button" class="btn-outline clinical-record-btn" data-cons-action="pdf" data-id="${c.id}">Exportar PDF</button>
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

  if (action === 'pdf') {
    consultasExportPdf(c);
    return;
  }

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
  let saved;

  if (consultasEditingId) {
    const idx = list.findIndex(c => c.id === consultasEditingId);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...data, medico: list[idx].medico || user?.name || '', updatedAt: now };
      saved = list[idx];
    }
  } else {
    saved = {
      id: clinicalNewId(),
      ...data,
      medico: user?.name || '',
      createdAt: now,
      updatedAt: now
    };
    list.push(saved);
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

async function consultasRegisterFromAnamnese (anamData, pacienteId) {
  if (!anamData || (!anamData.paciente && !anamData.queixa)) return null;

  const notasParts = [];
  if (anamData.hipoteses) notasParts.push('Hipóteses: ' + anamData.hipoteses);
  if (anamData.hda) notasParts.push('HDA (resumo): ' + anamData.hda.slice(0, 280) + (anamData.hda.length > 280 ? '…' : ''));
  notasParts.push('Registro automático a partir da anamnese.');

  const entry = {
    id: clinicalNewId(),
    pacienteId: pacienteId || '',
    pacienteNome: anamData.paciente || '',
    data: anamData.data || new Date().toLocaleString('pt-BR'),
    tipo: 'ambulatorial',
    status: 'realizada',
    queixa: anamData.queixa || '',
    conduta: anamData.conduta || '',
    notas: notasParts.join('\n'),
    medico: anamData.medico || '',
    anamneseSavedAt: anamData.savedAt || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const list = await consultasLoadAll();
  list.push(entry);
  await consultasSaveAll(list);
  return entry;
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

  const pdfBtn = document.getElementById('cons-export-pdf');
  if (pdfBtn) {
    pdfBtn.addEventListener('click', async () => {
      if (consultasEditingId) {
        const c = (await consultasLoadAll()).find(x => x.id === consultasEditingId);
        if (c) consultasExportPdf(c);
        return;
      }
      const draft = consultasCollectForm();
      if (!draft.pacienteNome && !draft.queixa) {
        alert('Preencha ao menos paciente ou queixa para exportar.');
        return;
      }
      const user = typeof getSession === 'function' ? getSession() : null;
      consultasExportPdf({
        ...draft,
        medico: user?.name || '',
        createdAt: new Date().toISOString()
      });
    });
  }

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
