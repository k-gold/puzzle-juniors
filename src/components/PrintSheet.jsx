import { createPortal } from 'react-dom';

// A black and white copy of the current Word Search for printing: the puzzle and word list on
// the first page, the answer key on the second. It stays hidden on screen (see styles.css) and
// only shows when the browser prints, so players can also choose "Save as PDF" there.
function Grid({ grid, answers }) {
  const solved = new Set();
  if (answers) {
    for (const s of answers) for (const p of s.positions) solved.add(`${p.row},${p.col}`);
  }
  return (
    <table className="print-grid">
      <tbody>
        {grid.map((row, r) => (
          <tr key={r}>
            {row.map((letter, c) => (
              <td key={c} className={solved.has(`${r},${c}`) ? 'print-answer' : undefined}>
                {letter}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function PrintSheet({ wordSearchPuzzle }) {
  if (typeof document === 'undefined') return null;
  const { grid, solutions } = wordSearchPuzzle;
  const words = solutions.map((s) => s.word);

  return createPortal(
    <div className="print-sheet">
      <section className="print-page">
        <h1>Puzzle Juniors Word Search</h1>
        <p className="print-line">Name: ______________________ &nbsp;&nbsp; Date: ______________</p>
        <Grid grid={grid} />
        <p className="print-note">Find these words. They can go in any direction.</p>
        <ul className="print-words">
          {words.map((w) => (
            <li key={w}>
              <span className="print-box" aria-hidden="true" /> {w}
            </li>
          ))}
        </ul>
      </section>
      <section className="print-page print-key">
        <h1>Answer Key</h1>
        <Grid grid={grid} answers={solutions} />
        <p className="print-note">{words.join(', ')}</p>
      </section>
    </div>,
    document.body,
  );
}
