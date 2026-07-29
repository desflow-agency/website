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
    "Systemy wizualne, branding i materiały, których nie da się przewinąć.",
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
    "Social Media Marketing",
    "Strategia, content i community w jednym spójnym procesie.",
    150,
    "MessageCircle",
  ],
] as const;