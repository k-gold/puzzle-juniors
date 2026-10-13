import { useState, useEffect } from 'react';
import { SCRAMBLE_WORDS } from '../data/scrambleWords.js';
import { pickRound, scrambleTiles, PERFECT_ROUND_BONUS } from '../lib/scramble.js';
import { play } from '../lib/sound.js';

// Word Scramble: five words a round. Tap letter tiles to spell the word shown by the picture.
export function useScramble(savedState, progress) {
  const { setTotalWordsFound, setGamesCompleted, awardPoints, addCount, calculatePoints } =
    progress;

  const [first] = useState(() => pickRound(SCRAMBLE_WORDS, savedState?.scrambleSeen));
  const [round, setRound] = useState(first.round);
  const [seen, setSeen] = useState(first.seen); // words played since the list last started over
  const [index, setIndex] = useState(0);
  const [tiles, setTiles] = useState(() => scrambleTiles(round[0].word));
  const [placed, setPlaced] = useState([]); // tile ids, in the order they were tapped
  const [status, setStatus] = useState('playing'); // 'playing' | 'correct' | 'wrong'
  const [mistakes, setMistakes] = useState(0); // wrong tries and skips this round
  const [solved, setSolved] = useState(0);
  const [roundPoints, setRoundPoints] = useState(0);
  const [roundDone, setRoundDone] = useState(false);

  const current = round[index];

  const startWord = (nextIndex, nextRound = round) => {
    setIndex(nextIndex);
    setTiles(scrambleTiles(nextRound[nextIndex].word));
    setPlaced([]);
    setStatus('playing');
  };

  // After a right or wrong answer, move on (or let the tiles go back) after a short pause
  useEffect(() => {
    if (status === 'playing') return;
    const timer = setTimeout(
      () => {
        if (status === 'wrong') {
          setPlaced([]);
          setStatus('playing');
        } else if (index + 1 < round.length) {
          startWord(index + 1);
        } else {
          setRoundDone(true);
        }
      },
      status === 'correct' ? 1100 : 800,
    );
    return () => clearTimeout(timer);
  }, [status]);

  const tapTile = (id) => {
    if (status !== 'playing' || roundDone || placed.includes(id)) return;
    const next = [...placed, id];
    setPlaced(next);
    if (next.length < current.word.length) return;

    const spelled = next.map((tileId) => tiles.find((t) => t.id === tileId).letter).join('');
    if (spelled === current.word) {
      // The last word of a perfect round also earns the round bonus, in one award
      const perfect = index + 1 === round.length && mistakes === 0;
      const earned = calculatePoints(current.word.length) + (perfect ? PERFECT_ROUND_BONUS : 0);
      awardPoints(earned, 'scramble');
      setRoundPoints((prev) => prev + earned);
      setSolved((prev) => prev + 1);
      setTotalWordsFound((prev) => prev + 1);
      addCount('scrambleWords');
      if (perfect) addCount('perfectRounds');
      setStatus('correct');
    } else {
      play('buzz');
      setMistakes((prev) => prev + 1);
      setStatus('wrong');
    }
  };

  // Take the last tile back, or a particular one
  const untap = (id) => {
    if (status !== 'playing') return;
    setPlaced((prev) => (id === undefined ? prev.slice(0, -1) : prev.filter((p) => p !== id)));
  };

  const clearTiles = () => status === 'playing' && setPlaced([]);

  const shuffleTiles = () => {
    if (status !== 'playing') return;
    setTiles(scrambleTiles(current.word));
    setPlaced([]);
  };

  // Skipping a word is allowed, but it ends any chance of a perfect round
  const skipWord = () => {
    if (status !== 'playing') return;
    setMistakes((prev) => prev + 1);
    if (index + 1 < round.length) startWord(index + 1);
    else setRoundDone(true);
  };

  const newRound = () => {
    const picked = pickRound(SCRAMBLE_WORDS, seen);
    const next = picked.round;
    setRound(next);
    setSeen(picked.seen);
    setMistakes(0);
    setSolved(0);
    setRoundPoints(0);
    setRoundDone(false);
    startWord(0, next);
    setGamesCompleted((prev) => ({ ...prev, scramble: (prev.scramble || 0) + 1 }));
  };

  return {
    scrambleSeen: seen,
    scrambleWord: current,
    scrambleIndex: index,
    scrambleRoundLength: round.length,
    scrambleTiles: tiles,
    scramblePlaced: placed,
    scrambleStatus: status,
    scrambleSolved: solved,
    scrambleRoundPoints: roundPoints,
    scramblePerfect: mistakes === 0,
    scrambleDone: roundDone,
    tapScrambleTile: tapTile,
    untapScrambleTile: untap,
    clearScramble: clearTiles,
    shuffleScramble: shuffleTiles,
    skipScramble: skipWord,
    newScrambleRound: newRound,
  };
}
