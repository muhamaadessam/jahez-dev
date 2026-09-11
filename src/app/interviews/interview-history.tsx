"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { topics, tracks } from "../../content/questions";
import { formatDate, formatNumber, localizedHref, messages, topicName, type Locale } from "../../i18n";
import { getSavedQuestions, type SavedQuestions } from "../../study/progress";
import { deleteInterview, getSavedInterviews, type SavedInterview } from "../../study/interviews";
import { TrackLogo } from "../track-logos";

export function InterviewHistory({
  locale = "ar",
  embedded = false,
  activeTrackId,
}: {
  locale?: Locale;
  embedded?: boolean;
  activeTrackId?: string | null;
}) {
  const copy = messages[locale];
  const [interviews, setInterviews] = useState<SavedInterview[]>([]);
  const [progress, setProgress] = useState<SavedQuestions>({});
  const [filterTrack, setFilterTrack] = useState<string>("active");

  useEffect(() => {
    const load = () => {
      setInterviews(getSavedInterviews(localStorage));
      setProgress(getSavedQuestions(localStorage));
    };
    load();
    window.addEventListener("study-state-merged", load);
    window.addEventListener("study-state-change", load);
    return () => {
      window.removeEventListener("study-state-merged", load);
      window.removeEventListener("study-state-change", load);
    };
  }, []);

  function handleDelete(id: string) {
    deleteInterview(localStorage, id);
    setInterviews(getSavedInterviews(localStorage));
  }

  const activeTrackObj = activeTrackId ? tracks.find((t) => t.id === activeTrackId || t.slug === activeTrackId) : null;
  const activeTrackName = activeTrackObj?.name ?? activeTrackId ?? "";

  const availableTracks = useMemo(() => {
    const trackMap = new Map<string, { id: string; name: string; count: number }>();
    for (const interview of interviews) {
      const id = interview.trackId;
      const trackObj = tracks.find((t) => t.id === id || t.slug === id);
      const name = trackObj?.name ?? interview.trackSlug;
      const existing = trackMap.get(id);
      if (existing) {
        existing.count += 1;
      } else {
        trackMap.set(id, { id, name, count: 1 });
      }
    }
    return Array.from(trackMap.values());
  }, [interviews]);

  const activeTrackCount = activeTrackId
    ? interviews.filter((i) => i.trackId === activeTrackId || i.trackSlug === activeTrackId).length
    : 0;

  const effectiveFilter = filterTrack === "active" && !activeTrackId ? "all" : filterTrack;

  const displayedInterviews = useMemo(() => {
    if (effectiveFilter === "all") return interviews;
    if (effectiveFilter === "active" && activeTrackId) {
      return interviews.filter((i) => i.trackId === activeTrackId || i.trackSlug === activeTrackId);
    }
    return interviews.filter((i) => i.trackId === effectiveFilter || i.trackSlug === effectiveFilter);
  }, [effectiveFilter, activeTrackId, interviews]);

  const content = (
    <>
      <header className={embedded ? "section-header interview-history-header" : "page-header"}>
        <span className="eyebrow">{copy.interviewsEyebrow}</span>
        {embedded ? <h2>{copy.interviewsTitle}</h2> : <h1>{copy.interviewsTitle}</h1>}
        <p>{copy.interviewsDescription}</p>
      </header>

      {interviews.length > 0 && (
        <div className="interview-history-filter-bar" role="tablist" aria-label={copy.interviewsTitle}>
          {activeTrackId && (
            <button
              className={`interview-filter-tab${effectiveFilter === "active" ? " is-active" : ""}`}
              type="button"
              role="tab"
              aria-selected={effectiveFilter === "active"}
              onClick={() => setFilterTrack("active")}
            >
              <span className="tab-logo-icon" aria-hidden="true">
                <TrackLogo trackId={activeTrackId} size={16} />
              </span>
              <span>{copy.interviewsFilterActiveTrack} ({activeTrackName})</span>
              <span className="tab-count-badge">{formatNumber(activeTrackCount, locale)}</span>
            </button>
          )}

          <button
            className={`interview-filter-tab${effectiveFilter === "all" ? " is-active" : ""}`}
            type="button"
            role="tab"
            aria-selected={effectiveFilter === "all"}
            onClick={() => setFilterTrack("all")}
          >
            <span>{copy.interviewsFilterAll}</span>
            <span className="tab-count-badge">{formatNumber(interviews.length, locale)}</span>
          </button>

          {availableTracks.length > 1 && (
            <div className="interview-filter-track-pills">
              {availableTracks.map((item) => {
                const isSelected = effectiveFilter === item.id;
                return (
                  <button
                    key={item.id}
                    className={`interview-track-pill${isSelected ? " is-active" : ""}`}
                    type="button"
                    onClick={() => setFilterTrack(item.id)}
                  >
                    <span className="pill-logo" aria-hidden="true">
                      <TrackLogo trackId={item.id} size={14} />
                    </span>
                    <span dir="ltr">{item.name}</span>
                    <span className="pill-count">{formatNumber(item.count, locale)}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {interviews.length ? (
        displayedInterviews.length ? (
          <div className="interview-history-list">
            {displayedInterviews.map((interview) => {
              const track = tracks.find((candidate) => candidate.id === interview.trackId || candidate.slug === interview.trackId);
              const topicLabels = interview.topicSlugs.map((slug) => topicName(locale, topics.find((topic) => topic.slug === slug)?.id ?? slug));
              const href = localizedHref(
                locale,
                `/interview?session=${encodeURIComponent(interview.id)}&started=1&track=${encodeURIComponent(interview.trackSlug)}`
              );

              const counts = interview.questionIds.reduce((result, questionId) => {
                const state = progress[questionId]?.progress ?? "not-started";
                result[state] += 1;
                return result;
              }, { "not-started": 0, reviewing: 0, mastered: 0 });

              const total = interview.questionIds.length;
              const masteredPct = total > 0 ? Math.round((counts.mastered / total) * 100) : 0;
              const reviewingPct = total > 0 ? Math.round((counts.reviewing / total) * 100) : 0;

              return (
                <article
                  className="interview-history-item"
                  key={interview.id}
                  data-card-track={interview.trackId}
                >
                  <header className="interview-history-header-row">
                    <div className="interview-history-badges">
                      <span className={`interview-history-track-badge track-badge-${interview.trackId}`}>
                        <TrackLogo trackId={interview.trackId} size={18} />
                        <strong dir="ltr">{track?.name ?? interview.trackSlug}</strong>
                      </span>
                      <span className={`interview-difficulty-badge difficulty-${interview.difficulty.toLowerCase()}`}>
                        {interview.difficulty}
                      </span>
                      <span className={`interview-history-status${interview.completed ? " is-complete" : ""}`}>
                        <span className="status-dot" aria-hidden="true" />
                        {interview.completed ? copy.interviewDone : copy.interviewInProgress}
                      </span>
                    </div>

                    <button
                      className="interview-delete-btn"
                      type="button"
                      onClick={() => {
                        if (window.confirm(copy.deleteInterviewConfirm)) {
                          handleDelete(interview.id);
                        }
                      }}
                      aria-label={copy.deleteInterview}
                      title={copy.deleteInterview}
                    >
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </header>

                  <div className="interview-history-body">
                    <div className="interview-history-meta-headline">
                      <h3 className="interview-card-title">
                        {formatNumber(interview.questionIds.length, locale)} {copy.question}
                      </h3>
                      <span className="interview-card-date">
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        {copy.interviewLastOpened}: {formatDate(interview.updatedAt.slice(0, 10), locale)}
                      </span>
                    </div>

                    <div className="interview-topic-chips" aria-label={copy.chooseTopics}>
                      {topicLabels.slice(0, 4).map((label, idx) => (
                        <span className="interview-topic-chip" key={idx} dir="ltr">{label}</span>
                      ))}
                      {topicLabels.length > 4 && (
                        <span className="interview-topic-chip chip-more">
                          +{formatNumber(topicLabels.length - 4, locale)}
                        </span>
                      )}
                    </div>

                    <div className="interview-progress-wrapper">
                      <div className="interview-progress-bar-multi" role="progressbar" aria-valuenow={masteredPct} aria-valuemin={0} aria-valuemax={100}>
                        {masteredPct > 0 && (
                          <div className="bar-seg mastered" style={{ width: `${masteredPct}%` }} title={`${copy.mastered}: ${counts.mastered}`} />
                        )}
                        {reviewingPct > 0 && (
                          <div className="bar-seg reviewing" style={{ width: `${reviewingPct}%` }} title={`${copy.reviewing}: ${counts.reviewing}`} />
                        )}
                      </div>
                      <div className="interview-history-stats">
                        <span className="stat-pill stat-mastered">
                          <span className="stat-bullet bullet-mastered" />
                          {copy.mastered}: {formatNumber(counts.mastered, locale)}
                        </span>
                        <span className="stat-pill stat-reviewing">
                          <span className="stat-bullet bullet-reviewing" />
                          {copy.reviewing}: {formatNumber(counts.reviewing, locale)}
                        </span>
                        <span className="stat-pill stat-not-started">
                          <span className="stat-bullet bullet-not-started" />
                          {copy.notStarted}: {formatNumber(counts["not-started"], locale)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <footer className="interview-history-footer">
                    <Link className="button primary interview-action-btn" href={href}>
                      <span>{interview.completed ? copy.reviewInterview : copy.resumeInterview}</span>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                        <path d={locale === "ar" ? "M19 12H5M12 19l-7-7 7-7" : "M5 12h14M12 5l7 7-7 7"} />
                      </svg>
                    </Link>
                  </footer>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="interview-history-empty-track">
            <p>
              {copy.interviewsNoTrackSessions} <strong dir="ltr">{activeTrackName}</strong>
            </p>
            <button className="button sm" type="button" onClick={() => setFilterTrack("all")}>
              {copy.interviewsShowAllSessions} ({formatNumber(interviews.length, locale)})
            </button>
          </div>
        )
      ) : (
        <div className="empty-state">
          <h2>{copy.interviewsEmptyTitle}</h2>
          <p>{copy.interviewsEmptyDescription}</p>
          <Link className="button primary" href={localizedHref(locale, "/interview")}>
            {copy.startInterview}
          </Link>
        </div>
      )}
    </>
  );

  return embedded ? (
    <section className="interview-history-embedded">{content}</section>
  ) : (
    <section className="shell section interview-history-page">{content}</section>
  );
}
