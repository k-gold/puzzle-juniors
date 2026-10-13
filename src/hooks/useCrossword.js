import { useState, useMemo } from 'react';
import { GRIDS } from '../data/crosswordPuzzles.js';
import { parseGrid, entriesAt, cellKey, CROSSWORD_FINISH_BONUS } from '../lib/crossword.js';
import { play } from '../lib/sound.js';

const randomGrid = (not) => {
  const options = GRIDS.filter((g) => g !== not);
  return options[Math.floor(Math.random() * options.length)];
};

// Mini Crossword. Type a letter into the selected square. When a word is full it checks
// itself: a right word locks in and earns points, a wrong one clears so the player can retry.
export function useCrossword(savedState, progress) {
  const { setTotalWordsFound, setGamesCompleted, awardPoints, addCount, calculatePoints } =
    progress;

  // A saved puzzle that no longer exists is replaced
  const saved = savedState?.crossword;
  const savedOk = saved && GRIDS.includes(saved.grid);
  const [grid, setGrid] = useState(() => (savedOk ? saved.grid : randomGrid()));
  const [letters, setLetters] = useState(savedOk ? saved.letters || {} : {}); // "r,c" -> letter
  const [solved, setSolved] = useState(savedOk ? saved.solved || [] : []); // entry ids
  const [mistakes, setMistakes] = useState(savedOk ? saved.mistakes || 0 : 0);
  const [selected, setSelected] = useState({ r: 0, c: 0, dir: 'across' });
  const [shaking, setShaking] = useState(null); // entry id that was just wrong

  const puzzle = useMemo(() => parseGrid(grid), [grid]);
  // What gets saved (stable between renders, so saving only happens when something changes)
  const crosswordState = useMemo(
    () => ({ grid, letters, solved, mistakes }),
    [grid, letters, solved, mistakes],
  );
  const done = solved.length === puzzle.entries.length;
  const lockedCells = new Set(
    puzzle.entries
      .filter((e) => solved.includes(e.id))
      .flatMap((e) => e.cells.map(([r, c]) => cellKey(r, c))),
  );

  // The word the player is working on: the one in the chosen direction, else the other one
  const here = entriesAt(puzzle, selected.r, selected.c);
  const activeEntry = here[selected.dir] || here.across || here.down || null;

  const selectCell = (r, c) => {
    if (puzzle.rows[r][c] === null) return;
    const at = entriesAt(puzzle, r, c);
    const same = selected.r === r && selected.c === c;
    // Tapping the chosen square again switches between across and down
    const dir = same
      ? selected.dir === 'across' && at.down
        ? 'down'
        : selected.dir === 'down' && at.across
          ? 'across'
          : selected.dir
      : at[selected.dir]
        ? selected.dir
        : at.across
          ? 'across'
          : 'down';
    setSelected({ r, c, dir });
  };

  const selectEntry = (entry) => {
    const [r, c] = entry.cells.find(([er, ec]) => !letters[cellKey(er, ec)]) || entry.cells[0];
    setSelected({ r, c, dir: entry.dir });
  };

  // Right and wrong are decided for every word that this square belongs to
  const checkEntries = (nextLetters, r, c) => {
    const at = entriesAt(puzzle, r, c);
    let newlySolved = [];
    let wrong = [];
    for (const entry of Object.values(at)) {
      if (solved.includes(entry.id)) continue;
      const spelled = entry.cells.map(([er, ec]) => nextLetters[cellKey(er, ec)] || '');
      if (spelled.some((l) => !l)) continue;
      if (spelled.join('') === entry.answer) newlySolved.push(entry);
      else wrong.push(entry);
    }

    if (newlySolved.length) {
      const finished = solved.length + newlySolved.length === puzzle.entries.length;
      const perfect = mistakes === 0;
      const earned =
        newlySolved.reduce((sum, e) => sum + calculatePoints(e.answer.length), 0) +
        (finished ? CROSSWORD_FINISH_BONUS : 0);
      awardPoints(earned, 'crossword');
      setSolved((prev) => [...prev, ...newlySolved.map((e) => e.id)]);
      setTotalWordsFound((prev) => prev + newlySolved.length);
      if (finished) {
        addCount('crosswordsFinished');
        if (perfect) addCount('cleanCrosswords');
      }
    }

    if (wrong.length) {
      play('buzz');
      setMistakes((prev) => prev + 1);
      setShaking(wrong[0].id);
      setTimeout(() => setShaking(null), 500);
      // Clear the wrong word, but keep letters that belong to words already solved
      const cleared = { ...nextLetters };
      for (const e of wrong) {
        for (const [er, ec] of e.cells) {
          const key = cellKey(er, ec);
          const lockedElsewhere = puzzle.entries.some(
            (o) =>
              (solved.includes(o.id) || newlySolved.includes(o)) &&
              o.cells.some(([a, b]) => a === er && b === ec),
          );
          if (!lockedElsewhere) delete cleared[key];
        }
      }
      return cleared;
    }
    return nextLetters;
  };

  const typeLetter = (letter) => {
    if (done || !activeEntry) return;
    const key = cellKey(selected.r, selected.c);
    if (lockedCells.has(key)) return;
    const next = checkEntries({ ...letters, [key]: letter }, selected.r, selected.c);
    setLetters(next);
    // A wrong word was cleared: go back to the start of the word to try again
    if (!next[key]) {
      const start = activeEntry.cells.find(([r, c]) => !next[cellKey(r, c)]);
      if (start) setSelected({ ...selected, r: start[0], c: start[1] });
      return;
    }
    // Move along the word to the next square that can take a letter
    const index = activeEntry.cells.findIndex(([r, c]) => r === selected.r && c === selected.c);
    const following = activeEntry.cells
      .slice(index + 1)
      .find(([r, c]) => !lockedCells.has(cellKey(r, c)));
    if (following) setSelected({ ...selected, r: following[0], c: following[1] });
  };

  const backspace = () => {
    if (done || !activeEntry) return;
    const key = cellKey(selected.r, selected.c);
    if (letters[key] && !lockedCells.has(key)) {
      const next = { ...letters };
      delete next[key];
      setLetters(next);
      return;
    }
    // Nothing here to delete: step back along the word
    const index = activeEntry.cells.findIndex(([r, c]) => r === selected.r && c === selected.c);
    const before = activeEntry.cells
      .slice(0, index)
      .reverse()
      .find(([r, c]) => !lockedCells.has(cellKey(r, c)));
    if (before) {
      const next = { ...letters };
      delete next[cellKey(before[0], before[1])];
      setLetters(next);
      setSelected({ ...selected, r: before[0], c: before[1] });
    }
  };

  const newCrossword = () => {
    setGrid(randomGrid(grid));
    setLetters({});
    setSolved([]);
    setMistakes(0);
    setSelected({ r: 0, c: 0, dir: 'across' });
    setGamesCompleted((prev) => ({ ...prev, crossword: (prev.crossword || 0) + 1 }));
  };

  return {
    crosswordState,
    crossword: puzzle,
    crosswordLetters: letters,
    crosswordSolved: solved,
    crosswordMistakes: mistakes,
    crosswordSelected: selected,
    crosswordActiveEntry: activeEntry,
    crosswordShaking: shaking,
    crosswordDone: done,
    selectCrosswordCell: selectCell,
    selectCrosswordEntry: selectEntry,
    typeCrosswordLetter: typeLetter,
    crosswordBackspace: backspace,
    newCrossword,
  };
}
