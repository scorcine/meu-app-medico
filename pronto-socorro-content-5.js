/* Pronto Socorro — conteúdo clínico (lote 5 — novas condições) */

const PS_CONTENT_5 = {
  'acidente-ofidico': `
    <p class="muted">Envenenamento por serpente — classificar gravidade (local, sistêmica, grave); soro antiofídico específico conforme espécie (Bothrops, Crotalus, Lachesis, Micrurus). Não fazer torniquete, incisão ou sucção.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>ABC</strong> — imobilizar membro abaixo do coração; remover anéis/pulseiras; marcar borda do edema a cada 30 min.</li>
      <li><strong>Classificação</strong> — leve (sem progressão sistêmica): observação 6–12 h; moderada/grave (edema progressivo, sangramento, hipotensão, neurotoxicidade, rabdomiólise): internar + soro.</li>
      <li><strong>Soro antiofídico (SUS/ANVISA)</strong> — Bothrops/Lachesis: Soro Antibotrópico ou Antibotrópico-Laquético; Crotalus: Soro Anticrotálico; Micrurus: Soro Antielapídico. Dose conforme bula/MS (geralmente 4–12 ampolas EV diluídas em SF, titular conforme resposta).</li>
      <li><strong>Bothrops (mais comum)</strong> — analgesia (dipirona; evitar AINE precoce se sangramento); SF 20 mL/kg se hipovolemia; monitorar coagulograma, creatinina, CPK, Hb.</li>
      <li><strong>Crotalus</strong> — risco de rabdomiólise/IRA: hidratação agressiva; alcalinizar urina se mioglobinúria; analgesia; soro anticrotálico precoce se neurotoxicidade ou miotoxicidade.</li>
      <li><strong>Complicações</strong> — choque: expansão + vasopressor; sangramento: plasma/concentrado conforme protocolo; fasciotomia se síndrome compartimental; diálise se IRA.</li>
      <li><strong>Evitar</strong> — heparina, corticoide de rotina, ATB profilático (usar só se infecção secundária).</li>
    </ol>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Tempo de coagulação (TCT/TAP) seriado · hemograma · creatinina · CPK · gasometria se grave</li>
      <li>Identificar serpente (foto) quando possível — não atrasar soro</li>
    </ul>
    <p class="emerg-note">MS/Ministério da Saúde — Manual de Diagnóstico e Tratamento de Acidentes por Animais Peçonhentos. CEATOX se dúvida. Conteúdo educacional.</p>`,

  'meningite-bacteriana': `
    <p class="muted">Meningite/meningoencefite bacteriana aguda — emergência infecciosa. ATB empírico em ≤ 30 min após punção lombar (ou imediato se PL contraindicada/atrasada).</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>ABC + isolamento</strong> — O₂, acesso venoso; profilaxia de contactantes (rifampicina, ciprofloxacino ou ceftriaxona conforme agente).</li>
      <li><strong>ATB empírico adulto (&gt; 18 anos)</strong> — ceftriaxona 2 g IV 12/12 h + dexametasona 10 mg IV 6/6 h × 4 dias (iniciar antes ou com 1ª dose de ATB se pneumococo suspeito).</li>
      <li><strong>Imunossupressão, &gt; 50 anos ou neurocirurgia</strong> — associar vancomicina 15–20 mg/kg IV 12/12 h + ampicilina 2 g IV 4/4 h (Listeria).</li>
      <li><strong>Contato meningocócica</strong> — notificação compulsória; quimioprofilaxia contactantes: rifampicina 600 mg VO 12/12 h × 2 dias ou ciprofloxacino 500 mg VO dose única ou ceftriaxona 250 mg IM dose única.</li>
      <li><strong>PL contraindicada</strong> (coagulopatia, edema cerebral, instabilidade) — TC crânio se déficit focal; iniciar ATB empírico imediato; PL quando seguro.</li>
      <li><strong>Suporte</strong> — antitérmico (dipirona); controle de convulsão (levetiracetam); tratar choque séptico se presente.</li>
    </ol>
    <h4>Exames / investigação</h4>
    <ul>
      <li>PL: LCR turvo, hiperproteinorraquia, hipoglicorraquia, pleocitose neutrofílica · Gram · cultura · PCR</li>
      <li>Hemocultura antes do ATB · glicemia · eletrólitos</li>
    </ul>
    <p class="emerg-note">MS/PCDT meningite · IDSA 2024. Pediatria: ceftriaxona 100 mg/kg/dia (máx. 4 g). Conteúdo educacional.</p>`,

  'tep': `
    <p class="muted">Tromboembolismo pulmonar — dispneia súbita, dor pleurítica, taquicardia, hipoxemia. Estratificar risco (PESI/sPESI) e tratar anticoagulação ± reperfusão se instabilidade.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>ABC</strong> — O₂ alvo SpO₂ &gt; 90%; acesso venoso; monitor.</li>
      <li><strong>Diagnóstico</strong> — angioTC tórax (1ª linha) ou escintilografia V/Q se contraindicação ao contraste; D-dímero se baixa probabilidade (Wells).</li>
      <li><strong>Anticoagulação imediata</strong> (se confirmado ou alta suspeita): enoxaparina 1 mg/kg SC 12/12 h (máx. 100 mg/dose) <em>ou</em> heparina não fracionada 80 U/kg bolus + 18 U/kg/h (ajustar TTPa).</li>
      <li><strong>TEP de alto risco (choque/hipotensão)</strong> — trombólise: alteplase 100 mg EV em 2 h (ou tenecteplase peso-corporal) se sem contraindicação; alternativa: embolectomia.</li>
      <li><strong>TEP submaciço</strong> — anticoagulação + monitor UTI; considerar trombólise se deterioração.</li>
      <li><strong>Evitar</strong> — filtro de veia cava de rotina; anticoagular se sangramento ativo não controlado.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>TEP baixo risco (PESI I–II): rivaroxabana 15 mg VO 12/12 h × 21 dias → 20 mg/dia <em>ou</em> apixabana esquema agudo — se elegível ambulatorial.</li>
      <li>Varfarina: iniciar concomitante à heparina; alvo INR 2–3.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>ECG (S1Q3T3, taquicardia sinusal) · troponina · BNP · USG venoso MMII se suspeita de TVP concomitante</li>
    </ul>
    <p class="emerg-note">ESC TEP 2019 · SBC. DOACs disponíveis no Brasil (rivaroxabana, apixabana, dabigatrana, edoxabana). Conteúdo educacional.</p>`,

  'tvp': `
    <p class="muted">Trombose venosa profunda — membro edemaciado, dor, empastamento de panturrilha (sinal de Homans inespecífico). Anticoagular se confirmada; excluir flegmasia cerúlea dolens.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Probabilidade clínica</strong> — escore de Wells; D-dímero se baixa/intermediária probabilidade (exclui se normal e baixa).</li>
      <li><strong>Diagnóstico</strong> — USG Doppler venoso de MMII (exame de escolha); se indisponível e alta suspeita → anticoagular empiricamente e repetir USG.</li>
      <li><strong>Anticoagulação</strong> — enoxaparina 1 mg/kg SC 12/12 h <em>ou</em> rivaroxabana 15 mg VO 12/12 h × 21 dias → 20 mg/dia (início imediato se monoterapia DOAC) <em>ou</em> varfarina + heparina sobreposição.</li>
      <li><strong>Flegmasia cerúlea dolens</strong> — edema massivo, cianose, dor intensa → internação + anticoagulação; considerar trombólise/cateter.</li>
      <li><strong>Medidas</strong> — elevar membro; meia compressiva após 24 h de anticoagulação (se tolerado); analgesia (dipirona).</li>
      <li><strong>Investigar causa</strong> — neoplasia oculta, trombofilia, imobilização, estrogênio, cirurgia recente.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>TVP proximal não complicada: anticoagulação mínima 3 meses (1º episódio provocado) ou 6–12 meses (não provocado).</li>
      <li>Retorno se piora da dor, dispneia (suspeita TEP), sangramento.</li>
    </ul>
    <p class="emerg-note">ACCP/ESC · SBC. Meia elástica 20–30 mmHg após fase aguda. Conteúdo educacional.</p>`,

  'pancreatite-aguda': `
    <p class="muted">Pancreatite aguda — dor epigástrica intensa irradiada para dorso, lipase/amilase ≥ 3× LSN. Estratificar gravidade (BISAP, APACHE) e hidratar agressivamente.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>ABC</strong> — jejum inicial; SNG se vômitos incoercíveis; analgesia (dipirona + tramadol ou morfina 2–5 mg EV titulada).</li>
      <li><strong>Hidratação agressiva</strong> — SF 0,9% 5–10 mL/kg/h nas primeiras 12–24 h (reavaliar volemia, diurese, lactato); cautela em cardiopata/idoso.</li>
      <li><strong>Investigar etiologia</strong> — litíase biliar (USG abdome), álcool, triglicerídeos, medicamentos, hipercalcemia.</li>
      <li><strong>Antibiótico</strong> — <strong>não profilático</strong>; usar só se infecção documentada (necrose infectada, colangite).</li>
      <li><strong>Colangite associada</strong> — ATB (ceftriaxona + metronidazol) + CPRE urgente.</li>
      <li><strong>Colecistectomia</strong> — pancreatite biliar leve: colecistectomia na mesma internação (ideal &lt; 7 dias).</li>
      <li><strong>UTI</strong> — falência orgânica, BISAP ≥ 3, lactato elevado, SIRS persistente.</li>
    </ol>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Lipase (preferível) · hemograma · creatinina · glicemia · Ca²⁺ · USG abdome</li>
      <li>TC abdome com contraste após 48–72 h se dúvida de necrose ou piora clínica</li>
    </ul>
    <p class="emerg-note">IAP/APA pancreatite 2022 · MS. Conteúdo educacional.</p>`,

  'apendicite-aguda': `
    <p class="muted">Apendicite aguda — dor periumbilical migrando para FID, McBurney, defesa. Escore de Alvarado/APP auxilia; cirurgia ou ATB + apendicectomia.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Diagnóstico</strong> — exame físico + USG (pediatria/gestante) ou TC abdome com contraste (adulto) se dúvida.</li>
      <li><strong>Jejum + acesso venoso</strong> — analgesia precoce (dipirona ± tramadol) — não atrasa diagnóstico.</li>
      <li><strong>ATB profilático pré-op</strong> — ceftriaxona 1 g IV + metronidazol 500 mg IV dose única <em>ou</em> cefazolina 2 g IV (ajustar ao protocolo cirúrgico).</li>
      <li><strong>Apendicectomia</strong> — laparoscópica preferencial; urgência se peritonite/perforação.</li>
      <li><strong>Apendicite complicada (abscesso/plastão)</strong> — ATB IV + drenagem percutânea ou cirurgia conforme imagem.</li>
      <li><strong>Excluir diferenciais</strong> — gestação ectópica (β-hCG), adenite mesentérica, gastroenterite, cólica renal.</li>
    </ol>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Hemograma (leucocitose) · PCR · β-hCG · urina I</li>
      <li>USG: apêndice não compressível &gt; 6 mm, gordura periapendicular</li>
    </ul>
    <p class="emerg-note">WSES apendicite · MS. Conteúdo educacional.</p>`,

  'colecistite-aguda': `
    <p class="muted">Colecistite aguda — dor HCD, Murphy+, febre, leucocitose. Tokyo Guidelines: leve, moderada ou grave (disfunção orgânica).</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Diagnóstico</strong> — USG: espessamento parietal, líquido perivesicular, cálculo impactado, Murphy ultrassonográfico.</li>
      <li><strong>Jejum + analgesia</strong> — dipirona; tramadol se necessário; antiemético (ondansetrona 4 mg EV).</li>
      <li><strong>ATB empírico</strong> — ceftriaxona 1 g IV 24/24 h + metronidazol 500 mg IV 8/8 h <em>ou</em> amoxicilina-clavulanato 875/125 mg VO 12/12 h se leve ambulatorial (Tokyo I).</li>
      <li><strong>Colecistectomia precoce</strong> — ideal em &lt; 72 h da admissão (Tokyo I–II); CPRE + colecistectomia tardia se coledocolitíase.</li>
      <li><strong>Grave (Tokyo III)</strong> — drenagem percutânea (colecistostomia) se alto risco cirúrgico + ATB + UTI.</li>
      <li><strong>Colangite associada</strong> — tríade de Charcot → ATB + descompressão biliar urgente (CPRE).</li>
    </ol>
    <h4>Exames / investigação</h4>
    <ul>
      <li>USG abdome · hemograma · PCR · bilirrubinas · TGO/TGP · amilase (excluir pancreatite)</li>
    </ul>
    <p class="emerg-note">Tokyo Guidelines 2018 · MS. Conteúdo educacional.</p>`,

  'chikungunya': `
    <p class="muted">Arbovirose — febre súbita, poliartralgia intensa simétrica, rash. Sem antiviral específico; manejo sintomático (evitar AINE precoce se dengue não descartada).</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Excluir dengue grave</strong> — prova do laço, plaquetas, hematócrito; se dengue possível → paracetamol apenas nas primeiras 48 h.</li>
      <li><strong>Analgesia</strong> — paracetamol 750 mg–1 g VO 6/6 h (máx. 3 g/dia); após exclusão de dengue: dipirona ou naproxeno 500 mg VO 12/12 h.</li>
      <li><strong>Artrite reativa</strong> — prednisona 20–40 mg VO/dia × 5–7 dias se artrite incapacitante (refratária a analgésicos).</li>
      <li><strong>Hidratação oral</strong> — repouso relativo.</li>
      <li><strong>Grupos de risco</strong> — idosos, comorbidades: observação prolongada.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Artralgia pode persistir meses — fisioterapia; hidroxicloroquina ou metotrexato se crônica (reumatologia).</li>
      <li>Notificação compulsória (SINAN).</li>
    </ul>
    <p class="emerg-note">MS/OPAS chikungunya · Evitar AAS/AINE se dengue não descartada. Conteúdo educacional.</p>`,

  'malaria': `
    <p class="muted">Malária — febre periódica, calafrios, sudorese em área endêmica ou viagem. Diagnóstico: gota espessa/Giemsa; tratar conforme espécie (<em>P. falciparum</em> = emergência).</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Diagnóstico urgente</strong> — gota espessa ou esfregaço: identificar espécie e parasitemia.</li>
      <li><strong>P. vivax / P. ovale / P. malariae (não complicada)</strong> — cloroquina VO esquema clássico + primaquina VO (7–14 dias) após G6PD normal — erradicar hipnozoítos.</li>
      <li><strong>P. falciparum (não complicada, Amazônia — resistência)</strong> — artemeter-lumefantrina (Coartem®) VO esquema MS <em>ou</em> artesunato + mefloquina conforme PCDT.</li>
      <li><strong>Malária grave</strong> — artesunato EV 2,4 mg/kg dose 0, 12 h e 24 h (disponível SUS) + internação UTI; suporte transfusional se hemólise.</li>
      <li><strong>Grávida</strong> — quinina + clindamicina (1º trimestre) ou artemeter-lumefantrina (2º/3º) conforme PCDT MS.</li>
    </ol>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Gota espessa (3 amostras) · hemograma · creatinina · glicemia · bilirrubinas · lactato se grave</li>
      <li>G6PD antes de primaquina</li>
    </ul>
    <p class="emerg-note">MS/PCDT malária 2024 · OMS. Notificação compulsória. Conteúdo educacional.</p>`,

  'epistaxe': `
    <p class="muted">Sangramento nasal — maioria anterior (plexo de Kiesselbach); posterior em idosos/hipertensos = maior gravidade.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Medidas iniciais</strong> — sentar, inclinar levemente para frente, compressão digital das narinas 10–15 min contínuos.</li>
      <li><strong>Epistaxe anterior persistente</strong> — cauterização química (nitrato de prata) ou elétrica após vasoconstritor tópico (oximetazolina spray ou lidocaína+fenilefrina).</li>
      <li><strong>Embolização/tamponamento</strong> — tamponamento anterior com Merocel/gaze; tamponamento posterior (Foley ou cânula) se suspeita posterior — ORL.</li>
      <li><strong>Instabilidade</strong> — 2 acessos venosos, hemograma, tipagem; transfusão se Hb &lt; 7 g/dL ou instabilidade hemodinâmica.</li>
      <li><strong>Controle de PA</strong> se hipertenso — captopril 25 mg VO ou anti-hipertensivo habitual.</li>
      <li><strong>Evitar</strong> — inclinar cabeça para trás (risco de aspiração).</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Hidratação nasal (soro fisiológico spray); evitar assoar nariz 48 h; umidificador ambiental.</li>
      <li>Investigar coagulopatia, anticoagulação, hipertensão ambulatorial.</li>
    </ul>
    <p class="emerg-note">AAO-HNS epistaxis. Conteúdo educacional.</p>`,

  'sincope': `
    <p class="muted">Perda transitória de consciência por hipoperfusão cerebral — excluir arritmia, SCA, TEP, hemorragia e causa neurológica antes de alta.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>ABC pós-recuperação</strong> — glicemia capilar; PA ortostática (deitado vs 3 min em pé); FC, SpO₂.</li>
      <li><strong>ECG obrigatório</strong> — BAV, QT longo, Brugada, HCM, FA, TVNS.</li>
      <li><strong>Sinais de alto risco (San Francisco/OESIL)</strong> — dispneia, hematócrito baixo, ECG anormal, PA sistólica &lt; 90, história IC/DAC → internar e investigar.</li>
      <li><strong>Exames dirigidos</strong> — hemograma; troponina se dor/ECG alterado; D-dímero se TEP; TC crânio se trauma ou déficit focal.</li>
      <li><strong>Síncope reflexa/vasovagal</strong> — hidratação oral; orientação (evitar longa permanência em pé, fatoras); alta se baixo risco e ECG normal.</li>
      <li><strong>Arritmia suspeita</strong> — monitor 24 h ou Holter ambulatorial; cardiology se BAV ou QT prolongado.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Orientar retorno se recorrência, palpitações, dor torácica ou síncope no esforço.</li>
      <li>Restrição de direção conforme legislação até investigação completa.</li>
    </ul>
    <p class="emerg-note">ESC síncope 2018 · SBC. Conteúdo educacional.</p>`,

  'abscesso-cutaneo': `
    <p class="muted">Abscesso cutâneo — coleção purulenta drenável; tratamento = incisão e drenagem (I&amp;D) + ATB se extensão/celulite/sistêmico.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Indicação de I&amp;D</strong> — abscesso fluctuante &gt; 2 cm; não usar ATB isolado sem drenagem.</li>
      <li><strong>Técnica</strong> — analgesia local (lidocaína 1–2%); incisão em cruz no ponto mais fluctuante; quebrar loculações com pinça; irrigar com SF; curativo absortivo; não fechar primariamente.</li>
      <li><strong>ATB VO/IV</strong> — indicado se: celulite extensa, imunossupressão, febre, lesão face/mãos/genitais, MRSA de risco: sulfametoxazol-trimetoprima 800/160 mg VO 12/12 h × 7 dias <em>ou</em> clindamicina 300 mg VO 6/6 h.</li>
      <li><strong>MRSA comunitário</strong> — comum no Brasil; SMX-TMP ou clindamicina cobrem maioria.</li>
      <li><strong>Complicações</strong> — fascite necrotizante (dor desproporcional) → cirurgia urgente.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Curativo 24/24 h; retorno em 48 h se piora ou febre.</li>
      <li>Não compartilhar toalhas/razor; higiene da lesão.</li>
    </ul>
    <p class="emerg-note">IDSA pele e partes moles · MS. Conteúdo educacional.</p>`,

  'profilaxia-antirrabica': `
    <p class="muted">Exposição a mamífero potencialmente rabioso — lavagem imediata do ferimento + profilaxia pós-exposição (PEP) conforme categoria MS.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Lavagem abundante</strong> — água e sabão 15 min + aplicar povidine ou álcool 70% (não fechar ferimento).</li>
      <li><strong>Categorizar exposição (MS)</strong> — I: toque/ lambedura pele íntegra → nada; II: pele leve sem sangue → vacina; III: sangramento/mucosa/lambedura pele lesada → vacina + soro.</li>
      <li><strong>Vacina antirrábica</strong> — esquema 4 doses (dias 0, 3, 7, 14) IM deltoide; imunossuprimido: 5 doses. Disponível SUS (Verorab®, Vaxrab®).</li>
      <li><strong>Soro antirrábico (categoria III)</strong> — imunoglobulina antirrábica humana (preferencial) infiltrar no ferimento + restante IM; <em>ou</em> soro antirrábico equino (SAE) conforme disponibilidade e protocolo local.</li>
      <li><strong>Observação animal</strong> — cão/gato saudável: observar 10 dias; se animal morrer/desaparecer → completar PEP.</li>
      <li><strong>Profilaxia tétano</strong> — atualizar vacina tétano se indicado.</li>
    </ol>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Não há teste rápido pré-sintomático útil — PEP baseada em exposição</li>
      <li>Notificação compulsória imediata (SINAN)</li>
    </ul>
    <p class="emerg-note">MS/PNI profilaxia antirrábica · OMS. PEP deve iniciar o mais cedo possível. Conteúdo educacional.</p>`,

  'eclampsia-pre-eclampsia': `
    <p class="muted">Pré-eclâmpsia — PA ≥ 140/90 após 20 sem + proteinúria ou sinais de gravidade. Eclâmpsia = convulsão na gestação/puerpério — emergência obstétrica.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Eclâmpsia (convulsão)</strong> — posicionar em decúbito lateral; O₂; sulfato de Mg 4 g EV (10%) em 5 min → infusão 1 g/h; diazepam 10 mg EV se convulsão persistente após Mg (2ª linha).</li>
      <li><strong>Controle de PA</strong> — hidralazina 5 mg EV q20 min (máx. 20 mg) <em>ou</em> labetalol 20 mg EV; meta PA 140–150/90–100 mmHg (não normalizar abruptamente).</li>
      <li><strong>Pré-eclâmpsia grave</strong> (PA ≥ 160/110, plaquetopenia, TGO/TGP ↑, oligúria, cefaleia, escotomas): sulfato de Mg profilático + internação + resolução da gestação conforme idade gestacional.</li>
      <li><strong>Monitorização</strong> — diurese, reflexos patelares (toxicidade Mg), SpO₂, PA q15 min.</li>
      <li><strong>Antídoto Mg</strong> — gluconato de cálcio 10% 10 mL EV se depressão respiratória/arritmia.</li>
      <li><strong>Obstetrícia urgente</strong> — interrupção da gestação é tratamento definitivo; corticoide fetal se &lt; 34 sem.</li>
    </ol>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Proteinúria (relacao ou 24 h) · hemograma · TGO/TGP · creatinina · ácido úrico · USG obstétrico</li>
    </ul>
    <p class="emerg-note">MS/FEbrasgo · ACOG pré-eclâmpsia. Conteúdo educacional.</p>`
};
