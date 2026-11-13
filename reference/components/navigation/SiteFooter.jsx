import React from 'react';
import { Icon } from '../icons/Icon.jsx';
import { TextField } from '../forms/TextField.jsx';
import { Checkbox } from '../forms/Checkbox.jsx';
import { Button } from '../buttons/Button.jsx';

const IG = 'https://www.infragistics.com';
const SOCIAL = {
  rss: { label: 'Infragistics RSS', href: IG + '/blogs/', stroke: true, d: ['M4 11a9 9 0 0 1 9 9', 'M4 4a16 16 0 0 1 16 16'], dot: true },
  x: { label: 'Infragistics on X', href: 'https://x.com/infragistics', d: ['M18.9 2h3.3l-7.2 8.2L23.5 22h-6.6l-5.2-6.8L5.8 22H2.5l7.7-8.8L2 2h6.8l4.7 6.2L18.9 2Zm-1.2 18h1.8L7.4 3.9H5.5L17.7 20Z'] },
  facebook: { label: 'Infragistics on Facebook', href: 'https://www.facebook.com/infragistics', d: ['M14 8.5V6.8c0-.8.2-1.3 1.4-1.3H17V2.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.2v1.8H8v3h2.6V22H14v-8.5h2.6l.4-3H14Z'] },
  linkedin: { label: 'Infragistics on LinkedIn', href: 'https://www.linkedin.com/company/infragistics', d: ['M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.6h.05c.53-1 1.83-2.06 3.77-2.06C20.6 8.54 22 10.2 22 13.4V21h-4v-6.7c0-1.6-.03-3.65-2.22-3.65-2.22 0-2.56 1.73-2.56 3.53V21H9V9Z'] },
  youtube: { label: 'Infragistics on YouTube', href: 'https://www.youtube.com/@Infragistics?sub_confirmation=1', d: ['M23 7.5c-.26-1-1-1.75-2-2C19.2 5 12 5 12 5s-7.2 0-9 .5c-1 .25-1.74 1-2 2C.5 9.3.5 12 .5 12s0 2.7.5 4.5c.26 1 1 1.75 2 2C4.8 19 12 19 12 19s7.2 0 9-.5c1-.25 1.74-1 2-2 .5-1.8.5-4.5.5-4.5s0-2.7-.5-4.5ZM9.8 15.3V8.7l5.7 3.3-5.7 3.3Z'] },
  discord: { label: 'Infragistics on Discord', href: 'https://discord.com/invite/c6e9Xdg3ty', d: ['M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03ZM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z'] },
  github: { label: 'Ignite UI on GitHub', href: 'https://github.com/IgniteUI', d: ['M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z'] },
};

const L = (label, path, x) => ({ label, href: path.startsWith('http') ? path : IG + path, ...x });
const ext = { external: true };
const FOOTER_DEFAULT_COLUMNS = [
  [{ title: 'Products', nested: true, links: [
    { label: 'Web', heading: true, children: [
      L('Ignite UI', '/products/ignite-ui', { children: [L('Angular', '/products/ignite-ui-angular'), L('React', '/products/ignite-ui-react'), L('Web Components', '/products/ignite-ui-web-components'), L('Blazor', '/products/ignite-ui-blazor')] }),
      L('App Builder', 'https://www.appbuilder.dev/platform', ext)] },
    { label: 'Desktop', heading: true, children: [L('Windows Forms', '/products/windows-forms'), L('WPF', '/products/wpf')] },
    { label: 'Bundles', heading: true, children: [L('Infragistics Ultimate', '/products/ultimate'), L('Infragistics Professional', '/products/pro'), L('Ignite UI', '/products/ignite-ui')] },
  ] }],
  [{ title: 'AI Tools', links: [L('AI-Assisted App Dev', '/ai-assisted-app-development', { strong: true, children: [
      L('AI Agent Skills', '/products/ignite-ui/ignite-ui-ai-agent-skills'), L('CLI MCP Server', '/products/ignite-ui/ignite-ui-cli-mcp'), L('Theming MCP Server', '/products/ignite-ui/ignite-ui-theming-mcp')] })] },
   { title: 'Open Source', links: [['Angular', 'angular'], ['React', 'react'], ['Web Components', 'web-components'], ['Blazor', 'blazor']].map(([n, s]) => L(n, `/products/ignite-ui-${s}/open-source`, { sr: ' open source' })) },
   { title: 'Compare', links: [['Angular', 'angular'], ['React', 'react'], ['Blazor', 'blazor']].map(([n, s]) => L(n, `/${s}-compare`, { sr: ' compare' })) }],
  [{ title: 'Docs', links: [L('Documentation', '/support'), L('Product Lifecycle', '/support/product-lifecycle')] },
   { title: 'Learn & Support', links: [L('Blogs', '/blogs'), L('Webinars', '/webinars'), L('Customer Stories', '/resources/case-studies'), L('eBooks & Whitepapers', '/resources/whitepapers'), L('Forums', '/forums/'), L('Sample Applications', '/resources/sample-applications'), L('Contact Support', 'https://account.infragistics.com/chatbot'), L('Support Policies', '/support/support-policies'), L('Service Health', '/status')] }],
  [{ title: 'Pricing', links: [L('Product Pricing', '/how-to-buy/product-pricing'), L('Free Trials', '/free-downloads'), L('Renewals & Subscriptions', 'https://account.infragistics.com/subscriptions')] },
   { title: 'Legal', links: [L('Terms of Use', '/legal/terms-of-use'), L('License Agreements', '/legal/license'), L('Patents', '/legal/patents'), L('Third-Party OSS', '/legal/third-party-oss'), L('SBOM', '/legal/sbom'), L('Cyber Resilience Act (CRA)', '/legal/cyber-resilience-act-cra')] }],
  [{ title: 'Company', links: [L('About Us', '/about-us'), L('Microsoft Partnership', '/microsoft-partnership'), L('Careers', '/about-us/careers'), L('News & Events', '/about-us/in-the-news'), L('Contact Us', '/about-us/contact-us')] }],
];
const DEFAULT_MORE = [L('Reveal', 'https://www.revealbi.io/', ext), L('Slingshot', 'https://www.slingshotapp.io/', ext)];
const DEFAULT_LEGAL = [L('Privacy Policy', '/legal/privacy'), L('Cookie Policy', '/legal/cookie-policy')];
const DEFAULT_SEALS = [
  { file: 'soc2-seal.png', alt: 'SOC 2 compliant, report available on request' },
  { file: 'gdpr-badge.png', alt: 'GDPR compliant (EU General Data Protection Regulation)' },
  { file: 'soc2-shield.png', alt: 'SOC 2 seal from I.S. Partners, LLC' },
];

// Selectors, hover states and media queries for the footer live in bundle.css (section 6), built from tokens: [data-igf] …
const glyph = size => ({ width: 'var(--size-icon-' + size + ')', height: 'var(--size-icon-' + size + ')' });
const label = { margin: 0, color: 'var(--footer-heading)' };
const subList = { listStyle: 'none', margin: 0, padding: '0 0 0 var(--space-inset-sm)', display: 'flex', flexDirection: 'column', gap: 'var(--space-gap-xs)', borderLeft: 'var(--border-width-default) solid var(--footer-rule-strong)' };
const Arrow = () => <Icon name="arrow-right" size="sm" data-ig-inline-arrow="" />;

function FLink({ l }) {
  const x = l.external ? { target: '_blank', rel: 'noopener' } : {};
  return <a data-arrow="" data-strong={l.strong ? '' : undefined} href={l.href} {...x}>{l.label}{l.sr && <span data-sr="">{l.sr}</span>}{l.external && <span data-sr=""> (opens in new tab)</span>}<Arrow /></a>;
}
function Item({ l }) {
  if (l.heading) return (
    <li style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-gap-xs)' }}>
      <span className="type-body-2" style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--footer-strong)' }}>{l.label}</span>
      <ul role="list" style={subList}>{l.children.map((c, i) => <Item key={i} l={c} />)}</ul>
    </li>);
  return (
    <li style={l.children ? { display: 'flex', flexDirection: 'column', gap: l.strong ? 'var(--space-gap-xs)' : 'var(--space-gap-xs)' } : undefined}>
      <FLink l={l} />
      {l.children && <ul role="list" style={subList}>{l.children.map((c, i) => <Item key={i} l={c} />)}</ul>}
    </li>);
}

function Newsletter({ variant, onSubscribe }) {
  const [email, setEmail] = React.useState('');
  const [agree, setAgree] = React.useState(false);
  const [err, setErr] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const card = variant === 'card';
  const submit = e => { e.preventDefault(); if (!agree) return setErr(true); onSubscribe && onSubscribe(email); setDone(true); };
  const legalA = { color: 'var(--footer-strong)' };
  const cols = 'repeat(auto-fit, minmax(min(100%, var(--newsletter-min-width)), 1fr))';
  return (
    <section aria-labelledby="igf-nl-h" style={card
      ? { margin: '0 0 var(--space-stack-3xl)', padding: 'var(--space-inset-2xl) clamp(var(--space-inset-lg), 3vw, var(--space-inset-3xl))', borderRadius: 'var(--radius-xl)', border: 'var(--border-width-default) solid var(--footer-card-border)', background: 'var(--footer-card-background)', display: 'grid', gridTemplateColumns: cols, gap: 'var(--space-gap-lg) var(--space-gap-4xl)', alignItems: 'center' }
      : { display: 'grid', gridTemplateColumns: cols, gap: 'var(--space-gap-lg) var(--space-gap-4xl)', alignItems: 'start', padding: 'var(--space-inset-2xl) 0 var(--space-inset-3xl)', borderTop: 'var(--border-width-default) solid var(--footer-rule)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: card ? 'var(--space-gap-xs)' : 'var(--space-gap-xs)', minWidth: 0 }}>
        <h2 id="igf-nl-h" className={card ? 'type-h4' : 'type-overline'} style={card ? { margin: 0, color: 'var(--color-text-inverse)' } : label}>Newsletter</h2>
        <p className="type-body-2" style={{ margin: 0, color: 'var(--footer-text)', textWrap: 'pretty' }}>Product releases, webinars and developer resources from Infragistics.</p>
      </div>
      {done ? <p role="status" className="type-body-2" style={{ margin: 0, color: 'var(--color-accent-teal)' }}>Thanks. You're subscribed.</p> : (
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-gap-sm)', minWidth: 0 }}>
          <div data-nl-field="" data-card={card || undefined}>
            <TextField tone="dark" size={card ? 'md' : 'lg'} bare={card} hideLabel label="Email address" type="email" required autoComplete="email" placeholder="Your email address" value={email} onChange={e => setEmail(e.target.value)} style={{ flex: '1 1 var(--field-min-width)', minWidth: 0 }} />
            <Button type="submit" size="md" arrow={card} style={{ flex: '0 0 auto' }}>Subscribe</Button>
          </div>
          <Checkbox tone="dark" checked={agree} onChange={e => { setAgree(e.target.checked); setErr(false); }} error={err ? 'Check the box to agree before subscribing.' : undefined}>
            I understand and agree to the terms of infragistics' <a href={IG + '/legal/terms-of-use'} style={legalA}>Terms of Use</a> and <a href={IG + '/legal/privacy'} style={legalA}>Privacy Policy</a>
          </Checkbox>
          <p className="type-detail-1" style={{ margin: 0, paddingLeft: 'var(--space-inset-xl)', fontSize: 'var(--type-overline-font-size)', color: 'var(--footer-heading)', textWrap: 'pretty' }}>This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank" rel="noopener">Terms of Use</a> apply</p>
        </form>
      )}
    </section>
  );
}

export function SiteFooter({
  columns = FOOTER_DEFAULT_COLUMNS, social = ['rss', 'x', 'facebook', 'linkedin', 'youtube', 'discord', 'github'],
  moreProducts = DEFAULT_MORE, newsletter = 'card', onSubscribe, legalLinks = DEFAULT_LEGAL, onCookieSettings,
  copyright = '© Copyright 2026 INFRAGISTICS. All Rights Reserved', seals = DEFAULT_SEALS, assetBase = '../assets/logos/',
  legal, style, ...rest
}) {
  const [open, setOpen] = React.useState({});
  const cols = columns.map(c => Array.isArray(c) ? c : [c]);
  const rule = 'var(--border-width-default) solid var(--footer-rule)';
  const sep = { borderLeft: 'var(--border-width-default) solid var(--footer-rule-strong)', lineHeight: 1, whiteSpace: 'nowrap' };
  return (
    <footer data-igf="" data-on-dark="" className="type-body-2" style={{ position: 'relative', overflow: 'hidden', background: 'var(--footer-background-gradient)', color: 'var(--footer-text)', fontFamily: 'var(--font-body)', ...style }} {...rest}>
      <span aria-hidden="true" style={{ position: 'absolute', top: 'calc(var(--glow-size-lg) * -0.5)', right: 'calc(var(--glow-size-lg) * -0.29)', width: 'var(--glow-size-lg)', height: 'var(--glow-size-lg)', background: 'var(--glow-violet-strong)', pointerEvents: 'none' }}></span>
      <span aria-hidden="true" style={{ position: 'absolute', bottom: 'calc(var(--glow-size-md) * -0.4)', left: 'calc(var(--glow-size-md) * -0.31)', width: 'var(--glow-size-md)', height: 'var(--glow-size-md)', background: 'var(--glow-teal)', pointerEvents: 'none' }}></span>
      <div style={{ position: 'relative', maxWidth: 'var(--container-max-width)', margin: '0 auto', padding: 'var(--space-inset-3xl) var(--container-gutter) 0' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-gap-lg) var(--space-gap-2xl)', paddingBottom: 'var(--space-inset-2xl)', marginBottom: 'var(--space-stack-4xl)', borderBottom: rule }}>
          <a href={IG + '/'} aria-label="Infragistics home" style={{ display: 'inline-flex' }}><img src={assetBase + 'ig-logo-dark.svg'} alt="Infragistics" style={{ height: 'var(--logo-height)', display: 'block' }} /></a>
          {social.length > 0 && (
            <ul aria-label="Follow Infragistics" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', gap: 'var(--space-gap-xs)' }}>
              {social.map(k => { const s = SOCIAL[k]; if (!s) return null; return (
                <li key={k} style={{ display: 'flex' }}><a data-soc="" href={s.href} target="_blank" rel="noopener" aria-label={s.label + ' (opens in new tab)'}>
                  <svg style={glyph('md')} viewBox="0 0 24 24" aria-hidden="true" {...(s.stroke ? { fill: 'none', stroke: 'currentColor', strokeWidth: 'var(--size-icon-stroke)', strokeLinecap: 'round', strokeLinejoin: 'round' } : { fill: 'currentColor' })}>
                    {s.d.map((d, i) => <path key={i} d={d}></path>)}{s.dot && <circle cx="5" cy="19" r="1"></circle>}
                  </svg></a></li>); })}
            </ul>
          )}
        </div>

        <nav aria-label="Footer" data-igf-nav="" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(var(--footer-column-min-width), 1fr))', gap: 'var(--space-gap-3xl) var(--space-gap-2xl)', alignItems: 'start', padding: '0 0 var(--space-inset-5xl)' }}>
          {cols.map((stack, ci) => (
            <div key={ci} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-gap-sm)', minWidth: 0 }}>
              {stack.map((g, gi) => { const k = ci + '-' + gi; const isOpen = !!open[k]; return (
                <div key={gi} data-group="" data-open={isOpen ? 'true' : 'false'} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-gap-sm)', marginTop: gi ? 'var(--space-stack-lg)' : 0 }}>
                  <h2 className="type-overline" style={{ ...label, margin: '0 0 var(--space-stack-xs)' }}>
                    <span data-htext="">{g.title}</span>
                    <button type="button" data-acc="" aria-expanded={isOpen} onClick={() => setOpen(s => ({ ...s, [k]: !s[k] }))} style={{ width: '100%', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-gap-sm)', minHeight: 'var(--size-control-xl)', padding: 0, background: 'none', border: 'none', color: 'inherit', font: 'inherit', letterSpacing: 'inherit', textTransform: 'inherit', cursor: 'pointer' }}>
                      {g.title}<Icon name="chevron-down" size="md" />
                    </button>
                  </h2>
                  <ul role="list" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: g.nested ? 'var(--space-gap-md)' : 'var(--space-gap-sm)' }}>
                    {(g.links || []).map((l, i) => <Item key={i} l={l} />)}
                  </ul>
                </div>); })}
            </div>
          ))}
        </nav>

        {moreProducts.length > 0 && (
          <div data-igf-more="" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-gap-xs) var(--space-gap-xl)', padding: 'var(--space-inset-md) 0', borderTop: rule, marginBottom: newsletter === 'card' ? 'var(--space-stack-xl)' : 0 }}>
            <h2 className="type-overline" style={label}>More Infragistics Products</h2>
            <ul role="list" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', gap: 'var(--space-gap-xs) var(--space-gap-2xl)' }}>
              {moreProducts.map((l, i) => <li key={i}><FLink l={l} /></li>)}
            </ul>
          </div>
        )}
        {newsletter && <Newsletter variant={newsletter} onSubscribe={onSubscribe} />}
      </div>

      <div style={{ position: 'relative', borderTop: rule }}>
        <div style={{ maxWidth: 'var(--container-max-width)', margin: '0 auto', padding: 'var(--space-inset-2xl) var(--container-gutter) var(--space-inset-2xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-gap-md)' }}>
          <nav aria-label="Legal">
            <ul role="list" className="type-caption" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', alignItems: 'center', rowGap: 'var(--space-gap-xs)' }}>
              {legalLinks.map((l, i) => <li key={i} style={{ padding: i ? '0 var(--space-inset-sm)' : '0 var(--space-inset-sm) 0 0', borderLeft: i ? sep.borderLeft : 'none', lineHeight: sep.lineHeight, whiteSpace: sep.whiteSpace }}><a href={l.href}>{l.label}</a></li>)}
              {onCookieSettings && <li style={{ padding: '0 var(--space-inset-sm)', ...sep }}><button type="button" className="type-caption" onClick={onCookieSettings} style={{ padding: 0, minHeight: 'var(--space-xl)', border: 'none', background: 'none', fontFamily: 'inherit', color: 'var(--footer-text)', cursor: 'pointer' }}>Cookie Settings</button></li>}
            </ul>
          </nav>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-gap-md) var(--space-gap-2xl)' }}>
            <div className="type-detail-1" style={{ color: 'var(--footer-heading)' }}>{legal ?? copyright}</div>
            {seals.length > 0 && <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-gap-sm)' }}>{seals.map((s, i) => <img key={i} src={s.src || assetBase + s.file} alt={s.alt} title={s.alt} style={{ height: 'var(--size-control-md)', display: 'block' }} />)}</div>}
          </div>
        </div>
      </div>
    </footer>
  );
}
