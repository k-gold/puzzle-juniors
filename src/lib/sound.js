// Small sound effects made with the browser's audio, so there are no sound files to ship.
// Sound is off until the player turns it on (Rewards, Settings). Nothing here ever throws:
// if audio is not available the calls do nothing.
let enabled = false;
let audio = null;

// Each sound is a list of [frequency in Hz, start in seconds, length in seconds, wave type]
const SOUNDS = {
  chime: [
    [880, 0, 0.12, 'sine'],
    [1318, 0.09, 0.2, 'sine'],
  ],
  sparkle: [
    [988, 0, 0.1, 'triangle'],
    [1319, 0.08, 0.1, 'triangle'],
    [1568, 0.16, 0.1, 'triangle'],
    [1976, 0.24, 0.25, 'triangle'],
  ],
  buzz: [[170, 0, 0.18, 'square']],
};

function context() {
  if (!audio) {
    const Audio = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!Audio) return null;
    audio = new Audio();
  }
  return audio;
}

export function setSoundEnabled(on) {
  enabled = on;
  if (!on) return;
  // Phones only allow audio after a tap, so wake it up on the first tap or key press
  const ctx = context();
  if (ctx?.state === 'suspended') ctx.resume().catch(() => {});
  for (const type of ['pointerdown', 'keydown']) {
    globalThis.addEventListener?.(
      type,
      () =>
        context()
          ?.resume?.()
          .catch?.(() => {}),
      {
        once: true,
      },
    );
  }
}

export function play(name) {
  const notes = SOUNDS[name];
  if (!enabled || !notes) return;
  try {
    const ctx = context();
    if (!ctx) return;
    const now = ctx.currentTime;
    for (const [frequency, start, length, type] of notes) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = frequency;
      // Quiet, with a quick fade so it never clicks or startles
      gain.gain.setValueAtTime(0, now + start);
      gain.gain.linearRampToValueAtTime(0.12, now + start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + start + length);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + start);
      osc.stop(now + start + length + 0.02);
    }
  } catch {
    // Sound is a nicety; ignore any audio problem
  }
}
