import { execSync } from "node:child_process";
import { writeFileSync, unlinkSync } from "node:fs";
import { resolve } from "node:path";
import { questions, topicTranslations, topics, tracks, type InterviewQuestion } from "../src/content/questions.ts";
import { staticFollowUpTargets } from "../src/content/follow-up-relations.ts";

function sql(value: string): string {
  return `'${value.replaceAll("'", "''")}'`;
}

function json(value: unknown): string {
  return `${sql(JSON.stringify(value))}::jsonb`;
}

function nullable(value: string | undefined): string {
  return value === undefined ? "null" : sql(value);
}

function driftCheckSql(question: InterviewQuestion, locale: "ar" | "en"): string {
  const translation = question.translations?.[locale];
  if (!translation) throw new Error(`Question ${question.id} is missing ${locale} translation`);
  const changed = [
    `l.question is distinct from ${sql(translation.question)}`,
    `l.short_answer is distinct from ${sql(translation.shortAnswer)}`,
    `l.explanation is distinct from ${sql(translation.explanation)}`,
    `l.code_example is distinct from ${nullable(translation.codeExample)}`,
    `l.common_mistakes is distinct from ${json(translation.commonMistakes ?? [])}`,
    `l.follow_up_questions is distinct from ${json(translation.followUpQuestions ?? [])}`,
    `l.sources is distinct from ${json(translation.sources)}`,
  ].join(" or ");
  return `do $$ begin if exists (select 1 from public.question_revision_locales l join public.question_revisions r on r.id = l.revision_id where r.question_id = ${sql(question.id)} and r.revision_number = 1 and l.locale = '${locale}' and (${changed})) then raise exception 'Question ${question.id} ${locale} content changed; create a new revision before seeding'; end if; end $$;`;
}

function revisionSql(question: InterviewQuestion): string {
  const translations = question.translations;
  if (!translations?.ar || !translations.en) throw new Error(`Question ${question.id} is missing ar/en translations`);
  return [
    `insert into public.interview_questions (id, slug, track_id, difficulty) values (${sql(question.id)}, ${sql(question.slug)}, ${sql(question.trackId)}, ${sql(question.difficulty)}) on conflict (id) do update set slug = excluded.slug, track_id = excluded.track_id, difficulty = excluded.difficulty;`,
    `insert into public.question_revisions (question_id, revision_number, status, reviewed_at) values (${sql(question.id)}, 1, 'draft', ${sql(question.lastReviewedAt)}) on conflict (question_id, revision_number) do nothing;`,
    ...(["ar", "en"] as const).map((locale) => {
      const translation = translations[locale];
      return `insert into public.question_revision_locales (revision_id, locale, question, short_answer, explanation, code_example, common_mistakes, follow_up_questions, sources) select r.id, '${locale}', ${sql(translation.question)}, ${sql(translation.shortAnswer)}, ${sql(translation.explanation)}, ${nullable(translation.codeExample)}, ${json(translation.commonMistakes ?? [])}, ${json(translation.followUpQuestions ?? [])}, ${json(translation.sources)} from public.question_revisions r where r.question_id = ${sql(question.id)} and r.revision_number = 1 on conflict (revision_id, locale) do nothing;\n${driftCheckSql(question, locale)}`;
    }),
    ...question.topicIds.map((topicId) => `insert into public.question_topics (question_id, topic_id) values (${sql(question.id)}, ${sql(topicId)}) on conflict (question_id, topic_id) do nothing;`),
    `update public.question_revisions set status = 'published' where question_id = ${sql(question.id)} and revision_number = 1 and status = 'draft';`,
    `update public.interview_questions set published_revision_id = (select id from public.question_revisions where question_id = ${sql(question.id)} and revision_number = 1 and status = 'published') where id = ${sql(question.id)} and exists (select 1 from public.question_revisions where question_id = ${sql(question.id)} and revision_number = 1 and status = 'published');`,
  ].join("\n");
}

function followUpRelationsSql(targetTrack?: string): string[] {
  const pool = targetTrack ? questions.filter((q) => q.trackId === targetTrack) : questions;
  return pool.flatMap((question) => (staticFollowUpTargets[question.id] ?? []).flatMap((targetId, index) => {
    const target = questions.find((candidate) => candidate.id === targetId);
    if (!target || target.trackId !== question.trackId) throw new Error(`Invalid follow-up target ${question.id} -> ${targetId}`);
    return `insert into public.question_follow_ups (source_revision_id, target_question_id, position) select source.id, ${sql(target.id)}, ${index + 1} from public.question_revisions source join public.interview_questions target on target.id = ${sql(target.id)} where source.question_id = ${sql(question.id)} and source.revision_number = 1 and source.status = 'published' and target.published_revision_id is not null on conflict (source_revision_id, target_question_id) do nothing;`;
  }));
}

function executeChunk(name: string, sqlStatements: string[]) {
  const tmpFile = resolve(process.cwd(), "supabase/.tmp_chunk.sql");
  const fullSql = `begin;\n\n${sqlStatements.join("\n\n")}\n\ncommit;\n`;
  writeFileSync(tmpFile, fullSql, "utf8");

  console.log(`Executing batch: ${name} (${(fullSql.length / 1024).toFixed(1)} KB)...`);
  try {
    const output = execSync(`supabase db query --linked -f "${tmpFile}"`, { encoding: "utf8" });
    if (output.includes('"_tag":"Error"')) {
      throw new Error(`Supabase query error: ${output}`);
    }
  } finally {
    try { unlinkSync(tmpFile); } catch {}
  }
}

async function main() {
  const targetTrack = process.argv[2];
  const targetQuestions = targetTrack ? questions.filter((q) => q.trackId === targetTrack) : questions;
  console.log(`Starting remote database seeding for ${tracks.length} tracks and ${targetQuestions.length} questions (targetTrack: ${targetTrack ?? "all"})...`);

  // 1. Tracks and Topics
  const trackStatements = tracks.flatMap((track) => [
    `insert into public.tracks (id, slug) values (${sql(track.id)}, ${sql(track.slug)}) on conflict (id) do update set slug = excluded.slug;`,
    ...(["ar", "en"] as const).map((locale) => `insert into public.track_locales (track_id, locale, name) values (${sql(track.id)}, '${locale}', ${sql(track.name)}) on conflict (track_id, locale) do update set name = excluded.name;`),
  ]);

  const topicStatements = topics.flatMap((topic) => [
    `insert into public.topics (id, slug, track_id) values (${sql(topic.id)}, ${sql(topic.slug)}, ${sql(topic.trackId)}) on conflict (id) do update set slug = excluded.slug, track_id = excluded.track_id;`,
    ...(["ar", "en"] as const).map((locale) => `insert into public.topic_locales (topic_id, locale, name) values (${sql(topic.id)}, '${locale}', ${sql(topicTranslations[locale][topic.id] ?? topic.name)}) on conflict (topic_id, locale) do update set name = excluded.name;`),
  ]);

  executeChunk("Tracks and Topics", [...trackStatements, ...topicStatements]);

  // 2. Questions in chunks of 25 questions
  const BATCH_SIZE = 25;
  for (let i = 0; i < targetQuestions.length; i += BATCH_SIZE) {
    const batch = targetQuestions.slice(i, i + BATCH_SIZE);
    const batchStatements = batch.map(revisionSql);
    const startNum = i + 1;
    const endNum = Math.min(i + BATCH_SIZE, targetQuestions.length);
    executeChunk(`Questions ${startNum}-${endNum} of ${targetQuestions.length}`, batchStatements);
  }

  // 3. Follow-up relations
  const followUps = followUpRelationsSql(targetTrack);
  if (followUps.length > 0) {
    executeChunk("Follow-up relations", followUps);
  }

  console.log("Remote database seeding completed successfully!");
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
