import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DeviceBreakdownChartProps {
  data: Array<{ name: string; count: number }>;
  height?: number;
}

const COLORS: Record<string, string> = {
  Mobile: '#4058EB',
  Desktop: '#0BA5E9',
  Tablet: '#15935A',
  Bot: '#C83338',
  Unknown: '#8E96A4',
};

export const DeviceBreakdownChart: React.FC<DeviceBreakdownChartProps> = ({ data, height = 240 }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
        No device metrics available.
      </div>
    );
  }

  const chartData = data.map((d) => ({
    name: d.name,
    value: d.count,
    color: COLORS[d.name] || '#4058EB',
  }));

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={75}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={1} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: '#FFFFFF',
              border: '1px solid #E1E4E9',
              borderRadius: '6px',
              color: '#14171F',
              fontSize: '12px',
              boxShadow: '0 4px 12px rgba(16, 24, 40, 0.08)',
            }}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: '8px', fontSize: '11.5px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
