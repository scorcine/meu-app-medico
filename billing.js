/* Página de planos — checkout Stripe */

async function initPricingPage () {
  if (typeof medhubCaptureAttributionFromUrl === 'function') {
    medhubCaptureAttributionFromUrl();
  }
  const params = new URLSearchParams(window.location.search);
  const checkoutEmail = params.get('email') || '';

  const reason = params.get('reason');
  const notice = document.getElementById('pricing-notice');
  if (notice && reason === 'subscription') {
    notice.hidden = false;
    notice.textContent = 'Assinatura MedHub Pro necessária para acessar o app. Use o mesmo e-mail da sua conta ao pagar.';
  }
  if (notice && params.get('canceled') === '1') {
    notice.hidden = false;
    notice.textContent = 'Pagamento cancelado. Escolha um plano quando quiser.';
  }

  const config = await medhubFetchBillingConfig();
  applyPricingConfig(config);
  medhubApplyPlatformGate(config);

  document.getElementById('btn-plan-monthly')?.addEventListener('click', () => {
    medhubOpenCheckout('monthly', checkoutEmail);
  });
  document.getElementById('btn-plan-annual')?.addEventListener('click', () => {
    medhubOpenCheckout('annual', checkoutEmail);
  });

  if (typeof mountAppShowcase === 'function') {
    mountAppShowcase('#app-showcase-root');
  }
}

function applyPricingConfig (config) {
  const monthlyEl = document.getElementById('price-monthly');
  const annualEl = document.getElementById('price-annual');
  const savingsEl = document.getElementById('price-savings');
  const badgeEl = document.getElementById('price-annual-badge');

  if (monthlyEl) monthlyEl.textContent = config.monthlyPerMonth || config.monthlyDisplay || '—';
  if (annualEl) annualEl.textContent = config.annualPerYear || config.annualDisplay || '—';
  if (savingsEl && config.annualSavingsDisplay) {
    savingsEl.textContent = 'Economize ' + config.annualSavingsDisplay + ' em relação a 12 meses avulsos.';
  }
  if (badgeEl && config.annualDiscountPercent) {
    badgeEl.textContent = config.annualDiscountPercent + '% de desconto';
  }
}

function medhubApplyPlatformGate (config) {
  if (!config) return;

  const note = document.getElementById('pricing-dev-note');
  const checkoutReady = !!(config.checkoutEnabled ?? config.enabled);

  if (note) {
    if (config.billingMisconfigured) {
      note.hidden = false;
      const missing = (config.missingBilling || config.missing || []).join(', ');
      note.textContent = 'Assinaturas indisponíveis até configurar na Vercel: ' + missing + '.';
    } else if (config.authMisconfigured) {
      note.hidden = false;
      const missing = (config.missingAuth || []).join(', ');
      note.textContent = 'Pagamentos ativos. Login na nuvem em breve — falta: ' + missing + '.';
    } else if (!config.enabled && config.allowDevBypass) {
      note.hidden = false;
      note.textContent = 'Ambiente de preview/desenvolvimento — pagamentos desligados.';
    } else if (!config.enabled) {
      note.hidden = false;
      note.textContent = 'Pagamentos não configurados no servidor.';
    } else {
      note.hidden = true;
    }
  }

  document.querySelectorAll('#btn-plan-monthly, #btn-plan-annual').forEach(function (btn) {
    btn.disabled = !checkoutReady;
  });

  if (typeof medhubMetaTrackPlanosView === 'function') {
    medhubMetaTrackPlanosView();
  }
}

async function initSubscribeSuccessPage () {
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('session_id');
  const titleEl = document.getElementById('success-title');
  const bodyEl = document.getElementById('success-body');
  const emailEl = document.getElementById('success-email');
  const registerLink = document.getElementById('success-register');
  const loginLink = document.getElementById('success-login');

  if (!sessionId) {
    if (titleEl) titleEl.textContent = 'Assinatura';
    if (bodyEl) bodyEl.textContent = 'Se você concluiu o pagamento, use o link que enviamos ou entre com o e-mail do cartão.';
    return;
  }

  try {
    const res = await fetch('/api/checkout-session?session_id=' + encodeURIComponent(sessionId));
    const data = await res.json();

    if (!res.ok) {
      if (bodyEl) bodyEl.textContent = data.error || 'Não foi possível validar o pagamento.';
      return;
    }

    if (data.email && emailEl) {
      emailEl.hidden = false;
      emailEl.textContent = 'E-mail da assinatura: ' + data.email;
    }

    if (data.readyToRegister) {
      if (titleEl) titleEl.textContent = 'Pagamento confirmado';
      if (bodyEl) {
        bodyEl.textContent = 'Último passo: crie sua conta com o e-mail acima. Sua assinatura já está vinculada ao pagamento.';
      }
      if (typeof medhubMetaTrackPurchase === 'function') {
        medhubMetaTrackPurchase(data.plan);
      }
      if (registerLink) {
        const q = new URLSearchParams({
          email: data.email,
          session_id: sessionId
        });
        registerLink.href = 'register.html?' + q.toString();
        registerLink.textContent = 'Criar conta agora';
      }
    } else if (data.paid) {
      if (typeof medhubMetaTrackPurchase === 'function') {
        medhubMetaTrackPurchase(data.plan);
      }
      if (bodyEl) bodyEl.textContent = 'Pagamento recebido. Aguarde alguns segundos e clique em criar conta, ou faça login se já tiver cadastro.';
      if (registerLink && data.email) {
        registerLink.href = 'register.html?email=' + encodeURIComponent(data.email) + '&session_id=' + encodeURIComponent(sessionId);
      }
    } else {
      if (bodyEl) bodyEl.textContent = 'Pagamento em processamento. Atualize esta página em instantes.';
    }

    if (loginLink && data.email) {
      loginLink.href = 'login.html?email=' + encodeURIComponent(data.email);
    }
  } catch {
    if (bodyEl) bodyEl.textContent = 'Pagamento recebido. Entre com o mesmo e-mail usado no Stripe.';
  }
}
