"use client";

import { motion } from "framer-motion";
import { Globe2, MapPin, Video } from "lucide-react";
import { useId, useState } from "react";

import type { Dictionary } from "@/lib/i18n";
import { locations } from "@/lib/site";

import { type CityKey, CITY_POINTS, POLAND_PATH, POLAND_VIEWBOX } from "./poland-map";
import { Reveal, SectionHeader } from "./reveal";
import { Gradient } from "./rich-text";
import { usePrefersReducedMotion } from "./use-in-view";

type HubKey = (typeof locations)[number]["key"];
type LocationsText = Dictionary["locations"];
type RemoteCity = keyof LocationsText["cities"];

// Połączenia "online" z bazy do największych miast — pokazują, że działamy w całej Polsce.
const remoteLinks: [HubKey, RemoteCity][] = [
  ["szczecin", "gdansk"],
  ["szczecin", "bydgoszcz"],
  ["szczecin", "bialystok"],
  ["zielonaGora", "poznan"],
  ["zielonaGora", "warszawa"],
  ["zielonaGora", "lodz"],
  ["zielonaGora", "lublin"],
  ["zary", "wroclaw"],
  ["zary", "katowice"],
  ["zary", "krakow"],
];

const { width: W, height: H } = POLAND_VIEWBOX;
const hubPoints = locations.map((location) => CITY_POINTS[location.key]);
const hubCenter = [
  hubPoints.reduce((sum, [x]) => sum + x, 0) / hubPoints.length,
  hubPoints.reduce((sum, [, y]) => sum + y, 0) / hubPoints.length,
] as const;

// Łuk między dwoma punktami (krzywa Béziera wygięta prostopadle do odcinka).
function arc([x1, y1]: readonly number[], [x2, y2]: readonly number[], bend = 0.18) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  return `M${x1} ${y1}Q${mx - dy * bend} ${my + dx * bend} ${x2} ${y2}`;
}

// Przesunięcia etykiet, żeby blisko położone miasta na siebie nie wchodziły.
const hubLabelOffset: Record<HubKey, string> = {
  szczecin: "translate(16px, -50%)",
  zielonaGora: "translate(16px, -95%)",
  zary: "translate(14px, 5%)",
};

const remoteLabelOffset: Partial<Record<CityKey, string>> = {
  katowice: "translate(calc(-100% - 6px), -50%)",
};

const percent = ([x, y]: readonly number[]) => ({ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` });

export function LocationsSection({ t }: { t: LocationsText }) {
  const [active, setActive] = useState<HubKey | null>(null);

  return (
    <section id="locations" aria-labelledby="locations-title" className="section relative overflow-hidden border-t border-line">
      <div className="pointer-events-none absolute -left-40 top-1/3 -z-10 h-[520px] w-[520px] rounded-full bg-brand-strong/15 blur-[140px]" />

      <div className="container-site">
        <SectionHeader
          id="locations-title"
          kicker={t.kicker}
          title={<Gradient text={t.title} />}
          description={t.description}
        />

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          {/* MIASTA */}
          <div className="order-2 lg:order-1">
            <ul className="grid gap-3">
              {locations.map((location, index) => {
                const isActive = active === location.key;

                return (
                  <Reveal as="li" key={location.key} delay={index * 0.08}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(location.key)}
                      onMouseLeave={() => setActive(null)}
                      onFocus={() => setActive(location.key)}
                      onBlur={() => setActive(null)}
                      onClick={() => setActive(isActive ? null : location.key)}
                      aria-pressed={isActive}
                      className={`group flex w-full cursor-pointer items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300 sm:p-5 ${
                        isActive
                          ? "border-brand/50 bg-brand/[0.08] ring-4 ring-brand/10"
                          : "border-line bg-ink/[0.02] hover:border-line-strong"
                      }`}
                    >
                      <span
                        className={`relative grid h-12 w-12 shrink-0 place-items-center rounded-xl transition-colors duration-300 ${
                          isActive ? "bg-brand text-white" : "bg-brand/10 text-brand"
                        }`}
                      >
                        <MapPin size={20} strokeWidth={1.8} />
                        <span className={`absolute inset-0 rounded-xl ring-2 ring-brand transition-opacity ${isActive ? "animate-ping opacity-40" : "opacity-0"}`} />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-lg font-semibold tracking-tight">{location.name}</span>
                        <span className="block text-sm text-faint">{t.regions[location.key]}</span>
                      </span>

                      <span className="hidden rounded-full border border-line px-3 py-1 text-xs text-soft sm:inline">
                        {t.meetings}
                      </span>
                    </button>
                  </Reveal>
                );
              })}
            </ul>

            <Reveal delay={0.25} className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="surface rounded-2xl p-5">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-mint/10 text-mint">
                  <Video size={18} strokeWidth={1.8} />
                </span>
                <p className="mt-4 font-semibold">{t.online[0]}</p>
                <p className="mt-1 text-sm leading-6 text-soft">{t.online[1]}</p>
              </div>
              <div className="surface rounded-2xl p-5">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand">
                  <Globe2 size={18} strokeWidth={1.8} />
                </span>
                <p className="mt-4 font-semibold">{t.clients[0]}</p>
                <p className="mt-1 text-sm leading-6 text-soft">{t.clients[1]}</p>
              </div>
            </Reveal>
          </div>

          {/* MAPA */}
          <Reveal className="order-1 lg:order-2">
            <PolandMap active={active} onActiveChange={setActive} t={t} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function PolandMap({
  active,
  onActiveChange,
  t,
}: {
  active: HubKey | null;
  onActiveChange: (key: HubKey | null) => void;
  t: LocationsText;
}) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div className="surface noise relative overflow-hidden rounded-[32px] p-4 sm:p-8">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" />

      <div className="relative mx-auto w-full max-w-[560px]" style={{ aspectRatio: `${W} / ${H}` }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="absolute inset-0 h-full w-full overflow-visible"
          role="img"
          aria-label={t.mapAria}
        >
          <defs>
            <clipPath id={`${id}-clip`}>
              <path d={POLAND_PATH} />
            </clipPath>

            {/* Kolory muszą być w samym wzorze — currentColor brałby kolor z miejsca definicji. */}
            <pattern id={`${id}-dots`} width="6" height="6" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="3" r="1.05" fill="var(--color-ink)" fillOpacity="0.16" />
            </pattern>

            <pattern id={`${id}-dots-lit`} width="6" height="6" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="3" r="1.25" fill="var(--color-brand)" />
            </pattern>

            <radialGradient id={`${id}-heat`} cx={hubCenter[0]} cy={hubCenter[1]} r="170" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="white" stopOpacity="1" />
              <stop offset="0.45" stopColor="white" stopOpacity="0.55" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </radialGradient>

            <mask id={`${id}-heat-mask`}>
              <rect width={W} height={H} fill={`url(#${id}-heat)`} />
            </mask>

            <linearGradient id={`${id}-hub-line`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--color-brand)" />
              <stop offset="1" stopColor="var(--color-mint)" />
            </linearGradient>

            <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Kraj: tło, siatka kropek, podświetlony zachód */}
          <path d={POLAND_PATH} className="fill-ink/[0.025]" />
          <g clipPath={`url(#${id}-clip)`}>
            <rect width={W} height={H} fill={`url(#${id}-dots)`} />
            <rect width={W} height={H} fill={`url(#${id}-dots-lit)`} mask={`url(#${id}-heat-mask)`} />
            <circle cx={hubCenter[0]} cy={hubCenter[1]} r="120" className="fill-brand/10" style={{ filter: "blur(30px)" }} />
          </g>
          <motion.path
            d={POLAND_PATH}
            fill="none"
            className="stroke-line-strong"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2.2, ease: [0.65, 0, 0.35, 1] }}
          />

          {/* Połączenia online do dużych miast */}
          {remoteLinks.map(([from, to], index) => {
            const d = arc(CITY_POINTS[from], CITY_POINTS[to]);
            const [x, y] = CITY_POINTS[to];
            const highlighted = active === from;

            return (
              <g key={to} className={`transition-opacity duration-500 ${active && !highlighted ? "opacity-25" : "opacity-100"}`}>
                <motion.path
                  d={d}
                  fill="none"
                  stroke="var(--color-brand)"
                  strokeOpacity={highlighted ? 0.8 : 0.35}
                  strokeWidth={highlighted ? 1.4 : 0.9}
                  strokeDasharray="2 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 1 + index * 0.08, ease: "easeOut" }}
                />

                {!reducedMotion && (
                  <circle r={highlighted ? 2.4 : 1.6} fill="var(--color-mint)" filter={`url(#${id}-glow)`}>
                    <animateMotion dur={`${2.6 + (index % 4) * 0.5}s`} begin={`${2 + index * 0.35}s`} repeatCount="indefinite" path={d} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.4 0 0.2 1" />
                    <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur={`${2.6 + (index % 4) * 0.5}s`} begin={`${2 + index * 0.35}s`} repeatCount="indefinite" />
                  </circle>
                )}

                <circle cx={x} cy={y} r="2.6" className="fill-canvas stroke-brand/60" strokeWidth="1.2" />
              </g>
            );
          })}

          {/* Trójkąt bazy */}
          <motion.path
            d={`M${hubPoints.map((point) => point.join(" ")).join("L")}Z`}
            className="fill-brand/[0.08]"
            stroke={`url(#${id}-hub-line)`}
            strokeWidth="1.6"
            strokeLinejoin="round"
            initial={{ pathLength: 0, fillOpacity: 0 }}
            whileInView={{ pathLength: 1, fillOpacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.6, ease: [0.65, 0, 0.35, 1] }}
          />

          {/* Piny miast bazowych */}
          {locations.map((location, index) => {
            const [x, y] = CITY_POINTS[location.key];
            const isActive = active === location.key;

            return (
              <motion.g
                key={location.key}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.9 + index * 0.18 }}
                onMouseEnter={() => onActiveChange(location.key)}
                onMouseLeave={() => onActiveChange(null)}
                className="cursor-pointer"
              >
                {/* Pulsujące fale */}
                {[0, 1, 2].map((wave) => (
                  <circle
                    key={wave}
                    cx={x}
                    cy={y}
                    r="6"
                    fill="none"
                    stroke="var(--color-brand)"
                    strokeWidth="1.2"
                    className="map-wave"
                    style={{ animationDelay: `${wave * 0.9 + index * 0.3}s` }}
                  />
                ))}

                <circle cx={x} cy={y} r={isActive ? 16 : 11} className="fill-brand/20 transition-all duration-300" filter={`url(#${id}-glow)`} />
                <circle cx={x} cy={y} r={isActive ? 7.5 : 6} fill={`url(#${id}-hub-line)`} className="transition-all duration-300" />
                <circle cx={x} cy={y} r="2.4" className="fill-white" />
              </motion.g>
            );
          })}
        </svg>

        {/* Etykiety w HTML — ostre na każdym ekranie i w obu motywach */}
        {remoteLinks.map(([from, to]) => (
          <span
            key={to}
            aria-hidden="true"
            className={`pointer-events-none absolute hidden whitespace-nowrap text-[10px] font-medium transition-opacity duration-500 sm:block ${
              active && active !== from ? "text-faint/40" : "text-faint"
            }`}
            style={{ ...percent(CITY_POINTS[to]), transform: remoteLabelOffset[to] ?? "translate(-50%, 6px)" }}
          >
            {t.cities[to]}
          </span>
        ))}

        {locations.map((location) => {
          const isActive = active === location.key;

          return (
            <span
              key={location.key}
              aria-hidden="true"
              className={`pointer-events-none absolute flex items-center gap-2 whitespace-nowrap rounded-full border py-1 pl-1.5 pr-3 text-xs font-semibold shadow-float backdrop-blur-md transition-all duration-300 sm:text-sm ${isActive ? "scale-110 border-brand/50 bg-brand text-white" : "border-line-strong bg-panel/85 text-fg"}`}
              style={{ ...percent(CITY_POINTS[location.key]), transform: hubLabelOffset[location.key] }}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-white" : "bg-mint"}`} />
              {location.name}
            </span>
          );
        })}

        <div className="absolute bottom-1 right-1 flex items-center gap-2 rounded-full border border-line-strong bg-panel/85 px-3 py-1.5 text-xs text-soft backdrop-blur-md sm:bottom-4 sm:right-4">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
          </span>
          {t.badge}
        </div>
      </div>
    </div>
  );
}
