# docs.dig.net — repo operating notes

The DIG Network documentation site (Docusaurus). Most pages are ordinary Markdown you
can edit freely. The one load-bearing exception is the machine-spec drift gate below —
read it before touching the error catalog or the RPC method tables, or an innocent-looking
one-line docs edit will fail the build with an error that points nowhere obvious.

## The machine-spec drift gate (READ before editing error codes or RPC methods)

**These files are a single unit and MUST move together in the same commit:**

| File | Role |
|------|------|
| `scripts/dig-spec.mjs` | **Source of truth** — the data module for the ecosystem's cross-surface machine specs (dig RPC methods + the error catalog across every surface). |
| `docs/support/error-codes.md` | The human-facing **prose** error table (per surface: `dig-rpc`, `digstore-cli`, `dighub`, `dig-loader`). |
| `docs/rpc/methods.md`, `docs/rpc/streaming.md` | The human-facing prose RPC spec. |
| `static/openrpc.json`, `static/openrpc-node.json`, `static/error-codes.json`, `static/knowledge-graph.json` | **Generated** artifacts consumed by every other module (dig-store, hub, dig-sdk, the extension, the browser). Never hand-edit. |

**The gate:** `scripts/gen-machine-specs.mjs` renders the JSON from `dig-spec.mjs` **and**
drift-checks it against the prose tables — `driftGate()` parses each surface's first-column
codes out of `error-codes.md` and `assertSetEqual`s them against the catalog, throwing
`error-codes drift for <surface> — only in error-codes.json: … / only in error-codes.md: …`
on any divergence. `npm run gen` runs that check, and it is wired into every build and dev
start via `prebuild`/`prestart` (`package.json`). So a throw here **fails the build**.

**What this means in practice:**

- Editing the error table in `docs/support/error-codes.md` **alone** (adding, removing, or
  renumbering a code) makes `error-codes.md` and `dig-spec.mjs` disagree → the next
  `npm run build` (or `npm start`) fails in `prebuild → gen`, not in a place that mentions
  your `.md` edit. The failure message is the pointer: it names the surface and which side
  has the extra code.
- **The fix is never to weaken the gate.** Make the change in `scripts/dig-spec.mjs` too, run
  `npm run gen` in the **same commit** so the `static/*.json` artifacts regenerate and match,
  and commit all three together (source + prose + regenerated JSON).
- Adding a brand-new error code: add it to `dig-spec.mjs`'s catalog **and** the matching
  surface table in `error-codes.md`, then `npm run gen`.

Proven load-bearing: delete a row from `error-codes.md` and run `npm run gen` — the generator
rejects the orphaned entry rather than silently emitting a stale catalog.

**General pattern (not unique to this repo):** any surface generated from a canonical source
plus a prose mirror carries a regen ceremony, and if that ceremony isn't documented where the
editor looks first, the first symptom is an unexplained build failure. The ecosystem records
this pattern in the superproject `frontend-baseline` skill.
