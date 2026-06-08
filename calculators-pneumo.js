/* Calculadoras — Pneumologia & Gasometrias */

function pNum (form, name) {
  const v = parseFloat(form[name]?.value);
  return Number.isFinite(v) ? v : NaN;
}

function pChk (form, name) {
  return !!form[name]?.checked;
}

function pSel (form, name) {
  return form[name]?.value ?? '';
}

const CALC_PNEUMO = {
  psi: {
    title: 'PSI / PORT (Pneumonia Severity Index)',
    wide: true,
    html: `
      <label>Sexo</label>
      <select name="sexo" required>
        <option value="M">Masculino</option>
        <option value="F">Feminino</option>
      </select>
      <label>Idade (anos)</label>
      <input name="idade" type="number" min="18" required>
      <fieldset class="calc-fieldset">
        <legend>Comorbidades</legend>
        <label class="calc-check"><input type="checkbox" name="asilo"> Residência em instituição (+10)</label>
        <label class="calc-check"><input type="checkbox" name="neo"> Neoplasia (+30)</label>
        <label class="calc-check"><input type="checkbox" name="hep"> Doença hepática (+20)</label>
        <label class="calc-check"><input type="checkbox" name="ic"> Insuficiência cardíaca (+10)</label>
        <label class="calc-check"><input type="checkbox" name="cvd"> Doença cerebrovascular (+10)</label>
        <label class="calc-check"><input type="checkbox" name="renal"> Doença renal (+10)</label>
      </fieldset>
      <label class="calc-check"><input type="checkbox" name="mental"> Alteração do estado mental (+20)</label>
      <label>Frequência respiratória (irpm)</label>
      <input name="fr" type="number" required>
      <label>PAS (mmHg)</label>
      <input name="pas" type="number" required>
      <label>Temperatura (°C)</label>
      <input name="temp" type="number" step="0.1" required>
      <label>Frequência cardíaca (bpm)</label>
      <input name="fc" type="number" required>
      <label>pH arterial</label>
      <input name="ph" type="number" step="0.01" placeholder="Opcional">
      <label>Ureia/BUN (mg/dL)</label>
      <input name="bun" type="number" placeholder="Opcional; ≥30 = +20">
      <label>Sódio (mEq/L)</label>
      <input name="na" type="number" placeholder="Opcional; &lt;130 = +20">
      <label>Glicose (mg/dL)</label>
      <input name="glic" type="number" placeholder="Opcional; ≥250 = +10">
      <label>Hematócrito (%)</label>
      <input name="ht" type="number" placeholder="Opcional; &lt;30 = +10">
      <label>PaO₂ (mmHg)</label>
      <input name="pao2" type="number" placeholder="Opcional; &lt;60 = +10">
      <label class="calc-check"><input type="checkbox" name="derrame"> Derrame pleural (+10)</label>
    `,
    calculate (form) {
      const sexo = pSel(form, 'sexo');
      const idade = pNum(form, 'idade');
      let score = sexo === 'F' ? Math.max(idade - 10, 0) : idade;

      if (pChk(form, 'asilo')) score += 10;
      if (pChk(form, 'neo')) score += 30;
      if (pChk(form, 'hep')) score += 20;
      if (pChk(form, 'ic')) score += 10;
      if (pChk(form, 'cvd')) score += 10;
      if (pChk(form, 'renal')) score += 10;
      if (pChk(form, 'mental')) score += 20;

      const fr = pNum(form, 'fr');
      const pas = pNum(form, 'pas');
      const temp = pNum(form, 'temp');
      const fc = pNum(form, 'fc');
      if (fr >= 30) score += 20;
      if (pas < 90) score += 20;
      if (temp < 35 || temp >= 40) score += 15;
      if (fc >= 125) score += 10;

      const ph = pNum(form, 'ph');
      if (ph && ph < 7.35) score += 30;
      const bun = pNum(form, 'bun');
      if (bun >= 30) score += 20;
      const na = pNum(form, 'na');
      if (na && na < 130) score += 20;
      const glic = pNum(form, 'glic');
      if (glic >= 250) score += 10;
      const ht = pNum(form, 'ht');
      if (ht && ht < 30) score += 10;
      const pao2 = pNum(form, 'pao2');
      if (pao2 && pao2 < 60) score += 10;
      if (pChk(form, 'derrame')) score += 10;

      let classe = 'I–II';
      let mort = '<1%';
      let conduta = 'Tratamento ambulatorial (considerar)';
      if (score > 130) { classe = 'V'; mort = '~29%'; conduta = 'Internação + considerar UTI'; }
      else if (score > 90) { classe = 'IV'; mort = '~8%'; conduta = 'Internação hospitalar'; }
      else if (score > 70) { classe = 'III'; mort = '~2%'; conduta = 'Internação ou observação'; }

      return `<p><strong>PSI (PORT):</strong> ${score} pontos — Classe ${classe}</p>
              <p><strong>Mortalidade em 30 dias:</strong> ${mort}</p>
              <p><strong>Conduta sugerida:</strong> ${conduta}</p>
              <p class="calc-note">Fine et al., 1997 (Pneumonia Severity Index).</p>`;
    }
  },

  mallampati: {
    title: 'Escore de Mallampati (via aérea)',
    html: `
      <label>Classe de Mallampati</label>
      <select name="classe" required>
        <option value="1">I — palato mole, úvula, pilares visíveis</option>
        <option value="2">II — palato mole, úvula parcialmente visível</option>
        <option value="3">III — palato mole, base da úvula visível</option>
        <option value="4">IV — palato mole não visível</option>
      </select>
    `,
    calculate (form) {
      const c = pSel(form, 'classe');
      const risco = c <= 2
        ? 'Via aérea provável de fácil visualização'
        : c === '3'
          ? 'Via aérea de visualização difícil — preparar plano B'
          : 'Via aérea difícil — considerar estratégia avançada';
      return `<p><strong>Mallampati ${c}:</strong> ${risco}</p>
              <p class="calc-note">Avaliar junto com outros preditores (distância tireomentoniana, abertura oral, mobilidade cervical).</p>`;
    }
  },

  'agem-pram': {
    title: 'Asma pediátrica — AGEM / PRAM',
    html: `
      <label>Escore</label>
      <select name="tipo" required>
        <option value="pram">PRAM (Pediatric Respiratory Assessment Measure)</option>
        <option value="agem">AGEM (gravidade clínica)</option>
      </select>
      <div id="agem-pram-fields"></div>
    `,
    calculate (form) {
      const tipo = pSel(form, 'tipo');
      if (tipo === 'pram') {
        const score =
          parseInt(pSel(form, 'pr_supra'), 10) +
          parseInt(pSel(form, 'pr_escal'), 10) +
          parseInt(pSel(form, 'pr_sibil'), 10) +
          parseInt(pSel(form, 'pr_entrada'), 10) +
          parseInt(pSel(form, 'pr_spo2'), 10);

        let grav = 'Leve — alta precoce possível';
        if (score >= 8) grav = 'Grave — considerar UTI / tratamento intensivo';
        else if (score >= 4) grav = 'Moderada — observação e tratamento inalatório';

        return `<p><strong>PRAM:</strong> ${score}/12</p>
                <p><strong>Gravidade:</strong> ${grav}</p>
                <p class="calc-note">Ducharme et al. PRAM — exacerbação asmática pediátrica.</p>`;
      }

      const spo2 = pNum(form, 'ag_spo2');
      const fala = pSel(form, 'ag_fala');
      const sibil = pSel(form, 'ag_sibil');
      const musc = pSel(form, 'ag_musc');
      let grav = 'Leve';
      let pts = 0;
      if (spo2 < 90) pts += 3;
      else if (spo2 < 95) pts += 2;
      if (fala === 'palavras') pts += 2;
      else if (fala === 'frases') pts += 1;
      if (sibil === 'grave') pts += 2;
      else if (sibil === 'moderado') pts += 1;
      if (musc === 'sim') pts += 2;

      if (pts >= 5) grav = 'Grave';
      else if (pts >= 3) grav = 'Moderada';

      return `<p><strong>AGEM (gravidade clínica):</strong> ${grav}</p>
              <p><strong>Pontos internos:</strong> ${pts}</p>
              <p class="calc-note">Classificação clínica de exacerbação asmática pediátrica — use PRAM para score validado.</p>`;
    },
    onRender (form) {
      const tipo = form?.querySelector('[name=tipo]');
      const container = form?.closest('.calc-block')?.querySelector('#agem-pram-fields')
        || document.getElementById('agem-pram-fields');
      if (!tipo || !container) return;

      const render = () => {
        if (tipo.value === 'pram') {
          container.innerHTML = `
            <label>Retração supraesternal</label>
            <select name="pr_supra" required>
              <option value="0">Ausente (0)</option><option value="1">Leve (1)</option><option value="2">Grave (2)</option>
            </select>
            <label>Retração escalena/ intercostal</label>
            <select name="pr_escal" required>
              <option value="0">0</option><option value="1">1</option><option value="2">2</option>
            </select>
            <label>Sibilos (ausculta)</label>
            <select name="pr_sibil" required>
              <option value="0">Ausente (0)</option><option value="1">Expiração (1)</option>
              <option value="2">Insp+exp (2)</option><option value="3">Mínimos ou ausentes com GRAVIDADE (3)</option>
            </select>
            <label>Entrada de ar</label>
            <select name="pr_entrada" required>
              <option value="0">Normal (0)</option><option value="1">Diminuída (1)</option><option value="2">Muito diminuída (2)</option>
            </select>
            <label>SpO₂ em ar ambiente</label>
            <select name="pr_spo2" required>
              <option value="0">≥97% (0)</option><option value="1">94–96% (1)</option>
              <option value="2">90–93% (2)</option><option value="3">&lt;90% (3)</option>
            </select>`;
        } else {
          container.innerHTML = `
            <label>SpO₂ (%)</label>
            <input name="ag_spo2" type="number" min="0" max="100" required>
            <label>Capacidade de fala</label>
            <select name="ag_fala" required>
              <option value="normal">Frases completas</option>
              <option value="frases">Frases curtas</option>
              <option value="palavras">Palavras isoladas</option>
            </select>
            <label>Sibilos</label>
            <select name="ag_sibil" required>
              <option value="leve">Leves</option><option value="moderado">Moderados</option><option value="grave">Graves / silent chest</option>
            </select>
            <label>Uso de musculatura acessória</label>
            <select name="ag_musc" required>
              <option value="nao">Não</option><option value="sim">Sim</option>
            </select>`;
        }
      };
      tipo.addEventListener('change', render);
      render();
    }
  },

  vef1: {
    title: 'VEF1 previsto (espirometria)',
    html: `
      <label>Sexo</label>
      <select name="sexo" required>
        <option value="M">Masculino</option>
        <option value="F">Feminino</option>
      </select>
      <label>Idade (anos)</label>
      <input name="idade" type="number" min="18" max="90" required>
      <label>Altura (cm)</label>
      <input name="altura" type="number" min="100" max="220" required>
      <label>VEF1 medido (L)</label>
      <input name="vef1" type="number" step="0.01" min="0" placeholder="Opcional — calcular % previsto">
    `,
    calculate (form) {
      const sexo = pSel(form, 'sexo');
      const idade = pNum(form, 'idade');
      const altura = pNum(form, 'altura');
      let previsto;
      if (sexo === 'M') previsto = (0.0430 * altura) - (0.0290 * idade) - 2.49;
      else previsto = (0.0395 * altura) - (0.0252 * idade) - 2.38;

      const vef1 = pNum(form, 'vef1');
      let extra = '';
      if (vef1 > 0) {
        const pct = (vef1 / previsto) * 100;
        let obstr = 'Normal (≥80%)';
        if (pct < 30) obstr = 'Muito grave (<30%)';
        else if (pct < 50) obstr = 'Grave (30–49%)';
        else if (pct < 80) obstr = 'Moderado (50–79%)';
        extra = `<p><strong>VEF1 medido/previsto:</strong> ${pct.toFixed(0)}% — ${obstr}</p>`;
      }

      return `<p><strong>VEF1 previsto:</strong> ${previsto.toFixed(2)} L</p>
              ${extra}
              <p class="calc-note">Equações de Pereira et al. (Brasil). Para laudo oficial, use equações GLI-2012.</p>`;
    }
  },

  'aa-pafi': {
    title: 'Gradiente A-a e relação PaO₂/FiO₂ (PAFi)',
    html: `
      <label>PaO₂ (mmHg)</label>
      <input name="pao2" type="number" min="0" required>
      <label>PaCO₂ (mmHg)</label>
      <input name="paco2" type="number" min="0" required>
      <label>FiO₂ (0–1, ex.: 0.21 ar ambiente)</label>
      <input name="fio2" type="number" step="0.01" min="0.21" max="1" value="0.21" required>
      <label>Idade (anos) — para A-a esperado</label>
      <input name="idade" type="number" min="0" value="30">
    `,
    calculate (form) {
      const pao2 = pNum(form, 'pao2');
      const paco2 = pNum(form, 'paco2');
      const fio2 = pNum(form, 'fio2');
      const idade = pNum(form, 'idade') || 30;

      const pao2Alveolar = (fio2 * 713) - (paco2 / 0.8);
      const aaGrad = pao2Alveolar - pao2;
      const aaEsperado = (idade / 4) + 4;
      const pafi = pao2 / fio2;

      let sdrA = 'Normal (≥300)';
      if (pafi < 100) sdrA = 'SDRA grave (PaFi &lt;100)';
      else if (pafi < 200) sdrA = 'SDRA moderada (PaFi &lt;200)';
      else if (pafi < 300) sdrA = 'SDRA leve (PaFi &lt;300)';

      const aaInterp = aaGrad > aaEsperado + 5
        ? 'Gradiente A-a elevado — distúrbio V/Q ou shunt'
        : 'Gradiente A-a dentro do esperado para a idade';

      return `<p><strong>Gradiente A-a:</strong> ${aaGrad.toFixed(1)} mmHg (esperado ~${aaEsperado.toFixed(0)})</p>
              <p><strong>PaO₂/FiO₂ (PAFi):</strong> ${pafi.toFixed(0)} mmHg</p>
              <p><strong>Interpretação A-a:</strong> ${aaInterp}</p>
              <p><strong>Interpretação PAFi:</strong> ${sdrA}</p>
              <p class="calc-note">A-a = (FiO₂×713) − (PaCO₂/0.8) − PaO₂ (nível do mar). PAFi = PaO₂/FiO₂.</p>`;
    }
  },

  rox: {
    title: 'Índice de ROX (cateter nasal alto fluxo)',
    html: `
      <label>SpO₂ (%)</label>
      <input name="spo2" type="number" min="0" max="100" required>
      <label>FiO₂ (0–1)</label>
      <input name="fio2" type="number" step="0.01" min="0.21" max="1" required>
      <label>Frequência respiratória (irpm)</label>
      <input name="fr" type="number" min="1" required>
    `,
    calculate (form) {
      const spo2 = pNum(form, 'spo2');
      const fio2 = pNum(form, 'fio2');
      const fr = pNum(form, 'fr');
      const rox = (spo2 / fio2) / fr;

      let interp = 'Zona intermediária — monitorar de perto';
      if (rox >= 4.88) interp = 'ROX ≥4,88 — maior chance de sucesso da CNAF (referência 2–12h)';
      else if (rox < 3.85) interp = 'ROX &lt;3,85 — alto risco de falha da CNAF; considerar escalonamento';

      return `<p><strong>Índice ROX:</strong> ${rox.toFixed(2)}</p>
              <p><strong>Interpretação:</strong> ${interp}</p>
              <p class="calc-note">ROX = SpO₂ / FiO₂ / FR. Roca et al., 2016.</p>`;
    }
  },

  'tobin-rsbi': {
    title: 'Índice de Tobin (RSBI)',
    html: `
      <label>Frequência respiratória espontânea (irpm)</label>
      <input name="fr" type="number" min="1" step="1" required placeholder="Ex.: 28">
      <label>Volume corrente espontâneo (mL)</label>
      <input name="vt" type="number" min="50" step="10" required placeholder="Ex.: 350">
    `,
    calculate (form) {
      const fr = pNum(form, 'fr');
      const vt = pNum(form, 'vt');
      if (!fr || !vt || vt <= 0) return alert('Preencha FR e volume corrente válidos.');

      const tobin = fr / (vt / 1000);
      let interp;
      let sbt;

      if (tobin < 80) {
        interp = 'Favorável ao desmame';
        sbt = 'Boa chance de sucesso no teste de respiração espontânea (TRE/SBT)';
      } else if (tobin <= 105) {
        interp = 'Zona intermediária — avaliar clínica e critérios de SBT';
        sbt = 'TRE possível com monitorização estreita';
      } else {
        interp = 'Desfavorável — respiração rápida e superficial';
        sbt = 'Alto risco de falha no TRE — otimizar antes de novo teste';
      }

      return `<p><strong>Índice de Tobin (RSBI):</strong> ${tobin.toFixed(1)}</p>
              <p><strong>Interpretação:</strong> ${interp}</p>
              <p><strong>TRE / SBT:</strong> ${sbt}</p>
              <p class="calc-note">RSBI = FR / Vt (L). Meta usual &lt;105 (ideal &lt;80). Yang &amp; Tobin, 1991.</p>`;
    }
  },

  'rsi-farmacos': {
    title: 'RSI — doses, apresentações e fluxo',
    html: `
      <label>Peso do paciente (kg)</label>
      <input name="peso" type="number" min="3" max="250" step="0.1" required placeholder="Ex.: 70">

      <label>Fluxo de intubação</label>
      <select name="fluxo" required>
        <option value="rsi">Sequência rápida (RSI clássica)</option>
        <option value="preox">Pré-oxigenação reforçada + oxigenação apneica</option>
      </select>

      <fieldset class="calc-fieldset rsi-drug-fieldset">
        <legend>Fármacos — marque os que vai usar e escolha a ampola do seu serviço</legend>
        <div id="rsi-drug-fields"></div>
      </fieldset>
    `,
    onRender (form) {
      const container = form?.querySelector('#rsi-drug-fields');
      if (!container || container.dataset.rsiRendered) return;
      container.dataset.rsiRendered = '1';

      const cats = [
        { id: 'premedicacao', label: 'Pré-tratamento / sedação' },
        { id: 'inducao', label: 'Indução' },
        { id: 'bnm', label: 'Bloqueio neuromuscular' }
      ];

      container.innerHTML = cats.map(cat => {
        const drugs = RSI_DRUG_LIB.filter(d => d.cat === cat.id);
        return `
          <p class="rsi-drug-cat">${cat.label}</p>
          ${drugs.map(d => `
            <div class="rsi-drug-row" data-rsi-drug="${d.id}">
              <label class="calc-check rsi-drug-check">
                <input type="checkbox" name="use_${d.id}" value="1">
                <span><strong>${d.name}</strong> — ${d.doseRange} ${d.unit}</span>
              </label>
              <label class="rsi-drug-amp-label">Ampola do serviço</label>
              <select name="amp_${d.id}" disabled>
                ${d.presentations.map((p, i) => `<option value="${i}">${p.label}</option>`).join('')}
              </select>
              <label class="rsi-drug-dose-label">Dose (mg/kg ou mcg/kg)</label>
              <input name="dose_${d.id}" type="number" step="0.01" min="0" value="${d.doseDefault}" disabled>
            </div>
          `).join('')}`;
      }).join('');

      RSI_DRUG_LIB.forEach(d => {
        const row = container.querySelector(`[data-rsi-drug="${d.id}"]`);
        const chk = row?.querySelector(`[name="use_${d.id}"]`);
        const amp = row?.querySelector(`[name="amp_${d.id}"]`);
        const dose = row?.querySelector(`[name="dose_${d.id}"]`);
        if (!chk || !amp || !dose) return;

        const sync = () => {
          const on = chk.checked;
          amp.disabled = !on;
          dose.disabled = !on;
          row.classList.toggle('rsi-drug-row-active', on);
        };
        chk.addEventListener('change', sync);
        sync();
      });
    },
    calculate (form) {
      const peso = pNum(form, 'peso');
      if (!peso || peso <= 0) return alert('Informe o peso do paciente.');

      const fluxo = pSel(form, 'fluxo');
      const selected = RSI_DRUG_LIB.filter(d => form[`use_${d.id}`]?.checked);

      const hasInducao = selected.some(d => d.cat === 'inducao');
      const hasBnm = selected.some(d => d.cat === 'bnm');
      if (!hasInducao) return alert('Selecione ao menos um agente de indução (propofol, etomidato ou cetamina).');
      if (!hasBnm) return alert('Selecione ao menos um bloqueador neuromuscular (succinilcolina ou rocurônio).');

      const rows = selected.map(d => {
        const ampIdx = parseInt(pSel(form, `amp_${d.id}`), 10) || 0;
        const pres = d.presentations[ampIdx] || d.presentations[0];
        const dosePerKg = pNum(form, `dose_${d.id}`) || d.doseDefault;
        const calc = rsiComputeDrugDose(d, peso, dosePerKg, pres);
        return { drug: d, pres, calc, dosePerKg };
      });

      const preRows = rows.filter(r => r.drug.cat === 'premedicacao');
      const indRows = rows.filter(r => r.drug.cat === 'inducao');
      const bnmRows = rows.filter(r => r.drug.cat === 'bnm');

      const flowHtml = fluxo === 'rsi'
        ? rsiFlowHtmlRsi(preRows, indRows, bnmRows)
        : rsiFlowHtmlPreox(preRows, indRows, bnmRows);

      const tableRows = rows.map(({ drug, pres, calc, dosePerKg }) => {
        const unitLabel = drug.unit === 'mcg/kg' ? 'mcg/kg' : 'mg/kg';
        return `<tr>
          <td><strong>${drug.name}</strong><br><span class="rsi-drug-meta">${drug.catLabel}</span></td>
          <td>${dosePerKg} ${unitLabel}<br><strong>${calc.doseLabel}</strong></td>
          <td>${pres.label}</td>
          <td><strong>${calc.volumeMl} mL</strong>${calc.ampNote ? `<br>${calc.ampNote}` : ''}</td>
          <td>${drug.dilution}</td>
        </tr>`;
      }).join('');

      return `${flowHtml}
              <h4 class="rsi-result-title">Plano farmacológico (${peso} kg)</h4>
              <table class="emerg-table rsi-drug-table">
                <tr><th>Fármaco</th><th>Dose</th><th>Ampola escolhida</th><th>Volume</th><th>Diluição / preparo</th></tr>
                ${tableRows}
              </table>
              <ul class="emerg-calc-alerts">
                <li>Ordem sugerida: pré-tratamento (3–5 min antes) → indução → BNM imediatamente após (ou simultâneo conforme protocolo local).</li>
                <li>Adaptar ao choque, TCE, asma, gravidez e idade. Succinilcolina: evitar em hipercalemia, queimadura crônica, paralisia.</li>
                <li>Sempre ter plano B/C de via aérea (Vortex) — ver Trauma &amp; Suporte Avançado.</li>
              </ul>`;
    }
  }
};

const RSI_DRUG_LIB = [
  {
    id: 'midazolam',
    name: 'Midazolam',
    cat: 'premedicacao',
    catLabel: 'Pré-medicação / sedação',
    doseDefault: 0.03,
    doseRange: '0,02–0,05',
    unit: 'mg/kg',
    maxDoseMg: 5,
    dilution: 'Puro IV lento · pode diluir 1:1 em SF 0,9% se necessário',
    presentations: [
      { label: '5 mg/5 mL (1 mg/mL)', concMgMl: 1, ampMl: 5 },
      { label: '5 mg/1 mL (5 mg/mL)', concMgMl: 5, ampMl: 1 },
      { label: '15 mg/3 mL (5 mg/mL)', concMgMl: 5, ampMl: 3 }
    ]
  },
  {
    id: 'fentanil',
    name: 'Fentanil',
    cat: 'premedicacao',
    catLabel: 'Pré-tratamento analgésico',
    doseDefault: 2,
    doseRange: '1–3',
    unit: 'mcg/kg',
    maxDoseMcg: 200,
    dilution: 'Diluir em 10 mL SF · administrar lento em 3–5 min (TCE/HTIC)',
    presentations: [
      { label: '50 mcg/mL — ampola 2 mL (100 mcg)', concMcgMl: 50, ampMl: 2 },
      { label: '50 mcg/mL — ampola 5 mL (250 mcg)', concMcgMl: 50, ampMl: 5 },
      { label: '50 mcg/mL — ampola 10 mL (500 mcg)', concMcgMl: 50, ampMl: 10 }
    ]
  },
  {
    id: 'lidocaina',
    name: 'Lidocaína',
    cat: 'premedicacao',
    catLabel: 'Pré-tratamento (HTIC/asma)',
    doseDefault: 1.5,
    doseRange: '1–1,5',
    unit: 'mg/kg',
    maxDoseMg: 100,
    dilution: 'Puro IV lento em 3–5 min · evitar se contraindicado',
    presentations: [
      { label: '20 mg/mL (2%) — ampola 5 mL (100 mg)', concMgMl: 20, ampMl: 5 },
      { label: '10 mg/mL (1%) — ampola 10 mL (100 mg)', concMgMl: 10, ampMl: 10 }
    ]
  },
  {
    id: 'propofol',
    name: 'Propofol',
    cat: 'inducao',
    catLabel: 'Indução',
    doseDefault: 1.5,
    doseRange: '1–2',
    unit: 'mg/kg',
    dilution: 'Puro IV · reduzir dose se instável (ex.: 0,5–1 mg/kg)',
    presentations: [
      { label: '10 mg/mL — frasco 10 mL (100 mg)', concMgMl: 10, ampMl: 10 },
      { label: '10 mg/mL — frasco 20 mL (200 mg)', concMgMl: 10, ampMl: 20 }
    ]
  },
  {
    id: 'etomidato',
    name: 'Etomidato',
    cat: 'inducao',
    catLabel: 'Indução',
    doseDefault: 0.3,
    doseRange: '0,2–0,3',
    unit: 'mg/kg',
    dilution: 'Puro IV · boa estabilidade hemodinâmica',
    presentations: [
      { label: '2 mg/mL — ampola 10 mL (20 mg)', concMgMl: 2, ampMl: 10 },
      { label: '2 mg/mL — ampola 20 mL (40 mg)', concMgMl: 2, ampMl: 20 }
    ]
  },
  {
    id: 'cetamina',
    name: 'Cetamina',
    cat: 'inducao',
    catLabel: 'Indução',
    doseDefault: 1.5,
    doseRange: '1–2',
    unit: 'mg/kg',
    dilution: 'Puro IV · broncodilatação; cuidado com HTIC relativa',
    presentations: [
      { label: '50 mg/mL — ampola 2 mL (100 mg)', concMgMl: 50, ampMl: 2 },
      { label: '50 mg/mL — ampola 5 mL (250 mg)', concMgMl: 50, ampMl: 5 },
      { label: '50 mg/mL — ampola 10 mL (500 mg)', concMgMl: 50, ampMl: 10 }
    ]
  },
  {
    id: 'succinilcolina',
    name: 'Succinilcolina',
    cat: 'bnm',
    catLabel: 'BNM despolarizante',
    doseDefault: 1.5,
    doseRange: '1–1,5',
    unit: 'mg/kg',
    dilution: 'Puro IV · início rápido (~45 s) · duração ~6–10 min',
    presentations: [
      { label: '100 mg/2 mL (50 mg/mL)', concMgMl: 50, ampMl: 2 },
      { label: '500 mg/10 mL (50 mg/mL)', concMgMl: 50, ampMl: 10 }
    ]
  },
  {
    id: 'rocuronio',
    name: 'Rocurônio',
    cat: 'bnm',
    catLabel: 'BNM não despolarizante',
    doseDefault: 1.2,
    doseRange: '1–1,2',
    unit: 'mg/kg',
    dilution: 'Puro IV · início ~60 s · duração ~45–60 min',
    presentations: [
      { label: '10 mg/mL — ampola 5 mL (50 mg)', concMgMl: 10, ampMl: 5 },
      { label: '10 mg/mL — frasco 10 mL (100 mg)', concMgMl: 10, ampMl: 10 }
    ]
  }
];

function rsiFormatNum (n, dec) {
  return Number(n.toFixed(dec)).toString().replace('.', ',');
}

function rsiComputeDrugDose (drug, peso, dosePerKg, pres) {
  if (drug.unit === 'mcg/kg') {
    let mcg = peso * dosePerKg;
    if (drug.maxDoseMcg) mcg = Math.min(mcg, drug.maxDoseMcg);
    const volumeMl = mcg / pres.concMcgMl;
    const amps = Math.ceil(volumeMl / pres.ampMl);
    return {
      doseLabel: `${rsiFormatNum(mcg, 0)} mcg`,
      volumeMl: rsiFormatNum(volumeMl, 2),
      ampNote: volumeMl > pres.ampMl * 0.01
        ? `≈ ${amps} ampola${amps > 1 ? 's' : ''} (${pres.ampMl} mL cada)`
        : ''
    };
  }

  let mg = peso * dosePerKg;
  if (drug.maxDoseMg) mg = Math.min(mg, drug.maxDoseMg);
  const volumeMl = mg / pres.concMgMl;
  const amps = Math.ceil(volumeMl / pres.ampMl);
  return {
    doseLabel: `${rsiFormatNum(mg, 1)} mg`,
    volumeMl: rsiFormatNum(volumeMl, 2),
    ampNote: volumeMl > pres.ampMl * 0.01
      ? `≈ ${amps} ampola${amps > 1 ? 's' : ''} (${pres.ampMl} mL cada)`
      : ''
  };
}

function rsiDrugListHtml (rows, prefix) {
  if (!rows.length) return '';
  return rows.map(r => `${prefix}${r.drug.name} ${r.calc.doseLabel} (${r.calc.volumeMl} mL)`).join(' · ');
}

function rsiFlowHtmlRsi (preRows, indRows, bnmRows) {
  const pre = rsiDrugListHtml(preRows, '');
  const ind = rsiDrugListHtml(indRows, '');
  const bnm = rsiDrugListHtml(bnmRows, '');

  return `<div class="rsi-flow-result">
            <h4 class="rsi-result-title">Fluxo — Sequência rápida (RSI)</h4>
            <div class="emerg-flow-v">
              <span class="emerg-flow-step emerg-flow-shock"><strong>1. PREPARE</strong></span>
              <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
              <span class="emerg-flow-step">Monitor · aspirador · tubos ±1 · SGA · plano B/C</span>
              <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
              <span class="emerg-flow-step emerg-flow-shock"><strong>2. Pré-oxigenação</strong> — O₂ 100% 3–5 min ou 8 VC · SpO₂ &gt; 95%</span>
              <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
              ${pre ? `<span class="emerg-flow-step emerg-flow-shock"><strong>3. Pré-tratamento</strong> — ${pre}</span>
              <span class="emerg-flow-arrow" aria-hidden="true">↓</span>` : `<span class="emerg-flow-step"><strong>3. Pré-tratamento</strong> — omitido neste plano</span>
              <span class="emerg-flow-arrow" aria-hidden="true">↓</span>`}
              <span class="emerg-flow-step emerg-flow-shock"><strong>4. Indução + BNM</strong> — ${ind} + ${bnm}</span>
              <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
              <span class="emerg-flow-step"><strong>Sem BVM</strong> entre indução e laringoscopia (exceto se SpO₂ &lt; 90%)</span>
              <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
              <span class="emerg-flow-step emerg-flow-shock"><strong>5. Posicionamento</strong> — sniffing / ramp</span>
              <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
              <span class="emerg-flow-step emerg-flow-shock"><strong>6. IOT + capnografia</strong></span>
              <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
              <span class="emerg-flow-step emerg-flow-shock"><strong>7. Pós-IOT</strong> — ventilador · sedação · Rx · DOPE se dessaturação</span>
            </div>
          </div>`;
}

function rsiFlowHtmlPreox (preRows, indRows, bnmRows) {
  const pre = rsiDrugListHtml(preRows, '');
  const ind = rsiDrugListHtml(indRows, '');
  const bnm = rsiDrugListHtml(bnmRows, '');

  return `<div class="rsi-flow-result">
            <h4 class="rsi-result-title">Fluxo — Pré-oxigenação reforçada</h4>
            <div class="emerg-flow-v">
              <span class="emerg-flow-step emerg-flow-shock"><strong>1. PREPARE</strong></span>
              <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
              <span class="emerg-flow-step">Monitor · aspirador · tubos ±1 · SGA · plano B/C</span>
              <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
              <span class="emerg-flow-step emerg-flow-shock"><strong>2. Pré-oxigenação reforçada</strong></span>
              <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
              <span class="emerg-flow-step">O₂ 100% ≥ 3 min <strong>ou</strong> 8 ventilações de capacidade vital · meta SpO₂ &gt; 95%</span>
              <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
              <span class="emerg-flow-step emerg-flow-shock"><strong>Oxigenação apneica</strong> — CNAF 40–60 L/min ou O₂ 15 L/min via cateter nasal <strong>durante</strong> laryngoscopia</span>
              <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
              ${pre ? `<span class="emerg-flow-step emerg-flow-shock"><strong>3. Pré-tratamento</strong> — ${pre}</span>
              <span class="emerg-flow-arrow" aria-hidden="true">↓</span>` : `<span class="emerg-flow-step"><strong>3. Pré-tratamento</strong> — omitido neste plano</span>
              <span class="emerg-flow-arrow" aria-hidden="true">↓</span>`}
              <span class="emerg-flow-step emerg-flow-shock"><strong>4. Indução + BNM</strong> — ${ind} + ${bnm}</span>
              <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
              <span class="emerg-flow-step"><strong>Se SpO₂ &lt; 90%</strong> → ventilar com BVM antes de retomar tentativa</span>
              <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
              <span class="emerg-flow-step emerg-flow-shock"><strong>5. Posicionamento + IOT + capnografia</strong></span>
              <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
              <span class="emerg-flow-step emerg-flow-shock"><strong>6. Pós-IOT</strong> — ventilador · sedação · Rx · DOPE se dessaturação</span>
            </div>
          </div>`;
}
