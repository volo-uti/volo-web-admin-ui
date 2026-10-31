# provider/admin-provider

## VAdminProvider

Provides admin text overrides and the permission check to the admin parts.

A nested provider inherits the text and the check of the one around it.

## useAdminLocaleText

Returns the resolved admin text.

## useCan

Returns the permission check given to VAdminProvider; it allows everything without one.

## VAccess

Renders its children only when the permission check allows `permission`.

## Examples

### VAdminProvider

```tsx
<VAdminProvider localeText={{ toolbarSearch: "Find" }} can={(p) => user.permissions.includes(p)}>
  <App />
</VAdminProvider>
```

### useAdminLocaleText

```tsx
const { sidebarLabel } = useAdminLocaleText()
```

### useCan

```tsx
const can = useCan()
if (can('users.delete')) { ... }
```

### VAccess

```tsx
<VAccess permission="users.delete"><VButton>Delete</VButton></VAccess>
```

## Props

### VAdminProviderProps

Props of VAdminProvider.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `localeText` | `Partial<VoloAdminLocaleText>` | `the text of the enclosing VAdminProvider, or the English defaults` | no | Text entries that replace the defaults; entries set to `undefined` are ignored. |
| `can` | `VCan` | `the check of the enclosing VAdminProvider, or allows everything` | no | Answers permission questions for `VAccess` and `useCan`; it hides UI only, so enforce rules on the server. A new function on every render makes every consumer render again, so memoize it. |
| `children` | `ReactNode` | — | yes | The subtree that reads the admin context. |

### VAccessProps

Props of VAccess.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `permission` | `string` | — | yes | Permission name passed to the check. |
| `fallback` | `ReactNode` | — | no | Shown instead of the children when access is denied. |
| `children` | `ReactNode` | — | yes | Content shown only when access is allowed. |

## Types

### VCan

Decides whether the current user may see or use something named by `permission`.

```ts
type VCan = (permission: string) => boolean;
```
