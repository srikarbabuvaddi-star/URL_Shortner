import React from 'react';

interface BadgeProps {
  status: 'ACTIVE' | 'DISABLED' | 'PAUSED' | 'EXPIRED' | 'BLOCKED' | 'ARCHIVED' | 'QR' | string;
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ status, className = '', dot = true }) => {
  const normalized = status.toUpperCase();

  let badgeClass = 'badge-disabled';
  let label = status;

  if (normalized === 'ACTIVE') {
    badgeClass = 'badge-active';
    label = 'Active';
  } else if (normalized === 'DISABLED' || normalized === 'PAUSED') {
    badgeClass = 'badge-disabled';
    label = 'Disabled';
  } else if (normalized === 'EXPIRED') {
    badgeClass = 'badge-expired';
    label = 'Expired';
  } else if (normalized === 'BLOCKED') {
    badgeClass = 'badge-blocked';
    label = 'Blocked';
  } else if (normalized === 'QR') {
    badgeClass = 'badge-primary';
    label = 'QR Code';
  }

  return (
    <span className={`badge ${badgeClass} ${className}`}>
      {dot && (
        <span
          style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: 'currentColor',
            display: 'inline-block',
          }}
        />
      )}
      <span>{label}</span>
    </span>
  );
};
