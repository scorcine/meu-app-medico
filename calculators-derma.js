/* Calculadoras — Dermatologia & Queimaduras */

function dNum (form, name) {
  const v = parseFloat(form[name]?.value);
  return Number.isFinite(v) ? v : NaN;
}

function dSel (form, name) {
  return form[name]?.value ?? '';
}

function dChk (form, name) {
  return !!form[name]?.checked;
}

const LUND_AGES = [0, 1, 5, 10, 15, 18];

const LUND_PCT = {
  head: [19, 17, 13, 11, 9, 7],
  neck: [3, 3, 3, 3, 3, 3],
  antTrunk: [13, 13, 13, 13, 13, 13],
  postTrunk: [13, 13, 13, 13, 13, 13],
  buttock: [2.5, 2.5, 2.5, 2.5, 2.5, 2.5],
  genital: [1, 1, 1, 1, 1, 1],
  armUpL: [4, 4, 4, 4, 4, 4],
  armLoL: [3, 3, 3, 3, 3, 3],
  handL: [2.5, 2.5, 2.5, 2.5, 2.5, 2.5],
  armUpR: [4, 4, 4, 4, 4, 4],
  armLoR: [3, 3, 3, 3, 3, 3],
  handR: [2.5, 2.5, 2.5, 2.5, 2.5, 2.5],
  thighL: [5.5, 6.5, 8, 8.5, 9, 9.5],
  legL: [5, 5, 5.5, 6, 6.5, 7],
  footL: [3.5, 3.5, 3.5, 3.5, 3.5, 3.5],
  thighR: [5.5, 6.5, 8, 8.5, 9, 9.5],
  legR: [5, 5, 5.5, 6, 6.5, 7],
  footR: [3.5, 3.5, 3.5, 3.5, 3.5, 3.5]
};

const WALLACE_PCT = {
  head: 9,
  antTrunk: 18,
  postTrunk: 18,
  armL: 9,
  armR: 9,
  legL: 18,
  legR: 18,
  genital: 1
};

function lundAgeIndex (age) {
  if (age >= 18) return 5;
  if (age >= 15) return 4 + (age - 15) / 3;
  if (age >= 10) return 3 + (age - 10) / 5;
  if (age >= 5) return 2 + (age - 5) / 5;
  if (age >= 1) return 1 + (age - 1) / 4;
  return age;
}

function lundPct (key, age) {
  const arr = LUND_PCT[key];
  const idx = lundAgeIndex(age);
  const lo = Math.floor(idx);
  const hi = Math.min(lo + 1, arr.length - 1);
  const frac = idx - lo;
  return arr[lo] + frac * (arr[hi] - arr[lo]);
}

function burnFrac (form, name) {
  const v = dNum(form, name);
  if (!Number.isFinite(v)) return 0;
  return Math.min(Math.max(v, 0), 100) / 100;
}

const CALC_DERMA = {
  'regra-9': {
    title: 'Regra dos 9 (Wallace) & Lund-Browder',
    wide: true,
    html: `
      <label>Método</label>
      <select name="metodo" required>
        <option value="wallace">Wallace — adulto (regra dos 9)</option>
        <option value="lund">Lund-Browder — pediátrico</option>
      </select>
      <label>Idade (anos) — Lund-Browder</label>
      <input name="idade" type="number" min="0" max="100" value="30">
      <p class="calc-note">Informe % da superfície queimada em cada região (0–100).</p>
      <label>Cabeça / pescoço (% queimado)</label>
      <input name="head" type="number" min="0" max="100" value="0">
      <label>Tórax anterior (%)</label>
      <input name="antTrunk" type="number" min="0" max="100" value="0">
      <label>Tórax posterior (%)</label>
      <input name="postTrunk" type="number" min="0" max="100" value="0">
      <label>Braço esquerdo (%)</label>
      <input name="armL" type="number" min="0" max="100" value="0">
      <label>Braço direito (%)</label>
      <input name="armR" type="number" min="0" max="100" value="0">
      <label>Perna esquerda (%)</label>
      <input name="legL" type="number" min="0" max="100" value="0">
      <label>Perna direita (%)</label>
      <input name="legR" type="number" min="0" max="100" value="0">
      <label>Genital / períneo (%)</label>
      <input name="genital" type="number" min="0" max="100" value="0">
    `,
    onRender (form) {
      const metodo = form.querySelector('[name="metodo"]');
      const idade = form.querySelector('[name="idade"]');
      function refresh () {
        idade.parentElement.style.display = metodo.value === 'lund' ? '' : 'none';
      }
      metodo.addEventListener('change', refresh);
      refresh();
    },
    calculate (form) {
      const metodo = dSel(form, 'metodo');
      const idade = dNum(form, 'idade') || 30;

      let scq = 0;
      let detalhe = '';

      if (metodo === 'wallace') {
        Object.entries(WALLACE_PCT).forEach(([k, pct]) => {
          const part = pct * burnFrac(form, k);
          scq += part;
          if (part > 0) detalhe += `${k}: ${part.toFixed(1)}% | `;
        });
      } else {
        const map = {
          head: ['head', 'neck'],
          antTrunk: ['antTrunk'],
          postTrunk: ['postTrunk', 'buttock'],
          armL: ['armUpL', 'armLoL', 'handL'],
          armR: ['armUpR', 'armLoR', 'handR'],
          legL: ['thighL', 'legL', 'footL'],
          legR: ['thighR', 'legR', 'footR'],
          genital: ['genital']
        };
        Object.entries(map).forEach(([field, keys]) => {
          const frac = burnFrac(form, field);
          if (frac <= 0) return;
          const regionPct = keys.reduce((s, k) => s + lundPct(k, idade), 0);
          const part = regionPct * frac;
          scq += part;
          detalhe += `${field}: ${part.toFixed(1)}% | `;
        });
      }

      scq = Math.min(scq, 100);

      let grau = scq < 10
        ? 'Queimadura menor (&lt;10% SCQ) — ambulatorial na maioria'
        : scq < 20
          ? 'Queimadura moderada — considerar centro de queimados se ≥10% ou face/mãos/genital'
          : scq < 40
            ? 'Queimadura grave — centro de queimados'
            : 'Queimadura crítica — UTI queimados';

      return `<p><strong>SCQ total:</strong> ${scq.toFixed(1)}%</p>
              <p><strong>Classificação:</strong> ${grau}</p>
              <p><strong>Detalhe:</strong> ${detalhe || 'Nenhuma área marcada'}</p>
              <p class="calc-note">Wallace (adulto) vs Lund-Browder (idade ${idade} anos). Reposição volêmica: ver Parkland (4 mL×kg×%SCQ) na área Pediatria ou protocolo institucional.</p>`;
    }
  },

  scorten: {
    title: 'SCORTEN — necrólise epidérmica (NET/SJS)',
    html: `
      <label class="calc-check"><input type="checkbox" name="idade"> Idade &gt;40 anos (+1)</label>
      <label class="calc-check"><input type="checkbox" name="fc"> FC &gt;120 bpm (+1)</label>
      <label class="calc-check"><input type="checkbox" name="neo"> Neoplasia / hemopatia maligna (+1)</label>
      <label class="calc-check"><input type="checkbox" name="bsa"> Descolamento epidérmico &gt;10% SCQ (+1)</label>
      <label class="calc-check"><input type="checkbox" name="ureia"> Ureia &gt;28 mg/dL (&gt;10 mmol/L) (+1)</label>
      <label class="calc-check"><input type="checkbox" name="glic"> Glicemia &gt;252 mg/dL (&gt;14 mmol/L) (+1)</label>
      <label class="calc-check"><input type="checkbox" name="hco3"> Bicarbonato &lt;20 mEq/L (+1)</label>
    `,
    calculate (form) {
      let score = 0;
      ['idade', 'fc', 'neo', 'bsa', 'ureia', 'glic', 'hco3'].forEach(k => {
        if (dChk(form, k)) score += 1;
      });

      let mort = score <= 1 ? '~3%'
        : score === 2 ? '~12%'
        : score === 3 ? '~35%'
        : score === 4 ? '~58%'
        : '~90%';

      let conduta = score >= 3
        ? 'Alto risco — UTI/CTI queimados; suspender droga causal; cuidados de NET'
        : score >= 2
          ? 'Risco moderado — internação e monitorização estreita'
          : 'Risco baixo — vigilância hospitalar';

      return `<p><strong>SCORTEN:</strong> ${score}/7</p>
              <p><strong>Mortalidade estimada:</strong> ${mort}</p>
              <p><strong>Conduta:</strong> ${conduta}</p>
              <p class="calc-note">Bastuji-Garin et al., 2000. Validado em SJS/NET. Repetir escore no dia 3 e 5 melhora predição.</p>`;
    }
  }
};
