import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import WorldMap from '@site/src/components/WorldMap';
import { catalogueData } from '@site/src/data/catalogueData';
import styles from './index.module.css';

const destinations = catalogueData.flatMap((continent) =>
  continent.categories.flatMap((category) => category.destinations),
);

function DestinationGrid() {
  return (
    <section id="destinos" className={styles.destinationsSection}>
      <div className="container">
        <span className={styles.eyebrow}>Guias completos</span>
        <Heading as="h2" className={styles.sectionTitle}>
          Por onde vamos começar?
        </Heading>
        <p className={styles.sectionSubtitle}>
          Cada guia traz história, imperdíveis, comida típica, curiosidades e dicas práticas.
        </p>

        <div className={styles.destinationsGrid}>
          {destinations.map((city) => (
            <Link key={city.slug} to={city.link} className={styles.cityCard}>
              {city.image && <img src={city.image} alt={city.name} className={styles.cityImage} loading="lazy" />}
              <div className={styles.cityOverlay}>
                <div className={styles.cityMeta}>
                  <span className={styles.cityCountry}>
                    {city.flag} {city.country}
                  </span>
                  {city.stayDays && <span className={styles.cityDays}>{city.stayDays} dias</span>}
                </div>
                <h3 className={styles.cityName}>{city.name}</h3>
                {city.tagline && <p className={styles.cityTagline}>{city.tagline}</p>}
              </div>
            </Link>
          ))}
        </div>

        <div className={styles.center}>
          <Link className={styles.btnOutline} to="/catalogo">
            Ver catálogo completo →
          </Link>
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
      icon: '📍',
      title: 'Imperdíveis',
      desc: 'Saiba exatamente o que é imperdível e o que vale a visita extra, otimizando seu tempo.',
    },
    {
      icon: '🍽️',
      title: 'Comida',
      desc: 'Os pratos típicos, onde comer e o que pedir para comer como um local.',
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
        <span className={styles.eyebrow}>Em cada guia</span>
        <Heading as="h2" className={styles.sectionTitle}>
          O que você vai encontrar
        </Heading>
        <div className={styles.featuresGrid}>
          {features.map(({ icon, title, desc }) => (
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
          Compare os destinos lado a lado — custo, clima, dias ideais — e monte o seu roteiro.
        </p>
        <div className={styles.buttons}>
          <Link className={styles.btnPrimary} to="/destinos/europa/guia-comparativo">
            📊 Guia comparativo
          </Link>
          <Link className={styles.btnSecondary} to="/blog">
            📝 Blog de viagens
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - Curiosidades e Dicas de Viagem`}
      description="Curiosidades, dicas e histórias sobre lugares incríveis.">
      <WorldMap />
      <main>
        <DestinationGrid />
        <HomepageFeatures />
        <DestCTA />
      </main>
    </Layout>
  );
}
