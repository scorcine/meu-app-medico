const { json } = require('./_auth');
const { authenticateRequest } = require('./_request-auth');
const { isOwnerEmail } = require('./_subscription');

async function authenticateAdminRequest (req, res) {
  const auth = await authenticateRequest(req, res);
  if (!auth) return null;

  if (!isOwnerEmail(auth.user.email)) {
    json(res, 403, { error: 'Acesso restrito ao administrador.', code: 'not_admin' });
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
  adminEnabled
};
