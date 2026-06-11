const { billingEnabled, json } = require('./_stripe');
const { getPlatformStatus } = require('./_platform');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    json(res, 405, { error: 'Method not allowed' });
    return;
  }

  const monthly = Number(process.env.MEDHUB_PRICE_MONTHLY_CENTS || 2990);
  const annual = Number(process.env.MEDHUB_PRICE_ANNUAL_CENTS || 30498);
  const monthlyDisplay = process.env.MEDHUB_PRICE_MONTHLY_DISPLAY || formatBrl(monthly);
  const annualDisplay = process.env.MEDHUB_PRICE_ANNUAL_DISPLAY || formatBrl(annual);
  const fullYear = monthly * 12;
  const discountPercent = fullYear > 0
    ? Math.round((1 - annual / fullYear) * 100)
    : 15;

  const platform = getPlatformStatus();

  json(res, 200, {
    enabled: billingEnabled(),
    checkoutEnabled: billingEnabled(),
    production: platform.production,
    ready: platform.ready,
    misconfigured: platform.misconfigured,
    billingMisconfigured: platform.billingMisconfigured,
    authMisconfigured: platform.authMisconfigured,
    authConfigured: platform.authConfigured,
    allowDevBypass: platform.allowDevBypass,
    missing: platform.misconfigured ? platform.missing : undefined,
    missingAuth: platform.authMisconfigured ? platform.missingAuth : undefined,
    missingBilling: platform.billingMisconfigured ? platform.missingBilling : undefined,
    currency: 'BRL',
    monthlyDisplay,
    annualDisplay,
    monthlyPerMonth: monthlyDisplay + '/mês',
    annualPerYear: annualDisplay + '/ano',
    annualDiscountPercent: discountPercent,
    annualSavingsDisplay: formatBrl(Math.max(0, fullYear - annual)),
    trialDays: Number(process.env.MEDHUB_TRIAL_DAYS || 0),
    guaranteeDays: Number(process.env.MEDHUB_GUARANTEE_DAYS || 7)
  });
};

function formatBrl (cents) {
  return 'R$ ' + (cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
