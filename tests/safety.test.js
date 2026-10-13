// Keeps words that are not right for a kids' game out of the dictionary and out of every puzzle.
// The list is scripts/blocked-words.txt. After editing it, run: node scripts/filter-dictionary.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readBlocked } from '../scripts/filter-dictionary.mjs';
import { WORDLE_WORDS } from '../src/data/wordleWords.js';
import { SCRAMBLE_WORDS } from '../src/data/scrambleWords.js';
import { WORD_LISTS_BY_THEME } from '../src/data/wordSearchWords.js';
import { CLUES } from '../src/data/crosswordPuzzles.js';
import { PUZZLES } from '../src/data/beePuzzleList.js';

const blocked = readBlocked();

test('the blocklist is not empty', () => {
  assert.ok(blocked.size > 100);
});

test('no blocked word is in the dictionary, so it cannot be entered for points', () => {
  const dictionary = new Set(
    readFileSync(new URL('../public/words.txt', import.meta.url), 'utf8').split('\n'),
  );
  const found = [...blocked].filter((w) => dictionary.has(w));
  assert.deepEqual(found, [], 'run: node scripts/filter-dictionary.mjs');
});

test('no blocked word is used in any game', () => {
  const lists = {
    'Guess the Word': WORDLE_WORDS,
    'Word Scramble': SCRAMBLE_WORDS.map(([w]) => w),
    'Word Search': Object.values(WORD_LISTS_BY_THEME).flat(),
    'Mini Crossword': Object.keys(CLUES),
    'Letter Puzzle': PUZZLES.flatMap((p) => p.answers),
  };
  for (const [game, words] of Object.entries(lists)) {
    const found = words.filter((w) => blocked.has(w.toLowerCase()));
    assert.deepEqual(found, [], `${game} uses blocked words`);
  }
});
