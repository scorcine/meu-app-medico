const {
  cloudAuthEnabled,
  verifyPassword,
  json,
  parseBody,
  normalizeEmail
} = require('../_auth');
const { getUser } = require('../_users');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    json(res, 405, { error: 'Method not allowed' });
    return;
  }

  if (!cloudAuthEnabled()) {
    json(res, 503, { error: 'Login na nuvem não configurado.' });
    return;
  }

  let body;
  try {
    body = parseBody(req);
  } catch {
    json(res, 400, { error: 'JSON inválido' });
    return;
  }

  const email = normalizeEmail(body.email);
  const password = String(body.password || '');

  try {
    const user = await getUser(email);
    json(res, 200, { ok: !!(user && verifyPassword(password, user)) });
  } catch (err) {
    json(res, 500, { error: err.message || 'Erro ao verificar senha' });
  }
};
