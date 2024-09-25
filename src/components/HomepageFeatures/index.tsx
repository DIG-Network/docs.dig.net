import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Decentralized and Trustless',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
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
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
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
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        With peers distributed across the world, the DIG Network forms a
        decentralized content delivery network (D-CDN) that ensures your
        application is globally available. Users can access your content even
        if specific nodes go offline, increasing reliability and accessibility.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
