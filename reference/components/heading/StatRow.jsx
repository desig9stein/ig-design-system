import React from 'react';

export function StatRow({ stats = [], align = 'center', style, ...rest }) {
  return (
    <div className="type-body-2" style={{
      display: 'flex', flexWrap: 'wrap', justifyContent: align === 'center' ? 'center' : 'flex-start',
      gap: 'var(--space-gap-xs) var(--space-gap-xl)', color: 'var(--color-text-muted)', ...style,
    }} {...rest}>
      {stats.map((s, i) => (
        <span key={i}><b style={{ color: 'var(--color-text-muted)' }}>{s.value}</b> {s.label}</span>
      ))}
    </div>
  );
}
