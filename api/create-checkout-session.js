const {
  getStripe,
  billingEnabled,
  siteOrigin,
  json,
  resolvePromotionCode
} = require('./_stripe');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    json(res, 405, { error: 'Method not allowed' });
    return;
  }

  if (!billingEnabled()) {
    json(res, 503, { error: 'Pagamentos não configurados no servidor.' });
    return;
  }

  let body = {};
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  } catch {
    json(res, 400, { error: 'JSON inválido' });
    return;
  }

  const plan = body.plan === 'annual' ? 'annual' : 'monthly';
  const priceId = plan === 'annual'
    ? process.env.STRIPE_PRICE_ANNUAL
    : process.env.STRIPE_PRICE_MONTHLY;

  if (!priceId) {
    json(res, 500, { error: 'Price ID Stripe não configurado.' });
    return;
  }

  const email = String(body.email || '').trim().toLowerCase();
  const coupon = String(body.coupon || '').trim();
  const origin = siteOrigin(req);

  try {
    const stripe = getStripe();
    const sessionParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/subscribe-success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/index.html?canceled=1#planos`,
      // Campo "Cupom de desconto" abaixo do e-mail no Checkout Stripe
      allow_promotion_codes: true,
      // Sem cobrança imediata (cupom 100%) → não pede cartão
      payment_method_collection: 'if_required',
      billing_address_collection: 'auto',
      metadata: { medhub_plan: plan }
    };

    if (email) {
      sessionParams.customer_email = email;
      sessionParams.metadata.medhub_email = email;
      sessionParams.subscription_data = {
        ...(sessionParams.subscription_data || {}),
        metadata: {
          ...(sessionParams.subscription_data?.metadata || {}),
          medhub_email: email
        }
      };
    }

    const attribution = body.attribution && typeof body.attribution === 'object' ? body.attribution : {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (key) {
      const value = String(attribution[key] || '').trim();
      if (value) sessionParams.metadata[key] = value.slice(0, 500);
    });

    if (coupon) {
      const promo = await resolvePromotionCode(stripe, coupon);
      if (!promo) {
        json(res, 400, {
          error: 'Cupom inválido ou expirado. Confira o código ou peça um novo cupom ao MedHub.',
          code: 'invalid_coupon'
        });
        return;
      }

      const safeCoupon = coupon.slice(0, 100);
      sessionParams.allow_promotion_codes = false;
      sessionParams.discounts = [{ promotion_code: promo.id }];
      sessionParams.metadata.medhub_coupon = safeCoupon;
      sessionParams.subscription_data = {
        ...(sessionParams.subscription_data || {}),
        metadata: {
          ...(sessionParams.subscription_data?.metadata || {}),
          medhub_coupon: safeCoupon
        }
      };
    }

    const trialDays = Number(process.env.MEDHUB_TRIAL_DAYS || 0);
    if (trialDays > 0) {
      sessionParams.subscription_data = {
        ...(sessionParams.subscription_data || {}),
        trial_period_days: trialDays
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    json(res, 200, { url: session.url, sessionId: session.id });
  } catch (err) {
    json(res, 500, { error: err.message || 'Erro ao criar checkout' });
  }
};
