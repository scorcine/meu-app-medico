const { json, parseBody } = require('../_auth');
const { authenticateRequest } = require('../_request-auth');
const {
  getProfessionalProfile,
  saveProfessionalProfile,
  publicProfile,
  profileOnboardingComplete,
  ensurePaidUserProfile
} = require('../_profile');
const { getSubscriptionStatus } = require('../_subscription');

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
  const auth = await authenticateRequest(req, res);
  if (!auth) return;

  try {
    const sub = await getSubscriptionStatus(auth.user.email, { user: auth.user, loadUser: false });
    const raw = await ensurePaidUserProfile(auth.user.email, auth.user, sub)
      || await getProfessionalProfile(auth.user.email, auth.user.name);
    const profile = publicProfile(raw);
    json(res, 200, {
      profile,
      onboardingComplete: !!(profile?.complete || profileOnboardingComplete(raw))
    });
  } catch (err) {
    json(res, 500, { error: err.message || 'Erro ao carregar perfil' });
  }
}

async function handlePost (req, res) {
  const auth = await authenticateRequest(req, res);
  if (!auth) return;

  let body;
  try {
    body = parseBody(req);
  } catch {
    json(res, 400, { error: 'JSON inválido' });
    return;
  }

  const updates = body.profile && typeof body.profile === 'object' ? body.profile : body;
  const currentPassword = String(body.currentPassword || '');

  try {
    const profile = await saveProfessionalProfile(auth.user.email, updates, {
      user: auth.user,
      currentPassword,
      sessionName: auth.user.name
    });
    json(res, 200, { ok: true, profile: publicProfile(profile) });
  } catch (err) {
    if (err.code === 'password_required') {
      json(res, 401, {
        error: 'Informe sua senha atual para alterar nome ou CRM.',
        code: 'password_required'
      });
      return;
    }
    if (err.code === 'account_deleted') {
      json(res, 403, {
        error: err.message || 'Conta excluída.',
        code: 'account_deleted'
      });
      return;
    }
    json(res, 500, { error: err.message || 'Erro ao salvar perfil' });
  }
}
