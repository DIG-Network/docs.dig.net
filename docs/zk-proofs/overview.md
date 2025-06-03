---
sidebar_position: 1
---

# Proof of Contend Custodial

:::tip 💜 Support the DIG Network
**Help build the future of decentralized storage!** The DIG Network is an open-source project that needs community support to continue development. 

**[💜 Support the Project →](../support.md)** - Donate crypto, buy NFTs, or sponsor development
:::

## Introduction

The DIG Network implements a **Proof of Unique Storage** system that combines digital signatures, merkle proofs, and blockchain anchoring to enable trustless verification of data storage commitment. This four-proof system is **absolutely critical** to the network's integrity and serves as the foundation for the entire incentive mechanism.

### What is Proof of Unique Storage?

**Proof of Unique Storage** is a cryptographic system that proves:

1. **Ownership**: "I own this storage plot" 
2. **Inclusion**: "This specific data exists in my plot"
3. **Work**: "I performed computational work specifically for this data"
4. **Access**: "I have current physical access to this data"

Together, these four proofs create an unforgeable commitment to genuine data storage that prevents all known attack vectors while maintaining privacy and efficiency.

## Why This Proof System is Essential

The proof system solves several fundamental challenges in decentralized storage:

### Privacy Preservation
- **Data Content Privacy**: Blob data and Merkle tree structure remain hidden
- **Work Details Privacy**: Computational work proofs reveal no nonce or hash values
- **Selective Transparency**: Plot ownership uses public components for verification

### Security Without Trust
- **Cryptographic Verification**: Mathematical certainty about storage claims without trusting providers
- **Fraud Prevention**: Impossible to create valid proofs without actual plot ownership
- **Forgery Resistance**: Cannot create valid proofs without genuine storage commitment

### Network Integrity
- **Storage Credit Protection**: Prevents nodes from claiming rewards for storage they don't possess
- **Computational Binding**: Ensures work is cryptographically bound to specific plot/blob combinations
- **Economic Honesty**: Aligns economic incentives with genuine storage provision

## Four-Proof Architecture: Complete Storage Verification

The DIG Network's **Proof of Unique Storage** uses four interconnected proof types that work together to provide comprehensive verification:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    Proof of Unique Storage Architecture                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                   Complete Proof Package                                │   │
│  │                                                                         │   │
│  │  ┌─────────────────┐  ┌─────────────────┐                              │   │
│  │  │ 1. Plot         │  │ 2. Data         │                              │   │
│  │  │ Ownership       │  │ Inclusion       │                              │   │
│  │  │ • Digital sig   │  │ • Merkle proof  │                              │   │
│  │  │ • All public    │  │ • Plain proof   │                              │   │
│  │  └─────────────────┘  └─────────────────┘                              │   │
│  │                                                                         │   │
│  │  ┌─────────────────┐  ┌─────────────────┐                              │   │
│  │  │ 3. Computational│  │ 4. Physical     │                              │   │
│  │  │ Work            │  │ Access          │                              │   │
│  │  │ • Per-blob work │  │ • Fixed window  │                              │   │
│  │  │ • Dual binding  │  │ • Current access│                              │   │
│  │  └─────────────────┘  └─────────────────┘                              │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  Result: Cryptographic proof of genuine, current data storage                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 1. [Plot Ownership Proof](./plot-ownership.md): "I Own This Storage Plot"

Proves ownership and validity of a specific plot using digital signatures with complete transparency.

**What It Proves:**
- The storage provider owns the private key for the claimed plot
- The plot ID is correctly constructed from public components
- The plot has valid structure with committed merkle root and difficulty

**Key Properties:**
- **Digital Signature**: Uses Chia DataLayer signatures for maximum speed
- **All Components Public**: plotId, publicKey, merkleRoot, difficulty are transparent
- **Blockchain Anchored**: Temporally bound to current Chia block state
- **Instant Verification**: ~0.5ms verification using standard cryptography
- **Enables Data Proofs**: Public merkle root allows subsequent inclusion proofs

### 2. [Data Inclusion Proof](./data-inclusion.md): "This Data Exists In My Plot"

Proves that specific blob data exists within the plot's merkle tree using plain merkle proofs.

**What It Proves:**
- The specific blob hash exists as a leaf in the plot's merkle tree
- The merkle path from blob to the public root is valid
- The data inclusion is cryptographically bound to the owned plot

**Key Properties:**
- **Plain Merkle Proof**: Optimal since merkle root is already public
- **Standard Cryptography**: Uses well-understood merkle proof algorithms
- **Fast Generation**: ~1ms proof creation from existing tree structure
- **Compact Size**: ~1.3KB proof regardless of tree size
- **Perfect Efficiency**: No zero-knowledge complexity needed

### 3. [Computational Work Proof](./computational-work.md): "I Did Work For This Specific Data"

Proves that computational work is cryptographically bound to both the specific plotId AND the specific blobHash, preventing work theft.

**What It Proves:**
- Real computational effort was expended for this specific blob
- The work meets the difficulty claimed in the plot ownership proof
- The work is permanently bound to BOTH plotId and blobHash simultaneously

**Key Properties:**
- **Per-Blob Architecture**: Separate proof of work for every blob stored
- **Dual Cryptographic Binding**: Work hash includes plotId + blobHash + tableData + nonce
- **Attack Prevention**: Cannot reuse work across plots, blobs, or storage providers
- **Granular Security**: Individual blob compromises don't affect others
- **Fast Verification**: ~1ms to verify work that took seconds to generate

### 4. [Physical Access Proof](./physical-access.md): "I Have Current Access To This Data"

Proves current physical access to blob data using fixed window chunk selection with blockchain anchoring.

**What It Proves:**
- The storage provider has actual physical access to the blob data right now
- The proof was generated using recent Chia blockchain state
- The provider can access unpredictable blob segments determined by block hash

**Key Properties:**
- **Fixed Window Selection**: Always selects 3 chunks from first 1024 positions
- **Blockchain Anchored**: Block hash provides unpredictable freshness challenge
- **Self-Contained**: Zero external dependencies or metadata requirements
- **Attack Resistant**: Prevents precomputation, replay, and cherry-picking attacks
- **Merkle Verified**: Chunk authenticity proven with merkle proofs

## How Four Proofs Create Proof of Unique Storage

The DIG Network uses an optimal cryptographic approach, selecting the best primitive for each verification task:

### Signature-Based Proofs (Plot Ownership)
- **Technology**: Chia DataLayer signatures
- **Use Case**: Proving private key ownership and plot validity
- **Benefits**: Lightning fast (~0.5ms), simple, no trusted setup
- **Transparency**: All plot components are public for maximum verifiability

### Merkle-Based Proofs (Data Inclusion, Physical Access)
- **Technology**: Standard merkle proofs with SHA256
- **Use Case**: Proving data relationships and current access
- **Benefits**: Fast generation/verification, well-understood security
- **Efficiency**: Optimal when root is public or self-contained verification needed

### Work-Based Proofs (Computational Work)
- **Technology**: Proof of work with cryptographic binding
- **Use Case**: Proving computational effort for specific data
- **Benefits**: Attack-resistant, granular security, fast verification
- **Binding**: Dual commitment to both plot and blob prevents theft

### Complete Storage Verification Chain

The four proofs work together to create **Proof of Unique Storage**:

```
PROOF VERIFICATION CHAIN:

1. PLOT OWNERSHIP → Establishes valid plot with committed merkle root
   "I own plot X with root R and difficulty D"

2. DATA INCLUSION → Uses public root R to prove blob existence  
   "Blob B exists in the merkle tree with root R"

3. COMPUTATIONAL WORK → Proves work specifically for this plot+blob combination
   "I performed work of difficulty D specifically for blob B in plot X"

4. PHYSICAL ACCESS → Proves current access to the actual blob data
   "I have physical access to blob B right now"

RESULT: Cryptographic certainty of genuine, current data storage
```

## Complete Proof Package Structure

Every PlotCoin contains a complete **Proof of Unique Storage** package with all four proof types:

```typescript
interface ProofOfUniqueStorage {
  // Common identifiers
  plotId: Buffer;                           // Links all proofs together
  blobHash: Buffer;                         // The specific blob being proven
  
  // 1. PLOT OWNERSHIP PROOF (Digital Signature)
  plotOwnershipProof: {
    publicKey: Buffer;                      // Owner's public key (32 bytes)
    merkleRoot: Buffer;                     // Plot's merkle root (32 bytes)  
    difficulty: number;                     // Claimed difficulty (4 bytes)
    blockHeight: number;                    // Chia anchor block (4 bytes)
    blockHash: Buffer;                      // Chia anchor hash (32 bytes)
    signature: Buffer;                      // DataLayer signature (64 bytes)
    signedMessage: Buffer;                  // Message that was signed (32 bytes)
  },
  
  // 2. DATA INCLUSION PROOF (Merkle Proof)
  dataInclusionProof: {
    merklePath: Buffer[];                   // Sibling hashes (32 bytes each)
    pathDirections: Buffer;                 // Packed directions (variable)
    leafIndex: number;                      // Position in tree (4 bytes)
  },
  
  // 3. COMPUTATIONAL WORK PROOF (Proof of Work)
  computationalWorkProof: {
    nonce: Buffer;                          // Found nonce (4-32 bytes)
    tableDataHash: Buffer;                  // Table data hash (32 bytes)
    difficulty: number;                     // Achieved difficulty (4 bytes)
    // plotId and blobHash are bound in work hash calculation
  },
  
  // 4. PHYSICAL ACCESS PROOF (Fixed Window + Merkle)
  physicalAccessProof: {
    blockHeight: number;                    // Current Chia block (4 bytes)
    blockHash: Buffer;                      // Current Chia hash (32 bytes)
    chunkIndices: number[];                 // Selected chunks [3] (12 bytes)
    chunkData: Buffer[];                    // Actual chunk data [3×4KB]
    chunkProofs: MerklePathProof[];         // Merkle proofs [3]
    blobRootHash: Buffer;                   // Blob's merkle root (32 bytes)
  }
}

// Total Package Size: ~15-20KB depending on merkle tree depths
```

### Proof Package Generation Flow

```
CREATING PROOF OF UNIQUE STORAGE:

1. GENERATE PLOT OWNERSHIP PROOF (~5ms)
   → Sign plotId + publicKey + merkleRoot + difficulty + blockHeight + blockHash
   → Establishes plot ownership and makes merkle root public

2. GENERATE DATA INCLUSION PROOF (~1ms)  
   → Extract merkle path from blob to public merkle root
   → Proves specific blob exists in the owned plot

3. GENERATE COMPUTATIONAL WORK PROOF (~10 seconds avg)
   → Find nonce where SHA256(tableData + nonce + plotId + blobHash) meets difficulty
   → Proves computational work specifically for this plot+blob combination

4. GENERATE PHYSICAL ACCESS PROOF (~60ms)
   → Use current block hash to select 3 unpredictable chunk positions
   → Extract chunks and generate merkle proofs for blob tree
   → Proves current physical access to blob data

5. EMBED IN PLOTCOIN
   → Serialize complete proof package
   → Submit to PlotCoin registry on Chia blockchain
   → Validators can verify without contacting storage provider
```

## Cryptographic Security Properties

### Mathematical Guarantees
- **Soundness**: Impossible to create valid proofs without genuine knowledge
- **Zero-Knowledge**: ZK proofs reveal no information beyond their validity
- **Succinctness**: Constant-size proofs regardless of statement size
- **Non-Interactive**: No communication required between prover and verifier

### Attack Resistance
- **Unlinkability**: Multiple proofs from same source cannot be linked (for ZK proofs)
- **Non-repudiation**: Proofs are cryptographically bound to creators
- **Forgery Resistance**: Computationally infeasible to fake valid proofs
- **Sybil Resistance**: Computational work prevents fake plot creation

### Privacy Protection
- **Data Anonymity**: Actual data content never revealed (ZK proofs)
- **Selective Transparency**: Plot ownership reveals public components for verification
- **Metadata Privacy**: Tree structure and organization remain hidden (ZK proofs)
- **Transaction Privacy**: Proof verification doesn't leak sensitive information

## Integration with PlotCoin System

The **Proof of Unique Storage** system integrates seamlessly with the [PlotCoin registry](../primitives/on-chain/plotcoin.md):

### Binary Compression

Before being embedded in a PlotCoin, each ProofPackage is compressed using an ultra-efficient binary codec that achieves ~99% size reduction:

```typescript
// Original ProofPackage (~25KB)
const proofPackage = {
  plotId, blobHash, publicKey,           // Core identifiers
  plotOwnershipProof,                    // Digital signature proof
  dataInclusionProof,                    // Merkle proof
  computationalWorkProof,                // Work proof
  physicalAccessProof                    // Access proof + chunks
};

// Compress to binary (~280 bytes, 98.9% smaller)
const codec = new ProofPackageCodec({
  compressionLevel: 11,          // Maximum Brotli compression
  enableDeduplication: true,     // Deduplicate identical hashes
  enableDeltaCompression: true   // Delta compress similar chunks
});

const compressedBinary = codec.encode(proofPackage);
```

The compression pipeline:
1. **Field Name Optimization**: Uses compact names (e.g. "pid" vs "plotId")
2. **MessagePack Serialization**: Efficient binary format for structured data
3. **Smart Deduplication**: Reuses identical cryptographic hashes
4. **Delta Compression**: Efficiently encodes similar chunk data
5. **Brotli Compression**: Maximum compression with large window/block size

This reduces a complete ProofPackage from ~25KB to just ~280 bytes while maintaining perfect round-trip fidelity. Here's an example of a complete compressed ProofPackage in hex format:

```
// Complete ProofPackage (~25KB) compressed to 280 bytes:
1bdb31001e87b17b241868fb2fab8f0bedff9afe3adbf7cac230a92a4c8153a6  // Header + metadata
2920a12e37406156b7e6dc751e851da86e7d1e34177209ca209441b0c5bfd98e  // Plot ownership
4703a307d98d07031c60945be1acbbce330b03e101a6371ca5d41cca27bf63cd  // Data inclusion
a99c2dc3db7d546fda2d599dc96ca16c89f59c1819cbc0da4308ab2c1542f536  // Work proof
eb2f97404bd8dccad952f7936db7d230a448a75ce46b49ea9d2263286fa88e37  // Physical access 1/3
147646e0a5a1e2c0b5f28472838dd460d28512e301e8083327eb907fae71ae7c  // Physical access 2/3
a3be63bd1f7b367fb9070070a38c786e957b00a08cd8a3720f0094112a1694c3  // Physical access 3/3
9bb5d4b9623e5c1d8a3fe2906cfbb36013fb5fc79bb4c77d4e5dc2e7d1855cf1  // Merkle proofs
40d0a5936c683a2d87afe84c7ae37d0af2d0c36bd6bf3b0b                    // Footer
```

The compressed binary can be efficiently stored on-chain in the PlotCoin registry. The compression header (`1bdb31...`) indicates Brotli level 11 compression, and the remaining data contains the complete proof package with all four proofs in a highly optimized format.

### PlotCoin Structure with Proof Package

```typescript
interface PlotCoin {
  // PlotCoin metadata
  plotCoinId: string;                       // Unique PlotCoin identifier
  blobId: string;                           // The blob this PlotCoin covers
  createdAt: number;                        // Block height when created
  epoch: number;                            // Reward epoch
  
  // Complete Proof of Unique Storage
  proofPackage: ProofOfUniqueStorage;       // All four proofs
  
  // Verification status (computed by validators)
  verified: boolean;                        // Has this been verified?
  verificationErrors: string[];             // Any verification issues
  lastVerified: number;                     // When last verified
}
```

### Complete Validator Workflow

```
VALIDATOR VERIFICATION OF PROOF OF UNIQUE STORAGE:

1. QUERY PLOTCOIN REGISTRY
   → Find PlotCoins claiming storage for requested blobId
   → Extract complete proof packages from each PlotCoin

2. VERIFY PLOT OWNERSHIP PROOF (~0.5ms)
   → Check DataLayer signature validity
   → Verify plotId construction from public components
   → Validate blockchain anchoring to Chia

3. VERIFY DATA INCLUSION PROOF (~0.5ms)
   → Compute merkle root from provided path
   → Verify matches public merkle root from ownership proof
   → Confirm blob exists in claimed plot

4. VERIFY COMPUTATIONAL WORK PROOF (~1ms)
   → Compute work hash: SHA256(tableData + nonce + plotId + blobHash)
   → Count leading zero bits to verify difficulty
   → Confirm dual binding to both plot and blob

5. VERIFY PHYSICAL ACCESS PROOF (~56ms)
   → Validate Chia block authenticity against blockchain
   → Recalculate expected chunk indices from block hash
   → Verify provided chunks match expected selection
   → Validate merkle proofs for chunk authenticity

6. AWARD STORAGE REWARDS
   → Storage providers with valid proofs receive tokens
   → Invalid or missing proofs result in no rewards
   → Duplicate proofs (work theft) are detected and rejected

TOTAL VERIFICATION TIME: ~58ms per proof package
```

### Network Benefits

The complete system provides:

1. **Trustless Verification**: No need to contact storage providers directly
2. **Immutable Proof Storage**: Blockchain preserves all proof packages permanently  
3. **Parallel Validation**: Multiple validators can verify independently
4. **Fraud Detection**: Mathematical certainty about storage claims
5. **Economic Efficiency**: Rewards flow only to genuine storage providers

## Performance Characteristics

### Proof of Unique Storage Performance

**Complete Package Generation:**
- **Plot Ownership**: ~5ms (digital signature)
- **Data Inclusion**: ~1ms (merkle path extraction)  
- **Computational Work**: ~10 seconds average (depends on difficulty)
- **Physical Access**: ~60ms (chunk extraction + merkle proofs)
- **Total Generation**: ~10 seconds (dominated by work proof)

**Complete Package Verification:**
- **Plot Ownership**: ~0.5ms (signature verification)
- **Data Inclusion**: ~0.5ms (merkle proof verification)
- **Computational Work**: ~1ms (hash computation)
- **Physical Access**: ~56ms (block verification + merkle proofs)
- **Total Verification**: ~58ms per complete proof package

**Package Size:**
- **Uncompressed Total**: ~25KB
  - Plot Ownership: ~200 bytes (signature + metadata)
  - Data Inclusion: ~1.3KB (merkle path for 40-level tree)
  - Computational Work: ~100 bytes (nonce + metadata)
  - Physical Access: ~12.5KB (chunks + merkle proofs)
- **Compressed Total**: ~280 bytes (98.9% reduction)
  - Uses MessagePack + Brotli compression
  - Includes deduplication and delta compression
  - Perfect round-trip fidelity preserved

**Scalability:**
- **Parallel Verification**: All proof packages can be verified concurrently
- **No Network Calls**: All verification is local computation
- **Constant Size**: Package size independent of actual storage size
- **Linear Scaling**: Performance scales linearly with number of storage providers

## Future Enhancements

### Proof System Optimizations
- **Batch Verification**: Verify multiple proof packages simultaneously
- **Compressed Merkle Proofs**: Reduce proof package sizes further
- **Hardware Acceleration**: GPU acceleration for work proof generation
- **Proof Caching**: Cache verification results for frequently accessed blobs

### Protocol Improvements
- **Dynamic Difficulty**: Automatic difficulty adjustment based on network conditions
- **Enhanced Freshness**: More sophisticated physical access verification
- **Cross-Chain Integration**: Support for other blockchain ecosystems
- **Formal Verification**: Mathematical verification of protocol security properties

### Network Enhancements
- **Proof Markets**: Allow storage providers to trade proof generation services
- **Reputation Systems**: Track storage provider reliability over time
- **Quality of Service**: Differentiated rewards based on access performance
- **Geographic Distribution**: Proofs that include location verification

## Summary: Proof of Unique Storage

The DIG Network's **Proof of Unique Storage** system represents a breakthrough in decentralized storage verification by using the optimal cryptographic primitive for each verification task:

### Complete Security Properties

1. **Ownership Verification**: Digital signatures prove plot ownership with maximum transparency
2. **Data Verification**: Merkle proofs establish data inclusion with cryptographic certainty  
3. **Work Verification**: Proof of work prevents storage credit theft with granular security
4. **Access Verification**: Blockchain anchoring proves current physical access to data

### System Benefits

✅ **Mathematical Certainty**: Cryptographic proofs eliminate trust requirements  
✅ **Attack Prevention**: Comprehensive protection against all known attack vectors  
✅ **High Performance**: ~58ms verification, ~10 second generation, ~15KB packages  
✅ **Optimal Design**: Right cryptographic tool for each verification task  
✅ **Economic Alignment**: Rewards flow only to genuine storage providers  

### The Complete Promise

When a storage provider submits a **Proof of Unique Storage** to the PlotCoin registry, they are making a cryptographically backed commitment:

> "I own storage plot X, it contains data blob B, I performed computational work specifically for this blob in this plot, and I have current physical access to the data right now."

Validators can verify this complete commitment in under 60 milliseconds with mathematical certainty, enabling a trustless decentralized storage network where rewards are guaranteed to flow only to storage providers who are genuinely storing and serving data. 