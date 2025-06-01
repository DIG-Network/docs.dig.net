---
sidebar_position: 3
---

:::tip 💜 Support the DIG Network
**Help build the future of decentralized storage!** The DIG Network is an open-source project that needs community support to continue development. 

**[💜 Support the Project →](../support.md)** - Donate crypto, buy NFTs, or sponsor development
:::

# Network Bribes

## Overview

The DIG Network introduces **Network Bribes** as a specialized incentive mechanism that allows content owners to optimize retrieval performance by encouraging blob consolidation on specific nodes, creating a market-driven trade-off between decentralization and speed.

## Core Concept

While the main [DIG token rewards](../economics/token-model.md) encourage **maximum randomization** of blobs across the network for resilience, Network Bribes offer an alternative approach where content owners can **pay for consolidation** of their content blobs onto fewer nodes for improved performance.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    Performance vs Decentralization Trade-off                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  MAIN DIG REWARDS (Decentralization Focus)                                     │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ Random Blob Distribution → Maximum Resilience → Slow Retrieval         │   │
│  │                                                                         │   │
│  │ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                                │   │
│  │ │Node1│ │Node2│ │Node3│ │Node4│ │Node5│  Each has different blobs     │   │
│  │ │Blob1│ │Blob3│ │Blob2│ │Blob5│ │Blob4│  (High decentralization)      │   │
│  │ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘                                │   │
│  │                                                                         │   │
│  │ Retrieval requires: Contact 5 nodes → Reconstruct content              │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    ▼                                            │
│  NETWORK BRIBES (Performance Focus)                                            │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ Paid Consolidation → Faster Retrieval → Reduced Resilience             │   │
│  │                                                                         │   │
│  │ ┌─────┐ ┌─────┐                                                         │   │
│  │ │Node1│ │Node2│  Only 2 nodes have all blobs                           │   │
│  │ │All  │ │All  │  (Lower decentralization)                              │   │
│  │ │Blobs│ │Blobs│                                                         │   │
│  │ └─────┘ └─────┘                                                         │   │
│  │                                                                         │   │
│  │ Retrieval requires: Contact 1 node → Immediate access                  │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Dedicated Reward Distributors

Every [DataStore](../primitives/on-chain/datastore.md) is minted with its own **dedicated rewards distributor puzzle** that operates independently from the main DIG token rewards system. This architecture provides:

### Independent Operation
- **Isolated Economics**: Bribe rewards don't interfere with main network incentives
- **Custom Funding**: Content owners control their own incentive budgets
- **Flexible Timing**: Bribes can be activated and deactivated as needed
- **Specialized Optimization**: Tailored incentives for specific performance requirements

### Multi-Asset Support
Content owners can load **any asset type** into their distributor:
- **XCH**: Native Chia cryptocurrency
- **CAT Tokens**: Any Chia Asset Token including DIG, USDS, etc.
- **Mixed Assets**: Different reward types for different performance tiers
- **Custom Tokens**: Project-specific tokens for specialized communities

## Economic Mechanics

### For Content Owners

**Investment Decision Framework:**
```
Bribe Value Calculation:
- Performance Improvement Required
- Business Value of Faster Access
- Available Budget for Optimization
- Competitive Analysis of Alternative Solutions

ROI = (Performance Improvement × Business Value) / Bribe Cost
```

**Strategic Considerations:**
- **Load Bribe Funds** into DataStore's dedicated distributor
- **Set Performance Targets** for desired improvement levels
- **Monitor Results** and adjust bribe amounts based on effectiveness
- **Balance Costs** against performance benefits

### For DIG Nodes

**Economic Decision Matrix:**
```
Node Strategy Decision:
IF (Bribe Value per TB) > (Expected DIG Rewards per TB):
    THEN consolidate DataStore blobs for bribe rewards
ELSE:
    THEN maintain diverse storage for DIG rewards

Economic Calculation:
- Bribe Rewards: Direct payment for specialized storage
- DIG Rewards: Probabilistic rewards for diverse storage
- Opportunity Cost: Lost DIG rewards from reduced diversity
- Network Position: Strategic value of content consolidation
```

**Node Specialization Options:**
- **Full Generalists**: Focus entirely on DIG reward diversity
- **Specialized Providers**: Focus on high-value bribe opportunities
- **Hybrid Strategy**: Balance between DIG rewards and selective bribes
- **Dynamic Optimization**: Continuously optimize based on market conditions

## Validator Integration

Once a bribe distributor is funded, **validators automatically detect and distribute** the bribe rewards on behalf of content owners:

### Automated Detection
```
ALGORITHM: Bribe Distributor Detection and Management
PURPOSE: Automatically manage bribe distribution without content owner intervention

STEPS:
  1. SCAN FOR FUNDED DISTRIBUTORS
     FOR each DataStore in network:
         IF DataStore.brideDistributor.balance > 0:
             Add to activeBribeDistributors list
  
  2. INTEGRATE WITH VALIDATION PROCESS
     DURING blob validation:
         IF selectedBlob belongs to DataStore with active bribes:
             Include bribe-eligible nodes in reward calculation
  
  3. DISTRIBUTE BRIBE REWARDS
     FOR each validated node storing bribed content:
         Calculate bribe reward based on consolidation level
         Process payout from DataStore's distributor
  
  4. UPDATE DISTRIBUTOR STATE
     Record bribe distributions and update balances
     Notify content owners of distribution activity
```

### Decentralized Management
- **No Manual Intervention**: Validators handle all bribe distribution automatically
- **Transparent Process**: All bribe payments recorded on-chain
- **Fair Distribution**: Same validation process as main DIG rewards
- **Reduced Overhead**: Content owners don't need to manage individual payments

## Strategic Implications

Network Bribes create a **dual-incentive economy** that serves different use cases:

### Decentralization-Focused Applications
**Optimal for:**
- **Censorship Resistance**: Maximum distribution across independent nodes
- **Long-term Preservation**: Resilient storage for historical data
- **Privacy Protection**: Fragmented storage makes surveillance difficult
- **Democratic Access**: No single point of control or failure

**Examples:**
- Whistleblower documents
- Historical archives
- Public domain content
- Open source software repositories

### Performance-Focused Applications
**Optimal for:**
- **Real-time Applications**: Low-latency access requirements
- **Commercial Services**: Business applications with performance SLAs
- **High-Frequency Access**: Content accessed many times per day
- **User Experience**: Consumer applications requiring fast loading

**Examples:**
- DeFi application frontends
- E-commerce websites
- Gaming assets
- Video streaming content

## Market Efficiency

The dual-incentive system enables **market-driven optimization** where different content types gravitate toward optimal storage patterns:

### Natural Segmentation
```
Content Classification by Economic Incentives:

HIGH-VALUE COMMERCIAL CONTENT
├── Willing to pay for performance
├── Consolidation on premium nodes
└── Fast access, reduced resilience

COMMUNITY/PUBLIC CONTENT  
├── Relies on DIG token rewards
├── Maximum decentralization
└── High resilience, moderate access speed

SPECIALIZED CONTENT
├── Custom bribe structures
├── Targeted node selection
└── Optimized for specific requirements
```

### Price Discovery
- **Market Rates**: Bribe prices reflect true market value of performance
- **Competitive Dynamics**: Nodes compete on performance/price ratios
- **Efficient Allocation**: Resources flow to highest-value applications
- **Innovation Incentives**: Rewards technical innovation and optimization

## Implementation Examples

### DeFi Application Frontend
```
Use Case: Time-sensitive DeFi trading interface
Challenge: Sub-second load times required for competitive trading
Solution: Network Bribes for consolidated storage

Configuration:
- Bribe Asset: USDS (stablecoin)
- Target Nodes: 3-5 high-performance nodes in major data centers
- Geographic Distribution: US East, US West, Europe, Asia
- Performance SLA: &lt;200ms global access time
- Monthly Budget: $500-2000 depending on trading volume

Result:
- 10x faster loading compared to decentralized storage
- Competitive trading experience
- Willing to pay premium for performance advantage
```

### Open Source Documentation
```
Use Case: Community-maintained technical documentation
Challenge: Long-term preservation more important than speed  
Solution: Rely on DIG token rewards for maximum decentralization

Configuration:
- No bribes allocated
- Maximum distribution across diverse nodes
- Geographic redundancy prioritized
- Cost optimization through DIG rewards only

Result:
- Extremely resilient to censorship and node failures
- Lower access speeds acceptable for documentation use case
- Zero ongoing costs beyond initial DIG handle registration
```

## Technical Implementation

### Bribe Distributor Architecture
```
DataStore Bribe Distributor Structure:
{
  dataStoreId: UniqueIdentifier,
  distributorAddress: ChiaAddress,
  balances: {
    XCH: Amount,
    DIG: Amount,
    USDS: Amount,
    // ... other CAT tokens
  },
  distributionRules: {
    rewardPerTB: Amount,
    minimumConsolidation: Percentage,
    geographicRequirements: [Regions],
    performanceRequirements: Metrics
  },
  totalDistributed: Amount,
  activeNodes: [NodeAddresses],
  lastDistribution: Timestamp
}
```

### Validator Integration
Validators seamlessly integrate bribe distribution with existing validation workflows:

```
Enhanced Validation Process with Bribes:
1. Perform standard blob validation
2. Check if blob belongs to DataStore with active bribes
3. Calculate bribe rewards based on node consolidation level
4. Distribute both DIG rewards and bribe rewards as applicable
5. Update distributor states and balances
6. Record all distributions on-chain for transparency
```

## Future Enhancements

### Advanced Bribe Mechanisms
- **Performance Tiers**: Different reward levels for different performance guarantees
- **Geographic Incentives**: Bonuses for specific geographic distribution
- **Quality of Service**: Rewards based on uptime, latency, and bandwidth metrics
- **Dynamic Pricing**: Automatic adjustment of bribe rates based on market conditions

### Cross-Chain Integration
- **Multi-Chain Assets**: Accept assets from other blockchain networks
- **Wrapped Tokens**: Support for wrapped versions of major cryptocurrencies
- **DeFi Integration**: Automatic yield generation on idle bribe funds
- **Cross-Chain Governance**: Governance tokens from other networks as bribe assets

Network Bribes represent a sophisticated market mechanism that allows the DIG Network to serve both resilience-focused and performance-focused use cases within a single unified infrastructure, demonstrating the flexibility and adaptability of the protocol's economic design. 