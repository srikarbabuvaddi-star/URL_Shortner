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
        height: '60px',
        borderBottom: '1px solid var(--border-color)',
        background: '#FFFFFF',
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
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Link2 size={16} color="#FFFFFF" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            urlly
          </span>
        </Link>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
          <Link to="/" style={{ color: 'var(--text-secondary)', fontSize: '13.5px', fontWeight: 500 }}>
            Features
          </Link>
          <Link to="/pricing" style={{ color: 'var(--text-secondary)', fontSize: '13.5px', fontWeight: 500 }}>
            Pricing
          </Link>
          <Link to="/docs" style={{ color: 'var(--text-secondary)', fontSize: '13.5px', fontWeight: 500 }}>
            Docs
          </Link>
        </nav>

        {/* Right CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {user ? (
            <button onClick={() => navigate('/dashboard')} className="btn btn-primary btn-sm">
              <User size={14} />
              <span>Dashboard</span>
            </button>
          ) : (
            <>
              <Link to="/login" style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 500 }}>
                Log in
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <span>Get started</span>
                <ArrowRight size={13} />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
