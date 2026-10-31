import type { ReactNode } from "react";
import type { VTableColumn, VTableProps } from "@volo-uti/volo-web-ui";

/** VDataTable props; table look props (`dense`, `striped`, `hoverable`, `stickyHeader`, sorting) go to the VTable. */
export interface VDataTableProps<T extends object = Record<string, unknown>> extends Omit<
  VTableProps<T>,
  "columns" | "data" | "rowKey"
> {
  /** Column definitions. */
  columns: VTableColumn<T>[];
  /** Rows of the current page. */
  data: T[];
  /** Row field name, or a function, that gives each row a stable key; selection stores these keys. */
  rowKey: string | ((row: T, index: number) => string);
  /**
   * Shows placeholder rows instead of the data.
   * @default false
   */
  loading?: boolean;
  /** Shown instead of the table when loading failed; `true` shows the localized message. */
  error?: boolean | ReactNode;
  /** Called when the retry button of the error state is pressed; setting it shows that button. */
  onRetry?: () => void;
  /**
   * Adds a checkbox column.
   * @default false
   */
  selectable?: boolean;
  /** Keys of the selected rows (controlled). */
  selectedKeys?: string[];
  /** Called with the next selected keys. */
  onSelectedKeysChange?: (keys: string[]) => void;
  /** Current page, 1-based; the pagination shows when `pageCount` is above 1. */
  page?: number;
  /** Total number of pages. */
  pageCount?: number;
  /** Called with the new 1-based page. */
  onPageChange?: (page: number) => void;
}
