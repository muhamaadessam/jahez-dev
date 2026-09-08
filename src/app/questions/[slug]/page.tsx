import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getQuestion, getQuestionTopics, getQuestionTranslation, questions } from "../../../content/questions";
import { AnswerContent } from "../../answer-content";
import { AnswerDisclosure, QuestionControls } from "../../question-controls";
import { formatDate, messages, topicName, type Locale } from "../../../i18n";
import { localizedMetadata } from "../../metadata";
import { ActiveTrackLink, TrackContextGuard } from "../../active-track";
import { ogImagePath, siteName, siteUrl } from "../../site-config";
import { StructuredData } from "../../structured-data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return questions.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const question = getQuestion((await params).slug);
  return question
    ? localizedMetadata("ar", `/questions/${question.slug}`, question.question, question.shortAnswer)
    : { title: "السؤال غير موجود" };
}

export default async function QuestionDetailsPage({ params, locale = "ar" }: Props & { locale?: Locale }) {
  const question = getQuestion((await params).slug);
  if (!question) notFound();
  const copy = messages[locale];
  const translation = getQuestionTranslation(question, locale);
  const questionUrl = `${siteUrl}/${locale}/questions/${question.slug}`;
  const questionTopics = getQuestionTopics(question);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": `${questionUrl}#article`,
        url: questionUrl,
        headline: translation.question,
        description: translation.shortAnswer,
        image: `${siteUrl}${ogImagePath}`,
        dateModified: question.lastReviewedAt,
        inLanguage: locale,
        educationalLevel: question.difficulty,
        about: questionTopics.map((topic) => topicName(locale, topic.id)),
        author: { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: siteName, url: siteUrl },
        publisher: { "@id": `${siteUrl}/#organization` },
        isPartOf: { "@id": `${siteUrl}/#website` },
        citation: translation.sources.map((source) => source.url),
        mainEntity: {
          "@type": "Question",
          name: translation.question,
          acceptedAnswer: { "@type": "Answer", text: `${translation.shortAnswer}\n\n${translation.explanation}` },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: siteName, item: `${siteUrl}/${locale}` },
          { "@type": "ListItem", position: 2, name: copy.libraryTitle, item: `${siteUrl}/${locale}/questions` },
          { "@type": "ListItem", position: 3, name: translation.question, item: questionUrl },
        ],
      },
    ],
  };

  return <TrackContextGuard locale={locale} trackId={question.trackId}>
    <StructuredData data={jsonLd} />
    <section className="shell section">
      <header className="page-header">
        <ActiveTrackLink className="text-link" locale={locale} path="/questions">{copy.backLibrary}</ActiveTrackLink>
        <div className="meta">
          {questionTopics.map((topic) => (
            <span className="chip" key={topic.id} dir="ltr">{topicName(locale, topic.id)}</span>
          ))}
          <span className="chip">{question.difficulty}</span>
        </div>
        <h1>{translation.question}</h1>
      </header>
      <div className="question-layout">
        <article className="question-body">
          <QuestionControls questionId={question.id} locale={locale} />
          <AnswerDisclosure key={question.id} locale={locale}><AnswerContent question={question} locale={locale} /></AnswerDisclosure>
        </article>
        <aside className="side-note">
          <b>{copy.lastReviewed}</b>
          <div>{formatDate(question.lastReviewedAt, locale)}</div>
          <p>{copy.staleReview}</p>
        </aside>
      </div>
    </section>
  </TrackContextGuard>;
}
