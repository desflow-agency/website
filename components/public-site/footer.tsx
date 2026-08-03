import { ArrowUpRight } from "lucide-react";
import { FaYoutube, FaTiktok, FaFacebookF } from "react-icons/fa6";

const navigation = [
  ["Oferta", "#offer"],
  ["Portfolio", "#portfolio"],
  ["Opinie", "#reviews"],
  ["Kontakt", "#contact"],
];

const services = [
  "Grafika",
  "Projektowanie stron",
  "Social Media",
  "Montaż wideo",
];

export function Footer() {
  return (
    <footer className="relative mt-24 pt-12 pb-12 overflow-hidden border-t border-white/10 bg-[#0d0f1a] text-white">

      {/* glow */}
      <div className="absolute left-1/2 top-0 h-100 w-175 -translate-x-1/2 rounded-full bg-violet-500/10 blur-[140px]" />

      <div className="shell relative py-20">

        <div className="grid gap-16 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">

          {/* LEFT */}

          <div>

            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-black tracking-tight">
                desflow
              </h2>

              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                Dostępne
              </span>
            </div>

            <p className="mt-6 max-w-sm leading-8 text-white/60">
              Tworzymy nowoczesne strony internetowe, branding oraz
              materiały marketingowe dla firm, które chcą wyglądać premium.
            </p>

            <a
              href="#contact"
              className="group mt-8 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 font-semibold text-black transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_3px_40px_rgba(255,255,255,.15)]"
            >
              Porozmawiajmy

              <ArrowUpRight
                size={18}
                className="transition group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </a>
          </div>

          {/* NAV */}

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-white/40">
              Nawigacja
            </h3>

            <div className="mt-6 flex flex-col gap-4">
              {navigation.map(([name, href]) => (
                <a
                  key={href}
                  href={href}
                  className="group flex w-fit items-center gap-2 text-white/70 transition hover:text-white"
                >
                  <span className="h-px w-0 bg-violet-400 transition-all duration-300 group-hover:w-5" />
                  {name}
                </a>
              ))}
            </div>
          </div>

          {/* SERVICES */}

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-white/40">
              Usługi
            </h3>

            <div className="mt-6 flex flex-col gap-4 text-white/70">
              {services.map((service) => (
                <span key={service}>{service}</span>
              ))}
            </div>
          </div>

          {/* CONTACT */}

          <div>

            <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-white/40">
              Kontakt
            </h3>

            <div className="mt-6 space-y-4">

              <a
                href="mailto:hello@desflow.pl"
                className="block text-white/70 transition hover:text-white"
              >
                hello@desflow.pl
              </a>

              <div className="flex gap-3 pt-2">
                <a
                  href="#"
                  className="rounded-full border border-white/10 p-3 text-white/70 transition hover:border-violet-500 hover:bg-violet-500 hover:text-white"
                >
                  <FaYoutube size={18} />
                </a>

                <a
                  href="#"
                  className="rounded-full border border-white/10 p-3 text-white/70 transition hover:border-violet-500 hover:bg-violet-500 hover:text-white"
                >
                  <FaTiktok size={18} />
                </a>

                <a
                  href="#"
                  className="rounded-full border border-white/10 p-3 text-white/70 transition hover:border-violet-500 hover:bg-violet-500 hover:text-white"
                >
                  <FaFacebookF size={18} />
                </a>
              </div>

            </div>
          </div>

        </div>

        <div className="my-12 h-px bg-linear-to-r from-transparent via-white/15 to-transparent" />

        <div className="flex flex-col gap-4 text-sm text-white/40 md:flex-row md:items-center md:justify-between">

          <span>
            © {new Date().getFullYear()} desflow. Wszystkie prawa zastrzeżone.
          </span>

        </div>

      </div>
    </footer>
  );
}