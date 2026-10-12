# Puzzle Juniors

Kid-friendly word games, live at https://puzzlejuniors.com.

- **Letter Puzzle:** a honeycomb spelling game. Make words from seven letters, always using the center one.
- **Word Search:** find the hidden words in a 10x10 grid. Themes unlock as points are earned.
- **Guess the Word:** a four-letter word guessing game, with a Daily puzzle and unlimited Practice.
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

## Project layout

```
src/
  App.jsx               Wires the hooks and screens together, and saves progress
  main.jsx              Entry point
  styles.css            Global styles (font, focus rings, reduced motion)
  components/           One file per screen, plus Header, Notifications, HexButton
  hooks/                Game state and rules: useProgress, useSpellingBee, useWordSearch, useWordle
  data/                 Word lists, puzzles, color themes, reward catalogs
  lib/                  Word check, Word Search generator, Wordle scoring, storage, analytics
public/
  words.txt             Dictionary used to check guesses (see below)
  icons/                Tab icons
tests/                  Tests, run with node:test
```

## Common changes

**Add a Wordle answer.** Add a four-letter uppercase word to `src/data/wordleWords.js`. The word must also be in `public/words.txt`, or the puzzle could not be won. The tests check both.

**Add a Word Search theme.** Add its words to `src/data/wordSearchWords.js` and its card (name, icon, points needed) to `WORD_SEARCH_THEMES` in `src/data/rewards.js`. Words must be 10 letters or fewer. The tests check that both lists match.

**Add a Spelling Bee puzzle.** Add seven distinct letters and a center letter to `src/data/spellingBeePuzzles.js`. The tests require at least 50 findable words.

**Add a color theme.** Add the colors to `src/data/colorThemes.js` and its card to `VISUAL_THEMES` in `src/data/rewards.js`.

## The word list

`public/words.txt` is the dictionary for checking guesses. Checking against a file on our own site means the games never depend on a third-party dictionary service being up.

It was built from the `word-list` npm package, keeping lowercase words of 3 to 7 letters, with words from the `badwords-list` package removed. It is committed to the repo and not rebuilt during the build. If you regenerate it, review the result before committing, because the source lists are broad.

## Saved progress

Progress is stored under the key `wordGameState`. Changing the shape of what is saved affects every returning player, so keep new fields optional and give them defaults when loading.

## License

No license is granted. The code is public to read, and all rights are reserved.
