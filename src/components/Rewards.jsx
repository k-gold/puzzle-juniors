import { WORD_SEARCH_THEMES, VISUAL_THEMES, BADGES } from '../data/rewards.js';

const cardShadow = '0 1px 2px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)';

// A white card with a title and an "unlocked / total" counter
function Card({ colors, title, count, children }) {
  return (
    <section
      style={{
        background: colors.surface,
        borderRadius: '20px',
        padding: '18px',
        boxShadow: cardShadow,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px',
        }}
      >
        <h2
          style={{
            fontSize: '18px',
            fontWeight: '800',
            color: colors.text,
            margin: 0,
          }}
        >
          {title}
        </h2>
        {count && (
          <span
            style={{
              fontSize: '13px',
              fontWeight: '800',
              color: colors.primaryText,
              background: `${colors.primary}14`,
              padding: '5px 12px',
              borderRadius: '999px',
            }}
          >
            {count}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}

// One tappable reward. It is a real button so it works with keyboards and screen readers.
function Tile({ colors, border, background, dimmed, disabled, onClick, label, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      style={{
        background,
        border: `2px solid ${border}`,
        borderRadius: '16px',
        padding: '12px 8px',
        minHeight: '92px',
        textAlign: 'center',
        filter: dimmed ? 'grayscale(0.8)' : 'none',
        cursor: disabled ? 'default' : 'pointer',
        color: colors.text,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        touchAction: 'manipulation',
        transition: 'transform 0.12s ease, border-color 0.2s',
      }}
    >
      {children}
    </button>
  );
}

// A labeled on/off switch
function Toggle({ colors, checked, onChange, title, detail }) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minHeight: '44px',
        padding: '4px 0',
        fontSize: '15px',
        fontWeight: '700',
        color: colors.text,
        cursor: 'pointer',
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ width: '24px', height: '24px', accentColor: colors.primary, flex: 'none' }}
      />
      <span>
        {title}
        <span
          style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: colors.textLight }}
        >
          {detail}
        </span>
      </span>
    </label>
  );
}

// True when the site was opened from the home screen instead of a browser tab
const isInstalled = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia?.('(display-mode: standalone)').matches ||
    window.navigator.standalone === true);

const tileName = (colors) => ({
  fontSize: '14px',
  fontWeight: '700',
  color: colors.text,
});
const tileStatus = (color) => ({ fontSize: '12px', fontWeight: '700', color });

export default function Rewards({
  colors,
  points,
  balance,
  spellingPoints,
  wordSearchPoints,
  wordlePoints,
  scramblePoints,
  unlockedThemes,
  unlockedVisualThemes,
  setUnlockedVisualThemes,
  currentVisualTheme,
  setCurrentVisualTheme,
  badges,
  badgeTooltip,
  setBadgeTooltip,
  colorBlindMode,
  setColorBlindMode,
  soundOn,
  setSoundOn,
}) {
  const gameTotals = [
    { label: 'Letter Puzzle', value: spellingPoints },
    { label: 'Find Words', value: wordSearchPoints },
    { label: 'Guess the Word', value: wordlePoints },
    { label: 'Word Scramble', value: scramblePoints },
  ];
  const selectedBadge = BADGES.find((b) => b.id === badgeTooltip);

  return (
    <>
      <h2
        style={{
          fontSize: '13px',
          fontWeight: '700',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: colors.textLight,
          textAlign: 'center',
          margin: '4px 0 12px',
        }}
      >
        Rewards
      </h2>

      {/* Points */}
      <section
        style={{
          background: colors.surface,
          borderRadius: '20px',
          padding: '18px',
          marginBottom: '16px',
          boxShadow: cardShadow,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '14px',
          }}
        >
          <h2
            style={{
              fontSize: '18px',
              fontWeight: '800',
              color: colors.text,
              margin: 0,
            }}
          >
            Points
          </h2>
          <div
            style={{
              fontSize: '28px',
              fontWeight: '800',
              color: colors.text,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span aria-hidden="true">⭐</span>
            <span>{balance}</span>
          </div>
        </div>

        <p
          style={{
            margin: '0 0 14px',
            fontSize: '13px',
            fontWeight: '600',
            color: colors.textLight,
          }}
        >
          Points to spend on Guess the Word hints. Unlocks use everything you have earned: {points}{' '}
          so far.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px',
          }}
        >
          {gameTotals.map((game) => (
            <div
              key={game.label}
              style={{
                background: `${colors.primary}10`,
                padding: '12px 6px',
                borderRadius: '14px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: colors.textLight,
                  marginBottom: '4px',
                }}
              >
                {game.label}
              </div>
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: '800',
                  color: colors.primaryText,
                }}
              >
                {game.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Word Search themes */}
        <Card
          colors={colors}
          title="Word Search Themes"
          count={`${unlockedThemes.length}/${WORD_SEARCH_THEMES.length}`}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))',
              gap: '10px',
            }}
          >
            {WORD_SEARCH_THEMES.map((theme) => {
              const isUnlocked = unlockedThemes.includes(theme.id);

              return (
                <Tile
                  key={theme.id}
                  colors={colors}
                  label={`${theme.name}, ${isUnlocked ? 'unlocked' : `locked, ${theme.points} points`}`}
                  background={isUnlocked ? `${colors.success}18` : colors.background}
                  border={isUnlocked ? colors.success : colors.background}
                  dimmed={!isUnlocked}
                  disabled
                >
                  <span style={{ fontSize: '30px', lineHeight: 1 }} aria-hidden="true">
                    {theme.icon}
                  </span>
                  <span style={tileName(colors)}>{theme.name}</span>
                  <span style={tileStatus(isUnlocked ? colors.successText : colors.textLight)}>
                    {isUnlocked ? '✓' : `${theme.points} pts`}
                  </span>
                </Tile>
              );
            })}
          </div>
        </Card>

        {/* Color themes */}
        <Card
          colors={colors}
          title="Color Themes"
          count={`${unlockedVisualThemes.length}/${VISUAL_THEMES.length}`}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: '10px',
            }}
          >
            {VISUAL_THEMES.map((theme) => {
              const isUnlocked = unlockedVisualThemes.includes(theme.id);
              const canUnlock = points >= theme.points && !isUnlocked;
              const isActive = currentVisualTheme === theme.id;
              const status = isActive
                ? 'in use'
                : isUnlocked
                  ? 'unlocked, tap to use'
                  : canUnlock
                    ? 'tap to unlock'
                    : 'locked';

              return (
                <Tile
                  key={theme.id}
                  colors={colors}
                  label={`${theme.name}, ${status}`}
                  background={isActive ? `${colors.primary}14` : colors.background}
                  border={
                    isActive
                      ? colors.primary
                      : isUnlocked
                        ? colors.success
                        : canUnlock
                          ? colors.primary
                          : colors.background
                  }
                  dimmed={!isUnlocked && !canUnlock}
                  disabled={!isUnlocked && !canUnlock}
                  onClick={() => {
                    if (canUnlock) {
                      setUnlockedVisualThemes([...unlockedVisualThemes, theme.id]);
                      setCurrentVisualTheme(theme.id);
                    } else if (isUnlocked) {
                      setCurrentVisualTheme(theme.id);
                    }
                  }}
                >
                  <span style={{ display: 'flex', gap: '4px' }} aria-hidden="true">
                    {theme.colors.map((color, i) => (
                      <span
                        key={i}
                        style={{
                          width: '22px',
                          height: '22px',
                          background: color,
                          borderRadius: '50%',
                        }}
                      />
                    ))}
                  </span>
                  <span style={tileName(colors)}>{theme.name}</span>
                  {isActive ? (
                    <span style={tileStatus(colors.primaryText)}>Active ✓</span>
                  ) : isUnlocked ? (
                    <span style={tileStatus(colors.successText)}>Tap to use</span>
                  ) : (
                    <span style={tileStatus(canUnlock ? colors.primaryText : colors.textLight)}>
                      {canUnlock ? 'Tap!' : `${theme.points} pts`}
                    </span>
                  )}
                </Tile>
              );
            })}
          </div>
        </Card>

        {/* Settings */}
        <Card colors={colors} title="Settings">
          <Toggle
            colors={colors}
            checked={soundOn}
            onChange={setSoundOn}
            title="Sound effects"
            detail="Soft sounds for points, badges and mistakes"
          />
          <Toggle
            colors={colors}
            checked={colorBlindMode}
            onChange={setColorBlindMode}
            title="Color-blind friendly colors"
            detail="Guess the Word uses blue and orange instead of green and yellow"
          />
          {!isInstalled() && (
            <p
              style={{
                margin: '12px 0 0',
                fontSize: '13px',
                fontWeight: '600',
                color: colors.textLight,
              }}
            >
              Play like an app: in your phone's browser, tap Share, then Add to Home Screen. It also
              keeps your points safe and works without internet.
            </p>
          )}
        </Card>

        {/* Badges */}
        <Card colors={colors} title="Badges" count={`${badges.length}/${BADGES.length}`}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(84px, 1fr))',
              gap: '10px',
            }}
          >
            {BADGES.map((badge) => {
              const isEarned = badges.includes(badge.id);
              const isSelected = badgeTooltip === badge.id;

              return (
                <Tile
                  key={badge.id}
                  colors={colors}
                  label={`${badge.name}, ${isEarned ? 'earned' : 'not earned yet'}`}
                  background={isEarned ? `${colors.accent}18` : colors.background}
                  border={isSelected ? colors.primary : isEarned ? colors.accent : 'transparent'}
                  dimmed={!isEarned}
                  onClick={() => setBadgeTooltip(isSelected ? null : badge.id)}
                >
                  <span style={{ fontSize: '30px', lineHeight: 1 }} aria-hidden="true">
                    {badge.icon}
                  </span>
                  <span
                    style={{
                      ...tileName(colors),
                      fontSize: '12px',
                      lineHeight: 1.2,
                    }}
                  >
                    {badge.name}
                  </span>
                </Tile>
              );
            })}
          </div>

          {/* What the tapped badge is for. Shown here, not as a floating bubble that can run off-screen. */}
          <div
            aria-live="polite"
            style={{
              marginTop: '14px',
              minHeight: '52px',
              padding: '12px 14px',
              borderRadius: '14px',
              background: selectedBadge ? `${colors.primary}10` : 'transparent',
              color: selectedBadge ? colors.text : colors.textLight,
              fontSize: '14px',
              fontWeight: selectedBadge ? '700' : '600',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            {selectedBadge ? (
              <>
                <span style={{ fontSize: '26px' }} aria-hidden="true">
                  {selectedBadge.icon}
                </span>
                <span>
                  {selectedBadge.name}: {selectedBadge.desc}
                </span>
              </>
            ) : (
              'Tap a badge to see how to earn it'
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
