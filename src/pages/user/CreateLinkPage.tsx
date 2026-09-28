import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Check, Copy, ExternalLink, QrCode, BarChart2 } from 'lucide-react';
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
    if (!originalUrl.trim()) {
      toast.error('Destination URL is required');
      return;
    }

    setLoading(true);

    try {
      const res = await linkService.createLink({
        originalUrl: originalUrl.trim(),
        title: title.trim() || undefined,
        customAlias: customAlias.trim() || undefined,
        campaignId: campaignId || undefined,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
        generateQr,
      });

      toast.success('Short link created successfully!');
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
    toast.success('Short URL copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const slugPreview = customAlias.trim() || 'your-slug';

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <button
        type="button"
        onClick={() => navigate('/links')}
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '1.25rem' }}
      >
        <ArrowLeft size={13} />
        <span>Back to links</span>
      </button>

      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div className="page-header-text">
          <h1 className="page-title">Create a short link</h1>
          <p className="page-subtitle">Turn a long URL into a clean, trackable link.</p>
        </div>
      </div>

      {createdResult ? (
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--success-subtle)',
              color: 'var(--success)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <Check size={22} strokeWidth={2.5} />
          </div>

          <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
            Your short link is ready!
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '1.5rem' }}>
            Share this link to start capturing visitor analytics and attribution.
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '0.65rem 1rem',
              marginBottom: '1.5rem',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                fontSize: '13.5px',
                color: 'var(--primary)',
              }}
            >
              {createdResult.shortUrl}
            </span>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button onClick={handleCopy} className="btn btn-secondary btn-sm">
                {copied ? <Check size={13} color="var(--success)" /> : <Copy size={13} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <a
                href={createdResult.shortUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
              >
                <ExternalLink size={13} />
              </a>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button
              onClick={() => {
                setCreatedResult(null);
                setOriginalUrl('');
                setTitle('');
                setCustomAlias('');
              }}
              className="btn btn-secondary"
            >
              Create another
            </button>
            <button
              onClick={() => navigate(`/links/${createdResult.id}`)}
              className="btn btn-primary"
            >
              View link details
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card">
          {/* Destination URL */}
          <div className="form-group">
            <label className="form-label">
              Destination URL <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <input
              type="url"
              required
              className="form-input"
              placeholder="https://example.com/your-long-url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
            />
            <span className="form-hint">Must begin with http:// or https://</span>
          </div>

          {/* Title Optional */}
          <div className="form-group">
            <label className="form-label">Title (optional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Summer Launch Campaign"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Custom Slug */}
          <div className="form-group">
            <label className="form-label">Custom slug (optional)</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  borderRight: 'none',
                  borderTopLeftRadius: 'var(--radius-sm)',
                  borderBottomLeftRadius: 'var(--radius-sm)',
                  padding: '0.6rem 0.75rem',
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                }}
              >
                urlly.app/
              </span>
              <input
                type="text"
                className="form-input"
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                placeholder="summer-sale"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
              />
            </div>
            <span className="form-hint">Leave empty for auto-generated 6-character code</span>
          </div>

          {/* Live Preview Box */}
          <div
            style={{
              background: 'var(--bg-primary)',
              border: '1px dashed var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem',
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Live preview
            </span>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--primary)', fontWeight: 600, marginTop: '2px' }}>
              https://urlly.app/{slugPreview}
            </div>
          </div>

          {/* Campaign Selection */}
          <div className="form-group">
            <label className="form-label">Campaign (optional)</label>
            <select
              className="form-select"
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
            >
              <option value="">No campaign</option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Expiration Date */}
          <div className="form-group">
            <label className="form-label">Expiration date (optional)</label>
            <input
              type="datetime-local"
              className="form-input"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>

          {/* Generate QR Checkbox */}
          <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              id="qrCheckbox"
              checked={generateQr}
              onChange={(e) => setGenerateQr(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            <label htmlFor="qrCheckbox" style={{ fontSize: '13px', color: 'var(--text-primary)', cursor: 'pointer' }}>
              Generate dynamic QR code for this link
            </label>
          </div>

          {/* Submit CTA */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
            <button
              type="button"
              onClick={() => navigate('/links')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Creating...' : 'Create link'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
