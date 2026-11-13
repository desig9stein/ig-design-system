import React from 'react';

const DOTS = ['var(--window-dot-red)', 'var(--window-dot-amber)', 'var(--window-dot-green)'];

export function BrowserFrame({ src, alt = '', children, bleed = false, style, ...rest }) {
  return (
    <div style={{
      width: bleed ? 'calc(100% + max(var(--space-4xl), (100vw - var(--bleed-width)) / 2))' : '100%',
      borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      border: 'var(--border-width-default) solid var(--color-border-default)', boxShadow: 'var(--shadow-overlay)',
      background: 'var(--color-surface-page)', ...style,
    }} {...rest}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-gap-xs)', padding: 'var(--space-inset-xs) var(--space-inset-sm)',
        borderBottom: 'var(--border-width-default) solid var(--color-border-subtle)', background: 'var(--color-surface-subtle)',
      }}>
        {DOTS.map(c => (
          <span key={c} style={{ width: 'var(--window-dot-size)', height: 'var(--window-dot-size)', borderRadius: '50%', background: c }} />
        ))}
      </div>
      {src ? <img src={src} alt={alt} style={{ width: '100%', display: 'block' }} /> : children}
    </div>
  );
}
