// A small button that spends points to reveal a hint. It says what it costs, and explains
// itself when it cannot be used.
export default function HintButton({ colors, cost, balance, disabled, onClick }) {
  const cannotAfford = balance < cost;
  const off = disabled || cannotAfford;

  return (
    <button
      onClick={onClick}
      disabled={off}
      aria-label={
        cannotAfford
          ? `Hint costs ${cost} points. You have ${balance}.`
          : `Hint, costs ${cost} points`
      }
      style={{
        minHeight: '44px',
        padding: '0 18px',
        background: 'transparent',
        color: off ? colors.textLight : colors.primaryText,
        border: `2px dashed ${off ? `${colors.textLight}66` : colors.primary}`,
        borderRadius: '999px',
        fontSize: '14px',
        fontWeight: '700',
        cursor: off ? 'default' : 'pointer',
        touchAction: 'manipulation',
      }}
    >
      {cannotAfford ? `Hint: need ${cost} pts` : `Hint (${cost} pts)`}
    </button>
  );
}
