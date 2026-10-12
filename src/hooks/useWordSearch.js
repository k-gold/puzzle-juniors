import { useState } from 'react';
import { generateWordSearchPuzzle } from '../lib/wordSearch.js';

export function useWordSearch(savedState, progress) {
  const {
    points,
    unlockedThemes,
    badges,
    totalWordsFound,
    setTotalWordsFound,
    gamesCompleted,
    setGamesCompleted,
    awardPoints,
    awardBadge,
    calculatePoints,
  } = progress;

  // Word Search state - start with random puzzle if no saved state
  const [wordSearchPuzzle, setWordSearchPuzzle] = useState(
    () => savedState?.wordSearchPuzzle || generateWordSearchPuzzle(unlockedThemes),
  );
  const [wsFoundWords, setWsFoundWords] = useState(savedState?.wsFoundWords || []);
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
          const earnedPoints = calculatePoints(solution.word.length);
          awardPoints(earnedPoints, 'wordsearch');

          // Track total words
          setTotalWordsFound((prev) => prev + 1);
          const newTotal = totalWordsFound + 1;

          // Word milestone badges
          if (newTotal === 25 && !badges.includes('word-finder')) {
            setTimeout(() => awardBadge('word-finder', 'Word Finder', '🔍'), 100);
          }
          if (newTotal === 50 && !badges.includes('word-hunter')) {
            setTimeout(() => awardBadge('word-hunter', 'Word Hunter', '🎪'), 100);
          }
          if (newTotal === 100 && !badges.includes('word-master')) {
            setTimeout(() => awardBadge('word-master', 'Word Master', '👑'), 100);
          }
          if (newTotal === 200 && !badges.includes('word-champion')) {
            setTimeout(() => awardBadge('word-champion', 'Word Champion', '🏆'), 100);
          }
          if (newTotal === 300 && !badges.includes('word-legend')) {
            setTimeout(() => awardBadge('word-legend', 'Word Legend', '⭐'), 100);
          }

          // Point-based badges
          const currentPoints = points + earnedPoints;
          if (currentPoints >= 1000 && !badges.includes('point-king')) {
            setTimeout(() => awardBadge('point-king', 'Point King', '👑'), 200);
          }
          if (currentPoints >= 2500 && !badges.includes('mega-collector')) {
            setTimeout(() => awardBadge('mega-collector', 'Mega Collector', '💰'), 200);
          }

          // Check if puzzle completed
          if (newWsFoundWords.length === wordSearchPuzzle.solutions.length) {
            awardBadge('perfect-game', 'Perfect Game', '💯');
          }
        }
        break;
      }
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
    setWsSelectedCells([]);

    // Track game completion
    const newGamesCompleted = (gamesCompleted.wordsearch || 0) + 1;
    setGamesCompleted((prev) => ({ ...prev, wordsearch: newGamesCompleted }));

    // Award search badges
    if (newGamesCompleted === 5 && !badges.includes('search-novice')) {
      setTimeout(() => awardBadge('search-novice', 'Search Novice', '🔎'), 100);
    }
    if (newGamesCompleted === 10 && !badges.includes('search-expert')) {
      setTimeout(() => awardBadge('search-expert', 'Search Expert', '🔍'), 100);
    }
    if (newGamesCompleted === 25 && !badges.includes('search-champion')) {
      setTimeout(() => awardBadge('search-champion', 'Search Champion', '🥈'), 100);
    }

    // Check combo-master (played all 3 games)
    const updatedCompleted = {
      ...gamesCompleted,
      wordsearch: newGamesCompleted,
    };
    if (
      updatedCompleted.spelling >= 1 &&
      updatedCompleted.wordsearch >= 1 &&
      updatedCompleted.wordle >= 1 &&
      !badges.includes('combo-master')
    ) {
      setTimeout(() => awardBadge('combo-master', 'Combo Master', '🎮'), 200);
    }
  };

  return {
    wordSearchPuzzle,
    setWordSearchPuzzle,
    wsFoundWords,
    setWsFoundWords,
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
