import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import useBaseUrl from '@docusaurus/useBaseUrl';

import styles from './index.module.css';

// Import images to let Docusaurus handle them correctly
import SiteLogo from '@site/static/img/logo.png';
import BerlimHero from '@site/static/img/berlim_hero.png';
import MunichHero from '@site/static/img/munich_hero.png';
import PragueHero from '@site/static/img/prague_hero.png';

const featuredCities = [
  {
    name: 'Berlim',
    country: 'Alemanha',
    image: BerlimHero,
    link: '/destinos/europa/central/berlim',
  },
  {
    name: 'Munique',
    country: 'Alemanha',
    image: MunichHero,
    link: '#',
    comingSoon: true,
  },
  {
    name: 'Praga',
    country: 'República Tcheca',
    image: PragueHero,
    link: '/destinos/europa/central/praga',
    comingSoon: true,
  },
];

const regions = [
  { name: 'Europa', icon: '🏰', link: '/destinos/europa' },
  { name: 'Ásia', icon: '🏮', link: '#' },
  { name: 'Américas', icon: '⛰️', link: '/destinos/americas' },
  { name: 'África', icon: '🦁', link: '#' },
  { name: 'Oceania', icon: '🏄', link: '#' },
];

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();

  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <img src={SiteLogo} alt="Carai Q Bonito! Logo" className={styles.heroLogo} />
        <div className={styles.heroBadge}>
          <span>🌿</span> Brasil • Viagens • Aventura
        </div>
        <Heading as="h1" className={styles.heroTitle}>
          Descubra o Mundo
        </Heading>
        <p className={styles.heroSubtitle}>
          Histórias, curiosidades e dicas para sua próxima grande jornada
        </p>
        <div className={styles.buttons}>
          <Link className={styles.btnPrimary} to="#destinos">
            🌍 Explorar Destinos
          </Link>
          <Link className={styles.btnSecondary} to="/destinos/europa/central/berlim">
            🇩🇪 Último Destino: Berlim
          </Link>
        </div>
      </div>
    </header>
  );
}

function DestinationGrid() {
  return (
    <section id="destinos" className={styles.destinationsSection}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Por onde vamos começar?
        </Heading>
        <p className={styles.sectionSubtitle}>
          Explore nossos destinos por região ou confira as cidades em destaque.
        </p>

        <div className={styles.regionsGrid}>
          {regions.map((region) => (
            <Link key={region.name} to={region.link} className={styles.regionCard}>
              <span className={styles.regionIcon}>{region.icon}</span>
              <span className={styles.regionName}>{region.name}</span>
            </Link>
          ))}
        </div>

        <Heading as="h3" className={styles.sectionTitle} style={{fontSize: '1.8rem', marginTop: '4rem'}}>
          Cidades em Destaque
        </Heading>
        
        <div className={styles.destinationsGrid}>
          {featuredCities.map((city) => (
            <Link key={city.name} to={city.link} className={styles.cityCard}>
              <img src={city.image} alt={city.name} className={styles.cityImage} />
              <div className={city.comingSoon ? styles.cityOverlaySoon : styles.cityOverlay}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                  <span className={styles.cityCountry}>{city.country}</span>
                  {!city.comingSoon && <span className={styles.newBadge}>NOVO</span>}
                </div>
                <h4 className={styles.cityName}>
                  {city.name}
                  {city.comingSoon && <span className={styles.soonText}>(Em breve)</span>}
                </h4>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomepageFeatures() {
  const features = [
    {
      icon: '🏛️',
      title: 'História',
      desc: 'Mergulhe na história fascinante de cada destino, desde impérios antigos até eventos modernos.',
    },
    {
      icon: '👁️',
      title: 'Must See',
      desc: 'Saiba exatamente o que é imperdível e o que vale a visita extra, otimizando seu tempo.',
    },
    {
      icon: '💡',
      title: 'Curiosidades',
      desc: 'Fatos inusitados e surpreendentes que vão fazer você ver o destino com outros olhos.',
    },
  ];

  return (
    <section className={styles.featuresSection}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          O que você vai encontrar
        </Heading>
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
          Pronto para a aventura?
        </Heading>
        <p className={styles.sectionSubtitle}>
          Nossos guias são feitos para quem ama descobrir o que há por trás de cada esquina.
        </p>
        <div className={`${styles.buttons} ${styles.destCta}`}>
          <Link className={styles.btnPrimary} to="/destinos/europa/central/berlim">
            🚀 Começar por Berlim
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
      title={`${siteConfig.title} - Curiosidades e Dicas de Viagem`}
      description="Curiosidades, dicas e histórias sobre lugares incríveis — Brasil, Viagens, Aventura.">
      <HomepageHeader />
      <main>
        <DestinationGrid />
        <HomepageFeatures />
        <DestCTA />
      </main>
    </Layout>
  );
}
