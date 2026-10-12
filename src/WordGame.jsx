import React, { useState, useEffect } from 'react';
import { RefreshCw, Delete } from 'lucide-react';

// Word validation against a bundled word list (no third-party API).
// The list is fetched once from our own origin and cached in memory.
let wordListPromise = null;
function loadWordList() {
  if (!wordListPromise) {
    wordListPromise = fetch('/words.txt')
      .then((res) => {
        if (!res.ok) throw new Error(`words.txt: ${res.status}`);
        return res.text();
      })
      .then((text) => new Set(text.split('\n')))
      .catch((error) => {
        wordListPromise = null; // allow retry on next check
        throw error;
      });
  }
  return wordListPromise;
}

async function isValidWord(word) {
  try {
    const words = await loadWordList();
    return words.has(word.toLowerCase());
  } catch (error) {
    console.error('Word list error:', error);
    return false;
  }
}

// Generate random Spelling Bee puzzle
const generateSpellingBeePuzzle = () => {
  const puzzles = [
    { letters: ['C', 'A', 'T', 'R', 'E', 'O', 'N'], center: 'A' },
    { letters: ['P', 'L', 'A', 'Y', 'E', 'R', 'S'], center: 'L' },
    { letters: ['S', 'T', 'A', 'R', 'E', 'M', 'K'], center: 'T' },
    { letters: ['B', 'E', 'A', 'R', 'D', 'K', 'S'], center: 'E' },
    { letters: ['M', 'O', 'U', 'S', 'E', 'R', 'T'], center: 'O' },
    { letters: ['H', 'O', 'U', 'S', 'E', 'R', 'T'], center: 'O' },
    { letters: ['F', 'I', 'R', 'E', 'D', 'S', 'T'], center: 'I' },
    { letters: ['G', 'A', 'M', 'E', 'S', 'T', 'R'], center: 'A' },
    { letters: ['W', 'I', 'N', 'D', 'E', 'R', 'S'], center: 'I' },
    { letters: ['B', 'O', 'A', 'T', 'S', 'R', 'E'], center: 'O' },
    { letters: ['C', 'O', 'L', 'D', 'E', 'R', 'S'], center: 'O' },
    { letters: ['P', 'A', 'R', 'T', 'Y', 'S', 'E'], center: 'A' },
    { letters: ['L', 'I', 'G', 'H', 'T', 'S', 'E'], center: 'I' },
    { letters: ['S', 'A', 'N', 'D', 'Y', 'E', 'R'], center: 'A' },
    { letters: ['R', 'O', 'C', 'K', 'S', 'E', 'T'], center: 'O' },
    { letters: ['F', 'A', 'R', 'M', 'E', 'S', 'T'], center: 'A' },
    { letters: ['D', 'A', 'N', 'C', 'E', 'R', 'S'], center: 'A' },
    { letters: ['S', 'I', 'N', 'G', 'E', 'R', 'T'], center: 'I' },
    { letters: ['B', 'R', 'I', 'G', 'H', 'T', 'S'], center: 'I' },
    { letters: ['S', 'P', 'O', 'R', 'T', 'Y', 'E'], center: 'O' },
    { letters: ['C', 'H', 'E', 'E', 'R', 'S', 'T'], center: 'E' },
    { letters: ['M', 'A', 'G', 'I', 'C', 'S', 'T'], center: 'A' },
    { letters: ['W', 'O', 'R', 'L', 'D', 'S', 'E'], center: 'O' },
    { letters: ['F', 'L', 'O', 'W', 'E', 'R', 'S'], center: 'O' },
    { letters: ['S', 'M', 'I', 'L', 'E', 'T', 'R'], center: 'I' },
    { letters: ['H', 'A', 'P', 'P', 'Y', 'E', 'S'], center: 'A' },
    { letters: ['D', 'R', 'E', 'A', 'M', 'S', 'T'], center: 'E' },
    { letters: ['F', 'R', 'I', 'E', 'N', 'D', 'S'], center: 'I' }
  ];
  return puzzles[Math.floor(Math.random() * puzzles.length)];
};

// Word lists mapped by theme ID
const WORD_LISTS_BY_THEME = {
  space: ['STAR', 'MOON', 'PLANET', 'COMET', 'METEOR', 'ORBIT', 'GALAXY', 'SOLAR', 'SPACE', 'COSMOS'],
  ocean: ['OCEAN', 'WAVE', 'BEACH', 'CORAL', 'WHALE', 'SHARK', 'TIDE', 'SAND', 'SHELL', 'WATER'],
  forest: ['FOREST', 'TREE', 'LEAF', 'BIRD', 'DEER', 'BEAR', 'WOLF', 'PINE', 'MAPLE', 'RIVER'],
  garden: ['GARDEN', 'FLOWER', 'ROSE', 'TULIP', 'DAISY', 'LILY', 'SEED', 'SOIL', 'BLOOM', 'PLANT'],
  weather: ['SUMMER', 'WINTER', 'SPRING', 'RAIN', 'SNOW', 'WIND', 'CLOUD', 'STORM', 'SUNNY', 'FROST'],
  fruits: ['APPLE', 'BERRY', 'GRAPE', 'LEMON', 'MANGO', 'MELON', 'PEACH', 'PLUM', 'CHERRY', 'ORANGE'],
  fantasy: ['DRAGON', 'WIZARD', 'KNIGHT', 'CASTLE', 'SWORD', 'MAGIC', 'QUEST', 'FAIRY', 'WAND', 'SPELL'],
  sports: ['SOCCER', 'TENNIS', 'HOCKEY', 'RUGBY', 'GOLF', 'SWIM', 'RACE', 'JUMP', 'THROW', 'CATCH'],
  food: ['PIZZA', 'PASTA', 'BREAD', 'RICE', 'SALAD', 'SOUP', 'TACO', 'BURGER', 'FRIES', 'CAKE'],
  zoo: ['LION', 'TIGER', 'ZEBRA', 'GIRAFFE', 'MONKEY', 'RHINO', 'HIPPO', 'CAMEL', 'PANDA', 'KOALA'],
  vehicles: ['TRAIN', 'PLANE', 'BOAT', 'CAR', 'BUS', 'BIKE', 'TRUCK', 'SHIP', 'ROCKET', 'TAXI'],
  colors: ['YELLOW', 'RED', 'BLUE', 'GREEN', 'PINK', 'BROWN', 'BLACK', 'WHITE', 'PURPLE', 'ORANGE'],
  music: ['VIOLIN', 'PIANO', 'DRUM', 'FLUTE', 'GUITAR', 'HARP', 'HORN', 'BELL', 'ORGAN', 'BANJO'],
  emotions: ['HAPPY', 'BRAVE', 'KIND', 'SMART', 'CALM', 'PROUD', 'SILLY', 'WISE', 'SWEET', 'BOLD'],
  school: ['PENCIL', 'PAPER', 'BOOK', 'DESK', 'CHAIR', 'RULER', 'ERASER', 'PEN', 'MARKER', 'CRAYON'],
  pets: ['PUPPY', 'KITTEN', 'BUNNY', 'HAMSTER', 'PARROT', 'TURTLE', 'FISH', 'FROG', 'LIZARD', 'MOUSE'],
  dinosaurs: ['TREX', 'RAPTOR', 'STEGO', 'BRONTO', 'TRICERA', 'FOSSIL', 'BONES', 'DINO', 'SPIKE', 'ROAR'],
  pirates: ['PIRATE', 'SHIP', 'TREASURE', 'GOLD', 'MAP', 'SWORD', 'SAIL', 'OCEAN', 'ISLAND', 'CREW'],
  farm: ['FARM', 'BARN', 'TRACTOR', 'COW', 'PIG', 'CHICKEN', 'HORSE', 'SHEEP', 'CORN', 'HAY'],
  camping: ['TENT', 'CAMP', 'FIRE', 'FOREST', 'TRAIL', 'HIKE', 'WOODS', 'STARS', 'NATURE', 'SLEEP'],
  everly: ['RAINBOW', 'UNICORN', 'LOVE', 'SMILE', 'PEACE', 'HUGS', 'HEART', 'MOVIES', 'DRESSES', 'BOOKS'],
  movies: ['ZOOTOPIA', 'FROZEN', 'CARS', 'MOANA', 'ENCANTO', 'COCO', 'BRAVE', 'TANGLED', 'RATATOUILLE', 'NEMO'],
  heroes: ['BATMAN', 'SUPERMAN', 'SPIDERMAN', 'IRONMAN', 'HULK', 'THOR', 'FLASH', 'WONDER', 'AQUAMAN', 'CAPTAIN'],
  asher: ['TRUCKS', 'SALAMI', 'BOATS', 'BULLDOZER', 'CHEESE', 'HEROES', 'FOOTBALL', 'JUMPING', 'RACECAR', 'BIKE']
};

// Generate random Word Search puzzle from unlocked themes
const generateWordSearchPuzzle = (unlockedThemesList) => {
  // Pick a random theme from unlocked themes
  const randomTheme = unlockedThemesList[Math.floor(Math.random() * unlockedThemesList.length)];
  const words = WORD_LISTS_BY_THEME[randomTheme];
  const size = 10;
  const grid = Array(size).fill(null).map(() => Array(size).fill(null));
  const solutions = [];
  
  // Direction vectors: horizontal, vertical, and 4 diagonals
  const directions = [
    { dr: 0, dc: 1 },   // horizontal right
    { dr: 1, dc: 0 },   // vertical down
    { dr: 1, dc: 1 },   // diagonal down-right
    { dr: 1, dc: -1 },  // diagonal down-left
    { dr: -1, dc: 1 },  // diagonal up-right
    { dr: -1, dc: -1 }, // diagonal up-left
    { dr: 0, dc: -1 },  // horizontal left
    { dr: -1, dc: 0 }   // vertical up
  ];
  
  const canPlaceWord = (word, row, col, dir) => {
    const endRow = row + dir.dr * (word.length - 1);
    const endCol = col + dir.dc * (word.length - 1);
    
    if (endRow < 0 || endRow >= size || endCol < 0 || endCol >= size) {
      return false;
    }
    
    // Allow intersecting words - cells can match or be empty
    for (let i = 0; i < word.length; i++) {
      const r = row + dir.dr * i;
      const c = col + dir.dc * i;
      if (grid[r][c] !== null && grid[r][c] !== word[i]) {
        return false;
      }
    }
    
    return true;
  };
  
  const placeWord = (word, row, col, dir) => {
    const positions = [];
    for (let i = 0; i < word.length; i++) {
      const r = row + dir.dr * i;
      const c = col + dir.dc * i;
      grid[r][c] = word[i];
      positions.push({ row: r, col: c });
    }
    solutions.push({ word, positions });
  };
  
  // Place each word
  for (const word of words) {
    let placed = false;
    let attempts = 0;
    const maxAttempts = 100;
    
    while (!placed && attempts < maxAttempts) {
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);
      
      if (canPlaceWord(word, row, col, dir)) {
        placeWord(word, row, col, dir);
        placed = true;
      }
      attempts++;
    }
  }
  
  // Fill empty cells with random letters
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === null) {
        grid[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
    }
  }
  
  return { grid, solutions };
};

// Avatar customization options using Dicebear big-smile style
// Based on official documentation: https://www.dicebear.com/styles/big-smile/
function WordGame() {
  // Load saved state from localStorage
  const loadSavedState = () => {
    try {
      const saved = localStorage.getItem('wordGameState');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading saved state:', error);
    }
    return null;
  };

  const savedState = loadSavedState();

  // Game state
  const [activeGame, setActiveGame] = useState(savedState?.activeGame || 'spelling');
  
  // Points system
  const [points, setPoints] = useState(savedState?.points || 0);
  const [spellingPoints, setSpellingPoints] = useState(savedState?.spellingPoints || 0);
  const [wordSearchPoints, setWordSearchPoints] = useState(savedState?.wordSearchPoints || 0);
  const [wordlePoints, setWordlePoints] = useState(savedState?.wordlePoints || 0);
  const [showPointsAnimation, setShowPointsAnimation] = useState(false);
  const [animatedPoints, setAnimatedPoints] = useState(0);
  
  // Unlockables state
  const [unlockedThemes, setUnlockedThemes] = useState(savedState?.unlockedThemes || ['space', 'ocean', 'forest']); // Starting themes
  const [unlockedSpellingBee, setUnlockedSpellingBee] = useState(savedState?.unlockedSpellingBee || [0, 1, 2]); // Starting puzzles (indices)
  const [unlockedVisualThemes, setUnlockedVisualThemes] = useState(savedState?.unlockedVisualThemes || ['classic']); // Starting visual theme
  const [currentVisualTheme, setCurrentVisualTheme] = useState(savedState?.currentVisualTheme || 'classic');
  const [badges, setBadges] = useState(savedState?.badges || ['first-word', 'getting-started']); // Starting badges
  const [unlockedAnimations, setUnlockedAnimations] = useState(savedState?.unlockedAnimations || ['basic-sparkle']); // Starting animation
  const [currentAnimation, setCurrentAnimation] = useState(savedState?.currentAnimation || 'basic-sparkle');
  const [totalWordsFound, setTotalWordsFound] = useState(savedState?.totalWordsFound || 0);
  const [gamesCompleted, setGamesCompleted] = useState(savedState?.gamesCompleted || { spelling: 0, wordsearch: 0, wordle: 0 });
  const [wordleWins, setWordleWins] = useState(savedState?.wordleWins || 0);
  const [wordleStreak, setWordleStreak] = useState(savedState?.wordleStreak || 0);
  
  // Badge notification
  const [showBadgeNotification, setShowBadgeNotification] = useState(false);
  const [newBadge, setNewBadge] = useState(null);
  const [badgeTooltip, setBadgeTooltip] = useState(null);
  
  // Spelling Bee state - start with random puzzle if no saved state
  const [puzzle, setPuzzle] = useState(savedState?.puzzle || generateSpellingBeePuzzle());
  const [currentWord, setCurrentWord] = useState('');
  const [foundWords, setFoundWords] = useState(savedState?.foundWords || []);
  const [message, setMessage] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  
  // Word Search state - start with random puzzle if no saved state
  const [wordSearchPuzzle, setWordSearchPuzzle] = useState(savedState?.wordSearchPuzzle || generateWordSearchPuzzle(savedState?.unlockedThemes || ['space', 'ocean', 'forest']));
  const [wsFoundWords, setWsFoundWords] = useState(savedState?.wsFoundWords || []);
  const [wsSelectedCells, setWsSelectedCells] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  
  // Wordle state
  // Comprehensive kid-friendly 4-letter word bank (500+ words)
  const WORDLE_WORDS = [
    // Shuffled word list for unpredictable daily puzzles
    'FADE', 'OPEN', 'RAKE', 'DAMP', 'TEAS', 'WINS', 'LOAF', 'BOOM', 'TWIG', 'VAIN',
    'WELT', 'WHIZ', 'LANE', 'VETO', 'TIED', 'TEEN', 'TIDY', 'HEAL', 'SOON', 'SOWN',
    'TING', 'TENT', 'PLOT', 'BEAT', 'WAND', 'BOYS', 'FORD', 'BUSY', 'FALL', 'CART',
    'HURT', 'CUTE', 'LINE', 'OBOE', 'LIST', 'PUNS', 'MACE', 'TIME', 'RARE', 'SIGH',
    'EASE', 'LUNG', 'RULE', 'CARE', 'FILL', 'LARK', 'JADE', 'RAID', 'REAL', 'EVER',
    'STAY', 'TONS', 'PORE', 'TEND', 'RANK', 'PEST', 'DOTS', 'PURE', 'EXIT', 'PLUG',
    'LINK', 'FUEL', 'BEST', 'SPAM', 'TIER', 'WAFT', 'CUBE', 'CAPE', 'YOKE', 'RAIL',
    'MAIL', 'LOUD', 'VEER', 'PILE', 'WAKE', 'MENU', 'ONLY', 'KISS', 'TIPS', 'HOOD',
    'PLOW', 'SPIN', 'SILK', 'BALL', 'MINK', 'PORK', 'VASE', 'RUDE', 'WILL', 'WISH',
    'TORN', 'TANG', 'SHIN', 'GEAR', 'WARM', 'TUBS', 'TILL', 'LEAF', 'UPON', 'TOWN',
    'HEEL', 'SLOW', 'CORK', 'LILY', 'TURN', 'WARP', 'WARD', 'CHAT', 'LIME', 'CLUB',
    'SOOT', 'BLUE', 'TACK', 'OWNS', 'VAST', 'SOCK', 'BULK', 'NEED', 'PICK', 'NOON',
    'SONG', 'SUCH', 'SICK', 'TUTU', 'DIAL', 'RUTS', 'SLID', 'ROAD', 'BOAT', 'OAKS',
    'TENS', 'VEIL', 'HELD', 'LOOT', 'YAWN', 'KNOT', 'LOSE', 'OPAL', 'PRUNE', 'DEEP',
    'HUNK', 'DOOR', 'NEON', 'LAST', 'FEED', 'VEAL', 'SLAM', 'ROTS', 'STAR', 'WAXY',
    'ROAM', 'COAT', 'GATE', 'WOLF', 'TONE', 'MEOW', 'QUIT', 'CASE', 'WAIT', 'RISK',
    'SETS', 'NEWS', 'HAZY', 'HIRE', 'COMB', 'SOLD', 'PLAN', 'YANK', 'GREY', 'FROG',
    'LENT', 'DEER', 'PINK', 'TUNE', 'TRAP', 'TORE', 'RICE', 'HERD', 'RIGS', 'LOTS',
    'THEY', 'COAL', 'REAP', 'FAST', 'CAVE', 'SLUM', 'RUNG', 'LOVE', 'PIER', 'EDIT',
    'KNIT', 'NINE', 'HOSE', 'COOK', 'QUIZ', 'DOES', 'IDEA', 'NECK', 'CHEF', 'REND',
    'STAB', 'FAIR', 'SAGO', 'FORM', 'KALE', 'BOSS', 'CLAP', 'LEAP', 'VENT', 'TOGA',
    'PINE', 'SOUL', 'LEMON', 'GOOD', 'FIRE', 'WHOM', 'EVEN', 'BIKE', 'PECK', 'LORD',
    'BEND', 'GAP', 'BORN', 'TIDE', 'GOAL', 'LONG', 'TOOT', 'HOST', 'TONG', 'NULL',
    'WEBS', 'DOSE', 'TINE', 'WHIM', 'WERE', 'WORN', 'SHOW', 'KEEP', 'LESS', 'SIRE',
    'NUMB', 'MODE', 'HABIT', 'TAME', 'TANS', 'HEAT', 'RIND', 'VIEW', 'PARE', 'SNUG',
    'POPE', 'SAIL', 'OWES', 'WARS', 'WIRE', 'FLEW', 'DOLL', 'PANE', 'SWIM', 'PACT',
    'EDGE', 'POUR', 'KIND', 'RAVE', 'ROOK', 'ROVE', 'USED', 'SAYS', 'DAWN', 'NOOK',
    'NOSE', 'TRIO', 'HOOK', 'LAMB', 'REED', 'MOW', 'NEWT', 'GLAD', 'FIRM', 'PULP',
    'VOWS', 'WARN', 'TUFT', 'LOOP', 'YELP', 'DIVE', 'PEAR', 'SLUG', 'SALT', 'GRAY',
    'HARP', 'TWIN', 'LIKE', 'INTO', 'ROPE', 'POEM', 'THEN', 'CAME', 'DATE', 'HELP',
    'SLEW', 'HOPE', 'EAST', 'STEM', 'LAKE', 'DULL', 'REEF', 'MARK', 'MOAN', 'MAST',
    'SHAM', 'QUAY', 'THIN', 'SWAM', 'SOBS', 'RAMP', 'SOAK', 'GRUB', 'WITH', 'PEAT',
    'MALE', 'CAMP', 'DRAG', 'SKIN', 'SANK', 'LEFT', 'MINT', 'LOST', 'HANG', 'POOR',
    'SILL', 'EACH', 'PUPA', 'CURB', 'SNAP', 'NAPE', 'VERY', 'KEYS', 'FLIP', 'GOAT',
    'YEAH', 'PAWS', 'PINT', 'BANK', 'FINE', 'TREE', 'HEAP', 'LUCK', 'WONT', 'POLL',
    'MAXI', 'HILL', 'FISH', 'THAN', 'HOWL', 'YOLK', 'SAID', 'WHEN', 'FAIL', 'NAIL',
    'ROWS', 'PACE', 'SLIP', 'PROW', 'ROLE', 'CAFE', 'DECK', 'RIFT', 'ROAR', 'FOOT',
    'THAT', 'SWAB', 'VANS', 'MEAL', 'HUNT', 'WORM', 'RUST', 'SILT', 'MALT', 'LENS',
    'LINT', 'JEEP', 'CRAB', 'FOLD', 'WAVE', 'RAMS', 'NETS', 'PUFF', 'MOSS', 'SLAW',
    'MUST', 'SUMO', 'CLAY', 'SIZE', 'WHAT', 'POND', 'MYTH', 'SURF', 'DRAW', 'TOMB',
    'LOAD', 'BITE', 'WICK', 'WEED', 'BUMP', 'KIWI', 'SHUT', 'FIVE', 'BOOK', 'NUDE',
    'LIPS', 'RODE', 'OATH', 'NOVA', 'DROP', 'SLIM', 'MOTH', 'WING', 'MASH', 'LOCK',
    'YARD', 'SEEM', 'GRID', 'TWOS', 'FELL', 'MUSE', 'ROOT', 'SASH', 'WINE', 'GROW',
    'SKIP', 'TAPE', 'SHED', 'SWAY', 'MELT', 'PUSH', 'SODA', 'SNIP', 'POOL', 'WRAP',
    'ROOM', 'WORD', 'THAW', 'GUST', 'PLAY', 'COZY', 'LICE', 'FUSS', 'RAGE', 'STUN',
    'LADY', 'FILM', 'WEAK', 'BELL', 'TEAL', 'GOLD', 'EARN', 'SOAR', 'TOIL', 'DISH',
    'STEP', 'TOLD', 'WHIP', 'HONE', 'LIMB', 'THOU', 'HIVE', 'GIFT', 'MASS', 'TASK',
    'WAIL', 'NEAR', 'LIVE', 'SALE', 'PAIL', 'VICE', 'SEED', 'RUNT', 'HUNG', 'ROUT',
    'ORCA', 'MEET', 'BEAN', 'LAWN', 'IDLE', 'PRAY', 'MOLE', 'PUTS', 'TIES', 'MASK',
    'SPEC', 'BOTH', 'SOUP', 'GULF', 'HOLE', 'TINY', 'RUMP', 'GAVE', 'USES', 'WASH',
    'GLOW', 'SPUR', 'WENT', 'SOWN', 'MEAN', 'TRAM', 'WIFE', 'LUMP', 'YELL', 'DINE',
    'CELL', 'HOUR', 'CRIB', 'VIBE', 'PIES', 'HERE', 'REEL', 'UGLY', 'PUPA', 'ALTO',
    'HALL', 'WISE', 'DOME', 'VISE', 'STIR', 'DRIP', 'LUSH', 'GRIP', 'COLT', 'SOME',
    'TEAR', 'WORK', 'TOFU', 'CART', 'BATH', 'YOYO', 'LIFE', 'KITE', 'STOP', 'FAWN',
    'ALSO', 'VETO', 'GRIN', 'OBEY', 'HAZE', 'ARCH', 'BEDS', 'BREW', 'RING', 'UNDO',
    'IRON', 'HACK', 'TRAY', 'NAPE', 'MANY', 'ORAL', 'JUST', 'FORT', 'CONE', 'MOVE',
    'CALM', 'ZEAL', 'TAXI', 'RATS', 'WILD', 'PROP', 'DUTY', 'PONY', 'ANTS', 'ZONE',
    'VOID', 'ABLE', 'KEPT', 'EXAM', 'WAKE', 'JUNK', 'MEEK', 'WORE', 'KNEW', 'WOVE',
    'SING', 'URGE', 'POLO', 'MEMO', 'DUSK', 'CUTE', 'TUBS', 'THEM', 'PANS', 'DATA',
    'ROBE', 'SEEK', 'FELT', 'SELF', 'JOLT', 'BARN', 'LOFT', 'SCAR', 'TOMB', 'RASH',
    'WREN', 'HOOF', 'FOUL', 'VAST', 'DOGS', 'KEYS', 'VARY', 'TREK', 'LOON', 'TWIN',
    'BUDS', 'TRIM', 'YANK', 'MEND', 'BULK', 'FARM', 'YOGA', 'RUST', 'RIPE', 'FOWL',
    'LAME', 'TROT', 'PIER', 'MUTE', 'NOUN', 'EASE', 'YOKE', 'KICK', 'FOIL', 'PATH',
    'YEAR', 'VERY', 'THIS', 'ROBE', 'FAKE', 'PRIM', 'ALTO', 'GRIM', 'PORK', 'OPTS',
    'ITEM', 'WARY', 'INCH', 'ROSY', 'BASE', 'OARS', 'CANE', 'SKIM', 'RAVE', 'WAKE',
    'OMEN', 'SODA', 'YAWN', 'RICE', 'KALE', 'COST', 'SEND', 'WORE', 'DOCK', 'RITE',
    'CORK', 'VANS', 'ZERO', 'TOWN', 'TEAM', 'COLT', 'ZOOM', 'YOLK', 'HIKE', 'WELT',
    'BARN', 'LACY', 'ROMP', 'COPY', 'LARK', 'TAME', 'SPED', 'JAWS', 'SOLO', 'FUME',
    'HOME', 'SWAT', 'POSE', 'GLUE', 'WAND', 'SLAT', 'TINT', 'BREW', 'YARN', 'TOLL',
    'DAWN', 'DENT', 'CAPE', 'SUNK', 'FIST', 'YUCK', 'GAME', 'HORN', 'MIST', 'NONE',
    'PEER', 'CASH', 'GRAM', 'COIL', 'NOON', 'IDEA', 'ABLE', 'TENT', 'TOYS', 'TOLD',
    'PECK', 'KEPT', 'OBOE', 'TOUR', 'HERD', 'TUNA', 'SHIN', 'TRIO', 'FUSE', 'YOUR',
    'KEEN', 'LOOP', 'MAID', 'WHIM', 'ZEST', 'CAGE', 'LIME', 'FOLK', 'MARS', 'MAZE',
    'LOOT', 'BAND', 'ARCH', 'PEAS', 'TACK', 'WIGS', 'DICE', 'WOOL', 'SUDS', 'PREY',
    'CURL', 'GUST', 'DRUM', 'TEST', 'RAMP', 'NUMB', 'WILD', 'TOIL', 'MAMA', 'BULB',
    'MOLD', 'INTO', 'GOWN', 'SILO', 'MILD', 'CONE', 'GRIM', 'MOLE', 'OPAL', 'DIME',
    'KELP', 'BOLT', 'WEED', 'TEMP', 'CREW', 'LURE', 'ROBE', 'TOMB', 'LASH', 'HOOP',
    'WHIZ', 'ZERO', 'UNDO', 'FELT', 'RUIN', 'PAPA', 'FLEW', 'ZONE', 'YOUR', 'YAWN'
  ];

  
  // Mode state
  const [wordleMode, setWordleMode] = useState(savedState?.wordleMode || 'daily'); // 'daily' | 'practice'
  
  // Daily puzzle state
  const [dailyPuzzleNumber, setDailyPuzzleNumber] = useState(savedState?.dailyPuzzleNumber || 0);
  const [dailyCompleted, setDailyCompleted] = useState(savedState?.dailyCompleted || false);
  const [dailyStreak, setDailyStreak] = useState(savedState?.dailyStreak || 0);
  const [dailyMaxStreak, setDailyMaxStreak] = useState(savedState?.dailyMaxStreak || 0);
  const [dailyWins, setDailyWins] = useState(savedState?.dailyWins || 0);
  const [dailyGamesPlayed, setDailyGamesPlayed] = useState(savedState?.dailyGamesPlayed || 0);
  const [lastDailyDate, setLastDailyDate] = useState(savedState?.lastDailyDate || '');
  
  // Practice stats (separate from daily)
  const [practiceWins, setPracticeWins] = useState(savedState?.practiceWins || 0);
  const [practiceGamesPlayed, setPracticeGamesPlayed] = useState(savedState?.practiceGamesPlayed || 0);
  
  // Current Wordle game state (used by both modes)
  // Current Wordle game state (used by both modes)
  const [wordleTarget, setWordleTarget] = useState('');
  const [wordleGuesses, setWordleGuesses] = useState(savedState?.wordleGuesses || []);
  const [wordleCurrentGuess, setWordleCurrentGuess] = useState('');
  const [wordleGameOver, setWordleGameOver] = useState(savedState?.wordleGameOver || false);
  const [wordleWon, setWordleWon] = useState(savedState?.wordleWon || false);
  const [wordleError, setWordleError] = useState('');
  
  // Initialize daily puzzle on mount
  useEffect(() => {
    const initializeDailyPuzzle = () => {
      const EPOCH = new Date('2026-01-10');
      EPOCH.setHours(0, 0, 0, 0);
      
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      
      const daysSinceEpoch = Math.floor((now - EPOCH) / (1000 * 60 * 60 * 24));
      const puzzleNum = daysSinceEpoch + 1;
      const todayWord = WORDLE_WORDS[daysSinceEpoch % WORDLE_WORDS.length];
      const todayDate = now.toDateString();
      
      setDailyPuzzleNumber(puzzleNum);
      
      // Check if it's a new day
      if (lastDailyDate !== todayDate) {
        // New day - reset daily completed status
        if (lastDailyDate) {
          // Check streak
          const lastDate = new Date(lastDailyDate);
          lastDate.setHours(0, 0, 0, 0);
          const daysDiff = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
          
          if (daysDiff === 1) {
            // Consecutive day - maintain streak (will increment on win)
          } else if (daysDiff > 1) {
            // Missed day(s) - break streak
            setDailyStreak(0);
          }
        }
        
        setDailyCompleted(false);
        setLastDailyDate(todayDate);
        
        // If in daily mode, set up the new puzzle
        if (wordleMode === 'daily' || !savedState) {
          setWordleTarget(todayWord);
          setWordleGuesses([]);
          setWordleCurrentGuess('');
          setWordleGameOver(false);
          setWordleWon(false);
        }
      } else {
        // Same day
        if (wordleMode === 'daily' && !wordleTarget) {
          setWordleTarget(todayWord);
        }
      }
      
      // If in practice mode and no target, generate one
      if (wordleMode === 'practice' && !wordleTarget) {
        setWordleTarget(WORDLE_WORDS[Math.floor(Math.random() * WORDLE_WORDS.length)]);
      }
    };
    
    initializeDailyPuzzle();
  }, []);
  
  // Save state to localStorage whenever it changes
  useEffect(() => {
    const stateToSave = {
      activeGame,
      points,
      spellingPoints,
      wordSearchPoints,
      wordlePoints,
      unlockedThemes,
      unlockedSpellingBee,
      unlockedVisualThemes,
      currentVisualTheme,
      badges,
      unlockedAnimations,
      currentAnimation,
      totalWordsFound,
      gamesCompleted,
      wordleWins,
      wordleStreak,
      puzzle,
      foundWords,
      wordSearchPuzzle,
      wsFoundWords,
      wordleMode,
      dailyPuzzleNumber,
      dailyCompleted,
      dailyStreak,
      dailyMaxStreak,
      dailyWins,
      dailyGamesPlayed,
      lastDailyDate,
      practiceWins,
      practiceGamesPlayed,
      wordleTarget,
      wordleGuesses,
      wordleGameOver,
      wordleWon
    };
    
    try {
      localStorage.setItem('wordGameState', JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Error saving state:', error);
    }
  }, [activeGame, points, spellingPoints, wordSearchPoints, wordlePoints, unlockedThemes, unlockedSpellingBee, unlockedVisualThemes, 
      currentVisualTheme, badges, unlockedAnimations, currentAnimation, totalWordsFound, 
      gamesCompleted, wordleWins, wordleStreak, puzzle, foundWords, wordSearchPuzzle, wsFoundWords, 
      wordleMode, dailyPuzzleNumber, dailyCompleted, dailyStreak, dailyMaxStreak, dailyWins, 
      dailyGamesPlayed, lastDailyDate, practiceWins, practiceGamesPlayed,
      wordleTarget, wordleGuesses, wordleGameOver, wordleWon]);
  
  // Kid-friendly, clean, cohesive color scheme
  // Define all color themes
  const COLOR_THEMES = {
    classic: {
      primary: '#6366F1',      // Indigo
      secondary: '#EC4899',    // Pink
      accent: '#F59E0B',       // Amber
      success: '#10B981',      // Emerald
      error: '#EF4444',        // Red
      background: '#F8FAFC',   // Slate
      surface: '#FFFFFF',      // White
      text: '#1E293B',         // Slate
      textLight: '#64748B'     // Slate
    },
    ocean: {
      primary: '#0EA5E9',      // Sky Blue
      secondary: '#06B6D4',    // Cyan
      accent: '#14B8A6',       // Teal
      success: '#10B981',      
      error: '#EF4444',        
      background: '#F0F9FF',   // Light Blue
      surface: '#FFFFFF',      
      text: '#0C4A6E',         // Deep Blue
      textLight: '#0369A1'     
    },
    forest: {
      primary: '#10B981',      // Emerald
      secondary: '#84CC16',    // Lime
      accent: '#22C55E',       // Green
      success: '#059669',      
      error: '#EF4444',        
      background: '#F0FDF4',   // Light Green
      surface: '#FFFFFF',      
      text: '#14532D',         // Deep Green
      textLight: '#15803D'     
    },
    sunset: {
      primary: '#F97316',      // Orange
      secondary: '#FB923C',    // Light Orange
      accent: '#FBBF24',       // Amber
      success: '#10B981',      
      error: '#EF4444',        
      background: '#FFF7ED',   // Cream
      surface: '#FFFFFF',      
      text: '#7C2D12',         // Deep Orange
      textLight: '#C2410C'     
    },
    purple: {
      primary: '#A855F7',      // Purple
      secondary: '#C084FC',    // Light Purple
      accent: '#E879F9',       // Fuchsia
      success: '#10B981',      
      error: '#EF4444',        
      background: '#FAF5FF',   // Lavender
      surface: '#FFFFFF',      
      text: '#581C87',         // Deep Purple
      textLight: '#7E22CE'     
    },
    candy: {
      primary: '#EC4899',      // Hot Pink
      secondary: '#F472B6',    // Pink
      accent: '#FB7185',       // Rose
      success: '#10B981',      
      error: '#EF4444',        
      background: '#FDF2F8',   // Light Pink
      surface: '#FFFFFF',      
      text: '#831843',         // Deep Pink
      textLight: '#BE185D'     
    },
    night: {
      primary: '#3B82F6',      // Blue
      secondary: '#6366F1',    // Indigo
      accent: '#8B5CF6',       // Violet
      success: '#10B981',      
      error: '#EF4444',        
      background: '#EEF2FF',   // Pale Blue
      surface: '#FFFFFF',      
      text: '#1E3A8A',         // Deep Blue
      textLight: '#3730A3'     
    },
    sunshine: {
      primary: '#FBBF24',      // Yellow
      secondary: '#FCD34D',    // Light Yellow
      accent: '#F59E0B',       // Amber
      success: '#10B981',      
      error: '#EF4444',        
      background: '#FFFBEB',   // Cream Yellow
      surface: '#FFFFFF',      
      text: '#78350F',         // Deep Amber
      textLight: '#B45309'     
    },
    cherry: {
      primary: '#F472B6',      // Pink
      secondary: '#FBCFE8',    // Light Pink
      accent: '#FDA4AF',       // Rose
      success: '#10B981',      
      error: '#EF4444',        
      background: '#FFF1F2',   // Blush
      surface: '#FFFFFF',      
      text: '#881337',         // Deep Rose
      textLight: '#BE123C'     
    },
    mint: {
      primary: '#34D399',      // Mint
      secondary: '#6EE7B7',    // Light Mint
      accent: '#10B981',       // Green
      success: '#059669',      
      error: '#EF4444',        
      background: '#ECFDF5',   // Pale Mint
      surface: '#FFFFFF',      
      text: '#064E3B',         // Deep Green
      textLight: '#047857'     
    },
    rainbow: {
      primary: '#F59E0B',      // Amber
      secondary: '#EC4899',    // Pink
      accent: '#8B5CF6',       // Violet
      success: '#10B981',      
      error: '#EF4444',        
      background: '#FEFCE8',   // Light Yellow
      surface: '#FFFFFF',      
      text: '#78350F',         // Deep Amber
      textLight: '#B45309'     
    },
    kpop: {
      primary: '#14B8A6',      // Teal
      secondary: '#10B981',    // Green
      accent: '#EC4899',       // Pink
      success: '#10B981',      
      error: '#EF4444',        
      background: '#F0FDFA',   // Light Teal
      surface: '#FFFFFF',      
      text: '#134E4A',         // Deep Teal
      textLight: '#0F766E'     
    }
  };

  // Get current colors based on selected theme
  const colors = COLOR_THEMES[currentVisualTheme] || COLOR_THEMES.classic;

  // Award points with animation
  const awardPoints = (amount, gameType = null) => {
    const newPoints = points + amount;
    setPoints(newPoints);
    setAnimatedPoints(amount);
    setShowPointsAnimation(true);
    setTimeout(() => setShowPointsAnimation(false), 1500);
    
    // Track per-game points
    if (gameType === 'spelling') {
      setSpellingPoints(prev => prev + amount);
    } else if (gameType === 'wordsearch') {
      setWordSearchPoints(prev => prev + amount);
    } else if (gameType === 'wordle') {
      setWordlePoints(prev => prev + amount);
    }
    
    // Check point milestone badges
    if (newPoints >= 250 && !badges.includes('rising-star')) {
      setTimeout(() => awardBadge('rising-star', 'Rising Star', '🌟'), 1600);
    }
    if (newPoints >= 500 && !badges.includes('point-collector')) {
      setTimeout(() => awardBadge('point-collector', 'Point Collector', '💰'), 1600);
    }
    if (newPoints >= 750 && !badges.includes('point-master')) {
      setTimeout(() => awardBadge('point-master', 'Point Master', '💎'), 1600);
    }
  };

  // Award badge with flyover notification
  const awardBadge = (badgeId, badgeName, badgeIcon) => {
    if (!badges.includes(badgeId)) {
      setBadges(prev => [...prev, badgeId]);
      setNewBadge({ id: badgeId, name: badgeName, icon: badgeIcon });
      setShowBadgeNotification(true);
      setTimeout(() => setShowBadgeNotification(false), 3000);
    }
  };

  // Calculate points based on word length
  const calculatePoints = (wordLength) => {
    if (wordLength <= 4) return 10;
    if (wordLength <= 6) return 20;
    return 30;
  };

  const handleSubmit = async () => {
    if (currentWord.length < 3) {
      setMessage('Words must be at least 3 letters!');
      setTimeout(() => {
        setMessage('');
        setCurrentWord('');
      }, 2000);
      return;
    }

    const upperWord = currentWord.toUpperCase();
    
    if (!upperWord.includes(puzzle.center)) {
      setMessage(`Must include ${puzzle.center}!`);
      setTimeout(() => {
        setMessage('');
        setCurrentWord('');
      }, 2000);
      return;
    }

    if (foundWords.includes(upperWord)) {
      setMessage('Already found!');
      setTimeout(() => {
        setMessage('');
        setCurrentWord('');
      }, 2000);
      return;
    }

    for (let char of upperWord) {
      if (!puzzle.letters.includes(char)) {
        setMessage('Use only the given letters!');
        setTimeout(() => {
          setMessage('');
          setCurrentWord('');
        }, 2000);
        return;
      }
    }

    setIsValidating(true);
    setMessage('Checking...');

    const isValid = await isValidWord(upperWord);

    setIsValidating(false);

    if (isValid) {
      const newFoundWords = [...foundWords, upperWord].sort();
      setFoundWords(newFoundWords);
      const earnedPoints = calculatePoints(upperWord.length);
      awardPoints(earnedPoints, 'spelling');
      setCurrentWord(''); // Clear immediately to prevent lag
      setMessage(''); // No message, rely on animation
      
      // Track total words and check badges
      setTotalWordsFound(prev => prev + 1);
      const newTotal = totalWordsFound + 1;
      
      // Badge checks
      if (newTotal === 25) awardBadge('word-finder', 'Word Finder', '🔍');
      if (newTotal === 50) awardBadge('word-hunter', 'Word Hunter', '🎪');
      if (newTotal === 100) awardBadge('word-master', 'Word Master', '👑');
      if (newTotal === 200) awardBadge('word-champion', 'Word Champion', '🏆');
      if (newTotal === 300) awardBadge('word-legend', 'Word Legend', '⭐');
      if (upperWord.length >= 7) awardBadge('spelling-master', 'Spelling Master', '📝');
      if (newFoundWords.length >= 5) awardBadge('quick-thinker', 'Quick Thinker', '⚡');
      
      // Point-based badges
      const currentPoints = points + earnedPoints;
      if (currentPoints >= 1000 && !badges.includes('point-king')) {
        setTimeout(() => awardBadge('point-king', 'Point King', '👑'), 100);
      }
      if (currentPoints >= 2500 && !badges.includes('mega-collector')) {
        setTimeout(() => awardBadge('mega-collector', 'Mega Collector', '💰'), 100);
      }
    } else {
      setMessage('Not in word list');
      setTimeout(() => {
        setMessage('');
        setCurrentWord('');
      }, 1500); // Reduced from 2000ms
    }
  };

  const shuffleLetters = () => {
    const nonCenter = puzzle.letters.filter(l => l !== puzzle.center);
    const shuffled = nonCenter.sort(() => Math.random() - 0.5);
    setPuzzle({ ...puzzle, letters: [...shuffled, puzzle.center] });
  };

  const newGame = () => {
    setPuzzle(generateSpellingBeePuzzle());
    setCurrentWord('');
    setFoundWords([]);
    setMessage('');
    
    // Track game completion
    const newGamesCompleted = (gamesCompleted.spelling || 0) + 1;
    setGamesCompleted(prev => ({ ...prev, spelling: newGamesCompleted }));
    
    // Award bee badges
    if (newGamesCompleted === 5 && !badges.includes('bee-novice')) {
      setTimeout(() => awardBadge('bee-novice', 'Bee Novice', '🐝'), 100);
    }
    if (newGamesCompleted === 10 && !badges.includes('bee-expert')) {
      setTimeout(() => awardBadge('bee-expert', 'Bee Expert', '🐝'), 100);
    }
    if (newGamesCompleted === 25 && !badges.includes('bee-champion')) {
      setTimeout(() => awardBadge('bee-champion', 'Bee Champion', '🥇'), 100);
    }
    
    // Check combo-master (played all 3 games)
    const updatedCompleted = { ...gamesCompleted, spelling: newGamesCompleted };
    if (updatedCompleted.spelling >= 1 && updatedCompleted.wordsearch >= 1 && updatedCompleted.wordle >= 1 && !badges.includes('combo-master')) {
      setTimeout(() => awardBadge('combo-master', 'Combo Master', '🎮'), 200);
    }
  };

  // Word Search functions
  const handleCellMouseDown = (row, col) => {
    setIsSelecting(true);
    
    // Check if this cell is already selected (tap mode)
    const alreadySelected = wsSelectedCells.some(cell => cell.row === row && cell.col === col);
    
    if (alreadySelected && wsSelectedCells.length > 0) {
      // Tapping an already selected cell - try to submit
      checkWordSearchSelection();
      setIsSelecting(false);
      setWsSelectedCells([]);
    } else {
      // Start new selection (works for both drag and tap)
      setWsSelectedCells([{ row, col }]);
    }
  };

  const handleCellMouseEnter = (row, col) => {
    if (!isSelecting || wsSelectedCells.length === 0) return;
    
    // Check if user is clicking again (tap mode) on adjacent cell
    const lastCell = wsSelectedCells[wsSelectedCells.length - 1];
    const isSameAsLast = lastCell.row === row && lastCell.col === col;
    
    if (isSameAsLast) return; // Already in selection
    
    const start = wsSelectedCells[0];
    const rowDiff = row - start.row;
    const colDiff = col - start.col;
    
    // Check if valid direction (horizontal, vertical, or diagonal)
    const isValidDirection = (
      (rowDiff === 0) || 
      (colDiff === 0) || 
      (Math.abs(rowDiff) === Math.abs(colDiff))
    );
    
    if (isValidDirection) {
      const newSelection = [];
      const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));
      const rowStep = steps === 0 ? 0 : rowDiff / steps;
      const colStep = steps === 0 ? 0 : colDiff / steps;
      
      for (let i = 0; i <= steps; i++) {
        newSelection.push({
          row: start.row + Math.round(rowStep * i),
          col: start.col + Math.round(colStep * i)
        });
      }
      
      setWsSelectedCells(newSelection);
    }
  };

  const handleCellMouseUp = () => {
    if (wsSelectedCells.length > 1) {
      // Only check if we have a multi-cell selection (drag mode)
      checkWordSearchSelection();
      setIsSelecting(false);
      setWsSelectedCells([]);
    } else if (wsSelectedCells.length === 1) {
      // Single cell selected - keep it for tap mode (don't clear)
      setIsSelecting(false);
    }
  };

  const handleTouchMove = (e) => {
    if (!isSelecting) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (element && element.dataset.row !== undefined) {
      const row = parseInt(element.dataset.row);
      const col = parseInt(element.dataset.col);
      handleCellMouseEnter(row, col);
    }
  };

  const checkWordSearchSelection = () => {
    const selectedWord = wsSelectedCells
      .map(cell => wordSearchPuzzle.grid[cell.row][cell.col])
      .join('');
    
    const reversedWord = selectedWord.split('').reverse().join('');
    
    for (const solution of wordSearchPuzzle.solutions) {
      if (solution.word === selectedWord || solution.word === reversedWord) {
        if (!wsFoundWords.includes(solution.word)) {
          const newWsFoundWords = [...wsFoundWords, solution.word].sort();
          setWsFoundWords(newWsFoundWords);
          const earnedPoints = calculatePoints(solution.word.length);
          awardPoints(earnedPoints, 'wordsearch');
          
          // Track total words
          setTotalWordsFound(prev => prev + 1);
          const newTotal = totalWordsFound + 1;
          
          // Word milestone badges
          if (newTotal === 25 && !badges.includes('word-finder')) {
            setTimeout(() => awardBadge('word-finder', 'Word Finder', '🔍'), 100);
          }
          if (newTotal === 50 && !badges.includes('word-hunter')) {
            setTimeout(() => awardBadge('word-hunter', 'Word Hunter', '🎪'), 100);
          }
          if (newTotal === 100 && !badges.includes('word-master')) {
            setTimeout(() => awardBadge('word-master', 'Word Master', '👑'), 100);
          }
          if (newTotal === 200 && !badges.includes('word-champion')) {
            setTimeout(() => awardBadge('word-champion', 'Word Champion', '🏆'), 100);
          }
          if (newTotal === 300 && !badges.includes('word-legend')) {
            setTimeout(() => awardBadge('word-legend', 'Word Legend', '⭐'), 100);
          }
          
          // Point-based badges
          const currentPoints = points + earnedPoints;
          if (currentPoints >= 1000 && !badges.includes('point-king')) {
            setTimeout(() => awardBadge('point-king', 'Point King', '👑'), 200);
          }
          if (currentPoints >= 2500 && !badges.includes('mega-collector')) {
            setTimeout(() => awardBadge('mega-collector', 'Mega Collector', '💰'), 200);
          }
          
          // Check if puzzle completed
          if (newWsFoundWords.length === wordSearchPuzzle.solutions.length) {
            awardBadge('perfect-game', 'Perfect Game', '💯');
          }
        }
        break;
      }
    }
  };

  const isCellSelected = (row, col) => {
    return wsSelectedCells.some(cell => cell.row === row && cell.col === col);
  };

  const isCellInSolution = (row, col) => {
    for (const solution of wordSearchPuzzle.solutions) {
      if (wsFoundWords.includes(solution.word)) {
        if (solution.positions.some(pos => pos.row === row && pos.col === col)) {
          return true;
        }
      }
    }
    return false;
  };

  const newWordSearch = () => {
    setWordSearchPuzzle(generateWordSearchPuzzle(unlockedThemes));
    setWsFoundWords([]);
    setWsSelectedCells([]);
    
    // Track game completion
    const newGamesCompleted = (gamesCompleted.wordsearch || 0) + 1;
    setGamesCompleted(prev => ({ ...prev, wordsearch: newGamesCompleted }));
    
    // Award search badges
    if (newGamesCompleted === 5 && !badges.includes('search-novice')) {
      setTimeout(() => awardBadge('search-novice', 'Search Novice', '🔎'), 100);
    }
    if (newGamesCompleted === 10 && !badges.includes('search-expert')) {
      setTimeout(() => awardBadge('search-expert', 'Search Expert', '🔍'), 100);
    }
    if (newGamesCompleted === 25 && !badges.includes('search-champion')) {
      setTimeout(() => awardBadge('search-champion', 'Search Champion', '🥈'), 100);
    }
    
    // Check combo-master (played all 3 games)
    const updatedCompleted = { ...gamesCompleted, wordsearch: newGamesCompleted };
    if (updatedCompleted.spelling >= 1 && updatedCompleted.wordsearch >= 1 && updatedCompleted.wordle >= 1 && !badges.includes('combo-master')) {
      setTimeout(() => awardBadge('combo-master', 'Combo Master', '🎮'), 200);
    }
  };

  // Wordle: Handle Key Press
  const handleWordleKey = async (key) => {
    if (wordleGameOver) return;
    
    if (key === 'ENTER') {
      if (wordleCurrentGuess.length === 4) {
        // Validate word using dictionary API
        const isValid = await isValidWord(wordleCurrentGuess);
        
        if (!isValid) {
          setWordleError('Not in word list');
          setTimeout(() => {
            setWordleError('');
            setWordleCurrentGuess('');
          }, 1000);
          return;
        }
        
        const newGuesses = [...wordleGuesses, wordleCurrentGuess];
        setWordleGuesses(newGuesses);
        
        if (wordleCurrentGuess === wordleTarget) {
          setWordleWon(true);
          setWordleGameOver(true);
          
          // Award points based on number of guesses: 50, 40, 30, 20, 10, 10
          let earnedPoints;
          switch(newGuesses.length) {
            case 1: earnedPoints = 50; break;
            case 2: earnedPoints = 40; break;
            case 3: earnedPoints = 30; break;
            case 4: earnedPoints = 20; break;
            case 5: 
            case 6: earnedPoints = 10; break;
            default: earnedPoints = 10;
          }
          
          awardPoints(earnedPoints, 'wordle');
          const newTotalWords = totalWordsFound + 1;
          setTotalWordsFound(newTotalWords);
          
          // Handle daily vs practice stats separately
          if (wordleMode === 'daily') {
            // Daily mode - update daily stats
            setDailyCompleted(true);
            const newDailyWins = dailyWins + 1;
            setDailyWins(newDailyWins);
            const newDailyGamesPlayed = dailyGamesPlayed + 1;
            setDailyGamesPlayed(newDailyGamesPlayed);
            const newDailyStreak = dailyStreak + 1;
            setDailyStreak(newDailyStreak);
            
            // Update max streak
            if (newDailyStreak > dailyMaxStreak) {
              setDailyMaxStreak(newDailyStreak);
            }
            
            // Daily-specific badges
            if (newDailyStreak === 5 && !badges.includes('perfect-streak')) {
              setTimeout(() => awardBadge('perfect-streak', 'Perfect Streak', '🔥'), 1600);
            }
            if (newDailyStreak === 10 && !badges.includes('unstoppable')) {
              setTimeout(() => awardBadge('unstoppable', 'Unstoppable', '🔥'), 1700);
            }
          } else {
            // Practice mode - update practice stats
            const newPracticeWins = practiceWins + 1;
            setPracticeWins(newPracticeWins);
            const newPracticeGamesPlayed = practiceGamesPlayed + 1;
            setPracticeGamesPlayed(newPracticeGamesPlayed);
          }
          
          // Update combined Wordle stats (for badges)
          const newWordleWins = wordleWins + 1;
          setWordleWins(newWordleWins);
          const newWordleStreak = wordleStreak + 1;
          setWordleStreak(newWordleStreak);
          
          // Wordle-specific badges
          if (newGuesses.length <= 2 && !badges.includes('speed-demon')) {
            setTimeout(() => awardBadge('speed-demon', 'Speed Demon', '⚡'), 1600);
          }
          if (newWordleWins === 1 && !badges.includes('wordle-rookie')) {
            setTimeout(() => awardBadge('wordle-rookie', 'Wordle Rookie', '🎲'), 1600);
          }
          if (newWordleWins === 5 && !badges.includes('wordle-ace')) {
            setTimeout(() => awardBadge('wordle-ace', 'Wordle Ace', '🎯'), 1600);
          }
          if (newWordleWins === 25 && !badges.includes('wordle-master')) {
            setTimeout(() => awardBadge('wordle-master', 'Wordle Master', '👑'), 1600);
          }
          
          // Check if word contains letter E
          if (wordleTarget.includes('E') && !badges.includes('e-badge')) {
            setTimeout(() => awardBadge('e-badge', 'E Badge', '🅴'), 1700);
          }
          
          // General word badges
          if (newTotalWords === 25 && !badges.includes('word-finder')) {
            setTimeout(() => awardBadge('word-finder', 'Word Finder', '🔍'), 1800);
          }
          if (newTotalWords === 50 && !badges.includes('word-hunter')) {
            setTimeout(() => awardBadge('word-hunter', 'Word Hunter', '🎪'), 1800);
          }
          if (newTotalWords === 100 && !badges.includes('word-master')) {
            setTimeout(() => awardBadge('word-master', 'Word Master', '👑'), 1800);
          }
          if (newTotalWords === 200 && !badges.includes('word-champion')) {
            setTimeout(() => awardBadge('word-champion', 'Word Champion', '🏆'), 1800);
          }
          
          // New gameplay badges
          if (newTotalWords === 300 && !badges.includes('word-legend')) {
            setTimeout(() => awardBadge('word-legend', 'Word Legend', '⭐'), 1900);
          }
          if (newWordleWins === 50 && !badges.includes('wordle-legend')) {
            setTimeout(() => awardBadge('wordle-legend', 'Wordle Legend', '🏅'), 1600);
          }
          
          // Point-based badges (check after awarding points)
          const currentPoints = points + earnedPoints;
          if (currentPoints >= 1000 && !badges.includes('point-king')) {
            setTimeout(() => awardBadge('point-king', 'Point King', '👑'), 1800);
          }
          if (currentPoints >= 2500 && !badges.includes('mega-collector')) {
            setTimeout(() => awardBadge('mega-collector', 'Mega Collector', '💰'), 1900);
          }
        } else if (newGuesses.length >= 6) {
          setWordleGameOver(true);
          
          // Handle loss differently for daily vs practice
          if (wordleMode === 'daily') {
            setDailyCompleted(true);
            const newDailyGamesPlayed = dailyGamesPlayed + 1;
            setDailyGamesPlayed(newDailyGamesPlayed);
            // Reset daily streak on loss
            setDailyStreak(0);
          } else {
            const newPracticeGamesPlayed = practiceGamesPlayed + 1;
            setPracticeGamesPlayed(newPracticeGamesPlayed);
          }
          
          // Reset combined streak on loss
          setWordleStreak(0);
        }
        
        setWordleCurrentGuess('');
      }
    } else if (key === 'BACK') {
      setWordleCurrentGuess(prev => prev.slice(0, -1));
    } else if (wordleCurrentGuess.length < 4) {
      setWordleCurrentGuess(prev => prev + key);
    }
  };

  // Wordle: Switch Mode
  const switchWordleMode = (mode) => {
    setWordleMode(mode);
    
    if (mode === 'daily') {
      // Switch to daily mode
      const EPOCH = new Date('2026-01-10');
      EPOCH.setHours(0, 0, 0, 0);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const daysSinceEpoch = Math.floor((now - EPOCH) / (1000 * 60 * 60 * 24));
      const dailyWord = WORDLE_WORDS[daysSinceEpoch % WORDLE_WORDS.length];
      
      if (!dailyCompleted) {
        setWordleTarget(dailyWord);
        setWordleGuesses([]);
        setWordleCurrentGuess('');
        setWordleGameOver(false);
        setWordleWon(false);
      }
    } else {
      // Switch to practice mode
      setWordleTarget(WORDLE_WORDS[Math.floor(Math.random() * WORDLE_WORDS.length)]);
      setWordleGuesses([]);
      setWordleCurrentGuess('');
      setWordleGameOver(false);
      setWordleWon(false);
    }
  };

  // Wordle: Share Results (Daily Only)
  const shareWordleResults = async () => {
    if (wordleMode !== 'daily' || !wordleGameOver) return;
    
    // Calculate guesses used
    const guessCount = wordleWon ? wordleGuesses.length : 'X';
    const title = `Puzzle Juniors #${dailyPuzzleNumber} ${guessCount}/6`;
    let grid = '';
    
    // Generate emoji grid
    for (const guess of wordleGuesses) {
      for (let i = 0; i < guess.length; i++) {
        const color = getWordleLetterColor(guess[i], i, guess);
        if (color === colors.success) grid += '🟩';
        else if (color === colors.accent) grid += '🟨';
        else grid += '⬜';
      }
      grid += '\n';
    }
    
    const shareText = `${title}\n\n${grid}\nPlay now at puzzlejuniors.com`;
    
    try {
      // Try to use native share sheet (iOS/Android)
      if (navigator.share) {
        await navigator.share({
          text: shareText
        });
      } else {
        // Fallback to clipboard for desktop
        await navigator.clipboard.writeText(shareText);
        alert('Results copied to clipboard!');
      }
    } catch (err) {
      // If share was cancelled or failed, try clipboard as fallback
      if (err.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(shareText);
          alert('Results copied to clipboard!');
        } catch (clipboardErr) {
          console.error('Failed to share:', err, clipboardErr);
        }
      }
    }
  };

  // Wordle: New Game (Practice Mode Only)
  const newWordle = () => {
    if (wordleMode !== 'practice') return;
    
    setWordleTarget(WORDLE_WORDS[Math.floor(Math.random() * WORDLE_WORDS.length)]);
    setWordleGuesses([]);
    setWordleCurrentGuess('');
    setWordleGameOver(false);
    setWordleWon(false);
    
    // Increment practice games
    const newGamesCompleted = gamesCompleted.wordle ? gamesCompleted.wordle + 1 : 1;
    setGamesCompleted(prev => ({ ...prev, wordle: newGamesCompleted }));
    
    // Check combo-master (played all 3 games)
    const updatedCompleted = { ...gamesCompleted, wordle: newGamesCompleted };
    if (updatedCompleted.spelling >= 1 && updatedCompleted.wordsearch >= 1 && updatedCompleted.wordle >= 1 && !badges.includes('combo-master')) {
      setTimeout(() => awardBadge('combo-master', 'Combo Master', '🎮'), 100);
    }
  };

  // Wordle: Get Letter Color (handles duplicate letters correctly)
  const getWordleLetterColor = (letter, index, guess) => {
    // Two-pass algorithm for correct duplicate letter handling
    
    // Create a pool of remaining letters from the target
    let remainingLetters = wordleTarget.split('');
    
    // Create a results array to store colors for each position
    const results = new Array(guess.length).fill(null);
    
    // PASS 1: Mark all exact matches (GREEN) and remove from pool
    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === wordleTarget[i]) {
        results[i] = 'green';
        // Remove this letter from the remaining pool
        const indexInRemaining = remainingLetters.indexOf(guess[i]);
        if (indexInRemaining !== -1) {
          remainingLetters.splice(indexInRemaining, 1);
        }
      }
    }
    
    // PASS 2: Mark partial matches (YELLOW) from remaining pool
    for (let i = 0; i < guess.length; i++) {
      // Skip if already marked green
      if (results[i] === 'green') continue;
      
      // Check if this letter exists in the remaining pool
      const indexInRemaining = remainingLetters.indexOf(guess[i]);
      if (indexInRemaining !== -1) {
        results[i] = 'yellow';
        // Remove this letter from the remaining pool
        remainingLetters.splice(indexInRemaining, 1);
      } else {
        results[i] = 'gray';
      }
    }
    
    // Return the color for the requested index
    if (results[index] === 'green') return colors.success;
    if (results[index] === 'yellow') return colors.accent;
    return colors.textLight;
  };

  // Wordle: Get keyboard key color based on all previous guesses
  const getKeyboardKeyColor = (key) => {
    if (!wordleGuesses.length) return colors.primary; // Default color if no guesses yet
    
    let keyState = 'unused'; // unused, wrong, present, correct
    
    // Check all previous guesses for this key using proper duplicate logic
    for (const guess of wordleGuesses) {
      // Use the same two-pass algorithm to get correct colors for this guess
      let remainingLetters = wordleTarget.split('');
      const results = new Array(guess.length).fill(null);
      
      // PASS 1: Mark exact matches
      for (let i = 0; i < guess.length; i++) {
        if (guess[i] === wordleTarget[i]) {
          results[i] = 'green';
          const indexInRemaining = remainingLetters.indexOf(guess[i]);
          if (indexInRemaining !== -1) {
            remainingLetters.splice(indexInRemaining, 1);
          }
        }
      }
      
      // PASS 2: Mark partial matches
      for (let i = 0; i < guess.length; i++) {
        if (results[i] === 'green') continue;
        const indexInRemaining = remainingLetters.indexOf(guess[i]);
        if (indexInRemaining !== -1) {
          results[i] = 'yellow';
          remainingLetters.splice(indexInRemaining, 1);
        } else {
          results[i] = 'gray';
        }
      }
      
      // Now check if this key appears in this guess and update keyState
      for (let i = 0; i < guess.length; i++) {
        if (guess[i] === key) {
          if (results[i] === 'green') {
            keyState = 'correct';
            break; // Correct is highest priority
          } else if (results[i] === 'yellow' && keyState !== 'correct') {
            keyState = 'present';
          } else if (results[i] === 'gray' && keyState === 'unused') {
            keyState = 'wrong';
          }
        }
      }
      
      if (keyState === 'correct') break; // No need to check other guesses
    }
    
    // Return color based on state
    switch(keyState) {
      case 'correct':
        return colors.success;
      case 'present':
        return colors.accent;
      case 'wrong':
        return colors.textLight;
      default:
        return colors.primary;
    }
  };

  // Hexagon button component - properly proportioned
  const HexButton = ({ letter, isCenter, onClick }) => (
    <button
      onClick={onClick}
      style={{
        width: '70px',
        height: '70px',
        background: isCenter ? colors.accent : colors.primary,
        border: 'none',
        borderRadius: '12px',
        color: 'white',
        fontSize: '28px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        boxShadow: isCenter 
          ? '0 4px 12px rgba(245, 158, 11, 0.3)'
          : '0 4px 12px rgba(99, 102, 241, 0.2)',
        touchAction: 'manipulation',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
      onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
      onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
      onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      {letter}
    </button>
  );

  // Helper function to handle letter clicks - clears invalid word messages
  const handleLetterClick = (letter) => {
    // If there's an error message (not success/checking), clear it and the word
    if (message && !message.includes('Great') && !message.includes('Checking')) {
      setMessage('');
      setCurrentWord(letter.toLowerCase());
    } else {
      setCurrentWord(currentWord + letter.toLowerCase());
    }
  };

  // Outer ring letters (6 letters)
  const outerLetters = puzzle.letters.filter(l => l !== puzzle.center);

  return (
    <>
      <style>{`
        @keyframes pointsPop {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -60%) scale(1.2);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -80%) scale(1);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes badgeFlyIn {
          0% {
            opacity: 0;
            transform: translateX(100%) scale(0.5);
          }
          20% {
            opacity: 1;
            transform: translateX(0) scale(1.2);
          }
          80% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateX(-100%) scale(0.8);
          }
        }
      `}</style>
      
      <div style={{
        minHeight: '100vh',
        background: colors.background,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        paddingBottom: '20px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header with Points and Game Mode Navigation */}
        <div style={{
          background: colors.surface,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          {/* Top Row: Title, New Game Button, and Points */}
          <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px'
          }}>
            <h1 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: colors.text,
              margin: 0
            }}>
              Puzzle Juniors
            </h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Dynamic New Game Button */}
              {activeGame !== 'store' && (
                <button
                  onClick={() => {
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
                  }}
                  style={{
                    padding: '8px 16px',
                    background: colors.primary,
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap'
                  }}
                >
                  New Game
                </button>
              )}
              
              {/* Points Display */}
              <div 
                onClick={() => setActiveGame('store')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: `linear-gradient(135deg, ${colors.accent}20, ${colors.accent}10)`,
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: `2px solid ${colors.accent}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <span style={{
                  fontSize: '20px'
                }}>⭐</span>
                <span style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: colors.accent
                }}>
                  {points}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Row: Game Mode Icon Buttons */}
          <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            display: 'flex',
            borderTop: `1px solid ${colors.background}`,
            padding: '8px 0'
          }}>
            {/* Spelling Bee Button */}
            <button
              onClick={() => setActiveGame('spelling')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderBottom: activeGame === 'spelling' ? `3px solid ${colors.primary}` : '3px solid transparent'
              }}
            >
              <img 
                src="/icons/spelling-bee.png" 
                alt="Spelling Bee" 
                style={{
                  width: '32px',
                  height: '32px',
                  objectFit: 'contain',
                  filter: activeGame === 'spelling' ? 'none' : 'grayscale(100%) opacity(40%)'
                }}
              />
            </button>

            {/* Word Search Button */}
            <button
              onClick={() => setActiveGame('wordsearch')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderBottom: activeGame === 'wordsearch' ? `3px solid ${colors.primary}` : '3px solid transparent'
              }}
            >
              <img 
                src="/icons/word-search.png" 
                alt="Word Search" 
                style={{
                  width: '32px',
                  height: '32px',
                  objectFit: 'contain',
                  filter: activeGame === 'wordsearch' ? 'none' : 'grayscale(100%) opacity(40%)'
                }}
              />
            </button>

            {/* Wordle Button */}
            <button
              onClick={() => setActiveGame('wordle')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderBottom: activeGame === 'wordle' ? `3px solid ${colors.primary}` : '3px solid transparent'
              }}
            >
              <img 
                src="/icons/wordle.png" 
                alt="Wordle" 
                style={{
                  width: '32px',
                  height: '32px',
                  objectFit: 'contain',
                  filter: activeGame === 'wordle' ? 'none' : 'grayscale(100%) opacity(40%)'
                }}
              />
            </button>

            {/* Rewards Button */}
            <button
              onClick={() => setActiveGame('store')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderBottom: activeGame === 'store' ? `3px solid ${colors.primary}` : '3px solid transparent'
              }}
            >
              <img 
                src="/icons/store.png" 
                alt="Rewards" 
                style={{
                  width: '32px',
                  height: '32px',
                  objectFit: 'contain',
                  filter: activeGame === 'store' ? 'none' : 'grayscale(100%) opacity(40%)'
                }}
              />
            </button>
          </div>
        </div>

        {/* Points Animation Popup */}
        {showPointsAnimation && (
          <div style={{
            position: 'fixed',
            top: activeGame === 'spelling' ? '180px' : '50%',
            left: '50%',
            transform: activeGame === 'spelling' 
              ? 'translateX(-50%)' 
              : 'translate(-50%, -50%)',
            fontSize: '56px',
            fontWeight: '700',
            color: colors.success,
            animation: 'pointsPop 1.5s ease-out',
            pointerEvents: 'none',
            zIndex: 1000,
            textShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}>
            +{animatedPoints}
          </div>
        )}

        {/* Badge Notification Flyover */}
        {showBadgeNotification && newBadge && (
          <div style={{
            position: 'fixed',
            top: '120px',
            right: '0',
            animation: 'badgeFlyIn 3s ease-out',
            pointerEvents: 'none',
            zIndex: 1001
          }}>
            <div style={{
              background: `linear-gradient(135deg, ${colors.accent}30, ${colors.accent}20)`,
              border: `3px solid ${colors.accent}`,
              borderRadius: '16px',
              padding: '20px 24px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              minWidth: '280px'
            }}>
              <div style={{
                fontSize: '48px',
                animation: 'pulse 1s ease-in-out infinite'
              }}>
                {newBadge.icon}
              </div>
              <div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: colors.accent,
                  marginBottom: '4px'
                }}>
                  Badge Unlocked!
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: colors.text
                }}>
                  {newBadge.name}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div style={{
          flex: 1,
          padding: '16px',
          maxWidth: '600px',
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box',
          overflowY: 'auto'
        }}>

      {/* Spelling Bee Game */}
      {activeGame === 'spelling' && (
        <>
      {/* Game Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '8px'
      }}>
        <h2 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: colors.textLight,
          margin: 0,
          padding: '4px 0'
        }}>
          Letter Puzzle
        </h2>
      </div>
      
      {/* Main Game */}
      <div style={{
        maxWidth: '420px',
        width: '100%',
        margin: '0 auto',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '20px'
      }}>
        {/* Message Display - Above word display */}
        {message && (
          <p style={{
            margin: '0 0 8px 0',
            color: message.includes('Great') || message.includes('Checking') 
              ? colors.success 
              : colors.error,
            fontWeight: '600',
            fontSize: '14px',
            minHeight: '20px'
          }}>
            {message}
          </p>
        )}
        
        {/* Current Word Display - Below message */}
        <div style={{
          fontSize: '32px',
          fontWeight: '600',
          color: currentWord ? colors.text : colors.textLight,
          letterSpacing: '0.08em',
          minHeight: '48px',
          marginBottom: '24px',
          textTransform: 'uppercase'
        }}>
          {currentWord || '\u00A0'}
        </div>

        {/* Hexagon Grid - NYT Style */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '24px',
          gap: '8px'
        }}>
          {/* Top row - 2 letters */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <HexButton 
              letter={outerLetters[0]} 
              isCenter={false}
              onClick={() => handleLetterClick(outerLetters[0])}
            />
            <HexButton 
              letter={outerLetters[1]} 
              isCenter={false}
              onClick={() => handleLetterClick(outerLetters[1])}
            />
          </div>
          
          {/* Middle row - 3 letters (left, center, right) */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <HexButton 
              letter={outerLetters[2]} 
              isCenter={false}
              onClick={() => handleLetterClick(outerLetters[2])}
            />
            <HexButton 
              letter={puzzle.center} 
              isCenter={true}
              onClick={() => handleLetterClick(puzzle.center)}
            />
            <HexButton 
              letter={outerLetters[3]} 
              isCenter={false}
              onClick={() => handleLetterClick(outerLetters[3])}
            />
          </div>
          
          {/* Bottom row - 2 letters */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <HexButton 
              letter={outerLetters[4]} 
              isCenter={false}
              onClick={() => handleLetterClick(outerLetters[4])}
            />
            <HexButton 
              letter={outerLetters[5]} 
              isCenter={false}
              onClick={() => handleLetterClick(outerLetters[5])}
            />
          </div>
        </div>

        {/* Three Button Controls */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '24px',
          width: '100%',
          maxWidth: '360px'
        }}>
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
              transition: 'all 0.15s ease'
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.97)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
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
              transition: 'all 0.15s ease'
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.97)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={handleSubmit}
            disabled={isValidating || currentWord.length < 3}
            style={{
              flex: 1,
              padding: '14px',
              background: isValidating || currentWord.length < 3
                ? colors.textLight
                : colors.primary,
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: isValidating || currentWord.length < 3 ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '700',
              boxShadow: isValidating || currentWord.length < 3
                ? 'none'
                : '0 4px 12px rgba(99, 102, 241, 0.3)',
              touchAction: 'manipulation',
              transition: 'all 0.15s ease'
            }}
            onMouseDown={(e) => {
              if (!isValidating && currentWord.length >= 3) {
                e.currentTarget.style.transform = 'scale(0.98)';
              }
            }}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {isValidating ? 'Checking...' : 'Enter'}
          </button>
        </div>

        {/* Found Words */}
        {foundWords.length > 0 && (
          <div style={{
            background: colors.surface,
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '700',
              color: colors.text,
              marginBottom: '12px',
              marginTop: 0
            }}>
              Words ({foundWords.length})
            </h3>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
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
                    border: `1px solid ${colors.primary}20`
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
      )}

      {/* Word Search Game */}
      {activeGame === 'wordsearch' && (
        <>
          {/* Game Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '8px'
          }}>
            <h2 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: colors.textLight,
              margin: 0,
              padding: '4px 0'
            }}>
              Find Words
            </h2>
          </div>
          
          {/* Word List - Target Words */}
          <div style={{
            maxWidth: '420px',
            margin: '0 auto 12px auto',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            justifyContent: 'center'
          }}>
            {wordSearchPuzzle.solutions.map((solution, idx) => {
              const found = wsFoundWords.includes(solution.word);
              return (
                <div
                  key={idx}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: found ? `${colors.success}15` : `${colors.primary}10`,
                    color: found ? colors.success : colors.text,
                    textDecoration: found ? 'line-through' : 'none',
                    opacity: found ? 0.6 : 1,
                    transition: 'all 0.3s'
                  }}
                >
                  {solution.word}
                </div>
              );
            })}
          </div>
          
          <div style={{
            maxWidth: '420px',
            width: '100%',
            margin: '0 auto',
            position: 'relative'
          }}>
            {/* Completion Overlay */}
            {wsFoundWords.length === wordSearchPuzzle.solutions.length && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 10,
                padding: '20px'
              }}>
                <div style={{
                  fontSize: '64px',
                  marginBottom: '16px',
                  animation: 'slideUp 0.5s ease-out'
                }}>
                  🎉
                </div>
                <div style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: colors.success,
                  marginBottom: '8px',
                  animation: 'slideUp 0.6s ease-out'
                }}>
                  Puzzle Complete!
                </div>
                <div style={{
                  fontSize: '16px',
                  color: colors.textLight,
                  marginBottom: '24px',
                  animation: 'slideUp 0.7s ease-out'
                }}>
                  All words found! 🌟
                </div>
                <button
                  onClick={newWordSearch}
                  style={{
                    padding: '16px 32px',
                    background: colors.success,
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '18px',
                    fontWeight: '700',
                    touchAction: 'manipulation',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
                    animation: 'slideUp 0.8s ease-out'
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
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(10, 1fr)',
                gap: '4px',
                marginBottom: '20px',
                userSelect: 'none',
                touchAction: 'none'
              }}
              onMouseLeave={() => {
                if (isSelecting) {
                  handleCellMouseUp();
                }
              }}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleCellMouseUp}
            >
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
                        : colors.surface,
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '700',
                      color: isCellInSolution(rowIndex, colIndex) || isCellSelected(rowIndex, colIndex)
                        ? 'white'
                        : colors.text,
                      cursor: 'pointer',
                      transition: 'all 0.1s',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                      touchAction: 'none'
                    }}
                  >
                    {cell}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {/* Wordle Game */}
      {activeGame === 'wordle' && (
        <>
          {/* Game Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '8px'
          }}>
            <h2 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: colors.textLight,
              margin: 0,
              padding: '4px 0'
            }}>
              Guess the Word
            </h2>
          </div>
          
          {/* Mode Toggle and Info */}
          <div style={{
            background: colors.surface,
            padding: '20px',
            borderRadius: '16px',
            marginBottom: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            {/* Mode Toggle */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <button 
                onClick={() => switchWordleMode('daily')}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: wordleMode === 'daily' ? colors.primary : colors.background,
                  color: wordleMode === 'daily' ? 'white' : colors.text,
                  border: `2px solid ${colors.primary}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div>Daily</div>
                {wordleMode === 'daily' && dailyStreak > 0 && (
                  <div style={{ fontSize: '12px', marginTop: '4px' }}>Streak: {dailyStreak}</div>
                )}
              </button>
              
              <button 
                onClick={() => switchWordleMode('practice')}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: wordleMode === 'practice' ? colors.primary : colors.background,
                  color: wordleMode === 'practice' ? 'white' : colors.text,
                  border: `2px solid ${colors.primary}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Practice
              </button>
            </div>
          </div>

          <div style={{
            maxWidth: '500px',
            width: '100%',
            margin: '0 auto',
            paddingBottom: '240px' // Space for sticky keyboard (220px) + some buffer
          }}>
            <div style={{
              background: colors.surface,
              borderRadius: '16px',
              padding: '24px 16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>

            {/* Error Message */}
            {wordleError && (
              <div style={{
                textAlign: 'center',
                color: colors.error,
                fontWeight: '600',
                fontSize: '14px',
                marginBottom: '12px'
              }}>
                {wordleError}
              </div>
            )}

            {/* Guesses Grid */}
            <div style={{ marginBottom: '12px' }}>
              {Array.from({ length: 6 }).map((_, guessIdx) => {
                const guess = wordleGuesses[guessIdx];
                const isCurrent = guessIdx === wordleGuesses.length && !wordleGameOver;
                const display = guess || (isCurrent ? wordleCurrentGuess : '');
                
                return (
                  <div key={guessIdx} style={{ 
                    display: 'flex', 
                    gap: '5px', 
                    marginBottom: '5px', 
                    justifyContent: 'center' 
                  }}>
                    {Array.from({ length: 4 }).map((_, letterIdx) => {
                      const letter = display[letterIdx] || '';
                      const bgColor = guess 
                        ? getWordleLetterColor(letter, letterIdx, guess)
                        : colors.background;
                      
                      return (
                        <div
                          key={letterIdx}
                          style={{
                            width: '42px',
                            height: '42px',
                            background: bgColor,
                            border: `2px solid ${guess ? 'transparent' : colors.textLight}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            fontWeight: '700',
                            color: guess ? 'white' : colors.text,
                            borderRadius: '8px',
                            transition: 'all 0.2s'
                          }}
                        >
                          {letter}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Game Over Messages */}
            {wordleGameOver && wordleWon && wordleMode === 'daily' && (
              <div style={{
                background: colors.success,
                color: 'white',
                padding: '16px',
                borderRadius: '12px',
                textAlign: 'center',
                marginBottom: '16px',
                fontWeight: '700',
                fontSize: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}>
                <div style={{ marginBottom: '12px' }}>
                  Great job! Puzzle #{dailyPuzzleNumber} complete!
                </div>
                <div style={{ fontSize: '14px', marginBottom: '12px', fontWeight: '500' }}>
                  Come back tomorrow for #{dailyPuzzleNumber + 1}
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={shareWordleResults}
                    style={{
                      background: 'white',
                      color: colors.success,
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                      transition: 'transform 0.15s'
                    }}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                    onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    Share
                  </button>
                  <button
                    onClick={() => switchWordleMode('practice')}
                    style={{
                      background: 'white',
                      color: colors.success,
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                      transition: 'transform 0.15s'
                    }}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                    onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    Continue Practicing
                  </button>
                </div>
              </div>
            )}
            
            {wordleGameOver && wordleWon && wordleMode === 'practice' && (
              <div style={{
                background: colors.success,
                color: 'white',
                padding: '16px',
                borderRadius: '12px',
                textAlign: 'center',
                marginBottom: '16px',
                fontWeight: '700',
                fontSize: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}>
                <div style={{ marginBottom: '12px' }}>
                  You got it!
                </div>
                <button
                  onClick={newWordle}
                  style={{
                    background: 'white',
                    color: colors.success,
                    border: 'none',
                    padding: '10px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    transition: 'transform 0.15s'
                  }}
                  onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                  onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                  onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  Play Again
                </button>
              </div>
            )}
            
            {wordleGameOver && !wordleWon && (
              <div style={{
                background: colors.error,
                color: 'white',
                padding: '16px',
                borderRadius: '12px',
                textAlign: 'center',
                marginBottom: '16px',
                fontWeight: '700',
                fontSize: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}>
                <div style={{ marginBottom: wordleMode === 'practice' ? '12px' : '0' }}>
                  The word was: {wordleTarget}
                </div>
                {wordleMode === 'practice' && (
                  <button
                    onClick={newWordle}
                    style={{
                      background: 'white',
                      color: colors.error,
                      border: 'none',
                      padding: '10px 24px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                      transition: 'transform 0.15s'
                    }}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                    onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    Try Again
                  </button>
                )}
              </div>
            )}
            </div>
          </div>

            {/* Sticky Keyboard */}
            {!wordleGameOver && (
              <div style={{ 
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                background: colors.surface,
                padding: '8px',
                boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
                zIndex: 150
              }}>
                <div style={{
                  maxWidth: '500px',
                  margin: '0 auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                {[
                  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
                  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
                  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK']
                ].map((row, rowIdx) => (
                  <div key={rowIdx} style={{ 
                    display: 'flex', 
                    gap: '3px', 
                    justifyContent: 'center' 
                  }}>
                    {row.map(key => {
                      // Get dynamic background color for letter keys
                      const bgColor = (key !== 'ENTER' && key !== 'BACK') 
                        ? getKeyboardKeyColor(key)
                        : colors.primary;
                      
                      // Determine if key should be slightly faded (wrong letter)
                      const isWrongLetter = bgColor === colors.textLight;
                      
                      return (
                        <button
                          key={key}
                          onClick={() => handleWordleKey(key)}
                          style={{
                            background: bgColor,
                            color: 'white',
                            border: 'none',
                            padding: key.length > 1 ? '10px 6px' : '10px 0',
                            borderRadius: '5px',
                            fontSize: key.length > 1 ? '10px' : '14px',
                            cursor: 'pointer',
                            fontWeight: '700',
                            minWidth: key.length > 1 ? '48px' : '28px',
                            flex: key.length > 1 ? '1.5' : '1',
                            maxWidth: key.length > 1 ? '60px' : '38px',
                            transition: 'all 0.15s',
                            boxShadow: isWrongLetter 
                              ? '0 2px 4px rgba(0,0,0,0.1)' 
                              : '0 2px 6px rgba(0,0,0,0.15)',
                            touchAction: 'manipulation',
                            opacity: isWrongLetter ? 0.5 : 1
                          }}
                          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                          onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                          onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                          {key === 'BACK' ? '⌫' : key}
                        </button>
                      );
                    })}
                  </div>
                ))}
                </div>
              </div>
            )}
        </>
      )}

      {/* Avatar Customization */}
      {activeGame === 'store' && (
        <>
          {/* Rewards Page Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '12px'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: colors.text,
              margin: 0
            }}>
              Rewards
            </h2>
          </div>
          
          {/* Points Display */}
          <div style={{
            background: colors.surface,
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: colors.text,
                margin: 0
              }}>
                Points
              </h3>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                color: colors.accent,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>⭐</span>
                <span>{points}</span>
              </div>
            </div>
            
            {/* Per-Game Points Breakdown */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px'
            }}>
              <div style={{
                background: `${colors.primary}10`,
                padding: '12px',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: colors.textLight,
                  marginBottom: '4px'
                }}>
                  Letter Puzzle
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: colors.primary
                }}>
                  {spellingPoints}
                </div>
              </div>
              
              <div style={{
                background: `${colors.primary}10`,
                padding: '12px',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: colors.textLight,
                  marginBottom: '4px'
                }}>
                  Find Words
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: colors.primary
                }}>
                  {wordSearchPoints}
                </div>
              </div>
              
              <div style={{
                background: `${colors.primary}10`,
                padding: '12px',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: colors.textLight,
                  marginBottom: '4px'
                }}>
                  Guess the Word
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: colors.primary
                }}>
                  {wordlePoints}
                </div>
              </div>
            </div>
          </div>
          
          {/* Rewards Categories */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            
            {/* Word Search Themes */}
            <div style={{
              background: colors.surface,
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: colors.text,
                  margin: 0
                }}>
                  Word Search Themes
                </h2>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: colors.primary,
                  background: `${colors.primary}15`,
                  padding: '4px 12px',
                  borderRadius: '12px'
                }}>
                  {unlockedThemes.length}/24
                </span>
              </div>
              
              <div style={{
                maxHeight: '400px',
                overflowY: 'auto',
                overflowX: 'hidden',
                paddingRight: '8px'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                  gap: '12px'
                }}>
                  {[
                    { id: 'space', name: 'Space', points: 0, icon: '🚀' },
                    { id: 'ocean', name: 'Ocean', points: 0, icon: '🌊' },
                    { id: 'forest', name: 'Forest', points: 0, icon: '🌲' },
                    { id: 'fruits', name: 'Fruits', points: 100, icon: '🍎' },
                    { id: 'garden', name: 'Garden', points: 150, icon: '🌸' },
                    { id: 'weather', name: 'Weather', points: 200, icon: '⛅' },
                    { id: 'fantasy', name: 'Fantasy', points: 250, icon: '🐉' },
                    { id: 'sports', name: 'Sports', points: 300, icon: '⚽' },
                    { id: 'food', name: 'Food', points: 350, icon: '🍕' },
                    { id: 'zoo', name: 'Zoo Animals', points: 400, icon: '🦁' },
                    { id: 'vehicles', name: 'Vehicles', points: 450, icon: '🚗' },
                    { id: 'colors', name: 'Colors', points: 500, icon: '🌈' },
                    { id: 'music', name: 'Music', points: 550, icon: '🎵' },
                    { id: 'emotions', name: 'Emotions', points: 600, icon: '😊' },
                    { id: 'school', name: 'School', points: 650, icon: '📚' },
                    { id: 'pets', name: 'Pets', points: 700, icon: '🐶' },
                    { id: 'dinosaurs', name: 'Dinosaurs', points: 750, icon: '🦕' },
                    { id: 'pirates', name: 'Pirates', points: 800, icon: '🏴‍☠️' },
                    { id: 'farm', name: 'Farm', points: 850, icon: '🚜' },
                    { id: 'camping', name: 'Camping', points: 900, icon: '⛺' },
                    { id: 'everly', name: "Everly's Faves", points: 950, icon: '🦄' },
                    { id: 'movies', name: 'Kids Movies', points: 1000, icon: '🎬' },
                    { id: 'heroes', name: 'Super Heroes', points: 1050, icon: '🦸' },
                    { id: 'asher', name: "Asher's Faves", points: 1100, icon: '🚛' }
                  ].map(theme => {
                    const isUnlocked = unlockedThemes.includes(theme.id);
                    const canUnlock = points >= theme.points && !isUnlocked;
                    
                    return (
                      <div
                        key={theme.id}
                        style={{
                          background: isUnlocked ? `${colors.success}15` : colors.background,
                          border: `2px solid ${isUnlocked ? colors.success : canUnlock ? colors.primary : colors.background}`,
                          borderRadius: '12px',
                          padding: '12px',
                          textAlign: 'center',
                          opacity: isUnlocked ? 1 : canUnlock ? 1 : 0.6,
                          cursor: canUnlock ? 'pointer' : 'default',
                          transition: 'all 0.2s'
                        }}
                        onClick={() => {
                          if (canUnlock) {
                            setUnlockedThemes([...unlockedThemes, theme.id]);
                          }
                        }}
                      >
                        <div style={{ fontSize: '28px', marginBottom: '6px' }}>{theme.icon}</div>
                        <div style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          color: colors.text,
                          marginBottom: '4px'
                        }}>
                          {theme.name}
                        </div>
                        {!isUnlocked && (
                          <div style={{
                            fontSize: '11px',
                            fontWeight: '600',
                            color: canUnlock ? colors.primary : colors.textLight
                          }}>
                            {canUnlock ? 'Tap!' : `${theme.points} pts`}
                          </div>
                        )}
                        {isUnlocked && (
                          <div style={{
                            fontSize: '11px',
                            fontWeight: '600',
                            color: colors.success
                          }}>
                            ✓
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Visual Themes */}
            <div style={{
              background: colors.surface,
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: colors.text,
                  margin: 0
                }}>
                  Color Themes
                </h2>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: colors.primary,
                  background: `${colors.primary}15`,
                  padding: '4px 12px',
                  borderRadius: '12px'
                }}>
                  {unlockedVisualThemes.length}/12
                </span>
              </div>
              
              <div style={{
                maxHeight: '300px',
                overflowY: 'auto',
                overflowX: 'hidden',
                paddingRight: '8px'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                  gap: '12px'
                }}>
                  {[
                    { id: 'classic', name: 'Classic', points: 0, colors: ['#6366F1', '#EC4899', '#F59E0B'] },
                    { id: 'ocean', name: 'Ocean Breeze', points: 200, colors: ['#0EA5E9', '#06B6D4', '#14B8A6'] },
                    { id: 'forest', name: 'Forest Magic', points: 400, colors: ['#10B981', '#84CC16', '#22C55E'] },
                    { id: 'sunset', name: 'Sunset Glow', points: 600, colors: ['#F97316', '#FB923C', '#FBBF24'] },
                    { id: 'purple', name: 'Purple Dream', points: 800, colors: ['#A855F7', '#C084FC', '#E879F9'] },
                    { id: 'candy', name: 'Candy Pop', points: 1000, colors: ['#EC4899', '#F472B6', '#FB7185'] },
                    { id: 'night', name: 'Night Sky', points: 1200, colors: ['#3B82F6', '#6366F1', '#8B5CF6'] },
                    { id: 'sunshine', name: 'Sunshine', points: 1400, colors: ['#FBBF24', '#FCD34D', '#F59E0B'] },
                    { id: 'cherry', name: 'Cherry Blossom', points: 1600, colors: ['#F472B6', '#FBCFE8', '#FDA4AF'] },
                    { id: 'mint', name: 'Mint Fresh', points: 1800, colors: ['#34D399', '#6EE7B7', '#10B981'] },
                    { id: 'rainbow', name: 'Rainbow Party', points: 2000, colors: ['#F59E0B', '#EC4899', '#8B5CF6'] },
                    { id: 'kpop', name: 'K-pop', points: 2200, colors: ['#14B8A6', '#10B981', '#EC4899'] }
                  ].map(theme => {
                    const isUnlocked = unlockedVisualThemes.includes(theme.id);
                    const canUnlock = points >= theme.points && !isUnlocked;
                    const isActive = currentVisualTheme === theme.id;
                    
                    return (
                      <div
                        key={theme.id}
                        style={{
                          background: isActive ? `${colors.primary}15` : isUnlocked ? colors.background : `${colors.background}`,
                          border: `2px solid ${isActive ? colors.primary : isUnlocked ? colors.success : canUnlock ? colors.primary : colors.background}`,
                          borderRadius: '12px',
                          padding: '12px',
                          textAlign: 'center',
                          opacity: isUnlocked ? 1 : canUnlock ? 1 : 0.6,
                          cursor: isUnlocked ? 'pointer' : canUnlock ? 'pointer' : 'default',
                          transition: 'all 0.2s'
                        }}
                        onClick={() => {
                          if (canUnlock) {
                            setUnlockedVisualThemes([...unlockedVisualThemes, theme.id]);
                            setCurrentVisualTheme(theme.id);
                          } else if (isUnlocked) {
                            setCurrentVisualTheme(theme.id);
                          }
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          gap: '3px',
                          justifyContent: 'center',
                          marginBottom: '6px'
                        }}>
                          {theme.colors.map((color, i) => (
                            <div key={i} style={{
                              width: '20px',
                              height: '20px',
                              background: color,
                              borderRadius: '50%'
                            }} />
                          ))}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          color: colors.text,
                          marginBottom: '4px'
                        }}>
                          {theme.name}
                        </div>
                        {!isUnlocked && !isActive && (
                          <div style={{
                            fontSize: '10px',
                            fontWeight: '600',
                            color: canUnlock ? colors.primary : colors.textLight
                          }}>
                            {canUnlock ? 'Tap!' : `${theme.points} pts`}
                          </div>
                        )}
                        {isUnlocked && !isActive && (
                          <div style={{
                            fontSize: '10px',
                            fontWeight: '600',
                            color: colors.success
                          }}>
                            Tap to use
                          </div>
                        )}
                        {isActive && (
                          <div style={{
                            fontSize: '10px',
                            fontWeight: '600',
                            color: colors.primary
                          }}>
                            Active ✓
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Badges Preview */}
            <div style={{
              background: colors.surface,
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: colors.text,
                  margin: 0
                }}>
                  Badges
                </h2>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: colors.primary,
                  background: `${colors.primary}15`,
                  padding: '4px 12px',
                  borderRadius: '12px'
                }}>
                  {badges.length}/40
                </span>
              </div>
              
              <div style={{
                maxHeight: '300px',
                overflowY: 'auto',
                overflowX: 'hidden',
                paddingRight: '8px'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(75px, 1fr))',
                  gap: '10px'
                }}>
                  {[
                    { id: 'first-word', name: 'First Word', icon: '⭐', points: 0, desc: 'Welcome! Start your journey.' },
                    { id: 'getting-started', name: 'Getting Started', icon: '🎯', points: 0, desc: 'Begin playing the games.' },
                    { id: 'word-finder', name: 'Word Finder', icon: '🔍', points: 100, desc: 'Find 25 total words.' },
                    { id: 'word-hunter', name: 'Word Hunter', icon: '🎪', points: 200, desc: 'Find 50 total words.' },
                    { id: 'rising-star', name: 'Rising Star', icon: '🌟', points: 250, desc: 'Earn 250 points.' },
                    { id: 'bee-novice', name: 'Bee Novice', icon: '🐝', points: 150, desc: 'Play 5 Spelling Bee games.' },
                    { id: 'word-master', name: 'Word Master', icon: '👑', points: 400, desc: 'Find 100 total words.' },
                    { id: 'point-collector', name: 'Point Collector', icon: '💰', points: 500, desc: 'Earn 500 points.' },
                    { id: 'search-novice', name: 'Search Novice', icon: '🔎', points: 150, desc: 'Play 5 Word Search games.' },
                    { id: 'bee-expert', name: 'Bee Expert', icon: '🐝', points: 300, desc: 'Play 10 Spelling Bee games.' },
                    { id: 'point-master', name: 'Point Master', icon: '💎', points: 750, desc: 'Earn 750 points.' },
                    { id: 'word-champion', name: 'Word Champion', icon: '🏆', points: 600, desc: 'Find 200 total words.' },
                    { id: 'search-expert', name: 'Search Expert', icon: '🔍', points: 300, desc: 'Play 10 Word Search games.' },
                    { id: 'spelling-master', name: 'Spelling Master', icon: '📝', points: 500, desc: 'Find a 7+ letter word.' },
                    { id: 'combo-master', name: 'Combo Master', icon: '🎮', points: 500, desc: 'Play all 3 game modes.' },
                    { id: 'quick-thinker', name: 'Quick Thinker', icon: '⚡', points: 350, desc: 'Find 5 words in one Spelling Bee game.' },
                    { id: 'perfect-game', name: 'Perfect Game', icon: '💯', points: 400, desc: 'Complete a Word Search puzzle.' },
                    { id: 'bee-champion', name: 'Bee Champion', icon: '🥇', points: 700, desc: 'Play 25 Spelling Bee games.' },
                    { id: 'search-champion', name: 'Search Champion', icon: '🥈', points: 700, desc: 'Play 25 Word Search games.' },
                    { id: 'wordle-rookie', name: 'Wordle Rookie', icon: '🎲', points: 50, desc: 'Win your first Wordle game.' },
                    { id: 'wordle-ace', name: 'Wordle Ace', icon: '🎯', points: 200, desc: 'Win 5 Wordle games.' },
                    { id: 'speed-demon', name: 'Speed Demon', icon: '⚡', points: 150, desc: 'Win a Wordle in 2 guesses or less.' },
                    { id: 'perfect-streak', name: 'Perfect Streak', icon: '🔥', points: 300, desc: 'Win 5 Wordle games in a row.' },
                    { id: 'wordle-master', name: 'Wordle Master', icon: '👑', points: 500, desc: 'Win 25 Wordle games.' },
                    { id: 'e-badge', name: 'E Badge', icon: '🅴', points: 50, desc: 'Win a Wordle with the letter E.' },
                    { id: 'word-legend', name: 'Word Legend', icon: '⭐', points: 800, desc: 'Find 300 total words.' },
                    { id: 'wordle-legend', name: 'Wordle Legend', icon: '🏅', points: 1000, desc: 'Win 50 Wordle games.' },
                    { id: 'unstoppable', name: 'Unstoppable', icon: '🔥', points: 600, desc: 'Win 10 Wordle games in a row.' },
                    { id: 'point-king', name: 'Point King', icon: '👑', points: 1000, desc: 'Earn 1000 points.' },
                    { id: 'mega-collector', name: 'Mega Collector', icon: '💰', points: 2500, desc: 'Earn 2500 points.' }
                  ].map(badge => {
                    const isEarned = badges.includes(badge.id);
                    
                    return (
                      <div
                        key={badge.id}
                        onClick={() => setBadgeTooltip(badgeTooltip === badge.id ? null : badge.id)}
                        style={{
                          background: isEarned ? `${colors.accent}15` : colors.background,
                          border: `2px solid ${isEarned ? colors.accent : 'transparent'}`,
                          borderRadius: '12px',
                          padding: '10px',
                          textAlign: 'center',
                          opacity: isEarned ? 1 : 0.4,
                          cursor: 'pointer',
                          position: 'relative',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ fontSize: '28px', marginBottom: '4px' }}>{badge.icon}</div>
                        <div style={{
                          fontSize: '10px',
                          fontWeight: '600',
                          color: colors.text,
                          lineHeight: '1.2'
                        }}>
                          {badge.name}
                        </div>
                        
                        {/* Tooltip */}
                        {badgeTooltip === badge.id && (
                          <div style={{
                            position: 'absolute',
                            bottom: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            marginBottom: '8px',
                            background: colors.text,
                            color: 'white',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: '500',
                            whiteSpace: 'nowrap',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                            zIndex: 1000,
                            pointerEvents: 'none',
                            lineHeight: '1.4'
                          }}>
                            {badge.desc}
                            <div style={{
                              position: 'absolute',
                              top: '100%',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              width: 0,
                              height: 0,
                              borderLeft: '6px solid transparent',
                              borderRight: '6px solid transparent',
                              borderTop: `6px solid ${colors.text}`
                            }} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <p style={{
                fontSize: '12px',
                color: colors.textLight,
                textAlign: 'center',
                margin: '12px 0 0 0'
              }}>
                Keep playing to earn more badges!
              </p>
            </div>

          </div>
        </>
      )}
    </div>
  </div>
  </>
  );
}

export default WordGame;
