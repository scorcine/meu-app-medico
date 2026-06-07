/* Calculadoras — Endócrino & Metabólico */

function eNum (form, name) {
  const v = parseFloat(form[name]?.value);
  return Number.isFinite(v) ? v : NaN;
}

function eChk (form, name) {
  return !!form[name]?.checked;
}

function eSel (form, name) {
  return form[name]?.value ?? '';
}

const CALC_ENDOCRINO = {
  homa: {
    title: 'HOMA-IR & HOMA-β',
    html: `
      <label>Glicemia de jejum (mg/dL)</label>
      <input name="glic" type="number" step="0.1" min="1" required>
      <label>Insulina de jejum (µU/mL ou µIU/mL)</label>
      <input name="ins" type="number" step="0.1" min="0.1" required>
    `,
    calculate (form) {
      const glic = eNum(form, 'glic');
      const ins = eNum(form, 'ins');
      if (!Number.isFinite(glic) || !Number.isFinite(ins)) return alert('Preencha glicemia e insulina.');

      const homaIr = (ins * glic) / 405;
      const glicMmol = glic / 18;
      const homaBeta = glic > 63
        ? (360 * ins) / (glic - 63)
        : null;

      let irTxt = homaIr < 1
        ? 'HOMA-IR &lt;1 — sensibilidade à insulina preservada'
        : homaIr <= 2
          ? 'HOMA-IR 1–2 — resistência leve a moderada'
          : homaIr <= 2.9
            ? 'HOMA-IR &gt;2 — resistência à insulina significativa'
            : 'HOMA-IR ≥2,9 — resistência marcada';

      let betaTxt = homaBeta === null
        ? 'HOMA-β não calculado (glicemia ≤63 mg/dL)'
        : homaBeta < 100
          ? `HOMA-β ${homaBeta.toFixed(0)}% — secreção β reduzida`
          : `HOMA-β ${homaBeta.toFixed(0)}% — reserva secretora aparentemente adequada`;

      return `<p><strong>HOMA-IR:</strong> ${homaIr.toFixed(2)} — ${irTxt}</p>
              <p><strong>HOMA-β:</strong> ${betaTxt}</p>
              <p class="calc-note">Matthews et al., 1985. Valores de referência variam por população; interpretar com contexto clínico e curva glicêmica.</p>`;
    }
  },

  frax: {
    title: 'FRAX — Risco de fratura osteoporótica',
    wide: true,
    html: `
      <label>Idade (anos)</label>
      <input name="idade" type="number" min="40" max="90" required>
      <label>Sexo</label>
      <select name="sexo" required>
        <option value="F">Feminino</option>
        <option value="M">Masculino</option>
      </select>
      <label>Peso (kg)</label>
      <input name="peso" type="number" step="0.1" min="20" required>
      <label>Altura (cm)</label>
      <input name="altura" type="number" step="0.1" min="100" required>
      <label>T-score colo femoral (DEXA) — opcional</label>
      <input name="tscore" type="number" step="0.1" placeholder="Ex.: -2,3; deixe vazio se sem DEXA">
      <fieldset class="calc-fieldset">
        <legend>Fatores de risco FRAX</legend>
        <label class="calc-check"><input type="checkbox" name="fxPrev"> Fratura osteoporótica prévia</label>
        <label class="calc-check"><input type="checkbox" name="fxQuadril"> Fratura de quadril em genitor</label>
        <label class="calc-check"><input type="checkbox" name="fumo"> Tabagismo atual</label>
        <label class="calc-check"><input type="checkbox" name="cortico"> Corticoide oral ≥5 mg prednisona/dia ≥3 meses</label>
        <label class="calc-check"><input type="checkbox" name="ar"> Artrite reumatoide</label>
        <label class="calc-check"><input type="checkbox" name="sec"> Osteoporose secundária (DM1, hipogonadismo, etc.)</label>
        <label class="calc-check"><input type="checkbox" name="alcool"> Álcool ≥3 doses/dia</label>
      </fieldset>
    `,
    calculate (form) {
      const idade = eNum(form, 'idade');
      const peso = eNum(form, 'peso');
      const altura = eNum(form, 'altura');
      if (!Number.isFinite(idade) || !Number.isFinite(peso) || !Number.isFinite(altura)) {
        return alert('Preencha idade, peso e altura.');
      }

      const imc = peso / Math.pow(altura / 100, 2);
      const sexo = eSel(form, 'sexo');
      const tscore = eNum(form, 'tscore');
      let pts = 0;

      if (idade >= 80) pts += 4;
      else if (idade >= 70) pts += 3;
      else if (idade >= 60) pts += 2;
      else if (idade >= 50) pts += 1;

      if (sexo === 'F') pts += 1;
      if (imc < 19) pts += 2;
      else if (imc < 21) pts += 1;
      if (eChk(form, 'fxPrev')) pts += 3;
      if (eChk(form, 'fxQuadril')) pts += 1;
      if (eChk(form, 'fumo')) pts += 1;
      if (eChk(form, 'cortico')) pts += 2;
      if (eChk(form, 'ar')) pts += 1;
      if (eChk(form, 'sec')) pts += 1;
      if (eChk(form, 'alcool')) pts += 1;
      if (Number.isFinite(tscore)) {
        if (tscore <= -2.5) pts += 4;
        else if (tscore <= -1) pts += 2;
      }

      let mofPct = 5 + pts * 2.5;
      if (sexo === 'F') mofPct += 3;
      mofPct = Math.min(Math.max(mofPct, 2), 45);
      const quadrilPct = Math.round(mofPct * 0.28);

      let conduta = '';
      if (Number.isFinite(tscore) && tscore <= -2.5) {
        conduta = 'Osteoporose (T ≤ -2,5) — indicar tratamento antiosteoporótico na maioria dos casos';
      } else if (Number.isFinite(tscore) && tscore > -2.5 && tscore <= -1) {
        conduta = mofPct >= 20 || quadrilPct >= 3
          ? 'Osteopenia + FRAX elevado — considerar tratamento farmacológico'
          : 'Osteopenia + FRAX baixo/intermediário — medidas gerais e reavaliação';
      } else if (mofPct >= 20 || quadrilPct >= 3) {
        conduta = 'Limiar de tratamento atingido (MOF ≥20% ou quadril ≥3%) mesmo sem DEXA';
      } else {
        conduta = 'Risco baixo a moderado — medidas gerais; considerar DEXA se fatores adicionais';
      }

      return `<p><strong>IMC:</strong> ${imc.toFixed(1)} kg/m²</p>
              <p><strong>FRAX estimado (10 anos):</strong> fratura osteoporótica major ~${mofPct.toFixed(0)}% | quadril ~${quadrilPct}%</p>
              <p><strong>Conduta sugerida:</strong> ${conduta}</p>
              <p class="calc-note">Estimativa clínica simplificada. Probabilidade exata: calculadora oficial FRAX (WHO) com país de referência.</p>`;
    }
  },

  dka: {
    title: 'Escore de CAC / DKA',
    html: `
      <label>Glicemia (mg/dL)</label>
      <input name="glic" type="number" step="1" min="0" required>
      <label>Bicarbonato (mEq/L)</label>
      <input name="hco3" type="number" step="0.1" required>
      <label>Sódio (mEq/L)</label>
      <input name="na" type="number" step="0.1" required>
      <label>Cloro (mEq/L)</label>
      <input name="cl" type="number" step="0.1" required>
      <label>pH arterial — opcional</label>
      <input name="ph" type="number" step="0.01" min="6.5" max="7.6" placeholder="Refina gravidade">
      <label class="calc-check"><input type="checkbox" name="cetonas"> Cetonas positivas / β-hidroxibutirato ≥3 mmol/L</label>
    `,
    calculate (form) {
      const glic = eNum(form, 'glic');
      const hco3 = eNum(form, 'hco3');
      const na = eNum(form, 'na');
      const cl = eNum(form, 'cl');
      if (![glic, hco3, na, cl].every(Number.isFinite)) return alert('Preencha glicemia, bicarbonato, sódio e cloro.');

      const ag = na - (cl + hco3);
      const ph = eNum(form, 'ph');
      const cetonas = eChk(form, 'cetonas');

      const critGlic = glic >= 200;
      const critHco3 = hco3 <= 18;
      const critAg = ag > 12;
      const critPh = Number.isFinite(ph) ? ph < 7.3 : null;
      const criterios = [critGlic, critHco3, critAg || cetonas].filter(Boolean).length;
      const diagnostico = criterios >= 2 && (critAg || cetonas);

      let gravidade = 'Sem critérios de CAC/DKA';
      if (diagnostico) {
        const phVal = Number.isFinite(ph) ? ph : (hco3 <= 10 ? 6.95 : hco3 <= 14 ? 7.1 : 7.27);
        if (phVal < 7.0 || hco3 < 10) gravidade = 'Grave — pH &lt;7,0 ou HCO₃⁻ &lt;10';
        else if (phVal < 7.24 || hco3 < 15) gravidade = 'Moderada — pH 7,0–7,24 ou HCO₃⁻ 10–14';
        else gravidade = 'Leve — pH 7,25–7,30 ou HCO₃⁻ 15–18';
      }

      const naCorr = na + 1.6 * ((glic - 100) / 100);

      return `<p><strong>Anion gap:</strong> ${ag.toFixed(1)} mEq/L ${ag > 12 ? '(elevado)' : ''}</p>
              <p><strong>Na⁺ corrigido (hiperglicemia):</strong> ${naCorr.toFixed(1)} mEq/L</p>
              <p><strong>Critérios ADA:</strong> glicemia ${critGlic ? '✓' : '✗'} | HCO₃⁻ ${critHco3 ? '✓' : '✗'} | AG/cetonas ${critAg || cetonas ? '✓' : '✗'}${critPh !== null ? ` | pH ${critPh ? '✓' : '✗'}` : ''}</p>
              <p><strong>Diagnóstico:</strong> ${diagnostico ? 'Compatível com cetoacidose diabética' : 'Não preenche critérios de CAC/DKA'}</p>
              <p><strong>Gravidade:</strong> ${gravidade}</p>
              <p class="calc-note">ADA Standards of Care. CAC: glicemia &gt;250, pH &lt;7,3, HCO₃⁻ &lt;18, AG elevado ou cetonas.</p>`;
    }
  },

  'ukpds-ascvd': {
    title: 'UKPDS & ASCVD — Risco CV em DM2',
    wide: true,
    html: `
      <label>Idade (anos)</label>
      <input name="idade" type="number" min="18" max="79" required>
      <label>Sexo</label>
      <select name="sexo" required>
        <option value="M">Masculino</option>
        <option value="F">Feminino</option>
      </select>
      <label>Duração do DM2 (anos)</label>
      <input name="duracao" type="number" min="0" step="0.5" required>
      <label>HbA1c (%)</label>
      <input name="hba1c" type="number" step="0.1" min="4" max="15" required>
      <label>PAS (mmHg)</label>
      <input name="pas" type="number" required>
      <label class="calc-check"><input type="checkbox" name="trataHas"> Tratamento para hipertensão</label>
      <label>Colesterol total (mg/dL)</label>
      <input name="ct" type="number" required>
      <label>HDL (mg/dL)</label>
      <input name="hdl" type="number" required>
      <label class="calc-check"><input type="checkbox" name="fumo"> Tabagismo</label>
      <label class="calc-check"><input type="checkbox" name="albuminuria"> Albuminúria / DRC</label>
    `,
    calculate (form) {
      const idade = eNum(form, 'idade');
      const duracao = eNum(form, 'duracao');
      const hba1c = eNum(form, 'hba1c');
      const pas = eNum(form, 'pas');
      const ct = eNum(form, 'ct');
      const hdl = eNum(form, 'hdl');
      if (![idade, duracao, hba1c, pas, ct, hdl].every(Number.isFinite)) {
        return alert('Preencha todos os campos numéricos.');
      }

      const sexo = eSel(form, 'sexo');
      const ratio = ct / hdl;
      let ukpds = 0;

      if (idade >= 65) ukpds += 3;
      else if (idade >= 55) ukpds += 2;
      else if (idade >= 45) ukpds += 1;
      if (sexo === 'M') ukpds += 1;
      if (duracao >= 10) ukpds += 2;
      else if (duracao >= 5) ukpds += 1;
      if (hba1c >= 9) ukpds += 3;
      else if (hba1c >= 8) ukpds += 2;
      else if (hba1c >= 7) ukpds += 1;
      if (pas >= 160) ukpds += 2;
      else if (pas >= 140) ukpds += 1;
      if (ratio >= 6) ukpds += 2;
      else if (ratio >= 4) ukpds += 1;
      if (eChk(form, 'fumo')) ukpds += 2;
      if (eChk(form, 'albuminuria')) ukpds += 2;

      let ukpdsRisco = ukpds >= 10 ? 'Alto (~CHD/stroke elevado)'
        : ukpds >= 6 ? 'Moderado'
        : 'Baixo a moderado';

      let ascvdPts = ukpds;
      if (eChk(form, 'trataHas') && pas >= 140) ascvdPts += 1;
      if (hdl < 40) ascvdPts += 1;
      else if (hdl >= 60) ascvdPts -= 1;

      let ascvdPct = '<5%';
      if (ascvdPts >= 14) ascvdPct = '≥20%';
      else if (ascvdPts >= 11) ascvdPct = '15–20%';
      else if (ascvdPts >= 8) ascvdPts = '10–15%';
      else if (ascvdPts >= 5) ascvdPct = '5–10%';

      let statina = ascvdPts >= 8 || idade >= 40
        ? 'Estatinas recomendadas na maioria dos DM2 ≥40 anos (ADA/SBC); intensidade conforme risco'
        : 'Avaliar fatores de risco adicionais; metas LDL conforme diretriz';

      if (ascvdPts >= 11) statina = 'Estatinas de alta intensidade fortemente consideradas (risco ASCVD elevado)';

      return `<p><strong>UKPDS (estratificação simplificada):</strong> ${ukpds} pts — risco ${ukpdsRisco}</p>
              <p><strong>ASCVD 10 anos (adaptado DM2):</strong> ${ascvdPct}</p>
              <p><strong>Conduta lipídica:</strong> ${statina}</p>
              <p class="calc-note">UKPDS Risk Engine (Stevens et al.) e equações ASCVD ACC/AHA são mais precisas. DM2 ≥40a = risco CV aumentado por definição.</p>`;
    }
  },

  hba1c: {
    title: 'Conversor HbA1c (% ↔ mmol/mol)',
    html: `
      <label>Conversão</label>
      <select name="modo" required>
        <option value="pct-mol">De % (NGSP) para mmol/mol (IFCC)</option>
        <option value="mol-pct">De mmol/mol (IFCC) para % (NGSP)</option>
      </select>
      <label>Valor de entrada</label>
      <input name="valor" type="number" step="0.01" min="0" required>
    `,
    calculate (form) {
      const valor = eNum(form, 'valor');
      if (!Number.isFinite(valor)) return alert('Informe o valor.');

      const modo = eSel(form, 'modo');
      let pct; let mol;

      if (modo === 'pct-mol') {
        pct = valor;
        mol = (pct - 2.15) * 10.929;
      } else {
        mol = valor;
        pct = mol / 10.929 + 2.15;
      }

      const eagMg = 28.7 * pct - 46.7;
      const eagMmol = 1.59 * pct - 2.59;

      let meta = '';
      if (pct < 5.7) meta = 'Normal (&lt;5,7%)';
      else if (pct < 6.5) meta = 'Pré-diabetes (5,7–6,4%)';
      else if (pct <= 7) meta = 'Diabetes — meta individualizada; muitos adultos ~&lt;7%';
      else if (pct <= 8) meta = 'Acima da meta usual — intensificar tratamento';
      else meta = 'Controle glicêmico inadequado — risco de complicações aumentado';

      return `<p><strong>HbA1c:</strong> ${pct.toFixed(2)}% = ${mol.toFixed(0)} mmol/mol</p>
              <p><strong>Glicemia média estimada (eAG):</strong> ${eagMg.toFixed(0)} mg/dL (${eagMmol.toFixed(1)} mmol/L)</p>
              <p><strong>Interpretação:</strong> ${meta}</p>
              <p class="calc-note">Fórmula IFCC: mmol/mol = (% − 2,15) × 10,929. eAG: ADAG (Nathan et al.).</p>`;
    }
  },

  'osm-efetiva': {
    title: 'Osmolaridade efetiva (tonicidade)',
    html: `
      <label>Sódio (mEq/L)</label>
      <input name="na" type="number" step="0.1" required>
      <label>Glicose (mg/dL)</label>
      <input name="glic" type="number" step="0.1" min="0" required>
      <label>Ureia/BUN (mg/dL) — opcional</label>
      <input name="bun" type="number" step="0.1" min="0" placeholder="Para osmolaridade total">
    `,
    calculate (form) {
      const na = eNum(form, 'na');
      const glic = eNum(form, 'glic');
      if (!Number.isFinite(na) || !Number.isFinite(glic)) return alert('Informe sódio e glicose.');

      const osmEfetiva = 2 * na + glic / 18;
      const naCorr = na + 1.6 * ((glic - 100) / 100);

      const bun = eNum(form, 'bun');
      let osmTotalBlock = '';
      if (Number.isFinite(bun)) {
        const osmTotal = 2 * na + bun / 2.8 + glic / 18;
        const gap = osmTotal - osmEfetiva;
        osmTotalBlock = `<p><strong>Osmolaridade total:</strong> ${osmTotal.toFixed(1)} mOsm/kg</p>
                           <p><strong>Contribuição da ureia (não efetiva):</strong> ~${gap.toFixed(1)} mOsm/kg</p>`;
      }

      let interp = osmEfetiva < 275
        ? 'Hipotonicidade efetiva — considerar SIADH dilucional, polidipsia, hiponatremia'
        : osmEfetiva <= 295
          ? 'Tonicidade efetiva normal'
          : 'Hipertonicidade efetiva — hiperglicemia, hipernatremia ou déficit hídrico';

      return `<p><strong>Osmolaridade efetiva:</strong> ${osmEfetiva.toFixed(1)} mOsm/kg</p>
              ${osmTotalBlock}
              <p><strong>Na⁺ corrigido (glicemia):</strong> ${naCorr.toFixed(1)} mEq/L</p>
              <p><strong>Interpretação:</strong> ${interp}</p>
              <p class="calc-note">Osm. efetiva = 2×Na + glicose/18. Ureia atravessa membranas — entra na osmolaridade total, não na tonicidade celular.</p>`;
    }
  }
};
