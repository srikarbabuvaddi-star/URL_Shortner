import React, { useState, useEffect } from 'react';
import { Search, AlertTriangle, ShieldCheck, ExternalLink } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Badge } from '../../components/Badge';
import { Skeleton } from '../../components/Skeleton';
import { useToast } from '../../context/ToastContext';

export const AdminLinksPage: React.FC = () => {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLinks, setTotalLinks] = useState(0);

  const toast = useToast();

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const res = await adminService.getLinks({
        page,
        limit: 10,
        search: search.trim() || undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      });
      setLinks(res.links);
      setTotalPages(res.totalPages || 1);
      setTotalLinks(res.total);
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch platform links');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, [page, statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLinks();
  };

  const handleBlock = async (link: any) => {
    const reason = window.prompt(`Provide reason for blocking /${link.shortCode}:`, 'Phishing or Policy violation');
    if (!reason) return;

    try {
      await adminService.blockLink(link.id, reason);
      toast.success(`Link /${link.shortCode} blocked`);
      fetchLinks();
    } catch (err: any) {
      toast.error(err.message || 'Failed to block link');
    }
  };

  const handleUnblock = async (link: any) => {
    if (!window.confirm(`Unblock link /${link.shortCode}?`)) return;

    try {
      await adminService.unblockLink(link.id);
      toast.success(`Link /${link.shortCode} unblocked`);
      fetchLinks();
    } catch (err: any) {
      toast.error(err.message || 'Failed to unblock link');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Links</h1>
          <p className="page-subtitle">Inspect destination targets, enforce security policies, and manage short links.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          padding: '1rem 1.25rem',
          marginBottom: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', flex: '1', maxWidth: '380px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search by code, URL, or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.25rem' }}
            />
            <Search
              size={15}
              style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
          </div>
          <button type="submit" className="btn btn-secondary btn-sm">
            Search
          </button>
        </form>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {['ALL', 'ACTIVE', 'BLOCKED', 'DISABLED'].map((s) => (
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
                border: statusFilter === s ? '1px solid var(--color-primary)' : '1px solid var(--border-main)',
                cursor: 'pointer',
                background: statusFilter === s ? 'var(--color-primary)' : 'var(--bg-card)',
                color: statusFilter === s ? '#ffffff' : 'var(--text-secondary)',
                transition: 'all 0.15s ease',
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
            <Skeleton height="3.5rem" style={{ marginBottom: '0.75rem' }} />
            <Skeleton height="3.5rem" style={{ marginBottom: '0.75rem' }} />
            <Skeleton height="3.5rem" />
          </div>
        ) : links.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No platform links match the current query.
          </div>
        ) : (
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>SHORT LINK</th>
                  <th>OWNER</th>
                  <th>DESTINATION</th>
                  <th>STATUS</th>
                  <th>CLICKS</th>
                  <th>CREATED</th>
                  <th style={{ textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {links.map((link) => (
                  <tr key={link.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--color-primary)' }}>
                          urlly.app/{link.shortCode}
                        </span>
                        <a
                          href={`http://localhost:5000/${link.shortCode}`}
                          target="_blank"
                          rel="noreferrer"
                          title="Open short link"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          <ExternalLink size={13} />
                        </a>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                          {link.user?.name || 'Anonymous'}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {link.user?.email || '—'}
                        </span>
                      </div>
                    </td>
                    <td style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                      <a
                        href={link.originalUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--text-secondary)' }}
                        title={link.originalUrl}
                      >
                        {link.originalUrl}
                      </a>
                    </td>
                    <td>
                      <Badge status={link.status} />
                    </td>
                    <td>
                      <strong style={{ color: 'var(--text-main)', fontSize: '0.85rem' }}>
                        {(link.totalClicks || 0).toLocaleString()}
                      </strong>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {new Date(link.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {link.status === 'BLOCKED' ? (
                        <button
                          type="button"
                          onClick={() => handleUnblock(link)}
                          className="btn btn-sm btn-secondary"
                          style={{ color: 'var(--color-success)', borderColor: 'var(--border-main)' }}
                        >
                          <ShieldCheck size={14} />
                          <span>Unblock</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleBlock(link)}
                          className="btn btn-sm btn-danger"
                        >
                          <AlertTriangle size={14} />
                          <span>Block</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div
            style={{
              padding: '0.85rem 1.25rem',
              borderTop: '1px solid var(--border-main)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Showing {links.length} of {totalLinks} platform links
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
    </div>
  );
};
