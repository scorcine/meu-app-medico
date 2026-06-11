const {
  cloudAuthEnabled,
  verifyPassword,
  createSessionToken,
  json,
  parseBody,
  normalizeEmail
} = require('../_auth');
const {
  billingEnabled,
  findCustomerByEmail,
  getActiveSubscription,
  getStripe
} = require('../_stripe');
const { getUser, publicUser } = require('../_users');

async function subscriptionStatus (email) {
  if (!billingEnabled()) {
    return { active: true, billingDisabled: true };
  }

  const stripe = getStripe();
  const customer = await findCustomerByEmail(stripe, email);
  if (!customer) return { active: false, reason: 'no_customer' };

  const sub = await getActiveSubscription(stripe, customer.id);
  if (!sub) return { active: false, reason: 'no_subscription' };

  const interval = sub.items?.data?.[0]?.price?.recurring?.interval;
  return {
    active: true,
    plan: interval === 'year' ? 'annual' : 'monthly',
    status: sub.status
  };
}

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

    const sub = await subscriptionStatus(email);
    const token = createSessionToken(user);

    json(res, 200, {
      token,
      user: publicUser(user),
      subscription: sub
    });
  } catch (err) {
    json(res, 500, { error: err.message || 'Erro ao entrar' });
  }
};
