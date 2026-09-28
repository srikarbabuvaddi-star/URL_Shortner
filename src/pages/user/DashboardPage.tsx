import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Link2,
  FolderKanban,
  QrCode,
  MousePointerClick,
  Plus,
  Copy,
  Check,
  ExternalLink,
  BarChart2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { linkService, Link as LinkItem } from '../../services/linkService';
import { analyticsService, OverviewAnalyticsData } from '../../services/analyticsService';
import { StatCard } from '../../components/StatCard';
import { Badge } from '../../components/Badge';
import { QrCodeModal } from '../../components/QrCodeModal';
import { EmptyState } from '../../components/EmptyState';
import { Skeleton } from '../../components/Skeleton';
import { useToast } from '../../context/ToastContext';
import { ClicksOverTimeChart } from '../../charts/ClicksOverTimeChart';

export const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [overview, setOverview] = useState<OverviewAnalyticsData | null>(null);
  const [selectedQrLink, setSelectedQrLink] = useState<{ id: string; shortCode: string; title?: string | null } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const navigate = useNavigate();
  const toast = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const [linksRes, overviewRes] = await Promise.all([
        linkService.getLinks({ page: 1, limit: 6 }),
        analyticsService.getOverview(),
      ]);
      setLinks(linksRes.links);
      setOverview(overviewRes.data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCopy = (shortUrl: string, id: string) => {
    navigator.clipboard.writeText(shortUrl);
    setCopiedId(id);
    toast.success('Short URL copied!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatRelativeTime = (dateStr?: string | null) => {
    if (!dateStr) return 'Never clicked';
    const date = new Date(dateStr);
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr ago`;
    return `${diffDays} days ago`;
  };

  return (
    <div>
      {/* Top Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Workspace Dashboard</h1>
          <p className="page-subtitle">Manage links, monitor recent activity, and trigger dynamic QR campaigns.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => navigate('/campaigns/create')} className="btn btn-secondary">
            <FolderKanban size={16} />
            <span>New Campaign</span>
          </button>
          <button onClick={() => navigate('/links/create')} className="btn btn-primary" id="btn-create-link-dashboard">
            <Plus size={16} />
            <span>Create Short Link</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="stat-card">
              <Skeleton width={48} height={48} borderRadius="12px" />
              <div style={{ flex: 1 }}>
                <Skeleton width="60%" height="0.8rem" />
                <Skeleton width="40%" height="1.5rem" style={{ marginTop: '0.5rem' }} />
              </div>
            </div>
          ))
        ) : (
          <>
            <StatCard
              label="Active Links"
              value={overview?.kpis.activeLinks ?? 0}
              icon={<Link2 size={24} />}
              meta={`Total: ${overview?.kpis.totalLinks ?? 0}`}
            />
            <StatCard
              label="Total Clicks"
              value={overview?.kpis.totalClicks ?? 0}
              icon={<MousePointerClick size={24} />}
              meta={`Today: +${overview?.kpis.clicksToday ?? 0}`}
            />
            <StatCard
              label="Campaigns"
              value={overview?.kpis.totalCampaigns ?? 0}
              icon={<FolderKanban size={24} />}
              meta="Multi-channel"
            />
            <StatCard
              label="Dynamic QR Codes"
              value={overview?.kpis.totalQrCodes ?? 0}
              icon={<QrCode size={24} />}
              meta="Vector SVG / PNG"
            />
          </>
        )}
      </div>

      {/* Traffic Trend Visualizer */}
      {overview?.timeline && overview.timeline.length > 0 && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <div>
              <h2 className="card-title">14-Day Traffic Activity</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Redirect volume across all your active short links</p>
            </div>
          </div>
          <ClicksOverTimeChart data={overview.timeline} height={220} />
        </div>
      )}

      {/* Recent Links Management Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Recent Short Links</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Quick management and attribution shortcuts
            </p>
          </div>
          <Link to="/links" className="btn btn-secondary btn-sm">
            <span>View All Links</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div style={{ padding: '1.5rem 0' }}>
            <Skeleton height="3rem" style={{ marginBottom: '0.5rem' }} />
            <Skeleton height="3rem" style={{ marginBottom: '0.5rem' }} />
            <Skeleton height="3rem" />
          </div>
        ) : links.length === 0 ? (
          <EmptyState
            icon={<Link2 size={32} />}
            title="No links created yet"
            description="Shorten your first destination URL to start tracking clicks and generating dynamic QR codes."
            actionText="Create Short Link"
            onAction={() => navigate('/links/create')}
          />
        ) : (
          <div className="table-container" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Link Details</th>
                  <th>Status</th>
                  <th>Last Clicked</th>
                  <th>Clicks</th>
                  <th>QR Code</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {links.map((link) => (
                  <tr key={link.id}>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {link.title || `/${link.shortCode}`}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.8rem',
                              color: 'var(--accent-secondary)',
                            }}
                          >
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
                            maxWidth: '300px',
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
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                          Exp: {new Date(link.expiresAt).toLocaleDateString()}
                        </div>
                      )}
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                        <Clock size={14} color="var(--text-muted)" />
                        <span>{formatRelativeTime(link.lastClickedAt)}</span>
                      </div>
                    </td>

                    <td>
                      <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                        {link.totalClicks}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        onClick={() => setSelectedQrLink({ id: link.id, shortCode: link.shortCode, title: link.title })}
                        className="btn btn-sm btn-outline"
                        title="View Dynamic QR"
                      >
                        <QrCode size={14} />
                        <span>QR</span>
                      </button>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <Link
                          to={`/links/${link.id}/analytics`}
                          className="btn btn-sm btn-secondary"
                          title="View Analytics"
                        >
                          <BarChart2 size={14} />
                          <span>Analytics</span>
                        </Link>
                        <a
                          href={link.shortUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-icon"
                          title="Open Link"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QR Modal */}
      {selectedQrLink && (
        <QrCodeModal
          linkId={selectedQrLink.id}
          shortCode={selectedQrLink.shortCode}
          title={selectedQrLink.title}
          onClose={() => setSelectedQrLink(null)}
        />
      )}
    </div>
  );
};
