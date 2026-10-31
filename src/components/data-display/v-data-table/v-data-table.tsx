"use client";

import { VAlert, VButton, VCheckbox, VPagination, VSkeleton, VTable } from "@volo-uti/volo-web-ui";
import type { VTableColumn } from "@volo-uti/volo-web-ui";
import { useAdminLocaleText } from "../../../provider/admin-provider";
import type { VDataTableProps } from "./v-data-table.types";

const PLACEHOLDER_ROWS = 5;
const NO_KEYS: string[] = [];

/**
 * Data table with row selection, loading and error states and pagination on top of VTable.
 *
 * @example
 * <VDataTable
 *   columns={[{ key: 'name', title: 'Name' }]}
 *   data={rows}
 *   rowKey="id"
 *   selectable
 *   selectedKeys={keys}
 *   onSelectedKeysChange={setKeys}
 *   page={page}
 *   pageCount={9}
 *   onPageChange={setPage}
 * />
 */
function VDataTable<T extends object = Record<string, unknown>>(props: VDataTableProps<T>) {
  const {
    columns,
    data,
    rowKey,
    loading = false,
    error,
    onRetry,
    selectable = false,
    selectedKeys = NO_KEYS,
    onSelectedKeysChange,
    page,
    pageCount,
    onPageChange,
    ...tableProps
  } = props;
  const text = useAdminLocaleText();

  // A row without the key field falls back to its index instead of sharing one key with every other such row.
  const keyOf = (row: T, index: number) =>
    typeof rowKey === "function"
      ? rowKey(row, index)
      : String((row as Record<string, unknown>)[rowKey] ?? index);

  const pageKeys = data.map((row, index) => keyOf(row, index));
  const selectedOnPage = pageKeys.filter((key) => selectedKeys.includes(key));
  const allSelected = pageKeys.length > 0 && selectedOnPage.length === pageKeys.length;

  const toggleAll = (checked: boolean) => {
    const rest = selectedKeys.filter((key) => !pageKeys.includes(key));
    onSelectedKeysChange?.(checked ? [...rest, ...pageKeys] : rest);
  };
  const toggleRow = (key: string, checked: boolean) =>
    onSelectedKeysChange?.(
      checked ? [...selectedKeys, key] : selectedKeys.filter((selected) => selected !== key),
    );

  // Rebuilt on every render on purpose: the closures read the latest callbacks, keys and `rowKey`.
  const selectColumn: VTableColumn<T> = {
    key: "__select",
    width: 48,
    title: (
      <VCheckbox
        aria-label={text.dataTableSelectAll}
        checked={allSelected}
        indeterminate={selectedOnPage.length > 0 && !allSelected}
        onCheckedChange={toggleAll}
      />
    ),
    render: (_value, row, index) => {
      const key = keyOf(row, index);
      return (
        <VCheckbox
          aria-label={text.dataTableSelectRow}
          checked={selectedKeys.includes(key)}
          onCheckedChange={(checked) => toggleRow(key, checked)}
        />
      );
    },
  };
  const allColumns: VTableColumn<T>[] = selectable ? [selectColumn, ...columns] : columns;

  if (error) {
    return (
      <VAlert
        severity="error"
        action={
          onRetry && (
            <VButton variant="text" onClick={onRetry}>
              {text.dataTableRetry}
            </VButton>
          )
        }
      >
        {error === true ? text.dataTableError : error}
      </VAlert>
    );
  }

  return (
    <div className="v-data-table space-y-[var(--v-spacing-md)]" aria-busy={loading || undefined}>
      {loading ? (
        <div role="status" className="space-y-[var(--v-spacing-sm)]">
          <span className="sr-only">{text.dataTableLoading}</span>
          {Array.from({ length: PLACEHOLDER_ROWS }, (_, index) => (
            <VSkeleton key={index} variant="rectangular" height={40} />
          ))}
        </div>
      ) : (
        <VTable<T> {...tableProps} columns={allColumns} data={data} rowKey={keyOf} />
      )}
      {pageCount !== undefined && pageCount > 1 && (
        <div className="flex justify-end">
          <VPagination totalPages={pageCount} value={page} onValueChange={onPageChange} />
        </div>
      )}
    </div>
  );
}

VDataTable.displayName = "VDataTable";
export { VDataTable };
