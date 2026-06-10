/* Termo de uso, avisos legais e desbloqueio de dados criptografados */

const MEDHUB_TERMS_VERSION = '2026-06-07-v1';

const MEDHUB_TERMS_HTML = `
  <h2 id="medhub-terms-title">Termo de uso e aviso legal</h2>
  <div class="compliance-terms-body">
    <p><strong>MedHub é uma ferramenta educacional</strong> de apoio à decisão clínica. Ela <strong>não substitui</strong> julgamento médico, bula, protocolo institucional, segunda opinião nem <strong>prontuário legal</strong> exigido por lei, conselho profissional ou operadora.</p>
    <ul>
      <li>Revise sempre prescrições, condutas e textos gerados antes de usar com pacientes.</li>
      <li>Não use o app como único registro assistencial em serviços que exigem prontuário certificado.</li>
      <li>Conteúdos de protocolos são referências resumidas — podem estar desatualizados ou incompletos.</li>
    </ul>
    <p><strong>Dados e privacidade (uso local):</strong></p>
    <ul>
      <li>Contas e anamneses ficam <strong>no seu navegador/dispositivo</strong>, sem servidor MedHub.</li>
      <li>Senhas são armazenadas com hash (PBKDF2); anamneses salvas são <strong>criptografadas localmente</strong> com chave derivada da sua senha.</li>
      <li>Quem tiver acesso físico ao dispositivo desbloqueado ou à sua senha pode ler os dados. Evite identificadores desnecessários se não houver base legal e política institucional.</li>
      <li>Envio ao Google Drive (opcional) segue as políticas do Google e da sua instituição — você é responsável pela configuração OAuth.</li>
    </ul>
    <p>Ao continuar, você declara ter lido e aceito estes termos na versão ${MEDHUB_TERMS_VERSION}.</p>
  </div>
`;

function medhubTermsStorageKey (email) {
  return 'medhub-terms-' + String(email || '').toLowerCase();
}

function medhubHasAcceptedTerms (email) {
  return localStorage.getItem(medhubTermsStorageKey(email)) === MEDHUB_TERMS_VERSION;
}

function medhubAcceptTerms (email) {
  localStorage.setItem(medhubTermsStorageKey(email), MEDHUB_TERMS_VERSION);
}

function medhubEnsureTermsModal () {
  if (document.getElementById('medhub-compliance-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'medhub-compliance-overlay';
  overlay.className = 'compliance-overlay';
  overlay.hidden = true;
  overlay.innerHTML = `
    <div class="compliance-modal" role="dialog" aria-modal="true" aria-labelledby="medhub-terms-title">
      <div class="compliance-modal-scroll">${MEDHUB_TERMS_HTML}</div>
      <label class="compliance-check">
        <input type="checkbox" id="medhub-terms-check">
        Li e aceito o termo de uso e aviso legal acima.
      </label>
      <div class="compliance-modal-actions">
        <button type="button" class="btn" id="medhub-terms-accept" disabled>Continuar</button>
        <button type="button" class="btn-outline" id="medhub-terms-decline">Sair</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const check = overlay.querySelector('#medhub-terms-check');
  const acceptBtn = overlay.querySelector('#medhub-terms-accept');
  check.addEventListener('change', () => {
    acceptBtn.disabled = !check.checked;
  });
}

function medhubShowTermsModal (onAccept, onDecline) {
  medhubEnsureTermsModal();
  const overlay = document.getElementById('medhub-compliance-overlay');
  const check = overlay.querySelector('#medhub-terms-check');
  const acceptBtn = overlay.querySelector('#medhub-terms-accept');
  const declineBtn = overlay.querySelector('#medhub-terms-decline');

  check.checked = false;
  acceptBtn.disabled = true;
  overlay.hidden = false;
  document.body.classList.add('compliance-modal-open');
  check.focus();

  overlay.querySelector('#medhub-terms-accept').onclick = () => {
    if (!check.checked) return;
    overlay.hidden = true;
    document.body.classList.remove('compliance-modal-open');
    if (typeof onAccept === 'function') onAccept();
  };

  overlay.querySelector('#medhub-terms-decline').onclick = () => {
    overlay.hidden = true;
    document.body.classList.remove('compliance-modal-open');
    if (typeof onDecline === 'function') onDecline();
    else if (typeof onAccept === 'function') {
      if (typeof logout === 'function') logout();
      else window.location.href = 'login.html';
    }
  };
}

function medhubRequireTerms (next) {
  const user = typeof getSession === 'function' ? getSession() : null;
  if (!user) return;
  if (medhubHasAcceptedTerms(user.email)) {
    if (typeof next === 'function') next();
    return;
  }
  medhubShowTermsModal(() => {
    medhubAcceptTerms(user.email);
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
      <p class="muted">Suas anamneses são criptografadas. Informe sua senha para continuar nesta sessão do navegador.</p>
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
      ? getUsers().find(u => u.email === user.email)
      : null;
    if (!account || !(await medhubVerifyPassword(password, account))) {
      errEl.textContent = 'Senha incorreta.';
      errEl.hidden = false;
      return;
    }
    await medhubUnlockSession(password, user.email);
    finish();
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
  medhubEnsureTermsModal();
  medhubEnsureUnlockModal();
}
