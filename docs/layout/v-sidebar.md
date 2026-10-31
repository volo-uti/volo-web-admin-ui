# VSidebar

Side navigation with icon-only collapse, one level of groups and permission-aware entries.

## Examples

### VSidebar

```tsx
<VSidebar
  items={[{ key: 'users', label: 'Users', href: '/users', icon: <UsersIcon /> }]}
  activeKey="users"
/>
```

## Props

### VSidebarLinkProps

Props handed to `renderLink` for one link entry.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `className` | `string` | — | yes | Class names to put on the link element. |
| `children` | `ReactNode` | — | yes | Icon, label and badge of the entry. |
| `aria-current` | `"page"` | — | no | `"page"` on the active entry. |
| `data-v-sidebar-item` | `""` | — | yes | Marks the element as a sidebar entry; keep it so the shell can close the mobile menu. |

### VSidebarProps

VSidebar props; other props go to the `<nav>`.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `VSidebarItem[]` | — | yes | Entries to show, top to bottom. |
| `activeKey` | `string` | — | no | `key` of the active entry. |
| `header` | `ReactNode` | — | no | Area above the entries, such as the product name. |
| `footer` | `ReactNode` | — | no | Area below the entries, such as the signed-in user. |
| `collapsed` | `boolean` | `false` | no | Shows only the icons. |
| `onCollapsedChange` | `(collapsed: boolean) => void` | — | no | Called with the next collapsed state; setting it shows the collapse button. |
| `onItemSelect` | `(item: VSidebarItem) => void` | — | no | Called when an entry without `href` is pressed. |
| `renderLink` | `(item: VSidebarItem, props: VSidebarLinkProps) => ReactNode` | `a plain `<a href>`` | no | Draws a link entry yourself, for example with the router's link component. |

## Types

### VSidebarItem

One entry of a VSidebar; an entry with `children` becomes a group heading.

| Member | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `key` | `string` | — | yes | Stable identifier; `activeKey` and React keys use it. |
| `label` | `string` | — | yes | Visible text; it stays as the accessible name when the sidebar is collapsed. |
| `icon` | `ReactNode` | — | no | Icon before the label; a collapsed sidebar shows only the icon. |
| `href` | `string` | — | no | Link target; without it the entry renders as a `<button>` and reports through `onItemSelect`. |
| `badge` | `ReactNode` | — | no | Element after the label, such as a count badge. |
| `children` | `VSidebarItem[]` | — | no | Entries under a group heading; one level of nesting. |
| `permission` | `string` | — | no | Permission name; the entry is hidden when the admin permission check denies it. |
