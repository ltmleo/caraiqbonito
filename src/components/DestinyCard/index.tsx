import React from 'react';
import styles from './styles.module.css';

interface DestinyData {
  name: string;
  country: string;
  population: string;
  size: string;
  languages: string[];
  foundation: string;
  flag: string;
  seasons: {
    summer: string;
    winter: string;
    autumn: string;
    spring: string;
  };
}

interface DestinyCardProps {
  data: DestinyData;
}

const DestinyCard: React.FC<DestinyCardProps> = ({ data }) => {
  if (!data) return null;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.flag}>{data.flag}</span>
          <h2 className={styles.title}>{data.name}</h2>
        </div>
        <span className={styles.country}>{data.country}</span>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>População</span>
          <span className={styles.statValue}>{data.population}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Tamanho</span>
          <span className={styles.statValue}>{data.size}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Línguas</span>
          <span className={styles.statValue}>{data.languages.join(', ')}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Fundação</span>
          <span className={styles.statValue}>{data.foundation}</span>
        </div>
      </div>

      <div className={styles.seasonsSection}>
        <h3 className={styles.seasonsTitle}>Estações</h3>
        <div className={styles.seasonsGrid}>
          <div className={styles.seasonCard}>
            <div className={styles.seasonHeader}>
              <span className={styles.seasonIcon}>☀️</span>
              <h4>Verão</h4>
            </div>
            <p>{data.seasons.summer}</p>
          </div>
          <div className={styles.seasonCard}>
            <div className={styles.seasonHeader}>
              <span className={styles.seasonIcon}>❄️</span>
              <h4>Inverno</h4>
            </div>
            <p>{data.seasons.winter}</p>
          </div>
          <div className={styles.seasonCard}>
            <div className={styles.seasonHeader}>
              <span className={styles.seasonIcon}>🍂</span>
              <h4>Outono</h4>
            </div>
            <p>{data.seasons.autumn}</p>
          </div>
          <div className={styles.seasonCard}>
            <div className={styles.seasonHeader}>
              <span className={styles.seasonIcon}>🌸</span>
              <h4>Primavera</h4>
            </div>
            <p>{data.seasons.spring}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinyCard;
