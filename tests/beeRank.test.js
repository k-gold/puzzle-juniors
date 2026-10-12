import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rankProgress, isPangram, isPositiveMessage } from '../src/lib/beeRank.js';

test('rank rises as more of the answers are found', () => {
  assert.equal(rankProgress(0, 40).rank, 'Beginner');
  assert.equal(rankProgress(11, 40).rank, 'Beginner');
  assert.equal(rankProgress(12, 40).rank, 'Good'); // 30% of 40
  assert.equal(rankProgress(23, 40).rank, 'Good');
  assert.equal(rankProgress(24, 40).rank, 'Great'); // 60% of 40
  assert.equal(rankProgress(40, 40).rank, 'Great');
});

test('progress names the next rank and how many words it needs', () => {
  assert.deepEqual(rankProgress(5, 40).next, { name: 'Good', at: 12 });
  assert.deepEqual(rankProgress(12, 40).next, { name: 'Great', at: 24 });
  assert.equal(rankProgress(30, 40).next, null);
});

test('a pangram uses all seven letters', () => {
  const letters = ['C', 'R', 'A', 'Y', 'O', 'N', 'S'];
  assert.equal(isPangram('CRAYONS', letters), true);
  assert.equal(isPangram('CRAYON', letters), false);
});

test('positive messages are recognized', () => {
  assert.equal(isPositiveMessage('Pangram! You used all 7 letters!'), true);
  assert.equal(isPositiveMessage('Nice! You reached Good!'), true);
  assert.equal(isPositiveMessage('Checking...'), true);
  assert.equal(isPositiveMessage('Not in word list'), false);
});
