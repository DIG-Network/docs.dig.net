---
sidebar_position: 1
---

# System Architecture Overview

:::tip 💜 Support the DIG Network
**Help build the future of decentralized storage!** The DIG Network is an open-source project that needs community support to continue development. 

**[💜 Support the Project →](../support.md)** - Donate crypto, buy NFTs, or sponsor development
:::

The DIG Network functions as a comprehensive **decentralized storage and content delivery network** built on the Chia blockchain. By combining on-chain coordination mechanisms with off-chain storage solutions, the DIG Network creates a trustless, incentive-aligned infrastructure that provides permanent, censorship-resistant data storage with cryptographic integrity guarantees.

Think of DIG as the decentralized answer to traditional CDNs like Cloudflare or AWS CloudFront. But instead of relying on corporate data centers, DIG harnesses a global network of independent DIG Nodes (storage providers) who compete to offer the best service. Economic incentives, not corporate policies, determine what gets stored where. And cryptographic proofs, not trust in a company, guarantee that your data remains accessible.

## Architecture Documentation Structure

This architecture documentation is organized into focused sections for easier navigation and understanding:

- **[System Components](./system-components.md)** - Core components and their interactions
- **[Network Participants](./network-participants.md)** - Roles and responsibilities of network participants  
- **[Content Propagation](./content-propagation.md)** - How content spreads across the network
- **[Incentive Model](./incentive-model.md)** - Economic mechanisms for even data distribution
- **[Integration Points](./integration-points.md)** - Blockchain and ecosystem integrations

## High-Level System Overview

The DIG Network architecture can be visualized as a stack of four interconnected layers. Each layer has a specific responsibility, and data flows both up and down the stack. Understanding this architecture is crucial because it shows how DIG achieves properties that seem contradictory: decentralized yet coordinated, private yet verifiable, permanent yet dynamic.

The diagram below shows these layers and their primary components. Notice how each layer depends on the ones below it, creating a robust system where no single component can compromise the whole.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         DIG Network System Architecture                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  CONTENT LAYER                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ Content Creators → DataStores (NFTs) → DIG Handles (*.dig domains)     │   │
│  │ Store data in blockchain-verified containers with human-readable names  │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                            │
│                                    ▼                                            │
│  COORDINATION LAYER (Chia Blockchain)                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ PlotCoins Registry → Zero-Knowledge Proofs → Reward Distribution       │   │
│  │ On-chain proof of storage with privacy-preserving verification         │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                            │
│                                    ▼                                            │
│  STORAGE LAYER                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ DIG Nodes → Plot Files → Blob-Level Storage → Economic Incentives      │   │
│  │ Distributed storage providers with cryptographic proof generation      │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                            │
│                                    ▼                                            │
│  VALIDATION LAYER                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ Validators → Random Selection → Proof Verification → Token Rewards     │   │
│  │ Decentralized verification with fraud detection and reward distribution │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Core Architecture Principles

Below we highlight the guiding principles that shape every layer of the DIG Network.

### **Multi-Layer Design**
The DIG Network deliberately separates concerns into four layers—content packaging, on-chain coordination, off-chain storage, and independent verification—so that each layer can evolve at its own pace while remaining cryptographically linked.

The DIG Network operates across four distinct but integrated layers:

1. **Content Layer**: DataStore NFTs and DIG Handles provide content packaging and addressing
2. **Coordination Layer**: Chia blockchain manages on-chain registries and economic incentives
3. **Storage Layer**: DIG Nodes (storage providers) provide distributed storage with cryptographic proofs
4. **Validation Layer**: Validators ensure integrity and distribute rewards fairly

### **Economic-Driven Distribution**
Token-denominated rewards act as the invisible hand that balances supply and demand for storage. The twist is that rewards are tiered based on DIG Handle costs - premium handles (shorter names) generate significantly higher rewards. In practice, storage providers (DIG Nodes) chase the highest expected return, which initially belongs to brand-new premium content and then decays toward an equilibrium as more peers join.
- **Tiered epoch rewards** based on handle cost create multi-level scarcity dynamics
- **New premium content = maximum profitability** with 100% of high-tier rewards going to first adopter
- **Declining profitability** as more providers adopt the same content within each tier
- **Dynamic reshuffling** creates ephemeral storage patterns for censorship resistance
- **Market signals** from DIG Handle registrations guide storage provider decisions

### **Zero-Knowledge Verification**
To keep proofs private while still verifiable by anyone, DIG encodes each storage commitment into a constant-size zero-knowledge proof. Validators can therefore audit the entire network without ever seeing the underlying data.
- **Five proof types** cover all aspects of storage commitment
- **Constant-size proofs** ensure scalability regardless of data volume
- **Batch verification** optimizes network-wide validation performance
- **Fraud detection** maintains network integrity through cryptographic guarantees

## Network Participants
Every decentralized system is ultimately powered by its people. In DIG those people fall into four broad roles, each with its own incentives and responsibilities:

### **Content Creators/Publishers**
- Create DataStore NFTs containing their content
- Register DIG Handles (*.dig domains) to signal content value
- Fund network operations through domain registration fees
- Push content to DIG Nodes for network-wide distribution

### **DIG Nodes (Storage Providers)**

A **DIG Node** is the network's term for a storage provider - any participant who stores content and earns rewards. These nodes form the backbone of the network's storage infrastructure. The terms "DIG Node" and "storage provider" are used interchangeably throughout the documentation.

- Store content in cryptographically secured plot files
- Generate zero-knowledge proofs of storage commitment
- Stake DIG tokens to participate in reward distribution
- Optimize storage portfolios based on economic incentives

### **Validators**

Currently a curated set of trusted community members who ensure network integrity. The goal is to transition to DAO-managed validators who can be hired/fired based on performance.

- Verify storage commitments using zero-knowledge proofs
- Detect fraud and ensure network integrity
- Distribute rewards fairly to legitimate storage providers
- Coordinate network parameters and governance

### **End Users**
- Access content through DIG Handles with censorship resistance
- Verify content integrity through cryptographic guarantees
- Drive network adoption and content demand
- Benefit from improved performance and availability

➤ **[Detailed Network Participants →](./network-participants.md)**

## Content Propagation

Understanding how content spreads through the DIG Network is key to appreciating its resilience. Unlike traditional CDNs where content is pushed to predetermined edge locations, DIG lets economic incentives guide organic content distribution. DIG Nodes act like independent entrepreneurs, constantly searching for the most profitable content to store.

The DIG Network uses multiple complementary mechanisms for content discovery and distribution:

### **Three Discovery Methods**

Each discovery method serves a unique purpose in the content ecosystem. Direct push gives creators control over initial distribution, P2P discovery enables organic spread based on profitability, and market signals from DIG Handle registrations act as a public billboard advertising valuable content to the entire network.

1. **Direct Push**: Content creators upload DataStores directly to DIG Nodes
2. **P2P Protocol**: Nodes discover content from peers based on economic opportunities  
3. **Market Signals**: DIG Handle registrations signal valuable content to the network

### **Key Benefits**

These propagation mechanisms work together to create a self-organizing system that requires no central coordination. Content naturally flows to where it's needed most, DIG Nodes compete to offer the best service, and the network becomes more resilient with every new participant.

- **Organic Propagation**: Content spreads naturally through economic incentives
- **Redundancy**: Popular content automatically achieves wider distribution
- **Load Distribution**: Distributes storage and bandwidth across multiple nodes
- **Censorship Resistance**: No single point of control for content availability

➤ **[Detailed Content Propagation →](./content-propagation.md)**

## Data Flows

The DIG Network orchestrates three primary data flows, each designed to minimize friction while maximizing security. Think of these as the "happy paths" that content, storage operations, and user requests follow through the system. Each flow has been optimized through real-world testing to balance performance with decentralization.

The network supports three primary data flow patterns:

### **Content Publishing**

When creators publish content, they're essentially announcing a storage opportunity to the market. The DIG Handle acts as both an addressing mechanism and an economic signal - the more a creator pays for their handle, the more attractive their content becomes to DIG Nodes.

1. **Content Creation** → Create DataStore NFT with Merkle integrity
2. **Value Signaling** → Register DIG Handle to signal content value  
3. **DataStore Push** → Upload to DIG Node for plotting and PlotCoin creation
4. **Network Propagation** → P2P discovery drives wider distribution

### **Storage Operations**

DIG Nodes operate like independent businesses, constantly optimizing their "inventory" of stored content. These nodes monitor multiple information sources - direct uploads, peer announcements, and blockchain registrations - to identify the most profitable storage opportunities.

1. **Content Discovery** → Accept pushes, monitor DIG Handles, use P2P protocol
2. **Plot Creation** → Generate cryptographic plots and zero-knowledge proofs
3. **Network Registration** → Stake tokens and create PlotCoin registry entries
4. **Ongoing Operations** → Serve content and receive performance-based rewards

### **Content Access**

End users experience DIG much like any other web service, but under the hood, their requests trigger a sophisticated DIG Node selection process. The system automatically routes requests to the best available nodes based on geography, performance history, and current load.

1. **Content Request** → Access via *.dig domain resolution
2. **Provider Discovery** → Query PlotCoin registry for active DIG Nodes
3. **Content Retrieval** → Download blobs with cryptographic integrity verification
4. **Content Delivery** → Reconstruct and present content with caching

## Economic Model

The genius of DIG's economic model lies in its simplicity: fixed rewards create scarcity, scarcity creates competition, and competition creates optimal distribution. By making rewards inversely proportional to the number of providers storing content, the system naturally balances itself without any central planning.

### **Circular Token Economy**

The DIG token flows in a continuous cycle: creators spend tokens to register handles, those handles signal value and incentives for DIG Nodes, DIG Nodes receive rewards for hosting data, nodes sell tokens to cover costs or take profits, and buyers include new creators who need tokens for their own content. This circular flow ensures sustainable demand for the token while funding network operations.

The DIG Network creates a self-sustaining economic cycle:

```
Content Creators → DIG Handle Registration → Network Value Signal
       ↑            (Cost = Reward Tier)            ↓
Token Utility ← DIG Node Rewards ← Economic Incentives
                  (Tiered by Handle Cost)
```

**Key Properties:**
- **Value Signal**: Domain registration costs signal content value and determine reward tiers
- **Tiered Rewards**: Higher handle costs (shorter names) generate proportionally higher epoch rewards
- **Reward Distribution**: Registration fees signal content value and incentive level from validators.
- **Sustainable Incentives**: Circular economy creates long-term sustainability
- **Market Efficiency**: Competition drives optimal resource allocation within value tiers

## "Survival of the Most Diverse" Incentives

This provocative name captures a fundamental truth about the DIG Network: content that spreads to just the right number of providers - not too few, not too many - tends to persist longest. The economic model creates a Goldilocks zone where content naturally finds its optimal distribution level.

The DIG Network's economic model creates powerful forces that naturally distribute content evenly across nodes:

### **Core Mechanism**

Imagine a gold rush where the first miner to stake a claim gets all the gold from that spot. As more miners arrive, they must share the same gold, making each individual's take smaller. But here's the twist: the size of the gold deposit depends on the value of the claim registration. Premium claims (short DIG Handles) have larger gold deposits, while basic claims (long handles) have smaller ones. Smart miners constantly search for new, unclaimed spots with the highest potential rewards.

**Tiered fixed epoch rewards** create scarcity economics where:
- **Handle cost determines reward tier** - Premium handles (3-4 chars) generate 5x+ more rewards than basic handles
- **Fewer providers = Higher rewards per provider** - First adopter gets 100% of the tier's rewards
- **More providers = Lower rewards per provider** - Rewards split among all providers
- **Strategic behavior** targets high-value new content for maximum earning potential

### **Four-Step Process**

The incentive cycle operates like clockwork. Handle registration acts as a starting gun (with the registration cost determining the size of the prize pool), tiered rewards create different prize pools for different content values, strategic analysis identifies the most profitable opportunities, and constant reshuffling ensures no content becomes too concentrated or too sparse.

1. **Value Signaling** → DIG Handle registration signals valuable content (cost determines tier)
2. **Tiered Reward Scarcity** → Limited rewards per tier split among successful validations  
3. **Strategic Selection** → Nodes analyze PlotCoins to target high-value underserved content
4. **Dynamic Reshuffling** → Constant optimization creates ephemeral storage patterns

### **Key Outcomes**

These incentive mechanics produce emergent behaviors that would be impossible to design top-down. Content achieves redundancy without waste, the network resists censorship without explicit anti-censorship code, and the entire system self-optimizes without any central coordinator.

- **Even Distribution**: Market forces naturally balance content across nodes within each value tier
- **Value Prioritization**: Premium content (expensive handles) attracts more nodes due to higher rewards
- **Censorship Resistance**: Constantly changing storage patterns resist takedowns
- **Self-Optimization**: No coordination required - incentives drive optimal placement
- **Network Resilience**: Individual profit motives create collective benefits

➤ **[Detailed Incentive Model →](./incentive-model.md)**

### **Security and Governance**

Security in the DIG Network isn't just about cryptography - it's about aligning incentives so that honest behavior is more profitable than attacks. The multi-layered approach combines cryptographic proofs, economic stakes, and social reputation to create defense in depth.

**Multi-Layered Security Model:**
- **Cryptographic Security**: Zero-knowledge proofs and digital signatures
- **Economic Security**: Staking requirements and fraud penalties
- **Network Security**: Distributed architecture and consensus mechanisms
- **Governance Security**: Future DAO-based community control

**Validator Model Evolution:**

The validator system is designed to evolve from curated community oversight to full decentralized governance:

**Phase 1: Curated Community Validators (Current)**
- **Initial Structure**: A curated set of trusted community validators operates the network
- **Selection Process**: Validators chosen based on technical competence and community trust
- **Multisig Coordination**: Validators coordinate through multisig for transparency
- **Public Accountability**: All validator actions are publicly visible and auditable

**Phase 2: DAO-Managed Validators (Future Goal)**
- **DAO Formation**: Community forms a DAO to manage the validator ecosystem
- **Hiring/Firing Authority**: DAO can add or remove validators based on:
  - Performance metrics (uptime, accuracy, responsiveness)
  - Market needs (geographic distribution, capacity requirements)
  - Community trust and reputation
- **Performance Reviews**: Regular assessment of validator effectiveness
- **Incentive Alignment**: Validators compensated based on performance

**Phase 3: Full Decentralization (Long-term Vision)**
- **Open Validator Market**: Anyone can become a validator by meeting requirements
- **Automated Selection**: Smart contracts handle validator selection and rotation
- **Community Governance**: DIG token holders control all network parameters
- **Self-Sustaining**: Network operates without any central coordination

## Integration Points

DIG doesn't exist in isolation - it's designed to plug into existing infrastructure while maintaining its decentralized properties. These integration points let developers use familiar tools while benefiting from DIG's unique storage properties.

### **Chia Blockchain Integration**

Built on Chia from day one, DIG leverages battle-tested primitives rather than reinventing the wheel. This means DIG DataStores work in any Chia wallet, DIG tokens trade on any Chia DEX, and DIG smart contracts compose with other Chia protocols.

- **Native NFTs**: DataStores built on Chia NFT standards
- **BLS Signatures**: Compatible with Chia's cryptographic infrastructure
- **Chia Lisp Puzzles**: PlotCoins and Reward Distributors built on Chia Lisp
- **Token Standards**: DIG Token implemented as Chia Asset Token (CAT)

### **Zero-Knowledge Proof Integration**

The zero-knowledge proof system acts as the trust bridge between on-chain claims and off-chain storage. By proving storage without revealing content, providers can publicly demonstrate their reliability while maintaining complete privacy.

- **Privacy Preservation**: Verification without revealing sensitive information
- **Scalability**: Constant-size proofs regardless of plot complexity
- **Security**: Cryptographic guarantees against fraud and forgery
- **Performance**: Efficient verification enables network-scale operations

### **Content Delivery Integration**

End users shouldn't need to know they're using a decentralized network. DIG's CDN compatibility layer translates between Web3 storage and Web2 delivery, enabling traditional websites to benefit from decentralized storage.

- **CDN Compatibility**: Integration with existing CDN infrastructure
- **Web Standards**: Compatible with standard web protocols and browsers
- **API Access**: RESTful APIs and SDKs for developer integration
- **Performance Optimization**: Market-driven performance improvements

The DIG Network's system architecture creates a comprehensive, decentralized storage solution that combines the security and immutability of blockchain technology with the performance and scalability required for modern content delivery applications. Through careful integration of cryptographic proofs, economic incentives, and distributed systems principles, the network provides a robust foundation for censorship-resistant, permanently available digital content. 