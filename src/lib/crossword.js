import { CLUES } from '../data/crosswordPuzzles.js';

// Points for finishing a whole puzzle, on top of the points for each word
export const CROSSWORD_FINISH_BONUS = 25;

// Turns a grid text like 'CAR##/A#HAY/...' into what the game needs:
//   rows     the letters, with null for a black square
//   entries  every word, with its number, direction, squares, answer and clue
//   numbers  the clue number to print in a square ("r,c" -> number)
//   outside  black squares to leave out when drawing (the rest are drawn black)
export function parseGrid(text) {
  const rows = text.split('/');
  const size = rows.length;
  const white = (r, c) => r >= 0 && c >= 0 && r < size && c < size && rows[r][c] !== '#';
  const entries = [];
  const numbers = {};
  const walk = (r, c, dr, dc) => {
    const cells = [];
    while (white(r, c)) {
      cells.push([r, c]);
      r += dr;
      c += dc;
    }
    return cells;
  };
  let number = 0;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!white(r, c)) continue;
      const across = !white(r, c - 1) && white(r, c + 1) && white(r, c + 2);
      const down = !white(r - 1, c) && white(r + 1, c) && white(r + 2, c);
      if (!across && !down) continue;
      number++;
      numbers[`${r},${c}`] = number;
      for (const [dir, dr, dc, starts] of [
        ['across', 0, 1, across],
        ['down', 1, 0, down],
      ]) {
        if (!starts) continue;
        const cells = walk(r, c, dr, dc);
        const answer = cells.map(([cr, cc]) => rows[cr][cc]).join('');
        entries.push({ id: `${number}${dir}`, number, dir, cells, answer, clue: CLUES[answer] });
      }
    }
  }
  // Black squares that connect to the edge of the grid are left out when drawing, so only the
  // squares inside the puzzle's outline show as black. Found by walking in from the edges.
  const outside = new Set();
  const queue = [];
  const visit = (r, c) => {
    if (r < 0 || c < 0 || r >= size || c >= size) return;
    if (white(r, c) || outside.has(cellKey(r, c))) return;
    outside.add(cellKey(r, c));
    queue.push([r, c]);
  };
  for (let i = 0; i < size; i++) {
    visit(0, i);
    visit(size - 1, i);
    visit(i, 0);
    visit(i, size - 1);
  }
  while (queue.length) {
    const [r, c] = queue.pop();
    visit(r - 1, c);
    visit(r + 1, c);
    visit(r, c - 1);
    visit(r, c + 1);
  }

  return {
    size,
    outside,
    rows: rows.map((row) => [...row].map((ch) => (ch === '#' ? null : ch))),
    entries,
    numbers,
  };
}

export const cellKey = (r, c) => `${r},${c}`;

// The entries running through a square, by direction
export function entriesAt(puzzle, r, c) {
  const found = {};
  for (const e of puzzle.entries) {
    if (e.cells.some(([er, ec]) => er === r && ec === c)) found[e.dir] = e;
  }
  return found;
}
