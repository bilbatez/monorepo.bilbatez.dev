import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
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
        gap: '1rem',
      }}
    >
      <h1 style={{ fontSize: '3rem', margin: 0 }}>404</h1>
      <p style={{ color: '#94a3b8' }}>Page not found</p>
      <button
        onClick={() => navigate('/')}
        style={{
          padding: '0.5rem 1.5rem',
          background: '#22c55e',
          color: '#0f0f1a',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        Home
      </button>
    </div>
  );
}
