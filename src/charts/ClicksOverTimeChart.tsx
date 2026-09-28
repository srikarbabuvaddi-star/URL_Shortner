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

export const ClicksOverTimeChart: React.FC<ClicksOverTimeChartProps> = ({ data, height = 280 }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
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
              <stop offset="5%" stopColor="#4058EB" stopOpacity={0.16} />
              <stop offset="95%" stopColor="#4058EB" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0BA5E9" stopOpacity={0.12} />
              <stop offset="95%" stopColor="#0BA5E9" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ECEEF2" vertical={false} />
          <XAxis
            dataKey="displayDate"
            stroke="#8E96A4"
            fontSize={11.5}
            tickLine={false}
            axisLine={{ stroke: '#E1E4E9' }}
          />
          <YAxis
            stroke="#8E96A4"
            fontSize={11.5}
            tickLine={false}
            axisLine={{ stroke: '#E1E4E9' }}
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
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
          />
          <Area
            type="monotone"
            dataKey="clicks"
            name="Total Clicks"
            stroke="#4058EB"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#clicksGradient)"
          />
          {data[0]?.uniqueVisitors !== undefined && (
            <Area
              type="monotone"
              dataKey="uniqueVisitors"
              name="Unique Visitors"
              stroke="#0BA5E9"
              strokeWidth={1.75}
              strokeDasharray="4 2"
              fillOpacity={1}
              fill="url(#visitorsGradient)"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
