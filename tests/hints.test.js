import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pickWordleHint, pickBeeHint, pickSearchHint } from '../src/lib/hints.js';

const first = () => 0;
const last = () => 0.999;

test('a Wordle hint skips letters already found and already hinted', () => {
  // The guess PLAY has its first three letters right for the answer PLAN
  const target = 'PLAN';
  const guesses = ['PLAY']; // positions 0, 1, 2 are correct
  assert.equal(pickWordleHint(target, guesses, [], first), 3);
  assert.equal(pickWordleHint(target, guesses, [3], first), null);
});

test('a Wordle hint can choose any open position', () => {
  assert.equal(pickWordleHint('PLAN', [], [], first), 0);
  assert.equal(pickWordleHint('PLAN', [], [], last), 3);
  assert.equal(pickWordleHint('PLAN', [], [0, 3], first), 1);
});

test('a Letter Puzzle hint describes a word that has not been found', () => {
  const answers = ['CAT', 'CART', 'CARROT'];
  const hint = pickBeeHint(answers, ['CAT', 'CART'], first);
  assert.deepEqual(hint, { length: 6, start: 'CA' });
  assert.equal(pickBeeHint(answers, answers, first), null);
});

test('a Letter Puzzle hint gives one letter for short words and two for longer ones', () => {
  assert.equal(pickBeeHint(['CAT'], [], first).start, 'C');
  assert.equal(pickBeeHint(['CART'], [], first).start, 'C');
  assert.equal(pickBeeHint(['CARTS'], [], first).start, 'CA');
});

test('a Word Search hint points at the first letter of a word not found yet', () => {
  const solutions = [
    { word: 'CAT', positions: [{ row: 1, col: 2 }] },
    { word: 'DOG', positions: [{ row: 4, col: 5 }] },
  ];
  assert.deepEqual(pickSearchHint(solutions, ['CAT'], first), { word: 'DOG', row: 4, col: 5 });
  assert.equal(pickSearchHint(solutions, ['CAT', 'DOG'], first), null);
});
