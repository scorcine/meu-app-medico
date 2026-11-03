/* Plantão MedHub — suporte ao assinante (dúvidas do app) */

function medhubSupportConfig () {
  const m = typeof MEDHUB_MARKETING !== 'undefined' ? MEDHUB_MARKETING : {};
  const phone = String(m.supportWhatsapp || '')
    .replace(/\D/g, '')
    .replace(/^0+/, '');
  const email = String(m.supportEmail || '').trim();
  const hours = String(m.supportHours || 'Plantão 24 horas').trim() || 'Plantão 24 horas';
  const igUrl = String(m.instagramUrl || '').trim();
  const igHandle = String(m.instagramHandle || '@medhub_app').trim();
  return { phone, email, hours, igUrl, igHandle };
}

function medhubSupportWhatsappUrl (phone, preset) {
  if (!phone) return '';
  const digits = phone.startsWith('55') ? phone : '55' + phone;
  const text = encodeURIComponent(
    preset || 'Olá! Sou assinante MedHub e preciso de ajuda com o app.'
  );
  return `https://wa.me/${digits}?text=${text}`;
}

function medhubSupportMailto (email) {
  if (!email) return '';
  const subject = encodeURIComponent('Suporte MedHub — dúvida no app');
  const body = encodeURIComponent(
    'Olá equipe MedHub,\n\nSou assinante e tenho a seguinte dúvida:\n\n'
  );
  return `mailto:${email}?subject=${subject}&body=${body}`;
}

function medhubRenderSupportPlantao () {
  const root = document.getElementById('suporte-plantao-content');
  if (!root) return;

  const { phone, email, hours, igUrl, igHandle } = medhubSupportConfig();
  const wa = medhubSupportWhatsappUrl(phone);
  const mail = medhubSupportMailto(email);
  const channels = [];

  if (wa) {
    channels.push(`
      <a class="suporte-channel suporte-channel--whatsapp" href="${wa}" target="_blank" rel="noopener noreferrer">
        <span class="suporte-channel-icon" aria-hidden="true">💬</span>
        <span class="suporte-channel-body">
          <strong>WhatsApp — canal principal</strong>
          <small>Resposta rápida · ${hours}</small>
        </span>
        <span class="suporte-channel-cta">Abrir conversa →</span>
      </a>`);
  }

  if (mail) {
    channels.push(`
      <a class="suporte-channel suporte-channel--email" href="${mail}">
        <span class="suporte-channel-icon" aria-hidden="true">✉️</span>
        <span class="suporte-channel-body">
          <strong>E-mail</strong>
          <small>${email}</small>
        </span>
        <span class="suporte-channel-cta">Escrever →</span>
      </a>`);
  }

  if (igUrl) {
    channels.push(`
      <a class="suporte-channel suporte-channel--ig" href="${igUrl}" target="_blank" rel="noopener noreferrer">
        <span class="suporte-channel-icon" aria-hidden="true">📸</span>
        <span class="suporte-channel-body">
          <strong>Instagram</strong>
          <small>${igHandle}</small>
        </span>
        <span class="suporte-channel-cta">Abrir →</span>
      </a>`);
  }

  const emptyHint = !channels.length
    ? `<p class="suporte-empty muted">Canais ainda não configurados. No admin → Marketing, informe WhatsApp e/ou e-mail de suporte.</p>`
    : '';

  root.innerHTML = `
    <div class="suporte-hero">
      <p class="suporte-badge"><span class="suporte-badge-dot" aria-hidden="true"></span> ${hours}</p>
      <h2>Plantão MedHub</h2>
      <p class="muted">Dúvida no app, assinatura ou acesso? Fale com a equipe — como um plantão de suporte ao assinante.</p>
    </div>
    <div class="suporte-channels" role="list">
      ${channels.join('') || emptyHint}
    </div>
    <aside class="suporte-note" role="note">
      <strong>Escopo do plantão:</strong> dúvidas sobre o MedHub (uso, conta, assinatura, bugs).
      Não é teleconsulta nem orientação clínica para o paciente — o app é apoio educacional à decisão do médico.
    </aside>`;
}

function medhubEnsureSupportFab () {
  if (document.getElementById('medhub-support-fab')) return;
  const fab = document.createElement('button');
  fab.id = 'medhub-support-fab';
  fab.type = 'button';
  fab.className = 'medhub-support-fab';
  fab.title = 'Plantão MedHub — suporte';
  fab.setAttribute('aria-label', 'Abrir plantão de suporte MedHub');
  fab.innerHTML = '<span aria-hidden="true">💬</span><span class="medhub-support-fab-label">Plantão</span>';
  fab.addEventListener('click', () => {
    if (typeof showSection === 'function') showSection('suporte-plantao');
  });
  document.body.appendChild(fab);
}

function medhubRefreshSupportFab () {
  const fab = document.getElementById('medhub-support-fab');
  if (!fab) return;
  const { phone, email } = medhubSupportConfig();
  fab.hidden = !(phone || email);
  fab.classList.toggle('is-ready', !!(phone || email));
}

function initSuportePlantao () {
  medhubRenderSupportPlantao();
  medhubEnsureSupportFab();
  medhubRefreshSupportFab();
}

function medhubOnSupportSectionShow () {
  medhubRenderSupportPlantao();
  medhubRefreshSupportFab();
}
