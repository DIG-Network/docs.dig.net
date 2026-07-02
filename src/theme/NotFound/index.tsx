/**
 * Wrapped NotFound page.
 *
 * WHY: the site-wide `headTags` in docusaurus.config.ts sets
 * `<meta name="robots" content="index, follow">` on EVERY page (there is no
 * per-route override in Docusaurus config) so real doc pages are explicitly
 * marked indexable. That same tag was leaking onto the 404 page, telling
 * crawlers to index a page with no real content — a stray inbound link (or a
 * locale/path typo) would get a genuine 404 indexed and ranked. This wrapper
 * renders the stock 404 (unchanged UX/content) and additionally overrides
 * robots to `noindex, follow` via a LATER <Head> tag: Docusaurus's Helmet
 * merge keeps the last-registered tag for a given `name`, so this wins over
 * the site-wide default without needing to touch docusaurus.config.ts.
 * `follow` is kept so links elsewhere on the page (e.g. nav) still get
 * crawled — only THIS page is excluded from the index.
 */
import React, {type ReactNode} from 'react';
import Head from '@docusaurus/Head';
import NotFound from '@theme-original/NotFound';

export default function NotFoundWrapper(props: Record<string, unknown>): ReactNode {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex, follow" />
      </Head>
      <NotFound {...props} />
    </>
  );
}
