import React from 'react';

// One icon component for the whole system. Geometry is a 24 x 24 grid; stroke width, size and colour are all tokens.
//   size:   'text' follows the surrounding font size; otherwise the name of a `size-icon-*` token (xs, sm, md, lg).
//   weight: 'regular' = --size-icon-stroke, 'strong' = --size-icon-stroke-strong.
// Colour is currentColor, so an icon takes the colour of the element it sits in.
const SHAPES = {
  'arrow-right':  <><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></>,
  'chevron-down': <path d="m6 9 6 6 6-6"></path>,
  'check':        <path d="M20 6 9 17l-5-5"></path>,
  'close':        <><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></>,
  'search':       <><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></>,
  'menu':         <path d="M4 7h16M4 12h16M4 17h16"></path>,
  'lock':         <><rect width="16" height="11" x="4" y="11" rx="2"></rect><path d="M8 11V7a4 4 0 0 1 8 0v4"></path></>,
  'half-circle':  <><circle cx="12" cy="12" r="9"></circle><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" stroke="none"></path></>,
};


export function Icon({ name, size = 'md', weight = 'regular', label, style, ...rest }) {
  const box = size === 'text' ? '1em' : 'var(--size-icon-' + size + ')';
  const stroke = weight === 'strong' ? 'var(--size-icon-stroke-strong)' : 'var(--size-icon-stroke)';
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
         role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : 'true'}
         style={{ width: box, height: box, flex: '0 0 auto', strokeWidth: stroke, ...style }} {...rest}>
      {SHAPES[name]}
    </svg>
  );
}
