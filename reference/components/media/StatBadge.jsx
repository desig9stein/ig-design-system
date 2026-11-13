import React from 'react';

const ACCENTS = { sky: 'var(--color-accent-sky)', teal: 'var(--color-accent-teal)', blue: 'var(--color-accent-blue)', violet: 'var(--color-accent-violet)' };
const OFF = 'calc(-1 * var(--stat-badge-offset))';
const POS = {
  'top-left': { top: OFF, left: OFF }, 'top-right': { top: OFF, right: OFF },
  'bottom-left': { bottom: 'var(--stat-badge-inset)', left: 'var(--stat-badge-inset)' },
  'bottom-right': { bottom: 'var(--stat-badge-inset)', right: 'var(--stat-badge-inset)' },
};

// duration (seconds) overrides --duration-float for this badge only.
export function StatBadge({ value, label, accent = 'sky', position = 'top-left', duration, style, ...rest }) {
  return (
    <div style={{
      position: 'absolute', ...POS[position], zIndex: 'var(--z-index-media)',
      background: 'var(--color-surface-inverse)', borderRadius: 'var(--radius-md)',
      padding: 'var(--space-inset-sm) var(--space-inset-md)', boxShadow: 'var(--shadow-floating)',
      animation: 'ig-float var(--duration-float) ease-in-out infinite',
      animationDuration: duration != null ? duration + 's' : undefined, ...style,
    }} {...rest}>
      <div className="type-h4" style={{ color: ACCENTS[accent] || accent, whiteSpace: 'nowrap' }}>{value}</div>
      <div className="type-detail-2" style={{ color: 'var(--color-text-inverse-muted)' }}>{label}</div>
    </div>
  );
}
