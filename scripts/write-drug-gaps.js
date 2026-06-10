#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const report = require('./audit-medicacoes-gaps-report.json');

const META = {
  lidocaina: { name: 'Lidocaína', classes: ['antiarrhythmic'] },
  amiodarona: { name: 'Amiodarona', classes: ['antiarrhythmic'] },
  adenosina: { name: 'Adenosina', classes: ['antiarrhythmic'] },
  digoxina: { name: 'Digoxina', classes: ['antiarrhythmic'] },
  diltiazem: { name: 'Diltiazem', classes: ['ccb'] },
  fluconazol: { name: 'Fluconazol', classes: ['antibiotic'] },
  tranexamico: { name: 'Ácido tranexâmico', classes: ['anticoagulant'] },
  nitroprussiato: { name: 'Nitroprussiato de sódio', classes: ['vasodilator'] },
  valaciclovir: { name: 'Valaciclovir', classes: ['antiviral'] },
  nifedipino: { name: 'Nifedipino', classes: ['ccb'] },
  levetiracetam: { name: 'Levetiracetam', classes: ['anticonvulsant'] },
  alteplase: { name: 'Alteplase (rt-PA)', classes: ['anticoagulant'] },
  tenecteplase: { name: 'Tenecteplase', classes: ['anticoagulant'] },
  estreptoquinase: { name: 'Estreptoquinase', classes: ['anticoagulant'] },
  tobramicina: { name: 'Tobramicina', classes: ['antibiotic', 'aminoglycoside'] },
  vacina_tetano: { name: 'Vacina dT/dTpa (tétano)', classes: ['discharge_only'] },
  penicilina_benzatina: { name: 'Penicilina benzatina', classes: ['antibiotic', 'penicillin'] },
  albendazol: { name: 'Albendazol', classes: ['antiprotozoal'] },
  mebendazol: { name: 'Mebendazol', classes: ['antiprotozoal'] },
  ivermectina: { name: 'Ivermectina', classes: ['antiprotozoal'] },
  praziquantel: { name: 'Praziquantel', classes: ['antiprotozoal'] },
  secnidazol: { name: 'Secnidazol', classes: ['antibiotic', 'antiprotozoal'] },
  tinidazol: { name: 'Tinidazol', classes: ['antibiotic', 'antiprotozoal'] },
  dopamina: { name: 'Dopamina', classes: ['vasopressor'] },
  dobutamina: { name: 'Dobutamina', classes: ['vasopressor'] },
  amitriptilina: { name: 'Amitriptilina', classes: ['tricyclic'] },
  pregabalina: { name: 'Pregabalina', classes: ['anticonvulsant'] },
  gabapentina: { name: 'Gabapentina', classes: ['anticonvulsant'] },
  soro_reidratacao: { name: 'Soro de reidratação oral', classes: ['non_drug'] },
  aztreonam: { name: 'Aztreonam', classes: ['antibiotic'] },
  soro_antitetanico: { name: 'Soro antitetânico (SAT)', classes: ['discharge_only'] },
  dabigatrana: { name: 'Dabigatrana', classes: ['anticoagulant'] },
  apixabana: { name: 'Apixabana', classes: ['anticoagulant'] },
  edoxabana: { name: 'Edoxabana', classes: ['anticoagulant'] },
  vitamina_k: { name: 'Fitomenadiona (vitamina K)', classes: ['vitamin'] },
  sulfato_ferroso: { name: 'Sulfato ferroso', classes: ['vitamin'] },
  anfotericina_b: { name: 'Anfotericina B', classes: ['antibiotic'] },
  espironolactona: { name: 'Espironolactona', classes: ['diuretic'] },
  budesonida: { name: 'Budesonida', classes: ['corticosteroid'] },
  fluticasona: { name: 'Fluticasona', classes: ['corticosteroid'] },
  mometasona: { name: 'Mometasona', classes: ['corticosteroid'] },
  levonorgestrel: { name: 'Levonorgestrel', classes: ['hormone', 'discharge_only'] },
  medroxiprogesterona: { name: 'Medroxiprogesterona', classes: ['hormone'] },
  fondaparinux: { name: 'Fondaparinux', classes: ['anticoagulant'] },
  rifampicina: { name: 'Rifampicina', classes: ['antibiotic'] },
  isoniazida: { name: 'Isoniazida', classes: ['antibiotic'] },
  etambutol: { name: 'Etambutol', classes: ['antibiotic'] },
  pirazinamida: { name: 'Pirazinamida', classes: ['antibiotic'] },
  piridoxina: { name: 'Piridoxina (vitamina B6)', classes: ['vitamin'] },
  cloroquina: { name: 'Cloroquina', classes: ['antimalarial'] },
  primaquina: { name: 'Primaquina', classes: ['antimalarial'] },
  mefloquina: { name: 'Mefloquina', classes: ['antimalarial'] },
  atovaquona: { name: 'Atovaquona', classes: ['antimalarial'] },
  isossorbida: { name: 'Isosorbida (mononitrato)', classes: ['vasodilator'] },
  sertralina: { name: 'Sertralina', classes: ['antidepressant'] },
  escitalopram: { name: 'Escitalopram', classes: ['antidepressant'] },
  venlafaxina: { name: 'Venlafaxina', classes: ['antidepressant'] },
  micafungina: { name: 'Micafungina', classes: ['antibiotic'] },
  topiramato: { name: 'Topiramato', classes: ['anticonvulsant'] },
  nitrofurantoina: { name: 'Nitrofurantoína', classes: ['antibiotic', 'nitrofuran'] },
  fosfomicina: { name: 'Fosfomicina trometamol', classes: ['antibiotic'] },
  loperamida: { name: 'Loperamida', classes: ['antispasmodic'] },
  racecadotrilo: { name: 'Racecadotrilo', classes: ['antispasmodic'] },
  domperidona: { name: 'Domperidona', classes: ['antiemetic'] },
  bromoprida: { name: 'Bromoprida', classes: ['antiemetic'] },
  colecalciferol: { name: 'Colecalciferol (vitamina D)', classes: ['vitamin'] },
  hidroclorotiazida: { name: 'Hidroclorotiazida', classes: ['diuretic'] },
  cefuroxima: { name: 'Cefuroxima', classes: ['antibiotic', 'cephalosporin'] },
  cefixima: { name: 'Cefixima', classes: ['antibiotic', 'cephalosporin'] },
  espectinomicina: { name: 'Espectinomicina', classes: ['antibiotic'] },
  dolutegravir: { name: 'Dolutegravir', classes: ['antiviral'] },
  tenofovir: { name: 'Tenofovir (TDF)', classes: ['antiviral'] },
  emtricitabina: { name: 'Emtricitabina (FTC)', classes: ['antiviral'] },
  raltegravir: { name: 'Raltegravir', classes: ['antiviral'] },
  zidovudina: { name: 'Zidovudina (AZT)', classes: ['antiviral'] },
  imunoglobulina_hepatite_b: { name: 'Imunoglobulina anti-HBs', classes: ['discharge_only'] },
  vacina_hepatite_b: { name: 'Vacina hepatite B', classes: ['discharge_only'] },
  linezolida: { name: 'Linezolida', classes: ['antibiotic'] },
  ertapenem: { name: 'Ertapenem', classes: ['antibiotic', 'carbapenem'] },
  insulina_nph: { name: 'Insulina NPH', classes: ['antidiabetic'] },
  metildopa: { name: 'Metildopa', classes: ['vasodilator'] },
  tetraciclina: { name: 'Tetraciclina', classes: ['antibiotic', 'tetracycline'] },
  ganciclovir: { name: 'Ganciclovir', classes: ['antiviral'] },
  misoprostol: { name: 'Misoprostol', classes: ['hormone'] },
  metilergonovina: { name: 'Metilergonovina (ergometrina)', classes: ['hormone'] }
};

const gaps = {};
report.missingMeta.forEach(({ id }) => {
  if (!META[id]) throw new Error('Missing META for ' + id);
  gaps[id] = META[id];
});

const lines = [
  '/* Fármacos citados nos protocolos — complemento PS_DRUG_META (jun/2026) */',
  '',
  'const PS_DRUG_META_GAPS = {'
];
Object.entries(gaps).forEach(([id, meta]) => {
  lines.push(`  ${id}: { name: '${meta.name.replace(/'/g, "\\'")}', classes: ${JSON.stringify(meta.classes)} },`);
});
lines.push('};', '');

fs.writeFileSync(path.join(__dirname, '..', 'ps-drug-meta-gaps.js'), lines.join('\n'), 'utf8');
console.log('Wrote ps-drug-meta-gaps.js with', Object.keys(gaps).length, 'entries');
