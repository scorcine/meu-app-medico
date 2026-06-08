/* Calculadoras — Ortopedia & Reumatologia */

function oNum (form, name) {
  const v = parseFloat(form[name]?.value);
  return Number.isFinite(v) ? v : NaN;
}

function oChk (form, name) {
  return !!form[name]?.checked;
}

function oSel (form, name) {
  return form[name]?.value ?? '';
}

const CALC_ORTO = {
  ottawa: {
    title: 'Ottawa — Tornozelo & Joelho',
    wide: true,
    html: `
      <label>Local da queixa</label>
      <select name="local" required>
        <option value="tornozelo">Tornozelo (maléolos)</option>
        <option value="pe">Pé / mediopé (Ottawa foot)</option>
        <option value="joelho">Joelho</option>
      </select>
      <fieldset class="calc-fieldset" id="ottawa-tornozelo">
        <legend>Tornozelo / pé</legend>
        <label class="calc-check"><input type="checkbox" name="dorMal"> Dor na zona do maléolo ou mediopé</label>
        <label class="calc-check"><input type="checkbox" name="malLat"> Dor óssea maléolo lateral (posterior/ponta)</label>
        <label class="calc-check"><input type="checkbox" name="malMed"> Dor óssea maléolo medial (posterior/ponta)</label>
        <label class="calc-check"><input type="checkbox" name="navicular"> Dor navicular (pé)</label>
        <label class="calc-check"><input type="checkbox" name="met5"> Dor base 5º metatarso (pé)</label>
        <label class="calc-check"><input type="checkbox" name="pesoT"> Incapaz de apoiar 4 passos imediatamente e no PS</label>
      </fieldset>
      <fieldset class="calc-fieldset" id="ottawa-joelho" hidden>
        <legend>Joelho</legend>
        <label class="calc-check"><input type="checkbox" name="idade55"> Idade ≥55 anos</label>
        <label class="calc-check"><input type="checkbox" name="patela"> Dor isolada na patela</label>
        <label class="calc-check"><input type="checkbox" name="fibula"> Dor na cabeça da fíbula</label>
        <label class="calc-check"><input type="checkbox" name="flex90"> Incapaz de flexionar joelho 90°</label>
        <label class="calc-check"><input type="checkbox" name="pesoJ"> Incapaz de apoiar 4 passos (ambas pernas)</label>
      </fieldset>
    `,
    onRender (form) {
      const local = form.querySelector('[name="local"]');
      const torn = form.querySelector('#ottawa-tornozelo');
      const joelho = form.querySelector('#ottawa-joelho');
      function refresh () {
        const j = local.value === 'joelho';
        torn.hidden = j;
        joelho.hidden = !j;
      }
      local.addEventListener('change', refresh);
      refresh();
    },
    calculate (form) {
      const local = oSel(form, 'local');

      if (local === 'joelho') {
        const rx = oChk(form, 'idade55') || oChk(form, 'patela') || oChk(form, 'fibula') ||
          oChk(form, 'flex90') || oChk(form, 'pesoJ');
        return `<p><strong>Ottawa joelho:</strong> ${rx ? 'Positivo — indicar radiografia' : 'Negativo — RX não necessária (VPN ~99%)'}</p>
                <p class="calc-note">Stiell et al. Aplicar apenas se trauma agudo e sem outras lesões que distraiam.</p>`;
      }

      const peso = oChk(form, 'pesoT');
      let rx = false;
      if (local === 'tornozelo') {
        rx = peso || (oChk(form, 'dorMal') && (oChk(form, 'malLat') || oChk(form, 'malMed')));
      } else {
        rx = peso || oChk(form, 'navicular') || oChk(form, 'met5');
      }

      return `<p><strong>Ottawa ${local === 'tornozelo' ? 'tornozelo' : 'pé'}:</strong> ${rx ? 'Positivo — indicar radiografia' : 'Negativo — RX não necessária'}</p>
              <p class="calc-note">Stiell et al., 1992–1994. Incapacidade de deambular sozinha indica RX em qualquer zona.</p>`;
    }
  },

  'hip-oculta': {
    title: 'Fratura oculta de quadril — triade clínica (MRI)',
    wide: true,
    html: `
      <p class="calc-note">RX negativa com suspeita clínica — escore clínico baseado em SLR/triade (literatura ortopédica; não é Wells TVP/TEP).</p>
      <label class="calc-check"><input type="checkbox" name="slr"> Incapaz de elevar perna estendida (SLR) (+2)</label>
      <label class="calc-check"><input type="checkbox" name="groin"> Dor à palpação profunda da virilha (+1)</label>
      <label class="calc-check"><input type="checkbox" name="rot"> Limitação dolorosa da rotação interna (+1)</label>
      <label class="calc-check"><input type="checkbox" name="perc"> Dor à percussão do calcanhar (+1)</label>
      <label class="calc-check"><input type="checkbox" name="peso"> Incapaz de apoiar peso no membro (+1)</label>
      <label class="calc-check"><input type="checkbox" name="deform"> Deformidade ou encurtamento em repouso (+1)</label>
    `,
    calculate (form) {
      let score = 0;
      if (oChk(form, 'slr')) score += 2;
      ['groin', 'rot', 'perc', 'peso', 'deform'].forEach(k => { if (oChk(form, k)) score += 1; });

      let prob = score >= 4
        ? 'Alta probabilidade de fratura oculta — RM em 24 h (NICE/AAOS); se indisponível, TC'
        : score >= 2
          ? 'Probabilidade intermediária — RM ou TC urgente; não alta sem investigação'
          : 'Menor probabilidade — reavaliar; RM se persistência da dor';

      const conduta = score >= 2
        ? 'Internação/repouso relativo até excluir fratura; ortopedia; anticoagulação profilática se imobilizado'
        : 'Observação clínica; repetir RX ou RM se piora';

      return `<p><strong>Escore clínico:</strong> ${score}/7</p>
              <p><strong>Interpretação:</strong> ${prob}</p>
              <p><strong>Conduta:</strong> ${conduta}</p>
              <p class="calc-note">SLR ~92–95% sensível para fratura em RM (Clement/Fuller). RM = padrão-ouro se RX negativa e suspeita alta.</p>`;
    }
  }
};
