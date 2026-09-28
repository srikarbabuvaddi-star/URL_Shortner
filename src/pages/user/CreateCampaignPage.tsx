import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { campaignService } from '../../services/campaignService';
import { useToast } from '../../context/ToastContext';

export const CreateCampaignPage: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const res = await campaignService.createCampaign({
        name: name.trim(),
        description: description.trim() || undefined,
        status: 'ACTIVE',
      });
      toast.success('Campaign created successfully!');
      navigate(`/campaigns/${res.campaign.id}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '580px', margin: '0 auto' }}>
      <button
        type="button"
        onClick={() => navigate('/campaigns')}
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '1.25rem' }}
      >
        <ArrowLeft size={13} />
        <span>Back to campaigns</span>
      </button>

      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div className="page-header-text">
          <h1 className="page-title">New campaign</h1>
          <p className="page-subtitle">Group links and measure campaign attribution.</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              Campaign name <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Summer Sale 2026"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description (optional)</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Describe campaign goals, targeted audiences, and key channels..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => navigate('/campaigns')} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <span>{loading ? 'Creating...' : 'Create campaign'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
