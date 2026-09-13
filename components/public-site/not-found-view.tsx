import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { SiteShell } from "@/components/public-site";
import { getDictionary, type Locale, localizePath } from "@/lib/i18n";
import { locations } from "@/lib/site";

import { CITY_POINTS, POLAND_PATH, POLAND_VIEWBOX } from "./poland-map";
import { Gradient } from "./rich-text";

const { width: W, height: H } = POLAND_VIEWBOX;

// Punkt "zgubionej" pinezki — na Bałtyku, poza mapą.
const LOST = { x: 118, y: 18 };

export function NotFoundView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.notFound;
  const home = localizePath(locale, "/");

  const shortcuts = (["offer", "websites", "portfolio", "locations"] as const).map((id) => ({
    href: `${home}#${id}`,
    label: dict.nav.links[id],
  }));

  return (
    <SiteShell locale={locale} dict={dict} internalPath="/" sectionLinksToHome>
      <section className="noise relative flex min-h-[100svh] items-center overflow-hidden pb-20 pt-32">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="grid-lines absolute inset-0" />
          <div className="absolute -left-20 top-10 h-[520px] w-[520px] animate-aurora rounded-full bg-brand-strong/25 blur-[140px]" />
          <div className="absolute -right-10 bottom-0 h-[420px] w-[420px] animate-aurora rounded-full bg-mint/10 blur-[140px] [animation-delay:-9s]" />

          {/* Ogromne 404 w tle */}
          <p className="nf-digits absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[34vw] font-semibold leading-none tracking-[-0.08em] text-transparent [-webkit-text-stroke:1px_var(--color-line-strong)] lg:text-[420px]">
            404
          </p>
        </div>

        <div className="container-site grid items-center gap-14 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="kicker">{t.kicker}</p>
            <h1 className="title-xl mt-6 text-balance">
              <Gradient text={t.title} />
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-soft">{t.text}</p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a href={home} className="btn-site btn-site-primary">
                <ArrowLeft size={17} />
                {t.home}
              </a>
              <a href={`${home}#contact`} className="btn-site btn-site-ghost">
                {t.contact}
                <ArrowUpRight size={17} />
              </a>
            </div>

            <div className="mt-12">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-faint">{t.shortcuts}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {shortcuts.map((shortcut) => (
                  <li key={shortcut.href}>
                    <a
                      href={shortcut.href}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-ink/[0.03] px-4 py-2 text-sm text-soft transition hover:border-ink/25 hover:text-fg"
                    >
                      {shortcut.label}
                      <ArrowUpRight size={14} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* MAPA Z ZAGUBIONĄ PINEZKĄ */}
          <div className="surface relative mx-auto w-full max-w-[520px] overflow-hidden rounded-[32px] p-6 sm:p-10" aria-hidden="true">
            <div className="relative" style={{ aspectRatio: `${W} / ${H}` }}>
              <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-visible">
                <defs>
                  <clipPath id="nf-clip">
                    <path d={POLAND_PATH} />
                  </clipPath>
                  <pattern id="nf-dots" width="6" height="6" patternUnits="userSpaceOnUse">
                    <circle cx="3" cy="3" r="1.05" fill="var(--color-ink)" fillOpacity="0.16" />
                  </pattern>
                </defs>

                <path d={POLAND_PATH} className="fill-ink/[0.025] stroke-line-strong" strokeWidth="1" />
                <rect width={W} height={H} fill="url(#nf-dots)" clipPath="url(#nf-clip)" />

                {/* Nasze miasta — przygaszone */}
                {locations.map((location) => {
                  const [x, y] = CITY_POINTS[location.key];
                  return <circle key={location.key} cx={x} cy={y} r="4" className="fill-brand/40" />;
                })}

                {/* Błądząca trasa */}
                <path
                  d={`M${CITY_POINTS.zielonaGora.join(" ")} C 150 230, 60 90, 190 120 S 260 10, ${LOST.x + 40} ${LOST.y + 30} S ${LOST.x - 10} ${LOST.y + 40}, ${LOST.x} ${LOST.y + 8}`}
                  fill="none"
                  stroke="var(--color-brand)"
                  strokeOpacity="0.55"
                  strokeWidth="1.4"
                  strokeDasharray="3 5"
                  className="nf-route"
                />

                {/* Zagubiona pinezka */}
                <g className="nf-pin">
                  <circle cx={LOST.x} cy={LOST.y} r="6" fill="none" stroke="var(--color-amber)" strokeWidth="1.2" className="map-wave" />
                  <circle cx={LOST.x} cy={LOST.y} r="6" fill="none" stroke="var(--color-amber)" strokeWidth="1.2" className="map-wave" style={{ animationDelay: "1.3s" }} />
                  <path
                    d={`M${LOST.x} ${LOST.y + 8} C ${LOST.x - 9} ${LOST.y - 2}, ${LOST.x - 9} ${LOST.y - 16}, ${LOST.x} ${LOST.y - 16} C ${LOST.x + 9} ${LOST.y - 16}, ${LOST.x + 9} ${LOST.y - 2}, ${LOST.x} ${LOST.y + 8} Z`}
                    fill="var(--color-amber)"
                  />
                  <circle cx={LOST.x} cy={LOST.y - 8} r="3" className="fill-canvas" />
                </g>
              </svg>

              <span
                className="absolute flex -translate-y-full items-center gap-2 whitespace-nowrap rounded-full border border-line-strong bg-panel/90 py-1 pl-2 pr-3 text-xs shadow-float backdrop-blur-md"
                style={{ left: `${((LOST.x + 16) / W) * 100}%`, top: `${((LOST.y + 2) / H) * 100}%` }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-amber" />
                <span className="text-soft">{t.youAreHere}:</span>
                <span className="font-semibold">{t.nowhere}</span>
              </span>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
