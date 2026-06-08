/* Calculadoras — Hematologia & Trombose */

function hNum (form, name) {
  const v = parseFloat(form[name]?.value);
  return Number.isFinite(v) ? v : NaN;
}

function hChk (form, name) {
  return !!form[name]?.checked;
}

function hSel (form, name) {
  return form[name]?.value ?? '';
}

const CALC_HEMATO = {
  'padua-improve': {
    title: 'Padua & IMPROVE — profilaxia TEV (internado)',
    wide: true,
    html: `
      <fieldset class="calc-fieldset">
        <legend>Padua Prediction Score</legend>
        <label class="calc-check"><input type="checkbox" name="pCan"> Neoplasia ativa (+3)</label>
        <label class="calc-check"><input type="checkbox" name="pVte"> TVP/TEP prévia (+3)</label>
        <label class="calc-check"><input type="checkbox" name="pMob"> Mobilidade reduzida (+3)</label>
        <label class="calc-check"><input type="checkbox" name="pTrombo"> Trombofilia conhecida (+3)</label>
        <label class="calc-check"><input type="checkbox" name="pTrauma"> Trauma/cirurgia recente (+2)</label>
        <label class="calc-check"><input type="checkbox" name="pIdade"> Idade ≥70 anos (+1)</label>
        <label class="calc-check"><input type="checkbox" name="pIc"> IC ou insuficiência respiratória (+1)</label>
        <label class="calc-check"><input type="checkbox" name="pIam"> IAM ou AVC isquêmico agudo (+1)</label>
        <label class="calc-check"><input type="checkbox" name="pInf"> Infecção aguda ou doença reumatológica (+1)</label>
        <label class="calc-check"><input type="checkbox" name="pHorm"> Terapia hormonal (+1)</label>
      </fieldset>
      <fieldset class="calc-fieldset">
        <legend>IMPROVE — risco VTE</legend>
        <label>Idade (anos)</label>
        <input name="iIdade" type="number" min="18" value="65">
        <label class="calc-check"><input type="checkbox" name="iVte"> TVP/TEP prévia (+3)</label>
        <label class="calc-check"><input type="checkbox" name="iTrombo"> Trombofilia conhecida (+2)</label>
        <label class="calc-check"><input type="checkbox" name="iCan"> Câncer ativo (+2)</label>
        <label class="calc-check"><input type="checkbox" name="iImob"> Imobilização ≥4 dias (+1)</label>
        <label class="calc-check"><input type="checkbox" name="iUti"> UTI/CCU (+1)</label>
      </fieldset>
      <fieldset class="calc-fieldset">
        <legend>IMPROVE — risco de sangramento (profilaxia)</legend>
        <label class="calc-check"><input type="checkbox" name="bIdade"> Idade ≥75 anos (+1,5)</label>
        <label class="calc-check"><input type="checkbox" name="bRenal"> Insuficiência renal (+1,2)</label>
        <label class="calc-check"><input type="checkbox" name="bMasc"> Sexo masculino (+1,2)</label>
        <label class="calc-check"><input type="checkbox" name="bGi"> Sangramento GI prévio (+1,3)</label>
        <label class="calc-check"><input type="checkbox" name="bCan"> Câncer ativo (+2,2)</label>
        <label class="calc-check"><input type="checkbox" name="bReum"> Doença reumatológica (+1,6)</label>
      </fieldset>
    `,
    calculate (form) {
      const paduaPts = {
        pCan: 3, pVte: 3, pMob: 3, pTrombo: 3, pTrauma: 2,
        pIdade: 1, pIc: 1, pIam: 1, pInf: 1, pHorm: 1
      };
      let padua = 0;
      Object.keys(paduaPts).forEach(k => { if (hChk(form, k)) padua += paduaPts[k]; });

      const idade = hNum(form, 'iIdade');
      let improveVte = 0;
      if (Number.isFinite(idade)) {
        if (idade >= 80) improveVte += 5;
        else if (idade >= 70) improveVte += 3;
        else if (idade >= 60) improveVte += 2;
        else if (idade >= 40) improveVte += 1;
      }
      if (hChk(form, 'iVte')) improveVte += 3;
      if (hChk(form, 'iTrombo')) improveVte += 2;
      if (hChk(form, 'iCan')) improveVte += 2;
      if (hChk(form, 'iImob')) improveVte += 1;
      if (hChk(form, 'iUti')) improveVte += 1;

      let improveBleed = 0;
      if (hChk(form, 'bIdade')) improveBleed += 1.5;
      if (hChk(form, 'bRenal')) improveBleed += 1.2;
      if (hChk(form, 'bMasc')) improveBleed += 1.2;
      if (hChk(form, 'bGi')) improveBleed += 1.3;
      if (hChk(form, 'bCan')) improveBleed += 2.2;
      if (hChk(form, 'bReum')) improveBleed += 1.6;

      const paduaTxt = padua >= 4
        ? 'Padua ≥4 — alto risco TEV; profilaxia farmacológica recomendada (se não contraindicada)'
        : 'Padua &lt;4 — baixo risco; profilaxia mecânica ou nenhuma conforme mobilidade';

      const improveVteTxt = improveVte >= 4
        ? 'IMPROVE VTE ≥4 — alto risco; considerar HBPM profilática'
        : improveVte >= 3
          ? 'IMPROVE VTE 3 — risco intermediário'
          : 'IMPROVE VTE baixo';

      const improveBleedTxt = improveBleed >= 7
        ? 'IMPROVE sangramento ≥7 — alto risco hemorrágico; balancear risco-benefício'
        : improveBleed >= 4
          ? 'Risco hemorrágico moderado'
          : 'Risco hemorrágico baixo a moderado';

      return `<p><strong>Padua:</strong> ${padua} — ${paduaTxt}</p>
              <p><strong>IMPROVE VTE:</strong> ${improveVte} — ${improveVteTxt}</p>
              <p><strong>IMPROVE sangramento:</strong> ${improveBleed.toFixed(1)} — ${improveBleedTxt}</p>
              <p class="calc-note">Barbar Padua 2010; Spyropoulos IMPROVE 2011. Paciente clínico internado sem anticoagulação plena.</p>`;
    }
  },

  '4ts': {
    title: '4 Ts — trombocitopenia induzida por heparina (HIT)',
    wide: true,
    html: `
      <label>Trombocitopenia (queda e nadir)</label>
      <select name="t" required>
        <option value="2">Queda ≥50% e nadir ≥20×10³/µL (+2)</option>
        <option value="1">Queda 30–50% ou nadir 10–19 (+1)</option>
        <option value="0">Queda &lt;30% ou nadir &lt;10 (+0)</option>
      </select>
      <label>Timing (após início heparina)</label>
      <select name="timing" required>
        <option value="2">Dia 5–10 ou ≤1 dia se HIT prévia 30 dias (+2)</option>
        <option value="1">Após dia 10 ou início incerto (+1)</option>
        <option value="0">Queda ≤4 dias sem exposição recente (+0)</option>
      </select>
      <label>Trombose ou complicação</label>
      <select name="trombo" required>
        <option value="2">Trombose nova confirmada (+2)</option>
        <option value="1">Trombose progressiva/recorrente ou necrose cutânea (+1)</option>
        <option value="0">Nenhuma (+0)</option>
      </select>
      <label>Outras causas de trombocitopenia</label>
      <select name="outras" required>
        <option value="2">Nenhuma aparente (+2)</option>
        <option value="1">Possível (+1)</option>
        <option value="0">Causa definida (+0)</option>
      </select>
    `,
    calculate (form) {
      const total = ['t', 'timing', 'trombo', 'outras']
        .reduce((s, k) => s + parseInt(hSel(form, k), 10), 0);

      let prob = total <= 3
        ? 'Baixa probabilidade (≤3) — HIT improvável; continuar heparina se indicada'
        : total <= 5
          ? 'Probabilidade intermediária (4–5) — solicitar anti-PF4/HIT; evitar heparina até resultado'
          : 'Alta probabilidade (6–8) — parar heparina; anticoagular com alternativa (argatroban, bivalirudina, fondaparinux)';

      return `<p><strong>4 Ts:</strong> ${total}/8</p>
              <p><strong>Interpretação:</strong> ${prob}</p>
              <p class="calc-note">Lo et al., 2006. Teste funcional (SRA) ou anti-PF4 confirmatório se score intermediário/alto.</p>`;
    }
  },

  khorana: {
    title: 'Khorana — TEV em câncer',
    html: `
      <label>Sítio primário do câncer</label>
      <select name="sitio" required>
        <option value="2">Muito alto risco — estômago, pâncreas (+2)</option>
        <option value="1">Alto risco — pulmão, linfoma, ginecológico, bexiga, testículo (+1)</option>
        <option value="0">Outros sítios (+0)</option>
      </select>
      <label>Plaquetas pré-quimioterapia (×10³/µL)</label>
      <input name="plt" type="number" step="1" min="0" required>
      <label>Hemoglobina (g/dL)</label>
      <input name="hb" type="number" step="0.1" min="0" required>
      <label class="calc-check"><input type="checkbox" name="epo"> Uso de EPO ou similar</label>
      <label>Leucócitos (×10³/µL)</label>
      <input name="wbc" type="number" step="0.1" min="0" required>
      <label>IMC (kg/m²)</label>
      <input name="imc" type="number" step="0.1" min="0" required>
    `,
    calculate (form) {
      const plt = hNum(form, 'plt');
      const hb = hNum(form, 'hb');
      const wbc = hNum(form, 'wbc');
      const imc = hNum(form, 'imc');
      if (![plt, hb, wbc, imc].every(Number.isFinite)) return alert('Preencha todos os valores.');

      let score = parseInt(hSel(form, 'sitio'), 10);
      if (plt >= 350) score += 1;
      if (hb < 10 || hChk(form, 'epo')) score += 1;
      if (wbc > 11) score += 1;
      if (imc >= 35) score += 1;

      let risco = score === 0
        ? 'Baixo (~0,5% TEV em 2,5 meses) — profilaxia não rotineira'
        : score <= 2
          ? 'Intermediário (~2%) — considerar profilaxia se alto risco adicional'
          : 'Alto (≥3, ~7%) — considerar profilaxia com HBPM/apixabana (CAP, Khorana 2019)';

      return `<p><strong>Khorana:</strong> ${score}/6</p>
              <p><strong>Risco de TEV:</strong> ${risco}</p>
              <p class="calc-note">Khorana et al., 2008. Validado em ambulatorial recebendo quimioterapia. Score modificado inclui D-dímero em alguns protocolos.</p>`;
    }
  }
};
