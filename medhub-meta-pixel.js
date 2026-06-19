/* Meta Pixel — rastreio para anúncios Instagram/Facebook (Ads Manager) */

function medhubMetaPixelEnabled () {
  const cfg = typeof MEDHUB_META !== 'undefined' ? MEDHUB_META : null;
  const pixelId = String(cfg?.pixelId || '').replace(/\D/g, '');
  if (!pixelId) return false;
  if (window.location.protocol === 'file:') return false;
  if (cfg?.debug) return true;
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') return false;
  return true;
}

function medhubMetaPixelId () {
  return String((typeof MEDHUB_META !== 'undefined' ? MEDHUB_META.pixelId : '') || '').replace(/\D/g, '');
}

function medhubMetaInitPixel () {
  if (!medhubMetaPixelEnabled() || window.fbq) return;
  const pixelId = medhubMetaPixelId();
  if (!pixelId) return;

  /* eslint-disable */
  !function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */

  window.fbq('init', pixelId);
  window.fbq('track', 'PageView');
}

function medhubMetaTrack (eventName, params) {
  if (!medhubMetaPixelEnabled() || typeof window.fbq !== 'function') return;
  window.fbq('track', eventName, params || {});
}

function medhubMetaTrackPlanosView () {
  medhubMetaTrack('ViewContent', {
    content_name: 'MedHub Planos',
    content_category: 'subscription'
  });
}

function medhubMetaTrackCheckoutStart (plan) {
  medhubMetaTrack('InitiateCheckout', {
    content_name: plan === 'annual' ? 'Plano anual' : 'Plano mensal',
    content_category: 'subscription',
    currency: 'BRL'
  });
}

function medhubMetaTrackPurchase (plan) {
  medhubMetaTrack('Purchase', {
    content_name: plan ? ('Plano ' + plan) : 'MedHub Pro',
    content_category: 'subscription',
    currency: 'BRL'
  });
}

function medhubMetaTrackLead () {
  medhubMetaTrack('Lead', { content_name: 'MedHub cadastro' });
}

medhubMetaInitPixel();
