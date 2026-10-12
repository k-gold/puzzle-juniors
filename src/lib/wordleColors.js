// Colors for Wordle tiles and keys.
// status is one of 'correct', 'present', 'absent' or 'unused' (a key not guessed yet).
// Color-blind mode swaps green and yellow for blue and orange, which stay distinct for
// the common kinds of color blindness.
const COLOR_BLIND = {
  correct: { background: '#1D5FC9', color: '#FFFFFF' },
  present: { background: '#F5A524', color: '#1F2430' },
};

export function wordleStyle(colors, status, colorBlind = false) {
  if (colorBlind && COLOR_BLIND[status]) return COLOR_BLIND[status];
  switch (status) {
    case 'correct':
      return { background: colors.success, color: colors.onSuccess };
    case 'present':
      return { background: colors.accent, color: colors.onAccent };
    case 'absent':
      return { background: colors.textLight, color: colors.onTextLight };
    default:
      return { background: colors.primary, color: colors.onPrimary };
  }
}

// What the share text uses for each status
export function shareSquare(status, colorBlind = false) {
  if (status === 'correct') return colorBlind ? '🟦' : '🟩';
  if (status === 'present') return colorBlind ? '🟧' : '🟨';
  return '⬜';
}
