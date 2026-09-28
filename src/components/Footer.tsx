import React from 'react';
import { Link } from 'react-router-dom';
import { Link2, ShieldCheck, Zap, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(9, 13, 22, 0.95)',
        padding: '3.5rem 0 2rem',
        marginTop: 'auto',
      }}
    >
      <div className="container">
        <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
          {/* Brand info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'var(--accent-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Link2 size={18} color="#ffffff" />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Link<span style={{ color: 'var(--accent-secondary)' }}>Pulse</span>
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Enterprise-grade URL management, dynamic QR code creation, multi-channel campaign attribution, and
              privacy-conscious visitor analytics.
            </p>
          </div>

          {/* Product links */}
          <div>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.9rem' }}>Product</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <li><Link to="/links" style={{ color: 'var(--text-secondary)' }}>Short Links</Link></li>
              <li><Link to="/qr" style={{ color: 'var(--text-secondary)' }}>Dynamic QR Codes</Link></li>
              <li><Link to="/campaigns" style={{ color: 'var(--text-secondary)' }}>Campaign Attribution</Link></li>
              <li><Link to="/pricing" style={{ color: 'var(--text-secondary)' }}>Pricing & Plans</Link></li>
            </ul>
          </div>

          {/* Developers & Architecture */}
          <div>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.9rem' }}>Developers</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <li><Link to="/docs" style={{ color: 'var(--text-secondary)' }}>REST API Reference</Link></li>
              <li><span style={{ color: 'var(--text-secondary)' }}>Redis Caching Engine</span></li>
              <li><span style={{ color: 'var(--text-secondary)' }}>Background Queues</span></li>
              <li><span style={{ color: 'var(--text-secondary)' }}>PostgreSQL & Prisma</span></li>
            </ul>
          </div>

          {/* Security & Privacy */}
          <div>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.9rem' }}>Security & Trust</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={16} color="#10b981" />
                <span>HMAC IP Anonymization</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Zap size={16} color="#06b6d4" />
                <span>Sub-5ms Redirect Lookups</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Globe size={16} color="#6366f1" />
                <span>Automated Bot Detection</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
          }}
        >
          <span>© {new Date().getFullYear()} LinkPulse Platform. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy Compliant</span>
            <span>GDPR Conscious</span>
            <span>Zero Third-Party Ad Trackers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
