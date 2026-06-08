/* Pronto Socorro — conteúdo clínico (lote 5 — novas condições) */

const PS_CONTENT_5 = {
  'acidente-ofidico': `
    <p class="muted">Envenenamento por serpente — classificar gravidade (local, sistêmica, grave); soro antiofídico específico conforme espécie (Bothrops, Crotalus, Lachesis, Micrurus). Não fazer torniquete, incisão ou sucção.</p>
    <h4>Prescrições de pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>ABC</strong> — imobilizar membro abaixo do coração; remover anéis/pulseiras; marcar borda do edema a cada 30 min.</li>
      <li><strong>Classificação</strong> — leve (sem progressão sistêmica): observação 6–12 h; moderada/grave (edema progressivo, sangramento, hipotensão, neurotoxicidade, rabdomiólise): internar + soro.</li>
      <li><strong>Soro antiofídico (SUS/ANVISA)</strong> — dose conforme bula/MS (geralmente 4–12 ampolas EV diluídas em SF, titular conforme resposta)
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> Bothrops — Soro Antibotrópico (SAB); Lachesis — Soro Antibotrópico-Laquético (SABL); Crotalus — Soro Anticrotálico (SAC); Micrurus — Soro Antielapídico (SAE).</li>
          <li><strong>Alternativa:</strong> Bothrops + Lachesis (acidente misto) — SABL; Bothrops grave — escalar para 8–12 ampolas SAB conforme resposta clínica/laboratorial.</li>
          <li><strong>Alérgico:</strong> pré-medicação obrigatória (hidrocortisona 200 mg EV + anti-H1 EV) + infusão lenta do soro; observação em UTI 24 h.</li>
          <li><strong>Refractário:</strong> repetir dose de soro (4–12 ampolas) se TCT/TAP não normalizar em 24 h ou piora clínica; CEATOX.</li>
        </ul>
      </li>
      <li><strong>Bothrops (mais comum)</strong> — SF 20 mL/kg se hipovolemia; monitorar coagulograma, creatinina, CPK, Hb.
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> dipirona 1 g EV/IM 6/6h (evitar AINE precoce se sangramento).</li>
          <li><strong>Alternativa:</strong> paracetamol 1 g EV 6/6h.</li>
          <li><strong>Alérgico:</strong> paracetamol EV/VO.</li>
          <li><strong>Refractário:</strong> tramadol 50–100 mg EV 6/6h; morfina 2–5 mg EV se dor intensa (após estabilização hemodinâmica).</li>
        </ul>
      </li>
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
    <h4>Prescrições de pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>ABC + isolamento</strong> — O₂, acesso venoso; profilaxia de contactantes (rifampicina, ciprofloxacino ou ceftriaxona conforme agente).</li>
      <li><strong>ATB empírico adulto (&gt; 18 anos)</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> ceftriaxona 2 g IV 12/12 h + dexametasona 10 mg IV 6/6 h × 4 dias (iniciar antes ou com 1ª dose de ATB se pneumococo suspeito).</li>
          <li><strong>Alternativa:</strong> cefotaxima 2 g IV 6/6 h + dexametasona 10 mg IV 6/6 h × 4 dias.</li>
          <li><strong>Alérgico:</strong> meropenem 2 g IV 8/8 h + dexametasona (alergia grave a cefalosporina) + vancomicina se MRSA.</li>
          <li><strong>Refractário:</strong> associar vancomicina 15–20 mg/kg IV 12/12 h + ampicilina 2 g IV 4/4 h (Listeria, &gt; 50 anos, imunossupressão, neurocirurgia).</li>
        </ul>
      </li>
      <li><strong>Cobertura ampliada</strong> (imunossupressão, &gt; 50 anos, neurocirurgia, Listeria)
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> ceftriaxona 2 g IV 12/12 h + vancomicina 15–20 mg/kg IV 12/12 h + ampicilina 2 g IV 4/4 h + dexametasona.</li>
          <li><strong>Alternativa:</strong> meropenem 2 g IV 8/8 h + vancomicina + ampicilina + dexametasona.</li>
          <li><strong>Alérgico:</strong> meropenem + vancomicina + trimetoprima-sulfametoxazol 5 mg/kg IV 6/6 h (Listeria — alternativa à ampicilina).</li>
          <li><strong>Refractário:</strong> ajustar conforme Gram/cultura LCR; aciclovir EV se encefalite viral suspeita.</li>
        </ul>
      </li>
      <li><strong>Contato meningocócica</strong> — notificação compulsória; quimioprofilaxia contactantes
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> rifampicina 600 mg VO 12/12 h × 2 dias.</li>
          <li><strong>Alternativa:</strong> ciprofloxacino 500 mg VO dose única.</li>
          <li><strong>Alérgico:</strong> ceftriaxona 250 mg IM dose única.</li>
          <li><strong>Refractário:</strong> repetir rifampicina se novo contato; vacinar contactantes não vacinados.</li>
        </ul>
      </li>
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
    <h4>Prescrições de pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>ABC</strong> — O₂ alvo SpO₂ &gt; 90%; acesso venoso; monitor.</li>
      <li><strong>Diagnóstico</strong> — angioTC tórax (1ª linha) ou escintilografia V/Q se contraindicação ao contraste; D-dímero se baixa probabilidade (Wells).</li>
      <li><strong>Anticoagulação imediata</strong> (se confirmado ou alta suspeita)
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> enoxaparina 1 mg/kg SC 12/12 h (máx. 100 mg/dose).</li>
          <li><strong>Alternativa:</strong> heparina não fracionada 80 U/kg bolus + 18 U/kg/h (ajustar TTPa).</li>
          <li><strong>Alérgico:</strong> rivaroxabana 15 mg VO 12/12 h × 21 dias (se estável, sem contraindicação).</li>
          <li><strong>Refractário:</strong> fondaparinux 5–10 mg SC 24/24 h (se HIT suspeita) — hematologia.</li>
        </ul>
      </li>
      <li><strong>TEP de alto risco (choque/hipotensão)</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> alteplase 100 mg EV em 2 h (trombólise sistêmica).</li>
          <li><strong>Alternativa:</strong> tenecteplase dose por peso EV bolus (mais rápido).</li>
          <li><strong>Alérgico:</strong> embolectomia por cateter ou cirúrgica (se contraindicação absoluta à trombólise).</li>
          <li><strong>Refractário:</strong> noradrenalina EV + repetir trombólise ou embolectomia; ECMO se disponível.</li>
        </ul>
      </li>
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
    <h4>Prescrições de pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Probabilidade clínica</strong> — escore de Wells; D-dímero se baixa/intermediária probabilidade (exclui se normal e baixa).</li>
      <li><strong>Diagnóstico</strong> — USG Doppler venoso de MMII (exame de escolha); se indisponível e alta suspeita → anticoagular empiricamente e repetir USG.</li>
      <li><strong>Anticoagulação</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> enoxaparina 1 mg/kg SC 12/12 h (mín. 3 meses).</li>
          <li><strong>Alternativa:</strong> rivaroxabana 15 mg VO 12/12 h × 21 dias → 20 mg/dia (monoterapia DOAC).</li>
          <li><strong>Alérgico:</strong> apixabana 10 mg VO 12/12 h × 7 dias → 5 mg 12/12 h (DOAC alternativo).</li>
          <li><strong>Refractário:</strong> varfarina + heparina sobreposição (alvo INR 2–3) se falha/recorrência em DOAC.</li>
        </ul>
      </li>
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
    <h4>Prescrições de pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>ABC</strong> — jejum inicial; SNG se vômitos incoercíveis.
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> dipirona 1 g EV 6/6h + tramadol 50–100 mg EV 6/6h se dor moderada.</li>
          <li><strong>Alternativa:</strong> paracetamol 1 g EV 6/6h + tramadol 50 mg EV 6/6h.</li>
          <li><strong>Alérgico:</strong> paracetamol 1 g EV 6/6h + morfina 2 mg EV titulada.</li>
          <li><strong>Refractário:</strong> morfina 2–5 mg EV titulada ou fentanil EV em UTI; bloqueio peridural se disponível.</li>
        </ul>
      </li>
      <li><strong>Hidratação agressiva</strong> — SF 0,9% 5–10 mL/kg/h nas primeiras 12–24 h (reavaliar volemia, diurese, lactato); cautela em cardiopata/idoso.</li>
      <li><strong>Investigar etiologia</strong> — litíase biliar (USG abdome), álcool, triglicerídeos, medicamentos, hipercalcemia.</li>
      <li><strong>Antibiótico</strong> — <strong>não profilático</strong>; usar só se infecção documentada (necrose infectada, colangite).</li>
      <li><strong>Colangite associada</strong> (ATB + CPRE urgente)
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> ceftriaxona 1 g IV 24/24 h + metronidazol 500 mg IV 8/8 h.</li>
          <li><strong>Alternativa:</strong> piperacilina-tazobactam 4,5 g IV 6/6 h.</li>
          <li><strong>Alérgico:</strong> ciprofloxacino 400 mg IV 12/12 h + metronidazol 500 mg IV 8/8 h.</li>
          <li><strong>Refractário:</strong> meropenem 1 g IV 8/8 h + CPRE urgente; drenagem biliar.</li>
        </ul>
      </li>
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
    <h4>Prescrições de pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Diagnóstico</strong> — exame físico + USG (pediatria/gestante) ou TC abdome com contraste (adulto) se dúvida.</li>
      <li><strong>Jejum + acesso venoso</strong> — analgesia precoce (dipirona ± tramadol) — não atrasa diagnóstico.</li>
      <li><strong>ATB profilático pré-op</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> ceftriaxona 1 g IV + metronidazol 500 mg IV dose única.</li>
          <li><strong>Alternativa:</strong> cefazolina 2 g IV dose única (protocolo cirúrgico local).</li>
          <li><strong>Alérgico:</strong> clindamicina 600 mg IV + gentamicina 5 mg/kg IV dose única.</li>
          <li><strong>Refractário:</strong> apendicite complicada (abscesso/peritonite) — ceftriaxona 1 g IV 24/24 h + metronidazol 500 mg IV 8/8 h · 5–7 dias.</li>
        </ul>
      </li>
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
    <h4>Prescrições de pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Diagnóstico</strong> — USG: espessamento parietal, líquido perivesicular, cálculo impactado, Murphy ultrassonográfico.</li>
      <li><strong>Jejum + analgesia</strong> — dipirona; tramadol se necessário; antiemético (ondansetrona 4 mg EV).</li>
      <li><strong>ATB empírico</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> ceftriaxona 1 g IV 24/24 h + metronidazol 500 mg IV 8/8 h (Tokyo II–III).</li>
          <li><strong>Alternativa:</strong> amoxicilina-clavulanato 875/125 mg VO 12/12 h (Tokyo I leve ambulatorial).</li>
          <li><strong>Alérgico:</strong> ciprofloxacino 500 mg VO 12/12 h + metronidazol 500 mg VO 8/8 h · 7 dias.</li>
          <li><strong>Refractário:</strong> piperacilina-tazobactam 4,5 g IV 6/6 h; colecistostomia se Tokyo III.</li>
        </ul>
      </li>
      <li><strong>Colecistectomia precoce</strong> — ideal em &lt; 72 h da admissão (Tokyo I–II); CPRE + colecistectomia tardia se coledocolitíase.</li>
      <li><strong>Grave (Tokyo III)</strong> — drenagem percutânea (colecistostomia) se alto risco cirúrgico + ATB + UTI.</li>
      <li><strong>Colangite associada</strong> — tríade de Charcot → ATB + descompressão biliar urgente (CPRE).</li>
    </ol>
    <h4>Exames / investigação</h4>
    <ul>
      <li>USG abdome · hemograma · PCR · bilirrubinas · TGO/TGP · amilase (excluir pancreatite)</li>
    </ul>
    <p class="emerg-note">Tokyo Guidelines 2018 · MS. Conteúdo educacional.</p>`,

  'diverticulite': `
    <p class="muted">Diverticulite aguda — inflamação/perforação de divertículo colônico (geralmente sigmoide). Classificar gravidade (Hinchey / WSES) para definir ATB, drenagem ou cirurgia.</p>
    <ul class="ps-med-options">
      <li><strong>Sem complicação (leve):</strong> ambulatorial possível — dieta líquida + ATB VO 7–10 dias se comorbidade/febre/leucocitose.</li>
      <li><strong>Complicada Hinchey I–II:</strong> internação + ATB IV ± drenagem percutânea de abscesso ≥ 3–4 cm.</li>
      <li><strong>Hinchey III–IV:</strong> cirurgia de urgência (peritonite purulenta/fecal) + ATB de amplo espectro.</li>
    </ul>
    <h4>Classificação de Hinchey (complicada)</h4>
    <ul>
      <li><strong>Hinchey I</strong> — abscesso/flegmão pericólico ou mesentérico (confinado)</li>
      <li><strong>Hinchey II</strong> — abscesso pélvico ou à distância (retroperitoneal/intra-abdominal)</li>
      <li><strong>Hinchey III</strong> — peritonite purulenta generalizada</li>
      <li><strong>Hinchey IV</strong> — peritonite fecal generalizada</li>
    </ul>
    <p class="muted">Critérios de internação: idade &gt; 70 anos, comorbidades, imunossupressão, dor intensa, febre, leucocitose marcada, intolerância oral, falha ambulatorial, suspeita de complicação.</p>
    <h4>Prescrições de pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>ABC + jejum</strong> — acesso venoso; analgesia precoce:
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> dipirona 1 g EV/IM 6/6 h</li>
          <li><strong>Alternativa:</strong> tramadol 50–100 mg EV lento se dor moderada-grave</li>
          <li><strong>Alérgico / contraindicação:</strong> paracetamol 1 g EV/VO 6/6 h; morfina 2–5 mg EV titulada se dor intensa</li>
        </ul>
      </li>
      <li><strong>Diagnóstico</strong> — TC abdome com contraste IV (exame de escolha): espessamento de parede, inflamação pericólica, abscesso, ar livre. USG se gestante/jovem. Hemograma, PCR, creatinina.</li>
      <li><strong>Diverticulite não complicada (ambulatorial)</strong> — ATB VO 7–10 dias + dieta líquida progressiva:
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> amoxicilina-clavulanato 875/125 mg VO 12/12 h (Clavulin®)</li>
          <li><strong>Alternativa / resistência:</strong> ciprofloxacino 500 mg VO 12/12 h + metronidazol 500 mg VO 8/8 h</li>
          <li><strong>Alérgico à penicilina:</strong> ciprofloxacino 500 mg VO 12/12 h + metronidazol 500 mg VO 8/8 h · 7–10 dias</li>
          <li><strong>Refractário:</strong> internar e migrar para ATB IV (ver abaixo)</li>
        </ul>
      </li>
      <li><strong>Diverticulite complicada — internação + ATB IV</strong> (mínimo 7–10 dias, estender conforme resposta):
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> ceftriaxona 1 g IV 24/24 h + metronidazol 500 mg IV 8/8 h</li>
          <li><strong>Alternativa:</strong> amoxicilina-clavulanato 875/125 mg VO 12/12 h se estável e tolerando VO (casos leves complicados)</li>
          <li><strong>Alérgico:</strong> ciprofloxacino 400 mg IV 12/12 h + metronidazol 500 mg IV 8/8 h</li>
          <li><strong>Refractário / grave (Hinchey III–IV, sepse):</strong> piperacilina-tazobactam 4,5 g IV 6/6 h ou meropenem 1 g IV 8/8 h + metronidazol; cirurgia urgente se peritonite</li>
        </ul>
      </li>
      <li><strong>Hinchey I–II (abscesso)</strong> — ATB IV; drenagem percutânea guiada por TC se abscesso ≥ 3–4 cm ou falha clínica em 48–72 h; colonoscopia eletiva após 6–8 semanas (excluir neoplasia).</li>
      <li><strong>Hinchey III–IV</strong> — laparotomia/laparoscopia (retossigmoidectomia com anastomose ou Hartmann conforme contaminação); ATB de amplo espectro; UTI se choque séptico.</li>
      <li><strong>Evitar</strong> — laxantes, enema, colonoscopia na fase aguda; AAS/AINE não contraindicam ATB agudo mas preferir analgesia sem AINE se possível.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Dieta rica em fibras após resolução aguda (progressiva); hidratação; atividade física.</li>
      <li>Colonoscopia 6–8 semanas após primeiro episício ou complicado (rastreio de CCR).</li>
      <li>Profilaxia de recorrência: mesalazina 2–4 g/dia (evidência moderada) ou rifaximina 400 mg 12/12 h por 7 dias/mês — discutir com gastroenterologia.</li>
      <li>Retorno imediato se febre, piora da dor, distensão, vômitos ou sangramento.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>TC abdome com contraste — sensibilidade alta para diverticulite e complicações</li>
      <li>Hemograma · PCR/VHS · creatinina · lactato se sepse</li>
      <li>Hemoculturas se febre alta ou instabilidade</li>
    </ul>
    <p class="emerg-note">WSES diverticulitis 2020 · ACG · SBCP. Hinchey orienta drenagem/cirurgia. Conteúdo educacional — não substitui julgamento clínico.</p>`,

  'chikungunya': `
    <p class="muted">Arbovirose — febre súbita, poliartralgia intensa simétrica, rash. Sem antiviral específico; manejo sintomático (evitar AINE precoce se dengue não descartada).</p>
    <h4>Prescrições de pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Excluir dengue grave</strong> — prova do laço, plaquetas, hematócrito; se dengue possível → paracetamol apenas nas primeiras 48 h.</li>
      <li><strong>Analgesia</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> paracetamol 750 mg–1 g VO 6/6 h (máx. 3 g/dia) — sempre nas primeiras 48 h (dengue não descartada).</li>
          <li><strong>Alternativa:</strong> dipirona 1 g VO 6/6 h (após exclusão de dengue).</li>
          <li><strong>Alérgico:</strong> paracetamol VO (evitar AINE/AAS se dengue possível).</li>
          <li><strong>Refractário:</strong> naproxeno 500 mg VO 12/12 h + prednisona 20 mg VO 24/24 h · 5 dias se artrite incapacitante.</li>
        </ul>
      </li>
      <li><strong>Artrite reativa</strong> (refratária a analgésicos)
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> prednisona 20–40 mg VO 24/24 h · 5–7 dias.</li>
          <li><strong>Alternativa:</strong> prednisolona 30 mg VO 24/24 h · 5 dias.</li>
          <li><strong>Alérgico:</strong> naproxeno 500 mg VO 12/12 h (se sem contraindicação e dengue descartada).</li>
          <li><strong>Refractário:</strong> hidroxicloroquina 400 mg VO 24/24 h (artrite crônica — reumatologia).</li>
        </ul>
      </li>
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
    <h4>Prescrições de pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Diagnóstico urgente</strong> — gota espessa ou esfregaço: identificar espécie e parasitemia.</li>
      <li><strong>P. vivax / P. ovale / P. malariae (não complicada)</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> cloroquina VO esquema clássico MS + primaquina VO 7–14 dias (após G6PD normal).</li>
          <li><strong>Alternativa:</strong> cloroquina VO + primaquina 0,5 mg/kg VO 24/24 h · 14 dias.</li>
          <li><strong>Alérgico:</strong> atovaquona-proguanil VO (Malarone®) se contraindicação a cloroquina — consultar infectologia.</li>
          <li><strong>Refractário:</strong> repetir esquema conforme PCDT MS; investigar adesão e resistência.</li>
        </ul>
      </li>
      <li><strong>P. falciparum (não complicada, Amazônia)</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> artemeter-lumefantrina (Coartem®) VO esquema MS · 3 dias.</li>
          <li><strong>Alternativa:</strong> artesunato + mefloquina VO conforme PCDT MS.</li>
          <li><strong>Alérgico:</strong> quinina VO + doxiciclina VO · 7 dias (adulto) — infectologia.</li>
          <li><strong>Refractário:</strong> artesunato EV + internação; repetir esquema se recaída em 28 dias.</li>
        </ul>
      </li>
      <li><strong>Malária grave</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> artesunato EV 2,4 mg/kg dose 0, 12 h e 24 h (disponível SUS) + internação UTI.</li>
          <li><strong>Alternativa:</strong> artemeter EV 2,4 mg/kg dose 0, 12 h e 24 h.</li>
          <li><strong>Alérgico:</strong> quinina EV em infusão (monitorizar QT) + doxiciclina VO.</li>
          <li><strong>Refractário:</strong> artesunato EV + transfusão se hemólise; diálise se IRA; troca de esquema conforme PCDT.</li>
        </ul>
      </li>
      <li><strong>Grávida</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> 1º trimestre — quinina VO + clindamicina VO; 2º/3º trimestre — artemeter-lumefantrina (Coartem®) conforme PCDT MS.</li>
          <li><strong>Alternativa:</strong> quinina EV + clindamicina EV se grave em qualquer trimestre.</li>
          <li><strong>Alérgico:</strong> artesunato EV + clindamicina (malária grave gestante — infectologia).</li>
          <li><strong>Refractário:</strong> internação UTI + artesunato EV; evitar primaquina na gestação.</li>
        </ul>
      </li>
    </ol>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Gota espessa (3 amostras) · hemograma · creatinina · glicemia · bilirrubinas · lactato se grave</li>
      <li>G6PD antes de primaquina</li>
    </ul>
    <p class="emerg-note">MS/PCDT malária 2024 · OMS. Notificação compulsória. Conteúdo educacional.</p>`,

  'epistaxe': `
    <p class="muted">Sangramento nasal — maioria anterior (plexo de Kiesselbach); posterior em idosos/hipertensos = maior gravidade.</p>
    <h4>Prescrições de pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Medidas iniciais</strong> — sentar, inclinar levemente para frente, compressão digital das narinas 10–15 min contínuos.</li>
      <li><strong>Epistaxe anterior persistente</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> oximetazolina 0,05% spray nasal + compressão digital 10–15 min; cauterização com nitrato de prata se persiste.</li>
          <li><strong>Alternativa:</strong> lidocaína 2% + fenilefrina 0,25% tópica + cauterização elétrica.</li>
          <li><strong>Alérgico:</strong> ácido tranexâmico 500 mg VO 8/8h · 3 dias (epistaxe recorrente em anticoagulado) + tamponamento.</li>
          <li><strong>Refractário:</strong> tamponamento anterior (Merocel®) ou posterior (Foley) — ORL; embolização se recorrente.</li>
        </ul>
      </li>
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
    <h4>Prescrições de pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>ABC pós-recuperação</strong> — glicemia capilar; PA ortostática (deitado vs 3 min em pé); FC, SpO₂.</li>
      <li><strong>ECG obrigatório</strong> — BAV, QT longo, Brugada, HCM, FA, TVNS.</li>
      <li><strong>Sinais de alto risco (San Francisco/OESIL)</strong> — dispneia, hematócrito baixo, ECG anormal, PA sistólica &lt; 90, história IC/DAC → internar e investigar.</li>
      <li><strong>Exames dirigidos</strong> — hemograma; troponina se dor/ECG alterado; D-dímero se TEP; TC crânio se trauma ou déficit focal.</li>
      <li><strong>Síncope reflexa/vasovagal</strong> (baixo risco, ECG normal)
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> hidratação oral abundante + orientação postural (evitar longa permanência em pé).</li>
          <li><strong>Alternativa:</strong> SF 0,9% 500 mL EV se desidratação associada.</li>
          <li><strong>Alérgico:</strong> hidratação oral (sem fármaco específico para vasovagal).</li>
          <li><strong>Refractário:</strong> fludrocortisona 0,1 mg VO 24/24 h ou midodrina 2,5 mg VO 8/8 h (síncope recorrente — ambulatorial).</li>
        </ul>
      </li>
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
    <h4>Prescrições de pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Indicação de I&amp;D</strong> — abscesso fluctuante &gt; 2 cm; não usar ATB isolado sem drenagem.</li>
      <li><strong>Técnica</strong> — analgesia local (lidocaína 1–2%); incisão em cruz no ponto mais fluctuante; quebrar loculações com pinça; irrigar com SF; curativo absortivo; não fechar primariamente.</li>
      <li><strong>ATB VO/IV</strong> (celulite extensa, imunossupressão, febre, face/mãos/genitais, MRSA de risco)
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> sulfametoxazol-trimetoprima 800/160 mg VO 12/12 h · 7 dias (MRSA comunitário — Brasil).</li>
          <li><strong>Alternativa:</strong> clindamicina 300 mg VO 6/6 h · 7 dias.</li>
          <li><strong>Alérgico:</strong> clindamicina 300 mg VO 6/6 h · 7 dias (alergia a sulfa).</li>
          <li><strong>Refractário:</strong> clindamicina 600 mg IV 8/8 h + I&amp;D repetido; cultura se falha em 48 h.</li>
        </ul>
      </li>
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
    <h4>Prescrições de pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Lavagem abundante</strong> — água e sabão 15 min + aplicar povidine ou álcool 70% (não fechar ferimento).</li>
      <li><strong>Categorizar exposição (MS)</strong> — I: toque/ lambedura pele íntegra → nada; II: pele leve sem sangue → vacina; III: sangramento/mucosa/lambedura pele lesada → vacina + soro.</li>
      <li><strong>Vacina antirrábica</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> Verorab® ou Vaxrab® — esquema 4 doses IM deltoide (dias 0, 3, 7, 14).</li>
          <li><strong>Alternativa:</strong> esquema Zagreb 2-1-1 (dias 0, 7, 21) — conforme protocolo local MS.</li>
          <li><strong>Alérgico:</strong> vacina de células Vero purificada (Verorab®) com observação 30 min pós-dose.</li>
          <li><strong>Refractário:</strong> imunossuprimido — 5 doses (dias 0, 3, 7, 14, 28); sorologia pós-vacinação.</li>
        </ul>
      </li>
      <li><strong>Soro antirrábico (categoria III)</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> imunoglobulina antirrábica humana (preferencial SUS) — infiltrar no ferimento + restante IM.</li>
          <li><strong>Alternativa:</strong> soro antirrábico equino (SAE) EV conforme protocolo local (pré-teste de sensibilidade).</li>
          <li><strong>Alérgico:</strong> imunoglobulina humana (menor reação); SAE com pré-medicação (corticoide + anti-H1) se única opção.</li>
          <li><strong>Refractário:</strong> completar esquema vacinal 4 doses mesmo se atraso; não interromper PEP.</li>
        </ul>
      </li>
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
    <h4>Prescrições de pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Eclâmpsia (convulsão)</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> sulfato de Mg 4 g EV (10%) em 5 min → infusão 1 g/h + O₂ + decúbito lateral.</li>
          <li><strong>Alternativa:</strong> sulfato de Mg 5 g IM (50%) dose de ataque se acesso EV difícil.</li>
          <li><strong>Alérgico:</strong> diazepam 10 mg EV lento (2ª linha se Mg indisponível — menos eficaz que Mg).</li>
          <li><strong>Refractário:</strong> diazepam 10 mg EV se convulsão persistente após Mg + gluconato de cálcio 10% 10 mL EV se toxicidade Mg.</li>
        </ul>
      </li>
      <li><strong>Controle de PA</strong> (meta 140–150/90–100 mmHg — não normalizar abruptamente)
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> hidralazina 5 mg EV a cada 20 min (máx. 20 mg).</li>
          <li><strong>Alternativa:</strong> labetalol 20 mg EV bolus (repetir até 300 mg/dia).</li>
          <li><strong>Alérgico:</strong> nifedipina 10 mg VO (cápsula mordida) — uso controverso; preferir hidralazina EV.</li>
          <li><strong>Refractário:</strong> nitroprussiato de sódio EV em infusão (UTI) se encefalopatia hipertensiva.</li>
        </ul>
      </li>
      <li><strong>Pré-eclâmpsia grave</strong> (PA ≥ 160/110, plaquetopenia, TGO/TGP ↑, oligúria, cefaleia, escotomas)
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> sulfato de Mg 4 g EV ataque → 1 g/h infusão profilática + hidralazina EV para PA.</li>
          <li><strong>Alternativa:</strong> sulfato de Mg IM 5 g a cada 4 h (se acesso EV indisponível).</li>
          <li><strong>Alérgico:</strong> labetalol EV para PA (sem Mg se miastenia — raro); monitorização intensiva.</li>
          <li><strong>Refractário:</strong> resolução da gestação (interrupção) + UTI; gluconato de cálcio 10% 10 mL EV se toxicidade Mg.</li>
        </ul>
      </li>
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
