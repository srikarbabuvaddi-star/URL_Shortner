import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Link2, ArrowRight, ShieldCheck, Zap, BarChart3, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useToast();

  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Welcome back to urlly!');
      navigate(redirectUrl);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const fillUserDemo = () => {
    setEmail('alex@linkpulse.io');
    setPassword('Password123!');
    setErrorMsg('');
  };

  const fillAdminDemo = () => {
    setEmail('admin@linkpulse.io');
    setPassword('AdminPassword2026!');
    setErrorMsg('');
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 120px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '960px',
          padding: 0,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Left Column: Brand & Product Message */}
        <div
          style={{
            background: '#FAFBFC',
            borderRight: '1px solid var(--border-color)',
            padding: '3rem 2.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
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
              <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                urlly
              </span>
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: 700, lineHeight: 1.25, color: 'var(--text-primary)', marginBottom: '0.85rem' }}>
              Intelligent short links & campaign attribution.
            </h2>
            <p className="text-secondary" style={{ fontSize: '13.5px', lineHeight: 1.6, marginBottom: '2rem' }}>
              Join thousands of marketers and engineering teams shortening millions of links with sub-5ms latency and deep privacy-first visitor analytics.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <Check size={16} color="var(--success)" />
                <span>Sub-5ms Redis-backed redirects</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <Check size={16} color="var(--success)" />
                <span>Evergreen dynamic vector QR codes</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <Check size={16} color="var(--success)" />
                <span>HMAC-SHA256 privacy visitor tracking</span>
              </div>
            </div>
          </div>

          {/* Quick Demo Fill Buttons */}
          <div
            style={{
              marginTop: '2rem',
              padding: '0.85rem',
              background: '#FFFFFF',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.45rem' }}>
              Quick Demo Fill
            </span>
            <div style={{ display: 'flex', gap: '0.45rem' }}>
              <button
                type="button"
                onClick={fillUserDemo}
                className="btn btn-secondary btn-sm"
                style={{ flex: 1 }}
              >
                Standard User
              </button>
              <button
                type="button"
                onClick={fillAdminDemo}
                className="btn btn-secondary btn-sm"
                style={{ flex: 1 }}
              >
                Admin User
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Login Form */}
        <div style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              Log in to your account
            </h1>
            <p className="text-secondary" style={{ fontSize: '13px' }}>
              Don't have an account? <Link to="/register" style={{ fontWeight: 600 }}>Create account</Link>
            </p>
          </div>

          {errorMsg && (
            <div
              style={{
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--danger-subtle)',
                color: 'var(--danger)',
                fontSize: '12.5px',
                border: '1px solid rgba(200, 51, 56, 0.2)',
                marginBottom: '1.25rem',
              }}
            >
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                required
                className="form-input"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Password</label>
                <span style={{ fontSize: '12px', color: 'var(--primary)', cursor: 'pointer' }} onClick={() => toast.info('Default demo password is: Password123!')}>
                  Forgot password?
                </span>
              </div>
              <input
                type="password"
                required
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1rem', height: '40px', fontSize: '13.5px' }}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
