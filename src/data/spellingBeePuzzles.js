import { PUZZLES } from './beePuzzleList.js';

const shuffled = (list) => [...list].sort(() => Math.random() - 0.5);

// What identifies a puzzle, whatever order its letters are shown in
export const puzzleKey = (p) => `${[...p.letters].sort().join('')}-${p.center}`;

// The seven letters are mixed up (center last) so they do not spell the pangram. Only letters
// and center are kept in saved progress; the answers are looked up again with findPuzzle.
const toPlayable = ({ letters, center }) => ({
  letters: [...shuffled(letters.filter((l) => l !== center)), center],
  center,
});

// A puzzle the player has not had yet, until every puzzle has been played. Then the list starts
// over. `seen` is the list of puzzle keys already played, and the updated list comes back too.
export const pickSpellingBeePuzzle = (seen = [], current = null) => {
  const currentKey = current && puzzleKey(current);
  const unseen = PUZZLES.filter((p) => !seen.includes(puzzleKey(p)) && puzzleKey(p) !== currentKey);
  const options = unseen.length ? unseen : PUZZLES.filter((p) => puzzleKey(p) !== currentKey);
  const chosen = options[Math.floor(Math.random() * options.length)];
  return {
    puzzle: toPlayable(chosen),
    seen: unseen.length ? [...seen, puzzleKey(chosen)] : [puzzleKey(chosen)],
  };
};

// A random puzzle
export const generateSpellingBeePuzzle = () => pickSpellingBeePuzzle().puzzle;

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
