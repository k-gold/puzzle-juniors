import { test } from 'node:test';
import assert from 'node:assert/strict';
import { play, setSoundEnabled } from '../src/lib/sound.js';

// There is no audio in the test environment, so these check that nothing throws and that
// sound stays off until it is turned on.
test('playing a sound does nothing when sound is off', () => {
  assert.doesNotThrow(() => play('chime'));
});

test('playing sounds does not throw when audio is unavailable', () => {
  setSoundEnabled(true);
  for (const name of ['chime', 'sparkle', 'buzz', 'not-a-sound']) {
    assert.doesNotThrow(() => play(name));
  }
  setSoundEnabled(false);
});

test('sounds work with a fake audio system, and none play while sound is off', () => {
  const made = [];
  const node = () => ({ connect: (next) => next, start() {}, stop() {}, frequency: {}, type: '' });
  globalThis.AudioContext = class {
    currentTime = 0;
    state = 'running';
    destination = {};
    createOscillator() {
      made.push('osc');
      return node();
    }
    createGain() {
      return {
        gain: {
          setValueAtTime() {},
          linearRampToValueAtTime() {},
          exponentialRampToValueAtTime() {},
        },
        connect: (next) => next,
      };
    }
  };
  try {
    setSoundEnabled(true);
    play('sparkle');
    assert.equal(made.length, 4);
    setSoundEnabled(false);
    play('sparkle');
    assert.equal(made.length, 4);
  } finally {
    delete globalThis.AudioContext;
  }
});
