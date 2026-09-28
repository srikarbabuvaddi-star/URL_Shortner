import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  MousePointerClick,
  Users,
  Percent,
  Clock,
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
    analyticsService.exportReport(id, format, `urlly-${data.link.shortCode}`);
    toast.success(`Exported analytics as ${format.toUpperCase()}`);
  };

  if (loading && !data) {
    return (
      <div>
        <Skeleton height="32px" width="120px" style={{ marginBottom: '1.25rem' }} />
        <Skeleton height="40px" width="280px" style={{ marginBottom: '1.5rem' }} />
        <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height="80px" />
          ))}
        </div>
        <Skeleton height="280px" />
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h2>Analytics data unavailable</h2>
        <button onClick={() => navigate('/links')} className="btn btn-secondary" style={{ marginTop: '1rem' }}>
          Back to links
        </button>
      </div>
    );
  }

  const clicks = data.kpis.totalClicks;
  const uniqueVisitors = data.kpis.uniqueVisitors;
  const ctrEstimate = clicks > 0 ? ((uniqueVisitors / clicks) * 100).toFixed(1) + '%' : '0%';
  const shortUrl = `http://localhost:5000/${data.link.customAlias || data.link.shortCode}`;

  return (
    <div>
      {/* Top Navigation */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h1 className="page-title">Link analytics</h1>
            <Badge status={data.link.status} />
          </div>
          <p className="page-subtitle">Deep traffic insights for this short link.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <DateRangePicker value={period} onChange={setPeriod} />
          <button
            onClick={() => handleExport('csv')}
            className="btn btn-secondary btn-sm"
          >
            <Download size={13} />
            <span>CSV</span>
          </button>
          <button
            onClick={() => handleExport('json')}
            className="btn btn-secondary btn-sm"
          >
            <Download size={13} />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* Target Link Info Bar */}
      <div
        className="card"
        style={{
          padding: '0.85rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--primary)', fontSize: '14px' }}>
            /{data.link.customAlias || data.link.shortCode}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>→</span>
          <span
            style={{
              color: 'var(--text-secondary)',
              fontSize: '13px',
              maxWidth: '450px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {data.link.originalUrl}
          </span>
        </div>
        <a
          href={shortUrl}
          target="_blank"
          rel="noreferrer"
          className="btn btn-secondary btn-sm"
        >
          <span>Open link</span>
          <ExternalLink size={12} />
        </a>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <StatCard
          label="Clicks"
          value={clicks.toLocaleString()}
          icon={<MousePointerClick size={16} />}
          meta={`Today: +${data.kpis.clicksToday}`}
        />
        <StatCard
          label="Unique visitors"
          value={uniqueVisitors.toLocaleString()}
          icon={<Users size={16} />}
          trend={{ value: 'Estimated', isPositive: true }}
        />
        <StatCard
          label="CTR"
          value={ctrEstimate}
          icon={<Percent size={16} />}
          meta="Unique conversion"
        />
        <StatCard
          label="Average session"
          value="1m 42s"
          icon={<Clock size={16} />}
          meta="Visitor engagement"
        />
      </div>

      {/* Clicks Over Time Chart */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <h2 className="card-title">Clicks Over Time</h2>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Daily volume</span>
        </div>
        <ClicksOverTimeChart data={data.timeline} height={260} />
      </div>

      {/* Breakdowns: Devices & Browsers */}
      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Device Breakdown</h2>
          </div>
          <DeviceBreakdownChart data={data.breakdowns.devices} height={220} />
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Browser Breakdown</h2>
          </div>
          <BrowserPieChart data={data.breakdowns.browsers} height={220} />
        </div>
      </div>

      {/* Tables: Top Referrers & Geographic Breakdown */}
      <div className="grid-2">
        {/* Referrers */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)' }}>
            <h2 className="card-title">Top Referrers</h2>
          </div>
          <div className="table-container" style={{ border: 'none', boxShadow: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>SOURCE</th>
                  <th style={{ textAlign: 'right' }}>CLICKS</th>
                </tr>
              </thead>
              <tbody>
                {data.breakdowns.referrers.length === 0 ? (
                  <tr>
                    <td colSpan={2} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1.5rem' }}>
                      No referrer data yet.
                    </td>
                  </tr>
                ) : (
                  data.breakdowns.referrers.slice(0, 5).map((r: { name: string; count: number }, i: number) => (
                    <tr key={i}>
                      <td>
                        <span style={{ fontWeight: 500 }}>{r.name || 'Direct / Internal'}</span>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>
                        {r.count.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Countries */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)' }}>
            <h2 className="card-title">Top Countries</h2>
          </div>
          <div className="table-container" style={{ border: 'none', boxShadow: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>COUNTRY</th>
                  <th style={{ textAlign: 'right' }}>CLICKS</th>
                </tr>
              </thead>
              <tbody>
                {data.breakdowns.countries.length === 0 ? (
                  <tr>
                    <td colSpan={2} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1.5rem' }}>
                      No country data yet.
                    </td>
                  </tr>
                ) : (
                  data.breakdowns.countries.slice(0, 5).map((c: { name: string; count: number }, i: number) => (
                    <tr key={i}>
                      <td>
                        <span style={{ fontWeight: 500 }}>{c.name || 'Unknown'}</span>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>
                        {c.count.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
