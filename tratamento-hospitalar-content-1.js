/* Tratamento hospitalar — posologias IM/EV (lote 1 — opções ampliadas) */

const TH_CONTENT_1 = {
  'cefaleia': `
    <p class="muted">Cefaleia aguda hospitalar — excluir SNOOP4 antes de analgesia isolada. Posologias em ampola conforme apresentações usuais no Brasil.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> dipirona 1 amp (1 g/2 mL) IM ou EV · dexametasona 1 amp (4 mg/1 mL ou 10 mg/2,5 mL) IM ou EV</li>
      <li><strong>AINE (escolher 1 — IM salvo ketorolaco):</strong> diclofenaco 1 amp (75 mg/3 mL) <strong>IM</strong> · cetoprofeno 1 amp (100 mg/2 mL — Tilatil®/Profenid®) <strong>IM</strong> · ketorolaco 1 amp (30 mg/1 mL) IM ou EV lento · tenoxicam 1 amp (20 mg/2 mL) <strong>IM</strong></li>
      <li><strong>Analgésicos alternativos:</strong> paracetamol 500 mg ou 750 mg VO ou 750 mg EV 6/6 h · tramadol 1 amp (50 mg/1 mL) IM ou EV lento · dipirona + paracetamol (associação permitida)</li>
      <li><strong>Corticoides alternativos:</strong> metilprednisolona 1 amp (125 mg) EV · hidrocortisona 1 amp (500 mg) EV · dexametasona 4–10 mg IM ou EV (prevenir recorrência enxaqueca 48 h)</li>
      <li><strong>Enxaqueca moderada-grave:</strong> metoclopramida 1 amp (10 mg/2 mL) IM ou EV lento + dipirona 1 amp · ou ondansetrona 1 amp + analgésico</li>
      <li><strong>Refractário:</strong> tramadol 1 amp IM ou EV lento + hidratação SF 0,9% 500 mL EV · morfina 2–4 mg EV lento titulada se dor intensa (monitorizado)</li>
    </ul>
    <p class="emerg-note">Diclofenaco e tenoxicam: não EV. Ketorolaco: máx. 5 dias · cautela DRC/úlcera. Dipirona EV: infundir 15–30 min se diluída. Conteúdo educacional.</p>`,

  'dor-abdominal': `
    <p class="muted">Dor abdominal aguda — analgesia após avaliação cirúrgica quando indicada; evitar mascarar abdome agudo cirúrgico.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> dipirona 1 amp (1 g/2 mL) IM ou EV 6/6 h</li>
      <li><strong>AINE (escolher 1 — preferir IM):</strong> diclofenaco 1 amp (75 mg/3 mL) IM 12/12 h · cetoprofeno 1 amp (100 mg/2 mL) IM 12/12 h · ketorolaco 30 mg IM ou EV lento 8/8 h (máx. 5 dias) · tenoxicam 1 amp (20 mg/2 mL) IM 24/24 h</li>
      <li><strong>Analgésicos alternativos:</strong> paracetamol 500 mg ou 750 mg VO / 750 mg EV 6/6 h · tramadol 1 amp (50 mg/1 mL) IM ou EV lento 6/6 h · morfina 2–4 mg EV lento titulada se dor intensa pós-avaliação</li>
      <li><strong>Corticoides (inflamação/peritoneite leve — curto prazo):</strong> dexametasona 1 amp IM ou EV · metilprednisolona 125 mg EV dose única</li>
      <li><strong>Antiespasmódico (cólica):</strong> escopolamina 1 amp (20 mg/1 mL) IM ou EV lento · hioscina 1 amp IM · + dipirona 1 amp</li>
      <li><strong>Refractário:</strong> tramadol + dipirona alternados · buscopan composto (escopolamina + dipirona) IM se disponível</li>
    </ul>
    <p class="emerg-note">Evitar AINE se suspeita de perfuração, HDA ou pancreatite grave. Opioides após avaliação cirúrgica. Conteúdo educacional.</p>`,

  'colica-renal': `
    <p class="muted">Cólica renal — analgesia IM/EV + hidratação; investigar comorbidades renais e gestação.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> dipirona 1 amp (1 g/2 mL) IM ou EV · dexametasona 1 amp (4–10 mg) IM ou EV</li>
      <li><strong>AINE (escolher 1):</strong> diclofenaco 1 amp (75 mg/3 mL) <strong>IM</strong> · cetoprofeno 1 amp (100 mg/2 mL) <strong>IM</strong> · ketorolaco 30 mg IM ou EV lento 8/8 h · tenoxicam 1 amp (20 mg/2 mL) <strong>IM</strong></li>
      <li><strong>Analgésicos alternativos:</strong> paracetamol 500 mg ou 750 mg VO / 750 mg EV 6/6 h · tramadol 1 amp IM ou EV lento · dipirona + AINE IM (associação comum na cólica)</li>
      <li><strong>Corticoides alternativos:</strong> metilprednisolona 1 amp (125 mg) EV · hidrocortisona 500 mg EV (reduzir edema ureteral — curto prazo)</li>
      <li><strong>Adjuvantes:</strong> escopolamina 1 amp IM ou EV lento · ondansetrona 1 amp IM ou EV se náusea</li>
      <li><strong>Refractário:</strong> tramadol 1 amp + dipirona 1 amp + hidratação SF 0,9% 500 mL–1 L EV · morfina 2–4 mg EV titulada se dor intratável</li>
    </ul>`,

  'lombalgia-ciatalgia': `
    <p class="muted">Lombalgia aguda / ciatalgia — excluir cauda equina (retenção urinária, anestesia em sela).</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> dipirona 1 amp (1 g/2 mL) IM ou EV 6/6 h</li>
      <li><strong>AINE (escolher 1):</strong> diclofenaco 1 amp (75 mg/3 mL) IM 12/12 h · cetoprofeno 1 amp (100 mg/2 mL) IM 12/12 h · ketorolaco 30 mg IM ou EV lento 8/8 h · tenoxicam 1 amp (20 mg/2 mL) IM 24/24 h</li>
      <li><strong>Analgésicos alternativos:</strong> paracetamol 500 mg ou 750 mg VO / 750 mg EV 6/6 h · tramadol 1 amp IM ou EV lento 6/6 h · morfina 2–4 mg EV titulada (dor radicular intensa · curto prazo)</li>
      <li><strong>Corticoides (ciática/radiculopatia):</strong> dexametasona 1 amp (10 mg/2,5 mL) IM ou EV · metilprednisolona 1 amp (125 mg) EV · hidrocortisona 500 mg EV</li>
      <li><strong>Miorrelaxante (componente espasmo):</strong> ciclobenzaprina 5–10 mg VO (se tolerando) · diazepam 5 mg IM ou EV lento (curto prazo · risco queda)</li>
      <li><strong>Refractário:</strong> tramadol + dexametasona EV + AINE IM · considerar bloqueio radicular (anestesiologia)</li>
    </ul>`,

  'dor-toracica': `
    <p class="muted">Dor torácica — protocolo SCA até prova em contrário; analgesia não atrasa reperfusão.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha (SCA):</strong> AAS 300 mg VO mastigado · clopidogrel 300 mg VO · morfina 2–4 mg EV lento titulada se dor intensa</li>
      <li><strong>Analgésicos alternativos:</strong> dipirona 1 amp (1 g/2 mL) EV · paracetamol 1 g EV · tramadol 50 mg EV lento (se morfina contraindicada)</li>
      <li><strong>Opioides alternativos (monitorizado):</strong> fentanil 50–100 mcg EV · meperidina 25–50 mg EV lento (menos preferida · metabolito tóxico)</li>
      <li><strong>Antianginoso:</strong> nitroglicerina 0,4 mg SL (× 3) · nitroglicerina EV contínua · isossorbida 5 mg SL</li>
      <li><strong>Evitar na SCA:</strong> AINE (diclofenaco, cetoprofeno, ketorolaco) — não usar na suspeita de IAM</li>
      <li><strong>Refractário:</strong> morfina EV titulada + ansiolítico leve (diazepam 2,5–5 mg EV) se ansiedade associada · UTI</li>
    </ul>
    <p class="emerg-note">Morfina/fentanil apenas EV em ambiente monitorizado. AINE contraindicado na SCA. Conteúdo educacional.</p>`,

  'nausea-vomitos': `
    <p class="muted">Náusea e vômitos agudos — corrigir desidratação; investigar causa (abdome, SNC, metabólica).</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> metoclopramida 1 amp (10 mg/2 mL) IM ou EV lento 8/8 h</li>
      <li><strong>Antieméticos alternativos:</strong> ondansetrona 1 amp (4 mg/2 mL) IM ou EV 8/8 h · dimenidrinato 1 amp (50 mg/1 mL) IM ou EV lento 6/6 h · prometazina 25 mg IM ou EV lento (sedação associada)</li>
      <li><strong>Associação refractária:</strong> ondansetrona 4 mg EV + metoclopramida 10 mg EV (cautela prolongamento QT)</li>
      <li><strong>Alérgico / prolongamento QT:</strong> dimenidrinato 1 amp IM ou EV · haloperidol 0,5–1 mg EV lento (vômito metabólico/CAD)</li>
      <li><strong>Refractário / vômito bilioso:</strong> ondansetrona 1 amp EV + SF 0,9% 500 mL–1 L EV · metoclopramida 10 mg EV antes das refeições</li>
      <li><strong>Adjuvante analgésico se dor:</strong> dipirona 1 amp IM ou EV · paracetamol 750 mg EV</li>
    </ul>`,

  'asma-broncoespasmo': `
    <p class="muted">Crise asmática / broncoespasmo — broncodilatador + corticoide sistêmico precoce.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> salbutamol nebulização 5 mg + SF · hidrocortisona 1 amp (500 mg) EV ou metilprednisolona 1 amp (125 mg) EV</li>
      <li><strong>Corticoides alternativos:</strong> metilprednisolona 125 mg EV 6/6 h · hidrocortisona 500 mg EV 6/6 h · dexametasona 1 amp (10 mg) IM ou EV dose única (ambulatorial/leve) · prednisolona 40 mg VO após estabilização</li>
      <li><strong>Broncodilatador alternativo:</strong> fenoterol nebulização · salbutamol MDI com espaçador 4–8 jatos · sulfato de magnésio 2 g/10 mL EV em 20 min (grave refratária)</li>
      <li><strong>Refractário:</strong> adrenalina 0,3–0,5 mg IM (1:1000) se instabilidade · repetir 5–15 min · considerar VNI/intubação</li>
      <li><strong>Manutenção 24–48 h:</strong> metilprednisolona 125 mg EV 6/6 h ou hidrocortisona 500 mg EV 6/6 h → transição VO</li>
    </ul>`,

  'dpoc-exacerbada': `
    <p class="muted">DPOC exacerbada — broncodilatador + corticoide + ATB se infecção suspeita.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> salbutamol + ipratrópio nebulização · metilprednisolona 1 amp (125 mg) EV ou hidrocortisona 500 mg EV</li>
      <li><strong>Corticoides alternativos:</strong> dexametasona 1 amp (10 mg) IM ou EV · metilprednisolona 125 mg EV 6/6 h × 48 h · hidrocortisona 500 mg EV 6/6 h · prednisona 40 mg VO após melhora</li>
      <li><strong>ATB (infecção suspeita):</strong> ceftriaxona 1 amp (1 g) IM ou EV 24/24 h + azitromicina 500 mg VO · ampicilina-sulbactam 3 g EV 6/6 h · levofloxacino 750 mg EV (alérgico penicilina)</li>
      <li><strong>Refractário / acidose:</strong> sulfato de magnésio 2 g EV em 20 min · VNI · considerar aminofilina EV (2ª linha · monitorizar)</li>
      <li><strong>Sintomáticos:</strong> dipirona 1 amp IM ou EV · paracetamol 750 mg VO/EV</li>
    </ul>`,

  'pneumonia': `
    <p class="muted">Pneumonia comunitária internada — ATB EV conforme gravidade e comorbidades.</p>
    <h4>Medicação IM / EV — ATB</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> ceftriaxona 1 amp (1 g) IM ou EV 24/24 h + azitromicina 500 mg VO/EV 24/24 h</li>
      <li><strong>Alternativa:</strong> ampicilina-sulbactam 3 g EV 6/6 h · amoxicilina-clavulanato 1,2 g EV 8/8 h (menos grave)</li>
      <li><strong>Alérgico à penicilina:</strong> levofloxacino 750 mg EV 24/24 h · moxifloxacino 400 mg EV 24/24 h</li>
      <li><strong>Refractário / UTI:</strong> piperacilina-tazobactam 4,5 g EV 6/6 h · meropenem 1 g EV 8/8 h · ceftriaxona + vancomicina se MRSA</li>
    </ul>
    <h4>Sintomáticos IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>Antitérmico/analgésico:</strong> dipirona 1 amp IM ou EV 6/6 h · paracetamol 500 mg ou 750 mg VO / 750 mg EV 6/6 h · tramadol 1 amp se mialgia intensa</li>
      <li><strong>AINE (febre/mialgia — se sem contraindicação):</strong> cetoprofeno 1 amp IM · ketorolaco 30 mg IM ou EV lento · evitar se sepse/insuf. renal</li>
      <li><strong>Broncoespasmo associado:</strong> salbutamol nebulização + metilprednisolona 125 mg EV</li>
    </ul>`,

  'celulite-erisipela': `
    <p class="muted">Celulite / erisipela — ATB IM/EV; elevar espectro se imunossupressão ou falha VO.</p>
    <h4>Medicação IM / EV — ATB</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> ceftriaxona 1 amp (1 g) IM ou EV 24/24 h</li>
      <li><strong>Alternativa:</strong> oxacilina 1 amp (1 g) EV 6/6 h · cefazolina 1 g EV 8/8 h · ampicilina-sulbactam 3 g EV 6/6 h</li>
      <li><strong>Alérgico:</strong> clindamicina 600 mg EV 8/8 h · vancomicina 15 mg/kg EV 12/12 h (MRSA) · azitromicina 500 mg EV (erisipela leve)</li>
      <li><strong>Refractário / MRSA:</strong> vancomicina EV + piperacilina-tazobactam 4,5 g EV 6/6 h · linezolida 600 mg EV 12/12 h</li>
    </ul>
    <h4>Analgesia / antitérmico</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> dipirona 1 amp IM ou EV 6/6 h · paracetamol 750 mg VO/EV 6/6 h</li>
      <li><strong>AINE (dor/inflamação local):</strong> diclofenaco 1 amp IM · cetoprofeno 1 amp IM · ketorolaco 30 mg IM (se função renal normal)</li>
      <li><strong>Refractário:</strong> tramadol 1 amp IM ou EV lento · dipirona + AINE IM alternados</li>
    </ul>`,

  'pielonefrite': `
    <p class="muted">Pielonefrite / ITU alta — ATB EV; internar se gestante, sepse ou vômitos.</p>
    <h4>Medicação IM / EV — ATB</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> ceftriaxona 1 amp (1 g) IM ou EV 24/24 h</li>
      <li><strong>Alternativa:</strong> ciprofloxacino 400 mg EV 12/12 h · ampicilina-sulbactam 3 g EV 6/6 h · ertapenem 1 g EV 24/24 h (ESBL)</li>
      <li><strong>Alérgico:</strong> gentamicina 5 mg/kg EV 24/24 h + ampicilina 2 g EV 6/6 h · levofloxacino 750 mg EV 24/24 h</li>
      <li><strong>Refractário / sepse:</strong> piperacilina-tazobactam 4,5 g EV 6/6 h · meropenem 1 g EV 8/8 h</li>
    </ul>
    <h4>Sintomáticos</h4>
    <ul class="ps-med-options">
      <li><strong>Dor/febre:</strong> dipirona 1 amp IM ou EV 6/6 h · paracetamol 500 mg ou 750 mg VO / 750 mg EV · escopolamina 1 amp IM se cólica</li>
      <li><strong>AINE (cólica/febre — se hidratado):</strong> diclofenaco 1 amp IM · cetoprofeno 1 amp IM · ketorolaco 30 mg IM ou EV lento</li>
      <li><strong>Refractário:</strong> tramadol 1 amp + dipirona 1 amp · ondansetrona 1 amp se vômitos</li>
    </ul>`,

  'sepse-infeccao-grave': `
    <p class="muted">Sepse / infecção grave — ATB EV precoce (≤ 1 h) + expansão volêmica.</p>
    <h4>Medicação IM / EV — ATB</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha (empírico):</strong> ceftriaxona 2 amp (2 g) EV 24/24 h · piperacilina-tazobactam 4,5 g EV 6/6 h</li>
      <li><strong>Alternativa abdominal:</strong> meropenem 1 g EV 8/8 h + metronidazol 500 mg EV 8/8 h · ceftriaxona + metronidazol EV</li>
      <li><strong>Alérgico grave:</strong> meropenem 1 g EV 8/8 h + vancomicina 15–20 mg/kg EV 12/12 h · aztreonam + vancomicina</li>
      <li><strong>Choque séptico:</strong> noradrenalina EV contínua · vasopressina EV · hidrocortisona 100 mg EV 8/8 h se refratário</li>
    </ul>
    <h4>Adjuvantes EV</h4>
    <ul class="ps-med-options">
      <li><strong>Expansão:</strong> SF 0,9% 20–30 mL/kg EV bolus · Ringer lactato · repetir conforme resposta</li>
      <li><strong>Antitérmico:</strong> dipirona 1 amp EV · paracetamol 1 g EV · <strong>evitar AINE</strong> se hipotensão/IRA</li>
      <li><strong>Dor:</strong> tramadol EV lento · morfina EV titulada (UTI) — preferir dipirona na instabilidade</li>
    </ul>`,

  'crise-hipertensiva': `
    <p class="muted">Emergência hipertensiva (LOA) vs urgência (PA alta sem LOA) — reduzir PA gradualmente se LOA.</p>
    <h4>Medicação IM / EV — anti-hipertensivos</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha (LOA — EV):</strong> hidralazina 20 mg EV lento; repetir 10–20 mg a cada 20–30 min (máx. 200 mg/24 h)</li>
      <li><strong>Alternativas EV:</strong> nitroglicerina EV contínua (EAP hipertensivo) · labetalol 20 mg EV lento (titular) · nicardipina EV contínua (encefalopatia) · furosemida 40 mg EV (sobrecarga volêmica)</li>
      <li><strong>Urgência (sem LOA):</strong> captopril 25 mg VO · anlodipino 5–10 mg VO · clonidina 0,1–0,2 mg VO — <strong>não</strong> usar EV de rotina</li>
      <li><strong>Refractário (UTI):</strong> nitroprussiato de sódio EV contínuo · esmolol EV (dissecção aórtica suspeita — betabloqueador 1º)</li>
    </ul>
    <h4>Cefaleia / dor associada</h4>
    <ul class="ps-med-options">
      <li><strong>Analgésicos:</strong> dipirona 1 amp IM ou EV · paracetamol 500 mg ou 750 mg VO / 750 mg EV · tramadol 1 amp EV lento</li>
      <li><strong>Corticoide (encefalopatia hipertensiva — adjuvante):</strong> dexametasona 1 amp IM ou EV · metilprednisolona 125 mg EV (evidência limitada — usar se edema cerebral)</li>
      <li><strong>Evitar:</strong> AINE (diclofenaco, cetoprofeno, ketorolaco) — pioram PA e função renal</li>
    </ul>`,

  'hipoglicemia': `
    <p class="muted">Hipoglicemia sintomática — glicose EV imediata; IM se acesso difícil.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha (consciente):</strong> glicose 50% 40 mL (1 amp) EV lento · repetir se glicemia &lt; 70 mg/dL</li>
      <li><strong>Alternativa (sem acesso):</strong> glucagon 1 mg IM ou SC (1 amp) · glicose 10% 250 mL EV (menos concentrada)</li>
      <li><strong>Inconsciente:</strong> glicose 50% 40 mL EV + SF 0,9% com glicose 5–10% EV contínua após bolus</li>
      <li><strong>Refractário / sulfonilureia:</strong> octreotide 50 mcg SC/EV + glicose EV contínua · hidrocortisona 100 mg EV (insuf. adrenal associada)</li>
      <li><strong>Adjuvante sintomático:</strong> diazepam 5 mg EV lento se convulsão · dipirona 1 amp se cefaleia pós-hipoglicemia</li>
    </ul>`,

  'convulsao-eme': `
    <p class="muted">Crise convulsiva / estado de mal epiléptico — benzodiazepínico IM/EV imediato.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> diazepam 1 amp (10 mg/2 mL) EV lento (2–5 mg/min) · midazolam 5 mg IM ou EV</li>
      <li><strong>Benzodiazepínicos alternativos:</strong> lorazepam 4 mg EV lento (2 mg/min — preferido se disponível) · midazolam 10 mg IM (sem acesso) · clonazepam 1 mg EV lento</li>
      <li><strong>Refractário (2ª linha):</strong> fenitoína 20 mg/kg EV (máx. 50 mg/min) · ácido valproico 20–40 mg/kg EV · fenobarbital 20 mg/kg EV (neonatal/EME prolongado)</li>
      <li><strong>EME refractário (UTI):</strong> midazolam EV contínuo · propofol EV contínuo · tiopental EV contínuo + intubação</li>
      <li><strong>Adjuvante febre:</strong> dipirona 1 amp EV · paracetamol 750 mg EV (se convulsão febril pós-crise)</li>
    </ul>`,

  'anafilaxia': `
    <p class="muted">Anafilaxia — adrenalina IM é tratamento de 1ª linha; não atrasar.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> adrenalina 0,3–0,5 mg IM (1:1000) — repetir a cada 5–15 min se necessário</li>
      <li><strong>Alternativa (hipotensão refratária):</strong> adrenalina EV titulada (UTI) · noradrenalina EV contínua · vasopressina EV</li>
      <li><strong>Antihistamínicos:</strong> difenidramina 50 mg IM ou EV lento · prometazina 25 mg IM · hidroxizina 50 mg IM</li>
      <li><strong>Corticoides (adjuvante — não substituem adrenalina):</strong> hidrocortisona 500 mg EV · metilprednisolona 125 mg EV · dexametasona 1 amp (10 mg) IM ou EV</li>
      <li><strong>Broncoespasmo:</strong> salbutamol nebulização · ipratrópio nebulização · adrenalina IM repetida</li>
    </ul>`,

  'gota-crise': `
    <p class="muted">Crise aguda de gota — AINE ou corticoide; evitar iniciar alopurinol na crise.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> dipirona 1 amp (1 g/2 mL) IM ou EV 6/6 h</li>
      <li><strong>AINE (escolher 1 — preferir IM):</strong> diclofenaco 1 amp (75 mg/3 mL) IM 12/12 h · cetoprofeno 1 amp (100 mg/2 mL) IM 12/12 h · ketorolaco 30 mg IM ou EV lento 8/8 h · tenoxicam 1 amp (20 mg/2 mL) IM 24/24 h</li>
      <li><strong>Corticoides (contraindicação AINE/DRC):</strong> metilprednisolona 1 amp (125 mg) EV dose única · dexametasona 1 amp (10 mg) IM ou EV · hidrocortisona 500 mg EV · prednisolona 30 mg VO</li>
      <li><strong>Analgésicos alternativos:</strong> paracetamol 500 mg ou 750 mg VO / 750 mg EV · tramadol 1 amp IM ou EV lento · colchicina 0,5 mg VO 8/8 h (se função renal OK — preferir precoce)</li>
      <li><strong>Refractário:</strong> metilprednisolona 125 mg EV + AINE IM · considerar artrocentese (corticoide intra-articular)</li>
    </ul>`,

  'artralgia-dor-msk': `
    <p class="muted">Artralgia / dor musculoesquelética aguda — analgesia IM/EV + repouso relativo.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> dipirona 1 amp (1 g/2 mL) IM ou EV 6/6 h</li>
      <li><strong>AINE (escolher 1):</strong> diclofenaco 1 amp (75 mg/3 mL) IM 12/12 h · cetoprofeno 1 amp (100 mg/2 mL) IM 12/12 h · ketorolaco 30 mg IM ou EV lento 8/8 h · tenoxicam 1 amp (20 mg/2 mL) IM 24/24 h</li>
      <li><strong>Analgésicos alternativos:</strong> paracetamol 500 mg ou 750 mg VO / 750 mg EV 6/6 h · tramadol 1 amp IM ou EV lento 6/6 h · morfina 2–4 mg EV titulada (dor intensa · curto prazo)</li>
      <li><strong>Corticoides (inflamação importante):</strong> dexametasona 1 amp (4–10 mg) IM ou EV · metilprednisolona 1 amp (125 mg) EV · hidrocortisona 500 mg EV</li>
      <li><strong>Refractário:</strong> tramadol + AINE IM alternados · dexametasona EV + dipirona · ciclobenzaprina 5–10 mg VO (espasmo muscular)</li>
    </ul>`,

  'vertigem-vestibular': `
    <p class="muted">Vertigem aguda / labirintite / síndrome vestibular — HINTS se suspeita central; antivertiginoso + hidratação.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> dimenidrinato 1 amp (50 mg/1 mL) IM ou EV lento 6/6 h × 24–48 h</li>
      <li><strong>Antieméticos/antivertiginosos alternativos:</strong> metoclopramida 1 amp (10 mg/2 mL) IM ou EV · ondansetrona 1 amp (4 mg/2 mL) IM ou EV · prometazina 25 mg IM · meclizina 25 mg VO</li>
      <li><strong>Analgésicos (cefaleia associada):</strong> dipirona 1 amp IM ou EV · paracetamol 750 mg EV · cetoprofeno 1 amp IM · ketorolaco 30 mg IM</li>
      <li><strong>Corticoides (labirintite/neurite vestibular):</strong> dexametasona 1 amp IM ou EV · metilprednisolona 1 amp (125 mg) EV · prednisolona 1 mg/kg VO × 5–7 dias</li>
      <li><strong>Refractário:</strong> ondansetrona + dimenidrinato · diazepam 5 mg IM ou EV lento (curto prazo · risco queda) · hidratação SF 0,9% 500 mL EV</li>
    </ul>
    <p class="emerg-note">Vertigem + déficit neurológico → TC crânio urgente. Conteúdo educacional.</p>`,

  'agitacao-psiquiatrica': `
    <p class="muted">Agitação psicomotora / delirium — contenção verbal + medicação IM se risco iminente.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> haloperidol 5 mg IM (1 amp) · repetir 5 mg após 30–60 min (máx. 20 mg/dia)</li>
      <li><strong>Antipsicóticos alternativos:</strong> haloperidol 5 mg EV lento · droperidol 2,5–5 mg IM ou EV (monitorizar QT) · risperidona 1–2 mg VO/SL (se colaborativo)</li>
      <li><strong>Sedação combinada:</strong> haloperidol 5 mg IM + prometazina 25–50 mg IM · haloperidol + midazolam 2,5–5 mg IM (delirium hiperativo grave)</li>
      <li><strong>Delirium hiperativo idoso:</strong> haloperidol 0,5–1 mg IM ou EV (dose baixa) · quetiapina 25–50 mg VO · evitar benzodiazepínico exceto abstinência</li>
      <li><strong>Refractário / abstinência alcoólica:</strong> midazolam 5 mg IM ou EV lento · diazepam 5–10 mg EV lento (monitorizar FR) · tiapride 100 mg IM</li>
    </ul>
    <p class="emerg-note">ECG antes de haloperidol/droperidol se QT prolongado. Conteúdo educacional.</p>`,

  'pancreatite': `
    <p class="muted">Pancreatite aguda — jejum, hidratação EV agressiva, analgesia adequada.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha (analgesia):</strong> dipirona 1 amp (1 g/2 mL) IM ou EV 6/6 h · tramadol 1 amp IM ou EV lento se refractário</li>
      <li><strong>Opioides (dor intensa — seguros na pancreatite):</strong> morfina 2–4 mg EV lento titulada · fentanil 50 mcg EV · meperidina 25–50 mg EV (menos preferida)</li>
      <li><strong>Analgésicos alternativos:</strong> paracetamol 1 g EV 6/6 h · ketorolaco 30 mg EV lento (evitar se IRA/choque) · dipirona + tramadol alternados</li>
      <li><strong>Antieméticos:</strong> ondansetrona 1 amp IM ou EV · metoclopramida 1 amp IM ou EV · dimenidrinato 1 amp IM</li>
      <li><strong>Corticoide:</strong> <strong>não indicado</strong> de rotina na pancreatite · dexametasona apenas se indicacao específica (ex.: edema airway)</li>
      <li><strong>Hidratação:</strong> Ringer lactato 250–500 mL/h EV (titular volemia)</li>
    </ul>`,

  'colecistite': `
    <p class="muted">Colecistite aguda — ATB + analgesia; colecistectomia precoce quando possível.</p>
    <h4>Medicação IM / EV — ATB</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> ceftriaxona 1 amp (1 g) IM ou EV 24/24 h + metronidazol 500 mg EV 8/8 h</li>
      <li><strong>Alternativa:</strong> ampicilina-sulbactam 3 g EV 6/6 h · piperacilina-tazobactam 4,5 g EV 6/6 h (grave)</li>
      <li><strong>Alérgico:</strong> ciprofloxacino 400 mg EV 12/12 h + metronidazol 500 mg EV · levofloxacino + metronidazol</li>
      <li><strong>Refractário / perfurada:</strong> meropenem 1 g EV 8/8 h + metronidazol EV</li>
    </ul>
    <h4>Analgesia IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> dipirona 1 amp IM ou EV 6/6 h · tramadol 1 amp IM ou EV lento</li>
      <li><strong>AINE (se função renal normal):</strong> diclofenaco 1 amp IM · cetoprofeno 1 amp IM · ketorolaco 30 mg IM ou EV lento</li>
      <li><strong>Refractário:</strong> morfina 2–4 mg EV titulada · metilprednisolona 125 mg EV (adjuvante inflamatório — curto prazo)</li>
    </ul>`,

  'apendicite': `
    <p class="muted">Apendicite aguda — ATB pré/pós-operatório + analgesia (não atrasar cirurgia).</p>
    <h4>Medicação IM / EV — ATB</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> ceftriaxona 1 amp (1 g) IM ou EV 24/24 h + metronidazol 500 mg EV 8/8 h</li>
      <li><strong>Alternativa:</strong> ciprofloxacino 400 mg EV 12/12 h + metronidazol 500 mg EV · ampicilina-sulbactam 3 g EV 6/6 h</li>
      <li><strong>Complicada / perfurada:</strong> piperacilina-tazobactam 4,5 g EV 6/6 h · meropenem 1 g EV 8/8 h + metronidazol</li>
      <li><strong>Refractário / abscesso:</strong> piperacilina-tazobactam + metronidazol · drenagem percutânea se indicado</li>
    </ul>
    <h4>Analgesia IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> dipirona 1 amp IM ou EV · tramadol 1 amp IM ou EV lento</li>
      <li><strong>AINE:</strong> diclofenaco 1 amp IM · cetoprofeno 1 amp IM · ketorolaco 30 mg IM (pré-op · cautela)</li>
      <li><strong>Refractário:</strong> morfina 2–4 mg EV titulada · paracetamol 1 g EV associado</li>
    </ul>`,

  'influenza-gripe': `
    <p class="muted">Influenza com complicação / internação — sintomáticos IM/EV + oseltamivir VO quando indicado.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>Antitérmico/analgésico 1ª linha:</strong> dipirona 1 amp (1 g/2 mL) IM ou EV 6/6 h · paracetamol 500 mg ou 750 mg VO / 750 mg EV 6/6 h</li>
      <li><strong>AINE (mialgia/febre):</strong> cetoprofeno 1 amp IM · ketorolaco 30 mg IM ou EV lento · diclofenaco 1 amp IM (se hidratado e sem contraindicação)</li>
      <li><strong>Analgésicos alternativos:</strong> tramadol 1 amp IM ou EV lento · dipirona + paracetamol alternados</li>
      <li><strong>Pneumonia secundária:</strong> ceftriaxona 1 amp (1 g) EV 24/24 h + oseltamivir 75 mg VO 12/12 h × 5 dias · azitromicina associada</li>
      <li><strong>Broncoespasmo:</strong> salbutamol nebulização · metilprednisolona 125 mg EV · hidrocortisona 500 mg EV · dexametasona 10 mg IM ou EV</li>
    </ul>`,

  'dengue-dor': `
    <p class="muted">Dengue — analgesia hospitalar sem AAS/AINE nas fases críticas; preferir paracetamol/dipirona.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha (fase crítica / plaquetas baixas):</strong> paracetamol 750 mg VO/EV 6/6 h (preferir nas primeiras 48 h e se plaquetas &lt; 100 mil)</li>
      <li><strong>Alternativa:</strong> dipirona 1 amp (1 g/2 mL) IM ou EV 6/6 h (após fase crítica ou plaquetas &gt; 50 mil)</li>
      <li><strong>Evitar:</strong> AAS · ibuprofeno · diclofenaco · cetoprofeno · ketorolaco · tenoxicam (risco hemorrágico)</li>
      <li><strong>Refractário (cautela):</strong> tramadol 1 amp IM ou EV lento (monitorizar plaquetas) · dipirona EV (evitar IM se plaquetopenia grave)</li>
      <li><strong>Antiemético:</strong> ondansetrona 1 amp IM ou EV · metoclopramida 1 amp IM ou EV</li>
    </ul>`,

  'hda': `
    <p class="muted">HDA — estabilização + IBP EV; evitar AINE; considerar transfusão conforme Hb.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha (IBP):</strong> omeprazol 80 mg EV bolus + 40 mg EV 12/12 h · pantoprazol 80 mg EV + 40 mg EV 12/12 h · esomeprazol 80 mg EV + 40 mg EV 12/12 h</li>
      <li><strong>Alternativa (sangramento varicoso):</strong> terlipressina 2 mg EV 4/4 h · octreotide 50 mcg EV bolus + infusão · ceftriaxona 1 g EV (profilaxia PBE)</li>
      <li><strong>Analgesia (sem AINE):</strong> dipirona 1 amp EV · paracetamol 750 mg EV · tramadol EV lento (evitar se rebaixamento)</li>
      <li><strong>Refractário:</strong> endoscopia urgente · noradrenalina EV (varizes + choque) · transfusão conforme Hb/alvo restrictivo</li>
      <li><strong>Evitar:</strong> todos AINE (diclofenaco, cetoprofeno, ketorolaco) · anticoagulantes</li>
    </ul>`,

  'flebite': `
    <p class="muted">Flebite superficial / tromboflebite — ATB se supurativa; analgesia local/sistêmica.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha (não supurativa):</strong> dipirona 1 amp IM ou EV 6/6 h · paracetamol 750 mg VO/EV · elevação membro · compressa morna</li>
      <li><strong>AINE (dor/inflamação):</strong> diclofenaco 1 amp IM · cetoprofeno 1 amp IM · ketorolaco 30 mg IM · tenoxicam 1 amp IM · diclofenaco gel tópico</li>
      <li><strong>ATB (extensa/supurativa):</strong> ceftriaxona 1 amp IM ou EV 24/24 h · oxacilina 1 g EV 6/6 h · clindamicina 600 mg EV 8/8 h</li>
      <li><strong>Refractário:</strong> tramadol 1 amp + dipirona 1 amp · AINE IM + gel tópico</li>
    </ul>`,

  'profilaxia-tetano': `
    <p class="muted">Profilaxia antitetânica — conforme status vacinal e tipo de ferida.</p>
    <h4>Medicação IM</h4>
    <ul class="ps-med-options">
      <li><strong>Esquema básico:</strong> vacina antitetânica (dT/dTpa) 0,5 mL IM (deltoide) — reforço se &gt; 10 anos</li>
      <li><strong>Ferida tetanígena + vacinação incompleta:</strong> soro antitetânico (SAT) 500 UI IM ou IV · Ig antitetânica humana 250 UI IM</li>
      <li><strong>Alternativa (soro indisponível):</strong> Ig antitetânica humana 250 UI IM (única) · vacina dT/dTpa IM no outro braço</li>
      <li><strong>Analgesia da ferida:</strong> dipirona 1 amp IM · diclofenaco 1 amp IM · cetoprofeno 1 amp IM · lidocaína 1% local</li>
    </ul>`,

  'cetoacidose-dm': `
    <p class="muted">CAD — insulina EV contínua + reposição volêmica; potássio conforme K+ sérico.</p>
    <h4>Medicação IM / EV</h4>
    <ul class="ps-med-options">
      <li><strong>1ª linha:</strong> insulina regular EV contínua 0,1 U/kg/h (bomba) após bolus 0,1 U/kg EV</li>
      <li><strong>Insulina alternativa:</strong> insulina regular 10 U EV + 10 U/h EV (sem bomba) · insulina NPH IM (transição — raramente na fase aguda)</li>
      <li><strong>Hidratação:</strong> SF 0,9% 15–20 mL/kg EV 1ª hora · depois 250–500 mL/h (titular) · trocar para SG 5% quando glicemia &lt; 250 mg/dL</li>
      <li><strong>Adjuvantes:</strong> dipirona 1 amp IM ou EV · paracetamol 750 mg EV · ondansetrona 1 amp · metoclopramida 1 amp · KCl EV conforme K+</li>
      <li><strong>Corticoide:</strong> hidrocortisona 100 mg EV 8/8 h apenas se insuficiência adrenal associada</li>
    </ul>`
};
