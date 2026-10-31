/**
 * Text strings of the admin parts.
 *
 * Override individual keys via VAdminProvider's localeText prop.
 * All values default to English.
 */
export interface VoloAdminLocaleText {
  // ── VAdminShell ─────────────────────────────────
  /** Link that jumps past the navigation. @default 'Skip to content' */
  shellSkipToContent: string;
  /** Aria-label of the button that opens the navigation on small screens. @default 'Open menu' */
  shellOpenMenu: string;
  /** Aria-label of the button that closes the navigation on small screens. @default 'Close menu' */
  shellCloseMenu: string;
  /** Accessible name of the navigation menu on small screens. @default 'Menu' */
  shellMenu: string;

  // ── VSidebar ────────────────────────────────────
  /** Aria-label of the navigation landmark. @default 'Main navigation' */
  sidebarLabel: string;
  /** Aria-label of the collapse button. @default 'Collapse sidebar' */
  sidebarCollapse: string;
  /** Aria-label of the expand button. @default 'Expand sidebar' */
  sidebarExpand: string;

  // ── VListToolbar ────────────────────────────────
  /** Placeholder and aria-label of the search field. @default 'Search' */
  toolbarSearch: string;
  /** Selection summary. @default (count) => `${count} selected` */
  toolbarSelected: (count: number) => string;
  /** Label of the button that clears the selection. @default 'Clear selection' */
  toolbarClearSelection: string;

  // ── VDataTable ──────────────────────────────────
  /** Aria-label of the header checkbox that selects every row. @default 'Select all rows' */
  dataTableSelectAll: string;
  /** Aria-label of a row checkbox. @default 'Select row' */
  dataTableSelectRow: string;
  /** Message shown when loading rows failed. @default 'Could not load the data' */
  dataTableError: string;
  /** Label of the button that loads the rows again. @default 'Try again' */
  dataTableRetry: string;
  /** Status message announced while rows load. @default 'Loading' */
  dataTableLoading: string;
}

/** English text, used when no localeText is provided. */
export const defaultAdminLocaleText: VoloAdminLocaleText = {
  shellSkipToContent: "Skip to content",
  shellOpenMenu: "Open menu",
  shellCloseMenu: "Close menu",
  shellMenu: "Menu",
  sidebarLabel: "Main navigation",
  sidebarCollapse: "Collapse sidebar",
  sidebarExpand: "Expand sidebar",
  toolbarSearch: "Search",
  toolbarSelected: (count) => `${count} selected`,
  toolbarClearSelection: "Clear selection",
  dataTableSelectAll: "Select all rows",
  dataTableSelectRow: "Select row",
  dataTableError: "Could not load the data",
  dataTableRetry: "Try again",
  dataTableLoading: "Loading",
};
