/* Calculadoras — Nefrologia */

function nNum (form, name) {
  const v = parseFloat(form[name]?.value);
  return Number.isFinite(v) ? v : NaN;
}

function nChk (form, name) {
  return !!form[name]?.checked;
}

function nSel (form, name) {
  return form[name]?.value ?? '';
}

function ckdStage (egfr) {
  if (egfr >= 90) return 'G1 — normal ou alto';
  if (egfr >= 60) return 'G2 — levemente diminuída';
  if (egfr >= 45) return 'G3a — moderadamente diminuída';
  if (egfr >= 30) return 'G3b — moderadamente a gravemente diminuída';
  if (egfr >= 15) return 'G4 — gravemente diminuída';
  return 'G5 — falência renal';
}

const CALC_NEFRO = {
  cockcroft: {
    title: 'ClCr — Cockcroft-Gault',
    html: `
      <label>Idade (anos)</label>
      <input name="idade" type="number" min="1" required>
      <label>Peso (kg)</label>
      <input name="peso" type="number" step="0.1" min="0.1" required>
      <label>Creatinina sérica (mg/dL)</label>
      <input name="creat" type="number" step="0.01" min="0.01" required>
      <label>Sexo</label>
      <select name="sexo" required>
        <option value="M">Masculino</option>
        <option value="F">Feminino</option>
      </select>
    `,
    calculate (form) {
      const idade = nNum(form, 'idade');
      const peso = nNum(form, 'peso');
      const creat = nNum(form, 'creat');
      if (!Number.isFinite(idade) || !Number.isFinite(peso) || !Number.isFinite(creat)) {
        return alert('Preencha todos os campos.');
      }
      let clcr = ((140 - idade) * peso) / (72 * creat);
      if (nSel(form, 'sexo') === 'F') clcr *= 0.85;

      let ajuste = '';
      if (clcr < 10) ajuste = 'Clearance muito baixo — ajustar drogas nefrotóxicas e considerar diálise';
      else if (clcr < 30) ajuste = 'IRC grave — reduzir doses conforme bula / referência';
      else if (clcr < 60) ajuste = 'IRC moderada — revisar dose de medicamentos eliminados por rim';
      else ajuste = 'Clearance preservado para maioria dos fármacos';

      return `<p><strong>Clearance de creatinina (Cockcroft-Gault):</strong> ${clcr.toFixed(1)} mL/min</p>
              <p><strong>Interpretação:</strong> ${ajuste}</p>
              <p class="calc-note">Cockcroft &amp; Gault, 1976. Preferir CKD-EPI para estadiamento de DRC; Cockcroft-Gault ainda usado para ajuste posológico.</p>`;
    }
  },

  egfr: {
    title: 'eGFR — CKD-EPI 2021 & MDRD',
    html: `
      <label>Idade (anos)</label>
      <input name="idade" type="number" min="18" required>
      <label>Creatinina sérica (mg/dL)</label>
      <input name="creat" type="number" step="0.01" min="0.01" required>
      <label>Sexo</label>
      <select name="sexo" required>
        <option value="M">Masculino</option>
        <option value="F">Feminino</option>
      </select>
      <label class="calc-check"><input type="checkbox" name="afro"> MDRD: fator étnia afro-americana (+21,2%)</label>
    `,
    calculate (form) {
      const idade = nNum(form, 'idade');
      const cr = nNum(form, 'creat');
      const sexo = nSel(form, 'sexo');
      if (!Number.isFinite(idade) || !Number.isFinite(cr)) return alert('Preencha idade e creatinina.');

      const k = sexo === 'F' ? 0.7 : 0.9;
      const a = sexo === 'F' ? -0.241 : -0.302;
      const b = sexo === 'F' ? -1.200 : -1.200;
      const sexFactor = sexo === 'F' ? 1.012 : 1;
      const ratio = cr / k;
      const egfrCkdEpi = 142 * Math.pow(ratio, cr <= k ? a : b) * Math.pow(0.9938, idade) * sexFactor;

      let mdrd = 175 * Math.pow(cr, -1.154) * Math.pow(idade, -0.203);
      if (sexo === 'F') mdrd *= 0.742;
      if (nChk(form, 'afro')) mdrd *= 1.212;

      const stage = ckdStage(egfrCkdEpi);

      return `<p><strong>CKD-EPI 2021:</strong> ${egfrCkdEpi.toFixed(0)} mL/min/1,73 m² — ${stage}</p>
              <p><strong>MDRD (4 variáveis):</strong> ${mdrd.toFixed(0)} mL/min/1,73 m² — ${ckdStage(mdrd)}</p>
              <p class="calc-note">CKD-EPI 2021 sem fator racial (Inker et al.). MDRD subestima TFG em valores altos; preferir CKD-EPI para classificação KDIGO.</p>`;
    }
  },

  fena: {
    title: 'FENa — Excreção fracionada de sódio',
    html: `
      <label>Sódio urinário (mEq/L)</label>
      <input name="una" type="number" step="0.1" min="0" required>
      <label>Creatinina urinária (mg/dL)</label>
      <input name="ucr" type="number" step="0.01" min="0.01" required>
      <label>Sódio plasmático (mEq/L)</label>
      <input name="pna" type="number" step="0.1" min="0" required>
      <label>Creatinina plasmática (mg/dL)</label>
      <input name="pcr" type="number" step="0.01" min="0.01" required>
    `,
    calculate (form) {
      const una = nNum(form, 'una');
      const ucr = nNum(form, 'ucr');
      const pna = nNum(form, 'pna');
      const pcr = nNum(form, 'pcr');
      if (![una, ucr, pna, pcr].every(Number.isFinite)) return alert('Preencha todos os valores.');

      const fena = (una * pcr) / (pna * ucr) * 100;
      let interp = '';
      if (fena < 1) interp = 'FENa &lt;1% — favorece causa pré-renal (hipovolemia), se sem diuréticos recentes';
      else if (fena <= 2) interp = 'FENa 1–2% — zona intermediária; correlacionar com contexto clínico';
      else interp = 'FENa &gt;2% — favorece lesão renal intrínseca (NTA, nefrite)';

      return `<p><strong>FENa:</strong> ${fena.toFixed(2)}%</p>
              <p><strong>Interpretação:</strong> ${interp}</p>
              <p class="calc-note">Menos confiável com diuréticos, alcalose metabólica ou DRC prévia. FEUreia pode auxiliar se em uso de furosemida.</p>`;
    }
  },

  'rifle-kdigo': {
    title: 'RIFLE / KDIGO — Classificação de IRA',
    wide: true,
    html: `
      <label>Creatinina basal (mg/dL)</label>
      <input name="crBase" type="number" step="0.01" min="0.01" required placeholder="Últimos 7–365 dias ou estimada">
      <label>Creatinina atual (mg/dL)</label>
      <input name="crAtual" type="number" step="0.01" min="0.01" required>
      <label>Peso (kg) — para débito urinário</label>
      <input name="peso" type="number" step="0.1" min="0" placeholder="Opcional">
      <label>Volume urinário (mL) no período</label>
      <input name="vUrin" type="number" min="0" placeholder="Opcional">
      <label>Duração do período (horas)</label>
      <input name="horas" type="number" min="1" placeholder="Ex.: 6, 12, 24">
      <label class="calc-check"><input type="checkbox" name="dialise"> Em diálise / indicação de TRS</label>
    `,
    calculate (form) {
      const crBase = nNum(form, 'crBase');
      const crAtual = nNum(form, 'crAtual');
      if (!Number.isFinite(crBase) || !Number.isFinite(crAtual)) return alert('Informe creatininas basal e atual.');

      const ratio = crAtual / crBase;
      const delta = crAtual - crBase;
      const peso = nNum(form, 'peso');
      const vUrin = nNum(form, 'vUrin');
      const horas = nNum(form, 'horas');
      const dialise = nChk(form, 'dialise');

      let duMlKgH = null;
      if (Number.isFinite(peso) && peso > 0 && Number.isFinite(vUrin) && Number.isFinite(horas) && horas > 0) {
        duMlKgH = vUrin / peso / horas;
      }

      let kdigo = 0;
      if (dialise || crAtual >= 4) kdigo = 3;
      else if (ratio >= 3) kdigo = 3;
      else if (ratio >= 2) kdigo = 2;
      else if (ratio >= 1.5 || delta >= 0.3) kdigo = 1;

      if (duMlKgH !== null) {
        if (duMlKgH < 0.3 && horas >= 24) kdigo = Math.max(kdigo, 3);
        else if (duMlKgH < 0.3 && horas >= 12) kdigo = Math.max(kdigo, 3);
        else if (duMlKgH < 0.5 && horas >= 12) kdigo = Math.max(kdigo, 2);
        else if (duMlKgH < 0.5 && horas >= 6) kdigo = Math.max(kdigo, 1);
      }

      let rifle = 'Sem critério RIFLE';
      if (ratio >= 3 || crAtual >= 4 || (duMlKgH !== null && duMlKgH < 0.3 && horas >= 24)) rifle = 'Failure (F)';
      else if (ratio >= 2 || (duMlKgH !== null && duMlKgH < 0.5 && horas >= 12)) rifle = 'Injury (I)';
      else if (ratio >= 1.5 || (duMlKgH !== null && duMlKgH < 0.5 && horas >= 6)) rifle = 'Risk (R)';

      const kdigoTxt = kdigo === 0
        ? 'Sem IRA pelos critérios de creatinina/DU'
        : `KDIGO estágio ${kdigo}`;

      let duTxt = 'Débito urinário não informado';
      if (duMlKgH !== null) duTxt = `${duMlKgH.toFixed(2)} mL/kg/h (${horas} h)`;

      return `<p><strong>Relação Cr atual/basal:</strong> ${ratio.toFixed(2)}× (Δ ${delta.toFixed(2)} mg/dL)</p>
              <p><strong>KDIGO:</strong> ${kdigoTxt}</p>
              <p><strong>RIFLE:</strong> ${rifle}</p>
              <p><strong>Débito urinário:</strong> ${duTxt}</p>
              <p class="calc-note">KDIGO 2012 / Bellomo RIFLE. Estágio final = maior gravidade por creatinina ou débito urinário.</p>`;
    }
  },

  'anion-osm': {
    title: 'Anion Gap & Osmolar Gap',
    html: `
      <label>Sódio (mEq/L)</label>
      <input name="na" type="number" step="0.1" required>
      <label>Cloro (mEq/L)</label>
      <input name="cl" type="number" step="0.1" required>
      <label>Bicarbonato (mEq/L)</label>
      <input name="hco3" type="number" step="0.1" required>
      <label>Ureia (mg/dL)</label>
      <input name="bun" type="number" step="0.1" min="0" required>
      <label>Glicose (mg/dL)</label>
      <input name="glic" type="number" step="0.1" min="0" required>
      <label>Osmolaridade medida (mOsm/kg) — opcional</label>
      <input name="osmMed" type="number" step="0.1" min="0" placeholder="Para gap osmolar">
    `,
    calculate (form) {
      const na = nNum(form, 'na');
      const cl = nNum(form, 'cl');
      const hco3 = nNum(form, 'hco3');
      const bun = nNum(form, 'bun');
      const glic = nNum(form, 'glic');
      if (![na, cl, hco3, bun, glic].every(Number.isFinite)) return alert('Preencha os eletrólitos, ureia e glicose.');

      const ag = na - (cl + hco3);
      const agCorr = ag + 2.5 * (4 - hco3); // albumina não informada — nota abaixo
      const osmCalc = 2 * na + bun / 2.8 + glic / 18;
      const osmMed = nNum(form, 'osmMed');

      let agInterp = ag > 12
        ? 'AG elevado — acidose metabólica com ânions não medidos (cetoacidose, lactato, intoxicações)'
        : 'AG normal (≤12 mEq/L) — acidose hiperclorêmica ou alcalose';

      let osmBlock = '';
      if (Number.isFinite(osmMed)) {
        const og = osmMed - osmCalc;
        const ogInterp = og > 10
          ? 'Gap osmolar elevado (&gt;10) — considerar metanol, etilenoglicol, propilenoglicol, isopropanol'
          : og > 5
            ? 'Gap osmolar discretamente elevado — correlacionar clinicamente'
            : 'Gap osmolar normal';
        osmBlock = `<p><strong>Osmolaridade calculada:</strong> ${osmCalc.toFixed(1)} mOsm/kg</p>
                    <p><strong>Osmolar gap:</strong> ${og.toFixed(1)} mOsm/kg — ${ogInterp}</p>`;
      } else {
        osmBlock = `<p><strong>Osmolaridade calculada:</strong> ${osmCalc.toFixed(1)} mOsm/kg (informe osmolaridade medida para calcular o gap)</p>`;
      }

      return `<p><strong>Anion gap:</strong> ${ag.toFixed(1)} mEq/L — ${agInterp}</p>
              <p><strong>AG corrigido (referência HCO₃ 24):</strong> ${agCorr.toFixed(1)} mEq/L</p>
              ${osmBlock}
              <p class="calc-note">AG corrigido simplificado sem albumina. Corrigir AG por albumina: AG + 2,5 × (4 − Alb g/dL).</p>`;
    }
  },

  fst: {
    title: 'Furosemide Stress Test (FST)',
    html: `
      <label>Dose de furosemida IV (mg)</label>
      <input name="dose" type="number" step="1" min="1" required placeholder="1 mg/kg (máx. 40 mg)">
      <label>Peso (kg)</label>
      <input name="peso" type="number" step="0.1" min="0.1" required>
      <label>Volume urinário em 2 h após a dose (mL)</label>
      <input name="v2h" type="number" min="0" required>
    `,
    calculate (form) {
      const dose = nNum(form, 'dose');
      const peso = nNum(form, 'peso');
      const v2h = nNum(form, 'v2h');
      if (![dose, peso, v2h].every(Number.isFinite)) return alert('Preencha dose, peso e diurese em 2 h.');

      const doseEsperada = Math.min(peso * 1, 40);
      const mlKg2h = v2h / peso;
      const positivo = v2h > 200;

      let risco = positivo
        ? 'FST positivo (&gt;200 mL/2 h) — menor probabilidade de necessidade de TRS nos dias seguintes'
        : 'FST negativo (≤200 mL/2 h) — alto risco de diálise (VPT ~87% em alguns estudos)';

      const doseNota = Math.abs(dose - doseEsperada) > 5
        ? `<p class="calc-note">Protocolo usual: ${doseEsperada.toFixed(0)} mg IV (1 mg/kg, máx. 40 mg). Dose informada: ${dose} mg.</p>`
        : '';

      return `<p><strong>Diurese 2 h:</strong> ${v2h} mL (${mlKg2h.toFixed(1)} mL/kg/2 h)</p>
              <p><strong>Resultado:</strong> ${positivo ? 'Positivo' : 'Negativo'}</p>
              <p><strong>Interpretação:</strong> ${risco}</p>
              ${doseNota}
              <p class="calc-note">Koyner et al., 2013; validado em IRA com creatinina em ascensão. Aplicar após euvolemia/restauração de volume.</p>`;
    }
  }
};
