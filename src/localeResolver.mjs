/**
 * Pure browser-locale → shipped-locale resolution.
 *
 * Extracted from the client redirect side-effect module so the branching logic
 * (region overrides, language fallbacks, the shipped-locale set) is unit-testable
 * in isolation, with no DOM or `window` dependency. `clientLocaleRedirect.ts`
 * consumes these to decide where a first-time visitor is sent; the hub mirrors
 * the same contract (apps/web/i18n/locales.ts) so both products resolve a raw
 * BCP-47 tag to the SAME shipped locale.
 *
 * This module is plain ESM (`.mjs`) so the `node --test` unit runner imports it
 * directly with no TypeScript loader; a colocated `localeResolver.d.ts` gives the
 * TypeScript consumer its types.
 */

/**
 * The 13 non-default shipped locales (must match docusaurus.config.ts
 * i18n.locales minus the default `en`). Keep in sync with that list.
 */
export const NON_DEFAULT_LOCALES = [
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

export const DEFAULT_LOCALE = "en";

// Region/script overrides that must NOT collapse to the language default
// (Traditional-script Chinese → zh-TW). Mirrors the hub's REGION_OVERRIDE.
const REGION_OVERRIDE = {
  "zh-tw": "zh-TW",
  "zh-hk": "zh-TW",
  "zh-mo": "zh-TW",
  "zh-hant": "zh-TW",
};

// Primary-language fallbacks (e.g. `pt-PT` → `pt-BR`, `es-419` → `es`, any `zh` → zh-CN).
// Mirrors the hub's LANGUAGE_FALLBACK.
const LANGUAGE_FALLBACK = {
  zh: "zh-CN",
  pt: "pt-BR",
  ko: "ko",
  ja: "ja",
  ru: "ru",
  es: "es",
  fr: "fr",
  de: "de",
  tr: "tr",
  vi: "vi",
  id: "id",
  hi: "hi",
  en: "en",
};

export const ALL_LOCALES = [DEFAULT_LOCALE, ...NON_DEFAULT_LOCALES];
export const SUPPORTED = new Set(ALL_LOCALES);

/**
 * Resolve one raw BCP-47 tag to a shipped locale, or null if unsupported.
 *
 * Order: exact canonical match → region/script override → primary-language
 * fallback. The region override wins over the language fallback so
 * Traditional-script tags (zh-HK, zh-MO, zh-Hant) reach zh-TW rather than
 * collapsing to the zh → zh-CN default.
 */
export function resolveOne(raw) {
  if (!raw) return null;
  const parts = raw.trim().toLowerCase().split(/[-_]/);
  const lang = parts[0];
  if (!lang) return null;
  const sub = parts[1];
  const langRegion = sub ? `${lang}-${sub}` : null;
  if (langRegion) {
    const exact = ALL_LOCALES.find((code) => code.toLowerCase() === langRegion);
    if (exact) return exact;
    if (REGION_OVERRIDE[langRegion]) return REGION_OVERRIDE[langRegion];
  }
  return LANGUAGE_FALLBACK[lang] ?? null;
}

/**
 * Walk `langs` in order; the first tag that resolves wins. Falls back to the
 * default locale when nothing resolves (e.g. an empty or all-unsupported list).
 */
export function detectBrowserLocale(langs) {
  for (const tag of langs) {
    const hit = resolveOne(tag);
    if (hit) return hit;
  }
  return DEFAULT_LOCALE;
}
