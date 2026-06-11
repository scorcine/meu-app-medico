/* Página de planos — checkout Stripe */

async function initPricingPage () {
  const params = new URLSearchParams(window.location.search);
  const emailInput = document.getElementById('billing-email');
  const prefill = params.get('email') || '';
  if (emailInput && prefill) emailInput.value = prefill;

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

  const devNote = document.getElementById('pricing-dev-note');
  if (devNote && !config.enabled) {
    devNote.hidden = false;
  }

  document.getElementById('btn-plan-monthly')?.addEventListener('click', () => {
    medhubOpenCheckout('monthly', emailInput?.value || prefill);
  });
  document.getElementById('btn-plan-annual')?.addEventListener('click', () => {
    medhubOpenCheckout('annual', emailInput?.value || prefill);
  });
  document.getElementById('btn-plan-annual-bottom')?.addEventListener('click', () => {
    medhubOpenCheckout('annual', emailInput?.value || prefill);
  });
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
    badgeEl.textContent = config.annualDiscountPercent + '% off';
  }
}

async function initSubscribeSuccessPage () {
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('session_id');
  const titleEl = document.getElementById('success-title');
  const bodyEl = document.getElementById('success-body');
  const emailEl = document.getElementById('success-email');

  if (!sessionId) {
    if (titleEl) titleEl.textContent = 'Assinatura';
    if (bodyEl) bodyEl.textContent = 'Se você concluiu o pagamento, faça login com o mesmo e-mail usado no cartão.';
    return;
  }

  try {
    const res = await fetch('/api/checkout-session?session_id=' + encodeURIComponent(sessionId));
    const data = await res.json();
    if (data.email) {
      if (emailEl) {
        emailEl.hidden = false;
        emailEl.textContent = data.email;
      }
      if (bodyEl) {
        bodyEl.textContent = 'Cadastre-se ou entre com o e-mail acima para acessar o MedHub.';
      }
      const registerLink = document.getElementById('success-register');
      if (registerLink) registerLink.href = 'register.html?email=' + encodeURIComponent(data.email);
    }
  } catch {
    if (bodyEl) bodyEl.textContent = 'Pagamento recebido. Entre com o mesmo e-mail usado no Stripe.';
  }
}
