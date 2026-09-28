import React from 'react';

interface BadgeProps {
  status: 'ACTIVE' | 'DISABLED' | 'EXPIRED' | 'BLOCKED' | 'ARCHIVED' | 'QR' | string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  const normalized = status.toUpperCase();

  let badgeClass = 'badge-disabled';
  let label = normalized;

  if (normalized === 'ACTIVE') {
    badgeClass = 'badge-active';
  } else if (normalized === 'DISABLED') {
    badgeClass = 'badge-disabled';
  } else if (normalized === 'EXPIRED') {
    badgeClass = 'badge-expired';
  } else if (normalized === 'BLOCKED') {
    badgeClass = 'badge-blocked';
  } else if (normalized === 'QR') {
    badgeClass = 'badge-qr';
    label = 'QR Code';
  }

  return <span className={`badge ${badgeClass} ${className}`}>{label}</span>;
};
