const { siteOrigin, json } = require('./_stripe');
const {
  mercadoPagoEnabled,
  createMercadoPagoMonthlySubscription
} = require('./_mercadopago');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    json(res, 405, { error: 'Method not allowed' });
    return;
  }

  if (!mercadoPagoEnabled()) {
    json(res, 503, {
      error: 'Pagamento Elo ainda não configurado.',
      code: 'mercadopago_not_configured'
    });
    return;
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  } catch {
    json(res, 400, { error: 'JSON inválido.' });
    return;
  }

  const email = String(body.email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    json(res, 400, {
      error: 'Informe o e-mail que ficará vinculado à assinatura.',
      code: 'email_required'
    });
    return;
  }

  const amount = Number(process.env.MEDHUB_PRICE_MONTHLY_CENTS || 2990);
  const origin = siteOrigin(req);
  const backUrl = `${origin}/subscribe-success.html?provider=mercadopago`;

  try {
    const subscription = await createMercadoPagoMonthlySubscription({
      email,
      amount,
      backUrl
    });

    const url = subscription.init_point || subscription.sandbox_init_point;
    if (!url) throw new Error('Mercado Pago não retornou o checkout da assinatura.');

    json(res, 200, {
      id: subscription.id,
      url,
      provider: 'mercadopago'
    });
  } catch (err) {
    json(res, err.status && err.status < 500 ? err.status : 500, {
      error: err.message || 'Não foi possível iniciar o pagamento Elo.',
      code: err.code || 'mercadopago_error'
    });
  }
};
