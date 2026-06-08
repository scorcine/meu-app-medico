/* Calculadoras — Obstetrícia & Ginecologia */

function bNum (form, name) {
  const v = parseFloat(form[name]?.value);
  return Number.isFinite(v) ? v : NaN;
}

function bChk (form, name) {
  return !!form[name]?.checked;
}

function bSel (form, name) {
  return form[name]?.value ?? '';
}

function formatDateBR (d) {
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

const CALC_OBSTETRICIA = {
  bishop: {
    title: 'Índice de Bishop — maturidade cervical',
    html: `
      <label>Dilatação (cm)</label>
      <select name="dilat" required>
        <option value="0">0 cm</option>
        <option value="1">1–2 cm</option>
        <option value="2">3–4 cm</option>
        <option value="3">≥5 cm</option>
      </select>
      <label>Apagamento (%)</label>
      <select name="apag" required>
        <option value="0">0–30%</option>
        <option value="1">40–50%</option>
        <option value="2">60–70%</option>
        <option value="3">≥80%</option>
      </select>
      <label>Estação fetal</label>
      <select name="estacao" required>
        <option value="0">-3</option>
        <option value="1">-2</option>
        <option value="2">-1 / 0</option>
        <option value="3">+1 / +2</option>
      </select>
      <label>Consistência cervical</label>
      <select name="consist" required>
        <option value="0">Firme</option>
        <option value="1">Média</option>
        <option value="2">Amolecida</option>
      </select>
      <label>Posição do colo</label>
      <select name="posicao" required>
        <option value="0">Posterior</option>
        <option value="1">Média</option>
        <option value="2">Anterior</option>
      </select>
    `,
    calculate (form) {
      const total =
        parseInt(bSel(form, 'dilat'), 10) +
        parseInt(bSel(form, 'apag'), 10) +
        parseInt(bSel(form, 'estacao'), 10) +
        parseInt(bSel(form, 'consist'), 10) +
        parseInt(bSel(form, 'posicao'), 10);

      let interp = total >= 8
        ? 'Colo favorável (≥8) — maior chance de indução bem-sucedida'
        : total >= 6
          ? 'Intermediário (6–7) — pode necessitar maturação cervical (prostaglandinas/Foley)'
          : 'Colo desfavorável (&lt;6) — indução com baixa taxa de sucesso isolada';

      return `<p><strong>Bishop:</strong> ${total}/13</p>
              <p><strong>Interpretação:</strong> ${interp}</p>
              <p class="calc-note">Bishop, 1964. Escore modificado inclui consistência e posição; ≥8 associado a parto vaginal após indução.</p>`;
    }
  },

  hellp: {
    title: 'HELLP — Classificação Tennessee',
    html: `
      <label>Plaquetas (×10³/µL ou 10⁹/L)</label>
      <input name="plt" type="number" step="1" min="0" required>
      <label>AST (U/L)</label>
      <input name="ast" type="number" step="1" min="0" required>
      <label>LDH (U/L)</label>
      <input name="ldh" type="number" step="1" min="0" required>
      <label>Bilirrubina total (mg/dL)</label>
      <input name="bili" type="number" step="0.01" min="0" required>
      <label class="calc-check"><input type="checkbox" name="esfreg"> Esfregaço periférico com esquizócitos</label>
    `,
    calculate (form) {
      const plt = bNum(form, 'plt');
      const ast = bNum(form, 'ast');
      const ldh = bNum(form, 'ldh');
      const bili = bNum(form, 'bili');
      if (![plt, ast, ldh, bili].every(Number.isFinite)) return alert('Preencha todos os laboratórios.');

      const hemolise = ldh >= 600 || bili >= 1.2 || bChk(form, 'esfreg');
      const el = ast >= 70;
      const lp = plt <= 150;
      const hellp = hemolise && el && lp;

      let classe = 'Não classificável';
      if (hellp) {
        if (plt <= 50) classe = 'Tennessee Classe I (PLT ≤50.000)';
        else if (plt <= 100) classe = 'Tennessee Classe II (PLT 50.001–100.000)';
        else classe = 'Tennessee Classe III (PLT 100.001–150.000)';
      }

      const diag = hellp
        ? `Síndrome HELLP confirmada — ${classe}`
        : 'Critérios HELLP incompletos';

      let conduta = hellp
        ? 'Internação, sulfato de magnésio se pré-eclâmpsia, corticoide para maturação fetal se &lt;34 sem, avaliar resolução da gestação conforme idade gestacional e gravidade'
        : 'Investigar diagnósticos diferenciais; repetir exames e monitorar';

      return `<p><strong>Hemólise:</strong> ${hemolise ? 'Presente' : 'Ausente'} (LDH ≥600, bilirrubina ≥1,2 ou esquizócitos)</p>
              <p><strong>Enzimas hepáticas:</strong> ${el ? 'AST ≥70' : 'AST &lt;70'}</p>
              <p><strong>Plaquetopenia:</strong> ${plt <= 100 ? 'PLT ≤100.000' : plt <= 150 ? 'PLT 100.001–150.000 (Classe III)' : 'PLT &gt;150.000'}</p>
              <p><strong>Diagnóstico:</strong> ${diag}</p>
              <p><strong>Conduta:</strong> ${conduta}</p>
              <p class="calc-note">Sibai et al., Tennessee classification. Classe I = maior morbimortalidade materno-fetal.</p>`;
    }
  },

  'magee-preeclampsia': {
    title: 'Pré-eclâmpsia — fullPIERS (Magee)',
    html: `
      <label>Idade gestacional (semanas)</label>
      <input name="ig" type="number" step="0.1" min="20" max="44" required>
      <label>Creatinina sérica (mg/dL)</label>
      <input name="cr" type="number" step="0.01" min="0" required>
      <label>Plaquetas (×10³/µL)</label>
      <input name="plt" type="number" step="1" min="0" required>
      <label>AST (U/L)</label>
      <input name="ast" type="number" step="1" min="0" required>
      <label>SpO₂ (%)</label>
      <input name="spo2" type="number" step="0.1" min="70" max="100" value="98" required>
      <label class="calc-check"><input type="checkbox" name="dor"> Dor torácica ou dispneia</label>
    `,
    calculate (form) {
      const ga = bNum(form, 'ig');
      const cr = bNum(form, 'cr');
      const plt = bNum(form, 'plt');
      const ast = bNum(form, 'ast');
      let spo2 = bNum(form, 'spo2');
      if (![ga, cr, plt, ast].every(Number.isFinite)) return alert('Preencha idade gestacional e laboratórios.');

      if (!Number.isFinite(spo2)) spo2 = 97;
      const chest = bChk(form, 'dor') ? 1 : 0;

      const logit =
        2.68 +
        -5.41e-2 * ga +
        1.23 * chest +
        -2.71e-2 * cr +
        2.07e-1 * plt +
        4.00e-5 * plt * plt +
        1.01e-2 * ast +
        -3.05e-6 * ast * ast +
        2.50e-4 * cr * plt +
        -6.99e-5 * plt * ast +
        -2.56e-3 * plt * spo2;

      const prob = 100 / (1 + Math.exp(-logit));

      let conduta = prob >= 30
        ? 'Risco ≥30% em 48 h — internação, vigilância intensiva, considerar transferência/unidade terciária e timing de resolução'
        : prob >= 10
          ? 'Risco intermediário — monitorização hospitalar estreita e repetir fullPIERS'
          : 'Risco baixo em 48 h — vigilância conforme protocolo, reavaliar se piora clínica';

      return `<p><strong>fullPIERS:</strong> ${prob.toFixed(1)}% de desfecho materno adverso em 48 h</p>
              <p><strong>Interpretação:</strong> ${conduta}</p>
              <p class="calc-note">von Dadelszen et al., Lancet 2011 (Magee/WHO fullPIERS). Limiar ≥30% para risco elevado. Calculadora oficial: piers.cfri.ca</p>`;
    }
  },

  naegele: {
    title: 'Idade gestacional & DPP (Naegele)',
    html: `
      <label>Data da última menstruação (DUM)</label>
      <input name="dum" type="date" required>
      <label>Data de referência — opcional (padrão: hoje)</label>
      <input name="ref" type="date">
    `,
    calculate (form) {
      const dumStr = form.dum.value;
      if (!dumStr) return alert('Informe a DUM.');

      const dum = new Date(`${dumStr}T12:00:00`);
      const ref = form.ref.value
        ? new Date(`${form.ref.value}T12:00:00`)
        : new Date(new Date().toDateString() + 'T12:00:00');

      if (Number.isNaN(dum.getTime())) return alert('DUM inválida.');

      const edd = new Date(dum);
      edd.setDate(edd.getDate() + 280);

      const diasTotais = Math.floor((ref - dum) / (1000 * 60 * 60 * 24));
      const semanas = Math.floor(diasTotais / 7);
      const dias = diasTotais % 7;
      const diasParaDpp = Math.floor((edd - ref) / (1000 * 60 * 60 * 24));

      let trimestre = semanas < 14 ? '1º trimestre' : semanas < 28 ? '2º trimestre' : '3º trimestre';

      return `<p><strong>DPP (Naegele):</strong> ${formatDateBR(edd)}</p>
              <p><strong>Idade gestacional:</strong> ${semanas} sem ${dias} dia(s) — ${trimestre}</p>
              <p><strong>Dias até a DPP:</strong> ${diasParaDpp >= 0 ? diasParaDpp + ' dias restantes' : Math.abs(diasParaDpp) + ' dias após a DPP'}</p>
              <p class="calc-note">Regra de Naegele: DUM + 7 dias − 3 meses (+1 ano). USG 1º trimestre preferível se DUM incerta.</p>`;
    }
  },

  'rcog-vte': {
    title: 'RCOG — Risco VTE gestante (modificado)',
    wide: true,
    html: `
      <fieldset class="calc-fieldset">
        <legend>Fatores pré-existentes / antenatais</legend>
        <label class="calc-check"><input type="checkbox" name="vtePrev"> TVP/TEP prévia (não cirúrgica isolada) (+4)</label>
        <label class="calc-check"><input type="checkbox" name="vteCir"> TVP/TEP prévia pós-cirurgia (+3)</label>
        <label class="calc-check"><input type="checkbox" name="tromboAlto"> Trombofilia alto risco (+3)</label>
        <label class="calc-check"><input type="checkbox" name="comorb"> Comorbidade médica³ (+3)</label>
        <label class="calc-check"><input type="checkbox" name="familia"> História familiar VTE 1º grau (+1)</label>
        <label class="calc-check"><input type="checkbox" name="tromboBaixo"> Trombofilia baixo risco sem VTE (+1)</label>
        <label class="calc-check"><input type="checkbox" name="idade"> Idade &gt;35 anos (+1)</label>
        <label class="calc-check"><input type="checkbox" name="bmi30"> IMC &gt;30 kg/m² (+1)</label>
        <label class="calc-check"><input type="checkbox" name="bmi40"> IMC &gt;40 kg/m² (+2)</label>
        <label class="calc-check"><input type="checkbox" name="para3"> Paridade ≥3 (+1)</label>
        <label class="calc-check"><input type="checkbox" name="fumo"> Tabagismo (+1)</label>
        <label class="calc-check"><input type="checkbox" name="preEclampsia"> Pré-eclâmpsia (+1)</label>
        <label class="calc-check"><input type="checkbox" name="fiv"> FIV / indução ovulatória (+1)</label>
        <label class="calc-check"><input type="checkbox" name="gemelar"> Gestação múltipla (+1)</label>
        <label class="calc-check"><input type="checkbox" name="imobil"> Imobilidade / hospitalização (+1)</label>
      </fieldset>
      <fieldset class="calc-fieldset">
        <legend>Fatores intraparto / puerpério</legend>
        <label class="calc-check"><input type="checkbox" name="csParto"> Cesárea em trabalho de parto (+2)</label>
        <label class="calc-check"><input type="checkbox" name="csElet"> Cesárea eletiva (+1)</label>
        <label class="calc-check"><input type="checkbox" name="pph"> Hemorragia pós-parto &gt;1 L (+1)</label>
        <label class="calc-check"><input type="checkbox" name="prematuro"> Parto &lt;37 sem (+1)</label>
        <label class="calc-check"><input type="checkbox" name="natimorto"> Natimorto (+1)</label>
        <label class="calc-check"><input type="checkbox" name="tpProl"> Trabalho de parto &gt;24 h (+1)</label>
      </fieldset>
    `,
    calculate (form) {
      let ante = 0;
      let post = 0;

      const anteFields = [
        'vtePrev', 'vteCir', 'tromboAlto', 'comorb', 'familia', 'tromboBaixo',
        'idade', 'bmi30', 'bmi40', 'para3', 'fumo', 'preEclampsia', 'fiv', 'gemelar', 'imobil'
      ];
      const postFields = ['csParto', 'csElet', 'pph', 'prematuro', 'natimorto', 'tpProl'];
      const pts = {
        vtePrev: 4, vteCir: 3, tromboAlto: 3, comorb: 3, familia: 1, tromboBaixo: 1,
        idade: 1, bmi30: 1, bmi40: 2, para3: 1, fumo: 1, preEclampsia: 1, fiv: 1, gemelar: 1, imobil: 1,
        csParto: 2, csElet: 1, pph: 1, prematuro: 1, natimorto: 1, tpProl: 1
      };

      anteFields.forEach(k => { if (bChk(form, k)) ante += pts[k]; });
      postFields.forEach(k => { if (bChk(form, k)) post += pts[k]; });

      if (bChk(form, 'bmi30') && bChk(form, 'bmi40')) ante -= pts.bmi30;

      const totalPost = ante + post;

      let anteCond = ante >= 4
        ? 'Considerar HBPM profilática desde o 1º trimestre'
        : ante >= 3
          ? 'Considerar HBPM a partir de 28 semanas'
          : 'Sem indicação antenatal rotineira pelo escore (reavaliar se internação)';

      let postCond = totalPost >= 2
        ? 'Considerar HBPM puerperal ≥10 dias (até 6 semanas se alto risco)'
        : 'Profilaxia puerperal não indicada pelo escore isolado';

      return `<p><strong>Escore antenatal:</strong> ${ante}</p>
              <p><strong>Escore puerperal (total):</strong> ${totalPost}</p>
              <p><strong>Antenatal:</strong> ${anteCond}</p>
              <p><strong>Puerpério:</strong> ${postCond}</p>
              <p class="calc-note">RCOG GTG 37a (2015, rev. 2023). Reavaliar na internação, 28 sem, parto e alta. Balancear risco hemorrágico.</p>`;
    }
  },

  vbac: {
    title: 'VBAC / TOLAC — probabilidade de sucesso',
    html: `
      <label>Idade materna (anos)</label>
      <input name="idade" type="number" min="15" max="55" required>
      <label>IMC (kg/m²)</label>
      <input name="imc" type="number" step="0.1" min="15" required>
      <label>Número de cesáreas prévias</label>
      <select name="nCS" required>
        <option value="1">1 cesárea</option>
        <option value="2">≥2 cesáreas</option>
      </select>
      <label>Motivo da cesárea anterior</label>
      <select name="motivo" required>
        <option value="nao-recorrente">Não recorrente (apresentação, sofrimento fetal, placenta)</option>
        <option value="dystocia">Distócia / parada de progresso</option>
      </select>
      <label class="calc-check"><input type="checkbox" name="pv"> Parto vaginal prévio (inclui VBAC)</label>
      <label>Dilatação cervical na admissão (cm)</label>
      <input name="dilat" type="number" step="0.5" min="0" max="10" value="0">
    `,
    calculate (form) {
      const idade = bNum(form, 'idade');
      const imc = bNum(form, 'imc');
      const dilat = bNum(form, 'dilat');
      if (!Number.isFinite(idade) || !Number.isFinite(imc)) return alert('Preencha idade e IMC.');

      let pct = 63;
      if (bChk(form, 'pv')) pct += 16;
      if (bSel(form, 'motivo') === 'nao-recorrente') pct += 11;
      if (bSel(form, 'motivo') === 'dystocia') pct -= 11;
      if (idade >= 40) pct -= 13;
      else if (idade >= 35) pct -= 6;
      if (imc >= 35) pct -= 14;
      else if (imc >= 30) pct -= 7;
      if (bSel(form, 'nCS') === '2') pct -= 22;
      if (Number.isFinite(dilat) && dilat >= 4) pct += 7;

      pct = Math.min(Math.max(Math.round(pct), 12), 93);

      let tolac = pct >= 70
        ? 'Boa candidata a TOLAC — discutir parto vaginal com equipe experiente'
        : pct >= 50
          ? 'Candidata moderada — TOLAC possível com consentimento informado detalhado'
          : pct >= 35
            ? 'Baixa probabilidade — TOLAC possível, mas cesárea eletiva frequentemente preferida'
            : 'Muito baixa probabilidade — repetir cesárea geralmente recomendada';

      return `<p><strong>Probabilidade estimada de VBAC:</strong> ${pct}%</p>
              <p><strong>Interpretação TOLAC:</strong> ${tolac}</p>
              <p class="calc-note">Modelo simplificado baseado em Grobman et al., NEJM 2007. Risco de ruptura uterina ~0,5–0,9% (1 cesárea). Usar calculadora Grobman oficial para decisão fina.</p>`;
    }
  }
};
