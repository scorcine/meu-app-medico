const { json } = require('./_stripe');
const { authenticateRequest } = require('./_request-auth');
const { getSubscriptionStatus } = require('./_subscription');
const { saveCustomerBilling } = require('./_billing-kv');
const {
  cancelMercadoPagoSubscription,
  mercadoPagoSubscriptionSnapshot
} = require('./_mercadopago');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    json(res, 405, { error: 'Method not allowed' });
    return;
  }

  const auth = await authenticateRequest(req, res);
  if (!auth) return;

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
};
