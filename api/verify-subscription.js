const { json } = require('./_stripe');
const { getSubscriptionStatus } = require('./_subscription');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    json(res, 405, { error: 'Method not allowed' });
    return;
  }

  const email = String(req.query.email || '').trim().toLowerCase();
  if (!email) {
    json(res, 400, { error: 'Informe o e-mail.' });
    return;
  }

  try {
    const status = await getSubscriptionStatus(email);
    if (status.misconfigured) {
      json(res, 503, status);
      return;
    }
    json(res, 200, status);
  } catch (err) {
    json(res, 500, { error: err.message || 'Erro ao verificar assinatura' });
  }
};
