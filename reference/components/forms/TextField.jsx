import React from 'react';

// Single-line text input with its label, hint and error message wired up (label for, aria-describedby, aria-invalid).
//   size   'md' (--size-control-md) | 'lg' (--size-control-lg)
//   tone   'light' (default) | 'dark' for dark sections such as the footer
//   error  a message string. Setting it turns on the invalid state and shows the message.
//   hideLabel keeps the label for screen readers only.
//   bare   drops the border and fill so the field can sit inside a custom wrapper.
// States are CSS: :hover, :focus-visible, [aria-invalid], :disabled.
export function TextField({
  label, hint, error, size = 'md', tone = 'light', hideLabel = false, bare = false,
  id, disabled = false, style, inputStyle, ...rest
}) {
  const uid = React.useId();
  const fid = id || 'ig-field-' + uid.replace(/:/g, '');
  const msg = error || hint;
  return (
    <div data-ig="field" data-tone={tone} style={style}>
      <label htmlFor={fid} className="type-detail-1" data-ig-label="" data-hidden={hideLabel || undefined}>{label}</label>
      <input id={fid} className="type-body-2" data-ig="input" data-size={size} data-bare={bare || undefined}
             disabled={disabled} aria-invalid={error ? 'true' : undefined}
             aria-describedby={msg ? fid + '-msg' : undefined} style={inputStyle} {...rest} />
      {msg && <p id={fid + '-msg'} className="type-detail-1" data-ig-message="" data-error={error ? '' : undefined} role={error ? 'alert' : undefined}>{msg}</p>}
    </div>
  );
}
