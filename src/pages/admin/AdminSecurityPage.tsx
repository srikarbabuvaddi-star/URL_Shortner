import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Trash2, AlertOctagon, Globe } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Skeleton } from '../../components/Skeleton';
import { useToast } from '../../context/ToastContext';

export const AdminSecurityPage: React.FC = () => {
  const [domains, setDomains] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDomain, setNewDomain] = useState('');
  const [newReason, setNewReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const toast = useToast();

  const fetchDomains = async () => {
    try {
      setLoading(true);
      const res = await adminService.getBlockedDomains();
      setDomains(res.domains);
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch blocked domains');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) return;

    setSubmitting(true);
    try {
      await adminService.addBlockedDomain(newDomain.trim(), newReason.trim() || undefined);
      toast.success(`Domain "${newDomain.trim()}" added to blocklist!`);
      setNewDomain('');
      setNewReason('');
      fetchDomains();
    } catch (err: any) {
      toast.error(err.message || 'Failed to block domain');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveDomain = async (id: string, domain: string) => {
    if (!window.confirm(`Unblock domain "${domain}"?`)) return;

    try {
      await adminService.removeBlockedDomain(id);
      toast.success(`Domain "${domain}" unblocked`);
      fetchDomains();
    } catch (err: any) {
      toast.error(err.message || 'Failed to unblock domain');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Security</h1>
          <p className="page-subtitle">Prevent malicious redirects, manage domain blocklists, and enforce platform safeguards.</p>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: '1.75rem' }}>
        {/* Add Blocked Domain Form */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
            <AlertOctagon size={18} color="var(--color-danger)" />
            <span>Block Suspicious Domain</span>
          </h2>

          <form onSubmit={handleAddDomain}>
            <div className="form-group">
              <label className="form-label">Domain Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. malicious-phish.com"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                required
              />
              <span className="form-hint">Enter hostname without protocol (no https://).</span>
            </div>

            <div className="form-group">
              <label className="form-label">Reason (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Credential phishing, malware"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-danger" style={{ marginTop: '0.25rem' }} disabled={submitting}>
              <Plus size={15} />
              <span>{submitting ? 'Adding...' : 'Block Domain'}</span>
            </button>
          </form>
        </div>

        {/* Security Rules Overview */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
            <ShieldCheck size={18} color="var(--color-success)" />
            <span>Automated Safeguards</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <div style={{ padding: '0.75rem', background: 'var(--bg-app)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-main)' }}>
              <strong style={{ color: 'var(--text-main)' }}>Protocol Sanitization</strong>
              <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)' }}>Rejects dangerous schemes including <code>javascript:</code>, <code>data:</code>, and <code>file:</code>.</p>
            </div>
            <div style={{ padding: '0.75rem', background: 'var(--bg-app)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-main)' }}>
              <strong style={{ color: 'var(--text-main)' }}>Loop Prevention</strong>
              <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)' }}>Prohibits shortening self-referential urlly URLs to prevent infinite redirect loops.</p>
            </div>
            <div style={{ padding: '0.75rem', background: 'var(--bg-app)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-main)' }}>
              <strong style={{ color: 'var(--text-main)' }}>Sub-5ms Cache Enforcement</strong>
              <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)' }}>Blocked hostnames are checked against in-memory & Redis cache before redirection.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Blocked Domains Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="card-header" style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-main)' }}>
          <h2 className="card-title" style={{ fontSize: '0.95rem' }}>Active Blocked Domains</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{domains.length} blocked</span>
        </div>

        {loading ? (
          <div style={{ padding: '2rem' }}>
            <Skeleton height="3rem" style={{ marginBottom: '0.5rem' }} />
            <Skeleton height="3rem" />
          </div>
        ) : domains.length === 0 ? (
          <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No domains currently blocked.
          </div>
        ) : (
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>DOMAIN</th>
                  <th>REASON</th>
                  <th>DATE BLOCKED</th>
                  <th style={{ textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {domains.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Globe size={15} color="var(--text-muted)" />
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--color-danger)' }}>
                          {d.domain}
                        </span>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {d.reason || 'Admin policy restriction'}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(d.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => handleRemoveDomain(d.id, d.domain)}
                        className="btn btn-sm btn-icon"
                        title="Unblock domain"
                        style={{ color: 'var(--color-danger)' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
