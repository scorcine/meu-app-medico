/* Perfil do usuário — nome/CRM para receitas, endereço e dados locais */

const MEDHUB_PROFILE_PREFIX = 'medhub-user-profile-';
const MEDHUB_SETUP_DONE_PREFIX = 'medhub-profile-setup-v1-';
const MEDHUB_RX_CRM_LEGACY_KEY = 'medhub-rx-crm';

const MEDHUB_CRM_UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const MEDHUB_MAX_IDENTITY_CHANGES = 2;
const MEDHUB_IDENTITY_LIMIT_NOTICE =
  'Este é um aplicativo de uso pessoal. Nome e CRM podem ser alterados no máximo 2 vezes após o cadastro. ' +
  'Se você realizar mais uma troca além do limite, sua conta será excluída.';

function medhubProfileStorageKey (email) {
  const e = String(email || (typeof getSession === 'function' ? getSession()?.email : '') || 'local')
    .trim().toLowerCase();
  return MEDHUB_PROFILE_PREFIX + e;
}

function medhubDefaultProfile (sessionUser) {
  return {
    rxDisplayName: sessionUser?.name || '',
    userType: '',
    crmUf: 'SP',
    crmNumber: '',
    address: '',
    addressCity: '',
    addressState: '',
    addressZip: '',
    identityLocked: false,
    identityChangeCount: 0,
    onboardingComplete: false
  };
}

function medhubProfileHasIdentityFields (profile) {
  if (!profile?.userType) return false;
  if (!String(profile.rxDisplayName || '').trim()) return false;
  if (profile.userType === 'student') return true;
  if (profile.userType === 'doctor') {
    return !!String(profile.crmNumber || '').replace(/\D/g, '');
  }
  return false;
}

function medhubClearProfileStateForNewAccount (email) {
  const norm = medhubNormalizedProfileEmail(email);
  if (!norm) return;
  try {
    localStorage.removeItem(medhubProfileStorageKey(norm));
    localStorage.removeItem(medhubProfileSetupBackupKey(norm));
  } catch { /* ignore */ }
}

function medhubIsFreshLoginSession () {
  try { return sessionStorage.getItem('medhub-post-login') === '1'; } catch { return false; }
}

function medhubSanitizeProfileForFreshOnboarding (sessionUser) {
  if (sessionUser?.email) medhubClearProfileStateForNewAccount(sessionUser.email);
  if (!sessionUser?.email || typeof medhubSaveUserProfileLocal !== 'function') {
    return typeof medhubLoadUserProfile === 'function' ? medhubLoadUserProfile() : null;
  }
  return medhubSaveUserProfileLocal({
    rxDisplayName: String(sessionUser.name || '').trim(),
    userType: '',
    crmUf: 'SP',
    crmNumber: '',
    onboardingComplete: false,
    identityLocked: false,
    identityChangeCount: 0
  });
}

function medhubMigrateLegacyCrm (profile) {
  if (profile.userType !== 'doctor') return profile;
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

function medhubNormalizedProfileEmail (email) {
  if (typeof authNormalizedEmail === 'function') return authNormalizedEmail(email);
  return String(email || '').trim().toLowerCase();
}

function medhubProfileSetupBackupKey (email) {
  return MEDHUB_SETUP_DONE_PREFIX + medhubNormalizedProfileEmail(email);
}

function medhubSnapshotProfileSetupComplete (snapshot) {
  if (!snapshot?.onboardingComplete) return false;
  return medhubProfileHasIdentityFields(snapshot);
}

function medhubLoadProfileSetupBackup (email) {
  try {
    const raw = localStorage.getItem(medhubProfileSetupBackupKey(email));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function medhubPersistProfileSetupBackup (email, profile) {
  const norm = medhubNormalizedProfileEmail(email);
  if (!norm || !profile) return;
  const snapshot = {
    userType: profile.userType,
    rxDisplayName: profile.rxDisplayName,
    crmUf: profile.crmUf || 'SP',
    crmNumber: profile.crmNumber || '',
    onboardingComplete: true,
    savedAt: Date.now()
  };
  if (!medhubSnapshotProfileSetupComplete(snapshot)) return;
  try {
    localStorage.setItem(medhubProfileSetupBackupKey(norm), JSON.stringify(snapshot));
  } catch { /* ignore */ }
}

function medhubRestoreProfileFromSetupBackup (email) {
  const norm = medhubNormalizedProfileEmail(email);
  if (!norm) return null;
  const snap = medhubLoadProfileSetupBackup(norm);
  if (!medhubSnapshotProfileSetupComplete(snap)) return null;
  return medhubSaveUserProfileLocal({
    userType: snap.userType,
    rxDisplayName: snap.rxDisplayName,
    crmUf: snap.crmUf || 'SP',
    crmNumber: snap.crmNumber || '',
    onboardingComplete: true
  });
}

function medhubMigrateWrongLocalProfileKey (email) {
  if (typeof medhubIsLocalDev === 'function' && !medhubIsLocalDev()) return;
  const norm = medhubNormalizedProfileEmail(email);
  if (!norm) return;
  const wrongKey = MEDHUB_PROFILE_PREFIX + 'local';
  const rightKey = medhubProfileStorageKey(norm);
  if (wrongKey === rightKey) return;
  try {
    const wrongRaw = localStorage.getItem(wrongKey);
    const rightRaw = localStorage.getItem(rightKey);
    if (wrongRaw && !rightRaw) {
      localStorage.setItem(rightKey, wrongRaw);
      localStorage.removeItem(wrongKey);
    }
  } catch { /* ignore */ }
}

function medhubLoadUserProfile () {
  const user = typeof getSession === 'function' ? getSession() : null;
  if (user?.email) medhubMigrateWrongLocalProfileKey(user.email);
  const key = medhubProfileStorageKey(user?.email);
  let profile = medhubDefaultProfile(user);
  try {
    const raw = localStorage.getItem(key);
    if (raw) profile = { ...profile, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  profile = medhubMigrateLegacyCrm(profile);
  if (!MEDHUB_CRM_UFS.includes(profile.crmUf)) profile.crmUf = 'SP';
  profile.crmNumber = String(profile.crmNumber || '').replace(/\D/g, '');
  if (user?.email && !medhubProfileDataComplete(profile)) {
    let skipBackup = false;
    try { skipBackup = sessionStorage.getItem('medhub-post-login') === '1'; } catch { /* ignore */ }
    if (!skipBackup) {
      const restored = medhubRestoreProfileFromSetupBackup(user.email);
      if (restored) profile = restored;
    }
  }
  return profile;
}

function medhubSaveUserProfileLocal (updates) {
  const user = typeof getSession === 'function' ? getSession() : null;
  const key = medhubProfileStorageKey(user?.email);
  const current = medhubLoadUserProfile();
  const next = { ...current, ...updates };
  if (next.crmNumber) next.crmNumber = String(next.crmNumber).replace(/\D/g, '');
  if (next.crmUf) next.crmUf = String(next.crmUf).toUpperCase().slice(0, 2);
  if (next.identityChangeCount != null) {
    next.identityChangeCount = Math.max(0, Number(next.identityChangeCount) || 0);
  }
  localStorage.setItem(key, JSON.stringify(next));
  if (next.crmNumber) {
    localStorage.setItem(MEDHUB_RX_CRM_LEGACY_KEY, next.crmNumber);
  }
  return next;
}

function medhubSaveUserProfile (updates) {
  return medhubSaveUserProfileLocal(updates);
}

function medhubProfileIsIdentityLocked (profile) {
  const p = profile || medhubLoadUserProfile();
  if (p.userType === 'student') return !!p.userType;
  if (p.identityLocked) return true;
  return !!(String(p.rxDisplayName || '').trim() && String(p.crmNumber || '').replace(/\D/g, ''));
}

function medhubNeedsProfileOnboarding (profile) {
  return !medhubIsProfileSetupComplete(profile);
}

function medhubProfileDataComplete (profile) {
  if (!profile) return false;
  return !!(profile.onboardingComplete && medhubProfileHasIdentityFields(profile));
}

function medhubIsProfileSetupComplete (profile) {
  const p = profile || medhubLoadUserProfile();
  if (medhubProfileDataComplete(p)) return true;
  const user = typeof getSession === 'function' ? getSession() : null;
  if (user?.email) {
    const snap = medhubLoadProfileSetupBackup(user.email);
    if (snap?.onboardingComplete && medhubSnapshotProfileSetupComplete(snap)) return true;
  }
  return false;
}

function medhubProfileOnboardingComplete (profile) {
  return medhubIsProfileSetupComplete(profile);
}

function medhubUserTypeLabel (userType) {
  if (userType === 'student') return 'Estudante de medicina';
  if (userType === 'doctor') return 'Médico(a) formado(a)';
  return '';
}

function medhubIdentityChangesRemaining (profile) {
  const count = Number(profile?.identityChangeCount || 0);
  return Math.max(0, MEDHUB_MAX_IDENTITY_CHANGES - count);
}

function medhubProfilePayloadChangesIdentity (current, payload) {
  const locked = medhubProfileIsIdentityLocked(current);
  if (!locked) return false;
  if (String(current.userType || '') !== String(payload.userType || '')) return true;
  if (String(current.rxDisplayName || '') !== String(payload.rxDisplayName || '')) return true;
  if (String(current.crmUf || 'SP') !== String(payload.crmUf || 'SP')) return true;
  if (String(current.crmNumber || '') !== String(payload.crmNumber || '')) return true;
  return false;
}

function medhubIdentityLimitDetail (profile) {
  const remaining = medhubIdentityChangesRemaining(profile);
  if (remaining >= 2) return ' Você ainda pode alterar nome ou CRM 2 vezes.';
  if (remaining === 1) {
    return ' Resta 1 alteração. Se você realizar mais uma troca, sua conta será excluída.';
  }
  return ' Limite atingido. Qualquer nova troca de nome ou CRM excluirá sua conta permanentemente.';
}

function medhubConfirmIdentityChange (profile) {
  const count = Number(profile?.identityChangeCount || 0);
  if (count >= MEDHUB_MAX_IDENTITY_CHANGES) {
    return confirm(
      'Esta alteração excluirá sua conta permanentemente.\n\n' + MEDHUB_IDENTITY_LIMIT_NOTICE + '\n\nDeseja continuar?'
    );
  }
  if (count === MEDHUB_MAX_IDENTITY_CHANGES - 1) {
    return confirm(
      'Este é um aplicativo de uso pessoal. Se você realizar mais uma troca, sua conta será excluída.\n\nDeseja continuar com esta alteração?'
    );
  }
  return confirm(
    MEDHUB_IDENTITY_LIMIT_NOTICE + '\n\nDeseja continuar com esta alteração?'
  );
}

function medhubUpdateProfileIdentityLimitUi (profile) {
  const notice = document.getElementById('profile-identity-limit-notice');
  const detail = document.getElementById('profile-identity-limit-detail');
  const p = profile || medhubLoadUserProfile();
  const show = medhubProfileIsIdentityLocked(p);

  if (notice) notice.hidden = !show;
  if (detail && show) {
    detail.textContent = medhubIdentityLimitDetail(p);
  }
}

function medhubHandleAccountDeleted (message) {
  const msg = message || 'Sua conta foi excluída por excesso de alterações de nome ou CRM.';
  alert(msg);
  if (typeof logout === 'function') {
    logout();
    return;
  }
  localStorage.removeItem('session');
  if (typeof medhubClearCloudSession === 'function') medhubClearCloudSession();
  if (typeof medhubClearSessionCrypto === 'function') medhubClearSessionCrypto();
  window.location.href = 'login.html';
}

function medhubFillProfileForm (profile, user) {
  const nameEl = document.getElementById('profile-rx-name');
  const crmUfEl = document.getElementById('profile-crm-uf');
  const crmNumEl = document.getElementById('profile-crm-number');
  const addressEl = document.getElementById('profile-address');
  const cityEl = document.getElementById('profile-address-city');
  const stateEl = document.getElementById('profile-address-state');
  const zipEl = document.getElementById('profile-address-zip');

  if (nameEl) nameEl.value = profile.rxDisplayName || user?.name || '';
  if (crmUfEl) crmUfEl.value = profile.crmUf || 'SP';
  if (crmNumEl) crmNumEl.value = profile.crmNumber || '';
  if (addressEl) addressEl.value = profile.address || '';
  if (cityEl) cityEl.value = profile.addressCity || '';
  if (stateEl) stateEl.value = profile.addressState || '';
  if (zipEl) zipEl.value = profile.addressZip || '';
}

function medhubUpdateProfileLockUi (profile, options) {
  const lockBox = document.getElementById('profile-identity-lock');
  const lockMsg = document.getElementById('profile-identity-lock-msg');
  const locked = medhubProfileIsIdentityLocked(profile);
  const upgrading = !!options?.upgradingToDoctor;

  if (lockBox) lockBox.hidden = !locked && !upgrading;

  if (lockMsg) {
    if (profile?.userType === 'student' && upgrading) {
      lockMsg.textContent = 'Informe sua senha para confirmar a mudança para médico(a) formado(a) e salvar o CRM.';
    } else if (profile?.userType === 'student') {
      lockMsg.textContent = 'Seu nome fica vinculado à conta na nuvem. Para alterá-lo, informe sua senha.';
    } else {
      lockMsg.textContent = 'Nome e CRM ficam vinculados à sua conta na nuvem. Para alterá-los, informe sua senha.';
    }
  }

  medhubUpdateProfileIdentityLimitUi(profile);
}

function medhubUpdateProfileUserTypeUi (profile, options) {
  const opts = options || {};
  const upgrading = !!opts.upgradingToDoctor;
  const p = profile || medhubLoadUserProfile();
  const isStudent = p.userType === 'student';
  const isDoctor = p.userType === 'doctor';

  const leadEl = document.getElementById('profile-prof-lead');
  const userTypeEl = document.getElementById('profile-user-type');
  const upgradeEl = document.getElementById('profile-student-upgrade');
  const crmSection = document.getElementById('profile-crm-section');
  const crmNumEl = document.getElementById('profile-crm-number');

  if (leadEl) {
    leadEl.textContent = isStudent && !upgrading
      ? 'Seu nome aparece no receituário. CRM não é obrigatório para estudantes.'
      : 'Nome e CRM aparecem no receituário, PDFs e documentos gerados pelo app.';
  }

  if (userTypeEl) {
    const label = medhubUserTypeLabel(p.userType);
    if (label) {
      userTypeEl.hidden = false;
      userTypeEl.textContent = upgrading
        ? 'Perfil: Estudante → informe CRM para médico(a) formado(a)'
        : 'Perfil: ' + label;
    } else {
      userTypeEl.hidden = true;
    }
  }

  if (upgradeEl) upgradeEl.hidden = !isStudent || upgrading;
  if (crmSection) crmSection.hidden = isStudent && !upgrading;
  if (crmNumEl) crmNumEl.required = isDoctor || upgrading;
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
  let upgradingToDoctor = false;

  if (crmUfEl && !crmUfEl.options.length) {
    MEDHUB_CRM_UFS.forEach(uf => {
      const opt = document.createElement('option');
      opt.value = uf;
      opt.textContent = uf;
      crmUfEl.appendChild(opt);
    });
  }

  medhubFillProfileForm(profile, user);
  medhubUpdateProfileUserTypeUi(profile, { upgradingToDoctor });
  medhubUpdateProfileLockUi(profile, { upgradingToDoctor });
  medhubUpdateProfileIdentityLimitUi(profile);

  document.getElementById('profile-upgrade-doctor-btn')?.addEventListener('click', () => {
    upgradingToDoctor = true;
    medhubUpdateProfileUserTypeUi(medhubLoadUserProfile(), { upgradingToDoctor });
    medhubUpdateProfileLockUi(medhubLoadUserProfile(), { upgradingToDoctor });
    document.getElementById('profile-crm-number')?.focus();
    updatePreview();
  });

  function updatePreview () {
    if (!previewEl) return;
    const current = medhubLoadUserProfile();
    if (current.userType === 'student' && !upgradingToDoctor) return;
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

  if (typeof medhubCloudSyncAvailable === 'function') {
    medhubCloudSyncAvailable().then(async available => {
      if (!available || typeof medhubCloudFetchProfile !== 'function') return;
      const cloud = await medhubCloudFetchProfile();
      if (!cloud.ok || !cloud.profile) return;
      medhubApplyCloudProfileLocal(cloud.profile);
      upgradingToDoctor = false;
      medhubFillProfileForm(medhubLoadUserProfile(), user);
      medhubUpdateProfileUserTypeUi(medhubLoadUserProfile(), { upgradingToDoctor });
      medhubUpdateProfileLockUi(medhubLoadUserProfile(), { upgradingToDoctor });
      medhubUpdateProfileIdentityLimitUi(medhubLoadUserProfile());
      updatePreview();
    });
  }

  document.getElementById('profile-save-btn')?.addEventListener('click', async () => {
    const status = document.getElementById('profile-save-status');
    const passEl = document.getElementById('profile-current-password');
    const currentProfile = medhubLoadUserProfile();
    const isUpgrade = currentProfile.userType === 'student' && upgradingToDoctor;
    const crmNumber = crmNumEl?.value?.replace(/\D/g, '') || '';

    if (isUpgrade && !crmNumber) {
      alert('Informe o número do CRM para concluir a mudança para médico(a) formado(a).');
      return;
    }

    const payload = {
      userType: isUpgrade ? 'doctor' : (currentProfile.userType || ''),
      rxDisplayName: nameEl?.value?.trim() || '',
      crmUf: crmUfEl?.value || 'SP',
      crmNumber: (currentProfile.userType === 'doctor' || isUpgrade) ? crmNumber : '',
      address: addressEl?.value?.trim() || '',
      addressCity: cityEl?.value?.trim() || '',
      addressState: (stateEl?.value || '').toUpperCase().slice(0, 2),
      addressZip: zipEl?.value?.trim() || ''
    };
    const currentPassword = passEl?.value || '';
    const wasLocked = medhubProfileIsIdentityLocked();
    const needsPassword = wasLocked || isUpgrade;

    if (needsPassword && !currentPassword) {
      alert(isUpgrade
        ? 'Informe sua senha para confirmar a mudança para médico(a) formado(a).'
        : 'Informe sua senha atual para alterar nome ou CRM.');
      return;
    }

    const willChangeIdentity = medhubProfilePayloadChangesIdentity(currentProfile, payload);
    if (willChangeIdentity && !medhubConfirmIdentityChange(currentProfile)) {
      return;
    }

    if (typeof medhubCloudSyncAvailable === 'function' && await medhubCloudSyncAvailable()) {
      const saved = await medhubCloudSaveProfile(payload, needsPassword ? currentPassword : '');
      if (!saved.ok) {
        if (saved.code === 'account_deleted') {
          medhubHandleAccountDeleted(saved.error);
          return;
        }
        if (status) {
          status.hidden = false;
          status.textContent = saved.error || 'Erro ao salvar.';
          status.className = 'anamnese-save-status anamnese-save-status--err';
        }
        return;
      }
      medhubApplyCloudProfileLocal(saved.profile);
      if (passEl) passEl.value = '';
      upgradingToDoctor = false;
    } else {
      if (willChangeIdentity) {
        const count = Number(currentProfile.identityChangeCount || 0);
        if (count >= MEDHUB_MAX_IDENTITY_CHANGES) {
          const user = typeof getSession === 'function' ? getSession() : null;
          if (user?.email && typeof getUsers === 'function' && typeof saveUsers === 'function') {
            const norm = typeof authNormalizedEmail === 'function'
              ? authNormalizedEmail(user.email)
              : String(user.email).trim().toLowerCase();
            saveUsers(getUsers().filter(u => {
              const e = typeof authNormalizedEmail === 'function' ? authNormalizedEmail(u.email) : u.email;
              return e !== norm;
            }));
          }
          medhubHandleAccountDeleted();
          return;
        }
        payload.identityChangeCount = count + 1;
      }
      medhubSaveUserProfileLocal(payload);
      upgradingToDoctor = false;
    }

    if (status) {
      status.hidden = false;
      status.textContent = isUpgrade
        ? 'Perfil atualizado para médico(a) formado(a). Nome e CRM estão protegidos na nuvem.'
        : (medhubProfileIsIdentityLocked()
          ? 'Dados profissionais salvos. Nome e CRM estão protegidos na nuvem.'
          : 'Dados profissionais salvos.');
      status.className = 'anamnese-save-status anamnese-save-status--ok';
    }
    medhubUpdateProfileUserTypeUi(medhubLoadUserProfile(), { upgradingToDoctor });
    medhubUpdateProfileLockUi(medhubLoadUserProfile(), { upgradingToDoctor });
    medhubUpdateProfileIdentityLimitUi(medhubLoadUserProfile());
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
