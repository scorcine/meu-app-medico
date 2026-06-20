(function () {
  var DISMISS_KEY = 'medhub-pwa-install-dismissed';
  var SIGNUP_KEY = 'medhub-pwa-after-signup';
  var deferredPrompt = null;

  function isStandalone () {
    return window.matchMedia('(display-mode: standalone)').matches
      || window.navigator.standalone === true;
  }

  function isIosSafari () {
    var ua = window.navigator.userAgent || '';
    var isIos = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    if (!isIos) return false;
    return !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);
  }

  function isMobileViewport () {
    return window.matchMedia('(max-width: 900px)').matches;
  }

  function isAppPage () {
    var path = window.location.pathname || '';
    return /(^|\/)app\.html$/i.test(path);
  }

  function wasDismissed () {
    try {
      return localStorage.getItem(DISMISS_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function dismissBanner () {
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch (e) { /* ignore */ }
    hideBanner();
    hideSignupModal();
  }

  function hideBanner () {
    var banner = document.getElementById('pwa-install-banner');
    if (banner) banner.hidden = true;
  }

  function hideSignupModal () {
    var modal = document.getElementById('pwa-signup-modal');
    if (modal) modal.hidden = true;
  }

  function ensureBanner () {
    if (document.getElementById('pwa-install-banner')) return;

    var banner = document.createElement('aside');
    banner.id = 'pwa-install-banner';
    banner.className = 'pwa-install-banner';
    banner.hidden = true;
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Instalar MedHub');
    banner.innerHTML = ''
      + '<div class="pwa-install-banner-inner">'
      + '  <img src="/assets/icons/icon-192.png?v=icon-v2" alt="" class="pwa-install-banner-icon" width="48" height="48">'
      + '  <div class="pwa-install-banner-copy">'
      + '    <strong id="pwa-install-banner-title">Instalar MedHub</strong>'
      + '    <span id="pwa-install-banner-detail">Abra em tela cheia, como um app no plantão.</span>'
      + '  </div>'
      + '  <div class="pwa-install-banner-actions">'
      + '    <button type="button" class="btn pwa-install-banner-cta" id="pwa-install-btn">Instalar</button>'
      + '    <button type="button" class="btn-outline pwa-install-banner-later" id="pwa-install-later">Agora não</button>'
      + '    <button type="button" class="pwa-install-banner-dismiss" id="pwa-install-dismiss" aria-label="Fechar">&times;</button>'
      + '  </div>'
      + '</div>';

    document.body.appendChild(banner);

    document.getElementById('pwa-install-btn')?.addEventListener('click', triggerNativeInstall);
    document.getElementById('pwa-install-later')?.addEventListener('click', dismissBanner);
    document.getElementById('pwa-install-dismiss')?.addEventListener('click', dismissBanner);
  }

  function ensureSignupModal () {
    if (document.getElementById('pwa-signup-modal')) return;

    var modal = document.createElement('div');
    modal.id = 'pwa-signup-modal';
    modal.className = 'pwa-signup-modal';
    modal.hidden = true;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'pwa-signup-modal-title');
    modal.innerHTML = ''
      + '<div class="pwa-signup-modal-backdrop" id="pwa-signup-modal-backdrop"></div>'
      + '<div class="pwa-signup-modal-card card">'
      + '  <img src="/assets/icons/icon-192.png?v=icon-v2" alt="" class="pwa-signup-modal-icon" width="72" height="72">'
      + '  <p class="pwa-signup-modal-badge">Conta criada</p>'
      + '  <h2 id="pwa-signup-modal-title">Instale o MedHub no celular</h2>'
      + '  <p id="pwa-signup-modal-detail" class="pwa-signup-modal-detail">'
      + '    Tenha o ícone na tela inicial e abra direto no plantão, em tela cheia.'
      + '  </p>'
      + '  <ol id="pwa-signup-modal-steps" class="pwa-signup-modal-steps" hidden></ol>'
      + '  <div class="pwa-signup-modal-actions">'
      + '    <button type="button" class="btn pwa-signup-modal-install" id="pwa-signup-install-btn">Instalar app</button>'
      + '    <button type="button" class="btn-outline pwa-signup-modal-later" id="pwa-signup-later-btn">Continuar no navegador</button>'
      + '  </div>'
      + '</div>';

    document.body.appendChild(modal);

    document.getElementById('pwa-signup-install-btn')?.addEventListener('click', triggerNativeInstall);
    document.getElementById('pwa-signup-later-btn')?.addEventListener('click', dismissBanner);
    document.getElementById('pwa-signup-modal-backdrop')?.addEventListener('click', dismissBanner);
  }

  function getInstallMode () {
    if (deferredPrompt) return 'native';
    if (isIosSafari() && isMobileViewport()) return 'ios';
    if (/Android/i.test(navigator.userAgent || '')) return 'android-manual';
    return 'desktop';
  }

  function updateInstallUi () {
    var mode = getInstallMode();
    var stepsEl = document.getElementById('pwa-signup-modal-steps');
    var detailEl = document.getElementById('pwa-signup-modal-detail');
    var installBtn = document.getElementById('pwa-signup-install-btn')
      || document.getElementById('pwa-install-btn');

    if (stepsEl) {
      stepsEl.hidden = mode !== 'ios';
      if (mode === 'ios') {
        stepsEl.innerHTML = ''
          + '<li>Toque em <strong>Compartilhar</strong> (ícone □↑) na barra do Safari</li>'
          + '<li>Role e toque em <strong>Adicionar à Tela de Início</strong></li>'
          + '<li>Confirme em <strong>Adicionar</strong></li>';
      }
    }

    if (detailEl) {
      if (mode === 'ios') {
        detailEl.textContent = 'No iPhone, siga estes passos para ter o MedHub como app na home:';
      } else if (mode === 'android-manual') {
        detailEl.textContent = 'No Chrome: menu ⋮ → Instalar app (ou Adicionar à tela inicial).';
      } else if (mode === 'desktop') {
        detailEl.textContent = 'No celular, abra medhub.ia.br/app.html e instale pela opção do navegador.';
      } else {
        detailEl.textContent = 'Tenha o ícone na tela inicial e abra direto no plantão, em tela cheia.';
      }
    }

    if (installBtn) {
      if (mode === 'ios') {
        installBtn.textContent = 'Entendi, vou adicionar';
      } else if (mode === 'native') {
        installBtn.textContent = 'Instalar agora';
      } else {
        installBtn.textContent = 'Ok, entendi';
      }
    }
  }

  function triggerNativeInstall () {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function () {
        deferredPrompt = null;
        dismissBanner();
      }).catch(function () {
        deferredPrompt = null;
      });
      return;
    }
    dismissBanner();
  }

  function showBanner (mode) {
    if (isStandalone() || wasDismissed()) return;

    ensureBanner();
    updateInstallUi();

    var banner = document.getElementById('pwa-install-banner');
    var title = document.getElementById('pwa-install-banner-title');
    var detail = document.getElementById('pwa-install-banner-detail');

    if (!banner || !title || !detail) return;

    if (mode === 'ios') {
      title.textContent = 'Adicionar MedHub à Tela de Início';
      detail.textContent = 'No Safari: Compartilhar (□↑) → Adicionar à Tela de Início.';
    } else {
      title.textContent = 'Instalar MedHub';
      detail.textContent = 'Ícone na home, abre em tela cheia — ideal no plantão.';
    }

    banner.hidden = false;
  }

  function showSignupModal () {
    if (isStandalone()) return;

    ensureSignupModal();
    updateInstallUi();

    var modal = document.getElementById('pwa-signup-modal');
    if (modal) modal.hidden = false;
  }

  function takeSignupPrompt () {
    if (typeof medhubTakePwaAfterSignup === 'function') {
      return medhubTakePwaAfterSignup();
    }
    try {
      if (sessionStorage.getItem(SIGNUP_KEY) === '1') {
        sessionStorage.removeItem(SIGNUP_KEY);
        return true;
      }
    } catch (e) { /* ignore */ }
    return false;
  }

  function maybeShowSignupPrompt () {
    if (!isAppPage() || isStandalone()) return;
    if (!takeSignupPrompt()) return;
    window.setTimeout(showSignupModal, 400);
  }

  window.medhubTryPwaSignupPrompt = maybeShowSignupPrompt;

  window.medhubPromptPwaInstall = function (options) {
    if (options && options.signup) {
      showSignupModal();
      return;
    }
    showBanner(getInstallMode() === 'ios' ? 'ios' : 'android');
  };

  function registerServiceWorker () {
    if (!('serviceWorker' in navigator)) return;
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function () { /* offline ok */ });
    });
  }

  function initPwaInstall () {
    if (isStandalone()) return;

    window.addEventListener('beforeinstallprompt', function (event) {
      event.preventDefault();
      deferredPrompt = event;
      updateInstallUi();
      var signupModal = document.getElementById('pwa-signup-modal');
      if (signupModal && !signupModal.hidden) return;
      if (!wasDismissed()) showBanner('android');
    });

    if (!wasDismissed() && isIosSafari() && isMobileViewport() && !isAppPage()) {
      window.setTimeout(function () {
        showBanner('ios');
      }, 4000);
    }

    maybeShowSignupPrompt();
  }

  registerServiceWorker();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPwaInstall);
  } else {
    initPwaInstall();
  }
})();
