import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FolderKanban,
  ArrowLeft,
  Plus,
  BarChart3,
  MousePointerClick,
  Users,
  QrCode,
  Share2,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import { campaignService } from '../../services/campaignService';
import { analyticsService, CampaignAnalyticsData } from '../../services/analyticsService';
import { StatCard } from '../../components/StatCard';
import { Badge } from '../../components/Badge';
import { CampaignAttributionChart } from '../../charts/CampaignAttributionChart';
import { Skeleton } from '../../components/Skeleton';
import { useToast } from '../../context/ToastContext';

export const CampaignDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [campaign, setCampaign] = useState<any | null>(null);
  const [analytics, setAnalytics] = useState<CampaignAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchCampaignData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [campRes, analyticsRes] = await Promise.all([
        campaignService.getCampaignById(id),
        analyticsService.getCampaignAnalytics(id, '30d'),
      ]);
      setCampaign(campRes.campaign);
      setAnalytics(analyticsRes.data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load campaign attribution data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaignData();
  }, [id]);

  const handleCopy = (shortUrl: string, linkId: string) => {
    navigator.clipboard.writeText(shortUrl);
    setCopiedId(linkId);
    toast.success('Short link copied!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading && !campaign) {
    return (
      <div>
        <Skeleton height="2rem" width="200px" style={{ marginBottom: '1.5rem' }} />
        <Skeleton height="6rem" style={{ marginBottom: '1.5rem' }} />
        <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height="5.5rem" />
          ))}
        </div>
        <Skeleton height="18rem" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h2>Campaign not found</h2>
        <button onClick={() => navigate('/campaigns')} className="btn btn-secondary" style={{ marginTop: '1rem' }}>
          Back to Campaigns
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Top Back & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <button
          type="button"
          onClick={() => navigate('/campaigns')}
          className="btn btn-secondary btn-sm"
        >
          <ArrowLeft size={14} />
          <span>Back to Campaigns</span>
        </button>

        <button
          onClick={() => navigate(`/links/create?campaignId=${campaign.id}`)}
          className="btn btn-primary btn-sm"
        >
          <Plus size={15} />
          <span>Add Channel Link</span>
        </button>
      </div>

      {/* Campaign Info Header */}
      <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{campaign.name}</h1>
              <Badge status={campaign.status} />
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '700px', lineHeight: 1.5 }}>
              {campaign.description || 'Campaign multi-channel attribution and performance tracking.'}
            </p>
          </div>
        </div>
      </div>

      {/* Attribution KPI Cards */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <StatCard
          label="Total Clicks"
          value={analytics?.kpis.totalClicks ?? 0}
          icon={<MousePointerClick size={24} />}
          meta="All campaign channels"
        />
        <StatCard
          label="Unique Visitors"
          value={analytics?.kpis.uniqueVisitors ?? 0}
          icon={<Users size={24} />}
          meta="Distinct visitor IDs"
        />
        <StatCard
          label="QR-Attributed Visits"
          value={analytics?.kpis.qrAttributedVisits ?? 0}
          icon={<QrCode size={24} />}
          meta="Poster & Banner QR codes"
        />
        <StatCard
          label="Active Channels"
          value={campaign.links?.length ?? 0}
          icon={<Share2 size={24} />}
          meta="Short links assigned"
        />
      </div>

      {/* Multi-Channel Comparison Bar Chart */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <div>
            <h2 className="card-title">Channel Performance Attribution</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Side-by-side click volume and unique visitors across social channels and physical QR assets
            </p>
          </div>
        </div>
        <CampaignAttributionChart channels={analytics?.channels || []} height={300} />
      </div>

      {/* Campaign Channel Links Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Channel Links Breakdown</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {campaign.links?.length || 0} channels registered
          </span>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Channel / Source</th>
                <th>Short URL</th>
                <th>Destination</th>
                <th>Clicks</th>
                <th>QR Code</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaign.links?.map((link: any) => {
                const meta = link.campaignLinks?.[0];
                const channelName = meta?.channel || link.title || 'Direct';
                const isQr = link.qrCodes?.length > 0 || channelName.toLowerCase().includes('qr');
                const baseUrl = window.location.origin;
                const shortUrl = `${baseUrl}/${link.shortCode}`;

                return (
                  <tr key={link.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{channelName}</span>
                        {isQr && <span className="badge badge-qr">QR Code</span>}
                      </div>
                      {meta?.source && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          utm_source={meta.source} · utm_medium={meta.medium}
                        </span>
                      )}
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--accent-secondary)' }}>
                          /{link.shortCode}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(shortUrl, link.id)}
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                          title="Copy short link"
                        >
                          {copiedId === link.id ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                        </button>
                      </div>
                    </td>

                    <td style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {link.originalUrl}
                    </td>

                    <td>
                      <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                        {link._count?.events || 0}
                      </span>
                    </td>

                    <td>
                      {isQr ? (
                        <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600 }}>Active</span>
                      ) : (
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <Link to={`/links/${link.id}/analytics`} className="btn btn-sm btn-secondary">
                          <BarChart3 size={14} />
                          <span>Analytics</span>
                        </Link>
                        <Link to={`/links/${link.id}`} className="btn btn-sm btn-icon">
                          <ExternalLink size={14} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
