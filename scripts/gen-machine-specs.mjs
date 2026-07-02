/**
 * Generates two committed machine-readable artifacts from the single
 * source-of-truth in `dig-spec.mjs`:
 *
 *   static/openrpc.json     — the OpenRPC 1.2.6 document for the dig JSON-RPC
 *                             (dig.getContent/getProof/getProofStatus/getCapsule/
 *                              getManifest/getMetadata/listCapsules/health/methods)
 *                             with request/response JSON Schemas + the catalogued
 *                             error responses. This is the canonical dig-RPC spec
 *                             referenced by every other module.
 *   static/error-codes.json — the ecosystem cross-surface error catalog:
 *                             dig RPC -32xxx, digstore CLI exit codes 0..16,
 *                             DIGHUb user-facing codes, and the dig:// loader codes,
 *                             as a flat [{surface, code, http_or_exit, description}]
 *                             list plus a `bySurface` index.
 *
 * WHY generate (and drift-gate) instead of hand-writing the JSON: the prose docs
 * (docs/rpc/methods.md, docs/support/error-codes.md) and these JSON artifacts must
 * never disagree. This script (a) renders the JSON from dig-spec.mjs and (b) parses
 * the prose error tables and FAILS the build if the JSON and the tables diverge —
 * so the human page, the JSON, and the source enums stay in lockstep. Run it on
 * every build/start (wired as prebuild/prestart, like gen-knowledge-graph.mjs):
 *
 *   node scripts/gen-machine-specs.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  SITE,
  RPC_ENDPOINT,
  schemas,
  methods,
  nodeMethods,
  rpcErrors,
  rpcCatalog,
  cliCatalog,
  dighubCatalog,
  loaderCatalog,
} from './dig-spec.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const STATIC = path.join(ROOT, 'static');
const DOCS = path.join(ROOT, 'docs');

// Read the docs version so the artifacts carry a real, comparable version.
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));

/* ------------------------------------------------------------------ *
 * OpenRPC document
 * ------------------------------------------------------------------ */

function buildOpenRpc({ title, methodSet, info, servers }) {
  // A named, reusable JSON-RPC error component per catalogued code.
  const errorComponents = {};
  for (const [name, e] of Object.entries(rpcErrors)) {
    errorComponents[name] = { code: e.code, message: e.message, data: { type: 'object' } };
  }

  const openrpcMethods = methodSet.map((m) => ({
    name: m.name,
    summary: m.summary,
    description: m.description,
    paramStructure: m.paramStructure,
    params: m.params.map((p) => ({
      name: p.name,
      required: !!p.required,
      ...(p.description ? { description: p.description } : {}),
      schema: p.schema,
    })),
    result: { name: m.result.name, schema: m.result.schema },
    errors: m.errors.map((h) => ({ $ref: `#/components/errors/${h}` })),
  }));

  return {
    openrpc: '1.2.6',
    info: {
      title,
      version: pkg.version && pkg.version !== '0.0.0' ? pkg.version : '1.0.0',
      description: info,
      license: { name: 'GPL-2.0', url: 'https://github.com/DIG-Network/digstore/blob/main/LICENSE' },
    },
    servers,
    methods: openrpcMethods,
    components: { schemas, errors: errorComponents },
    externalDocs: { description: 'dig RPC methods (prose)', url: `${SITE}/docs/protocol/dig-rpc` },
  };
}

/* ------------------------------------------------------------------ *
 * Cross-surface error catalog
 * ------------------------------------------------------------------ */

function buildErrorCatalog() {
  const all = [...rpcCatalog, ...cliCatalog, ...dighubCatalog, ...loaderCatalog];
  const bySurface = {};
  for (const row of all) (bySurface[row.surface] ??= []).push(row);
  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    generatedFrom: 'scripts/dig-spec.mjs (mirrors docs/support/error-codes.md + the source enums)',
    site: SITE,
    version: 1,
    surfaces: {
      'dig-rpc': 'JSON-RPC 2.0 codes for the dig RPC (rpc.dig.net). http_or_exit is the transport status (always 200; the error rides in the JSON envelope).',
      'digstore-cli': 'digstore CLI process exit codes (0..16). http_or_exit is the process exit code.',
      dighub: 'DIGHUb (hub.dig.net) user-facing codes. http_or_exit is the HTTP status where one exists.',
      'dig-loader': 'dig:// content-loader failure codes (DIG Browser / extension). http_or_exit is null (surfaced on the error page).',
    },
    errors: all,
    bySurface,
  };
}

/* ------------------------------------------------------------------ *
 * Drift gate: the prose tables in error-codes.md MUST match the catalog.
 * We parse the markdown's first-column codes per surface and assert the JSON
 * carries exactly the same set. A new/removed code in either place fails here.
 * ------------------------------------------------------------------ */

function tableCodes(md, sectionHeading) {
  // Slice from the section heading to the next "## " heading.
  const start = md.indexOf(`## ${sectionHeading}`);
  if (start < 0) throw new Error(`error-codes.md: section "## ${sectionHeading}" not found`);
  const rest = md.slice(start + 3);
  const end = rest.indexOf('\n## ');
  const body = end < 0 ? rest : rest.slice(0, end);
  const codes = new Set();
  for (const line of body.split('\n')) {
    const cells = line.split('|').map((c) => c.trim());
    // A data row looks like: | `code` | … |  (leading empty cell from the pipe).
    // Skip header/separator rows.
    if (cells.length < 3) continue;
    const first = cells[1];
    if (!first || first === 'Code' || first === 'Exit' || /^-+$/.test(first)) continue;
    const m = first.match(/`([^`]+)`/);
    if (m) codes.add(m[1]);
  }
  return codes;
}

function assertSetEqual(label, fromJson, fromMd) {
  const a = new Set(fromJson);
  const b = new Set(fromMd);
  const onlyJson = [...a].filter((x) => !b.has(x));
  const onlyMd = [...b].filter((x) => !a.has(x));
  if (onlyJson.length || onlyMd.length) {
    const parts = [];
    if (onlyJson.length) parts.push(`only in error-codes.json: ${onlyJson.join(', ')}`);
    if (onlyMd.length) parts.push(`only in error-codes.md: ${onlyMd.join(', ')}`);
    throw new Error(`error-codes drift for ${label} — ${parts.join('; ')}`);
  }
}

function driftGate(catalog) {
  const md = fs.readFileSync(path.join(DOCS, 'support', 'error-codes.md'), 'utf8');

  // dig RPC: prose lists the numeric -32xxx codes (as `-327..`).
  assertSetEqual(
    'dig-rpc',
    catalog.bySurface['dig-rpc'].map((e) => String(e.code)),
    tableCodes(md, 'dig RPC (JSON-RPC)'),
  );

  // digstore CLI: prose first column is the Exit number.
  assertSetEqual(
    'digstore-cli',
    catalog.bySurface['digstore-cli'].map((e) => String(e.exit)),
    tableCodes(md, 'digstore CLI (exit codes)'),
  );

  // DIGHUb: prose first column is the UPPER_SNAKE code.
  assertSetEqual(
    'dighub',
    catalog.bySurface['dighub'].map((e) => e.code),
    tableCodes(md, 'DIGHUb (web app)'),
  );

  // dig:// loader: prose first column is the DIG_ERR_* code.
  assertSetEqual(
    'dig-loader',
    catalog.bySurface['dig-loader'].map((e) => e.code),
    tableCodes(md, 'dig:// content loader'),
  );
}

/* ------------------------------------------------------------------ */

const openrpc = buildOpenRpc({
  title: 'dig RPC — DIG Network Content Interface (network profile)',
  methodSet: methods,
  servers: [{ name: 'rpc.dig.net', url: RPC_ENDPOINT, summary: 'The public DIG Network read endpoint.' }],
  info:
    'The network-wide read interface for DIG content over JSON-RPC 2.0 — the NETWORK PROFILE served by the canonical node at rpc.dig.net. Blind by construction (the node holds no URN and no key), verifiable without trust (merkle inclusion proofs against the chain-anchored root), and streamable at any size. There is no `decoy` field on the wire and no CDN. See https://docs.dig.net/docs/protocol/dig-rpc.',
});

const openrpcNode = buildOpenRpc({
  title: 'dig RPC — node profile (local dig-node / in-process DIG Browser)',
  methodSet: nodeMethods,
  servers: [{ name: 'local dig-node', url: 'http://127.0.0.1:9778', summary: 'The local node the DIG Browser runs in-process (FFI) and dig-node serves on 127.0.0.1:9778.' }],
  info:
    'The NODE PROFILE: a distinct, smaller surface than the network profile. Of the byte methods it implements ONLY dig.getContent (local-first, else proxy); everything else proxies upstream or returns -32601. It ADDS node-only methods the security model depends on — chiefly dig.getAnchoredRoot (the CHIP-0035 on-chain head, the trusted root for mandatory root-pinning), dig.stage, and cache.*. Gate on dig.methods rather than assuming one uniform surface. See https://docs.dig.net/docs/protocol/dig-rpc#node-profile.',
});

const catalog = buildErrorCatalog();

driftGate(catalog);

fs.mkdirSync(STATIC, { recursive: true });
fs.writeFileSync(path.join(STATIC, 'openrpc.json'), JSON.stringify(openrpc, null, 2) + '\n');
fs.writeFileSync(path.join(STATIC, 'openrpc-node.json'), JSON.stringify(openrpcNode, null, 2) + '\n');
fs.writeFileSync(path.join(STATIC, 'error-codes.json'), JSON.stringify(catalog, null, 2) + '\n');

console.log(
  `openrpc.json: ${openrpc.methods.length} methods (network); openrpc-node.json: ${openrpcNode.methods.length} methods (node); ` +
    `${Object.keys(openrpc.components.schemas).length} schemas; ` +
    `error-codes.json: ${catalog.errors.length} codes across ${Object.keys(catalog.bySurface).length} surfaces ` +
    `(drift gate passed)`,
);
