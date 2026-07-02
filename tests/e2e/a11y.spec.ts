import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// WCAG 2.2 AA automated audit (umbrella project's §6.6 frontend baseline) —
// runs axe-core against the built static export (served by
// `docusaurus serve`, see playwright.config.ts) for the homepage, a docs
// page, and a protocol-spec page, in English and one non-English locale
// (German — a Latin-script locale with a fully materialized translated doc
// tree, per docusaurus-i18n-gotchas), asserting ZERO violations. This is the
// "concrete automated AT tier" layer; aria-snapshot.spec.ts and
// keyboard-nav.spec.ts cover what plain axe rules can't (the actual
// accessibility tree + real keyboard traversal), and a real-screen-reader
// spot-check is out of scope for CI per §6.5/§6.6.

const PAGES = [
  { path: "/", label: "home (en)" },
  { path: "/de", label: "home (de)" },
  { path: "/docs/quickstart", label: "quickstart (en, docs page)" },
  { path: "/de/docs/quickstart", label: "quickstart (de, docs page)" },
  { path: "/docs/protocol/onion-routing", label: "onion-routing (en, protocol page)" },
  { path: "/de/docs/protocol/onion-routing", label: "onion-routing (de, protocol page)" },
];

for (const { path, label } of PAGES) {
  test(`axe: zero WCAG 2.2 AA violations on ${label}`, async ({ page }) => {
    await page.goto(path);
    // Let the page finish hydrating before auditing, so we assess the real
    // DOM users/AT actually get (not a pre-hydration SSR frame).
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
  });
}
