import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import { ogImagePath, siteDescription, siteName, siteUrl, themeKey } from "./site-config";
import { localeStorageKey } from "../i18n";
import { SiteShell } from "./site-shell";
import { ClerkRoot } from "./clerk-provider";
import { StructuredData } from "./structured-data";

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: siteName,
      description: siteDescription,
      inLanguage: ["ar", "en"],
      publisher: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteName,
      url: siteUrl,
      logo: { "@type": "ImageObject", url: `${siteUrl}/jahezdev-logo.svg` },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(`${siteUrl}/`),
  applicationName: siteName,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  category: "education",
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  alternates: {
    canonical: "/ar/",
    languages: { ar: "/ar/", en: "/en/", "x-default": "/ar/" },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: "/ar/",
    siteName,
    type: "website",
    locale: "ar_EG",
    alternateLocale: ["en_US"],
    images: [{ url: ogImagePath, width: 1200, height: 630, alt: `${siteName} — Technical interview preparation` }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    images: [ogImagePath],
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <StructuredData data={websiteJsonLd} />
        <script
          id="locale-init"
          dangerouslySetInnerHTML={{
            __html: `(()=>{try{const k=${JSON.stringify(localeStorageKey)};const m=location.pathname.match(/^\/(ar|en)(?=\/|$)/);const p=location.pathname.replace(/^\/(?:ar|en)(?=\/|$)/,"")||"/";const stored=localStorage.getItem(k);const browser=/^en(?:-|$)/i.test(navigator.language||"")?"en":"ar";const l=m?.[1]||((stored==="en"||stored==="ar")?stored:browser);localStorage.setItem(k,l);document.documentElement.lang=l;document.documentElement.dir=l==="en"?"ltr":"rtl";const skip=/^\/(?:auth(?:\/|$)|sign-in$|sign-up$)/.test(location.pathname);const target="/"+l+(p==="/"?"":p)+location.search+location.hash;if(!skip&&m?.[1]!==l&&(!m||l==="en")){location.replace(target);return}if(m)history.replaceState(null,"",p+location.search+location.hash)}catch{}})()`,
          }}
        />
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{
            __html: `(()=>{try{const s=localStorage.getItem(${JSON.stringify(themeKey)});document.documentElement.dataset.theme=s==="light"||s==="dark"?s:matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}catch{}})()`,
          }}
        />
        <script
          id="track-init"
          dangerouslySetInnerHTML={{
            __html: `(()=>{try{const path=location.pathname.replace(/\\/+$/,"")||"/";if(path==="/"||path==="/ar"||path==="/en"){delete document.documentElement.dataset.track;return}const p=new URLSearchParams(location.search).get("track")||localStorage.getItem("selected-track")||"flutter";document.documentElement.dataset.track=p}catch{}})()`,
          }}
        />
      </head>
      <body>
        <ClerkRoot><SiteShell>{children}</SiteShell></ClerkRoot>
      </body>
    </html>
  );
}
