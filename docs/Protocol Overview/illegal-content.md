---
sidebar_position: 5
---

# Illegal Content

## Addressing CSAM and Illegal Content

**Child Sexual Abuse Material (CSAM)** is a significant concern given the censorship resistance that the DIG Network can provide. While decentralized networks empower individuals, they can also create opportunities for undesirable and illegal content to propagate.

### Law Enforcement and IP Addresses

- **DIG Nodes Have IP Addresses**: Individual DIG Nodes are not entirely censorship-resistant.
- **Law Enforcement Tracking**: Agencies can track illegal activity via these IP addresses.
- **Regulatory Actions**: Regulatory and legal mechanisms can compel individual nodes to stop hosting illegal content.

The censorship resistance of the DIG Network arises from the fact that if one node is shut down, another node—potentially in a different jurisdiction—can pick up where the last left off.

## Community Reporting

The DIG Network will provide an online form at [https://csam.dig.net](https://csam.dig.net) (coming soon) where the community can report store IDs they believe may contain such content.

- **Reporting Process**: Any reported content will be forwarded to law enforcement and the [NCMEC CyberTipline](https://www.missingkids.org/gethelpnow/cybertipline) for further investigation.

## Strategies for DIG Node Operators

To avoid hosting illegal or undesirable content, DIG Node operators have several strategies at their disposal:

### 1. **Cloudflare CSAM Detection**

- **Utilize Cloudflare Services**: Cloudflare offers CSAM detection, filtering, and automatic reporting.
- **Implement Reverse Proxy**: By using a Cloudflare reverse proxy for your DIG Node's content server, you can automatically detect and report CSAM.

### 2. **Selective Mirroring**

- **Full Control Over Content**: DIG Node operators have full control over the DataStores they choose to mirror.
- **Content Alignment**: Decide to only host content that aligns with your values.

### 3. **Caution with Mercenary Mode**

- **Understand the Risks**: Mercenary Mode automatically mirrors DataStores based on profitability, which can reduce control over the content.
- **Develop Filtering Tools**: As the system matures, tools will be developed to allow DIG Nodes to mirror only the content they want while still earning rewards.

## Undesirable Lawful Content

DIG Node operators may also want to avoid hosting **"undesirable lawful content"**, such as:

- **Consensual Pornography**
- **Drugs**
- **Firearms**
- **Scams**
- **Other Content Conflicting with Personal Values**

### Responsibility of Node Operators

- **Content Alignment**: Ensure the content you host aligns with your personal or organizational values.
- **Content Curation**: Use the control provided by the DIG Protocol to curate your node's content.

## Planned Mitigations

The DIG Protocol developers are actively working on tools and strategies to limit the spread of illegal or undesirable content:

- **Cloudflare CSAM Filter**: Wrapping DIG Nodes behind Cloudflare's CSAM filter.
- **Publishing Offending Store IDs**: If any CSAM is detected, a DataStore listing offending store IDs will be published.
- **Community Subscription**: Other DIG Nodes can subscribe to this DataStore to proactively avoid mirroring such content.

### High-Priority Research

- **Developing Robust Tools**: Ongoing research to create tools that allow node operators to avoid hosting illegal content.
- **Community Feedback**: Welcoming community input to build a responsible decentralized internet.
