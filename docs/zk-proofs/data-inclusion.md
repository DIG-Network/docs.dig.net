---
sidebar_position: 3
---

:::tip 💜 Support the DIG Network
**Help build the future of decentralized storage!** The DIG Network is an open-source project that needs community support to continue development. 

**[💜 Support the Project →](../support.md)** - Donate crypto, buy NFTs, or sponsor development
:::

# Data Inclusion Proof

## Overview

The **Data Inclusion Proof** provides cryptographic evidence that specific blob data exists within a plot's Merkle tree structure without revealing the actual data content, tree structure, or plot metadata. This proof is essential for validators to verify that DIG Nodes are genuinely storing claimed data while preserving privacy and preventing various attacks.

## What It Proves

The Data Inclusion Proof establishes that:

1. **Data Existence**: A specific blob with a given blobId exists within the plot
2. **Merkle Tree Inclusion**: The blob is properly integrated into the plot's Merkle tree structure
3. **Cryptographic Integrity**: The blob data matches the expected cryptographic hash
4. **Content Privacy**: Blob content and tree structure remain hidden during verification
5. **Position Privacy**: The blob's location within the plot structure is not revealed

## Cryptographic Foundation

### Merkle Tree Architecture

The DIG Network uses a sophisticated Merkle tree structure within each plot to organize and verify data integrity:

```
Plot Merkle Tree Structure:
                         Root Hash (plotId component)
                        /                            \
                  Branch A                         Branch B
                  /      \                         /      \
            Leaf A1     Leaf A2              Leaf B1     Leaf B2
           (Blob 1)    (Blob 2)            (Blob 3)    (Blob 4)

Where each leaf represents:
- Leaf Hash = Poseidon(blobId + blobContent + metadata)
- Branch Hash = Poseidon(LeftChild + RightChild + treeMetadata)
- Root Hash = Final Merkle root incorporated into plotId
```

### Zero-Knowledge Merkle Inclusion

The proof enables verification of Merkle inclusion without revealing:
- The actual blob content
- The blob's position in the tree
- The tree structure or sibling nodes
- Any other blobs stored in the same plot

## ZK-SNARK Circuit Design

### Circuit Architecture

```
Circuit: DataInclusionProof
Purpose: Prove blob exists in Merkle tree without revealing structure or content

Inputs:
  Private:
    - blobContent: The actual blob data being proven (variable size)
    - blobId: SHA-256 hash identifier for the blob (32 bytes)
    - merkleProofPath: Array of sibling hashes for Merkle proof (variable size)
    - leafIndex: Position of blob in tree (log2(treeSize) bits)
    - treeDepth: Depth of the Merkle tree (8 bits)
    - plotId: Unique plot identifier (32 bytes)
    - randomNonce: Unique value for unlinkability (32 bytes)
    
  Public:
    - merkleRootCommitment: Commitment to the plot's Merkle root (32 bytes)
    - blobExistenceCommitment: Commitment proving blob existence (32 bytes)
    - inclusionCommitment: Commitment to inclusion proof validity (32 bytes)

Constraints:
  1. BLOB_HASH_VERIFICATION:
     computedBlobId = SHA256(blobContent)
     blobId == computedBlobId
     
  2. LEAF_HASH_COMPUTATION:
     leafHash = Poseidon(blobId + blobContent + leafMetadata)
     
  3. MERKLE_PATH_VERIFICATION:
     currentHash = leafHash
     FOR i in range(treeDepth):
         IF leafIndex[i] == 0:
             currentHash = Poseidon(currentHash + merkleProofPath[i])
         ELSE:
             currentHash = Poseidon(merkleProofPath[i] + currentHash)
     
  4. ROOT_VERIFICATION:
     merkleRoot = currentHash
     merkleRootCommitment = Poseidon(merkleRoot + plotId + randomNonce)
     
  5. EXISTENCE_COMMITMENT:
     blobExistenceCommitment = Poseidon(blobId + plotId + randomNonce)
     
  6. INCLUSION_COMMITMENT:
     inclusionCommitment = Poseidon(merkleRoot + blobId + leafIndex + randomNonce)
```

### Privacy-Preserving Commitments

The circuit uses multiple commitment layers to hide sensitive information:

```
Commitment Hierarchy:
1. merkleRootCommitment = Poseidon(merkleRoot + plotId + nonce1)
   - Hides: Actual Merkle root, plot identity
   - Proves: Knowledge of correct Merkle root for specific plot

2. blobExistenceCommitment = Poseidon(blobId + plotId + nonce2)  
   - Hides: Plot identity, reduces linkability
   - Proves: Specific blob exists in specific plot

3. inclusionCommitment = Poseidon(merkleRoot + blobId + leafIndex + nonce3)
   - Hides: Tree structure, blob position
   - Proves: Valid inclusion without revealing location
```

## Privacy Properties

### Content Privacy

The proof system provides **absolute content privacy**:

**Blob Content Protection:**
- Actual blob data never transmitted or revealed
- Hash-based verification without content exposure
- Zero-knowledge proof of content matching expected hash
- Cryptographic impossibility of content recovery from proof

**Tree Structure Privacy:**
- Merkle proof path remains hidden within circuit
- Sibling node hashes not revealed to validators
- Tree depth and structure concealed
- No information leakage about other stored blobs

### Position Privacy

**Location Concealment:**
- Blob's position in tree (leaf index) remains private
- Cannot determine which leaf contains the blob
- Prevents mapping of blob storage patterns
- Unlinkable across multiple proofs from same plot

### Plot Privacy

**Plot Identity Protection:**
- Plot ID incorporated in commitments but not revealed
- Cannot link proofs to specific plots
- Multiple proofs from same plot appear unrelated
- Owner anonymity preserved across verifications

## Proof Generation Algorithm

### Step-by-Step Process

```
ALGORITHM: Generate Data Inclusion Proof
PURPOSE: Prove blob exists in plot's Merkle tree without revealing details

INPUT:
  - blobContent: Raw blob data to prove
  - plotMetadata: Plot structure including Merkle tree
  - plotId: Plot identifier
  - blobId: Target blob identifier

OUTPUT: Zero-knowledge inclusion proof

STEPS:
  1. LOCATE BLOB IN MERKLE TREE
     leafIndex = FindBlobPosition(plotMetadata.merkleTree, blobId)
     IF leafIndex == NOT_FOUND:
         RETURN ERROR("Blob not found in plot")
  
  2. EXTRACT MERKLE PROOF PATH
     merkleProofPath = ExtractMerkleProof(plotMetadata.merkleTree, leafIndex)
     treeDepth = plotMetadata.merkleTree.depth
  
  3. GENERATE RANDOM NONCES
     nonce1 = GenerateRandomNonce(32 bytes)
     nonce2 = GenerateRandomNonce(32 bytes)  
     nonce3 = GenerateRandomNonce(32 bytes)
  
  4. COMPUTE MERKLE ROOT
     merkleRoot = plotMetadata.merkleTree.root
  
  5. CREATE COMMITMENTS
     merkleRootCommitment = Poseidon(merkleRoot + plotId + nonce1)
     blobExistenceCommitment = Poseidon(blobId + plotId + nonce2)
     inclusionCommitment = Poseidon(merkleRoot + blobId + leafIndex + nonce3)
  
  6. PREPARE CIRCUIT INPUTS
     privateInputs = [
         blobContent, blobId, merkleProofPath, leafIndex, 
         treeDepth, plotId, nonce1, nonce2, nonce3
     ]
     publicInputs = [
         merkleRootCommitment, blobExistenceCommitment, inclusionCommitment
     ]
  
  7. GENERATE SNARK PROOF
     snarkProof = GenerateGroth16Proof(DataInclusionCircuit, privateInputs, publicInputs)
  
  8. CREATE NULLIFIER
     nullifier = Poseidon(plotId + blobId + merkleRoot + "DATA_INCLUSION_V1")
  
  9. RETURN PROOF PACKAGE
     Return InclusionProofPackage{
         commitments: [merkleRootCommitment, blobExistenceCommitment, inclusionCommitment],
         snarkProof: snarkProof,
         nullifier: nullifier,
         proofType: "DATA_INCLUSION",
         version: 1,
         blobIdReference: blobId  // Only non-private reference for validator routing
     }
```

### Performance Optimization

**Variable Tree Depth Handling:**
```
Optimized Circuit for Multiple Tree Depths:
- Support for trees up to depth 32 (4+ billion blobs per plot)
- Conditional constraint activation based on actual tree depth
- Padded Merkle paths for consistent circuit size
- Optimized constraint usage for smaller trees
```

**Large Blob Support:**
```
Streaming Hash Computation for Large Blobs:
- SHA-256 computation optimized for large data blobs
- Chunked processing for memory efficiency
- Streaming verification without loading entire blob into memory
- Support for GB+ sized individual blobs
```

## Verification Process

### Validator Verification Workflow

```
ALGORITHM: Verify Data Inclusion Proof
PURPOSE: Validate blob inclusion without learning sensitive details

INPUT:
  - inclusionProof: Complete inclusion proof package
  - blobId: Blob identifier being verified
  - expectedPlotCommitment: From PlotCoin registry (for cross-verification)

OUTPUT: Boolean indicating proof validity + verification metadata

STEPS:
  1. EXTRACT PROOF COMPONENTS
     commitments = inclusionProof.commitments
     snarkProof = inclusionProof.snarkProof
     nullifier = inclusionProof.nullifier
  
  2. CHECK NULLIFIER UNIQUENESS
     IF nullifier exists in InclusionNullifierDatabase:
         RETURN FALSE (proof reuse detected)
  
  3. VERIFY SNARK PROOF
     publicInputs = commitments
     isValid = VerifyGroth16Proof(DataInclusionVerificationKey, snarkProof, publicInputs)
     IF NOT isValid:
         RETURN FALSE
  
  4. CROSS-VERIFY WITH PLOT CREATION PROOF (if available)
     IF expectedPlotCommitment provided:
         // Verify this inclusion proof is consistent with known plot commitment
         isConsistent = VerifyCommitmentConsistency(commitments, expectedPlotCommitment)
         IF NOT isConsistent:
             RETURN FALSE
  
  5. RECORD VERIFICATION
     InclusionNullifierDatabase.Add(nullifier)
     LogVerification(blobId, inclusionProof.version, timestamp)
  
  6. RETURN VERIFICATION RESULT
     RETURN VerificationResult{
         isValid: TRUE,
         blobId: blobId,
         verificationTimestamp: now(),
         proofVersion: inclusionProof.version
     }
```

### Cross-Proof Verification

Data Inclusion Proofs integrate with other proof types for comprehensive verification:

```
Cross-Proof Consistency Checks:
1. Plot Creation Proof ↔ Data Inclusion Proof
   - Verify Merkle root commitments are consistent
   - Ensure both proofs reference the same plot
   - Validate temporal consistency between proofs

2. Ownership Proof ↔ Data Inclusion Proof  
   - Verify plot ownership matches data inclusion claims
   - Ensure authorized access to blob data
   - Validate permission to prove inclusion

3. Physical Access Proof ↔ Data Inclusion Proof
   - Verify current access to plot containing blob
   - Ensure data inclusion proof represents current state
   - Validate freshness of inclusion claims
```

## Attack Resistance

### Content Extraction Prevention

**Attack Vector**: Attempting to extract blob content from inclusion proofs
**Defense**: Zero-knowledge circuit design makes content extraction cryptographically impossible
**Security**: Content remains private even if proof is public and circuit is known

### Tree Structure Inference

**Attack Vector**: Analyzing multiple proofs to infer Merkle tree structure
**Defense**: Position privacy and randomized commitments prevent structure inference
**Security**: Tree structure remains hidden even with multiple inclusion proofs

### Replay and Reuse Attacks

**Attack Vector**: Reusing inclusion proofs to claim storage of different blobs
**Defense**: Nullifier system prevents any proof from being used more than once
**Security**: Each proof can only be submitted once across entire network

### Forgery Attacks

**Attack Vector**: Creating fake inclusion proofs for non-existent blobs
**Defense**: ZK-SNARK security makes forgery computationally infeasible without actual data
**Security**: Cannot create valid proofs without possessing the actual blob content

## Advanced Privacy Features

### Unlinkable Proofs

Multiple inclusion proofs from the same plot owner appear completely unrelated:

```
Unlinkability Properties:
- Different random nonces for each proof
- Commitments hide plot identity and structure
- No identifying information in public proof components
- Cannot determine if proofs come from same source
```

### Selective Disclosure

The proof system supports selective disclosure of verification results:

```
Selective Disclosure Options:
1. Full Privacy: Only validity confirmed, no details revealed
2. Blob Confirmation: Confirm specific blob exists without revealing plot
3. Plot Consistency: Confirm proof relates to specific plot without details
4. Custom Disclosure: Application-specific disclosure levels
```

### Batch Inclusion Proofs

Multiple blobs can be proven simultaneously for efficiency:

```
Batch Inclusion Benefits:
- Amortized proof generation costs
- Reduced verification overhead
- Maintained privacy for all included blobs
- Efficient multi-blob validation
```

## Technical Specifications

### Circuit Constraints

**Constraint Complexity:**
- Base constraints: ~30,000 R1CS constraints
- Per tree level: +~2,000 constraints
- Per blob size GB: +~50,000 constraints (SHA-256 computation)
- Maximum practical: ~500,000 constraints for largest proofs

**Memory Requirements:**
- Witness generation: ~1-8 GB depending on blob size
- Proof generation: ~2-4 GB RAM typical
- Circuit compilation: ~4-8 GB for largest circuits
- Verification: &lt;100 MB memory required

### Proof Size and Performance

**Proof Characteristics:**
- Proof size: ~2-4 KB regardless of blob size or tree depth
- Generation time: 5-30 seconds depending on blob size
- Verification time: 2-8 milliseconds
- Parallelizable verification: Yes

**Scalability Properties:**
- Tree depth: Up to 32 levels (4+ billion blobs per plot)
- Blob size: Up to GB+ per individual blob
- Batch size: Up to 100+ blobs per batch proof
- Throughput: 100+ verifications per second per validator

## Integration Points

### PlotCoin Registry Integration

Data Inclusion Proofs are embedded within [PlotCoin](../primitives/on-chain/plotcoin.md) structures:

```
PlotCoin.ZKProofPackage.dataInclusionProofs: [
  {
    blobId: Hash32,
    commitments: [Hash32, Hash32, Hash32],
    snarkProof: Groth16Proof,
    nullifier: Hash32,
    proofMetadata: {
      circuitVersion: Number,
      treeDepth: Number,
      proofGenerationTime: Timestamp
    }
  }
]
```

### Validator Workflow Integration

Validators use Data Inclusion Proofs as part of comprehensive blob verification:

1. **Random Blob Selection**: Validator selects blob for verification
2. **PlotCoin Discovery**: Find PlotCoins claiming to store the blob
3. **Inclusion Verification**: Verify Data Inclusion Proofs for selected blob
4. **Cross-Proof Validation**: Verify consistency with other proof types
5. **Reward Attribution**: Award rewards to verified storage providers

### Network Operations Integration

Data Inclusion Proofs enable critical network operations:

- **Content Discovery**: Prove blob availability without revealing details
- **Quality Assurance**: Verify storage quality without compromising privacy
- **Fraud Detection**: Detect false storage claims while preserving legitimate privacy
- **Performance Optimization**: Enable verification without data transfer

## Future Enhancements

### Enhanced Privacy

**Research Areas:**
- Anonymous inclusion proofs with stronger unlinkability
- Zero-knowledge proof aggregation for multiple blobs
- Enhanced position privacy through advanced commitment schemes
- Cross-plot privacy with shared secret schemes

### Performance Improvements

**Development Priorities:**
- Faster hash function implementations optimized for large blobs
- Streaming proof generation for extremely large blobs
- Hardware acceleration for SHA-256 and Poseidon computations
- Advanced batch verification algorithms

### Extended Functionality

**Future Features:**
- Range proofs for blob size verification
- Temporal inclusion proofs showing blob storage duration
- Conditional inclusion proofs with access control
- Cross-chain inclusion verification capabilities

The Data Inclusion Proof represents a sophisticated cryptographic primitive that enables verifiable data storage while maintaining strong privacy guarantees, forming a crucial component of the DIG Network's trustless verification infrastructure. 