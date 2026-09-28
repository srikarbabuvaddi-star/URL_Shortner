import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Link2, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      await register(name.trim(), email.trim(), password);
      toast.success('Account created successfully! Welcome to urlly.');
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
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
        {/* Left Column: Value Prop */}
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
              Start shortening with superpowers.
            </h2>
            <p className="text-secondary" style={{ fontSize: '13.5px', lineHeight: 1.6, marginBottom: '2rem' }}>
              Turn raw links into intelligent marketing assets. Organize links by campaign, compare sources, and generate dynamic QR codes in one click.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <Check size={16} color="var(--success)" />
                <span>Unlimited custom short links & vanity slugs</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <Check size={16} color="var(--success)" />
                <span>Multi-channel campaign attribution</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <Check size={16} color="var(--success)" />
                <span>High-resolution PNG and SVG vector QR codes</span>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Free tier includes full analytics, unlimited redirects, and zero credit card requirement.
          </div>
        </div>

        {/* Right Column: Register Form */}
        <div style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              Create your account
            </h1>
            <p className="text-secondary" style={{ fontSize: '13px' }}>
              Already have an account? <Link to="/login" style={{ fontWeight: 600 }}>Log in</Link>
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
              <label className="form-label">Full name</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

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
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                className="form-input"
                placeholder="At least 8 characters"
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
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
