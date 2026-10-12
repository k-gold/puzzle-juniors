import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BADGES, WORD_SEARCH_THEMES, VISUAL_THEMES } from '../src/data/rewards.js';
import { buildStats, newlyEarned } from '../src/lib/badgeStats.js';

const NEW_PLAYER = {
  points: 0,
  totalWordsFound: 0,
  gamesCompleted: { spelling: 0, wordsearch: 0, wordle: 0 },
  wordleWins: 0,
  wordleStreak: 0,
  dailyStreak: 0,
  counters: {
    pangrams: 0,
    greatBees: 0,
    fullHives: 0,
    searchesFinished: 0,
    cleanSearches: 0,
    fastWins: 0,
    eWins: 0,
    daysPlayed: 0,
  },
  foundWords: [],
  unlockedThemes: ['space', 'ocean', 'forest'],
  unlockedVisualThemes: ['classic'],
};

test('every badge has a unique id, a description, a known stat and a target', () => {
  const stats = buildStats(NEW_PLAYER);
  const ids = new Set();
  for (const b of BADGES) {
    assert.ok(!ids.has(b.id), `duplicate badge id ${b.id}`);
    ids.add(b.id);
    assert.ok(b.name && b.icon && b.desc, `${b.id} needs a name, icon and description`);
    assert.ok(b.stat in stats, `${b.id} uses unknown stat "${b.stat}"`);
    assert.ok(Number.isInteger(b.target) && b.target > 0, `${b.id} needs a positive target`);
  }
});

test('a new player starts with only the two welcome badges', () => {
  const earned = newlyEarned(buildStats(NEW_PLAYER), []).map((b) => b.id);
  assert.deepEqual(earned.sort(), ['first-word', 'getting-started']);
});

test('badges already owned are not awarded again', () => {
  const stats = buildStats({ ...NEW_PLAYER, points: 600 });
  const owned = ['first-word', 'getting-started', 'rising-star'];
  const earned = newlyEarned(stats, owned).map((b) => b.id);
  assert.deepEqual(earned, ['point-collector']);
});

test('a badge missed earlier is awarded once the player qualifies', () => {
  // 120 words found but no word badges owned: all three lower word badges are due
  const stats = buildStats({ ...NEW_PLAYER, totalWordsFound: 120 });
  const earned = newlyEarned(stats, ['first-word', 'getting-started']).map((b) => b.id);
  assert.deepEqual(earned, ['word-finder', 'word-hunter', 'word-master']);
});

test('the "all themes" badges match the number of themes that exist', () => {
  const byId = Object.fromEntries(BADGES.map((b) => [b.id, b]));
  assert.equal(byId['theme-master'].target, WORD_SEARCH_THEMES.length);
  assert.equal(byId['rainbow-master'].target, VISUAL_THEMES.length);
});

test('combo master needs all three games played', () => {
  const two = buildStats({
    ...NEW_PLAYER,
    gamesCompleted: { spelling: 1, wordsearch: 1, wordle: 0 },
  });
  assert.equal(
    newlyEarned(two, []).some((b) => b.id === 'combo-master'),
    false,
  );
  const three = buildStats({
    ...NEW_PLAYER,
    gamesCompleted: { spelling: 1, wordsearch: 1, wordle: 1 },
  });
  assert.equal(
    newlyEarned(three, []).some((b) => b.id === 'combo-master'),
    true,
  );
});
