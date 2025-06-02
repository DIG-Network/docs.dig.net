---
sidebar_position: 2
---

# Plot Creation Proof

:::tip 💜 Support the DIG Network
**Help build the future of decentralized storage!** The DIG Network is an open-source project that needs community support to continue development. 

**[💜 Support the Project →](../support.md)** - Donate crypto, buy NFTs, or sponsor development
:::

## Overview

The **Plot Creation Proof** establishes cryptographic ownership of a plot without revealing sensitive plot metadata. This proof is fundamental to the DIG Network's security model, preventing plot theft and ensuring that only the legitimate creator can claim ownership and register the plot in the network.

## What It Proves

The Plot Creation Proof provides cryptographic evidence that:

1. **Original Ownership**: The prover is the original creator of the plot
2. **Temporal Anchoring**: The plot was created at a specific point in blockchain history
3. **Computational Commitment**: Genuine computational work was performed during plot creation
4. **Identity Privacy**: Plot ownership is proven without revealing the owner's identity
5. **Metadata Privacy**: Plot details remain hidden during verification

## Cryptographic Architecture

### ZK-SNARK Circuit Design

The Plot Creation Proof uses a custom ZK-SNARK circuit that verifies the relationship between the plot owner's private key, the plot's internal structure, and the Chia blockchain anchor without revealing any sensitive information.

```
Circuit: PlotCreationProof
Inputs:
  Private:
    - ownerPrivateKey: Plot owner's private key (32 bytes)
    - plotId: SHA-256 hash uniquely identifying the plot (32 bytes)
    - difficulty: Computational difficulty achieved during creation (4 bytes)
    - chiaBlockHeight: Chia blockchain block height for temporal anchoring (8 bytes)
    - chiaBlockHash: Chia blockchain block hash for temporal anchoring (32 bytes)
    - merkleRoot: Root hash of all data stored in the plot (32 bytes)
    - nonce: Random value for uniqueness (32 bytes)
    
  Public:
    - plotCommitment: Hash commitment to plot ownership (32 bytes)
    - temporalCommitment: Hash commitment to temporal anchoring (32 bytes)
    - workCommitment: Hash commitment to computational work (32 bytes)

Constraints:
  1. OWNERSHIP_VERIFICATION:
     ownerPublicKey = DerivePublicKey(ownerPrivateKey)
     plotCommitment = Poseidon(ownerPublicKey, plotId, nonce)
     
  2. TEMPORAL_BINDING:
     temporalCommitment = Poseidon(chiaBlockHeight, chiaBlockHash, plotId)
     
  3. WORK_VERIFICATION:
     workCommitment = Poseidon(difficulty, plotId, merkleRoot)
     
  4. PLOT_ID_CONSTRUCTION:
     expectedPlotId = SHA256(ownerPublicKey || merkleRoot || difficulty || 
                           chiaBlockHeight || chiaBlockHash)
     plotId == expectedPlotId
```

### Commitment Scheme

The proof uses Poseidon hash-based commitments to hide sensitive data while enabling verification:

```
Commitment Structure:
- plotCommitment = Poseidon(ownerPublicKey + plotId + randomNonce)
- temporalCommitment = Poseidon(chiaBlockHeight + chiaBlockHash + plotId)  
- workCommitment = Poseidon(difficulty + plotId + merkleRoot)
```

These commitments allow validators to verify plot ownership without learning:
- The actual plot ID
- The owner's public key
- When the plot was created
- How much computational work was performed

## Security Properties

### Ownership Binding

The proof cryptographically binds the plot to its original creator through several mechanisms:

#### Private Key Cryptographic Binding
```
Ownership Chain:
ownerPrivateKey → ownerPublicKey → plotId → plotCommitment → SNARKProof

Where:
- ownerPublicKey = Ed25519_DerivePublic(ownerPrivateKey)
- plotId incorporates ownerPublicKey as a component
- plotCommitment binds ownerPublicKey to specific plotId
- SNARKProof proves knowledge of entire chain without revealing components
```

#### Forgery Prevention
- **Private Key Requirement**: Valid proofs require knowledge of the owner's private key
- **Cryptographic Binding**: plotId construction makes forgery computationally infeasible
- **Unique Commitment**: Each proof includes a unique nonce preventing reuse
- **Temporal Anchoring**: Chia blockchain binding prevents backdating attacks

### Temporal Security

#### Blockchain Anchoring
The proof anchors the plot to a specific point in Chia blockchain history:

```
Temporal Binding Process:
1. Plot creation references a specific Chia block (height + hash)
2. temporalCommitment cryptographically binds plot to that block
3. Validators verify the referenced block exists and is valid
4. Prevents backdating plots to claim historical ownership
```

#### Anti-Replay Protection
- **Unique Nullifiers**: Each proof generates a unique nullifier preventing reuse
- **Temporal Constraints**: Proofs reference recent blockchain state
- **Nonce Requirements**: Random nonces ensure proof uniqueness
- **State Tracking**: Network tracks used proofs to prevent replay

### Privacy Protection

#### Zero-Knowledge Properties
The proof reveals **zero information** about:

**Plot Metadata:**
- Plot ID value
- Creation timestamp
- Computational difficulty achieved
- Merkle root of stored data
- Any internal plot structure

**Owner Information:**
- Owner's public key
- Owner's private key
- Any identifying information
- Historical plot creation activity

**Blockchain Anchoring:**
- Specific Chia block referenced
- Exact creation time
- Blockchain relationship details

#### Unlinkability
Multiple proofs from the same plot owner cannot be linked together, providing strong anonymity guarantees for network participants.

## Proof Generation Process

### Step-by-Step Generation

```
ALGORITHM: Generate Plot Creation Proof
PURPOSE: Create a zero-knowledge proof of plot ownership

INPUT:
  - ownerPrivateKey: Plot owner's private key
  - plotMetadata: Complete plot metadata including plotId, difficulty, etc.
  - chiaAnchor: Recent Chia blockchain block (height + hash)

OUTPUT: Complete ZK proof package

STEPS:
  1. GENERATE RANDOM BLINDING FACTORS
     nonce = GenerateRandomNonce(32 bytes)
     blindingFactors = [GenerateRandom(32 bytes) for each commitment]

  2. DERIVE PUBLIC KEY
     ownerPublicKey = Ed25519_DerivePublic(ownerPrivateKey)

  3. CONSTRUCT PLOT ID  
     plotId = SHA256(ownerPublicKey || merkleRoot || difficulty || 
                   chiaBlockHeight || chiaBlockHash)

  4. CREATE COMMITMENTS
     plotCommitment = Poseidon(ownerPublicKey + plotId + nonce)
     temporalCommitment = Poseidon(chiaBlockHeight + chiaBlockHash + plotId)
     workCommitment = Poseidon(difficulty + plotId + merkleRoot)

  5. GENERATE SNARK PROOF
     privateInputs = [ownerPrivateKey, plotId, difficulty, chiaBlockHeight, 
                     chiaBlockHash, merkleRoot, nonce]
     publicInputs = [plotCommitment, temporalCommitment, workCommitment]
     snarkProof = GenerateGroth16Proof(PlotCreationCircuit, privateInputs, publicInputs)

  6. CREATE NULLIFIER
     nullifier = Poseidon(ownerPrivateKey + plotCommitment + "PLOT_CREATION_V1")

  7. RETURN PROOF PACKAGE
     Return ProofPackage{
       commitments: [plotCommitment, temporalCommitment, workCommitment],
       snarkProof: snarkProof,
       nullifier: nullifier,
       proofType: "PLOT_CREATION",
       version: 1
     }
```

### Performance Characteristics

**Generation Time:**
- **Setup Phase**: ~2 seconds (one-time per circuit)
- **Witness Generation**: ~0.5 seconds
- **Proof Compilation**: ~5-8 seconds
- **Total Generation**: ~8-10 seconds typical

**Resource Requirements:**
- **Memory**: ~2-4 GB RAM during generation
- **CPU**: Single-threaded, CPU-intensive
- **Storage**: ~500 MB for trusted setup parameters

## Proof Verification Process

### Validator Verification Workflow

```
ALGORITHM: Verify Plot Creation Proof
PURPOSE: Validate a plot creation proof without learning sensitive information

INPUT:
  - proofPackage: Complete ZK proof package from plot owner
  - chiaBlockchain: Access to Chia blockchain for temporal verification

OUTPUT: Boolean indicating proof validity

STEPS:
  1. CHECK NULLIFIER UNIQUENESS
     IF nullifier exists in NullifierDatabase:
         RETURN FALSE (proof reuse detected)

  2. EXTRACT PROOF COMPONENTS
     commitments = proofPackage.commitments
     snarkProof = proofPackage.snarkProof
     nullifier = proofPackage.nullifier

  3. VERIFY SNARK PROOF
     publicInputs = commitments
     isValid = VerifyGroth16Proof(PlotCreationVerificationKey, snarkProof, publicInputs)
     IF NOT isValid:
         RETURN FALSE

  4. VERIFY TEMPORAL CONSTRAINTS
     // Ensure proof references a valid, recent Chia block
     IF temporal commitment references invalid/old block:
         RETURN FALSE

  5. RECORD NULLIFIER
     NullifierDatabase.Add(nullifier)

  6. RETURN VERIFICATION RESULT
     RETURN TRUE
```

### Verification Properties

**Constant Time Verification:**
- O(1) verification time regardless of plot size
- ~2-5 milliseconds typical verification time
- Parallel verification of multiple proofs
- No access to original plot data required

**Network Efficiency:**
- ~2-4 KB proof size regardless of plot data size
- Batch verification capabilities
- Minimal bandwidth requirements
- Efficient proof serialization

## Integration with PlotCoin System

### PlotCoin Embedding

Plot Creation Proofs are embedded in [PlotCoin](../primitives/on-chain/plotcoin.md) registry entries:

```
PlotCoin Structure (Plot Creation Component):
{
  plotCreationProof: {
    commitments: {
      plotCommitment: Hash32,
      temporalCommitment: Hash32,
      workCommitment: Hash32
    },
    snarkProof: Groth16Proof,
    nullifier: Hash32,
    proofMetadata: {
      circuitVersion: Number,
      generationTimestamp: Timestamp,
      chiaBlockReference: BlockHeight
    }
  }
}
```

### Validator Integration

Validators use Plot Creation Proofs as the first step in comprehensive plot verification:

1. **Ownership Verification**: Verify the plot was created by someone with the private key
2. **Temporal Validation**: Confirm the plot was created at a legitimate time
3. **Work Verification**: Validate computational commitment without revealing details
4. **Anti-Fraud**: Detect and reject forged or replayed proofs
5. **Privacy Preservation**: Verify ownership without learning plot owner identity

## Advanced Features

### Interactive Verification

For enhanced security, the proof supports interactive challenge-response:

```
Interactive Verification Protocol:
1. Validator sends random challenge
2. Plot owner generates fresh proof incorporating challenge
3. Prevents precomputed proof attacks
4. Provides additional freshness guarantees
```

### Batch Verification

Multiple Plot Creation Proofs can be verified together efficiently:

```
Batch Verification Benefits:
- Amortized verification costs across multiple proofs
- Improved throughput for validators
- Reduced computational overhead
- Parallel processing optimization
```

### Upgradeable Circuits

The proof system supports circuit upgrades while maintaining backward compatibility:

```
Circuit Versioning:
- Version identifiers in proof metadata
- Backward compatibility for older proofs
- Smooth migration to enhanced circuits
- Future-proof architecture
```

## Attack Resistance

### Plot Theft Prevention

**Attack Vector**: Malicious actor copies a plot file and attempts to claim ownership
**Defense**: Plot Creation Proof requires knowledge of the original owner's private key
**Result**: Impossible to generate valid proof without the private key

### Temporal Manipulation

**Attack Vector**: Attempting to backdate plot creation to claim historical ownership
**Defense**: Temporal commitment cryptographically binds plot to specific blockchain state
**Result**: Cannot create proofs referencing past blockchain states without time travel

### Proof Replay

**Attack Vector**: Reusing the same proof multiple times to claim rewards
**Defense**: Nullifier tracking prevents any proof from being used more than once
**Result**: Each proof can only be submitted once across the entire network

### Forgery Attempts

**Attack Vector**: Creating fake proofs that appear valid
**Defense**: ZK-SNARK cryptographic security makes forgery computationally infeasible
**Result**: Fake proofs are rejected with overwhelming probability

## Technical Implementation Details

### Circuit Optimization

The Plot Creation circuit is optimized for:

**Constraint Minimization:**
- ~50,000 R1CS constraints typical
- Optimized Poseidon hash implementations
- Efficient field arithmetic operations
- Minimized proof generation time

**Memory Efficiency:**
- Streaming witness generation
- Minimal memory footprint during generation
- Efficient constraint system representation
- Optimized for commodity hardware

### Trusted Setup

The circuit uses a universal trusted setup:

**Setup Properties:**
- Powers of Tau ceremony for universal parameters
- Circuit-specific parameters derived deterministically
- Transparent generation process
- Community verification of setup integrity

**Security Assumptions:**
- Standard cryptographic assumptions (discrete log, etc.)
- Trusted setup integrity (single honest participant sufficient)
- Hash function security (Poseidon, SHA-256)
- Elliptic curve security (BN254)

## Future Enhancements

### Enhanced Privacy

**Potential Improvements:**
- Anonymous credentials integration
- Enhanced unlinkability properties
- Metadata hiding improvements
- Cross-proof privacy enhancements

### Performance Optimization

**Ongoing Development:**
- Faster proof generation algorithms
- Reduced memory requirements
- Hardware acceleration support
- Batch generation capabilities

### Additional Security Features

**Future Features:**
- Multi-signature plot ownership
- Delegation capabilities
- Enhanced temporal constraints
- Cross-chain anchoring options

The Plot Creation Proof represents the foundational security primitive that enables trustless plot ownership verification while preserving privacy and preventing various attack vectors through advanced zero-knowledge cryptography. 