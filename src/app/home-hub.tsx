"use client";

import Link from "next/link";
import { useMemo } from "react";

import { getQuestionTopics, getQuestionTranslation, questions, topics } from "../content/questions";
import { localizedHref, messages, topicName, type Locale } from "../i18n";
import { scopeCatalogue } from "../tracks/active-track";
import { useActiveTrack } from "./active-track";
import { TrackLogo } from "./track-logos";

export function HomeHub({ locale = "ar" }: { locale?: Locale }) {
  const copy = messages[locale];
  const { activeTrack, selectableTracks, setActiveTrack, trackHref } = useActiveTrack();

  const scoped = useMemo(
    () => (activeTrack ? scopeCatalogue(activeTrack.id, null, topics, questions) : null),
    [activeTrack],
  );

  const activeTrackQuestion = scoped?.questions[0] ?? null;

  const trackStats = useMemo(() => {
    return selectableTracks.map((track) => {
      const trackQuestions = questions.filter((q) => q.trackId === track.id);
      const trackTopics = topics.filter((t) => t.trackId === track.id);
      return {
        ...track,
        questionCount: trackQuestions.length,
        topicCount: trackTopics.length,
      };
    });
  }, [selectableTracks]);

  return (
    <>
      <section className="shell hero">
        <div className="hero-copy">
          <span className="eyebrow">
            {activeTrack
              ? `${locale === "ar" ? "المسار النشط" : "Active Track"}: ${activeTrack.name}`
              : copy.homeEyebrow}
          </span>
          <h1>{copy.homeTitle}</h1>
          <p className="lead">{copy.homeLead}</p>

          <div className="home-track-selector">
            <label>
              <span>{copy.activeTrack}</span>
              <select
                value={activeTrack?.id ?? ""}
                onChange={(event) => setActiveTrack(event.target.value)}
                aria-label={copy.activeTrack}
              >
                {selectableTracks.map((track) => (
                  <option key={track.id} value={track.id}>
                    {track.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="actions">
            <Link className="button primary" href={localizedHref(locale, trackHref("/questions"))}>
              {copy.startReview}
            </Link>
            <Link className="button" href={localizedHref(locale, trackHref("/topics"))}>
              {copy.exploreTopics}
            </Link>
            <Link className="button" href={localizedHref(locale, trackHref("/interview"))}>
              {copy.interview}
            </Link>
          </div>
        </div>

        <aside className="hero-card" aria-label={locale === "ar" ? "ملخص المحتوى الحالي" : "Current content summary"}>
          <div className="hero-card-header">
            <div className="hero-card-track-badge">
              {activeTrack ? (
                <>
                  <span className="hero-card-track-icon" aria-hidden="true">
                    <TrackLogo trackId={activeTrack.id} size={20} />
                  </span>
                  <span>{activeTrack.name}</span>
                </>
              ) : (
                <span>{copy.exploreAllTracks}</span>
              )}
            </div>
            <span className="hero-card-status-pill">
              <span className="hero-card-pulse-dot" aria-hidden="true" />
              {locale === "ar" ? "جاهز للمراجعة" : "Ready to Practice"}
            </span>
          </div>

          <div className="hero-card-stat-main">
            <strong className="hero-card-number">{questions.length}</strong>
            <span className="hero-card-label">{questions.length} {copy.currentQuestions}</span>
          </div>

          <div className="hero-card-divider" />

          {activeTrack && scoped ? (
            <div className="hero-card-track-details">
              <div className="hero-card-metric-row">
                <div className="hero-card-metric">
                  <span className="hero-card-metric-num">{scoped.topics.length}</span>
                  <span className="hero-card-metric-label">{copy.trackTopics}</span>
                </div>
                <div className="hero-card-metric">
                  <span className="hero-card-metric-num">{scoped.questions.length}</span>
                  <span className="hero-card-metric-label">{copy.availableQuestions}</span>
                </div>
              </div>
              <Link className="hero-card-action" href={localizedHref(locale, trackHref("/questions"))}>
                <span>{locale === "ar" ? `كل أسئلة ${activeTrack.name}` : `All ${activeTrack.name} Questions`}</span>
                <span className="hero-card-action-arrow">{locale === "ar" ? "←" : "→"}</span>
              </Link>
            </div>
          ) : (
            <div className="hero-card-track-details">
              <p className="hero-card-hint">{locale === "ar" ? "اختر مسارك التقني للبدء." : "Select your track to begin."}</p>
            </div>
          )}
        </aside>
      </section>

      {activeTrackQuestion && (
        <section className="shell section" aria-labelledby="featured-title">
          <div className="section-header">
            <div>
              <h2 id="featured-title">
                {activeTrack
                  ? (locale === "ar"
                    ? `سؤال للمراجعة في مسار ${activeTrack.name}`
                    : `Review Question in ${activeTrack.name}`)
                  : copy.featuredTitle}
              </h2>
              <p>{copy.featuredLead}</p>
            </div>
            <Link className="text-link" href={localizedHref(locale, trackHref("/questions"))}>
              {activeTrack
                ? (locale === "ar" ? `كل أسئلة ${activeTrack.name} ←` : `All ${activeTrack.name} questions →`)
                : copy.allQuestions}
            </Link>
          </div>

          <Link
            className="card card-link"
            href={localizedHref(locale, trackHref(`/questions/${activeTrackQuestion.slug}`))}
          >
            <div className="meta">
              {getQuestionTopics(activeTrackQuestion).map((topic) => (
                <span className="chip" key={topic.id} dir="ltr">
                  {topicName(locale, topic.id)}
                </span>
              ))}
              <span className="chip">{activeTrackQuestion.difficulty}</span>
            </div>
            <h3 className="question-title">{getQuestionTranslation(activeTrackQuestion, locale).question}</h3>
            <p>{copy.answerPrompt}</p>
            <span className="text-link">{copy.readAnswer}</span>
          </Link>
        </section>
      )}

      <section className="shell section" aria-labelledby="all-tracks-title">
        <div className="section-header">
          <div>
            <h2 id="all-tracks-title">{copy.exploreAllTracks}</h2>
            <p>{copy.exploreAllTracksLead}</p>
          </div>
        </div>

        <div className="grid home-tracks-grid">
          {trackStats.map((track) => {
            const isActive = track.id === activeTrack?.id;
            return (
              <div key={track.id} data-track-card={track.id} className={`card home-track-card ${isActive ? "active" : ""}`}>
                <div className="home-track-header">
                  <div className="home-track-identity">
                    <span className="home-track-logo-wrap" aria-hidden="true">
                      <TrackLogo trackId={track.id} size={28} />
                    </span>
                    <h3 className="home-track-title">{track.name}</h3>
                  </div>
                  {isActive && <span className="chip chip-accent">{copy.currentTrack}</span>}
                </div>
                <p className="home-track-stats">
                  <span>{track.questionCount} {copy.trackQuestions}</span> · <span>{track.topicCount} {copy.trackTopics}</span>
                </p>
                <div className="home-track-actions">
                  <button
                    type="button"
                    className={`button ${isActive ? "primary" : ""}`}
                    onClick={() => setActiveTrack(track.id)}
                  >
                    {isActive ? (locale === "ar" ? "المسار النشط ✓" : "Active ✓") : copy.switchTrack}
                  </button>
                  <Link className="text-link" href={localizedHref(locale, `/topics?track=${track.slug}`)}>
                    {copy.exploreTopics} →
                  </Link>
                </div>
              </div>
            );
          })}
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
    </>
  );
}
