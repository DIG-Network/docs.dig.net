# DIG Network Protocol White Paper

The DIG Network Protocol aims to establish a robust and resilient distributed content delivery network. At its core, the protocol is designed to create a system of incentivized data persistence, ensuring that information remains available and resistant to censorship. This is achieved by leveraging blockchain technology, specifically the Chia blockchain, which serves as the foundational infrastructure for orchestrating the network and guaranteeing data integrity. The blockchain records proofs of data storage, retrieval and integrity, verifying that content is delivered accurately and reliably, even when requested from unknown or untrusted sources within the network.

Furthermore, the DIG Network Protocol introduces a utility token, the DIG Utility token, as part of its economic model. This token acts as the primary mechanism for incentivizing participants within the network. By rewarding nodes and providers with these tokens for maintaining and distributing data, the network ensures ongoing participation and fosters a cooperative environment. This incentive structure encourages the creation of a truly global and unstoppable data network, where various parties are motivated to collaborate and contribute to the system's integrity and availability. This approach is crucial for long-term sustainability and the network's ability to withstand attempts at censorship or disruption.

Finally, the protocol's practical applications are significant, especially in the realm of decentralized data storage. One immediate use case is providing a permanent storage layer for off-chain Non-Fungible Token (NFT) assets. This ensures that the data associated with NFTs, which often resides outside the blockchain, remains accessible and secure indefinitely. 

Another key application is supporting decentralized frontends for websites and applications. Especially DeFi frontends. These frontends, due to their distributed nature, become significantly harder to take down or censor, offering greater resilience and freedom of information.

The DIG Network Protocol thus aims to build a foundation for a more open, accessible, and robust digital ecosystem.

## DIG Network: A DataLayer for the Chia Blockchain

The DIG Network functions as a comprehensive **DataLayer** for the Chia blockchain, providing decentralized storage, content delivery, and data integrity services through a sophisticated system of interconnected primitives. By combining on-chain coordination mechanisms with off-chain storage solutions, the DIG Network creates a trustless, incentive-aligned infrastructure that extends Chia's capabilities beyond simple financial transactions to encompass arbitrary data storage and distribution.

The network operates through a carefully designed architecture of primitives that work together to create a complete decentralized storage ecosystem:

### On-Chain Primitives

These primitives exist as smart contracts and on-chain data structures on the Chia blockchain, providing coordination, verification, and incentive mechanisms:

**1. PlotCoin** - Blockchain registry entries that map data identifiers (blobIds) to storage providers, containing cryptographic proofs of data storage and network location information. PlotCoins serve as the fundamental building blocks for proving data availability and enabling reward distribution.

**2. Rewards Distributor** - On-chain escrow and distribution system that holds DIG tokens and distributes them to proven storage providers based on validator verification. Multiple distributors exist for different reward pools (main network rewards, content-specific bribes, etc.).

**3. DataStore** - NFT-based containers that represent collections of data with cryptographic integrity guarantees. DataStores provide ownership, versioning, and access control for arbitrary data sets while maintaining tamper-evident properties through Merkle root commitments.

**4. DIG Handles** - Human-readable domain names (*.dig) that map to DataStore identifiers, providing user-friendly access to stored content while creating market-driven value signals through paid registration and renewal processes.

**5. DIG Token** - A CAT (Chia Asset Token) that serves as the native utility token for the network, used for staking PlotCoins, registering DIG Handles, funding reward distributors, and governance. The token creates economic incentives that align participant behavior with network health and data availability.

### Off-Chain Primitives

These primitives exist as data structures and protocols that operate outside the blockchain while maintaining cryptographic verifiability:

**1. Plot** - Cryptographically secured storage containers that organize data blobs with embedded proof-of-work, digital signatures, and zero-knowledge proof capabilities. Plots serve as the fundamental unit of verifiable data storage, ensuring that storage providers can prove ownership and availability of data without revealing sensitive information.

**2. Quarry** *(Placeholder - To Be Described)* - Collections of related Plots that can be managed, distributed, and verified as cohesive units. Quarries provide higher-level organization and coordination mechanisms for large-scale data storage operations.

**3. Cart** *(Placeholder - To Be Described)* - Lightweight transport packages for moving blobs or collections of blobs without the computational overhead of full proof-of-work. Carts enable efficient data transfer and temporary storage while maintaining basic integrity guarantees.

### DataLayer Integration

The DIG Network primitives work together to form a complete DataLayer that extends the Chia blockchain's capabilities:

- **On-chain primitives** provide coordination, verification, and economic incentives
- **Off-chain primitives** handle actual data storage, transport, and cryptographic proofs  
- **Cross-layer integration** ensures that off-chain storage operations are verifiable and incentivized through on-chain mechanisms
- **Economic alignment** creates sustainable incentives for data preservation and availability
- **Cryptographic security** maintains data integrity and access control across both layers

This DataLayer architecture enables the Chia blockchain to support complex data storage and delivery applications while maintaining its core properties of decentralization, security, and economic sustainability.

## Off-Chain Primitives

### Plots - Cryptographically Secured Storage Containers

### What is a Plot?

A plot in the Dig Plot Storage system is a specialized cryptographic storage container that securely organizes and stores data blobs with built-in verification capabilities. Structurally, a plot is a binary file format consisting of multiple organized sections: a file header with essential metadata, an index section for fast lookups, table sections that chain together using cryptographic hashes and proof-of-work, data sections containing compressed blob storage, and verification sections with digital signatures and Merkle trees. Each plot is uniquely identified by a SHA-256 hash and is cryptographically tied to its owner through Chia Public Synthetic Key signatures. 

**Critical for Network Integrity**: The plot format incorporates proof-of-work mechanisms similar to blockchain technology, where each table requires computational work to create. This embedded proof-of-work is **absolutely critical** to the DIG Network's integrity and serves as the foundation for the entire incentive system. Without this computational commitment, malicious actors could easily claim credit for storing data they don't actually possess, undermining the network's reward distribution and making it impossible to distinguish between legitimate storage providers and fraudulent ones.

**Preventing Storage Credit Theft**: The proof-of-work requirement ensures that DIG Nodes can only earn rewards for data they have genuinely invested computational effort to store. This prevents "storage credit theft" where nodes might attempt to take credit for someone else's storage work. Since creating a valid plot requires significant computational work that must be performed with the actual data, it becomes economically infeasible to fake storage claims. This cryptographic guarantee is what makes the DIG Network's incentive program possible - validators can trust that rewarded nodes are actually contributing storage capacity to the network rather than just claiming rewards for work they haven't done.

Plots enable a powerful multi-layered proof system that provides cryptographic guarantees about data ownership, integrity, and computational work. Here's what you can prove using plots:

### Core Cryptographic Proofs:

1. Plot Creation Proof  
   1. **What it proves:** That a plot was originally created by a specific private key holder.  
   2. **Security Guarantees:** Prevents plot theft, even if someone copies your plot file they can not prove they created it.  
   3. **Use Cases:** Establishing original ownership, preventing forgery attacks.  
2. Data Inclusion Proof  
   1. **What it proves:** That a specific blob (file/data) actually exists in the plot’s structure  
   2. **How it works:** Uses Merkle tree cryptography to provide mathematical proof of data existence  
   3. **Privacy options:** Can prove data exists without revealing the actual data contents (zero-knowledge)  
   4. **Use cases:** Verifying data storage without exposing sensitive information  
3. Ownership Verification:  
   1. **What it proves:** That the current data comes from the legitimate plot owner  
   2. **Methods:** Digital signatures, challenge-response protocols, zero-knowledge ownership proofs  
   3. **Advanced features:** Interactive verification, ownership transfer proofs, revocation support  
   4. **Use cases:** Access control, authentication, ownership transfers  
4. Physical Access Proof  
   1. **What it proves:** That the owner has actual physical access to their plot data (not just cached proofs)  
   2. **How it works:** Requires real-time computation using actual plot data within time constraints (\~1 Chia Block)  
   3. **Attack prevention:** Stops precomputation attacks where someone deletes their plot but serves cached proofs  
   4. **Use cases:** Ensuring genuine storage, preventing storage fraud  
5. Computational Work Proof  
   1. **What it proves:** That significant computational effort was invested in plot creation. Ensures that data retrieved from plot is provably backed by work and not proxied from another source.  
   2. **Standard mode:** Proves minimum difficulty threshold was met  
   3. **Zero-knowledge mode:** Proves difficulty ≥ threshold without revealing actual difficulty value’

### Plot Proof System: Technical Implementation

The DIG Plot proof system implements a sophisticated multi-layered cryptographic architecture that combines proof-of-work mechanisms, digital signatures, and Merkle tree verification to ensure data integrity, ownership authenticity, and computational commitment. This technical implementation provides the foundation for the network's security guarantees and attack resistance.

#### Proof-of-Work Implementation

**Hash-Chain Based Proof-of-Work**

The DIG Plot format incorporates a blockchain-inspired proof-of-work system where each table in the plot requires computational work to create. This creates a verifiable chain of computational effort that prevents just-in-time plot creation and ensures genuine storage commitment.

**Table Structure and Mining Process:**

```
Table Header:
- Previous Table Hash (32 bytes): SHA-256 hash of the previous table
- Merkle Root (32 bytes): Root hash of all data blobs in this table  
- Nonce (8 bytes): Random value incremented during mining
- Difficulty Target (4 bytes): Required leading zero bits in hash
- Work Difficulty (4 bytes): Actual difficulty achieved
- Timestamp (8 bytes): Unix timestamp of table creation
- Data Size (8 bytes): Total size of data in this table
```

**Mining Algorithm:**

1. **Target Calculation**: The difficulty target specifies the number of leading zero bits required in the table hash
2. **Nonce Iteration**: Starting from nonce = 0, increment the nonce value for each attempt
3. **Hash Computation**: Calculate SHA-256(table_header || nonce || table_data)
4. **Difficulty Check**: Verify that the resulting hash meets the difficulty target
5. **Chain Validation**: Ensure the previous table hash creates a valid chain
6. **Work Recording**: Store the final nonce and achieved difficulty in the table header

**Difficulty Adjustment**:
- Minimum difficulty: 20 leading zero bits (approximately 1 million hashes)
- Standard difficulty: 24 leading zero bits (approximately 16 million hashes)  
- High security: 28+ leading zero bits (256+ million hashes)
- Adaptive difficulty based on data importance and network requirements

#### Proof Lifecycle and Timing

**When Proofs Are Created:**

1. **Plot Creation Time** (permanent proofs stored in plot file):
   - Plot Creation Proof: Generated once when plot is created (uses most recent Chia block for temporal anchoring)
   - Data Inclusion Proof (Merkle Tree): Built from all blobs in plot
   - Computational Work Proof: Generated during plot mining process

2. **PlotCoin Creation Time** (proofs stored in PlotCoin on blockchain):
   - Ownership Verification Proof: Generated when PlotCoin is minted
   - **ZK Physical Access Proof**: Generated fresh each epoch when PlotCoin is created
   - All plot creation time proofs are referenced/included

3. **Validation Time** (verification of stored proofs):
   - Validators verify all stored proofs in the PlotCoin
   - No additional proof generation required during validation
   - Physical access is proven by the stored proof from PlotCoin creation

**Key Constraints:**
- ZK Physical Access Proof blockHeight must be: `PlotCoin.creationBlock ≤ ProofBlock ≤ PlotCoin.creationBlock + 10`
- Since PlotCoins are regenerated every epoch (~7 days), fresh physical access proof is created each epoch
- This proves plot owner had physical access to their data when creating the PlotCoin

#### Core Proof Types: ZK-SNARK Implementation

All proofs in the DIG Network use ZK-SNARK (Zero-Knowledge Succinct Non-Interactive Arguments of Knowledge) circuits compiled with circom to provide cryptographic verification without revealing sensitive information. These circuits use field-native Poseidon hash functions optimized for the BN254 elliptic curve, ensuring both privacy and computational efficiency.

**ZK-SNARK Circuit Architecture**

Each proof type is implemented as a dedicated circom circuit that:
- Takes private inputs (sensitive data) and public inputs (commitments)
- Performs cryptographic computations within the circuit constraints
- Outputs a succinct proof that can be verified independently
- Uses Poseidon hash functions for field-native operations
- Employs commitment schemes to hide sensitive values while enabling verification

**Proof Generation and Verification Workflow**

```
Universal Proof Generation Pattern:

ALGORITHM: Generate Zero-Knowledge Proof
INPUT: 
  - sensitiveData: Private information we want to prove about (but keep secret)
  - publicParameters: Public verification settings

OUTPUT: A zero-knowledge proof package

STEPS:
  1. GENERATE RANDOM BLINDING FACTORS
     // Create random numbers to hide our sensitive data
     Create random values: random1, random2, random3, ... randomN
     
  2. CREATE COMMITMENTS (Hide sensitive data behind cryptographic commitments)
     // A commitment is like putting data in a sealed envelope
     commitment1 = Hash(sensitiveValue1 + random1)
     commitment2 = Hash(sensitiveValue2 + random2)
     commitment3 = Hash(sensitiveValue3 + random3)
     ... continue for all sensitive values
     
  3. GENERATE THE SNARK PROOF
     // Prove we know the secret data without revealing it
     privateInputs = [sensitiveValue1, sensitiveValue2, ..., random1, random2, ...]
     publicInputs = [commitment1, commitment2, commitment3, ..., publicParameters]
     
     // The circuit validates our claims about the data
     snarkProof = GenerateProofUsingCircuit(privateInputs, publicInputs)
     
  4. CREATE REPLAY PROTECTION
     // Prevent someone from reusing this proof later
     uniqueID = Hash(privateKey + commitment1 + commitment2 + ... + proofVersion)
     
  5. RECORD THE PROOF TO PREVENT REUSE
     Add uniqueID to NullifierDatabase
     
  6. RETURN THE COMPLETE PROOF
     Return: (commitment1, commitment2, ..., snarkProof, uniqueID)

---

Universal Proof Verification Pattern:

ALGORITHM: Verify Zero-Knowledge Proof
INPUT:
  - proof: The zero-knowledge proof package to verify
  - verificationParameters: Expected values and network settings

OUTPUT: TRUE if proof is valid, FALSE otherwise

STEPS:
  1. CHECK FOR PROOF REUSE
     // Make sure this proof hasn't been used before
     IF uniqueID already exists in NullifierDatabase:
         RETURN FALSE (this proof was already used)
     
  2. VERIFY EXPECTED RELATIONSHIPS
     // Check if proof commitments match what we expect
     IF we have expected commitment values:
         FOR each expected commitment:
             IF proof commitment doesn't match expected value:
                 RETURN FALSE (proof doesn't match expected data)
     
  3. VERIFY THE CRYPTOGRAPHIC PROOF
     // Check that the SNARK proof is mathematically valid
     publicInputs = [proof.commitment1, proof.commitment2, ..., verificationParameters]
     isValidProof = VerifySnarkWithCircuitKey(proof.snarkProof, publicInputs)
     
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

## PlotCoin Blockchain Integration: Decentralized Proof Registry

The DIG Network uses PlotCoins as a decentralized proof registry on the Chia blockchain. PlotCoins serve as registry entries that map blobIds to their storage providers, containing both ZK proof packages and network location information. This creates a trustless, queryable registry where validators can discover who is storing specific blobs and verify their proofs without direct communication.

### PlotCoin Registry Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         PlotCoin Proof Registry Architecture                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  PLOT OWNERS: Generate Proofs & Register in PlotCoin Registry                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐           │   │
│  │  │   Plot Data   │───▶│  ZK Proof     │───▶│   PlotCoin    │           │   │
│  │  │   + Network   │    │  Generation   │    │   Registry    │           │   │
│  │  │   Location    │    │  (5 proofs)   │    │   Entry       │           │   │
│  │  └───────────────┘    └───────────────┘    └───────────────┘           │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                            │
│                                    ▼                                            │
│                                                                                 │
│  CHIA BLOCKCHAIN: Decentralized PlotCoin Registry                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        PlotCoin Registry                                │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │   │
│  │  │ blobId: "document_123"                                          │   │   │
│  │  │ ┌─────────────────────┐ ┌─────────────────────┐ ┌────────────┐  │   │   │
│  │  │ │ PlotCoin A          │ │ PlotCoin B          │ │ PlotCoin C │  │   │   │
│  │  │ │ owner: 0x1a2b...    │ │ owner: 0x7g8h...    │ │ owner: ... │  │   │   │
│  │  │ │ proofs: [ZK-PKG]    │ │ proofs: [ZK-PKG]    │ │ proofs: ..│  │   │   │
│  │  │ │ location: server1   │ │ location: server2   │ │ location:.│  │   │   │
│  │  │ │ stake: 1000 DIG     │ │ stake: 1500 DIG     │ │ stake: ...│  │   │   │
│  │  │ └─────────────────────┘ └─────────────────────┘ └────────────┘  │   │   │
│  │  └─────────────────────────────────────────────────────────────────┘   │   │
│  │                                                                         │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │   │
│  │  │ blobId: "image_456"                                             │   │   │
│  │  │ ┌─────────────────────┐ ┌─────────────────────┐                 │   │   │
│  │  │ │ PlotCoin D          │ │ PlotCoin E          │                 │   │   │
│  │  │ │ owner: 0x3c4d...    │ │ owner: 0x9k1l...    │                 │   │   │
│  │  │ │ proofs: [ZK-PKG]    │ │ proofs: [ZK-PKG]    │                 │   │   │
│  │  │ │ location: server3   │ │ location: server4   │                 │   │   │
│  │  │ │ stake: 800 DIG      │ │ stake: 1200 DIG     │                 │   │   │
│  │  │ └─────────────────────┘ └─────────────────────┘                 │   │   │
│  │  └─────────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                            │
│                                    ▼                                            │
│                                                                                 │
│  VALIDATORS: Query Registry & Verify Proofs                                    │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐           │   │
│  │  │ Query Registry│───▶│ Extract Proofs│───▶│ Zero-Knowledge│           │   │
│  │  │ by blobId     │    │ & Verify ZK   │    │ Verification  │           │   │
│  │  │               │    │ Packages      │    │ (no secrets)  │           │   │
│  │  └───────────────┘    └───────────────┘    └───────────────┘           │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Plot Owner: ZK Proof Generation and Registry Submission

Plot owners generate complete ZK proof packages containing all five proof types, then create PlotCoin registry entries on the blockchain:

```
ALGORITHM: Create PlotCoin Registry Entry
PURPOSE: Generate ZK proof package and create PlotCoin registry entry for a specific blobId

INPUT:
  - plotData: Complete plot file data
  - privateKey: Plot owner's private key
  - blobId: Specific blob being registered
  - currentChiaBlock: Current Chia blockchain state
  - digTokens: DIG tokens to stake
  - networkLocation: Server location where blob can be accessed

OUTPUT: PlotCoin registry entry created on Chia blockchain

STEPS:
  1. GENERATE COMPLETE ZK PROOF PACKAGE
     // Create all 5 ZK proofs as specified in previous sections
     proofPackage = {
       zkPlotCreationProof: GeneratePlotCreationProof(...),
       zkDataInclusionProof: GenerateDataInclusionProof(...),
       zkOwnershipProof: GenerateOwnershipProof(...),
       zkComputationalWorkProof: GenerateComputationalWorkProof(...),
       zkPhysicalAccessProof: GeneratePhysicalAccessProof(...),
       proofVersion: "ZK-2.0",
       packageNullifier: GeneratePackageNullifier()
     }
  
  2. SERIALIZE PROOF PACKAGE FOR BLOCKCHAIN STORAGE
     // Convert proof package to blockchain-compatible format
     serializedPackage = SerializeProofPackage(proofPackage)
     
     // Validate serialization integrity
     ValidateSerializationIntegrity(serializedPackage)
  
  3. CREATE PLOTCOIN REGISTRY ENTRY
     // Create PlotCoin as a registry entry mapping blobId to storage provider
     plotCoin = {
       owner: publicKey,                     // Plot owner who stores this blob
       blobId: blobId,                      // Unique blob identifier for registry lookup
       memo: serializedPackage,             // Complete ZK proof package (registry proof)
       stakedTokens: digTokens,             // Economic commitment for registry entry
       epochExpiry: GetCurrentEpoch() + 1,  // Registry entry expiration
       networkLocation: networkLocation,    // Where validators can access the blob
       locationSignature: SignNetworkLocation(privateKey, networkLocation, plotId, blobId)
     }
  
  4. VALIDATE PLOTCOIN BEFORE SUBMISSION
     // Ensure PlotCoin meets all requirements before blockchain submission
     ValidatePlotCoinStructure(plotCoin)
     ValidateProofPackageIntegrity(plotCoin.memo)
     ValidateStakeAmount(plotCoin.stakedTokens)
     ValidateEpochExpiry(plotCoin.epochExpiry)
  
  5. SUBMIT TO CHIA BLOCKCHAIN
     // Submit PlotCoin to Chia blockchain
     transactionId = SubmitToChiaBlockchain(plotCoin)
     
     // Wait for blockchain confirmation
     blockHeight = WaitForConfirmation(transactionId)
  
  6. RETURN SUBMISSION RESULT
     return {
       plotCoinId: transactionId,
       blockHeight: blockHeight,
       proofPackageHash: Hash(serializedPackage),
       submissionTimestamp: Date.now()
     }
```

### Chia Blockchain: Immutable PlotCoin Registry Storage

The Chia blockchain serves as the immutable, distributed registry where PlotCoins map blobIds to their storage providers and proof packages:

```
BLOCKCHAIN STORAGE ARCHITECTURE:

Chia Blockchain Block Structure:
┌─────────────────────────────────────────────────────────────┐
│                    Chia Block N                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Standard Chia Transactions:                               │
│  • XCH transfers                                           │
│  • CAT token transactions                                  │
│  • NFT operations                                          │
│                                                             │
│  DIG Network PlotCoins:                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ PlotCoin 1:                                         │   │
│  │ • owner: 0x1a2b3c...                                │   │
│  │ • blobId: "document_123"                            │   │
│  │ • memo: [SERIALIZED_ZK_PROOF_PACKAGE_2.1KB]        │   │
│  │ • stakedTokens: 1000 DIG                            │   │
│  │ • epochExpiry: 4567890                              │   │
│  │ • networkLocation: {...}                            │   │
│  │ • locationSignature: 0x4d5e6f...                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ PlotCoin 2:                                         │   │
│  │ • owner: 0x7g8h9i...                                │   │
│  │ • blobId: "document_123"                            │   │
│  │ • memo: [SERIALIZED_ZK_PROOF_PACKAGE_2.1KB]        │   │
│  │ • stakedTokens: 1500 DIG                            │   │
│  │ • epochExpiry: 4567890                              │   │
│  │ • networkLocation: {...}                            │   │
│  │ • locationSignature: 0xaj1k2l...                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [Additional PlotCoins for same blobId...]                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Key Properties:
• PlotCoins are discoverable by blobId hash
• Multiple PlotCoins can exist for same blobId (different owners)
• Each PlotCoin contains complete ZK proof package
• Blockchain provides immutable audit trail
• Global distribution via Chia network
```

### Validators: Registry Query and Proof Verification

Validators query the PlotCoin registry by blobId to discover storage providers, then extract and verify ZK proof packages without learning sensitive information:

```
ALGORITHM: Validator Registry Query and Verification Workflow
PURPOSE: Query PlotCoin registry for blobId storage providers and verify their ZK proof packages

INPUT:
  - blobId: Identifier of blob to validate
  - validationEpoch: Current validation epoch
  - networkParameters: Network validation settings

OUTPUT: Comprehensive validation results for all registered storage providers

STEPS:
  1. QUERY PLOTCOIN REGISTRY BY BLOBID
     // Query the decentralized registry to find all storage providers for this blobId
     allPlotCoins = QueryPlotCoinRegistry({
       blobId: blobId,
       epochRange: [validationEpoch - 1, validationEpoch],
       status: "active"
     })
     
     console.log(`Found ${allPlotCoins.length} storage providers registered for blob ${blobId}`)
  
  2. EXTRACT ZK PROOF PACKAGES FROM BLOCKCHAIN DATA
     validPlotCoins = []
     
     FOR each plotCoin in allPlotCoins:
       try:
         // Deserialize proof package from blockchain memo field
         proofPackage = DeserializeProofPackage(plotCoin.memo)
         
         // Validate basic structure
         ValidateProofPackageStructure(proofPackage)
         
         // Ensure proof package version compatibility
         IF proofPackage.proofVersion == "ZK-2.0":
           validPlotCoins.append({
             plotCoin: plotCoin,
             proofPackage: proofPackage,
             retrievedAt: Date.now()
           })
       catch (error):
         LogInvalidPlotCoin(plotCoin.id, error)
  
  3. COMPREHENSIVE ZK PROOF VERIFICATION (Zero-Knowledge)
     validationResults = []
     
     FOR each entry in validPlotCoins:
       // Perform complete zero-knowledge verification (validator learns nothing sensitive)
       result = PerformZKVerification(entry.proofPackage, {
         minimumConfidence: 0.95,
         minDifficulty: networkParameters.minDifficulty,
         maxAge: 24 * 60 * 60 * 1000,  // 24 hours
         plotCoinCreationBlock: entry.plotCoin.blockHeight,
         enableSNARKInputValidation: true,
         blobId: blobId
       })
       
       // Enhanced validation with blockchain context
       result.blockchainValidation = ValidateBlockchainContext(
         entry.plotCoin,
         entry.proofPackage,
         validationEpoch
       )
       
       validationResults.append({
         plotCoinId: entry.plotCoin.id,
         owner: entry.plotCoin.owner,
         networkLocation: entry.plotCoin.networkLocation,
         verificationResult: result,
         blockHeight: entry.plotCoin.blockHeight,
         validatedAt: Date.now()
       })
  
  4. CROSS-PLOTCOIN FRAUD DETECTION
     // Detect fraudulent or duplicate registrations across all PlotCoins
     fraudDetectionResult = RunCrossPlotCoinFraudDetection(validationResults)
     
     // Remove fraudulent entries
     legitimateResults = FilterLegitimateResults(
       validationResults,
       fraudDetectionResult
     )
  
  5. UPDATE REWARD DISTRIBUTION
     // Update DIG Reward Distributor based on validation results
     FOR each result in legitimateResults:
       IF result.verificationResult.isValid AND result.verificationResult.confidence >= 0.95:
         AddToRewardDistributor(result.owner, blobId, result.verificationResult.confidence)
       ELSE:
         RemoveFromRewardDistributor(result.owner, blobId)
  
  6. GENERATE COMPREHENSIVE VALIDATION REPORT
  return {
       blobId: blobId,
       validationEpoch: validationEpoch,
       totalPlotCoinsFound: allPlotCoins.length,
       validPlotCoinsProcessed: validPlotCoins.length,
       legitimateResults: legitimateResults.length,
       fraudulentResults: validationResults.length - legitimateResults.length,
       
       // Aggregate statistics
       averageConfidence: CalculateAverageConfidence(legitimateResults),
       highConfidenceCount: CountHighConfidence(legitimateResults),
       
       // Detailed results
       results: legitimateResults,
       fraudDetection: fraudDetectionResult,
       
       // Performance metrics
       totalVerificationTime: CalculateTotalTime(),
       avgVerificationTimePerPlotCoin: CalculateAvgTime(),
       
       validatedAt: Date.now()
     }
```

### Blockchain-Enhanced Verification Process

The blockchain integration adds additional verification layers that strengthen the overall security:

```
ENHANCED VERIFICATION WITH BLOCKCHAIN CONTEXT:

1. TEMPORAL VALIDATION
   // Verify PlotCoin timing constraints
   - PlotCoin creation timestamp must be recent (within current epoch)
   - Physical access proof must align with PlotCoin creation time
   - Epoch expiry must be future-dated
   
2. ECONOMIC VALIDATION
   // Verify economic commitments
   - Staked DIG tokens must meet minimum requirements
   - Stake must be active and not previously slashed
   - Economic penalties for invalid proofs
   
3. NETWORK LOCATION VALIDATION
   // Verify network binding authenticity
   - Network location signature must be valid for this specific PlotCoin
   - Cannot reuse network signatures from other PlotCoins
   - IP address ownership verification
   
4. CROSS-PLOTCOIN CONSISTENCY
   // Detect conflicts across multiple PlotCoins
   - Same plot cannot be registered from multiple network locations
   - Computational work cannot be reused across PlotCoins
   - Nullifier uniqueness across all blockchain submissions
   
5. BLOCKCHAIN INTEGRITY
   // Verify blockchain data integrity
   - PlotCoin transaction must be confirmed and final
   - Block hash references must match actual Chia blockchain
   - No double-spending of staked tokens
```

### Validator Privacy Guarantees

The blockchain-mediated verification preserves complete zero-knowledge properties:

```
PRIVACY PRESERVATION THROUGH BLOCKCHAIN LAYER:

VALIDATORS LEARN FROM BLOCKCHAIN:
✅ PlotCoin exists and was properly submitted
✅ Economic stake was committed
✅ Network location claims
✅ Temporal boundaries (creation time, expiry)
✅ Cryptographic proof validity

VALIDATORS NEVER LEARN:
❌ Actual plot data content
❌ Plot owner's private keys  
❌ Plot internal structure
❌ Data blob contents
❌ Merkle tree details
❌ Specific computational work values
❌ Internal network configurations

This preserves the zero-knowledge property end-to-end:
Plot Owner → Blockchain → Validator
```

### Performance and Scalability

The blockchain integration provides excellent scalability characteristics:

```
BLOCKCHAIN SCALABILITY METRICS:

STORAGE EFFICIENCY:
• ZK Proof Package Size: ~2-4KB per PlotCoin
• Blockchain Overhead: <1KB per PlotCoin
• Total Storage per Proof: <5KB regardless of plot size
• Supports TB+ plots with constant blockchain footprint

VERIFICATION EFFICIENCY:
• Blockchain Query Time: ~100-500ms per blobId lookup
• Proof Deserialization: ~10-50ms per PlotCoin
• ZK Verification Time: ~300-700ms per proof package
• Total Validation Time: ~500ms-2s for multiple PlotCoins

NETWORK EFFICIENCY:
• No direct communication required between validators and plot owners
• All verification done through blockchain queries
• Supports offline plot owners during validation
• Decentralized validation without coordination
```

**PlotCoin Registry Summary**

*(See the complete "PlotCoin Blockchain Integration: Decentralized Proof Registry" section above for detailed implementation)*

The PlotCoin system creates a decentralized proof registry on the Chia blockchain that maps blobIds to their storage providers:

**Plot Owners** - Create PlotCoin registry entries containing complete ZK proof packages (all 5 proof types) plus network location information for each blobId they store.

**Chia Blockchain Registry** - PlotCoins serve as permanent registry entries on the blockchain. Each PlotCoin maps a specific blobId to a storage provider and contains:
- Complete serialized ZK proof package (~2-4KB)
- Economic stake (DIG tokens)  
- Network location where blob can be accessed
- Temporal constraints (epoch expiry)

**Validators** - Query the registry by blobId to discover all storage providers, extract ZK proof packages from registry entries, and perform zero-knowledge verification without learning sensitive information.

**Key Benefits:**
- ✅ **Decentralized Verification**: No direct communication required between validators and plot owners
- ✅ **Zero-Knowledge Privacy**: Validators learn nothing sensitive about plot data or private keys
- ✅ **Immutable Audit Trail**: Blockchain provides permanent record of all proof submissions
- ✅ **Scalable Storage**: Constant ~5KB blockchain footprint regardless of plot size
- ✅ **Economic Security**: Staking requirements prevent spam and align incentives

**Registry Workflow:**
```
Plot Owner                    PlotCoin Registry                Validators
     │                       (Chia Blockchain)                      │
     │ 1. Generate ZK Proofs       │                             │
     │ 2. Create Registry Entry    │                             │
     │────────────────────────────▶│                             │
     │                             │ PlotCoin Registry:          │
     │                             │ blobId → [storage providers]│
     │                             │                             │ 3. Query Registry by blobId
     │                             │◄────────────────────────────│
     │                             │ 4. Return PlotCoin entries  │
     │                             │────────────────────────────▶│
     │                             │                             │ 5. Extract ZK Proofs
     │                             │                             │ 6. Verify (Zero-Knowledge)
     │                             │                             │ 7. Update Rewards
```

This architecture ensures that the DIG Network maintains complete decentralization while preserving zero-knowledge properties end-to-end.

**1. ZK Plot Creation Proof Implementation**

Proves that a specific private key holder originally created the plot at a verifiable point in blockchain history without revealing plot metadata:

**Proof Structure and Generation**

```
Plot Creation Proof Structure:
{
    plotCommitment: Hidden commitment to the plot identifier
    keyCommitment: Hidden commitment to the owner's public key  
    blockCommitment: Hidden commitment to blockchain anchor data
    snarkProof: Cryptographic proof of plot creation
    uniqueID: Prevents proof reuse
}

ALGORITHM: Generate Plot Creation Proof
PURPOSE: Prove you created a plot at a specific time without revealing plot details

INPUT: 
  - privateKey: Your secret key
  - publicKey: Your public key  
  - plotId: Unique identifier for your plot
  - merkleRoot: Root hash of all data in the plot
  - difficulty: Computational work difficulty achieved
  - blockInfo: Recent blockchain block (height and hash)
  - minDifficulty: Network minimum difficulty requirement

OUTPUT: Zero-knowledge proof of plot creation

STEPS:
  1. GENERATE RANDOM HIDING VALUES
     // Create random numbers to hide our sensitive data
     plotRandom = GenerateRandomNumber()
     keyRandom = GenerateRandomNumber()
     blockRandom = GenerateRandomNumber()
     
  2. PREPARE DATA FOR CRYPTOGRAPHIC PROCESSING
     // Convert all data to cryptographic field elements
     plotId_field = ConvertToFieldElement(plotId)
     publicKey_field = ConvertToFieldElement(publicKey)
     difficulty_field = ConvertToFieldElement(difficulty)
     blockHeight_field = ConvertToFieldElement(blockInfo.height)
     blockHash_field = ConvertToFieldElement(blockInfo.hash)
  
  3. CREATE HIDDEN COMMITMENTS
     // Hide our data behind cryptographic commitments
     plotCommitment = Hash(plotId_field + plotRandom)
     keyCommitment = Hash(publicKey_field + keyRandom)
     blockCommitment = Hash(blockHeight_field + blockHash_field + blockRandom)
  
  4. GENERATE ZERO-KNOWLEDGE PROOF
     // Prove our claims without revealing the actual data
     
     SECRET_INPUTS = [
       privateKey, publicKey, plotId, merkleRoot, difficulty,
       blockHeight, blockHash, plotRandom, keyRandom, blockRandom
     ]
     
     PUBLIC_INPUTS = [
       plotCommitment, keyCommitment, blockCommitment, minDifficulty
     ]
     
     PROOF_VALIDATES_THAT:
       - plotCommitment correctly hides plotId
       - keyCommitment correctly hides publicKey
       - blockCommitment correctly hides blockchain data
       - difficulty meets minimum requirement
       - plotId was properly derived from public key, merkle root, difficulty, and blockchain data
     
     snarkProof = GenerateZKProof(SECRET_INPUTS, PUBLIC_INPUTS, VALIDATION_RULES)
  
  5. CREATE REPLAY PROTECTION
     uniqueID = Hash(privateKey + plotCommitment)
  
  6. RECORD TO PREVENT REUSE
     Add uniqueID to NullifierDatabase
  
  7. RETURN COMPLETE PROOF
     Return: (plotCommitment, keyCommitment, blockCommitment, snarkProof, uniqueID)

---

ALGORITHM: Verify Plot Creation Proof
PURPOSE: Check if a plot creation proof is valid without learning anything about the plot

INPUT:
  - proof: The plot creation proof to verify
  - minDifficulty: Network's minimum difficulty requirement

OUTPUT: TRUE if proof is valid, FALSE otherwise

STEPS:
  1. CHECK FOR PROOF REUSE
     // Make sure this proof hasn't been used before
     IF uniqueID already exists in NullifierDatabase:
         RETURN FALSE (proof already used)
  
  2. VERIFY THE CRYPTOGRAPHIC PROOF
     // Check that the SNARK proof is mathematically sound
     publicInputs = [
    proof.plotCommitment,
    proof.keyCommitment,
    proof.blockCommitment,
       minDifficulty
     ]
     
     isValidProof = VerifyZKProof(proof.snarkProof, publicInputs)
  
  3. VERIFY CONSISTENCY
     // Make sure the unique ID matches what the proof claims
     expectedID = ExtractUniqueIDFromProof(proof.snarkProof)
     isConsistent = (expectedID equals proof.uniqueID)
  
  4. RECORD SUCCESSFUL VERIFICATION
     IF proof is valid AND consistent:
         Add uniqueID to NullifierDatabase (mark as used)
  
  5. RETURN RESULT
     RETURN (isValidProof AND isConsistent)
```

**2. ZK Data Inclusion Proof Implementation**

Proves that specific blob data exists within the plot's Merkle tree structure without revealing the data content or tree structure:

**Proof Structure and Generation**

```
Data Inclusion Proof Structure:
{
    dataCommitment: Hidden commitment to the blob data hash
    rootCommitment: Hidden commitment to the Merkle tree root
    positionCommitment: Hidden commitment to where data sits in the tree
    timestampCommitment: Hidden commitment to when proof was created
    snarkProof: Cryptographic proof of data inclusion
    uniqueID: Prevents proof reuse
}

ALGORITHM: Generate Data Inclusion Proof
PURPOSE: Prove a specific piece of data exists in your plot without revealing the data or tree structure

INPUT:
  - blobData: The actual data blob you want to prove exists
  - merkleRoot: Root hash of the complete Merkle tree
  - leafIndex: Position of this data in the tree (0, 1, 2, ...)
  - merklePath: Sibling hashes needed to verify inclusion
  - pathDirections: Left/right directions up the tree

OUTPUT: Zero-knowledge proof that data exists in the plot

STEPS:
  1. GENERATE RANDOM HIDING VALUES
     // Create random numbers to hide our sensitive data
     dataRandom = GenerateRandomNumber()
     rootRandom = GenerateRandomNumber()
     positionRandom = GenerateRandomNumber()
     timestampRandom = GenerateRandomNumber()
     
  2. PREPARE DATA FOR CRYPTOGRAPHIC PROCESSING
     // Convert all data to cryptographic field elements
     blobHash = Hash(blobData)
     blobHash_field = ConvertToFieldElement(blobHash)
     merkleRoot_field = ConvertToFieldElement(merkleRoot)
     leafIndex_field = ConvertToFieldElement(leafIndex)
     timestamp_field = ConvertToFieldElement(GetCurrentTime())
     pathElements_array = ConvertArrayToFieldElements(merklePath)
     pathDirections_array = ConvertArrayToFieldElements(pathDirections)
  
  3. CREATE HIDDEN COMMITMENTS
     // Hide our data behind cryptographic commitments
     dataCommitment = Hash(blobHash_field + dataRandom)
     rootCommitment = Hash(merkleRoot_field + rootRandom)
     positionCommitment = Hash(leafIndex_field + positionRandom)
     timestampCommitment = Hash(timestamp_field + timestampRandom)
  
  4. GENERATE ZERO-KNOWLEDGE PROOF
     // Prove the data exists in the tree without revealing the data or tree structure
     
     SECRET_INPUTS = [
       blobHash, pathElements_array, pathDirections_array,
       dataRandom, rootRandom, positionRandom, timestampRandom, timestamp
     ]
     
     PUBLIC_INPUTS = [
       dataCommitment, rootCommitment, positionCommitment, timestampCommitment
     ]
     
     PROOF_VALIDATES_THAT:
       - dataCommitment correctly hides the blob hash
       - rootCommitment correctly hides the merkle root
       - positionCommitment correctly hides the position in tree
       - timestampCommitment correctly hides the timestamp
       - Following the merkle path from the blob hash leads to the merkle root
     
     snarkProof = GenerateZKProof(SECRET_INPUTS, PUBLIC_INPUTS, VALIDATION_RULES)
  
  5. CREATE REPLAY PROTECTION
     uniqueID = Hash(blobHash + dataCommitment)
  
  6. RECORD TO PREVENT REUSE
     Add uniqueID to NullifierDatabase
  
  7. RETURN COMPLETE PROOF
     Return: (dataCommitment, rootCommitment, positionCommitment, timestampCommitment, snarkProof, uniqueID)

---

ALGORITHM: Verify Data Inclusion Proof
PURPOSE: Check if data inclusion proof is valid without learning anything about the data

INPUT:
  - proof: The data inclusion proof to verify
  - expectedRootCommitment: (Optional) Expected merkle root commitment

OUTPUT: TRUE if proof is valid, FALSE otherwise

STEPS:
  1. CHECK FOR PROOF REUSE
     // Make sure this proof hasn't been used before
     IF uniqueID already exists in NullifierDatabase:
         RETURN FALSE (proof already used)
  
  2. VERIFY EXPECTED ROOT (if provided)
     // Check if the merkle root matches what we expect
     IF expectedRootCommitment is provided:
         IF proof.rootCommitment does not equal expectedRootCommitment:
             RETURN FALSE (root doesn't match expected plot)
  
  3. VERIFY THE CRYPTOGRAPHIC PROOF
     // Check that the SNARK proof is mathematically sound
     publicInputs = [
    proof.dataCommitment,
    proof.rootCommitment,
       proof.positionCommitment,
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

**3. ZK Ownership Verification Implementation**

Proves the current plot data comes from the legitimate owner without revealing the owner's identity:

**Proof Structure and Generation**

```
Ownership Proof Structure:
{
    ownerCommitment: Hidden commitment to the owner's public key
    plotCommitment: Hidden commitment to the plot identifier
    blobCommitment: Hidden commitment to the specific blob data
    timestampCommitment: Hidden commitment to when proof was created
    snarkProof: Cryptographic proof of ownership with digital signatures
    uniqueID: Prevents proof reuse
}

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

---

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

**4. ZK Computational Work Proof Implementation**

Proves that computational work was performed and is cryptographically bound to both the plotId and blobId without revealing any sensitive details:

**Critical Role in Incentive Program Integrity**

The computational work proof is the cornerstone of the DIG Network's ability to operate a fair and fraud-resistant incentive program. This proof serves as cryptographic evidence that a DIG Node has made a genuine computational investment in storing specific data, making it economically impossible to claim rewards for storage they haven't actually performed.

**Why This Matters for the Network:**
- **Prevents Reward Theft**: Nodes cannot claim DIG token rewards for data stored by others
- **Ensures Economic Fairness**: Only nodes that invest computational resources can earn proportional rewards
- **Enables Trustless Validation**: Validators can verify storage claims without trusting individual nodes
- **Creates Sustainable Economics**: The network can reliably reward genuine storage providers, making the entire ecosystem economically viable

Without this computational work requirement, the DIG Network's incentive program would be vulnerable to exploitation where malicious actors could claim rewards without providing any actual storage services, ultimately destroying the economic foundation that makes the network sustainable.

**Important: Validator Authority Over Difficulty Requirements**

While plot owners can create plots with any difficulty level they choose, **validators have sole authority over the minimum difficulty thresholds they will accept for reward distribution**. This creates a dynamic incentive system where:

- **Plot Owner Freedom**: Can plot at any difficulty (1, 10, 20, 50+ leading zero bits)
- **Validator Control**: Sets minimum thresholds for reward eligibility
- **Dynamic Thresholds**: Difficulty requirements can vary based on:
  - Specific blobId characteristics (file size, content type, popularity)
  - Network congestion levels
  - Historical performance metrics
  - Economic conditions (DIG token value, storage costs)
  - Seasonal demand patterns

**Example Validator Difficulty Policy:**
```
Base Minimum Difficulty: 20 bits

Dynamic Adjustments:
- Popular content (>1000 requests/day): +4 bits = 24 bits minimum
- Large files (>100MB): +2 bits = 22 bits minimum  
- High network congestion: +3 bits = 23 bits minimum
- Low DIG token price: +5 bits = 25 bits minimum
- Critical infrastructure data: +8 bits = 28 bits minimum

Effective Minimum = max(Base + all applicable adjustments)
```

This validator authority ensures that:
1. **Network Security**: Higher value content requires more computational commitment
2. **Economic Balance**: Difficulty adjusts to maintain profitable incentives
3. **Quality Control**: Prevents spam and low-effort participation
4. **Market Responsiveness**: Thresholds adapt to changing network conditions

**Proof Structure and Generation**

```
Computational Work Proof Structure:
{
    plotCommitment: Hidden commitment to the plot identifier
    blobCommitment: Hidden commitment to the blob identifier
    tableCommitment: Hidden commitment to the table data hash
    workCommitment: Hidden commitment to the proof-of-work result (computed automatically)
    snarkProof: Cryptographic proof that work is bound to both plot and blob
    uniqueID: Prevents proof reuse
}

ALGORITHM: Generate Computational Work Proof  
PURPOSE: Prove computational work was done and is cryptographically bound to specific plot and blob

INPUT:
  - plotId: Unique identifier for your plot
  - blobId: Unique identifier for the specific blob
  - nonce: The proof-of-work nonce that was found
  - tableData: The actual table data that was worked on
  - actualDifficulty: The difficulty level actually achieved
  - minDifficulty: Network's minimum difficulty requirement

OUTPUT: Zero-knowledge proof of bound computational work

STEPS:
  1. GENERATE RANDOM HIDING VALUES
     // Create random numbers to hide our sensitive data
     plotRandom = GenerateRandomNumber()
     blobRandom = GenerateRandomNumber()
     tableRandom = GenerateRandomNumber()
     
  2. PREPARE DATA FOR CRYPTOGRAPHIC PROCESSING
     // Convert all data to cryptographic field elements
     plotId_field = ConvertToFieldElement(plotId)
     blobId_field = ConvertToFieldElement(blobId)
     nonce_field = ConvertToFieldElement(nonce)
     tableHash = Hash(tableData)
     tableHash_field = ConvertToFieldElement(tableHash)
     actualDifficulty_field = ConvertToFieldElement(actualDifficulty)
     minDifficulty_field = ConvertToFieldElement(minDifficulty)
  
  3. COMPUTE THE BOUND WORK HASH
     // Create a hash that ties the work to BOTH the plot AND the blob
     // This prevents work from being moved between different plots or blobs
     workHash = Hash(nonce_field + plotId_field + blobId_field + tableHash_field)
  
  4. CREATE HIDDEN COMMITMENTS
     // Hide our data behind cryptographic commitments
     plotCommitment = Hash(plotId_field + plotRandom)
     blobCommitment = Hash(blobId_field + blobRandom)
     tableCommitment = Hash(tableHash_field + tableRandom)
  
  5. GENERATE WORK COMMITMENT (deterministic to prevent manipulation)
     // The work blinding factor is calculated deterministically to prevent cheating
     workBlindingFactor = Hash(plotId_field + blobId_field + nonce_field)
     workCommitment = Hash(workHash + workBlindingFactor)
  
  6. GENERATE ZERO-KNOWLEDGE PROOF
     // Prove the work is valid and bound without revealing details
     
     SECRET_INPUTS = [
       plotId, blobId, nonce, tableHash, actualDifficulty,
       plotRandom, blobRandom, tableRandom
     ]
     
     PUBLIC_INPUTS = [
       plotCommitment, blobCommitment, tableCommitment, minDifficulty
     ]
     
     PROOF_VALIDATES_THAT:
       - plotCommitment correctly hides the plot ID
       - blobCommitment correctly hides the blob ID
       - tableCommitment correctly hides the table hash
       - workHash = Hash(nonce + plotId + blobId + tableHash)
       - actualDifficulty meets minimum requirement
       - workHash has the required number of leading zeros
       - workCommitment = Hash(workHash + Hash(plotId + blobId + nonce))
     
     snarkProof = GenerateZKProof(SECRET_INPUTS, PUBLIC_INPUTS, VALIDATION_RULES)
  
  7. CREATE REPLAY PROTECTION
     uniqueID = Hash(nonce + plotId + blobId + workCommitment)
  
  8. RECORD TO PREVENT REUSE
     Add uniqueID to NullifierDatabase
  
  9. RETURN COMPLETE PROOF
     Return: (plotCommitment, blobCommitment, tableCommitment, workCommitment, snarkProof, uniqueID)

---

ALGORITHM: Verify Computational Work Proof
PURPOSE: Check if computational work proof is valid and properly bound

INPUT:
  - proof: The computational work proof to verify
  - minDifficulty: Network's minimum difficulty requirement
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
       proof.plotCommitment,
       proof.blobCommitment,
       proof.tableCommitment,
       minDifficulty
     ]
     
     isValidProof = VerifyZKProof(proof.snarkProof, publicInputs)
  
  4. VERIFY OUTPUT CONSISTENCY
     // Make sure the work commitment and unique ID match what the proof claims
     expectedWorkCommitment = ExtractWorkCommitmentFromProof(proof.snarkProof)
     expectedUniqueID = ExtractUniqueIDFromProof(proof.snarkProof)
     
     workMatches = (expectedWorkCommitment equals proof.workCommitment)
     idMatches = (expectedUniqueID equals proof.uniqueID)
     isConsistent = (workMatches AND idMatches)
  
  5. RECORD SUCCESSFUL VERIFICATION
     IF proof is valid AND consistent:
         Add uniqueID to NullifierDatabase (mark as used)
  
  6. RETURN RESULT
     RETURN (isValidProof AND isConsistent)
```

**5. ZK Physical Access Proof Implementation (Block-Based Freshness)**

**Important**: This proof is generated when creating PlotCoins each epoch (~7 days). It proves the plot owner had physical access to their data when minting the PlotCoin, without revealing plot contents or owner identity.

**Proof Structure and Generation**

```
Physical Access Proof Structure:
{
    plotCommitment: Hidden commitment to the plot data hash
    ownerCommitment: Hidden commitment to the owner's public key
    timestampCommitment: Hidden commitment to when proof was created
    blockCommitment: Hidden commitment to the blockchain anchor
    snarkProof: Cryptographic proof of physical access during PlotCoin creation
    uniqueID: Prevents proof reuse
}

ALGORITHM: Generate Physical Access Proof
PURPOSE: Prove you had physical access to your plot data when creating a PlotCoin (done each epoch)

INPUT:
  - plotData: The actual plot file data (proves physical access)
  - privateKey: Your secret key (proves ownership)
  - publicKey: Your public key (identity)
  - currentChiaBlock: Current blockchain block (proves timing)

OUTPUT: Zero-knowledge proof of physical access during PlotCoin creation

STEPS:
  1. GENERATE RANDOM HIDING VALUES
     // Create random numbers to hide our sensitive data
     plotRandom = GenerateRandomNumber()
     ownerRandom = GenerateRandomNumber()
     timestampRandom = GenerateRandomNumber()
     blockRandom = GenerateRandomNumber()
     
  2. PREPARE DATA FOR CRYPTOGRAPHIC PROCESSING
     // Convert all data to cryptographic field elements
     plotHash = Hash(plotData)
     plotHash_field = ConvertToFieldElement(plotHash)
     privateKey_field = ConvertToFieldElement(privateKey)
     publicKey_field = ConvertToFieldElement(publicKey)
     blockHeight_field = ConvertToFieldElement(currentChiaBlock.height)
     blockHash_field = ConvertToFieldElement(currentChiaBlock.hash)
     timestamp_field = ConvertToFieldElement(GetCurrentTime())
  
  3. CREATE HIDDEN COMMITMENTS
     // Hide our data behind cryptographic commitments
     plotCommitment = Hash(plotHash_field + plotRandom)
     ownerCommitment = Hash(publicKey_field + ownerRandom)
     timestampCommitment = Hash(timestamp_field + timestampRandom)
     blockCommitment = Hash(blockHeight_field + blockHash_field + blockRandom)
  
  4. GENERATE ACCESS SIGNATURE
     // Create a signature that proves we have the private key AND plot data AND current blockchain state
     accessMessage = Hash(plotHash_field + blockHash_field + timestamp_field)
     accessSignature = DigitallySign(privateKey, accessMessage)
  
  5. GENERATE ZERO-KNOWLEDGE PROOF
     // Prove physical access without revealing plot data or owner identity
     
     SECRET_INPUTS = [
       plotHash, privateKey, publicKey, blockHeight, blockHash, timestamp,
       accessSignature, plotRandom, ownerRandom, timestampRandom, blockRandom
     ]
     
     PUBLIC_INPUTS = [
       plotCommitment, ownerCommitment, timestampCommitment, blockCommitment
     ]
     
     PROOF_VALIDATES_THAT:
       - plotCommitment correctly hides the plot hash
       - ownerCommitment correctly hides the public key
       - timestampCommitment correctly hides the timestamp
       - blockCommitment correctly hides the blockchain data
       - accessSignature is a valid signature over (plotHash + blockHash + timestamp)
       - publicKey correctly corresponds to privateKey
       - blockHeight is positive (basic freshness check)
     
     snarkProof = GenerateZKProof(SECRET_INPUTS, PUBLIC_INPUTS, VALIDATION_RULES)
  
  6. CREATE REPLAY PROTECTION
     uniqueID = Hash(privateKey + blockHash + timestamp)
  
  7. RECORD TO PREVENT REUSE
     Add uniqueID to NullifierDatabase
  
  8. RETURN COMPLETE PROOF
     Return: (plotCommitment, ownerCommitment, timestampCommitment, blockCommitment, snarkProof, uniqueID)

---

ALGORITHM: Verify Physical Access Proof
PURPOSE: Check if physical access proof is valid without learning plot details

INPUT:
  - proof: The physical access proof to verify
  - expectedPlotCommitment: (Optional) Expected plot commitment
  - plotCoinCreationEpoch: (Optional) When the PlotCoin was created

OUTPUT: TRUE if proof is valid, FALSE otherwise

STEPS:
  1. CHECK FOR PROOF REUSE
     // Make sure this proof hasn't been used before
     IF uniqueID already exists in NullifierDatabase:
         RETURN FALSE (proof already used)
  
  2. VERIFY EXPECTED PLOT (if provided)
     // Check if the plot matches what we expect
     IF expectedPlotCommitment is provided:
         IF proof.plotCommitment does not equal expectedPlotCommitment:
             RETURN FALSE (plot doesn't match expected)
  
  3. VERIFY EPOCH TIMING CONSTRAINT (if provided)
     // Physical access proof must be from PlotCoin creation epoch
     IF plotCoinCreationEpoch is provided:
         blockHeight = ExtractBlockHeightFromProof(proof.blockCommitment)
         timeDifference = AbsoluteValue(blockHeight - plotCoinCreationEpoch)
         
         IF timeDifference > MAX_BLOCK_DISTANCE:
             RETURN FALSE (proof is too old or too new)
  
  4. VERIFY THE CRYPTOGRAPHIC PROOF
     // Check that the SNARK proof is mathematically sound
     publicInputs = [
    proof.plotCommitment,
    proof.ownerCommitment,
       proof.timestampCommitment,
       proof.blockCommitment
     ]
     
     isValidProof = VerifyZKProof(proof.snarkProof, publicInputs)
  
  5. VERIFY CONSISTENCY
     // Make sure the unique ID matches what the proof claims
     expectedID = ExtractUniqueIDFromProof(proof.snarkProof)
     isConsistent = (expectedID equals proof.uniqueID)
  
  6. RECORD SUCCESSFUL VERIFICATION
     IF proof is valid AND consistent:
         Add uniqueID to NullifierDatabase (mark as used)
  
  7. RETURN RESULT
     RETURN (isValidProof AND isConsistent)
```

#### Cryptographic Verification Process

**Multi-Stage Verification Pipeline**

The proof verification process involves multiple cryptographic checks performed in sequence to ensure complete plot authenticity:

**Stage 1: Plot Header Verification**
```
1. Validate magic bytes (0x44494750 "DIGP")
2. Check file format version compatibility  
3. Verify file size and structure integrity
4. Validate Chia Public Synthetic Key format
5. Confirm plot ID matches SHA-256(public_key || merkle_root || difficulty || chia_block_height || chia_block_hash)
```

**Stage 2: Table Chain Verification**
```
For each table in sequence:
1. Verify previous table hash linkage
2. Validate proof-of-work nonce and difficulty
3. Check timestamp progression (monotonic increase)
4. Confirm Merkle root calculation
5. Validate table data integrity
```

**Stage 3: Digital Signature Verification**
```
1. Extract plot owner's Chia Public Synthetic Key
2. Reconstruct signature message:
   - Plot ID (32 bytes)
   - Table count (4 bytes) 
   - Total data size (8 bytes)
   - Merkle root of all tables (32 bytes)
3. Verify Chia Synthetic Key signature over message
4. Confirm signature timestamp within acceptable range
```

**Stage 4: Merkle Tree Verification**
```
1. Reconstruct Merkle tree from all blob hashes
2. Verify each blob's position in tree
3. Validate Merkle proofs for requested blobs
4. Check tree root matches plot header
5. Confirm no missing or duplicate blobs
```

#### Proof Package Structure

Each PlotCoin contains a comprehensive zero-knowledge proof package that enables validators to verify plot authenticity without learning any sensitive information:

```
Complete ZK-SNARK Proof Package Structure:

ProofPackage := {
    // 1. ZK Plot Creation Proof (blockchain-anchored, reveals no plot details)
    zkPlotCreationProof := {
        C_plot: FieldElement,          // Commitment to plotId
        C_key: FieldElement,           // Commitment to public key
        C_block: FieldElement,         // Commitment to Chia block
        π_creation: SNARKProof,        // ZK-SNARK from plot creation circuit
        nullifier: FieldElement        // Unique nullifier for replay protection
    },
  
  // 2. ZK Data Inclusion Proof (reveals no data content or tree structure)
    zkDataInclusionProof := {
        C_data: FieldElement,          // Commitment to blob data
        C_root: FieldElement,          // Commitment to Merkle root
        C_pos: FieldElement,           // Commitment to leaf position
        C_time: FieldElement,          // Commitment to timestamp
        π_inclusion: SNARKProof,       // ZK-SNARK from merkle membership circuit
        nullifier: FieldElement        // Unique nullifier for replay protection
    },
  
  // 3. ZK Ownership Verification Proof (reveals no owner identity)
    zkOwnershipProof := {
        C_owner: FieldElement,         // Commitment to owner's public key
        C_plot: FieldElement,          // Commitment to plot metadata
        C_blob: FieldElement,          // Commitment to blob data
        C_time: FieldElement,          // Commitment to proof timestamp
        π_signature: SNARKProof,       // ZK-SNARK from ownership signature circuit
        nullifier: FieldElement        // Unique nullifier for replay protection
    },
    
    // 4. ZK Computational Work Proof (comprehensive work binding)
    zkComputationalWorkProof := {
        C_plot: FieldElement,          // Commitment to plotId
        C_blob: FieldElement,          // Commitment to blobId
        C_table: FieldElement,         // Commitment to table data
        C_work: FieldElement,          // Commitment to work hash (computed in circuit)
        π_binding: SNARKProof,         // ZK-SNARK from computational work circuit
        nullifier: FieldElement        // Unique nullifier for replay protection
    },
    
    // 5. ZK Physical Access Proof (proves access during PlotCoin creation)
    zkPhysicalAccessProof := {
        C_plot: FieldElement,          // Commitment to plot data
        C_owner: FieldElement,         // Commitment to owner's public key
        C_time: FieldElement,          // Commitment to proof timestamp
        C_block: FieldElement,         // Commitment to Chia block
        π_access: SNARKProof,          // ZK-SNARK from physical access circuit
        nullifier: FieldElement        // Unique nullifier for replay protection
    },
  
  // Package metadata
    proofVersion: String,              // Version identifier (e.g., "ZK-2.0")
    packageNullifier: FieldElement     // Master nullifier for entire package
}

Network-wide ZK-SNARK Parameters:

CIRCUIT_PROVING_KEYS := {
    plot_creation: ProvingKey("plot_creation.zkey"),
    merkle_membership: ProvingKey("merkle_membership.zkey"),
    ownership_signature: ProvingKey("ownership_signature.zkey"),
    computational_work: ProvingKey("computational_work.zkey"),
    physical_access: ProvingKey("physical_access.zkey")
}

CIRCUIT_VERIFYING_KEYS := {
    plot_creation: VerifyingKey("plot_creation_vkey.json"),
    merkle_membership: VerifyingKey("merkle_membership_vkey.json"),
    ownership_signature: VerifyingKey("ownership_signature_vkey.json"),
    computational_work: VerifyingKey("computational_work_vkey.json"),
    physical_access: VerifyingKey("physical_access_vkey.json")
}

Network Constants:
NETWORK_MIN_DIFFICULTY := 20                    // Minimum 20 leading zero bits
MAX_BLOCK_DISTANCE := 10                        // Physical access proof constraint
BN254_FIELD_SIZE := 21888242871839275222246405745257275088548364400416034343698204186575808495617
POSEIDON_DOMAINS := {                           // Domain separation for commitments
    PLOT_CREATION: "DIG_PLOT_CREATION",
    DATA_INCLUSION: "DIG_DATA_INCLUSION", 
    OWNERSHIP: "DIG_OWNERSHIP",
    COMPUTATIONAL_WORK: "DIG_COMPUTATIONAL_WORK",
    PHYSICAL_ACCESS: "DIG_PHYSICAL_ACCESS"
}
```

**Circuit Compilation and Key Generation**

The ZK-SNARK circuits are compiled using circom and snarkjs, with trusted setup ceremonies for generating proving and verifying keys:

```
ALGORITHM: Compile ZK-SNARK Circuits for Production
PURPOSE: Create trusted cryptographic keys for all five proof types used in the network

INPUT: Circuit definitions for the five proof types
OUTPUT: Trusted proving and verifying keys deployed across the network

STEPS:
  REPEAT FOR EACH CIRCUIT TYPE:
  [plot_creation, merkle_membership, ownership_signature, computational_work, physical_access]
  
    1. COMPILE CIRCUIT TO MATHEMATICAL CONSTRAINTS
       // Convert human-readable circuit into mathematical constraint system
       constraintSystem = CompileCircuitDefinition(circuit.sourceCode)
       
       // This creates a system of mathematical equations that the circuit must satisfy
       
    2. PERFORM TRUSTED SETUP CEREMONY
       // Generate cryptographic parameters through community ceremony
       // Multiple independent parties contribute randomness to ensure security
       universalParameters = ConductTrustedSetupCeremony(
         ellipticCurve: BN254,
         powerLevel: 16,  // Supports circuits with up to 65,536 constraints
         participants: CommunityContributors
       )
       
    3. GENERATE CIRCUIT-SPECIFIC CRYPTOGRAPHIC KEYS
       // Create proving and verifying keys specific to this circuit
       (provingKey, verifyingKey) = GenerateCircuitKeys(
         constraintSystem,
         universalParameters
       )
       
    4. SECURE KEY GENERATION THROUGH MULTI-PARTY COMPUTATION
       // Multiple parties contribute randomness to make keys secure
       // Even if some parties are malicious, keys remain secure
       finalProvingKey = MultiPartyKeyGeneration(
         initialProvingKey: provingKey,
         contributors: TrustedCommunityMembers,
         contributionRounds: 3
       )
       
       finalVerifyingKey = ExtractVerifyingKey(finalProvingKey)
       
    5. VALIDATE KEY CORRECTNESS
       // Make sure the keys work correctly together
       ValidateKeyPair(finalProvingKey, finalVerifyingKey)
       
    6. DEPLOY KEYS TO NETWORK
       // Store proving keys for plot owners to use
       NETWORK_PROVING_KEYS[circuit] = finalProvingKey
       
       // Store verifying keys for validators to use
       NETWORK_VERIFYING_KEYS[circuit] = finalVerifyingKey
       
    7. DISTRIBUTE TO ALL VALIDATORS
       // Send verifying keys to all network validators
       SendToAllValidators(finalVerifyingKey, circuit.name)

---

ALGORITHM: Validate Network Cryptographic Keys
PURPOSE: Ensure all validators are using the correct, secure cryptographic keys

INPUT: The cryptographic keys deployed across the network
OUTPUT: TRUE if all keys are valid and secure, FALSE otherwise

STEPS:
  FOR EACH CIRCUIT TYPE in the network:
  
    1. VERIFY CRYPTOGRAPHIC INTEGRITY
       // Make sure the keys haven't been corrupted or tampered with
       checksumValid = VerifyKeyChecksum(circuit.verifyingKey)
       
       IF NOT checksumValid:
           RETURN FALSE (key corruption detected)
    
    2. VALIDATE AGAINST TRUSTED SETUP
       // Ensure keys were generated from the legitimate trusted setup ceremony
       setupConsistent = ValidateAgainstTrustedSetup(
         circuit.verifyingKey,
         networkTrustedSetup
       )
       
       IF NOT setupConsistent:
           RETURN FALSE (key not from trusted setup)
    
    3. CONFIRM VALIDATOR CONSENSUS
       // Make sure majority of validators agree on these keys
       validatorAgreement = CheckValidatorConsensus(
         circuit.verifyingKey,
         minimumAgreementPercentage: 67  // Require 2/3 majority
       )
       
       IF NOT validatorAgreement:
           RETURN FALSE (validators don't agree on keys)
    
    4. CHECK KEY FRESHNESS
       // Ensure keys aren't too old (security best practice)
       keyAge = GetKeyAge(circuit.verifyingKey)
       
       IF keyAge > MAX_ACCEPTABLE_KEY_AGE:
           RETURN FALSE (keys too old, need refresh)
  
  // If we get here, all keys passed validation
  RETURN TRUE (all keys are valid and secure)

---

IMPORTANT SECURITY NOTES:
- Trusted setup ceremony requires multiple independent parties
- If even one party in the setup is honest, the keys remain secure
- Proving keys allow generating proofs but don't compromise security
- Verifying keys can be publicly shared without security risk
- Keys should be refreshed periodically for best security practices
```

#### Block-Based Freshness Proof

To prevent precomputation attacks and ensure plots contain recent data, the system uses blockchain-based freshness proofs that can be validated passively without direct communication:

**Freshness Proof Generation:**
```
1. Plot owner references a recent Chia block height and hash
2. Block height and hash are embedded in the proof package
3. Proof demonstrates plot was created at least as recent as that block
4. No real-time interaction required between validator and plot owner
```

**Proof Structure:**
```
1. Block Height: Recent Chia blockchain block number
2. Block Hash: Corresponding SHA-256 hash of that block
3. Proof Timestamp: When the proof package was generated
4. Plot Signature: Chia Synthetic Key signature over (plot_data || block_hash || timestamp)
```

**Passive Verification:**
```
1. Validator checks block height exists on Chia blockchain
2. Verifies block hash matches the claimed block height
3. Confirms proof timestamp is reasonably recent to block time
4. Validates Chia Synthetic Key signature includes the block hash
5. Ensures plot cannot predate the referenced block
```

#### Complete Verification Workflow

Shows how all proof types work together for comprehensive plot validation:

```
ALGORITHM: Complete Plot Verification (Detailed Analysis)
PURPOSE: Perform comprehensive verification of all plot proofs with detailed results

INPUT:
  - plotCoin: PlotCoin from the Chia blockchain
  - requestedBlobId: The specific blob being requested
  - networkParameters: Network validation settings

OUTPUT: Detailed verification results showing which proofs passed/failed

STEPS:
  1. INITIALIZE DETAILED RESULT TRACKING
     // Set up structure to track each verification step
     verificationResult = {
       plotCreationValid: FALSE,
       dataInclusionValid: FALSE,
       ownershipValid: FALSE,
       computationalWorkValid: FALSE,
       physicalAccessValid: FALSE,
       overallValid: FALSE,
       errorDetails: []
     }
  
  2. EXTRACT PROOF PACKAGE FROM PLOTCOIN
     // Get the embedded proof package
     proofPackage = DeserializeFromBytes(plotCoin.memo)
  
  3. VERIFY PLOT CREATION PROOF (learns nothing about plot details)
     // Check that plot was properly created with sufficient work
     verificationResult.plotCreationValid = VerifyPlotCreationProof(
       proofPackage.zkPlotCreationProof,
       networkParameters.NETWORK_MIN_DIFFICULTY
     )
     
     IF NOT verificationResult.plotCreationValid:
         Add "Plot creation proof failed" to errorDetails
  
  4. VERIFY DATA INCLUSION PROOF (learns nothing about data content)
     // Check that requested blob actually exists in the plot
     verificationResult.dataInclusionValid = VerifyDataInclusionProof(
       proofPackage.zkDataInclusionProof,
       proofPackage.zkPlotCreationProof.plotCommitment  // Must match plot
     )
     
     IF NOT verificationResult.dataInclusionValid:
         Add "Data inclusion proof failed" to errorDetails
  
  5. VERIFY OWNERSHIP PROOF (learns nothing about owner identity)
     // Check that the person serving data is the legitimate owner
     verificationResult.ownershipValid = VerifyOwnershipProof(
       proofPackage.zkOwnershipProof,
       proofPackage.zkPlotCreationProof.plotCommitment,    // Expected plot
       proofPackage.zkDataInclusionProof.dataCommitment    // Expected blob
     )
     
     IF NOT verificationResult.ownershipValid:
         Add "Ownership proof failed" to errorDetails
  
  6. VERIFY COMPUTATIONAL WORK PROOF (verifies work is bound to plot and blob)
     // Check that computational work is tied to both plot and specific blob
     verificationResult.computationalWorkValid = VerifyComputationalWorkProof(
       proofPackage.zkComputationalWorkProof,
       networkParameters.NETWORK_MIN_DIFFICULTY,
       proofPackage.zkPlotCreationProof.plotCommitment,    // Expected plot
       proofPackage.zkDataInclusionProof.dataCommitment    // Expected blob
     )
     
     IF NOT verificationResult.computationalWorkValid:
         Add "Computational work proof failed" to errorDetails
  
  7. VERIFY PHYSICAL ACCESS PROOF (stored from PlotCoin creation epoch)
     // Check that owner had physical access to plot when creating PlotCoin
     verificationResult.physicalAccessValid = VerifyPhysicalAccessProof(
       proofPackage.zkPhysicalAccessProof,
       proofPackage.zkPlotCreationProof.plotCommitment,    // Expected plot
       plotCoin.creationBlockHeight                        // Timing constraint
     )
     
     IF NOT verificationResult.physicalAccessValid:
         Add "Physical access proof failed" to errorDetails
  
  8. DETERMINE OVERALL VALIDITY
     // All proofs must pass for overall validity
     verificationResult.overallValid = (
       verificationResult.plotCreationValid AND
       verificationResult.dataInclusionValid AND
       verificationResult.ownershipValid AND
       verificationResult.computationalWorkValid AND
       verificationResult.physicalAccessValid
     )
     
     IF NOT verificationResult.overallValid:
         Add "Overall verification failed - see individual proof results" to errorDetails
  
  9. RETURN DETAILED RESULTS
     Return verificationResult

---

IMPORTANT NOTES:
- Physical Access Proof is stored in PlotCoin during creation
- No network requests are needed during validation
- Validators only verify the stored proofs
- All verification happens using zero-knowledge proofs (no sensitive data revealed)

Verification Result Structure:
{
  plotCreationValid: TRUE/FALSE,      // Plot was properly created
  dataInclusionValid: TRUE/FALSE,     // Blob exists in the plot
  ownershipValid: TRUE/FALSE,         // Served by legitimate owner
  computationalWorkValid: TRUE/FALSE, // Work is bound to plot and blob
  physicalAccessValid: TRUE/FALSE,    // Owner had physical access when creating PlotCoin
  overallValid: TRUE/FALSE,           // All proofs passed
  errorDetails: [list of error messages if any proofs failed]
}
```

#### Cryptographic Binding Architecture

The enhanced ZK proof system creates a web of cryptographic bindings that ensure work integrity:

**Work-to-Plot-to-Blob Binding Chain:**
```
Work Hash = SHA256(tableHeader || nonce || plotId || blobId || tableData)
```

This architecture ensures:
1. **Work ↔ Plot Binding**: Computational work cannot be moved between different plots
2. **Work ↔ Blob Binding**: Computational work cannot be reused for different blobs within the same plot  
3. **Plot ↔ Blob Binding**: Data inclusion proofs are tied to the specific plot they were created for
4. **Ownership ↔ All Binding**: Ownership proofs cover both the plot and specific blob relationships

**Attack Prevention Through Binding:**
- **Work Theft Prevention**: Cannot steal work from one plot and claim it for another
- **Blob Substitution Prevention**: Cannot substitute different blob data while keeping the same work
- **Cross-Plot Attacks**: Cannot mix proofs from different plots in invalid combinations
- **Temporal Integrity**: All proofs must be generated for the same plot/blob combination

#### Privacy and Security Benefits

The zero-knowledge proof system provides unprecedented privacy and security for the DIG Network:

**Privacy Guarantees:**
- **Plot Metadata Privacy**: Validators learn nothing about plot IDs, creation times, or difficulty levels
- **Owner Identity Privacy**: Plot owners remain completely anonymous during verification
- **Data Content Privacy**: Blob data and Merkle tree structure remain hidden
- **Work Details Privacy**: Computational work proofs reveal no nonce or hash values
- **Access Pattern Privacy**: Physical access verification reveals no timing or access patterns

**Security Properties:**
- **Unlinkability**: Multiple proofs from the same plot cannot be linked together
- **Non-repudiation**: Proofs are cryptographically bound to plot owners
- **Replay Protection**: Nullifiers prevent reuse of any proof
- **Forgery Resistance**: Impossible to create valid proofs without actual plot ownership
- **Sybil Resistance**: Computational work requirements prevent fake plot creation
- **Work Binding**: Computational work is cryptographically bound to both plotId and blobId
- **Cross-Proof Integrity**: All proofs are interconnected through commitment relationships
- **Attack Prevention**: Cannot reuse work from one plot/blob for another

**Performance Characteristics:**
- **Constant Verification Time**: All proofs verify in O(1) time regardless of plot size
- **Minimal Network Overhead**: Proof packages are ~2-4KB regardless of plot size (TB scale)
- **Parallel Verification**: All ZK proofs can be verified concurrently
- **No Plot Access Required**: Verification requires no access to actual plot data
- **No Network Calls**: Physical access verification requires no validator-to-plot-owner communication

**Epoch-Based Physical Access Benefits:**
- **Automatic Freshness**: Each PlotCoin regeneration proves current physical access
- **Validator Efficiency**: No need to contact plot owners during validation
- **Attack Prevention**: Cannot create PlotCoins without current physical access to plot data
- **Temporal Binding**: Physical access proof is temporally bound to PlotCoin creation epoch

#### Performance Characteristics

**Verification Timing:**
- Plot header verification: ~1ms
- Table chain verification: ~5ms per table
- Merkle proof verification: ~2ms per blob
- Digital signature verification: ~3ms per signature
- Full plot verification: ~50-500ms depending on size

**Computational Requirements:**
- Minimum difficulty mining: ~1 million hashes (1-10 seconds on modern CPU)
- Standard difficulty mining: ~16 million hashes (30-300 seconds)
- High security mining: ~256 million hashes (10-60 minutes)

**Storage Overhead:**
- Proof package size: ~500-1000 bytes per blob
- Table headers: ~128 bytes per table
- Merkle tree storage: ~64 bytes per blob
- Signature storage: ~200 bytes per plot

#### Attack Prevention Mechanisms

The DIG Network's proof-of-work based plot system prevents multiple critical attack vectors that would otherwise undermine the incentive program and network integrity:

**Storage Credit Theft Prevention (Critical for Incentives):**
The most fundamental protection is against storage credit theft - where nodes attempt to earn rewards for data they don't actually store. The proof-of-work embedded in each plot table requires computational effort that can only be performed with access to the actual data. This makes it cryptographically impossible for a node to claim storage rewards without genuinely investing resources in storing the data. Without this protection, the entire incentive system would collapse as fraudulent nodes could claim rewards without providing any storage service to the network.

**Plot Grinding Prevention:**
The proof-of-work requirement makes it computationally expensive to create plots on-demand, preventing "just-in-time" plot generation attacks where attackers claim to store data they don't actually possess. This forces nodes to make long-term storage commitments.

**Proxy Storage Attack Prevention:**
Nodes cannot simply proxy requests to other storage providers while claiming the storage rewards for themselves. The proof-of-work binding ensures that only the node that performed the computational work on the actual data can generate valid proofs.

**Precomputation Attack Prevention:**
Block-based freshness proofs ensure that plot proofs cannot be generated before a specific blockchain block exists, preventing attacks where old cached proofs are reused after deleting actual data.

**Sybil Attack Resistance:**
The computational cost of creating valid plots with proof-of-work makes it economically infeasible to create large numbers of fake plots, providing natural Sybil resistance and ensuring the incentive program rewards genuine storage capacity rather than fake identities.

**Replay Attack Prevention:**
Block height references and timestamps in proof packages prevent reuse of old proofs, ensuring that verification always reflects recent plot creation relative to blockchain progression.

**Fork and Reorg Protection:**
Table hash chains create an immutable sequence that prevents retroactive modification of plot contents without recomputing all subsequent proof-of-work.

**Economic Integrity Protection:**
By preventing these attacks, the proof-of-work system ensures that DIG token rewards flow only to nodes providing genuine storage services. This economic integrity is essential for maintaining network participant trust and ensuring the long-term sustainability of the incentive program.

This comprehensive proof system ensures that DIG Network participants can cryptographically verify data storage, ownership, and availability while maintaining resistance to a wide range of attacks and providing the security guarantees necessary for a trustless decentralized storage network.

### Network Applications of DIG Plots

* Prove you actually store the data you claim to store  
* Verify storage providers have physical access to data  
* Prevent Sybil attacks through proof-of-work requirements

### Attack Resistance

The plot system prevents multiple attack vectors:

* **Plot theft:** Cannot claim ownership of others' plots  
* **Data spoofing:** Cannot claim to store non-existent data  
* **Precomputation attacks:** Cannot delete plots but continue serving cached proofs  
* **Replay attacks:** Cannot reuse old proofs due to timestamp and nonce validation  
* **Sybil attacks:** Cannot create fake plots or Just In Time Plots cheaply due to proof-of-work requirements (Plot Grinding)  
* **Ownership fraud:** Cannot impersonate legitimate owners without private keys

## Plot Format and Technical Specifications

The DIG Plot file format represents a sophisticated binary storage system designed for cryptographically-secured, high-performance data storage with built-in proof-of-work security. This section provides comprehensive technical specifications, binary layouts, and implementation details for the complete plot architecture.

### Overview and Design Principles

The DIG Plot format implements a **7-table blockchain-inspired architecture** where each table contains cryptographic proof-of-work, creating an immutable chain of computational effort bound to specific data. This design provides:

- **Forgery Prevention**: Cryptographic work requirements prevent just-in-time plot creation
- **Data Integrity**: Hash chains and Merkle trees ensure tamper-evident storage
- **Performance Optimization**: Multi-layered indexing for O(1) lookups
- **Scalability**: Streaming architecture supports terabyte-scale plots
- **Security**: Zero-knowledge proof integration for privacy-preserving verification

### Binary File Structure Overview

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

### File Header: Binary Layout and Specifications

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

**Feature Flags (16-bit bitfield):**
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

### Metadata Section: Extended Plot Configuration

The metadata section contains extended plot configuration and settings using a variable-length TLV (Type-Length-Value) format:

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

**Plot Configuration (64 bytes):**
```
Offset │ Size │ Field                    │ Description
───────┼──────┼──────────────────────────┼──────────────────────────────────
0x00   │   4  │ configVersion            │ Metadata format version
0x04   │   4  │ plotType                 │ Plot type (0=Standard, 1=Compressed, etc.)
0x08   │   8  │ targetSize               │ Target plot size in bytes
0x10   │   8  │ actualSize               │ Actual plot size achieved
0x18   │   4  │ tableStrategy            │ Table generation strategy
0x1C   │   4  │ indexStrategy            │ Indexing strategy used
0x20   │   8  │ creationDuration         │ Time to create plot (milliseconds)
0x28   │   8  │ memoryUsage              │ Peak memory usage during creation
0x30   │   8  │ cpuTime                  │ CPU time consumed during creation
0x38   │   8  │ reserved                 │ Reserved for future use
```

**Compression Settings (32 bytes):**
```
Offset │ Size │ Field                    │ Values
───────┼──────┼──────────────────────────┼──────────────────────────────────
0x00   │   2  │ algorithm                │ 0=None, 1=GZIP, 2=ZSTD, 3=LZ4, 4=Brotli
0x02   │   2  │ level                    │ Compression level (1-9)
0x04   │   4  │ blockSize                │ Compression block size
0x08   │   4  │ dictionarySize           │ Dictionary size for algorithms that support it
0x0C   │   8  │ originalSize             │ Size before compression
0x14   │   8  │ compressedSize           │ Size after compression
0x1C   │   4  │ compressionRatio         │ Ratio * 1000 (e.g., 750 = 75%)
```

**Difficulty Settings (24 bytes):**
```
Offset │ Size │ Field                    │ Description
───────┼──────┼──────────────────────────┼──────────────────────────────────
0x00   │   4  │ targetDifficulty         │ Target difficulty requested
0x04   │   4  │ achievedDifficulty       │ Actual difficulty achieved
0x08   │   8  │ workTime                 │ Time spent on proof-of-work (ms)
0x10   │   8  │ totalAttempts            │ Total nonce attempts made
```

### Table Section: 7-Table Blockchain Architecture

The core of every DIG plot is a sequence of exactly **7 cryptographically-chained tables**, each containing proof-of-work that prevents forgery and ensures computational effort was expended during plot creation. This blockchain-inspired architecture provides tamper-evident storage and prevents just-in-time plot generation.

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

**Individual Table Structure (Variable size, 4096-byte aligned):**

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

**Table Types and Their Purposes:**

1. **Table 0 - Plot Header Table**: Contains plot metadata, public key, and initial configuration
2. **Table 1 - Chia Anchor Table**: Binds plot to Chia blockchain for temporal anchoring
3. **Table 2 - Index Table**: Contains hash indexes and B+ tree structures for fast lookups
4. **Table 3 - Data Table**: Stores actual blob content with compression metadata
5. **Table 4 - Merkle Table**: Contains Merkle tree structure for cryptographic verification
6. **Table 5 - Proof Table**: Contains zero-knowledge proof anchors and verification data
7. **Table 6 - Signature Table**: Contains digital signatures and final plot seal

**Proof-of-Work Requirements:**
- Each table must achieve a difficulty level specified during plot creation
- Hash(previousHash + tableData + nonce) must have required leading zero bits
- Prevents rapid just-in-time plot creation (plot grinding attacks)
- Computational work is cryptographically bound to specific plot data

### Index Section: Multi-Layer Lookup Architecture

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
│                                                                                 │
│  Metadata Index (Content-based lookups)                                        │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ MIME Type → [BlobIds...]    Size Range → [BlobIds...]                 │   │
│  │ Date Range → [BlobIds...]   Custom Tags → [BlobIds...]                │   │
│  │ Compression → [BlobIds...]  Hash Prefix → [BlobIds...]                │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Data Section: Optimized Blob Storage Architecture

The data section uses a sophisticated chunked architecture designed for streaming performance and compression efficiency:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           Data Section Architecture                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  Chunk Directory (Variable size)                                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ ChunkId │ Offset │ CompressedSize │ OriginalSize │ Type │ Checksum     │   │
│  │ ────────┼────────┼────────────────┼──────────────┼──────┼──────────────│   │
│  │ 0x001   │ 0x1000 │ 4,096         │ 8,192        │ ZSTD │ 0xab12cd34   │   │
│  │ 0x002   │ 0x2000 │ 3,584         │ 4,096        │ LZ4  │ 0xef56gh78   │   │
│  │ ...     │ ...    │ ...           │ ...          │ ...  │ ...          │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  Blob Storage Area (Chunked and compressed)                                    │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                                                                         │   │
│  │  Blob 1 (Multiple chunks)                                              │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐                  │   │
│  │  │ Chunk 1 │  │ Chunk 2 │  │ Chunk 3 │  │ Header  │                  │   │
│  │  │ 4KB     │  │ 4KB     │  │ 2KB     │  │ 256B    │                  │   │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘                  │   │
│  │                                                                         │   │
│  │  Blob 2 (Single large chunk)                                           │   │
│  │  ┌─────────────────────────────────────┐  ┌─────────┐                 │   │
│  │  │ Large Chunk (16KB)                  │  │ Header  │                 │   │
│  │  └─────────────────────────────────────┘  └─────────┘                 │   │
│  │                                                                         │   │
│  │  Blob 3 (Uncompressed)                                                 │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────┐                        │   │
│  │  │ Raw Data 1  │  │ Raw Data 2  │  │ Header  │                        │   │
│  │  └─────────────┘  └─────────────┘  └─────────┘                        │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

**Blob Header Structure (256 bytes per blob):**
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

**Compression Types:**
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

**Blob Flags (32-bit bitfield):**
```
Bit  0: ENCRYPTED      - Blob is encrypted with AES-256-GCM
Bit  1: SIGNED         - Blob has digital signature
Bit  2: CHUNKED        - Blob split into multiple chunks
Bit  3: SPARSE         - Blob contains sparse data (mostly zeros)
Bit  4: DEDUPLICATED   - Blob shares chunks with other blobs
Bit  5: STREAMED       - Blob optimized for streaming access
Bit  6: INDEXED        - Blob has additional indexing metadata
Bit  7: VERSIONED      - Blob supports version control
Bits 8-31: Reserved for future features
```

**Dynamic Chunking Strategy:**
- **Small blobs (< 4KB)**: Single chunk, minimal overhead
- **Medium blobs (4KB - 1MB)**: 4KB chunks for optimal compression
- **Large blobs (> 1MB)**: 16KB chunks for streaming performance
- **Huge blobs (> 100MB)**: Adaptive chunking based on content patterns

### Verification Section: Cryptographic Security Architecture

The verification section contains all cryptographic data structures needed to verify plot integrity, authenticity, and zero-knowledge proofs:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        Verification Section Architecture                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  Digital Signature Store                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ Plot Owner Signature (96 bytes) - Signs entire plot with Chia keys    │   │
│  │ Table Signatures (96 bytes each) - Individual table authenticity      │   │
│  │ Blob Signatures (96 bytes each) - Per-blob authenticity (optional)    │   │
│  │ ZK Proof Signatures (96 bytes each) - Anchor ZK proofs to plot        │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  Merkle Tree Structure                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                     Merkle Root (32 bytes)                             │   │
│  │                           /         \                                  │   │
│  │               Internal Node        Internal Node                       │   │
│  │               (32 bytes)           (32 bytes)                          │   │
│  │               /        \           /        \                          │   │
│  │         Leaf Node  Leaf Node  Leaf Node  Leaf Node                    │   │
│  │         (Blob 1)   (Blob 2)   (Blob 3)   (Blob 4)                    │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  Zero-Knowledge Proof Anchors                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ ZK Plot Creation Proof Anchor (256 bytes)                              │   │
│  │ ZK Data Inclusion Proof Anchor (256 bytes)                             │   │
│  │ ZK Ownership Proof Anchor (256 bytes)                                  │   │
│  │ ZK Computational Work Proof Anchor (256 bytes)                         │   │
│  │ ZK Physical Access Proof Anchor (256 bytes)                            │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  Cryptographic Parameters                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ Hash Algorithm: SHA-256                                                │   │
│  │ Signature Scheme: BLS12-381 (Chia compatible)                         │   │
│  │ Merkle Tree Depth: Variable (log₂ of blob count)                      │   │
│  │ ZK Proof System: Groth16 SNARKs                                       │   │
│  │ Curve: BLS12-381 (same as Chia)                                       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

**Digital Signature Structure (96 bytes each):**
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

**Merkle Tree Node Structure (32 bytes each):**
```
Internal Node: SHA-256(leftChildHash || rightChildHash || nodeIndex)
Leaf Node:     SHA-256(blobId || blobContent || blobMetadata)
Root Node:     Final hash representing entire plot data integrity
```

**ZK Proof Anchor Structure (256 bytes each):**
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

**Verification Workflow:**

1. **Plot Integrity**: Verify all table hash chains and proof-of-work
2. **Signature Verification**: Validate all BLS signatures using Chia public keys  
3. **Merkle Tree Verification**: Reconstruct Merkle root from leaf nodes
4. **ZK Proof Verification**: Validate proof anchors and commitments
5. **Cross-Verification**: Ensure all cryptographic elements are consistent

**Security Properties:**

- **Non-repudiation**: Digital signatures prevent denial of plot creation
- **Integrity**: Hash chains and Merkle trees detect any data tampering
- **Authenticity**: BLS signatures prove plot owner identity
- **Freshness**: Chia block binding prevents replay attacks
- **Privacy**: ZK proof anchors enable verification without revealing secrets

### Comprehensive Security Architecture

The DIG Plot format implements multiple layers of cryptographic security:

**1. Proof-of-Work Table Chains**
- Each of the 7 tables requires computational work to prevent just-in-time plot creation
- Cryptographic chaining using SHA-256 prevents table reordering or tampering
- Difficulty scaling allows plots to prove varying levels of computational commitment

**2. BLS12-381 Digital Signatures**
- Compatible with Chia blockchain signature scheme for seamless integration
- Plot-wide signatures prove ownership and authenticity
- Per-table signatures enable granular verification and selective disclosure

**3. Merkle Tree Data Integrity**  
- Binary tree structure enables O(log n) verification of individual blobs
- Root hash binding to PlotId ensures plot-wide data integrity
- Supports efficient partial verification without loading entire plot

**4. Zero-Knowledge Proof Integration**
- Proof anchors enable verification without revealing sensitive data
- Nullifiers prevent proof replay attacks
- Circuit versioning supports proof system upgrades

**5. Temporal Binding to Chia Blockchain**
- Plot creation bound to specific Chia blocks prevents backdating
- Blockchain anchoring provides unforgeable timestamps
- Temporal proofs enable age verification for reward distribution

### Performance Characteristics and Optimizations

**Lookup Performance:**
- **Hash Index**: O(1) average case with 0.75 load factor and collision chaining
- **B+ Tree Index**: O(log n) with ~340 entries per 4KB node
- **Bloom Filter**: ~0.1% false positive rate for existence checking
- **Metadata Index**: Content-based lookups for MIME types, sizes, dates

**Streaming Performance:**
- **Sequential Read**: ~500 MB/s on NVMe SSDs, ~200 MB/s on SATA SSDs
- **Random Access**: ~100 MB/s on NVMe SSDs, ~50 MB/s on SATA SSDs  
- **Compressed Streaming**: ~300 MB/s with LZ4, ~150 MB/s with ZSTD
- **Memory-Mapped I/O**: Near-native file system performance

**Memory Efficiency:**
- **Index Overhead**: ~200 bytes per blob for hash index + B+ tree
- **Streaming Buffer**: 64KB default, configurable from 4KB to 1MB
- **Compression Dictionary**: 32KB-1MB depending on algorithm
- **ZK Proof Cache**: ~1KB per cached proof verification

**Compression Performance:**
- **Text Data**: 70-80% size reduction with GZIP/ZSTD
- **Images**: 5-15% additional compression over JPEG/PNG
- **Binary Executables**: 20-40% compression with LZMA
- **Already Compressed**: <5% overhead for detection and passthrough

**Scalability Limits:**
- **Maximum Plot Size**: 256TB (theoretical), ~100TB (practical)
- **Maximum Blob Count**: 4.2 billion (32-bit addressing)
- **Maximum Individual Blob**: 4GB per blob
- **Table Processing**: ~1 million blobs per minute on modern hardware

### Advanced Features and Capabilities

**Memory Management:**
- **Memory-Mapped I/O**: Direct file mapping for zero-copy access
- **Streaming Processing**: Constant memory usage regardless of plot size
- **Lazy Loading**: Load only needed sections on demand
- **Cache Management**: LRU caching for frequently accessed blobs

**Encryption Support:**
- **AES-256-GCM**: Authenticated encryption for blob-level security
- **ChaCha20-Poly1305**: High-performance alternative cipher
- **Key Derivation**: PBKDF2 or Argon2 for password-based encryption
- **Per-Blob Encryption**: Individual blob encryption with unique keys

**Compression Strategies:**
- **Adaptive Compression**: Algorithm selection based on content analysis
- **Streaming Compression**: Compress while streaming for real-time processing
- **Dictionary Sharing**: Shared compression dictionaries across similar blobs
- **Threshold-Based**: Automatic compression only when beneficial

**Version Control and Compatibility:**
- **Format Versioning**: Backward compatibility with previous plot versions
- **Feature Flags**: Progressive enhancement with optional features
- **Migration Tools**: Automatic upgrade path for legacy plots
- **Compatibility Testing**: Automated verification of cross-version interoperability

### Complete Plot Architecture Summary

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      DIG Plot Complete Architecture                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                 │
│ │ File Header     │  │ Metadata        │  │ 7-Table Chain   │                 │
│ │ 1024 bytes      │  │ TLV Format      │  │ Proof-of-Work   │                 │
│ │ • Magic: DIGP   │  │ • Plot Config   │  │ • Crypto Chain  │                 │
│ │ • PlotId        │  │ • Compression   │  │ • Chia Anchor   │                 │
│ │ • Offsets       │  │ • Difficulty    │  │ • Index Tables  │                 │
│ └─────────────────┘  └─────────────────┘  └─────────────────┘                 │
│                                                                                 │
│ ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                 │
│ │ Index Section   │  │ Data Chunks     │  │ Verification    │                 │
│ │ Multi-Layer     │  │ Optimized Blobs │  │ Cryptographic   │                 │
│ │ • Hash O(1)     │  │ • Dynamic Size  │  │ • BLS Signatures│                 │
│ │ • B+ Tree O(logn)│  │ • Compression   │  │ • Merkle Trees  │                 │
│ │ • Bloom Filter  │  │ • Streaming     │  │ • ZK Anchors    │                 │
│ └─────────────────┘  └─────────────────┘  └─────────────────┘                 │
│                                                                                 │
│ PERFORMANCE PROFILE:                    SECURITY PROFILE:                      │
│ • TB-scale plots                       • Proof-of-work resistant              │
│ • Constant memory                      • Cryptographically signed             │
│ • O(1) blob lookup                     • Merkle tree verified                 │
│ • Streaming compatible                 • Zero-knowledge ready                  │
│ • 500MB/s throughput                   • Blockchain anchored                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

This comprehensive plot format provides the foundation for the DIG Network's decentralized storage system, combining high performance with cryptographic security and zero-knowledge proof compatibility.

### Quarry - Plot Collections *(Placeholder)*

**To Be Described:** Quarries represent collections of related Plots that can be managed, distributed, and verified as cohesive units. This primitive will provide:

- **Collective Management**: Coordinate multiple plots as a single logical unit
- **Distributed Verification**: Verify collections of plots efficiently  
- **Storage Optimization**: Optimize storage patterns across related plots
- **Performance Benefits**: Enable batch operations and coordinated access patterns
- **Redundancy Management**: Coordinate backup and replication strategies across plot collections

*Detailed specification and implementation to be added in future whitepaper versions.*

### Cart - Data Transport Packages *(Placeholder)*

**To Be Described:** Carts are lightweight transport packages for moving blobs or collections of blobs without the computational overhead of full proof-of-work. This primitive will provide:

- **Efficient Transport**: Move data between nodes without proof-of-work requirements
- **Temporary Storage**: Provide interim storage during data propagation
- **Integrity Guarantees**: Maintain basic cryptographic integrity without computational commitment  
- **Format Flexibility**: Support various data packaging and compression strategies
- **Network Optimization**: Enable efficient data distribution patterns

*Detailed specification and implementation to be added in future whitepaper versions.*

## On-Chain Primitives

### PlotCoin - Decentralized Proof Registry

When a plot owner plots a blob, they must create a **PlotCoin** on the Chia blockchain to prove it. A PlotCoin is a unique coin discoverable via the SHA-256 hash of the blob, serving as an on-chain proof that the blob is stored and available. This mechanism forms a decentralized registry of verifiable blobs across the network.

To mint a PlotCoin, the plot owner must **stake DIG Tokens**, introducing a cost that discourages spam attacks—such as flooding the network with fake PlotCoins. Staked DIG Tokens can be refunded by “melting” the PlotCoin and exiting the stake. This logic is typically managed by the DIG Node operated by the plot owner. To be eligible for rewards, plot owners must maintain an active stake for each blob they wish to claim rewards on.

**PlotCoins expire at the end of each epoch** (approximately every 7 days). Plot owners must re-create PlotCoins each epoch to maintain eligibility. This serves both as a liveness check and a cleanup mechanism to prevent outdated or inactive proofs from accumulating on-chain. While this incurs recurring staking costs, previously refunded or newly earned DIG Tokens can be reused. Keep in mind that in addition to DIG Tokens, the PlotOwner will need to maintain enough XCH for the L1 blockchain fees to both stake and un-stake their DIG Tokens. Its advisable that the PlotOwner also run a small Chia Farm to keep their XCH topped off to cover blockchain fees.

The number of blobs a plot owner can earn rewards for is directly tied to the amount of DIG Tokens they have available to stake. DIG Tokens can be earned natively by providing blobs to the network or purchased via the Chia Offer system from other token holders.

#### How Validators Achieve 100% Certainty of Data Ownership

The DIG Network's PlotCoin system provides validators with cryptographic certainty that plot owners have genuine, unique physical copies of data on machines they control. This is achieved through a sophisticated combination of zero-knowledge proofs, cryptographic binding, and anti-Sybil mechanisms.

#### PlotCoin Structure and Network Location Binding

Each **PlotCoin** contains both zero-knowledge proofs AND cryptographically signed network location information:

```
PlotCoin Structure:
{
  owner: PublicKey,                    // Plot owner's public key
  blobId: SHA256Hash,                  // Unique blob identifier
  networkLocation: {
    host: String,                      // DNS hostname where plot is served
    ipv4: IPAddress,                   // IPv4 address of the server
    ipv6: IPAddress,                   // IPv6 address of the server
    port: Number                       // Port number for data access
  },
  locationSignature: DigitalSignature, // Owner's signature over (networkLocation + plotId + blobId)
  proofPackage: ZKProofPackage,        // Complete zero-knowledge proof set
  stakeAmount: DIG_Tokens,             // Economic commitment
  epochExpiry: BlockHeight             // Proof validity period
}
```

**Critical Uniqueness Constraint**: The combination of `(plotId, ownerKey, networkLocation)` must be unique across ALL PlotCoins. This prevents the same plot owner from registering the same plot data from multiple network locations.

#### PlotId Construction and Forgery Prevention

The PlotId serves as the unique identifier for each plot and is constructed using a cryptographic hash that makes forgery mathematically impossible:

```
PlotId Construction:
PlotId = SHA-256(
    publicKey ||              // Plot owner's public key (32 bytes)
    merkleRoot ||             // Root hash of all data in plot (32 bytes)  
    difficulty ||             // Computational work difficulty achieved (4 bytes)
    chiaBlockHeight ||        // Chia blockchain block height for temporal anchoring (8 bytes)
    chiaBlockHash             // Chia blockchain block hash for temporal anchoring (32 bytes)
)
```

**Forgery Prevention Properties:**

1. **Public Key Binding**: PlotId is cryptographically bound to the plot owner's public key, preventing plot theft
2. **Data Binding**: Merkle root ensures PlotId changes if any data in the plot is modified
3. **Work Binding**: Difficulty value proves computational work was performed for this specific plot
4. **Temporal Binding**: Chia block height and hash anchor the plot to a specific point in blockchain history
5. **Collision Resistance**: SHA-256 makes it computationally infeasible to create fake plots with the same PlotId

**ZK Proof Integration**: The PlotId is embedded within the ZK Plot Creation Proof, so validators can extract the authentic PlotId from the cryptographic proof and use it to verify the network location signature binding.

#### Cryptographic Guarantees for Validators

When validators pull PlotCoins from the Chia blockchain, the zero-knowledge proof system provides these ironclad guarantees:

**1. Physical Data Ownership (ZK Physical Access Proof)**
- **What it proves**: The plot owner had actual physical access to the complete plot file when creating the PlotCoin
- **How it works**: Owner must sign a message that includes both plot data hash AND current blockchain state, proving they had the actual data at epoch creation time
- **Attack prevention**: Cannot create PlotCoins using cached proofs after deleting plot data

**2. Unique Machine Control (Network Location Binding)**
- **What it proves**: The plot owner controls the specific network location where this specific plot's data is claimed to be served
- **How it works**: Network location (host + IP addresses) + PlotId is digitally signed by the plot owner's private key
- **Attack prevention**: Cannot claim to serve data from IP addresses the owner doesn't control, and cannot reuse network location signatures from other plots

**3. Computational Work Binding (ZK Computational Work Proof)**
- **What it proves**: Computational work is cryptographically bound to BOTH the specific plotId AND the specific blobId
- **How it works**: Work hash = Hash(nonce + plotId + blobId + tableData), making work non-transferable
- **Attack prevention**: Cannot reuse computational work from one plot/blob combination for another

**4. Data Inclusion Verification (ZK Data Inclusion Proof)**
- **What it proves**: The specific blob actually exists within the plot's Merkle tree structure
- **How it works**: Zero-knowledge Merkle inclusion proof without revealing data content or tree structure
- **Attack prevention**: Cannot claim to have data that doesn't actually exist in the plot

**5. Ownership Authentication (ZK Ownership Proof)**
- **What it proves**: The current data request comes from the legitimate plot owner
- **How it works**: Digital signatures over both plot metadata and blob data using the owner's private key
- **Attack prevention**: Cannot impersonate other plot owners or serve stolen plot data

#### Validator Detection of Fraud and Duplicates

Validators can detect and reject various types of fraudulent PlotCoins with 100% certainty by combining SNARK input verification with duplicate detection:

**Algorithm: Detect Duplicate and Fraudulent PlotCoins**

```
STEP 1: EXTRACT ALL PLOTCOINS FOR A BLOB
allPlotCoins = GetPlotCoinsFromBlockchain(blobId)

STEP 2: RUN COMPREHENSIVE SNARK INPUT FORGERY DETECTION ON EACH PLOTCOIN
validPlotCoins = []
FOR each plotCoin in allPlotCoins:
    // Run the detailed SNARK input verification (see "Detecting SNARKs Built with Forged Input Data" section)
    snarkInputDetectionResult = RunSNARKInputForgeryDetection(plotCoin)
    
    IF snarkInputDetectionResult.isValid:
        validPlotCoins.append(plotCoin)
    ELSE:
        // FORGERY DETECTED: SNARK built with forged input data
        MarkAsFraudulent(plotCoin, snarkInputDetectionResult.errorType)
        DisqualifyFromRewards(plotCoin.owner, currentEpoch)

STEP 3: CHECK FOR DUPLICATE REGISTRATIONS AMONG VALID PLOTCOINS
duplicateMap = {}
FOR each plotCoin in validPlotCoins:
    // Extract authenticated PlotId from verified ZK proof
    plotId = ExtractPlotIdFromZKProof(plotCoin.proofPackage.zkPlotCreationProof)
    ownerKey = ExtractPublicKeyFromZKProof(plotCoin.proofPackage.zkOwnershipProof)
    
    uniqueKey = Hash(plotId + ownerKey)
    
    IF uniqueKey already exists in duplicateMap:
        // FRAUD DETECTED: Same plot + owner registered multiple times
        MarkAsFraudulent(plotCoin, "DUPLICATE_REGISTRATION")
        DisqualifyFromRewards(plotCoin.owner, currentEpoch)
        
        // Also disqualify the original registration to prevent gaming
        originalPlotCoin = duplicateMap[uniqueKey]
        MarkAsFraudulent(originalPlotCoin, "DUPLICATE_REGISTRATION") 
        DisqualifyFromRewards(originalPlotCoin.owner, currentEpoch)
    ELSE:
        duplicateMap[uniqueKey] = plotCoin

STEP 4: RETURN LEGITIMATE PLOTCOINS
legitimatePlotCoins = []
FOR each plotCoin in validPlotCoins:
    IF NOT plotCoin.isMarkedAsFraudulent:
        legitimatePlotCoins.append(plotCoin)

RETURN legitimatePlotCoins
```

**Integration with Comprehensive Verification**: This algorithm first runs the detailed SNARK input forgery detection to eliminate any PlotCoins built with forged input data, then checks for duplicate registrations among the cryptographically valid PlotCoins.

#### Network Location Verification and Anti-Spoofing

The network location binding prevents various network-based attacks:

**IP Address Spoofing Prevention**:
- Network location + PlotId + blobId must be digitally signed by plot owner's private key
- Signature verification proves the owner controls the claimed IP addresses for this specific plot and blob
- Cannot claim to serve from IP addresses without possessing the corresponding private key
- Cannot reuse network location signatures from other plots or blobs

**DNS Spoofing Prevention**:
- Hostname and IP addresses must be consistent and verifiable
- Validators can perform reverse DNS lookups to verify ownership
- Inconsistent DNS/IP mappings trigger fraud detection

**Multiple Host Attack Prevention**:
- Same `(plotId, ownerKey)` combination cannot appear with different network locations
- Attempts to register multiple hosts for same plot data results in immediate disqualification
- Economic penalties (lost staked DIG tokens) discourage multi-host attempts

#### Economic Incentives for Honest Behavior

The PlotCoin system creates strong economic incentives against fraudulent behavior:

**Staking Requirements**:
- Must stake DIG tokens to create each PlotCoin
- Fraudulent PlotCoins result in slashed stakes (lost tokens)
- Honest behavior preserves and potentially increases token holdings through rewards

**Epoch-Based Regeneration**:
- PlotCoins expire every ~7 days
- Must prove fresh physical access each epoch
- Cannot rely on old cached proofs after deleting actual data

**Reputation and Long-term Rewards**:
- Caught fraud results in epoch-long disqualification
- Repeated fraud may result in permanent network exclusion
- Long-term honest participation yields compounding rewards

#### Detecting SNARKs Built with Forged Input Data

While a SNARK proof might be mathematically valid, the input data used to generate it could be forged. Validators must verify not just the SNARK's mathematical correctness, but also that the hidden input data is legitimate.

**Algorithm: Detect Forged SNARK Input Data**

```
STEP 1: VERIFY SNARK WAS BUILT WITH LEGITIMATE PLOTID
// The SNARK should prove knowledge of a PlotId that follows the correct construction
expectedPlotIdComponents = {
    publicKey: ExtractFromZKOwnershipProof(plotCoin.proofPackage.zkOwnershipProof),
    merkleRoot: ExtractFromZKDataInclusionProof(plotCoin.proofPackage.zkDataInclusionProof),
    difficulty: ExtractFromZKComputationalWorkProof(plotCoin.proofPackage.zkComputationalWorkProof),
    blockHeight: ExtractFromZKPhysicalAccessProof(plotCoin.proofPackage.zkPhysicalAccessProof),
    blockHash: ExtractFromZKPhysicalAccessProof(plotCoin.proofPackage.zkPhysicalAccessProof)
}

// Verify the SNARK proves knowledge of PlotId = SHA-256(publicKey || merkleRoot || difficulty || blockHeight || blockHash)
expectedPlotId = SHA256(
    expectedPlotIdComponents.publicKey ||
    expectedPlotIdComponents.merkleRoot ||
    expectedPlotIdComponents.difficulty ||
    expectedPlotIdComponents.blockHeight ||
    expectedPlotIdComponents.blockHash
)

extractedPlotId = ExtractPlotIdFromZKProof(plotCoin.proofPackage.zkPlotCreationProof)

IF extractedPlotId != expectedPlotId:
    // FORGERY DETECTED: SNARK built with fake PlotId components
    RejectPlotCoin("SNARK_BUILT_WITH_FORGED_PLOTID")

STEP 2: VERIFY SNARK WAS BUILT WITH REAL BLOCKCHAIN DATA
// Physical Access Proof must reference a real, recent Chia block
blockHeight = ExtractBlockHeightFromZKProof(plotCoin.proofPackage.zkPhysicalAccessProof)
blockHash = ExtractBlockHashFromZKProof(plotCoin.proofPackage.zkPhysicalAccessProof)

// Check that this block actually exists on the Chia blockchain
realBlockHash = GetChiaBlockHashAtHeight(blockHeight)

IF blockHash != realBlockHash:
    // FORGERY DETECTED: SNARK built with fake blockchain data
    RejectPlotCoin("SNARK_BUILT_WITH_FAKE_BLOCKCHAIN_DATA")

// Check that the block is recent enough
IF ABS(blockHeight - plotCoin.creationBlock) > MAX_BLOCK_DISTANCE:
    // FORGERY DETECTED: SNARK built with stale blockchain data
    RejectPlotCoin("SNARK_BUILT_WITH_STALE_BLOCKCHAIN_DATA")

STEP 3: VERIFY SNARK WAS BUILT WITH CONSISTENT MERKLE ROOT
// Data Inclusion Proof and Plot Creation Proof must use the same Merkle root
plotCreationMerkleRoot = ExtractMerkleRootFromZKProof(plotCoin.proofPackage.zkPlotCreationProof)
dataInclusionMerkleRoot = ExtractMerkleRootFromZKProof(plotCoin.proofPackage.zkDataInclusionProof)

IF plotCreationMerkleRoot != dataInclusionMerkleRoot:
    // FORGERY DETECTED: SNARKs built with inconsistent Merkle roots
    RejectPlotCoin("SNARK_BUILT_WITH_INCONSISTENT_MERKLE_ROOT")

STEP 4: VERIFY SNARK WAS BUILT WITH LEGITIMATE COMPUTATIONAL WORK
// Computational Work Proof must bind work to the correct PlotId + BlobId
workPlotId = ExtractPlotIdFromZKProof(plotCoin.proofPackage.zkComputationalWorkProof)
workBlobId = ExtractBlobIdFromZKProof(plotCoin.proofPackage.zkComputationalWorkProof)

IF workPlotId != extractedPlotId OR workBlobId != plotCoin.blobId:
    // FORGERY DETECTED: SNARK built with work for different plot/blob
    RejectPlotCoin("SNARK_BUILT_WITH_MISMATCHED_WORK_BINDING")

// Verify the work difficulty meets network requirements
extractedDifficulty = ExtractDifficultyFromZKProof(plotCoin.proofPackage.zkComputationalWorkProof)

IF extractedDifficulty < NETWORK_MIN_DIFFICULTY:
    // FORGERY DETECTED: SNARK built with insufficient work
    RejectPlotCoin("SNARK_BUILT_WITH_INSUFFICIENT_WORK")

STEP 5: VERIFY SNARK WAS BUILT WITH REAL BLOB DATA
// Data Inclusion Proof must prove inclusion of the actual requested blob
expectedBlobHash = SHA256(GetBlobDataFromNetwork(plotCoin.blobId, plotCoin.networkLocation))
provenBlobHash = ExtractBlobHashFromZKProof(plotCoin.proofPackage.zkDataInclusionProof)

IF expectedBlobHash != provenBlobHash:
    // FORGERY DETECTED: SNARK built with fake blob data
    RejectPlotCoin("SNARK_BUILT_WITH_FAKE_BLOB_DATA")

STEP 6: VERIFY SNARK NULLIFIERS ARE UNIQUE
// Each SNARK should have unique nullifiers to prevent reuse
allNullifiers = [
    ExtractNullifierFromZKProof(plotCoin.proofPackage.zkPlotCreationProof),
    ExtractNullifierFromZKProof(plotCoin.proofPackage.zkDataInclusionProof),
    ExtractNullifierFromZKProof(plotCoin.proofPackage.zkOwnershipProof),
    ExtractNullifierFromZKProof(plotCoin.proofPackage.zkComputationalWorkProof),
    ExtractNullifierFromZKProof(plotCoin.proofPackage.zkPhysicalAccessProof)
]

FOR each nullifier in allNullifiers:
    IF nullifier already exists in GlobalNullifierDatabase:
        // FORGERY DETECTED: SNARK reusing old nullifier
        RejectPlotCoin("SNARK_REUSING_OLD_NULLIFIER")
    
    // Add to database to prevent future reuse
    GlobalNullifierDatabase.add(nullifier)

STEP 7: VERIFY SNARK TEMPORAL CONSISTENCY
// All proofs should be generated around the same time (PlotCoin creation)
timestamps = [
    ExtractTimestampFromZKProof(plotCoin.proofPackage.zkPlotCreationProof),
    ExtractTimestampFromZKProof(plotCoin.proofPackage.zkDataInclusionProof),
    ExtractTimestampFromZKProof(plotCoin.proofPackage.zkOwnershipProof),
    ExtractTimestampFromZKProof(plotCoin.proofPackage.zkComputationalWorkProof),
    ExtractTimestampFromZKProof(plotCoin.proofPackage.zkPhysicalAccessProof)
]

maxTimeDifference = MAX(timestamps) - MIN(timestamps)

IF maxTimeDifference > MAX_ACCEPTABLE_TIME_SKEW:
    // FORGERY DETECTED: SNARKs built at different times (possible cached proof reuse)
    RejectPlotCoin("SNARK_BUILT_WITH_INCONSISTENT_TIMESTAMPS")
```

**Common Forged Input Data Attacks and Detection:**

**1. Fake PlotId Attack:**
- **Attack**: Generate SNARK with a made-up PlotId that doesn't follow construction rules
- **Detection**: Verify PlotId = SHA-256(publicKey || merkleRoot || difficulty || blockHeight || blockHash) using components extracted from other proofs

**2. Cached Blockchain Data Attack:**
- **Attack**: Reuse old blockchain data in Physical Access Proof after deleting plot
- **Detection**: Verify referenced Chia block exists and is recent enough

**3. Merkle Root Inconsistency Attack:**
- **Attack**: Use different Merkle roots in Plot Creation vs Data Inclusion proofs
- **Detection**: Cross-verify that all proofs reference the same underlying plot data

**4. Work Mismatch Attack:**
- **Attack**: Use computational work from a different plot/blob combination
- **Detection**: Verify work is cryptographically bound to the correct PlotId + BlobId

**5. Fake Blob Data Attack:**
- **Attack**: Prove inclusion of fake blob data that doesn't match actual network content
- **Detection**: Compare blob hash in proof with actual blob data served from network

**6. Nullifier Reuse Attack:**
- **Attack**: Reuse SNARKs or nullifiers from previous PlotCoins
- **Detection**: Check all nullifiers against global database, reject if any have been used before

**7. Temporal Inconsistency Attack:**
- **Attack**: Mix fresh proofs with cached old proofs
- **Detection**: Verify all proof timestamps are consistent and recent

#### Mathematical Impossibility of SNARK Input Forgery

The ZK-SNARK proof system makes input data forgery mathematically impossible because:

**Cryptographic Binding**: Every piece of data is cryptographically bound to every other piece through commitments and proofs. Changing any single input value breaks the entire proof chain.

**Field Arithmetic Constraints**: ZK-SNARK circuits operate over finite fields with mathematical constraints that cannot be violated. Forged input data would violate these constraints, making proof generation impossible.

**Input Data Verification**: Validators verify not just SNARK validity but also that the input data used to build the SNARKs is legitimate and consistent across all five proof types.

**Nullifier Prevention**: Each proof includes unique nullifiers that prevent replay attacks. Using the same input data twice is cryptographically detectable.

**Commitment Scheme Security**: The commitment scheme is computationally hiding and perfectly binding, meaning commitments cannot be opened to different values.

**Cross-Proof Consistency**: Multiple independent proofs must all reference the same underlying data, making partial input forgery impossible.

**Public Verifiability**: All verification can be performed using only public information, allowing any validator to independently detect input data forgery attempts.

#### Result: Cryptographic Certainty for Validators

Through this comprehensive system, validators can examine any PlotCoin on the blockchain and know with 100% mathematical certainty that:

1. ✅ **Unique Physical Copy**: The plot owner has a genuine, unique physical copy of the data
2. ✅ **Machine Control**: The data is on a machine the owner directly controls  
3. ✅ **Network Authority**: The owner controls the network location where this specific plot's data is served
4. ✅ **No Duplicates**: This is not a duplicate registration of the same plot data
5. ✅ **No Spoofing**: The owner cannot fake network locations, reuse signatures from other plots, or reuse work from other plots
6. ✅ **Current Access**: The owner had physical access to the data when creating the PlotCoin
7. ✅ **Computational Authenticity**: All computational work is legitimate and bound to this specific plot/blob combination
8. ✅ **PlotId Authenticity**: The PlotId is cryptographically unforgeable and bound to the owner, data, work, and blockchain history
9. ✅ **SNARK Input Authenticity**: All zero-knowledge proofs were built using legitimate, verified input data with no forgery

This cryptographic certainty is achieved purely through on-chain verification without requiring validators to trust plot owners or perform complex off-chain verification procedures. The comprehensive SNARK input forgery detection ensures that not only are the proofs mathematically valid, but they were also built using authentic, unforged input data.

### DataStore - NFT-Based Data Containers

Any data can be published on the **DIG Network**, where a **DataStore** functions similarly to a decentralized AWS S3 bucket. Each DataStore has a **primary owner** and may optionally assign **delegated writers**. Only these permissioned parties—authenticated by their private blockchain keys—can modify the DataStore. If all associated keys are lost, the DataStore becomes permanently immutable, making key management critical.

DataStores are implemented as NFTs. They can be **transferred, traded, or melted** like any standard NFT. The owner of the NFT is always the **Super Admin**, and permissions automatically transfer with ownership of the DataStore NFT.

The publishing workflow is inspired by **Git**, providing a familiar interface for developers. A CLI tool is used to create new DataStores, commit data, and push changes to a DIG Node.

**Note:** Data is not available on the DIG Network until it is explicitly pushed to a DIG Node.

At its core, a DataStore is an **on-chain Merkle root**, enabling cryptographic proof that any given piece of data belongs to a specific store. This structure ensures integrity, allowing developers to serve DeFi dApps and other critical content with confidence that the code has not been tampered with—assuming trust in the DID (Decentralized Identifier) that owns the store.

### DIG Handles - Human-Readable Domain System

**Datastores** on the DIG Network are free to create and can contain any amount or type of data—including none. However, the open nature of datastore creation presents a challenge for validators attempting to prioritize and incentivize **high-value data**. Since there's no inherent way to assess value, the DIG Network introduces a mechanism to signal it: **DIG Handles**.

#### What is a DIG Handle

DIG Handles are based on the XCH Handle system developed by Yakuhito. They allow users to register a human-readable `*.dig` domain and associate it with a specific datastore. This makes it easy to reference and consume data on the network, replacing the need to use opaque store IDs.

The DIG Handle system is fully on-chain and decentralized—there is no central authority managing registrations. The underlying smart puzzle provides all necessary functionality to:

1. Register a new DIG Handle  
2. Pay for the handle using DIG Tokens  
3. Link the handle to a datastore ID  
4. Renew the handle after its prepaid period ends. (You can prepay ownership as far into the future as desired.)  
   

#### Why DIG Handles Signal Value

Spending DIG Tokens to register and maintain a DIG Handle acts as a **market-driven signal of value**. The DIG Network assumes that if someone is willing to pay for and renew a handle, the corresponding datastore is valuable and should be considered for **global propagation**. Once a valid handle is registered and its associated datastore has a non-empty Merkle root on-chain, validators will begin awarding DIG Tokens to DIG Nodes that include the data in their plot files and serve it to the network. Note that the DataStore owner will have to plot the DataStore Files and create PlotCoins from a server for the network to pick them up. There may be central seed services built on top of the Protocol later that can help facilitate central propagation. The fee that is spent to register the handle is transferred to the validator multisig as payment for their work.

If a handle expires and is not renewed, the protocol assumes the datastore is no longer valued, and the incentive to propagate it will cease.

#### Reassigning and Renewing DIG Handles

Any datastore can be assigned to a DIG Handle—and even reassigned to new handles multiple times. If the original owner of a handle decides not to renew it, **any party can step in to re-register the handle** or assign the datastore to a new one. This flexibility ensures that valuable data continues to be recognized and rewarded by the network, even if the original publisher is no longer involved.

#### Decentralized Funding for Renewals

In scenarios where a datastore (e.g., one linked to an NFT collection) remains important to a broader community, but the original handle owner does not renew it, renewal becomes a challenge. Re-registration is possible but risks **handle sniping** by unrelated actors.

To prevent this, the DIG registry allows **anyone to renew a handle** by interacting with the registry singleton. This opens the door for decentralized funding models, such as:

* Earmarking **NFT royalties** or **community donations** for handle renewal

* Configuring **DeFi protocols** to allocate a portion of fees (e.g., 0.001%) toward automatic renewals

However, due to current technical constraints, an **active executor** is still required to process the renewal. The system cannot automatically spend accumulated funds once they meet the renewal threshold. One workaround is to include a **tip for the executor**, though this introduces inefficiencies under fee market pressure.

### Rewards Distributor - Incentive Distribution System

The **DIG Reward Distributor** is an on-chain application designed to distribute DIG incentives continuously to active mirrors (nodes that serve data). The system is governed by a **trusted validator or group of validators via multisig** that maintains an up-to-date list of eligible mirrors and their relative weights. Rewards are calculated and allocated per second, ensuring fair compensation based on uptime and service.

##### Key Features

* **Continuous Reward Accrual:** Mirrors accrue rewards every second, deterministically allocated even if the validator later misbehaves.  
* **Validator-Driven Mirror List:** A single trusted validator controls which mirrors are active and sets their weights.  
* **Decentralized Funding:** Anyone can sponsor future epochs by committing funds. Early withdrawals incur penalties.  
* **Flexible Payouts:** Rewards can be manually triggered or automatically paid out when a mirror goes offline.  
* **Support for XCH and CATs:** Rewards can be distributed in native XCH or any Chia Asset Token.  
* **Validator Incentives:** Validators receive a percentage of total epoch rewards and are incentivized to act reliably.  
* **Action Layer Integration:** Built using the Chia action layer and slot-based singleton architecture.

##### Actions Supported

* `sync`: Distributes rewards since the last sync within the same epoch.  
* `new_epoch`: Ends the current epoch and transfers the validator's fee.  
* `commit_incentives` / `withdraw_incentives`: For sponsoring and withdrawing epoch incentives (with penalties).  
* `add_current_epoch_incentives`: Adds non-withdrawable incentives to the current epoch.  
* `add_mirror` / `remove_mirror`: Allows the validator to update the active mirror list.  
* `initiate_payout`: Triggers payout for a mirror if rewards exceed a defined threshold.

##### Security and Audit

The distributor holds and manages funds on-chain until payout, making **puzzle security critical**. The Chialisp code has been reviewed by multiple Chia ecosystem contributors.

## System Architecture and Operations

Having established the fundamental primitives that comprise the DIG Network's DataLayer, we now examine how these primitives work together to create a complete decentralized storage and content delivery system. The following sections detail the operational mechanisms, economic models, and governance structures that coordinate the primitives into a unified network.

### Validator Model for the DIG Network

The **DIG Network** adopts a **curated validator model**, similar to the approach used by [warp.green](http://warp.green), instead of the permissionless validator model common in most Layer 1 blockchains. This decision is driven primarily by **practical concerns around consensus and network health**, particularly with regard to **availability verification** for PlotCoin servers.

#### Why Not Permissionless Validators?

In a permissionless model, the risk of **unintentional DDoS attacks** becomes significant—too many validators querying the same PlotCoin server to confirm availability could overwhelm it. To mitigate this, the DIG Network initially limits participation to a **small, coordinated set of validators** (around 10), with flexibility to adjust based on market and protocol maturity.

#### Role and Workflow of Validators

Validators work together, typically coordinated under a **shared multisig**, to determine which **PlotCoin owners** qualify for inclusion in the **DIG Reward Distributor**. The validation process is as follows:

1. **Blob Selection:** Use a deterministic algorithm seeded from a Chia blockchain block hash to select a blob for validation.

2. **Proof Validation:** Retrieve all PlotCoins associated with the selected `blobId`. Validate the embedded proofs in each PlotCoin.

3. **Liveness Check:** Perform a final ping to the host listed in the PlotCoin to ensure the content is still being served and accessible.

4. **Reward Eligibility:**  
   * If all checks pass, add the PlotCoin owner to the Reward Distributor.  
   * If a check fails, remove the PlotCoin owner from the Reward Distributor.

5. **Repeat the Process** on a regular cycle to ensure ongoing availability and integrity.

#### Security and Trust Model

Validators do **not control funds**. The **Reward Distributor puzzle** escrows rewards directly on-chain. At most, a dishonest validator could try to add themselves or others to the reward list—but this would require **collusion by a majority** of the validator set. Additionally, validators are expected to be **publicly known entities** with reputational risk, making collusion highly unlikely due to potential **severe reputational damage**.

#### Community DAO Managed Validators (Future)

In the future, once Chia’s DAO primitives are production-ready, the DIG Network's validator multisig could be governed by a decentralized autonomous organization (DAO). This DAO would hold the authority to vote on hiring and removing validators, creating a transparent and community-driven oversight model. Payments from DIG Handle registrations and renewals would flow into the DAO treasury, which could allocate funds to compensate validators for their services, reinvest in network growth, or distribute dividends to token holders. Governance rights would be tied to the DIG token, enabling token holders to actively participate in shaping the network’s direction. This model creates strong incentives for a thriving, self-sustaining community dedicated to maintaining the health and integrity of the DIG Network.

### DIG Token - Native Utility Token (CAT)

The **DIG Token** is a CAT (Chia Asset Token) that serves as the fundamental economic primitive powering the entire DIG Network ecosystem. As the native utility token, it creates the economic incentive structures that align participant behavior with network health, data availability, and long-term sustainability.

#### Core Functions of the DIG Token

The DIG Token serves multiple critical functions within the network:

- **PlotCoin Staking**: Required to create PlotCoin registry entries, proving economic commitment to data storage
- **DIG Handle Registration**: Payment mechanism for human-readable domain names, signaling content value
- **Reward Distribution**: Primary reward currency for storage providers and network participants  
- **Governance**: Future governance rights for DAO-based network management
- **Bribe Funding**: Can be used to fund specialized reward distributors for performance optimization
- **Economic Security**: Creates sybil resistance and spam prevention through required stakes

#### Token Emission and Distribution Model

#### At the heart of the DIG Network's economic backbone and governance architecture is the **DIG Utility Token**, which underpins the incentives that power a healthy, self-sustaining content delivery ecosystem. The token is required for critical operations such as staking PlotCoins, registering DIG Handles, and contributing to reward pools for storage providers. This built-in demand ensures that only participants who actively contribute to the network’s integrity and availability receive compensation. By requiring a recurring stake to maintain eligibility for rewards, the token introduces an economic filter that discourages spam and low-quality data while aligning long-term incentives with honest participation. In future iterations, the DIG Token will also serve as the governance token for a community-run DAO, responsible for managing validator appointments, allocating treasury funds, and directing protocol upgrades. This dual role—economic and governance—positions the DIG Token as the engine of both **operational resilience** and **community alignment**, fostering a robust and censorship-resistant digital infrastructure that can thrive without central control.   Token Supply and Initial Mint 

**Total Supply**: 25,000,000 (25 million) DIG tokens

* **Single Issuance**: All tokens are minted at once in the initial deployment  
* **Time-Locked Distribution**: 100% of tokens are immediately locked in streaming puzzles  
* **15-Year Emission Period**: All tokens are distributed linearly over 15 years  
* **No Additional Minting**: The supply is permanently capped at 25 million tokens

#### Distribution Architecture

The token distribution utilizes a sophisticated streaming puzzle system built on by Yakuhito. This creates six distinct funding buckets, each with its own streaming mechanism:

**Note: These allocations are currently a proposal and have not yet been finalized. Nothing is final until the token is minted and loaded into the streaming puzzles.**

**![][image2]**

### **1\. Investor Bucket (30% \- 7,500,000 tokens)**

**Purpose**: Raise $5 million in funding to grow and mature the network

**Implementation**:

* 20 separate Chia vaults created  
* Each vault receives 375,000 tokens over time (1.5% of total supply)  
* Tokens stream linearly over 15 years to each vault  
* Offer files created at $250,000 worth of XCH each  
* Anti-dump mechanism with clawbacks disabled  
* Accepting an offer creates an irrevocable 15-year claim to DIG tokens

**Key Features**:

* Proportional ownership maintained throughout vesting period  
* Immediate price discovery enabled after launch  
* Transparent on-chain verification of all emissions

### **2\. Early Supporter Bucket (5% \- 1,250,000 tokens)**

**Purpose**: Reward community members who contributed to the project's development

**Implementation**:

* Airdrop mechanism streaming tokens over 15 years  
* Criteria kept confidential until after distribution  
* Recognition of community contributions and early support  
* Linear emission schedule aligned with other buckets

### **3\. Liquidity Pool Bucket (5% \- 1,250,000 tokens)**

**Purpose**: Facilitate easy access to DIG tokens through decentralized trading

**Implementation**:

* 15-year streaming puzzle earmarked for TibetSwap liquidity  
* Tokens paired with XCH upon claiming  
* Ensures consistent market liquidity throughout emission period  
* Supports price stability and trading accessibility

### **4\. Developer Funds (5% \- 1,250,000 tokens)**

**Purpose**: Encourage ongoing community development and ecosystem growth

**Implementation**:

* 15-year streaming to developers  
* Potentially managed by the XCH Foundation  
* Incentivizes continued protocol development  
* Supports third-party application development

### **5\. Founder Funds (5% \- 1,250,000 tokens)**

**Purpose**: Compensate founders for protocol development and ongoing leadership

**Implementation**:

* 15-year streaming schedule  
* Founder compensation for initial development  
* Long-term alignment with network success  
* Transparent vesting mechanism

### **6\. Protocol Rewards (50% \- 12,500,000 tokens)**

**Purpose**: Incentivize network participants and maintain data availability

**Implementation**:

* Streamed to main DIG Rewards Validator over 15 years  
* Escrowed in the Rewards Distributor puzzle  
* Distributed to valid Plot servers based on performance  
* Largest allocation ensuring robust network incentives

### DIG Token Economy Flow: Overview

### ![][image3]

![][image4]

The DIG Token Economy represents a sophisticated circular economic system designed to create sustainable incentives for decentralized data storage and distribution. At its core, the economy operates through a carefully orchestrated flow of DIG tokens that rewards network participants while maintaining data availability and integrity across the distributed network.

#### Economic Architecture

The token economy begins with the **DIG Rewards Distributor**, which serves as the central hub streaming 50% of all minted tokens over a 15-year period. Critically, the Rewards Distributor acts as an **escrow mechanism**, securely holding funds on-chain until they are claimed by eligible participants. This creates a predictable, long-term incentive structure that encourages sustained network participation without inflationary pressure, while ensuring that rewards cannot be manipulated or misappropriated.

#### Validator-Controlled Reward Allocation

**Validators and Governance** form the backbone of the network's reward system. While the Rewards Distributor escrows the tokens, **validators determine who can claim rewards and how much** they receive. These entities perform dual functions: they verify the authenticity and availability of stored data through PlotCoin validation, and they govern network operations through decentralized autonomous organization (DAO) mechanisms. Validators actively assess network participants' performance and create reward claims for qualifying DIG Nodes, ensuring that only legitimate data storage providers who meet quality standards receive compensation from the escrowed funds.

#### Core Network Operations

The staking mechanism represents the heart of the token economy. DIG Nodes (PlotOwners) must stake DIG tokens to create PlotCoins, which serve as cryptographic proofs of data storage and availability. This creates an economic commitment that prevents spam and ensures quality service. The beauty of this system lies in its bidirectional nature: tokens can be staked to create PlotCoins for network participation, then melted to recover the original tokens when storage services are no longer needed. This closed-loop design gives participants flexibility while maintaining economic security.

Validators continuously monitor these PlotCoins, verifying that the underlying data remains available and properly served. Based on this validation process, they determine which DIG Nodes qualify for rewards from the escrowed distributor and calculate appropriate reward amounts based on performance metrics.

#### Market Integration and Liquidity

The economy maintains healthy token circulation through TibetSwap integration, which provides XCH/DIG trading pairs funded by a dedicated Liquidity Vault. This ensures that network participants can always access DIG tokens when needed for staking or other network operations, preventing bottlenecks that could hinder network growth. The system thoughtfully separates operational token flows from market liquidity, ensuring that trading activity doesn't disrupt core network functions.

#### Content Publishing and Value Signaling

Content Publishers play a crucial role in the economy by creating DataStores and paying DIG tokens to register human-readable domain names through the DIG Handle Registry. This payment mechanism serves as a market-driven signal of content value – publishers only spend tokens on handles for data they believe has genuine worth. The registry fees flow directly back to validators, creating a direct payment relationship for their validation services and completing one of the economy's key circular flows.

#### Self-Sustaining Circular Design

The DIG Token Economy achieves sustainability through multiple interconnected loops:

* Escrow and Reward Loop: The Rewards Distributor escrows tokens while validators assess performance and authorize reward claims to productive DIG Nodes  
* Staking Loop: DIG Nodes stake and melt tokens as needed, maintaining flexibility while ensuring commitment  
* Value Loop: Publishers pay for domain registration, signaling valuable content while compensating validators  
* Liquidity Loop: Market integration ensures token availability without disrupting operations

#### Economic Incentive Alignment

The system creates powerful aligned incentives across all participants:

* DIG Nodes are rewarded based on validator assessment of their reliable data storage and serving  
* Validators receive both token streams and direct payments for their validation services, while controlling reward distribution  
* Content Publishers gain access to censorship-resistant hosting with clear value signaling  
* Token Holders benefit from utility-driven demand and deflationary staking mechanisms

The escrowed reward structure ensures that validators cannot simply distribute tokens arbitrarily – they must make legitimate assessments of network contribution, as their reputation and continued validator status depends on fair and accurate reward allocation.

#### Network Effects and Scalability

As the network grows, the token economy becomes more robust. Increased content publishing drives domain registration fees, providing more validator compensation. More data storage creates additional staking demand, while growing network utility attracts more participants who need tokens for network access. The 15-year emission schedule ensures that token supply growth matches network maturation, preventing early dilution while supporting long-term expansion.

#### Innovation in Decentralized Economics

The DIG Token Economy represents a significant advancement in decentralized network design by solving several common problems:

* **Spam Prevention:** Economic staking requirements naturally filter out low-quality participants  
* **Sustainable Funding:** Multiple revenue streams prevent dependence on any single source  
* **Trustless Escrow:** On-chain reward distribution prevents manipulation while ensuring fair allocation  
* **Performance-Based Rewards:** Validator assessment ensures rewards correlate with actual network contribution  
* **Market Integration:** Seamless token access prevents operational bottlenecks  
* **Value Discovery:** Market-driven domain pricing reveals genuine content value  
* **Long-term Alignment:** Extended emission schedules align participant interests with network success

This carefully designed economic system creates a self-reinforcing cycle where network growth drives token utility, increased utility attracts more participants, and greater participation strengthens the network's value proposition. The escrow-based reward mechanism with validator oversight ensures that incentives remain properly aligned while preventing both reward manipulation and arbitrary distribution. The result is a robust, sustainable foundation for decentralized data storage and distribution that can operate independently while providing clear economic benefits to all participants.

### DIG Network Propagation: Overview

The DIG Network operates on a **blob-level propagation system** where validators randomly select individual data blobs for verification rather than complete files or datastores. This creates a unique distributed storage architecture that maximizes network resilience and provides strong operational advantages for node operators.

![][image5]

#### Blob-Level Validation

Validators use Chia blockchain block hashes to **randomly select blobs** from across the entire network for verification. Any DIG Node (PlotOwner) that can prove they are storing the selected blob becomes eligible for DIG token rewards. This unpredictable validation process prevents gaming and ensures fair reward distribution.

#### Strategic Randomization Incentives

The economic model naturally encourages DIG Nodes to:

* **Diversify blob storage** across many different sources  
* **Frequently rotate and shuffle** their blob inventory  
* **Maximize blob variety** to increase reward probability  
* **Continuously refresh** storage to capture newly validated content

This creates a **"survival of the most diverse"** dynamic where nodes with varied, frequently updated collections have the highest earning potential.

#### Content-Agnostic Architecture

DIG Nodes operate **content-agnostically** since blobs are partial fragments of larger files. Node operators:

* Cannot determine what complete content they're storing  
* Have no visibility into original file sources or purposes  
* Store meaningless fragments without complementary blobs  
* Cannot reconstruct complete works from individual fragments

This fragmentation means a single DIG Node might store blob fragments from scientific papers, software applications, images, and videos simultaneously, without any ability to distinguish between them.

#### Network Resilience

The propagation model creates exceptional resilience through:

* **Organic redundancy** as popular content spreads across multiple nodes  
* **Natural censorship resistance** through fragmented, distributed storage  
* **Dynamic load balancing** via continuous storage optimization  
* **Fault tolerance** through diverse, uncorrelated storage patterns

#### Economic Cycle

The system creates a self-reinforcing cycle:

1. Validators randomly select blobs for verification  
2. DIG Nodes earn rewards for storing validated blobs  
3. Rational nodes diversify storage to maximize rewards  
4. Popular content achieves wide distribution  
5. Network resilience increases organically

#### Operational Benefits

The blob-level architecture provides:

* **Simplified operations** without editorial decisions about content  
* **Automated management** through economic incentive-driven systems  
* **Content obfuscation** making complete content reconstruction practically impossible  
* **Privacy preservation** through fragmented storage patterns

#### Innovation

DIG's blob-level propagation represents a significant advancement by:

* **Separating infrastructure from content** at the granular level  
* **Aligning economic incentives** with network resilience  
* **Creating organic redundancy** without central coordination  
* **Enabling natural censorship resistance** through fragmentation  
* **Maximizing privacy** through content-agnostic operations

The result is a truly decentralized network where content propagates based on economic signals, storage occurs without content awareness, and resilience emerges from rational self-interest rather than central planning.

### Network Bribes: Overview

The DIG Network introduces **Network Bribes** as a specialized incentive mechanism that allows content owners to optimize retrieval performance by encouraging blob consolidation on specific nodes, creating a market-driven trade-off between decentralization and speed.

#### Dedicated Reward Distributors

Every DataStore is minted with its own **dedicated rewards distributor puzzle** that operates independently from the main DIG token rewards system. Content owners can load funds (XCH or any CAT token) into these distributors to create targeted incentives for their specific content.

#### Performance vs. Decentralization Trade-off

The main DIG token rewards encourage **maximum randomization** of blobs across the network, creating strong decentralization but requiring file reconstruction from multiple sources during retrieval. Network Bribes offer an alternative approach where content owners can **pay for consolidation** of their content blobs onto fewer nodes.

#### Economic Mechanics

**For Content Owners:**

* Load bribe funds into their DataStore's dedicated distributor  
* Higher bribes encourage more nodes to prioritize their content  
* Faster retrieval speeds through consolidated blob storage

**For DIG Nodes:**

* Choose between diverse blob storage (DIG token rewards) or specialized storage (bribe rewards)  
* Economic calculation: bribe value must compensate for potential lost DIG rewards  
* Can consolidate specific DataStore blobs to earn targeted bribes

#### Validator Integration

Once a bribe distributor is funded, **validators automatically detect and distribute** the bribe rewards on behalf of content owners. This maintains the decentralized nature of reward distribution while enabling specialized performance incentives.

#### Flexible Payment Options

Bribe distributors accept **any CAT token or XCH**, allowing content owners to use whatever assets they prefer for incentivizing their content's performance optimization.

#### Strategic Implications

Network Bribes create a **dual-incentive economy** where:

* **Decentralization-focused** rewards maintain network resilience through randomization  
* **Performance-focused** bribes enable faster retrieval for high-priority content  
* **Market efficiency** emerges as nodes optimize between competing reward structures

This mechanism allows the DIG Network to serve both **resilient, censorship-resistant storage** (through randomization) and **high-performance content delivery** (through consolidation) within the same economic framework.
