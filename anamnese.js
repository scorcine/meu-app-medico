/* Anamnese — formulário, histórico local e envio ao Google Drive */

const ANAMNESE_STORAGE_PREFIX = 'medhub-anamneses-';
const ANAMNESE_REGISTER_CONSULTA_KEY = 'medhub-anam-registrar-consulta';

function anamneseRegisterConsultaPrefKey () {
  const user = typeof getSession === 'function' ? getSession() : null;
  return ANAMNESE_REGISTER_CONSULTA_KEY + '-' + (user?.email || 'local');
}

function anamneseShouldRegisterConsulta () {
  const el = document.getElementById('anam-registrar-consulta');
  return el ? el.checked : true;
}

function anamneseLoadRegisterConsultaPref () {
  const el = document.getElementById('anam-registrar-consulta');
  if (!el) return;
  const stored = localStorage.getItem(anamneseRegisterConsultaPrefKey());
  el.checked = stored !== '0';
}

function anamneseSaveRegisterConsultaPref () {
  const el = document.getElementById('anam-registrar-consulta');
  if (!el) return;
  localStorage.setItem(anamneseRegisterConsultaPrefKey(), el.checked ? '1' : '0');
}

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
  if (typeof medhubTouchClinicalLocalAt === 'function') {
    medhubTouchClinicalLocalAt();
  }
  if (typeof medhubScheduleCloudPush === 'function') {
    medhubScheduleCloudPush();
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
  data.medico = typeof medhubGetRxDoctorName === 'function' ? medhubGetRxDoctorName() : (user?.name || '');
  data.medicoEmail = user?.email || '';
  return data;
}

function anamneseFillForm (data) {
  if (!data) return;
  Object.entries(data).forEach(([key, val]) => {
    const el = document.getElementById('anam-' + key);
    if (el && typeof val === 'string') el.value = val;
  });
  if (typeof clinicalBeginEncounter === 'function') clinicalBeginEncounter();
  if (typeof clinicalSetActiveAllergies === 'function' && data.alergias) {
    clinicalSetActiveAllergies(data.alergias);
  }
  if (typeof clinicalSyncActivePatientFromAnamnese === 'function') {
    clinicalSyncActivePatientFromAnamnese();
  }
}

function anamneseFormatText (data) {
  const lines = [
    'ROTEIRO DE ATENDIMENTO — MedHub',
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
  const d = data.savedAt ? new Date(data.savedAt) : new Date();
  const stamp = d.toISOString().slice(0, 16).replace('T', '_').replace(':', 'h');
  return `Roteiro_${name}_${stamp}.txt`;
}

function anamneseBuildPdfTitle (data) {
  return anamneseBuildFilename(data).replace(/\.txt$/i, '.pdf');
}

function anamneseEscapeHtml (text) {
  return String(text || '—')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>');
}

function anamneseExportPdf (data) {
  if (!data) return;

  const savedAt = data.savedAt || new Date().toISOString();
  const savedLabel = new Date(savedAt).toLocaleString('pt-BR');
  const esc = (v) => anamneseEscapeHtml(v).replace(/<br>/g, ' ');

  const bodyHtml = `
    <div class="anam-print-doc">
      <h1 class="anam-print-title">ROTEIRO DE ATENDIMENTO</h1>
      <p class="anam-print-sub">MedHub — documento educacional (não substitui prontuário legal)</p>
      <table class="anam-print-meta">
        <tr><th>Paciente</th><td>${esc(data.paciente)}</td></tr>
        <tr><th>Idade</th><td>${esc(data.idade)}</td></tr>
        <tr><th>Sexo</th><td>${esc(data.sexo)}</td></tr>
        <tr><th>Data/hora</th><td>${esc(data.data || new Date().toLocaleString('pt-BR'))}</td></tr>
        <tr><th>Profissional</th><td>${esc(data.medico)}</td></tr>
      </table>
      <h2>Queixa principal</h2>
      <p>${anamneseEscapeHtml(data.queixa)}</p>
      <h2>História da doença atual (HDA)</h2>
      <p>${anamneseEscapeHtml(data.hda)}</p>
      <h2>Antecedentes pessoais</h2>
      <p>${anamneseEscapeHtml(data.antecedentes)}</p>
      <h2>Medicações em uso</h2>
      <p>${anamneseEscapeHtml(data.medicacoes)}</p>
      <h2>Alergias</h2>
      <p>${anamneseEscapeHtml(data.alergias)}</p>
      <h2>Hábitos</h2>
      <p>${anamneseEscapeHtml(data.habitos)}</p>
      <h2>Exame físico</h2>
      <p>${anamneseEscapeHtml(data.exame)}</p>
      <h2>Hipóteses diagnósticas</h2>
      <p>${anamneseEscapeHtml(data.hipoteses)}</p>
      <h2>Conduta / plano</h2>
      <p>${anamneseEscapeHtml(data.conduta)}</p>
      <p class="anam-print-foot">Registrado em ${savedLabel} · Gerado em ${new Date().toLocaleString('pt-BR')}</p>
    </div>`;

  const win = window.open('', '_blank', 'width=720,height=900');
  if (!win) {
    alert('Permita pop-ups para exportar o PDF.');
    return;
  }

  const docData = { ...data, savedAt };
  win.document.write(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>${anamneseBuildPdfTitle(docData)}</title>
  <style>
    body { font-family: Georgia, 'Times New Roman', serif; color: #111; margin: 2rem; line-height: 1.55; }
    .anam-print-title { text-align: center; font-size: 1.15rem; letter-spacing: 0.06em; margin: 0 0 0.35rem; }
    .anam-print-sub { text-align: center; font-size: 0.82rem; color: #555; margin: 0 0 1.5rem; }
    .anam-print-meta { width: 100%; border-collapse: collapse; margin-bottom: 1.25rem; font-size: 0.95rem; }
    .anam-print-meta th { text-align: left; width: 28%; padding: 0.35rem 0.5rem 0.35rem 0; vertical-align: top; }
    .anam-print-meta td { padding: 0.35rem 0; }
    h2 { font-size: 1rem; margin: 1.1rem 0 0.35rem; border-bottom: 1px solid #ccc; padding-bottom: 0.2rem; }
    p { margin: 0 0 0.75rem; white-space: pre-wrap; }
    .anam-print-foot { margin-top: 2rem; font-size: 0.8rem; color: #666; }
    @media print { body { margin: 1.5cm; } }
  </style>
</head>
<body>${bodyHtml}</body>
</html>`);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 300);
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
        <button type="button" class="btn-outline anamnese-history-btn" data-action="pdf" data-idx="${idx}">Exportar PDF</button>
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
      } else if (action === 'pdf') {
        anamneseExportPdf(item);
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
    const patient = await pacientesUpsertFromAnamnese(data);
    if (anamneseShouldRegisterConsulta() && typeof consultasRegisterFromAnamnese === 'function') {
      await consultasRegisterFromAnamnese(data, patient?.id || '');
    }
  }

  const text = anamneseFormatText(data);
  const filename = anamneseBuildFilename(data);

  let driveMsg = '';
  let consultaMsg = anamneseShouldRegisterConsulta() ? ' Consulta registrada.' : '';
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
      anamneseShowSaveStatus('Anamnese salva.' + consultaMsg + driveMsg, 'ok');
    } catch (err) {
      anamneseShowSaveStatus('Salva localmente.' + consultaMsg + ' Drive: ' + (err.message || 'falha no envio'), 'warn');
    }
  } else {
    anamneseShowSaveStatus('Anamnese salva localmente.' + consultaMsg + (gdriveGetClientId() ? ' Conecte o Drive para envio automático.' : ''), 'ok');
  }

  anamneseFinishEncounter();
}

function anamneseFinishEncounter () {
  anamneseClearForm({ endEncounter: false });
  if (typeof clinicalEndEncounter === 'function') clinicalEndEncounter();
  if (typeof rxUpdateQueixaHint === 'function') rxUpdateQueixaHint();
}

function anamneseClearForm (opts) {
  anamneseFieldIds().forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const dateEl = document.getElementById('anam-data');
  if (dateEl) dateEl.value = new Date().toLocaleString('pt-BR');
  if (!opts || opts.endEncounter !== false) {
    if (typeof clinicalEndEncounter === 'function') clinicalEndEncounter();
    if (typeof rxUpdateQueixaHint === 'function') rxUpdateQueixaHint();
  }
}

const ANAMNESE_GUIDE_DISMISS_PREFIX = 'medhub-anamnese-guide-dismissed-';

function anamneseGuideStorageKey () {
  const user = typeof getSession === 'function' ? getSession() : null;
  return ANAMNESE_GUIDE_DISMISS_PREFIX + (user?.email || 'local');
}

function anamneseGuideDismissed () {
  return localStorage.getItem(anamneseGuideStorageKey()) === '1';
}

function anamneseEnsureGuideModal () {
  if (document.getElementById('medhub-anamnese-guide-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'medhub-anamnese-guide-overlay';
  overlay.className = 'compliance-overlay';
  overlay.hidden = true;
  overlay.innerHTML = `
    <div class="compliance-modal compliance-modal--narrow" role="dialog" aria-modal="true" aria-labelledby="medhub-anamnese-guide-title">
      <h2 id="medhub-anamnese-guide-title">Anamnese — guia para prescrição</h2>
      <div class="compliance-modal-scroll">
        <p>Esta seção serve para <strong>organizar a consulta e guiar a prescrição</strong> dentro do MedHub — da queixa à conduta, conectando protocolos e receituário do app.</p>
        <ul>
          <li>É um <strong>rascunho local</strong>, criptografado neste navegador.</li>
          <li><strong>Não substitui prontuário legal</strong> nem documentação institucional.</li>
          <li>Use conforme LGPD e a política do seu serviço de saúde.</li>
        </ul>
      </div>
      <label class="compliance-check">
        <input type="checkbox" id="medhub-anamnese-guide-dismiss">
        Não mostrar este aviso novamente
      </label>
      <div class="compliance-modal-actions">
        <button type="button" class="btn" id="medhub-anamnese-guide-accept">Entendi — é somente um guia</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
}

function anamneseShowGuideModal (onContinue) {
  if (anamneseGuideDismissed()) {
    if (typeof onContinue === 'function') onContinue();
    return;
  }

  anamneseEnsureGuideModal();
  const overlay = document.getElementById('medhub-anamnese-guide-overlay');
  const dismissCheck = overlay.querySelector('#medhub-anamnese-guide-dismiss');
  const acceptBtn = overlay.querySelector('#medhub-anamnese-guide-accept');

  dismissCheck.checked = false;
  overlay.hidden = false;
  document.body.classList.add('compliance-modal-open');
  acceptBtn.focus();

  acceptBtn.onclick = () => {
    if (dismissCheck.checked) {
      localStorage.setItem(anamneseGuideStorageKey(), '1');
    }
    overlay.hidden = true;
    document.body.classList.remove('compliance-modal-open');
    if (typeof onContinue === 'function') onContinue();
  };
}

function anamneseOnSectionShow () {
  anamneseShowGuideModal();
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
  anamneseLoadRegisterConsultaPref();
  const regConsulta = document.getElementById('anam-registrar-consulta');
  if (regConsulta) regConsulta.addEventListener('change', anamneseSaveRegisterConsultaPref);

  const pdfBtn = document.getElementById('anamnese-export-pdf');
  if (pdfBtn) {
    pdfBtn.addEventListener('click', () => {
      const data = anamneseCollectData();
      if (!data.paciente && !data.queixa) {
        alert('Preencha ao menos paciente ou queixa para exportar.');
        return;
      }
      if (!data.data) data.data = new Date().toLocaleString('pt-BR');
      anamneseExportPdf(data);
    });
  }

  anamneseRenderHistory();
  if (typeof clinicalBindAllergyInputs === 'function') clinicalBindAllergyInputs();
}
