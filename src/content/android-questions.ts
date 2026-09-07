import type { InterviewQuestion } from "./questions.ts";
import { kotlinQuestions } from "./android/kotlin-questions.ts";
import { fundamentalsQuestions } from "./android/fundamentals-questions.ts";
import { uiComposeQuestions } from "./android/ui-compose-questions.ts";
import { archComponentsQuestions } from "./android/arch-components-questions.ts";
import { coroutinesQuestions } from "./android/coroutines-questions.ts";
import { networkingStorageQuestions } from "./android/networking-storage-questions.ts";
import { diBackgroundQuestions } from "./android/di-background-questions.ts";
import { perfSecTestBuildQuestions } from "./android/perf-sec-test-build-questions.ts";

export const androidBaseQuestions: Omit<InterviewQuestion, "translations">[] = [
  ...kotlinQuestions,
  ...fundamentalsQuestions,
  ...uiComposeQuestions,
  ...archComponentsQuestions,
  ...coroutinesQuestions,
  ...networkingStorageQuestions,
  ...diBackgroundQuestions,
  ...perfSecTestBuildQuestions,
];
