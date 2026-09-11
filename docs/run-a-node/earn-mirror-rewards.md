---
sidebar_position: 12
title: Earn rewards for mirroring
description: "Get paid automatically for mirroring a store whose funder runs a reward distributor — the claim cadence, the payout floor, why a claim is skipped rather than failed, and what to do if you stop getting paid."
keywords:
  - reward distributor
  - mirror rewards
  - claim cadence
  - payout threshold
tags:
  - dig-rewards-coin
  - dig-node
  - mirror
---

# Earn rewards for mirroring

> **This page is for a mirroring peer** — a `dig-node` operator mirroring someone else's store and
> being paid for it. If you are the one funding a reward distributor to attract mirrors, this is not
> your page: see [Fund a reward distributor](../audiences/reward-funders.md) instead, and read the
> role difference there before assuming a figure on that page is yours.

## The mental model

A store's funder can launch a `dig-rewards-coin` reward distributor and commit $DIG to it. If you
mirror that store and pass the distributor's periodic challenges, your node accrues a share and can
claim it. **These are your own earnings from that specific distributor** — not the funder's total
commitment, and not any other peer's.

## How your claim works

Your node's claim loop runs on its own cadence, independent of the distributor: it claims every
**24 hours** by default (`CLAIM_CADENCE_SECONDS = 86_400`), jittered by at least **1 hour**
(`CLAIM_JITTER_SECONDS = 3_600`) so a fleet of peers sharing the default doesn't converge on the
same minute and self-congest (`dig-rewards-coin` `SPEC.md` §8.6, tag `v0.4.0`).

**If your accrued amount is below the payout floor, the claim is skipped, not failed.** The floor is
**1,000 base units = 1.000 $DIG** (`SPEC.md` §8.3, `v0.4.0`). Nothing compares that to a fee: the
threshold is in $DIG base units, an on-chain fee is in XCH mojos, and your node has no rate between
the two — so "the fee is smaller than the claim" is not computed anywhere. 1 $DIG was chosen as above
any *plausible* fee, and small enough that a mirror earning at the §6.5 funding floor clears it daily
(`SPEC.md` §8.3 clauses 1-2, `v0.4.0`); a mirror earning below that funding floor clears it less often. A skipped
claim is not an error and nothing is lost: your accrual keeps building toward the next attempt.

There is no computable floor in $DIG terms that also accounts for the on-chain fee in mojos — those
are two different assets with no exchange rate available on your node. The **$DIG payout threshold
above is the real floor** on whether a claim goes out at all. Your node's own fee settings (a
200,000-mojo ceiling per claim, plus a persisted per-window budget) are a **ceiling** on what your
node is willing to spend claiming, not a floor on what you're owed — do not read them as the
minimum payout.

## Eviction — three consecutive missed challenges, and it is not permanent

The distributor's prover challenges every mirror it has admitted. A cycle your node fails
increments a strike counter for you; a cycle you pass resets it to zero. At **three consecutive
strikes** you are removed from the paid list (`SPEC.md` §3.6, `v0.4.0`) — roughly three hours of
continuous unavailability at the default challenge cadence, long enough to be a real outage rather
than one dropped packet.

Removal is terminal for that entry, not for you as a mirror: you can pass the challenge again and,
after a cooldown, be re-admitted. Your own claim loop keeps watching a distributor it knows about
even while you hold no entry in it — it costs your node nothing but an occasional chain read, and
it's the only way to notice you've been re-admitted.

## If you stop getting paid

A missing payout can mean several benign things — you're below the payout floor this cycle, your
entry hasn't landed yet, or you're between challenges. **It can also mean something is actually
wrong** — a networking problem, a challenge you're failing without knowing it, or eviction. Holding no
entry does not tell you which of these it is: an entry you were evicted from and an entry that was
never added look identical on chain, because `RemoveEntry` spends the slot and leaves no marker
behind, and nothing may present a guess between them as an accounting fact (`SPEC.md` §12.5 clause 7,
`v0.4.0`). Your own past `InitiatePayout` spends are the only on-chain evidence of your own claim
history. Your
node's own status surface is where to check, because a list of ordinary reasons is not a substitute
for knowing whether one of them is actually the failure: if your `dig-node` reports a real problem
(a chain-source outage, a cycle deadline miss, a stopped claim loop), treat that report as the
signal — don't assume "not paid yet" is always benign without checking.

## Related

- [Fund a reward distributor](../audiences/reward-funders.md) — the funder's side of this same
  distributor
- [Run a DIG node](/docs/run-a-node)
