import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import React from 'react';

type FeatureItem = {
  title: string;
  icon: JSX.Element;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Encrypted at rest',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="10" width="16" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        <circle cx="12" cy="15" r="1.4" />
      </svg>
    ),
    description: (
      <>
        Content is sealed with a key <em>derived from its URN</em> (AES-256-GCM-SIV).
        The URN both locates and decrypts — there's no separate password or key
        stored anywhere. Lose the URN, lose the read.
      </>
    ),
  },
  {
    title: 'Provider-blind hosting',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18" />
      </svg>
    ),
    description: (
      <>
        Whoever hosts your store holds only ciphertext keyed by hashes. They can't
        scan it or read requests. Downloads are verified against the store id and
        the publisher's signed root, so a bad host can't feed you fabricated bytes.
      </>
    ),
  },
  {
    title: 'One self-defending file',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" />
        <path d="M9.5 12l2 2 3.5-4" />
      </svg>
    ),
    description: (
      <>
        Your data, the server that gates it, and its Merkle proofs compile into a
        single <code>.wasm</code> — padded to a uniform size that reveals nothing
        about its contents. Copy it to back it up; run it to serve it.
      </>
    ),
  },
];

function Feature({title, icon, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className={styles.card}>
        <div className={styles.iconTile}>{icon}</div>
        <Heading as="h3" className={styles.cardTitle}>{title}</Heading>
        <p className={styles.cardBody}>{description}</p>
      </div>
    </div>
  );
}

const HomepageFeatures: React.FC = () => {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.sectionHead}>
          <Heading as="h2">Why DigStore</Heading>
          <p>Three guarantees, baked into the format — not bolted on.</p>
        </div>
        <div className="row">
          {FeatureList.map((props, id) => (
            <Feature key={id} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomepageFeatures;
