/* Calculadoras — Farmacologia & Dose */

function fNum (form, name) {
  const v = parseFloat(form[name]?.value);
  return Number.isFinite(v) ? v : NaN;
}

function fChk (form, name) {
  return !!form[name]?.checked;
}

function fSel (form, name) {
  return form[name]?.value ?? '';
}

const RENAL_DRUG_LIB = {
  metformina: {
    label: 'Metformina',
    adjust (clcr) {
      if (clcr < 30) return 'Contraindicado (risco de acidose lática)';
      if (clcr < 45) return 'Não iniciar; se em uso: máx 1000 mg/d e monitorar';
      if (clcr < 60) return 'Usar com cautela; ajustar conforme resposta';
      return 'Dose plena usual';
    }
  },
  gabapentina: {
    label: 'Gabapentina',
    adjust (clcr) {
      if (clcr >= 60) return '900–3600 mg/d divididos (dose plena)';
      if (clcr >= 30) return '400–1400 mg/d';
      if (clcr >= 15) return '200–700 mg/d';
      return '100–300 mg/d';
    }
  },
  enoxaparina: {
    label: 'Enoxaparina profilática',
    adjust (clcr) {
      if (clcr < 15) return 'Evitar ou dose reduzida com anti-Xa — alto risco sangramento';
      if (clcr < 30) return 'Profilaxia: 20 mg SC 1×/dia (não 40 mg); ajustar terapêutica';
      return '40 mg SC 1×/dia (profilaxia padrão)';
    }
  },
  morfina: {
    label: 'Morfina (oral)',
    adjust (clcr) {
      if (clcr < 10) return 'Evitar ou reduzir 25–50%; metabolitos acumulam';
      if (clcr < 50) return 'Reduzir dose inicial 25–50%; intervalo maior';
      return 'Dose padrão';
    }
  },
  digoxina: {
    label: 'Digoxina',
    adjust (clcr) {
      if (clcr < 15) return 'Dose de manutenção ~62,5–125 µg/d; monitorar nível';
      if (clcr < 50) return 'Reduzir dose de manutenção ~50%; monitorar';
      return '125–250 µg/d usual (ajustar por nível)';
    }
  },
  aciclovir: {
    label: 'Aciclovir IV',
    adjust (clcr) {
      if (clcr >= 50) return 'Dose padrão (ex.: 5–10 mg/kg 8/8 h)';
      if (clcr >= 25) return '5 mg/kg 12/12 h';
      if (clcr >= 10) return '5 mg/kg 24/24 h';
      return '2,5 mg/kg 24/24 h';
    }
  },
  levofloxacino: {
    label: 'Levofloxacino',
    adjust (clcr) {
      if (clcr >= 50) return '500 mg 24/24 h (padrão)';
      if (clcr >= 20) return '500 mg dose inicial, depois 250 mg 24/24 h';
      return '500 mg dose inicial, depois 250 mg 48/48 h';
    }
  },
  nitrofurantoin: {
    label: 'Nitrofurantoína',
    adjust (clcr) {
      if (clcr < 60) return 'Ineficaz/contraindicado para ITU sistêmica; evitar se CrCl &lt;60';
      return '100 mg 12/12 h (ITU não complicada)';
    }
  },
  amoxicilina: {
    label: 'Amoxicilina',
    adjust (clcr) {
      if (clcr >= 30) return '500 mg 8/8 h (padrão)';
      if (clcr >= 10) return '500 mg 12/12 h';
      return '500 mg 24/24 h (máx 1–2 g/d)';
    }
  }
};

const CALC_FARMA = {
  'dose-infusion-ped': {
    title: 'Dose por kg — infusão pediátrica',
    html: `
      <label>Modo</label>
      <select name="modo" required>
        <option value="bolus">Bolus (mg/kg por dose)</option>
        <option value="inf">Infusão contínua (mcg/kg/min)</option>
      </select>
      <label>Peso (kg)</label>
      <input name="peso" type="number" step="0.01" min="0.1" required>
      <label id="farma-dose-label">Dose (mg/kg)</label>
      <input name="dose" type="number" step="0.001" min="0" required>
      <label>Concentração da solução</label>
      <input name="conc" type="number" step="0.01" min="0.01" required>
      <label>Unidade concentração</label>
      <select name="concUnit">
        <option value="mgml">mg/mL</option>
        <option value="mcgml">mcg/mL</option>
      </select>
      <label>Intervalo entre doses (h) — bolus</label>
      <input name="intervalo" type="number" step="0.5" min="0" placeholder="Ex.: 8">
    `,
    onRender (form) {
      const modo = form.querySelector('[name="modo"]');
      const label = form.querySelector('#farma-dose-label');
      const intervalo = form.querySelector('[name="intervalo"]');
      function refresh () {
        const inf = modo.value === 'inf';
        label.textContent = inf ? 'Taxa (mcg/kg/min)' : 'Dose (mg/kg)';
        intervalo.parentElement.style.display = inf ? 'none' : '';
      }
      modo.addEventListener('change', refresh);
      refresh();
    },
    calculate (form) {
      const peso = fNum(form, 'peso');
      const dose = fNum(form, 'dose');
      const conc = fNum(form, 'conc');
      if (![peso, dose, conc].every(Number.isFinite)) return alert('Preencha peso, dose e concentração.');

      const mcgMl = fSel(form, 'concUnit') === 'mgml' ? conc * 1000 : conc;

      if (fSel(form, 'modo') === 'inf') {
        const mcgMin = dose * peso;
        const mlH = (mcgMin * 60) / mcgMl;
        return `<p><strong>Taxa:</strong> ${dose} mcg/kg/min = ${mcgMin.toFixed(1)} mcg/min total</p>
                <p><strong>Velocidade de infusão:</strong> ${mlH.toFixed(2)} mL/h</p>
                <p class="calc-note">Verificar concentração preparada pela farmácia; dupla checagem em drogas vasoativas.</p>`;
      }

      const totalMg = dose * peso;
      const concMgMl = fSel(form, 'concUnit') === 'mgml' ? conc : conc / 1000;
      const volMl = totalMg / concMgMl;
      let html = `<p><strong>Dose total:</strong> ${totalMg.toFixed(2)} mg</p>
                  <p><strong>Volume por dose:</strong> ${volMl.toFixed(2)} mL</p>`;
      const intv = fNum(form, 'intervalo');
      if (Number.isFinite(intv) && intv > 0) {
        html += `<p><strong>Dose diária aproximada:</strong> ${(totalMg * 24 / intv).toFixed(1)} mg/d (${(24 / intv).toFixed(0)} doses)</p>`;
      }
      return html + `<p class="calc-note">Pediatria: confirmar dose máxima por bula/protocolo institucional.</p>`;
    }
  },

  'insulina-correcao': {
    title: 'Insulina corrente — correção de glicemia',
    html: `
      <label>Glicemia atual (mg/dL)</label>
      <input name="atual" type="number" step="1" min="1" required>
      <label>Glicemia alvo (mg/dL)</label>
      <input name="alvo" type="number" step="1" value="140" required>
      <label>Dose diária total de insulina (TDD, UI/d) — opcional</label>
      <input name="tdd" type="number" step="0.5" min="0" placeholder="Calcula fator 1800/TDD">
      <label>Fator de sensibilidade (mg/dL por UI) — se não informar TDD</label>
      <input name="isf" type="number" step="1" min="1" placeholder="Ex.: 50">
    `,
    calculate (form) {
      const atual = fNum(form, 'atual');
      const alvo = fNum(form, 'alvo');
      if (!Number.isFinite(atual) || !Number.isFinite(alvo)) return alert('Informe glicemias.');

      let isf = fNum(form, 'isf');
      const tdd = fNum(form, 'tdd');
      if (!Number.isFinite(isf) && Number.isFinite(tdd) && tdd > 0) isf = 1800 / tdd;
      if (!Number.isFinite(isf)) isf = 50;

      const delta = atual - alvo;
      if (delta <= 0) {
        return `<p><strong>Glicemia no alvo ou abaixo.</strong> Não corrigir para cima; avaliar hipoglicemia se &lt;70.</p>`;
      }

      const ui = delta / isf;
      const uiArred = Math.round(ui * 2) / 2;

      return `<p><strong>Fator de sensibilidade (ISF):</strong> ${isf.toFixed(0)} mg/dL/UI</p>
              <p><strong>Correção sugerida:</strong> ${ui.toFixed(1)} UI → arredondar ${uiArred} UI</p>
              <p><strong>Fórmula:</strong> (Glicemia ${atual} − Alvo ${alvo}) / ISF</p>
              <p class="calc-note">Regra 1800/TDD para insulina regular/análoga de ação rápida. Somar à dose de refeição se aplicável.</p>`;
    }
  },

  'opioide-conv': {
    title: 'Conversor de opioides',
    html: `
      <label>Opioide de origem</label>
      <select name="de" required>
        <option value="morphine-po">Morfina VO</option>
        <option value="oxycodone-po">Oxicodona VO</option>
        <option value="fentanyl-patch">Fentanil transdérmico (mcg/h)</option>
        <option value="fentanyl-iv">Fentanil IV/SC (mcg/dose)</option>
      </select>
      <label>Dose de origem</label>
      <input name="doseDe" type="number" step="0.01" min="0" required>
      <label>Converter para</label>
      <select name="para" required>
        <option value="morphine-po">Morfina VO/dia</option>
        <option value="oxycodone-po">Oxicodona VO/dia</option>
        <option value="fentanyl-patch">Fentanil transdérmico (mcg/h)</option>
      </select>
    `,
    calculate (form) {
      const doseDe = fNum(form, 'doseDe');
      if (!Number.isFinite(doseDe)) return alert('Informe a dose de origem.');

      const de = fSel(form, 'de');
      let mme;
      if (de === 'morphine-po') mme = doseDe;
      else if (de === 'oxycodone-po') mme = doseDe * 1.5;
      else if (de === 'fentanyl-patch') mme = doseDe * 2.4;
      else mme = doseDe * 0.1 * 3;

      const para = fSel(form, 'para');
      let result = 0;
      let unit = '';
      if (para === 'morphine-po') { result = mme; unit = 'mg/d VO'; }
      else if (para === 'oxycodone-po') { result = mme / 1.5; unit = 'mg/d VO'; }
      else if (para === 'fentanyl-patch') { result = mme / 2.4; unit = 'mcg/h transdérmico'; }

      return `<p><strong>MME (equivalente morfina):</strong> ${mme.toFixed(1)} mg/d</p>
              <p><strong>Dose convertida:</strong> ${result.toFixed(1)} ${unit}</p>
              <p class="calc-note">Reduzir 25–50% ao rotacionar opioides. CDC MME; fentanil IV = dose única convertida aproximada.</p>`;
    }
  },

  gotejamento: {
    title: 'Calculadora de gotejamento',
    html: `
      <label>Modo</label>
      <select name="modo" required>
        <option value="vol">Volume + tempo → gtt/min</option>
        <option value="mlh">mL/h → gtt/min</option>
      </select>
      <label>Volume total (mL)</label>
      <input name="vol" type="number" step="0.1" min="0">
      <label>Tempo (minutos)</label>
      <input name="tempo" type="number" step="1" min="1">
      <label>Velocidade (mL/h)</label>
      <input name="mlh" type="number" step="0.1" min="0">
      <label>Fator de gotejamento</label>
      <select name="fator" required>
        <option value="60">Microgotas — 60 gtt/mL</option>
        <option value="20">Macrogotas — 20 gtt/mL</option>
        <option value="15">Macrogotas — 15 gtt/mL</option>
      </select>
    `,
    calculate (form) {
      const fator = parseInt(fSel(form, 'fator'), 10);
      let mlH;

      if (fSel(form, 'modo') === 'vol') {
        const vol = fNum(form, 'vol');
        const tempo = fNum(form, 'tempo');
        if (!Number.isFinite(vol) || !Number.isFinite(tempo) || tempo <= 0) {
          return alert('Informe volume e tempo.');
        }
        mlH = (vol / tempo) * 60;
      } else {
        mlH = fNum(form, 'mlh');
        if (!Number.isFinite(mlH)) return alert('Informe mL/h.');
      }

      const gttMin = (mlH * fator) / 60;
      const tipo = fator === 60 ? 'microgotas' : 'macrogotas';

      return `<p><strong>Velocidade:</strong> ${mlH.toFixed(1)} mL/h</p>
              <p><strong>Gotejamento:</strong> ${gttMin.toFixed(0)} gtt/min (${tipo}, ${fator} gtt/mL)</p>
              <p class="calc-note">Gotas/min = (mL/h × fator) / 60. Confirmar fator do equipo utilizado.</p>`;
    }
  },

  'clcr-dose': {
    title: 'ClCr & ajuste de dose renal',
    wide: true,
    html: `
      <label>Fármaco</label>
      <select name="droga" required>
        ${Object.entries(RENAL_DRUG_LIB).map(([k, v]) => `<option value="${k}">${v.label}</option>`).join('')}
      </select>
      <label>Ou informe ClCr diretamente (mL/min)</label>
      <input name="clcrDirect" type="number" step="0.1" min="0" placeholder="Opcional">
      <fieldset class="calc-fieldset">
        <legend>Cockcroft-Gault (se ClCr não informado)</legend>
        <label>Idade (anos)</label>
        <input name="idade" type="number" min="1">
        <label>Peso (kg)</label>
        <input name="peso" type="number" step="0.1">
        <label>Creatinina (mg/dL)</label>
        <input name="creat" type="number" step="0.01">
        <label>Sexo</label>
        <select name="sexo">
          <option value="M">Masculino</option>
          <option value="F">Feminino</option>
        </select>
      </fieldset>
    `,
    calculate (form) {
      let clcr = fNum(form, 'clcrDirect');
      if (!Number.isFinite(clcr)) {
        const idade = fNum(form, 'idade');
        const peso = fNum(form, 'peso');
        const creat = fNum(form, 'creat');
        if (![idade, peso, creat].every(Number.isFinite)) {
          return alert('Informe ClCr ou dados para Cockcroft-Gault.');
        }
        clcr = ((140 - idade) * peso) / (72 * creat);
        if (fSel(form, 'sexo') === 'F') clcr *= 0.85;
      }

      const drug = RENAL_DRUG_LIB[fSel(form, 'droga')];
      const ajuste = drug.adjust(clcr);

      return `<p><strong>ClCr (Cockcroft-Gault):</strong> ${clcr.toFixed(1)} mL/min</p>
              <p><strong>${drug.label}:</strong> ${ajuste}</p>
              <p class="calc-note">Biblioteca simplificada — confirmar na bula/SMR local.</p>`;
    }
  },

  interacoes: {
    title: 'Alertas — interações medicamentosas',
    html: `
      <fieldset class="calc-fieldset">
        <legend>Selecione combinações presentes</legend>
        <label class="calc-check"><input type="checkbox" name="metronidazol"> Metronidazol / tinidazol</label>
        <label class="calc-check"><input type="checkbox" name="alcool"> Álcool (ingestão recente ou crônica)</label>
        <label class="calc-check"><input type="checkbox" name="isrs"> ISRS (fluoxetina, sertralina, paroxetina, etc.)</label>
        <label class="calc-check"><input type="checkbox" name="triptano"> Triptano (sumatriptano, rizatriptano, etc.)</label>
        <label class="calc-check"><input type="checkbox" name="imao"> IMAO / linezolida</label>
        <label class="calc-check"><input type="checkbox" name="tramadol"> Tramadol</label>
      </fieldset>
    `,
    calculate (form) {
      const alerts = [];

      if (fChk(form, 'metronidazol') && fChk(form, 'alcool')) {
        alerts.push({
          sev: 'Grave',
          txt: 'Metronidazol + álcool — reação tipo dissulfiram (náusea, rubor, taquicardia). Evitar álcool durante e até 48–72 h após o fim do metronidazol.'
        });
      }

      if (fChk(form, 'isrs') && fChk(form, 'triptano')) {
        alerts.push({
          sev: 'Moderada a grave',
          txt: 'ISRS + triptano — risco de síndrome serotoninérgica. Evitar associação ou intervalo mínimo 24 h; monitorar.'
        });
      }

      if (fChk(form, 'isrs') && fChk(form, 'tramadol')) {
        alerts.push({
          sev: 'Moderada',
          txt: 'ISRS + tramadol — risco de síndrome serotoninérgica e convulsões. Preferir analgesia alternativa.'
        });
      }

      if (fChk(form, 'isrs') && fChk(form, 'imao')) {
        alerts.push({
          sev: 'Grave',
          txt: 'ISRS + IMAO/linezolida — contraindicado (washout 2–5 semanas conforme ISRS). Risco serotoninérgico fatal.'
        });
      }

      if (!alerts.length) {
        return `<p><strong>Nenhuma interação selecionada</strong> da biblioteca atual.</p>
                <p class="calc-note">Ferramenta educativa — consultar Micromedex ou farmácia clínica para interações completas.</p>`;
      }

      return alerts.map(a => `<p><strong>${a.sev}:</strong> ${a.txt}</p>`).join('') +
        `<p class="calc-note">Alertas principais solicitados. Revisar prescrição completa do paciente.</p>`;
    }
  }
};
