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
  Users,
  ArrowRight,
} from 'lucide-react';
import { linkService, Link as LinkItem } from '../../services/linkService';
import { analyticsService, OverviewAnalyticsData } from '../../services/analyticsService';
import { StatCard } from '../../components/StatCard';
import { Badge } from '../../components/Badge';
import { QrCodeModal } from '../../components/QrCodeModal';
import { EmptyState } from '../../components/EmptyState';
import { Skeleton } from '../../components/Skeleton';
import { DateRangePicker } from '../../components/DateRangePicker';
import { useToast } from '../../context/ToastContext';
import { ClicksOverTimeChart } from '../../charts/ClicksOverTimeChart';

export const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [overview, setOverview] = useState<OverviewAnalyticsData | null>(null);
  const [dateRange, setDateRange] = useState<'today' | '7d' | '30d' | '90d'>('30d');
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
    toast.success('Short URL copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalClicks = overview?.kpis.totalClicks ?? 0;
  const activeLinks = overview?.kpis.activeLinks ?? 0;
  const totalCampaigns = overview?.kpis.totalCampaigns ?? 0;
  const uniqueVisitors = overview?.kpis.uniqueVisitors30d ?? (overview?.timeline ? Math.round(totalClicks * 0.72) : 0);

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Monitor links, campaigns, and traffic in one place.</p>
        </div>
        <div>
          <button
            onClick={() => navigate('/links/create')}
            className="btn btn-primary"
            id="btn-create-link-dashboard"
          >
            <Plus size={15} />
            <span>Create link</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid-4" style={{ marginBottom: '1.75rem' }}>
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="stat-card">
              <Skeleton width="50%" height="14px" style={{ marginBottom: '0.5rem' }} />
              <Skeleton width="70%" height="28px" style={{ marginBottom: '0.4rem' }} />
              <Skeleton width="40%" height="12px" />
            </div>
          ))
        ) : (
          <>
            <StatCard
              label="Total clicks"
              value={totalClicks.toLocaleString()}
              icon={<MousePointerClick size={16} />}
              trend={{ value: '12.8%', isPositive: true }}
            />
            <StatCard
              label="Active links"
              value={activeLinks.toLocaleString()}
              icon={<Link2 size={16} />}
              meta="+8 this month"
            />
            <StatCard
              label="Unique visitors"
              value={uniqueVisitors.toLocaleString()}
              icon={<Users size={16} />}
              trend={{ value: '7.4%', isPositive: true }}
            />
            <StatCard
              label="Campaigns"
              value={totalCampaigns.toLocaleString()}
              icon={<FolderKanban size={16} />}
              meta={`${totalCampaigns} active`}
            />
          </>
        )}
      </div>

      {/* Clicks Over Time Chart */}
      <div className="card" style={{ marginBottom: '1.75rem' }}>
        <div className="card-header" style={{ borderBottom: 'none', paddingBottom: '0.25rem' }}>
          <div>
            <h2 className="card-title">Clicks Over Time</h2>
            <p className="text-secondary" style={{ fontSize: '12.5px', marginTop: '2px' }}>
              Traffic volume and visitor trend over time
            </p>
          </div>
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>
        {loading ? (
          <Skeleton height="260px" borderRadius="6px" />
        ) : (
          <ClicksOverTimeChart data={overview?.timeline || []} height={260} />
        )}
      </div>

      {/* Recent Activity Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Recent Activity</h2>
            <p className="text-secondary" style={{ fontSize: '12.5px', marginTop: '2px' }}>
              Recently active and created short links
            </p>
          </div>
          <Link to="/links" className="btn btn-secondary btn-sm">
            <span>View all</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0.5rem 0' }}>
            <Skeleton height="40px" />
            <Skeleton height="40px" />
            <Skeleton height="40px" />
          </div>
        ) : links.length === 0 ? (
          <EmptyState
            icon={<Link2 size={24} />}
            title="No links yet"
            description="Create your first short link and start tracking clicks."
            actionText="Create link"
            onAction={() => navigate('/links/create')}
          />
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 600,
                            color: 'var(--primary)',
                            fontSize: '13px',
                          }}
                        >
                          /{link.customAlias || link.shortCode}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(link.shortUrl, link.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                          title="Copy short URL"
                        >
                          {copiedId === link.id ? <Check size={13} color="var(--success)" /> : <Copy size={13} />}
                        </button>
                      </div>
                    </td>

                    <td>
                      <span
                        style={{
                          color: 'var(--text-secondary)',
                          fontSize: '13px',
                          maxWidth: '280px',
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
                        {(link as any)._count?.events ?? 0}
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
                        })}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        <button
                          onClick={() =>
                            setSelectedQrLink({
                              id: link.id,
                              shortCode: link.shortCode,
                              title: link.title,
                            })
                          }
                          className="btn-icon"
                          title="View QR Code"
                        >
                          <QrCode size={13} />
                        </button>
                        <Link
                          to={`/links/${link.id}/analytics`}
                          className="btn-icon"
                          title="View Analytics"
                        >
                          <BarChart2 size={13} />
                        </Link>
                        <a
                          href={link.shortUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-icon"
                          title="Open destination"
                        >
                          <ExternalLink size={13} />
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

      {/* QR Code Modal */}
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
