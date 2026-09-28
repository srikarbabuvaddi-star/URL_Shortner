import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface CampaignAttributionChartProps {
  channels: Array<{
    channel: string;
    shortCode: string;
    clicks: number;
    uniqueVisitors: number;
    isQr: boolean;
  }>;
  height?: number;
}

export const CampaignAttributionChart: React.FC<CampaignAttributionChartProps> = ({
  channels,
  height = 320,
}) => {
  if (!channels || channels.length === 0) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        No channel data available for this campaign.
      </div>
    );
  }

  const chartData = channels.map((c) => ({
    name: c.channel,
    clicks: c.clicks,
    uniqueVisitors: c.uniqueVisitors,
    badge: c.isQr ? ' (QR)' : '',
  }));

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 15, right: 15, left: -15, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" />
          <XAxis
            dataKey="name"
            stroke="var(--text-secondary)"
            fontSize={11}
            tickLine={false}
            interval={0}
            angle={-15}
            textAnchor="end"
          />
          <YAxis
            stroke="var(--text-secondary)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              color: '#f8fafc',
              fontSize: '0.85rem',
            }}
          />
          <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '10px', fontSize: '0.8rem' }} />
          <Bar dataKey="clicks" name="Total Clicks" fill="#6366f1" radius={[4, 4, 0, 0]} />
          <Bar dataKey="uniqueVisitors" name="Unique Visitors" fill="#06b6d4" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
