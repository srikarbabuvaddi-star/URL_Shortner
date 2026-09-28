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
  height = 300,
}) => {
  if (!channels || channels.length === 0) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
        No channel data available for this campaign.
      </div>
    );
  }

  const chartData = channels.map((c) => ({
    name: c.channel,
    clicks: c.clicks,
    uniqueVisitors: c.uniqueVisitors,
  }));

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 15, right: 15, left: -20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ECEEF2" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#8E96A4"
            fontSize={11.5}
            tickLine={false}
            interval={0}
            axisLine={{ stroke: '#E1E4E9' }}
          />
          <YAxis
            stroke="#8E96A4"
            fontSize={11.5}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
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
          <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '10px', fontSize: '12px' }} />
          <Bar dataKey="clicks" name="Total Clicks" fill="#4058EB" radius={[4, 4, 0, 0]} />
          <Bar dataKey="uniqueVisitors" name="Unique Visitors" fill="#0BA5E9" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
