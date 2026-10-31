"use client";

import { forwardRef, type ReactNode } from "react";
import { cn } from "@volo-uti/volo-web-ui";
import { useAdminLocaleText, useCan } from "../../../provider/admin-provider";
import { useInsideMenu } from "./v-sidebar-context";
import type { VSidebarItem, VSidebarLinkProps, VSidebarProps } from "./v-sidebar.types";

const entryStyles =
  "flex w-full items-center gap-[var(--v-spacing-sm)] rounded-[var(--v-radius-md)] px-[var(--v-spacing-sm)] py-[var(--v-spacing-xs)] text-sm text-[var(--v-foreground)] hover:bg-[var(--v-muted)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--v-primary)]";
const activeStyles = "bg-[var(--v-muted)] font-semibold";

/**
 * Side navigation with icon-only collapse, one level of groups and permission-aware entries.
 *
 * @example
 * <VSidebar
 *   items={[{ key: 'users', label: 'Users', href: '/users', icon: <UsersIcon /> }]}
 *   activeKey="users"
 * />
 */
const VSidebar = forwardRef<HTMLElement, VSidebarProps>((props, ref) => {
  const {
    items,
    activeKey,
    header,
    footer,
    collapsed: collapsedProp = false,
    onCollapsedChange: onCollapsedChangeProp,
    onItemSelect,
    renderLink,
    className,
    ...rest
  } = props;
  const text = useAdminLocaleText();
  const can = useCan();
  // In the mobile menu the sidebar is always expanded and its collapse button would change nothing visible.
  const insideMenu = useInsideMenu();
  const collapsed = insideMenu ? false : collapsedProp;
  const onCollapsedChange = insideMenu ? undefined : onCollapsedChangeProp;

  const allowed = (item: VSidebarItem) => !item.permission || can(item.permission);

  const renderEntry = (item: VSidebarItem): ReactNode => {
    const active = item.key === activeKey;
    const content = (
      <>
        <span aria-hidden="true" className="flex w-5 shrink-0 items-center justify-center">
          {item.icon ?? Array.from(item.label)[0]}
        </span>
        <span className={cn("min-w-0 flex-1 truncate text-left", collapsed && "sr-only")}>
          {item.label}
        </span>
        {!collapsed && item.badge}
      </>
    );
    const linkProps: VSidebarLinkProps = {
      className: cn(entryStyles, active && activeStyles),
      children: content,
      "aria-current": active ? "page" : undefined,
      "data-v-sidebar-item": "",
    };
    if (renderLink && item.href !== undefined) return renderLink(item, linkProps);
    if (item.href !== undefined) return <a href={item.href} {...linkProps} />;
    return <button type="button" {...linkProps} onClick={() => onItemSelect?.(item)} />;
  };

  const visible = items.filter(allowed);

  return (
    <nav
      ref={ref}
      aria-label={text.sidebarLabel}
      data-collapsed={collapsed || undefined}
      className={cn(
        "v-sidebar flex h-full min-h-0 flex-col bg-[var(--v-background)] text-[var(--v-foreground)]",
        className,
      )}
      {...rest}
    >
      {header && <div className="shrink-0 p-[var(--v-spacing-sm)]">{header}</div>}
      <ul className="flex-1 list-none space-y-[var(--v-spacing-xs)] overflow-y-auto p-[var(--v-spacing-sm)] m-0">
        {visible.map((item) => {
          const children = item.children?.filter(allowed);
          if (item.children) {
            if (!children || children.length === 0) return null;
            return (
              <li key={item.key}>
                <p
                  className={cn(
                    "px-[var(--v-spacing-sm)] pb-[var(--v-spacing-xs)] pt-[var(--v-spacing-sm)] text-xs font-semibold uppercase text-[var(--v-muted-foreground)]",
                    collapsed && "sr-only",
                  )}
                >
                  {item.label}
                </p>
                <ul className="list-none space-y-[var(--v-spacing-xs)] p-0 m-0">
                  {children.map((child) => (
                    <li key={child.key}>{renderEntry(child)}</li>
                  ))}
                </ul>
              </li>
            );
          }
          return <li key={item.key}>{renderEntry(item)}</li>;
        })}
      </ul>
      {footer && <div className="shrink-0 p-[var(--v-spacing-sm)]">{footer}</div>}
      {onCollapsedChange && (
        <button
          type="button"
          aria-label={collapsed ? text.sidebarExpand : text.sidebarCollapse}
          onClick={() => onCollapsedChange(!collapsed)}
          className={cn(
            entryStyles,
            "justify-center border-t border-[var(--v-border)] rounded-none",
          )}
        >
          <span aria-hidden="true">{collapsed ? "»" : "«"}</span>
        </button>
      )}
    </nav>
  );
});

VSidebar.displayName = "VSidebar";
export { VSidebar };
