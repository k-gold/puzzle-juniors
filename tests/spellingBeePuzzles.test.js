import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { generateSpellingBeePuzzle } from '../src/data/spellingBeePuzzles.js';

const dictionary = readFileSync(new URL('../public/words.txt', import.meta.url), 'utf8').split(
  '\n',
);

// The generator picks at random, so sample it until every puzzle has been seen.
function allPuzzles() {
  const seen = new Map();
  for (let i = 0; i < 5000; i++) {
    const p = generateSpellingBeePuzzle();
    seen.set(p.letters.join('') + p.center, p);
  }
  return [...seen.values()];
}

test('every puzzle has 7 distinct letters including the center', () => {
  for (const p of allPuzzles()) {
    assert.equal(new Set(p.letters).size, 7, `${p.letters.join('')} needs 7 distinct letters`);
    assert.ok(p.letters.includes(p.center), `${p.letters.join('')} is missing its center`);
  }
});

test('every puzzle has plenty of words to find', () => {
  for (const p of allPuzzles()) {
    const letters = new Set(p.letters.map((l) => l.toLowerCase()));
    const found = dictionary.filter(
      (w) => w.includes(p.center.toLowerCase()) && [...w].every((c) => letters.has(c)),
    );
    assert.ok(found.length >= 50, `${p.letters.join('')} has only ${found.length} words`);
  }
});
