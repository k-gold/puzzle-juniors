import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  generateSpellingBeePuzzle,
  isValidPuzzle,
  findPuzzle,
} from '../src/data/spellingBeePuzzles.js';
import { PUZZLES } from '../src/data/beePuzzleList.js';
import { isPangram } from '../src/lib/beeRank.js';

const dictionary = new Set(
  readFileSync(new URL('../public/words.txt', import.meta.url), 'utf8').split('\n'),
);

test('every puzzle has 7 distinct letters including the center', () => {
  for (const p of PUZZLES) {
    assert.equal(new Set(p.letters).size, 7, `${p.letters.join('')} needs 7 distinct letters`);
    assert.ok(p.letters.includes(p.center), `${p.letters.join('')} is missing its center`);
  }
});

test('every puzzle has a reasonable number of answers, all spelled from its letters', () => {
  for (const p of PUZZLES) {
    assert.ok(
      p.answers.length >= 30 && p.answers.length <= 70,
      `${p.letters.join('')} has ${p.answers.length} answers`,
    );
    assert.equal(new Set(p.answers).size, p.answers.length, 'answers are unique');
    for (const w of p.answers) {
      assert.ok(w.length >= 3, `${w} is too short`);
      assert.ok(w.includes(p.center), `${w} is missing the center letter ${p.center}`);
      assert.ok(
        [...w].every((c) => p.letters.includes(c)),
        `${w} uses a letter not in the puzzle`,
      );
      assert.ok(dictionary.has(w.toLowerCase()), `${w} is not in public/words.txt`);
    }
  }
});

test('every puzzle has at least one pangram among its answers', () => {
  for (const p of PUZZLES) {
    assert.ok(
      p.answers.some((w) => isPangram(w, p.letters)),
      `${p.letters.join('')} has no pangram`,
    );
  }
});

test('a generated puzzle is a known puzzle and its letters are mixed up', () => {
  for (let i = 0; i < 200; i++) {
    const p = generateSpellingBeePuzzle();
    assert.ok(findPuzzle(p), `${p.letters.join('')} is not in the list`);
    assert.equal(p.letters.at(-1), p.center, 'center is last');
    assert.equal(isValidPuzzle(p), true);
  }
});

test('findPuzzle ignores the order the letters are shown in', () => {
  const { letters, center } = PUZZLES[0];
  assert.equal(findPuzzle({ letters: [...letters].reverse(), center }), PUZZLES[0]);
});

test('isValidPuzzle rejects repeated letters, a missing center and unknown puzzles', () => {
  const { letters, center } = PUZZLES[0];
  assert.equal(isValidPuzzle({ letters: [...letters.slice(0, 6), letters[0]], center }), false);
  assert.equal(isValidPuzzle({ letters, center: 'Z' }), false);
  assert.equal(isValidPuzzle(null), false);
  // An old puzzle from before curated lists is no longer playable
  assert.equal(isValidPuzzle({ letters: ['C', 'H', 'E', 'A', 'R', 'S', 'T'], center: 'E' }), false);
  assert.equal(isValidPuzzle({ letters, center }), true);
});

test('puzzles do not repeat until every puzzle has been played', async () => {
  const { pickSpellingBeePuzzle, puzzleKey } = await import('../src/data/spellingBeePuzzles.js');
  let seen = [];
  let current = null;
  const played = [];
  for (let i = 0; i < PUZZLES.length; i++) {
    const picked = pickSpellingBeePuzzle(seen, current);
    played.push(puzzleKey(picked.puzzle));
    seen = picked.seen;
    current = picked.puzzle;
  }
  assert.equal(new Set(played).size, PUZZLES.length);
  // Then the list starts over, and the next one is not the one just played
  const next = pickSpellingBeePuzzle(seen, current);
  assert.notEqual(puzzleKey(next.puzzle), puzzleKey(current));
  assert.equal(next.seen.length, 1);
});

test('there are plenty of Letter Puzzles', () => {
  assert.ok(PUZZLES.length >= 60, `only ${PUZZLES.length} puzzles`);
});
