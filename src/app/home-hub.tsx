"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { questions } from "../content/questions";
import { formatNumber, localizedHref, messages, type Locale } from "../i18n";
import { nodeRequest } from "../backend/api";

type SiteStats = { users: number; visits: number };

function useSiteStats(): SiteStats | null {
  const [stats, setStats] = useState<SiteStats | null>(null);

  useEffect(() => {
    let active = true;
    nodeRequest<SiteStats>({
      path: "/site-stats/visit",
      init: { method: "POST" },
    }).then((value) => {
      if (active) setStats(value);
    }).catch(() => undefined);
    return () => { active = false; };
  }, []);

  return stats;
}

export function HomeHub({ locale = "ar" }: { locale?: Locale }) {
  const copy = messages[locale];
  const siteStats = useSiteStats();
  const stats = [
    { value: formatNumber(questions.length, locale), label: copy.totalQuestions },
    { value: siteStats ? formatNumber(siteStats.visits, locale) : "—", label: copy.visitsCount },
    { value: siteStats ? formatNumber(siteStats.users, locale) : "—", label: copy.usersCount },
  ];

  return (
    <>
      <section className="shell home-landing" aria-labelledby="home-title">
        <div className="home-landing-copy">
          <span className="eyebrow">{copy.homeEyebrow}</span>
          <h1 id="home-title">{copy.homeTitle}</h1>
          <p className="lead">{copy.homeLead}</p>
          <div className="actions">
            <Link className="button primary" href={localizedHref(locale, "/topics")}>
              {copy.exploreAllTracks}
            </Link>
          </div>
        </div>

        <div
          className="home-community-stats home-community-stats-wide"
          aria-label={locale === "ar" ? "إحصاءات المنصة" : "Platform statistics"}
          aria-live="polite"
          aria-busy={siteStats === null}
        >
          {stats.map((stat) => (
            <div className="home-community-stat" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="shell section" aria-labelledby="features-title">
        <div className="section-header">
          <div>
            <h2 id="features-title">{copy.whyPrepareHere}</h2>
            <p>{copy.whyPrepareHereLead}</p>
          </div>
        </div>

        <div className="grid home-features-grid">
          <div className="card feature-card">
            <div className="feature-icon" aria-hidden="true">📖</div>
            <h3>{copy.feature1Title}</h3>
            <p>{copy.feature1Lead}</p>
          </div>
          <div className="card feature-card">
            <div className="feature-icon" aria-hidden="true">🎯</div>
            <h3>{copy.feature2Title}</h3>
            <p>{copy.feature2Lead}</p>
          </div>
          <div className="card feature-card">
            <div className="feature-icon" aria-hidden="true">🧠</div>
            <h3>{copy.feature3Title}</h3>
            <p>{copy.feature3Lead}</p>
          </div>
          <div className="card feature-card">
            <div className="feature-icon" aria-hidden="true">🔒</div>
            <h3>{copy.feature4Title}</h3>
            <p>{copy.feature4Lead}</p>
          </div>
        </div>
      </section>

      <section className="shell section home-track-discovery" aria-labelledby="all-tracks-title">
        <div className="section-header">
          <div>
            <h2 id="all-tracks-title">{copy.exploreAllTracks}</h2>
            <p>{copy.exploreAllTracksLead}</p>
          </div>
          <Link className="button primary" href={localizedHref(locale, "/topics")}>
            {copy.exploreAllTracks}
          </Link>
        </div>
      </section>
    </>
  );
}
