/* Calculadoras — Hepatologia & Gastro */

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

function meldBase (bili, inr, creat) {
  const b = Math.max(bili, 1);
  const i = Math.max(inr, 1);
  const c = Math.max(creat, 1);
  return 3.78 * Math.log(b) + 11.2 * Math.log(i) + 9.57 * Math.log(c) + 6.43;
}

function meldNaScore (meld, naRaw) {
  const na = Math.min(Math.max(naRaw, 125), 137);
  if (meld <= 11) return Math.round(meld);
  const meldNa = meld + 1.32 * (137 - na) - 0.033 * meld * (137 - na);
  return Math.min(Math.round(meldNa), 40);
}

const CALC_HEPATO = {
  'child-pugh': {
    title: 'Child-Pugh',
    wide: true,
    html: `
      <label>Bilirrubina total (mg/dL)</label>
      <input name="bili" type="number" step="0.01" min="0" required>
      <label>Albumina (g/dL)</label>
      <input name="alb" type="number" step="0.01" min="0" required>
      <label>INR</label>
      <input name="inr" type="number" step="0.01" min="0.1" required>
      <label>Ascite</label>
      <select name="ascite" required>
        <option value="1">Ausente</option>
        <option value="2">Leve / controlada medicamente</option>
        <option value="3">Moderada a tensa / refratária</option>
      </select>
      <label>Encefalopatia hepática</label>
      <select name="encef" required>
        <option value="1">Ausente</option>
        <option value="2">Grau I–II (leve)</option>
        <option value="3">Grau III–IV (moderada a grave)</option>
      </select>
    `,
    calculate (form) {
      const bili = hNum(form, 'bili');
      const alb = hNum(form, 'alb');
      const inr = hNum(form, 'inr');
      if (![bili, alb, inr].every(Number.isFinite)) return alert('Preencha bilirrubina, albumina e INR.');

      let ptsBili = bili < 2 ? 1 : bili <= 3 ? 2 : 3;
      let ptsAlb = alb > 3.5 ? 1 : alb >= 2.8 ? 2 : 3;
      let ptsInr = inr < 1.7 ? 1 : inr <= 2.3 ? 2 : 3;
      const ptsAsc = parseInt(hSel(form, 'ascite'), 10);
      const ptsEnc = parseInt(hSel(form, 'encef'), 10);
      const total = ptsBili + ptsAlb + ptsInr + ptsAsc + ptsEnc;

      let classe = 'A';
      let mortal = '~10% (1 ano) / ~25% (2 anos)';
      if (total >= 10) { classe = 'C'; mortal = '~45% (1 ano) / ~80% (2 anos)'; }
      else if (total >= 7) { classe = 'B'; mortal = '~30% (1 ano) / ~55% (2 anos)'; }

      return `<p><strong>Child-Pugh:</strong> ${total} pontos — Classe ${classe}</p>
              <p>Bilirrubina: ${ptsBili} | Albumina: ${ptsAlb} | INR: ${ptsInr} | Ascite: ${ptsAsc} | Encefalopatia: ${ptsEnc}</p>
              <p><strong>Sobrevida estimada:</strong> ${mortal}</p>
              <p class="calc-note">Child &amp; Turcotte / Pugh. Classe C: alto risco em cirurgias eletivas.</p>`;
    }
  },

  meld: {
    title: 'MELD-Na & MELD 3.0',
    html: `
      <label>Bilirrubina total (mg/dL)</label>
      <input name="bili" type="number" step="0.01" min="0" required>
      <label>INR</label>
      <input name="inr" type="number" step="0.01" min="0.1" required>
      <label>Creatinina (mg/dL)</label>
      <input name="creat" type="number" step="0.01" min="0" required>
      <label>Sódio (mEq/L)</label>
      <input name="na" type="number" step="0.1" required>
      <label>Albumina (g/dL) — MELD 3.0</label>
      <input name="alb" type="number" step="0.01" min="0" required>
      <label>Sexo — MELD 3.0</label>
      <select name="sexo" required>
        <option value="M">Masculino</option>
        <option value="F">Feminino</option>
      </select>
      <label class="calc-check"><input type="checkbox" name="dialise"> Diálise ≥2×/semana (creatinina = 4,0 mg/dL no MELD clássico)</label>
    `,
    calculate (form) {
      let bili = hNum(form, 'bili');
      let inr = hNum(form, 'inr');
      let creat = hNum(form, 'creat');
      const na = hNum(form, 'na');
      const alb = hNum(form, 'alb');
      if (![bili, inr, creat, na, alb].every(Number.isFinite)) return alert('Preencha todos os campos.');

      if (hChk(form, 'dialise')) creat = 4;
      bili = Math.max(bili, 1);
      inr = Math.max(inr, 1);
      creat = Math.max(Math.min(creat, 4), 1);

      const meldRaw = meldBase(bili, inr, creat);
      const meld = Math.min(Math.round(meldRaw), 40);
      const meldNa = meldNaScore(meldRaw, na);

      const naBound = Math.min(Math.max(na, 125), 137);
      const albBound = Math.min(alb, 3.5);
      const female = hSel(form, 'sexo') === 'F' ? 1 : 0;
      const meld30Raw =
        1.33 * female +
        4.56 * Math.log(bili) +
        0.82 * (137 - naBound) - 0.24 * (137 - naBound) * Math.log(bili) +
        9.09 * Math.log(inr) +
        11.14 * Math.log(creat) +
        1.85 * (3.5 - albBound) - 1.83 * (3.5 - albBound) * Math.log(creat) +
        6;
      const meld30 = Math.min(Math.round(meld30Raw), 40);

      const mort = meldNa >= 40 ? '≥70% em 3 meses (lista)'
        : meldNa >= 30 ? 'Alta mortalidade — prioridade transplant'
        : meldNa >= 20 ? 'Mortalidade moderada a alta'
        : meldNa >= 15 ? 'Considerar encaminhamento transplant'
        : 'Mortalidade relativamente baixa em 90 dias';

      return `<p><strong>MELD clássico:</strong> ${meld}</p>
              <p><strong>MELD-Na:</strong> ${meldNa}</p>
              <p><strong>MELD 3.0:</strong> ${meld30}</p>
              <p><strong>Interpretação (MELD-Na):</strong> ${mort}</p>
              <p class="calc-note">MELD-Na (2016) substitui MELD na fila nos EUA. MELD 3.0 (Kim et al., 2021) inclui sexo feminino, albumina e sódio — melhor predição em scores baixos/intermediários.</p>`;
    }
  },

  maddrey: {
    title: 'Maddrey — Hepatite alcoólica',
    html: `
      <label>TTPa ou TP do paciente (segundos)</label>
      <input name="ptPac" type="number" step="0.1" min="0" required>
      <label>TTPa ou TP controle (segundos)</label>
      <input name="ptCtrl" type="number" step="0.1" min="0" required>
      <label>Bilirrubina total (mg/dL)</label>
      <input name="bili" type="number" step="0.01" min="0" required>
    `,
    calculate (form) {
      const ptPac = hNum(form, 'ptPac');
      const ptCtrl = hNum(form, 'ptCtrl');
      const bili = hNum(form, 'bili');
      if (![ptPac, ptCtrl, bili].every(Number.isFinite)) return alert('Preencha TP/TTPa e bilirrubina.');

      const df = 4.6 * (ptPac - ptCtrl) + bili;
      const grave = df >= 32;
      const interp = grave
        ? 'DF ≥32 — hepatite alcoólica grave; considerar prednisolona 40 mg/dia (Lille day 7 para resposta)'
        : 'DF &lt;32 — doença menos grave; benefício de corticoide incerto';

      return `<p><strong>Função discriminatória de Maddrey:</strong> ${df.toFixed(1)}</p>
              <p><strong>Interpretação:</strong> ${interp}</p>
              <p class="calc-note">Maddrey et al., 1978. Usar TP ou TTPa de forma consistente (diferença em segundos).</p>`;
    }
  },

  'gb-rockall': {
    title: 'Glasgow-Blatchford & Rockall (HDA)',
    wide: true,
    html: `
      <fieldset class="calc-fieldset">
        <legend>Glasgow-Blatchford (pré-endoscopia)</legend>
        <label>Ureia/BUN (mg/dL)</label>
        <input name="bun" type="number" step="0.1" min="0" required>
        <label>Hemoglobina (g/dL)</label>
        <input name="hb" type="number" step="0.1" min="0" required>
        <label>Sexo</label>
        <select name="sexo" required>
          <option value="M">Masculino</option>
          <option value="F">Feminino</option>
        </select>
        <label>PAS (mmHg)</label>
        <input name="pas" type="number" min="0" required>
        <label class="calc-check"><input type="checkbox" name="fc100"> FC ≥100 bpm (+1)</label>
        <label class="calc-check"><input type="checkbox" name="melena"> Melena (+1)</label>
        <label class="calc-check"><input type="checkbox" name="syncope"> Síncope (+2)</label>
        <label class="calc-check"><input type="checkbox" name="hepatico"> Doença hepática (+2)</label>
        <label class="calc-check"><input type="checkbox" name="cardiaco"> Insuficiência cardíaca (+2)</label>
      </fieldset>
      <fieldset class="calc-fieldset">
        <legend>Rockall (complementar)</legend>
        <label>Idade (anos)</label>
        <input name="idade" type="number" min="0" required>
        <label>PAS (mmHg) — choque Rockall</label>
        <input name="pasRock" type="number" min="0" required>
        <label>FC (bpm)</label>
        <input name="fc" type="number" min="0" required>
        <label class="calc-check"><input type="checkbox" name="comorb"> Comorbidade maior: ICC, DAC, neoplasia, DRC, cirrose (+2)</label>
        <label>Diagnóstico endoscópico (Rockall completo)</label>
        <select name="diag">
          <option value="0">Sem endoscopia / Mallory-Weiss sem SR</option>
          <option value="1">Outras causas (úlcera, varizes, etc.)</option>
          <option value="2">Neoplasia maligna TGI alto</option>
        </select>
        <label>Estigmas de sangramento</label>
        <select name="estigma">
          <option value="0">Nenhum / base limpa / ponto vermelho plano</option>
          <option value="2">Vaso visível / sangramento ativo</option>
        </select>
      </fieldset>
    `,
    calculate (form) {
      const bun = hNum(form, 'bun');
      const hb = hNum(form, 'hb');
      const pas = hNum(form, 'pas');
      const idade = hNum(form, 'idade');
      const pasRock = hNum(form, 'pasRock');
      const fc = hNum(form, 'fc');
      if (![bun, hb, pas, idade, pasRock, fc].every(Number.isFinite)) {
        return alert('Preencha ureia, hemoglobina, PAS, idade e FC.');
      }

      const ureaMmol = bun * 0.357;
      let gb = 0;
      if (ureaMmol < 6.5) gb += 0;
      else if (ureaMmol < 8) gb += 2;
      else if (ureaMmol < 10) gb += 3;
      else if (ureaMmol < 25) gb += 4;
      else gb += 6;

      const sexo = hSel(form, 'sexo');
      if (sexo === 'M') {
        if (hb < 10) gb += 6;
        else if (hb < 12) gb += 3;
        else if (hb < 13) gb += 1;
      } else {
        if (hb < 10) gb += 6;
        else if (hb < 12) gb += 1;
      }

      if (pas >= 110) gb += 0;
      else if (pas >= 100) gb += 1;
      else if (pas >= 90) gb += 2;
      else gb += 3;

      if (hChk(form, 'fc100')) gb += 1;
      if (hChk(form, 'melena')) gb += 1;
      if (hChk(form, 'syncope')) gb += 2;
      if (hChk(form, 'hepatico')) gb += 2;
      if (hChk(form, 'cardiaco')) gb += 2;

      let gbInterp = gb === 0
        ? 'GBS 0 — baixo risco; considerar alta precoce ambulatorial (se estável)'
        : gb >= 6
          ? 'GBS ≥6 — alto risco de necessidade de intervenção'
          : 'GBS ≥1 — internação e endoscopia precoce em geral';

      let rockAge = idade < 60 ? 0 : idade < 80 ? 1 : 2;
      let rockShock = 0;
      if (pasRock >= 100 && fc < 100) rockShock = 0;
      else if (pasRock >= 100 && fc >= 100) rockShock = 1;
      else if (pasRock < 100) rockShock = 2;
      const rockComorb = hChk(form, 'comorb') ? 2 : 0;
      const rockPre = rockAge + rockShock + rockComorb;

      const rockDiag = parseInt(hSel(form, 'diag'), 10);
      const rockEst = parseInt(hSel(form, 'estigma'), 10);
      const rockComplete = rockPre + rockDiag + rockEst;

      let rockInterp = rockComplete >= 8
        ? 'Rockall completo ≥8 — alto risco de ressangramento/mortalidade'
        : rockComplete >= 5
          ? 'Rockall 5–7 — risco intermediário'
          : 'Rockall ≤4 — baixo risco (com endoscopia favorável)';

      return `<p><strong>Glasgow-Blatchford:</strong> ${gb} — ${gbInterp}</p>
              <p><strong>Rockall pré-endoscópico:</strong> ${rockPre}/7</p>
              <p><strong>Rockall completo:</strong> ${rockComplete}/11 — ${rockInterp}</p>
              <p class="calc-note">Blatchford et al., 2000; Rockall et al., 1996. Endoscopia precoce (&lt;24 h) na maioria dos GBS ≥1.</p>`;
    }
  },

  deritis: {
    title: 'Escore de De Ritis (AST/ALT)',
    html: `
      <label>AST (U/L)</label>
      <input name="ast" type="number" step="1" min="0" required>
      <label>ALT (U/L)</label>
      <input name="alt" type="number" step="1" min="1" required>
    `,
    calculate (form) {
      const ast = hNum(form, 'ast');
      const alt = hNum(form, 'alt');
      if (!Number.isFinite(ast) || !Number.isFinite(alt) || alt <= 0) {
        return alert('Informe AST e ALT válidos.');
      }

      const ratio = ast / alt;
      let interp = '';
      if (ratio > 2) interp = 'AST/ALT &gt;2 — forte sugestão de hepatite alcoólica ou cirrose avançada';
      else if (ratio > 1) interp = 'AST/ALT &gt;1 — padrão alcoólico/cirrótico (AST raramente &gt;500 U/L)';
      else if (ratio < 1) interp = 'AST/ALT &lt;1 — padrão mais típico de esteatose/NAFLD ou hepatite viral';
      else interp = 'AST/ALT = 1 — inespecífico';

      return `<p><strong>De Ritis (AST/ALT):</strong> ${ratio.toFixed(2)}</p>
              <p><strong>Interpretação:</strong> ${interp}</p>
              <p class="calc-note">Na hepatite alcoólica: AST/ALT tipicamente 2:1; AST geralmente &lt;300 U/L.</p>`;
    }
  },

  'apri-fib4': {
    title: 'APRI & FIB-4 — Fibrose hepática',
    html: `
      <label>Idade (anos)</label>
      <input name="idade" type="number" min="1" required>
      <label>AST (U/L)</label>
      <input name="ast" type="number" step="1" min="0" required>
      <label>ALT (U/L)</label>
      <input name="alt" type="number" step="1" min="1" required>
      <label>Plaquetas (×10³/µL ou 10⁹/L)</label>
      <input name="plt" type="number" step="1" min="1" required>
      <label>Limite superior normal de AST (ULN, U/L)</label>
      <input name="uln" type="number" step="1" min="1" value="40" required>
    `,
    calculate (form) {
      const idade = hNum(form, 'idade');
      const ast = hNum(form, 'ast');
      const alt = hNum(form, 'alt');
      const plt = hNum(form, 'plt');
      const uln = hNum(form, 'uln');
      if (![idade, ast, alt, plt, uln].every(Number.isFinite) || alt <= 0 || plt <= 0 || uln <= 0) {
        return alert('Preencha todos os campos com valores válidos.');
      }

      const apri = (ast / uln) * 100 / plt;
      const fib4 = (idade * ast) / (plt * Math.sqrt(alt));

      let apriTxt = apri > 2 ? 'APRI &gt;2 — alta probabilidade de cirrose'
        : apri > 1.5 ? 'APRI &gt;1.5 — fibrose significativa provável'
        : apri < 0.5 ? 'APRI &lt;0.5 — fibrose significativa improvável'
        : 'APRI intermediário — considerar elastografia/biopsia';

      let fib4Txt = fib4 > 2.67 ? 'FIB-4 &gt;2,67 — risco elevado de fibrose avançada'
        : fib4 < 1.3 ? 'FIB-4 &lt;1,3 — baixo risco de fibrose avançada'
        : 'FIB-4 intermediário — complementar com elastografia';

      return `<p><strong>APRI:</strong> ${apri.toFixed(2)} — ${apriTxt}</p>
              <p><strong>FIB-4:</strong> ${fib4.toFixed(2)} — ${fib4Txt}</p>
              <p class="calc-note">Wai APRI (2003); Sterling FIB-4 (2006). Não substituem elastografia em hepatites virais/MASLD.</p>`;
    }
  }
};
