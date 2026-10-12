const KEY = 'wordGameState';

export function loadSavedState() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading saved state:', error);
  }
  return null;
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving state:', error);
  }
}
