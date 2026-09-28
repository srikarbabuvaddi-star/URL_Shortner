import React from 'react';
import { Link } from 'react-router-dom';
import { Link2, ShieldCheck, Zap, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-color)',
        background: '#FFFFFF',
        padding: '3rem 0 2rem',
        marginTop: 'auto',
      }}
    >
      <div className="container">
        <div className="grid-4" style={{ marginBottom: '2rem' }}>
          {/* Brand info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  background: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Link2 size={15} color="#FFFFFF" strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                urlly
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Intelligent short URLs, dynamic QR codes, and multi-channel campaign attribution.
            </p>
          </div>

          {/* Product links */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Product
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '13px' }}>
              <li><Link to="/links" style={{ color: 'var(--text-secondary)' }}>Links</Link></li>
              <li><Link to="/qr" style={{ color: 'var(--text-secondary)' }}>QR Codes</Link></li>
              <li><Link to="/campaigns" style={{ color: 'var(--text-secondary)' }}>Campaigns</Link></li>
              <li><Link to="/pricing" style={{ color: 'var(--text-secondary)' }}>Pricing</Link></li>
            </ul>
          </div>

          {/* Developers & Architecture */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Developers
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '13px' }}>
              <li><Link to="/docs" style={{ color: 'var(--text-secondary)' }}>REST API Reference</Link></li>
              <li><span style={{ color: 'var(--text-secondary)' }}>Redis Caching Engine</span></li>
              <li><span style={{ color: 'var(--text-secondary)' }}>Background Queues</span></li>
              <li><span style={{ color: 'var(--text-secondary)' }}>PostgreSQL & SQLite</span></li>
            </ul>
          </div>

          {/* Security & Privacy */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Security & Trust
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={14} color="var(--success)" />
                <span>HMAC IP Anonymization</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Zap size={14} color="var(--primary)" />
                <span>Sub-5ms Lookups</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Globe size={14} color="var(--accent-secondary)" />
                <span>Automated Bot Detection</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div
          style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '12px',
            color: 'var(--text-muted)',
          }}
        >
          <span>© {new Date().getFullYear()} urlly Inc. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <Link to="/about" style={{ color: 'var(--text-muted)' }}>About</Link>
            <Link to="/pricing" style={{ color: 'var(--text-muted)' }}>Pricing</Link>
            <Link to="/docs" style={{ color: 'var(--text-muted)' }}>Documentation</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
