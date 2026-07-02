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
  retries: process.env.CI ? 1 : 0,
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
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
