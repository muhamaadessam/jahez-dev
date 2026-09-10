import { notFound } from "next/navigation";

import type { Locale } from "../../../content/questions";
import { localizedMetadata } from "../../metadata";
import InterviewsPage from "../../interviews/page";

export function generateStaticParams() { return [{ locale: "ar" }, { locale: "en" }]; }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return localizedMetadata(locale, "/interviews", locale === "ar" ? "مقابلاتي" : "My interviews", locale === "ar" ? "المقابلات التي بدأت بها وتقدمك في كل واحدة." : "The interviews you started and your progress in each one.");
}
export default async function LocalizedInterviews({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  if (locale !== "ar" && locale !== "en") notFound();
  return <InterviewsPage locale={locale} />;
}
