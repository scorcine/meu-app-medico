const { kv } = require('@vercel/kv');
const { cloudAuthEnabled, normalizeEmail, verifyPassword } = require('./_auth');

const CRM_UFS = new Set([
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
]);

const IDENTITY_FIELDS = ['rxDisplayName', 'crmUf', 'crmNumber'];

function profileKey (email) {
  return 'medhub:profile:' + normalizeEmail(email);
}

function defaultProfile (sessionName) {
  return {
    rxDisplayName: String(sessionName || '').trim(),
    crmUf: 'SP',
    crmNumber: '',
    address: '',
    addressCity: '',
    addressState: '',
    addressZip: '',
    identityLocked: false,
    updatedAt: null
  };
}

function normalizeProfile (raw, sessionName) {
  const base = defaultProfile(sessionName);
  if (!raw || typeof raw !== 'object') return base;

  const profile = {
    ...base,
    rxDisplayName: String(raw.rxDisplayName ?? base.rxDisplayName).trim(),
    crmUf: String(raw.crmUf || base.crmUf).toUpperCase().slice(0, 2),
    crmNumber: String(raw.crmNumber || '').replace(/\D/g, ''),
    address: String(raw.address || '').trim(),
    addressCity: String(raw.addressCity || '').trim(),
    addressState: String(raw.addressState || '').toUpperCase().slice(0, 2),
    addressZip: String(raw.addressZip || '').trim(),
    identityLocked: !!raw.identityLocked,
    updatedAt: raw.updatedAt || null
  };

  if (!CRM_UFS.has(profile.crmUf)) profile.crmUf = 'SP';
  return profile;
}

function identityConfigured (profile) {
  return !!(profile.rxDisplayName && profile.crmNumber);
}

function identityChanged (current, next) {
  return IDENTITY_FIELDS.some(field => String(current[field] || '') !== String(next[field] || ''));
}

async function getProfessionalProfile (email, sessionName) {
  if (!cloudAuthEnabled()) return null;
  const stored = await kv.get(profileKey(email));
  return normalizeProfile(stored, sessionName);
}

async function saveProfessionalProfile (email, updates, options = {}) {
  if (!cloudAuthEnabled()) throw new Error('Armazenamento na nuvem não configurado.');

  const { user, currentPassword, sessionName } = options;
  const current = await getProfessionalProfile(email, sessionName);
  const next = normalizeProfile({ ...current, ...updates }, sessionName);

  const locked = current.identityLocked || identityConfigured(current);
  const changingIdentity = identityChanged(current, next);

  if (locked && changingIdentity) {
    if (!currentPassword || !user || !verifyPassword(currentPassword, user)) {
      const err = new Error('Senha atual incorreta.');
      err.code = 'password_required';
      throw err;
    }
  }

  if (!locked && identityConfigured(next)) {
    next.identityLocked = true;
  } else {
    next.identityLocked = locked;
  }

  next.updatedAt = new Date().toISOString();
  await kv.set(profileKey(email), next);
  return next;
}

function publicProfile (profile) {
  if (!profile) return null;
  return {
    rxDisplayName: profile.rxDisplayName,
    crmUf: profile.crmUf,
    crmNumber: profile.crmNumber,
    address: profile.address,
    addressCity: profile.addressCity,
    addressState: profile.addressState,
    addressZip: profile.addressZip,
    identityLocked: profile.identityLocked,
    updatedAt: profile.updatedAt
  };
}

module.exports = {
  defaultProfile,
  normalizeProfile,
  identityConfigured,
  getProfessionalProfile,
  saveProfessionalProfile,
  publicProfile
};
