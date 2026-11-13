import React from 'react';
import { Icon } from '../icons/Icon.jsx';

// Release strip: rest, hover and keyboard-focus looks are CSS ([data-ig="release-strip"]).
function ReleaseStrip({ href, label = 'Latest Release', title, body, linkLabel = 'Read More', style, ...rest }) {
  const nw = { whiteSpace: 'nowrap' };
  return (
    <a href={href} className="type-body-2" data-ig="release-strip" style={style} {...rest}>
      <span className="type-overline" data-ig-label="" style={nw}>{label}</span>
      <span style={{ ...nw, fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-heading)' }}>{title}</span>
      {body && <span style={{ ...nw, color: 'var(--color-text-secondary)' }}>{body}</span>}
      <span style={{ ...nw, display: 'inline-flex', alignItems: 'center', gap: 'var(--space-gap-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-action-text)' }}>
        {linkLabel}
        <Icon name="arrow-right" size="sm" />
      </span>
    </a>
  );
}

export function CalloutStrip({ kind = 'default', title, body, action, style, ...rest }) {
  if (kind === 'release') return <ReleaseStrip title={title} body={body} style={style} {...rest} />;
  const { href, label, linkLabel, ...divRest } = rest;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 'var(--space-gap-md)', padding: 'var(--space-inset-xl) var(--space-inset-xl)',
      borderRadius: 'var(--radius-xl)', background: 'var(--color-surface-subtle)',
      border: 'var(--border-width-default) solid var(--color-border-subtle)', flexWrap: 'wrap', ...style,
    }} {...divRest}>
      <div style={{ flex: 1, minWidth: 'var(--callout-min-width)' }}>
        <div className="type-subtitle-2" style={{ color: 'var(--color-text-heading)', marginBottom: 'var(--space-stack-2xs)' }}>{title}</div>
        {body && <div className="type-caption" style={{ color: 'var(--color-text-muted)' }}>{body}</div>}
      </div>
      {action}
    </div>
  );
}
