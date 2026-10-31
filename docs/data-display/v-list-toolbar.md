# VListToolbar

Bar above a list with search, filters and actions.

While rows are selected it shows the selection summary and `bulkActions` instead.

## Examples

### VListToolbar

```tsx
<VListToolbar search={q} onSearchChange={setQ} actions={<VButton>New</VButton>} />
```

## Props

### VListToolbarProps

VListToolbar props; other props go to the root `<div>`.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `search` | `string` | — | no | Search text (controlled); setting it or `onSearchChange` shows the search field. |
| `onSearchChange` | `(search: string) => void` | — | no | Called with the new search text on every edit. |
| `searchPlaceholder` | `string` | `localized "Search"` | no | Placeholder and accessible name of the search field. |
| `filters` | `ReactNode` | — | no | Filter controls next to the search field, such as selects. |
| `actions` | `ReactNode` | — | no | Buttons at the right, such as "New" or "Export". |
| `selectedCount` | `number` | `0` | no | Number of selected rows; above 0 the toolbar shows the selection summary and `bulkActions` instead. |
| `bulkActions` | `ReactNode` | — | no | Buttons that act on the selected rows. |
| `onClearSelection` | `() => void` | — | no | Called when the clear-selection button is pressed; setting it shows that button. |
