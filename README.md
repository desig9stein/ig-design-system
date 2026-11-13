# Infragistics design system

One source for the look of infragistics.com: colours, type, spacing, roundness and elevation as design tokens, plus the automatic checks that keep every site consistent. The tokens are generated with [igniteui-theming](https://github.com/IgniteUI/igniteui-theming), the same engine Ignite UI customers use.

> **Status: proof of concept.** This repository is a temporary home while its final organisation is decided. The package is marked `private` and has no licence yet. Names and structure may still change.

## What is in the package

Everything a site needs is in `dist/`. There is no framework code in it, so any site can use it, whatever it is built with.

| File | What it is |
|---|---|
| `dist/tokens.css` | Every token as a CSS custom property, with its default value. Load it first. |
| `dist/theme.css` | The live layer: tokens that follow the theming dials, colours derived from the brand seeds, the dark theme, type classes and base styles. Load it second. |
| `dist/tokens.json` | The token source: names, values and what each token is for. |
| `dist/infragistics.tokens.json` | The same tokens in the Design Tokens Community Group format (2025.10), for design tools and native platforms. |
| `dist/seed.js` | Optional helper for changing the brand colours at runtime (`window.IgSeed`). |
| `dist/fonts/` | Plus Jakarta Sans, DM Sans and JetBrains Mono (variable, Latin). |

```html
<link rel="stylesheet" href="dist/tokens.css">
<link rel="stylesheet" href="dist/theme.css">
```

```css
.promo-button {
  background: var(--color-action-default);
  color: var(--color-action-on);
  padding: var(--space-inset-sm) var(--space-inset-xl);
  border-radius: var(--radius-full);
}
.promo-button:hover { background: var(--color-action-fill-hover); }
```

## Token tiers

| Tier | Prefix | Who uses it |
|---|---|---|
| Raw | `--ig-*` | Engine output: palette steps and seeds. Only the design system reaches in here. |
| Semantic | `--color-*`, `--space-*`, `--radius-*`, `--size-*`, `--shadow-*`, … | Site code uses these. The name says what the value is for. |
| Component | `--footer-*`, `--nav-*`, `--table-*`, … | One component's own choice, built from the semantic tier. |

**Colour** names follow `color-{role}-{variant}-{state}`, for example `color-action-default`, `color-text-muted`, `color-surface-tint`. Use `color-action-default` for fills and `color-action-text` for anything drawn on a surface (links, outline labels, focus rings).

**Spacing** has two tiers. The steps are `space-3xs` … `space-6xl`; the name is a size, not a pixel value, because the live value follows the spacing and size dials. On top of them sit three roles, and these are what components use:

- `space-inset-{size}` for padding
- `space-stack-{size}` for vertical margins
- `space-gap-{size}` for gaps and inline margins

## Theming

Set a dial on the root, or on any element, and every token below it follows.

| Dial | Values |
|---|---|
| `--ig-size` | 1 small, 2 medium, 3 large (default) |
| `--ig-spacing` | multiplier, default 1 |
| `--ig-radius-factor` | unset by default (each role takes its design value); 0 is each role's minimum, 1 its maximum |
| `--ig-elevation-factor` | multiplier, default 1 |
| `data-theme="dark"` | the dark theme, on the page or on one region |
| `data-ig-scope` | a region that carries its own brand colours |

**Brand colours.** The primary and secondary seeds can be changed at runtime:

```js
IgSeed.setSeed('#0f9d58');        // primary: buttons, links, tints, shadows, focus
IgSeed.setSecondary('#9810fa');   // secondary: violet accents
IgSeed.resetSeed();
```

Hover, active, focus, tint and shadow colours are computed from the seed, so nobody picks them by hand. Two guard rails apply: a colour no screen can show is fitted, and a colour too light (or, in the dark theme, too dark) to read is adjusted wherever it is used as text or as an outline. Fills keep the exact seed with a black or white label.

**Dark theme.** Built from the engine's dark palette. The grey and surface ramps are swapped; every semantic name keeps its meaning.

## Checks

`npm run check` runs all of them. A failure exits non-zero, so CI stops.

| Check | What it stops |
|---|---|
| `checks/lint.mjs` | A hand-typed colour, size, duration or easing in a component source |
| `checks/check-vars.mjs` | A `var()` that points at a token that does not exist |
| `checks/spacing-roles.mjs` | A raw spacing step used for padding, a margin or a gap |
| `checks/gates-derived.cjs` | A hover, focus or active colour that is not derived from its base, or a derived token that drifts from the engine's value |
| `checks/gates-themes.cjs` | Any of 58 colour pairings below WCAG AA, measured in a browser in the light and the dark theme |

Today the checks run against the reference components in this repository. Packaging them as one command that any consuming repository can run on its own code is the next step.

## Repository layout

```
src/         the generator: spec.mjs (the vocabulary), make.mjs (builds dist/), dtcg.mjs, seed.js
checks/      the checks listed above
dist/        the generated package (committed, so a site can use it without building)
reports/     contrast and derived-colour reports from the last build
reference/   React reference components and their stylesheet. They prove the tokens and feed the checks; they are not part of the package
docs/        MIGRATION.md: old token names to new ones
```

To change a token, edit `src/spec.mjs` (or the generator) and rebuild. Never edit `dist/` by hand; CI fails if `dist/` does not match the source.

## Build

Requires Node 22.

```sh
npm ci
npx playwright install chromium   # the contrast checks measure real rendered colours
npm test                          # build, then run every check
```

`src/palettes.json` holds the compiled engine palettes. `npm run palettes` regenerates it from the seed colours in `src/palettes.mjs`.

## Open items

- Home organisation, licence and public package name
- The checks as one installable command for consuming repositories
- A reduced-motion, focus and target-size check (it exists for the reference components, but depends on a showcase page that is not in this repository yet)
- Greys have no seed, so only the primary and secondary colours can be moved at runtime
