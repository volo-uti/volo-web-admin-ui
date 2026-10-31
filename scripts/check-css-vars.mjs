#!/usr/bin/env node
/**
 * Fails when src or the storybook sources (stories and .storybook) reference a
 * `var(--v-…)` that the installed @volo-uti/volo-web-ui does not define.
 *
 * Defined names come from:
 *   - dist/theme/tokens.generated.css and dist/theme/tokens.css of the installed @volo-uti/volo-web-ui (declarations)
 *   - every '--v-…' string literal in the dist/index.js bundle of the installed @volo-uti/volo-web-ui (set at
 *     runtime by ThemeProvider through setProperty)
 *   - local declarations in the scanned sources (`--v-x:` in CSS, style-object
 *     keys such as '--v-x': …, or Tailwind arbitrary properties [--v-x:…]);
 *     a local declaration only counts for references in the same file
 *
 * Template names such as `var(--v-size-${size}-height)` are expanded over the
 * VSize values when the placeholder is a size; any other dynamic name is
 * reported as a warning ("unchecked dynamic name"), not a failure.
 *
 * Usage: node scripts/check-css-vars.mjs
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const UI_DIST = join(ROOT, "node_modules", "@volo-uti", "volo-web-ui", "dist");
const SCAN_DIRS = [join(ROOT, "src"), join(ROOT, "stories"), join(ROOT, ".storybook")];
const SCAN_EXT = /\.(ts|tsx|js|jsx|mjs|css|mdx)$/;
const VSIZES = ["xs", "sm", "md", "lg", "xl"];
const SKIP_DIRS = new Set(["node_modules", "dist", "storybook-static"]);
const SKIP_FILES = new Set(["tokens.generated.css"]);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (SCAN_EXT.test(name) && !SKIP_FILES.has(name)) out.push(full);
  }
  return out;
}

const NAME = "--v-[A-Za-z0-9_-]*[A-Za-z0-9_]";
const DECL = new RegExp(`(?:^|[\\s{;'"\\[])(${NAME})['"]?\\s*:`, "g");
const LITERAL = new RegExp(`['"](${NAME})['"]`, "g");
const USE = new RegExp(`var\\(\\s*(${NAME})(?![A-Za-z0-9_$-])(?!\\$\\{)`, "g");
// Template-literal names: --v-size-${size}-height
const DYNAMIC = /var\(\s*(--v-[A-Za-z0-9_-]*(?:\$\{[^}]*\}[A-Za-z0-9_-]*)+)/g;

function readInstalled(path) {
  try {
    return readFileSync(path, "utf-8");
  } catch {
    console.error(`check-css-vars: ${relative(ROOT, path)} is missing (run pnpm install first)`);
    process.exit(1);
  }
}

const defined = new Set();
const collect = (text, re) => {
  for (const m of text.matchAll(re)) defined.add(m[1]);
};

for (const f of ["tokens.generated.css", "tokens.css"]) {
  collect(readInstalled(join(UI_DIST, "theme", f)), DECL);
}
collect(readInstalled(join(UI_DIST, "index.js")), LITERAL);

const files = SCAN_DIRS.flatMap((d) => walk(d));
const texts = new Map(files.map((f) => [f, readFileSync(f, "utf-8")]));
const local = new Map();
for (const [file, text] of texts) {
  const names = new Set();
  for (const m of text.matchAll(DECL)) names.add(m[1]);
  local.set(file, names);
}

const missing = [];
const unchecked = [];
for (const [file, text] of texts) {
  const isDefined = (name) => defined.has(name) || local.get(file).has(name);
  const where = (i) => `${relative(ROOT, file)}:${i + 1}`;
  text.split("\n").forEach((line, i) => {
    for (const m of line.matchAll(USE)) {
      if (!isDefined(m[1])) missing.push(`${where(i)} ${m[1]}`);
    }
    for (const m of line.matchAll(DYNAMIC)) {
      const holes = [...m[1].matchAll(/\$\{([^}]*)\}/g)].map((h) => h[1]);
      if (holes.every((h) => /size/i.test(h))) {
        for (const size of VSIZES) {
          const name = m[1].replace(/\$\{[^}]*\}/g, size);
          if (!isDefined(name)) missing.push(`${where(i)} ${name} (from ${m[1]})`);
        }
      } else {
        unchecked.push(`${where(i)} ${m[1]}`);
      }
    }
  });
}

if (unchecked.length > 0) {
  console.warn("Unchecked dynamic name (warning):");
  for (const line of unchecked) console.warn(`  ${line}`);
}

if (missing.length > 0) {
  console.error("Undefined CSS variables referenced:");
  for (const line of missing) console.error(`  ${line}`);
  process.exit(1);
}
console.log(`check-css-vars: ${defined.size} variables defined, all references resolve`);
