import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}



// ==============================
// FORMATOWANIE CEN
// ==============================

export function money(value: number) {

  return new Intl.NumberFormat(
    "pl-PL",
    {
      style: "currency",
      currency: "PLN",
      maximumFractionDigits: 0,
    }
  ).format(value);

}




// ==============================
// USŁUGI AGENCJI
// ==============================


export const services = [

  [
    "Grafika komputerowa",
    "Profesjonalne grafiki reklamowe, identyfikacja wizualna oraz materiały marketingowe.",
    500,
    "Sparkles"
  ],


  [
    "Montaż video",
    "Dynamiczny montaż filmów reklamowych, rolek oraz materiałów social media.",
    800,
    "Play"
  ],


  [
    "Social Media",
    "Prowadzenie profili, przygotowanie contentu i zwiększanie zasięgów.",
    1200,
    "Target"
  ],


  [
    "Strony internetowe",
    "Nowoczesne strony WWW oraz aplikacje tworzone w Next.js.",
    2500,
    "Code2"
  ]

] as const;