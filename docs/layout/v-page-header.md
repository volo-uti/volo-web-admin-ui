# VPageHeader

Page heading with breadcrumb, title, description and action slots.

## Examples

### VPageHeader

```tsx
<VPageHeader title="Users" description="People who can sign in" actions={<VButton>Invite</VButton>} />
```

## Props

### VPageHeaderProps

VPageHeader props; other props go to the `<header>`.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `ReactNode` | — | yes | Page title, drawn as the page's `<h1>`. |
| `description` | `ReactNode` | — | no | Line under the title. |
| `breadcrumb` | `ReactNode` | — | no | Path above the title, usually a VBreadcrumb. |
| `actions` | `ReactNode` | — | no | Buttons at the right of the title. |
