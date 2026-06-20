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

function medhubDaysUntilDate (iso) {
  if (!iso) return null;
  const end = new Date(iso);
  if (Number.isNaN(end.getTime())) return null;
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.max(0, Math.ceil((endDay - startToday) / (24 * 60 * 60 * 1000)));
}

function medhubFormatDatePt (iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' });
}

function medhubCourtesyCountdownText (subscription) {
  if (!subscription?.isCourtesy || !subscription?.courtesyEndsAt) return '';
  const days = medhubDaysUntilDate(subscription.courtesyEndsAt);
  if (days == null) return '';
  const dateStr = medhubFormatDatePt(subscription.courtesyEndsAt);
  if (days === 0) return 'Sua cortesia expira hoje (' + dateStr + ').';
  if (days === 1) return 'Falta 1 dia de cortesia — expira em ' + dateStr + '.';
  return 'Faltam ' + days + ' dias de cortesia — expira em ' + dateStr + '.';
}

async function medhubUpdateHomeWelcome (user) {
  const greetingEl = document.getElementById('user-greeting');
  const countdownEl = document.getElementById('home-courtesy-countdown');
  if (!greetingEl || !user?.name) return;

  greetingEl.textContent = 'Olá, ' + user.name;

  if (!countdownEl) return;
  countdownEl.hidden = true;
  countdownEl.textContent = '';

  const sub = await medhubVerifySubscription(user.email);
  if (!sub?.isCourtesy) return;

  const text = medhubCourtesyCountdownText(sub);
  if (!text) return;

  countdownEl.textContent = text;
  countdownEl.hidden = false;
}

async function medhubVerifySubscription (email) {
  const norm = String(email || '').trim().toLowerCase();
  if (!norm) return { active: false };

  if (medhubIsLocalDev()) {
    return { active: true, localDev: true };
  }

  if (typeof medhubGetAuthToken === 'function' && medhubGetAuthToken() && typeof medhubCloudMe === 'function') {
    try {
      const me = await medhubCloudMe();
      if (me?.subscription) {
        if (me.subscription.misconfigured) {
          return { active: false, misconfigured: true, reason: me.subscription.reason };
        }
        if (me.subscription.devBypass) return { active: true, devBypass: true };
        return me.subscription;
      }
    } catch {
      /* fallback abaixo removido em produção */
    }
  }

  return { active: false, reason: 'auth_required' };
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
    if (typeof medhubGetAttributionPayload === 'function') {
      const attribution = medhubGetAttributionPayload();
      if (Object.keys(attribution).length) payload.attribution = attribution;
    }

    if (typeof medhubMetaTrackCheckoutStart === 'function') {
      medhubMetaTrackCheckoutStart(plan);
    }

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
    if (data.code === 'invalid_coupon') {
      alert(data.error || 'Cupom inválido.');
      return;
    }
    alert(data.error || 'Não foi possível iniciar o pagamento.');
  } catch {
    alert('Erro de conexão. Verifique a internet e tente novamente.');
  }
}

async function medhubOpenBillingPortal () {
  const token = medhubGetAuthToken();
  if (!token) return alert('Faça login para gerenciar sua assinatura.');

  try {
    const res = await fetch('/api/create-portal-session', {
      method: 'POST',
      headers: medhubAuthHeaders()
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
  if (panel.dataset.billingBound) return;

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
    const courtesyText = medhubCourtesyCountdownText(status);
    if (courtesyText) {
      statusEl.textContent = courtesyText + ' Conta: ' + user.email + '.';
    } else {
      const planLabel = status.plan === 'annual' ? 'anual' : 'mensal';
      statusEl.textContent = 'Assinatura ativa (' + planLabel + ') para ' + user.email + '. Renovação automática no cartão.';
    }
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
  portalBtn?.addEventListener('click', () => medhubOpenBillingPortal());
  panel.dataset.billingBound = '1';
}
