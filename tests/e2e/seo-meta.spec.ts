import { test, expect } from "@playwright/test";

// SEO/hreflang verification against the LIVE served static build (umbrella
// project's §6.6 frontend baseline). Asserts the contract this task exists
// to guarantee: every page carries a canonical URL, the full 14-locale +
// x-default hreflang set, and complete Open Graph/Twitter tags; every
// locale's sitemap.xml lists that locale's URLs with hreflang annotations;
// robots.txt allows indexing and points at every locale's sitemap.

const LOCALES = [
  "en",
  "zh-CN",
  "zh-TW",
  "ko",
  "ja",
  "ru",
  "es",
  "pt-BR",
  "fr",
  "de",
  "tr",
  "vi",
  "id",
  "hi",
];

test("homepage (en) carries canonical, full hreflang set, and OG/Twitter tags", async ({ page }) => {
  await page.goto("/");

  const canonical = page.locator('link[rel="canonical"]');
  await expect(canonical).toHaveAttribute("href", "https://docs.dig.net/");

  const hreflangLinks = page.locator("link[rel='alternate'][hreflang]");
  await expect(hreflangLinks).toHaveCount(LOCALES.length + 1); // + x-default

  const hreflangValues = await hreflangLinks.evaluateAll((els) =>
    els.map((el) => el.getAttribute("hreflang")),
  );
  for (const locale of LOCALES) {
    expect(hreflangValues).toContain(locale);
  }
  expect(hreflangValues).toContain("x-default");

  await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
  await expect(page.locator('meta[property="og:description"]')).toHaveCount(1);
  await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "index, follow");
});

test("a docs page (de) self-canonicalizes and carries the full hreflang set", async ({ page }) => {
  await page.goto("/de/docs/quickstart");

  const canonical = page.locator('link[rel="canonical"]');
  await expect(canonical).toHaveAttribute("href", "https://docs.dig.net/de/docs/quickstart");

  const hreflangLinks = page.locator("link[rel='alternate'][hreflang]");
  await expect(hreflangLinks).toHaveCount(LOCALES.length + 1);

  // The `de` alternate must point back at this exact page (self-reference is required).
  const deHref = await page.locator("link[rel='alternate'][hreflang='de']").getAttribute("href");
  expect(deHref).toBe("https://docs.dig.net/de/docs/quickstart");

  // x-default must point at the unprefixed English URL.
  const defaultHref = await page.locator("link[rel='alternate'][hreflang='x-default']").getAttribute("href");
  expect(defaultHref).toBe("https://docs.dig.net/docs/quickstart");

  await expect(page.locator("html")).toHaveAttribute("lang", "de");
});

test("404 page is explicitly noindex", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist-xyz");
  expect(response?.status()).toBe(404);
  const robots = page.locator('meta[name="robots"]');
  await expect(robots).toHaveCount(1);
  await expect(robots).toHaveAttribute("content", "noindex, follow");
});

test("robots.txt allows indexing and lists every locale's sitemap", async ({ request }) => {
  const response = await request.get("/robots.txt");
  expect(response.ok()).toBeTruthy();
  const body = await response.text();
  expect(body).toContain("Allow: /");
  for (const locale of LOCALES) {
    const path = locale === "en" ? "/sitemap.xml" : `/${locale}/sitemap.xml`;
    expect(body).toContain(`https://docs.dig.net${path}`);
  }
});

test("every locale serves a sitemap.xml with hreflang-annotated URLs", async ({ request }) => {
  for (const locale of LOCALES) {
    const path = locale === "en" ? "/sitemap.xml" : `/${locale}/sitemap.xml`;
    const response = await request.get(path);
    expect(response.ok(), `${path} should be reachable`).toBeTruthy();
    const body = await response.text();
    expect(body).toContain("<urlset");
    expect(body).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"');
    expect(body).toContain("<xhtml:link");
    expect(body).toContain('hreflang="x-default"');
    // No stray Docusaurus scaffold pages leaked into the sitemap.
    expect(body).not.toContain("BaseUrlWrapper");
    expect(body).not.toContain("markdown-page");
  }
});

test("llms.txt is served and lists the shipped locales", async ({ request }) => {
  const response = await request.get("/llms.txt");
  expect(response.ok()).toBeTruthy();
  const body = await response.text();
  expect(body).toContain("docs.dig.net");
  for (const locale of LOCALES) {
    expect(body).toContain(locale);
  }
});
