/* Login na nuvem — JWT + APIs Vercel (fallback para auth local) */

const MEDHUB_TOKEN_KEY = 'medhub_auth_token';
let _authConfigCache = null;

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
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: authNormalizedEmail(email),
      password
    })
  });
  const data = await res.json();
  if (!res.ok) {
    return { ok: false, error: data.error || 'Credenciais inválidas.' };
  }
  return { ok: true, data };
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
  return { ok: true, profile: data.profile || null };
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
  if (profile.onboardingComplete) return true;
  if (typeof medhubProfileHasIdentityFields === 'function') {
    return medhubProfileHasIdentityFields(profile);
  }
  return !!(profile.userType && profile.rxDisplayName);
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
  const merged = { ...local };

  if (profile.rxDisplayName != null && String(profile.rxDisplayName).trim()) {
    merged.rxDisplayName = String(profile.rxDisplayName).trim();
  }
  if (profile.userType === 'student' || profile.userType === 'doctor') {
    merged.userType = profile.userType;
  }
  if (profile.crmUf) merged.crmUf = profile.crmUf;
  if (profile.crmNumber != null) {
    merged.crmNumber = String(profile.crmNumber).replace(/\D/g, '');
  }
  if (profile.address != null) merged.address = profile.address;
  if (profile.addressCity != null) merged.addressCity = profile.addressCity;
  if (profile.addressState != null) merged.addressState = profile.addressState;
  if (profile.addressZip != null) merged.addressZip = profile.addressZip;
  if (profile.identityLocked) merged.identityLocked = true;
  if (profile.identityChangeCount != null) {
    merged.identityChangeCount = Math.max(
      Number(local.identityChangeCount) || 0,
      Number(profile.identityChangeCount) || 0
    );
  }
  if (medhubCloudProfileComplete(profile) || medhubCloudProfileComplete(merged)) {
    merged.onboardingComplete = true;
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

  const fresh = medhubHasFreshLogin();
  const cloud = await medhubCloudFetchProfile();
  if (!cloud.ok) return;

  const remote = cloud.profile || {};
  const remoteComplete = medhubCloudProfileComplete(remote);
  const localProfile = typeof medhubLoadUserProfile === 'function' ? medhubLoadUserProfile() : null;
  const localComplete = typeof medhubIsProfileSetupComplete === 'function'
    ? medhubIsProfileSetupComplete(localProfile)
    : medhubCloudProfileComplete(localProfile);

  if (remoteComplete) {
    medhubApplyCloudProfileLocal(remote, { force: true });
    return;
  }

  if (fresh || !localComplete) return;

  if (typeof medhubCloudSaveProfile === 'function') {
    const saved = await medhubCloudSaveProfile({
      rxDisplayName: localProfile.rxDisplayName,
      userType: localProfile.userType,
      crmUf: localProfile.crmUf,
      crmNumber: localProfile.crmNumber,
      address: localProfile.address,
      addressCity: localProfile.addressCity,
      addressState: localProfile.addressState,
      addressZip: localProfile.addressZip,
      onboardingComplete: true
    });
    if (saved.ok) medhubApplyCloudProfileLocal(saved.profile, { force: true });
  }
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

async function medhubEnsureProfileOnboarding () {
  if (typeof medhubIsProfileSetupComplete !== 'function') return true;

  const user = typeof getSession === 'function' ? getSession() : null;

  if (typeof medhubCloudSyncAvailable === 'function' && await medhubCloudSyncAvailable()) {
    const cloud = await medhubCloudFetchProfile();
    if (cloud.ok && medhubCloudProfileComplete(cloud.profile)) {
      medhubApplyCloudProfileLocal(cloud.profile, { force: true });
      medhubClearFreshLogin();
      return true;
    }
    if (cloud.ok && cloud.profile) {
      medhubApplyCloudProfileLocal(cloud.profile, { force: true });
    }
  }

  const fresh = medhubHasFreshLogin();

  if (fresh) {
    if (user?.email && typeof medhubClearProfileStateForNewAccount === 'function') {
      medhubClearProfileStateForNewAccount(user.email);
    }
    if (typeof medhubSanitizeProfileForFreshOnboarding === 'function' && user) {
      medhubSanitizeProfileForFreshOnboarding(user);
    }
    medhubGoProfileOnboarding();
    return false;
  }

  if (user?.email && typeof medhubRestoreProfileFromSetupBackup === 'function') {
    medhubRestoreProfileFromSetupBackup(user.email);
  }

  if (typeof medhubSyncProfileAfterLogin === 'function') {
    await medhubSyncProfileAfterLogin();
  }

  let profile = typeof medhubLoadUserProfile === 'function' ? medhubLoadUserProfile() : null;

  if (
    !medhubIsProfileSetupComplete(profile) &&
    typeof medhubProfileHasIdentityFields === 'function' &&
    medhubProfileHasIdentityFields(profile) &&
    typeof medhubSaveUserProfileLocal === 'function'
  ) {
    profile = medhubSaveUserProfileLocal({ onboardingComplete: true });
    if (typeof medhubCloudSyncAvailable === 'function' && await medhubCloudSyncAvailable()) {
      await medhubCloudSaveProfile({
        rxDisplayName: profile.rxDisplayName,
        userType: profile.userType,
        crmUf: profile.crmUf,
        crmNumber: profile.crmNumber,
        address: profile.address,
        addressCity: profile.addressCity,
        addressState: profile.addressState,
        addressZip: profile.addressZip,
        onboardingComplete: true
      });
    }
    medhubClearFreshLogin();
    return true;
  }

  if (medhubIsProfileSetupComplete(profile)) {
    if (!profile.onboardingComplete && typeof medhubSaveUserProfileLocal === 'function') {
      profile = medhubSaveUserProfileLocal({ onboardingComplete: true });
      if (typeof medhubCloudSyncAvailable === 'function' && await medhubCloudSyncAvailable()) {
        await medhubCloudSaveProfile({
          rxDisplayName: profile.rxDisplayName,
          userType: profile.userType,
          crmUf: profile.crmUf,
          crmNumber: profile.crmNumber,
          address: profile.address,
          addressCity: profile.addressCity,
          addressState: profile.addressState,
          addressZip: profile.addressZip,
          onboardingComplete: true
        });
      }
    }
    medhubClearFreshLogin();
    return true;
  }

  if (!user?.email) {
    window.location.href = 'login.html';
    return false;
  }

  medhubGoProfileOnboarding();
  return false;
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
