/* Medicações — catálogo clínico (gerado + revisado jun/2026) */
/* eslint-disable max-len */

const MEDHUB_MED_BUILD = 'med-v6-batch2';

const MED_EXTRA_DRUGS = {
  "nitrofurantoina": {
    "name": "Nitrofurantoína",
    "classes": [
      "antibiotic",
      "nitrofuran"
    ],
    "indications": [
      "ITU baixa não complicada",
      "Profilaxia recorrente"
    ],
    "ciAbs": [
      "DFG < 30",
      "Gestação a termo",
      "Deficiência G6PD"
    ],
    "ciRel": [
      "Insuficiência hepática"
    ],
    "presentations": [
      "100 mg cápsula/comprimido"
    ],
    "posologyVo": [
      "100 mg VO 12/12 h × 5 dias (ITU)",
      "100 mg VO à noite profilaxia"
    ],
    "posologyHosp": [
      "Preferir VO; suspender se DFG baixo"
    ],
    "notes": "Não usar em pielonefrite."
  },
  "fosfomicina": {
    "name": "Fosfomicina trometamol",
    "classes": [
      "antibiotic"
    ],
    "indications": [
      "ITU baixa não complicada (E. coli)"
    ],
    "ciAbs": [
      "Hipersensibilidade"
    ],
    "ciRel": [
      "Insuficiência renal grave"
    ],
    "presentations": [
      "3 g envelope granulado"
    ],
    "posologyVo": [
      "3 g VO dose única (dissolver em água)"
    ],
    "posologyHosp": [
      "VO preferível"
    ],
    "notes": "Esquema dose única — aderência favorável."
  },
  "topiramato": {
    "name": "Topiramato",
    "classes": [
      "anticonvulsant"
    ],
    "indications": [
      "Profilaxia enxaqueca",
      "Epilepsia"
    ],
    "ciAbs": [
      "Hipersensibilidade"
    ],
    "ciRel": [
      "Gestação (categoria D)",
      "Glaucoma de ângulo fechado",
      "Litíase renal"
    ],
    "presentations": [
      "25 mg, 50 mg, 100 mg comprimido"
    ],
    "posologyVo": [
      "25 mg VO à noite; titular 25 mg/semana até 50–100 mg 12/12 h"
    ],
    "posologyHosp": [
      "VO preferível"
    ],
    "notes": "Parestesias e redução peso comuns."
  },
  "amitriptilina": {
    "name": "Amitriptilina",
    "classes": [
      "tricyclic"
    ],
    "indications": [
      "Profilaxia enxaqueca",
      "Neuropatia",
      "Depressão"
    ],
    "ciAbs": [
      "IAM recente",
      "Prolongamento QT",
      "Glaucoma de ângulo fechado"
    ],
    "ciRel": [
      "Idoso",
      "Epilepsia",
      "Gestação"
    ],
    "presentations": [
      "25 mg comprimido"
    ],
    "posologyVo": [
      "25 mg VO à noite (titular até 75 mg)"
    ],
    "posologyHosp": [
      "VO preferível"
    ],
    "notes": "Anticolinérgico — cautela em idoso."
  },
  "tizanidina": {
    "name": "Tizanidina",
    "classes": [
      "muscle_relaxant"
    ],
    "indications": [
      "Espasmo muscular",
      "Lombalgia"
    ],
    "ciAbs": [
      "Insuficiência hepática grave"
    ],
    "ciRel": [
      "Hipotensão",
      "Uso com ciprofloxacino (toxicidade)"
    ],
    "presentations": [
      "2 mg comprimido"
    ],
    "posologyVo": [
      "2 mg VO 8/8 h; máx. 36 mg/dia"
    ],
    "posologyHosp": [
      "VO preferível"
    ],
    "notes": "Sedação e hipotensão."
  },
  "espironolactona": {
    "name": "Espironolactona",
    "classes": [
      "diuretic"
    ],
    "indications": [
      "IC com FE reduzida",
      "Hipertensão",
      "Ascite",
      "Hiperaldosteronismo"
    ],
    "ciAbs": [
      "Anúria",
      "Hipercalemia",
      "Addison"
    ],
    "ciRel": [
      "DRC",
      "Gestação"
    ],
    "presentations": [
      "25 mg, 50 mg comprimido"
    ],
    "posologyVo": [
      "25–50 mg VO 24/24 h (IC); 100 mg/dia ascite"
    ],
    "posologyHosp": [
      "VO ou EV se formulação disponível"
    ],
    "notes": "Monitorizar K+ e creatinina."
  },
  "carvedilol": {
    "name": "Carvedilol",
    "classes": [
      "beta_blocker"
    ],
    "indications": [
      "IC com FE reduzida",
      "Hipertensão"
    ],
    "ciAbs": [
      "Asma grave",
      "BAV avançado",
      "IC descompensada aguda"
    ],
    "ciRel": [
      "DPOC",
      "Diabetes"
    ],
    "presentations": [
      "3,125 mg, 6,25 mg, 25 mg comprimido"
    ],
    "posologyVo": [
      "3,125 mg VO 12/12 h; titular até 25 mg 12/12 h"
    ],
    "posologyHosp": [
      "Iniciar baixa dose após estabilização IC aguda"
    ],
    "notes": "Bloqueio alfa + beta."
  },
  "nifedipino": {
    "name": "Nifedipino",
    "classes": [
      "ccb"
    ],
    "indications": [
      "Hipertensão",
      "Angina",
      "Tocolise (contexto específico)"
    ],
    "ciAbs": [
      "Choque cardiogênico",
      "Angina instável sem betabloqueador"
    ],
    "ciRel": [
      "Estenose aórtica",
      "Taquicardia reflexa (liberação imediata)"
    ],
    "presentations": [
      "10 mg, 20 mg cápsula",
      "30 mg OROS"
    ],
    "posologyVo": [
      "10 mg cápsula 8/8 h (urgência — cautela)",
      "30–60 mg OROS 24/24 h"
    ],
    "posologyHosp": [
      "Preferir anlodipino ou EV alternativo"
    ],
    "notes": "Liberação imediata — hipotensão abrupta."
  },
  "hidroclorotiazida": {
    "name": "Hidroclorotiazida",
    "classes": [
      "diuretic"
    ],
    "indications": [
      "Hipertensão",
      "Edema leve"
    ],
    "ciAbs": [
      "Anúria",
      "Hipersensibilidade sulfonamidas"
    ],
    "ciRel": [
      "Gota",
      "Diabetes",
      "Hiponatremia"
    ],
    "presentations": [
      "25 mg, 50 mg comprimido"
    ],
    "posologyVo": [
      "25 mg VO 24/24 h (HAS)"
    ],
    "posologyHosp": [
      "VO preferível"
    ],
    "notes": "Hiponatremia e hipocalemia."
  },
  "simvastatina": {
    "name": "Sinvastatina",
    "classes": [
      "statin"
    ],
    "indications": [
      "Dislipidemia",
      "Prevenção cardiovascular"
    ],
    "ciAbs": [
      "Doença hepática ativa",
      "Gestação/lactação"
    ],
    "ciRel": [
      "Uso com claritromicina/verapamil (máx. 20 mg)",
      "Miopatia prévia"
    ],
    "presentations": [
      "20 mg, 40 mg comprimido"
    ],
    "posologyVo": [
      "20–40 mg VO à noite"
    ],
    "posologyHosp": [
      "Manter VO se indicado"
    ],
    "notes": "Interações CYP3A4."
  },
  "atorvastatina": {
    "name": "Atorvastatina",
    "classes": [
      "statin"
    ],
    "indications": [
      "Dislipidemia",
      "SCA (alta dose)"
    ],
    "ciAbs": [
      "Doença hepática ativa",
      "Gestação"
    ],
    "ciRel": [
      "Miopatia",
      "DRC"
    ],
    "presentations": [
      "10 mg, 20 mg, 40 mg, 80 mg comprimido"
    ],
    "posologyVo": [
      "10–80 mg VO 24/24 h"
    ],
    "posologyHosp": [
      "40–80 mg pós-SCA"
    ],
    "notes": "Monitorizar CPK se mialgia."
  },
  "fenilefrina": {
    "name": "Fenilefrina",
    "classes": [
      "vasopressor"
    ],
    "indications": [
      "Hipotensão (anestesia)",
      "Rinite (tópica)"
    ],
    "ciAbs": [
      "Taquiarritmia",
      "Feocromocitoma"
    ],
    "ciRel": [
      "HAS",
      "Doença coronariana"
    ],
    "presentations": [
      "10 mg/mL ampola EV",
      "gotas nasais OTC"
    ],
    "posologyHosp": [
      "50–200 mcg EV bolus; infusão titulada"
    ],
    "posologyVo": [
      "Uso sistêmico VO não usual"
    ],
    "notes": "Vasoconstrictor alfa — preferir noradrenalina no choque séptico."
  },
  "nistatina": {
    "name": "Nistatina",
    "classes": [
      "antibiotic"
    ],
    "indications": [
      "Candidíase oral (sapinho)",
      "Candidíase vulvovaginal leve",
      "Intertrigo por Candida"
    ],
    "ciAbs": [
      "Hipersensibilidade"
    ],
    "ciRel": [
      "Insuficiência hepática grave (uso sistêmico prolongado)"
    ],
    "presentations": [
      "100.000 UI/mL suspensão oral",
      "100.000 UI comprimido vaginal",
      "Creme tópico 100.000 UI/g"
    ],
    "posologyVo": [
      "Suspensão: gargarejar e deglutir 4–6 mL 6/6 h × 7–14 dias",
      "Óvulo vaginal 100.000 UI 24/24 h × 14 dias"
    ],
    "posologyHosp": [
      "Preferir VO/tópico; suspensão oral igual ambulatorial"
    ],
    "notes": "Não absorvida VO — segura na gestação para uso tópico/oral local. Candidíase esofágica grave: fluconazol."
  },
  "terbinafina": {
    "name": "Terbinafina",
    "classes": [
      "antibiotic"
    ],
    "indications": [
      "Tinea corporis/capitis/cruris/pedis",
      "Onicomicose dermatofítica"
    ],
    "ciAbs": [
      "Insuficiência hepática ativa",
      "Hipersensibilidade"
    ],
    "ciRel": [
      "DRC — ajustar dose",
      "Interação com inibidores CYP2D6",
      "Psoríase (piora possível)"
    ],
    "presentations": [
      "250 mg comprimido",
      "Creme 1%",
      "Solução tópica 1%"
    ],
    "posologyVo": [
      "250 mg VO 24/24 h × 2 sem (corporal/pedis)",
      "250 mg VO 24/24 h × 6–12 sem (unha)",
      "Creme 1% tópico 12/12 h × 1–2 sem"
    ],
    "posologyHosp": [
      "VO preferível; EV não usual no PS"
    ],
    "notes": "Monitorizar transaminases se curso > 6 sem. Alternativa tópica se infecção limitada."
  },
  "hidroxizina": {
    "name": "Hidroxizina",
    "classes": [
      "antihistamine"
    ],
    "indications": [
      "Prurido",
      "Urticária aguda",
      "Ansiedade adjuvante",
      "Sedação pré-procedimento leve"
    ],
    "ciAbs": [
      "Prolongamento QT congênito",
      "Porfiria",
      "Gestação 1º trimestre (relativo)"
    ],
    "ciRel": [
      "Idoso",
      "Glaucoma de ângulo fechado",
      "Retenção urinária",
      "Uso com outros sedativos"
    ],
    "presentations": [
      "25 mg comprimido",
      "2 mg/mL xarope"
    ],
    "posologyVo": [
      "25 mg VO 6/8 h (prurido/urticária)",
      "25–50 mg VO à noite (ansiedade/prurido noturno)"
    ],
    "posologyHosp": [
      "25–50 mg VO/IM (prurido pós-opiáceo)",
      "EV profundo se VO indisponível — cautela QT"
    ],
    "notes": "Anticolinérgico — evitar em idoso frágil. Preferir anti-H1 2ª geração se sedação indesejada."
  },
  "lactulose": {
    "name": "Lactulose",
    "classes": [
      "antispasmodic"
    ],
    "indications": [
      "Constipação funcional",
      "Encefalopatia hepática (adjuvante)",
      "Preparo intestinal leve"
    ],
    "ciAbs": [
      "Galactosemia",
      "Obstrução intestinal"
    ],
    "ciRel": [
      "Diabetes (contém lactose/galactose)",
      "Desidratação"
    ],
    "presentations": [
      "667 mg/mL solução oral (10 g/15 mL)",
      "Sachê 10 g"
    ],
    "posologyVo": [
      "15–30 mL VO 12/12 h; titular até 2–3 evacuações/dia",
      "Encefalopatia: 30–45 mL 8/8 h (protocolo hepatologia)"
    ],
    "posologyHosp": [
      "VO preferível; mesmo esquema ambulatorial"
    ],
    "notes": "Efeito em 24–48 h. Flatulência comum no início."
  },
  "mesalazina": {
    "name": "Mesalazina",
    "classes": [
      "antiinflammatory"
    ],
    "indications": [
      "Doença inflamatória intestinal (retocolite ulcerativa)",
      "Profilaxia recorrência diverticulite (selecionado)"
    ],
    "ciAbs": [
      "Insuficiência renal grave (DFG < 30)",
      "Hipersensibilidade salicilatos"
    ],
    "ciRel": [
      "Asma/intolerância AAS",
      "Monitorizar função renal e hematológica"
    ],
    "presentations": [
      "400 mg, 800 mg comprimido",
      "500 mg supositório/retenção",
      "1–4 g/sachê granulado"
    ],
    "posologyVo": [
      "2–4 g/dia VO dividido (DII leve-moderada)",
      "Supositório 500 mg–1 g 24/24 h (proctite)"
    ],
    "posologyHosp": [
      "VO preferível; manter dose habitual se internado por DII"
    ],
    "notes": "Não usar como monoterapia na diverticulite aguda complicada."
  },
  "sulfasalazina": {
    "name": "Sulfasalazina",
    "classes": [
      "antiinflammatory"
    ],
    "indications": [
      "Artrite reumatoide",
      "Doença inflamatória intestinal",
      "Espondiloartrite"
    ],
    "ciAbs": [
      "Porfiria",
      "Obstrução urinária/intestinal",
      "Hipersensibilidade sulfonamidas",
      "Deficiência G6PD"
    ],
    "ciRel": [
      "Gestação/lactação",
      "Alergia AAS",
      "Monitorizar hemograma e transaminases"
    ],
    "presentations": [
      "500 mg comprimido"
    ],
    "posologyVo": [
      "500 mg VO 12/12 h × 1 sem; titular até 2–3 g/dia dividido",
      "Iniciar baixo — rash e náusea comuns"
    ],
    "posologyHosp": [
      "VO preferível; suspender se reação grave"
    ],
    "notes": "Suplementar ácido fólico 5 mg/dia. Reação idiossincrática febre/rash — suspender."
  },
  "meloxicam": {
    "name": "Meloxicam",
    "classes": [
      "nsaid"
    ],
    "indications": [
      "Osteoartrite",
      "Artrite reumatoide",
      "Dor musculoesquelética"
    ],
    "ciAbs": [
      "Úlcera GI ativa",
      "Insuficiência renal/hepática grave",
      "3º trimestre gestação",
      "DRC terminal"
    ],
    "ciRel": [
      "DRC",
      "IC",
      "HAS",
      "Idoso",
      "Anticoagulação",
      "Dengue — evitar"
    ],
    "presentations": [
      "7,5 mg, 15 mg comprimido"
    ],
    "posologyVo": [
      "7,5–15 mg VO 24/24 h",
      "Usar menor dose eficaz e menor tempo possível"
    ],
    "posologyHosp": [
      "15 mg VO 24/24 h curto prazo se sem contraindicação"
    ],
    "notes": "Preferir AINE alternativo se risco GI elevado; IBP se necessário."
  },
  "indometacina": {
    "name": "Indometacina",
    "classes": [
      "nsaid"
    ],
    "indications": [
      "Gota aguda",
      "Pericardite (contexto específico)",
      "Dor inflamatória intensa"
    ],
    "ciAbs": [
      "Úlcera GI ativa",
      "Insuficiência renal grave",
      "Gestação 3º trimestre"
    ],
    "ciRel": [
      "HAS",
      "IC",
      "Idoso",
      "Epilepsia",
      "DRC"
    ],
    "presentations": [
      "25 mg, 50 mg cápsula",
      "75 mg supositório"
    ],
    "posologyVo": [
      "Gota: 50 mg VO 8/8 h × 2 dias; depois reduzir",
      "25 mg VO 8/8 h (dor moderada)"
    ],
    "posologyHosp": [
      "50 mg VO/retal 8/8 h (gota/cólica) — evitar EV"
    ],
    "notes": "Mais efeitos adversos que outros AINEs — usar curso curto na gota."
  },
  "atenolol": {
    "name": "Atenolol",
    "classes": [
      "beta_blocker"
    ],
    "indications": [
      "Hipertensão arterial",
      "Angina estável",
      "Controle FC (FA/flutter — alternativa)"
    ],
    "ciAbs": [
      "Asma/broncoespasmo grave",
      "BAV 2º/3º grau",
      "Bradicardia sintomática",
      "IC descompensada aguda"
    ],
    "ciRel": [
      "DPOC",
      "Diabetes (mascara hipoglicemia)",
      "DRC — acumula",
      "Depressão"
    ],
    "presentations": [
      "25 mg, 50 mg, 100 mg comprimido"
    ],
    "posologyVo": [
      "25–50 mg VO 24/24 h (HAS); titular até 100 mg",
      "50 mg VO 24/24 h (angina)"
    ],
    "posologyHosp": [
      "5 mg EV lento (FA — se protocolo institucional)",
      "Manter VO se estável"
    ],
    "notes": "Betabloqueador cardioseletivo. Não suspender abruptamente."
  },
  "bromazepam": {
    "name": "Bromazepam",
    "classes": [
      "benzodiazepine"
    ],
    "indications": [
      "Ansiedade aguda",
      "Insônia situacional",
      "Sedação leve ambulatorial"
    ],
    "ciAbs": [
      "Miastenia gravis",
      "Apneia do sono grave",
      "Insuficiência respiratória grave"
    ],
    "ciRel": [
      "Idoso",
      "Gestação/lactação",
      "Dependência prévia",
      "Uso concomitante opioides/alcohol"
    ],
    "presentations": [
      "3 mg, 6 mg comprimido"
    ],
    "posologyVo": [
      "3–6 mg VO 8/8 h (ansiedade)",
      "3–6 mg VO à noite (insônia) — curto prazo ≤ 2–4 sem"
    ],
    "posologyHosp": [
      "Preferir diazepam/lorazepam EV se sedação hospitalar"
    ],
    "notes": "Receita B1. Evitar uso crônico; risco de dependência."
  },
  "candesartana": {
    "name": "Candesartana",
    "classes": [
      "arb"
    ],
    "indications": [
      "Hipertensão arterial",
      "Insuficiência cardíaca (adjuvante)",
      "Nefroproteção em DRC/diabetes"
    ],
    "ciAbs": [
      "Gestação 2º/3º trimestre",
      "Estenose bilateral artéria renal"
    ],
    "ciRel": [
      "DRC",
      "Hipercalemia",
      "Estenose aórtica hemodinamicamente significativa"
    ],
    "presentations": [
      "8 mg, 16 mg, 32 mg comprimido"
    ],
    "posologyVo": [
      "8–16 mg VO 24/24 h (HAS)",
      "Titular até 32 mg 24/24 h"
    ],
    "posologyHosp": [
      "Manter dose VO habitual se internado"
    ],
    "notes": "Monitorizar K+ e creatinina ao iniciar."
  },
  "ketoconazol": {
    "name": "Ketoconazol",
    "classes": [
      "antibiotic"
    ],
    "indications": [
      "Dermatofitoses extensas (alternativa)",
      "Candidíase cutânea/mucosa (tópico preferível)"
    ],
    "ciAbs": [
      "Insuficiência hepática",
      "Gestação",
      "Uso com quinidina/cisaprida/lovastatina"
    ],
    "ciRel": [
      "Interações CYP3A4 extensas",
      "Monitorizar transaminases se VO"
    ],
    "presentations": [
      "200 mg comprimido",
      "Creme/shampoo 2%"
    ],
    "posologyVo": [
      "200 mg VO 24/24 h × 2–4 sem (micose sistêmica — preferir itraconazol/fluconazol hoje)",
      "Shampoo 2% tópico 2×/sem (caspa)"
    ],
    "posologyHosp": [
      "VO preferível; evitar VO sistêmico se alternativa"
    ],
    "notes": "Uso sistêmico em declínio — hepatotoxicidade. Preferir terbinafina/fluconazol conforme indicação."
  },
  "finasterida": {
    "name": "Finasterida",
    "classes": [
      "hormone"
    ],
    "indications": [
      "Hiperplasia prostática benigna (HPB)",
      "Alopecia androgenética masculina"
    ],
    "ciAbs": [
      "Gestação (teratogênico — mulheres grávidas não manipular)",
      "Hipersensibilidade"
    ],
    "ciRel": [
      "Função hepática alterada",
      "Câncer de próstata — avaliar PSA"
    ],
    "presentations": [
      "5 mg comprimido (HPB)",
      "1 mg comprimido (alopecia)"
    ],
    "posologyVo": [
      "5 mg VO 24/24 h (HPB)",
      "1 mg VO 24/24 h (alopecia) — efeito em meses"
    ],
    "posologyHosp": [
      "VO preferível"
    ],
    "notes": "Efeito na HPB em 3–6 meses. Risco sexual (libido, disfunção erétil) — informar paciente."
  },
  "zolpidem": {
    "name": "Zolpidem",
    "classes": [
      "benzodiazepine"
    ],
    "indications": [
      "Insônia de conciliação (curto prazo)"
    ],
    "ciAbs": [
      "Apneia do sono grave",
      "Insuficiência hepática grave",
      "Miastenia gravis"
    ],
    "ciRel": [
      "Idoso — reduzir dose",
      "Uso concomitante de depressores SNC",
      "Histórico de sonambulismo/complex sleep behaviors"
    ],
    "presentations": [
      "5 mg, 10 mg comprimido",
      "SL 5 mg, 10 mg"
    ],
    "posologyVo": [
      "5–10 mg VO à noite imediatamente antes de deitar (máx. 10 mg)",
      "Idoso: iniciar 5 mg"
    ],
    "posologyHosp": [
      "Evitar no PS salvo insônia aguda — curto prazo"
    ],
    "notes": "Receita B1. Máximo 2–4 semanas. Não usar com álcool."
  },
  "timolol": {
    "name": "Timolol",
    "classes": [
      "beta_blocker"
    ],
    "indications": [
      "Hipertensão ocular (glaucoma)",
      "Profilaxia enxaqueca (VO)",
      "Controle FC/HAS (VO — menos usado)"
    ],
    "ciAbs": [
      "Asma grave",
      "BAV avançado",
      "IC descompensada"
    ],
    "ciRel": [
      "DPOC",
      "Diabetes",
      "Depressão",
      "Uso tópico ocular — absorção sistêmica"
    ],
    "presentations": [
      "0,5% colírio",
      "5 mg, 10 mg comprimido VO"
    ],
    "posologyVo": [
      "Colírio: 1 gota 12/12 h no olho afetado",
      "Profilaxia enxaqueca: 10–20 mg VO 12/12 h"
    ],
    "posologyHosp": [
      "Colírio ou manter VO se indicado"
    ],
    "notes": "Colírio pode causar broncoespasmo sistêmico — pressionar saco lagrimal após instilação."
  },
  "bumetanida": {
    "name": "Bumetanida",
    "classes": [
      "diuretic"
    ],
    "indications": [
      "Edema por IC/insuficiência renal",
      "Edema agudo pulmão (adjuvante)"
    ],
    "ciAbs": [
      "Anúria",
      "Hipovolemia grave",
      "Hiponatremia severa"
    ],
    "ciRel": [
      "Hipocalemia",
      "Gota",
      "Gestação",
      "Uso com aminoglicosídeos (ototoxicidade)"
    ],
    "presentations": [
      "0,5 mg, 1 mg, 2 mg comprimido",
      "0,25 mg/mL ampola IM/EV"
    ],
    "posologyVo": [
      "0,5–2 mg VO 24/24 h; titular conforme diurese"
    ],
    "posologyHosp": [
      "0,5–1 mg EV/IM; repetir conforme resposta",
      "Potência ~40× furosemida mg por mg"
    ],
    "notes": "Monitorizar eletrólitos e função renal."
  },
  "clonidina": {
    "name": "Clonidina",
    "classes": [
      "vasodilator"
    ],
    "indications": [
      "Hipertensão arterial",
      "Síndrome de abstinência opioide/álcool (adjuvante)",
      "Crise hipertensiva selecionada (VO)"
    ],
    "ciAbs": [
      "Bradicardia sinusal",
      "BAV 2º/3º grau"
    ],
    "ciRel": [
      "Depressão",
      "Doença vascular periférica",
      "Nunca suspender abruptamente — crise adrenérgica"
    ],
    "presentations": [
      "0,1 mg, 0,2 mg comprimido",
      "150 mcg/mL solução oral"
    ],
    "posologyVo": [
      "0,1 mg VO 12/12 h; titular 0,2–0,6 mg/dia",
      "Abstinência: esquema taper conforme protocolo"
    ],
    "posologyHosp": [
      "0,1–0,2 mg VO/SL (urgência HAS selecionada)",
      "Patch transdérmico em alguns serviços"
    ],
    "notes": "Sedação e boca seca comuns. Rebound HTN se suspensão brusca."
  },
  "citalopram": {
    "name": "Citalopram",
    "classes": [
      "antidepressant"
    ],
    "indications": [
      "Depressão maior",
      "Transtorno de ansiedade",
      "Transtorno de pânico"
    ],
    "ciAbs": [
      "Uso concomitante IMAO (14 dias)",
      "Prolongamento QT congênito"
    ],
    "ciRel": [
      "Idoso — máx. 20 mg/dia (QT)",
      "Epilepsia",
      "Gestação/lactação",
      "Uso com outros QT-prolongadores"
    ],
    "presentations": [
      "20 mg, 40 mg comprimido"
    ],
    "posologyVo": [
      "20 mg VO 24/24 h; titular até 40 mg (máx. 20 mg se > 60 anos)"
    ],
    "posologyHosp": [
      "VO preferível; efeito em 2–4 semanas"
    ],
    "notes": "Receita B1. Risco de síndrome serotoninérgica com triptanos/IRSN em altas doses."
  },
  "paroxetina": {
    "name": "Paroxetina",
    "classes": [
      "antidepressant"
    ],
    "indications": [
      "Depressão",
      "Ansiedade",
      "TOC",
      "TEPT",
      "Transtorno de pânico"
    ],
    "ciAbs": [
      "IMAO concomitante",
      "Gestação 1º trimestre (relativo — avaliar risco)"
    ],
    "ciRel": [
      "Epilepsia",
      "Sangramento GI (ISRS)",
      "Descontinuação — taper lento (sintomas abstinência)"
    ],
    "presentations": [
      "20 mg, 30 mg comprimido"
    ],
    "posologyVo": [
      "20 mg VO pela manhã 24/24 h; titular até 40–50 mg se necessário"
    ],
    "posologyHosp": [
      "VO preferível"
    ],
    "notes": "Receita B1. Inibidor potente CYP2D6 — checar interações."
  },
  "mirtazapina": {
    "name": "Mirtazapina",
    "classes": [
      "antidepressant"
    ],
    "indications": [
      "Depressão com insônia/hiporexia",
      "Náusea por quimioterapia (off-label baixa dose)"
    ],
    "ciAbs": [
      "Uso concomitante IMAO"
    ],
    "ciRel": [
      "Idoso",
      "Sedação",
      "Ganho de peso",
      "Neutropenia rara"
    ],
    "presentations": [
      "15 mg, 30 mg, 45 mg comprimido ODT"
    ],
    "posologyVo": [
      "15 mg VO à noite; titular 15 mg/semana até 30–45 mg"
    ],
    "posologyHosp": [
      "15 mg VO à noite (depressão com insônia internado)"
    ],
    "notes": "Receita B1. Menos efeito sexual que outros antidepressivos."
  },
  "montelukaste": {
    "name": "Montelukaste",
    "classes": [
      "bronchodilator"
    ],
    "indications": [
      "Asma persistente leve-moderada (adjuvante)",
      "Rinite alérgica",
      "Profilaxia asma induzida por exercício"
    ],
    "ciAbs": [
      "Hipersensibilidade"
    ],
    "ciRel": [
      "Alterações neuropsiquiátricas (sonhos vívidos, agitação — ANVISA alerta)",
      "Doença hepática"
    ],
    "presentations": [
      "10 mg comprimido (adulto)",
      "4 mg, 5 mg (pediátrico)"
    ],
    "posologyVo": [
      "10 mg VO 24/24 h à noite",
      "Tomar 2 h antes ou 2 h após refeição rica em gordura"
    ],
    "posologyHosp": [
      "VO preferível; não usar como broncodilatador agudo"
    ],
    "notes": "Não trata crise asmática aguda — usar salbutamol."
  },
  "teofilina": {
    "name": "Teofilina",
    "classes": [
      "bronchodilator"
    ],
    "indications": [
      "Asma/DPOC refratária (adjuvante)",
      "Apneia do sono infantil (contexto específico)"
    ],
    "ciAbs": [
      "Hipersensibilidade xantinas",
      "Arritmia aguda"
    ],
    "ciRel": [
      "Estreita janela terapêutica",
      "Interações (macrolídeos, ciprofloxacino, fumo)",
      "Monitorizar níveis séricos"
    ],
    "presentations": [
      "100 mg, 200 mg comprimido retard",
      "Solução oral"
    ],
    "posologyVo": [
      "200 mg VO 12/12 h; titular conforme nível (5–15 mcg/mL)"
    ],
    "posologyHosp": [
      "240 mg EV em 20 min (ataque) + manutenção conforme nível — serviço especializado"
    ],
    "notes": "Uso em declínio — preferir LABA/ICS. Toxicidade: náusea, arritmia, convulsão."
  },
  "tiotropio": {
    "name": "Tiotropio",
    "classes": [
      "bronchodilator"
    ],
    "indications": [
      "DPOC manutenção",
      "Asma grave (adjuvante — contexto específico)"
    ],
    "ciAbs": [
      "Hipersensibilidade atropínicos",
      "Glaucoma de ângulo fechado agudo (relativo a contato)"
    ],
    "ciRel": [
      "HPB/retention urinária",
      "Não usar na crise aguda"
    ],
    "presentations": [
      "18 mcg cápsula inalatória (HandiHaler)",
      "2,5 mcg/puff dispositivo Respimat"
    ],
    "posologyVo": [
      "18 mcg inalado 24/24 h (1 cápsula/dia)",
      "Respimat: 2 jatos 24/24 h"
    ],
    "posologyHosp": [
      "Manter inalador se paciente traz de casa; não substituir nebulização aguda"
    ],
    "notes": "Anticolinérgico longa ação — enxague oral após uso (candidíase oral)."
  },
  "beclometasona": {
    "name": "Beclometasona",
    "classes": [
      "corticosteroid"
    ],
    "indications": [
      "Asma persistente (controlador)",
      "Rinite alérgica (spray nasal)"
    ],
    "ciAbs": [
      "Infecção respiratória fúngica não tratada"
    ],
    "ciRel": [
      "DPOC com pneumonia frequente (risco se altas doses)",
      "Candidíase oral — enxaguar boca"
    ],
    "presentations": [
      "50 mcg/jato aerossol",
      "100 mcg/jato HFA",
      "Spray nasal 50 mcg/jato"
    ],
    "posologyVo": [
      "200–400 mcg inalados 12/12 h (asma)",
      "Spray nasal 2 jatos/narina 12/12 h"
    ],
    "posologyHosp": [
      "Manter dose de controle se internado por outra causa"
    ],
    "notes": "Não usar isolado na crise — associar SABA."
  },
  "dexclorfeniramina": {
    "name": "Dexclorfeniramina",
    "classes": [
      "antihistamine"
    ],
    "indications": [
      "Rinite alérgica",
      "Urticária aguda",
      "Prurido"
    ],
    "ciAbs": [
      "Neonatos/prematuros",
      "Uso concomitante IMAO"
    ],
    "ciRel": [
      "Idoso",
      "Glaucoma",
      "HPB",
      "Sedação — evitar dirigir"
    ],
    "presentations": [
      "2 mg comprimido",
      "0,4 mg/mL xarope",
      "0,4 mg/mL solução oral"
    ],
    "posologyVo": [
      "2 mg VO 8/8 h (adulto)",
      "2 mg VO à noite se sedação indesejada de dia"
    ],
    "posologyHosp": [
      "2 mg VO/IM 8/8 h (urticária/prurido)"
    ],
    "notes": "Anti-H1 1ª geração — sedação e anticolinérgico."
  },
  "acido_folico": {
    "name": "Ácido fólico",
    "classes": [
      "vitamin"
    ],
    "indications": [
      "Anemia megaloblástica por deficiência de folato",
      "Suplementação gestação",
      "Uso com metotrexato/sulfasalazina"
    ],
    "ciAbs": [
      "Anemia não investigada (pode mascarar B12)"
    ],
    "ciRel": [
      "Deficiência B12 concomitante — suplementar B12 antes/isoladamente"
    ],
    "presentations": [
      "5 mg comprimido",
      "0,4 mg comprimido (gestação)"
    ],
    "posologyVo": [
      "5 mg VO 24/24 h (deficiência)",
      "0,4–5 mg VO 24/24 h (gestação/planejamento)",
      "5 mg/semana com metotrexato"
    ],
    "posologyHosp": [
      "VO preferível"
    ],
    "notes": "Investigar B12 se anemia macrocítica."
  },
  "risperidona": {
    "name": "Risperidona",
    "classes": [
      "antipsychotic"
    ],
    "indications": [
      "Psicose aguda",
      "Agitação psicótica (baixa dose)",
      "Esquizofrenia manutenção"
    ],
    "ciAbs": [
      "Hipersensibilidade"
    ],
    "ciRel": [
      "Prolongamento QT",
      "Epilepsia",
      "Idoso com demência (risco AVC/mortalidade)",
      "Parkinson — piora motora"
    ],
    "presentations": [
      "1 mg, 2 mg, 3 mg comprimido",
      "1 mg/mL solução",
      "25 mg/2 sem IM LAI"
    ],
    "posologyVo": [
      "1–2 mg VO 12/12 h (agitação/psicose aguda); titular",
      "0,5–1 mg VO à noite (idoso frágil)"
    ],
    "posologyHosp": [
      "1–2 mg VO/IM (agitação — preferir haloperidol no delirium puro)"
    ],
    "notes": "Receita B1. Monitorizar glicemia e prolactina se uso crônico."
  },
  "carbamazepina": {
    "name": "Carbamazepina",
    "classes": [
      "anticonvulsant"
    ],
    "indications": [
      "Epilepsia",
      "Neuralgia do trigêmeo",
      "Estabilizador de humor (bipolar — contexto específico)"
    ],
    "ciAbs": [
      "Bloqueio AV",
      "Porfiria aguda",
      "Uso concomitante IMAO ou voriconazol"
    ],
    "ciRel": [
      "HLA-B*1502 (risco Stevens-Johnson — populações asiáticas)",
      "Indutor CYP — interações",
      "Monitorizar sódio (SIADH)"
    ],
    "presentations": [
      "200 mg, 400 mg comprimido",
      "20 mg/mL suspensão"
    ],
    "posologyVo": [
      "200 mg VO 12/12 h; titular 200 mg/semana até 800–1200 mg/dia",
      "Neuralgia: 100 mg VO 12/12 h; titular"
    ],
    "posologyHosp": [
      "VO preferível; EV não disponível comercialmente no BR usual"
    ],
    "notes": "Receita B1. Iniciar lento — rash e leucopenia."
  },
  "azatioprina": {
    "name": "Azatioprina",
    "classes": [
      "antiinflammatory"
    ],
    "indications": [
      "Doença inflamatória intestinal",
      "Transplante (imunossupressor)",
      "Doenças autoimunes"
    ],
    "ciAbs": [
      "Gestação (relativo — avaliar)",
      "Deficiência TPMT severa"
    ],
    "ciRel": [
      "Infecção ativa",
      "Neoplasia",
      "Monitorizar hemograma e transaminases"
    ],
    "presentations": [
      "50 mg comprimido"
    ],
    "posologyVo": [
      "2–2,5 mg/kg/dia VO (DII)",
      "Iniciar baixo se TPMT desconhecido"
    ],
    "posologyHosp": [
      "VO preferível; manter dose se internado"
    ],
    "notes": "Efeito imunossupressor tardio (semanas). Risco linfoma/leucemia com uso prolongado."
  },
  "cimetidina": {
    "name": "Cimetidina",
    "classes": [
      "h2_blocker"
    ],
    "indications": [
      "Úlcera péptica / DRGE (alternativa histórica)",
      "Profilaxia úlcera por estresse (internação)"
    ],
    "ciAbs": [
      "Hipersensibilidade"
    ],
    "ciRel": [
      "DRC — reduzir dose",
      "Interações CYP (warfarina, fenitoína, teofilina)",
      "Idoso — confusão"
    ],
    "presentations": [
      "200 mg, 400 mg comprimido",
      "300 mg/2 mL ampola EV"
    ],
    "posologyVo": [
      "400 mg VO 12/12 h ou 800 mg à noite × 4–8 sem (úlcera)",
      "400 mg VO 12/12 h (DRGE)"
    ],
    "posologyHosp": [
      "300 mg EV 6/6 h (profilaxia úlcera estresse)",
      "VO preferível se tolerado"
    ],
    "notes": "Preferir IBP na maioria dos casos atuais. Inibidor CYP potente — revisar interações."
  },
  "codeina": {
    "name": "Codeína",
    "classes": [
      "opioid"
    ],
    "indications": [
      "Tosse seca (antitussígeno)",
      "Dor leve a moderada (associação com analgésicos)"
    ],
    "ciAbs": [
      "Depressão respiratória",
      "Asma aguda",
      "Íleo paralítico",
      "Crianças < 12 anos (toxicidade)"
    ],
    "ciRel": [
      "DRC",
      "Gestação/lactação",
      "Metabolizadores ultrarrápidos CYP2D6 (morfina excessiva)",
      "Uso com benzodiazepínicos"
    ],
    "presentations": [
      "30 mg comprimido",
      "3 mg/mL xarope",
      "Associações codeína + paracetamol"
    ],
    "posologyVo": [
      "Tosse: 10–20 mg VO 6/8 h (máx. 120 mg/dia)",
      "Dor: 30–60 mg VO 6/6 h (receita especial)"
    ],
    "posologyHosp": [
      "VO preferível; EV não usual — usar morfina/tramadol se analgesia parenteral"
    ],
    "notes": "Receita especial A/B conforme formulação. Risco de constipação e sedação."
  },
  "bupropiona": {
    "name": "Bupropiona",
    "classes": [
      "antidepressant"
    ],
    "indications": [
      "Depressão",
      "Cessação tabágica",
      "TDAH (registro variável)"
    ],
    "ciAbs": [
      "Convulsão ativa ou história",
      "Bulimia/anorexia",
      "Uso abrupto de álcool/benzodiazepínicos",
      "IMAO concomitante"
    ],
    "ciRel": [
      "Tumor SNC",
      "HAS",
      "Insuficiência hepática — reduzir dose"
    ],
    "presentations": [
      "150 mg comprimido liberação prolongada",
      "75 mg comprimido"
    ],
    "posologyVo": [
      "150 mg VO 24/24 h × 3 dias; depois 150 mg 12/12 h (depressão/tabagismo)",
      "Máx. 300 mg/dia"
    ],
    "posologyHosp": [
      "VO preferível; manter se já em uso"
    ],
    "notes": "Receita B1. Risco convulsão — não usar se história de epilepsia. Evitar nocturno (insônia)."
  },
  "cefepima": {
    "name": "Cefepima",
    "classes": [
      "cephalosporin"
    ],
    "indications": [
      "Sepse / pneumonia nosocomial",
      "Neutropenia febril",
      "Infecção por Pseudomonas",
      "Meningite (contexto hospitalar)"
    ],
    "ciAbs": [
      "Alergia grave a cefalosporinas (avaliar reatividade cruzada)"
    ],
    "ciRel": [
      "DRC — ajustar intervalo",
      "Encefalopatia/convulsão em DRC se dose inadequada",
      "Colite por C. difficile"
    ],
    "presentations": [
      "1 g, 2 g pó liofilizado EV",
      "500 mg pó IM"
    ],
    "posologyVo": [
      "Não disponível VO"
    ],
    "posologyHosp": [
      "1–2 g EV 8/8 h (infecção grave)",
      "2 g EV 8/8 h (neutropenia febril/meningite)",
      "Ajustar DFG < 60"
    ],
    "notes": "Cefalosporina 4ª geração — cobertura Pseudomonas. Neurotoxicidade se acúmulo."
  },
  "acetazolamida": {
    "name": "Acetazolamida",
    "classes": [
      "diuretic"
    ],
    "indications": [
      "Glaucoma agudo de ângulo fechado (adjuvante)",
      "Edema por alcalose metabólica",
      "Mal da montanha (profilaxia/tratamento)",
      "Epilepsia adjuvante (off-label)"
    ],
    "ciAbs": [
      "Insuficiência hepática/renal grave",
      "Hipocalemia",
      "Hipersensibilidade sulfonamidas",
      "Cirrose descompensada"
    ],
    "ciRel": [
      "Diabetes",
      "Gotoso",
      "Gestação"
    ],
    "presentations": [
      "250 mg comprimido"
    ],
    "posologyVo": [
      "250 mg VO 12/12 h (glaucoma/mal montanha)",
      "500 mg VO dose única ou 250 mg 8/8 h (mal montanha agudo)"
    ],
    "posologyHosp": [
      "250–500 mg VO/EV 6/8 h (glaucoma agudo adjuvante)",
      "Monitorizar eletrólitos e pH"
    ],
    "notes": "Inibidor anidrase carbônica — parestesias e acidose metabólica comuns."
  },
  "cloranfenicol": {
    "name": "Cloranfenicol",
    "classes": [
      "antibiotic"
    ],
    "indications": [
      "Infecção grave por agente sensível (reserva)",
      "Tifoide (alternativa em alergia)"
    ],
    "ciAbs": [
      "Porfiria",
      "Depressão medular / aplasia"
    ],
    "ciRel": [
      "Recém-nascido e prematuro — síndrome cinza",
      "G6PD",
      "Interações CYP"
    ],
    "presentations": [
      "250 mg, 500 mg cápsula",
      "1 g pó EV"
    ],
    "posologyVo": [
      "500 mg VO 6/6 h × 7–10 dias (adulto)",
      "Ajustar dose em hepatopatia"
    ],
    "posologyHosp": [
      "25 mg/kg/dia EV dividido 6/6 h (máx. 4 g/dia)",
      "Monitorizar hemograma"
    ],
    "notes": "Antibiótico reserva — toxicidade medular irreversível. Preferir alternativas sempre que possível."
  },
  "carbonato_de_litio": {
    "name": "Carbonato de lítio",
    "classes": [
      "anticonvulsant"
    ],
    "indications": [
      "Transtorno bipolar (mania/depressão)",
      "Profilaxia de episódios afetivos"
    ],
    "ciAbs": [
      "Insuficiência renal grave",
      "Desidratação / hiponatremia",
      "Cardiopatia grave descompensada"
    ],
    "ciRel": [
      "Gestação (teratogenicidade — avaliar)",
      "Tireoidite",
      "Diuréticos tiazídicos/AINEs (aumentam nível)",
      "Idoso"
    ],
    "presentations": [
      "300 mg comprimido"
    ],
    "posologyVo": [
      "300 mg VO 8/8 h; titular por nível sérico (alvo 0,6–1,0 mEq/L)",
      "Iniciar baixo em idoso"
    ],
    "posologyHosp": [
      "Manter VO se possível; dosagem por nível",
      "Hidratação e monitorizar Na+, creatinina, lítio"
    ],
    "notes": "Receita B1. Janela terapêutica estreita — toxicidade: tremor, confusão, arritmia."
  },
  "ciclosporina": {
    "name": "Ciclosporina",
    "classes": [
      "antiinflammatory"
    ],
    "indications": [
      "Transplante (imunossupressor)",
      "Doença inflamatória intestinal refratária",
      "Artrite reumatoide (contexto específico)"
    ],
    "ciAbs": [
      "Hipersensibilidade",
      "Infecção não controlada (relativo)"
    ],
    "ciRel": [
      "Hipertensão",
      "Nefrotoxicidade",
      "Interações CYP3A4 (macrolídeos, azóis)",
      "Vacinas vivas"
    ],
    "presentations": [
      "25 mg, 50 mg, 100 mg cápsula",
      "100 mg/mL solução oral"
    ],
    "posologyVo": [
      "2,5–5 mg/kg/dia VO dividido 12/12 h (transplante — individualizar)",
      "Monitorizar níveis séricos"
    ],
    "posologyHosp": [
      "Manter dose VO; EV em formulações específicas se indisponível VO"
    ],
    "notes": "Monitorizar creatinina, PA e níveis. Gengivite e hirsutismo frequentes."
  },
  "cefoxitina": {
    "name": "Cefoxitina",
    "classes": [
      "cephalosporin"
    ],
    "indications": [
      "Infecção intra-abdominal",
      "Profilaxia cirúrgica (cirurgia colorretal)",
      "Infecção ginecológica",
      "Cobertura anaeróbios (Bacteroides)"
    ],
    "ciAbs": [
      "Alergia grave a cefalosporinas"
    ],
    "ciRel": [
      "Colite por C. difficile",
      "DRC — ajustar dose"
    ],
    "presentations": [
      "1 g, 2 g pó liofilizado EV/IM"
    ],
    "posologyVo": [
      "Não disponível VO"
    ],
    "posologyHosp": [
      "1–2 g EV 6/6 h",
      "2 g EV dose única profilaxia cirúrgica (30–60 min pré-incisão)"
    ],
    "notes": "Cefalosporina 2ª geração com boa cobertura anaeróbia. Alternativa: ampicilina-sulbactam."
  },
  "betametasona": {
    "name": "Betametasona",
    "classes": [
      "corticosteroid"
    ],
    "indications": [
      "Maturação pulmonar fetal (anteparto)",
      "Doenças alérgicas/inflamatórias",
      "Coadjuvante asma/DPOC aguda (EV)"
    ],
    "ciAbs": [
      "Infecção sistêmica fúngica não tratada",
      "Hipersensibilidade"
    ],
    "ciRel": [
      "Diabetes",
      "HAS",
      "Osteoporose",
      "Gestação (exceto maturação pulmonar protocolada)"
    ],
    "presentations": [
      "0,5 mg comprimido",
      "4 mg/mL ampola EV/IM",
      "Creme/unguento tópico"
    ],
    "posologyVo": [
      "0,5–2 mg VO 24/24 h (curto prazo)",
      "Dose única maturação pulmonar: 12 mg IM × 2 (24 h apart) — protocolo obstétrico"
    ],
    "posologyHosp": [
      "4–8 mg EV 6/6 h (exacerbação asma — curto prazo)",
      "IM maturação pulmonar conforme protocolo"
    ],
    "notes": "Potência ~25× hidrocortisona. Desmame se uso > 7–10 dias."
  },
  "cabergolina": {
    "name": "Cabergolina",
    "classes": [
      "hormone"
    ],
    "indications": [
      "Prolactinoma",
      "Inibição lactação (contexto específico)",
      "Doença de Parkinson adjuvante (off-label)"
    ],
    "ciAbs": [
      "Hipertensão não controlada",
      "Fibrose valvar/cardiopulmonar por agonista dopaminérgico",
      "Pré-eclâmpsia"
    ],
    "ciRel": [
      "Gestação (geralmente suspender após confirmação)",
      "Insuficiência hepática"
    ],
    "presentations": [
      "0,5 mg comprimido"
    ],
    "posologyVo": [
      "Prolactinoma: 0,25–1 mg VO 2×/semana; titular",
      "Inibição lactação: 1 mg dose única (ver protocolo local)"
    ],
    "posologyHosp": [
      "VO preferível"
    ],
    "notes": "Agonista dopaminérgico de meia-vida longa. Ecocardiograma se uso prolongado."
  },
  "carvao_vegetal_ativado": {
    "name": "Carvão vegetal ativado",
    "classes": [
      "antidote"
    ],
    "indications": [
      "Intoxicação oral aguda (adsorção)",
      "Envenenamento por fármacos/toxinas adsorvíveis"
    ],
    "ciAbs": [
      "Alteração nível de consciência sem via aérea protegida",
      "Ingestão de corrosivos/hidrocarbonetos",
      "Íleo/obstrução intestinal"
    ],
    "ciRel": [
      "Risco aspiração",
      "Administrar dentro de 1–2 h da ingestão (ideal < 1 h)"
    ],
    "presentations": [
      "Pó para suspensão oral 25 g, 50 g",
      "125 mg/mL suspensão"
    ],
    "posologyVo": [
      "50 g VO (adulto) dose única; repetir 25 g se ingestão maciça",
      "1 g/kg criança (máx. 50 g)"
    ],
    "posologyHosp": [
      "50 g via SNG após proteção de via aérea se necessário",
      "Repetir 25 g 4/4 h se ingestão sustentada (selecionado)"
    ],
    "notes": "Não adsorve álcool, ferro, lítio, potássio. Pode reduzir absorção de medicamentos VO concomitantes."
  },
  "ciproeptadina": {
    "name": "Ciproeptadina",
    "classes": [
      "antihistamine"
    ],
    "indications": [
      "Prurido / urticária",
      "Estimulante apetite (off-label)",
      "Enxaqueca profilática (off-label)"
    ],
    "ciAbs": [
      "Glaucoma de ângulo fechado",
      "Retenção urinária",
      "Úlcera péptica ativa"
    ],
    "ciRel": [
      "Idoso",
      "Asma",
      "Gestação",
      "Sedação"
    ],
    "presentations": [
      "4 mg comprimido",
      "2 mg/5 mL xarope"
    ],
    "posologyVo": [
      "4 mg VO 8/8 h (urticária)",
      "2–4 mg VO à noite (estímulo apetite)"
    ],
    "posologyHosp": [
      "4 mg VO 8/8 h — preferir VO"
    ],
    "notes": "Antagonista serotoninérgico + anti-H1. Ganho de peso comum."
  },
  "clorpropamida": {
    "name": "Clorpropamida",
    "classes": [
      "antidiabetic"
    ],
    "indications": [
      "Diabetes mellitus tipo 2 (sulfonilureia de 1ª geração — uso limitado)"
    ],
    "ciAbs": [
      "DM1",
      "Cetoacidose",
      "Insuficiência renal/hepática grave",
      "Gestação"
    ],
    "ciRel": [
      "Idoso — hipoglicemia prolongada",
      "Uso com álcool (efeito antabuse)",
      "Insuficiência cardíaca/renal"
    ],
    "presentations": [
      "250 mg comprimido"
    ],
    "posologyVo": [
      "125–250 mg VO 24/24 h com café da manhã",
      "Titular até 500 mg/dia (máx.)"
    ],
    "posologyHosp": [
      "Manter VO; monitorizar glicemia — meia-vida longa"
    ],
    "notes": "Hipoglicemia prolongada (24–72 h). Preferir sulfonilureias modernas ou metformina."
  },
  "tamoxifeno": {
    "name": "Tamoxifeno",
    "classes": [
      "hormone"
    ],
    "indications": [
      "Câncer de mama receptor estrogênio positivo (adjuvante/paliativo)",
      "Profilaxia alto risco (contexto específico)"
    ],
    "ciAbs": [
      "Gestação",
      "Tromboembolismo ativo",
      "Uso concomitante anticoagulante (relativo)"
    ],
    "ciRel": [
      "História TEV",
      "Endometriose/hiperplasia endometrial",
      "Catarata"
    ],
    "presentations": [
      "10 mg, 20 mg comprimido"
    ],
    "posologyVo": [
      "20 mg VO 24/24 h × 5 anos (adjuvante — protocolo oncologia)",
      "10 mg 24/24 h em alguns perfis"
    ],
    "posologyHosp": [
      "Manter VO"
    ],
    "notes": "Modulador seletivo estrogênio. Monitorizar sintomas tromboembólicos e sangramento uterino."
  },
  "gliclazida": {
    "name": "Gliclazida",
    "classes": [
      "antidiabetic"
    ],
    "indications": [
      "Diabetes mellitus tipo 2 (sulfonilureia)"
    ],
    "ciAbs": [
      "DM1",
      "Cetoacidose",
      "Insuficiência renal/hepática grave",
      "Gestação"
    ],
    "ciRel": [
      "Idoso",
      "Desnutrição",
      "Uso com AAS/ sulfonamidas (potencializa hipoglicemia)"
    ],
    "presentations": [
      "30 mg, 60 mg comprimido liberação modificada",
      "80 mg comprimido"
    ],
    "posologyVo": [
      "30–60 mg VO 24/24 h antes café (MR)",
      "80 mg VO 12/12 h (convencional — titular)"
    ],
    "posologyHosp": [
      "Manter VO se estável; monitorizar glicemia"
    ],
    "notes": "Risco hipoglicemia — orientar sinais e refeição regular."
  },
  "glibenclamida": {
    "name": "Glibenclamida",
    "classes": [
      "antidiabetic"
    ],
    "indications": [
      "Diabetes mellitus tipo 2 (sulfonilureia)"
    ],
    "ciAbs": [
      "DM1",
      "Cetoacidose",
      "Insuficiência renal grave (DFG < 30)",
      "Gestação"
    ],
    "ciRel": [
      "Idoso — preferir gliclazida/metformina",
      "Insuficiência hepática",
      "Desnutrição"
    ],
    "presentations": [
      "5 mg comprimido"
    ],
    "posologyVo": [
      "2,5–5 mg VO 24/24 h antes café; titular até 15 mg/dia",
      "Idoso: iniciar 2,5 mg"
    ],
    "posologyHosp": [
      "Manter VO; hipoglicemia pode ser prolongada"
    ],
    "notes": "Evitar em idoso frágil — hipoglicemia grave. Preferir alternativas se DRC."
  },
  "hidroxido_de_aluminio": {
    "name": "Hidróxido de alumínio",
    "classes": [
      "ppi"
    ],
    "indications": [
      "Dispepsia / hiperacidez",
      "Refluxo gastroesofágico leve",
      "Fosfatemia elevada (quelante — contexto DRC)"
    ],
    "ciAbs": [
      "Obstrução intestinal",
      "Hipersensibilidade"
    ],
    "ciRel": [
      "Insuficiência renal (acúmulo alumínio)",
      "Reduz absorção de outros fármacos VO"
    ],
    "presentations": [
      "Suspensão oral 60 mg/mL",
      "Comprimido mastigável 500 mg"
    ],
    "posologyVo": [
      "5–10 mL VO 4/6 h entre refeições e ao deitar",
      "Separar 2 h de outros medicamentos VO"
    ],
    "posologyHosp": [
      "VO preferível; mesmo esquema"
    ],
    "notes": "Constipação comum. Não usar cronicamente em DRC."
  },
  "doxazosina": {
    "name": "Doxazosina",
    "classes": [
      "alpha_blocker"
    ],
    "indications": [
      "Hipertensão arterial",
      "Hiperplasia prostática benigna (LUTS)"
    ],
    "ciAbs": [
      "Hipersensibilidade",
      "Obstrução urinária com anúria"
    ],
    "ciRel": [
      "Hipotensão ortostática",
      "Cirurgia catarata (íris flácida)",
      "Uso com PDE5 (hipotensão)"
    ],
    "presentations": [
      "2 mg, 4 mg comprimido"
    ],
    "posologyVo": [
      "1–2 mg VO à noite; titular até 8 mg 24/24 h (HAS/HBP)",
      "Iniciar baixo — síncope 1ª dose"
    ],
    "posologyHosp": [
      "Manter VO; cautela hipotensão ortostática"
    ],
    "notes": "Bloqueador alfa-1. Primeira dose à noite sentado/deitado."
  },
  "lansoprazol": {
    "name": "Lansoprazol",
    "classes": [
      "ppi"
    ],
    "indications": [
      "DRGE",
      "Úlcera péptica",
      "Erradicação H. pylori (tripla)",
      "Profilaxia úlcera por AINE"
    ],
    "ciAbs": [
      "Hipersensibilidade"
    ],
    "ciRel": [
      "Uso prolongado — deficiência Mg/B12, fractura, C. difficile",
      "Interações CYP2C19 (clopidogrel — preferir pantoprazol se antiagregado)"
    ],
    "presentations": [
      "15 mg, 30 mg cápsula",
      "30 mg comprimido orodispersível"
    ],
    "posologyVo": [
      "15–30 mg VO 24/24 h antes refeição × 4–8 sem",
      "H. pylori tripla: 30 mg 12/12 h × 14 dias"
    ],
    "posologyHosp": [
      "30 mg VO 24/24 h (profilaxia úlcera estresse — se IBP indicado)"
    ],
    "notes": "Equivalente a omeprazol. Reavaliar necessidade após curto prazo."
  },
  "fluoxetina": {
    "name": "Fluoxetina",
    "classes": [
      "antidepressant"
    ],
    "indications": [
      "Depressão",
      "TOC",
      "Bulimia",
      "Transtorno disfórico pré-menstrual"
    ],
    "ciAbs": [
      "IMAO concomitante (14 dias)",
      "Uso com tioridazina/pimozida"
    ],
    "ciRel": [
      "Epilepsia",
      "Bipolar (risco mania — associar estabilizador)",
      "Gestação/lactação",
      "Síndrome serotoninérgica com triptanos/ISRS"
    ],
    "presentations": [
      "20 mg cápsula",
      "10 mg comprimido"
    ],
    "posologyVo": [
      "20 mg VO 24/24 h pela manhã; titular até 40–60 mg",
      "TOC: frequentemente 40–80 mg/dia"
    ],
    "posologyHosp": [
      "Manter VO; meia-vida longa — efeito persiste dias após suspensão"
    ],
    "notes": "Receita B1. Ativação/insônia no início. Meia-vida longa — interações prolongadas."
  },
  "levodopa": {
    "name": "Levodopa + carbidopa",
    "classes": [
      "discharge_only"
    ],
    "indications": [
      "Doença de Parkinson",
      "Síndrome parkinsoniana"
    ],
    "ciAbs": [
      "Glaucoma de ângulo fechado",
      "Uso concomitante IMAO (exceto selegilina baixa dose)",
      "Melanoma ativo"
    ],
    "ciRel": [
      "Psicose",
      "Doença ulcerosa péptica",
      "Arritmias",
      "Discinesia precoce"
    ],
    "presentations": [
      "200 mg levodopa + 50 mg carbidopa comprimido",
      "100/25 mg",
      "250/25 mg"
    ],
    "posologyVo": [
      "100/25 mg VO 8/8 h; titular até 200/50 mg 6/6 h",
      "Administrar 30 min antes ou 1 h após refeição proteica"
    ],
    "posologyHosp": [
      "Manter horários rigorosos VO; evitar interrupção abrupta"
    ],
    "notes": "Não suspender abruptamente (síndrome neuroléptica maligna-like). Discinesias e wearing-off com uso crônico."
  },
  "carbonato_de_calcio": {
    "name": "Carbonato de cálcio",
    "classes": [
      "electrolyte"
    ],
    "indications": [
      "Deficiência de cálcio / osteopenia",
      "Quelante de fósforo (DRC)",
      "Antídoto hipocalcemia leve"
    ],
    "ciAbs": [
      "Hipercalcemia",
      "Nefrolitíase cálcio ativa",
      "Sarcoidose (hipercalcemia)"
    ],
    "ciRel": [
      "Insuficiência renal",
      "Uso de digitálicos (monitorizar)",
      "Interação com levotiroxina/bisfosfonatos (separar)"
    ],
    "presentations": [
      "500 mg cálcio elementar comprimido",
      "Suspensão oral"
    ],
    "posologyVo": [
      "500–1000 mg cálcio elementar VO 24/24 h com refeição",
      "DRC: com refeições como quelante fósforo"
    ],
    "posologyHosp": [
      "VO preferível; gluconato cálcio EV se hipocalcemia aguda sintomática"
    ],
    "notes": "Separar 2–4 h de ferro, levotiroxina e quinolonas."
  },
  "acido_ursodesoxicolico": {
    "name": "Ácido ursodesoxicólico",
    "classes": [
      "antiinflammatory"
    ],
    "indications": [
      "Colelitíase com colesterol (dissolução — selecionado)",
      "Colangite biliar primária",
      "Colestase intra-hepática gestação (contexto específico)"
    ],
    "ciAbs": [
      "Colangite supurativa",
      "Obstrução biliar",
      "Cirrose descompensada"
    ],
    "ciRel": [
      "Diarreia (dose-dependente)",
      "Monitorizar transaminases"
    ],
    "presentations": [
      "150 mg, 300 mg cápsula"
    ],
    "posologyVo": [
      "10–15 mg/kg/dia VO dividido 8/8 h (CBP)",
      "300 mg VO 12/12 h (litíase — seleção por ultrassom)"
    ],
    "posologyHosp": [
      "Manter VO se indicado"
    ],
    "notes": "Dissolução de cálculos lenta (meses). Eficaz em CBP para reduzir colestase."
  },
  "desmopressina": {
    "name": "Desmopressina (acetato)",
    "classes": [
      "hormone"
    ],
    "indications": [
      "Diabetes insipidus central",
      "Noctúria/enurese noturna (selecionado)",
      "Hemofilia A / von Willebrand tipo 1 (EV — contexto hospitalar)"
    ],
    "ciAbs": [
      "Polidipsia habitual",
      "Insuficiência cardíaca/renal descompensada (formulacao antidiurese)"
    ],
    "ciRel": [
      "Hiponatremia",
      "HAS",
      "Idoso — monitorizar sódio"
    ],
    "presentations": [
      "0,1 mg, 0,2 mg comprimido",
      "Spray nasal 10 mcg/jato",
      "4 mcg/mL ampola EV"
    ],
    "posologyVo": [
      "0,1–0,2 mg VO 12/12 h (DI central)",
      "Spray nasal: 1–2 jatos/noite (enurese — protocolo)"
    ],
    "posologyHosp": [
      "0,3 mcg/kg EV (hemofilia — protocolo hematologia)",
      "Monitorizar Na+ e osmolalidade"
    ],
    "notes": "Restringir líquidos conforme indicação — risco hiponatremia."
  },
  "octreotida": {
    "name": "Octreotida (acetato)",
    "classes": [
      "hormone"
    ],
    "indications": [
      "Sangramento varicoso agudo (adjuvante)",
      "Fístula pancreática / pós-operatório",
      "Tumor neuroendócrino",
      "Acromegalia"
    ],
    "ciAbs": [
      "Hipersensibilidade"
    ],
    "ciRel": [
      "Colelitíase (aumenta risco)",
      "Diabetes (altera glicemia)",
      "Bradicardia"
    ],
    "presentations": [
      "0,1 mg/mL ampola SC/EV",
      "LAR depot 20–30 mg IM mensal (manutenção)"
    ],
    "posologyVo": [
      "Manutenção: LAR mensal (acromegalia/TNE — especialista)",
      "Não usual VO"
    ],
    "posologyHosp": [
      "50 mcg EV bolus + infusão 50 mcg/h (sangramento varicoso — protocolo)",
      "100 mcg SC 8/8 h (fístula pancreática — protocolo)"
    ],
    "notes": "Análogo somatostatina. Náusea e dor abdominal SC comuns no início."
  },
  "benzilpenicilina_benzatina": {
    "name": "Benzilpenicilina benzatina",
    "classes": [
      "penicillin"
    ],
    "indications": [
      "Sífilis",
      "Profilaxia secundária febre reumática",
      "Erisipela (selecionado ambulatorial)"
    ],
    "ciAbs": [
      "Alergia grave à penicilina"
    ],
    "ciRel": [
      "Reação anafilática prévia — contraindicado",
      "G6PD (hemólise — raro)"
    ],
    "presentations": [
      "1,2 milhões UI, 2,4 milhões UI pó IM profunda"
    ],
    "posologyVo": [
      "Não disponível VO"
    ],
    "posologyHosp": [
      "Sífilis primária: 2,4 milhões UI IM dose única",
      "Fe reumática profilaxia: 1,2 milhões UI IM a cada 3–4 sem",
      "IM profunda glúteo — nunca EV"
    ],
    "notes": "Depósito IM — níveis prolongados. Reação de Jarisch-Herxheimer na sífilis."
  },
  "complexo_b": {
    "name": "Complexo B",
    "classes": [
      "vitamin"
    ],
    "indications": [
      "Deficiência de vitaminas B (polineurite, alcoolismo, desnutrição)",
      "Suplementação adjuvante neuropatia"
    ],
    "ciAbs": [
      "Hipersensibilidade a componentes"
    ],
    "ciRel": [
      "Uso EV/IM — reações anafiláticas raras (tiamina IV isolada)"
    ],
    "presentations": [
      "Comprimido (B1+B6+B12)",
      "Ampola IM/EV",
      "Xarope"
    ],
    "posologyVo": [
      "1 comprimido VO 24/24 h ou 8/8 h conforme formulação",
      "Neuropatia: esquemas 8/8 h por 30 dias (protocolo)"
    ],
    "posologyHosp": [
      "VO preferível; IM se má absorção selecionada"
    ],
    "notes": "Formulações variam — verificar mg de cada componente no rótulo."
  }
};

const MED_HOSP_POSOLOGY = {
  "dipirona": [
    "1 g/2 mL amp — 1 amp IM ou EV 6/6 h (máx. 4 g/dia metamizol)",
    "EV: diluir e infundir 15–30 min"
  ],
  "paracetamol": [
    "750 mg/100 mL EV 6/6 h (máx. 4 g/dia)",
    "500–750 mg VO 6/6 h"
  ],
  "tramadol": [
    "50 mg/1 mL amp — 50–100 mg IM ou EV lento 6/6 h",
    "50 mg VO 6/6 h — receita especial B1"
  ],
  "morfina": [
    "10 mg/mL — 2–4 mg EV lento titulado 5–10 min",
    "10 mg IM se acesso EV indisponível"
  ],
  "fentanil": [
    "50 mcg/mL — 25–100 mcg EV bolus; infusão contínua em UTI/analgesia"
  ],
  "meperidina": [
    "50 mg/mL — 25–50 mg IM/EV (evitar DRC — normeperidina)"
  ],
  "naproxeno": [
    "550 mg VO dose única ou 250 mg 12/12 h",
    "Preferir VO no PS; suspender se dengue/gravidez"
  ],
  "ibuprofeno": [
    "400–600 mg VO 8/8 h",
    "Suspender dengue fase crítica e 3º trimestre"
  ],
  "diclofenaco": [
    "75 mg/3 mL amp — 75 mg IM 12/12 h (não EV)",
    "50 mg VO 8/8 h"
  ],
  "cetoprofeno": [
    "100 mg/2 mL amp — 100 mg IM 12/12 h (não EV)",
    "50–100 mg VO 12/12 h"
  ],
  "ketorolaco": [
    "30 mg/mL amp — 30 mg IM ou EV lento 8/8 h (máx. 5 dias)",
    "15–30 mg/dia máximo idoso/DRC"
  ],
  "tenoxicam": [
    "20 mg/2 mL amp — 20 mg IM 24/24 h (não EV)",
    "20 mg VO 24/24 h"
  ],
  "nimesulida": [
    "100 mg VO 12/12 h (uso VO ambulatorial; hepatotoxicidade — evitar > 15 dias)"
  ],
  "aspirina": [
    "300 mg mastigável na SCA (ataque)",
    "100 mg VO 24/24 h manutenção"
  ],
  "sumatriptano": [
    "6 mg/0,5 mL SC ao início da crise; repetir 6 mg após 1 h (máx. 12 mg/24 h)",
    "50–100 mg VO; máx. 200 mg/dia"
  ],
  "zolmitriptano": [
    "2,5–5 mg VO; repetir 2,5 mg após 2 h",
    "5 mg spray nasal dose única na crise"
  ],
  "metoclopramida": [
    "10 mg/2 mL amp — 10 mg IM ou EV lento 8/8 h",
    "10 mg VO 8/8 h antes das refeições"
  ],
  "ondansetrona": [
    "4 mg/2 mL amp — 4–8 mg EV lento 8/8 h",
    "4–8 mg VO 8/8 h"
  ],
  "dimenidrinato": [
    "50 mg/mL — 50 mg IM 8/8 h",
    "50–100 mg VO 8/8 h"
  ],
  "prometazina": [
    "25 mg/mL — 25 mg IM/EV profundo 6/8 h",
    "25 mg VO 6/8 h (sedação/anti-H1)"
  ],
  "dexametasona": [
    "4 mg/mL ou 10 mg/2,5 mL — 4–10 mg IM/EV dose única ou 6/6 h curto prazo",
    "4 mg VO 6/6 h × 2–4 dias"
  ],
  "prednisona": [
    "40–60 mg VO 24/24 h × 5 dias (asma/DPOC)",
    "Desmame se curso > 7 dias"
  ],
  "prednisolona": [
    "Equivalente prednisona — 1 mg/kg/dia VO dividido"
  ],
  "metilprednisolona": [
    "125–500 mg EV (pulsoterapia ou asma grave)",
    "40–125 mg EV 6/6 h curto prazo"
  ],
  "hidrocortisona": [
    "100 mg EV 8/8 h (insuficiência adrenal)",
    "500 mg EV (anafilaxia adjuvante)"
  ],
  "ciclobenzaprina": [
    "5–10 mg VO 8/8 h ou à noite × 5–7 dias"
  ],
  "oxigenio": [
    "Cateter nasal 2–6 L/min ou máscara reservatório 10–15 L/min conforme SpO₂ alvo"
  ],
  "verapamil": [
    "80 mg VO 8/8 h (profilaxia salvas)",
    "5 mg EV lento (PSVT — monitorizado)"
  ],
  "amlodipino": [
    "5–10 mg VO 24/24 h"
  ],
  "captopril": [
    "25 mg sublingual na urgência hipertensiva selecionada",
    "25–50 mg VO 8/8 h"
  ],
  "enalapril": [
    "10–20 mg VO 12/12 h"
  ],
  "losartana": [
    "50–100 mg VO 24/24 h"
  ],
  "hidralazina": [
    "20 mg/mL — 5–10 mg EV lento repetível 20–30 min",
    "25–50 mg VO 8/8 h"
  ],
  "labetalol": [
    "5 mg/mL — 20 mg EV lento; depois 40–80 mg a cada 10 min (máx. 300 mg)",
    "100–200 mg VO 12/12 h"
  ],
  "propranolol": [
    "40 mg VO 12/12 h (profilaxia enxaqueca)",
    "1 mg EV lento (tireotóxico/arrítmia)"
  ],
  "metoprolol": [
    "25–100 mg VO 12/12 h",
    "5 mg EV 5 min (SCA estabilizado)"
  ],
  "nitroglicerina": [
    "0,25 mg SL a cada 5 min × 3 (angina)",
    "Infusão EV 5–200 mcg/min (EDA/IC)"
  ],
  "furosemida": [
    "40–80 mg EV; repetir conforme diurese",
    "40 mg VO 24/24 h manutenção"
  ],
  "adrenalina": [
    "1 mg/mL (1:1000) — 0,3–0,5 mg IM anafilaxia",
    "1 mg/mL (1:10.000) — 1 mg EV ACLS"
  ],
  "noradrenalina": [
    "4 mg/mL — infusão 0,05–3 mcg/kg/min (choque)"
  ],
  "difenidramina": [
    "50 mg/mL — 25–50 mg EV/IM lento",
    "25–50 mg VO 6/8 h"
  ],
  "loratadina": [
    "10 mg VO 24/24 h"
  ],
  "salbutamol": [
    "100 mcg/puff — 4–8 puffs inalatório ou nebulização 2,5–5 mg",
    "Nebulização contínua na asma grave"
  ],
  "ipratropio": [
    "0,25 mg/mL — 0,5 mg nebulização 6/6 h (DPOC)",
    "20 mcg/puff — 2 puffs 6/6 h"
  ],
  "aminofilina": [
    "240 mg/10 mL — 6 mg/kg EV ataque; manutenção 0,4–0,6 mg/kg/h (monitorizar níveis)"
  ],
  "sulfato_magnesio": [
    "10% — 4 g EV em 20 min (eclâmpsia/asma grave)",
    "1–2 g/h manutenção eclâmpsia"
  ],
  "diazepam": [
    "10 mg/2 mL — 5–10 mg EV lento (convulsão/ansiedade)",
    "10 mg VO 6/12 h curto prazo"
  ],
  "midazolam": [
    "5 mg/mL — 2–5 mg EV titulado (sedação)",
    "10 mg IM pré-procedimento"
  ],
  "lorazepam": [
    "2 mg/mL — 4 mg EV lento (status epilepticus)",
    "1–2 mg VO 8/8 h"
  ],
  "clonazepam": [
    "0,5–2 mg VO 8/8 h (ansiedade/convulsão ambulatorial)"
  ],
  "fenitoina": [
    "250 mg/5 mL — 20 mg/kg EV (máx. 1500 mg) 50 mg/min",
    "300 mg VO 24/24 h manutenção"
  ],
  "acido_valproico": [
    "400 mg/mL — 20–40 mg/kg EV",
    "500–1000 mg VO 12/12 h"
  ],
  "fenobarbital": [
    "200 mg/mL — 20 mg/kg EV (status refratário)",
    "100 mg VO 24/24 h"
  ],
  "ceftriaxona": [
    "1 g EV/IM 24/24 h (ITU/pneumonia)",
    "2 g EV 24/24 h (meningite)"
  ],
  "cefotaxima": [
    "1 g EV 6/6 h",
    "2 g EV 6/6 h (meningite)"
  ],
  "cefalexina": [
    "500 mg VO 6/6 h",
    "1 g VO 6/6 h"
  ],
  "cefazolina": [
    "1 g EV 8/8 h (profilaxia cirúrgica)",
    "2 g EV dose única pré-cirúrgica"
  ],
  "ceftazidima": [
    "1–2 g EV 8/8 h (Pseudomonas)"
  ],
  "oxacilina": [
    "2 g EV 4/4 h (endocardite estafilocócica MSSA)"
  ],
  "ampicilina": [
    "2 g EV 4/4 h (meningite Listeria)",
    "500 mg VO 6/6 h"
  ],
  "amoxicilina": [
    "500 mg VO 8/8 h × 10 dias",
    "875 mg VO 12/12 h"
  ],
  "amoxicilina_clavulanato": [
    "875/125 mg VO 12/12 h × 10 dias",
    "500/125 mg VO 8/8 h"
  ],
  "ampicilina_sulbactam": [
    "3 g EV 6/6 h (intra-abdominal)"
  ],
  "piperacilina_tazobactam": [
    "4,5 g EV 6/6 h (sepse/intra-abdominal)"
  ],
  "penicilina_cristalina": [
    "4 milhões UI EV 4/4 h (meningite pneumocócica)",
    "2,4 milhões UI EV 4/4 h endocardite"
  ],
  "azitromicina": [
    "500 mg VO 24/24 h × 3–5 dias",
    "500 mg EV 24/24 h se VO indisponível"
  ],
  "claritromicina": [
    "500 mg VO 12/12 h × 7–10 dias"
  ],
  "eritromicina": [
    "500 mg VO 6/6 h (alternativa macrolídeo)"
  ],
  "ciprofloxacino": [
    "500 mg VO 12/12 h",
    "400 mg EV 12/12 h"
  ],
  "levofloxacino": [
    "500–750 mg VO/EV 24/24 h"
  ],
  "moxifloxacino": [
    "400 mg VO/EV 24/24 h"
  ],
  "metronidazol": [
    "500 mg VO 8/8 h",
    "500 mg EV 8/8 h"
  ],
  "clindamicina": [
    "300 mg VO 6/6 h",
    "600 mg EV 8/8 h",
    "900 mg EV 8/8 h (pele grave)"
  ],
  "vancomicina": [
    "15–20 mg/kg EV 8–12 h (ajustar DRC)",
    "Infundir ≥ 60 min"
  ],
  "meropenem": [
    "1 g EV 8/8 h",
    "2 g EV 8/8 h (meningite/sepse grave)"
  ],
  "imipenem": [
    "500 mg EV 6/6 h",
    "1 g EV 6/6 h (ajustar DRC/epilepsia)"
  ],
  "gentamicina": [
    "5–7 mg/kg EV 24/24 h dose única",
    "Monitorizar função renal e níveis"
  ],
  "amicacina": [
    "15 mg/kg EV 24/24 h dose única",
    "Monitorizar função renal"
  ],
  "sulfametoxazol_trimetoprim": [
    "800/160 mg VO 12/12 h",
    "15–20 mg/kg trimetoprima EV dividido 6/8 h"
  ],
  "doxiciclina": [
    "100 mg VO 12/12 h × 7–14 dias",
    "200 mg VO dose única (clamídia)"
  ],
  "aciclovir": [
    "400 mg VO 8/8 h (herpes)",
    "10 mg/kg EV 8/8 h (herpes disseminado/SNC)"
  ],
  "oseltamivir": [
    "75 mg VO 12/12 h × 5 dias (influenza)",
    "Iniciar < 48 h dos sintomas"
  ],
  "haloperidol": [
    "5 mg/mL — 2–5 mg IM/EV (agitação)",
    "0,5–2 mg VO 8/8 h"
  ],
  "risperidona": [
    "1–2 mg VO 12/12 h (psicose ambulatorial)"
  ],
  "quetiapina": [
    "25–100 mg VO à noite (agitação/delirium — off-label)"
  ],
  "escopolamina": [
    "20 mg/mL — 20 mg IM/EV lento + analgésico (cólica)"
  ],
  "butilbrometo_escopolamina": [
    "20 mg/mL — 20 mg IM/EV (Buscopan®)"
  ],
  "insulina": [
    "Regular 0,1 U/kg EV bolus CAD + infusão 0,1 U/kg/h",
    "NPH/glargina conforme esquema basal-bolus"
  ],
  "metformina": [
    "500–850 mg VO 8/8 h ou 12/12 h (DFG > 30)"
  ],
  "glicose": [
    "50% — 25–50 mL EV bolus (hipoglicemia grave)",
    "10% infusão se hipoglicemia persistente"
  ],
  "glucagon": [
    "1 mg IM/SC (hipoglicemia se acesso EV indisponível)"
  ],
  "omeprazol": [
    "40 mg VO 24/24 h",
    "40 mg EV 24/24 h"
  ],
  "pantoprazol": [
    "40 mg VO/EV 24/24 h"
  ],
  "esomeprazol": [
    "40 mg VO 24/24 h"
  ],
  "ranitidina": [
    "150 mg VO 12/12 h (disponibilidade limitada no BR)"
  ],
  "clopidogrel": [
    "300 mg ataque VO (SCA) + 75 mg 24/24 h",
    "75 mg 24/24 h manutenção"
  ],
  "heparina": [
    "5000 UI SC 8/8 h profilaxia",
    "80 UI/kg bolus + 18 UI/kg/h (TEP/SCA — protocolo)"
  ],
  "enoxaparina": [
    "1 mg/kg SC 12/12 h (TEP/TEV)",
    "40 mg SC 24/24 h profilaxia"
  ],
  "warfarina": [
    "5 mg VO dose inicial; ajustar INR 2–3",
    "Contraindicado na gestação"
  ],
  "rivaroxabana": [
    "20 mg VO 24/24 h com alimento (FA/TEV)",
    "15 mg 24/24 h se DFG 15–50"
  ],
  "naloxona": [
    "0,4 mg/mL — 0,4–2 mg EV/IM/IN; repetir 2–3 min até respiração"
  ],
  "flumazenil": [
    "0,1 mg/mL — 0,2 mg EV; 0,1 mg a cada 1 min (máx. 1 mg)"
  ],
  "atropina": [
    "0,25 mg/mL — 0,5–1 mg EV (bradicardia/organofosforado)",
    "1 mg EV ACLS"
  ],
  "terlipressina": [
    "1 mg EV 4/6 h (HDA varicosa)"
  ],
  "octreotide": [
    "50 mcg EV bolus + 25–50 mcg/h infusão (HDA)"
  ],
  "colchicina": [
    "0,5 mg VO 1 h + 0,5 mg 1 h depois; depois 0,5 mg 12/12 h (gota)"
  ],
  "alopurinol": [
    "100–300 mg VO 24/24 h (não iniciar na crise aguda)"
  ],
  "tiamina": [
    "500 mg EV 8/8 h × 3 dias (abstinência/Wernicke)",
    "100 mg VO 8/8 h"
  ],
  "magnesio_sulfato": [
    "Igual sulfato_magnesio — eclâmpsia/asma"
  ],
  "potassio_cloreto": [
    "10–20 mEq EV em 1 h (hipocalemia leve); nunca push rápido",
    "KCl oral conforme déficit"
  ],
  "gluconato_calcio": [
    "10% — 10 mL EV lento (hipocalcemia/hipercalemia cardiotóxica)"
  ],
  "bicarbonato": [
    "1 mEq/mL — 1–2 mEq/kg EV (acidose grave/hipercalemia)"
  ],
  "manitol": [
    "20% — 0,25–1 g/kg EV (HIC/edema cerebral)"
  ],
  "artesunato": [
    "2,4 mg/kg EV ataque; depois 1,2 mg/kg 12/12 h (malária grave)"
  ],
  "quinina": [
    "20 mg/kg EV em 4 h; manutenção 10 mg/kg 8/8 h (malária — monitorizar QT)"
  ],
  "hidroxicloroquina": [
    "400 mg VO 12/12 h × 1 dia; 400 mg 24/24 h × 4 dias (lúpus/malária leve)"
  ],
  "tiamazol": [
    "10–20 mg VO 8/8 h (hipertireoidismo)"
  ],
  "propiltiouracil": [
    "200 mg VO 4/4 h (tempestade tireotóxica)"
  ],
  "levotiroxina": [
    "25–100 mcg VO 24/24 h em jejum (hipotireoidismo)"
  ],
  "tamsulosina": [
    "0,4 mg VO 24/24 h (HPB/cólica renal — alta)"
  ],
  "lidocaina": [
    "2% — 1–1,5 mg/kg EV bolus (TV/FV)",
    "Infiltração local conforme procedimento"
  ],
  "amiodarona": [
    "150 mg EV em 10 min (TV/FV)",
    "360 mg EV em 6 h; manutenção 540 mg/24 h"
  ],
  "adenosina": [
    "6 mg EV bolus rápido; 12 mg se necessário (PSVT)"
  ],
  "digoxina": [
    "0,25–0,5 mg EV (FA com resposta ventricular rápida)"
  ],
  "diltiazem": [
    "0,25 mg/kg EV (FA/flutter)",
    "60–120 mg VO 8/8 h"
  ],
  "fluconazol": [
    "200 mg VO/EV 24/24 h",
    "800 mg dose única (candidíase vaginal)"
  ],
  "tranexamico": [
    "1 g EV em 10 min (HDA/sangramento)",
    "1 g VO 8/8 h (menorragia/dengue selecionada)"
  ],
  "nitroprussiato": [
    "50 mg/amp — infusão 0,3–10 mcg/kg/min (emergência hipertensiva/IC)"
  ],
  "valaciclovir": [
    "1 g VO 8/8 h × 7 dias (herpes zoster)",
    "500 mg VO 12/12 h (herpes simples)"
  ],
  "nifedipino": [
    "10 mg cápsula VO (urgência — cautela)",
    "30–60 mg OROS 24/24 h"
  ],
  "levetiracetam": [
    "1 g EV em 15 min (status)",
    "500 mg VO 12/12 h manutenção"
  ],
  "alteplase": [
    "0,9 mg/kg EV (máx. 90 mg) — 10% bolus + restante 1 h (AVC isquêmico)"
  ],
  "tenecteplase": [
    "0,25–0,5 mg/kg EV bolus (IAM)"
  ],
  "estreptoquinase": [
    "1,5 milhões UI EV em 1 h (IAM — se disponível)"
  ],
  "tobramicina": [
    "5–7 mg/kg EV 24/24 h dose única",
    "Colírio 0,3% — 1 gota 4/4 h (oftalmológico)"
  ],
  "vacina_tetano": [
    "dT/dTpa conforme esquema vacinal MS (profilaxia tétano)"
  ],
  "penicilina_benzatina": [
    "1,2 milhões UI IM dose única (sífilis primária)",
    "2,4 milhões UI IM (sífilis tardia)"
  ],
  "albendazol": [
    "400 mg VO dose única (ascaris)",
    "400 mg VO 12/12 h × 3 dias (outras helmintíases)"
  ],
  "mebendazol": [
    "100 mg VO 12/12 h × 3 dias",
    "500 mg VO dose única (enterobíase)"
  ],
  "ivermectina": [
    "200 mcg/kg VO dose única (escabiose/strongyloides)"
  ],
  "praziquantel": [
    "40 mg/kg VO dose única (schistosoma)"
  ],
  "dopamina": [
    "5–20 mcg/kg/min EV infusão (choque)"
  ],
  "dobutamina": [
    "2,5–20 mcg/kg/min EV infusão (IC baixo débito)"
  ],
  "pregabalina": [
    "75 mg VO 12/12 h (neuropatia)",
    "150 mg VO 12/12 h titular"
  ],
  "gabapentina": [
    "300 mg VO 8/8 h; titular até 3600 mg/dia"
  ],
  "soro_reidratacao": [
    "SRO 200–400 mL após cada evacuação/vômito",
    "Plano A/B/C MS — reidratação oral"
  ],
  "aztreonam": [
    "1–2 g EV 8/8 h (Gram-negativos)"
  ],
  "soro_antitetanico": [
    "500 UI IM (profilaxia tétano — esquema MS)"
  ],
  "dabigatrana": [
    "150 mg VO 12/12 h (FA/TEV)",
    "110 mg 12/12 h se DFG 30–50"
  ],
  "apixabana": [
    "5 mg VO 12/12 h (FA/TEV)",
    "2,5 mg 12/12 h se critérios de dose reduzida"
  ],
  "edoxabana": [
    "60 mg VO 24/24 h (FA/TEV)",
    "30 mg se dose reduzida"
  ],
  "vitamina_k": [
    "10 mg EV lento (anticoagulação warfarina)",
    "1–10 mg VO (deficiência vitamina K)"
  ],
  "sulfato_ferroso": [
    "200 mg VO 8/8 h (ferro elementar ~60 mg)",
    "EV se intolerância VO (protocolo institucional)"
  ],
  "secnidazol": [
    "2 g VO dose única (tricomoníase/giardíase)"
  ],
  "tinidazol": [
    "2 g VO dose única (giardíase/tricomoníase)"
  ],
  "anfotericina_b": [
    "1 mg/kg EV 24/24 h (fungos sistêmicos)",
    "Formulação lipídica se disponível"
  ],
  "budesonida": [
    "200–400 mcg inalatório 12/12 h",
    "9 mg VO 24/24 h (retocolite — contexto específico)"
  ],
  "fluticasona": [
    "250–500 mcg inalatório 12/12 h",
    "Spray nasal 2 jatos/narina 24/24 h"
  ],
  "mometasona": [
    "200 mcg inalatório 24/24 h",
    "Spray nasal 2 jatos/narina 24/24 h"
  ],
  "levonorgestrel": [
    "1,5 mg VO dose única (contracepção de emergência)"
  ],
  "fondaparinux": [
    "2,5 mg SC 24/24 h (SCA)",
    "5–10 mg SC 24/24 h (TEP)"
  ],
  "rifampicina": [
    "600 mg VO 24/24 h (TB)",
    "300 mg VO 12/12 h (meningite profilaxia)"
  ],
  "isoniazida": [
    "300 mg VO 24/24 h (TB)"
  ],
  "etambutol": [
    "15 mg/kg VO 24/24 h (TB)"
  ],
  "pirazinamida": [
    "25–30 mg/kg VO 24/24 h (TB)"
  ],
  "piridoxina": [
    "25–50 mg VO 24/24 h (profilaxia neuropatia INH)"
  ],
  "cloroquina": [
    "600 mg VO (malária por P. vivax — esquema MS)"
  ],
  "primaquina": [
    "0,5 mg/kg VO 24/24 h × 14 dias (radical cura P. vivax)"
  ],
  "mefloquina": [
    "750 mg VO + 500 mg após 6 h (malária não complicada)"
  ],
  "atovaquona": [
    "750 mg VO 12/12 h × 3 dias (malária com proguanil)"
  ],
  "isossorbida": [
    "5 mg SL (angina)",
    "40 mg VO 8/8 h (profilaxia)"
  ],
  "sertralina": [
    "50 mg VO 24/24 h; titular até 200 mg"
  ],
  "escitalopram": [
    "10 mg VO 24/24 h; máx. 20 mg"
  ],
  "venlafaxina": [
    "75 mg VO 24/24 h; titular"
  ],
  "micafungina": [
    "100 mg EV 24/24 h (candidíase invasiva)"
  ],
  "loperamida": [
    "4 mg VO depois 2 mg após evacuação (máx. 16 mg/dia)"
  ],
  "racecadotrilo": [
    "100 mg VO 8/8 h (diarreia aguda)"
  ],
  "domperidona": [
    "10 mg VO 8/8 h antes refeições"
  ],
  "bromoprida": [
    "10 mg VO/IM/EV 8/8 h"
  ],
  "colecalciferol": [
    "50.000 UI VO semanal (deficiência)"
  ],
  "cefuroxima": [
    "500 mg VO 12/12 h",
    "750 mg–1,5 g EV 8/8 h"
  ],
  "cefixima": [
    "400 mg VO dose única (gonorreia)",
    "400 mg VO 24/24 h × 5 dias"
  ],
  "espectinomicina": [
    "2 g IM dose única (gonorreia)"
  ],
  "dolutegravir": [
    "50 mg VO 12/12 h (PEP HIV — 28 dias)"
  ],
  "tenofovir": [
    "300 mg VO 24/24 h (PEP/TARV)"
  ],
  "emtricitabina": [
    "200 mg VO 24/24 h (PEP/TARV)"
  ],
  "raltegravir": [
    "400 mg VO 12/12 h (PEP HIV)"
  ],
  "zidovudina": [
    "300 mg VO 12/12 h (PEP/TARV)"
  ],
  "imunoglobulina_hepatite_b": [
    "0,06 mL/kg IM (profilaxia HB — esquema MS)"
  ],
  "vacina_hepatite_b": [
    "Esquema 0-1-6 meses IM (profilaxia HB)"
  ],
  "linezolida": [
    "600 mg VO/EV 12/12 h"
  ],
  "ertapenem": [
    "1 g EV/IM 24/24 h (ESBL/intra-abdominal leve)"
  ],
  "insulina_nph": [
    "0,1–0,2 U/kg SC 12/12 h (transição CAD)"
  ],
  "metildopa": [
    "250 mg VO 8/8 h (HAS gestacional)"
  ],
  "tetraciclina": [
    "500 mg VO 6/6 h × 7–14 dias"
  ],
  "ganciclovir": [
    "5 mg/kg EV 12/12 h (CMV)"
  ],
  "misoprostol": [
    "600 mcg VO/Subl (hemorragia pós-parto)"
  ],
  "metilergonovina": [
    "0,2 mg IM (hemorragia pós-parto — evitar se HAS)"
  ],
  "nistatina": [
    "Preferir VO/tópico; suspensão oral igual ambulatorial"
  ],
  "terbinafina": [
    "VO preferível; EV não usual no PS"
  ],
  "hidroxizina": [
    "25–50 mg VO/IM (prurido pós-opiáceo)",
    "EV profundo se VO indisponível — cautela QT"
  ],
  "lactulose": [
    "VO preferível; mesmo esquema ambulatorial"
  ],
  "mesalazina": [
    "VO preferível; manter dose habitual se internado por DII"
  ],
  "sulfasalazina": [
    "VO preferível; suspender se reação grave"
  ],
  "meloxicam": [
    "15 mg VO 24/24 h curto prazo se sem contraindicação"
  ],
  "indometacina": [
    "50 mg VO/retal 8/8 h (gota/cólica) — evitar EV"
  ],
  "atenolol": [
    "5 mg EV lento (FA — se protocolo institucional)",
    "Manter VO se estável"
  ],
  "bromazepam": [
    "Preferir diazepam/lorazepam EV se sedação hospitalar"
  ],
  "candesartana": [
    "Manter dose VO habitual se internado"
  ],
  "ketoconazol": [
    "VO preferível; evitar VO sistêmico se alternativa"
  ],
  "finasterida": [
    "VO preferível"
  ],
  "zolpidem": [
    "Evitar no PS salvo insônia aguda — curto prazo"
  ],
  "timolol": [
    "Colírio ou manter VO se indicado"
  ],
  "bumetanida": [
    "0,5–1 mg EV/IM; repetir conforme resposta",
    "Potência ~40× furosemida mg por mg"
  ],
  "clonidina": [
    "0,1–0,2 mg VO/SL (urgência HAS selecionada)",
    "Patch transdérmico em alguns serviços"
  ],
  "citalopram": [
    "VO preferível; efeito em 2–4 semanas"
  ],
  "paroxetina": [
    "VO preferível"
  ],
  "mirtazapina": [
    "15 mg VO à noite (depressão com insônia internado)"
  ],
  "montelukaste": [
    "VO preferível; não usar como broncodilatador agudo"
  ],
  "teofilina": [
    "240 mg EV em 20 min (ataque) + manutenção conforme nível — serviço especializado"
  ],
  "tiotropio": [
    "Manter inalador se paciente traz de casa; não substituir nebulização aguda"
  ],
  "beclometasona": [
    "Manter dose de controle se internado por outra causa"
  ],
  "dexclorfeniramina": [
    "2 mg VO/IM 8/8 h (urticária/prurido)"
  ],
  "acido_folico": [
    "VO preferível"
  ],
  "carbamazepina": [
    "VO preferível; EV não disponível comercialmente no BR usual"
  ],
  "azatioprina": [
    "VO preferível; manter dose se internado"
  ],
  "cimetidina": [
    "300 mg EV 6/6 h (profilaxia úlcera estresse)",
    "VO preferível se tolerado"
  ],
  "codeina": [
    "VO preferível; EV não usual — usar morfina/tramadol se analgesia parenteral"
  ],
  "bupropiona": [
    "VO preferível; manter se já em uso"
  ],
  "cefepima": [
    "1–2 g EV 8/8 h (infecção grave)",
    "2 g EV 8/8 h (neutropenia febril/meningite)",
    "Ajustar DFG < 60"
  ],
  "acetazolamida": [
    "250–500 mg VO/EV 6/8 h (glaucoma agudo adjuvante)",
    "Monitorizar eletrólitos e pH"
  ],
  "cloranfenicol": [
    "25 mg/kg/dia EV dividido 6/6 h (máx. 4 g/dia)",
    "Monitorizar hemograma"
  ],
  "carbonato_de_litio": [
    "Manter VO se possível; dosagem por nível",
    "Hidratação e monitorizar Na+, creatinina, lítio"
  ],
  "ciclosporina": [
    "Manter dose VO; EV em formulações específicas se indisponível VO"
  ],
  "cefoxitina": [
    "1–2 g EV 6/6 h",
    "2 g EV dose única profilaxia cirúrgica (30–60 min pré-incisão)"
  ],
  "betametasona": [
    "4–8 mg EV 6/6 h (exacerbação asma — curto prazo)",
    "IM maturação pulmonar conforme protocolo"
  ],
  "cabergolina": [
    "VO preferível"
  ],
  "carvao_vegetal_ativado": [
    "50 g via SNG após proteção de via aérea se necessário",
    "Repetir 25 g 4/4 h se ingestão sustentada (selecionado)"
  ],
  "ciproeptadina": [
    "4 mg VO 8/8 h — preferir VO"
  ],
  "clorpropamida": [
    "Manter VO; monitorizar glicemia — meia-vida longa"
  ],
  "tamoxifeno": [
    "Manter VO"
  ],
  "gliclazida": [
    "Manter VO se estável; monitorizar glicemia"
  ],
  "glibenclamida": [
    "Manter VO; hipoglicemia pode ser prolongada"
  ],
  "hidroxido_de_aluminio": [
    "VO preferível; mesmo esquema"
  ],
  "doxazosina": [
    "Manter VO; cautela hipotensão ortostática"
  ],
  "lansoprazol": [
    "30 mg VO 24/24 h (profilaxia úlcera estresse — se IBP indicado)"
  ],
  "fluoxetina": [
    "Manter VO; meia-vida longa — efeito persiste dias após suspensão"
  ],
  "levodopa": [
    "Manter horários rigorosos VO; evitar interrupção abrupta"
  ],
  "carbonato_de_calcio": [
    "VO preferível; gluconato cálcio EV se hipocalcemia aguda sintomática"
  ],
  "acido_ursodesoxicolico": [
    "Manter VO se indicado"
  ],
  "desmopressina": [
    "0,3 mcg/kg EV (hemofilia — protocolo hematologia)",
    "Monitorizar Na+ e osmolalidade"
  ],
  "octreotida": [
    "50 mcg EV bolus + infusão 50 mcg/h (sangramento varicoso — protocolo)",
    "100 mcg SC 8/8 h (fístula pancreática — protocolo)"
  ],
  "benzilpenicilina_benzatina": [
    "Sífilis primária: 2,4 milhões UI IM dose única",
    "Fe reumática profilaxia: 1,2 milhões UI IM a cada 3–4 sem",
    "IM profunda glúteo — nunca EV"
  ],
  "complexo_b": [
    "VO preferível; IM se má absorção selecionada"
  ]
};

const MED_DRUG_OVERRIDES = {
  "dipirona": {
    "ciAbs": [
      "Porfiria aguda",
      "Discrasia sanguínea",
      "Agranulocitose prévia por metamizol"
    ],
    "notes": "Risco raro de agranulocitose. Preferir paracetamol na gestação."
  },
  "paracetamol": {
    "ciAbs": [
      "Insuficiência hepática grave"
    ],
    "ciRel": [
      "Uso > 4 g/dia",
      "Etanolismo crônico"
    ],
    "notes": "Máx. 3–4 g/dia adulto."
  },
  "tramadol": {
    "ciAbs": [
      "Epilepsia não controlada com tramadol",
      "IMAO"
    ],
    "notes": "Receita especial B1. Risco de convulsão em altas doses."
  },
  "morfina": {
    "notes": "Receita especial A. Titular EV; risco de depressão respiratória."
  },
  "nimesulida": {
    "ciAbs": [
      "Insuficiência hepática",
      "Crianças < 12 anos"
    ],
    "notes": "Hepatotoxicidade — evitar uso prolongado."
  },
  "aspirina": {
    "ciAbs": [
      "Úlcera GI ativa",
      "Crianças com virose (Reye)",
      "Hemofilia"
    ],
    "ciRel": [
      "Asma",
      "Gestação 3º trimestre"
    ]
  },
  "sumatriptano": {
    "ciAbs": [
      "DAC",
      "AVC/AIT",
      "Angina",
      "HAS grave não controlada",
      "Enxaqueca basilar/hemiplégica"
    ]
  },
  "metoclopramida": {
    "ciAbs": [
      "Obstrução GI",
      "Feocromocitoma",
      "Epilepsia/Parkinson"
    ],
    "ciRel": [
      "Prolongamento QT"
    ]
  },
  "azitromicina": {
    "ciRel": [
      "Prolongamento QT",
      "Macrolídeo prévio < 3 meses"
    ]
  },
  "ciprofloxacino": {
    "ciAbs": [
      "Gestação/lactação",
      "Crianças/adolescentes (salvo indicação)"
    ]
  },
  "vancomicina": {
    "ciRel": [
      "Infusão rápida — síndrome homem vermelho",
      "DRC — ajuste"
    ]
  },
  "acido_valproico": {
    "ciAbs": [
      "Doença hepática",
      "Porfiria",
      "Gestação (teratogênico)"
    ]
  },
  "warfarina": {
    "ciAbs": [
      "Sangramento ativo",
      "Gestação"
    ],
    "notes": "Interações múltiplas; monitorizar INR."
  },
  "colchicina": {
    "indications": [
      "Gota aguda",
      "Profilaxia gota",
      "Pericardite aguda/recorrente"
    ],
    "presentations": [
      "0,5 mg comprimido"
    ],
    "posologyVo": [
      "Gota aguda: 1 mg VO depois 0,5 mg 1 h depois; ou 0,5 mg 8/8 h",
      "Profilaxia: 0,5–1 mg VO 24/24 h"
    ],
    "ciRel": [
      "DRC — reduzir dose",
      "Interação macrolídeos/estatinas (miopatia)",
      "Diarreia comum"
    ],
    "notes": "Evitar em DFG < 30 ou usar dose reduzida."
  },
  "potassio_cloreto": {
    "ciAbs": [
      "Hipercalemia",
      "Anúria",
      "Acidose hipercalêmica"
    ]
  },
  "nitroglicerina": {
    "ciAbs": [
      "Uso de sildenafil/tadalafil 24–48 h",
      "Hipotensão",
      "HIC"
    ]
  },
  "insulina": {
    "ciAbs": [
      "Hipoglicemia"
    ],
    "notes": "Titular conforme glicemia capilar horária no CAD."
  },
  "metformina": {
    "ciAbs": [
      "DFG < 30",
      "Acidose metabólica",
      "Insuficiência hepática grave"
    ]
  },
  "rivaroxabana": {
    "ciAbs": [
      "Sangramento ativo"
    ],
    "ciRel": [
      "DFG < 15",
      "Gestação"
    ]
  },
  "hidroxicloroquina": {
    "ciRel": [
      "Prolongamento QT",
      "Retinopatia — uso crônico"
    ]
  },
  "propiltiouracil": {
    "ciRel": [
      "Hepatotoxicidade",
      "Gestação 1º trimestre preferível a tiamazol"
    ]
  },
  "levotiroxina": {
    "ciAbs": [
      "Tireotoxicose não tratada"
    ]
  },
  "oxigenio": {
    "ciRel": [
      "DPOC — titular FiO₂ (risco hipercapnia)"
    ]
  },
  "prednisona": {
    "indications": [
      "Asma/DPOC exacerbada",
      "Reações alérgicas",
      "Doenças autoimunes"
    ]
  },
  "escitalopram": {
    "indications": [
      "Depressão maior",
      "Transtorno de ansiedade generalizada",
      "Pânico",
      "Ansiedade aguda (titulação lenta)"
    ],
    "ciAbs": [
      "IMAO concomitante (14 dias)"
    ],
    "ciRel": [
      "Idoso",
      "Prolongamento QT em altas doses",
      "Gestação/lactação"
    ],
    "presentations": [
      "10 mg, 20 mg comprimido"
    ],
    "posologyVo": [
      "10 mg VO 24/24 h; titular até 20 mg após 2–4 sem",
      "Idoso: 5–10 mg 24/24 h"
    ],
    "notes": "Receita B1. Efeito terapêutico em 2–4 semanas."
  },
  "venlafaxina": {
    "indications": [
      "Depressão",
      "Ansiedade",
      "Enxaqueca profilática (off-label)"
    ],
    "presentations": [
      "37,5 mg, 75 mg, 150 mg comprimido"
    ],
    "posologyVo": [
      "37,5–75 mg VO 24/24 h; titular até 150–225 mg",
      "Descontinuar gradualmente — síndrome abstinência"
    ],
    "ciRel": [
      "HAS — monitorizar PA",
      "Prolongamento QT"
    ],
    "notes": "Receita B1. IRSN — evitar com IMAO."
  },
  "sertralina": {
    "indications": [
      "Depressão",
      "TOC",
      "TEPT",
      "Fobia social",
      "Pânico"
    ],
    "presentations": [
      "50 mg, 100 mg comprimido"
    ],
    "posologyVo": [
      "50 mg VO 24/24 h; titular 50 mg/semana até 200 mg",
      "TOC: frequentemente 100–200 mg/dia"
    ],
    "notes": "Receita B1. Menor interação CYP que paroxetina."
  },
  "bromoprida": {
    "indications": [
      "Náusea/vômito",
      "Gastroparesia leve",
      "Refluxo com sintomas dispépticos"
    ],
    "presentations": [
      "10 mg comprimido",
      "10 mg/mL gotas",
      "5 mg/mL ampola IM/EV"
    ],
    "posologyVo": [
      "10 mg VO 8/8 h antes refeições",
      "20–40 gotas VO 8/8 h"
    ],
    "posologyHosp": [
      "10 mg IM/EV lento 8/8 h",
      "EV lento — risco extrapyramidal se bolus rápido"
    ],
    "ciRel": [
      "Parkinson",
      "Prolongamento QT",
      "Epilepsia"
    ],
    "notes": "Procinético — evitar uso crônico (> 12 sem) por risco tardive dyskinesia."
  },
  "domperidona": {
    "indications": [
      "Náusea/vômito funcional",
      "Refluxo com sintomas dispépticos"
    ],
    "presentations": [
      "10 mg comprimido",
      "1 mg/mL suspensão"
    ],
    "posologyVo": [
      "10 mg VO 8/8 h 15–30 min antes refeições",
      "Máx. 30 mg/dia"
    ],
    "posologyHosp": [
      "10 mg VO 8/8 h — preferir VO (menor risco cardíaco que EV)"
    ],
    "ciRel": [
      "Prolongamento QT",
      "Insuficiência hepática",
      "Uso > 7 dias — risco arrítmia"
    ],
    "notes": "Suspensa comercialização em alguns países — usar menor tempo possível."
  },
  "linezolida": {
    "indications": [
      "Infecção por MRSA/VRE",
      "Pneumonia nosocomial",
      "Pele complicada resistente"
    ],
    "presentations": [
      "600 mg comprimido",
      "2 mg/mL bolsa EV 300 mL"
    ],
    "posologyVo": [
      "600 mg VO 12/12 h × 10–14 dias"
    ],
    "posologyHosp": [
      "600 mg EV 12/12 h infundir 30–120 min",
      "Inibidor MAO fraco — evitar tiramina/ISRS concomitante"
    ],
    "ciRel": [
      "Trombocitopenia",
      "Neuropatia periférica se > 28 dias",
      "Síndrome serotoninérgica com ISRS"
    ],
    "notes": "Antibiótico reserva — uso curto e dirigido."
  },
  "ertapenem": {
    "indications": [
      "Infecção intra-abdominal complicada",
      "Pneumonia comunitária (internação)",
      "ITU complicada",
      "ESBL selecionado"
    ],
    "presentations": [
      "1 g pó liofilizado IM/EV"
    ],
    "posologyVo": [
      "Não disponível VO"
    ],
    "posologyHosp": [
      "1 g EV 24/24 h × 5–14 dias",
      "1 g IM profundo 24/24 h (alternativa ambulatorial)"
    ],
    "ciRel": [
      "Epilepsia — reduz limiar convulsivo",
      "Alergia penicilina grave — avaliar reatividade cruzada"
    ],
    "notes": "Não cobre Pseudomonas. Ajustar DFG < 30."
  },
  "levetiracetam": {
    "indications": [
      "Status epilepticus (adjuvante)",
      "Crise convulsiva aguda (manutenção)",
      "Epilepsia manutenção"
    ],
    "presentations": [
      "250 mg, 500 mg, 750 mg comprimido",
      "100 mg/mL solução",
      "500 mg/5 mL ampola EV"
    ],
    "posologyVo": [
      "500 mg VO 12/12 h; titular até 1500 mg 12/12 h",
      "750 mg VO dose de ataque ambulatorial se orientado"
    ],
    "notes": "Menos interações que fenitoína/carbamazepina. Ajustar DRC."
  },
  "pregabalina": {
    "indications": [
      "Neuropatia periférica dolorosa",
      "Fibromialgia",
      "Epilepsia adjuvante",
      "Ansiedade generalizada (registro variável)"
    ],
    "presentations": [
      "75 mg, 150 mg, 300 mg cápsula"
    ],
    "posologyVo": [
      "75 mg VO 12/12 h; titular até 150–300 mg 12/12 h",
      "Neuropatia: iniciar 75 mg 12/12 h"
    ],
    "ciRel": [
      "Insuficiência renal — ajustar dose",
      "Abuso/dependência em altas doses",
      "Edema periférico"
    ],
    "notes": "Receita B1 em alguns estados — ver legislação local. Descontinuar gradualmente."
  },
  "gabapentina": {
    "indications": [
      "Neuropatia periférica",
      "Neuralgia pós-herpética",
      "Crise convulsiva adjuvante"
    ],
    "presentations": [
      "300 mg, 400 mg cápsula",
      "600 mg comprimido"
    ],
    "posologyVo": [
      "300 mg VO 8/8 h; titular até 1800–3600 mg/dia dividido",
      "Neuralgia: 300 mg dia 1; 600 mg dia 2; 900 mg dia 3; depois titular"
    ],
    "ciRel": [
      "DRC — ajustar intervalo/dose",
      "Sedação",
      "Abuso reportado"
    ],
    "notes": "Não interage fortemente via CYP. Efeito analgésico em dias-semanas."
  },
  "amiodarona": {
    "indications": [
      "FA/flutter (controle ritmo/frequência)",
      "TV/FV recorrente",
      "Controle FC na SCA (alternativa)"
    ],
    "presentations": [
      "200 mg comprimido",
      "150 mg/3 mL ampola EV"
    ],
    "posologyVo": [
      "200 mg VO 8/8 h × 1 sem (ataque); 200 mg 12/12 h × 1 sem; 200 mg 24/24 h manutenção"
    ],
    "ciRel": [
      "Tireotoxicidade/hipotireoidismo",
      "Pulmonite intersticial",
      "Prolongamento QT",
      "Interações (warfarina, digoxina, estatinas)"
    ],
    "notes": "Monitorizar TSH, função hepática e Rx tórax basal. Fotossensibilidade."
  },
  "fluconazol": {
    "indications": [
      "Candidíase mucocutânea",
      "Candidíase esofágica",
      "Profilaxia criptococo (contexto HIV)"
    ],
    "presentations": [
      "150 mg cápsula",
      "200 mg cápsula",
      "2 mg/mL solução EV"
    ],
    "posologyVo": [
      "150 mg VO dose única (vaginal)",
      "200 mg VO 24/24 h × 14 dias (esofágica)",
      "100–200 mg VO 24/24 h (cutânea extensa)"
    ],
    "ciRel": [
      "Prolongamento QT",
      "Gravidez alta dose",
      "Interações CYP (estatinas, warfarina)"
    ],
    "notes": "Ajustar DFG. Candida krusei frequentemente resistente."
  },
  "dabigatrana": {
    "indications": [
      "FA não valvar (anticoagulação)",
      "TEV/EP (registro variável)"
    ],
    "presentations": [
      "110 mg, 150 mg cápsula"
    ],
    "posologyVo": [
      "150 mg VO 12/12 h (FA; reduzir 110 mg se idoso/DRC)",
      "Não abrir/esmagar cápsula"
    ],
    "ciRel": [
      "DRC",
      "Sangramento ativo",
      "Prótese mecânica — contraindicado"
    ],
    "notes": "Antídoto: idarucizumab (serviços selecionados). Suspender 24–48 h antes cirurgia eletiva."
  },
  "apixabana": {
    "indications": [
      "FA (anticoagulação)",
      "TEV/EP tratamento e profilaxia"
    ],
    "presentations": [
      "2,5 mg, 5 mg comprimido"
    ],
    "posologyVo": [
      "5 mg VO 12/12 h (FA)",
      "2,5 mg 12/12 h se ≥ 2 critérios (idade ≥ 80, peso ≤ 60, creatinina ≥ 1,5)"
    ],
    "ciRel": [
      "Sangramento ativo",
      "Prótese valvar mecânica",
      "DRC grave — cautela"
    ],
    "notes": "Suspender conforme risco cirúrgico. Não monitorizar INR."
  },
  "metoprolol": {
    "indications": [
      "Hipertensão",
      "Angina",
      "IC com FE reduzida (succinato)",
      "Controle FC pós-IAM/FA"
    ],
    "presentations": [
      "25 mg, 50 mg, 100 mg comprimido",
      "Succinato 25–200 mg (liberação prolongada)"
    ],
    "posologyVo": [
      "50 mg VO 12/12 h (HAS/angina)",
      "25–50 mg 12/12 h (IC — succinato titular)"
    ],
    "posologyHosp": [
      "5 mg EV 5 min (SCA/FA — monitorizado)",
      "Manter VO assim que possível"
    ],
    "ciRel": [
      "Asma",
      "BAV",
      "Bradicardia",
      "Não suspender abruptamente"
    ],
    "notes": "Succinato para IC; tartrato para HAS/angina aguda."
  },
  "piridoxina": {
    "indications": [
      "Profilaxia neuropatia por isoniazida",
      "Deficiência de vitamina B6",
      "Nausea gravidez (off-label baixa dose)"
    ],
    "presentations": [
      "10 mg, 25 mg, 50 mg comprimido"
    ],
    "posologyVo": [
      "25–50 mg VO 24/24 h com isoniazida (TB)",
      "50 mg 24/24 h (deficiência)"
    ],
    "notes": "Incluir em esquemas TB com isoniazida."
  },
  "esomeprazol": {
    "indications": [
      "DRGE",
      "Úlcera péptica",
      "Profilaxia úlcera por AINE",
      "Erradicação H. pylori (tripla)"
    ],
    "presentations": [
      "20 mg, 40 mg comprimido",
      "40 mg pó EV"
    ],
    "posologyVo": [
      "20–40 mg VO 24/24 h antes refeição",
      "40 mg VO 12/12 h (úlcera)"
    ],
    "posologyHosp": [
      "40 mg EV 24/24 h (HDA profilaxia/úlcera)"
    ],
    "notes": "Uso prolongado — risco deficiência Mg/B12 e infecção C. difficile."
  },
  "budesonida": {
    "indications": [
      "Asma controlador",
      "DPOC (formulacao específica)",
      "Retocolite leve (enema/forma local)"
    ],
    "presentations": [
      "200 mcg/jato inalador",
      "3 mg cápsula (Entocort — contexto específico)"
    ],
    "posologyVo": [
      "200–400 mcg inalados 12/12 h",
      "Enxaguar boca após inalação"
    ],
    "notes": "Menor supressão adrenal sistêmica que prednisona em baixas doses inaladas."
  },
  "fluticasona": {
    "indications": [
      "Asma controlador",
      "Rinite alérgica (spray nasal)",
      "DPOC (triple therapy)"
    ],
    "presentations": [
      "50 mcg/jato HFA",
      "Spray nasal 50 mcg/jato"
    ],
    "posologyVo": [
      "100–250 mcg inalados 12/12 h (asma)",
      "2 jatos/narina 24/24 h (rinite)"
    ],
    "notes": "Associar sempre SABA para resgate na asma."
  }
};

const MED_VO_FAMILY_MAP = {
  "dipirona": "dipirona",
  "paracetamol": "paracetamol",
  "naproxeno": "naproxeno",
  "ibuprofeno": "ibuprofeno",
  "diclofenaco": "diclofenaco",
  "cetoprofeno": "cetoprofeno",
  "nimesulida": "nimesulida",
  "ciclobenzaprina": "ciclobenzaprina",
  "tramadol": "tramadol",
  "sumatriptano": "sumatriptano",
  "zolmitriptano": "zolmitriptano",
  "metoclopramida": "metoclopramida",
  "ondansetrona": "ondansetrona",
  "dexametasona": "dexametasona",
  "propranolol": "propranolol",
  "topiramato": "topiramato",
  "amitriptilina": "amitriptilina",
  "verapamil": "verapamil",
  "amoxicilina": "amoxicilina",
  "azitromicina": "azitromicina",
  "clindamicina": "clindamicina",
  "fosfomicina": "fosfomicina",
  "nitrofurantoina": "nitrofurantoina",
  "tizanidina": "tizanidina"
};

function medVoLinesForDrug (drugId) {
  if (typeof MED_VO === 'undefined' || typeof MED_VO_FAMILIES === 'undefined') return [];
  const fam = MED_VO_FAMILY_MAP[drugId];
  const keys = new Set();
  if (fam && MED_VO_FAMILIES[fam]) MED_VO_FAMILIES[fam].forEach(k => keys.add(k));
  if (drugId === 'amoxicilina_clavulanato' && typeof MED_VO_GROUPS !== 'undefined') {
    (MED_VO_GROUPS.penicillin_clavulanate || []).forEach(k => keys.add(k));
  }
  return [...keys].map(k => MED_VO[k]).filter(Boolean);
}

function medPrimaryClass (classes) {
  const order = ['opioid', 'nsaid', 'analgesic', 'antibiotic', 'benzodiazepine', 'anticoagulant', 'vasopressor', 'bronchodilator', 'corticosteroid', 'ppi', 'antidiabetic'];
  for (const c of order) if ((classes || []).includes(c)) return c;
  return (classes || [])[0] || 'other';
}

function medBuildDrugMonograph (id, meta) {
  const ov = MED_DRUG_OVERRIDES[id] || {};
  const defaults = typeof medClassDefaults === 'function' ? medClassDefaults(meta.classes) : { indications: [], ciAbs: [], ciRel: [], posologyVo: [], posologyHosp: [] };
  const voLines = medVoLinesForDrug(id);
  const hosp = MED_HOSP_POSOLOGY[id] || defaults.posologyHosp;
  const presentations = ov.presentations || [];

  if (!presentations.length) {
    voLines.forEach(line => {
      const m = line.match(/^([^—]+)/);
      if (m) presentations.push(m[1].trim());
    });
    (hosp || []).forEach(line => {
      const amp = line.match(/(\d+[^—]*(?:mg|g|UI|mcg)[^—]*(?:amp|cp|comprimido|mL)?[^—]*)/i);
      if (amp) presentations.push(amp[1].trim());
    });
  }

  const classLabels = (meta.classes || [])
    .filter(c => c !== 'discharge_only')
    .map(c => typeof medClassLabel === 'function' ? medClassLabel(c) : c);
  const uniqueClass = [...new Set(classLabels)];

  return {
    id,
    name: meta.name,
    classes: meta.classes || [],
    classLabel: uniqueClass.join(' · ') || 'Medicamento',
    indications: ov.indications || defaults.indications,
    ciAbs: ov.ciAbs || defaults.ciAbs,
    ciRel: ov.ciRel || defaults.ciRel,
    presentations: [...new Set(presentations)].filter(Boolean),
    posologyVo: voLines.length ? voLines : (ov.posologyVo || defaults.posologyVo),
    posologyHosp: hosp,
    notes: ov.notes || '',
    searchText: [meta.name, id.replace(/_/g, ' ')].join(' ').toLowerCase()
  };
}

function medBuildMedicacoesCatalog () {
  const byId = new Map();
  if (typeof PS_DRUG_META !== 'undefined') {
    Object.entries(PS_DRUG_META).forEach(([id, meta]) => {
      byId.set(id, medBuildDrugMonograph(id, meta));
    });
  }
  Object.entries(MED_EXTRA_DRUGS).forEach(([id, extra]) => {
    const meta = { name: extra.name, classes: extra.classes || [] };
    const built = medBuildDrugMonograph(id, meta);
    byId.set(id, {
      ...built,
      indications: extra.indications || built.indications,
      ciAbs: extra.ciAbs || built.ciAbs,
      ciRel: extra.ciRel || built.ciRel,
      presentations: extra.presentations || built.presentations,
      posologyVo: extra.posologyVo || built.posologyVo,
      posologyHosp: extra.posologyHosp || built.posologyHosp,
      notes: extra.notes || built.notes,
      searchText: (extra.name + ' ' + id).toLowerCase()
    });
  });
  return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
}

let MED_CATALOG = [];
function medGetCatalog () {
  if (!MED_CATALOG.length) MED_CATALOG = medBuildMedicacoesCatalog();
  return MED_CATALOG;
}
