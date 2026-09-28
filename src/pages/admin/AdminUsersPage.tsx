import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
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
        <div className="page-header-text">
          <h1 className="page-title">Users</h1>
          <p className="page-subtitle">Platform user accounts, access levels, and moderation.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          padding: '0.85rem 1rem',
          marginBottom: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.85rem',
        }}
      >
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', flex: '1', maxWidth: '380px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search user by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.1rem', fontSize: '13px', height: '34px' }}
            />
            <Search
              size={14}
              style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
          </div>
          <button type="submit" className="btn btn-secondary btn-sm">
            Search
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginRight: '0.25rem' }}>Status:</span>
          {['ALL', 'ACTIVE', 'SUSPENDED'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setStatusFilter(s);
                setPage(1);
              }}
              style={{
                padding: '0.3rem 0.65rem',
                fontSize: '12px',
                fontWeight: statusFilter === s ? 600 : 500,
                borderRadius: 'var(--radius-xs)',
                border: '1px solid',
                borderColor: statusFilter === s ? 'var(--primary)' : 'var(--border-color)',
                cursor: 'pointer',
                background: statusFilter === s ? 'var(--primary-subtle)' : '#FFFFFF',
                color: statusFilter === s ? 'var(--primary)' : 'var(--text-secondary)',
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
          <div style={{ padding: '1.5rem' }}>
            <Skeleton height="36px" style={{ marginBottom: '0.75rem' }} />
            <Skeleton height="36px" style={{ marginBottom: '0.75rem' }} />
            <Skeleton height="36px" />
          </div>
        ) : users.length === 0 ? (
          <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No users found matching your filters.
          </div>
        ) : (
          <div className="table-container" style={{ border: 'none', boxShadow: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>USER</th>
                  <th>EMAIL</th>
                  <th>ROLE</th>
                  <th>STATUS</th>
                  <th>CREATED</th>
                  <th style={{ textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: 'var(--radius-full)',
                            background: 'var(--primary-subtle)',
                            color: 'var(--primary)',
                            fontSize: '11px',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {u.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '13px' }}>
                          {u.name}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{u.email}</span>
                    </td>

                    <td>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '0.15rem 0.4rem',
                          borderRadius: '3px',
                          background: u.role === 'ADMIN' ? 'var(--danger-subtle)' : 'var(--bg-tertiary)',
                          color: u.role === 'ADMIN' ? 'var(--danger)' : 'var(--text-secondary)',
                        }}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td>
                      <Badge status={u.status} />
                    </td>

                    <td>
                      <span style={{ color: 'var(--text-muted)', fontSize: '12.5px' }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      {u.status === 'ACTIVE' ? (
                        <button
                          type="button"
                          onClick={() => handleSuspend(u)}
                          className="btn btn-secondary btn-sm"
                          style={{ color: 'var(--danger)' }}
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleReactivate(u)}
                          className="btn btn-secondary btn-sm"
                          style={{ color: 'var(--success)' }}
                        >
                          Reactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Showing {users.length} of {totalUsers} users
            </span>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="btn btn-secondary btn-sm"
              >
                <ChevronLeft size={13} /> Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="btn btn-secondary btn-sm"
              >
                Next <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
