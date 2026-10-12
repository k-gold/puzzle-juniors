import { useEffect } from 'react';
import ShuffleIcon from './ShuffleIcon.jsx';
import HexButton from './HexButton.jsx';

const sectionLabel = (colors) => ({
  fontSize: '13px',
  fontWeight: '700',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: colors.textLight,
  textAlign: 'center',
  margin: '4px 0 0',
});

export default function SpellingBee({
  colors,
  puzzle,
  currentWord,
  setCurrentWord,
  foundWords,
  message,
  isValidating,
  handleSubmit,
  shuffleLetters,
  handleLetterClick,
  outerLetters,
}) {
  const canSubmit = !isValidating && currentWord.length >= 3;
  const messageIsGood = message.includes('Great') || message.includes('Checking');

  // Let players type on a physical keyboard
  const letters = [puzzle.center, ...outerLetters].map((l) => l.toLowerCase());
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      // Typing means the player is using the keyboard for the game, not for a tapped button
      if (e.key === 'Backspace' || (e.key.length === 1 && letters.includes(e.key.toLowerCase()))) {
        document.activeElement?.blur?.();
      }
      if (e.key === 'Backspace') {
        e.preventDefault();
        setCurrentWord(currentWord.slice(0, -1));
      } else if (e.key === 'Enter') {
        // Enter on a focused button activates that button instead
        if (e.target.matches?.('button') || !canSubmit) return;
        e.preventDefault();
        handleSubmit();
      } else if (e.key.length === 1 && letters.includes(e.key.toLowerCase())) {
        e.preventDefault();
        handleLetterClick(e.key);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  // Honeycomb: two tiles on top, three in the middle (center letter in the middle), two below
  const tile = (letter, isCenter = false) => ({ letter, isCenter });
  const rows = [
    [tile(outerLetters[0]), tile(outerLetters[1])],
    [tile(outerLetters[2]), tile(puzzle.center, true), tile(outerLetters[3])],
    [tile(outerLetters[4]), tile(outerLetters[5])],
  ];

  const controlButton = {
    height: '56px',
    borderRadius: '16px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    touchAction: 'manipulation',
    transition: 'transform 0.12s ease',
  };
  const press = {
    onMouseDown: (e) => (e.currentTarget.style.transform = 'scale(0.97)'),
    onMouseUp: (e) => (e.currentTarget.style.transform = 'scale(1)'),
    onMouseLeave: (e) => (e.currentTarget.style.transform = 'scale(1)'),
  };

  return (
    <>
      <h2 style={sectionLabel(colors)}>Letter Puzzle</h2>

      <div
        style={{
          // Tile width scales with the screen; the gap between tiles stays fixed
          '--hex': 'clamp(64px, 24vw, 96px)',
          '--gap': '6px',
          maxWidth: '420px',
          width: '100%',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '8px',
        }}
      >
        {/* Message area keeps its height so the board does not jump */}
        <p
          style={{
            margin: '0 0 4px',
            minHeight: '22px',
            color: messageIsGood ? colors.successText : colors.errorText,
            fontWeight: '700',
            fontSize: '15px',
          }}
          aria-live="polite"
        >
          {message}
        </p>

        {/* Current word */}
        <div
          style={{
            fontSize: currentWord ? '36px' : '15px',
            textAlign: 'center',
            fontWeight: '800',
            color: currentWord ? colors.text : colors.textLight,
            letterSpacing: currentWord ? '0.08em' : '0',
            minHeight: '56px',
            display: 'flex',
            alignItems: 'center',
            marginBottom: '20px',
            textTransform: 'uppercase',
          }}
        >
          {currentWord || 'Tap or type letters to spell a word'}
        </div>

        {/* Honeycomb tiles */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '28px',
          }}
        >
          {rows.map((row, rowIdx) => (
            <div
              key={rowIdx}
              style={{
                display: 'flex',
                gap: 'var(--gap)',
                // Rows tuck into each other to form the honeycomb
                marginTop: rowIdx === 0 ? 0 : 'calc(var(--hex) * -0.2887 + var(--gap) * 0.866)',
              }}
            >
              {row.map(({ letter, isCenter }, i) => (
                <HexButton
                  key={i}
                  colors={colors}
                  letter={letter}
                  isCenter={isCenter}
                  onClick={() => handleLetterClick(letter)}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Controls */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '24px',
            width: '100%',
            maxWidth: '360px',
          }}
        >
          <button
            onClick={() => setCurrentWord(currentWord.slice(0, -1))}
            style={{
              ...controlButton,
              flex: 1,
              background: colors.surface,
              color: colors.text,
              border: `2px solid ${colors.textLight}55`,
            }}
            {...press}
          >
            Delete
          </button>
          <button
            onClick={shuffleLetters}
            aria-label="Shuffle letters"
            style={{
              ...controlButton,
              width: '56px',
              flex: 'none',
              background: colors.surface,
              color: colors.primaryText,
              border: `2px solid ${colors.primary}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            {...press}
          >
            <ShuffleIcon size={22} />
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{
              ...controlButton,
              flex: 1.2,
              background: canSubmit ? colors.primary : `${colors.textLight}22`,
              color: canSubmit ? colors.onPrimary : colors.textLight,
              border: 'none',
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              boxShadow: canSubmit ? `0 4px 0 ${colors.primary}66` : 'none',
            }}
            {...press}
          >
            {isValidating ? 'Checking...' : 'Enter'}
          </button>
        </div>

        {/* Found words */}
        {foundWords.length > 0 && (
          <div
            style={{
              width: '100%',
              background: colors.surface,
              borderRadius: '20px',
              padding: '18px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
              marginBottom: '16px',
            }}
          >
            <h3
              style={{
                fontSize: '15px',
                fontWeight: '800',
                color: colors.text,
                margin: '0 0 12px',
              }}
            >
              Words ({foundWords.length})
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {foundWords.map((word) => (
                <span
                  key={word}
                  style={{
                    padding: '7px 14px',
                    background: `${colors.primary}12`,
                    color: colors.text,
                    borderRadius: '999px',
                    fontSize: '14px',
                    fontWeight: '700',
                  }}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
