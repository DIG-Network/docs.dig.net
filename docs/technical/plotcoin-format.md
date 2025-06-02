---
sidebar_position: 2
---

# PlotCoin Format Technical Specifications

:::tip 💜 Support the DIG Network
**Help build the future of decentralized storage!** The DIG Network is an open-source project that needs community support to continue development. 

**[💜 Support the Project →](../support.md)** - Donate crypto, buy NFTs, or sponsor development
:::

## Overview

PlotCoins are **blockchain-registered certificates** that cryptographically prove a DIG Node's ability to store and serve specific blob data. Each PlotCoin contains a comprehensive zero-knowledge proof package that enables validators to verify storage claims without learning any sensitive information about the plot owner, data content, or network operations.

### **Constant Size Through SNARK Technology**

A crucial advantage of the PlotCoin design is its **constant size regardless of plot complexity**. Thanks to the use of zk-SNARKs (Zero-Knowledge Succinct Non-Interactive Arguments of Knowledge), each PlotCoin maintains a **stable size of approximately 5KB**, regardless of:

- **Plot Size**: Whether proving a 1GB plot or a 100TB plot
- **Blob Count**: Whether the plot contains 1,000 or 1,000,000 blobs  
- **Computational Complexity**: Regardless of the computational work difficulty
- **Data Complexity**: Independent of the type or structure of stored data

This **succinct property** is fundamental to network scalability - without it, PlotCoin sizes would grow proportionally with plot size, making blockchain storage prohibitively expensive and verification times unacceptable for large-scale deployments.

## PlotCoin Binary Structure

### **On-Chain PlotCoin Format**

PlotCoins are stored on the Chia blockchain as structured data with standardized binary encoding:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           PlotCoin Binary Layout                                │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Offset │ Size │ Field                    │ Description                          │
├────────┼──────┼──────────────────────────┼──────────────────────────────────────┤
│ 0x0000 │   4  │ version                  │ PlotCoin format version (v1 = 0x01)  │
│ 0x0004 │  32  │ plotCoinId               │ Unique PlotCoin identifier (SHA-256) │
│ 0x0024 │  32  │ blobId                   │ Target blob identifier being proven  │
│ 0x0044 │  48  │ ownerPublicKey           │ BLS public key of plot owner         │
│ 0x0074 │   8  │ creationTimestamp        │ Unix timestamp of PlotCoin creation  │
│ 0x007C │   8  │ expirationTimestamp      │ Unix timestamp when PlotCoin expires │
│ 0x0084 │   8  │ chiaBlockHeight          │ Chia block height at creation        │
│ 0x008C │  32  │ chiaBlockHash            │ Chia block hash at creation          │
│ 0x00AC │   8  │ stakingAmount            │ DIG tokens staked in this PlotCoin   │
│ 0x00B4 │  64  │ networkLocation          │ Network location (hostname/IP + port)│
│ 0x00F4 │  96  │ networkLocationSignature │ BLS signature over network location  │
│ 0x0154 │   4  │ proofPackageSize         │ Size of embedded proof package       │
│ 0x0158 │ Var  │ zkProofPackage           │ Complete zero-knowledge proof package│
│ 0xVar  │  96  │ plotCoinSignature        │ BLS signature over entire PlotCoin   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### **Zero-Knowledge Proof Package Structure**

The embedded proof package contains all five required zero-knowledge proofs:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        ZK Proof Package Binary Layout                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Offset │ Size │ Field                    │ Description                          │
├────────┼──────┼──────────────────────────┼──────────────────────────────────────┤
│ 0x0000 │   4  │ packageVersion           │ Proof package format version        │
│ 0x0004 │   4  │ proofCount               │ Number of proofs (always 5 for v1)  │
│ 0x0008 │  32  │ packageHash              │ SHA-256 hash of entire package      │
│ 0x0028 │   8  │ generationTimestamp      │ When proofs were generated           │
│ 0x0030 │ 256  │ plotCreationProof        │ ZK proof of plot creation/ownership  │
│ 0x0130 │ 256  │ dataInclusionProof       │ ZK proof of blob inclusion in plot   │
│ 0x0230 │ 256  │ ownershipProof           │ ZK proof of ownership authority      │
│ 0x0330 │ 256  │ computationalWorkProof   │ ZK proof of bound computational work │
│ 0x0430 │ 256  │ physicalAccessProof      │ ZK proof of current data access      │
│ 0x0530 │  32  │ commitmentAggregation    │ Aggregated proof commitments        │
│ 0x0550 │  64  │ nullifierSet             │ All proof nullifiers (prevents reuse)│
│ 0x0590 │  32  │ verificationMetadata     │ Metadata for proof verification     │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Individual Zero-Knowledge Proof Format

### **Groth16 SNARK Proof Structure** 

Each zero-knowledge proof uses the Groth16 proving system with BN254 elliptic curve:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          Groth16 Proof Binary Layout                           │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Offset │ Size │ Field                    │ Description                          │
├────────┼──────┼──────────────────────────┼──────────────────────────────────────┤
│ 0x0000 │   4  │ proofType                │ Type identifier (creation, inclusion,│
│        │      │                          │ ownership, work, access)             │
│ 0x0004 │   4  │ circuitVersion           │ Version of ZK circuit used          │
│ 0x0008 │  64  │ proofA                   │ Groth16 proof element A (BN254 G1)   │
│ 0x0048 │ 128  │ proofB                   │ Groth16 proof element B (BN254 G2)   │
│ 0x00C8 │  64  │ proofC                   │ Groth16 proof element C (BN254 G1)   │
│ 0x0108 │  32  │ publicInputHash          │ Hash of public inputs                │
│ 0x0128 │  32  │ commitmentHash           │ Hash of private input commitments   │
│ 0x0148 │  32  │ nullifier                │ Unique nullifier (prevents reuse)   │
│ 0x0168 │   8  │ generationTimestamp      │ When this proof was generated        │
│ 0x0170 │  32  │ auxillaryData            │ Circuit-specific auxiliary data      │
│ 0x0190 │  96  │ generatorSignature       │ BLS signature by proof generator     │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### **Proof Type Identifiers**

```
Proof Type Constants:
0x00000001: Plot Creation Proof
0x00000002: Data Inclusion Proof  
0x00000003: Ownership Verification Proof
0x00000004: Computational Work Proof
0x00000005: Physical Access Proof
```

## PlotCoin Size Analysis

### **Constant 5KB Size Breakdown**

The PlotCoin's stable ~5KB size is achieved through the constant-size properties of zk-SNARKs:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         PlotCoin Size Calculation                              │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Component                           │ Size (bytes) │ Description               │
├─────────────────────────────────────┼──────────────┼───────────────────────────┤
│ PlotCoin Header Fields              │ 344          │ Fixed metadata and IDs    │
│ Network Location                    │ 64           │ Fixed network binding     │
│ Network Location Signature         │ 96           │ BLS signature (constant)  │
│ Proof Package Header                │ 144          │ Package metadata          │
│ Plot Creation Proof (Groth16)      │ 496          │ Constant SNARK size       │
│ Data Inclusion Proof (Groth16)     │ 496          │ Constant SNARK size       │
│ Ownership Verification Proof       │ 496          │ Constant SNARK size       │
│ Computational Work Proof           │ 496          │ Constant SNARK size       │
│ Physical Access Proof              │ 496          │ Constant SNARK size       │
│ Proof Package Footer               │ 128          │ Aggregations & nullifiers │
│ PlotCoin Signature                 │ 96           │ BLS signature (constant)  │
│ Padding/Alignment                  │ ~144         │ 4KB alignment padding     │
├─────────────────────────────────────┼──────────────┼───────────────────────────┤
│ **Total PlotCoin Size**            │ **~5,000**   │ **~5KB constant size**    │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### **Scalability Advantages**

**Constant Size Benefits:**
- **Blockchain Efficiency**: Fixed storage cost per PlotCoin regardless of plot size
- **Network Bandwidth**: Predictable data transfer costs for PlotCoin distribution
- **Validation Performance**: Constant verification time independent of plot complexity
- **Economic Predictability**: Known storage costs enable accurate economic modeling

**Without SNARKs Comparison:**
```
Traditional Proof System (without SNARKs):
- 1GB Plot: ~50MB proof size
- 100GB Plot: ~5GB proof size  
- 1TB Plot: ~50GB proof size
- 100TB Plot: ~5TB proof size

DIG Network with SNARKs:
- Any Plot Size: ~5KB proof size (constant)
- Scalability: 10,000x - 1,000,000x size reduction
- Performance: Constant verification time
```

This constant-size property is what makes the DIG Network economically viable at internet scale, where traditional proof systems would become prohibitively expensive for large storage providers.

## Network Location Format and Binding

### **Network Location Specification**

```
Network Location Binary Format (64 bytes):
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Offset │ Size │ Field                    │ Description                          │
├────────┼──────┼──────────────────────────┼──────────────────────────────────────┤
│ 0x0000 │   1  │ addressType              │ 0x01=IPv4, 0x02=IPv6, 0x03=Hostname │
│ 0x0001 │  45  │ address                  │ IP address or hostname (null-padded) │
│ 0x002E │   2  │ port                     │ TCP port number (big-endian)        │
│ 0x0030 │   8  │ capabilities             │ Service capability flags             │
│ 0x0038 │   8  │ bindingTimestamp         │ When location was bound to PlotCoin  │
│ 0x0040 │  16  │ reserved                 │ Reserved for future extensions       │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### **Network Location Signature**

The network location is cryptographically bound to the specific PlotCoin and blobId:

```
ALGORITHM: Generate Network Location Signature
PURPOSE: Cryptographically bind network location to specific PlotCoin and blob

INPUT:
  - networkLocation: Network location structure (64 bytes)
  - plotCoinId: Unique PlotCoin identifier  
  - blobId: Target blob identifier
  - ownerPrivateKey: Plot owner's BLS private key

OUTPUT: BLS signature binding location to PlotCoin

STEPS:
  1. CONSTRUCT SIGNING MESSAGE
     message = CONCAT(
         networkLocation,     // 64 bytes
         plotCoinId,         // 32 bytes
         blobId,             // 32 bytes
         "DIG_NETWORK_LOCATION_BINDING"  // Domain separator
     )
  
  2. GENERATE BLS SIGNATURE
     signature = BLS_Sign(ownerPrivateKey, message)
  
  3. RETURN SIGNATURE
     RETURN signature  // 96 bytes
```

**Anti-Spoofing Properties:**
- Signature proves owner controls the claimed network location for this specific PlotCoin
- Cannot reuse network location signatures from other PlotCoins or blobs
- Prevents IP address spoofing and DNS manipulation attacks
- Enables validator verification without revealing private keys

## PlotCoin Lifecycle Management

### **Creation Process**

```
ALGORITHM: Create PlotCoin
PURPOSE: Generate complete PlotCoin with all required proofs and signatures

INPUT:
  - plotData: Complete plot file containing target blob
  - blobId: Specific blob identifier to prove
  - networkLocation: Where content will be served
  - stakingAmount: DIG tokens to stake
  - ownerPrivateKey: Plot owner's private key

OUTPUT: Complete PlotCoin ready for blockchain submission

STEPS:
  1. GENERATE ALL ZERO-KNOWLEDGE PROOFS
     zkPlotCreation = GeneratePlotCreationProof(plotData, ownerPrivateKey)
     zkDataInclusion = GenerateDataInclusionProof(plotData, blobId)
     zkOwnership = GenerateOwnershipProof(ownerPrivateKey, blobId)
     zkComputationalWork = GenerateComputationalWorkProof(plotData, blobId)
     zkPhysicalAccess = GeneratePhysicalAccessProof(plotData, currentChiaBlock)
  
  2. PACKAGE ZERO-KNOWLEDGE PROOFS
     proofPackage = PackageZKProofs([
         zkPlotCreation,
         zkDataInclusion, 
         zkOwnership,
         zkComputationalWork,
         zkPhysicalAccess
     ])
  
  3. GENERATE NETWORK LOCATION SIGNATURE
     locationSignature = GenerateNetworkLocationSignature(
         networkLocation,
         plotCoinId,
         blobId,
         ownerPrivateKey
     )
  
  4. CONSTRUCT PLOTCOIN STRUCTURE
     plotCoin = PlotCoin{
         version: 0x01,
         plotCoinId: GenerateUniquePlotCoinId(),
         blobId: blobId,
         ownerPublicKey: DerivePublicKey(ownerPrivateKey),
         creationTimestamp: GetCurrentTimestamp(),
         expirationTimestamp: GetCurrentTimestamp() + PLOTCOIN_VALIDITY_PERIOD,
         chiaBlockHeight: GetLatestChiaBlockHeight(),
         chiaBlockHash: GetLatestChiaBlockHash(),
         stakingAmount: stakingAmount,
         networkLocation: networkLocation,
         networkLocationSignature: locationSignature,
         zkProofPackage: proofPackage
     }
  
  5. SIGN COMPLETE PLOTCOIN
     plotCoinSignature = BLS_Sign(ownerPrivateKey, SerializePlotCoin(plotCoin))
     plotCoin.plotCoinSignature = plotCoinSignature
  
  6. RETURN COMPLETE PLOTCOIN
     RETURN plotCoin
```

### **Expiration and Renewal**

PlotCoins have built-in expiration to ensure ongoing data availability:

**Expiration Properties:**
- **Fixed Validity Period**: PlotCoins expire after ~7 days (configurable by validators)
- **Block Height Anchoring**: Expiration tied to Chia blockchain progress
- **Fresh Proof Requirements**: Renewal requires generating fresh zero-knowledge proofs
- **Automatic Cleanup**: Expired PlotCoins automatically become ineligible for rewards

**Renewal Process:**
```
ALGORITHM: Renew PlotCoin
PURPOSE: Extend PlotCoin validity with fresh proofs

REQUIREMENTS:
- Must renew before expiration
- Must regenerate Physical Access Proof with current blockchain data
- Must maintain same stakingAmount or increase
- Must verify continued data availability

STEPS:
  1. VERIFY RENEWAL ELIGIBILITY
     IF plotCoin.expirationTimestamp <= (currentTimestamp + RENEWAL_BUFFER):
         PROCEED with renewal
     ELSE:
         RETURN ERROR("PlotCoin not yet eligible for renewal")
  
  2. REGENERATE FRESH PROOFS
     // Physical Access Proof must use current blockchain data
     newPhysicalAccessProof = GeneratePhysicalAccessProof(
         plotData, 
         GetLatestChiaBlock()
     )
     
     // Other proofs can be reused if plot data unchanged
     // Or regenerated if improvements needed
  
  3. CREATE NEW PLOTCOIN
     renewedPlotCoin = CreatePlotCoin(
         plotData,
         blobId,
         networkLocation,
         stakingAmount,
         ownerPrivateKey
     )
  
  4. SUBMIT RENEWAL TO BLOCKCHAIN
     SubmitPlotCoinRenewal(originalPlotCoinId, renewedPlotCoin)
```

## Blockchain Integration

### **Chia Blockchain Storage**

PlotCoins are stored in Chia's DataLayer as structured records:

**DataLayer Integration:**
- **Indexed Storage**: PlotCoins indexed by blobId for efficient validator queries
- **Version Control**: Support for PlotCoin updates and renewals
- **Atomic Operations**: PlotCoin creation and staking happen atomically
- **Query Optimization**: Efficient queries for validator blob selection

### **Smart Contract Integration**

PlotCoins integrate with Chia smart contracts for staking and rewards:

```
Chia Smart Contract Integration:

PlotCoin Creation Transaction:
1. Stake DIG tokens in escrow smart contract
2. Create PlotCoin record in DataLayer
3. Register PlotCoin for validator discovery
4. Emit PlotCoinCreated event

PlotCoin Expiration Transaction:
1. Mark PlotCoin as expired in DataLayer
2. Release staked tokens back to owner (if no fraud detected)
3. Remove from validator discovery indexes
4. Emit PlotCoinExpired event

Fraud Detection Transaction:
1. Validator submits fraud proof
2. Smart contract validates fraud evidence
3. Slash staked tokens (transfer to validator reward pool)
4. Permanently ban fraudulent PlotCoin
5. Emit FraudDetected event
```

## Validation and Verification

### **Validator Verification Process**

Validators perform comprehensive verification of PlotCoins:

```
ALGORITHM: Validate PlotCoin
PURPOSE: Verify all aspects of a PlotCoin for reward eligibility

INPUT:
  - plotCoin: Complete PlotCoin structure
  - blobId: Blob being validated
  - validationContext: Current validation context

OUTPUT: Validation result with detailed findings

STEPS:
  1. VERIFY PLOTCOIN STRUCTURE
     IF NOT VerifyPlotCoinStructure(plotCoin):
         RETURN INVALID("Invalid PlotCoin binary structure")
  
  2. VERIFY SIGNATURES
     IF NOT VerifyPlotCoinSignature(plotCoin):
         RETURN INVALID("PlotCoin signature verification failed")
     
     IF NOT VerifyNetworkLocationSignature(plotCoin):
         RETURN INVALID("Network location signature verification failed")
  
  3. VERIFY EXPIRATION
     IF plotCoin.expirationTimestamp <= GetCurrentTimestamp():
         RETURN INVALID("PlotCoin has expired")
  
  4. VERIFY STAKING
     stakedAmount = GetStakedTokens(plotCoin.plotCoinId)
     IF stakedAmount < MINIMUM_STAKING_REQUIREMENT:
         RETURN INVALID("Insufficient staking amount")
  
  5. VERIFY ZERO-KNOWLEDGE PROOFS
     zkVerificationResult = VerifyZKProofPackage(
         plotCoin.zkProofPackage,
         blobId,
         validationContext
     )
     
     IF NOT zkVerificationResult.isValid:
         RETURN INVALID("Zero-knowledge proof verification failed")
  
  6. VERIFY NETWORK ACCESSIBILITY
     livenessResult = TestNetworkLiveness(
         plotCoin.networkLocation,
         blobId,
         LIVENESS_TIMEOUT
     )
     
     IF NOT livenessResult.isAccessible:
         RETURN INVALID("Content not accessible at claimed network location")
  
  7. RETURN VALIDATION RESULT
     RETURN VALID{
         confidence: zkVerificationResult.confidence,
         responseTime: livenessResult.responseTime,
         verificationTimestamp: GetCurrentTimestamp()
     }
```

### **Fraud Detection Integration**

PlotCoin format enables comprehensive fraud detection:

**Detectable Fraud Types:**
- **Forged Proof Data**: SNARK input verification detects proofs built with fake data
- **Duplicate Registration**: Same plot registered multiple times for same blob
- **Network Location Spoofing**: Invalid network location signatures
- **Stale Data**: Physical access proofs using outdated blockchain data
- **Signature Forgery**: Invalid BLS signatures over PlotCoin data

**Fraud Penalties:**
- **Immediate Disqualification**: Fraudulent PlotCoins immediately removed from rewards
- **Staking Penalties**: Staked DIG tokens slashed and transferred to validator rewards
- **Epoch Bans**: Fraudulent owners banned from creating new PlotCoins for entire epochs
- **Reputation Impact**: Permanent record of fraudulent behavior affects future participation

The PlotCoin format provides a comprehensive, cryptographically secure method for storage providers to prove their ability to store and serve specific blob data while maintaining privacy and preventing fraud through sophisticated zero-knowledge proof systems and economic incentives. 