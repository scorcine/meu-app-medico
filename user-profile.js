/* Perfil do usuário — nome/CRM para receitas, endereço e dados locais */

const MEDHUB_PROFILE_PREFIX = 'medhub-user-profile-';
const MEDHUB_RX_CRM_LEGACY_KEY = 'medhub-rx-crm';

const MEDHUB_CRM_UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

function medhubProfileStorageKey (email) {
  const e = String(email || (typeof getSession === 'function' ? getSession()?.email : '') || 'local')
    .trim().toLowerCase();
  return MEDHUB_PROFILE_PREFIX + e;
}

function medhubDefaultProfile (sessionUser) {
  return {
    rxDisplayName: sessionUser?.name || '',
    crmUf: 'SP',
    crmNumber: '',
    address: '',
    addressCity: '',
    addressState: '',
    addressZip: ''
  };
}

function medhubMigrateLegacyCrm (profile) {
  const legacy = localStorage.getItem(MEDHUB_RX_CRM_LEGACY_KEY);
  if (!legacy || profile.crmNumber) return profile;
  const prefixed = String(legacy).match(/CRM[-\s]*([A-Z]{2})\s*(\d+)/i);
  if (prefixed) {
    profile.crmUf = prefixed[1].toUpperCase();
    profile.crmNumber = prefixed[2];
  } else {
    profile.crmNumber = String(legacy).replace(/\D/g, '');
  }
  return profile;
}

function medhubLoadUserProfile () {
  const user = typeof getSession === 'function' ? getSession() : null;
  const key = medhubProfileStorageKey(user?.email);
  let profile = medhubDefaultProfile(user);
  try {
    const raw = localStorage.getItem(key);
    if (raw) profile = { ...profile, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  profile = medhubMigrateLegacyCrm(profile);
  if (!MEDHUB_CRM_UFS.includes(profile.crmUf)) profile.crmUf = 'SP';
  profile.crmNumber = String(profile.crmNumber || '').replace(/\D/g, '');
  return profile;
}

function medhubSaveUserProfile (updates) {
  const user = typeof getSession === 'function' ? getSession() : null;
  const key = medhubProfileStorageKey(user?.email);
  const current = medhubLoadUserProfile();
  const next = { ...current, ...updates };
  if (next.crmNumber) next.crmNumber = String(next.crmNumber).replace(/\D/g, '');
  if (next.crmUf) next.crmUf = String(next.crmUf).toUpperCase().slice(0, 2);
  localStorage.setItem(key, JSON.stringify(next));
  if (next.crmNumber) {
    localStorage.setItem(MEDHUB_RX_CRM_LEGACY_KEY, next.crmNumber);
  }
  return next;
}

function medhubGetRxDoctorName () {
  const profile = medhubLoadUserProfile();
  const name = (profile.rxDisplayName || '').trim();
  if (name) return name;
  const user = typeof getSession === 'function' ? getSession() : null;
  return (user?.name || '').trim();
}

function medhubGetRxCrmFormatted () {
  const profile = medhubLoadUserProfile();
  const uf = profile.crmUf || 'SP';
  const num = String(profile.crmNumber || '').replace(/\D/g, '');
  return num ? `CRM-${uf} ${num}` : `CRM-${uf} ____________`;
}

function medhubGetProfileAddressBlock () {
  const p = medhubLoadUserProfile();
  const parts = [];
  if (p.address?.trim()) parts.push(p.address.trim());
  const cityLine = [p.addressCity, p.addressState].filter(Boolean).join(' — ');
  if (cityLine) parts.push(cityLine);
  if (p.addressZip?.trim()) parts.push('CEP ' + p.addressZip.trim());
  return parts.join('\n');
}

function medhubProfileBackupKey () {
  const user = typeof getSession === 'function' ? getSession() : null;
  return medhubProfileStorageKey(user?.email);
}

function initUserProfilePage () {
  const section = document.getElementById('section-perfil');
  if (!section || section.dataset.profileBound) return;
  section.dataset.profileBound = '1';

  const user = typeof getSession === 'function' ? getSession() : null;
  const profile = medhubLoadUserProfile();

  const emailEl = document.getElementById('profile-email');
  if (emailEl) emailEl.textContent = user?.email || '—';

  const nameEl = document.getElementById('profile-rx-name');
  const crmUfEl = document.getElementById('profile-crm-uf');
  const crmNumEl = document.getElementById('profile-crm-number');
  const addressEl = document.getElementById('profile-address');
  const cityEl = document.getElementById('profile-address-city');
  const stateEl = document.getElementById('profile-address-state');
  const zipEl = document.getElementById('profile-address-zip');
  const previewEl = document.getElementById('profile-rx-preview');

  if (crmUfEl && !crmUfEl.options.length) {
    MEDHUB_CRM_UFS.forEach(uf => {
      const opt = document.createElement('option');
      opt.value = uf;
      opt.textContent = uf;
      crmUfEl.appendChild(opt);
    });
  }

  if (nameEl) nameEl.value = profile.rxDisplayName || user?.name || '';
  if (crmUfEl) crmUfEl.value = profile.crmUf || 'SP';
  if (crmNumEl) crmNumEl.value = profile.crmNumber || '';
  if (addressEl) addressEl.value = profile.address || '';
  if (cityEl) cityEl.value = profile.addressCity || '';
  if (stateEl) stateEl.value = profile.addressState || '';
  if (zipEl) zipEl.value = profile.addressZip || '';

  function updatePreview () {
    if (!previewEl) return;
    const name = (nameEl?.value || '').trim() || user?.name || '________________';
    const uf = crmUfEl?.value || 'SP';
    const num = (crmNumEl?.value || '').replace(/\D/g, '');
    const crm = num ? `CRM-${uf} ${num}` : `CRM-${uf} ____________`;
    previewEl.textContent = `Dr(a). ${name} · ${crm}`;
  }

  [nameEl, crmUfEl, crmNumEl].forEach(el => {
    el?.addEventListener('input', updatePreview);
    el?.addEventListener('change', updatePreview);
  });
  if (crmNumEl) {
    crmNumEl.addEventListener('input', () => {
      crmNumEl.value = crmNumEl.value.replace(/\D/g, '');
    });
  }
  updatePreview();

  document.getElementById('profile-save-btn')?.addEventListener('click', () => {
    medhubSaveUserProfile({
      rxDisplayName: nameEl?.value?.trim() || '',
      crmUf: crmUfEl?.value || 'SP',
      crmNumber: crmNumEl?.value?.replace(/\D/g, '') || '',
      address: addressEl?.value?.trim() || '',
      addressCity: cityEl?.value?.trim() || '',
      addressState: (stateEl?.value || '').toUpperCase().slice(0, 2),
      addressZip: zipEl?.value?.trim() || ''
    });
    const status = document.getElementById('profile-save-status');
    if (status) {
      status.hidden = false;
      status.textContent = 'Dados profissionais salvos.';
      status.className = 'anamnese-save-status anamnese-save-status--ok';
    }
    updatePreview();
  });

  if (user && typeof initBillingPanel === 'function') initBillingPanel(user);
}

function medhubOpenUserProfile () {
  if (typeof showSection === 'function') showSection('perfil');
}

function initUserProfileHeader () {
  const btn = document.getElementById('user-menu-btn');
  if (!btn || btn.dataset.bound) return;
  btn.dataset.bound = '1';
  btn.addEventListener('click', medhubOpenUserProfile);
}
