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
    if (!inputUrl) return;

    if (!user) {
      toast.info('Create a free account to manage, customize, and analyze your short links!');
      navigate(`/register?url=${encodeURIComponent(inputUrl)}`);
      return;
    }

    navigate(`/links/create?url=${encodeURIComponent(inputUrl)}`);
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
      <section style={{ padding: '6rem 0 4rem', textAlign: 'center', position: 'relative' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          {/* Top Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              fontSize: '0.85rem',
              color: 'var(--accent-secondary)',
              fontWeight: 600,
              marginBottom: '1.5rem',
            }}
          >
            <Zap size={14} />
            <span>Next-Gen URL Shortening & Campaign Attribution</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              marginBottom: '1.5rem',
            }}
          >
            Intelligent URL Shortening & <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Dynamic QR Analytics
            </span>
          </h1>

          <p
            style={{
              fontSize: '1.2rem',
              color: 'var(--text-secondary)',
              maxWidth: '720px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.6,
            }}
          >
            Don't just shorten links. Track QR scans, attribute multi-channel campaigns, analyze privacy-friendly
            visitors in real time, and update target destinations without changing printed codes.
          </p>

          {/* Quick Shorten Input Bar */}
          <form
            onSubmit={handleQuickShorten}
            style={{
              maxWidth: '680px',
              margin: '0 auto 3rem',
              background: 'rgba(15, 23, 42, 0.9)',
              padding: '0.5rem',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(99, 102, 241, 0.15)',
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '1rem', color: 'var(--text-muted)' }}>
              <Link2 size={20} />
            </div>
            <input
              type="url"
              placeholder="Paste long URL (e.g. https://example.com/fest-promo)..."
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              required
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                outline: 'none',
                padding: '0.5rem 0',
              }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 1.5rem' }}>
              <span>Shorten URL</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Value Highlights */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '2rem',
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} color="#10b981" />
              <span>Sub-5ms Redis Caching</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} color="#10b981" />
              <span>Dynamic QR Vectors (PNG & SVG)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} color="#10b981" />
              <span>Automated Bot Filtering</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} color="#10b981" />
              <span>Multi-User RBAC & Admin Shield</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section style={{ padding: '4rem 0', background: 'rgba(15, 23, 42, 0.4)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>Built for Modern Growth Teams</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-secondary)' }}>
              Complete attribution tracking across social feeds, messaging apps, and physical QR prints.
            </p>
          </div>

          <div className="grid-3">
            <div className="card card-interactive">
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  color: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <QrCode size={24} />
              </div>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>Dynamic QR Technology</h3>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                QR codes embed the dynamic short URL. Modify your destination landing page anytime without having
                to reprint banners, posters, or packaging.
              </p>
            </div>

            <div className="card card-interactive">
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(6, 182, 212, 0.15)',
                  color: 'var(--accent-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <BarChart3 size={24} />
              </div>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>Campaign Channel Attribution</h3>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                Compare conversion performance between Instagram, WhatsApp, YouTube, Campus Posters, and Event Banners
                in side-by-side comparative charts.
              </p>
            </div>

            <div className="card card-interactive">
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>Privacy-First Analytics</h3>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                IP addresses are hashed using HMAC-SHA256 with configurable salt. Unique visitors are calculated
                accurately without tracking user personal data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Real-World Use Case Callout (Tech Fest 2026 example) */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div
            className="card"
            style={{
              padding: '3rem',
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: 'var(--accent-secondary)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                Real-World Demonstration
              </span>
              <h2 style={{ fontSize: '2rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
                Multi-Channel Attribution in Action
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
                Running a national campaign like <strong>"Tech Fest 2026"</strong>? Create dedicated channels pointing
                to the exact same destination while attributing every single click and QR scan:
              </p>

              {/* Attribution Pills */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '1rem',
                  marginBottom: '2rem',
                }}
              >
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Instagram</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#6366f1' }}>/insta01</div>
                  <div style={{ fontSize: '0.75rem', color: '#10b981' }}>Social Media</div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>WhatsApp</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#06b6d4' }}>/wa01</div>
                  <div style={{ fontSize: '0.75rem', color: '#10b981' }}>Direct Groups</div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>YouTube</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f59e0b' }}>/yt01</div>
                  <div style={{ fontSize: '0.75rem', color: '#10b981' }}>Teaser Video</div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Poster QR</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ec4899' }}>/qr01</div>
                  <div style={{ fontSize: '0.75rem', color: '#06b6d4' }}>Dynamic Print</div>
                </div>
              </div>

              <Link to="/register" className="btn btn-primary btn-lg">
                <span>Deploy Your First Campaign</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
