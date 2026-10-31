import type { HTMLAttributes, ReactNode } from "react";

/** VPageHeader props; other props go to the `<header>`. */
export interface VPageHeaderProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** Page title, drawn as the page's `<h1>`. */
  title: ReactNode;
  /** Line under the title. */
  description?: ReactNode;
  /** Path above the title, usually a VBreadcrumb. */
  breadcrumb?: ReactNode;
  /** Buttons at the right of the title. */
  actions?: ReactNode;
}
