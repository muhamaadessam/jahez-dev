import { localizedMetadata } from "../metadata";
import type { Locale } from "../../content/questions";
import FullInterviewPage from "../interview/page";

export const metadata = localizedMetadata("ar", "/interview", "مقابلة كاملة", "إعداد مقابلة كاملة مع مقابلاتك السابقة وتقدمك في كل واحدة.");

export default function InterviewsPage({ locale = "ar" }: { locale?: Locale }) {
  return <FullInterviewPage locale={locale} />;
}
