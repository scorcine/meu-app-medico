const { kv } = require('@vercel/kv');
const { hashPassword, userKey, normalizeEmail } = require('./_auth');
const { saveCustomerBilling, getCustomerIdByEmail, getCustomerBilling } = require('./_billing-kv');
const { getStripe, findCustomerByEmail, getActiveSubscription } = require('./_stripe');
const { getSubscriptionStatus } = require('./_subscription');
const { getUser, saveUser } = require('./_users');
const { getUserActivity } = require('./_activity-kv');

function subscriptionLabel (sub) {
  if (!sub) return '—';
  if (sub.plan === 'lifetime') return 'Vitalício';
  if (sub.plan === 'owner') return 'Owner';
  if (sub.plan === 'annual') return 'Anual';
  if (sub.plan === 'monthly') return 'Mensal';
  return sub.plan || '—';
}

async function listAdminUsers () {
  const seen = new Set();
  const rows = [];

  async function pushRow (email, user) {
    const norm = normalizeEmail(email);
    if (!norm || seen.has(norm)) return;
    seen.add(norm);

    const sub = await getSubscriptionStatus(norm, {
      user: user || undefined,
      loadUser: !user
    });
    const activity = await getUserActivity(norm);
    const loginCount = Number(activity.loginCount) || 0;
    const sessionCount = Number(activity.sessionCount) || 0;

    rows.push({
      email: norm,
      name: user?.name || '',
      hasAccount: !!user,
      active: !!sub.active,
      plan: sub.plan || '',
      planLabel: subscriptionLabel(sub),
      status: sub.status || sub.reason || '',
      source: sub.source || '',
      currentPeriodEnd: sub.currentPeriodEnd || null,
      createdAt: user?.createdAt || null,
      loginCount,
      sessionCount,
      accessCount: loginCount > 0 ? loginCount : sessionCount,
      totalPings: Number(activity.totalPings) || 0,
      lastActiveAt: activity.lastActiveAt || user?.lastLoginAt || null,
      firstActiveAt: activity.firstActiveAt || null,
      lastLoginAt: user?.lastLoginAt || null
    });
  }

  const userKeys = await kv.keys('medhub:user:*');
  for (const k of userKeys) {
    const user = await kv.get(k);
    if (user?.email) await pushRow(user.email, user);
  }

  const emailKeys = await kv.keys('medhub:stripe:email:*');
  for (const k of emailKeys) {
    const email = k.replace('medhub:stripe:email:', '');
    await pushRow(email, null);
  }

  rows.sort((a, b) => a.email.localeCompare(b.email, 'pt-BR'));
  return rows;
}

async function grantAdminAccess ({ email, password, name, lifetime }) {
  const norm = normalizeEmail(email);
  if (!norm) {
    const err = new Error('Informe um e-mail válido.');
    err.code = 'invalid_email';
    throw err;
  }

  let user = await getUser(norm);
  const stripe = getStripe();

  let customerId = user?.stripeCustomerId || null;
  if (!customerId) {
    customerId = await getCustomerIdByEmail(norm);
  }
  if (!customerId && stripe) {
    const customer = await findCustomerByEmail(stripe, norm);
    customerId = customer?.id || null;
  }
  if (!customerId) {
    customerId = 'manual_' + norm.replace(/[^a-z0-9]/g, '_');
  }

  let subscriptionId = user?.stripeSubscriptionId || 'manual_sub';
  let status = 'active';

  if (stripe && customerId && !customerId.startsWith('manual_')) {
    const sub = await getActiveSubscription(stripe, customerId);
    if (sub) {
      subscriptionId = sub.id;
      status = sub.status;
    }
  }

  await saveCustomerBilling({
    email: norm,
    customerId,
    subscriptionId,
    status,
    plan: lifetime ? 'lifetime' : 'annual',
    active: true,
    currentPeriodEnd: lifetime ? null : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    source: 'admin_grant'
  });

  let accountCreated = false;
  let passwordReset = false;

  if (!user) {
    if (password && password.length >= 8) {
      user = {
        name: name || norm.split('@')[0],
        email: norm,
        ...hashPassword(password),
        stripeCustomerId: customerId.startsWith('manual_') ? null : customerId,
        stripeSubscriptionId: subscriptionId.startsWith('manual_') ? null : subscriptionId,
        termsVersion: process.env.MEDHUB_TERMS_VERSION || '2026-06-07-v1',
        privacyVersion: process.env.MEDHUB_PRIVACY_VERSION || '2026-06-07-v1',
        createdAt: new Date().toISOString()
      };
      accountCreated = true;
    }
  } else if (password && password.length >= 8) {
    Object.assign(user, hashPassword(password));
    passwordReset = true;
  }

  if (user) {
    user.stripeCustomerId = customerId.startsWith('manual_') ? user.stripeCustomerId : customerId;
    user.stripeSubscriptionId = subscriptionId.startsWith('manual_') ? user.stripeSubscriptionId : subscriptionId;
    user.termsVersion = process.env.MEDHUB_TERMS_VERSION || user.termsVersion || '2026-06-07-v1';
    user.privacyVersion = process.env.MEDHUB_PRIVACY_VERSION || user.privacyVersion || '2026-06-07-v1';
    await saveUser(user);
  }

  const sub = await getSubscriptionStatus(norm, { user: user || undefined, loadUser: false });

  return {
    email: norm,
    lifetime: !!lifetime,
    accountCreated,
    passwordReset,
    hasAccount: !!user,
    subscription: {
      active: !!sub.active,
      plan: sub.plan,
      planLabel: subscriptionLabel(sub),
      source: sub.source
    }
  };
}

async function revokeAdminAccess ({ email, deleteUser }) {
  const norm = normalizeEmail(email);
  if (!norm) {
    const err = new Error('Informe um e-mail válido.');
    err.code = 'invalid_email';
    throw err;
  }

  const user = await getUser(norm);
  let customerId = user?.stripeCustomerId || await getCustomerIdByEmail(norm);

  if (!customerId) {
    customerId = 'manual_' + norm.replace(/[^a-z0-9]/g, '_');
  }

  const prev = await getCustomerBilling(customerId);

  await saveCustomerBilling({
    email: norm,
    customerId,
    subscriptionId: prev?.subscriptionId || user?.stripeSubscriptionId || 'manual_sub',
    status: 'revoked',
    plan: prev?.plan || 'monthly',
    active: false,
    currentPeriodEnd: prev?.currentPeriodEnd || null,
    updatedAt: new Date().toISOString(),
    source: 'admin_revoke'
  });

  let accountDeleted = false;
  if (deleteUser) {
    await kv.del(userKey(norm));
    await kv.del('medhub:profile:' + norm);
    await kv.del('medhub:clinical:' + norm);
    await kv.del('medhub:activity:' + norm);
    accountDeleted = true;
  }

  return {
    email: norm,
    revoked: true,
    accountDeleted
  };
}

module.exports = {
  listAdminUsers,
  grantAdminAccess,
  revokeAdminAccess
};
