const { cloudAuthEnabled, json } = require('./_auth');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    json(res, 405, { error: 'Method not allowed' });
    return;
  }

  json(res, 200, {
    cloudEnabled: cloudAuthEnabled(),
    termsVersion: process.env.MEDHUB_TERMS_VERSION || '2026-06-07-v1',
    privacyVersion: process.env.MEDHUB_PRIVACY_VERSION || '2026-06-07-v1'
  });
};
