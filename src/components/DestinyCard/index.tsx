import React, { useState, useEffect, useCallback } from "react";
import styles from "./styles.module.css";

const MONTHS_PT = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function CostBar({ label, value, max, currency }) {
  return (
    <div className={styles.costRow}>
      <span className={styles.costLabel}>{label}</span>
      <div className={styles.costBarBg}>
        <div 
          className={styles.costBarFill} 
          style={{ width: `${Math.round((value / max) * 100)}%` }} 
        />
      </div>
      <span className={styles.costVal}>{currency}{value.toLocaleString("pt-BR")}</span>
    </div>
  );
}

export default function CityCard({ city }) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  if (!city) return null;

  // Adapt to potential simple format (like Istambul) vs complex format (like Berlim)
  const name = city.name;
  const country = city.country;
  const flag = city.flag;
  const tagline = city.tagline;
  const heroImage = city.heroImage;
  const currency = city.currency || "€";
  const stayDays = city.stayDays;
  
  // Normalize stats
  let stats = city.stats || [];
  if (stats.length === 0 && city.population) {
    stats = [
      { id: "populacao", label: "População", value: city.population },
      { id: "area", label: "Área", value: city.size },
      { id: "idioma", label: "Idiomas", value: (city.languages || []).join(", ") },
      { id: "fundacao", label: "Fundação", value: city.foundation },
    ].filter(s => s.value);
  }

  // Normalize weather
  let weatherSeasons = [];
  if (city.weather && city.weather.seasons) {
    weatherSeasons = city.weather.seasons;
  } else if (city.seasons) {
    weatherSeasons = [
      { name: "Primavera", icon: "🌸", desc: city.seasons.spring },
      { name: "Verão", icon: "☀️", desc: city.seasons.summer },
      { name: "Outono", icon: "🍂", desc: city.seasons.autumn },
      { name: "Inverno", icon: "❄️", desc: city.seasons.winter },
    ].filter(s => s.desc);
  }

  const weatherCurrent = city.weather?.current;
  const idealMonths = city.idealMonths || [];
  const costs = city.costs || {};
  const tips = city.tips || [];

  // Chips shown on card
  const chipData = [
    stats.find(s => s.id === "moeda"),
    stats.find(s => s.id === "idioma"),
    costs.daily && { id: "daily", label: "Custo/dia", value: `${currency}${costs.daily}` },
    weatherCurrent && { id: "clima", label: weatherCurrent.season, value: weatherCurrent.temp },
    stayDays && { id: "dias", label: "Estadia ideal", value: `${stayDays} dias` },
  ].filter(Boolean).slice(0, 5);

  const CHIP_COLORS = { 
    moeda: "#c67c00", 
    idioma: "#374151", 
    daily: "#16a34a", 
    clima: "#2563eb", 
    dias: "#9333ea",
    populacao: "#ca8a04",
    area: "#4b5563"
  };

  const costMax = Math.max(
    costs.budget || 0, costs.mid || 0, costs.comfort || 0, 1
  );

  return (
    <div className={styles.dcRoot}>
      {/* ── CARD ── */}
      <div 
        className={styles.card} 
        onClick={() => setOpen(true)} 
        role="button" 
        tabIndex={0}
        onKeyDown={e => e.key === "Enter" && setOpen(true)}
        aria-label={`Ver detalhes de ${name}`}
      >
        <div className={styles.hero}>
          {heroImage && <img src={heroImage} alt={name} loading="lazy" />}
          <div className={styles.heroOverlay} />
          <div className={styles.heroTitle}>
            <div>
              <div className={styles.cityName}>{name}</div>
              <div className={styles.countryLine}>{country}</div>
            </div>
            {flag && <span className={styles.flag}>{flag}</span>}
          </div>
        </div>

        <div className={styles.chips}>
          {chipData.map((c, i) => (
            <span key={i} className={styles.chip}>
              <span className={styles.chipDot} style={{ background: CHIP_COLORS[c.id] || "#888", color: CHIP_COLORS[c.id] || "#888" }} />
              <span style={{ opacity: 0.6, marginRight: ".2rem" }}>{c.label}</span>
              {c.value}
            </span>
          ))}
        </div>

        <div className={styles.cta}>
          <span>Explorar Destino</span>
          <span className={styles.ctaArrow}>↓</span>
        </div>
      </div>

      {/* ── OVERLAY ── */}
      <div 
        className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`} 
        onClick={close} 
      />

      {/* ── DRAWER ── */}
      <div 
        className={`${styles.drawer} ${open ? styles.drawerOpen : ""}`} 
        role="dialog" 
        aria-label={`Detalhes de ${name}`}
      >
        <div className={styles.handle}>
          <div className={styles.handleBar} />
        </div>

        {/* Drawer Hero */}
        <div className={styles.drawerHero}>
          {heroImage && <img src={heroImage} alt={name} />}
          <div className={styles.drawerHeroGrad} />
          <div className={styles.drawerHeroText}>
            {flag && <span style={{ fontSize: "2.5rem", lineHeight: 1, display: "block", marginBottom: ".5rem" }}>{flag}</span>}
            <div className={styles.drawerCity}>{name}</div>
            <div className={styles.drawerCountry}>{country}</div>
          </div>
        </div>

        <div className={styles.drawerBody}>
          {tagline && <p className={styles.tagline}>{tagline}</p>}

          {/* ── DADOS GERAIS ── */}
          {stats.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Panorama Geral</div>
              <div className={styles.stats}>
                {stayDays && (
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Estadia ideal</span>
                    <span className={`${styles.statValue} ${styles.stayDaysBadge}`}>⏱ {stayDays} dias</span>
                  </div>
                )}
                {stats.map((s, i) => (
                  <div className={styles.stat} key={i}>
                    <span className={styles.statLabel}>{s.label}</span>
                    <span className={styles.statValue}>{s.value}</span>
                    {s.sub && <span className={styles.statSub}>{s.sub}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── CLIMA ── */}
          {weatherSeasons.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Clima & Temporadas</div>
              <div className={styles.weather}>
                {weatherSeasons.map((s, i) => (
                  <div className={styles.season} key={i}>
                    <span className={styles.seasonIcon}>{s.icon}</span>
                    <div className={styles.seasonName}>{s.name}</div>
                    {s.temp && <div className={styles.seasonTemp}>{s.temp}</div>}
                    <div className={styles.seasonDesc}>{s.desc}</div>
                  </div>
                ))}
              </div>
              
              {idealMonths.length > 0 && (
                <div className={styles.months}>
                  {MONTHS_PT.map((m, i) => (
                    <span 
                      key={i} 
                      className={`${styles.month} ${idealMonths.includes(i) ? styles.monthIdeal : ""}`}
                    >
                      {m}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── CUSTO ESTIMADO ── */}
          {(costs.budget || costs.mid || costs.comfort) && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Estimativa de Custos (Diário)</div>
              {costs.budget && <CostBar label="Econômico" value={costs.budget} max={costMax} currency={currency} />}
              {costs.mid && <CostBar label="Moderado" value={costs.mid} max={costMax} currency={currency} />}
              {costs.comfort && <CostBar label="Confortável" value={costs.comfort} max={costMax} currency={currency} />}
              {costs.note && <p className={styles.statSub} style={{ marginTop: '1rem', fontStyle: 'italic' }}>{costs.note}</p>}
            </div>
          )}

          {/* ── DICAS RÁPIDAS ── */}
          {tips.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Dicas Práticas</div>
              {tips.map((t, i) => (
                <div className={styles.tip} key={i}>
                  <span className={styles.tipIcon}>{t.icon}</span>
                  <div 
                    className={styles.tipText} 
                    dangerouslySetInnerHTML={{ __html: t.text }} 
                  />
                </div>
              ))}
            </div>
          )}

          <button className={styles.closeBtn} onClick={close}>Fechar</button>
        </div>
      </div>
    </div>
  );
}