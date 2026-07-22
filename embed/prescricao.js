/* MedHub Embed — Receituário para parceiros (iframe) */

(function () {
  const ALLOWED_PARENTS = (typeof MEDHUB_EMBED !== 'undefined' && MEDHUB_EMBED.allowedParents)
    ? MEDHUB_EMBED.allowedParents
    : ['https://www.dalucare.com.br', 'https://dalucare.com.br'];

  const EMBED_PATH = 'embed/prescricao.html';

  function parentOrigin () {
    try {
      if (document.referrer) return new URL(document.referrer).origin;
    } catch (_) {}
    return '';
  }

  function isAllowedParent () {
    if (window.parent === window) return true; // aberto direto (teste)
    const origin = parentOrigin();
    if (!origin) return true; // referrer bloqueado — CSP no servidor ainda protege
    return ALLOWED_PARENTS.indexOf(origin) !== -1;
  }

  function showGate (mode, message) {
    const gate = document.getElementById('embed-gate');
    const app = document.getElementById('embed-app');
    const title = document.getElementById('embed-gate-title');
    const text = document.getElementById('embed-gate-text');
    const actions = document.getElementById('embed-gate-actions');
    if (!gate || !app) return;

    app.hidden = true;
    gate.hidden = false;
    title.textContent = mode === 'blocked'
      ? 'Embed não autorizado'
      : mode === 'subscription'
        ? 'Assinatura necessária'
        : 'Entre no MedHub';
    text.textContent = message || '';

    const next = encodeURIComponent(EMBED_PATH);
    let html = '';
    if (mode === 'login') {
      html =
        '<a class="btn btn-primary" href="../login.html?next=' + next + '">Fazer login</a>' +
        '<a class="btn btn-ghost" href="../register.html?next=' + next + '">Criar conta</a>';
    } else if (mode === 'subscription') {
      html =
        '<a class="btn btn-primary" target="_top" href="../index.html?reason=subscription#planos">Ver planos</a>' +
        '<a class="btn btn-ghost" href="../login.html?next=' + next + '">Trocar conta</a>';
    } else {
      html = '<a class="btn btn-ghost" target="_top" href="https://www.medhub.ia.br">Ir ao MedHub</a>';
    }
    actions.innerHTML = html;
    embedNotifyHeight();
  }

  function showApp () {
    const gate = document.getElementById('embed-gate');
    const app = document.getElementById('embed-app');
    if (gate) gate.hidden = true;
    if (app) app.hidden = false;
  }

  function embedNotifyHeight () {
    if (window.parent === window) return;
    const height = Math.max(
      document.documentElement.scrollHeight,
      document.body ? document.body.scrollHeight : 0,
      480
    );
    ALLOWED_PARENTS.forEach(origin => {
      try {
        window.parent.postMessage({ source: 'medhub-embed', type: 'resize', height: height }, origin);
      } catch (_) {}
    });
  }

  function bindResizeObserver () {
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('load', embedNotifyHeight);
      return;
    }
    const ro = new ResizeObserver(() => embedNotifyHeight());
    ro.observe(document.documentElement);
    if (document.body) ro.observe(document.body);
  }

  window.medhubOpenUserProfile = function () {
    const next = encodeURIComponent(EMBED_PATH);
    window.open('../app.html#perfil', '_blank', 'noopener');
  };

  window.showSection = function () {};

  async function boot () {
    if (!isAllowedParent()) {
      showGate('blocked', 'Esta página de prescrição só pode ser embutida em sites parceiros autorizados (Dalucare).');
      return;
    }

    const user = typeof getSession === 'function' ? getSession() : null;
    if (!user) {
      showGate('login', 'Para usar o receituário MedHub dentro da Dalucare, entre com sua conta.');
      return;
    }

    if (typeof medhubValidateCloudSession === 'function') {
      const config = typeof medhubFetchAuthConfig === 'function'
        ? await medhubFetchAuthConfig()
        : { cloudEnabled: false };
      if (config.cloudEnabled) {
        const valid = await medhubValidateCloudSession();
        if (!valid) {
          if (typeof clearSession === 'function') clearSession();
          else if (typeof logout === 'function') {
            /* logout redireciona — evitar */
          }
          localStorage.removeItem('session');
          if (typeof medhubClearCloudSession === 'function') medhubClearCloudSession();
          showGate('login', 'Sessão expirada. Faça login novamente.');
          return;
        }
      }
    }

    if (typeof medhubSyncProfileAfterLogin === 'function') {
      await medhubSyncProfileAfterLogin();
    }

    if (typeof medhubRequireSubscription === 'function') {
      const status = typeof medhubVerifySubscription === 'function'
        ? await medhubVerifySubscription(user.email)
        : { active: true };
      if (!(status.localDev || status.devBypass || status.active)) {
        if (status.misconfigured) {
          showGate('subscription', 'Assinaturas temporariamente indisponíveis. Contate o suporte MedHub.');
          return;
        }
        showGate('subscription', 'Sua conta MedHub precisa de assinatura ativa para usar o receituário.');
        return;
      }
    }

    showApp();

    if (typeof medhubInitComplianceShell === 'function') medhubInitComplianceShell();
    if (typeof initReceituario === 'function') initReceituario();
    if (typeof rxOnSectionShow === 'function') rxOnSectionShow();

    const nameEl = document.getElementById('embed-user-name');
    if (nameEl) nameEl.textContent = user.name || user.email || '';

    bindResizeObserver();
    embedNotifyHeight();
    setTimeout(embedNotifyHeight, 400);
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
