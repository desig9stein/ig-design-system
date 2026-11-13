// Gate: padding, margins and gaps in a component use the spacing roles (space-inset-*, space-stack-*, space-gap-*), never a raw step.
// node checks/spacing-roles.mjs <dir-or-file> [...]
import fs from "node:fs"; import path from "node:path";
const role = prop => { const p = prop.replace(/-/g, "").toLowerCase();
  if (p.startsWith("padding") || p.endsWith("pad")) return "inset";
  if (["gap", "columngap", "rowgap", "marginleft", "marginright", "margininline"].includes(p)) return "gap";
  if (p.startsWith("margin")) return "stack"; return null; };
const files = []; const walk = p => fs.statSync(p).isDirectory() ? fs.readdirSync(p).forEach(f => walk(path.join(p, f))) : /\.(jsx|css)$/.test(p) && files.push(p);
process.argv.slice(2).forEach(walk);
let bad = 0;
for (const f of files) { const t = fs.readFileSync(f, "utf8");
  for (const m of t.matchAll(/var\(--space-((?:\d?x[sl]|sm|md|lg))\)/g)) { const before = t.slice(Math.max(0, m.index - 400), m.index);
    const props = [...before.matchAll(/(?:[{,;]\s*|\b(?:const|let)\s+)([a-zA-Z-]+)\s*[:=](?!=)/g)].map(x => x[1]); const r = props.length ? role(props.at(-1)) : null;
    if (r) { bad++; console.log(`${f}: ${props.at(-1)} uses ${m[0]}; use var(--space-${r}-${m[1]})`); } } }
console.log(bad ? `spacing roles gate: ${bad} raw step(s) in a spacing property` : `spacing roles gate: pass (${files.length} files)`);
process.exit(bad ? 1 : 0);
