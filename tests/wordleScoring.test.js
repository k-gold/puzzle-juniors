import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scoreGuess } from '../src/lib/wordleScoring.js';

test('exact match is all green', () => {
  assert.deepEqual(scoreGuess('CAMP', 'CAMP'), ['green', 'green', 'green', 'green']);
});

test('letters in the wrong place are yellow, absent letters are gray', () => {
  assert.deepEqual(scoreGuess('MACK', 'CAMP'), ['yellow', 'green', 'yellow', 'gray']);
});

test('duplicate letters are only marked as often as they appear in the answer', () => {
  // Answer TOOL has one L. Guess LOLO: the first L is yellow, the second has none left.
  assert.deepEqual(scoreGuess('LOLO', 'TOOL'), ['yellow', 'green', 'gray', 'yellow']);
});

test('a green letter uses up its copy before yellows are handed out', () => {
  // Answer FEED has two Es, both matched exactly, so the other guessed Es are gray.
  assert.deepEqual(scoreGuess('EEEE', 'FEED'), ['gray', 'green', 'green', 'gray']);
});
