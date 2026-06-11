const {
  getStripe,
  billingEnabled,
  siteOrigin,
  json,
  findCustomerByEmail
} = require('./_stripe');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    json(res, 405, { error: 'Method not allowed' });
    return;
  }

  if (!billingEnabled()) {
    json(res, 503, { error: 'Pagamentos não configurados' });
    return;
  }

  let body = {};
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  } catch {
    json(res, 400, { error: 'JSON inválido' });
    return;
  }

  const email = String(body.email || '').trim().toLowerCase();
  if (!email) {
    json(res, 400, { error: 'Informe o e-mail.' });
    return;
  }

  try {
    const stripe = getStripe();
    const customer = await findCustomerByEmail(stripe, email);
    if (!customer) {
      json(res, 404, { error: 'Nenhuma assinatura encontrada para este e-mail.' });
      return;
    }

    const portal = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${siteOrigin(req)}/app.html`
    });

    json(res, 200, { url: portal.url });
  } catch (err) {
    json(res, 500, { error: err.message || 'Erro ao abrir portal' });
  }
};
