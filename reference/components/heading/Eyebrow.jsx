import React from 'react';

export function Eyebrow({ children, color = 'var(--color-action-text)', style, ...rest }) {
  return (
    <div className="type-overline" style={{ color, marginBottom: 'var(--space-stack-md)', ...style }} {...rest}>{children}</div>
  );
}
