const {
  getStripe,
  billingEnabled,
  siteOrigin,
  json,
  findCustomerByEmail
} = require('./_stripe');
const { getUser, saveUser } = require('./_users');
const { authenticateRequest } = require('./_request-auth');
const { getSubscriptionStatus } = require('./_subscription');
const { saveCustomerBilling } = require('./_billing-kv');
const {
  cancelMercadoPagoSubscription,
  mercadoPagoSubscriptionSnapshot
} = require('./_mercadopago');

async function handleCancelEloSubscription (req, res, auth) {
  try {
    const status = await getSubscriptionStatus(auth.user.email, {
      user: auth.user,
      loadUser: false
    });
    if (status.source !== 'mercadopago' || !status.subscriptionId) {
      json(res, 400, { error: 'Esta conta não possui assinatura Elo ativa.' });
      return;
    }

    const canceled = await cancelMercadoPagoSubscription(status.subscriptionId);
    const snapshot = mercadoPagoSubscriptionSnapshot(canceled);
    if (snapshot.email && snapshot.email !== auth.user.email) {
      json(res, 403, { error: 'Assinatura não pertence a esta conta.' });
      return;
    }
    const paidUntil = status.currentPeriodEnd
      ? new Date(status.currentPeriodEnd).getTime()
      : 0;
    if (Number.isFinite(paidUntil) && paidUntil > Date.now()) {
      snapshot.active = true;
      snapshot.currentPeriodEnd = status.currentPeriodEnd;
      snapshot.source = 'mercadopago_canceled';
    }
    await saveCustomerBilling(snapshot);

    json(res, 200, {
      canceled: true,
      status: snapshot.status,
      currentPeriodEnd: snapshot.currentPeriodEnd,
      message: 'Renovação da assinatura Elo cancelada. O acesso continua até o fim do período pago.'
    });
  } catch (err) {
    json(res, err.status && err.status < 500 ? err.status : 500, {
      error: err.message || 'Não foi possível cancelar a assinatura Elo.'
    });
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    json(res, 405, { error: 'Method not allowed' });
    return;
  }

  const auth = await authenticateRequest(req, res);
  if (!auth) return;

  let body = {};
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  } catch {
    body = {};
  }

  const action = String(body.action || req.query?.action || '').trim().toLowerCase();
  if (action === 'cancel_elo' || action === 'cancel-elo') {
    await handleCancelEloSubscription(req, res, auth);
    return;
  }

  if (!billingEnabled()) {
    json(res, 503, { error: 'Pagamentos não configurados' });
    return;
  }

  try {
    const user = await getUser(auth.user.email);
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
