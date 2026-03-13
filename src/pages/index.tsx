import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import useBaseUrl from '@docusaurus/useBaseUrl';

import styles from './index.module.css';

const features = [
  {
    icon: '🏛️',
    title: 'História',
    desc: 'Mergulhe na história fascinante de cada destino, desde impérios antigos até eventos que mudaram o mundo.',
  },
  {
    icon: '👁️',
    title: 'Must See & Nice See',
    desc: 'Saiba exatamente o que é imperdível e o que vale a visita extra, sem desperdiçar tempo.',
  },
  {
    icon: '💡',
    title: 'Curiosidades',
    desc: 'Fatos inusitados e surpreendentes que vão fazer você ver o destino com outros olhos.',
  },
  {
    icon: '🧭',
    title: 'Dicas Práticas',
    desc: 'Conselhos reais sobre transporte, dinheiro, idioma e tudo que facilita sua viagem.',
  },
  {
    icon: '🎬',
    title: 'Material Complementar',
    desc: 'Filmes, livros e documentários para você se preparar e viver a experiência antes de chegar.',
  },
  {
    icon: '🌍',
    title: 'Destinos Globais',
    desc: 'Europa, Ásia, Américas e muito mais. O mapa do mundo é o nosso playground.',
  },
];

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  const logoUrl = useBaseUrl('img/logo.png');

  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <img src={logoUrl} alt="Carai Q Bonito! Logo" className={styles.heroLogo} />
        <div className={styles.heroBadge}>
          <span>🌿</span> Brasil • Viagens • Aventura
        </div>
        <Heading as="h1" className={styles.heroTitle}>
          {siteConfig.title}
        </Heading>
        <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className={styles.btnPrimary} to="/destinos/europa/central/berlim">
            🗺️ Explorar Berlim
          </Link>
          <Link className={styles.btnSecondary} to="/destinos/europa/central/berlim#must-see">
            ✨ Must See
          </Link>
        </div>
      </div>
    </header>
  );
}

function HomepageFeatures() {
  return (
    <section className={styles.featuresSection}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          O que você vai encontrar
        </Heading>
        <p className={styles.sectionSubtitle}>
          Cada destino é documentado com carinho para que sua viagem seja inesquecível — antes, durante e depois.
        </p>
        <div className={styles.featuresGrid}>
          {features.map(({icon, title, desc}) => (
            <div key={title} className={styles.featureCard}>
              <span className={styles.featureIcon}>{icon}</span>
              <h3 className={styles.featureTitle}>{title}</h3>
              <p className={styles.featureDesc}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DestCTA() {
  return (
    <section className={styles.destSection}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Pronto para explorar?
        </Heading>
        <p className={styles.sectionSubtitle}>
          Comece pela Europa central ou escolha um destino que já está na sua lista de sonhos.
        </p>
        <div className={`${styles.buttons} ${styles.destCta}`}>
          <Link className={styles.btnPrimary} to="/destinos/europa/central/berlim">
            🇩🇪 Ir para Berlim
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Bem-vindo ao ${siteConfig.title}`}
      description="Curiosidades, dicas e histórias sobre lugares incríveis — Brasil, Viagens, Aventura.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <DestCTA />
      </main>
    </Layout>
  );
}
