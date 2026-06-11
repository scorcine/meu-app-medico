/* Sync clínico criptografado na nuvem (E2E — servidor só guarda ciphertext) */

const MEDHUB_CLOUD_SYNC_PREF = 'medhub-cloud-sync-enabled';
const MEDHUB_CLINICAL_LOCAL_AT = 'medhub-clinical-local-at';
let _cloudPushTimer = null;

function medhubCloudSyncPrefKey () {
  const email = typeof getSession === 'function' ? getSession()?.email : '';
  return MEDHUB_CLOUD_SYNC_PREF + ':' + String(email || 'local').toLowerCase();
}

function medhubClinicalLocalAtKey () {
  const email = typeof getSession === 'function' ? getSession()?.email : '';
  return MEDHUB_CLINICAL_LOCAL_AT + ':' + String(email || 'local').toLowerCase();
}

function medhubCloudSyncEnabledByUser () {
  return localStorage.getItem(medhubCloudSyncPrefKey()) !== '0';
}

function medhubSetCloudSyncEnabled (enabled) {
  localStorage.setItem(medhubCloudSyncPrefKey(), enabled ? '1' : '0');
}

async function medhubCloudSyncAvailable () {
  if (typeof medhubFetchAuthConfig !== 'function') return false;
  const config = await medhubFetchAuthConfig();
  return !!(config.cloudEnabled && medhubGetAuthToken && medhubGetAuthToken());
}

function medhubCollectClinicalEntries () {
  if (typeof backupStorageKeys === 'function' && typeof backupUserEmail === 'function') {
    const email = backupUserEmail();
    const entries = {};
    backupStorageKeys(email).forEach(key => {
      const val = localStorage.getItem(key);
      if (val !== null) entries[key] = val;
    });
    return entries;
  }
  return {};
}

function medhubApplyClinicalEntries (entries, sourceEmail) {
  const targetEmail = typeof backupUserEmail === 'function' ? backupUserEmail() : '';
  Object.entries(entries || {}).forEach(([key, value]) => {
    if (typeof value !== 'string') return;
    const targetKey = typeof backupRemapKey === 'function'
      ? backupRemapKey(key, sourceEmail, targetEmail)
      : key;
    localStorage.setItem(targetKey, value);
  });
}

function medhubTouchClinicalLocalAt (iso) {
  localStorage.setItem(medhubClinicalLocalAtKey(), iso || new Date().toISOString());
}

function medhubGetClinicalLocalAt () {
  return localStorage.getItem(medhubClinicalLocalAtKey()) || '';
}

async function medhubCloudFetchClinical () {
  const res = await fetch('/api/auth/me?clinical=1', { headers: medhubAuthHeaders() });
  const data = await res.json();
  if (!res.ok) {
    return { ok: false, error: data.error || 'Erro ao buscar nuvem.' };
  }
  return { ok: true, clinical: data.clinical || null };
}

async function medhubCloudPushClinical (options = {}) {
  if (!medhubCloudSyncEnabledByUser()) {
    return { ok: false, skipped: true, reason: 'disabled' };
  }

  if (!(await medhubCloudSyncAvailable())) {
    return { ok: false, skipped: true, reason: 'unavailable' };
  }

  if (typeof medhubHasSessionCryptoKey === 'function' && !medhubHasSessionCryptoKey()) {
    return { ok: false, skipped: true, reason: 'locked' };
  }

  const entries = medhubCollectClinicalEntries();
  const count = Object.keys(entries).length;
  if (!count && !options.allowEmpty) {
    return { ok: false, skipped: true, reason: 'empty' };
  }

  const updatedAt = new Date().toISOString();
  const res = await fetch('/api/auth/me', {
    method: 'POST',
    headers: medhubAuthHeaders(),
    body: JSON.stringify({
      action: 'syncClinical',
      entries,
      updatedAt,
      force: !!options.force
    })
  });
  const data = await res.json();

  if (res.status === 409 && data.code === 'cloud_newer' && !options.force) {
    return { ok: false, cloudNewer: true, updatedAt: data.updatedAt };
  }

  if (!res.ok) {
    return { ok: false, error: data.error || 'Erro ao enviar para nuvem.', code: data.code };
  }

  medhubTouchClinicalLocalAt(data.updatedAt || updatedAt);
  return { ok: true, updatedAt: data.updatedAt, entryCount: data.entryCount };
}

async function medhubCloudPullClinical (options = {}) {
  if (!(await medhubCloudSyncAvailable())) {
    return { ok: false, skipped: true, reason: 'unavailable' };
  }

  const remote = await medhubCloudFetchClinical();
  if (!remote.ok) return remote;

  if (!remote.clinical?.entries || !Object.keys(remote.clinical.entries).length) {
    return { ok: true, empty: true };
  }

  const localAt = medhubGetClinicalLocalAt();
  if (!options.force && localAt && remote.clinical.updatedAt <= localAt) {
    return { ok: true, skipped: true, reason: 'local_newer' };
  }

  medhubApplyClinicalEntries(remote.clinical.entries, remote.clinical.email);
  medhubTouchClinicalLocalAt(remote.clinical.updatedAt);
  if (typeof backupRefreshUi === 'function') backupRefreshUi();
  return { ok: true, updatedAt: remote.clinical.updatedAt, pulled: true };
}

async function medhubCloudSyncAfterUnlock () {
  if (!medhubCloudSyncEnabledByUser()) return null;
  if (!(await medhubCloudSyncAvailable())) return null;
  if (typeof medhubHasSessionCryptoKey === 'function' && !medhubHasSessionCryptoKey()) return null;

  medhubUpdateCloudSyncStatus('Sincronizando…');

  const remote = await medhubCloudFetchClinical();
  if (!remote.ok) {
    medhubUpdateCloudSyncStatus(remote.error || 'Sync indisponível.', 'warn');
    return remote;
  }

  const localAt = medhubGetClinicalLocalAt();
  const cloudAt = remote.clinical?.updatedAt || '';
  const cloudCount = Object.keys(remote.clinical?.entries || {}).length;
  const localCount = Object.keys(medhubCollectClinicalEntries()).length;

  if (cloudCount && (!localAt || cloudAt > localAt)) {
    const pull = await medhubCloudPullClinical({ force: true });
    if (pull.ok && pull.pulled) {
      medhubUpdateCloudSyncStatus('Dados restaurados da nuvem (' + cloudCount + ' itens).', 'ok');
      return pull;
    }
  }

  if (localCount) {
    const push = await medhubCloudPushClinical();
    if (push.ok) {
      medhubUpdateCloudSyncStatus('Backup na nuvem atualizado.', 'ok');
      return push;
    }
    if (push.cloudNewer) {
      const pull = await medhubCloudPullClinical({ force: true });
      medhubUpdateCloudSyncStatus(pull.pulled ? 'Nuvem mais recente — dados mesclados.' : 'Sync concluído.', 'ok');
      return pull;
    }
    medhubUpdateCloudSyncStatus(push.error || 'Falha ao enviar.', 'warn');
    return push;
  }

  medhubUpdateCloudSyncStatus('Nenhum dado clínico local ainda.', 'ok');
  return { ok: true };
}

function medhubScheduleCloudPush () {
  if (!medhubCloudSyncEnabledByUser()) return;
  clearTimeout(_cloudPushTimer);
  _cloudPushTimer = setTimeout(async () => {
    const result = await medhubCloudPushClinical();
    if (result.ok) {
      medhubUpdateCloudSyncStatus('Salvo na nuvem · ' + new Date().toLocaleString('pt-BR'), 'ok');
    } else if (result.error) {
      medhubUpdateCloudSyncStatus(result.error, 'warn');
    }
  }, 2500);
}

function medhubUpdateCloudSyncStatus (msg, type) {
  const el = document.getElementById('cloud-sync-status');
  if (!el) return;
  el.hidden = false;
  el.textContent = msg;
  el.className = 'anamnese-save-status anamnese-save-status--' + (type || 'ok');
}

function initCloudSyncPanel () {
  const panel = document.getElementById('cloud-sync-panel');
  const toggle = document.getElementById('cloud-sync-enabled');
  const btn = document.getElementById('cloud-sync-now');
  if (!panel || panel.dataset.bound) return;
  panel.dataset.bound = '1';

  medhubFetchAuthConfig().then(config => {
    panel.hidden = !config.cloudEnabled;
    if (toggle) toggle.checked = medhubCloudSyncEnabledByUser();
  });

  toggle?.addEventListener('change', () => {
    medhubSetCloudSyncEnabled(toggle.checked);
    medhubUpdateCloudSyncStatus(
      toggle.checked ? 'Sync na nuvem ativado.' : 'Sync na nuvem desligado — só neste aparelho.',
      toggle.checked ? 'ok' : 'warn'
    );
    if (toggle.checked) medhubScheduleCloudPush();
  });

  btn?.addEventListener('click', async () => {
    btn.disabled = true;
    medhubUpdateCloudSyncStatus('Sincronizando…');
    const pull = await medhubCloudPullClinical({ force: true });
    const push = await medhubCloudPushClinical({ force: true, allowEmpty: true });
    if (push.ok || pull.pulled) {
      medhubUpdateCloudSyncStatus('Sincronização manual concluída.', 'ok');
    } else {
      medhubUpdateCloudSyncStatus(push.error || pull.error || 'Nada a sincronizar.', 'warn');
    }
    btn.disabled = false;
  });
}
