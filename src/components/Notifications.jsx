export default function Notifications({
  colors,
  activeGame,
  showPointsAnimation,
  animatedPoints,
  showBadgeNotification,
  newBadge,
}) {
  return (
    <>
      {/* Points Animation Popup */}
      {showPointsAnimation && (
        <div
          style={{
            position: 'fixed',
            top: activeGame === 'spelling' ? '180px' : '50%',
            left: '50%',
            transform: activeGame === 'spelling' ? 'translateX(-50%)' : 'translate(-50%, -50%)',
            fontSize: '56px',
            fontWeight: '700',
            color: colors.success,
            animation: 'pointsPop 1.5s ease-out',
            pointerEvents: 'none',
            zIndex: 1000,
            textShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}
        >
          +{animatedPoints}
        </div>
      )}

      {/* Badge Notification Flyover */}
      {showBadgeNotification && newBadge && (
        <div
          style={{
            position: 'fixed',
            top: '120px',
            right: '0',
            animation: 'badgeFlyIn 3s ease-out',
            pointerEvents: 'none',
            zIndex: 1001,
          }}
        >
          <div
            style={{
              background: `linear-gradient(135deg, ${colors.accent}30, ${colors.accent}20)`,
              border: `3px solid ${colors.accent}`,
              borderRadius: '16px',
              padding: '20px 24px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              minWidth: '280px',
            }}
          >
            <div
              style={{
                fontSize: '48px',
                animation: 'pulse 1s ease-in-out infinite',
              }}
            >
              {newBadge.icon}
            </div>
            <div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: colors.accent,
                  marginBottom: '4px',
                }}
              >
                Badge Unlocked!
              </div>
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: colors.text,
                }}
              >
                {newBadge.name}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
