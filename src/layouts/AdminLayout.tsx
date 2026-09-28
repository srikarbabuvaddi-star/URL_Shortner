import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AdminSidebar } from '../components/AdminSidebar';
import { TopBar } from '../components/TopBar';
import { useAuth } from '../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Verifying administrator permissions...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'ADMIN') {
    return <Navigate to="/errors/forbidden" replace />;
  }

  return (
    <div className="app-layout">
      <div className={mobileMenuOpen ? 'mobile-sidebar-open' : ''}>
        <AdminSidebar />
      </div>

      <div className="app-main">
        <TopBar
          onToggleSidebar={() => setMobileMenuOpen(!mobileMenuOpen)}
          title="Platform Administration"
        />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
