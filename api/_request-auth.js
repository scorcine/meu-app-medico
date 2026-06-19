const {
  cloudAuthEnabled,
  verifyToken,
  readBearer,
  sessionVersionValid,
  json
} = require('./_auth');
const { getUser } = require('./_users');

async function authenticateRequest (req, res) {
  if (!cloudAuthEnabled()) {
    json(res, 503, { error: 'Login na nuvem não configurado.' });
    return null;
  }

  const payload = verifyToken(readBearer(req));
  if (!payload?.email) {
    json(res, 401, { error: 'Sessão inválida ou expirada.', code: 'invalid_token' });
    return null;
  }

  const user = await getUser(payload.email);
  if (!user) {
    json(res, 401, { error: 'Conta não encontrada.', code: 'invalid_token' });
    return null;
  }

  if (!sessionVersionValid(payload, user)) {
    json(res, 401, {
      error: 'Sessão encerrada — sua conta foi acessada em outro dispositivo.',
      code: 'session_revoked'
    });
    return null;
  }

  return { user, payload };
}

module.exports = { authenticateRequest };
