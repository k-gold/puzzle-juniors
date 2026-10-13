import { useEffect } from 'react';
import { wordleStyle } from '../lib/wordleColors.js';
import HintButton from './HintButton.jsx';
import { HINT_COSTS } from '../data/rewards.js';

export default function Wordle({
  colors,
  wordleMode,
  dailyPuzzleNumber,
  dailyStreak,
  wordleTarget,
  wordleGuesses,
  wordleCurrentGuess,
  wordleGameOver,
  wordleWon,
  wordleError,
  handleWordleKey,
  switchWordleMode,
  shareWordleResults,
  newWordle,
  getLetterStatus,
  getKeyStatus,
  colorBlindMode,
  wordleHintPositions,
  canGiveWordleHint,
  giveWordleHint,
  balance,
}) {
  // Let players type on a physical keyboard
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      let key = null;
      if (/^[a-zA-Z]$/.test(e.key)) key = e.key.toUpperCase();
      else if (e.key === 'Backspace') key = 'BACK';
      else if (e.key === 'Enter' && !e.target.matches?.('button')) key = 'ENTER';
      if (!key) return;
      e.preventDefault();
      // Typing means the player is using the keyboard for the game, not for a tapped button
      if (key !== 'ENTER') document.activeElement?.blur?.();
      handleWordleKey(key);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleWordleKey]);

  return (
    <>
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
        Guess the Word
      </h2>

      {/* Daily / Practice switch */}
      <div
        style={{
          maxWidth: '500px',
          margin: '0 auto 14px',
          display: 'flex',
          gap: '4px',
          padding: '4px',
          background: `${colors.textLight}22`,
          borderRadius: '16px',
        }}
      >
        {[
          { id: 'daily', label: 'Daily' },
          { id: 'practice', label: 'Practice' },
        ].map((mode) => {
          const active = wordleMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => switchWordleMode(mode.id)}
              aria-pressed={active}
              style={{
                flex: 1,
                padding: '10px 12px',
                minHeight: '48px',
                background: active ? colors.surface : 'transparent',
                color: active ? colors.primaryText : colors.textLight,
                border: 'none',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: active ? '0 1px 3px rgba(0,0,0,0.12)' : 'none',
                transition: 'all 0.2s',
                touchAction: 'manipulation',
              }}
            >
              <div>{mode.label}</div>
              {mode.id === 'daily' && wordleMode === 'daily' && dailyStreak > 0 && (
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    marginTop: '2px',
                  }}
                >
                  Streak: {dailyStreak}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div
        style={{
          maxWidth: '500px',
          width: '100%',
          margin: '0 auto',
          paddingBottom: '230px', // Space for the sticky keyboard
        }}
      >
        <div
          style={{
            background: colors.surface,
            borderRadius: '20px',
            padding: '20px 12px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
          }}
        >
          {/* Error Message */}
          {wordleError && (
            <div
              role="alert"
              style={{
                textAlign: 'center',
                color: colors.errorText,
                fontWeight: '600',
                fontSize: '14px',
                marginBottom: '12px',
              }}
            >
              {wordleError}
            </div>
          )}

          {/* Guesses Grid */}
          <div style={{ marginBottom: '12px' }}>
            {Array.from({ length: 6 }).map((_, guessIdx) => {
              const guess = wordleGuesses[guessIdx];
              const isCurrent = guessIdx === wordleGuesses.length && !wordleGameOver;
              const display = guess || (isCurrent ? wordleCurrentGuess : '');

              return (
                <div
                  key={guessIdx}
                  style={{
                    display: 'flex',
                    gap: '6px',
                    marginBottom: '6px',
                    justifyContent: 'center',
                  }}
                >
                  {Array.from({ length: 4 }).map((_, letterIdx) => {
                    const typed = display[letterIdx] || '';
                    // A hint shows its letter, faded, in an empty tile of the row being typed
                    const hinted = isCurrent && !typed && wordleHintPositions.includes(letterIdx);
                    const letter = typed || (hinted ? wordleTarget[letterIdx] : '');
                    const status = guess ? getLetterStatus(letterIdx, guess) : null;
                    const tone = status ? wordleStyle(colors, status, colorBlindMode) : null;

                    return (
                      <div
                        key={letterIdx}
                        aria-label={
                          hinted
                            ? `Hint: letter ${letterIdx + 1} is ${letter}`
                            : letter
                              ? `${letter}${status ? `, ${status === 'absent' ? 'not in the word' : status === 'present' ? 'in the word, wrong spot' : 'correct'}` : ''}`
                              : 'empty'
                        }
                        style={{
                          width: 'min(58px, 15vw)',
                          aspectRatio: '1',
                          boxSizing: 'border-box',
                          background: tone ? tone.background : colors.background,
                          border: hinted
                            ? `2px dashed ${colors.primary}`
                            : `2px solid ${guess ? 'transparent' : `${colors.textLight}55`}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 'clamp(22px, 7vw, 30px)',
                          fontWeight: '800',
                          color: tone ? tone.color : hinted ? colors.primaryText : colors.text,
                          borderRadius: '12px',
                          transition: 'all 0.2s',
                        }}
                      >
                        {letter}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {!wordleGameOver && (
            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
              <HintButton
                colors={colors}
                cost={HINT_COSTS.wordle}
                balance={balance}
                disabled={!canGiveWordleHint}
                onClick={giveWordleHint}
              />
            </div>
          )}

          {/* Game Over Messages */}
          {wordleGameOver && wordleWon && wordleMode === 'daily' && (
            <div
              style={{
                background: colors.success,
                color: colors.onSuccess,
                padding: '16px',
                borderRadius: '16px',
                textAlign: 'center',
                marginBottom: '16px',
                fontWeight: '700',
                fontSize: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              <div style={{ marginBottom: '12px' }}>
                Great job! Puzzle #{dailyPuzzleNumber} complete!
              </div>
              <div
                style={{
                  fontSize: '14px',
                  marginBottom: '12px',
                  fontWeight: '500',
                }}
              >
                Come back tomorrow for #{dailyPuzzleNumber + 1}
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <button
                  onClick={shareWordleResults}
                  style={{
                    background: 'white',
                    color: colors.successText,
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    transition: 'transform 0.15s',
                  }}
                  onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
                  onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  onTouchStart={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
                  onTouchEnd={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  Share
                </button>
                <button
                  onClick={() => switchWordleMode('practice')}
                  style={{
                    background: 'white',
                    color: colors.successText,
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    transition: 'transform 0.15s',
                  }}
                  onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
                  onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  onTouchStart={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
                  onTouchEnd={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  Continue Practicing
                </button>
              </div>
            </div>
          )}

          {wordleGameOver && wordleWon && wordleMode === 'practice' && (
            <div
              style={{
                background: colors.success,
                color: colors.onSuccess,
                padding: '16px',
                borderRadius: '16px',
                textAlign: 'center',
                marginBottom: '16px',
                fontWeight: '700',
                fontSize: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              <div style={{ marginBottom: '12px' }}>You got it!</div>
              <button
                onClick={newWordle}
                style={{
                  background: 'white',
                  color: colors.successText,
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                  transition: 'transform 0.15s',
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
                onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                onTouchStart={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
                onTouchEnd={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                Play Again
              </button>
            </div>
          )}

          {wordleGameOver && !wordleWon && (
            <div
              style={{
                background: colors.error,
                color: colors.onError,
                padding: '16px',
                borderRadius: '16px',
                textAlign: 'center',
                marginBottom: '16px',
                fontWeight: '700',
                fontSize: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              <div
                style={{
                  marginBottom: wordleMode === 'practice' ? '12px' : '0',
                }}
              >
                The word was: {wordleTarget}
              </div>
              {wordleMode === 'practice' && (
                <button
                  onClick={newWordle}
                  style={{
                    background: 'white',
                    color: colors.errorText,
                    border: 'none',
                    padding: '10px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    transition: 'transform 0.15s',
                  }}
                  onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
                  onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  onTouchStart={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
                  onTouchEnd={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  Try Again
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Keyboard */}
      {!wordleGameOver && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: colors.surface,
            padding: '6px 3px calc(8px + env(safe-area-inset-bottom))',
            boxShadow: '0 -2px 12px rgba(0,0,0,0.08)',
            zIndex: 150,
          }}
        >
          <div
            style={{
              maxWidth: '500px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {[
              ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
              ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
              ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK'],
            ].map((row, rowIdx) => (
              <div
                key={rowIdx}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                {row.map((key) => {
                  const isLetter = key !== 'ENTER' && key !== 'BACK';
                  const status = isLetter ? getKeyStatus(key) : 'unused';
                  const tone = wordleStyle(colors, status, colorBlindMode);

                  return (
                    <button
                      key={key}
                      aria-label={
                        key === 'BACK'
                          ? 'Delete'
                          : key === 'ENTER'
                            ? 'Enter'
                            : status === 'unused'
                              ? key
                              : `${key}, ${status === 'absent' ? 'not in the word' : status === 'present' ? 'in the word' : 'correct'}`
                      }
                      onClick={() => handleWordleKey(key)}
                      // The button is the tap target and fills its whole cell, including the
                      // small gaps between keys. The colored key is drawn inside it.
                      style={{
                        background: 'transparent',
                        border: 'none',
                        height: '54px',
                        padding: '3px 2.5px',
                        cursor: 'pointer',
                        minWidth: 0,
                        flex: key.length > 1 ? '1.5' : '1',
                        maxWidth: key.length > 1 ? '68px' : '46px',
                        touchAction: 'manipulation',
                      }}
                      onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
                      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      onTouchStart={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
                      onTouchEnd={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '100%',
                          height: '100%',
                          background: tone.background,
                          color: tone.color,
                          borderRadius: '8px',
                          fontSize: key.length > 1 ? '12px' : '17px',
                          fontWeight: '800',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                          transition: 'background 0.15s',
                        }}
                      >
                        {key === 'BACK' ? '⌫' : key}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
