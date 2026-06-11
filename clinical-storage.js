/* Armazenamento local criptografado — listas clínicas (pacientes, consultas) */

function clinicalStorageKey (type) {
  const user = typeof getSession === 'function' ? getSession() : null;
  return 'medhub-' + type + '-' + (user?.email || 'local');
}

function clinicalLoadRaw (type) {
  try {
    return localStorage.getItem(clinicalStorageKey(type));
  } catch {
    return null;
  }
}

async function clinicalLoadList (type) {
  const raw = clinicalLoadRaw(type);
  if (!raw) return [];

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }

  if (Array.isArray(parsed)) {
    if (typeof medhubHasSessionCryptoKey === 'function' && medhubHasSessionCryptoKey()) {
      await clinicalSaveList(type, parsed);
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

async function clinicalSaveList (type, list) {
  if (typeof medhubHasSessionCryptoKey === 'function' && medhubHasSessionCryptoKey()) {
    const enc = await medhubEncryptJson(list);
    localStorage.setItem(clinicalStorageKey(type), JSON.stringify(enc));
  } else {
    localStorage.setItem(clinicalStorageKey(type), JSON.stringify(list));
  }
  if (typeof medhubTouchClinicalLocalAt === 'function') {
    medhubTouchClinicalLocalAt();
  }
  if (typeof medhubScheduleCloudPush === 'function') {
    medhubScheduleCloudPush();
  }
}

function clinicalNewId () {
  return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
}

function clinicalNeedsUnlock (type) {
  const raw = clinicalLoadRaw(type);
  return !!(raw && raw.includes('"enc":true') &&
    typeof medhubHasSessionCryptoKey === 'function' && !medhubHasSessionCryptoKey());
}

function clinicalNorm (text) {
  return (text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}
