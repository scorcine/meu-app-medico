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
  return { ok: true, message: data.message, clinicalDataReset: data.clinicalDataReset };
}

async function medhubCloudRegister (name, email, password, acceptTerms, acceptPrivacy, checkoutSessionId) {
  const payload = {
    name,
    email: authNormalizedEmail(email),
    password,
    acceptTerms,
    acceptPrivacy
  };
  if (checkoutSessionId) payload.checkoutSessionId = checkoutSessionId;

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

function medhubApplyCloudProfileLocal (profile) {
  if (!profile || typeof medhubSaveUserProfileLocal !== 'function') return;
  const local = medhubLoadUserProfile();
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
  if (profile.onboardingComplete || medhubIsProfileSetupComplete({ ...merged, ...profile })) {
    merged.onboardingComplete = true;
  }

  medhubSaveUserProfileLocal(merged);
}

async function medhubSyncProfileAfterLogin () {
  if (typeof medhubCloudSyncAvailable !== 'function') return;
  if (!(await medhubCloudSyncAvailable())) return;

  const cloud = await medhubCloudFetchProfile();
  if (!cloud.ok) return;

  const remote = cloud.profile || {};
  const hasRemote = !!(remote.onboardingComplete || remote.userType || remote.crmNumber);
  const local = typeof medhubLoadUserProfile === 'function' ? medhubLoadUserProfile() : null;
  const hasLocal = !!(local?.onboardingComplete || local?.userType || local?.crmNumber);

  if (hasRemote) {
    medhubApplyCloudProfileLocal(remote);
    return;
  }

  if (hasLocal && typeof medhubCloudSaveProfile === 'function') {
    const saved = await medhubCloudSaveProfile({
      rxDisplayName: local.rxDisplayName,
      userType: local.userType,
      crmUf: local.crmUf,
      crmNumber: local.crmNumber,
      address: local.address,
      addressCity: local.addressCity,
      addressState: local.addressState,
      addressZip: local.addressZip,
      onboardingComplete: !!local.onboardingComplete || medhubIsProfileSetupComplete(local)
    });
    if (saved.ok) medhubApplyCloudProfileLocal(saved.profile);
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

function medhubApplyCloudSession (loginData, password) {
  medhubSetAuthToken(loginData.token);
  medhubSetSession(loginData.user);
  if (password && typeof medhubHashPassword === 'function') {
    medhubHashPassword(password).then(hashed => {
      medhubCacheLocalUser(loginData.user, hashed.passHash, hashed.passSalt);
    });
  }
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

function medhubMarkFreshLogin () {
  try { sessionStorage.setItem(MEDHUB_FRESH_LOGIN_KEY, '1'); } catch { /* ignore */ }
}

function medhubHasFreshLogin () {
  try { return sessionStorage.getItem(MEDHUB_FRESH_LOGIN_KEY) === '1'; } catch { return false; }
}

function medhubClearFreshLogin () {
  try { sessionStorage.removeItem(MEDHUB_FRESH_LOGIN_KEY); } catch { /* ignore */ }
}

async function medhubEnsureProfileOnboarding () {
  if (typeof medhubIsProfileSetupComplete !== 'function') return true;

  if (typeof medhubCloudSyncAvailable === 'function' && await medhubCloudSyncAvailable()) {
    const cloud = await medhubCloudFetchProfile();
    if (cloud.ok && cloud.profile) {
      medhubApplyCloudProfileLocal(cloud.profile);
    }
  }

  let profile = typeof medhubLoadUserProfile === 'function' ? medhubLoadUserProfile() : null;

  if (medhubIsProfileSetupComplete(profile)) {
    if (!profile.onboardingComplete && typeof medhubSaveUserProfileLocal === 'function') {
      profile = medhubSaveUserProfileLocal({ onboardingComplete: true });
      if (typeof medhubCloudSyncAvailable === 'function' && await medhubCloudSyncAvailable()) {
        await medhubCloudSaveProfile({ onboardingComplete: true });
      }
    }
    medhubClearFreshLogin();
    return true;
  }

  if (!medhubHasFreshLogin()) {
    window.location.href = 'login.html';
    return false;
  }

  medhubGoProfileOnboarding();
  return false;
}

async function medhubAfterCloudAuth (loginData, password) {
  medhubApplyCloudSession(loginData, password);
  medhubMarkFreshLogin();
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
    if (!(await medhubEnsureProfileOnboarding())) return true;
    authGoApp();
    return true;
  }

  const legal = loginData.user?.legal;
  const termsOk = legal?.termsVersion === config.termsVersion;
  const privacyOk = legal?.privacyVersion === config.privacyVersion;

  if (termsOk && privacyOk) {
    medhubAcceptLegalLocal(loginData.user.email, config);
    if (!(await medhubEnsureProfileOnboarding())) return true;
    authGoApp();
    return true;
  }

  medhubShowLegalModal(async () => {
    const cloudOk = await medhubCloudAcceptLegal();
    if (cloudOk) {
      medhubAcceptLegalLocal(loginData.user.email, config);
    } else {
      medhubAcceptLegalLocal(loginData.user.email, config);
    }
    if (!(await medhubEnsureProfileOnboarding())) return;
    authGoApp();
  });

  return true;
}
