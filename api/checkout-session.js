const { getStripe, billingEnabled, json } = require('./_stripe');

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

    json(res, 200, {
      email: session.customer_details?.email || session.customer_email || '',
      paymentStatus: session.payment_status,
      status: session.status,
      plan: session.metadata?.medhub_plan || 'monthly'
    });
  } catch (err) {
    json(res, 500, { error: err.message || 'Sessão inválida' });
  }
};
