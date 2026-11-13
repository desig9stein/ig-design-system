import fs from "node:fs"; import { execSync } from "node:child_process";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import * as S from "./spec.mjs";

// Run from the repository root: node src/make.mjs
const OUT = "dist", REP = "reports", TMP = ".cache/sass"; for (const d of [OUT, REP, TMP]) fs.mkdirSync(d, { recursive: true });
const P = JSON.parse(fs.readFileSync("src/palettes.json", "utf8"));
const OLD = JSON.parse(fs.readFileSync("src/legacy-usage.json", "utf8"));
const f4 = n => (+n.toFixed(4)).toString();
const rem = px => f4(px / 16) + "rem";

// ---------- engine colour lookup: token name -> hex ----------
const engineHex = name => {
  let m;
  if ((m = name.match(/^ig-dark-(gray|surface)-(\d+)$/))) return P.dark[`${m[1]}-${m[2]}`];
  if ((m = name.match(/^ig-dark-surface-(sunken|raised|overlay|base)$/))) return P.dark[`surface-${m[1]}`];
  if ((m = name.match(/^ig-(pink|cyan|sky|teal)-(\d+)$/))) return P[m[1]][`primary-${m[2]}`];
  if ((m = name.match(/^ig-([a-z]+)-accent-(\d+)$/))) return P.light[`${m[1]}-A${m[2]}`];
  if ((m = name.match(/^ig-([a-z]+-(?:A?\d+|seed|base|sunken|raised|overlay))$/))) return P.light[m[1]];
  return null;
};
const hexOf = name => { const a = S.ALIAS[name]; return a ? hexOf(a[0]) : engineHex(name) ?? (() => { throw new Error("unknown colour " + name); })(); };
const rgbOf = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const lin = v => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const lum = h => { const [r, g, b] = rgbOf(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const cr = (a, b) => { const x = lum(hexOf(a)), y = lum(hexOf(b)); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

// ---------- 1. MCP calls (recorded) ----------
const client = new Client({ name: "ds-build", version: "1" });
await client.connect(new StdioClientTransport({ command: "node", args: ["node_modules/igniteui-theming/dist/mcp/index.js"] }));
const calls = [];
const call = async (name, args) => { const r = await client.callTool({ name, arguments: args }); const text = r.content.map(x => x.text).join("\n"); calls.push({ tool: name, input: args }); return text; };
const customScale = {};
for (const [slot, , fam, px, line, weight, track, transform] of S.TYPE)
  customScale[slot] = { fontSize: rem(px), fontWeight: weight, lineHeight: rem(px * line), letterSpacing: track === "0" ? "0" : track, textTransform: transform };
const typo = await call("create_typography", { platform: "generic", output: "css", designSystem: "indigo", fontFamily: S.FAMILIES.body, customScale, name: "ig-type" });
const elev = await call("create_elevations", { platform: "generic", output: "css", designSystem: "indigo", name: "ig-elev" });
const sizeT = await call("set_size", { platform: "generic", size: "large" });
const spaceT = await call("set_spacing", { platform: "generic", spacing: 1 });
const roundT = await call("set_roundness", { platform: "generic", radiusFactor: 1 });
await client.close();
fs.writeFileSync(`${REP}/mcp-typography.txt`, typo); fs.writeFileSync(`${REP}/mcp-elevations.txt`, elev);
const cssBlock = t => (t.match(/```css\n([\s\S]*?)```/) || [, ""])[1];
// typography: the MCP ignores customScale, so the engine's typography() mixin is compiled directly with the custom type scale
const typeScss = `@use 'igniteui-theming' as *;\n$scale: (\n` + S.TYPE.map(([slot, , , px, line, weight, track, transform]) => `  '${slot}': type-style($font-size: rem(${px}px), $font-weight: ${weight}, $line-height: rem(${f4(px * line)}px), $letter-spacing: ${track === "0" ? "0" : track}, $text-transform: ${transform})`).join(",\n") + `\n);\n:root { @include typography('x', $scale); }\n`;
fs.writeFileSync(".cache/sass/type.scss", typeScss);
execSync(`npx sass --quiet --load-path=node_modules .cache/sass/type.scss .cache/sass/type.css`);
const type = {};
for (const m of fs.readFileSync(".cache/sass/type.css", "utf8").matchAll(/--ig-([a-z0-9-]+?)-(font-size|font-weight|font-style|line-height|letter-spacing|text-transform): ([^;]+);/g)) (type[m[1]] ??= {})[m[2]] = m[3];
for (const [slot] of S.TYPE) if (!type[slot]) throw new Error("slot missing in engine output: " + slot);
// neutral elevations 0..24
const elevNeutral = {}; for (const m of cssBlock(elev).matchAll(/--ig-elevation-(\d+): ([^;]+);/g)) elevNeutral[m[1]] = m[2];

// ---------- 2. Sass: layout knobs + tinted elevations ----------
const primary600 = rgbOf(hexOf("ig-primary-600")).join(" ");
const sm = S.SIZE_RATIO.small, md = S.SIZE_RATIO.medium;
const px3 = n => `rem(${f4(n * sm)}px), rem(${f4(n * md)}px), rem(${f4(n)}px)`;
let scss = `@use 'sass:math';\n@use 'igniteui-theming' as *;\n@use 'igniteui-theming/sass/animations/easings' as ease;\n@use 'igniteui-theming/sass/elevations' as e;\n@use 'igniteui-theming/sass/elevations/presets/indigo' as neutral;\n`;
scss += `:root, [data-size] {\n  --ig-size-small: 1; --ig-size-medium: 2; --ig-size-large: 3;\n  --component-size: var(--ig-size, var(--ig-size-large));\n  @include sizable();\n`;
for (const [name, n] of Object.entries(S.SPACE)) scss += `  --space-${name}: #{pad(${px3(n)})};\n`;
// semantic spacing roles, declared beside the steps so a region with its own --ig-size or --ig-spacing re-resolves them
for (const [role, [, sizes]] of Object.entries(S.SPACE_ROLES)) for (const sz of sizes) scss += `  --space-${role}-${sz}: var(--space-${sz});\n`;
for (const [name, [px]] of Object.entries(S.SIZE)) scss += `  --${name}: #{sizable(${px3(px)})};\n`;
scss += `}\n:root {\n`;
// every radius role goes through the engine's border-radius($radius, $min, $max): unset knob = the design value,
// 0 = the role's minimum, 1 = the role's maximum. Limits are per role, so a tile or card never becomes a circle.
for (const [name, [px, , min = 0, max = px]] of Object.entries(S.RADIUS)) scss += `  --${name}: #{border-radius(rem(${px}px), rem(${min}px), rem(${max}px))};\n`;
scss += `  --easing-default: #{ease.$out-cubic};\n  @include e.elevations(neutral.$elevations);\n}\n`;
fs.writeFileSync(".cache/sass/layout.scss", scss);
execSync(`npx sass --quiet --load-path=node_modules .cache/sass/layout.scss .cache/sass/layout.css`);
fs.writeFileSync(".cache/sass/tint.scss", `@use 'igniteui-theming/sass/elevations' as e;\n@use 'igniteui-theming/sass/elevations/presets/indigo' as tinted with ($color-1: rgb(${primary600} / 0.26), $color-2: rgb(${primary600} / 0.12), $color-3: rgb(${primary600} / 0.08));\n:root { @include e.elevations(tinted.$elevations); }\n`);
execSync(`npx sass --quiet --load-path=node_modules .cache/sass/tint.scss .cache/sass/tint.css`);
const layoutCss = fs.readFileSync(".cache/sass/layout.css", "utf8");
const tintVars = {}; for (const m of fs.readFileSync(".cache/sass/tint.css", "utf8").matchAll(/--ig-elevation-(\d+): ([^;]+);/g)) tintVars[m[1]] = m[2];
const tintUsed = [1, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
const resolveShadow = s => s.replace(/calc\(var\(--ig-elevation-factor, 1\) \* (-?[\d.]+)px\)/g, (_, n) => (+n === 0 ? "0" : n + "px")).replace(/rgba\((\d+), (\d+), (\d+), ([\d.]+)\)/g, "rgba($1,$2,$3,$4)").replace(/ 0px/g, " 0");

// ---------- 3. chosen elevations for the semantic shadows ----------
const SHADOWS = { // name: [elevation var (live), snapshot (resolved), usage]
  'shadow-none':         ['var(--ig-elevation-0)', "none", 'Cards at rest — flat; a card is defined by its hairline `color-border-default`. Engine elevation 0.'],
  'shadow-raised':   ['var(--ig-elevation-4)', resolveShadow(elevNeutral[4]), 'Card hover: cards lift shadow only, no translate or scale. Engine elevation 4.'],
  'shadow-accent-lg':          ['var(--ig-elevation-tint-16)', resolveShadow(tintVars[16]), 'Primary CTA and its hover (no shadow change on hover). Engine elevation 16 tinted with `color-action-default`.'],
  'shadow-accent-sm':   ['var(--ig-elevation-tint-1)', resolveShadow(tintVars[1]), 'Framework pill hover — the only hover change on a pill. Engine elevation 1 tinted with `color-action-default`.'],
  'shadow-overlay':        ['var(--ig-elevation-22)', resolveShadow(elevNeutral[22]), 'Screenshots inside a BrowserFrame. Engine elevation 22.'],
  'shadow-floating':        ['var(--ig-elevation-16)', resolveShadow(elevNeutral[16]), 'Floating stat badges. Engine elevation 16.'],
  'shadow-accent-md':       ['var(--ig-elevation-tint-13)', resolveShadow(tintVars[13]), 'Bundle cards with the gradient border. Engine elevation 13 tinted with `color-action-default`.'],
  'callout-release-shadow':      ['var(--ig-elevation-tint-13)', `inset 0 0 0 1px ${(() => { const [r, g, b] = rgbOf(hexOf('color-accent-blue')); return `rgba(${r},${g},${b},${S.OPACITY['opacity-soft'][0]})`; })()}, ` + resolveShadow(tintVars[13]), 'Release strip at rest. Engine elevation 13 tinted with `color-action-default`.'],
  'callout-release-shadow-hover':['var(--ig-elevation-tint-16)', `inset 0 0 0 1px ${(() => { const [r, g, b] = rgbOf(hexOf('color-accent-blue')); return `rgba(${r},${g},${b},${S.OPACITY['opacity-strong'][0]})`; })()}, ` + resolveShadow(tintVars[16]), 'Release strip on hover. Engine elevation 16 tinted with `color-action-default`.'],
  'shadow-panel':        ['var(--ig-elevation-20)', resolveShadow(elevNeutral[20]), 'Open nav panel. Engine elevation 20.'],
};

const dropOf = raw => raw.split(/, (?=0 )/).map(l => { const m = [...l.matchAll(/calc\(var\(--ig-elevation-factor, 1\) \* (-?[\d.]+)px\)|rgba\([^)]*\)/g)]; return { y: m[0][0], b: m[1][0], yn: m[0][1], bn: m[1][1], c: m[3][0].replace(/, /g, ",") }; });
const panelLayers = dropOf(elevNeutral[20]);
SHADOWS['shadow-popover-filter'] = [panelLayers.map(l => `drop-shadow(0 ${l.y} ${l.b} ${l.c})`).join(" "), panelLayers.map(l => `drop-shadow(0 ${l.yn}px ${l.bn}px ${l.c})`).join(" "), 'Open nav panel — the flared panel outline needs a `filter`, so this is engine elevation 20 expressed as drop-shadow() layers (spread dropped).'];
delete SHADOWS['shadow-panel'];

// ---------- 4. tokens.json ----------
const FONTS = [
  { family: 'Plus Jakarta Sans', file: 'plus-jakarta-sans-latin-wght-normal.woff2', weight: '200 800', style: 'normal' },
  { family: 'DM Sans', file: 'dm-sans-latin-wght-normal.woff2', weight: '100 1000', style: 'normal' },
  { family: 'JetBrains Mono', file: 'jetbrains-mono-latin-wght-normal.woff2', weight: '100 800', style: 'normal' },
];
const strip = u => u.replace(/\s*\((?:[^()]*?)\d+(?:\.\d+)?:1[^()]*\)/g, "").replace(/\s*Source value:[^.]*\./g, "").replace(/\s*;\s*kept exact\./g, ".").trim();
const colorTokens = [];
const add = (name, value, usage) => colorTokens.push({ name, value, usage });
const FAM = { primary: "primary", secondary: "secondary", info: "info", success: "success", warn: "warn", error: "error", gray: "gray" };
const note = (fam, variant) => `Engine palette step \`${fam}\`, ${variant}. Seeded from the previous system; each step is solved for contrast by igniteui-theming.`;
for (const fam of Object.keys(FAM)) for (const [n, v] of Object.entries(P.light)) if (new RegExp(`^${fam}-A?\\d+$`).test(n)) add(`ig-${n.replace(/-A(\d+)$/, '-accent-$1')}`, v, note(n.replace("-", " "), "light variant"));
// the engine emits each family\u2019s seed as --ig-<family>-seed: the exact colour the family was built from
for (const fam of ["primary", "secondary", "info"]) add(`ig-${fam}-seed`, P.light[`${fam}-seed`], `The exact seed colour the engine built the ${fam} family from.`);
for (const r of ["base", "sunken", "raised", "overlay"]) add(`ig-surface-${r}`, P.light[`surface-${r}`], `Engine surface role \`${r}\` (light variant).`);
for (const fam of ["gray", "surface"]) for (const s of [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]) add(`ig-dark-${fam}-${s}`, P.dark[`${fam}-${s}`], `Engine ${fam} step ${s}, dark variant (surface seed from the previous \`surface-dark\`). Only for the fixed dark treatments (footer, stat badges, table header).`);
for (const r of ["base", "sunken", "raised", "overlay"]) add(`ig-dark-surface-${r}`, P.dark[`surface-${r}`], `Engine surface role \`${r}\` (dark variant).`);
for (const fam of ["pink", "cyan", "sky", "teal"]) for (const s of [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]) add(`ig-${fam}-${s}`, P[fam][`primary-${s}`], `Engine accent ramp \`${fam}\`, step ${s}: palette() seeded with the ${fam} accent of the previous system.`);
const oldUsage = Object.fromEntries(OLD.color.tokens.map(t => [t.name, t.usage]));
const aliasUsage = name => S.ALIAS[name][1];
// contrast checks that decide which ratio is quoted in a note
const CHECKS = [
  ['color-text-heading', 'color-surface-page'], ['color-text-primary', 'color-surface-page'], ['color-text-secondary', 'color-surface-page'], ['color-text-secondary', 'color-surface-subtle'], ['color-text-ui', 'color-surface-page'], ['color-text-muted', 'color-surface-page'], ['color-text-muted', 'color-surface-subtle'],
  ['color-text-secondary', 'color-surface-page'], ['color-action-default', 'color-surface-page'], ['color-action-default', 'color-surface-tint'], ['color-action-default', 'color-surface-page'], ['color-action-default', 'color-surface-tint'], ['color-action-on', 'color-action-default'], ['color-text-muted', 'color-surface-page'],
  ['color-text-muted', 'color-surface-card'], ['color-text-muted', 'color-surface-tint'], ['color-text-muted', 'color-surface-page'], ['color-link-utility', 'color-surface-page'], ['color-link-utility', 'color-surface-subtle'], ['color-action-hover', 'color-surface-page'], ['color-action-active', 'color-surface-page'],
  ['color-text-inverse', 'color-surface-inverse'], ['color-text-inverse-muted', 'color-surface-inverse'], ['color-accent-sky', 'color-surface-inverse'], ['color-accent-teal', 'color-surface-inverse'], ['color-link-inverse', 'color-surface-inverse'], ['color-focus-inverse', 'color-surface-inverse'],
  ['footer-link', 'ig-dark-surface-200'], ['footer-text', 'ig-dark-surface-200'], ['footer-strong', 'ig-dark-surface-200'], ['footer-heading', 'ig-dark-surface-200'], ['footer-icon', 'ig-dark-surface-200'], ['color-feedback-error-inverse', 'ig-dark-surface-200'],
  ['badge-bundle-color', 'badge-bundle-background'], ['badge-oss-color', 'color-surface-page'], ['table-mark-yes-color', 'table-mark-yes-background'], ['table-mark-partial-color', 'table-mark-partial-background'], ['table-mark-no-color', 'table-mark-no-background'], ['table-header-sub-color', 'color-surface-inverse'], ['table-header-sub-highlight-color', 'color-action-default'], ['table-header-detail-color', 'color-surface-inverse'],
  ['color-icon-subtle', 'color-surface-page', 1], ['color-border-control', 'color-surface-page', 3], ['color-focus-inverse', 'color-surface-inverse', 3], ['color-action-default', 'color-surface-page', 3], ['color-feedback-error-default', 'color-surface-page'], ['color-feedback-error-default', 'color-surface-subtle'], ['color-focus-default', 'color-surface-page', 3], ['color-text-ui', 'color-surface-subtle'], ['color-text-secondary', 'color-surface-muted'],
];
const report = []; const ratioNote = {};
for (const [fg, bg, min = 4.5] of CHECKS) { const r = cr(fg, bg); report.push({ fg, bg, ratio: +r.toFixed(2), min, ok: r >= min }); (ratioNote[fg] ??= []).push(`${r.toFixed(1)}:1 on \`${bg}\``); }
for (const [name, [eng]] of Object.entries(S.ALIAS)) add(name, `{${eng}}`, aliasUsage(name) + (ratioNote[name] ? ` Contrast ${ratioNote[name].join(", ")}.` : ""));
for (const [name, [base, op, usage]] of Object.entries(S.ALPHA)) { const [r, g, b] = rgbOf(hexOf(base)); add(name, `rgba(${r},${g},${b},${S.OPACITY[op][0]})`, `${usage} Live: \`${base}\` at \`${op}\`.`); }

const GRAD = { // snapshot (hex) and live (var) forms
  'footer-background-gradient': [`linear-gradient(155deg, ${hexOf('ig-dark-surface-200')} 0%, ${hexOf('ig-dark-surface-400')} 42%, ${hexOf('footer-background')} 100%)`, 'linear-gradient(155deg, var(--ig-dark-surface-200) 0%, var(--ig-dark-surface-400) 42%, var(--footer-background) 100%)', 'The site footer’s own 155° gradient — one of the two dark surfaces in the system.'],
  'gradient-brand': [`linear-gradient(92deg, ${hexOf('color-accent-blue')}, ${hexOf('color-accent-violet')})`, 'linear-gradient(92deg, var(--color-accent-blue), var(--color-accent-violet))', 'The 92° blue→violet, clipped to one headline fragment per section. Never a background fill, button or tile.'],
  'gradient-hero': [`linear-gradient(180deg, ${hexOf('color-surface-hero')}, ${hexOf('color-surface-page')})`, 'linear-gradient(180deg, var(--color-surface-hero), var(--color-surface-page))', 'The hero wash behind the homepage hero.'],
};
const glow = (base, op, stop) => { const [r, g, b] = rgbOf(hexOf(base)); return [`radial-gradient(circle, rgba(${r},${g},${b},${S.OPACITY[op][0]}), transparent ${stop}%)`, `radial-gradient(circle, hsl(from var(--${base}) h s l / var(--${op})), transparent ${stop}%)`]; };
const GLOWS = { 'glow-blue': ['color-accent-blue', 'opacity-muted', 62, 'Ambient radial glow behind hero and section content, bleeding off the edges, `pointer-events:none`.'], 'glow-violet': ['color-accent-violet', 'opacity-muted', 62, 'Ambient radial glow partnered with `glow-blue` on light sections.'], 'glow-violet-strong': ['color-accent-violet', 'opacity-heavy', 62, 'Footer glow only (top-right of the dark footer).'], 'glow-pink': ['tile-pink', 'opacity-muted', 62, 'Ambient glow for the dark AI and enterprise bands only.'], 'glow-teal': ['color-accent-teal', 'opacity-soft', 68, 'Ambient glow for the dark AI and enterprise bands and the footer.'] };
const gradientTokens = [];
for (const [n, [snap, , u]] of Object.entries(GRAD)) gradientTokens.push({ name: n, value: snap, usage: u });
for (const [n, [base, op, stop, u]] of Object.entries(GLOWS)) gradientTokens.push({ name: n, value: glow(base, op, stop)[0], usage: u });

const typeGroups = [{ name: "Display", family: "display", styles: [] }, { name: "Body", family: "body", styles: [] }];
for (const [slot, role, fam, px, line, weight, track, transform, usage, sample] of S.TYPE) {
  const t = type[slot]; const st = { name: `type-${slot}`, fontSize: t["font-size"], lineHeight: t["line-height"], fontWeight: weight, usage: `${usage} (was \`${role}\`; engine slot \`${slot}\`)`, sample };
  if (track !== "0") st.letterSpacing = t["letter-spacing"];
  (fam === "display" ? typeGroups[0] : typeGroups[1]).styles.push(st);
  if (fam === "display" && false) st.family = "display";
}
// slots that use the display face but sit in the body group keep their own family
for (const g of typeGroups) for (const st of g.styles) { const slot = st.name.slice(5); const fam = S.TYPE.find(r => r[0] === slot)[2]; if (fam !== (g.family)) st.family = fam; }

const tokens = {
  name: "Infragistics Marketing Design System", version: 2,
  color: { themes: [{ id: "light", name: "Light" }], tokens: colorTokens },
  type: { fonts: FONTS, families: S.FAMILIES, groups: typeGroups },
  spacing: { note: "Two tiers. Steps (space-3xs … space-6xl) are the raw scale; the name is a size, not a pixel value, and the live value comes from the engine's pad() in theme.css, following --ig-spacing and --ig-size. Roles (space-inset-*, space-stack-*, space-gap-*) say what the space is for and are what components use.", tokens: [...Object.entries(S.SPACE).map(([name, n]) => ({ name: `space-${name}`, value: rem(n), usage: `Raw spacing step. ${n}px at the default density.` })), ...Object.entries(S.SPACE_ROLES).flatMap(([role, [usage, sizes]]) => sizes.map(sz => ({ name: `space-${role}-${sz}`, value: `{space-${sz}}`, usage })))] },
  radius: { note: "Live values are produced by the engine's border-radius() in theme.css and follow --ig-radius-factor (unset = as listed, 0 = each role\u2019s minimum, 1 = each role\u2019s maximum).", tokens: Object.entries(S.RADIUS).map(([name, [px, u, min = 0, max = px]]) => ({ name, value: rem(px), usage: `${u} Range ${min}px to ${max}px.` })) },
  size: { note: "Live values are produced by the engine's sizable() in theme.css and step down for --ig-size small and medium.", tokens: [...Object.entries(S.SIZE).map(([name, [px, u]]) => ({ name, value: rem(px), usage: u })), ...Object.entries(S.TRACKING).map(([name, [v, u]]) => ({ name, value: v, usage: u }))] },
  shadow: { note: "Resolved from igniteui-theming elevations (indigo preset) at --ig-elevation-factor 1; tinted levels use the same preset with `color-action-default` as umbra, penumbra and ambient colour. theme.css keeps them live.", tokens: [
    ...Object.entries(SHADOWS).map(([name, [, snap, usage]]) => ({ name, value: snap === "none" ? "none" : snap, usage })),
    ...Object.keys(elevNeutral).map(l => ({ name: `elevation-${l}`, value: l === "0" ? "none" : resolveShadow(elevNeutral[l]), usage: `Engine elevation ${l}, indigo preset.` })),
    ...tintUsed.map(l => ({ name: `elevation-tint-${l}`, value: resolveShadow(tintVars[l]), usage: `Engine elevation ${l}, indigo preset, tinted with \`action\`.` })),
  ] },
  opacity: { note: "Alpha steps for translucent colours; combined with a colour token as hsl(from <colour> h s l / <opacity>).", tokens: Object.entries(S.OPACITY).map(([name, [v, u]]) => ({ name, value: String(v), usage: u })) },
  weight: { tokens: Object.entries(S.WEIGHT).map(([name, v]) => ({ name, value: String(v), usage: `Font weight ${v}.` })) },
  gradient: { note: "Gradients and ambient glows. Three uses only: clipped headline text, the hero wash and glows, and the footer.", tokens: gradientTokens },
  breakpoint: { note: "The layout only changes at these four; the container is fluid between them.", tokens: Object.entries(S.BREAKPOINT).map(([name, [px, u]]) => ({ name, value: `${px}px`, usage: u })) },
  zIndex: { note: "Eight named layers — never write a raw z-index.", tokens: Object.entries(S.ZINDEX).map(([name, [v, u]]) => ({ name, value: String(v), usage: u })) },
};
fs.writeFileSync(`${OUT}/tokens.json`, JSON.stringify(tokens, null, 2) + "\n");

// ---------- 5. tokens.css (as the page compiles it) ----------
const colorVal = v => /^\{(.+)\}$/.test(v) ? `var(--${v.slice(1, -1)})` : v;
let css = `/* Infragistics Marketing Design System — generated from tokens.json */\n\n:root, [data-theme="light"] {\n`;
for (const t of colorTokens) css += `  --${t.name}: ${colorVal(t.value)};\n`;
for (const t of tokens.shadow.tokens) css += `  --${t.name}: ${t.value};\n`;
css += `}\n\n:root {\n`;
for (const fam of ["spacing", "radius", "size", "opacity", "weight", "gradient", "breakpoint", "zIndex"]) for (const t of tokens[fam].tokens) css += `  --${t.name}: ${colorVal(String(t.value))};\n`;
for (const [k, v] of Object.entries(S.FAMILIES)) css += `  --font-${k}: ${v};\n`;
css += `}\n\n`;
for (const f of FONTS) css += `@font-face { font-family: '${f.family}'; src: url('fonts/${f.file}') format('woff2'); font-weight: ${f.weight}; font-style: ${f.style}; font-display: swap; }\n`;
css += `\n`;
for (const g of typeGroups) for (const st of g.styles) { const fam = st.family || g.family; css += `.${st.name} { font-family: var(--font-${fam}); font-size: ${st.fontSize}; line-height: ${st.lineHeight}; font-weight: ${st.fontWeight};${st.letterSpacing ? ` letter-spacing: ${st.letterSpacing};` : ""} }\n`; }
fs.writeFileSync(`${OUT}/tokens.css`, css);

// ---------- 6. theme.css ----------
const live = {}; // live overrides, same names as tokens.json
let b = `/* Infragistics Marketing Design System — theme.css
   Loaded after tokens.css. This file is the live layer of the igniteui-theming engine:
   1. the engine's own variables (--ig-*): sizing, spacing, roundness, elevations, typography, contrast;
   2. the tokens that must stay live — spacing, sizes, radii, shadows, gradients, translucent colours —
      declared again with the same names as tokens.json, so --ig-size, --ig-spacing, --ig-radius-factor,
      --ig-elevation-factor and palette edits cascade. At the default knob values they equal tokens.json;
   3. the semantic type variables and classes (.type-<slot>), motion, and base element styles.
   Nothing in a component may carry a literal colour, length, font size, shadow or radius: it reads a token. */

/* ===== 1. igniteui-theming engine layer ===== */
`;
b += `/* knobs (set_size large, set_spacing 1, set_roundness 1 as called through the MCP) */\n:root {\n  --ig-size: 3;\n  --ig-spacing: 1;\n  --ig-elevation-factor: 1;\n  /* --ig-radius-factor is left unset: each radius role then takes its own design value. Set it from 0 (each role's minimum) to 1 (each role's maximum). */\n}\n`;
b += `/* contrast colours, exactly as the engine's palette() emits them */\n:root, [data-theme] {\n  --ig-wcag-a: 0.31;\n  --ig-wcag-aa: 0.185;\n  --ig-wcag-aaa: 0.178;\n  --ig-contrast-level: var(--ig-wcag-aa);\n  --y: clamp(0, (y / var(--ig-contrast-level) - 1) * -infinity, 1);\n  --y-contrast: xyz-d65 var(--y) var(--y) var(--y);\n  --ig-primary-600-contrast: hsla(from color(from var(--ig-primary-600) var(--y-contrast)) h 0 l/1);\n  --color-action-on: var(--ig-primary-600-contrast);\n}\n`;
b += `/* sizing, spacing, roundness, easing and neutral elevations: compiled from the engine's sizable(), pad(), border-radius() */\n${layoutCss.replace(/\n{2,}/g, "\n").trim()}\n`;
b += `/* elevations tinted with \`action\` (indigo preset, colours configured through its $color-1..3) */\n:root {\n${tintUsed.map(l => `  --ig-elevation-tint-${l}: ${tintVars[l]};`).join("\n")}\n}\n`;
b += `/* typography: engine slot variables (create_typography, indigo scale, customScale from the previous styles) */\n:root {\n  --ig-font-family: var(--font-body);\n`;
for (const [slot, , fam] of S.TYPE) { const t = type[slot]; b += `  --ig-${slot}-font-family: var(--font-${fam});\n`; for (const p of ["font-size", "font-weight", "font-style", "line-height", "letter-spacing", "text-transform"]) b += `  --ig-${slot}-${p}: ${t[p]};\n`; }
b += `}\n\n/* ===== 2. live tokens (same names as tokens.json) ===== */\n:root {\n`;
for (const [n, [liveVal]] of Object.entries(SHADOWS)) { if (n === "callout-release-shadow") b += `  --${n}: inset 0 0 0 var(--border-width-default) var(--color-emphasis-ring), var(--ig-elevation-tint-13);\n`; else if (n === "callout-release-shadow-hover") b += `  --${n}: inset 0 0 0 var(--border-width-default) var(--color-emphasis-ring-hover), var(--ig-elevation-tint-16);\n`; else b += `  --${n}: ${liveVal};\n`; }
for (const l of Object.keys(elevNeutral)) b += `  --elevation-${l}: var(--ig-elevation-${l});\n`;
for (const l of tintUsed) b += `  --elevation-tint-${l}: var(--ig-elevation-tint-${l});\n`;
for (const [n, [, lv]] of Object.entries(GRAD)) b += `  --${n}: ${lv};\n`;
for (const [n, [base, op, stop]] of Object.entries(GLOWS)) b += `  --${n}: ${glow(base, op, stop)[1]};\n`;
for (const [n, [base, op]] of Object.entries(S.ALPHA)) b += `  --${n}: hsl(from var(--${base}) h s l / var(--${op}));\n`;
b += `  --gradient-border-bundle: linear-gradient(var(--color-surface-card), var(--color-surface-card)) padding-box, linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-violet)) border-box;\n`;
b += `  --gradient-emphasis: linear-gradient(180deg, hsl(from var(--color-accent-blue) h s l / var(--opacity-subtle)), hsl(from var(--color-accent-sky) h s l / var(--opacity-faint)));\n`;
b += `  --footer-card-background: linear-gradient(180deg, hsl(from var(--color-text-inverse) h s l / var(--opacity-faint)), transparent);\n`;
b += `  --container-gutter: clamp(var(--space-md), 4vw, var(--space-4xl)); /* @kind spacing */\n  --layout-split: 0.95fr 1.05fr; /* @kind other */\n`;
b += `  --nav-backdrop-blur: blur(var(--space-sm));\n`;
b += `}\n\n/* motion */\n:root {\n  --duration-chip: 140ms;\n  --duration-fast: 160ms;\n  --duration-button: 180ms;\n  --duration-slow: 320ms;
  --duration-float: 5000ms;\n  --duration-spin: 800ms;\n  --easing-linear: linear;\n  --transition-default: all var(--duration-fast) var(--easing-default);\n}\n`;
b += `\n/* ===== 3. type variables and classes ===== */\n:root {\n`;
for (const [slot, , fam] of S.TYPE) b += `  --type-${slot}-font-family: var(--ig-${slot}-font-family);\n  --type-${slot}-font-size: var(--ig-${slot}-font-size);\n  --type-${slot}-font-weight: var(--ig-${slot}-font-weight);\n  --type-${slot}-line-height: var(--ig-${slot}-line-height);\n  --type-${slot}-letter-spacing: var(--ig-${slot}-letter-spacing);\n  --type-${slot}-text-transform: var(--ig-${slot}-text-transform);\n`;
b += `}\n`;
for (const [slot] of S.TYPE) b += `.type-${slot} { font-family: var(--type-${slot}-font-family); font-size: var(--type-${slot}-font-size); font-weight: var(--type-${slot}-font-weight); line-height: var(--type-${slot}-line-height); letter-spacing: var(--type-${slot}-letter-spacing); text-transform: var(--type-${slot}-text-transform); }\n`;
b += `
/* ===== 4. motion keyframes and base styles ===== */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
@keyframes ig-float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(calc(-1 * var(--space-xs))); }
}
@keyframes ig-app-shimmer {
  0%, 100% { filter: drop-shadow(0 var(--space-xs) var(--space-md) hsl(from var(--color-accent-blue) h s l / var(--opacity-heavy))); opacity: 1; }
  50%      { filter: drop-shadow(0 var(--space-xs) var(--space-xl) hsl(from var(--color-accent-sky) h s l / var(--opacity-heavy))); opacity: 1; }
}

* { box-sizing: border-box; }
body {
  margin: 0;
  background: var(--color-surface-page);
  font-family: var(--font-body);
  font-size: var(--type-body-2-font-size);
  line-height: var(--type-body-2-line-height);
  color: var(--color-text-primary);
  text-wrap: pretty;
}
a { color: var(--color-action-default); text-decoration: none; }
a:hover { color: var(--color-action-hover); }
h1, h2, h3, h4, h5, h6 { font-family: var(--font-display); color: var(--color-text-heading); margin: 0; }
code, pre { font-family: var(--font-mono); }

/* Keyboard focus. Mouse users never see this; keyboard users always do.
   Add data-on-dark to any dark section so the ring stays visible. */
:focus { outline: none; }
a:focus-visible, button:focus-visible, [tabindex]:focus-visible,
input:focus-visible, select:focus-visible, textarea:focus-visible {
  outline: var(--focus-ring-width) solid var(--color-focus-default);
  outline-offset: var(--focus-ring-offset);
}
[data-on-dark] a:focus-visible, [data-on-dark] button:focus-visible,
[data-on-dark] [tabindex]:focus-visible {
  outline-color: var(--color-focus-inverse);
}

/* Breakpoints (media queries cannot read custom properties; generated from tokens.json breakpoint family) */
.ig-hide-below-md { }
@media (max-width: ${S.BREAKPOINT["breakpoint-md"][0]}px) { .ig-hide-below-md { display: none !important; } }
`;
// ---------- 7. seed layer: every ramp re-derives from one set of knobs ----------
// engine hex stays in --engine-<name>; --<name> is derived by OKLCH delta from it. At the default knobs
// (0, 1, 0) the ramp is the engine's own, unchanged. `primary` and `info` share the brand knobs, so one seed
// moves actions, tints, borders, focus rings, the accent blue and the gradient start together.
{
  const ramps = [...css.matchAll(/--(ig-(?!dark-|gray-|surface-)([a-z]+)(?:-accent)?-(?:\d+|seed)): (#[0-9a-f]{6});/g)];
  const famOf = f => (f === "primary" || f === "info") ? "brand" : f;
  const fams = [...new Set(ramps.map(m => famOf(m[2])))];
  let s = `\n/* ===== 5. seed layer: derived colour ===== */\n/* knobs: --<family>-dl (lightness +), --<family>-kc (chroma ×), --<family>-dh (hue +°). Defaults leave the engine ramp unchanged.\n   Set them with setSeed() from components/seed.js, or by hand. Every state (hover, active, focus, tint, border, shadow, glow) reads the ramp, so none needs its own colour. */\n:root {\n`;
  for (const f of fams) s += `  --${f}-dl: 0; --${f}-kc: 1; --${f}-dh: 0;\n`;
  s += `}\n/* everything below is re-declared on [data-ig-scope], so a region can carry its own base colours or knobs */\n:root, [data-ig-scope] {\n`;
  for (const m of ramps) { const f = famOf(m[2]); s += `  --engine-${m[1]}: ${m[3]};\n  --${m[1]}: oklch(from var(--engine-${m[1]}) calc(l + var(--${f}-dl)) calc(c * var(--${f}-kc)) calc(h + var(--${f}-dh)));\n`; }
  // ---- state tokens derive from their base token, not from a ramp step of their own ----
  // The delta is measured at build time between the engine's two values, so the default is the engine's colour exactly,
  // and overriding the base (or moving its seed) moves the state with it.
  const hx = n => { const m = css.match(new RegExp(`--${n}: ([^;]+);`)); if (!m) throw new Error("no token " + n); const v = m[1].trim(); const r = v.match(/^var\(--([a-z0-9-]+)\)$/); return r ? hx(r[1]) : v; };
  const ok = hex => { const v = [1, 3, 5].map(i => { const x = parseInt(hex.slice(i, i + 2), 16) / 255; return x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4; });
    const l = Math.cbrt(.4122214708 * v[0] + .5363325363 * v[1] + .0514459929 * v[2]), m = Math.cbrt(.2119034982 * v[0] + .6806995451 * v[1] + .1073969566 * v[2]), q = Math.cbrt(.0883024619 * v[0] + .2817188376 * v[1] + .6299787005 * v[2]);
    const A = 1.9779984951 * l - 2.428592205 * m + .4505937099 * q, B = .0259040371 * l + .7827717662 * m - .808675766 * q;
    return { l: .2104542553 * l + .793617785 * m - .0040720468 * q, c: Math.hypot(A, B), h: (Math.atan2(B, A) * 180 / Math.PI + 360) % 360 }; };
  const DERIVED = [
    ["color-action-fill-hover", "color-action-default"], ["color-action-active", "color-action-default"], ["color-action-hover", "color-action-text"],
    ["color-link-utility", "color-action-text"], ["color-surface-tint", "color-action-default"], ["color-surface-tint-strong", "color-action-default"],
    ["color-border-accent", "color-action-default"], ["table-header-sub-highlight-color", "color-action-default"],
    ["color-accent-blue-hover", "color-accent-blue"], ["color-accent-blue-active", "color-accent-blue"],
    ["color-link-inverse-hover", "color-link-inverse"], ["color-focus-inverse", "color-link-inverse"], ["footer-focus", "color-link-inverse"],
    ["footer-link-hover", "footer-link"], ["color-feedback-error-inverse", "color-feedback-error-default"],
    ["badge-bundle-background", "badge-bundle-color"],
    // pairs that belong together share one base
    ["fw-angular-background", "fw-angular-color"], ["fw-angular-border", "fw-angular-color"],
    ["fw-react-background", "fw-react-color"], ["fw-react-border", "fw-react-color"],
    ["fw-blazor-background", "color-accent-violet"], ["fw-blazor-border", "color-accent-violet"],
    ["fw-webcomponents-background", "color-action-default"], ["fw-webcomponents-border", "color-action-default"],
    ["fw-winforms-background", "color-action-default"], ["fw-winforms-border", "color-action-default"],
    ["fw-wpf-background", "color-action-default"], ["fw-wpf-border", "color-action-default"],
    ["table-mark-partial-background", "table-mark-partial-color"],
    ["footer-heading", "footer-text"], ["footer-link", "footer-text"], ["footer-strong", "footer-text"],
    ["color-text-inverse-muted", "color-text-inverse"],
  ];
  const ALIAS = [["color-link-utility-hover", "color-action-text"], ["color-focus-default", "color-action-text"], ["tile-blue", "color-accent-blue"], ["tile-violet", "color-accent-violet"], ["tile-royal", "color-action-default"], ["color-link-inverse", "color-accent-sky"], ["footer-icon", "footer-text"]];
  // semantic tokens that point straight at a ramp step are declared again here, so a scope with its own knobs re-resolves them
  const textSafe = [];
  // --theme-dark is 0 in the light theme and 1 under [data-theme="dark"]; every theme-dependent formula blends on it, so a
  // token re-declared inside a scope still lands on the right side.
  const F = "var(--theme-dark)";
  const textExpr = (from, L) => { const Tl = `min(l, max(0.35, ${L} - 0.6 * max(0, l - ${L})))`, Td = `max(l, min(0.92, 0.74 + 0.6 * max(0, 0.74 - l)))`;
    return `oklch(from ${from} calc((1 - ${F}) * ${Tl} + ${F} * ${Td}) calc(c * ((1 - ${F}) * ${Tl} / max(l, 0.0001) + ${F} * min(1, (1 - ${Td}) / max(1 - l, 0.0001)))) h)`; };
  { const taken = new Set([...DERIVED.map(d => d[0]), ...ALIAS.map(d => d[0]), "color-action-text"]);
    s += `  /* semantic tokens that alias a ramp step */\n`;
    for (const m of css.matchAll(/^\s*--([a-z0-9-]+): (var\(--ig-(?!dark-|gray-|surface-)[a-z-]+-(?:\d+|seed)\));/gm)) if (!m[1].startsWith("ig-") && !taken.has(m[1])) {
      // a token that is text on a light surface keeps its own lightness as a ceiling, so moving its family's seed lighter cannot make it unreadable
      const o = ok(hx(m[1])), isText = /^(color-text|color-link)|-color$|^color-feedback-error-default$/.test(m[1]) && o.l < .6 && o.c > .005;
      if (isText) { const L = Math.ceil(o.l * 1e4) / 1e4; s += `  --${m[1]}: ${textExpr(m[2], L)};\n`; textSafe.push(m[1]); }
      else s += `  --${m[1]}: ${m[2]};\n`; } }
  s += `  /* state tokens: derived from their base. Override a base and its states follow. */\n`;
  const derivedRecord = {};
  // the action colour as text: the seed itself until it is too light to read on the page, then darkened to the brand's own lightness
  { const L = Math.ceil(ok(hx("color-action-default")).l * 1e4) / 1e4;
    // seeds lighter than the brand are darkened a little past it (0.6 for each step of extra lightness, never below 0.35),
    // because yellow, green and cyan are brighter to the eye than blue at the same OKLCH lightness
    s += `  --color-action-text: ${textExpr('var(--color-action-default)', L)};\n`; derivedRecord["color-action-text"] = { base: "color-action-default", maxL: L }; }
  for (const [tok, base] of DERIVED) {
    const a = ok(hx(base)), z = ok(hx(tok)); const chroma = a.c > 0.005;
    const dl = (z.l - a.l).toFixed(4), kc = chroma ? (z.c / a.c).toFixed(4) : "1", dh = chroma && z.c > 0.005 ? (((z.h - a.h + 540) % 360) - 180).toFixed(2) : "0";
    // a grey base has no hue to shift, so the state takes the engine's own chroma and hue and follows the base in lightness only
    // a light surface or hairline stays light whatever the seed's lightness: it takes the seed's hue and a share of its chroma, never its darkness
    const fixedL = z.l > .8 && /(background|surface|border|highlight)/.test(tok);
    const Ld = Math.min(.42, .2 + (1 - z.l) * 1.3).toFixed(4);
    s += fixedL && chroma ? `  --${tok}: oklch(from var(--${base}) calc((1 - ${F}) * ${z.l.toFixed(4)} + ${F} * ${Ld}) calc(c * ${kc} * (1 + 1.5 * ${F})) calc(h + ${dh}));\n`.replaceAll(F, /highlight/.test(tok) ? '0' : F) : chroma ? `  --${tok}: oklch(from var(--${base}) calc(l + ${dl}) calc(c * ${kc}) calc(h + ${dh}));\n` : `  --${tok}: oklch(from var(--${base}) calc(l + ${dl}) ${z.c.toFixed(4)} ${z.h.toFixed(2)});\n`;
    derivedRecord[tok] = fixedL && chroma ? { base, l: +z.l.toFixed(4), kc: +kc, dh: +dh } : { base, dl: +dl, kc: +kc, dh: +dh };
  }
  for (const [tok, base] of ALIAS) { if (hx(tok) !== hx(base)) throw new Error(`alias ${tok} is not ${base} in the engine`); s += `  --${tok}: var(--${base});\n`; derivedRecord[tok] = { base, alias: true }; }
  fs.writeFileSync(`${REP}/derived-states.json`, JSON.stringify(derivedRecord, null, 2));
  s += `  /* label on the action fill: the engine's adaptive-contrast(), black or white by luminance at the WCAG AA threshold */\n  --color-action-on: hsla(from color(from var(--color-action-default) var(--y-contrast)) h 0 l / 1);\n}\n`;
  // the glyph on an icon tile: black or white, picked from the tile's own fill
  s += `[data-ig="icon-tile"] { --tile-fill: var(--tile-blue); --tile-on: hsla(from color(from var(--tile-fill) var(--y-contrast)) h 0 l / 1); }\n`;
  b += s;
  // one shadow colour behind every neutral elevation
  b = b.replace(/(--ig-elevation-\d+: [^;]+;|--shadow-popover-filter: [^;]+;)/g, l => l.replace(/rgba\(0, ?0, ?0, ?([\d.]+)\)/g, "hsl(from var(--color-shadow) h s l / $1)"));
  b = b.replace("\n/* ===== 5. seed layer", "\n:root { --color-shadow: oklch(0 0 0); }\n/* ===== 5. seed layer");
  // the live colour tokens and tinted elevations resolve again inside a scope
  const mark = "/* ===== 2. live tokens";
  if (!b.includes(mark) || !b.includes("\n:root {\n  --ig-elevation-tint-1:")) throw new Error("scope anchors moved");
  b = b.replace("\n:root {\n  --ig-elevation-tint-1:", "\n:root, [data-ig-scope] {\n  --ig-elevation-tint-1:");
  const i = b.indexOf(mark), j = b.indexOf("\n:root {", i);
  b = b.slice(0, j) + "\n:root, [data-ig-scope] {" + b.slice(j + "\n:root {".length);
  // tinted elevations carry the action colour, not a fixed rgb
  b = b.replace(/(--ig-elevation-tint-\d+: [^;]+;)/g, l => l.replace(/rgba\(36, 98, 234, ([\d.]+)\)/g, "hsl(from var(--color-action-default) h s l / $1)"));
}
// ===== 6. dark theme: the engine's dark palette =====
{ b = b.replaceAll(":root, [data-ig-scope] {", ":root, [data-ig-scope], [data-theme] {");
  const neutral = Object.entries(S.ALIAS).filter(([n, [eng]]) => /^ig-(gray|surface)-/.test(eng) && n !== 'color-action-on');
  b += `\n/* ===== 6. themes ===== */\n:root, [data-theme="light"] { --theme-dark: 0; }\n`;
  b += `/* neutral roles, declared again so a themed region or a scope resolves them against its own grey and surface ramps */\n:root, [data-ig-scope], [data-theme] {\n${neutral.map(([n, [eng]]) => `  --${n}: var(--${eng});`).join("\n")}\n}\n`;
  b += `/* dark: the light grey and surface ramps are swapped for the engine's dark palette (palette() with a dark surface and a light grey).\n   Every semantic name keeps its meaning. Brand fills keep the seed; text, outlines, tints and hairlines switch through --theme-dark. */\n[data-theme="dark"] {\n  --theme-dark: 1; color-scheme: dark;\n`;
  for (const s of [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]) b += `  --ig-gray-${s}: var(--ig-dark-gray-${s});\n`;
  for (const s of [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]) if (css.includes(`--ig-surface-${s}:`)) b += `  --ig-surface-${s}: var(--ig-dark-surface-${s});\n`;
  for (const r of ["base", "sunken", "raised", "overlay"]) b += `  --ig-surface-${r}: var(--ig-dark-surface-${r});\n`;
  b += `}\n[data-theme] { background-color: var(--color-surface-page); color: var(--color-text-primary); }\n`; }
const bpSub = t => t.replace(/\{\{(breakpoint-[a-z]+)\}\}/g, (_, k) => S.BREAKPOINT[k][0] + "px");
// theme.css is the package: tokens, live layers and base styles. The reference components keep their own stylesheet.
fs.writeFileSync(`${OUT}/theme.css`, b);
fs.writeFileSync(".cache/components.css", bpSub(fs.readFileSync("reference/components.css", "utf8")));
fs.writeFileSync(`${REP}/contrast-report.json`, JSON.stringify(report, null, 1));
fs.writeFileSync(`${REP}/contrast-pairs.json`, JSON.stringify([...CHECKS.filter(c => !(c[0] === 'color-action-default' && (c[2] ?? 4.5) === 4.5) && c[0] !== 'color-action-active'), ['color-action-text', 'color-surface-page'], ['color-action-text', 'color-surface-tint'], ['color-action-text', 'color-surface-card'], ['color-action-text', 'color-surface-subtle'], ['color-text-heading', 'color-surface-card'], ['color-text-primary', 'color-surface-tint'], ['color-text-heading', 'color-surface-tint'], ['color-text-secondary', 'color-surface-card'], ['color-text-ui', 'fw-webcomponents-background'], ['color-text-ui', 'fw-angular-background'], ['color-text-ui', 'fw-react-background'], ['color-text-ui', 'fw-blazor-background'], ['color-focus-default', 'color-surface-page', 3]]));
fs.writeFileSync(`${REP}/mcp-calls.json`, JSON.stringify(calls, null, 1));
fs.writeFileSync(`${REP}/engine-snapshot.json`, JSON.stringify({ type, elevNeutral, tintVars, layoutKnobs: { size: sizeT.trim(), spacing: spaceT.trim(), roundness: roundT.trim() } }, null, 1));
console.log("tokens: colors", colorTokens.length, "| shadows", tokens.shadow.tokens.length, "| spacing", tokens.spacing.tokens.length, "| size", tokens.size.tokens.length);
console.log("theme.css bytes", b.length, "| tokens.css bytes", css.length);
const bad = report.filter(r => !r.ok); console.log("contrast checks:", report.length, "failing:", bad.length); for (const r of bad) console.log("  FAIL", r.fg, "on", r.bg, r.ratio, "<", r.min);
