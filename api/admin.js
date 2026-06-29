const { json, parseBody } = require('./_auth');
const { authenticateAdminRequest, adminEnabled, adminPinConfigured } = require('./_admin');
const { getAdminLog, getSiteMarketing, saveSiteMarketing } = require('./_admin-meta');
const { getSiteConfig, saveSiteConfig } = require('./_site-config');
const {
  listAdminUsers,
  computeAdminStats,
  computeRetentionReport,
  getAdminUserDetail,
  grantAdminAccess,
  revokeAdminAccess,
  createAdminCoupon,
  createAdminPortalUrl,
  saveUserAdminNotes
} = require('./_admin-grants');

function adminMisconfigured (res) {
  json(res, 503, {
    error: 'Painel admin não configurado. Defina MEDHUB_OWNER_EMAIL na Vercel.',
    code: 'admin_not_configured'
  });
}

async function handleConfig (req, res) {
  json(res, 200, {
    adminEnabled: adminEnabled(),
    pinRequired: adminPinConfigured()
  });
}

async function handleMe (req, res) {
  const auth = await authenticateAdminRequest(req, res);
  if (!auth) return;

  json(res, 200, {
    ok: true,
    email: auth.user.email,
    name: auth.user.name || '',
    pinRequired: adminPinConfigured()
  });
}

async function handleStats (req, res) {
  const auth = await authenticateAdminRequest(req, res);
  if (!auth) return;

  try {
    const users = await listAdminUsers();
    json(res, 200, { stats: computeAdminStats(users) });
  } catch (err) {
    json(res, 500, { error: err.message || 'Erro ao calcular estatísticas.' });
  }
}

async function handleUsers (req, res) {
  const auth = await authenticateAdminRequest(req, res);
  if (!auth) return;

  try {
    const users = await listAdminUsers();
    json(res, 200, { users, count: users.length, stats: computeAdminStats(users) });
  } catch (err) {
    json(res, 500, { error: err.message || 'Erro ao listar usuários.' });
  }
}

async function handleUser (req, res) {
  const auth = await authenticateAdminRequest(req, res);
  if (!auth) return;

  const email = String(req.query?.email || '').trim();
  if (!email) {
    json(res, 400, { error: 'Informe o e-mail.', code: 'invalid_email' });
    return;
  }

  try {
    const user = await getAdminUserDetail(email);
    json(res, 200, { user });
  } catch (err) {
    if (err.code === 'invalid_email') {
      json(res, 400, { error: err.message, code: err.code });
      return;
    }
    json(res, 500, { error: err.message || 'Erro ao carregar usuário.' });
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
  const accessType = String(body.accessType || '').trim().toLowerCase();
  const months = Number(body.months) || 0;

  if (!email) {
    json(res, 400, { error: 'Informe o e-mail.', code: 'invalid_email' });
    return;
  }

  if (password && password.length < 8) {
    json(res, 400, { error: 'A senha deve ter no mínimo 8 caracteres.', code: 'weak_password' });
    return;
  }

  try {
    const result = await grantAdminAccess({
      email,
      password,
      name,
      lifetime,
      months,
      accessType,
      actorEmail: auth.user.email
    });
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
    const result = await revokeAdminAccess({
      email,
      deleteUser,
      actorEmail: auth.user.email
    });
    json(res, 200, { ok: true, ...result });
  } catch (err) {
    if (err.code === 'invalid_email') {
      json(res, 400, { error: err.message, code: err.code });
      return;
    }
    json(res, 500, { error: err.message || 'Erro ao revogar acesso.' });
  }
}

async function handleCoupon (req, res) {
  const auth = await authenticateAdminRequest(req, res);
  if (!auth) return;

  let body;
  try {
    body = parseBody(req);
  } catch {
    json(res, 400, { error: 'JSON inválido' });
    return;
  }

  try {
    const result = await createAdminCoupon({
      code: body.code,
      months: body.months,
      actorEmail: auth.user.email
    });
    json(res, 200, { ok: true, ...result });
  } catch (err) {
    if (err.code === 'stripe_missing') {
      json(res, 503, { error: err.message, code: err.code });
      return;
    }
    if (err.code === 'coupon_exists') {
      json(res, 409, { error: err.message, code: err.code });
      return;
    }
    json(res, 500, { error: err.message || 'Erro ao criar cupom.' });
  }
}

async function handlePortal (req, res) {
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
  if (!email) {
    json(res, 400, { error: 'Informe o e-mail.', code: 'invalid_email' });
    return;
  }

  try {
    const result = await createAdminPortalUrl({ email, req });
    json(res, 200, { ok: true, ...result });
  } catch (err) {
    if (err.code === 'invalid_email' || err.code === 'no_stripe_customer') {
      json(res, 400, { error: err.message, code: err.code });
      return;
    }
    if (err.code === 'stripe_missing') {
      json(res, 503, { error: err.message, code: err.code });
      return;
    }
    json(res, 500, { error: err.message || 'Erro ao abrir portal Stripe.' });
  }
}

async function handleNotes (req, res) {
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
  if (!email) {
    json(res, 400, { error: 'Informe o e-mail.', code: 'invalid_email' });
    return;
  }

  try {
    const result = await saveUserAdminNotes({
      email,
      note: body.note,
      actorEmail: auth.user.email
    });
    json(res, 200, { ok: true, ...result });
  } catch (err) {
    if (err.code === 'invalid_email') {
      json(res, 400, { error: err.message, code: err.code });
      return;
    }
    json(res, 500, { error: err.message || 'Erro ao salvar notas.' });
  }
}

async function handleLog (req, res) {
  const auth = await authenticateAdminRequest(req, res);
  if (!auth) return;

  try {
    const limit = req.query?.limit;
    const logs = await getAdminLog(limit);
    json(res, 200, { logs, count: logs.length });
  } catch (err) {
    json(res, 500, { error: err.message || 'Erro ao carregar log.' });
  }
}

async function handleMarketing (req, res) {
  const auth = await authenticateAdminRequest(req, res);
  if (!auth) return;

  if (req.method === 'GET') {
    try {
      const marketing = await getSiteMarketing();
      json(res, 200, { marketing });
    } catch (err) {
      json(res, 500, { error: err.message || 'Erro ao carregar marketing.' });
    }
    return;
  }

  if (req.method === 'POST') {
    let body;
    try {
      body = parseBody(req);
    } catch {
      json(res, 400, { error: 'JSON inválido' });
      return;
    }

    try {
      const marketing = await saveSiteMarketing(body, auth.user.email);
      json(res, 200, { ok: true, marketing });
    } catch (err) {
      json(res, 500, { error: err.message || 'Erro ao salvar marketing.' });
    }
    return;
  }

  json(res, 405, { error: 'Method not allowed' });
}

async function handleReports (req, res) {
  const auth = await authenticateAdminRequest(req, res);
  if (!auth) return;

  try {
    const users = await listAdminUsers();
    json(res, 200, {
      report: computeRetentionReport(users),
      stats: computeAdminStats(users)
    });
  } catch (err) {
    json(res, 500, { error: err.message || 'Erro ao gerar relatório.' });
  }
}

async function handleSiteConfig (req, res) {
  const auth = await authenticateAdminRequest(req, res);
  if (!auth) return;

  if (req.method === 'GET') {
    try {
      const site = await getSiteConfig();
      json(res, 200, { site });
    } catch (err) {
      json(res, 500, { error: err.message || 'Erro ao carregar aparência.' });
    }
    return;
  }

  if (req.method === 'POST') {
    let body;
    try {
      body = parseBody(req);
    } catch {
      json(res, 400, { error: 'JSON inválido' });
      return;
    }

    try {
      const site = await saveSiteConfig(body, auth.user.email);
      json(res, 200, { ok: true, site });
    } catch (err) {
      json(res, 500, { error: err.message || 'Erro ao salvar aparência.' });
    }
    return;
  }

  json(res, 405, { error: 'Method not allowed' });
}

module.exports = async (req, res) => {
  if (!adminEnabled()) {
    adminMisconfigured(res);
    return;
  }

  const action = String(req.query?.action || '').trim().toLowerCase();

  if (action === 'config' && req.method === 'GET') {
    await handleConfig(req, res);
    return;
  }

  if (action === 'me' && req.method === 'GET') {
    await handleMe(req, res);
    return;
  }

  if (action === 'stats' && req.method === 'GET') {
    await handleStats(req, res);
    return;
  }

  if (action === 'users' && req.method === 'GET') {
    await handleUsers(req, res);
    return;
  }

  if (action === 'user' && req.method === 'GET') {
    await handleUser(req, res);
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

  if (action === 'coupon' && req.method === 'POST') {
    await handleCoupon(req, res);
    return;
  }

  if (action === 'portal' && req.method === 'POST') {
    await handlePortal(req, res);
    return;
  }

  if (action === 'notes' && req.method === 'POST') {
    await handleNotes(req, res);
    return;
  }

  if (action === 'log' && req.method === 'GET') {
    await handleLog(req, res);
    return;
  }

  if (action === 'marketing' && (req.method === 'GET' || req.method === 'POST')) {
    await handleMarketing(req, res);
    return;
  }

  if (action === 'reports' && req.method === 'GET') {
    await handleReports(req, res);
    return;
  }

  if (action === 'site-config' && (req.method === 'GET' || req.method === 'POST')) {
    await handleSiteConfig(req, res);
    return;
  }

  json(res, 404, { error: 'Ação admin inválida.', code: 'not_found' });
};
