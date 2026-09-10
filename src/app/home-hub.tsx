"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { questions, topics } from "../content/questions";
import { formatNumber, localizedHref, messages, type Locale } from "../i18n";
import { nodeRequest } from "../backend/api";
import { useActiveTrack } from "./active-track";
import { TrackLogo } from "./track-logos";

type SiteStats = { users: number; visits: number };

type FeatureIconName = "book" | "target" | "review" | "progress";

function FeatureIcon({ name }: { name: FeatureIconName }) {
  if (name === "book") {
    return (
      <svg viewBox="0 0 36 36" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <path d="M8 5h17a2.5 2.5 0 0 1 2.5 2.5V26" strokeOpacity="0.32" />
        <rect x="5" y="8" width="22" height="23" rx="3" fill="currentColor" fillOpacity="0.08" />
        <path d="M20 5v8l2.5-1.5L25 13V5z" fill="currentColor" fillOpacity="0.22" />
        <line x1="9.5" y1="15" x2="16.5" y2="15" />
        <line x1="9.5" y1="20" x2="22.5" y2="20" />
        <line x1="9.5" y1="24.5" x2="18.5" y2="24.5" />
      </svg>
    );
  }

  if (name === "target") {
    return (
      <svg viewBox="0 0 36 36" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <rect x="4" y="6" width="28" height="24" rx="3.5" fill="currentColor" fillOpacity="0.08" />
        <line x1="4" y1="13" x2="32" y2="13" strokeOpacity="0.32" />
        <circle cx="8" cy="9.5" r="1.2" fill="currentColor" />
        <circle cx="12" cy="9.5" r="1.2" fill="currentColor" />
        <path d="M9 18.5l3 2.5-3 2.5" strokeWidth="2" />
        <line x1="15" y1="21" x2="23" y2="21" strokeWidth="1.8" />
        <circle cx="26" cy="21" r="3.5" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.4" />
        <path d="M24.5 21l1 1 2-2" strokeWidth="1.4" />
      </svg>
    );
  }

  if (name === "review") {
    return (
      <svg viewBox="0 0 36 36" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <path d="M10 5h16a2.5 2.5 0 0 1 2.5 2.5v18" strokeOpacity="0.32" />
        <rect x="6" y="8" width="21" height="23" rx="3" fill="currentColor" fillOpacity="0.08" />
        <line x1="10" y1="14" x2="21" y2="14" />
        <line x1="10" y1="18" x2="17" y2="18" />
        <rect x="9.5" y="22.5" width="14" height="5" rx="2.5" fill="currentColor" fillOpacity="0.2" />
        <circle cx="16.5" cy="25" r="1" fill="currentColor" />
        <path d="M13.5 25c.7-1.1 1.8-1.7 3-1.7s2.3.6 3 1.7c-.7 1.1-1.8 1.7-3 1.7s-2.3-.6-3-1.7z" strokeWidth="1.1" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 36 36" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <rect x="4" y="6" width="28" height="24" rx="3.5" fill="currentColor" fillOpacity="0.08" />
      <path d="M23 6v8l-2.5-1.8L18 14V6z" fill="currentColor" fillOpacity="0.22" />
      <rect x="8" y="21" width="3" height="5" rx="1" fill="currentColor" fillOpacity="0.35" />
      <rect x="14" y="17" width="3" height="9" rx="1" fill="currentColor" fillOpacity="0.55" />
      <rect x="20" y="13" width="3" height="13" rx="1" fill="currentColor" />
      <path d="M9.5 18.5l5.5-4 6 2 6-5.5" strokeWidth="1.8" />
      <circle cx="27" cy="11" r="1.5" fill="currentColor" />
    </svg>
  );
}

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
  const { selectableTracks } = useActiveTrack();
  const stats = [
    { value: formatNumber(questions.length, locale), label: copy.totalQuestions },
    { value: siteStats ? formatNumber(siteStats.visits, locale) : "—", label: copy.visitsCount },
    { value: siteStats ? formatNumber(siteStats.users, locale) : "—", label: copy.usersCount },
  ];
  const trackStats = selectableTracks.map((track) => ({
    ...track,
    questionCount: questions.filter((question) => question.trackId === track.id).length,
    topicCount: topics.filter((topic) => topic.trackId === track.id).length,
  }));

  return (
    <>
      <section className="shell home-landing" aria-labelledby="home-title">
        <div className="home-landing-copy">
          <span className="eyebrow">{copy.homeEyebrow}</span>
          <h1 id="home-title">{copy.homeTitle}</h1>
          <p className="lead">{copy.homeLead}</p>
          <div className="actions">
            <Link className="button primary" href={localizedHref(locale, "/session")}>
              {copy.startReview}
            </Link>
            <Link className="button" href={localizedHref(locale, "/topics")}>
              {copy.exploreTopics}
            </Link>
          </div>
        </div>

        <aside
          className="home-hero-stats"
          aria-label={locale === "ar" ? "إحصاءات المنصة" : "Platform statistics"}
          aria-live="polite"
          aria-busy={siteStats === null}
        >
          <div className="home-stats-card">
            <div className="home-stats-header">
              <span className="home-stats-pill">
                <span className="hero-card-pulse-dot" aria-hidden="true" />
                <span>{locale === "ar" ? "إحصاءات المنصة" : "Platform statistics"}</span>
              </span>
            </div>

            <div className="home-stat-primary">
              <strong className="home-stat-primary-value">{stats[0].value}</strong>
              <span className="home-stat-primary-label">{stats[0].label}</span>
            </div>

            <div className="home-stats-divider" aria-hidden="true" />

            <div className="home-stats-grid">
              <div className="home-stat-item">
                <strong className="home-stat-item-value">{stats[1].value}</strong>
                <span className="home-stat-item-label">{stats[1].label}</span>
              </div>
              <div className="home-stat-item">
                <strong className="home-stat-item-value">{stats[2].value}</strong>
                <span className="home-stat-item-label">{stats[2].label}</span>
              </div>
            </div>
          </div>
        </aside>
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
            <div className="feature-icon" aria-hidden="true"><FeatureIcon name="book" /></div>
            <h3>{copy.feature1Title}</h3>
            <p>{copy.feature1Lead}</p>
          </div>
          <div className="card feature-card">
            <div className="feature-icon" aria-hidden="true"><FeatureIcon name="target" /></div>
            <h3>{copy.feature2Title}</h3>
            <p>{copy.feature2Lead}</p>
          </div>
          <div className="card feature-card">
            <div className="feature-icon" aria-hidden="true"><FeatureIcon name="review" /></div>
            <h3>{copy.feature3Title}</h3>
            <p>{copy.feature3Lead}</p>
          </div>
          <div className="card feature-card">
            <div className="feature-icon" aria-hidden="true"><FeatureIcon name="progress" /></div>
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
        </div>

        <div className="grid home-tracks-grid">
          {trackStats.map((track) => (
            <Link
              key={track.id}
              className="card home-track-card"
              data-track-card={track.id}
              href={localizedHref(locale, `/topics?track=${encodeURIComponent(track.slug)}`)}
            >
              <div className="home-track-header">
                <div className="home-track-identity">
                  <span className="home-track-logo-wrap" aria-hidden="true">
                    <TrackLogo trackId={track.id} size={28} />
                  </span>
                  <h3 className="home-track-title">{track.name}</h3>
                </div>
              </div>
              <p className="home-track-stats">
                {formatNumber(track.questionCount, locale)} {copy.trackQuestions} · {formatNumber(track.topicCount, locale)} {copy.trackTopics}
              </p>
              <span className="home-track-card-cta">{copy.chooseTrack} <span aria-hidden="true">{locale === "ar" ? "←" : "→"}</span></span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
