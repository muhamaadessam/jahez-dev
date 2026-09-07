import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { InterviewQuestion } from "../src/content/questions.ts";
import { topic1Questions } from "./ui-ux/topic-1.ts";
import { topic2Questions } from "./ui-ux/topic-2.ts";
import { topic3Questions } from "./ui-ux/topic-3.ts";
import { topic4Questions } from "./ui-ux/topic-4.ts";
import { topic5Questions } from "./ui-ux/topic-5.ts";
import { topic6Questions } from "./ui-ux/topic-6.ts";
import { topic7Questions } from "./ui-ux/topic-7.ts";
import { topic8Questions } from "./ui-ux/topic-8.ts";
import { topic9Questions } from "./ui-ux/topic-9.ts";
import { topic10Questions } from "./ui-ux/topic-10.ts";

const allRawQuestions = [
  ...topic1Questions,
  ...topic2Questions,
  ...topic3Questions,
  ...topic4Questions,
  ...topic5Questions,
  ...topic6Questions,
  ...topic7Questions,
  ...topic8Questions,
  ...topic9Questions,
  ...topic10Questions,
];

console.log(`Total raw UI/UX questions gathered: ${allRawQuestions.length}`);

// Validation checks
const ids = new Set<string>();
const slugs = new Set<string>();
const topicCounts: Record<string, number> = {};

for (const q of allRawQuestions) {
  const [id, slug, topicId] = q;
  if (ids.has(id)) throw new Error(`Duplicate question id: ${id}`);
  ids.add(id);
  if (slugs.has(slug)) throw new Error(`Duplicate question slug: ${slug}`);
  slugs.add(slug);
  topicCounts[topicId] = (topicCounts[topicId] || 0) + 1;
}

console.log("Topic distribution:", topicCounts);

const targetQuestions: Omit<InterviewQuestion, "translations">[] = allRawQuestions.map((q) => {
  const [id, slug, topicId, difficulty, question, shortAnswer, explanation, codeExample, commonMistakes, followUpQuestions, sourceTitle, sourceUrl] = q;
  return {
    id,
    slug,
    trackId: "ui-ux",
    topicIds: [topicId],
    difficulty,
    question,
    shortAnswer,
    explanation,
    ...(codeExample ? { codeExample } : {}),
    commonMistakes,
    followUpQuestions,
    sources: [
      {
        title: sourceTitle,
        url: sourceUrl,
      },
    ],
    lastReviewedAt: "2026-09-07",
  };
});

const outputPath = resolve(process.cwd(), "src/content/ui-ux-questions.ts");
const fileContent = `import type { InterviewQuestion } from "./questions.ts";

export const uiUxBaseQuestions: Omit<InterviewQuestion, "translations">[] = ${JSON.stringify(targetQuestions, null, 2)};
`;

writeFileSync(outputPath, fileContent, "utf8");
console.log(`Successfully wrote ${targetQuestions.length} questions to ${outputPath}`);
