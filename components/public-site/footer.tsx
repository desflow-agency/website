import { ArrowUpRight } from "lucide-react";

const navigation = [["Oferta", "#oferta"], ["Portfolio", "#portfolio"], ["Opinie", "#opinie"], ["Kontakt", "#kontakt"]];

export function Footer() {
  return (
    <footer className="mt-8 pt-12 pb-12 bg-[#111322] text-white">
      <div className="shell py-12 md:py-16">
        <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <a href="#home" className="text-2xl font-black tracking-tight">desflow</a>
            <p className="mt-5 max-w-xs leading-7 text-[#b8b9c7]">Studio strategiczno-kreatywne dla marek, które chcą być zauważone.</p>
            <a className="footer-cta" href="#kontakt">Porozmawiajmy <ArrowUpRight size={17} /></a>
          </div>
          <div>
            <p className="footer-label">Nawigacja</p>
            <nav className="mt-5 grid gap-3">{navigation.map(([label, href]) => <a className="footer-link" href={href} key={href}>{label}</a>)}</nav>
          </div>
          <div>
            <p className="footer-label">Kontakt</p>
            <div className="mt-5 grid gap-3 text-sm text-[#d8d8e3]"><a className="footer-link" href="mailto:hello@agencyname.pl">hello@desflow.pl</a></div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 pt-7 text-xs text-[#898b9d]"><span>© {new Date().getFullYear()} desflow. Wszelkie prawa zastrzeżone.</span></div>
      </div>
    </footer>
  );
}
