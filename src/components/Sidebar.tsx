import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Link2,
  BarChart3,
  FolderKanban,
  QrCode,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Building
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  const workspaceNav = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { to: '/links', label: 'Links', icon: <Link2 size={16} /> },
    { to: '/campaigns', label: 'Campaigns', icon: <FolderKanban size={16} /> },
    { to: '/qr', label: 'QR Manager', icon: <QrCode size={16} /> },
  ];

  const accountNav = [
    { to: '/profile', label: 'Profile', icon: <User size={16} /> },
    { to: '/settings', label: 'Settings', icon: <Settings size={16} /> },
  ];

  return (
    <aside className="app-sidebar">
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
            background: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Link2 size={14} color="#FFFFFF" strokeWidth={2.5} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            urlly
          </span>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 600,
              padding: '0.1rem 0.35rem',
              borderRadius: '4px',
              background: 'var(--bg-tertiary)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
            }}
          >
            v1.0
          </span>
        </div>
      </div>

      {/* Navigation Sections */}
      <div style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto' }}>
        {/* Workspace Group */}
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
          Workspace
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1px', marginBottom: '1.25rem' }}>
          {workspaceNav.map((item) => (
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

        {/* Account Group */}
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
          Account
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          {accountNav.map((item) => (
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

      {/* Bottom User Area */}
      <div
        style={{
          padding: '0.75rem',
          borderTop: '1px solid var(--border-color)',
          background: '#FAFBFC',
          position: 'relative',
        }}
      >
        {menuOpen && (
          <div
            style={{
              position: 'absolute',
              bottom: '100%',
              left: '0.75rem',
              right: '0.75rem',
              marginBottom: '0.5rem',
              background: '#FFFFFF',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-md)',
              padding: '0.35rem',
              zIndex: 50,
            }}
          >
            <div style={{ padding: '0.4rem 0.6rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Signed in as</div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.email}
              </div>
            </div>
            <button
              onClick={() => {
                setMenuOpen(false);
                navigate('/profile');
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 0.6rem',
                fontSize: '12.5px',
                color: 'var(--text-secondary)',
                background: 'transparent',
                border: 'none',
                borderRadius: 'var(--radius-xs)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-tertiary)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <User size={14} /> Profile
            </button>
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 0.6rem',
                fontSize: '12.5px',
                color: 'var(--danger)',
                background: 'transparent',
                border: 'none',
                borderRadius: 'var(--radius-xs)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--danger-subtle)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <LogOut size={14} /> Log out
            </button>
          </div>
        )}

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.4rem 0.5rem',
            background: 'transparent',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            textAlign: 'left',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-tertiary)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--primary-subtle)',
                color: 'var(--primary)',
                fontSize: '11px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {initials}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span
                style={{
                  fontSize: '12.5px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user?.name || 'Workspace User'}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                Personal Workspace
              </span>
            </div>
          </div>
          <ChevronDown size={14} color="var(--text-muted)" />
        </button>
      </div>
    </aside>
  );
};
