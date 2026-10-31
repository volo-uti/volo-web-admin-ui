"use client";

import { forwardRef } from "react";
import { cn, VButton, VTextField } from "@volo-uti/volo-web-ui";
import { useAdminLocaleText } from "../../../provider/admin-provider";
import type { VListToolbarProps } from "./v-list-toolbar.types";

/**
 * Bar above a list with search, filters and actions.
 *
 * While rows are selected it shows the selection summary and `bulkActions` instead.
 *
 * @example
 * <VListToolbar search={q} onSearchChange={setQ} actions={<VButton>New</VButton>} />
 */
const VListToolbar = forwardRef<HTMLDivElement, VListToolbarProps>((props, ref) => {
  const {
    search,
    onSearchChange,
    searchPlaceholder,
    filters,
    actions,
    selectedCount = 0,
    bulkActions,
    onClearSelection,
    className,
    ...rest
  } = props;
  const text = useAdminLocaleText();
  const selecting = selectedCount > 0;
  const label = searchPlaceholder ?? text.toolbarSearch;

  return (
    <div
      ref={ref}
      role="toolbar"
      className={cn(
        "v-list-toolbar flex flex-wrap items-center gap-[var(--v-spacing-sm)] pb-[var(--v-spacing-md)]",
        className,
      )}
      {...rest}
    >
      {/* The live region stays mounted so the first selection is announced. */}
      <span role="status" className={cn("text-sm font-medium", !selecting && "sr-only")}>
        {selecting ? text.toolbarSelected(selectedCount) : null}
      </span>
      {selecting && (
        <>
          {bulkActions}
          {onClearSelection && (
            <VButton variant="text" onClick={onClearSelection}>
              {text.toolbarClearSelection}
            </VButton>
          )}
        </>
      )}
      {/* Hidden, not unmounted, while rows are selected: typed search text and filter state survive. */}
      <div hidden={selecting} className={cn(!selecting && "contents")}>
        {(search !== undefined || onSearchChange) && (
          <VTextField
            type="search"
            aria-label={label}
            placeholder={label}
            value={search}
            onValueChange={onSearchChange}
            className="w-64 max-w-full"
          />
        )}
        {filters}
        {actions && (
          <div className="ml-auto flex items-center gap-[var(--v-spacing-sm)]">{actions}</div>
        )}
      </div>
    </div>
  );
});

VListToolbar.displayName = "VListToolbar";
export { VListToolbar };
