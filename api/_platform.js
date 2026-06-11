const { billingEnabled } = require('./_stripe');
const { cloudAuthEnabled } = require('./_auth');

/** Produção Vercel ou flag explícita */
function isProductionDeploy () {
  return (
    process.env.VERCEL_ENV === 'production' ||
    process.env.MEDHUB_PRODUCTION === 'true'
  );
}

/**
 * Bypass gratuito (sem Stripe/KV) só em preview/local ou com flag explícita.
 * Nunca em VERCEL_ENV=production.
 */
function allowDevBypass () {
  if (process.env.MEDHUB_ALLOW_DEV_BYPASS === 'true') return true;
  if (isProductionDeploy()) return false;
  return true;
}

function getMissingConfig () {
  const missing = [];
  if (!process.env.STRIPE_SECRET_KEY) missing.push('STRIPE_SECRET_KEY');
  if (!process.env.STRIPE_PRICE_MONTHLY) missing.push('STRIPE_PRICE_MONTHLY');
  if (!process.env.STRIPE_PRICE_ANNUAL) missing.push('STRIPE_PRICE_ANNUAL');
  if (!process.env.MEDHUB_JWT_SECRET) missing.push('MEDHUB_JWT_SECRET');
  if (!process.env.KV_REST_API_URL) missing.push('KV_REST_API_URL');
  if (!process.env.KV_REST_API_TOKEN) missing.push('KV_REST_API_TOKEN');
  return missing;
}

function getPlatformStatus () {
  const billingConfigured = billingEnabled();
  const authConfigured = cloudAuthEnabled();
  const production = isProductionDeploy();
  const ready = billingConfigured && authConfigured;
  const billingMisconfigured = production && !billingConfigured;
  const authMisconfigured = production && !authConfigured;
  const misconfigured = production && !ready;
  const devBypass = allowDevBypass();

  return {
    production,
    ready,
    misconfigured,
    billingMisconfigured,
    authMisconfigured,
    billingConfigured,
    authConfigured,
    allowDevBypass: devBypass,
    missing: getMissingConfig(),
    missingAuth: getMissingConfig().filter(k => k.startsWith('KV_') || k === 'MEDHUB_JWT_SECRET'),
    missingBilling: getMissingConfig().filter(k => k.startsWith('STRIPE_'))
  };
}

function platformUnavailableMessage () {
  const status = getPlatformStatus();
  if (!status.misconfigured) return null;
  return (
    'MedHub Pro indisponível: configure na Vercel — ' +
    status.missing.join(', ')
  );
}

module.exports = {
  isProductionDeploy,
  allowDevBypass,
  getMissingConfig,
  getPlatformStatus,
  platformUnavailableMessage
};
