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

test('no two words share a picture', () => {
  const pictures = SCRAMBLE_WORDS.map(([, emoji]) => emoji.replace(/\uFE0F/g, ''));
  assert.equal(new Set(pictures).size, pictures.length);
});

test('there are plenty of words', () => {
  assert.ok(SCRAMBLE_WORDS.length >= 200, `only ${SCRAMBLE_WORDS.length} words`);
});

test('a round has five different words', () => {
  const { round } = pickRound(SCRAMBLE_WORDS);
  assert.equal(round.length, ROUND_LENGTH);
  assert.equal(new Set(round.map((r) => r.word)).size, ROUND_LENGTH);
});

test('words do not come up again until every word has been played', () => {
  let seen = [];
  const played = [];
  const rounds = Math.floor(SCRAMBLE_WORDS.length / ROUND_LENGTH);
  for (let i = 0; i < rounds; i++) {
    const picked = pickRound(SCRAMBLE_WORDS, seen);
    played.push(...picked.round.map((r) => r.word));
    seen = picked.seen;
  }
  assert.equal(new Set(played).size, played.length);
});

test('when few words are left, the round is filled from played ones and the list starts over', () => {
  const words = [...SCRAMBLE_WORDS];
  const seen = words.slice(2).map(([w]) => w); // only the first two are unplayed
  const { round, seen: next } = pickRound(words, seen);
  assert.equal(new Set(round.map((r) => r.word)).size, ROUND_LENGTH);
  assert.ok(round.some((r) => r.word === words[0][0]) && round.some((r) => r.word === words[1][0]));
  assert.equal(next.length, ROUND_LENGTH - 2);
});
