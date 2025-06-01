---
sidebar_position: 1
---

# DIG Network Protocol

:::info Living Document
This is a **living whitepaper** that will be continuously updated as research and development in the DIG Network continues. The protocol, specifications, and economic models described here may evolve based on ongoing development, community feedback, and real-world testing.
:::

:::tip 💜 Support the DIG Network
**Help build the future of decentralized storage!** The DIG Network is an open-source project that needs community support to continue development. 

**[💜 Support the Project →](./support.md)** - Donate crypto, buy NFTs, or sponsor development
:::

## The Complete System at a Glance

The **DIG Network Protocol** establishes a robust and resilient distributed content delivery network built on the Chia blockchain. At its core, the protocol creates a system of **incentivized data persistence**, ensuring that information remains available and resistant to censorship through blockchain-verified data integrity and economic incentives.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           DIG Network Complete System                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  CONTENT PUBLISHERS                          STORAGE PROVIDERS                  │
│  ┌─────────────────────┐                    ┌─────────────────────┐           │
│  │ • Create DataStores │                    │ • Operate DIG Nodes │           │
│  │ • Register DIG      │                    │ • Store Plot Files  │           │
│  │   Handles (*.dig)   │                    │ • Generate ZK Proofs│           │
│  │ • Signal Content    │                    │ • Earn DIG Tokens   │           │
│  │   Value             │                    │                     │           │
│  └─────────────────────┘                    └─────────────────────┘           │
│            │                                           │                       │
│            ▼                                           ▼                       │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                    CHIA BLOCKCHAIN REGISTRY                             │   │
│  │                                                                         │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │   │
│  │  │ DataStores  │  │ DIG Handles │  │ PlotCoins   │  │ Rewards     │   │   │
│  │  │ (NFTs)      │  │ (Domains)   │  │ (Proofs)    │  │ Distributor │   │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                     │                                           │
│                                     ▼                                           │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                          VALIDATOR NETWORK                              │   │
│  │                                                                         │   │
│  │  • Randomly select blobs for verification                              │   │
│  │  • Verify zero-knowledge proofs without learning secrets               │   │
│  │  • Distribute DIG token rewards to proven storage providers            │   │
│  │  • Maintain network integrity through cryptographic verification       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                     │                                           │
│                                     ▼                                           │
│                                                                                 │
│  END USERS: Access content through *.dig domains with censorship resistance   │
│  and permanent availability guaranteed by cryptographic proofs and economic    │
│  incentives aligned with network health.                                       │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## How It Works: The Complete Flow

### 1. **Content Publishing & Value Signaling**
Publishers create **DataStores** (NFT-based containers) and register human-readable **DIG Handles** (*.dig domains). Paying DIG tokens for domain registration signals content value to the network.

### 2. **Decentralized Storage Network**
Storage providers operate **DIG Nodes** that store data in cryptographically secured **Plot files**. Each plot uses a 7-table blockchain architecture with embedded proof-of-work to prevent forgery and ensure genuine storage commitment.

### 3. **Zero-Knowledge Verification**
Providers generate **five types of zero-knowledge proofs** that enable validators to verify data storage and availability without learning any sensitive information:
- **Plot Creation Proof**: Proves original ownership without revealing identity
- **Data Inclusion Proof**: Proves specific data exists without revealing content  
- **Ownership Verification**: Proves authority over data without revealing keys
- **Computational Work Proof**: Proves computational investment is bound to specific data
- **Physical Access Proof**: Proves current access to data during verification

### 4. **Blockchain Registry & Verification**
Providers create **PlotCoins** on the Chia blockchain containing their zero-knowledge proofs. **Validators** randomly select blobs, query the blockchain registry, and verify proofs to determine reward eligibility.

### 5. **Economic Incentives & Rewards**
The **DIG Token** creates a circular economy where:
- Publishers pay for domain registration, signaling valuable content
- Storage providers earn rewards for proven, available storage
- Token staking requirements prevent spam and align incentives
- 15-year emission schedule ensures long-term sustainability

## Key Innovation: Blob-Level Propagation

Unlike traditional storage networks, DIG operates on **blob-level propagation** where validators randomly select individual data fragments for verification. This creates:

- **"Survival of the Most Diverse"** dynamics encouraging varied storage
- **Content-Agnostic Operations** where nodes store fragments without knowing complete content
- **Organic Redundancy** as popular content spreads across multiple nodes
- **Natural Censorship Resistance** through fragmented, distributed storage

## Revolutionary Technical Innovations

### **Zero-Knowledge Proof Integration**
Comprehensive ZK-SNARK system enabling privacy-preserving verification of data storage and ownership while preventing various attack vectors.

### **Proof-of-Work Storage** 
Cryptographic binding of computational work to data storage, making storage credit theft mathematically impossible and ensuring genuine storage commitment.

### **Decentralized Proof Registry**
PlotCoin system creating a trustless registry of storage providers on the Chia blockchain with complete zero-knowledge privacy.

### **Economic Incentive Alignment**
DIG token economy that rewards honest storage providers while preventing spam and gaming through sophisticated staking and reward mechanisms.

## Real-World Applications

### **Permanent NFT Storage**
Solve the NFT metadata problem with guaranteed permanent storage for off-chain assets, ensuring that digital collectibles remain accessible indefinitely.

### **Decentralized Web Infrastructure**  
Host censorship-resistant DeFi frontends and dApps that can't be taken down by traditional means, creating truly resilient web infrastructure.

### **Content Distribution Network**
Build a global CDN where content availability is guaranteed by cryptographic proofs and economic incentives rather than corporate infrastructure.

### **Data Preservation**
Create permanent archives for important information, research, and cultural content with cryptographic guarantees of long-term availability.

## Core System Components

The protocol consists of two primary layers of primitives working together:

### **Off-Chain Primitives**
- **[Plots](./primitives/off-chain/plots.md)**: Cryptographically secured storage containers with embedded proof-of-work and 7-table blockchain architecture
- **[Quarry](./primitives/off-chain/quarry.md)**: Collections of related Plots *(future implementation)*
- **[Cart](./primitives/off-chain/cart.md)**: Data transport packages *(future implementation)*

### **On-Chain Primitives**  
- **[PlotCoin](./primitives/on-chain/plotcoin.md)**: Blockchain registry entries mapping data to storage providers with ZK proof packages
- **[DataStore](./primitives/on-chain/datastore.md)**: NFT-based data containers with cryptographic integrity guarantees
- **[DIG Handles](./primitives/on-chain/dig-handles.md)**: Human-readable domain names for content discovery and value signaling
- **[Rewards Distributor](./primitives/on-chain/rewards-distributor.md)**: Automated incentive distribution system with validator control
- **[DIG Token](./economics/token-model.md)**: Native utility token powering the network economy

## Advanced Features

### **Complete Privacy Preservation**
Zero-knowledge proofs ensure that validators can verify storage without learning any sensitive information about plot contents, owner identities, or operational details.

### **Attack Resistance**
Comprehensive protection against storage credit theft, precomputation attacks, plot grinding, replay attacks, and various fraud vectors through cryptographic and economic security measures.

### **Performance Optimization**
Network bribes enable content publishers to optimize retrieval performance by encouraging blob consolidation, creating market-driven trade-offs between decentralization and speed.

### **Validator-Controlled Difficulty**
Dynamic difficulty adjustment allows validators to tune incentives based on network conditions, content value, and economic factors.

## Network Effects & Advantages

### **For Content Publishers**
- **Permanent Storage**: Content remains available indefinitely
- **Censorship Resistance**: Distributed storage prevents takedowns
- **Market-Driven Value**: Domain pricing signals content importance
- **Global Distribution**: Automatic worldwide content propagation

### **For Storage Providers**
- **Predictable Rewards**: Clear token incentives for storage services
- **Content Agnostic**: No editorial decisions about what to store
- **Scalable Operations**: Blob-level fragmentation enables efficient management
- **Privacy Preserving**: Zero-knowledge proofs protect operational details

### **For End Users**
- **Reliable Access**: Content availability guaranteed by economic incentives
- **Censorship Resistance**: Distributed architecture prevents blocking
- **Performance**: Content served from geographically distributed nodes
- **Permanence**: Access to content doesn't depend on original publisher

## Getting Started: Explore the DIG Network

### **Understanding the Architecture**
1. **[System Architecture](./overview/architecture.md)** - How all components integrate and work together
2. **[Primitives Overview](./primitives/off-chain/plots.md)** - Individual network components and their functions

### **Technical Deep Dives**
3. **[Zero-Knowledge Proofs](./zk-proofs/overview.md)** - Complete privacy-preserving verification system
4. **[Plot Format Specifications](./technical/plot-format.md)** - Binary file structure and 7-table architecture details
5. **[Economic Model](./economics/token-model.md)** - Token distribution, streaming, and incentive design

### **Network Operations**
6. **[Network Propagation](./network/propagation.md)** - Blob-level distribution and "survival of the most diverse"
7. **[Performance Optimization](./network/bribes.md)** - Market-driven performance improvements
8. **[Validator Operations](./network/validation.md)** - How network integrity is maintained

## Why DIG Network Matters

The DIG Network represents a fundamental advancement in decentralized infrastructure by solving the **economic sustainability problem** that has plagued previous attempts at decentralized storage. By combining:

- **Cryptographic Proof Systems** that enable trustless verification
- **Economic Incentives** aligned with actual data availability  
- **Market-Driven Value Signals** through domain registration
- **Content-Agnostic Operations** that avoid censorship pressures
- **Zero-Knowledge Privacy** protecting all network participants

The result is a **self-sustaining, economically viable, and censorship-resistant** infrastructure that can support the next generation of decentralized applications and preserve important information for the long term.

---

*The DIG Network builds the foundation for a more open, accessible, and robust digital ecosystem where content availability is guaranteed by mathematics and economics rather than corporate infrastructure.* 