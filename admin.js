/* Painel administrativo MedHub — completo */

const ADMIN_SESSION_UNTIL = 'medhubAdminSessionUntil';
const ADMIN_PIN_STORAGE = 'medhubAdminPin';
const ADMIN_SESSION_MS = 60 * 60 * 1000;

let adminAllUsers = [];
let adminPinRequired = false;
let adminServerEnabled = true;
let adminCurrentSection = 'overview';
let adminSiteConfigDraft = null;

const ADMIN_SECTIONS = {
  overview: {
    title: 'Visão geral',
    desc: 'Resumo de usuários, planos e receita estimada.',
    showExport: true
  },
  users: {
    title: 'Usuários',
    desc: 'Contas, assinaturas, filtros e revogação.',
    showExport: true
  },
  access: {
    title: 'Liberar acesso',
    desc: 'Vitalício, cortesia com prazo ou anual.',
    showExport: false
  },
  coupons: {
    title: 'Cupons',
    desc: 'Códigos de cortesia no Stripe.',
    showExport: false
  },
  reports: {
    title: 'Relatórios',
    desc: 'Retenção, adoção do app e cortesias expirando.',
    showExport: true
  },
  marketing: {
    title: 'Marketing',
    desc: 'Instagram, links públicos e Meta Pixel.',
    showExport: false
  },
  appearance: {
    title: 'Aparência & menu',
    desc: 'Cores, menu lateral e cards da home do app.',
    showExport: false
  },
  log: {
    title: 'Auditoria',
    desc: 'Histórico de ações no painel admin.',
    showExport: false
  },
  pages: {
    title: 'Páginas do site',
    desc: 'Atalhos para editar e publicar conteúdo.',
    showExport: false
  }
};

function adminNormalizeEmail (email) {
  return String(email || '').trim().toLowerCase();
}

async function adminCloudLogin (email, password) {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: adminNormalizeEmail(email),
        password: String(password || '')
      })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, error: data.error || 'Credenciais inválidas.' };
    }
    return { ok: true, data };
  } catch {
    return { ok: false, error: 'Não foi possível contactar o servidor. Verifique sua conexão.' };
  }
}

async function adminApplyLoginSession (loginData, password) {
  if (typeof medhubSetAuthToken === 'function') {
    medhubSetAuthToken(loginData.token);
  } else {
    localStorage.setItem('medhub_auth_token', loginData.token);
  }
  if (typeof medhubSetSession === 'function') {
    medhubSetSession(loginData.user);
  }
  if (password && typeof medhubHashPassword === 'function' && typeof medhubCacheLocalUser === 'function') {
    const hashed = await medhubHashPassword(password);
    medhubCacheLocalUser(loginData.user, hashed.passHash, hashed.passSalt);
  }
}

function adminSwitchSection (sectionId, updateHash) {
  const meta = ADMIN_SECTIONS[sectionId] || ADMIN_SECTIONS.overview;
  adminCurrentSection = sectionId in ADMIN_SECTIONS ? sectionId : 'overview';

  document.querySelectorAll('.admin-section').forEach(el => {
    el.hidden = el.dataset.adminSection !== adminCurrentSection;
  });

  document.querySelectorAll('.admin-nav-btn').forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.adminSection === adminCurrentSection);
  });

  const titleEl = document.getElementById('admin-section-title');
  const descEl = document.getElementById('admin-section-desc');
  if (titleEl) titleEl.textContent = meta.title;
  if (descEl) descEl.textContent = meta.desc;

  const exportBtn = document.getElementById('admin-export-btn');
  if (exportBtn) exportBtn.hidden = !meta.showExport;

  if (adminCurrentSection === 'log') adminLoadLog();
  if (adminCurrentSection === 'marketing') adminLoadMarketing();
  if (adminCurrentSection === 'appearance') adminLoadAppearance();
  if (adminCurrentSection === 'reports') adminLoadReports();
  if (adminCurrentSection === 'users' && !adminAllUsers.length) adminLoadUsers();
  if (adminCurrentSection === 'overview' && !adminAllUsers.length) adminLoadUsers();

  if (updateHash !== false) {
    const hash = adminCurrentSection === 'overview' ? '' : adminCurrentSection;
    const next = hash ? '#/' + hash : window.location.pathname + window.location.search;
    if (window.location.hash.replace(/^#\/?/, '') !== hash) {
      history.replaceState(null, '', hash ? '#/' + hash : next);
    }
  }
}

function adminReadSectionFromHash () {
  const raw = (window.location.hash || '').replace(/^#\/?/, '').trim().toLowerCase();
  return raw && ADMIN_SECTIONS[raw] ? raw : 'overview';
}

function adminInitNavigation () {
  document.querySelectorAll('[data-admin-section]').forEach(btn => {
    if (btn.classList.contains('admin-nav-btn')) {
      btn.addEventListener('click', () => adminSwitchSection(btn.dataset.adminSection));
    }
  });

  document.querySelectorAll('[data-admin-goto]').forEach(btn => {
    btn.addEventListener('click', () => adminSwitchSection(btn.dataset.adminGoto));
  });

  window.addEventListener('hashchange', () => {
    adminSwitchSection(adminReadSectionFromHash(), false);
  });
}

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

  let result = await adminCloudLogin(email, password);

  if (!result.ok) {
    if (btn) btn.disabled = false;
    adminSetStatus(errEl, result.error || 'Credenciais inválidas.', 'error');
    return;
  }

  try {
    await adminApplyLoginSession(result.data, password);
  } catch {
    if (btn) btn.disabled = false;
    adminSetStatus(errEl, 'Login ok, mas falha ao salvar sessão local.', 'error');
    return;
  }

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

async function adminRefreshCurrentSection () {
  if (adminCurrentSection === 'log') {
    await adminLoadLog();
    return;
  }
  if (adminCurrentSection === 'marketing') {
    await adminLoadMarketing();
    return;
  }
  if (adminCurrentSection === 'marketing') {
    await adminLoadMarketing();
    return;
  }
  if (adminCurrentSection === 'appearance') {
    await adminLoadAppearance();
    return;
  }
  if (adminCurrentSection === 'reports') {
    await adminLoadReports();
    return;
  }
  await adminLoadUsers();
}

async function adminLoadMarketing () {
  const statusEl = document.getElementById('admin-marketing-status');
  const metaEl = document.getElementById('admin-marketing-meta');
  adminSetStatus(statusEl, 'Carregando…', 'muted');

  const { res, data } = await adminFetch('/api/admin?action=marketing');
  if (!res.ok) {
    adminSetStatus(statusEl, data.error || 'Erro ao carregar marketing.', 'error');
    return;
  }

  const m = data.marketing || {};
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  };
  set('mkt-instagram-url', m.instagramUrl);
  set('mkt-instagram-handle', m.instagramHandle);
  set('mkt-support-email', m.supportEmail);
  set('mkt-links-bio', m.linksBio);
  set('mkt-links-estudantes', m.linksEstudantes);
  set('mkt-landing-estudantes', m.landingEstudantes);
  set('mkt-meta-pixel', m.metaPixelId);

  adminSetStatus(statusEl, '', '');
  statusEl.hidden = true;
  if (metaEl) {
    metaEl.textContent = m.updatedAt
      ? 'Última alteração: ' + adminFormatDate(m.updatedAt) + (m.updatedBy ? ' por ' + m.updatedBy : '') + (m.source === 'kv' ? ' · publicado na nuvem' : ' · padrão do código')
      : 'Usando valores padrão do código até salvar.';
  }
}

async function adminSaveMarketing (e) {
  e.preventDefault();
  const statusEl = document.getElementById('admin-marketing-status');
  const btn = document.getElementById('admin-marketing-btn');
  const payload = {
    instagramUrl: document.getElementById('mkt-instagram-url')?.value?.trim(),
    instagramHandle: document.getElementById('mkt-instagram-handle')?.value?.trim(),
    supportEmail: document.getElementById('mkt-support-email')?.value?.trim(),
    linksBio: document.getElementById('mkt-links-bio')?.value?.trim(),
    linksEstudantes: document.getElementById('mkt-links-estudantes')?.value?.trim(),
    landingEstudantes: document.getElementById('mkt-landing-estudantes')?.value?.trim(),
    metaPixelId: document.getElementById('mkt-meta-pixel')?.value?.trim()
  };

  if (btn) btn.disabled = true;
  adminSetStatus(statusEl, 'Salvando…', 'muted');

  const { res, data } = await adminFetch('/api/admin?action=marketing', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  if (btn) btn.disabled = false;

  if (!res.ok) {
    adminSetStatus(statusEl, data.error || 'Erro ao salvar.', 'error');
    return;
  }

  adminSetStatus(statusEl, 'Marketing salvo. Links públicos atualizam em instantes.', 'ok');
  await adminLoadMarketing();
  await adminLoadLog();
}

function adminUpdateThemePreview () {
  const accent = document.getElementById('site-accent')?.value || '#0d6efd';
  const header = document.getElementById('site-bg-header')?.value || accent;
  const swatchAccent = document.getElementById('admin-theme-swatch-accent');
  const swatchHeader = document.getElementById('admin-theme-swatch-header');
  if (swatchAccent) swatchAccent.style.background = accent;
  if (swatchHeader) swatchHeader.style.background = header;
}

function adminRenderSidebarEditor (sidebar) {
  const el = document.getElementById('admin-sidebar-editor');
  if (!el) return;

  el.innerHTML = (sidebar || []).map((entry, idx) => {
    if (entry.type === 'group') {
      return '<div class="admin-config-group">' + escapeHtml(entry.label) + '</div>';
    }
    if (entry.type !== 'item') return '';
    return '<div class="admin-config-row" data-sidebar-idx="' + idx + '">' +
      '<label class="admin-check admin-config-check">' +
        '<input type="checkbox" data-field="visible" ' + (entry.visible !== false ? 'checked' : '') + '>' +
        '<span class="admin-config-id">' + escapeHtml(entry.id) + '</span>' +
      '</label>' +
      '<input type="text" data-field="label" value="' + escapeAttr(entry.label || entry.id) + '" maxlength="80">' +
    '</div>';
  }).join('');
}

function adminRenderHomeCardsEditor (cards) {
  const el = document.getElementById('admin-homecards-editor');
  if (!el) return;

  el.innerHTML = (cards || []).map((card, idx) =>
    '<div class="admin-config-row admin-config-row--card" data-card-idx="' + idx + '">' +
      '<label class="admin-check admin-config-check">' +
        '<input type="checkbox" data-field="visible" ' + (card.visible !== false ? 'checked' : '') + '>' +
        '<input type="text" class="admin-config-icon" data-field="icon" value="' + escapeAttr(card.icon || '•') + '" maxlength="8">' +
      '</label>' +
      '<div class="admin-config-card-fields">' +
        '<input type="text" data-field="name" value="' + escapeAttr(card.name || card.section) + '" maxlength="80" placeholder="Nome">' +
        '<input type="text" data-field="desc" value="' + escapeAttr(card.desc || '') + '" maxlength="200" placeholder="Descrição">' +
        '<span class="admin-config-id">' + escapeHtml(card.section) + '</span>' +
      '</div>' +
    '</div>'
  ).join('');
}

function adminCollectSiteConfigFromForm () {
  const sidebar = (adminSiteConfigDraft?.sidebar || []).map((entry, idx) => {
    if (entry.type === 'group') return { type: 'group', label: entry.label };
    const row = document.querySelector('[data-sidebar-idx="' + idx + '"]');
    if (!row) return entry;
    return {
      type: 'item',
      id: entry.id,
      label: row.querySelector('[data-field="label"]')?.value?.trim() || entry.label,
      visible: !!row.querySelector('[data-field="visible"]')?.checked
    };
  });

  const homeCards = (adminSiteConfigDraft?.homeCards || []).map((card, idx) => {
    const row = document.querySelector('[data-card-idx="' + idx + '"]');
    if (!row) return card;
    return {
      section: card.section,
      icon: row.querySelector('[data-field="icon"]')?.value?.trim() || card.icon,
      name: row.querySelector('[data-field="name"]')?.value?.trim() || card.name,
      desc: row.querySelector('[data-field="desc"]')?.value?.trim() || card.desc,
      visible: !!row.querySelector('[data-field="visible"]')?.checked,
      pediatricAux: !!card.pediatricAux
    };
  });

  return {
    theme: {
      accent: document.getElementById('site-accent')?.value,
      accentHover: document.getElementById('site-accent-hover')?.value,
      bgHeader: document.getElementById('site-bg-header')?.value,
      logoUrl: document.getElementById('site-logo-url')?.value?.trim()
    },
    sidebar,
    homeCards
  };
}

async function adminLoadAppearance () {
  const statusEl = document.getElementById('admin-appearance-status');
  adminSetStatus(statusEl, 'Carregando…', 'muted');

  const { res, data } = await adminFetch('/api/admin?action=site-config');
  if (!res.ok) {
    adminSetStatus(statusEl, data.error || 'Erro ao carregar aparência.', 'error');
    return;
  }

  const site = data.site || {};
  adminSiteConfigDraft = site;
  const theme = site.theme || {};

  const setColor = (id, val) => {
    const el = document.getElementById(id);
    if (el && val) el.value = val;
  };
  setColor('site-accent', theme.accent);
  setColor('site-accent-hover', theme.accentHover);
  setColor('site-bg-header', theme.bgHeader);
  const logoEl = document.getElementById('site-logo-url');
  if (logoEl) logoEl.value = theme.logoUrl || '';

  adminRenderSidebarEditor(site.sidebar);
  adminRenderHomeCardsEditor(site.homeCards);
  adminUpdateThemePreview();

  adminSetStatus(statusEl, '', '');
  statusEl.hidden = true;

  const metaEl = document.getElementById('admin-appearance-meta');
  if (metaEl) {
    metaEl.textContent = site.updatedAt
      ? 'Última alteração: ' + adminFormatDate(site.updatedAt) + (site.updatedBy ? ' por ' + site.updatedBy : '')
      : 'Usando padrões do app. Salve para publicar na nuvem.';
  }
}

async function adminSaveAppearance (e) {
  e.preventDefault();
  const statusEl = document.getElementById('admin-appearance-status');
  const btn = document.getElementById('admin-appearance-btn');
  const payload = adminCollectSiteConfigFromForm();

  if (btn) btn.disabled = true;
  adminSetStatus(statusEl, 'Salvando…', 'muted');

  const { res, data } = await adminFetch('/api/admin?action=site-config', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  if (btn) btn.disabled = false;

  if (!res.ok) {
    adminSetStatus(statusEl, data.error || 'Erro ao salvar.', 'error');
    return;
  }

  adminSiteConfigDraft = data.site;
  adminSetStatus(statusEl, 'Salvo! Usuários veem as mudanças ao abrir ou recarregar o app.', 'ok');
  await adminLoadLog();

  const metaEl = document.getElementById('admin-appearance-meta');
  if (metaEl && data.site?.updatedAt) {
    metaEl.textContent = 'Última alteração: ' + adminFormatDate(data.site.updatedAt) +
      (data.site.updatedBy ? ' por ' + data.site.updatedBy : '');
  }
}

function adminRenderReportTable (containerId, statusId, rows, emptyMsg) {
  const wrap = document.getElementById(containerId);
  const statusEl = document.getElementById(statusId);
  if (!wrap || !statusEl) return;

  if (!rows || !rows.length) {
    adminSetStatus(statusEl, emptyMsg, 'muted');
    wrap.hidden = true;
    wrap.innerHTML = '';
    return;
  }

  wrap.innerHTML =
    '<table class="admin-report-table"><thead><tr>' +
    '<th>E-mail</th><th>Plano</th><th>Detalhe</th><th>Último acesso</th>' +
    '</tr></thead><tbody>' +
    rows.map(row => {
      let detail = '—';
      if (row.daysUntilEnd != null) detail = row.daysUntilEnd + ' dia(s)';
      else if ((row.loginCount || 0) + (row.sessionCount || 0) > 0) {
        detail = adminAccessLabel(row);
      }
      return '<tr>' +
        '<td>' + escapeHtml(row.email) + '</td>' +
        '<td>' + escapeHtml(row.planLabel || '—') + '</td>' +
        '<td>' + escapeHtml(detail) + '</td>' +
        '<td>' + escapeHtml(adminFormatDate(row.lastActiveAt)) + '</td>' +
      '</tr>';
    }).join('') +
    '</tbody></table>';

  adminSetStatus(statusEl, '', '');
  statusEl.hidden = true;
  wrap.hidden = false;
}

async function adminLoadReports () {
  const summaryEl = document.getElementById('admin-reports-summary');
  if (summaryEl) {
    summaryEl.hidden = false;
    summaryEl.innerHTML = '<p class="admin-status muted">Carregando relatório…</p>';
  }

  const { res, data } = await adminFetch('/api/admin?action=reports');
  if (!res.ok) {
    if (summaryEl) summaryEl.innerHTML = '<p class="admin-status admin-status--error">' + escapeHtml(data.error || 'Erro') + '</p>';
    return;
  }

  const s = data.report?.summary || {};
  const items = [
    { label: 'Com conta', value: s.withAccount },
    { label: 'Usou o app', value: s.usedApp },
    { label: 'Taxa adoção', value: (s.adoptionRate || 0) + '%', ok: s.adoptionRate >= 50 },
    { label: 'Só cadastro', value: s.onlyRegistered },
    { label: 'Nunca voltou', value: s.neverReturned, warn: s.neverReturned > 0 },
    { label: 'Expirando', value: s.expiringSoon, warn: s.expiringSoon > 0 },
    { label: 'Pagantes ativos', value: s.payingActive, ok: true },
    { label: 'Cortesias ativas', value: s.courtesyActive }
  ];

  if (summaryEl) {
    summaryEl.innerHTML = items.map(item =>
      '<div class="admin-stat-card' + (item.ok ? ' admin-stat-card--ok' : '') +
      (item.warn ? ' admin-stat-card--warn' : '') + '">' +
      '<span class="admin-stat-value">' + escapeHtml(String(item.value)) + '</span>' +
      '<span class="admin-stat-label">' + escapeHtml(item.label) + '</span></div>'
    ).join('');
    summaryEl.hidden = false;
  }

  adminRenderReportTable('admin-report-expiring', 'admin-report-expiring-status', data.report?.expiringSoon, 'Nenhuma cortesia expirando nos próximos 7 dias.');
  adminRenderReportTable('admin-report-never', 'admin-report-never-status', data.report?.neverReturned, 'Nenhum usuário nesta categoria.');
  adminRenderReportTable('admin-report-registered', 'admin-report-registered-status', data.report?.onlyRegistered, 'Todos com conta já usaram o app.');
  adminRenderReportTable('admin-report-active', 'admin-report-active-status', data.report?.topActive, 'Nenhum uso registrado ainda.');
}

async function adminEnterPanel (access) {
  const signedAs = document.getElementById('admin-signed-as');
  if (signedAs) {
    signedAs.textContent = access.email || '';
  }
  adminUpdatePinRow(access.pinRequired);
  adminShow('admin-panel');
  adminSwitchSection(adminReadSectionFromHash(), false);
  await adminLoadUsers();
}

async function initAdminPage () {
  await adminLoadConfig();
  adminInitNavigation();

  document.getElementById('admin-login-form')?.addEventListener('submit', adminHandleLogin);
  document.getElementById('admin-grant-form')?.addEventListener('submit', adminGrantAccess);
  document.getElementById('admin-coupon-form')?.addEventListener('submit', adminCreateCoupon);
  document.getElementById('admin-marketing-form')?.addEventListener('submit', adminSaveMarketing);
  document.getElementById('admin-appearance-form')?.addEventListener('submit', adminSaveAppearance);
  ['site-accent', 'site-accent-hover', 'site-bg-header'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', adminUpdateThemePreview);
  });
  document.getElementById('admin-refresh-btn')?.addEventListener('click', adminRefreshCurrentSection);
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
