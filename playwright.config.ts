import { defineConfig, devices } from "@playwright/test";

// Playwright config for the a11y/SEO Playwright suite (tests/e2e/*.spec.ts).
// Drives a REAL headless browser against the fully-built static export
// (dist/), served by `docusaurus serve` — the same server/behavior a real
// deploy's CDN-fronted static host approximates (correct per-locale
// directory routing + 404 fallback) — so the suite exercises the exact
// artifact users/crawlers/AT get, not a dev-server approximation.
//
// Run `npm run build` before this suite (see package.json "test:e2e"); CI
// always builds first.
export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  workers: process.env.CI ? 2 : undefined,
  timeout: process.env.CI ? 45_000 : 30_000,
  forbidOnly: !!process.env.CI,
  // Flaky-test management (#489): retry failures in CI before failing the
  // build, so a transient network/timing blip doesn't red the pipeline.
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: "http://127.0.0.1:4319",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npx docusaurus serve --dir dist --port 4319 --no-open",
    url: "http://127.0.0.1:4319",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  projects: [
    // Desktop: the full suite (SEO/hreflang, ARIA tree, keyboard traversal,
    // axe a11y) — these specs assume the desktop navbar layout (Tab walks
    // the inline navbar; the sidebar is always visible, not a slide-over).
    { name: "chromium", use: { ...devices["Desktop Chrome"] }, testIgnore: "**/mobile-*.spec.ts" },
    // Mobile viewport project (umbrella project's §6.5/§6.6 — every modified
    // view is audited at desktop AND mobile widths, incl. the mobile
    // nav/sidebar open state). Pixel 5 is Playwright's standard mobile-Chrome
    // device profile: a real mobile viewport + touch + UA, so this exercises
    // the theme's actual mobile nav breakpoint (Docusaurus's slide-over
    // sidebar activates below 997px) — only the dedicated mobile-*.spec.ts
    // files run here; the desktop-shaped specs above would misfire on a
    // collapsed hamburger navbar.
    { name: "mobile-chromium", use: { ...devices["Pixel 5"] }, testMatch: "**/mobile-*.spec.ts" },
  ],
});
