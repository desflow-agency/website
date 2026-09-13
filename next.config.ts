import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
      },
    ],
  },
  experimental: {
    // 404 dla adresów spoza app/[locale] (strona ma dwa główne layouty: publiczny i panel admina).
    globalNotFound: true,
  },
};

export default nextConfig;
