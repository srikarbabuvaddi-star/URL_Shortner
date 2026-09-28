import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DeviceBreakdownChartProps {
  data: Array<{ name: string; count: number }>;
  height?: number;
}

const COLORS: Record<string, string> = {
  Mobile: '#06b6d4',
  Desktop: '#6366f1',
  Tablet: '#8b5cf6',
  Bot: '#f43f5e',
  Unknown: '#64748b',
};

export const DeviceBreakdownChart: React.FC<DeviceBreakdownChartProps> = ({ data, height = 260 }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        No device metrics available.
      </div>
    );
  }

  const chartData = data.map((d) => ({
    name: d.name,
    value: d.count,
    color: COLORS[d.name] || '#6366f1',
  }));

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={4}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              color: '#f8fafc',
              fontSize: '0.85rem',
            }}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: '10px', fontSize: '0.8rem' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
