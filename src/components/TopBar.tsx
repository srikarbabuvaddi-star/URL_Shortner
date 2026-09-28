import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Menu, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface TopBarProps {
  onToggleSidebar?: () => void;
  title?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar, title }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="btn-icon"
            style={{ display: 'none' }}
            aria-label="Toggle Navigation"
          >
            <Menu size={16} />
          </button>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '13px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Workspace</span>
          <span style={{ color: 'var(--border-hover)' }}>/</span>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            {title || 'Overview'}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          onClick={() => navigate('/links/create')}
          className="btn btn-primary btn-sm"
          id="btn-quick-create-link"
        >
          <Plus size={14} />
          <span>Create link</span>
        </button>

        <div
          onClick={() => navigate('/profile')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.25rem 0.5rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            cursor: 'pointer',
          }}
          title={user?.email}
        >
          <div
            style={{
              width: '22px',
              height: '22px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--primary)',
              color: '#FFFFFF',
              fontSize: '10px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {initials}
          </div>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--text-primary)',
              maxWidth: '120px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {user?.name?.split(' ')[0] || 'Account'}
          </span>
          {user?.role === 'ADMIN' && (
            <span
              style={{
                fontSize: '9px',
                fontWeight: 700,
                background: 'var(--danger-subtle)',
                color: 'var(--danger)',
                padding: '0.1rem 0.3rem',
                borderRadius: '3px',
              }}
            >
              ADMIN
            </span>
          )}
        </div>
      </div>
    </header>
  );
};
