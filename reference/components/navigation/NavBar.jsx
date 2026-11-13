import React from 'react';
import { Icon } from '../icons/Icon.jsx';

const IG = 'https://www.infragistics.com';
const DEFAULT_ITEMS = [
  { label: 'Products', key: 'products' },
  { label: 'AI Tools', href: IG + '/ai-assisted-app-development' },
  { label: 'Docs', key: 'docs' },
  { label: 'Learn & Support', key: 'resources' },
  { label: 'Pricing', href: IG + '/how-to-buy/product-pricing' },
];

// Selectors, hover states and media queries for this component live in bundle.css (section 6),
// built from tokens: [data-ign] …

export function NavBar({
  logo = '../assets/logos/ig-logo.svg', logoHref = IG + '/', items = DEFAULT_ITEMS,
  trigger = 'click', dimPage = true, onSearch, onMenu,
  accountHref = IG + '/my-account/keys-and-downloads', githubHref = 'https://github.com/IgniteUI',
  cta = { label: 'Start Free Trial', href: IG + '/free-downloads' },
  panelWidth = 'var(--nav-panel-max-width)', utility, defaultOpen = null, style, ...rest
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const root = React.useRef(null);
  const keyOf = it => it.key || it.label;
  const current = items.find(i => i.panel && keyOf(i) === open);

  React.useEffect(() => {
    if (!open) return;
    const esc = e => { if (e.key !== 'Escape') return; const t = root.current && root.current.querySelector('[data-ign-key="' + open + '"]'); setOpen(null); t && t.focus(); };
    const out = e => { if (root.current && !root.current.contains(e.target)) setOpen(null); };
    document.addEventListener('keydown', esc); document.addEventListener('click', out);
    return () => { document.removeEventListener('keydown', esc); document.removeEventListener('click', out); };
  }, [open]);

  const trigStyle = { display: 'inline-flex', alignItems: 'center', gap: 'var(--space-gap-2xs)', whiteSpace: 'nowrap', color: 'var(--color-text-secondary)', padding: 'var(--space-inset-xs) clamp(var(--space-inset-xs), 1vw, var(--space-inset-sm))', borderRadius: 'var(--radius-full)', transition: 'var(--transition-default)', background: 'none', border: 'none', font: 'inherit', cursor: 'pointer', textDecoration: 'none' };
  const iconBtn = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 'var(--size-control-sm)', height: 'var(--size-control-sm)', background: 'none', border: 'none', borderRadius: 'var(--radius-full)', padding: 0, cursor: 'pointer', color: 'var(--color-text-secondary)', transition: 'var(--transition-default)' };
  const scrimOn = dimPage && !!current;

  return (
    <>
      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 'var(--z-index-sticky)', background: 'var(--color-overlay-scrim)', opacity: scrimOn ? 1 : 0, pointerEvents: scrimOn ? 'auto' : 'none', transition: 'opacity var(--duration-button) var(--easing-default)' }}></div>
      <div ref={root} data-ign="" onMouseLeave={() => trigger === 'hover' && setOpen(null)} style={{ position: 'sticky', top: 0, zIndex: 'var(--z-index-nav)', background: 'var(--nav-background)', backdropFilter: 'var(--nav-backdrop-blur)', WebkitBackdropFilter: 'var(--nav-backdrop-blur)', borderBottom: 'var(--border-width-default) solid var(--color-border-subtle)', fontFamily: 'var(--font-body)', ...style }} {...rest}>
        {utility}
        <div style={{ maxWidth: 'var(--container-max-width)', margin: '0 auto', padding: '0 var(--container-gutter)', minHeight: 'var(--nav-height)', display: 'flex', alignItems: 'center', gap: 'clamp(var(--space-gap-md), 2.4vw, var(--space-gap-3xl))' }}>
          <a href={logoHref} aria-label="Infragistics home" style={{ flex: '0 0 auto', display: 'block' }}><img src={logo} alt="Infragistics" style={{ height: 'var(--logo-height)', display: 'block' }} /></a>
          <div data-ign-items="" style={{ flex: '1 1 auto', minWidth: 0, display: 'flex', flexWrap: 'nowrap', alignItems: 'center', gap: 'clamp(var(--space-gap-3xs), 0.7vw, var(--space-gap-xs))', fontSize: 'clamp(var(--type-detail-1-font-size), 1.15vw, var(--type-body-2-font-size))', fontWeight: 'var(--font-weight-semibold)' }}>
            {items.map(it => {
              const k = keyOf(it);
              if (!it.panel) return <a key={k} data-ign-trig="" href={it.href || '#'} style={trigStyle}>{it.label}</a>;
              const on = open === k;
              return (
                <span key={k} style={{ display: 'inline-flex' }} onMouseEnter={() => trigger === 'hover' && setOpen(k)}>
                  <button type="button" data-ign-trig="" data-ign-key={k} data-on={on ? 'true' : 'false'} aria-expanded={on} aria-controls={'ign-panel-' + k}
                    onClick={() => setOpen(on && trigger === 'click' ? null : k)} style={trigStyle}>{it.label}<Icon name="chevron-down" size="xs" /></button>
                </span>
              );
            })}
          </div>
          <div style={{ flex: '0 0 auto', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 'var(--space-gap-sm)' }}>
            {onMenu && <button type="button" data-ign-burger="" data-ign-icon="" aria-label="Open menu" onClick={onMenu} style={iconBtn}><Icon name="menu" size="lg" /></button>}
            {onSearch && <button type="button" data-ign-icon="" aria-label="Search" onClick={onSearch} style={iconBtn}><Icon name="search" size="lg" /></button>}
            {accountHref && <a data-ign-secondary="" data-ign-text="" href={accountHref} className="type-body-2" style={{ fontWeight: 'var(--font-weight-semibold)', whiteSpace: 'nowrap', color: 'var(--color-text-secondary)', textDecoration: 'none', transition: 'var(--transition-default)' }}>My Account</a>}
            {githubHref && <a data-ign-text="" href={githubHref} target="_blank" rel="noopener" aria-label="Ignite UI on GitHub (opens in new tab)" style={{ display: 'inline-flex', padding: 'var(--space-inset-2xs)', color: 'var(--color-text-secondary)', transition: 'var(--transition-default)' }}><svg style={{ width: 'var(--size-icon-lg)', height: 'var(--size-icon-lg)' }} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"></path></svg></a>}
            {cta && <a data-ign-cta="" href={cta.href} className="type-button" style={{ display: 'inline-flex', alignItems: 'center', height: 'var(--size-control-md)', padding: '0 var(--space-inset-md)', borderRadius: 'var(--radius-full)', background: 'var(--color-action-default)', color: 'var(--color-action-on)', fontWeight: 'var(--font-weight-semibold)', whiteSpace: 'nowrap', textDecoration: 'none', boxShadow: 'var(--shadow-accent-lg)', transition: 'all var(--duration-button) var(--easing-default)' }}>{cta.label}</a>}
          </div>
        </div>
        {current && (
          <div data-ign-panel="" id={'ign-panel-' + keyOf(current)} role="region" aria-label={current.label + ' menu'}
            style={{ position: 'absolute', left: '50%', top: '100%', transform: 'translateX(-50%)', width: `min(calc(100vw - 2 * var(--container-gutter)), ${panelWidth})`, maxHeight: 'calc(100dvh - var(--nav-height) - var(--space-lg))', overflowY: 'auto', background: 'var(--color-surface-page)', backgroundClip: 'padding-box', borderTop: 'var(--space-sm) solid transparent', borderRadius: 'var(--radius-xl) / var(--nav-panel-radius) var(--nav-panel-radius) var(--radius-xl) var(--radius-xl)', filter: 'var(--shadow-popover-filter)' }}>
            {current.panel}
          </div>
        )}
      </div>
    </>
  );
}

export function NavPanelCard({ title, tint = 'var(--color-surface-tint)', children, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-gap-sm)', minWidth: 0, border: 'var(--border-width-default) solid var(--color-border-default)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-inset-lg) var(--space-inset-lg) var(--space-inset-lg) var(--space-inset-xl)', overflow: 'hidden', ...style }}>
      <div style={{ background: tint, margin: 'calc(-1 * var(--space-stack-lg)) calc(-1 * var(--space-stack-lg)) var(--space-stack-2xs) calc(-1 * var(--space-stack-xl))', padding: 'var(--space-inset-md) var(--space-inset-lg) var(--space-inset-sm) var(--space-inset-xl)' }}>
        <h3 className="type-h6" style={{ margin: 0, fontSize: 'clamp(var(--type-subtitle-2-font-size), 1.5vw, var(--type-subtitle-1-font-size))', color: 'var(--color-text-heading)' }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

export function NavLink({ href, icon: lead, label, desc, level = 1, soon, external, style }) {
  const fontSize = level === 3 ? 'var(--type-body-2-font-size)' : 'var(--type-h6-font-size)';
  const pill = soon && <span className="type-overline" style={{ display: 'inline-flex', padding: 'var(--space-inset-3xs) var(--space-inset-xs)', borderRadius: 'var(--radius-full)', background: 'var(--color-surface-muted)', border: 'var(--border-width-default) solid var(--color-border-default)', textTransform: 'none', letterSpacing: 'normal', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>Coming Soon</span>;
  if (soon || !href) return <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-gap-2xs) var(--space-gap-xs)', padding: 'var(--space-inset-xs) var(--space-inset-sm)', marginLeft: 'calc(-1 * var(--space-gap-sm))', fontSize, fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-secondary)', ...style }}>{lead}{label}{pill}</div>;
  const x = external ? { target: '_blank', rel: 'noopener' } : {};
  return (
    <a href={href} {...x} data-ig="nav-link" data-level={level}
      style={{ display: 'flex', alignItems: desc ? 'flex-start' : 'center', gap: 'var(--space-gap-xs)', padding: desc ? 'var(--space-inset-sm)' : level === 3 ? 'var(--space-inset-2xs) var(--space-inset-sm)' : 'var(--space-inset-xs) var(--space-inset-sm)', marginLeft: 'calc(-1 * var(--space-gap-sm))', borderRadius: 'var(--radius-md)', fontSize, fontWeight: level === 1 ? 'var(--font-weight-semibold)' : level === 2 ? 'var(--font-weight-medium)' : 'var(--font-weight-regular)', textDecoration: 'none', ...style }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-gap-xs)', minWidth: 0 }}>
        {lead}
        {desc ? <span style={{ display: 'block' }}><span data-ig-label="" style={{ display: 'block' }}>{label}</span><span style={{ display: 'block', fontSize: 'var(--type-body-2-font-size)', fontWeight: 'var(--font-weight-regular)', lineHeight: 'var(--type-body-2-line-height)', color: 'var(--color-text-muted)', marginTop: 'var(--space-stack-2xs)' }}>{desc}</span></span>
          : <span style={{ paddingLeft: level === 3 ? 'var(--space-inset-2xl)' : 0 }}>{label}</span>}
      </span>
      {!desc && <Icon name="arrow-right" size={level === 3 ? 'sm' : 'md'} data-ig-arrow="" />}
      {external && <span style={{ position: 'absolute', width: 'var(--border-width-default)', height: 'var(--border-width-default)', overflow: 'hidden', clipPath: 'inset(50%)' }}> (opens in new tab)</span>}
    </a>
  );
}
