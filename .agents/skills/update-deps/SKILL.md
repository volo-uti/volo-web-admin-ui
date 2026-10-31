---
name: update-deps
description: "Updates dependencies: finds outdated packages, raises them, keeps the ranges promised to consumers, confirms with the gate, then reports what was raised and what is blocked. Use for the monthly check or whenever dependencies are updated."
---

# Update dependencies

1. Run `pnpm outdated` to list outdated dependencies.
2. Raise them. If Node or pnpm moved, also fix `.nvmrc` and `packageManager` in `package.json`.
3. Do not raise the lower bound of a range promised to consumers (`peerDependencies`, `engines`) before the consumers themselves have moved up. The `@volo-uti/volo-web-ui` devDependency follows the newest `@volo-uti/volo-web-ui` release; raise the `@volo-uti/volo-web-ui` peer range only when a part needs an API from that release.
4. Run `pnpm install`, then `pnpm check`. Revert only the package that breaks the gate and note it as blocked.
5. Report: **raised** (name, old to new version) and **blocked** (name, error).
