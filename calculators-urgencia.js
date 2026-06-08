/* Calculadoras — Urgência & Trauma */

function uNum (form, name) {
  const v = parseFloat(form[name]?.value);
  return Number.isFinite(v) ? v : NaN;
}

function uChk (form, name) {
  return !!form[name]?.checked;
}

function uSel (form, name) {
  return form[name]?.value ?? '';
}

function codeGcs (gcs) {
  if (gcs <= 3) return 0;
  if (gcs <= 5) return 1;
  if (gcs <= 8) return 2;
  if (gcs <= 12) return 3;
  return 4;
}

function codeSbp (sbp) {
  if (sbp <= 0) return 0;
  if (sbp < 50) return 1;
  if (sbp <= 75) return 2;
  if (sbp <= 89) return 3;
  return 4;
}

function codeRr (rr) {
  if (rr <= 0) return 0;
  if (rr <= 5) return 1;
  if (rr <= 9) return 2;
  if (rr <= 29) return 3;
  return 4;
}

const CALC_URGENCIA = {
  gcs: {
    title: 'Glasgow Coma Scale (adulto & pediátrico)',
    html: `
      <label>Modo</label>
      <select name="modo" required>
        <option value="adulto">Adulto</option>
        <option value="ped">Pediátrico (&lt;4–5 anos)</option>
      </select>
      <label>Abertura ocular (E)</label>
      <select name="eye" required>
        <option value="4">4 — espontânea</option>
        <option value="3">3 — à voz</option>
        <option value="2">2 — à dor</option>
        <option value="1">1 — ausente</option>
      </select>
      <label id="gcs-verbal-label">Resposta verbal (V)</label>
      <select name="verbal" id="gcs-verbal" required></select>
      <label>Resposta motora (M)</label>
      <select name="motor" required>
        <option value="6">6 — obedece comandos</option>
        <option value="5">5 — localiza dor</option>
        <option value="4">4 — retirada à dor</option>
        <option value="3">3 — flexão anormal (decorticação)</option>
        <option value="2">2 — extensão (descerebração)</option>
        <option value="1">1 — ausente</option>
      </select>
    `,
    onRender (form) {
      const modo = form.querySelector('[name="modo"]');
      const verbal = form.querySelector('#gcs-verbal');
      const label = form.querySelector('#gcs-verbal-label');

      function refresh () {
        if (modo.value === 'ped') {
          label.textContent = 'Resposta verbal pediátrica (V)';
          verbal.innerHTML = `
            <option value="5">5 — balbucia/sorri/orientado</option>
            <option value="4">4 — choro consolável</option>
            <option value="3">3 — choro inconsolável</option>
            <option value="2">2 — gemido à dor</option>
            <option value="1">1 — ausente</option>`;
        } else {
          label.textContent = 'Resposta verbal (V)';
          verbal.innerHTML = `
            <option value="5">5 — orientado</option>
            <option value="4">4 — confuso</option>
            <option value="3">3 — palavras inapropriadas</option>
            <option value="2">2 — sons incompreensíveis</option>
            <option value="1">1 — ausente</option>`;
        }
      }
      modo.addEventListener('change', refresh);
      refresh();
    },
    calculate (form) {
      const e = parseInt(uSel(form, 'eye'), 10);
      const v = parseInt(uSel(form, 'verbal'), 10);
      const m = parseInt(uSel(form, 'motor'), 10);
      const total = e + v + m;

      let interp = total >= 13
        ? 'TCE leve (GCS 13–15)'
        : total >= 9
          ? 'TCE moderado (GCS 9–12) — monitorização intensiva'
          : 'TCE grave (GCS ≤8) — considerar via aérea definitiva e neurocirurgia';

      return `<p><strong>GCS:</strong> E${e} V${v} M${m} = ${total}</p>
              <p><strong>Interpretação:</strong> ${interp}</p>
              <p class="calc-note">Teasdale &amp; Jennett. Versão pediátrica modificada para resposta verbal em lactentes/pré-escolares.</p>`;
    }
  },

  rts: {
    title: 'Revised Trauma Score (RTS)',
    html: `
      <label>GCS total</label>
      <input name="gcs" type="number" min="3" max="15" required>
      <label>PAS (mmHg)</label>
      <input name="pas" type="number" min="0" required>
      <label>Frequência respiratória (irpm)</label>
      <input name="fr" type="number" min="0" required>
    `,
    calculate (form) {
      const gcs = uNum(form, 'gcs');
      const pas = uNum(form, 'pas');
      const fr = uNum(form, 'fr');
      if (![gcs, pas, fr].every(Number.isFinite)) return alert('Preencha GCS, PAS e FR.');

      const rts = 0.9368 * codeGcs(gcs) + 0.7326 * codeSbp(pas) + 0.2908 * codeRr(fr);
      const rtsWeighted = (0.9368 * gcs) + (0.7326 * pas) + (0.2908 * fr);

      let interp = rts >= 7.84
        ? 'RTS codificado ≥7,84 — mortalidade traumática baixa (~4%)'
        : rts >= 6
          ? 'RTS intermediário — risco moderado'
          : 'RTS baixo — alto risco de mortalidade; ATLS/priorização';

      return `<p><strong>RTS (codificado):</strong> ${rts.toFixed(3)}</p>
              <p><strong>RTS (valores brutos):</strong> ${rtsWeighted.toFixed(2)}</p>
              <p><strong>Interpretação:</strong> ${interp}</p>
              <p class="calc-note">Champion et al. Usado em TRISS com ISS. Valores codificados 0–4 por variável.</p>`;
    }
  },

  iss: {
    title: 'ISS / AIS — Trauma',
    wide: true,
    html: `
      <p class="calc-note">Informe o AIS máximo (0–6) por região. ISS = soma dos quadrados dos 3 maiores AIS em regiões distintas.</p>
      <label>Cabeça / pescoço</label>
      <input name="head" type="number" min="0" max="6" step="1" value="0" required>
      <label>Face</label>
      <input name="face" type="number" min="0" max="6" step="1" value="0" required>
      <label>Tórax</label>
      <input name="chest" type="number" min="0" max="6" step="1" value="0" required>
      <label>Abdome / pelve</label>
      <input name="abd" type="number" min="0" max="6" step="1" value="0" required>
      <label>Extremidades</label>
      <input name="ext" type="number" min="0" max="6" step="1" value="0" required>
      <label>Lesões externas</label>
      <input name="exte" type="number" min="0" max="6" step="1" value="0" required>
    `,
    calculate (form) {
      const regions = ['head', 'face', 'chest', 'abd', 'ext', 'exte'].map(k => {
        const v = parseInt(form[k]?.value, 10);
        return Number.isFinite(v) ? Math.min(Math.max(v, 0), 6) : 0;
      });

      const sorted = [...regions].sort((a, b) => b - a);
      const iss = sorted[0] ** 2 + sorted[1] ** 2 + sorted[2] ** 2;

      let interp = iss >= 75
        ? 'ISS 75 — lesão incompatível com vida (AIS 6)'
        : iss >= 25
          ? 'ISS ≥25 — politrauma grave'
          : iss >= 16
            ? 'ISS ≥16 — trauma significativo; centro de trauma'
            : 'ISS &lt;16 — trauma moderado a leve';

      return `<p><strong>ISS:</strong> ${iss}/75</p>
              <p><strong>AIS por região:</strong> ${regions.join(' | ')}</p>
              <p><strong>Interpretação:</strong> ${interp}</p>
              <p class="calc-note">Abbreviated Injury Scale (AAAM). ISS usa os 3 piores scores em regiões diferentes.</p>`;
    }
  },

  'nexus-cspine': {
    title: 'NEXUS & Canadian C-Spine Rules',
    wide: true,
    html: `
      <fieldset class="calc-fieldset">
        <legend>NEXUS — baixo risco se TODOS presentes</legend>
        <label class="calc-check"><input type="checkbox" name="nx1" checked> Sem dor linha média cervical</label>
        <label class="calc-check"><input type="checkbox" name="nx2" checked> Sem déficit neurológico focal</label>
        <label class="calc-check"><input type="checkbox" name="nx3" checked> Alerta</label>
        <label class="calc-check"><input type="checkbox" name="nx4" checked> Sem intoxicação</label>
        <label class="calc-check"><input type="checkbox" name="nx5" checked> Sem lesão distraindo</label>
      </fieldset>
      <fieldset class="calc-fieldset">
        <legend>Canadian C-Spine Rule</legend>
        <label class="calc-check"><input type="checkbox" name="ccHigh1"> Idade ≥65 (alto risco)</label>
        <label class="calc-check"><input type="checkbox" name="ccHigh2"> Mecanismo perigoso</label>
        <label class="calc-check"><input type="checkbox" name="ccHigh3"> Parestesias extremidades</label>
        <label class="calc-check"><input type="checkbox" name="ccLow1" checked> Colisão traseira simples</label>
        <label class="calc-check"><input type="checkbox" name="ccLow2" checked> Sentada no PS</label>
        <label class="calc-check"><input type="checkbox" name="ccLow3" checked> Deambulou no PS</label>
        <label class="calc-check"><input type="checkbox" name="ccLow4" checked> Dor &gt;6 h pós-trauma</label>
        <label class="calc-check"><input type="checkbox" name="ccLow5" checked> Sem dor linha média</label>
      </fieldset>
    `,
    calculate (form) {
      const nexusOk = ['nx1', 'nx2', 'nx3', 'nx4', 'nx5'].every(k => uChk(form, k));
      const highRisk = uChk(form, 'ccHigh1') || uChk(form, 'ccHigh2') || uChk(form, 'ccHigh3');
      const lowRisk = ['ccLow1', 'ccLow2', 'ccLow3', 'ccLow4', 'ccLow5'].every(k => uChk(form, k));

      const nexusTxt = nexusOk
        ? 'NEXUS negativo — radiografia não necessária (Sens ~99%)'
        : 'NEXUS positivo — indicar imagem cervical';

      const ccTxt = highRisk
        ? 'Canadian: alto risco — indicar TC/radiografia'
        : lowRisk
          ? 'Canadian: baixo risco — imagem dispensável'
          : 'Canadian: baixo risco incompleto — considerar imagem';

      const conduta = nexusOk && lowRisk && !highRisk
        ? 'Regras concordantes — coluna pode não ser investigada'
        : 'Investigar coluna cervical conforme protocolo';

      return `<p><strong>NEXUS:</strong> ${nexusTxt}</p>
              <p><strong>Canadian C-Spine:</strong> ${ccTxt}</p>
              <p><strong>Conduta:</strong> ${conduta}</p>
              <p class="calc-note">Hoffman NEXUS, 2000; Stiell CCR, 2003. GCS 15 e mecanismo elegível.</p>`;
    }
  },

  pecarn: {
    title: 'PECARN — TCE pediátrico',
    wide: true,
    html: `
      <label>Idade</label>
      <select name="idade" required>
        <option value="lt2">&lt;2 anos</option>
        <option value="ge2">≥2 anos</option>
      </select>
      <fieldset class="calc-fieldset">
        <legend>Alto risco — TC indicada</legend>
        <label class="calc-check"><input type="checkbox" name="hr1"> GCS &lt;15</label>
        <label class="calc-check"><input type="checkbox" name="hr2"> Alteração do nível de consciência</label>
        <label class="calc-check"><input type="checkbox" name="hr3"> Fratura palpável ou sinais de base de crânio</label>
      </fieldset>
      <fieldset class="calc-fieldset">
        <legend>Risco intermediário</legend>
        <label class="calc-check"><input type="checkbox" name="ir1" id="pecarn-ir1"> Hematoma occipital/parietal/temporal (&lt;2a)</label>
        <label class="calc-check"><input type="checkbox" name="ir2"> LOC &gt;5 s ou mecanismo grave</label>
        <label class="calc-check"><input type="checkbox" name="ir3" id="pecarn-ir3"> <span id="pecarn-ir3-txt">Comportamento anormal (pais)</span></label>
        <label class="calc-check"><input type="checkbox" name="ir4" id="pecarn-ir4"> História de LOC (≥2a)</label>
      </fieldset>
    `,
    onRender (form) {
      const idade = form.querySelector('[name="idade"]');
      const ir1 = form.querySelector('#pecarn-ir1');
      const ir4 = form.querySelector('#pecarn-ir4');
      const ir3txt = form.querySelector('#pecarn-ir3-txt');

      function refresh () {
        const lt2 = idade.value === 'lt2';
        ir1.parentElement.style.display = lt2 ? '' : 'none';
        ir4.parentElement.style.display = lt2 ? 'none' : '';
        ir3txt.textContent = lt2
          ? 'Comportamento não normal (pais)'
          : 'Cefaleia importante ou vômitos';
      }
      idade.addEventListener('change', refresh);
      refresh();
    },
    calculate (form) {
      const lt2 = uSel(form, 'idade') === 'lt2';
      const high = uChk(form, 'hr1') || uChk(form, 'hr2') || uChk(form, 'hr3');
      let inter = uChk(form, 'ir2');
      if (lt2) inter = inter || uChk(form, 'ir1') || uChk(form, 'ir3');
      else inter = inter || uChk(form, 'ir3') || uChk(form, 'ir4');

      const conduta = high
        ? 'Alto risco — realizar TC de crânio'
        : inter
          ? 'Intermediário — decisão compartilhada (observação vs TC)'
          : 'Baixo risco — TC não indicada (VPN &gt;99% neurocirurgia)';

      return `<p><strong>Faixa:</strong> ${lt2 ? '&lt;2 anos' : '≥2 anos'}</p>
              <p><strong>Risco:</strong> ${high ? 'Alto' : inter ? 'Intermediário' : 'Baixo'}</p>
              <p><strong>Conduta:</strong> ${conduta}</p>
              <p class="calc-note">Kuppermann PECARN, Lancet 2009. GCS 14–15 na avaliação.</p>`;
    }
  },

  lrnec: {
    title: 'LRINEC — fasceíte necrosante',
    html: `
      <label>PCR (mg/L)</label>
      <input name="pcr" type="number" step="0.1" min="0" required>
      <label>Leucócitos (×10³/µL)</label>
      <input name="wbc" type="number" step="0.1" min="0" required>
      <label>Hemoglobina (g/dL)</label>
      <input name="hb" type="number" step="0.1" min="0" required>
      <label>Sódio (mEq/L)</label>
      <input name="na" type="number" step="0.1" required>
      <label>Creatinina (mg/dL)</label>
      <input name="cr" type="number" step="0.01" min="0" required>
      <label>Glicose (mg/dL)</label>
      <input name="glic" type="number" step="0.1" min="0" required>
    `,
    calculate (form) {
      const pcr = uNum(form, 'pcr');
      const wbc = uNum(form, 'wbc');
      const hb = uNum(form, 'hb');
      const na = uNum(form, 'na');
      const cr = uNum(form, 'cr');
      const glic = uNum(form, 'glic');
      if (![pcr, wbc, hb, na, cr, glic].every(Number.isFinite)) return alert('Preencha todos os campos.');

      let score = 0;
      if (pcr > 150) score += 4;
      if (wbc > 25) score += 2;
      else if (wbc >= 15) score += 1;
      if (hb < 11) score += 2;
      else if (hb <= 13.5) score += 1;
      if (na < 135) score += 2;
      if (cr > 1.6) score += 2;
      if (glic > 180) score += 1;

      const interp = score >= 8
        ? 'LRINEC ≥8 — alta probabilidade; cirurgia urgente'
        : score >= 6
          ? 'LRINEC ≥6 — risco moderado-alto'
          : 'LRINEC &lt;6 — FN menos provável (não excluir clínica)';

      return `<p><strong>LRINEC:</strong> ${score}/13</p>
              <p><strong>Interpretação:</strong> ${interp}</p>
              <p class="calc-note">Wong et al., 2004. Diagnóstico clínico-cirúrgico prevalece.</p>`;
    }
  },

  'alvarado-air': {
    title: 'Alvarado & AIR — apendicite',
    wide: true,
    html: `
      <fieldset class="calc-fieldset">
        <legend>Alvarado (MANTRELS)</legend>
        <label class="calc-check"><input type="checkbox" name="a1"> Migração FID (+1)</label>
        <label class="calc-check"><input type="checkbox" name="a2"> Anorexia (+1)</label>
        <label class="calc-check"><input type="checkbox" name="a3"> Náusea/vômito (+1)</label>
        <label class="calc-check"><input type="checkbox" name="a4"> Dor FID (+2)</label>
        <label class="calc-check"><input type="checkbox" name="a5"> Descompressão dolorosa (+1)</label>
        <label class="calc-check"><input type="checkbox" name="a6"> Febre ≥37,3°C (+1)</label>
        <label class="calc-check"><input type="checkbox" name="a7"> Leucocitose (+2)</label>
        <label class="calc-check"><input type="checkbox" name="a8"> Desvio à esquerda (+1)</label>
      </fieldset>
      <fieldset class="calc-fieldset">
        <legend>AIR</legend>
        <label class="calc-check"><input type="checkbox" name="airM"> Sexo masculino (+1)</label>
        <label class="calc-check"><input type="checkbox" name="airV"> Vômito (+1)</label>
        <label class="calc-check"><input type="checkbox" name="airMig"> Migração (+1)</label>
        <label class="calc-check"><input type="checkbox" name="airFid"> Dor FID (+1)</label>
        <label class="calc-check"><input type="checkbox" name="airReb"> Descompressão (+2)</label>
        <label>Leucócitos (×10³/µL)</label>
        <input name="airWbc" type="number" step="0.1" min="0" value="10">
        <label>PCR (mg/L)</label>
        <input name="airCrp" type="number" step="0.1" min="0" value="5">
      </fieldset>
    `,
    calculate (form) {
      let alv = 0;
      ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8'].forEach(k => {
        if (uChk(form, k)) alv += (k === 'a4' || k === 'a7') ? 2 : 1;
      });

      let air = 0;
      if (uChk(form, 'airM')) air += 1;
      if (uChk(form, 'airV')) air += 1;
      if (uChk(form, 'airMig')) air += 1;
      if (uChk(form, 'airFid')) air += 1;
      if (uChk(form, 'airReb')) air += 2;

      const wbc = uNum(form, 'airWbc');
      const crp = uNum(form, 'airCrp');
      if (wbc >= 17) air += 3;
      else if (wbc >= 15) air += 2;
      else if (wbc >= 11) air += 1;
      if (crp >= 75) air += 3;
      else if (crp >= 50) air += 2;
      else if (crp >= 10) air += 1;

      return `<p><strong>Alvarado:</strong> ${alv}/10 — ${alv >= 7 ? 'Provável' : alv >= 5 ? 'Investigar' : 'Improvável'}</p>
              <p><strong>AIR:</strong> ${air}/12 — ${air >= 9 ? 'Alta probabilidade' : air >= 5 ? 'Observar/imagem' : 'Improvável'}</p>
              <p class="calc-note">Alvarado 1986; Andersson AIR 2014.</p>`;
    }
  },

  'syncope-vpp': {
    title: 'Síncope — CSRS, SFSR & STANDING',
    wide: true,
    html: `
      <fieldset class="calc-fieldset">
        <legend>SFSR — alto risco se QUALQUER</legend>
        <label class="calc-check"><input type="checkbox" name="sf1"> ICC</label>
        <label class="calc-check"><input type="checkbox" name="sf2"> Hematócrito &lt;30%</label>
        <label class="calc-check"><input type="checkbox" name="sf3"> ECG anormal</label>
        <label class="calc-check"><input type="checkbox" name="sf4"> Dispneia/Sat &lt;94%</label>
        <label class="calc-check"><input type="checkbox" name="sf5"> PAS &lt;90 mmHg</label>
      </fieldset>
      <fieldset class="calc-fieldset">
        <legend>CSRS (Canadian Syncope Risk Score)</legend>
        <label class="calc-check"><input type="checkbox" name="cs1"> Predisposição TEV (+1)</label>
        <label class="calc-check"><input type="checkbox" name="cs2"> Cardiopatia/IC (+1)</label>
        <label class="calc-check"><input type="checkbox" name="cs3"> PAS &lt;90 ou &gt;180 (+2)</label>
        <label class="calc-check"><input type="checkbox" name="cs4"> Troponina elevada (+2)</label>
        <label class="calc-check"><input type="checkbox" name="cs5"> Onda Q/ST anormal (+1)</label>
        <label class="calc-check"><input type="checkbox" name="cs6"> QRS &gt;130 ms (+1)</label>
        <label class="calc-check"><input type="checkbox" name="cs7"> QTc &gt;480 ms (+2)</label>
        <label class="calc-check"><input type="checkbox" name="cs8"> Vasovagal no PS (-2)</label>
        <label class="calc-check"><input type="checkbox" name="cs9"> Síncope cardíaca no PS (+2)</label>
      </fieldset>
      <fieldset class="calc-fieldset">
        <legend>STANDING — vertigem aguda</legend>
        <label class="calc-check"><input type="checkbox" name="stMd"> Nistagmo multidirecional/vertical</label>
        <label class="calc-check"><input type="checkbox" name="stHit"> HIT negativo (central)</label>
        <label class="calc-check"><input type="checkbox" name="stWalk"> Incapaz de deambular</label>
      </fieldset>
    `,
    calculate (form) {
      const sfsrPos = ['sf1', 'sf2', 'sf3', 'sf4', 'sf5'].some(k => uChk(form, k));
      const pts = { cs1: 1, cs2: 1, cs3: 2, cs4: 2, cs5: 1, cs6: 1, cs7: 2, cs8: -2, cs9: 2 };
      let csrs = 0;
      Object.keys(pts).forEach(k => { if (uChk(form, k)) csrs += pts[k]; });

      const csrsTxt = csrs <= -2 ? 'Baixo risco' : csrs <= 0 ? 'Intermediário' : 'Alto risco';
      const sfsrTxt = sfsrPos ? 'Positivo — evitar alta imediata' : 'Negativo — baixo risco 7 dias';

      let standing = 'Provável periférica (VPP/BPPV)';
      if (uChk(form, 'stMd') || uChk(form, 'stHit')) standing = 'Provável central — neuroimagem';
      else if (uChk(form, 'stWalk')) standing = 'Instabilidade grave — reavaliar AVC';

      return `<p><strong>SFSR:</strong> ${sfsrTxt}</p>
              <p><strong>CSRS:</strong> ${csrs} pts — ${csrsTxt}</p>
              <p><strong>STANDING:</strong> ${standing}</p>
              <p class="calc-note">PERCIST = critérios PET-oncológicos (não síncope). CSRS/SFSR para síncope; STANDING (Vanni 2014) para vertigem.</p>`;
    }
  }
};
