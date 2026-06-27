/* Painel administrativo MedHub */

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
  el.className = 'admin-status' + (type ? ' admin-status--' + type : '');
}

function adminFormatDate (iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('pt-BR');
  } catch {
    return '—';
  }
}

function adminLogout () {
  if (typeof medhubClearCloudSession === 'function') medhubClearCloudSession();
  localStorage.removeItem('session');
  if (typeof medhubClearSessionCrypto === 'function') medhubClearSessionCrypto();
  adminShow('admin-login-panel');
}

async function adminFetch (path, options) {
  const res = await fetch(path, {
    ...options,
    headers: {
      ...(options?.headers || {}),
      ...medhubAuthHeaders()
    }
  });
  const data = await res.json().catch(() => ({}));
  return { res, data };
}

async function adminCheckAccess () {
  const { res, data } = await adminFetch('/api/admin?action=me');
  if (res.status === 403) return { ok: false, forbidden: true };
  if (res.status === 503 && data.code === 'admin_not_configured') {
    return { ok: false, misconfigured: true, error: data.error };
  }
  if (!res.ok) return { ok: false, error: data.error || 'Sessão inválida.' };
  return { ok: true, email: data.email, name: data.name };
}

async function adminLoadUsers () {
  const loadStatus = document.getElementById('admin-load-status');
  const tableWrap = document.getElementById('admin-table-wrap');
  const tbody = document.getElementById('admin-users-body');
  const countEl = document.getElementById('admin-user-count');

  adminSetStatus(loadStatus, 'Carregando…', 'muted');
  if (tableWrap) tableWrap.hidden = true;

  const { res, data } = await adminFetch('/api/admin?action=users');
  if (!res.ok) {
    adminSetStatus(loadStatus, data.error || 'Erro ao carregar usuários.', 'error');
    return;
  }

  const users = data.users || [];
  if (countEl) countEl.textContent = users.length + ' registro(s)';

  if (!tbody) return;
  tbody.innerHTML = '';

  users.forEach(user => {
    const tr = document.createElement('tr');
    const activeBadge = user.active
      ? '<span class="admin-pill admin-pill--ok">Ativo</span>'
      : '<span class="admin-pill admin-pill--off">Inativo</span>';

    tr.innerHTML =
      '<td><code>' + escapeHtml(user.email) + '</code></td>' +
      '<td>' + escapeHtml(user.name || '—') + '</td>' +
      '<td>' + (user.hasAccount ? 'Sim' : 'Só billing') + '</td>' +
      '<td>' + escapeHtml(user.planLabel || user.plan || '—') + '</td>' +
      '<td>' + activeBadge + '</td>' +
      '<td class="admin-actions">' +
        '<button type="button" class="btn-outline btn-sm admin-revoke-btn" data-email="' + escapeAttr(user.email) + '">Revogar</button>' +
      '</td>';
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll('.admin-revoke-btn').forEach(btn => {
    btn.addEventListener('click', () => adminRevokeUser(btn.dataset.email));
  });

  adminSetStatus(loadStatus, '', '');
  loadStatus.hidden = true;
  if (tableWrap) tableWrap.hidden = users.length === 0;
  if (users.length === 0) {
    adminSetStatus(loadStatus, 'Nenhum usuário encontrado no KV.', 'muted');
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

async function adminRevokeUser (email) {
  if (!email) return;
  const deleteUser = confirm(
    'Revogar acesso de ' + email + '?\n\n' +
    'OK = bloqueia assinatura (conta permanece)\n' +
    'Cancelar = não fazer nada'
  );
  if (!deleteUser) return;

  const alsoDelete = confirm(
    'Apagar também a conta do servidor (login, perfil e backup clínico)?\n\n' +
    'OK = apagar conta\n' +
    'Cancelar = só bloquear assinatura'
  );

  const { res, data } = await adminFetch('/api/admin?action=revoke', {
    method: 'POST',
    body: JSON.stringify({ email, deleteUser: alsoDelete })
  });

  if (!res.ok) {
    alert(data.error || 'Erro ao revogar.');
    return;
  }

  alert(alsoDelete
    ? 'Acesso revogado e conta removida.'
    : 'Assinatura revogada. A conta ainda existe, mas o app pedirá planos.');
  await adminLoadUsers();
}

async function adminGrantAccess (e) {
  e.preventDefault();
  const statusEl = document.getElementById('admin-grant-status');
  const btn = document.getElementById('admin-grant-btn');
  const email = document.getElementById('grant-email')?.value?.trim();
  const name = document.getElementById('grant-name')?.value?.trim();
  const lifetime = !!document.getElementById('grant-lifetime')?.checked;
  const password = document.getElementById('grant-password')?.value || '';

  if (!email) return;

  if (btn) btn.disabled = true;
  adminSetStatus(statusEl, 'Salvando…', 'muted');

  const { res, data } = await adminFetch('/api/admin?action=grant', {
    method: 'POST',
    body: JSON.stringify({ email, name, lifetime, password })
  });

  if (btn) btn.disabled = false;

  if (!res.ok) {
    adminSetStatus(statusEl, data.error || 'Erro ao liberar acesso.', 'error');
    return;
  }

  let msg = 'Acesso liberado para ' + data.email + ' (' + (data.lifetime ? 'vitalício' : '1 ano') + ').';
  if (data.accountCreated) msg += ' Conta criada.';
  else if (!data.hasAccount) msg += ' Usuário pode cadastrar com este e-mail.';
  if (data.passwordReset) msg += ' Senha atualizada.';

  adminSetStatus(statusEl, msg, 'ok');
  document.getElementById('admin-grant-form')?.reset();
  if (document.getElementById('grant-lifetime')) {
    document.getElementById('grant-lifetime').checked = true;
  }
  await adminLoadUsers();
}

async function adminHandleLogin (e) {
  e.preventDefault();
  const errEl = document.getElementById('admin-login-error');
  const btn = document.getElementById('admin-login-btn');
  const email = document.getElementById('admin-email')?.value?.trim();
  const password = document.getElementById('admin-password')?.value;

  if (!email || !password) return;

  adminSetStatus(errEl, '', '');
  if (btn) btn.disabled = true;

  const result = await medhubCloudLogin(email, password);
  if (!result.ok) {
    if (btn) btn.disabled = false;
    adminSetStatus(errEl, result.error || 'Credenciais inválidas.', 'error');
    return;
  }

  await medhubApplyCloudSession(result.data, password);
  if (typeof medhubSetSession === 'function') medhubSetSession(result.data.user);

  const access = await adminCheckAccess();
  if (btn) btn.disabled = false;

  if (access.misconfigured) {
    adminSetStatus(errEl, access.error, 'error');
    adminLogout();
    return;
  }
  if (access.forbidden) {
    adminShow('admin-forbidden-panel');
    return;
  }
  if (!access.ok) {
    adminSetStatus(errEl, access.error || 'Não foi possível validar admin.', 'error');
    adminLogout();
    return;
  }

  await adminEnterPanel(access);
}

async function adminEnterPanel (access) {
  const signedAs = document.getElementById('admin-signed-as');
  if (signedAs) {
    signedAs.textContent = 'Conectado como ' + (access.email || '');
  }
  adminShow('admin-panel');
  await adminLoadUsers();
}

async function initAdminPage () {
  document.getElementById('admin-login-form')
    ?.addEventListener('submit', adminHandleLogin);
  document.getElementById('admin-grant-form')
    ?.addEventListener('submit', adminGrantAccess);
  document.getElementById('admin-refresh-btn')
    ?.addEventListener('click', adminLoadUsers);

  const token = typeof medhubGetAuthToken === 'function' ? medhubGetAuthToken() : '';
  if (!token) {
    adminShow('admin-login-panel');
    return;
  }

  const access = await adminCheckAccess();
  if (access.misconfigured) {
    adminShow('admin-login-panel');
    adminSetStatus(document.getElementById('admin-login-error'), access.error, 'error');
    return;
  }
  if (access.forbidden) {
    adminShow('admin-forbidden-panel');
    return;
  }
  if (!access.ok) {
    adminShow('admin-login-panel');
    return;
  }

  await adminEnterPanel(access);
}
