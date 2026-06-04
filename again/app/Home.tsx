import { useNavigate } from 'react-router-dom';
import { getProgress, unlockedLevels } from '../_progress/cookie';
import { TOTAL_LEVELS } from '../_levels/manifest';

export default function Home() {
  const navigate = useNavigate();
  const { maxLevelPassed } = getProgress();
  const unlocked = unlockedLevels(TOTAL_LEVELS);
  const nextLevel = unlocked[unlocked.length - 1] ?? 1;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#0f0f1a',
        color: '#f8fafc',
        gap: '2rem',
      }}
    >
      <h1
        style={{
          fontSize: '5rem',
          fontWeight: 'bold',
          letterSpacing: '0.1em',
          margin: 0,
          color: '#22c55e',
        }}
      >
        again
      </h1>
      <p style={{ color: '#94a3b8', margin: 0 }}>a platformer</p>

      <button
        onClick={() => navigate(`/play/${nextLevel}`)}
        style={{
          padding: '0.75rem 3rem',
          background: '#22c55e',
          color: '#0f0f1a',
          border: 'none',
          borderRadius: '6px',
          fontSize: '1.25rem',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        {maxLevelPassed === 0 ? 'Play' : 'Continue'}
      </button>

      {maxLevelPassed >= 1 && (
        <button
          onClick={() => navigate('/levels')}
          style={{
            padding: '0.5rem 2rem',
            background: 'transparent',
            color: '#94a3b8',
            border: '1px solid #94a3b8',
            borderRadius: '6px',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          Level Select
        </button>
      )}

      <div
        style={{
          position: 'absolute',
          bottom: '1rem',
          color: '#374151',
          fontSize: '0.75rem',
        }}
      >
        Arrow keys / WASD to move · Space / W / ↑ to jump
      </div>
    </div>
  );
}
