import { useState, useEffect, useRef } from 'react';
import { WORD_SEARCH_THEMES } from '../data/rewards.js';

export function useProgress(savedState) {
  // Points system
  const [points, setPoints] = useState(savedState?.points || 0);
  const [spellingPoints, setSpellingPoints] = useState(savedState?.spellingPoints || 0);
  const [wordSearchPoints, setWordSearchPoints] = useState(savedState?.wordSearchPoints || 0);
  const [wordlePoints, setWordlePoints] = useState(savedState?.wordlePoints || 0);
  const [showPointsAnimation, setShowPointsAnimation] = useState(false);
  const [animatedPoints, setAnimatedPoints] = useState(0);

  // Unlockables state
  // Word Search themes unlock by themselves as points are earned (nothing is spent)
  const unlockedThemes = WORD_SEARCH_THEMES.filter((t) => points >= t.points).map((t) => t.id);
  const [unlockedVisualThemes, setUnlockedVisualThemes] = useState(
    savedState?.unlockedVisualThemes || ['classic'],
  ); // Starting visual theme
  const [currentVisualTheme, setCurrentVisualTheme] = useState(
    savedState?.currentVisualTheme || 'classic',
  );
  const [badges, setBadges] = useState(savedState?.badges || ['first-word', 'getting-started']); // Starting badges
  const [totalWordsFound, setTotalWordsFound] = useState(savedState?.totalWordsFound || 0);
  const [gamesCompleted, setGamesCompleted] = useState(
    savedState?.gamesCompleted || { spelling: 0, wordsearch: 0, wordle: 0 },
  );
  const [wordleWins, setWordleWins] = useState(savedState?.wordleWins || 0);
  const [wordleStreak, setWordleStreak] = useState(savedState?.wordleStreak || 0);

  // Accessibility: Wordle uses blue and orange instead of green and yellow
  const [colorBlindMode, setColorBlindMode] = useState(savedState?.colorBlindMode === true);

  // Things counted as they happen, used by badges. New counters can be added here.
  const [counters, setCounters] = useState({
    pangrams: 0,
    greatBees: 0,
    fullHives: 0,
    searchesFinished: 0,
    cleanSearches: 0,
    fastWins: 0,
    eWins: 0,
    daysPlayed: 0,
    ...savedState?.counters,
  });
  const [lastPlayedDate, setLastPlayedDate] = useState(savedState?.lastPlayedDate || '');
  const addCount = (name, amount = 1) =>
    setCounters((prev) => ({ ...prev, [name]: prev[name] + amount }));

  // Popups (badges earned, themes unlocked). They are shown one at a time, three seconds each.
  const [toasts, setToasts] = useState([]);
  const nextToastId = useRef(0);
  const notify = (toast) => setToasts((prev) => [...prev, { ...toast, id: nextToastId.current++ }]);
  const currentToastId = toasts[0]?.id;
  useEffect(() => {
    if (currentToastId === undefined) return;
    const timer = setTimeout(() => setToasts((prev) => prev.slice(1)), 3000);
    return () => clearTimeout(timer);
  }, [currentToastId]);

  // Tell the player when a Word Search theme unlocks
  const knownThemes = useRef(unlockedThemes.length);
  useEffect(() => {
    WORD_SEARCH_THEMES.filter((t) => unlockedThemes.includes(t.id))
      .slice(knownThemes.current)
      .forEach((t) =>
        notify({ icon: t.icon, title: 'Theme Unlocked!', name: `${t.name} Word Search` }),
      );
    knownThemes.current = unlockedThemes.length;
  }, [unlockedThemes.length]);

  const [badgeTooltip, setBadgeTooltip] = useState(null);

  // Award points with animation
  const awardPoints = (amount, gameType = null) => {
    const newPoints = points + amount;
    setPoints(newPoints);
    setAnimatedPoints(amount);
    setShowPointsAnimation(true);
    setTimeout(() => setShowPointsAnimation(false), 1500);

    // Track per-game points
    if (gameType === 'spelling') {
      setSpellingPoints((prev) => prev + amount);
    } else if (gameType === 'wordsearch') {
      setWordSearchPoints((prev) => prev + amount);
    } else if (gameType === 'wordle') {
      setWordlePoints((prev) => prev + amount);
    }

    // Count each day the player earns points on
    const today = new Date().toDateString();
    if (lastPlayedDate !== today) {
      setLastPlayedDate(today);
      addCount('daysPlayed');
    }
  };

  // Calculate points based on word length
  const calculatePoints = (wordLength) => {
    if (wordLength <= 4) return 10;
    if (wordLength <= 6) return 20;
    return 30;
  };

  return {
    points,
    setPoints,
    spellingPoints,
    setSpellingPoints,
    wordSearchPoints,
    setWordSearchPoints,
    wordlePoints,
    setWordlePoints,
    showPointsAnimation,
    setShowPointsAnimation,
    animatedPoints,
    setAnimatedPoints,
    unlockedThemes,
    unlockedVisualThemes,
    setUnlockedVisualThemes,
    currentVisualTheme,
    colorBlindMode,
    setColorBlindMode,
    setCurrentVisualTheme,
    badges,
    setBadges,
    totalWordsFound,
    setTotalWordsFound,
    gamesCompleted,
    setGamesCompleted,
    wordleWins,
    setWordleWins,
    wordleStreak,
    setWordleStreak,
    counters,
    addCount,
    lastPlayedDate,
    toasts,
    notify,
    badgeTooltip,
    setBadgeTooltip,
    awardPoints,
    calculatePoints,
  };
}
