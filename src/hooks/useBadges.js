import { useEffect } from 'react';
import { buildStats, newlyEarned } from '../lib/badgeStats.js';

// Awards every badge whose target has been reached. Runs after every change, so a badge can
// never be missed, and players who already qualify get it the next time they open the site.
export function useBadges(ctx) {
  const { badges, setBadges, notify } = ctx;
  const stats = buildStats(ctx);

  useEffect(() => {
    const earned = newlyEarned(stats, badges);
    if (earned.length === 0) return;

    setBadges((prev) => [...prev, ...earned.map((b) => b.id).filter((id) => !prev.includes(id))]);

    // A pile of badges at once becomes one popup instead of a long queue
    if (earned.length > 3) {
      notify({ icon: '🎉', title: 'Badges Unlocked!', name: `${earned.length} new badges` });
    } else {
      earned.forEach((b) => notify({ icon: b.icon, title: 'Badge Unlocked!', name: b.name }));
    }
  });
}
