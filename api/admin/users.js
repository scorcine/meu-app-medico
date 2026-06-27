const { json } = require('../_auth');
const { authenticateAdminRequest, adminEnabled } = require('../_admin');
const { listAdminUsers } = require('../_admin-grants');

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

  try {
    const users = await listAdminUsers();
    json(res, 200, { users, count: users.length });
  } catch (err) {
    json(res, 500, { error: err.message || 'Erro ao listar usuários.' });
  }
};
