// Ranks for the Letter Puzzle. A rank is earned by finding a share of the puzzle's answers.
export const RANKS = [
  { name: 'Beginner', share: 0 },
  { name: 'Good', share: 0.3 },
  { name: 'Great', share: 0.6 },
];

// A pangram uses every one of the puzzle's seven letters
export const isPangram = (word, letters) => letters.every((l) => word.includes(l));

// Words needed to reach a rank, for a puzzle with `total` answers
const wordsNeeded = (rank, total) => Math.ceil(rank.share * total);

// Where the player stands: current rank, and the next one (null at the top) with its target
export function rankProgress(found, total) {
  let index = 0;
  RANKS.forEach((rank, i) => {
    if (found >= wordsNeeded(rank, total)) index = i;
  });
  const next = RANKS[index + 1] || null;
  return {
    found,
    total,
    rank: RANKS[index].name,
    next: next && { name: next.name, at: wordsNeeded(next, total) },
  };
}

// Messages that should be shown as good news
export const isPositiveMessage = (message) => /^(Great|Nice|Pangram|Checking)/.test(message);
