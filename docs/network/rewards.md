---
sidebar_position: 6
---

# Reward Distribution System

:::tip 💜 Support the DIG Network
**Help build the future of decentralized storage!** The DIG Network is an open-source project that needs community support to continue development. 

**[💜 Support the Project →](../support.md)** - Donate crypto, buy NFTs, or sponsor development
:::

## Overview

The DIG Network's reward distribution system creates a **self-sustaining circular economy** where content creators fund storage providers through domain registration fees, validators ensure network integrity, and economic incentives align with actual data availability. This system ensures that storage providers are compensated fairly for genuine service while maintaining network security and preventing fraud.

## Economic Foundation

### **Circular Token Economy**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         DIG Token Circular Economy                              │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  CONTENT CREATORS                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ • Pay DIG tokens for domain registration (DIG Handles)                  │   │
│  │ • Signal content value through market pricing                           │   │
│  │ • Create economic incentives for storage providers                      │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                            │
│                                    ▼ (Domain fees fund rewards)                 │
│  TOKEN FLOW TO REWARD POOL                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ • DIG Handle registration fees → Reward Distributor escrow              │   │
│  │ • Network bribes → Performance incentive pools                          │   │
│  │ • Staking requirements → Network security deposits                      │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                            │
│                                    ▼ (Validators distribute rewards)            │
│  VALIDATOR COORDINATION                                                        │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ • Random blob selection for verification                                │   │
│  │ • Cryptographic proof validation (zero-knowledge)                       │   │
│  │ • Network liveness testing and fraud detection                          │   │
│  │ • Reward eligibility determination based on performance                 │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                            │
│                                    ▼ (Rewards distributed to proven storage)    │
│  STORAGE PROVIDERS                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ • Earn DIG tokens for proven, accessible storage                        │   │
│  │ • Higher rewards for diverse content portfolios                         │   │
│  │ • Economic sustainability through predictable compensation              │   │
│  │ • Reinvest in infrastructure expansion and network growth               │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### **Value Signal Propagation**

Domain registration costs serve as **market-driven value signals** that propagate through the reward system:

**High-Value Content (Expensive Domains):**
- Higher domain registration fees signal valuable content
- Increased funding in reward pools attracts more storage providers
- Natural redundancy through competitive storage provision
- Economic sustainability through premium pricing

**Standard Content (Moderate Domain Costs):**
- Balanced economic incentives for typical content storage
- Appropriate redundancy levels matching content value
- Sustainable economics through standard market pricing

**Niche Content (Lower Domain Costs):**
- Specialized storage providers serve underserved markets
- Economic viability through reduced competition
- Targeted storage based on specific community needs

## Validator-Controlled Reward Distribution

### **[Reward Distributor](../primitives/on-chain/rewards-distributor.md) Integration**

Validators work together, typically under a **shared multisig**, to determine reward eligibility:

```
ALGORITHM: Validator Reward Distribution Process
PURPOSE: Fairly distribute DIG tokens to legitimate storage providers

INPUT:
  - validationEpoch: Current validation period
  - rewardPool: Available DIG tokens for distribution
  - validatorSet: Active validators participating in coordination

OUTPUT: Updated reward distributions for eligible storage providers

STEPS:
  1. COLLABORATIVE BLOB SELECTION
     // Validators coordinate to select blobs for verification
     blockHash = GetLatestChiaBlockHash()
     selectionSeed = SHA-256(blockHash + validationEpoch + "REWARD_VALIDATION")
     
     selectedBlobs = DeterministicBlobSelection(selectionSeed, BLOBS_PER_EPOCH)
     
     // Distribute verification workload among validators
     validatorAssignments = AssignBlobsToValidators(selectedBlobs, validatorSet)
  
  2. COMPREHENSIVE VERIFICATION PROCESS
     verificationResults = []
     
     FOR each validator in validatorSet:
         assignedBlobs = validatorAssignments[validator]
         
         FOR each blobId in assignedBlobs:
             // Perform complete validation (see network/validation.md)
             result = PerformComprehensiveValidation(blobId, validationEpoch)
             verificationResults.append(result)
  
  3. CROSS-VALIDATOR CONSENSUS
     // Ensure consensus among validators for disputed cases
     consensusResults = []
     
     FOR each result in verificationResults:
         IF result.requiresConsensus OR result.isFlagged:
             consensusDecision = ValidatorConsensusProcess(result, validatorSet)
             consensusResults.append(consensusDecision)
         ELSE:
             consensusResults.append(result)
  
  4. REWARD CALCULATION AND WEIGHT ASSIGNMENT
     rewardAssignments = []
     
     FOR each validResult in consensusResults:
         IF validResult.isValid AND validResult.passedLivenessCheck:
             weight = CalculateRewardWeight(validResult, {
                 confidenceLevel: validResult.confidence,
                 responseTime: validResult.networkResponseTime,
                 providerReliability: validResult.historicalPerformance,
                 contentValue: GetContentValueSignal(validResult.blobId),
                 diversityBonus: CalculateDiversityBonus(validResult.provider)
             })
             
             rewardAssignments.append({
                 provider: validResult.provider,
                 blobId: validResult.blobId,
                 weight: weight,
                 validationEpoch: validationEpoch
             })
  
  5. REWARD DISTRIBUTOR UPDATE
     // Update on-chain reward distributor with new assignments
     FOR each assignment in rewardAssignments:
         AddToRewardDistributor(
             recipient: assignment.provider,
             weight: assignment.weight,
             epoch: assignment.validationEpoch,
             evidence: assignment.validationProof
         )
  
  6. VALIDATOR FEE COLLECTION
     // Validators receive percentage fees for coordination services
     totalRewards = CalculateTotalEpochRewards(rewardAssignments)
     validatorFees = totalRewards * VALIDATOR_FEE_PERCENTAGE
     
     DistributeValidatorFees(validatorFees, validatorSet)
  
  7. FRAUD DETECTION AND PENALTIES
     // Apply penalties for any detected fraudulent behavior
     FOR each fraudCase in DetectedFraudCases(verificationResults):
         ApplyFraudPenalty(fraudCase.provider, fraudCase.penaltyAmount)
         RemoveFromRewardDistributor(fraudCase.provider, validationEpoch)
```

### **Multi-Validator Consensus Model**

**Consensus Requirements:**
- **Majority Agreement**: Require 67%+ validator agreement for reward distribution
- **Dispute Resolution**: Multi-round consensus process for disputed validations
- **Transparency**: All validator decisions recorded on-chain for accountability
- **Economic Stakes**: Validators risk reputation and economic penalties for false decisions

**Security Properties:**
- **No Fund Control**: Validators cannot steal escrowed tokens
- **Reputation Stakes**: Public validators risk severe reputational damage for fraud
- **Economic Incentives**: Validator fees align interests with network health
- **Decentralized Authority**: No single validator can control reward distribution

## Reward Calculation Methodology

### **Dynamic Weight Assignment**

Rewards are calculated using a sophisticated weighting system that considers multiple factors:

```
ALGORITHM: Calculate Storage Provider Reward Weight
PURPOSE: Determine fair reward allocation based on multiple performance factors

FACTORS:
  1. PROOF_CONFIDENCE_SCORE (40% weight)
     // Based on zero-knowledge proof verification confidence
     confidenceWeight = validationResult.confidence * 0.40
  
  2. NETWORK_PERFORMANCE_SCORE (25% weight)
     // Based on response time and accessibility
     responseScore = ScaleResponseTime(validationResult.responseTime)
     availabilityScore = validationResult.availability
     performanceWeight = (responseScore + availabilityScore) / 2 * 0.25
  
  3. CONTENT_VALUE_SIGNAL (20% weight)
     // Based on DIG Handle registration cost as value proxy
     domainCost = GetAssociatedDomainCost(validationResult.blobId)
     valueWeight = ScaleValueSignal(domainCost) * 0.20
  
  4. DIVERSITY_BONUS (10% weight)
     // Reward for storing diverse/rare content
     diversityScore = CalculateContentDiversityBonus(
         provider.contentPortfolio,
         networkContentDistribution
     )
     diversityWeight = diversityScore * 0.10
  
  5. RELIABILITY_HISTORY (5% weight)
     // Based on historical performance and uptime
     reliabilityScore = GetProviderReliabilityScore(
         provider,
         lookbackPeriod: 30 * 24 * 60 * 60 * 1000  // 30 days
     )
     reliabilityWeight = reliabilityScore * 0.05

TOTAL_WEIGHT = (
    confidenceWeight +
    performanceWeight +
    valueWeight +
    diversityWeight +
    reliabilityWeight
)

// Apply additional modifiers
IF provider.hasNetworkBrideBonus:
    TOTAL_WEIGHT *= BRIBE_MULTIPLIER

IF provider.isFirstTimeValidator:
    TOTAL_WEIGHT *= NEW_PROVIDER_BONUS

RETURN TOTAL_WEIGHT
```

### **Economic Incentive Alignment**

**Reward Distribution Principles:**
- **Pay for Performance**: Higher performing providers receive proportionally more rewards
- **Diversity Incentives**: Bonus rewards for storing rare/unique content
- **Value Alignment**: Higher value content (expensive domains) generates higher rewards
- **Reliability Premiums**: Consistent, reliable providers earn reputation bonuses
- **Geographic Distribution**: Incentives for global content distribution

**Anti-Gaming Mechanisms:**
- **Proof-of-Work Requirements**: Prevents free-riding through computational commitment
- **Staking Requirements**: Economic commitment required for reward eligibility
- **Fraud Detection**: Comprehensive fraud detection with severe economic penalties
- **Nullifier Systems**: Prevents double-spending and proof reuse
- **Cross-Validation**: Multiple validators must agree on reward eligibility

## Validator Economics and Governance

### **Validator Compensation Model**

**Revenue Sources:**
```
Validator Revenue Streams:

1. Reward Distribution Fees (Primary):
   - Percentage of total distributed rewards (typically 2-5%)
   - Scales with network growth and activity
   - Predictable income based on validation volume

2. DIG Handle Registration Fees:
   - Direct fees from domain registration services
   - Immediate revenue from content creator activity
   - Market-driven pricing based on domain demand

3. Network Governance Participation:
   - Fees for parameter adjustment and network upgrades
   - Compensation for governance proposal evaluation
   - Long-term protocol development incentives

4. Performance Bonuses:
   - Bonuses for exceptional validation accuracy
   - Rewards for fraud detection and network protection
   - Incentives for high availability and responsiveness
```

**Operating Costs:**
- **Infrastructure**: Servers, bandwidth, and monitoring systems
- **Development**: Ongoing validator software development and maintenance
- **Security**: Security audits, key management, and operational security
- **Legal**: Compliance, legal structure, and regulatory requirements

### **Governance and Network Parameters**

**Validator Authority Over Network Parameters:**
- **Difficulty Thresholds**: Set minimum computational work requirements
- **Reward Distribution Rates**: Adjust reward percentages and timing
- **Fraud Detection Sensitivity**: Tune fraud detection algorithms
- **Performance Requirements**: Set standards for provider performance
- **Economic Parameters**: Adjust staking requirements and penalty amounts

### **Future DAO Governance Transition**

When Chia's DAO primitives reach production readiness, the DIG Network will transition to a **community-controlled governance model** where DIG token holders directly control validator hiring/firing and receive dividends from Handle registration fees.

**Key DAO Features:**
- **Community Validator Management**: DIG token holders vote on validator hiring and firing
- **Value Accrual**: 10% of Handle registration fees flow to DAO treasury with quarterly dividends to token holders  
- **Democratic Governance**: Quadratic voting with anti-whale mechanisms ensures decentralized control
- **Automated Operations**: Smart contracts handle validator performance monitoring and reward distribution

For complete details on the DAO governance architecture, economic model, and transition plan, see **[DAO Governance Model](./dao-governance.md)**.

## Integration with Network Primitives

### **[PlotCoin](../primitives/on-chain/plotcoin.md) Integration**

Reward eligibility is directly tied to PlotCoin verification:
- **Active PlotCoins Required**: Must have valid, non-expired PlotCoin for reward eligibility
- **Proof Package Validation**: All five zero-knowledge proofs must pass verification
- **Network Location Verification**: Must serve content from claimed network locations
- **Staking Requirements**: Must maintain minimum DIG token stake in PlotCoin

### **[DIG Handle](../primitives/on-chain/dig-handles.md) Value Signals**

Domain registration costs create value signals that influence reward distribution:
- **Premium Content**: Expensive domain registrations signal high-value content
- **Market-Driven Prioritization**: Higher domain costs lead to higher storage rewards
- **Economic Sustainability**: Domain fees directly fund storage provider compensation
- **Value-Based Redundancy**: More valuable content naturally attracts more storage providers

### **Network Bribes Enhancement**

Content creators can enhance rewards through network bribes:
- **Performance Incentives**: Direct payments for improved performance
- **Consolidation Rewards**: Higher payments for specialized content consolidation
- **Geographic Targeting**: Incentives for storage in specific geographic regions
- **Quality Bonuses**: Premium payments for exceptional service quality

## Security and Attack Resistance

### **Economic Security Measures**

**Staking-Based Security:**
- **Required Stakes**: Storage providers must stake DIG tokens for participation
- **Slashing Penalties**: Fraudulent behavior results in lost staked tokens
- **Economic Incentives**: Honest behavior preserves and grows token holdings
- **Long-term Alignment**: Economic incentives align with long-term network health

**Validator Security:**
- **Reputation Stakes**: Public validators risk severe reputational damage
- **Economic Penalties**: Financial consequences for incorrect validation decisions
- **Multisig Coordination**: No single validator can control reward distribution
- **Transparency Requirements**: All decisions recorded on-chain for accountability

### **Fraud Prevention and Detection**

**Technical Fraud Detection:**
- **SNARK Input Verification**: Detect zero-knowledge proofs built with forged data
- **Duplicate Registration Detection**: Prevent same plot from earning multiple rewards
- **Temporal Consistency Validation**: Detect inconsistent timing in proof generation
- **Cross-Proof Consistency**: Verify consistency across all five proof types

**Economic Fraud Prevention:**
- **Staking Requirements**: Economic commitment prevents spam participation
- **Slashing Mechanisms**: Severe penalties for detected fraudulent behavior
- **Reputation Systems**: Long-term consequences for bad actors
- **Validator Incentives**: Economic alignment prevents validator collusion

The DIG Network's reward distribution system creates a sustainable economic ecosystem where value flows naturally from content creators to storage providers based on proven performance, creating long-term incentives for reliable, high-quality service provision while maintaining network security and decentralization. 