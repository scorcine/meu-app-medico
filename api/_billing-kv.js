const { kv } = require('@vercel/kv');
const { cloudAuthEnabled, normalizeEmail } = require('./_auth');
const { getStripe, getActiveSubscription } = require('./_stripe');

const CHECKOUT_TTL_SEC = 60 * 60 * 24 * 7; // 7 dias para concluir cadastro

function checkoutKey (sessionId) {
  return 'medhub:checkout:' + String(sessionId || '').trim();
}

function customerKey (customerId) {
  return 'medhub:stripe:customer:' + String(customerId || '').trim();
}

function emailKey (email) {
  return 'medhub:stripe:email:' + normalizeEmail(email);
}

function planFromSubscription (sub) {
  const interval = sub?.items?.data?.[0]?.price?.recurring?.interval;
  return interval === 'year' ? 'annual' : 'monthly';
}

function snapshotFromSubscription (sub, email) {
  const active = sub && ['active', 'trialing'].includes(sub.status);
  return {
    email: normalizeEmail(email || sub?.metadata?.email || ''),
    customerId: typeof sub.customer === 'string' ? sub.customer : sub.customer?.id,
    subscriptionId: sub.id,
    status: sub.status,
    plan: planFromSubscription(sub),
    active,
    currentPeriodEnd: sub.current_period_end
      ? new Date(sub.current_period_end * 1000).toISOString()
      : null,
    updatedAt: new Date().toISOString()
  };
}

async function saveCustomerBilling (snapshot) {
  if (!cloudAuthEnabled() || !snapshot?.customerId) return null;
  const data = { ...snapshot, email: normalizeEmail(snapshot.email) };
  await kv.set(customerKey(data.customerId), data);
  if (data.email) {
    await kv.set(emailKey(data.email), data.customerId);
  }
  return data;
}

async function getCustomerBilling (customerId) {
  if (!cloudAuthEnabled() || !customerId) return null;
  return kv.get(customerKey(customerId));
}

async function getCustomerIdByEmail (email) {
  if (!cloudAuthEnabled()) return null;
  const norm = normalizeEmail(email);
  if (!norm) return null;
  return kv.get(emailKey(norm));
}

async function saveCheckoutRecord (record) {
  if (!cloudAuthEnabled() || !record?.sessionId) return null;
  const data = {
    ...record,
    email: normalizeEmail(record.email),
    updatedAt: new Date().toISOString()
  };
  await kv.set(checkoutKey(data.sessionId), data, { ex: CHECKOUT_TTL_SEC });
  if (data.customerId) {
    await saveCustomerBilling({
      email: data.email,
      customerId: data.customerId,
      subscriptionId: data.subscriptionId,
      status: data.subscriptionStatus || 'active',
      plan: data.plan,
      active: !!data.subscriptionActive,
      currentPeriodEnd: data.currentPeriodEnd || null
    });
  }
  return data;
}

async function getCheckoutRecord (sessionId) {
  if (!cloudAuthEnabled() || !sessionId) return null;
  return kv.get(checkoutKey(sessionId));
}

async function syncCheckoutSession (session) {
  const stripe = getStripe();
  if (!stripe || !session?.id) return null;

  const customerId = typeof session.customer === 'string'
    ? session.customer
    : session.customer?.id || null;

  let subscription = session.subscription;
  if (typeof subscription === 'string') {
    subscription = await stripe.subscriptions.retrieve(subscription);
  }

  const email = normalizeEmail(
    session.customer_details?.email ||
    session.customer_email ||
    subscription?.metadata?.email ||
    ''
  );

  let subscriptionActive = false;
  let subscriptionStatus = null;
  let plan = session.metadata?.medhub_plan || 'monthly';
  let currentPeriodEnd = null;
  let subscriptionId = typeof session.subscription === 'string'
    ? session.subscription
    : subscription?.id || null;

  if (subscription) {
    subscriptionActive = ['active', 'trialing'].includes(subscription.status);
    subscriptionStatus = subscription.status;
    plan = planFromSubscription(subscription);
    currentPeriodEnd = subscription.current_period_end
      ? new Date(subscription.current_period_end * 1000).toISOString()
      : null;
  }

  const paid = session.payment_status === 'paid' || session.status === 'complete';

  const record = {
    sessionId: session.id,
    email,
    customerId,
    subscriptionId,
    subscriptionActive: paid && subscriptionActive,
    subscriptionStatus,
    plan,
    currentPeriodEnd,
    paymentStatus: session.payment_status,
    status: session.status,
    paid
  };

  await saveCheckoutRecord(record);

  if (customerId && subscription) {
    await saveCustomerBilling(snapshotFromSubscription(subscription, email));
  }

  return record;
}

async function verifyCheckoutForRegister (sessionId) {
  const stripe = getStripe();
  if (!stripe || !sessionId) {
    return { ok: false, code: 'invalid_session', error: 'Sessão de pagamento inválida.' };
  }

  const keyIsLive = String(process.env.STRIPE_SECRET_KEY || '').includes('_live_');
  const sessionIsTest = String(sessionId).startsWith('cs_test_');
  const sessionIsLive = String(sessionId).startsWith('cs_live_');

  if (keyIsLive && sessionIsTest) {
    const site = (process.env.MEDHUB_SITE_URL || 'https://www.medhub.ia.br').replace(/\/$/, '');
    return {
      ok: false,
      code: 'test_session_on_live',
      error: 'Este pagamento foi feito em modo teste. Assine novamente em ' + site.replace(/^https:\/\//, '') + '/#planos e use o link da confirmação.'
    };
  }

  if (!keyIsLive && sessionIsLive) {
    return {
      ok: false,
      code: 'live_session_on_test',
      error: 'Ambiente de pagamento inconsistente. Contate o suporte.'
    };
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription']
    });
  } catch {
    return { ok: false, code: 'invalid_session', error: 'Sessão de pagamento não encontrada ou expirada.' };
  }

  const record = await syncCheckoutSession(session);

  if (!record) {
    return { ok: false, code: 'invalid_session', error: 'Não foi possível validar o pagamento.' };
  }

  if (!record.paid) {
    return { ok: false, code: 'payment_pending', error: 'Pagamento ainda não confirmado.' };
  }

  if (!record.customerId) {
    return { ok: false, code: 'no_customer', error: 'Cliente Stripe não vinculado ao pagamento.' };
  }

  if (!record.subscriptionActive) {
    const sub = await getActiveSubscription(stripe, record.customerId);
    if (!sub) {
      return { ok: false, code: 'subscription_required', error: 'Assinatura ativa necessária.' };
    }
    record.subscriptionActive = true;
    record.subscriptionId = sub.id;
    record.plan = planFromSubscription(sub);
    record.currentPeriodEnd = sub.current_period_end
      ? new Date(sub.current_period_end * 1000).toISOString()
      : null;
    await saveCheckoutRecord(record);
    await saveCustomerBilling(snapshotFromSubscription(sub, record.email));
  }

  return { ok: true, checkout: record };
}

async function syncSubscriptionEvent (subscription) {
  const stripe = getStripe();
  if (!subscription?.id) return null;

  let sub = subscription;
  if (!sub.items?.data?.length) {
    sub = await stripe.subscriptions.retrieve(sub.id, { expand: ['items.data.price'] });
  }

  const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer?.id;
  let email = sub.metadata?.medhub_email || '';

  if (!email && customerId) {
    const existing = await getCustomerBilling(customerId);
    email = existing?.email || '';
    if (!email && stripe) {
      try {
        const customer = await stripe.customers.retrieve(customerId);
        email = customer.email || '';
      } catch (err) {
        if (!(err.code === 'resource_missing' || /No such customer/i.test(err.message || ''))) {
          throw err;
        }
      }
    }
  }

  const snapshot = snapshotFromSubscription(sub, email);
  return saveCustomerBilling(snapshot);
}

async function markSubscriptionCanceled (subscription) {
  const customerId = typeof subscription.customer === 'string'
    ? subscription.customer
    : subscription.customer?.id;
  if (!customerId) return null;

  const existing = await getCustomerBilling(customerId);
  const snapshot = {
    ...(existing || {}),
    customerId,
    subscriptionId: subscription.id,
    status: subscription.status || 'canceled',
    active: false,
    updatedAt: new Date().toISOString()
  };
  return saveCustomerBilling(snapshot);
}

module.exports = {
  checkoutKey,
  saveCheckoutRecord,
  getCheckoutRecord,
  saveCustomerBilling,
  getCustomerBilling,
  getCustomerIdByEmail,
  syncCheckoutSession,
  verifyCheckoutForRegister,
  syncSubscriptionEvent,
  markSubscriptionCanceled,
  planFromSubscription,
  snapshotFromSubscription
};
