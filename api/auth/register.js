const {
  cloudAuthEnabled,
  hashPassword,
  createSessionToken,
  json,
  parseBody,
  normalizeEmail
} = require('../_auth');
const {
  billingEnabled,
  findCustomerByEmail,
  getActiveSubscription,
  getStripe
} = require('../_stripe');
const { getUser, saveUser, userExists, publicUser } = require('../_users');

const TERMS_VERSION = process.env.MEDHUB_TERMS_VERSION || '2026-06-07-v1';
const PRIVACY_VERSION = process.env.MEDHUB_PRIVACY_VERSION || '2026-06-07-v1';

async function subscriptionStatus (email) {
  if (!billingEnabled()) {
    return { active: true, billingDisabled: true };
  }

  const stripe = getStripe();
  const customer = await findCustomerByEmail(stripe, email);
  if (!customer) return { active: false, reason: 'no_customer' };

  const sub = await getActiveSubscription(stripe, customer.id);
  if (!sub) return { active: false, reason: 'no_subscription' };

  const interval = sub.items?.data?.[0]?.price?.recurring?.interval;
  return {
    active: true,
    plan: interval === 'year' ? 'annual' : 'monthly',
    status: sub.status
  };
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    json(res, 405, { error: 'Method not allowed' });
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

    const sub = await subscriptionStatus(email);
    if (billingEnabled() && !sub.active) {
      json(res, 403, {
        error: 'Assinatura MedHub Pro ativa necessária antes do cadastro.',
        code: 'subscription_required'
      });
      return;
    }

    const hashed = hashPassword(password);
    const user = {
      name,
      email,
      ...hashed,
      termsVersion: TERMS_VERSION,
      privacyVersion: PRIVACY_VERSION,
      createdAt: new Date().toISOString()
    };

    await saveUser(user);
    const token = createSessionToken(user);

    json(res, 201, {
      token,
      user: publicUser(user),
      subscription: sub
    });
  } catch (err) {
    json(res, 500, { error: err.message || 'Erro ao cadastrar' });
  }
};
