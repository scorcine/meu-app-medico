const {
  cloudAuthEnabled,
  verifyToken,
  readBearer,
  json
} = require('../_auth');
const { billingEnabled } = require('../_stripe');
const { getUser, publicUser } = require('../_users');
const { findCustomerByEmail, getActiveSubscription, getStripe } = require('../_stripe');

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

    const sub = await subscriptionStatus(user.email);
    json(res, 200, {
      user: publicUser(user),
      subscription: sub
    });
  } catch (err) {
    json(res, 500, { error: err.message || 'Erro ao validar sessão' });
  }
};
