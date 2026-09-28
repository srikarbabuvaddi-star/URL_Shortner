import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  ShieldAlert,
  Users,
  Link2,
  FolderKanban,
  BarChart3,
  ShieldCheck,
  FileText,
  Activity,
  ArrowLeft,
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const adminNavItems = [
    { to: '/admin', end: true, label: 'Overview', icon: <ShieldAlert size={18} /> },
    { to: '/admin/users', label: 'Users', icon: <Users size={18} /> },
    { to: '/admin/links', label: 'Platform Links', icon: <Link2 size={18} /> },
    { to: '/admin/campaigns', label: 'Campaigns', icon: <FolderKanban size={18} /> },
    { to: '/admin/analytics', label: 'Global Traffic', icon: <BarChart3 size={18} /> },
    { to: '/admin/security', label: 'Security & Domains', icon: <ShieldCheck size={18} /> },
    { to: '/admin/audit-logs', label: 'Audit Logs', icon: <FileText size={18} /> },
    { to: '/admin/system', label: 'System Health', icon: <Activity size={18} /> },
  ];

  return (
    <aside className="app-sidebar" style={{ borderRight: '1px solid rgba(244, 63, 94, 0.2)' }}>
      {/* Brand header with Admin Shield */}
      <div
        style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          padding: '0 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(244, 63, 94, 0.05)',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(244, 63, 94, 0.4)',
          }}
        >
          <ShieldAlert size={18} color="#ffffff" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Admin<span style={{ color: '#f43f5e' }}>Center</span>
          </span>
          <span style={{ fontSize: '0.65rem', color: '#f43f5e', fontWeight: 700, letterSpacing: '0.05em' }}>
            SUPERUSER PRIVILEGES
          </span>
        </div>
      </div>

      {/* Nav items list */}
      <div style={{ flex: 1, padding: '1.25rem 1rem', overflowY: 'auto' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 0.5rem 0.6rem' }}>
          Platform Controls
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column' }}>
          {adminNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              style={({ isActive }) =>
                isActive
                  ? {
                      background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
                      boxShadow: '0 4px 12px rgba(244, 63, 94, 0.3)',
                    }
                  : {}
              }
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
          padding: '1rem',
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        <Link
          to="/dashboard"
          className="btn btn-secondary btn-sm"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <ArrowLeft size={14} />
          <span>Return to User App</span>
        </Link>
      </div>
    </aside>
  );
};
