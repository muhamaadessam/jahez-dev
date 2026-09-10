"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { topics, tracks } from "../../content/questions";
import { formatDate, formatNumber, localizedHref, messages, topicName, type Locale } from "../../i18n";
import { getSavedQuestions, type SavedQuestions } from "../../study/progress";
import { getSavedInterviews, type SavedInterview } from "../../study/interviews";

function InterviewStats({ interview, progress, locale }: { interview: SavedInterview; progress: SavedQuestions; locale: Locale }) {
  const counts = interview.questionIds.reduce((result, questionId) => {
    const state = progress[questionId]?.progress ?? "not-started";
    result[state] += 1;
    return result;
  }, { "not-started": 0, reviewing: 0, mastered: 0 });
  const copy = messages[locale];
  return <div className="interview-history-stats"><span>{copy.notStarted}: {formatNumber(counts["not-started"], locale)}</span><span>{copy.reviewing}: {formatNumber(counts.reviewing, locale)}</span><span>{copy.mastered}: {formatNumber(counts.mastered, locale)}</span></div>;
}

export function InterviewHistory({ locale = "ar" }: { locale?: Locale }) {
  const copy = messages[locale];
  const [interviews, setInterviews] = useState<SavedInterview[]>([]);
  const [progress, setProgress] = useState<SavedQuestions>({});

  useEffect(() => {
    const load = () => {
      setInterviews(getSavedInterviews(localStorage));
      setProgress(getSavedQuestions(localStorage));
    };
    load();
    window.addEventListener("study-state-merged", load);
    window.addEventListener("study-state-change", load);
    return () => { window.removeEventListener("study-state-merged", load); window.removeEventListener("study-state-change", load); };
  }, []);

  return <section className="shell section interview-history-page">
    <header className="page-header">
      <span className="eyebrow">{copy.interviewsEyebrow}</span>
      <h1>{copy.interviewsTitle}</h1>
      <p>{copy.interviewsDescription}</p>
    </header>
    {interviews.length ? <div className="interview-history-list">
      {interviews.map((interview) => {
        const track = tracks.find((candidate) => candidate.id === interview.trackId);
        const topicLabels = interview.topicSlugs.map((slug) => topicName(locale, topics.find((topic) => topic.slug === slug)?.id ?? slug));
        const href = localizedHref(locale, `/interview?session=${encodeURIComponent(interview.id)}&started=1&track=${encodeURIComponent(interview.trackSlug)}`);
        return <article className="interview-history-item" key={interview.id}>
          <div className="interview-history-main">
            <div className="interview-history-heading"><span className="interview-history-track">{track?.name ?? interview.trackSlug}</span><span className={`interview-history-status${interview.completed ? " is-complete" : ""}`}>{interview.completed ? copy.interviewDone : copy.interviewInProgress}</span></div>
            <h2>{interview.difficulty} · {formatNumber(interview.questionIds.length, locale)} {copy.question}</h2>
            <p>{topicLabels.join(" · ")}</p>
            <InterviewStats interview={interview} progress={progress} locale={locale} />
            <small>{copy.interviewLastOpened}: {formatDate(interview.updatedAt.slice(0, 10), locale)}</small>
          </div>
          <Link className="button primary" href={href}>{interview.completed ? copy.reviewInterview : copy.resumeInterview}</Link>
        </article>;
      })}
    </div> : <div className="empty-state"><h2>{copy.interviewsEmptyTitle}</h2><p>{copy.interviewsEmptyDescription}</p><Link className="button primary" href={localizedHref(locale, "/interview")}>{copy.startInterview}</Link></div>}
  </section>;
}
