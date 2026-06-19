/* Link na bio — público estudantes / internato */

function initLinksEstudantesPage () {
  if (typeof medhubCaptureAttributionFromUrl === 'function') {
    medhubCaptureAttributionFromUrl();
  }

  const container = document.getElementById('links-actions');
  if (!container) return;

  const build = typeof medhubBuildMarketingUrl === 'function'
    ? function (path, medium, campaign) {
      return medhubBuildMarketingUrl(path, medium, campaign || 'estudantes');
    }
    : function (path) { return path; };

  const items = [
    {
      href: build('estudantes.html#planos', 'bio', 'estudantes'),
      title: 'Testar MedHub no internato',
      sub: '7 dias de garantia · perfil estudante',
      primary: true
    },
    {
      href: build('estudantes.html#por-que', 'bio', 'estudantes'),
      title: 'Por que MedHub no plantão?',
      sub: 'Fluxo queixa → protocolo → prescrição'
    },
    {
      href: build('index.html#modulos', 'bio', 'estudantes-demo'),
      title: 'Ver o app funcionando',
      sub: 'Demonstração dos módulos'
    },
    {
      href: build('login.html', 'bio', 'estudantes-login'),
      title: 'Já assinei — Entrar',
      sub: 'Mesmo e-mail do pagamento'
    }
  ];

  container.innerHTML = items.map(function (item) {
    const cls = 'links-action' + (item.primary ? ' links-action--primary' : '');
    return '<a class="' + cls + '" href="' + item.href + '">' +
      '<span class="links-action-title">' + item.title + '</span>' +
      '<span class="links-action-sub">' + item.sub + '</span>' +
    '</a>';
  }).join('');
}
