import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  meta?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, meta, trend }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span className="stat-label">{label}</span>
        {icon && <div className="stat-icon">{icon}</div>}
      </div>
      <div className="stat-value">{value}</div>
      {(trend || meta) && (
        <div className="stat-bottom">
          {trend && (
            <span className={`stat-trend ${trend.isPositive ? 'up' : 'down'}`}>
              {trend.isPositive ? '+' : ''}{trend.value}
            </span>
          )}
          {meta && <span style={{ color: 'var(--text-muted)' }}>{meta}</span>}
        </div>
      )}
    </div>
  );
};
