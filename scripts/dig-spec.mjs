/**
 * Single source of truth for the machine-readable DIG specs that
 * `gen-machine-specs.mjs` renders into `static/openrpc.json` and
 * `static/error-codes.json`.
 *
 * WHY this file exists: docs.dig.net is the canonical aggregation home for the
 * ecosystem's cross-surface contracts. The dig RPC method set and the error
 * catalog are documented in prose (docs/rpc/methods.md, docs/support/error-codes.md)
 * AND consumed by every other module (digstore, hub, dig-sdk, the extension,
 * the browser). Keeping the machine artifacts in ONE small data module — then
 * generating the JSON from it AND drift-checking it against the prose tables —
 * means the spec, the JSON, and the human page can never silently diverge.
 *
 * Provenance of the data here:
 *   - dig RPC methods + chunk object: docs/rpc/methods.md + docs/rpc/streaming.md
 *     (the prose spec), conformant with rpc.dig.net.
 *   - JSON-RPC -32xxx codes: docs/rpc/methods.md "Errors" + the JSON-RPC 2.0 spec.
 *   - digstore CLI exit codes 0..16: digstore crates/digstore-cli/src/error.rs
 *     (CliError::exit_code) — mirrored in docs/support/error-codes.md.
 *   - DIGHUb user-facing codes: docs/support/error-codes.md (the friendly codes
 *     the web app shows); the underlying wire enum is hub
 *     packages/dighub-core/src/error.rs (ErrorCode, snake_case + http_status).
 *   - dig:// loader codes: the DIG content loader's catalogued failure taxonomy
 *     (DIG content scheme — the browser/extension chia:// loader), per the
 *     ecosystem agent-friendly plan.
 */

export const SITE = 'https://docs.dig.net';
export const RPC_ENDPOINT = 'https://rpc.dig.net';

/* ------------------------------------------------------------------ *
 * Reusable JSON Schemas for the dig RPC (OpenRPC `components.schemas`)
 * ------------------------------------------------------------------ */

const hex64 = {
  type: 'string',
  pattern: '^[0-9a-f]{64}$',
  description: '32 bytes as 64 lower-case hex characters.',
};

const rootRef = {
  oneOf: [
    { type: 'string', pattern: '^[0-9a-f]{64}$' },
    { type: 'string', const: 'latest' },
  ],
  description:
    'A generation root: 64 hex of one capsule, or the literal "latest" for the newest confirmed generation.',
};

export const schemas = {
  StoreId: { ...hex64, title: 'StoreId' },
  RetrievalKey: { ...hex64, title: 'RetrievalKey', description: 'retrieval_key = sha256(urn).' },
  Root: { title: 'Root', ...rootRef },
  ChunkObject: {
    title: 'ChunkObject',
    type: 'object',
    description:
      'The streaming chunk object returned by every byte-bearing method (dig.getContent, dig.getCapsule, dig.getManifest). Reassemble until `complete`, verify `inclusion_proof` over the whole ciphertext against `root`, then decrypt.',
    required: [
      'ciphertext',
      'total_length',
      'offset',
      'length',
      'complete',
      'next_offset',
      'inclusion_proof',
      'decoy',
      'root',
    ],
    properties: {
      ciphertext: { type: 'string', contentEncoding: 'base64', description: "This chunk's bytes, standard base64." },
      total_length: { type: 'integer', minimum: 0, description: "The full object's byte length before chunking." },
      offset: { type: 'integer', minimum: 0, description: "Byte offset where this chunk begins in the full object." },
      length: { type: 'integer', minimum: 0, description: "This chunk's byte length (= decoded ciphertext length)." },
      complete: { type: 'boolean', description: 'true when offset + length >= total_length.' },
      next_offset: { type: ['integer', 'null'], description: 'The offset to request next, or null when complete.' },
      inclusion_proof: {
        type: ['string', 'null'],
        contentEncoding: 'base64',
        description: 'Base64 merkle inclusion proof for the whole resource (null for capsules and decoys).',
      },
      decoy: { type: 'boolean', description: 'true if this is a blind-miss decoy stream. Treat as not-found.' },
      root: { ...hex64, description: 'The resolved generation root (hex). Pin subsequent chunks to it.' },
      program_hash: { ...hex64, description: "The served .dig's sha256 (hex)." },
    },
  },
  MetadataManifest: {
    title: 'MetadataManifest',
    type: 'object',
    description: "The store's plaintext, ungated metadata manifest, embedded in the compiled module (Digstore §8.4).",
    properties: {
      schema_version: { type: 'integer' },
      name: { type: 'string' },
      version: { type: 'string' },
      description: { type: 'string' },
      authors: {
        type: 'array',
        items: {
          type: 'object',
          properties: { name: { type: 'string' }, handle: { type: 'string' }, contact: { type: 'string' } },
        },
      },
      license: { type: 'string' },
      homepage: { type: 'string' },
      repository: { type: 'string' },
      keywords: { type: 'array', items: { type: 'string' } },
      categories: { type: 'array', items: { type: 'string' } },
      icon: { type: 'string' },
      content_type: { type: 'string' },
      links: { type: 'object' },
      custom: { type: 'object' },
    },
  },
  CapsuleEntry: {
    title: 'CapsuleEntry',
    type: 'object',
    description: 'One confirmed capsule (anchored generation) in a store lineage.',
    required: ['seq', 'root'],
    properties: {
      seq: { type: 'integer', minimum: 0, description: 'Monotonic generation number.' },
      root: { ...hex64, description: 'The generation root passed to the byte methods.' },
      program_hash: { ...hex64 },
      coin_id: { ...hex64, description: 'The anchoring spend coin id.' },
      anchored_at: { type: 'integer', description: 'Unix timestamp of the anchoring spend.' },
    },
  },
};

/* ------------------------------------------------------------------ *
 * The dig RPC method set (OpenRPC `methods`)
 * ------------------------------------------------------------------ */

const PROOF_STATUS = ['succeeded', 'running', 'queued', 'not_found', 'request_via_control_plane'];

export const methods = [
  {
    name: 'dig.getContent',
    summary: 'Stream one resource’s ciphertext by retrieval key.',
    description:
      'The method behind every content view and public store link. Returns a chunk object; reassemble until complete, verify the inclusion proof against `root`, then decrypt with the URN-derived key.',
    paramStructure: 'by-name',
    params: [
      { name: 'store_id', required: true, schema: { $ref: '#/components/schemas/StoreId' } },
      { name: 'retrieval_key', required: true, schema: { $ref: '#/components/schemas/RetrievalKey' } },
      { name: 'root', required: false, schema: { $ref: '#/components/schemas/Root' } },
      { name: 'offset', required: false, schema: { type: 'integer', minimum: 0, default: 0 } },
      { name: 'length', required: false, schema: { type: 'integer', minimum: 1 }, description: 'Clamped to the node’s max chunk (3 MiB).' },
    ],
    result: { name: 'chunk', schema: { $ref: '#/components/schemas/ChunkObject' } },
    errors: ['INVALID_PARAMS', 'INTERNAL_ERROR'],
  },
  {
    name: 'dig.getProof',
    summary: 'Return the inclusion proof (sync) and the execution-proof status for a resource.',
    description:
      'Read-only. The merkle inclusion proof is REAL and synchronous; the ZK execution proof is produced asynchronously by the prover and only returned when you pass a `proof_id` you already requested via the gated control plane.',
    paramStructure: 'by-name',
    params: [
      { name: 'store_id', required: true, schema: { $ref: '#/components/schemas/StoreId' } },
      { name: 'retrieval_key', required: true, schema: { $ref: '#/components/schemas/RetrievalKey' } },
      { name: 'root', required: false, schema: { $ref: '#/components/schemas/Root' } },
      { name: 'proof_id', required: false, schema: { type: 'string' }, description: 'An execution-proof job id to return the real receipt for.' },
    ],
    result: {
      name: 'proof',
      schema: {
        type: 'object',
        properties: {
          inclusion_proof: { type: 'string', contentEncoding: 'base64' },
          program_hash: { $ref: '#/components/schemas/StoreId' },
          root: { $ref: '#/components/schemas/StoreId' },
          decoy: { type: 'boolean' },
          execution_proof: { type: ['string', 'null'], description: 'risc0 receipt or null.' },
          execution_proof_status: { type: 'string', enum: PROOF_STATUS },
          node_pubkey: { type: 'string' },
          block_header: { type: 'string' },
        },
      },
    },
    errors: ['INVALID_PARAMS', 'INTERNAL_ERROR'],
  },
  {
    name: 'dig.getProofStatus',
    summary: 'Poll a REAL execution-proof job by id.',
    description: 'Returns the job status and, when terminal, the real risc0 receipt. Never a mock receipt.',
    paramStructure: 'by-name',
    params: [
      { name: 'store_id', required: true, schema: { $ref: '#/components/schemas/StoreId' } },
      { name: 'proof_id', required: true, schema: { type: 'string' } },
    ],
    result: {
      name: 'status',
      schema: {
        type: 'object',
        properties: {
          proof_id: { type: 'string' },
          status: { type: 'string', enum: ['queued', 'running', 'succeeded', 'failed'] },
          receipt: { type: ['string', 'null'] },
          node_pubkey: { type: 'string' },
          block_header: { type: 'string' },
          root: { $ref: '#/components/schemas/StoreId' },
        },
      },
    },
    errors: ['INVALID_PARAMS', 'INTERNAL_ERROR'],
  },
  {
    name: 'dig.getCapsule',
    summary: 'Stream an entire compiled capsule (the whole .dig module) for one generation.',
    description:
      'Address a capsule by its (store_id, root) pair. The capsule self-verifies on install (store id + signed root + on-chain root), so `inclusion_proof` is null here. The alias dig.getModule is accepted for identical behavior.',
    paramStructure: 'by-name',
    params: [
      { name: 'store_id', required: true, schema: { $ref: '#/components/schemas/StoreId' } },
      { name: 'root', required: false, schema: { $ref: '#/components/schemas/Root' } },
      { name: 'offset', required: false, schema: { type: 'integer', minimum: 0, default: 0 } },
      { name: 'length', required: false, schema: { type: 'integer', minimum: 1 } },
    ],
    result: { name: 'chunk', schema: { $ref: '#/components/schemas/ChunkObject' } },
    errors: ['INVALID_PARAMS', 'INTERNAL_ERROR'],
  },
  {
    name: 'dig.getManifest',
    summary: "Convenience over dig.getContent for the store's public discovery manifest.",
    description: 'The node derives the canonical retrieval key for .well-known/dig/manifest.json itself.',
    paramStructure: 'by-name',
    params: [
      { name: 'store_id', required: true, schema: { $ref: '#/components/schemas/StoreId' } },
      { name: 'root', required: false, schema: { $ref: '#/components/schemas/Root' } },
      { name: 'offset', required: false, schema: { type: 'integer', minimum: 0, default: 0 } },
      { name: 'length', required: false, schema: { type: 'integer', minimum: 1 } },
    ],
    result: {
      name: 'chunk',
      schema: {
        allOf: [
          { $ref: '#/components/schemas/ChunkObject' },
          { type: 'object', properties: { retrieval_key: { $ref: '#/components/schemas/RetrievalKey' } } },
        ],
      },
    },
    errors: ['INVALID_PARAMS', 'INTERNAL_ERROR'],
  },
  {
    name: 'dig.getMetadata',
    summary: "Read the store's plaintext metadata manifest from the .dig.",
    description:
      'Metadata is plaintext, ungated public discovery info embedded in the module (Digstore §8.4) — not a content resource, no inclusion proof, never encrypted. Its on-chain binding is the module program_hash.',
    paramStructure: 'by-name',
    params: [
      { name: 'store_id', required: true, schema: { $ref: '#/components/schemas/StoreId' } },
      { name: 'root', required: false, schema: { $ref: '#/components/schemas/Root' } },
    ],
    result: {
      name: 'metadata',
      schema: {
        type: 'object',
        properties: {
          manifest: { oneOf: [{ $ref: '#/components/schemas/MetadataManifest' }, { type: 'null' }] },
          program_hash: { $ref: '#/components/schemas/StoreId' },
          root: { $ref: '#/components/schemas/StoreId' },
          decoy: { type: 'boolean' },
        },
      },
    },
    errors: ['INVALID_PARAMS', 'INTERNAL_ERROR'],
  },
  {
    name: 'dig.listCapsules',
    summary: "Return the store's confirmed capsules — one entry per anchored generation.",
    description: 'Discovery metadata, not content: only the public on-chain generation list.',
    paramStructure: 'by-name',
    params: [{ name: 'store_id', required: true, schema: { $ref: '#/components/schemas/StoreId' } }],
    result: {
      name: 'capsules',
      schema: {
        type: 'object',
        properties: {
          store_id: { $ref: '#/components/schemas/StoreId' },
          capsules: { type: 'array', items: { $ref: '#/components/schemas/CapsuleEntry' } },
        },
      },
    },
    errors: ['INVALID_PARAMS', 'INTERNAL_ERROR'],
  },
  {
    name: 'dig.health',
    summary: 'Service discovery: liveness + the implemented method list.',
    description: 'Takes no parameters.',
    paramStructure: 'by-name',
    params: [],
    result: {
      name: 'health',
      schema: {
        type: 'object',
        properties: {
          ok: { type: 'boolean' },
          service: { type: 'string' },
          methods: { type: 'array', items: { type: 'string' } },
        },
      },
    },
    errors: [],
  },
  {
    name: 'dig.methods',
    summary: 'Service discovery: the method catalogue this node implements.',
    description:
      'Takes no parameters. Use it to confirm a third-party node implements the methods you need before relying on it.',
    paramStructure: 'by-name',
    params: [],
    result: { name: 'methods', schema: { type: 'object', properties: { methods: { type: 'array', items: { type: 'string' } } } } },
    errors: [],
  },
];

/* ------------------------------------------------------------------ *
 * JSON-RPC error definitions (OpenRPC `components.errors`)
 * Keyed by a stable UPPER_SNAKE handle; `code` is the JSON-RPC number.
 * ------------------------------------------------------------------ */

export const rpcErrors = {
  PARSE_ERROR: { code: -32700, message: 'Parse error', meaning: 'The request body isn’t valid JSON (id is null).' },
  INVALID_REQUEST: { code: -32600, message: 'Invalid request', meaning: 'Not a request object/array, an empty batch, or a missing method.' },
  METHOD_NOT_FOUND: { code: -32601, message: 'Method not found', meaning: 'This node doesn’t implement the method.' },
  INVALID_PARAMS: { code: -32602, message: 'Invalid params', meaning: 'Missing/malformed store_id, root, or retrieval_key; or "latest" on a store with no confirmed generation.' },
  INTERNAL_ERROR: { code: -32603, message: 'Internal error', meaning: 'The node failed to satisfy a well-formed call (distinct from a miss, which is a decoy).' },
};

/* ------------------------------------------------------------------ *
 * The cross-surface error catalog (error-codes.json).
 * Shape: [{ surface, code, http_or_exit, description }] per the ecosystem
 * agent-friendly standard, grouped by surface for readability.
 * ------------------------------------------------------------------ */

/** dig RPC (JSON-RPC). `http_or_exit` is the transport status (always 200; the
 *  error rides in the JSON envelope). */
export const rpcCatalog = Object.entries(rpcErrors).map(([name, e]) => ({
  surface: 'dig-rpc',
  code: e.code,
  name,
  http_or_exit: 200,
  description: `${e.message} — ${e.meaning}`,
}));

/** digstore CLI process exit codes (0..16). Mirrors CliError::exit_code in
 *  digstore crates/digstore-cli/src/error.rs. */
export const cliCatalog = [
  { exit: 0, code: 'success', description: 'The command completed.' },
  { exit: 1, code: 'other', description: 'An unclassified error. Re-run with --verbose.' },
  { exit: 2, code: 'invalid-argument', description: 'A flag or argument was invalid.' },
  { exit: 3, code: 'no-store', description: 'No store found here. Run `digstore init`.' },
  { exit: 4, code: 'not-found', description: "A resource/URN/root wasn't found." },
  { exit: 5, code: 'verification-failed', description: 'Content failed cryptographic verification (wrong salt/key or tampered data).' },
  { exit: 6, code: 'network', description: 'A network/transport failure.' },
  { exit: 7, code: 'non-fast-forward', description: 'The remote root has advanced past yours. Pull first.' },
  { exit: 8, code: 'unauthorized', description: 'Not authorized for this action.' },
  { exit: 9, code: 'no-seed', description: 'No wallet seed is set up.' },
  { exit: 10, code: 'bad-passphrase', description: 'Wrong passphrase for the seed.' },
  { exit: 11, code: 'invalid-mnemonic', description: 'The mnemonic is invalid (check word list / count).' },
  { exit: 12, code: 'insufficient-funds', description: 'Not enough XCH or DIG to cover the spend (100 DIG + XCH fee per capsule).' },
  { exit: 13, code: 'chain', description: 'A Chia chain/coinset error.' },
  { exit: 14, code: 'confirm-timeout', description: 'The on-chain confirmation timed out.' },
  { exit: 15, code: 'mint-failed', description: 'Minting the store singleton failed.' },
  { exit: 16, code: 'update-failed', description: 'Anchoring the new root failed.' },
].map((e) => ({ surface: 'digstore-cli', code: e.code, exit: e.exit, http_or_exit: e.exit, description: e.description }));

/** DIGHUb user-facing codes (the web app shows these + a plain-language message).
 *  Mirrors docs/support/error-codes.md; the underlying wire enum is hub
 *  packages/dighub-core/src/error.rs (ErrorCode, with http_status). `wire` is the
 *  closest snake_case wire code + its HTTP status where one exists. */
export const dighubCatalog = [
  { code: 'WALLET_DECLINED', http: null, wire: null, description: 'You declined the signature in your wallet. Nothing was signed or broadcast.' },
  { code: 'DIG_INSUFFICIENT', http: 429, wire: 'over_quota', description: 'Not enough DIG in your wallet to cover this capsule (100 DIG).' },
  { code: 'COIN_CONFLICT', http: 409, wire: 'coin_reserved', description: 'The coin was just spent elsewhere (double-spend / mempool conflict).' },
  { code: 'REG_PENDING', http: null, wire: null, description: 'Your spend is on chain and will appear shortly. Do not sign or pay again.' },
  { code: 'WALLET_SESSION', http: 401, wire: 'unauthorized', description: "Your wallet session can't sign (expired, watch-only, or missing method)." },
  { code: 'NET_OFFLINE', http: null, wire: null, description: 'You appear to be offline.' },
  { code: 'NET_TIMEOUT', http: null, wire: null, description: "The request timed out or couldn't reach the network." },
  { code: 'SLUG_TAKEN', http: 409, wire: 'slug_taken', description: 'That project name is already taken.' },
  { code: 'OVER_QUOTA', http: 429, wire: 'over_quota', description: "You've reached the project limit for this account." },
  { code: 'COIN_RESERVED', http: 409, wire: 'coin_reserved', description: 'A coin is busy finishing another transaction.' },
  { code: 'UNAUTHORIZED', http: 401, wire: 'unauthorized', description: "Your session isn't authorized for this." },
  { code: 'FORBIDDEN', http: 403, wire: 'forbidden', description: "You don't have permission to do this." },
  { code: 'NOT_FOUND', http: 404, wire: 'not_found', description: 'The thing could not be found — it may have expired.' },
  { code: 'INVALID_REQUEST', http: 400, wire: 'invalid_request', description: "Something about the request wasn't valid." },
  { code: 'UNEXPECTED', http: 500, wire: null, description: 'An unclassified error.' },
].map((e) => ({ surface: 'dighub', code: e.code, http: e.http, wire: e.wire, http_or_exit: e.http, description: e.description }));

/** dig:// content loader codes (the chia:// loader in the DIG Browser / extension).
 *  The fail-closed loader's catalogued failure taxonomy, surfaced on the error
 *  page so an agent can branch on the cause. Per the ecosystem agent-friendly
 *  plan for dig-browser / dig-chrome-extension. */
export const loaderCatalog = [
  { code: 'DIG_ERR_PROOF_MISMATCH', description: 'The served ciphertext did not verify against the on-chain generation root (tamper / wrong root).' },
  { code: 'DIG_ERR_DECRYPT_TAG', description: 'AES-256-GCM-SIV authentication tag failed — wrong key/salt or corrupted bytes.' },
  { code: 'DIG_ERR_NOT_FOUND', description: 'A blind miss (decoy) — no resource at this retrieval key under this generation.' },
  { code: 'DIG_ERR_NETWORK', description: 'The node/CDN was unreachable or the transport failed.' },
].map((e) => ({ surface: 'dig-loader', code: e.code, http_or_exit: null, description: e.description }));
