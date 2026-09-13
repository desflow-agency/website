"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

import { GA_ID, onConsentChange, readConsent } from "@/lib/consent";

/*
 * Google Analytics 4 (gtag.js) — ładowany dopiero po zgodzie na cookies analityczne.
 * Consent Mode v2: analityka włączona, wszystko związane z reklamami wyłączone.
 */
export function Analytics() {
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    setGranted(readConsent()?.analytics === true);
    return onConsentChange((consent) => {
      if (consent.analytics) {
        window[`ga-disable-${GA_ID}`] = false;
        window.gtag?.("consent", "update", { analytics_storage: "granted" });
      }
      setGranted(consent.analytics);
    });
  }, []);

  if (!granted || !GA_ID) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  analytics_storage: 'granted',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied'
});
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </>
  );
}
