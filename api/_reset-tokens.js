const crypto = require('crypto');
const { kv } = require('@vercel/kv');
const { cloudAuthEnabled, normalizeEmail } = require('./_auth');

const TOKEN_TTL_SEC = 3600;
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_SEC = 3600;

function tokenKey (token) {
  return 'medhub:reset:token:' + token;
}

function rateKey (email) {
  return 'medhub:reset:rate:' + normalizeEmail(email);
}

function createToken () {
  return crypto.randomBytes(32).toString('base64url');
}

async function checkRateLimit (email) {
  if (!cloudAuthEnabled()) return true;
  const key = rateKey(email);
  const entry = await kv.get(key);
  const count = entry?.count || 0;
  return count < RATE_LIMIT_MAX;
}

async function bumpRateLimit (email) {
  if (!cloudAuthEnabled()) return;
  const key = rateKey(email);
  const entry = await kv.get(key);
  const count = (entry?.count || 0) + 1;
  await kv.set(key, { count, updatedAt: new Date().toISOString() }, { ex: RATE_LIMIT_WINDOW_SEC });
}

async function storeResetToken (email) {
  const token = createToken();
  const norm = normalizeEmail(email);
  await kv.set(tokenKey(token), { email: norm, createdAt: new Date().toISOString() }, { ex: TOKEN_TTL_SEC });
  return token;
}

async function consumeResetToken (token) {
  if (!token) return null;
  const key = tokenKey(String(token).trim());
  const data = await kv.get(key);
  if (!data?.email) return null;
  await kv.del(key);
  return data;
}

module.exports = {
  checkRateLimit,
  bumpRateLimit,
  storeResetToken,
  consumeResetToken,
  TOKEN_TTL_SEC
};
