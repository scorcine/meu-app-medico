const { kv } = require('@vercel/kv');
const { cloudAuthEnabled, normalizeEmail } = require('./_auth');

const MAX_BUNDLE_BYTES = 900000;

function clinicalKey (email) {
  return 'medhub:clinical:' + normalizeEmail(email);
}

async function getClinicalBundle (email) {
  if (!cloudAuthEnabled()) return null;
  return kv.get(clinicalKey(email));
}

async function saveClinicalBundle (email, bundle) {
  if (!cloudAuthEnabled()) throw new Error('Sync na nuvem indisponível.');
  const norm = normalizeEmail(email);
  if (!norm) throw new Error('E-mail inválido.');

  const payload = {
    version: 1,
    updatedAt: bundle.updatedAt || new Date().toISOString(),
    entries: bundle.entries || {}
  };

  const size = Buffer.byteLength(JSON.stringify(payload), 'utf8');
  if (size > MAX_BUNDLE_BYTES) {
    const err = new Error('Dados clínicos excedem o limite de sync na nuvem (~900 KB). Use exportação JSON local.');
    err.code = 'payload_too_large';
    throw err;
  }

  await kv.set(clinicalKey(norm), payload);
  return payload;
}

async function deleteClinicalBundle (email) {
  if (!cloudAuthEnabled()) return;
  await kv.del(clinicalKey(email));
}

module.exports = {
  getClinicalBundle,
  saveClinicalBundle,
  deleteClinicalBundle,
  MAX_BUNDLE_BYTES
};
