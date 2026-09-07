import { type Locale } from "../i18n";
import { HomeHub } from "./home-hub";

export default function HomePage({ locale = "ar" }: { locale?: Locale }) {
  return <HomeHub locale={locale} />;
}
