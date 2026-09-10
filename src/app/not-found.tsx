"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { localizedHref, messages, type Locale } from "../i18n";

export default function NotFound() {
  const [locale, setLocale] = useState<Locale>("ar");

  useEffect(() => {
    setLocale(document.documentElement.lang === "en" ? "en" : "ar");
  }, []);

  const copy = messages[locale];

  return (
    <section className="not-found-page" aria-labelledby="not-found-title">
      <div className="not-found-visual" aria-hidden="true">
        <span className="not-found-visual-frame" />
        <span className="not-found-code">404</span>
        <span className="not-found-visual-label">ROUTE / 404</span>
      </div>
      <div className="not-found-copy">
        <span className="eyebrow">{copy.notFoundEyebrow}</span>
        <h1 id="not-found-title">{copy.notFoundTitle}</h1>
        <p>{copy.notFoundDescription}</p>
        <div className="not-found-actions">
          <Link className="button primary" href={localizedHref(locale, "/")}>{copy.notFoundHome}</Link>
          <Link className="button" href={localizedHref(locale, "/questions")}>{copy.notFoundLibrary}</Link>
        </div>
        <div className="not-found-hint">
          <span className="not-found-hint-dot" aria-hidden="true" />
          <span>{copy.notFoundHint}</span>
        </div>
      </div>
    </section>
  );
}
