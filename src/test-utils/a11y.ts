import { axe, toHaveNoViolations } from "jest-axe";
import type { RunOptions } from "axe-core";
import { expect } from "vitest";

expect.extend(toHaveNoViolations);

/**
 * Default axe-core options: enables the WCAG 2.2 AA rules.
 *
 * axe-core 4.x includes the WCAG 2.2 rules;
 * the tag filter turns on wcag2a, wcag2aa, wcag21a, wcag21aa and wcag22aa.
 */
const defaultRunOptions: RunOptions = {
  runOnly: {
    type: "tag",
    values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"],
  },
};

/**
 * axe-core accessibility check helper.
 * Takes a container and checks it for accessibility violations.
 *
 * Applies WCAG 2.2 AA by default; extra options can be passed.
 *
 * @param container - HTML element to check
 * @param options - axe-core RunOptions (optional); defaults to WCAG 2.2 AA
 *
 * @example
 * // Default use (WCAG 2.2 AA)
 * await axeTest(container)
 *
 * // Turn off a specific rule
 * await axeTest(container, { rules: { 'color-contrast': { enabled: false } } })
 */
async function axeTest(container: HTMLElement, options?: RunOptions) {
  const mergedOptions: RunOptions = options
    ? { ...defaultRunOptions, ...options }
    : defaultRunOptions;

  const results = await axe(container, mergedOptions);
  expect(results).toHaveNoViolations();
}

export { axeTest };
