import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SEASONS } from '../src/data/rewards.js';
import { COLOR_THEMES } from '../src/data/colorThemes.js';
import { seasonOn } from '../src/lib/seasons.js';

const day = (month, date) => new Date(2026, month - 1, date);

test('dates inside a season give that season, dates between seasons give none', () => {
  assert.equal(seasonOn(day(10, 12)), 'halloween');
  assert.equal(seasonOn(day(10, 1)), 'halloween');
  assert.equal(seasonOn(day(10, 31)), 'halloween');
  assert.equal(seasonOn(day(11, 5)), null);
  assert.equal(seasonOn(day(12, 25)), 'winter');
  assert.equal(seasonOn(day(2, 14)), 'valentines');
  assert.equal(seasonOn(day(2, 15)), null);
  assert.equal(seasonOn(day(7, 4)), 'summer');
});

test('seasons are in calendar order and never overlap', () => {
  const key = ([m, d]) => m * 100 + d;
  for (const s of SEASONS) assert.ok(key(s.start) <= key(s.end), `${s.id} ends before it starts`);
  for (let i = 1; i < SEASONS.length; i++) {
    assert.ok(key(SEASONS[i - 1].end) < key(SEASONS[i].start), `${SEASONS[i].id} overlaps`);
  }
});

test('every season has a color theme', () => {
  for (const s of SEASONS) assert.ok(COLOR_THEMES[s.id], `${s.id} has no color theme`);
});
