/* Verificação de assinatura MedHub Pro (Stripe) — médico solo */

async function medhubFetchBillingConfig () {
  try {
    const res = await fetch('/api/billing-config');
    if (!res.ok) return { enabled: false };
    return res.json();
  } catch {
    return { enabled: false };
  }
}

async function medhubVerifySubscription (email) {
  const norm = String(email || '').trim().toLowerCase();
  if (!norm) return { active: false };

  if (window.location.protocol === 'file:') {
    return { active: true, localDev: true };
  }

  try {
    const res = await fetch('/api/verify-subscription?email=' + encodeURIComponent(norm));
    const data = await res.json();
    if (res.ok && data.billingDisabled) return { active: true, billingDisabled: true };
    return data;
  } catch {
    return { active: false, error: 'network' };
  }
}

async function medhubRequireSubscription (user) {
  const status = await medhubVerifySubscription(user.email);
  if (status.active || status.billingDisabled || status.localDev) return true;

  const q = new URLSearchParams({ reason: 'subscription', email: user.email });
  window.location.href = 'pricing.html?' + q.toString();
  return false;
}

async function medhubOpenCheckout (plan, email) {
  const norm = String(email || '').trim().toLowerCase();
  if (!norm) {
    alert('Informe o e-mail que usará no MedHub (mesmo da conta).');
    return;
  }

  try {
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan, email: norm })
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
  if (status.active && !status.billingDisabled) {
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
    window.location.href = 'pricing.html?email=' + encodeURIComponent(user.email);
  });
  portalBtn?.addEventListener('click', () => medhubOpenBillingPortal(user.email));
}
