import { notFound } from "next/navigation";

import type { Locale } from "../../../content/questions";
import { localizedMetadata } from "../../metadata";
import InterviewsPage from "../../interviews/page";

export function generateStaticParams() { return [{ locale: "ar" }, { locale: "en" }]; }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return localizedMetadata(locale, "/interview", locale === "ar" ? "مقابلة كاملة" : "Full interview", locale === "ar" ? "إعداد مقابلة كاملة مع مقابلاتك السابقة وتقدمك في كل واحدة." : "Set up a full interview and return to your previous sessions.");
}
export default async function LocalizedInterviews({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  if (locale !== "ar" && locale !== "en") notFound();
  return <InterviewsPage locale={locale} />;
}
