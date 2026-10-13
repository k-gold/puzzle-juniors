import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pickWordleHint } from '../src/lib/hints.js';

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
