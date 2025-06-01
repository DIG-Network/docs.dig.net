---
sidebar_position: 1
---

:::tip 💜 Support the DIG Network
**Help build the future of decentralized storage!** The DIG Network is an open-source project that needs community support to continue development. 

**[💜 Support the Project →](../support.md)** - Donate crypto, buy NFTs, or sponsor development
:::

# Plot Format Technical Specifications

## Overview and Design Principles

The DIG Plot format implements a **7-table blockchain-inspired architecture** where each table contains cryptographic proof-of-work, creating an immutable chain of computational effort bound to specific data. This design provides:

- **Forgery Prevention**: Cryptographic work requirements prevent just-in-time plot creation
- **Data Integrity**: Hash chains and Merkle trees ensure tamper-evident storage
- **Performance Optimization**: Multi-layered indexing for O(1) lookups
- **Scalability**: Streaming architecture supports terabyte-scale plots
- **Security**: Zero-knowledge proof integration for privacy-preserving verification

## Binary File Structure Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         DIG Plot Binary File Structure                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────┐ ◄── File Offset 0x0000                               │
│  │   File Header       │     - Magic: 0x44494750 ("DIGP")                     │
│  │   1024 bytes        │     - Version, PlotId, PublicKey                     │
│  │                     │     - Metadata, Flags, Checksums                     │
│  └─────────────────────┘                                                       │
│                                                                                 │
│  ┌─────────────────────┐ ◄── 4096-byte aligned                                │
│  │   Plot Metadata     │     - Extended plot configuration                    │
│  │   Variable size     │     - Compression settings, difficulty               │
│  │                     │     - Chia block info for temporal anchoring         │
│  └─────────────────────┘                                                       │
│                                                                                 │
│  ┌─────────────────────┐ ◄── 4096-byte aligned                                │
│  │   Table Section     │     - 7 Proof-of-Work Tables                         │
│  │   Variable size     │     - Cryptographically chained                      │
│  │                     │     - Contains data + proof tables                   │
│  └─────────────────────┘                                                       │
│                                                                                 │
│  ┌─────────────────────┐ ◄── 4096-byte aligned                                │
│  │   Index Section     │     - Hash-based O(1) blob lookup                    │
│  │   Variable size     │     - B+ Tree for range queries                      │
│  │                     │     - Bloom filters for existence checks             │
│  └─────────────────────┘                                                       │
│                                                                                 │
│  ┌─────────────────────┐ ◄── 4096-byte aligned                                │
│  │   Data Chunks       │     - Compressed blob storage                        │
│  │   Variable size     │     - Streaming-optimized layout                     │
│  │                     │     - MIME type metadata                             │
│  └─────────────────────┘                                                       │
│                                                                                 │
│  ┌─────────────────────┐ ◄── 4096-byte aligned                                │
│  │   Verification      │     - Merkle tree roots                              │
│  │   Variable size     │     - Digital signatures                             │
│  │                     │     - Zero-knowledge proof anchors                   │
│  └─────────────────────┘                                                       │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## File Header: Binary Layout

The file header uses a fixed 1024-byte structure with little-endian encoding for cross-platform compatibility:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           File Header (1024 bytes)                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Offset │ Size │ Field                    │ Description                          │
├────────┼──────┼──────────────────────────┼──────────────────────────────────────┤
│ 0x0000 │   4  │ magic                    │ 0x44494750 ("DIGP" in ASCII)        │
│ 0x0004 │   2  │ version                  │ File format version (currently 1)   │
│ 0x0006 │   2  │ flags                    │ Feature flags (see below)           │
│ 0x0008 │  32  │ plotId                   │ SHA-256 PlotId (per whitepaper)     │
│ 0x0028 │  32  │ publicKey                │ Chia Public Synthetic Key           │
│ 0x0048 │  32  │ merkleRoot               │ Root hash of all plot data          │
│ 0x0068 │   4  │ difficulty               │ Proof-of-work difficulty achieved   │
│ 0x006C │   8  │ chiaBlockHeight          │ Chia block height (temporal anchor) │
│ 0x0074 │  32  │ chiaBlockHash            │ Chia block hash (temporal anchor)   │
│ 0x0094 │   8  │ createdAt                │ Unix timestamp (milliseconds)       │
│ 0x009C │   8  │ sealedAt                 │ Unix timestamp when plot sealed     │
│ 0x00A4 │   4  │ tableCount               │ Number of proof-of-work tables      │
│ 0x00A8 │   8  │ totalBlobCount           │ Total number of blobs stored        │
│ 0x00B0 │   8  │ totalDataSize            │ Total size of all blob data         │
│ 0x00B8 │   8  │ fileSize                 │ Complete plot file size             │
│ 0x00C0 │   8  │ metadataOffset           │ Offset to metadata section          │
│ 0x00C8 │   8  │ metadataSize             │ Size of metadata section            │
│ 0x00D0 │   8  │ tablesOffset             │ Offset to table section             │
│ 0x00D8 │   8  │ tablesSize               │ Size of table section               │
│ 0x00E0 │   8  │ indexOffset              │ Offset to index section             │
│ 0x00E8 │   8  │ indexSize                │ Size of index section               │
│ 0x00F0 │   8  │ dataOffset               │ Offset to data section              │
│ 0x00F8 │   8  │ dataSize                 │ Size of data section                │
│ 0x0100 │   8  │ verificationOffset       │ Offset to verification section      │
│ 0x0108 │   8  │ verificationSize         │ Size of verification section        │
│ 0x0110 │  16  │ compressionInfo          │ Compression algorithm and params    │
│ 0x0120 │  32  │ headerChecksum           │ SHA-256 checksum of header          │
│ 0x0140 │ 864  │ reserved                 │ Reserved for future features        │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Feature Flags (16-bit bitfield)

```
Bit  0: COMPRESSED       - Plot uses compression
Bit  1: ENCRYPTED        - Plot is encrypted (AES-256-GCM)
Bit  2: INDEXED          - Contains B+ tree indexes
Bit  3: MERKLE_TREE      - Contains Merkle tree verification
Bit  4: ZK_PROOFS        - Contains zero-knowledge proof anchors
Bit  5: STREAMING        - Optimized for streaming access
Bit  6: MEMORY_MAPPED    - Optimized for memory-mapped I/O
Bit  7: SIGNED           - Contains digital signatures
Bit  8: TABLE_CHAIN      - Tables are cryptographically chained
Bit  9: DIFFICULTY_POW   - Each table contains proof-of-work
Bit 10: VERSION_CONTROL  - Supports versioning and diffs
Bit 11: DEDUPLICATION    - Contains deduplicated data
Bits 12-15: Reserved for future features
```

## 7-Table Blockchain Architecture

The core of every DIG plot is a sequence of exactly **7 cryptographically-chained tables**, each containing proof-of-work that prevents forgery and ensures computational effort was expended during plot creation:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        7-Table Proof-of-Work Chain                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  Table 0: Plot Header Table                                                    │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ Header Hash: 0000...1a4f │ Nonce: 0x1a2b3c4d │ Difficulty: [varies]    │   │
│  │ PrevHash: NULL           │ Data: Plot metadata + PublicKey            │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                            │
│                                    ▼ (Header Hash becomes PrevHash)             │
│  Table 1: Chia Anchor Table                                                    │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ Header Hash: 0000...8b9c │ Nonce: 0x9c8b7a6d │ Difficulty: [varies]    │   │
│  │ PrevHash: 0000...1a4f    │ Data: Chia block height + hash             │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                            │
│                                    ▼                                            │
│  Table 2: Index Table                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ Header Hash: 0000...2f3e │ Nonce: 0x3e2f1d8c │ Difficulty: [varies]    │   │
│  │ PrevHash: 0000...8b9c    │ Data: Hash indexes + B+ tree roots         │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                            │
│                                    ▼                                            │
│  Table 3: Data Table                                                           │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ Header Hash: 0000...4d5c │ Nonce: 0x5c4d3b2a │ Difficulty: [varies]    │   │
│  │ PrevHash: 0000...2f3e    │ Data: Blob content + compression metadata   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                            │
│                                    ▼                                            │
│  Table 4: Merkle Table                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ Header Hash: 0000...6e7d │ Nonce: 0x7d6e5c4b │ Difficulty: [varies]    │   │
│  │ PrevHash: 0000...4d5c    │ Data: Merkle tree structure + root         │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                            │
│                                    ▼                                            │
│  Table 5: Proof Table                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ Header Hash: 0000...8f9e │ Nonce: 0x9e8f7d6c │ Difficulty: [varies]    │   │
│  │ PrevHash: 0000...6e7d    │ Data: ZK proof anchors + signature spots   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                            │
│                                    ▼                                            │
│  Table 6: Signature Table                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ Header Hash: 0000...a1b0 │ Nonce: 0xb0a19f8e │ Difficulty: [varies]    │   │
│  │ PrevHash: 0000...8f9e    │ Data: Digital signatures + plot seal       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                            │
│                                    ▼ (Final hash becomes PlotId component)      │
│                              Plot is Sealed                                     │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Individual Table Structure

Each table follows a consistent binary layout (Variable size, 4096-byte aligned):

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           Table Header (128 bytes)                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Offset │ Size │ Field                    │ Description                          │
├────────┼──────┼──────────────────────────┼──────────────────────────────────────┤
│ 0x00   │   4  │ tableIndex               │ Table number (0-6)                  │
│ 0x04   │   4  │ tableType                │ Type identifier                     │
│ 0x08   │  32  │ previousHash             │ Hash of previous table (NULL for 0) │
│ 0x28   │  32  │ headerHash               │ Hash of this table header + data    │
│ 0x48   │   8  │ timestamp                │ Creation timestamp (milliseconds)   │
│ 0x50   │   8  │ nonce                    │ Proof-of-work nonce                 │
│ 0x58   │   4  │ difficulty               │ Difficulty achieved                 │
│ 0x5C   │   4  │ workTime                 │ Time to find valid nonce (ms)      │
│ 0x60   │   8  │ dataOffset               │ Offset to table data               │
│ 0x68   │   8  │ dataSize                 │ Size of table data                 │
│ 0x70   │   8  │ compressedSize           │ Size after compression (if any)    │
│ 0x78   │   4  │ compressionType          │ Compression algorithm used         │
│ 0x7C   │   4  │ flags                    │ Table-specific flags               │
│ 0x80   │  64  │ reserved                 │ Reserved for future use            │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Table Types and Functions

1. **Table 0 - Plot Header Table**: Contains plot metadata, public key, and initial configuration
2. **Table 1 - Chia Anchor Table**: Binds plot to Chia blockchain for temporal anchoring
3. **Table 2 - Index Table**: Contains hash indexes and B+ tree structures for fast lookups
4. **Table 3 - Data Table**: Stores actual blob content with compression metadata
5. **Table 4 - Merkle Table**: Contains Merkle tree structure for cryptographic verification
6. **Table 5 - Proof Table**: Contains zero-knowledge proof anchors and verification data
7. **Table 6 - Signature Table**: Contains digital signatures and final plot seal

## Metadata Section

Extended plot configuration using variable-length TLV (Type-Length-Value) format:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              Metadata Section                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Field Type │ Size │ Field                    │ Description                      │
├────────────┼──────┼──────────────────────────┼──────────────────────────────────┤
│ 0x0001     │  64  │ plotConfiguration        │ Core plot settings               │
│ 0x0002     │  32  │ compressionSettings      │ Algorithm, level, dictionary     │
│ 0x0003     │  48  │ encryptionSettings       │ Algorithm, key derivation        │
│ 0x0004     │  24  │ difficultySettings       │ Target, achieved, work time      │
│ 0x0005     │  72  │ chiaBlockInfo            │ Extended blockchain anchoring    │
│ 0x0006     │  16  │ indexConfiguration       │ Index types and parameters       │
│ 0x0007     │  32  │ streamingConfiguration   │ Chunk size, buffer settings      │
│ 0x0008     │  40  │ performanceMetrics       │ Creation time, validation time   │
│ 0x0009     │ Var  │ customMetadata           │ User-defined key-value pairs     │
│ 0x000A     │  56  │ versionInfo              │ Creator, version, compatibility  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Index Section: Multi-Layer Lookup Architecture

Provides multiple indexing strategies optimized for different access patterns:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           Index Section Architecture                           │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  Hash Index (O(1) average lookup)                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ BlobId Hash → Bucket → [BlobId, Offset, Size, Metadata]                │   │
│  │ Load Factor: 0.75    Collision Resolution: Chaining                    │   │
│  │ Bucket Size: Variable    Hash Function: SHA-256 truncated to 64-bit    │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  B+ Tree Index (O(log n) sorted lookup with range queries)                     │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ Internal Nodes: [Key1|Ptr1][Key2|Ptr2]...[KeyN|PtrN]                  │   │
│  │ Leaf Nodes: [BlobId|Offset|Size][BlobId|Offset|Size]... → Next Leaf   │   │
│  │ Node Size: 4096 bytes    Branching Factor: ~340 entries/node           │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  Bloom Filter (Existence checking to prevent unnecessary disk access)          │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ Bit Array Size: 1MB (8M bits)    Hash Functions: 3                    │   │
│  │ False Positive Rate: ~0.1%       Items: Variable                      │   │
│  │ Use Case: Quick "not found" determination                              │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Data Section: Optimized Blob Storage

The data section uses a sophisticated chunked architecture designed for streaming performance and compression efficiency:

### Blob Header Structure (256 bytes per blob)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                             Blob Header (256 bytes)                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Offset │ Size │ Field                    │ Description                          │
├────────┼──────┼──────────────────────────┼──────────────────────────────────────┤
│ 0x00   │  32  │ blobId                   │ SHA-256 hash of blob content        │
│ 0x20   │  32  │ contentHash              │ Hash of uncompressed content        │
│ 0x40   │   8  │ originalSize             │ Size before compression              │
│ 0x48   │   8  │ compressedSize           │ Size after compression               │
│ 0x50   │   8  │ createdAt                │ Creation timestamp                   │
│ 0x58   │   8  │ modifiedAt               │ Modification timestamp               │
│ 0x60   │   4  │ chunkCount               │ Number of chunks for this blob       │
│ 0x64   │   4  │ compressionType          │ Algorithm used (see below)           │
│ 0x68   │   4  │ compressionLevel         │ Compression level (1-9)              │
│ 0x6C   │   4  │ flags                    │ Blob flags (encrypted, signed, etc.) │
│ 0x70   │  64  │ mimeType                 │ MIME type string (null-terminated)   │
│ 0xB0   │  32  │ encoding                 │ Content encoding (UTF-8, binary)     │
│ 0xD0   │  32  │ customMetadata           │ User-defined metadata hash          │
│ 0xF0   │  16  │ reserved                 │ Reserved for future features        │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Compression Types

```
0x00: None (uncompressed)
0x01: GZIP (RFC 1952)
0x02: ZSTD (Facebook's Zstandard)  
0x03: LZ4 (ultra-fast compression)
0x04: Brotli (Google's algorithm)
0x05: DEFLATE (RFC 1951)
0x06: LZMA (7-Zip algorithm)
0x07: Custom (user-defined)
```

### Dynamic Chunking Strategy

- **Small blobs (< 4KB)**: Single chunk, minimal overhead
- **Medium blobs (4KB - 1MB)**: 4KB chunks for optimal compression
- **Large blobs (> 1MB)**: 16KB chunks for streaming performance
- **Huge blobs (> 100MB)**: Adaptive chunking based on content patterns

## Verification Section: Cryptographic Security

The verification section contains all cryptographic data structures needed to verify plot integrity, authenticity, and zero-knowledge proofs:

### Digital Signature Structure (96 bytes each)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         BLS12-381 Signature (96 bytes)                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Offset │ Size │ Field                    │ Description                          │
├────────┼──────┼──────────────────────────┼──────────────────────────────────────┤
│ 0x00   │  48  │ signaturePoint           │ BLS signature point (compressed)     │
│ 0x30   │  32  │ messageHash              │ SHA-256 hash of signed message       │
│ 0x50   │   8  │ timestamp                │ Signature creation time              │
│ 0x58   │   4  │ signatureType            │ Type identifier (plot, table, blob)  │
│ 0x5C   │   4  │ flags                    │ Signature flags                      │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### ZK Proof Anchor Structure (256 bytes each)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         ZK Proof Anchor (256 bytes)                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Offset │ Size │ Field                    │ Description                          │
├────────┼──────┼──────────────────────────┼──────────────────────────────────────┤
│ 0x00   │  32  │ proofCommitment          │ Commitment to the ZK proof           │
│ 0x20   │  32  │ publicInputHash          │ Hash of public inputs                │
│ 0x40   │  32  │ verificationKey          │ Verification key identifier         │
│ 0x60   │   8  │ proofGenTime             │ Proof generation timestamp           │
│ 0x68   │   4  │ proofType                │ Type (creation, inclusion, etc.)     │
│ 0x6C   │   4  │ circuitVersion           │ ZK circuit version used              │
│ 0x70   │  32  │ nullifier                │ Unique nullifier (prevents reuse)   │
│ 0x90   │  32  │ plotBinding              │ Cryptographic binding to plot       │
│ 0xB0   │  32  │ chiaBlockBinding         │ Binding to Chia blockchain state    │
│ 0xD0   │  48  │ reserved                 │ Reserved for circuit-specific data  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Performance Characteristics

### Lookup Performance

- **Hash Index**: O(1) average case with 0.75 load factor and collision chaining
- **B+ Tree Index**: O(log n) with ~340 entries per 4KB node
- **Bloom Filter**: ~0.1% false positive rate for existence checking

### Streaming Performance

- **Sequential Read**: ~500 MB/s on NVMe SSDs, ~200 MB/s on SATA SSDs
- **Random Access**: ~100 MB/s on NVMe SSDs, ~50 MB/s on SATA SSDs  
- **Compressed Streaming**: ~300 MB/s with LZ4, ~150 MB/s with ZSTD

### Scalability Limits

- **Maximum Plot Size**: 256TB (theoretical), ~100TB (practical)
- **Maximum Blob Count**: 4.2 billion (32-bit addressing)
- **Maximum Individual Blob**: 4GB per blob
- **Table Processing**: ~1 million blobs per minute on modern hardware

## Security Properties

### Cryptographic Security

- **Non-repudiation**: Digital signatures prevent denial of plot creation
- **Integrity**: Hash chains and Merkle trees detect any data tampering
- **Authenticity**: BLS signatures prove plot owner identity
- **Freshness**: Chia block binding prevents replay attacks
- **Privacy**: ZK proof anchors enable verification without revealing secrets

### Attack Resistance

- **Proof-of-Work Table Chains**: Each table requires computational work to prevent just-in-time plot creation
- **Cryptographic Chaining**: SHA-256 prevents table reordering or tampering
- **BLS12-381 Digital Signatures**: Compatible with Chia blockchain signature scheme
- **Merkle Tree Data Integrity**: Binary tree structure enables O(log n) verification
- **Zero-Knowledge Proof Integration**: Proof anchors enable verification without revealing sensitive data

This comprehensive plot format provides the foundation for the DIG Network's decentralized storage system, combining high performance with cryptographic security and zero-knowledge proof compatibility. 