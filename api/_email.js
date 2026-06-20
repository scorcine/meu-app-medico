const { siteOrigin } = require('./_stripe');

async function sendPasswordResetEmail (toEmail, resetUrl) {
  return sendEmail({
    to: toEmail,
    subject: 'Redefinir senha — MedHub',
    html: buildResetEmailHtml(resetUrl)
  });
}

async function sendCourtesyExpiringEmail ({ toEmail, name, daysLeft, endsAt, hasUsedApp, subscribeUrl }) {
  const dateStr = new Date(endsAt).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const greeting = name ? ('Olá, ' + escapeHtml(name) + '.') : 'Olá.';
  const subject = daysLeft <= 1
    ? 'Sua cortesia MedHub acaba amanhã'
    : 'Faltam ' + daysLeft + ' dias da sua cortesia MedHub';

  let body;
  if (!hasUsedApp) {
    body = '<p>Sua cortesia termina em <strong>' + dateStr + '</strong>, mas você ainda não explorou o app no plantão.</p>' +
      '<p>Experimente <strong>Prescrições de PS</strong>, <strong>Receituário</strong> e <strong>Calculadoras</strong> antes de perder o acesso.</p>';
  } else {
    body = '<p>Sua cortesia termina em <strong>' + dateStr + '</strong>.</p>' +
      '<p>Você já usa o MedHub no plantão — protocolos, prescrição interativa e calculadoras num só lugar.</p>' +
      '<p>Assine para <strong>não perder acesso</strong> quando a cortesia acabar.</p>';
  }

  return sendEmail({
    to: toEmail,
    subject,
    html: buildGenericEmailHtml({
      title: 'Cortesia MedHub',
      greeting,
      bodyHtml: body,
      ctaLabel: 'Assinar MedHub Pro',
      ctaUrl: subscribeUrl,
      footnote: 'Este e-mail é enviado automaticamente quando sua cortesia está perto do fim.'
    })
  });
}

async function sendEmail ({ to, subject, html }) {
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
      to: [to],
      subject,
      html
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

function escapeHtml (value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildGenericEmailHtml ({ title, greeting, bodyHtml, ctaLabel, ctaUrl, footnote }) {
  return (
    '<div style="font-family:sans-serif;max-width:520px;margin:0 auto;line-height:1.55;color:#1a2b3c">' +
    '<h2 style="color:#0d6efd;margin:0 0 12px">' + escapeHtml(title) + '</h2>' +
    '<p style="margin:0 0 12px">' + greeting + '</p>' +
    bodyHtml +
    (ctaUrl
      ? '<p style="margin:20px 0"><a href="' + ctaUrl + '" style="display:inline-block;background:#0d6efd;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600">' + escapeHtml(ctaLabel) + '</a></p>'
      : '') +
    (footnote ? '<p style="font-size:13px;color:#64748b;margin:16px 0 0">' + escapeHtml(footnote) + '</p>' : '') +
    '</div>'
  );
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
  sendCourtesyExpiringEmail,
  passwordResetEmailConfigured,
  buildResetUrl
};
