import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
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
            <span className={styles.pillDot} /> Proof-of-Stake Layer 2 on Chia
          </span>
          <Heading as="h1" className={styles.h1}>
            Build on the <span className="gt">decentralized</span> data layer
          </Heading>
          <p className={styles.lead}>
            DIG Network is a developer platform for publishing and serving content
            where the host never sees what it carries. Start with{' '}
            <strong>DigStore</strong> — encrypted, content-addressable storage that
            compiles to a single self-defending WebAssembly module.
          </p>
          <div className={styles.ctaRow}>
            <Link className="button button--primary button--lg" to="/docs/">
              Explore the docs →
            </Link>
            <Link className={clsx('button button--lg', styles.ghost)} to="/docs/digstore/cli/quickstart">
              Quick start
            </Link>
            <Link
              className={clsx('button button--lg', styles.ghost)}
              to="https://github.com/DIG-Network/DIG_Browser/releases">
              Get the DIG Browser ↗
            </Link>
          </div>
          <div className={styles.trust}>
            <span>Open source · GPL-2.0</span>
            <span className={styles.dot} />
            <span>macOS · Linux · Windows</span>
            <span className={styles.dot} />
            <span>Single-binary CLI</span>
          </div>
        </div>

        <div className={styles.heroArt}>
          <img src="/img/brand/D-glow-logo.svg" alt="" className={styles.heroMark} aria-hidden="true" />
          <div className={styles.terminal}>
            <div className={styles.termBar}>
              <span className={styles.tdot} />
              <span className={styles.tdot} />
              <span className={styles.tdot} />
              <em>digstore</em>
            </div>
            <pre className={styles.termBody}>
              <code>{`$ digstore init site --dir dist
`}<span className={styles.ok}>✓ Initialized store 'site'</span>{`
$ digstore add -A
  47.2 MB staged · 80.8 MB free
$ digstore commit -m "v1"
`}<span className={styles.ok}>✓ generation 1a2b3c… → site.wasm</span>{`
$ digstore cat urn:dig:chia:…/index.html`}</code>
            </pre>
          </div>
        </div>
      </div>
    </header>
  );
}

type Pillar = { title: string; icon: JSX.Element; body: JSX.Element };

const PILLARS: Pillar[] = [
  {
    title: 'Encrypted at rest',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="10" width="16" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        <circle cx="12" cy="15" r="1.4" />
      </svg>
    ),
    body: (
      <>The URN <em>is</em> the key — it both locates and decrypts (AES-256-GCM-SIV). No password, no key stored anywhere.</>
    ),
  },
  {
    title: 'Provider-blind',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18" />
      </svg>
    ),
    body: (
      <>Hosts hold only ciphertext keyed by hashes. Downloads are verified against the store id and the publisher's signed root.</>
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
    body: (
      <>Data, server, and Merkle proofs compile into one <code>.wasm</code>, padded to a uniform size that reveals nothing.</>
    ),
  },
];

function Primitives() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.head}>
          <span className={styles.kicker}>PRIMITIVES</span>
          <Heading as="h2">Composable building blocks</Heading>
          <p>DigStore is available now. More DIG Network primitives are on the way.</p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureCardHead}>
            <div>
              <span className={styles.badge}>AVAILABLE</span>
              <Heading as="h3" className={styles.featureTitle}>
                <span className="gt">DigStore</span>
              </Heading>
              <p className={styles.featureLead}>
                A Git-shaped, encrypted, content-addressable store. Point it at a
                build directory, commit generations, and address everything by URN.
              </p>
              <Link className={styles.textLink} to="/docs/digstore/what-is-digstore">
                Read the DigStore docs →
              </Link>
            </div>
          </div>
          <div className={styles.pillarGrid}>
            {PILLARS.map((p, i) => (
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

const STEPS = [
  { n: '01', t: 'Capture', d: 'Point a store at your build output.', c: 'digstore init site --dir dist' },
  { n: '02', t: 'Commit', d: 'Seal a generation into one .wasm.', c: 'digstore add -A && digstore commit -m "v1"' },
  { n: '03', t: 'Share', d: 'Push to a remote; hand out a URN.', c: 'digstore push origin' },
];

function HowItWorks() {
  return (
    <section className={clsx(styles.section, styles.sectionAlt)}>
      <div className="container">
        <div className={styles.head}>
          <span className={styles.kicker}>HOW IT WORKS</span>
          <Heading as="h2">Three commands to publish</Heading>
          <p>Git-style workflow for build output — encrypted and addressable from the first commit.</p>
        </div>
        <div className={styles.steps}>
          {STEPS.map((s) => (
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
        <Heading as="h2">Start building with DigStore</Heading>
        <p>Install the CLI and publish your first encrypted store in under a minute.</p>
        <div className={styles.ctaRow}>
          <Link className="button button--primary button--lg" to="/docs/digstore/cli/install">
            Install the CLI
          </Link>
          <Link className={clsx('button button--lg', styles.ghost)} to="/docs/digstore/format/overview">
            Learn the format
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home(): JSX.Element {
  return (
    <Layout
      title="DIG Network — the decentralized data layer"
      description="DIG Network is a Proof-of-Stake Layer 2 on Chia. Developer docs for the network and its primitives, including DigStore — encrypted content-addressable storage.">
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
