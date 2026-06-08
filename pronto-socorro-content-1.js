/* Pronto Socorro — conteúdo clínico (lote 1) */
const PS_CONTENT_1 = {
  'abdome-agudo': `
      <p class="muted">Dor abdominal aguda com possível causa cirúrgica ou médica — priorizar ABC, analgesia escalonada, acesso venoso e investigação dirigida (Rx, labs, imagem).</p>
      <h4>Pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>ABC</strong> — monitorização, O₂ se necessário, 2 acessos venosos calibrosos se instável ou suspeita de abdome cirúrgico.</li>
        <li><strong>Analgesia escalonada</strong> — dipirona 1 g IV/IM (Novalgina®) → se dor persistente, tramadol 50–100 mg IV (lento) → morfina 2–5 mg IV titulada (máx. 10 mg) se dor intensa. Evitar mascarar sinais de peritonite; reavaliar após analgesia.</li>
        <li><strong>Medidas iniciais</strong> — jejum, SNG se vômitos/íleo; cateter vesical se suspeita de retenção ou choque; antiemético (metoclopramida 10 mg IV ou ondansetrona 4–8 mg IV).</li>
        <li><strong>Laboratório</strong> — hemograma, amilase/lipase, função renal, eletrólitos, lactato se sepse/choque; β-hCG em mulher em idade fértil; coagulograma se cirurgia provável.</li>
        <li><strong>Imagem</strong> — Rx abdome (ortostático/decúbito) se suspeita de obstrução/perfuração; USG abdome (colecistite, apendicite pediátrica); TC com contraste se abdome agudo não esclarecido (adulto estável).</li>
        <li><strong>Condutas específicas</strong> — apendicite/colecistite: ATB + cirurgia; úlcera perfurada: omeprazol IV + cirurgia; pancreatite: hidratação agressiva SF; abdome vascular: anticoagulação/heparina conforme protocolo.</li>
        <li><strong>Internação/cirurgia</strong> — sinais de peritonite, instabilidade, pneumoperitônio, hematêmese/melena associada, gestante com dor intensa ou sangramento.</li>
      </ol>
      <h4>Exames / investigação</h4>
      <ul>
        <li>ECG se dor epigástrica (IAM inferior) · urina I/E · gasometria se acidose/sepse</li>
        <li>TC abdome: padrão-ouro em adulto para apendicite, diverticulite, isquemia, abscesso</li>
      </ul>
      <p class="emerg-note">Referência: WSES 2020 · MS/CGURG. Adaptar ao protocolo institucional. Conteúdo educacional — não substitui julgamento clínico.</p>`,

  'avc': `
      <p class="muted">Déficit neurológico focal súbito — tratar como AVC até prova em contrário. Janela terapêutica depende de TC sem sangramento (isquêmico) vs hemorragia.</p>
      <h4>Pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>ABC</strong> — via aérea, O₂ alvo SpO₂ &gt; 94%, 2 acessos venosos, monitor cardíaco.</li>
        <li><strong>Glicemia capilar imediata</strong> — hipoglicemia mimetiza AVC; corrigir se &lt; 60 mg/dL (glicose EV 25 g).</li>
        <li><strong>TC crânio sem contraste em ≤ 25 min</strong> — porta-imagem; angioTC se suspeita de oclusão de grande vaso.</li>
        <li><strong>PA — alvos conforme tipo</strong> — <em>isquêmico pré-lise/MT:</em> tratar se &gt; 185/110 mmHg (labetalol 10–20 mg IV ou nicardipina EV). <em>Hemorrágico agudo:</em> meta geral &lt; 140/90 mmHg se estável (evitar queda abrupta).</li>
        <li><strong>AVC isquêmico</strong> — NIHSS; trombólise IV (alteplase 0,9 mg/kg, máx. 90 mg) se janela ≤ 4 h 30 e sem contraindicações; trombectomia se LVO. <strong>AAS 300 mg VO</strong> após 24 h da lise (ou imediato se sem lise e sem anticoagulação).</li>
        <li><strong>AVC hemorrágico</strong> — reversão de anticoagulante se em uso; neurocirurgia se hematoma com indicação; controle PA; evitar AAS/anticoagulante agudo.</li>
        <li><strong>Profilaxia convulsão</strong> — <strong>não rotineira</strong> no AVC isquêmico agudo. Considerar levetiracetam 500 mg 12/12 h ou fenitoína 15–20 mg/kg EV se convulsão no início com déficit persistente, hemorragia lobar ou HIC.</li>
        <li><strong>Internação UTI/neurovascular</strong> — todos os AVC confirmados; TIA com ABCD2 alto ou déficit flutuante.</li>
      </ol>
      <h4>Exames / investigação</h4>
      <ul>
        <li>NIHSS seriado · ECG · troponina · hemograma, TAP, plaquetas, creatinina</li>
        <li>RM/angioRM se janela estendida para trombectomia (até 24 h com critérios DAWN/DEFUSE)</li>
      </ul>
      <p class="emerg-note">Referência: AHA/ASA 2019 · SBACV 2023. Meta porta-agulha ≤ 60 min. Conteúdo educacional — não substitui julgamento clínico.</p>`,

  'afta-estomatite': `
      <p class="muted">Úlceras aftosas orais ou estomatite dolorosa — maioria viral ou idiopática; excluir herpes, candidíase e reações medicamentosas.</p>
      <h4>Pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>Avaliar gravidade</strong> — hidratação, deglutição, febre alta, imunossupressão, lesões extensas ou sangramento.</li>
        <li><strong>Analgesia tópica/sistêmica</strong> — benzidamina spray/gargarejo (Flogoral®) ou lidocaína gel 2% tópica antes das refeições; dipirona 1 g VO 6/6 h ou paracetamol 750 mg VO 6/6 h.</li>
        <li><strong>Causa infecciosa</strong> — herpes simples: aciclovir 400 mg VO 5×/dia × 5–7 dias (ou 5 mg/kg 8/8 h EV se grave); mononucleose: suporte; candidíase: nistatina suspensão ou fluconazol 150 mg VO dose única.</li>
        <li><strong>Hidratação</strong> — SF EV se desidratação por odinofagia; considerar internação pediátrica se recusa oral.</li>
      </ol>
      <h4>Alta / ambulatorial</h4>
      <ul>
        <li>Higiene oral suave · evitar ácidos/cítricos · dieta fria e macia</li>
        <li>Triancinolona pomada oral (Omcilon-A Orabase®) em aftas isoladas recorrentes</li>
        <li>Retorno se &gt; 7–10 dias sem melhora, lesões &gt; 1 cm, febre persistente ou perda ponderal</li>
      </ul>
      <p class="emerg-note">Referência: MS/atenção básica · SBP infectologia. Conteúdo educacional — não substitui julgamento clínico.</p>`,

  'alergia-anafilaxia': `
      <p class="muted">Reação alérgica sistêmica potencialmente fatal — <strong>epinefrina IM é 1ª linha</strong>, antes de anti-H1, corticoide ou expansão volêmica.</p>
      <h4>Pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>Reconhecer anafilaxia</strong> — urticária/angioedema + comprometimento respiratório, cardiovascular ou gastrointestinal rápido; ou exposição conhecida + hipotensão.</li>
        <li><strong>Epinefrina IM imediata</strong> — <strong>0,3–0,5 mg IM</strong> (0,3–0,5 mL da solução 1:1000) na face anterolateral da coxa; repetir a cada 5–15 min se persistência. Crianças: 0,01 mg/kg IM (máx. 0,5 mg).</li>
        <li><strong>Decúbito dorsal</strong> — elevar MMII; O₂ alto fluxo; acesso venoso.</li>
        <li><strong>Expansão volêmica</strong> — SF 0,9% 20 mL/kg em bolus (adulto 1–2 L rápido se hipotensão) após epinefrina.</li>
        <li><strong>Adjuvantes (após epinefrina)</strong> — difenidramina 25–50 mg IV/IM ou prometazina 25 mg IM; hidrocortisona 200 mg IV ou metilprednisolona 125 mg IV; salbutamol nebulização se broncoespasmo.</li>
        <li><strong>Refratário</strong> — repetir epinefrina IM; considerar infusão de epinefrina EV titulada em monitor (UTI); glucagon 1–2 mg IV se uso de β-bloqueador.</li>
        <li><strong>Observação ≥ 4–6 h</strong> — risco de reação bifásica; prescrever autoinjetor de epinefrina (EpiPen®/Anapen®) e plano de ação.</li>
      </ol>
      <h4>Alta / ambulatorial</h4>
      <ul>
        <li>Autoinjetor epinefrina + orientação de uso · evitar gatilho identificado</li>
        <li>Encaminhar alergologia para teste e imunoterapia quando indicado</li>
        <li>Anti-H1 VO 3–5 dias; corticoide curto se reação moderada</li>
      </ul>
      <p class="emerg-note">Referência: WAO 2020 · Resolução CFM anafilaxia · MS. Conteúdo educacional — não substitui julgamento clínico.</p>`,

  'alcoolismo-intox-abstinencia': `
      <p class="muted">Intoxicação aguda por álcool (depressão do SNC) vs abstinência (tremor, sudorese, risco de delirium tremens/convulsão) — abordagens distintas.</p>
      <h4>Pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>Intoxicação aguda</strong> — ABC; glicemia; tiamina 300 mg IV/IM antes de glicose (prevenir Wernicke); monitorar rebaixamento e aspiração; não induzir vômito.</li>
        <li><strong>Abstinência leve-moderada</strong> — CIWA-Ar; diazepam 10 mg VO 6/6 h ou lorazepam 2 mg VO 6/6 h titulado ao sintoma (sedação leve sem rebaixamento).</li>
        <li><strong>Abstinência grave / delirium tremens</strong> — diazepam 10–20 mg IV a cada 5–10 min até sedação controlada (ou lorazepam 2–4 mg IV); internação; monitor cardíaco.</li>
        <li><strong>Profilaxia convulsão</strong> — benzodiazepínico é primeira linha; fenitoína adjuvante se convulsão recorrente apesar de BZD.</li>
        <li><strong>Correções associadas</strong> — hipomagnesemia, hipocalemia, desidratação (SF); avaliar pancreatite, hepatite, TCE concomitante.</li>
      </ol>
      <h4>Exames / investigação</h4>
      <ul>
        <li>Glicemia, eletrólitos, Mg²⁺, função hepática, amilase, hemograma, ECG</li>
        <li>TC crânio se trauma, rebaixamento desproporcional ou focalidade neurológica</li>
      </ul>
      <h4>Alta / ambulatorial</h4>
      <ul>
        <li>Abstinência leve com suporte familiar e retorno em 24–48 h — esquema descendente de diazepam 5 dias</li>
        <li>Encaminhar CAPS-AD / ambulatório de dependência química</li>
      </ul>
      <p class="emerg-note">Referência: ASAM · MS/CGÁlcool. Conteúdo educacional — não substitui julgamento clínico.</p>`,

  'ameaca-aborto': `
      <p class="muted">Sangramento vaginal na 1ª metade da gestação com colo fechado e feto viável — estabilizar, confirmar idade gestacional e excluir gravidez ectópica.</p>
      <h4>Pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>ABC</strong> — avaliar instabilidade hemodinâmica; 2 acessos venosos se sangramento intenso; tipagem e reserva de hemácias se necessário.</li>
        <li><strong>β-hCG quantitativo</strong> — correlacionar com USG transvaginal (prioritário).</li>
        <li><strong>USG obstétrico</strong> — saco intrauterino, embrião com BCF, hematoma subcoriônico; <strong>excluir ectópica</strong> se β-hCG acima do limiar discriminativo sem saco IU.</li>
        <li><strong>Repouso relativo</strong> — abstinência sexual temporária; analgesia com dipirona ou paracetamol; evitar AINE na gestação.</li>
        <li><strong>Progesterona</strong> — dydrogesterona 10 mg VO 8/8 h ou progesterona micronizada 200–400 mg VO/VR conforme protocolo e idade gestacional, se indicado pelo obstetra.</li>
        <li><strong>Internação</strong> — sangramento intenso, dor abdominal intensa, hipotensão, suspeita de aborto incompleto ou ectópica.</li>
      </ol>
      <h4>Exames / investigação</h4>
      <ul>
        <li>Hemograma · Rh — imunoglobulina anti-D 300 µg IM se mãe Rh negativo e não sensibilizada</li>
        <li>β-hCG seriado (48 h) se ectópica não visualizada inicialmente</li>
      </ul>
      <p class="emerg-note">Referência: FEBRASGO 2023 · MS/Pré-natal. Conteúdo educacional — não substitui julgamento clínico.</p>`,

  'amigdalite-bacteriana': `
      <p class="muted">Faringoamigdalite bacteriana (Streptococcus β-hemolítico grupo A) — Centor/McIsaac orientam teste e ATB; evitar AINE excessivo em crianças.</p>
      <h4>Pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>Avaliar complicações</strong> — abscesso peritonsilar, edema de via aérea, desidratação, febre &gt; 39 °C &gt; 3 dias.</li>
        <li><strong>Teste rápido estreptocócico ou cultura de orofaringe</strong> — tratar se positivo ou alta suspeita clínica (exsudato + linfonodos + ausência de tosse).</li>
        <li><strong>Antibiótico 1ª linha</strong> — amoxicilina 500 mg VO 8/8 h × 10 dias (adulto) ou 50 mg/kg/dia VO (máx. 1 g/dia) pediátrico; alergia: azitromicina 500 mg VO 1×/dia × 5 dias.</li>
        <li><strong>Sintomáticos</strong> — dipirona/paracetamol; hidratação; gargarejo com água morna e sal.</li>
        <li><strong>Abscesso peritonsilar</strong> — punção/derivação + clindamicina 600 mg IV 8/8 h ou amoxicilina-clavulanato 875/125 mg VO 12/12 h; otorrino/urgência cirúrgica.</li>
      </ol>
      <h4>Alta / ambulatorial</h4>
      <ul>
        <li>Completar 10 dias de ATB mesmo com melhora em 48 h (prevenir febre reumática)</li>
        <li>Retorno se trismo, voz abafada, unilateralização da dor (abscesso)</li>
      </ul>
      <p class="emerg-note">Referência: IDSA 2021 · SBP infectologia · MS. Conteúdo educacional — não substitui julgamento clínico.</p>`,

  'anemia-ferropriva': `
      <p class="muted">Anemia microcítica hipocrômica por deficiência de ferro — investigar sangramento oculto no adulto; reposição oral na maioria dos casos.</p>
      <h4>Pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>Gravidade</strong> — Hb &lt; 7 g/dL ou instabilidade hemodinâmica → transfusão de concentrado de hemácias (1–2 U) conforme clínica.</li>
        <li><strong>Estabilização</strong> — identificar sangramento ativo (GI, ginecológico, trauma); corrigir hipovolemia.</li>
        <li><strong>Reposição de ferro</strong> — sulfato ferroso 325 mg VO 1–3×/dia (entre refeições, com vitamina C) ou ferro polimaltosado 100–200 mg Fe elementar/dia; EV (ferro carboximaltose/ sacarose) se intolerância oral grave ou má absorção.</li>
        <li><strong>Investigar causa</strong> — homens e mulheres pós-menopausa: sangramento GI até prova em contrário.</li>
      </ol>
      <h4>Exames / investigação</h4>
      <ul>
        <li>Hemograma, VCM, HCM, ferritina, ferro sérico, TIBC · endoscopia se adulto com anemia ferropriva</li>
        <li>β-hCG em mulher em idade fértil</li>
      </ul>
      <h4>Alta / ambulatorial</h4>
      <ul>
        <li>Retorno em 4–8 semanas para hemograma de controle</li>
        <li>Tratar causa base (menorragia, DRGE/úlcera, parasitose)</li>
      </ul>
      <p class="emerg-note">Referência: SBC/hematologia · MS. Conteúdo educacional — não substitui julgamento clínico.</p>`,

  'anemia-falciforme': `
      <p class="muted">Crise álgica vaso-oclusiva na anemia falciforme — analgesia agressiva precoce, hidratação e exclusão de complicações (síndrome torácica aguda, sequestro esplênico, AVC).</p>
      <h4>Pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>ABC e oxigênio</strong> — SpO₂ alvo ≥ 95%; acesso venoso.</li>
        <li><strong>Analgesia imediata</strong> — dipirona 1 g IV + morfina 0,1 mg/kg IV (titular 2–5 mg a cada 10–15 min) ou PCA; cetoprofeno EV só se contraindicação a opioide (cautela renal).</li>
        <li><strong>Hidratação</strong> — SF 0,9% manutenção + correção de déficit; evitar hiperhidratação (edema pulmonar).</li>
        <li><strong>Investigar complicações</strong> — Rx tórax (síndrome torácica aguda); hemograma (queda abrupta de Hb → sequestro esplênico); TC crânio se déficit neurológico.</li>
        <li><strong>Síndrome torácica aguda</strong> — O₂, ATB ceftriaxona 1 g IV + azitromicina 500 mg IV, transfusão simples ou exchange conforme gravidade.</li>
        <li><strong>Internação</strong> — dor refratária, febre, hipoxemia, queda de Hb &gt; 2 g/dL, dor torácica.</li>
      </ol>
      <h4>Exames / investigação</h4>
      <ul>
        <li>Hemograma, reticulócitos, LDH, bilirrubina, função renal · culturas se febre</li>
        <li>ECG se dor torácica</li>
      </ul>
      <p class="emerg-note">Referência: NHLBI 2014 · SBC/hematologia. Conteúdo educacional — não substitui julgamento clínico.</p>`,

  'ansiedade-crise': `
      <p class="muted">Crise de ansiedade/pânico — excluir causas orgânicas (SCA, TEP, hipoglicemia, hipertireoidismo) antes de tratar como transtorno de ansiedade.</p>
      <h4>Pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>Triagem orgânica</strong> — ECG, glicemia capilar, SpO₂, PA; história de início súbito com palpitação, dispneia, parestesia, medo de morte.</li>
        <li><strong>Ambiente calmo</strong> — verbalização tranquilizadora; evitar excesso de exames se baixa suspeita orgânica e exame normal.</li>
        <li><strong>Farmacológico se intenso</strong> — diazepam 5–10 mg VO/SL ou lorazepam 1–2 mg VO/SL (cautela em idoso, gestante, dependência); hidroxizina 25–50 mg VO alternativa.</li>
        <li><strong>Sintomas físicos</strong> — salbutamol <strong>não</strong> indicado sem broncoespasmo; tratar cefaleia/tremor com sintomáticos.</li>
        <li><strong>Internação rara</strong> — ideação suicida, síndrome serotoninérgica, abstinência de álcool/BZD não diagnosticada.</li>
      </ol>
      <h4>Alta / ambulatorial</h4>
      <ul>
        <li>Orientar natureza benigna do pânico após exclusão de gravidade</li>
        <li>Encaminhar psiquiatria/psicologia; ISRS (sertralina, escitalopram) para profilaxia</li>
        <li>Técnicas de respiração; evitar benzodiazepínico crônico</li>
      </ul>
      <p class="emerg-note">Referência: APA 2023 · CFM. Conteúdo educacional — não substitui julgamento clínico.</p>`,

  'antiparasitarios': `
      <p class="muted">Terapia e profilaxia de helmintíases comuns no Brasil — escolher fármaco conforme parasita e idade; verificar gravidez e interações.</p>
      <h4>Pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>Ascaridíase/enterobíase/ankilostomíase</strong> — albendazol 400 mg VO dose única (adulto e &gt; 2 anos); ou mebendazol 100 mg VO 12/12 h × 3 dias.</li>
        <li><strong>Estrongiloidíase</strong> — ivermectina 200 µg/kg/dia VO × 2 dias (repetir em 2 semanas se imunossuprimido).</li>
        <li><strong>Teníase</strong> — praziquantel 5–10 mg/kg VO dose única ou niclosamida 2 g VO (mastigar).</li>
        <li><strong>Giardíase</strong> — metronidazol 250 mg VO 8/8 h × 5 dias ou secnidazol 2 g VO dose única.</li>
        <li><strong>Complicações</strong> — obstrução biliar por Ascaris: ascaricida + avaliação cirúrgica/endoscópica; Hiperinfestação strongyloides: internação + ivermectina prolongada.</li>
      </ol>
      <h4>Alta / ambulatorial</h4>
      <ul>
        <li>Tratar contactantes domiciliares em enterobíase (albendazol dose única, repetir em 2 semanas)</li>
        <li>Higiene: lavar mãos, tratar água e esgoto, cortar unhas</li>
      </ul>
      <p class="emerg-note">Referência: MS/PCDT parasitoses · OMS. Gestantes: preferir mebendazol após 1º trimestre; evitar ivermectina. Conteúdo educacional — não substitui julgamento clínico.</p>`,

  'arritmias': `
      <p class="muted">Taquiarritmias e bradiarritmias instáveis — priorizar cardioversão/estimulação se instabilidade; estável → manobra vagal, fármaco ou anticoagulação conforme ritmo.</p>
      <h4>Pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>Instabilidade (hipotensão, dor torácica, dispneia, rebaixamento)</strong> — cardioversão elétrica sincronizada imediata (ver cardioversao-eletrica); sedação com etomidato 0,1–0,2 mg/kg ou propofol 0,5–1 mg/kg se tempo permitir.</li>
        <li><strong>TSV estável</strong> — manobra de Valsalva; adenosina 6 mg IV rápido → 12 mg se necessário (2ª dose); ou verapamil 5–10 mg IV (evitar em WPW com FA).</li>
        <li><strong>FA/flutter com RVR estável</strong> — controle de frequência: metoprolol 5 mg IV q5min (máx. 15 mg) ou diltiazem 0,25 mg/kg IV; anticoagulação conforme CHA₂DS₂-VASc e tempo de início.</li>
        <li><strong>Bradicardia sintomática</strong> — atropina 1 mg IV (repetir até 3 mg); se falha → dopamina 5–20 µg/kg/min ou adrenalina 2–10 µg/min; marcapasso transcutâneo/transvenoso.</li>
        <li><strong>TV com pulso estável</strong> — amiodarona 150 mg IV em 10 min → infusão 1 mg/min × 6 h; ou procainamida 20 mg/kg IV (monitor QT).</li>
        <li><strong>Investigar causa</strong> — eletrólitos, TSH, troponina, toxicologia (digoxina, antiarrítmicos).</li>
      </ol>
      <h4>Exames / investigação</h4>
      <ul>
        <li>ECG 12 derivações · monitor contínuo · eletrólitos, Mg²⁺, função renal</li>
        <li>Eco se IC ou suspeita estrutural</li>
      </ul>
      <p class="emerg-note">Referência: AHA/ACC/HRS 2023 · SBC arritmias. Conteúdo educacional — não substitui julgamento clínico.</p>`,

  'artralgia-dor-msk': `
      <p class="muted">Dor musculoesquelética aguda sem sinais de alarme — analgesia, proteção articular e investigação dirigida se artrite inflamatória ou trauma.</p>
      <h4>Pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>Sinais de alarme</strong> — febre, articulação quente/eritematosa monoarticular (artrocentese para excluir séptica), trauma com deformidade, déficit neurovascular.</li>
        <li><strong>Analgesia</strong> — dipirona 1 g IV/VO 6/6 h; cetoprofeno 100 mg IV/VO 8/8 h ou naproxeno 500 mg VO 12/12 h (cautela GI/renal); tramadol 50–100 mg VO se dor refratária.</li>
        <li><strong>Articular aguda</strong> — repouso, gelo 20 min 3–4×/dia, elevação; tornozeleira/tipoia conforme local.</li>
        <li><strong>Artrite séptica suspeita</strong> — artrocentese urgente; ceftriaxona 1 g IV + vancomicina 15 mg/kg IV se internação (ajustar ao Gram).</li>
        <li><strong>Imagem</strong> — Rx se trauma; USG articular se derrame; RM ambulatorial se suspeita de lesão ligamentar/meniscal.</li>
      </ol>
      <h4>Alta / ambulatorial</h4>
      <ul>
        <li>AINE 5–7 dias · reabilitação gradual</li>
        <li>Retorno se febre, piora da dor, limitação progressiva</li>
      </ul>
      <p class="emerg-note">Referência: MS/RENAME · ACR. Conteúdo educacional — não substitui julgamento clínico.</p>`,

  'ascaridiase': `
      <p class="muted">Infestação por <em>Ascaris lumbricoides</em> — frequentemente assintomática; tratar com anti-helmíntico e investigar complicações (obstrução intestinal, via biliar).</p>
      <h4>Pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>Forma não complicada</strong> — albendazol 400 mg VO dose única (adulto e &gt; 2 anos) ou mebendazol 100 mg VO 12/12 h × 3 dias.</li>
        <li><strong>Obstrução intestinal</strong> — jejum, SNG, hidratação IV; ascaricida após estabilização; cirurgia se perfuração, peritonite ou falha clínica 48 h.</li>
        <li><strong>Síndrome de Loeffler</strong> (migração larvária) — sintomáticos; albendazol após fase aguda.</li>
        <li><strong>Colangite/pancreatite por Ascaris</strong> — albendazol + avaliação cirúrgica/endoscópica (CPRE) para extração.</li>
      </ol>
      <h4>Alta / ambulatorial</h4>
      <ul>
        <li>Repetir dose em 2–4 semanas em hiperinfestação</li>
        <li>Medidas de saneamento e higiene das mãos</li>
      </ul>
      <p class="emerg-note">Referência: MS/PCDT parasitoses intestinais · OMS. Conteúdo educacional — não substitui julgamento clínico.</p>`,

  'asma-broncoespasmo': `
      <p class="muted">Crise asmática ou broncoespasmo agudo — broncodilatador inalatório repetido + corticoide sistêmico precoce; sulfato de magnésio se crise grave refratária.</p>
      <h4>Pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>Classificar gravidade</strong> — fala entrecortada, SpO₂ &lt; 90%, PEF &lt; 50%, silêncio auscultatório = grave.</li>
        <li><strong>O₂</strong> — alvo SpO₂ 94–98%; monitorizar.</li>
        <li><strong>Broncodilatador</strong> — salbutamol (Aerolin®) 4–8 puffs a cada 20 min × 3 ciclos (nebulização: 5 mg salbutamol + 3 mL SF) + <strong>brometo de ipratrópio</strong> 0,5 mg nebulização a cada 20 min × 3 na crise moderada-grave.</li>
        <li><strong>Corticoide sistêmico precoce</strong> — prednisona 40–60 mg VO ou metilprednisolona 60–125 mg IV; manter prednisona 40 mg/dia × 5 dias na alta.</li>
        <li><strong>Crise grave refratária</strong> — sulfato de magnésio 2 g IV em 20 min; considerar adrenalina SC 0,3–0,5 mg se iminência de parada; IOT se fadiga/hipoxemia refratária.</li>
        <li><strong>Investigar gatilho</strong> — infecção, pneumotórax, TEP, anafilaxia, aspiração.</li>
      </ol>
      <h4>Alta / ambulatorial</h4>
      <ul>
        <li>PEF &gt; 70% do previsto, SpO₂ &gt; 94% em ar ambiente, fala frases completas</li>
        <li>Prescrever β₂ de resgate + corticoide curto + revisar preventivo (CI + LABA ou dose ICS adequada)</li>
        <li>Plano de ação escrito; retorno em 24–48 h se crise grave</li>
      </ul>
      <p class="emerg-note">Referência: GINA 2024 · SBPT. Pediatria: salbutamol 2,5–5 mg nebul ou 4–8 puffs MDI com espaçador. Conteúdo educacional — não substitui julgamento clínico.</p>`,

  'balanopostite': `
      <p class="muted">Inflamação de glande e prepúcio — candidíase, bacteriana, irritativa ou DST; higiene e tratamento dirigido à etiologia.</p>
      <h4>Pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>Excluir urgência</strong> — parafimose (redução manual urgente), gangrena de Fournier (dor desproporcional, crepitação, sepse).</li>
        <li><strong>Higiene local</strong> — banho com água morna, evitar sabonetes irritantes; secar bem.</li>
        <li><strong>Candidíase</strong> — clotrimazol creme 1% 2×/dia × 7–14 dias ou fluconazol 150 mg VO dose única.</li>
        <li><strong>Bacteriana leve</strong> — mupirocina pomada 2×/dia × 7 dias; se celulite: cefalexina 500 mg VO 6/6 h.</li>
        <li><strong>Parafimose</strong> — analgesia (lidocaína tópica 2%); compressão manual da glande + redução do prepúcio; se falha → urologia (incisão dorsal).</li>
      </ol>
      <h4>Alta / ambulatorial</h4>
      <ul>
        <li>Evitar relações até resolução se DST suspeita — coletar sorologias/PCR conforme risco</li>
        <li>Circuncisão eletiva se balanite de repetição ou fimose sintomática</li>
      </ul>
      <p class="emerg-note">Referência: MS/IST · SBD urologia. Conteúdo educacional — não substitui julgamento clínico.</p>`,

  'bronquite-aguda': `
      <p class="muted">Inflamação traqueobrônquica aguda, geralmente viral — suporte, broncodilatador se hiper-reatividade e ATB só se suspeita bacteriana (ex.: pertussis, COPD).</p>
      <h4>Pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>Excluir pneumonia/asma</strong> — Rx tórax se febre alta, taquipneia, crepitações localizadas, SpO₂ baixa.</li>
        <li><strong>Sintomáticos</strong> — dipirona ou paracetamol; hidratação; evitar antitussígeno opioide de rotina.</li>
        <li><strong>Broncoespasmo associado</strong> — salbutamol 2–4 puffs 4/4–6/6 h ou nebulização 5 mg; prednisona 40 mg VO × 5 dias se sibilância persistente.</li>
        <li><strong>Coqueluche suspeita</strong> — azitromicina 500 mg VO 1×/dia × 5 dias (profilaxia de contactantes).</li>
        <li><strong>DPOC exacerbada</strong> — ver protocolo DPOC: salbutamol + ipratrópio + prednisona ± ATB se purulência.</li>
      </ol>
      <h4>Alta / ambulatorial</h4>
      <ul>
        <li>Resolução em 7–10 dias; repouso relativo</li>
        <li>Retorno se febre &gt; 3 dias, dispneia progressiva, hemoptise</li>
      </ul>
      <p class="emerg-note">Referência: MS/RENAME · SBPT. Conteúdo educacional — não substitui julgamento clínico.</p>`,

  'candidiase': `
      <p class="muted">Infecção por <em>Candida</em> (oral, vaginal, cutânea/balanite) — antifúngico tópico ou sistêmico conforme extensão e imunidade.</p>
      <h4>Pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>Candidíase oral leve</strong> — nistatina suspensão 100.000 UI/mL, 4–6 mL gargarejo 4×/dia × 7–14 dias ou miconazol gel oral 2×/dia.</li>
        <li><strong>Vaginal não complicada</strong> — fluconazol 150 mg VO dose única ou clotrimazol óvulo 500 mg VO noturno × 1–3 noites.</li>
        <li><strong>Balanite candidíase</strong> — clotrimazol creme 1% 2×/dia × 7–14 dias ± fluconazol 150 mg dose única.</li>
        <li><strong>Imunossuprimido / esofágica</strong> — fluconazol 200 mg VO 1×/dia × 14–21 dias; internação se sepse fúngica (candidemia → equinocandina EV).</li>
        <li><strong>Investigar</strong> — diabetes descompensado, HIV, uso de antibiótico/corticoide recente.</li>
      </ol>
      <h4>Alta / ambulatorial</h4>
      <ul>
        <li>Tratar parceiro se balanite recorrente; evitar duchas vaginais</li>
        <li>Retorno se sintomas persistem &gt; 7 dias (resistência, outra vulvovaginite)</li>
      </ul>
      <p class="emerg-note">Referência: MS/PCDT HIV · FEBRASGO vulvovaginites. Conteúdo educacional — não substitui julgamento clínico.</p>`,

  'cardioversao-eletrica': `
      <p class="muted">Cardioversão elétrica sincronizada (CVES) para taquiarritmias instáveis ou eletivas — sedação, sincronismo no QRS e cargas escalonadas.</p>
      <h4>Pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>Indicação imediata</strong> — FA/flutter/TSV/TV com instabilidade (PAS &lt; 90, dor isquêmica, edema agudo de pulmão, rebaixamento).</li>
        <li><strong>Preparo</strong> — O₂, monitor, acesso IV, aspirador; <strong>sincronizar</strong> no QRS (botão SYNC); anticoagulação se FA &gt; 48 h ou tempo desconhecido (ou eco TE previamente).</li>
        <li><strong>Sedação/analgesia</strong> — etomidato 0,1–0,2 mg/kg IV ou propofol 0,5–1 mg/kg IV; fentanil 1 µg/kg adjuvante.</li>
        <li><strong>Cargas (bifásico)</strong> — FA: 120–200 J → escalar; flutter/TSV: 50–100 J; TV com pulso: 100 J → 150 → 200 J.</li>
        <li><strong>Pós-cardioversão</strong> — ECG, PA, oximetria; amiodarona 150 mg IV se recorrência de FA/TV; anticoagulação contínua conforme CHA₂DS₂-VASc.</li>
        <li><strong>Não sincronizar</strong> em FV/TV sem pulso — desfibrilação de emergência (ACLS).</li>
      </ol>
      <h4>Exames / investigação</h4>
      <ul>
        <li>Eletrólitos, Mg²⁺ · digoxinemia se uso · eco se FA eletiva sem anticoagulação adequada</li>
      </ul>
      <p class="emerg-note">Referência: AHA/ACC/HRS 2023 · SBC. Conteúdo educacional — não substitui julgamento clínico.</p>`,

  'cefaleias': `
      <p class="muted">Cefaleia aguda — distinguir tensional, enxaqueca e cefaleia em salvas; excluir subaracnoideia, meningite e cefaleia secundária de alarme.</p>
      <h4>Pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>Sinais de alarme (SNOOP4)</strong> — início súbito (“pior da vida”), febre, rigidez de nuca, déficit focal, papiledema, gestação/puerpério, imunossupressão, trauma → TC crânio ± punção lombar.</li>
        <li><strong>Cefaleia tensional</strong> — dipirona 1 g IV/VO ou paracetamol 750 mg + relaxante muscular (ciclobenzaprina 5–10 mg VO) se componente cervical.</li>
        <li><strong>Enxaqueca moderada-grave</strong> — sumatriptano 50–100 mg VO (máx. 200 mg/dia) ou 6 mg SC; antiemético (metoclopramida 10 mg IV); dipirona adjuvante. Evitar triptano se DAC, AVC prévio, PA não controlada.</li>
        <li><strong>Enxaqueca refratária</strong> — metoclopramida 10 mg IV + dipirona 1 g IV + hidratação SF; considerar dexametasona 10 mg IV (prevenir recorrência 48 h).</li>
        <li><strong>Cefaleia em salvas</strong> — <strong>O₂ 100% 12–15 L/min</strong> por máscara não reinalante × 15–20 min; sumatriptano 6 mg SC ou zolmitriptano 5 mg nasal; verapamil 80 mg VO 8/8 h para profilaxia ambulatorial.</li>
        <li><strong>HSA suspeita</strong> — TC sem contraste; se normal e alta suspeita → LP; neurocirurgia.</li>
      </ol>
      <h4>Alta / ambulatorial</h4>
      <ul>
        <li>Plano abortivo e profilático para enxaqueca recorrente (propranolol, topiramato, amitriptilina)</li>
        <li>Diário de cefaleia; evitar uso excessivo de analgésicos (&gt; 10–15 dias/mês)</li>
      </ul>
      <p class="emerg-note">Referência: AAN/SBACV cefaleias 2023 · MS. Conteúdo educacional — não substitui julgamento clínico.</p>`,

  'celulite': `
      <p class="muted">Infecção bacteriana da derme/subcutâneo — eritema, calor, dor com bordas mal definidas; tratar ATB e avaliar extensão/necrotizante.</p>
      <h4>Pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>Excluir urgência</strong> — fascite necrotizante (dor desproporcional, crepitação, bolhas, sepse) → cirurgia + piperacilina-tazobactam 4,5 g IV 6/6 h + clindamicina 600 mg IV 8/8 h.</li>
        <li><strong>Celulite leve-moderada (ambulatorial possível)</strong> — cefalexina 500 mg VO 6/6 h × 7–10 dias ou clindamicina 300 mg VO 6/6 h se alergia a β-lactâmico.</li>
        <li><strong>Celulite moderada-grave / sistêmica</strong> — ceftriaxona 1 g IV 12/12 h ou oxacilina 2 g IV 4/4 h; associar vancomicina se MRSA de risco (diabetes, úlcera crônica).</li>
        <li><strong>Elevar membro</strong> — marcar bordas com caneta para monitorar progressão; analgesia com dipirona.</li>
        <li><strong>Abscesso</strong> — drenagem incisional + ATB adjuvante.</li>
      </ol>
      <h4>Exames / investigação</h4>
      <ul>
        <li>Hemocultura se febre/T &gt; 38,5 °C, imunossupressão · PCR/VHS auxiliam seguimento</li>
        <li>USG se dúvida de abscesso ou tromboflebite</li>
      </ul>
      <h4>Alta / ambulatorial</h4>
      <ul>
        <li>Retorno em 48 h se expansão da eritema, febre persistente ou não tolerância oral</li>
      </ul>
      <p class="emerg-note">Referência: IDSA pele e partes moles 2014 · MS. Conteúdo educacional — não substitui julgamento clínico.</p>`,

  'cetoacidose-diabetica': `
      <p class="muted">Emergência metabólica — hiperglicemia, acidose e cetose; tratamento: fluidos, insulina EV e reposição de K⁺ guiada por níveis seriados. Evitar bicarbonato de rotina.</p>
      <h4>Pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>ABC</strong> — 2 acessos venosos; monitor; glicemia, gasometria, Na⁺, K⁺, creatinina, β-hidroxibutirato.</li>
        <li><strong>Fluidos 1ª hora</strong> — SF 0,9% 15–20 mL/kg IV (≈ 1–1,5 L adulto) se hipovolemia; reavaliar Na⁺ para escolher SF 0,45% se hipernatremia.</li>
        <li><strong>Potássio antes/durante insulina</strong> — K⁺ &lt; 3,3 mEq/L: repor 20–40 mEq/h e <strong>adiar insulina</strong>; K⁺ 3,3–5,2: insulina + 20–30 mEq KCl por litro de fluido; K⁺ &gt; 5,2: aguardar e monitorar.</li>
        <li><strong>Insulina regular EV</strong> — 0,1 U/kg/h em BIC (bolus 0,1 U/kg opcional); meta queda glicemia 50–70 mg/dL/h.</li>
        <li><strong>Glicemia &lt; 200–250 mg/dL</strong> — adicionar SG 5–10% ao fluido e manter insulina até pH &gt; 7,3 e cetonas negativas/traço.</li>
        <li><strong>Bicarbonato</strong> — <strong>não rotineiro</strong>; considerar só se pH &lt; 6,9 com instabilidade hemodinâmica (50 mEq em 200 mL SF em 1 h).</li>
        <li><strong>Buscar precipitante</strong> — infecção, IAM, suspensão de insulina, SGLT2 (cetoacidose euglicêmica).</li>
      </ol>
      <h4>Exames / investigação</h4>
      <ul>
        <li>Gasometria e eletrólitos q2–4 h · glicemia horária · ECG (alterações por K⁺)</li>
        <li>Hemocultura, urina I/E, Rx tórax se infecção suspeita</li>
      </ul>
      <p class="emerg-note">Referência: ADA 2024 · SBD. Critérios de resolução: pH &gt; 7,3, HCO₃ &gt; 15, glicemia &lt; 200, anion gap normal. Conteúdo educacional — não substitui julgamento clínico.</p>`,

  'lombalgia-ciatalgia': `
      <p class="muted">Lombalgia aguda e ciatalgia/radiculopatia lombar — maioria resolve com conservador; excluir cauda equina, fratura, infecção e neoplasia.</p>
      <h4>Pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>Sinais de alarme</strong> — anestesia em sela, retenção urinária/incontinência (cauda equina → RM urgente + neurocirurgia), febre, trauma de alta energia, câncer prévio, uso crônico de corticoide.</li>
        <li><strong>Analgesia</strong> — dipirona 1 g IV/VO 6/6 h; ciclobenzaprina 5–10 mg VO 8/8 h (espasmo); tramadol 50–100 mg VO se dor moderada-grave.</li>
        <li><strong>Radiculopatia sem déficit motor</strong> — AINE 5–7 dias; manter mobilidade relativa; evitar repouso absoluto prolongado.</li>
        <li><strong>Déficit motor progressivo ou cauda equina</strong> — RM lombar urgente; dexametasona 10 mg IV se compressão tumoral/edema (neurocirurgia).</li>
        <li><strong>Torcicolo/cervicalgia</strong> — analgesia + calor local; Rx cervical se trauma; excluir meningismo.</li>
      </ol>
      <h4>Alta / ambulatorial</h4>
      <ul>
        <li>Retorno em 4–6 semanas se persistência; fisioterapia</li>
        <li>Considerar pregabalina 75 mg VO 12/12 h se neuropatia persistente</li>
        <li>RM ambulatorial se &gt; 6 semanas com ciatalgia incapacitante ou déficit neurológico</li>
      </ul>
      <h4>Exames / investigação</h4>
      <ul>
        <li>Rx lombar só se red flags de fratura; RM se déficit motor, suspeita de hérnia com síndrome compressiva ou cauda equina</li>
      </ul>
      <p class="emerg-note">Referência: ACP/Ortho guidelines 2023 · SBOT. Conteúdo educacional — não substitui julgamento clínico.</p>`
};
