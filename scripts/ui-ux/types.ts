export type RawQuestion = [
  id: string,
  slug: string,
  topicId: string,
  difficulty: "Junior" | "Mid" | "Senior",
  question: string,
  shortAnswer: string,
  explanation: string,
  codeExample: string | undefined,
  commonMistakes: string[],
  followUpQuestions: string[],
  sourceTitle: string,
  sourceUrl: string
];
