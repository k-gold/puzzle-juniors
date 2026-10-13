# Puzzle Juniors

Kid-friendly word games, live at https://puzzlejuniors.com.

- **Letter Puzzle:** a honeycomb spelling game. Make words from seven letters, always using the center one. Every puzzle hides a word that uses all seven letters (a pangram, worth bonus points), and players earn the ranks Beginner, Good and Great by finding a share of the puzzle's kid-friendly answer list.
- **Word Search:** find the hidden words in a 10x10 grid. Themes unlock as points are earned. A Print button makes a black and white sheet (puzzle and word list, then an answer key) that can also be saved as a PDF from the print dialog.
- **Guess the Word:** a four-letter word guessing game, with a Daily puzzle and unlimited Practice.
- **Word Scramble:** five words a round. Tap the mixed-up letter tiles to spell the word shown by the emoji picture.
- **Mini Crossword:** 5x5 crosswords with text clues. Tap a square and type (on screen or on a keyboard). Each word checks itself when it is full: a right word locks in green and the game moves to the next open clue, a wrong one clears. Arrows beside the clue (or the arrow keys) move around, and a Print button makes a sheet with the blank puzzle and clues, then an answer key.
- **Seasonal themes:** opening the game during Valentine's, Spring, Summer and School, Halloween or Winter unlocks that season's Word Search theme and color theme for good. While a season is on, its Word Search comes up about half the time.
- **Rewards:** points, badges, unlockable word search themes and color themes.

Everything runs in the browser. There is no server and no account system. Progress is saved in the player's own browser (`localStorage`).

## Run it locally

Requires Node 22 (see `.nvmrc`).

```
npm ci
npm run dev        # local dev server
npm test           # unit tests
npm run lint       # ESLint
npm run build      # production build into dist/
npm run preview    # serve the production build locally
```

## How it is deployed

Netlify builds this repo on every push to `main` and publishes `dist/` to puzzlejuniors.com. The build command lives in `netlify.toml`:

```
npm ci && npm test && npm run build
```

Tests run before the build, so a failing test stops the deploy and the live site stays as it was. To roll back a bad release, open the site in Netlify, go to Deploys, choose an earlier deploy, and publish it.

Pull requests get a Deploy Preview, which is a separate web address for trying a change before it reaches production.

### Settings in Netlify

- `VITE_GA_ID`: the Google Analytics measurement ID. If it is not set, analytics is not loaded. Set it for production deploys only, so previews and local runs are not tracked.

### Before you push

Pushing to `main` publishes the site, so run these first. They are the same checks Netlify runs.

```
npm run lint
npm test
npm run build
```

The tests include a smoke test that renders every screen, so a change that breaks a screen fails the build before it reaches players.

## Offline, home screen and sound

The site works offline and can be added to a phone's home screen (on iPhone: Safari, Share, Add to Home Screen). No app store or developer account is involved. At build time `scripts/precache-plugin.mjs` writes `dist/sw.js`, a small service worker that saves every built file, so there is nothing to maintain by hand. Page loads try the network first, so new versions arrive as soon as a player is online. The app icon is `public/icons/app-icon.svg`, rendered to the PNG sizes listed in `public/manifest.webmanifest`.

Sound effects are made in the browser (`src/lib/sound.js`), so there are no sound files. They are off until a player turns them on in Rewards, Settings.

## Project layout

```
src/
  App.jsx               Wires the hooks and screens together, and saves progress
  main.jsx              Entry point
  styles.css            Global styles (font, focus rings, reduced motion)
  components/           One file per screen, plus Header, Notifications, HexButton
  hooks/                Game state and rules: useProgress, useSpellingBee, useWordSearch, useWordle
  data/                 Word lists, puzzles, color themes, reward catalogs
  lib/                  Word check, Word Search generator, Wordle scoring, ranks, hints, sound, colors, badge stats, storage, analytics
public/
  words.txt             Dictionary used to check guesses (see below)
  icons/                Tab icons
scripts/                Maintenance scripts (not part of the site build)
tests/                  Tests, run with node:test
```

## Common changes

**Add a Wordle answer.** Add a four-letter uppercase word to the end of `src/data/wordleWords.js`. The word must also be in `public/words.txt`, or the puzzle could not be won, and it must not already be in the list. The tests check all three. The daily puzzle picks its word by position in this list, so do not reorder or remove words that have already been used: that would change what players see on days they have already played.

**Add a Word Scramble word.** Add a `['WORD', '🙂']` pair to `src/data/scrambleWords.js`: 3 to 7 capital letters, a picture that only one word fits, and the word must be in `public/words.txt`. The tests check the length, letters, dictionary and duplicates. Round length and the perfect round bonus are in `src/lib/scramble.js`.

**Add a Mini Crossword.** Add a grid to `GRIDS` in `src/data/crosswordPuzzles.js`: five rows of five letters joined by `/`, with `#` for black squares (for example `CAR##/A#HAY/...`). Every run of 3 or more letters, across and down, is a word, and runs of exactly 2 are not allowed. Each word needs a kid-friendly clue in `CLUES` under the word itself (clues are shared by every puzzle that uses the word). The tests check the shape, that every white square is in a word, that every word is in `public/words.txt` and has a clue, and that no clue contains its own answer.

**Change or add a season.** Seasons are in `SEASONS` in `src/data/rewards.js` (dates are [month, day], must not overlap). Each needs a word list in `src/data/wordSearchWords.js` and a color theme in `src/data/colorThemes.js`, both under the season's id. The tests check dates, word lists and color themes. Earned seasons are saved as `seasonsEarned`.

**Add a Word Search theme.** Add its words to `src/data/wordSearchWords.js` and its card (name, icon, points needed) to `WORD_SEARCH_THEMES` in `src/data/rewards.js`. Themes unlock by themselves when a player's points reach the number on the card. Words must be 10 letters or fewer. The tests check that both lists match.

**Add a Letter Puzzle.** Puzzles are generated, not typed by hand. Add a 7-letter word that has seven different letters to the `PANGRAMS` list in `scripts/build-bee-puzzles.mjs`, then run:

```
npm install --no-save wordlist-english
node scripts/build-bee-puzzles.mjs
```

This rewrites `src/data/beePuzzleList.js` with the letters, a center letter, and the answers: common words from the word list that can be spelled from those letters. Words that are not right for kids go in the `BLOCKED` list in the same script. Read the new puzzle's answers before committing. The tests check that each puzzle has 30 to 70 answers, that all of them are in `public/words.txt`, and that there is at least one pangram. Players can still enter any valid dictionary word. The answer list only decides the rank.

Players' saved puzzles must be one of the puzzles in the list. If you remove a puzzle, anyone halfway through it gets a new one.

**Add a badge.** Add one line to `BADGES` in `src/data/rewards.js`: an id, name, icon, description, the stat it is measured by, and the target. The stats are listed in `src/lib/badgeStats.js`. For something new to count (say, a new kind of win), add a name to `counters` in `src/hooks/useProgress.js`, call `addCount('name')` where it happens, and expose it in `badgeStats.js`. Badges are awarded by one check in `src/hooks/useBadges.js`, so players who already qualify get a new badge the next time they open the site. The tests make sure every badge points at a real stat.

**Hints.** Guess the Word has a Hint button that costs points (`HINT_COST` in `src/data/rewards.js`) and shows one letter of the answer in its place, up to twice per word. What it reveals is chosen in `src/lib/hints.js`. Points are tracked as total earned (`points`, which drives unlocks and badges and only goes up) and points spent (`spentPoints`). The number players see is the balance, earned minus spent.

**Points and bonuses.** Points per word come from `calculatePoints` in `src/hooks/useProgress.js`. Bonuses: 20 for a pangram (`PANGRAM_BONUS` in `useSpellingBee.js`), 25 for finishing a Word Search (`FINISH_BONUS` in `useWordSearch.js`), 25 for finishing a Mini Crossword (`CROSSWORD_FINISH_BONUS` in `src/lib/crossword.js`), 20 for a Word Scramble round with no wrong tries or skips (`PERFECT_ROUND_BONUS` in `src/lib/scramble.js`), and for winning the daily Wordle 10 plus 5 per day of streak, up to 25 extra (`useWordle.js`).

**Add a color theme.** Add the colors to `src/data/colorThemes.js` and its card to `VISUAL_THEMES` in `src/data/rewards.js`.

## The word list

`public/words.txt` is the dictionary for checking guesses. Checking against a file on our own site means the games never depend on a third-party dictionary service being up.

It was built from the `word-list` npm package, keeping lowercase words of 3 to 7 letters, with words from the `badwords-list` package removed. It is committed to the repo and not rebuilt during the build. If you regenerate it, review the result before committing, because the source lists are broad.

## Saved progress

Progress is stored under the key `wordGameState`. Changing the shape of what is saved affects every returning player, so keep new fields optional and give them defaults when loading.

## License

No license is granted. The code is public to read, and all rights are reserved.
