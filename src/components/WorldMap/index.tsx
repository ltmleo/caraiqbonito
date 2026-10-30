import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from '@docusaurus/Link';
import { geoNaturalEarth1, geoPath, geoGraticule10 } from 'd3-geo';
import { feature } from 'topojson-client';
import world from 'world-atlas/countries-110m.json';

import { catalogueData } from '@site/src/data/catalogueData';
import styles from './styles.module.css';

const WIDTH = 1000;
const HEIGHT = 520;
const MAX_ZOOM = 8;
const LABEL_GAP = 34; // min. on-screen distance (px) between two labelled pins
const ANTARCTICA = '010';

type Destination = {
  name: string;
  country: string;
  flag: string;
  tagline: string;
  stayDays: string;
  isoCode: string;
  coordinates: { lat: number; lng: number } | null;
  image: string;
  link: string;
  slug: string;
};

type Pin = Destination & { continent: string; x: number; y: number };

const allDestinations = catalogueData.flatMap((continent) =>
  continent.categories.flatMap((category) =>
    (category.destinations as Destination[]).map((dest) => ({ ...dest, continent: continent.slug })),
  ),
);

/** Visible part of the SVG, in SVG units */
type Area = { x0: number; x1: number; y0: number; y1: number };

/** Zoom transform that frames the given points inside `area`, keeping `margin` SVG units clear. */
function frame(points: Pin[], area: Area, margin: number) {
  if (points.length === 0) return { k: 1, x: 0, y: 0 };
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const pad = 10;
  const x0 = Math.min(...xs) - pad;
  const x1 = Math.max(...xs) + pad;
  const y0 = Math.min(...ys) - pad;
  const y1 = Math.max(...ys) + pad;
  const w = area.x1 - area.x0 - 2 * margin;
  const h = area.y1 - area.y0 - 2 * margin;
  const k = Math.min(MAX_ZOOM, w / (x1 - x0), h / (y1 - y0));
  return {
    k,
    x: (area.x0 + area.x1) / 2 - k * ((x0 + x1) / 2),
    y: (area.y0 + area.y1) / 2 - k * ((y0 + y1) / 2) + margin * 0.3, // room for labels above pins
  };
}

export default function WorldMap() {
  const { countries, graticule, sphere, pins } = useMemo(() => {
    const geo = feature(world as any, (world as any).objects.countries) as any;
    const land = geo.features.filter((f: any) => f.id !== ANTARCTICA);
    const projection = geoNaturalEarth1().fitExtent(
      [[10, 10], [WIDTH - 10, HEIGHT - 10]],
      { type: 'FeatureCollection', features: land } as any,
    );
    const path = geoPath(projection);
    const pins: Pin[] = allDestinations
      .filter((d) => d.coordinates)
      .map((d) => {
        const [x, y] = projection([d.coordinates!.lng, d.coordinates!.lat])!;
        return { ...d, x, y };
      });
    return {
      countries: land.map((f: any) => ({ id: f.id as string, name: f.properties.name, d: path(f)! })),
      graticule: path(geoGraticule10())!,
      sphere: path({ type: 'Sphere' })!,
      pins,
    };
  }, []);

  const visitedIsos = useMemo(() => new Set(pins.map((p) => p.isoCode)), [pins]);
  const regions = useMemo(
    () => catalogueData.map((c) => ({ slug: c.slug, name: c.continent, icon: c.icon })),
    [],
  );

  const [region, setRegion] = useState<string>('mundo');
  const [activeSlug, setActiveSlug] = useState<string>(pins[0]?.slug);
  const active = pins.find((p) => p.slug === activeSlug);

  // Rendered size of the SVG. On phones it is taller than the viewBox ratio and
  // cropped at the sides (preserveAspectRatio="slice"); the card sits below the map.
  const svgRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ w: WIDTH, h: HEIGHT });
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const observer = new ResizeObserver(() => setSize({ w: svg.clientWidth, h: svg.clientHeight }));
    observer.observe(svg);
    return () => observer.disconnect();
  }, []);

  const compact = size.w <= 720;
  const scale = Math.max(size.w / WIDTH, size.h / HEIGHT); // screen px per SVG unit
  const area = useMemo(() => {
    const visibleW = size.w / scale;
    const visibleH = size.h / scale;
    const x0 = (WIDTH - visibleW) / 2;
    const y0 = (HEIGHT - visibleH) / 2;
    // On wide screens the card floats over the map, so zoomed views keep clear of it
    return { x0: x0 + (compact ? 0 : visibleW * 0.34), x1: x0 + visibleW, y0, y1: y0 + visibleH };
  }, [size, scale, compact]);

  const view = useMemo(() => {
    const margin = 40 / scale; // 40 screen px
    if (region !== 'mundo') return frame(pins.filter((p) => p.continent === region), area, margin);
    // The whole world is too small on a phone: frame every destination instead
    return compact ? frame(pins, area, margin) : { k: 1, x: 0, y: 0 };
  }, [region, pins, area, compact, scale]);

  // Pins and labels keep a constant on-screen size whatever the zoom or screen width
  const pinScale = 1 / (view.k * scale);

  // Pins too close to an earlier pin (or to the active one) only show their label when active
  const crowded = useMemo(() => {
    const near = (p: Pin, q: Pin) => Math.hypot(p.x - q.x, p.y - q.y) * view.k * scale < LABEL_GAP;
    return new Set(
      pins
        .filter((p, i) => pins.slice(0, i).some((q) => near(p, q)) || (active && p !== active && near(p, active)))
        .map((p) => p.slug),
    );
  }, [pins, view.k, scale, active]);

  const countryCount = visitedIsos.size;
  const continentCount = new Set(pins.map((p) => p.continent)).size;

  function selectCountry(iso: string) {
    const pin = pins.find((p) => p.isoCode === iso);
    if (pin) setActiveSlug(pin.slug);
  }

  return (
    <section className={styles.mapHero}>
      <div className={styles.inner}>
        <div className={styles.intro}>
          <span className={styles.eyebrow}>Atlas de viagens</span>
          <h1 className={styles.title}>
            Descubra o <em>Mundo</em>
          </h1>
          <p className={styles.subtitle}>
            Histórias, curiosidades e dicas de cada lugar por onde passamos. Toque num ponto do mapa para começar.
          </p>
          <ul className={styles.stats}>
            <li><strong>{pins.length}</strong> destinos</li>
            <li><strong>{countryCount}</strong> países</li>
            <li><strong>{continentCount}</strong> continentes</li>
          </ul>

          <div className={styles.toolbar} role="tablist" aria-label="Filtrar por região">
            {[{ slug: 'mundo', name: 'Mundo', icon: '🌍' }, ...regions].map((r) => (
              <button
                key={r.slug}
                type="button"
                role="tab"
                aria-selected={region === r.slug}
                className={region === r.slug ? styles.chipActive : styles.chip}
                onClick={() => setRegion(r.slug)}>
                <span aria-hidden>{r.icon}</span> {r.name}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.mapFrame}>
          <svg
            ref={svgRef}
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            preserveAspectRatio="xMidYMid slice"
            className={styles.svg}
            role="img"
            aria-label="Mapa-múndi com os destinos do guia">
            <defs>
              <radialGradient id="cqb-ocean" cx="50%" cy="45%" r="75%">
                <stop offset="0%" stopColor="var(--map-ocean-center)" />
                <stop offset="100%" stopColor="var(--map-ocean-edge)" />
              </radialGradient>
              <linearGradient id="cqb-visited" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#E0926A" />
                <stop offset="100%" stopColor="#C4622D" />
              </linearGradient>
            </defs>

            <g
              className={styles.zoomLayer}
              style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})` }}>
              <path d={sphere} fill="url(#cqb-ocean)" className={styles.sphere} />
              <path d={graticule} className={styles.graticule} />

              {countries.map((c) => {
                const visited = visitedIsos.has(c.id);
                const isActive = active?.isoCode === c.id;
                return (
                  <path
                    key={c.id ?? c.name}
                    d={c.d}
                    className={isActive ? styles.countryActive : visited ? styles.countryVisited : styles.country}
                    onClick={visited ? () => selectCountry(c.id) : undefined}>
                    <title>{c.name}</title>
                  </path>
                );
              })}

              {pins.map((p) => {
                const isActive = p.slug === activeSlug;
                return (
                  <g
                    key={p.slug}
                    transform={`translate(${p.x} ${p.y}) scale(${pinScale})`}
                    className={isActive ? styles.pinActive : styles.pin}
                    tabIndex={0}
                    role="button"
                    aria-label={`${p.name}, ${p.country}`}
                    onClick={() => setActiveSlug(p.slug)}
                    onMouseEnter={() => setActiveSlug(p.slug)}
                    onFocus={() => setActiveSlug(p.slug)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveSlug(p.slug);
                      }
                    }}>
                    <circle r={22} className={styles.pinHit} />
                    <circle r={14} className={styles.pinPulse} />
                    <circle r={6} className={styles.pinDot} />
                    {(isActive || ((view.k > 1.5 || compact) && !crowded.has(p.slug))) && (
                      <text y={-14} className={styles.pinLabel}>
                        {p.name}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>

          <div className={styles.legend}>
            <span className={styles.legendSwatch} /> Países com guia
          </div>

          {active && (
            <Link key={active.slug} to={active.link} className={styles.card}>
              {active.image && <img src={active.image} alt="" className={styles.cardImage} />}
              <div className={styles.cardBody}>
                <span className={styles.cardCountry}>
                  {active.flag} {active.country}
                  {active.stayDays && <span className={styles.cardDays}>· {active.stayDays} dias</span>}
                </span>
                <span className={styles.cardName}>{active.name}</span>
                {active.tagline && <span className={styles.cardTagline}>{active.tagline}</span>}
                <span className={styles.cardCta}>Explorar guia →</span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
