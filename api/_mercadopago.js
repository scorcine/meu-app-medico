const crypto = require('crypto');

const MP_API_BASE = 'https://api.mercadopago.com';

function mercadoPagoEnabled () {
  return /^APP_USR-|^TEST-/.test(String(process.env.MERCADOPAGO_ACCESS_TOKEN || ''));
}

function mercadoPagoToken () {
  return String(process.env.MERCADOPAGO_ACCESS_TOKEN || '').trim();
}

async function mercadoPagoRequest (path, options = {}) {
  if (!mercadoPagoEnabled()) {
    const err = new Error('Mercado Pago não configurado.');
    err.code = 'mercadopago_not_configured';
    throw err;
  }

  const response = await fetch(MP_API_BASE + path, {
    method: options.method || 'GET',
    headers: {
      Authorization: 'Bearer ' + mercadoPagoToken(),
      'Content-Type': 'application/json',
      ...(options.idempotencyKey
        ? { 'X-Idempotency-Key': options.idempotencyKey }
        : {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      data.message ||
      data.error ||
      data.cause?.[0]?.description ||
      'Erro no Mercado Pago.';
    const err = new Error(message);
    err.status = response.status;
    err.details = data;
    throw err;
  }
  return data;
}

function mercadoPagoExternalReference () {
  return 'medhub_' + Date.now().toString(36) + '_' + crypto.randomBytes(8).toString('hex');
}

async function createMercadoPagoMonthlySubscription ({ email, amount, backUrl }) {
  const externalReference = mercadoPagoExternalReference();
  const body = {
    reason: 'MedHub Pro — assinatura mensal',
    external_reference: externalReference,
    payer_email: String(email || '').trim().toLowerCase(),
    auto_recurring: {
      frequency: 1,
      frequency_type: 'months',
      transaction_amount: Number((Number(amount) / 100).toFixed(2)),
      currency_id: 'BRL'
    },
    back_url: backUrl,
    status: 'pending'
  };

  return mercadoPagoRequest('/preapproval', {
    method: 'POST',
    body,
    idempotencyKey: externalReference
  });
}

async function getMercadoPagoSubscription (id) {
  const safeId = String(id || '').trim();
  if (!/^[a-zA-Z0-9-]{8,100}$/.test(safeId)) {
    const err = new Error('Assinatura Mercado Pago inválida.');
    err.code = 'invalid_subscription';
    throw err;
  }
  return mercadoPagoRequest('/preapproval/' + encodeURIComponent(safeId));
}

async function cancelMercadoPagoSubscription (id) {
  const safeId = String(id || '').trim();
  if (!/^[a-zA-Z0-9-]{8,100}$/.test(safeId)) {
    const err = new Error('Assinatura Mercado Pago inválida.');
    err.code = 'invalid_subscription';
    throw err;
  }
  return mercadoPagoRequest('/preapproval/' + encodeURIComponent(safeId), {
    method: 'PUT',
    body: { status: 'cancelled' },
    idempotencyKey: 'cancel_' + safeId
  });
}

function mercadoPagoSubscriptionSnapshot (subscription) {
  const status = String(subscription?.status || '').toLowerCase();
  const active = status === 'authorized';
  const nextPayment = subscription?.next_payment_date
    ? new Date(subscription.next_payment_date)
    : null;
  const fallbackEnd = new Date(Date.now() + 35 * 24 * 60 * 60 * 1000);
  const currentPeriodEnd = active
    ? (nextPayment && Number.isFinite(nextPayment.getTime())
        ? nextPayment.toISOString()
        : fallbackEnd.toISOString())
    : null;

  return {
    email: String(subscription?.payer_email || '').trim().toLowerCase(),
    customerId: 'manual_mp_' + String(subscription?.id || ''),
    subscriptionId: String(subscription?.id || ''),
    status,
    plan: 'monthly_elo',
    active,
    currentPeriodEnd,
    source: 'mercadopago',
    externalReference: subscription?.external_reference || '',
    updatedAt: new Date().toISOString()
  };
}

module.exports = {
  mercadoPagoEnabled,
  createMercadoPagoMonthlySubscription,
  getMercadoPagoSubscription,
  cancelMercadoPagoSubscription,
  mercadoPagoSubscriptionSnapshot
};
