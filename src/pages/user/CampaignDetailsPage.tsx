import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  MousePointerClick,
  Users,
  QrCode,
  Copy,
  Check,
  ExternalLink,
  BarChart2,
} from 'lucide-react';
import { campaignService } from '../../services/campaignService';
import { analyticsService, CampaignAnalyticsData } from '../../services/analyticsService';
import { StatCard } from '../../components/StatCard';
import { Badge } from '../../components/Badge';
import { DateRangePicker } from '../../components/DateRangePicker';
import { CampaignAttributionChart } from '../../charts/CampaignAttributionChart';
import { Skeleton } from '../../components/Skeleton';
import { useToast } from '../../context/ToastContext';

export const CampaignDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [campaign, setCampaign] = useState<any | null>(null);
  const [analytics, setAnalytics] = useState<CampaignAnalyticsData | null>(null);
  const [period, setPeriod] = useState<'today' | '7d' | '30d' | '90d'>('30d');
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchCampaignData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [campRes, analyticsRes] = await Promise.all([
        campaignService.getCampaignById(id),
        analyticsService.getCampaignAnalytics(id, period),
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
  }, [id, period]);

  const handleCopy = (shortUrl: string, linkId: string) => {
    navigator.clipboard.writeText(shortUrl);
    setCopiedId(linkId);
    toast.success('Short link copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading && !campaign) {
    return (
      <div>
        <Skeleton height="32px" width="120px" style={{ marginBottom: '1.25rem' }} />
        <Skeleton height="40px" width="300px" style={{ marginBottom: '1.5rem' }} />
        <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height="80px" />
          ))}
        </div>
        <Skeleton height="300px" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h2>Campaign not found</h2>
        <button onClick={() => navigate('/campaigns')} className="btn btn-secondary" style={{ marginTop: '1rem' }}>
          Back to campaigns
        </button>
      </div>
    );
  }

  const totalClicks = analytics?.kpis?.totalClicks ?? 0;
  const uniqueVisitors = analytics?.kpis?.uniqueVisitors ?? 0;
  const qrVisits = analytics?.kpis?.qrAttributedVisits ?? (analytics?.channels
    ?.filter((c) => c.isQr)
    ?.reduce((acc, curr) => acc + curr.clicks, 0) ?? 0);

  return (
    <div>
      {/* Top Back & Header */}
      <button
        type="button"
        onClick={() => navigate('/campaigns')}
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '1.25rem' }}
      >
        <ArrowLeft size={13} />
        <span>Back to campaigns</span>
      </button>

      <div className="page-header">
        <div className="page-header-text">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h1 className="page-title">{campaign.name}</h1>
            <Badge status={campaign.status} />
          </div>
          <p className="page-subtitle">{campaign.description || 'Multi-channel attribution workspace'}</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <DateRangePicker value={period} onChange={setPeriod} />
          <button
            onClick={() => navigate(`/links/create?campaignId=${campaign.id}`)}
            className="btn btn-primary btn-sm"
          >
            <Plus size={14} />
            <span>Add link</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <StatCard
          label="Total clicks"
          value={totalClicks.toLocaleString()}
          icon={<MousePointerClick size={16} />}
          meta="All campaign channels"
        />
        <StatCard
          label="Unique visitors"
          value={uniqueVisitors.toLocaleString()}
          icon={<Users size={16} />}
          trend={{ value: 'Estimated', isPositive: true }}
        />
        <StatCard
          label="Channels"
          value={analytics?.channels.length ?? 0}
          icon={<Plus size={16} />}
          meta="Tracked touchpoints"
        />
        <StatCard
          label="QR-Attributed"
          value={qrVisits.toLocaleString()}
          icon={<QrCode size={16} />}
          meta="Scans & physical collateral"
        />
      </div>

      {/* Attribution Chart */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <div>
            <h2 className="card-title">Channel Attribution Comparison</h2>
            <p className="text-secondary" style={{ fontSize: '12.5px', marginTop: '2px' }}>
              Side-by-side performance across digital and QR channels
            </p>
          </div>
        </div>
        <CampaignAttributionChart channels={analytics?.channels || []} height={280} />
      </div>

      {/* Individual Campaign Links */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className="card-title">Campaign Links</h2>
            <p className="text-secondary" style={{ fontSize: '12.5px', marginTop: '2px' }}>
              All tracked links associated with {campaign.name}
            </p>
          </div>
          <button
            onClick={() => navigate(`/links/create?campaignId=${campaign.id}`)}
            className="btn btn-secondary btn-sm"
          >
            <Plus size={13} />
            <span>Add link</span>
          </button>
        </div>

        <div className="table-container" style={{ border: 'none', boxShadow: 'none' }}>
          <table className="table">
            <thead>
              <tr>
                <th>CHANNEL</th>
                <th>SHORT LINK</th>
                <th>DESTINATION</th>
                <th>CLICKS</th>
                <th>UNIQUE</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {analytics?.channels.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No channels created in this campaign yet.
                  </td>
                </tr>
              ) : (
                analytics?.channels.map((chan) => (
                  <tr key={chan.shortCode}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {chan.channel}
                        </span>
                        {chan.isQr && <Badge status="QR" />}
                      </div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: 600 }}>
                          /{chan.shortCode}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(`http://localhost:5000/${chan.shortCode}`, chan.shortCode)}
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                          title="Copy link"
                        >
                          {copiedId === chan.shortCode ? <Check size={13} color="var(--success)" /> : <Copy size={13} />}
                        </button>
                      </div>
                    </td>

                    <td>
                      <span
                        style={{
                          color: 'var(--text-secondary)',
                          fontSize: '12.5px',
                          maxWidth: '240px',
                          display: 'inline-block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {campaign.links?.find((l: any) => l.link.shortCode === chan.shortCode)?.link.originalUrl || 'Destination'}
                      </span>
                    </td>

                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {chan.clicks.toLocaleString()}
                      </span>
                    </td>

                    <td>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {chan.uniqueVisitors.toLocaleString()}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        <a
                          href={`http://localhost:5000/${chan.shortCode}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-icon"
                          title="Open short link"
                        >
                          <ExternalLink size={13} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
