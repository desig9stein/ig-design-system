// node src/namespace.mjs
// The engine emits its variables as --ig-*. The design system publishes them as --igd-*, so its tokens can never collide
// with an Ignite UI product theme loaded on the same page. The generator works in the engine's own names; this step is
// the single place where the published prefix is applied, to every generated file.
import fs from "node:fs"; import path from "node:path";
export const ENGINE = "ig", PUBLISHED = "igd";
const css = new RegExp(`--${ENGINE}-`, "g");                    // custom properties: --ig-primary-500, --ig-size, …
const name = new RegExp(`(?<![\\w-])${ENGINE}-(?=[a-z])`, "g");  // token names in JSON and prose: ig-primary-500, {ig-gray-900}
export const ns = t => t.replace(css, `--${PUBLISHED}-`).replace(name, `${PUBLISHED}-`);
const targets = ["dist/tokens.css", "dist/theme.css", "dist/tokens.json", ".cache/components.css", "docs/MIGRATION.md", ...fs.readdirSync("reports").filter(f => f.endsWith(".json")).map(f => path.join("reports", f))];
let n = 0;
for (const f of targets) { if (!fs.existsSync(f)) continue; const t = fs.readFileSync(f, "utf8"); if (new RegExp(`--${PUBLISHED}-`).test(t) && !css.test(t)) continue; css.lastIndex = 0; const u = ns(t); if (u !== t) { fs.writeFileSync(f, u); n++; } }
console.log(`namespace: --${ENGINE}-* published as --${PUBLISHED}-* in ${n} file(s)`);
