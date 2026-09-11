import { normalizeQuestion, validateSubmission, type ValidatedSubmission } from "../../shared/submissions.ts";
import { fetchUpstream } from "./upstream.ts";

const cors = {
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};
type FetchLike = typeof fetch;
export type SupabaseConfig = { url: string; key: string };

class DatabaseError extends Error {
  readonly status: number;
  readonly code: string;
  constructor(status: number, code = "database_error") {
    super(code);
    this.status = status;
    this.code = code;
  }
}

function response(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: cors });
}

function dbConfig(): SupabaseConfig {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("server_configuration_error");
  return { url, key };
}

async function dbRequest(config: SupabaseConfig, path: string, init: RequestInit = {}, fetchImpl: FetchLike = fetch): Promise<Response> {
  const response = await fetchUpstream(fetchImpl, `${config.url.replace(/\/$/, "")}${path}`, {
    ...init,
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { message?: unknown };
    throw new DatabaseError(response.status, typeof body.message === "string" ? body.message : "database_error");
  }
  return response;
}

function jsonValue(value: unknown): unknown {
  return value && typeof value === "object" ? value : {};
}

function intersects(a: string[], b: string[]): boolean {
  const set = new Set(a);
  return b.some((value) => set.has(value));
}

async function isDuplicate(draft: ValidatedSubmission, config: SupabaseConfig, fetchImpl: FetchLike = fetch): Promise<string | null> {
  const query = `/rest/v1/submissions?select=id,payload,topic_ids&track_id=eq.${encodeURIComponent(draft.trackId)}&status=in.(pending,issue_created,changes_requested,approved,published)&order=created_at.desc&limit=100`;
  const rows = await (await dbRequest(config, query, {}, fetchImpl)).json() as Array<{ id: string; payload?: unknown; topic_ids?: unknown }>;
  const normalized = normalizeQuestion(draft.question);
  const match = rows.find((row) => {
    const payload = jsonValue(row.payload) as { question?: unknown };
    const topics = Array.isArray(row.topic_ids) ? row.topic_ids.filter((topic): topic is string => typeof topic === "string") : [];
    return typeof payload.question === "string" && normalizeQuestion(payload.question) === normalized && (!draft.topicIds.length || intersects(topics, draft.topicIds));
  });
  return match?.id ?? null;
}

export async function handleSubmit(request: Request, fetchImpl: FetchLike = fetch, configured?: SupabaseConfig): Promise<Response> {
  const userId = request.headers.get("x-account-id");
  if (!userId) return response({ error: "unauthenticated" }, 401);

  let draft: ValidatedSubmission;
  try {
    draft = validateSubmission(await request.json());
  } catch (error) {
    return response({ error: error instanceof Error ? error.message : "payload_invalid" }, 400);
  }

  try {
    const config = configured ?? dbConfig();
    const db = (path: string, init: RequestInit = {}) => dbRequest(config, path, init, fetchImpl);
    const duplicateOf = await isDuplicate(draft, config, fetchImpl);
    const payload = {
      question: draft.question,
      ...(draft.shortAnswer ? { shortAnswer: draft.shortAnswer } : {}),
      ...(draft.explanation ? { explanation: draft.explanation } : {}),
      ...(draft.sources.length ? { sources: draft.sources } : {}),
      ...(draft.codeExample ? { codeExample: draft.codeExample } : {}),
      ...(draft.commonMistakes.length ? { commonMistakes: draft.commonMistakes } : {}),
      ...(draft.followUpQuestions.length ? { followUpQuestions: draft.followUpQuestions } : {}),
    };
    const created = await (await db("/rest/v1/rpc/create_submission_for_account", {
      method: "POST",
      body: JSON.stringify({ p_account_id: userId, p_track_id: draft.trackId, p_topic_ids: draft.topicIds, p_difficulty: draft.difficulty, p_payload: payload, p_idempotency_key: draft.idempotencyKey, p_duplicate_of: duplicateOf, p_display_name: draft.displayName }),
    })).json() as Array<{ submission_id?: string; submission_status?: string; duplicate_advisory?: boolean }>;
    const result = created[0];
    if (!result?.submission_id || !result.submission_status) throw new Error("database_error");
    return response({ submissionId: result.submission_id, status: result.submission_status, duplicateAdvisory: Boolean(result.duplicate_advisory) });
  } catch (error) {
    console.error(error);
    if (error instanceof DatabaseError) {
      if (["submission_suspended", "track_preference_required"].includes(error.code)) return response({ error: error.code }, 403);
      if (["daily_limit_reached", "cooldown_active"].includes(error.code)) return response({ error: error.code }, 429);
      if (error.code === "taxonomy_invalid") return response({ error: error.code }, 400);
    }
    return response({ error: "submission_unavailable" }, 503);
  }
}
