---
sidebar_position: 4
---

# DIG Node Operators

A **DIG Node** is a peer responsible for hosting and propagating DataStores. Each node can selectively choose which DataStores to host, either:

- **Altruistically**: Hosting data without compensation, contributing to the network's robustness.
- **For Payment**: Hosting data to earn rewards through the network's incentive mechanisms.

## Roles and Responsibilities

- **Hosting Data**: Store DataStores and serve them upon request.
- **Propagating Updates**: Share updates to DataStores with other nodes.
- **Network Participation**: Maintain an active presence on the network to ensure data availability.

## Mercenary Mode

In **Mercenary Mode**, DIG Nodes:

- **Automatically Query the Blockchain**: Search for DataStores that pay for propagation.
- **Mirror Profitable DataStores**: Based on "earnings per byte" and allocated disk space.
- **Earn Rewards**: Receive payments directly to the node's payment address, calculated based on the storage provided.

Mercenary Mode allows node operators to maximize their earnings by dynamically adjusting which DataStores they host.
