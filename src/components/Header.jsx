const TABS = [
  { id: 'spelling', label: 'Letters', icon: '/icons/spelling-bee.png' },
  { id: 'wordsearch', label: 'Search', icon: '/icons/word-search.png' },
  { id: 'wordle', label: 'Guess', icon: '/icons/wordle.png' },
  { id: 'store', label: 'Rewards', icon: '/icons/store.png' },
];

export default function Header({
  colors,
  activeGame,
  setActiveGame,
  points,
  wordleMode,
  switchWordleMode,
  newGame,
  newWordSearch,
  newWordle,
}) {
  const handleNewGame = () => {
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
  };

  return (
    <header
      style={{
        background: colors.surface,
        boxShadow: '0 1px 0 rgba(0,0,0,0.06), 0 6px 18px rgba(0,0,0,0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        paddingTop: 'env(safe-area-inset-top)',
      }}
    >
      {/* Top row: title, new game, points */}
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '10px clamp(12px, 4vw, 16px) 6px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(16px, 5vw, 19px)',
            fontWeight: '800',
            letterSpacing: '-0.01em',
            color: colors.text,
            margin: 0,
            flex: 1,
            whiteSpace: 'nowrap',
          }}
        >
          Puzzle Juniors
        </h1>

        {activeGame !== 'store' && (
          <button
            onClick={handleNewGame}
            style={{
              minHeight: '40px',
              padding: '0 clamp(10px, 3vw, 14px)',
              background: `${colors.primary}14`,
              color: colors.primaryText,
              border: 'none',
              borderRadius: '999px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              touchAction: 'manipulation',
            }}
          >
            New game
          </button>
        )}

        <button
          onClick={() => setActiveGame('store')}
          aria-label={`${points} points. Open rewards`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: `${colors.accent}1F`,
            minHeight: '40px',
            padding: '0 clamp(10px, 3vw, 12px)',
            borderRadius: '999px',
            border: 'none',
            cursor: 'pointer',
            touchAction: 'manipulation',
          }}
        >
          <span style={{ fontSize: '16px', lineHeight: 1 }} aria-hidden="true">
            ⭐
          </span>
          <span style={{ fontSize: '16px', fontWeight: '800', color: colors.text }}>{points}</span>
        </button>
      </div>

      {/* Game tabs */}
      <nav
        aria-label="Games"
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          display: 'flex',
          padding: '0 8px',
        }}
      >
        {TABS.map((tab) => {
          const active = activeGame === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveGame(tab.id)}
              aria-current={active ? 'page' : undefined}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
                padding: '8px 4px 7px',
                background: 'transparent',
                border: 'none',
                borderBottom: `3px solid ${active ? colors.primary : 'transparent'}`,
                cursor: 'pointer',
                touchAction: 'manipulation',
                transition: 'border-color 0.2s ease',
              }}
            >
              <img
                src={tab.icon}
                alt=""
                width="28"
                height="28"
                style={{
                  width: '28px',
                  height: '28px',
                  objectFit: 'contain',
                  filter: active ? 'none' : 'grayscale(100%) opacity(55%)',
                  transition: 'filter 0.2s ease',
                }}
              />
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: active ? colors.primaryText : colors.textLight,
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}
