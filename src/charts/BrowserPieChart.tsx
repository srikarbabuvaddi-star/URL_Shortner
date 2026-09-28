import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface BrowserPieChartProps {
  data: Array<{ name: string; count: number }>;
  height?: number;
}

const PALETTE = ['#4058EB', '#0BA5E9', '#15935A', '#B56D0A', '#626A78'];

export const BrowserPieChart: React.FC<BrowserPieChartProps> = ({ data, height = 240 }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
        No browser metrics available.
      </div>
    );
  }

  const topData = data.slice(0, 5);

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={topData}
          layout="vertical"
          margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            stroke="#626A78"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            width={75}
          />
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
          <Bar dataKey="count" name="Clicks" radius={[0, 4, 4, 0]}>
            {topData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
