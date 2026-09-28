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
  ChevronLeft,
  ChevronRight,
  Eye,
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
    toast.success('Short link copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleStatus = async (link: LinkItem) => {
    try {
      if (link.status === 'ACTIVE') {
        await linkService.disableLink(link.id);
        toast.info(`Link /${link.shortCode} paused`);
      } else {
        await linkService.enableLink(link.id);
        toast.success(`Link /${link.shortCode} activated`);
      }
      fetchLinks();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update link status');
    }
  };

  const handleDelete = async (id: string, shortCode: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete /${shortCode}?`)) {
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
        <div className="page-header-text">
          <h1 className="page-title">Links</h1>
          <p className="page-subtitle">Create, organize, and manage all your short links.</p>
        </div>
        <button
          onClick={() => navigate('/links/create')}
          className="btn btn-primary"
          id="btn-create-link"
        >
          <Plus size={15} />
          <span>Create link</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          padding: '0.85rem 1rem',
          marginBottom: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.85rem',
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: '1', maxWidth: '380px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search by slug, title, or URL..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.1rem', fontSize: '13px', height: '34px' }}
            />
            <Search
              size={14}
              style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
          </div>
          <button type="submit" className="btn btn-secondary btn-sm">
            Search
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginRight: '0.25rem' }}>Status:</span>
          {[
            { label: 'All', value: 'ALL' },
            { label: 'Active', value: 'ACTIVE' },
            { label: 'Disabled', value: 'DISABLED' },
            { label: 'Expired', value: 'EXPIRED' },
          ].map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => {
                setStatusFilter(s.value);
                setPage(1);
              }}
              style={{
                padding: '0.3rem 0.65rem',
                fontSize: '12px',
                fontWeight: statusFilter === s.value ? 600 : 500,
                borderRadius: 'var(--radius-xs)',
                border: '1px solid',
                borderColor: statusFilter === s.value ? 'var(--primary)' : 'var(--border-color)',
                cursor: 'pointer',
                background: statusFilter === s.value ? 'var(--primary-subtle)' : '#FFFFFF',
                color: statusFilter === s.value ? 'var(--primary)' : 'var(--text-secondary)',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Links Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '1.5rem' }}>
            <Skeleton height="36px" style={{ marginBottom: '0.75rem' }} />
            <Skeleton height="36px" style={{ marginBottom: '0.75rem' }} />
            <Skeleton height="36px" />
          </div>
        ) : links.length === 0 ? (
          <div style={{ padding: '2rem' }}>
            <EmptyState
              icon={<Link2 size={24} />}
              title="No links yet"
              description={search ? `No links matching "${search}"` : 'Create your first short link and start tracking clicks.'}
              actionText={search ? 'Clear search' : 'Create link'}
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
          <div className="table-container" style={{ border: 'none', boxShadow: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>SHORT LINK</th>
                  <th>DESTINATION</th>
                  <th>CLICKS</th>
                  <th>STATUS</th>
                  <th>CREATED</th>
                  <th style={{ textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {links.map((link) => (
                  <tr key={link.id}>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <Link
                            to={`/links/${link.id}`}
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontWeight: 600,
                              color: 'var(--primary)',
                              fontSize: '13px',
                            }}
                          >
                            /{link.customAlias || link.shortCode}
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleCopy(link.shortUrl, link.id)}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                            title="Copy link"
                          >
                            {copiedId === link.id ? <Check size={13} color="var(--success)" /> : <Copy size={13} />}
                          </button>
                        </div>
                        {link.title && (
                          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                            {link.title}
                          </span>
                        )}
                      </div>
                    </td>

                    <td>
                      <span
                        style={{
                          color: 'var(--text-secondary)',
                          fontSize: '13px',
                          maxWidth: '300px',
                          display: 'inline-block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                        title={link.originalUrl}
                      >
                        {link.originalUrl.replace(/^https?:\/\//, '')}
                      </span>
                    </td>

                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '13px' }}>
                        {((link as any)._count?.events ?? 0).toLocaleString()}
                      </span>
                    </td>

                    <td>
                      <Badge status={link.status} />
                    </td>

                    <td>
                      <span style={{ color: 'var(--text-muted)', fontSize: '12.5px' }}>
                        {new Date(link.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.3rem' }}>
                        <Link
                          to={`/links/${link.id}`}
                          className="btn-icon"
                          title="View details"
                        >
                          <Eye size={13} />
                        </Link>
                        <Link
                          to={`/links/${link.id}/analytics`}
                          className="btn-icon"
                          title="View analytics"
                        >
                          <BarChart2 size={13} />
                        </Link>
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedQr({
                              id: link.id,
                              shortCode: link.shortCode,
                              title: link.title,
                            })
                          }
                          className="btn-icon"
                          title="Generate QR code"
                        >
                          <QrCode size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(link)}
                          className="btn-icon"
                          title={link.status === 'ACTIVE' ? 'Pause link' : 'Enable link'}
                        >
                          <Power size={13} color={link.status === 'ACTIVE' ? 'var(--warning)' : 'var(--success)'} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(link.id, link.shortCode)}
                          className="btn-icon"
                          title="Delete link"
                        >
                          <Trash2 size={13} color="var(--danger)" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Showing {links.length} of {totalLinks} links
            </span>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="btn btn-secondary btn-sm"
              >
                <ChevronLeft size={13} /> Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="btn btn-secondary btn-sm"
              >
                Next <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
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
