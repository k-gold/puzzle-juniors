import { createPortal } from 'react-dom';

// A black and white copy of the current Mini Crossword for printing: the empty grid and clues on
// the first page, the answer key on the second. Hidden on screen (see styles.css).
function Grid({ crossword, showAnswers }) {
  return (
    <table className="print-grid print-cw">
      <tbody>
        {crossword.rows.map((row, r) => (
          <tr key={r}>
            {row.map((letter, c) =>
              letter === null ? (
                <td
                  key={c}
                  className={crossword.outside.has(`${r},${c}`) ? 'print-gap' : 'print-block'}
                />
              ) : (
                <td key={c}>
                  {crossword.numbers[`${r},${c}`] && (
                    <span className="print-number">{crossword.numbers[`${r},${c}`]}</span>
                  )}
                  {showAnswers ? letter : ''}
                </td>
              ),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function CrosswordPrintSheet({ crossword }) {
  if (typeof document === 'undefined') return null;
  const clues = (dir) => crossword.entries.filter((e) => e.dir === dir);

  return createPortal(
    <div className="print-sheet">
      <section className="print-page">
        <h1>Puzzle Juniors Mini Crossword</h1>
        <p className="print-line">Name: ______________________ &nbsp;&nbsp; Date: ______________</p>
        <Grid crossword={crossword} />
        <div className="print-clues">
          {[
            ['across', 'Across'],
            ['down', 'Down'],
          ].map(([dir, title]) => (
            <div key={dir}>
              <h2>{title}</h2>
              <ol>
                {clues(dir).map((e) => (
                  <li key={e.id} value={e.number}>
                    {e.clue}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>
      <section className="print-page print-key">
        <h1>Answer Key</h1>
        <Grid crossword={crossword} showAnswers />
      </section>
    </div>,
    document.body,
  );
}
