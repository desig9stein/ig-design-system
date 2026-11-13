import React from 'react';

export function ProductCard({
  name, description, logo, monogram, badge, variant = 'default',
  showName = true, footer, style, children, ...rest
}) {
  const bundle = variant === 'bundle';
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', position: 'relative',
      borderRadius: 'var(--radius-xl)', padding: 'var(--space-inset-xl)',
      ...(bundle
        ? { border: 'var(--border-width-strong) solid transparent', background: 'var(--gradient-border-bundle)', boxShadow: 'var(--shadow-accent-md)' }
        : { border: 'var(--border-width-default) solid var(--color-border-subtle)', background: 'var(--color-surface-card)', boxShadow: 'var(--shadow-none)' }),
      ...style,
    }} {...rest}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-gap-sm)', marginBottom: 'var(--space-stack-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-gap-xs)', minWidth: 0 }}>
          {logo && <img src={logo} alt={name} style={{ height: 'var(--product-logo-height)', maxWidth: 'var(--product-logo-max-width)', width: 'auto', objectFit: 'contain', display: 'block', flex: '0 0 auto' }} />}
          {!logo && monogram}
          {showName && <div className="type-h6" style={{ color: 'var(--color-text-heading)' }}>{name}</div>}
        </div>
        {badge}
      </div>
      {description && (
        <div className="type-caption" style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-stack-md)', flex: 1 }}>{description}</div>
      )}
      {children}
      {footer && <div style={{ marginTop: 'auto' }}>{footer}</div>}
    </div>
  );
}
