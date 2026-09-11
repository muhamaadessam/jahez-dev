import type { DifficultyLevel } from "../content/questions.ts";
import { accountStorageKey, anonymousStorageKey, getActiveStudyAccount } from "./progress.ts";

export type SavedInterview = {
  id: string;
  trackId: string;
  trackSlug: string;
  topicSlugs: string[];
  difficulty: DifficultyLevel;
  questionIds: string[];
  currentIndex: number;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type InterviewStorage = Pick<Storage, "getItem" | "setItem">;

const storageSuffix = ":interviews:v1";

export function interviewStorageKey(storage: Pick<Storage, "getItem">): string {
  const account = getActiveStudyAccount(storage);
  return `${account ? accountStorageKey(account) : anonymousStorageKey}${storageSuffix}`;
}

function isSavedInterview(value: unknown): value is SavedInterview {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<SavedInterview>;
  return typeof candidate.id === "string" &&
    typeof candidate.trackId === "string" &&
    typeof candidate.trackSlug === "string" &&
    Array.isArray(candidate.topicSlugs) && candidate.topicSlugs.every((topic) => typeof topic === "string") &&
    ["Junior", "Mid", "Senior"].includes(candidate.difficulty ?? "") &&
    Array.isArray(candidate.questionIds) && candidate.questionIds.every((questionId) => typeof questionId === "string") &&
    typeof candidate.currentIndex === "number" &&
    typeof candidate.completed === "boolean" &&
    typeof candidate.createdAt === "string" &&
    typeof candidate.updatedAt === "string";
}

export function getSavedInterviews(storage: Pick<Storage, "getItem">, key = interviewStorageKey(storage)): SavedInterview[] {
  try {
    const parsed: unknown = JSON.parse(storage.getItem(key) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isSavedInterview).sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
  } catch {
    return [];
  }
}

function writeInterviews(storage: InterviewStorage, interviews: SavedInterview[], key: string): void {
  try {
    storage.setItem(key, JSON.stringify(interviews));
  } catch {
    // Local storage can be unavailable in private browsing or when its quota is full.
  }
}

export function findResumableInterview(
  interviews: SavedInterview[],
  input: Pick<SavedInterview, "trackId" | "topicSlugs" | "difficulty">,
): SavedInterview | undefined {
  const topics = [...input.topicSlugs].sort().join(",");
  return interviews.find((interview) => !interview.completed && interview.trackId === input.trackId && interview.difficulty === input.difficulty && [...interview.topicSlugs].sort().join(",") === topics);
}

export function createInterview(
  storage: InterviewStorage,
  input: Omit<SavedInterview, "id" | "createdAt" | "updatedAt" | "completed" | "currentIndex">,
  key = interviewStorageKey(storage),
): SavedInterview {
  const now = new Date().toISOString();
  const id = `interview-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const interview: SavedInterview = { ...input, id, currentIndex: 0, completed: false, createdAt: now, updatedAt: now };
  writeInterviews(storage, [interview, ...getSavedInterviews(storage, key)], key);
  return interview;
}

export function updateInterview(
  storage: InterviewStorage,
  id: string,
  patch: Partial<Pick<SavedInterview, "currentIndex" | "completed">>,
  key = interviewStorageKey(storage),
): SavedInterview | undefined {
  const interviews = getSavedInterviews(storage, key);
  const existing = interviews.find((interview) => interview.id === id);
  if (!existing) return undefined;
  const updated = { ...existing, ...patch, updatedAt: new Date().toISOString() };
  writeInterviews(storage, interviews.map((interview) => interview.id === id ? updated : interview), key);
  return updated;
}

export function deleteInterview(storage: InterviewStorage, id: string, key = interviewStorageKey(storage)): void {
  const interviews = getSavedInterviews(storage, key);
  writeInterviews(storage, interviews.filter((interview) => interview.id !== id), key);
}
