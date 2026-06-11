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
}

module.exports = {
  getStripe,
  billingEnabled,
  siteOrigin,
  json,
  findCustomerByEmail,
  getActiveSubscription
};
