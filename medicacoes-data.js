/* Medicações — catálogo clínico (gerado + revisado jun/2026) */
/* eslint-disable max-len */

const MEDHUB_MED_BUILD = 'med-v3-rename';

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
    "ciAbs": [
      "DRC grave + inibidor CYP3A4/P-gp"
    ],
    "notes": "Toxicidade em doses altas ou interações."
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
