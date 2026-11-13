import React from 'react';

export function TrustChip({ children, style, ...rest }) {
  return (
    <div className="type-caption" style={{
      display: 'inline-flex', alignItems: 'center', gap: 'var(--space-gap-xs)', padding: 'var(--space-inset-xs) var(--space-inset-md)',
      border: 'var(--border-width-default) solid var(--color-border-default)', background: 'var(--color-surface-tint)',
      borderRadius: 'var(--radius-full)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-ui)', whiteSpace: 'nowrap', ...style,
    }} {...rest}>{children}</div>
  );
}
