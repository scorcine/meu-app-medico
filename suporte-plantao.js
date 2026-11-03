/* Plantão MedHub — auxílio na interpretação (exame / ECG) */

const MEDHUB_SUPPORT_TOPICS = [
  'Exame de Imagem',
  'Exame físico',
  'Exame Laboratorial',
  'ECG'
];

let _medhubSupportTopic = '';

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

function medhubSupportSelectedTopic () {
  const picked = String(_medhubSupportTopic || '').trim();
  return MEDHUB_SUPPORT_TOPICS.includes(picked) ? picked : '';
}

function medhubSupportMessagePreset (topic) {
  const u = medhubSupportUserContext();
  const tema = String(topic || medhubSupportSelectedTopic() || '').trim();
  const lines = [
    tema
      ? `Olá, sou usuário do MedHub app e preciso de um auxílio na interpretação de ${tema}.`
      : 'Olá, sou usuário do MedHub app e preciso de um auxílio na interpretação.'
  ];
  if (u.name) lines.push(`Nome: ${u.name}`);
  if (u.email) lines.push(`E-mail: ${u.email}`);
  if (u.crm) lines.push(u.crm);
  if (u.tipoLabel) lines.push(`Perfil: ${u.tipoLabel}`);
  if (u.acessoLabel) lines.push(`Acesso: ${u.acessoLabel}`);
  lines.push('', 'Detalhes / dúvida:', '');
  return lines.join('\n');
}

function medhubSupportWhatsappUrl (phone, topic) {
  if (!phone) return '';
  const digits = phone.startsWith('55') ? phone : '55' + phone;
  const text = encodeURIComponent(medhubSupportMessagePreset(topic));
  return `https://wa.me/${digits}?text=${text}`;
}

function medhubSupportMailto (email, topic) {
  if (!email) return '';
  const tema = String(topic || medhubSupportSelectedTopic() || 'interpretação');
  const subject = encodeURIComponent(`Plantão MedHub — ${tema}`);
  const body = encodeURIComponent(medhubSupportMessagePreset(topic));
  return `mailto:${email}?subject=${subject}&body=${body}`;
}

function medhubSupportWhatsappCard (phone, label, hours) {
  if (!phone) return '';
  return `
    <a class="suporte-channel suporte-channel--whatsapp" data-support-channel="whatsapp" data-support-phone="${medhubSupportEscapeHtml(phone)}" href="#" target="_blank" rel="noopener noreferrer">
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

function medhubSupportTopicPickerHtml () {
  const selected = medhubSupportSelectedTopic();
  const options = MEDHUB_SUPPORT_TOPICS.map((topic) => {
    const active = topic === selected ? ' is-active' : '';
    return `<button type="button" class="suporte-topic-btn${active}" data-support-topic="${medhubSupportEscapeHtml(topic)}" aria-pressed="${topic === selected ? 'true' : 'false'}">${medhubSupportEscapeHtml(topic)}</button>`;
  }).join('');

  return `
    <div class="suporte-topic-card">
      <div class="suporte-user-card-head">
        <strong>Preciso de auxílio na interpretação de</strong>
        <small class="muted">Escolha uma opção antes de abrir o WhatsApp ou o e-mail</small>
      </div>
      <div class="suporte-topic-grid" role="group" aria-label="Tipo de interpretação">${options}</div>
      <p id="suporte-topic-hint" class="suporte-topic-hint muted"${selected ? ' hidden' : ''}>Selecione o tipo de exame para montar a mensagem.</p>
      <p id="suporte-topic-preview" class="suporte-topic-preview"${selected ? '' : ' hidden'}>
        <span class="muted">Mensagem:</span>
        <em id="suporte-topic-preview-text"></em>
      </p>
    </div>`;
}

function medhubSupportRefreshChannelLinks () {
  const root = document.getElementById('suporte-plantao-content');
  if (!root) return;
  const topic = medhubSupportSelectedTopic();
  const { email } = medhubSupportConfig();
  const hint = root.querySelector('#suporte-topic-hint');
  const preview = root.querySelector('#suporte-topic-preview');
  const previewText = root.querySelector('#suporte-topic-preview-text');

  if (hint) hint.hidden = !!topic;
  if (preview) preview.hidden = !topic;
  if (previewText && topic) {
    previewText.textContent = `Olá, sou usuário do MedHub app e preciso de um auxílio na interpretação de ${topic}.`;
  }

  root.querySelectorAll('[data-support-channel="whatsapp"]').forEach((el) => {
    const phone = el.getAttribute('data-support-phone') || '';
    if (topic && phone) {
      el.href = medhubSupportWhatsappUrl(phone, topic);
      el.classList.remove('is-disabled');
      el.setAttribute('aria-disabled', 'false');
    } else {
      el.href = '#';
      el.classList.add('is-disabled');
      el.setAttribute('aria-disabled', 'true');
    }
  });

  root.querySelectorAll('[data-support-channel="email"]').forEach((el) => {
    if (topic && email) {
      el.href = medhubSupportMailto(email, topic);
      el.classList.remove('is-disabled');
      el.setAttribute('aria-disabled', 'false');
    } else {
      el.href = '#';
      el.classList.add('is-disabled');
      el.setAttribute('aria-disabled', 'true');
    }
  });
}

function medhubSupportBindInteractions () {
  const root = document.getElementById('suporte-plantao-content');
  if (!root || root.dataset.supportBound === '1') return;
  root.dataset.supportBound = '1';

  root.addEventListener('click', (event) => {
    const topicBtn = event.target.closest('[data-support-topic]');
    if (topicBtn) {
      event.preventDefault();
      _medhubSupportTopic = topicBtn.getAttribute('data-support-topic') || '';
      root.querySelectorAll('[data-support-topic]').forEach((btn) => {
        const on = btn === topicBtn;
        btn.classList.toggle('is-active', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      medhubSupportRefreshChannelLinks();
      return;
    }

    const channel = event.target.closest('[data-support-channel]');
    if (channel && (channel.classList.contains('is-disabled') || !medhubSupportSelectedTopic())) {
      event.preventDefault();
      const hint = root.querySelector('#suporte-topic-hint');
      if (hint) {
        hint.hidden = false;
        hint.classList.add('is-alert');
        hint.textContent = 'Escolha o tipo de interpretação antes de abrir o canal.';
      }
    }
  });
}

function medhubRenderSupportPlantao () {
  const root = document.getElementById('suporte-plantao-content');
  if (!root) return;

  const { phone, phoneAlt, email, hours, igUrl, igHandle } = medhubSupportConfig();
  const channels = [];

  if (phone) {
    channels.push(medhubSupportWhatsappCard(phone, 'WhatsApp — canal principal', hours));
  }
  if (phoneAlt && phoneAlt !== phone) {
    channels.push(medhubSupportWhatsappCard(phoneAlt, 'WhatsApp — alternativo', hours));
  }

  if (email) {
    channels.push(`
      <a class="suporte-channel suporte-channel--email is-disabled" data-support-channel="email" href="#" aria-disabled="true">
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

  root.dataset.supportBound = '';
  root.innerHTML = `
    <div class="suporte-hero">
      <p class="suporte-badge"><span class="suporte-badge-dot" aria-hidden="true"></span> ${medhubSupportEscapeHtml(hours)}</p>
      <h2>Plantão MedHub</h2>
      <p class="muted">Ajuda na interpretação de exames e ECG — escolha o tipo e fale com a equipe.</p>
    </div>
    ${medhubSupportUserCardHtml()}
    ${medhubSupportTopicPickerHtml()}
    <div class="suporte-channels" role="list">
      ${channels.join('') || emptyHint}
    </div>
    <aside class="suporte-note" role="note">
      <strong>Escopo do plantão:</strong> auxílio educacional na interpretação (imagem, exame físico, laboratório ou ECG).
      Não substitui laudo formal nem é teleconsulta — a responsabilidade clínica permanece com o médico assistente.
    </aside>`;

  medhubSupportBindInteractions();
  medhubSupportRefreshChannelLinks();
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
