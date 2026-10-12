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

export async function isValidWord(word) {
  try {
    const words = await loadWordList();
    return words.has(word.toLowerCase());
  } catch (error) {
    console.error('Word list error:', error);
    return false;
  }
}
