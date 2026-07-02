import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Mobile-viewport coverage (umbrella project's §6.5/§6.6 — every view is
// audited at desktop AND mobile widths, including "the theme's mobile
// nav/sidebar open state"). Runs ONLY under the `mobile-chromium` Playwright
// project (see playwright.config.ts testMatch/testIgnore split) — a Pixel 5
// viewport, where Docusaurus's navbar collapses to a hamburger toggle below
// its 997px breakpoint and the sidebar becomes a slide-over panel rather
// than the always-visible desktop sidebar aria-snapshot.spec.ts/
// keyboard-nav.spec.ts assume.

test("mobile hamburger toggle opens the slide-over sidebar with correct aria-expanded state", async ({ page }) => {
  await page.goto("/docs/quickstart");
  await page.waitForLoadState("networkidle");

  const toggle = page.locator(".navbar__toggle");
  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");

  const sidebar = page.locator(".navbar-sidebar");
  await expect(sidebar).toBeVisible();
  // The slide-over exposes the same primary nav links as the desktop navbar,
  // reachable by real navigation (a real <a>, not a mouse-only affordance).
  const links = sidebar.locator("a");
  await expect(links.first()).toBeAttached();

  // The open sidebar carries its own dedicated close button (distinct from
  // the hamburger toggle, which the slide-over panel now visually covers) —
  // use it, matching how a real user/AT closes the panel.
  const closeButton = sidebar.locator(".navbar-sidebar__close");
  await expect(closeButton).toBeVisible();
  await closeButton.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(sidebar).not.toBeVisible();
});

test("axe: zero WCAG 2.2 AA violations on mobile viewport with the sidebar open", async ({ page }) => {
  await page.goto("/docs/quickstart");
  await page.waitForLoadState("networkidle");

  const toggle = page.locator(".navbar__toggle");
  await toggle.click();
  await expect(page.locator(".navbar-sidebar")).toBeVisible();

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();

  if (results.violations.length > 0) {
    const summary = results.violations
      .map(
        (v) =>
          `${v.id} (${v.impact}): ${v.description} — ${v.nodes.length} node(s): ${v.nodes
            .map((n) => n.target.join(" "))
            .join(", ")}`,
      )
      .join("\n");
    throw new Error(`axe found ${results.violations.length} violation(s) with mobile sidebar open:\n${summary}`);
  }
  expect(results.violations).toEqual([]);
});

test("axe: zero WCAG 2.2 AA violations on the homepage at mobile viewport", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});
