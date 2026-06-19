/* Prévias do app — carrossel automático, 5+ telas por módulo */

var SHOWCASE_SLIDE_MS = 3500;
var SHOWCASE_TAB_KEYS = ['ps', 'emerg', 'rx', 'med', 'anam', 'calc'];

function mountAppShowcase (rootSelector) {
  var root = document.querySelector(rootSelector);
  if (!root) return;

  var meta = buildShowcaseMeta();
  var tabLabels = {
    ps: 'Pronto-socorro',
    emerg: 'Emergência',
    rx: 'Receituário',
    med: 'Medicações',
    anam: 'Anamnese',
    calc: 'Calculadoras'
  };

  root.innerHTML =
    '<div class="showcase-wrap marketing-light">' +
      '<div class="showcase-tabs-scroll">' +
        '<div class="showcase-tabs" role="tablist" aria-label="Módulos do MedHub">' +
          SHOWCASE_TAB_KEYS.map(function (key, i) {
            return '<button type="button" class="showcase-tab' + (i === 0 ? ' active' : '') + '" data-shot="' + key + '" role="tab" aria-selected="' + (i === 0 ? 'true' : 'false') + '">' +
              tabLabels[key] +
              '<span class="showcase-tab-bar" aria-hidden="true"><span class="showcase-tab-bar-fill"></span></span>' +
            '</button>';
          }).join('') +
        '</div>' +
      '</div>' +
      '<div class="showcase-layout">' +
        '<div class="showcase-stage-wrap">' +
          '<div class="showcase-stage" id="showcase-stage"></div>' +
          '<div class="showcase-carousel-ui">' +
            '<div class="showcase-slide-label" id="showcase-slide-label"></div>' +
            '<div class="showcase-dots" id="showcase-dots" role="tablist" aria-label="Telas do módulo"></div>' +
          '</div>' +
        '</div>' +
        '<aside class="showcase-info card" id="showcase-info">' +
          '<p class="showcase-info-kicker">Incluso no plano</p>' +
          '<h3 id="showcase-info-title"></h3>' +
          '<p id="showcase-info-desc"></p>' +
          '<ul id="showcase-info-list" class="showcase-info-list"></ul>' +
        '</aside>' +
      '</div>' +
    '</div>';

  var stage = root.querySelector('#showcase-stage');
  var titleEl = root.querySelector('#showcase-info-title');
  var descEl = root.querySelector('#showcase-info-desc');
  var listEl = root.querySelector('#showcase-info-list');
  var dotsEl = root.querySelector('#showcase-dots');
  var labelEl = root.querySelector('#showcase-slide-label');
  var tabs = root.querySelectorAll('.showcase-tab');
  var tabsScroll = root.querySelector('.showcase-tabs-scroll');

  var tabIndex = 0;
  var slideIndex = 0;
  var timer = null;
  var paused = false;
  var visible = true;

  function scrollActiveTabIntoBar (instant) {
    var tab = tabs[tabIndex];
    if (!tabsScroll || !tab) return;
    var maxScroll = Math.max(0, tabsScroll.scrollWidth - tabsScroll.clientWidth);
    var target = tab.offsetLeft + (tab.offsetWidth / 2) - (tabsScroll.clientWidth / 2);
    target = Math.max(0, Math.min(target, maxScroll));
    tabsScroll.scrollTo({ left: target, behavior: instant ? 'auto' : 'smooth' });
  }

  function renderDots (count, active) {
    dotsEl.innerHTML = '';
    for (var i = 0; i < count; i++) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'showcase-dot' + (i === active ? ' active' : '');
      dot.setAttribute('aria-label', 'Tela ' + (i + 1));
      dot.dataset.index = String(i);
      dot.addEventListener('click', function () {
        slideIndex = Number(this.dataset.index);
        showCurrent(true);
        restartAutoplay();
      });
      dotsEl.appendChild(dot);
    }
  }

  function resetTabBars () {
    tabs.forEach(function (tab) {
      var fill = tab.querySelector('.showcase-tab-bar-fill');
      if (fill) {
        fill.style.transition = 'none';
        fill.style.width = '0%';
      }
    });
  }

  function animateTabBar (tab) {
    var fill = tab.querySelector('.showcase-tab-bar-fill');
    if (!fill) return;
    fill.style.transition = 'none';
    fill.style.width = '0%';
    void fill.offsetWidth;
    fill.style.transition = 'width ' + SHOWCASE_SLIDE_MS + 'ms linear';
    fill.style.width = '100%';
  }

  function updateInfo (key) {
    var data = meta[key];
    titleEl.textContent = data.title;
    descEl.textContent = data.desc;
    listEl.innerHTML = data.list.map(function (li) { return '<li>' + li + '</li>'; }).join('');
  }

  function showCurrent (instant) {
    var key = SHOWCASE_TAB_KEYS[tabIndex];
    var data = meta[key];
    var slide = data.slides[slideIndex];
    if (!slide) return;

    tabs.forEach(function (tab, i) {
      var on = i === tabIndex;
      tab.classList.toggle('active', on);
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
    });

    resetTabBars();
    animateTabBar(tabs[tabIndex]);
    scrollActiveTabIntoBar(instant);

    updateInfo(key);
    renderDots(data.slides.length, slideIndex);
    labelEl.textContent = slide.label;

    if (instant) {
      stage.innerHTML = slide.html;
      stage.style.opacity = '1';
      return;
    }

    stage.style.opacity = '0';
    setTimeout(function () {
      stage.innerHTML = slide.html;
      stage.style.opacity = '1';
    }, 140);
  }

  function nextSlide () {
    var key = SHOWCASE_TAB_KEYS[tabIndex];
    var total = meta[key].slides.length;
    slideIndex++;
    if (slideIndex >= total) {
      slideIndex = 0;
      tabIndex = (tabIndex + 1) % SHOWCASE_TAB_KEYS.length;
    }
    showCurrent(false);
  }

  function stopAutoplay () {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function restartAutoplay () {
    stopAutoplay();
    if (paused || !visible) return;
    animateTabBar(tabs[tabIndex]);
    timer = setInterval(nextSlide, SHOWCASE_SLIDE_MS);
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () {
      tabIndex = i;
      slideIndex = 0;
      showCurrent(false);
      restartAutoplay();
    });
  });

  root.querySelector('.showcase-wrap').addEventListener('mouseenter', function () {
    paused = true;
    stopAutoplay();
    resetTabBars();
  });

  root.querySelector('.showcase-wrap').addEventListener('mouseleave', function () {
    paused = false;
    restartAutoplay();
  });

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible && !paused) restartAutoplay();
      else stopAutoplay();
    }, { threshold: 0.2 });
    observer.observe(root.querySelector('.showcase-wrap'));
  }

  showCurrent(true);
  restartAutoplay();
}

function buildShowcaseMeta () {
  return {
    ps: {
      title: 'Pronto-socorro interativo',
      desc: '106 condições com busca por queixa, conduta resumida e prescrição que você ajusta antes de usar.',
      list: ['Sepse, dengue, dor torácica, ITU e mais', 'Prescrição interativa por condição', 'Referências quando disponíveis'],
      slides: [
        { label: 'Sepse — bundle da 1ª hora', html: shotChrome(NAV_PS, shotCard('Sepse — Prescrição de Pronto Socorro',
          '<div class="shot-search">🔍 Buscar condição…</div>' +
          '<div class="shot-alert">Bundle da 1ª hora · lactato · hemoculturas</div>' +
          '<div class="shot-rx-line"><strong>Cefepime</strong> 2 g EV 8/8h</div>' +
          '<div class="shot-rx-line"><strong>SF 0,9%</strong> 30 mL/kg — reavaliar</div>' +
          '<div class="shot-rx-line"><strong>Noradrenalina</strong> se PAM &lt; 65</div>' +
          '<button type="button" class="shot-btn">Abrir prescrição interativa</button>')) },
        { label: 'Dengue — classificação e conduta', html: shotChrome(NAV_PS, shotCard('Dengue — Prescrição de Pronto Socorro',
          '<div class="shot-alert">Grupo B — sinais de alarme ausentes</div>' +
          '<div class="shot-rx-line"><strong>SF 0,9%</strong> 10 mL/kg/h — reavaliar em 2 h</div>' +
          '<div class="shot-rx-line"><strong>Dipirona</strong> 1 g EV se dor ou febre</div>' +
          '<div class="shot-rx-line"><strong>Ondansetrona</strong> 8 mg EV se vômitos</div>' +
          '<button type="button" class="shot-btn">Ver critérios de internação</button>')) },
        { label: 'Dor torácica — suspeita de SCA', html: shotChrome(NAV_PS, shotCard('Dor torácica — Prescrição de Pronto Socorro',
          '<div class="shot-alert">ECG em 10 min · troponina seriada</div>' +
          '<div class="shot-rx-line"><strong>AAS</strong> 300 mg mastigável</div>' +
          '<div class="shot-rx-line"><strong>Clopidogrel</strong> 300 mg VO</div>' +
          '<div class="shot-rx-line"><strong>Enoxaparina</strong> 1 mg/kg SC 12/12h</div>' +
          '<button type="button" class="shot-btn">Abrir prescrição interativa</button>')) },
        { label: 'Pneumonia — CURB-65 e antibiótico', html: shotChrome(NAV_PS, shotCard('Pneumonia comunitária — Pronto Socorro',
          '<div class="shot-result">CURB-65: <strong>2</strong> — considerar internação</div>' +
          '<div class="shot-rx-line"><strong>Amoxicilina + clavulanato</strong> 875/125 mg 12/12h</div>' +
          '<div class="shot-rx-line"><strong>O₂</strong> se SatO₂ &lt; 94%</div>' +
          '<div class="shot-rx-line"><strong>SF 0,9%</strong> 500 mL EV se hipovolemia</div>' +
          '<button type="button" class="shot-btn">Abrir prescrição interativa</button>')) },
        { label: 'ITU — pielonefrite não complicada', html: shotChrome(NAV_PS, shotCard('ITU / pielonefrite — Pronto Socorro',
          '<div class="shot-search shot-search-filled">pielonefrite</div>' +
          '<div class="shot-rx-line"><strong>Ciprofloxacino</strong> 500 mg VO 12/12h · 7–14 dias</div>' +
          '<div class="shot-rx-line"><strong>Dipirona</strong> 1 g EV 6/6h se dor</div>' +
          '<div class="shot-rx-line"><strong>Hidratação</strong> VO ou EV conforme tolerância</div>' +
          '<button type="button" class="shot-btn">Abrir prescrição interativa</button>')) }
      ]
    },
    emerg: {
      title: 'Guia rápido de emergência',
      desc: 'Fluxogramas passo a passo para parada, AVC, sepse, trauma — leitura rápida no leito.',
      list: ['ACLS e algoritmos de ritmo', 'AVC — janela e conduta', 'Sepse, trauma, vias aéreas'],
      slides: [
        { label: 'PCR — ritmo chocável', html: shotChrome(NAV_EMERG, shotCard('Parada cardiorrespiratória — Ritmo chocável',
          '<div class="shot-step-list">' +
          '<div class="shot-step"><span>1</span> Desfibrilação 200 J — retomar RCP imediato</div>' +
          '<div class="shot-step shot-step-on"><span>2</span> Adrenalina 1 mg EV — a cada 3–5 min</div>' +
          '<div class="shot-step"><span>3</span> Amiodarona 300 mg EV — após 3º choque</div>' +
          '</div><div class="shot-tags"><span>ACLS</span><span>RCP 30:2</span><span>4H e 4T</span></div>')) },
        { label: 'AVC isquêmico — janela terapêutica', html: shotChrome(NAV_EMERG, shotCard('AVC isquêmico — Conduta inicial',
          '<div class="shot-alert">NIHSS · TC sem sangramento · tempo desde início</div>' +
          '<div class="shot-step-list">' +
          '<div class="shot-step shot-step-on"><span>1</span> PA &lt; 185×110 se candidato a trombólise</div>' +
          '<div class="shot-step"><span>2</span> Alteplase 0,9 mg/kg (máx. 90 mg) se &lt; 4,5 h</div>' +
          '<div class="shot-step"><span>3</span> Neurovigilância · evitar hipotensão</div>' +
          '</div>')) },
        { label: 'Sepse — reconhecimento rápido', html: shotChrome(NAV_EMERG, shotCard('Sepse — Guia de emergência',
          '<div class="shot-alert">qSOFA ≥ 2 ou sinais de disfunção orgânica</div>' +
          '<div class="shot-step-list">' +
          '<div class="shot-step shot-step-on"><span>1</span> Coletar lactato e hemoculturas</div>' +
          '<div class="shot-step"><span>2</span> Antibiótico EV na 1ª hora</div>' +
          '<div class="shot-step"><span>3</span> 30 mL/kg cristaloide se hipotensão</div>' +
          '</div>')) },
        { label: 'Via aérea — intubação de sequência', html: shotChrome(NAV_EMERG, shotCard('Via aérea difícil — Sequência rápida',
          '<div class="shot-step-list">' +
          '<div class="shot-step"><span>1</span> Pré-oxigenação 3 min · posicionamento</div>' +
          '<div class="shot-step shot-step-on"><span>2</span> Etomidato + succinilcolina ou rocurônio</div>' +
          '<div class="shot-step"><span>3</span> Capnografia · confirmação bilateral</div>' +
          '</div><div class="shot-tags"><span>LEMON</span><span>BVM</span><span>via alternativa</span></div>')) },
        { label: 'Trauma — ABCDE no atendimento', html: shotChrome(NAV_EMERG, shotCard('Trauma — Avaliação primária ATLS',
          '<div class="shot-step-list">' +
          '<div class="shot-step shot-step-on"><span>A</span> Via aérea + colar · controle de sangramento</div>' +
          '<div class="shot-step"><span>B</span> Ventilação · pneumotórax · SatO₂</div>' +
          '<div class="shot-step"><span>C</span> Choque · 2 acessos calibrosos · TX</div>' +
          '<div class="shot-step"><span>D</span> Glasgow · pupilas · glicemia</div>' +
          '</div>')) }
      ]
    },
    rx: {
      title: 'Receituário educacional',
      desc: 'Sugestões VO por condição, CRM-SP opcional e PDF — valide conforme sua UF antes de prescrever.',
      list: ['106 condições ambulatoriais', 'Modelo educacional · CRM-SP', 'Checagem de interações comuns'],
      slides: [
        { label: 'Faringoamigdalite estreptocócica', html: shotChrome(NAV_RX, shotCard('Faringoamigdalite estreptocócica — Receituário',
          '<p class="shot-muted">CRM-SP · 123456 · Dr. Silva</p>' +
          '<div class="shot-rx-line"><strong>Amoxicilina</strong> 500 mg VO 8/8h · 10 dias</div>' +
          '<div class="shot-rx-line"><strong>Dipirona</strong> 1 g VO 6/6h · se dor ou febre</div>' +
          '<div class="shot-rx-actions"><button type="button" class="shot-btn">Gerar receita</button><button type="button" class="shot-btn shot-btn-ghost">PDF · Imprimir</button></div>')) },
        { label: 'Hipertensão arterial — início', html: shotChrome(NAV_RX, shotCard('Hipertensão arterial — Receituário',
          '<p class="shot-muted">CRM-SP · 123456 · Dr. Silva</p>' +
          '<div class="shot-rx-line"><strong>Losartana</strong> 50 mg VO 1×/dia</div>' +
          '<div class="shot-rx-line"><strong>Hidroclorotiazida</strong> 25 mg VO 1×/dia</div>' +
          '<div class="shot-rx-line"><strong>Orientações</strong> dieta hipossódica · MAPA</div>' +
          '<div class="shot-rx-actions"><button type="button" class="shot-btn">Gerar receita</button></div>')) },
        { label: 'Diabetes tipo 2 — controle', html: shotChrome(NAV_RX, shotCard('Diabetes mellitus tipo 2 — Receituário',
          '<div class="shot-rx-line"><strong>Metformina</strong> 850 mg VO 12/12h</div>' +
          '<div class="shot-rx-line"><strong>Gliclazida</strong> 30 mg VO 1×/dia · se HbA1c elevada</div>' +
          '<div class="shot-rx-line"><strong>Atorvastatina</strong> 20 mg VO à noite</div>' +
          '<div class="shot-rx-actions"><button type="button" class="shot-btn">Gerar receita</button></div>')) },
        { label: 'Asma — crise leve a moderada', html: shotChrome(NAV_RX, shotCard('Asma — exacerbação ambulatorial',
          '<div class="shot-rx-line"><strong>Salbutamol</strong> spray 100 mcg · 2 jatos 4/4h</div>' +
          '<div class="shot-rx-line"><strong>Prednisona</strong> 40 mg VO 1×/dia · 5 dias</div>' +
          '<div class="shot-rx-line"><strong>Budesonida</strong> inalatório · manutenção</div>' +
          '<div class="shot-rx-actions"><button type="button" class="shot-btn">Gerar receita</button></div>')) },
        { label: 'DRGE — tratamento inicial', html: shotChrome(NAV_RX, shotCard('DRGE — Receituário',
          '<div class="shot-rx-line"><strong>Omeprazol</strong> 20 mg VO 1×/dia · 30 min antes café</div>' +
          '<div class="shot-rx-line"><strong>Domperidona</strong> 10 mg VO 8/8h · se plenitude</div>' +
          '<div class="shot-rx-line"><strong>Orientações</strong> elevar cabeceira · evitar gordura</div>' +
          '<div class="shot-rx-actions"><button type="button" class="shot-btn">Gerar receita</button></div>')) }
      ]
    },
    med: {
      title: 'Guia de medicações',
      desc: 'Fichas MedHub completas, referência RENAME e link de consulta — tudo pesquisável.',
      list: ['266+ monografias resumidas', '148 fármacos RENAME', 'Classes e apresentações'],
      slides: [
        { label: 'Dipirona — ficha completa', html: shotChrome(NAV_MED, shotCard('Dipirona · Ficha MedHub A',
          '<div class="shot-search shot-search-filled">dipirona</div>' +
          '<div class="shot-tag-row"><span class="shot-tag-a">Analgésico</span><span class="shot-tag-rename">RENAME</span></div>' +
          '<p class="shot-body-text"><strong>Adulto:</strong> 500 mg–1 g VO/EV 6/6h (máx. 4 g/d).</p>' +
          '<p class="shot-body-text"><strong>Atenção:</strong> risco de agranulocitose.</p>')) },
        { label: 'Metformina — antidiabético oral', html: shotChrome(NAV_MED, shotCard('Metformina · Ficha MedHub A',
          '<div class="shot-search shot-search-filled">metformina</div>' +
          '<div class="shot-tag-row"><span class="shot-tag-a">Antidiabético</span><span class="shot-tag-rename">RENAME</span></div>' +
          '<p class="shot-body-text"><strong>Indicações:</strong> DM2 · SOP · resistência insulínica.</p>' +
          '<p class="shot-body-text"><strong>Contraindicações:</strong> TFG &lt; 30 · acidose.</p>')) },
        { label: 'Losartana — anti-hipertensivo', html: shotChrome(NAV_MED, shotCard('Losartana · Ficha MedHub A',
          '<div class="shot-search shot-search-filled">losartana</div>' +
          '<div class="shot-tag-row"><span class="shot-tag-a">BRA</span><span class="shot-tag-rename">RENAME</span></div>' +
          '<p class="shot-body-text"><strong>Dose:</strong> 50–100 mg VO 1×/dia.</p>' +
          '<p class="shot-body-text"><strong>Monitorar:</strong> K⁺ · creatinina · PA.</p>')) },
        { label: 'Amoxicilina — antibiótico', html: shotChrome(NAV_MED, shotCard('Amoxicilina · Ficha MedHub A',
          '<div class="shot-search shot-search-filled">amoxicilina</div>' +
          '<div class="shot-tag-row"><span class="shot-tag-a">Penicilina</span><span class="shot-tag-rename">RENAME</span></div>' +
          '<p class="shot-body-text"><strong>Adulto:</strong> 500 mg VO 8/8h ou 875 mg 12/12h.</p>' +
          '<p class="shot-body-text"><strong>Interações:</strong> anticoagulantes · alopurinol.</p>')) },
        { label: 'Omeprazol — IBP', html: shotChrome(NAV_MED, shotCard('Omeprazol · Ficha MedHub A',
          '<div class="shot-search shot-search-filled">omeprazol</div>' +
          '<div class="shot-tag-row"><span class="shot-tag-a">IBP</span><span class="shot-tag-rename">RENAME</span></div>' +
          '<p class="shot-body-text"><strong>Dose:</strong> 20–40 mg VO 1×/dia antes refeição.</p>' +
          '<p class="shot-body-text"><strong>Longo prazo:</strong> B12 · Mg · fractura.</p>')) }
      ]
    },
    anam: {
      title: 'Anamnese',
      desc: 'Guia clínico local para queixa → protocolo → prescrição. Histórico criptografado e PDF educacional.',
      list: ['Queixa → conduta no app', 'Cadastro de paciente opcional', 'PDF educacional (não prontuário)'],
      slides: [
        { label: 'Cefaleia — consulta ambulatorial', html: shotChrome(NAV_ANAM, shotCard('Roteiro — consulta ambulatorial',
          '<div class="shot-form-grid">' +
          '<label class="shot-label">Queixa principal</label><div class="shot-field shot-field-filled">Cefaleia há 3 dias</div>' +
          '<label class="shot-label">HDA</label><div class="shot-field shot-field-area">Holocraniana, pulsátil…</div>' +
          '<label class="shot-label">Exame físico</label><div class="shot-field shot-field-filled">PA 130×85 · FC 78 · GCS 15</div>' +
          '</div><div class="shot-rx-actions"><button type="button" class="shot-btn">Salvar</button><button type="button" class="shot-btn shot-btn-ghost">Exportar PDF</button></div>')) },
        { label: 'Dor abdominal — PS ambulatorial', html: shotChrome(NAV_ANAM, shotCard('Roteiro — dor abdominal',
          '<div class="shot-form-grid">' +
          '<label class="shot-label">Queixa principal</label><div class="shot-field shot-field-filled">Dor epigástrica há 2 dias</div>' +
          '<label class="shot-label">HDA</label><div class="shot-field shot-field-area">Em queimação · pós-prandial · sem irradiação</div>' +
          '<label class="shot-label">Exame físico</label><div class="shot-field shot-field-filled">Abdome flácido · Murphy −</div>' +
          '</div>')) },
        { label: 'Dispneia — avaliação inicial', html: shotChrome(NAV_ANAM, shotCard('Roteiro — dispneia',
          '<div class="shot-form-grid">' +
          '<label class="shot-label">Queixa principal</label><div class="shot-field shot-field-filled">Falta de ar há 1 semana</div>' +
          '<label class="shot-label">HDA</label><div class="shot-field shot-field-area">Progressiva · ortopneia · edema MMII</div>' +
          '<label class="shot-label">Exame físico</label><div class="shot-field shot-field-filled">Estertores bibasais · SatO₂ 93%</div>' +
          '</div>')) },
        { label: 'Retorno DM2 — acompanhamento', html: shotChrome(NAV_ANAM, shotCard('Roteiro — retorno diabetes',
          '<div class="shot-form-grid">' +
          '<label class="shot-label">Motivo</label><div class="shot-field shot-field-filled">Retorno DM2 · controle glicêmico</div>' +
          '<label class="shot-label">HDA</label><div class="shot-field shot-field-area">Glicemia capilar 140–180 · aderência OK</div>' +
          '<label class="shot-label">Exame físico</label><div class="shot-field shot-field-filled">Pé sem lesões · PA 128×82</div>' +
          '</div>')) },
        { label: 'Pré-natal — 1ª consulta', html: shotChrome(NAV_ANAM, shotCard('Roteiro — pré-natal',
          '<div class="shot-form-grid">' +
          '<label class="shot-label">IG</label><div class="shot-field shot-field-filled">12 semanas · DUM confirmada</div>' +
          '<label class="shot-label">Antecedentes</label><div class="shot-field shot-field-area">G2P1A0 · sem comorbidades</div>' +
          '<label class="shot-label">Exame físico</label><div class="shot-field shot-field-filled">AU compatível · BCF +</div>' +
          '</div>')) }
      ]
    },
    calc: {
      title: 'Calculadoras clínicas',
      desc: 'Scores e doses com interpretação na hora — essenciais e pediátricas por peso.',
      list: ['CHA₂DS₂-VASc, CURB-65, MELD, Glasgow', 'Doses pediátricas', 'Dezenas de scores'],
      slides: [
        { label: 'CURB-65 — pneumonia', html: shotChrome(NAV_CALC, shotCard('CURB-65 — Pneumonia comunitária',
          '<div class="shot-calc-grid">' +
          '<label><input type="checkbox" checked disabled> Confusão</label>' +
          '<label><input type="checkbox" checked disabled> Ureia &gt; 50</label>' +
          '<label><input type="checkbox" disabled> FR ≥ 30</label>' +
          '<label><input type="checkbox" disabled> PA sist. &lt; 90</label>' +
          '<label><input type="checkbox" disabled> Idade ≥ 65</label>' +
          '</div><div class="shot-result">Pontuação: <strong>2</strong> — considerar internação</div>')) },
        { label: 'CHA₂DS₂-VASc — FA', html: shotChrome(NAV_CALC, shotCard('CHA₂DS₂-VASc — Fibrilação atrial',
          '<div class="shot-calc-grid">' +
          '<label><input type="checkbox" checked disabled> Idade 65–74</label>' +
          '<label><input type="checkbox" checked disabled> Hipertensão</label>' +
          '<label><input type="checkbox" disabled> Diabetes</label>' +
          '<label><input type="checkbox" disabled> AVC prévio</label>' +
          '</div><div class="shot-result">Score: <strong>2</strong> — anticoagular</div>')) },
        { label: 'Glasgow — nível de consciência', html: shotChrome(NAV_CALC, shotCard('Escala de Glasgow',
          '<div class="shot-form-grid">' +
          '<label class="shot-label">Abertura ocular</label><div class="shot-field shot-field-filled">4 — espontânea</div>' +
          '<label class="shot-label">Resposta verbal</label><div class="shot-field shot-field-filled">5 — orientado</div>' +
          '<label class="shot-label">Resposta motora</label><div class="shot-field shot-field-filled">6 — obedece comandos</div>' +
          '</div><div class="shot-result">Total: <strong>15</strong></div>')) },
        { label: 'Dose pediátrica — amoxicilina', html: shotChrome(NAV_CALC, shotCard('Dose pediátrica — Amoxicilina',
          '<div class="shot-form-grid">' +
          '<label class="shot-label">Peso</label><div class="shot-field shot-field-filled">18 kg</div>' +
          '<label class="shot-label">Dose alvo</label><div class="shot-field shot-field-filled">50 mg/kg/dia VO dividido 8/8h</div>' +
          '</div><div class="shot-result">Dose: <strong>300 mg</strong> VO 8/8h</div>')) },
        { label: 'MELD — hepatopatia', html: shotChrome(NAV_CALC, shotCard('MELD — Doença hepática',
          '<div class="shot-form-grid">' +
          '<label class="shot-label">Bilirrubina</label><div class="shot-field shot-field-filled">2,8 mg/dL</div>' +
          '<label class="shot-label">Creatinina</label><div class="shot-field shot-field-filled">1,4 mg/dL</div>' +
          '<label class="shot-label">INR</label><div class="shot-field shot-field-filled">1,6</div>' +
          '</div><div class="shot-result">MELD: <strong>18</strong> — prioridade transplant</div>')) }
      ]
    }
  };
}

function shotCard (title, bodyHtml) {
  return '<div class="shot-card"><h4 class="shot-h">' + title + '</h4>' + bodyHtml + '</div>';
}

function shotChrome (activeNav, contentHtml) {
  return (
    '<div class="shot-browser">' +
      '<div class="shot-browser-bar">' +
        '<span class="shot-dot shot-dot-r"></span>' +
        '<span class="shot-dot shot-dot-y"></span>' +
        '<span class="shot-dot shot-dot-g"></span>' +
        '<span class="shot-url">www.medhub.ia.br/app.html</span>' +
      '</div>' +
      '<div class="shot-app">' +
        '<div class="shot-app-header"><strong>MedHub</strong><span class="shot-user">Dr. Silva</span><span class="shot-pill">Sair</span></div>' +
        '<div class="shot-app-body"><nav class="shot-sidebar">' + activeNav + '</nav><div class="shot-content">' + contentHtml + '</div></div>' +
      '</div>' +
    '</div>'
  );
}

function shotNav (groups) {
  return groups.map(function (g) {
    return (
      '<p class="shot-nav-group">' + g.label + '</p>' +
      g.items.map(function (it) {
        return '<span class="shot-nav-item' + (it.active ? ' active' : '') + '">' + it.text + '</span>';
      }).join('')
    );
  }).join('');
}

var NAV_PS = shotNav([
  { label: 'Emergência', items: [{ text: 'Guia emergência' }, { text: 'Pronto Socorro', active: true }, { text: 'Trat. hospitalar' }] },
  { label: 'Prescrição', items: [{ text: 'Receituário' }, { text: 'Medicações' }] }
]);

var NAV_EMERG = shotNav([
  { label: 'Emergência', items: [{ text: 'Guia emergência', active: true }, { text: 'Pronto Socorro' }, { text: 'Trat. hospitalar' }] }
]);

var NAV_RX = shotNav([
  { label: 'Prescrição', items: [{ text: 'Receituário', active: true }, { text: 'Medicações' }, { text: 'Exames' }] }
]);

var NAV_MED = shotNav([
  { label: 'Prescrição', items: [{ text: 'Receituário' }, { text: 'Medicações', active: true }, { text: 'Exames' }] }
]);

var NAV_ANAM = shotNav([
  { label: 'Roteiro local', items: [{ text: 'Cadastro' }, { text: 'Anamnese', active: true }, { text: 'Histórico' }] }
]);

var NAV_CALC = shotNav([
  { label: 'Calculadoras', items: [{ text: 'Essenciais', active: true }, { text: 'Pediátrica' }] }
]);
