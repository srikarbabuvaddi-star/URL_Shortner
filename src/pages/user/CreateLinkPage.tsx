import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Link2, ArrowLeft, Sparkles, QrCode, Calendar, Layers, Check, Copy, ExternalLink } from 'lucide-react';
import { linkService } from '../../services/linkService';
import { campaignService, Campaign } from '../../services/campaignService';
import { useToast } from '../../context/ToastContext';

export const CreateLinkPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [originalUrl, setOriginalUrl] = useState(searchParams.get('url') || '');
  const [title, setTitle] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [campaignId, setCampaignId] = useState(searchParams.get('campaignId') || '');
  const [channel, setChannel] = useState('');
  const [source, setSource] = useState('');
  const [medium, setMedium] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [generateQr, setGenerateQr] = useState(true);

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [createdResult, setCreatedResult] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    campaignService
      .getCampaigns({ limit: 100 })
      .then((res) => setCampaigns(res.campaigns))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await linkService.createLink({
        originalUrl,
        title: title.trim() || undefined,
        customAlias: customAlias.trim() || undefined,
        campaignId: campaignId || undefined,
        channel: channel.trim() || undefined,
        source: source.trim() || undefined,
        medium: medium.trim() || undefined,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
        generateQr,
      });

      toast.success('Short link generated successfully!');
      setCreatedResult(res.link);
    } catch (err: any) {
      toast.error(err.message || 'Failed to create short link');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!createdResult) return;
    navigator.clipboard.writeText(createdResult.shortUrl);
    setCopied(true);
    toast.success('Short URL copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <button
        type="button"
        onClick={() => navigate('/links')}
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={14} />
        <span>Back to Links</span>
      </button>

      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title">Create New Short Link</h1>
          <p className="page-subtitle">Configure destination URL, custom alias, campaign attribution, and QR vector options.</p>
        </div>
      </div>

      {createdResult ? (
        <div className="card" style={{ padding: '2.5rem', textAlign: 'center', borderColor: 'var(--status-active)' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <Check size={28} />
          </div>

          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Your Short Link is Ready!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Ready to share across your channels. Clicks and dynamic QR scans will be tracked in real-time.
          </p>

          <div
            style={{
              background: 'var(--bg-primary)',
              padding: '1rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              maxWidth: '560px',
              margin: '0 auto 2rem',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.1rem',
                color: 'var(--accent-secondary)',
                fontWeight: 600,
              }}
            >
              {createdResult.shortUrl}
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={handleCopy} className="btn btn-primary btn-sm">
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <a
                href={createdResult.shortUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
              >
                <ExternalLink size={14} />
              </a>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={() => {
                setCreatedResult(null);
                setOriginalUrl('');
                setTitle('');
                setCustomAlias('');
              }}
              className="btn btn-secondary"
            >
              Shorten Another URL
            </button>
            <button
              onClick={() => navigate(`/links/${createdResult.id}`)}
              className="btn btn-primary"
            >
              Manage & View Analytics
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link2 size={18} color="var(--accent-primary)" />
              <span>Core Destination</span>
            </h3>

            {/* Destination URL */}
            <div className="form-group">
              <label className="form-label">
                Destination URL <span style={{ color: 'var(--status-blocked)' }}>*</span>
              </label>
              <input
                type="url"
                className="form-input"
                placeholder="https://example.com/fest-promo/landing-page"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                required
              />
              <span className="form-hint">Only valid http:// and https:// URLs are permitted.</span>
            </div>

            {/* Optional Title */}
            <div className="form-group">
              <label className="form-label">Link Title (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Summer Tech Fest Promo"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <span className="form-hint">A recognizable label for your dashboard overview.</span>
            </div>

            {/* Custom Alias */}
            <div className="form-group">
              <label className="form-label">Custom Alias (Optional)</label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span
                  style={{
                    background: 'var(--bg-tertiary)',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md) 0 0 var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    borderRight: 'none',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.9rem',
                  }}
                >
                  linkpulse.io/
                </span>
                <input
                  type="text"
                  className="form-input"
                  placeholder="custom-slug"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                  pattern="[a-zA-Z0-9_-]+"
                  style={{ borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}
                />
              </div>
              <span className="form-hint">Letters, numbers, dashes, and underscores only. Leave blank for auto-generated 6-character code.</span>
            </div>
          </div>

          {/* Campaign & Channel Attribution */}
          <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={18} color="var(--accent-secondary)" />
              <span>Campaign & Attribution Parameters</span>
            </h3>

            <div className="form-group">
              <label className="form-label">Assign to Campaign (Optional)</label>
              <select
                className="form-select"
                value={campaignId}
                onChange={(e) => setCampaignId(e.target.value)}
              >
                <option value="">No Campaign (Standalone Link)</option>
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {campaignId && (
              <div className="grid-3" style={{ marginTop: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Channel Label</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Poster QR, Instagram"
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">utm_source</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. qr_poster, ig"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">utm_medium</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. offline_print, social"
                    value={medium}
                    onChange={(e) => setMedium(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Expiration & Dynamic QR Settings */}
          <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="#f59e0b" />
              <span>Lifecycle & Dynamic QR Settings</span>
            </h3>

            <div className="form-group">
              <label className="form-label">Expiration Date & Time (Optional)</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                />
              </div>
              <span className="form-hint">After this date, visitors are gracefully routed to an expired link notice page.</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginTop: '1.5rem',
                padding: '1rem',
                background: 'rgba(99, 102, 241, 0.06)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(99, 102, 241, 0.15)',
              }}
            >
              <input
                type="checkbox"
                id="generateQrCheckbox"
                checked={generateQr}
                onChange={(e) => setGenerateQr(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              />
              <label htmlFor="generateQrCheckbox" style={{ cursor: 'pointer', fontSize: '0.9rem' }}>
                <strong>Generate Dynamic QR Code:</strong> Automatically create high-resolution PNG & SVG vector QR code containing the short link.
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button type="button" onClick={() => navigate('/links')} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              <span>{loading ? 'Generating...' : 'Create Short Link'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
