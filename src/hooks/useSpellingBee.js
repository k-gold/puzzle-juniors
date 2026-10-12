import { useState } from 'react';
import { isValidWord } from '../lib/wordList.js';
import {
  generateSpellingBeePuzzle,
  isValidPuzzle,
  findPuzzle,
} from '../data/spellingBeePuzzles.js';
import { rankProgress, isPangram, isPositiveMessage } from '../lib/beeRank.js';

// Extra points for a word that uses all seven letters
const PANGRAM_BONUS = 20;

export function useSpellingBee(savedState, progress) {
  const { setTotalWordsFound, setGamesCompleted, awardPoints, addCount, calculatePoints } =
    progress;

  // Spelling Bee state - start with random puzzle if no saved state
  // A saved puzzle that is not playable (an old bug) is replaced along with its found words.
  const savedPuzzleOk = isValidPuzzle(savedState?.puzzle);
  const [puzzle, setPuzzle] = useState(() =>
    savedPuzzleOk ? savedState.puzzle : generateSpellingBeePuzzle(),
  );
  const [currentWord, setCurrentWord] = useState('');
  const [foundWords, setFoundWords] = useState(savedPuzzleOk ? savedState?.foundWords || [] : []);
  const [message, setMessage] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  // The puzzle's answers drive the rank. Any valid word still counts as found.
  const answers = findPuzzle(puzzle).answers;
  const progressNow = rankProgress(
    foundWords.filter((w) => answers.includes(w)).length,
    answers.length,
  );
  const puzzleProgress = progressNow;

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
      const pangram = isPangram(upperWord, puzzle.letters);
      const earnedPoints = calculatePoints(upperWord.length) + (pangram ? PANGRAM_BONUS : 0);
      awardPoints(earnedPoints, 'spelling');
      setCurrentWord(''); // Clear immediately to prevent lag

      // Tell the player about a pangram or a new rank, otherwise rely on the points animation
      const foundAfter = newFoundWords.filter((w) => answers.includes(w)).length;
      const rankAfter = rankProgress(foundAfter, answers.length).rank;
      if (pangram) {
        setMessage('Pangram! You used all 7 letters!');
      } else if (rankAfter !== progressNow.rank) {
        setMessage(`Nice! You reached ${rankAfter}!`);
      } else {
        setMessage('');
      }
      if (pangram || rankAfter !== progressNow.rank) setTimeout(() => setMessage(''), 2500);

      setTotalWordsFound((prev) => prev + 1);

      // Count what badges are measured against
      if (pangram) addCount('pangrams');
      if (rankAfter === 'Great' && progressNow.rank !== 'Great') addCount('greatBees');
      if (foundAfter === answers.length && progressNow.found < answers.length)
        addCount('fullHives');
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

    setGamesCompleted((prev) => ({ ...prev, spelling: (prev.spelling || 0) + 1 }));
  };

  // Helper function to handle letter clicks - clears invalid word messages
  const handleLetterClick = (letter) => {
    // If there's an error message (not success/checking), clear it and the word
    if (message && !isPositiveMessage(message)) {
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
    beeProgress: puzzleProgress,
  };
}
