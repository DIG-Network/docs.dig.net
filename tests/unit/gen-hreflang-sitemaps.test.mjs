// Unit tests for the pure path helpers of scripts/gen-hreflang-sitemaps.mjs.
//
// These two functions define the sitemap hreflang contract: a page's logical
// (locale-free) path recovered from any locale's <loc>, then re-prefixed into
// every other locale's alternate URL. If either drifts, sitemap alternates point
// search engines at the wrong localized URLs — so their inverse relationship is
// pinned here.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {
  stripLocalePrefix,
  buildAlternateUrl,
  localePrefix,
} from '../../scripts/gen-hreflang-sitemaps.mjs';

const SITE = 'https://docs.dig.net';

test('localePrefix: default locale is unprefixed, others carry /<locale>', () => {
  assert.equal(localePrefix('en'), '');
  assert.equal(localePrefix('zh-CN'), '/zh-CN');
  assert.equal(localePrefix('pt-BR'), '/pt-BR');
});

test('stripLocalePrefix: recovers the logical path from the default locale', () => {
  assert.equal(stripLocalePrefix(`${SITE}/docs/intro`, 'en'), '/docs/intro');
  assert.equal(stripLocalePrefix(`${SITE}/`, 'en'), '/');
});

test('stripLocalePrefix: strips a non-default locale prefix', () => {
  assert.equal(stripLocalePrefix(`${SITE}/zh-CN/docs/intro`, 'zh-CN'), '/docs/intro');
  assert.equal(stripLocalePrefix(`${SITE}/pt-BR/docs`, 'pt-BR'), '/docs');
});

test('stripLocalePrefix: a bare locale root maps back to /', () => {
  assert.equal(stripLocalePrefix(`${SITE}/zh-CN`, 'zh-CN'), '/');
});

test('stripLocalePrefix: a path without the SITE prefix is still normalized', () => {
  assert.equal(stripLocalePrefix('/zh-CN/docs/intro', 'zh-CN'), '/docs/intro');
  assert.equal(stripLocalePrefix('docs/intro', 'en'), '/docs/intro');
});

test('buildAlternateUrl: re-prefixes a logical path for each locale', () => {
  assert.equal(buildAlternateUrl('/docs/intro', 'en'), `${SITE}/docs/intro`);
  assert.equal(buildAlternateUrl('/docs/intro', 'zh-CN'), `${SITE}/zh-CN/docs/intro`);
});

test('buildAlternateUrl: the site root resolves without a trailing empty segment', () => {
  assert.equal(buildAlternateUrl('/', 'en'), SITE);
  assert.equal(buildAlternateUrl('/', 'zh-CN'), `${SITE}/zh-CN`);
});

test('strip then build round-trips within a locale', () => {
  for (const locale of ['en', 'zh-CN', 'pt-BR']) {
    const loc = `${SITE}${localePrefix(locale)}/docs/rpc/methods`;
    const logical = stripLocalePrefix(loc, locale);
    assert.equal(buildAlternateUrl(logical, locale), loc);
  }
});
