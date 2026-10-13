// Rebuilds src/data/beePuzzleList.js. Run it only when changing which puzzles exist:
//
//   npm install --no-save wordlist-english
//   node scripts/build-bee-puzzles.mjs
//
// Each puzzle is built around a 7-letter word that uses seven different letters (the
// "pangram"). The answers are the common, kid-friendly words (from the common tiers of the
// SCOWL word list, also found in public/words.txt, minus BLOCKED) that can be spelled from
// the puzzle's letters and include its center letter.
import fs from 'node:fs';

const PANGRAMS =
  'crayons dragons donkeys dolphin rainbow monkeys kitchen holiday pencils turnips turkeys teacups spinach sparkle snorkel jackets jungles ladybug lizards magnets orchids peanuts panther pyramid stadium cabinet balcony biplane bonfire boulder brownie bridges builder buckets bundles caption catfish chamber chapter chariot clothes clovers costume courage crimson crystal curtain custard cushion dustpan factory flowers foliage gerbils glacier goblins gymnast harvest jingles kingdom knights laundry mangoes meadows mineral mustang mustard ostrich padlock pelican petunia pickles plumber princes rockets scamper skating skyline slumber someday squeaky stencil sticker sundial surfing swiftly thunder tickled timbers tongues toucans tumbler tundras turbine twinkle utensil vinegar violets voyager walnuts whisper wildcat wizards wombats workman'.split(
    ' ',
  );

// Words that are common but not right for a kids' game, or too strange to expect a child to know
const BLOCKED = new Set(
  `anon con cons croon croons crony dross jackass arson rancor rue rues usurp usurps sissy ninny
  doming dooming gonging mooning geneses noes sodded sodden sod sods noose nooses hick chi sic sics
  eke ekes sup puss pusses pus uterus turret turrets stirrup dos ohs eons slake slakes hart theta
  tetanus ardor ardors mange angst negate negates pap caucus sordid papyri acutes trues gamest
  sagest tautest hence thence ail ails lax limbo yeses spurn spurns kill dead death drug gun hate
  beer wine drunk gang slave sex bomb blood shoot spit damn hell nude naked whip abuse hang ass
  non canny canon canons heath heathen nether sunup unset ruse ruses ashcan shod runt runts ruts
  caste castes gees gent gents sangs tangs unseat yen yens inborn boor`.split(
    /\s+/,
  ),
);

// Also leave out everything in the shared blocklist (also removed from the dictionary itself)
const blocklist = fs
  .readFileSync('scripts/blocked-words.txt', 'utf8')
  .split('\n')
  .filter((line) => !line.startsWith('#'))
  .flatMap((line) => line.split(/\s+/))
  .filter(Boolean);
for (const word of blocklist) BLOCKED.add(word);
// Answers only (the dictionary still accepts these): words that are fine in a dictionary but not
// something to hand a child as a puzzle answer
const NOT_FOR_ANSWERS = `gay gays gayer goon goons gangs guns gunman casket caskets loin bra gonna addict
  assault beers bosom bosoms bums butt butts catcall coke cokes crotch cyst cysts erect erects
  fascist herpes kinks kinking kinked lusts moronic mucous mucus ninnies senile sperms virgin womb
  wombs leper scum scums bullet bullets`;
for (const word of NOT_FOR_ANSWERS.split(/\s+/)) {
  BLOCKED.add(word);
}

const TIERS = [10, 20, 35];
const read = (name) =>
  JSON.parse(fs.readFileSync(`node_modules/wordlist-english/${name}.json`, 'utf8'));
const dictionary = new Set(fs.readFileSync('public/words.txt', 'utf8').split('\n').filter(Boolean));
const common = new Set(
  TIERS.flatMap((n) => [...read(`english-words-${n}`), ...read(`american-words-${n}`)]).filter(
    (w) => /^[a-z]{3,7}$/.test(w) && dictionary.has(w) && !BLOCKED.has(w),
  ),
);

const puzzles = [];
for (const pangram of PANGRAMS) {
  if (!common.has(pangram) || new Set(pangram).size !== 7) throw new Error(`Bad pangram ${pangram}`);
  const letters = [...pangram].sort();
  let best = null;
  for (const center of letters) {
    const answers = [...common]
      .filter((w) => w.includes(center) && [...w].every((c) => letters.includes(c)))
      .sort();
    // Aim for about 40 words: enough to feel rewarding, few enough to finish
    if (answers.length >= 30 && answers.length <= 70) {
      const distance = Math.abs(answers.length - 40);
      if (!best || distance < best.distance) best = { center, answers, distance };
    }
  }
  if (!best) {
    console.log(`Skipped ${pangram}: no center gives 30 to 70 words`);
    continue;
  }
  puzzles.push({
    letters: [...pangram].map((c) => c.toUpperCase()),
    center: best.center.toUpperCase(),
    answers: best.answers.map((w) => w.toUpperCase()),
  });
}

const quote = (list) => list.map((w) => `'${w}'`);

// Wraps a list of strings onto lines of about 90 characters
const wrap = (items, indent) => {
  const lines = [];
  let line = '';
  for (const item of items) {
    const next = line ? `${line} ${item},` : `${item},`;
    if (next.length > 90) {
      lines.push(line);
      line = `${item},`;
    } else {
      line = next;
    }
  }
  lines.push(line);
  return lines.map((l) => indent + l).join('\n');
};

const body = puzzles
  .map(
    (p) => `  {
    letters: [${quote(p.letters).join(', ')}],
    center: '${p.center}',
    answers: [
${wrap(quote(p.answers), '      ')}
    ],
  },`,
  )
  .join('\n');

fs.writeFileSync(
  'src/data/beePuzzleList.js',
  `// GENERATED by scripts/build-bee-puzzles.mjs. To change the puzzles, edit the script and rerun it.
// letters: the seven letters (they spell the puzzle's 7-letter pangram when unscrambled)
// center: the letter every word must use
// answers: the common, kid-friendly words to find
export const PUZZLES = [
${body}
];
`,
);
console.log(`${puzzles.length} puzzles`);
