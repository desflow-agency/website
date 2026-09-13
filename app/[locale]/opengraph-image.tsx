import { ImageResponse } from "next/og";

import { getDictionary, hasLocale } from "@/lib/i18n";

export const alt = "desflow";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Obrazek podglądu linku (Facebook, Messenger, Discord, X, LinkedIn) — osobny dla każdego języka.
export default async function OpengraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getDictionary(hasLocale(locale) ? locale : "pl").meta;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background:
            "radial-gradient(circle at 85% 10%, rgba(107,108,246,0.55), transparent 45%), radial-gradient(circle at 10% 100%, rgba(94,230,207,0.25), transparent 40%), #07070b",
          color: "#f4f4f7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30, fontWeight: 700 }}>
          <div style={{ width: 18, height: 18, borderRadius: 999, background: "#5ee6cf" }} />
          desflow
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 80, fontWeight: 700, lineHeight: 1, letterSpacing: -3 }}>{t.ogHeadline[0]}</div>
          <div style={{ fontSize: 80, fontWeight: 700, lineHeight: 1, letterSpacing: -3, color: "#8b8cff" }}>
            {t.ogHeadline[1]}
          </div>
        </div>

        <div style={{ display: "flex", gap: 14, fontSize: 26, color: "#a7a7b8" }}>{t.ogServices}</div>
      </div>
    ),
    size
  );
}
