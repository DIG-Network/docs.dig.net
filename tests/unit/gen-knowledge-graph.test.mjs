// Unit tests for the pure doc-parsing helpers of scripts/gen-knowledge-graph.mjs.
//
// knowledge-graph.json is derived from each page's frontmatter `tags` and its
// "## Related" link list; these parsers are the sole readers of that frontmatter
// schema. Pinning them documents the schema other repos' machine consumers rely
// on and guards the derived graph against silent parse drift.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {
  parseFrontMatter,
  parseRelated,
  docUrlPath,
} from '../../scripts/gen-knowledge-graph.mjs';

const DOCS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'docs');

test('parseFrontMatter: reads title, slug, and the tags list', () => {
  const src = `---
title: "On-chain anchoring"
slug: /anchoring
tags:
  - anchoring
  - capsule
---

# Body`;
  const fm = parseFrontMatter(src);
  assert.equal(fm.title, 'On-chain anchoring');
  assert.equal(fm.slug, '/anchoring');
  assert.deepEqual(fm.tags, ['anchoring', 'capsule']);
});

test('parseFrontMatter: unquoted title is preserved', () => {
  assert.equal(parseFrontMatter('---\ntitle: Quickstart\n---\n').title, 'Quickstart');
});

test('parseFrontMatter: no frontmatter yields empty tags and no title', () => {
  const fm = parseFrontMatter('# Just a heading\n');
  assert.deepEqual(fm.tags, []);
  assert.equal(fm.title, undefined);
});

test('parseFrontMatter: frontmatter without a tags block yields empty tags', () => {
  assert.deepEqual(parseFrontMatter('---\ntitle: X\n---\n').tags, []);
});

test('parseRelated: extracts relative .md links from the "## Related" section only', () => {
  const from = path.join(DOCS, 'protocol', 'dig-cat-payment.md');
  const src = `# Page

See [unrelated](./elsewhere.md) above.

## Related

- [On-chain anchoring](./on-chain-anchoring.md) — context
- [Blind host](./blind-host-model.md#push-trust)

## After

- [ignored](./after.md)`;
  const related = parseRelated(src, from);
  assert.deepEqual(related, [
    '/docs/protocol/on-chain-anchoring',
    '/docs/protocol/blind-host-model',
  ]);
});

test('parseRelated: a page with no Related section yields no links', () => {
  const from = path.join(DOCS, 'protocol', 'x.md');
  assert.deepEqual(parseRelated('# X\n\nBody only.\n', from), []);
});

test('docUrlPath: slug "/" maps to /docs', () => {
  assert.equal(docUrlPath(path.join(DOCS, 'intro.md'), {slug: '/'}), '/docs');
});

test('docUrlPath: nested files map to their /docs path, index stripped', () => {
  assert.equal(docUrlPath(path.join(DOCS, 'rpc', 'methods.md'), {}), '/docs/rpc/methods');
  assert.equal(docUrlPath(path.join(DOCS, 'run-a-node', 'index.md'), {}), '/docs/run-a-node');
});
