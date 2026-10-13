// The play streak counts days in a row on which the player earned points. Days are compared as
// the strings new Date().toDateString() gives, the same format saved in lastPlayedDate.
export const dayString = (date = new Date()) => date.toDateString();

export function yesterdayString(date = new Date()) {
  const d = new Date(date);
  d.setDate(d.getDate() - 1);
  return d.toDateString();
}

// Streak after earning points on `now`, given the last day points were earned
export function nextStreak(lastPlayedDate, streak, now = new Date()) {
  if (lastPlayedDate === dayString(now)) return streak;
  if (lastPlayedDate === yesterdayString(now)) return streak + 1;
  return 1;
}

// Streak to show. A streak that was not played yesterday or today has run out.
export function currentStreak(lastPlayedDate, streak, now = new Date()) {
  const live = lastPlayedDate === dayString(now) || lastPlayedDate === yesterdayString(now);
  return live ? streak : 0;
}
