import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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


export const services = [

  [
    "Grafika komputerowa",
    "Profesjonalne grafiki reklamowe, identyfikacja wizualna oraz materiały marketingowe.",
    50,
    "Sparkles"
  ],


  [
    "Montaż video",
    "Dynamiczny montaż filmów reklamowych, rolek oraz materiałów social media.",
    75,
    "Play"
  ],


  [
    "Social Media",
    "Prowadzenie profili, przygotowanie contentu i zwiększanie zasięgów.",
    150,
    "Target"
  ],

] as const;