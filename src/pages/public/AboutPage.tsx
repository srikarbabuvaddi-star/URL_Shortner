import React from 'react';
import { ShieldCheck, QrCode } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div style={{ padding: '3.5rem 1.5rem 5rem' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
            About urlly
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Modern link intelligence, dynamic print attribution, and privacy-conscious click analytics.
          </p>
        </div>

        <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
            <QrCode size={20} color="var(--color-primary)" />
            <span>The Dynamic QR Philosophy</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1rem' }}>
            Traditional QR codes encode the raw final destination URL. Once you print a poster, flyer, or physical packaging, you are locked into that URL. If the target URL changes or breaks, every printed asset becomes obsolete.
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
            urlly encodes your <strong>short URL</strong> into the QR matrix. When scanned, our high-speed redirect engine validates link status, filters automated crawlers, captures attribution analytics, and redirects the visitor in under 5 milliseconds. You can update destination URLs anytime without changing physical printed materials.
          </p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
            <ShieldCheck size={20} color="var(--color-success)" />
            <span>Privacy-Conscious Attribution</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1rem' }}>
            We provide deep marketing attribution while respecting user privacy and complying with global data standards:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-app)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-main)' }}>
              <strong style={{ color: 'var(--text-main)' }}>HMAC IP Anonymization:</strong> IP addresses are never stored in plain text. Incoming IPs are transformed using HMAC-SHA256 with a secure server-side secret.
            </div>
            <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-app)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-main)' }}>
              <strong style={{ color: 'var(--text-main)' }}>Heuristic Bot Filtering:</strong> Search engine crawlers and automated spiders are detected and segregated from human visits.
            </div>
            <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-app)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-main)' }}>
              <strong style={{ color: 'var(--text-main)' }}>First-Party Partitioned Cookies:</strong> Visitor deduplication relies on partitioned cookies rather than cross-site surveillance.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
