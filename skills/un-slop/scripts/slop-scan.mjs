#!/usr/bin/env node
// Scan UI source for the tells of generated interfaces. No dependencies.
//
//   node slop-scan.mjs screens/ src/     scan files and folders
//   node slop-scan.mjs src/ --strict     exit 1 when anything is found
//   node slop-scan.mjs --self-test
//
// A tripwire, not a verdict. A hit is a question ("is this here for a reason?"),
// and a clean scan says nothing about whether the design is any good.

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";

const EXTENSIONS = new Set([".html", ".htm", ".css", ".scss", ".jsx", ".tsx", ".js", ".ts", ".vue", ".svelte", ".swift", ".kt", ".dart"]);
const SKIP_DIRS = new Set(["node_modules", ".git", ".next", ".open-next", "dist", "build", "out", "coverage", "Pods", ".expo"]);

// `min` is how many hits in ONE file it takes to report. Most tells are fine
// once and a problem as a habit.
const RULES = [
  {
    id: "purple-gradient",
    label: "Indigo/purple gradient",
    min: 1,
    re: /bg-gradient-to-\w+[^"'`\n]*\b(?:from|via|to)-(?:indigo|violet|purple|fuchsia)-\d{2,3}|(?:from|via|to)-(?:indigo|violet|purple|fuchsia)-\d{2,3}[^"'`\n]*bg-gradient-to-\w+|(?:linear|radial|conic)-gradient\([^)\n]*(?:#(?:667eea|764ba2|6366f1|8b5cf6|a855f7|7c3aed)|\b(?:indigo|purple|violet)\b)|LinearGradient[^\n]*\b(?:purple|indigo)\b/gi,
  },
  {
    id: "gradient-text",
    label: "Gradient text",
    min: 1,
    re: /bg-clip-text[^"'`\n]*text-transparent|text-transparent[^"'`\n]*bg-clip-text|(?:-webkit-)?background-clip:\s*text/g,
  },
  {
    id: "frosted-glass",
    label: "Frosted-glass surfaces",
    min: 2,
    re: /\bbackdrop-blur(?:-\w+)?\b|backdrop-filter:\s*blur|\.(?:ultraThin|thin|regular)Material\b|<BlurView\b/g,
  },
  {
    id: "blur-blobs",
    label: "Blurred decorative blobs",
    min: 1,
    re: /\bblur-(?:2xl|3xl)\b|(?<!backdrop-)filter:\s*blur\((?:[4-9]\d|\d{3,})px\)/g,
  },
  {
    id: "same-radius",
    label: "The same large radius on everything",
    min: 6,
    re: /\brounded-(?:2xl|3xl)\b|border-radius:\s*(?:1[6-9]|2\d|3\d)px|cornerRadius\(\s*(?:1[6-9]|2\d|3\d)\b|borderRadius:\s*(?:1[6-9]|2\d|3\d)\b/g,
  },
  {
    id: "soft-shadows",
    label: "A soft shadow on everything",
    min: 6,
    re: /\bshadow-(?:md|lg|xl|2xl)\b|box-shadow:\s*0\s+\d+px\s+\d{2,}px/g,
  },
  {
    id: "tinted-icon-chip",
    label: "Tinted chip behind icons or labels",
    min: 3,
    re: /\bbg-([a-z]+)-(?:50|100)\b[^"'`\n]*\btext-\1-(?:500|600|700)\b|\btext-([a-z]+)-(?:500|600|700)\b[^"'`\n]*\bbg-\2-(?:50|100)\b/g,
  },
  {
    id: "hover-scale",
    label: "Cards that scale on hover or press",
    min: 2,
    re: /\b(?:hover|active|group-hover):scale-1(?:0[2-9]|1\d)\b|:hover\s*\{[^}\n]*scale\(1\.\d+\)/g,
  },
  {
    id: "equal-grid",
    label: "Three or four equal tiles in a grid",
    min: 1,
    re: /\bgrid-cols-[34]\b|grid-template-columns:\s*repeat\(\s*[34]\s*,\s*(?:minmax\(\s*0\s*,\s*)?1fr/g,
  },
  {
    id: "all-centred",
    label: "Everything centred",
    min: 5,
    re: /\btext-center\b|text-align:\s*center|multilineTextAlignment\(\.center\)|textAlign:\s*["']center["']/g,
  },
  {
    id: "emoji-icons",
    label: "Emoji used as icons or decoration",
    min: 3,
    re: /\p{Extended_Pictographic}/gu,
  },
  {
    id: "stock-copy",
    label: "Stock marketing copy",
    min: 1,
    re: /\b(?:Welcome back|Unlock (?:your|the)|Elevate your|Supercharge|Seamless(?:ly)?|Effortless(?:ly)?|All-in-one|Transform your|to the next level|Get started (?:today|now|for free))\b/gi,
  },
  {
    id: "placeholder-content",
    label: "Placeholder content",
    min: 1,
    re: /\blorem ipsum\b|\b(?:John|Jane) Doe\b|\bItem [123]\b/gi,
  },
  {
    id: "default-font",
    label: "Inter or Poppins as the typeface",
    min: 1,
    re: /font-family:\s*["']?(?:Inter|Poppins)\b|fontFamily:\s*["'](?:Inter|Poppins)\b|family=(?:Inter|Poppins)\b|\.custom\(\s*"(?:Inter|Poppins)/g,
  },
];

/** Findings for one file's text: [{ id, label, count, lines }]. */
export function scanText(text) {
  const lineStarts = [0];
  for (let i = 0; i < text.length; i++) if (text[i] === "\n") lineStarts.push(i + 1);
  const lineOf = (index) => {
    let lo = 0;
    let hi = lineStarts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (lineStarts[mid] <= index) lo = mid;
      else hi = mid - 1;
    }
    return lo + 1;
  };
  const findings = [];
  for (const rule of RULES) {
    const lines = [...text.matchAll(rule.re)].map((m) => lineOf(m.index));
    if (lines.length >= rule.min) findings.push({ id: rule.id, label: rule.label, count: lines.length, lines });
  }
  return findings;
}

function walk(path, files) {
  const stat = statSync(path);
  if (stat.isDirectory()) {
    for (const name of readdirSync(path)) {
      if (SKIP_DIRS.has(name) || name.startsWith(".")) continue;
      walk(join(path, name), files);
    }
  } else if (EXTENSIONS.has(extname(path).toLowerCase())) files.push(path);
}

function selfTest() {
  const check = (label, ok) => {
    if (!ok) throw new Error(`self-test failed: ${label}`);
    console.log(`ok  ${label}`);
  };
  const ids = (text) => scanText(text).map((f) => f.id);

  const sloppy = `
    <div class="bg-gradient-to-br from-indigo-500 to-purple-600 text-center">
      <h1 class="bg-clip-text text-transparent text-center">Welcome back, John Doe 👋</h1>
      <p class="text-center">Supercharge your workflow ✨ 🚀</p>
      <div class="grid grid-cols-3 text-center">
        ${'<div class="rounded-2xl shadow-lg backdrop-blur-md hover:scale-105 text-center"><span class="bg-blue-100 text-blue-600">x</span></div>'.repeat(6)}
      </div>
      <div class="blur-3xl"></div>
      <style>body { font-family: Inter, sans-serif }</style>
    </div>`;
  const found = ids(sloppy);
  for (const rule of RULES) check(`sloppy sample trips ${rule.id}`, found.includes(rule.id));

  const plain = `
    <main class="lane"><h1>Tuesday, 6.2 km</h1><p class="rounded-2xl">Lane 3, tempo run</p>
    <style>.lane { border-radius: 2px; background: #c8402f; font-family: "Barlow Condensed", system-ui }</style></main>`;
  check("plain sample trips nothing", ids(plain).length === 0);
  check("one large radius alone is not a habit", !ids('<div class="rounded-2xl shadow-lg">').length);
  check("backdrop blur is not counted as a blob", !ids("a { backdrop-filter: blur(40px) }").includes("blur-blobs"));
  check("line numbers are 1-based", scanText("\n\nlorem ipsum")[0].lines[0] === 3);
}

function main(argv) {
  if (argv.includes("--help") || argv.includes("-h") || !argv.length) {
    console.log(readFileSync(new URL(import.meta.url), "utf8").split("\n").slice(1, 9).map((l) => l.replace(/^\/\/ ?/, "")).join("\n"));
    return 0;
  }
  if (argv.includes("--self-test")) return selfTest(), 0;

  const strict = argv.includes("--strict");
  const files = [];
  for (const path of argv.filter((a) => !a.startsWith("--"))) {
    if (!existsSync(path)) throw new Error(`Not found: ${path}`);
    walk(resolve(path), files);
  }
  if (!files.length) throw new Error("No UI source files found to scan.");

  const byRule = new Map();
  for (const file of files) {
    for (const finding of scanText(readFileSync(file, "utf8"))) {
      if (!byRule.has(finding.id)) byRule.set(finding.id, { label: finding.label, hits: [] });
      byRule.get(finding.id).hits.push({ file: relative(process.cwd(), file), ...finding });
    }
  }

  console.log(`Scanned ${files.length} file${files.length === 1 ? "" : "s"}; ${byRule.size} of ${RULES.length} tells present.\n`);
  for (const [id, { label, hits }] of byRule) {
    const total = hits.reduce((sum, hit) => sum + hit.count, 0);
    console.log(`${label}  [${id}]  ${total} hit${total === 1 ? "" : "s"}`);
    for (const hit of hits.slice(0, 5)) {
      const shown = hit.lines.slice(0, 4).join(", ") + (hit.lines.length > 4 ? ", ..." : "");
      console.log(`  ${hit.file}:${hit.lines[0]}  (${hit.count}; lines ${shown})`);
    }
    if (hits.length > 5) console.log(`  ... and ${hits.length - 5} more files`);
  }
  if (!byRule.size) console.log("Nothing found. That is not the same as a good design: do the look on the rendered images.");
  return strict && byRule.size ? 1 : 0;
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)) {
  try {
    process.exit(main(process.argv.slice(2)));
  } catch (error) {
    console.error(`slop-scan: ${error.message}`);
    process.exit(2);
  }
}
