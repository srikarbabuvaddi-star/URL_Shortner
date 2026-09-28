import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldX, Home, ArrowLeft } from 'lucide-react';

export const ForbiddenPage: React.FC = () => {
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
          <ShieldX size={32} />
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem', color: '#f43f5e' }}>
          403 — Access Denied
        </h1>

        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          You do not possess administrator credentials or permissions to access this platform administration area.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <Link to="/dashboard" className="btn btn-secondary">
            <ArrowLeft size={16} />
            <span>Return to User Dashboard</span>
          </Link>
          <Link to="/" className="btn btn-primary">
            <Home size={16} />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
