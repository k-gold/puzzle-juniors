import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SCRAMBLE_WORDS } from '../src/data/scrambleWords.js';
import { scrambleTiles, pickRound, ROUND_LENGTH } from '../src/lib/scramble.js';

const dictionary = new Set(
  readFileSync(new URL('../public/words.txt', import.meta.url), 'utf8')
    .split(/\s+/)
    .map((w) => w.toUpperCase()),
);

test('every scramble word is 3 to 7 capital letters, has a picture, and is a real word', () => {
  for (const [word, emoji] of SCRAMBLE_WORDS) {
    assert.match(word, /^[A-Z]{3,7}$/, word);
    assert.ok(emoji, `${word} needs a picture`);
    assert.ok(dictionary.has(word), `${word} is not in words.txt`);
  }
});

test('scramble words are not repeated', () => {
  const words = SCRAMBLE_WORDS.map(([w]) => w);
  assert.equal(new Set(words).size, words.length);
});

test('tiles hold the same letters as the word, in a different order', () => {
  for (const [word] of SCRAMBLE_WORDS) {
    const tiles = scrambleTiles(word);
    const letters = tiles.map((t) => t.letter);
    assert.deepEqual([...letters].sort(), [...word].sort());
    assert.notEqual(letters.join(''), word);
    assert.equal(new Set(tiles.map((t) => t.id)).size, word.length);
  }
});

test('a round has five different words', () => {
  const round = pickRound(SCRAMBLE_WORDS);
  assert.equal(round.length, ROUND_LENGTH);
  assert.equal(new Set(round.map((r) => r.word)).size, ROUND_LENGTH);
});
