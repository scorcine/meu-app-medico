const {
  billingEnabled,
  getStripe,
  findCustomerByEmail,
  getActiveSubscription
} = require('./_stripe');
const { allowDevBypass } = require('./_platform');

async function getSubscriptionStatus (email) {
  if (!billingEnabled()) {
    if (allowDevBypass()) {
      return { active: true, billingDisabled: true, devBypass: true };
    }
    return { active: false, misconfigured: true, reason: 'billing_not_configured' };
  }

  const norm = String(email || '').trim().toLowerCase();
  if (!norm) {
    return { active: false, reason: 'no_email' };
  }

  const stripe = getStripe();
  const customer = await findCustomerByEmail(stripe, norm);
  if (!customer) {
    return { active: false, email: norm, reason: 'no_customer' };
  }

  const sub = await getActiveSubscription(stripe, customer.id);
  if (!sub) {
    return { active: false, email: norm, reason: 'no_subscription' };
  }

  const interval = sub.items?.data?.[0]?.price?.recurring?.interval;
  return {
    active: true,
    email: norm,
    plan: interval === 'year' ? 'annual' : 'monthly',
    status: sub.status,
    currentPeriodEnd: sub.current_period_end
      ? new Date(sub.current_period_end * 1000).toISOString()
      : null
  };
}

module.exports = { getSubscriptionStatus };
