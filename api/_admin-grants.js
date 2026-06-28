const { kv } = require('@vercel/kv');
const crypto = require('crypto');
const { hashPassword, userKey, normalizeEmail } = require('./_auth');
const { saveCustomerBilling, getCustomerIdByEmail, getCustomerBilling } = require('./_billing-kv');
const { getStripe, findCustomerByEmail, getActiveSubscription, siteOrigin, billingEnabled } = require('./_stripe');
const { getSubscriptionStatus } = require('./_subscription');
const { getUser, saveUser } = require('./_users');
const { getUserActivity, activityHasRealUsage } = require('./_activity-kv');
const { getProfessionalProfile, publicProfile } = require('./_profile');
const { daysUntilDate } = require('./_retention');
const { getAdminNotes, saveAdminNotes, appendAdminLog } = require('./_admin-meta');

function subscriptionLabel (sub) {
  if (!sub) return '—';
  if (sub.plan === 'lifetime') return 'Vitalício';
  if (sub.plan === 'owner') return 'Owner';
  if (sub.plan === 'annual') return 'Anual';
  if (sub.plan === 'monthly') return 'Mensal';
  if (sub.plan === 'courtesy') return 'Cortesia';
  return sub.plan || '—';
}

function formatBrl (cents) {
  return 'R$ ' + (cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function grantPeriodEnd (lifetime, months, accessType) {
  if (lifetime || accessType === 'lifetime') return null;
  const m = accessType === 'year' ? 12 : Math.max(1, Math.min(36, Number(months) || 1));
  return new Date(Date.now() + m * 30 * 24 * 60 * 60 * 1000).toISOString();
}

function grantPlan (lifetime, months, accessType) {
  if (lifetime || accessType === 'lifetime') return 'lifetime';
  if (accessType === 'year' || Number(months) === 12) return 'annual';
  return 'courtesy';
}

async function buildUserRow (email, user) {
  const norm = normalizeEmail(email);
  if (!norm) return null;

  const sub = await getSubscriptionStatus(norm, {
    user: user || undefined,
    loadUser: !user
  });
  const activity = await getUserActivity(norm);
  const loginCount = Number(activity.loginCount) || 0;
  const sessionCount = Number(activity.sessionCount) || 0;
  const customerId = sub.customerId || user?.stripeCustomerId || await getCustomerIdByEmail(norm) || '';
  const billing = customerId ? await getCustomerBilling(customerId) : null;
  const endIso = sub.courtesyEndsAt || sub.currentPeriodEnd || billing?.courtesyEndsAt || billing?.currentPeriodEnd || null;
  const hasUsedApp = activityHasRealUsage(activity, user?.createdAt);

  return {
    email: norm,
    name: user?.name || '',
    hasAccount: !!user,
    active: !!sub.active,
    plan: sub.plan || billing?.plan || '',
    planLabel: subscriptionLabel(sub.plan ? sub : billing),
    status: sub.status || sub.reason || billing?.status || '',
    stripeStatus: sub.status || billing?.status || '',
    source: sub.source || billing?.source || '',
    currentPeriodEnd: endIso,
    courtesyEndsAt: sub.courtesyEndsAt || billing?.courtesyEndsAt || null,
    isCourtesy: !!(sub.isCourtesy || billing?.isCourtesy),
    daysUntilEnd: daysUntilDate(endIso),
    customerId: customerId || '',
    couponCode: billing?.couponCode || billing?.metadata?.medhub_coupon || null,
    createdAt: user?.createdAt || null,
    loginCount,
    sessionCount,
    accessCount: loginCount > 0 ? loginCount : sessionCount,
    totalPings: Number(activity.totalPings) || 0,
    lastActiveAt: activity.lastActiveAt || user?.lastLoginAt || null,
    firstActiveAt: activity.firstActiveAt || null,
    lastLoginAt: user?.lastLoginAt || null,
    hasUsedApp,
    neverReturned: !hasUsedApp && (loginCount + sessionCount) === 0 && !!user?.createdAt,
    expiringSoon: sub.active && daysUntilDate(endIso) != null && daysUntilDate(endIso) <= 7
  };
}

async function listAdminUsers () {
  const seen = new Set();
  const rows = [];

  async function pushRow (email, user) {
    const row = await buildUserRow(email, user);
    if (!row || seen.has(row.email)) return;
    seen.add(row.email);
    rows.push(row);
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

function computeAdminStats (users) {
  const monthlyCents = Number(process.env.MEDHUB_PRICE_MONTHLY_CENTS || 2990);
  const annualCents = Number(process.env.MEDHUB_PRICE_ANNUAL_CENTS || 30498);
  const stats = {
    total: users.length,
    active: 0,
    inactive: 0,
    lifetime: 0,
    courtesy: 0,
    neverUsed: 0,
    neverReturned: 0,
    expiringSoon: 0,
    payingMonthly: 0,
    payingAnnual: 0,
    withCoupon: 0,
    mrrCents: 0,
    mrrDisplay: formatBrl(0)
  };

  users.forEach(u => {
    if (u.active) stats.active++;
    else stats.inactive++;
    if (u.plan === 'lifetime') stats.lifetime++;
    if (u.isCourtesy) stats.courtesy++;
    if (u.hasAccount && !u.hasUsedApp) stats.neverUsed++;
    if (u.neverReturned) stats.neverReturned++;
    if (u.expiringSoon) stats.expiringSoon++;
    if (u.couponCode) stats.withCoupon++;
    if (u.active && u.source === 'stripe' && u.plan === 'monthly') {
      stats.payingMonthly++;
      stats.mrrCents += monthlyCents;
    }
    if (u.active && u.source === 'stripe' && u.plan === 'annual') {
      stats.payingAnnual++;
      stats.mrrCents += Math.round(annualCents / 12);
    }
  });

  stats.mrrDisplay = formatBrl(stats.mrrCents);
  return stats;
}

async function getAdminUserDetail (email) {
  const norm = normalizeEmail(email);
  if (!norm) {
    const err = new Error('E-mail inválido.');
    err.code = 'invalid_email';
    throw err;
  }

  const user = await getUser(norm);
  const row = await buildUserRow(norm, user);
  const profileRaw = await getProfessionalProfile(norm, user?.name);
  const profile = publicProfile(profileRaw);
  const notes = await getAdminNotes(norm);
  const activity = await getUserActivity(norm);

  let stripeDetail = null;
  const stripe = getStripe();
  const customerId = row?.customerId;
  if (stripe && customerId && !String(customerId).startsWith('manual_')) {
    try {
      const sub = await getActiveSubscription(stripe, customerId);
      if (sub) {
        stripeDetail = {
          id: sub.id,
          status: sub.status,
          cancelAtPeriodEnd: !!sub.cancel_at_period_end,
          currentPeriodEnd: sub.current_period_end
            ? new Date(sub.current_period_end * 1000).toISOString()
            : null,
          coupon: sub.metadata?.medhub_coupon || sub.discount?.coupon?.name || null
        };
      }
    } catch {
      stripeDetail = null;
    }
  }

  return {
    ...row,
    profile,
    onboardingComplete: !!(profile?.complete || profile?.onboardingComplete),
    notes: notes.note,
    notesUpdatedAt: notes.updatedAt,
    activitySections: Object.keys(activity.sections || {}).filter(k => k !== 'session_start'),
    stripe: stripeDetail
  };
}

async function grantAdminAccess ({ email, password, name, lifetime, months, accessType, actorEmail }) {
  const norm = normalizeEmail(email);
  if (!norm) {
    const err = new Error('Informe um e-mail válido.');
    err.code = 'invalid_email';
    throw err;
  }

  const isLifetime = lifetime || accessType === 'lifetime';
  const plan = grantPlan(isLifetime, months, accessType);
  const currentPeriodEnd = grantPeriodEnd(isLifetime, months, accessType);
  const isCourtesy = plan === 'courtesy';

  let user = await getUser(norm);
  const stripe = getStripe();

  let customerId = user?.stripeCustomerId || null;
  if (!customerId) customerId = await getCustomerIdByEmail(norm);
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
    plan,
    active: true,
    currentPeriodEnd,
    courtesyEndsAt: isCourtesy ? currentPeriodEnd : null,
    isCourtesy,
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

  await appendAdminLog(actorEmail, 'grant', norm, {
    plan,
    lifetime: isLifetime,
    months: isLifetime ? null : (accessType === 'year' ? 12 : Number(months) || 1),
    passwordReset,
    accountCreated
  });

  const sub = await getSubscriptionStatus(norm, { user: user || undefined, loadUser: false });

  return {
    email: norm,
    lifetime: isLifetime,
    plan,
    planLabel: subscriptionLabel(sub),
    currentPeriodEnd,
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

async function revokeAdminAccess ({ email, deleteUser, actorEmail }) {
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
    await kv.del('medhub:admin-notes:' + norm);
    accountDeleted = true;
  }

  await appendAdminLog(actorEmail, deleteUser ? 'revoke_delete' : 'revoke', norm, {});

  return { email: norm, revoked: true, accountDeleted };
}

async function createAdminCoupon ({ code, months, actorEmail }) {
  if (!billingEnabled()) {
    const err = new Error('Stripe não configurado.');
    err.code = 'stripe_missing';
    throw err;
  }

  const stripe = getStripe();
  const m = Math.max(1, Math.min(12, Number(months) || 1));
  const promoCode = String(code || '').trim().toUpperCase() || ('MEDHUB' + m + 'M-' + crypto.randomBytes(3).toString('hex').toUpperCase());
  const finalCode = promoCode.slice(0, 40);

  const existing = await stripe.promotionCodes.list({ code: finalCode, limit: 1 });
  if (existing.data[0]) {
    const err = new Error('Código já existe no Stripe: ' + finalCode);
    err.code = 'coupon_exists';
    throw err;
  }

  const coupon = await stripe.coupons.create({
    name: `MedHub — ${m} mês(es) cortesia (uso único)`,
    percent_off: 100,
    duration: 'repeating',
    duration_in_months: m,
    max_redemptions: 1,
    metadata: { medhub: 'cortesia', medhub_months: String(m), medhub_single_use: '1' }
  });

  const promo = await stripe.promotionCodes.create({
    coupon: coupon.id,
    code: finalCode,
    max_redemptions: 1,
    metadata: { medhub: 'cortesia', medhub_single_use: '1' }
  });

  await appendAdminLog(actorEmail, 'create_coupon', '', { code: finalCode, months: m });

  return {
    code: finalCode,
    months: m,
    promotionId: promo.id,
    registerUrl: (process.env.MEDHUB_SITE_URL || 'https://www.medhub.ia.br').replace(/\/$/, '') + '/register.html'
  };
}

async function createAdminPortalUrl ({ email, req }) {
  if (!billingEnabled()) {
    const err = new Error('Stripe não configurado.');
    err.code = 'stripe_missing';
    throw err;
  }

  const norm = normalizeEmail(email);
  if (!norm) {
    const err = new Error('E-mail inválido.');
    err.code = 'invalid_email';
    throw err;
  }

  const user = await getUser(norm);
  const stripe = getStripe();
  let customerId = user?.stripeCustomerId || await getCustomerIdByEmail(norm);
  if (!customerId) {
    const customer = await findCustomerByEmail(stripe, norm);
    customerId = customer?.id || null;
  }
  if (!customerId || String(customerId).startsWith('manual_')) {
    const err = new Error('Cliente Stripe não encontrado para este e-mail.');
    err.code = 'no_stripe_customer';
    throw err;
  }

  const portal = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${siteOrigin(req)}/admin.html`
  });

  return { url: portal.url, email: norm };
}

async function saveUserAdminNotes ({ email, note, actorEmail }) {
  const saved = await saveAdminNotes(email, note, actorEmail);
  await appendAdminLog(actorEmail, 'save_notes', saved.email, { length: saved.note.length });
  return saved;
}

module.exports = {
  listAdminUsers,
  computeAdminStats,
  getAdminUserDetail,
  grantAdminAccess,
  revokeAdminAccess,
  createAdminCoupon,
  createAdminPortalUrl,
  saveUserAdminNotes,
  subscriptionLabel
};
