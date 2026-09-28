import React from 'react';
import { Calendar } from 'lucide-react';

interface DateRangePickerProps {
  value: 'today' | '7d' | '30d' | '90d';
  onChange: (value: 'today' | '7d' | '30d' | '90d') => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ value, onChange }) => {
  const options: Array<{ label: string; value: 'today' | '7d' | '30d' | '90d' }> = [
    { label: 'Today', value: 'today' },
    { label: '7 Days', value: '7d' },
    { label: '30 Days', value: '30d' },
    { label: '90 Days', value: '90d' },
  ];

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '0.25rem',
        gap: '0.25rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 0.5rem', color: 'var(--text-muted)' }}>
        <Calendar size={15} />
      </div>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          type="button"
          style={{
            padding: '0.4rem 0.85rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
            background: value === opt.value ? 'var(--accent-primary)' : 'transparent',
            color: value === opt.value ? '#ffffff' : 'var(--text-secondary)',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};
