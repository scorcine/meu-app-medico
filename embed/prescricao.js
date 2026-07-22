/* MedHub Embed — Receituário para parceiros (iframe)
 * Na Dalucare: acesso livre (sem login / sem cobrança).
 * Nome/CRM podem vir do Dalucare via postMessage ou query string.
 */

(function () {
  const ALLOWED_PARENTS = (typeof MEDHUB_EMBED !== 'undefined' && MEDHUB_EMBED.allowedParents)
    ? MEDHUB_EMBED.allowedParents
    : ['https://www.dalucare.com.br', 'https://dalucare.com.br'];

  const GUEST_NAME_KEY = 'medhub-embed-guest-name';
  const GUEST_CRM_UF_KEY = 'medhub-embed-guest-crm-uf';
  const GUEST_CRM_NUM_KEY = 'medhub-embed-guest-crm-number';
  const GUEST_SOURCE_KEY = 'medhub-embed-guest-source';

  let partnerProfileLocked = false;

  function parentOrigin () {
    try {
      if (document.referrer) return new URL(document.referrer).origin;
    } catch (_) {}
    return '';
  }

  function isFramed () {
    try { return window.parent !== window; } catch (_) { return true; }
  }

  function isAllowedOrigin (origin) {
    return !!origin && ALLOWED_PARENTS.indexOf(origin) !== -1;
  }

  /** Livre só dentro do iframe (CSP já limita quem pode embutir). */
  function isPartnerEmbed () {
    if (!isFramed()) return false;
    const origin = parentOrigin();
    if (!origin) return true;
    return isAllowedOrigin(origin);
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
    const height = Math.ceil(Math.max(
      document.documentElement.scrollHeight,
      document.body ? document.body.scrollHeight : 0,
      document.documentElement.offsetHeight,
      520
    )) + 8;
    ALLOWED_PARENTS.forEach(origin => {
      try {
        window.parent.postMessage({ source: 'medhub-embed', type: 'resize', height: height }, origin);
      } catch (_) {}
    });
  }

  function embedNotifyReady () {
    if (!isFramed()) return;
    ALLOWED_PARENTS.forEach(origin => {
      try {
        window.parent.postMessage({ source: 'medhub-embed', type: 'ready' }, origin);
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

  function guestSource () {
    try { return sessionStorage.getItem(GUEST_SOURCE_KEY) || ''; } catch (_) { return ''; }
  }

  function persistGuest (name, uf, number, source) {
    try {
      if (name != null) sessionStorage.setItem(GUEST_NAME_KEY, String(name).trim());
      if (uf != null) sessionStorage.setItem(GUEST_CRM_UF_KEY, String(uf).trim().toUpperCase().slice(0, 2) || 'SP');
      if (number != null) sessionStorage.setItem(GUEST_CRM_NUM_KEY, String(number).replace(/\D/g, ''));
      if (source) sessionStorage.setItem(GUEST_SOURCE_KEY, source);
    } catch (_) {}
  }

  function parseCrmBlob (raw) {
    const s = String(raw || '').trim();
    if (!s) return { uf: '', number: '' };
    const m = s.match(/CRM[-\s]*([A-Z]{2})[-\s]*(\d+)/i);
    if (m) return { uf: m[1].toUpperCase(), number: m[2] };
    const m2 = s.match(/^([A-Z]{2})[-\s/]*(\d+)$/i);
    if (m2) return { uf: m2[1].toUpperCase(), number: m2[2] };
    return { uf: '', number: s.replace(/\D/g, '') };
  }

  function normalizeDoctorPayload (raw) {
    if (!raw || typeof raw !== 'object') return null;
    const name = String(
      raw.name || raw.doctorName || raw.nome || raw.rxDisplayName || ''
    ).trim();
    let uf = String(raw.crmUf || raw.uf || raw.crmUF || '').trim().toUpperCase().slice(0, 2);
    let number = String(raw.crmNumber || raw.crm || raw.crmNum || '').trim();

    if (!uf || !/^\d+$/.test(number.replace(/\D/g, '')) || number.match(/[A-Za-z]/)) {
      const parsed = parseCrmBlob(raw.crmFormatted || raw.crmCompleto || raw.crm || number);
      if (parsed.uf) uf = parsed.uf;
      if (parsed.number) number = parsed.number;
    }

    number = String(number).replace(/\D/g, '');
    if (!name && !number) return null;
    return {
      name,
      crmUf: uf || 'SP',
      crmNumber: number
    };
  }

  function applyDoctorProfile (profile, source) {
    const normalized = normalizeDoctorPayload(profile);
    if (!normalized) return false;

    persistGuest(normalized.name, normalized.crmUf, normalized.crmNumber, source || 'partner');
    partnerProfileLocked = source === 'dalucare' || source === 'partner' || source === 'query';

    const nameEl = document.getElementById('embed-guest-name');
    const ufEl = document.getElementById('embed-guest-crm-uf');
    const numEl = document.getElementById('embed-guest-crm-number');
    if (nameEl) nameEl.value = normalized.name;
    if (ufEl) ufEl.value = normalized.crmUf || 'SP';
    if (numEl) numEl.value = normalized.crmNumber;

    updateGuestBarState();
    if (typeof rxUpdateProfileHint === 'function') rxUpdateProfileHint();

    const userEl = document.getElementById('embed-user-name');
    if (userEl && normalized.name) {
      userEl.textContent = normalized.name + (normalized.crmNumber
        ? (' · CRM-' + normalized.crmUf + ' ' + normalized.crmNumber)
        : '');
    }

    embedNotifyHeight();
    return true;
  }

  function updateGuestBarState () {
    const bar = document.getElementById('embed-guest-bar');
    const hint = bar?.querySelector('.embed-guest-hint');
    const nameEl = document.getElementById('embed-guest-name');
    const ufEl = document.getElementById('embed-guest-crm-uf');
    const numEl = document.getElementById('embed-guest-crm-number');
    const imported = partnerProfileLocked && guestName() && guestCrmNumber();

    // Perfil já veio do Dalucare → esconde formulário e libera espaço
    if (bar) bar.hidden = !!imported;

    if (hint) {
      hint.textContent = imported
        ? 'Nome e CRM importados do Dalucare — já entram na receita automaticamente.'
        : 'Preencha nome e CRM para aparecerem na receita (ou importe pelo Dalucare).';
    }

    [nameEl, ufEl, numEl].forEach(el => {
      if (!el) return;
      el.readOnly = !!imported;
      el.disabled = false;
      el.classList.toggle('embed-guest-locked', !!imported);
    });
    if (ufEl) ufEl.disabled = !!imported;
  }

  function saveGuestFields () {
    if (partnerProfileLocked) return;
    const nameEl = document.getElementById('embed-guest-name');
    const ufEl = document.getElementById('embed-guest-crm-uf');
    const numEl = document.getElementById('embed-guest-crm-number');
    persistGuest(
      nameEl ? nameEl.value.trim() : guestName(),
      ufEl ? ufEl.value : guestCrmUf(),
      numEl ? numEl.value : guestCrmNumber(),
      'manual'
    );
    if (typeof rxUpdateProfileHint === 'function') rxUpdateProfileHint();
  }

  function readDoctorFromQuery () {
    try {
      const params = new URLSearchParams(window.location.search || '');
      const payload = {
        name: params.get('doctorName') || params.get('nome') || params.get('name') || '',
        crmUf: params.get('crmUf') || params.get('uf') || '',
        crmNumber: params.get('crmNumber') || params.get('crm') || '',
        crmFormatted: params.get('crmFormatted') || ''
      };
      return normalizeDoctorPayload(payload);
    } catch (_) {
      return null;
    }
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

    const fromQuery = readDoctorFromQuery();
    if (fromQuery) applyDoctorProfile(fromQuery, 'query');
    else {
      if (nameEl) nameEl.value = guestName();
      if (ufEl) ufEl.value = guestCrmUf();
      if (numEl) numEl.value = guestCrmNumber();
      partnerProfileLocked = guestSource() === 'dalucare' || guestSource() === 'partner' || guestSource() === 'query';
      updateGuestBarState();
    }

    [nameEl, ufEl, numEl].forEach(el => {
      el?.addEventListener('input', saveGuestFields);
      el?.addEventListener('change', saveGuestFields);
    });
    if (numEl) {
      numEl.addEventListener('input', () => {
        if (partnerProfileLocked) return;
        numEl.value = numEl.value.replace(/\D/g, '');
        saveGuestFields();
      });
    }
  }

  function onParentMessage (event) {
    if (!isAllowedOrigin(event.origin)) return;
    const data = event.data || {};
    if (data.source !== 'dalucare' && data.source !== 'medhub-partner') return;

    if (data.type === 'doctor-profile' || data.type === 'set-doctor') {
      applyDoctorProfile(data.profile || data.doctor || data, 'dalucare');
      return;
    }

    if (data.type === 'clear-doctor') {
      partnerProfileLocked = false;
      persistGuest('', 'SP', '', '');
      const nameEl = document.getElementById('embed-guest-name');
      const ufEl = document.getElementById('embed-guest-crm-uf');
      const numEl = document.getElementById('embed-guest-crm-number');
      if (nameEl) nameEl.value = '';
      if (ufEl) ufEl.value = 'SP';
      if (numEl) numEl.value = '';
      updateGuestBarState();
      const userEl = document.getElementById('embed-user-name');
      if (userEl) userEl.textContent = 'Acesso Dalucare · sem login';
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
    document.documentElement.classList.add('embed-framed');
    showApp();
    initGuestIdentity();
    window.addEventListener('message', onParentMessage);

    const nameEl = document.getElementById('embed-user-name');
    if (nameEl && !guestName()) nameEl.textContent = 'Acesso Dalucare · sem login';

    if (typeof initReceituario === 'function') initReceituario();
    if (typeof rxOnSectionShow === 'function') rxOnSectionShow();

    bindResizeObserver();
    embedNotifyReady();
    embedNotifyHeight();
    setTimeout(embedNotifyHeight, 400);
    setTimeout(embedNotifyHeight, 1200);
    // Pedir de novo após 1s caso o parent ainda não estivesse pronto
    setTimeout(embedNotifyReady, 1000);
  }

  function boot () {
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
