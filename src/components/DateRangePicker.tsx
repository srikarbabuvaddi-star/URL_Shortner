import React from 'react';
import { Calendar } from 'lucide-react';

interface DateRangePickerProps {
  value: 'today' | '7d' | '30d' | '90d';
  onChange: (value: 'today' | '7d' | '30d' | '90d') => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ value, onChange }) => {
  const options: Array<{ label: string; value: 'today' | '7d' | '30d' | '90d' }> = [
    { label: 'Today', value: 'today' },
    { label: '7D', value: '7d' },
    { label: '30D', value: '30d' },
    { label: '90D', value: '90d' },
  ];

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: '#FFFFFF',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-sm)',
        padding: '2px',
        gap: '2px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 0.4rem', color: 'var(--text-muted)' }}>
        <Calendar size={13} />
      </div>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          type="button"
          style={{
            padding: '0.3rem 0.65rem',
            fontSize: '12px',
            fontWeight: value === opt.value ? 600 : 500,
            borderRadius: 'var(--radius-xs)',
            border: 'none',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
            background: value === opt.value ? 'var(--primary)' : 'transparent',
            color: value === opt.value ? '#FFFFFF' : 'var(--text-secondary)',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};
