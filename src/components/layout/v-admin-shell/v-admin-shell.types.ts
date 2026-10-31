import type { HTMLAttributes, ReactNode } from "react";

/** What VAdminShell hands to a `sidebar` render function. */
export interface VAdminShellSidebarState {
  /** Whether the desktop sidebar shows only icons; always false inside the mobile menu. */
  collapsed: boolean;
  /** Sets the collapsed state; pass it to `VSidebar`'s `onCollapsedChange`. */
  setCollapsed: (collapsed: boolean) => void;
  /** True while the sidebar is drawn inside the mobile menu. */
  mobile: boolean;
}

/** VAdminShell props; other props go to the root `<div>`. */
export interface VAdminShellProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** The sidebar, usually a VSidebar; a function gets the collapsed state and the mobile flag. */
  sidebar: ReactNode | ((state: VAdminShellSidebarState) => ReactNode);
  /** Text or node at the left of the top bar, such as the section name. */
  title?: ReactNode;
  /** Elements at the right of the top bar, such as a user menu. */
  actions?: ReactNode;
  /** Sidebar is icon-only (controlled). */
  collapsed?: boolean;
  /**
   * Sidebar is icon-only at first (uncontrolled).
   * @default false
   */
  defaultCollapsed?: boolean;
  /** Called with the next collapsed state. */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** The page content. */
  children?: ReactNode;
}
