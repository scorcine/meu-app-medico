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

module.exports = {
  getStripe,
  billingEnabled,
  siteOrigin,
  json,
  findCustomerByEmail,
  getActiveSubscription,
  customerExists
};
