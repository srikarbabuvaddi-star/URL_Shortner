import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';

export const LinkBlockedPage: React.FC = () => {
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
      <div className="card" style={{ maxWidth: '520px', padding: '3rem 2rem', borderColor: 'rgba(244, 63, 94, 0.3)' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(244, 63, 94, 0.15)',
            color: '#f43f5e',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <ShieldAlert size={32} />
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem', color: '#f43f5e' }}>
          Link Blocked
        </h1>

        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          {code ? (
            <>
              The link <code style={{ color: '#f43f5e' }}>/{code}</code> has been blocked by platform administrators
              due to reported policy violations, suspicious activity, or abusive destination targets.
            </>
          ) : (
            'This short link has been blocked by platform security.'
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
