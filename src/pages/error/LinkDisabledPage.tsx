import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PauseCircle, Home, ArrowLeft } from 'lucide-react';

export const LinkDisabledPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');

  return (
    <div
      style={{
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
      }}
    >
      <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '2.5rem', textAlign: 'center' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(98, 106, 120, 0.1)',
            color: 'var(--text-muted)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
          }}
        >
          <PauseCircle size={24} />
        </div>

        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          Link Paused
        </h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
          {code ? (
            <>
              The short link <code style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-main)', background: 'var(--bg-app)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>urlly.app/{code}</code> has been temporarily paused or disabled by its owner and is not currently accepting incoming traffic.
            </>
          ) : (
            'This short link is currently paused and not accepting redirects.'
          )}
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary">
            <Home size={15} />
            <span>Go to urlly</span>
          </Link>
          <Link to="/dashboard" className="btn btn-secondary">
            <ArrowLeft size={15} />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
