/* Termo de uso, política de privacidade e desbloqueio de dados criptografados */

function medhubLegalVersions () {
  return {
    terms: typeof MEDHUB_TERMS_VERSION !== 'undefined' ? MEDHUB_TERMS_VERSION : '2026-06-07-v2',
    privacy: typeof MEDHUB_PRIVACY_VERSION !== 'undefined' ? MEDHUB_PRIVACY_VERSION : '2026-06-07-v2'
  };
}

function medhubTermsStorageKey (email) {
  return 'medhub-terms-' + String(email || '').toLowerCase();
}

function medhubPrivacyStorageKey (email) {
  return 'medhub-privacy-' + String(email || '').toLowerCase();
}

function medhubLegalAcceptedKey (email) {
  return 'medhub-legal-accepted-' + String(email || '').toLowerCase();
}

function medhubHasAcceptedTerms (email) {
  const stored = localStorage.getItem(medhubTermsStorageKey(email));
  if (!stored) return false;
  if (localStorage.getItem(medhubLegalAcceptedKey(email)) === '1') return true;
  const v = medhubLegalVersions();
  return stored === v.terms;
}

function medhubHasAcceptedPrivacy (email) {
  const stored = localStorage.getItem(medhubPrivacyStorageKey(email));
  if (!stored) return false;
  if (localStorage.getItem(medhubLegalAcceptedKey(email)) === '1') return true;
  const v = medhubLegalVersions();
  return stored === v.privacy;
}

function medhubHasAcceptedLegal (email) {
  if (localStorage.getItem(medhubLegalAcceptedKey(email)) === '1') return true;
  const terms = localStorage.getItem(medhubTermsStorageKey(email));
  const privacy = localStorage.getItem(medhubPrivacyStorageKey(email));
  if (terms && privacy) return true;
  return medhubHasAcceptedTerms(email) && medhubHasAcceptedPrivacy(email);
}

function medhubAcceptLegalLocal (email, config) {
  const v = config || medhubLegalVersions();
  const norm = String(email || '').toLowerCase();
  if (!norm) return;
  localStorage.setItem(medhubTermsStorageKey(norm), v.terms || v.termsVersion || medhubLegalVersions().terms);
  localStorage.setItem(medhubPrivacyStorageKey(norm), v.privacy || v.privacyVersion || medhubLegalVersions().privacy);
  localStorage.setItem(medhubLegalAcceptedKey(norm), '1');
}

function medhubAcceptTerms (email) {
  medhubAcceptLegalLocal(email, medhubLegalVersions());
}

const MEDHUB_LEGAL_MODAL_HTML = `
  <h2 id="medhub-legal-title">Termos e privacidade</h2>
  <div class="compliance-terms-body">
    <p>Para usar o MedHub, leia e aceite:</p>
    <ul>
      <li><a href="termos.html" target="_blank" rel="noopener">Termo de uso e aviso legal</a></li>
      <li><a href="privacidade.html" target="_blank" rel="noopener">Política de privacidade (LGPD)</a></li>
    </ul>
    <p><strong>Resumo:</strong> ferramenta educacional; dados clínicos ficam criptografados no seu dispositivo; conta e assinatura usam e-mail na nuvem.</p>
  </div>
`;

function medhubEnsureLegalModal () {
  if (document.getElementById('medhub-compliance-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'medhub-compliance-overlay';
  overlay.className = 'compliance-overlay';
  overlay.hidden = true;
  overlay.innerHTML = `
    <div class="compliance-modal" role="dialog" aria-modal="true" aria-labelledby="medhub-legal-title">
      <div class="compliance-modal-scroll">${MEDHUB_LEGAL_MODAL_HTML}</div>
      <label class="compliance-check">
        <input type="checkbox" id="medhub-terms-check">
        Li e aceito o <a href="termos.html" target="_blank" rel="noopener">termo de uso</a>.
      </label>
      <label class="compliance-check">
        <input type="checkbox" id="medhub-privacy-check">
        Li e aceito a <a href="privacidade.html" target="_blank" rel="noopener">política de privacidade</a>.
      </label>
      <div class="compliance-modal-actions">
        <button type="button" class="btn" id="medhub-legal-accept" disabled>Continuar</button>
        <button type="button" class="btn-outline" id="medhub-legal-decline">Sair</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const termsCheck = overlay.querySelector('#medhub-terms-check');
  const privacyCheck = overlay.querySelector('#medhub-privacy-check');
  const acceptBtn = overlay.querySelector('#medhub-legal-accept');

  const syncAccept = () => {
    acceptBtn.disabled = !(termsCheck.checked && privacyCheck.checked);
  };
  termsCheck.addEventListener('change', syncAccept);
  privacyCheck.addEventListener('change', syncAccept);
}

function medhubShowLegalModal (onAccept, onDecline) {
  medhubEnsureLegalModal();
  const overlay = document.getElementById('medhub-compliance-overlay');
  const termsCheck = overlay.querySelector('#medhub-terms-check');
  const privacyCheck = overlay.querySelector('#medhub-privacy-check');
  const acceptBtn = overlay.querySelector('#medhub-legal-accept');

  termsCheck.checked = false;
  privacyCheck.checked = false;
  acceptBtn.disabled = true;
  overlay.hidden = false;
  document.body.classList.add('compliance-modal-open');
  termsCheck.focus();

  acceptBtn.onclick = () => {
    if (!termsCheck.checked || !privacyCheck.checked) return;
    overlay.hidden = true;
    document.body.classList.remove('compliance-modal-open');
    if (typeof onAccept === 'function') onAccept();
  };

  overlay.querySelector('#medhub-legal-decline').onclick = () => {
    overlay.hidden = true;
    document.body.classList.remove('compliance-modal-open');
    if (typeof onDecline === 'function') onDecline();
    else if (typeof logout === 'function') logout();
    else window.location.href = 'login.html';
  };
}

function medhubShowTermsModal (onAccept, onDecline) {
  medhubShowLegalModal(onAccept, onDecline);
}

function medhubRequireTerms (next) {
  const user = typeof getSession === 'function' ? getSession() : null;
  if (!user) return;

  if (medhubHasAcceptedLegal(user.email)) {
    if (typeof next === 'function') next();
    return;
  }

  medhubShowLegalModal(async () => {
    const config = typeof medhubFetchAuthConfig === 'function'
      ? await medhubFetchAuthConfig()
      : medhubLegalVersions();

    if (config.cloudEnabled && typeof medhubCloudAcceptLegal === 'function') {
      await medhubCloudAcceptLegal();
    }

    medhubAcceptLegalLocal(user.email, config);
    if (typeof next === 'function') next();
  });
}

function medhubEnsureUnlockModal () {
  if (document.getElementById('medhub-unlock-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'medhub-unlock-overlay';
  overlay.className = 'compliance-overlay';
  overlay.hidden = true;
  overlay.innerHTML = `
    <div class="compliance-modal compliance-modal--narrow" role="dialog" aria-modal="true" aria-labelledby="medhub-unlock-title">
      <h2 id="medhub-unlock-title">Desbloquear dados locais</h2>
      <p class="muted">Suas notas locais são criptografadas. Informe sua senha para continuar nesta sessão do navegador.</p>
      <label class="compliance-label" for="medhub-unlock-pass">Senha</label>
      <input id="medhub-unlock-pass" class="compliance-input" type="password" autocomplete="current-password">
      <p id="medhub-unlock-error" class="compliance-error" hidden></p>
      <div class="compliance-modal-actions">
        <button type="button" class="btn" id="medhub-unlock-submit">Desbloquear</button>
        <button type="button" class="btn-outline" id="medhub-unlock-logout">Sair</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
}

function medhubEnsureCryptoUnlock (next) {
  if (typeof medhubHasSessionCryptoKey === 'function' && medhubHasSessionCryptoKey()) {
    if (typeof next === 'function') next();
    if (typeof medhubCloudSyncAfterUnlock === 'function') {
      medhubCloudSyncAfterUnlock();
    }
    return;
  }

  medhubEnsureUnlockModal();
  const overlay = document.getElementById('medhub-unlock-overlay');
  const passInput = overlay.querySelector('#medhub-unlock-pass');
  const errEl = overlay.querySelector('#medhub-unlock-error');
  const submitBtn = overlay.querySelector('#medhub-unlock-submit');
  const logoutBtn = overlay.querySelector('#medhub-unlock-logout');

  passInput.value = '';
  errEl.hidden = true;
  overlay.hidden = false;
  document.body.classList.add('compliance-modal-open');
  passInput.focus();

  const finish = () => {
    overlay.hidden = true;
    document.body.classList.remove('compliance-modal-open');
  };

  const tryUnlock = async () => {
    errEl.hidden = true;
    const user = typeof getSession === 'function' ? getSession() : null;
    if (!user) {
      window.location.href = 'login.html';
      return;
    }
    const password = passInput.value;
    if (!password) {
      errEl.textContent = 'Informe sua senha.';
      errEl.hidden = false;
      return;
    }

    const account = typeof getUsers === 'function'
      ? getUsers().find(u => authNormalizedEmail(u.email) === authNormalizedEmail(user.email))
      : null;

    let passwordOk = false;
    if (account) {
      passwordOk = await medhubVerifyPassword(password, account);
    } else if (typeof medhubCloudVerifyPassword === 'function') {
      passwordOk = await medhubCloudVerifyPassword(user.email, password);
    }

    if (!passwordOk) {
      errEl.textContent = 'Senha incorreta.';
      errEl.hidden = false;
      return;
    }

    await medhubUnlockSession(password, user.email);
    finish();
    if (typeof medhubCloudSyncAfterUnlock === 'function') {
      medhubCloudSyncAfterUnlock();
    }
    if (typeof next === 'function') next();
  };

  submitBtn.onclick = tryUnlock;
  passInput.onkeydown = e => { if (e.key === 'Enter') tryUnlock(); };
  logoutBtn.onclick = () => {
    finish();
    if (typeof logout === 'function') logout();
    else window.location.href = 'login.html';
  };
}

function medhubInitComplianceShell () {
  medhubEnsureLegalModal();
  medhubEnsureUnlockModal();
}
