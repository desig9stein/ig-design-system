// node src/migration.mjs <out.md> — the old → new tables come from rename-map.mjs, so they cannot drift from the build.
import fs from "node:fs";
const M = await import("./rename-map.mjs"); const OUT = process.argv[2];
const tbl = (rows, a, b) => `| ${a} | ${b} |\n|---|---|\n` + rows.map(([x, y]) => `| \`--${x}\` | \`--${y}\` |`).join("\n") + "\n";
const groups = [["Colour", Object.entries(M.COLOR)], ["Size, radius, border, typography, motion and everything else", [...Object.entries(M.SIZEMAP), ...Object.entries(M.OTHER)]]];
const SP = (await import('./spec.mjs')).SPACE; const NAME = Object.fromEntries(Object.entries(SP).map(([k, v]) => [v, k]));
const sp = Object.entries(M.SPACEMAP).map(([o, n]) => [`space-${o}`, `space-${NAME[n]}`]);
let md = `# Migration guide

This release is a clean break. The system now sits on the **igniteui-theming** engine, token names follow a three-tier convention, and nothing from the previous names is kept: no aliases, no deprecated files. This page lists every rename so a consumer can migrate with search-and-replace.

## 1. What changed

| Area | Before | Now |
|---|---|---|
| Palette, type, spacing, size, radius, elevation | Hand-picked literals | Engine output (\`palette()\`, \`typography()\`, \`pad()\`, \`sizable()\`, \`border-radius()\`, indigo elevations) |
| Token names | \`--ig-blue\`, \`--text-muted\`, \`--space-6\`, \`--ig-t-…\` | \`--color-{role}-{variant}-{state}\`, \`--space-{n}\`, \`--radius-{step}\`, \`--shadow-{role}\`, \`--type-{slot}-…\` |
| Component styling | Inline literals and JS hover state | Tokens only; hover, focus, disabled, invalid and loading are CSS |
| Icons | An inline \`<svg>\` per component | One \`Icon\` component with stroke and size tokens |
| Forms | A bespoke input and checkbox inside the footer | \`TextField\` and \`Checkbox\` components |
| Entry points | \`styles.css\` importing \`tokens/*.css\` | \`tokens.css\` + \`theme.css\` |

Re-theming: set \`--ig-size\` (1 small, 2 medium, 3 large), \`--ig-spacing\`, \`--ig-radius-factor\` or \`--ig-elevation-factor\` on the root and every token follows.

## 2. Naming convention

Three tiers, role-based names, no colour words in semantic names.

1. **Raw** (\`--ig-*\`): engine steps, for example \`--ig-primary-600\`, \`--ig-gray-200\`. Only the semantic tier points at them.
2. **Semantic** (\`--color-*\`, \`--space-*\`, \`--radius-*\`, \`--size-*\`, \`--shadow-*\`, \`--font-weight-*\`, \`--opacity-*\`, \`--z-index-*\`, \`--breakpoint-*\`): what a value is for. Use these in product code.
3. **Component** (\`--footer-*\`, \`--table-*\`, \`--fw-*\`, \`--badge-*\`, \`--tile-*\`, \`--callout-*\`): a decision made for one component, defined from the semantic tier.

Colour roles read \`color-{role}-{variant}-{state}\`: \`color-action-default\`, \`color-action-hover\`, \`color-text-muted\`, \`color-surface-tint\`, \`color-border-control\`, \`color-feedback-error-default\`.

## 3. Spacing scale

The 25-step scale collapsed to 12 engine steps, and the steps are now named by size (\`3xs\` to \`6xl\`), not by pixel value, because the live value follows \`--ig-spacing\` and \`--ig-size\`. Steps that sat one or two pixels apart merged into their nearest neighbour. Components do not use the steps directly for padding, margins and gaps: they use the roles \`--space-inset-*\`, \`--space-stack-*\` and \`--space-gap-*\`.

${tbl(sp, "Before", "Now")}
In a component, pick the role for the property: padding → \`--space-inset-{size}\`, vertical margins → \`--space-stack-{size}\`, gap and inline margins → \`--space-gap-{size}\`.

## 4. Token renames

`;
for (const [t, rows] of groups) md += `### ${t}\n\n${tbl(rows, "Before", "Now")}\n`;
md += `Type classes: \`.ig-t-{slot}\` → \`.type-{slot}\`. Type variables: \`--type-{slot}-{font-size|font-weight|line-height|font-family}\` follow the engine slot names (\`h1\`–\`h6\`, \`subtitle-1\`, \`subtitle-2\`, \`body-1\`, \`body-2\`, \`button\`, \`caption\`, \`overline\`, \`detail-1\`, \`detail-2\`).

## 5. Component API changes

| Component | Change |
|---|---|
| \`Button\` | New \`loading\` prop. \`disabled\` is now a documented state (\`aria-disabled\`, no hover response). Hover and focus are CSS. |
| \`ArrowLink\` | \`color\` (a CSS string) became \`tone\`: \`action\` \\| \`heading\` \\| \`inverse\`. \`size\` is \`sm\` \\| \`md\` \\| \`lg\` (engine type slots), not a number. |
| \`IconTile\` | \`size\` is a name (\`tile\`, \`sm\`, \`md\`, \`lg\`, \`xl\`), not a number. Numeric sizes were removed. |
| \`FeatureCard\` | \`iconFill\` was removed (it did nothing). Hover lift is CSS and also fires on keyboard focus. |
| \`StatBadge\` | \`duration\` still sets seconds and now overrides \`--duration-float\`. |
| \`NavBar\` | \`panelWidth\` is a CSS length (default \`var(--nav-panel-max-width)\`), not a number. |
| \`CalloutStrip\`, \`PlatformChip\`, \`FrameworkPill\`, \`NavLink\` | Hover and focus moved to CSS; no prop changes. |
| \`SiteFooter\` | The newsletter block is built from \`TextField\`, \`Button\` and \`Checkbox\`. Props unchanged. |
| New | \`Icon\`, \`TextField\`, \`Checkbox\` |

## 6. Removed

These no longer exist and have no replacement file:

- \`styles.css\` and \`tokens/{base,colors,effects,fonts,spacing,typography}.css\` (use \`tokens.css\` and \`theme.css\`)
- \`ui_kits/\`, \`templates/\` (site navigation, marketing page, blog header), \`guidelines/\`, \`*.card.html\`
- The standalone and single-file HTML exports, \`archived/\`, \`migration-map.json\`, \`_ds_manifest.json\`, \`_ds_bundle.js\`
- \`assets/asset-remap.js\` and \`assets/notes/\`
- Per-group prompt files and per-component \`.d.ts\`: props live in \`components/index.d.ts\`, guidance in \`components/<Name>/README.md\`
- The old W3C-format token export: \`tokens.json\` is the single token source

## 7. Checklist

1. Replace names using the tables above (longest names first).
2. Replace \`styles.css\` with \`tokens.css\` then \`theme.css\`.
3. Replace numeric \`IconTile\` and \`ArrowLink\` sizes; drop \`iconFill\`.
4. Drop any local hover state you layered on a component: the CSS covers it.
5. Search for hard-coded hex, px and ms in your own code; map each to a token or ask for one.
`;
fs.writeFileSync(OUT, md); console.log("migration", md.length);
