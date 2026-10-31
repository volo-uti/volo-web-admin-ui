import { spawnSync } from "node:child_process";
import { mkdtempSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const scripts = [
  "bin/volo-web-admin-ui-index.mjs",
  "scripts/agent-index.mjs",
  "scripts/component-docs.mjs",
];

describe.each(scripts)("%s", (script) => {
  it("rejects an unknown flag with a usage message and exit code 1, writing nothing", () => {
    // An empty working folder shows whether the script wrote anything.
    const cwd = mkdtempSync(join(tmpdir(), "volo-admin-flags-"));
    const result = spawnSync(process.execPath, [join(root, script), "--chek"], {
      cwd,
      encoding: "utf8",
    });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Usage");
    expect(readdirSync(cwd)).toEqual([]);
  });
});
