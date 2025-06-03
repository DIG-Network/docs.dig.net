import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // Custom sidebar for DIG Network documentation
  tutorialSidebar: [
    'intro',
    'support',
    {
      type: 'category',
      label: 'System Overview',
      items: [
        'overview/architecture',
        'overview/system-components',
        'overview/network-participants',
        'overview/content-propagation',
        'overview/incentive-model',
      ],
    },
    {
      type: 'category',
      label: 'Off-Chain Primitives',
      items: [
        'primitives/off-chain/plots',
        'primitives/off-chain/cart',
      ],
    },
    {
      type: 'category',
      label: 'On-Chain Primitives',
      items: [
        'primitives/on-chain/plotcoin',
        'primitives/on-chain/datastore',
        'primitives/on-chain/dig-handles',
        'primitives/on-chain/rewards-distributor',
      ],
    },
    {
      type: 'category',
      label: 'Zero-Knowledge Proofs',
      items: [
        'proofs/overview',
        'proofs/plot-ownership',
        'proofs/data-inclusion',
        'proofs/computational-work',
        'proofs/physical-access',
      ],
    },
    {
      type: 'category',
      label: 'Economics',
      items: [
        'economics/token-model',
      ],
    },
    {
      type: 'category',
      label: 'Network Operations',
      items: [
        'network/propagation',
        'network/validation',
        'network/bribes',
        'network/data-storage',
        'network/content-discovery',
        'network/rewards',
        'network/dao-governance',
      ],
    },
    {
      type: 'category',
      label: 'Technical Specifications',
      items: [
        'technical/plot-format',
        'technical/plotcoin-format',
        'technical/performance',
      ],
    },
  ],
};

export default sidebars;
