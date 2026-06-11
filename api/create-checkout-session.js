const {
  getStripe,
  billingEnabled,
  siteOrigin,
  json
} = require('./_stripe');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    json(res, 405, { error: 'Method not allowed' });
    return;
  }

  if (!billingEnabled()) {
    json(res, 503, { error: 'Pagamentos não configurados no servidor.' });
    return;
  }

  let body = {};
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  } catch {
    json(res, 400, { error: 'JSON inválido' });
    return;
  }

  const plan = body.plan === 'annual' ? 'annual' : 'monthly';
  const priceId = plan === 'annual'
    ? process.env.STRIPE_PRICE_ANNUAL
    : process.env.STRIPE_PRICE_MONTHLY;

  if (!priceId) {
    json(res, 500, { error: 'Price ID Stripe não configurado.' });
    return;
  }

  const email = String(body.email || '').trim().toLowerCase();
  const origin = siteOrigin(req);

  try {
    const stripe = getStripe();
    const sessionParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/subscribe-success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing.html?canceled=1`,
      allow_promotion_codes: false,
      billing_address_collection: 'auto',
      metadata: { medhub_plan: plan }
    };

    if (email) {
      sessionParams.customer_email = email;
    }

    const trialDays = Number(process.env.MEDHUB_TRIAL_DAYS || 0);
    if (trialDays > 0) {
      sessionParams.subscription_data = { trial_period_days: trialDays };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    json(res, 200, { url: session.url, sessionId: session.id });
  } catch (err) {
    json(res, 500, { error: err.message || 'Erro ao criar checkout' });
  }
};
