---
sidebar_position: 1
---

:::tip 💜 Support the DIG Network
**Help build the future of decentralized storage!** The DIG Network is an open-source project that needs community support to continue development. 

**[💜 Support the Project →](../support.md)** - Donate crypto, buy NFTs, or sponsor development
:::

# System Architecture

The DIG Network functions as a comprehensive **DataLayer** for the Chia blockchain, providing decentralized storage, content delivery, and data integrity services through a sophisticated system of interconnected primitives. By combining on-chain coordination mechanisms with off-chain storage solutions, the DIG Network creates a trustless, incentive-aligned infrastructure that extends Chia's capabilities beyond simple financial transactions to encompass arbitrary data storage and distribution.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         DIG Network Complete Architecture                      │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                 │
│ │ File Header     │  │ Metadata        │  │ 7-Table Chain   │                 │
│ │ 1024 bytes      │  │ TLV Format      │  │ Proof-of-Work   │                 │
│ │ • Magic: DIGP   │  │ • Plot Config   │  │ • Crypto Chain  │                 │
│ │ • PlotId        │  │ • Compression   │  │ • Chia Anchor   │                 │
│ │ • Offsets       │  │ • Difficulty    │  │ • Index Tables  │                 │
│ └─────────────────┘  └─────────────────┘  └─────────────────┘                 │
│                                                                                 │
│ ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                 │
│ │ Index Section   │  │ Data Chunks     │  │ Verification    │                 │
│ │ Multi-Layer     │  │ Optimized Blobs │  │ Cryptographic   │                 │
│ │ • Hash O(1)     │  │ • Dynamic Size  │  │ • BLS Signatures│                 │
│ │ • B+ Tree O(logn)│  │ • Compression   │  │ • Merkle Trees  │                 │
│ │ • Bloom Filter  │  │ • Streaming     │  │ • ZK Anchors    │                 │
│ └─────────────────┘  └─────────────────┘  └─────────────────┘                 │
│                                                                                 │
│ PERFORMANCE PROFILE:                    SECURITY PROFILE:                      │
│ • TB-scale plots                       • Proof-of-work resistant              │
│ • Constant memory                      • Cryptographically signed             │
│ • O(1) blob lookup                     • Merkle tree verified                 │
│ • Streaming compatible                 • Zero-knowledge ready                  │
│ • 500MB/s throughput                   • Blockchain anchored                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Core Primitive Layers

The network operates through a carefully designed architecture of primitives that work together to create a complete decentralized storage ecosystem:

### On-Chain Primitives

These primitives exist as smart contracts and on-chain data structures on the Chia blockchain, providing coordination, verification, and incentive mechanisms:

- **[PlotCoin](../primitives/on-chain/plotcoin.md)** - Blockchain registry entries that map data identifiers (blobIds) to storage providers
- **[Rewards Distributor](../primitives/on-chain/rewards-distributor.md)** - On-chain escrow and distribution system for DIG tokens
- **[DataStore](../primitives/on-chain/datastore.md)** - NFT-based containers that represent collections of data
- **[DIG Handles](../primitives/on-chain/dig-handles.md)** - Human-readable domain names (*.dig) that map to DataStore identifiers
- **[DIG Token](../economics/token-model.md)** - Native utility token for staking, rewards, and governance

### Off-Chain Primitives

These primitives exist as data structures and protocols that operate outside the blockchain while maintaining cryptographic verifiability:

- **[Plot](../primitives/off-chain/plots.md)** - Cryptographically secured storage containers with embedded proof-of-work
- **[Quarry](../primitives/off-chain/quarry.md)** - Collections of related Plots (future implementation)
- **[Cart](../primitives/off-chain/cart.md)** - Lightweight transport packages for data transfer (future implementation)

## DataLayer Integration

The DIG Network primitives work together to form a complete DataLayer that extends the Chia blockchain's capabilities:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    DIG Network DataLayer Integration                           │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  CHIA BLOCKCHAIN LAYER                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ • PlotCoins (storage proof registry)                                   │   │
│  │ • DataStores (data ownership NFTs)                                     │   │
│  │ • DIG Handles (human-readable domains)                                 │   │
│  │ • Rewards Distributors (incentive escrow)                              │   │
│  │ • DIG Tokens (economic coordination)                                   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    ↕                                            │
│  COORDINATION & VERIFICATION LAYER                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ • Zero-knowledge proof verification                                     │   │
│  │ • Economic incentive alignment                                          │   │
│  │ • Cryptographic integrity checks                                        │   │
│  │ • Cross-layer integration protocols                                     │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    ↕                                            │
│  OFF-CHAIN STORAGE LAYER                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ • Plot storage containers                                               │   │
│  │ • Cryptographic proof generation                                        │   │
│  │ • Data transport and distribution                                       │   │
│  │ • Proof-of-work computational commitment                                │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Key Integration Properties

- **On-chain coordination** provides verification and economic incentives
- **Off-chain storage** handles actual data storage, transport, and cryptographic proofs  
- **Cross-layer integration** ensures off-chain operations are verifiable through on-chain mechanisms
- **Economic alignment** creates sustainable incentives for data preservation and availability
- **Cryptographic security** maintains data integrity and access control across both layers

## Zero-Knowledge Proof System

The DIG Network implements a comprehensive [zero-knowledge proof system](../zk-proofs/overview.md) that enables trustless verification without revealing sensitive information:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         ZK Proof System Integration                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  PLOT OWNERS: Generate Proofs & Register in PlotCoin Registry                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐           │   │
│  │  │   Plot Data   │───▶│  ZK Proof     │───▶│   PlotCoin    │           │   │
│  │  │   + Network   │    │  Generation   │    │   Registry    │           │   │
│  │  │   Location    │    │  (5 proofs)   │    │   Entry       │           │   │
│  │  └───────────────┘    └───────────────┘    └───────────────┘           │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                            │
│                                    ▼                                            │
│  VALIDATORS: Query Registry & Verify Proofs                                    │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐           │   │
│  │  │ Query Registry│───▶│ Extract Proofs│───▶│ Zero-Knowledge│           │   │
│  │  │ by blobId     │    │ & Verify ZK   │    │ Verification  │           │   │
│  │  │               │    │ Packages      │    │ (no secrets)  │           │   │
│  │  └───────────────┘    └───────────────┘    └───────────────┘           │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

The system provides five core proof types that work together:

1. **[Plot Creation Proof](../zk-proofs/plot-creation.md)** - Proves plot ownership and computational work
2. **[Data Inclusion Proof](../zk-proofs/data-inclusion.md)** - Proves specific data exists in the plot
3. **[Ownership Verification](../zk-proofs/ownership.md)** - Proves legitimate ownership of data
4. **[Computational Work Proof](../zk-proofs/computational-work.md)** - Proves work is bound to plot and data
5. **[Physical Access Proof](../zk-proofs/physical-access.md)** - Proves current access to stored data

## Economic Model

The [DIG Token economy](../economics/token-model.md) creates sustainable incentives for network participation:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           DIG Token Economy Flow                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐             │
│  │ Content         │───▶│ DIG Handle      │───▶│ Validator       │             │
│  │ Publishers      │    │ Registry        │    │ Compensation    │             │
│  │ (Pay DIG)       │    │ (Value Signal)  │    │ (Service Fees)  │             │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘             │
│                                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐             │
│  │ DIG Nodes       │◄───│ Rewards         │◄───│ Validators      │             │
│  │ (Earn Rewards)  │    │ Distributor     │    │ (Verify & Award)│             │
│  │                 │    │ (Escrow)        │    │                 │             │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘             │
│           │                                                                     │
│           ▼                                                                     │
│  ┌─────────────────┐    ┌─────────────────┐                                    │
│  │ PlotCoin        │    │ TibetSwap       │                                    │
│  │ Staking         │    │ Liquidity       │                                    │
│  │ (Economic Lock) │    │ (Market Access) │                                    │
│  └─────────────────┘    └─────────────────┘                                    │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Network Operations

The network operates through several key processes:

### [Data Storage Flow](../network/data-storage.md)
1. Content publishers create DataStores and plot data into storage containers
2. Plot owners stake DIG tokens to create PlotCoins proving storage
3. Validators verify storage proofs and award rewards

### [Content Discovery](../network/content-discovery.md)  
1. Publishers register DIG Handles for human-readable access
2. Users query the network for content by handle or blobId
3. Network returns multiple storage provider options

### [Reward Distribution](../network/rewards.md)
1. Validators randomly select blobs for verification
2. Qualifying storage providers receive DIG token rewards
3. Economic incentives encourage diverse, reliable storage

### [Network Propagation](../network/propagation.md)
The network uses blob-level propagation where content spreads organically based on economic incentives, creating natural redundancy and censorship resistance.

## Security Properties

The architecture provides multiple layers of security:

- **Cryptographic Integrity**: Hash chains and Merkle trees detect tampering
- **Economic Security**: Staking requirements prevent spam and align incentives  
- **Zero-Knowledge Privacy**: Verification without revealing sensitive data
- **Decentralized Coordination**: No single points of failure or control
- **Proof-of-Work Commitment**: Computational requirements prevent storage fraud

This comprehensive architecture enables the DIG Network to provide secure, efficient, and censorship-resistant data storage while maintaining the decentralized properties that make it resilient and trustless. 