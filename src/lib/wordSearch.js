import { WORD_LISTS_BY_THEME } from '../data/wordSearchWords.js';

// Generate random Word Search puzzle from unlocked themes. A theme that is in season is
// picked half the time, so players actually see it while it is around.
export const generateWordSearchPuzzle = (unlockedThemesList, seasonTheme = null) => {
  const inSeason = seasonTheme && unlockedThemesList.includes(seasonTheme);
  const randomTheme =
    inSeason && Math.random() < 0.5
      ? seasonTheme
      : unlockedThemesList[Math.floor(Math.random() * unlockedThemesList.length)];
  const words = WORD_LISTS_BY_THEME[randomTheme];
  const size = 10;
  const grid = Array(size)
    .fill(null)
    .map(() => Array(size).fill(null));
  const solutions = [];

  // Direction vectors: horizontal, vertical, and 4 diagonals
  const directions = [
    { dr: 0, dc: 1 }, // horizontal right
    { dr: 1, dc: 0 }, // vertical down
    { dr: 1, dc: 1 }, // diagonal down-right
    { dr: 1, dc: -1 }, // diagonal down-left
    { dr: -1, dc: 1 }, // diagonal up-right
    { dr: -1, dc: -1 }, // diagonal up-left
    { dr: 0, dc: -1 }, // horizontal left
    { dr: -1, dc: 0 }, // vertical up
  ];

  const canPlaceWord = (word, row, col, dir) => {
    const endRow = row + dir.dr * (word.length - 1);
    const endCol = col + dir.dc * (word.length - 1);

    if (endRow < 0 || endRow >= size || endCol < 0 || endCol >= size) {
      return false;
    }

    // Allow intersecting words - cells can match or be empty
    for (let i = 0; i < word.length; i++) {
      const r = row + dir.dr * i;
      const c = col + dir.dc * i;
      if (grid[r][c] !== null && grid[r][c] !== word[i]) {
        return false;
      }
    }

    return true;
  };

  const placeWord = (word, row, col, dir) => {
    const positions = [];
    for (let i = 0; i < word.length; i++) {
      const r = row + dir.dr * i;
      const c = col + dir.dc * i;
      grid[r][c] = word[i];
      positions.push({ row: r, col: c });
    }
    solutions.push({ word, positions });
  };

  // Place each word at a random spot chosen from every legal spot.
  // Longest words go first so they are least likely to get squeezed out.
  const randomSpot = (word) => {
    const spots = [];
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        for (const dir of directions) {
          if (canPlaceWord(word, row, col, dir)) spots.push({ row, col, dir });
        }
      }
    }
    return spots.length ? spots[Math.floor(Math.random() * spots.length)] : null;
  };

  // Rarely, a crowded grid leaves no room for the last word. Start over if so.
  const byLength = [...words].sort((a, b) => b.length - a.length);
  for (let attempt = 0; attempt < 20; attempt++) {
    solutions.length = 0;
    grid.forEach((r) => r.fill(null));
    for (const word of byLength) {
      const spot = randomSpot(word);
      if (spot) placeWord(word, spot.row, spot.col, spot.dir);
    }
    if (solutions.length === words.length) break;
  }
  // Keep the solution list in the theme's original word order
  solutions.sort((a, b) => words.indexOf(a.word) - words.indexOf(b.word));

  // Fill empty cells with random letters
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === null) {
        grid[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
    }
  }

  return { grid, solutions };
};
