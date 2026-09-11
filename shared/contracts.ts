export type DifficultyLevel = "Junior" | "Mid" | "Senior";
export type Locale = "ar" | "en";

export type FollowUpQuestionRef = {
  id: string;
  slug: string;
  label: string;
  href?: string;
};

export type QuestionTranslation = {
  question: string;
  shortAnswer: string;
  explanation: string;
  codeExample?: string;
  commonMistakes?: string[];
  followUpQuestions?: string[];
  followUpQuestionRefs?: FollowUpQuestionRef[];
  sources: { title: string; url: string }[];
};

export type SearchableQuestion = {
  id: string;
  slug: string;
  trackId: string;
  topicIds: string[];
  difficulty: DifficultyLevel;
  question: string;
  shortAnswer: string;
};

export type DatabaseQuestion = {
  id: string;
  slug: string;
  trackId: string;
  topicIds: string[];
  topicNames: string[];
  difficulty: DifficultyLevel;
  lastReviewedAt: string;
  translations: Record<Locale, QuestionTranslation>;
};

export type CommunityScope = "public" | "community";

export type CommunityQuestion = SearchableQuestion & {
  database: true;
  visibility: CommunityScope;
  contributorUsername: string | null;
  likeCount: number;
  promotedAt: string | null;
  publishedAt: string | null;
  likedByViewer: boolean;
};
