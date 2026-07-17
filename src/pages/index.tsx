import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Translate, { translate } from '@docusaurus/Translate';
import React from 'react';

import styles from './index.module.css';

function Hero() {
  return (
    <header className={styles.hero}>
      <div className={styles.heroBg} aria-hidden="true">
        <div className={styles.dotGrid} />
        <svg className={styles.orbits} viewBox="0 0 1200 620" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="orb" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#5800d6" stopOpacity="0" />
              <stop offset="50%" stopColor="#b98cff" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#ff00de" stopOpacity="0" />
            </linearGradient>
          </defs>
          <g transform="translate(600 310)" fill="none" stroke="url(#orb)">
            <ellipse rx="540" ry="210" strokeWidth="1.2" transform="rotate(-18)" />
            <ellipse rx="430" ry="300" strokeWidth="1" transform="rotate(24)" opacity="0.7" />
            <ellipse rx="560" ry="120" strokeWidth="1" transform="rotate(8)" opacity="0.5" />
          </g>
          <circle cx="965" cy="180" r="3.5" fill="#ff3df5" />
          <circle cx="240" cy="430" r="3" fill="#b98cff" />
          <circle cx="980" cy="470" r="2.5" fill="#38e1b0" />
        </svg>
        <div className={styles.glowCore} />
      </div>

      <div className={clsx('container', styles.heroInner)}>
        <div className={styles.heroCopy}>
          <span className={styles.pill}>
            <span className={styles.pillDot} />{' '}
            <Translate id="homepage.hero.pill">Proof-of-Stake Layer 2 on Chia</Translate>
          </span>
          <Heading as="h1" className={styles.h1}>
            <Translate
              id="homepage.hero.title"
              values={{ decentralized: <span className="gt"><Translate id="homepage.hero.title.decentralized">decentralized</Translate></span> }}>
              {'Build on the {decentralized} data layer'}
            </Translate>
          </Heading>
          <p className={styles.lead}>
            <Translate
              id="homepage.hero.lead"
              values={{ digstore: <strong><Translate id="homepage.hero.lead.digstore">dig-store</Translate></strong> }}>
              {'DIG Network is a developer platform for publishing and serving content where the host never sees what it carries. Start with {digstore} — encrypted, content-addressable storage that compiles to a single self-defending WebAssembly module.'}
            </Translate>
          </p>
          <div className={styles.ctaRow}>
            <Link className="button button--primary button--lg" to="/docs/">
              <Translate id="homepage.hero.cta.docs">Explore the docs →</Translate>
            </Link>
            <Link className={clsx('button button--lg', styles.ghost)} to="/docs/digstore/cli/quickstart">
              <Translate id="homepage.hero.cta.quickstart">Quick start</Translate>
            </Link>
            <Link
              className={clsx('button button--lg', styles.ghost)}
              to="https://github.com/DIG-Network/DIG_Browser/releases">
              <Translate id="homepage.hero.cta.browser">Get the DIG Browser ↗</Translate>
            </Link>
          </div>
          <div className={styles.trust}>
            <span><Translate id="homepage.hero.trust.license">Open source · GPL-2.0</Translate></span>
            <span className={styles.dot} />
            <span><Translate id="homepage.hero.trust.platforms">macOS · Linux · Windows</Translate></span>
            <span className={styles.dot} />
            <span><Translate id="homepage.hero.trust.binary">Single-binary CLI</Translate></span>
          </div>
        </div>

        <div className={styles.heroArt}>
          <img src="/img/brand/D-glow-logo.svg" alt="" className={styles.heroMark} aria-hidden="true" />
          <div className={styles.terminal}>
            <div className={styles.termBar}>
              <span className={styles.tdot} />
              <span className={styles.tdot} />
              <span className={styles.tdot} />
              <em>dig-store</em>
            </div>
            <pre className={styles.termBody}>
              <code>{`$ digs init site --dir dist
`}<span className={styles.ok}>✓ Initialized store 'site'</span>{`
$ digs add -A
  47.2 MB staged · 80.8 MB free
$ digs commit -m "v1"
`}<span className={styles.ok}>✓ generation 1a2b3c… → site.wasm</span>{`
$ digs cat urn:dig:chia:…/index.html`}</code>
            </pre>
          </div>
        </div>
      </div>
    </header>
  );
}

type Pillar = { title: JSX.Element; icon: JSX.Element; body: JSX.Element };

function usePillars(): Pillar[] {
  return [
    {
      title: <Translate id="homepage.pillar.encrypted.title">Encrypted at rest</Translate>,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="10" width="16" height="10" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          <circle cx="12" cy="15" r="1.4" />
        </svg>
      ),
      body: (
        <Translate id="homepage.pillar.encrypted.body">
          {'The URN is the key — it both locates and decrypts (AES-256-GCM-SIV). No password, no key stored anywhere.'}
        </Translate>
      ),
    },
    {
      title: <Translate id="homepage.pillar.blind.title">Provider-blind</Translate>,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18" />
        </svg>
      ),
      body: (
        <Translate id="homepage.pillar.blind.body">
          {"Hosts hold only ciphertext keyed by hashes. Downloads are verified against the store id and the publisher's signed root."}
        </Translate>
      ),
    },
    {
      title: <Translate id="homepage.pillar.selfDefending.title">One self-defending file</Translate>,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" />
          <path d="M9.5 12l2 2 3.5-4" />
        </svg>
      ),
      body: (
        <Translate
          id="homepage.pillar.selfDefending.body"
          values={{ wasm: <code>.wasm</code> }}>
          {'Data, server, and Merkle proofs compile into one {wasm}, padded to a uniform size that reveals nothing.'}
        </Translate>
      ),
    },
  ];
}

function Primitives() {
  const pillars = usePillars();
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.head}>
          <span className={styles.kicker}>
            <Translate id="homepage.primitives.kicker">PRIMITIVES</Translate>
          </span>
          <Heading as="h2">
            <Translate id="homepage.primitives.title">Composable building blocks</Translate>
          </Heading>
          <p>
            <Translate id="homepage.primitives.subtitle">
              dig-store is available now. More DIG Network primitives are on the way.
            </Translate>
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureCardHead}>
            <div>
              <span className={styles.badge}>
                <Translate id="homepage.primitives.available">AVAILABLE</Translate>
              </span>
              <Heading as="h3" className={styles.featureTitle}>
                <span className="gt">dig-store</span>
              </Heading>
              <p className={styles.featureLead}>
                <Translate id="homepage.primitives.digstore.lead">
                  A Git-shaped, encrypted, content-addressable store. Point it at a
                  build directory, commit generations, and address everything by URN.
                </Translate>
              </p>
              <Link className={styles.textLink} to="/docs/digstore/what-is-digstore">
                <Translate id="homepage.primitives.digstore.link">Read the dig-store docs →</Translate>
              </Link>
            </div>
          </div>
          <div className={styles.pillarGrid}>
            {pillars.map((p, i) => (
              <div className={styles.pillar} key={i}>
                <div className={styles.pillarIcon}>{p.icon}</div>
                <h4>{p.title}</h4>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function useSteps() {
  return [
    {
      n: '01',
      t: <Translate id="homepage.steps.capture.title">Capture</Translate>,
      d: <Translate id="homepage.steps.capture.body">Point a store at your build output.</Translate>,
      c: 'digs init site --dir dist',
    },
    {
      n: '02',
      t: <Translate id="homepage.steps.commit.title">Commit</Translate>,
      d: <Translate id="homepage.steps.commit.body">Seal a generation into one .wasm.</Translate>,
      c: 'digs add -A && digs commit -m "v1"',
    },
    {
      n: '03',
      t: <Translate id="homepage.steps.share.title">Share</Translate>,
      d: <Translate id="homepage.steps.share.body">Push to a remote; hand out a URN.</Translate>,
      c: 'digs push origin',
    },
  ];
}

function HowItWorks() {
  const steps = useSteps();
  return (
    <section className={clsx(styles.section, styles.sectionAlt)}>
      <div className="container">
        <div className={styles.head}>
          <span className={styles.kicker}>
            <Translate id="homepage.howItWorks.kicker">HOW IT WORKS</Translate>
          </span>
          <Heading as="h2">
            <Translate id="homepage.howItWorks.title">Three commands to publish</Translate>
          </Heading>
          <p>
            <Translate id="homepage.howItWorks.subtitle">
              Git-style workflow for build output — encrypted and addressable from the first commit.
            </Translate>
          </p>
        </div>
        <div className={styles.steps}>
          {steps.map((s) => (
            <div className={styles.step} key={s.n}>
              <span className={styles.stepNum}>{s.n}</span>
              <h4>{s.t}</h4>
              <p>{s.d}</p>
              <code className={styles.stepCode}>{s.c}</code>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTABand() {
  return (
    <section className={styles.ctaBand}>
      <div className={clsx('container', styles.ctaInner)}>
        <div className={styles.ctaGlow} aria-hidden="true" />
        <Heading as="h2">
          <Translate id="homepage.cta.title">Start building with dig-store</Translate>
        </Heading>
        <p>
          <Translate id="homepage.cta.subtitle">
            Install the CLI and publish your first encrypted store in under a minute.
          </Translate>
        </p>
        <div className={styles.ctaRow}>
          <Link className="button button--primary button--lg" to="/docs/digstore/cli/install">
            <Translate id="homepage.cta.install">Install the CLI</Translate>
          </Link>
          <Link className={clsx('button button--lg', styles.ghost)} to="/docs/digstore/format/overview">
            <Translate id="homepage.cta.format">Learn the format</Translate>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home(): JSX.Element {
  const title = translate({
    id: 'homepage.meta.title',
    message: 'DIG Network — the decentralized data layer',
  });
  const description = translate({
    id: 'homepage.meta.description',
    message:
      'DIG Network is a Proof-of-Stake Layer 2 on Chia. Developer docs for the network and its primitives, including dig-store — encrypted content-addressable storage.',
  });
  return (
    <Layout title={title} description={description}>
      <div className={styles.page}>
        <Hero />
        <main>
          <Primitives />
          <HowItWorks />
          <CTABand />
        </main>
      </div>
    </Layout>
  );
}
