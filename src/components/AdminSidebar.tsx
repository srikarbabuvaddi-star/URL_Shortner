import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Link2,
  FileText,
  ShieldCheck,
  Activity,
  ArrowLeft,
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const adminNavItems = [
    { to: '/admin', end: true, label: 'Overview', icon: <LayoutDashboard size={16} /> },
    { to: '/admin/users', label: 'Users', icon: <Users size={16} /> },
    { to: '/admin/links', label: 'Links', icon: <Link2 size={16} /> },
    { to: '/admin/audit-logs', label: 'Audit Logs', icon: <FileText size={16} /> },
    { to: '/admin/security', label: 'Security', icon: <ShieldCheck size={16} /> },
    { to: '/admin/system', label: 'System', icon: <Activity size={16} /> },
  ];

  return (
    <aside className="app-sidebar" style={{ borderRight: '1px solid var(--border-color)' }}>
      {/* Brand Header */}
      <div
        style={{
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          padding: '0 1.25rem',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <div
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '6px',
            background: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ShieldCheck size={14} color="#FFFFFF" strokeWidth={2.5} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
            urlly
          </span>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              padding: '0.15rem 0.4rem',
              borderRadius: '4px',
              background: 'var(--danger-subtle)',
              color: 'var(--danger)',
              border: '1px solid rgba(200, 51, 56, 0.2)',
              letterSpacing: '0.04em',
            }}
          >
            ADMIN
          </span>
        </div>
      </div>

      {/* Nav items list */}
      <div style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto' }}>
        <div
          style={{
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: '0.25rem 0.5rem 0.45rem',
          }}
        >
          Administration
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          {adminNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Return to Normal App */}
      <div
        style={{
          padding: '0.75rem',
          borderTop: '1px solid var(--border-color)',
          background: '#FAFBFC',
        }}
      >
        <Link
          to="/dashboard"
          className="btn btn-secondary btn-sm"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <ArrowLeft size={13} />
          <span>Exit to App</span>
        </Link>
      </div>
    </aside>
  );
};
