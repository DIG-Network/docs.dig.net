---
sidebar_position: 3
---

# Data Inclusion Proof

:::tip 💜 Support the DIG Network
**Help build the future of decentralized storage!** The DIG Network is an open-source project that needs community support to continue development. 

**[💜 Support the Project →](../support.md)** - Donate crypto, buy NFTs, or sponsor development
:::

## Overview

The **Data Inclusion Proof** is a plain merkle proof that demonstrates a specific blob hash exists within a merkle tree. Since the merkle root is already public from the plot ownership proof, a standard merkle proof suffices.

### Key Design: Plain Merkle Proofs

The Data Inclusion Proof uses standard merkle proofs because:

1. **Merkle Root is Public**: The plot ownership proof already reveals the merkle root
2. **Simple and Efficient**: Plain merkle proofs are fast to generate and verify
3. **Well-Understood**: Standard cryptographic primitive with proven security
4. **Sufficient Privacy**: The only revealed information (blob position) isn't sensitive
5. **Optimal for Use Case**: Perfect fit when the root is already known

### What is Proven

The Data Inclusion Proof provides cryptographic evidence that:

1. **Blob Existence**: The blobHash exists as a leaf in the merkle tree
2. **Correct Root**: The merkle path leads to the specified merkle root
3. **Valid Path**: A valid merkle path exists from the blob to the root

The proof reveals:
- The merkle path (sibling hashes)
- The blob's position in the tree
- The path directions

This is acceptable because the merkle root is already public from the plot ownership proof.

## Proof Structure

The proof structure is a standard merkle proof with anti-replay protection:

```typescript
interface DataInclusionProof {
  // Merkle proof components
  merklePath: Buffer[];          // Sibling hashes along path (32 bytes each)
  pathDirections: Buffer;        // Packed bit array (1 bit per level)
  leafIndex: number;             // Position in tree
  

}
```

### Size Analysis

For a 40-level merkle tree (supporting up to 2^40 blobs):
- Merkle path: 32 bytes × 40 = 1,280 bytes
- Path directions: 40 bits = 5 bytes (packed)
- Leaf index: 4 bytes
- **Total: ~1,289 bytes**

This is a reasonable size that:
- Fits in a single network packet
- Is negligible compared to blob data sizes
- Enables instant generation and verification

## Proof Generation Process

### Step 1: Get Merkle Proof from Plot

The plot owner retrieves the merkle proof for the blob:

```typescript
const merkleProof = plot.getMerkleProof(blobId);

// This returns:
// - leafIndex: position of blob in tree
// - siblings: hashes along the path to root
// - path: boolean array of directions
```

### Step 2: Pack Path Directions

Convert the boolean path array to packed bits for efficiency:

```typescript
function packPathDirections(directions: boolean[]): Buffer {
  const byteCount = Math.ceil(directions.length / 8);
  const packed = Buffer.alloc(byteCount);
  
  for (let i = 0; i < directions.length; i++) {
    if (directions[i]) {
      const byteIndex = Math.floor(i / 8);
      const bitIndex = i % 8;
      packed[byteIndex] |= (1 << bitIndex);
    }
  }
  
  return packed;
}
```

### Step 3: Assemble Proof

```typescript
const dataInclusionProof: DataInclusionProof = {
  merklePath: merkleProof.siblings,
  pathDirections: packPathDirections(merkleProof.path),
  leafIndex: merkleProof.leafIndex
};
```

## Verification Process

Verification is straightforward merkle proof validation:

### Step 1: Unpack Path Directions

```typescript
function unpackPathDirections(packed: Buffer, length: number): boolean[] {
  const directions: boolean[] = [];
  
  for (let i = 0; i < length; i++) {
    const byteIndex = Math.floor(i / 8);
    const bitIndex = i % 8;
    directions.push((packed[byteIndex] & (1 << bitIndex)) !== 0);
  }
  
  return directions;
}
```

### Step 2: Compute Merkle Root

```typescript
function computeMerkleRoot(
  leafHash: Buffer,
  leafIndex: number,
  merklePath: Buffer[],
  pathDirections: boolean[]
): Buffer {
  let currentHash = leafHash;
  let currentIndex = leafIndex;

  for (let i = 0; i < merklePath.length; i++) {
    const sibling = merklePath[i];
    const isLeft = (currentIndex % 2) === 0;
    
    // Combine hashes in correct order
    const combined = isLeft
      ? Buffer.concat([currentHash, sibling])
      : Buffer.concat([sibling, currentHash]);
    
    currentHash = SHA256(combined);
    currentIndex = Math.floor(currentIndex / 2);
  }

  return currentHash;
}
```

### Step 3: Verify Root Matches

```typescript
const computedRoot = computeMerkleRoot(
  blobHash,
  proof.leafIndex,
  proof.merklePath,
  pathDirections
);

if (!constantTimeCompare(computedRoot, merkleRoot)) {
  return INVALID; // Computed root doesn't match claimed root
}
```



## Security Properties

### What's Public

Since the merkle root is already public from plot ownership, the data inclusion proof reveals:

1. **Merkle Path**: The sibling hashes along the path
2. **Blob Position**: The leaf index in the tree
3. **Tree Depth**: Implicit from path length

### Why This is Secure

1. **Cannot Fake Inclusion**: Need actual merkle path to compute correct root
2. **Bound to Plot**: Merkle root from plot ownership proof ensures correct tree
3. **Standard Security**: Merkle proofs are cryptographically sound

### Privacy Considerations

Using plain merkle proofs reveals:
- **Blob Position**: The exact index where the blob is stored
- **Tree Structure**: Partial view of the merkle tree via sibling hashes
- **Tree Fullness**: Can infer how many blobs are in the tree

This is acceptable because:
1. The merkle root is already public
2. Blob positions aren't sensitive information
3. Tree structure provides minimal advantage to attackers
4. The efficiency gains are significant

## Integration with Proof Package

### Complete Proof Package

Data Inclusion Proofs combine with Plot Ownership Proofs:

```typescript
const proofPackage = {
  // Blob identity
  blobId,           // Unique identifier
  blobHash,         // Hash of blob data
  
  // Plot identity
  plotId,           // The plot containing this blob
  publicKey,        // Owner's public key
  merkleRoot,       // The plot's merkle root (public)
  difficulty,       // Actual difficulty achieved
  
  // Proof of plot ownership (signature)
  plotOwnershipProof: {
    blockHeight,    // Chia block height for anchoring
    blockHash,      // Chia block hash for anchoring
    signature,      // ECDSA signature
    signedMessage,  // Message that was signed
    timestamp       // When proof was created
  },
  
  // Proof of blob inclusion (plain merkle proof)
  dataInclusionProof: {
    merklePath,     // Sibling hashes
    pathDirections, // Packed bit array
    leafIndex       // Position in tree
  },
  
  proofVersion: 'HYBRID-SIG-MERKLE-1.0'
};
```

### Verification Flow

```typescript
// 1. Verify plot ownership
const plotOwnershipValid = await verifyPlotOwnershipProof(
  proofPackage.plotOwnershipProof,
  plotId,
  publicKey,
  merkleRoot,  // This establishes the merkle root
  difficulty
);

// 2. Verify blob inclusion using the established merkle root
const computedRoot = computeMerkleRoot(
  blobHash,
  proofPackage.dataInclusionProof.leafIndex,
  proofPackage.dataInclusionProof.merklePath,
  unpackPathDirections(proofPackage.dataInclusionProof.pathDirections)
);

const blobInclusionValid = constantTimeCompare(computedRoot, merkleRoot);

// 3. Both must be valid
return plotOwnershipValid && blobInclusionValid;
```

## Practical Example

### Alice Proves Blob Storage

```typescript
// 1. Alice has already proven she owns a plot
const plotOwnershipProof = await generatePlotOwnershipProof({
  privateKey: alicePrivateKey,
  publicKey: alicePublicKey,
  plotId: "0x1234...5678",
  merkleRoot: "0xmmmm...nnnn",  // This becomes public
  difficulty: 25,
  blockHeight: 3456789,
  blockHash: "0xcccc...dddd"
});

// 2. Now Alice proves a specific blob is in that plot's merkle tree
const blobToProve = {
  blobId: "blob123",
  blobHash: "0xaaaa...bbbb"
};

// 3. Get merkle proof from plot
const merkleProof = alicePlot.getMerkleProof(blobToProve.blobId);
// Returns: { leafIndex: 42, siblings: [...], path: [0,1,0,1,...] }

// 4. Generate inclusion proof
const inclusionProof = {
  merklePath: merkleProof.siblings,
  pathDirections: packPathDirections(merkleProof.path),
  leafIndex: merkleProof.leafIndex
};

// 5. Validators verify:
// - Alice owns plot 0x1234...5678 with merkle root 0xmmmm...nnnn
// - Blob 0xaaaa...bbbb is at position 42 in that merkle tree
// - The merkle path leads from blob to the public root

// Validators learn:
// - The blob's exact position (42)
// - The sibling hashes along the path
// - That the tree has at least 42 blobs

// But this information isn't sensitive since:
// - They already know the merkle root
// - Blob positions don't reveal content
// - Tree structure provides no attack advantage
```

## Performance

Plain merkle proofs provide excellent performance:

- **Proof Generation**: ~1ms (just path extraction)
- **Verification**: ~0.5ms (hash computations)
- **Proof Size**: ~1.3KB for 40-level tree
- **No Setup**: No trusted setup or circuits

Performance characteristics:
- **Instant Generation**: No complex computations needed
- **Fast Verification**: Just hash operations
- **Linear Scaling**: Performance scales with tree depth
- **Network Friendly**: Single packet transmission

## Summary

The Data Inclusion Proof uses plain merkle proofs for optimal efficiency:

1. **Simple**: Standard merkle proof algorithm
2. **Fast**: Instant generation and verification
3. **Secure**: Cryptographically sound with the public merkle root
4. **Practical**: Reasonable size even for large trees
5. **Compatible**: Works seamlessly with public merkle roots

This design recognizes that once the merkle root is public (from plot ownership), plain merkle proofs are the optimal choice. The slight information disclosure (blob positions) is acceptable given the massive performance and simplicity gains.

Together with the Plot Ownership Proof, this provides complete storage verification:

1. **Plot Ownership**: "I own this plot with merkle root X" (signature)
2. **Data Inclusion**: "Blob Y is in the tree with root X" (merkle proof)

The hybrid approach uses the optimal cryptographic primitive for each task.

## Next: Proving Computational Work

With the first two proofs complete, we've established:

1. **Plot Ownership**: The plot with ID X is owned by the holder of the private key
2. **Valid Plot Structure**: The plotId is correctly constructed with merkle root Y and difficulty Z
3. **Data Inclusion**: The blob with hash B exists in the merkle tree with root Y

However, we still need to prove that the storage provider has invested computational effort specifically for this blob within this plot. This is critical because:

- **Without work proof**: Anyone could claim to store data without actually doing the work
- **Without binding**: Work could be reused across different blobs or plots
- **Without difficulty verification**: Providers could claim higher difficulty than achieved

The [Computational Work Proof](./computational-work.md) completes the verification chain by proving:

1. **Difficulty Match**: The work meets the difficulty Z claimed in the plot ownership proof
2. **Work Performance**: Actual computational effort was expended
3. **Dual Binding**: The work is cryptographically bound to BOTH the specific blobHash B AND plotId X

This ensures that computational work cannot be stolen, reused, or faked. The work is permanently bound to this specific blob within this specific plot, creating an unforgeable proof of storage commitment. 