/* Página /links.html — botões para bio do Instagram */

function initLinksPage () {
  (async function () {
    if (typeof medhubApplyRemoteMarketing === 'function') {
      await medhubApplyRemoteMarketing();
    }
  if (typeof medhubCaptureAttributionFromUrl === 'function') {
    medhubCaptureAttributionFromUrl();
  }

  const container = document.getElementById('links-actions');
  if (!container) return;

  const build = typeof medhubBuildMarketingUrl === 'function'
    ? medhubBuildMarketingUrl
    : function (path) { return path; };

  const items = [
    {
      href: build('index.html#planos', 'bio', 'assinar'),
      title: 'Assinar MedHub Pro',
      sub: '7 dias de garantia · protocolos + receituário + calculadoras',
      primary: true
    },
    {
      href: build('index.html#modulos', 'bio', 'demo'),
      title: 'Ver o app em ação',
      sub: 'Demonstração antes de assinar'
    },
    {
      href: build('index.html#garantia', 'bio', 'garantia'),
      title: 'Garantia de 7 dias',
      sub: 'Reembolso integral se não atender'
    },
    {
      href: build('login.html', 'bio', 'login'),
      title: 'Já sou assinante — Entrar',
      sub: 'Use o mesmo e-mail do pagamento'
    }
  ];

  container.innerHTML = items.map(function (item) {
    const cls = 'links-action' + (item.primary ? ' links-action--primary' : '');
    return '<a class="' + cls + '" href="' + item.href + '">' +
      '<span class="links-action-title">' + item.title + '</span>' +
      '<span class="links-action-sub">' + item.sub + '</span>' +
    '</a>';
  }).join('');

  const ig = document.getElementById('links-instagram');
  const support = document.getElementById('links-support');
  const marketing = typeof MEDHUB_MARKETING !== 'undefined' ? MEDHUB_MARKETING : null;

  if (ig && marketing?.instagramUrl) {
    ig.href = marketing.instagramUrl;
    ig.textContent = marketing.instagramHandle || 'Instagram';
    ig.hidden = false;
  }

  if (support && marketing?.supportEmail) {
    support.href = 'mailto:' + marketing.supportEmail;
    support.textContent = 'Suporte por e-mail';
    support.hidden = false;
  }

  const wrap = document.getElementById('links-support-wrap');
  if (wrap && ig && !ig.hidden && support && !support.hidden) {
    wrap.hidden = false;
  }
  })();
}
