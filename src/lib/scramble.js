// Word Scramble helpers. `random` can be replaced in tests.

export const ROUND_LENGTH = 5;
// Extra points for finishing a whole round with no wrong tries and no skips
export const PERFECT_ROUND_BONUS = 20;

const shuffle = (list, random) => {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

// The letters of a word as tiles in a mixed-up order that is never the word itself
// (unless every arrangement spells the same thing, like a word of one repeated letter)
export function scrambleTiles(word, random = Math.random) {
  const tiles = [...word].map((letter, id) => ({ id, letter }));
  let mixed = shuffle(tiles, random);
  for (let tries = 0; tries < 20 && mixed.map((t) => t.letter).join('') === word; tries++) {
    mixed = shuffle(tiles, random);
  }
  return mixed;
}

// `count` different words for one round, and the updated list of words played so far.
// Words that have not come up yet are used first. When fewer than `count` are left, they are
// used up and the rest of the round is filled from words played before, and the list starts over.
export function pickRound(words, seen = [], count = ROUND_LENGTH, random = Math.random) {
  const unseen = words.filter(([word]) => !seen.includes(word));
  let chosen;
  let nextSeen;
  if (unseen.length >= count) {
    chosen = shuffle(unseen, random).slice(0, count);
    nextSeen = [...seen, ...chosen.map(([word]) => word)];
  } else {
    const filler = shuffle(
      words.filter(([word]) => seen.includes(word)),
      random,
    ).slice(0, count - unseen.length);
    chosen = [...shuffle(unseen, random), ...filler];
    nextSeen = filler.map(([word]) => word);
  }
  return {
    round: chosen.map(([word, emoji]) => ({ word, emoji })),
    seen: nextSeen,
  };
}
