import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Zap, Sparkles, Building2 } from 'lucide-react';

export const PricingPage: React.FC = () => {
  return (
    <div style={{ padding: '4rem 0 6rem' }}>
      <div className="container" style={{ maxWidth: '1080px' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
            Simple, Transparent Pricing
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Predictable plans for individual creators, high-growth marketing teams, and global enterprise campaigns.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid-3" style={{ marginBottom: '4rem' }}>
          {/* Starter */}
          <div className="card" style={{ padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              <Zap size={18} />
              <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Starter</span>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0.5rem 0 1.5rem', color: 'var(--text-primary)' }}>
              $0 <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ month</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Essential link shortening and dynamic QR codes for personal projects and small teams.
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem', marginBottom: '2rem', flex: 1 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#10b981" /> Up to 500 short links</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#10b981" /> Dynamic PNG QR codes</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#10b981" /> 30-day analytics retention</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#10b981" /> Custom aliases</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#10b981" /> Standard Bot Filtering</li>
            </ul>

            <Link to="/register" className="btn btn-secondary" style={{ width: '100%' }}>
              Get Started Free
            </Link>
          </div>

          {/* Pro (Highlighted) */}
          <div
            className="card"
            style={{
              padding: '2.5rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              borderColor: 'var(--accent-primary)',
              boxShadow: 'var(--shadow-glow)',
              background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'var(--accent-gradient)',
                color: '#ffffff',
                padding: '0.2rem 0.8rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Most Popular
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-secondary)', marginBottom: '0.5rem' }}>
              <Sparkles size={18} />
              <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Growth Pro</span>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0.5rem 0 1.5rem', color: 'var(--text-primary)' }}>
              $29 <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ month</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Full campaign attribution and high-resolution dynamic vector QR downloads for marketing teams.
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem', marginBottom: '2rem', flex: 1 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#10b981" /> Unlimited short links</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#10b981" /> High-res SVG & PNG QR vectors</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#10b981" /> Multi-channel Campaign Attribution</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#10b981" /> 1-year analytics retention</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#10b981" /> CSV & JSON Raw Exports</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#10b981" /> Link expiration timers</li>
            </ul>

            <Link to="/register" className="btn btn-primary" style={{ width: '100%' }}>
              Start 14-Day Pro Trial
            </Link>
          </div>

          {/* Enterprise */}
          <div className="card" style={{ padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              <Building2 size={18} />
              <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Enterprise</span>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0.5rem 0 1.5rem', color: 'var(--text-primary)' }}>
              $99 <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ month</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Custom domain routing, advanced team RBAC, dedicated SLAs, and automated audit logging.
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem', marginBottom: '2rem', flex: 1 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#10b981" /> Custom branded domains</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#10b981" /> Multi-role RBAC & Admin audit logs</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#10b981" /> 99.99% redirect uptime SLA</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#10b981" /> Unlimited retention history</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#10b981" /> Dedicated Redis cluster integration</li>
            </ul>

            <Link to="/register" className="btn btn-secondary" style={{ width: '100%' }}>
              Contact Enterprise Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
