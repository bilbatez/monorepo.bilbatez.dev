interface HudProps {
  levelName: string;
  onBack: () => void;
}

export default function Hud({ levelName, onBack }: HudProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5rem 1rem',
        background: 'rgba(0,0,0,0.4)',
        color: '#f8fafc',
        fontSize: '0.875rem',
        pointerEvents: 'none',
      }}
    >
      <span style={{ color: '#94a3b8' }}>{levelName}</span>
      <button
        onClick={onBack}
        style={{
          pointerEvents: 'auto',
          background: 'transparent',
          color: '#94a3b8',
          border: '1px solid #374151',
          borderRadius: '4px',
          padding: '0.25rem 0.75rem',
          cursor: 'pointer',
          fontSize: '0.75rem',
        }}
      >
        ← Home
      </button>
    </div>
  );
}
