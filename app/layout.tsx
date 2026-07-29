import "./globals.css";

import type { Metadata } from "next";
import { Poppins } from "next/font/google";

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
      className={poppins.className}
    >
      <body>{children}</body>
    </html>
  );
}