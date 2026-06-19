/* Calculadora pediátrica — painel principal (menu lateral) */

const PED_COMMON_MEDS = [
  { name: 'Amoxicilina', dosePerKg: 50, unit: 'mg', maxDaily: 3000, daily: true, perDoseDiv: 3, freq: '8/8 h', route: 'VO', note: '50 mg/kg/dia (máx. 3 g/dia) · ITU/AMO' },
  { name: 'Amoxicilina + clavulanato', dosePerKg: 45, unit: 'mg', maxDaily: 3000, daily: true, perDoseDiv: 2, freq: '12/12 h', route: 'VO', note: '45 mg/kg/dia (componente amoxicilina)' },
  { name: 'Azitromicina', dosePerKg: 10, unit: 'mg', maxDose: 500, freq: '24/24 h · dia 1', route: 'VO', note: 'Dia 1: 10 mg/kg · dias 2–5: 5 mg/kg/dia' },
  { name: 'Ceftriaxona', dosePerKg: 50, unit: 'mg', maxDaily: 2000, daily: true, perDoseDiv: 1, freq: '1×/dia ou 12/12 h', route: 'IM/IV', note: '50–100 mg/kg/dia conforme indicação' },
  { name: 'Cefalexina', dosePerKg: 50, unit: 'mg', maxDaily: 3000, daily: true, perDoseDiv: 4, freq: '6/6 h', route: 'VO', note: '25–50 mg/kg/dia · pele/ITU leve' },
  { name: 'Dipirona', dosePerKg: 10, unit: 'mg', maxDose: 1000, freq: '6/6 h', route: 'VO/IV', note: '10–15 mg/kg/dose' },
  { name: 'Paracetamol', dosePerKg: 15, unit: 'mg', maxDose: 750, freq: '6/6 h', route: 'VO/PR', note: '10–15 mg/kg/dose · máx. 60 mg/kg/dia' },
  { name: 'Ibuprofeno', dosePerKg: 10, unit: 'mg', maxDose: 400, freq: '6/8 h', route: 'VO', note: '≥ 6 meses · máx. 40 mg/kg/dia' },
  { name: 'Prednisolona', dosePerKg: 1, unit: 'mg', maxDose: 60, freq: '12/24 h', route: 'VO', note: '1–2 mg/kg/dia · asma/crupe' },
  { name: 'Dexametasona (crupe)', dosePerKg: 0.6, unit: 'mg', maxDose: 16, freq: 'dose única ou 12/12 h', route: 'VO/IM', note: '0,6 mg/kg · crupe moderado-grave' },
  { name: 'Ondansetrona', dosePerKg: 0.15, unit: 'mg', maxDose: 8, freq: '8/8 h', route: 'VO/IV', note: '0,15 mg/kg/dose' },
  { name: 'Salbutamol nebul', dosePerKg: 0.15, unit: 'mg', maxDose: 5, freq: '20/20 min se grave', route: 'Inalação', note: '0,15 mg/kg · ou 2,5–5 mg fixo &lt;5 anos' },
  { name: 'Adrenalina (anafilaxia)', dosePerKg: 0.01, unit: 'mg', maxDose: 0.5, freq: '5–15 min se necessário', route: 'IM', note: '0,01 mg/kg = 0,01 mL/kg de 1:1.000' },
  { name: 'Fenitoína (convulsão)', dosePerKg: 20, unit: 'mg', maxDose: 1500, freq: 'dose de ataque', route: 'IV', note: '20 mg/kg lento · manutenção 5 mg/kg/dia' },
  { name: 'Midazolam (convulsão)', dosePerKg: 0.2, unit: 'mg', maxDose: 10, freq: 'dose única', route: 'IM/bucal', note: '0,2 mg/kg · repetir se necessário' }
];

function pedFmt (n, dec) {
  if (!Number.isFinite(n)) return '—';
  return Number(n.toFixed(dec)).toString().replace('.', ',');
}

function pedGetWeight () {
  const el = document.getElementById('ped-calc-peso');
  const v = parseFloat(el?.value);
  return Number.isFinite(v) && v > 0 ? v : NaN;
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

function pedHollidaySegar (kg) {
  if (typeof hollidaySegar === 'function') return hollidaySegar(kg);
  if (kg <= 10) return kg * 100;
  if (kg <= 20) return 1000 + (kg - 10) * 50;
  return 1500 + (kg - 20) * 20;
}

function pedRenderCustomDose (peso, doseKg, conc) {
  const totalMg = peso * doseKg;
  let html = `<div class="ped-calc-result-block">
    <h4>Dose personalizada</h4>
    <p><strong>Dose total:</strong> ${pedFmt(totalMg, 2)} mg</p>`;
  if (conc > 0) {
    html += `<p><strong>Volume (${pedFmt(conc, 1)} mg/mL):</strong> ${pedFmt(totalMg / conc, 2)} mL</p>`;
  }
  html += `<p class="calc-note">Confirme dose máxima por bula e apresentação disponível.</p></div>`;
  return html;
}

function pedRenderCommonMeds (peso, filter) {
  const q = (filter || '').toLowerCase().trim();
  const list = PED_COMMON_MEDS.filter(d => !q || d.name.toLowerCase().includes(q));
  if (!list.length) {
    return '<p class="muted">Nenhum medicamento encontrado para este filtro.</p>';
  }

  const rows = list.map(d => {
    const { dose, capped, perDose } = pedCalcDose(peso, d);
    const capNote = capped ? ' <span class="ped-calc-capped">(máx.)</span>' : '';
    const doseLabel = d.daily
      ? `<strong>${pedFmt(dose, 0)} mg/dia</strong>${capNote}${perDose ? `<br><span class="muted">≈ ${pedFmt(perDose, 0)} mg/dose</span>` : ''}`
      : `<strong>${pedFmt(dose, dose < 1 ? 2 : 1)} ${d.unit}</strong>${capNote}`;
    return `<tr>
      <td><strong>${d.name}</strong><br><span class="muted">${d.note}</span></td>
      <td>${d.dosePerKg} ${d.unit}/kg${d.daily ? '/dia' : ''}</td>
      <td>${doseLabel}</td>
      <td>${d.freq}<br>${d.route}</td>
    </tr>`;
  }).join('');

  return `<div class="ped-calc-result-block">
    <h4>Medicamentos comuns — ${pedFmt(peso, 1)} kg</h4>
    <table class="emerg-table ped-calc-med-table">
      <tr><th>Medicamento</th><th>Dose/kg</th><th>Dose calculada</th><th>Posologia</th></tr>
      ${rows}
    </table>
    <p class="calc-note">Referência orientativa — ajustar à bula, idade, função renal/hepática e protocolo institucional.</p>
  </div>`;
}

function pedRenderFluids (peso, plan) {
  const maint24 = pedHollidaySegar(peso);
  const maintHr = maint24 / 24;
  const bolus20 = peso * 20;
  const bolus10 = peso * 10;
  const planB4h = peso * 75;
  const planC1h = peso * 30;

  let html = `<div class="ped-calc-result-block">
    <h4>Hidratação — ${pedFmt(peso, 1)} kg</h4>
    <p><strong>Manutenção (Holliday-Segar):</strong> ${Math.round(maint24)} mL/24 h · ${pedFmt(maintHr, 1)} mL/h</p>
    <p><strong>Bolus expansão:</strong> ${Math.round(bolus10)} mL (10 mL/kg) ou ${Math.round(bolus20)} mL (20 mL/kg) — choque/desidratação grave</p>`;

  if (plan === 'A') {
    html += `<p><strong>Plano A (desidratação leve):</strong> SRO 50–100 mL após cada evacuação/vômito · orientar em casa</p>`;
  } else if (plan === 'B') {
    html += `<p><strong>Plano B (moderada):</strong> ~${Math.round(planB4h)} mL de SRO em 4 h (75 mL/kg) · reavaliar</p>`;
  } else if (plan === 'C') {
    html += `<p><strong>Plano C (grave):</strong> ${Math.round(planC1h)} mL SF 0,9% IV em 1 h (30 mL/kg) · depois manutenção + déficit</p>`;
  } else {
    html += `<p><strong>Planos OMS (diarreia):</strong> A = leve · B = ${Math.round(planB4h)} mL SRO/4 h · C = ${Math.round(planC1h)} mL SF 0,9%/1 h</p>`;
  }

  html += `<p class="calc-note">Reidratação oral preferencial se tolerada. Corrigir Na/K conforme laboratório — hiponatremia: reidratação lenta.</p></div>`;
  return html;
}

function pedRenderEmergency (peso) {
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

  const doses = typeof broselowDrugDoses === 'function' ? broselowDrugDoses(peso) : [];
  const rows = doses.map(row => `<tr>
    <td><strong>${row.name}</strong></td>
    <td>${row.dosePerKg}</td>
    <td><strong>${row.total}</strong></td>
    <td>${row.note}</td>
  </tr>`).join('');

  const epiMg = 0.01 * peso;
  const choque2 = 2 * peso;
  const choque4 = 4 * peso;

  return `<div class="ped-calc-result-block">
    <h4>Emergência — ${pedFmt(peso, 1)} kg</h4>
    ${zoneBar}
    <p><strong>Adrenalina PCR:</strong> ${pedFmt(epiMg, 2)} mg (${pedFmt(epiMg * 1000, 0)} mcg) = ${pedFmt(0.1 * peso, 1)} mL (1:10.000 IV/IO)</p>
    <p><strong>Choque:</strong> 1º ${Math.round(choque2)} J (2 J/kg) · 2º+ ${Math.round(choque4)} J (4 J/kg)</p>
    ${rows ? `<table class="emerg-table broselow-drug-table">
      <tr><th>Fármaco</th><th>Dose/kg</th><th>Dose total</th><th>Observação</th></tr>
      ${rows}
    </table>` : ''}
    <p class="calc-note">PALS/AHA · confirmar apresentação e diluição. Scores completos (Silverman, PCR, Parkland) em Calculadoras essenciais → Pediatria.</p>
  </div>`;
}

function pedCalcRun () {
  const peso = pedGetWeight();
  const resultEl = document.getElementById('ped-calc-result');
  if (!resultEl) return;

  if (!Number.isFinite(peso)) {
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
      resultEl.innerHTML = '<p class="muted">Informe a dose em mg/kg para calcular.</p>';
      return;
    }
    html = pedRenderCustomDose(peso, doseKg, conc);
  } else if (activeTab === 'meds') {
    html = pedRenderCommonMeds(peso, document.getElementById('ped-calc-med-filter')?.value || '');
  } else if (activeTab === 'fluid') {
    html = pedRenderFluids(peso, document.getElementById('ped-calc-fluid-plan')?.value || '');
  } else if (activeTab === 'emerg') {
    html = pedRenderEmergency(peso);
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

  ['ped-calc-peso', 'ped-calc-dose-kg', 'ped-calc-conc', 'ped-calc-med-filter', 'ped-calc-fluid-plan'].forEach(id => {
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
