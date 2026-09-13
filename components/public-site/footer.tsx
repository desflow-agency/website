import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { FaTiktok, FaYoutube } from "react-icons/fa6";

import type { Dictionary, Locale } from "@/lib/i18n";
import { localizePath } from "@/lib/i18n/config";
import { navSections, siteConfig } from "@/lib/site";

import { CookieSettingsButton } from "./consent-banner";

const socials = [
  { label: "YouTube", href: siteConfig.socials.youtube, icon: FaYoutube },
  { label: "TikTok", href: siteConfig.socials.tiktok, icon: FaTiktok },
];

export function Footer({
  locale,
  sectionLinksToHome,
  t,
  nav,
}: {
  locale: Locale;
  sectionLinksToHome: boolean;
  t: Dictionary["footer"];
  nav: Dictionary["nav"]["links"];
}) {
  const home = localizePath(locale, "/");
  const href = (id: string) => (sectionLinksToHome ? `${home}#${id}` : `#${id}`);

  return (
    <footer className="relative overflow-hidden border-t border-line bg-canvas">
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[700px] -translate-x-1/2 rounded-full bg-brand-strong/10 blur-[140px]" />

      <div className="container-site relative pb-10 pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Image src="/dfblack.png" alt="" width={36} height={36} className="logo-mark h-8 w-8" />
              <p className="text-2xl font-semibold tracking-tight">desflow</p>
              <span className="rounded-full border border-mint/20 bg-mint/10 px-2.5 py-0.5 text-xs font-medium text-mint">
                {t.available}
              </span>
            </div>

            <p className="mt-6 max-w-sm leading-7 text-soft">{t.description}</p>

            <a
              href={href("contact")}
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3 text-sm font-semibold text-canvas transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(139,140,255,0.35)]"
            >
              {t.cta}
              <ArrowUpRight size={17} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>

          <nav aria-label={t.navAria}>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-faint">{t.navTitle}</p>
            <ul className="mt-6 flex flex-col gap-3.5">
              {navSections.map((id) => (
                <li key={id}>
                  <a href={href(id)} className="group flex w-fit items-center gap-2 text-soft transition hover:text-fg">
                    <span className="h-px w-0 bg-brand transition-all duration-300 group-hover:w-4" />
                    {nav[id]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-faint">{t.servicesTitle}</p>
            <ul className="mt-6 flex flex-col gap-3.5 text-soft">
              {t.services.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-faint">{t.contactTitle}</p>
            <div className="mt-6 space-y-4">
              <a href={`mailto:${siteConfig.email}`} className="block text-soft transition hover:text-fg">
                {siteConfig.email}
              </a>

              <div className="flex gap-2 pt-1">
                {socials.map(({ label, href: socialHref, icon: Icon }) => (
                  <a
                    key={label}
                    href={socialHref}
                    target="_blank"
                    rel="noopener noreferrer me"
                    aria-label={`${t.socialAria} ${label}`}
                    className="grid h-11 w-11 place-items-center rounded-full border border-line-strong text-soft transition hover:border-fg hover:bg-fg hover:text-canvas"
                  >
                    <Icon size={17} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 overflow-hidden">
          <p
            aria-hidden="true"
            className="select-none text-center text-[22vw] font-semibold leading-[0.8] tracking-[-0.07em] text-transparent [-webkit-text-stroke:1px_var(--color-line-strong)] lg:text-[250px]"
          >
            desflow
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-line pt-8 text-sm text-faint md:flex-row md:items-center md:justify-between">
          <span>
            © {new Date().getFullYear()} desflow. {t.rights}
          </span>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a href={localizePath(locale, "/privacy")} className="transition hover:text-fg">
              {t.privacy}
            </a>
            <CookieSettingsButton label={t.cookieSettings} />
            <a href="#main" className="transition hover:text-fg">
              {t.backToTop}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
