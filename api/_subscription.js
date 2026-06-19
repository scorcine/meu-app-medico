const {
  billingEnabled,
  getStripe,
  findCustomerByEmail,
  getActiveSubscription,
  customerExists
} = require('./_stripe');
const { allowDevBypass } = require('./_platform');
const { getUser } = require('./_users');
const {
  getCustomerIdByEmail,
  getCustomerBilling,
  saveCustomerBilling,
  snapshotFromSubscription
} = require('./_billing-kv');

function statusFromSnapshot (snapshot, email) {
  if (!snapshot) return null;
  return {
    active: !!snapshot.active,
    email: normalizeEmail(email || snapshot.email),
    customerId: snapshot.customerId,
    subscriptionId: snapshot.subscriptionId,
    plan: snapshot.plan,
    status: snapshot.status,
    currentPeriodEnd: snapshot.currentPeriodEnd || null,
    source: 'kv'
  };
}

function normalizeEmail (email) {
  return String(email || '').trim().toLowerCase();
}

function isOwnerEmail (email) {
  const norm = normalizeEmail(email);
  if (!norm) return false;
  const raw = process.env.MEDHUB_OWNER_EMAIL || process.env.MEDHUB_OWNER_EMAILS || '';
  const owners = raw.split(/[,;\s]+/).map(normalizeEmail).filter(Boolean);
  return owners.includes(norm);
}

async function resolveCustomerId (email, options = {}) {
  const stripe = getStripe();
  const candidates = [
    options.customerId,
    options.user?.stripeCustomerId,
    await getCustomerIdByEmail(email)
  ].filter(Boolean);

  for (const id of candidates) {
    if (!stripe || String(id).startsWith('manual_')) return id;
    if (await customerExists(stripe, id)) return id;
  }

  if (!stripe) return null;

  const customer = await findCustomerByEmail(stripe, email);
  return customer?.id || null;
}

async function getSubscriptionStatus (email, options = {}) {
  if (!billingEnabled()) {
    if (allowDevBypass()) {
      return { active: true, billingDisabled: true, devBypass: true };
    }
    return { active: false, misconfigured: true, reason: 'billing_not_configured' };
  }

  const norm = normalizeEmail(email);
  if (!norm) {
    return { active: false, reason: 'no_email' };
  }

  if (isOwnerEmail(norm)) {
    return {
      active: true,
      email: norm,
      plan: 'owner',
      status: 'active',
      source: 'owner_bypass'
    };
  }

  let user = options.user;
  if (!user && options.loadUser !== false) {
    user = await getUser(norm);
  }

  const customerId = await resolveCustomerId(norm, { ...options, user });
  if (!customerId) {
    return { active: false, email: norm, reason: 'no_customer' };
  }

  const cached = await getCustomerBilling(customerId);
  const cachedStatus = statusFromSnapshot(cached, norm);
  if (cachedStatus?.active) {
    return cachedStatus;
  }

  const stripe = getStripe();
  const sub = await getActiveSubscription(stripe, customerId);
  if (!sub) {
    if (cachedStatus) {
      return { ...cachedStatus, active: false, reason: 'no_subscription' };
    }
    return { active: false, email: norm, customerId, reason: 'no_subscription' };
  }

  const snapshot = snapshotFromSubscription(sub, norm);
  await saveCustomerBilling(snapshot);

  return {
    active: true,
    email: norm,
    customerId,
    subscriptionId: sub.id,
    plan: snapshot.plan,
    status: sub.status,
    currentPeriodEnd: snapshot.currentPeriodEnd,
    source: 'stripe'
  };
}

module.exports = { getSubscriptionStatus, resolveCustomerId };
