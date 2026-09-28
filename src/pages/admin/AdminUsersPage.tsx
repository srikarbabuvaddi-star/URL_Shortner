import React, { useState, useEffect } from 'react';
import { Users, Search, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Badge } from '../../components/Badge';
import { Skeleton } from '../../components/Skeleton';
import { useToast } from '../../context/ToastContext';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const toast = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getUsers({
        page,
        limit: 10,
        search: search.trim() || undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      });
      setUsers(res.users);
      setTotalPages(res.totalPages || 1);
      setTotalUsers(res.total);
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleSuspend = async (user: any) => {
    const reason = window.prompt(`Provide reason for suspending ${user.email}:`, 'Violation of Terms of Service');
    if (!reason) return;

    try {
      await adminService.suspendUser(user.id, reason);
      toast.success(`User ${user.email} suspended`);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || 'Failed to suspend user');
    }
  };

  const handleReactivate = async (user: any) => {
    if (!window.confirm(`Reactivate user ${user.email}?`)) return;

    try {
      await adminService.reactivateUser(user.id);
      toast.success(`User ${user.email} reactivated`);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || 'Failed to reactivate user');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">User Account Governance</h1>
          <p className="page-subtitle">Inspect user registrations, role privileges, and account status.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', flex: '1', maxWidth: '400px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search user by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.4rem', height: '40px', fontSize: '0.85rem' }}
            />
            <Search
              size={15}
              style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
          </div>
          <button type="submit" className="btn btn-secondary btn-sm">
            Search
          </button>
        </form>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['ALL', 'ACTIVE', 'SUSPENDED'].map((s) => (
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
                border: 'none',
                cursor: 'pointer',
                background: statusFilter === s ? '#f43f5e' : 'var(--bg-tertiary)',
                color: statusFilter === s ? '#ffffff' : 'var(--text-secondary)',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '2rem' }}>
            <Skeleton height="3.5rem" style={{ marginBottom: '1rem' }} />
            <Skeleton height="3.5rem" style={{ marginBottom: '1rem' }} />
            <Skeleton height="3.5rem" />
          </div>
        ) : (
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>User Details</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Links</th>
                  <th>Campaigns</th>
                  <th>Joined Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{u.name}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.email}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${u.role === 'ADMIN' ? 'badge-blocked' : 'badge-active'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <Badge status={u.status} />
                    </td>
                    <td>
                      <strong style={{ color: 'var(--text-primary)' }}>{u._count?.links ?? 0}</strong>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--text-primary)' }}>{u._count?.campaigns ?? 0}</strong>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {u.role !== 'ADMIN' && (
                        u.status === 'ACTIVE' ? (
                          <button
                            type="button"
                            onClick={() => handleSuspend(u)}
                            className="btn btn-sm btn-danger"
                          >
                            Suspend
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleReactivate(u)}
                            className="btn btn-sm btn-secondary"
                            style={{ color: '#10b981' }}
                          >
                            Reactivate
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div
            style={{
              padding: '1rem 1.5rem',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Showing {users.length} of {totalUsers} users
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
