/* Anamnese — formulário, histórico local e envio ao Google Drive */

const ANAMNESE_STORAGE_PREFIX = 'medhub-anamneses-';

function anamneseStorageKey () {
  const user = typeof getSession === 'function' ? getSession() : null;
  return ANAMNESE_STORAGE_PREFIX + (user?.email || 'local');
}

function anamneseLoadHistoryRaw () {
  try {
    return localStorage.getItem(anamneseStorageKey());
  } catch {
    return null;
  }
}

async function anamneseLoadHistory () {
  const raw = anamneseLoadHistoryRaw();
  if (!raw) return [];

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }

  if (Array.isArray(parsed)) {
    if (typeof medhubHasSessionCryptoKey === 'function' && medhubHasSessionCryptoKey()) {
      await anamneseSaveHistory(parsed);
    }
    return parsed;
  }

  if (parsed && parsed.enc) {
    try {
      return await medhubDecryptJson(parsed);
    } catch {
      return [];
    }
  }

  return [];
}

async function anamneseSaveHistory (list) {
  if (typeof medhubHasSessionCryptoKey === 'function' && medhubHasSessionCryptoKey()) {
    const enc = await medhubEncryptJson(list);
    localStorage.setItem(anamneseStorageKey(), JSON.stringify(enc));
  } else {
    localStorage.setItem(anamneseStorageKey(), JSON.stringify(list));
  }
}

function anamneseFieldIds () {
  return [
    'anam-paciente', 'anam-idade', 'anam-sexo', 'anam-data',
    'anam-queixa', 'anam-hda', 'anam-antecedentes', 'anam-medicacoes',
    'anam-alergias', 'anam-habitos', 'anam-exame', 'anam-hipoteses', 'anam-conduta'
  ];
}

function anamneseCollectData () {
  const data = { savedAt: new Date().toISOString() };
  anamneseFieldIds().forEach(id => {
    const el = document.getElementById(id);
    if (el) data[id.replace('anam-', '')] = el.value.trim();
  });
  const user = typeof getSession === 'function' ? getSession() : null;
  data.medico = user?.name || '';
  data.medicoEmail = user?.email || '';
  return data;
}

function anamneseFillForm (data) {
  if (!data) return;
  Object.entries(data).forEach(([key, val]) => {
    const el = document.getElementById('anam-' + key);
    if (el && typeof val === 'string') el.value = val;
  });
}

function anamneseFormatText (data) {
  const lines = [
    'ANAMNESE — MedHub',
    '==================',
    '',
    'Data/Hora: ' + (data.data || new Date().toLocaleString('pt-BR')),
    'Paciente: ' + (data.paciente || '—'),
    'Idade: ' + (data.idade || '—'),
    'Sexo: ' + (data.sexo || '—'),
    '',
    'QUEIXA PRINCIPAL',
    data.queixa || '—',
    '',
    'HISTÓRIA DA DOENÇA ATUAL (HDA)',
    data.hda || '—',
    '',
    'ANTECEDENTES PESSOAIS',
    data.antecedentes || '—',
    '',
    'MEDICAÇÕES EM USO',
    data.medicacoes || '—',
    '',
    'ALERGIAS',
    data.alergias || '—',
    '',
    'HÁBITOS',
    data.habitos || '—',
    '',
    'EXAME FÍSICO',
    data.exame || '—',
    '',
    'HIPÓTESES DIAGNÓSTICAS',
    data.hipoteses || '—',
    '',
    'CONDUTA / PLANO',
    data.conduta || '—',
    '',
    '---',
    'Médico(a): ' + (data.medico || '—'),
    'Registrado em: ' + new Date(data.savedAt).toLocaleString('pt-BR'),
    'Gerado pelo MedHub — ferramenta educacional; não substitui prontuário legal.'
  ];
  return lines.join('\n');
}

function anamneseBuildFilename (data) {
  const name = (data.paciente || 'paciente').replace(/[^\w\s-áàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ]/gi, '').trim().replace(/\s+/g, '_') || 'paciente';
  const d = new Date(data.savedAt);
  const stamp = d.toISOString().slice(0, 16).replace('T', '_').replace(':', 'h');
  return `Anamnese_${name}_${stamp}.txt`;
}

async function anamneseRenderHistory () {
  const listEl = document.getElementById('anamnese-history-list');
  const emptyEl = document.getElementById('anamnese-history-empty');
  const lockEl = document.getElementById('anamnese-history-locked');
  if (!listEl) return;

  const raw = anamneseLoadHistoryRaw();
  const needsUnlock = raw && raw.includes('"enc":true') &&
    typeof medhubHasSessionCryptoKey === 'function' && !medhubHasSessionCryptoKey();

  if (lockEl) lockEl.hidden = !needsUnlock;
  if (needsUnlock) {
    listEl.innerHTML = '';
    if (emptyEl) emptyEl.hidden = true;
    return;
  }

  const history = (await anamneseLoadHistory()).slice().reverse();
  listEl.innerHTML = '';

  if (!history.length) {
    if (emptyEl) emptyEl.hidden = false;
    return;
  }
  if (emptyEl) emptyEl.hidden = true;

  history.forEach((item, idx) => {
    const li = document.createElement('li');
    li.className = 'anamnese-history-item';
    li.innerHTML = `
      <div class="anamnese-history-meta">
        <strong>${item.paciente || 'Sem nome'}</strong>
        <span>${new Date(item.savedAt).toLocaleString('pt-BR')}</span>
        ${item.driveLink ? `<a href="${item.driveLink}" target="_blank" rel="noopener">Abrir no Drive</a>` : ''}
      </div>
      <div class="anamnese-history-actions">
        <button type="button" class="btn-outline anamnese-history-btn" data-action="load" data-idx="${idx}">Carregar</button>
        <button type="button" class="btn-outline anamnese-history-btn" data-action="download" data-idx="${idx}">Baixar</button>
        <button type="button" class="btn-outline anamnese-history-btn" data-action="delete" data-idx="${idx}">Excluir</button>
      </div>`;
    listEl.appendChild(li);
  });

  listEl.querySelectorAll('.anamnese-history-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const action = btn.dataset.action;
      const idx = Number(btn.dataset.idx);
      const historyRev = (await anamneseLoadHistory()).slice().reverse();
      const item = historyRev[idx];
      if (!item) return;

      if (action === 'load') {
        anamneseFillForm(item);
        document.getElementById('anamnese-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (action === 'download') {
        anamneseDownloadFile(item);
      } else if (action === 'delete') {
        if (!confirm('Excluir esta anamnese do histórico local?')) return;
        const all = await anamneseLoadHistory();
        const realIdx = all.length - 1 - idx;
        all.splice(realIdx, 1);
        await anamneseSaveHistory(all);
        anamneseRenderHistory();
      }
    });
  });
}

function anamneseDownloadFile (data) {
  const text = anamneseFormatText(data);
  const blob = new Blob([text], { type: 'text/plain;charset=UTF-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = anamneseBuildFilename(data);
  a.click();
  URL.revokeObjectURL(a.href);
}

function anamneseShowSaveStatus (msg, type) {
  const el = document.getElementById('anamnese-save-status');
  if (!el) return;
  el.hidden = false;
  el.textContent = msg;
  el.className = 'anamnese-save-status anamnese-save-status--' + (type || 'ok');
}

async function anamneseHandleSave (e) {
  e.preventDefault();
  const data = anamneseCollectData();

  if (!data.paciente && !data.queixa) {
    alert('Informe ao menos o nome do paciente ou a queixa principal.');
    return;
  }

  if (!data.data) {
    data.data = new Date().toLocaleString('pt-BR');
    const dateEl = document.getElementById('anam-data');
    if (dateEl) dateEl.value = data.data;
  }

  const history = await anamneseLoadHistory();
  history.push(data);
  await anamneseSaveHistory(history);
  anamneseRenderHistory();

  if (typeof pacientesUpsertFromAnamnese === 'function') {
    await pacientesUpsertFromAnamnese(data);
  }

  const text = anamneseFormatText(data);
  const filename = anamneseBuildFilename(data);

  let driveMsg = '';
  if (typeof gdriveIsAutoUpload === 'function' && gdriveIsAutoUpload() && typeof gdriveGetClientId === 'function' && gdriveGetClientId()) {
    try {
      anamneseShowSaveStatus('Salvando e enviando ao Google Drive…', 'pending');
      const result = await gdriveUploadAnamnese(filename, text);
      data.driveId = result.id;
      data.driveLink = result.webViewLink;
      history[history.length - 1] = data;
      await anamneseSaveHistory(history);
      anamneseRenderHistory();
      driveMsg = ' Enviado ao Google Drive.';
      anamneseShowSaveStatus('Anamnese salva.' + driveMsg, 'ok');
    } catch (err) {
      anamneseShowSaveStatus('Salva localmente. Drive: ' + (err.message || 'falha no envio'), 'warn');
    }
  } else {
    anamneseShowSaveStatus('Anamnese salva localmente.' + (gdriveGetClientId() ? ' Conecte o Drive para envio automático.' : ''), 'ok');
  }
}

function anamneseClearForm () {
  anamneseFieldIds().forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const dateEl = document.getElementById('anam-data');
  if (dateEl) dateEl.value = new Date().toLocaleString('pt-BR');
}

function initAnamnese () {
  const form = document.getElementById('anamnese-form');
  const clearBtn = document.getElementById('anamnese-clear');
  const dateEl = document.getElementById('anam-data');

  if (dateEl && !dateEl.value) {
    dateEl.value = new Date().toLocaleString('pt-BR');
  }

  if (form) form.addEventListener('submit', anamneseHandleSave);
  if (clearBtn) clearBtn.addEventListener('click', () => {
    if (confirm('Limpar todos os campos?')) anamneseClearForm();
  });

  if (typeof initGoogleDriveUI === 'function') initGoogleDriveUI();
  anamneseRenderHistory();
}
