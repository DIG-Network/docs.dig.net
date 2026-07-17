# Changelog

All notable changes to this project are documented here.
This project adheres to [Semantic Versioning](https://semver.org) and
[Conventional Commits](https://www.conventionalcommits.org).

## [0.4.6] - 2026-07-17

### Documentation
- Align resource-ID/URN examples to canonical form + add URN-format lint (#691) (#41)

## [0.4.5] - 2026-07-17

### Documentation
- Rename digstore->dig-store product/repo/binary refs + regen machine artifacts (#40)

## [0.4.4] - 2026-07-14

### Documentation
- Dign/digd CLI aliases + DIG-and-your-DNS posture page (#39)

## [0.4.3] - 2026-07-13

### Documentation
- Native OS packages, chia:// scheme handler, and service-node pairing (#38)

## [0.4.2] - 2026-07-12

### CI
- Add flaky-test management (#489) (#37)

## [0.4.1] - 2026-07-12

### Bug Fixes
- **docs:** Correct Discord invite (imposter link -> official) (#36)

## [0.4.0] - 2026-07-12

### Documentation
- **digstore:** Note digs as a first-class alias for the digstore CLI (#35)

## [0.3.22] - 2026-07-11

### Documentation
- **intro:** State the $DIG North Star ethos in the introduction (#34)

## [0.3.21] - 2026-07-11

### Documentation
- **install:** Document the DIG Installer's universal-default stack (#33)

## [0.3.20] - 2026-07-11

### Documentation
- Local-node SPA serving, local-first caching, omnibox + DIG toolbar (#32)

## [0.3.19] - 2026-07-11

### Documentation
- **support:** Document PNA preflight fix + DIG_NETWORK_GENESIS override (#31)

## [0.3.18] - 2026-07-11

### Documentation
- **run-a-node:** Dig-node control panel user guide (cache/LRU, pairing, live status) (#30)

## [0.3.17] - 2026-07-10

### Documentation
- **run-a-node:** Document the dig-installer GUI wizard (#29)

## [0.3.16] - 2026-07-10

### Documentation
- **nft:** Document large-collection auto-batching + --batch-size + resume for collection mint (#28)

## [0.3.15] - 2026-07-10

### Documentation
- **journeys:** Step-by-step Sage wallet-connect guide (#27)

## [0.3.14] - 2026-07-10

### Documentation
- **build-a-dapp:** Deploy an existing app via the hub web upload (#25)

## [0.3.13] - 2026-07-10

### Documentation
- **run-a-node:** Document the wallet-data auto-detect indicator (#23)

## [0.3.12] - 2026-07-10

### Documentation
- **run-a-node:** Document dig-node auto-start service + health check (#24)

## [0.3.11] - 2026-07-09

### Documentation
- Dig-dns 13-locale materialization + Super Supporter discount docs

## [0.3.10] - 2026-07-09

### Documentation
- **run-a-node:** Document the extension wallet-data source switch (#217) (#21)

## [0.3.9] - 2026-07-09

### Documentation
- **browser:** Add a wallet-security page for the extension's self-custody wallet (#20)

## [0.3.8] - 2026-07-07

### Documentation
- **browser:** Document the extension's open-by-URN home input (#172) (#19)

## [0.3.7] - 2026-07-07

### Documentation
- **run-a-node:** Document dig-dns install via the universal installer (#18)

## [0.3.6] - 2026-07-06

### Documentation
- **faq:** Note the *.on.dig.net handle discount needs the NFT in-wallet (#143) (#16)

## [0.3.5] - 2026-07-06

### Documentation
- **digstore:** Clarify macOS raw-binary install, real self-updater, and canonical publish flow (#15)

## [0.3.4] - 2026-07-06

### Documentation
- Add the window.chia provider reference for integrating developers (#14)

## [0.3.3] - 2026-07-06

### Documentation
- **sdk:** Document the dig-sdk Browser Wallet vs WalletConnect chooser

## [0.3.2] - 2026-07-04

### Documentation
- Add the Quests & staking hub-user guide (#42) (#12)

## [0.3.1] - 2026-07-04

### Documentation
- **chip-0035:** Document well-known origin pubkey discovery + authorize-origin-as-writer (#11)

## [0.3.0] - 2026-07-04

### Features
- **protocol:** Specify the rpc.dig.net dual-mode gateway + ephemeral read certs (#10)

## [0.2.0] - 2026-07-04

### Documentation
- Add 'Submit your dApp to the store' page (explore.dig.net listing flow) (#9)

## [0.1.0] - 2026-07-04

### Features
- Implemented home page feature dark and light icons- Applied home page banner- Added homepage icon SVG's- Update features page with react FC arrow functions- **seo:** Complete social card + link metadata via config

### Bug Fixes
- Wrong icons show up on page refresh- **docs:** Gray background on scroll — paint <html>, not a non-matching selector- **docs:** Broken GitHub navbar icon — mask a real SVG file

### Refactor
- Remove orphaned HomepageFeatures dead code

### Documentation
- Revamp for DigStore — format overview + CLI tutorial + brand restyle- Scope site to DIG Network; DigStore becomes a dedicated section- Polished cosmic landing page (DIG Network)- Update for digstore v0.5.0 on-chain anchoring (seed/anchor commands, init mints, commit anchors, chain-verified clone/pull, store_id = launcher id)- DIG token costs (init 100, commit 10) + digstore balance- **rpc:** Add the dig:// remote (clone/pull/push) page- Align user-facing terminology with hub (project/deployment)- Add window.chia DIG Browser guide; rename dig:// scheme to chia://- Introduce capsule (storeId:rootHash) terminology- Add chia:// protocol & URN scheme page (DIG Browser)- Conservative consistency pass (frontmatter, titles, terminology, links)- Add "try it" funnels into the product (close dead-ends)- Glue to the DIG Network whitepapers (dig.net/whitepapers)- Migrate whitepapers into a dedicated low-prominence Whitepapers section- Ecosystem UX consistency pass (brand, link arrows, OG dims, type, alpha badge)- Make the docs agent-friendly (graph-extractable, still human-first)- Add "Deploy from GitHub Actions" CLI page- Wave-1 developer-platform slice (cost fix, zero-cost quickstart, support, role-based sidebar)- Remove trademarked competitor names (Vercel) from prose- Digstore new/dev are live — flip the quickstart "coming soon" to available- Build-a-dapp tutorial + gallery, dig.toml/build-config, changelog/status (#26/#28/#47)- Normative, versioned window.chia provider spec + EIP-6963 discovery (#22)- Correct the on.dig.net auto-serve claim across the docs- List all three ways to get DIG (TibetSwap, dexie.space, 9mm.pro)- Fix stale deploy-action, complete CLI reference, surface Paywall- Correct the CLI/remote scheme to dig://, align hub naming- Order the sidebar by audience priority — deploy before build-dapps- Fix hub wordmark casing DIGHub -> DIGHUb- Use the $DIG sigil on first token reference (+ residual DIGHUb casing)- Use chia:// for content-open prose; drop "project" as a store synonym- Status page → live status.dig.net + agent-readable health/status/schema endpoints (#98)- **rpc:** Regenerate machine surfaces from reality- **protocol:** Rewrite the Protocol section as a first-class spec- Point reference pages at the authoritative Protocol spec- **protocol:** Make the Protocol spec a clean authoritative spec (no drift framing)- **protocol:** Add L7 DIG Node peer network spec (mTLS identity, NAT-traversal ladder, relay wire, peer RPC)- **protocol:** Refine peer network spec — relay's four roles, streaming + byte-range multi-source fetch, availability queries- **protocol:** Document the dig-dht Kademlia DHT content-discovery layer (L7)- Add missing canonical RPC error codes (#200b) — -32010, -32011..14, control -32030/31/32- Fix error-codes drift — add -32010/-32011..14/-32030..32 to the canonical rpcErrors enum- Document the digstore client-node resolution ladder (#193)- Finish dig-companion rename cleanup (#168 tail); sync locale error-codes taxonomy (#200)- Tip embed is now the xchtip.app widget (retire hub dig-tip.js offering)- Capsule-format — add the normalized public manifest (SectionId 13)

### CI
- Add deployment workflow- Add commitlint + version-increment gate + git-cliff changelog config (#230 pipeline lockdown)- Release automation — git-cliff changelog + tag on merge, deploy on tag (#230 Unit 2)

### Styling
- **docs:** Space the navbar title off the wordmark

### Peer-network
- IPv6-first address-family policy + real getNetworkInfo posture- Clarify the peer JSON-RPC surface is an allowlist


