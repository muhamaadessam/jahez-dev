"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getQuestionTranslation, type InterviewQuestion, type Topic, type DifficultyLevel, type Locale } from "../../content/questions";
import { difficultyOptions, fromSearchParams, questionHasTopic } from "../../content/question-search";
import { AnswerContent } from "../answer-content";
import { AnswerDisclosure, QuestionControls } from "../question-controls";
import { localizedHref, messages, topicName } from "../../i18n";
import { scopeCatalogue } from "../../tracks/active-track";
import { ActiveTrackRecovery, ActiveTrackSelector, useActiveTrack } from "../active-track";
import { FilterDialog } from "../filter-dialog";
import { LoadingPlaceholder } from "../loading-placeholder";

type SessionSelection = { topic: string; difficulty: DifficultyLevel | ""; started: boolean };

export function StudySession({ questions, topics, locale = "ar" }: { questions: InterviewQuestion[]; topics: Topic[]; locale?: Locale }) {
  const copy = messages[locale];
  const [selection, setSelection] = useState<SessionSelection>({ topic: "", difficulty: "", started: false });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);
  const { phase, activeTrack, invalidTrack, trackOnlyHref } = useActiveTrack();

  useEffect(() => {
    function syncFromUrl() {
      const parsed = fromSearchParams(new URLSearchParams(window.location.search));
      setSelection({ topic: parsed.topic, difficulty: parsed.difficulty, started: new URLSearchParams(window.location.search).get("started") === "1" });
      setCurrentIndex(0);
    }
    syncFromUrl();
    setIsHydrated(true);

    window.addEventListener("popstate", syncFromUrl);
    window.addEventListener("urlchange", syncFromUrl);
    return () => { window.removeEventListener("popstate", syncFromUrl); window.removeEventListener("urlchange", syncFromUrl); };
  }, []);

  const scoped = activeTrack ? scopeCatalogue(activeTrack.id, selection.topic, topics, questions) : null;
  const selectedTopic = scoped?.topics.find((candidate) => candidate.slug === selection.topic || candidate.id === selection.topic);
  const sessionQuestions = selection.topic && selection.difficulty && selectedTopic && scoped
    ? scoped.questions.filter((question) => questionHasTopic(question, selectedTopic.slug, scoped.topics) && question.difficulty === selection.difficulty)
    : [];
  const question = selection.started ? sessionQuestions[currentIndex] : undefined;

  function updateSelection(update: Partial<SessionSelection>) {
    const next = { ...selection, ...update, started: false };
    setSelection(next);
    setCurrentIndex(0);
    const params = new URLSearchParams();
    if (next.topic) params.set("topic", next.topic);
    if (next.difficulty) params.set("difficulty", next.difficulty);
    if (next.started) params.set("started", "1");
    if (activeTrack) params.set("track", activeTrack.slug);
    const cleanPathname = window.location.pathname.replace(/\/+$/, "") || "/";
    const query = params.toString();
    window.history.replaceState(null, "", `${cleanPathname}${query ? `?${query}` : ""}`);
    window.dispatchEvent(new Event("urlchange"));
  }

  function startSession() {
    if (!selection.topic || !selection.difficulty) return;
    const next = { ...selection, started: true };
    setSelection(next);
    setCurrentIndex(0);
    const params = new URLSearchParams();
    params.set("topic", next.topic);
    params.set("difficulty", next.difficulty);
    if (activeTrack) params.set("track", activeTrack.slug);
    params.set("started", "1");
    const cleanPathname = window.location.pathname.replace(/\/+$/, "") || "/";
    window.history.replaceState(null, "", `${cleanPathname}?${params}`);
    window.dispatchEvent(new Event("urlchange"));
  }

  if (!isHydrated) return <section className="shell section"><LoadingPlaceholder variant="session" /></section>;

  return (
    <section className="shell section">
      <header className="page-header">
        <Link className="text-link" href={localizedHref(locale, trackOnlyHref("/questions"))}>{copy.backLibrary}</Link>
        <h1>{copy.sessionTitle}</h1>
        <p>{copy.sessionDescription}</p>
      </header>

      <ActiveTrackSelector locale={locale} />
      {phase !== "ready" || invalidTrack || !activeTrack ? null : scoped?.invalidTopic ? <ActiveTrackRecovery locale={locale} invalidTopic /> : !scoped?.topics.length ? <div className="empty-state"><h2>{copy.emptyTrackTitle}</h2><p>{copy.emptyTrackDescription}</p></div> : <>

      <div className="session-filters">
        <FilterDialog locale={locale} title={copy.sessionTitle} summary={selection.topic && selection.difficulty ? `${topicName(locale, selectedTopic?.id ?? selection.topic)} · ${selection.difficulty}` : copy.chooseTopic} activeCount={(selection.topic ? 1 : 0) + (selection.difficulty ? 1 : 0)} onClear={() => updateSelection({ topic: "", difficulty: "" })}>
          {() => <div className="filter-dialog-fields">
            <label>
              {copy.topic}
              <select value={selection.topic} onChange={(event) => updateSelection({ topic: event.target.value })}>
                <option value="">{copy.chooseTopic}</option>
                {scoped.topics.map((topic) => <option key={topic.id} value={topic.slug} dir="ltr">{topicName(locale, topic.id)}</option>)}
              </select>
            </label>
            <label>
              {copy.difficulty}
              <select value={selection.difficulty} onChange={(event) => updateSelection({ difficulty: event.target.value as SessionSelection["difficulty"] })}>
                <option value="">{copy.chooseDifficulty}</option>
                {difficultyOptions.map((difficulty) => <option key={difficulty} value={difficulty}>{difficulty}</option>)}
              </select>
            </label>
          </div>}
        </FilterDialog>
        <button className="button primary" type="button" disabled={!selection.topic || !selection.difficulty} onClick={startSession}>{copy.startStudy}</button>
      </div>

      {question ? (
        <>
          <div className="session-progress" aria-live="polite">{copy.question} {currentIndex + 1} {copy.of} {sessionQuestions.length}</div>
          <article className="question-body session-question">
            <div className="meta"><span className="chip">{selection.difficulty}</span></div>
            <h2>{getQuestionTranslation(question, locale).question}</h2>
            <div key={question.id}>
              <QuestionControls questionId={question.id} locale={locale} />
              <AnswerDisclosure locale={locale}><AnswerContent question={question} locale={locale} /></AnswerDisclosure>
            </div>
          </article>
          <nav className="session-navigation" aria-label={copy.sessionTitle}>
            <button className="button" type="button" disabled={currentIndex === 0} onClick={() => setCurrentIndex((index) => index - 1)}>{copy.previous}</button>
            <button className="button primary" type="button" disabled={currentIndex === sessionQuestions.length - 1} onClick={() => setCurrentIndex((index) => index + 1)}>{copy.next}</button>
          </nav>
        </>
      ) : (
        <div className="empty-state"><h2>{selection.topic || selection.difficulty ? copy.noCombination : copy.startStudy}</h2><p>{copy.selectSession}</p></div>
      )}
      </>}
    </section>
  );
}
