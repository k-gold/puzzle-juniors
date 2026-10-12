import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { WORDLE_WORDS } from '../src/data/wordleWords.js';

const dictionary = new Set(
  readFileSync(new URL('../public/words.txt', import.meta.url), 'utf8').split('\n'),
);

test('every Wordle answer is exactly 4 letters, A-Z', () => {
  const bad = WORDLE_WORDS.filter((w) => !/^[A-Z]{4}$/.test(w));
  assert.deepEqual(bad, []);
});

test('every Wordle answer is accepted as a guess (otherwise the puzzle is unwinnable)', () => {
  const missing = [...new Set(WORDLE_WORDS)].filter((w) => !dictionary.has(w.toLowerCase()));
  assert.deepEqual(missing, []);
});

test('no Wordle answer appears twice, so the daily puzzle never repeats within the list', () => {
  const repeated = WORDLE_WORDS.filter((w, i) => WORDLE_WORDS.indexOf(w) !== i);
  assert.deepEqual(repeated, []);
});
