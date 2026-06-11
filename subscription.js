/* Verificação de assinatura MedHub Pro (Stripe) — médico solo */

function medhubIsLocalDev () {
  if (window.location.protocol === 'file:') return true;
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1';
}

async function medhubFetchBillingConfig () {
  try {
    const res = await fetch('/api/billing-config');
    if (!res.ok) return { enabled: false, misconfigured: !medhubIsLocalDev() };
    return res.json();
  } catch {
    return { enabled: false, misconfigured: !medhubIsLocalDev() };
  }
}

async function medhubVerifySubscription (email) {
  const norm = String(email || '').trim().toLowerCase();
  if (!norm) return { active: false };

  if (medhubIsLocalDev()) {
    return { active: true, localDev: true };
  }

  try {
    const res = await fetch('/api/verify-subscription?email=' + encodeURIComponent(norm));
    const data = await res.json();
    if (res.status === 503 && data.misconfigured) {
      return { active: false, misconfigured: true, reason: data.reason };
    }
    if (res.ok && data.devBypass) return { active: true, devBypass: true };
    return data;
  } catch {
    return { active: false, error: 'network' };
  }
}

async function medhubRequireSubscription (user) {
  const status = await medhubVerifySubscription(user.email);
  if (status.localDev || status.devBypass) return true;
  if (status.misconfigured) {
    alert('Assinaturas temporariamente indisponíveis. O administrador precisa configurar Stripe e KV na Vercel.');
    return false;
  }
  if (status.active) return true;

  const q = new URLSearchParams({ reason: 'subscription', email: user.email });
  window.location.href = 'index.html?' + q.toString() + '#planos';
  return false;
}

async function medhubOpenCheckout (plan, email) {
  const norm = String(email || '').trim().toLowerCase();

  try {
    const payload = { plan };
    if (norm) payload.email = norm;

    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
      return;
    }
    alert(data.error || 'Não foi possível iniciar o pagamento.');
  } catch {
    alert('Erro de conexão. Verifique a internet e tente novamente.');
  }
}

async function medhubOpenBillingPortal (email) {
  const norm = String(email || '').trim().toLowerCase();
  if (!norm) return alert('E-mail não encontrado na sessão.');

  try {
    const res = await fetch('/api/create-portal-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: norm })
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
      return;
    }
    alert(data.error || 'Não foi possível abrir o portal de cobrança.');
  } catch {
    alert('Erro de conexão. Tente novamente.');
  }
}

async function initBillingPanel (user) {
  const panel = document.getElementById('billing-panel');
  if (!panel || !user) return;

  const config = await medhubFetchBillingConfig();
  if (!config.enabled) {
    panel.hidden = true;
    return;
  }

  panel.hidden = false;
  const statusEl = document.getElementById('billing-status-text');
  const subscribeBtn = document.getElementById('billing-subscribe-btn');
  const portalBtn = document.getElementById('billing-portal-btn');

  const status = await medhubVerifySubscription(user.email);
  if (status.active && !status.devBypass && !status.localDev) {
    const planLabel = status.plan === 'annual' ? 'anual' : 'mensal';
    statusEl.textContent = 'Assinatura ativa (' + planLabel + ') para ' + user.email + '. Renovação automática no cartão.';
    if (portalBtn) portalBtn.hidden = false;
    if (subscribeBtn) subscribeBtn.hidden = true;
  } else {
    statusEl.textContent = 'Nenhuma assinatura ativa vinculada a ' + user.email + '. Assine para continuar usando o MedHub.';
    if (subscribeBtn) subscribeBtn.hidden = false;
    if (portalBtn) portalBtn.hidden = true;
  }

  subscribeBtn?.addEventListener('click', () => {
    window.location.href = 'index.html?email=' + encodeURIComponent(user.email) + '#planos';
  });
  portalBtn?.addEventListener('click', () => medhubOpenBillingPortal(user.email));
}
