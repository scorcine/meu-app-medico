/* Landing page — preços dinâmicos e CTA */

async function initLandingPage () {
  if (typeof mountAppShowcase === 'function') {
    mountAppShowcase('#app-showcase-root-index');
  }

  const priceEl = document.getElementById('landing-price-from');
  const annualEl = document.getElementById('landing-price-annual');

  if (typeof medhubFetchBillingConfig !== 'function') return;

  try {
    const config = await medhubFetchBillingConfig();
    if (priceEl && config.monthlyPerMonth) {
      priceEl.textContent = 'A partir de ' + config.monthlyPerMonth;
    }
    if (annualEl && config.annualPerYear) {
      annualEl.textContent = 'ou ' + config.annualPerYear + ' (15% off)';
    }
  } catch {
    /* mantém texto estático */
  }
}
