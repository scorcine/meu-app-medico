/* Google Drive — OAuth (GIS) e upload de arquivos */

const MEDHUB_GDRIVE_CLIENT_KEY = 'medhub-gdrive-client-id';
const MEDHUB_GDRIVE_TOKEN_KEY = 'medhub-gdrive-token';
const MEDHUB_GDRIVE_AUTO_KEY = 'medhub-gdrive-auto-upload';

let gdriveTokenClient = null;

function gdriveGetClientId () {
  return (localStorage.getItem(MEDHUB_GDRIVE_CLIENT_KEY) || '').trim();
}

function gdriveSetClientId (id) {
  localStorage.setItem(MEDHUB_GDRIVE_CLIENT_KEY, (id || '').trim());
}

function gdriveIsAutoUpload () {
  return localStorage.getItem(MEDHUB_GDRIVE_AUTO_KEY) !== '0';
}

function gdriveSetAutoUpload (enabled) {
  localStorage.setItem(MEDHUB_GDRIVE_AUTO_KEY, enabled ? '1' : '0');
}

function gdriveGetStoredToken () {
  try {
    const raw = sessionStorage.getItem(MEDHUB_GDRIVE_TOKEN_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data.access_token || !data.expires_at) return null;
    if (Date.now() >= data.expires_at - 60000) return null;
    return data.access_token;
  } catch {
    return null;
  }
}

function gdriveStoreToken (response) {
  if (!response.access_token) return;
  sessionStorage.setItem(MEDHUB_GDRIVE_TOKEN_KEY, JSON.stringify({
    access_token: response.access_token,
    expires_at: Date.now() + (response.expires_in || 3600) * 1000
  }));
}

function gdriveClearToken () {
  sessionStorage.removeItem(MEDHUB_GDRIVE_TOKEN_KEY);
}

function gdriveEnsureGisLoaded () {
  return new Promise((resolve, reject) => {
    if (window.google && google.accounts && google.accounts.oauth2) {
      resolve();
      return;
    }
    const existing = document.querySelector('script[data-medhub-gis]');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Falha ao carregar Google Identity Services.')));
      return;
    }
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.defer = true;
    s.dataset.medhubGis = '1';
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Falha ao carregar Google Identity Services.'));
    document.head.appendChild(s);
  });
}

function gdriveInitTokenClient (clientId) {
  return gdriveEnsureGisLoaded().then(() => {
    gdriveTokenClient = google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'https://www.googleapis.com/auth/drive.file',
      callback: () => {}
    });
  });
}

function gdriveRequestAccess (interactive) {
  const clientId = gdriveGetClientId();
  if (!clientId) {
    return Promise.reject(new Error('Informe o Client ID do Google Cloud na seção Anamnese → Google Drive.'));
  }

  const cached = gdriveGetStoredToken();
  if (cached) return Promise.resolve(cached);

  return gdriveInitTokenClient(clientId).then(() => new Promise((resolve, reject) => {
    gdriveTokenClient.callback = (response) => {
      if (response.error) {
        reject(new Error(response.error_description || response.error));
        return;
      }
      gdriveStoreToken(response);
      resolve(response.access_token);
    };
    gdriveTokenClient.requestAccessToken({ prompt: interactive ? 'consent' : '' });
  }));
}

async function gdriveUploadTextFile (filename, content, accessToken) {
  const metadata = { name: filename, mimeType: 'text/plain; charset=UTF-8' };
  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', new Blob([content], { type: 'text/plain;charset=UTF-8' }));

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + accessToken },
    body: form
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Erro ao enviar para o Google Drive.');
  }
  return res.json();
}

async function gdriveUploadAnamnese (filename, content) {
  const token = await gdriveRequestAccess(false);
  return gdriveUploadTextFile(filename, content, token);
}

function gdriveDisconnect () {
  gdriveClearToken();
  if (window.google && google.accounts && google.accounts.oauth2) {
    const token = gdriveGetStoredToken();
    if (token) google.accounts.oauth2.revoke(token, () => {});
  }
}

function gdriveUpdateStatusUI () {
  const statusEl = document.getElementById('anamnese-drive-status');
  const connectBtn = document.getElementById('anamnese-drive-connect');
  if (!statusEl) return;

  const clientId = gdriveGetClientId();
  const token = gdriveGetStoredToken();

  if (!clientId) {
    statusEl.textContent = 'Configure o Client ID do Google Cloud para habilitar envio ao Drive.';
    statusEl.className = 'anamnese-drive-status anamnese-drive-status--idle';
    if (connectBtn) connectBtn.textContent = 'Conectar Google Drive';
    return;
  }

  if (token) {
    statusEl.textContent = 'Google Drive conectado — anamneses serão enviadas automaticamente ao salvar.';
    statusEl.className = 'anamnese-drive-status anamnese-drive-status--ok';
    if (connectBtn) connectBtn.textContent = 'Reconectar Drive';
    return;
  }

  statusEl.textContent = 'Client ID salvo. Clique em conectar e autorize o acesso ao Drive.';
  statusEl.className = 'anamnese-drive-status anamnese-drive-status--idle';
  if (connectBtn) connectBtn.textContent = 'Conectar Google Drive';
}

async function gdriveConnectFromUI () {
  const input = document.getElementById('anamnese-gdrive-client-id');
  if (input) gdriveSetClientId(input.value.trim());

  try {
    await gdriveRequestAccess(true);
    gdriveUpdateStatusUI();
    alert('Google Drive conectado com sucesso!');
  } catch (err) {
    alert(err.message || 'Não foi possível conectar ao Google Drive.');
  }
}

function gdriveSaveSettingsFromUI () {
  const input = document.getElementById('anamnese-gdrive-client-id');
  const autoCheck = document.getElementById('anamnese-gdrive-auto');
  if (input) gdriveSetClientId(input.value.trim());
  if (autoCheck) gdriveSetAutoUpload(autoCheck.checked);
  gdriveUpdateStatusUI();
}

function initGoogleDriveUI () {
  const input = document.getElementById('anamnese-gdrive-client-id');
  const autoCheck = document.getElementById('anamnese-gdrive-auto');
  const connectBtn = document.getElementById('anamnese-drive-connect');
  const disconnectBtn = document.getElementById('anamnese-drive-disconnect');
  const saveSettingsBtn = document.getElementById('anamnese-gdrive-save-settings');

  if (input) input.value = gdriveGetClientId();
  if (autoCheck) autoCheck.checked = gdriveIsAutoUpload();

  if (connectBtn) connectBtn.addEventListener('click', gdriveConnectFromUI);
  if (disconnectBtn) disconnectBtn.addEventListener('click', () => {
    gdriveDisconnect();
    gdriveUpdateStatusUI();
  });
  if (saveSettingsBtn) saveSettingsBtn.addEventListener('click', () => {
    gdriveSaveSettingsFromUI();
    alert('Configurações salvas.');
  });

  gdriveUpdateStatusUI();
}
