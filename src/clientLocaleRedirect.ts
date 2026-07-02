/**
 * Client-only first-visit browser-locale redirect.
 *
 * Docusaurus serves each locale as its own static build under a path prefix
 * (`/` for the default `en`, `/<locale>/…` for the rest). It has no built-in
 * "send a first-time visitor to their browser language" behaviour — the
 * LocaleDropdown is the manual switch. This client module adds the automatic
 * first-visit redirect, mirroring hub.dig.net's `detectBrowserLocale` contract
 * (apps/web/i18n/locales.ts) so the two products resolve a raw BCP-47 tag to the
 * SAME shipped locale.
 *
 * Rules (deliberately conservative so it never fights the user or loops):
 *  - Runs only in a real browser (guarded by canUseDOM).
 *  - Fires at most ONCE per browser: a localStorage flag is set the first time it
 *    runs, so a manual language choice afterwards is never overridden.
 *  - Only redirects away from the DEFAULT locale path. If the visitor is already
 *    on a `/<locale>/…` path we treat that as an explicit choice and just remember it.
 *  - Only redirects when the detected locale is a DIFFERENT shipped locale than
 *    the default; if it resolves to `en` (or is unsupported) we stay put.
 *  - Preserves the current path + query + hash, just prefixing the locale segment.
 */

// The 13 non-default shipped locales (must match docusaurus.config.ts i18n.locales
// minus the default `en`). Keep in sync with that list.
const NON_DEFAULT_LOCALES = [
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
] as const;

const DEFAULT_LOCALE = "en";
const FLAG_KEY = "dig-docs-locale-redirected";

// Region/script overrides that must NOT collapse to the language default
// (Traditional-script Chinese → zh-TW). Mirrors the hub's REGION_OVERRIDE.
const REGION_OVERRIDE: Record<string, string> = {
  "zh-tw": "zh-TW",
  "zh-hk": "zh-TW",
  "zh-mo": "zh-TW",
  "zh-hant": "zh-TW",
};

// Primary-language fallbacks (e.g. `pt-PT` → `pt-BR`, `es-419` → `es`, any `zh` → zh-CN).
// Mirrors the hub's LANGUAGE_FALLBACK.
const LANGUAGE_FALLBACK: Record<string, string> = {
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

const ALL_LOCALES: readonly string[] = [DEFAULT_LOCALE, ...NON_DEFAULT_LOCALES];
const SUPPORTED = new Set<string>(ALL_LOCALES);

/** Resolve one raw BCP-47 tag to a shipped locale, or null if unsupported. */
function resolveOne(raw: string): string | null {
  if (!raw) return null;
  const parts = raw.trim().toLowerCase().split(/[-_]/);
  const lang = parts[0];
  if (!lang) return null;
  const sub = parts[1];
  const langRegion = sub ? `${lang}-${sub}` : null;
  // Exact canonical match (compare case-insensitively against shipped codes).
  if (langRegion) {
    const exact = ALL_LOCALES.find((code) => code.toLowerCase() === langRegion);
    if (exact) return exact;
    if (REGION_OVERRIDE[langRegion]) return REGION_OVERRIDE[langRegion];
  }
  return LANGUAGE_FALLBACK[lang] ?? null;
}

/** Walk navigator.languages in order; first tag that resolves wins. Falls back to `en`. */
function detectBrowserLocale(langs: readonly string[]): string {
  for (const tag of langs) {
    const hit = resolveOne(tag);
    if (hit) return hit;
  }
  return DEFAULT_LOCALE;
}

// Only run in the browser (this module is also imported during SSR/build).
if (typeof window !== "undefined" && typeof navigator !== "undefined") {
  try {
    const alreadyHandled = window.localStorage.getItem(FLAG_KEY);
    const path = window.location.pathname;
    // Is the visitor already on a non-default locale path? Then respect it.
    const onLocalePath = NON_DEFAULT_LOCALES.some(
      (loc) => path === `/${loc}` || path.startsWith(`/${loc}/`),
    );

    if (!alreadyHandled) {
      // Remember that we've evaluated once, regardless of outcome, so we never loop
      // or override a later manual choice.
      window.localStorage.setItem(FLAG_KEY, "1");

      if (!onLocalePath) {
        const langs =
          Array.isArray(navigator.languages) && navigator.languages.length > 0
            ? navigator.languages
            : navigator.language
              ? [navigator.language]
              : [];
        const target = detectBrowserLocale(langs);
        if (target !== DEFAULT_LOCALE && SUPPORTED.has(target)) {
          // Prefix the locale segment, preserving path + query + hash.
          const rest = path === "/" ? "/" : path;
          window.location.replace(
            `/${target}${rest}${window.location.search}${window.location.hash}`,
          );
        }
      }
    }
  } catch {
    // localStorage blocked / privacy mode / anything unexpected — do nothing.
  }
}
