import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import { siteUrl, themeKey } from "./site-config";
import { SiteShell } from "./site-shell";
import { ClerkRoot } from "./clerk-provider";

export const metadata: Metadata = {
  metadataBase: new URL(`${siteUrl}/`),
  title: {
    default: "جاهز ديف | JahezDev",
    template: "%s | JahezDev",
  },
  description: "المنصة العربية الرائدة للتحضير لمقابلات العمل التقنية في أشهر مسارات البرمجة.",
  alternates: {
    canonical: "/ar/",
    languages: { ar: "/ar/", en: "/en/", "x-default": "/ar/" },
  },
  openGraph: {
    title: "جاهز ديف | JahezDev",
    description: "المنصة العربية الرائدة للتحضير لمقابلات العمل التقنية في أشهر مسارات البرمجة.",
    type: "website",
    locale: "ar_EG",
  },
  twitter: {
    card: "summary",
    title: "جاهز ديف | JahezDev",
    description: "المنصة العربية الرائدة للتحضير لمقابلات العمل التقنية في أشهر مسارات البرمجة.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
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
            __html: `(()=>{try{const p=new URLSearchParams(location.search).get("track")||localStorage.getItem("selected-track")||"flutter";document.documentElement.dataset.track=p}catch{}})()`,
          }}
        />
      </head>
      <body>
        <ClerkRoot><SiteShell>{children}</SiteShell></ClerkRoot>
      </body>
    </html>
  );
}
