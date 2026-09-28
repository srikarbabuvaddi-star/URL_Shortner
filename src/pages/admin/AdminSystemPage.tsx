import React, { useState, useEffect } from 'react';
import { Activity, Database, Server, RefreshCw, CheckCircle2, Cpu } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { StatCard } from '../../components/StatCard';
import { Skeleton } from '../../components/Skeleton';
import { useToast } from '../../context/ToastContext';

export const AdminSystemPage: React.FC = () => {
  const [health, setHealth] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchHealth = async () => {
    try {
      setLoading(true);
      const res = await adminService.getSystemHealth();
      setHealth(res.health);
    } catch (err: any) {
      toast.error(err.message || 'Failed to inspect system health');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const formatUptime = (seconds?: number) => {
    if (!seconds) return '0s';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Infrastructure Health</h1>
          <p className="page-subtitle">Live health status of database, caching layer, analytics queue, and worker pool.</p>
        </div>
        <button onClick={fetchHealth} className="btn btn-secondary btn-sm" disabled={loading}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {loading && !health ? (
        <div className="grid-4" style={{ marginBottom: '2rem' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height="6.5rem" />
          ))}
        </div>
      ) : health ? (
        <>
          <div className="grid-4" style={{ marginBottom: '2rem' }}>
            <StatCard
              label="Overall Status"
              value={health.status === 'healthy' ? 'Operational' : 'Degraded'}
              icon={<CheckCircle2 size={24} color="#10b981" />}
              meta="All services responding"
            />
            <StatCard
              label="Server Uptime"
              value={formatUptime(health.uptimeSeconds)}
              icon={<Server size={24} />}
              meta="Node.js cluster"
            />
            <StatCard
              label="Database Latency"
              value={`${health.database?.latencyMs ?? 0} ms`}
              icon={<Database size={24} />}
              meta={health.database?.provider || 'PostgreSQL'}
            />
            <StatCard
              label="Memory Footprint"
              value={`${health.memory?.rssMb ?? 0} MB`}
              icon={<Cpu size={24} />}
              meta={`Heap: ${health.memory?.heapUsedMb ?? 0} MB`}
            />
          </div>

          <div className="grid-2">
            {/* Redis & Cache Card */}
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <Server size={20} color="var(--accent-secondary)" />
                <h2 style={{ fontSize: '1.2rem' }}>Redirect Cache Subsystem</h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Cache Engine:</span>
                  <strong>{health.redis?.mode}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Redis Connected:</span>
                  <strong style={{ color: health.redis?.connected ? '#10b981' : 'var(--accent-secondary)' }}>
                    {health.redis?.connected ? 'YES (External Redis)' : 'Resilient In-Memory Mode'}
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Cached Short Codes:</span>
                  <strong>{health.redis?.inMemoryKeys ?? 0} keys</strong>
                </div>
              </div>
            </div>

            {/* Background Analytics Queue */}
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <Activity size={20} color="#10b981" />
                <h2 style={{ fontSize: '1.2rem' }}>Analytics Ingestion Queue</h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Worker Status:</span>
                  <strong style={{ color: '#10b981' }}>{health.queue?.status?.toUpperCase()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Pending Batch Jobs:</span>
                  <strong>{health.queue?.pendingJobs ?? 0} items</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Processing Model:</span>
                  <strong>Non-blocking Async Ingestion</strong>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
