# VAdminShell

Admin page frame: sidebar, top bar and content area.

The sidebar collapses to icons on large screens and moves into a menu drawer on small ones.

## Examples

### VAdminShell

```tsx
<VAdminShell
  title="Console"
  sidebar={({ collapsed, setCollapsed }) => (
    <VSidebar items={items} collapsed={collapsed} onCollapsedChange={setCollapsed} />
  )}
>
  <VPageHeader title="Users" />
</VAdminShell>
```

## Props

### VAdminShellProps

VAdminShell props; other props go to the root `<div>`.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `sidebar` | `ReactNode \| ((state: VAdminShellSidebarState) => ReactNode)` | — | yes | The sidebar, usually a VSidebar; a function gets the collapsed state and the mobile flag. |
| `title` | `ReactNode` | — | no | Text or node at the left of the top bar, such as the section name. |
| `actions` | `ReactNode` | — | no | Elements at the right of the top bar, such as a user menu. |
| `collapsed` | `boolean` | — | no | Sidebar is icon-only (controlled). |
| `defaultCollapsed` | `boolean` | `false` | no | Sidebar is icon-only at first (uncontrolled). |
| `onCollapsedChange` | `(collapsed: boolean) => void` | — | no | Called with the next collapsed state. |
| `children` | `ReactNode` | — | no | The page content. |

## Types

### VAdminShellSidebarState

What VAdminShell hands to a `sidebar` render function.

| Member | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `collapsed` | `boolean` | — | yes | Whether the desktop sidebar shows only icons; always false inside the mobile menu. |
| `setCollapsed` | `(collapsed: boolean) => void` | — | yes | Sets the collapsed state; pass it to `VSidebar`'s `onCollapsedChange`. |
| `mobile` | `boolean` | — | yes | True while the sidebar is drawn inside the mobile menu. |
