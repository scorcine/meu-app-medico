const { kv } = require('@vercel/kv');
const crypto = require('crypto');
const { normalizeEmail } = require('./_auth');

const ADMIN_LOG_KEY = 'medhub:admin-log';
const SITE_MARKETING_KEY = 'medhub:site-marketing';
const MAX_LOG = 200;
const ADMIN_UNLOCK_MAX_ATTEMPTS = 5;
const ADMIN_UNLOCK_WINDOW_SEC = 15 * 60;

const MARKETING_FIELDS = [
  'instagramUrl',
  'instagramHandle',
  'supportEmail',
  'supportWhatsapp',
  'supportWhatsappAlt',
  'supportHours',
  'linksBio',
  'linksEstudantes',
  'landingEstudantes',
  'metaPixelId'
];

function notesKey (email) {
  return 'medhub:admin-notes:' + normalizeEmail(email);
}

function normalizeAdminPin (value) {
  return String(value || '').trim().replace(/^["']|["']$/g, '');
}

function adminPinConfigured () {
  return !!normalizeAdminPin(
    process.env.MEDHUB_ADMIN_MASTER_PASSWORD || process.env.MEDHUB_ADMIN_PIN
  );
}

function verifyAdminPin (pin) {
  const expected = normalizeAdminPin(
    process.env.MEDHUB_ADMIN_MASTER_PASSWORD || process.env.MEDHUB_ADMIN_PIN
  );
  if (!expected) return true;
  const received = normalizeAdminPin(pin);
  const expectedHash = crypto.createHash('sha256').update(expected).digest();
  const receivedHash = crypto.createHash('sha256').update(received).digest();
  return crypto.timingSafeEqual(expectedHash, receivedHash);
}

function adminUnlockRateKey (email) {
  const id = crypto.createHash('sha256').update(normalizeEmail(email)).digest('hex').slice(0, 24);
  return 'medhub:admin-unlock-rate:' + id;
}

async function adminUnlockAllowed (email) {
  const entry = await kv.get(adminUnlockRateKey(email));
  return (Number(entry?.count) || 0) < ADMIN_UNLOCK_MAX_ATTEMPTS;
}

async function recordAdminUnlockFailure (email) {
  const key = adminUnlockRateKey(email);
  const entry = await kv.get(key);
  await kv.set(key, {
    count: (Number(entry?.count) || 0) + 1,
    updatedAt: new Date().toISOString()
  }, { ex: ADMIN_UNLOCK_WINDOW_SEC });
}

async function clearAdminUnlockFailures (email) {
  await kv.del(adminUnlockRateKey(email));
}

function adminSessionSecret () {
  return normalizeAdminPin(
    process.env.MEDHUB_ADMIN_MASTER_PASSWORD || process.env.MEDHUB_ADMIN_PIN
  );
}

function createAdminSessionToken (email) {
  const secret = adminSessionSecret();
  if (!secret) return '';
  const payload = Buffer.from(JSON.stringify({
    email: normalizeEmail(email),
    exp: Date.now() + 60 * 60 * 1000
  })).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return payload + '.' + signature;
}

function verifyAdminSessionToken (token, email) {
  const payload = readAdminSessionToken(token);
  return !!(payload && payload.email === normalizeEmail(email));
}

function readAdminSessionToken (token) {
  const secret = adminSessionSecret();
  const parts = String(token || '').split('.');
  if (!secret || parts.length !== 2) return null;

  const expected = crypto.createHmac('sha256', secret).update(parts[0]).digest();
  let received;
  try {
    received = Buffer.from(parts[1], 'base64url');
  } catch {
    return null;
  }
  if (received.length !== expected.length || !crypto.timingSafeEqual(received, expected)) return null;

  try {
    const payload = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
    if (!payload.email || Number(payload.exp) <= Date.now()) return null;
    return { email: normalizeEmail(payload.email), exp: Number(payload.exp) };
  } catch {
    return null;
  }
}

async function appendAdminLog (actorEmail, action, targetEmail, details) {
  if (!actorEmail) return;
  const entry = {
    at: new Date().toISOString(),
    actor: normalizeEmail(actorEmail),
    action: String(action || '').slice(0, 64),
    target: normalizeEmail(targetEmail || ''),
    details: details && typeof details === 'object' ? details : {}
  };
  const prev = await kv.get(ADMIN_LOG_KEY);
  const logs = Array.isArray(prev) ? prev : [];
  logs.unshift(entry);
  await kv.set(ADMIN_LOG_KEY, logs.slice(0, MAX_LOG));
  return entry;
}

async function getAdminLog (limit) {
  const max = Math.min(Math.max(Number(limit) || 50, 1), MAX_LOG);
  const prev = await kv.get(ADMIN_LOG_KEY);
  const logs = Array.isArray(prev) ? prev : [];
  return logs.slice(0, max);
}

async function getAdminNotes (email) {
  const stored = await kv.get(notesKey(email));
  return {
    email: normalizeEmail(email),
    note: typeof stored?.note === 'string' ? stored.note : '',
    updatedAt: stored?.updatedAt || null,
    updatedBy: stored?.updatedBy || null
  };
}

async function saveAdminNotes (email, note, actorEmail) {
  const norm = normalizeEmail(email);
  if (!norm) {
    const err = new Error('E-mail inválido.');
    err.code = 'invalid_email';
    throw err;
  }
  const payload = {
    note: String(note || '').trim().slice(0, 4000),
    updatedAt: new Date().toISOString(),
    updatedBy: normalizeEmail(actorEmail || '')
  };
  await kv.set(notesKey(norm), payload);
  return { email: norm, ...payload };
}

function defaultSiteMarketing () {
  const site = (process.env.MEDHUB_SITE_URL || 'https://www.medhub.ia.br').replace(/\/$/, '');
  return {
    instagramUrl: 'https://www.instagram.com/medhubpro/',
    instagramHandle: '@medhubpro',
    supportEmail: '',
    supportWhatsapp: '13997929146',
    supportWhatsappAlt: '13996066146',
    supportHours: 'Plantão 24 horas',
    linksBio: site + '/links.html',
    linksEstudantes: site + '/links-estudantes.html',
    landingEstudantes: site + '/estudantes.html',
    metaPixelId: ''
  };
}

function pickMarketingFields (data) {
  const out = {};
  MARKETING_FIELDS.forEach(key => {
    if (data?.[key] != null) out[key] = String(data[key]).trim().slice(0, 500);
  });
  return out;
}

async function getSiteMarketing () {
  const defaults = defaultSiteMarketing();
  const stored = await kv.get(SITE_MARKETING_KEY);
  if (!stored || typeof stored !== 'object') {
    return { ...defaults, updatedAt: null, updatedBy: null, source: 'defaults' };
  }
  const merged = {
    ...defaults,
    ...pickMarketingFields(stored),
    updatedAt: stored.updatedAt || null,
    updatedBy: stored.updatedBy || null,
    source: 'kv'
  };
  // Migração: handle antigo @medhub_app → @medhubpro
  const igBlob = `${merged.instagramHandle || ''} ${merged.instagramUrl || ''}`;
  if (/medhub_app/i.test(igBlob)) {
    merged.instagramUrl = defaults.instagramUrl;
    merged.instagramHandle = defaults.instagramHandle;
  }
  return merged;
}

async function saveSiteMarketing (data, actorEmail) {
  const payload = {
    ...pickMarketingFields(data),
    updatedAt: new Date().toISOString(),
    updatedBy: normalizeEmail(actorEmail || '')
  };
  await kv.set(SITE_MARKETING_KEY, payload);
  await appendAdminLog(actorEmail, 'save_marketing', '', { fields: Object.keys(payload).filter(k => MARKETING_FIELDS.includes(k)) });
  return getSiteMarketing();
}

module.exports = {
  adminPinConfigured,
  verifyAdminPin,
  createAdminSessionToken,
  verifyAdminSessionToken,
  readAdminSessionToken,
  adminUnlockAllowed,
  recordAdminUnlockFailure,
  clearAdminUnlockFailures,
  appendAdminLog,
  getAdminLog,
  getAdminNotes,
  saveAdminNotes,
  getSiteMarketing,
  saveSiteMarketing,
  defaultSiteMarketing
};
