import { WORD_SEARCH_THEMES, VISUAL_THEMES, BADGES } from '../data/rewards.js';

export default function Rewards({
  colors,
  points,
  spellingPoints,
  wordSearchPoints,
  wordlePoints,
  unlockedThemes,
  setUnlockedThemes,
  unlockedVisualThemes,
  setUnlockedVisualThemes,
  currentVisualTheme,
  setCurrentVisualTheme,
  badges,
  badgeTooltip,
  setBadgeTooltip,
}) {
  return (
    <>
      {/* Rewards Page Header */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '12px',
        }}
      >
        <h2
          style={{
            fontSize: '20px',
            fontWeight: '700',
            color: colors.text,
            margin: 0,
          }}
        >
          Rewards
        </h2>
      </div>

      {/* Points Display */}
      <div
        style={{
          background: colors.surface,
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}
        >
          <h3
            style={{
              fontSize: '18px',
              fontWeight: '700',
              color: colors.text,
              margin: 0,
            }}
          >
            Points
          </h3>
          <div
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: colors.accent,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>⭐</span>
            <span>{points}</span>
          </div>
        </div>

        {/* Per-Game Points Breakdown */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
          }}
        >
          <div
            style={{
              background: `${colors.primary}10`,
              padding: '12px',
              borderRadius: '12px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '11px',
                fontWeight: '600',
                color: colors.textLight,
                marginBottom: '4px',
              }}
            >
              Letter Puzzle
            </div>
            <div
              style={{
                fontSize: '18px',
                fontWeight: '700',
                color: colors.primary,
              }}
            >
              {spellingPoints}
            </div>
          </div>

          <div
            style={{
              background: `${colors.primary}10`,
              padding: '12px',
              borderRadius: '12px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '11px',
                fontWeight: '600',
                color: colors.textLight,
                marginBottom: '4px',
              }}
            >
              Find Words
            </div>
            <div
              style={{
                fontSize: '18px',
                fontWeight: '700',
                color: colors.primary,
              }}
            >
              {wordSearchPoints}
            </div>
          </div>

          <div
            style={{
              background: `${colors.primary}10`,
              padding: '12px',
              borderRadius: '12px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '11px',
                fontWeight: '600',
                color: colors.textLight,
                marginBottom: '4px',
              }}
            >
              Guess the Word
            </div>
            <div
              style={{
                fontSize: '18px',
                fontWeight: '700',
                color: colors.primary,
              }}
            >
              {wordlePoints}
            </div>
          </div>
        </div>
      </div>

      {/* Rewards Categories */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* Word Search Themes */}
        <div
          style={{
            background: colors.surface,
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <h2
              style={{
                fontSize: '20px',
                fontWeight: '700',
                color: colors.text,
                margin: 0,
              }}
            >
              Word Search Themes
            </h2>
            <span
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: colors.primary,
                background: `${colors.primary}15`,
                padding: '4px 12px',
                borderRadius: '12px',
              }}
            >
              {unlockedThemes.length}/{WORD_SEARCH_THEMES.length}
            </span>
          </div>

          <div
            style={{
              maxHeight: '400px',
              overflowY: 'auto',
              overflowX: 'hidden',
              paddingRight: '8px',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: '12px',
              }}
            >
              {WORD_SEARCH_THEMES.map((theme) => {
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
                      transition: 'all 0.2s',
                    }}
                    onClick={() => {
                      if (canUnlock) {
                        setUnlockedThemes([...unlockedThemes, theme.id]);
                      }
                    }}
                  >
                    <div style={{ fontSize: '28px', marginBottom: '6px' }}>{theme.icon}</div>
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: colors.text,
                        marginBottom: '4px',
                      }}
                    >
                      {theme.name}
                    </div>
                    {!isUnlocked && (
                      <div
                        style={{
                          fontSize: '11px',
                          fontWeight: '600',
                          color: canUnlock ? colors.primary : colors.textLight,
                        }}
                      >
                        {canUnlock ? 'Tap!' : `${theme.points} pts`}
                      </div>
                    )}
                    {isUnlocked && (
                      <div
                        style={{
                          fontSize: '11px',
                          fontWeight: '600',
                          color: colors.success,
                        }}
                      >
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
        <div
          style={{
            background: colors.surface,
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <h2
              style={{
                fontSize: '20px',
                fontWeight: '700',
                color: colors.text,
                margin: 0,
              }}
            >
              Color Themes
            </h2>
            <span
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: colors.primary,
                background: `${colors.primary}15`,
                padding: '4px 12px',
                borderRadius: '12px',
              }}
            >
              {unlockedVisualThemes.length}/{VISUAL_THEMES.length}
            </span>
          </div>

          <div
            style={{
              maxHeight: '300px',
              overflowY: 'auto',
              overflowX: 'hidden',
              paddingRight: '8px',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: '12px',
              }}
            >
              {VISUAL_THEMES.map((theme) => {
                const isUnlocked = unlockedVisualThemes.includes(theme.id);
                const canUnlock = points >= theme.points && !isUnlocked;
                const isActive = currentVisualTheme === theme.id;

                return (
                  <div
                    key={theme.id}
                    style={{
                      background: isActive
                        ? `${colors.primary}15`
                        : isUnlocked
                          ? colors.background
                          : `${colors.background}`,
                      border: `2px solid ${isActive ? colors.primary : isUnlocked ? colors.success : canUnlock ? colors.primary : colors.background}`,
                      borderRadius: '12px',
                      padding: '12px',
                      textAlign: 'center',
                      opacity: isUnlocked ? 1 : canUnlock ? 1 : 0.6,
                      cursor: isUnlocked ? 'pointer' : canUnlock ? 'pointer' : 'default',
                      transition: 'all 0.2s',
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
                    <div
                      style={{
                        display: 'flex',
                        gap: '3px',
                        justifyContent: 'center',
                        marginBottom: '6px',
                      }}
                    >
                      {theme.colors.map((color, i) => (
                        <div
                          key={i}
                          style={{
                            width: '20px',
                            height: '20px',
                            background: color,
                            borderRadius: '50%',
                          }}
                        />
                      ))}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: colors.text,
                        marginBottom: '4px',
                      }}
                    >
                      {theme.name}
                    </div>
                    {!isUnlocked && !isActive && (
                      <div
                        style={{
                          fontSize: '10px',
                          fontWeight: '600',
                          color: canUnlock ? colors.primary : colors.textLight,
                        }}
                      >
                        {canUnlock ? 'Tap!' : `${theme.points} pts`}
                      </div>
                    )}
                    {isUnlocked && !isActive && (
                      <div
                        style={{
                          fontSize: '10px',
                          fontWeight: '600',
                          color: colors.success,
                        }}
                      >
                        Tap to use
                      </div>
                    )}
                    {isActive && (
                      <div
                        style={{
                          fontSize: '10px',
                          fontWeight: '600',
                          color: colors.primary,
                        }}
                      >
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
        <div
          style={{
            background: colors.surface,
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <h2
              style={{
                fontSize: '20px',
                fontWeight: '700',
                color: colors.text,
                margin: 0,
              }}
            >
              Badges
            </h2>
            <span
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: colors.primary,
                background: `${colors.primary}15`,
                padding: '4px 12px',
                borderRadius: '12px',
              }}
            >
              {badges.length}/{BADGES.length}
            </span>
          </div>

          <div
            style={{
              maxHeight: '300px',
              overflowY: 'auto',
              overflowX: 'hidden',
              paddingRight: '8px',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(75px, 1fr))',
                gap: '10px',
              }}
            >
              {BADGES.map((badge) => {
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
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontSize: '28px', marginBottom: '4px' }}>{badge.icon}</div>
                    <div
                      style={{
                        fontSize: '10px',
                        fontWeight: '600',
                        color: colors.text,
                        lineHeight: '1.2',
                      }}
                    >
                      {badge.name}
                    </div>

                    {/* Tooltip */}
                    {badgeTooltip === badge.id && (
                      <div
                        style={{
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
                          lineHeight: '1.4',
                        }}
                      >
                        {badge.desc}
                        <div
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 0,
                            height: 0,
                            borderLeft: '6px solid transparent',
                            borderRight: '6px solid transparent',
                            borderTop: `6px solid ${colors.text}`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <p
            style={{
              fontSize: '12px',
              color: colors.textLight,
              textAlign: 'center',
              margin: '12px 0 0 0',
            }}
          >
            Keep playing to earn more badges!
          </p>
        </div>
      </div>
    </>
  );
}
