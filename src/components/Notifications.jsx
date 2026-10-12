export default function Notifications({
  colors,
  activeGame,
  showPointsAnimation,
  animatedPoints,
  toasts,
}) {
  const toast = toasts[0];

  return (
    <>
      {/* Points Animation Popup */}
      {showPointsAnimation && (
        <div
          role="status"
          style={{
            position: 'fixed',
            top: activeGame === 'spelling' ? '180px' : '50%',
            left: '50%',
            transform: activeGame === 'spelling' ? 'translateX(-50%)' : 'translate(-50%, -50%)',
            fontSize: '56px',
            fontWeight: '700',
            color: colors.successText,
            animation: 'pointsPop 1.5s ease-out',
            pointerEvents: 'none',
            zIndex: 1000,
            textShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}
        >
          +{animatedPoints}
        </div>
      )}

      {/* Flyover for a badge earned or a theme unlocked. Shown one at a time. */}
      {toast && (
        <div
          key={toast.id}
          style={{
            position: 'fixed',
            top: 'calc(env(safe-area-inset-top) + 124px)',
            right: '12px',
            maxWidth: 'calc(100vw - 24px)',
            animation: 'badgeFlyIn 3s ease-out',
            pointerEvents: 'none',
            zIndex: 1001,
          }}
          role="status"
        >
          <div
            style={{
              background: colors.surface,
              border: `3px solid ${colors.accent}`,
              borderRadius: '20px',
              padding: '14px 20px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              minWidth: '240px',
            }}
          >
            <div
              style={{
                fontSize: '40px',
              }}
            >
              {toast.icon}
            </div>
            <div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: colors.accentText,
                  marginBottom: '4px',
                }}
              >
                {toast.title}
              </div>
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: colors.text,
                }}
              >
                {toast.name}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
