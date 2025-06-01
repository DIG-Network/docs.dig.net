---
sidebar_position: 2
---

:::tip 💜 Support the DIG Network
**Help build the future of decentralized storage!** The DIG Network is an open-source project that needs community support to continue development. 

**[💜 Support the Project →](../support.md)** - Donate crypto, buy NFTs, or sponsor development
:::

# Network Validation

## Overview

Network validation is the cornerstone of the DIG Network's integrity, ensuring that storage providers genuinely store claimed data and that all cryptographic proofs are mathematically and economically valid. Validators use sophisticated fraud detection algorithms and zero-knowledge proof verification to maintain network security without compromising privacy.

## Validator Authority and Role

Validators serve as the **decentralized guardians** of network integrity with specific authorities and responsibilities:

### **Core Authorities**
- **Difficulty Requirements**: Set minimum computational work thresholds for reward eligibility
- **Fraud Detection**: Identify and exclude fraudulent PlotCoins using cryptographic verification
- **Reward Distribution**: Determine which storage providers qualify for DIG token rewards
- **Network Parameters**: Adjust validation criteria based on network conditions
- **Quality Control**: Maintain network quality through performance-based validation

### **Governance Model**
- **Multisig Coordination**: Validators typically work under shared multisig control
- **Consensus Requirements**: Major decisions require majority validator agreement (67%+)
- **Public Accountability**: Validators are publicly known entities with reputational stakes
- **Economic Incentives**: Receive percentage fees from reward distributions

### **Future DAO Governance Transition**
When Chia's DAO primitives become production-ready, the DIG Network will transition to **community-controlled governance** where:

- **DIG Token Holders Control Multisig**: DAO smart contract will own and control the validator multisig
- **Community Validator Hiring/Firing**: DIG token holders vote on validator hiring and firing using token-weighted governance
- **Automated Performance Management**: Smart contracts monitor validator performance and trigger community reviews
- **Value Accrual**: DAO treasury grows through DIG Handle registration fees, with dividends distributed to token holders

This transition will transform validators from self-governing entities to **DAO-employed service providers**, ensuring community control over network operations while creating direct value flow to DIG token holders. See **[DAO Governance Model](./dao-governance.md)** for complete details on the planned DAO architecture.

## Comprehensive Validation Workflow

### **Primary Validation Algorithm**

```
ALGORITHM: Complete Network Validation Process
PURPOSE: Verify storage claims and distribute rewards while maintaining network integrity

INPUT:
  - chiaBlockHash: Recent Chia blockchain block hash for deterministic selection
  - validationEpoch: Current validation period identifier
  - networkMinDifficulty: Minimum computational work requirement

OUTPUT: Comprehensive validation report and reward distribution

STEPS:
  1. DETERMINISTIC BLOB SELECTION
     // Use blockchain entropy for unpredictable but verifiable selection
     selectionSeed = SHA-256(chiaBlockHash + validationEpoch + "DIG_VALIDATION")
     allRegisteredBlobs = GetAllBlobsFromNetwork()
     selectedBlobIndex = selectionSeed % allRegisteredBlobs.length
     blobId = allRegisteredBlobs[selectedBlobIndex]
  
  2. PLOTCOIN DISCOVERY AND INITIAL FILTERING
     // Find all PlotCoins claiming to store the selected blob
     allPlotCoins = QueryBlockchainForPlotCoins(blobId)
     
     // Filter for recent, non-expired PlotCoins
     validPlotCoins = []
     FOR each plotCoin in allPlotCoins:
         epochAge = validationEpoch - plotCoin.creationEpoch
         IF epochAge <= MAX_PLOTCOIN_AGE AND plotCoin.isActive:
             validPlotCoins.append(plotCoin)
  
  3. COMPREHENSIVE ZERO-KNOWLEDGE VERIFICATION
     validationResults = []
     FOR each plotCoin in validPlotCoins:
         // Perform complete ZK verification (validator learns nothing sensitive)
         result = PerformZKVerification(plotCoin.proofPackage, {
             minimumConfidence: 0.95,
             minDifficulty: networkMinDifficulty,
             maxAge: 24 * 60 * 60 * 1000,  // 24 hours
             plotCoinCreationBlock: plotCoin.blockHeight,
             enableSNARKInputValidation: true,
             blobId: blobId
         })
         
         // Enhanced validation with blockchain context
         result.blockchainValidation = ValidateBlockchainContext(
             plotCoin,
             plotCoin.proofPackage,
             validationEpoch
         )
         
         validationResults.append({
             plotCoinId: plotCoin.id,
             owner: plotCoin.owner,
             networkLocation: plotCoin.networkLocation,
             verificationResult: result,
             blockHeight: plotCoin.blockHeight,
             validatedAt: Date.now()
         })
  
  4. CROSS-PLOTCOIN FRAUD DETECTION
     // Detect fraudulent or duplicate registrations across all PlotCoins
     fraudDetectionResult = RunCrossPlotCoinFraudDetection(validationResults)
     
     // Remove fraudulent entries
     legitimateResults = FilterLegitimateResults(
         validationResults,
         fraudDetectionResult
     )
  
  5. NETWORK LIVENESS VERIFICATION
     // Verify claimed data is actually accessible
     FOR each result in legitimateResults:
         livenessCheck = PerformNetworkLivenessCheck(
             result.networkLocation,
             blobId,
             timeoutSeconds: 30
         )
         result.isLive = livenessCheck.success
         result.responseTime = livenessCheck.responseTimeMs
  
  6. UPDATE REWARD DISTRIBUTION
     // Update DIG Reward Distributor based on validation results
     FOR each result in legitimateResults:
         IF result.verificationResult.isValid AND 
            result.verificationResult.confidence >= 0.95 AND
            result.isLive:
             AddToRewardDistributor(result.owner, blobId, result.verificationResult.confidence)
         ELSE:
             RemoveFromRewardDistributor(result.owner, blobId)
  
  7. GENERATE COMPREHENSIVE VALIDATION REPORT
     RETURN ValidationReport{
         blobId: blobId,
         validationEpoch: validationEpoch,
         totalPlotCoinsFound: allPlotCoins.length,
         validPlotCoinsProcessed: validPlotCoins.length,
         legitimateResults: legitimateResults.length,
         fraudulentResults: validationResults.length - legitimateResults.length,
         
         // Aggregate statistics
         averageConfidence: CalculateAverageConfidence(legitimateResults),
         highConfidenceCount: CountHighConfidence(legitimateResults),
         averageResponseTime: CalculateAverageResponseTime(legitimateResults),
         
         // Detailed results
         results: legitimateResults,
         fraudDetection: fraudDetectionResult,
         
         // Performance metrics
         totalVerificationTime: CalculateTotalTime(),
         avgVerificationTimePerPlotCoin: CalculateAvgTime(),
         
         validatedAt: Date.now()
     }
```

## Advanced Fraud Detection

### **SNARK Input Forgery Detection**

Validators must verify not just SNARK mathematical validity, but also that input data is legitimate:

```
ALGORITHM: Detect Forged SNARK Input Data
PURPOSE: Identify SNARKs built with fake or inconsistent input data

STEPS:
  1. VERIFY SNARK WAS BUILT WITH LEGITIMATE PLOTID
     expectedPlotIdComponents = {
         publicKey: ExtractFromZKOwnershipProof(plotCoin.proofPackage.zkOwnershipProof),
         merkleRoot: ExtractFromZKDataInclusionProof(plotCoin.proofPackage.zkDataInclusionProof),
         difficulty: ExtractFromZKComputationalWorkProof(plotCoin.proofPackage.zkComputationalWorkProof),
         blockHeight: ExtractFromZKPhysicalAccessProof(plotCoin.proofPackage.zkPhysicalAccessProof),
         blockHash: ExtractFromZKPhysicalAccessProof(plotCoin.proofPackage.zkPhysicalAccessProof)
     }
     
     expectedPlotId = SHA256(
         expectedPlotIdComponents.publicKey ||
         expectedPlotIdComponents.merkleRoot ||
         expectedPlotIdComponents.difficulty ||
         expectedPlotIdComponents.blockHeight ||
         expectedPlotIdComponents.blockHash
     )
     
     extractedPlotId = ExtractPlotIdFromZKProof(plotCoin.proofPackage.zkPlotCreationProof)
     
     IF extractedPlotId != expectedPlotId:
         REJECT_PLOTCOIN("SNARK_BUILT_WITH_FORGED_PLOTID")
  
  2. VERIFY SNARK WAS BUILT WITH REAL BLOCKCHAIN DATA
     blockHeight = ExtractBlockHeightFromZKProof(plotCoin.proofPackage.zkPhysicalAccessProof)
     blockHash = ExtractBlockHashFromZKProof(plotCoin.proofPackage.zkPhysicalAccessProof)
     
     realBlockHash = GetChiaBlockHashAtHeight(blockHeight)
     
     IF blockHash != realBlockHash:
         REJECT_PLOTCOIN("SNARK_BUILT_WITH_FAKE_BLOCKCHAIN_DATA")
         
     IF ABS(blockHeight - plotCoin.creationBlock) > MAX_BLOCK_DISTANCE:
         REJECT_PLOTCOIN("SNARK_BUILT_WITH_STALE_BLOCKCHAIN_DATA")
  
  3. VERIFY SNARK WAS BUILT WITH CONSISTENT MERKLE ROOT
     plotCreationMerkleRoot = ExtractMerkleRootFromZKProof(plotCoin.proofPackage.zkPlotCreationProof)
     dataInclusionMerkleRoot = ExtractMerkleRootFromZKProof(plotCoin.proofPackage.zkDataInclusionProof)
     
     IF plotCreationMerkleRoot != dataInclusionMerkleRoot:
         REJECT_PLOTCOIN("SNARK_BUILT_WITH_INCONSISTENT_MERKLE_ROOT")
  
  4. VERIFY COMPUTATIONAL WORK BINDING
     workPlotId = ExtractPlotIdFromZKProof(plotCoin.proofPackage.zkComputationalWorkProof)
     workBlobId = ExtractBlobIdFromZKProof(plotCoin.proofPackage.zkComputationalWorkProof)
     
     IF workPlotId != extractedPlotId OR workBlobId != plotCoin.blobId:
         REJECT_PLOTCOIN("SNARK_BUILT_WITH_MISMATCHED_WORK_BINDING")
  
  5. VERIFY BLOB DATA AUTHENTICITY
     expectedBlobHash = SHA256(GetBlobDataFromNetwork(plotCoin.blobId, plotCoin.networkLocation))
     provenBlobHash = ExtractBlobHashFromZKProof(plotCoin.proofPackage.zkDataInclusionProof)
     
     IF expectedBlobHash != provenBlobHash:
         REJECT_PLOTCOIN("SNARK_BUILT_WITH_FAKE_BLOB_DATA")
  
  6. VERIFY NULLIFIER UNIQUENESS
     allNullifiers = ExtractAllNullifiersFromProofPackage(plotCoin.proofPackage)
     
     FOR each nullifier in allNullifiers:
         IF nullifier exists in GlobalNullifierDatabase:
             REJECT_PLOTCOIN("SNARK_REUSING_OLD_NULLIFIER")
         GlobalNullifierDatabase.add(nullifier)
  
  7. VERIFY TEMPORAL CONSISTENCY
     timestamps = ExtractAllTimestampsFromProofPackage(plotCoin.proofPackage)
     maxTimeDifference = MAX(timestamps) - MIN(timestamps)
     
     IF maxTimeDifference > MAX_ACCEPTABLE_TIME_SKEW:
         REJECT_PLOTCOIN("SNARK_BUILT_WITH_INCONSISTENT_TIMESTAMPS")
```

### **Duplicate Registration Detection**

```
ALGORITHM: Detect Duplicate PlotCoin Registrations
PURPOSE: Prevent same plot from being registered multiple times for rewards

STEPS:
  1. EXTRACT AUTHENTICATED IDENTIFIERS
     FOR each validPlotCoin in legitimateResults:
         plotId = ExtractPlotIdFromZKProof(plotCoin.proofPackage.zkPlotCreationProof)
         ownerKey = ExtractPublicKeyFromZKProof(plotCoin.proofPackage.zkOwnershipProof)
         uniqueKey = Hash(plotId + ownerKey)
         
         IF uniqueKey already exists in duplicateMap:
             // FRAUD DETECTED: Same plot + owner registered multiple times
             MarkAsFraudulent(plotCoin, "DUPLICATE_REGISTRATION")
             
             // Also disqualify the original to prevent gaming
             originalPlotCoin = duplicateMap[uniqueKey]
             MarkAsFraudulent(originalPlotCoin, "DUPLICATE_REGISTRATION")
         ELSE:
             duplicateMap[uniqueKey] = plotCoin
  
  2. APPLY ECONOMIC PENALTIES
     FOR each fraudulentPlotCoin:
         SlashStakedTokens(fraudulentPlotCoin.owner, FRAUD_PENALTY_AMOUNT)
         DisqualifyFromRewards(fraudulentPlotCoin.owner, currentEpoch)
```

## Blockchain-Enhanced Verification

### **Temporal Validation**
- **PlotCoin Timing**: Verify creation timestamps are recent and within current epoch
- **Physical Access Alignment**: Ensure physical access proofs align with PlotCoin creation time
- **Epoch Expiry**: Confirm epoch expiry is future-dated

### **Economic Validation**
- **Staking Requirements**: Verify minimum DIG token stakes are met and active
- **Economic Penalties**: Apply penalties for invalid proofs
- **Stake Integrity**: Ensure stakes haven't been previously slashed

### **Network Location Validation**
- **Signature Verification**: Validate network location signatures for specific PlotCoins
- **IP Ownership**: Verify IP address ownership claims
- **DNS Consistency**: Check hostname and IP address consistency

## Attack Resistance Mechanisms

### **Common Attack Vectors and Defenses**

**1. Storage Credit Theft**
- **Attack**: Claim rewards for data stored by others
- **Defense**: Computational work binding makes this mathematically impossible
- **Detection**: Cross-verify work proofs with plot ownership proofs

**2. Precomputation Attacks**
- **Attack**: Delete plots but continue serving cached proofs
- **Defense**: Physical access proofs with blockchain-based freshness requirements
- **Detection**: Temporal consistency validation across proof types

**3. Network Location Spoofing**
- **Attack**: Claim to serve from IP addresses without proper control
- **Defense**: Network location signatures bound to specific PlotCoins
- **Detection**: Reverse DNS lookups and consistency checks

**4. SNARK Replay Attacks**
- **Attack**: Reuse old zero-knowledge proofs
- **Defense**: Unique nullifiers prevent proof reuse
- **Detection**: Global nullifier database tracking

**5. Plot Grinding Attacks**
- **Attack**: Generate many plots to game selection algorithms
- **Defense**: Economic staking requirements and validator-controlled difficulty
- **Detection**: Economic monitoring and stake verification

## Validator Economics and Incentives

### **Validator Compensation**
- **Percentage Fees**: Receive percentage of distributed rewards
- **DIG Handle Fees**: Earn from domain registration fees
- **Reputation Benefits**: Build credibility through reliable operation
- **Long-term Incentives**: Participate in network growth value

### **Penalty Mechanisms**
- **Missed Validations**: Reputation penalties for skipped validation rounds
- **False Positives**: Economic penalties for incorrectly rejecting valid PlotCoins
- **Collusion Detection**: Severe penalties for validator coordination attacks
- **Performance Metrics**: Tracking and publication of validator performance data

## Network Liveness Verification

### **Real-Time Accessibility Testing**

```
ALGORITHM: Network Liveness Verification
PURPOSE: Confirm claimed data is actually accessible from claimed network locations

STEPS:
  1. DIRECT NETWORK REQUEST
     response = HTTPRequest(
         url: plotCoin.networkLocation + "/blob/" + blobId,
         timeout: 30000ms,
         verifySSL: true
     )
  
  2. CONTENT VERIFICATION
     IF response.status == 200:
         receivedBlobHash = SHA256(response.data)
         expectedBlobHash = plotCoin.expectedBlobHash
         
         IF receivedBlobHash == expectedBlobHash:
             RETURN LivenessResult{
                 isLive: true,
                 responseTime: response.responseTimeMs,
                 dataIntegrity: true
             }
         ELSE:
             RETURN LivenessResult{
                 isLive: false,
                 error: "DATA_INTEGRITY_FAILURE",
                 dataIntegrity: false
             }
     ELSE:
         RETURN LivenessResult{
             isLive: false,
             error: "NETWORK_UNREACHABLE",
             httpStatus: response.status
         }
```

### **Distributed Verification**
- **Multiple Validators**: Independent liveness checks from different network locations
- **Geographic Distribution**: Verify accessibility from various global locations  
- **Network Diversity**: Test through different ISPs and network paths
- **Consensus Requirements**: Require majority validator agreement on liveness status

## Security Properties

### **Privacy Preservation**
- **Zero-Knowledge Verification**: Validators learn no sensitive plot or owner information
- **Commitment-Based Proofs**: All sensitive data hidden behind cryptographic commitments
- **Content-Agnostic**: Validation process independent of actual data content
- **Identity Protection**: Owner identities protected through zero-knowledge ownership proofs

### **Economic Security**
- **Staking Requirements**: Economic commitment prevents spam and low-quality participation
- **Fraud Penalties**: Severe economic consequences for malicious behavior
- **Validator Accountability**: Reputation and economic stakes ensure honest validation
- **Market-Driven Quality**: Economic incentives naturally improve network quality

### **Cryptographic Security**
- **BN254 Curve**: Industry-standard elliptic curve cryptography
- **Groth16 SNARKs**: Proven zero-knowledge proof system with constant-size proofs
- **SHA-256 Hashing**: Widely-tested cryptographic hash function
- **BLS Signatures**: Aggregate signature scheme compatible with Chia blockchain

The validation system ensures network integrity while preserving privacy and preventing attacks through a sophisticated combination of cryptographic proofs, economic incentives, and decentralized verification processes. 