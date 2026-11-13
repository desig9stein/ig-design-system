import React from 'react';

const FILLS = {
  blue: 'var(--tile-blue)', violet: 'var(--tile-violet)',
  pink: 'var(--tile-pink)', teal: 'var(--tile-teal)',
  cyan: 'var(--tile-cyan)', amber: 'var(--tile-amber)',
  royal: 'var(--tile-royal)', ink: 'var(--tile-ink)',
};

// size is a name from the shared control scale: 'sm' | 'md' | 'lg' | 'xl'  (--size-control-*), or 'tile' (default, --size-tile).
// The tile follows --ig-size like every other control.
// The glyph colour (--tile-on) is derived from the fill: black on light fills, white on dark ones.
export function IconTile({ src, alt = '', fill = 'blue', size = 'tile', style, children, ...rest }) {
  const box = 'var(--size-' + (size === 'tile' ? 'tile' : 'control-' + size) + ')';
  return (
    <div data-ig="icon-tile" style={{
      '--tile-fill': FILLS[fill] || fill, color: 'var(--tile-on)',
      flex: '0 0 auto', width: box, height: box, borderRadius: 'var(--radius-md)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--tile-fill)', ...style,
    }} {...rest}>
      {src
        ? <img src={src} alt={alt} style={{ width: box, height: box, display: 'block' }} />
        : children}
    </div>
  );
}
