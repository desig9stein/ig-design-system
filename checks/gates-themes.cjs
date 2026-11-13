// Gate: the contrast pairings are measured in a browser, on the live tokens, in both themes. Fails on any pairing below its minimum.
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const OUT = path.join(__dirname, '../dist/'), REP = path.join(__dirname, '../reports/');
(async () => { const pairs = JSON.parse(fs.readFileSync(REP + 'contrast-pairs.json', 'utf8')); const css = fs.readFileSync(OUT + 'tokens.css', 'utf8').replace(/@font-face[^}]*}/g, '') + fs.readFileSync(OUT + 'theme.css', 'utf8');
  const b = await chromium.launch(); const p = await b.newPage(); let fail = 0; const report = {};
  for (const theme of ['light', 'dark']) { await p.setContent(`<style>${css}</style><body><div id="t" data-theme="${theme}"><i id="pr"></i></div>`);
    const rows = await p.evaluate(pairs => { const e = document.getElementById('pr'), k = document.createElement('canvas').getContext('2d', { willReadFrequently: true }); k.canvas.width = k.canvas.height = 1;
      const rgb = n => { e.style.color = `var(--${n})`; const c = getComputedStyle(e).color; k.clearRect(0, 0, 1, 1); k.fillStyle = '#fff'; k.fillRect(0, 0, 1, 1); k.fillStyle = c; k.fillRect(0, 0, 1, 1); return [...k.getImageData(0, 0, 1, 1).data].slice(0, 3); };
      const lum = a => { const f = v => (v /= 255) <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; return .2126 * f(a[0]) + .7152 * f(a[1]) + .0722 * f(a[2]); };
      return pairs.map(([fg, bg, min = 4.5]) => { const x = lum(rgb(fg)), y = lum(rgb(bg)), r = (Math.max(x, y) + .05) / (Math.min(x, y) + .05); return { fg, bg, ratio: +r.toFixed(2), min, ok: r >= min }; }); }, pairs);
    report[theme] = rows; for (const r of rows) if (!r.ok) { fail++; console.log(`${theme}: ${r.fg} on ${r.bg} is ${r.ratio}:1, needs ${r.min}`); } }
  fs.writeFileSync(REP + 'contrast-report-themes.json', JSON.stringify(report, null, 1));
  console.log(fail ? `theme contrast gate: ${fail} FAILING` : `theme contrast gate: pass (${pairs.length} pairings × 2 themes, AA)`); await b.close(); process.exit(fail ? 1 : 0); })();
