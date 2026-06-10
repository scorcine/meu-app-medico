/* Medicações — perfis por classe terapêutica (defaults para monografias) */

const MED_CLASS_LABELS = {
  analgesic: 'Analgésico / antipirético',
  opioid: 'Opioide',
  nsaid: 'AINE (anti-inflamatório não esteroide)',
  triptan: 'Triptano (antimigranoso)',
  antiemetic: 'Antiemético',
  antivertigo: 'Antivertiginoso',
  antihistamine: 'Anti-histamínico',
  corticosteroid: 'Corticoide',
  muscle_relaxant: 'Relaxante muscular',
  non_drug: 'Suporte / oxigenoterapia',
  ccb: 'Bloqueador de canal de cálcio',
  acei: 'IECA',
  arb: 'BRA',
  vasodilator: 'Vasodilatador',
  beta_blocker: 'Betabloqueador',
  diuretic: 'Diurético',
  vasopressor: 'Vasopressor / inotrópico',
  bronchodilator: 'Broncodilatador',
  electrolyte: 'Eletrólito / reposição',
  benzodiazepine: 'Benzodiazepínico',
  anticonvulsant: 'Anticonvulsivante',
  antibiotic: 'Antibiótico',
  penicillin: 'Penicilina',
  cephalosporin: 'Cefalosporina',
  macrolide: 'Macrolídeo',
  fluoroquinolone: 'Fluoroquinolona',
  carbapenem: 'Carbapenêmico',
  aminoglycoside: 'Aminoglicosídeo',
  lincosamide: 'Lincosamida',
  glycopeptide: 'Glicopeptídeo',
  tetracycline: 'Tetraciclina',
  antiprotozoal: 'Antiprotozoário',
  antiviral: 'Antiviral',
  antipsychotic: 'Antipsicótico',
  antispasmodic: 'Antiespasmódico / anticolínico',
  antidiabetic: 'Antidiabético / controle glicêmico',
  ppi: 'Inibidor de bomba de prótons (IBP)',
  h2_blocker: 'Antagonista H2',
  antiplatelet: 'Antiplaquetário',
  anticoagulant: 'Anticoagulante',
  antidote: 'Antídoto',
  hormone: 'Hormônio / análogo',
  antiinflammatory: 'Anti-inflamatório (não AINE)',
  uricosuric: 'Uricosúrico / hipouricemiante',
  vitamin: 'Vitamina / cofator',
  osmotic: 'Diurético osmótico',
  antimalarial: 'Antimalárico',
  antithyroid: 'Antitireoidiano',
  thyroid_hormone: 'Hormônio tireoidiano',
  alpha_blocker: 'Bloqueador alfa-adrenérgico',
  discharge_only: 'Uso ambulatorial / alta',
  tricyclic: 'Antidepressivo tricíclico',
  antidepressant: 'Antidepressivo (ISRS/SNRI)',
  antiarrhythmic: 'Antiarrítmico',
  statin: 'Estatina (hipolipemiante)',
  nitrofuran: 'Nitrofurano'
};

const MED_CLASS_DEFAULTS = {
  analgesic: {
    indications: ['Dor leve a moderada', 'Febre'],
    ciAbs: ['Insuficiência hepática grave', 'Hipersensibilidade ao fármaco'],
    ciRel: ['Gestação (preferir paracetamol na maioria dos casos)', 'DRC/IRC — ajustar dose e intervalo', 'Uso crônico — risco hepato/nefrotoxicidade'],
    posologyVo: ['Ver apresentações comerciais VO abaixo'],
    posologyHosp: ['Ver apresentações hospitalares abaixo']
  },
  opioid: {
    indications: ['Dor moderada a intensa', 'Analgesia hospitalar titulada'],
    ciAbs: ['Depressão respiratória', 'Íleo paralítico', 'Asma grave descompensada', 'Uso concomitante de IMAO (14 dias)'],
    ciRel: ['Gestação/lactação', 'DRC — acumulo de metabólitos (morfina, meperidina)', 'Dependência/abuso', 'Idoso — reduzir dose'],
    posologyVo: ['Titular pela resposta; respeitar teto diário'],
    posologyHosp: ['EV lento titulado; monitorizar FR e sedação']
  },
  nsaid: {
    indications: ['Dor inflamatória', 'Febre', 'Artralgias', 'Cólica'],
    ciAbs: ['Úlcera péptica ativa ou sangramento GI', 'Insuficiência renal grave', '3º trimestre de gestação', 'DRC terminal sem diálise'],
    ciRel: ['Gestação (evitar especialmente 3º trimestre)', 'DRC/IRC', 'IC descompensada', 'Asma/intolerância a AAS', 'Anticoagulação — risco GI', 'Dengue/fase crítica — evitar'],
    posologyVo: ['Usar menor dose eficaz pelo menor tempo', 'Preferir VO com alimento se tolerado'],
    posologyHosp: ['Preferir IM para diclofenaco/cetoprofeno/tenoxicam; ketorolaco IM/EV (máx. 5 dias)']
  },
  triptan: {
    indications: ['Enxaqueca aguda', 'Crise de cefaleia em salvas (sumatriptano SC)'],
    ciAbs: ['Doença arterial coronariana', 'AVC/AIT prévio', 'Angina', 'Hipertensão arterial grave não controlada', 'Enxaqueca basilar/hemiplégica'],
    ciRel: ['Gestação/lactação', 'Idade > 65 anos', 'Fibrilação atrial', 'Uso de ergotamina/ergot — intervalo 24 h'],
    posologyVo: ['Início precoce da crise; não usar > 10 dias/mês (risco de cefaleia por abuso)'],
    posologyHosp: ['Sumatriptano 6 mg SC; repetir após 1 h se necessário (máx. 12 mg/24 h)']
  },
  antiemetic: {
    indications: ['Náusea e vômitos', 'Adjuvante em enxaqueca/cólica'],
    ciAbs: ['Obstrução GI', 'Hipersensibilidade'],
    ciRel: ['Gestação (metoclopramida — evitar 1º trimestre se possível)', 'Parkinson/epilepsia (metoclopramida)', 'Prolongamento QT (ondansetrona)'],
    posologyVo: ['Dose única ou curso curto conforme indicação'],
    posologyHosp: ['EV lento; preferir ondansetrona se prolongamento QT']
  },
  corticosteroid: {
    indications: ['Inflamação aguda', 'Asma/DPOC exacerbada', 'Anafilaxia adjuvante', 'Profilaxia enxaqueca'],
    ciAbs: ['Infecção sistêmica não tratada (relativa em sepse — contexto)'],
    ciRel: ['Diabetes descompensado', 'IC', 'Gestação — usar menor dose/necessidade', 'Uso prolongado — supressão adrenal'],
    posologyVo: ['Curso curto na maioria das indicações agudas'],
    posologyHosp: ['Dose única ou curso curto; desmame se > 5–7 dias']
  },
  antibiotic: {
    indications: ['Infecção bacteriana documentada ou suspeita'],
    ciAbs: ['Hipersensibilidade ao fármaco/classe'],
    ciRel: ['Gestação/lactação — escolher por classe', 'DRC — ajustar dose (aminoglicosídeos, vancomicina)', 'Insuficiência hepática'],
    posologyVo: ['Completar curso conforme foco e guideline'],
    posologyHosp: ['Dose de ataque + manutenção; revisar em 48–72 h']
  },
  penicillin: {
    indications: ['Infecções por Gram-positivos sensíveis', 'Amigdalite estreptocócica', 'Sinusite/pneumonia comunitária (esquemas combinados)'],
    ciAbs: ['Anafilaxia prévia à penicilina'],
    ciRel: ['Alergia não anafilática — avaliar dessensibilização ou alternativa', 'Mononucleose + amoxicilina (rash)'],
    posologyVo: ['8/8 h ou 12/12 h conforme apresentação'],
    posologyHosp: ['EV conforme apresentação; ajustar função renal se necessário']
  },
  cephalosporin: {
    indications: ['Infecções respiratórias, urinárias, intra-abdominais, SNC (meningite)'],
    ciAbs: ['Anafilaxia a cefalosporina do mesmo espectro'],
    ciRel: ['Alergia grave à penicilina — reatividade cruzada baixa a moderada (cefalosporinas 3ª/4ª geração)', 'DRC — ajuste de dose'],
    posologyVo: ['Conforme apresentação e foco'],
    posologyHosp: ['Ceftriaxona 1–2 g EV 24/24 h; meningite — doses maiores']
  },
  macrolide: {
    indications: ['Pneumonia atípica', 'Alternativa em alergia à penicilina', 'Profilaxia MAC (contexto específico)'],
    ciAbs: ['Hipersensibilidade', 'Uso com drogas que prolongam QT (cautela absoluta em combinação)'],
    ciRel: ['Prolongamento QT', 'Hepatopatia', 'Gestação — azitromicina preferível'],
    posologyVo: ['Azitromicina 500 mg 24/24 h × 3–5 dias'],
    posologyHosp: ['EV se não tolera VO; monitorizar QT']
  },
  fluoroquinolone: {
    indications: ['ITU complicada', 'Pneumonia (alternativa)', 'Infecção intra-abdominal (combinado)'],
    ciAbs: ['Gestação e lactação', 'Crianças/adolescentes (cartilagem) — salvo indicação formal'],
    ciRel: ['Epilepsia', 'Prolongamento QT', 'Idoso — tendinite/ruptura tendão', 'DRC — ajuste'],
    posologyVo: ['Levofloxacino 500–750 mg 24/24 h'],
    posologyHosp: ['EV equivalente; evitar monoterapia em pneumonia grave']
  },
  carbapenem: {
    indications: ['Infecção grave multirresistente', 'Sepse abdominal', 'Neutropenia febril (esquemas)'],
    ciAbs: ['Hipersensibilidade'],
    ciRel: ['Epilepsia — imipenem reduz limiar convulsivo', 'Gestação — usar se benefício > risco'],
    posologyVo: ['Uso hospitalar — raramente VO ambulatorial'],
    posologyHosp: ['Meropenem 1 g EV 8/8 h; ajustar DRC']
  },
  aminoglycoside: {
    indications: ['Sepse grave', 'Endocardite (sinergia)', 'Infecção por Gram-negativo'],
    ciAbs: ['Hipersensibilidade'],
    ciRel: ['DRC — toxicidade renal/auditiva', 'Miastenia gravis', 'Monitorizar níveis séricos'],
    posologyVo: ['Uso hospitalar'],
    posologyHosp: ['Dose única diária ou dividida; monitorizar função renal']
  },
  benzodiazepine: {
    indications: ['Crise convulsiva', 'Ansiedade aguda', 'Sedação', 'Abstinência alcoólica'],
    ciAbs: ['Miastenia gravis', 'Apneia do sono grave não tratada', 'Insuficiência respiratória aguda'],
    ciRel: ['Gestação/lactação', 'Idoso — risco de queda/delirium', 'Dependência'],
    posologyVo: ['Menor dose eficaz; curso curto'],
    posologyHosp: ['EV/IM titulado; flumazenil disponível se overdose']
  },
  anticonvulsant: {
    indications: ['Status epilepticus', 'Profilaxia pós-crítica', 'Profilaxia enxaqueca (valproato, topiramato)'],
    ciAbs: ['Hipersensibilidade', 'Porfiria (fenitoína, barbitúricos)'],
    ciRel: ['Gestação — valproato contraindicado (teratogênico)', 'DRC — ajuste', 'Monitorizar níveis (fenitoína)'],
    posologyVo: ['Titulação gradual na profilaxia'],
    posologyHosp: ['Fenitoína/fenobarbital/valproato EV conforme protocolo EME']
  },
  bronchodilator: {
    indications: ['Asma aguda', 'DPOC exacerbada', 'Broncoespasmo'],
    ciAbs: ['Hipersensibilidade'],
    ciRel: ['Taquiarritmia', 'Hipertireoidismo', 'Cardiopatia isquêmica — usar com monitorização'],
    posologyVo: ['Salbutamol spray 100 mcg — 2 jatos PRN'],
    posologyHosp: ['Nebulização ou MDI com espaçador; ipatrópio associado na DPOC']
  },
  vasopressor: {
    indications: ['Choque', 'Parada cardíaca', 'Anafilaxia', 'Hipotensão refratária'],
    ciAbs: ['Sem contraindicação absoluta em emergência com ameaça à vida'],
    ciRel: ['Taquiarritmia', 'Cardiopatia isquêmica — noradrenalina preferível em choque séptico'],
    posologyVo: ['Uso hospitalar'],
    posologyHosp: ['Infusão contínua titulada; acesso venoso central preferível']
  },
  anticoagulant: {
    indications: ['TEV', 'FA', 'SCA', 'Profilaxia tromboembólica'],
    ciAbs: ['Sangramento ativo', 'Hemorragia intracraniana'],
    ciRel: ['DRC — ajuste DOAC/heparina', 'Gestação — preferir heparina', 'Plaquetopenia'],
    posologyVo: ['Conforme indicação e peso (enoxaparina)'],
    posologyHosp: ['Heparina EV ou enoxaparina SC; monitorizar anti-Xa se indicado']
  },
  antiplatelet: {
    indications: ['SCA', 'AVC isquêmico', 'Profilaxia cardiovascular'],
    ciAbs: ['Sangramento ativo', 'Hemorragia intracraniana aguda'],
    ciRel: ['Plaquetopenia', 'Cirurgia programada — suspender conforme risco'],
    posologyVo: ['AAS 100 mg 24/24 h; clopidogrel 75 mg 24/24 h'],
    posologyHosp: ['Ataque conforme protocolo SCA']
  },
  ppi: {
    indications: ['DRGE', 'Profilaxia úlcera por AINE', 'HDA estável pós-estabilização'],
    ciAbs: ['Hipersensibilidade'],
    ciRel: ['Uso crônico — deficiência B12, Mg, infecção por C. difficile', 'Interação com clopidogrel (omeprazol)'],
    posologyVo: ['Omeprazol 20–40 mg 24/24 h em jejum'],
    posologyHosp: ['EV se não tolera VO']
  },
  antidiabetic: {
    indications: ['Hipoglicemia (glicose/glucagon)', 'CAD/EHH (insulina)', 'DM2 (metformina ambulatorial)'],
    ciAbs: ['Hipersensibilidade', 'Metformina: DFG < 30, acidose'],
    ciRel: ['DRC — metformina cautela DFG 30–45', 'Gestação — insulina preferível'],
    posologyVo: ['Metformina 500–850 mg 8/8 h ou 12/12 h'],
    posologyHosp: ['Insulina EV contínua no CAD; glicose 50% EV na hipoglicemia grave']
  },
  antipsychotic: {
    indications: ['Agitação psicomotora', 'Delirium', 'Psicose aguda'],
    ciAbs: ['Coma', 'Intoxicação por depressores do SNC'],
    ciRel: ['Prolongamento QT', 'Parkinson', 'Idoso — reduzir dose (haloperidol)'],
    posologyVo: ['Quetiapina/risperidona conforme psiquiatria'],
    posologyHosp: ['Haloperidol IM/EV titulado na agitação']
  },
  antidote: {
    indications: ['Intoxicação/overdose específica'],
    ciAbs: ['Hipersensibilidade (raro)'],
    ciRel: ['Usar conforme protocolo toxicológico'],
    posologyVo: ['Conforme antídoto'],
    posologyHosp: ['Dose de ataque + manutenção conforme guideline']
  },
  electrolyte: {
    indications: ['Distúrbio hidroeletrolítico', 'Eclâmpsia (MgSO₄)', 'Hipocalcemia'],
    ciAbs: ['Hipercalemia (KCl)', 'Anúria (KCl)', 'Bradicardia/Mg (MgSO₄ em intoxicação)'],
    ciRel: ['DRC — cautela com K, Mg', 'Monitorizar ECG em reposição de K/Mg'],
    posologyVo: ['Suplementação oral conforme déficit'],
    posologyHosp: ['EV lento com monitorização; nunca push rápido de KCl']
  },
  antimalarial: {
    indications: ['Malária aguda', 'Profilaxia (contexto específico)'],
    ciAbs: ['Hipersensibilidade', 'Porfiria (quinina)'],
    ciRel: ['G6PD (primaquina)', 'Gestação — artesunato em malária grave', 'QT (hidroxicloroquina)'],
    posologyVo: ['Esquema conforme espécie e resistência'],
    posologyHosp: ['Artesunato EV na malária grave']
  },
  antithyroid: {
    indications: ['Tempestade tireotóxica', 'Hipertireoidismo agudo'],
    ciAbs: ['Hipersensibilidade'],
    ciRel: ['Gestação — PTU 1º trimestre, tiamazol depois', 'Agranulocitose — monitorizar'],
    posologyVo: ['Tiamazol 10–20 mg 8/8 h'],
    posologyHosp: ['PTU 200 mg 4/4 h na tempestade + betabloqueador + iodeto']
  },
  ccb: {
    indications: ['Hipertensão', 'Angina', 'Arritmia supraventricular (verapamil)'],
    ciAbs: ['Choque cardiogênico', 'Bloqueio AV avançado', 'Insuficiência cardíaca descompensada (verapamil/diltiazem)'],
    ciRel: ['Gestação', 'Constipação (verapamil)'],
    posologyVo: ['Amlodipino 5–10 mg 24/24 h; verapamil 80 mg 8/8 h'],
    posologyHosp: ['EV se disponível (verapamil — monitorizar ECG)']
  },
  acei: {
    indications: ['Hipertensão', 'IC', 'Nefroproteção'],
    ciAbs: ['Gestação', 'Angioedema prévio', 'Estenose bilateral artéria renal'],
    ciRel: ['DRC', 'Hipercalemia', 'Uso concomitante AINE'],
    posologyVo: ['Captopril 25–50 mg 8/8 h; enalapril 10–20 mg 12/12 h'],
    posologyHosp: ['Captopril sublingual na crise hipertensiva selecionada']
  },
  arb: {
    indications: ['Hipertensão', 'IC', 'Alternativa ao IECA'],
    ciAbs: ['Gestação', 'Angioedema'],
    ciRel: ['DRC', 'Hipercalemia'],
    posologyVo: ['Losartana 50–100 mg 24/24 h'],
    posologyHosp: ['VO preferível; equivalente ao IECA na IC']
  },
  beta_blocker: {
    indications: ['Hipertensão', 'IC estável', 'Arritmia', 'Profilaxia enxaqueca', 'Controle FC tireotóxico'],
    ciAbs: ['Asma grave descompensada', 'Bloqueio AV avançado', 'Bradicardia sintomática'],
    ciRel: ['DPOC (beta-1 seletivo preferível)', 'Diabetes — mascarar hipoglicemia', 'Insuficiência cardíaca aguda descompensada'],
    posologyVo: ['Propranolol 40 mg 12/12 h; metoprolol 25–100 mg 12/12 h'],
    posologyHosp: ['Labetalol EV na crise hipertensiva; esmolol EV na taquicardia']
  },
  diuretic: {
    indications: ['Edema', 'IC descompensada', 'Hipertensão'],
    ciAbs: ['Anúria', 'Hipovolemia grave'],
    ciRel: ['DRC — monitorizar eletrólitos', 'Gota', 'Diabetes — monitorizar glicemia'],
    posologyVo: ['Furosemida 40 mg 24/24 h (ajustar)'],
    posologyHosp: ['Furosemida 40–80 mg EV; repetir conforme diurese']
  },
  vasodilator: {
    indications: ['Crise hipertensiva', 'Angina', 'IC aguda'],
    ciAbs: ['Hipotensão', 'Uso de PDE5i (nitroglicerina)'],
    ciRel: ['Estenose aórtica grave', 'TCE/hemorragia (nitroprussiato)'],
    posologyVo: ['Hidralazina 25–50 mg 8/8 h'],
    posologyHosp: ['Nitroglicerina EV; hidralazina EV/IM titulada']
  },
  antihistamine: {
    indications: ['Urticária', 'Rinite alérgica', 'Anafilaxia adjuvante (H1)'],
    ciAbs: ['Hipersensibilidade'],
    ciRel: ['Glaucoma de ângulo fechado (1ª geração)', 'Prostatismo', 'Sedação — evitar dirigir'],
    posologyVo: ['Loratadina 10 mg 24/24 h; difenidramina 25–50 mg 6/6 h'],
    posologyHosp: ['Difenidramina EV/IM na anafilaxia']
  },
  antispasmodic: {
    indications: ['Cólica abdominal', 'Cólica renal/biliar adjuvante'],
    ciAbs: ['Glaucoma de ângulo fechado', 'Obstrução GI', 'Megacólon tóxico'],
    ciRel: ['Hipertrofia prostática', 'Taquiarritmia', 'Idoso — delirium'],
    posologyVo: ['Escopolamina/drotaverina conforme apresentação'],
    posologyHosp: ['Escopolamina 20 mg/1 mL amp IM/EV lento + analgésico']
  },
  muscle_relaxant: {
    indications: ['Espasmo muscular agudo', 'Cervicalgia/lombalgia'],
    ciAbs: ['Hipersensibilidade', 'Uso concomitante IMAO (ciclobenzaprina)'],
    ciRel: ['Glaucoma', 'Hipertrofia prostática', 'Insuficiência hepática'],
    posologyVo: ['Ciclobenzaprina 5–10 mg 8/8 h ou à noite × 5–7 dias'],
    posologyHosp: ['Preferir VO; curso curto']
  },
  antivertigo: {
    indications: ['Vertigem aguda', 'Cinetose'],
    ciAbs: ['Glaucoma de ângulo fechado', 'Obstrução GI'],
    ciRel: ['Idoso — sedação', 'Prostatismo'],
    posologyVo: ['Dimenidrinato 50–100 mg 8/8 h'],
    posologyHosp: ['EV/IM se disponível']
  },
  glycopeptide: {
    indications: ['MRSA', 'Enterococcus resistente', 'Profilaxia cirúrgica selecionada'],
    ciAbs: ['Hipersensibilidade'],
    ciRel: ['DRC — ajuste e monitorizar níveis', 'Síndrome do homem vermelho (infusão rápida)'],
    posologyVo: ['Uso hospitalar na maioria'],
    posologyHosp: ['Vancomicina 15–20 mg/kg EV 8–12 h; ajustar DRC']
  },
  lincosamide: {
    indications: ['Infecção anaeróbia', 'Pele/partes moles', 'Alternativa em alergia à penicilina'],
    ciAbs: ['Hipersensibilidade'],
    ciRel: ['Colite por C. difficile', 'Miastenia gravis', 'Gestação — evitar se possível'],
    posologyVo: ['Clindamicina 300 mg 6/6 h'],
    posologyHosp: ['600 mg EV 8/8 h']
  },
  tetracycline: {
    indications: ['Acne', 'IST (clamídia)', 'Zoonoses (leptospirose, rickettsia)'],
    ciAbs: ['Gestação e lactação', 'Crianças < 8 anos (dentes/esmalte)'],
    ciRel: ['Insuficiência hepática', 'Fotossensibilidade'],
    posologyVo: ['Doxiciclina 100 mg 12/12 h'],
    posologyHosp: ['VO preferível; EV se formulário disponível']
  },
  antiprotozoal: {
    indications: ['Infecção anaeróbia', 'Giardíase', 'Amebíase', 'Combinação intra-abdominal'],
    ciAbs: ['Hipersensibilidade', '1º trimestre gestação (relativo)'],
    ciRel: ['Uso de álcool — efeito dissulfiram (metronidazol)', 'DRC — ajuste'],
    posologyVo: ['Metronidazol 400–500 mg 8/8 h'],
    posologyHosp: ['500 mg EV 8/8 h']
  },
  antiviral: {
    indications: ['Herpes', 'Influenza', 'HIV (contexto específico)'],
    ciAbs: ['Hipersensibilidade'],
    ciRel: ['DRC — ajuste aciclovir/oseltamivir', 'Gestação — oseltamivir indicado na influenza grave'],
    posologyVo: ['Aciclovir 400 mg 8/8 h; oseltamivir 75 mg 12/12 h × 5 dias'],
    posologyHosp: ['Aciclovir EV em herpes disseminado/SNC']
  },
  h2_blocker: {
    indications: ['DRGE leve', 'Profilaxia úlcera de estresse (alternativa ao IBP)'],
    ciAbs: ['Hipersensibilidade'],
    ciRel: ['DRC — ajuste', 'Interações (ranitidina retirada em muitos mercados)'],
    posologyVo: ['Famotidina 40 mg 24/24 h (alternativa)'],
    posologyHosp: ['EV se indicado']
  },
  hormone: {
    indications: ['HDA varicosa (octreotide/terlipressina)', 'Hormônio específico'],
    ciAbs: ['Hipersensibilidade'],
    ciRel: ['Doença vascular periférica (terlipressina)'],
    posologyVo: ['Conforme indicação'],
    posologyHosp: ['Infusão EV conforme protocolo HDA']
  },
  antiinflammatory: {
    indications: ['Gota aguda', 'Pericardite'],
    ciAbs: ['Insuficiência renal/hepática grave', 'Gestação'],
    ciRel: ['DRC', 'Uso concomitante macrolídeo/estatina (colchicina)'],
    posologyVo: ['Colchicina 0,5 mg — esquema baixa dose na gota'],
    posologyHosp: ['Colchicina VO se tolerado']
  },
  uricosuric: {
    indications: ['Profilaxia de gota (não na crise aguda)'],
    ciAbs: ['Crise aguda de gota', 'Nefrolitíase por ácido úrico'],
    ciRel: ['DRC', 'Iniciar após resolução da crise'],
    posologyVo: ['Alopurinol 100–300 mg 24/24 h'],
    posologyHosp: ['Não iniciar na crise aguda']
  },
  vitamin: {
    indications: ['Deficiência documentada', 'Abstinência alcoólica (tiamina)'],
    ciAbs: ['Hipersensibilidade'],
    ciRel: ['Administrar tiamina antes de glicose na Wernicke'],
    posologyVo: ['Tiamina 100 mg 8/8 h × 3–5 dias (abstinência)'],
    posologyHosp: ['Tiamina 500 mg EV 8/8 h × 3 dias na abstinência']
  },
  osmotic: {
    indications: ['Hipertensão intracraniana', 'Edema cerebral'],
    ciAbs: ['Anúria', 'Desidratação grave', 'Edema pulmonar'],
    ciRel: ['Insuficiência cardíaca', 'DRC'],
    posologyVo: ['Uso hospitalar'],
    posologyHosp: ['Manitol 0,25–1 g/kg EV; monitorizar osmolalidade']
  },
  thyroid_hormone: {
    indications: ['Hipotireoidismo'],
    ciAbs: ['Tireotoxicose não tratada', 'IAM agudo (relativo)'],
    ciRel: ['Cardiopatia — iniciar dose baixa'],
    posologyVo: ['Levotiroxina 25–100 mcg 24/24 h em jejum'],
    posologyHosp: ['VO; EV raramente']
  },
  alpha_blocker: {
    indications: ['HPB', 'Cólica renal (tamsulosina na alta)'],
    ciAbs: ['Hipersensibilidade'],
    ciRel: ['Hipotensão ortostática', 'Cirurgia de catarata (IFIS)'],
    posologyVo: ['Tamsulosina 0,4 mg 24/24 h'],
    posologyHosp: ['Preferir alta ambulatorial']
  },
  non_drug: {
    indications: ['Hipoxemia', 'Enxaqueca/crises com componente hipóxico'],
    ciAbs: ['Sem contraindicação absoluta em hipoxemia grave'],
    ciRel: ['DPOC — titular FiO₂ (risco retenção CO₂)'],
    posologyVo: ['—'],
    posologyHosp: ['O₂ titulado por SpO₂ ou gasometria; máscara reservatório se indicado']
  },
  discharge_only: {
    indications: ['Conforme protocolo de alta'],
    ciAbs: [],
    ciRel: [],
    posologyVo: ['Conforme orientação de alta'],
    posologyHosp: ['Não indicado na emergência aguda']
  },
  tricyclic: {
    indications: ['Depressão', 'Profilaxia enxaqueca', 'Neuropatia crônica'],
    ciAbs: ['IAM recente', 'Prolongamento QT', 'Glaucoma de ângulo fechado', 'Retenção urinária aguda'],
    ciRel: ['Idoso', 'Epilepsia', 'Gestação', 'Hipertireoidismo'],
    posologyVo: ['Iniciar dose baixa à noite; titular semanalmente'],
    posologyHosp: ['VO preferível; evitar IV']
  },
  antidepressant: {
    indications: ['Depressão', 'Ansiedade', 'TOC', 'TEPT'],
    ciAbs: ['Uso concomitante de IMAO (14 dias)', 'Hipersensibilidade'],
    ciRel: ['Gestação/lactação', 'Prolongamento QT', 'Epilepsia', 'Idoso'],
    posologyVo: ['Iniciar dose baixa; titular conforme resposta (4–6 semanas)'],
    posologyHosp: ['VO preferível; monitorizar ideação suicida no início']
  },
  antiarrhythmic: {
    indications: ['Arritmias supraventriculares', 'Fibrilação/flutter', 'Taquicardia ventricular (contexto específico)'],
    ciAbs: ['Bradicardia sinusal', 'BAV avançado sem marcapasso', 'Hipersensibilidade'],
    ciRel: ['Prolongamento QT', 'Insuficiência cardíaca', 'DRC', 'Gestação (amiodarona)'],
    posologyVo: ['Conforme bula e monitorização ECG'],
    posologyHosp: ['EV/infusão em ambiente monitorizado; titular conforme ECG']
  },
  statin: {
    indications: ['Dislipidemia', 'Prevenção primária/secundária cardiovascular'],
    ciAbs: ['Doença hepática ativa', 'Gestação/lactação'],
    ciRel: ['Miopatia prévia', 'Interações CYP3A4', 'DRC — preferir doses moderadas'],
    posologyVo: ['Dose noturna (sinvastatina) ou qualquer horário (atorvastatina)'],
    posologyHosp: ['Manter VO se já em uso; iniciar pós-SCA conforme protocolo']
  },
  nitrofuran: {
    indications: ['ITU baixa não complicada', 'Profilaxia ITU recorrente'],
    ciAbs: ['DFG < 30', 'Deficiência G6PD', 'Gestação a termo'],
    ciRel: ['Insuficiência hepática', 'Neuropatia periférica (uso prolongado)'],
    posologyVo: ['100 mg 12/12 h × 5 dias ou dose única noturna profilática'],
    posologyHosp: ['Preferir VO; não usar em pielonefrite']
  }
};

function medClassLabel (classId) {
  return MED_CLASS_LABELS[classId] || classId;
}

function medClassDefaults (classes) {
  const merged = {
    indications: [],
    ciAbs: [],
    ciRel: [],
    posologyVo: [],
    posologyHosp: []
  };
  const seen = { indications: new Set(), ciAbs: new Set(), ciRel: new Set(), posologyVo: new Set(), posologyHosp: new Set() };
  (classes || []).forEach(cls => {
    const def = MED_CLASS_DEFAULTS[cls];
    if (!def) return;
    ['indications', 'ciAbs', 'ciRel', 'posologyVo', 'posologyHosp'].forEach(key => {
      (def[key] || []).forEach(item => {
        if (!seen[key].has(item)) {
          seen[key].add(item);
          merged[key].push(item);
        }
      });
    });
  });
  return merged;
}
