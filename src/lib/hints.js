// Picks what a hint reveals (Guess the Word only). `random` can be replaced in tests.
const pick = (list, random) => list[Math.floor(random() * list.length)];

export const MAX_WORDLE_HINTS = 2;

// Guess the Word: a position in the answer the player has not found yet and was not already
// told about. Returns null when there is nothing left to reveal.
export function pickWordleHint(target, guesses, hintedPositions, random = Math.random) {
  const open = [...target]
    .map((_, i) => i)
    .filter((i) => !hintedPositions.includes(i) && !guesses.some((g) => g[i] === target[i]));
  return open.length ? pick(open, random) : null;
}
