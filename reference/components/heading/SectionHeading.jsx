import React from 'react';

export function SectionHeading({
  children, accent, level = 2, align = 'left', lead, maxWidth, style, ...rest
}) {
  const Tag = 'h' + level;
  return (
    <div style={{ textAlign: align, maxWidth, margin: align === 'center' ? '0 auto' : undefined, ...style }} {...rest}>
      <Tag className={level === 1 ? 'type-h1' : 'type-h2'} style={{ color: 'var(--color-text-heading)', margin: '0 0 var(--space-stack-lg)' }}>
        {children}
        {accent && (
          <span style={{
            background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text',
            backgroundClip: 'text', color: 'transparent',
          }}> {accent}</span>
        )}
      </Tag>
      {lead && <p className="type-body-1" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>{lead}</p>}
    </div>
  );
}
