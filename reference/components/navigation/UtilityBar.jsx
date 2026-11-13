import React from 'react';

export function UtilityBar({
  salesLabel = 'North American Sales:', phone = '1-800-231-8588',
  links = [{ label: 'Global Contacts', href: '#' }, { label: 'My Account', href: '#' }],
  style, ...rest
}) {
  return (
    <div className="type-detail-1" style={{
      maxWidth: 'var(--container-max-width)', margin: '0 auto',
      padding: 'var(--space-inset-xs) var(--container-gutter)', display: 'flex', alignItems: 'center',
      flexWrap: 'wrap', justifyContent: 'flex-end', gap: 'var(--space-gap-2xs) clamp(var(--space-gap-xs), 1.6vw, var(--space-gap-xl))',
      fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-secondary)', ...style,
    }} {...rest}>
      <span style={{ whiteSpace: 'nowrap' }}>
        {salesLabel}{' '}
        <a href={'tel:' + phone.replace(/[^0-9]/g, '')} style={{ color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>{phone}</a>
      </span>
      {links.map(l => (
        <a key={l.label} href={l.href} style={{ color: 'var(--color-link-utility)' }}>{l.label}</a>
      ))}
    </div>
  );
}
