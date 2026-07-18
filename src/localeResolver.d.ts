/**
 * Types for the plain-ESM {@link ./localeResolver.mjs} pure locale resolver.
 * The runtime lives in the `.mjs` (so the `node --test` runner imports it with
 * no TypeScript loader); these declarations give the TypeScript consumer its
 * contract.
 */

/** The 13 non-default shipped locales (docusaurus.config.ts i18n minus `en`). */
export const NON_DEFAULT_LOCALES: readonly string[];

/** The default (unprefixed) locale. */
export const DEFAULT_LOCALE: "en";

/** Every shipped locale, default first. */
export const ALL_LOCALES: readonly string[];

/** Fast membership set over {@link ALL_LOCALES}. */
export const SUPPORTED: ReadonlySet<string>;

/** Resolve one raw BCP-47 tag to a shipped locale, or `null` if unsupported. */
export function resolveOne(raw: string): string | null;

/** First tag in `langs` that resolves wins; falls back to {@link DEFAULT_LOCALE}. */
export function detectBrowserLocale(langs: readonly string[]): string;
