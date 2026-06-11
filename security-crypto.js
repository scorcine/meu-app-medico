/* Criptografia local — Web Crypto API (sem servidor) */

const MEDHUB_SESSION_CRYPTO_KEY = 'medhub-session-crypto-v1';
const MEDHUB_PBKDF2_ITER = 120000;

function medhubBufToB64 (buf) {
  const bytes = buf instanceof ArrayBuffer ? new Uint8Array(buf) : new Uint8Array(buf.buffer || buf);
  let bin = '';
  bytes.forEach(b => { bin += String.fromCharCode(b); });
  return btoa(bin);
}

function medhubB64ToBuf (b64) {
  const bin = atob(b64);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return buf;
}

function medhubConstantTimeEqual (a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function medhubHashPassword (password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const hash = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: MEDHUB_PBKDF2_ITER, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  return {
    passSalt: medhubBufToB64(salt),
    passHash: medhubBufToB64(hash),
    passVersion: 1
  };
}

async function medhubVerifyPassword (password, user) {
  if (!user || !password) return false;

  if (user.passHash && user.passSalt) {
    const salt = medhubB64ToBuf(user.passSalt);
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveBits']
    );
    const hash = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt, iterations: MEDHUB_PBKDF2_ITER, hash: 'SHA-256' },
      keyMaterial,
      256
    );
    return medhubConstantTimeEqual(medhubBufToB64(hash), user.passHash);
  }

  if (user.pass) return medhubConstantTimeEqual(user.pass, password);
  return false;
}

async function medhubUpgradeLegacyUser (user, password) {
  if (user.passHash && user.passSalt) {
    const { pass, ...rest } = user;
    return rest;
  }
  const hashed = await medhubHashPassword(password);
  return { name: user.name, email: user.email, ...hashed };
}

async function medhubDeriveAesKey (password, email) {
  const salt = new TextEncoder().encode('medhub-anamnesis:' + String(email || '').toLowerCase());
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: MEDHUB_PBKDF2_ITER, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

async function medhubUnlockSession (password, email) {
  const key = await medhubDeriveAesKey(password, email);
  sessionStorage.setItem(MEDHUB_SESSION_CRYPTO_KEY, JSON.stringify({
    email: String(email || '').toLowerCase(),
    keyJwk: await crypto.subtle.exportKey('jwk', key)
  }));
}

async function medhubGetSessionAesKey () {
  const raw = sessionStorage.getItem(MEDHUB_SESSION_CRYPTO_KEY);
  if (!raw) return null;

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  const user = typeof getSession === 'function' ? getSession() : null;
  if (!user || String(user.email).toLowerCase() !== parsed.email) return null;

  return crypto.subtle.importKey(
    'jwk',
    parsed.keyJwk,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

function medhubHasSessionCryptoKey () {
  return !!sessionStorage.getItem(MEDHUB_SESSION_CRYPTO_KEY);
}

function medhubClearSessionCrypto () {
  sessionStorage.removeItem(MEDHUB_SESSION_CRYPTO_KEY);
}

async function medhubEncryptJson (data) {
  const key = await medhubGetSessionAesKey();
  if (!key) throw new Error('Sessão criptográfica indisponível. Informe sua senha novamente.');
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const plaintext = new TextEncoder().encode(JSON.stringify(data));
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext);
  return { v: 1, enc: true, iv: medhubBufToB64(iv), data: medhubBufToB64(cipher) };
}

async function medhubDecryptJson (payload) {
  const key = await medhubGetSessionAesKey();
  if (!key) throw new Error('Informe sua senha para acessar anamneses criptografadas.');
  return medhubDecryptJsonWithKey(payload, key);
}

async function medhubDecryptJsonWithKey (payload, key) {
  const iv = medhubB64ToBuf(payload.iv);
  const cipher = medhubB64ToBuf(payload.data);
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipher);
  return JSON.parse(new TextDecoder().decode(plain));
}

async function medhubEncryptJsonWithKey (data, key) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const plaintext = new TextEncoder().encode(JSON.stringify(data));
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext);
  return { v: 1, enc: true, iv: medhubBufToB64(iv), data: medhubBufToB64(cipher) };
}

async function medhubReencryptStorageValue (raw, oldPassword, newPassword, email) {
  if (!raw || !raw.includes('"enc":true')) return { changed: false };

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { changed: false };
  }

  if (!parsed?.enc) return { changed: false };

  const oldKey = await medhubDeriveAesKey(oldPassword, email);
  const newKey = await medhubDeriveAesKey(newPassword, email);
  const data = await medhubDecryptJsonWithKey(parsed, oldKey);
  const reenc = await medhubEncryptJsonWithKey(data, newKey);
  return { changed: true, value: JSON.stringify(reenc) };
}

async function medhubReencryptAllClinicalData (oldPassword, newPassword, email) {
  const norm = String(email || '').toLowerCase();
  if (!norm || !oldPassword || !newPassword) return { ok: false, error: 'Dados incompletos.' };

  let passwordValid = false;
  const account = typeof getUsers === 'function'
    ? getUsers().find(u => String(u.email).toLowerCase() === norm)
    : null;

  if (account && (account.passHash || account.pass)) {
    passwordValid = await medhubVerifyPassword(oldPassword, account);
  } else if (typeof medhubCloudVerifyPassword === 'function') {
    passwordValid = await medhubCloudVerifyPassword(norm, oldPassword);
  }

  if (!passwordValid) {
    return { ok: false, error: 'Senha atual incorreta.' };
  }

  const keys = typeof backupStorageKeys === 'function'
    ? backupStorageKeys(norm)
    : [
      'medhub-anamneses-' + norm,
      'medhub-pacientes-' + norm,
      'medhub-consultas-' + norm
    ];

  let reencrypted = 0;
  for (const key of keys) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;
    const result = await medhubReencryptStorageValue(raw, oldPassword, newPassword, norm);
    if (result.changed) {
      localStorage.setItem(key, result.value);
      reencrypted += 1;
    }
  }

  await medhubUnlockSession(newPassword, norm);
  if (typeof medhubTouchClinicalLocalAt === 'function') {
    medhubTouchClinicalLocalAt();
  }

  return { ok: true, reencrypted };
}

function medhubSetSession (user) {
  localStorage.setItem('session', JSON.stringify({
    name: user.name,
    email: user.email
  }));
}

function medhubSanitizeSession () {
  const user = typeof getSession === 'function' ? getSession() : null;
  if (!user) return null;
  if ('pass' in user || 'passHash' in user) {
    medhubSetSession(user);
  }
  return { name: user.name, email: user.email };
}
