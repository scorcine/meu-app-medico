const { kv } = require('@vercel/kv');
const { cloudAuthEnabled, normalizeEmail } = require('./_auth');
const { passwordResetEmailConfigured, sendCourtesyExpiringEmail } = require('./_email');
const { activityHasRealUsage } = require('./_activity-kv');

const EMAIL_THRESHOLDS = [7, 3, 1];
const BANNER_THRESHOLD_DAYS = 7;

function retentionSentKey (email, days) {
  return 'medhub:retention:sent:' + normalizeEmail(email) + ':' + days;
}

function daysUntilDate (iso) {
  if (!iso) return null;
  const end = new Date(iso);
  if (Number.isNaN(end.getTime())) return null;
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.max(0, Math.ceil((endDay - startToday) / (24 * 60 * 60 * 1000)));
}

function formatDatePt (iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' });
}

function buildRetentionBanner (subscription, activity, user) {
  if (!subscription?.isCourtesy || !subscription?.courtesyEndsAt) return null;

  const daysLeft = daysUntilDate(subscription.courtesyEndsAt);
  if (daysLeft == null || daysLeft > BANNER_THRESHOLD_DAYS) return null;

  const dateStr = formatDatePt(subscription.courtesyEndsAt);
  const used = activityHasRealUsage(activity, user?.createdAt);
  const site = (process.env.MEDHUB_SITE_URL || 'https://www.medhub.ia.br').replace(/\/$/, '');

  let headline;
  let detail;

  if (!used) {
    headline = daysLeft === 0
      ? 'Sua cortesia acaba hoje — experimente o app antes de perder o acesso.'
      : 'Faltam ' + daysLeft + ' dia' + (daysLeft === 1 ? '' : 's') + ' de cortesia e você ainda não usou o MedHub no plantão.';
    detail = 'Abra Prescrições de PS, Receituário ou Calculadoras — é para isso que o app existe.';
  } else if (daysLeft === 0) {
    headline = 'Sua cortesia expira hoje (' + dateStr + ').';
    detail = 'Protocolos, prescrição interativa e calculadoras somem amanhã se você não assinar.';
  } else if (daysLeft === 1) {
    headline = 'Falta 1 dia de cortesia — expira amanhã (' + dateStr + ').';
    detail = 'Você já usa o MedHub no plantão. Assine para manter protocolos, receituário e calculadoras.';
  } else {
    headline = 'Faltam ' + daysLeft + ' dias de cortesia — expira em ' + dateStr + '.';
    detail = 'No plantão, MedHub reúne protocolos de PS, prescrição e calculadoras. Assine para não perder acesso.';
  }

  return {
    daysLeft,
    urgency: daysLeft <= 1 ? 'high' : daysLeft <= 3 ? 'medium' : 'normal',
    headline,
    detail,
    hasUsedApp: used,
    subscribeUrl: site + '/index.html#planos'
  };
}

async function maybeSendRetentionEmails (email, subscription, activity, user) {
  if (!cloudAuthEnabled() || !passwordResetEmailConfigured()) {
    return { sent: [], skipped: 'email_not_configured' };
  }
  if (!subscription?.isCourtesy || !subscription?.courtesyEndsAt) {
    return { sent: [], skipped: 'not_courtesy' };
  }

  const daysLeft = daysUntilDate(subscription.courtesyEndsAt);
  if (daysLeft == null) return { sent: [], skipped: 'no_date' };

  const sent = [];
  const used = activityHasRealUsage(activity, user?.createdAt);
  const site = (process.env.MEDHUB_SITE_URL || 'https://www.medhub.ia.br').replace(/\/$/, '');

  for (const threshold of EMAIL_THRESHOLDS) {
    if (daysLeft !== threshold) continue;
    const key = retentionSentKey(email, threshold);
    const already = await kv.get(key);
    if (already) continue;

    await sendCourtesyExpiringEmail({
      toEmail: email,
      name: user?.name || '',
      daysLeft: threshold,
      endsAt: subscription.courtesyEndsAt,
      hasUsedApp: used,
      subscribeUrl: site + '/index.html#planos'
    });

    await kv.set(key, new Date().toISOString(), { ex: 60 * 60 * 24 * 45 });
    sent.push(threshold);
  }

  return { sent };
}

async function processRetentionPing (email, subscription, activity, user) {
  const banner = buildRetentionBanner(subscription, activity, user);
  const emailResult = await maybeSendRetentionEmails(email, subscription, activity, user);
  return { banner, email: emailResult };
}

module.exports = {
  daysUntilDate,
  buildRetentionBanner,
  maybeSendRetentionEmails,
  processRetentionPing,
  BANNER_THRESHOLD_DAYS
};
