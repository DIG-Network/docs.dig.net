import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import { useColorMode} from '@docusaurus/theme-common';
import {useMemo} from "react";

type FeatureItem = {
  title: string;
  Svg?: React.ComponentType<React.ComponentProps<'svg'>>;
  image?: string;
  description: JSX.Element;
};

function Feature({title, Svg, image, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        {Svg ? (
          <Svg className={styles.featureSvg} role="img" />
        ) : image ? (
          <img src={image} className={styles.featureSvg} alt={title} />
        ) : null}
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === 'dark';

  const FeatureList = useMemo<FeatureItem[]>(() => [
    {
      title: 'Decentralized and Trustless',
      image: isDarkMode ?
        require('@site/static/img/dighub-decentralized-icon.png').default :
        require('@site/static/img/dighub-decentralized-icon-gradient.png').default,
      description: (
        <>
          The DIG Network operates on a decentralized infrastructure, ensuring
          that no single entity controls your data. Blockchain technology powers
          the verification of content, so users can trust that their data remains
          untampered and censorship-resistant.
        </>
      ),
    },
    {
      title: 'Secure Data Integrity',
      image: isDarkMode ?
        require('@site/static/img/dighub-shield.png').default :
        require('@site/static/img/dighub-security-icon-gradient.png').default,
      description: (
        <>
          Data in DIG is stored in Merkle trees, with roots secured on the
          blockchain. This cryptographic structure allows anyone to verify the
          integrity of the data they are accessing, making it perfect for
          decentralized applications (dApps) and beyond.
        </>
      ),
    },
    {
      title: 'Global Content Delivery',
      image: isDarkMode ?
        require('@site/static/img/dighub-network-icon.png').default :
        require('@site/static/img/dighub-lobal-icon-gradient.png').default,
      description: (
        <>
          With peers distributed across the world, the DIG Network forms a
          decentralized content delivery network (D-CDN) that ensures your
          application is globally available. Users can access your content even
          if specific nodes go offline, increasing reliability and accessibility.
        </>
      ),
    },
  ], [isDarkMode]);

  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, id) => (
            <Feature key={id} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
