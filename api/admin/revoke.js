const { json, parseBody } = require('../_auth');
const { authenticateAdminRequest, adminEnabled } = require('../_admin');
const { revokeAdminAccess } = require('../_admin-grants');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    json(res, 405, { error: 'Method not allowed' });
    return;
  }

  if (!adminEnabled()) {
    json(res, 503, {
      error: 'Painel admin não configurado. Defina MEDHUB_OWNER_EMAIL na Vercel.',
      code: 'admin_not_configured'
    });
    return;
  }

  const auth = await authenticateAdminRequest(req, res);
  if (!auth) return;

  let body;
  try {
    body = parseBody(req);
  } catch {
    json(res, 400, { error: 'JSON inválido' });
    return;
  }

  const email = String(body.email || '').trim();
  const deleteUser = !!body.deleteUser;

  if (!email) {
    json(res, 400, { error: 'Informe o e-mail.', code: 'invalid_email' });
    return;
  }

  try {
    const result = await revokeAdminAccess({ email, deleteUser });
    json(res, 200, { ok: true, ...result });
  } catch (err) {
    if (err.code === 'invalid_email') {
      json(res, 400, { error: err.message, code: err.code });
      return;
    }
    json(res, 500, { error: err.message || 'Erro ao revogar acesso.' });
  }
};
