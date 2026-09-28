import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { HelpCircle, ArrowLeft, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
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
            background: 'rgba(64, 88, 235, 0.08)',
            color: 'var(--color-primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
          }}
        >
          <HelpCircle size={24} />
        </div>

        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          404 — Link Not Found
        </h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
          {code ? (
            <>
              The short link <code style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--color-primary)', background: 'var(--bg-app)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>urlly.app/{code}</code> could not be found. It may have expired, been mistyped, or deleted by its creator.
            </>
          ) : (
            'The page or short link you are looking for does not exist or may have been moved.'
          )}
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary">
            <Home size={15} />
            <span>Back to Home</span>
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
