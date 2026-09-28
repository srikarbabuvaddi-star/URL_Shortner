import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Link2,
  Search,
  Plus,
  Copy,
  Check,
  ExternalLink,
  BarChart2,
  QrCode,
  Power,
  Trash2,
  Edit3,
} from 'lucide-react';
import { linkService, Link as LinkItem } from '../../services/linkService';
import { Badge } from '../../components/Badge';
import { QrCodeModal } from '../../components/QrCodeModal';
import { EmptyState } from '../../components/EmptyState';
import { Skeleton } from '../../components/Skeleton';
import { useToast } from '../../context/ToastContext';

export const LinksPage: React.FC = () => {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLinks, setTotalLinks] = useState(0);

  const [selectedQr, setSelectedQr] = useState<{ id: string; shortCode: string; title?: string | null } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const navigate = useNavigate();
  const toast = useToast();

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const res = await linkService.getLinks({
        page,
        limit: 10,
        search: search.trim() || undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      });
      setLinks(res.links);
      setTotalPages(res.totalPages || 1);
      setTotalLinks(res.total);
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch links');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLinks();
  };

  const handleCopy = (shortUrl: string, id: string) => {
    navigator.clipboard.writeText(shortUrl);
    setCopiedId(id);
    toast.success('Short URL copied!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleStatus = async (link: LinkItem) => {
    try {
      if (link.status === 'ACTIVE') {
        await linkService.disableLink(link.id);
        toast.info(`Link /${link.shortCode} disabled`);
      } else {
        await linkService.enableLink(link.id);
        toast.success(`Link /${link.shortCode} enabled`);
      }
      fetchLinks();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update link status');
    }
  };

  const handleDelete = async (id: string, shortCode: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete /${shortCode}? This action cannot be undone.`)) {
      return;
    }
    try {
      await linkService.deleteLink(id);
      toast.success(`Link /${shortCode} deleted`);
      fetchLinks();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete link');
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Short Links</h1>
          <p className="page-subtitle">All shortened links, custom aliases, QR codes, and tracking parameters.</p>
        </div>
        <button onClick={() => navigate('/links/create')} className="btn btn-primary" id="btn-create-link">
          <Plus size={16} />
          <span>Create Short Link</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: '1', maxWidth: '400px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search by title, short code, or URL..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.4rem', height: '40px', fontSize: '0.85rem' }}
            />
            <Search
              size={15}
              style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
          </div>
          <button type="submit" className="btn btn-secondary btn-sm">
            Search
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status:</span>
          {['ALL', 'ACTIVE', 'DISABLED', 'EXPIRED'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setStatusFilter(s);
                setPage(1);
              }}
              style={{
                padding: '0.35rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                background: statusFilter === s ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                color: statusFilter === s ? '#ffffff' : 'var(--text-secondary)',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Links Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '2rem' }}>
            <Skeleton height="3.5rem" style={{ marginBottom: '1rem' }} />
            <Skeleton height="3.5rem" style={{ marginBottom: '1rem' }} />
            <Skeleton height="3.5rem" />
          </div>
        ) : links.length === 0 ? (
          <div style={{ padding: '2rem' }}>
            <EmptyState
              icon={<Link2 size={32} />}
              title="No short links found"
              description={search ? `No links matching "${search}"` : 'Create your first short link to start tracking traffic.'}
              actionText={search ? 'Clear Search' : 'Create Short Link'}
              onAction={() => {
                if (search) {
                  setSearch('');
                  setStatusFilter('ALL');
                } else {
                  navigate('/links/create');
                }
              }}
            />
          </div>
        ) : (
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Destination & Short URL</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Clicks</th>
                  <th>QR Code</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {links.map((link) => (
                  <tr key={link.id}>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <Link
                          to={`/links/${link.id}`}
                          style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}
                        >
                          {link.title || `/${link.shortCode}`}
                        </Link>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-secondary)' }}>
                            {link.shortUrl}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(link.shortUrl, link.id)}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                            title="Copy Short URL"
                          >
                            {copiedId === link.id ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                          </button>
                        </div>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            maxWidth: '360px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          → {link.originalUrl}
                        </span>
                      </div>
                    </td>

                    <td>
                      <Badge status={link.status} />
                      {link.expiresAt && (
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          Expires: {new Date(link.expiresAt).toLocaleDateString()}
                        </div>
                      )}
                    </td>

                    <td>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {new Date(link.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>

                    <td>
                      <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                        {link.totalClicks}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        onClick={() => setSelectedQr({ id: link.id, shortCode: link.shortCode, title: link.title })}
                        className="btn btn-sm btn-outline"
                      >
                        <QrCode size={14} />
                        <span>QR</span>
                      </button>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        <Link
                          to={`/links/${link.id}/analytics`}
                          className="btn btn-sm btn-secondary"
                          title="View Analytics"
                        >
                          <BarChart2 size={14} />
                        </Link>
                        <Link
                          to={`/links/${link.id}`}
                          className="btn btn-sm btn-icon"
                          title="Edit Link Details"
                        >
                          <Edit3 size={14} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(link)}
                          className="btn btn-sm btn-icon"
                          title={link.status === 'ACTIVE' ? 'Disable Link' : 'Enable Link'}
                          style={{ color: link.status === 'ACTIVE' ? '#10b981' : 'var(--text-muted)' }}
                        >
                          <Power size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(link.id, link.shortCode)}
                          className="btn btn-sm btn-icon"
                          title="Delete Link"
                          style={{ color: '#f43f5e' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div
            style={{
              padding: '1rem 1.5rem',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Showing {links.length} of {totalLinks} links
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="btn btn-secondary btn-sm"
              >
                Previous
              </button>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', alignSelf: 'center', padding: '0 0.5rem' }}>
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="btn btn-secondary btn-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* QR Modal */}
      {selectedQr && (
        <QrCodeModal
          linkId={selectedQr.id}
          shortCode={selectedQr.shortCode}
          title={selectedQr.title}
          onClose={() => setSelectedQr(null)}
        />
      )}
    </div>
  );
};
