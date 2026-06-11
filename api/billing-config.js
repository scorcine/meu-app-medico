const { billingEnabled, json } = require('./_stripe');

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

  json(res, 200, {
    enabled: billingEnabled(),
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
