---
sidebar_position: 1
---

# PlotCoin - Decentralized Proof Registry

:::tip 💜 Support the DIG Network
**Help build the future of decentralized storage!** The DIG Network is an open-source project that needs community support to continue development. 

**[💜 Support the Project →](../../support.md)** - Donate crypto, buy NFTs, or sponsor development
:::

## Overview

PlotCoin serves as the cornerstone of the DIG Network's on-chain coordination system. When a plot owner stores a blob, they must create a **PlotCoin** on the Chia blockchain to prove it. A PlotCoin is a unique coin discoverable via the SHA-256 hash of the blob, serving as an on-chain proof that the blob is stored and available. This mechanism forms a decentralized registry of verifiable blobs across the network.

## Core Functionality

### Decentralized Registry

PlotCoins function as registry entries that map blobIds to their storage providers, containing both [zero-knowledge proof packages](../../zk-proofs/overview.md) and network location information. This creates a trustless, queryable registry where validators can discover who is storing specific blobs and verify their proofs without direct communication.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         PlotCoin Proof Registry Architecture                     │
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
│  CHIA BLOCKCHAIN: Decentralized PlotCoin Registry                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        PlotCoin Registry                                │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │   │
│  │  │ blobId: "document_123"                                          │   │   │
│  │  │ ┌─────────────────────┐ ┌─────────────────────┐ ┌────────────┐  │   │   │
│  │  │ │ PlotCoin A          │ │ PlotCoin B          │ │ PlotCoin C │  │   │   │
│  │  │ │ owner: 0x1a2b...    │ │ owner: 0x7g8h...    │ │ owner: ... │  │   │   │
│  │  │ │ proofs: [ZK-PKG]    │ │ proofs: [ZK-PKG]    │ │ proofs: ..│  │   │   │
│  │  │ │ location: server1   │ │ location: server2   │ │ location:.│  │   │   │
│  │  │ │ stake: 1000 DIG     │ │ stake: 1500 DIG     │ │ stake: ...│  │   │   │
│  │  │ └─────────────────────┘ └─────────────────────┘ └────────────┘  │   │   │
│  │  └─────────────────────────────────────────────────────────────────┘   │   │
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

### Staking Mechanism

To mint a PlotCoin, plot owners must **stake [DIG Tokens](../../economics/token-model.md)**, introducing a cost that discourages spam attacks—such as flooding the network with fake PlotCoins. This economic commitment ensures that only genuine storage providers participate in the reward system.

## PlotCoin Structure

Each PlotCoin contains comprehensive information needed for verification and network coordination:

```
PlotCoin Structure:
{
  owner: PublicKey,                    // Plot owner's public key
  blobId: SHA256Hash,                  // Unique blob identifier
  networkLocation: {
    host: String,                      // DNS hostname where plot is served
    ipv4: IPAddress,                   // IPv4 address of the server
    ipv6: IPAddress,                   // IPv6 address of the server
    port: Number                       // Port number for data access
  },
  locationSignature: DigitalSignature, // Owner's signature over (networkLocation + plotId + blobId)
  proofPackage: ZKProofPackage,        // Complete zero-knowledge proof set
  stakeAmount: DIG_Tokens,             // Economic commitment
  epochExpiry: BlockHeight             // Proof validity period
}
```

### Critical Uniqueness Constraint

The combination of `(plotId, ownerKey, networkLocation)` must be unique across ALL PlotCoins. This prevents the same plot owner from registering the same plot data from multiple network locations, ensuring network integrity.

## Epoch-Based Lifecycle

**PlotCoins expire at the end of each epoch** (approximately every 7 days). Plot owners must re-create PlotCoins each epoch to maintain eligibility. This serves multiple purposes:

- **Liveness Check**: Ensures storage providers are actively maintaining their data
- **Cleanup Mechanism**: Prevents outdated or inactive proofs from accumulating on-chain
- **Fresh Physical Access**: Requires proof of current physical access to stored data
- **Economic Filter**: Recurring costs filter out inactive or uncommitted participants

### Staking Economics

The number of blobs a plot owner can earn rewards for is directly tied to the amount of DIG Tokens they have available to stake. This creates a natural scaling mechanism where:

- **Larger operators** can stake more tokens and serve more blobs
- **Economic efficiency** encourages consolidation of high-value content
- **Barrier to entry** is proportional to the scale of operations
- **Token utility** drives demand for DIG tokens

Staked DIG Tokens can be refunded by "melting" the PlotCoin and exiting the stake, typically managed automatically by DIG Node software.

## Network Location Binding

PlotCoins include cryptographically signed network location information that prevents various network-based attacks:

### Signature Binding
- Network location + PlotId + blobId must be digitally signed by plot owner's private key
- Signature verification proves the owner controls the claimed network addresses
- Cannot claim to serve from locations without possessing the corresponding private key
- Cannot reuse network location signatures from other plots or blobs

### Anti-Spoofing Mechanisms
- **IP Address Verification**: Prevents claiming uncontrolled IP addresses
- **DNS Consistency**: Hostname and IP addresses must be consistent and verifiable
- **Multi-Host Prevention**: Same plot cannot be registered from multiple network locations
- **Economic Penalties**: Fraudulent registrations result in slashed stakes

## 100% Cryptographic Certainty

The PlotCoin system provides validators with mathematical certainty about storage providers through comprehensive verification:

### Validator Guarantees

When validators examine any PlotCoin on the blockchain, they know with 100% certainty that:

1. ✅ **Unique Physical Copy**: The plot owner has a genuine, unique physical copy of the data
2. ✅ **Machine Control**: The data is on a machine the owner directly controls  
3. ✅ **Network Authority**: The owner controls the network location where this specific plot's data is served
4. ✅ **No Duplicates**: This is not a duplicate registration of the same plot data
5. ✅ **No Spoofing**: Cannot fake network locations or reuse signatures from other plots
6. ✅ **Current Access**: The owner had physical access to the data when creating the PlotCoin
7. ✅ **Computational Authenticity**: All computational work is legitimate and bound to this specific plot/blob combination
8. ✅ **SNARK Input Authenticity**: All zero-knowledge proofs were built using legitimate, verified input data

### Fraud Detection

Validators can detect and reject fraudulent PlotCoins with mathematical certainty:

```
VALIDATOR FRAUD DETECTION ALGORITHM:

STEP 1: EXTRACT ALL PLOTCOINS FOR A BLOB
allPlotCoins = GetPlotCoinsFromBlockchain(blobId)

STEP 2: RUN COMPREHENSIVE SNARK INPUT FORGERY DETECTION
FOR each plotCoin in allPlotCoins:
    snarkResult = RunSNARKInputForgeryDetection(plotCoin)
    IF snarkResult.isForged:
        MarkAsFraudulent(plotCoin, snarkResult.errorType)

STEP 3: CHECK FOR DUPLICATE REGISTRATIONS
FOR each validPlotCoin:
    plotId = ExtractPlotIdFromZKProof(plotCoin.proofPackage)
    ownerKey = ExtractPublicKeyFromZKProof(plotCoin.proofPackage)
    uniqueKey = Hash(plotId + ownerKey)
    
    IF uniqueKey already exists:
        MarkAsFraudulent(plotCoin, "DUPLICATE_REGISTRATION")

STEP 4: RETURN LEGITIMATE PLOTCOINS
```

## Integration with Reward System

PlotCoins serve as the primary interface between storage providers and the [reward distribution system](./rewards-distributor.md):

### Reward Eligibility
- Active PlotCoin required for reward eligibility
- Staking amount may influence reward calculations
- Network location enables validator verification
- Proof package provides cryptographic verification

### Validator Workflow
1. **Random Selection**: Validators randomly select blobs for verification
2. **PlotCoin Discovery**: Query blockchain for PlotCoins associated with selected blob
3. **Proof Verification**: Verify embedded zero-knowledge proofs
4. **Liveness Check**: Confirm data is still accessible at claimed network location
5. **Reward Assignment**: Add qualifying plot owners to reward distributor

## Security Properties

The PlotCoin system provides multiple layers of security:

### Cryptographic Security
- **Zero-knowledge proofs** prevent revelation of sensitive data
- **Digital signatures** ensure authenticity and prevent impersonation
- **Hash-based binding** prevents modification of registered data
- **Temporal anchoring** prevents replay of old registrations

### Economic Security
- **Staking requirements** create economic commitment and spam resistance
- **Slashing mechanisms** penalize fraudulent behavior
- **Epoch expiration** requires ongoing economic commitment
- **Reward alignment** incentivizes honest behavior

### Network Security
- **Decentralized registry** prevents single points of failure
- **Validator verification** ensures ongoing service quality
- **Location binding** prevents network spoofing attacks
- **Duplicate detection** prevents gaming through multiple registrations

## Technical Implementation

PlotCoins are implemented as Chia blockchain coins that contain:

- **Ownership information** through public key binding
- **Proof packages** as serialized zero-knowledge proofs
- **Network metadata** for validator verification
- **Economic stakes** through locked DIG tokens
- **Temporal constraints** through epoch-based expiration

For detailed technical specifications, see the [Technical Specifications](../../technical/plotcoin-format.md) section.

## Operational Considerations

### For Plot Owners
- **Token Management**: Maintain sufficient DIG tokens for staking
- **Network Infrastructure**: Ensure reliable network connectivity and addressing
- **Proof Generation**: Generate fresh zero-knowledge proofs each epoch
- **Operational Costs**: Budget for recurring staking and blockchain fees

### For Validators
- **Registry Monitoring**: Monitor PlotCoin registry for new registrations
- **Proof Verification**: Verify zero-knowledge proofs efficiently
- **Network Testing**: Perform liveness checks on claimed network locations
- **Fraud Detection**: Implement comprehensive fraud detection algorithms

The PlotCoin system represents a significant advancement in decentralized storage verification, providing mathematical certainty about storage commitments while maintaining privacy and preventing various attack vectors through economic and cryptographic mechanisms. 