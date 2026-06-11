const {
  cloudAuthEnabled,
  verifyToken,
  readBearer,
  json
} = require('../_auth');
const { getUser, publicUser } = require('../_users');
const { getSubscriptionStatus } = require('../_subscription');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    json(res, 405, { error: 'Method not allowed' });
    return;
  }

  if (!cloudAuthEnabled()) {
    json(res, 503, { error: 'Login na nuvem não configurado.' });
    return;
  }

  const payload = verifyToken(readBearer(req));
  if (!payload?.email) {
    json(res, 401, { error: 'Sessão inválida ou expirada.' });
    return;
  }

  try {
    const user = await getUser(payload.email);
    if (!user) {
      json(res, 401, { error: 'Conta não encontrada.' });
      return;
    }

    const sub = await getSubscriptionStatus(user.email);
    json(res, 200, {
      user: publicUser(user),
      subscription: sub
    });
  } catch (err) {
    json(res, 500, { error: err.message || 'Erro ao validar sessão' });
  }
};
