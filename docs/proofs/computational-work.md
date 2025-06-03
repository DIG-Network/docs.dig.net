---
sidebar_position: 4
---

# Computational Work Proof

:::tip 💜 Support the DIG Network
**Help build the future of decentralized storage!** The DIG Network is an open-source project that needs community support to continue development. 

**[💜 Support the Project →](../support.md)** - Donate crypto, buy NFTs, or sponsor development
:::

## Overview

The **Computational Work Proof** is the final piece of the verification puzzle, proving that actual computational effort was invested for **each specific blob** within a specific plot. This proof prevents "work theft" and ensures that storage providers cannot claim rewards without genuinely performing the required computational work for every blob they store.

### Why Per-Blob Computational Proof?

After establishing plot ownership and data inclusion, we still need to prove:

1. **Individual Work Performance**: Real computational effort was expended for this specific blob
2. **Difficulty Achievement**: The work meets the difficulty claimed in the plot
3. **Dual Binding**: The work is permanently bound to BOTH the specific blobHash AND plotId

### Per-Blob Work Architecture

**Each blob gets its own proof of work:**
- ✅ Separate work proof for every blob stored
- ✅ True dual binding to plotId + blobHash  
- ✅ Prevents blob-level work theft
- ✅ Granular security at individual blob level

Without this per-blob approach, malicious actors could:
- Reuse work from different plots or blobs
- Claim higher difficulty than actually achieved  
- Steal computational proofs from other providers
- Perform work once but claim storage for multiple blobs

### Key Design: Dual Cryptographic Binding

The Computational Work Proof creates an unbreakable cryptographic bond between:
- **plotId**: The specific plot containing the data
- **blobHash**: The specific blob being stored

This dual binding ensures that:
1. Work cannot be reused across different plots
2. Work cannot be applied to different blobs
3. Work cannot be stolen or faked

## Proof Structure

The computational work proof reveals the actual work data (but that's secure):

```typescript
interface ComputationalWorkProof {
  nonce: Buffer;                    // The actual nonce found (4-32 bytes)
  plotId: Buffer;                   // PlotId for dual binding (32 bytes)  
  blobHash: Buffer;                 // BlobHash for dual binding (32 bytes)
  tableDataHash: Buffer;            // Table data hash (32 bytes)
  difficulty: number;               // Required difficulty achieved (4 bytes)
  // Total: ~100 bytes
}
```

### Core Security: Work Hash with Dual Binding

The core of the proof is the work hash that binds everything together:

```typescript
workHash = SHA-256(
  tableDataHash +    // Table data being worked on
  nonce +           // The proof-of-work solution
  plotId +          // ★ Binds work to specific plot
  blobHash          // ★ Binds work to specific blob
)
```

This construction ensures work cannot be separated from its context.

## Step-by-Step: How Computational Work Proof Works

Let's walk through exactly how the proof system works, from generating work to verifying it.

### Step 1: Setting Up the Work Challenge

When a storage provider needs to prove computational work for a specific blob:

```typescript
// The challenge parameters are established
const plotId = "0x1234...5678";           // From plot ownership proof
const blobHash = "0xaaaa...bbbb";         // From data inclusion proof  
const tableData = getBlobTableData();     // The actual table containing the blob
const requiredDifficulty = 20;           // From plot ownership proof

// Hash the table data for the proof
const tableDataHash = SHA-256(tableData);
```

### Step 2: Performing the Computational Work

The storage provider must now find a nonce that produces a valid proof-of-work:

```typescript
let nonce = 0;
let attempts = 0;
let workHash: Buffer;
let actualDifficulty: number;

console.log(`🎯 Target: Find hash with ${requiredDifficulty} leading zero bits`);
console.log(`📊 Expected attempts: ~${Math.pow(2, requiredDifficulty).toLocaleString()}`);

// Keep trying nonces until we find one that meets the difficulty
do {
  // Convert nonce to buffer (can be 4-32 bytes)
  const nonceBuffer = Buffer.alloc(4);
  nonceBuffer.writeUInt32BE(nonce, 0);
  
  // ★ CRITICAL: Compute work hash with dual binding
  const input = Buffer.concat([
    tableDataHash,    // What we're working on
    nonceBuffer,      // Our attempt
    plotId,          // ★ Binds to specific plot
    blobHash         // ★ Binds to specific blob
  ]);
  
  workHash = SHA-256(input);
  actualDifficulty = countLeadingZeroBits(workHash);
  attempts++;
  
  // Progress reporting
  if (attempts % 100000 === 0) {
    console.log(`💪 Tried ${attempts.toLocaleString()} nonces...`);
  }
  
  nonce++;
} while (actualDifficulty < requiredDifficulty);

console.log(`✅ Found valid nonce: ${nonce - 1}`);
console.log(`🔥 Achieved difficulty: ${actualDifficulty} (required: ${requiredDifficulty})`);
console.log(`⚡ Total attempts: ${attempts.toLocaleString()}`);
console.log(`🎯 Work hash: ${workHash.toString('hex').substring(0, 32)}...`);
```

### Step 3: Understanding Difficulty

**Difficulty** measures how many leading zero bits the work hash must have:

| Difficulty | Leading Zeros | Average Attempts | Time (3GH/s) |
|------------|---------------|------------------|---------------|
| 10 | 10 bits | 1,024 | 0.3 ms |
| 15 | 15 bits | 32,768 | 11 ms |
| 20 | 20 bits | 1,048,576 | 0.35 seconds |
| 25 | 25 bits | 33,554,432 | 11 seconds |
| 30 | 30 bits | 1,073,741,824 | 6 minutes |

```typescript
function countLeadingZeroBits(hash: Buffer): number {
  let count = 0;
  
  for (let i = 0; i < hash.length; i++) {
    const byte = hash[i];
    if (byte === 0) {
      count += 8;  // All 8 bits are zero
    } else {
      // Count leading zeros in this byte
      let mask = 0x80;  // 10000000
      while (mask > 0 && (byte & mask) === 0) {
        count++;
        mask >>= 1;  // Shift right: 01000000, 00100000, etc.
      }
      break;  // Found a 1 bit, stop counting
    }
  }
  
  return count;
}

// Examples:
// 0x00000123... → 14 leading zero bits
// 0x00012345... → 11 leading zero bits  
// 0x01234567... → 7 leading zero bits
// 0x12345678... → 0 leading zero bits
```

### Step 4: Creating the Proof Package

Once valid work is found, create the proof:

```typescript
const proof: ComputationalWorkProof = {
  nonce: nonceBuffer,
  plotId: plotId,
  blobHash: blobHash,
  tableDataHash: tableDataHash,
  difficulty: actualDifficulty
};

console.log(`📦 Proof size: ${calculateProofSize(proof)} bytes`);
console.log(`🚀 Ready for verification!`);
```

## Verification Process

Validators verify the proof without needing to redo the work:

### Step 1: Validate Proof Structure

```typescript
function validateProofStructure(proof: ComputationalWorkProof): string[] {
  const errors: string[] = [];
  
  if (!proof.nonce || proof.nonce.length < 4) {
    errors.push('Invalid nonce structure');
  }
  if (!proof.plotId || proof.plotId.length !== 32) {
    errors.push('Invalid plotId structure');
  }
  if (!proof.blobHash || proof.blobHash.length !== 32) {
    errors.push('Invalid blobHash structure'); 
  }
  if (!proof.tableDataHash || proof.tableDataHash.length !== 32) {
    errors.push('Invalid tableDataHash structure');
  }
  if (typeof proof.difficulty !== 'number' || proof.difficulty < 0) {
    errors.push('Invalid difficulty value');
  }
  return errors;
}
```

### Step 2: Verify Work Hash

```typescript
function verifyWorkHash(
  proof: ComputationalWorkProof,
  minDifficulty: number
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Compute work hash using the prover's claimed nonce (single computation)
  const input = Buffer.concat([
    proof.tableDataHash,    // Table data being worked on
    proof.nonce,           // The claimed solution nonce
    proof.plotId,          // ★ Must match expected plotId
    proof.blobHash         // ★ Must match expected blobHash
  ]);
  
  const workHash = SHA-256(input);
  const achievedDifficulty = countLeadingZeroBits(workHash);
  
  console.log(`🔍 Computing work hash with provided nonce: ${workHash.toString('hex').substring(0, 32)}...`);
  console.log(`📊 Claimed difficulty: ${proof.difficulty}`);
  console.log(`✅ Actual difficulty achieved: ${achievedDifficulty}`);
  console.log(`🎯 Required minimum difficulty: ${minDifficulty}`);
  
  // Verify difficulty claims (this is why verification is so fast!)
  if (achievedDifficulty < proof.difficulty) {
    errors.push(`Work verification failed: claimed ${proof.difficulty}, actual ${achievedDifficulty}`);
  }
  
  if (proof.difficulty < minDifficulty) {
    errors.push(`Insufficient difficulty: ${proof.difficulty} < ${minDifficulty}`);
  }
  
  return { isValid: errors.length === 0, errors };
}
```

### Step 3: Complete Verification

```typescript
async function verifyComputationalWorkProof(
  proof: ComputationalWorkProof,
  expectedPlotId: Buffer,
  expectedBlobHash: Buffer, 
  minDifficulty: number
): Promise<{ isValid: boolean; errors: string[] }> {
  const errors: string[] = [];
  
  console.log(`🔍 Verifying computational work proof...`);
  console.log(`📊 Expected difficulty: ≥${minDifficulty}`);
  console.log(`🎯 Expected plotId: ${expectedPlotId.toString('hex').substring(0, 16)}...`);
  console.log(`📝 Expected blobHash: ${expectedBlobHash.toString('hex').substring(0, 16)}...`);
  
  // 1. Validate structure
  errors.push(...validateProofStructure(proof));
  
  // 2. Verify dual binding
  if (!proof.plotId.equals(expectedPlotId)) {
    errors.push('Plot binding verification failed - wrong plotId');
  }
  if (!proof.blobHash.equals(expectedBlobHash)) {
    errors.push('Blob binding verification failed - wrong blobHash');
  }
  
  // 3. Verify work was actually performed
  const workResult = verifyWorkHash(proof, minDifficulty);
  errors.push(...workResult.errors);
  
  const isValid = errors.length === 0;
  
  if (isValid) {
    console.log('✅ Computational work proof verified successfully!');
    console.log(`⚡ Proof validated in ~1ms (vs ${Math.pow(2, proof.difficulty)} attempts to generate)`);
  } else {
    console.log('❌ Computational work proof verification failed:');
    errors.forEach(error => console.log(`   • ${error}`));
  }
  
  return { isValid, errors };
}
```

## Security Properties

### What's Proven

The computational work proof establishes:
1. **Work Performance**: Computational cycles were actually spent
2. **Difficulty Achievement**: Work meets the required difficulty level  
3. **Plot Binding**: Work is cryptographically bound to the specific plotId
4. **Blob Binding**: Work is cryptographically bound to the specific blobHash

### Attack Resistance

**Work Theft Prevention**
```typescript
// Attacker tries to use Bob's work for their own plot
// Alice's plot: plotId = 0x1111...
// Bob's work: nonce = 12345, plotId = 0x2222...

// Alice tries to reuse Bob's nonce
const stolenWorkHash = SHA-256(
  tableDataHash + 
  bobsNonce +        // ← Bob's nonce
  alicesPlotId +     // ← Alice's plotId (different!)
  blobHash
);

// This produces a completely different hash!
// Bob's work won't meet difficulty for Alice's plot
// Attack fails automatically due to dual binding
```

**Blob Substitution Prevention**
```typescript
// Attacker tries to apply work to different blob
// Original: work for blobHash = 0xaaaa...
// Attack: try to use same work for blobHash = 0xbbbb...

const originalWorkHash = SHA-256(tableData + nonce + plotId + 0xaaaa...);
const substitutedHash = SHA-256(tableData + nonce + plotId + 0xbbbb...);

// These hashes are completely different!
// The work won't meet difficulty for the different blob
// Attack fails due to blob binding
```

**Difficulty Forgery Prevention**
```typescript
// Attacker claims higher difficulty than achieved
// Real hash: 0x00012345... (11 leading zeros)
// Claimed: 20 bits difficulty

const actualDifficulty = countLeadingZeroBits(workHash); // Returns 11
const claimedDifficulty = 20;

if (actualDifficulty < claimedDifficulty) {
  // Attack detected and rejected
  throw new Error(`Difficulty forgery: claimed ${claimedDifficulty}, actual ${actualDifficulty}`);
}
```

## Integration with Complete Proof Chain

### Three-Proof Verification Flow

The Computational Work Proof completes the verification chain:

```typescript
// 1. Plot Ownership Proof establishes:
//    - Plot X owned by key K
//    - Merkle root R  
//    - Difficulty D

// 2. Data Inclusion Proof establishes:
//    - Blob B exists in merkle tree with root R

// 3. Computational Work Proof establishes:
//    - Work meeting difficulty D was performed
//    - Work is bound to plot X
//    - Work is bound to blob B

// Together they prove:
// "The owner of key K stores blob B in plot X and performed 
//  computational work of difficulty D specifically for that 
//  blob in that plot"
```

### Complete Proof Package

```typescript
const completeProofPackage = {
  // Identity
  plotId: "0x1234...5678",
  blobHash: "0xaaaa...bbbb",
  
  // Plot ownership (signature)
  plotOwnershipProof: {
    publicKey: "0xabcd...",
    merkleRoot: "0x5678...", 
    difficulty: 20,          // ← Used by work proof
    signature: "0x9876...",
    // ...
  },
  
  // Data inclusion (merkle proof)
  dataInclusionProof: {
    merklePath: [...],
    pathDirections: Buffer.from('101011', 'binary'),
    leafIndex: 42,

  },
  
  // Computational work proof
  computationalWorkProof: {
    nonce: Buffer.from([0x00, 0x12, 0x34, 0x56]),
    plotId: "0x1234...5678",     // ← Binds to plotId
    blobHash: "0xaaaa...bbbb",   // ← Binds to blobHash  
    tableDataHash: "0xcdef...",
    difficulty: 22               // ← Achieved difficulty ≥ 20
  }
};
```

## Practical Example

### Charlie Proves Work for Each Blob Individually

Let's walk through how Charlie generates separate proof of work for each blob:

```typescript
// Charlie's plot information
const plotId = Buffer.from('1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', 'hex');
const requiredDifficulty = 20;

// Charlie stores multiple blobs, each getting individual proof of work
const blobs = [
  { id: 'blob_001', data: Buffer.from('First blob data...') },
  { id: 'blob_002', data: Buffer.from('Second blob data...') },
  { id: 'blob_003', data: Buffer.from('Third blob data...') }
];

console.log('🚀 Charlie starts per-blob computational work proof generation...');
console.log(`📊 Target difficulty: ${requiredDifficulty} bits`);
console.log(`📋 Plot ID: ${plotId.toString('hex').substring(0, 16)}...`);
console.log(`📦 Processing ${blobs.length} blobs individually...`);

const blobWorkProofs = [];

// Process each blob individually with its own proof of work
for (const blob of blobs) {
  const blobHash = crypto.createHash('sha256').update(blob.data).digest();
  
  console.log(`\n🔨 Generating proof of work for blob: ${blob.id}`);
  console.log(`📄 Blob hash: ${blobHash.toString('hex').substring(0, 16)}...`);

  // Create table data for this specific blob
  const tableData = Buffer.concat([
    Buffer.from(`table_for_${blob.id}`, 'utf8'),
    blob.data
  ]);
  const tableDataHash = crypto.createHash('sha256').update(tableData).digest();

  // Perform individual proof of work for this blob
  let nonce = 0;
  let attempts = 0;
  let workHash: Buffer;
  let actualDifficulty: number;

  const startTime = Date.now();

  do {
    const nonceBuffer = Buffer.alloc(4);
    nonceBuffer.writeUInt32BE(nonce, 0);
    
    // DUAL BINDING: Work hash includes both plotId and THIS blobHash
    const input = Buffer.concat([
      tableDataHash,    // Table data for THIS specific blob
      nonceBuffer,      // Our proof-of-work attempt  
      plotId,          // ★ Binds to Charlie's plot
      blobHash         // ★ Binds to THIS specific blob
    ]);
    
    workHash = crypto.createHash('sha256').update(input).digest();
    actualDifficulty = countLeadingZeroBits(workHash);
    attempts++;
    
    if (attempts % 50000 === 0) {
      const elapsed = Date.now() - startTime;
      const rate = attempts / (elapsed / 1000);
      console.log(`   💪 ${attempts.toLocaleString()} attempts in ${elapsed}ms (${rate.toFixed(0)} H/s)`);
    }
    
    nonce++;
  } while (actualDifficulty < requiredDifficulty);

  const workTime = Date.now() - startTime;

  console.log(`   ✅ Found valid proof of work for ${blob.id}!`);
  console.log(`   🎯 Final nonce: ${nonce - 1}`);
  console.log(`   🔥 Achieved difficulty: ${actualDifficulty} bits`);
  console.log(`   ⚡ Total attempts: ${attempts.toLocaleString()}`);
  console.log(`   ⏱️  Work time: ${workTime}ms`);

  // Create the proof for this specific blob
  const finalNonce = Buffer.alloc(4);
  finalNonce.writeUInt32BE(nonce - 1, 0);

  const blobProof: ComputationalWorkProof = {
    nonce: finalNonce,
    plotId: plotId,
    blobHash: blobHash,
    tableDataHash: tableDataHash,
    difficulty: actualDifficulty
  };

  blobWorkProofs.push(blobProof);
  console.log(`   📦 Proof created for ${blob.id} (${calculateProofSize(blobProof)} bytes)`);
}

console.log(`\n🎉 All ${blobs.length} blobs processed with individual proof of work!`);
console.log(`📊 Total proofs generated: ${blobWorkProofs.length}`);
console.log(`💾 Total proof storage: ${blobWorkProofs.reduce((sum, p) => sum + calculateProofSize(p), 0)} bytes`);

// Each blob now has its own computational work proof
// Validators can verify each proof individually
for (const proof of blobWorkProofs) {
  const verification = await verifyComputationalWorkProof(
    proof,
    plotId,           // Expected plotId (same for all)
    proof.blobHash,   // Expected blobHash (unique per blob)
    requiredDifficulty
  );

  if (verification.isValid) {
    console.log(`✅ Proof verified for blob with hash ${proof.blobHash.toString('hex').substring(0, 16)}...`);
  } else {
    console.log(`❌ Proof verification failed for blob:`, verification.errors);
  }
}
```

This example shows the complete per-blob flow from individual work generation to verification, demonstrating how:

1. **Each blob gets separate proof of work** - no shared work between blobs
2. **Dual binding prevents work theft** - work cannot be reused across plots or blobs  
3. **Fast verification** - each proof verifies in ~1ms regardless of generation time
4. **Granular security** - compromise of one blob's proof doesn't affect others

## Performance Characteristics

### Work Generation Time

Time to find valid proof depends on difficulty:

| Difficulty | Expected Attempts | Time (1 GH/s) | Time (10 GH/s) |
|------------|------------------|---------------|----------------|
| 16 | 65,536 | 66 ms | 6.6 ms |
| 20 | 1,048,576 | 1.0 second | 105 ms |
| 24 | 16,777,216 | 17 seconds | 1.7 seconds |
| 28 | 268,435,456 | 4.5 minutes | 27 seconds |
| 32 | 4,294,967,296 | 1.2 hours | 7 minutes |

### Verification Speed

- Proof verification: ~1ms (just hash computation)
- Structure validation: ~0.1ms  
- **Total verification: ~1.1ms**

### Proof Size

**Computational Work Proof**: ~100 bytes

This compact size enables efficient storage and network transmission of proofs.

## Summary

The Per-Blob Computational Work Proof provides granular security:

1. **Proves Individual Work**: Computational effort was actually expended for each specific blob
2. **Dual Binding**: Each proof is cryptographically bound to both plotId and specific blobHash  
3. **Fast Verification**: Each proof verifies in ~1ms regardless of generation time
4. **Small Size**: Only ~100 bytes per blob
5. **Simple Implementation**: No circuits, trusted setup, or complex cryptography
6. **Granular Attack Prevention**: Work cannot be stolen, reused, or faked at blob level

### Per-Blob Security Architecture

**Each blob is independently secured:**
- ✅ Individual proof of work for every blob
- ✅ Cannot reuse work across blobs
- ✅ Granular verification and rewards
- ✅ Compromise-resistant (one blob doesn't affect others)

Combined with Plot Ownership and Data Inclusion proofs, this creates a strong chain of evidence:
- **Ownership**: "I own this plot" (signature)
- **Inclusion**: "This specific blob is in my plot" (merkle proof)
- **Work**: "I did computational work specifically for this individual blob in this plot" (per-blob work proof)

However, there is still one critical requirement remaining. We need to prove that the storage provider actually has physical access to their plot data at the time they create the PlotCoin, preventing "precomputation attacks" where providers delete their plots but continue serving cached proofs.

## Next: Proving Physical Access

With the first three proofs complete, we've established:

1. **Plot Ownership**: The plot with ID X is owned by the holder of the private key
2. **Valid Plot Structure**: The plotId is correctly constructed with merkle root Y and difficulty Z  
3. **Data Inclusion**: The blob with hash B exists in the merkle tree with root Y
4. **Computational Work**: Work of difficulty Z was performed specifically for blob B in plot X

However, we still need to prove that the storage provider has current physical access to their stored data. This is critical because:

- **Without access proof**: Providers could delete plot data after generating the above proofs
- **Without freshness**: Old proofs could be replayed indefinitely  
- **Without temporal binding**: Providers could precompute proofs and serve them while not actually storing data

The [Physical Access Proof](./physical-access.md) completes the verification chain by proving:

1. **Current Access**: The provider has physical access to the plot data right now
2. **Freshness**: The proof was generated recently using current blockchain state
3. **Temporal Binding**: The proof is cryptographically bound to recent Chia blockchain data

This ensures that storage providers must maintain actual, current access to their plot data to claim rewards, creating a complete four-proof system that prevents all known attack vectors while maintaining privacy and efficiency.

**The Complete Four-Proof System:**
1. **Plot Ownership Proof** (signature): Proves ownership and plot validity
2. **Data Inclusion Proof** (merkle): Proves blob exists in the plot  
3. **Computational Work Proof** (per-blob work): Proves work was done specifically for each blob
4. **Physical Access Proof** (blockchain-anchored): Proves current physical access to plot data

Together, these four proofs provide complete verification of storage commitment with cryptographic certainty. 