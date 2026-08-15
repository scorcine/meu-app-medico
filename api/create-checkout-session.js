const {
  getStripe,
  billingEnabled,
  siteOrigin,
  json,
  assertPromotionCodeUsable,
  findCustomerByEmail
} = require('./_stripe');
const { syncCheckoutSession, getCheckoutRecord, saveCustomerBilling } = require('./_billing-kv');
const {
  mercadoPagoEnabled,
  createMercadoPagoMonthlySubscription,
  getMercadoPagoSubscription,
  mercadoPagoSubscriptionSnapshot
} = require('./_mercadopago');

async function handleGetMercadoPagoSubscription (req, res) {
  if (!mercadoPagoEnabled()) {
    json(res, 503, {
      error: 'Pagamento Elo ainda não configurado.',
      code: 'mercadopago_not_configured'
    });
    return;
  }

  const id = String(req.query.preapproval_id || req.query.id || '').trim();
  if (!id) {
    json(res, 400, { error: 'Identificador da assinatura obrigatório.' });
    return;
  }

  try {
    const subscription = await getMercadoPagoSubscription(id);
    const snapshot = mercadoPagoSubscriptionSnapshot(subscription);

    // Só torna o Mercado Pago a fonte de acesso após autorização.
    // Uma tentativa ainda pendente não pode esconder uma assinatura Stripe válida.
    if (snapshot.active && snapshot.email && snapshot.subscriptionId) {
      await saveCustomerBilling(snapshot);
    }

    json(res, 200, {
      id: snapshot.subscriptionId,
      email: snapshot.email,
      active: snapshot.active,
      status: snapshot.status,
      plan: snapshot.plan,
      currentPeriodEnd: snapshot.currentPeriodEnd,
      readyToRegister: snapshot.active,
      provider: 'mercadopago'
    });
  } catch (err) {
    json(res, err.status === 404 ? 404 : 500, {
      error: err.message || 'Não foi possível validar a assinatura Elo.',
      code: err.code || 'mercadopago_error'
    });
  }
}

async function handleCreateEloSubscription (req, res, body) {
  if (!mercadoPagoEnabled()) {
    json(res, 503, {
      error: 'Pagamento Elo ainda não configurado.',
      code: 'mercadopago_not_configured'
    });
    return;
  }

  const email = String(body.email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    json(res, 400, {
      error: 'Informe o e-mail que ficará vinculado à assinatura.',
      code: 'email_required'
    });
    return;
  }

  const amount = Number(process.env.MEDHUB_PRICE_MONTHLY_CENTS || 2990);
  const origin = siteOrigin(req);
  const backUrl = `${origin}/subscribe-success.html?provider=mercadopago`;

  try {
    const subscription = await createMercadoPagoMonthlySubscription({
      email,
      amount,
      backUrl
    });

    const url = subscription.init_point || subscription.sandbox_init_point;
    if (!url) throw new Error('Mercado Pago não retornou o checkout da assinatura.');

    json(res, 200, {
      id: subscription.id,
      url,
      method: 'elo',
      provider: 'mercadopago'
    });
  } catch (err) {
    json(res, err.status && err.status < 500 ? err.status : 500, {
      error: err.message || 'Não foi possível iniciar o pagamento Elo.',
      code: err.code || 'mercadopago_error'
    });
  }
}

async function handleGetCheckoutSession (req, res) {
  const mpId = String(req.query.preapproval_id || '').trim();
  if (mpId || String(req.query.provider || '').toLowerCase() === 'mercadopago') {
    await handleGetMercadoPagoSubscription(req, res);
    return;
  }

  const sessionId = String(req.query.session_id || '').trim();
  if (!sessionId) {
    json(res, 400, { error: 'session_id obrigatório' });
    return;
  }

  if (!billingEnabled()) {
    json(res, 503, { error: 'Pagamentos não configurados' });
    return;
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription']
    });

    const record = await syncCheckoutSession(session);
    const cached = record || await getCheckoutRecord(sessionId);

    json(res, 200, {
      sessionId,
      email: cached?.email || session.customer_details?.email || session.customer_email || '',
      customerId: cached?.customerId || (typeof session.customer === 'string' ? session.customer : session.customer?.id) || '',
      subscriptionId: cached?.subscriptionId || (typeof session.subscription === 'string' ? session.subscription : session.subscription?.id) || '',
      paymentStatus: session.payment_status,
      status: session.status,
      plan: cached?.plan || session.metadata?.medhub_plan || 'monthly',
      subscriptionActive: !!cached?.subscriptionActive,
      paid: cached?.paid || session.payment_status === 'paid',
      readyToRegister: !!(cached?.paid && cached?.customerId && cached?.subscriptionActive)
    });
  } catch (err) {
    json(res, 500, { error: err.message || 'Sessão inválida' });
  }
}

function planAmountCents (plan) {
  if (plan === 'annual') {
    return Number(process.env.MEDHUB_PRICE_ANNUAL_CENTS || 30498);
  }
  return Number(process.env.MEDHUB_PRICE_MONTHLY_CENTS || 2990);
}

function buildPixCheckoutSession ({ plan, email, coupon, origin, attribution, customerId }) {
  const accessDays = plan === 'annual' ? 365 : 30;
  const amount = planAmountCents(plan);
  const label = plan === 'annual'
    ? 'MedHub Pro — 12 meses (Pix)'
    : 'MedHub Pro — 1 mês (Pix)';

  const sessionParams = {
    mode: 'payment',
    payment_method_types: ['pix'],
    line_items: [{
      price_data: {
        currency: 'brl',
        unit_amount: amount,
        product_data: {
          name: label,
          description: plan === 'annual'
            ? 'Acesso completo por 12 meses via Pix (sem renovação automática).'
            : 'Acesso completo por 30 dias via Pix (sem renovação automática).'
        }
      },
      quantity: 1
    }],
    success_url: `${origin}/subscribe-success.html?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/index.html?canceled=1#planos`,
    billing_address_collection: 'auto',
    allow_promotion_codes: true,
    metadata: {
      medhub_plan: plan,
      medhub_payment: 'pix',
      medhub_access_days: String(accessDays)
    },
    payment_intent_data: {
      metadata: {
        medhub_plan: plan,
        medhub_payment: 'pix',
        medhub_access_days: String(accessDays)
      }
    }
  };

  if (customerId) {
    sessionParams.customer = customerId;
  } else if (email) {
    sessionParams.customer_email = email;
    sessionParams.customer_creation = 'always';
  } else {
    sessionParams.customer_creation = 'always';
  }

  if (email) {
    sessionParams.metadata.medhub_email = email;
    sessionParams.payment_intent_data.metadata.medhub_email = email;
  }

  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (key) {
    const value = String(attribution[key] || '').trim();
    if (value) sessionParams.metadata[key] = value.slice(0, 500);
  });

  return { sessionParams, couponable: true };
}

function buildCardCheckoutSession ({ plan, email, origin, attribution, priceId }) {
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
    metadata: {
      medhub_plan: plan,
      medhub_payment: 'card'
    }
  };

  if (email) {
    sessionParams.customer_email = email;
    sessionParams.metadata.medhub_email = email;
    sessionParams.subscription_data = {
      metadata: { medhub_email: email }
    };
  }

  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (key) {
    const value = String(attribution[key] || '').trim();
    if (value) sessionParams.metadata[key] = value.slice(0, 500);
  });

  return { sessionParams, couponable: true };
}

async function handleCreateCheckoutSession (req, res) {
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
  const rawMethod = String(body.method || 'card').trim().toLowerCase();
  const method = rawMethod === 'pix' ? 'pix' : (rawMethod === 'elo' ? 'elo' : 'card');
  const email = String(body.email || '').trim().toLowerCase();
  const coupon = String(body.coupon || '').trim();
  const origin = siteOrigin(req);
  const attribution = body.attribution && typeof body.attribution === 'object' ? body.attribution : {};

  if (method === 'elo') {
    await handleCreateEloSubscription(req, res, body);
    return;
  }

  try {
    const stripe = getStripe();
    let built;

    if (method === 'pix') {
      // Contas Stripe no Brasil: Pix é pagamento único (sem renovação automática).
      let customerId = null;
      if (email) {
        try {
          const existing = await findCustomerByEmail(stripe, email);
          customerId = existing?.id || null;
        } catch { /* cria cliente novo no checkout */ }
      }
      built = buildPixCheckoutSession({ plan, email, coupon, origin, attribution, customerId });
    } else {
      const priceId = plan === 'annual'
        ? process.env.STRIPE_PRICE_ANNUAL
        : process.env.STRIPE_PRICE_MONTHLY;

      if (!priceId) {
        json(res, 500, { error: 'Price ID Stripe não configurado.' });
        return;
      }

      built = buildCardCheckoutSession({ plan, email, origin, attribution, priceId });
    }

    const sessionParams = built.sessionParams;

    if (coupon) {
      const resolved = await assertPromotionCodeUsable(stripe, coupon);
      if (!resolved.ok) {
        json(res, 400, {
          error: resolved.promo
            ? 'Este cupom já foi utilizado ou não está mais disponível.'
            : 'Cupom inválido ou expirado. Confira o código ou peça um novo cupom ao MedHub.',
          code: 'invalid_coupon'
        });
        return;
      }

      const promo = resolved.promo;
      const safeCoupon = coupon.slice(0, 100);
      sessionParams.allow_promotion_codes = false;
      sessionParams.discounts = [{ promotion_code: promo.id }];
      sessionParams.metadata.medhub_coupon = safeCoupon;

      if (sessionParams.mode === 'subscription') {
        sessionParams.subscription_data = {
          ...(sessionParams.subscription_data || {}),
          metadata: {
            ...(sessionParams.subscription_data?.metadata || {}),
            medhub_coupon: safeCoupon
          }
        };
      } else if (sessionParams.payment_intent_data) {
        sessionParams.payment_intent_data.metadata = {
          ...(sessionParams.payment_intent_data.metadata || {}),
          medhub_coupon: safeCoupon
        };
      }
    }

    if (sessionParams.mode === 'subscription') {
      const trialDays = Number(process.env.MEDHUB_TRIAL_DAYS || 0);
      if (trialDays > 0) {
        sessionParams.subscription_data = {
          ...(sessionParams.subscription_data || {}),
          trial_period_days: trialDays
        };
      }
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    json(res, 200, { url: session.url, sessionId: session.id, method });
  } catch (err) {
    const message = err.message || 'Erro ao criar checkout';
    if (/payment method.*pix|pix.*not.*enabled|cannot use.*pix/i.test(message)) {
      json(res, 503, {
        error: 'Pix ainda não está ativado na conta Stripe. Ative em Dashboard → Configurações → Métodos de pagamento.',
        code: 'pix_not_enabled'
      });
      return;
    }
    json(res, 500, { error: message });
  }
}

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    await handleGetCheckoutSession(req, res);
    return;
  }

  if (req.method === 'POST') {
    await handleCreateCheckoutSession(req, res);
    return;
  }

  json(res, 405, { error: 'Method not allowed' });
};
