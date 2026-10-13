import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { GRIDS, CLUES } from '../src/data/crosswordPuzzles.js';
import { parseGrid } from '../src/lib/crossword.js';

const dictionary = new Set(
  readFileSync(new URL('../public/words.txt', import.meta.url), 'utf8')
    .split(/\s+/)
    .map((w) => w.toUpperCase()),
);

test('every grid is 5x5, made of capital letters and # for black squares, and not repeated', () => {
  for (const g of GRIDS) {
    const rows = g.split('/');
    assert.equal(rows.length, 5, g);
    for (const row of rows) assert.match(row, /^[A-Z#]{5}$/, g);
  }
  assert.equal(new Set(GRIDS).size, GRIDS.length);
});

test('every white square belongs to a word, and every word is a real word with a clue', () => {
  for (const g of GRIDS) {
    const puzzle = parseGrid(g);
    const covered = new Set(puzzle.entries.flatMap((e) => e.cells.map(([r, c]) => `${r},${c}`)));
    puzzle.rows.forEach((row, r) =>
      row.forEach((letter, c) => {
        if (letter) assert.ok(covered.has(`${r},${c}`), `${g}: square ${r},${c} is in no word`);
      }),
    );
    for (const e of puzzle.entries) {
      assert.ok(dictionary.has(e.answer), `${e.answer} is not in words.txt`);
      assert.ok(e.clue, `${e.answer} needs a clue`);
    }
  }
});

test('a clue never contains its own answer, and every clue is used', () => {
  for (const [word, clue] of Object.entries(CLUES)) {
    assert.ok(!clue.toUpperCase().includes(word), `${word}: clue gives away the answer`);
  }
  const used = new Set(GRIDS.flatMap((g) => parseGrid(g).entries.map((e) => e.answer)));
  for (const word of Object.keys(CLUES))
    assert.ok(used.has(word), `${word} has a clue but is in no grid`);
});

test('parseGrid numbers words the usual way', () => {
  const puzzle = parseGrid('CORAL/A#U##/TULIP/##E#I/HORSE');
  const byId = Object.fromEntries(puzzle.entries.map((e) => [e.id, e.answer]));
  assert.equal(byId['1across'], 'CORAL');
  assert.equal(byId['1down'], 'CAT');
  assert.equal(byId['2down'], 'RULER');
  assert.equal(puzzle.numbers['0,0'], 1);
  assert.equal(puzzle.entries.length, 6);
});

test('black squares along the outside are left out, ones inside the puzzle are drawn', () => {
  const puzzle = parseGrid('CORAL/A#U##/TULIP/##E#I/HORSE');
  assert.ok(!puzzle.outside.has('1,1'), 'the square in the middle of the grid is enclosed');
  assert.ok(puzzle.outside.has('1,4'));
  assert.ok(puzzle.outside.has('3,0'));
  assert.ok(puzzle.outside.has('3,1'), 'it connects to the edge through another black square');
});
