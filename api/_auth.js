const crypto = require('crypto');

const PBKDF2_ITER = 120000;

function cloudAuthEnabled () {
  return !!(
    process.env.MEDHUB_JWT_SECRET &&
    process.env.KV_REST_API_URL &&
    process.env.KV_REST_API_TOKEN
  );
}

function userKey (email) {
  return 'medhub:user:' + String(email || '').trim().toLowerCase();
}

function normalizeEmail (email) {
  return String(email || '').trim().toLowerCase();
}

function hashPassword (password) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.pbkdf2Sync(String(password), salt, PBKDF2_ITER, 32, 'sha256');
  return {
    passSalt: salt.toString('base64'),
    passHash: hash.toString('base64'),
    passVersion: 1
  };
}

function verifyPassword (password, user) {
  if (!user?.passHash || !user?.passSalt || !password) return false;
  const salt = Buffer.from(user.passSalt, 'base64');
  const hash = crypto.pbkdf2Sync(String(password), salt, PBKDF2_ITER, 32, 'sha256');
  const expected = Buffer.from(user.passHash, 'base64');
  return hash.length === expected.length && crypto.timingSafeEqual(hash, expected);
}

function signToken (payload) {
  const secret = process.env.MEDHUB_JWT_SECRET;
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto
    .createHmac('sha256', secret)
    .update(header + '.' + body)
    .digest('base64url');
  return header + '.' + body + '.' + sig;
}

function verifyToken (token) {
  if (!token || !process.env.MEDHUB_JWT_SECRET) return null;
  const parts = String(token).split('.');
  if (parts.length !== 3) return null;

  const [header, body, sig] = parts;
  const expected = crypto
    .createHmac('sha256', process.env.MEDHUB_JWT_SECRET)
    .update(header + '.' + body)
    .digest('base64url');

  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) return null;

  let payload;
  try {
    payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  } catch {
    return null;
  }

  if (payload.exp && Date.now() / 1000 > payload.exp) return null;
  return payload;
}

function readBearer (req) {
  const auth = req.headers.authorization || req.headers.Authorization || '';
  const match = String(auth).match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : '';
}

function createSessionToken (user) {
  const now = Math.floor(Date.now() / 1000);
  return signToken({
    sub: user.email,
    email: user.email,
    name: user.name,
    iat: now,
    exp: now + 60 * 60 * 24 * 30
  });
}

function json (res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

function parseBody (req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body);
  return {};
}

module.exports = {
  cloudAuthEnabled,
  userKey,
  normalizeEmail,
  hashPassword,
  verifyPassword,
  signToken,
  verifyToken,
  readBearer,
  createSessionToken,
  json,
  parseBody,
  PBKDF2_ITER
};
