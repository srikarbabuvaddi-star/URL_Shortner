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
    qrService.downloadQr(linkId, format, `linkpulse-${shortCode}`);
    toast.success(`Downloaded QR Code (${format.toUpperCase()})`);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Dynamic QR Code</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{title || `/${shortCode}`}</p>
          </div>
          <button
            onClick={onClose}
            className="btn-icon"
            style={{ borderRadius: 'var(--radius-full)' }}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ textAlign: 'center' }}>
          {loading ? (
            <div style={{ padding: '3rem 0', display: 'flex', justifyContent: 'center' }}>
              <div className="skeleton" style={{ width: '220px', height: '220px', borderRadius: '12px' }} />
            </div>
          ) : qrData ? (
            <div>
              {/* QR Image Box */}
              <div
                style={{
                  display: 'inline-block',
                  background: '#ffffff',
                  padding: '1rem',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
                  marginBottom: '1.5rem',
                }}
              >
                <img
                  src={qrData.pngDataUrl}
                  alt={`QR Code for ${shortCode}`}
                  style={{ width: '220px', height: '220px', display: 'block' }}
                />
              </div>

              {/* Target short link bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'var(--bg-primary)',
                  padding: '0.6rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: '1rem',
                  gap: '0.75rem',
                }}
              >
                <span
                  style={{
                    flex: 1,
                    textAlign: 'left',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    color: 'var(--accent-secondary)',
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
                  {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <a
                  href={qrData.shortUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm btn-outline"
                  title="Test short link"
                >
                  <ExternalLink size={14} />
                </a>
              </div>

              {/* Dynamic Note */}
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                💡 <strong>Dynamic QR Code:</strong> Points directly to your short link. If you change the
                destination URL in the future, this exact printed QR code will continue to work seamlessly.
              </p>
            </div>
          ) : (
            <p style={{ color: 'var(--status-blocked)' }}>Unable to render QR code.</p>
          )}
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
            Downloads: {qrData?.downloadCount || 0}
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleDownload('png')}
              className="btn btn-secondary btn-sm"
              disabled={loading || !qrData}
            >
              <Download size={14} />
              <span>Download PNG</span>
            </button>
            <button
              type="button"
              onClick={() => handleDownload('svg')}
              className="btn btn-primary btn-sm"
              disabled={loading || !qrData}
            >
              <Download size={14} />
              <span>Download SVG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
