---
sidebar_position: 3
---

# How the DIG Network Works

The **DIG Network** enables the creation, propagation, and consumption of **DataStores**—bundles of data transferred between peers on the network. The system is designed around three main goals:

1. **Creation of DataStores**
2. **Propagation of DataStores**
3. **Consumption of DataStores**

## Key Components

### 1. **DIG CLI**

A self-contained command-line tool for managing DataStores, which doesn’t require a Chia client to operate. The DIG CLI allows developers and publishers to:

- **Initiate** new DataStores.
- **Commit** data to DataStores.
- **Push** DataStores to the DIG Network.

### 2. **DIG Node**

A peer on the P2P network that propagates and serves data when requested. DIG Nodes play a crucial role in:

- **Hosting DataStores**: Storing and serving data to other peers and end-users.
- **Propagating Updates**: Ensuring that changes to DataStores are distributed across the network.
- **Maintaining Network Health**: Contributing to the resilience and robustness of the DIG Network.

## Getting DataStores on the Network

To get a DataStore on the DIG Network, it must be pushed to a **DIG Node**. Here's how it works:

- **Pushing to a Tracking DIG Node**: Any DIG Node that is already tracking the DataStore can accept updates from keys that have on-chain write access to that DataStore. Once the node receives updates, it will help propagate the changes to other nodes tracking the DataStore.

- **Pushing to a Non-Tracking DIG Node**: If you're pushing to a DIG Node that isn’t currently tracking the DataStore, you need **authorization** from the node to push it.

    - If you're pushing to a **DIG Node you own**, you can provide your credentials directly through the DIG CLI.
    - Alternatively, you can use a service like [https://hub.dig.net](https://hub.dig.net) (coming soon) to push your DataStore by providing credentials for your user account.

## Developer/Publisher Interaction

A **Developer/Publisher** uses the DIG CLI to manage and publish DataStores. A DataStore on the DIG Network works like a decentralized AWS S3 bucket. It has a primary owner and optionally, delegated writers. Only these parties, using their private blockchain keys, can modify the DataStore.

### DataStore Ownership

- DataStores are built using the **NFT standard**, meaning they can be **traded or transferred**, and ownership is tied to the NFT's holder.
- If all keys are lost, the DataStore can no longer be modified.

### Workflow for Publishers

1. **Initiate New DataStores**: Create a new DataStore using the DIG CLI.
2. **Commit Data to DataStores**: Add or modify data within your DataStore.
3. **Push the DataStore to a DIG Node**: Upload your DataStore to the network via a DIG Node.

**Note**: Data will not be available on the network until it is pushed to a DIG Node.