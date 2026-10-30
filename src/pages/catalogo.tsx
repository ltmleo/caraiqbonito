import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './catalogo.module.css';

import { catalogueData } from '@site/src/data/catalogueData';

function normalize(text: string) {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

function DestinationCard({ dest }) {
  return (
    <Link to={dest.link} className={styles.destCard}>
      {dest.image && <img src={dest.image} alt={dest.name} className={styles.destImage} loading="lazy" />}
      <div className={styles.destOverlay}>
        <span className={styles.destCountry}>{dest.flag} {dest.country}</span>
        <h3 className={styles.destName}>{dest.name}</h3>
        {dest.tagline && <p className={styles.destTagline}>{dest.tagline}</p>}
      </div>
      {dest.status === 'novo' && <span className={`${styles.statusBadge} ${styles.statusNew}`}>Novo</span>}
      {dest.status === 'em-breve' && <span className={`${styles.statusBadge} ${styles.statusSoon}`}>Em Breve</span>}
    </Link>
  );
}

export default function Catalogo() {
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('todos');

  const q = normalize(query.trim());
  const matches = (dest) =>
    !q || normalize(`${dest.name} ${dest.country} ${dest.tagline ?? ''}`).includes(q);

  const filtered = catalogueData
    .filter((continent) => region === 'todos' || continent.slug === region)
    .map((continent) => ({
      ...continent,
      categories: continent.categories
        .map((category) => ({ ...category, destinations: category.destinations.filter(matches) }))
        .filter((category) => category.destinations.length > 0),
    }))
    .filter((continent) => continent.categories.length > 0);

  return (
    <Layout title="Catálogo de Destinos" description="Explore todos os nossos destinos catalogados por região.">
      <header className={styles.catalogoHeader}>
        <div className="container">
          <Heading as="h1" className={styles.catalogoTitle}>Catálogo de Destinos</Heading>
          <p className={styles.catalogoSubtitle}>
            Encontre inspiração para sua próxima viagem em nossa coleção curada de destinos pelo mundo.
          </p>

          <div className={styles.filters}>
            <input
              type="search"
              className={styles.search}
              placeholder="Buscar cidade ou país…"
              aria-label="Buscar destino"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className={styles.chips}>
              {[{ slug: 'todos', continent: 'Todos', icon: '🌍' }, ...catalogueData].map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  aria-pressed={region === c.slug}
                  className={region === c.slug ? styles.chipActive : styles.chip}
                  onClick={() => setRegion(c.slug)}>
                  {c.icon} {c.continent}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main>
        {filtered.length === 0 && (
          <p className={styles.empty}>Nenhum destino encontrado para “{query}”. 🧭</p>
        )}
        {filtered.map((continent) => (
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
                      <DestinationCard key={dest.slug} dest={dest} />
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
