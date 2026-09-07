import { fetchUpstream } from "./upstream.ts";
import { validateImportedQuestion, type ImportedQuestion } from "../../src/submissions/validation.ts";

const cors = {
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

function response(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: cors });
}

async function pseudonymousUserId(userId: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(userId));
  return `user:${Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
}

function config(): { url: string; key: string } {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("server_configuration_error");
  return { url, key };
}

type FetchLike = typeof fetch;

async function db(path: string, key: string, init: RequestInit = {}, fetchImpl: FetchLike = fetch): Promise<Response> {
  const result = await fetchUpstream(fetchImpl, `${process.env.SUPABASE_URL?.replace(/\/$/, "")}${path}`, {
    ...init,
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", ...(init.headers ?? {}) },
  });
  if (!result.ok) throw new Error("database_error");
  return result;
}

function text(value: unknown, max = 500): string | null {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, max) : null;
}

async function audit(key: string, actor: string, action: string, targetType: string, targetId: string | null, reason: string | null, metadata: Record<string, unknown>, fetchImpl: FetchLike): Promise<void> {
  await db("/rest/v1/moderation_audit_events", key, { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify([{ actor_user_id: await pseudonymousUserId(actor), action, target_type: targetType, target_id: targetId, reason, metadata }]) }, fetchImpl);
}

export async function handleModerator(request: Request, fetchImpl: FetchLike = fetch): Promise<Response> {
  const query = (path: string, key: string, init: RequestInit = {}) => db(path, key, init, fetchImpl);
  const actor = request.headers.get("x-account-id");
  if (!actor) return response({ error: "unauthenticated" }, 401);
  try {
    const { key } = config();
    const roles = await (await query(`/rest/v1/account_roles?select=role,suspended&user_id=eq.${encodeURIComponent(actor)}&limit=1`, key)).json() as Array<{ role?: string; suspended?: boolean }>;
    const configuredModerators = (process.env.MODERATOR_USER_IDS ?? "").split(",").map((id) => id.trim()).filter(Boolean);
    if ((!configuredModerators.includes(actor) && roles[0]?.role !== "moderator") || roles[0]?.suspended) return response({ error: "moderator_required" }, 403);
    const body = await request.json() as { action?: unknown; targetUserId?: unknown; submissionId?: unknown; questionId?: unknown; reason?: unknown; status?: unknown; targetQuestionIds?: unknown; mode?: unknown; document?: unknown };
    const action = text(body.action, 60);
    const reason = text(body.reason);
    if (!action) return response({ error: "payload_invalid" }, 400);
    if (action === "import_submission") {
      const submissionId = text(body.submissionId, 80);
      const mode = body.mode === "confirm" ? "confirm" : body.mode === "preview" ? "preview" : null;
      if (!submissionId || !mode) return response({ error: "payload_invalid" }, 400);
      let imported: ImportedQuestion;
      try {
        const raw = typeof body.document === "string" ? JSON.parse(body.document) : body.document;
        imported = validateImportedQuestion(raw);
      } catch (error) {
        return response({ error: error instanceof Error ? error.message : "import_invalid" }, 400);
      }
      const submissions = await (await query(`/rest/v1/submissions?select=id,status,track_id,display_name&id=eq.${encodeURIComponent(submissionId)}&limit=1`, key)).json() as Array<{ id: string; status: string; track_id: string; display_name: string | null }>;
      const submission = submissions[0];
      if (!submission) return response({ error: "not_found" }, 404);
      if (submission.track_id !== imported.trackId) return response({ error: "import_taxonomy_mismatch" }, 409);
      const topics = await (await query(`/rest/v1/topics?select=id,track_id&id=in.(${imported.topicIds.map(encodeURIComponent).join(",")})`, key)).json() as Array<{ id: string; track_id: string }>;
      if (topics.length !== imported.topicIds.length || topics.some((topic) => topic.track_id !== imported.trackId)) return response({ error: "import_taxonomy_mismatch" }, 409);
      if (imported.relatedQuestionSlugs.length) {
        const related = await (await query(`/rest/v1/interview_questions?select=slug&track_id=eq.${encodeURIComponent(imported.trackId)}&published_revision_id=not.is.null&slug=in.(${imported.relatedQuestionSlugs.map(encodeURIComponent).join(",")})`, key)).json() as Array<{ slug: string }>;
        if (related.length !== imported.relatedQuestionSlugs.length) return response({ error: "related_question_invalid" }, 409);
      }
      if (mode === "preview") return response({ ok: true, mode, question: imported });
      const payload = { ...imported, contributorUsername: submission.display_name ?? "Community contributor" };
      const published = await (await query("/rest/v1/rpc/publish_submission_for_moderator", key, { method: "POST", body: JSON.stringify({ p_actor_id: actor, p_submission_id: submissionId, p_imported: payload }) })).json() as Array<{ question_id?: string; question_slug?: string; submission_status?: string }>;
      const result = published[0];
      if (!result?.question_id || !result.question_slug) return response({ error: "publish_failed" }, 503);
      return response({ ok: true, mode, submissionId, status: result.submission_status, questionId: result.question_id, slug: result.question_slug });
    }
    if (action === "list_follow_up_editor") {
      const questions = await (await query("/rest/v1/interview_questions?select=id,slug,track_id,published_revision_id&published_revision_id=not.is.null&order=track_id,slug&limit=1000", key)).json() as Array<{ id?: string; slug?: string; track_id?: string; published_revision_id?: string }>;
      const relations = await (await query("/rest/v1/question_follow_ups?select=source_revision_id,target_question_id,position&order=position.asc&limit=5000", key)).json() as Array<{ source_revision_id?: string; target_question_id?: string; position?: number }>;
      return response({
        sources: questions.flatMap((question) => typeof question.id === "string" && typeof question.slug === "string" && typeof question.track_id === "string" && typeof question.published_revision_id === "string" ? [{ id: question.id, slug: question.slug, track_id: question.track_id, target_ids: relations.filter((relation) => relation.source_revision_id === question.published_revision_id).sort((a, b) => (a.position ?? 0) - (b.position ?? 0)).flatMap((relation) => typeof relation.target_question_id === "string" ? [relation.target_question_id] : []) }] : []),
        targets: questions.flatMap((question) => typeof question.id === "string" && typeof question.slug === "string" && typeof question.track_id === "string" ? [{ id: question.id, slug: question.slug, track_id: question.track_id }] : []),
      });
    }
    if (action === "save_follow_ups") {
      const questionId = text(body.questionId, 120);
      const targetIds = Array.isArray(body.targetQuestionIds) ? [...new Set(body.targetQuestionIds.flatMap((value) => typeof value === "string" ? [value.trim()] : []).filter(Boolean))] : null;
      if (!questionId || !targetIds || targetIds.length > 8) return response({ error: "payload_invalid" }, 400);
      const sourceRows = await (await query(`/rest/v1/interview_questions?select=id,track_id,published_revision_id&id=eq.${encodeURIComponent(questionId)}&published_revision_id=not.is.null&limit=1`, key)).json() as Array<{ id: string; track_id: string; published_revision_id: string }>;
      const source = sourceRows[0];
      if (!source) return response({ error: "question_not_published" }, 409);
      if (targetIds.length) {
        const targetRows = await (await query(`/rest/v1/interview_questions?select=id,track_id,published_revision_id&id=in.(${targetIds.map(encodeURIComponent).join(",")})&track_id=eq.${encodeURIComponent(source.track_id)}&published_revision_id=not.is.null`, key)).json() as Array<{ id: string }>;
        if (targetRows.length !== targetIds.length || targetIds.includes(questionId)) return response({ error: "follow_up_target_invalid" }, 409);
      }
      const currentLocales = await (await query(`/rest/v1/question_revision_locales?select=locale,question,short_answer,explanation,code_example,common_mistakes,follow_up_questions,sources&revision_id=eq.${encodeURIComponent(source.published_revision_id)}`, key)).json() as Array<Record<string, unknown>>;
      if (!currentLocales.some((locale) => locale.locale === "ar") || !currentLocales.some((locale) => locale.locale === "en")) return response({ error: "question_translation_required" }, 409);
      const latest = await (await query(`/rest/v1/question_revisions?select=revision_number&question_id=eq.${encodeURIComponent(questionId)}&order=revision_number.desc&limit=1`, key)).json() as Array<{ revision_number?: number }>;
      const revisionNumber = (latest[0]?.revision_number ?? 0) + 1;
      const revisionRows = await (await query("/rest/v1/question_revisions", key, { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify([{ question_id: questionId, revision_number: revisionNumber, status: "draft", reviewed_at: new Date().toISOString().slice(0, 10), created_by: actor }]) })).json() as Array<{ id?: string }>;
      const revisionId = revisionRows[0]?.id;
      if (!revisionId) return response({ error: "revision_create_failed" }, 503);
      await query("/rest/v1/question_revision_locales", key, { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify(currentLocales.map((locale) => ({ ...locale, revision_id: revisionId }))) });
      if (targetIds.length) await query("/rest/v1/question_follow_ups", key, { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify(targetIds.map((targetId, index) => ({ source_revision_id: revisionId, target_question_id: targetId, position: index + 1 }))) });
      await query(`/rest/v1/question_revisions?id=eq.${encodeURIComponent(revisionId)}`, key, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ status: "published" }) });
      await query(`/rest/v1/interview_questions?id=eq.${encodeURIComponent(questionId)}`, key, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ published_revision_id: revisionId }) });
      await audit(key, actor, action, "question_revision", questionId, null, { revision_id: revisionId, target_question_ids: targetIds }, fetchImpl);
      return response({ ok: true, questionId, revisionId });
    }
    if (action === "list_submissions") {
      const allowed = ["pending", "in_review", "changes_requested", "approved"];
      const status = text(body.status, 40) ?? "pending";
      if (!allowed.includes(status)) return response({ error: "payload_invalid" }, 400);
      const rows = await (await query(`/rest/v1/submissions?select=id,status,track_id,topic_ids,difficulty,payload,review_notes,created_at&status=eq.${encodeURIComponent(status)}&order=created_at.asc&limit=50`, key)).json();
      return response({ submissions: rows });
    }
    if (action === "list_community_questions") {
      const rows = await (await query("/rest/v1/interview_questions?select=id,slug,track_id,visibility,community_contributor_username,community_published_at,community_unpublished_at,promoted_at,promotion_like_count,published_revision_id,source_submission_id&or=(visibility.eq.community,promoted_at.not.is.null)&order=community_published_at.desc.nullslast&limit=100", key)).json();
      return response({ questions: rows });
    }
    if (action === "suspend_account" || action === "reinstate_account") {
      const target = text(body.targetUserId, 200);
      if (!target) return response({ error: "payload_invalid" }, 400);
      const suspended = action === "suspend_account";
      await query("/rest/v1/account_roles", key, { method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify([{ user_id: target, suspended, suspension_reason: suspended ? reason : null, suspended_at: suspended ? new Date().toISOString() : null }]) });
      await audit(key, actor, action, "account", await pseudonymousUserId(target), reason, {}, fetchImpl);
      return response({ ok: true, action });
    }
    if (action === "changes_requested" || action === "reject_submission") {
      const submissionId = text(body.submissionId, 80);
      if (!submissionId || !reason) return response({ error: "payload_invalid" }, 400);
      const rows = await (await query(`/rest/v1/submissions?select=id,status&id=eq.${encodeURIComponent(submissionId)}&limit=1`, key)).json() as Array<{ id: string; status: string }>;
      if (!rows[0]) return response({ error: "not_found" }, 404);
      if (rows[0].status === "published") return response({ error: "use_unpublish_action" }, 409);
      if (action === "changes_requested") {
        await query(`/rest/v1/submissions?id=eq.${encodeURIComponent(submissionId)}`, key, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ status: "changes_requested", review_notes: reason, reviewed_by: actor, reviewed_at: new Date().toISOString() }) });
        await audit(key, actor, action, "submission", submissionId, reason, {}, fetchImpl);
        return response({ ok: true });
      }
      await query(`/rest/v1/submissions?id=eq.${encodeURIComponent(submissionId)}`, key, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ status: "rejected", review_notes: reason, reviewed_by: actor, reviewed_at: new Date().toISOString(), closed_at: new Date().toISOString(), closed_by: actor }) });
      await audit(key, actor, action, "submission", submissionId, reason, {}, fetchImpl);
      return response({ ok: true });
    }
    if (action === "publish_submission") {
      const submissionId = text(body.submissionId, 80);
      if (!submissionId) return response({ error: "payload_invalid" }, 400);
      const published = await (await query("/rest/v1/rpc/publish_submission_for_moderator", key, { method: "POST", body: JSON.stringify({ p_actor_id: actor, p_submission_id: submissionId, p_imported: null }) })).json() as Array<{ question_id?: string; question_slug?: string; submission_status?: string }>;
      const result = published[0];
      if (!result?.question_id || !result.question_slug) return response({ error: "publish_failed" }, 503);
      return response({ ok: true, status: result.submission_status, questionId: result.question_id, slug: result.question_slug });
    }
    if (action === "unpublish_question") {
      const questionId = text(body.questionId, 120);
      if (!questionId || !reason) return response({ error: "payload_invalid" }, 400);
      const current = await (await query(`/rest/v1/interview_questions?select=id,visibility&id=eq.${encodeURIComponent(questionId)}&limit=1`, key)).json() as Array<{ id: string; visibility: string }>;
      if (!current[0]) return response({ error: "not_found" }, 404);
      if (current[0].visibility !== "community") return response({ error: "question_not_community" }, 409);
      const updated = await (await query(`/rest/v1/interview_questions?id=eq.${encodeURIComponent(questionId)}`, key, { method: "PATCH", headers: { Prefer: "return=representation" }, body: JSON.stringify({ community_unpublished_at: new Date().toISOString() }) })).json() as Array<{ id: string }>;
      if (!updated.length) return response({ error: "not_found" }, 404);
      await audit(key, actor, action, "question", questionId, reason, {}, fetchImpl);
      return response({ ok: true });
    }
    if (action === "republish_question") {
      const questionId = text(body.questionId, 120);
      if (!questionId) return response({ error: "payload_invalid" }, 400);
      const updated = await (await query(`/rest/v1/interview_questions?id=eq.${encodeURIComponent(questionId)}&published_revision_id=not.is.null`, key, { method: "PATCH", headers: { Prefer: "return=representation" }, body: JSON.stringify({ community_unpublished_at: null, visibility: "community", community_published_at: new Date().toISOString() }) })).json() as Array<{ id: string }>;
      if (!updated.length) return response({ error: "question_not_ready" }, 409);
      await audit(key, actor, action, "question", questionId, null, {}, fetchImpl);
      return response({ ok: true });
    }
    return response({ error: "unsupported_action" }, 400);
  } catch (error) {
    console.error(error);
    return response({ error: "moderation_unavailable" }, 503);
  }
}
