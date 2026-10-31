import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { defineConfig } from "tsup";

/**
 * Put `"use client";` first in the index bundles: every part is a client part, and without it a
 * Next.js server component that imports `@volo-uti/volo-web-admin-ui` breaks. The bundler drops a banner directive,
 * so it is prepended after the build.
 */
function prependUseClient() {
  for (const file of ["dist/index.js", "dist/index.cjs"]) {
    const path = join(process.cwd(), file);
    const text = readFileSync(path, "utf8");
    if (!text.startsWith('"use client"')) writeFileSync(path, `"use client";\n${text}`);
  }
}

export default defineConfig({
  entry: { index: "src/index.ts" },
  format: ["esm", "cjs"],
  // The declarations read the installed @volo-uti/volo-web-ui.
  dts: { compilerOptions: { noEmit: false } },
  clean: true,
  // The source maps are not shifted by the prepended directive line, so they are not published.
  sourcemap: false,
  treeshake: true,
  external: ["react", "react-dom", "tailwindcss", "@volo-uti/volo-web-ui"],
  esbuildOptions(options) {
    options.jsx = "automatic";
  },
  onSuccess: async () => prependUseClient(),
});
