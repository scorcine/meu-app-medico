/* Calculadoras — Cardiologia */

function cNum (form, name) {
  const v = parseFloat(form[name]?.value);
  return Number.isFinite(v) ? v : NaN;
}

function cChk (form, name) {
  return !!form[name]?.checked;
}

function cSel (form, name) {
  return form[name]?.value ?? '';
}

const CALC_CARDIO = {
  'chads-vasc': {
    title: 'CHA₂DS₂-VASc',
    html: `
      <label>Sexo</label>
      <select name="sexo" required>
        <option value="M">Masculino</option>
        <option value="F">Feminino</option>
      </select>
      <label>Idade (anos)</label>
      <input name="idade" type="number" min="18" max="120" required>
      <label class="calc-check"><input type="checkbox" name="ic"> Insuficiência cardíaca congestiva</label>
      <label class="calc-check"><input type="checkbox" name="has"> Hipertensão arterial</label>
      <label class="calc-check"><input type="checkbox" name="dm"> Diabetes mellitus</label>
      <label class="calc-check"><input type="checkbox" name="avc"> AVC / AIT / tromboembolismo prévio (+2)</label>
      <label class="calc-check"><input type="checkbox" name="vasc"> Doença vascular (IAM, DAP, placa aórtica)</label>
    `,
    calculate (form) {
      const sexo = cSel(form, 'sexo');
      const idade = cNum(form, 'idade');
      let score = 0;
      if (cChk(form, 'ic')) score++;
      if (cChk(form, 'has')) score++;
      if (cChk(form, 'dm')) score++;
      if (cChk(form, 'avc')) score += 2;
      if (cChk(form, 'vasc')) score++;
      if (idade >= 75) score += 2;
      else if (idade >= 65) score++;
      if (sexo === 'F') score++;

      let antico = 'Avaliar anticoagulação oral';
      if (sexo === 'M' && score === 0) antico = 'Anticoagulação geralmente não indicada';
      else if (score === 1 && sexo === 'M') antico = 'Considerar anticoagulação conforme risco/benefício';
      else if (score >= 2) antico = 'Anticoagulação oral recomendada (salvo contraindicação)';

      return `<p><strong>CHA₂DS₂-VASc:</strong> ${score} pontos</p>
              <p><strong>Conduta:</strong> ${antico}</p>
              <p class="calc-note">Escores ≥2 (homens) ou ≥3 (mulheres) = alto risco tromboembólico em FA.</p>`;
    }
  },

  'has-bled': {
    title: 'HAS-BLED',
    html: `
      <label class="calc-check"><input type="checkbox" name="has"> Hipertensão (PAS &gt;160 mmHg)</label>
      <label class="calc-check"><input type="checkbox" name="renal"> Função renal anormal (diálise, transplante, Cr &gt;2,6)</label>
      <label class="calc-check"><input type="checkbox" name="hep"> Função hepática anormal (cirrose, bilirrubina &gt;2×, AST/ALT &gt;3×)</label>
      <label class="calc-check"><input type="checkbox" name="avc"> AVC prévio</label>
      <label class="calc-check"><input type="checkbox" name="sang"> História de sangramento ou predisposição</label>
      <label class="calc-check"><input type="checkbox" name="inr"> INR lábil (TTR &lt;60%)</label>
      <label class="calc-check"><input type="checkbox" name="idoso"> Idade &gt;65 anos</label>
      <label class="calc-check"><input type="checkbox" name="drogas"> Fármacos (AAS, AINEs, antiagregantes)</label>
      <label class="calc-check"><input type="checkbox" name="alcool"> Uso excessivo de álcool</label>
    `,
    calculate (form) {
      let score = 0;
      ['has', 'renal', 'hep', 'avc', 'sang', 'inr', 'idoso', 'drogas', 'alcool'].forEach(k => {
        if (cChk(form, k)) score++;
      });
      const risco = score >= 3
        ? 'Alto risco de sangramento — usar com cautela; não contraindica anticoagulação isoladamente'
        : score === 2
          ? 'Risco moderado — monitorar e corrigir fatores modificáveis'
          : 'Risco baixo a moderado';
      return `<p><strong>HAS-BLED:</strong> ${score}/9</p>
              <p><strong>Interpretação:</strong> ${risco}</p>
              <p class="calc-note">Pisters et al., 2010. Complementa CHA₂DS₂-VASc na decisão de anticoagulação.</p>`;
    }
  },

  grace: {
    title: 'GRACE 2.0',
    html: `
      <label>Idade (anos)</label>
      <input name="idade" type="number" min="18" required>
      <label>Frequência cardíaca (bpm)</label>
      <input name="fc" type="number" required>
      <label>PAS (mmHg)</label>
      <input name="pas" type="number" required>
      <label>Creatinina (mg/dL)</label>
      <input name="cr" type="number" step="0.01" min="0" required>
      <label>Classe Killip</label>
      <select name="killip" required>
        <option value="1">I — sem IC</option>
        <option value="2">II — estertores, B3 ou turgência jugular</option>
        <option value="3">III — edema pulmonar</option>
        <option value="4">IV — choque cardiogênico</option>
      </select>
      <label class="calc-check"><input type="checkbox" name="parada"> Parada cardíaca na admissão</label>
      <label class="calc-check"><input type="checkbox" name="st"> Desvio de ST ao ECG</label>
      <label class="calc-check"><input type="checkbox" name="enzimas"> Marcadores cardíacos elevados</label>
    `,
    calculate (form) {
      const idade = cNum(form, 'idade');
      const fc = cNum(form, 'fc');
      const pas = cNum(form, 'pas');
      const cr = cNum(form, 'cr');

      let agePts = 0;
      if (idade <= 39) agePts = 0;
      else if (idade <= 49) agePts = 18;
      else if (idade <= 59) agePts = 36;
      else if (idade <= 69) agePts = 55;
      else if (idade <= 79) agePts = 73;
      else if (idade <= 89) agePts = 91;
      else agePts = 100;

      let fcPts = 0;
      if (fc <= 49) fcPts = 0;
      else if (fc <= 69) fcPts = 3;
      else if (fc <= 89) fcPts = 9;
      else if (fc <= 109) fcPts = 15;
      else if (fc <= 149) fcPts = 24;
      else if (fc <= 199) fcPts = 38;
      else fcPts = 46;

      let pasPts = 0;
      if (pas <= 79) pasPts = 58;
      else if (pas <= 99) pasPts = 53;
      else if (pas <= 119) pasPts = 43;
      else if (pas <= 139) pasPts = 34;
      else if (pas <= 159) pasPts = 24;
      else if (pas <= 199) pasPts = 10;
      else pasPts = 0;

      let crPts = 0;
      if (cr < 0.4) crPts = 1;
      else if (cr < 0.8) crPts = 4;
      else if (cr < 1.2) crPts = 7;
      else if (cr < 1.6) crPts = 10;
      else if (cr < 2) crPts = 13;
      else if (cr < 4) crPts = 21;
      else crPts = 28;

      const killip = parseInt(cSel(form, 'killip'), 10);
      const killipPts = { 1: 0, 2: 20, 3: 39, 4: 59 }[killip] ?? 0;

      let total = agePts + fcPts + pasPts + crPts + killipPts;
      if (cChk(form, 'parada')) total += 39;
      if (cChk(form, 'st')) total += 28;
      if (cChk(form, 'enzimas')) total += 14;

      let risco = 'Baixo (<3%)';
      if (total > 140) risco = 'Alto (>8%)';
      else if (total > 108) risco = 'Intermediário (3–8%)';

      return `<p><strong>GRACE score:</strong> ${total} pontos</p>
              <p><strong>Risco de mortalidade hospitalar (referência):</strong> ${risco}</p>
              <p class="calc-note">GRACE 2.0 — SCA sem supradesnivelamento de ST. Consulte curva nomograma para mortalidade em 6 meses.</p>`;
    }
  },

  'timi-ua': {
    title: 'TIMI UA/NSTEMI',
    html: `
      <label class="calc-check"><input type="checkbox" name="t1"> Idade ≥65 anos</label>
      <label class="calc-check"><input type="checkbox" name="t2"> ≥3 fatores de risco para DAC</label>
      <label class="calc-check"><input type="checkbox" name="t3"> DAC conhecida (estenose ≥50%)</label>
      <label class="calc-check"><input type="checkbox" name="t4"> Uso de AAS nos últimos 7 dias</label>
      <label class="calc-check"><input type="checkbox" name="t5"> Angina grave (≥2 episódios em 24h)</label>
      <label class="calc-check"><input type="checkbox" name="t6"> Alteração ST ≥0,5 mm</label>
      <label class="calc-check"><input type="checkbox" name="t7"> Marcador cardíaco positivo</label>
    `,
    calculate (form) {
      let score = 0;
      ['t1', 't2', 't3', 't4', 't5', 't6', 't7'].forEach(k => { if (cChk(form, k)) score++; });
      let risco = 'Baixo (5% eventos em 14 dias)';
      if (score >= 5) risco = 'Alto (26% eventos em 14 dias)';
      else if (score >= 3) risco = 'Intermediário (13% eventos em 14 dias)';
      return `<p><strong>TIMI UA/NSTEMI:</strong> ${score}/7</p>
              <p><strong>Risco de eventos:</strong> ${risco}</p>
              <p class="calc-note">Antman et al., 2000.</p>`;
    }
  },

  'timi-stemi': {
    title: 'TIMI STEMI',
    html: `
      <label>Idade (anos)</label>
      <input name="idade" type="number" required>
      <label>PAS (mmHg)</label>
      <input name="pas" type="number" required>
      <label>Frequência cardíaca (bpm)</label>
      <input name="fc" type="number" required>
      <label>Peso (kg)</label>
      <input name="peso" type="number" step="0.1" required>
      <label class="calc-check"><input type="checkbox" name="dm"> Diabetes</label>
      <label class="calc-check"><input type="checkbox" name="has"> Hipertensão</label>
      <label class="calc-check"><input type="checkbox" name="ang"> Angina prévia</label>
      <label class="calc-check"><input type="checkbox" name="ant"> Supra ST anterior</label>
      <label class="calc-check"><input type="checkbox" name="killip"> Killip II–IV</label>
      <label class="calc-check"><input type="checkbox" name="tempo"> Tempo ao tratamento &gt;4h</label>
    `,
    calculate (form) {
      const idade = cNum(form, 'idade');
      const pas = cNum(form, 'pas');
      const fc = cNum(form, 'fc');
      const peso = cNum(form, 'peso');
      let score = 0;

      if (idade >= 75) score += 3;
      else if (idade >= 65) score += 2;
      if (cChk(form, 'dm')) score++;
      if (cChk(form, 'has')) score++;
      if (cChk(form, 'ang')) score++;
      if (pas < 100) score += 3;
      else if (pas < 150) score += 2;
      if (fc > 100) score += 2;
      if (peso < 67) score += 1;
      if (cChk(form, 'ant')) score++;
      if (cChk(form, 'killip')) score += 2;
      if (cChk(form, 'tempo')) score++;

      let mort = '~0,8%';
      if (score >= 8) mort = '~35%';
      else if (score >= 5) mort = '~9–12%';
      else if (score >= 3) mort = '~3–5%';

      return `<p><strong>TIMI STEMI:</strong> ${score} pontos</p>
              <p><strong>Mortalidade em 30 dias (estimada):</strong> ${mort}</p>
              <p class="calc-note">Morrow et al., 2000.</p>`;
    }
  },

  killip: {
    title: 'Killip-Kimball',
    html: `
      <label>Classe clínica</label>
      <select name="classe" required>
        <option value="1">I — Sem sinais de IC</option>
        <option value="2">II — Estertores, B3 ou turgência jugular</option>
        <option value="3">III — Edema agudo de pulmão</option>
        <option value="4">IV — Choque cardiogênico</option>
      </select>
    `,
    calculate (form) {
      const c = parseInt(cSel(form, 'classe'), 10);
      const info = {
        1: { mort: '~6%', desc: 'Sem insuficiência cardíaca' },
        2: { mort: '~17%', desc: 'IC leve a moderada' },
        3: { mort: '~38%', desc: 'Edema pulmonar' },
        4: { mort: '~81%', desc: 'Choque cardiogênico' }
      }[c];
      return `<p><strong>Killip ${c}:</strong> ${info.desc}</p>
              <p><strong>Mortalidade hospitalar aproximada:</strong> ${info.mort}</p>
              <p class="calc-note">Killip & Kimball, 1967 — pós-IAM.</p>`;
    }
  },

  score2: {
    title: 'SCORE2 (risco cardiovascular 10 anos)',
    html: `
      <label>Sexo</label>
      <select name="sexo" required>
        <option value="M">Masculino</option>
        <option value="F">Feminino</option>
      </select>
      <label>Idade (anos)</label>
      <input name="idade" type="number" min="40" max="89" required>
      <label class="calc-check"><input type="checkbox" name="fumo"> Fumante atual</label>
      <label>PAS (mmHg)</label>
      <input name="pas" type="number" required>
      <label>Colesterol total (mg/dL)</label>
      <input name="ct" type="number" required>
      <label>HDL (mg/dL)</label>
      <input name="hdl" type="number" required>
      <label>Região de risco</label>
      <select name="regiao" required>
        <option value="mod">Moderado (ex.: Brasil)</option>
        <option value="alto">Alto</option>
        <option value="baixo">Baixo</option>
      </select>
    `,
    calculate (form) {
      const idade = cNum(form, 'idade');
      const pas = cNum(form, 'pas');
      const ct = cNum(form, 'ct');
      const hdl = cNum(form, 'hdl');
      const fumo = cChk(form, 'fumo');
      let pts = 0;
      if (idade >= 65) pts += 3;
      else if (idade >= 55) pts += 2;
      else if (idade >= 45) pts += 1;
      if (fumo) pts += 2;
      if (pas >= 160) pts += 2;
      else if (pas >= 140) pts += 1;
      const naoHdl = ct - hdl;
      if (naoHdl >= 220) pts += 2;
      else if (naoHdl >= 190) pts += 1;
      if (hdl < 40) pts += 1;

      let risco = '<2,5% — baixo';
      if (pts >= 7) risco = '≥10% — muito alto (estratificação simplificada)';
      else if (pts >= 5) risco = '5–10% — alto';
      else if (pts >= 3) risco = '2,5–5% — moderado';

      return `<p><strong>SCORE2 (estratificação simplificada):</strong> ${pts} pts internos</p>
              <p><strong>Risco CV estimado em 10 anos:</strong> ${risco}</p>
              <p class="calc-note">Para decisão terapêutica, use tabelas SCORE2/ESC 2021 completas por região e idade.</p>`;
    }
  },

  framingham: {
    title: 'Framingham (risco CV 10 anos)',
    html: `
      <label>Sexo</label>
      <select name="sexo" required>
        <option value="M">Masculino</option>
        <option value="F">Feminino</option>
      </select>
      <label>Idade (anos)</label>
      <input name="idade" type="number" min="30" max="79" required>
      <label>Colesterol total (mg/dL)</label>
      <input name="ct" type="number" required>
      <label>HDL (mg/dL)</label>
      <input name="hdl" type="number" required>
      <label>PAS (mmHg)</label>
      <input name="pas" type="number" required>
      <label class="calc-check"><input type="checkbox" name="trata"> Tratamento para hipertensão</label>
      <label class="calc-check"><input type="checkbox" name="fumo"> Fumante</label>
      <label class="calc-check"><input type="checkbox" name="dm"> Diabetes</label>
    `,
    calculate (form) {
      const sexo = cSel(form, 'sexo');
      const idade = cNum(form, 'idade');
      const ct = cNum(form, 'ct');
      const hdl = cNum(form, 'hdl');
      const pas = cNum(form, 'pas');
      let pts = 0;

      if (sexo === 'M') {
        if (idade >= 70) pts += 8;
        else if (idade >= 60) pts += 6;
        else if (idade >= 50) pts += 4;
        else if (idade >= 40) pts += 2;
        if (ct >= 280) pts += 3;
        else if (ct >= 240) pts += 2;
        else if (ct >= 200) pts += 1;
        if (hdl < 35) pts += 2;
        else if (hdl < 45) pts += 1;
        else if (hdl >= 60) pts -= 1;
        if (cChk(form, 'trata')) {
          if (pas >= 160) pts += 3;
          else if (pas >= 140) pts += 2;
          else if (pas >= 120) pts += 1;
        } else {
          if (pas >= 160) pts += 2;
          else if (pas >= 140) pts += 1;
        }
        if (cChk(form, 'fumo')) pts += 2;
        if (cChk(form, 'dm')) pts += 2;
      } else {
        if (idade >= 70) pts += 8;
        else if (idade >= 60) pts += 6;
        else if (idade >= 50) pts += 4;
        else if (idade >= 40) pts += 2;
        if (ct >= 280) pts += 3;
        else if (ct >= 240) pts += 2;
        else if (ct >= 200) pts += 1;
        if (hdl < 35) pts += 2;
        else if (hdl < 45) pts += 1;
        else if (hdl >= 60) pts -= 1;
        if (cChk(form, 'trata')) {
          if (pas >= 160) pts += 4;
          else if (pas >= 140) pts += 3;
          else if (pas >= 120) pts += 2;
        } else {
          if (pas >= 160) pts += 3;
          else if (pas >= 140) pts += 2;
        }
        if (cChk(form, 'fumo')) pts += 2;
        if (cChk(form, 'dm')) pts += 4;
      }

      let risco = '<10%';
      if (pts >= 15) risco = '≥30%';
      else if (pts >= 12) risco = '20–30%';
      else if (pts >= 9) risco = '10–20%';

      return `<p><strong>Framingham (pontos ATP simplificado):</strong> ${pts}</p>
              <p><strong>Risco de evento CV em 10 anos:</strong> ${risco}</p>
              <p class="calc-note">Estimativa por pontos. Para precisão, use calculadora Framingham oficial ou ASCVD.</p>`;
    }
  },

  'wells-tvp': {
    title: 'Wells TVP',
    html: `
      <label class="calc-check"><input type="checkbox" name="w1"> Câncer ativo (+1)</label>
      <label class="calc-check"><input type="checkbox" name="w2"> Paralisia / imobilização (+1)</label>
      <label class="calc-check"><input type="checkbox" name="w3"> Acamado &gt;3 dias ou cirurgia recente (+1)</label>
      <label class="calc-check"><input type="checkbox" name="w4"> Dor à palpação de veias profundas (+1)</label>
      <label class="calc-check"><input type="checkbox" name="w5"> Edema de perna inteira (+1)</label>
      <label class="calc-check"><input type="checkbox" name="w6"> Edema de panturrilha &gt;3 cm (+1)</label>
      <label class="calc-check"><input type="checkbox" name="w7"> Edema com cacifo (+1)</label>
      <label class="calc-check"><input type="checkbox" name="w8"> Veias colaterais superficiais (+1)</label>
      <label class="calc-check"><input type="checkbox" name="w9"> Diagnóstico alternativo tão provável quanto TVP (−2)</label>
    `,
    calculate (form) {
      let score = 0;
      ['w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8'].forEach(k => { if (cChk(form, k)) score++; });
      if (cChk(form, 'w9')) score -= 2;

      let prob = 'Improvável (≤5%) — considerar D-dímero';
      if (score >= 3) prob = 'Provável (~34%) — considerar USG Doppler';
      else if (score >= 1) prob = 'Intermediária (~17%)';

      return `<p><strong>Wells TVP:</strong> ${score} pontos</p>
              <p><strong>Probabilidade clínica:</strong> ${prob}</p>
              <p class="calc-note">Wells et al., 1997.</p>`;
    }
  },

  perc: {
    title: 'PERC (regra de exclusão de TEP)',
    html: `
      <p class="muted" style="font-size:0.85rem;margin-bottom:0.5rem">Use apenas se probabilidade pré-teste baixa (&lt;15%). Se TODOS forem ausentes, TEP pode ser excluída sem D-dímero.</p>
      <label class="calc-check"><input type="checkbox" name="p1"> Idade ≥50 anos</label>
      <label class="calc-check"><input type="checkbox" name="p2"> FC ≥100 bpm</label>
      <label class="calc-check"><input type="checkbox" name="p3"> SpO₂ &lt;95% em ar ambiente</label>
      <label class="calc-check"><input type="checkbox" name="p4"> Edema unilateral de perna</label>
      <label class="calc-check"><input type="checkbox" name="p5"> Hemoptise</label>
      <label class="calc-check"><input type="checkbox" name="p6"> Cirurgia/trauma nas últimas 4 semanas</label>
      <label class="calc-check"><input type="checkbox" name="p7"> TEP ou TVP prévia</label>
    `,
    calculate (form) {
      const any = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'].some(k => cChk(form, k));
      const interp = any
        ? 'PERC positivo — critério presente; NÃO exclui TEP (considerar D-dímero/TC)'
        : 'PERC negativo — TEP excluída em baixa probabilidade pré-teste (sem necessidade de D-dímero)';
      return `<p><strong>PERC:</strong> ${any ? 'Não aplicável para exclusão' : 'Todos negativos'}</p>
              <p><strong>Interpretação:</strong> ${interp}</p>
              <p class="calc-note">Kline et al., 2004. Aplicável somente em baixo risco clínico.</p>`;
    }
  },

  heart: {
    title: 'HEART Score',
    html: `
      <label>História clínica</label>
      <select name="hist" required>
        <option value="0">Levemente suspeita</option>
        <option value="1">Moderadamente suspeita</option>
        <option value="2">Altamente suspeita</option>
      </select>
      <label>ECG</label>
      <select name="ecg" required>
        <option value="0">Normal</option>
        <option value="1">Distúrbio inespecífico da repolarização</option>
        <option value="2">Desvio significativo de ST</option>
      </select>
      <label>Idade (anos)</label>
      <input name="idade" type="number" required>
      <label>Fatores de risco (DM, HAS, tabagismo, obesidade, história familiar, dislipidemia)</label>
      <select name="rf" required>
        <option value="0">Nenhum conhecido</option>
        <option value="1">1–2 fatores</option>
        <option value="2">≥3 fatores ou DAC conhecida</option>
      </select>
      <label>Troponina inicial</label>
      <select name="trop" required>
        <option value="0">≤ limite normal</option>
        <option value="1">1–3× limite superior</option>
        <option value="2">&gt;3× limite superior</option>
      </select>
    `,
    calculate (form) {
      const score = parseInt(cSel(form, 'hist'), 10) +
        parseInt(cSel(form, 'ecg'), 10) +
        (cNum(form, 'idade') >= 65 ? 2 : cNum(form, 'idade') >= 45 ? 1 : 0) +
        parseInt(cSel(form, 'rf'), 10) +
        parseInt(cSel(form, 'trop'), 10);

      let risco = 'Baixo (1,7% MACE em 6 semanas) — alta probabilidade de alta precoce';
      if (score >= 7) risco = 'Alto (50–65% MACE) — internação e estratificação invasiva';
      else if (score >= 4) risco = 'Moderado (12–16% MACE) — observação e repetir troponina';

      return `<p><strong>HEART Score:</strong> ${score}/10</p>
              <p><strong>Risco:</strong> ${risco}</p>
              <p class="calc-note">Six et al., 2008 — dor torácica na emergência.</p>`;
    }
  },

  nyha: {
    title: 'NYHA (classe funcional)',
    html: `
      <label>Classe funcional</label>
      <select name="classe" required>
        <option value="1">I — Sem limitação; atividade física habitual não causa fadiga, dispneia ou angina</option>
        <option value="2">II — Limitação leve; confortável em repouso; sintomas na atividade ordinária</option>
        <option value="3">III — Limitação acentuada; confortável apenas em repouso; sintomas em atividades leves</option>
        <option value="4">IV — Incapaz de realizar atividades sem desconforto; sintomas em repouso</option>
      </select>
    `,
    calculate (form) {
      const c = cSel(form, 'classe');
      const desc = {
        1: 'Assintomático na atividade habitual',
        2: 'Sintomas em esforço moderado',
        3: 'Sintomas em esforço mínimo',
        4: 'Sintomas em repouso'
      }[c];
      return `<p><strong>NYHA Classe ${c}:</strong> ${desc}</p>
              <p class="calc-note">New York Heart Association — insuficiência cardíaca.</p>`;
    }
  },

  qtc: {
    title: 'QTc (Bazett e Fridericia)',
    html: `
      <label>Intervalo QT (ms)</label>
      <input name="qt" type="number" min="200" max="800" required>
      <label>Frequência cardíaca (bpm)</label>
      <input name="fc" type="number" min="30" max="200" required>
      <label>Sexo</label>
      <select name="sexo" required>
        <option value="M">Masculino</option>
        <option value="F">Feminino</option>
      </select>
    `,
    calculate (form) {
      const qt = cNum(form, 'qt');
      const fc = cNum(form, 'fc');
      const sexo = cSel(form, 'sexo');
      const rr = 60 / fc;
      const qtcB = qt / Math.sqrt(rr);
      const qtcF = qt / Math.pow(rr, 1 / 3);
      const lim = sexo === 'F' ? 470 : 450;
      const interp = qtcB > lim
        ? 'QTc prolongado — risco de arritmias ventriculares; revisar fármacos e eletrólitos'
        : 'QTc dentro do limite usual';

      return `<p><strong>QTc Bazett:</strong> ${qtcB.toFixed(0)} ms</p>
              <p><strong>QTc Fridericia:</strong> ${qtcF.toFixed(0)} ms</p>
              <p><strong>Referência:</strong> &lt;${lim} ms (${sexo === 'F' ? 'mulher' : 'homem'})</p>
              <p><strong>Interpretação:</strong> ${interp}</p>
              <p class="calc-note">Bazett: QT/√RR. Fridericia: QT/RR^(1/3) — preferível em FC extremas.</p>`;
    }
  },

  ict: {
    title: 'Índice cardiotorácico (ICT)',
    html: `
      <label>Diâmetro cardíaco máximo (mm) — raio PA</label>
      <input name="card" type="number" min="1" required>
      <label>Diâmetro torácico máximo (mm) — raio PA</label>
      <input name="torax" type="number" min="1" required>
    `,
    calculate (form) {
      const card = cNum(form, 'card');
      const torax = cNum(form, 'torax');
      if (!card || !torax) return alert('Informe ambas as medidas.');
      const ict = card / torax;
      let interp = 'Normal (<0,50)';
      if (ict >= 0.55) interp = 'Aumentado (≥0,55) — sugere cardiomegalia';
      else if (ict >= 0.50) interp = 'Limítrofe (0,50–0,54)';

      return `<p><strong>ICT:</strong> ${ict.toFixed(2)}</p>
              <p><strong>Interpretação:</strong> ${interp}</p>
              <p class="calc-note">Medidas em incidência postero-anterior (PA). Normal &lt;0,50 em adultos.</p>`;
    }
  }
};
