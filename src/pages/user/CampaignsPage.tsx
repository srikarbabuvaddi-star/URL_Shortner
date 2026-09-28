import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FolderKanban, Plus, Link2, MousePointerClick, Calendar, ArrowRight, BarChart2 } from 'lucide-react';
import { campaignService, Campaign } from '../../services/campaignService';
import { Badge } from '../../components/Badge';
import { EmptyState } from '../../components/EmptyState';
import { Skeleton } from '../../components/Skeleton';
import { useToast } from '../../context/ToastContext';

export const CampaignsPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const res = await campaignService.getCampaigns();
      setCampaigns(res.campaigns);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Marketing Campaigns</h1>
          <p className="page-subtitle">Group links into multi-channel campaigns to measure channel ROI and attribution.</p>
        </div>
        <button onClick={() => navigate('/campaigns/create')} className="btn btn-primary" id="btn-create-campaign">
          <Plus size={16} />
          <span>New Campaign</span>
        </button>
      </div>

      {loading ? (
        <div className="grid-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card">
              <Skeleton height="1.5rem" width="60%" style={{ marginBottom: '0.75rem' }} />
              <Skeleton height="3rem" style={{ marginBottom: '1rem' }} />
              <Skeleton height="2rem" />
            </div>
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="card" style={{ padding: '3rem' }}>
          <EmptyState
            icon={<FolderKanban size={36} />}
            title="No campaigns yet"
            description="Create your first campaign to group links across social media, emails, and QR prints."
            actionText="Create Campaign"
            onAction={() => navigate('/campaigns/create')}
          />
        </div>
      ) : (
        <div className="grid-3">
          {campaigns.map((camp) => (
            <div key={camp.id} className="card card-interactive" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1.25rem' }}>{camp.name}</h3>
                <Badge status={camp.status} />
              </div>

              <p
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  marginBottom: '1.5rem',
                  flex: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {camp.description || 'No campaign description provided.'}
              </p>

              {/* Attribution KPI Bar */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                  padding: '0.9rem',
                  background: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.25rem',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Channels & Links</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                    {camp.totalLinks}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Traffic</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>
                    {camp.totalClicks} clicks
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link
                  to={`/campaigns/${camp.id}`}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <BarChart2 size={14} />
                  <span>Attribution</span>
                </Link>
                <Link
                  to={`/links/create?campaignId=${camp.id}`}
                  className="btn btn-primary btn-sm"
                  title="Add channel link to campaign"
                >
                  <Plus size={14} />
                  <span>Add Link</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
