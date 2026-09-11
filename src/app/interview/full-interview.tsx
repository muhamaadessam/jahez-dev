"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { getQuestionTranslation, type DifficultyLevel, type InterviewQuestion, type Topic, type Locale } from "../../content/questions";
import { difficultyOptions, filterInterviewQuestions } from "../../content/question-search";
import { AnswerContent } from "../answer-content";
import { AnswerDisclosure, QuestionControls } from "../question-controls";
import { formatNumber, localizedHref, messages, topicName } from "../../i18n";
import { scopeCatalogue } from "../../tracks/active-track";
import { ActiveTrackRecovery, ActiveTrackSelector, useActiveTrack } from "../active-track";
import { LoadingPlaceholder } from "../loading-placeholder";
import { InterviewHistory } from "../interviews/interview-history";
import { createInterview, findResumableInterview, getSavedInterviews, updateInterview, type SavedInterview } from "../../study/interviews";
import { getSavedQuestions, type SavedQuestions } from "../../study/progress";

type InterviewSelection = { topicValues: string[]; difficulty: DifficultyLevel | ""; invalidTopics: boolean; started: boolean; sessionId: string | null };

function readSelection(search: string, availableTopics: Topic[]): InterviewSelection {
  const params = new URLSearchParams(search);
  const values = (params.get("topics") ?? params.get("topic") ?? "").split(",").filter(Boolean);
  const topicValues = [...new Set(values.filter((value) => availableTopics.some((topic) => topic.slug === value || topic.id === value)))];
  const difficulty = params.get("difficulty");
  return {
    topicValues,
    difficulty: difficulty && difficultyOptions.includes(difficulty as DifficultyLevel) ? difficulty as DifficultyLevel : "",
    invalidTopics: values.length !== topicValues.length,
    started: params.get("started") === "1",
    sessionId: params.get("session"),
  };
}

function updateUrl(selection: InterviewSelection, track: string | null) {
  const params = new URLSearchParams();
  if (selection.topicValues.length) params.set("topics", selection.topicValues.join(","));
  if (selection.difficulty) params.set("difficulty", selection.difficulty);
  if (selection.started) params.set("started", "1");
  if (selection.sessionId) params.set("session", selection.sessionId);
  if (track) params.set("track", track);
  const cleanPathname = window.location.pathname.replace(/\/+$/, "") || "/";
  const query = params.toString();
  window.history.replaceState(null, "", `${cleanPathname}${query ? `?${query}` : ""}`);
  window.dispatchEvent(new Event("urlchange"));
}

export function FullInterview({ questions, topics, locale = "ar" }: { questions: InterviewQuestion[]; topics: Topic[]; locale?: Locale }) {
  const copy = messages[locale];
  const [selection, setSelection] = useState<InterviewSelection>({ topicValues: [], difficulty: "", invalidTopics: false, started: false, sessionId: null });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);
  const [savedInterviews, setSavedInterviews] = useState<SavedInterview[]>([]);
  const [savedQuestions, setSavedQuestions] = useState<SavedQuestions>({});
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const { phase, activeTrack, invalidTrack, trackOnlyHref } = useActiveTrack();
  const scoped = useMemo(() => activeTrack ? scopeCatalogue(activeTrack.id, null, topics, questions) : null, [activeTrack, questions, topics]);
  const activeSession = selection.sessionId ? savedInterviews.find((interview) => interview.id === selection.sessionId) : undefined;

  useEffect(() => {
    if (!validationError) return;
    const timer = setTimeout(() => setValidationError(null), 5000);
    return () => clearTimeout(timer);
  }, [validationError]);

  useEffect(() => {
    function syncFromUrl() {
      const parsed = readSelection(window.location.search, scoped?.topics ?? []);
      const stored = getSavedInterviews(localStorage);
      const session = parsed.sessionId ? stored.find((interview) => interview.id === parsed.sessionId && interview.trackId === activeTrack?.id) : undefined;
      setSavedInterviews(stored);
      setSavedQuestions(getSavedQuestions(localStorage));
      if (session) {
        setSelection({ topicValues: session.topicSlugs, difficulty: session.difficulty, invalidTopics: false, started: true, sessionId: session.id });
        setCurrentIndex(Math.min(session.currentIndex, Math.max(0, session.questionIds.length - 1)));
      } else {
        setSelection(parsed);
        setCurrentIndex(0);
      }
    }
    syncFromUrl();
    setIsHydrated(true);
    window.addEventListener("popstate", syncFromUrl);
    window.addEventListener("urlchange", syncFromUrl);
    const refreshState = () => {
      setSavedQuestions(getSavedQuestions(localStorage));
      setSavedInterviews(getSavedInterviews(localStorage));
    };
    window.addEventListener("study-state-change", refreshState);
    window.addEventListener("study-state-merged", refreshState);
    return () => {
      window.removeEventListener("popstate", syncFromUrl);
      window.removeEventListener("urlchange", syncFromUrl);
      window.removeEventListener("study-state-change", refreshState);
      window.removeEventListener("study-state-merged", refreshState);
    };
  }, [activeTrack, scoped]);

  const preparedQuestions = selection.topicValues.length && selection.difficulty
    ? filterInterviewQuestions(scoped?.questions ?? [], selection.topicValues, selection.difficulty, scoped?.topics ?? [])
    : [];
  const sessionQuestions = activeSession
    ? activeSession.questionIds.map((id) => scoped?.questions.find((candidate) => candidate.id === id)).filter((candidate): candidate is InterviewQuestion => Boolean(candidate))
    : preparedQuestions;
  const question = selection.started ? sessionQuestions[currentIndex] : undefined;
  const sessionStats = sessionQuestions.reduce((result, candidate) => {
    result[savedQuestions[candidate.id]?.progress ?? "not-started"] += 1;
    return result;
  }, { "not-started": 0, reviewing: 0, mastered: 0 });

  function updateSelection(update: Partial<InterviewSelection>) {
    setValidationError(null);
    const next = { ...selection, ...update, invalidTopics: false, started: false, sessionId: null };
    setSelection(next);
    setCurrentIndex(0);
    updateUrl(next, activeTrack?.slug ?? null);
  }

  function handleStart() {
    if (!selection.topicValues.length && !selection.difficulty) {
      setValidationError(copy.interviewValidationMissingBoth);
      triggerShake();
      return;
    }
    if (!selection.topicValues.length) {
      setValidationError(copy.interviewValidationMissingTopics);
      triggerShake();
      return;
    }
    if (!selection.difficulty) {
      setValidationError(copy.interviewValidationMissingLevel);
      triggerShake();
      return;
    }
    if (!preparedQuestions.length) {
      setValidationError(copy.interviewNoQuestionsHint);
      triggerShake();
      return;
    }
    setValidationError(null);
    startInterview();
  }

  function triggerShake() {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  }

  function openFilterDialog() {
    setValidationError(null);
    document.querySelector<HTMLButtonElement>(".active-track-selector .filter-trigger")?.click();
  }

  function startInterview() {
    if (!selection.topicValues.length || !selection.difficulty) return;
    const resumable = activeTrack ? findResumableInterview(savedInterviews, { trackId: activeTrack.id, topicSlugs: selection.topicValues, difficulty: selection.difficulty }) : undefined;
    const session = resumable ?? (activeTrack ? createInterview(localStorage, {
      trackId: activeTrack.id,
      trackSlug: activeTrack.slug,
      topicSlugs: selection.topicValues,
      difficulty: selection.difficulty,
      questionIds: preparedQuestions.map((candidate) => candidate.id),
    }) : undefined);
    if (!session) return;
    const next = { ...selection, started: true, sessionId: session.id };
    setSelection(next);
    setSavedInterviews(getSavedInterviews(localStorage));
    setCurrentIndex(resumable?.currentIndex ?? 0);
    updateUrl(next, activeTrack?.slug ?? null);
  }

  function moveToQuestion(index: number) {
    setCurrentIndex(index);
    if (selection.sessionId) {
      const updated = updateInterview(localStorage, selection.sessionId, { currentIndex: index });
      if (updated) setSavedInterviews((current) => current.map((interview) => interview.id === updated.id ? updated : interview));
    }
  }

  function completeInterview() {
    if (!selection.sessionId) return;
    const updated = updateInterview(localStorage, selection.sessionId, { currentIndex: Math.max(0, sessionQuestions.length - 1), completed: true });
    if (updated) setSavedInterviews((current) => current.map((interview) => interview.id === updated.id ? updated : interview));
  }

  function toggleTopic(topic: Topic, checked: boolean) {
    const topicValues = checked
      ? [...selection.topicValues, topic.slug]
      : selection.topicValues.filter((value) => value !== topic.slug && value !== topic.id);
    updateSelection({ topicValues });
  }

  if (!isHydrated) return <section className="shell section"><LoadingPlaceholder variant="interview" /></section>;

  return (
    <section className="shell section interview-page">
      <header className="page-header">
        <Link className="text-link" href={localizedHref(locale, trackOnlyHref("/questions"))}>{copy.backLibrary}</Link>
        <span className="eyebrow">{copy.interviewEyebrow}</span>
        <h1>{copy.interviewTitle}</h1>
        <p>{copy.interviewDescription}</p>
      </header>

      {validationError && (
        <div className="interview-toast-container" role="alert" aria-live="assertive">
          <div className="interview-toast">
            <span className="interview-toast-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </span>
            <div className="interview-toast-content">
              <p className="interview-toast-message">{validationError}</p>
            </div>
            <button className="button sm interview-toast-action" type="button" onClick={openFilterDialog}>
              {copy.interviewOpenFilterAction}
            </button>
            <button className="interview-toast-close" type="button" onClick={() => setValidationError(null)} aria-label={copy.close}>
              ×
            </button>
          </div>
        </div>
      )}

      {phase !== "ready" || invalidTrack || !activeTrack ? null : selection.invalidTopics ? <ActiveTrackRecovery locale={locale} invalidTopic /> : !scoped?.topics.length ? <div className="empty-state"><h2>{copy.emptyTrackTitle}</h2><p>{copy.emptyTrackDescription}</p></div> : <>
      <ActiveTrackSelector
        locale={locale}
        filterTitle={copy.interviewTitle}
        filterSummary={`${activeTrack?.name ?? ""} · ${selection.topicValues.length ? `${selection.topicValues.length} ${copy.selected}${selection.difficulty ? ` · ${selection.difficulty}` : ""}` : copy.chooseTopics}`}
        filterActiveCount={selection.topicValues.length + (selection.difficulty ? 1 : 0)}
        onClear={() => updateSelection({ topicValues: [], difficulty: "" })}
        filterContent={() => <div className="filter-dialog-fields interview-filter-fields">
          <fieldset className="topic-picker">
            <legend className="sr-only">{copy.chooseTopics} <span className="topic-count">{selection.topicValues.length} {copy.selected}</span></legend>
            <div className="topic-picker-toolbar">
              <div className="topic-picker-title-wrap">
                <span className="topic-picker-title">{copy.chooseTopics}</span>
                <span className="topic-count-badge" aria-live="polite">
                  {selection.topicValues.length} / {scoped.topics.length} {copy.selected}
                </span>
              </div>
              <div className="topic-quick-actions">
                <button
                  type="button"
                  className="topic-action-pill"
                  onClick={() => updateSelection({ topicValues: scoped.topics.map((t) => t.slug) })}
                >
                  {copy.selectAll}
                </button>
                <button
                  type="button"
                  className="topic-action-pill"
                  onClick={() => updateSelection({ topicValues: [] })}
                >
                  {copy.clearAll}
                </button>
              </div>
            </div>

            <div className="topic-options">
              {scoped.topics.map((topic) => {
                const selected = selection.topicValues.includes(topic.slug) || selection.topicValues.includes(topic.id);
                return <label key={topic.id} className={`topic-option${selected ? " selected" : ""}`} dir="ltr">
                  <input className="sr-only" type="checkbox" checked={selected} onChange={(event) => toggleTopic(topic, event.target.checked)} />
                  <span className="topic-option-copy"><strong>{topicName(locale, topic.id)}</strong></span>
                  <span className="topic-option-mark" aria-hidden="true">{selected ? "✓" : ""}</span>
                </label>;
              })}
            </div>
          </fieldset>

          <div className="difficulty-tier-section">
            <div className="difficulty-tier-heading">
              <span className="difficulty-tier-title">{copy.interviewLevel}</span>
              {selection.difficulty && (
                <span className="difficulty-tier-badge" data-level={selection.difficulty.toLowerCase()}>
                  {selection.difficulty}
                </span>
              )}
            </div>

            {/* Native label & select for screen readers and Playwright tests */}
            <label className="interview-level-native-label">
              <span className="sr-only">{copy.interviewLevel}</span>
              <select
                className="interview-level-native-select"
                value={selection.difficulty}
                onChange={(event) => updateSelection({ difficulty: event.target.value as InterviewSelection["difficulty"] })}
              >
                <option value="">{copy.chooseDifficulty}</option>
                {difficultyOptions.map((difficulty) => <option key={difficulty} value={difficulty}>{difficulty}</option>)}
              </select>
            </label>

            {/* Visual 3-Tier Difficulty Cards */}
            <div className="difficulty-tier-cards">
              {difficultyOptions.map((difficulty) => {
                const isSelected = selection.difficulty === difficulty;
                const meta = {
                  Junior: {
                    dots: "● ○ ○",
                    label: copy.juniorLabel,
                    desc: copy.juniorDesc,
                  },
                  Mid: {
                    dots: "● ● ○",
                    label: copy.midLabel,
                    desc: copy.midDesc,
                  },
                  Senior: {
                    dots: "● ● ●",
                    label: copy.seniorLabel,
                    desc: copy.seniorDesc,
                  },
                }[difficulty];

                return (
                  <button
                    key={difficulty}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    className={`difficulty-card diff-${difficulty.toLowerCase()}${isSelected ? " selected" : ""}`}
                    onClick={() => updateSelection({ difficulty: isSelected ? "" : difficulty })}
                  >
                    <div className="difficulty-card-top">
                      <span className="difficulty-card-pill">{difficulty}</span>
                      <span className="difficulty-card-meter" aria-hidden="true">{meta?.dots}</span>
                    </div>
                    <div className="difficulty-card-body">
                      {locale === "ar" && <strong className="difficulty-card-ar">{meta?.label}</strong>}
                      <span className="difficulty-card-desc">{meta?.desc}</span>
                    </div>
                    <div className="difficulty-card-radio" aria-hidden="true">
                      <span className="difficulty-card-radio-dot" />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="filter-inclusive-callout">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>{copy.inclusiveHint}</span>
            </div>
          </div>
        </div>}
        action={<>
          <button
            className={`button primary interview-start-button${isShaking ? " shake-animation" : ""}`}
            type="button"
            onClick={handleStart}
          >
            {copy.startInterview}
          </button>
          {selection.started && <span className="interview-status">{copy.question} {currentIndex + 1} {copy.of} {sessionQuestions.length}</span>}
        </>}
      />

      {question ? (
        <>
          {activeSession && <div className="interview-session-summary" aria-live="polite">
            <div><strong>{activeSession.completed ? copy.interviewDone : copy.interviewInProgress}</strong><span>{copy.interviewLastOpened}: {activeSession.updatedAt.slice(0, 10)}</span></div>
            <div className="interview-session-stats"><span>{copy.notStarted}: {sessionStats["not-started"]}</span><span>{copy.reviewing}: {sessionStats.reviewing}</span><span>{copy.mastered}: {sessionStats.mastered}</span></div>
          </div>}
          <div className="session-progress" aria-live="polite">{copy.question} {currentIndex + 1} {copy.of} {sessionQuestions.length}</div>
          <article className="question-body session-question">
            <div className="meta">
              {scoped.topics.filter((topic) => question.topicIds.includes(topic.id) && selection.topicValues.includes(topic.slug)).map((topic) => <span className="chip" key={topic.id} dir="ltr">{topicName(locale, topic.id)}</span>)}
              <span className="chip">{question.difficulty}</span>
            </div>
            <h2>{getQuestionTranslation(question, locale).question}</h2>
            <div key={question.id}>
              <QuestionControls questionId={question.id} locale={locale} />
              <AnswerDisclosure locale={locale}><AnswerContent question={question} locale={locale} /></AnswerDisclosure>
            </div>
          </article>
          <nav className="session-navigation" aria-label={copy.interviewTitle}>
            <button className="button" type="button" disabled={currentIndex === 0} onClick={() => moveToQuestion(currentIndex - 1)}>{copy.previous}</button>
            <button className="button primary" type="button" onClick={() => currentIndex === sessionQuestions.length - 1 ? completeInterview() : moveToQuestion(currentIndex + 1)}>{currentIndex === sessionQuestions.length - 1 ? copy.finishInterview : copy.next}</button>
          </nav>
        </>
      ) : null}
      </>}
      {!selection.started && <InterviewHistory locale={locale} embedded activeTrackId={activeTrack?.id} />}
    </section>
  );
}
