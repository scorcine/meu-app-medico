const assert = require('assert');

process.env.MERCADOPAGO_ACCESS_TOKEN = 'TEST-medhub';

const {
  mercadoPagoEnabled,
  createMercadoPagoMonthlySubscription,
  cancelMercadoPagoSubscription,
  mercadoPagoSubscriptionSnapshot
} = require('../api/_mercadopago');

async function main () {
  assert.strictEqual(mercadoPagoEnabled(), true);

  let request = null;
  global.fetch = async (url, options) => {
    request = { url, options, body: JSON.parse(options.body) };
    return {
      ok: true,
      async json () {
        return {
          id: 'preapproval-test-123',
          status: 'pending',
          init_point: 'https://www.mercadopago.com.br/subscriptions/checkout'
        };
      }
    };
  };

  const created = await createMercadoPagoMonthlySubscription({
    email: 'medico@example.com',
    amount: 2990,
    backUrl: 'https://www.medhub.ia.br/subscribe-success.html?provider=mercadopago'
  });

  assert.strictEqual(created.id, 'preapproval-test-123');
  assert.strictEqual(request.url, 'https://api.mercadopago.com/preapproval');
  assert.strictEqual(request.body.payer_email, 'medico@example.com');
  assert.strictEqual(request.body.auto_recurring.frequency, 1);
  assert.strictEqual(request.body.auto_recurring.frequency_type, 'months');
  assert.strictEqual(request.body.auto_recurring.transaction_amount, 29.9);
  assert.strictEqual(request.body.auto_recurring.currency_id, 'BRL');
  assert.strictEqual(request.body.status, 'pending');
  assert.match(request.options.headers.Authorization, /^Bearer TEST-/);
  assert.ok(request.options.headers['X-Idempotency-Key']);

  const active = mercadoPagoSubscriptionSnapshot({
    id: 'preapproval-test-123',
    payer_email: 'MEDICO@EXAMPLE.COM',
    status: 'authorized',
    next_payment_date: '2026-09-15T12:00:00.000Z'
  });
  assert.strictEqual(active.active, true);
  assert.strictEqual(active.email, 'medico@example.com');
  assert.strictEqual(active.customerId, 'manual_mp_preapproval-test-123');
  assert.strictEqual(active.plan, 'monthly_elo');
  assert.strictEqual(active.currentPeriodEnd, '2026-09-15T12:00:00.000Z');

  const canceled = mercadoPagoSubscriptionSnapshot({
    id: 'preapproval-test-123',
    payer_email: 'medico@example.com',
    status: 'cancelled'
  });
  assert.strictEqual(canceled.active, false);
  assert.strictEqual(canceled.currentPeriodEnd, null);

  global.fetch = async (url, options) => {
    request = { url, options, body: JSON.parse(options.body) };
    return {
      ok: true,
      async json () {
        return {
          id: 'preapproval-test-123',
          payer_email: 'medico@example.com',
          status: 'cancelled'
        };
      }
    };
  };
  const canceledRemote = await cancelMercadoPagoSubscription('preapproval-test-123');
  assert.strictEqual(canceledRemote.status, 'cancelled');
  assert.strictEqual(request.options.method, 'PUT');
  assert.deepStrictEqual(request.body, { status: 'cancelled' });

  console.log('Mercado Pago Elo: testes passaram.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
