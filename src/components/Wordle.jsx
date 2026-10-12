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
      {/* Game Header */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '8px',
        }}
      >
        <h2
          style={{
            fontSize: '16px',
            fontWeight: '600',
            color: colors.textLight,
            margin: 0,
            padding: '4px 0',
          }}
        >
          Guess the Word
        </h2>
      </div>

      {/* Mode Toggle and Info */}
      <div
        style={{
          background: colors.surface,
          padding: '20px',
          borderRadius: '16px',
          marginBottom: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        {/* Mode Toggle */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <button
            onClick={() => switchWordleMode('daily')}
            style={{
              flex: 1,
              padding: '12px',
              background: wordleMode === 'daily' ? colors.primary : colors.background,
              color: wordleMode === 'daily' ? 'white' : colors.text,
              border: `2px solid ${colors.primary}`,
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <div>Daily</div>
            {wordleMode === 'daily' && dailyStreak > 0 && (
              <div style={{ fontSize: '12px', marginTop: '4px' }}>Streak: {dailyStreak}</div>
            )}
          </button>

          <button
            onClick={() => switchWordleMode('practice')}
            style={{
              flex: 1,
              padding: '12px',
              background: wordleMode === 'practice' ? colors.primary : colors.background,
              color: wordleMode === 'practice' ? 'white' : colors.text,
              border: `2px solid ${colors.primary}`,
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Practice
          </button>
        </div>
      </div>

      <div
        style={{
          maxWidth: '500px',
          width: '100%',
          margin: '0 auto',
          paddingBottom: '240px', // Space for sticky keyboard (220px) + some buffer
        }}
      >
        <div
          style={{
            background: colors.surface,
            borderRadius: '16px',
            padding: '24px 16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
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
                    gap: '5px',
                    marginBottom: '5px',
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
                          width: '42px',
                          height: '42px',
                          background: bgColor,
                          border: `2px solid ${guess ? 'transparent' : colors.textLight}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                          fontWeight: '700',
                          color: guess ? 'white' : colors.text,
                          borderRadius: '8px',
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
                borderRadius: '12px',
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
                borderRadius: '12px',
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
                borderRadius: '12px',
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
            padding: '8px',
            boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
            zIndex: 150,
          }}
        >
          <div
            style={{
              maxWidth: '500px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
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
                  gap: '3px',
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
                        padding: key.length > 1 ? '10px 6px' : '10px 0',
                        borderRadius: '5px',
                        fontSize: key.length > 1 ? '10px' : '14px',
                        cursor: 'pointer',
                        fontWeight: '700',
                        minWidth: key.length > 1 ? '48px' : '28px',
                        flex: key.length > 1 ? '1.5' : '1',
                        maxWidth: key.length > 1 ? '60px' : '38px',
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
