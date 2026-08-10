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
  const roleErrorEl = document.getElementById('onboarding-role-error');

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

  function showStatus (message, kind) {
    if (!statusEl) return;
    if (!message) {
      statusEl.hidden = true;
      statusEl.textContent = '';
      statusEl.className = 'anamnese-save-status';
      return;
    }
    statusEl.hidden = false;
    statusEl.textContent = message;
    statusEl.className = 'anamnese-save-status onboarding-status--' + (kind || 'info');
  }

  function syncRoleCards () {
    form.querySelectorAll('.onboarding-role-card').forEach(card => {
      const input = card.querySelector('input[name="userType"]');
      const checked = !!(input && input.checked);
      card.classList.toggle('onboarding-role-card--selected', checked);
      card.setAttribute('aria-checked', checked ? 'true' : 'false');
    });
    if (roleErrorEl) roleErrorEl.hidden = !!selectedUserType();
  }

  function updateCrmVisibility () {
    const isDoctor = selectedUserType() === 'doctor';
    if (crmBlock) {
      crmBlock.hidden = !isDoctor;
      crmBlock.classList.toggle('onboarding-crm-fields--visible', isDoctor);
    }
    if (crmNumEl) {
      crmNumEl.required = isDoctor;
      if (!isDoctor) crmNumEl.value = '';
    }
    syncRoleCards();
    if (isDoctor && crmBlock) {
      requestAnimationFrame(() => {
        crmBlock.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    }
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

  function selectRole (value) {
    const input = form.querySelector('input[name="userType"][value="' + value + '"]');
    if (!input) return;
    input.checked = true;
    updateCrmVisibility();
  }

  roleInputs.forEach(input => {
    input.addEventListener('change', updateCrmVisibility);
    input.addEventListener('click', updateCrmVisibility);
  });
  form.querySelectorAll('.onboarding-role-card').forEach(card => {
    card.addEventListener('click', e => {
      // Garante seleção no toque (iOS / labels aninhados)
      const input = card.querySelector('input[name="userType"]');
      if (input && e.target !== input) {
        input.checked = true;
      }
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
    showStatus('');

    const userType = selectedUserType();
    const rxDisplayName = nameEl?.value?.trim() || '';
    const crmUf = crmUfEl?.value || 'SP';
    const crmNumber = (crmNumEl?.value || '').replace(/\D/g, '');

    if (!userType) {
      if (roleErrorEl) roleErrorEl.hidden = false;
      showStatus('Selecione se você é estudante ou médico(a) formado(a).', 'error');
      form.querySelector('.onboarding-role-fieldset')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!rxDisplayName) {
      showStatus('Informe seu nome completo.', 'error');
      nameEl?.focus();
      return;
    }
    if (userType === 'doctor' && !crmNumber) {
      showStatus('Informe o número do CRM para médico(a) formado(a).', 'error');
      crmNumEl?.focus();
      return;
    }

    const sessionUser = typeof getSession === 'function' ? getSession() : null;
    if (!sessionUser?.email) {
      showStatus('Sessão expirada. Redirecionando para o login…', 'error');
      setTimeout(() => { window.location.replace('login.html'); }, 800);
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
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Salvando…';
    }
    showStatus('Salvando seu perfil…', 'info');

    const cloudAvailable = typeof medhubCloudSyncAvailable === 'function' &&
      await medhubCloudSyncAvailable();
    const productionSite = typeof medhubIsProductionSite === 'function' && medhubIsProductionSite();

    if (productionSite && !cloudAvailable) {
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Continuar para o app';
      }
      showStatus('Sincronização na nuvem indisponível. Tente novamente em instantes.', 'error');
      return;
    }

    if (cloudAvailable) {
      const saved = await medhubCloudSaveProfile(payload);
      if (!saved.ok) {
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Continuar para o app';
        }
        const authFail = saved.code === 'password_required' || /sessão|token|não autoriz|unauthorized|login/i.test(saved.error || '');
        if (authFail || saved.code === 'account_deleted') {
          showStatus((saved.error || 'Sessão inválida.') + ' Faça login novamente.', 'error');
          setTimeout(() => { window.location.replace('login.html'); }, 1200);
          return;
        }
        showStatus(
          (saved.error || 'Não foi possível salvar o perfil.') +
          ' Verifique a conexão e tente de novo.',
          'error'
        );
        return;
      }

      let confirmed = saved.profile;
      const completeFn = typeof medhubCloudProfileComplete === 'function'
        ? medhubCloudProfileComplete
        : (p) => !!(p && p.userType && p.rxDisplayName);

      if (!completeFn(confirmed)) {
        const verify = typeof medhubFetchCloudProfileWithRetry === 'function'
          ? await medhubFetchCloudProfileWithRetry(3)
          : await medhubCloudFetchProfile();
        if (verify.ok && completeFn(verify.profile)) {
          confirmed = verify.profile;
        }
      }

      if (!completeFn(confirmed)) {
        // Salvou payload localmente mesmo se GET da nuvem falhar — evita loop infinito
        confirmed = { ...payload, complete: true, onboardingComplete: true };
      }

      if (typeof medhubApplyCloudProfileLocal === 'function') {
        medhubApplyCloudProfileLocal(confirmed, { force: true });
      }
    }

    if (typeof medhubSaveUserProfileLocal === 'function') {
      medhubSaveUserProfileLocal(payload);
    }
    if (typeof medhubPersistProfileSetupBackup === 'function') {
      medhubPersistProfileSetupBackup(sessionUser.email, payload);
    }

    if (typeof medhubClearFreshLogin === 'function') medhubClearFreshLogin();
    showStatus('Perfil salvo. Abrindo o app…', 'ok');
    window.location.replace('app.html');
  });

  // Atalho de DEBUG: não — apenas API pública se necessário
  window.medhubSelectOnboardingRole = selectRole;
}

async function initOnboardingProfileGate () {
  initOnboardingProfilePage();

  const user = typeof requireAuthAsync === 'function'
    ? await requireAuthAsync()
    : (typeof getSession === 'function' ? getSession() : null);

  if (!user) return;

  if (typeof medhubCloudSyncAvailable === 'function' && await medhubCloudSyncAvailable()) {
    const cloud = typeof medhubFetchCloudProfileWithRetry === 'function'
      ? await medhubFetchCloudProfileWithRetry(3)
      : await medhubCloudFetchProfile();
    if (cloud.ok && typeof medhubCloudProfileComplete === 'function' && medhubCloudProfileComplete(cloud.profile)) {
      medhubApplyCloudProfileLocal(cloud.profile, { force: true });
      if (typeof medhubClearFreshLogin === 'function') medhubClearFreshLogin();
      window.location.replace('app.html');
      return;
    }
    if (cloud.ok && cloud.profile) {
      medhubApplyCloudProfileLocal(cloud.profile, { force: true });
    }
  }

  if (user?.email && typeof medhubRestoreProfileFromSetupBackup === 'function') {
    medhubRestoreProfileFromSetupBackup(user.email);
  }

  const profile = typeof medhubLoadUserProfile === 'function' ? medhubLoadUserProfile() : null;
  if (typeof medhubIsProfileSetupComplete === 'function' && medhubIsProfileSetupComplete(profile)) {
    if (typeof medhubCloudSyncAvailable === 'function' && await medhubCloudSyncAvailable()) {
      if (typeof medhubTryPushLocalProfileToCloud === 'function') {
        await medhubTryPushLocalProfileToCloud();
      } else if (typeof medhubPushEffectiveProfileToCloud === 'function') {
        await medhubPushEffectiveProfileToCloud();
      }
    }
    if (typeof medhubClearFreshLogin === 'function') medhubClearFreshLogin();
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
