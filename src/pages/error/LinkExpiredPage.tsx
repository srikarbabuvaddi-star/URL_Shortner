import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CalendarX, Home } from 'lucide-react';

export const LinkExpiredPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const expiresAt = searchParams.get('expiresAt');

  const formattedDate = expiresAt
    ? new Date(expiresAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

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
            background: 'rgba(245, 158, 11, 0.15)',
            color: '#f59e0b',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <CalendarX size={32} />
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
          Link Expired
        </h1>

        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          {code && (
            <span>
              The short link <code style={{ color: 'var(--accent-secondary)' }}>/{code}</code> has reached the end of its active lifecycle.
            </span>
          )}
          {formattedDate && (
            <div style={{ marginTop: '0.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              This link expired on: {formattedDate}
            </div>
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
