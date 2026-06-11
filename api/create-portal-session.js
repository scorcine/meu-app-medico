const {
  getStripe,
  billingEnabled,
  siteOrigin,
  json,
  findCustomerByEmail
} = require('./_stripe');
const { verifyToken, readBearer } = require('./_auth');
const { getUser, saveUser } = require('./_users');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    json(res, 405, { error: 'Method not allowed' });
    return;
  }

  if (!billingEnabled()) {
    json(res, 503, { error: 'Pagamentos não configurados' });
    return;
  }

  const payload = verifyToken(readBearer(req));
  if (!payload?.email) {
    json(res, 401, { error: 'Faça login para gerenciar sua assinatura.' });
    return;
  }

  try {
    const user = await getUser(payload.email);
    if (!user) {
      json(res, 401, { error: 'Conta não encontrada.' });
      return;
    }

    const stripe = getStripe();
    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await findCustomerByEmail(stripe, user.email);
      if (!customer) {
        json(res, 404, { error: 'Nenhuma assinatura encontrada para esta conta.' });
        return;
      }
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await saveUser(user);
    }

    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${siteOrigin(req)}/app.html`
    });

    json(res, 200, { url: portal.url });
  } catch (err) {
    json(res, 500, { error: err.message || 'Erro ao abrir portal' });
  }
};
