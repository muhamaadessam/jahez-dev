import assert from "node:assert/strict";
import test from "node:test";

import { questions, validateBilingualCatalogue, validateProductionCatalogue, validateQuestions, validateFollowUpRelations, getFollowUpQuestionRefs } from "./questions.ts";

test("the public question catalogue accepts the permanent Dart questions", () => {
  assert.doesNotThrow(() => validateQuestions(questions));
  const dartQuestions = questions.filter((question) => question.topicIds.includes("dart"));
  const requiredDartSlugs = [
    "final-vs-const-in-dart",
    "var-vs-dynamic-in-dart",
    "nullable-and-non-nullable-types-in-dart",
    "late-variables-in-dart",
    "object-and-type-safety-in-dart",
    "list-set-and-map-in-dart",
    "spread-and-collection-if-in-dart",
    "named-and-optional-parameters-in-dart",
    "cascade-notation-in-dart",
    "classes-constructors-and-factory-in-dart",
    "extension-methods-in-dart",
    "async-await-and-futures-in-dart",
  ];
  const slugs = new Set(dartQuestions.map((question) => question.slug));
  for (const slug of requiredDartSlugs) assert.ok(slugs.has(slug));
  assert.deepEqual(new Set(dartQuestions.map((question) => question.difficulty)), new Set(["Junior", "Mid", "Senior"]));
  for (const question of dartQuestions) {
    assert.ok(question.question);
    assert.ok(question.shortAnswer);
    assert.ok(question.explanation);
    assert.match(question.lastReviewedAt, /^\d{4}-\d{2}-\d{2}$/);
  }
});

test("follow-up relations resolve only to reviewed questions in the same Track", () => {
  assert.doesNotThrow(() => validateFollowUpRelations());
  const source = questions.find((question) => question.id === "dart-001");
  assert.ok(source);
  assert.deepEqual(getFollowUpQuestionRefs(source, "en").map((ref) => ref.id), ["dart-006"]);
  assert.match(getFollowUpQuestionRefs(source, "ar")[0]?.href ?? "", /track=flutter/);
  assert.throws(() => validateFollowUpRelations([{ ...source, trackId: "other", topicIds: ["dart"] }, questions.find((question) => question.id === "dart-006")!]), /invalid Follow-up/);
});

test("every question has complete Arabic and English translations", () => {
  assert.doesNotThrow(() => validateBilingualCatalogue());
  for (const question of questions) {
    assert.ok(question.translations?.ar.question);
    assert.ok(question.translations?.en.question);
    assert.equal(question.translations?.ar.sources.length, question.sources.length);
    assert.equal(question.translations?.en.sources.length, question.sources.length);
  }
});

test("production validation enforces the 1010-question topic distribution", () => {
  assert.doesNotThrow(() => validateProductionCatalogue());
  assert.throws(() => validateProductionCatalogue(questions.slice(0, -1)), /exactly 1010 questions/);
  const wrongDistribution = questions.map((question, index) => index === 0 ? { ...question, topicIds: ["widgets"] } : question);
  assert.throws(() => validateProductionCatalogue(wrongDistribution), /Topic dart must contain exactly 12/);
  assert.throws(() => validateProductionCatalogue(questions.map((question, index) => index === 0 ? { ...question, difficulty: "Expert" as never } : question)), /invalid difficulty/);
  assert.throws(() => validateProductionCatalogue(questions.map((question, index) => index === 0 ? { ...question, lastReviewedAt: "2026-99-99" } : question)), /invalid review date/);
  assert.throws(() => validateProductionCatalogue(questions.map((question, index) => index === 0 ? { ...question, lastReviewedAt: "2026-02-30" } : question)), /invalid review date/);
  assert.throws(() => validateProductionCatalogue(questions.map((question, index) => index === 0 ? { ...question, sources: [{ title: "bad", url: "http://example.com" }] } : question)), /unapproved source URL/);
});

test("the public question catalogue rejects missing data and duplicate identity", () => {
  const question = questions[0];
  assert.ok(question);

  assert.throws(
    () => validateQuestions([{ ...question, question: "" }]),
    /missing required data/,
  );
  assert.throws(
    () => validateQuestions([question, { ...question }]),
    /duplicate id or slug/,
  );
  assert.throws(
    () => validateQuestions([{ ...question, trackId: "missing" }]),
    /invalid Track or Topic reference/,
  );
  assert.throws(
    () => validateQuestions([{ ...question, topicIds: ["missing"] }]),
    /invalid Track or Topic reference/,
  );
});

test("the Fundamentals OOP and SOLID topics contain their planned question sets", () => {
  const expected = {
    "fund-oop": ["oop-four-pillars-encapsulation-abstraction", "oop-composition-over-inheritance-benefits"],
    "fund-solid": ["solid-single-responsibility-principle-definition", "solid-open-closed-principle-real-world"],
  } as const;
  for (const [topic, slugs] of Object.entries(expected)) {
    const actual = new Set(questions.filter((question) => question.topicIds.includes(topic)).map((question) => question.slug));
    for (const slug of slugs) assert.ok(actual.has(slug));
  }
});

test("the Flutter Fundamentals topic contains its planned question set", () => {
  const slugs = new Set(questions.filter((question) => question.topicIds.includes("flutter-fundamentals")).map((question) => question.slug));
  for (const slug of [
    "flutter-framework-engine-and-embedder",
    "declarative-ui-in-flutter",
    "widget-element-render-object-trees",
    "flutter-frame-rendering-pipeline",
    "hot-reload-vs-hot-restart",
    "debug-profile-and-release-modes",
    "pubspec-dependencies-and-packages",
    "flutter-app-lifecycle",
    "assets-and-images-in-flutter",
    "flutter-flavors-and-build-configurations",
  ]) assert.ok(slugs.has(slug), `missing Flutter Fundamentals question: ${slug}`);
});

test("the Widgets topic contains its planned question set", () => {
  const slugs = new Set(questions.filter((question) => question.topicIds.includes("widgets")).map((question) => question.slug));
  for (const slug of [
    "statelesswidget-and-build",
    "statefulwidget-state-lifecycle",
    "buildcontext-scope-and-inherited-widgets",
    "keys-and-widget-identity",
    "flutter-constraints-go-down-sizes-go-up",
    "builder-child-and-rebuild-boundaries",
    "const-widgets-and-rebuild-cost",
    "setstate-and-rebuild-scope",
    "didchangedependencies-and-inheritedwidget",
    "globalkey-tradeoffs",
  ]) assert.ok(slugs.has(slug), `missing Widgets question: ${slug}`);
});

test("the State Management topic contains its planned question set", () => {
  const slugs = new Set(questions.filter((question) => question.topicIds.includes("state-management")).map((question) => question.slug));
  for (const slug of [
    "local-vs-shared-state",
    "lifting-state-up-in-flutter",
    "immutable-state-and-change-notification",
    "unidirectional-data-flow",
    "state-controller-lifecycle-and-dispose",
    "testable-state-management-boundaries",
    "valuenotifier-and-changenotifier",
    "streams-vs-notifiers-for-state",
    "choosing-a-state-management-approach",
    "state-restoration-and-persistence",
  ]) assert.ok(slugs.has(slug), `missing State Management question: ${slug}`);
});

test("the Navigation and Networking topics contain their planned question sets", () => {
  const expected = {
    navigation: [
      "navigator-route-stack-and-push-pop",
      "passing-data-between-flutter-routes",
      "deep-links-and-route-information",
      "imperative-vs-declarative-navigation",
      "nested-navigation-flows",
    ],
    networking: [
      "http-responses-and-status-codes",
      "json-serialization-and-typed-models",
      "future-loading-success-and-error-states",
      "network-timeouts-and-retry-boundaries",
      "cancelling-network-work-with-widget-lifecycle",
      "service-repository-network-boundaries",
      "websockets-and-stream-lifecycle",
    ],
    realtime: [
      "websocket-vs-http-polling", "stream-connection-state", "reconnect-backoff-and-jitter",
      "websocket-message-ordering", "dispose-stream-subscriptions", "realtime-auth-and-logout",
    ],
  } as const;
  for (const [topic, slugs] of Object.entries(expected)) {
    const actual = new Set(questions.filter((question) => question.topicIds.includes(topic)).map((question) => question.slug));
    assert.equal(actual.size, slugs.length, `${topic} question count changed`);
    for (const slug of slugs) assert.ok(actual.has(slug), `missing ${topic} question: ${slug}`);
  }
});

test("the Local Storage and Platform Integration topics contain their planned question sets", () => {
  const expected = {
    "local-storage": [
      "preferences-files-and-local-databases",
      "key-value-preferences-for-small-settings",
      "files-for-local-documents-and-blobs",
      "sqlite-for-structured-local-data",
      "testable-and-resilient-local-persistence",
    ],
    "platform-integration": [
      "platform-channels-and-native-boundaries",
      "choosing-flutter-plugins-and-native-integration",
    ],
  } as const;
  for (const [topic, slugs] of Object.entries(expected)) {
    const actual = new Set(questions.filter((question) => question.topicIds.includes(topic)).map((question) => question.slug));
    assert.equal(actual.size, slugs.length, `${topic} question count changed`);
    for (const slug of slugs) assert.ok(actual.has(slug), `missing ${topic} question: ${slug}`);
  }
});

test("the Architecture topic contains its planned question set", () => {
  const expected = [
    "presentation-domain-and-data-boundaries",
    "dependency-injection-in-flutter",
    "testing-architecture-seams",
    "feature-boundaries-and-folder-organization",
    "domain-model-location-in-flutter-architecture",
    "repositories-and-view-model-dependency-direction",
    "optional-domain-layer-and-use-cases",
    "feature-vs-type-package-structure",
  ];
  const actual = new Set(questions.filter((question) => question.topicIds.includes("architecture")).map((question) => question.slug));
  assert.equal(actual.size, expected.length);
  for (const slug of expected) assert.ok(actual.has(slug), `missing Architecture question: ${slug}`);
});

test("the Testing topic contains its planned question set", () => {
  const expected = [
    "unit-tests-for-flutter-domain-logic",
    "widget-tests-and-user-visible-behavior",
    "integration-tests-for-critical-flows",
    "fakes-mocks-and-test-doubles",
    "deterministic-and-reliable-flutter-tests",
    "golden-tests-for-visual-regressions",
  ];
  const actual = new Set(questions.filter((question) => question.topicIds.includes("testing")).map((question) => question.slug));
  assert.equal(actual.size, expected.length);
  for (const slug of expected) assert.ok(actual.has(slug), `missing Testing question: ${slug}`);
});

test("the Performance and Async & Isolates topics contain their planned question sets", () => {
  const expected = {
    performance: [
      "profiling-before-performance-optimization",
      "frame-budget-and-jank-diagnosis",
      "lazy-list-builders-and-large-collections",
      "avoiding-expensive-work-in-build",
      "image-memory-and-render-cost",
    ],
    "async-isolates": [
      "dart-event-loop-and-microtasks",
      "future-wait-concurrency-and-failure",
      "streams-and-multiple-async-values",
      "isolates-for-cpu-bound-work",
    ],
  } as const;
  for (const [topic, slugs] of Object.entries(expected)) {
    const actual = new Set(questions.filter((question) => question.topicIds.includes(topic)).map((question) => question.slug));
    assert.equal(actual.size, slugs.length, `${topic} question count changed`);
    for (const slug of slugs) assert.ok(actual.has(slug), `missing ${topic} question: ${slug}`);
  }
});

test("the catalogue keeps official HTTPS sources and real review dates", () => {
  const approvedHosts = [
    "dart.dev", "api.dart.dev", "docs.flutter.dev", "api.flutter.dev", "blog.cleancoder.com", "www.rfc-editor.org", "developer.android.com", "kotlinlang.org",
    "nodejs.org", "php.net", "www.php.net", "laravel.com", "learn.microsoft.com", "dotnet.microsoft.com", "react.dev", "legacy.reactjs.org", "reactnative.dev", "docs.expo.dev", "expo.dev", "reactnavigation.org",
    "martinfowler.com", "refactoring.guru", "en.wikipedia.org", "developer.mozilla.org", "sandimetz.com",
    "www.nngroup.com", "lawsofux.com", "material.io", "developer.apple.com", "www.w3.org", "www.microsoft.com",
    "docs.python.org", "peps.python.org", "packaging.python.org", "pip.pypa.io", "docs.pytest.org", "coverage.readthedocs.io", "wiki.python.org"
  ];
  for (const question of questions) {
    assert.equal(new Date(`${question.lastReviewedAt}T00:00:00Z`).toISOString().slice(0, 10), question.lastReviewedAt);
    for (const source of question.sources) {
      const url = new URL(source.url);
      assert.equal(url.protocol, "https:");
      assert.ok(approvedHosts.includes(url.hostname), `Unapproved host: ${url.hostname} in question ${question.id}`);
    }
  }
});

test("the Android Native track contains its 100 planned questions across 14 topics", () => {
  const androidQuestions = questions.filter((question) => question.trackId === "android-native");
  assert.equal(androidQuestions.length, 100);
  assert.deepEqual(new Set(androidQuestions.map((question) => question.difficulty)), new Set(["Junior", "Mid", "Senior"]));
  for (const question of androidQuestions) {
    assert.ok(question.question);
    assert.ok(question.shortAnswer);
    assert.ok(question.explanation);
    assert.match(question.lastReviewedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.equal(new Date(`${question.lastReviewedAt}T00:00:00Z`).toISOString().slice(0, 10), question.lastReviewedAt);
    assert.ok(question.sources.length > 0);
  }
});

test("the catalogue contains 100 questions for each of the 8 specialized tracks", () => {
  for (const trackId of ["node", "php", "dotnet", "react", "react-native", "fundamentals", "ui-ux", "python"]) {
    const trackQuestions = questions.filter((q) => q.trackId === trackId);
    assert.equal(trackQuestions.length, 100, `Track ${trackId} should have 100 questions`);
    assert.deepEqual(new Set(trackQuestions.map((q) => q.difficulty)), new Set(["Junior", "Mid", "Senior"]));
    for (const q of trackQuestions) {
      assert.match(q.id, /^[a-z0-9]+-[0-9]{3}$/, `Invalid database question ID: ${q.id}`);
      assert.ok(q.question);
      assert.ok(q.shortAnswer);
      assert.ok(q.explanation);
      assert.match(q.lastReviewedAt, /^\d{4}-\d{2}-\d{2}$/);
      assert.equal(new Date(`${q.lastReviewedAt}T00:00:00Z`).toISOString().slice(0, 10), q.lastReviewedAt);
      assert.ok(q.sources.length > 0);
    }
  }
});

test("the Flutter track contains 110 specialized questions across 15 topics", () => {
  const flutterQuestions = questions.filter((q) => q.trackId === "flutter");
  assert.equal(flutterQuestions.length, 110);
  assert.deepEqual(new Set(flutterQuestions.map((q) => q.difficulty)), new Set(["Junior", "Mid", "Senior"]));
  const anim = questions.filter((q) => q.topicIds.includes("flutter-animations"));
  assert.equal(anim.length, 10);
  const internals = questions.filter((q) => q.topicIds.includes("flutter-internals"));
  assert.equal(internals.length, 10);
});
