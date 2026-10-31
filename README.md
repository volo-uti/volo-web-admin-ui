# @volo-uti/volo-web-admin-ui

Admin screen parts for React 19, TypeScript and Tailwind CSS 4: the page shell, sidebar, page header, list toolbar and data table. They are built on `@volo-uti/volo-web-ui`, which you install first, so a product has one design system, not two. Developing this repository needs Node 26 or newer.

## Install

The package is published to GitHub Packages. Map the `@volo-uti` scope to it in the product's `.npmrc`, and put a token that can read packages in your user-level `~/.npmrc`. pnpm ignores credentials written in a project `.npmrc`, and GitHub Packages asks for a token even for public packages. In CI, `actions/setup-node` with `registry-url` writes the user-level file from `NODE_AUTH_TOKEN`.

```ini
# the product's .npmrc
@volo-uti:registry=https://npm.pkg.github.com
```

```ini
# ~/.npmrc (a token with read:packages)
//npm.pkg.github.com/:_authToken=<token>
```

pnpm waits `minimumReleaseAge` before it installs a new release. List the scope in the product's `pnpm-workspace.yaml` so releases of these packages install at once:

```yaml
minimumReleaseAgeExclude:
  - "@volo-uti/*"
```

```bash
pnpm add @volo-uti/volo-web-ui @volo-uti/volo-web-admin-ui
```

Peer dependencies: `@volo-uti/volo-web-ui ^0.1` · `react ^19` · `react-dom ^19` · `tailwindcss ^4`.

## Using it in a product

Run the index step below before you plan or write any UI. It is what tells a coding agent which admin parts already exist, so it does not rebuild them.

1. Set up `@volo-uti/volo-web-ui` first (tokens, Tailwind plugin, `VoloProvider`; see its README).
2. Tell Tailwind to scan this package too, next to the `@volo-uti/volo-web-ui` line in the app's global CSS (the path is relative to the CSS file):

   ```css
   @source '../node_modules/@volo-uti/volo-web-admin-ui/dist';
   ```

3. Wrap the admin app in `VAdminProvider` inside `VoloProvider`. It carries the admin texts and the permission check.

   ```tsx
   import { VoloProvider } from "@volo-uti/volo-web-ui";
   import { VAdminProvider } from "@volo-uti/volo-web-admin-ui";

   export function Root({ children }: { children: React.ReactNode }) {
     return (
       <VoloProvider>
         <VAdminProvider
           localeText={{ toolbarSearch: "Find" }}
           can={(permission) => user.can(permission)}
         >
           {children}
         </VAdminProvider>
       </VoloProvider>
     );
   }
   ```

4. Build the layout from the parts. `VSidebar` takes `items` (`{ key, label, href }`, plus optional `icon`, `badge`, `permission` and `children` for one level of groups). `VDataTable` takes `columns` (`{ key, title }`, where `key` is the row field and `title` is the header; also `width`, `alignment`, `sortable` and `render`), the `data` rows, and a `rowKey` (a row field name or a function).

   ```tsx
   import { useState } from "react";
   import { VButton } from "@volo-uti/volo-web-ui";
   import {
     VAdminShell,
     VDataTable,
     VListToolbar,
     VPageHeader,
     VSidebar,
     type VSidebarItem,
   } from "@volo-uti/volo-web-admin-ui";

   const items: VSidebarItem[] = [
     { key: "dashboard", label: "Dashboard", href: "/" },
     { key: "users", label: "Users", href: "/users" },
     { key: "orders", label: "Orders", href: "/orders" },
   ];

   const columns = [
     { key: "name", title: "Name" },
     { key: "email", title: "Email" },
     { key: "role", title: "Role" },
   ];

   const rows = [
     { id: "1", name: "Ada Lovelace", email: "ada@example.com", role: "Admin" },
     { id: "2", name: "Grace Hopper", email: "grace@example.com", role: "Editor" },
   ];

   export function UsersPage() {
     const [q, setQ] = useState("");
     return (
       <VAdminShell
         title="Console"
         sidebar={({ collapsed, setCollapsed }) => (
           <VSidebar
             items={items}
             activeKey="users"
             collapsed={collapsed}
             onCollapsedChange={setCollapsed}
           />
         )}
       >
         <VPageHeader title="Users" actions={<VButton>Invite</VButton>} />
         <VListToolbar search={q} onSearchChange={setQ} />
         <VDataTable columns={columns} data={rows} rowKey="id" selectable />
       </VAdminShell>
     );
   }
   ```

5. Write the component index into `AGENTS.md` so coding agents find the parts, and add `--check` to the product's `check`:

   ```bash
   pnpm exec volo-web-admin-ui-index           # writes the volo-web-admin-ui-index block in ./AGENTS.md
   pnpm exec volo-web-admin-ui-index --check   # exits 1 if the block is missing or stale
   ```

## When something is missing

If a part almost fits, try its props first. If one detail still cannot be done, write only that detail by hand in the product, mark it `// TODO(library: <what is missing>)` with what you tried, and open an issue in this repository. Do not copy or rebuild the whole part. When the package gets the detail, upgrade it and delete the marker. Search for `TODO(library:` to see what is still open.

## What it leaves to the product

- **Authentication and sessions.** `can` only hides UI; the server decides.
- **Data loading.** `VDataTable` takes the rows of the current page and reports page, sort and selection changes.
- **Routing.** `VSidebar` draws plain links; pass `renderLink` to draw them with the router's link component.
- **Design tokens.** A product that uses another token set for its own pages decides which one the admin uses; `@volo-uti/volo-web-admin-ui` reads the `--v-*` variables only.

## Develop

```bash
pnpm install
pnpm storybook         # the component catalog at http://localhost:6006
pnpm test              # vitest (jsdom, jest-axe)
pnpm test:coverage     # coverage threshold 80%
pnpm check             # format, lint, typecheck, test, build and every other gate
pnpm verify            # the same gate in a clean Docker container (needs Docker)
```

Tests run locally, not on a remote CI. The `pre-push` hook runs `pnpm check`, and `pnpm verify` when you push `main` or `develop`. On Windows, use WSL2 and run everything inside it.

Read `AGENTS.md` before changing anything.

## Publishing

Push a tag named `v<version>`, where `<version>` equals `version` in `package.json`. `.github/workflows/publish.yml` then builds the package and publishes it to GitHub Packages with the workflow's own `GITHUB_TOKEN`. It posts the start and the result to Slack when the `SLACK_BOT_TOKEN` secret and the `SLACK_CICD_CHANNEL` variable are set. Tests do not run there: the `pre-push` hook runs `pnpm verify` before the code leaves your machine.

## Contributing

Contributions are welcome. [CONTRIBUTING.md](CONTRIBUTING.md) explains how to set up, run the gate and open a pull request. Everyone taking part is expected to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Security

Please report vulnerabilities privately, as described in [SECURITY.md](SECURITY.md). Do not open a public issue for them.

## Principles

[PRINCIPLES.md](PRINCIPLES.md) lists the principles this repository follows, why, and which tool enforces each one.

## License

[MIT](LICENSE)
