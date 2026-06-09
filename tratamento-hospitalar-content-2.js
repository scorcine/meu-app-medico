/* Tratamento hospitalar — posologias IM/EV (lote 2 — novas condições) */

const TH_CONTENT_2 = {
  'edema-pulmao-ic': `
    <p class="muted">Edema agudo de pulmão / IC descompensada — O₂, diurético EV, vasodilatador; monitorizar diurese e SpO₂.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> furosemida 40–80 mg EV bolus (repetir 40 mg a cada 2 h se necessário) · O₂ · posição sentada</li>
      <li><strong>Vasodilatador:</strong> nitroglicerina EV contínua (titular PA) · nitroglicerina 0,4 mg SL × 3 · isossorbida 5 mg SL</li>
      <li><strong>Analgésico / dispneia:</strong> morfina 2–4 mg EV lento titulada · dipirona 1 amp EV (se morfina contraindicada)</li>
      <li><strong>Alternativa diurético:</strong> furosemida 160 mg EV dose única (refractário) · tiazídico VO após estabilização</li>
      <li><strong>Refractário / choque cardiogênico:</strong> dobutamina EV contínua · noradrenalina EV · VNI/intubação · UTI</li>
    </ul>
    <p class="emerg-note">Evitar AINE e betabloqueador na fase aguda descompensada. Conteúdo educacional.</p>`,

  'disturbios-eletroliticos': `
    <p class="muted">Distúrbios hidroeletrolíticos sintomáticos — corrigir conforme ECG, neurológico e função renal.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>Hipocalemia sintomática (K+ &lt; 2,5 ou arritmia):</strong> KCl 10–20 mEq EV em SF 100 mL em 1 h (máx. 20 mEq/h periférico) · repetir conforme K+</li>
      <li><strong>Hipercalemia com alteração ECG:</strong> gluconato de cálcio 10% 10 mL EV lento (1–3 min) · insulina regular 10 U EV + glicose 50% 40 mL · furosemida 40 mg EV · bicarbonato EV se acidose</li>
      <li><strong>Hiponatremia sintomática (convulsão):</strong> NaCl 3% 100–150 mL EV em 10–20 min (máx. 4–6 mL/kg/24 h) · monitorizar Na+ seriado</li>
      <li><strong>Hipocalcemia sintomática (tetania):</strong> gluconato de cálcio 10% 10 mL EV lento · repetir · magnésio 2 g EV se hipomagnesemia associada</li>
      <li><strong>Hipomagnesemia:</strong> sulfato de magnésio 2 g/10 mL EV em 20 min · manutenção conforme Mg²+ sérico</li>
    </ul>`,

  'pre-eclampsia-eclampsia': `
    <p class="muted">Pré-eclâmpsia grave / eclâmpsia — sulfato de magnésio EV + controle PA + resolução da gestação.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha (eclâmpsia / profilaxia convulsão):</strong> sulfato de magnésio 4 g EV (20% 20 mL) em 5–10 min + 1 g/h EV contínua (ou 5 g IM a cada 4 h se sem bomba)</li>
      <li><strong>Controle PA (PA ≥ 160/110):</strong> hidralazina 5 mg EV lento a cada 20 min (máx. 20 mg) · labetalol 20 mg EV lento (titular) · nifedipino 10 mg VO (urgência sem LOA)</li>
      <li><strong>Alternativa PA:</strong> nicardipina EV contínua (UTI) · metildopa 500 mg VO (pré-eclâmpsia leve — enfermaria)</li>
      <li><strong>Convulsão persistente:</strong> diazepam 5–10 mg EV lento (adjuvante — MgSO₄ é base) · repetir sulfato magnésio 2 g EV se níveis baixos</li>
      <li><strong>Refractário:</strong> fenitoína 1 g EV (2ª linha convulsão) · interrupção gestação · UTI neonatal</li>
    </ul>
    <p class="emerg-note">Antídoto MgSO₄: gluconato de cálcio 10% 10 mL EV se depressão respiratória. Conteúdo educacional.</p>`,

  'meningite-bacteriana': `
    <p class="muted">Meningite bacteriana — ATB EV em ≤ 30 min; dexametasona antes ou com 1ª dose se pneumococo suspeito.</p>
    <h4>Medicação IM / EV — ATB</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha (&gt; 18 anos):</strong> ceftriaxona 2 amp (2 g) EV 12/12 h + dexametasona 10 mg EV 6/6 h × 4 dias</li>
      <li><strong>Alternativa:</strong> cefotaxima 2 g EV 6/6 h + dexametasona 10 mg EV 6/6 h × 4 dias</li>
      <li><strong>Imunossupressão / &gt; 50 anos / neurocirurgia:</strong> ceftriaxona 2 g EV 12/12 h + vancomicina 15–20 mg/kg EV 12/12 h + ampicilina 2 g EV 4/4 h (Listeria)</li>
      <li><strong>Alérgico grave:</strong> meropenem 2 g EV 8/8 h + vancomicina EV + dexametasona</li>
    </ul>
    <h4>Sintomáticos IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>Febre/dor:</strong> dipirona 1 amp EV 6/6 h · paracetamol 1 g EV 6/6 h</li>
      <li><strong>Náusea:</strong> ondansetrona 1 amp IM ou EV · metoclopramida 1 amp EV</li>
      <li><strong>Refractário / edema cerebral:</strong> manitol 20% 0,5–1 g/kg EV (neurocirurgia) · dexametasona já indicada</li>
    </ul>`,

  'crise-tireotoxica': `
    <p class="muted">Crise tireotóxica / tempestade tiroidiana — betabloqueador + tionamida + iodo + corticoide EV.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> propranolol 40–80 mg VO 6/6 h ou 1 mg EV lento (titular FC) · tiamazol 20–40 mg VO 6/6 h (ou propiltiouracila 200 mg VO 4/4 h)</li>
      <li><strong>Corticoide:</strong> hidrocortisona 100 mg EV 8/8 h · dexametasona 1 amp (4 mg) EV 6/6 h · metilprednisolona 125 mg EV</li>
      <li><strong>Iodo (1 h após tionamida):</strong> solução de Lugol 10 gotas VO 8/8 h · ou iodeto de potássio VO</li>
      <li><strong>Alternativa betabloqueador:</strong> esmolol EV contínuo (UTI) · metoprolol 5 mg EV lento · propranolol VO se estável</li>
      <li><strong>Refractário:</strong> plasmapherese (endocrinologia) · dipirona 1 amp EV · paracetamol 1 g EV (febre)</li>
    </ul>`,

  'anemia-falciforme': `
    <p class="muted">Crise álgica da anemia falciforme — hidratação EV, analgesia escalonada, O₂; investigar sequestro/esplênico.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> dipirona 1 amp (1 g/2 mL) IM ou EV 6/6 h · hidratação SF 0,9% ou SG 5% EV (manutenção 1,5× basal)</li>
      <li><strong>AINE (escolher 1):</strong> cetoprofeno 1 amp IM · ketorolaco 30 mg IM ou EV lento · diclofenaco 1 amp IM (se função renal OK)</li>
      <li><strong>Dor moderada-grave:</strong> tramadol 1 amp IM ou EV lento 6/6 h · morfina 2–4 mg EV lento titulada (protocolo opioides precoce se dor intensa)</li>
      <li><strong>Corticoide (sequestração esplênica / aplasia):</strong> prednisolona 1 mg/kg VO · hidrocortisona 100 mg EV (crise grave)</li>
      <li><strong>Refractário:</strong> morfina EV contínua (PCA) · transfusão conforme Hb/alvo · oxigenoterapia se SpO₂ &lt; 95%</li>
    </ul>`,

  'leptospirose': `
    <p class="muted">Leptospirose — forma icterohemorrágica (Weil): ATB EV precoce + suporte; tetraciclina VO se forma leve.</p>
    <h4>Medicação IM / EV — ATB</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha (grave / internado):</strong> penicilina cristalina 1,5 milhão UI EV 6/6 h · ou ceftriaxona 1 amp (1 g) IM ou EV 24/24 h</li>
      <li><strong>Alternativa:</strong> cefotaxima 1 g EV 6/6 h · ampicilina 1 g EV 6/6 h (gestante — preferir)</li>
      <li><strong>Forma leve (ambulatorial):</strong> doxiciclina 100 mg VO 12/12 h × 7 dias · azitromicina 500 mg VO 24/24 h</li>
      <li><strong>Refractário / IRA:</strong> ceftriaxona 2 g EV 24/24 h · diálise se indicada</li>
    </ul>
    <h4>Sintomáticos IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>Febre/mialgia:</strong> dipirona 1 amp IM ou EV 6/6 h · paracetamol 1 g EV · cetoprofeno 1 amp IM</li>
      <li><strong>Náusea:</strong> ondansetrona 1 amp IM ou EV · metoclopramida 1 amp EV</li>
      <li><strong>Hidratação:</strong> SF 0,9% ou Ringer lactato EV — expansão se hipovolemia</li>
    </ul>`,

  'abstinencia-alcool': `
    <p class="muted">Abstinência alcoólica / delirium tremens — tiamina antes de glicose; benzodiazepínico EV/IM titulado.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> tiamina 300 mg IM ou EV 8/8 h × 3 dias (antes de glicose!) · diazepam 10 mg EV lento titulado (CIWA-Ar) · ou midazolam 5 mg IM/EV</li>
      <li><strong>Benzodiazepínicos alternativos:</strong> lorazepam 2–4 mg EV lento · clonazepam 1 mg VO/SL · diazepam 10 mg VO se colaborativo</li>
      <li><strong>Adjuvantes:</strong> folato 5 mg VO · magnésio 2 g EV se hipomagnesemia · dipirona 1 amp EV (febre/tremor)</li>
      <li><strong>Delirium tremens refractário:</strong> midazolam EV contínuo (UTI) · fenobarbital 130–260 mg IM (supervisão) · haloperidol 0,5–1 mg EV (adjuvante — não 1ª linha)</li>
      <li><strong>Convulsão:</strong> diazepam 10 mg EV · fenitoína 1 g EV se recorrente</li>
    </ul>`,

  'intoxicacoes-exogenas': `
    <p class="muted">Intoxicações exógenas — antídoto específico quando disponível; suporte ABC + carvão ativado se indicado.</p>
    <h4>Medicação IM / EV — antídotos</h4>
    <ul class="ps-med-options">
      <li><strong>Opioide:</strong> naloxona 0,4–2 mg EV/IM/IN — repetir a cada 2–3 min (máx. 10 mg); infusão EV se droga longa</li>
      <li><strong>Benzodiazepínico:</strong> flumazenil 0,2 mg EV lento — repetir 0,2 mg (máx. 1 mg); cautela convulsão se BZD dependente</li>
      <li><strong>Paracetamol:</strong> N-acetilcisteína EV (protocolo 21 h) — iniciar &lt; 8 h ideal</li>
      <li><strong>Organofosforado / carbamato:</strong> atropina 2 mg EV — repetir até secretions secas · pralidoxima 1–2 g EV (consultar CEATOX)</li>
    </ul>
    <h4>Suporte IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>Sintomáticos:</strong> dipirona 1 amp EV · ondansetrona 1 amp EV · diazepam 5 mg EV (convulsão)</li>
      <li><strong>Refractário:</strong> carvão ativado 50 g VO/SNG (até 1 h pós-ingestão) · hemodiálise (metanol, etilenoglicol, lítio)</li>
    </ul>`,

  'gonorreia-ist': `
    <p class="muted">Gonorreia / cervicite ou uretrite — ceftriaxona IM dose única; tratar clamídia concomitante.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> ceftriaxona 1 amp (500 mg–1 g) IM dose única (deltoide ou glúteo profundo)</li>
      <li><strong>Alternativa (alérgico leve):</strong> gentamicina 240 mg IM dose única + azitromicina 2 g VO dose única</li>
      <li><strong>Clamídia associada (sempre tratar):</strong> azitromicina 1 g VO dose única · ou doxiciclina 100 mg VO 12/12 h × 7 dias</li>
      <li><strong>Disseminada / artrite:</strong> ceftriaxona 1 g IM ou EV 24/24 h × 7–14 dias · dipirona 1 amp IM (dor articular)</li>
      <li><strong>Refractário / falha:</strong> ceftriaxona 1 g EV 24/24 h · teste sensibilidade · notificação/companion treatment</li>
    </ul>`,

  'profilaxia-antirrabica': `
    <p class="muted">Profilaxia antirrábica pós-exposição — lavagem ferida + vacina IM + imunoglobulina se exposição grave.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha (vacina):</strong> vacina antirrábica (Vero/humana) 1 mL IM deltoide — dias 0, 3, 7, 14 (± 28 se imunossuprimido)</li>
      <li><strong>Exposição grave (categoria III):</strong> soro antirrábico (SAR) infiltrar ferida + IM ou Ig antirrábica humana 20 UI/kg (máx. ferida + restante IM glúteo)</li>
      <li><strong>Alternativa (soro indisponível):</strong> Ig antirrábica humana 20 UI/kg — metade infiltrada na ferida</li>
      <li><strong>Pré-exposição (profissional risco):</strong> vacina 1 mL IM dias 0, 7, 21 ou 28</li>
      <li><strong>Analgesia ferida:</strong> dipirona 1 amp IM · lidocaína 1% local · tetano conforme calendário</li>
    </ul>`,

  'diverticulite': `
    <p class="muted">Diverticulite aguda complicada — ATB IM/EV; analgesia; drenagem/cirurgia se Hinchey II–IV.</p>
    <h4>Medicação IM / EV — ATB</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> ceftriaxona 1 amp (1 g) IM ou EV 24/24 h + metronidazol 500 mg EV 8/8 h</li>
      <li><strong>Alternativa:</strong> ciprofloxacino 400 mg EV 12/12 h + metronidazol 500 mg EV · ampicilina-sulbactam 3 g EV 6/6 h</li>
      <li><strong>Grave / Hinchey III–IV:</strong> piperacilina-tazobactam 4,5 g EV 6/6 h · meropenem 1 g EV 8/8 h + metronidazol</li>
      <li><strong>Alérgico:</strong> ciprofloxacino + metronidazol EV · moxifloxacino 400 mg EV (monoterapia — avaliar resistência)</li>
    </ul>
    <h4>Analgesia IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> dipirona 1 amp IM ou EV 6/6 h · tramadol 1 amp IM ou EV lento</li>
      <li><strong>AINE:</strong> cetoprofeno 1 amp IM · ketorolaco 30 mg IM (se sem contraindicação) · diclofenaco 1 amp IM</li>
      <li><strong>Refractário:</strong> morfina 2–4 mg EV titulada · ondansetrona 1 amp se vômitos</li>
    </ul>`,

  'abscesso-cutaneo': `
    <p class="muted">Abscesso cutâneo pós-drenagem — ATB IM/EV se extensão, imunossupressão ou celulite associada.</p>
    <h4>Medicação IM / EV — ATB</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha (celulite associada):</strong> ceftriaxona 1 amp (1 g) IM ou EV 24/24 h · oxacilina 1 g EV 6/6 h</li>
      <li><strong>Alternativa MRSA suspeito:</strong> clindamicina 600 mg EV 8/8 h · vancomicina 15 mg/kg EV 12/12 h · sulfametoxazol-trimetoprima 800/160 mg VO 12/12 h</li>
      <li><strong>Alérgico:</strong> clindamicina 600 mg EV · moxifloxacino 400 mg EV</li>
      <li><strong>Refractário / múltiplos:</strong> piperacilina-tazobactam 4,5 g EV 6/6 h · drenagem revisão</li>
    </ul>
    <h4>Analgesia IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> dipirona 1 amp IM ou EV 6/6 h · lidocaína 1% infiltração local (procedimento)</li>
      <li><strong>AINE:</strong> diclofenaco 1 amp IM · cetoprofeno 1 amp IM · ketorolaco 30 mg IM</li>
      <li><strong>Refractário:</strong> tramadol 1 amp IM ou EV lento</li>
    </ul>`,

  'herpes-zoster': `
    <p class="muted">Herpes zóster — imunossuprimido, disseminado, oftálmico ou neuralgia intensa: aciclovir EV.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha (internação):</strong> aciclovir 10 mg/kg EV 8/8 h × 7–10 dias (ajustar DRC) · ou valaciclovir 1 g VO 8/8 h se estável</li>
      <li><strong>Alternativa:</strong> ganciclovir 5 mg/kg EV 12/12 h (imunossuprimido grave) · famciclovir 500 mg VO 8/8 h</li>
      <li><strong>Analgesia:</strong> dipirona 1 amp IM ou EV 6/6 h · tramadol 1 amp IM ou EV lento · morfina 2–4 mg EV (neuralgia intensa)</li>
      <li><strong>AINE (dor inflamatória):</strong> cetoprofeno 1 amp IM · ketorolaco 30 mg IM ou EV lento · diclofenaco 1 amp IM</li>
      <li><strong>Refractário / neuralgia:</strong> pregabalina 75 mg VO 12/12 h · amitriptilina 25 mg VO · bloqueio nervoso (anestesia)</li>
    </ul>`,

  'ansiedade-panico': `
    <p class="muted">Crise de ansiedade / pânico — excluir causa orgânica (TEP, hipoglicemia, arritmia); benzodiazepínico IM/EV se sintomático.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> diazepam 5–10 mg VO ou 5 mg EV lento · lorazepam 1–2 mg VO/SL · midazolam 2,5–5 mg IM se agitação</li>
      <li><strong>Alternativa:</strong> clonazepam 0,5–1 mg VO/SL · alprazolam 0,25–0,5 mg VO (crise leve)</li>
      <li><strong>Sintomas físicos (palpitação/tremor):</strong> propranolol 40 mg VO (sem asma/DPOC) · dipirona 1 amp EV (cefaleia/tremor)</li>
      <li><strong>Náusea associada:</strong> metoclopramida 1 amp IM ou EV · ondansetrona 1 amp EV</li>
      <li><strong>Refractário / hiperventilação:</strong> diazepam 10 mg EV titulado · O₂ se hipoxemia · diferenciar de agitação psicótica (haloperidol)</li>
    </ul>`,

  'queimadura': `
    <p class="muted">Queimadura — analgesia EV, reposição volêmica (Parkland), profilaxia tetânica; ATB tópico/sistêmico se infecção.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha (analgesia):</strong> morfina 2–4 mg EV lento titulada (queimadura dolorosa) · dipirona 1 amp EV 6/6 h (dor leve-moderada)</li>
      <li><strong>Analgésicos alternativos:</strong> tramadol 1 amp IM ou EV lento · fentanil 50 mcg EV (UTI · curativos) · paracetamol 1 g EV 6/6 h</li>
      <li><strong>AINE (cautela — risco renal):</strong> ketorolaco 30 mg EV lento curto prazo · cetoprofeno 1 amp IM · evitar se extensão &gt; 20% SCQ</li>
      <li><strong>Hidratação:</strong> Ringer lactato 4 mL × kg × % SCQ EV (Parkland) · titular diurese 0,5 mL/kg/h</li>
      <li><strong>Refractário / infecção:</strong> ceftriaxona 1 g EV + vancomicina se MRSA · sulfadiazina de prata tópica</li>
    </ul>`,

  'malaria-grave': `
    <p class="muted">Malária grave (P. falciparum) — artesunato EV preferido; internação UTI; excluir complicações.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> artesunato 2,4 mg/kg EV (ou IM se sem acesso) no D0, D12 h, D24 h — depois esquema completo VO</li>
      <li><strong>Alternativa (artesunato indisponível):</strong> quinina di-HCl 20 mg/kg EV em 4 h + 10 mg/kg 8/8 h (monitorizar glicemia · cardíaco)</li>
      <li><strong>Associação:</strong> doxiciclina 100 mg VO/EV 12/12 h × 7 dias · ou clindamicina 10 mg/kg EV 12/12 h (gestante)</li>
      <li><strong>Refractário / recidiva:</strong> artemeter-lumefantrina VO após artesunato · atovaquona-proguanil VO</li>
    </ul>
    <h4>Sintomáticos IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>Febril:</strong> dipirona 1 amp EV 6/6 h · paracetamol 1 g EV (preferir se plaquetopenia)</li>
      <li><strong>Náusea/vômitos:</strong> ondansetrona 1 amp EV · metoclopramida 1 amp EV</li>
      <li><strong>Convulsão/coma:</strong> diazepam 10 mg EV · glicose 50% EV se hipoglicemia</li>
    </ul>`
};
