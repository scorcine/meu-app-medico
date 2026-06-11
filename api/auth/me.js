const {
  cloudAuthEnabled,
  verifyToken,
  readBearer,
  verifyPassword,
  hashPassword,
  json,
  parseBody,
  normalizeEmail
} = require('../_auth');
const { getUser, saveUser, publicUser } = require('../_users');
const { getSubscriptionStatus } = require('../_subscription');
const { getClinicalBundle, saveClinicalBundle } = require('../_clinical-kv');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    await handleGet(req, res);
    return;
  }

  if (req.method === 'POST') {
    await handlePost(req, res);
    return;
  }

  json(res, 405, { error: 'Method not allowed' });
};

async function handleGet (req, res) {
  if (!cloudAuthEnabled()) {
    json(res, 503, { error: 'Login na nuvem não configurado.' });
    return;
  }

  const payload = verifyToken(readBearer(req));
  if (!payload?.email) {
    json(res, 401, { error: 'Sessão inválida ou expirada.' });
    return;
  }

  try {
    const user = await getUser(payload.email);
    if (!user) {
      json(res, 401, { error: 'Conta não encontrada.' });
      return;
    }

    const sub = await getSubscriptionStatus(user.email, { user, loadUser: false });
    const out = {
      user: publicUser(user),
      subscription: sub
    };

    const wantClinical = String(req.query?.clinical || '') === '1';
    if (wantClinical) {
      const bundle = await getClinicalBundle(user.email);
      out.clinical = bundle
        ? {
          updatedAt: bundle.updatedAt,
          entryCount: Object.keys(bundle.entries || {}).length,
          entries: bundle.entries || {}
        }
        : null;
    }

    json(res, 200, out);
  } catch (err) {
    json(res, 500, { error: err.message || 'Erro ao validar sessão' });
  }
}

async function handlePost (req, res) {
  if (!cloudAuthEnabled()) {
    json(res, 503, { error: 'Login na nuvem não configurado.' });
    return;
  }

  const payload = verifyToken(readBearer(req));
  if (!payload?.email) {
    json(res, 401, { error: 'Sessão inválida ou expirada.' });
    return;
  }

  let body;
  try {
    body = parseBody(req);
  } catch {
    json(res, 400, { error: 'JSON inválido' });
    return;
  }

  if (body.action === 'changePassword') {
    await handleChangePassword(req, res, payload, body);
    return;
  }

  if (body.action === 'syncClinical') {
    await handleSyncClinical(res, payload, body);
    return;
  }

  json(res, 400, { error: 'Ação inválida.' });
}

async function handleChangePassword (req, res, payload, body) {
  const currentPassword = String(body.currentPassword || '');
  const newPassword = String(body.newPassword || '');

  if (!currentPassword || !newPassword) {
    json(res, 400, { error: 'Informe a senha atual e a nova senha.' });
    return;
  }

  if (newPassword.length < 8) {
    json(res, 400, { error: 'A nova senha deve ter no mínimo 8 caracteres.' });
    return;
  }

  if (currentPassword === newPassword) {
    json(res, 400, { error: 'A nova senha deve ser diferente da atual.' });
    return;
  }

  try {
    const user = await getUser(payload.email);
    if (!user || !verifyPassword(currentPassword, user)) {
      json(res, 401, { error: 'Senha atual incorreta.' });
      return;
    }

    Object.assign(user, hashPassword(newPassword));
    await saveUser(user);

    json(res, 200, { ok: true });
  } catch (err) {
    json(res, 500, { error: err.message || 'Erro ao alterar senha' });
  }
}

async function handleSyncClinical (res, payload, body) {
  const entries = body.entries;
  if (!entries || typeof entries !== 'object' || Array.isArray(entries)) {
    json(res, 400, { error: 'Payload de sync inválido.' });
    return;
  }

  const updatedAt = String(body.updatedAt || new Date().toISOString());
  const email = normalizeEmail(payload.email);

  try {
    const existing = await getClinicalBundle(email);
    if (existing?.updatedAt && existing.updatedAt > updatedAt && !body.force) {
      json(res, 409, {
        error: 'Versão na nuvem é mais recente.',
        code: 'cloud_newer',
        updatedAt: existing.updatedAt,
        entryCount: Object.keys(existing.entries || {}).length
      });
      return;
    }

    const saved = await saveClinicalBundle(email, { entries, updatedAt });
    json(res, 200, {
      ok: true,
      updatedAt: saved.updatedAt,
      entryCount: Object.keys(saved.entries || {}).length
    });
  } catch (err) {
    if (err.code === 'payload_too_large') {
      json(res, 413, { error: err.message, code: err.code });
      return;
    }
    json(res, 500, { error: err.message || 'Erro ao sincronizar' });
  }
}
