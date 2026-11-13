// Single spec for every non-engine decision: which engine step each semantic token aliases, and the
// scale of spacing / sizes / radii / type slots. Values only ever come from engine output or from this map.

// ---- semantic colour tokens: name -> engine token (alias) ---------------------------------------
// Each entry: [engineToken, usage]. Usage sentences are carried from the previous system, contrast numbers are recomputed by make.mjs.
export const ALIAS = {
  // brand + action
  'color-accent-blue':            ['ig-info-seed',       'Brand accent blue: gradient start, icon tile fill, glow source. Not a CTA fill and never text on white.'],
  'color-accent-blue-hover':      ['ig-info-400',       'Hover step of `color-accent-blue`.'],
  'color-accent-blue-active':      ['ig-info-500',       'Press state step of `color-accent-blue`.'],
  'color-accent-violet':          ['ig-secondary-seed', 'Gradient partner to `color-accent-blue` and the AI marker. Never a fill on its own.'],
  'color-accent-sky':             ['ig-sky-200',        'On-dark accent only: stat numbers on `color-surface-inverse`. Never on white.'],
  'color-accent-teal':            ['ig-teal-200',       'On-dark accent only: performance stat numbers on `color-surface-inverse`. Never on white.'],
  'color-action-default':             ['ig-primary-seed',    'The engine\u2019s primary seed itself (--ig-primary-seed), not a fitted shade. Every action: primary CTA fill (label `color-action-on`), in-page links and eyebrows on `color-surface-page` and `color-surface-tint`.'],
  'color-action-hover':       ['ig-info-500',       'Link hover on light surfaces (colour shift only, no underline).'],
  'color-action-fill-hover':  ['ig-primary-700',    'Filled-button hover: the primary fill darkens to this and nothing else changes.'],
  'color-action-active':       ['ig-primary-800',    'Inline link press state on light surfaces.'],
  'color-action-text':                ['ig-primary-seed',    'The action colour when it is text, an icon or a thin line on a light surface: links, eyebrows, outline and ghost button labels, focus outlines. Equal to `color-action-default` by default. A lighter seed is darkened until it reads on `color-surface-page` (AA).'],
  'color-action-on':          ['ig-surface-base',   'Label and icon colour on `color-action-default` fills. Live value: the engine contrast colour of `ig-primary-600`.'],
  'color-link-utility':       ['ig-info-500',       'Links in the utility row above the nav, on `color-surface-page`.'],
  'color-link-utility-hover': ['ig-primary-seed',    'Utility-row link hover.'],
  'color-link-inverse':       ['ig-sky-200',        'Inline links on dark surfaces (`color-surface-inverse`).'],
  'color-link-inverse-hover': ['ig-dark-gray-900',  'Hover of `color-link-inverse`: colour shift only.'],
  'footer-link':        ['ig-dark-gray-600',  'Footer column links on the footer gradient.'],
  'footer-link-hover':  ['ig-dark-gray-900',  'Footer link hover.'],
  'color-focus-default':         ['ig-primary-seed',    'Keyboard focus outline on light surfaces, `focus-ring-width` at `focus-ring-offset`, `:focus-visible` only.'],
  'color-focus-inverse':    ['ig-sky-100',        'Keyboard focus outline inside a `data-on-dark` section.'],
  // text
  'color-text-heading':                ['ig-gray-900',       'Headlines h1–h6 on `color-surface-page` and the catalog band.'],
  'color-text-primary':        ['ig-gray-800',       'Strong text and secondary-button labels on `color-surface-page`; the body default in base styles.'],
  'color-text-secondary':          ['ig-gray-600',       'Body and lead copy, utility-bar text and nav triggers at rest, on `color-surface-page` and `color-surface-subtle`.'],
  'color-text-ui':      ['ig-gray-700',       'UI text — nav, buttons, list rows, chips — on `color-surface-page`.'],
  'color-text-muted':         ['ig-gray-500',       'Muted copy, nano labels, card descriptions and catalog counts; body copy never goes lighter.'],
  'color-text-inverse':       ['ig-dark-gray-900',  'Text on `color-surface-inverse`.'],
  'color-text-inverse-muted': ['ig-dark-gray-400',  'Stat-badge labels and muted copy on `color-surface-inverse`.'],
  'color-icon-subtle':       ['ig-gray-400',       'The caret in the nav row (decorative, below the 3:1 icon floor, kept as in the source).'],
  'color-feedback-error-default': ['ig-error-600',     'Validation text and border on light surfaces.'],
  'color-feedback-error-inverse': ['ig-error-300',      'Validation text and border on the dark footer.'],
  // surfaces
  'color-surface-page':       ['ig-surface-base',   'Page background; flat.'],
  'color-surface-hero':   ['ig-surface-sunken', 'Top of the hero wash (`gradient-hero`).'],
  'color-surface-subtle':       ['ig-gray-50',        'Alternating section bands, BrowserFrame title bar, callout strips and chips at rest.'],
  'color-surface-card':       ['ig-surface-raised', 'Marketing card fill.'],
  'color-surface-tint':       ['ig-primary-50',     'Soft blue fill: tinted chips, callouts, the catalog band, release strip at rest and monogram badges.'],
  'color-surface-inverse':       ['ig-dark-surface-500','The one dark treatment: stat badges, table header and dark stat panels (the engine dark-variant surface).'],
  'color-surface-tint-strong': ['ig-primary-100', 'Release strip on hover; also the open nav trigger.'],
  'color-surface-muted':       ['ig-gray-100',       '"Coming soon" pill fill.'],
  // footer
  'footer-background':          ['ig-dark-surface-900','Footer gradient end; flat fallback for `footer-background-gradient`.'],
  'footer-text':        ['ig-dark-gray-500',  'Footer body copy, legal links and social glyphs.'],
  'footer-strong':      ['ig-dark-gray-800',  'Footer sub-group labels (Web, Desktop, Bundles) and legal-link emphasis.'],
  'footer-heading':     ['ig-dark-gray-400',  'Footer 12px uppercase group labels, placeholder and copyright.'],
  'footer-icon':        ['ig-dark-gray-500',  'Footer social icons.'],
  'footer-focus':       ['ig-sky-100',        'Keyboard focus ring inside the footer.'],
  // borders
  'color-border-default':             ['ig-gray-200',       'Hairline border on cards, chips and tinted chips; secondary-button border.'],
  'color-border-subtle':      ['ig-gray-100',       'Hairline under the nav; default catalog-card border.'],
  'color-border-control':       ['ig-gray-500',       'Border of a form control (input, checkbox) on light surfaces. 3:1 against the page, the WCAG 1.4.11 minimum.'],
  'color-border-accent':        ['ig-primary-200',    'Blue-tinted borders: soft blue fills, outline buttons and the release label.'],
  // badges, tables
  'badge-bundle-background':    ['ig-secondary-50',   'Bundle badge fill (top-right of a ProductCard).'],
  'badge-bundle-color':    ['ig-secondary-700',  'Bundle badge label on `badge-bundle-background`.'],
  'badge-oss-color':       ['ig-success-600',    'OSS tag label on `badge-oss-background`.'],
  'table-mark-yes-background':       ['ig-gray-200',       'Comparison table "Yes" mark fill.'],
  'table-mark-yes-color':       ['ig-gray-700',       'Comparison table "Yes" mark glyph.'],
  'table-mark-partial-background':      ['ig-warn-100',       'Comparison table "Partial" and "Gated" mark fill.'],
  'table-mark-partial-color':      ['ig-warn-800',       'Comparison table "Partial" and "Gated" mark glyph.'],
  'table-mark-no-background':        ['ig-gray-100',       'Comparison table "No" mark fill.'],
  'table-mark-no-color':        ['ig-gray-600',       'Comparison table "No" mark glyph.'],
  'table-header-sub-color':     ['ig-dark-gray-400',  'Sub-label under a comparison column name, on `color-surface-inverse`.'],
  'table-header-sub-highlight-color':['ig-primary-50',    'Sub-label on the highlighted column header (`color-action-default` fill).'],
  'table-header-detail-color':  ['ig-dark-gray-600',  'The "Detail" column header on `color-surface-inverse`.'],
  'window-dot-red':     ['ig-error-300',      'BrowserFrame window dot.'],
  'window-dot-amber':   ['ig-warn-200',       'BrowserFrame window dot.'],
  'window-dot-green':   ['ig-success-300',    'BrowserFrame window dot.'],
  // framework pills
  'fw-angular-color':   ['ig-pink-500',       'Angular framework base colour. The pill fill and border derive from it.'],
  'fw-react-color':     ['ig-cyan-500',       'React framework base colour. The pill fill and border derive from it.'],
  'fw-angular-background':      ['ig-pink-50',        'Angular framework pill fill; holds on hover.'],
  'fw-angular-border':  ['ig-pink-100',       'Angular framework pill border.'],
  'fw-react-background':        ['ig-cyan-50',        'React framework pill fill.'],
  'fw-react-border':    ['ig-cyan-100',       'React framework pill border.'],
  'fw-webcomponents-background':           ['ig-primary-50',     'Web Components framework pill fill.'],
  'fw-webcomponents-border':       ['ig-primary-200',    'Web Components framework pill border.'],
  'fw-winforms-background':     ['ig-primary-50',     'Windows Forms framework pill fill (shares the Web Components tint).'],
  'fw-winforms-border': ['ig-primary-200',    'Windows Forms framework pill border.'],
  'fw-blazor-background':       ['ig-secondary-50',   'Blazor framework pill fill.'],
  'fw-blazor-border':   ['ig-secondary-200',  'Blazor framework pill border.'],
  'fw-wpf-background':          ['ig-primary-100',    'WPF framework pill fill.'],
  'fw-wpf-border':      ['ig-primary-200',    'WPF framework pill border.'],
  // icon tiles
  'tile-blue':          ['ig-info-seed',       'Icon tile fill — CLI MCP on the AI toolchain row. Flat, never a gradient; white glyph.'],
  'tile-violet':        ['ig-secondary-seed', 'Icon tile fill — Agent Skills on the AI toolchain row.'],
  'tile-pink':          ['ig-pink-400',       'Icon tile fill — Theming MCP on the AI toolchain row.'],
  'tile-teal':          ['ig-success-400',    'Icon tile fill — AI Scaffolding on the AI toolchain row.'],
  'tile-cyan':          ['ig-cyan-200',       'Extended icon tile fill for grids longer than four tiles.'],
  'tile-amber':         ['ig-warn-200',       'Extended icon tile fill for grids longer than four tiles.'],
  'tile-royal':         ['ig-primary-seed',    'Extended icon tile fill for grids longer than four tiles.'],
  'tile-ink':           ['ig-dark-surface-500','Extended icon tile fill for grids longer than four tiles.'],
};

// ---- translucent colours: live = hsl(from <base> h s l / <opacity token>) ----------------------
export const ALPHA = {
  'color-action-subtle':          ['color-action-default',            'opacity-subtle', 'Tinted capsule fill behind `color-action-default` text.'],
  'color-action-subtle-border':   ['color-action-default',            'opacity-strong', 'Border of the `color-action-subtle` capsule.'],
  'color-emphasis-border':      ['color-accent-blue',           'opacity-heavy',  'Border of emphasised cards and the release strip at rest.'],
  'color-emphasis-ring':        ['color-accent-blue',           'opacity-soft',   'Inner ring of the release strip at rest.'],
  'color-emphasis-ring-hover':  ['color-accent-blue',           'opacity-strong', 'Inner ring of the release strip on hover.'],
  'badge-oss-background':         ['badge-oss-color',      'opacity-soft',   'OSS tag fill.'],
  'nav-background':          ['color-surface-page',      'opacity-nav',    'Sticky nav background, under `nav-backdrop-blur`.'],
  'color-overlay-scrim':                ['color-surface-inverse',      'opacity-strong', 'Page dimmer behind an open nav panel.'],
  'footer-rule':          ['color-text-inverse',      'opacity-subtle', 'Footer hairline rules.'],
  'footer-rule-strong':   ['color-text-inverse',      'opacity-muted',  'Footer legal-link dividers and form control borders.'],
  'footer-card-border':   ['color-text-inverse',      'opacity-subtle', 'Border of the footer newsletter card.'],
  'footer-field-background':         ['color-text-inverse',      'opacity-subtle', 'Footer input fill (stacked newsletter).'],
  'footer-field-pill-background':    ['footer-background',         'opacity-field',  'Footer input fill inside the pill field.'],
  'footer-check-background':      ['color-text-inverse',      'opacity-faint',  'Footer checkbox fill, unchecked.'],
  'footer-check-border':  ['color-text-inverse',      'opacity-heavy',  'Footer checkbox border, unchecked.'],
  'footer-social-hover-background':  ['color-link-inverse',      'opacity-muted',  'Social button fill on hover.'],
  'footer-social-hover-border': ['color-focus-inverse','opacity-heavy',  'Social button border on hover.'],
};

// ---- px scales (nominal px at default density: size=large, spacing=1) --------------------------
// Raw spacing steps. The name is a size, not a pixel claim: the live value follows --ig-spacing and --ig-size.
export const SPACE = { '3xs': 2, '2xs': 4, 'xs': 8, 'sm': 12, 'md': 16, 'lg': 20, 'xl': 24, '2xl': 32, '3xl': 40, '4xl': 48, '5xl': 64, '6xl': 104 };
// Semantic spacing: what the space is for. Components use these for padding, margins and gaps; each role can be retuned on its own.
export const SPACE_ROLES = {
  inset: ['Padding inside a container: the space between an edge and its content.', ['3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl']],
  stack: ['Vertical distance between elements stacked on top of each other (margins).', ['3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl']],
  gap:   ['Distance between items that sit side by side or in a grid (gap, inline margins).', ['3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl']],
};
export const SIZE = { // name: [px, usage]
  'border-width-default': [1, 'Hairline borders and dividers.'],
  'border-width-strong': [1.5, 'Checkbox and gradient-border strokes.'],
  'focus-ring-width': [3, 'Width of the `color-focus-default` outline on `:focus-visible`.'],
  'focus-ring-offset': [2, 'Offset of the focus outline; the element itself never moves or changes fill on focus.'],
  'window-dot-size': [11, 'BrowserFrame window dot.'],
  'size-icon-stroke': [2.2, 'Stroke width of every `Icon` (viewBox units).'],
  'size-icon-stroke-strong': [3, '`Icon` weight="strong": check marks and close marks on a filled disc.'],
  'size-icon-xs': [12, 'Glyph in a comparison mark; caret in a trigger.'],
  'size-icon-sm': [14, 'Inline arrow in a link or a small control.'],
  'size-icon-md': [16, 'Default icon and checkbox box.'],
  'size-icon-lg': [20, 'Nav icon button glyph; comparison mark circle.'],
  'size-control-sm': [36, 'Icon button and social button.'],
  'size-control-md': [40, 'Navigation CTA, pill field and its button, compliance seals.'],
  'size-control-lg': [44, 'Stacked field and its button.'],
  'size-control-xl': [48, 'Minimum accordion row height on mobile.'],
  'nav-height': [70, 'Navigation bar minimum height.'],
  'badge-mono-size': [32, 'Monogram badge box.'],
  'size-tile': [44, 'Icon tile box.'],
  'fw-logo-height': [16, 'Framework logo inside a pill.'],
  'logo-height': [24, 'Header and footer wordmark.'],
  'product-logo-height': [26, 'Product logo in a catalog card.'],
  'product-logo-max-width': [160, 'Product logo maximum width.'],
  'stat-badge-offset': [18, 'How far a floating stat badge overhangs its frame.'],
  'stat-badge-inset': [24, 'Inset of a bottom-anchored stat badge.'],
  'glow-size-lg': [760, 'Footer glow, large.'],
  'glow-size-md': [640, 'Footer glow, medium.'],
  'field-min-width': [220, 'Minimum width of a flexible field.'],
  'callout-min-width': [220, 'Minimum width of the copy block in a callout.'],
  'callout-max-width': [1080, 'Maximum width of the release strip.'],
  'newsletter-min-width': [320, 'Minimum column width in the newsletter block.'],
  'footer-column-min-width': [180, 'Minimum footer column width.'],
  'nav-panel-max-width': [1280, 'Default nav panel maximum width.'],
  'bleed-width': [1180, 'Content width a bleeding frame measures against.'],
  'container-max-width': [1280, 'Max content width.'],
  'container-hero-max-width': [1120, 'Max width of hero text.'],
  'container-prose-max-width': [880, 'Max width of prose.'],
  'catalog-card-min-width': [340, 'Min card width in the catalog grid: repeat(auto-fill, minmax(var(--catalog-card-min-width), 1fr)).'],
};
export const TRACKING = { // em, from the type slots
  'letter-spacing-label': ['0.12em', 'Uppercase table and column headers.'],
  'letter-spacing-badge': ['0.04em', 'Uppercase badges.'],
  'letter-spacing-mono':  ['0.02em', 'Monogram badge.'],
};
export const RADIUS = { // name: [design px, usage, min px, max px]. The engine's border-radius() clamps between min and max.
  'radius-full': [32, 'Pills: every action, chip and framework selector. Fully round on controls up to 64px tall; never sharper than 4px.', 4, 32],
  'nav-panel-radius': [30, 'Flared top corners of an open nav panel.', 0, 30],
  'radius-xl': [18, 'Emphasis and catalog cards. Never a circle: capped at 28px.', 4, 28],
  'radius-lg': [16, 'Marketing cards and media frames. Capped at 24px.', 0, 24],
  'radius-md': [12, 'Icon tiles, stat badges and nav link rows. Capped at 16px so a tile never becomes a circle.', 4, 16],
  'radius-sm': [8, 'Small elements and the monogram badge.', 2, 12],
  'radius-xs': [6, 'OSS tag and checkbox.', 2, 8],
};
export const OPACITY = {
  'opacity-faint': [0.04, 'Barely-there tint.'],
  'opacity-subtle': [0.08, 'Soft fills and hairlines.'],
  'opacity-soft': [0.12, 'Tag fills and inner rings.'],
  'opacity-muted': [0.16, 'Glows and control borders.'],
  'opacity-strong': [0.25, 'Capsule borders and scrims.'],
  'opacity-heavy': [0.4, 'Emphasis borders and strong glows.'],
  'opacity-field': [0.6, 'Input fill on the dark footer.'],
  'opacity-nav': [0.96, 'Sticky nav background.'],
  'opacity-disabled': [0.45, 'Disabled controls.'],
};
export const WEIGHT = { 'font-weight-regular': 400, 'font-weight-medium': 500, 'font-weight-semibold': 600, 'font-weight-bold': 700, 'font-weight-extrabold': 800, 'font-weight-black': 900 };
export const BREAKPOINT = { 'breakpoint-sm': [640, 'Two-up copy/media splits stack; footer collapses to accordions; catalog drops to one column.'], 'breakpoint-md': [768, 'Nav collapses to a menu button; the utility bar hides.'], 'breakpoint-lg': [1024, 'Feature grid goes 3-up → 2-up; the nav items collapse to a menu.'], 'breakpoint-xl': [1280, 'Container reaches full width; the gutter stops growing; secondary nav links hide below it.'] };
export const ZINDEX = { 'z-index-base': [1, 'Section content sitting above an ambient glow.'], 'z-index-raised': [2, 'Full-card link overlays; the footer above a card body.'], 'z-index-media': [3, 'Floating stat badges over a browser frame.'], 'z-index-lift': [5, 'The G2 card that straddles two bands.'], 'z-index-sticky': [40, 'Sticky filter bar on the catalog and the nav scrim.'], 'z-index-nav': [50, 'The site header. Nothing in page content may exceed this.'], 'z-index-panel': [60, 'Nav dropdown panels.'], 'z-index-overlay': [100, 'Anything modal.'] };

// ---- type: old role -> engine slot, with the values handed to the engine as customScale -------
// px values are the current system's; the engine returns them as rem. family: which face the slot uses.
export const TYPE = [
  // slot, role (old style name), family, size px, line (unitless x size), weight, tracking, transform, usage, sample
  ['h1',         'display-h1',   'display', 70,  1.12, 900, '-0.0257em', 'none',      'Homepage hero only, in `color-text-heading`.', 'Enterprise UI Components, Accelerated by AI'],
  ['h2',         'display-h2',   'display', 43,  1.06, 800, '-0.0256em', 'none',      'Section heads, in `color-text-heading`.', 'Meet the Industry’s Fastest Data Grid'],
  ['h3',         'display-h3',   'display', 27,  1.2,  800, '-0.0222em', 'none',      'Sub-section and panel heads; `color-text-inverse` on dark. There is no h7.', 'Sales Dashboard'],
  ['h4',         'display-stat', 'display', 21,  1.1,  800, '0',         'none',      'Stat badge values: `color-accent-sky` or `color-accent-teal` on `color-surface-inverse`, `color-text-muted` on light; newsletter title.', '100K+ Rows'],
  ['h5',         'card-title',   'body',    16,  1.4,  600, '0',         'none',      'Card titles, sentence case, in `color-text-heading` — body face, not the display face.', 'Query Builder'],
  ['h6',         'product-name', 'display', 18,  1.3,  800, '-0.0167em', 'none',      'Product names in a catalog card, in `color-text-heading`.', 'Ignite UI'],
  ['subtitle-1', 'body-lead',    'body',    20,  1.6,  400, '0',         'none',      'Lead under an h1 or h2, in `color-text-secondary`.', 'Build enterprise applications with 300+ framework agnostic UI components.'],
  ['subtitle-2', 'callout-title','body',    17,  1.5,  700, '0',         'none',      'Hero button label and callout titles.', 'Introducing Ignite UI 2026'],
  ['body-1',     'body-text',    'body',    19,  1.62, 400, '0',         'none',      'Running prose, in `color-text-secondary`.', 'Enterprise-grade virtualization renders 100,000 rows without lag.'],
  ['body-2',     'body-ui',      'body',    15,  1.5,  400, '0',         'none',      'Nav, buttons and list rows, in `color-text-ui`.', 'Advanced virtualization and hundreds of built-in features.'],
  ['button',     'button',       'body',    15,  1.5,  600, '0',         'none',      'Button and CTA labels.', 'Start Free Trial'],
  ['caption',    'body-caption', 'body',    14,  1.55, 400, '0',         'none',      'Captions, card descriptions and table detail copy.', 'Visual query composition with nested groups.'],
  ['overline',   'eyebrow',      'body',    12,  1.5,  600, '0.16em',    'uppercase', 'Eyebrows: ALL CAPS, in `color-action-default`.', 'DEVELOPER TOOLS'],
  ['detail-1',   'body-micro',   'body',    13,  1.5,  400, '0',         'none',      'Micro text: utility bar, legal copy, chips.', 'North American Sales: 1-800-231-8588'],
  ['detail-2',   'body-nano',    'body',    11,  1.4,  400, '0',         'none',      'Badge sublabels and nano meta labels (`color-text-muted`).', 'Fastest grid'],
];
export const FAMILIES = {
  display: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  body: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
};
export const SIZE_RATIO = { small: 0.75, medium: 0.875, large: 1 }; // density steps applied by sizable()/pad()
