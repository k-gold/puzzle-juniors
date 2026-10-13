// Picks what a hint reveals. `random` can be replaced in tests.
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

// Letter Puzzle: the length and first letters of an answer that has not been found yet.
export function pickBeeHint(answers, foundWords, random = Math.random) {
  const open = answers.filter((w) => !foundWords.includes(w));
  if (!open.length) return null;
  const word = pick(open, random);
  return { length: word.length, start: word.slice(0, word.length > 4 ? 2 : 1) };
}

// Word Search: a word that has not been found yet, so its first letter can be circled.
export function pickSearchHint(solutions, foundWords, random = Math.random) {
  const open = solutions.filter((s) => !foundWords.includes(s.word));
  if (!open.length) return null;
  const { word, positions } = pick(open, random);
  return { word, row: positions[0].row, col: positions[0].col };
}
