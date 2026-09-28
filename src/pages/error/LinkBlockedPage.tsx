import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';

export const LinkBlockedPage: React.FC = () => {
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
            background: 'rgba(200, 51, 56, 0.08)',
            color: 'var(--color-danger)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
          }}
        >
          <ShieldAlert size={24} />
        </div>

        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          Link Blocked
        </h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
          {code ? (
            <>
              The link <code style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--color-danger)', background: 'rgba(200, 51, 56, 0.08)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>urlly.app/{code}</code> has been flagged and blocked due to suspected security policy violations, malicious redirects, or phishing targets.
            </>
          ) : (
            'This short link has been blocked by urlly security safeguards for policy violations.'
          )}
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary">
            <Home size={15} />
            <span>Go to urlly</span>
          </Link>
          <Link to="/docs" className="btn btn-secondary">
            <span>Security Policy</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
