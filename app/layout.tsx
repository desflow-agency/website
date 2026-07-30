import "./globals.css";

import type { Metadata } from "next";
import { Poppins, Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const poppins = Poppins({
  subsets: ["latin"],
  weight: [
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ],
    display: "swap",
});

export const metadata: Metadata = {
  title: "desflow — Creative studio",
  description:
    "Strategia, design i digital dla marek, które chcą więcej.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  openGraph: {
    title: "desflow",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html
      lang="pl"
      className={cn(poppins.className, "font-sans", geist.variable)}
    >
      <body>{children}</body>
    </html>
  );
}