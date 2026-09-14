// Realizacje w portfolio — dane wspólne dla sekcji na stronie i sitemapy (obrazki dla Google Grafika).

export const portfolioFilters = ["all", "grafika", "wideo", "social"] as const;

export type PortfolioCategory = Exclude<(typeof portfolioFilters)[number], "all">;

export type Project = {
  title: string;
  category: PortfolioCategory;
  media: string;
  width: number;
  height: number;
};

export const projects: Project[] = [
  { title: "Surova", category: "grafika", media: "/surova.png", width: 1024, height: 1024 },
  { title: "AdviceBot | TikTok #1", category: "wideo", media: "/advice_tt_1.mp4", width: 9, height: 16 },
  { title: "mcgramy.pl | Banner #1", category: "grafika", media: "/mcg.png", width: 595, height: 842 },
  { title: "AdviceBot | Miniaturka #1", category: "grafika", media: "/miniatura.png", width: 1920, height: 1080 },
  { title: "Wąsaty Jeżor", category: "social", media: "/wasaty_1.png", width: 1000, height: 562 },
  { title: "AdviceBot | TikTok #2", category: "wideo", media: "/advice_tt_2.mp4", width: 9, height: 16 },
  { title: "zentrify", category: "grafika", media: "/zentrify.png", width: 960, height: 540 },
  { title: "hostero", category: "grafika", media: "/Hostero.png", width: 800, height: 700 },
  { title: "mcgramy.pl", category: "social", media: "/mcgramy_1.png", width: 1000, height: 562 },
  { title: "mcgramy.pl | TikTok #1", category: "wideo", media: "/mcgramy_tt_1.mp4", width: 9, height: 16 },
  { title: "detailing.detmer", category: "grafika", media: "/detailing.png", width: 929, height: 593 },
  { title: "AdviceBot | Social Media", category: "social", media: "/advice_1.png", width: 1000, height: 562 },
  { title: "mcgramy.pl | Banner #2", category: "grafika", media: "/lobby_banner_pvp.png", width: 750, height: 1161 },
  { title: "e-liq", category: "grafika", media: "/stormzone_x_eliq.png", width: 2300, height: 900 },
  { title: "AdviceBot | Miniaturka #2", category: "grafika", media: "/miniatura2.png", width: 1920, height: 1080 },
];

export const isVideo = (url: string) => /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(url);
