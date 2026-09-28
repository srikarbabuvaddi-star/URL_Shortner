import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Link2,
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
  BarChart2,
  Clock,
  Calendar,
  Save,
  Power,
  Trash2,
  QrCode,
  Download,
} from 'lucide-react';
import { linkService, Link as LinkItem } from '../../services/linkService';
import { qrService } from '../../services/qrService';
import { Badge } from '../../components/Badge';
import { Skeleton } from '../../components/Skeleton';
import { useToast } from '../../context/ToastContext';

export const LinkDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [link, setLink] = useState<LinkItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Edit form states
  const [originalUrl, setOriginalUrl] = useState('');
  const [title, setTitle] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [copied, setCopied] = useState(false);

  // QR preview state
  const [qrPreview, setQrPreview] = useState<string | null>(null);

  const fetchLink = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await linkService.getLinkById(id);
      setLink(res.link);
      setOriginalUrl(res.link.originalUrl);
      setTitle(res.link.title || '');
      setExpiresAt(res.link.expiresAt ? new Date(res.link.expiresAt).toISOString().slice(0, 16) : '');

      // Load QR preview
      try {
        const qrRes = await qrService.getQrForLink(res.link.id);
        setQrPreview(qrRes.qr.pngDataUrl);
      } catch {
        // ignore
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to load link details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLink();
  }, [id]);

  const handleCopy = () => {
    if (!link) return;
    navigator.clipboard.writeText(link.shortUrl);
    setCopied(true);
    toast.success('Short link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!link) return;
    setSaving(true);

    try {
      const res = await linkService.updateLink(link.id, {
        originalUrl: originalUrl.trim(),
        title: title.trim() || undefined,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
      });
      setLink(res.link);
      toast.success('Link destination and configuration updated!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update link');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!link) return;
    try {
      if (link.status === 'ACTIVE') {
        const res = await linkService.disableLink(link.id);
        setLink(res.link);
        toast.info('Link is now disabled');
      } else {
        const res = await linkService.enableLink(link.id);
        setLink(res.link);
        toast.success('Link is now active');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to toggle status');
    }
  };

  const handleDelete = async () => {
    if (!link) return;
    if (!window.confirm(`Permanently delete /${link.shortCode}?`)) return;

    try {
      await linkService.deleteLink(link.id);
      toast.success('Link deleted successfully');
      navigate('/links');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete link');
    }
  };

  const handleDownloadQr = (format: 'png' | 'svg') => {
    if (!link) return;
    qrService.downloadQr(link.id, format, `linkpulse-${link.shortCode}`);
    toast.success(`Downloaded QR Code (${format.toUpperCase()})`);
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <Skeleton height="2rem" width="200px" style={{ marginBottom: '1.5rem' }} />
        <Skeleton height="15rem" style={{ marginBottom: '1.5rem' }} />
        <Skeleton height="12rem" />
      </div>
    );
  }

  if (!link) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h2>Link not found</h2>
        <button onClick={() => navigate('/links')} className="btn btn-secondary" style={{ marginTop: '1rem' }}>
          Back to Links
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      <button
        type="button"
        onClick={() => navigate('/links')}
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={14} />
        <span>Back to Links</span>
      </button>

      {/* Top Banner */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.75rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{link.title || `/${link.shortCode}`}</h1>
              <Badge status={link.status} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.05rem', color: 'var(--accent-secondary)' }}>
                {link.shortUrl}
              </span>
              <button onClick={handleCopy} className="btn btn-sm btn-secondary">
                {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <a href={link.shortUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline">
                <ExternalLink size={14} />
              </a>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Link to={`/links/${link.id}/analytics`} className="btn btn-primary btn-sm">
              <BarChart2 size={16} />
              <span>View Analytics</span>
            </Link>
            <button
              onClick={handleToggleStatus}
              className="btn btn-secondary btn-sm"
              style={{ color: link.status === 'ACTIVE' ? 'var(--status-blocked)' : '#10b981' }}
            >
              <Power size={14} />
              <span>{link.status === 'ACTIVE' ? 'Disable' : 'Enable'}</span>
            </button>
            <button onClick={handleDelete} className="btn btn-danger btn-sm">
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Quick Meta Stats Bar */}
        <div
          style={{
            display: 'flex',
            gap: '2rem',
            borderTop: '1px solid var(--border-subtle)',
            marginTop: '1.5rem',
            paddingTop: '1rem',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Total Clicks: </span>
            <strong style={{ color: 'var(--text-primary)' }}>{link.totalClicks}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Created: </span>
            <strong style={{ color: 'var(--text-primary)' }}>{new Date(link.createdAt).toLocaleDateString()}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Last Activity: </span>
            <strong style={{ color: 'var(--text-primary)' }}>
              {link.lastClickedAt ? new Date(link.lastClickedAt).toLocaleString() : 'No clicks yet'}
            </strong>
          </div>
          {link.campaignName && (
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Campaign: </span>
              <strong style={{ color: 'var(--accent-primary)' }}>{link.campaignName}</strong>
            </div>
          )}
        </div>
      </div>

      <div className="grid-2">
        {/* Destination & Lifecycle Editor */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>Link Destination & Rules</h2>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Destination URL</label>
              <input
                type="url"
                className="form-input"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                required
              />
              <span className="form-hint">
                ✨ <strong>Dynamic Persistence:</strong> Updating this destination will redirect future visitors immediately.
                Existing printed QR codes continue working!
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Link Title</label>
              <input
                type="text"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title label"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Expiration Date (Optional)</label>
              <input
                type="datetime-local"
                className="form-input"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
              <span className="form-hint">Leave blank for indefinite active lifecycle.</span>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.75rem' }} disabled={saving}>
              <Save size={15} />
              <span>{saving ? 'Updating...' : 'Save Changes'}</span>
            </button>
          </form>
        </div>

        {/* Dynamic QR Code Card */}
        <div className="card" style={{ padding: '1.75rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', textAlign: 'left' }}>Dynamic QR Asset</h2>
          {qrPreview ? (
            <div>
              <div
                style={{
                  display: 'inline-block',
                  background: '#ffffff',
                  padding: '1rem',
                  borderRadius: '12px',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                  marginBottom: '1.25rem',
                }}
              >
                <img
                  src={qrPreview}
                  alt={`QR for ${link.shortCode}`}
                  style={{ width: '180px', height: '180px', display: 'block' }}
                />
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                Vectors generated for high-dpi physical prints, event posters, merchandise, and digital displays.
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => handleDownloadQr('png')}
                  className="btn btn-secondary btn-sm"
                >
                  <Download size={14} />
                  <span>Download PNG</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadQr('svg')}
                  className="btn btn-primary btn-sm"
                >
                  <Download size={14} />
                  <span>Download SVG</span>
                </button>
              </div>
            </div>
          ) : (
            <div style={{ padding: '3rem 0', color: 'var(--text-muted)' }}>
              No QR asset generated for this link.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
