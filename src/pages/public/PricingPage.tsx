import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Zap, Sparkles, Building2 } from 'lucide-react';

export const PricingPage: React.FC = () => {
  return (
    <div style={{ padding: '4rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '980px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '0.65rem' }}>
            Simple, Transparent Pricing
          </h1>
          <p className="text-secondary" style={{ fontSize: '14.5px', maxWidth: '540px', margin: '0 auto' }}>
            Choose the right tier for your projects, campaigns, and growing marketing teams.
          </p>
        </div>

        {/* 3 Pricing Cards: Free, Pro, Business */}
        <div className="grid-3" style={{ alignItems: 'stretch' }}>
          {/* Free */}
          <div className="card" style={{ padding: '2rem 1.75rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>Free</h3>
              <p className="text-secondary" style={{ fontSize: '12.5px', marginTop: '2px' }}>
                For individuals and basic short links
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)' }}>$0</span>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}> / month</span>
            </div>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '13px', marginBottom: '2rem', flex: 1 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Check size={15} color="var(--success)" />
                <span>Up to 500 short links</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Check size={15} color="var(--success)" />
                <span>Dynamic PNG QR codes</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Check size={15} color="var(--success)" />
                <span>30-day analytics retention</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Check size={15} color="var(--success)" />
                <span>Custom vanity slugs</span>
              </li>
            </ul>

            <Link to="/register" className="btn btn-secondary" style={{ width: '100%' }}>
              Get started
            </Link>
          </div>

          {/* Pro (Highlighted) */}
          <div
            className="card"
            style={{
              padding: '2rem 1.75rem',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              borderColor: 'var(--primary)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-11px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'var(--primary)',
                color: '#FFFFFF',
                padding: '0.15rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Popular
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>Pro</h3>
              <p className="text-secondary" style={{ fontSize: '12.5px', marginTop: '2px' }}>
                For growing creators and marketing campaigns
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)' }}>$29</span>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}> / month</span>
            </div>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '13px', marginBottom: '2rem', flex: 1 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Check size={15} color="var(--success)" />
                <span>Unlimited short links</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Check size={15} color="var(--success)" />
                <span>High-res SVG vector QR codes</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Check size={15} color="var(--success)" />
                <span>Multi-channel Campaign Attribution</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Check size={15} color="var(--success)" />
                <span>1-year analytics retention</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Check size={15} color="var(--success)" />
                <span>CSV & JSON data exports</span>
              </li>
            </ul>

            <Link to="/register" className="btn btn-primary" style={{ width: '100%' }}>
              Start Pro trial
            </Link>
          </div>

          {/* Business */}
          <div className="card" style={{ padding: '2rem 1.75rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>Business</h3>
              <p className="text-secondary" style={{ fontSize: '12.5px', marginTop: '2px' }}>
                For high-volume marketing teams
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)' }}>$99</span>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}> / month</span>
            </div>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '13px', marginBottom: '2rem', flex: 1 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Check size={15} color="var(--success)" />
                <span>Everything in Pro</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Check size={15} color="var(--success)" />
                <span>Dedicated SLA & sub-5ms routing</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Check size={15} color="var(--success)" />
                <span>Strict bot filtration engine</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Check size={15} color="var(--success)" />
                <span>Priority email & developer support</span>
              </li>
            </ul>

            <Link to="/register" className="btn btn-secondary" style={{ width: '100%' }}>
              Contact sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
