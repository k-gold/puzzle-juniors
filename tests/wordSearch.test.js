import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateWordSearchPuzzle } from '../src/lib/wordSearch.js';
import { WORD_LISTS_BY_THEME } from '../src/data/wordSearchWords.js';
import { WORD_SEARCH_THEMES, SEASONS } from '../src/data/rewards.js';

test('every reward theme has a word list, and every word list has a reward', () => {
  assert.deepEqual(
    [...WORD_SEARCH_THEMES, ...SEASONS].map((t) => t.id).sort(),
    Object.keys(WORD_LISTS_BY_THEME).sort(),
  );
});

test('every theme word fits in the 10x10 grid', () => {
  for (const [theme, words] of Object.entries(WORD_LISTS_BY_THEME)) {
    for (const w of words) assert.ok(w.length <= 10, `${theme}: ${w} is longer than the grid`);
  }
});

test('the generator places every word, and each solution reads correctly in the grid', () => {
  for (const theme of Object.keys(WORD_LISTS_BY_THEME)) {
    for (let run = 0; run < 25; run++) {
      const { grid, solutions } = generateWordSearchPuzzle([theme]);
      assert.equal(
        solutions.length,
        WORD_LISTS_BY_THEME[theme].length,
        `${theme}: a word was not placed`,
      );
      for (const s of solutions) {
        const read = s.positions.map(({ row, col }) => grid[row][col]).join('');
        assert.equal(read, s.word);
      }
    }
  }
});
