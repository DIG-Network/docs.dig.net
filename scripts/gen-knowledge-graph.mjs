/**
 * Generates static/knowledge-graph.json from the docs themselves.
 *
 * WHY derive it instead of hand-writing it: the graph then cannot drift from
 * the docs. Nodes and edges come from each page's own frontmatter `tags` and
 * its "## Related" link list — the same sources that drive the on-page tags
 * row and the per-page JSON-LD. Run this whenever docs change:
 *
 *   node scripts/gen-knowledge-graph.mjs
 *
 * Output schema (small, stable, scraper-friendly):
 *   { generatedFrom, site, nodes: [...], edges: [...] }
 *   node:  { id, type: "concept" | "doc", title, url, [tags] }
 *   edge:  { from, to, type: "defines"|"part-of"|"relates-to"|"requires"|"see-also" }
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DOCS = path.join(ROOT, 'docs');
const SITE = 'https://docs.dig.net';

// The controlled vocabulary: each tag (graph concept node) → the doc that is
// its canonical definition. The concepts glossary `defines` every term.
const CONCEPT_TITLES = {
  capsule: 'Capsule',
  store: 'Store',
  generation: 'Generation',
  urn: 'URN',
  'retrieval-key': 'Retrieval key',
  encryption: 'Encryption',
  'merkle-proof': 'Merkle proof',
  anchoring: 'On-chain anchoring',
  'dig-payment': 'DIG payment',
  'digstore-cli': 'DigStore CLI',
  'dig-toml': 'dig.toml',
  'dig-sdk': 'DIG SDK',
  'dig-rpc': 'The dig RPC',
  streaming: 'Streaming',
  'chia-protocol': 'The chia:// protocol',
  'window-chia': 'window.chia',
  browser: 'DIG Browser',
  'chip-0002': 'CHIP-0002',
  'chip-0035': 'CHIP-0035',
  dighub: 'DIGHub',
  whitepaper: 'Whitepapers',
};

/** Recursively collect .md files under docs/. */
function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else if (entry.name.endsWith('.md')) out.push(p);
  }
  return out;
}

/** docs/rpc/methods.md -> /docs/rpc/methods ; docs/intro.md -> /docs (slug: /) */
function docUrlPath(absFile, frontMatter) {
  if (frontMatter.slug === '/') return '/docs';
  let rel = path.relative(DOCS, absFile).replace(/\\/g, '/').replace(/\.md$/, '');
  rel = rel.replace(/\/index$/, ''); // whitepapers/index -> whitepapers
  return `/docs/${rel}`;
}

/** Minimal frontmatter parser: title, slug, and the tags list. */
function parseFrontMatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---/);
  const fm = {tags: []};
  if (!m) return fm;
  const body = m[1];
  const title = body.match(/^title:\s*"?(.+?)"?\s*$/m);
  if (title) fm.title = title[1].replace(/^"|"$/g, '');
  const slug = body.match(/^slug:\s*(.+?)\s*$/m);
  if (slug) fm.slug = slug[1].trim();
  const tagsBlock = body.match(/^tags:\n((?:\s*-\s*.+\n?)+)/m);
  if (tagsBlock) {
    fm.tags = tagsBlock[1]
      .split('\n')
      .map((l) => l.match(/^\s*-\s*(.+?)\s*$/))
      .filter(Boolean)
      .map((mm) => mm[1]);
  }
  return fm;
}

/** Resolve a relative .md link from a source file into a /docs URL path. */
function resolveRelLink(fromFile, href) {
  const clean = href.split('#')[0];
  if (!clean.endsWith('.md')) return null;
  const abs = path.resolve(path.dirname(fromFile), clean);
  if (!abs.startsWith(DOCS)) return null;
  let rel = path.relative(DOCS, abs).replace(/\\/g, '/').replace(/\.md$/, '');
  rel = rel.replace(/\/index$/, '');
  if (rel === 'intro') return '/docs';
  return `/docs/${rel}`;
}

/** Extract the "## Related" section's relative .md links. */
function parseRelated(src, fromFile) {
  const sec = src.split(/\n##\s+Related\s*\n/);
  if (sec.length < 2) return [];
  const block = sec[1].split(/\n##\s+/)[0];
  const links = [...block.matchAll(/\]\(([^)]+\.md(?:#[^)]*)?)\)/g)].map((m) => m[1]);
  return links.map((h) => resolveRelLink(fromFile, h)).filter(Boolean);
}

const files = walk(DOCS);
const docNodes = new Map(); // url -> node
const docFront = new Map(); // url -> {tags, file}
const edges = [];

for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  const fm = parseFrontMatter(src);
  const url = docUrlPath(file, fm);
  const title = fm.title || path.basename(file, '.md');
  docNodes.set(url, {id: url, type: 'doc', title, url: SITE + url, tags: fm.tags});
  docFront.set(url, {tags: fm.tags, related: parseRelated(src, file)});
}

// Concept nodes (one per controlled-vocabulary tag), keyed by their tag page.
const conceptNodes = [];
for (const [tag, title] of Object.entries(CONCEPT_TITLES)) {
  const url = `/docs/tags/${tag}`;
  conceptNodes.push({id: `concept:${tag}`, type: 'concept', title, url: SITE + url, tag});
}

// Edge: concepts glossary `defines` every concept.
const CONCEPTS_DOC = '/docs/concepts';
for (const tag of Object.keys(CONCEPT_TITLES)) {
  edges.push({from: CONCEPTS_DOC, to: `concept:${tag}`, type: 'defines'});
}

// Edge: each doc is `part-of` every concept it is tagged with (doc -> concept).
for (const [url, {tags}] of docFront) {
  for (const tag of tags) {
    if (CONCEPT_TITLES[tag]) {
      edges.push({from: url, to: `concept:${tag}`, type: 'part-of'});
    }
  }
}

// Edge: "## Related" links become typed doc->doc edges.
// init/commit, clone/pull → requires (anchoring/install/quickstart deps); the
// rest are see-also. We classify by a small, explicit table rather than guess.
const REQUIRES = new Set([
  // (fromUrl, toUrl) pairs where `from` genuinely needs `to` first.
  '/docs/digstore/cli/quickstart|->|/docs/digstore/cli/install',
  '/docs/digstore/cli/quickstart|->|/docs/digstore/cli/onchain-anchoring',
  '/docs/digstore/cli/onchain-anchoring|->|/docs/digstore/cli/quickstart',
  '/docs/digstore/cli/sharing|->|/docs/digstore/cli/onchain-anchoring',
]);
for (const [url, {related}] of docFront) {
  for (const to of related) {
    if (to === url) continue;
    const key = `${url}|->|${to}`;
    edges.push({from: url, to, type: REQUIRES.has(key) ? 'requires' : 'see-also'});
  }
}

const graph = {
  generatedFrom: 'docs/**/*.md frontmatter tags + "## Related" links',
  site: SITE,
  nodes: [...conceptNodes, ...docNodes.values()],
  edges,
};

const outPath = path.join(ROOT, 'static', 'knowledge-graph.json');
fs.writeFileSync(outPath, JSON.stringify(graph, null, 2) + '\n');
console.log(
  `knowledge-graph.json: ${graph.nodes.length} nodes, ${graph.edges.length} edges -> ${path.relative(ROOT, outPath)}`,
);
