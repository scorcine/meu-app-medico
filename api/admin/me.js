const { json } = require('../_auth');
const { authenticateAdminRequest, adminEnabled } = require('../_admin');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
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

  json(res, 200, {
    ok: true,
    email: auth.user.email,
    name: auth.user.name || ''
  });
};
