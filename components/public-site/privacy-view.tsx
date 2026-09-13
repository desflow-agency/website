import { ArrowLeft, ShieldCheck } from "lucide-react";

import { SiteShell } from "@/components/public-site";
import { getDictionary, type Locale, localeMeta, localizePath } from "@/lib/i18n";
import { getPrivacyPolicy, MISSING, type PolicyBlock } from "@/lib/i18n/privacy";
import { siteConfig } from "@/lib/site";

// Podświetla pola do uzupełnienia (np. brak nazwy firmy w lib/site.ts).
function WithPlaceholders({ text }: { text: string }) {
  const parts = text.split(MISSING);

  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <mark key={index} className="rounded-md bg-amber/20 px-1.5 py-0.5 font-mono text-[0.85em] text-amber">
            [{part}]
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
}

function Block({ block }: { block: PolicyBlock }) {
  if (typeof block === "string") {
    return (
      <p className="leading-7 text-soft">
        <WithPlaceholders text={block} />
      </p>
    );
  }

  return (
    <ul className="space-y-2.5">
      {block.list.map((item) => (
        <li key={item} className="flex gap-3 leading-7 text-soft">
          <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
          <span>
            <WithPlaceholders text={item} />
          </span>
        </li>
      ))}
    </ul>
  );
}

export function PrivacyView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.privacyPage;
  const policy = getPrivacyPolicy(locale);
  const updated = new Intl.DateTimeFormat(localeMeta[locale].htmlLang, { dateStyle: "long" }).format(
    new Date(siteConfig.policyUpdated)
  );

  return (
    <SiteShell locale={locale} dict={dict} internalPath="/privacy" sectionLinksToHome>
      <section className="relative overflow-hidden pb-24 pt-36 sm:pt-44">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="grid-lines absolute inset-0 opacity-70" />
          <div className="absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-brand-strong/20 blur-[140px]" />
        </div>

        <div className="container-site">
          <a
            href={localizePath(locale, "/")}
            className="group inline-flex items-center gap-2 text-sm font-medium text-soft transition hover:text-fg"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
            {t.back}
          </a>

          <div className="mt-10 grid gap-12 lg:grid-cols-[260px_1fr] lg:gap-16">
            {/* SPIS TREŚCI */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand/10 text-brand">
                <ShieldCheck size={22} strokeWidth={1.8} />
              </span>
              <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-faint">{t.toc}</p>
              <nav aria-label={t.toc} className="mt-4">
                <ol className="space-y-1 border-l border-line">
                  {policy.sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="-ml-px block border-l border-transparent py-1.5 pl-4 text-sm text-soft transition hover:border-brand hover:text-fg"
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>

            {/* TREŚĆ */}
            <article className="min-w-0">
              <p className="kicker">desflow</p>
              <h1 className="title-lg mt-5">{policy.title}</h1>
              <p className="mt-4 text-sm text-faint">
                {t.updated}: <time dateTime={siteConfig.policyUpdated}>{updated}</time>
              </p>
              <p className="mt-8 max-w-3xl text-lg leading-8 text-soft">{policy.intro}</p>

              <div className="mt-12 space-y-4">
                {policy.sections.map((section) => (
                  <section key={section.id} id={section.id} className="surface scroll-mt-28 rounded-3xl p-6 sm:p-8">
                    <h2 className="text-xl font-semibold tracking-tight">{section.title}</h2>
                    <div className="mt-4 space-y-4">
                      {section.body.map((block, index) => (
                        <Block key={index} block={block} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
