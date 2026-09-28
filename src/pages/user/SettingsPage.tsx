import React, { useState } from 'react';
import { Settings, Key, Shield, Database, Copy, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const SettingsPage: React.FC = () => {
  const toast = useToast();
  const [retention, setRetention] = useState('90');
  const [botFilter, setBotFilter] = useState('strict');
  const [copiedToken, setCopiedToken] = useState(false);

  const mockApiKey = 'lp_live_98ab7c6f012e4d92a488e3678bfa1';

  const handleCopyToken = () => {
    navigator.clipboard.writeText(mockApiKey);
    setCopiedToken(true);
    toast.success('API Key copied to clipboard!');
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Preferences saved successfully!');
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title">Platform Settings</h1>
          <p className="page-subtitle">Configure API credentials, privacy retention rules, and bot detection parameters.</p>
        </div>
      </div>

      {/* API Key Box */}
      <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Key size={18} color="var(--accent-secondary)" />
          <span>API Access Token</span>
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Use this secret key to authenticate programmatic requests with the LinkPulse REST API.
        </p>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            type="text"
            className="form-input"
            value={mockApiKey}
            readOnly
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--accent-secondary)' }}
          />
          <button onClick={handleCopyToken} className="btn btn-secondary btn-sm" style={{ height: '42px' }}>
            {copiedToken ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            <span>{copiedToken ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Privacy & Retention */}
      <div className="card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={18} color="#10b981" />
          <span>Analytics Privacy & Retention Rules</span>
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Control how long individual click events and visitor hash footprints are retained before automatic pruning.
        </p>

        <form onSubmit={handleSavePreferences}>
          <div className="form-group">
            <label className="form-label">Data Retention Period</label>
            <select
              className="form-select"
              value={retention}
              onChange={(e) => setRetention(e.target.value)}
            >
              <option value="30">30 Days (Standard Privacy)</option>
              <option value="90">90 Days (Recommended)</option>
              <option value="365">1 Year (Long-term Attribution)</option>
            </select>
            <span className="form-hint">
              Aggregated KPI totals (e.g. lifetime clicks) are preserved indefinitely even after individual event logs are pruned.
            </span>
          </div>

          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            <label className="form-label">Bot Detection Sensitivity</label>
            <select
              className="form-select"
              value={botFilter}
              onChange={(e) => setBotFilter(e.target.value)}
            >
              <option value="strict">Strict (Segregate known crawlers, headless browsers & preview bots)</option>
              <option value="permissive">Permissive (Only filter verified search engine indexers)</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary">
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
