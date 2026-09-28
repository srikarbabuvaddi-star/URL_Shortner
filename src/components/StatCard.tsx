import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  meta?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, meta, trend }) => {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
        {(meta || trend) && (
          <div className="stat-meta" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {trend && (
              <span style={{ color: trend.isPositive ? '#10b981' : '#f43f5e', fontWeight: 600 }}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </span>
            )}
            {meta && <span>{meta}</span>}
          </div>
        )}
      </div>
    </div>
  );
};
