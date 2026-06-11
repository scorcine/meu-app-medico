const {
  cloudAuthEnabled,
  verifyToken,
  readBearer,
  json,
  parseBody
} = require('../_auth');
const { getUser, saveUser, publicUser } = require('../_users');

const TERMS_VERSION = process.env.MEDHUB_TERMS_VERSION || '2026-06-07-v1';
const PRIVACY_VERSION = process.env.MEDHUB_PRIVACY_VERSION || '2026-06-07-v1';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    json(res, 405, { error: 'Method not allowed' });
    return;
  }

  if (!cloudAuthEnabled()) {
    json(res, 503, { error: 'Login na nuvem não configurado.' });
    return;
  }

  const payload = verifyToken(readBearer(req));
  if (!payload?.email) {
    json(res, 401, { error: 'Sessão inválida.' });
    return;
  }

  let body;
  try {
    body = parseBody(req);
  } catch {
    json(res, 400, { error: 'JSON inválido' });
    return;
  }

  if (!body.acceptTerms || !body.acceptPrivacy) {
    json(res, 400, { error: 'Aceite termos e política de privacidade.' });
    return;
  }

  try {
    const user = await getUser(payload.email);
    if (!user) {
      json(res, 404, { error: 'Conta não encontrada.' });
      return;
    }

    user.termsVersion = TERMS_VERSION;
    user.privacyVersion = PRIVACY_VERSION;
    user.legalAcceptedAt = new Date().toISOString();
    await saveUser(user);

    json(res, 200, { user: publicUser(user) });
  } catch (err) {
    json(res, 500, { error: err.message || 'Erro ao registrar aceite' });
  }
};
