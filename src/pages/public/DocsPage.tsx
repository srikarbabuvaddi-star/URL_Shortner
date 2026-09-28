import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Terminal, 
  Link as LinkIcon, 
  QrCode, 
  BarChart3, 
  ShieldCheck, 
  Copy, 
  Check, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export const DocsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'quickstart' | 'qr' | 'campaigns' | 'analytics' | 'api'>('quickstart');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyCode = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div style={{ padding: '3rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          padding: '0.35rem 0.85rem', 
          borderRadius: '9999px', 
          background: 'rgba(64, 88, 235, 0.08)', 
          border: '1px solid rgba(64, 88, 235, 0.2)',
          color: 'var(--color-primary)',
          fontSize: '0.8rem',
          fontWeight: 600,
          marginBottom: '1rem'
        }}>
          <BookOpen size={15} /> urlly Documentation
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
          Platform Guides & API Reference
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '640px', margin: '0 auto' }}>
          Everything you need to build, track, and scale intelligent short links, dynamic QR campaigns, and attribution analytics.
        </p>
      </div>

      {/* Main Grid: Sidebar Tabs + Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Navigation Sidebar */}
        <div className="card" style={{ padding: '1rem', position: 'sticky', top: '5rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', padding: '0.5rem 0.75rem 0.25rem' }}>
            Documentation
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <button
              onClick={() => setActiveTab('quickstart')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                background: activeTab === 'quickstart' ? 'rgba(64, 88, 235, 0.08)' : 'transparent',
                color: activeTab === 'quickstart' ? 'var(--color-primary)' : 'var(--text-secondary)',
                border: activeTab === 'quickstart' ? '1px solid rgba(64, 88, 235, 0.25)' : 'none',
                fontWeight: activeTab === 'quickstart' ? 600 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <LinkIcon size={15} /> Quickstart Guide
            </button>
            <button
              onClick={() => setActiveTab('qr')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                background: activeTab === 'qr' ? 'rgba(64, 88, 235, 0.08)' : 'transparent',
                color: activeTab === 'qr' ? 'var(--color-primary)' : 'var(--text-secondary)',
                border: activeTab === 'qr' ? '1px solid rgba(64, 88, 235, 0.25)' : 'none',
                fontWeight: activeTab === 'qr' ? 600 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <QrCode size={15} /> Dynamic QR Codes
            </button>
            <button
              onClick={() => setActiveTab('campaigns')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                background: activeTab === 'campaigns' ? 'rgba(64, 88, 235, 0.08)' : 'transparent',
                color: activeTab === 'campaigns' ? 'var(--color-primary)' : 'var(--text-secondary)',
                border: activeTab === 'campaigns' ? '1px solid rgba(64, 88, 235, 0.25)' : 'none',
                fontWeight: activeTab === 'campaigns' ? 600 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <BarChart3 size={15} /> Campaign Attribution
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                background: activeTab === 'analytics' ? 'rgba(64, 88, 235, 0.08)' : 'transparent',
                color: activeTab === 'analytics' ? 'var(--color-primary)' : 'var(--text-secondary)',
                border: activeTab === 'analytics' ? '1px solid rgba(64, 88, 235, 0.25)' : 'none',
                fontWeight: activeTab === 'analytics' ? 600 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <ShieldCheck size={15} /> Privacy & Visitor ID
            </button>
            <button
              onClick={() => setActiveTab('api')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                background: activeTab === 'api' ? 'rgba(64, 88, 235, 0.08)' : 'transparent',
                color: activeTab === 'api' ? 'var(--color-primary)' : 'var(--text-secondary)',
                border: activeTab === 'api' ? '1px solid rgba(64, 88, 235, 0.25)' : 'none',
                fontWeight: activeTab === 'api' ? 600 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <Terminal size={15} /> REST API Reference
            </button>
          </div>

          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-main)', fontSize: '0.85rem' }}>
            <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.8rem' }}>Ready to launch?</div>
            <Link to="/register" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Create Account
            </Link>
          </div>
        </div>

        {/* Content Pane */}
        <div>
          {/* TAB 1: QUICKSTART */}
          {activeTab === 'quickstart' && (
            <div className="card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                Quickstart Guide
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                urlly is an intelligent URL management and campaign attribution platform. It provides sub-5ms Redis-backed redirects, dynamic vector QR codes, and multi-channel attribution comparison.
              </p>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                1. Shorten a Link
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                Navigate to your dashboard, click <strong>Create link</strong>, and paste any valid HTTP or HTTPS destination. You can optionally specify a custom alias (e.g., <code style={{ color: 'var(--color-primary)', background: 'var(--bg-app)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>urlly.app/summer-sale</code>) and set an expiration date.
              </p>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                2. Real-Time Redirect Path
              </h3>
              <div style={{ 
                background: 'var(--bg-app)', 
                border: '1px solid var(--border-main)', 
                borderRadius: 'var(--radius-sm)', 
                padding: '1.25rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                marginBottom: '1.5rem'
              }}>
                <div>Visitor clicks: <span style={{ color: 'var(--color-primary)' }}>https://urlly.app/a8K2xP</span></div>
                <div>1. Fast Lookup: Redis Cache / In-Memory (sub-5ms)</div>
                <div>2. Status Verification: ACTIVE, BLOCKED, DISABLED, or EXPIRED</div>
                <div>3. Analytics Enqueued: Micro-batch worker processes event asynchronously</div>
                <div>4. Response: HTTP 302 redirect to original destination</div>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                3. Active Status vs. Activity
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                In urlly, <strong>Status</strong> (<code style={{ color: 'var(--color-success)' }}>ACTIVE</code>, <code style={{ color: 'var(--color-warning)' }}>PAUSED</code>, <code style={{ color: 'var(--color-danger)' }}>EXPIRED</code>, <code style={{ color: 'var(--color-danger)' }}>BLOCKED</code>) controls whether a link is currently permitted to redirect visitors. Live click traffic is tracked separately via <code style={{ color: 'var(--color-primary)' }}>last_clicked_at</code> and time-series aggregation.
              </p>
            </div>
          )}

          {/* TAB 2: DYNAMIC QR CODES */}
          {activeTab === 'qr' && (
            <div className="card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                Dynamic QR Code System
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                urlly generates true <strong>Dynamic QR Codes</strong>. The matrix encodes your short URL, never the final destination.
              </p>

              <div style={{ 
                background: 'rgba(64, 88, 235, 0.05)', 
                border: '1px solid rgba(64, 88, 235, 0.2)', 
                borderRadius: 'var(--radius-sm)', 
                padding: '1.25rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{ fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  Why Dynamic QR Codes Matter:
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
                  If you print 5,000 posters or flyers with a QR code and later change your landing page URL, you do <strong>not</strong> need to reprint. Update the target destination in urlly and your existing physical QR codes will redirect to the new page immediately.
                </p>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                Supported Formats & Download
              </h3>
              <ul style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.8, paddingLeft: '1.25rem' }}>
                <li><strong>PNG Raster:</strong> 1024x1024 high-resolution format perfect for digital displays and social flyers.</li>
                <li><strong>SVG Vector:</strong> Infinite resolution vector graphics required by professional print shops and billboard designers.</li>
                <li><strong>Download Tracking:</strong> urlly automatically increments and tracks download statistics whenever team members export QR assets.</li>
              </ul>
            </div>
          )}

          {/* TAB 3: CAMPAIGNS */}
          {activeTab === 'campaigns' && (
            <div className="card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                Multi-Channel Campaign Attribution
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Organize multiple short links and QR codes under a unified marketing campaign to directly measure and compare which channel generates the highest return on investment.
              </p>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                Example: Product Launch Campaign
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                All links point to the same destination (<code style={{ color: 'var(--text-secondary)' }}>https://example.com/launch</code>), but each channel receives a dedicated tracking short link:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-main)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Instagram Story</div>
                  <div style={{ fontWeight: 700, color: 'var(--color-primary)', marginTop: '0.25rem' }}>/insta01</div>
                </div>
                <div style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-main)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Newsletter Link</div>
                  <div style={{ fontWeight: 700, color: 'var(--color-success)', marginTop: '0.25rem' }}>/news01</div>
                </div>
                <div style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-main)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Flyer Poster QR</div>
                  <div style={{ fontWeight: 700, color: 'var(--color-warning)', marginTop: '0.25rem' }}>/qr01</div>
                </div>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                urlly calculates <strong>QR-attributed visits</strong> alongside standard web clicks so you can immediately see whether physical posters outperformed digital social ads.
              </p>
            </div>
          )}

          {/* TAB 4: PRIVACY & ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                Privacy-First Analytics & Visitor Tracking
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                urlly provides enterprise-grade analytics while respecting user privacy and complying with GDPR, CCPA, and global privacy mandates.
              </p>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                Zero Raw IP Storage
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                Raw IP addresses are never written to disk. Incoming IPs are transformed using HMAC-SHA256 with a secure server-side secret key:
              </p>

              <div style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-main)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>
                ip_hash = HMAC_SHA256(raw_ip, ANALYTICS_HASH_SECRET)
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                Total Clicks vs. Unique Visitors
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                urlly avoids equating total clicks with unique visitors. We issue a privacy-conscious, partitioned cookie (<code style={{ color: 'var(--text-main)' }}>lp_vid</code>) to estimate unique visitors over time while cleanly isolating web crawlers (<code style={{ color: 'var(--color-danger)' }}>is_bot: true</code>).
              </p>
            </div>
          )}

          {/* TAB 5: REST API */}
          {activeTab === 'api' && (
            <div className="card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                REST API Reference
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Integrate urlly programmatically into your own applications, CI/CD pipelines, or marketing automation systems.
              </p>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                Create Short Link (POST /api/links)
              </h3>
              <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <pre style={{ 
                  background: 'var(--bg-app)', 
                  border: '1px solid var(--border-main)', 
                  borderRadius: 'var(--radius-sm)', 
                  padding: '1.25rem',
                  color: 'var(--text-main)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  overflowX: 'auto',
                  margin: 0
                }}>
{`curl -X POST http://localhost:5000/api/links \\
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "originalUrl": "https://example.com/summer-sale",
    "title": "Summer Campaign",
    "customAlias": "summer-sale",
    "channel": "Instagram",
    "generateQr": true
  }'`}
                </pre>
                <button
                  onClick={() => copyCode(`curl -X POST http://localhost:5000/api/links \\\n  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "originalUrl": "https://example.com/summer-sale",\n    "title": "Summer Campaign",\n    "customAlias": "summer-sale",\n    "channel": "Instagram",\n    "generateQr": true\n  }'`, 'curl1')}
                  style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-main)',
                    color: 'var(--text-secondary)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.35rem 0.65rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  {copiedKey === 'curl1' ? <Check size={14} color="var(--color-success)" /> : <Copy size={14} />}
                  {copiedKey === 'curl1' ? 'Copied' : 'Copy'}
                </button>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                Export Analytics (GET /api/analytics/export)
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                Download historical analytics directly as CSV or JSON format for data warehouse ingestion:
              </p>
              <div style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-main)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                GET http://localhost:5000/api/analytics/export?linkId={'{linkId}'}&format=csv
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
