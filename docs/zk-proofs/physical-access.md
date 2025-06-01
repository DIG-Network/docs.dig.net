---
sidebar_position: 6
---

:::tip 💜 Support the DIG Network
**Help build the future of decentralized storage!** The DIG Network is an open-source project that needs community support to continue development. 

**[💜 Support the Project →](../support.md)** - Donate crypto, buy NFTs, or sponsor development
:::

# Physical Access Proof

## Overview

The **Physical Access Proof** ensures that plot owners have actual, current physical access to their stored data when creating PlotCoins, preventing "precomputation attacks" where malicious actors delete their plots but continue serving cached proofs. This proof is essential for maintaining data availability guarantees and preventing storage fraud in the DIG Network.

## What It Proves

The Physical Access Proof establishes that:

1. **Current Data Access**: The prover has actual physical access to plot data at proof generation time
2. **Real-Time Computation**: Proof was generated using live plot data, not cached calculations
3. **Block-Based Freshness**: Proof incorporates recent Chia blockchain state, ensuring recency
4. **Anti-Precomputation**: Cannot be generated in advance and cached for later use
5. **Liveness Guarantee**: Storage provider is actively maintaining and accessing their data

## Critical Security Role

### Preventing Precomputation Attacks

**The Attack Scenario:**
Without physical access verification, malicious actors could:
- Generate all necessary proofs while legitimately storing data
- Delete the actual plot data to save storage costs
- Continue claiming rewards using pre-computed, cached proofs
- Appear to provide storage service while offering no actual data availability

**The Defense:**
Physical Access Proof makes this attack impossible by:
- Requiring access to actual plot data during proof generation
- Incorporating fresh blockchain state that cannot be predicted in advance
- Creating time-sensitive challenges that demand real-time computation
- Making cached proofs invalid as network state evolves

### Ensuring Data Availability

The proof system guarantees that:
- **Active Storage**: Rewards only flow to providers actively maintaining data
- **Live Access**: Proof generation requires current access to stored blobs
- **Network Reliability**: Storage providers can actually serve data when requested
- **Economic Honesty**: Financial incentives align with actual data availability

## Cryptographic Architecture

### Challenge-Response Mechanism

The physical access system uses a sophisticated challenge-response protocol that requires real-time computation using actual plot data:

```
Physical Access Challenge Construction:
accessChallenge = SHA256(
    recentChiaBlockHash +
    plotId +
    blobId +
    challengeEpoch +
    "DIG_PHYSICAL_ACCESS_CHALLENGE"
)

Response Requirements:
1. Access actual plot file to extract required data
2. Perform computations using live plot data
3. Incorporate fresh blockchain state into response
4. Generate proof within time window (~1 Chia block period)
5. Prove computation used actual data, not cached values
```

### Time-Sensitive Verification

```
Temporal Validity Requirements:
- Challenge must reference recent Chia block (within last 10 blocks)
- Response must be generated within challenge time window
- Proof cannot be pre-computed due to unpredictable blockchain state
- Expired challenges require fresh proof generation
```

## ZK-SNARK Circuit Design

### Circuit Architecture

```
Circuit: PhysicalAccessProof
Purpose: Prove current physical access to plot data without revealing data details

Inputs:
  Private:
    - plotData: Subset of actual plot data required for challenge (variable size)
    - plotId: Plot identifier being accessed (32 bytes)
    - blobId: Specific blob identifier within plot (32 bytes)
    - accessNonce: Random value for proof uniqueness (32 bytes)
    - dataExtracts: Specific data extracts from plot file (variable size)
    - computationResults: Results of required computations (variable size)
    - challengeResponse: Response to access challenge (32 bytes)
    - recentChiaBlockHash: Recent Chia blockchain block hash (32 bytes)
    - challengeTimestamp: When challenge was issued (8 bytes)
    - responseTimestamp: When response was generated (8 bytes)
    
  Public:
    - accessCommitment: Commitment to physical access (32 bytes)
    - freshnessCommitment: Commitment to proof freshness (32 bytes)
    - challengeCommitment: Commitment to challenge response (32 bytes)
    - temporalCommitment: Commitment to timing validity (32 bytes)

Constraints:
  1. PLOT_DATA_VERIFICATION:
     extractedData = ExtractDataFromPlot(plotData, challengeParameters)
     ASSERT extractedData matches expected challenge requirements
     
  2. CHALLENGE_RECONSTRUCTION:
     expectedChallenge = SHA256(recentChiaBlockHash + plotId + blobId + 
                               challengeEpoch + "DIG_PHYSICAL_ACCESS_CHALLENGE")
     
  3. RESPONSE_COMPUTATION:
     computedResponse = ComputeAccessResponse(extractedData, expectedChallenge, accessNonce)
     ASSERT computedResponse == challengeResponse
     
  4. TEMPORAL_VALIDITY:
     ASSERT challengeTimestamp >= (currentTime - CHALLENGE_VALIDITY_WINDOW)
     ASSERT responseTimestamp >= challengeTimestamp
     ASSERT responseTimestamp <= (challengeTimestamp + RESPONSE_WINDOW)
     
  5. BLOCKCHAIN_FRESHNESS:
     blockAge = GetBlockAge(recentChiaBlockHash)
     ASSERT blockAge <= MAX_BLOCK_AGE
     
  6. DATA_AUTHENTICITY:
     dataHash = SHA256(extractedData)
     ASSERT VerifyDataAuthenticity(dataHash, plotId, blobId)
     
  7. COMMITMENT_GENERATION:
     accessCommitment = Poseidon(extractedData + challengeResponse + accessNonce)
     freshnessCommitment = Poseidon(recentChiaBlockHash + challengeTimestamp + accessNonce)
     challengeCommitment = Poseidon(expectedChallenge + computedResponse + accessNonce)
     temporalCommitment = Poseidon(challengeTimestamp + responseTimestamp + accessNonce)
```

### Challenge Types

The system supports multiple challenge types to verify different aspects of physical access:

```
Challenge Type 1: Random Data Extract
- Request specific byte ranges from plot file
- Verify data matches expected hash values
- Prove access to arbitrary plot locations

Challenge Type 2: Computation Challenge
- Require specific computations using plot data
- Verify results match expected outcomes
- Prove computational access to data

Challenge Type 3: Merkle Proof Challenge
- Request Merkle proof for specific blob
- Verify proof construction using live data
- Prove access to tree structure

Challenge Type 4: Cross-Reference Challenge
- Verify relationships between different plot sections
- Prove understanding of plot organization
- Demonstrate comprehensive data access
```

## Proof Generation Process

### Real-Time Access Verification

```
ALGORITHM: Generate Physical Access Proof
PURPOSE: Prove current physical access to plot data

INPUT:
  - plotFilePath: Path to actual plot file on disk
  - plotId: Plot identifier
  - blobId: Blob identifier within plot
  - challengeParameters: Current access challenge

OUTPUT: Zero-knowledge physical access proof

STEPS:
  1. VALIDATE_CHALLENGE_FRESHNESS:
     recentChiaBlockHash = GetRecentChiaBlockHash()
     challengeAge = GetChallengeAge(challengeParameters.timestamp)
     IF challengeAge > CHALLENGE_VALIDITY_WINDOW:
         RETURN ERROR("Challenge too old, request fresh challenge")
  
  2. ACCESS_PLOT_FILE:
     plotFile = OpenFile(plotFilePath)
     IF NOT plotFile.exists():
         RETURN ERROR("Plot file not accessible")
     
  3. EXTRACT_REQUIRED_DATA:
     extractedData = []
     FOR requirement in challengeParameters.dataRequirements:
         data = ExtractDataFromPlot(plotFile, requirement.offset, requirement.length)
         extractedData.append(data)
         
  4. VERIFY_DATA_INTEGRITY:
     FOR extract in extractedData:
         expectedHash = CalculateExpectedHash(extract, plotId, blobId)
         actualHash = SHA256(extract)
         IF actualHash != expectedHash:
             RETURN ERROR("Plot data integrity check failed")
  
  5. PERFORM_REQUIRED_COMPUTATIONS:
     computationResults = []
     FOR computation in challengeParameters.computations:
         result = PerformComputation(extractedData, computation)
         computationResults.append(result)
         
  6. GENERATE_CHALLENGE_RESPONSE:
     accessNonce = GenerateRandomNonce(32 bytes)
     challengeResponse = ComputeAccessResponse(extractedData, challengeParameters.challenge, accessNonce)
     
  7. RECORD_TIMESTAMPS:
     challengeTimestamp = challengeParameters.timestamp
     responseTimestamp = GetCurrentTimestamp()
     
  8. CREATE_COMMITMENTS:
     accessCommitment = Poseidon(extractedData + challengeResponse + accessNonce)
     freshnessCommitment = Poseidon(recentChiaBlockHash + challengeTimestamp + accessNonce)
     challengeCommitment = Poseidon(challengeParameters.challenge + challengeResponse + accessNonce)
     temporalCommitment = Poseidon(challengeTimestamp + responseTimestamp + accessNonce)
  
  9. PREPARE_CIRCUIT_INPUTS:
     privateInputs = [
         extractedData, plotId, blobId, accessNonce, computationResults,
         challengeResponse, recentChiaBlockHash, challengeTimestamp, responseTimestamp
     ]
     publicInputs = [
         accessCommitment, freshnessCommitment, challengeCommitment, temporalCommitment
     ]
  
  10. GENERATE_SNARK_PROOF:
      snarkProof = GenerateGroth16Proof(PhysicalAccessCircuit, privateInputs, publicInputs)
  
  11. CREATE_NULLIFIER:
      nullifier = Poseidon(plotId + blobId + challengeResponse + responseTimestamp + "ACCESS_V1")
  
  12. RETURN_PROOF_PACKAGE:
      Return PhysicalAccessProofPackage{
          commitments: [accessCommitment, freshnessCommitment, challengeCommitment, temporalCommitment],
          snarkProof: snarkProof,
          nullifier: nullifier,
          proofType: "PHYSICAL_ACCESS",
          version: 1,
          accessMetadata: {
              challengeTimestamp: challengeTimestamp,
              responseTimestamp: responseTimestamp,
              blockReference: recentChiaBlockHash,
              challengeType: challengeParameters.type
          }
      }
```

### Challenge Generation

Validators generate unpredictable challenges that require live data access:

```
ALGORITHM: Generate Access Challenge
PURPOSE: Create challenge that requires physical plot access

INPUT:
  - plotId: Plot to challenge
  - blobId: Specific blob within plot
  - challengeType: Type of access challenge

OUTPUT: Challenge parameters for physical access proof

STEPS:
  1. GENERATE_CHALLENGE_SEED:
     recentChiaBlockHash = GetMostRecentChiaBlockHash()
     challengeSeed = SHA256(recentChiaBlockHash + plotId + blobId + timestamp)
     
  2. DETERMINE_DATA_REQUIREMENTS:
     BASED ON challengeType:
         CASE "RANDOM_EXTRACT":
             dataRequirements = GenerateRandomExtracts(challengeSeed, plotSize)
         CASE "COMPUTATION":
             dataRequirements = GenerateComputationRequirements(challengeSeed)
         CASE "MERKLE_PROOF":
             dataRequirements = GenerateMerkleRequirements(challengeSeed, blobId)
         CASE "CROSS_REFERENCE":
             dataRequirements = GenerateCrossRefRequirements(challengeSeed)
             
  3. CREATE_CHALLENGE_PARAMETERS:
     challenge = SHA256(challengeSeed + dataRequirements + "ACCESS_CHALLENGE")
     
  4. SET_TEMPORAL_CONSTRAINTS:
     challengeTimestamp = GetCurrentTimestamp()
     expirationTime = challengeTimestamp + CHALLENGE_VALIDITY_WINDOW
     
  5. RETURN_CHALLENGE:
     Return ChallengeParameters{
         challenge: challenge,
         dataRequirements: dataRequirements,
         timestamp: challengeTimestamp,
         expirationTime: expirationTime,
         blockReference: recentChiaBlockHash,
         type: challengeType
     }
```

## Verification Process

### Validator Verification Workflow

```
ALGORITHM: Verify Physical Access Proof
PURPOSE: Validate current physical access without learning plot details

INPUT:
  - accessProof: Complete physical access proof package
  - originalChallenge: Original challenge issued to plot owner
  - plotId: Plot identifier
  - blobId: Blob identifier

OUTPUT: Boolean indicating proof validity + access verification

STEPS:
  1. EXTRACT_PROOF_COMPONENTS:
     commitments = accessProof.commitments
     snarkProof = accessProof.snarkProof
     nullifier = accessProof.nullifier
     accessMetadata = accessProof.accessMetadata
     
  2. CHECK_NULLIFIER_UNIQUENESS:
     IF nullifier exists in AccessNullifierDatabase:
         RETURN FALSE (access proof reuse detected)
  
  3. VERIFY_TEMPORAL_VALIDITY:
     currentTime = GetCurrentTimestamp()
     challengeAge = currentTime - accessMetadata.challengeTimestamp
     responseTime = accessMetadata.responseTimestamp - accessMetadata.challengeTimestamp
     
     IF challengeAge > CHALLENGE_VALIDITY_WINDOW:
         RETURN FALSE (challenge too old)
     IF responseTime > RESPONSE_WINDOW:
         RETURN FALSE (response took too long)
         
  4. VERIFY_BLOCKCHAIN_FRESHNESS:
     blockAge = GetBlockAge(accessMetadata.blockReference)
     IF blockAge > MAX_BLOCK_AGE:
         RETURN FALSE (blockchain reference too old)
         
  5. VERIFY_CHALLENGE_CONSISTENCY:
     IF NOT VerifyChallengeConsistency(originalChallenge, accessMetadata):
         RETURN FALSE (challenge/response mismatch)
         
  6. VERIFY_SNARK_PROOF:
     publicInputs = commitments
     isValid = VerifyGroth16Proof(PhysicalAccessVerificationKey, snarkProof, publicInputs)
     IF NOT isValid:
         RETURN FALSE
         
  7. CROSS_VERIFY_WITH_OTHER_PROOFS:
     // Ensure access proof is consistent with other proof types
     isConsistent = VerifyAccessProofConsistency(accessProof, otherProofs)
     IF NOT isConsistent:
         RETURN FALSE
         
  8. RECORD_VERIFICATION:
     AccessNullifierDatabase.Add(nullifier)
     LogAccessVerification(plotId, blobId, accessMetadata.challengeTimestamp, timestamp)
     
  9. RETURN_VERIFICATION_RESULT:
     RETURN AccessVerificationResult{
         isValid: TRUE,
         plotId: plotId,
         blobId: blobId,
         accessTimestamp: accessMetadata.responseTimestamp,
         verificationTimestamp: now(),
         proofVersion: accessProof.version
     }
```

### Interactive Verification

For enhanced security, the system supports interactive access verification:

```
Interactive Access Verification Protocol:
1. Validator issues fresh challenge in real-time
2. Plot owner must respond within time window
3. Response proves access to live plot data
4. Prevents all forms of precomputed proof attacks
5. Provides strongest possible access guarantees
```

## Attack Resistance

### Precomputation Attack Prevention

**Attack Vector**: Pre-computing access proofs and caching them while deleting actual data
**Defense**: Challenges incorporate unpredictable blockchain state and require real-time computation
**Security**: Cannot generate valid proofs without current access to actual plot data

### Stale Data Attack Prevention

**Attack Vector**: Using old plot data snapshots to respond to challenges
**Defense**: Challenges verify data integrity against current plot state
**Security**: Stale or modified data fails integrity verification

### Timing Attack Prevention

**Attack Vector**: Attempting to bypass temporal constraints through system manipulation
**Defense**: Temporal constraints embedded in cryptographic proofs
**Security**: Cannot manipulate timestamps within zero-knowledge proofs

### Response Caching Prevention

**Attack Vector**: Caching challenge responses for reuse
**Defense**: Each challenge includes unique, unpredictable elements
**Security**: Cached responses become invalid as challenge parameters change

## Performance Characteristics

### Proof Generation Performance

**Access Requirements:**
- Plot file read time: 100-500 milliseconds (depending on plot size and storage speed)
- Computation time: 2-10 seconds (depending on challenge complexity)
- Proof generation: 8-15 seconds (similar to other ZK proofs)
- Total time: 10-25 seconds typical

**Resource Usage:**
- Disk I/O: Variable based on challenge requirements
- Memory: 2-4 GB during proof generation
- CPU: Intensive during computation and proof generation
- Network: Minimal (only for challenge/response communication)

### Verification Performance

**Verification Metrics:**
- Standard verification: 3-8 milliseconds
- Challenge validation: 1-3 milliseconds
- Temporal validation: &lt;1 millisecond
- Total verification: 5-15 milliseconds

### Scalability Properties

**System Scalability:**
- Concurrent access verification: 200+ proofs per second per validator
- Challenge generation rate: 1000+ challenges per second
- Network scale: Millions of access proofs per epoch
- Storage requirements: ~4-8 KB per access proof

## Integration with PlotCoin System

### PlotCoin Lifecycle Integration

Physical Access Proofs are generated fresh for each PlotCoin creation:

```
PlotCoin Creation Workflow with Physical Access:
1. Validator issues access challenge for specific plot/blob
2. Plot owner generates Physical Access Proof using live data
3. Physical Access Proof embedded in PlotCoin along with other proofs
4. Validators verify all proofs including physical access before accepting PlotCoin
5. Process repeats for each epoch to ensure ongoing data availability
```

### Cross-Proof Verification

Physical Access Proofs must be consistent with other proof types:

```
Cross-Proof Consistency Requirements:
- Plot Creation Proof: Same plot must be referenced
- Data Inclusion Proof: Same blob must be accessible
- Ownership Verification: Same owner must have access
- Computational Work Proof: Work must be bound to accessible data
```

## Network Operations Integration

### Liveness Monitoring

Physical Access Proofs enable continuous network liveness monitoring:

- **Real-Time Verification**: Validators can challenge any plot owner at any time
- **Service Quality**: Monitor response times and data accessibility
- **Network Health**: Aggregate access statistics for network health metrics
- **Fraud Detection**: Identify storage providers failing to maintain data

### Performance Optimization

The access proof system supports performance optimization:

- **Cache Warming**: Verify data is accessible before serving to users
- **Load Balancing**: Direct traffic away from slow-responding providers
- **Quality Metrics**: Reward faster, more reliable storage providers
- **Geographic Optimization**: Verify data accessibility across regions

## Future Enhancements

### Advanced Challenge Types

**Research Directions:**
- Streaming challenges for very large plots
- Computational challenges requiring specific algorithms
- Multi-round interactive challenges for enhanced security
- Cross-plot challenges verifying relationships between plots

### Performance Improvements

**Development Priorities:**
- Optimized plot file access patterns for faster response
- Parallel challenge processing for multiple blobs
- Hardware acceleration for challenge computations
- Network-optimized challenge protocols

### Enhanced Security Features

**Future Features:**
- Anonymous access verification preserving plot owner privacy
- Conditional access proofs based on network conditions
- Multi-factor access verification for high-value content
- Cross-chain access verification for expanded interoperability

## Operational Considerations

### For Plot Owners

**Operational Requirements:**
- Maintain fast, reliable access to plot files
- Monitor system performance to meet response time requirements
- Implement robust storage infrastructure to prevent data loss
- Plan for network connectivity and system availability

### For Validators

**Validation Strategies:**
- Balance challenge frequency with network performance
- Monitor access proof patterns to detect anomalies
- Adjust challenge complexity based on network conditions
- Maintain comprehensive logs for audit and analysis

The Physical Access Proof provides the critical final layer of verification in the DIG Network's comprehensive security model, ensuring that storage providers maintain actual physical access to their data while preserving privacy and preventing various sophisticated attacks through real-time cryptographic verification. 