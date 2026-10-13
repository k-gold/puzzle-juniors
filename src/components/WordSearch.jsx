import { useState } from 'react';
import PrintSheet from './PrintSheet.jsx';

export default function WordSearch({
  colors,
  wordSearchPuzzle,
  wsFoundWords,
  isSelecting,
  setIsSelecting,
  wsSelectedCells,
  setWsSelectedCells,
  handleCellMouseDown,
  handleCellMouseEnter,
  handleCellMouseUp,
  handleTouchMove,
  isCellSelected,
  isCellInSolution,
  newWordSearch,
}) {
  // Keyboard play: a cursor moves over the grid. Space starts a word, arrows stretch it,
  // Space again submits it, Escape cancels.
  const [cursor, setCursor] = useState({ row: 0, col: 0 });
  const [gridFocused, setGridFocused] = useState(false);
  const size = wordSearchPuzzle.grid.length;

  const onGridKeyDown = (e) => {
    const moves = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
    const clamp = (n) => Math.max(0, Math.min(size - 1, n));
    if (moves[e.key]) {
      e.preventDefault();
      const row = clamp(cursor.row + moves[e.key][0]);
      const col = clamp(cursor.col + moves[e.key][1]);
      setCursor({ row, col });
      handleCellMouseEnter(row, col);
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (!isSelecting) {
        handleCellMouseDown(cursor.row, cursor.col);
      } else if (wsSelectedCells.length > 1) {
        handleCellMouseUp();
      } else {
        setWsSelectedCells([]);
        setIsSelecting(false);
      }
    } else if (e.key === 'Escape') {
      setWsSelectedCells([]);
      setIsSelecting(false);
    }
  };

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
        Find Words
      </h2>

      {/* Word List - Target Words */}
      <div
        style={{
          maxWidth: '460px',
          margin: '0 auto 14px auto',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          justifyContent: 'center',
        }}
      >
        {wordSearchPuzzle.solutions.map((solution, idx) => {
          const found = wsFoundWords.includes(solution.word);
          return (
            <div
              key={idx}
              style={{
                padding: '6px 12px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: '700',
                background: found ? `${colors.success}1A` : `${colors.primary}12`,
                color: found ? colors.successText : colors.text,
                textDecoration: found ? 'line-through' : 'none',
                transition: 'all 0.3s',
              }}
            >
              {solution.word}
            </div>
          );
        })}
      </div>

      <div
        style={{
          maxWidth: '460px',
          width: '100%',
          margin: '0 auto 20px',
          position: 'relative',
        }}
      >
        {/* Completion Overlay */}
        {wsFoundWords.length === wordSearchPuzzle.solutions.length && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 10,
              padding: '20px',
            }}
          >
            <div
              style={{
                fontSize: '64px',
                marginBottom: '16px',
                animation: 'slideUp 0.5s ease-out',
              }}
            >
              🎉
            </div>
            <div
              style={{
                fontSize: '28px',
                fontWeight: '700',
                color: colors.successText,
                marginBottom: '8px',
                animation: 'slideUp 0.6s ease-out',
              }}
            >
              Puzzle Complete!
            </div>
            <div
              style={{
                fontSize: '16px',
                color: colors.textLight,
                marginBottom: '24px',
                animation: 'slideUp 0.7s ease-out',
              }}
            >
              All words found! 🌟
            </div>
            <button
              onClick={newWordSearch}
              style={{
                padding: '16px 32px',
                background: colors.success,
                color: colors.onSuccess,
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: '700',
                touchAction: 'manipulation',
                transition: 'all 0.2s',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
                animation: 'slideUp 0.8s ease-out',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(16, 185, 129, 0.4)';
              }}
            >
              Start New Puzzle
            </button>
          </div>
        )}

        {/* Grid */}
        <div
          tabIndex={0}
          role="group"
          aria-label="Word search grid. Arrow keys move, space starts and ends a word, escape cancels."
          onKeyDown={onGridKeyDown}
          onFocus={() => setGridFocused(true)}
          onBlur={() => setGridFocused(false)}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(10, 1fr)',
            gap: '3px',
            padding: '8px',
            background: colors.surface,
            borderRadius: '20px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
            userSelect: 'none',
            touchAction: 'none',
          }}
          onMouseLeave={() => {
            if (isSelecting) {
              handleCellMouseUp();
            }
          }}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleCellMouseUp}
        >
          <div className="sr-only" aria-live="polite">
            {gridFocused &&
              `Row ${cursor.row + 1}, column ${cursor.col + 1}, ${wordSearchPuzzle.grid[cursor.row][cursor.col]}${
                isCellSelected(cursor.row, cursor.col) ? ', selected' : ''
              }`}
          </div>
          {wordSearchPuzzle.grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                onMouseUp={handleCellMouseUp}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleCellMouseDown(rowIndex, colIndex);
                }}
                data-row={rowIndex}
                data-col={colIndex}
                style={{
                  aspectRatio: '1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isCellInSolution(rowIndex, colIndex)
                    ? colors.success
                    : isCellSelected(rowIndex, colIndex)
                      ? colors.accent
                      : colors.background,
                  borderRadius: '8px',
                  fontSize: 'clamp(14px, 4.6vw, 22px)',
                  fontWeight: '800',
                  color: isCellInSolution(rowIndex, colIndex)
                    ? colors.onSuccess
                    : isCellSelected(rowIndex, colIndex)
                      ? colors.onAccent
                      : colors.text,
                  cursor: 'pointer',
                  outline:
                    gridFocused && cursor.row === rowIndex && cursor.col === colIndex
                      ? `3px solid ${colors.text}`
                      : 'none',
                  outlineOffset: '-3px',
                  transition: 'background 0.1s',
                  touchAction: 'none',
                }}
              >
                {cell}
              </div>
            )),
          )}
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button
          onClick={() => window.print()}
          style={{
            minHeight: '48px',
            padding: '0 22px',
            background: `${colors.primary}14`,
            color: colors.primaryText,
            border: 'none',
            borderRadius: '999px',
            fontSize: '15px',
            fontWeight: '700',
            cursor: 'pointer',
            touchAction: 'manipulation',
          }}
        >
          Print this puzzle
        </button>
      </div>
      <PrintSheet wordSearchPuzzle={wordSearchPuzzle} />
    </>
  );
}
