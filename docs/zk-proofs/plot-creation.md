---
sidebar_position: 2
---

# Plot Creation Proof

:::tip 💜 Support the DIG Network
**Help build the future of decentralized storage!** The DIG Network is an open-source project that needs community support to continue development. 

**[💜 Support the Project →](../support.md)** - Donate crypto, buy NFTs, or sponsor development
:::

## Overview

The **Plot Creation Proof** is a zero-knowledge proof that demonstrates ownership of a specific plot by proving knowledge of the private key that created it. This proof is fundamental to the DIG Network's security model, allowing storage providers to claim ownership of plots while maintaining privacy about sensitive metadata.

### Key Design Decision: Public plotId, publicKey, and difficulty

The Plot Creation Proof makes the `plotId`, `publicKey`, and `difficulty` public inputs, enabling:

1. **Clear Ownership Claims**: Verifiers know exactly which plot and public key are being claimed
2. **Transparent Work Verification**: The actual difficulty is visible for network validation
3. **Efficient Validation**: Network participants can quickly check plot properties
4. **Accountability**: Public keys create a pseudonymous identity for storage providers

### What is Proven

The Plot Creation Proof provides cryptographic evidence of:

1. **Private Key Knowledge**: The prover knows the private key corresponding to the claimed public key
2. **Correct Plot Construction**: The plotId was derived using the exact formula with valid inputs
3. **Difficulty Transparency**: The exact difficulty achieved is revealed publicly for verification
4. **Blockchain Anchoring**: The plot is permanently anchored to a specific Chia blockchain block

All of this is proven while keeping secret:
- The actual private key
- The plot's Merkle root - while not sensitive data, including in as a private input keeps the proof package smaller

## Circuit Architecture

The Plot Creation Proof is implemented as a streamlined ZK-SNARK circuit using Circom 2.0.

### Circuit Inputs

Based on the implementation in `plot_creation.circom`:

```circom
template PlotCreation() {
    // ===== PUBLIC INPUTS (revealed to verifier) =====
    signal input plotId;              // The plot ID being claimed
    signal input publicKey;           // The public key of the claimed owner
    signal input difficulty;          // The actual difficulty used (public for transparency)
    signal input blockHeight;         // For blockchain anchoring verification
    signal input blockHash;           // For blockchain anchoring verification

    // ===== PRIVATE INPUTS (kept secret) =====
    signal private input privateKey;  // Must derive to the public key
    signal private input merkleRoot;  // Plot's merkle root (kept private)
}
```

### Key Circuit Constraints

#### 1. Private Key Verification
```circom
// Verify private key corresponds to the claimed public key
component privToPub = BabyPbk();
// ... conversion logic ...
publicKey === privToPub.Ax;
```

This ensures the prover actually knows the private key for the claimed public key.

#### 2. Plot ID Derivation
```circom
// Verify plot ID was correctly derived
// plotId = Poseidon(publicKey, merkleRoot, difficulty, blockHeight, blockHash)
plotDerivation.inputs[0] <== publicKey;
plotDerivation.inputs[1] <== merkleRoot;
plotDerivation.inputs[2] <== difficulty;
plotDerivation.inputs[3] <== blockHeight;
plotDerivation.inputs[4] <== blockHash;

// The claimed plotId must equal the derived value
plotId === plotDerivation.out;
```

This prevents anyone from claiming ownership of a plotId they didn't create. The actual difficulty value is included in the derivation and revealed publicly, ensuring transparency about the computational work performed.

### Blockchain Anchoring

The plot is permanently anchored to a specific Chia blockchain block through the plotId derivation. This provides:

- **Immutable Timestamp**: The block serves as a cryptographic timestamp
- **No Age Restrictions**: Any valid block can be used - recent or historical
- **Permanent Binding**: The plotId forever includes this blockchain reference
- **External Verifiability**: Anyone can verify the block exists on the Chia blockchain

The system doesn't care how old the block is - it simply ensures the plot is cryptographically bound to that specific point in blockchain history. In practice though, the most recent block available at time of plot creation is preferred for other verifications in the system.

## Proof Structure

The proof structure:

```typescript
interface ZKPlotCreationProof {
  // Public inputs (known to verifier)
  plotId: Buffer;              // The plot ID being claimed
  publicKey: Buffer;           // The public key of the claimed owner
  difficulty: number;          // The actual difficulty used (public for transparency)
  blockHeight: number;         // Chia block height for anchoring
  blockHash: Buffer;           // Chia block hash for anchoring
  
  // Proof
  snarkProof: Buffer;          // The ZK-SNARK proof
  
  // Anti-replay
  nullifier: Buffer;           // Prevents proof reuse
}
```

## Proof Generation Process

### Step 1: Prepare Inputs

The plot owner gathers all required inputs:

```typescript
// Public inputs (will be revealed)
const publicInputs = {
  plotId: computedPlotId,           // The specific plot being claimed
  publicKey: ownerPublicKey,        // The owner's public key
  difficulty: actualDifficulty,     // The actual difficulty achieved
  blockHeight: anchorBlock.height,
  blockHash: anchorBlock.hash
};

// Private inputs (kept secret)
const privateInputs = {
  privateKey: ownerPrivateKey,      // Proves ownership
  merkleRoot: plotMerkleRoot        // Hidden data commitment
};
```

### Step 2: Validate Plot ID

Before generating the proof, the system verifies the plotId matches the expected derivation:

```typescript
const expectedPlotId = Poseidon(
  publicKey,
  merkleRoot,
  difficulty,
  blockHeight,
  blockHash
);

if (!constantTimeCompare(plotId, expectedPlotId)) {
  throw new Error('Plot ID does not match expected derivation');
}
```

### Step 3: Generate SNARK Proof

The circuit generates a proof that all constraints are satisfied:

```typescript
const snarkProof = await generateZKCreationCircuit({
  // Public inputs
  plotId,
  publicKey,
  difficulty,  // Now public
  blockHeight,
  blockHash,
  
  // Private inputs
  privateKey,
  merkleRoot
});
```

### Step 4: Create Nullifier

A nullifier prevents proof reuse:

```typescript
const nullifier = Poseidon(privateKey, plotId);
```

## Verification Process

Validators verify the proof knowing exactly which plot and owner are being claimed:

### Step 1: Check Public Inputs

```typescript
// Verify public inputs are well-formed
if (proof.plotId.length !== 32 || 
    proof.publicKey.length !== 32 ||
    proof.difficulty <= 0 ||
    proof.blockHeight <= 0 ||
    proof.blockHash.length !== 32) {
  return INVALID;
}
```

### Step 2: Verify SNARK Proof

```typescript
// Public inputs for the circuit
const publicInputs = [
  proof.plotId,
  proof.publicKey,
  proof.difficulty,  // Actual difficulty is public
  proof.blockHeight,
  proof.blockHash
];

// Efficient verification using only the verification key (vkey)
const isValid = await snarkjs.groth16.verify(
  verificationKey,  // Small vkey file (~KB)
  publicInputs,
  proof.snarkProof
);
```

### Step 3: Check Nullifier

```typescript
// Prevent proof reuse
if (nullifierSet.has(proof.nullifier)) {
  return INVALID; // Proof already used
}
nullifierSet.add(proof.nullifier);
```

## Security Properties

### What's Public vs Private

**Public (Revealed)**:
- `plotId`: The specific plot being claimed
- `publicKey`: The owner's public key
- `difficulty`: The actual difficulty achieved (for transparency)
- `blockHeight` and `blockHash`: Blockchain anchoring (any valid block)

**Private (Hidden)**:
- Private key
- Merkle root of plot data

### Why This Design is Secure

1. **Cannot Steal Plots**: You need the private key to generate a valid proof
2. **Cannot Forge Plot IDs**: The circuit verifies exact derivation
3. **Transparent Difficulty**: Actual difficulty is public for network verification
4. **Cannot Replay Proofs**: Nullifiers prevent reuse
5. **Simple and Auditable**: Minimal complexity reduces attack surface

### Attack Analysis

#### Attack: Creating Fake Plot IDs
```typescript
// Attacker tries to create a fake plot
const fakePlotId = randomBytes(32);
const fakeProof = generateProof(attackerPrivateKey, fakePlotId, ...);

// This fails because:
// 1. The circuit verifies plotId = Poseidon(publicKey, merkleRoot, ...)
// 2. Attacker cannot find inputs that produce their fake plotId
// 3. They can only prove ownership of plots created with their key
```

#### Attack: Claiming Someone Else's Plot
```typescript
// Attacker sees Alice's plotId and publicKey
const stolenPlotId = alicePlotId;
const attackerProof = generateProof(attackerPrivateKey, stolenPlotId, ...);

// This fails because:
// 1. Circuit requires privateKey that derives to publicKey
// 2. Attacker's privateKey derives to different publicKey
// 3. Cannot satisfy the constraint: publicKey === derivedKey
```

## Integration with DIG Network

### PlotCoin Registration

Plot Creation Proofs are embedded in [PlotCoin](../primitives/on-chain/plotcoin.md) entries:

```typescript
const plotCoinData = {
  // Public plot identity
  plotId,
  publicKey,
  difficulty,  // Actual difficulty is public
  
  // Proof of creation
  plotCreationProof: {
    blockHeight,
    blockHash,
    snarkProof,
    nullifier
  },
  
  // Additional metadata
  createdAt: blockHeight
};
```

### Network Benefits

The simplified design provides:

1. **Efficient Verification**: Minimal proof size and fast verification
2. **Clear Ownership**: Public plotId and key enable easy lookups
3. **Transparent Quality**: Public difficulty allows quality assessment
4. **Strong Security**: Essential constraints without extra complexity
5. **Lower Costs**: Reduced proving time and resources

## Practical Example

### Alice Claims a Plot

```typescript
// 1. Alice has created a plot
const alicePlot = {
  plotId: "0xdead...beef",      // Specific plot ID
  publicKey: "0x1234...5678",    // Alice's public key
  merkleRoot: "0xaaaa...bbbb",   // Private: her data
  difficulty: 25                 // Public: actual difficulty
};

// 2. Generate proof of ownership
const proof = await generatePlotCreationProof({
  // Public inputs
  plotId: alicePlot.plotId,
  publicKey: alicePlot.publicKey,
  difficulty: alicePlot.difficulty,
  blockHeight: 3456789,
  blockHash: "0xcccc...dddd",
  
  // Private inputs
  privateKey: alicePrivateKey,
  merkleRoot: alicePlot.merkleRoot
});

// 3. Submit to network
// Everyone can see:
// - Alice (0x1234...5678) claims plot 0xdead...beef
// - The plot has difficulty 25
// - The plot is anchored to block 3456789 (could be any valid block)

// But nobody learns:
// - Alice's private key
// - The exact data in the plot (merkle root)
```

## Circuit Performance

The simplified circuit provides excellent performance:

- **Constraints**: ~12,000 (reduced by removing difficulty comparison)
- **Proof Generation**: ~2-3 seconds
- **Verification**: ~5ms
- **Proof Size**: ~256 bytes

## Summary

The Plot Creation Proof provides a streamlined, secure way to prove plot ownership:

1. **Minimal Complexity**: Only essential constraints, no unnecessary checks
2. **Full Transparency**: Public plotId, publicKey, and difficulty enable efficient network operations
3. **Strong Privacy**: Private key and Merkle root remain hidden
4. **Cryptographic Security**: Multiple constraints ensure only legitimate owners can prove ownership

This design reduces costs, improves performance, and makes the system easier to understand and audit while maintaining all necessary security properties. The public difficulty value allows network participants to make informed decisions about plot quality without compromising the privacy of the plot's data structure.