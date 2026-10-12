// Two-pass Wordle scoring that handles duplicate letters correctly.
// Returns an array of 'green' | 'yellow' | 'gray', one per letter of the guess.
export function scoreGuess(guess, target) {
  const remainingLetters = target.split('');
  const results = new Array(guess.length).fill(null);

  // Pass 1: exact matches
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === target[i]) {
      results[i] = 'green';
      const at = remainingLetters.indexOf(guess[i]);
      if (at !== -1) remainingLetters.splice(at, 1);
    }
  }

  // Pass 2: letters present elsewhere
  for (let i = 0; i < guess.length; i++) {
    if (results[i] === 'green') continue;
    const at = remainingLetters.indexOf(guess[i]);
    if (at !== -1) {
      results[i] = 'yellow';
      remainingLetters.splice(at, 1);
    } else {
      results[i] = 'gray';
    }
  }

  return results;
}
