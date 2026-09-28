import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { QrCode, Download, ExternalLink, Plus, Eye, BarChart2 } from 'lucide-react';
import { qrService, QrItem } from '../../services/qrService';
import { QrCodeModal } from '../../components/QrCodeModal';
import { EmptyState } from '../../components/EmptyState';
import { Skeleton } from '../../components/Skeleton';
import { useToast } from '../../context/ToastContext';

export const QrManagerPage: React.FC = () => {
  const [qrs, setQrs] = useState<QrItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQr, setSelectedQr] = useState<QrItem | null>(null);

  const navigate = useNavigate();
  const toast = useToast();

  const fetchQrs = async () => {
    try {
      setLoading(true);
      const res = await qrService.getQrList();
      setQrs(res.qrs);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load QR codes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQrs();
  }, []);

  const handleDownload = (qr: QrItem, format: 'png' | 'svg') => {
    qrService.downloadQr(qr.linkId, format, `linkpulse-${qr.shortCode}`);
    toast.success(`Downloaded QR Code (${format.toUpperCase()})`);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dynamic QR Code Hub</h1>
          <p className="page-subtitle">
            Dynamic vector and raster QR codes. All codes point to your short URLs and remain operational when destinations change.
          </p>
        </div>
        <button onClick={() => navigate('/links/create')} className="btn btn-primary">
          <Plus size={16} />
          <span>New Dynamic QR</span>
        </button>
      </div>

      {loading ? (
        <div className="grid-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <Skeleton width={140} height={140} borderRadius="12px" style={{ margin: '0 auto 1rem' }} />
              <Skeleton height="1.25rem" width="70%" style={{ margin: '0 auto 0.5rem' }} />
              <Skeleton height="0.9rem" width="50%" style={{ margin: '0 auto 1.5rem' }} />
              <Skeleton height="2.2rem" />
            </div>
          ))}
        </div>
      ) : qrs.length === 0 ? (
        <div className="card" style={{ padding: '3rem' }}>
          <EmptyState
            icon={<QrCode size={36} />}
            title="No QR codes generated"
            description="Create a short link with the 'Generate QR Code' option enabled to produce dynamic QR assets."
            actionText="Create Short Link & QR"
            onAction={() => navigate('/links/create')}
          />
        </div>
      ) : (
        <div className="grid-3">
          {qrs.map((qr) => (
            <div key={qr.id} className="card card-interactive" style={{ textAlign: 'center', padding: '1.75rem' }}>
              {/* QR Preview Canvas */}
              <div
                style={{
                  display: 'inline-block',
                  background: '#ffffff',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  marginBottom: '1rem',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedQr(qr)}
                title="Click to expand preview"
              >
                <img
                  src={qr.previewUrl}
                  alt={`QR for ${qr.shortCode}`}
                  style={{ width: '130px', height: '130px', display: 'block' }}
                />
              </div>

              {/* Title & Short URL */}
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.2rem' }}>{qr.title}</h3>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  color: 'var(--accent-secondary)',
                  marginBottom: '1rem',
                }}
              >
                /{qr.shortCode}
              </div>

              {/* Metrics */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  padding: '0.6rem',
                  background: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.25rem',
                  fontSize: '0.8rem',
                }}
              >
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>Downloads</div>
                  <strong style={{ color: 'var(--text-primary)' }}>{qr.downloadCount}</strong>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>Visits / Scans</div>
                  <strong style={{ color: '#10b981' }}>{qr.totalClicks}</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => setSelectedQr(qr)}
                  className="btn btn-secondary btn-sm"
                  title="Expand QR preview"
                >
                  <Eye size={14} />
                  <span>Preview</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload(qr, 'png')}
                  className="btn btn-secondary btn-sm"
                  title="Download PNG"
                >
                  <Download size={14} />
                  <span>PNG</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload(qr, 'svg')}
                  className="btn btn-primary btn-sm"
                  title="Download SVG vector"
                >
                  <Download size={14} />
                  <span>SVG</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Expanded Modal */}
      {selectedQr && (
        <QrCodeModal
          linkId={selectedQr.linkId}
          shortCode={selectedQr.shortCode}
          title={selectedQr.title}
          onClose={() => setSelectedQr(null)}
        />
      )}
    </div>
  );
};
