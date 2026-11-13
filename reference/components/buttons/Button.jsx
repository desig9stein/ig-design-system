import React from 'react';
import { Icon } from '../icons/Icon.jsx';

// size picks one engine type slot plus padding from the spacing scale (see bundle.css, [data-ig="button"]).
//   hero (subtitle-2) | md (button) | catalog (caption) | sm (caption, tight)
// States are CSS: :hover, :focus-visible, [aria-disabled], [aria-busy]. Nothing here tracks hover in JS.
//   disabled  dims to --opacity-disabled, blocks pointer events, keeps the label readable
//   loading   shows a spinner in place of the arrow, sets aria-busy and ignores clicks
const TYPE = { hero: 'subtitle-2', md: 'button', catalog: 'caption', sm: 'caption' };

export function Button({
  children, variant = 'primary', size = 'hero', href, arrow = variant === 'primary',
  disabled = false, loading = false, onClick, style, ...rest
}) {
  const inert = disabled || loading;
  const Tag = href ? 'a' : 'button';
  return (
    <Tag href={inert ? undefined : href} onClick={inert ? e => e.preventDefault() : onClick}
         className={'type-' + (TYPE[size] || TYPE.hero)}
         data-ig="button" data-variant={variant} data-size={size}
         aria-disabled={inert || undefined} aria-busy={loading || undefined}
         disabled={!href ? inert : undefined} style={style} {...rest}>
      {children}
      {loading ? <span data-ig-spinner="" aria-hidden="true" /> : arrow && <Icon name="arrow-right" size="text" />}
    </Tag>
  );
}
