import React from 'react';

// Hover lift is CSS ([data-ig="feature-card"]:hover). A card with an href is a stretched link, so it also lifts on keyboard focus.
export function FeatureCard({
  title, body, icon, href, footer,
  emphasis = false, layout = 'stack', style, children, ...rest
}) {
  return (
    <div data-ig="feature-card" data-emphasis={emphasis || undefined} data-layout={layout} style={style} {...rest}>
      {href && <a href={href} aria-label={title} data-ig-cover="" />}
      {icon}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-gap-2xs)', minWidth: 0 }}>
        {title && <h3 className="type-h5" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-heading)', margin: 0 }}>{title}</h3>}
        {body && <p className="type-caption" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>{body}</p>}
        {children}
        {footer && <div style={{ marginTop: 'var(--space-stack-xs)', position: 'relative', zIndex: 'var(--z-index-media)' }}>{footer}</div>}
      </div>
    </div>
  );
}
