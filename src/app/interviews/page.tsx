import { localizedMetadata } from "../metadata";
import type { Locale } from "../../content/questions";
import { InterviewHistory } from "./interview-history";

export const metadata = localizedMetadata("ar", "/interviews", "مقابلاتي", "المقابلات الكاملة التي بدأت بها وتقدمك في كل واحدة.");

export default function InterviewsPage({ locale = "ar" }: { locale?: Locale }) {
  return <InterviewHistory locale={locale} />;
}
