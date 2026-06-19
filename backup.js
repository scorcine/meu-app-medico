/* Backup — exportar e restaurar dados clínicos locais (localStorage) */

const MEDHUB_BACKUP_VERSION = 1;

function backupUserEmail () {
  const user = typeof getSession === 'function' ? getSession() : null;
  return String(user?.email || 'local').toLowerCase();
}

function backupStorageKeys (email) {
  const e = email || backupUserEmail();
  return [
    'medhub-anamneses-' + e,
    'medhub-pacientes-' + e,
    'medhub-consultas-' + e,
    'medhub-anam-registrar-consulta-' + e,
    'medhub-terms-' + e,
    'medhub-rx-crm',
    'medhub-gdrive-client-id',
    'medhub-gdrive-auto-upload'
  ];
}

function backupRemapKey (key, sourceEmail, targetEmail) {
  if (!sourceEmail || sourceEmail === targetEmail) return key;
  const suffix = '-' + sourceEmail;
  if (key.endsWith(suffix)) {
    return key.slice(0, -suffix.length) + '-' + targetEmail;
  }
  return key;
}

function backupCollectPayload () {
  const user = typeof getSession === 'function' ? getSession() : null;
  const email = backupUserEmail();
  const entries = {};

  backupStorageKeys(email).forEach(key => {
    const val = localStorage.getItem(key);
    if (val !== null) entries[key] = val;
  });

  return {
    medhubBackup: true,
    version: MEDHUB_BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    email,
    userName: user?.name || '',
    entries
  };
}

function backupDownloadFilename () {
  const email = backupUserEmail().replace(/[^a-z0-9@._+-]/gi, '_');
  const stamp = new Date().toISOString().slice(0, 10);
  return 'MedHub_backup_' + email + '_' + stamp + '.json';
}

function backupShowStatus (msg, type) {
  const el = document.getElementById('backup-status');
  if (!el) return;
  el.hidden = false;
  el.textContent = msg;
  el.className = 'anamnese-save-status anamnese-save-status--' + (type || 'ok');
}

function backupRefreshUi () {
  if (typeof anamneseRenderHistory === 'function') anamneseRenderHistory();
  if (typeof pacientesRenderList === 'function') pacientesRenderList();
  if (typeof consultasRenderList === 'function') consultasRenderList();
  if (typeof consultasPopulatePatientSelect === 'function') consultasPopulatePatientSelect();
  if (typeof anamneseLoadRegisterConsultaPref === 'function') anamneseLoadRegisterConsultaPref();

  const crmInput = document.getElementById('rx-crm');
  if (crmInput && typeof rxParseCrmNumber === 'function') {
    crmInput.value = rxParseCrmNumber(localStorage.getItem('medhub-rx-crm') || '');
  }

  const gdriveId = document.getElementById('anamnese-gdrive-client-id');
  const gdriveAuto = document.getElementById('anamnese-gdrive-auto');
  if (typeof gdriveGetClientId === 'function' && gdriveId) {
    gdriveId.value = gdriveGetClientId();
  }
  if (typeof gdriveIsAutoUpload === 'function' && gdriveAuto) {
    gdriveAuto.checked = gdriveIsAutoUpload();
  }
}

function backupExport () {
  const payload = backupCollectPayload();
  const count = Object.keys(payload.entries).length;

  if (!count) {
    backupShowStatus('Nenhum dado clínico salvo para exportar.', 'warn');
    return;
  }

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=UTF-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = backupDownloadFilename();
  a.click();
  URL.revokeObjectURL(a.href);
  backupShowStatus('Backup exportado (' + count + ' itens). Guarde o arquivo em local seguro.', 'ok');
}

async function backupImportFile (file) {
  if (!file) return;

  let payload;
  try {
    payload = JSON.parse(await file.text());
  } catch {
    backupShowStatus('Arquivo inválido — não é JSON.', 'warn');
    return;
  }

  if (!payload.medhubBackup || !payload.entries || typeof payload.entries !== 'object') {
    backupShowStatus('Arquivo não reconhecido como backup MedHub.', 'warn');
    return;
  }

  const currentEmail = backupUserEmail();
  const sourceEmail = String(payload.email || currentEmail).toLowerCase();
  const entryCount = Object.keys(payload.entries).length;

  if (!entryCount) {
    backupShowStatus('Backup vazio — nada para restaurar.', 'warn');
    return;
  }

  if (sourceEmail !== currentEmail) {
    const ok = confirm(
      'Este backup pertence a "' + sourceEmail + '".\n' +
      'Você está logado como "' + currentEmail + '".\n\n' +
      'Restaurar mesmo assim? Os dados serão gravados na conta atual.'
    );
    if (!ok) return;
  }

  const okReplace = confirm(
    'Substituir dados locais clínicos por este backup?\n\n' +
    entryCount + ' item(ns) serão restaurados.\n' +
    'Exporte um backup antes se quiser manter cópia do estado atual.'
  );
  if (!okReplace) return;

  Object.entries(payload.entries).forEach(([key, value]) => {
    if (typeof value !== 'string') return;
    const targetKey = backupRemapKey(key, sourceEmail, currentEmail);
    localStorage.setItem(targetKey, value);
  });

  backupRefreshUi();
  backupShowStatus('Backup restaurado (' + entryCount + ' itens).', 'ok');
}

function initBackup () {
  const exportBtn = document.getElementById('backup-export');
  const importInput = document.getElementById('backup-import-file');
  if (!exportBtn || exportBtn.dataset.backupBound) return;
  exportBtn.dataset.backupBound = '1';

  exportBtn.addEventListener('click', backupExport);

  if (importInput) {
    importInput.addEventListener('change', async () => {
      const file = importInput.files?.[0];
      await backupImportFile(file);
      importInput.value = '';
    });
  }
}

function backupMaybePromptFirstUse () {
  const banner = document.getElementById('backup-first-use-banner');
  if (!banner) return;
  if (!document.getElementById('section-conta')?.classList.contains('active')) return;

  const key = 'medhub-backup-prompt-' + backupUserEmail();
  if (localStorage.getItem(key)) {
    banner.hidden = true;
    return;
  }

  banner.hidden = false;
  document.getElementById('backup-dismiss-prompt')?.addEventListener('click', () => {
    localStorage.setItem(key, '1');
    banner.hidden = true;
  });
}
