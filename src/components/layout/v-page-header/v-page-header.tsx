"use client";

import { forwardRef } from "react";
import { cn } from "@volo-uti/volo-web-ui";
import type { VPageHeaderProps } from "./v-page-header.types";

/**
 * Page heading with breadcrumb, title, description and action slots.
 *
 * @example
 * <VPageHeader title="Users" description="People who can sign in" actions={<VButton>Invite</VButton>} />
 */
const VPageHeader = forwardRef<HTMLElement, VPageHeaderProps>((props, ref) => {
  const { title, description, breadcrumb, actions, className, ...rest } = props;
  return (
    <header
      ref={ref}
      className={cn(
        "v-page-header mb-[var(--v-spacing-lg)] space-y-[var(--v-spacing-xs)]",
        className,
      )}
      {...rest}
    >
      {breadcrumb}
      <div className="flex flex-wrap items-center justify-between gap-[var(--v-spacing-md)]">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-[var(--v-foreground)]">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-[var(--v-muted-foreground)]">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-[var(--v-spacing-sm)]">{actions}</div>}
      </div>
    </header>
  );
});

VPageHeader.displayName = "VPageHeader";
export { VPageHeader };
