/**
 * Wrapped DocItem/Footer.
 *
 * WHY: makes every doc page machine-extractable into a knowledge graph
 * without touching the prose. It renders the stock footer (tags row + edit
 * meta) unchanged, and additionally emits a per-page schema.org JSON-LD block
 * derived entirely from the page's own frontmatter (`title`, `description`,
 * `keywords`, `tags`) plus its permalink. Nothing here changes the reading
 * experience — it is additive metadata in <head>.
 *
 * Entity typing: a page whose frontmatter carries `schema_type: DefinedTerm`
 * (the glossary / concept pages) is emitted as a schema.org `DefinedTerm`;
 * every other page is a `TechArticle`. `keywords` and `tags` become the
 * typed `about`/`keywords` edges that link the page to the controlled DIG
 * vocabulary so a scraper can reconstruct the concept graph.
 */
import React, {type ReactNode} from 'react';
import Head from '@docusaurus/Head';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Footer from '@theme-original/DocItem/Footer';

// The docs site is the single `isPartOf` parent every page belongs to.
const DOCS_SITE = {
  '@type': 'TechArticle',
  name: 'DIG Network Documentation',
  url: 'https://docs.dig.net/',
} as const;

function toAbsoluteUrl(siteUrl: string, permalink: string): string {
  // permalink is a site-relative path like "/docs/rpc/methods".
  return new URL(permalink, siteUrl).toString();
}

export default function DocItemFooterWrapper(props: Record<string, unknown>): ReactNode {
  const {metadata, frontMatter} = useDoc();
  const {siteConfig} = useDocusaurusContext();

  const keywords = ([] as string[])
    .concat((frontMatter.keywords as string[] | undefined) ?? [])
    .concat((metadata.tags ?? []).map((t) => t.label));
  // De-duplicate while preserving order.
  const uniqueKeywords = Array.from(new Set(keywords));

  const url = toAbsoluteUrl(siteConfig.url, metadata.permalink);
  // `schema_type` is a custom frontmatter field (not in DocFrontMatter), so
  // read it through an index cast. "DefinedTerm" marks the glossary/concept
  // pages; everything else is a TechArticle.
  const isDefinedTerm =
    (frontMatter as Record<string, unknown>).schema_type === 'DefinedTerm';

  // `about` turns each tag into a typed edge to a DefinedTerm node, keyed by
  // its /docs/tags page — the canonical graph node for that concept.
  const about = (metadata.tags ?? []).map((t) => ({
    '@type': 'DefinedTerm',
    name: t.label,
    url: toAbsoluteUrl(siteConfig.url, t.permalink),
    inDefinedTermSet: toAbsoluteUrl(siteConfig.url, '/docs/concepts'),
  }));

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': isDefinedTerm ? 'DefinedTerm' : 'TechArticle',
    name: metadata.title,
    headline: metadata.title,
    description: metadata.description,
    url,
    '@id': url,
    inLanguage: 'en',
    keywords: uniqueKeywords,
    isPartOf: DOCS_SITE,
    publisher: {
      '@type': 'Organization',
      name: 'DIG Network',
      url: 'https://dig.net',
    },
  };
  if (about.length > 0) {
    jsonLd.about = about;
  }
  if (isDefinedTerm) {
    jsonLd.inDefinedTermSet = toAbsoluteUrl(siteConfig.url, '/docs/concepts');
  }

  return (
    <>
      <Head>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Head>
      <Footer {...props} />
    </>
  );
}
