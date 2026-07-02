#!/usr/bin/env node
// Post-processes the built dist/ tree: annotates every locale's sitemap.xml
// with <xhtml:link rel="alternate" hreflang="..."> entries for all 14 shipped
// locales + x-default.
//
// WHY a separate postbuild script (not a Docusaurus plugin hook): Docusaurus
// runs every plugin's `postBuild` concurrently (`Promise.all(plugins.map(...))`
// in @docusaurus/core/lib/commands/build.js) — a plugin hook that reads then
// rewrites the SAME sitemap.xml @docusaurus/plugin-sitemap itself is
// concurrently writing races that write and silently loses (verified: an
// earlier `postBuild`-hook version of this logic never took effect, because
// there is no ordering guarantee between plugins' postBuild calls). Running
// as a plain `npm run postbuild` script instead — after `docusaurus build`
// has fully returned — sidesteps the race entirely; npm's lifecycle order is
// strictly sequential.
//
// WHY sitemap-level hreflang at all, given per-page <head> already has full
// hreflang: @docusaurus/plugin-content-docs already emits complete
// <link rel="alternate" hreflang="..."> tags (+ x-default) on every page,
// verified against a real build — this script fills the ONE remaining gap:
// @docusaurus/plugin-sitemap's `SitemapItem` type has no field for alternate
// annotations, so sitemap.xml itself carries none. Search engines treat
// sitemap-level hreflang as an additional, crawl-efficient discovery signal
// (see https://developers.google.com/search/docs/specialty/international/localized-versions#sitemap) —
// this augments, not replaces, the per-page tags.
//
// Docusaurus's locale-prefix rule (unchanged since 3.x): the DEFAULT locale
// is served unprefixed at the site root; every other locale is served under
// `/<locale>/...`. Each locale is built into its own dist subdirectory
// (`dist/` for the default locale, `dist/<locale>/` for the rest), each
// carrying its own `sitemap.xml`. A page's logical (locale-free) path is
// recovered by stripping the CURRENT locale's own prefix from its <loc>;
// every other locale's alternate URL is that same logical path re-prefixed —
// entirely deterministic from the configured locale list, so this can never
// drift from the URL structure Docusaurus itself generates.

import * as fs from "node:fs";
import * as path from "node:path";
import * as url from "node:url";

const SITE_URL = "https://docs.dig.net";
const DEFAULT_LOCALE = "en";
// Must match docusaurus.config.ts i18n.locales.
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

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "..", "dist");

function localePrefix(locale) {
  return locale === DEFAULT_LOCALE ? "" : `/${locale}`;
}

/** Strip `locale`'s own prefix from a `<loc>` URL, returning the logical (locale-free) path (leading slash, no trailing slash except root). */
function stripLocalePrefix(loc, locale) {
  let p = loc.startsWith(SITE_URL) ? loc.slice(SITE_URL.length) : loc;
  if (!p.startsWith("/")) p = `/${p}`;
  const prefix = localePrefix(locale);
  if (prefix && p.startsWith(prefix)) {
    p = p.slice(prefix.length) || "/";
  }
  return p;
}

function buildAlternateUrl(logicalPath, locale) {
  const prefix = localePrefix(locale);
  const p = logicalPath === "/" ? "" : logicalPath;
  return `${SITE_URL}${prefix}${p}` || `${SITE_URL}/`;
}

function xmlAttrEscape(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function annotateSitemap(sitemapPath, locale) {
  const xml = fs.readFileSync(sitemapPath, "utf8");
  let count = 0;

  // Docusaurus's sitemap plugin (via the `sitemap` npm package) always emits
  // <loc> as the <url> element's first child, no attributes — reliable for a
  // build pipeline we fully control end-to-end (not third-party/untrusted
  // XML), so this pattern-based rewrite is safe.
  const updated = xml.replace(/<url>(\s*)<loc>([^<]+)<\/loc>/g, (_full, ws, loc) => {
    count += 1;
    const logicalPath = stripLocalePrefix(loc, locale);
    const alternates = LOCALES.map((code) => ({
      hreflang: code,
      href: buildAlternateUrl(logicalPath, code),
    }));
    alternates.push({ hreflang: "x-default", href: buildAlternateUrl(logicalPath, DEFAULT_LOCALE) });
    const links = alternates
      .map((a) => `<xhtml:link rel="alternate" hreflang="${xmlAttrEscape(a.hreflang)}" href="${xmlAttrEscape(a.href)}"/>`)
      .join("");
    return `<url>${ws}<loc>${loc}</loc>${links}`;
  });

  fs.writeFileSync(sitemapPath, updated, "utf8");
  return count;
}

function main() {
  if (!fs.existsSync(distDir)) {
    console.error(`gen-hreflang-sitemaps: dist/ not found at ${distDir} — run "docusaurus build" first.`);
    process.exit(1);
  }

  let totalFiles = 0;
  let totalUrls = 0;

  for (const locale of LOCALES) {
    const localeDir = locale === DEFAULT_LOCALE ? distDir : path.join(distDir, locale);
    const sitemapPath = path.join(localeDir, "sitemap.xml");
    if (!fs.existsSync(sitemapPath)) {
      // A single-locale build (docusaurus build --locale xx) only produces
      // one locale's dist tree — skip locales that weren't built rather than
      // failing the whole script.
      continue;
    }
    const count = annotateSitemap(sitemapPath, locale);
    totalFiles += 1;
    totalUrls += count;
    console.log(`gen-hreflang-sitemaps: ${path.relative(distDir, sitemapPath)} — ${count} url(s) annotated with ${LOCALES.length + 1} alternates`);
  }

  if (totalFiles === 0) {
    console.error("gen-hreflang-sitemaps: no sitemap.xml found under dist/ for any configured locale.");
    process.exit(1);
  }

  console.log(`gen-hreflang-sitemaps: done — ${totalFiles} sitemap(s), ${totalUrls} url(s) total.`);
}

main();
