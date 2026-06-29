/* Flashcards — agregador de baralhos (Fase A)
 *
 * COMO ADICIONAR OU AUMENTAR CARDS
 * --------------------------------
 * 1. Abra o arquivo do tema em flashcards/deck-<tema>.js
 *    (ex.: flashcards/deck-sepse.js)
 * 2. Adicione { front: 'pergunta clínica', back: 'resposta' } no array cards
 * 3. Atualize desc se quiser (ex.: "32 cards — ...")
 * 4. Bump ?v=fc-vX nos scripts em app.html (cache)
 * 5. Valide: node scripts/validate-flashcards.js
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
  'FLASHCARD_DECK_GASOMETRIA'
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
