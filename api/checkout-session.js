const { getStripe, billingEnabled, json } = require('./_stripe');
const { syncCheckoutSession, getCheckoutRecord } = require('./_billing-kv');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    json(res, 405, { error: 'Method not allowed' });
    return;
  }

  const sessionId = String(req.query.session_id || '').trim();
  if (!sessionId) {
    json(res, 400, { error: 'session_id obrigatório' });
    return;
  }

  if (!billingEnabled()) {
    json(res, 503, { error: 'Pagamentos não configurados' });
    return;
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription']
    });

    const record = await syncCheckoutSession(session);
    const cached = record || await getCheckoutRecord(sessionId);

    json(res, 200, {
      sessionId,
      email: cached?.email || session.customer_details?.email || session.customer_email || '',
      customerId: cached?.customerId || (typeof session.customer === 'string' ? session.customer : session.customer?.id) || '',
      subscriptionId: cached?.subscriptionId || (typeof session.subscription === 'string' ? session.subscription : session.subscription?.id) || '',
      paymentStatus: session.payment_status,
      status: session.status,
      plan: cached?.plan || session.metadata?.medhub_plan || 'monthly',
      subscriptionActive: !!cached?.subscriptionActive,
      paid: cached?.paid || session.payment_status === 'paid',
      readyToRegister: !!(cached?.paid && cached?.customerId && cached?.subscriptionActive)
    });
  } catch (err) {
    json(res, 500, { error: err.message || 'Sessão inválida' });
  }
};
