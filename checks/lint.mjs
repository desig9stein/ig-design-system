import fs from "node:fs"; import path from "node:path";
const files = []; const walk = d => { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); fs.statSync(p).isDirectory() ? walk(p) : /\.(jsx|js)$/.test(f) && !/bundle\.js$/.test(f) && files.push(p); } };
walk(process.argv[2]);
const PROPS = "width|height|minWidth|maxWidth|minHeight|maxHeight|padding\\w*|margin\\w*|gap|rowGap|columnGap|fontSize|lineHeight|letterSpacing|borderRadius|border\\w*|top|left|right|bottom|inset|zIndex|fontWeight|opacity|flexBasis|boxShadow|transition\\w*|animation\\w*|outline\\w*|verticalAlign|fontFamily";
const rules = [
  ["hex colour", /(?<![\w&])#[0-9a-fA-F]{3,8}\b(?![^<]*<\/)/g],
  ["rgb/hsl literal", /\b(rgba?|hsla?|oklch|color-mix)\(/g],
  ["px/rem/ms literal", /(?<![\w.-])-?\d*\.?\d+(px|rem|ms)\b/g],
  ["em literal (except 1em)", /(?<![\w.-])(?!1em\b)-?\d*\.?\d+em\b/g],
  ["easing literal", /cubic-bezier|(?<![-\w])ease(?![-\w])|ease-out|ease-in(?!-out)\b/g],
  ["numeric design prop", new RegExp(`\\b(${PROPS}):\\s*-?(?!0\\b|1\\b)\\d+(\\.\\d+)?\\b`, "g")],
  ["font shorthand", /\bfont:\s*['"`]\d/g],
];
let n = 0;
for (const f of files) {
  const src = fs.readFileSync(f, "utf8").split("\n");
  src.forEach((line, i) => {
    const t = line.replace(/\/\/.*$/, "").replace(/\/\*.*?\*\//g, "").replace(/d="[^"]*"/g, "").replace(/https?:\/\/[^\s'"`)]+/g, "");
    for (const [name, re] of rules) { re.lastIndex = 0; let m; while ((m = re.exec(t))) { if (name === "easing literal" && /ease-in-out/.test(m[0]) && /animation/.test(t)) continue; n++; console.log(`${path.relative(process.argv[2], f)}:${i + 1}  ${name}: ${m[0]}`); } }
  });
}
console.log(n ? `${n} literal(s) found` : "literal lint: clean");
process.exit(n ? 1 : 0);
