import type { HTMLAttributes, ReactNode } from "react";

/** One entry of a VSidebar; an entry with `children` becomes a group heading. */
export interface VSidebarItem {
  /** Stable identifier; `activeKey` and React keys use it. */
  key: string;
  /** Visible text; it stays as the accessible name when the sidebar is collapsed. */
  label: string;
  /** Icon before the label; a collapsed sidebar shows only the icon. */
  icon?: ReactNode;
  /** Link target; without it the entry renders as a `<button>` and reports through `onItemSelect`. */
  href?: string;
  /** Element after the label, such as a count badge. */
  badge?: ReactNode;
  /** Entries under a group heading; one level of nesting. */
  children?: VSidebarItem[];
  /** Permission name; the entry is hidden when the admin permission check denies it. */
  permission?: string;
}

/** Props handed to `renderLink` for one link entry. */
export interface VSidebarLinkProps {
  /** Class names to put on the link element. */
  className: string;
  /** Icon, label and badge of the entry. */
  children: ReactNode;
  /** `"page"` on the active entry. */
  "aria-current"?: "page";
  /** Marks the element as a sidebar entry; keep it so the shell can close the mobile menu. */
  "data-v-sidebar-item": "";
}

/** VSidebar props; other props go to the `<nav>`. */
export interface VSidebarProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** Entries to show, top to bottom. */
  items: VSidebarItem[];
  /** `key` of the active entry. */
  activeKey?: string;
  /** Area above the entries, such as the product name. */
  header?: ReactNode;
  /** Area below the entries, such as the signed-in user. */
  footer?: ReactNode;
  /**
   * Shows only the icons.
   * @default false
   */
  collapsed?: boolean;
  /** Called with the next collapsed state; setting it shows the collapse button. */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Called when an entry without `href` is pressed. */
  onItemSelect?: (item: VSidebarItem) => void;
  /**
   * Draws a link entry yourself, for example with the router's link component.
   * @default a plain `<a href>`
   */
  renderLink?: (item: VSidebarItem, props: VSidebarLinkProps) => ReactNode;
}
