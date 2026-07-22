/* MedHub Embed — Receituário para parceiros (iframe)
 * Na Dalucare: acesso livre (sem login / sem cobrança).
 * Fora do iframe parceiro: bloqueado (CSP + gate).
 */

(function () {
  const ALLOWED_PARENTS = (typeof MEDHUB_EMBED !== 'undefined' && MEDHUB_EMBED.allowedParents)
    ? MEDHUB_EMBED.allowedParents
    : ['https://www.dalucare.com.br', 'https://dalucare.com.br'];

  const GUEST_NAME_KEY = 'medhub-embed-guest-name';
  const GUEST_CRM_UF_KEY = 'medhub-embed-guest-crm-uf';
  const GUEST_CRM_NUM_KEY = 'medhub-embed-guest-crm-number';

  function parentOrigin () {
    try {
      if (document.referrer) return new URL(document.referrer).origin;
    } catch (_) {}
    return '';
  }

  function isFramed () {
    try { return window.parent !== window; } catch (_) { return true; }
  }

  /** Livre só dentro do iframe (CSP já limita quem pode embutir). */
  function isPartnerEmbed () {
    if (!isFramed()) return false;
    const origin = parentOrigin();
    if (!origin) return true;
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
      ? 'Abra pelo site da Dalucare'
      : 'Acesso restrito';
    text.textContent = message || '';
    actions.innerHTML =
      '<a class="btn btn-primary" target="_top" href="https://www.dalucare.com.br">Ir para dalucare.com.br</a>' +
      '<a class="btn btn-ghost" target="_top" href="https://www.medhub.ia.br">MedHub completo</a>';
    embedNotifyHeight();
  }

  function showApp () {
    const gate = document.getElementById('embed-gate');
    const app = document.getElementById('embed-app');
    if (gate) gate.hidden = true;
    if (app) app.hidden = false;
  }

  function embedNotifyHeight () {
    if (!isFramed()) return;
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

  function guestName () {
    try { return (sessionStorage.getItem(GUEST_NAME_KEY) || '').trim(); } catch (_) { return ''; }
  }

  function guestCrmUf () {
    try { return (sessionStorage.getItem(GUEST_CRM_UF_KEY) || 'SP').trim().toUpperCase() || 'SP'; } catch (_) { return 'SP'; }
  }

  function guestCrmNumber () {
    try { return (sessionStorage.getItem(GUEST_CRM_NUM_KEY) || '').replace(/\D/g, ''); } catch (_) { return ''; }
  }

  function saveGuestFields () {
    const nameEl = document.getElementById('embed-guest-name');
    const ufEl = document.getElementById('embed-guest-crm-uf');
    const numEl = document.getElementById('embed-guest-crm-number');
    try {
      if (nameEl) sessionStorage.setItem(GUEST_NAME_KEY, nameEl.value.trim());
      if (ufEl) sessionStorage.setItem(GUEST_CRM_UF_KEY, ufEl.value || 'SP');
      if (numEl) sessionStorage.setItem(GUEST_CRM_NUM_KEY, numEl.value.replace(/\D/g, ''));
    } catch (_) {}
    if (typeof rxUpdateProfileHint === 'function') rxUpdateProfileHint();
  }

  function initGuestIdentity () {
    const nameEl = document.getElementById('embed-guest-name');
    const ufEl = document.getElementById('embed-guest-crm-uf');
    const numEl = document.getElementById('embed-guest-crm-number');

    if (ufEl && !ufEl.options.length) {
      const ufs = typeof MEDHUB_CRM_UFS !== 'undefined'
        ? MEDHUB_CRM_UFS
        : ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
          'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
      ufs.forEach(uf => {
        const opt = document.createElement('option');
        opt.value = uf;
        opt.textContent = uf;
        ufEl.appendChild(opt);
      });
    }

    if (nameEl) nameEl.value = guestName();
    if (ufEl) ufEl.value = guestCrmUf();
    if (numEl) numEl.value = guestCrmNumber();

    [nameEl, ufEl, numEl].forEach(el => {
      el?.addEventListener('input', saveGuestFields);
      el?.addEventListener('change', saveGuestFields);
    });
    if (numEl) {
      numEl.addEventListener('input', () => {
        numEl.value = numEl.value.replace(/\D/g, '');
        saveGuestFields();
      });
    }
  }

  // Receituário usa estas funções para o cabeçalho da receita
  window.medhubGetRxDoctorName = function () {
    return guestName();
  };

  window.medhubGetRxCrmFormatted = function () {
    const num = guestCrmNumber();
    const uf = guestCrmUf();
    return num ? ('CRM-' + uf + ' ' + num) : ('CRM-' + uf + ' ____________');
  };

  window.medhubOpenUserProfile = function () {
    document.getElementById('embed-guest-name')?.focus();
  };

  window.showSection = function () {};

  function bootGuestReceituario () {
    showApp();
    initGuestIdentity();

    const nameEl = document.getElementById('embed-user-name');
    if (nameEl) nameEl.textContent = 'Acesso Dalucare · sem login';

    if (typeof initReceituario === 'function') initReceituario();
    if (typeof rxOnSectionShow === 'function') rxOnSectionShow();

    bindResizeObserver();
    embedNotifyHeight();
    setTimeout(embedNotifyHeight, 400);
  }

  function boot () {
    // URL direta no MedHub → não libera de graça (só iframe da Dalucare)
    if (!isPartnerEmbed()) {
      showGate(
        'blocked',
        'O receituário gratuito está disponível apenas dentro do site dalucare.com.br. Abra pelo Dalucare ou use o MedHub completo com sua conta.'
      );
      return;
    }

    bootGuestReceituario();
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
