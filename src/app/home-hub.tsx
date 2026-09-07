"use client";

import Link from "next/link";
import { useMemo } from "react";

import { getQuestionTopics, getQuestionTranslation, questions, topics } from "../content/questions";
import { localizedHref, messages, topicName, type Locale } from "../i18n";
import { scopeCatalogue } from "../tracks/active-track";
import { useActiveTrack } from "./active-track";

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
          <strong>{questions.length}</strong>
          <span>{questions.length} {copy.currentQuestions}</span>
          <hr />
          {activeTrack && scoped ? (
            <>
              <b>{activeTrack.name} · {scoped.topics.length} {copy.trackTopics}</b>
              <p>{scoped.questions.length} {copy.availableQuestions}</p>
            </>
          ) : (
            <>
              <b>{copy.exploreAllTracks}</b>
              <p>{locale === "ar" ? "اختر مسارك التقني للبدء." : "Select your track to begin."}</p>
            </>
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
                <span className="chip" key={topic.id}>
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
              <div key={track.id} className={`card home-track-card ${isActive ? "active" : ""}`}>
                <div className="home-track-header">
                  <h3 className="home-track-title">{track.name}</h3>
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
