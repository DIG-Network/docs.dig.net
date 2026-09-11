---
sidebar_position: 1
title: Fund a reward distributor
description: "Fund a managed reward distributor that pays your mirrors automatically, with a bounded, recoverable commitment — and what a stopped prover does and does not do to that payment."
keywords:
  - reward distributor
  - fund mirrors
  - clawback
  - CommitIncentives
  - reward funders
tags:
  - dig-rewards-coin
  - dig-rpc
  - custody
---

# Fund a reward distributor

> **This page is for the funder** — whoever pays a store's `dig-rewards-coin` reward distributor to
> attract mirrors. If you are a peer *mirroring* someone else's store to earn from a distributor
> someone else funded, this is not your page: see
> [Earn rewards for mirroring](../run-a-node/earn-mirror-rewards.md) instead, and read the role
> difference there before assuming a figure on that page is yours.

## The mental model

A reward distributor is an on-chain, `Managed`-type CHIP-0051 coin
(`dig-rewards-coin` [0.4.0](https://crates.io/crates/dig-rewards-coin)) that a funder launches and
commits $DIG to, so that peers who mirror the funder's store are paid automatically for passing
periodic challenges. **The distributor pays itself** — payouts are permissionless spends any
eligible peer can build once admitted — so the funder is not in the path of an individual payment.
The funder's own node runs the **prover**, the process that admits and evicts peers from the paid
list; it does not gate payment itself (see the uptime warning below).

## Funding is per commitment, and only `CommitIncentives` is recoverable

There are two ways to put $DIG into a distributor, and they are not interchangeable:

- **`AddIncentives`** adds to the *current* epoch's rewards. It creates no commitment slot. It is an
  **irrevocable donation** — there is nothing later to claw back.
- **`CommitIncentives`** funds a *future* epoch and creates a commitment slot recording a
  `clawback_puzzle_hash` entitled to reclaim it. This is the recoverable funding path, and it
  defaults to **`COMMITMENT_DEPTH_EPOCHS = 2`** future epochs
  (`dig-rewards-coin` `SPEC.md` §7.4 clause 1, tag `v0.4.0`) — deep enough for one full epoch of
  slack at the default 7-day epoch length, shallow enough to bound exposure if the prover ever stops
  admitting new peers (see the warning below).

**Only `CommitIncentives` gives you anything to withdraw.** If your funding UI offers a clawback
button next to money that went in through `AddIncentives`, that button does not correspond to
anything on chain.

## Clawback: who, and how much — the rule, not a number

Only the holder of the key recorded as that commitment slot's `clawback_puzzle_hash` may claw it
back (`SPEC.md` §7.4 clause 3, `v0.4.0`) — **not** the manager singleton, **not** the launcher
coin, and **not** any operator role. A clawback returns **90%** of the committed slot; the
remaining **10%** is forfeit to the reserve, where it is later paid out to whichever peers hold
entries at that time — not to the mirrors whose costs the funder is retracting against (`SPEC.md`
§7.4/§7.5, `v0.4.0`).

We are not showing a computed recoverable amount on this page. A pre-existing defect in this
crate's `withdraw_committed_incentives` (tracked as
[dig-rewards-coin#3303](https://github.com/DIG-Network/dig-rewards-coin/issues/3303), present
since 0.3.0) returns an uncorrected wrapped `u64` for a clawback figure, so any number the software
shows you for "what you'd get back" is **not yet trustworthy** — the 90/10 *rule* above is normative
and correct; a *displayed total* is not, until that fix lands. Do not rely on a shown recoverable
figure to decide how much to commit.

## Your uptime — what your prover does and does not control

**This is the funder's own risk, not a peer's.** Your prover is the process that decides *who* is on
the paid list; it is not the gate on *whether* anyone gets paid.

1. **Payment does not pause when your prover stops.** Accrual and payouts are permissionless — a
   peer who already holds an entry can claim without your node's participation, at any time.
2. **Your funds are not lost when it stops.** They stay in the reserve, and anything you funded with
   `CommitIncentives` remains clawback-eligible the whole time.
3. **What actually breaks: the paid list freezes.** While your prover is stopped, peers who have
   stopped mirroring your store keep earning, and peers who start mirroring cannot be added to the
   list that gets paid.
4. **Losing your manager singleton key freezes that list permanently** — unless you chose a
   recovery-capable inner puzzle (a multisig or k-of-n) for the manager singleton **at launch**.
   That choice is offered only on the creation screen, before the launch spend is signed, and is
   fixed for the distributor's whole life once you sign.
5. **How bad #3 can get, as a number:** it is bounded by how many future epochs you've already
   committed — `COMMITMENT_DEPTH_EPOCHS = 2` by default. At the default epoch length that is at most
   roughly two weeks of paying a list that stopped tracking who is really mirroring — a bounded risk,
   not an open-ended one.

**Downtime does not pause payment. It hands payment to a list that has stopped being true.**

## What you can check on this node today

`dig-rpc-protocol` v0.11.0 defines four reward-distributor RPC methods
(`dig.getRewardProverStatus`, `dig.listRewardDistributors`, `dig.getRewardDistributor`,
`dig.listRewardDistributorCommitments`). **As of `dig-node` v0.257.0, only
`dig.getRewardProverStatus` is served** — the other three return `-32601` (method not found). The
cause is that `dig-node` has not yet implemented them, not a version mismatch you can resolve by
upgrading. **Consequence: as of `dig-app` 15.6.0, there is no clawback affordance in the app** — the
UI to browse your commitments and initiate a withdrawal is not there yet, on any current version.
This page will be updated when that surface ships; there is no workaround today beyond building
against the RPC and driver directly.

## The empty first epoch is normal, not a stranding risk

Every distributor spends its first epoch with no admitted peers yet — the default launch delay and
the minimum time before a first entry can be written mean an empty entry set at the start is the
ordinary path, not a misconfiguration. Value that accrues during that window carries forward and is
fully distributable once peers are admitted; you do not need to tune anything about your launch
timing to avoid losing it.

## Related

- [Earn rewards for mirroring](../run-a-node/earn-mirror-rewards.md) — the peer's side of this same
  distributor
- [Run a DIG node](../run-a-node/index.md)
