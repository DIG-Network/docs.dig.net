---
sidebar_position: 1
---

# DIG Token Economic Model

:::tip 💜 Support the DIG Network
**Help build the future of decentralized storage!** The DIG Network is an open-source project that needs community support to continue development. 

**[💜 Support the Project →](../support.md)** - Donate crypto, buy NFTs, or sponsor development
:::

## Overview

The **DIG Token** is a CAT (Chia Asset Token) that serves as the fundamental economic primitive powering the entire DIG Network ecosystem. As the native utility token, it creates the economic incentive structures that align participant behavior with network health, data availability, and long-term sustainability.

## Core Functions

The DIG Token serves multiple critical functions within the network:

- **[PlotCoin Staking](../primitives/on-chain/plotcoin.md)**: Required to create PlotCoin registry entries, proving economic commitment to data storage
- **[DIG Handle Registration](../primitives/on-chain/dig-handles.md)**: Payment mechanism for human-readable domain names, signaling content value
- **[Reward Distribution](../primitives/on-chain/rewards-distributor.md)**: Primary reward currency for storage providers and network participants
- **Governance**: Future governance rights for DAO-based network management
- **[Network Bribes](../network/bribes.md)**: Can be used to fund specialized reward distributors for performance optimization
- **Economic Security**: Creates sybil resistance and spam prevention through required stakes

## Token Supply and Distribution

### Total Supply
**25,000,000 (25 million) DIG tokens** - permanently capped with no additional minting capability.

### Emission Schedule
- **Single Issuance**: All tokens minted at deployment
- **Time-Locked Distribution**: 100% of tokens immediately locked in streaming puzzles
- **15-Year Emission Period**: All tokens distributed linearly over 15 years
- **Linear Release**: Predictable, anti-inflationary emission schedule

## Distribution Architecture

The token distribution utilizes sophisticated streaming puzzle technology to create six distinct funding buckets:

:::info Proposed Allocation
These allocations are currently a proposal and have not yet been finalized. Nothing is final until the token is minted and loaded into the streaming puzzles.
:::

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           DIG Token Distribution                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  Protocol Rewards: 50% (12.5M tokens)                                         │
│  ████████████████████████████████████████████████████                         │
│                                                                                 │
│  Investor Funding: 30% (7.5M tokens)                                          │
│  ████████████████████████████████████                                         │
│                                                                                 │
│  Early Supporters: 5% (1.25M tokens)                                          │
│  ██████                                                                        │
│                                                                                 │
│  Liquidity Pool: 5% (1.25M tokens)                                            │
│  ██████                                                                        │
│                                                                                 │
│  Developer Funds: 5% (1.25M tokens)                                           │
│  ██████                                                                        │
│                                                                                 │
│  Founder Funds: 5% (1.25M tokens)                                             │
│  ██████                                                                        │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 1. Protocol Rewards (50% - 12,500,000 tokens)
**Purpose**: Incentivize network participants and maintain data availability

- **Streamed to Main DIG Rewards Validator** over 15 years
- **Escrowed in Rewards Distributor** puzzle for secure distribution
- **Distributed to Valid Plot Servers** based on performance verification
- **Largest allocation** ensuring robust, long-term network incentives

### 2. Investor Bucket (30% - 7,500,000 tokens)
**Purpose**: Raise $5 million in funding to grow and mature the network

**Implementation Architecture:**
- **20 separate Chia vaults** created for distribution
- **375,000 tokens per vault** (1.5% of total supply each)
- **Linear streaming over 15 years** to each vault
- **Offer files at $250,000 worth of XCH** each
- **Anti-dump mechanism** with clawbacks disabled
- **Irrevocable 15-year claim** upon offer acceptance

**Investor Benefits:**
- Proportional ownership maintained throughout vesting period
- Immediate price discovery enabled after launch
- Transparent on-chain verification of all emissions
- Direct stake in network growth and success

### 3. Early Supporter Bucket (5% - 1,250,000 tokens)
**Purpose**: Reward community members who contributed to project development

- **Airdrop mechanism** streaming tokens over 15 years
- **Confidential criteria** until after distribution
- **Recognition of community contributions** and early support
- **Linear emission schedule** aligned with other buckets

### 4. Liquidity Pool Bucket (5% - 1,250,000 tokens)
**Purpose**: Facilitate easy access to DIG tokens through decentralized trading

- **15-year streaming puzzle** earmarked for TibetSwap liquidity
- **Tokens paired with XCH** upon claiming from stream
- **Consistent market liquidity** throughout emission period
- **Price stability support** and trading accessibility

### 5. Developer Funds (5% - 1,250,000 tokens)
**Purpose**: Encourage ongoing community development and ecosystem growth

- **15-year streaming to developers**
- **Potentially managed by XCH Foundation**
- **Incentivizes continued protocol development**
- **Supports third-party application development**

### 6. Founder Funds (5% - 1,250,000 tokens)
**Purpose**: Compensate founders for protocol development and ongoing leadership

- **15-year streaming schedule** for founder compensation
- **Long-term alignment** with network success
- **Transparent vesting mechanism**
- **Leadership continuity incentives**

## Economic Flow Architecture

The DIG Token economy creates a sophisticated circular system designed to sustain decentralized data storage incentives:

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

### Key Economic Cycles

#### 1. Escrow and Reward Loop
- **Rewards Distributor** escrows 50% of all tokens over 15 years
- **Validators assess performance** and authorize reward claims to productive DIG Nodes
- **Trustless distribution** ensures validators cannot manipulate rewards

#### 2. Staking Loop
- **DIG Nodes stake tokens** to create PlotCoins for network participation
- **Tokens can be melted** to recover stakes when storage services end
- **Flexible commitment** maintains economic security while enabling participation

#### 3. Value Loop
- **Publishers pay for domain registration**, signaling valuable content
- **Registry fees flow to validators**, compensating their services
- **Market-driven prioritization** ensures valuable content receives attention

#### 4. Liquidity Loop
- **TibetSwap integration** ensures token availability for network operations
- **Separate from operational flows** prevents trading disruption
- **Sustained liquidity** supports network growth and accessibility

## Economic Incentive Alignment

### DIG Nodes (Storage Providers)
**Incentive Structure:**
- Earn rewards based on validator assessment of reliable data storage and serving
- Rewards proportional to verified storage capacity and service quality
- Economic commitment through staking aligns interests with network health

**Economic Benefits:**
- Continuous reward accrual for proven storage
- Scalable earning potential based on storage capacity
- Token appreciation through network growth

### Validators
**Compensation Model:**
- Receive both token streams and direct payments for validation services
- Control reward distribution while maintaining accountability
- Share in network growth through token appreciation

**Responsibilities:**
- Assess storage provider performance fairly and accurately
- Maintain network integrity through fraud detection
- Balance incentives to promote network health

### Content Publishers
**Value Proposition:**
- Access to censorship-resistant hosting with clear value signaling
- Market-driven pricing for content prioritization
- Cryptographic integrity guarantees for published content

**Economic Participation:**
- Pay DIG tokens for handle registration to signal content value
- Optional network bribes for performance optimization
- Benefit from increased content availability and reliability

### Token Holders
**Value Accrual:**
- Utility-driven demand through staking and registration requirements
- Deflationary pressure through locked staking mechanisms
- Network growth appreciation through increased adoption

## Anti-Inflationary Mechanisms

### Staking Requirements
- **PlotCoin creation** requires token staking, temporarily removing tokens from circulation
- **Economic commitment** creates deflationary pressure during network growth
- **Flexible melting** allows token recovery while maintaining security

### Utility-Driven Demand
- **Handle registration** requires token payment, creating consistent demand
- **Network bribes** use tokens for performance optimization
- **Governance participation** (future) will require token holding

### Long-Term Emission Schedule
- **15-year distribution** prevents early inflation and aligns with network maturation
- **Predictable release** enables long-term planning and investment
- **Linear schedule** avoids cliff events and market disruption

## Network Effects and Scalability

### Positive Feedback Loops
As the network grows:
- **Increased content publishing** drives domain registration fees
- **More data storage** creates additional staking demand
- **Growing network utility** attracts more participants needing tokens
- **Enhanced security** through larger stake requirements

### Economic Sustainability
- **Multiple revenue streams** prevent dependence on single funding source
- **Validator compensation** through both streaming rewards and service fees
- **Self-reinforcing growth** where network value drives token utility
- **Long-term perspective** through extended emission schedule

## Future Economic Enhancements

### DAO Governance Integration
When Chia's DAO primitives are production-ready:
- **Community voting** on economic parameters and validator selection
- **Treasury management** for network development and growth initiatives
- **Decentralized decision-making** for protocol upgrades and optimizations
- **Token holder governance** rights for network direction

### Advanced Economic Mechanisms
- **Dynamic difficulty adjustments** based on economic conditions
- **Geographic incentives** for global distribution optimization
- **Quality-of-service metrics** for sophisticated reward calculation
- **Cross-chain integration** for broader ecosystem participation

## Risk Management and Security

### Economic Security Properties
- **Spam Prevention**: Economic staking requirements naturally filter participants
- **Sustainable Funding**: Multiple revenue streams ensure long-term viability
- **Trustless Escrow**: On-chain reward distribution prevents manipulation
- **Market Integration**: Seamless token access prevents operational bottlenecks

### Token Security
- **Smart Contract Escrow**: Funds secured by audited smart contracts
- **Transparent Distribution**: All emissions publicly verifiable on blockchain
- **No Backdoors**: No administrative functions for additional token creation
- **Immutable Schedule**: Distribution schedule cannot be modified after deployment

The DIG Token economic model represents a carefully designed system that creates sustainable incentives for decentralized data storage while maintaining the security, transparency, and decentralization properties essential to the network's mission. Through its sophisticated distribution mechanism and circular economic flows, the token serves as both the fuel for network operations and the foundation for long-term network growth and sustainability. 