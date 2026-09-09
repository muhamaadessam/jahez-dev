import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import { ogImagePath, siteDescription, siteName, siteUrl, themeKey } from "./site-config";
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
            __html: `(()=>{const l=location.pathname.split('/').filter(Boolean).find(s=>s==="en"||s==="ar")==="en"?"en":"ar";document.documentElement.lang=l;document.documentElement.dir=l==="en"?"ltr":"rtl"})()`,
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
