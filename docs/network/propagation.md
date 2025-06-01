---
sidebar_position: 1
---

:::tip 💜 Support the DIG Network
**Help build the future of decentralized storage!** The DIG Network is an open-source project that needs community support to continue development. 

**[💜 Support the Project →](../support.md)** - Donate crypto, buy NFTs, or sponsor development
:::

# Network Propagation

## Overview

The DIG Network operates on a **blob-level propagation system** where validators randomly select individual data blobs for verification rather than complete files or datastores. This creates a unique distributed storage architecture that maximizes network resilience and provides strong operational advantages for node operators.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          DIG Network Propagation Flow                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  1. CONTENT CREATION                                                           │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ Content Publisher → DataStore → Blob Fragmentation → Plot Creation     │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                            │
│                                    ▼                                            │
│  2. VALUE SIGNALING                                                            │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ DIG Handle Registration → Economic Signal → Validator Prioritization   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                            │
│                                    ▼                                            │
│  3. BLOB-LEVEL VALIDATION                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ Random Blob Selection → PlotCoin Verification → Reward Distribution    │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                            │
│                                    ▼                                            │
│  4. ECONOMIC INCENTIVES                                                        │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ Diverse Storage → Higher Rewards → Content Propagation → Network Growth│   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Blob-Level Validation

Validators use Chia blockchain block hashes to **randomly select blobs** from across the entire network for verification. Any DIG Node (PlotOwner) that can prove they are storing the selected blob becomes eligible for [DIG token rewards](../economics/token-model.md).

### Random Selection Algorithm

```
ALGORITHM: Random Blob Selection for Validation
PURPOSE: Select blobs for verification in a deterministic but unpredictable way

INPUT:
  - chiaBlockHash: Recent Chia blockchain block hash
  - networkBlobRegistry: Complete registry of all available blobs
  - validationRound: Current validation round number

OUTPUT: Selected blob for verification

STEPS:
  1. GENERATE SELECTION SEED
     selectionSeed = SHA-256(chiaBlockHash + validationRound + "DIG_BLOB_SELECTION")
  
  2. CREATE DETERMINISTIC RANDOM SELECTION
     blobIndex = selectionSeed % networkBlobRegistry.length
     selectedBlob = networkBlobRegistry[blobIndex]
  
  3. VERIFY BLOB ELIGIBILITY
     IF selectedBlob has valid DIG Handle registration:
         RETURN selectedBlob
     ELSE:
         INCREMENT validationRound and retry
  
  4. RETURN SELECTED BLOB
     Return selectedBlob for validation
```

This unpredictable validation process prevents gaming and ensures fair reward distribution across all network participants.

## Strategic Randomization Incentives

The economic model naturally encourages DIG Nodes to adopt optimal storage strategies that benefit the entire network:

### Diversification Benefits
- **Varied Content Storage**: Nodes benefit from storing blobs from many different sources
- **Frequent Rotation**: Regular shuffling of blob inventory increases reward probability
- **Maximum Variety**: Wider blob diversity increases chances of selection
- **Continuous Refresh**: Regular updates to capture newly validated content

### "Survival of the Most Diverse"

This creates a **"survival of the most diverse"** dynamic where nodes with varied, frequently updated collections have the highest earning potential:

```
Reward Probability = (Diverse Blobs Stored / Total Network Blobs) × Selection Frequency
```

- **Specialists lose**: Nodes focusing on narrow content categories earn fewer rewards
- **Generalists win**: Nodes storing diverse content across many categories maximize earnings
- **Dynamic optimization**: Successful nodes continuously adapt their storage portfolios

## Content-Agnostic Architecture

DIG Nodes operate **content-agnostically** since blobs are partial fragments of larger files, providing several important benefits:

### Operational Simplicity
- **No Editorial Decisions**: Node operators don't need to make content judgments
- **Automated Management**: Storage decisions driven by economic incentives
- **Reduced Liability**: Cannot be held responsible for content they cannot see
- **Simplified Operations**: Focus on technical performance rather than content curation

### Privacy Protection
- **Fragment Isolation**: Individual blobs are meaningless without complementary fragments
- **Content Obfuscation**: Cannot determine complete content from single fragments
- **Privacy Preservation**: Original content sources remain anonymous
- **Plausible Deniability**: Node operators genuinely don't know what they're storing

### Example Storage Scenario
A single DIG Node might simultaneously store:
- Fragment #1 from a scientific research paper
- Fragment #2 from a DeFi application frontend
- Fragment #3 from a digital art collection
- Fragment #4 from a software documentation site

Without the complementary fragments, none of these individual pieces reveal their source or purpose.

## Network Resilience

The propagation model creates exceptional resilience through several mechanisms:

### Organic Redundancy
- **Popular Content Spreads**: Valuable content naturally achieves wide distribution
- **Economic Incentives**: Higher-value content (with [DIG Handles](../primitives/on-chain/dig-handles.md)) receives prioritized storage
- **Multiple Mirrors**: Important content ends up stored by many independent nodes
- **Geographic Distribution**: Content spreads across diverse geographic locations

### Natural Censorship Resistance
- **Fragmented Storage**: Complete content cannot be taken down by targeting individual nodes
- **Distributed Hosting**: No single point of failure for any piece of content
- **Economic Motivation**: Censorship attempts increase content value and storage incentives
- **Anonymous Storage**: Content-agnostic storage makes targeted censorship difficult

### Dynamic Load Balancing
- **Automatic Distribution**: High-demand content automatically spreads to more nodes
- **Performance Optimization**: Popular content becomes available from more sources
- **Self-Healing**: Network automatically adapts to node failures and departures
- **Scalable Architecture**: Network capacity grows organically with demand

## Economic Cycle

The system creates a self-reinforcing cycle that promotes network health:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        Economic Propagation Cycle                              │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐             │
│  │ Validators      │───▶│ Random Blob     │───▶│ Economic        │             │
│  │ Select Blobs    │    │ Selection       │    │ Incentives      │             │
│  │ (Unpredictable) │    │ (Fair Process)  │    │ (Reward DIG)    │             │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘             │
│                                                          │                      │
│                                                          ▼                      │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐             │
│  │ Network         │◄───│ Content Spreads │◄───│ Rational Nodes  │             │
│  │ Resilience      │    │ Organically     │    │ Diversify       │             │
│  │ Increases       │    │ (Market-Driven) │    │ Storage         │             │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘             │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Cycle Components

1. **Random Validation**: Validators randomly select blobs for verification
2. **Economic Rewards**: DIG Nodes earn rewards for storing validated blobs
3. **Rational Optimization**: Nodes diversify storage to maximize rewards
4. **Content Propagation**: Popular/valuable content achieves wide distribution
5. **Network Resilience**: Distributed storage increases network robustness
6. **Value Growth**: Increased resilience attracts more valuable content

## Propagation Strategies

Different content types benefit from different propagation approaches:

### High-Value Content
- **[DIG Handle Registration](../primitives/on-chain/dig-handles.md)**: Signal value and prioritize propagation
- **[Network Bribes](./bribes.md)**: Pay for enhanced performance and availability
- **Community Support**: Build community backing for important content
- **Long-term Commitment**: Demonstrate sustained value through handle renewals

### General Content
- **Quality Focus**: High-quality content attracts organic storage
- **Natural Selection**: Market forces determine propagation success
- **Performance Optimization**: Well-optimized content spreads more effectively
- **Network Participation**: Active network participation increases visibility

### Specialized Content
- **Niche Communities**: Build dedicated communities around specialized content
- **Cross-Promotion**: Leverage relationships with related content creators
- **Technical Excellence**: Superior technical implementation attracts storage
- **Educational Value**: Educational content often receives community support

## Performance Characteristics

### Propagation Speed
- **Initial Distribution**: High-value content typically achieves 50+ mirrors within 24 hours
- **Geographic Spread**: Global distribution usually completed within 72 hours
- **Availability Improvement**: Each additional mirror reduces average access time
- **Redundancy Building**: Continued propagation creates robust redundancy

### Network Efficiency
- **Optimal Resource Allocation**: Economic incentives drive optimal resource allocation
- **Self-Organizing**: Network organizes itself without central coordination
- **Adaptive Capacity**: Network capacity automatically adjusts to demand
- **Cost Efficiency**: Market-driven costs ensure efficient resource utilization

## Innovation in Decentralized Storage

DIG's blob-level propagation represents several significant innovations:

### Technical Innovation
- **Granular Incentives**: Blob-level rewards enable fine-grained optimization
- **Content Neutrality**: Technical infrastructure separated from content decisions
- **Scalable Architecture**: Linear scaling with network size and content volume
- **Privacy by Design**: Content-agnostic design provides inherent privacy

### Economic Innovation
- **Market-Driven Redundancy**: Economic incentives create optimal redundancy levels
- **Value Discovery**: Market mechanisms efficiently identify valuable content
- **Sustainable Economics**: Self-sustaining economic model without external subsidies
- **Aligned Incentives**: All participants benefit from network health and growth

### Operational Innovation
- **Simplified Node Operation**: Node operators focus on technical excellence rather than content curation
- **Automated Decision Making**: Economic algorithms replace manual content decisions
- **Reduced Operational Risk**: Content-agnostic operation reduces legal and social risks
- **Global Scalability**: Model works across diverse regulatory and cultural environments

The DIG Network's propagation system creates a truly decentralized content distribution network where valuable content spreads based on economic signals, storage occurs without content awareness, and resilience emerges from rational self-interest rather than central planning. 