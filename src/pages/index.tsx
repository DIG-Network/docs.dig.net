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
    <header
      className={clsx('hero hero--primary', styles.heroBanner)}
      style={{
        backgroundImage: 'url(/img/planet-wide-banner.png)',
        backgroundSize: 'cover', // Ensures the image covers the whole div
        backgroundPosition: 'center', // Centers the image
      }}
    >
      <div className="container">
        <Heading as="h1" className="hero__title text-white">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle text-white">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--lg rounded-3xl bg-gradient-to-r from-indigo-500 from-0% via-purple-500 via-50% to-pink-500 to-100%"
            to="/docs/intro">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="DIG Network Documentation">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
