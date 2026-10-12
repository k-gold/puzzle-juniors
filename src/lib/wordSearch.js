import { WORD_LISTS_BY_THEME } from '../data/wordSearchWords.js';

// Generate random Word Search puzzle from unlocked themes
export const generateWordSearchPuzzle = (unlockedThemesList) => {
  // Pick a random theme from unlocked themes
  const randomTheme = unlockedThemesList[Math.floor(Math.random() * unlockedThemesList.length)];
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

  // Place each word
  for (const word of words) {
    let placed = false;
    let attempts = 0;
    const maxAttempts = 100;

    while (!placed && attempts < maxAttempts) {
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);

      if (canPlaceWord(word, row, col, dir)) {
        placeWord(word, row, col, dir);
        placed = true;
      }
      attempts++;
    }
  }

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
