export default function Header({
  colors,
  activeGame,
  setActiveGame,
  points,
  newGame,
  newWordSearch,
  wordleMode,
  switchWordleMode,
  newWordle,
}) {
  return (
    <>
      {/* Header with Points and Game Mode Navigation */}
      <div
        style={{
          background: colors.surface,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Top Row: Title, New Game Button, and Points */}
        <div
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <h1
            style={{
              fontSize: '20px',
              fontWeight: '700',
              color: colors.text,
              margin: 0,
            }}
          >
            Puzzle Juniors
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Dynamic New Game Button */}
            {activeGame !== 'store' && (
              <button
                onClick={() => {
                  if (activeGame === 'spelling') {
                    newGame();
                  } else if (activeGame === 'wordsearch') {
                    newWordSearch();
                  } else if (activeGame === 'wordle') {
                    // Always go to practice mode for new game
                    if (wordleMode !== 'practice') {
                      switchWordleMode('practice');
                    }
                    newWordle();
                  }
                }}
                style={{
                  padding: '8px 16px',
                  background: colors.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                New Game
              </button>
            )}

            {/* Points Display */}
            <div
              onClick={() => setActiveGame('store')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: `linear-gradient(135deg, ${colors.accent}20, ${colors.accent}10)`,
                padding: '8px 16px',
                borderRadius: '20px',
                border: `2px solid ${colors.accent}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <span
                style={{
                  fontSize: '20px',
                }}
              >
                ⭐
              </span>
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: colors.accent,
                }}
              >
                {points}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Row: Game Mode Icon Buttons */}
        <div
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            display: 'flex',
            borderTop: `1px solid ${colors.background}`,
            padding: '8px 0',
          }}
        >
          {/* Spelling Bee Button */}
          <button
            onClick={() => setActiveGame('spelling')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              borderBottom:
                activeGame === 'spelling' ? `3px solid ${colors.primary}` : '3px solid transparent',
            }}
          >
            <img
              src="/icons/spelling-bee.png"
              alt="Spelling Bee"
              style={{
                width: '32px',
                height: '32px',
                objectFit: 'contain',
                filter: activeGame === 'spelling' ? 'none' : 'grayscale(100%) opacity(40%)',
              }}
            />
          </button>

          {/* Word Search Button */}
          <button
            onClick={() => setActiveGame('wordsearch')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              borderBottom:
                activeGame === 'wordsearch'
                  ? `3px solid ${colors.primary}`
                  : '3px solid transparent',
            }}
          >
            <img
              src="/icons/word-search.png"
              alt="Word Search"
              style={{
                width: '32px',
                height: '32px',
                objectFit: 'contain',
                filter: activeGame === 'wordsearch' ? 'none' : 'grayscale(100%) opacity(40%)',
              }}
            />
          </button>

          {/* Wordle Button */}
          <button
            onClick={() => setActiveGame('wordle')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              borderBottom:
                activeGame === 'wordle' ? `3px solid ${colors.primary}` : '3px solid transparent',
            }}
          >
            <img
              src="/icons/wordle.png"
              alt="Wordle"
              style={{
                width: '32px',
                height: '32px',
                objectFit: 'contain',
                filter: activeGame === 'wordle' ? 'none' : 'grayscale(100%) opacity(40%)',
              }}
            />
          </button>

          {/* Rewards Button */}
          <button
            onClick={() => setActiveGame('store')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              borderBottom:
                activeGame === 'store' ? `3px solid ${colors.primary}` : '3px solid transparent',
            }}
          >
            <img
              src="/icons/store.png"
              alt="Rewards"
              style={{
                width: '32px',
                height: '32px',
                objectFit: 'contain',
                filter: activeGame === 'store' ? 'none' : 'grayscale(100%) opacity(40%)',
              }}
            />
          </button>
        </div>
      </div>
    </>
  );
}
