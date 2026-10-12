import { useState } from 'react';
import { isValidWord } from '../lib/wordList.js';
import { generateSpellingBeePuzzle } from '../data/spellingBeePuzzles.js';

export function useSpellingBee(savedState, progress) {
  const {
    points,
    badges,
    totalWordsFound,
    setTotalWordsFound,
    gamesCompleted,
    setGamesCompleted,
    awardPoints,
    awardBadge,
    calculatePoints,
  } = progress;

  // Spelling Bee state - start with random puzzle if no saved state
  const [puzzle, setPuzzle] = useState(savedState?.puzzle || generateSpellingBeePuzzle());
  const [currentWord, setCurrentWord] = useState('');
  const [foundWords, setFoundWords] = useState(savedState?.foundWords || []);
  const [message, setMessage] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleSubmit = async () => {
    if (currentWord.length < 3) {
      setMessage('Words must be at least 3 letters!');
      setTimeout(() => {
        setMessage('');
        setCurrentWord('');
      }, 2000);
      return;
    }

    const upperWord = currentWord.toUpperCase();

    if (!upperWord.includes(puzzle.center)) {
      setMessage(`Must include ${puzzle.center}!`);
      setTimeout(() => {
        setMessage('');
        setCurrentWord('');
      }, 2000);
      return;
    }

    if (foundWords.includes(upperWord)) {
      setMessage('Already found!');
      setTimeout(() => {
        setMessage('');
        setCurrentWord('');
      }, 2000);
      return;
    }

    for (let char of upperWord) {
      if (!puzzle.letters.includes(char)) {
        setMessage('Use only the given letters!');
        setTimeout(() => {
          setMessage('');
          setCurrentWord('');
        }, 2000);
        return;
      }
    }

    setIsValidating(true);
    setMessage('Checking...');

    const isValid = await isValidWord(upperWord);

    setIsValidating(false);

    if (isValid) {
      const newFoundWords = [...foundWords, upperWord].sort();
      setFoundWords(newFoundWords);
      const earnedPoints = calculatePoints(upperWord.length);
      awardPoints(earnedPoints, 'spelling');
      setCurrentWord(''); // Clear immediately to prevent lag
      setMessage(''); // No message, rely on animation

      // Track total words and check badges
      setTotalWordsFound((prev) => prev + 1);
      const newTotal = totalWordsFound + 1;

      // Badge checks
      if (newTotal === 25) awardBadge('word-finder', 'Word Finder', '🔍');
      if (newTotal === 50) awardBadge('word-hunter', 'Word Hunter', '🎪');
      if (newTotal === 100) awardBadge('word-master', 'Word Master', '👑');
      if (newTotal === 200) awardBadge('word-champion', 'Word Champion', '🏆');
      if (newTotal === 300) awardBadge('word-legend', 'Word Legend', '⭐');
      if (upperWord.length >= 7) awardBadge('spelling-master', 'Spelling Master', '📝');
      if (newFoundWords.length >= 5) awardBadge('quick-thinker', 'Quick Thinker', '⚡');

      // Point-based badges
      const currentPoints = points + earnedPoints;
      if (currentPoints >= 1000 && !badges.includes('point-king')) {
        setTimeout(() => awardBadge('point-king', 'Point King', '👑'), 100);
      }
      if (currentPoints >= 2500 && !badges.includes('mega-collector')) {
        setTimeout(() => awardBadge('mega-collector', 'Mega Collector', '💰'), 100);
      }
    } else {
      setMessage('Not in word list');
      setTimeout(() => {
        setMessage('');
        setCurrentWord('');
      }, 1500); // Reduced from 2000ms
    }
  };

  const shuffleLetters = () => {
    const nonCenter = puzzle.letters.filter((l) => l !== puzzle.center);
    const shuffled = nonCenter.sort(() => Math.random() - 0.5);
    setPuzzle({ ...puzzle, letters: [...shuffled, puzzle.center] });
  };

  const newGame = () => {
    setPuzzle(generateSpellingBeePuzzle());
    setCurrentWord('');
    setFoundWords([]);
    setMessage('');

    // Track game completion
    const newGamesCompleted = (gamesCompleted.spelling || 0) + 1;
    setGamesCompleted((prev) => ({ ...prev, spelling: newGamesCompleted }));

    // Award bee badges
    if (newGamesCompleted === 5 && !badges.includes('bee-novice')) {
      setTimeout(() => awardBadge('bee-novice', 'Bee Novice', '🐝'), 100);
    }
    if (newGamesCompleted === 10 && !badges.includes('bee-expert')) {
      setTimeout(() => awardBadge('bee-expert', 'Bee Expert', '🐝'), 100);
    }
    if (newGamesCompleted === 25 && !badges.includes('bee-champion')) {
      setTimeout(() => awardBadge('bee-champion', 'Bee Champion', '🥇'), 100);
    }

    // Check combo-master (played all 3 games)
    const updatedCompleted = { ...gamesCompleted, spelling: newGamesCompleted };
    if (
      updatedCompleted.spelling >= 1 &&
      updatedCompleted.wordsearch >= 1 &&
      updatedCompleted.wordle >= 1 &&
      !badges.includes('combo-master')
    ) {
      setTimeout(() => awardBadge('combo-master', 'Combo Master', '🎮'), 200);
    }
  };

  // Helper function to handle letter clicks - clears invalid word messages
  const handleLetterClick = (letter) => {
    // If there's an error message (not success/checking), clear it and the word
    if (message && !message.includes('Great') && !message.includes('Checking')) {
      setMessage('');
      setCurrentWord(letter.toLowerCase());
    } else {
      setCurrentWord(currentWord + letter.toLowerCase());
    }
  };

  // Outer ring letters (6 letters)
  const outerLetters = puzzle.letters.filter((l) => l !== puzzle.center);

  return {
    puzzle,
    setPuzzle,
    currentWord,
    setCurrentWord,
    foundWords,
    setFoundWords,
    message,
    setMessage,
    isValidating,
    setIsValidating,
    handleSubmit,
    shuffleLetters,
    newGame,
    handleLetterClick,
    outerLetters,
  };
}
