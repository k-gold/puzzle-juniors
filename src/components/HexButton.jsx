// Hexagon button component - properly proportioned
export default function HexButton({ letter, isCenter, onClick, colors }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '70px',
        height: '70px',
        background: isCenter ? colors.accent : colors.primary,
        border: 'none',
        borderRadius: '12px',
        color: 'white',
        fontSize: '28px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        boxShadow: isCenter
          ? '0 4px 12px rgba(245, 158, 11, 0.3)'
          : '0 4px 12px rgba(99, 102, 241, 0.2)',
        touchAction: 'manipulation',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      onTouchStart={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
      onTouchEnd={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      {letter}
    </button>
  );
}
