/* Pronto Socorro — conteúdo clínico (lote 4) */
const PS_CONTENT_4 = {
  'pneumonia-comunitaria': `
    <p class="muted">Infecção aguda do parênquima pulmonar adquirida fora do hospital. Estratificar gravidade com <strong>CURB-65</strong> (confusão, ureia &gt; 50 mg/dl, FR ≥ 30, PAS &lt; 90 ou PAD ≤ 60, idade ≥ 65) e definir ambiente de tratamento.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>ABC</strong> — SpO₂, FR, PA; O₂ suplementar se SpO₂ &lt; 92% (alvo 94–98%).</li>
      <li><strong>CURB-65</strong> — 0–1: ambulatorial; 2: considerar internação; ≥ 3: internação/UCI.</li>
      <li><strong>Exames</strong> — Rx tórax, hemograma, ureia/creatinina, eletrólitos; hemocultura e cultura de escarro se grave.</li>
      <li><strong>Ambulatorial (CURB 0–1, sem comorbidades graves)</strong> — <strong>amoxicilina + clavulanato</strong> 875/125 mg VO 12/12h por 5–7 dias (Clavulin, Sinot).</li>
      <li><strong>Internação (enfermaria)</strong> — <strong>ceftriaxona</strong> 1 g EV 24/24h + <strong>macrolídeo</strong>: azitromicina 500 mg EV/VO 24/24h ou claritromicina 500 mg 12/12h (cobertura de <em>atípicos</em>).</li>
      <li><strong>Grave/UCI</strong> — ceftriaxona + macrolídeo; considerar piperacilina-tazobactam ou carbapenêmico conforme risco de Pseudomonas/MRSA e protocolo local.</li>
      <li><strong>Suporte</strong> — hidratação, antitérmico (dipirona/paracetamol), fisioterapia respiratória se necessário.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Reavaliação em 48–72 h se sem melhora clínica ou piora de dispneia/febre.</li>
      <li>Vacinação pneumocócica e influenza após recuperação.</li>
      <li>Evitar tabagismo; orientar sinais de alarme (dispneia, confusão, hipotensão).</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Rx tórax PA (e perfil se dúvida); repetir se não melhora em 48–72 h.</li>
      <li>Procalcitonina opcional para guiar duração de ATB em casos selecionados.</li>
      <li>Investigar comorbidades: DPOC, ICC, DM, imunossupressão.</li>
    </ul>
    <p class="emerg-note">Referência: SBPT/MS — pneumonia adquirida na comunidade. CURB-65 disponível em Calculadoras essenciais. Conduta não substitui julgamento clínico individualizado.</p>`,

  'trauma-atls': `
    <p class="muted">Abordagem sistemática do trauma politraumatizado conforme <strong>ATLS</strong> — tratar ameaças à vida na ordem de prioridade antes de investigações definitivas.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>A — Via aérea + coluna cervical</strong> — proteção cervical; aspirar secreções; intubação se GCS ≤ 8, obstrução ou insuficiência respiratória.</li>
      <li><strong>B — Respiração</strong> — inspecionar tórax (equimoses, MV abolido, crepitação); O₂ 15 L/min; drenagem de pneumotórax hipertensivo imediata (2º EIC linha hemiclavicular).</li>
      <li><strong>C — Circulação</strong> — controlar hemorragia externa (compressão/ torniquete); 2 acessos calibrosos; <strong>SF 0,9% 1–2 L</strong> bolus se hipotensão/ taquicardia; protocolo de transfusão maciça se choque hemorrágico.</li>
      <li><strong>D — Disfunção neurológica</strong> — GCS, pupilas; glicemia capilar; analgesia (dipirona, cetamina em choque).</li>
      <li><strong>E — Exposição</strong> — desvestir, prevenir hipotermia (cobertores, fluidos aquecidos); buscar lesões ocultas.</li>
      <li><strong>Imagem</strong> — FAST à beira-leito se instável; TC corpo inteiro se estável e mecanismo de alto impacto.</li>
      <li><strong>Encaminhamento</strong> — centro de trauma se ISS elevado, choque refratário, TCE grave, fraturas instáveis.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Trauma leve isolado (contusão, laceração superficial) — curativo, analgesia, sinais de alarme.</li>
      <li>Retorno se vômitos persistentes, cefaleia progressiva, dor abdominal crescente.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Hemograma, tipagem, coagulograma, lactato, gasometria se grave.</li>
      <li>Rx tórax, pelve e coluna conforme mecanismo; TC se indicado.</li>
      <li>Monitorização contínua nas primeiras horas (rebaixamento tardio em TCE).</li>
    </ul>
    <p class="emerg-note">Referência: ATLS 11ª ed. · MS — linha de cuidado trauma. Ver protocolos detalhados no Guia de emergência → Trauma.</p>`,

  'queilite': `
    <p class="muted">Inflamação dos lábios por ressecamento, exposição solar, alergia de contato, infecção (Candida, herpes) ou deficiência nutricional. Tratar causa e barreira cutânea.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Higiene</strong> — evitar lambedura; hidratação oral adequada; protetor labial sem fragrância.</li>
      <li><strong>Barreira</strong> — vaselina, lanolina ou pomada de óxido de zinco 2–3×/dia.</li>
      <li><strong>Inflamação intensa</strong> — hidrocortisona 1% tópica fina camada 12/12h por 5–7 dias (evitar uso prolongado).</li>
      <li><strong>Suspeita de Candida</strong> (maceração, placas brancas) — nistatina creme ou miconazol tópico 2×/dia.</li>
      <li><strong>Herpes labial</strong> — aciclovir 400 mg VO 8/8h por 5 dias se início &lt; 48 h.</li>
      <li><strong>Analgesia</strong> — dipirona ou paracetamol se dor.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Fotoproteção (FPS ≥ 30); evitar cosméticos irritantes.</li>
      <li>Suplementar ferro/B12/folato se queilite angular recorrente.</li>
      <li>Retorno se fissuras profundas, ulceração ou sem melhora em 7–10 dias.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Clínica na maioria; investigar anemia/avitaminose se angular crônica.</li>
      <li>Descartar dermatite de contato (patch test ambulatorial se recorrente).</li>
    </ul>
    <p class="emerg-note">Referência: MS — atenção básica dermatologia. Uso prolongado de corticoide tópico nos lábios pode atrofiar mucosa.</p>`,

  'queimaduras': `
    <p class="muted">Lesão térmica, química ou elétrica da pele e tecidos profundos. Classificar profundidade (1º–3º grau) e <strong>superfície corporal queimada (SCQ)</strong> para definir destino.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Segurança</strong> — cessar agente causador; remover roupas/jóias; irrigar abundante se química (20 min água corrente).</li>
      <li><strong>ABC</strong> — via aérea se queimadura face/pescoço/inalação (fuligem nasal, rouquidão) — intubação precoce.</li>
      <li><strong>Resfriamento</strong> — água corrente 15–20 °C por 20 min (não gelo); não estourar bolhas.</li>
      <li><strong>Analgesia</strong> — dipirona EV/VO; morfina 2–5 mg EV se dor intensa.</li>
      <li><strong>Curativo</strong> — gazes estéreis úmidas; sulfadiazina de prata 1% se disponível (exceto face/genitais).</li>
      <li><strong>Hidratação</strong> — acesso venoso se SCQ ≥ 10% (adulto) ou ≥ 5% (criança); SF conforme Parkland (4 ml × kg × %SCQ nas 24 h, metade nas 8 h).</li>
      <li><strong>Tétano</strong> — vacina + soro antitetânico se esquema incompleto.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Queimaduras &lt; 10% SCQ, superficiais, sem face/mãos/genitais/articulações.</li>
      <li>Curativo diário; analgesia; retorno em 48 h.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Encaminhar centro de queimados: SCQ &gt; 10%, 2º–3º grau profundas, face, mãos, pés, genitais, circunferenciais, elétrica, química, criança/idoso.</li>
      <li>Eletrólitos, hemograma, função renal se internação; carboxihemoglobina se inalação.</li>
    </ul>
    <p class="emerg-note">Referência: ABQ/SBCT — manejo de queimaduras. Regra dos 9 (Wallace) para SCQ. Não usar pomadas oleosas nem aloe em queimaduras profundas.</p>`,

  'rinite-alergica': `
    <p class="muted">Inflamação nasal mediada por IgE com prurido, espirros em salva, rinorreia aquosa e obstrução. Diferenciar de resfriado e sinusite bacteriana.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Medidas ambientais</strong> — evitar alérgenos (pólen, ácaros, fumaça); lavagem nasal com SF 0,9%.</li>
      <li><strong>Anti-H1 de 2ª geração</strong> — loratadina 10 mg VO 24/24h ou desloratadina 5 mg 24/24h (Claritin, Desalex).</li>
      <li><strong>Corticoide intranasal</strong> — budesonida ou mometasona 2 jatos/narina 12/12h (efeito pleno em 3–7 dias); 1ª linha se sintomas moderados/graves.</li>
      <li><strong>Crise intensa</strong> — associar budesonida + anti-H1; oximetazolina nasal ≤ 3 dias se obstrução severa (risco de rebote).</li>
      <li><strong>Conjuntivite associada</strong> — colírio anti-H1/mastocitário (olopatadina, ketotifeno).</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Manter corticoide nasal regularmente na temporada alérgica.</li>
      <li>Imunoterapia (alérgeno-específica) se falha ao tratamento farmacológico — encaminhar alergologia.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Diagnóstico clínico na maioria.</li>
      <li>Teste cutâneo ou IgE específica se dúvida diagnóstica ou candidato à imunoterapia.</li>
    </ul>
    <p class="emerg-note">Referência: ARIA 2024 · SBIA. Corticoide intranasal é mais eficaz que anti-H1 isolado em rinite persistente moderada-grave.</p>`,

  'sangramento-uterino': `
    <p class="muted">Sangramento anormal do trato genital fora do ciclo esperado ou com volume/duração excessivos. Estabilizar hemodinamicamente e classificar (PALM-COEIN).</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>ABC</strong> — PA, FC, Hb; acesso venoso se instável; tipagem e reserva se sangramento intenso.</li>
      <li><strong>Gestação</strong> — β-hCG em toda mulher em idade fértil com sangramento — descartar aborto/ectópica.</li>
      <li><strong>Hemodinamicamente estável</strong> — ácido tranexâmico 1 g VO 8/8h por 5 dias (se não contraindicado).</li>
      <li><strong>Controle hormonal agudo</strong> — noretisterona 5 mg VO 8/8h ou medroxiprogesterona 10 mg 12/12h até sangramento cessar, depois desmame gradual.</li>
      <li><strong>Anemia sintomática</strong> — transfusão conforme Hb e clínica; sulfato ferroso após estabilização.</li>
      <li><strong>Dor/ cólicas</strong> — dipirona; AINE com cautela se sangramento ativo intenso.</li>
      <li><strong>Instabilidade refratária</strong> — curetagem/aspiração uterina ou embolização — ginecologia.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Seguimento ginecológico em 1–2 semanas; investigar causa estrutural (USG transvaginal).</li>
      <li>Anticoncepcional combinado ou SIU levonorgestrel se anovulação crônica.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Hemograma, β-hCG, coagulograma se suspeita de coagulopatia.</li>
      <li>USG pélvica; biópsia endometrial se &gt; 45 anos ou fatores de risco para neoplasia.</li>
    </ul>
    <p class="emerg-note">Referência: FEBRASGO/MS — sangramento uterino anormal. PALM-COEIN: pólipo, adenomiose, leiomioma, malignidade, coagulopatia, ovulatório, endometrial, iatrogênico, não classificado.</p>`,

  'sca-iam': `
    <p class="muted">Síndrome coronariana aguda (angina instável, NSTEMI, STEMI). Tratar como isquemia miocárdica até prova em contrário — <strong>ECG em ≤ 10 min</strong>.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Monitor + O₂</strong> — apenas se SpO₂ &lt; 90%; acesso venoso calibroso.</li>
      <li><strong>ECG 12 derivações</strong> em ≤ 10 min; repetir se dor recorrer.</li>
      <li><strong>MONABH</strong> — <strong>M</strong>orfina 2–4 mg EV se dor refratária (cautela); <strong>O</strong>₂ se hipoxemia; <strong>N</strong>itrato SL 5 mg (repetir 5 min × 3) se PAS &gt; 90 e sem suspeita de IAM de VD; <strong>A</strong>AS 150–300 mg VO mastigar; <strong>B</strong>etabloqueador (metoprolol 25–50 mg VO ou 5 mg EV fracionado) se FC &gt; 60 e sem contraindicação; <strong>H</strong>eparina não fracionada 60 U/kg bolus (máx. 4000 U) + 12 U/kg/h ou enoxaparina 1 mg/kg 12/12h SC.</li>
      <li><strong>P2Y12</strong> — <strong>clopidogrel</strong> 300 mg VO ataque (600 mg se fibrinólise) ou ticagrelor 180 mg se disponível.</li>
      <li><strong>Troponina</strong> seriada (0 h, 3–6 h); eletrólitos e função renal.</li>
      <li><strong>STEMI</strong> — acionar hemodinâmica; meta <strong>porta-balão ≤ 90 min</strong> ou fibrinólise ≤ 30 min se ICP indisponível.</li>
      <li><strong>NSTEMI/AI de alto risco</strong> — estratificar GRACE; <strong>encaminhar cateterismo</strong> &lt; 24 h (muito alto risco) ou &lt; 72 h.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Não aplicável na suspeita aguda — observação mínima até troponina e ECG estáveis.</li>
      <li>Alta apenas em dor atípica com troponina negativa e ECG normal após observação protocolada.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>ECG seriado, troponina ultrassensível, Rx tórax, ecocardiograma se instabilidade.</li>
      <li>Calcular GRACE (Calculadoras → Cardiologia) para NSTEMI/AI.</li>
    </ul>
    <p class="emerg-note">Referência: Diretriz SBC SCA 2025 · MONABH. Ver Guia de emergência → SCA para fluxos STEMI/NSTEMI detalhados. Não atrasar reperfusão por exames complementares.</p>`,

  'sinusite-aguda': `
    <p class="muted">Inflamação dos seios paranasais, geralmente pós-viral. Antibiótico apenas se sintomas persistentes (&gt; 10 dias), piora após melhora inicial ou quadro grave.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Suporte</strong> — lavagem nasal com SF 0,9%; analgesia (dipirona, paracetamol); hidratação.</li>
      <li><strong>Congestão</strong> — budesonida nasal ou oximetazolina ≤ 3 dias.</li>
      <li><strong>Indicação de ATB</strong> — amoxicilina + clavulanato 875/125 mg 12/12h por 5–7 dias (1ª linha); alergia à penicilina: levofloxacino 500 mg 24/24h ou doxiciclina 100 mg 12/12h.</li>
      <li><strong>Complicações</strong> — celulite orbitária, abscesso, meningite: ceftriaxona 2 g EV 12/12h + vancomicina conforme protocolo; TC seios + órbita; otorrino/oftalmo.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Maioria viral — sem ATB nas primeiras 7–10 dias se quadro leve.</li>
      <li>Retorno se febre &gt; 39 °C, edema periorbitário, alteração visual ou cefaleia intensa.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Diagnóstico clínico (dor facial, secreção purulenta, congestão &gt; 10 dias).</li>
      <li>TC seios se complicação suspeita, imunossuprimido ou falha terapêutica.</li>
    </ul>
    <p class="emerg-note">Referência: MS/IDSA — sinusite aguda bacteriana. Uso indiscriminado de ATB aumenta resistência; critérios clínicos guiam prescrição.</p>`,

  'abstinencia-alcoolica': `
    <p class="muted">Síndrome de abstinência alcoólica (tremor, sudorese, ansiedade, agitação) 6–24 h após última ingestão. Risco de <strong>delirium tremens</strong> e convulsões — prevenir com benzodiazepínico.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>ABC</strong> — glicemia capilar; eletrólitos (K⁺, Mg²⁺); acesso venoso.</li>
      <li><strong>Tiamina</strong> — 300 mg EV/IM antes de glicose (prevenir Wernicke).</li>
      <li><strong>Benzodiazepínico</strong> — diazepam 10 mg VO/EV 6/6h ou lorazepam 2 mg EV 4/4h; titular por sintomas (escala CIWA-Ar).</li>
      <li><strong>Convulsão</strong> — diazepam 10 mg EV lento; fenitoína se recorrente.</li>
      <li><strong>Delirium tremens</strong> — UTI; diazepam EV em bolus + infusão; haloperidol 2,5–5 mg EV se agitação psicótica (após sedação).</li>
      <li><strong>Suporte</strong> — SF + tiamina + multivitamínico; corrigir hipomagnesemia.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Abstinência leve (CIWA &lt; 8) — diazepam 10 mg VO 6/6h por 2–3 dias com retorno diário.</li>
      <li>Encaminhar CAPS-AD / grupo de apoio; naltrexona ou acamprosato ambulatorial.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Hemograma, TGO/TGP, GGT, INR, amilase se pancreatite suspeita.</li>
      <li>Internar se CIWA ≥ 15, história de DT, comorbidades graves ou falha ambulatorial.</li>
    </ul>
    <p class="emerg-note">Referência: MS/CAPS-AD — dependência de álcool. Benzodiazepínico é tratamento de escolha; fenitoína não previne convulsão por abstinência.</p>`,

  'sepse-choque-septico': `
    <p class="muted">Resposta desregulada à infecção com disfunção orgânica (Sepsis-3). Choque séptico = necessidade de vasopressor para PAM ≥ 65 + lactato &gt; 2 mmol/L apesar de volume.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Reconhecer</strong> — qSOFA ≥ 2 ou suspeita clínica de infecção + hipotensão/hipoperfusão.</li>
      <li><strong>Bundle hora-1</strong> (iniciar imediatamente):
        <ul>
          <li><strong>Lactato</strong> sérico — dosar na admissão; repetir em 2–4 h se &gt; 2 mmol/L.</li>
          <li><strong>Culturas</strong> — ≥ 2 hemoculturas (e urina/escarro conforme foco) <em>antes</em> do ATB, sem atrasar antibiótico &gt; 45 min.</li>
          <li><strong>Antibiótico de amplo espectro</strong> — iniciar em <strong>≤ 1 h</strong> do reconhecimento (ex.: ceftriaxona + azitromicina se pneumonia; piperacilina-tazobactam se abdominal; conforme foco).</li>
          <li><strong>Cristaloide</strong> — <strong>SF 0,9% 30 ml/kg</strong> IV se hipotensão (PAS &lt; 90) ou lactato ≥ 4 mmol/L; infundir nas primeiras 3 h.</li>
        </ul>
      </li>
      <li><strong>Vasopressor</strong> — noradrenalina se PAM &lt; 65 mmHg após/durante fluidos (1ª linha).</li>
      <li><strong>Controle de foco</strong> — drenar abscesso, remover cateter infectado, cirurgia se indicado.</li>
      <li><strong>UTI</strong> — monitorização invasiva; reavaliar lactato (meta clearance ≥ 40% em 6 h).</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Não aplicável — sepse/choque exige internação e monitorização.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Lactato seriado, hemoculturas, procalcitonina, hemograma, função renal/hepática.</li>
      <li>Imagem do foco (Rx tórax, USG abdome, TC conforme suspeita).</li>
      <li>Calcular SOFA/qSOFA (Calculadoras essenciais).</li>
    </ul>
    <p class="emerg-note">Referência: Surviving Sepsis Campaign 2021 · Sepsis-3. Ver Guia de emergência → Sepse (bundle hora-1, noradrenalina, lactato). Cada hora de atraso no ATB aumenta mortalidade.</p>`,

  'sindrome-vestibular': `
    <p class="muted">Tontura/vertigem aguda por disfunção periférica (VPPB, neurite vestibular, labirintite) ou central (AVC posterior — sempre descartar). Avaliar HINTS se agudo contínuo.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>ABC</strong> — glicemia capilar; PA; exame neurológico (HINTS se vertigem aguda contínua).</li>
      <li><strong>Sinais centrais</strong> — diplopia, disartria, ataxia truncal, cefaleia intensa, déficit focal → TC crânio urgente.</li>
      <li><strong>VPPB (canal posterior)</strong> — manobra de Epley no PS; meclizina 25 mg VO 8/8h por 3 dias se náusea.</li>
      <li><strong>Neurite vestibular</strong> — prednisona 60 mg VO 24/24h por 5 dias com desmame; dimenidrinato 50 mg VO 6/6h ou metoclopramida 10 mg EV 8/8h se vômitos.</li>
      <li><strong>Labirintite aguda</strong> — antiemético + suporte; ATB apenas se mastoidite suspeita.</li>
      <li><strong>Hidratação</strong> — SF EV se vômitos impedem VO.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Evitar dirigir até resolução; exercícios de Brandt-Daroff para VPPB.</li>
      <li>Reabilitação vestibular se sintomas &gt; 2 semanas.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>TC crânio se qualquer sinal central ou HINTS anormal (AVC posterior).</li>
      <li>Audiometria ambulatorial se perda auditiva associada (doença de Ménière).</li>
    </ul>
    <p class="emerg-note">Referência: ABORL-CCF · AAO-HNS. Vertigem aguda contínua + HINTS central = AVC até prova em contrário. Benzodiazepínicos prolongam compensação vestibular.</p>`,

  'soluco-persistente': `
    <p class="muted">Contrações diafragmáticas involuntárias &gt; 48 h. Investigar causas secundárias (eletrólitos, infecção, medicamentos, irritação diafragmática).</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Causas tratáveis</strong> — corrigir hiponatremia, hipocalemia, hipercalcemia; suspender opioides, benzodiazepínicos, corticoides se possível.</li>
      <li><strong>Medidas físicas</strong> — Valsalva, retenção de CO₂ (saco de papel), massagem do seio carotídeo (cautela em idosos/aterosclerose).</li>
      <li><strong>1ª linha farmacológica</strong> — clorpromazina 25 mg VO 8/8h ou 25 mg IM dose única se VO impossível.</li>
      <li><strong>Alternativas</strong> — metoclopramida 10 mg EV/IM 8/8h; baclofeno 10 mg VO 8/8h (escalar se necessário).</li>
      <li><strong>Refratário</strong> — gabapentina 300 mg VO 8/8h; bloqueio do nervo frênico ou fármaco intratecal em UTI.</li>
      <li><strong>Investigar</strong> — Rx tórax/abdome se suspeita de abscesso subfrênico, pneumonia basal, pancreatite.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Soluço &lt; 48 h e sem causa orgânica — observação, retorno se persistir.</li>
      <li>Evitar álcool e refeições volumosas; tratar DRGE se associado.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Eletrólitos, função renal/hepática, amilase se dor abdominal.</li>
      <li>TC abdome/tórax se &gt; 48 h sem resposta ou sinais de irritação diafragmática.</li>
    </ul>
    <p class="emerg-note">Referência: MS — manejo de soluço persistente. Clorpromazina é gold standard; monitorar hipotensão e sedação.</p>`,

  'tinea': `
    <p class="muted">Dermatofitose superficial (<em>T. pedis, cruris, corporis</em>). Lesões anulares com borda ativa e centro clareando; prurido variável.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Higiene</strong> — manter área seca; trocar meias diariamente; não compartilhar toalhas.</li>
      <li><strong>Tinea pedis/cruris leve</strong> — clotrimazol 1% creme 12/12h por 2–4 semanas ou terbinafina 1% creme 24/24h por 1–2 semanas.</li>
      <li><strong>Tinea corporis extensa</strong> — terbinafina 250 mg VO 24/24h por 2 semanas ou itraconazol 100 mg VO 12/12h por 1 semana.</li>
      <li><strong>Onicomicose</strong> — terbinafina 250 mg VO 24/24h por 6–12 semanas (unha) — encaminhar dermatologia se dúvida.</li>
      <li><strong>Prurido intenso</strong> — hidroxizina 25 mg VO à noite ou loratadina 10 mg 24/24h.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Completar ciclo mesmo com melhora clínica precoce.</li>
      <li>Calçados ventilados; antifúngico em pó profilático se recorrência.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Diagnóstico clínico na maioria.</li>
      <li>Exame direto KOH ou cultura se atípico ou falha terapêutica.</li>
    </ul>
    <p class="emerg-note">Referência: SBD — dermatofitoses. Corticoide tópico isolado piora tinea (tinea incognito). Verificar interações de azóis com estatinas.</p>`,

  'tosse': `
    <p class="muted">Reflexo de defesa das vias aéreas. Tosse &lt; 3 semanas geralmente pós-infecciosa; investigar se &gt; 3 semanas (asma, DRGE, medicamentos, TB).</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Gravidade</strong> — SpO₂, FR; dispneia, hemoptise, estridor → priorizar via aérea e investigação urgente.</li>
      <li><strong>Hemoptise</strong> — estabilizar; Rx tórax; considerar TB, bronquiectasia, TEP — internar se maciça.</li>
      <li><strong>Tosse seca pós-viral</strong> — hidratação; mel (adulto) ou xarope simples; evitar supressores rotineiros.</li>
      <li><strong>Tosse produtiva</strong> — amoxicilina 500 mg 8/8h por 5 dias se suspeita bacteriana (febre, purulência, &gt; 10 dias); ambroxol 30 mg 8/8h como expectorante.</li>
      <li><strong>Broncoespasmo associado</strong> — salbutamol spray 2 jatos 6/6h + prednisona 40 mg VO 24/24h por 5 dias.</li>
      <li><strong>Evitar</strong> — codeína de rotina (pouca evidência, risco de dependência); AAS/AINE se suspeita de dengue.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Tosse pós-infecciosa pode durar 3–8 semanas — orientar e reavaliar.</li>
      <li>Investigar TB se tosse &gt; 3 semanas + perda ponderal, sudorese noturna, contato com TB.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Rx tórax se febre persistente, hemoptise, imunossupressão ou &gt; 3 semanas.</li>
      <li>Espirometria ambulatorial se suspeita de asma/DPOC.</li>
    </ul>
    <p class="emerg-note">Referência: SBPT/MS — tosse crônica. Tosse isolada raramente necessita antibiótico; hemoptise nunca é banal.</p>`,

  'trauma-ocular': `
    <p class="muted">Lesão mecânica ou química do olho e anexos. <strong>Emergência oftalmológica</strong> se penetração, perda de conteúdo, química grave ou hematoma hiposfagma com suspeita de ruptura.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Não manipular</strong> — escudo rígido sem pressão; não remover corpo estranho aderido; não avaliar PIO digital se suspeita de ruptura.</li>
      <li><strong>Química</strong> — irrigar imediatamente com SF 0,9% ou Ringer lactato ≥ 1–2 L (mín. 30 min); pH conjuntival entre irrigações.</li>
      <li><strong>Contusão</strong> — analgesia (dipirona); elevar cabeceira 30°; gelo intermitente na pálpebra (não no globo).</li>
      <li><strong>Corpo estranho superficial</strong> — após anestesia tópica (proparacaína), remover com cotonete úmido ou agulha estéril; ATB tópico (tobramicina colírio 6/6h).</li>
      <li><strong>Hiposfagma total</strong> — suspeitar ruptura escleral; TC órbita; oftalmologia urgente.</li>
      <li><strong>ATB profilático</strong> — ciprofloxacino 500 mg VO 12/12h se ferida penetrante até avaliação especializada.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Abrasão corneana leve — lubrificante + tobramicina colírio 5 dias; retorno em 24 h.</li>
      <li>Retorno imediato se dor crescente, visão turva, fotofobia intensa.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Acuidade visual, reflexo pupilar, fluoresceína (Seidel se penetração).</li>
      <li>TC órbita se trauma de alto impacto, enoftalmia, diplopia.</li>
    </ul>
    <p class="emerg-note">Referência: CBO/Conselho Federal de Medicina — trauma ocular. Química alcalina &gt; ácida em gravidade. Nunca atrasar irrigação para documentação.</p>`,

  'tuberculose': `
    <p class="muted">Infecção por <em>M. tuberculosis</em>, geralmente pulmonar. Iniciar esquema padronizado do MS após confirmação ou forte suspeita clínico-radiológica.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Isolamento</strong> — máscara cirúrgica no paciente; N95 para equipe se suspeita de TB pulmonar bacilífera.</li>
      <li><strong>Diagnóstico</strong> — escarro (BAAR + GeneXpert/tríplice amostra); Rx tórax PA.</li>
      <li><strong>Esquema RHZE (fase intensiva)</strong> — <strong>2 meses de RHZE</strong>: rifampicina + isoniazida + pirazinamida + etambutol (kit MS ou comprimidos fixos).</li>
      <li><strong>Fase manutenção</strong> — <strong>4 meses de RH</strong> (rifampicina + isoniazida) após fase intensiva.</li>
      <li><strong>Doses adulto (referência MS)</strong> — R 10 mg/kg (máx. 600 mg); H 10 mg/kg (máx. 300 mg); Z 35 mg/kg (máx. 2 g); E 15 mg/kg (máx. 1,6 g) — 1×/dia em jejum.</li>
      <li><strong>Profilaxia neuropatia</strong> — piridoxina 25–50 mg/dia com isoniazida.</li>
      <li><strong>TB grave/meninge</strong> — internar; rifampicina EV se disponível; corticoide adjuvante na meningite TB.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>TDO (tratamento diretamente observado) preferencial nos primeiros 2 meses.</li>
      <li>Notificação compulsória; investigar contactantes.</li>
      <li>Monitorar TGO/TGP mensal (hepatotoxicidade).</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>BAAR, GeneXpert, cultura e TSA; Rx tórax comparativo.</li>
      <li>HIV (coinfecção altera esquema); teste de função hepática basal.</li>
    </ul>
    <p class="emerg-note">Referência: MS/PNCT — esquema <strong>2RHZE/4RH</strong> para TB pulmonar nova. Resistência a rifampicina (GeneXpert R) → encaminhar referência TB-MDR. Não usar monoterapia.</p>`,

  'ulcera-varicosa': `
    <p class="muted">Úlcera de perna por hipertensão venosa crônica. Tratar edema, infecção e ferida; compressão é pilar do tratamento.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Avaliar</strong> — bordas, exsudato, odor, celulite perilesional; palpar pulsos (descartar componente arterial).</li>
      <li><strong>Curativo</strong> — limpeza com SF 0,9%; desbridamento de tecido necrótico solto; cobertura: hidrogel (leito limpo) ou carvão ativado (exsudato).</li>
      <li><strong>Infecção</strong> — celulite: cefalexina 500 mg VO 6/6h por 7–10 dias; se grave: clindamicina 600 mg VO 8/8h.</li>
      <li><strong>Compressão</strong> — meia elástica 30–40 mmHg ou bandagem multicamadas se ABI &gt; 0,8 e sem ICC descompensada.</li>
      <li><strong>Edema</strong> — elevar MMII; furosemida 40 mg VO se congestão associada.</li>
      <li><strong>Dor</strong> — dipirona; pentoxifilina 400 mg 8/8h adjuvante em úlcera crônica.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Curativo ambulatorial 2–3×/semana; compressão contínua diurna.</li>
      <li>Encaminhar cirurgia vascular se úlcera &gt; 6 meses sem cicatrização ou suspeita de etiologia arterial.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Índice tornozelo-braquial (ITB) antes de compressão forte.</li>
      <li>USG Doppler venoso ambulatorial; cultura de ferida se ATB repetido.</li>
    </ul>
    <p class="emerg-note">Referência: SBACV — úlcera venosa. Compressão acelera cicatrização; contraindicada se ITB &lt; 0,5. Descartar úlcera neoplásica se bordas elevadas.</p>`,

  'ulceras-genitais': `
    <p class="muted">Úlceras infecciosas do trato genital: sífilis, herpes, cancro mole, donovanose, LGV. Diagnóstico clínico + sorologias; tratar empiricamente conforme epidemiologia BR.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Higiene</strong> — lavar com água e sabão; evitar relações até diagnóstico; notificar parceiros.</li>
      <li><strong>Sífilis (úlcera indolor, borda dura)</strong> — penicilina benzatina 2,4 milhões UI IM dose única (1,2 milhão UI em cada glúteo).</li>
      <li><strong>Herpes (vesículas dolorosas, múltiplas)</strong> — aciclovir 400 mg VO 8/8h por 7–10 dias ou 200 mg 5×/dia.</li>
      <li><strong>Cancro mole (úlcera dolorosa, borda irregular, pus)</strong> — azitromicina 1 g VO dose única ou ceftriaxona 500 mg IM dose única.</li>
      <li><strong>Donovanose</strong> — azitromicina 1 g VO semanal ou 500 mg VO 24/24h até cicatrização (mín. 3 semanas).</li>
      <li><strong>LGV (úlcera pequena + linfadenopatia inguinal)</strong> — doxiciclina 100 mg VO 12/12h por 21 dias.</li>
      <li><strong>Analgesia</strong> — dipirona; banho de assento morno.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Retorno em 7 dias para reavaliação e resultados (VDRL, HIV, hepatites).</li>
      <li>Tratar parceiros conforme protocolo IST MS.</li>
      <li>Sífilis — VDRL controle 3, 6, 12 meses.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>VDRL/RPR + FTA-Abs; sorologia HIV; HBsAg; anti-HCV.</li>
      <li>PCR HSV-2, cultura se atípico; biópsia se úlcera atípica ou não cicatriza.</li>
    </ul>
    <p class="emerg-note">Referência: MS/PN-DST 2022 — manejo de úlceras genitais. Tratar sífilis e herpes empiricamente se dúvida. Donovanose e cancro mole são endêmicos na Amazônia.</p>`,

  'varizes-mmi': `
    <p class="muted">Insuficiência venosa crônica dos membros inferiores com veias dilatadas, dor, edema e desconforto. Classificar CEAP; tratar com medidas conservadoras na maioria.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Avaliar complicações</strong> — úlcera ativa, tromboflebite superficial, sangramento varicoso (compressão imediata + elevação).</li>
      <li><strong>Sangramento de variz</strong> — compressão direta 10 min; elevar membro; curativo compressivo; investigar coagulopatia se recorrente.</li>
      <li><strong>Tromboflebite superficial</strong> — cefalexina 500 mg 6/6h se extensa/proximal; AINE (ibuprofeno 400 mg 8/8h) + compressão; USG Doppler se próximo à safena (descartar TVP).</li>
      <li><strong>Edema e dor</strong> — meia elástica 20–30 mmHg; elevação; diosmina + hesperidina 500 mg 12/12h (adjuvante).</li>
      <li><strong>Prurido/dermatite ocre</strong> — hidrocortisona 1% tópica curto prazo + emoliente.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Meias de compressão diurnas; exercício (caminhada); perda de peso.</li>
      <li>Encaminhar cirurgia vascular/dermatologia para escleroterapia ou cirurgia se sintomático refratário.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>USG Doppler venoso ambulatorial (refluxo safeno-femoral).</li>
      <li>ITB se suspeita de doença arterial concomitante.</li>
    </ul>
    <p class="emerg-note">Referência: SBACV — insuficiência venosa crônica (CEAP). Tromboflebite &gt; 5 cm da junção safeno-femoral → avaliar anticoagulação (TVP associada).</p>`,

  'violencia-sexual-pep': `
    <p class="muted">Profilaxias pós-exposição (PEP) após violência sexual conforme protocolo MS. Janelas: contracepção de emergência até 5 dias; IST bacterianas imediato; HIV até 72 h.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Acolhimento</strong> — privacidade, equipe treinada, consentimento; registro de lesões (corpo de delito se desejado, sem bloquear assistência).</li>
      <li><strong>Contracepção de emergência</strong> — <strong>levonorgestrel</strong> 1,5 mg VO dose única (até 72 h, eficácia decrescente até 5 dias) ou DIU de cobre (até 5 dias, mais eficaz).</li>
      <li><strong>Profilaxia IST bacterianas</strong> — <strong>ceftriaxona</strong> 500 mg IM dose única (gonorreia) + <strong>azitromicina</strong> 1 g VO dose única (clamídia) + metronidazol 2 g VO dose única (tricomonas/gardnerella).</li>
      <li><strong>PEP HIV (TARV)</strong> — iniciar em <strong>≤ 72 h</strong> conforme protocolo MS: esquema preferencial <strong>tenofovir + lamivudina + dolutegravir</strong> (TDF/3TC/DTG) por 28 dias se exposição de risco (ejaculação/lesão em mucosa com parceiro HIV+ ou status desconhecido).</li>
      <li><strong>Hepatite B</strong> — vacina + imunoglobulina anti-HBs se não vacinado ou esquema incompleto.</li>
      <li><strong>Suporte</strong> — profilaxia tétano se feridas; analgesia; encaminhamento psicossocial (CRAS, delegacia especializada se desejado).</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Retorno em 7, 14 e 30 dias — adesão TARV, efeitos adversos, sorologias baseline.</li>
      <li>Reteste HIV, sífilis, hepatite B/C e gravidez em 3 e 6 meses.</li>
      <li>Acompanhamento psicológico contínuo.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Sorologias baseline: HIV, sífilis (VDRL), HBsAg, anti-HCV, β-hCG.</li>
      <li>Exame físico completo com documentação de lesões; coleta de secreção se corrimento.</li>
    </ul>
    <p class="emerg-note">Referência: MS — Protocolo de atenção às pessoas em situação de violência sexual (2022). PEP HIV: 28 dias TARV. Não negar assistência por ausência de BO.</p>`,

  'vomitos-agudos': `
    <p class="muted">Vômitos de início recente por gastroenterite, intoxicação, gravidez, obstrução ou causa metabólica. Priorizar hidratação e tratar causa base.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>ABC</strong> — avaliar desidratação (turgor, PA, diurese); glicemia capilar; β-hCG em mulher fértil.</li>
      <li><strong>Hidratação</strong> — leve: SRO 200 ml após cada vômito; moderada/grave: SF 0,9% 500–1000 ml EV bolus, reavaliar.</li>
      <li><strong>Antiemético</strong> — metoclopramida 10 mg EV/IM 8/8h ou ondansetrona 4 mg EV 8/8h (1ª linha se gastroenterite ou quimioterapia).</li>
      <li><strong>Gastroenterite viral</strong> — suporte; racecadotril 100 mg VO 8/8h (adulto) adjuvante; sem ATB de rotina.</li>
      <li><strong>Suspeita de obstrução</strong> — SNG em drenagem; Rx abdome; cirurgia se distensão, ausência de flatus, dor em cólica.</li>
      <li><strong>Intoxicação</strong> — tratar conforme agente; carvão ativado se ingestão recente e via pérvia.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Dieta leve progressiva após 6 h sem vômitos; evitar álcool e gordura inicialmente.</li>
      <li>Retorno se vômitos com sangue, fezes escuras, dor abdominal intensa ou sinais de desidratação.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Eletrólitos, ureia/creatinina se desidratação moderada-grave.</li>
      <li>Rx abdome ou TC se suspeita de obstrução, apendicite, pancreatite.</li>
      <li>Amilase/lipase se dor epigástrica irradiada para dorso.</li>
    </ul>
    <p class="emerg-note">Referência: MS — gastroenterite aguda. Ondansetrona prolonga QT — cautela com outros QT-prolongadores. Obstrução intestinal: antiemético não substitui avaliação cirúrgica.</p>`,

  'vulvovaginites': `
    <p class="muted">Inflamação vulvovaginal por vaginose bacteriana (VB), candidíase ou tricomoníase. Diagnóstico clínico (corrimento, pH, Whiff, microscopia) orienta tratamento específico.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Avaliar</strong> — corrimento (cor, odor, prurido), pH vaginal, sinais de PID (dor pélvica, febre) → encaminhar ginecologia.</li>
      <li><strong>Vaginose bacteriana</strong> (corrimento cinza, odor de peixe, pH &gt; 4,5, Whiff+) — <strong>metronidazol</strong> 500 mg VO 12/12h por 7 dias ou gel vaginal metronidazol 0,75% 1 aplicador 24/24h por 5 dias.</li>
      <li><strong>Candidíase</strong> (prurido intenso, corrimento grumoso branco, pH &lt; 4,5) — <strong>fluconazol</strong> 150 mg VO dose única ou miconazol creme vaginal 2% 7 noites.</li>
      <li><strong>Tricomoníase</strong> (corrimento amarelo-esverdeado, espumoso, colo em framboesa) — <strong>metronidazol</strong> 2 g VO dose única ou 500 mg 12/12h por 7 dias; tratar parceiro.</li>
      <li><strong>Sintomáticos</strong> — evitar duchas; higiene externa apenas com água.</li>
      <li><strong>Gestante</strong> — metronidazol 250 mg 8/8h por 7 dias (VB/tricomonas); clotrimazol tópico (candida) — evitar fluconazol oral na gestação.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Retorno se sintomas persistem em 7–14 dias (recorrência, resistência, outra IST).</li>
      <li>Tratar parceiros em tricomoníase; investigar IST concomitantes (HIV, sífilis).</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>pH, teste de Whiff (KOH), microscopia a fresco se disponível.</li>
      <li>Citologia/cultura se recorrente (&gt; 4 episódios/ano) ou falha terapêutica.</li>
    </ul>
    <p class="emerg-note">Referência: MS/PN-DST 2022 · FEBRASGO. VB: metronidazol. Candida: fluconazol. Tricomonas: metronidazol. Não misturar tratamentos sem diagnóstico — piora candidíase com metronidazol isolado em VB mal diagnosticada.</p>`
};
