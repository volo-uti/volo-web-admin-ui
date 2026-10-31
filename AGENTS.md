# volo-web-admin-ui: React admin screen parts

One package, `@volo-uti/volo-web-admin-ui`, at the repository root. React 19, TypeScript (strict), Tailwind CSS 4, Node 26 or newer. It publishes `@volo-uti/volo-web-admin-ui`, which stands on `@volo-uti/volo-web-ui` installed from npm.
Read the rules below and the index at the bottom before changing anything. Do not rebuild a part that already exists here, and do not rebuild a general component that `@volo-uti/volo-web-ui` already has.

| Path                       | What it holds                                                                                                                                    |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/`                     | `@volo-uti/volo-web-admin-ui`: admin screen parts (shell, sidebar, page header, list toolbar, data table) built on `@volo-uti/volo-web-ui` (npm) |
| `docs/` · `bin/`           | Per-part docs and the `volo-web-admin-ui-index` command; both ship with the package (`docs/` is written by `pnpm index`)                         |
| `stories/` · `.storybook/` | The catalog for people to browse (autodocs). A tool of the package, not a separate app; `@volo-uti/volo-web-admin-ui` resolves to `src/` there   |

## Commands

```bash
pnpm check        # the gate: format · lint (0 warnings) · typecheck · check:css-vars · check:index · check:docs · test · build · check:dist
pnpm verify       # the same gate in a clean Docker container (run before pushing main or develop)
pnpm index        # regenerates the index (block below, `docs/index.txt`) and `docs/`
pnpm storybook    # http://localhost:6006
```

## Adding a component

Follow the `add-component` skill for the steps. A part goes in `src/components/<category>/v-x/`. The rules to keep are:

- Files and folders are `v-` + kebab-case, components are `V` + PascalCase, CSS variables use the `--v-` prefix.
- **Every export gets a JSDoc first sentence.** The index and `docs/` are built from it. Without it `check:index` and `check:docs` fail. The first sentence is at most 90 characters up to the period (`check:index` reports longer ones as `file:line name (N chars)`); put details from the second sentence on. The index block is at most 8,000 characters.
- Do not hand-write `argTypes` in stories. Autodocs reads them from types and JSDoc.
- Use only CSS variables that `@volo-uti/volo-web-ui` defines (`check:css-vars` reads them from the installed package).
- Do not lean on external UI libraries (MUI, Radix, and so on). Build with React, Tailwind and the parts of `@volo-uti/volo-web-ui`. Merge classes with `cn()` from `@volo-uti/volo-web-ui`.
- `@volo-uti/volo-web-admin-ui` imports `@volo-uti/volo-web-ui` (a peer dependency) and never the other way round. It adds no tokens, no provider of its own for theme, and no auth, session, API or domain code; a permission check comes in through `VAdminProvider`.
- A general part that any screen needs belongs in `@volo-uti/volo-web-ui`, not here. Add a part here only when just an admin screen needs it.
- Tests sit next to the source as `*.test.tsx` (vitest, testing-library, jest-axe; `renderWithTheme` and `axeTest` from `src/test-utils`).
- The stories may not use the raw elements that `@volo-uti/volo-web-ui/eslint` lists (`<button>` and so on); lint blocks them. Use the `@volo-uti/volo-web-ui` component instead.
- Strings can be changed through `localeText` on `VAdminProvider`. Do not hard-code text in components; use `useAdminLocaleText`.

## Skills

| Task            | Skill           |
| --------------- | --------------- |
| Add a component | `add-component` |
| Update deps     | `update-deps`   |

There is no test CI. The `pre-push` hook (lefthook) runs `pnpm check`, and `pnpm verify` on `main` and `develop`. Remote GitHub Actions only build and deploy.

Skills live in `.agents/skills/` (`.claude/skills` links to it).

## Naming rules (React and Base UI conventions)

| Subject                  | Rule                                                                                           |
| ------------------------ | ---------------------------------------------------------------------------------------------- |
| Disabled                 | `disabled`                                                                                     |
| Value callback           | `onValueChange(value)`                                                                         |
| On/off callback          | `onCheckedChange(checked)`                                                                     |
| Open callback            | `onOpenChange(open)`                                                                           |
| Close callback           | `onClose` (`onOpenChange` if there is an open state)                                           |
| Close on outside press   | `barrierDismissible`                                                                           |
| Position next to trigger | `position: VSide` + `align: VAlign` (screen-corner placement uses the part's `position` union) |
| Selection toggle (chip)  | `selected` + `onSelectedChange(selected)`                                                      |
| `onChange`               | the DOM event as is                                                                            |
| Press                    | `onClick`                                                                                      |
| Content slot             | `ReactNode`                                                                                    |
| On/off value             | `checked`                                                                                      |
| Size                     | `VSize` or a subset of it                                                                      |
| Semantic color           | a `VColor`-family union                                                                        |
| `@deprecated` alias      | do not create one; when you rename, delete the old name                                        |

## Index

The block below is written by `pnpm index`; do not edit it by hand.

<!-- BEGIN:volo-web-admin-ui-index -->

## Index of @volo-uti/volo-web-admin-ui

`pnpm index` builds this from the first JSDoc sentence; do not edit it by hand. Before building an admin screen, find the part here and read its doc. Build the rest from @volo-uti/volo-web-ui. If nothing fits, say what you looked for, then add one. The doc of each entry is `docs/<section>/<name>.md` (`[.]` is the docs folder itself). Subcomponents and types are in each doc.

```text
[data-display]
v-data-table|VDataTable: Data table with row selection, loading and error states and pagination on top of VTable.
v-list-toolbar|VListToolbar: Bar above a list with search, filters and actions.
[layout]
v-admin-shell|VAdminShell: Admin page frame: sidebar, top bar and content area.
v-page-header|VPageHeader: Page heading with breadcrumb, title, description and action slots.
v-sidebar|VSidebar: Side navigation with icon-only collapse, one level of groups and permission-aware entries.
[provider]
admin-locale-text|defaultAdminLocaleText: English text, used when no localeText is provided.
admin-provider|VAdminProvider: Provides admin text overrides and the permission check to the admin parts. useAdminLocaleText: Returns the resolved admin text. useCan: Returns the permission check given to VAdminProvider; it allows everything without one. VAccess: Renders its children only when the permission check allows `permission`.
```

<!-- END:volo-web-admin-ui-index -->
