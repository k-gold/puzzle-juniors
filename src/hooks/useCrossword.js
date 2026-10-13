import { useState, useMemo } from 'react';
import { GRIDS } from '../data/crosswordPuzzles.js';
import { parseGrid, entriesAt, cellKey, CROSSWORD_FINISH_BONUS } from '../lib/crossword.js';
import { play } from '../lib/sound.js';

// Start on the first Across clue (or the first Down clue if there is no Across one)
const firstSelection = (puzzle) => {
  const entry = puzzle.entries.find((e) => e.dir === 'across') || puzzle.entries[0];
  return { r: entry.cells[0][0], c: entry.cells[0][1], dir: entry.dir };
};

// A puzzle the player has not seen yet, until every puzzle has been seen. Then the list starts over.
const pickGrid = (seen, current) => {
  const unseen = GRIDS.filter((g) => !seen.includes(g) && g !== current);
  const options = unseen.length ? unseen : GRIDS.filter((g) => g !== current);
  const grid = options[Math.floor(Math.random() * options.length)];
  return { grid, seen: unseen.length ? [...seen, grid] : [grid] };
};

// Mini Crossword. Type a letter into the selected square. When a word is full it checks
// itself: a right word locks in and earns points, a wrong one clears so the player can retry.
export function useCrossword(savedState, progress) {
  const { setTotalWordsFound, setGamesCompleted, awardPoints, addCount, calculatePoints } =
    progress;

  // A saved puzzle that no longer exists is replaced
  const saved = savedState?.crossword;
  const savedOk = saved && GRIDS.includes(saved.grid);
  const [start] = useState(() =>
    savedOk ? { grid: saved.grid, seen: saved.seen || [saved.grid] } : pickGrid([], ''),
  );
  const [grid, setGrid] = useState(start.grid);
  const [seen, setSeen] = useState(start.seen); // puzzles played since the list last started over
  const [letters, setLetters] = useState(savedOk ? saved.letters || {} : {}); // "r,c" -> letter
  const [solved, setSolved] = useState(savedOk ? saved.solved || [] : []); // entry ids
  const [mistakes, setMistakes] = useState(savedOk ? saved.mistakes || 0 : 0);
  const [shaking, setShaking] = useState(null); // entry id that was just wrong

  const puzzle = useMemo(() => parseGrid(grid), [grid]);
  const [selected, setSelected] = useState(() => firstSelection(puzzle));
  // What gets saved (stable between renders, so saving only happens when something changes)
  const crosswordState = useMemo(
    () => ({ grid, seen, letters, solved, mistakes }),
    [grid, seen, letters, solved, mistakes],
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
    // A square where just one word starts (it has a number) selects that word. Otherwise
    // tapping the chosen square again switches between across and down, and tapping a new
    // square keeps the direction when it can.
    const starting = Object.values(at).filter((e) => e.cells[0][0] === r && e.cells[0][1] === c);
    const dir =
      !same && starting.length === 1
        ? starting[0].dir
        : same
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

  // Clues in the order players read them: all the Across clues, then all the Down clues
  const ordered = useMemo(
    () => [
      ...puzzle.entries.filter((e) => e.dir === 'across'),
      ...puzzle.entries.filter((e) => e.dir === 'down'),
    ],
    [puzzle],
  );

  // Go to a word, starting at its first empty square
  const selectEntry = (entry, filled = letters) => {
    const [r, c] = entry.cells.find(([er, ec]) => !filled[cellKey(er, ec)]) || entry.cells[0];
    setSelected({ r, c, dir: entry.dir });
  };

  // Move `step` clues along (wrapping around), skipping words that are already solved
  const stepClue = (from, step, solvedIds = solved, filled = letters) => {
    const start = ordered.findIndex((e) => e.id === from.id);
    for (let i = 1; i <= ordered.length; i++) {
      const entry =
        ordered[(((start + step * i) % ordered.length) + ordered.length) % ordered.length];
      if (!solvedIds.includes(entry.id)) return selectEntry(entry, filled);
    }
  };
  const goToClue = (step) => activeEntry && stepClue(activeEntry, step);

  // Arrow keys: move to the next square that is part of the puzzle
  const moveCell = (dr, dc) => {
    let r = selected.r + dr;
    let c = selected.c + dc;
    while (r >= 0 && c >= 0 && r < puzzle.size && c < puzzle.size) {
      if (puzzle.rows[r][c] !== null) {
        const at = entriesAt(puzzle, r, c);
        const wanted = dc !== 0 ? 'across' : 'down';
        setSelected({ r, c, dir: at[wanted] ? wanted : selected.dir });
        return;
      }
      r += dr;
      c += dc;
    }
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
      return { letters: cleared, solvedNow: newlySolved };
    }
    return { letters: nextLetters, solvedNow: newlySolved };
  };

  const typeLetter = (letter) => {
    if (done || !activeEntry) return;
    const key = cellKey(selected.r, selected.c);
    if (lockedCells.has(key)) return;
    const { letters: next, solvedNow } = checkEntries(
      { ...letters, [key]: letter },
      selected.r,
      selected.c,
    );
    setLetters(next);
    // The word is right: on to the next clue that is still open
    if (solvedNow.some((e) => e.id === activeEntry.id)) {
      const solvedIds = [...solved, ...solvedNow.map((e) => e.id)];
      if (solvedIds.length < puzzle.entries.length) stepClue(activeEntry, 1, solvedIds, next);
      return;
    }
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
    const picked = pickGrid(seen, grid);
    const next = picked.grid;
    setGrid(next);
    setSeen(picked.seen);
    setLetters({});
    setSolved([]);
    setMistakes(0);
    setSelected(firstSelection(parseGrid(next)));
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
    goToCrosswordClue: goToClue,
    moveCrosswordCell: moveCell,
    newCrossword,
  };
}
