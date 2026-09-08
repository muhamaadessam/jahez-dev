import type { MetadataRoute } from "next";

import { questions } from "../content/questions.ts";
import { siteUrl } from "./site-config.ts";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "", priority: 1 },
    { path: "/questions", priority: 0.9 },
    { path: "/topics", priority: 0.8 },
    { path: "/session", priority: 0.7 },
    { path: "/interview", priority: 0.7 },
    { path: "/privacy", priority: 0.2 },
    { path: "/terms", priority: 0.2 },
  ];
  const languages = (path: string) => ({ ar: `${siteUrl}/ar${path}`, en: `${siteUrl}/en${path}`, "x-default": `${siteUrl}/ar${path}` });
  return [
    ...["ar", "en"].flatMap((locale) => pages.map(({ path, priority }) => ({
      url: `${siteUrl}/${locale}${path}`,
      changeFrequency: path === "" ? "weekly" as const : "monthly" as const,
      priority,
      alternates: { languages: languages(path) },
    }))),
    ...["ar", "en"].flatMap((locale) => questions.map((question) => {
      const path = `/questions/${question.slug}`;
      return {
        url: `${siteUrl}/${locale}${path}`,
        lastModified: question.lastReviewedAt,
        changeFrequency: "monthly" as const,
        priority: 0.8,
        alternates: { languages: languages(path) },
      };
    })),
  ];
}
