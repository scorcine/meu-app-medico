(function () {
  var DISMISS_KEY = 'medhub-pwa-install-dismissed';
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
  }

  function hideBanner () {
    var banner = document.getElementById('pwa-install-banner');
    if (banner) banner.hidden = true;
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
      + '  <img src="/assets/icons/icon-192.png" alt="" class="pwa-install-banner-icon" width="48" height="48">'
      + '  <div class="pwa-install-banner-copy">'
      + '    <strong id="pwa-install-banner-title">Instalar MedHub</strong>'
      + '    <span id="pwa-install-banner-detail">Abra em tela cheia, como um app no plantão.</span>'
      + '  </div>'
      + '  <div class="pwa-install-banner-actions">'
      + '    <button type="button" class="btn pwa-install-banner-cta" id="pwa-install-btn">Instalar</button>'
      + '    <button type="button" class="pwa-install-banner-dismiss" id="pwa-install-dismiss" aria-label="Fechar">&times;</button>'
      + '  </div>'
      + '</div>';

    document.body.appendChild(banner);

    var installBtn = document.getElementById('pwa-install-btn');
    var dismissBtn = document.getElementById('pwa-install-dismiss');

    if (installBtn) {
      installBtn.addEventListener('click', function () {
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
      });
    }

    if (dismissBtn) {
      dismissBtn.addEventListener('click', dismissBanner);
    }
  }

  function showBanner (mode) {
    if (isStandalone() || wasDismissed()) return;

    ensureBanner();

    var banner = document.getElementById('pwa-install-banner');
    var title = document.getElementById('pwa-install-banner-title');
    var detail = document.getElementById('pwa-install-banner-detail');
    var installBtn = document.getElementById('pwa-install-btn');

    if (!banner || !title || !detail || !installBtn) return;

    if (mode === 'ios') {
      title.textContent = 'Adicionar MedHub à Tela de Início';
      detail.textContent = 'No Safari: toque em Compartilhar (□↑) e depois em Adicionar à Tela de Início.';
      installBtn.textContent = 'Entendi';
      installBtn.classList.add('pwa-install-banner-cta--ghost');
    } else {
      title.textContent = 'Instalar MedHub';
      detail.textContent = 'Ícone na home, abre em tela cheia — ideal no plantão.';
      installBtn.textContent = 'Instalar';
      installBtn.classList.remove('pwa-install-banner-cta--ghost');
    }

    banner.hidden = false;
  }

  function registerServiceWorker () {
    if (!('serviceWorker' in navigator)) return;
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function () { /* offline ok */ });
    });
  }

  function initPwaInstall () {
    if (isStandalone() || wasDismissed()) return;

    window.addEventListener('beforeinstallprompt', function (event) {
      event.preventDefault();
      deferredPrompt = event;
      showBanner('android');
    });

    if (isIosSafari() && isMobileViewport()) {
      window.setTimeout(function () {
        showBanner('ios');
      }, 4000);
    }
  }

  registerServiceWorker();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPwaInstall);
  } else {
    initPwaInstall();
  }
})();
