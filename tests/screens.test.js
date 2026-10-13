// Smoke test: every screen renders without crashing, for a new player and for a player
// with lots of progress. It does not check how things look, only that nothing throws.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';

const server = await createServer({
  server: { middlewareMode: true, hmr: false, watch: null },
  appType: 'custom',
  logLevel: 'silent',
});
after(() => server.close());
const { default: App } = await server.ssrLoadModule('/src/App.jsx');

const SCREENS = [
  ['spelling', 'Letter Puzzle'],
  ['wordsearch', 'Find Words'],
  ['wordle', 'Guess the Word'],
  ['scramble', 'Word Scramble'],
  ['store', 'Rewards'],
];

const NEW_PLAYER = {}; // nothing saved yet except which screen is open
const VETERAN = {
  points: 5000,
  badges: ['first-word', 'rising-star'],
  unlockedVisualThemes: ['classic', 'sunshine', 'night'],
  currentVisualTheme: 'sunshine',
  colorBlindMode: true,
  wordleGuesses: ['PLAY', 'WORD'],
};

function render(saved, activeGame) {
  globalThis.localStorage = {
    getItem: () => JSON.stringify({ ...saved, activeGame }),
    setItem: () => {},
  };
  return renderToString(createElement(App));
}

for (const [label, saved] of [
  ['a new player', NEW_PLAYER],
  ['a player with lots of progress', VETERAN],
]) {
  for (const [id, heading] of SCREENS) {
    test(`${id} screen renders for ${label}`, () => {
      const html = render(saved, id);
      assert.ok(html.includes(heading), `expected "${heading}" on the ${id} screen`);
    });
  }
}

test('every Word Search theme is unlocked once enough points are earned', () => {
  const html = render({ points: 5000 }, 'store');
  assert.ok(!/locked, \d+ points/.test(html), 'no theme should still be locked at 5000 points');
});

test('Word Search themes that need more points are shown as locked', () => {
  const html = render({ points: 0 }, 'store');
  assert.ok(html.includes('Fruits, locked, 100 points'));
});
