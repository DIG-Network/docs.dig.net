import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className={styles.heroGlow} aria-hidden="true" />
      <div className="container">
        <img
          src="/img/brand/D-glow-logo.svg"
          alt=""
          className={styles.heroMark}
          aria-hidden="true"
        />
        <div className={styles.eyebrow}>PROOF-OF-STAKE LAYER 2 ON CHIA</div>
        <Heading as="h1" className={styles.heroTitle}>
          <span className="gt">DIG Network</span>
        </Heading>
        <p className={styles.heroSubtitle}>
          Developer documentation for the DIG Network and its primitives —
          decentralized publishing where the host never sees your content.
        </p>
        <div className={styles.buttons}>
          <Link className="button button--primary button--lg" to="/docs/">
            Explore the docs →
          </Link>
          <Link
            className={clsx('button button--lg', styles.ghostBtn)}
            to="/docs/digstore/what-is-digstore">
            DigStore primitive
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  return (
    <Layout
      title="DigStore — encrypted content-addressable WASM store"
      description="A Git-shaped, encrypted, content-addressable store that compiles to a single self-defending WebAssembly module.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
