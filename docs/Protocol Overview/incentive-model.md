---
sidebar_position: 6
---

# Incentive Model

#### Overview

The primary method for propagating DataStores on the DIG Network is through a **"Pay-to-Propagate"** model. This approach recognizes that storage is a finite resource with intrinsic value. Just as you would pay for centralized hosting, there is a cost associated with decentralized hosting. However, the DIG Network offers unique advantages:

- **Decentralized Mirroring**: Paying for decentralized hosting means compensating peers to **mirror** your content, ensuring backups and accessibility across the globe.
- **Dynamic Participation**: Instead of contracting with individual peers, you **offer an incentive to the entire DIG Network**. Any set of peers can choose to accept the offer based on profitability.

This model fosters a constantly shifting network of peers hosting DataStores, enhancing **censorship resistance** as the sources of data are in continuous flux due to market dynamics.

#### How Pay-to-Propagate Works

1. **Offering Incentives**: As a **Store Sponsor**, you announce an incentive on-chain, specifying the amount of XCH (Chia's cryptocurrency) you are willing to pay for the current epoch (7 days). This incentive is intended to encourage DIG Nodes to mirror your DataStore.

2. **Discoverability**: Since the announcement is on-chain, DIG Nodes can programmatically or manually discover it. Nodes will evaluate the profitability and decide whether to mirror the DataStore.

3. **Dynamic Profitability**:
   - **Market Forces**: Profitability for DIG Nodes is highly dynamic. One of the leading variables is the number of existing peers mirroring the DataStore.
   - **Supply and Demand**: As more peers choose to mirror a DataStore, the profitability per node decreases, and vice versa.
   - **Shifting Participation**: This creates a dynamic environment where the set of peers hosting a DataStore constantly changes, driven by market incentives.

#### Role of the Store Sponsor

- **Who Can Be a Store Sponsor?**: Any DIG Node can become a **Store Sponsor**. While typically the DataStore owner acts as the sponsor to ensure their data is widely propagated, anyone can sponsor a DataStore for any reason.
- **Anonymity**: Payments are made directly from the Store Sponsor to DIG Nodes using the Chia blockchain. This method provides a level of anonymity for the sponsor, especially if they use freshly farmed (virgin) XCH. The Store Sponsor's IP address is not exposed during this process.

#### Incentive Distribution Process

The DIG Network is working towards a payment mechanism that is **provably fair**. While the current system has limitations due to limited accountability for the Store Sponsor, the general process is as follows:

1. **Announcement**:
   - The Store Sponsor announces on-chain their intent to pay out a specified amount of XCH for the current epoch.
   - The incentive is intended to be split among all DIG Nodes that choose to accept the offer and mirror the DataStore.

2. **Discovery and Mirroring**:
   - DIG Nodes discover the incentive announcement and decide whether to mirror the DataStore based on potential profitability.
   - The more the Store Sponsor offers, the more mirrors they are likely to attract, enhancing data resilience and censorship resistance.

3. **Rounds and Challenges**:
   - **Epoch Structure**: An epoch consists of **1,008 rounds** (one every 10 minutes over 7 days).
   - **Peer Selection**: Every 10 minutes, the Store Sponsor retrieves the list of valid DIG Nodes mirroring their DataStore. These are peers who have:
     - Announced their intent to mirror the DataStore for the epoch.
     - Met the staking requirements (e.g., staking at least 1 XCH per DataStore).

4. **Verification**:
   - The Store Sponsor challenges each peer to verify they are serving the DataStore.
   - **Challenge Mechanism**:
     - Peers are asked for hashes of random 100 KB chunks of data across multiple keys in the DataStore.
     - This is an efficient way to confirm data availability without auditing the entire DataStore.

5. **Incentive Distribution**:
   - The incentive for the current round is distributed to all peers who successfully pass the challenge.
   - **Failed Challenges**:
     - Peers that fail the challenge are **blacklisted for the remainder of the epoch** to promote high-quality service.
     - Blacklisted peers can become eligible again in the next epoch.

#### Limitations and Future Improvements

- **Trust-Based System**: Currently, DIG Nodes place trust in the Store Sponsor to follow through with payments.
- **Lack of Enforcement**: There is nothing forcing the Store Sponsor to make payments after announcing their intent.
- **Potential for Non-Payment**: DIG Nodes risk not receiving compensation if the Store Sponsor does not honor their commitment.
- **Mitigation**:
  - DIG Nodes can **blacklist** incentive programs from Store Sponsors who fail to pay.
  - This encourages Store Sponsors to maintain a good reputation if they want nodes to mirror their DataStores.

#### Active Research and Development

The DIG Network is actively researching and developing mechanisms to enhance the fairness and reliability of the incentive system:

- **On-Chain Escrow Vaults**:
  - Store Sponsors would lock funds on-chain in an escrow, guaranteeing that the incentives are available for distribution.
  - This adds a layer of security for DIG Nodes, assuring them that the funds are secured.

- **DataLayer Oracles**:
  - Utilizing oracles to automate verification processes and payment distribution.
  - This would reduce reliance on the Store Sponsor's honesty and increase transparency.

- **Provably Fair Payments**:
  - Implementing cryptographic methods to ensure payments are made fairly and verifiably.
  - This would build trust in the system and encourage more DIG Nodes to participate.

#### Summary

The **Pay-to-Propagate** model is central to the DIG Network's strategy for incentivizing the propagation of DataStores:

- **Decentralized Incentivization**: Store Sponsors offer incentives to the network as a whole, promoting widespread data mirroring without needing individual contracts.
- **Dynamic and Market-Driven**: The number of peers hosting a DataStore adjusts based on profitability, contributing to both efficiency and censorship resistance.
- **Current Limitations**: The system currently relies on trust, with ongoing efforts to enhance fairness and enforceability.
- **Future Enhancements**: Active development is focused on introducing escrow mechanisms and cryptographic assurances to create a more robust and trustworthy incentive system.

By understanding and participating in this model, DIG Nodes and Store Sponsors contribute to a resilient, decentralized network that values both data availability and fair compensation for resource contributions.