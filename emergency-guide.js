/* Guia rápido de emergência — tópicos e conteúdo — build 98041d1 */

const MEDHUB_EMERG_BUILD = 'avc-fix-3';

const PARADA_PROTOCOLS = [
  {
    id: 'bls-adulto',
    icon: '🫀',
    name: 'Adulto – BLS 2025',
    html: `
      <p>Reconhecimento rápido, RCP de alta qualidade e DEA em <strong>≤ 2 minutos</strong>.</p>
      <ol class="emerg-steps">
        <li><strong>Segurança</strong> — verificar cena segura.</li>
        <li><strong>Responsividade</strong> — estimular o paciente; se não responder, acionar ajuda e buscar DEA/monitor.</li>
        <li><strong>Respiração e pulso</strong> — avaliar respiração anormal e pulso carotídeo/femoral simultaneamente por <strong>≤ 10 s</strong>.</li>
        <li><strong>RCP imediata</strong> — se sem pulso: compressões torácicas <strong>100–120/min</strong>, profundidade <strong>5–6 cm</strong>, retorno total do tórax, mínimas pausas.</li>
        <li><strong>Ventilação</strong> — se treinado: relação <strong>30:2</strong> ou dispositivo bolsa-válvula-máscara com O₂; evitar hiperventilação.</li>
        <li><strong>DEA</strong> — ligar, aplicar eletrodos, seguir comandos de voz; <strong>análise de ritmo em ≤ 2 min</strong> do início da RCP.</li>
        <li><strong>Choque indicado</strong> — retomar compressões imediatamente após o choque; ciclo de <strong>2 min</strong> entre análises.</li>
      </ol>
      <h4>Metas de qualidade</h4>
      <ul>
        <li>Trocar compressor a cada <strong>2 min</strong></li>
        <li>Profundidade e frequência adequadas; evitar ventilação excessiva</li>
        <li>Capnografia, se disponível, alvo PETCO₂ ≥ 10 mmHg durante RCP</li>
      </ul>
    `
  },
  {
    id: 'acls-adulto',
    icon: '💉',
    name: 'Adulto – ACLS',
    html: `
      <p>Manter RCP de alta qualidade, acesso IV/IO, medicações e choques conforme ritmo.</p>

      <h4>Ritmo chocável (FV / TV sem pulso)</h4>
      <p class="emerg-rhythm-intro">Dois ritmos que exigem <strong>desfibrilação imediata</strong> — confirmar ausência de pulso antes de choque:</p>
      <div class="emerg-rhythm-grid emerg-rhythm-grid-2">
        <div class="emerg-rhythm-card emerg-rhythm-card-shock">
          <span class="emerg-rhythm-tag emerg-rhythm-tag-shock">CHOCAR</span>
          <figure class="emerg-ecg-figure">
            <img src="assets/ecg/ecg-fv.jpg" alt="ECG real: fibrilação ventricular — traçado caótico irregular sem complexos QRS organizados" class="emerg-ecg-img" width="672" height="110" loading="eager" decoding="async">
            <figcaption>FV — fibrilação ventricular</figcaption>
          </figure>
          <p>Ondas caóticas em “serrilhado”, <strong>sem QRS ou onda P</strong> identificáveis; ritmo totalmente irregular.</p>
          <p class="emerg-rhythm-hint">Pós-IAM, cardiopatia, QT longo.</p>
        </div>
        <div class="emerg-rhythm-card emerg-rhythm-card-shock">
          <span class="emerg-rhythm-tag emerg-rhythm-tag-shock">CHOCAR</span>
          <figure class="emerg-ecg-figure">
            <img src="assets/ecg/ecg-tv-pulseless.png" alt="ECG real: taquicardia ventricular monomórfica — QRS largo regular sem pulso" class="emerg-ecg-img" width="800" height="200" loading="eager" decoding="async">
            <figcaption>TV sem pulso — QRS largo regular (monomórfica)</figcaption>
          </figure>
          <p>QRS largo (&gt; 120 ms), taquicardia <strong>regular</strong>; frequência alta — <strong>sem pulso central</strong>.</p>
          <p class="emerg-rhythm-hint">≠ TV com pulso (paciente estável → cardioversão).</p>
        </div>
      </div>

      <h4>Ritmo não chocável (AESP / assistolia)</h4>
      <p class="emerg-rhythm-intro">Sem pulso e traçado <strong>não chocável</strong> — <strong>não desfibrilar</strong>; iniciar RCP + epinefrina e tratar causas reversíveis.</p>
      <p class="emerg-flow-question">Identifique o padrão no monitor:</p>
      <div class="emerg-rhythm-grid">
        <div class="emerg-rhythm-card emerg-rhythm-card-noshock">
          <span class="emerg-rhythm-tag emerg-rhythm-tag-noshock">NÃO CHOCAR</span>
          <figure class="emerg-ecg-figure">
            <img src="assets/ecg/ecg-asistolia.svg" alt="ECG: assistolia — linha isoelétrica sem atividade elétrica" class="emerg-ecg-img" loading="lazy">
            <figcaption>Assistolia</figcaption>
          </figure>
          <p>Linha reta / isoelétrica — <strong>ausência de atividade elétrica</strong> discernível (confirmar cabos, ganho e derivações).</p>
        </div>
        <div class="emerg-rhythm-card emerg-rhythm-card-noshock">
          <span class="emerg-rhythm-tag emerg-rhythm-tag-noshock">NÃO CHOCAR</span>
          <figure class="emerg-ecg-figure">
            <img src="assets/ecg/ecg-aesp.svg" alt="ECG: AESP — complexos QRS organizados estreitos sem pulso" class="emerg-ecg-img" loading="lazy">
            <figcaption>AESP — QRS estreito organizado</figcaption>
          </figure>
          <p>Atividade elétrica <strong>organizada</strong> (ex.: ritmo sinusal, ESV) porém <strong>sem pulso</strong> — AESP/PEA.</p>
        </div>
        <div class="emerg-rhythm-card emerg-rhythm-card-noshock">
          <span class="emerg-rhythm-tag emerg-rhythm-tag-noshock">NÃO CHOCAR</span>
          <figure class="emerg-ecg-figure">
            <img src="assets/ecg/ecg-aesp-lenta.svg" alt="ECG: AESP bradicárdica — QRS largo lento sem pulso" class="emerg-ecg-img" loading="lazy">
            <figcaption>AESP — bradicardia / idioventricular</figcaption>
          </figure>
          <p>Complexos <strong>largos e lentos</strong> ou bradicardia extrema — ainda é AESP se <strong>sem pulso</strong> (≠ bradicardia com pulso).</p>
        </div>
      </div>

      <div class="emerg-flowcharts-row">
        <div class="emerg-flow-col emerg-flow-col-shock">
          <h4>Fluxograma — ritmo chocável</h4>
          <div class="emerg-flow-v" aria-label="Fluxograma ritmo chocavel">
            <span class="emerg-flow-step">RCP + DEA</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step">RCP 2 min</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step emerg-flow-shock">1º CHOC</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step">RCP 2 min</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step emerg-flow-shock">2º CHOC</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step">RCP + ES</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step emerg-flow-shock">3º CHOC</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step">RCP + AMIOD 300</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step emerg-flow-shock">4º CHOC</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step">RCP + AMIOD 150</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step emerg-flow-loop">ES q3–5 min · reavaliar ritmo</span>
          </div>
        </div>

        <div class="emerg-flow-col emerg-flow-col-noshock">
          <h4>Fluxograma — ritmo não chocável</h4>
          <div class="emerg-flow-v" aria-label="Fluxograma ritmo nao chocavel">
            <span class="emerg-flow-step">Analisar ritmo ≤ 10 s</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step emerg-flow-decision">Assistolia ou AESP</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step emerg-flow-noshock">NÃO CHOCAR — RCP imediata</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step">RCP 30:2 ou compressões contínuas</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step">Epinefrina 1 mg IV/IO</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step">Repetir ES q3–5 min</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step">Tratar 5H + 5T</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step">Via aérea + capnografia</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step emerg-flow-loop">Reavaliar a cada 2 min</span>
          </div>
        </div>
      </div>

      <table class="emerg-table">
        <tr><th>Medicação</th><th>Dose</th><th>Observação</th></tr>
        <tr><td>Epinefrina (ES)</td><td>1 mg IV/IO</td><td>A cada 3–5 min (após 2º choque no chocável)</td></tr>
        <tr><td>Amiodarona (AMIOD)</td><td>300 mg IV/IO → 150 mg</td><td>Após 3º choque; alternativa: lidocaína 1–1,5 mg/kg</td></tr>
        <tr><td>Desfibrilação</td><td>120–200 J bifásico</td><td>Escalar se necessário; retomar RCP imediatamente</td></tr>
      </table>

      <div class="emerg-reversible-box">
        <h4>Causas reversíveis (5H + 5T)</h4>
        <div class="emerg-reversible-grid">
          <ul>
            <li><strong>H</strong>ipovolemia</li>
            <li><strong>H</strong>ipóxia</li>
            <li><strong>H</strong>⁺ (acidose)</li>
            <li><strong>H</strong>ipo / hipercalemia</li>
            <li><strong>H</strong>ipotermia</li>
          </ul>
          <ul>
            <li><strong>T</strong>amponamento</li>
            <li><strong>T</strong>ensão (pneumotórax)</li>
            <li><strong>T</strong>EP</li>
            <li><strong>T</strong>oxinas</li>
            <li><strong>T</strong>rombose (IAM / TEP)</li>
          </ul>
        </div>
      </div>
      <p class="emerg-note">Confirmar assistolia: ganho adequado, derivações corretas, dupla checagem. Ritmo organizado com pulso = não é parada — tratar bradicardia/taquicardia conforme estabilidade.</p>
    `
  },
  {
    id: 'pals-ped',
    icon: '👶',
    name: 'Pediátrico – PALS',
    html: `
      <p>Adaptar doses ao peso; priorizar oxigenação e ventilação (hipóxia e hipovolemia são causas frequentes).</p>
      <h4>Parada — sequência geral</h4>
      <ol class="emerg-steps">
        <li><strong>Avaliar ABC</strong> — oxigênio, monitor/cardioversor pediátrico, acesso IV/IO.</li>
        <li><strong>RCP</strong> — 1 socorrista: <strong>30:2</strong>; 2 socorristas: <strong>15:2</strong>; compressões <strong>100–120/min</strong>, profundidade ~1/3 do tórax.</li>
        <li><strong>Ritmo chocável</strong> — choque <strong>2 J/kg</strong> (1º), depois <strong>4 J/kg</strong>; subsequentes ≥ 4 J/kg (máx. 10 J/kg ou dose adulta).</li>
        <li><strong>Epinefrina</strong> — <strong>0,01 mg/kg</strong> IV/IO (0,1 mL/kg de 1:10.000) a cada <strong>3–5 min</strong>.</li>
        <li><strong>Amiodarona</strong> — <strong>5 mg/kg</strong> IV/IO (máx. 300 mg) nos ritmos chocáveis refratários.</li>
      </ol>
      <h4>Doses rápidas por peso (referência)</h4>
      <table class="emerg-table">
        <tr><th>Peso</th><th>Epinefrina 0,01 mg/kg</th><th>Amiodarona 5 mg/kg</th><th>1º choque 2 J/kg</th></tr>
        <tr><td>10 kg</td><td>0,1 mg (1 mL 1:10.000)</td><td>50 mg</td><td>20 J</td></tr>
        <tr><td>15 kg</td><td>0,15 mg</td><td>75 mg</td><td>30 J</td></tr>
        <tr><td>20 kg</td><td>0,2 mg</td><td>100 mg</td><td>40 J</td></tr>
        <tr><td>30 kg</td><td>0,3 mg</td><td>150 mg</td><td>60 J</td></tr>
      </table>
      <p class="emerg-note">Bradicardia sintomática pediátrica: epinefrina 0,01 mg/kg ou atropina 0,02 mg/kg (mín. 0,1 mg) antes de considerar marcapasso.</p>
    `
  },
  {
    id: 'bradicardia',
    icon: '🐢',
    name: 'Ritmo lentificado (< 50 bpm)',
    html: `
      <p>Bradicardia com <strong>instabilidade hemodinâmica</strong> (hipotensão, alteração de consciência, dor torácica, ICC).</p>
      <ol class="emerg-steps">
        <li><strong>O₂ + monitor + acesso IV</strong> — identificar fármacos causadores (β-bloqueador, BCC, digoxina).</li>
        <li><strong>Atropina 1 mg IV</strong> — repetir a cada <strong>3–5 min</strong> (dose máx. <strong>3 mg</strong>).</li>
        <li><strong>Se refratária ou bloqueio AV de alto grau</strong> — <strong>marcapasso transcutâneo</strong> imediato; aumentar corrente até captura.</li>
        <li><strong>Enquanto prepara marcapasso</strong> — epinefrina 2–10 µg/min ou dopamina 5–20 µg/kg/min.</li>
        <li><strong>Tratar causa</strong> — IAM inferior, hipercalemia, intoxicação, hipotermia.</li>
      </ol>
      <p class="emerg-note">Atropina não é eficaz em bloqueio AV de 2º grau Mobitz II ou 3º grau — priorizar marcapasso.</p>
    `
  },
  {
    id: 'taquicardia',
    icon: '⚡',
    name: 'Taquicardia instável',
    html: `
      <p>Instabilidade = hipotensão, rebaixamento de consciência, isquemia miocárdica ou edema agudo de pulmão.</p>
      <ol class="emerg-steps">
        <li><strong>Sincronizar monitor</strong> — confirmar QRS estreito vs largo e regularidade.</li>
        <li><strong>Choque sincronizado imediato</strong> — sedação/analgesia se consciente e tempo permitir.</li>
        <li><strong>Energia sugerida (bifásico)</strong>
          <ul>
            <li>QRS estreito regular (TSV): <strong>50–100 J</strong></li>
            <li>QRS estreito irregular (FA): <strong>120–200 J</strong></li>
            <li>QRS largo regular (TV): <strong>100 J</strong> sincronizado</li>
            <li>QRS largo irregular: considerar desfibrilação <strong>assíncrona</strong> (alta energia)</li>
          </ul>
        </li>
        <li><strong>Se persiste ou recorre</strong> — <strong>amiodarona 150 mg</strong> em 10 min; seguida de infusão 1 mg/min × 6 h, depois 0,5 mg/min.</li>
        <li><strong>Alternativas</strong> — procainamida 20–50 mg/min (máx. 17 mg/kg) ou sotalol 100 mg IV (se QRS estreito).</li>
      </ol>
      <p class="emerg-note">Taquicardia <em>estável</em>: manobras vagais (TSV), adenosina 6 mg → 12 mg, ou controle de frequência — não cardioverter de imediato.</p>
    `
  },
  {
    id: 'rosc',
    icon: '✅',
    name: 'ROSC pós-PCR',
    html: `
      <p>Retorno de circulação espontânea — foco em perfusão, neuroproteção e causa base.</p>
      <ol class="emerg-steps">
        <li><strong>Via aérea e ventilação</strong> — SpO₂ alvo <strong>92–98%</strong> (evitar hiperóxia); capnografia; evitar hiperventilação.</li>
        <li><strong>Controle de temperatura (TTM)</strong> — se comatoso, manter <strong>32–36 °C</strong> por ≥ 24 h; tratar febre agressivamente.</li>
        <li><strong>Pressão arterial</strong> — alvo prático <strong>PAM ≥ 65 mmHg</strong> ou PAS ≥ 90 mmHg; noradrenalina/vasopressina se hipotensão persistente.</li>
        <li><strong>Glicemia</strong> — checar imediatamente; manter <strong>140–180 mg/dL</strong>; evitar hipoglicemia (&lt; 70) e hiperglicemia severa.</li>
        <li><strong>ECG 12 derivações</strong> — IAM → cateterismo de urgência; tratar arritmias e causas (TEP, intoxicação, etc.).</li>
        <li><strong>Gasometria, lactato, eletrólitos</strong> — corrigir K⁺, Ca²⁺, acidose; considerar TC cerebral se causa neurológica.</li>
        <li><strong>Sedação/analgesia</strong> — se ventilado; evitar convulsões não tratadas; prognóstico neurológico ≥ 72 h.</li>
      </ol>
      <table class="emerg-table">
        <tr><th>Parâmetro</th><th>Alvo pós-ROSC</th></tr>
        <tr><td>SpO₂</td><td>92–98%</td></tr>
        <tr><td>Temperatura</td><td>32–36 °C (TTM) ou normotermia estrita</td></tr>
        <tr><td>PAM</td><td>≥ 65 mmHg</td></tr>
        <tr><td>Glicemia</td><td>140–180 mg/dL</td></tr>
        <tr><td>EtCO₂</td><td>35–45 mmHg (ajustar ventilação)</td></tr>
      </table>
      <p class="emerg-note">Referência: diretrizes AHA 2020/2025 (BLS/ACLS/PALS). Adaptar ao protocolo institucional.</p>
    `
  }
];

const SCA_PROTOCOLS = [
  {
    id: 'dor-inicial',
    icon: '🩺',
    name: 'Dor torácica inicial',
    html: `
      <p>Suspeita de SCA até prova em contrário — <strong>ECG em ≤ 10 min</strong> do primeiro contato médico.</p>

      <div class="emerg-flow-v">
        <span class="emerg-flow-step">Avaliar estabilidade — ABC, SpO₂, PA, FC, ritmo</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-decision">Dor torácica sugestiva de isquemia?</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step"><strong>ECG 12 derivações em ≤ 10 min</strong></span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Acesso venoso + troponina (serial) + eletrólitos + função renal</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Monitor contínuo + oxigênio se SpO₂ &lt; 90%</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Ácido acetilsalicílico 150–300 mg VO (mastigar) — se não contraindicado</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-decision">Classificar: STEMI · NSTEMI · Angina instável</span>
      </div>

      <h4>Sinais de alerta — instabilidade</h4>
      <ul>
        <li>Hipotensão, choque, arritmia maligna</li>
        <li>Dor refratária, ICC aguda, alteração de consciência</li>
        <li>→ estabilizar e acionar hemodinâmica / UTI</li>
      </ul>

      <table class="emerg-table">
        <tr><th>Conduta</th><th>Indicação</th></tr>
        <tr><td>Nitrato SL</td><td>Dor persistente, PA sistólica &gt; 90 mmHg, sem suspeita de VD / estenose aórtica</td></tr>
        <tr><td>Morfina</td><td>Dor refratária (usar com cautela — pode mascarar evolução)</td></tr>
        <tr><td>Anticoagulação</td><td>Conforme tipo de SCA (heparina / enoxaparina)</td></tr>
      </table>
      <p class="emerg-note">Repetir ECG se dor recorrer ou instabilidade — supra ST pode ser intermitente.</p>
    `
  },
  {
    id: 'stemi',
    icon: '🚨',
    name: 'STEMI',
    html: `
      <p>Supra de ST ou equivalente — reperfusão <strong>imediata</strong>. Metas: <strong>porta-balão ≤ 90 min</strong> ou <strong>fibrinólise ≤ 30 min</strong> se ICP indisponível.</p>

      <h4>Critérios ECG (resumo)</h4>
      <ul>
        <li>Supra ST ≥ 1 mm em ≥ 2 derivações contíguas (exceto V2–V3: ≥ 2 mm homens &gt;40 a; ≥ 1,5 mm homens &lt;40 a; ≥ 1 mm mulheres)</li>
        <li>Bloqueio de ramo esquerdo <strong>novo</strong> ou presumivelmente novo</li>
        <li>Equivalentes: de Winter, Wellens, supra ST em aVR com difuso ST↓</li>
      </ul>

      <div class="emerg-flowcharts-row">
        <div class="emerg-flow-col emerg-flow-col-shock">
          <h4>ICP primária (preferencial)</h4>
          <div class="emerg-flow-v">
            <span class="emerg-flow-step">Confirmar STEMI + acionar equipe / hemodinâmica</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step">AAS 150–300 mg + P2Y12 (clopidogrel / ticagrelor / prasugrel)</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step">Anticoagulante (heparina ou enoxaparina)</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step emerg-flow-shock">Cateterismo + angioplastia</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step emerg-flow-loop"><strong>Porta-balão ≤ 90 min</strong></span>
          </div>
        </div>

        <div class="emerg-flow-col emerg-flow-col-noshock">
          <h4>Fibrinólise (se ICP indisponível)</h4>
          <div class="emerg-flow-v">
            <span class="emerg-flow-step">Sem contraindicações + sintomas &lt; 12 h</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step">AAS + heparina + P2Y12 conforme protocolo</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step">Alteplase / tenecteplase / reteplase / estreptoquinase</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step emerg-flow-shock">Transferir para ICP após lise (estratégia farmaco-invasiva)</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step emerg-flow-loop"><strong>Porta-agulha ≤ 30 min</strong></span>
          </div>
        </div>
      </div>

      <h4>Contraindicações absolutas à fibrinólise</h4>
      <ul>
        <li>AVC hemorrágico ou isquêmico &lt; 3 meses</li>
        <li>Neoplasia / MAV cerebral, dissecção aórtica</li>
        <li>Sangramento ativo, cirurgia maior &lt; 3 semanas</li>
        <li>Trauma craniano grave recente</li>
      </ul>
      <p class="emerg-note">Porta-balão = tempo da chegada ao hospital até inflação do balão. Porta-agulha = chegada até início da fibrinólise.</p>
    `
  },
  {
    id: 'nstemi-ua',
    icon: '📊',
    name: 'NSTEMI / Angina instável',
    html: `
      <p>Sem supra ST — estratificar risco (GRACE) e definir estratégia invasiva precoce ou conservadora.</p>

      <div class="emerg-flow-v">
        <span class="emerg-flow-step">Confirmar ausência de STEMI no ECG</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Troponina elevada (NSTEMI) ou normal com alta suspeita (AI)</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">AAS + P2Y12 + anticoagulação</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-decision">Calcular escore GRACE</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-shock"><strong>GRACE ≥ 140</strong> → estratégia invasiva &lt; <strong>24 h</strong></span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">GRACE 109–139 → invasiva &lt; 72 h (alto risco)</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">GRACE &lt; 109 → avaliar estratégia conservadora / invasiva eletiva</span>
      </div>

      <table class="emerg-table">
        <tr><th>GRACE (mortalidade hospitalar)</th><th>Estratégia sugerida</th></tr>
        <tr><td><strong>≥ 140</strong></td><td>Muito alto risco — cateterismo &lt; <strong>24 h</strong></td></tr>
        <tr><td>109 – 139</td><td>Alto risco — invasiva &lt; 72 h</td></tr>
        <tr><td>&lt; 109</td><td>Risco intermediário/baixo — individualizar</td></tr>
      </table>

      <h4>Indicadores de invasão imediata (&lt; 2 h) — independente do GRACE</h4>
      <ul>
        <li>Instabilidade hemodinâmica ou arritmia ameaçadora à vida</li>
        <li>Dor torácica refratária ao tratamento médico</li>
        <li>Complicações mecânicas (IAM com choque, MR aguda, VSR)</li>
        <li>Arritmias ventriculares recorrentes</li>
      </ul>
      <p class="emerg-note">Use a calculadora GRACE nas Calculadoras essenciais (Cardiologia) para estratificação precisa.</p>
    `
  },
  {
    id: 'ecg-modelos',
    icon: '📋',
    name: 'Modelos de ECG — SCA',
    html: `
      <p>Traçados reais de referência — compare com o ECG do paciente. <strong>Clique em qualquer imagem para ampliar.</strong> Fonte: Wikimedia Commons (domínio público / CC).</p>

      <div class="emerg-ecg-gallery">
        <div class="emerg-ecg-gallery-item emerg-rhythm-card emerg-rhythm-card-shock">
          <span class="emerg-rhythm-tag emerg-rhythm-tag-shock">STEMI</span>
          <figure class="emerg-ecg-figure">
            <img src="assets/ecg/sca/ecg-stemi-anterior.jpg" alt="ECG 12 derivações: IAM anterior com supra de ST" class="emerg-ecg-img emerg-ecg-img-strip" loading="lazy">
            <figcaption>IAM anterior — derivações precordiais</figcaption>
          </figure>
          <p><strong>Supra de ST</strong> em V1–V4 (≥ 2 mm em V2–V3 conforme sexo). Conduta: reperfusão imediata (ICP ou fibrinólise).</p>
        </div>

        <div class="emerg-ecg-gallery-item emerg-rhythm-card emerg-rhythm-card-shock">
          <span class="emerg-rhythm-tag emerg-rhythm-tag-shock">STEMI</span>
          <figure class="emerg-ecg-figure">
            <img src="assets/ecg/sca/ecg-stemi-anterior-clinical.jpg" alt="ECG clínico: supra de ST extenso em derivações anteriores" class="emerg-ecg-img emerg-ecg-img-clinical" loading="lazy">
            <figcaption>IAM anterior — supra ST extenso</figcaption>
          </figure>
          <p><strong>Supra de ST</strong> em derivações anteriores (V2–V6). Pode evoluir com ondas Q. Acionar hemodinâmica — <strong>porta-balão ≤ 90 min</strong>.</p>
        </div>

        <div class="emerg-ecg-gallery-item emerg-rhythm-card emerg-rhythm-card-shock">
          <span class="emerg-rhythm-tag emerg-rhythm-tag-shock">STEMI</span>
          <figure class="emerg-ecg-figure">
            <img src="assets/ecg/sca/ecg-stemi-inferior.jpg" alt="ECG 12 derivações: IAM inferior com supra ST em II III aVF" class="emerg-ecg-img emerg-ecg-img-strip" loading="lazy">
            <figcaption>IAM inferior — II, III, aVF</figcaption>
          </figure>
          <p><strong>Supra de ST</strong> em II, III e aVF. Observar <strong>infradesnivelamento recíproco</strong> em D1/aVL. Considerar IAM de VD se V1 + V4R.</p>
        </div>

        <div class="emerg-ecg-gallery-item emerg-rhythm-card emerg-rhythm-card-noshock">
          <span class="emerg-rhythm-tag emerg-rhythm-tag-noshock">NSTEMI / AI</span>
          <figure class="emerg-ecg-figure">
            <img src="assets/ecg/sca/ecg-nstemi-ischaemia.jpg?v=2" alt="ECG: ST deprimido horizontal — padrão de isquemia subendocárdica (V4–V6)" class="emerg-ecg-img emerg-ecg-img-clinical" loading="lazy">
            <figcaption>Isquemia subendocárdica</figcaption>
          </figure>
          <p><strong>ST deprimido</strong> horizontal ou descendente ≥ 0,5 mm em ≥ 2 derivações contíguas, ou inversão de T. Troponina ↑ = NSTEMI; normal = angina instável. Calcular <strong>GRACE</strong>.</p>
        </div>

        <div class="emerg-ecg-gallery-item emerg-rhythm-card emerg-rhythm-card-shock">
          <span class="emerg-rhythm-tag emerg-rhythm-tag-shock">EQUIVALENTE STEMI</span>
          <figure class="emerg-ecg-figure">
            <img src="assets/ecg/sca/ecg-lbbb-novo.jpg" alt="ECG: bloqueio de ramo esquerdo novo em contexto de dor torácica" class="emerg-ecg-img emerg-ecg-img-clinical" loading="lazy">
            <figcaption>BRE novo ou presumivelmente novo</figcaption>
          </figure>
          <p><strong>Bloqueio de ramo esquerdo novo</strong> com dor torácica sugestiva = tratar como STEMI (reperfusão imediata). Usar critérios de Sgarbossa / Smith se BRE prévio.</p>
        </div>
      </div>

      <p class="emerg-note">Sempre correlacionar ECG com clínica, troponina seriada e repetir traçado se dor persistir ou piorar.</p>
    `
  }
];

const AVC_PROTOCOLS = [
  {
    id: 'fast',
    icon: '🚑',
    name: 'Fluxo FAST',
    html: `
      <p>Reconhecimento <strong>pré-hospitalar</strong> — identificar AVC, anotar horário e acionar SAMU. Meta: <strong>porta-agulha ≤ 60 min</strong> / <strong>porta-puncao ≤ 90 min</strong> no hospital de referência.</p>

      <h4>Mnemônico FAST</h4>
      <div class="emerg-rhythm-grid emerg-rhythm-grid-2">
        <div class="emerg-rhythm-card">
          <span class="emerg-rhythm-tag emerg-rhythm-tag-shock">F — Face</span>
          <p><strong>Assimetria facial</strong> — pedir para sorrir. Queda de um canto da boca, paralisia facial.</p>
        </div>
        <div class="emerg-rhythm-card">
          <span class="emerg-rhythm-tag emerg-rhythm-tag-shock">A — Arms</span>
          <p><strong>Queda de um braço</strong> — pedir para elevar os dois braços por 10 s. Queda unilateral ou pronación.</p>
        </div>
        <div class="emerg-rhythm-card">
          <span class="emerg-rhythm-tag emerg-rhythm-tag-shock">S — Speech</span>
          <p><strong>Fala alterada</strong> — pedir para repetir frase simples. Disartria, afasia, mudança súbita da fala.</p>
        </div>
        <div class="emerg-rhythm-card emerg-rhythm-card-shock">
          <span class="emerg-rhythm-tag emerg-rhythm-tag-shock">T — Time</span>
          <p><strong>Tempo é cérebro</strong> — anotar <strong>horário exato</strong> do início dos sintomas ou último momento conhecido bem (LKW). Ligar <strong>192 (SAMU)</strong> imediatamente.</p>
        </div>
      </div>

      <h4>BE-FAST (extensão recomendada)</h4>
      <ul>
        <li><strong>B — Balance:</strong> perda súbita de equilíbrio, vertigem, ataxia</li>
        <li><strong>E — Eyes:</strong> perda visual súbita unilateral ou diplopia</li>
      </ul>

      <div class="emerg-flow-v">
        <span class="emerg-flow-step">Suspeita FAST/BE-FAST positivo</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Anotar horário dos sintomas / LKW</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Acionar SAMU — informar suspeita de <strong>AVC</strong></span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Posicionar paciente (decúbito lateral se rebaixamento), manter VA pérvia</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Glicemia capilar — hipoglicemia mimetiza AVC</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Oxigênio se SpO₂ &lt; 94%; evitar hiper/hipotensão</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-shock">Transporte direto ao centro com capacidade de <strong>TC + trombólise/trombectomia</strong></span>
      </div>

      <h4>Não fazer no pré-hospitalar</h4>
      <ul>
        <li>Não administrar AAS ou anticoagulante antes da TC</li>
        <li>Não atrasar transporte para exame no local</li>
        <li>Não dar alimentação ou líquidos (risco de broncoaspiração)</li>
      </ul>
      <p class="emerg-note">LKW = Last Known Well — último momento em que o paciente estava assintomático. Despertar com déficit: horário do despertar = início.</p>
    `
  },
  {
    id: 'trombolise',
    icon: '💉',
    name: 'Protocolo Trombólise',
    html: `
      <p>Alteplase IV (rt-PA) — janela terapêutica <strong>0–4 h 30 min</strong> do início dos sintomas ou LKW. Exige <strong>TC de crânio sem sangramento</strong> antes da infusão.</p>

      <div class="emerg-flow-v">
        <span class="emerg-flow-step">Chegada — ABC, PA, glicemia, SpO₂, ECG</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step"><strong>TC crânio sem contraste em ≤ 25 min</strong> (porta-imagem)</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Confirmar AVC isquêmico + janela ≤ 4 h 30</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">NIHSS + revisar contraindicações ABS/REL</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">PA &lt; 185/110 mmHg (tratar se necessário antes da lise)</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-shock">Alteplase <strong>0,9 mg/kg</strong> IV (máx. 90 mg)</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">10% em bolus · 90% em infusão contínua <strong>60 min</strong></span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Internação UTI/AVC — neurochecks seriados</span>
      </div>

      <table class="emerg-table">
        <tr><th>Janela</th><th>Indicação</th></tr>
        <tr><td><strong>0 – 3 h</strong></td><td>Indicação clássica — avaliar ABS/REL padrão</td></tr>
        <tr><td><strong>3 – 4 h 30</strong></td><td>Indicação estendida — aplicar exclusões adicionais (REL 3–4,5 h)</td></tr>
        <tr><td>&gt; 4 h 30</td><td><strong>Não trombolisar</strong> — avaliar trombectomia se LVO + critérios de imagem</td></tr>
      </table>

      <h4>Contraindicações absolutas (ABS)</h4>
      <ul>
        <li>TC: hemorragia intracraniana ou sangramento ativo</li>
        <li>AVC isquêmico nos <strong>últimos 3 meses</strong></li>
        <li>Trauma craniano grave ou AVC hemorrágico prévio</li>
        <li>Neoplasia intracraniana ou MAV conhecida</li>
        <li>Cirurgia intracraniana / espinhal recente</li>
        <li>PA &gt; 185/110 mmHg refratária ao tratamento</li>
        <li>Plaquetas &lt; 100 000/mm³ · INR &gt; 1,7 · TP &gt; 15 s (varfarina)</li>
        <li>Uso de DOAC com efeito anticoagulante relevante (conforme protocolo local)</li>
        <li>Glicemia &lt; 50 ou &gt; 400 mg/dL</li>
        <li>Infarto multilobar (&gt; 1/3 território ACM na TC)</li>
        <li>Dissecção aórtica · endocardite · plaquetopenia / coagulopatia grave</li>
      </ul>

      <h4>Contraindicações relativas (REL)</h4>
      <ul>
        <li>AVC leve com recuperação rápida (TIA) — não indicar lise</li>
        <li>Gravidez · cirurgia maior recente · sangramento GI/URINário &lt; 21 dias</li>
        <li>IAM recente · punção arterial não compressível &lt; 7 dias</li>
        <li>Convulsão no início se déficit persiste</li>
      </ul>

      <h4>Exclusões adicionais na janela 3 – 4 h 30 (REL)</h4>
      <ul>
        <li>Idade <strong>&gt; 80 anos</strong></li>
        <li>Anticoagulação oral (independente do INR)</li>
        <li><strong>NIHSS &gt; 25</strong></li>
        <li>História prévia de <strong>AVC + diabetes mellitus</strong></li>
      </ul>

      <h4>Pós-trombólise — monitorização</h4>
      <ul>
        <li>Neurochecks: <strong>q 15 min</strong> durante infusão; q 30 min × 6 h; depois q 1 h × 16 h</li>
        <li>PA alvo geral: &lt; 180/105 mmHg nas primeiras 24 h</li>
        <li>Evitar AAS, heparina ou anticoagulante nas <strong>24 h</strong> (salvo indicação formal)</li>
        <li>TC de controle se deterioração neurológica</li>
      </ul>
      <p class="emerg-note">Referência: AHA/ASA 2019 · SBACV. Adaptar às diretrizes e formulário institucional. Meta porta-agulha ≤ 60 min.</p>
    `
  },
  {
    id: 'trombectomia',
    icon: '🔬',
    name: 'Trombectomia mecânica',
    html: `
      <p>Retirada do trombo em <strong>oclusão de grande vaso (LVO)</strong>. Janela clássica <strong>0–6 h</strong>; selecionados até <strong>24 h</strong> com critérios de imagem avançada (DAWN / DEFUSE-3).</p>

      <div class="emerg-flow-v">
        <span class="emerg-flow-step">AVC isquêmico + janela ≤ 24 h</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step"><strong>TC crânio</strong> + <strong>AngioTC</strong> (ou RM) — buscar LVO</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-decision">LVO em grande vaso?</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Calcular <strong>ASPECTS</strong> na TC sem contraste</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Trombólise IV se ≤ 4 h 30 e elegível (antes ou paralelo à MT)</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-shock">Acionar neurointervenção — <strong>trombectomia</strong></span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-loop">Meta porta-puncao ≤ 90 min · reperfusão TICI 2b–3</span>
      </div>

      <h4>LVO — vasos-alvo</h4>
      <table class="emerg-table">
        <tr><th>Vaso</th><th>Localização</th></tr>
        <tr><td><strong>ACI</strong></td><td>Carótida interna (cervical/intracraniana)</td></tr>
        <tr><td><strong>M1</strong></td><td>Segmento M1 da ACM</td></tr>
        <tr><td><strong>M2 proximal</strong></td><td>Divisão superior/inferior da ACM (proximal)</td></tr>
        <tr><td><strong>Basilar</strong></td><td>Artéria basilar (AVC posterior — prioridade máxima)</td></tr>
      </table>

      <h4>ASPECTS (Alberta Stroke Program Early CT Score)</h4>
      <p>Escore na <strong>TC sem contraste</strong> — avalia extensão de isquemia precoce. Pontuação inicial <strong>10</strong>; subtrair <strong>1 ponto</strong> por região com alteração isquêmica precoce:</p>
      <table class="emerg-table">
        <tr><th>Região (território ACM)</th><th>Região (território ACM)</th></tr>
        <tr><td>C · L · IC · I · M1 · M2</td><td>M3 · M4 · M5 · M6</td></tr>
      </table>
      <ul>
        <li><strong>C</strong> = caudado · <strong>L</strong> = lentiforme · <strong>IC</strong> = cápsula interna · <strong>I</strong> = ínsula</li>
        <li><strong>M1–M6</strong> = territórios corticais da ACM (anterior → posterior)</li>
      </ul>

      <table class="emerg-table">
        <tr><th>Janela</th><th>Critérios resumidos</th></tr>
        <tr><td><strong>0 – 6 h</strong></td><td>LVO + ASPECTS <strong>≥ 6</strong> + NIHSS tipicamente ≥ 6 (anterior)</td></tr>
        <tr><td><strong>6 – 24 h</strong></td><td>LVO anterior: mismatch perfusão/núcleo (CTP/RM) ou critérios DAWN (NIHSS + idade + core infarct)</td></tr>
        <tr><td><strong>Basilar</strong></td><td>LVO basilar — janela ampliada; não usar ASPECTS; tratar como emergência absoluta</td></tr>
      </table>

      <h4>Estratégias de rede</h4>
      <ul>
        <li><strong>Mothership:</strong> transporte direto ao centro com neurointervenção</li>
        <li><strong>Drip-and-ship:</strong> trombólise no hospital periférico + transferência imediata para MT</li>
        <li>Contato precoce com equipe de neurointervenção assim que LVO confirmado</li>
      </ul>
      <p class="emerg-note">ASPECTS ≤ 5 ou extensa área de infarto na TC basal sugere menor benefício — individualizar com imagem avançada. Basilar: considerar MT mesmo com NIHSS baixo se LVO confirmado.</p>
    `
  },
  {
    id: 'nihss',
    icon: '📋',
    name: 'NIHSS',
    html: `
      <p><strong>NIH Stroke Scale</strong> — padroniza gravidade do déficit neurológico (0–42). Preencha cada item e calcule para ver classificação e conduta sugerida.</p>

      <div class="calc-block calc-block-single emerg-calc-block emerg-calc-wide">
        <form class="calc-form" data-emerg-calc="nihss">
          ${typeof NIHSS_FORM_HTML !== 'undefined' ? NIHSS_FORM_HTML : '<p class="muted">Recarregue a página para carregar a calculadora.</p>'}
          <button type="submit">Calcular NIHSS</button>
        </form>
        <div class="calc-result" hidden></div>
      </div>

      <h4>Tabela de referência — interpretação</h4>
      <table class="emerg-table">
        <tr><th>NIHSS</th><th>Classificação</th><th>Implicação clínica</th></tr>
        <tr><td>0</td><td>Sem déficit</td><td>Investigar mimics; repetir avaliação</td></tr>
        <tr><td>1 – 4</td><td>AVC leve</td><td>Prognóstico favorável; avaliar elegibilidade à <strong>trombólise IV</strong> (janela ≤ 4 h 30)</td></tr>
        <tr><td>5 – 15</td><td>Moderado</td><td>Maioria dos candidatos à reperfusão (trombólise e/ou trombectomia se LVO)</td></tr>
        <tr><td>16 – 20</td><td>Moderado-grave</td><td>Alto risco; monitorização intensiva; reperfusão individualizada</td></tr>
        <tr><td>21 – 42</td><td>Grave</td><td>Déficit extenso; reperfusão conforme janela e imagem. <strong>NIHSS &gt; 25</strong> = contraindicação relativa adicional só na janela <strong>3–4,5 h</strong> para trombólise IV</td></tr>
      </table>

      <h4>Quando aplicar</h4>
      <ul>
        <li><strong>Admissão</strong> — antes de decidir trombólise / trombectomia</li>
        <li><strong>2 h e 24 h</strong> pós-trombólise (protocolo padrão)</li>
        <li><strong>Pré e pós trombectomia</strong> — documentar resposta (Δ NIHSS)</li>
        <li>Reavaliar se deterioração ou suspeita de transformação hemorrágica</li>
      </ul>
    `
  }
];

const SEPSE_PROTOCOLS = [
  {
    id: 'bundle-hora1',
    icon: '⏱️',
    name: 'Bundle Hora-1',
    html: `
      <p>Conjunto de medidas a iniciar na <strong>1ª hora</strong> após reconhecer sepse ou choque séptico. Meta: reperfusão tecidual precoce e ATB empírico adequado.</p>

      <div class="emerg-flow-v">
        <span class="emerg-flow-step emerg-flow-shock"><strong>1. Lactato sérico</strong> — dosar na admissão</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Se lactato &gt; 2 mmol/L → <strong>repetir em 2–4 h</strong> (ou conforme protocolo)</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-shock"><strong>2. Hemoculturas</strong> — ≥ 2 pares (aeróbia + anaeróbia) antes do ATB</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Não atrasar antibiótico &gt; 45 min por coleta — coletar e já preparar ATB</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-shock"><strong>3. Antibiótico de amplo espectro</strong> — <strong>≤ 1 h</strong> do reconhecimento</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Ajustar ao foco (pulmonar, urinário, abdominal, pele, neutropenia febril)</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-shock"><strong>4. Cristaloides</strong> — <strong>30 ml/kg</strong> IV</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Indicação: hipotensão (PAS &lt; 90 / PAM &lt; 65) ou lactato ≥ 4 mmol/L</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Infundir nas primeiras <strong>3 h</strong>; reavaliar congestão / sobrecarga</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-shock"><strong>5. Vasopressor</strong> — se PAM &lt; 65 mmHg durante ou após fluidos</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-loop">Noradrenalina 1ª linha · meta PAM ≥ 65 mmHg</span>
      </div>

      <table class="emerg-table">
        <tr><th>Elemento</th><th>Meta / detalhe</th></tr>
        <tr><td>Lactato</td><td>Basal + repetir se &gt; 2 mmol/L</td></tr>
        <tr><td>Hemocultura</td><td>Antes do ATB; não postergar ATB &gt; 45 min</td></tr>
        <tr><td>Antibiótico</td><td>Amplo espectro em <strong>≤ 1 h</strong></td></tr>
        <tr><td>Fluidos</td><td><strong>30 ml/kg</strong> cristaloide se hipotensão ou lactato ≥ 4</td></tr>
        <tr><td>Vasopressor</td><td>Noradrenalina se PAM &lt; 65 após/durante ressuscitação volêmica</td></tr>
      </table>

      <h4>Reconhecimento rápido (Sepsis-3)</h4>
      <ul>
        <li>Infecção suspeita/confirmada + disfunção orgânica (ΔSOFA ≥ 2 ou qSOFA ≥ 2)</li>
        <li>Choque séptico: necessidade de vasopressor para PAM ≥ 65 + lactato &gt; 2 mmol/L apesar de volume</li>
      </ul>
      <p class="emerg-note">Surviving Sepsis Campaign 2021 · Sepsis-3. Use calculadoras <strong>qSOFA</strong> e <strong>SOFA</strong> em Calculadoras essenciais. Adaptar ATB ao protocolo institucional e foco infeccioso.</p>
    `
  },
  {
    id: 'norepi-map',
    icon: '💉',
    name: 'Titulação de Noradrenalina',
    html: `
      <p>Vasopressor de <strong>1ª linha</strong> no choque séptico. Objetivo: <strong>PAM ≥ 65 mmHg</strong> e perfusão adequada (diurese, lactato, consciência).</p>

      <div class="emerg-flow-v">
        <span class="emerg-flow-step">PAM &lt; 65 mmHg após ou durante <strong>30 ml/kg</strong> de cristaloide</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Acesso venoso central preferencial (periférico temporário em emergência se necessário)</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-shock">Iniciar <strong>noradrenalina</strong> em BIC</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Titular a cada <strong>2–5 min</strong> conforme PAM alvo</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-decision">PAM ≥ 65 mmHg sustentada?</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Monitorar perfusão: diurese ≥ 0,5 ml/kg/h, lactato em queda, extremidades aquecidas</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-loop">Reavaliar volume · foco infeccioso · ATB · corticoide se indicado</span>
      </div>

      <table class="emerg-table">
        <tr><th>Parâmetro</th><th>Alvo</th></tr>
        <tr><td><strong>PAM</strong></td><td>≥ <strong>65 mmHg</strong> (individualizar 65–70 se idoso / HTA prévia)</td></tr>
        <tr><td>PAS / PAD</td><td>Evitar hipotensão sustentada; evitar hipertensão excessiva com vasopressor</td></tr>
        <tr><td>Diurese</td><td>≥ 0,5 ml/kg/h (sinal de perfusão, não isolado)</td></tr>
        <tr><td>Lactato</td><td>Queda ≥ 10% em 2 h ou ≥ 40% em 6 h (ver protocolo de reavaliação)</td></tr>
      </table>

      <h4>Esquema prático de titulação (noradrenalina)</h4>
      <ul>
        <li>Apresentação usual: 4–16 mg em 250 ml SG 5% (16–64 µg/ml) ou diluição institucional</li>
        <li>Início típico: <strong>0,05–0,1 µg/kg/min</strong> — ajustar conforme resposta</li>
        <li>Incrementos: dobrar ou +0,05 µg/kg/min a cada 2–5 min até PAM ≥ 65</li>
        <li>Dose usual: 0,1–0,5 µg/kg/min; doses altas → avaliar choque refratário</li>
      </ul>

      <h4>Se noradrenalina insuficiente</h4>
      <ul>
        <li>Adicionar <strong>vasopressina</strong> (0,03 U/min fixo) — poupar catecolamina</li>
        <li><strong>Epinefrina</strong> ou <strong>dobutamina</strong> se disfunção miocárdica / baixo débito associado</li>
        <li>Investigar foco não drenado, adequação do ATB, hemorragia, tamponamento</li>
      </ul>

      <h4>Evitar / cautela</h4>
      <ul>
        <li>Extravasamento periférico — risco de necrose; preferir acesso central</li>
        <li>Arritmias, isquemia miocárdica, extremidades frias com PAM “adequada”</li>
        <li>Não suspender vasopressor abruptamente — titular para baixo com PAM estável e lactato em queda</li>
      </ul>
      <p class="emerg-note">Referência: Surviving Sepsis Campaign 2021. Documentar dose de noradrenalina (µg/kg/min) e PAM a cada titulação.</p>
    `
  },
  {
    id: 'lactato-reavaliacao',
    icon: '📉',
    name: 'Reavaliação de Lactato',
    html: `
      <p>Lactato reflete hipoperfusão tecidual. Após ressuscitação inicial, a <strong>queda do lactato</strong> orienta resposta ao tratamento.</p>

      <h4>Metas de clearance</h4>
      <table class="emerg-table">
        <tr><th>Momento</th><th>Meta sugerida</th><th>Conduta se não atingir</th></tr>
        <tr><td><strong>2 h</strong></td><td>Queda ≥ 10% vs basal</td><td>Reavaliar volume, vasopressor, foco</td></tr>
        <tr><td><strong>6 h</strong></td><td><strong>Clearance ≥ 40%</strong> vs basal</td><td>Intensificar ressuscitação; UTI; revisar ATB e drenagem</td></tr>
        <tr><td>Qualquer</td><td>Lactato em ascensão</td><td>Choque refratário — equipe sênior, foco urgente, vasopressores</td></tr>
      </table>

      <p><strong>Fórmula:</strong> clearance (%) = [(lactato basal − lactato controle) / lactato basal] × 100</p>

      <div class="calc-block calc-block-single emerg-calc-block emerg-calc-wide">
        <form class="calc-form" data-emerg-calc="lactate-clearance">
          <label>Lactato basal (mmol/L)</label>
          <input name="lact0" type="number" step="0.1" min="0.1" required placeholder="Ex.: 4.2">
          <label>Lactato controle (mmol/L)</label>
          <input name="lact1" type="number" step="0.1" min="0" required placeholder="Ex.: 2.1">
          <label>Intervalo desde basal (horas)</label>
          <input name="horas" type="number" step="0.5" min="0.5" value="6" required placeholder="Ex.: 2 ou 6">
          <button type="submit">Calcular clearance</button>
        </form>
        <div class="calc-result" hidden></div>
      </div>

      <h4>Conduta conforme resposta</h4>
      <ul>
        <li><strong>Meta 6 h atingida (≥ 40%):</strong> manter monitorização; não suspender ATB precocemente</li>
        <li><strong>Queda parcial (10–40% em 6 h):</strong> otimizar vasopressor, volume cauteloso, repetir lactato</li>
        <li><strong>Sem queda ou ↑ lactato:</strong> repetir bundle — volume guiado por resposta, noradrenalina, busca de foco (abscesso, isquemia, cateter)</li>
        <li>Considerar ecocardiograma à beira-leito se suspeita de disfunção ventricular</li>
      </ul>
      <p class="emerg-note">Lactato isolado pode ser falsamente elevado (convulsão, catecolaminas, insuficiência hepática). Correlacionar com PAM, diurese e clínica. Calculadora também em Calculadoras essenciais → Avaliação geral.</p>
    `
  }
];

const TRAUMA_PROTOCOLS = [
  {
    id: 'atls-abcde',
    icon: '🅰️',
    name: 'ATLS — ABCDE',
    html: `
      <p>Abordagem sistemática do politraumatizado — <strong>primary survey</strong> identifica o que mata primeiro. Tratar cada letra antes de avançar; reavaliar continuamente.</p>

      <div class="emerg-flow-v">
        <span class="emerg-flow-step emerg-flow-shock"><strong>A — Airway (+ controle cervical)</strong></span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Via aérea pérvia? Fala, estridor, sangue/vômito, queimadura inalatória</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Manobra de elevação mandibular / chin-lift · colar cervical manual + colar rígido</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-shock"><strong>B — Breathing</strong></span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">FR, SpO₂, expansibilidade, murmúrio, crepitação, tórax instável / pneumotórax</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">O₂ · descompressão imediata se pneumotórax hipertensivo · drenagem torácica</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-shock"><strong>C — Circulation</strong></span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Pulso, PA, perfusão, sangramento externo — <strong>controlar hemorragia</strong></span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">2 acessos calibrosos · cristaloide restrito · hemostasia · MTP se choque hemorrágico</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-shock"><strong>D — Disability</strong></span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">GCS · pupilas · glicemia · déficit focal · analgesia adequada</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-shock"><strong>E — Exposure / Environment</strong></span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Retirar roupas · buscar lesões ocultas · prevenir hipotermia (cobertores, fluidos aquecidos)</span>
      </div>

      <h4>Lesões que matam primeiro (lembrete)</h4>
      <ul>
        <li><strong>A:</strong> obstrução, trauma maxilofacial, queimadura inalatória</li>
        <li><strong>B:</strong> pneumotórax hipertensivo, hemotórax maciço, contusão grave</li>
        <li><strong>C:</strong> hemorragia externa, choque hipovolêmico, tamponamento</li>
        <li><strong>D:</strong> TCE grave, intoxicação, hipoglicemia</li>
      </ul>
      <p class="emerg-note">Após estabilização → <strong>secondary survey</strong> (exame head-to-toe). Use calculadoras <strong>GCS</strong>, <strong>RTS</strong> e <strong>ISS</strong> em Calculadoras essenciais → Urgência.</p>
    `
  },
  {
    id: 'via-aerea-vortex',
    icon: '🌬️',
    name: 'Via Aérea Difícil (Vortex)',
    html: `
      <p>Abordagem <strong>Vortex</strong> — três grupos de dispositivos/técnicas. Após <strong>3 tentativas falhas</strong> em um grupo, passar ao próximo. Falha total → <strong>cricotireoidostomia</strong>.</p>

      <div class="emerg-rhythm-grid emerg-rhythm-grid-2">
        <div class="emerg-rhythm-card">
          <span class="emerg-rhythm-tag emerg-rhythm-tag-shock">Grupo 1 — Supraglótico</span>
          <p><strong>Máscara laríngea / SGA</strong> (i-gel, LMA, etc.)</p>
          <p>Melhor chance rápida se IOT falhou · oxigenação temporária</p>
        </div>
        <div class="emerg-rhythm-card">
          <span class="emerg-rhythm-tag emerg-rhythm-tag-shock">Grupo 2 — Glótico</span>
          <p><strong>Intubação orotraqueal</strong> + bougie / videolaringoscópio</p>
          <p>Máximo <strong>3 tentativas</strong> por operador · otimizar posição (HELP, ramp)</p>
        </div>
        <div class="emerg-rhythm-card emerg-rhythm-card-shock">
          <span class="emerg-rhythm-tag emerg-rhythm-tag-shock">Grupo 3 — Infraglótico</span>
          <p><strong>Cricotireoidostomia cirúrgica</strong> ou punção por agulha (ponte)</p>
          <p>Via aérea definitiva de resgate — <strong>CICO</strong> (Can't Intubate, Can't Oxygenate)</p>
        </div>
      </div>

      <div class="emerg-flow-v">
        <span class="emerg-flow-step">Pré-oxigenação 100% O₂ · posicionamento · aspiração</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Tentativa grupo atual (máx. <strong>3</strong> por técnica/operador)</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-decision">Oxigenação/ventilação OK?</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Não → próximo grupo do Vortex (não repetir mesma técnica &gt; 3×)</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-shock"><strong>CICO</strong> — cricotireoidostomia imediata</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-loop">Confirmar capnografia · Rx tórax · analgesia/sedação pós-via aérea</span>
      </div>

      <h4>Regras práticas</h4>
      <ul>
        <li>Anunciar <strong>“via aérea difícil”</strong> e chamar ajuda cedo</li>
        <li>Limitar tentativas de laringoscópia — hipóxia mata mais que IOT atrasada</li>
        <li>Manter saturação com máscara + SGA enquanto prepara cricotireoidostomia</li>
        <li>Controle cervical: colar + movimentação mínima</li>
      </ul>
      <p class="emerg-note">Vortex Approach (Higgs et al.). Em crianças &lt; 10–12 anos preferir traqueostomia de emergência ou punção conforme expertise local.</p>
    `
  },
  {
    id: 'mtp-transfusao',
    icon: '🩸',
    name: 'MTP — Transfusão maciça',
    html: `
      <p>Protocolo de transfusão maciça no trauma hemorrágico — proporção balanceada <strong>1:1:1</strong> (CH : PFC : plaquetas) + <strong>ácido tranexâmico (TXA)</strong> ≤ 3 h do trauma.</p>

      <div class="emerg-flow-v">
        <span class="emerg-flow-step">Reconhecer choque hemorrágico / sangramento maciço</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-shock"><strong>TXA 1 g IV</strong> em 10 min — se trauma ≤ <strong>3 horas</strong></span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Segunda dose 1 g em infusão 8 h (protocolo CRASH-2 / institucional)</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Acionar banco de sangue — <strong>MTP 1:1:1</strong></span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Controle de hemorragia paralelo (compressão, torniquete, cirurgia, REBOA conforme centro)</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Monitorizar Ca²⁺, K⁺, temperatura, coagulograma, fibrinogênio</span>
      </div>

      <table class="emerg-table">
        <tr><th>Componente</th><th>Proporção / meta</th></tr>
        <tr><td>Concentrado de hemácias</td><td>Parte do ratio <strong>1:1:1</strong></td></tr>
        <tr><td>Plasma fresco congelado</td><td>Parte do ratio <strong>1:1:1</strong></td></tr>
        <tr><td>Plaquetas</td><td>Parte do ratio <strong>1:1:1</strong> (1 pool = ~6 unidades)</td></tr>
        <tr><td><strong>TXA</strong></td><td>1 g bolus + 1 g/8 h se ≤ <strong>3 h</strong> do trauma</td></tr>
        <tr><td>Crioprecipitado</td><td>Se fibrinogênio &lt; 1,5 g/L (ou &lt; 2 com sangramento ativo)</td></tr>
      </table>

      <h4>Quando acionar MTP (exemplos)</h4>
      <ul>
        <li>PAS &lt; 90 + lactato ↑ ou BE &lt; −6</li>
        <li>SBC score ≥ 2 ou ABC score ≥ 2</li>
        <li>Sangramento visível maciço / pelve instável / tórax/abdome com instabilidade</li>
        <li>≥ 4 CH em 1 h ou ≥ 10 CH em 24 h</li>
      </ul>

      <h4>Adjuntos essenciais</h4>
      <ul>
        <li><strong>Ácido tranexâmico:</strong> não iniciar se &gt; 3 h do trauma (sem benefício — CRASH-2)</li>
        <li><strong>Cloreto de cálcio:</strong> após cada 4 CH (hipocalcemia citratada)</li>
        <li><strong>Aquecer</strong> paciente e hemocomponentes — evitar tríade letal</li>
        <li>Restringir cristaloide após MTP — evitar diluição/coagulopatia</li>
      </ul>
      <p class="emerg-note">Propper et al. / TCCC / CRASH-2. Adaptar ao protocolo do banco de sangue e centro de trauma local.</p>
    `
  },
  {
    id: 'pecarn-tce',
    icon: '👶',
    name: 'PECARN — TCE pediátrico',
    html: `
      <p>Regra clínica para decidir <strong>TC de crânio vs observação</strong> em TCE leve (GCS 14–15) em crianças &lt; 18 anos — reduz exposição desnecessária à radiação.</p>

      <div class="calc-block calc-block-single emerg-calc-block emerg-calc-wide">
        <form class="calc-form" data-emerg-calc="pecarn" data-emerg-calc-inject>
          <button type="submit">Avaliar PECARN</button>
        </form>
        <div class="calc-result" hidden></div>
      </div>

      <h4>Interpretação rápida</h4>
      <table class="emerg-table">
        <tr><th>Risco</th><th>Conduta</th></tr>
        <tr><td><strong>Alto</strong> (GCS &lt;15, alteração consciência, fratura/base de crânio)</td><td><strong>TC de crânio</strong></td></tr>
        <tr><td><strong>Intermediário</strong> (critérios específicos por idade)</td><td>Decisão compartilhada — observação vs TC</td></tr>
        <tr><td><strong>Baixo</strong></td><td>TC <strong>não indicada</strong> — observação ambulatorial/hospitalar conforme clínica</td></tr>
      </table>

      <h4>Observação segura (baixo risco)</h4>
      <ul>
        <li>Orientar sinais de alarme: vômitos repetidos, sonolência, convulsão, cefaleia progressiva</li>
        <li>Retorno se piora neurológica</li>
        <li>GCS 14–15 no momento da avaliação — se GCS &lt; 14, não aplicar PECARN</li>
      </ul>
      <p class="emerg-note">Kuppermann et al., Lancet 2009 (PECARN). Não substitui julgamento clínico em mecanismo grave ou coagulopatia.</p>
    `
  }
];

const VIA_AEREA_PROTOCOLS = [
  {
    id: 'rsi-7-passos',
    icon: '💉',
    name: 'Sequência Rápida de Intubação em 7 Passos',
    html: `
      <p>Sequência rápida de intubação — sedação + bloqueador neuromuscular, <strong>sem ventilação manual</strong> entre indução e laringoscopia (exceto se hipóxia).</p>

      <div class="emerg-flow-v">
        <span class="emerg-flow-step emerg-flow-shock"><strong>1. PREPARE</strong> — preparo</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Equipe, monitor, aspirador, tubos (±1 tamanho), SGA, plano B/C (Vortex)</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-shock"><strong>2. Pré-oxigenação</strong></span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">O₂ 100% 3–5 min ou 8 VC · meta SpO₂ &gt; 95%</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-shock"><strong>3. Pré-tratamento</strong> (opcional)</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Fentanil (TCE/HTIC) · atropina (&lt;1 ano) · lidocaíva (asma/HTIC) — conforme cenário</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-shock"><strong>4. Paralisia + sedação</strong></span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Indução (etomidato, cetamina, propofol) + BNM (succinilcolina ou rocurônio)</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-shock"><strong>5. Posicionamento</strong></span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Sniffing / ramp · laringoscopia ótima</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-shock"><strong>6. Passagem com prova</strong></span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">IOT + <strong>capnografia</strong> (onda quadrada) · ausculta · fixação</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-shock"><strong>7. Pós-IOT</strong></span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Ventilador, sedação/analgesia, Rx tórax, DOPE se dessaturação</span>
      </div>

      <h4>Calculadora — doses, apresentações e fluxo</h4>
      <p>Escolha o fluxo (<strong>sequência rápida</strong> ou <strong>pré-oxigenação reforçada</strong>), marque os fármacos do plano e selecione a ampola disponível no seu serviço.</p>

      <div class="calc-block calc-block-single emerg-calc-block emerg-calc-wide">
        <form class="calc-form" data-emerg-calc="rsi-farmacos" data-emerg-calc-inject>
          <button type="submit">Gerar plano de intubação</button>
        </form>
        <div class="calc-result" hidden></div>
      </div>

      <h4>Referência rápida — doses adulto (mg/kg)</h4>
      <table class="emerg-table">
        <tr><th>Categoria</th><th>Fármaco</th><th>Dose usual</th><th>Indicação / nota</th></tr>
        <tr><td rowspan="3">Pré-tratamento</td><td>Midazolam</td><td>0,02–0,05 mg/kg</td><td>Pré-medicação / co-indução</td></tr>
        <tr><td>Fentanil</td><td>1–3 mcg/kg</td><td>TCE / HTIC — lento</td></tr>
        <tr><td>Lidocaína</td><td>1–1,5 mg/kg (máx. 100 mg)</td><td>HTIC / asma</td></tr>
        <tr><td rowspan="3">Indução</td><td>Propofol</td><td>1–2 mg/kg</td><td>Estável hemodinamicamente</td></tr>
        <tr><td>Etomidato</td><td>0,3 mg/kg</td><td>Choque / instabilidade</td></tr>
        <tr><td>Cetamina</td><td>1–2 mg/kg</td><td>Hipotensão / asma / broncoespasmo</td></tr>
        <tr><td rowspan="2">BNM</td><td>Succinilcolina</td><td>1–1,5 mg/kg</td><td>Início rápido</td></tr>
        <tr><td>Rocurônio</td><td>1–1,2 mg/kg</td><td>Alternativa (via aérea difícil prevista)</td></tr>
      </table>
      <p class="emerg-note">Adaptar doses ao choque, TCE, gravidez e idade. Sempre ter plano de via aérea difícil (Vortex) — ver Trauma &amp; Suporte Avançado.</p>
    `
  },
  {
    id: 'dope-pos-iot',
    icon: '🚨',
    name: 'Hipoxemia pós-IOT — DOPE',
    html: `
      <p>Queda de SpO₂ ou aumento de pressão de pico <strong>logo após intubação</strong> — usar mnemônico <strong>DOPE</strong> antes de aumentar FiO₂ cegamente.</p>

      <div class="emerg-rhythm-grid emerg-rhythm-grid-2">
        <div class="emerg-rhythm-card emerg-rhythm-card-shock">
          <span class="emerg-rhythm-tag emerg-rhythm-tag-shock">D — Displacement</span>
          <p><strong>Deslocamento do tubo</strong> — bronco principal, extubação parcial</p>
          <p>Confirmar profundidade (21–23 cm incisivos adulto) · capnografia · ausculta bilateral</p>
        </div>
        <div class="emerg-rhythm-card emerg-rhythm-card-shock">
          <span class="emerg-rhythm-tag emerg-rhythm-tag-shock">O — Obstruction</span>
          <p><strong>Obstrução</strong> — secreção, coágulo, mordida do tubo, kinking</p>
          <p>Aspirar traqueal · tubo orofaríngeo · relaxar se mordendo (BNM)</p>
        </div>
        <div class="emerg-rhythm-card emerg-rhythm-card-shock">
          <span class="emerg-rhythm-tag emerg-rhythm-tag-shock">P — Pneumothorax</span>
          <p><strong>Pneumotórax</strong> (hipertensivo) — desvio traqueal, MV abolido, instabilidade</p>
          <p>Descompressão imediata · drenagem torácica</p>
        </div>
        <div class="emerg-rhythm-card emerg-rhythm-card-shock">
          <span class="emerg-rhythm-tag emerg-rhythm-tag-shock">E — Equipment</span>
          <p><strong>Equipamento</strong> — desconexão, balão sem O₂, ventilador parado, FiO₂ baixa</p>
          <p>Verificar circuito, CO₂, entrada de O₂, alarmes</p>
        </div>
      </div>

      <div class="emerg-flow-v">
        <span class="emerg-flow-step">SpO₂ ↓ pós-IOT — chamar ajuda, FiO₂ 100%, manual ventilation</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-decision">DOPE — percorrer D → O → P → E</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Capnografia presente? Ausculta bilateral?</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Suspeita pneumotórax hipertensivo → descompressar antes de Rx</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-loop">Corrigir causa · Rx tórax · reavaliar gasometria</span>
      </div>

      <h4>Sinais por causa</h4>
      <table class="emerg-table">
        <tr><th>Causa</th><th>Pista clínica</th></tr>
        <tr><td>Deslocamento</td><td>Capnografia ↓/ausente unilateral, MV assimétrico</td></tr>
        <tr><td>Obstrução</td><td>Pressão de pico ↑, platô normal ou ↑, aspiração produtiva</td></tr>
        <tr><td>Pneumotórax</td><td>HIPOTENSÃO + MV abolido + hiperressonância / turgência jugular</td></tr>
        <tr><td>Equipamento</td><td>Alarme silencioso, tubo desconectado visível</td></tr>
      </table>
      <p class="emerg-note">Se não resolver rapidamente → considerar broncoespasmo, edema, hemotórax, TEP ou falha de oxigenação (shunt).</p>
    `
  },
  {
    id: 'desmame-ventilatorio',
    icon: '📉',
    name: 'Desmame Ventilatório',
    html: `
      <p>Estratificação para extubação — <strong>índice de Tobin (RSBI)</strong> e <strong>teste de respiração espontânea (TRE/SBT)</strong>.</p>

      <div class="calc-block calc-block-single emerg-calc-block emerg-calc-wide">
        <form class="calc-form" data-emerg-calc="tobin-rsbi" data-emerg-calc-inject>
          <button type="submit">Calcular índice de Tobin</button>
        </form>
        <div class="calc-result" hidden></div>
      </div>

      <h4>Índice de Tobin (RSBI)</h4>
      <p><strong>RSBI = FR / Vt (L)</strong> — calculado com paciente em respiração espontânea na ventilação mecânica.</p>
      <table class="emerg-table">
        <tr><th>RSBI</th><th>Interpretação</th></tr>
        <tr><td><strong>&lt; 80</strong></td><td>Favorável ao desmame</td></tr>
        <tr><td><strong>80 – 105</strong></td><td>Intermediário — individualizar TRE</td></tr>
        <tr><td><strong>&gt; 105</strong></td><td>Desfavorável — alto risco de falha na extubação</td></tr>
      </table>

      <h4>Teste de respiração espontânea (TRE / SBT)</h4>
      <div class="emerg-flow-v">
        <span class="emerg-flow-step">Pré-requisitos: causa aguda resolvida, estável hemodinamicamente, sem vasopressor crescente</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Oxigenação: PaO₂/FiO₂ ≥ 150–200 · PEEP ≤ 5–8 · FiO₂ ≤ 0,4–0,5</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Gasometria: pH ≥ 7,30 · sem hipercapnia progressiva</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-shock">TRE <strong>30–120 min</strong> (CPAP 5–7 ou T tubo conforme protocolo)</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-decision">Tolerou? (FR, FC, PA, SpO₂, sudorese, agitação)</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-loop">Sim → extubar · Não → retomar parâmetros e reavaliar causa</span>
      </div>

      <h4>Critérios de falha no TRE (parar teste)</h4>
      <ul>
        <li>SpO₂ &lt; 90% · PaO₂ &lt; 60 mmHg</li>
        <li>FR &gt; 35 ou &lt; 8 · FC &gt; 140 ou ↑/↓ &gt; 20%</li>
        <li>PAS &lt; 90 ou &gt; 180 mmHg · alteração de consciência</li>
        <li>Dioreses, agitação, uso de musculatura acessória</li>
      </ul>
      <p class="emerg-note">Boles GABA / ACCP guidelines. RSBI isolado não substitui julgamento clínico — tosse, secreção e nível de consciência importam.</p>
    `
  }
];

const REACOES_METABOLICAS_PROTOCOLS = [
  {
    id: 'anafilaxia',
    icon: '🐝',
    name: 'Anafilaxia',
    html: `
      <p>Reação alérgica sistêmica potencialmente fatal — <strong>adrenalina IM é a 1ª linha</strong>, sem substituir por anti-histamínico ou corticoide isolados.</p>

      <div class="emerg-flow-v">
        <span class="emerg-flow-step">Reconhecer: urticária + comprometimento respiratório ou cardiovascular (ou exposição + hipotensão)</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Decúbito dorsal + elevar MMII · O₂ · acesso venoso</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-shock"><strong>Adrenalina IM 0,5 mg</strong> (1:1000 = 0,5 mL) — face lateral da coxa</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Sem resposta em <strong>5–15 min</strong> → repetir adrenalina IM</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Cristaloide se hipotensão · nebulização β₂ se broncoespasmo</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Observação ≥ 4–6 h (reação bifásica) · prescrever autoinjetor</span>
      </div>

      <table class="emerg-table">
        <tr><th>Fármaco</th><th>Dose (adulto)</th><th>Observação</th></tr>
        <tr><td><strong>Adrenalina IM</strong></td><td><strong>0,5 mg</strong> (0,5 mL 1:1000)</td><td>Repetir q5–15 min · IV só se choque refratário e monitorizado</td></tr>
        <tr><td>Anti-H1</td><td>Prometazina ou difenidramina IV/IM</td><td>Adjuvante — <strong>não substitui</strong> adrenalina</td></tr>
        <tr><td>Corticoide</td><td>Hidrocortisona 200 mg IV ou prednisona VO</td><td>Previne reação tardia; efeito lento</td></tr>
        <tr><td>Glucagon</td><td>1–2 mg IV se β-bloqueador + anafilaxia refratária</td><td>Paciente em uso de β-bloqueador</td></tr>
      </table>

      <h4>Evitar / alertas</h4>
      <ul>
        <li>Não atrasar adrenalina · não usar apenas H1/corticoide na fase aguda</li>
        <li>Posição sentada se dispneia extrema; deitar se hipotenso</li>
        <li>Investigar gatilho (alimento, droga, veneno) — evitar reexposição</li>
      </ul>
      <p class="emerg-note">WAO / Resolução CFM anafilaxia. Crianças: 0,01 mg/kg IM (máx. 0,5 mg). Autoinjetor epinefrina na alta.</p>
    `
  },
  {
    id: 'hipoglicemia-grave',
    icon: '🍬',
    name: 'Hipoglicemia grave',
    html: `
      <p>Glicemia &lt; 54 mg/dL com alteração de consciência, convulsão ou incapacidade de ingerir — tratar <strong>imediato</strong>.</p>

      <div class="emerg-flow-v">
        <span class="emerg-flow-step">Confirmar glicemia capilar · ABC · via aérea se rebaixado</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-decision">Acesso venoso disponível?</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-shock"><strong>Sim → Glicose EV 25 g</strong> (SG 50% — 50 mL ou equivalente)</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step"><strong>Não → Glucagon 1 mg</strong> IM/SC (eficaz se estoques hepáticos OK)</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Repetir glicemia em <strong>15 min</strong> — nova dose se persiste &lt; 54</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Consciente → carboidrato oral + refeição · investigar causa</span>
      </div>

      <table class="emerg-table">
        <tr><th>Via</th><th>Conduta</th></tr>
        <tr><td><strong>EV</strong></td><td><strong>25 g glicose</strong> — SG 50% 50 mL (ou SG 10% 250 mL)</td></tr>
        <tr><td><strong>IM/SC</strong></td><td><strong>Glucagon 1 mg</strong> — se sem acesso ou falha EV</td></tr>
        <tr><td>Oral</td><td>15–20 g carboidrato rápido — só se alerta e deglute</td></tr>
      </table>

      <h4>Causas e condutas especiais</h4>
      <ul>
        <li><strong>Sulfonilureia:</strong> octreotide 50 µg SC q6h — glucagon pode ser insuficiente</li>
        <li>Insulinoma, etanol, insuficiência adrenal, sepse, IR avançada</li>
        <li>Internar se recorrente, sem causa clara ou incapaz de autogestão</li>
      </ul>
      <p class="emerg-note">ADA / Endocrine Society. Hipoglicemia mimetiza AVC — sempre dosar glicemia no plantão neurológico.</p>
    `
  },
  {
    id: 'hipercalemia',
    icon: '⚡',
    name: 'Hipercalemia ≥ 6,5',
    html: `
      <p>Hipercalemia com risco cardíaco — correlacionar <strong>ECG</strong> (ondas T altas, QRS largo, bradicardia, ritmo sinusoidal). K ≥ <strong>6,5 mEq/L</strong> ou alteração ECG = emergência.</p>

      <div class="emerg-flow-v">
        <span class="emerg-flow-step">Monitor cardíaco · ECG 12 derivações · repetir K+ sérico</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-shock"><strong>1. Cálcio IV</strong> — estabiliza membrana cardíaca (não baixa K+)</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Gluconato de cálcio 10% 10 mL EV em 2–3 min (ou Cloreto 10% 5 mL) — repetir se ECG persistente</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-shock"><strong>2. Insulina + Glicose</strong> — shift intracelular</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Insulina regular <strong>10 U EV</strong> + SG 50% <strong>25 g</strong> (monitorar glicemia q1h)</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">β₂-agonista inalatório (salbutamol 10–20 mg nebulização) — adjuvante</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-shock"><strong>3. Eliminação</strong> — resina ou diálise</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Poliestirenossulfonato (resina) VO/reto · patiromer conforme disponibilidade</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-loop"><strong>Diálise</strong> se K+ refratário, IRA, ECG grave ou sobrecarga volêmica</span>
      </div>

      <table class="emerg-table">
        <tr><th>Medida</th><th>Início de ação</th><th>Efeito</th></tr>
        <tr><td>Cálcio IV</td><td>1–3 min</td><td>Proteção cardíaca — não reduz K+</td></tr>
        <tr><td>Insulina + glicose</td><td>15–30 min</td><td>↓ K+ 0,6–1,0 mEq/L</td></tr>
        <tr><td>Salbutamol nebul</td><td>30 min</td><td>↓ K+ leve a moderado</td></tr>
        <tr><td>Resina / diurético</td><td>Horas</td><td>Eliminação — diálise se urgente</td></tr>
      </table>

      <h4>Causas frequentes</h4>
      <ul>
        <li>IRA, IECA/BRA, espironolactona, AINE, hemólise, rabdomiólise, acidose</li>
        <li>Suspender fontes de K+ · tratar acidose metabólica se presente</li>
      </ul>
      <p class="emerg-note">KDIGO / nefrologia. Bicarbonato só se acidose + hipercalemia; eficácia limitada isoladamente.</p>
    `
  },
  {
    id: 'dka-hhs',
    icon: '🩸',
    name: 'Cetoacidose Diabética / Estado Hiperosmolar',
    html: `
      <p>Cetoacidose diabética e estado hiperglicêmico hiperosmolar — fluido + insulina + <strong>reposição de K⁺</strong> guiada por níveis seriados.</p>

      <div class="emerg-flow-v">
        <span class="emerg-flow-step">ABC · glicemia · gasometria · eletrólitos · cetonas (β-hidroxibutirato) · osmolaridade</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-shock"><strong>1. Fluidos</strong> — SF 0,9% 15–20 mL/kg na 1ª hora (1–1,5 L/h adulto se choque)</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Reavaliar Na+ · trocar para SF 0,45% se hipernatremia · manter SF se choque</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-decision">K+ antes de insulina?</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">K &lt; 3,3 → repor K+ e <strong>adiar insulina</strong> · K 3,3–5,2 → insulina + K+ manutenção</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-shock"><strong>2. Insulina regular 0,1 U/kg/h EV</strong> (sem bolus ou bolus 0,1 U/kg conforme protocolo)</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Meta: queda glicemia 50–70 mg/dL/h · não normalizar glicemia na 1ª hora</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Glicemia &lt; 200–250 → adicionar SG 5–10% + manter insulina até clearance de cetonas</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-loop">Critérios de resolução → transição SC · tratar precipitante</span>
      </div>

      <table class="emerg-table">
        <tr><th>K+ sérico</th><th>Conduta</th></tr>
        <tr><td><strong>&lt; 3,3 mEq/L</strong></td><td>Repor K+ · <strong>adiar insulina</strong> até K ≥ 3,3</td></tr>
        <tr><td><strong>3,3 – 5,2</strong></td><td>Insulina + K+ 20–30 mEq/L de fluido (ajustar diurese)</td></tr>
        <tr><td><strong>&gt; 5,2</strong></td><td>Insulina sem K+ inicial · monitorar q2–4 h</td></tr>
      </table>

      <h4>Cetoacidose diabética vs estado hiperglicêmico hiperosmolar</h4>
      <table class="emerg-table">
        <tr><th></th><th>Cetoacidose diabética</th><th>Estado hiperglicêmico hiperosmolar</th></tr>
        <tr><td>Glicemia</td><td>≥ 250 mg/dL (geralmente)</td><td>≥ 600 mg/dL frequentemente</td></tr>
        <tr><td>pH / HCO₃</td><td>&lt; 7,3 / &lt; 18</td><td>&gt; 7,3 / &gt; 18</td></tr>
        <tr><td>Cetonas</td><td>Presentes</td><td>Ausentes ou leves</td></tr>
        <tr><td>Osmolaridade</td><td>Variável</td><td>&gt; 320 mOsm/kg</td></tr>
      </table>

      <h4>Resolução da cetoacidose diabética</h4>
      <ul>
        <li>pH &gt; 7,3 · HCO₃ &gt; 15 · glicemia &lt; 200 · cetonas negativas/traço</li>
        <li>Buscar infecção, IAM, suspensão de insulina, SGLT2 (cetoacidose euglicêmica)</li>
      </ul>
      <p class="emerg-note">ADA 2024 · calculadora de cetoacidose em Calculadoras essenciais → Endocrinologia. Estado hiperosmolar: hidratação mais prolongada; insulina em dose menor se indicada.</p>
    `
  }
];

const EMERGENCY_TOPICS = [
  {
    id: 'parada-cardio',
    icon: '⚡',
    name: 'Parada Cardiorrespiratória',
    protocols: PARADA_PROTOCOLS
  },
  {
    id: 'sca',
    icon: '❤️‍🔥',
    name: 'Síndromes Coronarianas Agudas',
    protocols: SCA_PROTOCOLS
  },
  {
    id: 'avc',
    icon: '🧠',
    name: 'AVC Isquêmico',
    protocols: AVC_PROTOCOLS
  },
  {
    id: 'sepse',
    icon: '🩸',
    name: 'Sepse & Choque Séptico',
    protocols: SEPSE_PROTOCOLS
  },
  {
    id: 'trauma',
    icon: '🆘',
    name: 'Trauma & Suporte Avançado',
    protocols: TRAUMA_PROTOCOLS
  },
  {
    id: 'via-aerea',
    icon: '🌬️',
    name: 'Via Aérea & Ventilação',
    protocols: VIA_AEREA_PROTOCOLS
  },
  {
    id: 'reacoes-metabolicas',
    icon: '💊',
    name: 'Reações Agudas & Metabólicas',
    protocols: REACOES_METABOLICAS_PROTOCOLS
  },
  {
    id: 'obstetricia',
    icon: '🤰',
    name: 'Obstetrícia de Urgência',
    protocols: []
  },
  {
    id: 'pediatrica',
    icon: '👶',
    name: 'Emergências Pediátricas',
    protocols: []
  },
  {
    id: 'toxicologia',
    icon: '☠️',
    name: 'Toxicologia & Ambientais',
    protocols: []
  },
  {
    id: 'pressao-arritmias',
    icon: '🔺',
    name: 'Pressão & Arritimias Agudas',
    protocols: []
  },
  {
    id: 'procedimentos',
    icon: '🛠️',
    name: 'Procedimentos & Checklists',
    protocols: []
  }
];

let currentEmergTopicId = null;
let currentEmergProtocolId = null;

function ensureEmergEcgLightbox () {
  if (document.getElementById('emerg-ecg-lightbox')) return;

  const lb = document.createElement('div');
  lb.id = 'emerg-ecg-lightbox';
  lb.className = 'emerg-ecg-lightbox';
  lb.hidden = true;
  lb.innerHTML = `
    <button type="button" class="emerg-ecg-lightbox-close" aria-label="Fechar">×</button>
    <figure class="emerg-ecg-lightbox-inner">
      <img id="emerg-ecg-lightbox-img" alt="">
      <figcaption id="emerg-ecg-lightbox-caption"></figcaption>
    </figure>
    <p class="emerg-ecg-lightbox-hint">Clique fora ou pressione Esc para fechar</p>`;
  document.body.appendChild(lb);

  const close = () => closeEmergEcgLightbox();
  lb.querySelector('.emerg-ecg-lightbox-close').addEventListener('click', close);
  lb.addEventListener('click', e => {
    if (e.target === lb) close();
  });
  lb.querySelector('.emerg-ecg-lightbox-inner').addEventListener('click', e => e.stopPropagation());
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !lb.hidden) close();
  });
}

function closeEmergEcgLightbox () {
  const lb = document.getElementById('emerg-ecg-lightbox');
  if (!lb || lb.hidden) return;
  lb.hidden = true;
  document.body.classList.remove('emerg-ecg-lightbox-open');
  const img = document.getElementById('emerg-ecg-lightbox-img');
  if (img) img.removeAttribute('src');
}

function initEmergEcgLightbox (container) {
  if (!container) return;
  ensureEmergEcgLightbox();

  const lb = document.getElementById('emerg-ecg-lightbox');
  const lbImg = document.getElementById('emerg-ecg-lightbox-img');
  const lbCaption = document.getElementById('emerg-ecg-lightbox-caption');

  container.querySelectorAll('.emerg-ecg-img').forEach(img => {
    if (img.dataset.ecgZoomBound) return;
    img.dataset.ecgZoomBound = '1';
    img.classList.add('emerg-ecg-img-clickable');
    img.title = 'Clique para ampliar';
    img.addEventListener('click', () => {
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt;
      const caption = img.closest('figure')?.querySelector('figcaption');
      lbCaption.textContent = caption?.textContent?.trim() || img.alt;
      lb.hidden = false;
      document.body.classList.add('emerg-ecg-lightbox-open');
    });
  });
}

function initEmergCalcForms (container) {
  if (!container) return;

  container.querySelectorAll('form[data-emerg-calc]').forEach(form => {
    if (form.dataset.emergCalcBound) return;

    const calcId = form.dataset.emergCalc;
    const calc = typeof CALC_FORMS !== 'undefined'
      ? CALC_FORMS[calcId]
      : null;

    if (calc && form.dataset.emergCalcInject && !form.dataset.emergCalcInjected) {
      const submitBtn = form.querySelector('button[type="submit"]');
      const tmp = document.createElement('div');
      tmp.innerHTML = calc.html;
      while (tmp.firstChild) {
        form.insertBefore(tmp.firstChild, submitBtn);
      }
      form.dataset.emergCalcInjected = '1';
    }

    if (calc && typeof calc.onRender === 'function') {
      calc.onRender(form);
    }

    form.dataset.emergCalcBound = '1';

    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!calc) return;

      const html = calc.calculate(form);
      const resultEl = form.parentElement.querySelector('.calc-result');
      if (resultEl && typeof html === 'string') {
        resultEl.innerHTML = html;
        resultEl.hidden = false;
        resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });
}

function initGuiaEmergencia () {
  const grid = document.getElementById('emerg-topic-grid');
  if (!grid) return;

  grid.innerHTML = EMERGENCY_TOPICS.map(topic => `
    <button type="button" class="calc-category-btn" data-emerg-topic="${topic.id}">
      <span class="calc-category-icon">${topic.icon}</span>
      <span class="calc-category-name">${topic.name}</span>
    </button>
  `).join('');

  grid.querySelectorAll('[data-emerg-topic]').forEach(btn => {
    btn.addEventListener('click', () => showEmergenciaTopic(btn.dataset.emergTopic));
  });
}

function showEmergenciaCategories () {
  const listView = document.getElementById('emerg-categories-view');
  const topicView = document.getElementById('emerg-topic-view');
  if (!listView || !topicView) return;

  currentEmergTopicId = null;
  currentEmergProtocolId = null;
  listView.hidden = false;
  topicView.hidden = true;
}

function showEmergenciaTopic (topicId) {
  const topic = EMERGENCY_TOPICS.find(t => t.id === topicId);
  if (!topic) return;

  currentEmergTopicId = topicId;
  currentEmergProtocolId = null;
  document.getElementById('emerg-categories-view').hidden = true;
  document.getElementById('emerg-topic-view').hidden = false;
  document.getElementById('emerg-topic-title').textContent = `${topic.icon} ${topic.name}`;

  const backBtn = document.getElementById('emerg-topic-back');
  backBtn.textContent = '← Voltar aos protocolos';
  backBtn.onclick = showEmergenciaCategories;

  const contentEl = document.getElementById('emerg-topic-content');
  const protocols = topic.protocols || [];

  if (protocols.length) {
    contentEl.innerHTML = `
      <p class="muted">Escolha o algoritmo que deseja consultar:</p>
      <div class="calc-category-grid">
        ${protocols.map(p => `
          <button type="button" class="calc-category-btn" data-emerg-protocol="${p.id}">
            <span class="calc-category-icon">${p.icon}</span>
            <span class="calc-category-name">${p.name}</span>
          </button>
        `).join('')}
      </div>`;

    contentEl.querySelectorAll('[data-emerg-protocol]').forEach(btn => {
      btn.addEventListener('click', () => showEmergenciaProtocol(btn.dataset.emergProtocol));
    });
    return;
  }

  if (topic.html && topic.html.trim()) {
    contentEl.innerHTML = topic.html;
    initEmergEcgLightbox(contentEl);
    return;
  }

  const expectedProtocols = { 'parada-cardio': 6, 'sca': 4, 'avc': 4, 'sepse': 3, 'trauma': 4, 'via-aerea': 3, 'reacoes-metabolicas': 4 };
  if (expectedProtocols[topicId]) {
    contentEl.innerHTML = `
      <p class="coming-soon"><strong>Arquivo desatualizado no navegador.</strong> Os protocolos de <em>${topic.name}</em> já existem no projeto, mas o navegador carregou uma versão antiga de <code>emergency-guide.js</code>.</p>
      <ul>
        <li>Feche esta aba e abra de novo: <code>C:\\Users\\User\\Desktop\\meu-app-medico\\app.html</code></li>
        <li>Pressione <strong>Ctrl+F5</strong> (ou abra em aba anônima)</li>
        <li>No menu lateral deve aparecer: <strong>Build 2026.06.08 · AVC</strong></li>
      </ul>
      <p class="emerg-note">Build esperado do guia: <strong>${MEDHUB_EMERG_BUILD}</strong> (arquivo <code>emergency-guide.js</code>)</p>`;
    return;
  }

  contentEl.innerHTML = `
    <p class="coming-soon">Conteúdo em construção — adicione algoritmos em <strong>emergency-guide.js</strong> no array <code>protocols</code> deste tópico.</p>`;
}

function showEmergenciaProtocol (protocolId) {
  const topic = EMERGENCY_TOPICS.find(t => t.id === currentEmergTopicId);
  if (!topic) return;

  const protocol = (topic.protocols || []).find(p => p.id === protocolId);
  if (!protocol) return;

  currentEmergProtocolId = protocolId;
  document.getElementById('emerg-topic-title').textContent = `${protocol.icon} ${protocol.name}`;

  const backBtn = document.getElementById('emerg-topic-back');
  backBtn.textContent = '← Voltar aos algoritmos';
  backBtn.onclick = () => showEmergenciaTopic(currentEmergTopicId);

  const contentEl = document.getElementById('emerg-topic-content');
  contentEl.innerHTML = `
    <div class="emerg-algo-block emerg-algo-single">
      ${protocol.html}
    </div>`;
  initEmergEcgLightbox(contentEl);
  initEmergCalcForms(contentEl);
}
