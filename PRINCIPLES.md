# Principles

The choices this repository makes, why they were made, and the tool that keeps each one true. A principle without an enforcing tool is a habit we try to keep and cannot prove.

## Latest stable only

Every tool and dependency is its newest stable release; no canary, beta or release candidates. Old pins hide problems until they are expensive. Versions are written once, in the manifests (`package.json`, `pnpm-workspace.yaml`, `.nvmrc`), and prose never repeats them, so they cannot disagree.

Enforced by: `pnpm outdated -r` (the `update-deps` skill runs it) and `pnpm verify`, whose container reads the Node and pnpm versions from the manifests.

## Libraries lead no further than their consumers

The versions we ask consumers to have (`peerDependencies`, `engines`) are never raised ahead of the ecosystem they run in. Raising them early breaks installs for people who did nothing wrong.

Enforced by: the `update-deps` skill's rule on consumer ranges, reviewed in pull requests.

## Rules are kept by tools, not by prose

If a rule can be measured, a script or lint rule measures it and fails the build. If it cannot be measured, we should be able to say what breaks when it is ignored; if we cannot, it does not belong in the docs.

Enforced by: ESLint, TypeScript `strict`, Prettier, and the `check:*` scripts.

## One gate

A single command runs formatting, lint with zero warnings, typecheck, CSS-variable, index and docs checks, tests, the build and a check of the built output. People and agents run it, the `pre-push` hook runs it, so "done" means the same thing to all of them, and its output is the evidence.

Enforced by: `pnpm check`, run by the `pre-push` hook (lefthook) and, for `main` and `develop`, by `pnpm verify` in a clean Docker container.

## What exists must be findable

Duplicated components happen when people cannot find the existing one. Every export carries a JSDoc first sentence; from it a generated index and per-component docs are built. A missing or stale sentence fails the gate.

Enforced by: `pnpm check:index`, `pnpm check:docs`; regenerate with `pnpm index`.

## Do not hand-write what a source already says

API documentation comes from types and JSDoc, not from prose that drifts. Story controls are read from types.

Enforced by: `check:index`, `check:docs`.

## Admin parts stand on the design system, not beside it

Admin screens (shell, sidebar, data table) are a separate package, `@volo-uti/volo-web-admin-ui`, so a product that has no admin does not carry them. The package takes `@volo-uti/volo-web-ui` as a peer dependency and defines no tokens of its own, so there is one set of tokens, one theme and one provider per product. A colour, spacing or radius is a `--v-*` variable that `@volo-uti/volo-web-ui` defines; a variable nobody defined silently renders wrong, so an unknown one is an error. It knows nothing about authentication or the product's data: a permission check is handed in, and the server stays the authority.

Enforced by: `check:css-vars` (every `--v-*` reference must be defined by the installed `@volo-uti/volo-web-ui`), and the `peerDependencies` of `package.json`.

## Build with React, Tailwind and the design system, not another UI kit

Parts are written on React, Tailwind CSS and `@volo-uti/volo-web-ui`, with `cn()` for class merging. No external component library sits underneath, so behavior, accessibility and bundle size stay under our control and consumers inherit no hidden dependency.

Enforced by: code review; the dependency list in `package.json` shows what is allowed in.

## Text belongs to the consumer

Components never hard-code user-facing strings. Text comes from `localeText` through `useAdminLocaleText`, so a product can translate or reword anything.

Enforced by: unit tests and code review.

## Accessible by default

Component tests run an accessibility check along with behavior checks, so an inaccessible component cannot pass quietly. Interactive components support the keyboard and carry the right roles.

Enforced by: `jest-axe` in the tests under `src` (via `axeTest`), run by `pnpm test`.

## Neutral about coding agents

Instructions for coding agents live in `AGENTS.md` and `.agents/skills/`, the files most agents already read. A tool-specific file exists only where a tool cannot read these, and it adds no content of its own: `.claude/skills` is a link to the skills folder and `CLAUDE.md` is a single line importing `AGENTS.md`.

Enforced by: review; the files are small enough to check at a glance.

## Only the final state is kept

Documents and code describe how things are now. History belongs to `git log`, not to changelogs, "formerly" sections or deprecated aliases. When a name changes, the old name is removed.

Enforced by: code review.

## Choices

| Concern             | Choice                                  | Why                                                                                                        |
| ------------------- | --------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Repository layout   | One package at the repository root      | One repository is one published package; the catalog is a tool of it, not a second project                 |
| UI                  | React 19                                | The target of the components; peer dependency for consumers                                                |
| Language            | TypeScript, `strict`                    | Types are the source for generated docs and catalog controls                                               |
| Styling             | Tailwind CSS 4, `--v-*` CSS variables   | The variables come from `@volo-uti/volo-web-ui`, so consumers override them with plain CSS in one place    |
| Bundling            | tsup                                    | ESM and CJS builds with type declarations from one small config                                            |
| Tests               | vitest, Testing Library, jest-axe       | Fast component tests with accessibility checks in the same run                                             |
| Catalog             | Storybook with autodocs                 | A place for people to look at components; controls are read from types, not written by hand                |
| Lint and formatting | ESLint with typescript-eslint, Prettier | The raw-element rule of `@volo-uti/volo-web-ui` is an ESLint rule, so a faster linter could not replace it |
