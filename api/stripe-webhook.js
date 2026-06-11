const { getStripe, json } = require('./_stripe');
const {
  syncCheckoutSession,
  syncSubscriptionEvent,
  markSubscriptionCanceled
} = require('./_billing-kv');

module.exports.config = {
  api: {
    bodyParser: false
  }
};

async function readRawBody (req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    json(res, 405, { error: 'Method not allowed' });
    return;
  }

  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    json(res, 503, { error: 'Webhook não configurado' });
    return;
  }

  let event;
  try {
    const raw = await readRawBody(req);
    const sig = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (err) {
    json(res, 400, { error: 'Assinatura webhook inválida: ' + err.message });
    return;
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await syncCheckoutSession(event.data.object);
        break;
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await syncSubscriptionEvent(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await markSubscriptionCanceled(event.data.object);
        break;
      default:
        break;
    }
    json(res, 200, { received: true });
  } catch (err) {
    json(res, 500, { error: err.message || 'Erro ao processar webhook' });
  }
};
