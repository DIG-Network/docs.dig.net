---
sidebar_position: 4
---

# Ownership Verification Proof

:::tip 💜 Support the DIG Network
**Help build the future of decentralized storage!** The DIG Network is an open-source project that needs community support to continue development. 

**[💜 Support the Project →](../support.md)** - Donate crypto, buy NFTs, or sponsor development
:::

## Overview

The **Ownership Verification Proof** establishes cryptographic evidence that the current plot data comes from the legitimate owner without revealing the owner's identity. This proof ensures that only the plot owner who possesses the private key can claim ownership of specific plot and blob data combinations.

## What It Proves

The Ownership Verification Proof provides cryptographic evidence that:

1. **Plot Ownership**: The prover owns the plot containing the blob data
2. **Blob Authority**: The prover has authority over the specific blob within their plot
3. **Digital Signature Validity**: Cryptographic signatures prove ownership using the private key
4. **Key Ownership**: The prover possesses the private key corresponding to the plot owner
5. **Identity Privacy**: Ownership is proven without revealing the owner's identity

## ZK-SNARK Circuit Architecture

### Circuit Design

```
Circuit: OwnershipVerificationProof
Purpose: Prove ownership of plot and blob data without revealing identity

Inputs:
  Private:
    - privateKey: Plot owner's secret key (32 bytes)
    - publicKey: Plot owner's public key (32 bytes)
    - plotId: Unique identifier for the plot (32 bytes)
    - blobData: The specific blob data being proven (variable size)
    - timestamp: When proof was created (8 bytes)
    - plotSignature: Digital signature over plot message (variable size)
    - blobSignature: Digital signature over blob message (variable size)
    - ownerRandom: Random value for hiding owner identity (32 bytes)
    - plotRandom: Random value for hiding plot identity (32 bytes)
    - blobRandom: Random value for hiding blob data (32 bytes)
    - timestampRandom: Random value for hiding timestamp (32 bytes)
    
  Public:
    - ownerCommitment: Commitment to owner's public key (32 bytes)
    - plotCommitment: Commitment to plot identifier (32 bytes)
    - blobCommitment: Commitment to blob data (32 bytes)
    - timestampCommitment: Commitment to proof timestamp (32 bytes)

Constraints:
  1. KEY_DERIVATION:
     publicKey = Ed25519_DerivePublic(privateKey)
     
  2. SIGNATURE_VERIFICATION:
     plotMessage = Hash(plotId + timestamp)
     blobMessage = Hash(blobHash + timestamp)
     plotSignatureValid = Ed25519_Verify(publicKey, plotSignature, plotMessage)
     blobSignatureValid = Ed25519_Verify(publicKey, blobSignature, blobMessage)
     ASSERT plotSignatureValid == TRUE
     ASSERT blobSignatureValid == TRUE
     
  3. COMMITMENT_GENERATION:
     ownerCommitment = Poseidon(publicKey + ownerRandom)
     plotCommitment = Poseidon(plotId + plotRandom)
     blobCommitment = Poseidon(blobHash + blobRandom)
     timestampCommitment = Poseidon(timestamp + timestampRandom)
```

## Privacy Properties

### Identity Concealment

The proof system enables ownership verification without revealing any identifying information:

```
Privacy Guarantees:
- Owner's public key never revealed to validators
- Private key remains completely hidden
- Multiple proofs from same owner appear unrelated
- Cannot link ownership proofs to specific identities
```

### Plot and Blob Privacy

The system verifies ownership without revealing sensitive plot or blob details:

```
Data Privacy Features:
- Plot identifier hidden from validators
- Blob content never disclosed
- Plot structure remains concealed
- Cannot determine what data is being owned
```

## Proof Generation Process

```
ALGORITHM: Generate Ownership Proof
PURPOSE: Prove you own both the plot and specific blob data without revealing your identity

INPUT:
  - privateKey: Your secret key (proves ownership)
  - publicKey: Your public key (identity)
  - plotId: Unique identifier for your plot
  - blobData: The specific data blob you're proving ownership of

OUTPUT: Zero-knowledge proof of ownership

STEPS:
  1. GENERATE RANDOM HIDING VALUES
     // Create random numbers to hide our sensitive data
     ownerRandom = GenerateRandomNumber()
     plotRandom = GenerateRandomNumber()
     blobRandom = GenerateRandomNumber()
     timestampRandom = GenerateRandomNumber()
     
  2. PREPARE DATA FOR CRYPTOGRAPHIC PROCESSING
     // Convert all data to cryptographic field elements
     privateKey_field = ConvertToFieldElement(privateKey)
     publicKey_field = ConvertToFieldElement(publicKey)
     plotId_field = ConvertToFieldElement(plotId)
     blobHash = Hash(blobData)
     blobHash_field = ConvertToFieldElement(blobHash)
     timestamp_field = ConvertToFieldElement(GetCurrentTime())
  
  3. CREATE HIDDEN COMMITMENTS
     // Hide our data behind cryptographic commitments
     ownerCommitment = Hash(publicKey_field + ownerRandom)
     plotCommitment = Hash(plotId_field + plotRandom)
     blobCommitment = Hash(blobHash_field + blobRandom)
     timestampCommitment = Hash(timestamp_field + timestampRandom)
  
  4. GENERATE DIGITAL SIGNATURES
     // Create signatures that prove we own the private key
     plotMessage = Hash(plotId_field + timestamp_field)
     blobMessage = Hash(blobHash_field + timestamp_field)
     plotSignature = DigitallySign(privateKey, plotMessage)
     blobSignature = DigitallySign(privateKey, blobMessage)
  
  5. GENERATE ZERO-KNOWLEDGE PROOF
     // Prove ownership without revealing the private key or identity
     
     SECRET_INPUTS = [
       privateKey, publicKey, plotId, blobHash, timestamp,
       plotSignature, blobSignature, ownerRandom, plotRandom, blobRandom, timestampRandom
     ]
     
     PUBLIC_INPUTS = [
       ownerCommitment, plotCommitment, blobCommitment, timestampCommitment
     ]
     
     PROOF_VALIDATES_THAT:
       - ownerCommitment correctly hides the public key
       - plotCommitment correctly hides the plot ID
       - blobCommitment correctly hides the blob hash
       - timestampCommitment correctly hides the timestamp
       - plotSignature is a valid signature of the plot message using the private key
       - blobSignature is a valid signature of the blob message using the private key
       - publicKey correctly corresponds to privateKey
     
     snarkProof = GenerateZKProof(SECRET_INPUTS, PUBLIC_INPUTS, VALIDATION_RULES)
  
  6. CREATE REPLAY PROTECTION
     uniqueID = Hash(privateKey + ownerCommitment + timestamp)
  
  7. RECORD TO PREVENT REUSE
     Add uniqueID to NullifierDatabase
  
  8. RETURN COMPLETE PROOF
     Return: (ownerCommitment, plotCommitment, blobCommitment, timestampCommitment, snarkProof, uniqueID)
```

## Verification Process

```
ALGORITHM: Verify Ownership Proof
PURPOSE: Check if ownership proof is valid without learning the owner's identity

INPUT:
  - proof: The ownership proof to verify
  - expectedPlotCommitment: (Optional) Expected plot commitment
  - expectedBlobCommitment: (Optional) Expected blob commitment

OUTPUT: TRUE if proof is valid, FALSE otherwise

STEPS:
  1. CHECK FOR PROOF REUSE
     // Make sure this proof hasn't been used before
     IF uniqueID already exists in NullifierDatabase:
         RETURN FALSE (proof already used)
  
  2. VERIFY EXPECTED COMMITMENTS (if provided)
     // Check if the commitments match what we expect
     IF expectedPlotCommitment is provided:
         IF proof.plotCommitment does not equal expectedPlotCommitment:
             RETURN FALSE (plot doesn't match expected)
     
     IF expectedBlobCommitment is provided:
         IF proof.blobCommitment does not equal expectedBlobCommitment:
             RETURN FALSE (blob doesn't match expected)
  
  3. VERIFY THE CRYPTOGRAPHIC PROOF
     // Check that the SNARK proof is mathematically sound
     publicInputs = [
    proof.ownerCommitment,
    proof.plotCommitment,
    proof.blobCommitment,
    proof.timestampCommitment
     ]
     
     isValidProof = VerifyZKProof(proof.snarkProof, publicInputs)
  
  4. VERIFY CONSISTENCY
     // Make sure the unique ID matches what the proof claims
     expectedID = ExtractUniqueIDFromProof(proof.snarkProof)
     isConsistent = (expectedID equals proof.uniqueID)
  
  5. RECORD SUCCESSFUL VERIFICATION
     IF proof is valid AND consistent:
         Add uniqueID to NullifierDatabase (mark as used)
  
  6. RETURN RESULT
     RETURN (isValidProof AND isConsistent)
```

## Integration with PlotCoin System

Ownership Verification Proofs are embedded within [PlotCoin](../primitives/on-chain/plotcoin.md) structures:

```
PlotCoin.ZKProofPackage.ownershipProof: {
  ownerCommitment: Hash32,
  plotCommitment: Hash32,
  blobCommitment: Hash32,
  timestampCommitment: Hash32,
  snarkProof: Groth16Proof,
  nullifier: Hash32,
  proofMetadata: {
    circuitVersion: Number,
    generationTimestamp: Timestamp
  }
}
```

### Cross-Proof Verification

Ownership proofs work together with other proof types for comprehensive verification:

- **Plot Creation Proof**: Verify same plot is referenced in both proofs
- **Data Inclusion Proof**: Verify same blob exists and is owned
- **Physical Access Proof**: Verify owner has current access to plot data
- **Computational Work Proof**: Verify work is bound to owner's plot and blob

## Attack Resistance

### Ownership Spoofing Prevention

**Attack Vector**: Attempting to claim ownership of someone else's plot or blob data
**Defense**: Zero-knowledge proofs require actual private key knowledge
**Security**: Cryptographically impossible to create valid proofs without the owner's private key

### Replay Attack Prevention

**Attack Vector**: Reusing ownership proofs multiple times to claim rewards
**Defense**: Nullifier system prevents any proof from being used more than once
**Security**: Each proof can only be submitted once across the entire network

### Identity Impersonation Prevention

**Attack Vector**: Trying to impersonate the plot owner's identity
**Defense**: Digital signatures prove private key ownership without revealing identity
**Security**: Cannot forge signatures without access to the owner's private key

### Plot Theft Prevention

**Attack Vector**: Copying someone's plot file and claiming ownership
**Defense**: Ownership proofs require signatures over both plot and blob data using owner's key
**Security**: Cannot generate valid ownership proofs for stolen plot files

## Performance Characteristics

### Proof Generation Performance

**Generation Metrics:**
- Standard ownership proof: 8-15 seconds
- Memory usage: 2-4 GB during generation
- CPU intensive signature verification within circuit

### Verification Performance

**Verification Metrics:**
- Standard verification: 3-8 milliseconds
- Batch verification: 1-3 milliseconds per proof (amortized)
- Memory usage: &lt;100 MB during verification
- Fully parallelizable verification

## Network Operations Integration

Ownership proofs enable key network operations:

- **Plot Ownership Verification**: Prove legitimate ownership of plot data
- **Blob Authority**: Prove authority over specific blobs within plots
- **Reward Distribution**: Ensure rewards go to legitimate plot owners
- **Fraud Prevention**: Detect and prevent false ownership claims

The Ownership Verification Proof provides essential security for the DIG Network by ensuring that only legitimate plot owners can claim ownership of their data while preserving privacy and preventing various attacks through advanced zero-knowledge cryptography. 