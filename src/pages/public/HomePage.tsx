import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Link2,
  QrCode,
  BarChart3,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Globe,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [inputUrl, setInputUrl] = useState('');
  const [createdDemo, setCreatedDemo] = useState<{ shortUrl: string; shortCode: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleQuickShorten = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    if (!user) {
      toast.info('Create a free account to customize and analyze your short links!');
      navigate(`/register?url=${encodeURIComponent(inputUrl.trim())}`);
      return;
    }

    navigate(`/links/create?url=${encodeURIComponent(inputUrl.trim())}`);
  };

  const handleCopyDemo = () => {
    if (!createdDemo) return;
    navigator.clipboard.writeText(createdDemo.shortUrl);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{ padding: '5rem 0 3.5rem', textAlign: 'center', background: '#FFFFFF', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container" style={{ maxWidth: '820px' }}>
          {/* Top Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.3rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--primary-subtle)',
              border: '1px solid rgba(64, 88, 235, 0.2)',
              fontSize: '12px',
              color: 'var(--primary)',
              fontWeight: 600,
              marginBottom: '1.25rem',
            }}
          >
            <Zap size={13} />
            <span>Intelligent URL Management & Attribution Platform</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              color: 'var(--text-primary)',
              marginBottom: '1.25rem',
            }}
          >
            Short links that work as hard as you do.
          </h1>

          <p
            style={{
              fontSize: '16px',
              color: 'var(--text-secondary)',
              maxWidth: '620px',
              margin: '0 auto 2.25rem',
              lineHeight: 1.55,
            }}
          >
            Create branded short URLs, track every click, and understand your audience — all from one clean workspace.
          </p>

          {/* Primary & Secondary CTA */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
            <Link to={user ? '/dashboard' : '/register'} className="btn btn-primary btn-lg">
              <span>Create free link</span>
              <ArrowRight size={15} />
            </Link>
            <Link to="/docs" className="btn btn-secondary btn-lg">
              <span>View docs</span>
            </Link>
          </div>

          {/* Interactive URL Shortening Input */}
          <div
            className="card"
            style={{
              maxWidth: '680px',
              margin: '0 auto',
              padding: '0.65rem',
              boxShadow: 'var(--shadow-md)',
              textAlign: 'left',
            }}
          >
            <form onSubmit={handleQuickShorten} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                <input
                  type="url"
                  required
                  placeholder="https://example.com/your-long-url"
                  className="form-input"
                  style={{ height: '44px', paddingLeft: '2.5rem', border: '1px solid var(--border-color)', fontSize: '13.5px' }}
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                />
                <Link2
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ height: '44px', padding: '0 1.5rem' }}>
                Shorten URL
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Feature Section 1: Link Shortening & Sub-5ms Caching */}
      <section style={{ padding: '4.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem' }}>
            <h2 className="section-title" style={{ fontSize: '24px', marginBottom: '0.5rem' }}>
              Sub-5ms Redirect Engine
            </h2>
            <p className="text-secondary" style={{ fontSize: '14px' }}>
              Built for scale. Lookups are handled in memory and cached via Redis to ensure lightning-fast visitor routing.
            </p>
          </div>

          <div className="grid-3">
            <div className="card">
              <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: 'var(--primary-subtle)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Link2 size={18} />
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '0.35rem' }}>Custom Slugs & Branded Vanity</h3>
              <p className="text-secondary" style={{ fontSize: '13px' }}>
                Replace chaotic long URLs with memorable custom aliases like <code style={{ color: 'var(--primary)' }}>urlly.app/summer</code>.
              </p>
            </div>

            <div className="card">
              <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: 'var(--success-subtle)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Zap size={18} />
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '0.35rem' }}>High-Speed Caching</h3>
              <p className="text-secondary" style={{ fontSize: '13px' }}>
                Redirect hot paths answer in under 5ms directly from memory, while analytics events are queued asynchronously.
              </p>
            </div>

            <div className="card">
              <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: 'var(--warning-subtle)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <ShieldCheck size={18} />
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '0.35rem' }}>Link Lifecycle Controls</h3>
              <p className="text-secondary" style={{ fontSize: '13px' }}>
                Full lifecycle management: Active, Paused, Expired, and Blocked with dedicated branded error landing pages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 2: Analytics & Campaign Attribution */}
      <section style={{ padding: '4.5rem 0', background: '#FFFFFF', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center', gap: '3.5rem' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
                Attribution & Analytics
              </div>
              <h2 style={{ fontSize: '26px', fontWeight: 700, lineHeight: 1.25, marginBottom: '1rem' }}>
                Measure real ROI across all marketing channels.
              </h2>
              <p className="text-secondary" style={{ fontSize: '14px', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Group links under unified marketing campaigns (e.g., <em>Tech Fest 2026</em>) and compare performance side-by-side: Instagram, WhatsApp, YouTube, and QR codes.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '13.5px' }}>
                  <CheckCircle2 size={16} color="var(--success)" />
                  <span>Unique visitor tracking without inflating repeat clicks</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '13.5px' }}>
                  <CheckCircle2 size={16} color="var(--success)" />
                  <span>Device (mobile vs desktop), browser, OS, and country breakdowns</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '13.5px' }}>
                  <CheckCircle2 size={16} color="var(--success)" />
                  <span>Automated crawler and search engine bot classification</span>
                </div>
              </div>
            </div>

            {/* Mock Visual Metric Card */}
            <div className="card" style={{ padding: '1.75rem', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Campaign Attribution</div>
                  <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Summer Launch 2026</h3>
                </div>
                <span className="badge badge-active">Active</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {[
                  { channel: 'Instagram Stories', clicks: '4,280', pct: '48%', color: '#4058EB' },
                  { channel: 'Campus Poster QR', clicks: '2,940', pct: '33%', color: '#0BA5E9' },
                  { channel: 'WhatsApp Broadcast', clicks: '1,680', pct: '19%', color: '#15935A' },
                ].map((item) => (
                  <div key={item.channel} style={{ background: 'var(--bg-primary)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 500 }}>{item.channel}</span>
                      <span style={{ fontWeight: 600 }}>{item.clicks} clicks</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: '#ECEEF2', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: item.pct, height: '100%', background: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 3: Dynamic QR Codes */}
      <section style={{ padding: '4.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center', gap: '3.5rem' }}>
            <div className="card" style={{ textAlign: 'center', padding: '2.5rem' }}>
              <div
                style={{
                  display: 'inline-block',
                  background: '#FFFFFF',
                  padding: '1rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-sm)',
                  marginBottom: '1rem',
                }}
              >
                <QrCode size={160} color="#14171F" />
              </div>
              <div style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: 600 }}>
                urlly.app/summer
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                PNG & SVG vector export supported
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
                Dynamic QR Technology
              </div>
              <h2 style={{ fontSize: '26px', fontWeight: 700, lineHeight: 1.25, marginBottom: '1rem' }}>
                Evergreen printed collateral that never goes obsolete.
              </h2>
              <p className="text-secondary" style={{ fontSize: '14px', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Dynamic QR codes encode the short link, never the destination. If you update your destination URL next week, existing printed posters, banners, and stickers continue to work flawlessly.
              </p>
              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Generate dynamic QR
                </Link>
                <Link to="/docs" className="btn btn-secondary btn-sm">
                  Read documentation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 4: Privacy & Security */}
      <section style={{ padding: '4.5rem 0', background: '#FFFFFF', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container" style={{ maxWidth: '880px', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
            Privacy & Trust
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '1rem' }}>
            Zero raw IP tracking. Fully GDPR & CCPA compliant.
          </h2>
          <p className="text-secondary" style={{ fontSize: '14px', lineHeight: 1.6, marginBottom: '2.5rem' }}>
            We protect your visitors’ privacy by transforming incoming IPs into irreversible HMAC-SHA256 hashes using a salted secret key. We never write unhashed IP addresses to disk.
          </p>

          <div className="grid-3" style={{ textAlign: 'left' }}>
            <div className="card">
              <Lock size={20} color="var(--primary)" style={{ marginBottom: '0.75rem' }} />
              <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '0.25rem' }}>HMAC IP Anonymization</h3>
              <p className="text-secondary" style={{ fontSize: '12.5px' }}>
                Visitor privacy guaranteed by cryptographic hashing before analytics ingestion.
              </p>
            </div>
            <div className="card">
              <Globe size={20} color="var(--primary)" style={{ marginBottom: '0.75rem' }} />
              <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '0.25rem' }}>Domain Blocklist</h3>
              <p className="text-secondary" style={{ fontSize: '12.5px' }}>
                Platform-wide phishing and spam domain verification on every link creation.
              </p>
            </div>
            <div className="card">
              <ShieldCheck size={20} color="var(--primary)" style={{ marginBottom: '0.75rem' }} />
              <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '0.25rem' }}>Role-Based Access Control</h3>
              <p className="text-secondary" style={{ fontSize: '12.5px' }}>
                Cryptographically isolated user tenancies and strictly protected admin portal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '0.5rem' }}>
            Simple, transparent plans for every team.
          </h2>
          <p className="text-secondary" style={{ fontSize: '14px', marginBottom: '2.5rem' }}>
            Start for free and scale as your campaign traffic grows.
          </p>

          <div style={{ display: 'inline-flex', gap: '1rem', alignItems: 'center' }}>
            <Link to="/pricing" className="btn btn-primary btn-lg">
              <span>View all pricing tiers</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
