import { useEffect } from 'react';
import { PERFECT_ROUND_BONUS } from '../lib/scramble.js';

const card = (colors) => ({
  background: colors.surface,
  borderRadius: '20px',
  padding: '20px 12px',
  boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
});

const tileSize = (length) => (length > 6 ? '44px' : '52px');

export default function Scramble({
  colors,
  scrambleWord,
  scrambleIndex,
  scrambleRoundLength,
  scrambleTiles,
  scramblePlaced,
  scrambleStatus,
  scrambleSolved,
  scrambleRoundPoints,
  scramblePerfect,
  scrambleDone,
  tapScrambleTile,
  untapScrambleTile,
  clearScramble,
  shuffleScramble,
  skipScramble,
  newScrambleRound,
}) {
  const word = scrambleWord.word;

  // Let players type on a physical keyboard: a letter taps a free tile with that letter
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey || scrambleDone) return;
      if (e.key === 'Backspace') {
        e.preventDefault();
        untapScrambleTile();
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
        document.activeElement?.blur?.();
        const tile = scrambleTiles.find(
          (t) => t.letter === e.key.toUpperCase() && !scramblePlaced.includes(t.id),
        );
        if (tile) tapScrambleTile(tile.id);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [scrambleTiles, scramblePlaced, scrambleDone, tapScrambleTile, untapScrambleTile]);

  const heading = (
    <h2
      style={{
        fontSize: '13px',
        fontWeight: '700',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: colors.textLight,
        textAlign: 'center',
        margin: '4px 0 12px',
      }}
    >
      Word Scramble
    </h2>
  );

  if (scrambleDone) {
    return (
      <>
        {heading}
        <div style={{ ...card(colors), maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '22px', fontWeight: '800', color: colors.text }}>
            Round complete!
          </div>
          <p style={{ fontSize: '16px', color: colors.text, margin: '10px 0 4px' }}>
            You unscrambled {scrambleSolved} of {scrambleRoundLength} words.
          </p>
          <p style={{ fontSize: '16px', color: colors.successText, fontWeight: '700', margin: 0 }}>
            +{scrambleRoundPoints} points
          </p>
          {scramblePerfect && scrambleSolved === scrambleRoundLength && (
            <p style={{ fontSize: '14px', color: colors.textLight, margin: '8px 0 0' }}>
              Perfect round! That includes a {PERFECT_ROUND_BONUS} point bonus.
            </p>
          )}
          <button
            onClick={newScrambleRound}
            style={{
              marginTop: '18px',
              minHeight: '52px',
              padding: '0 28px',
              background: colors.primary,
              color: colors.onPrimary,
              border: 'none',
              borderRadius: '999px',
              fontSize: '16px',
              fontWeight: '800',
              cursor: 'pointer',
              touchAction: 'manipulation',
            }}
          >
            Play again
          </button>
        </div>
      </>
    );
  }

  const spelled = scramblePlaced.map((id) => scrambleTiles.find((t) => t.id === id).letter);
  const slotColor =
    scrambleStatus === 'correct'
      ? colors.success
      : scrambleStatus === 'wrong'
        ? colors.error
        : colors.primary;
  const slotText =
    scrambleStatus === 'correct'
      ? colors.onSuccess
      : scrambleStatus === 'wrong'
        ? colors.onError
        : colors.onPrimary;
  const size = tileSize(word.length);

  const secondary = {
    flex: 1,
    minHeight: '48px',
    background: `${colors.primary}14`,
    color: colors.primaryText,
    border: 'none',
    borderRadius: '14px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    touchAction: 'manipulation',
  };

  return (
    <>
      {heading}
      <div style={{ ...card(colors), maxWidth: '500px', margin: '0 auto' }}>
        <div
          style={{
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: '700',
            color: colors.textLight,
          }}
        >
          Word {scrambleIndex + 1} of {scrambleRoundLength}
        </div>

        <div
          role="img"
          aria-label={`Picture clue. The word has ${word.length} letters.`}
          style={{ textAlign: 'center', fontSize: '84px', lineHeight: 1.2, margin: '8px 0' }}
        >
          {scrambleWord.emoji}
        </div>

        {/* Answer slots: tap a filled one to take that letter back */}
        <div
          role="status"
          aria-live="polite"
          aria-label={`Your answer: ${spelled.join(' ') || 'empty'}`}
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '6px',
            margin: '8px 0 20px',
          }}
        >
          {[...word].map((_, i) => {
            const id = scramblePlaced[i];
            const filled = id !== undefined;
            return (
              <button
                key={i}
                onClick={() => filled && untapScrambleTile(id)}
                disabled={!filled}
                aria-label={filled ? `${spelled[i]}, tap to remove` : 'empty'}
                style={{
                  width: size,
                  height: size,
                  background: filled ? slotColor : 'transparent',
                  color: slotText,
                  border: filled ? 'none' : `2px dashed ${colors.textLight}`,
                  borderRadius: '12px',
                  fontSize: '24px',
                  fontWeight: '800',
                  cursor: filled ? 'pointer' : 'default',
                  touchAction: 'manipulation',
                  padding: 0,
                }}
              >
                {filled ? spelled[i] : ''}
              </button>
            );
          })}
        </div>

        {/* Letter tiles */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px' }}>
          {scrambleTiles.map((tile) => {
            const used = scramblePlaced.includes(tile.id);
            return (
              <button
                key={tile.id}
                onClick={() => tapScrambleTile(tile.id)}
                disabled={used}
                aria-label={tile.letter}
                style={{
                  width: size,
                  height: size,
                  background: used ? `${colors.textLight}22` : colors.accent,
                  color: used ? 'transparent' : colors.onAccent,
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '24px',
                  fontWeight: '800',
                  cursor: used ? 'default' : 'pointer',
                  touchAction: 'manipulation',
                  padding: 0,
                }}
              >
                {tile.letter}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '22px' }}>
          <button onClick={clearScramble} style={secondary}>
            Clear
          </button>
          <button onClick={shuffleScramble} style={secondary}>
            Shuffle
          </button>
          <button onClick={skipScramble} style={secondary}>
            Skip
          </button>
        </div>
      </div>
    </>
  );
}
