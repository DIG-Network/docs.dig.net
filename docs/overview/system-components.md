---
sidebar_position: 2
---

# System Components and Interactions

:::tip 💜 Support the DIG Network
**Help build the future of decentralized storage!** The DIG Network is an open-source project that needs community support to continue development. 

**[💜 Support the Project →](../support.md)** - Donate crypto, buy NFTs, or sponsor development
:::

## Core Components and Interactions

### **Content Creation and Publishing Flow**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        Content Creation and Publishing                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  1. CONTENT CREATION                                                           │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ Developer/Creator → Original Content → DataStore NFT Creation           │   │
│  │ • Web applications  • Digital media  • Software distributions          │   │
│  │ • Documentation    • Data archives   • Any digital content             │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                            │
│                                    ▼                                            │
│  2. VALUE SIGNALING                                                            │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ DataStore NFT → DIG Handle Registration (*.dig domain) → Economic Signal│   │
│  │ • Human-readable access        • Market-driven pricing                  │   │
│  │ • SEO-friendly domains         • Value signal to network                │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                            │
│                                    ▼                                            │
│  3. CONTENT FRAGMENTATION                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ DataStore Content → Blob Fragmentation → Merkle Tree Organization       │   │
│  │ • Content split into blobs     • Cryptographic integrity               │   │
│  │ • Optimized for distribution   • Tamper-evident storage                │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                            │
│                                    ▼                                            │
│  4. DATASTORE PUSH TO DIG NODE                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ Content Creator → Push DataStore → DIG Node → Network Propagation       │   │
│  │ • Upload content to storage provider    • DIG Node plots the data       │   │
│  │ • Trigger network-wide propagation     • Creates PlotCoins for rewards  │   │
│  │ • Enable content discovery and access  • Content becomes globally available│   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### **Storage Provider Operations**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           Storage Provider Operations                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  1. CONTENT RECEPTION AND DISCOVERY                                            │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ Receive DataStore Push → Monitor DIG Handles → P2P Blob Discovery       │   │
│  │ • Accept content from creators  • Track valuable content               │   │
│  │ • Monitor market signals        • Discover blobs from peers            │   │
│  │ • P2P protocol for peer content • Optimize storage portfolio           │   │
│  │ • Economic value assessment     • Maximize reward potential             │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                            │
│                                    ▼                                            │
│  2. PLOT CREATION AND PROOF GENERATION                                         │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ Blob Storage → Plot Files → Zero-Knowledge Proof Generation → PlotCoins│   │
│  │ • Store blobs in plot files    • Generate 5 types of ZK proofs         │   │
│  │ • Create cryptographic plots   • Prove storage without revealing secrets│   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                            │
│                                    ▼                                            │
│  3. BLOCKCHAIN REGISTRATION                                                    │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ PlotCoin Creation → DIG Token Staking → Blockchain Registration         │   │
│  │ • Stake tokens for participation  • Register proof of storage           │   │
│  │ • Network location verification   • Enable reward eligibility           │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### **Validation and Reward Distribution**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        Validation and Reward Distribution                      │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  1. RANDOM BLOB SELECTION                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ Validators → Chia Block Hash → Deterministic Random Selection → Blob ID │   │
│  │ • Unpredictable but verifiable  • Prevents gaming                      │   │
│  │ • Fair reward distribution     • Incentivizes diverse storage          │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                            │
│                                    ▼                                            │
│  2. STORAGE PROVIDER DISCOVERY                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ Blob ID → PlotCoin Registry Query → Active Storage Providers Discovery  │   │
│  │ • Find all providers storing blob • Filter for recent registrations    │   │
│  │ • Check staking requirements      • Verify network accessibility       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                            │
│                                    ▼                                            │
│  3. COMPREHENSIVE VERIFICATION                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ Zero-Knowledge Proof Verification → Network Liveness Testing → Fraud   │   │
│  │ • Verify 5 ZK proofs without learning secrets                          │   │
│  │ • Test actual data accessibility • Detect and prevent fraud            │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                            │
│                                    ▼                                            │
│  4. REWARD DISTRIBUTION                                                        │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ Verified Providers → Reward Calculator → DIG Token Distribution         │   │
│  │ • Weight by performance metrics   • Distribute escrowed tokens         │   │
│  │ • Economic incentive alignment    • Sustainable circular economy       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Component Integration Overview

### **On-Chain Primitives**
- **[PlotCoin](../primitives/on-chain/plotcoin.md)** - Blockchain registry entries that map data identifiers (blobIds) to storage providers
- **[Rewards Distributor](../primitives/on-chain/rewards-distributor.md)** - On-chain escrow and distribution system for DIG tokens
- **[DataStore](../primitives/on-chain/datastore.md)** - NFT-based containers that represent collections of data
- **[DIG Handles](../primitives/on-chain/dig-handles.md)** - Human-readable domain names (*.dig) that map to DataStore identifiers
- **[DIG Token](../economics/token-model.md)** - Native utility token for staking, rewards, and governance

### **Off-Chain Primitives**
- **[Plot](../primitives/off-chain/plots.md)** - Cryptographically secured storage containers with embedded proof-of-work
- **[Cart](../primitives/off-chain/cart.md)** - Lightweight transport packages for data transfer (future implementation)

### **Zero-Knowledge Proof System**

The DIG Network implements a comprehensive [zero-knowledge proof system](../proofs/overview.md) with five core proof types:

1. **[Plot Ownership Proof](../proofs/plot-ownership.md)** - Proves plot ownership and computational work
2. **[Data Inclusion Proof](../proofs/data-inclusion.md)** - Proves specific data exists in the plot
3. **[Computational Work Proof](../proofs/computational-work.md)** - Proves work is bound to plot and data
4. **[Physical Access Proof](../proofs/physical-access.md)** - Proves current access to stored data

### **Integration Properties**

- **On-chain coordination** provides verification and economic incentives
- **Off-chain storage** handles actual data storage, transport, and cryptographic proofs  
- **Cross-layer integration** ensures off-chain operations are verifiable through on-chain mechanisms
- **Economic alignment** creates sustainable incentives for data preservation and availability
- **Cryptographic security** maintains data integrity and access control across both layers 