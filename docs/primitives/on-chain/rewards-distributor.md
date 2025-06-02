---
sidebar_position: 4
---

# Rewards Distributor - Incentive Distribution System

:::tip 💜 Support the DIG Network
**Help build the future of decentralized storage!** The DIG Network is an open-source project that needs community support to continue development. 

**[💜 Support the Project →](../../support.md)** - Donate crypto, buy NFTs, or sponsor development
:::

## Overview

The **DIG Reward Distributor** is a sophisticated on-chain application responsible for continuously distributing incentives to active DIG Nodes (nodes that serve data). Based on a formal Chia Improvement Proposal (CHIP) by yakuhito and Michael Taylor, this singleton uses the action layer and slot-based architecture to enable deterministic, per-second reward distribution while minimizing trust requirements between stakeholders.

## Abstract

The DIG reward distributor is an on-chain application responsible for continuously distributing incentives to active DIG Nodes. The singleton uses a list of active DIG Nodes and their weights (maintained by a trusted validator) to distribute rewards each second. Anyone can commit additional funds for current and future epochs, and commitments for the latter can be partially clawed back (i.e., they're subject to withdrawal penalties) before the start of the epoch designated during deposit.

## Stakeholder Model

The DIG reward distribution scheme involves three main stakeholders with distinct needs and incentives:

### **Reward Sponsors**
- **Role**: Provide funds used to incentivize storage providers
- **Needs**: Transparency on past fund distribution and protection against system failures
- **Protection**: Ability to partially reclaim commitments if the system doesn't work as expected
- **Examples**: Content creators, DeFi protocols, community organizations

### **Validators** 
- **Role**: Determine which DIG Nodes are eligible for rewards and maintain public eligibility lists
- **Responsibilities**: Verify storage claims, assess performance, update DIG Node weights
- **Compensation**: Receive fixed percentage of total epoch rewards
- **Accountability**: Risk reputation and future rewards for misconduct

### **DIG Nodes**
- **Role**: Host data and serve it to the network to earn rewards
- **Expectations**: Fair rewards for meeting eligibility criteria and reliable payout mechanisms
- **Requirements**: Maintain storage, prove accessibility, meet performance standards
- **Protection**: Deterministic reward accrual that validators cannot manipulate

## Core Architecture

### Trustless Escrow System

The Rewards Distributor operates as a **trustless escrow mechanism** that holds [DIG Tokens](../../economics/token-model.md) on-chain until they are claimed by eligible participants. This design ensures that:

- **Validators control distribution logic** but cannot steal funds
- **Rewards are escrowed safely** in smart contracts until claimed
- **No single point of failure** exists for reward distribution
- **Transparent allocation** enables public verification of all rewards

### **Trust Minimization Architecture**

The system is designed to minimize trust requirements between stakeholders while maintaining the necessary centralized validation component:

- **Validators as Trusted Oracles**: Validators publish off-chain data (DIG Node eligibility lists) and keep it up-to-date
- **On-Chain Fund Protection**: Committed funds are held in smart contracts, not controlled by validators
- **Deterministic Reward Logic**: Per-second reward calculations are deterministic and cannot be manipulated
- **Penalty Mechanisms**: Withdrawal penalties discourage sponsor abandonment and validator misconduct

### **Validator Authority Model**

While the Rewards Distributor escrows tokens securely, **validators have sole authority over who can claim rewards and how much** they receive. This creates a balanced system where:

- **Economic security** through on-chain escrow
- **Performance assessment** through validator evaluation
- **Fair distribution** based on verified storage and service quality
- **Fraud prevention** through validator verification processes

## System Requirements

Based on extensive community discussions, the reward distributor satisfies the following critical requirements:

### **Multi-Asset Support**
- **XCH Payouts**: Native XCH reward distribution for broad accessibility
- **CAT Token Support**: Support for any Chia Asset Token, including DIG tokens
- **Asset Flexibility**: Each reward distributor instance supports either XCH or a specific CAT
- **Economic Diversity**: Multiple reward pools can use different asset types

### **Continuous Uptime Rewards**
- **Per-Second Precision**: DIG Node rewards accurately reflect uptime down to the second
- **Deterministic Allocation**: Predictable reward amounts set aside each second
- **Future-Proof Accrual**: Accrued rewards guaranteed even if validators misbehave later
- **No Transaction Overhead**: Rewards accrue without requiring constant transactions

### **Open Epoch Sponsorship**
- **Universal Access**: Anyone can commit incentives for future epochs
- **Clawback Protection**: Committed funds can be partially withdrawn with penalties
- **Sponsor Security**: Protection against validator misconduct through withdrawal mechanisms
- **Economic Incentives**: Penalties make validator misconduct costly to all parties

### **Validator-Controlled DIG Node Management**
- **Exclusive Control**: Only validators can add or remove DIG Nodes from active lists
- **Weight Assignment**: Validators set DIG Node weights based on performance assessment
- **Real-Time Updates**: DIG Node eligibility and weights updated based on ongoing verification
- **Performance-Based Distribution**: Rewards distributed according to validator-assessed contributions

### **Proportional Validator Compensation**
- **Performance-Based Fees**: Validator fees proportional to total epoch payouts
- **Service Coverage**: Fees cover network transaction costs and operational expenses
- **Incentive Alignment**: Fixed percentage ensures validator interests align with network growth
- **Transparent Compensation**: All validator fees publicly recorded and auditable

### **Flexible Payout Mechanisms**
- **Manual Triggers**: DIG Nodes can manually trigger payouts when thresholds are met
- **Automatic Payouts**: Automatic payout processing when DIG Nodes go offline
- **Threshold Optimization**: Configurable minimum thresholds minimize transaction costs
- **Batch Efficiency**: Efficient batch processing for multiple simultaneous payouts

## Key Features

### Continuous Reward Accrual
- **Per-Second Allocation**: DIG Nodes accrue rewards every second they remain eligible
- **Deterministic Distribution**: Rewards are calculated deterministically, preventing validator manipulation
- **Real-Time Updates**: Reward calculations update continuously based on network state
- **Historical Tracking**: Complete history of all reward allocations maintained on-chain

### Validator-Driven DIG Node Management
- **Eligibility Control**: Validators determine which DIG Nodes are eligible for rewards
- **Weight Assignment**: Validators set relative weights based on performance and reliability
- **Dynamic Updates**: DIG Node eligibility and weights can be updated in real-time
- **Performance Metrics**: Validators assess DIG Node performance through [PlotCoin verification](./plotcoin.md)

### Decentralized Funding
- **Multiple Funding Sources**: Anyone can contribute to future reward epochs
- **Sponsorship Model**: Content creators can sponsor rewards for their specific data
- **Early Withdrawal Penalties**: Committed funds include penalties for early withdrawal
- **Transparent Funding**: All funding sources and amounts are publicly visible

### Flexible Payouts
- **Manual Triggers**: Rewards can be manually triggered by eligible DIG Nodes
- **Automatic Payouts**: Automatic payouts when DIG Nodes go offline or reach thresholds
- **Threshold-Based**: Configurable payout thresholds to minimize transaction costs
- **Batch Processing**: Efficient batch processing for multiple DIG Node payouts

### Multi-Asset Support
- **XCH Support**: Native XCH reward distribution
- **CAT Token Support**: Support for any Chia Asset Token including DIG tokens
- **Mixed Rewards**: Different reward pools can use different asset types
- **Asset Conversion**: Integration with DEX protocols for asset conversion

## Technical Implementation

### **Action Layer Integration**

The Rewards Distributor is built using the **Chia action layer** and **slot-based singleton architecture** as specified in the formal CHIP proposal, providing:

- **State Management**: Efficient state management for complex reward calculations using slots
- **Action Processing**: Structured action processing for all distributor operations
- **Singleton Pattern**: Single source of truth for distributor state across the network
- **Deterministic Execution**: Ensures consistent behavior across all network participants
- **Upgradability**: Ability to upgrade distributor logic through governance mechanisms

### **Formal Action Specification**

The distributor implements the following actions as defined in the CHIP specification:

#### **`sync`**
Distributes rewards for the elapsed time since the last sync operation, which occurred in the same epoch.

```
Action: sync
Purpose: Distribute rewards for elapsed time since last sync within same epoch
Frequency: Regular intervals to ensure timely reward distribution
Precision: Per-second accuracy for fair time-based allocation
Validation: Only processes time within current epoch boundaries
Gas Cost: Proportional to number of active DIG Nodes
```

#### **`new_epoch`**
Transitions to a new epoch at the end of the current one, also transferring the validator's fee.

```
Action: new_epoch  
Purpose: End current epoch and transition to new reward period
Validator Fee: Transfers proportional validator fee from epoch total
Timing: Marks clean boundary between reward epochs
Authority: Validator-controlled timing for epoch transitions
State Reset: Prepares distributor state for new epoch calculations
```

#### **`commit_incentives` & `withdraw_incentives`**
Used to commit incentives for a future epoch (i.e., sponsor it) and to withdraw a previous commitment. The latter operation carries an associated penalty.

```
Action: commit_incentives
Purpose: Add funding for future reward epochs (sponsorship)
Target: Specific future epoch designation
Clawback: Subject to withdrawal penalties before epoch start
Lock Period: Funds locked until designated epoch begins

Action: withdraw_incentives
Purpose: Withdraw previously committed future epoch funding
Penalty: Associated withdrawal penalty applied
Protection: Enables sponsor protection against validator misconduct
Economics: Makes validator misconduct costly to all parties
```

#### **`add_current_epoch_incentives`**
Adds incentives to the current epoch. The amount cannot be clawed back.

```
Action: add_current_epoch_incentives
Purpose: Add immediate, non-withdrawable incentives to current epoch
Irreversibility: Cannot be clawed back once committed
Use Case: Immediate reward boosts for network growth or performance
Timing: Only affects currently active epoch
Integration: Immediately available for current epoch distribution
```

#### **`add_mirror` & `remove_mirror`**
Used by the validator to modify the active DIG Node list.

```
Action: add_mirror
Purpose: Add new DIG Node to active reward distribution list
Authority: Validator-exclusive control
Requirements: DIG Node must meet eligibility criteria
Weight Assignment: Validator assigns initial performance weight
Integration: Immediate integration into reward calculations

Action: remove_mirror
Purpose: Remove DIG Node from reward eligibility
Triggers: Failed verification, poor performance, or offline status
Authority: Validator-exclusive control
Payout: Triggers automatic payout of accrued rewards
```

#### **`initiate_payout`**
Initiates a payout of accrued rewards for a DIG Node. The payout amount needs to exceed a minimum threshold defined at distributor launch.

```
Action: initiate_payout
Purpose: Trigger payout of accrued rewards for specific DIG Node
Threshold: Must exceed minimum payout amount set at launch
Trigger: Manual by DIG Node operator or automatic on removal
Gas Optimization: Threshold minimizes transaction costs
Batch Capable: Can be combined with other payout operations
```

## Reward Calculation Model

### Per-Second Allocation

Rewards are allocated on a per-second basis using the following formula:

```
DIG Node Reward Per Second = (Total Epoch Rewards × DIG Node Weight) / (Total Weights × Epoch Duration)

Where:
- Total Epoch Rewards: Total tokens allocated for the current epoch
- DIG Node Weight: Validator-assigned weight for the DIG Node
- Total Weights: Sum of all active DIG Node weights
- Epoch Duration: Length of the current epoch in seconds
```

### Weight-Based Distribution

Validators assign weights to DIG Nodes based on multiple factors:

- **Storage Capacity**: Amount of data stored by the DIG Node
- **Service Quality**: Uptime, response time, and reliability metrics
- **Network Contribution**: Geographic distribution and network diversity
- **Performance History**: Historical performance and reliability
- **Community Value**: Storage of high-value, handle-registered content

### Dynamic Adjustments

Validator can adjust DIG Node weights in real-time based on:

- **Performance Changes**: Response to improved or degraded performance
- **Network Needs**: Incentivizing storage in underserved regions
- **Content Priority**: Higher weights for DIG Nodes storing priority content
- **Economic Factors**: Adjustments based on network economics and token values

## Security and Audit

### **Critical Puzzle Security**

Because the reward distributor controls committed funds until they're paid out, **puzzle risk is a significant concern**, especially in the context of an on-chain application with such complexity. The CHIP specification emphasizes multiple security layers:

#### **Community Review Process**
- **Multi-Party Review**: Multiple members of the Chia community have reviewed the puzzles
- **Expert Validation**: Chialisp code reviewed by Chia ecosystem contributors and experts
- **Public Scrutiny**: Open-source implementation enables ongoing community security review
- **Continuous Improvement**: Security improvements incorporated based on community feedback

#### **Formal Security Properties**
- **Fund Protection**: Mathematical guarantees that validators cannot steal escrowed funds
- **Deterministic Logic**: Reward calculations are mathematically deterministic and verifiable
- **State Integrity**: Singleton state management ensures consistent global state
- **Action Atomicity**: All actions execute atomically or fail completely

#### **Reference Implementation Security**
- **Comprehensive Testing**: Extensive test suite covering all action edge cases
- **Driver Integration**: Secure driver code for wallet and CLI interactions
- **Production Readiness**: Reference implementation suitable for production deployment
- **SDK Integration**: Integration with chia-wallet-sdk for additional security layers

### **Validator Accountability Framework**

While validators control reward distribution, multiple mechanisms ensure accountability:

- **Public Transparency**: All validator decisions are publicly recorded on-chain
- **Community Oversight**: Community can monitor and question validator decisions through blockchain data
- **Economic Incentives**: Validators receive fees, aligning interests with network health
- **Reputation Stakes**: Validators risk reputation damage from unfair distributions
- **Multi-Signature Protection**: Critical operations require multiple validator signatures

### **Comprehensive Attack Resistance**

The system is designed to resist various attack vectors through multiple security layers:

#### **Financial Attack Resistance**
- **Fund Theft Prevention**: Escrowed funds cryptographically protected from validator theft
- **Reward Manipulation**: Deterministic calculations prevent arbitrary reward changes
- **Sponsor Protection**: Withdrawal penalties and clawback mechanisms protect against validator misconduct
- **Economic Alignment**: All parties have economic incentives for honest behavior

#### **Technical Attack Resistance**
- **Sybil Resistance**: DIG Node eligibility requires verified [PlotCoin](./plotcoin.md) registration
- **Collusion Resistance**: Multiple validators required for major decisions
- **State Manipulation**: Singleton architecture prevents unauthorized state changes
- **Replay Protection**: Each action includes unique identifiers preventing replay attacks

#### **Governance Attack Resistance**
- **Decentralized Control**: No single point of control over critical system functions
- **Community Appeals**: Mechanisms for community dispute resolution
- **Transparent Operations**: All operations publicly auditable on-chain
- **Emergency Procedures**: Well-defined procedures for handling security incidents

## Integration with Network Operations

### Validator Workflow

Validators integrate the Rewards Distributor with their [verification processes](../../network/validation.md):

1. **DIG Node Assessment**: Evaluate DIG Node performance through PlotCoin verification
2. **Weight Assignment**: Assign weights based on assessment results
3. **Sync Operations**: Regularly sync reward distributions
4. **Payout Processing**: Process payouts for eligible DIG Nodes
5. **Epoch Management**: Manage epoch transitions and validator fee collection

### DIG Node Perspective

From a DIG Node's perspective, the reward process is:

1. **Registration**: Create [PlotCoins](./plotcoin.md) to prove data storage
2. **Validator Assessment**: Wait for validator verification and weight assignment
3. **Reward Accrual**: Continuously accrue rewards while maintaining service
4. **Payout Claims**: Claim accumulated rewards when thresholds are met
5. **Performance Monitoring**: Maintain performance to preserve reward eligibility

## Economic Incentives

### Validator Incentives

Validators receive multiple incentives for reliable operation:

- **Percentage Fees**: Receive a percentage of total epoch rewards
- **[DIG Handle](./dig-handles.md) Fees**: Receive registration fees from handle registration
- **Reputation Benefits**: Build reputation through fair and reliable operation
- **Network Growth**: Benefit from overall network growth and token appreciation

### DIG Node Incentives

DIG Nodes are incentivized through:

- **Continuous Rewards**: Ongoing reward accrual for proven storage
- **Performance Bonuses**: Higher weights for better performance
- **Geographic Premiums**: Bonuses for serving underserved regions
- **Priority Content**: Enhanced rewards for storing high-value content

### Sponsor Incentives

Content creators and sponsors can enhance reward distribution through:

- **Direct Sponsorship**: Fund specific reward epochs for their content
- **[Network Bribes](../../network/bribes.md)**: Create specialized reward pools
- **Community Funding**: Collaborate with community for sustainable funding
- **Long-term Commitments**: Benefit from long-term funding commitments

## Performance Characteristics

### Scalability Metrics

The Rewards Distributor is designed for network-scale operation:

- **DIG Node Capacity**: Support for thousands of active DIG Nodes
- **Reward Precision**: Per-second precision for fair allocation
- **Transaction Efficiency**: Batch operations minimize blockchain costs
- **State Management**: Efficient state management for complex calculations

### Cost Optimization

Multiple features optimize operational costs:

- **Batch Processing**: Combine multiple operations into single transactions
- **Threshold Payouts**: Minimize transaction costs through configurable thresholds
- **Efficient Encoding**: Optimized data encoding for minimal on-chain storage
- **Gas Optimization**: Chialisp code optimized for minimal execution costs

## Reference Implementation and Testing

### **CHIP-Compliant Implementation**

The DIG Reward Distributor is based on a formal reference implementation that follows the CHIP specification:

#### **Implementation Components**
- **Chialisp Puzzles**: Core smart contract logic implementing all action types
- **Driver Code**: Python drivers for wallet and application integration
- **CLI Interface**: Command-line interface for deploying and interacting with distributors
- **Testing Suite**: Comprehensive tests covering all action edge cases and security scenarios

#### **Integration Points**
- **Sage RPC**: Integration with Sage RPC for blockchain interaction
- **Coinset.org Service**: Integration with Coinset.org for enhanced functionality
- **Chia Wallet SDK**: Potential integration with chia-wallet-sdk for additional security
- **Production Deployment**: Tools and documentation for production deployment

### **Comprehensive Test Coverage**

The reference implementation includes extensive testing to ensure reliability and security:

#### **Test Categories**
- **Action Validation**: Tests for all supported actions under various conditions
- **Edge Case Handling**: Comprehensive edge case testing for unusual scenarios
- **Security Testing**: Tests for attack resistance and fund protection
- **Performance Testing**: Scalability and efficiency testing for production loads

#### **Quality Assurance**
- **Community Review**: Multiple Chia ecosystem contributors have reviewed the implementation
- **Regression Testing**: Automated testing to prevent implementation regressions
- **Integration Testing**: End-to-end testing of complete reward distribution workflows
- **Security Auditing**: Ongoing security review and improvement processes

## Future Enhancements

### **DAO Integration**

Future versions will integrate with Chia's DAO primitives for enhanced decentralization:

- **Decentralized Governance**: Community voting on distributor parameters and policies
- **Validator Selection**: DAO-based validator selection and removal processes
- **Parameter Tuning**: Community-driven optimization of reward parameters
- **Upgrade Governance**: Decentralized decision-making for system upgrades and improvements

### **Enhanced Functionality**

Planned enhancements based on community feedback and evolving requirements:

- **Advanced Analytics**: Detailed analytics on reward distribution and DIG Node performance
- **Predictive Modeling**: Predictive models for optimal reward allocation strategies
- **Geographic Optimization**: Enhanced geographic distribution incentives and analysis
- **Quality of Service**: Sophisticated quality-of-service metrics and reward adjustments
- **Cross-Chain Integration**: Potential integration with other blockchain ecosystems

### **Ecosystem Integration**

Future integration with broader Chia ecosystem developments:

- **DeFi Integration**: Integration with Chia DeFi protocols for enhanced functionality
- **NFT Rewards**: Support for NFT-based rewards and incentive mechanisms
- **Layer 2 Solutions**: Integration with Chia layer 2 solutions for improved scalability
- **Interoperability**: Cross-chain reward distribution for multi-blockchain applications

## Conclusion

The DIG Reward Distributor represents a sophisticated approach to incentive distribution that balances security, fairness, and efficiency while maintaining the decentralized properties essential to the DIG Network's mission. Based on a formal CHIP specification and backed by comprehensive testing and community review, the system provides a robust foundation for continuous reward distribution in decentralized storage networks.

**Key Achievements:**
- **Trust Minimization**: Reduced trust requirements between stakeholders through cryptographic guarantees
- **Economic Alignment**: Aligned incentives for all participants in the reward ecosystem
- **Technical Excellence**: Production-ready implementation with comprehensive security measures
- **Community Validation**: Extensive community review and testing for reliability and security

The system's design enables sustainable economic incentives for decentralized storage while maintaining the security and transparency essential for long-term network success. 