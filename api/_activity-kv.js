const { kv } = require('@vercel/kv');
const { cloudAuthEnabled, normalizeEmail } = require('./_auth');

function activityKey (email) {
  return 'medhub:activity:' + normalizeEmail(email);
}

function emptyActivity () {
  return {
    firstActiveAt: null,
    lastActiveAt: null,
    sessionCount: 0,
    loginCount: 0,
    totalPings: 0,
    sections: {}
  };
}

async function getUserActivity (email) {
  if (!cloudAuthEnabled()) return emptyActivity();
  const stored = await kv.get(activityKey(email));
  if (!stored || typeof stored !== 'object') return emptyActivity();
  return {
    ...emptyActivity(),
    ...stored,
    sections: stored.sections && typeof stored.sections === 'object' ? stored.sections : {}
  };
}

async function recordUserActivity (email, section) {
  if (!cloudAuthEnabled()) return emptyActivity();

  const norm = normalizeEmail(email);
  if (!norm) return emptyActivity();

  const now = new Date().toISOString();
  const current = await getUserActivity(norm);
  const sections = { ...current.sections };
  const sec = String(section || 'app').trim().slice(0, 64) || 'app';

  sections[sec] = (Number(sections[sec]) || 0) + 1;

  const next = {
    firstActiveAt: current.firstActiveAt || now,
    lastActiveAt: now,
    sessionCount: sec === 'session_start'
      ? (Number(current.sessionCount) || 0) + 1
      : (Number(current.sessionCount) || 0),
    loginCount: sec === 'login'
      ? (Number(current.loginCount) || 0) + 1
      : (Number(current.loginCount) || 0),
    totalPings: (Number(current.totalPings) || 0) + 1,
    sections
  };

  await kv.set(activityKey(norm), next);
  return next;
}

function activityHasRealUsage (activity, registeredAt) {
  if (!activity) return false;
  if (Object.keys(activity.sections || {}).filter(k => k !== 'session_start' && k !== 'app').length > 0) {
    return true;
  }
  if ((Number(activity.sessionCount) || 0) > 1) return true;
  if ((Number(activity.totalPings) || 0) >= 3) return true;
  if (activity.lastActiveAt && registeredAt) {
    const gap = new Date(activity.lastActiveAt) - new Date(registeredAt);
    if (gap > 5 * 60 * 1000) return true;
  }
  return false;
}

function publicActivity (activity, registeredAt) {
  const a = activity || emptyActivity();
  const sectionNames = Object.keys(a.sections || {}).filter(k => k !== 'session_start');
  return {
    lastActiveAt: a.lastActiveAt,
    firstActiveAt: a.firstActiveAt,
    sessionCount: Number(a.sessionCount) || 0,
    loginCount: Number(a.loginCount) || 0,
    totalPings: Number(a.totalPings) || 0,
    sectionsUsed: sectionNames,
    hasUsedApp: activityHasRealUsage(a, registeredAt)
  };
}

module.exports = {
  getUserActivity,
  recordUserActivity,
  activityHasRealUsage,
  publicActivity
};
