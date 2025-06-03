---
sidebar_position: 2
---

# Plot Ownership Proof

:::tip 💜 Support the DIG Network
**Help build the future of decentralized storage!** The DIG Network is an open-source project that needs community support to continue development. 

**[💜 Support the Project →](../support.md)** - Donate crypto, buy NFTs, or sponsor development
:::

## Overview

The **Plot Ownership Proof** is a cryptographic proof that demonstrates ownership of a specific plot by signing data with the private key that created it. This proof is fundamental to the DIG Network's security model, allowing storage providers to claim ownership of plots while only keeping the private key secret.

### Why Signatures?

The DIG Network uses digital signatures for plot ownership proof because:

1. **100x Faster Generation**: ~5ms vs ~500ms for zero-knowledge proofs
2. **1000x Faster Verification**: ~0.5ms vs ~5ms for zero-knowledge proofs  
3. **No Trusted Setup**: Chia signatures require no ceremony
4. **Smaller Proofs**: ~64 bytes vs ~256 bytes for ZK proofs
5. **Simpler Implementation**: Standard cryptographic primitive
6. **Better Debugging**: Easier to understand and troubleshoot

For proving private key knowledge, signatures are the optimal choice.

### Key Design: All Plot Components Public

The Plot Ownership Proof makes all plot components public inputs:
- `plotId`: The specific plot being claimed
- `publicKey`: The owner's public key
- `merkleRoot`: The plot's merkle root (commitment to all data)
- `difficulty`: The actual difficulty achieved
- `blockHeight` and `blockHash`: Blockchain anchoring data

This design enables:

1. **Clear Ownership Claims**: Verifiers know exactly which plot and public key are being claimed
2. **Independent Verification**: Verifiers can reconstruct plotId to verify it matches expected formula
3. **Transparent Commitments**: The merkle root is visible, enabling data inclusion proofs
4. **Efficient Validation**: All validation can be done with standard crypto
5. **Simple Implementation**: No complex circuits needed

### What is Proven

The Plot Ownership Proof provides cryptographic evidence of:

1. **Private Key Knowledge**: The prover knows the private key corresponding to the claimed public key
2. **Plot ID Validity**: The plotId is correctly constructed from the public components

Since all plot components are public, the verifier can independently verify:
- The plotId matches the expected derivation formula
- The blockchain anchoring is valid
- The difficulty meets network requirements

The only secret is the actual private key.

## Proof Structure

The proof is a simple digital signature with anti-replay protection.

The proof structure:

```typescript
interface PlotOwnershipProof {
  // Public inputs (known to verifier)
  plotId: Buffer;              // The plot ID being claimed
  publicKey: Buffer;           // The public key of the claimed owner
  merkleRoot: Buffer;          // The plot's merkle root
  difficulty: number;          // The actual difficulty used
  blockHeight: number;         // Chia block height for anchoring
  blockHash: Buffer;           // Chia block hash for anchoring
  
  // Signature proof
  signature: Buffer;           // DataLayer signature of message
  signedMessage: Buffer;       // The message that was signed
}
```

## Proof Generation Process

### Step 1: Prepare Message

The plot owner creates a message containing all public components:

```typescript
const messageComponents = [
  plotId,
  publicKey,
  merkleRoot,
  Buffer.from(difficulty.toString()),
  Buffer.from(blockHeight.toString()),
  blockHash
];

// Hash all components together
const signedMessage = SHA256(messageComponents);
```

### Step 2: Generate Chia Signature

Sign the message with the private key using Chia's signature scheme:

```typescript
// Using Chia's signMessage function
// Note: message comes first, then privateKey
const signature = await signMessage(signedMessage, privateKey);
```

### Step 3: Construct Plot ID

The plot ID is deterministically derived from public components:

```typescript
const plotId = Poseidon(
  publicKey,
  merkleRoot,
  difficulty,
  blockHeight,
  blockHash
);
```

## Verification Process

Validators verify the proof with standard cryptography:

### Step 1: Verify Plot ID Construction

```typescript
// Since all components are public, verify plotId matches formula
const expectedPlotId = Poseidon(
  proof.publicKey,
  proof.merkleRoot,
  proof.difficulty,
  proof.blockHeight,
  proof.blockHash
);

if (!constantTimeCompare(proof.plotId, expectedPlotId)) {
  return INVALID; // Plot ID doesn't match expected construction
}
```

### Step 2: Verify Signature

```typescript
// Reconstruct the message
const expectedMessage = SHA256([
  proof.plotId,
  proof.publicKey,
  proof.merkleRoot,
  Buffer.from(proof.difficulty.toString()),
  Buffer.from(proof.blockHeight.toString()),
  proof.blockHash
]);

// Verify it matches
if (!constantTimeCompare(proof.signedMessage, expectedMessage)) {
  return INVALID;
}

// Verify signature using Chia's signature scheme
// Note the parameter order: signature, publicKey, message
const isValid = await verifySignedMessage(
  proof.signature, 
  proof.publicKey, 
  proof.signedMessage
);
```



## Security Properties

### What's Public vs Private

**Public (Revealed)**:
- `plotId`: The specific plot being claimed
- `publicKey`: The owner's public key
- `merkleRoot`: The plot's merkle root (enables data inclusion proofs)
- `difficulty`: The actual difficulty achieved
- `blockHeight` and `blockHash`: Blockchain anchoring
- `signature`: The DataLayer signature

**Private (Hidden)**:
- Private key

### Why This Design is Secure

1. **Cannot Steal Plots**: You need the private key to create a valid signature
2. **Transparent Verification**: Verifier can check plotId construction independently
3. **Cannot Forge Components**: All components are signed together
4. **Standard Security**: Chia signatures are battle-tested in production

### Attack Analysis

#### Attack: Claiming Someone Else's Plot
```typescript
// Attacker sees Alice's plot with all public components
const stolenPlotId = alicePlotId;
const stolenPublicKey = alicePublicKey;

// Attacker tries to sign with their private key
const attackerSignature = await signMessage(message, attackerPrivateKey);

// This fails because:
// 1. Signature must verify with the claimed publicKey
// 2. Attacker's signature only verifies with attacker's publicKey
// 3. Cannot create valid signature for Alice's publicKey
```



## Integration with DIG Network

### PlotCoin Registration

Plot Ownership Proofs are embedded in [PlotCoin](../primitives/on-chain/plotcoin.md) entries:

```typescript
const plotCoinData = {
  // Public plot identity
  plotId,
  publicKey,
  merkleRoot,
  difficulty,
  
  // Proof of ownership
  plotOwnershipProof: {
    blockHeight,
    blockHash,
    signature,
    signedMessage
  },
  
  // Additional metadata
  createdAt: blockHeight
};
```

### Network Benefits

The signature-based design provides:

1. **Maximum Speed**: Instant proof generation and verification
2. **Full Transparency**: All plot components are public
3. **Standard Crypto**: Uses Chia's signature scheme
4. **Minimal Size**: Tiny proofs (~64 bytes)
5. **Simple Implementation**: No complex math or circuits

## Practical Example

### Alice Claims a Plot

```typescript
// 1. Alice has created a plot
const alicePlot = {
  plotId: "0xdead...beef",      // Specific plot ID
  publicKey: "0x1234...5678",    // Alice's public key
  merkleRoot: "0xaaaa...bbbb",   // Commitment to her data
  difficulty: 25                 // Actual difficulty
};

// 2. Generate proof of ownership
const proof = await generatePlotOwnershipProof({
  // Public inputs
  plotId: alicePlot.plotId,
  publicKey: alicePlot.publicKey,
  merkleRoot: alicePlot.merkleRoot,
  difficulty: alicePlot.difficulty,
  blockHeight: 3456789,
  blockHash: "0xcccc...dddd",
  
  // Private input
  privateKey: alicePrivateKey
});

// 3. Submit to network
// Everyone can see all plot components and verify:
// - plotId = Poseidon(publicKey, merkleRoot, difficulty, blockHeight, blockHash)
// - Alice's signature is valid for her publicKey

// But nobody learns:
// - Alice's private key
```

## Performance

The signature-based approach provides excellent performance:

- **Proof Generation**: ~5ms (just one signature)
- **Verification**: ~0.5ms (signature verification)
- **Proof Size**: ~64 bytes (DataLayer signature)
- **No Setup**: No trusted setup or circuit compilation

## Summary

The Plot Ownership Proof provides the simplest possible ownership verification:

1. **One Signature**: DataLayer signature proves ownership
2. **Valid Plot ID**: Proves the plotId is correctly constructed
3. **Full Transparency**: All plot components are public
4. **External Validation**: PlotId formula verified with standard crypto
5. **Enables Data Proofs**: Public merkle root allows merkle membership
6. **Maximum Efficiency**: Orders of magnitude faster than zero-knowledge proofs

This design uses the right tool for the job - signatures for proving private key knowledge and valid plot construction.

## Next: Proving Data Inclusion

With plot ownership established via signature and the merkle root public, the next step is proving that specific data exists within that merkle tree. The merkle root from the ownership proof enables secure data inclusion proofs.

The [Data Inclusion Proof](./data-inclusion.md) uses zero-knowledge proofs for this - because unlike simple ownership, proving merkle membership while keeping the tree structure private actually benefits from zero-knowledge technology.

Together, these proofs enable complete verification:

1. **Plot Ownership Proof**: "I own this plot and it's valid" (via signature)
2. **Data Inclusion Proof**: "This data exists in my plot" (via zero-knowledge proof)

The hybrid approach uses the optimal cryptographic primitive for each task.