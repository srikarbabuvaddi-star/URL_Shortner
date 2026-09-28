import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Users,
  Link2,
  FolderKanban,
  MousePointerClick,
  QrCode,
  ShieldCheck,
  Activity,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { StatCard } from '../../components/StatCard';
import { Skeleton } from '../../components/Skeleton';
import { useToast } from '../../context/ToastContext';

export const AdminOverviewPage: React.FC = () => {
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const res = await adminService.getOverview();
      setStats(res.stats);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load platform statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f43f5e', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            <ShieldAlert size={16} />
            <span>Platform Governance</span>
          </div>
          <h1 className="page-title">Platform Administration</h1>
          <p className="page-subtitle">Platform-wide overview of users, links, moderation status, and infrastructure health.</p>
        </div>
      </div>

      {loading ? (
        <div className="grid-4" style={{ marginBottom: '2rem' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} height="6.5rem" />
          ))}
        </div>
      ) : stats ? (
        <>
          {/* Row 1: Users & System */}
          <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
            <StatCard
              label="Total Users"
              value={stats.users.total}
              icon={<Users size={24} />}
              meta={`Active: ${stats.users.active} · Suspended: ${stats.users.suspended}`}
            />
            <StatCard
              label="Total Links"
              value={stats.links.total}
              icon={<Link2 size={24} />}
              meta={`Active: ${stats.links.active} · Expired: ${stats.links.expired}`}
            />
            <StatCard
              label="Blocked Links"
              value={stats.links.blocked}
              icon={<AlertTriangle size={24} color="#f43f5e" />}
              meta="Abuse & policy blocks"
            />
            <StatCard
              label="Active Campaigns"
              value={stats.campaigns.total}
              icon={<FolderKanban size={24} />}
              meta="Platform-wide"
            />
          </div>

          {/* Row 2: Traffic & QR breakdown */}
          <div className="grid-4" style={{ marginBottom: '2rem' }}>
            <StatCard
              label="Total Click Events"
              value={stats.traffic.totalEvents}
              icon={<MousePointerClick size={24} />}
              meta="Platform lifetime events"
            />
            <StatCard
              label="Human Visits"
              value={stats.traffic.humanEvents}
              icon={<Users size={24} />}
              meta="Clean visitor traffic"
            />
            <StatCard
              label="Bot Crawlers"
              value={stats.traffic.botEvents}
              icon={<ShieldAlert size={24} />}
              meta="Filtered crawler requests"
            />
            <StatCard
              label="QR-Attributed Visits"
              value={stats.traffic.qrAttributedVisits}
              icon={<QrCode size={24} />}
              meta="Scanned from prints"
            />
          </div>

          {/* Navigation Shortcuts */}
          <div className="grid-3" style={{ marginBottom: '2rem' }}>
            <Link to="/admin/users" className="card card-interactive" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Users size={20} color="var(--accent-primary)" />
                  <h3 style={{ fontSize: '1.15rem' }}>User Management</h3>
                </div>
                <ArrowRight size={16} color="var(--text-muted)" />
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Search users, inspect link counts, and suspend or reactivate accounts.
              </p>
            </Link>

            <Link to="/admin/links" className="card card-interactive" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Link2 size={20} color="#f43f5e" />
                  <h3 style={{ fontSize: '1.15rem' }}>Link Moderation</h3>
                </div>
                <ArrowRight size={16} color="var(--text-muted)" />
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Moderate destination URLs, block abusive links, and inspect owners.
              </p>
            </Link>

            <Link to="/admin/system" className="card card-interactive" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Activity size={20} color="#10b981" />
                  <h3 style={{ fontSize: '1.15rem' }}>System & Infrastructure</h3>
                </div>
                <ArrowRight size={16} color="var(--text-muted)" />
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Inspect database latency, Redis cache state, and background queue jobs.
              </p>
            </Link>
          </div>
        </>
      ) : null}
    </div>
  );
};
