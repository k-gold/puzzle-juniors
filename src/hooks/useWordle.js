import { useState, useEffect } from 'react';
import { isValidWord } from '../lib/wordList.js';
import { WORDLE_WORDS } from '../data/wordleWords.js';
import { scoreGuess } from '../lib/wordleScoring.js';

export function useWordle(savedState, progress, colors) {
  const {
    points,
    badges,
    totalWordsFound,
    setTotalWordsFound,
    gamesCompleted,
    setGamesCompleted,
    wordleWins,
    setWordleWins,
    wordleStreak,
    setWordleStreak,
    awardPoints,
    awardBadge,
  } = progress;

  // Mode state
  const [wordleMode, setWordleMode] = useState(savedState?.wordleMode || 'daily'); // 'daily' | 'practice'

  // Daily puzzle state
  const [dailyPuzzleNumber, setDailyPuzzleNumber] = useState(savedState?.dailyPuzzleNumber || 0);
  const [dailyCompleted, setDailyCompleted] = useState(savedState?.dailyCompleted || false);
  const [dailyStreak, setDailyStreak] = useState(savedState?.dailyStreak || 0);
  const [dailyMaxStreak, setDailyMaxStreak] = useState(savedState?.dailyMaxStreak || 0);
  const [dailyWins, setDailyWins] = useState(savedState?.dailyWins || 0);
  const [dailyGamesPlayed, setDailyGamesPlayed] = useState(savedState?.dailyGamesPlayed || 0);
  const [lastDailyDate, setLastDailyDate] = useState(savedState?.lastDailyDate || '');

  // Practice stats (separate from daily)
  const [practiceWins, setPracticeWins] = useState(savedState?.practiceWins || 0);
  const [practiceGamesPlayed, setPracticeGamesPlayed] = useState(
    savedState?.practiceGamesPlayed || 0,
  );

  // Current Wordle game state (used by both modes)
  // Current Wordle game state (used by both modes)
  const [wordleTarget, setWordleTarget] = useState('');
  const [wordleGuesses, setWordleGuesses] = useState(savedState?.wordleGuesses || []);
  const [wordleCurrentGuess, setWordleCurrentGuess] = useState('');
  const [wordleGameOver, setWordleGameOver] = useState(savedState?.wordleGameOver || false);
  const [wordleWon, setWordleWon] = useState(savedState?.wordleWon || false);
  const [wordleError, setWordleError] = useState('');

  // Initialize daily puzzle on mount
  useEffect(() => {
    const initializeDailyPuzzle = () => {
      const EPOCH = new Date('2026-01-10');
      EPOCH.setHours(0, 0, 0, 0);

      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const daysSinceEpoch = Math.floor((now - EPOCH) / (1000 * 60 * 60 * 24));
      const puzzleNum = daysSinceEpoch + 1;
      const todayWord = WORDLE_WORDS[daysSinceEpoch % WORDLE_WORDS.length];
      const todayDate = now.toDateString();

      setDailyPuzzleNumber(puzzleNum);

      // Check if it's a new day
      if (lastDailyDate !== todayDate) {
        // New day - reset daily completed status
        if (lastDailyDate) {
          // Check streak
          const lastDate = new Date(lastDailyDate);
          lastDate.setHours(0, 0, 0, 0);
          const daysDiff = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));

          if (daysDiff === 1) {
            // Consecutive day - maintain streak (will increment on win)
          } else if (daysDiff > 1) {
            // Missed day(s) - break streak
            setDailyStreak(0);
          }
        }

        setDailyCompleted(false);
        setLastDailyDate(todayDate);

        // If in daily mode, set up the new puzzle
        if (wordleMode === 'daily' || !savedState) {
          setWordleTarget(todayWord);
          setWordleGuesses([]);
          setWordleCurrentGuess('');
          setWordleGameOver(false);
          setWordleWon(false);
        }
      } else {
        // Same day
        if (wordleMode === 'daily' && !wordleTarget) {
          setWordleTarget(todayWord);
        }
      }

      // If in practice mode and no target, generate one
      if (wordleMode === 'practice' && !wordleTarget) {
        setWordleTarget(WORDLE_WORDS[Math.floor(Math.random() * WORDLE_WORDS.length)]);
      }
    };

    initializeDailyPuzzle();
  }, []);

  // Wordle: Handle Key Press
  const handleWordleKey = async (key) => {
    if (wordleGameOver) return;

    if (key === 'ENTER') {
      if (wordleCurrentGuess.length === 4) {
        // Validate word using dictionary API
        const isValid = await isValidWord(wordleCurrentGuess);

        if (!isValid) {
          setWordleError('Not in word list');
          setTimeout(() => {
            setWordleError('');
            setWordleCurrentGuess('');
          }, 1000);
          return;
        }

        const newGuesses = [...wordleGuesses, wordleCurrentGuess];
        setWordleGuesses(newGuesses);

        if (wordleCurrentGuess === wordleTarget) {
          setWordleWon(true);
          setWordleGameOver(true);

          // Award points based on number of guesses: 50, 40, 30, 20, 10, 10
          let earnedPoints;
          switch (newGuesses.length) {
            case 1:
              earnedPoints = 50;
              break;
            case 2:
              earnedPoints = 40;
              break;
            case 3:
              earnedPoints = 30;
              break;
            case 4:
              earnedPoints = 20;
              break;
            case 5:
            case 6:
              earnedPoints = 10;
              break;
            default:
              earnedPoints = 10;
          }

          awardPoints(earnedPoints, 'wordle');
          const newTotalWords = totalWordsFound + 1;
          setTotalWordsFound(newTotalWords);

          // Handle daily vs practice stats separately
          if (wordleMode === 'daily') {
            // Daily mode - update daily stats
            setDailyCompleted(true);
            const newDailyWins = dailyWins + 1;
            setDailyWins(newDailyWins);
            const newDailyGamesPlayed = dailyGamesPlayed + 1;
            setDailyGamesPlayed(newDailyGamesPlayed);
            const newDailyStreak = dailyStreak + 1;
            setDailyStreak(newDailyStreak);

            // Update max streak
            if (newDailyStreak > dailyMaxStreak) {
              setDailyMaxStreak(newDailyStreak);
            }

            // Daily-specific badges
            if (newDailyStreak === 5 && !badges.includes('perfect-streak')) {
              setTimeout(() => awardBadge('perfect-streak', 'Perfect Streak', '🔥'), 1600);
            }
            if (newDailyStreak === 10 && !badges.includes('unstoppable')) {
              setTimeout(() => awardBadge('unstoppable', 'Unstoppable', '🔥'), 1700);
            }
          } else {
            // Practice mode - update practice stats
            const newPracticeWins = practiceWins + 1;
            setPracticeWins(newPracticeWins);
            const newPracticeGamesPlayed = practiceGamesPlayed + 1;
            setPracticeGamesPlayed(newPracticeGamesPlayed);
          }

          // Update combined Wordle stats (for badges)
          const newWordleWins = wordleWins + 1;
          setWordleWins(newWordleWins);
          const newWordleStreak = wordleStreak + 1;
          setWordleStreak(newWordleStreak);

          // Wordle-specific badges
          if (newGuesses.length <= 2 && !badges.includes('speed-demon')) {
            setTimeout(() => awardBadge('speed-demon', 'Speed Demon', '⚡'), 1600);
          }
          if (newWordleWins === 1 && !badges.includes('wordle-rookie')) {
            setTimeout(() => awardBadge('wordle-rookie', 'Wordle Rookie', '🎲'), 1600);
          }
          if (newWordleWins === 5 && !badges.includes('wordle-ace')) {
            setTimeout(() => awardBadge('wordle-ace', 'Wordle Ace', '🎯'), 1600);
          }
          if (newWordleWins === 25 && !badges.includes('wordle-master')) {
            setTimeout(() => awardBadge('wordle-master', 'Wordle Master', '👑'), 1600);
          }

          // Check if word contains letter E
          if (wordleTarget.includes('E') && !badges.includes('e-badge')) {
            setTimeout(() => awardBadge('e-badge', 'E Badge', '🅴'), 1700);
          }

          // General word badges
          if (newTotalWords === 25 && !badges.includes('word-finder')) {
            setTimeout(() => awardBadge('word-finder', 'Word Finder', '🔍'), 1800);
          }
          if (newTotalWords === 50 && !badges.includes('word-hunter')) {
            setTimeout(() => awardBadge('word-hunter', 'Word Hunter', '🎪'), 1800);
          }
          if (newTotalWords === 100 && !badges.includes('word-master')) {
            setTimeout(() => awardBadge('word-master', 'Word Master', '👑'), 1800);
          }
          if (newTotalWords === 200 && !badges.includes('word-champion')) {
            setTimeout(() => awardBadge('word-champion', 'Word Champion', '🏆'), 1800);
          }

          // New gameplay badges
          if (newTotalWords === 300 && !badges.includes('word-legend')) {
            setTimeout(() => awardBadge('word-legend', 'Word Legend', '⭐'), 1900);
          }
          if (newWordleWins === 50 && !badges.includes('wordle-legend')) {
            setTimeout(() => awardBadge('wordle-legend', 'Wordle Legend', '🏅'), 1600);
          }

          // Point-based badges (check after awarding points)
          const currentPoints = points + earnedPoints;
          if (currentPoints >= 1000 && !badges.includes('point-king')) {
            setTimeout(() => awardBadge('point-king', 'Point King', '👑'), 1800);
          }
          if (currentPoints >= 2500 && !badges.includes('mega-collector')) {
            setTimeout(() => awardBadge('mega-collector', 'Mega Collector', '💰'), 1900);
          }
        } else if (newGuesses.length >= 6) {
          setWordleGameOver(true);

          // Handle loss differently for daily vs practice
          if (wordleMode === 'daily') {
            setDailyCompleted(true);
            const newDailyGamesPlayed = dailyGamesPlayed + 1;
            setDailyGamesPlayed(newDailyGamesPlayed);
            // Reset daily streak on loss
            setDailyStreak(0);
          } else {
            const newPracticeGamesPlayed = practiceGamesPlayed + 1;
            setPracticeGamesPlayed(newPracticeGamesPlayed);
          }

          // Reset combined streak on loss
          setWordleStreak(0);
        }

        setWordleCurrentGuess('');
      }
    } else if (key === 'BACK') {
      setWordleCurrentGuess((prev) => prev.slice(0, -1));
    } else if (wordleCurrentGuess.length < 4) {
      setWordleCurrentGuess((prev) => prev + key);
    }
  };

  // Wordle: Switch Mode
  const switchWordleMode = (mode) => {
    setWordleMode(mode);

    if (mode === 'daily') {
      // Switch to daily mode
      const EPOCH = new Date('2026-01-10');
      EPOCH.setHours(0, 0, 0, 0);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const daysSinceEpoch = Math.floor((now - EPOCH) / (1000 * 60 * 60 * 24));
      const dailyWord = WORDLE_WORDS[daysSinceEpoch % WORDLE_WORDS.length];

      if (!dailyCompleted) {
        setWordleTarget(dailyWord);
        setWordleGuesses([]);
        setWordleCurrentGuess('');
        setWordleGameOver(false);
        setWordleWon(false);
      }
    } else {
      // Switch to practice mode
      setWordleTarget(WORDLE_WORDS[Math.floor(Math.random() * WORDLE_WORDS.length)]);
      setWordleGuesses([]);
      setWordleCurrentGuess('');
      setWordleGameOver(false);
      setWordleWon(false);
    }
  };

  // Wordle: Share Results (Daily Only)
  const shareWordleResults = async () => {
    if (wordleMode !== 'daily' || !wordleGameOver) return;

    // Calculate guesses used
    const guessCount = wordleWon ? wordleGuesses.length : 'X';
    const title = `Puzzle Juniors #${dailyPuzzleNumber} ${guessCount}/6`;
    let grid = '';

    // Generate emoji grid
    for (const guess of wordleGuesses) {
      for (let i = 0; i < guess.length; i++) {
        const color = getWordleLetterColor(guess[i], i, guess);
        if (color === colors.success) grid += '🟩';
        else if (color === colors.accent) grid += '🟨';
        else grid += '⬜';
      }
      grid += '\n';
    }

    const shareText = `${title}\n\n${grid}\nPlay now at puzzlejuniors.com`;

    try {
      // Try to use native share sheet (iOS/Android)
      if (navigator.share) {
        await navigator.share({
          text: shareText,
        });
      } else {
        // Fallback to clipboard for desktop
        await navigator.clipboard.writeText(shareText);
        alert('Results copied to clipboard!');
      }
    } catch (err) {
      // If share was cancelled or failed, try clipboard as fallback
      if (err.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(shareText);
          alert('Results copied to clipboard!');
        } catch (clipboardErr) {
          console.error('Failed to share:', err, clipboardErr);
        }
      }
    }
  };

  // Wordle: New Game (Practice Mode Only)
  const newWordle = () => {
    if (wordleMode !== 'practice') return;

    setWordleTarget(WORDLE_WORDS[Math.floor(Math.random() * WORDLE_WORDS.length)]);
    setWordleGuesses([]);
    setWordleCurrentGuess('');
    setWordleGameOver(false);
    setWordleWon(false);

    // Increment practice games
    const newGamesCompleted = gamesCompleted.wordle ? gamesCompleted.wordle + 1 : 1;
    setGamesCompleted((prev) => ({ ...prev, wordle: newGamesCompleted }));

    // Check combo-master (played all 3 games)
    const updatedCompleted = { ...gamesCompleted, wordle: newGamesCompleted };
    if (
      updatedCompleted.spelling >= 1 &&
      updatedCompleted.wordsearch >= 1 &&
      updatedCompleted.wordle >= 1 &&
      !badges.includes('combo-master')
    ) {
      setTimeout(() => awardBadge('combo-master', 'Combo Master', '🎮'), 100);
    }
  };

  // Wordle: Get Letter Color (handles duplicate letters correctly)
  const getWordleLetterColor = (letter, index, guess) => {
    const result = scoreGuess(guess, wordleTarget)[index];
    if (result === 'green') return colors.success;
    if (result === 'yellow') return colors.accent;
    return colors.textLight;
  };

  // Wordle: Get keyboard key color based on all previous guesses
  const getKeyboardKeyColor = (key) => {
    if (!wordleGuesses.length) return colors.primary; // Default color if no guesses yet

    let keyState = 'unused'; // unused, wrong, present, correct

    for (const guess of wordleGuesses) {
      const results = scoreGuess(guess, wordleTarget);

      for (let i = 0; i < guess.length; i++) {
        if (guess[i] === key) {
          if (results[i] === 'green') {
            keyState = 'correct';
            break; // Correct is highest priority
          } else if (results[i] === 'yellow' && keyState !== 'correct') {
            keyState = 'present';
          } else if (results[i] === 'gray' && keyState === 'unused') {
            keyState = 'wrong';
          }
        }
      }

      if (keyState === 'correct') break; // No need to check other guesses
    }

    switch (keyState) {
      case 'correct':
        return colors.success;
      case 'present':
        return colors.accent;
      case 'wrong':
        return colors.textLight;
      default:
        return colors.primary;
    }
  };

  return {
    wordleMode,
    setWordleMode,
    dailyPuzzleNumber,
    setDailyPuzzleNumber,
    dailyCompleted,
    setDailyCompleted,
    dailyStreak,
    setDailyStreak,
    dailyMaxStreak,
    setDailyMaxStreak,
    dailyWins,
    setDailyWins,
    dailyGamesPlayed,
    setDailyGamesPlayed,
    lastDailyDate,
    setLastDailyDate,
    practiceWins,
    setPracticeWins,
    practiceGamesPlayed,
    setPracticeGamesPlayed,
    wordleTarget,
    setWordleTarget,
    wordleGuesses,
    setWordleGuesses,
    wordleCurrentGuess,
    setWordleCurrentGuess,
    wordleGameOver,
    setWordleGameOver,
    wordleWon,
    setWordleWon,
    wordleError,
    setWordleError,
    handleWordleKey,
    switchWordleMode,
    shareWordleResults,
    newWordle,
    getWordleLetterColor,
    getKeyboardKeyColor,
  };
}
