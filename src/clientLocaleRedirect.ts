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
 * The pure resolution logic lives in `localeResolver.mjs` (unit-tested in
 * isolation); this module is only the browser side effect that applies it.
 *
 * Rules (deliberately conservative so it never fights the user or loops):
 *  - Runs only in a real browser (guarded by the window/navigator check).
 *  - Fires at most ONCE per browser: a localStorage flag is set the first time it
 *    runs, so a manual language choice afterwards is never overridden.
 *  - Only redirects away from the DEFAULT locale path. If the visitor is already
 *    on a `/<locale>/…` path we treat that as an explicit choice and just remember it.
 *  - Only redirects when the detected locale is a DIFFERENT shipped locale than
 *    the default; if it resolves to `en` (or is unsupported) we stay put.
 *  - Preserves the current path + query + hash, just prefixing the locale segment.
 */
import {
  DEFAULT_LOCALE,
  NON_DEFAULT_LOCALES,
  SUPPORTED,
  detectBrowserLocale,
} from "./localeResolver.mjs";

const FLAG_KEY = "dig-docs-locale-redirected";

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
