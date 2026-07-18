// Unit tests for the pure browser-locale resolver (src/localeResolver.mjs).
//
// The redirect module's user-visible behaviour hinges entirely on these two
// functions resolving a raw BCP-47 tag to the right shipped locale — especially
// the region-override edge cases (Traditional-script Chinese must reach zh-TW,
// never collapse to the zh → zh-CN language default). These tests pin that
// contract independently of the DOM side effect.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveOne,
  detectBrowserLocale,
  DEFAULT_LOCALE,
  NON_DEFAULT_LOCALES,
  ALL_LOCALES,
} from '../../src/localeResolver.mjs';

test('resolveOne: exact canonical match wins for every shipped locale', () => {
  for (const code of ALL_LOCALES) {
    assert.equal(resolveOne(code), code, `${code} should resolve to itself`);
  }
});

test('resolveOne: match is case- and separator-insensitive', () => {
  assert.equal(resolveOne('ZH-CN'), 'zh-CN');
  assert.equal(resolveOne('zh_cn'), 'zh-CN');
  assert.equal(resolveOne('PT-br'), 'pt-BR');
  assert.equal(resolveOne('  en  '), 'en');
});

test('resolveOne: region overrides route Traditional-script Chinese to zh-TW', () => {
  // The load-bearing edge case: these must NOT collapse to zh → zh-CN.
  assert.equal(resolveOne('zh-HK'), 'zh-TW');
  assert.equal(resolveOne('zh-MO'), 'zh-TW');
  assert.equal(resolveOne('zh-Hant'), 'zh-TW');
  assert.equal(resolveOne('zh-TW'), 'zh-TW');
});

test('resolveOne: unknown region falls back to the primary language', () => {
  assert.equal(resolveOne('pt-PT'), 'pt-BR'); // Portugal → the shipped pt-BR
  assert.equal(resolveOne('es-419'), 'es'); // Latin-American Spanish → es
  assert.equal(resolveOne('zh-SG'), 'zh-CN'); // Simplified-script region → zh-CN
  assert.equal(resolveOne('fr-CA'), 'fr');
});

test('resolveOne: unsupported languages and empty input resolve to null', () => {
  assert.equal(resolveOne('sw'), null); // Swahili — not shipped
  assert.equal(resolveOne('xx-YY'), null);
  assert.equal(resolveOne(''), null);
  assert.equal(resolveOne('   '), null);
});

test('detectBrowserLocale: first resolvable tag in the list wins', () => {
  assert.equal(detectBrowserLocale(['sw', 'pt-PT', 'en']), 'pt-BR');
  assert.equal(detectBrowserLocale(['zh-HK', 'en']), 'zh-TW');
});

test('detectBrowserLocale: falls back to the default locale when nothing resolves', () => {
  assert.equal(detectBrowserLocale([]), DEFAULT_LOCALE);
  assert.equal(detectBrowserLocale(['sw', 'xx']), DEFAULT_LOCALE);
});

test('the non-default locale list carries exactly the 13 shipped non-default locales', () => {
  assert.equal(NON_DEFAULT_LOCALES.length, 13);
  assert.ok(!NON_DEFAULT_LOCALES.includes(DEFAULT_LOCALE));
  assert.equal(ALL_LOCALES.length, 14);
});
