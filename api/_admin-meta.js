const { kv } = require('@vercel/kv');
const { normalizeEmail } = require('./_auth');

const ADMIN_LOG_KEY = 'medhub:admin-log';
const MAX_LOG = 200;

function notesKey (email) {
  return 'medhub:admin-notes:' + normalizeEmail(email);
}

function normalizeAdminPin (value) {
  return String(value || '').trim().replace(/^["']|["']$/g, '');
}

function adminPinConfigured () {
  return !!normalizeAdminPin(process.env.MEDHUB_ADMIN_PIN);
}

function verifyAdminPin (pin) {
  const expected = normalizeAdminPin(process.env.MEDHUB_ADMIN_PIN);
  if (!expected) return true;
  return normalizeAdminPin(pin) === expected;
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

module.exports = {
  adminPinConfigured,
  verifyAdminPin,
  appendAdminLog,
  getAdminLog,
  getAdminNotes,
  saveAdminNotes
};
