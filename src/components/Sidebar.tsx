import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Link2,
  FolderKanban,
  QrCode,
  User,
  Settings,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { to: '/links', label: 'Short Links', icon: <Link2 size={18} /> },
    { to: '/campaigns', label: 'Campaigns', icon: <FolderKanban size={18} /> },
    { to: '/qr', label: 'QR Codes', icon: <QrCode size={18} /> },
    { to: '/profile', label: 'Profile', icon: <User size={18} /> },
    { to: '/settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <aside className="app-sidebar">
      {/* Brand header */}
      <div
        style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          padding: '0 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Link2 size={18} color="#ffffff" />
        </div>
        <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Link<span style={{ color: 'var(--accent-secondary)' }}>Pulse</span>
        </span>
      </div>

      {/* Nav items list */}
      <div style={{ flex: 1, padding: '1.25rem 1rem', overflowY: 'auto' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 0.5rem 0.6rem' }}>
          Workspace
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer hint */}
      <div
        style={{
          padding: '1rem 1.25rem',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
          <span>Analytics Engine Online</span>
        </div>
      </div>
    </aside>
  );
};
