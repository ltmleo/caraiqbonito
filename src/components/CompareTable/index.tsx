import React, { useState } from 'react';
import data from './data.json';
import styles from './styles.module.css';

const CITIES = [
  { id: 'istanbul', name: 'Istambul', flag: '🇹🇷' },
  { id: 'berlin', name: 'Berlim', flag: '🇩🇪' },
  { id: 'prague', name: 'Praga', flag: '🇨🇿' },
  { id: 'bratislava', name: 'Bratislava', flag: '🇸🇰' },
  { id: 'vienna', name: 'Viena', flag: '🇦🇹' },
  { id: 'budapest', name: 'Budapeste', flag: '🇭🇺' },
] as const;

type CityId = typeof CITIES[number]['id'];

export default function CompareTable() {
  const [activeCity, setActiveCity] = useState<CityId>('istanbul');

  const cityData = data[activeCity];

  const getBadgeClass = (category: string): string => {
    const catLower = category.toLowerCase();
    if (
      catLower.includes('gratuito') ||
      catLower.includes('gratuita') ||
      catLower.includes('grátis')
    ) {
      return styles.badgeFree;
    }
    if (
      catLower.includes('reserva') ||
      catLower.includes('teleférico') ||
      catLower.includes('dica') ||
      catLower.includes('mercado') ||
      catLower.includes('bairro')
    ) {
      return styles.badgeNeutral;
    }
    return styles.badgePaid;
  };

  return (
    <div className={styles.wrap}>
      {/* City Tabs */}
      <div className={styles.cityTabs}>
        {CITIES.map((city) => (
          <button
            key={city.id}
            className={`${styles.tabBtn} ${
              activeCity === city.id ? styles.tabBtnActive : ''
            }`}
            onClick={() => setActiveCity(city.id)}
          >
            <span className={styles.flag}>{city.flag}</span>
            <span>{city.name}</span>
          </button>
        ))}
      </div>

      {/* City Section */}
      <div className={styles.citySection} key={activeCity}>
        <div className={styles.cityHeader}>
          <h2 className={styles.cityTitle}>
            <span>{cityData.flag}</span>
            <span>{cityData.name}, {cityData.country}</span>
          </h2>
          <p className={styles.citySub}>{cityData.sub}</p>
        </div>

        {/* Summary Bar */}
        <div className={styles.summaryBar}>
          <span className={styles.summaryPill}>🆓 {cityData.summary.free}</span>
          <span className={styles.summaryPill}>{cityData.summary.priceRange}</span>
          <span className={styles.summaryPill}>{cityData.summary.avgRating}</span>
        </div>

        {/* Table Wrap */}
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th className={styles.colName}>Atração</th>
                <th className={styles.colDesc}>Por que é imperdível</th>
                <th className={styles.colHours}>Horário (alta temp.)</th>
                <th className={styles.colPrice}>Ingresso</th>
                <th className={styles.colRating}>Avaliação</th>
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              {cityData.attractions.map((attr, idx) => (
                <tr key={idx}>
                  <td className={styles.colName}>
                    <div className={styles.attrName}>{attr.name}</div>
                    <span className={`${styles.attrBadge} ${getBadgeClass(attr.category)}`}>
                      {attr.category}
                    </span>
                  </td>
                  <td className={styles.colDesc}>
                    <div className={styles.desc}>{attr.desc}</div>
                  </td>
                  <td className={styles.colHours}>
                    <div className={styles.hours}>
                      {attr.hours}
                    </div>
                  </td>
                  <td className={styles.colPrice}>
                    <div className={styles.price}>{attr.price}</div>
                    {attr.priceNote && <div className={styles.note}>{attr.priceNote}</div>}
                  </td>
                  <td className={styles.colRating}>
                    <div className={styles.stars}>{attr.stars}</div>
                    <span className={styles.starsNum}>{attr.rating}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
