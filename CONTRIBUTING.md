# Contributing

Thank you for helping improve this repository. The repository root is one package, `@volo-uti/volo-web-admin-ui` (admin screen parts built on `@volo-uti/volo-web-ui`). `@volo-uti/volo-web-ui` is installed from npm; it is not part of this repository.

By taking part you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md). The ideas behind the choices made here are in [PRINCIPLES.md](PRINCIPLES.md).

## Setup

1. Install the Node version in `.nvmrc` (for example with `nvm use`).
2. Install the pnpm version named by `packageManager` in the root `package.json`. pnpm picks it up automatically.
3. Install dependencies:

   ```bash
   pnpm install
   ```

Tool and dependency versions live in the manifests (`.nvmrc`, `package.json`, `pnpm-workspace.yaml`) and nowhere else, so always read them there.

## The gate

One command decides whether a change is ready. Run it before every pull request:

```bash
pnpm check
```

It runs formatting, lint (warnings count as failures), typecheck, the CSS-variable, index and docs checks, tests, the build and a check of the built output. A change is done when `pnpm check` passes. The `pre-push` hook runs it for you, and on `main` and `develop` it runs `pnpm verify`, which runs the same gate in a clean Docker container. On Windows, work inside WSL2.

Other commands you will use:

```bash
pnpm index        # regenerate the agent index and docs/
pnpm storybook    # open the component catalog at http://localhost:6006
```

## Project structure

| Path                       | What it holds                                                                      |
| -------------------------- | ---------------------------------------------------------------------------------- |
| `src/`                     | `@volo-uti/volo-web-admin-ui`: admin screen parts built on `@volo-uti/volo-web-ui` |
| `docs/` · `bin/`           | Per-part docs and the index command that ship with the package                     |
| `stories/` · `.storybook/` | The catalog for people to browse the parts (Storybook)                             |
| `scripts/`                 | Repository checks and generators used by `pnpm check` and `pnpm index`             |
| `AGENTS.md`                | The rules that agents and humans follow, plus a generated index of what exists     |

## Conventions that matter

`AGENTS.md` holds the full rules; the points below are the ones a contributor most often needs.

- Look for an existing part before writing a new one. The generated index at the bottom of `AGENTS.md` lists everything exported; general components live in `@volo-uti/volo-web-ui`.
- Files and folders are `v-` plus kebab-case, components are `V` plus PascalCase, and CSS variables use the `--v-` prefix.
- Every export has a JSDoc comment. Its first sentence (at most 90 characters) becomes the index line and the generated docs. `check:index` and `check:docs` fail without it.
- Do not edit generated files by hand: the block between the `BEGIN`/`END` markers in `AGENTS.md` and `docs/` inside the package. Run `pnpm index` instead.
- Use only CSS variables that `@volo-uti/volo-web-ui` defines. `check:css-vars` enforces it.
- Do not add external UI libraries. Parts are built from React, Tailwind CSS and `@volo-uti/volo-web-ui`, and class names are merged with `cn()`.
- Put text in `localeText` through `useAdminLocaleText` instead of hard-coding strings in components.
- Write tests next to the source as `*.test.tsx` using vitest, Testing Library and jest-axe.
- Stories do not hand-write `argTypes`; the catalog reads them from types and JSDoc.
- The catalog app may not use the native elements that `@volo-uti/volo-web-ui/eslint` lists; use the `@volo-uti/volo-web-ui` component.
- Code style is set by Prettier and ESLint. `pnpm fmt` fixes formatting. The `.editorconfig` file covers the rest.

Skills for common tasks (adding a component, updating dependencies) are in `.agents/skills/`.

## Pull requests

1. Fork the repository and create a branch from the default branch.
2. Make one focused change.
3. Run `pnpm check` and make sure it passes with zero warnings.
4. Commit with [Conventional Commits](https://www.conventionalcommits.org/) in English, for example `feat(admin-ui): add VStatCard` or `fix(admin-ui): keep the sidebar focus`.
5. Open a pull request and fill in the template. Explain what changed and why.

Documentation, code comments and commit messages are written in English.

## Reporting bugs and requesting features

Use the issue forms: choose **Bug report** or **Feature request** under the Issues tab. Include the package version, what you expected, what happened, and the smallest example that shows it.

Do not report security problems in public issues. Follow [SECURITY.md](SECURITY.md) instead.
