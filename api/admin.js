const { json, parseBody } = require('./_auth');
const { authenticateAdminRequest, adminEnabled } = require('./_admin');
const { listAdminUsers, grantAdminAccess, revokeAdminAccess } = require('./_admin-grants');

function adminMisconfigured (res) {
  json(res, 503, {
    error: 'Painel admin não configurado. Defina MEDHUB_OWNER_EMAIL na Vercel.',
    code: 'admin_not_configured'
  });
}

async function handleMe (req, res) {
  const auth = await authenticateAdminRequest(req, res);
  if (!auth) return;

  json(res, 200, {
    ok: true,
    email: auth.user.email,
    name: auth.user.name || ''
  });
}

async function handleUsers (req, res) {
  const auth = await authenticateAdminRequest(req, res);
  if (!auth) return;

  try {
    const users = await listAdminUsers();
    json(res, 200, { users, count: users.length });
  } catch (err) {
    json(res, 500, { error: err.message || 'Erro ao listar usuários.' });
  }
}

async function handleGrant (req, res) {
  const auth = await authenticateAdminRequest(req, res);
  if (!auth) return;

  let body;
  try {
    body = parseBody(req);
  } catch {
    json(res, 400, { error: 'JSON inválido' });
    return;
  }

  const email = String(body.email || '').trim();
  const password = String(body.password || '');
  const name = String(body.name || '').trim();
  const lifetime = !!body.lifetime;

  if (!email) {
    json(res, 400, { error: 'Informe o e-mail.', code: 'invalid_email' });
    return;
  }

  if (password && password.length < 8) {
    json(res, 400, { error: 'A senha deve ter no mínimo 8 caracteres.', code: 'weak_password' });
    return;
  }

  try {
    const result = await grantAdminAccess({ email, password, name, lifetime });
    json(res, 200, { ok: true, ...result });
  } catch (err) {
    if (err.code === 'invalid_email') {
      json(res, 400, { error: err.message, code: err.code });
      return;
    }
    json(res, 500, { error: err.message || 'Erro ao liberar acesso.' });
  }
}

async function handleRevoke (req, res) {
  const auth = await authenticateAdminRequest(req, res);
  if (!auth) return;

  let body;
  try {
    body = parseBody(req);
  } catch {
    json(res, 400, { error: 'JSON inválido' });
    return;
  }

  const email = String(body.email || '').trim();
  const deleteUser = !!body.deleteUser;

  if (!email) {
    json(res, 400, { error: 'Informe o e-mail.', code: 'invalid_email' });
    return;
  }

  try {
    const result = await revokeAdminAccess({ email, deleteUser });
    json(res, 200, { ok: true, ...result });
  } catch (err) {
    if (err.code === 'invalid_email') {
      json(res, 400, { error: err.message, code: err.code });
      return;
    }
    json(res, 500, { error: err.message || 'Erro ao revogar acesso.' });
  }
}

module.exports = async (req, res) => {
  if (!adminEnabled()) {
    adminMisconfigured(res);
    return;
  }

  const action = String(req.query?.action || '').trim().toLowerCase();

  if (action === 'me' && req.method === 'GET') {
    await handleMe(req, res);
    return;
  }

  if (action === 'users' && req.method === 'GET') {
    await handleUsers(req, res);
    return;
  }

  if (action === 'grant' && req.method === 'POST') {
    await handleGrant(req, res);
    return;
  }

  if (action === 'revoke' && req.method === 'POST') {
    await handleRevoke(req, res);
    return;
  }

  json(res, 404, { error: 'Ação admin inválida.', code: 'not_found' });
};
