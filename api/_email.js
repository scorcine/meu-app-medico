const { siteOrigin } = require('./_stripe');

async function sendPasswordResetEmail (toEmail, resetUrl) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MEDHUB_EMAIL_FROM || 'MedHub <onboarding@resend.dev>';

  if (!apiKey) {
    const err = new Error('E-mail não configurado no servidor (RESEND_API_KEY).');
    err.code = 'email_not_configured';
    throw err;
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from,
      to: [toEmail],
      subject: 'Redefinir senha — MedHub',
      html: buildResetEmailHtml(resetUrl)
    })
  });

  if (!res.ok) {
    let detail = '';
    try {
      const body = await res.json();
      detail = body.message || body.error || JSON.stringify(body);
    } catch {
      detail = res.statusText;
    }
    const err = new Error('Falha ao enviar e-mail: ' + detail);
    err.code = 'email_send_failed';
    throw err;
  }

  return res.json();
}

function buildResetEmailHtml (resetUrl) {
  return (
    '<div style="font-family:sans-serif;max-width:520px;margin:0 auto;line-height:1.5">' +
    '<h2 style="color:#0d9488">MedHub — redefinir senha</h2>' +
    '<p>Recebemos um pedido para redefinir a senha da sua conta MedHub Pro.</p>' +
    '<p><a href="' + resetUrl + '" style="display:inline-block;background:#0d9488;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none">Criar nova senha</a></p>' +
    '<p style="font-size:14px;color:#666">O link expira em 1 hora. Se você não pediu isso, ignore este e-mail.</p>' +
    '<p style="font-size:13px;color:#888"><strong>Importante:</strong> anamneses criptografadas com a senha antiga ' +
    'não podem ser recuperadas após redefinição por e-mail. Dados na nuvem MedHub serão resetados.</p>' +
    '<p style="font-size:12px;color:#aaa">' + resetUrl + '</p>' +
    '</div>'
  );
}

function passwordResetEmailConfigured () {
  return !!process.env.RESEND_API_KEY;
}

function buildResetUrl (req, token) {
  const base = process.env.MEDHUB_SITE_URL || siteOrigin(req);
  return base.replace(/\/$/, '') + '/reset-password.html?token=' + encodeURIComponent(token);
}

module.exports = {
  sendPasswordResetEmail,
  passwordResetEmailConfigured,
  buildResetUrl
};
