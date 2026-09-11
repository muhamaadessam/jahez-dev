import type { CommunityQuestion, Locale } from "../../shared/contracts.ts";
import { nodeRequest } from "../backend/api.ts";

export type CommunityScope = "public" | "community";

export type { CommunityQuestion } from "../../shared/contracts.ts";

type TokenProvider = (options?: { template?: string }) => Promise<string | null>;

export async function loadCommunityQuestions({
  trackId,
  locale,
  fetchImpl = fetch,
  getToken,
  userId,
}: {
  trackId: string;
  locale: Locale;
  fetchImpl?: typeof fetch;
  getToken?: TokenProvider;
  userId?: string | null;
}): Promise<CommunityQuestion[]> {
  const questions = (await nodeRequest<{ questions: CommunityQuestion[] }>({ path: `/community/questions?trackId=${encodeURIComponent(trackId)}&locale=${encodeURIComponent(locale)}`, fetchImpl })).questions;
  if (!questions.length) return [];
  if (getToken && userId) {
    const token = await getToken();
    if (token) {
      const liked = new Set((await nodeRequest<{ questionIds: string[] }>({ path: `/me/community-likes?questionIds=${questions.map(({ id }) => encodeURIComponent(id)).join(",")}`, token, fetchImpl })).questionIds);
      return questions.map((question) => ({ ...question, likedByViewer: liked.has(question.id) }));
    }
  }
  return questions;
}
