import { notFound } from "next/navigation";

import HomePage from "../page";
import type { Locale } from "../../content/questions";
import { localizedMetadata } from "../metadata";

export function generateStaticParams() { return [{ locale: "ar" }, { locale: "en" }]; }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return localizedMetadata(locale, "/", locale === "ar" ? "جاهز ديف | JahezDev" : "JahezDev", locale === "ar" ? "المنصة العربية الشاملة للتحضير لمقابلات العمل التقنية في مختلف المسارات البرمجية." : "Comprehensive technical interview preparation across software engineering tracks.");
}

export default async function LocalizedHome({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  if (locale !== "ar" && locale !== "en") notFound();
  return <HomePage locale={locale} />;
}
