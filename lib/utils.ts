export const cn = (
  ...values: (string | undefined | false)[]
) => {
  return values.filter(Boolean).join(" ");
};

export const money = (value: number) => {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  }).format(value);
};

export const services = [
  [
    "Projektowanie grafik",
    "Systemy wizualne, social media i materiały, których nie da się przewinąć.",
    50,
    "Sparkles",
  ],
  [
    "Montaż filmów",
    "Dynamiczne reelsy i filmy, które zatrzymują uwagę.",
    75,
    "Play",
  ],
  [
    "Social Media",
    "Strategia, content i community w jednym spójnym procesie.",
    150,
    "MessageCircle",
  ],
  [
    "Branding",
    "Tożsamość marki, która mówi zanim padnie pierwsze słowo.",
    250,
    "Palette",
  ],
  [
    "Reklamy Meta",
    "Kampanie skupione na konwersji, a nie pustych zasięgach.",
    250,
    "Target",
  ],
] as const;