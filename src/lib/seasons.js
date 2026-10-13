import { SEASONS } from '../data/rewards.js';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// The id of the season that `date` falls in, or null between seasons
export function seasonOn(date = new Date()) {
  const today = (date.getMonth() + 1) * 100 + date.getDate();
  const found = SEASONS.find(
    (s) => today >= s.start[0] * 100 + s.start[1] && today <= s.end[0] * 100 + s.end[1],
  );
  return found ? found.id : null;
}

// "Oct 1 to Oct 31", for telling players when a locked season is available
export const seasonDates = (season) =>
  `${MONTHS[season.start[0] - 1]} ${season.start[1]} to ${MONTHS[season.end[0] - 1]} ${season.end[1]}`;
