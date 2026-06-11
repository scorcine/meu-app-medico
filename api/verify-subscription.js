const {
  getStripe,
  billingEnabled,
  json,
  findCustomerByEmail,
  getActiveSubscription
} = require('./_stripe');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    json(res, 405, { error: 'Method not allowed' });
    return;
  }

  if (!billingEnabled()) {
    json(res, 200, { active: true, billingDisabled: true });
    return;
  }

  const email = String(req.query.email || '').trim().toLowerCase();
  if (!email) {
    json(res, 400, { error: 'Informe o e-mail.' });
    return;
  }

  try {
    const stripe = getStripe();
    const customer = await findCustomerByEmail(stripe, email);

    if (!customer) {
      json(res, 200, { active: false, email, reason: 'no_customer' });
      return;
    }

    const sub = await getActiveSubscription(stripe, customer.id);
    if (!sub) {
      json(res, 200, { active: false, email, reason: 'no_subscription' });
      return;
    }

    const price = sub.items?.data?.[0]?.price;
    const interval = price?.recurring?.interval;
    json(res, 200, {
      active: true,
      email,
      plan: interval === 'year' ? 'annual' : 'monthly',
      status: sub.status,
      currentPeriodEnd: sub.current_period_end
        ? new Date(sub.current_period_end * 1000).toISOString()
        : null
    });
  } catch (err) {
    json(res, 500, { error: err.message || 'Erro ao verificar assinatura' });
  }
};
