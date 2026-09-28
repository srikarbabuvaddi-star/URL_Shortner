import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { QrCode, Download, Plus, Eye, BarChart2 } from 'lucide-react';
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
    qrService.downloadQr(qr.linkId, format, `urlly-${qr.shortCode}`);
    toast.success(`Downloaded QR Code (${format.toUpperCase()})`);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h1 className="page-title">QR Manager</h1>
          <p className="page-subtitle">Create and manage QR codes for your short links.</p>
        </div>
        <button onClick={() => navigate('/links/create')} className="btn btn-primary">
          <Plus size={15} />
          <span>Generate QR</span>
        </button>
      </div>

      {loading ? (
        <div className="grid-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card" style={{ textAlign: 'center', padding: '1.75rem' }}>
              <Skeleton width="120px" height="120px" borderRadius="8px" style={{ margin: '0 auto 1rem' }} />
              <Skeleton height="16px" width="60%" style={{ margin: '0 auto 0.5rem' }} />
              <Skeleton height="14px" width="40%" style={{ margin: '0 auto 1rem' }} />
              <Skeleton height="32px" />
            </div>
          ))}
        </div>
      ) : qrs.length === 0 ? (
        <div className="card" style={{ padding: '3rem' }}>
          <EmptyState
            icon={<QrCode size={28} />}
            title="No QR codes yet"
            description="Create a short link with the 'Generate dynamic QR code' option enabled."
            actionText="Generate QR"
            onAction={() => navigate('/links/create')}
          />
        </div>
      ) : (
        <div className="grid-3">
          {qrs.map((qr) => (
            <div key={qr.id} className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
              {/* QR Preview Canvas */}
              <div
                style={{
                  display: 'inline-block',
                  background: '#FFFFFF',
                  padding: '0.65rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-xs)',
                  marginBottom: '1rem',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedQr(qr)}
                title="Click to view full preview"
              >
                <img
                  src={qr.previewUrl}
                  alt={`QR for ${qr.shortCode}`}
                  style={{ width: '120px', height: '120px', display: 'block' }}
                />
              </div>

              {/* Title & Short URL */}
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                  {qr.title || `/${qr.shortCode}`}
                </h3>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    color: 'var(--primary)',
                    display: 'block',
                  }}
                >
                  {qr.shortUrl}
                </span>
                <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                  Created {new Date(qr.createdAt).toLocaleDateString()} · {qr.downloadCount || 0} downloads
                </span>
              </div>

              {/* Download & View Actions */}
              <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => handleDownload(qr, 'png')}
                  className="btn btn-secondary btn-sm"
                  title="Download PNG"
                >
                  <Download size={13} />
                  <span>PNG</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload(qr, 'svg')}
                  className="btn btn-primary btn-sm"
                  title="Download SVG"
                >
                  <Download size={13} />
                  <span>SVG</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedQr(qr)}
                  className="btn btn-secondary btn-sm"
                  title="Preview"
                >
                  <Eye size={13} />
                </button>
                <Link
                  to={`/links/${qr.linkId}/analytics`}
                  className="btn btn-secondary btn-sm"
                  title="Analytics"
                >
                  <BarChart2 size={13} />
                </Link>
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
