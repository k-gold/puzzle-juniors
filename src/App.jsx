import { useState, useEffect } from 'react';
import { loadSavedState, saveState } from './lib/storage.js';
import { COLOR_THEMES } from './data/colorThemes.js';
import { useProgress } from './hooks/useProgress.js';
import { useSpellingBee } from './hooks/useSpellingBee.js';
import { useWordSearch } from './hooks/useWordSearch.js';
import { useWordle } from './hooks/useWordle.js';
import { useScramble } from './hooks/useScramble.js';
import { useBadges } from './hooks/useBadges.js';
import Header from './components/Header.jsx';
import Notifications from './components/Notifications.jsx';
import SpellingBee from './components/SpellingBee.jsx';
import WordSearch from './components/WordSearch.jsx';
import Wordle from './components/Wordle.jsx';
import Scramble from './components/Scramble.jsx';
import Rewards from './components/Rewards.jsx';

export default function App() {
  const savedState = loadSavedState();

  const [activeGame, setActiveGame] = useState(savedState?.activeGame || 'spelling');

  const progress = useProgress(savedState);
  const bee = useSpellingBee(savedState, progress);
  const wordSearch = useWordSearch(savedState, progress);

  // Kid-friendly color scheme, chosen from the unlocked visual themes
  const colors = COLOR_THEMES[progress.currentVisualTheme] || COLOR_THEMES.classic;
  const wordle = useWordle(savedState, progress);
  const scramble = useScramble(savedState, progress);

  // Everything a screen might need. Each screen picks what it uses.
  const ctx = {
    colors,
    activeGame,
    setActiveGame,
    ...progress,
    ...bee,
    ...wordSearch,
    ...wordle,
    ...scramble,
  };
  useBadges(ctx);

  // Save state to localStorage whenever it changes
  const {
    points,
    spellingPoints,
    wordSearchPoints,
    wordlePoints,
    scramblePoints,
    unlockedThemes,
    seasonsEarned,
    unlockedVisualThemes,
    currentVisualTheme,
    colorBlindMode,
    spentPoints,
    soundOn,
    counters,
    lastPlayedDate,
    wsMisses,
    badges,
    totalWordsFound,
    gamesCompleted,
    wordleWins,
    wordleStreak,
    puzzle,
    foundWords,
    wordSearchPuzzle,
    wsFoundWords,
    wordleMode,
    dailyPuzzleNumber,
    dailyCompleted,
    dailyStreak,
    dailyMaxStreak,
    dailyWins,
    dailyGamesPlayed,
    lastDailyDate,
    practiceWins,
    practiceGamesPlayed,
    wordleTarget,
    wordleGuesses,
    wordleGameOver,
    wordleWon,
    hintRecord,
  } = ctx;
  // Save state to localStorage whenever it changes
  useEffect(() => {
    const stateToSave = {
      activeGame,
      points,
      spellingPoints,
      wordSearchPoints,
      wordlePoints,
      scramblePoints,
      unlockedThemes,
      seasonsEarned,
      unlockedVisualThemes,
      currentVisualTheme,
      colorBlindMode,
      spentPoints,
      soundOn,
      counters,
      lastPlayedDate,
      wsMisses,
      badges,
      totalWordsFound,
      gamesCompleted,
      wordleWins,
      wordleStreak,
      puzzle,
      foundWords,
      wordSearchPuzzle,
      wsFoundWords,
      wordleMode,
      dailyPuzzleNumber,
      dailyCompleted,
      dailyStreak,
      dailyMaxStreak,
      dailyWins,
      dailyGamesPlayed,
      lastDailyDate,
      practiceWins,
      practiceGamesPlayed,
      wordleTarget,
      wordleGuesses,
      wordleGameOver,
      wordleWon,
      wordleHints: hintRecord,
    };

    saveState(stateToSave);
  }, [
    activeGame,
    points,
    spellingPoints,
    wordSearchPoints,
    wordlePoints,
    scramblePoints,
    unlockedThemes,
    seasonsEarned,
    unlockedVisualThemes,
    currentVisualTheme,
    colorBlindMode,
    spentPoints,
    soundOn,
    counters,
    lastPlayedDate,
    wsMisses,
    badges,
    totalWordsFound,
    gamesCompleted,
    wordleWins,
    wordleStreak,
    puzzle,
    foundWords,
    wordSearchPuzzle,
    wsFoundWords,
    wordleMode,
    dailyPuzzleNumber,
    dailyCompleted,
    dailyStreak,
    dailyMaxStreak,
    dailyWins,
    dailyGamesPlayed,
    lastDailyDate,
    practiceWins,
    practiceGamesPlayed,
    wordleTarget,
    wordleGuesses,
    wordleGameOver,
    wordleWon,
    hintRecord,
  ]);

  return (
    <>
      <style>{`
        @keyframes pointsPop {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -60%) scale(1.2);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -80%) scale(1);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes badgeFlyIn {
          0% {
            opacity: 0;
            transform: translateX(100%) scale(0.5);
          }
          20% {
            opacity: 1;
            transform: translateX(0) scale(1.2);
          }
          80% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateX(-100%) scale(0.8);
          }
        }
      `}</style>

      <div
        className="app-shell"
        style={{
          background: colors.background,
          paddingBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Header {...ctx} />
        <Notifications {...ctx} />

        {/* Main Content Area */}
        <div
          style={{
            flex: 1,
            padding: '16px',
            maxWidth: '600px',
            margin: '0 auto',
            width: '100%',
            boxSizing: 'border-box',
            overflowY: 'auto',
          }}
        >
          {activeGame === 'spelling' && <SpellingBee {...ctx} />}
          {activeGame === 'wordsearch' && <WordSearch {...ctx} />}
          {activeGame === 'wordle' && <Wordle {...ctx} />}
          {activeGame === 'scramble' && <Scramble {...ctx} />}
          {activeGame === 'store' && <Rewards {...ctx} />}
        </div>
      </div>
    </>
  );
}
