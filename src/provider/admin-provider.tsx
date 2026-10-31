"use client";

import { useMemo, useState, type ReactNode } from "react";
import { createSafeContext } from "@volo-uti/volo-web-ui";
import { defaultAdminLocaleText, type VoloAdminLocaleText } from "./admin-locale-text";

/** Decides whether the current user may see or use something named by `permission`. */
export type VCan = (permission: string) => boolean;

interface AdminContextValue {
  localeText: VoloAdminLocaleText;
  can: VCan;
}

const allowAll: VCan = () => true;

const [AdminContextProvider, useAdminContext] = createSafeContext<AdminContextValue>("VAdmin", {
  localeText: defaultAdminLocaleText,
  can: allowAll,
});

/** Props of VAdminProvider. */
export interface VAdminProviderProps {
  /**
   * Text entries that replace the defaults; entries set to `undefined` are ignored.
   * @default the text of the enclosing VAdminProvider, or the English defaults
   */
  localeText?: Partial<VoloAdminLocaleText>;
  /**
   * Answers permission questions for `VAccess` and `useCan`; it hides UI only, so enforce rules on the server.
   * A new function on every render makes every consumer render again, so memoize it.
   * @default the check of the enclosing VAdminProvider, or allows everything
   */
  can?: VCan;
  /** The subtree that reads the admin context. */
  children: ReactNode;
}

/** Copies `overrides` over `base`, skipping entries that are `undefined`. */
function mergeLocaleText(
  base: VoloAdminLocaleText,
  overrides: Partial<VoloAdminLocaleText> | undefined,
): VoloAdminLocaleText {
  if (!overrides) return base;
  const merged: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(overrides)) {
    if (value !== undefined) merged[key] = value;
  }
  return merged as unknown as VoloAdminLocaleText;
}

function sameLocaleText(a: VoloAdminLocaleText, b: VoloAdminLocaleText): boolean {
  const keys = Object.keys(b) as (keyof VoloAdminLocaleText)[];
  return keys.length === Object.keys(a).length && keys.every((key) => a[key] === b[key]);
}

/**
 * Provides admin text overrides and the permission check to the admin parts.
 *
 * A nested provider inherits the text and the check of the one around it.
 *
 * @example
 * <VAdminProvider localeText={{ toolbarSearch: "Find" }} can={(p) => user.permissions.includes(p)}>
 *   <App />
 * </VAdminProvider>
 */
export function VAdminProvider({ localeText: overrides, can, children }: VAdminProviderProps) {
  const parent = useAdminContext();
  const merged = mergeLocaleText(parent.localeText, overrides);
  // Keep the same object while the entries are equal, so an inline `localeText` does not re-render consumers.
  const [stable, setStable] = useState(merged);
  const sameAsStable = sameLocaleText(stable, merged);
  if (!sameAsStable) setStable(merged);
  const localeText = sameAsStable ? stable : merged;
  const resolvedCan = can ?? parent.can;
  const value = useMemo<AdminContextValue>(
    () => ({ localeText, can: resolvedCan }),
    [localeText, resolvedCan],
  );
  return <AdminContextProvider value={value}>{children}</AdminContextProvider>;
}

/**
 * Returns the resolved admin text.
 *
 * @example
 * const { sidebarLabel } = useAdminLocaleText()
 */
export function useAdminLocaleText(): VoloAdminLocaleText {
  return useAdminContext().localeText;
}

/**
 * Returns the permission check given to VAdminProvider; it allows everything without one.
 *
 * @example
 * const can = useCan()
 * if (can('users.delete')) { ... }
 */
export function useCan(): VCan {
  return useAdminContext().can;
}

/** Props of VAccess. */
export interface VAccessProps {
  /** Permission name passed to the check. */
  permission: string;
  /** Shown instead of the children when access is denied. */
  fallback?: ReactNode;
  /** Content shown only when access is allowed. */
  children: ReactNode;
}

/**
 * Renders its children only when the permission check allows `permission`.
 *
 * @example
 * <VAccess permission="users.delete"><VButton>Delete</VButton></VAccess>
 */
export function VAccess({ permission, fallback = null, children }: VAccessProps) {
  return useCan()(permission) ? <>{children}</> : <>{fallback}</>;
}
