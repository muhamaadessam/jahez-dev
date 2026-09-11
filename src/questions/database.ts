import type { DatabaseQuestion, Locale } from "../../shared/contracts.ts";
import { nodeRequest } from "../backend/api.ts";

export class DatabaseQuestionNotFound extends Error {}

export type { DatabaseQuestion } from "../../shared/contracts.ts";

export async function loadDatabaseQuestion(slug: string, locale: Locale, fetchImpl: typeof fetch = fetch): Promise<DatabaseQuestion> {
  try { return await nodeRequest<DatabaseQuestion>({ path: `/questions/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`, fetchImpl }); }
  catch (error) {
    if ((error as { status?: number }).status === 404) throw new DatabaseQuestionNotFound();
    throw error;
  }
}
