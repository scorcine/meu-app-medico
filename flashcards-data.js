/* Flashcards — agregador de baralhos (Fase A)
 *
 * COMO ADICIONAR OU AUMENTAR CARDS
 * --------------------------------
 * Manual:
 * 1. Abra flashcards/deck-<tema>.js
 * 2. Adicione { front, back } no array cards
 * 3. Bump ?v=fc-vX em app.html · node scripts/validate-flashcards.js
 *
 * Com Inner AI (pipeline):
 * 1. npm run pipeline:flashcards:export -- --topic sepse
 * 2. Upload flashcards-sources/export/sepse.md na base do assistente Inner
 * 3. Gere JSON (prompt em flashcards-sources/inner-assistant-prompt.txt)
 * 4. Salve em flashcards-sources/drafts/sepse.json
 * 5. npm run pipeline:flashcards:import -- --topic sepse
 *
 * NOVO TEMA
 * ---------
 * 1. Crie flashcards/deck-meu-tema.js com var FLASHCARD_DECK_MEU_TEMA = { id, name, ... cards }
 * 2. Registre abaixo em FLASHCARD_DECK_KEYS
 * 3. Inclua <script src="flashcards/deck-meu-tema.js"> em app.html antes deste arquivo
 */

const FLASHCARD_DECK_KEYS = [
  'FLASHCARD_DECK_SEPSE',
  'FLASHCARD_DECK_IAM',
  'FLASHCARD_DECK_AVC',
  'FLASHCARD_DECK_ANAFILAXIA',
  'FLASHCARD_DECK_DENGUE',
  'FLASHCARD_DECK_PNEUMONIA',
  'FLASHCARD_DECK_HIPOGLICEMIA',
  'FLASHCARD_DECK_CRISE_HIPERTENSIVA',
  'FLASHCARD_DECK_VIA_AEREA',
  'FLASHCARD_DECK_GASOMETRIA',
  'FLASHCARD_DECK_CARDIO_ARRITMIAS'
];

const FLASHCARD_DECKS = FLASHCARD_DECK_KEYS
  .map(key => {
    try {
      return Function('return typeof ' + key + ' !== "undefined" ? ' + key + ' : null')();
    } catch {
      return null;
    }
  })
  .filter(Boolean)
  .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
