/** Configuração global MedHub — atualize quando o app pediátrico estiver no ar */
const MEDHUB_SITE_URL = 'https://www.medhub.ia.br';

/** Divulgação — edite com o @ e link reais do Instagram */
const MEDHUB_MARKETING = {
  instagramUrl: 'https://www.instagram.com/medhub_app/',
  instagramHandle: '@medhub_app',
  supportEmail: '',
  linksBio: 'https://www.medhub.ia.br/links.html',
  linksEstudantes: 'https://www.medhub.ia.br/links-estudantes.html',
  landingEstudantes: 'https://www.medhub.ia.br/estudantes.html'
};

/**
 * Meta Ads (Instagram/Facebook) — Pixel para medir anúncios.
 * 1) business.facebook.com → Configurações → Origens de dados → Pixel → Copiar ID
 * 2) Cole em pixelId abaixo (só números)
 * 3) No Ads Manager: campanha Tráfego ou Conversões apontando para links.html
 */
const MEDHUB_META = {
  pixelId: '',
  debug: false
};

const MEDHUB_PED_APP = {
  name: 'MedHub Pediatria',
  url: 'https://medhub-pediatria.vercel.app',
  comingSoon: true,
  description: 'Protocolos, doses, calculadoras e prescrição pensados 100% para o atendimento pediátrico — app dedicado, separado deste MedHub (adulto).'
};

function medhubRenderPedAppPromo (container, variant) {
  if (!container) return;
  const v = variant || 'footer';
  const linkInner = MEDHUB_PED_APP.comingSoon
    ? `<span class="medhub-ped-app-name">${MEDHUB_PED_APP.name}</span> <span class="medhub-ped-app-soon">em breve</span>`
    : `<a href="${MEDHUB_PED_APP.url}" target="_blank" rel="noopener noreferrer" class="medhub-ped-app-anchor">${MEDHUB_PED_APP.name} ↗</a>`;

  if (v === 'banner') {
    container.innerHTML = `
      <div class="medhub-adult-scope-banner" role="note">
        <p class="medhub-adult-scope-title">👨‍⚕️ Este MedHub é voltado ao atendimento de <strong>clínica médica do adulto</strong></p>
        <p>A calculadora abaixo é um <strong>complemento pontual</strong> para pediatria na urgência — não substitui um app pediátrico completo.</p>
        <p class="medhub-adult-scope-link-line">${MEDHUB_PED_APP.comingSoon ? 'Em desenvolvimento:' : 'App dedicado:'} ${linkInner}</p>
      </div>`;
    return;
  }

  container.innerHTML = `
    <aside class="medhub-ped-app-footer" aria-label="App pediátrico MedHub">
      <h3>👶 ${MEDHUB_PED_APP.name}</h3>
      <p>${MEDHUB_PED_APP.description}</p>
      ${MEDHUB_PED_APP.comingSoon
    ? `<p class="medhub-ped-app-soon-note">Estamos preparando o app pediátrico completo. Enquanto isso, use a calculadora acima como apoio rápido neste MedHub (adulto).</p>
           <span class="btn btn-outline medhub-ped-app-btn medhub-ped-app-btn--soon">${MEDHUB_PED_APP.name} — em breve</span>`
    : `<a href="${MEDHUB_PED_APP.url}" target="_blank" rel="noopener noreferrer" class="btn medhub-ped-app-btn">Abrir ${MEDHUB_PED_APP.name} ↗</a>`}
    </aside>`;
}

function medhubApplySiteUrlLabels () {
  document.querySelectorAll('[data-medhub-site]').forEach(el => {
    el.textContent = MEDHUB_SITE_URL.replace(/^https:\/\//, '');
  });
  document.querySelectorAll('[data-medhub-site-full]').forEach(el => {
    el.textContent = MEDHUB_SITE_URL;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  medhubApplySiteUrlLabels();
});
