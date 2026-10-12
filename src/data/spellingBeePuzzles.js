import { PUZZLES } from './beePuzzleList.js';

const shuffled = (list) => [...list].sort(() => Math.random() - 0.5);

// Pick a random puzzle. The seven letters are mixed up (center last) so they do not
// spell the pangram. Only letters and center are kept in saved progress; the answers are
// looked up again with findPuzzle.
export const generateSpellingBeePuzzle = () => {
  const { letters, center } = PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
  return {
    letters: [...shuffled(letters.filter((l) => l !== center)), center],
    center,
  };
};

const sameLetters = (a, b) => [...a].sort().join('') === [...b].sort().join('');

// The full puzzle (with its answers) for a saved or generated one, or undefined if unknown
export const findPuzzle = (p) =>
  PUZZLES.find((x) => x.center === p.center && sameLetters(x.letters, p.letters));

// A playable puzzle has 7 distinct letters, its center is one of them, and it is one of ours.
// Used to discard puzzles that an earlier version saved in a player's browser.
export const isValidPuzzle = (p) =>
  Boolean(p) &&
  Array.isArray(p.letters) &&
  new Set(p.letters).size === 7 &&
  p.letters.includes(p.center) &&
  Boolean(findPuzzle(p));
