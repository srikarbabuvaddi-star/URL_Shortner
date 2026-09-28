import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface ClicksOverTimeChartProps {
  data: Array<{ date: string; clicks: number; uniqueVisitors?: number }>;
  height?: number;
}

export const ClicksOverTimeChart: React.FC<ClicksOverTimeChartProps> = ({ data, height = 300 }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        No traffic activity recorded in this date range.
      </div>
    );
  }

  // Format date labels (e.g. "Sep 28")
  const formattedData = data.map((item) => {
    let label = item.date;
    try {
      const parts = item.date.split('-');
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    } catch {
      // ignore
    }
    return {
      ...item,
      displayDate: label,
    };
  });

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" />
          <XAxis
            dataKey="displayDate"
            stroke="var(--text-muted)"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
          />
          <YAxis
            stroke="var(--text-muted)"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              color: '#f8fafc',
              fontSize: '0.85rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ paddingBottom: '10px', fontSize: '0.8rem' }}
          />
          <Area
            type="monotone"
            dataKey="clicks"
            name="Total Clicks"
            stroke="#6366f1"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#clicksGradient)"
          />
          {data[0]?.uniqueVisitors !== undefined && (
            <Area
              type="monotone"
              dataKey="uniqueVisitors"
              name="Unique Visitors"
              stroke="#06b6d4"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#visitorsGradient)"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
