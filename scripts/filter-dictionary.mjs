// Removes the words listed in scripts/blocked-words.txt from public/words.txt, so a player
// cannot enter them as guesses or earn points for them. Run it after editing the list:
//
//   node scripts/filter-dictionary.mjs
import fs from 'node:fs';

export const readBlocked = () =>
  new Set(
    fs
      .readFileSync(new URL('./blocked-words.txt', import.meta.url), 'utf8')
      .split('\n')
      .filter((line) => !line.startsWith('#'))
      .flatMap((line) => line.split(/\s+/))
      .filter(Boolean),
  );

if (import.meta.url === `file://${process.argv[1]}`) {
  const file = new URL('../public/words.txt', import.meta.url);
  const blocked = readBlocked();
  const words = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean);
  const kept = words.filter((w) => !blocked.has(w));
  fs.writeFileSync(file, kept.join('\n'));
  console.log(`Removed ${words.length - kept.length} words. ${kept.length} remain.`);
}
