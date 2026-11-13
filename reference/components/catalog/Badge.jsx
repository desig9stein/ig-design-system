import React from 'react';

const KINDS = {
  bundle: {
    type: 'detail-2', background: 'var(--badge-bundle-background)', color: 'var(--badge-bundle-color)',
    fontFamily: 'var(--font-display)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-badge)',
    textTransform: 'uppercase', padding: 'var(--space-inset-2xs) var(--space-inset-xs)', borderRadius: 'var(--radius-full)',
  },
  oss: {
    type: 'detail-2', background: 'var(--badge-oss-background)', color: 'var(--badge-oss-color)',
    fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-badge)',
    padding: 'var(--space-inset-3xs) var(--space-inset-xs)', borderRadius: 'var(--radius-xs)',
  },
  mono: {
    type: 'detail-1', background: 'var(--color-surface-tint)', color: 'var(--color-action-text)',
    fontFamily: 'var(--font-display)', fontWeight: 'var(--font-weight-extrabold)', letterSpacing: 'var(--letter-spacing-mono)',
    height: 'var(--badge-mono-size)', minWidth: 'var(--badge-mono-size)', padding: '0 var(--space-inset-xs)',
    borderRadius: 'var(--radius-sm)', justifyContent: 'center',
  },
};

export function Badge({ kind = 'bundle', children, style, ...rest }) {
  const { type, ...k } = KINDS[kind] || KINDS.bundle;
  return (
    <span className={'type-' + type} style={{
      flex: '0 0 auto', display: 'inline-flex', alignItems: 'center',
      whiteSpace: 'nowrap', ...k, ...style,
    }} {...rest}>{children}</span>
  );
}
