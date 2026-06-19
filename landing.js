/* Landing page — preços, checkout e navegação por âncoras */

async function initLandingPage () {
  if (typeof medhubCaptureAttributionFromUrl === 'function') {
    medhubCaptureAttributionFromUrl();
  }
  initLandingAnchorNav();

  if (typeof mountAppShowcase === 'function') {
    mountAppShowcase('#app-showcase-root-index');
  }

  if (typeof initPricingPage === 'function') {
    await initPricingPage();
  }

  const priceEl = document.getElementById('landing-price-from');
  const annualEl = document.getElementById('landing-price-annual');

  if (typeof medhubFetchBillingConfig !== 'function') return;

  try {
    const config = await medhubFetchBillingConfig();
    if (typeof medhubApplyPlatformGate === 'function') {
      medhubApplyPlatformGate(config);
    }
    if (priceEl && config.monthlyPerMonth) {
      priceEl.textContent = 'A partir de ' + config.monthlyPerMonth;
    }
    if (annualEl && config.annualPerYear) {
      const pct = config.annualDiscountPercent ? ' (' + config.annualDiscountPercent + '% off)' : ' (15% off)';
      annualEl.textContent = 'ou ' + config.annualPerYear + pct + ' · parcelável no cartão';
    }
  } catch {
    /* mantém texto estático */
  }

  if (window.location.hash) {
    requestAnimationFrame(function () {
      scrollToLandingSection(window.location.hash);
    });
  }
}

function initLandingAnchorNav () {
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      const target = document.querySelector(hash);
      if (!target) return;
      event.preventDefault();
      history.pushState(null, '', hash);
      scrollToLandingSection(hash);
    });
  });
}

function scrollToLandingSection (hash) {
  const target = document.querySelector(hash);
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
