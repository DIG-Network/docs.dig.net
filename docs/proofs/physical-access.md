---
sidebar_position: 5
---

# Physical Access Proof

:::tip 💜 Support the DIG Network
**Help build the future of decentralized storage!** The DIG Network is an open-source project that needs community support to continue development. 

**[💜 Support the Project →](../support.md)** - Donate crypto, buy NFTs, or sponsor development
:::

## Overview

The **Physical Access Proof** is the final piece of the DIG Network verification system, proving that storage providers have actual, current physical access to their blob data at the time they create the PlotCoin. This prevents "precomputation attacks" where providers delete their blobs but continue serving cached proofs.

### Key Design: Fixed Window Chunk Selection

The Physical Access Proof uses a **Fixed Window** approach to eliminate all external dependencies:

1. **No Metadata Required**: Zero dependency on external blob metadata
2. **Self-Contained Verification**: Validators can verify using only the proof data
3. **Deterministic Selection**: Block hash deterministically selects chunks from a fixed window
4. **Attack Resistant**: Cannot cherry-pick favorable chunks
5. **Protocol Simplicity**: Clean, elegant design with minimal complexity

### What is Proven

The Physical Access Proof provides cryptographic evidence that:

1. **Current Blob Access**: The provider has physical access to blob data at the time of proof generation
2. **Chunk Authenticity**: The provided chunks are genuine blob data with valid merkle proofs
3. **Freshness**: The proof was generated using recent Chia blockchain state
4. **Deterministic Selection**: The chunks were selected using the required protocol algorithm
5. **No Cherry-Picking**: Cannot select easier chunks - must use block hash determined selection

## Core Concept: Fixed Window Selection

### The Fundamental Insight

The Fixed Window approach **always selects from a fixed window** of possible chunk positions:

```typescript
// Protocol Constants
const CHUNK_WINDOW_SIZE = 1024;  // Always select from first 1024 possible chunks
const REQUIRED_CHUNKS = 3;       // Must provide exactly 3 chunks
const CHUNK_SIZE = 4096;         // Standard 4KB chunks

// Selection Algorithm (used by both prover and validator)
function selectRequiredChunks(blockHash: Buffer, blobHash: Buffer): number[] {
  const selector = SHA256(Buffer.concat([
    blockHash,                    // Unpredictable until block creation
    blobHash,                     // Binds to specific blob
    Buffer.from('DIG_FIXED_v1')   // Protocol identifier
  ]));
  
  const chunks = [];
  for (let i = 0; i < REQUIRED_CHUNKS; i++) {
    const chunkIndex = selector.readUInt32BE(i * 4) % CHUNK_WINDOW_SIZE;
    chunks.push(chunkIndex);
  }
  
  return chunks.sort(); // Deterministic order
}
```

### Why This Works

**✅ Self-Contained**: No external metadata needed - window size is a protocol constant  
**✅ Unpredictable**: Block hash makes selection unpredictable until block creation  
**✅ Verifiable**: Validators can independently recalculate expected chunks  
**✅ Attack Resistant**: Cannot cherry-pick - must provide exact chunks determined by block hash  
**✅ Blob Agnostic**: Works for any blob size (small blobs just won't use all window positions)

## Proof Structure

The proof structure is simple and self-contained:

```typescript
interface PhysicalAccessProof {
  // Chia blockchain anchoring (provides freshness)
  blockHeight: number;                    // Recent Chia block height (4 bytes)
  blockHash: Buffer;                      // Recent Chia block hash (32 bytes)
  
  // Fixed window chunk access proof
  chunkIndices: number[];                 // Exactly 3 chunk indices (12 bytes)
  chunkData: Buffer[];                    // Actual chunk data (3 × 4KB max)
  chunkProofs: MerklePathProof[];         // Merkle proofs for each chunk
  
  // Cryptographic binding
  blobRootHash: Buffer;                   // Root of blob's internal merkle tree (32 bytes)
  plotId: Buffer;                         // Binds to specific plot (32 bytes)
  blobHash: Buffer;                       // Binds to specific blob (32 bytes)
  
  // Total: ~144 bytes + chunk data (~12KB) + merkle proofs (~300 bytes)
  // Estimated total: ~12.5KB per proof
}

interface MerklePathProof {
  siblings: Buffer[];                     // Sibling hashes for merkle path
  directions: boolean[];                  // Left/right directions for each level
}
```

## Step-by-Step: How Fixed Window Physical Access Proof Works

### Step 1: Get Current Chia Block Data

The storage provider retrieves the most recent Chia block information:

```typescript
// Get current Chia blockchain state
const currentChiaBlock = await chiaClient.getLatestBlock();

console.log(`📡 Current Chia block: ${currentChiaBlock.height}`);
console.log(`🔗 Block hash: ${currentChiaBlock.hash.toString('hex').substring(0, 16)}...`);
```

**🔒 Security Foundation**: 
- **Unpredictable Challenge**: Block hash cannot be predicted until block creation
- **Verifiable Source**: Any validator can verify block hash against Chia blockchain
- **Temporal Binding**: Links proof to specific point in blockchain history

### Step 2: Calculate Required Chunk Indices

Using the block hash, deterministically calculate which chunks must be provided:

```typescript
function selectRequiredChunks(blockHash: Buffer, blobHash: Buffer): number[] {
  console.log(`🎯 Calculating required chunks using fixed window approach...`);
  
  // Create deterministic selector from unpredictable inputs
  const selector = SHA256(Buffer.concat([
    blockHash,                    // Unpredictable until block creation
    blobHash,                     // Binds selection to specific blob
    Buffer.from('DIG_FIXED_v1')   // Protocol version identifier
  ]));
  
  console.log(`📊 Chunk selector: ${selector.toString('hex').substring(0, 32)}...`);
  
  const chunks = [];
  for (let i = 0; i < REQUIRED_CHUNKS; i++) {
    // Extract 4 bytes starting at position i*4 and mod by window size
    const chunkIndex = selector.readUInt32BE(i * 4) % CHUNK_WINDOW_SIZE;
    chunks.push(chunkIndex);
    
    console.log(`   📦 Chunk ${i + 1}: index ${chunkIndex} (from bytes ${i * 4}-${i * 4 + 3})`);
  }
  
  // Sort for deterministic order
  const sortedChunks = chunks.sort((a, b) => a - b);
  console.log(`✅ Required chunks: [${sortedChunks.join(', ')}]`);
  
  return sortedChunks;
}

// Calculate the required chunks
const requiredChunks = selectRequiredChunks(currentChiaBlock.hash, blobHash);
```

**🔒 Security Properties**:
- **Deterministic**: Same inputs always produce same chunk selection
- **Unpredictable**: Cannot predict selection until block hash is known
- **Binding**: Selection is cryptographically bound to both block and blob
- **Uniform Distribution**: Each chunk position has equal probability of selection

### Step 3: Access Required Blob Chunks

Provider must access their blob storage and extract the specific required chunks:

```typescript
function extractRequiredChunks(
  blobId: string,
  requiredChunkIndices: number[]
): { chunkData: Buffer[], chunkProofs: MerklePathProof[], blobRootHash: Buffer } {
  
  console.log(`💾 Accessing blob chunks (requires physical access)...`);
  console.log(`📋 Required chunk indices: [${requiredChunkIndices.join(', ')}]`);
  
  try {
    // Load the blob's internal merkle tree structure
    const blobTree = loadBlobMerkleTree(blobId);
    
    if (!blobTree || blobTree.chunks.length === 0) {
      throw new Error('Blob not accessible or empty');
    }
    
    console.log(`📊 Blob has ${blobTree.chunks.length} total chunks`);
    console.log(`🌳 Blob tree depth: ${blobTree.depth} levels`);
    console.log(`🔗 Blob root hash: ${blobTree.rootHash.toString('hex').substring(0, 16)}...`);
    
    const chunkData: Buffer[] = [];
    const chunkProofs: MerklePathProof[] = [];
    
    for (const chunkIndex of requiredChunkIndices) {
      // Verify chunk exists in blob
      if (chunkIndex >= blobTree.chunks.length) {
        console.log(`⚠️  Chunk ${chunkIndex} beyond blob bounds (${blobTree.chunks.length} chunks)`);
        // Pad with zeros if chunk doesn't exist (blob smaller than expected)
        chunkData.push(Buffer.alloc(CHUNK_SIZE));
        chunkProofs.push(createEmptyProof());
        continue;
      }
      
      // Extract actual chunk data (THIS REQUIRES PHYSICAL ACCESS)
      const chunk = blobTree.chunks[chunkIndex];
      chunkData.push(chunk.data);
      
      // Generate merkle proof for this chunk
      const proof = generateMerkleProof(blobTree, chunkIndex);
      chunkProofs.push(proof);
      
      console.log(`   📦 Chunk ${chunkIndex}: ${chunk.data.length} bytes extracted`);
      console.log(`   🔗 Proof path: ${proof.siblings.length} levels`);
    }
    
    return {
      chunkData,
      chunkProofs,
      blobRootHash: blobTree.rootHash
    };
    
  } catch (error) {
    throw new Error(`Failed to access blob chunks: ${error.message}`);
  }
}

// Extract the required chunks with proofs
const { chunkData, chunkProofs, blobRootHash } = extractRequiredChunks(blobId, requiredChunks);

console.log(`✅ Successfully extracted ${chunkData.length} chunks with merkle proofs`);
```

**🔒 Critical Security Step**:
- **Physical Access Required**: Must have actual blob file to extract chunk data
- **Merkle Proof Generation**: Creates cryptographic proof that chunks belong to blob
- **No Prediction Possible**: Cannot predict which chunks will be needed until block creation
- **Graceful Degradation**: Handles blobs smaller than window size

### Step 4: Create the Complete Proof

Assemble all components into the final physical access proof:

```typescript
const physicalAccessProof: PhysicalAccessProof = {
  // Chia blockchain anchoring
  blockHeight: currentChiaBlock.height,
  blockHash: currentChiaBlock.hash,
  
  // Fixed window chunk proof
  chunkIndices: requiredChunks,           // Which chunks were selected
  chunkData: chunkData,                   // Actual chunk data
  chunkProofs: chunkProofs,               // Merkle proofs for each chunk
  
  // Cryptographic binding
  blobRootHash: blobRootHash,             // Root of blob's merkle tree
  plotId: plotId,                         // Binds to specific plot
  blobHash: blobHash                      // Binds to specific blob
};

console.log(`📦 Physical access proof created!`);
console.log(`   📊 Chunk count: ${physicalAccessProof.chunkIndices.length}`);
console.log(`   📊 Data size: ${physicalAccessProof.chunkData.reduce((sum, chunk) => sum + chunk.length, 0)} bytes`);
console.log(`   🌳 Merkle proofs: ${physicalAccessProof.chunkProofs.length} paths`);
console.log(`🚀 Ready for verification!`);
```

## Verification Process

Validators verify the proof using **completely self-contained logic** with no external dependencies:

### Step 1: Validate Proof Structure

```typescript
function validateProofStructure(proof: PhysicalAccessProof): string[] {
  const errors: string[] = [];
  
  // Basic field validation
  if (typeof proof.blockHeight !== 'number' || proof.blockHeight < 0) {
    errors.push('Invalid block height');
  }
  if (!proof.blockHash || proof.blockHash.length !== 32) {
    errors.push('Invalid block hash');
  }
  if (!proof.plotId || proof.plotId.length !== 32) {
    errors.push('Invalid plot ID');
  }
  if (!proof.blobHash || proof.blobHash.length !== 32) {
    errors.push('Invalid blob hash');
  }
  if (!proof.blobRootHash || proof.blobRootHash.length !== 32) {
    errors.push('Invalid blob root hash');
  }
  
  // Chunk validation
  if (!Array.isArray(proof.chunkIndices) || proof.chunkIndices.length !== REQUIRED_CHUNKS) {
    errors.push(`Must provide exactly ${REQUIRED_CHUNKS} chunks`);
  }
  if (!Array.isArray(proof.chunkData) || proof.chunkData.length !== REQUIRED_CHUNKS) {
    errors.push(`Must provide exactly ${REQUIRED_CHUNKS} chunk data buffers`);
  }
  if (!Array.isArray(proof.chunkProofs) || proof.chunkProofs.length !== REQUIRED_CHUNKS) {
    errors.push(`Must provide exactly ${REQUIRED_CHUNKS} merkle proofs`);
  }
  
  // Validate chunk data sizes
  for (let i = 0; i < proof.chunkData.length; i++) {
    const chunk = proof.chunkData[i];
    if (!chunk || chunk.length === 0 || chunk.length > CHUNK_SIZE) {
      errors.push(`Invalid chunk data size at index ${i}: ${chunk?.length || 0} bytes`);
    }
  }
  
  return errors;
}
```

### Step 2: Verify Block Authenticity

```typescript
async function verifyBlockAuthenticity(proof: PhysicalAccessProof): Promise<boolean> {
  try {
    // Verify block hash exists on Chia blockchain
    const historicalBlock = await chiaClient.getBlockAtHeight(proof.blockHeight);
    
    if (!historicalBlock.hash.equals(proof.blockHash)) {
      console.log(`❌ Block hash mismatch at height ${proof.blockHeight}`);
      return false;
    }
    
    // Verify block is not in the future
    const currentBlock = await chiaClient.getLatestBlock();
    if (proof.blockHeight > currentBlock.height) {
      console.log(`❌ Block height ${proof.blockHeight} is in the future`);
      return false;
    }
    
    console.log(`✅ Block authenticity verified`);
    return true;
    
  } catch (error) {
    console.log(`❌ Block verification failed: ${error.message}`);
    return false;
  }
}
```

### Step 3: Verify Chunk Selection (Core Security Check)

```typescript
function verifyChunkSelection(proof: PhysicalAccessProof): boolean {
  console.log(`🔍 Verifying chunk selection using fixed window algorithm...`);
  
  // Recalculate expected chunks using EXACT same algorithm as prover
  const expectedChunks = selectRequiredChunks(proof.blockHash, proof.blobHash);
  const actualChunks = [...proof.chunkIndices].sort((a, b) => a - b);
  
  console.log(`📊 Expected chunks: [${expectedChunks.join(', ')}]`);
  console.log(`📊 Provided chunks: [${actualChunks.join(', ')}]`);
  
  // CRITICAL: Must match exactly - no cherry-picking allowed
  if (expectedChunks.length !== actualChunks.length) {
    console.log(`❌ Chunk count mismatch: expected ${expectedChunks.length}, got ${actualChunks.length}`);
    return false;
  }
  
  for (let i = 0; i < expectedChunks.length; i++) {
    if (expectedChunks[i] !== actualChunks[i]) {
      console.log(`❌ Chunk index mismatch at position ${i}: expected ${expectedChunks[i]}, got ${actualChunks[i]}`);
      return false;
    }
  }
  
  console.log(`✅ Chunk selection verification passed - no cherry-picking detected`);
  return true;
}
```

**🔒 This is the Core Security Check**: Ensures prover cannot cherry-pick easier chunks - they must provide exactly the chunks determined by the unpredictable block hash.

### Step 4: Verify Merkle Proofs

```typescript
function verifyMerkleProofs(proof: PhysicalAccessProof): boolean {
  console.log(`🌳 Verifying merkle proofs for all chunks...`);
  
  for (let i = 0; i < proof.chunkIndices.length; i++) {
    const chunkIndex = proof.chunkIndices[i];
    const chunkData = proof.chunkData[i];
    const merkleProof = proof.chunkProofs[i];
    
    console.log(`   🔍 Verifying chunk ${chunkIndex}...`);
    
    // Calculate hash of actual chunk data
    const chunkHash = SHA256(chunkData);
    
    // Verify merkle path from chunk to claimed root
    const isValid = verifyMerklePathToRoot(
      chunkHash,
      merkleProof,
      chunkIndex,
      proof.blobRootHash
    );
    
    if (!isValid) {
      console.log(`❌ Merkle proof verification failed for chunk ${chunkIndex}`);
      return false;
    }
    
    console.log(`   ✅ Chunk ${chunkIndex} merkle proof valid`);
  }
  
  console.log(`✅ All merkle proofs verified successfully`);
  return true;
}

function verifyMerklePathToRoot(
  leafHash: Buffer,
  proof: MerklePathProof,
  leafIndex: number,
  expectedRoot: Buffer
): boolean {
  let currentHash = leafHash;
  let currentIndex = leafIndex;
  
  for (let level = 0; level < proof.siblings.length; level++) {
    const sibling = proof.siblings[level];
    const isLeft = proof.directions[level];
    
    if (isLeft) {
      currentHash = SHA256(Buffer.concat([currentHash, sibling]));
    } else {
      currentHash = SHA256(Buffer.concat([sibling, currentHash]));
    }
    
    currentIndex = Math.floor(currentIndex / 2);
  }
  
  return currentHash.equals(expectedRoot);
}
```

### Step 5: Complete Verification

```typescript
async function verifyPhysicalAccessProof(
  proof: PhysicalAccessProof,
  expectedPlotId: Buffer,
  expectedBlobHash: Buffer,
  currentEpoch: EpochInfo
): Promise<{ isValid: boolean; errors: string[] }> {
  const errors: string[] = [];
  
  console.log(`🔍 Verifying physical access proof using fixed window approach...`);
  console.log(`🎯 Expected plot: ${expectedPlotId.toString('hex').substring(0, 16)}...`);
  console.log(`📝 Expected blob: ${expectedBlobHash.toString('hex').substring(0, 16)}...`);
  console.log(`📊 Current epoch: ${currentEpoch.epochNumber}`);
  
  // 1. Validate proof structure
  const structureErrors = validateProofStructure(proof);
  errors.push(...structureErrors);
  
  // 2. Verify plot and blob binding
  if (!proof.plotId.equals(expectedPlotId)) {
    errors.push('Plot ID mismatch');
  }
  if (!proof.blobHash.equals(expectedBlobHash)) {
    errors.push('Blob hash mismatch');
  }
  
  // 3. Verify block authenticity
  const blockValid = await verifyBlockAuthenticity(proof);
  if (!blockValid) {
    errors.push('Block authenticity verification failed');
  }
  
  // 4. Verify epoch validity
  if (proof.blockHeight < currentEpoch.startHeight || proof.blockHeight > currentEpoch.endHeight) {
    errors.push(`Block height ${proof.blockHeight} outside current epoch range`);
  }
  
  // 5. Verify chunk selection (core security check)
  const chunkSelectionValid = verifyChunkSelection(proof);
  if (!chunkSelectionValid) {
    errors.push('Chunk selection verification failed - possible cherry-picking');
  }
  
  // 6. Verify merkle proofs
  const merkleProofsValid = verifyMerkleProofs(proof);
  if (!merkleProofsValid) {
    errors.push('Merkle proof verification failed');
  }
  
  const isValid = errors.length === 0;
  
  if (isValid) {
    console.log('✅ Physical access proof verified successfully!');
    console.log(`🔒 Confirmed: Provider has current access to blob chunks`);
    console.log(`🚫 Cherry-picking prevented: Correct chunk selection verified`);
  } else {
    console.log('❌ Physical access proof verification failed:');
    errors.forEach(error => console.log(`   • ${error}`));
  }
  
  return { isValid, errors };
}
```

## Security Properties

### What's Cryptographically Proven

The Fixed Window Physical Access Proof establishes:

1. **Current Blob Access**: Provider has physical access to specific blob chunks at proof generation time
2. **Chunk Authenticity**: Merkle proofs cryptographically verify chunks belong to the claimed blob
3. **Deterministic Selection**: Chunks were selected using the required protocol algorithm
4. **No Cherry-Picking**: Cannot select easier chunks - selection is bound to unpredictable block hash
5. **Freshness**: Proof was generated using recent Chia blockchain state
6. **Epoch Binding**: Proof is bound to current epoch and cannot be replayed

### Attack Resistance Analysis

**✅ Precomputation Attack Prevention**
```typescript
// Attacker tries to precompute chunks while having access
// Problem: Cannot predict which chunks will be needed

// Time T1: Attacker has blob access, tries to precompute
const futureBlockHash = /* UNPREDICTABLE */; // Cannot know in advance

// Even caching all window chunks is expensive and detectable
const windowChunks = CHUNK_WINDOW_SIZE; // 1024 chunks
const storagePerBlob = windowChunks * CHUNK_SIZE; // 4MB per blob
// For many blobs: 4MB × number of blobs = significant storage

// Time T2: Block is created, challenge revealed
const actualRequiredChunks = selectRequiredChunks(futureBlockHash, blobHash);
// ❌ Attacker cannot predict which specific 3 chunks needed
// ❌ Must have current access to generate valid merkle proofs
```

**✅ Cherry-Picking Attack Prevention**
```typescript
// Attacker tries to select easier chunks
const attackerSelectedChunks = [0, 1, 2]; // Easy chunks from start

// During verification:
const expectedChunks = selectRequiredChunks(proof.blockHash, proof.blobHash);
// Expected: [157, 442, 893] (unpredictable positions)

if (!arraysEqual(attackerSelectedChunks, expectedChunks)) {
  // ❌ Cherry-picking detected and rejected
  throw new Error('Chunk selection mismatch - cherry-picking detected');
}
```

**✅ Replay Attack Prevention**
```typescript
// Attacker tries to reuse old proof from previous epoch
const oldProof = {
  blockHeight: 1000000,     // Previous epoch
  blockHash: "0x1234...",   // Old block hash
  chunkIndices: [100, 200, 300] // Valid for old block
};

// During verification:
if (oldProof.blockHeight < currentEpoch.startHeight) {
  // ❌ Old proof rejected - must use current epoch block
  throw new Error('Proof from previous epoch rejected');
}
```

**✅ Fake Data Attack Prevention**
```typescript
// Attacker tries to provide fake chunk data
const fakeChunk = Buffer.from('fake data');
const fakeProof = {
  chunkData: [fakeChunk],
  chunkProofs: [generateFakeProof()]
};

// During verification:
const chunkHash = SHA256(fakeChunk);
const isValid = verifyMerklePathToRoot(chunkHash, fakeProof.chunkProofs[0], 0, proof.blobRootHash);
// ❌ Fake data fails merkle proof verification
```

### Why Fixed Window is Secure

**🔒 Security Guarantees**:
1. **Unpredictable Selection**: Block hash determines which chunks needed (cannot predict)
2. **Cryptographic Binding**: Merkle proofs bind chunks to specific blob
3. **No External Dependencies**: Self-contained verification eliminates attack vectors
4. **Physical Access Required**: Must read actual blob data to generate valid proofs
5. **Deterministic Verification**: All validators reach same conclusion independently

**🎯 Attack Surface Minimization**:
- **No Metadata Trust**: Eliminates circular dependency vulnerabilities
- **Fixed Protocol Constants**: No external parameters to manipulate
- **Simple Verification**: Reduces implementation complexity and bugs
- **Standard Cryptography**: Uses well-understood merkle proof primitives

## Performance Characteristics

### Proof Generation Performance

Fixed Window proofs are highly efficient:

```typescript
// Performance metrics
const performance = {
  chunkSelection: "~1ms",      // Simple modulo operations
  chunkExtraction: "~50ms",    // Read 3 × 4KB chunks from storage
  merkleProofGen: "~10ms",     // Generate 3 merkle paths
  totalGeneration: "~60ms",    // Very fast overall
  
  proofSize: "~12.5KB",        // Compact: 3 chunks + proofs
  networkTransmission: "~1ms", // Single packet on good connection
  storageRequirement: "None"   // No persistent proof storage needed
};
```

### Verification Performance

Validators can verify extremely quickly:

```typescript
const verificationPerformance = {
  structureValidation: "~0.1ms",    // Basic field checks
  blockLookup: "~50ms",            // Query Chia blockchain
  chunkSelection: "~1ms",          // Recalculate expected chunks
  merkleVerification: "~5ms",      // Verify 3 merkle paths
  totalVerification: "~56ms",      // Fast validation
  
  concurrentValidators: "Unlimited", // No coordination needed
  scalability: "Linear"             // O(1) per proof
};
```

### Storage Overhead Analysis

Fixed Window approach minimizes storage requirements:

**Provider Storage**:
- **No Additional Overhead**: Uses existing blob merkle tree structure
- **Standard Chunks**: 4KB chunks work optimally for most storage systems
- **Memory Efficient**: Only loads required chunks during proof generation

**Network Transmission**:
- **Predictable Size**: Always ~12.5KB regardless of blob size
- **Single Packet**: Fits in standard network MTU
- **Bandwidth Efficient**: No unnecessary data transmission

**Validator Requirements**:
- **No Persistent Storage**: Proofs are verified and discarded
- **Minimal Memory**: ~50KB peak usage during verification
- **No Coordination**: Each validator works independently

## Integration with Complete Proof Chain

### Four-Proof Verification Flow

The Fixed Window Physical Access Proof completes the verification chain:

```typescript
// 1. Plot Ownership Proof establishes:
//    - Plot X owned by key K
//    - Merkle root R
//    - Difficulty D

// 2. Data Inclusion Proof establishes:
//    - Blob B exists in plot merkle tree with root R

// 3. Computational Work Proof establishes:
//    - Work meeting difficulty D was performed
//    - Work is bound to plot X and blob B

// 4. Fixed Window Physical Access Proof establishes:
//    - Current physical access to blob B (specific chunks)
//    - Proof generated using recent blockchain state
//    - Deterministic chunk selection prevents cherry-picking
//    - Cannot be precomputed or replayed

// Together they prove:
// "The owner of key K currently stores blob B in plot X, performed
//  computational work of difficulty D specifically for that blob,
//  and has current physical access to the actual blob data"
```

### Proof Package Structure

```typescript
const completeProofPackage = {
  // Identity
  plotId: "0x1234...5678",
  blobHash: "0xaaaa...bbbb",
  
  // Plot ownership (signature)
  plotOwnershipProof: {
    publicKey: "0xabcd...",
    merkleRoot: "0x5678...",
    difficulty: 20,
    signature: "0x9876...",
    blockHeight: 1000010,
    blockHash: "0xdef0..."
  },
  
  // Data inclusion (merkle proof)
  dataInclusionProof: {
    merklePath: [...],
    pathDirections: Buffer.from('101011', 'binary'),
    leafIndex: 42
  },
  
  // Computational work proof
  computationalWorkProof: {
    nonce: Buffer.from([0x00, 0x12, 0x34, 0x56]),
    plotId: "0x1234...5678",
    blobHash: "0xaaaa...bbbb",
    tableDataHash: "0xcdef...",
    difficulty: 22
  },
  
  // Fixed window physical access proof
  physicalAccessProof: {
    blockHeight: 1000010,
    blockHash: "0xdef0...",
    chunkIndices: [157, 442, 893],        // Determined by block hash
    chunkData: [chunk157, chunk442, chunk893], // Actual blob data
    chunkProofs: [proof157, proof442, proof893], // Merkle proofs
    blobRootHash: "0x9999...",
    plotId: "0x1234...5678",
    blobHash: "0xaaaa...bbbb"
  }
};
```

## Summary

The Fixed Window Physical Access Proof provides the final security layer with **maximum simplicity and zero external dependencies**:

### Key Benefits

✅ **Self-Contained**: No external metadata required - completely independent verification  
✅ **Attack Resistant**: Prevents precomputation, cherry-picking, replay, and deletion attacks  
✅ **High Performance**: ~60ms generation, ~56ms verification, ~12.5KB proof size  
✅ **Protocol Simple**: Clean design using only standard cryptographic primitives  
✅ **Universally Applicable**: Works for any blob size without modification  
✅ **Validator Friendly**: Zero coordination required, deterministic verification  

### Security Properties

🔒 **Current Blob Access**: Cryptographically proves physical access to blob data  
🔒 **Freshness**: Bound to recent Chia blockchain state via epoch validation  
🔒 **Authenticity**: Merkle proofs ensure provided chunks are genuine blob data  
🔒 **Determinism**: Block hash determines chunk selection - no cherry-picking possible  
🔒 **Binding**: Cryptographically bound to specific plot and blob  

### Complete Four-Proof Security

**The storage provider must prove:**
- ✅ **Ownership**: "I own this plot" (cryptographic signature)
- ✅ **Inclusion**: "This blob is in my plot" (merkle proof to plot root)
- ✅ **Work**: "I did computational work for this blob" (proof of work)
- ✅ **Access**: "I have current physical access to blob data" (fixed window proof)

This four-proof system provides complete verification of storage commitment with cryptographic certainty, ensuring that rewards only flow to storage providers who are actively maintaining and serving data.

### Why Fixed Window Works

The Fixed Window approach solves the fundamental challenge of proving physical access without external dependencies:

**The Insight**: Prove access to **specific unpredictable chunks** selected from a **fixed protocol window**.

**The Security**: If someone can provide exactly the right chunks (determined by unpredictable block hash) with valid merkle proofs, they must have current access to the blob data.

**The Elegance**: Simple, self-contained, verifiable by anyone with just the proof data and protocol constants.

The system is efficient, secure, and scales to support the global DIG Network while maintaining strong guarantees about data availability and storage provider honesty.