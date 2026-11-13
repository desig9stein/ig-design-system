// Compiles the engine's palette() Sass function and resolves every colour var to rgb in headless Chromium.
import fs from "node:fs"; import { execSync } from "node:child_process"; import { createRequire } from "node:module"; const { chromium } = createRequire(import.meta.url)("playwright");
const scales = JSON.parse(fs.readFileSync("src/scales.json","utf8"));
const sc = Object.entries(scales).map(([k,v]) => `'${k}': (range: (${v.range.join(", ")}), curve: (${v.curve.join(", ")}))`).join(", ");
const seeds = `$primary: #155dfc, $secondary: #9810fa, $info: #0099ff, $success: #0d9488, $warn: #f59e0b`;
const sets = {
  light:  `palette(${seeds}, $surface: #ffffff, $gray: #64748b, $scales: (${sc}))`,
  dark:   `palette(${seeds}, $surface: #0f172a, $gray: #cbd5e1)`,
  pink:   `palette($primary: #ec4899, $secondary: #9810fa, $surface: #ffffff)`,
  cyan:   `palette($primary: #06b6d4, $secondary: #9810fa, $surface: #ffffff)`,
  sky:    `palette($primary: #38bdf8, $secondary: #9810fa, $surface: #ffffff)`,
  teal:   `palette($primary: #2dd4bf, $secondary: #9810fa, $surface: #ffffff)`,
};
fs.mkdirSync(".cache/sass", { recursive: true });
const css = {};
for (const [k, expr] of Object.entries(sets)) {
  fs.writeFileSync(`.cache/sass/${k}.scss`, `@use 'igniteui-theming' as *;\n$p: ${expr};\n@include palette($p);\n`);
  execSync(`npx sass --quiet --load-path=node_modules .cache/sass/${k}.scss .cache/sass/${k}.css`);
  css[k] = fs.readFileSync(`.cache/sass/${k}.css`, "utf8");
}
const browser = await chromium.launch(); const out = {};
for (const [k, text] of Object.entries(css)) {
  const page = await browser.newPage();
  await page.setContent(`<style>${text}</style><div id=p></div>`);
  out[k] = await page.evaluate(() => {
    const names = []; for (const sheet of document.styleSheets) for (const r of sheet.cssRules) if (r.style) for (const n of r.style) if (n.startsWith("--ig-")) names.push(n);
    const el = document.getElementById("p"); const res = {};
    for (const n of new Set(names)) {
      if (/wcag|contrast-level|-seed-contrast/.test(n) || n === "--y" || n === "--y-contrast") continue;
      el.style.color = ""; el.style.color = `var(${n})`;
      const c = getComputedStyle(el).color; if (c) res[n] = c;
    }
    return res;
  });
  await page.close();
}
await browser.close();
const clamp = v => Math.min(1, Math.max(0, v));
const toHex = c => { const mm = c.match(/^color\(srgb ([^)]+)\)$/); if (mm) { const q = mm[1].split(/[ \/]+/).map(Number); return "#" + q.slice(0,3).map(v=>Math.round(clamp(v)*255).toString(16).padStart(2,"0")).join(""); } const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return c; const p = m[1].split(/[ ,\/]+/).map(Number); const h = p.slice(0,3).map(v=>Math.round(v).toString(16).padStart(2,"0")).join(""); return p.length>3 && p[3]<1 ? `#${h}${Math.round(p[3]*255).toString(16).padStart(2,"0")}` : `#${h}`; };
const flat = {}; for (const [k, v] of Object.entries(out)) { flat[k] = {}; for (const [n, c] of Object.entries(v)) flat[k][n.replace("--ig-","")] = toHex(c); }
fs.writeFileSync("src/palettes.json", JSON.stringify(flat, null, 1));
for (const k of Object.keys(flat)) console.log(k, Object.keys(flat[k]).length, "vars; sample:", flat[k]["primary-500"], flat[k]["gray-900"] ?? "", flat[k]["surface-base"] ?? "", flat[k]["surface-50"] ?? "");
console.log(Object.entries(flat.light).filter(([n]) => /^surface|contrast/.test(n)).slice(0,24).map(([n,v])=>n+"="+v).join("\n"));
