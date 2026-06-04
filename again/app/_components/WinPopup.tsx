interface WinPopupProps {
  levelId: number;
  totalLevels: number;
  onNext: () => void;
  onHome: () => void;
}

export default function WinPopup({
  levelId,
  totalLevels,
  onNext,
  onHome,
}: WinPopupProps) {
  const isLast = levelId >= totalLevels;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <div
        style={{
          background: '#1a1a2e',
          border: '1px solid #22c55e',
          borderRadius: '12px',
          padding: '2.5rem 3rem',
          textAlign: 'center',
          color: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        <div style={{ fontSize: '3rem' }}>{isLast ? '🏆' : '🎉'}</div>
        <h2 style={{ margin: 0, fontSize: '1.75rem', color: '#22c55e' }}>
          {isLast ? 'You Beat the Game!' : 'Level Complete!'}
        </h2>
        {!isLast && (
          <p style={{ margin: 0, color: '#94a3b8' }}>Level {levelId} cleared</p>
        )}
        <button
          onClick={isLast ? onHome : onNext}
          style={{
            padding: '0.75rem 2rem',
            background: '#22c55e',
            color: '#0f0f1a',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          {isLast ? 'Return Home' : 'Next Level →'}
        </button>
        {!isLast && (
          <button
            onClick={onHome}
            style={{
              background: 'transparent',
              color: '#94a3b8',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              textDecoration: 'underline',
            }}
          >
            Home
          </button>
        )}
      </div>
    </div>
  );
}
