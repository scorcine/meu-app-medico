/* Pronto Socorro — conteúdo clínico (lote 1) */
const PS_CONTENT_1 = {
  'abdome-agudo': `
      <p class="muted">Dor abdominal aguda com possível causa cirúrgica ou médica — priorizar ABC, analgesia escalonada, acesso venoso e investigação dirigida (Rx, labs, imagem).</p>
      <h4>Prescrições de pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>ABC</strong> — monitorização, O₂ se necessário, 2 acessos venosos calibrosos se instável ou suspeita de abdome cirúrgico.</li>
        <li><strong>Analgesia escalonada</strong> — reavaliar após cada degrau; evitar mascarar sinais de peritonite:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> dipirona 1 g IV/IM (Novalgina®) 6/6 h ou paracetamol 500 mg ou 750 mg VO / 750 mg EV 6/6 h</li>
            <li><strong>Alternativa / resistência:</strong> cetoprofeno 100 mg IV 8/8 h ou naproxeno 500 mg VO 12/12 h (cautela GI/renal; evitar se suspeita de úlcera perfurada)</li>
            <li><strong>Refratário / grave:</strong> tramadol 50–100 mg IV lento 6/6 h → morfina 2–5 mg IV titulada q10–15 min (máx. 10 mg) se dor intensa</li>
          </ul>
        </li>
        <li><strong>Medidas iniciais</strong> — jejum, SNG se vômitos/íleo; cateter vesical se suspeita de retenção ou choque; antiemético:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> metoclopramida 10 mg IV 8/8 h</li>
            <li><strong>Alternativa / resistência:</strong> ondansetrona 4–8 mg IV 8/8 h</li>
            <li><strong>Refratário / grave:</strong> associação metoclopramida + ondansetrona; hidratação EV agressiva se vômitos incoercíveis</li>
          </ul>
        </li>
        <li><strong>Laboratório</strong> — hemograma, amilase/lipase, função renal, eletrólitos, lactato se sepse/choque; β-hCG em mulher em idade fértil; coagulograma se cirurgia provável.</li>
        <li><strong>Imagem</strong> — Rx abdome (ortostático/decúbito) se suspeita de obstrução/perfuração; USG abdome (colecistite, apendicite pediátrica); TC com contraste se abdome agudo não esclarecido (adulto estável).</li>
        <li><strong>Condutas específicas</strong> — apendicite/colecistite:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> ceftriaxona 1 g IV 12/12 h + metronidazol 500 mg IV 8/8 h + cirurgia</li>
            <li><strong>Alternativa / resistência:</strong> piperacilina-tazobactam 4,5 g IV 6/6 h se sepse/gravidade</li>
            <li><strong>Alérgico à penicilina:</strong> ciprofloxacino 400 mg IV 12/12 h + metronidazol 500 mg IV 8/8 h</li>
            <li><strong>Refratário / grave:</strong> meropenem 1 g IV 8/8 h + cirurgia de urgência</li>
          </ul>
          Úlcera perfurada: omeprazol 40 mg IV 12/12 h + cirurgia. Pancreatite: SF 0,9% 250–500 mL/h nas primeiras 24 h. Abdome vascular: heparina não fracionada 80 U/kg bolus + 18 U/kg/h ou enoxaparina conforme protocolo.
        </li>
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
      <h4>Prescrições de pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>ABC</strong> — via aérea, O₂ alvo SpO₂ &gt; 94%, 2 acessos venosos, monitor cardíaco.</li>
        <li><strong>Glicemia capilar imediata</strong> — hipoglicemia mimetiza AVC; corrigir se &lt; 60 mg/dL:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> glicose 50% 50 mL IV (25 g) em bolus</li>
            <li><strong>Alternativa / resistência:</strong> glicose 10% 250 mL IV em infusão</li>
            <li><strong>Refratário / grave:</strong> repetir bolus glicose + investigar causa (insulina, sulfonilureia, sepse)</li>
          </ul>
        </li>
        <li><strong>TC crânio sem contraste em ≤ 25 min</strong> — porta-imagem; angioTC se suspeita de oclusão de grande vaso.</li>
        <li><strong>PA — alvos conforme tipo</strong> — <em>isquêmico pré-lise/MT:</em> tratar se &gt; 185/110 mmHg:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> labetalol 10–20 mg IV (repetir q20 min, máx. 300 mg)</li>
            <li><strong>Alternativa / resistência:</strong> hidralazina 10 mg IV q20–30 min ou nicardipina EV (Nimotop®) infusão titulada</li>
            <li><strong>Refratário / grave:</strong> nitroprussiato de sódio EV em UTI se PA refratária (cautela neurológica)</li>
          </ul>
          <em>Hemorrágico agudo:</em> meta geral &lt; 140/90 mmHg se estável (evitar queda abrupta).
        </li>
        <li><strong>AVC isquêmico</strong> — NIHSS; trombólise IV (alteplase 0,9 mg/kg, máx. 90 mg) se janela ≤ 4 h 30 e sem contraindicações; trombectomia se LVO. Antiagregação:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> AAS 300 mg VO após 24 h da lise (ou imediato se sem lise e sem anticoagulação)</li>
            <li><strong>Alternativa / resistência:</strong> clopidogrel 75 mg VO/dia se intolerância a AAS (após estabilização)</li>
            <li><strong>Refratário / grave:</strong> AAS + clopidogrel 75 mg VO (dupla antiagregação) conforme critérios de alto risco e protocolo institucional</li>
          </ul>
        </li>
        <li><strong>AVC hemorrágico</strong> — reversão de anticoagulante se em uso:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> controle PA + neurocirurgia se hematoma com indicação; evitar AAS/anticoagulante agudo</li>
            <li><strong>Alternativa / resistência:</strong> vitamina K 10 mg IV + complexo protrombínico se varfarina</li>
            <li><strong>Refratário / grave:</strong> idarucizumab se dabigatrana; andexanet alfa ou CCP se DOAC (conforme disponibilidade)</li>
          </ul>
        </li>
        <li><strong>Profilaxia convulsão</strong> — <strong>não rotineira</strong> no AVC isquêmico agudo. Se indicada:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> levetiracetam 500 mg IV/VO 12/12 h</li>
            <li><strong>Alternativa / resistência:</strong> fenitoína 15–20 mg/kg EV em 50 mL SF (máx. 50 mg/min) → 100 mg VO/IV 8/8 h</li>
            <li><strong>Refratário / grave:</strong> fenitoína + levetiracetam ou valproato 15–30 mg/kg EV (evitar em gestante)</li>
          </ul>
        </li>
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
      <h4>Prescrições de pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>Avaliar gravidade</strong> — hidratação, deglutição, febre alta, imunossupressão, lesões extensas ou sangramento.</li>
        <li><strong>Analgesia tópica/sistêmica</strong> — antes das refeições:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> benzidamina spray/gargarejo (Flogoral®) ou lidocaína gel 2% tópica + dipirona 1 g VO 6/6 h</li>
            <li><strong>Alternativa / resistência:</strong> paracetamol 750 mg VO 6/6 h; cetoprofeno 50 mg VO 8/8 h se inflamação associada (cautela pediátrica)</li>
            <li><strong>Refratário / grave:</strong> tramadol 50 mg VO 6/6 h se odinofagia incapacitante (adulto); dipirona 1 g IV se vômitos</li>
          </ul>
        </li>
        <li><strong>Causa infecciosa</strong> — herpes simples:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> aciclovir 400 mg VO 5×/dia × 5–7 dias</li>
            <li><strong>Alternativa / resistência:</strong> valaciclovir 1 g VO 12/12 h × 5–7 dias</li>
            <li><strong>Refratário / grave:</strong> aciclovir 5 mg/kg IV 8/8 h se imunossuprimido ou incapacidade oral</li>
          </ul>
          Mononucleose: suporte + analgesia. Candidíase:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> nistatina suspensão 100.000 UI/mL gargarejo 4×/dia</li>
            <li><strong>Alternativa / resistência:</strong> miconazol gel oral 2×/dia ou fluconazol 150 mg VO dose única</li>
          </ul>
        </li>
        <li><strong>Hidratação</strong> — se desidratação por odinofagia:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> SF 0,9% 500–1000 mL IV conforme déficit + estímulo oral gradual</li>
            <li><strong>Alternativa / resistência:</strong> Ringer lactato EV se eletrólitos alterados</li>
            <li><strong>Refratário / grave:</strong> internação pediátrica se recusa oral ou desidratação moderada-grave</li>
          </ul>
        </li>
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
      <h4>Prescrições de pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>Reconhecer anafilaxia</strong> — urticária/angioedema + comprometimento respiratório, cardiovascular ou gastrointestinal rápido; ou exposição conhecida + hipotensão.</li>
        <li><strong>Epinefrina IM imediata</strong> — <strong>1ª linha absoluta</strong>:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> epinefrina 0,3–0,5 mg IM (0,3–0,5 mL solução 1:1000) na face anterolateral da coxa; repetir q5–15 min. Crianças: 0,01 mg/kg IM (máx. 0,5 mg)</li>
            <li><strong>Alternativa / resistência:</strong> repetir epinefrina IM até 3 doses antes de considerar infusão EV</li>
            <li><strong>Refratário / grave:</strong> infusão epinefrina EV titulada em UTI; glucagon 1–2 mg IV se uso de β-bloqueador</li>
          </ul>
        </li>
        <li><strong>Decúbito dorsal</strong> — elevar MMII; O₂ alto fluxo; acesso venoso.</li>
        <li><strong>Expansão volêmica</strong> — após epinefrina:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> SF 0,9% 20 mL/kg em bolus (adulto 1–2 L rápido se hipotensão)</li>
            <li><strong>Alternativa / resistência:</strong> Ringer lactato 20 mL/kg se acidose metabólica associada</li>
            <li><strong>Refratário / grave:</strong> repetir bolus SF + vasopressor (noradrenalina EV) em UTI se choque refratário</li>
          </ul>
        </li>
        <li><strong>Adjuvantes (após epinefrina)</strong> — anti-H1:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> difenidramina 25–50 mg IV/IM ou dexclorfeniramina 5 mg IV</li>
            <li><strong>Alternativa / resistência:</strong> prometazina 25 mg IM (cautela sedação)</li>
          </ul>
          Corticoide:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> hidrocortisona 200 mg IV ou metilprednisolona 125 mg IV</li>
            <li><strong>Alternativa / resistência:</strong> dexametasona 10 mg IV</li>
          </ul>
          Broncoespasmo: salbutamol nebulização 5 mg + SF 3 mL.
        </li>
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
      <h4>Prescrições de pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>Intoxicação aguda</strong> — ABC; monitorar rebaixamento e aspiração; não induzir vômito:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> tiamina 300 mg IV/IM antes de glicose (prevenir Wernicke) + glicemia capilar</li>
            <li><strong>Alternativa / resistência:</strong> glicose EV 25 g se hipoglicemia (&lt; 60 mg/dL) após tiamina</li>
            <li><strong>Refratário / grave:</strong> intubação se rebaixamento GCS &lt; 8 ou aspiração; SF 0,9% para desidratação</li>
          </ul>
        </li>
        <li><strong>Abstinência leve-moderada</strong> — CIWA-Ar:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> diazepam 10 mg VO 6/6 h titulado ao CIWA-Ar</li>
            <li><strong>Alternativa / resistência:</strong> lorazepam 2 mg VO 6/6 h (preferível em hepatopata)</li>
            <li><strong>Refratário / grave:</strong> clonazepam 2 mg VO 12/12 h adjuvante sob supervisão</li>
          </ul>
        </li>
        <li><strong>Abstinência grave / delirium tremens</strong> — internação; monitor cardíaco:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> diazepam 10–20 mg IV q5–10 min até sedação controlada</li>
            <li><strong>Alternativa / resistência:</strong> lorazepam 2–4 mg IV q5–10 min (hepatopata)</li>
            <li><strong>Refratário / grave:</strong> fenobarbital 130–260 mg IV (cautela ventilatória) ou intubação + sedação em UTI</li>
          </ul>
        </li>
        <li><strong>Profilaxia convulsão</strong> — benzodiazepínico é primeira linha:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> diazepam ou lorazepam conforme esquema acima</li>
            <li><strong>Alternativa / resistência:</strong> fenitoína 15–20 mg/kg EV se convulsão recorrente apesar de BZD</li>
            <li><strong>Refratário / grave:</strong> fenitoína + levetiracetam 500 mg IV 12/12 h</li>
          </ul>
        </li>
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
      <h4>Prescrições de pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>ABC</strong> — avaliar instabilidade hemodinâmica; 2 acessos venosos se sangramento intenso; tipagem e reserva de hemácias se necessário.</li>
        <li><strong>β-hCG quantitativo</strong> — correlacionar com USG transvaginal (prioritário).</li>
        <li><strong>USG obstétrico</strong> — saco intrauterino, embrião com BCF, hematoma subcoriônico; <strong>excluir ectópica</strong> se β-hCG acima do limiar discriminativo sem saco IU.</li>
        <li><strong>Repouso relativo</strong> — abstinência sexual temporária; evitar AINE na gestação. Analgesia:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> dipirona 1 g VO 6/6 h ou paracetamol 750 mg VO 6/6 h</li>
            <li><strong>Alternativa / resistência:</strong> paracetamol 500 mg ou 750 mg VO 6/6 h se dipirona indisponível</li>
            <li><strong>Refratário / grave:</strong> tramadol 50 mg VO 6/6 h (apenas se dor intensa e após avaliação obstétrica; evitar no 1º trimestre)</li>
          </ul>
        </li>
        <li><strong>Progesterona</strong> — se indicado pelo obstetra:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> dydrogesterona 10 mg VO 8/8 h</li>
            <li><strong>Alternativa / resistência:</strong> progesterona micronizada 200 mg VO/VR 12/12 h ou 400 mg VO noturno</li>
            <li><strong>Refratário / grave:</strong> progesterona micronizada 400 mg VR 12/12 h + repouso absoluto + internação</li>
          </ul>
        </li>
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
      <h4>Prescrições de pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>Avaliar complicações</strong> — abscesso peritonsilar, edema de via aérea, desidratação, febre &gt; 39 °C &gt; 3 dias.</li>
        <li><strong>Teste rápido estreptocócico ou cultura de orofaringe</strong> — tratar se positivo ou alta suspeita clínica (exsudato + linfonodos + ausência de tosse).</li>
        <li><strong>Antibiótico</strong> — completar 10 dias mesmo com melhora em 48 h:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> amoxicilina 500 mg VO 8/8 h × 10 dias (adulto) ou 50 mg/kg/dia VO (máx. 1 g/dia) pediátrico</li>
            <li><strong>Alternativa / resistência:</strong> amoxicilina-clavulanato 875/125 mg VO 12/12 h × 10 dias; ou penicilina benzatina 1,2 milhões UI IM dose única (se adesão oral duvidosa)</li>
            <li><strong>Alérgico à penicilina:</strong> azitromicina 500 mg VO 1×/dia × 5 dias ou clindamicina 300 mg VO 6/6 h × 10 dias</li>
            <li><strong>Refratário / grave:</strong> ceftriaxona 1 g IV 24 h × 3–5 dias + clindamicina 600 mg IV 8/8 h se falha ou abscesso</li>
          </ul>
        </li>
        <li><strong>Sintomáticos</strong> — analgesia e suporte:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> dipirona 1 g VO 6/6 h ou paracetamol 750 mg VO 6/6 h</li>
            <li><strong>Alternativa / resistência:</strong> ibuprofeno 400 mg VO 8/8 h (adulto; cautela pediátrica) ou naproxeno 250 mg VO 12/12 h</li>
            <li><strong>Refratário / grave:</strong> tramadol 50 mg VO 6/6 h se odinofagia incapacitante; gargarejo com água morna e sal</li>
          </ul>
        </li>
        <li><strong>Abscesso peritonsilar</strong> — punção/derivação + otorrino/urgência cirúrgica:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> clindamicina 600 mg IV 8/8 h</li>
            <li><strong>Alternativa / resistência:</strong> amoxicilina-clavulanato 875/125 mg VO 12/12 h se estável após drenagem</li>
            <li><strong>Alérgico à penicilina:</strong> clindamicina 600 mg IV 8/8 h + metronidazol 500 mg IV 8/8 h</li>
            <li><strong>Refratário / grave:</strong> ceftriaxona 1 g IV 12/12 h + clindamicina 600 mg IV 8/8 h + internação</li>
          </ul>
        </li>
      </ol>
      <h4>Alta / ambulatorial</h4>
      <ul>
        <li>Completar 10 dias de ATB mesmo com melhora em 48 h (prevenir febre reumática)</li>
        <li>Retorno se trismo, voz abafada, unilateralização da dor (abscesso)</li>
      </ul>
      <p class="emerg-note">Referência: IDSA 2021 · SBP infectologia · MS. Conteúdo educacional — não substitui julgamento clínico.</p>`,

  'anemia-ferropriva': `
      <p class="muted">Anemia microcítica hipocrômica por deficiência de ferro — investigar sangramento oculto no adulto; reposição oral na maioria dos casos.</p>
      <h4>Prescrições de pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>Gravidade</strong> — Hb &lt; 7 g/dL ou instabilidade hemodinâmica:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> transfusão de concentrado de hemácias 1–2 U conforme clínica e sintomas</li>
            <li><strong>Alternativa / resistência:</strong> 1 U com reavaliação clínica e Hb pós-transfusão (evitar transfusão liberal)</li>
            <li><strong>Refratário / grave:</strong> transfusão maciça + controle de sangramento ativo (endoscopia/cirurgia); protocolo de choque hemorrágico</li>
          </ul>
        </li>
        <li><strong>Estabilização</strong> — identificar sangramento ativo (GI, ginecológico, trauma); corrigir hipovolemia com SF 0,9% 500–1000 mL IV conforme necessidade.</li>
        <li><strong>Reposição de ferro</strong> — após estabilização hemodinâmica:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> sulfato ferroso 325 mg VO 1–3×/dia (entre refeições, com vitamina C) ou ferro polimaltosado 100–200 mg Fe elementar/dia VO</li>
            <li><strong>Alternativa / resistência:</strong> sulfato ferroso VO em dias alternados se intolerância GI leve; ferro aminoquelado 100 mg Fe elementar/dia VO</li>
            <li><strong>Refratário / grave:</strong> ferro carboximaltose 500–1000 mg EV dose única ou sacarose de hidróxido férrico 200–500 mg EV (intolerância oral grave, má absorção, doença inflamatória intestinal)</li>
          </ul>
        </li>
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
      <h4>Prescrições de pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>ABC e oxigênio</strong> — SpO₂ alvo ≥ 95%; acesso venoso.</li>
        <li><strong>Analgesia imediata</strong> — iniciar precocemente:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> dipirona 1 g IV 6/6 h + paracetamol 750 mg VO/IV 6/6 h</li>
            <li><strong>Alternativa / resistência:</strong> cetoprofeno 100 mg IV 8/8 h ou naproxeno 500 mg VO 12/12 h (cautela renal; evitar em asma grave)</li>
            <li><strong>Refratário / grave:</strong> morfina 0,1 mg/kg IV (titular 2–5 mg q10–15 min) ou tramadol 50–100 mg IV 6/6 h → PCA se dor persistente</li>
          </ul>
        </li>
        <li><strong>Hidratação</strong> — evitar hiperhidratação (edema pulmonar):
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> SF 0,9% manutenção 1–1,5× necessidade basal + correção de déficit</li>
            <li><strong>Alternativa / resistência:</strong> SF 0,45% se hipernatremia</li>
            <li><strong>Refratário / grave:</strong> monitorar balanço hídrico rigoroso; reduzir volume se edema pulmonar</li>
          </ul>
        </li>
        <li><strong>Investigar complicações</strong> — Rx tórax (síndrome torácica aguda); hemograma (queda abrupta de Hb → sequestro esplênico); TC crânio se déficit neurológico.</li>
        <li><strong>Síndrome torácica aguda</strong> — O₂ + ATB + transfusão:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> ceftriaxona 1 g IV 24 h + azitromicina 500 mg IV 24 h</li>
            <li><strong>Alternativa / resistência:</strong> piperacilina-tazobactam 4,5 g IV 6/6 h se sepse</li>
            <li><strong>Alérgico à penicilina:</strong> ciprofloxacino 400 mg IV 12/12 h + azitromicina 500 mg IV 24 h</li>
            <li><strong>Refratário / grave:</strong> transfusão exchange (meta HbS &lt; 30%) + internação UTI</li>
          </ul>
        </li>
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
      <h4>Prescrições de pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>Triagem orgânica</strong> — ECG, glicemia capilar, SpO₂, PA; história de início súbito com palpitação, dispneia, parestesia, medo de morte.</li>
        <li><strong>Ambiente calmo</strong> — verbalização tranquilizadora; evitar excesso de exames se baixa suspeita orgânica e exame normal.</li>
        <li><strong>Farmacológico se intenso</strong> — após exclusão orgânica:
          <ul class="ps-med-options">
            <li><strong>Gestante:</strong> hidroxizina 25–50 mg VO 6/6 h (evitar benzodiazepínico)</li>
            <li><strong>1ª linha:</strong> diazepam 5–10 mg VO/SL ou lorazepam 1–2 mg VO/SL (cautela idoso, dependência)</li>
            <li><strong>Alternativa / resistência:</strong> hidroxizina 25–50 mg VO 6/6 h (menor potencial de dependência)</li>
            <li><strong>Refratário / grave:</strong> alprazolam 0,25–0,5 mg VO (dose única, cautela) + encaminhamento psiquiatria urgente se ideação suicida</li>
          </ul>
        </li>
        <li><strong>Sintomas físicos</strong> — salbutamol <strong>não</strong> indicado sem broncoespasmo; tratar cefaleia/tremor com sintomáticos.</li>
        <li><strong>Internação rara</strong> — ideação suicida, síndrome serotoninérgica, abstinência de álcool/BZD não diagnosticada.</li>
      </ol>
      <h4>Alta / ambulatorial</h4>
      <ul>
        <li>Orientar natureza benigna do pânico após exclusão de gravidade</li>
        <li>Encaminhar psiquiatria/psicologia. Profilaxia ISRS:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> sertralina 25–50 mg VO/dia (titular até 100–200 mg)</li>
            <li><strong>Alternativa / resistência:</strong> escitalopram 10 mg VO/dia (titular até 20 mg)</li>
            <li><strong>Refratário / grave:</strong> venlafaxina 37,5 mg VO 12/12 h (titular gradual) sob acompanhamento psiquiátrico</li>
          </ul>
        </li>
        <li>Técnicas de respiração; evitar benzodiazepínico crônico</li>
      </ul>
      <p class="emerg-note">Referência: APA 2023 · CFM. Conteúdo educacional — não substitui julgamento clínico.</p>`,

  'antiparasitarios': `
      <p class="muted">Terapia e profilaxia de helmintíases comuns no Brasil — escolher fármaco conforme parasita e idade; verificar gravidez e interações.</p>
      <h4>Prescrições de pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>Ascaridíase/enterobíase/ankilostomíase</strong>:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> albendazol 400 mg VO dose única (adulto e &gt; 2 anos)</li>
            <li><strong>Alternativa / resistência:</strong> mebendazol 100 mg VO 12/12 h × 3 dias</li>
            <li><strong>Refratário / grave:</strong> repetir albendazol em 2 semanas; enterobíase: tratar contactantes domiciliares</li>
          </ul>
        </li>
        <li><strong>Estrongiloidíase</strong>:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> ivermectina 200 µg/kg/dia VO × 2 dias</li>
            <li><strong>Alternativa / resistência:</strong> albendazol 400 mg VO 12/12 h × 7 dias (menor eficácia; usar se ivermectina contraindicada)</li>
            <li><strong>Refratário / grave:</strong> ivermectina prolongada 200 µg/kg/dia × 7–14 dias se imunossuprimido; internação</li>
          </ul>
        </li>
        <li><strong>Teníase</strong>:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> praziquantel 5–10 mg/kg VO dose única</li>
            <li><strong>Alternativa / resistência:</strong> niclosamida 2 g VO (mastigar) dose única</li>
          </ul>
        </li>
        <li><strong>Giardíase</strong>:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> metronidazol 250 mg VO 8/8 h × 5 dias</li>
            <li><strong>Alternativa / resistência:</strong> secnidazol 2 g VO dose única ou tinidazol 2 g VO dose única</li>
            <li><strong>Refratário / grave:</strong> metronidazol 500 mg VO 8/8 h × 7 dias se falha clínica</li>
          </ul>
        </li>
        <li><strong>Complicações</strong> — obstrução biliar por Ascaris:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> albendazol 400 mg VO + CPRE/endoscopia para extração</li>
            <li><strong>Alternativa / resistência:</strong> mebendazol 100 mg VO 12/12 h × 3 dias</li>
            <li><strong>Refratário / grave:</strong> cirurgia + ATB (ceftriaxona + metronidazol) se colangite</li>
          </ul>
          Hiperinfestação strongyloides: internação + ivermectina 200 µg/kg/dia × 7–14 dias.
        </li>
      </ol>
      <h4>Alta / ambulatorial</h4>
      <ul>
        <li>Tratar contactantes domiciliares em enterobíase (albendazol dose única, repetir em 2 semanas)</li>
        <li>Higiene: lavar mãos, tratar água e esgoto, cortar unhas</li>
      </ul>
      <p class="emerg-note">Referência: MS/PCDT parasitoses · OMS. Gestantes: preferir mebendazol após 1º trimestre; evitar ivermectina. Conteúdo educacional — não substitui julgamento clínico.</p>`,

  'arritmias': `
      <p class="muted">Taquiarritmias e bradiarritmias instáveis — priorizar cardioversão/estimulação se instabilidade; estável → manobra vagal, fármaco ou anticoagulação conforme ritmo.</p>
      <h4>Prescrições de pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>Instabilidade (hipotensão, dor torácica, dispneia, rebaixamento)</strong> — cardioversão elétrica sincronizada imediata (ver cardioversao-eletrica). Sedação:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> etomidato 0,1–0,2 mg/kg IV ou propofol 0,5–1 mg/kg IV se tempo permitir</li>
            <li><strong>Alternativa / resistência:</strong> midazolam 0,05 mg/kg IV + fentanil 1 µg/kg</li>
            <li><strong>Refratário / grave:</strong> cardioversão sem sedação se instabilidade extrema (arritmia com pulso)</li>
          </ul>
        </li>
        <li><strong>TSV estável</strong> — manobra de Valsalva primeiro:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> adenosina 6 mg IV rápido → 12 mg se necessário (2ª dose)</li>
            <li><strong>Alternativa / resistência:</strong> verapamil 5–10 mg IV lento (evitar em WPW com FA) ou metoprolol 5 mg IV</li>
            <li><strong>Refratário / grave:</strong> cardioversão elétrica sincronizada 50–100 J se instabilidade</li>
          </ul>
        </li>
        <li><strong>FA/flutter com RVR estável</strong> — controle de frequência:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> metoprolol 5 mg IV q5 min (máx. 15 mg) ou diltiazem 0,25 mg/kg IV</li>
            <li><strong>Alternativa / resistência:</strong> amiodarona 300 mg IV em 1 h (controle de ritmo + frequência)</li>
            <li><strong>Refratário / grave:</strong> cardioversão elétrica sincronizada 120–200 J; anticoagulação conforme CHA₂DS₂-VASc e tempo de início</li>
          </ul>
        </li>
        <li><strong>Bradicardia sintomática</strong>:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> atropina 1 mg IV (repetir até 3 mg)</li>
            <li><strong>Alternativa / resistência:</strong> dopamina 5–20 µg/kg/min ou adrenalina 2–10 µg/min</li>
            <li><strong>Refratário / grave:</strong> marcapasso transcutâneo/transvenoso de urgência</li>
          </ul>
        </li>
        <li><strong>TV com pulso estável</strong> — <em>procainamida não comercializada no Brasil</em>:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> amiodarona 150 mg IV em 10 min → infusão 1 mg/min × 6 h</li>
            <li><strong>Alternativa / resistência:</strong> lidocaína 1–1,5 mg/kg IV bolus (máx. 100 mg) → infusão 1–4 mg/min</li>
            <li><strong>Refratário / grave:</strong> cardioversão elétrica sincronizada 100 J → escalar; sulfato de magnésio 2 g IV se torsades</li>
          </ul>
        </li>
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
      <h4>Prescrições de pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>Sinais de alarme</strong> — febre, articulação quente/eritematosa monoarticular (artrocentese para excluir séptica), trauma com deformidade, déficit neurovascular.</li>
        <li><strong>Analgesia</strong> — escalonada:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> dipirona 500 mg ou 1 g IV/VO 6/6 h ou paracetamol 500 mg ou 750 mg VO 6/6 h</li>
            <li><strong>Alternativa / resistência:</strong> cetoprofeno 100 mg IV/VO 8/8 h ou naproxeno 500 mg VO 12/12 h ou ibuprofeno 400 mg VO 8/8 h (cautela GI/renal)</li>
            <li><strong>Refratário / grave:</strong> tramadol 50–100 mg VO/IV 6/6 h; codeína 30 mg VO 6/6 h se disponível e sem contraindicação</li>
          </ul>
        </li>
        <li><strong>Articular aguda</strong> — repouso, gelo 20 min 3–4×/dia, elevação; tornozeleira/tipoia conforme local.</li>
        <li><strong>Artrite séptica suspeita</strong> — artrocentese urgente antes de ATB:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> oxacilina 2 g IV 4/4 h ou cefazolina 2 g IV 8/8 h</li>
            <li><strong>Alternativa / resistência:</strong> ceftriaxona 1 g IV 12/12 h + vancomicina 15 mg/kg IV 12/12 h se MRSA de risco</li>
            <li><strong>Alérgico à penicilina:</strong> vancomicina 15 mg/kg IV 12/12 h + ciprofloxacino 400 mg IV 12/12 h</li>
            <li><strong>Refratário / grave:</strong> piperacilina-tazobactam 4,5 g IV 6/6 h + vancomicina; drenagem cirúrgica</li>
          </ul>
        </li>
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
      <h4>Prescrições de pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>Forma não complicada</strong>:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> albendazol 400 mg VO dose única (adulto e &gt; 2 anos)</li>
            <li><strong>Alternativa / resistência:</strong> mebendazol 100 mg VO 12/12 h × 3 dias</li>
            <li><strong>Refratário / grave:</strong> repetir albendazol em 2–4 semanas em hiperinfestação</li>
          </ul>
        </li>
        <li><strong>Obstrução intestinal</strong> — jejum, SNG, hidratação IV:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> medidas conservadoras 48 h + albendazol 400 mg VO após estabilização</li>
            <li><strong>Alternativa / resistência:</strong> óleo mineral VO (cautela aspiração) ou enema glicerinado em crianças</li>
            <li><strong>Refratário / grave:</strong> cirurgia se perfuração, peritonite ou falha clínica 48 h</li>
          </ul>
        </li>
        <li><strong>Síndrome de Loeffler</strong> (migração larvária) — sintomáticos:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> dipirona ou paracetamol + broncodilatador se broncoespasmo (salbutamol 2 puffs 6/6 h)</li>
            <li><strong>Alternativa / resistência:</strong> prednisona 40 mg VO × 5 dias se eosinofilia pulmonar sintomática</li>
            <li><strong>Refratário / grave:</strong> albendazol 400 mg VO após fase aguda (eosinofilia em queda)</li>
          </ul>
        </li>
        <li><strong>Colangite/pancreatite por Ascaris</strong>:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> albendazol 400 mg VO + avaliação cirúrgica/endoscópica (CPRE) para extração</li>
            <li><strong>Alternativa / resistência:</strong> mebendazol 100 mg VO 12/12 h × 3 dias se albendazol indisponível</li>
            <li><strong>Refratário / grave:</strong> CPRE urgente + ATB (ceftriaxona 1 g IV + metronidazol 500 mg IV) se colangite</li>
          </ul>
        </li>
      </ol>
      <h4>Alta / ambulatorial</h4>
      <ul>
        <li>Repetir dose em 2–4 semanas em hiperinfestação</li>
        <li>Medidas de saneamento e higiene das mãos</li>
      </ul>
      <p class="emerg-note">Referência: MS/PCDT parasitoses intestinais · OMS. Conteúdo educacional — não substitui julgamento clínico.</p>`,

  'asma-broncoespasmo': `
      <p class="muted">Crise asmática ou broncoespasmo agudo — broncodilatador inalatório repetido + corticoide sistêmico precoce; sulfato de magnésio se crise grave refratária.</p>
      <h4>Prescrições de pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>Classificar gravidade</strong> — fala entrecortada, SpO₂ &lt; 90%, PEF &lt; 50%, silêncio auscultatório = grave.</li>
        <li><strong>O₂</strong> — alvo SpO₂ 94–98%; monitorizar.</li>
        <li><strong>Broncodilatador</strong> — repetir a cada 20 min × 3 ciclos:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> salbutamol (Aerolin®) 4–8 puffs MDI ou nebulização 5 mg + 3 mL SF</li>
            <li><strong>Alternativa / resistência:</strong> salbutamol + brometo de ipratrópio 0,5 mg nebulização (crise moderada-grave)</li>
            <li><strong>Refratário / grave:</strong> sulfato de magnésio 2 g IV em 20 min; adrenalina SC 0,3–0,5 mg se iminência de parada; IOT se fadiga/hipoxemia refratária</li>
          </ul>
        </li>
        <li><strong>Corticoide sistêmico precoce</strong>:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> prednisona 40–60 mg VO ou metilprednisolona 60–125 mg IV</li>
            <li><strong>Alternativa / resistência:</strong> hidrocortisona 200 mg IV se choque associado</li>
            <li><strong>Refratário / grave:</strong> manter prednisona 40 mg/dia × 5 dias na alta; considerar internação</li>
          </ul>
        </li>
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
      <h4>Prescrições de pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>Excluir urgência</strong> — parafimose (redução manual urgente), gangrena de Fournier (dor desproporcional, crepitação, sepse).</li>
        <li><strong>Higiene local</strong> — banho com água morna, evitar sabonetes irritantes; secar bem.</li>
        <li><strong>Candidíase</strong>:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> clotrimazol creme 1% 2×/dia × 7–14 dias</li>
            <li><strong>Alternativa / resistência:</strong> fluconazol 150 mg VO dose única (sistêmico adjuvante)</li>
            <li><strong>Refratário / grave:</strong> fluconazol 150 mg VO repetir em 72 h + clotrimazol tópico; investigar diabetes/HIV</li>
          </ul>
        </li>
        <li><strong>Bacteriana leve</strong>:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> mupirocina pomada 2×/dia × 7 dias</li>
            <li><strong>Alternativa / resistência:</strong> cefalexina 500 mg VO 6/6 h × 7 dias se celulite leve</li>
            <li><strong>Alérgico à penicilina:</strong> clindamicina 300 mg VO 6/6 h × 7 dias</li>
            <li><strong>Refratário / grave:</strong> cefalexina 1 g VO 6/6 h ou clindamicina 600 mg IV 8/8 h se celulite extensa</li>
          </ul>
        </li>
        <li><strong>Parafimose</strong> — redução manual urgente:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> lidocaína gel 2% tópica + compressão manual da glande + redução do prepúcio</li>
            <li><strong>Alternativa / resistência:</strong> dipirona 1 g IV/IM ou paracetamol 750 mg VO para analgesia pré-redução</li>
            <li><strong>Refratário / grave:</strong> urologia para incisão dorsal se falha de redução ou isquemia da glande</li>
          </ul>
        </li>
      </ol>
      <h4>Alta / ambulatorial</h4>
      <ul>
        <li>Evitar relações até resolução se DST suspeita — coletar sorologias/PCR conforme risco</li>
        <li>Circuncisão eletiva se balanite de repetição ou fimose sintomática</li>
      </ul>
      <p class="emerg-note">Referência: MS/IST · SBD urologia. Conteúdo educacional — não substitui julgamento clínico.</p>`,

  'bronquite-aguda': `
      <p class="muted">Inflamação traqueobrônquica aguda, geralmente viral — suporte, broncodilatador se hiper-reatividade e ATB só se suspeita bacteriana (ex.: pertussis, COPD).</p>
      <h4>Prescrições de pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>Excluir pneumonia/asma</strong> — Rx tórax se febre alta, taquipneia, crepitações localizadas, SpO₂ baixa.</li>
        <li><strong>Sintomáticos</strong> — analgesia e suporte:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> dipirona 1 g VO 6/6 h ou paracetamol 750 mg VO 6/6 h</li>
            <li><strong>Alternativa / resistência:</strong> ibuprofeno 400 mg VO 8/8 h (adulto; cautela pediátrica)</li>
            <li><strong>Refratário / grave:</strong> tramadol 50 mg VO 6/6 h se tosse/dor incapacitante; hidratação EV se desidratação</li>
          </ul>
          Evitar antitussígeno opioide de rotina.
        </li>
        <li><strong>Broncoespasmo associado</strong>:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> salbutamol 2–4 puffs 4/4–6/6 h ou nebulização 5 mg</li>
            <li><strong>Alternativa / resistência:</strong> salbutamol + ipratrópio 0,5 mg nebulização</li>
            <li><strong>Refratário / grave:</strong> prednisona 40 mg VO × 5 dias se sibilância persistente</li>
          </ul>
        </li>
        <li><strong>Coqueluche suspeita</strong>:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> azitromicina 500 mg VO 1×/dia × 5 dias</li>
            <li><strong>Alternativa / resistência:</strong> claritromicina 500 mg VO 12/12 h × 7 dias</li>
            <li><strong>Alérgico à penicilina:</strong> azitromicina (macrolídeo de escolha)</li>
            <li><strong>Refratário / grave:</strong> internação + azitromicina EV; profilaxia de contactantes com azitromicina 500 mg VO dose única</li>
          </ul>
        </li>
        <li><strong>DPOC exacerbada</strong> — ver protocolo DPOC:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> salbutamol nebulização 5 mg + ipratrópio 0,5 mg + prednisona 40 mg VO × 5 dias</li>
            <li><strong>Alternativa / resistência:</strong> amoxicilina-clavulanato 875/125 mg VO 12/12 h × 7 dias se purulência</li>
            <li><strong>Alérgico à penicilina:</strong> azitromicina 500 mg VO 1×/dia × 5 dias + moxifloxacino 400 mg VO/dia</li>
            <li><strong>Refratário / grave:</strong> internação + ceftriaxona 1 g IV + azitromicina 500 mg IV; O₂ titulado (SpO₂ 88–92%)</li>
          </ul>
        </li>
      </ol>
      <h4>Alta / ambulatorial</h4>
      <ul>
        <li>Resolução em 7–10 dias; repouso relativo</li>
        <li>Retorno se febre &gt; 3 dias, dispneia progressiva, hemoptise</li>
      </ul>
      <p class="emerg-note">Referência: MS/RENAME · SBPT. Conteúdo educacional — não substitui julgamento clínico.</p>`,

  'candidiase': `
      <p class="muted">Infecção por <em>Candida</em> (oral, vaginal, cutânea/balanite) — antifúngico tópico ou sistêmico conforme extensão e imunidade.</p>
      <h4>Prescrições de pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>Candidíase oral leve</strong>:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> nistatina suspensão 100.000 UI/mL, 4–6 mL gargarejo 4×/dia × 7–14 dias</li>
            <li><strong>Alternativa / resistência:</strong> miconazol gel oral 2×/dia × 7–14 dias</li>
            <li><strong>Refratário / grave:</strong> fluconazol 100–200 mg VO 1×/dia × 7–14 dias se oral refratária ou imunossuprimido</li>
          </ul>
        </li>
        <li><strong>Vaginal não complicada</strong>:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> fluconazol 150 mg VO dose única</li>
            <li><strong>Alternativa / resistência:</strong> clotrimazol óvulo 500 mg VO noturno × 1–3 noites ou miconazol creme vaginal 2% 7 dias</li>
            <li><strong>Refratário / grave:</strong> fluconazol 150 mg VO repetir em 72 h; investigar diabetes/gestação</li>
          </ul>
        </li>
        <li><strong>Balanite candidíase</strong>:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> clotrimazol creme 1% 2×/dia × 7–14 dias</li>
            <li><strong>Alternativa / resistência:</strong> fluconazol 150 mg VO dose única (sistêmico adjuvante)</li>
            <li><strong>Refratário / grave:</strong> fluconazol 150 mg VO repetir em 72 h + clotrimazol tópico</li>
          </ul>
        </li>
        <li><strong>Imunossuprimido / esofágica</strong>:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> fluconazol 200 mg VO 1×/dia × 14–21 dias</li>
            <li><strong>Alternativa / resistência:</strong> anfotericina B desoxicolato 0,5–0,7 mg/kg/dia EV (esofágica grave)</li>
            <li><strong>Refratário / grave:</strong> internação; candidemia → anidulafungina 200 mg EV dose de ataque → 100 mg/dia ou micafungina 100 mg EV/dia</li>
          </ul>
        </li>
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
      <h4>Prescrições de pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>Indicação imediata</strong> — FA/flutter/TSV/TV com instabilidade (PAS &lt; 90, dor isquêmica, edema agudo de pulmão, rebaixamento).</li>
        <li><strong>Preparo</strong> — O₂, monitor, acesso IV, aspirador; <strong>sincronizar</strong> no QRS (botão SYNC); anticoagulação se FA &gt; 48 h ou tempo desconhecido (ou eco TE previamente).</li>
        <li><strong>Sedação/analgesia</strong>:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> etomidato 0,1–0,2 mg/kg IV ou propofol 0,5–1 mg/kg IV</li>
            <li><strong>Alternativa / resistência:</strong> midazolam 0,05 mg/kg IV + fentanil 1 µg/kg adjuvante</li>
            <li><strong>Refratário / grave:</strong> quetamina 1–2 mg/kg IV se instabilidade hemodinâmica (cautela cardíaca)</li>
          </ul>
        </li>
        <li><strong>Cargas (bifásico)</strong> — FA: 120–200 J → escalar; flutter/TSV: 50–100 J; TV com pulso: 100 J → 150 → 200 J.</li>
        <li><strong>Pós-cardioversão</strong> — ECG, PA, oximetria. Antiarrítmico se recorrência:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> amiodarona 150 mg IV em 10 min se recorrência de FA/TV</li>
            <li><strong>Alternativa / resistência:</strong> metoprolol 5 mg IV (controle de frequência em FA)</li>
            <li><strong>Refratário / grave:</strong> nova cardioversão + amiodarona infusão; anticoagulação contínua conforme CHA₂DS₂-VASc</li>
          </ul>
        </li>
        <li><strong>Não sincronizar</strong> em FV/TV sem pulso — desfibrilação de emergência (ACLS).</li>
      </ol>
      <h4>Exames / investigação</h4>
      <ul>
        <li>Eletrólitos, Mg²⁺ · digoxinemia se uso · eco se FA eletiva sem anticoagulação adequada</li>
      </ul>
      <p class="emerg-note">Referência: AHA/ACC/HRS 2023 · SBC. Conteúdo educacional — não substitui julgamento clínico.</p>`,

  'cefaleias': `
      <p class="muted">Cefaleia aguda — distinguir tensional, enxaqueca e cefaleia em salvas; excluir subaracnoideia, meningite e cefaleia secundária de alarme.</p>
      <h4>Prescrições de pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>Sinais de alarme (SNOOP4)</strong> — início súbito (“pior da vida”), febre, rigidez de nuca, déficit focal, papiledema, gestação/puerpério, imunossupressão, trauma → TC crânio ± punção lombar.</li>
        <li><strong>Cefaleia tensional</strong> — analgesia:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> dipirona 500 mg ou 1 g VO 6/6 h · paracetamol 500 mg ou 750 mg VO 6/6 h</li>
            <li><strong>Alternativa / resistência:</strong> naproxeno 500 mg VO 12/12 h · ibuprofeno 400 mg VO 8/8 h · diclofenaco potássico 50 mg VO 8/8 h · cetoprofeno 50–100 mg VO · nimesulida 100 mg VO 12/12 h + ciclobenzaprina 5–10 mg VO se componente cervical</li>
            <li><strong>Refratário / grave:</strong> tramadol 50 mg VO 6/6 h; relaxante muscular por 3–5 dias</li>
          </ul>
        </li>
        <li><strong>Enxaqueca moderada-grave</strong> — evitar triptano se DAC, AVC prévio, PA não controlada:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> sumatriptano 50–100 mg VO (máx. 200 mg/dia) ou 6 mg SC + metoclopramida 10 mg IV + dipirona 1 g</li>
            <li><strong>Alternativa / resistência:</strong> zolmitriptano 2,5 mg VO ou 5 mg nasal · paracetamol 500 mg ou 750 mg VO · naproxeno 500 mg VO</li>
            <li><strong>Refratário / grave:</strong> metoclopramida 10 mg IV + dipirona 1 g IV + hidratação SF; dexametasona 10 mg IV (prevenir recorrência 48 h)</li>
          </ul>
        </li>
        <li><strong>Cefaleia em salvas</strong>:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> O₂ 100% 12–15 L/min por máscara não reinalante × 15–20 min</li>
            <li><strong>Alternativa / resistência:</strong> sumatriptano 6 mg SC ou zolmitriptano 5 mg nasal</li>
            <li><strong>Refratário / grave:</strong> sumatriptano SC repetir após 1 h (máx. 12 mg/24 h); verapamil 80 mg VO 8/8 h para profilaxia ambulatorial</li>
          </ul>
        </li>
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
      <h4>Prescrições de pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>Excluir urgência</strong> — fascite necrotizante (dor desproporcional, crepitação, bolhas, sepse) → cirurgia + ATB:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> piperacilina-tazobactam 4,5 g IV 6/6 h + clindamicina 600 mg IV 8/8 h</li>
            <li><strong>Alternativa / resistência:</strong> meropenem 1 g IV 8/8 h + clindamicina 600 mg IV 8/8 h</li>
            <li><strong>Alérgico à penicilina:</strong> vancomicina 15 mg/kg IV 12/12 h + ciprofloxacino 400 mg IV 12/12 h + clindamicina 600 mg IV 8/8 h</li>
            <li><strong>Refratário / grave:</strong> desbridamento cirúrgico urgente + UTI + vasopressor se choque</li>
          </ul>
        </li>
        <li><strong>Celulite leve-moderada (ambulatorial possível)</strong>:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> cefalexina 500 mg VO 6/6 h × 7–10 dias</li>
            <li><strong>Alternativa / resistência:</strong> amoxicilina-clavulanato 875/125 mg VO 12/12 h × 7–10 dias</li>
            <li><strong>Alérgico à penicilina:</strong> clindamicina 300 mg VO 6/6 h × 7–10 dias ou azitromicina 500 mg VO 1×/dia × 5 dias</li>
            <li><strong>Refratário / grave:</strong> internação + ceftriaxona 1 g IV 12/12 h</li>
          </ul>
        </li>
        <li><strong>Celulite moderada-grave / sistêmica</strong>:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> oxacilina 2 g IV 4/4 h ou cefazolina 2 g IV 8/8 h</li>
            <li><strong>Alternativa / resistência:</strong> ceftriaxona 1 g IV 12/12 h + vancomicina 15 mg/kg IV 12/12 h se MRSA de risco (diabetes, úlcera crônica)</li>
            <li><strong>Alérgico à penicilina:</strong> vancomicina 15 mg/kg IV 12/12 h + ciprofloxacino 400 mg IV 12/12 h</li>
            <li><strong>Refratário / grave:</strong> piperacilina-tazobactam 4,5 g IV 6/6 h + vancomicina; drenagem se abscesso</li>
          </ul>
        </li>
        <li><strong>Elevar membro</strong> — marcar bordas com caneta para monitorar progressão. Analgesia:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> dipirona 1 g VO/IV 6/6 h ou paracetamol 750 mg VO 6/6 h</li>
            <li><strong>Alternativa / resistência:</strong> ibuprofeno 400 mg VO 8/8 h ou naproxeno 500 mg VO 12/12 h</li>
            <li><strong>Refratário / grave:</strong> tramadol 50 mg VO 6/6 h se dor intensa</li>
          </ul>
        </li>
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
      <h4>Prescrições de pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>ABC</strong> — 2 acessos venosos; monitor; glicemia, gasometria, Na⁺, K⁺, creatinina, β-hidroxibutirato.</li>
        <li><strong>Fluidos 1ª hora</strong> — reidratação:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> SF 0,9% 15–20 mL/kg IV (≈ 1–1,5 L adulto) se hipovolemia</li>
            <li><strong>Alternativa / resistência:</strong> SF 0,45% se hipernatremia (Na⁺ &gt; 145 mEq/L)</li>
            <li><strong>Refratário / grave:</strong> SF 0,9% contínuo + vasopressor se choque; monitorar lactato</li>
          </ul>
        </li>
        <li><strong>Potássio antes/durante insulina</strong> — K⁺ &lt; 3,3 mEq/L: repor 20–40 mEq/h e <strong>adiar insulina</strong>; K⁺ 3,3–5,2: insulina + 20–30 mEq KCl por litro de fluido; K⁺ &gt; 5,2: aguardar e monitorar.</li>
        <li><strong>Insulina regular EV</strong>:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> 0,1 U/kg/h em BIC (bolus 0,1 U/kg opcional); meta queda glicemia 50–70 mg/dL/h</li>
            <li><strong>Alternativa / resistência:</strong> 0,14 U/kg/h em BIC se resposta inadequada após 2 h</li>
            <li><strong>Refratário / grave:</strong> dobrar taxa de infusão; investigar infecção/infarto como precipitante</li>
          </ul>
        </li>
        <li><strong>Glicemia &lt; 200–250 mg/dL</strong> — adicionar SG 5–10% ao fluido e manter insulina até pH &gt; 7,3 e cetonas negativas/traço.</li>
        <li><strong>Bicarbonato</strong> — <strong>não rotineiro</strong>; considerar só se pH &lt; 6,9 com instabilidade hemodinâmica:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> bicarbonato de sódio 50 mEq em 200 mL SF IV em 1 h</li>
            <li><strong>Alternativa / resistência:</strong> repetir conforme gasometria seriada (cautela hipocalemia)</li>
            <li><strong>Refratário / grave:</strong> hemodiálise se acidose refratária com injúria renal aguda</li>
          </ul>
        </li>
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
      <h4>Prescrições de pronto-socorro</h4>
      <ol class="emerg-steps">
        <li><strong>Sinais de alarme</strong> — anestesia em sela, retenção urinária/incontinência (cauda equina → RM urgente + neurocirurgia), febre, trauma de alta energia, câncer prévio, uso crônico de corticoide.</li>
        <li><strong>Analgesia</strong> — escalonada:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> dipirona 500 mg ou 1 g IV/VO 6/6 h ou paracetamol 500 mg ou 750 mg VO 6/6 h + ciclobenzaprina 5–10 mg VO 8/8 h (espasmo)</li>
            <li><strong>Alternativa / resistência:</strong> naproxeno 500 mg VO 12/12 h ou ibuprofeno 400 mg VO 8/8 h por 5–7 dias (cautela GI/renal)</li>
            <li><strong>Refratário / grave:</strong> tramadol 50–100 mg VO 6/6 h; codeína 30 mg VO 6/6 h se disponível</li>
          </ul>
        </li>
        <li><strong>Radiculopatia sem déficit motor</strong> — manter mobilidade relativa; evitar repouso absoluto prolongado:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> AINE (naproxeno ou ibuprofeno) 5–7 dias + analgesia acima</li>
            <li><strong>Alternativa / resistência:</strong> pregabalina 75 mg VO 12/12 h se neuropatia persistente</li>
            <li><strong>Refratário / grave:</strong> RM lombar ambulatorial; considerar infiltração/epidural conforme especialista</li>
          </ul>
        </li>
        <li><strong>Déficit motor progressivo ou cauda equina</strong> — RM lombar urgente + neurocirurgia:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> dexametasona 10 mg IV se compressão tumoral/edema (neurocirurgia)</li>
            <li><strong>Alternativa / resistência:</strong> metilprednisolona 40 mg IV 12/12 h se contraindicação a dexametasona</li>
            <li><strong>Refratário / grave:</strong> descompressão cirúrgica de urgência (&lt; 48 h para cauda equina)</li>
          </ul>
        </li>
        <li><strong>Torcicolo/cervicalgia</strong> — Rx cervical se trauma; excluir meningismo:
          <ul class="ps-med-options">
            <li><strong>1ª linha:</strong> dipirona 1 g VO 6/6 h ou paracetamol 750 mg VO 6/6 h + calor local</li>
            <li><strong>Alternativa / resistência:</strong> ciclobenzaprina 5 mg VO 8/8 h + naproxeno 500 mg VO 12/12 h</li>
            <li><strong>Refratário / grave:</strong> tramadol 50 mg VO 6/6 h; colar cervical se trauma até exclusão de lesão</li>
          </ul>
        </li>
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
