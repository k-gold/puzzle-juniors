import { useState } from 'react';
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

  // Badge notification
  const [showBadgeNotification, setShowBadgeNotification] = useState(false);
  const [newBadge, setNewBadge] = useState(null);
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

    // Check point milestone badges
    if (newPoints >= 250 && !badges.includes('rising-star')) {
      setTimeout(() => awardBadge('rising-star', 'Rising Star', '🌟'), 1600);
    }
    if (newPoints >= 500 && !badges.includes('point-collector')) {
      setTimeout(() => awardBadge('point-collector', 'Point Collector', '💰'), 1600);
    }
    if (newPoints >= 750 && !badges.includes('point-master')) {
      setTimeout(() => awardBadge('point-master', 'Point Master', '💎'), 1600);
    }
  };

  // Award badge with flyover notification
  const awardBadge = (badgeId, badgeName, badgeIcon) => {
    if (!badges.includes(badgeId)) {
      setBadges((prev) => [...prev, badgeId]);
      setNewBadge({ id: badgeId, name: badgeName, icon: badgeIcon });
      setShowBadgeNotification(true);
      setTimeout(() => setShowBadgeNotification(false), 3000);
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
    showBadgeNotification,
    setShowBadgeNotification,
    newBadge,
    setNewBadge,
    badgeTooltip,
    setBadgeTooltip,
    awardPoints,
    awardBadge,
    calculatePoints,
  };
}
