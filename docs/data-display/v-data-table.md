# VDataTable

Data table with row selection, loading and error states and pagination on top of VTable.

## Examples

### VDataTable

```tsx
<VDataTable
  columns={[{ key: 'name', title: 'Name' }]}
  data={rows}
  rowKey="id"
  selectable
  selectedKeys={keys}
  onSelectedKeysChange={setKeys}
  page={page}
  pageCount={9}
  onPageChange={setPage}
/>
```

## Props

### VDataTableProps

VDataTable props; table look props (`dense`, `striped`, `hoverable`, `stickyHeader`, sorting) go to the VTable.

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `columns` | `VTableColumn<T>[]` | — | yes | Column definitions. |
| `data` | `T[]` | — | yes | Rows of the current page. |
| `rowKey` | `string \| ((row: T, index: number) => string)` | — | yes | Row field name, or a function, that gives each row a stable key; selection stores these keys. |
| `loading` | `boolean` | `false` | no | Shows placeholder rows instead of the data. |
| `error` | `boolean \| ReactNode` | — | no | Shown instead of the table when loading failed; `true` shows the localized message. |
| `onRetry` | `() => void` | — | no | Called when the retry button of the error state is pressed; setting it shows that button. |
| `selectable` | `boolean` | `false` | no | Adds a checkbox column. |
| `selectedKeys` | `string[]` | — | no | Keys of the selected rows (controlled). |
| `onSelectedKeysChange` | `(keys: string[]) => void` | — | no | Called with the next selected keys. |
| `page` | `number` | — | no | Current page, 1-based; the pagination shows when `pageCount` is above 1. |
| `pageCount` | `number` | — | no | Total number of pages. |
| `onPageChange` | `(page: number) => void` | — | no | Called with the new 1-based page. |
