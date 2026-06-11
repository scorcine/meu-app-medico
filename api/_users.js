const { kv } = require('@vercel/kv');
const { cloudAuthEnabled, userKey, normalizeEmail } = require('./_auth');

async function getUser (email) {
  if (!cloudAuthEnabled()) return null;
  return kv.get(userKey(email));
}

async function saveUser (user) {
  if (!cloudAuthEnabled()) throw new Error('Armazenamento na nuvem não configurado.');
  await kv.set(userKey(user.email), user);
}

async function userExists (email) {
  const user = await getUser(email);
  return !!user;
}

function publicUser (user) {
  if (!user) return null;
  return {
    name: user.name,
    email: user.email,
    legal: {
      termsVersion: user.termsVersion || null,
      privacyVersion: user.privacyVersion || null,
      accepted: !!(user.termsVersion && user.privacyVersion)
    },
    createdAt: user.createdAt || null
  };
}

module.exports = {
  getUser,
  saveUser,
  userExists,
  publicUser,
  normalizeEmail
};
