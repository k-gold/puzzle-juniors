import { useState } from 'react';
import { generateWordSearchPuzzle } from '../lib/wordSearch.js';
import { play } from '../lib/sound.js';

// Extra points for finding the last word of a puzzle
const FINISH_BONUS = 25;

export function useWordSearch(savedState, progress) {
  const {
    unlockedThemes,
    setTotalWordsFound,
    setGamesCompleted,
    awardPoints,
    addCount,
    calculatePoints,
  } = progress;

  // Word Search state - start with random puzzle if no saved state
  const [wordSearchPuzzle, setWordSearchPuzzle] = useState(
    () => savedState?.wordSearchPuzzle || generateWordSearchPuzzle(unlockedThemes),
  );
  const [wsFoundWords, setWsFoundWords] = useState(savedState?.wsFoundWords || []);
  // Wrong guesses in this puzzle (a puzzle with none earns the Sharp Eyes badge)
  const [wsMisses, setWsMisses] = useState(savedState?.wsMisses || 0);
  const [wsSelectedCells, setWsSelectedCells] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);

  // Word Search functions
  const handleCellMouseDown = (row, col) => {
    setIsSelecting(true);

    // Check if this cell is already selected (tap mode)
    const alreadySelected = wsSelectedCells.some((cell) => cell.row === row && cell.col === col);

    if (alreadySelected && wsSelectedCells.length > 0) {
      // Tapping an already selected cell - try to submit
      checkWordSearchSelection();
      setIsSelecting(false);
      setWsSelectedCells([]);
    } else {
      // Start new selection (works for both drag and tap)
      setWsSelectedCells([{ row, col }]);
    }
  };

  const handleCellMouseEnter = (row, col) => {
    if (!isSelecting || wsSelectedCells.length === 0) return;

    // Check if user is clicking again (tap mode) on adjacent cell
    const lastCell = wsSelectedCells[wsSelectedCells.length - 1];
    const isSameAsLast = lastCell.row === row && lastCell.col === col;

    if (isSameAsLast) return; // Already in selection

    const start = wsSelectedCells[0];
    const rowDiff = row - start.row;
    const colDiff = col - start.col;

    // Check if valid direction (horizontal, vertical, or diagonal)
    const isValidDirection =
      rowDiff === 0 || colDiff === 0 || Math.abs(rowDiff) === Math.abs(colDiff);

    if (isValidDirection) {
      const newSelection = [];
      const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));
      const rowStep = steps === 0 ? 0 : rowDiff / steps;
      const colStep = steps === 0 ? 0 : colDiff / steps;

      for (let i = 0; i <= steps; i++) {
        newSelection.push({
          row: start.row + Math.round(rowStep * i),
          col: start.col + Math.round(colStep * i),
        });
      }

      setWsSelectedCells(newSelection);
    }
  };

  const handleCellMouseUp = () => {
    if (wsSelectedCells.length > 1) {
      // Only check if we have a multi-cell selection (drag mode)
      checkWordSearchSelection();
      setIsSelecting(false);
      setWsSelectedCells([]);
    } else if (wsSelectedCells.length === 1) {
      // Single cell selected - keep it for tap mode (don't clear)
      setIsSelecting(false);
    }
  };

  const handleTouchMove = (e) => {
    if (!isSelecting) return;

    e.preventDefault();
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);

    if (element && element.dataset.row !== undefined) {
      const row = parseInt(element.dataset.row);
      const col = parseInt(element.dataset.col);
      handleCellMouseEnter(row, col);
    }
  };

  const checkWordSearchSelection = () => {
    const selectedWord = wsSelectedCells
      .map((cell) => wordSearchPuzzle.grid[cell.row][cell.col])
      .join('');

    const reversedWord = selectedWord.split('').reverse().join('');

    for (const solution of wordSearchPuzzle.solutions) {
      if (solution.word === selectedWord || solution.word === reversedWord) {
        if (!wsFoundWords.includes(solution.word)) {
          const newWsFoundWords = [...wsFoundWords, solution.word].sort();
          setWsFoundWords(newWsFoundWords);
          const finished = newWsFoundWords.length === wordSearchPuzzle.solutions.length;
          const earnedPoints =
            calculatePoints(solution.word.length) + (finished ? FINISH_BONUS : 0);
          awardPoints(earnedPoints, 'wordsearch');

          setTotalWordsFound((prev) => prev + 1);

          // Finishing the puzzle earns a bonus and counts toward badges
          if (finished) {
            addCount('searchesFinished');
            if (wsMisses === 0) addCount('cleanSearches');
          }
        }
        return;
      }
    }

    // Nothing matched. A single tapped cell is not a guess.
    if (wsSelectedCells.length > 1) {
      setWsMisses((prev) => prev + 1);
      play('buzz');
    }
  };

  const isCellSelected = (row, col) => {
    return wsSelectedCells.some((cell) => cell.row === row && cell.col === col);
  };

  const isCellInSolution = (row, col) => {
    for (const solution of wordSearchPuzzle.solutions) {
      if (wsFoundWords.includes(solution.word)) {
        if (solution.positions.some((pos) => pos.row === row && pos.col === col)) {
          return true;
        }
      }
    }
    return false;
  };

  const newWordSearch = () => {
    setWordSearchPuzzle(generateWordSearchPuzzle(unlockedThemes));
    setWsFoundWords([]);
    setWsMisses(0);
    setWsSelectedCells([]);

    setGamesCompleted((prev) => ({ ...prev, wordsearch: (prev.wordsearch || 0) + 1 }));
  };

  return {
    wordSearchPuzzle,
    setWordSearchPuzzle,
    wsFoundWords,
    setWsFoundWords,
    wsMisses,
    wsSelectedCells,
    setWsSelectedCells,
    isSelecting,
    setIsSelecting,
    handleCellMouseDown,
    handleCellMouseEnter,
    handleCellMouseUp,
    handleTouchMove,
    checkWordSearchSelection,
    isCellSelected,
    isCellInSolution,
    newWordSearch,
  };
}
