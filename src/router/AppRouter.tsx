import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { AppLayout } from '../layouts/AppLayout';
import { AdminLayout } from '../layouts/AdminLayout';

// Public Pages
import { HomePage } from '../pages/public/HomePage';
import { LoginPage } from '../pages/public/LoginPage';
import { RegisterPage } from '../pages/public/RegisterPage';
import { PricingPage } from '../pages/public/PricingPage';
import { DocsPage } from '../pages/public/DocsPage';
import { AboutPage } from '../pages/public/AboutPage';

// User Workspace Pages
import { DashboardPage } from '../pages/user/DashboardPage';
import { LinksPage } from '../pages/user/LinksPage';
import { CreateLinkPage } from '../pages/user/CreateLinkPage';
import { LinkDetailsPage } from '../pages/user/LinkDetailsPage';
import { LinkAnalyticsPage } from '../pages/user/LinkAnalyticsPage';
import { CampaignsPage } from '../pages/user/CampaignsPage';
import { CreateCampaignPage } from '../pages/user/CreateCampaignPage';
import { CampaignDetailsPage } from '../pages/user/CampaignDetailsPage';
import { QrManagerPage } from '../pages/user/QrManagerPage';
import { ProfilePage } from '../pages/user/ProfilePage';
import { SettingsPage } from '../pages/user/SettingsPage';

// Admin Portal Pages
import { AdminOverviewPage } from '../pages/admin/AdminOverviewPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminLinksPage } from '../pages/admin/AdminLinksPage';
import { AdminSecurityPage } from '../pages/admin/AdminSecurityPage';
import { AdminAuditLogsPage } from '../pages/admin/AdminAuditLogsPage';
import { AdminSystemPage } from '../pages/admin/AdminSystemPage';

// Error Pages
import { NotFoundPage } from '../pages/error/NotFoundPage';
import { LinkDisabledPage } from '../pages/error/LinkDisabledPage';
import { LinkExpiredPage } from '../pages/error/LinkExpiredPage';
import { LinkBlockedPage } from '../pages/error/LinkBlockedPage';
import { ForbiddenPage } from '../pages/error/ForbiddenPage';

/**
 * Component to handle short links opened directly in the frontend dev client
 */
const ShortCodeForwarder: React.FC = () => {
  const { code } = useParams<{ code: string }>();

  useEffect(() => {
    if (code) {
      // Forward to backend redirect engine
      window.location.href = `http://localhost:5000/${code}`;
    }
  }, [code]);

  return (
    <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Redirecting to destination...</p>
      </div>
    </div>
  );
};

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* Error Pages */}
        <Route path="/errors/not-found" element={<NotFoundPage />} />
        <Route path="/errors/disabled" element={<LinkDisabledPage />} />
        <Route path="/errors/expired" element={<LinkExpiredPage />} />
        <Route path="/errors/blocked" element={<LinkBlockedPage />} />
        <Route path="/errors/forbidden" element={<ForbiddenPage />} />
      </Route>

      {/* User Workspace (Protected by AppLayout) */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/links" element={<LinksPage />} />
        <Route path="/links/create" element={<CreateLinkPage />} />
        <Route path="/links/:id" element={<LinkDetailsPage />} />
        <Route path="/links/:id/analytics" element={<LinkAnalyticsPage />} />
        <Route path="/campaigns" element={<CampaignsPage />} />
        <Route path="/campaigns/create" element={<CreateCampaignPage />} />
        <Route path="/campaigns/:id" element={<CampaignDetailsPage />} />
        <Route path="/qr" element={<QrManagerPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Admin Portal (Protected by AdminLayout & RBAC) */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminOverviewPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/links" element={<AdminLinksPage />} />
        <Route path="/admin/campaigns" element={<CampaignsPage />} />
        <Route path="/admin/analytics" element={<AdminOverviewPage />} />
        <Route path="/admin/security" element={<AdminSecurityPage />} />
        <Route path="/admin/audit-logs" element={<AdminAuditLogsPage />} />
        <Route path="/admin/system" element={<AdminSystemPage />} />
      </Route>

      {/* Direct short code forwarder or catch-all */}
      <Route path="/:code" element={<ShortCodeForwarder />} />
      <Route path="*" element={<Navigate to="/errors/not-found" replace />} />
    </Routes>
  );
};
