import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  BarChart3,
  ArrowLeft,
  Download,
  Calendar,
  MousePointerClick,
  Users,
  Clock,
  ShieldAlert,
  Globe,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import { analyticsService, LinkAnalyticsData } from '../../services/analyticsService';
import { StatCard } from '../../components/StatCard';
import { Badge } from '../../components/Badge';
import { DateRangePicker } from '../../components/DateRangePicker';
import { ClicksOverTimeChart } from '../../charts/ClicksOverTimeChart';
import { DeviceBreakdownChart } from '../../charts/DeviceBreakdownChart';
import { BrowserPieChart } from '../../charts/BrowserPieChart';
import { Skeleton } from '../../components/Skeleton';
import { useToast } from '../../context/ToastContext';

export const LinkAnalyticsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [period, setPeriod] = useState<'today' | '7d' | '30d' | '90d'>('30d');
  const [data, setData] = useState<LinkAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await analyticsService.getLinkAnalytics(id, period);
      setData(res.data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load link analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [id, period]);

  const handleExport = (format: 'csv' | 'json') => {
    if (!id || !data) return;
    analyticsService.exportReport(id, format, `linkpulse-${data.link.shortCode}`);
    toast.success(`Exported analytics as ${format.toUpperCase()}`);
  };

  if (loading && !data) {
    return (
      <div>
        <Skeleton height="2rem" width="200px" style={{ marginBottom: '1.5rem' }} />
        <Skeleton height="8rem" style={{ marginBottom: '1.5rem' }} />
        <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height="6rem" />
          ))}
        </div>
        <Skeleton height="18rem" />
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h2>Analytics data unavailable</h2>
        <button onClick={() => navigate('/links')} className="btn btn-secondary" style={{ marginTop: '1rem' }}>
          Back to Links
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Top Header & Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <button
          type="button"
          onClick={() => navigate('/links')}
          className="btn btn-secondary btn-sm"
        >
          <ArrowLeft size={14} />
          <span>Back to Links</span>
        </button>

        {/* Date Filter & Export */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <DateRangePicker value={period} onChange={(p) => setPeriod(p)} />

          <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
            <button
              onClick={() => handleExport('csv')}
              className="btn btn-secondary btn-sm"
              title="Download CSV report"
            >
              <Download size={14} />
              <span>CSV</span>
            </button>
            <button
              onClick={() => handleExport('json')}
              className="btn btn-secondary btn-sm"
              title="Download JSON report"
            >
              <Download size={14} />
              <span>JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Target Link Context Card */}
      <div className="card" style={{ padding: '1.5rem 2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{data.link.title || `/${data.link.shortCode}`}</h1>
              <Badge status={data.link.status} />
              {data.link.campaign && (
                <span className="badge badge-qr">{data.link.campaign.name}</span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-secondary)' }}>
                /{data.link.shortCode}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>→ {data.link.originalUrl}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to={`/links/${data.link.id}`} className="btn btn-secondary btn-sm">
              Manage Link
            </Link>
          </div>
        </div>
      </div>

      {/* Primary KPI Row */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <StatCard
          label="Total Clicks (Period)"
          value={data.kpis.totalClicks}
          icon={<MousePointerClick size={24} />}
          meta={`All-Time: ${data.kpis.allTimeClicks}`}
        />
        <StatCard
          label="Unique Visitors"
          value={data.kpis.uniqueVisitors}
          icon={<Users size={24} />}
          meta="Estimated by cookie & salt"
        />
        <StatCard
          label="Clicks Today"
          value={data.kpis.clicksToday}
          icon={<Calendar size={24} />}
          meta={`This Week: +${data.kpis.clicksThisWeek}`}
        />
        <StatCard
          label="Traffic Type"
          value={`${data.kpis.humanClicks} Visits`}
          icon={<ShieldAlert size={24} />}
          meta={`Bots filtered: ${data.kpis.botClicks}`}
        />
      </div>

      {/* Traffic Over Time AreaChart */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <div>
            <h2 className="card-title">Clicks & Unique Visitors Over Time</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Dual-layer time series showing aggregate clicks vs distinct visitors
            </p>
          </div>
        </div>
        <ClicksOverTimeChart data={data.timeline} height={280} />
      </div>

      {/* Breakdowns 2-Column Grid: Device & Browser */}
      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Device Breakdown</h2>
          </div>
          <DeviceBreakdownChart data={data.breakdowns.devices} height={240} />
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Top Browsers</h2>
          </div>
          <BrowserPieChart data={data.breakdowns.browsers} height={240} />
        </div>
      </div>

      {/* Breakdowns 2-Column Grid: Country & Referrers */}
      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        {/* Top Referrers */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Traffic Referrers</h2>
          </div>
          {data.breakdowns.referrers.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No referrer data recorded yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {data.breakdowns.referrers.slice(0, 6).map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-primary)' }}>{r.name}</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent-secondary)' }}>{r.count} clicks</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Countries */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Geographic Locations</h2>
          </div>
          {data.breakdowns.countries.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No geographic data recorded yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {data.breakdowns.countries.slice(0, 6).map((c, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-primary)' }}>{c.name}</span>
                  <span style={{ fontWeight: 700, color: '#10b981' }}>{c.count} visits</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Click Events Log */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Event Log</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Latest 20 redirect events</span>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Location</th>
                <th>Device</th>
                <th>Browser & OS</th>
                <th>Referrer</th>
                <th>Traffic Type</th>
              </tr>
            </thead>
            <tbody>
              {data.recentEvents.map((ev) => (
                <tr key={ev.id}>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {new Date(ev.timestamp).toLocaleString()}
                  </td>
                  <td>{ev.country}</td>
                  <td>{ev.deviceType}</td>
                  <td>
                    {ev.browser} on {ev.os}
                  </td>
                  <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {ev.referrer || 'Direct'}
                  </td>
                  <td>
                    {ev.isBot ? (
                      <span className="badge badge-blocked">Bot</span>
                    ) : (
                      <span className="badge badge-active">Human</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
