const Stripe = require('stripe');

function getStripe () {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: '2024-06-20' });
}

function billingEnabled () {
  return !!process.env.STRIPE_SECRET_KEY;
}

function siteOrigin (req) {
  if (process.env.MEDHUB_SITE_URL) return process.env.MEDHUB_SITE_URL.replace(/\/$/, '');
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const proto = req.headers['x-forwarded-proto'] || 'https';
  return `${proto}://${host}`;
}

function json (res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

async function findCustomerByEmail (stripe, email) {
  const list = await stripe.customers.list({
    email: String(email || '').trim().toLowerCase(),
    limit: 1
  });
  return list.data[0] || null;
}

async function getActiveSubscription (stripe, customerId) {
  if (!customerId) return null;
  try {
    const statuses = ['active', 'trialing'];
    for (const status of statuses) {
      const subs = await stripe.subscriptions.list({
        customer: customerId,
        status,
        limit: 1,
        expand: ['data.items.data.price']
      });
      if (subs.data.length) return subs.data[0];
    }
    return null;
  } catch (err) {
    if (err.code === 'resource_missing' || /No such customer/i.test(err.message || '')) {
      return null;
    }
    throw err;
  }
}

async function customerExists (stripe, customerId) {
  if (!stripe || !customerId) return false;
  try {
    const c = await stripe.customers.retrieve(customerId);
    return !c.deleted;
  } catch (err) {
    if (err.code === 'resource_missing' || /No such customer/i.test(err.message || '')) {
      return false;
    }
    throw err;
  }
}

/** Código promocional ativo no Stripe (Promotion Code, não só Coupon ID). */
async function resolvePromotionCode (stripe, code) {
  const normalized = String(code || '').trim();
  if (!normalized || !stripe) return null;

  const list = await stripe.promotionCodes.list({
    code: normalized,
    active: true,
    limit: 1
  });
  return list.data[0] || null;
}

function promotionCodeExhausted (promo, coupon) {
  if (!promo || promo.active === false) return true;
  if (promo.max_redemptions != null && promo.times_redeemed >= promo.max_redemptions) return true;
  if (coupon?.max_redemptions != null && coupon.times_redeemed >= coupon.max_redemptions) return true;
  return false;
}

async function assertPromotionCodeUsable (stripe, code) {
  const promo = await resolvePromotionCode(stripe, code);
  if (!promo) return { ok: false, promo: null, coupon: null };

  let coupon = promo.coupon;
  if (typeof coupon === 'string') {
    coupon = await stripe.coupons.retrieve(coupon);
  }
  if (promotionCodeExhausted(promo, coupon)) {
    return { ok: false, promo, coupon };
  }
  return { ok: true, promo, coupon };
}

module.exports = {
  getStripe,
  billingEnabled,
  siteOrigin,
  json,
  findCustomerByEmail,
  getActiveSubscription,
  customerExists,
  resolvePromotionCode,
  promotionCodeExhausted,
  assertPromotionCodeUsable
};
