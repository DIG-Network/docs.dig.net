---
sidebar_position: 5
---

# Staking Process

#### 1. Why Do DIG Nodes Need to Stake?

DIG Nodes use the Chia Blockchain to maintain an on-chain registry of which peers are hosting which DataStores. This registry consists of **Server Coins**, which are coins on the Chia blockchain that list the store ID and the peer's IP address that serves it. These Server Coins are easily queryable by anyone, providing transparency and allowing for efficient peer discovery.

In the old DataLayer system, this registry had a major weakness:

- **Unvalidated Entries**: Any peer could write to the registry without proper validation.
- **Outdated Records**: Peers that went offline would still have their records lingering in the registry.

These issues led to a cluttered registry filled with invalid or outdated entries, causing DataLayer clients to slow down as they sifted through accumulating junk data.

#### 2. Introduction of Epochs

To address these problems, the DIG Network introduced the concept of **epochs**:

- **Epoch Duration**: An epoch is a period of **7 days**, running from **Monday 12:00 AM UTC to Monday 11:59 PM UTC**.
- **Announcement Validity**: When a peer announces that they are serving data for a specific store ID, that announcement is only valid for the current epoch.
- **Responsibility to Re-announce**: DIG Nodes must **re-announce** their intention to serve a DataStore at the beginning of each new epoch.

If a DIG Node fails to re-announce:

- **Invalidation**: The DIG Network will consider them invalid and ignore the peer for that DataStore.
- **Garbage Collection**: This mechanism prevents the registry from accumulating dead or inactive peers over time, effectively acting as a form of garbage collection.

By enforcing fresh announcements each epoch, the network maintains a higher probability of a registry filled with active and available peers.

#### 3. Staking Requirements

To announce that your DIG Node is serving a DataStore each epoch, you are required to **stake** or lock up **1 XCH** (the native token of the Chia blockchain). Here's how it works:

- **Minimum Stake**: A minimum of **1 XCH** must be staked per DataStore.
- **Redeemable at Any Time**: The staked XCH is redeemable whenever you choose, offering flexibility.
- **Eligibility for Rewards**: To earn rewards from Incentive Programs, you must meet the minimum staking requirement; lower amounts will be ignored by network participants.
- **Adjustable Amount**: The staking amount may change in the future based on the price of XCH to remain accessible.

##### Purposes of Staking:

- **Spam Prevention**: Requiring a significant, redeemable stake deters spam and potential Denial-of-Service (DoS) attacks. It limits the ability of malicious actors to flood the registry with invalid entries.
- **Incentivizing Maintenance**: The staking requirement encourages DIG Nodes to clean up old stakes and reclaim their funds, promoting regular maintenance and contributing to the network's overall health.

#### 4. Peer IP Address De-duplication

To ensure fairness and prevent exploitation:

- **De-duplication**: The DIG Network de-duplicates peer IP addresses during peer selection and incentive payouts.
- **Fair Rewards**: This means that even if a peer makes multiple announcements using the same IP address, they will not receive disproportionate rewards.
- **Preventing Abuse**: It stops peers from attempting to increase their payout rates unfairly by making multiple announcements.

#### 5. Summary

To participate in the DIG Network as a valid peer and be eligible for rewards:

- **Re-announce Each Epoch**: DIG Nodes must re-announce their availability for each DataStore they are serving **at least every 7 days** (each epoch).
- **Stake at Least 1 XCH**: Nodes must stake a minimum of **1 XCH** in their announcement for each DataStore.
- **Maintain Valid Announcements**: Ensure that your announcements meet all network criteria to avoid being filtered out.
- **Adhere to Network Guidelines**: Non-compliant DIG Nodes will not receive payments from Incentive Programs.

By following these requirements, the DIG Network maintains a reliable and efficient on-chain registry of active peers. This ensures optimal performance, reduces clutter from invalid entries, and upholds the integrity of the network for all participants.