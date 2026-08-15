const { json } = require('./_stripe');
const { saveCustomerBilling } = require('./_billing-kv');
const {
  mercadoPagoEnabled,
  getMercadoPagoSubscription,
  mercadoPagoSubscriptionSnapshot
} = require('./_mercadopago');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
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

  const id = String(req.query?.id || '').trim();
  if (!id) {
    json(res, 400, { error: 'Identificador da assinatura obrigatório.' });
    return;
  }

  try {
    const subscription = await getMercadoPagoSubscription(id);
    const snapshot = mercadoPagoSubscriptionSnapshot(subscription);

    // Só torna o Mercado Pago a fonte de acesso após autorização.
    // Uma tentativa ainda pendente não pode esconder uma assinatura Stripe válida.
    if (snapshot.active && snapshot.email && snapshot.subscriptionId) {
      await saveCustomerBilling(snapshot);
    }

    json(res, 200, {
      id: snapshot.subscriptionId,
      email: snapshot.email,
      active: snapshot.active,
      status: snapshot.status,
      plan: snapshot.plan,
      currentPeriodEnd: snapshot.currentPeriodEnd,
      readyToRegister: snapshot.active
    });
  } catch (err) {
    json(res, err.status === 404 ? 404 : 500, {
      error: err.message || 'Não foi possível validar a assinatura Elo.',
      code: err.code || 'mercadopago_error'
    });
  }
};
