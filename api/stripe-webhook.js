const { getStripe, json } = require('./_stripe');

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

  // Stripe é a fonte da verdade; verify-subscription consulta a API.
  // Webhook reservado para logs futuros / e-mail transacional.
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
    case 'checkout.session.completed':
      break;
    default:
      break;
  }

  json(res, 200, { received: true });
};
