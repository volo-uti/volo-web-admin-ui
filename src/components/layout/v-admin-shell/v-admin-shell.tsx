"use client";

import { forwardRef, useCallback, useState, type MouseEvent } from "react";
import {
  cn,
  useControllable,
  VAppBar,
  VDrawer,
  VDrawerClose,
  VDrawerContent,
  VIconButton,
} from "@volo-uti/volo-web-ui";
import { useAdminLocaleText } from "../../../provider/admin-provider";
import { VSidebarMenuContext } from "../v-sidebar/v-sidebar-context";
import type { VAdminShellProps } from "./v-admin-shell.types";

const MAIN_ID = "v-admin-main";

/**
 * Admin page frame: sidebar, top bar and content area.
 *
 * The sidebar collapses to icons on large screens and moves into a menu drawer on small ones.
 *
 * @example
 * <VAdminShell
 *   title="Console"
 *   sidebar={({ collapsed, setCollapsed }) => (
 *     <VSidebar items={items} collapsed={collapsed} onCollapsedChange={setCollapsed} />
 *   )}
 * >
 *   <VPageHeader title="Users" />
 * </VAdminShell>
 */
const VAdminShell = forwardRef<HTMLDivElement, VAdminShellProps>((props, ref) => {
  const {
    sidebar,
    title,
    actions,
    collapsed: collapsedProp,
    defaultCollapsed = false,
    onCollapsedChange,
    children,
    className,
    ...rest
  } = props;
  const text = useAdminLocaleText();
  const [collapsed, setCollapsed] = useControllable<boolean>({
    value: collapsedProp,
    defaultValue: defaultCollapsed,
    onChange: onCollapsedChange,
  });
  const [menuOpen, setMenuOpen] = useState(false);

  const render = (mobile: boolean) =>
    typeof sidebar === "function"
      ? sidebar({ collapsed: mobile ? false : collapsed, setCollapsed, mobile })
      : sidebar;

  // A pressed sidebar entry inside the mobile menu closes it.
  // A click that does not navigate here (prevented, modified, or not the main button) keeps it open.
  const closeOnEntry = useCallback((event: MouseEvent<HTMLDivElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    if ((event.target as HTMLElement).closest("[data-v-sidebar-item]")) setMenuOpen(false);
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "v-admin-shell min-h-screen bg-[var(--v-background)] text-[var(--v-foreground)]",
        className,
      )}
      {...rest}
    >
      <a
        href={`#${MAIN_ID}`}
        className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[var(--v-z-modal)] focus:rounded-[var(--v-radius-md)] focus:bg-[var(--v-background)] focus:p-2"
      >
        {text.shellSkipToContent}
      </a>

      {/* While the modal menu is open, the page behind it is inert: no duplicate landmarks, no stray focus. */}
      <aside
        inert={menuOpen}
        className={cn(
          "fixed inset-y-0 left-0 z-[var(--v-z-fixed)] hidden border-r border-[var(--v-border)] transition-[width] lg:block",
          collapsed ? "w-16" : "w-64",
        )}
      >
        {render(false)}
      </aside>

      <VDrawer open={menuOpen} onOpenChange={setMenuOpen} side="left">
        <VDrawerContent
          width={256}
          className="p-0"
          aria-label={text.shellMenu}
          onClick={closeOnEntry}
        >
          <div className="flex justify-end p-[var(--v-spacing-xs)]">
            <VDrawerClose aria-label={text.shellCloseMenu}>
              <span aria-hidden="true">✕</span>
            </VDrawerClose>
          </div>
          <div className="min-h-0 flex-1">
            <VSidebarMenuContext value>{render(true)}</VSidebarMenuContext>
          </div>
        </VDrawerContent>
      </VDrawer>

      <div
        inert={menuOpen}
        className={cn("transition-[padding]", collapsed ? "lg:pl-16" : "lg:pl-64")}
      >
        <VAppBar
          sticky
          className="border-b border-[var(--v-border)]"
          leading={
            <VIconButton
              aria-label={text.shellOpenMenu}
              variant="default"
              className="lg:hidden"
              onClick={() => setMenuOpen(true)}
            >
              <span aria-hidden="true">☰</span>
            </VIconButton>
          }
          title={<span className="block truncate text-lg font-semibold">{title}</span>}
          actions={actions}
        />
        <main id={MAIN_ID} tabIndex={-1} className="p-[var(--v-spacing-lg)] outline-none">
          {children}
        </main>
      </div>
    </div>
  );
});

VAdminShell.displayName = "VAdminShell";
export { VAdminShell };
