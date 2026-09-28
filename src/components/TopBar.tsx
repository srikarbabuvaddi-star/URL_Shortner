import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface TopBarProps {
  onToggleSidebar?: () => void;
  title?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

  return (
    <header className="app-topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="btn-icon"
            style={{ display: 'inline-flex' }}
            aria-label="Toggle Navigation"
          >
            <Menu size={18} />
          </button>
        )}
        {title && <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{title}</span>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Quick create action */}
        <button
          onClick={() => navigate('/links/create')}
          className="btn btn-primary btn-sm"
          id="btn-quick-create-link"
        >
          <Plus size={15} />
          <span>Create Link</span>
        </button>

        {/* User Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.3rem 0.6rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'var(--accent-gradient)',
              color: '#ffffff',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {initials}
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.name || 'User'}
          </span>
          {user?.role === 'ADMIN' && (
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                background: 'rgba(244, 63, 94, 0.2)',
                color: '#f43f5e',
                padding: '0.1rem 0.4rem',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              ADMIN
            </span>
          )}
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="btn-icon"
          title="Sign out"
          aria-label="Sign out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
};
