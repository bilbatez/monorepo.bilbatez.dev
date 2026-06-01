import { useNavigate } from 'react-router-dom';
import { unlockedLevels } from '../_progress/cookie';
import { LEVELS, TOTAL_LEVELS } from '../_levels/manifest';

export default function LevelSelect() {
  const navigate = useNavigate();
  const unlocked = new Set(unlockedLevels(TOTAL_LEVELS));

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#0f0f1a',
        color: '#f8fafc',
        gap: '2rem',
        padding: '2rem',
      }}
    >
      <h2 style={{ margin: 0, fontSize: '2rem', color: '#22c55e' }}>
        Level Select
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '1rem',
          maxWidth: '600px',
        }}
      >
        {LEVELS.map((level) => {
          const isUnlocked = unlocked.has(level.id);
          return (
            <button
              key={level.id}
              disabled={!isUnlocked}
              onClick={() => isUnlocked && navigate(`/play/${level.id}`)}
              style={{
                padding: '1rem 0.5rem',
                background: isUnlocked ? '#1a1a2e' : '#111',
                color: isUnlocked ? '#f8fafc' : '#374151',
                border: `1px solid ${isUnlocked ? '#22c55e' : '#1f2937'}`,
                borderRadius: '6px',
                cursor: isUnlocked ? 'pointer' : 'default',
                fontSize: '0.875rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <span style={{ fontWeight: 'bold' }}>{level.id}</span>
              <span
                style={{
                  fontSize: '0.7rem',
                  color: isUnlocked ? '#94a3b8' : '#1f2937',
                }}
              >
                {level.name}
              </span>
            </button>
          );
        })}
      </div>
      <button
        onClick={() => navigate('/')}
        style={{
          background: 'transparent',
          color: '#94a3b8',
          border: 'none',
          cursor: 'pointer',
          textDecoration: 'underline',
        }}
      >
        ← Back
      </button>
    </div>
  );
}
