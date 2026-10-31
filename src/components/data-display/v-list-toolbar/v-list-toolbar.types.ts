import type { HTMLAttributes, ReactNode } from "react";

/** VListToolbar props; other props go to the root `<div>`. */
export interface VListToolbarProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Search text (controlled); setting it or `onSearchChange` shows the search field. */
  search?: string;
  /** Called with the new search text on every edit. */
  onSearchChange?: (search: string) => void;
  /**
   * Placeholder and accessible name of the search field.
   * @default localized "Search"
   */
  searchPlaceholder?: string;
  /** Filter controls next to the search field, such as selects. */
  filters?: ReactNode;
  /** Buttons at the right, such as "New" or "Export". */
  actions?: ReactNode;
  /**
   * Number of selected rows; above 0 the toolbar shows the selection summary and `bulkActions` instead.
   * @default 0
   */
  selectedCount?: number;
  /** Buttons that act on the selected rows. */
  bulkActions?: ReactNode;
  /** Called when the clear-selection button is pressed; setting it shows that button. */
  onClearSelection?: () => void;
}
