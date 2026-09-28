import React, { useState } from 'react';
import { Settings, Key, Shield, Bell, Globe, Copy, Check, Save } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const SettingsPage: React.FC = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications' | 'api'>('general');

  // General tab states
  const [workspaceName, setWorkspaceName] = useState('Personal Workspace');
  const [customDomain, setCustomDomain] = useState('urlly.app');
  const [timezone, setTimezone] = useState('UTC');

  // Security tab states
  const [sessionTimeout, setSessionTimeout] = useState('7');
  const [requireHttps, setRequireHttps] = useState(true);

  // Notification tab states
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  // API Key tab states
  const [copiedToken, setCopiedToken] = useState(false);
  const mockApiKey = 'urlly_live_98ab7c6f012e4d92a488e3678bfa1';

  const handleCopyToken = () => {
    navigator.clipboard.writeText(mockApiKey);
    setCopiedToken(true);
    toast.success('API Key copied to clipboard');
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Settings saved successfully');
  };

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div className="page-header-text">
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Configure workspace preferences, domains, security, and API access.</p>
        </div>
      </div>

      {/* Tabs Bar */}
      <div
        style={{
          display: 'flex',
          gap: '0.35rem',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '1.5rem',
          paddingBottom: '2px',
        }}
      >
        {[
          { key: 'general', label: 'General', icon: <Globe size={14} /> },
          { key: 'security', label: 'Security', icon: <Shield size={14} /> },
          { key: 'notifications', label: 'Notifications', icon: <Bell size={14} /> },
          { key: 'api', label: 'API Keys', icon: <Key size={14} /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            type="button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 0.85rem',
              fontSize: '13px',
              fontWeight: activeTab === tab.key ? 600 : 500,
              color: activeTab === tab.key ? 'var(--primary)' : 'var(--text-secondary)',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.key ? '2px solid var(--primary)' : '2px solid transparent',
              cursor: 'pointer',
              marginBottom: '-3px',
              transition: 'all var(--transition-fast)',
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* General Tab */}
      {activeTab === 'general' && (
        <form onSubmit={handleSave} className="card">
          <div className="card-header">
            <h2 className="card-title">General Settings</h2>
          </div>

          <div className="form-group">
            <label className="form-label">Workspace Name</label>
            <input
              type="text"
              className="form-input"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Default Domain</label>
            <input
              type="text"
              className="form-input"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
            />
            <span className="form-hint">Default root domain for newly shortened URLs</span>
          </div>

          <div className="form-group">
            <label className="form-label">Timezone</label>
            <select
              className="form-select"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            >
              <option value="UTC">UTC (Coordinated Universal Time)</option>
              <option value="America/New_York">Eastern Time (US & Canada)</option>
              <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
              <option value="Europe/London">London (GMT)</option>
              <option value="Asia/Kolkata">India Standard Time (IST)</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary btn-sm">
              <Save size={13} />
              <span>Save settings</span>
            </button>
          </div>
        </form>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <form onSubmit={handleSave} className="card">
          <div className="card-header">
            <h2 className="card-title">Security & Session Controls</h2>
          </div>

          <div className="form-group">
            <label className="form-label">Session Inactivity Timeout</label>
            <select
              className="form-select"
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(e.target.value)}
            >
              <option value="1">1 Day</option>
              <option value="7">7 Days (Default)</option>
              <option value="30">30 Days</option>
            </select>
            <span className="form-hint">Time before requiring re-authentication</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.25rem' }}>
            <input
              type="checkbox"
              id="httpsCheckbox"
              checked={requireHttps}
              onChange={(e) => setRequireHttps(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            <label htmlFor="httpsCheckbox" style={{ fontSize: '13px', color: 'var(--text-primary)', cursor: 'pointer' }}>
              Enforce strict HTTPS redirection on all custom links
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary btn-sm">
              <Save size={13} />
              <span>Save settings</span>
            </button>
          </div>
        </form>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <form onSubmit={handleSave} className="card">
          <div className="card-header">
            <h2 className="card-title">Notification Preferences</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                id="trafficAlerts"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <div>
                <label htmlFor="trafficAlerts" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', cursor: 'pointer' }}>
                  Traffic Spike Alerts
                </label>
                <p className="text-secondary" style={{ fontSize: '12px' }}>
                  Receive an email when any link exceeds 1,000 clicks in an hour
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                id="weeklyDigest"
                checked={weeklyDigest}
                onChange={(e) => setWeeklyDigest(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <div>
                <label htmlFor="weeklyDigest" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', cursor: 'pointer' }}>
                  Weekly Analytics Digest
                </label>
                <p className="text-secondary" style={{ fontSize: '12px' }}>
                  Weekly summary of clicks, QR scans, and top campaign channels
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary btn-sm">
              <Save size={13} />
              <span>Save settings</span>
            </button>
          </div>
        </form>
      )}

      {/* API Keys Tab */}
      {activeTab === 'api' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">API Access Keys</h2>
              <p className="text-secondary" style={{ fontSize: '12.5px', marginTop: '2px' }}>
                Use this token to authenticate programmatic REST API requests
              </p>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Live Secret Key</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-input"
                readOnly
                value={mockApiKey}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '12.5px', background: 'var(--bg-primary)' }}
              />
              <button
                type="button"
                onClick={handleCopyToken}
                className="btn btn-secondary btn-sm"
              >
                {copiedToken ? <Check size={13} color="var(--success)" /> : <Copy size={13} />}
                <span>{copiedToken ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <span className="form-hint">
              Keep this key confidential. Never expose secret keys in client-side code repositories.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
