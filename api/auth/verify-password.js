const crypto = require('crypto');
const {
  cloudAuthEnabled,
  verifyPassword,
  hashPassword,
  json,
  parseBody,
  normalizeEmail
} = require('../_auth');
const { getUser, saveUser } = require('../_users');
const { deleteClinicalBundle } = require('../_clinical-kv');
const {
  checkRateLimit,
  bumpRateLimit,
  storeResetToken,
  consumeResetToken
} = require('../_reset-tokens');
const {
  sendPasswordResetEmail,
  passwordResetEmailConfigured,
  buildResetUrl
} = require('../_email');

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

  const action = body.action || 'verify';

  if (action === 'requestReset') {
    await handleRequestReset(req, res, body);
    return;
  }

  if (action === 'confirmReset') {
    await handleConfirmReset(res, body);
    return;
  }

  await handleVerify(res, body);
};

async function handleVerify (res, body) {
  const email = normalizeEmail(body.email);
  const password = String(body.password || '');

  try {
    const user = await getUser(email);
    json(res, 200, { ok: !!(user && verifyPassword(password, user)) });
  } catch (err) {
    json(res, 500, { error: err.message || 'Erro ao verificar senha' });
  }
}

async function handleRequestReset (req, res, body) {
  if (!passwordResetEmailConfigured()) {
    json(res, 503, {
      error: 'Recuperação por e-mail não configurada. Configure RESEND_API_KEY na Vercel.',
      code: 'email_not_configured'
    });
    return;
  }

  const email = normalizeEmail(body.email);
  if (!email) {
    json(res, 400, { error: 'Informe o e-mail.' });
    return;
  }

  const genericOk = {
    ok: true,
    message: 'Se o e-mail existir, enviamos um link de redefinição (válido por 1 hora).'
  };

  try {
    const user = await getUser(email);
    if (!user) {
      json(res, 200, genericOk);
      return;
    }

    if (!(await checkRateLimit(email))) {
      json(res, 429, { error: 'Muitas tentativas. Aguarde 1 hora e tente novamente.' });
      return;
    }

    const token = await storeResetToken(email);
    const resetUrl = buildResetUrl(req, token);
    await sendPasswordResetEmail(email, resetUrl);
    await bumpRateLimit(email);

    json(res, 200, genericOk);
  } catch (err) {
    if (err.code === 'email_not_configured' || err.code === 'email_send_failed') {
      json(res, 503, { error: err.message, code: err.code });
      return;
    }
    json(res, 500, { error: err.message || 'Erro ao solicitar redefinição' });
  }
}

async function handleConfirmReset (res, body) {
  const token = String(body.token || '').trim();
  const newPassword = String(body.newPassword || '');

  if (!token || !newPassword) {
    json(res, 400, { error: 'Token e nova senha são obrigatórios.' });
    return;
  }

  if (newPassword.length < 8) {
    json(res, 400, { error: 'A senha deve ter no mínimo 8 caracteres.' });
    return;
  }

  try {
    const data = await consumeResetToken(token);
    if (!data?.email) {
      json(res, 400, { error: 'Link inválido ou expirado.', code: 'invalid_token' });
      return;
    }

    const user = await getUser(data.email);
    if (!user) {
      json(res, 400, { error: 'Conta não encontrada.', code: 'invalid_token' });
      return;
    }

    Object.assign(user, hashPassword(newPassword));
    user.passwordResetAt = new Date().toISOString();
    await saveUser(user);
    await deleteClinicalBundle(data.email);

    json(res, 200, {
      ok: true,
      message: 'Senha redefinida. Faça login com a nova senha.',
      clinicalDataReset: true
    });
  } catch (err) {
    json(res, 500, { error: err.message || 'Erro ao redefinir senha' });
  }
};
