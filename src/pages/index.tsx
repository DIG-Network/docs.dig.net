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
        <div className={styles.eyebrow}>BY DIG NETWORK</div>
        <Heading as="h1" className={styles.heroTitle}>
          <span className="gt">DigStore</span>
        </Heading>
        <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--primary button--lg" to="/docs/cli/quickstart">
            Get started →
          </Link>
          <Link
            className={clsx('button button--lg', styles.ghostBtn)}
            to="/docs/format/overview">
            Learn the format
          </Link>
        </div>
        <div className={styles.heroCode}>
          <pre>
            <code>{`digstore init site --dir dist     # capture your build output
digstore add -A                   # stage everything under dist/
digstore commit -m "v1"           # seal a generation → one .wasm
digstore cat urn:dig:chia:<storeID>/index.html`}</code>
          </pre>
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
