---
sidebar_position: 3
---

:::tip 💜 Support the DIG Network
**Help build the future of decentralized storage!** The DIG Network is an open-source project that needs community support to continue development. 

**[💜 Support the Project →](../../support.md)** - Donate crypto, buy NFTs, or sponsor development
:::

# DIG Handles - Human-Readable Domain System

## Overview

DIG Handles provide a human-readable domain system for the DIG Network, allowing users to register `*.dig` domain names and associate them with specific [DataStores](./datastore.md). This system acts as a **market-driven value signal**, helping validators prioritize high-value content for global propagation and reward distribution.

## Core Problem and Solution

While [DataStores](./datastore.md) on the DIG Network are free to create and can contain unlimited data, this presents a challenge for validators attempting to prioritize and incentivize **high-value data**. Since there's no inherent way to assess value, DIG Handles provide a mechanism to signal it through economic commitment.

### Value Signaling Mechanism

Spending [DIG Tokens](../../economics/token-model.md) to register and maintain a DIG Handle acts as a **market-driven signal of value**. The DIG Network assumes that if someone is willing to pay for and renew a handle, the corresponding DataStore is valuable and should be considered for **global propagation**.

## Handle System Architecture

DIG Handles are based on the [XCHandles system](https://docs.xchandles.com/) developed by Yakuhito, which serves as "the Chia equivalent of the Ethereum Name Service and the first fully decentralized registry of this kind." DIG Handles fork this proven architecture to provide a fully decentralized, on-chain domain registration system specifically for the DIG Network.

### **XCHandles Foundation**

XCHandles functions as a **decentralized address book** where users can register human-friendly handles such as `@yakuhito`, which can then be associated with XCH addresses, profile pictures, display names, and metadata. DIG Handles extend this concept by:

- **Forking the Core Registry**: Using the same decentralized registry architecture
- **DIG-Specific Integration**: Linking handles directly to [DataStores](./datastore.md) instead of just addresses
- **Value Signal Focus**: Emphasizing economic signaling for content prioritization
- **Network Propagation**: Triggering automated content propagation through handle registration

### **Core Registry Operations**

The underlying smart puzzle, inherited from the XCHandles architecture, provides comprehensive functionality through several key actions:

#### **Registration Actions**
1. **Register Action**: Register a new DIG Handle using DIG Tokens as payment
2. **Link the handle** to a specific DataStore ID
3. **Extend Action**: Renew the handle after its prepaid period ends or prepay ownership as far into the future as desired
4. **Update Action**: Modify handle metadata, DataStore associations, or other properties
5. **Transfer ownership** to different Chia addresses

#### **Lifecycle Management Actions**
- **Expire Action**: Automatically handle expired handles, making them available for re-registration
- **Refund Action**: Process refunds for invalid or failed registrations
- **Oracle Action**: Handle external data integration and price feeds for dynamic pricing

#### **Advanced Operations**
The registry also supports sophisticated state management through:
- **State Scheduler**: Manages time-based transitions and automated handle lifecycle events
- **Pricing Puzzles**: Dynamic pricing mechanisms that can adjust costs based on demand and handle characteristics

### No Central Authority

- **Fully On-Chain**: All registration logic exists in smart contracts
- **Decentralized**: No central authority manages registrations
- **Trustless**: Registration and renewal processes are automated
- **Censorship Resistant**: Cannot be taken down or controlled by any single entity

## Economic Model

### Registration and Renewal Costs

DIG Handle registration requires payment in DIG Tokens, creating direct economic value signals:

```
Current Economic Flow:
DIG Handle Registration Fee → Validator Multisig → Network Operations

Future DAO Economic Flow (when Chia DAO primitives are ready):
DIG Handle Registration Fee → {
  70% → Storage Provider Rewards
  15% → Validator Compensation  
  10% → DAO Treasury (dividends to DIG token holders)
  5%  → Protocol Development
}
```

- **Initial Registration**: Pay DIG tokens to register a new handle
- **Renewal Payments**: Periodic payments to maintain handle ownership
- **Prepayment Option**: Pay for multiple years in advance
- **Validator Compensation**: Registration fees flow to validator multisig as payment for their work
- **Future DAO Value Accrual**: When Chia DAO primitives become production-ready, a portion of registration fees will flow to a community-controlled DAO treasury, creating direct value flow to DIG token holders through quarterly dividends. See **[DAO Governance Model](../../network/dao-governance.md)** for complete details on the DAO economic model and governance structure.

### **Dynamic Pricing Mechanisms**

Inherited from XCHandles' **Pricing Puzzles** system, DIG Handles support sophisticated pricing strategies:

#### **Pricing Factors**
- **Handle Length**: Shorter handles command premium pricing (similar to domain names)
- **Character Set**: Premium characters or patterns may have higher costs
- **Demand-Based Pricing**: Costs can adjust based on registration volume and network demand
- **Temporal Pricing**: Costs may vary based on registration timing or network conditions
- **Category-Based Pricing**: Different content categories may have different base prices

#### **Oracle Integration**
- **External Price Feeds**: Integration with external data sources for DIG token pricing
- **Market Data**: Real-time market data to adjust handle costs relative to USD or other currencies
- **Network Metrics**: Pricing adjustments based on network utilization and value creation

### **Value Signal Properties**

The economic commitment creates several important signals:

- **Genuine Value**: Willingness to pay indicates perceived value
- **Ongoing Commitment**: Renewal payments demonstrate continued value
- **Market Pricing**: Handle costs reflect market-driven value assessment
- **Prioritization**: Paid handles receive prioritized propagation
- **Quality Filtering**: Economic barriers naturally filter for higher-quality content

## Network Propagation Trigger

Once a valid DIG Handle is registered and its associated DataStore has a non-empty Merkle root on-chain, validators will begin awarding DIG Tokens to DIG Nodes that include the data in their plot files and serve it to the network.

### Propagation Workflow

1. **Handle Registration**: User registers a DIG Handle for their DataStore
2. **DataStore Validation**: Validators verify DataStore has non-empty Merkle root
3. **Propagation Signal**: Network begins incentivizing storage of associated data
4. **Plot Creation**: DIG Nodes plot the data and create [PlotCoins](./plotcoin.md)
5. **Reward Distribution**: Validators verify storage and distribute rewards

### Manual Plotting Required

Note that the DataStore owner must still plot the DataStore files and create PlotCoins from a server for the network to discover them. The handle registration signals value but doesn't automatically propagate the data—actual storage commitment is still required.

## Handle Management

### Reassignment Flexibility

Any DataStore can be assigned to a DIG Handle, and handles can be reassigned multiple times:

- **Multiple Assignments**: Same DataStore can be assigned to multiple handles
- **Reassignment**: Handles can be reassigned to new DataStores
- **Expiration Handling**: Expired handles can be re-registered by anyone
- **Community Takeover**: Valuable content can be supported by community handle registration

### Expiration and Renewal

If a handle expires and is not renewed:

- **Assumption of Reduced Value**: Protocol assumes the DataStore is no longer valued
- **Incentive Cessation**: Incentive to propagate the data will cease
- **Re-registration Opportunity**: Any party can step in to re-register the handle
- **Value Continuity**: Valuable data can continue to be recognized through new registrations

## Decentralized Funding Models

### Community-Driven Renewals

The DIG registry allows **anyone to renew a handle** by interacting with the registry singleton, enabling decentralized funding models:

#### Potential Funding Sources
- **NFT Royalties**: Earmark royalties for handle renewal
- **Community Donations**: Crowdfunded handle renewals
- **DeFi Protocol Fees**: Allocate protocol fees (e.g., 0.001%) toward automatic renewals
- **DAO Treasury**: Use DAO funds to maintain important handles

#### Implementation Challenges
Due to current technical constraints:
- **Active Executor Required**: Manual execution needed to process renewals
- **No Automatic Spending**: Cannot automatically spend accumulated funds
- **Tip Mechanism**: Include tips for executors to incentivize action
- **Fee Market Pressure**: Can introduce inefficiencies under high fees

### Example Community Funding

```
NFT Collection Handle Renewal:
1. NFT Collection generates royalties
2. Portion of royalties allocated to handle renewal fund
3. Community member monitors expiration
4. Community member executes renewal transaction
5. Transaction funded from accumulated royalties
6. Executor receives tip for performing renewal
```

## Technical Implementation

### **Registry Architecture** 

DIG Handles inherit the sophisticated architecture from XCHandles, which uses a combination of singleton patterns and state management to create a fully decentralized registry:

#### **Core Components**
- **Registry Singleton**: Main contract that maintains the global handle state
- **Pricing Puzzles**: Dynamic pricing mechanisms for handle registration costs
- **State Scheduler**: Automated state transitions for expiration and renewal
- **Oracle Integration**: External data feeds for pricing and validation

### **Handle Registry Structure**

```
DIG Handle Registry Entry:
{
  handleName: String,              // Human-readable handle (e.g., "mysite.dig")
  owner: ChiaPublicKey,            // Current owner's public key
  linkedDataStore: DataStoreID,    // Associated DataStore identifier
  registrationDate: Timestamp,     // Initial registration time
  expirationDate: Timestamp,       // Handle expiration time
  renewalHistory: [Timestamp],     // History of renewal dates
  registrationFee: DIG_Tokens,     // Amount paid for registration
  
  // Extended DIG-specific metadata
  metadata: {
    description: String,           // Handle description
    category: String,              // Content category
    contentValue: Number,          // Estimated content value signal
    propagationPriority: Number,   // Network propagation priority
    customFields: Object           // Custom metadata
  },
  
  // XCHandles compatibility
  profileData: {
    displayName: String,           // Public display name
    avatar: String,                // Profile picture hash
    socialLinks: Object,           // Associated social media
    contactInfo: Object            // Contact information
  }
}
```

### **Smart Contract Operations**

The handle registry supports comprehensive operations inherited from XCHandles:

#### **Primary Actions**
- **`register_action`**: Register a new handle with DIG token payment and DataStore linking
- **`extend_action`**: Extend handle expiration with additional payment (replaces simple renewal)
- **`update_action`**: Modify handle metadata, DataStore associations, or profile information
- **`expire_action`**: Process automatic expiration and make handles available for re-registration
- **`refund_action`**: Handle payment refunds for failed or invalid registrations
- **`oracle_action`**: Process external data for dynamic pricing and validation

#### **Query Operations**
- **`query_handle`**: Retrieve complete handle information and linked DataStore
- **`query_owner`**: Get all handles owned by a specific address
- **`query_datastore`**: Find handles associated with a specific DataStore
- **`query_expiration`**: Check handle expiration status and renewal requirements

#### **Administrative Operations**
- **`transfer_ownership`**: Transfer handle to new Chia address
- **`bulk_operations`**: Batch multiple operations for efficiency
- **`emergency_recovery`**: Handle dispute resolution and emergency situations

### **XCHandles Compatibility and Relationship**

DIG Handles maintain compatibility with the underlying [XCHandles architecture](https://docs.xchandles.com/) while extending functionality for DIG Network-specific use cases:

#### **Shared Infrastructure**
- **Core Registry Logic**: Identical underlying smart contract patterns from XCHandles
- **Action System**: Same action-based operations (register, extend, update, expire, etc.)
- **State Management**: Compatible state scheduling and lifecycle management systems
- **Security Model**: Identical cryptographic security and anti-fraud mechanisms

#### **DIG-Specific Extensions**
- **DataStore Linking**: Enhanced metadata to link handles directly to DIG DataStores
- **Value Signaling**: Additional fields for content value assessment and propagation signals
- **Network Integration**: Deep integration with DIG Network validation and reward systems
- **Economic Alignment**: Token economics aligned with DIG Network incentive structure

#### **Cross-System Compatibility**
- **Tooling Compatibility**: Existing XCHandles tools can often be adapted for DIG Handles
- **Developer Experience**: Familiar patterns for developers already working with XCHandles
- **Migration Paths**: Potential future interoperability between XCHandles and DIG Handles
- **Shared Ecosystem**: Benefits from XCHandles ecosystem development and improvements

**Note**: While DIG Handles are based on XCHandles architecture, they operate as a separate registry with DIG-specific functionality and use DIG Tokens instead of XCH for payments.

## Security and Anti-Gaming

### Squatting Prevention

While the system allows anyone to register available handles, several mechanisms prevent harmful squatting:

- **Economic Cost**: Registration requires real DIG token payment
- **Renewal Required**: Squatters must continue paying to maintain control
- **Market Forces**: Popular handles will be bid up to fair market value
- **Community Action**: Valuable content can be supported by community funding

### Fraud Resistance

- **Blockchain Verification**: All registrations verified on Chia blockchain
- **Cryptographic Binding**: Handles cryptographically bound to owners
- **Payment Verification**: DIG token payments verified before registration
- **Immutable History**: Complete audit trail of all handle operations

## Use Cases

### Content Publishing
- **Website Hosting**: Register handles for decentralized websites
- **Application Frontends**: DeFi and web application frontends
- **Documentation**: Technical documentation and guides
- **Portfolio Sites**: Personal or business portfolios

### Brand Protection
- **Trademark Protection**: Register handles matching existing trademarks
- **Brand Consistency**: Maintain consistent naming across platforms
- **Community Projects**: Register handles for open-source projects
- **Event Websites**: Temporary handles for events and campaigns

### Investment and Trading
- **Premium Handles**: Acquire and trade valuable handle names
- **Portfolio Building**: Build portfolios of strategic handles
- **Community Investment**: Community-funded acquisitions
- **Long-term Holding**: Register handles for long-term appreciation

## Integration with Network Operations

### **Validator Coordination**

DIG Handles integrate closely with validator operations:

- **Value Assessment**: Validators use handle registrations to assess content value
- **Propagation Decisions**: Prioritize propagation of handled content
- **Reward Distribution**: Direct rewards to storage providers for handled content
- **Fee Collection**: Receive registration fees for network operations

### **DIG Reward Distributor Integration**

DIG Handles work closely with the [DIG Reward Distributor](./rewards-distributor.md) system, which includes several key actions inherited from the XCHandles architecture:

#### **Reward System Actions**
- **Sync Action**: Synchronize handle registrations with reward distribution eligibility
- **New Epoch Action**: Process epoch transitions and update reward calculations
- **Add Incentives Action**: Add new reward incentives for handled content
- **Commit Incentives Action**: Finalize incentive commitments for reward distribution
- **Add Mirror Action**: Add new storage providers to handle-based reward pools
- **Remove Mirror Action**: Remove storage providers from reward eligibility
- **Withdraw Incentives Action**: Process reward withdrawals for storage providers
- **Initiate Payout Action**: Begin reward distribution processes for handled content

This integration ensures that handle registration creates immediate economic incentives for content storage and propagation across the DIG Network.

### Network Effects

As more handles are registered:

- **Increased Network Value**: More valuable content on the network
- **Validator Compensation**: More registration fees for validators
- **Storage Incentives**: More rewards for storage providers
- **User Experience**: Better content discovery through human-readable names

## Best Practices

### For Handle Owners
- **Strategic Registration**: Register handles for valuable, long-term content
- **Renewal Planning**: Plan for long-term renewal costs
- **Community Engagement**: Build community support for important handles
- **Value Optimization**: Ensure linked DataStores provide genuine value

### For Content Creators
- **Handle Strategy**: Develop clear handle naming strategies
- **Value Signaling**: Use handle registration to signal content importance
- **Community Building**: Build community around handled content
- **Long-term Planning**: Plan for sustainable handle renewal

### For Validators
- **Fair Assessment**: Assess handle value fairly and consistently
- **Transparent Operations**: Maintain transparency in handle-based decisions
- **Community Engagement**: Engage with community on handle policies
- **Technical Excellence**: Maintain reliable handle verification systems

DIG Handles provide a crucial market mechanism for value discovery and content prioritization in the DIG Network, enabling efficient allocation of network resources while maintaining decentralized governance and censorship resistance. 