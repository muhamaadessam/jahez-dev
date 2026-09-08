import type { Metadata } from "next";

import { localizedHref, type Locale } from "../i18n.ts";
import { ogImagePath, siteName } from "./site-config.ts";

const noIndexPaths = new Set(["/moderator", "/my-tracks", "/progress", "/submissions"]);

export function localizedMetadata(locale: Locale, path: string, title: string, description: string): Metadata {
  const canonical = localizedHref(locale, path);
  return {
    title,
    description,
    robots: noIndexPaths.has(path) ? { index: false, follow: false } : undefined,
    alternates: {
      canonical,
      languages: {
        ar: localizedHref("ar", path),
        en: localizedHref("en", path),
        "x-default": localizedHref("ar", path),
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName,
      locale: locale === "ar" ? "ar_EG" : "en_US",
      alternateLocale: locale === "ar" ? ["en_US"] : ["ar_EG"],
      type: "website",
      images: [{ url: ogImagePath, width: 1200, height: 630, alt: `${siteName} — Technical interview preparation` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImagePath] },
  };
}
