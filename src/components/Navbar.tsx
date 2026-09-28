import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Link2, ArrowRight, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header
      style={{
        height: '72px',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(9, 13, 22, 0.85)',
        backdropFilter: 'var(--glass-blur)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        className="container"
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
            }}
          >
            <Link2 size={20} color="#ffffff" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Link<span style={{ color: 'var(--accent-secondary)' }}>Pulse</span>
            </span>
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 8px #10b981',
                display: 'inline-block',
                marginLeft: '2px',
              }}
            />
          </div>
        </Link>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
          <Link to="/" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
            Features
          </Link>
          <Link to="/pricing" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
            Pricing
          </Link>
          <Link to="/docs" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
            API Docs
          </Link>
          <Link to="/about" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
            About
          </Link>
        </nav>

        {/* Right CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user ? (
            <button onClick={() => navigate('/dashboard')} className="btn btn-primary btn-sm">
              <User size={15} />
              <span>Go to Dashboard</span>
            </button>
          ) : (
            <>
              <Link to="/login" style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600 }}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <span>Start Free</span>
                <ArrowRight size={15} />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
