// One honeycomb tile. Its size comes from the --hex CSS variable set by the parent,
// so the whole grid scales with the screen.
const HEX_SHAPE = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';

export default function HexButton({ letter, isCenter, onClick, colors }) {
  return (
    // The shadow lives on this wrapper because clip-path would cut it off the button itself
    <div style={{ filter: 'drop-shadow(0 4px 0 rgba(0, 0, 0, 0.16))' }}>
      <button
        onClick={onClick}
        aria-label={`${isCenter ? 'Center letter ' : 'Letter '}${letter}`}
        style={{
          display: 'block',
          width: 'var(--hex)',
          aspectRatio: '1 / 1.1547',
          background: isCenter ? colors.accent : colors.primary,
          border: 'none',
          padding: 0,
          clipPath: HEX_SHAPE,
          color: 'white',
          fontSize: 'calc(var(--hex) * 0.4)',
          fontWeight: '800',
          cursor: 'pointer',
          transition: 'transform 0.12s ease',
          touchAction: 'manipulation',
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.94)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        onTouchStart={(e) => (e.currentTarget.style.transform = 'scale(0.94)')}
        onTouchEnd={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {letter}
      </button>
    </div>
  );
}
