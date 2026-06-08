/* Calculadoras — Neurologia */

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

const NIHSS_ITEM_KEYS = ['loc', 'locq', 'locc', 'gaze', 'visual', 'face', 'armL', 'armR', 'legL', 'legR', 'ataxia', 'sens', 'lang', 'dys', 'neg'];

const NIHSS_FORM_HTML = `
      <fieldset class="calc-fieldset">
        <legend>Consciência (1a–1c)</legend>
        <label>1a. Nível de consciência</label>
        <select name="loc" required>
          <option value="0">0 — alerta</option>
          <option value="1">1 — não alerta, despertável</option>
          <option value="2">2 — estímulo repetitivo / comatoso</option>
          <option value="3">3 — reflexos ou postura / comatoso</option>
        </select>
        <label>1b. Perguntas (mês, idade)</label>
        <select name="locq" required>
          <option value="0">0 — ambas corretas</option>
          <option value="1">1 — uma correta</option>
          <option value="2">2 — nenhuma correta</option>
        </select>
        <label>1c. Comandos (piscar, apertar mão)</label>
        <select name="locc" required>
          <option value="0">0 — obedece ambos</option>
          <option value="1">1 — obedece um</option>
          <option value="2">2 — não obedece</option>
        </select>
      </fieldset>
      <fieldset class="calc-fieldset">
        <legend>Exame neurológico</legend>
        <label>2. Olhar conjugado / desvio</label>
        <select name="gaze" required>
          <option value="0">0 — normal</option>
          <option value="1">1 — paralisia parcial do olhar</option>
          <option value="2">2 — desvio forçado / paralisia total</option>
        </select>
        <label>3. Campos visuais</label>
        <select name="visual" required>
          <option value="0">0 — sem perda</option>
          <option value="1">1 — hemianopsia parcial</option>
          <option value="2">2 — hemianopsia completa</option>
          <option value="3">3 — hemianopsia bilateral / cegueira cortical</option>
        </select>
        <label>4. Paresia facial</label>
        <select name="face" required>
          <option value="0">0 — normal</option>
          <option value="1">1 — paralisia leve</option>
          <option value="2">2 — paralisia parcial</option>
          <option value="3">3 — paralisia completa</option>
        </select>
      </fieldset>
      <fieldset class="calc-fieldset">
        <legend>Motor (5–6)</legend>
        <label>5a. Motor — braço esquerdo</label>
        <select name="armL" required>
          <option value="0">0 — mantém 90° por 10 s</option>
          <option value="1">1 — cai antes, não bate no leito</option>
          <option value="2">2 — esforço contra gravidade</option>
          <option value="3">3 — cai, sem esforço</option>
          <option value="4">4 — sem movimento</option>
        </select>
        <label>5b. Motor — braço direito</label>
        <select name="armR" required>
          <option value="0">0 — mantém 90° por 10 s</option>
          <option value="1">1 — cai antes, não bate no leito</option>
          <option value="2">2 — esforço contra gravidade</option>
          <option value="3">3 — cai, sem esforço</option>
          <option value="4">4 — sem movimento</option>
        </select>
        <label>6a. Motor — perna esquerda</label>
        <select name="legL" required>
          <option value="0">0 — mantém 30° por 5 s</option>
          <option value="1">1 — cai antes</option>
          <option value="2">2 — esforço contra gravidade</option>
          <option value="3">3 — cai, sem esforço</option>
          <option value="4">4 — sem movimento</option>
        </select>
        <label>6b. Motor — perna direita</label>
        <select name="legR" required>
          <option value="0">0 — mantém 30° por 5 s</option>
          <option value="1">1 — cai antes</option>
          <option value="2">2 — esforço contra gravidade</option>
          <option value="3">3 — cai, sem esforço</option>
          <option value="4">4 — sem movimento</option>
        </select>
      </fieldset>
      <fieldset class="calc-fieldset">
        <legend>Outros (7–11)</legend>
        <label>7. Ataxia de membros</label>
        <select name="ataxia" required>
          <option value="0">0 — ausente</option>
          <option value="1">1 — presente em 1 membro</option>
          <option value="2">2 — presente em 2 membros</option>
        </select>
        <label>8. Sensibilidade</label>
        <select name="sens" required>
          <option value="0">0 — normal</option>
          <option value="1">1 — perda leve a moderada</option>
          <option value="2">2 — perda grave ou total</option>
        </select>
        <label>9. Linguagem (afasia)</label>
        <select name="lang" required>
          <option value="0">0 — normal</option>
          <option value="1">1 — afasia leve a moderada</option>
          <option value="2">2 — afasia grave</option>
          <option value="3">3 — mutismo / afasia global</option>
        </select>
        <label>10. Disartria</label>
        <select name="dys" required>
          <option value="0">0 — normal</option>
          <option value="1">1 — leve a moderada</option>
          <option value="2">2 — grave / anartria</option>
        </select>
        <label>11. Extinção / negligência</label>
        <select name="neg" required>
          <option value="0">0 — normal</option>
          <option value="1">1 — negligência em 1 modalidade</option>
          <option value="2">2 — hemi-inatenção ou extinção</option>
        </select>
      </fieldset>`;

function calculateNihssResult (form) {
  const total = NIHSS_ITEM_KEYS.reduce((s, k) => s + parseInt(nSel(form, k), 10), 0);

  let sever;
  let implicacao;
  let conduta;

  if (total === 0) {
    sever = 'Sem déficit';
    implicacao = 'Investigar mimics (hipoglicemia, crise); repetir NIHSS seriado.';
    conduta = 'Não indicar reperfusão com base no NIHSS isolado — correlacionar clínica e imagem.';
  } else if (total <= 4) {
    sever = 'AVC leve';
    implicacao = 'Prognóstico geralmente favorável; risco de progressão ainda existe.';
    conduta = 'Avaliar trombólise IV se janela ≤ 4 h 30 e sem contraindicações. LVO com déficit limitado (ex.: afasia) pode indicar trombectomia.';
  } else if (total <= 15) {
    sever = 'Moderado';
    implicacao = 'Faixa mais comum de candidatos à reperfusão.';
    conduta = 'Trombólise IV se elegível + investigar LVO para trombectomia (ASPECTS, angioTC).';
  } else if (total <= 20) {
    sever = 'Moderado-grave';
    implicacao = 'Maior risco de edema maligno e deterioração.';
    conduta = 'Reperfusão ainda possível — decisão individualizada; monitorização em UTI/stroke unit.';
  } else {
    sever = 'Grave';
    implicacao = 'Déficit extenso; maior mortalidade e incapacidade.';
    conduta = 'Avaliar reperfusão conforme janela, imagem e comorbidades; vigilância neurológica intensiva.';
  }

  const alertas = [];
  if (total > 25) {
    alertas.push('<strong>NIHSS &gt; 25:</strong> contraindicação relativa adicional na janela <strong>3–4,5 h</strong> para trombólise IV.');
  }
  if (total >= 6) {
    alertas.push('<strong>NIHSS ≥ 6:</strong> critério de gravidade frequentemente usado para trombectomia (com LVO + ASPECTS ≥ 6).');
  }
  if (total >= 1 && total <= 4) {
    alertas.push('NIHSS baixo não exclui LVO — considerar angioTC se suspeita clínica.');
  }

  const alertasHtml = alertas.length
    ? `<ul class="emerg-calc-alerts">${alertas.map(a => `<li>${a}</li>`).join('')}</ul>`
    : '';

  return `<p class="emerg-calc-score"><strong>NIHSS total:</strong> ${total}/42</p>
          <p><strong>Classificação:</strong> ${sever}</p>
          <p><strong>Implicação clínica:</strong> ${implicacao}</p>
          <p><strong>Conduta aguda sugerida:</strong> ${conduta}</p>
          ${alertasHtml}
          <p class="calc-note">Documentar NIHSS na admissão, 2 h e 24 h pós-trombólise e pré/pós trombectomia. Referência: NIH Stroke Scale (AHA/ASA).</p>`;
}

const CALC_NEURO = {
  nihss: {
    title: 'NIHSS — AVC isquêmico',
    wide: true,
    html: NIHSS_FORM_HTML,
    calculate (form) {
      return calculateNihssResult(form);
    }
  },

  abcd2: {
    title: 'ABCD² — risco pós-AIT',
    html: `
      <label class="calc-check"><input type="checkbox" name="idade"> Idade ≥60 anos (+1)</label>
      <label class="calc-check"><input type="checkbox" name="pa"> PAS ≥140 ou PAD ≥90 mmHg (+1)</label>
      <label class="calc-check"><input type="checkbox" name="dm"> Diabetes mellitus (+1)</label>
      <label>Duração dos sintomas</label>
      <select name="duracao" required>
        <option value="0">&lt;10 min</option>
        <option value="1">10–59 min (+1)</option>
        <option value="2">≥60 min (+2)</option>
      </select>
      <label>Características clínicas</label>
      <select name="clinica" required>
        <option value="0">Outras</option>
        <option value="1">Distúrbio da fala sem fraqueza (+1)</option>
        <option value="2">Fraqueza unilateral (+2)</option>
      </select>
    `,
    calculate (form) {
      let score = parseInt(nSel(form, 'duracao'), 10) + parseInt(nSel(form, 'clinica'), 10);
      if (nChk(form, 'idade')) score += 1;
      if (nChk(form, 'pa')) score += 1;
      if (nChk(form, 'dm')) score += 1;
      let risco = score <= 3 ? 'Baixo (~1% AVC em 2 dias)' : score <= 5 ? 'Moderado (~4% em 2 dias)' : 'Alto (~8% em 2 dias)';
      return `<p><strong>ABCD2:</strong> ${score}/7 — ${risco}</p>
              <p class="calc-note">Johnston et al., 2007. Score ≥4 = investigação urgente na maioria dos protocolos.</p>`;
    }
  },

  'hunt-hess': {
    title: 'Hunt-Hess — HSA aneurismática',
    html: `
      <label>Grau clínico</label>
      <select name="grau" required>
        <option value="1">I — cefaleia leve, rigidez de nuca</option>
        <option value="2">II — cefaleia intensa, rigidez, sem déficit exceto CN</option>
        <option value="3">III — sonolência, confusão, déficit focal leve</option>
        <option value="4">IV — estupor, hemiparesia moderada-grave</option>
        <option value="5">V — coma, postura decerebrada</option>
      </select>
    `,
    calculate (form) {
      const g = parseInt(nSel(form, 'grau'), 10);
      const mort = g === 1 ? '~30%' : g === 2 ? '~40%' : g === 3 ? '~50%' : g === 4 ? '~80%' : '~90%';
      return `<p><strong>Hunt-Hess:</strong> Grau ${g}</p>
              <p><strong>Mortalidade aproximada:</strong> ${mort}</p>
              <p><strong>Conduta:</strong> UTI; nimodipino; clipagem/embolização quando estável.</p>
              <p class="calc-note">Hunt &amp; Hess, 1968. Complementar com Fisher (TC) e WFNS.</p>`;
    }
  },

  mrs: {
    title: 'mRS — Modified Rankin Scale',
    html: `
      <label>Grau de incapacidade (mRS)</label>
      <select name="grau" required>
        <option value="0">0 — Sem sintomas</option>
        <option value="1">1 — Sem incapacidade significativa</option>
        <option value="2">2 — Incapacidade leve; independente</option>
        <option value="3">3 — Incapacidade moderada; precisa ajuda</option>
        <option value="4">4 — Incapacidade moderada-grave</option>
        <option value="5">5 — Incapacidade grave; acamado</option>
        <option value="6">6 — Óbito</option>
      </select>
      <label>Contexto</label>
      <select name="ctx" required>
        <option value="prev">Pré-AVC (baseline)</option>
        <option value="90d">90 dias pós-AVC (desfecho)</option>
      </select>
    `,
    calculate (form) {
      const g = parseInt(nSel(form, 'grau'), 10);
      const ctx = nSel(form, 'ctx');
      let interp = g <= 2 ? 'Desfecho favorável (independência)' : g <= 4 ? 'Dependência significativa' : g === 5 ? 'Incapacidade grave' : 'Óbito';
      let progn = ctx === 'prev'
        ? (g >= 3 ? 'Baseline desfavorável — impacta metas terapêuticas' : 'Baseline favorável')
        : (g <= 2 ? 'Meta atingida em trials de reperfusão' : 'Reabilitação prolongada necessária');
      return `<p><strong>mRS:</strong> ${g}/6 — ${interp}</p>
              <p><strong>Prognóstico:</strong> ${progn}</p>
              <p class="calc-note">Modified Rankin Scale — padrão para desfecho funcional pós-AVC.</p>`;
    }
  }
};
