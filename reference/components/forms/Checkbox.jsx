import React from 'react';
import { Icon } from '../icons/Icon.jsx';

// Checkbox with its label. The box is --size-icon-md; the whole label is the click target.
//   error  a message string; turns on the invalid state and shows the message below the label.
//   tone   'light' (default) | 'dark'
// States are CSS: :hover, :focus-visible, :checked, [aria-invalid], :disabled.
export function Checkbox({ children, error, tone = 'light', disabled = false, id, style, ...rest }) {
  const uid = React.useId();
  const cid = id || 'ig-check-' + uid.replace(/:/g, '');
  return (
    <div data-ig="checkbox-field" data-tone={tone} style={style}>
      <label className="type-detail-1" data-ig="checkbox" htmlFor={cid} data-disabled={disabled || undefined}>
        <span data-ig-box="">
          <input id={cid} type="checkbox" disabled={disabled} aria-invalid={error ? 'true' : undefined}
                 aria-describedby={error ? cid + '-msg' : undefined} {...rest} />
          <Icon name="check" size="md" weight="strong" />
        </span>
        <span style={{ textWrap: 'pretty' }}>{children}</span>
      </label>
      {error && <p id={cid + '-msg'} className="type-detail-1" data-ig-message="" data-error="" role="alert">{error}</p>}
    </div>
  );
}
