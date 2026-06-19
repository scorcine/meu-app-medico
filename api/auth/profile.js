const { json, parseBody } = require('../_auth');
const { authenticateRequest } = require('../_request-auth');
const {
  getProfessionalProfile,
  saveProfessionalProfile,
  publicProfile
} = require('../_profile');

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
    const profile = await getProfessionalProfile(auth.user.email, auth.user.name);
    json(res, 200, { profile: publicProfile(profile) });
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
    json(res, 500, { error: err.message || 'Erro ao salvar perfil' });
  }
}
