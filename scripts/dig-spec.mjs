/**
 * Single source of truth for the machine-readable DIG specs that
 * `gen-machine-specs.mjs` renders into `static/openrpc.json` and
 * `static/error-codes.json`.
 *
 * WHY this file exists: docs.dig.net is the canonical aggregation home for the
 * ecosystem's cross-surface contracts. The dig RPC method set and the error
 * catalog are documented in prose (docs/rpc/methods.md, docs/support/error-codes.md)
 * AND consumed by every other module (dig-store, hub, dig-sdk, the extension,
 * the browser). Keeping the machine artifacts in ONE small data module — then
 * generating the JSON from it AND drift-checking it against the prose tables —
 * means the spec, the JSON, and the human page can never silently diverge.
 *
 * Provenance of the data here:
 *   - dig RPC methods + chunk object: docs/rpc/methods.md + docs/rpc/streaming.md
 *     (the prose spec), conformant with rpc.dig.net.
 *   - JSON-RPC -32xxx codes: docs/rpc/methods.md "Errors" + the JSON-RPC 2.0 spec.
 *   - dig-store CLI exit codes 0..16: dig-store crates/digstore-cli/src/error.rs
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
      'The streaming chunk object returned by every byte-bearing method (dig.getContent, dig.getCapsule, dig.getManifest). Reassemble until `complete`, verify `inclusion_proof` over the whole ciphertext against the CALLER-supplied chain-anchored `root`, split by `chunk_lens`, then AES-256-GCM-SIV-open each chunk. There is NO `decoy` field on the wire: a blind miss is the capsule\'s own indistinguishable, non-verifying response, discovered client-side by inclusion-proof failure and/or decryption-tag failure.',
    required: [
      'ciphertext',
      'total_length',
      'offset',
      'length',
      'complete',
      'next_offset',
      'inclusion_proof',
      'root',
    ],
    properties: {
      ciphertext: { type: 'string', contentEncoding: 'base64', description: "This window's bytes, standard base64." },
      total_length: { type: 'integer', minimum: 0, description: "The full resource ciphertext length before windowing." },
      offset: { type: 'integer', minimum: 0, description: "Byte offset where this window begins in the full object." },
      length: { type: 'integer', minimum: 0, description: "This window's byte length (= decoded ciphertext length)." },
      complete: { type: 'boolean', description: 'true when offset + length >= total_length.' },
      next_offset: { type: ['integer', 'null'], description: 'The offset to request next, or null when complete.' },
      inclusion_proof: {
        type: ['string', 'null'],
        contentEncoding: 'base64',
        description: 'Base64 merkle inclusion proof for the WHOLE resource, relayed verbatim from the capsule. Sent on every window for getContent/getManifest; empty string / null for getCapsule.',
      },
      chunk_lens: {
        type: 'array',
        items: { type: 'integer', minimum: 0 },
        description: 'Per-chunk CIPHERTEXT byte lengths of the full resource, in order. REQUIRED to split + decrypt a multi-chunk resource. Emitted on the FIRST window only (offset == 0); empty/absent ⇒ a single chunk = the whole ciphertext.',
      },
      root: { ...hex64, description: 'The resolved generation root (hex). Pin subsequent chunks to it.' },
      program_hash: { ...hex64, description: "The served .dig's sha256 (hex) — the on-chain program identity." },
    },
  },
  MetadataManifest: {
    title: 'MetadataManifest',
    type: 'object',
    description: "The store's plaintext, ungated metadata manifest, embedded in the compiled module (dig-store §8.4).",
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
  PeerId: {
    type: 'string',
    pattern: '^[0-9a-f]{64}$',
    title: 'PeerId',
    description: 'A DIG Node peer identity: SHA-256 of the peer\'s TLS SubjectPublicKeyInfo DER, as 64 lower-case hex characters (32 bytes).',
  },
  CandidateAddress: {
    title: 'CandidateAddress',
    type: 'object',
    description: 'One address at which a peer may be reachable, tagged by how it was learned. Peers dial candidates most-direct-first.',
    required: ['host', 'port', 'kind'],
    properties: {
      host: { type: 'string', description: 'IP literal or hostname.' },
      port: { type: 'integer', minimum: 0, maximum: 65535, description: 'The peer\'s P2P port (default 9444).' },
      kind: {
        type: 'string',
        enum: ['direct', 'reflexive', 'mapped', 'relay'],
        description: 'How the address was learned: advertised/observed direct, STUN reflexive, UPnP/NAT-PMP/PCP mapped, or relay-reachable.',
      },
    },
  },
  PeerRecord: {
    title: 'PeerRecord',
    type: 'object',
    description: 'A known peer with its identity and candidate addresses (the peer-exchange record).',
    required: ['peer_id', 'addresses'],
    properties: {
      peer_id: { $ref: '#/components/schemas/PeerId' },
      addresses: { type: 'array', items: { $ref: '#/components/schemas/CandidateAddress' }, description: 'The peer\'s candidate addresses.' },
      network_id: { type: 'string', description: 'The network the peer is on (e.g. DIG_MAINNET).' },
      last_seen: { type: 'integer', description: 'Unix seconds this peer was last seen.' },
      via: { type: 'string', enum: ['direct', 'relay'], description: 'How this node currently reaches the peer.' },
    },
  },
  AvailabilityItem: {
    title: 'AvailabilityItem',
    type: 'object',
    description:
      'One item to check in a dig.getAvailability batch. Granularity is inferred from the fields present: store_id only = has_store; + root = has_root (the capsule store_id:root); + retrieval_key = has_resource within the capsule.',
    required: ['store_id'],
    properties: {
      store_id: { $ref: '#/components/schemas/StoreId' },
      root: { ...hex64, description: 'Optional generation root — narrows the check to that capsule.' },
      retrieval_key: { $ref: '#/components/schemas/RetrievalKey' },
    },
  },
  AvailabilityAnswer: {
    title: 'AvailabilityAnswer',
    type: 'object',
    description:
      'One answer in a dig.getAvailability result, positionally aligned with the queried items. Reports whether the peer holds the item plus (where cheap) planning metadata so the caller can partition ranges without a probe fetch.',
    required: ['available'],
    properties: {
      available: { type: 'boolean', description: 'Whether the peer holds the queried item.' },
      roots: { type: 'array', items: { ...hex64 }, description: 'STORE granularity: the generation roots the peer currently holds for the store, newest-first.' },
      total_length: { type: 'integer', minimum: 0, description: 'ROOT/RESOURCE granularity: the resource/capsule ciphertext length.' },
      chunk_count: { type: 'integer', minimum: 0, description: 'ROOT/RESOURCE granularity: the number of chunks (plan ranges against this).' },
      complete: { type: 'boolean', description: 'Whether the peer holds the FULL resource/capsule (true) or only part of it (false); a partial holder still serves the ranges it has.' },
    },
  },
  RangeFrame: {
    title: 'RangeFrame',
    type: 'object',
    description:
      'One frame of a streamed dig.fetchRange response. Data is delivered as an ordered stream of these frames over a logical stream of the multiplexed peer transport — the caller reads incrementally with backpressure and reassembles by `offset`. The FIRST frame (offset == range start) additionally carries the range-verification metadata (total_length, chunk_lens, chunk_index, inclusion_proof) so a range fetched from ONE peer is independently verifiable against the capsule\'s chain-anchored merkle root without the whole file. See https://docs.dig.net/docs/protocol/peer-network#range.',
    required: ['offset', 'length', 'bytes', 'complete'],
    properties: {
      offset: { type: 'integer', minimum: 0, description: 'This frame\'s start offset within the requested range (bytes into the resource ciphertext).' },
      length: { type: 'integer', minimum: 0, description: 'This frame\'s byte length (= decoded `bytes` length).' },
      bytes: { type: 'string', contentEncoding: 'base64', description: 'This frame\'s ciphertext bytes, standard base64.' },
      complete: { type: 'boolean', description: 'true when this is the final frame of the requested range.' },
      total_length: { type: 'integer', minimum: 0, description: 'FIRST FRAME ONLY: the full resource ciphertext length (so a client can plan its ranges).' },
      chunk_lens: {
        type: 'array',
        items: { type: 'integer', minimum: 0 },
        description: 'FIRST FRAME ONLY: per-chunk ciphertext lengths of the WHOLE resource, in order (identical to the dig RPC chunk_lens). Maps a byte range to the chunk(s) covering it; required to split + verify + decrypt.',
      },
      chunk_index: { type: 'integer', minimum: 0, description: 'FIRST FRAME ONLY: index into chunk_lens of the first chunk in this range.' },
      inclusion_proof: {
        type: ['string', 'null'],
        contentEncoding: 'base64',
        description: 'FIRST FRAME ONLY: base64 merkle inclusion proof of the WHOLE resource against the generation `root`, relayed verbatim. Verify the range against the CALLER-supplied chain-anchored root — the node is never the trust anchor. null for capsule fetches (capsule: true), which self-verify on install.',
      },
      root: { ...hex64, description: 'FIRST FRAME ONLY: the resolved generation root the inclusion_proof is against.' },
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
    errors: ['INVALID_PARAMS', 'INTERNAL_ERROR', 'RESOURCE_UNAVAILABLE'],
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
          inclusion_proof: { type: 'string', contentEncoding: 'base64', description: 'REAL synchronous merkle inclusion proof for the whole resource.' },
          program_hash: { $ref: '#/components/schemas/StoreId' },
          root: { $ref: '#/components/schemas/StoreId' },
          execution_proof: { type: ['string', 'null'], description: 'risc0 receipt or null (read-only / job-based; never a mock receipt on the wire).' },
          execution_proof_status: { type: 'string', enum: PROOF_STATUS },
          node_pubkey: { type: 'string' },
          block_header: { type: 'string' },
        },
      },
    },
    errors: ['INVALID_PARAMS', 'INTERNAL_ERROR', 'RESOURCE_UNAVAILABLE'],
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
    errors: ['INVALID_PARAMS', 'INTERNAL_ERROR', 'RESOURCE_UNAVAILABLE'],
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
    errors: ['INVALID_PARAMS', 'INTERNAL_ERROR', 'RESOURCE_UNAVAILABLE'],
  },
  {
    name: 'dig.getMetadata',
    summary: "Read the store's plaintext metadata manifest from the .dig.",
    description:
      'Metadata is plaintext, ungated public discovery info embedded in the module (dig-store §8.4) — not a content resource, no inclusion proof, never encrypted. Its on-chain binding is the module program_hash.',
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
        },
      },
    },
    errors: ['INVALID_PARAMS', 'INTERNAL_ERROR', 'RESOURCE_UNAVAILABLE'],
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
 * The dig RPC NODE PROFILE (local dig-node / in-process
 * DIG Browser node). A DISTINCT, smaller surface than the network profile:
 * of the byte methods it implements ONLY dig.getContent; everything else
 * proxies upstream or returns -32601. It ADDS node-only methods that MUST be
 * specced because the security model depends on them — chiefly
 * dig.getAnchoredRoot, which resolves the CHIP-0035 singleton's on-chain head
 * (the trusted root for mandatory root-pinning). An agent gates on dig.methods
 * rather than assuming one uniform surface.  (dig-node lib.rs:1121-1297.)
 * ------------------------------------------------------------------ */

export const nodeMethods = [
  {
    name: 'dig.getContent',
    summary: 'Stream one resource’s ciphertext (local-first, then proxy).',
    description:
      'Identical wire contract to the network profile, but served LOCAL-FIRST: from a cached compiled .dig (serve_blind over <cache>/modules/<store>/<root>.module), else an authenticated §21.9 whole-store sync, else the raw JSON-RPC body is proxied upstream to rpc.dig.net. The in-process node ADDITIVELY tags each chunk with `source` ("local"|"remote").',
    paramStructure: 'by-name',
    params: [
      { name: 'store_id', required: true, schema: { $ref: '#/components/schemas/StoreId' } },
      { name: 'retrieval_key', required: true, schema: { $ref: '#/components/schemas/RetrievalKey' } },
      { name: 'root', required: false, schema: { $ref: '#/components/schemas/Root' } },
      { name: 'offset', required: false, schema: { type: 'integer', minimum: 0, default: 0 } },
      { name: 'length', required: false, schema: { type: 'integer', minimum: 1 }, description: 'Clamped to the node window (3 MiB).' },
    ],
    result: { name: 'chunk', schema: { $ref: '#/components/schemas/ChunkObject' } },
    errors: ['INVALID_PARAMS', 'INTERNAL_ERROR', 'RESOURCE_UNAVAILABLE'],
  },
  {
    name: 'dig.getAnchoredRoot',
    summary: 'Resolve the store’s CHIP-0035 on-chain head root (the trusted root).',
    description:
      'Walks the CHIP-0035 DataStore singleton lineage on coinset.org (digstore_chain::singleton::sync_datastore) and returns metadata.root_hash — the on-chain-anchored tip. This is the TRUSTED root a client pins a rootless chia:// URN against; verification must never trust the rpc-served "latest". Coinset host defaults to api.coinset.org (override DIG_NODE_COINSET). NODE-PROFILE ONLY: absent from the network profile (dig-node lib.rs:721-743).',
    paramStructure: 'by-name',
    params: [{ name: 'store_id', required: true, schema: { $ref: '#/components/schemas/StoreId' } }],
    result: {
      name: 'anchored',
      schema: {
        type: 'object',
        properties: {
          store_id: { $ref: '#/components/schemas/StoreId' },
          root: { $ref: '#/components/schemas/StoreId' },
        },
      },
    },
    errors: ['INVALID_PARAMS', 'INTERNAL_ERROR'],
  },
  {
    name: 'dig.stage',
    summary: 'Compile a local folder into a capsule .dig, in-process.',
    description:
      'Compiles a local directory into a capsule (.dig) in-process for preview/publish. NODE-PROFILE ONLY (dig-node lib.rs:768-904).',
    paramStructure: 'by-name',
    params: [{ name: 'path', required: true, schema: { type: 'string' } }],
    result: { name: 'staged', schema: { type: 'object', properties: { store_id: { $ref: '#/components/schemas/StoreId' }, root: { $ref: '#/components/schemas/StoreId' } } } },
    errors: ['INVALID_PARAMS', 'INTERNAL_ERROR'],
  },
  {
    name: 'cache.getConfig',
    summary: 'Read the local node cache configuration.',
    description: 'Part of the node-only cache.* control surface (getConfig/setCapBytes/clear/listCached/removeCached/fetchAndCache). NODE-PROFILE ONLY (dig-node lib.rs:1143-1231).',
    paramStructure: 'by-name',
    params: [],
    result: { name: 'config', schema: { type: 'object' } },
    errors: ['INTERNAL_ERROR'],
  },
  {
    name: 'dig.getPeers',
    summary: 'Return the peers this node knows, with peer_id + candidate addresses.',
    description:
      'Peer-exchange over RPC: the peers in this node\'s address book, each with its peer_id (SHA-256 of the peer\'s TLS SPKI DER) and candidate addresses. Mirrors the gossip RequestPeers/RespondPeers exchange so an agent can drive discovery without speaking the binary peer protocol. NODE-PROFILE ONLY. See https://docs.dig.net/docs/protocol/peer-network#peer-rpc.',
    paramStructure: 'by-name',
    params: [
      { name: 'network_id', required: false, schema: { type: 'string' }, description: 'Filter to one network (e.g. DIG_MAINNET).' },
      { name: 'limit', required: false, schema: { type: 'integer', minimum: 1 }, description: 'Cap the number of peers returned.' },
    ],
    result: {
      name: 'peers',
      schema: {
        type: 'object',
        required: ['peers'],
        properties: { peers: { type: 'array', items: { $ref: '#/components/schemas/PeerRecord' } } },
      },
    },
    errors: ['INVALID_PARAMS', 'INTERNAL_ERROR', 'PEER_UNREACHABLE'],
  },
  {
    name: 'dig.announce',
    summary: 'Advertise this node (peer_id + addresses) to a peer or the introducer.',
    description:
      'Announce this node\'s peer_id + candidate addresses so a target peer (or, if `target` is omitted, the relay introducer) learns to reach it. The RPC face of the introducer/announce path. NODE-PROFILE ONLY. See https://docs.dig.net/docs/protocol/peer-network#peer-rpc.',
    paramStructure: 'by-name',
    params: [
      { name: 'peer_id', required: true, schema: { $ref: '#/components/schemas/PeerId' }, description: 'The announcing node\'s peer_id.' },
      { name: 'addresses', required: true, schema: { type: 'array', items: { $ref: '#/components/schemas/CandidateAddress' } }, description: 'The announcing node\'s candidate addresses.' },
      { name: 'network_id', required: false, schema: { type: 'string' } },
      { name: 'target', required: false, schema: { $ref: '#/components/schemas/PeerId' }, description: 'A specific peer to announce to; omit to register with the relay introducer.' },
    ],
    result: {
      name: 'announced',
      schema: {
        type: 'object',
        required: ['accepted'],
        properties: {
          accepted: { type: 'boolean', description: 'Whether the announcement was accepted.' },
          known_peers: { type: 'integer', minimum: 0, description: 'The recipient\'s resulting peer-view size.' },
        },
      },
    },
    errors: ['INVALID_PARAMS', 'INTERNAL_ERROR', 'PEER_UNREACHABLE'],
  },
  {
    name: 'dig.getNetworkInfo',
    summary: 'Report this node\'s identity, reachability, candidate addresses + relay state.',
    description:
      'The node\'s own network posture: its peer_id, listen + STUN-reflexive addresses, candidate addresses, direct-vs-relayed reachability, and relay-reservation state. The self-describe surface for discovery + NAT traversal. NODE-PROFILE ONLY. See https://docs.dig.net/docs/protocol/peer-network#peer-rpc.',
    paramStructure: 'by-name',
    params: [],
    result: {
      name: 'network_info',
      schema: {
        type: 'object',
        required: ['peer_id', 'reachability'],
        properties: {
          peer_id: { $ref: '#/components/schemas/PeerId' },
          network_id: { type: 'string' },
          listen_addr: { type: 'string', description: 'The node\'s configured listen address (host:port).' },
          reflexive_addr: { type: ['string', 'null'], description: 'The STUN-discovered public IP:port, or null if not yet learned.' },
          candidate_addresses: { type: 'array', items: { $ref: '#/components/schemas/CandidateAddress' } },
          reachability: { type: 'string', enum: ['direct', 'relayed'], description: 'direct = a direct inbound path exists; relayed = only reachable through the relay.' },
          relay: {
            type: 'object',
            description: 'The relay reservation state.',
            properties: {
              url: { type: 'string', description: 'The relay endpoint (default wss://relay.dig.net:9450).' },
              reserved: { type: 'boolean', description: 'Whether a relay reservation (RLY-001) is currently held.' },
              connected_peers: { type: 'integer', minimum: 0 },
            },
          },
        },
      },
    },
    errors: ['INTERNAL_ERROR'],
  },
  {
    name: 'dig.getAvailability',
    summary: 'Batch-ask whether this peer holds given stores / roots / capsules (before fetching).',
    description:
      'The pre-fetch availability check. Batch per-item query at three granularities inferred from each item\'s fields — store_id only (has_store), + root (has_root / capsule), + retrieval_key (has_resource). Returns one answer per item (positionally aligned): available plus, where cheap, planning metadata (roots for a store; total_length + chunk_count + complete for a root/resource) so a downloader filters to holders and plans ranges WITHOUT a probe fetch. A small control RPC (message-style, not streamed). Absence is available:false, NOT an error. NODE-PROFILE ONLY. See https://docs.dig.net/docs/protocol/peer-network#availability.',
    paramStructure: 'by-name',
    params: [
      { name: 'items', required: true, schema: { type: 'array', items: { $ref: '#/components/schemas/AvailabilityItem' } }, description: 'The stores / roots / capsules to check in one call.' },
    ],
    result: {
      name: 'availability',
      schema: {
        type: 'object',
        required: ['items'],
        properties: { items: { type: 'array', items: { $ref: '#/components/schemas/AvailabilityAnswer' }, description: 'One answer per queried item, in the same order.' } },
      },
    },
    errors: ['INVALID_PARAMS', 'INTERNAL_ERROR'],
  },
  {
    name: 'dig.listInventory',
    summary: 'Enumerate what this peer serves — its stores, or the roots it holds for a store.',
    description:
      'Discovery variant of availability: omit store_id to list the stores the peer serves; supply it to list the roots the peer holds for that store. Best-effort — a peer MAY cap or omit enumeration (privacy/size); dig.getAvailability is the authoritative per-item check. NODE-PROFILE ONLY. See https://docs.dig.net/docs/protocol/peer-network#availability.',
    paramStructure: 'by-name',
    params: [
      { name: 'store_id', required: false, schema: { $ref: '#/components/schemas/StoreId' }, description: 'Omit to list stores; supply to list that store\'s roots.' },
      { name: 'limit', required: false, schema: { type: 'integer', minimum: 1 } },
    ],
    result: {
      name: 'inventory',
      schema: {
        type: 'object',
        properties: {
          store_id: { ...hex64, description: 'Echoed when roots are listed for a store.' },
          stores: { type: 'array', items: { ...hex64 }, description: 'The stores this peer serves (when store_id is omitted).' },
          roots: { type: 'array', items: { ...hex64 }, description: 'The roots this peer holds for the store (when store_id is given).' },
        },
      },
    },
    errors: ['INVALID_PARAMS', 'INTERNAL_ERROR'],
  },
  {
    name: 'dig.fetchRange',
    summary: 'Stream a byte range [offset, offset+length) of a resource or capsule (multi-source).',
    description:
      'STREAMING + BYTE-RANGE fetch: return only the requested byte range of a content resource (store_id + retrieval_key) or a whole capsule/.dig (capsule: true, identified by store_id[:root]), delivered as an ordered STREAM of RangeFrame chunks over a logical stream of the multiplexed peer transport (read incrementally with backpressure; reassemble by offset). The FIRST frame carries total_length + chunk_lens + chunk_index + inclusion_proof so the range is INDEPENDENTLY verifiable against the capsule\'s chain-anchored merkle root — a downloader fans different ranges out to different peers concurrently, verifies each, retries a bad range from another source, and resumes per-range. The range is widened to whole-chunk boundaries so each returned chunk is a complete verifiable unit; length is clamped to the node window (3 MiB). NODE-PROFILE ONLY. See https://docs.dig.net/docs/protocol/peer-network#range.',
    paramStructure: 'by-name',
    params: [
      { name: 'store_id', required: true, schema: { $ref: '#/components/schemas/StoreId' } },
      { name: 'retrieval_key', required: false, schema: { $ref: '#/components/schemas/RetrievalKey' }, description: 'The content resource to fetch; omit when capsule=true.' },
      { name: 'root', required: false, schema: { $ref: '#/components/schemas/Root' }, description: 'The generation; defaults to the chain-anchored tip.' },
      { name: 'capsule', required: false, schema: { type: 'boolean', default: false }, description: 'true to fetch the whole capsule/.dig (identified by store_id[:root]) instead of a resource.' },
      { name: 'offset', required: false, schema: { type: 'integer', minimum: 0, default: 0 }, description: 'Byte offset into the resource ciphertext.' },
      { name: 'length', required: true, schema: { type: 'integer', minimum: 1 }, description: 'Bytes to return; clamped to the node window (3 MiB) and widened to whole-chunk boundaries.' },
    ],
    result: { name: 'frame', schema: { $ref: '#/components/schemas/RangeFrame' } },
    errors: ['INVALID_PARAMS', 'INTERNAL_ERROR', 'RESOURCE_UNAVAILABLE', 'RANGE_NOT_SATISFIABLE'],
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
  INTERNAL_ERROR: { code: -32603, message: 'Internal error', meaning: 'The node failed to satisfy a well-formed call.' },
  RESOURCE_UNAVAILABLE: { code: -32004, message: 'Resource not available at the requested root', meaning: 'A genuine infrastructure miss (no host seed, module absent in both buckets, bad magic, oversize, a wasmtime trap, or an undecodable envelope) — distinct from a content miss, which is an indistinguishable decoy with no error.' },
  ROOT_NOT_ANCHORED: { code: -32005, message: 'Root not chain-anchored', meaning: 'The requested or served generation is not the store’s current on-chain root. A content read is pinned to the CHIP-0035 singleton’s on-chain root (resolved live from the chain, never trusted from the serving node): a requested root that is not the on-chain root, an unreachable chain, or a store with no confirmed generation fails closed with this code rather than serving an unverified generation. Omit root to take the chain tip.' },
  PEER_UNREACHABLE: { code: -32006, message: 'Peer unreachable', meaning: 'No connection to the named peer could be established — every NAT-traversal strategy (direct, UPnP/NAT-PMP/PCP mapping, relay-coordinated hole-punch, and relayed fallback) failed, or the peer is not registered on this network. Returned by the node-profile peer methods (dig.getPeers / dig.announce / dig.getNetworkInfo).' },
  RANGE_NOT_SATISFIABLE: { code: -32007, message: 'Range not satisfiable', meaning: 'The requested byte range lies outside the resource (offset >= total_length) or is otherwise unsatisfiable. Returned by the node-profile dig.fetchRange when the offset/length cannot be served.' },
  CONTENT_REDIRECT: { code: -32008, message: 'Content held elsewhere — redirect', meaning: 'This node does not hold the requested content, but it located peers that do (via the DHT) — a redirect, not a not-found. error.data.redirect names the holder(s) (providers[] = peer_id + candidate addresses), the requested content, and the bounded redirect budget (redirect_depth, max_redirects). Returned by the node-profile content methods (dig.getContent / dig.fetchRange) on a local miss when a provider exists; re-request against a named provider, echoing redirect_depth.' },
  UPSTREAM_ERROR: { code: -32010, message: 'Upstream error', meaning: 'A thin-shell node relayed a method it does not resolve locally to its upstream DIG RPC, and the upstream was unreachable or returned a non-JSON response.' },
  STAGE_DIR_UNREADABLE: { code: -32011, message: 'Stage: source directory unreadable', meaning: 'dig.stage (local control) could not read the source directory.' },
  STAGE_NO_FILES: { code: -32012, message: 'Stage: no files to stage', meaning: 'dig.stage found no files in the source directory.' },
  STAGE_OVER_CAP: { code: -32013, message: 'Stage: content exceeds capsule size cap', meaning: 'dig.stage content exceeds the capsule size cap.' },
  STAGE_COMPILE_IO: { code: -32014, message: 'Stage: compile/IO failure', meaning: 'dig.stage hit a compile or IO failure while building the module.' },
  ONION_CIRCUIT_UNAVAILABLE: { code: -32020, message: 'Onion circuit unavailable', meaning: 'A mode:"privacy" content read could not be served privately (no circuit could be built or a circuit died mid-fetch). The node MUST NOT downgrade to a direct fetch — that would deanonymize the very reader who asked for privacy — so it fails closed with this code. Retry, or the client may explicitly choose a fast (mode:"speed") fetch instead. See https://docs.dig.net/docs/protocol/onion-routing.' },
  PRIVACY_REQUIRES_LOCAL_NODE: { code: -32021, message: 'Privacy requires a local node', meaning: 'mode:"privacy" was requested but the caller is not the node\'s own trusted local originator (loopback / dig.local). A node will not fetch privately on a remote/anonymous caller\'s behalf (that would hand it the caller\'s identity + query), so privacy mode requires a local DIG node. See https://docs.dig.net/docs/protocol/onion-routing#toggle-placement.' },
  ONION_HOPS_OUT_OF_RANGE: { code: -32022, message: 'Onion hop count out of range', meaning: 'The requested privacy.hops (circuit length) is outside the allowed range [2, 5] (default 3). Request a hop count within range. See https://docs.dig.net/docs/protocol/onion-routing#modes.' },
  CONTROL_UNAUTHORIZED: { code: -32030, message: 'Unauthorized (control)', meaning: 'A control.* method was called without a valid local control token. Control methods are loopback-only. Control codes are -32030+ so they never collide with the onion codes -32020/21/22.' },
  CONTROL_NOT_SUPPORTED: { code: -32031, message: 'Not supported (control)', meaning: 'A control operation this build/pin cannot perform (e.g. §21 whole-store sync with no loaded identity).' },
  CONTROL_ERROR: { code: -32032, message: 'Control error', meaning: 'A control operation failed at runtime — distinct from bad input or an absent capability.' },
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

/** dig-store CLI process exit codes (0..16). Mirrors CliError::exit_code in
 *  dig-store crates/digstore-cli/src/error.rs. */
export const cliCatalog = [
  { exit: 0, code: 'success', description: 'The command completed.' },
  { exit: 1, code: 'other', description: 'An unclassified error. Re-run with --verbose.' },
  { exit: 2, code: 'invalid-argument', description: 'A flag or argument was invalid.' },
  { exit: 3, code: 'no-store', description: 'No store found here. Run `dig-store init`.' },
  { exit: 4, code: 'not-found', description: "A resource/URN/root wasn't found." },
  { exit: 5, code: 'verification-failed', description: 'Content failed cryptographic verification (wrong salt/key or tampered data).' },
  { exit: 6, code: 'network', description: 'A network/transport failure.' },
  { exit: 7, code: 'non-fast-forward', description: 'The remote root has advanced past yours. Pull first.' },
  { exit: 8, code: 'unauthorized', description: 'Not authorized for this action.' },
  { exit: 9, code: 'no-seed', description: 'No wallet seed is set up.' },
  { exit: 10, code: 'bad-passphrase', description: 'Wrong passphrase for the seed.' },
  { exit: 11, code: 'invalid-mnemonic', description: 'The mnemonic is invalid (check word list / count).' },
  { exit: 12, code: 'insufficient-funds', description: 'Not enough XCH or DIG to cover the spend (the uniform capsule price in $DIG + XCH fee per capsule).' },
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
  { code: 'DIG_INSUFFICIENT', http: 429, wire: 'over_quota', description: "Not enough $DIG in your wallet to cover this capsule's price." },
  { code: 'COIN_CONFLICT', http: 409, wire: 'coin_reserved', description: 'The coin was just spent elsewhere (double-spend / mempool conflict).' },
  { code: 'REG_PENDING', http: null, wire: null, description: 'Your spend is on chain and will appear shortly. Do not sign or pay again.' },
  { code: 'WALLET_SESSION', http: 401, wire: 'unauthorized', description: "Your wallet session can't sign (expired, watch-only, or missing method)." },
  { code: 'NET_OFFLINE', http: null, wire: null, description: 'You appear to be offline.' },
  { code: 'NET_TIMEOUT', http: null, wire: null, description: "The request timed out or couldn't reach the network." },
  { code: 'SLUG_TAKEN', http: 409, wire: 'slug_taken', description: 'That store name is already taken.' },
  { code: 'OVER_QUOTA', http: 429, wire: 'over_quota', description: "You've reached the store limit for this account." },
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
