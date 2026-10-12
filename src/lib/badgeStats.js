import { BADGES } from '../data/rewards.js';

// The numbers that badges are measured against. Every badge in src/data/rewards.js names one
// of these stats and a target to reach.
export function buildStats({
  points,
  totalWordsFound,
  gamesCompleted,
  wordleWins,
  wordleStreak,
  dailyStreak,
  counters,
  foundWords,
  unlockedThemes,
  unlockedVisualThemes,
}) {
  return {
    always: 1,
    points,
    totalWords: totalWordsFound,
    wordleWins,
    wordleStreak,
    dailyStreak,
    beeGames: gamesCompleted.spelling || 0,
    searchGames: gamesCompleted.wordsearch || 0,
    allGames: Math.min(
      gamesCompleted.spelling || 0,
      gamesCompleted.wordsearch || 0,
      gamesCompleted.wordle || 0,
    ),
    beeWordsNow: foundWords.length,
    wordSearchThemes: unlockedThemes.length,
    colorThemes: unlockedVisualThemes.length,
    // Counted as they happen: see COUNTERS in useProgress
    pangrams: counters.pangrams,
    greatBees: counters.greatBees,
    fullHives: counters.fullHives,
    searchesFinished: counters.searchesFinished,
    cleanSearches: counters.cleanSearches,
    fastWins: counters.fastWins,
    eWins: counters.eWins,
    daysPlayed: counters.daysPlayed,
  };
}

// The badges whose targets are reached but that the player does not have yet
export const newlyEarned = (stats, owned) =>
  BADGES.filter((b) => !owned.includes(b.id) && stats[b.stat] >= b.target);
