---
name: review-question-submission
description: "Review a community question submission, check for duplicates against the existing catalogue in src/content/questions.ts, associate the correct Track and Topics, enrich with bilingual Arabic and English content, verify official HTTPS documentation sources, and output valid Importable JSON for the moderator console."
---

# Review Question Submission Skill

Use this skill when reviewing a community interview question submission or when prompted by the user to process, review, or evaluate a candidate question.

## Step 1: Duplicate Detection
1. Locate the Track in `src/content/questions.ts`.
2. Search through all questions in that track (matching slugs, question text, and core concepts).
3. **Compare conceptually and semantically**, not just verbatim:
   - For example: "ما هو الفرق بين final و const في Dart؟" is identical to `final-vs-const-in-dart`.
   - "How does Virtual DOM work?" is identical to `react-core-virtual-dom-reconciliation`.
4. If a match is found:
   - Stop and declare:
     ```
     DUPLICATE_FOUND:
     - Existing Question Slug: <slug>
     - Existing ID: <id>
     - Reason: This topic and conceptual explanation are already covered by <slug>.
     ```

## Step 2: Track and Topic Validation
1. Verify the question's target `trackId` against valid tracks (`flutter`, `android-native`, `node`, `php`, `dotnet`, `react`, `react-native`, `fundamentals`, `ui-ux`).
2. Select the most accurate English `topicIds` from the official topics list in `src/content/questions.ts`. Remember: all topics in this project are strictly in English.

## Step 3: Bilingual Content Enrichment
Create a high quality, production-ready bilingual question object:
- **Arabic Translation (`ar`)**:
  - Clear Arabic question (`question`).
  - Concise technical summary (`shortAnswer`).
  - Thorough explanation (`explanation`) explaining why, when, and trade-offs.
  - Optional code example (`codeExample`) — clean code, no markdown backtick fences.
  - Common pitfalls and mistakes (`commonMistakes`).
  - Thoughtful follow-up questions (`followUpQuestions`).
  - High-trust official HTTPS documentation sources (`sources`).
- **English Translation (`en`)**:
  - Natural English phrasing matching the same structure.

## Step 4: Output Format
Output **ONLY** one valid JSON object (no Markdown code fences, no preamble, no commentary) matching the `ImportedQuestion` schema:

```json
{
  "contributorUsername": "<contributor's username>",
  "trackId": "<track-id>",
  "topicIds": ["<valid-english-topic-id>"],
  "difficulty": "Junior|Mid|Senior",
  "translations": {
    "ar": {
      "question": "...",
      "shortAnswer": "...",
      "explanation": "...",
      "codeExample": null,
      "commonMistakes": ["..."],
      "followUpQuestions": ["..."],
      "sources": [
        {
          "title": "Official Docs",
          "url": "https://..."
        }
      ]
    },
    "en": {
      "question": "...",
      "shortAnswer": "...",
      "explanation": "...",
      "codeExample": null,
      "commonMistakes": ["..."],
      "followUpQuestions": ["..."],
      "sources": [
        {
          "title": "Official Docs",
          "url": "https://..."
        }
      ]
    }
  }
}
```

This output is ready to be pasted directly into the Moderator Console under **استيراد JSON من AI**.
