import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nextStreak, currentStreak, yesterdayString } from '../src/lib/streak.js';
import { BADGES } from '../src/data/rewards.js';
import { buildStats, newlyEarned } from '../src/lib/badgeStats.js';

const noon = (y, m, d) => new Date(y, m, d, 12);

test('first day starts a streak of 1', () => {
  assert.equal(nextStreak('', 0, noon(2026, 9, 13)), 1);
});

test('playing again the same day does not change the streak', () => {
  const now = noon(2026, 9, 13);
  assert.equal(nextStreak(now.toDateString(), 4, now), 4);
});

test('playing the day after grows the streak, also across a month end', () => {
  assert.equal(nextStreak(noon(2026, 9, 12).toDateString(), 4, noon(2026, 9, 13)), 5);
  assert.equal(nextStreak(noon(2026, 8, 30).toDateString(), 2, noon(2026, 9, 1)), 3);
});

test('missing a day starts over at 1', () => {
  assert.equal(nextStreak(noon(2026, 9, 10).toDateString(), 6, noon(2026, 9, 13)), 1);
});

test('yesterday is computed by calendar day', () => {
  assert.equal(yesterdayString(noon(2026, 2, 1)), noon(2026, 1, 28).toDateString());
});

test('the shown streak runs out after a missed day but survives until tonight', () => {
  const now = noon(2026, 9, 13);
  assert.equal(currentStreak(now.toDateString(), 5, now), 5);
  assert.equal(currentStreak(noon(2026, 9, 12).toDateString(), 5, now), 5);
  assert.equal(currentStreak(noon(2026, 9, 11).toDateString(), 5, now), 0);
});

test('streak badges are earned by the best streak, so a lapse never takes them away', () => {
  const base = {
    points: 0,
    totalWordsFound: 0,
    gamesCompleted: {},
    wordleWins: 0,
    wordleStreak: 0,
    dailyStreak: 0,
    counters: {},
    foundWords: [],
    unlockedThemes: [],
    unlockedVisualThemes: [],
  };
  const ids = (best) =>
    newlyEarned(buildStats({ ...base, bestPlayStreak: best }), [])
      .map((b) => b.id)
      .filter((id) => id.startsWith('streak-'));
  assert.deepEqual(ids(2), []);
  assert.deepEqual(ids(7), ['streak-3', 'streak-7']);
  assert.ok(BADGES.some((b) => b.id === 'streak-14'));
});
