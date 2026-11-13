import React from 'react';
import { Icon } from '../icons/Icon.jsx';

const BORDER = 'var(--border-width-default) solid var(--color-border-default)';
const BADGE = {
  yesOurs: { bg: 'var(--color-action-default)', fg: 'var(--color-action-on)', icon: <Icon name="check" size="xs" weight="strong" />, sr: 'Yes' },
  yes: { bg: 'var(--table-mark-yes-background)', fg: 'var(--table-mark-yes-color)', icon: <Icon name="check" size="xs" weight="strong" />, sr: 'Yes' },
  partial: { bg: 'var(--table-mark-partial-background)', fg: 'var(--table-mark-partial-color)', icon: <Icon name="half-circle" size="xs" weight="strong" />, sr: 'Partial' },
  gated: { bg: 'var(--table-mark-partial-background)', fg: 'var(--table-mark-partial-color)', icon: <Icon name="lock" size="xs" weight="strong" />, sr: 'Gated' },
  no: { bg: 'var(--table-mark-no-background)', fg: 'var(--table-mark-no-color)', icon: <Icon name="close" size="xs" weight="strong" />, sr: 'No' },
};
const SR = { position: 'absolute', width: 'var(--border-width-default)', height: 'var(--border-width-default)', overflow: 'hidden', clipPath: 'inset(50%)' };
const norm = c => (c && typeof c === 'object') ? c : { mark: c === true ? 'yes' : c === false ? 'no' : (c || 'no') };

function BadgeMark({ cell, ours }) {
  const c = norm(cell);
  const b = c.mark === 'yes' && ours ? BADGE.yesOurs : (BADGE[c.mark] || BADGE.no);
  const text = c.text ?? (c.mark === 'yes' ? 'Yes' : c.mark === 'no' ? 'No' : '');
  return (
    <span className="type-caption" style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-gap-xs)', lineHeight: 'var(--type-body-2-line-height)', fontWeight: ours && c.mark === 'yes' ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)', color: ours && c.mark === 'yes' ? 'var(--color-text-heading)' : 'var(--color-text-ui)' }}>
      <span title={b.sr} style={{ flex: '0 0 auto', width: 'var(--size-icon-lg)', height: 'var(--size-icon-lg)', borderRadius: 'var(--radius-full)', background: b.bg, color: b.fg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{b.icon}</span>
      <span>{text || <span style={SR}>{b.sr}</span>}</span>
    </span>
  );
}
function PlainMark({ cell }) {
  const on = norm(cell).mark === 'yes';
  return on
    ? <span role="img" aria-label="Included" style={{ color: 'var(--color-action-text)', display: 'inline-flex' }}><Icon name="check" size="lg" weight="strong" /></span>
    : <span role="img" aria-label="Not included" style={{ color: 'var(--color-icon-subtle)', fontSize: 'var(--type-h6-font-size)', fontWeight: 'var(--font-weight-medium)', lineHeight: 1 }}>—</span>;
}

export function ComparisonTable({ variant = 'comparison', label, columns = [], groups = [], detail, collapsible, verified, sourcesHref, sourcesLabel = 'Sources', style, ...rest }) {
  const isCmp = variant === 'comparison';
  const ours = Math.max(0, columns.findIndex(c => c.highlight));
  const showDetail = isCmp && (detail ?? columns.length === 2);
  const total = groups.reduce((n, g) => n + (g.rows?.length || 0), 0);
  const canCollapse = collapsible ?? total > 15;
  const [closed, setClosed] = React.useState({});
  const tpl = ['minmax(0,1.25fr)', ...columns.map(() => isCmp ? 'minmax(0,0.9fr)' : 'minmax(0,1fr)'), ...(showDetail ? ['minmax(0,2.2fr)'] : [])].join(' ');
  const row = { display: 'grid', gridTemplateColumns: tpl };
  const cellPad = isCmp ? 'var(--space-inset-md) var(--space-inset-xl)' : 'var(--space-inset-md) var(--space-inset-xl)';
  const align = isCmp ? 'flex-start' : 'center';
  const tint = i => i === ours ? 'var(--color-surface-tint)' : undefined;
  const caps = { fontSize: 'var(--type-overline-font-size)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-label)', textTransform: 'uppercase' };
  const headPad = 'var(--space-inset-md) var(--space-inset-xl)';

  const head = isCmp ? (
    <div role="row" style={{ ...row, background: 'var(--color-surface-inverse)', color: 'var(--color-text-inverse)' }}>
      <div role="columnheader" style={{ padding: headPad, ...caps }}>{label ?? 'Capability'}</div>
      {columns.map((c, i) => (
        <div role="columnheader" key={i} style={{ padding: headPad, background: i === ours ? 'var(--color-action-default)' : undefined }}>
          <div style={caps}>{c.name}</div>
          {c.sub && <div style={{ fontSize: 'var(--type-overline-font-size)', marginTop: 'var(--space-stack-2xs)', color: i === ours ? 'var(--table-header-sub-highlight-color)' : 'var(--table-header-sub-color)' }}>{c.sub}</div>}
        </div>
      ))}
      {showDetail && <div role="columnheader" style={{ padding: headPad, ...caps, color: 'var(--table-header-detail-color)' }}>Detail</div>}
    </div>
  ) : (
    <div role="row" style={{ ...row, background: 'var(--color-surface-subtle)', alignItems: 'stretch' }}>
      <div role="columnheader" style={{ padding: 'var(--space-inset-xl)', ...caps, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'flex-end' }}>{label ?? 'Feature'}</div>
      {columns.map((c, i) => (
        <div role="columnheader" key={i} style={{ background: tint(i), display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', textAlign: 'center' }}>
          {c.tab && <div style={{ background: 'var(--color-action-default)', color: 'var(--color-action-on)', fontSize: 'var(--type-detail-2-font-size)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-label)', textTransform: 'uppercase', padding: 'var(--space-inset-xs) var(--space-inset-xs)' }}>{c.tab}</div>}
          <div className="type-body-2" style={{ padding: c.tab ? 'var(--space-inset-sm) var(--space-inset-md) var(--space-inset-md)' : 'var(--space-inset-xl) var(--space-inset-md)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-heading)' }}>{c.name}{c.sub && <div style={{ fontSize: 'var(--type-overline-font-size)', fontWeight: 'var(--font-weight-regular)', color: 'var(--color-text-muted)', marginTop: 'var(--space-stack-2xs)' }}>{c.sub}</div>}</div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={style} {...rest}>
      <div role="table" style={{ border: BORDER, borderRadius: 'var(--radius-xl)', overflow: 'clip', boxShadow: 'var(--elevation-1)', background: 'var(--color-surface-page)', fontFamily: 'var(--font-body)' }}>
        <div role="rowgroup" style={{ position: 'sticky', top: 0, zIndex: 'var(--z-index-raised)' }}>{head}</div>
        {groups.map((g, gi) => {
          const isClosed = canCollapse && closed[gi];
          return (
            <div role="rowgroup" key={gi}>
              {g.name && (
                <div role="row" style={{ background: 'var(--color-surface-subtle)', borderTop: BORDER }}>
                  <div role="cell" style={{ padding: 0 }}>
                    {React.createElement(canCollapse ? 'button' : 'div', {
                      type: canCollapse ? 'button' : undefined,
                      'aria-expanded': canCollapse ? !isClosed : undefined,
                      onClick: canCollapse ? () => setClosed(s => ({ ...s, [gi]: !s[gi] })) : undefined,
                      style: { display: 'flex', alignItems: 'center', gap: 'var(--space-gap-xs)', width: '100%', padding: 'var(--space-inset-sm) var(--space-inset-xl)', background: 'none', border: 0, textAlign: 'left', cursor: canCollapse ? 'pointer' : 'default', fontFamily: 'inherit', ...caps, color: 'var(--color-action-text)' },
                    },
                      canCollapse && <Icon name="chevron-down" size="xs" weight="strong" style={{ transform: isClosed ? 'rotate(-90deg)' : 'none', transition: 'transform var(--duration-fast) var(--easing-default)' }} />,
                      g.name,
                      g.count != null && <span style={{ color: 'var(--color-text-muted)', letterSpacing: 'var(--letter-spacing-badge)' }}>{g.count}</span>)}
                  </div>
                </div>
              )}
              {!isClosed && (g.rows || []).map((r, ri) => (
                <div role="row" key={ri} style={{ ...row, borderTop: BORDER }}>
                  <div role="rowheader" className="type-body-2" style={{ padding: cellPad, fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-heading)' }}>{r.label}</div>
                  {columns.map((c, ci) => (
                    <div role="cell" key={ci} style={{ padding: cellPad, background: tint(ci), display: 'flex', justifyContent: isCmp ? 'flex-start' : 'center', alignItems: align }}>
                      {isCmp ? <BadgeMark cell={r.cells?.[ci]} ours={ci === ours} /> : <PlainMark cell={r.cells?.[ci]} />}
                    </div>
                  ))}
                  {showDetail && <div role="cell" className="type-caption" style={{ padding: cellPad, color: 'var(--color-text-secondary)', textWrap: 'pretty' }}>{r.detail}</div>}
                </div>
              ))}
            </div>
          );
        })}
      </div>
      {isCmp && (verified || sourcesHref) && (
        <div className="type-detail-1" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-gap-2xs) var(--space-gap-sm)', marginTop: 'var(--space-stack-sm)', color: 'var(--color-text-muted)' }}>
          {verified && <span>Last verified {verified}</span>}
          {sourcesHref && <a href={sourcesHref} style={{ color: 'var(--color-action-text)', textDecoration: 'none', fontWeight: 'var(--font-weight-semibold)' }}>{sourcesLabel}</a>}
        </div>
      )}
    </div>
  );
}
