/* Painel administrativo MedHub — completo */

const ADMIN_SESSION_UNTIL = 'medhubAdminSessionUntil';
const ADMIN_PIN_STORAGE = 'medhubAdminPin';
const ADMIN_SESSION_MS = 60 * 60 * 1000;

let adminAllUsers = [];
let adminPinRequired = false;
let adminServerEnabled = true;

function adminShow (id) {
  ['admin-login-panel', 'admin-forbidden-panel', 'admin-panel'].forEach(panelId => {
    const el = document.getElementById(panelId);
    if (el) el.hidden = panelId !== id;
  });
}

function adminSetStatus (el, message, type) {
  if (!el) return;
  if (!message) {
    el.hidden = true;
    el.textContent = '';
    el.className = 'admin-status';
    return;
  }
  el.hidden = false;
  el.textContent = message;
  el.className = 'admin-status' + (type ? ' admin-status--' + type : '') + (type === 'error' ? ' admin-login-error-visible' : '');
}

function adminFormatDate (iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return '—';
  }
}

function adminAccessLabel (user) {
  const logins = Number(user.loginCount) || 0;
  const sessions = Number(user.sessionCount) || 0;
  if (logins > 0 && sessions > 0 && logins !== sessions) {
    return logins + ' login(s) · ' + sessions + ' app';
  }
  if (logins > 0) return String(logins) + ' login(s)';
  if (sessions > 0) return String(sessions) + ' app';
  return '0';
}

function adminGetPin () {
  return sessionStorage.getItem(ADMIN_PIN_STORAGE) || '';
}

function adminSetPin (pin) {
  if (pin) sessionStorage.setItem(ADMIN_PIN_STORAGE, pin);
  else sessionStorage.removeItem(ADMIN_PIN_STORAGE);
}

function adminTouchSession () {
  sessionStorage.setItem(ADMIN_SESSION_UNTIL, String(Date.now() + ADMIN_SESSION_MS));
}

function adminSessionValid () {
  const until = Number(sessionStorage.getItem(ADMIN_SESSION_UNTIL) || 0);
  return until > Date.now();
}

function adminClearAdminSession () {
  sessionStorage.removeItem(ADMIN_SESSION_UNTIL);
  sessionStorage.removeItem(ADMIN_PIN_STORAGE);
}

function adminLogout () {
  adminClearAdminSession();
  if (typeof medhubClearCloudSession === 'function') medhubClearCloudSession();
  localStorage.removeItem('session');
  if (typeof medhubClearSessionCrypto === 'function') medhubClearSessionCrypto();
  adminShow('admin-login-panel');
}

async function adminFetch (path, options, fetchOptions) {
  return adminApiRequest(path, options, fetchOptions);
}

async function adminApiRequest (path, options, fetchOptions) {
  const skipSessionCheck = !!(fetchOptions && fetchOptions.skipSessionCheck);

  if (!skipSessionCheck && !adminSessionValid()) {
    adminClearAdminSession();
    adminShow('admin-login-panel');
    adminSetStatus(document.getElementById('admin-login-error'), 'Sessão admin expirada (1 h). Entre novamente.', 'error');
    return { res: { ok: false, status: 401 }, data: { error: 'Sessão admin expirada (1 h).' } };
  }

  if (!skipSessionCheck) adminTouchSession();

  const pin = adminGetPin();
  const headers = {
    ...(options?.headers || {}),
    ...medhubAuthHeaders()
  };
  if (pin) headers['X-Medhub-Admin-Pin'] = pin;

  let res;
  try {
    res = await fetch(path, { ...options, headers });
  } catch {
    return { res: { ok: false, status: 0 }, data: { error: 'Falha de rede ao contactar o servidor.' } };
  }

  const data = await res.json().catch(() => ({}));
  return { res, data };
}

async function adminLoadConfig () {
  try {
    const res = await fetch('/api/admin?action=config');
    const data = await res.json().catch(() => ({}));
    adminServerEnabled = !!data.adminEnabled;
    adminPinRequired = !!data.pinRequired;
    adminUpdatePinRow(adminPinRequired);
    if (!adminServerEnabled) {
      adminSetStatus(
        document.getElementById('admin-login-error'),
        'Painel admin não configurado. Defina MEDHUB_OWNER_EMAIL na Vercel.',
        'error'
      );
    }
  } catch {
    adminServerEnabled = true;
  }
}

function escapeHtml (str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr (str) {
  return escapeHtml(str).replace(/'/g, '&#39;');
}

function adminGrantPayload () {
  const grantType = document.getElementById('grant-type')?.value || 'lifetime';
  const payload = {
    email: document.getElementById('grant-email')?.value?.trim(),
    name: document.getElementById('grant-name')?.value?.trim(),
    password: document.getElementById('grant-password')?.value || ''
  };
  if (grantType === 'lifetime') payload.lifetime = true;
  else if (grantType === 'year') payload.accessType = 'year';
  else {
    payload.accessType = 'courtesy';
    payload.months = Number(grantType) || 1;
  }
  return payload;
}

function adminOrientationText (email) {
  return [
    'Olá!',
    '',
    'Seu acesso ao MedHub foi liberado.',
    '',
    '1. Acesse: https://www.medhub.ia.br/login.html',
    '2. Entre com o e-mail: ' + email,
    '3. Se ainda não definiu senha, cadastre-se com este e-mail.',
    '4. Para instalar no celular: abra no Chrome/Safari → menu → "Adicionar à tela inicial".',
    '',
    'Qualquer dúvida, estamos à disposição.',
    'MedHub'
  ].join('\n');
}

async function adminCopyText (text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function adminRenderStats (stats) {
  const grid = document.getElementById('admin-stats-grid');
  if (!grid || !stats) return;

  const items = [
    { label: 'Total', value: stats.total },
    { label: 'Ativos', value: stats.active, ok: true },
    { label: 'Inativos', value: stats.inactive },
    { label: 'Vitalícios', value: stats.lifetime },
    { label: 'Cortesias', value: stats.courtesy },
    { label: 'Expirando', value: stats.expiringSoon, warn: stats.expiringSoon > 0 },
    { label: 'Nunca voltou', value: stats.neverReturned },
    { label: 'Com cupom', value: stats.withCoupon },
    { label: 'MRR est.', value: stats.mrrDisplay }
  ];

  grid.innerHTML = items.map(item =>
    '<div class="admin-stat-card' + (item.ok ? ' admin-stat-card--ok' : '') +
    (item.warn ? ' admin-stat-card--warn' : '') + '">' +
    '<span class="admin-stat-value">' + escapeHtml(String(item.value)) + '</span>' +
    '<span class="admin-stat-label">' + escapeHtml(item.label) + '</span>' +
    '</div>'
  ).join('');

  grid.hidden = false;
}

function adminFilterUsers (users) {
  const q = (document.getElementById('admin-search')?.value || '').trim().toLowerCase();
  const status = document.getElementById('admin-filter-status')?.value || 'all';
  const plan = document.getElementById('admin-filter-plan')?.value || 'all';

  return users.filter(user => {
    if (q) {
      const hay = ((user.email || '') + ' ' + (user.name || '')).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (status === 'active' && !user.active) return false;
    if (status === 'inactive' && user.active) return false;
    if (plan === 'lifetime' && user.plan !== 'lifetime') return false;
    if (plan === 'courtesy' && !user.isCourtesy) return false;
    if (plan === 'paying' && !(user.active && user.source === 'stripe')) return false;
    if (plan === 'expiring' && !user.expiringSoon) return false;
    if (plan === 'never' && !user.neverReturned) return false;
    return true;
  });
}

function adminRenderUserCard (user) {
  const card = document.createElement('article');
  card.className = 'admin-user-card';
  card.dataset.email = user.email;

  const pills = [];
  pills.push(user.active
    ? '<span class="admin-pill admin-pill--ok">Ativo</span>'
    : '<span class="admin-pill admin-pill--off">Inativo</span>');
  if (user.expiringSoon) pills.push('<span class="admin-pill admin-pill--warn">Expira em ' + user.daysUntilEnd + 'd</span>');
  if (user.neverReturned) pills.push('<span class="admin-pill admin-pill--muted">Nunca voltou</span>');
  if (user.hasUsedApp) pills.push('<span class="admin-pill admin-pill--ok">Usou app</span>');
  else if (user.hasAccount) pills.push('<span class="admin-pill admin-pill--muted">Só cadastro</span>');

  const endLabel = user.currentPeriodEnd
    ? adminFormatDate(user.currentPeriodEnd) + (user.daysUntilEnd != null ? ' (' + user.daysUntilEnd + 'd)' : '')
    : '—';

  card.innerHTML =
    '<div class="admin-user-card-head">' +
      '<div class="admin-user-email">' + escapeHtml(user.email) + '</div>' +
      '<div class="admin-user-pills">' + pills.join('') + '</div>' +
    '</div>' +
    '<dl class="admin-user-grid">' +
      '<div><dt>Nome</dt><dd>' + escapeHtml(user.name || '—') + '</dd></div>' +
      '<div><dt>Plano</dt><dd>' + escapeHtml(user.planLabel || user.plan || '—') + '</dd></div>' +
      '<div><dt>Fim / renovação</dt><dd>' + escapeHtml(endLabel) + '</dd></div>' +
      '<div><dt>Acessos</dt><dd>' + escapeHtml(adminAccessLabel(user)) + '</dd></div>' +
      '<div><dt>Último acesso</dt><dd>' + escapeHtml(adminFormatDate(user.lastActiveAt || user.lastLoginAt)) + '</dd></div>' +
      '<div><dt>Origem</dt><dd>' + escapeHtml(user.source || '—') + '</dd></div>' +
      (user.couponCode ? '<div><dt>Cupom</dt><dd>' + escapeHtml(user.couponCode) + '</dd></div>' : '') +
    '</dl>' +
    '<div class="admin-user-actions">' +
      '<button type="button" class="btn-outline btn-sm admin-detail-btn" data-email="' + escapeAttr(user.email) + '">Detalhes</button>' +
      '<button type="button" class="btn-outline btn-sm admin-copy-btn" data-email="' + escapeAttr(user.email) + '">Copiar orientação</button>' +
      '<button type="button" class="btn-outline btn-sm admin-revoke-btn" data-email="' + escapeAttr(user.email) + '">Revogar</button>' +
    '</div>';

  card.querySelector('.admin-detail-btn')?.addEventListener('click', e => {
    e.stopPropagation();
    adminOpenUserModal(user.email);
  });
  card.querySelector('.admin-copy-btn')?.addEventListener('click', async e => {
    e.stopPropagation();
    const ok = await adminCopyText(adminOrientationText(user.email));
    alert(ok ? 'Texto copiado para a área de transferência.' : 'Não foi possível copiar.');
  });
  card.querySelector('.admin-revoke-btn')?.addEventListener('click', e => {
    e.stopPropagation();
    adminRevokeUser(user.email);
  });
  card.addEventListener('click', () => adminOpenUserModal(user.email));

  return card;
}

function adminRenderUsersList () {
  const listEl = document.getElementById('admin-users-list');
  const countEl = document.getElementById('admin-user-count');
  const loadStatus = document.getElementById('admin-load-status');
  if (!listEl) return;

  const filtered = adminFilterUsers(adminAllUsers);
  listEl.innerHTML = '';

  if (countEl) {
    countEl.textContent = filtered.length + ' de ' + adminAllUsers.length + ' registro(s)';
  }

  filtered.forEach(user => listEl.appendChild(adminRenderUserCard(user)));

  listEl.hidden = filtered.length === 0;
  if (filtered.length === 0) {
    adminSetStatus(loadStatus, adminAllUsers.length ? 'Nenhum usuário corresponde aos filtros.' : 'Nenhum usuário no KV.', 'muted');
  } else {
    adminSetStatus(loadStatus, '', '');
    loadStatus.hidden = true;
  }
}

async function adminLoadUsers () {
  const loadStatus = document.getElementById('admin-load-status');
  const listEl = document.getElementById('admin-users-list');

  adminSetStatus(loadStatus, 'Carregando…', 'muted');
  if (listEl) {
    listEl.hidden = true;
    listEl.innerHTML = '';
  }

  const { res, data } = await adminFetch('/api/admin?action=users');
  if (!res.ok) {
    adminSetStatus(loadStatus, data.error || 'Erro ao carregar usuários.', 'error');
    if (data.code === 'invalid_pin') adminShowPinError();
    return;
  }

  adminAllUsers = data.users || [];
  if (data.stats) adminRenderStats(data.stats);
  adminRenderUsersList();
}

function adminShowPinError () {
  adminClearAdminSession();
  adminShow('admin-login-panel');
  adminSetStatus(document.getElementById('admin-login-error'), 'PIN administrativo inválido ou ausente.', 'error');
  const pinRow = document.getElementById('admin-pin-row');
  if (pinRow) pinRow.hidden = false;
}

async function adminLoadLog () {
  const statusEl = document.getElementById('admin-log-status');
  const listEl = document.getElementById('admin-log-list');
  if (!listEl) return;

  adminSetStatus(statusEl, 'Carregando…', 'muted');
  listEl.hidden = true;

  const { res, data } = await adminFetch('/api/admin?action=log&limit=50');
  if (!res.ok) {
    adminSetStatus(statusEl, data.error || 'Erro ao carregar log.', 'error');
    return;
  }

  const logs = data.logs || [];
  if (!logs.length) {
    adminSetStatus(statusEl, 'Nenhuma ação registrada ainda.', 'muted');
    return;
  }

  listEl.innerHTML = logs.map(entry =>
    '<div class="admin-log-entry">' +
      '<time>' + escapeHtml(adminFormatDate(entry.at)) + '</time>' +
      '<span class="admin-log-action">' + escapeHtml(entry.action) + '</span>' +
      '<span class="admin-log-target">' + escapeHtml(entry.target || entry.actor || '—') + '</span>' +
      '<span class="admin-log-actor">' + escapeHtml(entry.actor) + '</span>' +
    '</div>'
  ).join('');

  adminSetStatus(statusEl, '', '');
  statusEl.hidden = true;
  listEl.hidden = false;
}

function adminExportCsv () {
  if (!adminAllUsers.length) {
    alert('Nenhum usuário para exportar.');
    return;
  }

  const rows = adminFilterUsers(adminAllUsers);
  const headers = [
    'email', 'name', 'active', 'plan', 'planLabel', 'source', 'loginCount',
    'sessionCount', 'lastActiveAt', 'currentPeriodEnd', 'daysUntilEnd',
    'couponCode', 'customerId', 'hasUsedApp', 'neverReturned'
  ];

  function csvCell (v) {
    const s = v == null ? '' : String(v);
    if (/[",\n\r]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  }

  const lines = [
    headers.join(','),
    ...rows.map(u => headers.map(h => csvCell(u[h])).join(','))
  ];

  const blob = new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'medhub-usuarios-' + new Date().toISOString().slice(0, 10) + '.csv';
  a.click();
  URL.revokeObjectURL(a.href);
}

function adminCloseModal () {
  const modal = document.getElementById('admin-modal');
  if (modal) modal.hidden = true;
}

async function adminOpenUserModal (email) {
  const modal = document.getElementById('admin-modal');
  const body = document.getElementById('admin-modal-body');
  const title = document.getElementById('admin-modal-title');
  if (!modal || !body) return;

  modal.hidden = false;
  if (title) title.textContent = email;
  body.innerHTML = '<p class="admin-status muted">Carregando…</p>';

  const { res, data } = await adminFetch('/api/admin?action=user&email=' + encodeURIComponent(email));
  if (!res.ok) {
    body.innerHTML = '<p class="admin-status admin-status--error">' + escapeHtml(data.error || 'Erro.') + '</p>';
    return;
  }

  const u = data.user;
  const profile = u.profile || {};
  const stripe = u.stripe;

  body.innerHTML =
    '<dl class="admin-detail-grid">' +
      '<div><dt>Plano</dt><dd>' + escapeHtml(u.planLabel || u.plan) + '</dd></div>' +
      '<div><dt>Status KV</dt><dd>' + escapeHtml(u.status || '—') + '</dd></div>' +
      '<div><dt>Stripe status</dt><dd>' + escapeHtml(stripe?.status || u.stripeStatus || '—') + '</dd></div>' +
      '<div><dt>Customer ID</dt><dd>' + escapeHtml(u.customerId || '—') + '</dd></div>' +
      '<div><dt>Cupom</dt><dd>' + escapeHtml(u.couponCode || stripe?.coupon || '—') + '</dd></div>' +
      '<div><dt>Fim período</dt><dd>' + escapeHtml(adminFormatDate(u.currentPeriodEnd)) + '</dd></div>' +
      '<div><dt>Onboarding</dt><dd>' + (u.onboardingComplete ? 'Completo' : 'Pendente') + '</dd></div>' +
      '<div><dt>CRM / perfil</dt><dd>' + escapeHtml(profile.crm || profile.professionalId || '—') + '</dd></div>' +
      '<div><dt>Usou app</dt><dd>' + (u.hasUsedApp ? 'Sim' : 'Não') + '</dd></div>' +
      '<div><dt>Logins / app</dt><dd>' + escapeHtml(adminAccessLabel(u)) + '</dd></div>' +
      '<div><dt>Criado em</dt><dd>' + escapeHtml(adminFormatDate(u.createdAt)) + '</dd></div>' +
      '<div><dt>Seções usadas</dt><dd>' + escapeHtml((u.activitySections || []).join(', ') || '—') + '</dd></div>' +
    '</dl>' +
    '<div class="admin-modal-notes">' +
      '<label for="admin-user-notes">Notas internas</label>' +
      '<textarea id="admin-user-notes" rows="3" maxlength="4000" placeholder="Ex.: vitalício convidado jun/26">' +
        escapeHtml(u.notes || '') +
      '</textarea>' +
      '<button type="button" class="btn-outline btn-sm" id="admin-save-notes-btn">Salvar notas</button>' +
      (u.notesUpdatedAt ? '<p class="auth-hint muted">Atualizado ' + escapeHtml(adminFormatDate(u.notesUpdatedAt)) + '</p>' : '') +
    '</div>' +
    '<div class="admin-modal-actions">' +
      '<button type="button" class="btn-outline btn-sm" id="admin-modal-copy">Copiar orientação</button>' +
      '<button type="button" class="btn-outline btn-sm" id="admin-modal-portal">Portal Stripe</button>' +
      '<button type="button" class="btn-outline btn-sm admin-revoke-btn" data-email="' + escapeAttr(email) + '">Revogar</button>' +
    '</div>';

  document.getElementById('admin-save-notes-btn')?.addEventListener('click', () => adminSaveNotes(email));
  document.getElementById('admin-modal-copy')?.addEventListener('click', async () => {
    const ok = await adminCopyText(adminOrientationText(email));
    alert(ok ? 'Texto copiado.' : 'Não foi possível copiar.');
  });
  document.getElementById('admin-modal-portal')?.addEventListener('click', () => adminOpenPortal(email));
  body.querySelector('.admin-revoke-btn')?.addEventListener('click', () => {
    adminCloseModal();
    adminRevokeUser(email);
  });
}

async function adminSaveNotes (email) {
  const note = document.getElementById('admin-user-notes')?.value || '';
  const { res, data } = await adminFetch('/api/admin?action=notes', {
    method: 'POST',
    body: JSON.stringify({ email, note })
  });
  if (!res.ok) {
    alert(data.error || 'Erro ao salvar notas.');
    return;
  }
  alert('Notas salvas.');
  await adminLoadLog();
}

async function adminOpenPortal (email) {
  const { res, data } = await adminFetch('/api/admin?action=portal', {
    method: 'POST',
    body: JSON.stringify({ email })
  });
  if (!res.ok) {
    alert(data.error || 'Erro ao abrir portal Stripe.');
    return;
  }
  window.open(data.url, '_blank', 'noopener,noreferrer');
}

async function adminRevokeUser (email) {
  if (!email) return;
  if (!confirm('Revogar acesso de ' + email + '?\n\nOK = bloqueia assinatura (conta permanece)\nCancelar = não fazer nada')) return;

  const alsoDelete = confirm(
    'Apagar também a conta do servidor (login, perfil e backup clínico)?\n\nOK = apagar conta\nCancelar = só bloquear assinatura'
  );

  const { res, data } = await adminFetch('/api/admin?action=revoke', {
    method: 'POST',
    body: JSON.stringify({ email, deleteUser: alsoDelete })
  });

  if (!res.ok) {
    alert(data.error || 'Erro ao revogar.');
    return;
  }

  alert(alsoDelete ? 'Acesso revogado e conta removida.' : 'Assinatura revogada.');
  await adminLoadUsers();
  await adminLoadLog();
}

async function adminGrantAccess (e) {
  e.preventDefault();
  const statusEl = document.getElementById('admin-grant-status');
  const btn = document.getElementById('admin-grant-btn');
  const payload = adminGrantPayload();
  if (!payload.email) return;

  if (btn) btn.disabled = true;
  adminSetStatus(statusEl, 'Salvando…', 'muted');

  const { res, data } = await adminFetch('/api/admin?action=grant', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  if (btn) btn.disabled = false;

  if (!res.ok) {
    adminSetStatus(statusEl, data.error || 'Erro ao liberar acesso.', 'error');
    return;
  }

  let msg = 'Acesso liberado para ' + data.email + ' (' + (data.planLabel || data.plan) + ').';
  if (data.currentPeriodEnd) msg += ' Até ' + adminFormatDate(data.currentPeriodEnd) + '.';
  if (data.accountCreated) msg += ' Conta criada.';
  else if (!data.hasAccount) msg += ' Usuário pode cadastrar com este e-mail.';
  if (data.passwordReset) msg += ' Senha atualizada.';

  adminSetStatus(statusEl, msg, 'ok');
  document.getElementById('admin-grant-form')?.reset();
  if (document.getElementById('grant-type')) document.getElementById('grant-type').value = 'lifetime';
  await adminLoadUsers();
  await adminLoadLog();
}

async function adminCreateCoupon (e) {
  e.preventDefault();
  const statusEl = document.getElementById('admin-coupon-status');
  const btn = document.getElementById('admin-coupon-btn');
  const months = document.getElementById('coupon-months')?.value;
  const code = document.getElementById('coupon-code')?.value?.trim();

  if (btn) btn.disabled = true;
  adminSetStatus(statusEl, 'Criando no Stripe…', 'muted');

  const { res, data } = await adminFetch('/api/admin?action=coupon', {
    method: 'POST',
    body: JSON.stringify({ months, code: code || undefined })
  });

  if (btn) btn.disabled = false;

  if (!res.ok) {
    adminSetStatus(statusEl, data.error || 'Erro ao criar cupom.', 'error');
    return;
  }

  const msg = 'Cupom ' + data.code + ' (' + data.months + ' mês(es)). Cadastro: ' + data.registerUrl;
  adminSetStatus(statusEl, msg, 'ok');
  document.getElementById('coupon-code')?.value && (document.getElementById('coupon-code').value = '');
  await adminLoadLog();
}

async function adminCheckAccess (fetchOptions) {
  const { res, data } = await adminApiRequest('/api/admin?action=me', null, fetchOptions);
  if (res.status === 403 && data.code === 'not_admin') return { ok: false, forbidden: true, email: data.email || '' };
  if (res.status === 403 && data.code === 'invalid_pin') return { ok: false, invalidPin: true };
  if (res.status === 503 && data.code === 'admin_not_configured') {
    return { ok: false, misconfigured: true, error: data.error };
  }
  if (!res.ok) return { ok: false, error: data.error || 'Sessão inválida.' };
  adminPinRequired = !!data.pinRequired;
  return { ok: true, email: data.email, name: data.name, pinRequired: adminPinRequired };
}

function adminShowForbidden (email) {
  const el = document.getElementById('admin-forbidden-email');
  if (el) el.textContent = email || '(e-mail desconhecido)';
  adminShow('admin-forbidden-panel');
}

function adminUpdatePinRow (pinRequired) {
  const pinRow = document.getElementById('admin-pin-row');
  if (!pinRow) return;
  pinRow.hidden = !pinRequired;
  const pinInput = document.getElementById('admin-pin');
  if (pinInput) pinInput.required = !!pinRequired;
}

async function adminHandleLogin (e) {
  e.preventDefault();
  const errEl = document.getElementById('admin-login-error');
  const btn = document.getElementById('admin-login-btn');
  const email = document.getElementById('admin-email')?.value?.trim();
  const password = document.getElementById('admin-password')?.value;
  const pin = document.getElementById('admin-pin')?.value || '';

  if (!email || !password) return;

  if (adminPinRequired && !pin) {
    adminSetStatus(errEl, 'Informe o PIN administrativo.', 'error');
    adminUpdatePinRow(true);
    return;
  }

  adminSetStatus(errEl, '', '');
  if (btn) btn.disabled = true;

  adminSetPin(pin);

  let result;
  try {
    result = await medhubCloudLogin(email, password);
  } catch {
    if (btn) btn.disabled = false;
    adminSetStatus(errEl, 'Erro de rede ao fazer login.', 'error');
    return;
  }

  if (!result.ok) {
    if (btn) btn.disabled = false;
    adminSetStatus(errEl, result.error || 'Credenciais inválidas.', 'error');
    return;
  }

  try {
    await medhubApplyCloudSession(result.data, password);
  } catch {
    if (btn) btn.disabled = false;
    adminSetStatus(errEl, 'Login ok, mas falha ao salvar sessão local.', 'error');
    return;
  }

  if (typeof medhubSetSession === 'function') medhubSetSession(result.data.user);

  adminTouchSession();

  const access = await adminCheckAccess({ skipSessionCheck: true });
  if (btn) btn.disabled = false;

  if (access.misconfigured) {
    adminSetStatus(errEl, access.error, 'error');
    adminLogout();
    return;
  }
  if (access.forbidden) {
    adminShowForbidden(email);
    return;
  }
  if (access.invalidPin) {
    adminSetStatus(errEl, 'PIN administrativo inválido.', 'error');
    adminClearAdminSession();
    adminUpdatePinRow(true);
    return;
  }
  if (!access.ok) {
    adminSetStatus(errEl, access.error || 'Não foi possível validar admin.', 'error');
    return;
  }

  await adminEnterPanel(access);
}

async function adminEnterPanel (access) {
  const signedAs = document.getElementById('admin-signed-as');
  if (signedAs) {
    signedAs.textContent = 'Conectado como ' + (access.email || '') + ' · sessão expira em 1 h';
  }
  adminUpdatePinRow(access.pinRequired);
  adminShow('admin-panel');
  await adminLoadUsers();
  await adminLoadLog();
}

async function initAdminPage () {
  await adminLoadConfig();

  document.getElementById('admin-login-form')?.addEventListener('submit', adminHandleLogin);
  document.getElementById('admin-grant-form')?.addEventListener('submit', adminGrantAccess);
  document.getElementById('admin-coupon-form')?.addEventListener('submit', adminCreateCoupon);
  document.getElementById('admin-refresh-btn')?.addEventListener('click', async () => {
    await adminLoadUsers();
    await adminLoadLog();
  });
  document.getElementById('admin-export-btn')?.addEventListener('click', adminExportCsv);

  ['admin-search', 'admin-filter-status', 'admin-filter-plan'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', adminRenderUsersList);
    document.getElementById(id)?.addEventListener('change', adminRenderUsersList);
  });

  document.querySelectorAll('[data-admin-modal-close]').forEach(el => {
    el.addEventListener('click', adminCloseModal);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') adminCloseModal();
  });

  const logCard = document.querySelector('.admin-log-card');
  logCard?.addEventListener('toggle', () => {
    if (logCard.open) adminLoadLog();
  });

  const token = typeof medhubGetAuthToken === 'function' ? medhubGetAuthToken() : '';
  if (!token) {
    adminShow('admin-login-panel');
    return;
  }
  if (!adminSessionValid()) {
    adminClearAdminSession();
    adminShow('admin-login-panel');
    adminSetStatus(document.getElementById('admin-login-error'), 'Sessão admin expirada (1 h). Entre novamente.', 'error');
    return;
  }

  const access = await adminCheckAccess();
  if (access.misconfigured) {
    adminShow('admin-login-panel');
    adminSetStatus(document.getElementById('admin-login-error'), access.error, 'error');
    return;
  }
  if (access.invalidPin) {
    adminShow('admin-login-panel');
    adminUpdatePinRow(true);
    adminSetStatus(document.getElementById('admin-login-error'), 'Informe o PIN administrativo.', 'error');
    return;
  }
  if (access.forbidden) {
    adminShowForbidden(access.email || '');
    return;
  }
  if (!access.ok) {
    adminShow('admin-login-panel');
    return;
  }

  await adminEnterPanel(access);
}
