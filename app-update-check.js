/* MedHub — aviso de nova versão publicada.
   O app é uma página única: sem recarregar, o navegador continua com o HTML antigo
   e as novidades publicadas não aparecem. Aqui comparamos o build do servidor. */

const MEDHUB_UPDATE_CHECK_INTERVAL = 5 * 60 * 1000;
let medhubUpdateToastShown = false;

function medhubCurrentBuild () {
  return document.querySelector('meta[name="medhub-build"]')?.content || '';
}

async function medhubFetchPublishedBuild () {
  const response = await fetch('app.html?build-check=' + Date.now(), { cache: 'no-store' });
  if (!response.ok) return '';
  const html = await response.text();
  return html.match(/name="medhub-build"\s+content="([^"]+)"/)?.[1] || '';
}

function medhubShowUpdateToast () {
  if (medhubUpdateToastShown || document.getElementById('medhub-update-toast')) return;
  medhubUpdateToastShown = true;

  const toast = document.createElement('div');
  toast.id = 'medhub-update-toast';
  toast.className = 'medhub-update-toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `
    <div>
      <strong>Nova versão do MedHub disponível</strong>
      <span>Atualize para carregar as últimas melhorias.</span>
    </div>
    <div class="medhub-update-toast-actions">
      <button type="button" id="medhub-update-now">Atualizar agora</button>
      <button type="button" id="medhub-update-later" aria-label="Fechar aviso">×</button>
    </div>`;
  document.body.appendChild(toast);

  document.getElementById('medhub-update-now')?.addEventListener('click', medhubApplyUpdate);
  document.getElementById('medhub-update-later')?.addEventListener('click', () => toast.remove());
}

async function medhubApplyUpdate () {
  try {
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map(key => caches.delete(key)));
    }
    const registrations = await navigator.serviceWorker?.getRegistrations?.();
    await Promise.all((registrations || []).map(reg => reg.update()));
  } catch { /* atualiza mesmo se a limpeza falhar */ }
  window.location.replace('app.html?atualizado=' + Date.now());
}

async function medhubCheckForUpdate () {
  const current = medhubCurrentBuild();
  if (!current || medhubUpdateToastShown) return;

  try {
    const published = await medhubFetchPublishedBuild();
    if (published && published !== current) medhubShowUpdateToast();
  } catch { /* offline: tenta de novo no próximo ciclo */ }
}

function initMedhubUpdateCheck () {
  if (!medhubCurrentBuild()) return;
  window.setTimeout(medhubCheckForUpdate, 4000);
  window.setInterval(medhubCheckForUpdate, MEDHUB_UPDATE_CHECK_INTERVAL);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') medhubCheckForUpdate();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMedhubUpdateCheck);
} else {
  initMedhubUpdateCheck();
}
