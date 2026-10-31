// Checks that the built index bundles start with the "use client" directive.
import { readFileSync } from "node:fs";
import { join } from "node:path";

const directive = /^(["'])use client\1;?\s*\n/;
const failures = [];

const read = (dist, file) => {
  try {
    return readFileSync(join(dist, file), "utf8");
  } catch {
    failures.push(`${file}: missing (run pnpm build first)`);
    return null;
  }
};

const dist = join(process.cwd(), "dist");
for (const file of ["index.js", "index.cjs"]) {
  const text = read(dist, file);
  if (text !== null && !directive.test(text)) {
    failures.push(`dist/${file}: first line is not "use client"`);
  }
}

if (failures.length > 0) {
  console.error(`check:dist failed\n${failures.map((f) => `  ${f}`).join("\n")}`);
  process.exit(1);
}
console.log("check:dist: ok");
