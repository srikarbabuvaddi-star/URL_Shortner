import React from 'react';
import { Layers, ShieldCheck, Zap, QrCode } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div style={{ padding: '4rem 0 6rem' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>About LinkPulse</h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Building the next generation of link intelligence, dynamic print attribution, and privacy-conscious analytics.
          </p>
        </div>

        <div className="card" style={{ padding: '2.5rem', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <QrCode size={22} color="var(--accent-secondary)" />
            <span>The Dynamic QR Philosophy</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
            Traditional QR codes encode the raw final destination URL. Once you print a poster, billboard, or physical product
            packaging, you are permanently locked into that URL. If that destination changes or breaks, every printed asset becomes obsolete.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            LinkPulse encodes your <strong>dedicated short URL</strong> into the QR code. When scanned, our high-speed redirect
            engine validates link status, filters bots, captures rich analytics, and redirects the visitor in under 5 milliseconds.
            You can update the destination anytime without changing the printed code.
          </p>
        </div>

        <div className="card" style={{ padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldCheck size={22} color="#10b981" />
            <span>Privacy-Conscious Attribution</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
            We believe you can obtain deep actionable marketing attribution without violating visitor privacy:
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            <li>🔒 <strong>HMAC IP Anonymization:</strong> IP addresses are never stored in plain text. They are hashed using HMAC-SHA256 with a secret salt.</li>
            <li>🤖 <strong>Heuristic Bot Filtering:</strong> Crawlers and automated spiders are detected and segregated from human visits.</li>
            <li>⏱️ <strong>Configurable Data Retention:</strong> Analytics logs can be rotated on 30-day, 90-day, or 1-year schedules.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
