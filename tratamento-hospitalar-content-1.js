/* Tratamento hospitalar — posologias IM/EV (lote 1) */

const TH_CONTENT_1 = {
  'cefaleia': `
    <p class="muted">Cefaleia aguda hospitalar — excluir SNOOP4 antes de analgesia isolada. Posologias em ampola conforme apresentações usuais no Brasil.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> dipirona 1 amp (1 g/2 mL) IM ou EV · dexametasona 1 amp (4 mg/1 mL ou 10 mg/2,5 mL) IM ou EV</li>
      <li><strong>Alternativa:</strong> dipirona 1 amp (1 g/2 mL) IM ou EV · diclofenaco 1 amp (75 mg/3 mL) <strong>IM apenas</strong> (não administrar EV)</li>
      <li><strong>Enxaqueca moderada-grave:</strong> metoclopramida 1 amp (10 mg/2 mL) IM ou EV lento + dipirona 1 amp IM ou EV</li>
      <li><strong>Refractário:</strong> tramadol 1 amp (50 mg/1 mL) IM ou EV lento (titular) + hidratação SF 0,9% 500 mL EV</li>
    </ul>
    <p class="emerg-note">Diclofenaco EV não é recomendado (risco de reação grave). Dipirona EV: infundir em 15–30 min se diluída. Conteúdo educacional.</p>`,

  'dor-abdominal': `
    <p class="muted">Dor abdominal aguda — analgesia após avaliação cirúrgica quando indicada; evitar mascarar abdome agudo cirúrgico.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> dipirona 1 amp (1 g/2 mL) IM ou EV 6/6 h</li>
      <li><strong>Alternativa:</strong> dipirona 1 amp IM ou EV · diclofenaco 1 amp (75 mg/3 mL) <strong>IM</strong> 12/12 h</li>
      <li><strong>Dor moderada-grave:</strong> tramadol 1 amp (50 mg/1 mL) IM ou EV lento 6/6 h (máx. 400 mg/dia)</li>
      <li><strong>Antiespasmódico (cólica):</strong> escopolamina 1 amp (20 mg/1 mL) IM ou EV lento · dipirona 1 amp IM ou EV</li>
    </ul>
    <p class="emerg-note">Evitar opioides de rotina antes de exclusão cirúrgica quando possível. Conteúdo educacional.</p>`,

  'colica-renal': `
    <p class="muted">Cólica renal — analgesia IM/EV + hidratação; investigar comorbidades renais e gestação.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> dipirona 1 amp (1 g/2 mL) IM ou EV · dexametasona 1 amp (4–10 mg) IM ou EV</li>
      <li><strong>Alternativa:</strong> dipirona 1 amp IM ou EV · diclofenaco 1 amp (75 mg/3 mL) <strong>IM</strong> (não EV)</li>
      <li><strong>Refractário:</strong> tramadol 1 amp (50 mg/1 mL) IM ou EV lento + escopolamina 1 amp IM se cólica intensa</li>
      <li><strong>Adjuvante:</strong> ondansetrona 1 amp (4 mg/2 mL) IM ou EV se náusea associada</li>
    </ul>`,

  'lombalgia-ciatalgia': `
    <p class="muted">Lombalgia aguda / ciatalgia — excluir cauda equina (retenção urinária, anestesia em sela).</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> dipirona 1 amp (1 g/2 mL) IM ou EV 6/6 h</li>
      <li><strong>Alternativa:</strong> dipirona 1 amp IM ou EV · diclofenaco 1 amp (75 mg/3 mL) <strong>IM</strong> 12/12 h</li>
      <li><strong>Refractário / ciática:</strong> dexametasona 1 amp (10 mg/2,5 mL) IM ou EV dose única + dipirona 1 amp</li>
      <li><strong>Dor intensa:</strong> tramadol 1 amp (50 mg/1 mL) IM ou EV lento 6/6 h (curto prazo)</li>
    </ul>`,

  'dor-toracica': `
    <p class="muted">Dor torácica — protocolo SCA até prova em contrário; analgesia não atrasa reperfusão.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha (SCA):</strong> AAS 300 mg VO mastigado · clopidogrel 300 mg VO · morfina 2–4 mg EV lento se dor intensa (titular)</li>
      <li><strong>Analgesia alternativa:</strong> dipirona 1 amp (1 g/2 mL) EV (se morfina contraindicada ou indisponível)</li>
      <li><strong>Antianginoso:</strong> nitroglicerina 0,4 mg SL (repetir 5 min × 3) · EV contínuo se edema pulmonar (UTI)</li>
      <li><strong>Refractário:</strong> fentanil 50–100 mcg EV (ambiente monitorizado) — preferir morfina EV titulada</li>
    </ul>
    <p class="emerg-note">Morfina/fentanil apenas EV em ambiente monitorizado. Conteúdo educacional.</p>`,

  'nausea-vomitos': `
    <p class="muted">Náusea e vômitos agudos — corrigir desidratação; investigar causa (abdome, SNC, metabólica).</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> metoclopramida 1 amp (10 mg/2 mL) IM ou EV lento 8/8 h</li>
      <li><strong>Alternativa:</strong> ondansetrona 1 amp (4 mg/2 mL) IM ou EV 8/8 h</li>
      <li><strong>Alérgico / prolongamento QT:</strong> dimenidrinato 1 amp (50 mg/1 mL) IM ou EV lento 6/6 h</li>
      <li><strong>Refractário / vômito bilioso:</strong> ondansetrona 1 amp EV + SF 0,9% 500 mL–1 L EV (repor volume)</li>
    </ul>`,

  'asma-broncoespasmo': `
    <p class="muted">Crise asmática / broncoespasmo — broncodilatador + corticoide sistêmico precoce.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> salbutamol nebulização 5 mg + SF · hidrocortisona 1 amp (500 mg) EV ou metilprednisolona 1 amp (125 mg) EV</li>
      <li><strong>Alternativa (crise grave):</strong> sulfato de magnésio 1 amp diluído (2 g/10 mL) EV em 20 min (asma grave refratária)</li>
      <li><strong>Refractário:</strong> adrenalina 0,3–0,5 mg IM (1:1000) se broncoespasmo com instabilidade · repetir 5–15 min</li>
      <li><strong>Manutenção:</strong> hidrocortisona 500 mg EV 6/6 h ou metilprednisolona 125 mg EV 6/6 h × 24–48 h</li>
    </ul>`,

  'dpoc-exacerbada': `
    <p class="muted">DPOC exacerbada — broncodilatador + corticoide + ATB se infecção suspeita.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> salbutamol + ipratrópio nebulização · metilprednisolona 1 amp (125 mg) EV ou hidrocortisona 500 mg EV</li>
      <li><strong>Alternativa ATB:</strong> ceftriaxona 1 amp (1 g) IM ou EV 24/24 h + azitromicina 500 mg VO 24/24 h × 5 dias</li>
      <li><strong>Refractário / acidose:</strong> sulfato de magnésio 2 g EV em 20 min · considerar VNI</li>
      <li><strong>Manutenção corticoide:</strong> metilprednisolona 125 mg EV 6/6 h × 48 h, depois prednisona 40 mg VO</li>
    </ul>`,

  'pneumonia': `
    <p class="muted">Pneumonia comunitária internada — ATB EV conforme gravidade e comorbidades.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> ceftriaxona 1 amp (1 g) IM ou EV 24/24 h + azitromicina 500 mg VO/EV 24/24 h</li>
      <li><strong>Alternativa:</strong> ampicilina-sulbactam 3 g EV 6/6 h (pneumonia aspirativa)</li>
      <li><strong>Alérgico à penicilina:</strong> levofloxacino 750 mg EV 24/24 h (monoterapia se sem MRSA)</li>
      <li><strong>Refractário / UTI:</strong> piperacilina-tazobactam 4,5 g EV 6/6 h ou meropenem 1 g EV 8/8 h</li>
    </ul>
    <h4>Sintomáticos IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>Febril / mialgia:</strong> dipirona 1 amp IM ou EV 6/6 h · paracetamol 750 mg VO/EV 6/6 h</li>
    </ul>`,

  'celulite-erisipela': `
    <p class="muted">Celulite / erisipela — ATB IM/EV; elevar espectro se imunossupressão ou falha VO.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> ceftriaxona 1 amp (1 g) IM ou EV 24/24 h</li>
      <li><strong>Alternativa:</strong> oxacilina 1 amp (1 g) EV 6/6 h (MRSA não suspeito · erisipela clássica)</li>
      <li><strong>Alérgico:</strong> clindamicina 600 mg EV 8/8 h ou vancomicina 15 mg/kg EV 12/12 h (MRSA)</li>
      <li><strong>Refractário / MRSA:</strong> vancomicina EV + piperacilina-tazobactam 4,5 g EV 6/6 h</li>
    </ul>
    <h4>Analgesia / antitérmico</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> dipirona 1 amp IM ou EV 6/6 h</li>
    </ul>`,

  'pielonefrite': `
    <p class="muted">Pielonefrite / ITU alta — ATB EV; internar se gestante, sepse ou vômitos.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> ceftriaxona 1 amp (1 g) IM ou EV 24/24 h</li>
      <li><strong>Alternativa:</strong> ciprofloxacino 400 mg EV 12/12 h (se sensibilidade local favorável)</li>
      <li><strong>Alérgico:</strong> gentamicina 5 mg/kg EV 24/24 h + ampicilina 2 g EV 6/6 h (ajustar função renal)</li>
      <li><strong>Refractário / sepse:</strong> piperacilina-tazobactam 4,5 g EV 6/6 h</li>
    </ul>
    <h4>Sintomáticos</h4>
    <ul class="ps-med-options">
      <li><strong>Dor/febre:</strong> dipirona 1 amp IM ou EV 6/6 h · escopolamina 1 amp IM se cólica</li>
    </ul>`,

  'sepse-infeccao-grave': `
    <p class="muted">Sepse / infecção grave — ATB EV precoce (≤ 1 h) + expansão volêmica.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha (empírico):</strong> ceftriaxona 2 amp (2 g) EV 24/24 h ou piperacilina-tazobactam 4,5 g EV 6/6 h</li>
      <li><strong>Alternativa abdominal:</strong> meropenem 1 g EV 8/8 h + metronidazol 500 mg EV 8/8 h</li>
      <li><strong>Alérgico grave:</strong> meropenem 1 g EV 8/8 h + vancomicina 15–20 mg/kg EV 12/12 h (MRSA)</li>
      <li><strong>Choque séptico:</strong> noradrenalina EV contínua (UTI) + hidrocortisona 100 mg EV 8/8 h se refratário</li>
    </ul>
    <h4>Adjuvantes EV</h4>
    <ul class="ps-med-options">
      <li><strong>Expansão:</strong> SF 0,9% 20–30 mL/kg EV bolus · repetir conforme resposta</li>
      <li><strong>Febril:</strong> dipirona 1 amp EV (não atrasar ATB)</li>
    </ul>`,

  'crise-hipertensiva': `
    <p class="muted">Emergência hipertensiva (LOA) vs urgência (PA alta sem LOA) — reduzir PA gradualmente se LOA.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha (LOA — EV):</strong> hidralazina 20 mg EV lento; repetir 10–20 mg a cada 20–30 min (máx. 200 mg/24 h)</li>
      <li><strong>Alternativa:</strong> nitroglicerina EV contínua (edema pulmonar hipertensivo) · labetalol 20 mg EV lento (titular)</li>
      <li><strong>Encefalopatia hipertensiva:</strong> nicardipina EV contínua (UTI) — titular PA (redução 10–15% na 1ª hora)</li>
      <li><strong>Urgência (sem LOA):</strong> captopril 25 mg VO ou anlodipino 5–10 mg VO — <strong>não</strong> usar EV de rotina</li>
    </ul>
    <h4>Cefaleia associada</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> dipirona 1 amp IM ou EV após estabilização PA</li>
    </ul>`,

  'hipoglicemia': `
    <p class="muted">Hipoglicemia sintomática — glicose EV imediata; IM se acesso difícil.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha (consciente):</strong> glicose 50% 40 mL (1 amp) EV lento · repetir se glicemia &lt; 70 mg/dL</li>
      <li><strong>Alternativa (sem acesso):</strong> glucagon 1 mg IM ou SC (1 amp)</li>
      <li><strong>Inconsciente:</strong> glicose 50% 40 mL EV + SF 0,9% com glicose 5–10% EV contínua após bolus</li>
      <li><strong>Refractário / sulfonilureia:</strong> octreotide 50 mcg SC/EV (endocrinologia) + glicose EV contínua</li>
    </ul>`,

  'convulsao-eme': `
    <p class="muted">Crise convulsiva / estado de mal epiléptico — benzodiazepínico IM/EV imediato.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> diazepam 1 amp (10 mg/2 mL) EV lento (2–5 mg/min) ou midazolam 5 mg IM/EV</li>
      <li><strong>Alternativa (sem acesso):</strong> midazolam 10 mg IM (1 amp) — repetir 5 mg após 10 min se persistir</li>
      <li><strong>Refractário (2ª linha):</strong> fenitoína 20 mg/kg EV (máx. 50 mg/min) ou ácido valproico 20–40 mg/kg EV</li>
      <li><strong>EME refractário:</strong> midazolam ou propofol EV contínuo (UTI) + intubação</li>
    </ul>`,

  'anafilaxia': `
    <p class="muted">Anafilaxia — adrenalina IM é tratamento de 1ª linha; não atrasar.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> adrenalina 0,3–0,5 mg IM (1:1000) — repetir a cada 5–15 min se necessário</li>
      <li><strong>Alternativa (hipotensão refratária):</strong> adrenalina EV titulada (UTI) — preferir IM na 1ª dose</li>
      <li><strong>Adjuvantes:</strong> difenidramina 50 mg IM ou EV lento · hidrocortisona 500 mg EV · salbutamol nebulização se broncoespasmo</li>
      <li><strong>Refractário:</strong> noradrenalina EV contínua (choque anafilático) + volume SF 0,9% 20 mL/kg</li>
    </ul>`,

  'gota-crise': `
    <p class="muted">Crise aguda de gota — AINE ou corticoide; evitar iniciar alopurinol na crise.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> dipirona 1 amp (1 g/2 mL) IM ou EV 6/6 h</li>
      <li><strong>Alternativa:</strong> diclofenaco 1 amp (75 mg/3 mL) <strong>IM</strong> 12/12 h (não EV) · evitar se DRC/úlcera</li>
      <li><strong>Contraindicação AINE:</strong> prednisolona 30 mg VO ou metilprednisolona 1 amp (125 mg) EV dose única</li>
      <li><strong>Refractário:</strong> dexametasona 1 amp (10 mg) IM ou EV dose única + dipirona 1 amp</li>
    </ul>`,

  'artralgia-dor-msk': `
    <p class="muted">Artralgia / dor musculoesquelética aguda — analgesia IM/EV + repouso relativo.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> dipirona 1 amp (1 g/2 mL) IM ou EV 6/6 h</li>
      <li><strong>Alternativa:</strong> dipirona 1 amp IM ou EV · diclofenaco 1 amp (75 mg/3 mL) <strong>IM</strong> 12/12 h</li>
      <li><strong>Refractário:</strong> tramadol 1 amp (50 mg/1 mL) IM ou EV lento 6/6 h</li>
      <li><strong>Inflamação importante:</strong> dexametasona 1 amp (4–10 mg) IM ou EV dose única (curto prazo)</li>
    </ul>`,

  'vertigem-vestibular': `
    <p class="muted">Vertigem aguda / labirintite — antivertiginoso + hidratação; excluir AVC posterior.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> dimenidrinato 1 amp (50 mg/1 mL) IM ou EV lento 6/6 h</li>
      <li><strong>Alternativa:</strong> metoclopramida 1 amp (10 mg/2 mL) IM ou EV lento + dipirona 1 amp se cefaleia</li>
      <li><strong>Refractário:</strong> diazepam 5 mg IM ou EV lento (curto prazo · risco de queda)</li>
      <li><strong>Náusea:</strong> ondansetrona 1 amp (4 mg/2 mL) IM ou EV 8/8 h</li>
    </ul>`,

  'agitacao-psiquiatrica': `
    <p class="muted">Agitação psicomotora / delirium — contenção verbal + medicação IM se risco iminente.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> haloperidol 5 mg IM (1 amp) · repetir 5 mg após 30–60 min se necessário (máx. 20 mg/dia)</li>
      <li><strong>Alternativa:</strong> haloperidol 5 mg IM + prometazina 25–50 mg IM (sedação combinada)</li>
      <li><strong>Delirium hiperativo idoso:</strong> haloperidol 0,5–1 mg IM ou EV (dose baixa) · evitar benzodiazepínico exceto abstinência</li>
      <li><strong>Refractário:</strong> midazolam 5 mg IM ou EV lento (monitorizar FR) — ambiente seguro</li>
    </ul>
    <p class="emerg-note">ECG antes de haloperidol se QT prolongado. Conteúdo educacional.</p>`,

  'pancreatite': `
    <p class="muted">Pancreatite aguda — jejum, hidratação EV agressiva, analgesia adequada.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha (analgesia):</strong> dipirona 1 amp (1 g/2 mL) IM ou EV 6/6 h · tramadol 1 amp IM ou EV lento se refractário</li>
      <li><strong>Alternativa:</strong> morfina 2–4 mg EV lento titulada (segura na pancreatite — mitos sobre espasmo esfincteriano)</li>
      <li><strong>Antiemético:</strong> ondansetrona 1 amp (4 mg/2 mL) IM ou EV 8/8 h</li>
      <li><strong>Hidratação:</strong> Ringer lactato 250–500 mL/h EV (titular volemia · lactato se alcalose)</li>
    </ul>`,

  'colecistite': `
    <p class="muted">Colecistite aguda — ATB + analgesia; colecistectomia precoce quando possível.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha ATB:</strong> ceftriaxona 1 amp (1 g) IM ou EV 24/24 h + metronidazol 500 mg EV 8/8 h</li>
      <li><strong>Alternativa:</strong> ampicilina-sulbactam 3 g EV 6/6 h (monoterapia)</li>
      <li><strong>Alérgico:</strong> ciprofloxacino 400 mg EV 12/12 h + metronidazol 500 mg EV 8/8 h</li>
      <li><strong>Analgesia:</strong> dipirona 1 amp IM ou EV 6/6 h · tramadol 1 amp se dor intensa</li>
    </ul>`,

  'apendicite': `
    <p class="muted">Apendicite aguda — ATB pré/pós-operatório + analgesia (não atrasar cirurgia).</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha ATB:</strong> ceftriaxona 1 amp (1 g) IM ou EV 24/24 h + metronidazol 500 mg EV 8/8 h</li>
      <li><strong>Alternativa:</strong> ciprofloxacino 400 mg EV 12/12 h + metronidazol 500 mg EV 8/8 h</li>
      <li><strong>Complicada / perfurada:</strong> piperacilina-tazobactam 4,5 g EV 6/6 h</li>
      <li><strong>Analgesia:</strong> dipirona 1 amp IM ou EV · tramadol 1 amp IM ou EV lento se moderada-grave</li>
    </ul>`,

  'influenza-gripe': `
    <p class="muted">Influenza com complicação / internação — sintomáticos IM/EV + oseltamivir VO quando indicado.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha (febre/mialgia):</strong> dipirona 1 amp (1 g/2 mL) IM ou EV 6/6 h</li>
      <li><strong>Alternativa:</strong> paracetamol 750 mg–1 g VO/EV 6/6 h (máx. 3 g/dia)</li>
      <li><strong>Pneumonia secundária:</strong> ceftriaxona 1 amp (1 g) EV 24/24 h + oseltamivir 75 mg VO 12/12 h × 5 dias</li>
      <li><strong>Broncoespasmo:</strong> salbutamol nebulização + metilprednisolona 1 amp (125 mg) EV</li>
    </ul>`,

  'dengue-dor': `
    <p class="muted">Dengue — analgesia hospitalar sem AAS/AINE nas fases críticas; preferir paracetamol/dipirona.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> dipirona 1 amp (1 g/2 mL) IM ou EV 6/6 h (após fase crítica ou se plaquetas &gt; 50 mil)</li>
      <li><strong>Alternativa:</strong> paracetamol 750 mg VO/EV 6/6 h (preferir nas primeiras 48 h)</li>
      <li><strong>Evitar:</strong> AAS · ibuprofeno · diclofenaco (risco hemorrágico)</li>
      <li><strong>Refractário:</strong> tramadol 1 amp IM ou EV lento (usar com cautela · monitorizar plaquetas)</li>
    </ul>`,

  'hda': `
    <p class="muted">HDA — estabilização + IBP EV; evitar AINE; considerar transfusão conforme Hb.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> omeprazol 80 mg EV bolus + 40 mg EV 12/12 h (ou pantoprazol 80 mg EV + 40 mg EV 12/12 h)</li>
      <li><strong>Alternativa (sangramento varicoso):</strong> terlipressina 2 mg EV 4/4 h + ceftriaxona 1 g EV (profilaxia PBE)</li>
      <li><strong>Analgesia:</strong> dipirona 1 amp EV (evitar AINE e anticoagulantes)</li>
      <li><strong>Refractário:</strong> octreotide 50 mcg EV bolus + infusão (varizes) · endoscopia urgente</li>
    </ul>`,

  'flebite': `
    <p class="muted">Flebite superficial / tromboflebite — ATB se supurativa; analgesia local/sistêmica.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha (não supurativa):</strong> dipirona 1 amp IM ou EV 6/6 h · elevação membro · compressa morna</li>
      <li><strong>Alternativa (extensa):</strong> ceftriaxona 1 amp (1 g) IM ou EV 24/24 h × 7 dias</li>
      <li><strong>Supurativa / abscesso:</strong> oxacilina 1 g EV 6/6 h ou clindamicina 600 mg EV 8/8 h</li>
      <li><strong>Dor local:</strong> diclofenaco gel tópico + dipirona 1 amp IM ou EV</li>
    </ul>`,

  'profilaxia-tetano': `
    <p class="muted">Profilaxia antitetânica — conforme status vacinal e tipo de ferida.</p>
    <h4>Medicação IM</h4>
    <ul class="ps-med-options">
      <li><strong>Esquema básico:</strong> vacina antitetânica (dT/dTpa) 0,5 mL IM (deltoide) — reforço se &gt; 10 anos</li>
      <li><strong>Ferida tetanígena + vacinação incompleta:</strong> soro antitetânico (SAT) 500 UI IM ou IV ou Ig antitetânica 250 UI IM</li>
      <li><strong>Alternativa (soro indisponível):</strong> Ig antitetânica humana 250 UI IM (única)</li>
      <li><strong>Ferida limpa + vacinação completa:</strong> apenas reforço vacinal IM se &gt; 10 anos do último reforço</li>
    </ul>`,

  'cetoacidose-dm': `
    <p class="muted">CAD — insulina EV contínua + reposição volêmica; potássio conforme K+ sérico.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> insulina regular EV contínua 0,1 U/kg/h (bomba) após bolus 0,1 U/kg EV</li>
      <li><strong>Alternativa (sem bomba):</strong> insulina regular 10 U EV + 10 U/h EV (menos ideal)</li>
      <li><strong>Hidratação:</strong> SF 0,9% 15–20 mL/kg EV 1ª hora · depois 250–500 mL/h (titular)</li>
      <li><strong>Adjuvantes:</strong> dipirona 1 amp IM ou EV se dor · ondansetrona 1 amp se vômitos · KCl EV conforme K+</li>
    </ul>`,

  'sindrome-vestibular': `
    <p class="muted">Síndrome vestibular aguda — HINTS se suspeita central; sintomáticos IM/EV.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> dimenidrinato 1 amp (50 mg/1 mL) IM ou EV lento 6/6 h × 24–48 h</li>
      <li><strong>Alternativa:</strong> metoclopramida 1 amp (10 mg/2 mL) IM ou EV + dipirona 1 amp IM ou EV</li>
      <li><strong>Labirintite aguda:</strong> prednisolona 1 mg/kg VO ou metilprednisolona 1 amp (125 mg) EV dose única (curso curto)</li>
      <li><strong>Náusea refractária:</strong> ondansetrona 1 amp (4 mg/2 mL) IM ou EV 8/8 h</li>
    </ul>
    <p class="emerg-note">Vertigem + déficit neurológico → TC crânio urgente. Conteúdo educacional.</p>`
};
