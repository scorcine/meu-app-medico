const {
  cloudAuthEnabled,
  hashPassword,
  createSessionToken,
  json,
  parseBody,
  normalizeEmail
} = require('../_auth');
const { billingEnabled } = require('../_stripe');
const { saveUser, userExists, publicUser } = require('../_users');
const { getSubscriptionStatus } = require('../_subscription');
const { platformUnavailableMessage } = require('../_platform');
const { verifyCheckoutForRegister, redeemCouponForRegister, saveCustomerBilling } = require('../_billing-kv');

const TERMS_VERSION = process.env.MEDHUB_TERMS_VERSION || '2026-06-07-v2';
const PRIVACY_VERSION = process.env.MEDHUB_PRIVACY_VERSION || '2026-06-07-v2';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    json(res, 405, { error: 'Method not allowed' });
    return;
  }

  const unavailable = platformUnavailableMessage();
  if (unavailable) {
    json(res, 503, { error: unavailable, code: 'platform_misconfigured' });
    return;
  }

  if (!cloudAuthEnabled()) {
    json(res, 503, { error: 'Login na nuvem não configurado.' });
    return;
  }

  let body;
  try {
    body = parseBody(req);
  } catch {
    json(res, 400, { error: 'JSON inválido' });
    return;
  }

  const name = String(body.name || '').trim();
  const email = normalizeEmail(body.email);
  const password = String(body.password || '');
  const acceptTerms = !!body.acceptTerms;
  const acceptPrivacy = !!body.acceptPrivacy;
  const checkoutSessionId = String(body.checkoutSessionId || body.session_id || '').trim();
  const coupon = String(body.coupon || '').trim();

  if (!name || !email || !password) {
    json(res, 400, { error: 'Preencha nome, e-mail e senha.' });
    return;
  }

  if (password.length < 8) {
    json(res, 400, { error: 'A senha deve ter no mínimo 8 caracteres.' });
    return;
  }

  if (!acceptTerms || !acceptPrivacy) {
    json(res, 400, { error: 'Aceite os termos de uso e a política de privacidade.' });
    return;
  }

  try {
    if (await userExists(email)) {
      json(res, 409, { error: 'E-mail já cadastrado.' });
      return;
    }

    let stripeCustomerId = null;
    let stripeSubscriptionId = null;
    let sub;

    if (checkoutSessionId) {
      const verified = await verifyCheckoutForRegister(checkoutSessionId);
      if (!verified.ok) {
        json(res, 403, {
          error: verified.error,
          code: verified.code
        });
        return;
      }

      const checkout = verified.checkout;
      if (checkout.email && checkout.email !== email) {
        json(res, 400, {
          error: 'Use o mesmo e-mail do pagamento: ' + checkout.email,
          code: 'email_mismatch',
          expectedEmail: checkout.email
        });
        return;
      }

      stripeCustomerId = checkout.customerId;
      stripeSubscriptionId = checkout.subscriptionId;
      sub = {
        active: true,
        email: checkout.email || email,
        customerId: stripeCustomerId,
        subscriptionId: stripeSubscriptionId,
        plan: checkout.plan,
        status: checkout.subscriptionStatus || 'active',
        currentPeriodEnd: checkout.currentPeriodEnd,
        source: 'checkout'
      };
    } else if (coupon) {
      const redeemed = await redeemCouponForRegister(email, coupon);
      if (!redeemed.ok) {
        json(res, redeemed.code === 'invalid_coupon' ? 400 : 403, {
          error: redeemed.error,
          code: redeemed.code
        });
        return;
      }

      const checkout = redeemed.checkout;
      stripeCustomerId = checkout.customerId;
      stripeSubscriptionId = checkout.subscriptionId;
      sub = {
        active: true,
        email: checkout.email || email,
        customerId: stripeCustomerId,
        subscriptionId: stripeSubscriptionId,
        plan: checkout.plan,
        status: checkout.subscriptionStatus || 'active',
        currentPeriodEnd: checkout.currentPeriodEnd,
        source: checkout.source || 'coupon'
      };
    } else {
      sub = await getSubscriptionStatus(email);
      if (sub.misconfigured) {
        json(res, 503, { error: platformUnavailableMessage(), code: 'platform_misconfigured' });
        return;
      }

      if (billingEnabled() && !sub.active) {
        json(res, 403, {
          error: 'Assinatura MedHub Pro ativa necessária. Assine em Planos, use um cupom de cortesia aqui no cadastro, ou conclua o pagamento e volte pelo link da confirmação.',
          code: 'subscription_required'
        });
        return;
      }

      stripeCustomerId = sub.customerId || null;
      stripeSubscriptionId = sub.subscriptionId || null;
    }

    const hashed = hashPassword(password);
    const user = {
      name,
      email,
      ...hashed,
      sessionVersion: 1,
      termsVersion: TERMS_VERSION,
      privacyVersion: PRIVACY_VERSION,
      createdAt: new Date().toISOString(),
      stripeCustomerId,
      stripeSubscriptionId
    };

    await saveUser(user);

    if (stripeCustomerId) {
      await saveCustomerBilling({
        email,
        customerId: stripeCustomerId,
        subscriptionId: stripeSubscriptionId,
        status: sub.status || 'active',
        plan: sub.plan,
        active: true,
        currentPeriodEnd: sub.currentPeriodEnd || null
      });
    }

    const token = createSessionToken(user, user.sessionVersion);

    json(res, 201, {
      token,
      user: publicUser(user),
      subscription: sub
    });
  } catch (err) {
    const msg = err.message || 'Erro ao cadastrar';
    const friendly = /No such customer/i.test(msg)
      ? 'Pagamento desatualizado. Assine novamente e use o link da página de confirmação após pagar.'
      : msg;
    json(res, 500, { error: friendly, code: 'register_failed' });
  }
};
