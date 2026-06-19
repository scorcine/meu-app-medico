/* Landing estudantes — preços e links com UTM */

async function initEstudantesPage () {
  if (typeof medhubCaptureAttributionFromUrl === 'function') {
    medhubCaptureAttributionFromUrl();
  }

  const build = typeof medhubBuildMarketingUrl === 'function'
    ? function (path, medium, campaign) {
      return medhubBuildMarketingUrl(path, medium, campaign || 'estudantes');
    }
    : function (path) { return path; };

  const demo = document.getElementById('estudantes-cta-demo');
  if (demo) demo.href = build('index.html#modulos', 'landing', 'demo');

  if (typeof initPricingPage === 'function') {
    await initPricingPage();
  }

  if (typeof medhubFetchBillingConfig !== 'function') return;

  try {
    const config = await medhubFetchBillingConfig();
    if (typeof medhubApplyPlatformGate === 'function') {
      medhubApplyPlatformGate(config);
    }
    const priceEl = document.getElementById('landing-price-from');
    const annualEl = document.getElementById('landing-price-annual');
    if (priceEl && config.monthlyPerMonth) {
      priceEl.textContent = 'A partir de ' + config.monthlyPerMonth;
    }
    if (annualEl && config.annualPerYear) {
      const pct = config.annualDiscountPercent ? ' (' + config.annualDiscountPercent + '% off)' : '';
      annualEl.textContent = 'ou ' + config.annualPerYear + pct + ' · parcelável no cartão';
    }
  } catch { /* mantém estático */ }
}
