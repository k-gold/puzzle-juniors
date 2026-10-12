import ShuffleIcon from './ShuffleIcon.jsx';
import HexButton from './HexButton.jsx';

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
          Letter Puzzle
        </h2>
      </div>

      {/* Main Game */}
      <div
        style={{
          maxWidth: '420px',
          width: '100%',
          margin: '0 auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '20px',
        }}
      >
        {/* Message Display - Above word display */}
        {message && (
          <p
            style={{
              margin: '0 0 8px 0',
              color:
                message.includes('Great') || message.includes('Checking')
                  ? colors.success
                  : colors.error,
              fontWeight: '600',
              fontSize: '14px',
              minHeight: '20px',
            }}
          >
            {message}
          </p>
        )}

        {/* Current Word Display - Below message */}
        <div
          style={{
            fontSize: '32px',
            fontWeight: '600',
            color: currentWord ? colors.text : colors.textLight,
            letterSpacing: '0.08em',
            minHeight: '48px',
            marginBottom: '24px',
            textTransform: 'uppercase',
          }}
        >
          {currentWord || '\u00A0'}
        </div>

        {/* Hexagon Grid - NYT Style */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '24px',
            gap: '8px',
          }}
        >
          {/* Top row - 2 letters */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <HexButton
              colors={colors}
              letter={outerLetters[0]}
              isCenter={false}
              onClick={() => handleLetterClick(outerLetters[0])}
            />
            <HexButton
              colors={colors}
              letter={outerLetters[1]}
              isCenter={false}
              onClick={() => handleLetterClick(outerLetters[1])}
            />
          </div>

          {/* Middle row - 3 letters (left, center, right) */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <HexButton
              colors={colors}
              letter={outerLetters[2]}
              isCenter={false}
              onClick={() => handleLetterClick(outerLetters[2])}
            />
            <HexButton
              colors={colors}
              letter={puzzle.center}
              isCenter={true}
              onClick={() => handleLetterClick(puzzle.center)}
            />
            <HexButton
              colors={colors}
              letter={outerLetters[3]}
              isCenter={false}
              onClick={() => handleLetterClick(outerLetters[3])}
            />
          </div>

          {/* Bottom row - 2 letters */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <HexButton
              colors={colors}
              letter={outerLetters[4]}
              isCenter={false}
              onClick={() => handleLetterClick(outerLetters[4])}
            />
            <HexButton
              colors={colors}
              letter={outerLetters[5]}
              isCenter={false}
              onClick={() => handleLetterClick(outerLetters[5])}
            />
          </div>
        </div>

        {/* Three Button Controls */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '24px',
            width: '100%',
            maxWidth: '360px',
          }}
        >
          <button
            onClick={() => setCurrentWord(currentWord.slice(0, -1))}
            style={{
              flex: 1,
              padding: '14px',
              background: colors.surface,
              color: colors.text,
              border: `2px solid ${colors.textLight}`,
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              touchAction: 'manipulation',
              transition: 'all 0.15s ease',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Delete
          </button>
          <button
            onClick={shuffleLetters}
            style={{
              flex: 0.8,
              padding: '14px',
              background: colors.surface,
              color: colors.text,
              border: `2px solid ${colors.primary}`,
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              touchAction: 'manipulation',
              transition: 'all 0.15s ease',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <ShuffleIcon size={18} />
          </button>
          <button
            onClick={handleSubmit}
            disabled={isValidating || currentWord.length < 3}
            style={{
              flex: 1,
              padding: '14px',
              background:
                isValidating || currentWord.length < 3 ? colors.textLight : colors.primary,
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: isValidating || currentWord.length < 3 ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '700',
              boxShadow:
                isValidating || currentWord.length < 3
                  ? 'none'
                  : '0 4px 12px rgba(99, 102, 241, 0.3)',
              touchAction: 'manipulation',
              transition: 'all 0.15s ease',
            }}
            onMouseDown={(e) => {
              if (!isValidating && currentWord.length >= 3) {
                e.currentTarget.style.transform = 'scale(0.98)';
              }
            }}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {isValidating ? 'Checking...' : 'Enter'}
          </button>
        </div>

        {/* Found Words */}
        {foundWords.length > 0 && (
          <div
            style={{
              background: colors.surface,
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            <h3
              style={{
                fontSize: '16px',
                fontWeight: '700',
                color: colors.text,
                marginBottom: '12px',
                marginTop: 0,
              }}
            >
              Words ({foundWords.length})
            </h3>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              {foundWords.map((word, i) => (
                <span
                  key={i}
                  style={{
                    padding: '6px 12px',
                    background: colors.background,
                    color: colors.text,
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    border: `1px solid ${colors.primary}20`,
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
