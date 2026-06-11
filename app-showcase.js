/* Prévias do app — sempre modo claro, alta fidelidade */

function mountAppShowcase (rootSelector) {
  const root = document.querySelector(rootSelector);
  if (!root) return;

  root.innerHTML = `
    <div class="showcase-wrap marketing-light">
      <div class="showcase-tabs" role="tablist" aria-label="Módulos do MedHub">
        <button type="button" class="showcase-tab active" data-shot="ps" role="tab" aria-selected="true">Pronto-socorro</button>
        <button type="button" class="showcase-tab" data-shot="emerg" role="tab">Emergência</button>
        <button type="button" class="showcase-tab" data-shot="rx" role="tab">Receituário</button>
        <button type="button" class="showcase-tab" data-shot="med" role="tab">Medicações</button>
        <button type="button" class="showcase-tab" data-shot="anam" role="tab">Anamnese</button>
        <button type="button" class="showcase-tab" data-shot="calc" role="tab">Calculadoras</button>
      </div>

      <div class="showcase-layout">
        <div class="showcase-stage" id="showcase-stage">${SHOT_PS}</div>
        <aside class="showcase-info card" id="showcase-info">
          <p class="showcase-info-kicker">Incluso no plano</p>
          <h3 id="showcase-info-title">Pronto-socorro interativo</h3>
          <p id="showcase-info-desc">106 condições com busca por queixa, conduta resumida e prescrição que você ajusta antes de usar.</p>
          <ul id="showcase-info-list" class="showcase-info-list">
            <li>Sepse, dengue, dor torácica, ITU e mais</li>
            <li>Prescrição interativa por condição</li>
            <li>Referências quando disponíveis</li>
          </ul>
        </aside>
      </div>
    </div>`;

  const meta = {
    ps: {
      html: SHOT_PS,
      title: 'Pronto-socorro interativo',
      desc: '106 condições com busca por queixa, conduta resumida e prescrição que você ajusta antes de usar.',
      list: ['Sepse, dengue, dor torácica, ITU e mais', 'Prescrição interativa por condição', 'Referências quando disponíveis']
    },
    emerg: {
      html: SHOT_EMERG,
      title: 'Guia rápido de emergência',
      desc: 'Fluxogramas passo a passo para parada, AVC, sepse, trauma — leitura rápida no leito.',
      list: ['ACLS e algoritmos de ritmo', 'AVC — janela e conduta', 'Sepse, trauma, vias aéreas']
    },
    rx: {
      html: SHOT_RX,
      title: 'Receituário médico',
      desc: 'Sugestões VO por condição, CRM-SP, geração de receita e exportação PDF para o paciente.',
      list: ['106 condições ambulatoriais', 'Impressão e PDF', 'Checagem de interações comuns']
    },
    med: {
      html: SHOT_MED,
      title: 'Guia de medicações',
      desc: 'Fichas MedHub completas, referência RENAME e link de consulta — tudo pesquisável.',
      list: ['266+ monografias resumidas', '148 fármacos RENAME', 'Classes e apresentações']
    },
    anam: {
      html: SHOT_ANAM,
      title: 'Anamnese e consultas',
      desc: 'Registro estruturado no dispositivo, histórico criptografado e PDF do atendimento.',
      list: ['Formulário QP, HDA, exame físico', 'Pacientes e consultas vinculados', 'Exportação PDF']
    },
    calc: {
      html: SHOT_CALC,
      title: 'Calculadoras clínicas',
      desc: 'Scores e doses com interpretação na hora — essenciais e pediátricas por peso.',
      list: ['CHA₂DS₂-VASc, CURB-65, MELD, Glasgow', 'Doses pediátricas', 'Dezenas de scores']
    }
  };

  const stage = root.querySelector('#showcase-stage');
  const titleEl = root.querySelector('#showcase-info-title');
  const descEl = root.querySelector('#showcase-info-desc');
  const listEl = root.querySelector('#showcase-info-list');

  root.querySelectorAll('.showcase-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const key = tab.dataset.shot;
      const data = meta[key];
      if (!data) return;

      root.querySelectorAll('.showcase-tab').forEach(t => {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
      });

      stage.style.opacity = '0';
      setTimeout(() => {
        stage.innerHTML = data.html;
        titleEl.textContent = data.title;
        descEl.textContent = data.desc;
        listEl.innerHTML = data.list.map(li => '<li>' + li + '</li>').join('');
        stage.style.opacity = '1';
      }, 120);
    });
  });
}

function shotChrome (activeNav, contentHtml) {
  return `
    <div class="shot-browser">
      <div class="shot-browser-bar">
        <span class="shot-dot shot-dot-r"></span>
        <span class="shot-dot shot-dot-y"></span>
        <span class="shot-dot shot-dot-g"></span>
        <span class="shot-url">meu-app-medico.vercel.app/app.html</span>
      </div>
      <div class="shot-app">
        <div class="shot-app-header">
          <strong>MedHub</strong>
          <span class="shot-user">Dr. Silva</span>
          <span class="shot-pill">Sair</span>
        </div>
        <div class="shot-app-body">
          <nav class="shot-sidebar">${activeNav}</nav>
          <div class="shot-content">${contentHtml}</div>
        </div>
      </div>
    </div>`;
}

function shotNav (groups) {
  return groups.map(g => `
    <p class="shot-nav-group">${g.label}</p>
    ${g.items.map(it => `<span class="shot-nav-item${it.active ? ' active' : ''}">${it.text}</span>`).join('')}
  `).join('');
}

const NAV_PS = shotNav([
  { label: 'Emergência', items: [{ text: 'Guia emergência' }, { text: 'Pronto Socorro', active: true }, { text: 'Trat. hospitalar' }] },
  { label: 'Prescrição', items: [{ text: 'Receituário' }, { text: 'Medicações' }] }
]);

const NAV_EMERG = shotNav([
  { label: 'Emergência', items: [{ text: 'Guia emergência', active: true }, { text: 'Pronto Socorro' }, { text: 'Trat. hospitalar' }] }
]);

const NAV_RX = shotNav([
  { label: 'Prescrição', items: [{ text: 'Receituário', active: true }, { text: 'Medicações' }, { text: 'Exames' }] }
]);

const NAV_MED = shotNav([
  { label: 'Prescrição', items: [{ text: 'Receituário' }, { text: 'Medicações', active: true }, { text: 'Exames' }] }
]);

const NAV_ANAM = shotNav([
  { label: 'Atendimento', items: [{ text: 'Pacientes' }, { text: 'Anamnese', active: true }, { text: 'Consultas' }] }
]);

const NAV_CALC = shotNav([
  { label: 'Calculadoras', items: [{ text: 'Essenciais', active: true }, { text: 'Pediátrica' }] }
]);

const SHOT_PS = shotChrome(NAV_PS, `
  <div class="shot-card">
    <h4 class="shot-h">Sepse — Prescrição de Pronto Socorro</h4>
    <div class="shot-search">🔍 Buscar condição…</div>
    <div class="shot-alert">Bundle da 1ª hora · lactato · hemoculturas</div>
    <div class="shot-rx-line"><strong>Cefepime</strong> 2 g EV 8/8h</div>
    <div class="shot-rx-line"><strong>SF 0,9%</strong> 30 mL/kg — reavaliar</div>
    <div class="shot-rx-line"><strong>Noradrenalina</strong> se PAM &lt; 65</div>
    <button type="button" class="shot-btn">Abrir prescrição interativa</button>
  </div>`);

const SHOT_EMERG = shotChrome(NAV_EMERG, `
  <div class="shot-card">
    <h4 class="shot-h">Parada cardiorrespiratória — Ritmo chocável</h4>
    <div class="shot-step-list">
      <div class="shot-step"><span>1</span> Desfibrilação 200 J — retomar RCP imediato</div>
      <div class="shot-step shot-step-on"><span>2</span> Adrenalina 1 mg EV — a cada 3–5 min</div>
      <div class="shot-step"><span>3</span> Amiodarona 300 mg EV — após 3º choque</div>
    </div>
    <div class="shot-tags"><span>ACLS</span><span>RCP 30:2</span><span>Causas reversíveis</span></div>
  </div>`);

const SHOT_RX = shotChrome(NAV_RX, `
  <div class="shot-card">
    <h4 class="shot-h">Faringoamigdalite estreptocócica — Receituário</h4>
    <p class="shot-muted">CRM-SP · 123456 · Dr. Silva</p>
    <div class="shot-rx-line"><strong>Amoxicilina</strong> 500 mg VO 8/8h · 10 dias</div>
    <div class="shot-rx-line"><strong>Dipirona</strong> 1 g VO 6/6h · se dor ou febre</div>
    <div class="shot-rx-actions">
      <button type="button" class="shot-btn">Gerar receita</button>
      <button type="button" class="shot-btn shot-btn-ghost">PDF · Imprimir</button>
    </div>
  </div>`);

const SHOT_MED = shotChrome(NAV_MED, `
  <div class="shot-card">
    <div class="shot-search shot-search-filled">dipirona</div>
    <h4 class="shot-h">Dipirona · Ficha MedHub A</h4>
    <div class="shot-tag-row"><span class="shot-tag-a">Analgésico</span><span class="shot-tag-rename">RENAME</span></div>
    <p class="shot-body-text"><strong>Indicações:</strong> dor leve a moderada, febre.</p>
    <p class="shot-body-text"><strong>Adulto:</strong> 500 mg–1 g VO/EV 6/6h (máx. 4 g/d).</p>
    <p class="shot-body-text"><strong>Atenção:</strong> risco de agranulocitose — orientar sinais.</p>
  </div>`);

const SHOT_ANAM = shotChrome(NAV_ANAM, `
  <div class="shot-card">
    <h4 class="shot-h">Anamnese — consulta ambulatorial</h4>
    <div class="shot-form-grid">
      <label class="shot-label">Queixa principal</label>
      <div class="shot-field shot-field-filled">Cefaleia há 3 dias</div>
      <label class="shot-label">HDA</label>
      <div class="shot-field shot-field-area">Holocraniana, pulsátil, sem focalidade…</div>
      <label class="shot-label">Exame físico</label>
      <div class="shot-field shot-field-filled">PA 130×85 · FC 78 · Glasgow 15</div>
    </div>
    <div class="shot-rx-actions">
      <button type="button" class="shot-btn">Salvar</button>
      <button type="button" class="shot-btn shot-btn-ghost">Exportar PDF</button>
    </div>
  </div>`);

const SHOT_CALC = shotChrome(NAV_CALC, `
  <div class="shot-card">
    <h4 class="shot-h">CURB-65 — Pneumonia comunitária</h4>
    <div class="shot-calc-grid">
      <label><input type="checkbox" checked disabled> Confusão</label>
      <label><input type="checkbox" checked disabled> Ureia &gt; 50</label>
      <label><input type="checkbox" disabled> FR ≥ 30</label>
      <label><input type="checkbox" disabled> PA sist. &lt; 90</label>
      <label><input type="checkbox" disabled> Idade ≥ 65</label>
    </div>
    <div class="shot-result">Pontuação: <strong>2</strong> — considerar internação</div>
  </div>`);
