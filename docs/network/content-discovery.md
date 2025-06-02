---
sidebar_position: 5
---

# Content Discovery

:::tip 💜 Support the DIG Network
**Help build the future of decentralized storage!** The DIG Network is an open-source project that needs community support to continue development. 

**[💜 Support the Project →](../support.md)** - Donate crypto, buy NFTs, or sponsor development
:::

## Overview

Content discovery in the DIG Network operates through **human-readable domain names** ([DIG Handles](../primitives/on-chain/dig-handles.md)) that resolve to decentralized data storage. Unlike traditional DNS systems, DIG Handle resolution provides cryptographic guarantees of content authenticity while maintaining censorship resistance through distributed storage.

## Permanent Identity System with URNs

### **Why Identity Separation Matters**

In traditional Web2 systems, identity and location are synonymous - a URL like `https://example.com/file.html` contains both the identity of the resource and where to retrieve it. This works acceptably for centralized systems with canonical locations, but creates fundamental problems in distributed mesh networks:

- **No Canonical Location**: In a distributed network, there is no single authoritative location
- **Permanent Identity**: Resource identity must remain valid beyond any specific retrieval mechanism
- **Location Independence**: The same resource may be available from multiple sources
- **Future-Proof**: Identity should survive across network protocol iterations and upgrades

### **URN-Based Resource Identification**

The DIG Network uses **[URNs (Uniform Resource Names)](https://www.rfc-editor.org/rfc/rfc8141)** to provide permanent, location-independent resource identifiers based on [DIP-0001](https://raw.githubusercontent.com/DIG-Network/DIPS/refs/heads/main/DIPs/dip-0001.md).

#### **URN Format Specification**

```
urn:dig:chia:{storeID}:{optional roothash}/{optional resource key}
```

**Namespace Components:**
- **`urn`** - Scheme identifier denoting a URN (case insensitive, required)
- **`dig`** - Identifier for the DIG namespace (case insensitive, required)

**Namespace Specific String (NSS):**
- **`chia`** - Chain name for Chia blockchain (case sensitive, required)
- **`storeID`** - Unique DIG DataStore identifier (case sensitive, required)
- **`roothash`** - Merkle root of specific store version (case sensitive, optional)
- **`resource key`** - Path to specific resource within store (case sensitive, optional)

#### **URN Examples and Use Cases**

```
# Latest version of entire DataStore
urn:dig:chia:17f89f9af15a046431342694fd2c6df41be8736287e97f6af8327945e59054fb

# Specific file in latest version
urn:dig:chia:17f89f9af15a046431342694fd2c6df41be8736287e97f6af8327945e59054fb/css/app.css

# Specific version of DataStore (version pinning)
urn:dig:chia:17f89f9af15a046431342694fd2c6df41be8736287e97f6af8327945e59054fb:35cccf5cba6e3ee2dcf237b4b8a47c64e89cf733a95c6f5e9ac7062734c22b81

# Specific file in specific version (immutable reference)
urn:dig:chia:17f89f9af15a046431342694fd2c6df41be8736287e97f6af8327945e59054fb:35cccf5cba6e3ee2dcf237b4b8a47c64e89cf733a95c6f5e9ac7062734c22b81/css/app.css
```

#### **URN Comparison and Equivalence**

**Case Sensitivity Rules:**
- **Namespace Identifier**: `URN:DIG` and `urn:dig` are equivalent (case insensitive)
- **NSS Components**: Chain name, storeID, and resource paths are case sensitive
- **Standard Compliance**: Follows [RFC 3986 Section 3](https://www.rfc-editor.org/rfc/rfc3986#section-3) conventions

**Canonical Forms:**
```
# These are equivalent (case insensitive namespace)
urn:dig:chia:abc123.../file.html
URN:DIG:chia:abc123.../file.html
Urn:Dig:chia:abc123.../file.html

# These are different (case sensitive NSS)
urn:dig:chia:abc123.../File.html
urn:dig:chia:abc123.../file.html
urn:dig:chia:ABC123.../file.html
```

### **Multiple Retrieval Mechanisms**

The separation of identity (URN) from retrieval enables multiple access methods:

#### **1. Intra-Network Synchronization**
```
# Direct DIG Network resolution
URN: urn:dig:chia:abc123.../index.html
→ Query DIG Network for DataStore abc123...
→ Discover storage providers through PlotCoin registry
→ Retrieve blobs and reconstruct content
```

#### **2. Web2 Gateway Resolution**
```
# HTTP gateway access
https://dig.kackman.net/urn:dig:chia:abc123.../index.html

# Resolver service pattern
http://urn.fi/urn:dig:chia:abc123.../index.html
```

**Gateway Benefits:**
- **Browser Compatibility**: Works with existing web browsers
- **CDN Integration**: Can leverage existing CDN infrastructure  
- **Fallback Access**: Provides access when native DIG clients unavailable
- **SEO Compatibility**: Enables search engine indexing

#### **3. Web3 Native Protocol Handler**
```
# Native DIG protocol
dig://urn:dig:chia:abc123.../index.html

# Direct SDK integration
const content = await dig.resolve('urn:dig:chia:abc123.../index.html');
```

**Native Access Benefits:**
- **No Intermediaries**: Direct DIG Network access without gateways
- **Enhanced Privacy**: No third-party intermediaries in resolution path
- **Full Feature Access**: Complete access to DIG Network capabilities
- **Optimized Performance**: Direct network optimization without translation layers

### **URN Integration with DIG Handles**

**DIG Handles as User-Friendly Aliases:**
```
# Human-readable DIG Handle
my-awesome-app.dig

# Resolves to underlying URN
urn:dig:chia:17f89f9af15a046431342694fd2c6df41be8736287e97f6af8327945e59054fb

# Can specify specific resources
my-awesome-app.dig/api/v1/data
→ urn:dig:chia:17f89f...54fb/api/v1/data
```

**Dual Resolution System:**
- **User Layer**: DIG Handles provide memorable, brandable identifiers
- **Protocol Layer**: URNs provide permanent, immutable resource identification
- **Version Control**: URNs enable precise version specification
- **Developer Tools**: Both formats supported in APIs and SDKs

### **Benefits of URN-Based Identity**

#### **1. Persistence**
- **Permanent Identity**: URNs remain valid indefinitely, even if all current storage providers disappear
- **Version Immutability**: Specific URN versions always reference the same content
- **Network Evolution**: Identity survives protocol upgrades and network changes
- **Long-term References**: Safe for academic citations, legal documents, and permanent archives

#### **2. Flexibility**
- **Multiple Retrieval Methods**: Same URN accessible through various mechanisms
- **Technology Agnostic**: URN resolution adaptable to future retrieval technologies
- **Service Independence**: Not tied to any specific service provider or platform
- **Global Compatibility**: Works across different networks and implementation

#### **3. Scalability**
- **Distributed Resolution**: URN resolution distributes load across network
- **Caching Friendly**: URNs enable aggressive caching without invalidation concerns
- **Resource Management**: Enables efficient resource discovery and management
- **Network Growth**: Scales naturally with network size and adoption

#### **4. Compatibility**
- **Standards Compliance**: Full RFC 8141 URN compliance
- **Ecosystem Integration**: Compatible with existing URN infrastructure
- **Future Standards**: Prepared for future URN-based standards and protocols
- **Cross-Platform**: Works across different operating systems and platforms

## DIG Handle Resolution System

### **Domain-to-Content Resolution**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         DIG Handle Resolution Flow                              │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  1. USER REQUEST                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ User accesses: https://my-awesome-app.dig                               │   │
│  │ Browser/Client initiates DIG Handle resolution                          │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                            │
│                                    ▼                                            │
│  2. BLOCKCHAIN QUERY                                                           │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ Query Chia blockchain for "my-awesome-app" DIG Handle                   │   │
│  │ Retrieve associated DataStore NFT and configuration                     │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                            │
│                                    ▼                                            │
│  3. DATASTORE DISCOVERY                                                        │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ DataStore contains BlobIds for all content fragments                    │   │
│  │ Extract blob list and integrity verification data                       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                            │
│                                    ▼                                            │
│  4. STORAGE PROVIDER DISCOVERY                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ Query blockchain for PlotCoins containing required blobs                │   │
│  │ Identify active storage providers with network accessibility             │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                            │
│                                    ▼                                            │
│  5. CONTENT RETRIEVAL                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ Download blobs from distributed storage providers                       │   │
│  │ Verify content integrity using DataStore checksums                      │   │
│  │ Reconstruct original content for user presentation                       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### **Comprehensive Resolution Algorithm**

```
ALGORITHM: DIG Handle Content Resolution
PURPOSE: Convert human-readable domain names to accessible content

INPUT:
  - digHandle: Domain name (e.g., "my-awesome-app.dig")
  - userAgent: Client requesting content
  - preferredFormat: Desired content format (optional)

OUTPUT: Resolved content or resolution metadata

STEPS:
  1. PARSE AND VALIDATE DIG HANDLE
     // Extract domain name and validate format
     domainName = ExtractDomainName(digHandle)
     IF NOT IsValidDIGHandle(domainName):
         RETURN ERROR("Invalid DIG Handle format")
  
  2. QUERY BLOCKCHAIN FOR HANDLE REGISTRATION
     // Find associated DataStore NFT
     handleRecord = QueryChiaBlockchain(domainName)
     IF handleRecord.isEmpty():
         RETURN ERROR("DIG Handle not found")
     
     dataStoreId = handleRecord.associatedDataStore
     registrationData = handleRecord.registrationInfo
  
  3. RETRIEVE DATASTORE CONFIGURATION
     // Get complete DataStore metadata
     dataStore = GetDataStoreFromBlockchain(dataStoreId)
     blobManifest = dataStore.blobManifest
     integrityHashes = dataStore.integrityVerification
     accessPermissions = dataStore.accessControl
  
  4. VALIDATE ACCESS PERMISSIONS
     // Check if user has access rights
     hasAccess = ValidateAccessPermissions(userAgent, accessPermissions)
     IF NOT hasAccess:
         RETURN ERROR("Access denied - insufficient permissions")
  
  5. DISCOVER ACTIVE STORAGE PROVIDERS
     // Find PlotCoins for required blobs
     storageProviders = []
     FOR each blobId in blobManifest:
         plotCoins = QueryBlockchainForPlotCoins(blobId)
         activeProviders = FilterActiveProviders(plotCoins)
         storageProviders.append(activeProviders)
  
  6. OPTIMIZE PROVIDER SELECTION
     // Select optimal providers based on performance and availability
     selectedProviders = OptimizeProviderSelection(storageProviders, {
         prioritizeGeographic: true,
         preferHighPerformance: true,
         ensureRedundancy: true,
         respectNetworkBribes: true
     })
  
  7. PARALLEL CONTENT RETRIEVAL
     // Download blobs in parallel from selected providers
     retrievalTasks = []
     FOR each blobId in blobManifest:
         provider = selectedProviders[blobId]
         task = AsyncDownloadBlob(provider.networkLocation, blobId)
         retrievalTasks.append(task)
     
     blobData = AwaitAllRetrievals(retrievalTasks)
  
  8. VERIFY CONTENT INTEGRITY
     // Ensure downloaded content matches expected hashes
     FOR each (blobId, data) in blobData:
         calculatedHash = SHA256(data)
         expectedHash = integrityHashes[blobId]
         IF calculatedHash != expectedHash:
             RETURN ERROR("Content integrity verification failed for " + blobId)
  
  9. RECONSTRUCT ORIGINAL CONTENT
     // Reassemble blobs into original content format
     originalContent = ReconstructContent(blobData, dataStore.metadata)
     
  10. RETURN RESOLVED CONTENT
      RETURN ContentResolution{
          content: originalContent,
          metadata: dataStore.metadata,
          providers: selectedProviders,
          resolutionTime: CalculateResolutionTime(),
          verificationStatus: "VERIFIED"
      }
```

## Multi-Layer Discovery Architecture

### **Caching and Performance Optimization**

**Local Caching Strategy:**
```
Content Caching Hierarchy:

Browser Cache (Client-Side):
- Recently accessed content cached locally
- DIG Handle to DataStore mappings
- Provider performance metrics
- Reduces redundant blockchain queries

CDN Integration (Provider-Side):
- Storage providers operate CDN endpoints  
- Geographic content distribution
- Optimized blob serving infrastructure
- Market-driven performance improvements

Network Cache (Protocol-Level):
- Distributed caching of popular content
- Intelligent prefetching based on usage patterns
- Reduced latency for frequently accessed data
- Economic incentives for cache operators
```

**Provider Selection Optimization:**
- **Geographic Proximity**: Prefer providers geographically close to users
- **Performance History**: Track and prioritize high-performance providers
- **Network Bribes**: Respect content creator performance incentives
- **Redundancy Requirements**: Ensure multiple fallback options available

### **Content Routing Intelligence**

**Dynamic Provider Selection:**
```
ALGORITHM: Intelligent Provider Selection
PURPOSE: Optimize content delivery for performance and reliability

FACTORS:
  1. GEOGRAPHIC DISTANCE
     distance = CalculateGeographicDistance(userLocation, provider.location)
     geographicScore = 1.0 / (1.0 + distance * DISTANCE_PENALTY_FACTOR)
  
  2. PROVIDER PERFORMANCE HISTORY
     recentPerformance = GetRecentPerformanceMetrics(provider, TIME_WINDOW)
     performanceScore = WeightedAverage(recentPerformance.responseTime, recentPerformance.availability)
  
  3. NETWORK BRIBE INCENTIVES
     brideAmount = GetProviderBrideAmount(provider, dataStoreId)
     brideScore = ScaleBrideAmount(brideAmount)
  
  4. REDUNDANCY CONSIDERATIONS
     redundancyScore = CalculateRedundancyValue(provider, existingSelections)
  
  5. ECONOMIC EFFICIENCY
     costScore = CalculateCostEfficiency(provider.bandwidthCosts, provider.reliability)
  
  COMBINED_SCORE = (
      geographicScore * GEO_WEIGHT +
      performanceScore * PERFORMANCE_WEIGHT +
      brideScore * BRIBE_WEIGHT +
      redundancyScore * REDUNDANCY_WEIGHT +
      costScore * COST_WEIGHT
  )
  
  RETURN provider with highest COMBINED_SCORE
```

## Advanced Discovery Features

### **Content Type-Aware Resolution**

**Format-Specific Optimization:**
- **Static Websites**: Direct blob serving with minimal processing
- **Video Content**: Streaming-optimized chunking and progressive loading
- **Software Distributions**: Integrity verification and checksum validation
- **Database Content**: Structured query support and efficient indexing

**Adaptive Content Delivery:**
```
Content Type Detection and Optimization:

Web Applications:
- HTML/CSS/JS optimization and minification
- Progressive enhancement for offline capability
- Service worker integration for performance
- Responsive delivery based on client capabilities

Media Content:
- Adaptive bitrate streaming for video
- Progressive image loading and optimization
- Audio compression and format selection
- Thumbnail generation for previews

Document Archives:
- Search index generation and distribution
- Metadata extraction and cataloging
- Version control and diff optimization
- Collaborative editing support where applicable
```

### **Decentralized Search and Discovery**

**Content Indexing:**
- **Metadata Extraction**: Automatic indexing of DataStore metadata
- **Keyword Association**: Link DIG Handles with searchable terms
- **Usage Analytics**: Track access patterns for popularity metrics
- **Community Curation**: Enable user-generated content categorization

**Search Infrastructure:**
```
Distributed Search Architecture:

Index Nodes:
- Specialized nodes maintaining searchable indexes
- Distributed hash table (DHT) for efficient lookups
- Content categorization and tagging systems
- Economic incentives for index maintenance

Query Processing:
- Distributed query execution across index nodes
- Relevance ranking based on multiple factors
- Privacy-preserving search without revealing query details
- Content discovery through social and usage signals

Result Ranking:
- Domain registration cost as quality signal
- Access frequency and user engagement metrics
- Community voting and curation scores
- Economic signals from network bribes and staking
```

## Access Control and Privacy

### **Permission-Based Discovery**

**Access Control Integration:**
- **Public Content**: Open access through standard DIG Handle resolution
- **Restricted Content**: Access control through DataStore permissions
- **Premium Content**: Economic access controls and payment integration
- **Private Content**: Encryption and key management integration

**Privacy-Preserving Access:**
```
Privacy Features:

Anonymous Access:
- Tor network integration for IP address privacy
- Zero-knowledge proof-based access validation
- Content access without revealing user identity
- Protection against traffic analysis and surveillance

Encrypted Content:
- Client-side encryption before storage
- Key distribution through secure channels
- Access control without content revelation
- Forward secrecy for long-term privacy protection
```

### **Censorship Resistance Mechanisms**

**Distributed Resolution:**
- **Multiple Resolution Paths**: Various methods to resolve DIG Handles
- **Mirror Discovery**: Automatic fallback to alternative storage providers
- **Network Redundancy**: Geographic distribution prevents single points of failure
- **Economic Incentives**: Market-driven content persistence

**Anti-Censorship Features:**
- **Content-Agnostic Storage**: Providers store fragments without content knowledge
- **Distributed Architecture**: No central authority can block content access
- **Economic Sustainability**: Market incentives ensure long-term availability
- **Cryptographic Verification**: Content authenticity without centralized trust

## Developer Integration

### **API and SDK Support**

**Resolution APIs:**
```javascript
// DIG Network SDK Example
import { DIGResolver } from '@dig-network/sdk';

const resolver = new DIGResolver();

// Simple content resolution
const content = await resolver.resolve('my-app.dig');

// Advanced resolution with options
const advancedContent = await resolver.resolve('my-app.dig', {
  preferredProviders: ['geographic-proximity', 'high-performance'],
  cacheStrategy: 'aggressive',
  timeoutMs: 30000,
  integrityVerification: true
});

// Real-time content streaming
const stream = resolver.createStream('video-content.dig');
stream.on('data', (chunk) => {
  // Process streaming content
});
```

**Integration Patterns:**
- **Web Browser Integration**: JavaScript libraries for web applications
- **Mobile App Support**: Native SDKs for iOS and Android development
- **Server-Side Integration**: Node.js and Python libraries for backend services
- **CDN Integration**: Direct integration with existing CDN infrastructure

### **Performance Monitoring and Analytics**

**Resolution Metrics:**
- **Resolution Time**: Track time from DIG Handle to accessible content
- **Provider Performance**: Monitor storage provider response times and reliability
- **Geographic Distribution**: Analyze global content access patterns
- **Economic Efficiency**: Monitor cost-effectiveness of content delivery

**Developer Tools:**
- **Resolution Debugging**: Tools to diagnose resolution failures
- **Performance Profiling**: Detailed analysis of content delivery performance
- **Network Monitoring**: Real-time monitoring of provider availability
- **Cost Analysis**: Economic analysis of content storage and delivery costs

The DIG Network's content discovery system provides a seamless bridge between human-readable domain names and decentralized content storage, ensuring both performance and censorship resistance through sophisticated provider selection and economic incentives. 