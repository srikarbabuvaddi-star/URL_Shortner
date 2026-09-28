import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FolderKanban, Plus, Link2, MousePointerClick, Calendar, ArrowRight } from 'lucide-react';
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
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h1 className="page-title">Campaigns</h1>
          <p className="page-subtitle">Group links and measure campaign attribution.</p>
        </div>
        <button
          onClick={() => navigate('/campaigns/create')}
          className="btn btn-primary"
          id="btn-create-campaign"
        >
          <Plus size={15} />
          <span>New campaign</span>
        </button>
      </div>

      {loading ? (
        <div className="grid-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card">
              <Skeleton height="20px" width="60%" style={{ marginBottom: '0.75rem' }} />
              <Skeleton height="36px" style={{ marginBottom: '1rem' }} />
              <Skeleton height="28px" />
            </div>
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="card" style={{ padding: '3rem' }}>
          <EmptyState
            icon={<FolderKanban size={28} />}
            title="No campaigns yet"
            description="Create your first campaign to group links across social media, flyers, and QR codes."
            actionText="New campaign"
            onAction={() => navigate('/campaigns/create')}
          />
        </div>
      ) : (
        <div className="grid-3">
          {campaigns.map((camp) => {
            const linkCount = (camp as any)._count?.links ?? camp.totalLinks ?? 0;
            const clickCount = (camp as any)._count?.events ?? camp.totalClicks ?? 0;

            return (
              <div
                key={camp.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  position: 'relative',
                }}
                onClick={() => navigate(`/campaigns/${camp.id}`)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {camp.name}
                  </h3>
                  <Badge status={camp.status} />
                </div>

                <p
                  style={{
                    fontSize: '12.5px',
                    color: 'var(--text-secondary)',
                    marginBottom: '1.25rem',
                    flex: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {camp.description || 'No description provided.'}
                </p>

                {/* Metrics Pill Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.75rem',
                    padding: '0.75rem 0.85rem',
                    background: 'var(--bg-primary)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    marginBottom: '1rem',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>TRACKED LINKS</span>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                      {linkCount}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>TOTAL CLICKS</span>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--primary)', marginTop: '2px' }}>
                      {clickCount.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Footer date & arrow */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '0.65rem',
                    borderTop: '1px solid var(--border-subtle)',
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                  }}
                >
                  <span>Created {new Date(camp.createdAt).toLocaleDateString()}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: 'var(--primary)', fontWeight: 500 }}>
                    Details <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
