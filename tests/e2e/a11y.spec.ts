import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// WCAG 2.2 AA automated audit (umbrella project's §6.6 frontend baseline) —
// runs axe-core against the built static export (served by
// `docusaurus serve`, see playwright.config.ts) for the homepage, a docs
// (usage) page, a protocol-spec page, and a deep (3-level-nested) doc page,
// in English and one non-English locale (German — a Latin-script locale with
// a fully materialized translated doc tree, per
// docusaurus-i18n-gotchas), asserting ZERO violations. This is the
// "concrete automated AT tier" layer; aria-snapshot.spec.ts and
// keyboard-nav.spec.ts cover what plain axe rules can't (the actual
// accessibility tree + real keyboard traversal), mobile-nav.spec.ts covers
// the mobile nav/sidebar open state at a mobile viewport, and a
// real-screen-reader spot-check is out of scope for CI per §6.5/§6.6.

const PAGES = [
  { path: "/", label: "home (en)" },
  { path: "/de", label: "home (de)" },
  { path: "/docs/quickstart", label: "quickstart (en, docs page)" },
  { path: "/de/docs/quickstart", label: "quickstart (de, docs page)" },
  { path: "/docs/protocol/onion-routing", label: "onion-routing (en, protocol page)" },
  { path: "/de/docs/protocol/onion-routing", label: "onion-routing (de, protocol page)" },
  // Deep doc: 3 levels of nesting (docs/digstore/format/store-structure.md).
  { path: "/docs/digstore/format/store-structure", label: "store-structure (en, deep doc)" },
  { path: "/de/docs/digstore/format/store-structure", label: "store-structure (de, deep doc)" },
];

async function runAxe(page: Page, label: string) {
  await page.waitForLoadState("networkidle");
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
    throw new Error(`axe found ${results.violations.length} violation(s) on ${label}:\n${summary}`);
  }
  expect(results.violations).toEqual([]);
}

for (const { path, label } of PAGES) {
  test(`axe: zero WCAG 2.2 AA violations on ${label}`, async ({ page }) => {
    await page.goto(path);
    // Let the page finish hydrating before auditing, so we assess the real
    // DOM users/AT actually get (not a pre-hydration SSR frame).
    await runAxe(page, label);
  });
}

// Dark/light mode: colorMode.defaultMode is "dark" (docusaurus.config.ts)
// but respectPrefersColorScheme:true means the ACTUAL initial theme tracks
// the browser's emulated `prefers-color-scheme`, not the configured default
// (verified: Playwright's default browser context reports
// prefers-color-scheme: light, so these pages actually render in light mode
// out of the box under test, and the navbar toggle's click handler flips to
// the OPPOSITE of whatever theme is currently active — it does not
// unconditionally set "light"). To get deterministic, real coverage of BOTH
// themes regardless of the runner's default, force `colorScheme` per
// browser context explicitly, then use the real navbar control to flip to
// the other theme and assert zero new violations there too.
for (const path of ["/", "/docs/quickstart"]) {
  for (const startScheme of ["light", "dark"] as const) {
    const otherScheme = startScheme === "dark" ? "light" : "dark";
    test(`axe: zero WCAG 2.2 AA violations on ${path} after switching from ${startScheme} to ${otherScheme} mode`, async ({
      browser,
    }) => {
      const context = await browser.newContext({ colorScheme: startScheme });
      const page = await context.newPage();
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      await expect(page.locator("html")).toHaveAttribute("data-theme", startScheme);

      const colorModeToggle = page.locator('button[title*="Switch between dark and light mode"]');
      await colorModeToggle.click();
      await expect(page.locator("html")).toHaveAttribute("data-theme", otherScheme);

      await runAxe(page, `${path} (${otherScheme} mode)`);
      await context.close();
    });
  }
}
