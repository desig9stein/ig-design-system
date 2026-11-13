# Migration guide

This release is a clean break. The system now sits on the **igniteui-theming** engine, token names follow a three-tier convention, and nothing from the previous names is kept: no aliases, no deprecated files. This page lists every rename so a consumer can migrate with search-and-replace.

## 1. What changed

| Area | Before | Now |
|---|---|---|
| Palette, type, spacing, size, radius, elevation | Hand-picked literals | Engine output (`palette()`, `typography()`, `pad()`, `sizable()`, `border-radius()`, indigo elevations) |
| Token names | `--ig-blue`, `--text-muted`, `--space-6`, `--ig-t-…` | `--color-{role}-{variant}-{state}`, `--space-{n}`, `--radius-{step}`, `--shadow-{role}`, `--type-{slot}-…` |
| Component styling | Inline literals and JS hover state | Tokens only; hover, focus, disabled, invalid and loading are CSS |
| Icons | An inline `<svg>` per component | One `Icon` component with stroke and size tokens |
| Forms | A bespoke input and checkbox inside the footer | `TextField` and `Checkbox` components |
| Entry points | `styles.css` importing `tokens/*.css` | `tokens.css` + `theme.css` |

Re-theming: set `--ig-size` (1 small, 2 medium, 3 large), `--ig-spacing`, `--ig-radius-factor` or `--ig-elevation-factor` on the root and every token follows.

## 2. Naming convention

Three tiers, role-based names, no colour words in semantic names.

1. **Raw** (`--ig-*`): engine steps, for example `--ig-primary-600`, `--ig-gray-200`. Only the semantic tier points at them.
2. **Semantic** (`--color-*`, `--space-*`, `--radius-*`, `--size-*`, `--shadow-*`, `--font-weight-*`, `--opacity-*`, `--z-index-*`, `--breakpoint-*`): what a value is for. Use these in product code.
3. **Component** (`--footer-*`, `--table-*`, `--fw-*`, `--badge-*`, `--tile-*`, `--callout-*`): a decision made for one component, defined from the semantic tier.

Colour roles read `color-{role}-{variant}-{state}`: `color-action-default`, `color-action-hover`, `color-text-muted`, `color-surface-tint`, `color-border-control`, `color-feedback-error-default`.

## 3. Spacing scale

The 25-step scale collapsed to 12 engine steps, and the steps are now named by size (`3xs` to `6xl`), not by pixel value, because the live value follows `--ig-spacing` and `--ig-size`. Steps that sat one or two pixels apart merged into their nearest neighbour. Components do not use the steps directly for padding, margins and gaps: they use the roles `--space-inset-*`, `--space-stack-*` and `--space-gap-*`.

| Before | Now |
|---|---|
| `--space-2` | `--space-3xs` |
| `--space-4` | `--space-2xs` |
| `--space-6` | `--space-xs` |
| `--space-8` | `--space-xs` |
| `--space-10` | `--space-xs` |
| `--space-12` | `--space-sm` |
| `--space-14` | `--space-sm` |
| `--space-16` | `--space-md` |
| `--space-18` | `--space-md` |
| `--space-20` | `--space-lg` |
| `--space-22` | `--space-xl` |
| `--space-24` | `--space-xl` |
| `--space-26` | `--space-xl` |
| `--space-28` | `--space-2xl` |
| `--space-30` | `--space-2xl` |
| `--space-32` | `--space-2xl` |
| `--space-34` | `--space-2xl` |
| `--space-36` | `--space-3xl` |
| `--space-40` | `--space-3xl` |
| `--space-44` | `--space-4xl` |
| `--space-48` | `--space-4xl` |
| `--space-52` | `--space-4xl` |
| `--space-56` | `--space-5xl` |
| `--space-64` | `--space-5xl` |
| `--space-104` | `--space-6xl` |

In a component, pick the role for the property: padding → `--space-inset-{size}`, vertical margins → `--space-stack-{size}`, gap and inline margins → `--space-gap-{size}`.

## 4. Token renames

### Colour

| Before | Now |
|---|---|
| `--ig-blue` | `--color-accent-blue` |
| `--ig-blue-hover` | `--color-accent-blue-hover` |
| `--ig-blue-press` | `--color-accent-blue-active` |
| `--ig-violet` | `--color-accent-violet` |
| `--ig-sky` | `--color-accent-sky` |
| `--ig-teal` | `--color-accent-teal` |
| `--action` | `--color-action-default` |
| `--action-hover` | `--color-action-hover` |
| `--action-hover-fill` | `--color-action-fill-hover` |
| `--action-press` | `--color-action-active` |
| `--on-action` | `--color-action-on` |
| `--action-soft` | `--color-action-subtle` |
| `--action-soft-border` | `--color-action-subtle-border` |
| `--utility-link` | `--color-link-utility` |
| `--utility-link-hover` | `--color-link-utility-hover` |
| `--link-on-dark` | `--color-link-inverse` |
| `--link-on-dark-hover` | `--color-link-inverse-hover` |
| `--link-footer` | `--footer-link` |
| `--link-footer-hover` | `--footer-link-hover` |
| `--focus-ring` | `--color-focus-default` |
| `--focus-ring-dark` | `--color-focus-inverse` |
| `--ink` | `--color-text-heading` |
| `--text-strong` | `--color-text-primary` |
| `--text-body` | `--color-text-secondary` |
| `--text-body-alt` | `--color-text-ui` |
| `--text-muted` | `--color-text-muted` |
| `--text-utility` | `--color-text-secondary` |
| `--text-eyebrow` | `--color-action-default` |
| `--text-on-dark` | `--color-text-inverse` |
| `--text-on-dark-muted` | `--color-text-inverse-muted` |
| `--text-label` | `--color-text-muted` |
| `--text-card-body` | `--color-text-muted` |
| `--text-count` | `--color-text-muted` |
| `--text-chevron` | `--color-icon-subtle` |
| `--text-error-on-dark` | `--color-feedback-error-inverse` |
| `--surface-page` | `--color-surface-page` |
| `--surface-hero-top` | `--color-surface-hero` |
| `--surface-band` | `--color-surface-subtle` |
| `--surface-chrome` | `--color-surface-subtle` |
| `--surface-callout` | `--color-surface-subtle` |
| `--surface-chip` | `--color-surface-subtle` |
| `--surface-card` | `--color-surface-card` |
| `--surface-tint` | `--color-surface-tint` |
| `--surface-catalog` | `--color-surface-tint` |
| `--surface-release` | `--color-surface-tint` |
| `--surface-mono` | `--color-surface-tint` |
| `--surface-release-hover` | `--color-surface-tint-strong` |
| `--surface-soon` | `--color-surface-muted` |
| `--surface-dark` | `--color-surface-inverse` |
| `--border` | `--color-border-default` |
| `--border-subtle` | `--color-border-subtle` |
| `--border-tint` | `--color-border-default` |
| `--border-chip` | `--color-border-default` |
| `--border-blue` | `--color-border-accent` |
| `--border-outline` | `--color-border-accent` |
| `--emphasis-border` | `--color-emphasis-border` |
| `--emphasis-ring` | `--color-emphasis-ring` |
| `--emphasis-ring-hover` | `--color-emphasis-ring-hover` |
| `--scrim` | `--color-overlay-scrim` |
| `--surface-nav` | `--nav-background` |
| `--footer-bg` | `--footer-background` |
| `--footer-field` | `--footer-field-background` |
| `--footer-field-pill` | `--footer-field-pill-background` |
| `--footer-check-bg` | `--footer-check-background` |
| `--footer-soc-hover-bg` | `--footer-social-hover-background` |
| `--footer-soc-hover-border` | `--footer-social-hover-border` |
| `--footer-card-fill` | `--footer-card-background` |
| `--footer-bg-gradient` | `--footer-background-gradient` |
| `--badge-bundle-bg` | `--badge-bundle-background` |
| `--badge-bundle-fg` | `--badge-bundle-color` |
| `--badge-oss-bg` | `--badge-oss-background` |
| `--badge-oss-fg` | `--badge-oss-color` |
| `--badge-yes-bg` | `--table-mark-yes-background` |
| `--badge-yes-fg` | `--table-mark-yes-color` |
| `--badge-warn-bg` | `--table-mark-partial-background` |
| `--badge-warn-fg` | `--table-mark-partial-color` |
| `--badge-no-bg` | `--table-mark-no-background` |
| `--badge-no-fg` | `--table-mark-no-color` |
| `--table-head-sub` | `--table-header-sub-color` |
| `--table-head-sub-ours` | `--table-header-sub-highlight-color` |
| `--table-head-detail` | `--table-header-detail-color` |
| `--fw-angular-bg` | `--fw-angular-background` |
| `--fw-react-bg` | `--fw-react-background` |
| `--fw-wc-bg` | `--fw-webcomponents-background` |
| `--fw-wc-border` | `--fw-webcomponents-border` |
| `--fw-winforms-bg` | `--fw-winforms-background` |
| `--fw-blazor-bg` | `--fw-blazor-background` |
| `--fw-wpf-bg` | `--fw-wpf-background` |

### Size, radius, border, typography, motion and everything else

| Before | Now |
|---|---|
| `--size-border` | `--border-width-default` |
| `--size-border-strong` | `--border-width-strong` |
| `--size-focus-ring` | `--focus-ring-width` |
| `--size-focus-offset` | `--focus-ring-offset` |
| `--size-dot` | `--window-dot-size` |
| `--size-control-cta` | `--size-control-md` |
| `--size-touch` | `--size-control-xl` |
| `--size-nav` | `--nav-height` |
| `--size-mono` | `--badge-mono-size` |
| `--size-logo-fw` | `--fw-logo-height` |
| `--size-logo-nav` | `--logo-height` |
| `--size-logo-product` | `--product-logo-height` |
| `--size-logo-max` | `--product-logo-max-width` |
| `--size-badge-offset` | `--stat-badge-offset` |
| `--size-badge-inset` | `--stat-badge-inset` |
| `--size-glow-lg` | `--glow-size-lg` |
| `--size-glow-md` | `--glow-size-md` |
| `--size-field-min` | `--field-min-width` |
| `--size-callout-min` | `--callout-min-width` |
| `--size-callout-max` | `--callout-max-width` |
| `--size-newsletter-min` | `--newsletter-min-width` |
| `--size-footer-col-min` | `--footer-column-min-width` |
| `--size-panel` | `--nav-panel-max-width` |
| `--size-bleed` | `--bleed-width` |
| `--container` | `--container-max-width` |
| `--container-hero` | `--container-hero-max-width` |
| `--container-prose` | `--container-prose-max-width` |
| `--catalog-min` | `--catalog-card-min-width` |
| `--radius-pill` | `--radius-full` |
| `--radius-flare` | `--nav-panel-radius` |
| `--radius-lg` | `--radius-xl` |
| `--radius-card` | `--radius-lg` |
| `--radius-media` | `--radius-lg` |
| `--radius-tile` | `--radius-md` |
| `--radius-link` | `--radius-md` |
| `--radius-mono` | `--radius-sm` |
| `--radius-badge` | `--radius-xs` |
| `--radius-check` | `--radius-xs` |
| `--weight-regular` | `--font-weight-regular` |
| `--weight-medium` | `--font-weight-medium` |
| `--weight-semibold` | `--font-weight-semibold` |
| `--weight-bold` | `--font-weight-bold` |
| `--weight-extrabold` | `--font-weight-extrabold` |
| `--weight-black` | `--font-weight-black` |
| `--tracking-label` | `--letter-spacing-label` |
| `--tracking-badge` | `--letter-spacing-badge` |
| `--tracking-mono` | `--letter-spacing-mono` |
| `--dur-chip` | `--duration-chip` |
| `--dur-fast` | `--duration-fast` |
| `--dur-button` | `--duration-button` |
| `--dur-slow` | `--duration-slow` |
| `--dur-float` | `--duration-float` |
| `--ease` | `--easing-default` |
| `--transition` | `--transition-default` |
| `--z-base` | `--z-index-base` |
| `--z-raised` | `--z-index-raised` |
| `--z-media` | `--z-index-media` |
| `--z-lift` | `--z-index-lift` |
| `--z-sticky` | `--z-index-sticky` |
| `--z-nav` | `--z-index-nav` |
| `--z-panel` | `--z-index-panel` |
| `--z-overlay` | `--z-index-overlay` |
| `--bp-sm` | `--breakpoint-sm` |
| `--bp-md` | `--breakpoint-md` |
| `--bp-lg` | `--breakpoint-lg` |
| `--bp-xl` | `--breakpoint-xl` |
| `--blur-nav` | `--nav-backdrop-blur` |
| `--gutter` | `--container-gutter` |
| `--grid-split` | `--layout-split` |
| `--emphasis-fill` | `--gradient-emphasis` |
| `--border-gradient-bundle` | `--gradient-border-bundle` |
| `--shadow-card` | `--shadow-none` |
| `--shadow-catalog-card` | `--shadow-none` |
| `--shadow-card-hover` | `--shadow-raised` |
| `--shadow-cta` | `--shadow-accent-lg` |
| `--shadow-cta-hover` | `--shadow-accent-lg` |
| `--shadow-pill-hover` | `--shadow-accent-sm` |
| `--shadow-media` | `--shadow-overlay` |
| `--shadow-badge` | `--shadow-floating` |
| `--shadow-bundle` | `--shadow-accent-md` |
| `--shadow-release` | `--callout-release-shadow` |
| `--shadow-release-hover` | `--callout-release-shadow-hover` |
| `--shadow-panel-filter` | `--shadow-popover-filter` |

Type classes: `.ig-t-{slot}` → `.type-{slot}`. Type variables: `--type-{slot}-{font-size|font-weight|line-height|font-family}` follow the engine slot names (`h1`–`h6`, `subtitle-1`, `subtitle-2`, `body-1`, `body-2`, `button`, `caption`, `overline`, `detail-1`, `detail-2`).

## 5. Component API changes

| Component | Change |
|---|---|
| `Button` | New `loading` prop. `disabled` is now a documented state (`aria-disabled`, no hover response). Hover and focus are CSS. |
| `ArrowLink` | `color` (a CSS string) became `tone`: `action` \| `heading` \| `inverse`. `size` is `sm` \| `md` \| `lg` (engine type slots), not a number. |
| `IconTile` | `size` is a name (`tile`, `sm`, `md`, `lg`, `xl`), not a number. Numeric sizes were removed. |
| `FeatureCard` | `iconFill` was removed (it did nothing). Hover lift is CSS and also fires on keyboard focus. |
| `StatBadge` | `duration` still sets seconds and now overrides `--duration-float`. |
| `NavBar` | `panelWidth` is a CSS length (default `var(--nav-panel-max-width)`), not a number. |
| `CalloutStrip`, `PlatformChip`, `FrameworkPill`, `NavLink` | Hover and focus moved to CSS; no prop changes. |
| `SiteFooter` | The newsletter block is built from `TextField`, `Button` and `Checkbox`. Props unchanged. |
| New | `Icon`, `TextField`, `Checkbox` |

## 6. Removed

These no longer exist and have no replacement file:

- `styles.css` and `tokens/{base,colors,effects,fonts,spacing,typography}.css` (use `tokens.css` and `theme.css`)
- `ui_kits/`, `templates/` (site navigation, marketing page, blog header), `guidelines/`, `*.card.html`
- The standalone and single-file HTML exports, `archived/`, `migration-map.json`, `_ds_manifest.json`, `_ds_bundle.js`
- `assets/asset-remap.js` and `assets/notes/`
- Per-group prompt files and per-component `.d.ts`: props live in `components/index.d.ts`, guidance in `components/<Name>/README.md`
- The old W3C-format token export: `tokens.json` is the single token source

## 7. Checklist

1. Replace names using the tables above (longest names first).
2. Replace `styles.css` with `tokens.css` then `theme.css`.
3. Replace numeric `IconTile` and `ArrowLink` sizes; drop `iconFill`.
4. Drop any local hover state you layered on a component: the CSS covers it.
5. Search for hard-coded hex, px and ms in your own code; map each to a token or ask for one.
