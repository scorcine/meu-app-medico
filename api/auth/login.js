const {
  cloudAuthEnabled,
  verifyPassword,
  createSessionToken,
  json,
  parseBody,
  normalizeEmail
} = require('../_auth');
const { getUser, publicUser, saveUser } = require('../_users');
const { getSubscriptionStatus } = require('../_subscription');
const { platformUnavailableMessage } = require('../_platform');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    json(res, 405, { error: 'Method not allowed' });
    return;
  }

  const unavailable = platformUnavailableMessage();
  if (unavailable) {
    json(res, 503, { error: unavailable, code: 'platform_misconfigured' });
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

  if (!email || !password) {
    json(res, 400, { error: 'Informe e-mail e senha.' });
    return;
  }

  try {
    const user = await getUser(email);
    if (!user || !verifyPassword(password, user)) {
      json(res, 401, { error: 'Credenciais inválidas.' });
      return;
    }

    const sub = await getSubscriptionStatus(email, { user, loadUser: false });
    if (sub.misconfigured) {
      json(res, 503, { error: platformUnavailableMessage(), code: 'platform_misconfigured' });
      return;
    }

    if (sub.customerId && !user.stripeCustomerId) {
      user.stripeCustomerId = sub.customerId;
      user.stripeSubscriptionId = sub.subscriptionId || user.stripeSubscriptionId || null;
      await saveUser(user);
    }

    user.sessionVersion = (user.sessionVersion || 0) + 1;
    user.lastLoginAt = new Date().toISOString();
    await saveUser(user);

    const token = createSessionToken(user, user.sessionVersion);

    json(res, 200, {
      token,
      user: publicUser(user),
      subscription: sub
    });
  } catch (err) {
    json(res, 500, { error: err.message || 'Erro ao entrar' });
  }
};
