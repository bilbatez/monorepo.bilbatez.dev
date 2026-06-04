interface SmallScreenOverlayProps {
  show: boolean;
}

export default function SmallScreenOverlay({ show }: SmallScreenOverlayProps) {
  if (!show) return null;
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0f0f1a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#f8fafc',
        zIndex: 200,
        gap: '1rem',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '3rem' }}>📺</div>
      <h2 style={{ margin: 0, color: '#22c55e' }}>Screen Too Small</h2>
      <p style={{ color: '#94a3b8', maxWidth: '360px' }}>
        Please play on a wider screen — at least 1024px wide is recommended for
        the best experience.
      </p>
    </div>
  );
}
