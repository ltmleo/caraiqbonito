import React from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './catalogo.module.css';

// Import images
import BerlimImg from '@site/static/img/berlim_hero.png';
import MunichImg from '@site/static/img/munich_hero.png';
import PragueImg from '@site/static/img/prague_hero.png';
import BudapestImg from '@site/static/img/budapest_hero.png';
import ViennaImg from '@site/static/img/vienna_hero.png';
import FozImg from '@site/static/img/foz_hero.png';

const catalogueData = [
  {
    continent: 'Europa',
    icon: '🏰',
    categories: [
      {
        name: 'Europa Central',
        destinations: [
          {
            name: 'Berlim',
            country: 'Alemanha',
            image: BerlimImg,
            link: '/destinos/europa/central/berlim/berlim',
            status: 'novo',
          },
          {
            name: 'Praga',
            country: 'República Tcheca',
            image: PragueImg,
            link: '/destinos/europa/central/praga/praga',
            status: 'novo',
          },
          {
            name: 'Budapeste',
            country: 'Hungria',
            image: BudapestImg,
            link: '/destinos/europa/central/budapeste/budapeste',
            status: 'novo',
          },
          {
            name: 'Viena',
            country: 'Áustria',
            image: ViennaImg,
            link: '/destinos/europa/central/viena/viena',
            status: 'novo',
          },
          {
            name: 'Bratislava',
            country: 'Eslováquia',
            image: PragueImg, // Fallback
            link: '#',
            status: 'em-breve',
          },
        ],
      },
      {
        name: 'Europa Oriental',
        destinations: [
          {
            name: 'Istambul',
            country: 'Turquia',
            image: BerlimImg, // Fallback
            link: '#',
            status: 'em-breve',
          },
        ],
      },
    ],
  },
  {
    continent: 'Américas',
    icon: '⛰️',
    categories: [
      {
        name: 'Brasil',
        destinations: [
          {
            name: 'Foz do Iguaçu',
            country: 'Brasil',
            image: FozImg,
            link: '/destinos/americas/brasil/foz-do-iguacu/foz-do-iguacu',
            status: 'novo',
          },
        ],
      },
    ],
  },
];

function DestinationCard({dest}) {
  return (
    <Link to={dest.link} className={styles.destCard}>
      <img src={dest.image} alt={dest.name} className={styles.destImage} />
      <div className={styles.destOverlay}>
        <span className={styles.destCountry}>{dest.country}</span>
        <h3 className={styles.destName}>{dest.name}</h3>
      </div>
      {dest.status === 'novo' && <span className={`${styles.statusBadge} ${styles.statusNew}`}>Novo</span>}
      {dest.status === 'em-breve' && <span className={`${styles.statusBadge} ${styles.statusSoon}`}>Em Breve</span>}
    </Link>
  );
}

export default function Catalogo() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title="Catálogo de Destinos" description="Explore todos os nossos destinos catalogados por região.">
      <header className={styles.catalogoHeader}>
        <div className="container">
          <Heading as="h1" className={styles.catalogoTitle}>Catálogo de Destinos</Heading>
          <p className={styles.catalogoSubtitle}>
            Encontre inspiração para sua próxima viagem em nossa coleção curada de destinos pelo mundo.
          </p>
        </div>
      </header>

      <main>
        {catalogueData.map((continent) => (
          <section key={continent.continent} className={styles.continentSection}>
            <div className="container">
              <Heading as="h2" className={styles.continentTitle}>
                <span>{continent.icon}</span> {continent.continent}
              </Heading>

              {continent.categories.map((category) => (
                <div key={category.name} className={styles.categoryGroup}>
                  <Heading as="h3" className={styles.categoryTitle}>{category.name}</Heading>
                  <div className={styles.destinationsGrid}>
                    {category.destinations.map((dest) => (
                      <DestinationCard key={dest.name} dest={dest} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </Layout>
  );
}
