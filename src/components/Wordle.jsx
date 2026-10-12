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
  getWordleLetterColor,
  getKeyboardKeyColor,
}) {
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
                color: active ? colors.primary : colors.textLight,
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
                <div style={{ fontSize: '12px', fontWeight: '700', marginTop: '2px' }}>
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
              style={{
                textAlign: 'center',
                color: colors.error,
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
                    const letter = display[letterIdx] || '';
                    const bgColor = guess
                      ? getWordleLetterColor(letter, letterIdx, guess)
                      : colors.background;

                    return (
                      <div
                        key={letterIdx}
                        style={{
                          width: 'min(58px, 15vw)',
                          aspectRatio: '1',
                          boxSizing: 'border-box',
                          background: bgColor,
                          border: `2px solid ${guess ? 'transparent' : `${colors.textLight}55`}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 'clamp(22px, 7vw, 30px)',
                          fontWeight: '800',
                          color: guess ? 'white' : colors.text,
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

          {/* Game Over Messages */}
          {wordleGameOver && wordleWon && wordleMode === 'daily' && (
            <div
              style={{
                background: colors.success,
                color: 'white',
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
              <div style={{ fontSize: '14px', marginBottom: '12px', fontWeight: '500' }}>
                Come back tomorrow for #{dailyPuzzleNumber + 1}
              </div>
              <div
                style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}
              >
                <button
                  onClick={shareWordleResults}
                  style={{
                    background: 'white',
                    color: colors.success,
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
                    color: colors.success,
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
                color: 'white',
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
                  color: colors.success,
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
                color: 'white',
                padding: '16px',
                borderRadius: '16px',
                textAlign: 'center',
                marginBottom: '16px',
                fontWeight: '700',
                fontSize: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              <div style={{ marginBottom: wordleMode === 'practice' ? '12px' : '0' }}>
                The word was: {wordleTarget}
              </div>
              {wordleMode === 'practice' && (
                <button
                  onClick={newWordle}
                  style={{
                    background: 'white',
                    color: colors.error,
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
            padding: '10px 6px calc(10px + env(safe-area-inset-bottom))',
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
              gap: '6px',
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
                  gap: '5px',
                  justifyContent: 'center',
                }}
              >
                {row.map((key) => {
                  // Get dynamic background color for letter keys
                  const bgColor =
                    key !== 'ENTER' && key !== 'BACK' ? getKeyboardKeyColor(key) : colors.primary;

                  // Determine if key should be slightly faded (wrong letter)
                  const isWrongLetter = bgColor === colors.textLight;

                  return (
                    <button
                      key={key}
                      onClick={() => handleWordleKey(key)}
                      style={{
                        background: bgColor,
                        color: 'white',
                        border: 'none',
                        height: '48px',
                        padding: 0,
                        borderRadius: '8px',
                        fontSize: key.length > 1 ? '12px' : '17px',
                        cursor: 'pointer',
                        fontWeight: '800',
                        minWidth: 0,
                        flex: key.length > 1 ? '1.5' : '1',
                        maxWidth: key.length > 1 ? '64px' : '42px',
                        transition: 'all 0.15s',
                        boxShadow: isWrongLetter
                          ? '0 2px 4px rgba(0,0,0,0.1)'
                          : '0 2px 6px rgba(0,0,0,0.15)',
                        touchAction: 'manipulation',
                        opacity: isWrongLetter ? 0.5 : 1,
                      }}
                      onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
                      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      onTouchStart={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
                      onTouchEnd={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      {key === 'BACK' ? '⌫' : key}
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
