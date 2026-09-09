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
  const paths = {
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z" /><path d="M4 5.5v16M8 7h8M8 11h8" /></>,
    target: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><path d="m15.5 8.5 4-4M19.5 4.5h-4M19.5 4.5v4" /></>,
    review: <><path d="M7 4h10a2 2 0 0 1 2 2v12l-4-2-4 2-4-2-4 2V6a2 2 0 0 1 2-2z" /><path d="M7 8h8M7 12h6" /></>,
    progress: <><path d="M4 19V5M4 19h16" /><path d="m7 15 3-4 3 2 5-7" /><circle cx="10" cy="11" r="1" /><circle cx="13" cy="13" r="1" /><circle cx="18" cy="6" r="1" /></>,
  }[name];

  return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" focusable="false">{paths}</svg>;
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
