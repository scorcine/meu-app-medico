#!/usr/bin/env node
/* Utilitários compartilhados — pipeline flashcards MedHub + Inner AI */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { JSDOM } = require('jsdom');

const root = path.join(__dirname, '..');
const sourcesDir = path.join(root, 'flashcards-sources');
const exportDir = path.join(sourcesDir, 'export');
const draftsDir = path.join(sourcesDir, 'drafts');
const deckDir = path.join(root, 'flashcards');
const topicsPath = path.join(sourcesDir, 'topics.json');

const CLINICAL_FILES = [
  'pronto-socorro-content-1.js',
  'pronto-socorro-content-2.js',
  'pronto-socorro-content-3.js',
  'pronto-socorro-content-4.js',
  'pronto-socorro-content-5.js',
  'pronto-socorro.js',
  'emergency-guide.js',
  'interpretacao-exame-data.js'
];

function prepForSandbox (src) {
  return src
    .replace(/\bconst (PS_CONTENT_\d|PS_CONTENT|PS_CONDITIONS|INTERP_TOPICS|INTERP_CONTENT|EMERGENCY_TOPICS) =/g, 'globalThis.$1 =')
    .replace(/\bconst (PARADA_PROTOCOLS|SCA_PROTOCOLS|AVC_PROTOCOLS|SEPSE_PROTOCOLS|TRAUMA_PROTOCOLS|VIA_AEREA_PROTOCOLS|REACOES_METABOLICAS_PROTOCOLS|OBSTETRICIA_PROTOCOLS|PEDIATRIC_PROTOCOLS|TOXICOLOGIA_PROTOCOLS|PRESSAO_RITMO_PROTOCOLS|PROCEDIMENTOS_PROTOCOLS) =/g, 'globalThis.$1 =');
}

function loadClinicalContext () {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', { url: 'http://localhost/' });
  const sandbox = { document: dom.window.document, window: dom.window, console, globalThis: {} };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);

  CLINICAL_FILES.forEach(rel => {
    const file = path.join(root, rel);
    if (!fs.existsSync(file)) return;
    vm.runInContext(prepForSandbox(fs.readFileSync(file, 'utf8')), sandbox, { filename: rel });
  });

  return sandbox;
}

function loadDecks () {
  const ctx = { console };
  vm.createContext(ctx);

  fs.readdirSync(deckDir)
    .filter(f => f.startsWith('deck-') && f.endsWith('.js'))
    .sort()
    .forEach(file => {
      vm.runInContext(fs.readFileSync(path.join(deckDir, file), 'utf8'), ctx, { filename: file });
    });

  return Object.keys(ctx)
    .filter(k => k.startsWith('FLASHCARD_DECK_'))
    .map(k => {
      const deck = ctx[k];
      if (!deck) return null;
      if (deck.group && ctx.FLASHCARD_CARDIO_SUBTOPICS) {
        return {
          ...deck,
          cards: ctx.FLASHCARD_CARDIO_SUBTOPICS.flatMap(s => s.cards),
          subtopics: ctx.FLASHCARD_CARDIO_SUBTOPICS.map(s => ({
            id: s.id,
            name: s.name,
            count: s.cards.length
          }))
        };
      }
      return deck;
    })
    .filter(Boolean)
    .sort((a, b) => a.id.localeCompare(b.id, 'pt-BR'));
}

function loadTopicsConfig () {
  if (!fs.existsSync(topicsPath)) {
    throw new Error('Arquivo ausente: flashcards-sources/topics.json');
  }
  return JSON.parse(fs.readFileSync(topicsPath, 'utf8'));
}

function htmlToText (html) {
  if (!html || !String(html).trim()) return '';
  const dom = new JSDOM(`<div id="root">${html}</div>`, { url: 'http://localhost/' });
  return dom.window.document.getElementById('root').textContent
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function resolveSourceBlock (ctx, source) {
  const kind = source.kind;

  if (kind === 'ps') {
    const html = ctx.PS_CONTENT?.[source.conditionId];
    const cond = ctx.PS_CONDITIONS?.find(c => c.id === source.conditionId);
    return {
      label: `Prescrições PS — ${cond?.name || source.conditionId}`,
      text: htmlToText(html),
      missing: !html
    };
  }

  if (kind === 'emerg-topic') {
    const topic = ctx.EMERGENCY_TOPICS?.find(t => t.id === source.topicId);
    const chunks = [];
    if (topic?.html) chunks.push(htmlToText(topic.html));
    (topic?.protocols || []).forEach(p => {
      chunks.push(`${p.name}: ${htmlToText(p.html)}`);
    });
    return {
      label: `Guia de emergência — ${topic?.name || source.topicId}`,
      text: chunks.filter(Boolean).join('\n\n'),
      missing: !topic
    };
  }

  if (kind === 'interp') {
    const html = ctx.INTERP_CONTENT?.[source.topicId];
    const topic = ctx.INTERP_TOPICS?.find(t => t.id === source.topicId);
    return {
      label: `Interpretação do exame — ${topic?.name || source.topicId}`,
      text: htmlToText(html),
      missing: !html
    };
  }

  return { label: kind, text: '', missing: true };
}

function getDeckTopicEntry (config, deckId) {
  return config.decks.find(d => d.id === deckId);
}

function expectedCardsForDeck (config, deckId) {
  const entry = getDeckTopicEntry(config, deckId);
  return entry?.cardsPerDeck || config.cardsPerDeck || 30;
}

function buildExportMarkdown (deck, topicEntry, ctx) {
  const lines = [];
  const now = new Date().toISOString();

  lines.push(`# MedHub Flashcards — ${deck.name}`);
  lines.push('');
  lines.push(`> Exportado em ${now.slice(0, 10)}. Envie este arquivo para a **base de conhecimento** do assistente na Inner AI.`);
  lines.push('');
  lines.push('## Metadados');
  lines.push(`- deckId: \`${deck.id}\``);
  lines.push(`- Baralho: ${deck.name}`);
  lines.push(`- Cards atuais no app: ${deck.cards?.length || 0}`);
  lines.push(`- Meta: ${topicEntry?.cardsPerDeck || 30} cards neste baralho`);
  lines.push(`- Fonte principal: ${deck.sourceLabel || deck.source || 'MedHub'}`);
  if (topicEntry?.subtopics?.length || deck.subtopics?.length) {
    const subs = deck.subtopics || topicEntry.subtopics || [];
    lines.push('- Subtemas: ' + subs.map(s => `${s.name} (${s.count || s.cards?.length || 0})`).join(' · '));
  }
  lines.push('');
  lines.push('## Cards existentes (não repetir)');
  lines.push('');

  (deck.cards || []).forEach((card, i) => {
    lines.push(`${i + 1}. ${card.front}`);
  });

  lines.push('');
  lines.push('## Conteúdo clínico de referência (MedHub)');
  lines.push('');

  (topicEntry?.sources || []).forEach(source => {
    const block = resolveSourceBlock(ctx, source);
    lines.push(`### ${block.label}`);
    lines.push('');
    if (block.missing) {
      lines.push('_Conteúdo ainda não encontrado no repositório._');
    } else if (!block.text) {
      lines.push('_Seção vazia após conversão._');
    } else {
      lines.push(block.text);
    }
    lines.push('');
  });

  return lines.join('\n');
}

function deckFileName (deckId) {
  return `deck-${deckId}.js`;
}

function deckVarName (deckId) {
  return 'FLASHCARD_DECK_' + deckId.replace(/-/g, '_').toUpperCase();
}

function normalizeCard (card, index) {
  const front = String(card?.front || '').trim();
  const back = String(card?.back || '').trim();
  if (!front || !back) {
    throw new Error(`Card ${index + 1}: front e back são obrigatórios.`);
  }
  if (front.length > 320) {
    throw new Error(`Card ${index + 1}: front muito longo (${front.length} chars, máx. 320).`);
  }
  if (back.length > 900) {
    throw new Error(`Card ${index + 1}: back muito longo (${back.length} chars, máx. 900).`);
  }
  return { front, back };
}

function parseDraftFile (filePath) {
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const deckId = raw.deckId || path.basename(filePath, '.json').replace(/\.draft$/, '');
  const cards = (raw.cards || []).map((c, i) => normalizeCard(c, i));
  return {
    deckId,
    name: raw.name,
    icon: raw.icon,
    source: raw.source,
    sourceLabel: raw.sourceLabel,
    desc: raw.desc,
    cards
  };
}

function findDuplicateFronts (cards) {
  const seen = new Map();
  const dupes = [];
  cards.forEach((card, i) => {
    const key = card.front.toLowerCase().replace(/\s+/g, ' ');
    if (seen.has(key)) dupes.push({ index: i + 1, duplicateOf: seen.get(key) + 1 });
    else seen.set(key, i);
  });
  return dupes;
}

function renderDeckJs (meta, cards) {
  const varName = deckVarName(meta.id);
  const q = s => "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
  const cardLines = cards.map(c =>
    `    {\n      front: ${q(c.front)},\n      back: ${q(c.back)}\n    }`
  ).join(',\n');

  return `/* ${meta.name} — conteúdo educacional. Não substitui protocolo institucional. */

var ${varName} = {
  id: ${q(meta.id)},
  name: ${q(meta.name)},
  icon: ${q(meta.icon)},
  source: ${q(meta.source)},
  sourceLabel: ${q(meta.sourceLabel)},
  desc: ${q(meta.desc)},
  cards: [
${cardLines}
  ]
};
`;
}

function ensureDirs () {
  [sourcesDir, exportDir, draftsDir].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });
}

function parseCliArgs (argv) {
  const args = { all: false, topic: null, dryRun: false, force: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--all') args.all = true;
    else if (a === '--dry-run') args.dryRun = true;
    else if (a === '--force') args.force = true;
    else if (a === '--topic' && argv[i + 1]) args.topic = argv[++i];
  }
  return args;
}

module.exports = {
  root,
  sourcesDir,
  exportDir,
  draftsDir,
  deckDir,
  topicsPath,
  loadClinicalContext,
  loadDecks,
  loadTopicsConfig,
  getDeckTopicEntry,
  expectedCardsForDeck,
  buildExportMarkdown,
  deckFileName,
  deckVarName,
  parseDraftFile,
  findDuplicateFronts,
  renderDeckJs,
  ensureDirs,
  parseCliArgs
};
