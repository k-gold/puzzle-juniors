import { useEffect } from 'react';
import { cellKey, CROSSWORD_FINISH_BONUS } from '../lib/crossword.js';

const KEY_ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];
const label = (entry) => `${entry.number} ${entry.dir === 'across' ? 'Across' : 'Down'}`;

export default function Crossword({
  colors,
  crossword,
  crosswordLetters,
  crosswordSolved,
  crosswordSelected,
  crosswordActiveEntry,
  crosswordShaking,
  crosswordDone,
  crosswordMistakes,
  selectCrosswordCell,
  selectCrosswordEntry,
  typeCrosswordLetter,
  crosswordBackspace,
  newCrossword,
}) {
  // Let players type on a physical keyboard
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
        document.activeElement?.blur?.();
        typeCrosswordLetter(e.key.toUpperCase());
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        crosswordBackspace();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [typeCrosswordLetter, crosswordBackspace]);

  const solvedCells = new Set(
    crossword.entries
      .filter((e) => crosswordSolved.includes(e.id))
      .flatMap((e) => e.cells.map(([r, c]) => cellKey(r, c))),
  );
  const activeCells = new Set((crosswordActiveEntry?.cells || []).map(([r, c]) => cellKey(r, c)));
  const shakingCells = new Set(
    crossword.entries
      .filter((e) => e.id === crosswordShaking)
      .flatMap((e) => e.cells.map(([r, c]) => cellKey(r, c))),
  );

  const card = {
    background: colors.surface,
    borderRadius: '20px',
    padding: '14px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  };

  const clueList = (dir, title) => (
    <div style={{ flex: 1, minWidth: '140px' }}>
      <h3
        style={{
          fontSize: '13px',
          fontWeight: '800',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: colors.textLight,
          margin: '0 0 6px',
        }}
      >
        {title}
      </h3>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {crossword.entries
          .filter((e) => e.dir === dir)
          .map((entry) => {
            const isSolved = crosswordSolved.includes(entry.id);
            const isActive = crosswordActiveEntry?.id === entry.id;
            return (
              <li key={entry.id}>
                <button
                  onClick={() => selectCrosswordEntry(entry)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    minHeight: '44px',
                    padding: '6px 8px',
                    background: isActive ? `${colors.primary}14` : 'transparent',
                    color: isSolved ? colors.successText : colors.text,
                    textDecoration: isSolved ? 'line-through' : 'none',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    touchAction: 'manipulation',
                  }}
                >
                  <strong>{entry.number}.</strong> {entry.clue}
                </button>
              </li>
            );
          })}
      </ul>
    </div>
  );

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
        Mini Crossword
      </h2>

      <div style={{ maxWidth: '500px', margin: '0 auto', paddingBottom: '8px' }}>
        <div style={card}>
          {/* The clue for the word being worked on */}
          <div
            role="status"
            aria-live="polite"
            style={{
              minHeight: '44px',
              marginBottom: '10px',
              padding: '8px 12px',
              background: `${colors.primary}14`,
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '700',
              color: colors.text,
              textAlign: 'center',
            }}
          >
            {crosswordDone
              ? 'All done!'
              : crosswordActiveEntry
                ? `${label(crosswordActiveEntry)}: ${crosswordActiveEntry.clue}`
                : ''}
          </div>

          <div
            role="group"
            aria-label="Crossword grid"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${crossword.size}, 1fr)`,
              gap: '3px',
              maxWidth: '340px',
              margin: '0 auto',
            }}
          >
            {crossword.rows.map((row, r) =>
              row.map((_, c) => {
                const key = cellKey(r, c);
                if (crossword.rows[r][c] === null) {
                  return (
                    <div
                      key={key}
                      aria-hidden="true"
                      style={{ aspectRatio: '1', background: colors.text, borderRadius: '6px' }}
                    />
                  );
                }
                const isSelected =
                  !crosswordDone && crosswordSelected.r === r && crosswordSelected.c === c;
                const isSolved = solvedCells.has(key);
                const letter = crosswordLetters[key] || '';
                const background = isSelected
                  ? colors.primary
                  : isSolved
                    ? colors.success
                    : activeCells.has(key)
                      ? `${colors.primary}26`
                      : colors.background;
                const color = isSelected
                  ? colors.onPrimary
                  : isSolved
                    ? colors.onSuccess
                    : colors.text;
                return (
                  <button
                    key={key}
                    onClick={() => selectCrosswordCell(r, c)}
                    aria-label={`Row ${r + 1}, column ${c + 1}, ${letter || 'empty'}${isSolved ? ', correct' : ''}`}
                    style={{
                      position: 'relative',
                      aspectRatio: '1',
                      padding: 0,
                      background,
                      color,
                      border: `2px solid ${isSelected ? colors.primary : 'transparent'}`,
                      borderRadius: '6px',
                      fontSize: 'clamp(20px, 7vw, 28px)',
                      fontWeight: '800',
                      cursor: 'pointer',
                      touchAction: 'manipulation',
                      animation: shakingCells.has(key) ? 'shake 0.4s' : 'none',
                    }}
                  >
                    {crossword.numbers[key] && (
                      <span
                        aria-hidden="true"
                        style={{
                          position: 'absolute',
                          top: '2px',
                          left: '4px',
                          fontSize: '11px',
                          fontWeight: '700',
                          lineHeight: 1,
                        }}
                      >
                        {crossword.numbers[key]}
                      </span>
                    )}
                    {letter}
                  </button>
                );
              }),
            )}
          </div>
        </div>

        {crosswordDone ? (
          <div style={{ ...card, marginTop: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: '22px', fontWeight: '800', color: colors.text }}>
              Puzzle complete!
            </div>
            <p style={{ fontSize: '15px', color: colors.textLight, margin: '8px 0 0' }}>
              {crosswordMistakes === 0
                ? `No wrong words. That includes a ${CROSSWORD_FINISH_BONUS} point bonus.`
                : `You finished it. That includes a ${CROSSWORD_FINISH_BONUS} point bonus.`}
            </p>
            <button
              onClick={newCrossword}
              style={{
                marginTop: '14px',
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
              New puzzle
            </button>
          </div>
        ) : (
          <div style={{ marginTop: '12px' }}>
            {KEY_ROWS.map((letters, i) => (
              <div
                key={letters}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '4px',
                  marginBottom: '6px',
                }}
              >
                {[...letters].map((ch) => (
                  <button
                    key={ch}
                    onClick={() => typeCrosswordLetter(ch)}
                    style={{
                      flex: '1 1 0',
                      maxWidth: '40px',
                      minHeight: '48px',
                      padding: 0,
                      background: colors.surface,
                      color: colors.text,
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
                      fontSize: '18px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      touchAction: 'manipulation',
                    }}
                  >
                    {ch}
                  </button>
                ))}
                {i === KEY_ROWS.length - 1 && (
                  <button
                    onClick={crosswordBackspace}
                    aria-label="Backspace"
                    style={{
                      flex: '1.5 1 0',
                      maxWidth: '60px',
                      minHeight: '48px',
                      padding: 0,
                      background: `${colors.primary}14`,
                      color: colors.primaryText,
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '18px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      touchAction: 'manipulation',
                    }}
                  >
                    ⌫
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <div style={{ ...card, marginTop: '14px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {clueList('across', 'Across')}
          {clueList('down', 'Down')}
        </div>
      </div>
    </>
  );
}
