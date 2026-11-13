import React from 'react';
import { Icon } from '../icons/Icon.jsx';

// size picks an engine type slot: sm = caption, md = body-2, lg = subtitle-2.
const TYPE = { sm: 'caption', md: 'body-2', lg: 'subtitle-2' };

export function ArrowLink({ children, href, tone = 'action', size = 'md', style, ...rest }) {
  return (
    <a href={href} className={'type-' + (TYPE[size] || TYPE.md)} data-ig="arrow-link" data-tone={tone} style={style} {...rest}>
      {children}
      <Icon name="arrow-right" size="text" />
    </a>
  );
}
