---
sidebar_position: 1
---

# Plots - Cryptographically Secured Storage Containers

:::tip 💜 Support the DIG Network
**Help build the future of decentralized storage!** The DIG Network is an open-source project that needs community support to continue development. 

**[💜 Support the Project →](../../support.md)** - Donate crypto, buy NFTs, or sponsor development
:::

## What is a Plot?

A plot in the DIG Network is a specialized cryptographic storage container that securely organizes and stores data blobs with built-in verification capabilities. Structurally, a plot is a binary file format consisting of multiple organized sections: a file header with essential metadata, an index section for fast lookups, table sections that chain together using cryptographic hashes and proof-of-work, data sections containing compressed blob storage, and verification sections with digital signatures and Merkle trees.

Each plot is uniquely identified by a SHA-256 hash and is cryptographically tied to its owner through Chia Public Synthetic Key signatures.

## Critical Role in Network Integrity

The plot format incorporates proof-of-work mechanisms similar to blockchain technology, where each table requires computational work to create. This embedded proof-of-work is **absolutely critical** to the DIG Network's integrity and serves as the foundation for the entire incentive system.

### Preventing Storage Credit Theft

Without this computational commitment, malicious actors could easily claim credit for storing data they don't actually possess, undermining the network's reward distribution and making it impossible to distinguish between legitimate storage providers and fraudulent ones.

The proof-of-work requirement ensures that DIG Nodes can only earn rewards for data they have genuinely invested computational effort to store. This prevents "storage credit theft" where nodes might attempt to take credit for someone else's storage work.

## Plot Proof System

Plots enable a powerful multi-layered proof system that provides cryptographic guarantees about data ownership, integrity, and computational work:

### Core Cryptographic Proofs

1. **Plot Creation Proof**
   - **What it proves:** That a plot was originally created by a specific private key holder
   - **Security Guarantees:** Prevents plot theft, even if someone copies your plot file they cannot prove they created it
   - **Use Cases:** Establishing original ownership, preventing forgery attacks

2. **Data Inclusion Proof**
   - **What it proves:** That a specific blob (file/data) actually exists in the plot's structure
   - **How it works:** Uses Merkle tree cryptography to provide mathematical proof of data existence
   - **Privacy options:** Can prove data exists without revealing the actual data contents (zero-knowledge)
   - **Use cases:** Verifying data storage without exposing sensitive information

3. **Ownership Verification**
   - **What it proves:** That the current data comes from the legitimate plot owner
   - **Methods:** Digital signatures, challenge-response protocols, zero-knowledge ownership proofs
   - **Advanced features:** Interactive verification, ownership transfer proofs, revocation support
   - **Use cases:** Access control, authentication, ownership transfers

4. **Physical Access Proof**
   - **What it proves:** That the owner has actual physical access to their plot data (not just cached proofs)
   - **How it works:** Requires real-time computation using actual plot data within time constraints (~1 Chia Block)
   - **Attack prevention:** Stops precomputation attacks where someone deletes their plot but serves cached proofs
   - **Use cases:** Ensuring genuine storage, preventing storage fraud

5. **Computational Work Proof**
   - **What it proves:** That significant computational effort was invested in plot creation and is bound to specific data
   - **Standard mode:** Proves minimum difficulty threshold was met
   - **Zero-knowledge mode:** Proves difficulty ≥ threshold without revealing actual difficulty value
   - **Binding:** Ensures work cannot be transferred between plots or blobs

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

### Table Functions

1. **Table 0 - Plot Header**: Contains plot metadata, public key, and initial configuration
2. **Table 1 - Chia Anchor**: Binds plot to Chia blockchain for temporal anchoring
3. **Table 2 - Index**: Contains hash indexes and B+ tree structures for fast lookups
4. **Table 3 - Data**: Stores actual blob content with compression metadata
5. **Table 4 - Merkle**: Contains Merkle tree structure for cryptographic verification
6. **Table 5 - Proof**: Contains zero-knowledge proof anchors and verification data
7. **Table 6 - Signature**: Contains digital signatures and final plot seal

## PlotId Construction

The PlotId serves as the unique identifier for each plot and is constructed using a cryptographic hash that makes forgery mathematically impossible:

```
PlotId = SHA-256(
    publicKey ||              // Plot owner's public key (32 bytes)
    merkleRoot ||             // Root hash of all data in plot (32 bytes)  
    difficulty ||             // Computational work difficulty achieved (4 bytes)
    chiaBlockHeight ||        // Chia blockchain block height for temporal anchoring (8 bytes)
    chiaBlockHash             // Chia blockchain block hash for temporal anchoring (32 bytes)
)
```

### Forgery Prevention Properties

1. **Public Key Binding**: PlotId is cryptographically bound to the plot owner's public key
2. **Data Binding**: Merkle root ensures PlotId changes if any data in the plot is modified
3. **Work Binding**: Difficulty value proves computational work was performed for this specific plot
4. **Temporal Binding**: Chia block height and hash anchor the plot to a specific point in blockchain history
5. **Collision Resistance**: SHA-256 makes it computationally infeasible to create fake plots with the same PlotId

## Technical Specifications

For detailed technical information about plot file format, binary structures, and implementation details, see the [Technical Specifications](../../technical/plot-format.md) section.

## Attack Resistance

The plot system prevents multiple attack vectors:

- **Plot theft**: Cannot claim ownership of others' plots due to cryptographic binding
- **Data spoofing**: Cannot claim to store non-existent data due to Merkle tree verification
- **Precomputation attacks**: Cannot delete plots but continue serving cached proofs
- **Replay attacks**: Cannot reuse old proofs due to timestamp and nonce validation
- **Sybil attacks**: Cannot create fake plots cheaply due to proof-of-work requirements
- **Ownership fraud**: Cannot impersonate legitimate owners without private keys

## Network Applications

Plots enable several critical network functions:

- Prove you actually store the data you claim to store
- Verify storage providers have physical access to data
- Prevent Sybil attacks through proof-of-work requirements
- Enable [zero-knowledge verification](../../zk-proofs/overview.md) without revealing sensitive data
- Support [PlotCoin creation](../on-chain/plotcoin.md) for network registration
- Facilitate [reward distribution](../../network/rewards.md) based on verified storage

## Performance Characteristics

- **TB-scale plots**: Support for terabyte-scale storage containers
- **Constant memory**: Memory usage independent of plot size during verification
- **O(1) blob lookup**: Fast data retrieval through hash-based indexing
- **Streaming compatible**: Optimized for real-time data access
- **500MB/s throughput**: High-performance data serving capabilities

The plot system provides the foundational storage primitive that enables the DIG Network's decentralized, verifiable, and incentivized data storage capabilities. 