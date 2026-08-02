import {
    ArrowRight,
    Code2,
    Play,
    Sparkles,
    Target,
    type LucideIcon,
  } from "lucide-react";
  
  import { money, services } from "@/lib/utils";
  
  const icons: Record<string, LucideIcon> = {
    Sparkles,
    Play,
    Target,
    Code2,
  };
  
  export function ServicesSection() {
    return (
      <section id="offer" className="bg-white py-28">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Oferta</p>
  
              <h2 className="mt-2 text-4xl font-bold tracking-[-.045em]">
                Wybierz swój następny ruch.
              </h2>
            </div>
  
            <p className="sub text-base">
              Łącz usługi w zespół dokładnie na miarę.
            </p>
          </div>
  
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map(([title, description, price, icon], index) => {
              const Icon = icons[icon] || Sparkles;
              const discount = index === 2 ? 40 : 0;
  
              return (
                <article
                  key={title}
                  className="card service relative p-7"
                >
                  {discount > 0 && (
                    <span className="absolute right-5 top-5 rounded-full bg-[#5b5cf0] px-3 py-1 text-xs font-bold text-white">
                      −{discount}%
                    </span>
                  )}
  
                  <Icon className="text-[#5b5cf0]" />
  
                  <h3 className="mt-5 text-xl font-bold">
                    {title}
                  </h3>
  
                  <p className="mt-2 min-h-12 text-sm leading-6 text-[#686b7d]">
                    {description}
                  </p>
  
                  <div className="mt-7 flex items-end justify-between">
                    <div>
                      <small className="text-[#77798b]">
                        od
                      </small>
  
                      <p className="text-xl font-bold">
                        {discount
                          ? money(Number(price) * (1 - discount / 100))
                          : money(Number(price))}
                      </p>
                    </div>
  
                    <a
                      href="#contact"
                      aria-label={`Zamów ${title}`}
                      className="btn btn-light p-3"
                    >
                      <ArrowRight size={18} />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    );
  }