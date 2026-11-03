/* Plantão MedHub — suporte ao assinante (dúvidas do app) */

function medhubSupportNormalizePhone (value) {
  return String(value || '')
    .replace(/\D/g, '')
    .replace(/^0+/, '');
}

function medhubSupportFormatPhone (phone) {
  const p = medhubSupportNormalizePhone(phone);
  if (p.length === 11) return `(${p.slice(0, 2)}) ${p.slice(2, 7)}-${p.slice(7)}`;
  if (p.length === 10) return `(${p.slice(0, 2)}) ${p.slice(2, 6)}-${p.slice(6)}`;
  return p;
}

function medhubSupportEscapeHtml (value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function medhubSupportConfig () {
  const m = typeof MEDHUB_MARKETING !== 'undefined' ? MEDHUB_MARKETING : {};
  const phone = medhubSupportNormalizePhone(m.supportWhatsapp);
  const phoneAlt = medhubSupportNormalizePhone(m.supportWhatsappAlt);
  const email = String(m.supportEmail || '').trim();
  const hours = String(m.supportHours || 'Plantão 24 horas').trim() || 'Plantão 24 horas';
  const igUrl = String(m.instagramUrl || '').trim();
  const igHandle = String(m.instagramHandle || '@medhubpro').trim();
  return { phone, phoneAlt, email, hours, igUrl, igHandle };
}

/** Dados do assinante para identificação no plantão / mensagens. */
function medhubSupportUserContext () {
  const session = typeof getSession === 'function' ? getSession() : null;
  const profile = typeof medhubLoadUserProfile === 'function' ? medhubLoadUserProfile() : null;
  const access = typeof medhubGetUserAccess === 'function' ? medhubGetUserAccess() : null;

  const name = String(profile?.rxDisplayName || session?.name || '').trim();
  const email = String(session?.email || '').trim().toLowerCase();
  const userType = String(profile?.userType || '').trim();
  const crmUf = String(profile?.crmUf || '').trim().toUpperCase();
  const crmNumber = String(profile?.crmNumber || '').replace(/\D/g, '');
  const crm = crmNumber ? `CRM ${crmUf || '—'} ${crmNumber}` : '';

  let tipoLabel = '';
  if (typeof medhubUserTypeLabel === 'function' && userType) {
    tipoLabel = medhubUserTypeLabel(userType);
  } else if (userType === 'doctor') {
    tipoLabel = 'Médico(a)';
  } else if (userType === 'student') {
    tipoLabel = 'Estudante';
  }

  let acessoLabel = '';
  if (access?.active) {
    if (access.mode === 'full') acessoLabel = 'Acesso completo';
    else if (access.mode === 'partial') acessoLabel = 'Acesso parcial';
    else if (access.plan) acessoLabel = String(access.plan);
    else acessoLabel = 'Assinatura ativa';
  } else if (access && access.active === false) {
    acessoLabel = 'Sem assinatura ativa';
  }

  return { name, email, crm, tipoLabel, acessoLabel, userType };
}

function medhubSupportMessagePreset () {
  const u = medhubSupportUserContext();
  const lines = ['Olá! Sou assinante MedHub e preciso de ajuda com o app.'];
  if (u.name) lines.push(`Nome: ${u.name}`);
  if (u.email) lines.push(`E-mail: ${u.email}`);
  if (u.crm) lines.push(u.crm);
  if (u.tipoLabel) lines.push(`Perfil: ${u.tipoLabel}`);
  if (u.acessoLabel) lines.push(`Acesso: ${u.acessoLabel}`);
  lines.push('', 'Minha dúvida:', '');
  return lines.join('\n');
}

function medhubSupportWhatsappUrl (phone, preset) {
  if (!phone) return '';
  const digits = phone.startsWith('55') ? phone : '55' + phone;
  const text = encodeURIComponent(preset || medhubSupportMessagePreset());
  return `https://wa.me/${digits}?text=${text}`;
}

function medhubSupportMailto (email) {
  if (!email) return '';
  const subject = encodeURIComponent('Suporte MedHub — dúvida no app');
  const body = encodeURIComponent(medhubSupportMessagePreset());
  return `mailto:${email}?subject=${subject}&body=${body}`;
}

function medhubSupportWhatsappCard (phone, label, hours) {
  const wa = medhubSupportWhatsappUrl(phone);
  if (!wa) return '';
  return `
    <a class="suporte-channel suporte-channel--whatsapp" href="${wa}" target="_blank" rel="noopener noreferrer">
      <span class="suporte-channel-icon" aria-hidden="true">💬</span>
      <span class="suporte-channel-body">
        <strong>${label}</strong>
        <small>${medhubSupportFormatPhone(phone)} · ${hours}</small>
      </span>
      <span class="suporte-channel-cta">Abrir conversa →</span>
    </a>`;
}

function medhubSupportUserCardHtml () {
  const u = medhubSupportUserContext();
  if (!u.name && !u.email && !u.crm) {
    return `
      <div class="suporte-user-card suporte-user-card--empty">
        <strong>Sua conta</strong>
        <p class="muted">Faça login e complete o perfil para enviar seus dados junto com a dúvida.</p>
      </div>`;
  }

  const rows = [];
  if (u.name) {
    rows.push(`<div class="suporte-user-row"><span>Nome</span><strong>${medhubSupportEscapeHtml(u.name)}</strong></div>`);
  }
  if (u.email) {
    rows.push(`<div class="suporte-user-row"><span>E-mail</span><strong>${medhubSupportEscapeHtml(u.email)}</strong></div>`);
  }
  if (u.crm) {
    rows.push(`<div class="suporte-user-row"><span>CRM</span><strong>${medhubSupportEscapeHtml(u.crm)}</strong></div>`);
  }
  if (u.tipoLabel) {
    rows.push(`<div class="suporte-user-row"><span>Perfil</span><strong>${medhubSupportEscapeHtml(u.tipoLabel)}</strong></div>`);
  }
  if (u.acessoLabel) {
    rows.push(`<div class="suporte-user-row"><span>Acesso</span><strong>${medhubSupportEscapeHtml(u.acessoLabel)}</strong></div>`);
  }

  return `
    <div class="suporte-user-card">
      <div class="suporte-user-card-head">
        <strong>Seus dados nesta conversa</strong>
        <small class="muted">Já vão no WhatsApp e no e-mail para agilizar o atendimento</small>
      </div>
      <div class="suporte-user-rows">${rows.join('')}</div>
    </div>`;
}

function medhubRenderSupportPlantao () {
  const root = document.getElementById('suporte-plantao-content');
  if (!root) return;

  const { phone, phoneAlt, email, hours, igUrl, igHandle } = medhubSupportConfig();
  const mail = medhubSupportMailto(email);
  const channels = [];

  if (phone) {
    channels.push(medhubSupportWhatsappCard(phone, 'WhatsApp — canal principal', hours));
  }
  if (phoneAlt && phoneAlt !== phone) {
    channels.push(medhubSupportWhatsappCard(phoneAlt, 'WhatsApp — alternativo', hours));
  }

  if (mail) {
    channels.push(`
      <a class="suporte-channel suporte-channel--email" href="${mail}">
        <span class="suporte-channel-icon" aria-hidden="true">✉️</span>
        <span class="suporte-channel-body">
          <strong>E-mail</strong>
          <small>${medhubSupportEscapeHtml(email)}</small>
        </span>
        <span class="suporte-channel-cta">Escrever →</span>
      </a>`);
  }

  if (igUrl) {
    channels.push(`
      <a class="suporte-channel suporte-channel--ig" href="${medhubSupportEscapeHtml(igUrl)}" target="_blank" rel="noopener noreferrer">
        <span class="suporte-channel-icon" aria-hidden="true">📸</span>
        <span class="suporte-channel-body">
          <strong>Instagram</strong>
          <small>${medhubSupportEscapeHtml(igHandle)}</small>
        </span>
        <span class="suporte-channel-cta">Abrir →</span>
      </a>`);
  }

  const emptyHint = !channels.length
    ? `<p class="suporte-empty muted">Canais ainda não configurados. No admin → Marketing, informe WhatsApp e/ou e-mail de suporte.</p>`
    : '';

  root.innerHTML = `
    <div class="suporte-hero">
      <p class="suporte-badge"><span class="suporte-badge-dot" aria-hidden="true"></span> ${medhubSupportEscapeHtml(hours)}</p>
      <h2>Plantão MedHub</h2>
      <p class="muted">Dúvida no app, assinatura ou acesso? Fale com a equipe — como um plantão de suporte ao assinante.</p>
    </div>
    ${medhubSupportUserCardHtml()}
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
  const { phone, phoneAlt, email } = medhubSupportConfig();
  fab.hidden = !(phone || phoneAlt || email);
  fab.classList.toggle('is-ready', !!(phone || phoneAlt || email));
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
