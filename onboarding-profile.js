/* Onboarding — passo 2: tipo de usuário e CRM (somente no primeiro acesso) */

function initOnboardingProfilePage () {
  const form = document.getElementById('onboarding-profile-form');
  if (!form || form.dataset.bound) return;
  form.dataset.bound = '1';

  const nameEl = document.getElementById('onboarding-rx-name');
  const crmBlock = document.getElementById('onboarding-crm-fields');
  const crmUfEl = document.getElementById('onboarding-crm-uf');
  const crmNumEl = document.getElementById('onboarding-crm-number');
  const previewEl = document.getElementById('onboarding-rx-preview');
  const statusEl = document.getElementById('onboarding-status');
  const roleInputs = form.querySelectorAll('input[name="userType"]');

  if (crmUfEl && !crmUfEl.options.length) {
    const ufs = typeof MEDHUB_CRM_UFS !== 'undefined'
      ? MEDHUB_CRM_UFS
      : ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
        'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
    ufs.forEach(uf => {
      const opt = document.createElement('option');
      opt.value = uf;
      opt.textContent = uf;
      crmUfEl.appendChild(opt);
    });
    if (!crmUfEl.value) crmUfEl.value = 'SP';
  }

  function selectedUserType () {
    return form.querySelector('input[name="userType"]:checked')?.value || '';
  }

  function updateCrmVisibility () {
    const isDoctor = selectedUserType() === 'doctor';
    if (crmNumEl) crmNumEl.required = isDoctor;
    if (crmBlock) crmBlock.setAttribute('aria-hidden', isDoctor ? 'false' : 'true');
    updatePreview();
  }

  function updatePreview () {
    if (!previewEl) return;
    if (selectedUserType() !== 'doctor') {
      previewEl.textContent = '';
      return;
    }
    const name = (nameEl?.value || '').trim() || '________________';
    const uf = crmUfEl?.value || 'SP';
    const num = (crmNumEl?.value || '').replace(/\D/g, '');
    const crm = num ? `CRM-${uf} ${num}` : `CRM-${uf} ____________`;
    previewEl.textContent = `Dr(a). ${name} · ${crm}`;
  }

  roleInputs.forEach(input => {
    input.addEventListener('change', updateCrmVisibility);
    input.addEventListener('click', updateCrmVisibility);
  });
  form.querySelectorAll('.onboarding-role-card').forEach(card => {
    card.addEventListener('click', () => {
      setTimeout(updateCrmVisibility, 0);
    });
  });
  [nameEl, crmUfEl, crmNumEl].forEach(el => {
    el?.addEventListener('input', updatePreview);
    el?.addEventListener('change', updatePreview);
  });
  if (crmNumEl) {
    crmNumEl.addEventListener('input', () => {
      crmNumEl.value = crmNumEl.value.replace(/\D/g, '');
    });
  }
  updateCrmVisibility();

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (statusEl) statusEl.hidden = true;

    const userType = selectedUserType();
    const rxDisplayName = nameEl?.value?.trim() || '';
    const crmUf = crmUfEl?.value || 'SP';
    const crmNumber = (crmNumEl?.value || '').replace(/\D/g, '');

    if (!userType) {
      alert('Selecione estudante ou médico(a) formado(a).');
      return;
    }
    if (!rxDisplayName) {
      alert('Informe seu nome completo.');
      return;
    }
    if (userType === 'doctor' && !crmNumber) {
      alert('Informe o número do CRM.');
      crmNumEl?.focus();
      return;
    }

    const sessionUser = typeof getSession === 'function' ? getSession() : null;
    if (!sessionUser?.email) {
      alert('Sessão expirada. Faça login novamente.');
      window.location.replace('login.html');
      return;
    }

    const payload = {
      userType,
      rxDisplayName,
      crmUf: userType === 'doctor' ? crmUf : 'SP',
      crmNumber: userType === 'doctor' ? crmNumber : '',
      onboardingComplete: true
    };

    const btn = document.getElementById('onboarding-submit-btn');
    if (btn) btn.disabled = true;

    let savedOk = false;

    if (typeof medhubSaveUserProfileLocal === 'function') {
      medhubSaveUserProfileLocal(payload);
      savedOk = true;
    }
    if (typeof medhubPersistProfileSetupBackup === 'function') {
      medhubPersistProfileSetupBackup(sessionUser.email, payload);
    }

    let cloudWarning = '';
    if (typeof medhubCloudSyncAvailable === 'function' && await medhubCloudSyncAvailable()) {
      const saved = await medhubCloudSaveProfile(payload);
      if (saved.ok) {
        if (typeof medhubApplyCloudProfileLocal === 'function') {
          medhubApplyCloudProfileLocal(saved.profile || payload);
        }
      } else {
        cloudWarning = saved.error || 'Perfil salvo neste aparelho; sync na nuvem falhou.';
      }
    }

    if (!savedOk) {
      if (btn) btn.disabled = false;
      alert('Não foi possível salvar o perfil.');
      return;
    }

    if (typeof medhubClearFreshLogin === 'function') medhubClearFreshLogin();
    if (cloudWarning && statusEl) {
      statusEl.hidden = false;
      statusEl.textContent = cloudWarning + ' Entrando no app…';
      statusEl.className = 'anamnese-save-status anamnese-save-status--ok';
      setTimeout(() => { window.location.replace('app.html'); }, 600);
      return;
    }
    window.location.replace('app.html');
  });
}

async function initOnboardingProfileGate () {
  initOnboardingProfilePage();

  const user = typeof requireAuthAsync === 'function'
    ? await requireAuthAsync()
    : (typeof getSession === 'function' ? getSession() : null);

  if (!user) return;

  if (typeof medhubHasFreshLogin === 'function' && !medhubHasFreshLogin()) {
    window.location.replace('login.html');
    return;
  }

  if (typeof medhubCloudSyncAvailable === 'function' && await medhubCloudSyncAvailable()) {
    const cloud = await medhubCloudFetchProfile();
    if (cloud.ok && cloud.profile) {
      medhubApplyCloudProfileLocal(cloud.profile);
    }
  }

  const profile = typeof medhubLoadUserProfile === 'function' ? medhubLoadUserProfile() : null;
  if (typeof medhubIsProfileSetupComplete === 'function' && medhubIsProfileSetupComplete(profile)) {
    window.location.replace('app.html');
    return;
  }

  const nameInput = document.getElementById('onboarding-rx-name');
  if (nameInput && !nameInput.value) {
    nameInput.value = profile?.rxDisplayName || user.name || '';
  }

  if (profile?.userType === 'doctor') {
    const doctorRadio = document.querySelector('input[name="userType"][value="doctor"]');
    if (doctorRadio) doctorRadio.checked = true;
    const crmUfEl = document.getElementById('onboarding-crm-uf');
    const crmNumEl = document.getElementById('onboarding-crm-number');
    if (crmUfEl && profile.crmUf) crmUfEl.value = profile.crmUf;
    if (crmNumEl && profile.crmNumber) crmNumEl.value = profile.crmNumber;
  } else if (profile?.userType === 'student') {
    const studentRadio = document.querySelector('input[name="userType"][value="student"]');
    if (studentRadio) studentRadio.checked = true;
  }

  document.getElementById('onboarding-profile-form')
    ?.querySelector('input[name="userType"]:checked')
    ?.dispatchEvent(new Event('change', { bubbles: true }));
}

document.addEventListener('DOMContentLoaded', () => {
  initOnboardingProfileGate();
});
