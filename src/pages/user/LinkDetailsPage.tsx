import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
  BarChart2,
  Calendar,
  Save,
  Power,
  Trash2,
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
    toast.success('Short link copied to clipboard');
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
        toast.info('Link paused');
      } else {
        const res = await linkService.enableLink(link.id);
        setLink(res.link);
        toast.success('Link activated');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!link) return;
    if (!window.confirm(`Are you sure you want to permanently delete /${link.shortCode}?`)) {
      return;
    }
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
    qrService.downloadQr(link.id, format, `urlly-${link.shortCode}`);
    toast.success(`Downloaded QR Code (${format.toUpperCase()})`);
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <Skeleton height="36px" width="120px" style={{ marginBottom: '1.5rem' }} />
        <div className="grid-2">
          <Skeleton height="350px" />
          <Skeleton height="350px" />
        </div>
      </div>
    );
  }

  if (!link) {
    return (
      <div style={{ maxWidth: '600px', margin: '3rem auto', textAlign: 'center' }}>
        <h2>Link not found</h2>
        <p className="text-secondary" style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>
          This link may have been deleted or you do not have permission to view it.
        </p>
        <Link to="/links" className="btn btn-primary">
          Back to links
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate('/links')}
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '1.25rem' }}
      >
        <ArrowLeft size={13} />
        <span>Back to links</span>
      </button>

      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 className="page-title" style={{ fontFamily: 'var(--font-mono)' }}>
              /{link.customAlias || link.shortCode}
            </h1>
            <Badge status={link.status} />
          </div>
          <p className="page-subtitle">{link.title || 'Untitled Short Link'}</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={handleCopy} className="btn btn-secondary btn-sm">
            {copied ? <Check size={13} color="var(--success)" /> : <Copy size={13} />}
            <span>{copied ? 'Copied' : 'Copy link'}</span>
          </button>
          <a
            href={link.shortUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary btn-sm"
          >
            <ExternalLink size={13} />
            <span>Open</span>
          </a>
          <Link to={`/links/${link.id}/analytics`} className="btn btn-primary btn-sm">
            <BarChart2 size={13} />
            <span>Analytics</span>
          </Link>
        </div>
      </div>

      {/* Main Grid: Details Form + QR & Stats */}
      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Left: Configuration & Destination */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Link Configuration</h2>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Created {new Date(link.createdAt).toLocaleDateString()}
            </span>
          </div>

          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Destination URL</label>
              <input
                type="url"
                required
                className="form-input"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
              />
              <span className="form-hint">
                Changing this destination immediately updates all traffic and printed QR codes.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="Descriptive label"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Expiration Date (optional)</label>
              <input
                type="datetime-local"
                className="form-input"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary btn-sm"
              >
                <Save size={13} />
                <span>{saving ? 'Saving...' : 'Save changes'}</span>
              </button>
            </div>
          </form>

          {/* Dangerous Zone */}
          <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--danger)', marginBottom: '0.5rem' }}>
              Management Controls
            </h3>
            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <button
                type="button"
                onClick={handleToggleStatus}
                className="btn btn-secondary btn-sm"
              >
                <Power size={13} color={link.status === 'ACTIVE' ? 'var(--warning)' : 'var(--success)'} />
                <span>{link.status === 'ACTIVE' ? 'Pause link' : 'Enable link'}</span>
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="btn btn-danger btn-sm"
              >
                <Trash2 size={13} />
                <span>Delete link</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: QR Code & Fast Metrics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Clicks Metric */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Performance Summary</h2>
              <Link to={`/links/${link.id}/analytics`} style={{ fontSize: '12px' }}>
                Full report →
              </Link>
            </div>
            <div style={{ display: 'flex', gap: '2rem', padding: '0.5rem 0' }}>
              <div>
                <span className="stat-label">Total Clicks</span>
                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {((link as any)._count?.events ?? 0).toLocaleString()}
                </div>
              </div>
              <div>
                <span className="stat-label">Last Clicked</span>
                <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginTop: '6px' }}>
                  {link.lastClickedAt
                    ? new Date(link.lastClickedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Never'}
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic QR Box */}
          <div className="card" style={{ textAlign: 'center' }}>
            <div className="card-header">
              <h2 className="card-title">Dynamic QR Code</h2>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Evergreen</span>
            </div>

            {qrPreview ? (
              <div>
                <div
                  style={{
                    display: 'inline-block',
                    background: '#FFFFFF',
                    padding: '0.75rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-xs)',
                    marginBottom: '1rem',
                  }}
                >
                  <img
                    src={qrPreview}
                    alt="QR Code"
                    style={{ width: '160px', height: '160px', display: 'block' }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleDownloadQr('png')}
                    className="btn btn-secondary btn-sm"
                  >
                    <Download size={13} />
                    <span>Download PNG</span>
                  </button>
                  <button
                    onClick={() => handleDownloadQr('svg')}
                    className="btn btn-primary btn-sm"
                  >
                    <Download size={13} />
                    <span>Download SVG</span>
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ padding: '2rem 0', color: 'var(--text-muted)', fontSize: '13px' }}>
                QR code is generating...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
