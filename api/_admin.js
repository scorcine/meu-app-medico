const { json } = require('./_auth');
const { authenticateRequest } = require('./_request-auth');
const { isOwnerEmail } = require('./_subscription');
const { adminPinConfigured, verifyAdminPin } = require('./_admin-meta');

function readAdminPin (req) {
  return String(
    req.headers['x-medhub-admin-pin'] ||
    req.headers['X-Medhub-Admin-Pin'] ||
    ''
  ).trim();
}

async function authenticateAdminRequest (req, res) {
  const auth = await authenticateRequest(req, res);
  if (!auth) return null;

  if (!isOwnerEmail(auth.user.email)) {
    json(res, 403, { error: 'Acesso restrito ao administrador.', code: 'not_admin' });
    return null;
  }

  if (!verifyAdminPin(readAdminPin(req))) {
    json(res, 403, { error: 'PIN administrativo inválido.', code: 'invalid_pin' });
    return null;
  }

  return auth;
}

function adminEnabled () {
  const raw = process.env.MEDHUB_OWNER_EMAIL || process.env.MEDHUB_OWNER_EMAILS || '';
  return raw.split(/[,;\s]+/).map(e => e.trim()).filter(Boolean).length > 0;
}

module.exports = {
  authenticateAdminRequest,
  isOwnerEmail,
  adminEnabled,
  adminPinConfigured,
  readAdminPin
};
