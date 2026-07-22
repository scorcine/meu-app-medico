/* Login na nuvem — JWT + APIs Vercel (fallback para auth local) */

const MEDHUB_TOKEN_KEY = 'medhub_auth_token';
let _authConfigCache = null;

function authNormalizedEmail (email) {
  return String(email || '').trim().toLowerCase();
}

async function medhubFetchAuthConfig (force) {
  if (_authConfigCache && !force) return _authConfigCache;

  if (window.location.protocol === 'file:') {
    _authConfigCache = { cloudEnabled: false };
    return _authConfigCache;
  }

  try {
    const res = await fetch('/api/auth/config');
    if (!res.ok) {
      _authConfigCache = { cloudEnabled: false };
      return _authConfigCache;
    }
    _authConfigCache = await res.json();
    return _authConfigCache;
  } catch {
    _authConfigCache = { cloudEnabled: false };
    return _authConfigCache;
  }
}

async function medhubCloudSyncAvailable () {
  const config = await medhubFetchAuthConfig();
  return !!(config.cloudEnabled && medhubGetAuthToken());
}

function medhubGetAuthToken () {
  return localStorage.getItem(MEDHUB_TOKEN_KEY) || '';
}

function medhubSetAuthToken (token) {
  if (token) localStorage.setItem(MEDHUB_TOKEN_KEY, token);
  else localStorage.removeItem(MEDHUB_TOKEN_KEY);
}

function medhubAuthHeaders () {
  const token = medhubGetAuthToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = 'Bearer ' + token;
  return headers;
}

function medhubCacheLocalUser (user, passHash, passSalt) {
  if (typeof getUsers !== 'function' || typeof saveUsers !== 'function') return;
  const email = authNormalizedEmail(user.email);
  const users = getUsers().filter(u => authNormalizedEmail(u.email) !== email);
  users.push({
    name: user.name,
    email: user.email,
    passHash,
    passSalt,
    passVersion: 1
  });
  saveUsers(users);
}

async function medhubCloudChangePassword (currentPassword, newPassword) {
  const res = await fetch('/api/auth/me', {
    method: 'POST',
    headers: medhubAuthHeaders(),
    body: JSON.stringify({
      action: 'changePassword',
      currentPassword,
      newPassword
    })
  });
  const data = await res.json();
  if (!res.ok) {
    return { ok: false, error: data.error || 'Erro ao alterar senha.' };
  }
  return { ok: true };
}

async function medhubRequestPasswordReset (email) {
  const res = await fetch('/api/auth/verify-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'requestReset', email: authNormalizedEmail(email) })
  });
  const data = await res.json();
  if (!res.ok) {
    return { ok: false, error: data.error || 'Erro ao enviar e-mail.', code: data.code };
  }
  return { ok: true, message: data.message };
}

async function medhubConfirmPasswordReset (token, newPassword) {
  const res = await fetch('/api/auth/verify-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'confirmReset', token, newPassword })
  });
  const data = await res.json();
  if (!res.ok) {
    return { ok: false, error: data.error || 'Erro ao redefinir senha.', code: data.code };
  }
  return { ok: true, message: data.message, clinicalDataReset: data.clinicalDataReset, email: data.email };
}

async function medhubCloudRegister (name, email, password, acceptTerms, acceptPrivacy, checkoutSessionId, coupon) {
  const payload = {
    name,
    email: authNormalizedEmail(email),
    password,
    acceptTerms,
    acceptPrivacy
  };
  if (checkoutSessionId) payload.checkoutSessionId = checkoutSessionId;
  if (coupon) payload.coupon = String(coupon).trim();

  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) {
    return {
      ok: false,
      error: data.error || 'Erro ao cadastrar',
      code: data.code,
      expectedEmail: data.expectedEmail
    };
  }
  return { ok: true, data };
}

async function medhubCloudLogin (email, password) {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: authNormalizedEmail(email),
        password
      })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, error: data.error || 'Credenciais inválidas.' };
    }
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: 'Falha de rede ao contactar o servidor.' };
  }
}

async function medhubCloudMe () {
  const token = medhubGetAuthToken();
  if (!token) return null;

  try {
    const res = await fetch('/api/auth/me', { headers: medhubAuthHeaders() });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (data.code === 'session_revoked') return { sessionRevoked: true };
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

async function medhubCloudFetchProfile () {
  const res = await fetch('/api/auth/profile', { headers: medhubAuthHeaders() });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: data.error || 'Erro ao carregar perfil.',
      code: data.code
    };
  }
  return {
    ok: true,
    profile: data.profile || null,
    onboardingComplete: !!data.onboardingComplete
  };
}

async function medhubFetchCloudProfileWithRetry (attempts) {
  const max = Math.max(1, attempts || 3);
  let last = { ok: false, error: 'Erro ao carregar perfil.' };
  for (let i = 0; i < max; i++) {
    last = await medhubCloudFetchProfile();
    if (last.ok) return last;
    if (i < max - 1) {
      await new Promise(resolve => setTimeout(resolve, 350 * (i + 1)));
    }
  }
  return last;
}

function medhubIsProductionSite () {
  if (window.location.protocol === 'file:') return false;
  const host = window.location.hostname;
  return host !== 'localhost' && host !== '127.0.0.1';
}

async function medhubCloudSaveProfile (profile, currentPassword) {
  const payload = { profile };
  if (currentPassword) payload.currentPassword = currentPassword;

  const res = await fetch('/api/auth/profile', {
    method: 'POST',
    headers: medhubAuthHeaders(),
    body: JSON.stringify(payload)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: data.error || 'Erro ao salvar perfil.',
      code: data.code
    };
  }
  return { ok: true, profile: data.profile || null };
}

function medhubCloudProfileComplete (profile) {
  if (!profile) return false;
  if (profile.complete || profile.onboardingComplete) {
    if (typeof medhubProfileHasIdentityFields === 'function') {
      return medhubProfileHasIdentityFields(profile) || !!(profile.userType && profile.rxDisplayName);
    }
    return true;
  }
  if (typeof medhubProfileHasIdentityFields === 'function') {
    return medhubProfileHasIdentityFields(profile);
  }
  return !!(profile.userType && profile.rxDisplayName);
}

async function medhubPushEffectiveProfileToCloud () {
  if (typeof medhubGetEffectiveProfileSnapshot !== 'function') return { ok: false };
  if (typeof medhubBuildCloudProfilePayload !== 'function') return { ok: false };
  const snap = medhubGetEffectiveProfileSnapshot();
  if (!snap) return { ok: false, reason: 'no_local' };
  const payload = medhubBuildCloudProfilePayload(snap);
  if (!payload) return { ok: false, reason: 'no_payload' };
  const saved = await medhubCloudSaveProfile(payload);
  if (!saved.ok) return saved;
  medhubApplyCloudProfileLocal(saved.profile || payload, { force: true });
  return { ok: true, profile: saved.profile || payload };
}

async function medhubRestoreProfileFromCloud (loginProfile) {
  if (loginProfile && medhubCloudProfileComplete(loginProfile)) {
    medhubApplyCloudProfileLocal(loginProfile, { force: true });
    return true;
  }

  if (!(await medhubCloudSyncAvailable())) return false;

  const cloud = await medhubFetchCloudProfileWithRetry(3);
  if (!cloud.ok) return false;

  if (medhubCloudProfileComplete(cloud.profile) || cloud.onboardingComplete) {
    medhubApplyCloudProfileLocal(cloud.profile, { force: true });
    return true;
  }

  const pushed = await medhubPushEffectiveProfileToCloud();
  return !!(pushed.ok && medhubCloudProfileComplete(pushed.profile));
}

function medhubApplyCloudProfileLocal (profile, options) {
  if (!profile || typeof medhubSaveUserProfileLocal !== 'function') return;
  const force = !!(options && options.force);
  if (!force && medhubHasFreshLogin()) return;
  const local = medhubLoadUserProfile();
  if (
    !force &&
    typeof medhubIsProfileSetupComplete === 'function' &&
    medhubIsProfileSetupComplete(local) &&
    !medhubCloudProfileComplete(profile)
  ) {
    return;
  }
  const source = typeof medhubHealProfileIdentity === 'function'
    ? medhubHealProfileIdentity(profile)
    : profile;
  const merged = { ...local };

  if (source.rxDisplayName != null && String(source.rxDisplayName).trim()) {
    merged.rxDisplayName = String(source.rxDisplayName).trim();
  }
  if (source.userType === 'student' || source.userType === 'doctor') {
    merged.userType = source.userType;
  } else if (!merged.userType && String(source.crmNumber || '').replace(/\D/g, '')) {
    merged.userType = 'doctor';
  }
  if (source.crmUf) merged.crmUf = source.crmUf;
  if (source.crmNumber != null) {
    merged.crmNumber = String(source.crmNumber).replace(/\D/g, '');
  }
  if (source.address != null) merged.address = source.address;
  if (source.addressCity != null) merged.addressCity = source.addressCity;
  if (source.addressState != null) merged.addressState = source.addressState;
  if (source.addressZip != null) merged.addressZip = source.addressZip;
  if (source.identityLocked) merged.identityLocked = true;
  if (source.identityChangeCount != null) {
    merged.identityChangeCount = Math.max(
      Number(local.identityChangeCount) || 0,
      Number(source.identityChangeCount) || 0
    );
  }
  if (medhubCloudProfileComplete(source) || medhubCloudProfileComplete(merged)) {
    merged.onboardingComplete = true;
    if (!merged.userType && merged.crmNumber) merged.userType = 'doctor';
  }

  medhubSaveUserProfileLocal(merged);
  const user = typeof getSession === 'function' ? getSession() : null;
  if (user?.email && typeof medhubPersistProfileSetupBackup === 'function') {
    medhubPersistProfileSetupBackup(user.email, merged);
  }
}

async function medhubSyncProfileAfterLogin () {
  if (typeof medhubCloudSyncAvailable !== 'function') return;
  if (!(await medhubCloudSyncAvailable())) return;
  if (medhubHasFreshLogin()) return;
  await medhubRestoreProfileFromCloud(null);
}

async function medhubValidateCloudSession () {
  const config = await medhubFetchAuthConfig();
  if (!config.cloudEnabled) return true;

  const token = medhubGetAuthToken();
  if (!token) return false;

  const me = await medhubCloudMe();
  if (me?.sessionRevoked) {
    sessionStorage.setItem('medhub-session-revoked', '1');
    return false;
  }
  return !!me?.user;
}

async function medhubCloudAcceptLegal () {
  const res = await fetch('/api/auth/accept-legal', {
    method: 'POST',
    headers: medhubAuthHeaders(),
    body: JSON.stringify({ acceptTerms: true, acceptPrivacy: true })
  });
  if (!res.ok) return false;
  const data = await res.json();
  return !!data.user;
}

async function medhubCloudVerifyPassword (email, password) {
  const res = await fetch('/api/auth/verify-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: authNormalizedEmail(email),
      password
    })
  });
  if (!res.ok) return false;
  const data = await res.json();
  return !!data.ok;
}

function medhubRemoveStaleLocalUser (email) {
  if (typeof getUsers !== 'function' || typeof saveUsers !== 'function') return;
  const norm = authNormalizedEmail(email);
  saveUsers(getUsers().filter(u => authNormalizedEmail(u.email) !== norm));
}

async function medhubApplyCloudSession (loginData, password) {
  medhubSetAuthToken(loginData.token);
  medhubSetSession(loginData.user);
  if (password && typeof medhubHashPassword === 'function') {
    const hashed = await medhubHashPassword(password);
    medhubCacheLocalUser(loginData.user, hashed.passHash, hashed.passSalt);
  }
}

function medhubApplyLoginProfile (loginData) {
  if (!loginData?.profile || !medhubCloudProfileComplete(loginData.profile)) return;
  medhubApplyCloudProfileLocal(loginData.profile, { force: true });
}

async function medhubProfileNeedsOnboarding () {
  if (typeof medhubIsProfileSetupComplete !== 'function') return false;
  const profile = typeof medhubLoadUserProfile === 'function' ? medhubLoadUserProfile() : null;
  return !medhubIsProfileSetupComplete(profile);
}

async function medhubTryPushLocalProfileToCloud () {
  if (typeof medhubPushEffectiveProfileToCloud !== 'function') return false;
  const pushed = await medhubPushEffectiveProfileToCloud();
  return !!(pushed.ok && medhubCloudProfileComplete(pushed.profile));
}

async function medhubAdmitIfLocalProfileComplete () {
  if (typeof medhubIsProfileSetupComplete !== 'function') return false;
  const profile = typeof medhubLoadUserProfile === 'function' ? medhubLoadUserProfile() : null;
  if (!medhubIsProfileSetupComplete(profile)) return false;

  if (typeof medhubCloudSyncAvailable === 'function' && await medhubCloudSyncAvailable()) {
    await medhubTryPushLocalProfileToCloud();
  }
  medhubClearFreshLogin();
  return true;
}

async function medhubEnsureProfileOnboarding () {
  if (typeof medhubIsProfileSetupComplete !== 'function') return true;

  const user = typeof getSession === 'function' ? getSession() : null;
  if (!user?.email) {
    window.location.href = 'login.html';
    return false;
  }

  // Sempre prioriza a nuvem em computadores novos / terminais de trabalho
  if (typeof medhubCloudSyncAvailable === 'function' && await medhubCloudSyncAvailable()) {
    const restored = await medhubRestoreProfileFromCloud(null);
    if (restored && medhubIsProfileSetupComplete(medhubLoadUserProfile())) {
      medhubClearFreshLogin();
      return true;
    }
  }

  if (await medhubAdmitIfLocalProfileComplete()) return true;

  const signupOnly = medhubHasFreshLogin();

  if (signupOnly) {
    if (typeof medhubCloudSyncAvailable === 'function' && await medhubCloudSyncAvailable()) {
      const restored = await medhubRestoreProfileFromCloud(null);
      if (restored && medhubIsProfileSetupComplete(medhubLoadUserProfile())) {
        medhubClearFreshLogin();
        return true;
      }
    }
    // Só limpa perfil local em cadastro novo de verdade — nunca em login normal
    if (typeof medhubClearProfileStateForNewAccount === 'function') {
      medhubClearProfileStateForNewAccount(user.email);
    }
    if (typeof medhubSanitizeProfileForFreshOnboarding === 'function') {
      medhubSanitizeProfileForFreshOnboarding(user);
    }
    medhubGoProfileOnboarding();
    return false;
  }

  if (typeof medhubCloudSyncAvailable === 'function' && await medhubCloudSyncAvailable()) {
    if (await medhubAdmitIfLocalProfileComplete()) return true;

    const cloud = await medhubFetchCloudProfileWithRetry(3);
    if (!cloud.ok) {
      alert(
        'Não foi possível carregar seu perfil na nuvem.\n\n' +
        'Verifique sua conexão e tente entrar novamente. Seus dados profissionais ficam salvos na conta — não repita o cadastro de nome/CRM sem necessidade.'
      );
      if (typeof logout === 'function') logout();
      else window.location.href = 'login.html';
      return false;
    }

    if (cloud.profile && medhubCloudProfileComplete(cloud.profile)) {
      medhubApplyCloudProfileLocal(cloud.profile, { force: true });
      medhubClearFreshLogin();
      return true;
    }
  } else if (user?.email && typeof medhubRestoreProfileFromSetupBackup === 'function') {
    medhubRestoreProfileFromSetupBackup(user.email);
    if (medhubIsProfileSetupComplete(medhubLoadUserProfile())) {
      medhubClearFreshLogin();
      return true;
    }
  }

  medhubGoProfileOnboarding();
  return false;
}

function medhubClearCloudSession () {
  medhubSetAuthToken('');
}

function medhubSubscriptionBlocked (subscription) {
  if (!subscription) return false;
  if (subscription.devBypass) return false;
  if (subscription.misconfigured) return true;
  return !subscription.active;
}

function medhubRedirectPricing (email) {
  const q = new URLSearchParams({ reason: 'subscription', email: email || '' });
  window.location.href = 'index.html?' + q.toString() + '#planos';
}

function medhubGoProfileOnboarding () {
  window.location.href = 'onboarding-profile.html';
}

const MEDHUB_FRESH_LOGIN_KEY = 'medhub-post-login';

const MEDHUB_PWA_SIGNUP_KEY = 'medhub-pwa-after-signup';

function medhubMarkFreshLogin () {
  try { sessionStorage.setItem(MEDHUB_FRESH_LOGIN_KEY, '1'); } catch { /* ignore */ }
  try { sessionStorage.setItem(MEDHUB_PWA_SIGNUP_KEY, '1'); } catch { /* ignore */ }
}

function medhubTakePwaAfterSignup () {
  try {
    if (sessionStorage.getItem(MEDHUB_PWA_SIGNUP_KEY) === '1') {
      sessionStorage.removeItem(MEDHUB_PWA_SIGNUP_KEY);
      return true;
    }
  } catch { /* ignore */ }
  return false;
}

function medhubHasFreshLogin () {
  try { return sessionStorage.getItem(MEDHUB_FRESH_LOGIN_KEY) === '1'; } catch { return false; }
}

function medhubClearFreshLogin () {
  try { sessionStorage.removeItem(MEDHUB_FRESH_LOGIN_KEY); } catch { /* ignore */ }
}

async function medhubFinishCloudAuth (loginData, config, options = {}) {
  if (options.forceOnboarding) {
    if (typeof medhubClearProfileStateForNewAccount === 'function') {
      medhubClearProfileStateForNewAccount(loginData.user.email);
    }
    if (typeof medhubSanitizeProfileForFreshOnboarding === 'function') {
      medhubSanitizeProfileForFreshOnboarding(loginData.user);
    }
    window.location.replace('onboarding-profile.html');
    return true;
  }

  if (!(await medhubEnsureProfileOnboarding())) return true;
  authGoApp();
  return true;
}

async function medhubAfterCloudAuth (loginData, password, options = {}) {
  if (loginData?.user?.email) medhubRemoveStaleLocalUser(loginData.user.email);
  await medhubApplyCloudSession(loginData, password);
  medhubApplyLoginProfile(loginData);
  if (options.forceOnboarding) medhubMarkFreshLogin();
  else medhubClearFreshLogin();
  await medhubUnlockSession(password, loginData.user.email);

  if (typeof medhubCloudSyncAfterUnlock === 'function') {
    await medhubCloudSyncAfterUnlock();
  }

  if (typeof medhubSyncProfileAfterLogin === 'function') {
    await medhubSyncProfileAfterLogin();
  }

  if (medhubSubscriptionBlocked(loginData.subscription)) {
    medhubClearCloudSession();
    localStorage.removeItem('session');
    medhubClearSessionCrypto();
    medhubRedirectPricing(loginData.user.email);
    return false;
  }

  const config = await medhubFetchAuthConfig();

  if (medhubHasAcceptedLegal(loginData.user.email)) {
    medhubAcceptLegalLocal(loginData.user.email, config);
    return medhubFinishCloudAuth(loginData, config, options);
  }

  const legal = loginData.user?.legal;
  const termsOk = legal?.termsVersion === config.termsVersion;
  const privacyOk = legal?.privacyVersion === config.privacyVersion;

  if (termsOk && privacyOk) {
    medhubAcceptLegalLocal(loginData.user.email, config);
    return medhubFinishCloudAuth(loginData, config, options);
  }

  medhubShowLegalModal(async () => {
    const cloudOk = await medhubCloudAcceptLegal();
    if (cloudOk) {
      medhubAcceptLegalLocal(loginData.user.email, config);
    } else {
      medhubAcceptLegalLocal(loginData.user.email, config);
    }
    await medhubFinishCloudAuth(loginData, config, options);
  });

  return true;
}
