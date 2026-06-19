/* Calculadora pediátrica — painel principal (menu lateral) */

const PED_COMMON_MEDS = [
  {
    id: 'amoxicilina', name: 'Amoxicilina', dosePerKg: 50, unit: 'mg', maxDaily: 3000, daily: true, perDoseDiv: 3,
    freq: '8/8 h', route: 'VO', indicacao: 'AMO, otite, ITU, sinusite',
    idade: '≥ 3 meses (geral) · evitar se mononucleose',
    peso: 'Qualquer peso pediátrico · ajustar suspensão',
    forms: [
      { type: 'susp', conc: 50, label: 'Suspensão 250 mg/5 mL (50 mg/mL)' },
      { type: 'susp', conc: 25, label: 'Suspensão 125 mg/5 mL (25 mg/mL)' },
      { type: 'cp', strength: 500, minKg: 18, label: 'Comprimido 500 mg' }
    ]
  },
  {
    id: 'amox_clav', name: 'Amoxicilina + clavulanato', dosePerKg: 45, unit: 'mg', maxDaily: 3000, daily: true, perDoseDiv: 2,
    freq: '12/12 h', route: 'VO', indicacao: 'AMO resistente, otite recorrente, mordedura',
    idade: '≥ 3 meses', peso: 'Preferir suspensão &lt; 25 kg',
    forms: [
      { type: 'susp', conc: 50, label: 'Suspensão 400+57 mg/5 mL (componente amoxicilina ~50 mg/mL)' },
      { type: 'cp', strength: 875, minKg: 25, label: 'Comprimido 875+125 mg' }
    ]
  },
  {
    id: 'azitro', name: 'Azitromicina', dosePerKg: 10, unit: 'mg', maxDose: 500, freq: '24/24 h (dia 1)', route: 'VO',
    indicacao: 'Pneumonia atípica, coqueluche, alternativa em alergia a penicilina',
    idade: '≥ 6 meses (geral) · &lt; 6 meses só se indicado',
    peso: 'Dia 1: 10 mg/kg · dias 2–5: 5 mg/kg/dia',
    forms: [
      { type: 'susp', conc: 40, label: 'Suspensão 200 mg/5 mL (40 mg/mL)' },
      { type: 'cp', strength: 500, minKg: 25, label: 'Comprimido 500 mg (dose única dia 1)' }
    ],
    rxExtra: (mg, peso) => {
      const d25 = Math.min(5 * peso, 250);
      return `<span class="muted">Dias 2–5: ${pedFmt(d25, 0)} mg/dia (5 mg/kg)</span>`;
    }
  },
  {
    id: 'ceftriaxona', name: 'Ceftriaxona', dosePerKg: 50, unit: 'mg', maxDaily: 2000, daily: true, perDoseDiv: 1,
    freq: '1×/dia ou 12/12 h', route: 'IM/IV', indicacao: 'Infecção grave, meningite, sepse, ITU complicada',
    idade: 'RN: evitar hiperbilirrubinemia · lactente: ok', peso: '50–100 mg/kg/dia conforme gravidade',
    forms: [
      { type: 'amp', conc: 100, label: 'Frasco-ampola 1 g reconstituído conforme bula (IM/IV)' }
    ],
    rxCustom: (mg) => `Ceftriaxona ${pedFmt(mg, 0)} mg IM/IV 1×/dia (ou ${pedFmt(mg / 2, 0)} mg 12/12 h se dose alta)`
  },
  {
    id: 'cefalexina', name: 'Cefalexina', dosePerKg: 50, unit: 'mg', maxDaily: 3000, daily: true, perDoseDiv: 4,
    freq: '6/6 h', route: 'VO', indicacao: 'Pele, faringite, ITU leve',
    idade: '≥ 1 ano (geral)', peso: '25–50 mg/kg/dia',
    forms: [
      { type: 'susp', conc: 50, label: 'Suspensão 250 mg/5 mL (50 mg/mL)' },
      { type: 'cp', strength: 500, minKg: 20, label: 'Comprimido 500 mg' }
    ]
  },
  {
    id: 'dipirona', name: 'Dipirona', dosePerKg: 10, unit: 'mg', maxDose: 1000, freq: '6/6 h', route: 'VO/IV',
    indicacao: 'Analgesia, febre', idade: '≥ 3 meses (VO) · RN: evitar', peso: '10–15 mg/kg/dose',
    forms: [
      { type: 'susp', conc: 50, label: 'Suspensão oral 50 mg/mL' },
      { type: 'gotas', mgPerDrop: 25, label: 'Gotas 500 mg/mL (~25 mg/gota)' },
      { type: 'cp', strength: 500, minKg: 15, label: 'Comprimido 500 mg' }
    ]
  },
  {
    id: 'paracetamol', name: 'Paracetamol', dosePerKg: 15, unit: 'mg', maxDose: 750, freq: '6/6 h', route: 'VO/PR',
    indicacao: 'Analgesia, febre', idade: 'Qualquer idade (ajustar forma)', peso: '10–15 mg/kg · máx. 60 mg/kg/dia',
    forms: [
      { type: 'susp', conc: 32, label: 'Suspensão 32 mg/mL (200 mg/5 mL)' },
      { type: 'gotas', mgPerDrop: 13, label: 'Gotas 200 mg/mL (~13 mg/gota)' },
      { type: 'cp', strength: 750, minKg: 30, label: 'Comprimido 750 mg' }
    ]
  },
  {
    id: 'ibuprofeno', name: 'Ibuprofeno', dosePerKg: 10, unit: 'mg', maxDose: 400, freq: '6/8 h', route: 'VO',
    indicacao: 'Analgesia, febre, inflamação', idade: '≥ 6 meses', peso: '10 mg/kg · máx. 40 mg/kg/dia',
    minAgeMeses: 6,
    forms: [
      { type: 'susp', conc: 20, label: 'Suspensão 100 mg/5 mL (20 mg/mL)' },
      { type: 'cp', strength: 400, minKg: 25, label: 'Comprimido 400 mg' }
    ]
  },
  {
    id: 'prednisolona', name: 'Prednisolona', dosePerKg: 1, unit: 'mg', maxDose: 60, freq: '12/24 h', route: 'VO',
    indicacao: 'Asma, alergia, inflamação', idade: 'Qualquer idade pediátrica', peso: '1–2 mg/kg/dia',
    forms: [
      { type: 'susp', conc: 3, label: 'Solução/suspensão 3 mg/mL' },
      { type: 'cp', strength: 20, minKg: 15, label: 'Comprimido 20 mg' }
    ]
  },
  {
    id: 'dexametasona', name: 'Dexametasona (crupe)', dosePerKg: 0.6, unit: 'mg', maxDose: 16, freq: 'dose única ou 12/12 h', route: 'VO/IM',
    indicacao: 'Crupe moderado-grave, asma', idade: '≥ 3 meses (crupe)', peso: '0,6 mg/kg dose única (máx. 16 mg)',
    forms: [
      { type: 'amp', conc: 4, label: 'Ampola 4 mg/mL — VO diluído ou IM' },
      { type: 'cp', strength: 4, minKg: 12, label: 'Comprimido 4 mg' }
    ]
  },
  {
    id: 'ondansetrona', name: 'Ondansetrona', dosePerKg: 0.15, unit: 'mg', maxDose: 8, freq: '8/8 h', route: 'VO/IV',
    indicacao: 'Vômitos, gastroenterite, facilitar SRO', idade: '≥ 1 mês (off-label comum) · evitar &lt; 4 meses se possível',
    peso: '0,15 mg/kg/dose · máx. 8 mg/dose',
    forms: [
      { type: 'amp', conc: 2, label: 'Ampola 4 mg/2 mL (2 mg/mL) — EV/IM lento' },
      { type: 'susp', conc: 0.8, label: 'Solução oral 4 mg/5 mL (0,8 mg/mL)' },
      { type: 'cp', strength: 4, minKg: 27, label: 'Comprimido 4 mg (se dose ≥ 3,5 mg)' },
      { type: 'cp', strength: 8, minKg: 40, label: 'Comprimido 8 mg (se dose ≥ 7 mg)' }
    ],
    rxCustom: (mg, peso) => {
      if (mg >= 3.5 && peso >= 27) {
        return `Ondansetrona <strong>4 mg</strong> VO ou EV lento 8/8 h (dose calculada ${pedFmt(mg, 1)} mg — arredondar para apresentação 4 mg)`;
      }
      const mlIv = mg / 2;
      const mlVo = mg / 0.8;
      return `Ondansetrona <strong>${pedFmt(mlIv, 1)} mL</strong> EV lento (ampola 4 mg/2 mL) = ${pedFmt(mg, 1)} mg · 8/8 h<br>
              <span class="muted">VO alternativo: solução 4 mg/5 mL — ${pedFmt(mlVo, 1)} mL (= ${pedFmt(mg, 1)} mg). Comprimidos 4/8 mg não fracionam bem em crianças pequenas.</span>`;
    }
  },
  {
    id: 'salbutamol', name: 'Salbutamol nebul', dosePerKg: 0.15, unit: 'mg', maxDose: 5, freq: '20/20 min se grave', route: 'Inalação',
    indicacao: 'Asma, broncoespasmo, bronquiolite (se indicado)', idade: 'Qualquer idade', peso: '0,15 mg/kg · ou dose fixa &lt; 5 anos',
    forms: [],
    rxCustom: (mg, peso) => {
      if (peso < 15) {
        return `Salbutamol <strong>2,5 mg</strong> (0,5 mL sol. 5 mg/mL) + SF 0,9% 3 mL nebul · 20/20 min se grave<br>
                <span class="muted">Dose calculada ${pedFmt(mg, 2)} mg/kg — em &lt;15 kg usar 2,5 mg fixo é prática comum.</span>`;
      }
      return `Salbutamol <strong>${pedFmt(mg, 2)} mg</strong> (≈ ${pedFmt(mg / 5, 2)} mL de sol. 5 mg/mL) + SF 0,9% 3 mL nebul · 20/20 min se grave`;
    }
  },
  {
    id: 'adrenalina', name: 'Adrenalina (anafilaxia)', dosePerKg: 0.01, unit: 'mg', maxDose: 0.5, freq: '5–15 min se necessário', route: 'IM',
    indicacao: 'Anafilaxia, urticária grave com broncoespasmo', idade: 'Qualquer idade', peso: '0,01 mg/kg IM',
    forms: [],
    rxCustom: (mg, peso) => {
      const ml = peso * 0.01;
      return `Adrenalina <strong>${pedFmt(ml, 2)} mL</strong> IM (1:1.000) = ${pedFmt(mg, 2)} mg · repetir 5–15 min se necessário · máx. 0,5 mg/dose`;
    }
  },
  {
    id: 'fenitoina', name: 'Fenitoína (convulsão)', dosePerKg: 20, unit: 'mg', maxDose: 1500, freq: 'ataque IV lento', route: 'IV',
    indicacao: 'Estado de mal epiléptico (2ª linha)', idade: 'Qualquer idade', peso: '20 mg/kg IV lento (máx. 50 mg/min)',
    forms: [],
    rxCustom: (mg) => `Fenitoína ${pedFmt(mg, 0)} mg IV lento (20 mg/kg) · manutenção 5 mg/kg/dia`
  },
  {
    id: 'midazolam', name: 'Midazolam (convulsão)', dosePerKg: 0.2, unit: 'mg', maxDose: 10, freq: 'dose única', route: 'IM/bucal',
    indicacao: 'Convulsão aguda (pré-hospitalar/PS)', idade: '≥ 1 mês', peso: '0,2 mg/kg IM ou bucal',
    forms: [
      { type: 'amp', conc: 5, label: 'Ampola 5 mg/mL — IM ou via bucal' }
    ]
  }
];

function pedFmt (n, dec) {
  if (!Number.isFinite(n)) return '—';
  return Number(n.toFixed(dec)).toString().replace('.', ',');
}

function pedGetWeight () {
  const v = parseFloat(document.getElementById('ped-calc-peso')?.value);
  return Number.isFinite(v) && v > 0 ? v : NaN;
}

function pedGetAgeMonths () {
  const anos = parseFloat(document.getElementById('ped-calc-idade-anos')?.value);
  const meses = parseFloat(document.getElementById('ped-calc-idade-meses')?.value);
  const a = Number.isFinite(anos) && anos >= 0 ? anos : 0;
  const m = Number.isFinite(meses) && meses >= 0 ? meses : 0;
  const total = Math.round(a * 12 + m);
  return total > 0 ? total : null;
}

function pedFmtAge (idadeMeses) {
  if (!idadeMeses) return null;
  if (idadeMeses < 12) return `${idadeMeses} meses`;
  const anos = Math.floor(idadeMeses / 12);
  const rest = idadeMeses % 12;
  if (rest === 0) return `${anos} ano${anos > 1 ? 's' : ''}`;
  return `${anos} ano${anos > 1 ? 's' : ''} e ${rest} mes${rest > 1 ? 'es' : ''}`;
}

function pedGetPatient () {
  const peso = pedGetWeight();
  const idadeMeses = pedGetAgeMonths();
  return {
    peso,
    idadeMeses,
    idadeLabel: pedFmtAge(idadeMeses),
    summary: pedRenderPatientSummary(peso, idadeMeses)
  };
}

function pedRenderPatientSummary (peso, idadeMeses) {
  if (!Number.isFinite(peso)) return '';
  const parts = [`<strong>${pedFmt(peso, 1)} kg</strong>`];
  if (idadeMeses) parts.push(`<strong>${pedFmtAge(idadeMeses)}</strong> (${idadeMeses} meses)`);
  else parts.push('<span class="muted">idade não informada</span>');

  let faixa = '';
  if (idadeMeses != null) {
    if (idadeMeses < 1) faixa = 'Recém-nascido';
    else if (idadeMeses < 12) faixa = 'Lactente';
    else if (idadeMeses < 36) faixa = 'Pré-escolar';
    else if (idadeMeses < 144) faixa = 'Escolar';
    else faixa = 'Adolescente';
  } else if (peso < 10) faixa = 'Provável lactente (estimar idade)';
  else if (peso < 20) faixa = 'Provável pré-escolar/escolar';
  else faixa = 'Escolar/adolescente';

  return `<div class="ped-calc-patient-summary">
    <span>Paciente:</span> ${parts.join(' · ')}
    <span class="ped-calc-patient-faixa">${faixa}</span>
  </div>`;
}

function pedAgeOk (drug, idadeMeses) {
  if (drug.minAgeMeses != null && idadeMeses != null && idadeMeses < drug.minAgeMeses) {
    return { ok: false, msg: `Indicado ≥ ${drug.minAgeMeses} meses` };
  }
  return { ok: true, msg: '' };
}

function pedCalcDose (peso, drug) {
  const raw = peso * drug.dosePerKg;
  let dose = raw;
  if (drug.maxDaily) dose = Math.min(dose, drug.maxDaily);
  else if (drug.maxDose) dose = Math.min(dose, drug.maxDose);
  const capped = dose < raw;
  let perDose = null;
  if (drug.daily && drug.perDoseDiv) perDose = dose / drug.perDoseDiv;
  return { raw, dose, capped, perDose };
}

function pedSuggestFromForms (mg, forms, peso, idadeMeses) {
  if (!forms || !forms.length) return '';
  const lines = [];
  forms.forEach(f => {
    if (f.minKg && peso < f.minKg) return;
    if (f.minAgeMeses && idadeMeses != null && idadeMeses < f.minAgeMeses) return;
    if (f.type === 'susp' || f.type === 'amp') {
      const ml = mg / f.conc;
      lines.push(`${f.label}: <strong>${pedFmt(ml, 1)} mL</strong> (= ${pedFmt(mg, 1)} mg)`);
    } else if (f.type === 'gotas') {
      const drops = Math.max(1, Math.round(mg / f.mgPerDrop));
      lines.push(`${f.label}: <strong>${drops} gotas</strong> (≈ ${pedFmt(drops * f.mgPerDrop, 0)} mg)`);
    } else if (f.type === 'cp') {
      if (mg <= f.strength * 1.05) {
        lines.push(`${f.label}: <strong>1 comprimido</strong> (${f.strength} mg)`);
      }
    }
  });
  return lines.length ? lines.join('<br>') : '<span class="muted">Usar suspensão/gotas — comprimido não indicado para este peso.</span>';
}

function pedBuildRx (drug, peso, idadeMeses, calc) {
  const ageCheck = pedAgeOk(drug, idadeMeses);
  if (!ageCheck.ok) {
    return `<span class="ped-calc-warn">${ageCheck.msg}</span>`;
  }
  const mg = drug.daily && calc.perDose ? calc.perDose : calc.dose;
  if (typeof drug.rxCustom === 'function') {
    let html = drug.rxCustom(calc.dose, peso, calc);
    if (drug.daily && calc.perDose) {
      html = `<span class="muted">Dose por tomada: ${pedFmt(calc.perDose, 0)} mg</span><br>` + html;
    }
    if (typeof drug.rxExtra === 'function') html += '<br>' + drug.rxExtra(calc.dose, peso);
    return html;
  }
  let html = pedSuggestFromForms(mg, drug.forms, peso, idadeMeses);
  if (drug.daily) {
    html = `<span class="muted">Total ${pedFmt(calc.dose, 0)} mg/dia · ${pedFmt(calc.perDose, 0)} mg/dose</span><br>` + html;
  }
  if (typeof drug.rxExtra === 'function') html += '<br>' + drug.rxExtra(calc.dose, peso);
  return html || `<span class="muted">Dose teórica ${pedFmt(mg, 1)} mg — ver apresentação local</span>`;
}

function pedHollidaySegar (kg) {
  if (typeof hollidaySegar === 'function') return hollidaySegar(kg);
  if (kg <= 10) return kg * 100;
  if (kg <= 20) return 1000 + (kg - 10) * 50;
  return 1500 + (kg - 20) * 20;
}

function pedSroSachets (ml) {
  const sachet = 200;
  const n = ml / sachet;
  return { ml, sachets: Math.ceil(n), sachetMl: sachet, perHour4h: ml / 4, per15min: ml / 16 };
}

function pedRenderCustomDose (peso, doseKg, conc) {
  const totalMg = peso * doseKg;
  let html = `<div class="ped-calc-result-block">
    <h4>Dose personalizada</h4>
    <p><strong>Dose teórica:</strong> ${pedFmt(totalMg, 2)} mg (${pedFmt(doseKg, 2)} mg/kg × ${pedFmt(peso, 1)} kg)</p>`;
  if (conc > 0) {
    html += `<p><strong>Volume (${pedFmt(conc, 1)} mg/mL):</strong> ${pedFmt(totalMg / conc, 2)} mL</p>`;
  }
  html += `<p class="calc-note">Escolha apresentação comercial compatível (suspensão, gotas, ampola) — arredonde para fracionamento viável.</p></div>`;
  return html;
}

function pedRenderCommonMeds (patient, filter) {
  const { peso, idadeMeses, summary } = patient;
  const q = (filter || '').toLowerCase().trim();
  const list = PED_COMMON_MEDS.filter(d => !q || d.name.toLowerCase().includes(q));
  if (!list.length) {
    return summary + '<p class="muted">Nenhum medicamento encontrado para este filtro.</p>';
  }

  const rows = list.map(d => {
    const calc = pedCalcDose(peso, d);
    const ageCheck = pedAgeOk(d, idadeMeses);
    const teorica = d.daily
      ? `${pedFmt(calc.dose, 0)} mg/dia${calc.perDose ? ` (${pedFmt(calc.perDose, 0)} mg/dose)` : ''}`
      : `${pedFmt(calc.dose, calc.dose < 1 ? 2 : 1)} mg/dose`;
    const rx = pedBuildRx(d, peso, idadeMeses, calc);
    const ageWarn = !ageCheck.ok ? `<br><span class="ped-calc-warn">${ageCheck.msg}</span>` : '';

    return `<tr class="${!ageCheck.ok ? 'ped-calc-row-warn' : ''}">
      <td><strong>${d.name}</strong><br><span class="muted">${d.indicacao}</span></td>
      <td><span class="ped-calc-meta">${d.idade}</span><br><span class="ped-calc-meta">${d.peso}</span>${ageWarn}</td>
      <td>${teorica}<br><span class="muted">${d.dosePerKg} mg/kg${d.daily ? '/dia' : ''}</span></td>
      <td class="ped-calc-rx-cell">${rx}<br><span class="muted">${d.freq} · ${d.route}</span></td>
    </tr>`;
  }).join('');

  return `${summary}
    <div class="ped-calc-result-block">
    <h4>Medicamentos — prescrição prática</h4>
    <table class="emerg-table ped-calc-med-table ped-calc-med-table--rx">
      <tr><th>Medicamento</th><th>Idade / peso</th><th>Dose teórica</th><th>Como prescrever</th></tr>
      ${rows}
    </table>
    <p class="calc-note">Doses teóricas por mg/kg; a coluna <strong>Como prescrever</strong> usa apresentações reais (suspensão, gotas, ampola 4 mg/2 mL, comprimidos quando aplicável). Confirme bula e estoque local.</p>
  </div>`;
}

function pedRenderFluids (patient, plan) {
  const { peso, idadeMeses, summary } = patient;
  const maint24 = pedHollidaySegar(peso);
  const maintHr = maint24 / 24;
  const bolus20 = peso * 20;
  const bolus10 = peso * 10;
  const planB = pedSroSachets(peso * 75);
  const planC1h = peso * 30;

  let idadeNota = '';
  if (idadeMeses != null) {
    if (idadeMeses < 6) idadeNota = 'Lactente &lt; 6 meses: preferir avaliação presencial; planos OMS com cautela.';
    else if (idadeMeses < 24) idadeNota = 'Lactente 6–24 meses: SRO com colher/medida; vigilância estreita.';
    else idadeNota = '≥ 2 anos: pode usar copo; mesmo volumes por kg.';
  }

  let html = `${summary}
    <div class="ped-calc-result-block">
    <h4>Hidratação — ${pedFmt(peso, 1)} kg</h4>
    ${idadeNota ? `<p class="ped-calc-fluid-note">${idadeNota}</p>` : ''}

    <div class="ped-calc-fluid-card">
      <h5>Manutenção (Holliday-Segar)</h5>
      <p><strong>${Math.round(maint24)} mL/24 h</strong> · <strong>${pedFmt(maintHr, 1)} mL/h</strong> contínuo se IV</p>
      <p class="muted">Ex.: SF 0,9% ${pedFmt(maintHr, 0)} mL/h ou SG 5% + SF conforme protocolo · via oral se tolera.</p>
    </div>

    <div class="ped-calc-fluid-card">
      <h5>Expansão (choque / desidratação grave)</h5>
      <p><strong>${Math.round(bolus10)} mL</strong> (10 mL/kg) ou <strong>${Math.round(bolus20)} mL</strong> (20 mL/kg) SF 0,9% IV em bolus · repetir conforme perfusão/diurese</p>
    </div>`;

  if (plan === 'A' || !plan) {
    const posA = peso < 10 ? '50–100 mL' : '100–200 mL';
    html += `<div class="ped-calc-fluid-card">
      <h5>Plano A — desidratação leve (OMS)</h5>
      <p>Após <strong>cada</strong> diarreia/vômito: SRO <strong>${posA}</strong> (≈ 10 mL/kg se &lt;10 kg)</p>
      <p class="muted">Orientação domiciliar · manter alimentação · retorno se piora, sangue, letargia ou recusa de líquidos.</p>
    </div>`;
  }

  if (plan === 'B' || !plan) {
    html += `<div class="ped-calc-fluid-card">
      <h5>Plano B — desidratação moderada</h5>
      <p><strong>${Math.round(planB.ml)} mL</strong> de SRO em <strong>4 horas</strong> (75 mL/kg)</p>
      <p>≈ <strong>${planB.sachets} sache(s)</strong> de 200 mL · <strong>${pedFmt(planB.perHour4h, 0)} mL/h</strong> · <strong>${pedFmt(planB.per15min, 0)} mL a cada 15 min</strong></p>
      <p class="muted">Administrar aos poucos (colher/copo) · se vômitos: ondansetrona dose por kg · reavaliar ao fim das 4 h (Plano A ou C).</p>
    </div>`;
  }

  if (plan === 'C' || !plan) {
    html += `<div class="ped-calc-fluid-card">
      <h5>Plano C — desidratação grave / choque</h5>
      <p><strong>${Math.round(planC1h)} mL</strong> SF 0,9% IV em <strong>1 hora</strong> (30 mL/kg)</p>
      <p>Depois: <strong>${Math.round(maint24)} mL/24 h</strong> manutenção + reposição de déficit conforme grau de desidratação</p>
      <p class="muted">Monitorar perfusão, diurese alvo ≥ 1 mL/kg/h · corrigir K⁺/Na⁺ lentamente se distúrbio.</p>
    </div>`;
  }

  html += `<p class="calc-note">SRO = soro de reidratação oral (sache ~200 mL). Reidratação oral é preferencial se tolerada. Hiponatremia: reidratação lenta.</p></div>`;
  return html;
}

function pedRenderEmergency (patient) {
  const { peso, summary } = patient;
  let zoneBar = '';
  if (typeof broselowZoneFromWeight === 'function' && typeof BROSELOW_ZONES !== 'undefined') {
    const zone = broselowZoneFromWeight(peso);
    if (zone) {
      zoneBar = `<div class="broselow-zone-bar" style="background:${zone.hex};color:${zone.textColor}">
        <strong>Broselow ${zone.label}</strong> · ${zone.kgRange} kg
      </div>`;
    } else if (peso > 36) {
      zoneBar = '<p class="ped-calc-adult-note"><strong>&gt; 36 kg:</strong> usar doses adultas.</p>';
    }
  }

  const epiMg = 0.01 * peso;
  const epiMlIm = peso * 0.01;
  const choque2 = 2 * peso;
  const choque4 = 4 * peso;
  const glu10 = 0.5 * peso;

  const emergRx = [
    { nome: 'Adrenalina PCR (IV/IO)', rx: `${pedFmt(epiMlIm, 1)} mL (1:10.000) = ${pedFmt(epiMg, 2)} mg · repetir q3–5 min` },
    { nome: 'Adrenalina anafilaxia (IM)', rx: `${pedFmt(epiMlIm, 2)} mL IM (1:1.000) = ${pedFmt(epiMg, 2)} mg` },
    { nome: 'Choque 1º / 2º+', rx: `${Math.round(choque2)} J (2 J/kg) · ${Math.round(choque4)} J (4 J/kg)` },
    { nome: 'Glicose 10% (hipoglicemia)', rx: `${pedFmt(glu10, 0)} mL IV (5 mL/kg)` }
  ];

  const emergRows = emergRx.map(r => `<tr><td><strong>${r.nome}</strong></td><td>${r.rx}</td></tr>`).join('');

  const doses = typeof broselowDrugDoses === 'function' ? broselowDrugDoses(peso) : [];
  const broselowRows = doses.map(row => `<tr>
    <td><strong>${row.name}</strong></td>
    <td>${row.dosePerKg}</td>
    <td>${row.total}</td>
    <td>${row.note}</td>
  </tr>`).join('');

  return `${summary}
    <div class="ped-calc-result-block">
    <h4>Emergência — ${pedFmt(peso, 1)} kg</h4>
    ${zoneBar}
    <table class="emerg-table ped-calc-med-table">
      <tr><th>Intervenção</th><th>Prescrição prática</th></tr>
      ${emergRows}
    </table>
    ${broselowRows ? `<table class="emerg-table broselow-drug-table">
      <tr><th>Fármaco</th><th>Dose/kg</th><th>Dose total</th><th>Observação</th></tr>
      ${broselowRows}
    </table>` : ''}
    <p class="calc-note">PALS/AHA · confirmar apresentação institucional. Scores (Silverman, PCR, Parkland) em Calculadoras essenciais → Pediatria.</p>
  </div>`;
}

function pedCalcRun () {
  const patient = pedGetPatient();
  const resultEl = document.getElementById('ped-calc-result');
  if (!resultEl) return;

  if (!Number.isFinite(patient.peso)) {
    resultEl.hidden = true;
    resultEl.innerHTML = '';
    return;
  }

  const activeTab = document.querySelector('.ped-calc-tab--active')?.dataset.pedTab || 'meds';
  let html = '';

  if (activeTab === 'dose') {
    const doseKg = parseFloat(document.getElementById('ped-calc-dose-kg')?.value);
    const conc = parseFloat(document.getElementById('ped-calc-conc')?.value);
    if (!doseKg || doseKg <= 0) {
      resultEl.hidden = false;
      resultEl.innerHTML = patient.summary + '<p class="muted">Informe a dose em mg/kg para calcular.</p>';
      return;
    }
    html = patient.summary + pedRenderCustomDose(patient.peso, doseKg, conc);
  } else if (activeTab === 'meds') {
    html = pedRenderCommonMeds(patient, document.getElementById('ped-calc-med-filter')?.value || '');
  } else if (activeTab === 'fluid') {
    html = pedRenderFluids(patient, document.getElementById('ped-calc-fluid-plan')?.value || '');
  } else if (activeTab === 'emerg') {
    html = pedRenderEmergency(patient);
  }

  resultEl.innerHTML = html;
  resultEl.hidden = false;
}

function pedSwitchTab (tabId) {
  document.querySelectorAll('.ped-calc-tab').forEach(btn => {
    btn.classList.toggle('ped-calc-tab--active', btn.dataset.pedTab === tabId);
    btn.setAttribute('aria-selected', btn.dataset.pedTab === tabId ? 'true' : 'false');
  });
  document.querySelectorAll('.ped-calc-panel').forEach(panel => {
    panel.hidden = panel.dataset.pedPanel !== tabId;
  });
  pedCalcRun();
}

function initPediatricCalcPanel () {
  const wrap = document.getElementById('ped-calc-wrap');
  if (!wrap || wrap.dataset.pedBound) return;
  wrap.dataset.pedBound = '1';

  document.querySelectorAll('.ped-calc-tab').forEach(btn => {
    btn.addEventListener('click', () => pedSwitchTab(btn.dataset.pedTab));
  });

  ['ped-calc-peso', 'ped-calc-idade-anos', 'ped-calc-idade-meses', 'ped-calc-dose-kg', 'ped-calc-conc', 'ped-calc-med-filter', 'ped-calc-fluid-plan'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', pedCalcRun);
    el.addEventListener('change', pedCalcRun);
  });

  document.getElementById('ped-calc-form')?.addEventListener('submit', e => {
    e.preventDefault();
    pedCalcRun();
  });

  pedSwitchTab('meds');
}
