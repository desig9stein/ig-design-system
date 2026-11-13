import fs from "node:fs"; import path from "node:path";
const [css1, css2, ...dirs] = process.argv.slice(2);
const defd = new Set([...(fs.readFileSync(css1, "utf8") + fs.readFileSync(css2, "utf8")).matchAll(/--([\w-]+)\s*:/g)].map(m => m[1]));
const files = []; const walk = d => { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); fs.statSync(p).isDirectory() ? walk(p) : /\.(jsx|html|css|mjs)$/.test(f) && files.push(p); } };
dirs.forEach(walk); files.push(css2);
const bad = {};
for (const f of files) for (const m of fs.readFileSync(f, "utf8").matchAll(/var\(--([\w-]+)/g)) if (!defd.has(m[1]) && !/^(igd?-|y$|y-contrast)/.test(m[1]) && !m[1].endsWith("-")) (bad[m[1]] ??= new Set()).add(path.basename(f));
for (const [k, v] of Object.entries(bad)) console.log("UNDEFINED --" + k, [...v].slice(0, 3).join(","));
console.log(Object.keys(bad).length ? "undefined vars: " + Object.keys(bad).length : "all var() references defined");
