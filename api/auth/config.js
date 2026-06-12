const { cloudAuthEnabled, json } = require('../_auth');
const { getPlatformStatus } = require('../_platform');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    json(res, 405, { error: 'Method not allowed' });
    return;
  }

  const platform = getPlatformStatus();

  json(res, 200, {
    cloudEnabled: cloudAuthEnabled(),
    production: platform.production,
    ready: platform.ready,
    misconfigured: platform.misconfigured,
    authMisconfigured: platform.authMisconfigured,
    allowDevBypass: platform.allowDevBypass,
    termsVersion: process.env.MEDHUB_TERMS_VERSION || '2026-06-07-v2',
    privacyVersion: process.env.MEDHUB_PRIVACY_VERSION || '2026-06-07-v2',
    passwordResetEnabled: !!process.env.RESEND_API_KEY
  });
};
