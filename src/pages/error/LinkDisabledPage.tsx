import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Power, Home } from 'lucide-react';

export const LinkDisabledPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');

  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <div className="card" style={{ maxWidth: '520px', padding: '3rem 2rem' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(148, 163, 184, 0.15)',
            color: 'var(--text-secondary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <Power size={32} />
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
          Link Disabled
        </h1>

        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          {code ? (
            <>
              The short link <code style={{ color: 'var(--accent-secondary)' }}>/{code}</code> has been temporarily
              paused or disabled by its owner.
            </>
          ) : (
            'This short link is currently paused and not accepting redirects.'
          )}
        </p>

        <Link to="/" className="btn btn-secondary">
          <Home size={16} />
          <span>Go to LinkPulse</span>
        </Link>
      </div>
    </div>
  );
};
