import React, { useState, useEffect } from 'react';
import { X, Download, Copy, Check, ExternalLink } from 'lucide-react';
import { qrService } from '../services/qrService';
import { useToast } from '../context/ToastContext';

interface QrCodeModalProps {
  linkId: string | null;
  shortCode: string | null;
  title?: string | null;
  onClose: () => void;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({
  linkId,
  shortCode,
  title,
  onClose,
}) => {
  const [loading, setLoading] = useState(true);
  const [qrData, setQrData] = useState<{
    pngDataUrl: string;
    svgString: string;
    shortUrl: string;
    downloadCount: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (!linkId) return;

    let isMounted = true;
    setLoading(true);

    qrService
      .getQrForLink(linkId)
      .then((res) => {
        if (isMounted) {
          setQrData(res.qr);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          toast.error(err.message || 'Failed to load QR code preview');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [linkId]);

  if (!linkId || !shortCode) return null;

  const handleCopy = () => {
    if (!qrData?.shortUrl) return;
    navigator.clipboard.writeText(qrData.shortUrl);
    setCopied(true);
    toast.success('Short link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (format: 'png' | 'svg') => {
    qrService.downloadQr(linkId, format, `urlly-${shortCode}`);
    toast.success(`Downloaded QR Code (${format.toUpperCase()})`);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>Dynamic QR Code</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{title || `/${shortCode}`}</p>
          </div>
          <button
            onClick={onClose}
            className="btn-icon"
            style={{ borderRadius: 'var(--radius-sm)' }}
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        <div className="modal-body" style={{ textAlign: 'center' }}>
          {loading ? (
            <div style={{ padding: '2.5rem 0', display: 'flex', justifyContent: 'center' }}>
              <div className="skeleton" style={{ width: '200px', height: '200px', borderRadius: '8px' }} />
            </div>
          ) : qrData ? (
            <div>
              {/* QR Image Box */}
              <div
                style={{
                  display: 'inline-block',
                  background: '#FFFFFF',
                  padding: '1rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-sm)',
                  marginBottom: '1.25rem',
                }}
              >
                <img
                  src={qrData.pngDataUrl}
                  alt={`QR Code for ${shortCode}`}
                  style={{ width: '200px', height: '200px', display: 'block' }}
                />
              </div>

              {/* Target short link bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'var(--bg-primary)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  marginBottom: '0.85rem',
                  gap: '0.5rem',
                }}
              >
                <span
                  style={{
                    flex: 1,
                    textAlign: 'left',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    color: 'var(--primary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {qrData.shortUrl}
                </span>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="btn btn-sm btn-secondary"
                  title="Copy short link"
                >
                  {copied ? <Check size={13} color="var(--success)" /> : <Copy size={13} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <a
                  href={qrData.shortUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm btn-outline"
                  title="Open short link"
                >
                  <ExternalLink size={13} />
                </a>
              </div>

              {/* Dynamic Note */}
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                Points to your short URL. If destination changes later, this exact printed QR code continues working.
              </p>
            </div>
          ) : (
            <p style={{ color: 'var(--danger)' }}>Unable to render QR code.</p>
          )}
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Downloads: {qrData?.downloadCount || 0}
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleDownload('png')}
              className="btn btn-secondary btn-sm"
              disabled={loading || !qrData}
            >
              <Download size={13} />
              <span>PNG</span>
            </button>
            <button
              type="button"
              onClick={() => handleDownload('svg')}
              className="btn btn-primary btn-sm"
              disabled={loading || !qrData}
            >
              <Download size={13} />
              <span>SVG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
