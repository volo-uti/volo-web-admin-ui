# provider/admin-locale-text

## defaultAdminLocaleText

English text, used when no localeText is provided.

## Types

### VoloAdminLocaleText

Text strings of the admin parts.

Override individual keys via VAdminProvider's localeText prop.
All values default to English.

| Member | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `shellSkipToContent` | `string` | `'Skip to content'` | yes | Link that jumps past the navigation. |
| `shellOpenMenu` | `string` | `'Open menu'` | yes | Aria-label of the button that opens the navigation on small screens. |
| `shellCloseMenu` | `string` | `'Close menu'` | yes | Aria-label of the button that closes the navigation on small screens. |
| `shellMenu` | `string` | `'Menu'` | yes | Accessible name of the navigation menu on small screens. |
| `sidebarLabel` | `string` | `'Main navigation'` | yes | Aria-label of the navigation landmark. |
| `sidebarCollapse` | `string` | `'Collapse sidebar'` | yes | Aria-label of the collapse button. |
| `sidebarExpand` | `string` | `'Expand sidebar'` | yes | Aria-label of the expand button. |
| `toolbarSearch` | `string` | `'Search'` | yes | Placeholder and aria-label of the search field. |
| `toolbarSelected` | `(count: number) => string` | `(count) => `${count} selected`` | yes | Selection summary. |
| `toolbarClearSelection` | `string` | `'Clear selection'` | yes | Label of the button that clears the selection. |
| `dataTableSelectAll` | `string` | `'Select all rows'` | yes | Aria-label of the header checkbox that selects every row. |
| `dataTableSelectRow` | `string` | `'Select row'` | yes | Aria-label of a row checkbox. |
| `dataTableError` | `string` | `'Could not load the data'` | yes | Message shown when loading rows failed. |
| `dataTableRetry` | `string` | `'Try again'` | yes | Label of the button that loads the rows again. |
| `dataTableLoading` | `string` | `'Loading'` | yes | Status message announced while rows load. |
