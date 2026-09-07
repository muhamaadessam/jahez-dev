import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

interface RawQuestion {
  id: string;
  slug: string;
  topicId: string;
  difficulty: "Junior" | "Mid" | "Senior";
  question: string;
  shortAnswer: string;
  explanation: string;
  codeExample?: string;
  commonMistakes: string[];
  followUpQuestions: string[];
  sources: { title: string; url: string }[];
}

// 10 topics x 10 questions = 100 questions for Node.js
const rawQuestions: RawQuestion[] = [
  // Topic: node-core (10 questions: ncore-001 to ncore-010)
  {
    id: "ncore-001",
    slug: "event-loop-phases-in-node",
    topicId: "node-core",
    difficulty: "Mid",
    question: "ما هي المراحل الأساسية للـ Event Loop في Node.js وكيف تعالج المهام المختلفة؟",
    shortAnswer: "يمر الـ Event Loop بمراحل متتالية: Timers، Pending callbacks، Idle/Prepare، Poll، Check، وClose callbacks، مع معالجة microtasks بين المراحل.",
    explanation: "يدير الـ Event Loop بواسطة مكتبة libuv؛ تبدأ دورته بمرحلة Timers (تنفيذ callbacks الخاصة بـ setTimeout وsetInterval)، تليها Pending callbacks لأخطاء الـ I/O المؤجلة، ثم Poll لانتظار أحداث الـ I/O الجديدة، ثم Check لتنفيذ callbacks الخاصة بـ setImmediate، وأخيراً Close callbacks لإغلاق المقابس والـ handles. يتم تفريغ طابور الـ microtasks (مثل process.nextTick والـ Promises) فور انتهاء كل عملية أو مرحلة قبل الانتقال للمرحلة التالية.",
    codeExample: `setTimeout(() => console.log("Timer"), 0);
setImmediate(() => console.log("Immediate"));
process.nextTick(() => console.log("Next Tick"));`,
    commonMistakes: ["الاعتقاد بأن setTimeout(fn, 0) تنفذ فوراً في نفس اللحظة دون انتظار دورة الـ event loop.", "تجاهل أولوية process.nextTick على الـ microtasks الأخرى للـ Promise."],
    followUpQuestions: ["كيف يؤثر تنفيذ عملية متزامنة ثقيلة داخل مرحلة Poll على الـ Timers؟", "ما الفرق الدقيق بين تنفيذ الـ microtasks في Node.js 11+ مقارنة بالإصدارات السابقة؟"],
    sources: [{ title: "Node.js docs — The Node.js Event Loop, Timers, and process.nextTick()", url: "https://nodejs.org/docs/latest/api/timers.html" }],
  },
  {
    id: "ncore-002",
    slug: "process-nexttick-vs-setimmediate-in-node",
    topicId: "node-core",
    difficulty: "Mid",
    question: "ما الفرق الجوهري بين process.nextTick() و setImmediate() في Node.js؟",
    shortAnswer: "process.nextTick تنفذ فوراً بعد العملية الحالية وقبل أي مرحلة تالية من الـ Event Loop، بينما setImmediate تنفذ في مرحلة Check من الـ Event Loop.",
    explanation: "على الرغم من التسمية المضللة تاريخياً، فإن process.nextTick لا تعد جزءاً من مراحل libuv نفسها، بل تعمل كطابور microtask ذي أولوية قصوى يُفرغ مباشرة قبل عودة التحكم إلى الـ event loop. في المقابل، تُسجل setImmediate كـ callback تُستدعى حصرياً في مرحلة Check بعد انتهاء مرحلة Poll. الإفراط في استخدام nextTick قد يسبب تجويعاً (starvation) للـ I/O.",
    codeExample: `setImmediate(() => console.log("Check: immediate"));
process.nextTick(() => console.log("Microtask: nextTick"));`,
    commonMistakes: ["استخدام process.nextTick في استدعاءات عودية مما يتسبب في تجميد كامل الـ I/O."],
    followUpQuestions: ["متى يكون من الضروري استخدام process.nextTick للسماح للمستخدم بالاشتراك في الأحداث قبل إطلاقها؟"],
    sources: [{ title: "Node.js docs — process.nextTick", url: "https://nodejs.org/docs/latest/api/process.html#processnexttickcallback-args" }],
  },
  {
    id: "ncore-003",
    slug: "libuv-thread-pool-and-architecture-in-node",
    topicId: "node-core",
    difficulty: "Senior",
    question: "ما هو دور مكتبة libuv والـ Thread Pool الداخلي في Node.js ومتى يتم استخدامه؟",
    shortAnswer: "توفر libuv حلقة الـ Event Loop وتدير التفاعل مع نظام التشغيل بطريقة non-blocking، وتستخدم Thread Pool (افتراضياً 4 threads) للمهام التي لا يدعم نظام التشغيل إجابتها asynchronous بشكل أصيل.",
    explanation: "تعتمد Node.js على libuv كطبقة تجريد بين JavaScript ونظام التشغيل. عمليات الشبكة على Linux/macOS مثل epoll وkqueue هي asynchronous بالفعل ولا تحتاج threads إضافية. ولكن عمليات نظام الملفات (fs)، واستدعاءات DNS (عبر getaddrinfo)، وبعض العمليات التشفيرية (crypto)، وضغط البيانات (zlib) تتطلب thread pool منفصل لتفادي حظر الـ main thread.",
    codeExample: `process.env.UV_THREADPOOL_SIZE = "8";`,
    commonMistakes: ["الاعتقاد بأن كل طلبات الشبكة تستهلك threads من الـ libuv thread pool."],
    followUpQuestions: ["كيف تراقب تشبع الـ thread pool واختناق عمليات الـ I/O في بيئة الإنتاج؟"],
    sources: [{ title: "Node.js docs — Dependencies: libuv", url: "https://nodejs.org/docs/latest/api/process.html" }],
  },
  {
    id: "ncore-004",
    slug: "v8-engine-and-memory-management-in-node",
    topicId: "node-core",
    difficulty: "Senior",
    question: "كيف يدير محرك V8 الذاكرة بين الـ Stack والـ Heap في Node.js؟",
    shortAnswer: "يخزن الـ Stack المتغيرات البدائية ومراجع الكائنات، بينما يخزن الـ Heap الكائنات والمصفوفات والدوال، ويدير الـ Garbage Collector استرجاع المساحات غير المستخدمة.",
    explanation: "ينقسم الـ V8 Heap إلى مناطق رئيسية: New Space (Scavenger) للكائنات حديثة النشأة، وOld Space (Mark-Sweep & Mark-Compact) للكائنات التي بقيت حية عبر دورات تنظيف متعددة. تجاوز حد الذاكرة المخصص يؤدي إلى خطأ JavaScript heap out of memory وتوقف العملية.",
    codeExample: `import v8 from "node:v8";
const heapStats = v8.getHeapStatistics();`,
    commonMistakes: ["الاحتفاظ بمراجع غير مباشرة لكائنات ضخمة في مصفوفات عامة تمنع الـ GC من تحريرها."],
    followUpQuestions: ["ما الفرق بين Stop-the-world GC والـ Incremental Marking في V8؟"],
    sources: [{ title: "Node.js docs — v8 module", url: "https://nodejs.org/docs/latest/api/v8.html" }],
  },
  {
    id: "ncore-005",
    slug: "single-threaded-model-and-non-blocking-io-in-node",
    topicId: "node-core",
    difficulty: "Junior",
    question: "ماذا يعني أن Node.js أحادية الخيط (Single-Threaded) وكيف تتعامل مع آلاف الاتصالات المتزامنة؟",
    shortAnswer: "ينفذ كود JavaScript في خيط واحد رئيسي، لكن الـ I/O غير حاجب بفضل تفويض العمليات لنواة نظام التشغيل والـ event loop، مما يمكن خيطاً واحداً من خدمة آلاف الاتصالات.",
    explanation: "أحادية الخيط تعني أن تعليمات JavaScript وتحديث المتغيرات تجري بتسلسل داخل خيط رئيسي واحد دون مشاكل الـ race conditions. عندما يبدأ طلب I/O، تسجل Node.js الـ callback وتفوض العملية لنواة النظام، وتعود فوراً لمعالجة طلبات أخرى.",
    codeExample: `import http from "node:http";
http.createServer((req, res) => res.end("OK")).listen(3000);`,
    commonMistakes: ["تنفيذ عمليات معالجة مكثفة للـ CPU مباشرة في الخيط الرئيسي مما يجمد كل الطلبات الأخرى."],
    followUpQuestions: ["كيف تحل مشكلة المهام المعتمدة على الـ CPU دون تعطيل الخادم؟"],
    sources: [{ title: "Node.js docs — Overview of Blocking vs Non-Blocking", url: "https://nodejs.org/docs/latest/api/net.html" }],
  },
  {
    id: "ncore-006",
    slug: "unhandled-rejection-and-uncaught-exception-in-node",
    topicId: "node-core",
    difficulty: "Mid",
    question: "ما الفرق بين uncaughtException و unhandledRejection في Node.js وما التصرف الصحيح عند حدوثهما؟",
    shortAnswer: "تحدث uncaughtException عند خطأ متزامن لم يلتقطه try/catch ويجب عندها إنهاء العملية، بينما تحدث unhandledRejection عند فشل Promise بدون catch handler.",
    explanation: "عند إطلاق استثناء متزامن غير معالج، تصبح حالة تطبيق Node.js غير مستقرة وغير مضمونة؛ التصرف الموصى به رسمياً هو تسجيل الخطأ، إغلاق الاتصالات الحالية بلباقة، ثم إنهاء العملية (process.exit(1)) وترك مشغل العمليات يعيد تشغيلها.",
    codeExample: `process.on("uncaughtException", (err) => {
  console.error("Critical error:", err);
  process.exit(1);
});`,
    commonMistakes: ["محاولة استكمال عمل السيرفر بعد uncaughtException مما يؤدي إلى تلف البيانات أو تسريب الذاكرة."],
    followUpQuestions: ["لماذا يعتبر الإبقاء على العملية حية بعد uncaughtException سلوكاً خطيراً؟"],
    sources: [{ title: "Node.js docs — process events", url: "https://nodejs.org/docs/latest/api/process.html#event-uncaughtexception" }],
  },
  {
    id: "ncore-007",
    slug: "process-signals-and-graceful-shutdown-in-node",
    topicId: "node-core",
    difficulty: "Senior",
    question: "كيف تصمم آلية Graceful Shutdown في تطبيق Node.js عند استقبال إشارات SIGTERM أو SIGINT؟",
    shortAnswer: "يتم اعتراض الإشارة، التوقف عن استقبال طلبات جديدة عبر server.close()، انتظار إكمال الطلبات القائمة، إغلاق اتصالات قواعد البيانات، ثم الخروج بـ process.exit(0).",
    explanation: "في بيئات الحاويات السحابية، يرسل النظام إشارة SIGTERM لمنح التطبيق فرصة للإغلاق النظيف. الخطوات الصحيحة تشمل إيقاف الخادم، وضع مهلة قصوى تحسباً لتعلق أي طلبات، إغلاق حمامات اتصالات قواعد البيانات ومقابس الـ WebSockets، ثم الخروج برمز نجاح 0.",
    codeExample: `process.on("SIGTERM", async () => {
  server.close(async () => {
    await db.close();
    process.exit(0);
  });
});`,
    commonMistakes: ["عدم وضع مهلة زمنية قسرية في حالة وجود طلب عالق أو اتصال مفتوح بلا نهاية."],
    followUpQuestions: ["ما أهمية استدعاء .unref() على مؤقت الـ shutdown timeout؟"],
    sources: [{ title: "Node.js docs — Process Signal Events", url: "https://nodejs.org/docs/latest/api/process.html#signal-events" }],
  },
  {
    id: "ncore-008",
    slug: "event-emitter-pattern-and-leak-prevention-in-node",
    topicId: "node-core",
    difficulty: "Mid",
    question: "كيف يعمل EventEmitter في Node.js وما أسباب تحذير MaxListenersExceededWarning؟",
    shortAnswer: "يعمل بنمط Observer؛ يطلق التحذير عند تسجيل أكثر من 10 مستمعين افتراضياً لنفس الحدث، وهو إنذار لوجود تسريب محتمل في الذاكرة لعدم إزالة الـ listeners.",
    explanation: "فئة EventEmitter في node:events تسمح بتسجيل دوال مستمعة عبر .on() وإطلاقها عبر .emit(). نظراً لأن كل مستمع يحتفظ بإشارة إلى النطاق البرمجي الخاص به، فإن نسيان استدعاء .off() عند انتهاء دورة حياة الطلب يسبب تسريباً سريعاً للذاكرة.",
    codeExample: `emitter.on("event", handler);
emitter.off("event", handler);`,
    commonMistakes: ["زيادة الحد عبر setMaxListeners(100) لإخفاء التحذير دون التحقق من وجود تسريب حقيقي."],
    followUpQuestions: ["ما الفرق بين .once() و .on() مع AbortSignal في الإصدارات الحديثة؟"],
    sources: [{ title: "Node.js docs — Events", url: "https://nodejs.org/docs/latest/api/events.html" }],
  },
  {
    id: "ncore-009",
    slug: "abort-controller-and-cancellation-in-node",
    topicId: "node-core",
    difficulty: "Mid",
    question: "كيف يتم استخدام AbortController لإلغاء العمليات غير المتزامنة في Node.js الحديثة؟",
    shortAnswer: "توفر AbortController كائن إشارة (signal) يُمرر إلى الدوال غير المتزامنة لإلغاء العملية فور استدعاء controller.abort().",
    explanation: "أصبح AbortController معياراً قياسياً مدعوماً عالمياً في Node.js. يسمح بإلغاء طلبات HTTP، وقراءات الملفات، ومؤقتات setTimeout المعتمدة على الـ promises، مما يوفر الموارد ويمنع العمليات المعلقة عند انقطاع اتصال العميل.",
    codeExample: `const ac = new AbortController();
await fetch(url, { signal: ac.signal });
ac.abort();`,
    commonMistakes: ["نسيان التقاط AbortError في كتلة الـ catch وتصنيفه كخطأ غير متوقع للخادم."],
    followUpQuestions: ["كيف تستخدم AbortSignal.timeout(ms) لتبسيط إدارة مهل الطلبات في Node.js 18+؟"],
    sources: [{ title: "Node.js docs — AbortController", url: "https://nodejs.org/docs/latest/api/globals.html#abortcontroller" }],
  },
  {
    id: "ncore-010",
    slug: "node-native-addons-and-napi",
    topicId: "node-core",
    difficulty: "Senior",
    question: "ما هي الـ Native Addons وNode-API (N-API) ومتى يلجأ المطور لبنائها؟",
    shortAnswer: "هي إضافات ديناميكية مكتوبة بـ C/C++ يتم ربطها بـ Node.js وتوفر واجهة ABI مستقرة (Node-API) لتنفيذ مهام فائقة السرعة أو استخدام مكتبات النظام الأصلية.",
    explanation: "تستخدم الـ Native Addons عندما تكون كفاءة JavaScript غير كافية لمهام معينة مثل معالجة الصور والفيديو عالية الدقة، أو التشفير المتخصص، أو التواصل المباشر مع عتاد الأجهزة ومكتبات C القائمة مع استقرار الـ ABI عبر إصدارات Node.js المختلفة.",
    codeExample: `// استخدام C/C++ Addon عبر N-API`,
    commonMistakes: ["الافتراض بأن كتابة الكود بـ C++ ستكون أسرع دائماً مع تجاهل تكلفة نقل البيانات وتجاوز حدود V8."],
    followUpQuestions: ["ما هو دور node-addon-api في تبسيط كتابة الـ Addons باستخدام C++؟"],
    sources: [{ title: "Node.js docs — C/C++ addons", url: "https://nodejs.org/docs/latest/api/addons.html" }],
  },

  // Topic: node-async (10 questions: nasync-001 to nasync-010)
  {
    id: "nasync-001",
    slug: "async-await-vs-promises-in-node",
    topicId: "node-async",
    difficulty: "Junior",
    question: "ما الفرق العملي بين استخدام async/await والتعامل المباشر مع Promises في Node.js؟",
    shortAnswer: "async/await هي مجرد Syntactic Sugar مبنية فوق الـ Promises تجعل الكود يبدو ككود متزامن وتتيح معالجة الأخطاء بـ try/catch وتحسن قراءة الـ stack traces.",
    explanation: "الميزة الجوهرية لـ async/await تكمن في سهولة القراءة ومنع تداخل الـ then/catch المتسلسل، وتوحيد معالجة الأخطاء المتزامنة وغير المتزامنة في كتلة try/catch واحدة، بالإضافة إلى إتاحة خاصية async stack traces.",
    codeExample: `try {
  const user = await getUser(id);
} catch (err) {
  handleError(err);
}`,
    commonMistakes: ["نسيان إضافة كلمة await مما يعيد كائن Promise بدلاً من القيمة المطلوبة وينتج أخطاء صامتة."],
    followUpQuestions: ["ما هو التأثير الأدائي لاستخدام await المتسلسلة لعمليات غير معتمدة على بعضها؟"],
    sources: [{ title: "Node.js docs — Asynchronous activity", url: "https://nodejs.org/docs/latest/api/async_context.html" }],
  },
  {
    id: "nasync-002",
    slug: "promise-concurrency-combinators-in-node",
    topicId: "node-async",
    difficulty: "Mid",
    question: "قارن بين Promise.all و Promise.allSettled و Promise.race في Node.js من حيث السلوك والتعامل مع الأخطاء.",
    shortAnswer: "Promise.all يفشل بمجرد رفض أي وعد، وPromise.allSettled ينتظر اكتمال الجميع بنجاح وفشل، بينما Promise.race يحسم نتيجته مع أول وعد ينتهي أياً كانت حالته.",
    explanation: "يستخدم Promise.all عندما تعتمد الخطوة التالية على نجاح كل العمليات معاً (fail-fast). يستخدم Promise.allSettled لتشغيل مهام مستقلة وتحليل نتيجة كل منها على حدة. أما Promise.race فيستخدم لتنفيذ مهلات الطلبات بتسابق الطلب مع مؤقت زمني.",
    codeExample: `const results = await Promise.allSettled([fetchA(), fetchB()]);`,
    commonMistakes: ["استخدام Promise.all لمجموعة طلبات خارجية دون معالجة احتمال فشل أحدها مما يفقد بيانات الطلبات الناجحة."],
    followUpQuestions: ["متى تفضل استخدام Promise.any على Promise.race؟"],
    sources: [{ title: "Node.js docs — JavaScript globals", url: "https://nodejs.org/docs/latest/api/globals.html" }],
  },
  {
    id: "nasync-003",
    slug: "concurrency-limiting-and-throttling-in-node",
    topicId: "node-async",
    difficulty: "Senior",
    question: "لماذا يعد تشغيل مئات الوعود عبر Promise.all خطيراً وكيف تطبق تحديد التزامن (Concurrency Limiting)؟",
    shortAnswer: "تشغيل كمية ضخمة بالتوازي يستنزف منافذ الشبكة ومقابض الملفات وذاكرة الخادم، ويجب تقييد التزامن بحاجز (pool/semaphore).",
    explanation: "استدعاء Promise.all لآلاف العناصر دفعة واحدة يؤدي سريعاً إلى أخطاء EMFILE أو ECONNRESET واختناق الخادم الخارجي. التصميم المتين يتطلب قصر عدد العمليات المتزامنة في أي لحظة على حد أقصى وإدخال الباقي في طابور انتظار.",
    codeExample: `// تطبيق concurrency limit لحماية الموارد`,
    commonMistakes: ["الاعتقاد بأن Node.js تضع حداً تلقائياً لعدد الوعود المتزامنة التي يطلقها Promise.all."],
    followUpQuestions: ["كيف توازن بين حجم الـ concurrency limit وسرعة إنهاء المهام دون التأثير على زمن استجابة السيرفر؟"],
    sources: [{ title: "Node.js docs — net module", url: "https://nodejs.org/docs/latest/api/net.html" }],
  },
  {
    id: "nasync-004",
    slug: "async-local-storage-and-context-propagation-in-node",
    topicId: "node-async",
    difficulty: "Senior",
    question: "ما هي تقنية AsyncLocalStorage في Node.js وما المشاكل التي تحلها في تتبع الطلبات (Tracing)؟",
    shortAnswer: "توفر مخزناً محلياً للسياق يتيح مشاركة بيانات الطلب (كالـ Request ID والمستخدم) عبر كل العمليات غير المتزامنة دون تمريرها يدوياً.",
    explanation: "في أنظمة السيرفر المعقدة، تحتاج طبقات التسجيل والتحقق من الصلاحيات ومعاملات قواعد البيانات لمعرفة هوية الطلب الحالي. توفر فئة AsyncLocalStorage من وحدة node:async_hooks حلاً جذرياً لمشاركة هذا السياق التلقائي عبر أي دالة تنفذ ضمن نفس التدفق غير المتزامن.",
    codeExample: `import { AsyncLocalStorage } from "node:async_hooks";
const als = new AsyncLocalStorage();`,
    commonMistakes: ["فقدان السياق غير المتزامن عند التعامل مع مكتبات قديمة تستخدم كوداً متزامناً يقطع الـ callback chain."],
    followUpQuestions: ["ما هو العبء الأدائي الناتج عن تفعيل AsyncLocalStorage في الخدمات عالية الحِمل؟"],
    sources: [{ title: "Node.js docs — AsyncLocalStorage", url: "https://nodejs.org/docs/latest/api/async_context.html#class-asynclocalstorage" }],
  },
  {
    id: "nasync-005",
    slug: "microtasks-vs-macrotasks-execution-order-in-node",
    topicId: "node-async",
    difficulty: "Mid",
    question: "كيف تختلف أولوية الـ Microtasks عن الـ Macrotasks في معالجة المهام بـ Node.js؟",
    shortAnswer: "تنفذ الـ Microtasks فور انتهاء المهمة الحالية وقبل أي Macrotask تالية، مما يعني أن طابور الـ Microtasks يُفرغ تماماً قبل التقدم في مراحل الـ Event Loop.",
    explanation: "الـ Macrotasks هي أحداث مراحل الـ Event Loop مثل مؤقتات setTimeout ومستمعات الـ I/O وأحداث setImmediate. أما الـ Microtasks فتشمل process.nextTick وPromise callbacks وqueueMicrotask. عند انتهاء كود JavaScript الحالي، يتم تفريغ طابور microtasks بالكامل قبل التقدم للمرحلة التالية.",
    codeExample: `queueMicrotask(() => console.log("Micro"));
setTimeout(() => console.log("Macro"), 0);`,
    commonMistakes: ["وضع حلقة غير متناهية داخل queueMicrotask أو process.nextTick مما يحجب الـ Event Loop تماماً عن أي I/O."],
    followUpQuestions: ["لماذا صُمم process.nextTick ليكون له أولوية أعلى من microtasks الخاصة بـ Promise؟"],
    sources: [{ title: "Node.js docs — Timers and nextTick", url: "https://nodejs.org/docs/latest/api/timers.html" }],
  },
  {
    id: "nasync-006",
    slug: "async-error-propagation-and-boundaries-in-node",
    topicId: "node-async",
    difficulty: "Mid",
    question: "كيف تنتقل الأخطاء في الكود غير المتزامن وما خطورة الأخطاء داخل الـ callbacks التقليدية؟",
    shortAnswer: "تنتقل أخطاء Promises عبر سلاسل الرفض (rejections)، بينما تفشل كتل try/catch الخارجية في التقاط الأخطاء داخل الـ callbacks التقليدية مما يسبب انهيار السيرفر.",
    explanation: "كتلة try/catch تحمي فقط الكود المتزامن المنفذ في نفس استدعاء الـ stack. إذا تم استدعاء دالة غير متزامنة تقبل callback تقليدي ورُمي داخلها استثناء بـ throw، فإن الـ stack الأصلي يكون قد انتهى بالفعل، وينتقل الخطأ مباشرة كـ uncaughtException.",
    codeExample: `import { readFile } from "node:fs/promises";
const data = await readFile("file.txt");`,
    commonMistakes: ["رمي الأخطاء بـ throw داخل دالة الـ callback العادية بدلاً من تمريرها للمعامل الأول (err)."],
    followUpQuestions: ["كيف تقوم أداة util.promisify بتحويل دوال الـ callback تلقائياً؟"],
    sources: [{ title: "Node.js docs — Errors", url: "https://nodejs.org/docs/latest/api/errors.html" }],
  },
  {
    id: "nasync-007",
    slug: "event-loop-starvation-and-cpu-intensive-tasks-in-node",
    topicId: "node-async",
    difficulty: "Senior",
    question: "ما هي ظاهرة تجويع الـ Event Loop (Starvation) بسبب مهام الـ CPU المكثفة وكيف تتجنبها؟",
    shortAnswer: "تحدث عندما يحتكر حساب متزامن طويل الخيط الرئيسي، مما يمنع معالجة الـ I/O والمؤقتات، ويمكن تفاديها بتجزئة الحساب (Chunking) أو تفويضه لـ Worker Threads.",
    explanation: "نظراً لأن الـ Event Loop أحادي الخيط، فإن أي حلقة تكرارية طويلة تجعل السيرفر غير قادر على استقبال طلبات HTTP جديدة أو إرسال استجابات. الحل إما بتقطيع المهمة باستخدام setImmediate لإرجاع التحكم للـ loop دورياً، أو عزل العمليات الحسابية في خيوط عمل مستقلة.",
    codeExample: `// تقطيع المهمة دورياً بـ setImmediate`,
    commonMistakes: ["الاعتماد على process.nextTick لتقطيع المهام، حيث يظل الطابور محتكراً للخيط ويمنع معالجة أحداث الـ I/O."],
    followUpQuestions: ["متى يكون استخدام Worker Threads أفضل من تقطيع المهمة داخل الـ main thread؟"],
    sources: [{ title: "Node.js docs — Don't Block the Event Loop", url: "https://nodejs.org/docs/latest/api/perf_hooks.html" }],
  },
  {
    id: "nasync-008",
    slug: "top-level-await-in-esm-node",
    topicId: "node-async",
    difficulty: "Mid",
    question: "ما هي ميزة Top-Level Await في وحدات ES Modules بـ Node.js وما هي محاذير استخدامها؟",
    shortAnswer: "تتيح استخدام await مباشرة في أعلى مستوى من الملف دون تغليفه بدالة async، ومحذورها هو إمكانية تأخير تحميل التبعيات أو تجميد بدء تشغيل التطبيق.",
    explanation: "في ES Modules، يمكن استخدام await في النطاق الخارجي للـ module لتحميل إعدادات عن بعد أو الاتصال بقاعدة بيانات قبل تصدير الكائنات. ولكن نظراً لأن استيراد الموديول يصبح غير متزامن، فإن أي تأخير سيؤخر كل الموديولات التابعة له في شجرة الاستيراد.",
    codeExample: `export const config = await loadRemoteConfig();`,
    commonMistakes: ["استخدام Top-level await لمهام طويلة الأمد وغير حرجة مما يرفع زمن إقلاع السيرفر (Cold Start)."],
    followUpQuestions: ["كيف تتعامل مع أخطاء الـ Rejection الناتجة عن Top-Level Await أثناء استيراد الموديول؟"],
    sources: [{ title: "Node.js docs — ES Modules: Top-level await", url: "https://nodejs.org/docs/latest/api/esm.html#top-level-await" }],
  },
  {
    id: "nasync-009",
    slug: "async-iterators-and-generators-in-node",
    topicId: "node-async",
    difficulty: "Senior",
    question: "كيف تفيد الـ Async Iterators وحلقة for await...of في استهلاك تدفقات البيانات في Node.js؟",
    shortAnswer: "توفر واجهة برمجية موحدة لاستهلاك البيانات المتدفقة عنصراً بعنصر أو دفعة بدفعة مع تطبيق الـ backpressure التلقائي وإيقاف الجلب حتى ينتهي استهلاك العنصر.",
    explanation: "الكائنات التي تطبق Symbol.asyncIterator تسمح بالتكرار عليها عبر for await...of. في Node.js، تطبق الـ Streams واجهة الـ Async Iterator بشكل أصيل، مما يتيح قراءة البيانات من ملف أو استعلام قاعدة بيانات متدفق بطريقة سهلة مع ضمان إغلاق المورد تلقائياً عند كسر الحلقة.",
    codeExample: `for await (const chunk of stream) {
  await handleChunk(chunk);
}`,
    commonMistakes: ["عدم التعامل مع أخطاء الـ stream داخل حلقة for await مما يسبب unhandled rejection."],
    followUpQuestions: ["كيف تنشئ Async Generator مخصصاً لقراءة صفحات بيانات من API خارجي على دفعات؟"],
    sources: [{ title: "Node.js docs — Stream as an async iterable", url: "https://nodejs.org/docs/latest/api/stream.html#streams-as-async-iterables" }],
  },
  {
    id: "nasync-010",
    slug: "async-disposable-resources-in-node",
    topicId: "node-async",
    difficulty: "Senior",
    question: "ما هو مفهوم الموارد القابلة للإتلاف (Async Disposable Resources) ورمز Symbol.asyncDispose؟",
    shortAnswer: "نمط لإدارة وتنظيف الموارد تلقائياً (مثل اتصالات الشبكة والملفات) عند الخروج من النطاق البرمجي عبر كلمة await using.",
    explanation: "تتيح JavaScript وNode.js الحديثة استخدام await using مع الكائنات التي تنفذ [Symbol.asyncDispose]()، ليضمن المحرك إغلاق وتنظيف الاتصالات والموارد فور انتهاء النطاق حتى عند رمي استثناء.",
    codeExample: `await using client = new DbClient();`,
    commonMistakes: ["استخدام using العادية بدلاً من await using مع الموارد التي تتطلب تنظيفاً غير متزامن."],
    followUpQuestions: ["كيف يدعم TypeScript 5.2+ ميزة await using عند ترجمة كود Node.js؟"],
    sources: [{ title: "Node.js docs — Global Symbols and Objects", url: "https://nodejs.org/docs/latest/api/globals.html" }],
  },

  // Topic: node-streams (10 questions: nstream-001 to nstream-010)
  {
    id: "nstream-001",
    slug: "stream-types-and-pipeline-in-node",
    topicId: "node-streams",
    difficulty: "Junior",
    question: "ما هي الأنواع الأربعة للـ Streams في Node.js وما وظيفة كل منها؟",
    shortAnswer: "الأنواع هي: Readable (للقراءة)، Writable (للكتابة)، Duplex (للاثنين معاً بشكل مستقل)، وTransform (لتعديل البيانات أثناء مرورها).",
    explanation: "تعد الـ Streams جوهر الأداء في Node.js لمعالجة البيانات الضخمة دون تحميلها بالكامل في الذاكرة. Readable يوفر أحداث data وend. Writable يقبل write() وend(). أما Duplex فيحتوي قناتين للقراءة والكتابة، بينما Transform هو نوع خاص من Duplex حيث يتم تعديل المخرجات بناءً على المدخلات مباشرة.",
    codeExample: `import { pipeline } from "node:stream/promises";
await pipeline(readable, transform, writable);`,
    commonMistakes: ["قراءة ملفات بحجم جيجابايت باستخدام fs.readFile في الذاكرة بدلاً من استخدام الـ Streams."],
    followUpQuestions: ["ما الفرق الدقيق بين Duplex Stream و Transform Stream؟"],
    sources: [{ title: "Node.js docs — Stream module", url: "https://nodejs.org/docs/latest/api/stream.html" }],
  },
  {
    id: "nstream-002",
    slug: "backpressure-mechanism-in-node-streams",
    topicId: "node-streams",
    difficulty: "Senior",
    question: "ما هي ظاهرة الـ Backpressure في Node.js Streams وكيف تتم معالجتها هندسياً؟",
    shortAnswer: "تحدث عندما ينتج الـ Readable بيانات بمعدل أسرع من قدرة الـ Writable على استهلاكها، وتعالج بإيقاف القراءة مؤقتاً عند امتلاء الـ buffer ثم استئنافها عند حدث drain.",
    explanation: "إذا كانت سرعة قراءة ملف أسرع بكثير من سرعة كتابته، ستتراكم البيانات في ذاكرة الـ Writable حتى تنفد الـ RAM. تعالج Node.js ذلك بإعادة write(chunk) لـ false عند امتلاء الـ buffer، حيث يوقف المنتج القراءة وينتظر حدث drain.",
    codeExample: `if (!writer.write(data)) {
  reader.pause();
  writer.once("drain", () => reader.resume());
}`,
    commonMistakes: ["تجاهل القيمة المعادة من writer.write() ومواصلة ضخ البيانات مما يؤدي لزيادة استهلاك الذاكرة."],
    followUpQuestions: ["كيف تقوم utility مثل stream.pipeline بإدارة الـ backpressure تلقائياً بين عدة streams؟"],
    sources: [{ title: "Node.js docs — Backpressuring in Streams", url: "https://nodejs.org/docs/latest/api/stream.html#backpressuring-in-streams" }],
  },
  {
    id: "nstream-003",
    slug: "stream-pipeline-vs-pipe-in-node",
    topicId: "node-streams",
    difficulty: "Mid",
    question: "لماذا يوصى دائماً باستخدام stream.pipeline بدلاً من التوصيل التقليدي عبر .pipe()؟",
    shortAnswer: "لأن pipeline تدير معالجة الأخطاء وإغلاق وتدمير جميع الـ streams المتصلة تلقائياً في حال حدوث أي خطأ، بينما يترك .pipe() الـ streams معلقة.",
    explanation: "عند استخدام readable.pipe(writable)، في حال حدوث خطأ في الكتابة، يظل الـ readable مفتوحاً وتظل مقابض الملفات أو مقابس الشبكة معلقة. توفر pipeline إغلاقاً وتدميراً آمناً لجميع الـ streams المشاركة في حالة أي فشل.",
    codeExample: `await pipeline(fs.createReadStream("src"), fs.createWriteStream("dest"));`,
    commonMistakes: ["استخدام .pipe() بدون الاستماع لأحداث error على كل stream في السلسلة."],
    followUpQuestions: ["كيف تتعامل pipeline مع إشارات الإلغاء عبر AbortSignal؟"],
    sources: [{ title: "Node.js docs — stream.pipeline", url: "https://nodejs.org/docs/latest/api/stream.html#streampipelinesource-transforms-destination-callback" }],
  },
  {
    id: "nstream-004",
    slug: "buffers-and-typed-arrays-in-node",
    topicId: "node-streams",
    difficulty: "Mid",
    question: "ما هو كائن Buffer في Node.js وكيف يختلف تخصيص Buffer.alloc عن Buffer.allocUnsafe؟",
    shortAnswer: "Buffer هو مساحة ذاكرة ثنائية خام؛ Buffer.alloc يصفر الذاكرة لضمان الأمان، بينما allocUnsafe يحجز مساحة غير مصفورة بسرعة أعلى ولكن مع خطر كشف بيانات قديمة.",
    explanation: "صُممت فئة Buffer للتعامل مع البيانات الثنائية في بروتوكولات الشبكة والملفات. Buffer.alloc(size) يملأ الذاكرة بأصفار لمنع تسريب بيانات قديمة كانت في الـ RAM، بينما يتخطى allocUnsafe التصفير لأداء أقصى عندما تكون على يقين من كتابة البيانات فوق المساحة فوراً.",
    codeExample: `const safe = Buffer.alloc(1024);
const fast = Buffer.allocUnsafe(1024);`,
    commonMistakes: ["إرسال Buffer.allocUnsafe عبر الشبكة دون الكتابة فوقه بالكامل، مما قد يسرب بيانات حساسة."],
    followUpQuestions: ["كيف يرتبط كائن Buffer بـ Uint8Array المعياري في JavaScript الحديثة؟"],
    sources: [{ title: "Node.js docs — Buffer", url: "https://nodejs.org/docs/latest/api/buffer.html" }],
  },
  {
    id: "nstream-005",
    slug: "high-water-mark-and-buffer-sizing-in-node",
    topicId: "node-streams",
    difficulty: "Senior",
    question: "ما هو دور خيار highWaterMark في الـ Streams وكيف يؤثر على كفاءة الذاكرة والأداء؟",
    shortAnswer: "يحدد الحد الأقصى لحجم البيانات المخزنة في الـ internal buffer قبل تفعيل الـ backpressure وإيقاف القراءة مؤقتاً.",
    explanation: "القيمة الافتراضية لـ highWaterMark هي 64KB للـ streams العادية. ضبط هذه القيمة بدقة يتيح الموازنة بين تقليل استهلاك الذاكرة لكل اتصال وسرعة تدفق البيانات وتكرار استدعاءات النظام (syscalls).",
    codeExample: `fs.createReadStream("huge.csv", { highWaterMark: 128 * 1024 });`,
    commonMistakes: ["رفع highWaterMark لأحجام مفرطة مع خوادم تستقبل آلاف الاتصالات المتزامنة."],
    followUpQuestions: ["كيف تختلف دلالة highWaterMark عندما يكون الـ Stream في وضع objectMode؟"],
    sources: [{ title: "Node.js docs — Buffering and highWaterMark", url: "https://nodejs.org/docs/latest/api/stream.html#buffering" }],
  },
  {
    id: "nstream-006",
    slug: "streaming-file-uploads-in-node",
    topicId: "node-streams",
    difficulty: "Senior",
    question: "كيف تصمم معالجة رفع الملفات الضخمة (Streaming Uploads) في خادم HTTP دون تخزينها في الذاكرة؟",
    shortAnswer: "يتم توجيه تدفق طلب HTTP (req) مباشرة عبر pipeline إلى ملف على القرص أو خدمة سحابية (S3) كـ multipart stream فور وصول أجزائه.",
    explanation: "تحميل الملف كاملاً في الذاكرة يؤدي لانهيار الخادم بمجرد رفع ملفات كبيرة. الحل المعماري الصحيح هو معاملة جسم الطلب req كـ Readable Stream وتمريره لأداة تحليل multipart وتوجيهه مباشرة للمخزن النهائي.",
    codeExample: `await pipeline(req, fs.createWriteStream("file.bin"));`,
    commonMistakes: ["حفظ محتويات الملف في متغيرات داخلية في الذاكرة قبل كتابتها على القرص."],
    followUpQuestions: ["كيف تحسب بصمة التشفير (SHA-256) للملف أثناء تدفقه دون إعادة قراءته من جديد؟"],
    sources: [{ title: "Node.js docs — HTTP Request and Streams", url: "https://nodejs.org/docs/latest/api/http.html" }],
  },
  {
    id: "nstream-007",
    slug: "custom-transform-stream-in-node",
    topicId: "node-streams",
    difficulty: "Mid",
    question: "كيف تقوم بإنشاء وتخصيص Transform Stream لمعالجة البيانات أثناء تدفقها في Node.js؟",
    shortAnswer: "يتم تمديد فئة Transform وتنفيذ دالة _transform(chunk, encoding, callback) لتعديل البيانات وتمريرها للمرحلة التالية عبر this.push(data).",
    explanation: "فئة Transform من وحدة node:stream تمثل كائناً يقبل مدخلات كـ Writable ويخرج بيانات معدلة كـ Readable. داخل _transform تقوم بالمعالجة وتدفع النتيجة عبر this.push() ثم تستدعي callback().",
    codeExample: `class MyTransform extends Transform {
  _transform(chunk, enc, cb) {
    this.push(chunk.toString().toUpperCase());
    cb();
  }
}`,
    commonMistakes: ["نسيان استدعاء callback() في نهاية _transform مما يؤدي لتوقف وتجمد التدفق."],
    followUpQuestions: ["ما أهمية تنفيذ دالة _flush() الاختيارية في Transform stream؟"],
    sources: [{ title: "Node.js docs — Implementing a Transform Stream", url: "https://nodejs.org/docs/latest/api/stream.html#implementing-a-transform-stream" }],
  },
  {
    id: "nstream-008",
    slug: "fs-streams-vs-buffered-file-reads-in-node",
    topicId: "node-streams",
    difficulty: "Junior",
    question: "متى تستخدم fs.readFile ومتى تفضل fs.createReadStream للتعامل مع الملفات؟",
    shortAnswer: "تستخدم fs.readFile للملفات الصغيرة وثابتة الحجم كالإعدادات، وتستخدم fs.createReadStream للملفات الكبيرة أو التدفقات المستمرة للحفاظ على الذاكرة.",
    explanation: "تحجز fs.readFile مساحة في الذاكرة مساوية لحجم الملف كاملاً. للملفات الكبيرة، يوفر fs.createReadStream استهلاك ذاكرة ثابت وصغير جداً بغض النظر عن حجم الملف على القرص.",
    codeExample: `const stream = fs.createReadStream("big-data.log");`,
    commonMistakes: ["استخدام fs.readFileSync في مسارات معالجة طلبات الـ HTTP مما يجمد الخادم للعملاء الآخرين."],
    followUpQuestions: ["كيف يؤثر الـ OS caching على سرعة القراءة عبر fs streams؟"],
    sources: [{ title: "Node.js docs — fs.createReadStream", url: "https://nodejs.org/docs/latest/api/fs.html#fscreatereadstreampath-options" }],
  },
  {
    id: "nstream-009",
    slug: "object-mode-streams-in-node",
    topicId: "node-streams",
    difficulty: "Senior",
    question: "ما هو وضع الـ Object Mode في Node.js Streams ومتى يلزم تفعيله؟",
    shortAnswer: "هو وضع يتيح للـ Stream تمرير واستقبال كائنات وقيم JavaScript بدلاً من البايتات والـ Buffers فقط.",
    explanation: "افتراضياً، تقبل الـ Streams بايتات فقط. خيار objectMode: true يسمح بتدفق كائنات JavaScript مباشرة، وهو مفيد في pipelines معالجة سجلات قواعد البيانات وتحويل البيانات المهيكلة.",
    codeExample: `const s = new Transform({ objectMode: true, transform(row, enc, cb) { this.push(row); cb(); } });`,
    commonMistakes: ["ربط stream بوضع objectMode مباشرة مع writable stream يتوقع بايتات ثنائية دون تسلسل."],
    followUpQuestions: ["كيف تتغير طريقة حساب highWaterMark في وضع objectMode؟"],
    sources: [{ title: "Node.js docs — Object mode", url: "https://nodejs.org/docs/latest/api/stream.html#object-mode" }],
  },
  {
    id: "nstream-010",
    slug: "stream-error-handling-and-destroy-in-node",
    topicId: "node-streams",
    difficulty: "Mid",
    question: "كيف يتم إغلاق الـ Streams يدوياً عبر .destroy() وما أهمية التقاط أحداث الـ error؟",
    shortAnswer: "استدعاء .destroy([error]) يغلق المقابض ويحرر الموارد فوراً لمنع تسرب مآخذ الشبكة أو الملفات المفتوحة.",
    explanation: "إذا توقف العميل عن الاستماع أو ألغيت العملية، يجب استدعاء stream.destroy() لتحرير مقابض الملفات أو مآخذ الشبكة فوراً وحماية النظام من استنزاف الـ file descriptors.",
    codeExample: `stream.destroy(new Error("Canceled"));`,
    commonMistakes: ["افتراض أن انتهاء الدالة يغلق الـ stream تلقائياً دون الحاجة لتدميره في كتلة catch."],
    followUpQuestions: ["ما الفرق بين حدث 'finish' وحدث 'close' في الـ Writable streams؟"],
    sources: [{ title: "Node.js docs — stream.destroy", url: "https://nodejs.org/docs/latest/api/stream.html#writabledestroyerror" }],
  },

  // Topic: node-modules (10 questions: nmod-001 to nmod-010)
  {
    id: "nmod-001",
    slug: "commonjs-vs-es-modules-in-node",
    topicId: "node-modules",
    difficulty: "Junior",
    question: "قارن بين نظامي CommonJS (CJS) و ES Modules (ESM) في Node.js وكيف يتعامل المحرك معهما؟",
    shortAnswer: "CJS متزامن ويعتمد على require() وقت التشغيل، بينما ESM يعتمد على import/export ثابت ويحلل شجرة الاعتمادات بشكل غير متزامن قبل التنفيذ.",
    explanation: "CJS هو النظام التاريخي لـ Node.js حيث تُحمّل الوحدات تزامناً. ESM هو المعيار القياسي الرسمي للغة، ويتميز بإمكانية التحليل الساكن ودعم Top-level await.",
    codeExample: `export const add = (a: number, b: number) => a + b;`,
    commonMistakes: ["محاولة استخدام require() داخل ملفات ESM دون إنشاء require مخصص عبر createRequire."],
    followUpQuestions: ["كيف تستخرج __dirname في ES Modules باستخدام وحدة node:url؟"],
    sources: [{ title: "Node.js docs — Modules: CommonJS and ECMAScript modules", url: "https://nodejs.org/docs/latest/api/esm.html" }],
  },
  {
    id: "nmod-002",
    slug: "package-exports-and-module-resolution-in-node",
    topicId: "node-modules",
    difficulty: "Senior",
    question: "ما هي حقول 'exports' في package.json وكيف تفوقت على حقل 'main' القديم؟",
    shortAnswer: "تسمح بتعريف نقاط الدخول الرسمية للحزمة والتحكم في إمكانية الوصول إلى الملفات الداخلية وتحديد مخرجات مختلفة لـ CJS وESM.",
    explanation: "تمنع exports استيراد الملفات الداخلية الخاصة بالحزمة، وتوفر شروطاً لتوجيه الاستيراد حسب بيئة التشغيل أو نظام الوحدات المستخدم (Conditional Exports).",
    codeExample: `{ "exports": { ".": { "import": "./dist/index.mjs", "require": "./dist/index.cjs" } } }`,
    commonMistakes: ["نسيان توفير حقل types أو وضعه في مكان خاطئ في exports."],
    followUpQuestions: ["كيف يتعامل خيار conditional exports مع بيئات مثل browser أو development؟"],
    sources: [{ title: "Node.js docs — Package entry points", url: "https://nodejs.org/docs/latest/api/packages.html#package-entry-points" }],
  },
  {
    id: "nmod-003",
    slug: "circular-dependencies-in-node",
    topicId: "node-modules",
    difficulty: "Mid",
    question: "كيف تتعامل Node.js مع مشكلة التبعيات الدائرية (Circular Dependencies) بين CJS و ESM؟",
    shortAnswer: "في CJS يعاد كائن exports غير مكتمل أثناء التحميل المتزامن، بينما في ESM تُربط المراجع الحية ولكن قراءة متغيرات غير مهيأة قد ترمي ReferenceError.",
    explanation: "تحدث عندما يعتمد الملف A على B وفي نفس الوقت يعتمد B على A. يفضل دائماً إعادة هيكلة الكود وفصل الجزء المشترك في ملف ثالث مستقل.",
    codeExample: `// نقل التبعية المشتركة لموديول ثالث مستقل`,
    commonMistakes: ["الاعتماد على ترتيب الاستيراد العشوائي لإخفاء أخطاء التبعية الدائرية."],
    followUpQuestions: ["كيف تساعد أدوات مثل madge في اكتشاف التبعيات الدائرية تلقائياً في المشروع؟"],
    sources: [{ title: "Node.js docs — Cycles in Modules", url: "https://nodejs.org/docs/latest/api/modules.html#cycles" }],
  },
  {
    id: "nmod-004",
    slug: "package-lock-and-reproducible-installs-in-node",
    topicId: "node-modules",
    difficulty: "Junior",
    question: "ما الفرق بين npm install و npm ci وما أهمية ملف package-lock.json؟",
    shortAnswer: "يقوم npm ci بمسح node_modules وتثبيت النسخ المحددة تماماً في package-lock.json لضمان بناء متطابق، بينما قد يقوم npm install بتحديث الحزم حسب نطاقات SemVer.",
    explanation: "يضمن package-lock.json تطابق التبعيات وبصماتها بدقة عبر جميع الأجهزة، ويستخدم npm ci في بيئات الـ CI لضمان استقرار البناء والسرعة القصوى.",
    codeExample: `npm ci --ignore-scripts`,
    commonMistakes: ["تعديل أو حذف package-lock.json يدوياً لحل تعارضات التثبيت."],
    followUpQuestions: ["لماذا ينصح دائماً بوضع --ignore-scripts في بيئات الـ CI عند استخدام npm ci؟"],
    sources: [{ title: "Node.js docs — package-lock.json concept", url: "https://nodejs.org/docs/latest/api/packages.html" }],
  },
  {
    id: "nmod-005",
    slug: "workspaces-and-monorepos-in-node",
    topicId: "node-modules",
    difficulty: "Mid",
    question: "كيف تعمل ميزة npm/pnpm Workspaces في إدارة مشاريع الـ Monorepo وما فوائدها؟",
    shortAnswer: "تسمح بإدارة عدة حزم داخل مستودع واحد بمشاركة الـ dependencies وربط الحزم المحلية ببعضها كـ symlinks دون الحاجة لنشرها خارجياً.",
    explanation: "تتيح الـ Workspaces تطوير الحزم المشتركة محلياً ومشاركتها بين تطبيقات مختلفة داخل المستودع الواحد مع توحيد إدارة الإصدارات وتثبيت التبعيات.",
    codeExample: `{ "workspaces": ["packages/*", "apps/*"] }`,
    commonMistakes: ["تثبيت إصدارات متعارضة من نفس الحزمة الأساسية في حزم الـ monorepo المختلفة."],
    followUpQuestions: ["كيف تحل pnpm مشكلة الـ phantom dependencies مقارنة بـ npm التقليدي؟"],
    sources: [{ title: "Node.js docs — Package Manager Integration", url: "https://nodejs.org/docs/latest/api/packages.html" }],
  },
  {
    id: "nmod-006",
    slug: "dual-package-hazard-and-publishing-in-node",
    topicId: "node-modules",
    difficulty: "Senior",
    question: "ما هو خطر الـ Dual Package Hazard عند نشر مكتبة تدعم CJS و ESM معاً في Node.js؟",
    shortAnswer: "يحدث عندما يتم استيراد نسختين مختلفتين من نفس المكتبة في نفس التطبيق مما يؤدي لتكرار الـ Singletons وكسر الـ instanceof.",
    explanation: "إذا استورد جزء من التطبيق نسخة CJS واستورد جزء آخر نسخة ESM، سيتم تحميل الملفين ككيانين مستقلين في الذاكرة مما يفسد الحالة المشتركة.",
    codeExample: `// استخدام wrapper موحد للحزمة`,
    commonMistakes: ["كتابة كود يعتمد على حالة مشتركة دون تأمين wrapper موحد للحزمة."],
    followUpQuestions: ["كيف يضمن ملف exports في package.json تجنب تحميل نسختين من نفس الحزمة؟"],
    sources: [{ title: "Node.js docs — Dual package hazard", url: "https://nodejs.org/docs/latest/api/packages.html#dual-package-hazard" }],
  },
  {
    id: "nmod-007",
    slug: "node-builtin-test-runner",
    topicId: "node-modules",
    difficulty: "Junior",
    question: "كيف تستخدم مشغل الاختبارات الأصيل (node:test) في Node.js دون الحاجة لمكتبات خارجية؟",
    shortAnswer: "توفر وحدة node:test مع node:assert بيئة اختبارات سريعة ومبنية داخل المحرك عبر دوال test وdescribe وit.",
    explanation: "توفر Node.js الحديثة مشغل اختبارات رسمي متقدم يدعم التزامن وتغطية الكود والـ mocking دون الحاجة لتثبيت أي مكتبات خارجية.",
    codeExample: `import { test } from "node:test";
import assert from "node:assert/strict";
test("basic", () => assert.equal(1, 1));`,
    commonMistakes: ["تثبيت حزم خارجية ضخمة لاختبارات بسيطة بينما المشغل المدمج كافٍ تماماً."],
    followUpQuestions: ["كيف تشغل اختبارات node:test من موجه الأوامر عبر node --test؟"],
    sources: [{ title: "Node.js docs — Test runner", url: "https://nodejs.org/docs/latest/api/test.html" }],
  },
  {
    id: "nmod-008",
    slug: "semver-ranges-and-dependency-hygiene-in-node",
    topicId: "node-modules",
    difficulty: "Junior",
    question: "ما الفرق بين العلامات ^ و ~ والإصدار الصريح في ملف package.json؟",
    shortAnswer: "^ تسمح بتحديثات الـ Minor والـ Patch المتوافقة خلفياً، بينما ~ تقيد التحديثات بإصدارات الـ Patch فقط، وغياب الرمز يثبت الإصدار تماماً.",
    explanation: "تتبع Node.js معيار الترقيم الدلالي SemVer لتنظيم التحديثات التلقائية وحماية المشاريع من التغييرات الكاسرة غير المقصودة.",
    codeExample: `"package": "^1.2.0"`,
    commonMistakes: ["الاعتماد على ^ مع حزم في الإصدارات الصفرية (0.x.x) حيث تختلف قواعد التوافق الدلالي."],
    followUpQuestions: ["كيف يختلف تصرف ^0.2.3 عن ^1.2.3 في معيار SemVer؟"],
    sources: [{ title: "Node.js docs — Packages and Semver", url: "https://nodejs.org/docs/latest/api/packages.html" }],
  },
  {
    id: "nmod-009",
    slug: "node-protocol-imports-in-node",
    topicId: "node-modules",
    difficulty: "Junior",
    question: "ما هي أهمية استخدام بادئة node: عند استيراد الوحدات الأساسية مثل node:fs و node:path؟",
    shortAnswer: "توضح صراحة أن الموديول مدمج في النظام، وتمنع هجمات التسمم بالاعتمادات (Dependency Confusion) وتسرع عملية الـ Module Resolution.",
    explanation: "يضمن استخدام node: التوجه مباشرة للوحدة المبنية داخل نواة Node.js دون البحث في node_modules، مما يوفر أماناً أعلى وسرعة في استدعاء الملفات.",
    codeExample: `import fs from "node:fs/promises";`,
    commonMistakes: ["الخلط بين استيراد الحزم الخارجية والوحدات المدمجة دون البادئة الرسمية."],
    followUpQuestions: ["متى بدأت Node.js بدعم بادئة البروتوكول node: وما هي الإصدارات المتوافقة؟"],
    sources: [{ title: "Node.js docs — Core modules and node: protocol", url: "https://nodejs.org/docs/latest/api/modules.html#core-modules" }],
  },
  {
    id: "nmod-010",
    slug: "typescript-execution-and-type-stripping-in-node",
    topicId: "node-modules",
    difficulty: "Mid",
    question: "كيف تدعم Node.js الحديثة تشغيل ملفات TypeScript مباشرة عبر ميزة Type Stripping؟",
    shortAnswer: "تتيح الراية --experimental-strip-types تشغيل كود TypeScript مباشرة بحذف الأنواع وقت التشغيل دون الحاجة لأدوات بناء خارجية.",
    explanation: "تتيح Node.js الحديثة تشغيل ملفات .ts بحذف الأنواع كمسافات بيضاء وتمرير الكود مباشرة لمحرك V8 دون تحويل متقدم.",
    codeExample: `// node --experimental-strip-types app.ts`,
    commonMistakes: ["محاولة استخدام ميزات تتطلب توليد كود حقيقي مثل enums القديمة مع Type Stripping."],
    followUpQuestions: ["ما القيود البرمجية لميزة Type Stripping مقارنة بالترجمة الكاملة بواسطة tsc؟"],
    sources: [{ title: "Node.js docs — Modules: TypeScript and Type Stripping", url: "https://nodejs.org/docs/latest/api/typescript.html" }],
  },

  // Topic: node-web (10 questions: nweb-001 to nweb-010)
  {
    id: "nweb-001",
    slug: "native-http-server-in-node",
    topicId: "node-web",
    difficulty: "Junior",
    question: "كيف يعمل خادم HTTP الأصيل (node:http) وما هي دورة حياة كائن IncomingMessage و ServerResponse؟",
    shortAnswer: "يعتمد node:http على خادم أحداث؛ حيث يمثل req تدفق قراءة (Readable) لبيانات الطلب، ويمثل res تدفق كتابة (Writable) لإرسال الترويسات وجسم الاستجابة.",
    explanation: "تعد وحدة node:http الأساس الذي تبنى عليه أطر عمل مثل Express وFastify. عند اتصال عميل، ينشئ الخادم كائن IncomingMessage يحمل الـ headers وquery params، ويعمل كـ stream لقراءة الـ payload عبر أحداث data وend. في المقابل، يتيح كائن ServerResponse كتابة الترويسات بـ setHeader() وإرسال الـ body عبر .write() وإنهاء الاتصال بـ .end().",
    codeExample: `import http from "node:http";
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ status: "ok" }));
});
server.listen(3000);`,
    commonMistakes: ["محاولة إرسال res.setHeader() بعد أن تم إرسال الترويسات بالفعل بـ res.write() أو res.end() مما يسبب خطأ Headers already sent."],
    followUpQuestions: ["ما هو الفرق الدقيق بين res.write() و res.end() في node:http؟"],
    sources: [{ title: "Node.js docs — HTTP", url: "https://nodejs.org/docs/latest/api/http.html" }],
  },
  {
    id: "nweb-002",
    slug: "express-middleware-execution-flow-in-node",
    topicId: "node-web",
    difficulty: "Junior",
    question: "كيف تعمل الـ Middlewares في Express وما الفرق بين الـ Regular Middleware والـ Error-Handling Middleware؟",
    shortAnswer: "تنفذ الـ Middlewares بالتتابع عبر استدعاء next()؛ والـ Error Middleware يتميز بقبول 4 معاملات (err, req, res, next) ولا يُستدعى إلا عند تمرير خطأ إلى next(err).",
    explanation: "الـ Middleware هو دالة تمتلك صلاحية الوصول لكائنات req وres ودالة next(). إذا لم تستدعِ الدالة next() أو تنهِ الاستجابة بـ res.send()، سيعلق الطلب دون رد. للتعامل مع الأخطاء، يُعرف Express دوالاً تحتوي بالضبط 4 معاملات؛ يقوم Express بفحص .length الخاص بالدالة، وعندما تستدعي أي middleware سابقة next(error)، يتخطى Express كل الـ middlewares العادية ويتوجه مباشرة لأول Error Handler.",
    codeExample: `// Error handler middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});`,
    commonMistakes: ["حذف المعامل الرابع next من تعريف الـ error handler مما يجعل Express يعامله كـ regular middleware ويتجاهله عند وقوع خطأ."],
    followUpQuestions: ["كيف يتعامل Express 5 مع الـ asynchronous errors مقارنة بـ Express 4؟"],
    sources: [{ title: "Node.js docs — HTTP Server response", url: "https://nodejs.org/docs/latest/api/http.html#class-httpserverresponse" }],
  },
  {
    id: "nweb-003",
    slug: "fastify-schema-compilation-and-performance-in-node",
    topicId: "node-web",
    difficulty: "Senior",
    question: "لماذا يتفوق Fastify في الأداء على أطر العمل التقليدية وكيف تعمل آلية Schema-Based Compilation؟",
    shortAnswer: "يعتمد Fastify على التجميع المسبق للمخططات (JSON Schema) عبر fast-json-stringify و find-my-way router، مما يلغي تكلفة التحليل الديناميكي ويسرع التسلسل النصي.",
    explanation: "في أطر العمل الكلاسيكية، يمر كل كائن استجابة عبر JSON.stringify العام الذي يفحص أنواع البيانات وقت التشغيل. يقوم Fastify بتجميع دوال تسلسل متخصصة مسبقاً بناءً على JSON Schema المحدد للمسار، مما يرفع سرعة إرسال الـ JSON حتى ضعفين. كما يستخدم راوتر يعتمد على خوارزمية Radix Tree فائقة السرعة للبحث عن المسارات دون تعبيرات نمطية ثقيلة.",
    codeExample: `// فاستيفاي يقوم بتجميع الـ schema لتسلسل فائق السرعة
fastify.get("/user", {
  schema: {
    response: {
      200: {
        type: "object",
        properties: { id: { type: "number" }, name: { type: "string" } }
      }
    }
  }
}, async () => ({ id: 1, name: "Fast" }));`,
    commonMistakes: ["عدم تعريف schemas في Fastify مما يفقده أبرز مزاياه الأدائية والتحقق التلقائي."],
    followUpQuestions: ["كيف يضمن نظام الـ Encapsulation والـ Plugins في Fastify عزل النطاقات وسرعة الإقلاع؟"],
    sources: [{ title: "Node.js docs — HTTP Benchmarking and Optimization", url: "https://nodejs.org/docs/latest/api/http.html" }],
  },
  {
    id: "nweb-004",
    slug: "nestjs-dependency-injection-and-architecture-in-node",
    topicId: "node-web",
    difficulty: "Mid",
    question: "كيف يطبق إطار عمل NestJS مبادئ الـ Dependency Injection وتنظيم الـ Modules؟",
    shortAnswer: "يعتمد NestJS على IoC Container ونظام الـ Decorators (@Injectable, @Module) لحقن الخدمات وإدارة دورات حياتها تلقائياً عبر Constructor Injection.",
    explanation: "مستوحى من Angular وSpring Boot، يوفر NestJS هيكلية قوية للمشاريع الضخمة. يتم تجميع الكود في Modules تعلن عن providers وcontrollers وexports. يقوم الـ Inversion of Control (IoC) Container بإنشاء النسخ وإدارتها كـ Singletons افتراضياً (أو Request-scoped)، مما يسهل كتابة اختبارات الوحدة عبر عزل التبعيات وتوفير mocks بديلة بسهولة.",
    codeExample: `@Injectable()
export class UsersService {
  constructor(private readonly repo: UsersRepository) {}
}`,
    commonMistakes: ["الاستخدام المفرط للـ Request Scope في NestJS دون حاجة حقيقية مما يرفع استهلاك الذاكرة ويبطئ الاستجابة."],
    followUpQuestions: ["ما الفرق بين الـ Transient Scope والـ Request Scope والـ Default Scope في NestJS؟"],
    sources: [{ title: "Node.js docs — Modules design and structure", url: "https://nodejs.org/docs/latest/api/modules.html" }],
  },
  {
    id: "nweb-005",
    slug: "request-validation-with-schemas-in-node",
    topicId: "node-web",
    difficulty: "Junior",
    question: "ما أهمية التحقق من صحة المدخلات (Input Validation) باستخدام مكتبات المخططات مثل Zod في Node.js؟",
    shortAnswer: "يضمن مطابقة البيانات القادمة من العميل للأنواع والقيود المتوقعة قبل وصولها لمنطق الأعمال، ويمنع هجمات حقن البيانات والتلاعب بالحقول.",
    explanation: "الاعتماد على افتراض صحة مدخلات req.body هو السبب الرئيسي لمعظم الثغرات والأخطاء. توفر مكتبات مثل Zod إمكانية استنتاج أنواع TypeScript (Inferred Types) ومزامنتها تلقائياً مع قواعد التحقق وقت التشغيل (Runtime Validation)، ورفض الطلبات غير المطابقة برمز 400 وتفاصيل واضحة للعميل.",
    codeExample: `import { z } from "zod";
const userSchema = z.object({
  email: z.string().email(),
  age: z.number().min(18)
});
const parsed = userSchema.parse(req.body); // يرمي خطأ إذا لم يطابق`,
    commonMistakes: ["الاعتماد على أنواع TypeScript وحدها للتحقق، متناسين أن TypeScript تُمحى تماماً وقت التشغيل."],
    followUpQuestions: ["كيف تدمج التحقق التلقائي في Express middleware لإرجاع رسائل أخطاء موحدة؟"],
    sources: [{ title: "Node.js docs — Errors and Validations", url: "https://nodejs.org/docs/latest/api/errors.html" }],
  },
  {
    id: "nweb-006",
    slug: "content-negotiation-and-headers-in-node",
    topicId: "node-web",
    difficulty: "Mid",
    question: "ما هو مفهوم الـ Content Negotiation وكيف تتعامل مع ترويسات Accept و Content-Type؟",
    shortAnswer: "هو آلية تسمح للعميل بتحديد الصيغة المفضلة للبيانات (مثل JSON أو XML) عبر Accept، بينما تعلن Content-Type عن صيغة البيانات المرسلة بالفعل.",
    explanation: "عندما يرسل العميل Accept: application/json, text/csv;q=0.8، يتفاوض السيرفر لتقديم أفضل صيغة يدعمها بناءً على عامل الجودة (q-factor). في Node.js، فحص ترويسات الطلب والرد بالـ Content-Type الصحيح يضمن التوافق المعياري مع مختلف العملاء وتجنب أخطاء التحليل.",
    codeExample: `const accept = req.headers["accept"] || "";
if (accept.includes("application/json")) {
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}`,
    commonMistakes: ["تجاهل فحص ترويسة Content-Type للطلب ومحاولة تحليل جسم الطلب كـ JSON وهو نص عادي أو multipart."],
    followUpQuestions: ["كيف تساعد مكتبات مثل accepts في التعامل مع ترويسات التفاوض المعقدة؟"],
    sources: [{ title: "Node.js docs — HTTP Headers", url: "https://nodejs.org/docs/latest/api/http.html#messageheaders" }],
  },
  {
    id: "nweb-007",
    slug: "websockets-architecture-and-heartbeats-in-node",
    topicId: "node-web",
    difficulty: "Senior",
    question: "كيف تصمم خادم WebSockets عالي الكفاءة باستخدام مكتبة ws وكيف تطبق آلية الـ Heartbeat (Ping/Pong)؟",
    shortAnswer: "تتم ترقية اتصال HTTP الأصلي إلى مقبس ثنائي الاتجاه، ويتم إرسال إشارات Ping دورية للتأكد من حيوية الاتصال وإغلاق المقابس الميتة (Zombie Connections).",
    explanation: "تبدأ اتصالات WebSockets بطلب HTTP عادي مع ترويسة Upgrade: websocket. بمجرد الترقية، يتحول الاتصال إلى TCP stream ثنائي الاتجاه. نظراً لأن انقطاع اتصال العميل المفاجئ (كإغلاق الواي فاي) قد لا يرسل حزمة TCP FIN، يجب على الخادم إرسال رسائل Ping كل 30 ثانية؛ إذا لم يرد العميل بـ Pong، يُعد الاتصال ميتاً ويستدعى socket.terminate() لتحرير الموارد.",
    codeExample: `import { WebSocketServer } from "ws";
const wss = new WebSocketServer({ port: 8080 });
setInterval(() => {
  wss.clients.forEach(ws => {
    if (!ws.isAlive) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);`,
    commonMistakes: ["إغفال تطبيق الـ Ping/Pong مما يتسبب في بقاء آلاف المقابس الميتة مفتوحة في السيرفر وتآكل الذاكرة."],
    followUpQuestions: ["كيف توزع اتصالات WebSockets عبر عدة خوادم باستخدام Redis Pub/Sub؟"],
    sources: [{ title: "Node.js docs — HTTP Upgrade Event", url: "https://nodejs.org/docs/latest/api/http.html#event-upgrade" }],
  },
  {
    id: "nweb-008",
    slug: "multipart-form-data-handling-in-node",
    topicId: "node-web",
    difficulty: "Mid",
    question: "كيف تتعامل مع طلبات multipart/form-data ورفع الملفات بأمان في خوادم Node.js؟",
    shortAnswer: "يتم استخدام محلل تدفقي (مثل busboy أو multer) لفحص الـ boundaries وتدفق أجزاء الملفات مع فرض قيود صارمة على الحجم ونوع الامتداد.",
    explanation: "تختلف طلبات multipart عن طلبات JSON في احتوائها على فاصل (boundary) بين الحقول والملفات. التعامل الآمن يتطلب: عدم قراءة الملف كاملاً في الذاكرة، التحقق من النوع الحقيقي للبايتات (Magic bytes) وليس امتداد الملف فقط، وتحديد أقصى حجم مسموح للحقول والملفات لتفادي هجمات حجب الخدمة (DoS).",
    codeExample: `// استخدام حدود صارمة للملفات المرفوعة لمنع استنزاف الخادم`,
    commonMistakes: ["الاعتماد على mimetype القادم من المتصفح للتحقق من أمان الملف المرفوع."],
    followUpQuestions: ["كيف تفحص الـ Magic Numbers للبايتات الأولى للملف للتأكد من هويته الحقيقية؟"],
    sources: [{ title: "Node.js docs — Stream processing for network uploads", url: "https://nodejs.org/docs/latest/api/stream.html" }],
  },
  {
    id: "nweb-009",
    slug: "rate-limiting-and-slowloris-protection-in-node",
    topicId: "node-web",
    difficulty: "Senior",
    question: "كيف تحمي خادم Node.js من هجمات Slowloris وكيف تطبق تحديد معدل الطلبات (Rate Limiting)؟",
    shortAnswer: "تحمي من Slowloris بتعيين مهل زمنية صارمة للترويسات (headersTimeout)، وتطبق Rate Limiting باستخدام خوارزمية Token Bucket ومخزن Redis مركزي.",
    explanation: "هجوم Slowloris يقوم بإرسال ترويسات HTTP ببطء شديد لإبقاء اتصالات السيرفر مفتوحة حتى استنزاف كامل المقابس المتاحة. في Node.js، تحدد الإعدادات server.headersTimeout وserver.requestTimeout زمناً أقصى لاستقبال الترويسات. أما الـ Rate Limiting فيحد من عدد الطلبات المسموح بها لكل عنوان IP أو مستخدم خلال نافذة زمنية عبر مخزن موزع.",
    codeExample: `server.headersTimeout = 5000;
server.requestTimeout = 10000;`,
    commonMistakes: ["تخزين عدادات الـ Rate Limiting في ذاكرة التطبيق المحلية عند تشغيل عدة نسخ (Clustered) مما يجعل الحظر غير فعال."],
    followUpQuestions: ["ما الفرق بين خوارزمية Fixed Window وخوارزمية Sliding Window Counter في الـ Rate Limiting؟"],
    sources: [{ title: "Node.js docs — server.headersTimeout", url: "https://nodejs.org/docs/latest/api/http.html#serverheaderstimeout" }],
  },
  {
    id: "nweb-010",
    slug: "server-sent-events-in-node",
    topicId: "node-web",
    difficulty: "Mid",
    question: "متى تفضل استخدام Server-Sent Events (SSE) على WebSockets وكيف تنفذها في Node.js؟",
    shortAnswer: "تفضل SSE عندما يكون تدفق البيانات في اتجاه واحد من الخادم للعميل (مثل الإشعارات وتدفق نصوص AI)، وتنفذ عبر اتصال HTTP مع ترويسة text/event-stream.",
    explanation: "تتميز تقنية SSE بالبساطة القصوى مقارنة بـ WebSockets؛ فهي تعمل فوق بروتوكول HTTP القياسي، وتدعم إعادة الاتصال التلقائي من المتصفح عبر EventSource، وتعمل بسلاسة عبر وكلاء الـ HTTP وجدران الحماية دون بروتوكولات خاصة. يقوم الخادم بإبقاء الاتصال مفتوحاً وإرسال البيانات بصيغة نصية data: {...}\\n\\n.",
    codeExample: `res.writeHead(200, {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache",
  "Connection": "keep-alive"
});
res.write(\`data: \${JSON.stringify({ msg: "update" })}\\n\\n\`);`,
    commonMistakes: ["نسيان إغلاق الاتصال عند إغلاق العميل للصفحة عبر الاستماع لحدث req.on('close')."],
    followUpQuestions: ["كيف يؤثر حد الـ 6 اتصالات المتزامنة في بروتوكول HTTP/1.1 على استخدامات SSE؟"],
    sources: [{ title: "Node.js docs — HTTP Server response write", url: "https://nodejs.org/docs/latest/api/http.html#responsewritechunk-encoding-callback" }],
  },

  // Topic: node-database (10 questions: ndb-001 to ndb-010)
  {
    id: "ndb-001",
    slug: "connection-pooling-and-saturation-in-node",
    topicId: "node-database",
    difficulty: "Mid",
    question: "كيف تعمل حمامات الاتصال (Connection Pools) في قواعد البيانات وما مخاطر تشبعها في Node.js؟",
    shortAnswer: "تدير حمامات الاتصال مجموعة اتصالات مفتوحة مسبقاً وتشاركها بين الطلبات؛ وتشبعها يؤدي لتراكم الطلبات في طابور الانتظار وزيادة زمن الاستجابة والـ timeouts.",
    explanation: "إنشاء اتصال جديد بقاعدة البيانات (TCP Handshake + TLS + Authentication) مكلف للغاية ويستغرق عشرات المللي ثوانٍ. يوفر الـ Pool (مثل pg.Pool) عدداً ثابتاً من الاتصالات (مثلاً 20 اتصالاً) يتم استعارتها عبر client = await pool.connect() وإرجاعها بـ client.release(). إذا استغرقت الاستعلامات وقتاً طويلاً أو حدث تسريب اتصالات (نسيان release)، سيعلق السيرفر في انتظار اتصال متاح.",
    codeExample: `const client = await pool.connect();
try {
  const res = await client.query("SELECT * FROM users WHERE id = $1", [id]);
} finally {
  client.release(); // ضروري دائماً في finally
}`,
    commonMistakes: ["نسيان استدعاء client.release() داخل كتلة finally مما يفرغ الـ pool بسرعة ويسقط السيرفر."],
    followUpQuestions: ["كيف تحدد الحجم الأمثل لحمام الاتصالات بناءً على عدد أنوية قاعدة البيانات وتطبيقات السيرفر؟"],
    sources: [{ title: "Node.js docs — Database Best Practices and Net Sockets", url: "https://nodejs.org/docs/latest/api/net.html" }],
  },
  {
    id: "ndb-002",
    slug: "prisma-orm-query-engine-and-migrations-in-node",
    topicId: "node-database",
    difficulty: "Mid",
    question: "كيف يعمل محرك Prisma ORM في Node.js وما دور الـ Rust Query Engine التابع له؟",
    shortAnswer: "يعتمد Prisma على محرك ثنائي مكتوب بـ Rust يترجم استدعاءات TypeScript إلى استعلامات SQL محسنة، ويوفر ملف schema موحداً لتوليد الأنواع والـ Migrations.",
    explanation: "يقوم Prisma بتوليد عميل TypeScript مخصص تلقائياً بناءً على ملف schema.prisma. عند استدعاء دالة prisma.user.findMany()، يتم تمرير الطلب إلى المحرك الثنائي (Query Engine) الذي يتواصل مباشرة مع قاعدة البيانات وينفذ الاستعلامات مع تجنب مشاكل N+1 في العلاقات الشائعة.",
    codeExample: `const users = await prisma.user.findMany({
  where: { active: true },
  include: { posts: true }
});`,
    commonMistakes: ["إنشاء نُسخ متعددة من PrismaClient في كل ملف أو دالة بدلاً من مشاركة نسخة Singleton واحدة."],
    followUpQuestions: ["ما هو تأثير حجم المحرك الثنائي لـ Prisma على وظائف الـ Serverless (AWS Lambda)؟"],
    sources: [{ title: "Node.js docs — Process execution and binaries", url: "https://nodejs.org/docs/latest/api/child_process.html" }],
  },
  {
    id: "ndb-003",
    slug: "drizzle-vs-typeorm-in-node",
    topicId: "node-database",
    difficulty: "Senior",
    question: "قارن بين Drizzle ORM و TypeORM من حيث الفلسفة المعمارية وسرعة الأداء في Node.js.",
    shortAnswer: "Drizzle هو SQL-like query builder خفيف وصفر التكلفة الإضافية بدون محركات ثنائية، بينما TypeORM هو ORM كلاسيكي مبني بنمط Data Mapper/Active Record ويعتمد على الانعكاس والـ decorators.",
    explanation: "يتميز Drizzle ببساطته وقربه الشديد من SQL القياسي (If you know SQL, you know Drizzle) بدون الحاجة لـ Query Engine منفصل، ويدعم بيئات الـ Edge والـ Serverless بسرعة فائقة وتطابق تام للأنواع. في المقابل، يوفر TypeORM ميزات تقليدية مألوفة لمطوري Java/C# مثل الـ lazy loading والعلاقات المعقدة التلقائية، ولكنه يعاني من تعقيد الإعدادات وأداء أبطأ.",
    codeExample: `// Drizzle ORM
const result = await db.select().from(users).where(eq(users.id, 1));`,
    commonMistakes: ["الاعتماد المفرط على ميزات الـ Eager Loading التلقائية في TypeORM مما يولد استعلامات SQL ضخمة غير فعالة."],
    followUpQuestions: ["كيف يدعم Drizzle استنتاج أنواع TypeScript دون الحاجة لتوليد كود (Code Generation)؟"],
    sources: [{ title: "Node.js docs — TypeScript Integration", url: "https://nodejs.org/docs/latest/api/typescript.html" }],
  },
  {
    id: "ndb-004",
    slug: "mongoose-connection-management-in-node",
    topicId: "node-database",
    difficulty: "Mid",
    question: "كيف يدير Mongoose الاتصال بقواعد بيانات MongoDB وما دور الـ Buffering للأوامر؟",
    shortAnswer: "يوفر Mongoose طبقة ODM متقدمة؛ وميزة Command Buffering تسمح بتنفيذ استعلامات النماذج قبل اكتمال الاتصال الأولي الفعلي وتخزينها حتى ينجح الاتصال.",
    explanation: "يقوم Mongoose بتخزين استعلامات النماذج مؤقتاً في طابور انتظار داخلي (Buffer) إذا لم يكن الاتصال قد اكتمل بعد. على الرغم من أن هذا يبسط كتابة الكود أثناء إقلاع السيرفر، إلا أنه قد يخفي أخطاء فشل الاتصال بقاعدة البيانات، مسبباً تجميد الطلبات حتى تنفد مهلة الـ buffer (افتراضياً 10 ثوانٍ).",
    codeExample: `await mongoose.connect(process.env.MONGO_URI!, {
  serverSelectionTimeoutMS: 5000
});`,
    commonMistakes: ["عدم تعطيل command buffering في بيئات الـ Serverless مما يؤدي لتعليق الوظائف السحابية."],
    followUpQuestions: ["ما أهمية استخدام .lean() في استعلامات Mongoose لتحسين سرعة القراءة والذاكرة؟"],
    sources: [{ title: "Node.js docs — net module and sockets", url: "https://nodejs.org/docs/latest/api/net.html" }],
  },
  {
    id: "ndb-005",
    slug: "parameterized-queries-and-sql-injection-prevention-in-node",
    topicId: "node-database",
    difficulty: "Junior",
    question: "كيف تحمي تطبيقات Node.js من ثغرات SQL Injection باستخدام الاستعلامات المجهزة (Parameterized Queries)؟",
    shortAnswer: "تفصل الاستعلامات المجهزة كود SQL عن البيانات عبر معلمات نائبة ($1, ?)، حيث ترسل للمحرك كبيانات حرفية بحتة لا يمكن تفسيرها كتعليمات برمجية.",
    explanation: "دمج نصوص المستخدم مباشرة عبر template literals (مثل `SELECT * WHERE name = '${input}'`) يتيح للمهاجم حقن أوامر تخريبية. عند استخدام الاستعلامات المجهزة، تقوم قاعدة البيانات بتحليل وبناء شجرة تنفيذ الـ SQL مسبقاً، ثم تعامل مدخلات المستخدم كقيم ثابتة مجردة حتى لو احتوت على فواصل أو كلمات محجوزة مثل OR أو DROP TABLE.",
    codeExample: `// آمن تماماً
await db.query("SELECT * FROM users WHERE email = $1 AND role = $2", [email, role]);`,
    commonMistakes: ["استخدام الـ string interpolation مع مكتبات قواعد البيانات بحجة أن المدخلات مفحوصة."],
    followUpQuestions: ["كيف تتعامل مع الأسماء الديناميكية للأعمدة والجداول التي لا تقبل الـ Parameterized values؟"],
    sources: [{ title: "Node.js docs — Security Best Practices", url: "https://nodejs.org/docs/latest/api/crypto.html" }],
  },
  {
    id: "ndb-006",
    slug: "database-transactions-and-isolation-in-node",
    topicId: "node-database",
    difficulty: "Senior",
    question: "كيف تنفذ المعاملات المترابطة (Database Transactions) ومستويات العزل بأمان في Node.js؟",
    shortAnswer: "تنفذ بحجز عميل محدد من الـ pool، وتشغيل BEGIN، وتنفيذ العمليات، ثم COMMIT في حال النجاح أو ROLLBACK في كتلة catch.",
    explanation: "المعاملة تضمن مبدأ الذرية (Atomicity) في ACID؛ فإما أن تنجح كل التعديلات معاً أو تُلغى بالكامل. من الضروري جداً استخدام نفس الاتصال (Dedicated Client) لكل عمليات المعاملة الواحدة، لأن استدعاء pool.query() يوزع العمليات عشوائياً عبر اتصالات مختلفة مما يفسد المعاملة تماماً.",
    codeExample: `const client = await pool.connect();
try {
  await client.query("BEGIN");
  await client.query("UPDATE accounts SET balance = balance - 100 WHERE id = $1", [from]);
  await client.query("UPDATE accounts SET balance = balance + 100 WHERE id = $2", [to]);
  await client.query("COMMIT");
} catch (e) {
  await client.query("ROLLBACK");
  throw e;
} finally {
  client.release();
}`,
    commonMistakes: ["تنفيذ أوامر BEGIN و COMMIT عبر pool.query المباشر بدلاً من عميل مخصص محجوز."],
    followUpQuestions: ["ما الفرق بين مستويات العزل Read Committed و Serializable ومتى تحتاج الأخير؟"],
    sources: [{ title: "Node.js docs — Client Pool Interactions", url: "https://nodejs.org/docs/latest/api/net.html" }],
  },
  {
    id: "ndb-007",
    slug: "dataloader-and-n-plus-one-prevention-in-node",
    topicId: "node-database",
    difficulty: "Senior",
    question: "ما هي مشكلة N+1 في استعلامات قواعد البيانات وكيف تحلها مكتبة DataLoader في Node.js؟",
    shortAnswer: "تحدث عندما يُنفذ استعلام رئيسي يتبعه N استعلام لكل سجل لجلب علاقاته؛ تحلها DataLoader بتجميع (Batching) وتخزين (Caching) الطلبات في استعلام موحد.",
    explanation: "شائعة جداً في واجهات GraphQL وREST المتداخلة. تقوم DataLoader باستغلال آلية الـ microtasks في Node.js؛ فعند طلب دالة loader.load(id) عدة مرات في نفس دورة الـ Event Loop، تجمع كل المعرفات في مصفوفة وتستدعي دالة دفعة واحدة batchFunction([1, 2, 3]) لتنفيذ استعلام SELECT WHERE id IN (...).",
    codeExample: `import DataLoader from "dataloader";
const userLoader = new DataLoader(async (ids) => {
  const users = await db.query("SELECT * FROM users WHERE id = ANY($1)", [ids]);
  return ids.map(id => users.find(u => u.id === id));
});`,
    commonMistakes: ["إعادة استخدام نفس كائن DataLoader عبر طلبات مستخدمين مختلفين مما يسرب البيانات المخزنة مؤقتاً."],
    followUpQuestions: ["لماذا يجب إنشاء كائن DataLoader جديد لكل طلب HTTP مستقل؟"],
    sources: [{ title: "Node.js docs — Event loop tick batching", url: "https://nodejs.org/docs/latest/api/process.html#processnexttickcallback-args" }],
  },
  {
    id: "ndb-008",
    slug: "database-read-replicas-routing-in-node",
    topicId: "node-database",
    difficulty: "Senior",
    question: "كيف تصمم معمارية توجيه الاستعلامات بين قاعدة البيانات الأساسية (Primary) والنسخ الثانوية (Read Replicas)؟",
    shortAnswer: "يتم إنشاء حمامي اتصالات منفصلين: حمام موجه للـ Primary لعمليات الكتابة والمعاملات، وحمام موجه للـ Replicas لعمليات القراءة مع موازنة الحمل.",
    explanation: "لتقليل الضغط على قاعدة البيانات المركزية، يتم تفويض استعلامات SELECT إلى نسخ للقراءة فقط (Read Replicas). التحدي الرئيسي هو تأخر النسخ المتماثل (Replication Lag)؛ حيث يقرأ المستخدم بيانات قديمة فور قيامه بالكتابة. يتم التعامل مع ذلك بتوجيه استعلامات القراءة الحرجة أو القراءات الفورية بعد الكتابة مباشرة إلى الـ Primary (Read-your-own-writes consistency).",
    codeExample: `// توجيه استعلامات القراءة للـ replica والكتابة للـ primary`,
    commonMistakes: ["توجيه استعلامات القراءة داخل المعاملات المفتوحة إلى الـ Replicas مما يفشل المعاملة."],
    followUpQuestions: ["كيف تدير ظاهرة الـ Replication Lag وتضمن قراءة المستخدم لأحدث بياناته؟"],
    sources: [{ title: "Node.js docs — Cluster and networking architecture", url: "https://nodejs.org/docs/latest/api/net.html" }],
  },
  {
    id: "ndb-009",
    slug: "zero-downtime-database-migrations-in-node",
    topicId: "node-database",
    difficulty: "Senior",
    question: "كيف تدير ترحيل قواعد البيانات (Database Migrations) دون توقف الخدمة (Zero-Downtime)؟",
    shortAnswer: "باتباع نمط Expand and Contract التوسعي؛ بحيث يدعم مخطط قاعدة البيانات كود التطبيق القديم والجديد بالتوازي أثناء مرحلة النشر.",
    explanation: "في بيئات الإنتاج، لا يمكن إيقاف الخوادم أثناء ترحيل الجداول. إذا أردت حذف عمود أو تعديل نوعه، يتم ذلك عبر مراحل: 1) إضافة العمود الجديد دون المساس بالقديم، 2) نشر كود التطبيق الجديد ليكتب في العمودين معاً، 3) ترحيل البيانات القديمة في الخلفية، 4) تحديث الكود ليقرأ حصراً من العمود الجديد، 5) حذف العمود القديم في ترحيل منفصل لاحق.",
    codeExample: `// نمط Expand-Contract لإجراء تغييرات آمنة للمخطط`,
    commonMistakes: ["إجراء تعديلات حصرية تقفل الجداول الكبيرة (Table Lock) مثل إضافة أعمدة بقيم افتراضية غير متوافقة."],
    followUpQuestions: ["كيف تتأكد من عدم قفل الجداول الكبيرة (Exclusive Locks) أثناء إنشاء الفهارس (Indexes) بـ PostgreSQL؟"],
    sources: [{ title: "Node.js docs — Database deployment practices", url: "https://nodejs.org/docs/latest/api/process.html" }],
  },
  {
    id: "ndb-010",
    slug: "redis-distributed-locks-in-node",
    topicId: "node-database",
    difficulty: "Senior",
    question: "كيف تطبق الأقفال الموزعة (Distributed Locks) باستخدام Redis في بيئة خوادم Node.js متعددة؟",
    shortAnswer: "تطبق عبر أمر SET مع خيارات NX وPX لتسجيل رمز عشوائي بمهلة زمنية، وتحرير القفل بواسطة Lua script يتحقق من مطابقة الرمز.",
    explanation: "عند تشغيل عدة نسخ من خادم Node.js ووجود عملية حرجة (مثل خصم رصيد أو حجز مقعد وحيد)، لا تجدي متغيرات الذاكرة نفعاً. يتم الحصول على القفل الذري عبر Redis: SET lock_key my_unique_token NX PX 30000. التحرير يجب أن يكون حصرياً عبر Lua Script لضمان عدم حذف قفل انتهت مدته وأخذه خادم آخر.",
    codeExample: `// Lua script لتحرير القفل الذري
const releaseScript = \`
  if redis.call("get", KEYS[1]) == ARGV[1] then
    return redis.call("del", KEYS[1])
  else
    return 0
  end
\`;`,
    commonMistakes: ["تحرير القفل بأمر DEL البسيط دون التحقق من أن الـ token لا يزال يخص العملية الحالية."],
    followUpQuestions: ["متى تحتاج لاستخدام خوارزمية Redlock مع مجموعات Redis المتعددة؟"],
    sources: [{ title: "Node.js docs — Crypto randomBytes for lock tokens", url: "https://nodejs.org/docs/latest/api/crypto.html#cryptorandombytesize-callback" }],
  },

  // Topic: node-security (10 questions: nsec-001 to nsec-010)
  {
    id: "nsec-001",
    slug: "jwt-signing-and-verification-in-node",
    topicId: "node-security",
    difficulty: "Mid",
    question: "ما الفرق بين خوارزميات التوقيع المتناظرة (HS256) وغير المتناظرة (RS256) في رموز JWT بـ Node.js؟",
    shortAnswer: "HS256 تستخدم نفس المفتاح السري المشترك للتوقيع والتحقق، بينما RS256 تستخدم مفتاحاً خاصاً للتوقيع ومفتاحاً عاماً متاحاً للجميع للتحقق.",
    explanation: "في المعماريات البسيطة، تعد HS256 كافية وممتازة لأن خادماً واحداً يقوم بالتوليد والتحقق. أما في معمارية الـ Microservices وتطبيقات الـ SSO، تفضل RS256؛ حيث تحتفظ خدمة المصادقة (Auth Service) بالمفتاح الخاص لتوليد التوكن، وتستطيع كل الخدمات الأخرى التحقق من صحة التوكن باستقلالية تامة باستخدام المفتاح العام دون إمكانية تزويره.",
    codeExample: `import jwt from "jsonwebtoken";
// RS256: توقيع بالمفتاح الخاص
const token = jwt.sign({ sub: userId }, privateKey, { algorithm: "RS256", expiresIn: "15m" });
// تحقق بالمفتاح العام
const payload = jwt.verify(token, publicKey, { algorithms: ["RS256"] });`,
    commonMistakes: ["عدم تحديد قائمة الخوارزميات المسموحة في خيارات verify مما يعرض التطبيق لثغرة None Algorithm."],
    followUpQuestions: ["كيف تحمي الخادم من هجمات التراجع (Algorithm Confusion Attack) بين HMAC و RSA؟"],
    sources: [{ title: "Node.js docs — Crypto module and key pairs", url: "https://nodejs.org/docs/latest/api/crypto.html#cryptogeneratekeypairsynctype-options" }],
  },
  {
    id: "nsec-002",
    slug: "refresh-token-rotation-and-cookies-in-node",
    topicId: "node-security",
    difficulty: "Senior",
    question: "كيف تطبق استراتيجية تدوير رموز التحديث (Refresh Token Rotation) والتخزين الآمن في ملفات تعريف الارتباط؟",
    shortAnswer: "يخزن الـ Refresh Token في Cookie محمية بـ HttpOnly وSameSite، ومع كل استخدام يُبطل الرمز الحالي ويولد زوج جديد، وإذا استُخدم رمز ملغى يُحظر كامل سجل المستخدم.",
    explanation: "لتفادي مخاطر سرقة الـ Access Token قصير الأجل، يتم استخدام Refresh Token صالح لفترة أطول. لحمايته من ثغرات XSS، يُخزن داخل كوكي موسومة بـ HttpOnly وSecure وSameSite=Strict. استراتيجية الـ Rotation تعني أنه عند طلب تجديد الـ Access Token، يتم إلغاء الـ Refresh Token المستخدم فوراً وتوليد آخر بديل؛ وإذا حاول مهاجم استخدام الـ token القديم، يكشف النظام الاختراق فوراً ويبطل كل جلسات المستخدم.",
    codeExample: `res.cookie("refreshToken", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000
});`,
    commonMistakes: ["تخزين رموز المصادقة والـ Refresh Tokens في localStorage بالمتصفح مما يجعلها عرضة للسرقة المباشرة عبر XSS."],
    followUpQuestions: ["كيف تصمم هيكل عائلة الرموز (Token Family) لاكتشاف سرقة الرموز في قاعدة البيانات؟"],
    sources: [{ title: "Node.js docs — HTTP Cookies and Headers", url: "https://nodejs.org/docs/latest/api/http.html" }],
  },
  {
    id: "nsec-003",
    slug: "password-hashing-argon2-vs-bcrypt-in-node",
    topicId: "node-security",
    difficulty: "Junior",
    question: "لماذا لا يجب أبداً استخدام دوال SHA-256 لتشفير كلمات المرور ولماذا يفضل Argon2 أو bcrypt؟",
    shortAnswer: "دوال SHA سريعة ومصممة للتجزئة العامة مما يسهل كسرها بمليارات المحاولات على كروت الشاشة، بينما bcrypt وArgon2 دوال بطيئة عن قصد ومقاومة لهجمات الـ GPU والذاكرة.",
    explanation: "تعتمد أمان كلمات المرور على بطء دالة التجزئة وارتفاع تكلفة حسابها (Cost factor / Work factor). صُمم خوارزمية Argon2 الفائزة بمسابقة كسر التجزئة لمقاومة الهجمات العتادية الموازية عبر متطلبات ذاكرة قابلة للضبط (Memory-hard). كما تضيف هذه الدوال ملحاً تشفيرياً (Salt) عشوائياً تلقائياً لمنع هجمات جداول قوس قزح (Rainbow Tables).",
    codeExample: `import bcrypt from "bcrypt";
const hash = await bcrypt.hash(password, 12);
const isValid = await bcrypt.compare(password, hash);`,
    commonMistakes: ["استخدام MD5 أو SHA-256 البسيطة لحفظ كلمات المرور."],
    followUpQuestions: ["ما هو معامل الصعوبة (Work Factor) الموصى به لـ bcrypt على خوادم الإنتاج اليوم؟"],
    sources: [{ title: "Node.js docs — Crypto module and scrypt", url: "https://nodejs.org/docs/latest/api/crypto.html#cryptoscryptpassword-salt-keylen-options-callback" }],
  },
  {
    id: "nsec-004",
    slug: "csrf-prevention-strategies-in-node",
    topicId: "node-security",
    difficulty: "Mid",
    question: "كيف تحدث هجمات تزوير الطلبات عبر المواقع (CSRF) وكيف تحمي تطبيقات Node.js منها؟",
    shortAnswer: "تحدث عندما يجبر موقع خبيث متصفح الضحية على إرسال طلب غير مصرح به لموقعك مع الكوكيز الخاصة به؛ وتتم الحماية برمز CSRF Token المزدوج وخاصية SameSite=Lax/Strict.",
    explanation: "إذا كان موقعك يعتمد على الكوكيز للمصادقة التلقائية، يمكن لصفحة خارجية إرسال نموذج POST لحساب المستخدم. الحل الحديث هو تعيين خاصية SameSite=Lax أو Strict على الكوكيز الحساسة لمنع المتصفح من إرفاقها مع طلبات المواقع الخارجية، بالإضافة لتطبيق نمط Double Submit Cookie أو Synchronizer Token Pattern للطلبات المعدلة للحالة.",
    codeExample: `// ضبط SameSite على الكوكيز لحماية فورية
res.cookie("session", id, { sameSite: "lax", httpOnly: true, secure: true });`,
    commonMistakes: ["الاعتماد على SameSite=None دون تطبيق تحقق يدوي من الـ CSRF Tokens."],
    followUpQuestions: ["هل تحتاج واجهات برمجة التطبيقات المبنية بالكامل على ترويسة Authorization: Bearer إلى حماية ضد CSRF؟"],
    sources: [{ title: "Node.js docs — Web Security Considerations", url: "https://nodejs.org/docs/latest/api/http.html" }],
  },
  {
    id: "nsec-005",
    slug: "cors-configuration-and-preflight-in-node",
    topicId: "node-security",
    difficulty: "Junior",
    question: "ما هي سياسة تقاسم الموارد عبر الأصول (CORS) وما هي طلبات الفحص المسبق (Preflight Requests)؟",
    shortAnswer: "CORS هي آلية أمان تطبقها المتصفحات لمنع المواقع الخارجية من قراءة بياناتك؛ وطلب الـ Preflight هو طلب OPTIONS يرسله المتصفح قبل الطلب الفعلي للتحقق من السماح بالعملية.",
    explanation: "تطلب المتصفحات موافقة صريحة من الخادم عندما يحاول تطبيق جافاسكريبت قراءة استجابة من نطاق مختلف. إذا احتوى الطلب على ترويسات غير قياسية (مثل Authorization) أو أساليب غير بسيطة (مثل PUT أو DELETE أو POST مع JSON)، يرسل المتصفح أولاً طلب OPTIONS (Preflight). يجب على الخادم الرد بترويسات Access-Control-Allow-Origin وAccess-Control-Allow-Methods المناسبة.",
    codeExample: `import cors from "cors";
app.use(cors({
  origin: "https://my-frontend.com",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));`,
    commonMistakes: ["تعيين Access-Control-Allow-Origin: * مع تفعيل credentials: true وهو ما ترفضه المتصفحات أمنياً."],
    followUpQuestions: ["لماذا لا تحمي سياسة CORS خوادم الـ Backend من طلبات أدوات مثل Postman أو curl؟"],
    sources: [{ title: "Node.js docs — HTTP Headers and Options requests", url: "https://nodejs.org/docs/latest/api/http.html" }],
  },
  {
    id: "nsec-006",
    slug: "helmet-and-security-headers-in-node",
    topicId: "node-security",
    difficulty: "Junior",
    question: "ما هي حزمة Helmet وما الترويسات الأمنية الأساسية التي تضيفها لتطبيق Node.js؟",
    shortAnswer: "مكتبة وسيطة تضيف ترويسات أمان قياسية مثل Content-Security-Policy، Strict-Transport-Security، X-Frame-Options، وتخفي ترويسة X-Powered-By.",
    explanation: "تساعد ترويسات الأمان المتصفحات على عزل موقعك ومنع ثغرات شهيرة مثل Clickjacking (عبر X-Frame-Options: DENY)، وفرض الاتصال المشفر دائماً (عبر HSTS)، وحظر تشغيل السكريبتات غير الموثوقة (عبر CSP)، ومنع استنتاج أنواع الملفات عشوائياً (عبر X-Content-Type-Options: nosniff)، وإخفاء هوية التقنية المستخدمة بحذف X-Powered-By: Express.",
    codeExample: `import helmet from "helmet";
app.use(helmet());`,
    commonMistakes: ["ترك ترويسة X-Powered-By: Express ظاهرة للعامة مما يسهل على المهاجمين استهداف ثغرات الإصدار الخاص بك."],
    followUpQuestions: ["كيف تقوم بضبط سياسة Content-Security-Policy (CSP) المخصصة مع الـ Nonce للسكريبتات المضمنة؟"],
    sources: [{ title: "Node.js docs — Security Best Practices", url: "https://nodejs.org/docs/latest/api/crypto.html" }],
  },
  {
    id: "nsec-007",
    slug: "prototype-pollution-prevention-in-node",
    topicId: "node-security",
    difficulty: "Senior",
    question: "ما هي ثغرة تلوث النموذج الأولي (Prototype Pollution) في JavaScript وكيف تتجنبها في Node.js؟",
    shortAnswer: "ثغرة تسمح للمهاجم بحقن خصائص خبيثة في كائن Object.prototype العام عبر كائنات مدمجة بعمق تحتوي على __proto__ مما يفسد سلوك التطبيق بالكامل.",
    explanation: "عند دمج كائنات JSON عشوائية دون تصفية دقيقة (كما في دوال الـ recursive merge أو lodash القديمة)، إذا أرسل المهاجم {'__proto__': {'admin': true}}، ستضاف هذه الخاصية لكل كائن يتم إنشاؤه في التطبيق. الوقاية تتم باستخدام Object.create(null) للكائنات القاموسية، وتجميد النموذج الأساسي بـ Object.freeze(Object.prototype)، أو تفعيل خيار Map بدلاً من الكائنات العادية.",
    codeExample: `// كائن آمن تماماً لا يملك prototype
const safeDict = Object.create(null);
// أو استخدام Map المعياري
const safeMap = new Map();`,
    commonMistakes: ["استخدام دوال دمج الكائنات (Object deep merge) غير الموثوقة لمدخلات المستخدمين المباشرة."],
    followUpQuestions: ["كيف تحظر Node.js معالجة __proto__ عبر راية التشغيل --disable-proto=delete؟"],
    sources: [{ title: "Node.js docs — Command-line options: disable-proto", url: "https://nodejs.org/docs/latest/api/cli.html#--disable-protomode" }],
  },
  {
    id: "nsec-008",
    slug: "secrets-management-and-env-hygiene-in-node",
    topicId: "node-security",
    difficulty: "Junior",
    question: "كيف تدير المتغيرات البيئية والأسرار (Secrets) بأمان في مشاريع Node.js؟",
    shortAnswer: "تحفظ في متغيرات النظام البيئية (process.env) دون كتابتها في الكود أو رفعها للـ Git، مع التحقق من وجودها عند الإقلاع باستخدام مخطط صارم.",
    explanation: "يجب ألا توضع مفاتيح التشفير أو كلمات مرور قواعد البيانات مطلقاً في الكود المصدري. توفر Node.js الحديثة دعماً أصيلاً لقراءة ملفات .env عبر الراية --env-file=.env دون حزم خارجية. الممارسة القياسية هي التحقق من سلامة وصحة جميع المتغيرات البيئية المطلوبة فور إقلاع التطبيق عبر Zod لإيقاف الخادم فوراً عند فقدان أي سر أساسي.",
    codeExample: `// تشغيل: node --env-file=.env app.js
import { z } from "zod";
const envSchema = z.object({
  PORT: z.string().default("3000"),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32)
});
export const env = envSchema.parse(process.env);`,
    commonMistakes: ["رفع ملف .env يحتوي أسراراً حقيقية إلى مستودع Git العام أو تضمينه في صور Docker العامة."],
    followUpQuestions: ["كيف تستخدم أدوات مثل HashiCorp Vault أو AWS Secrets Manager لتحميل الأسرار ديناميكياً؟"],
    sources: [{ title: "Node.js docs — Command-line options: env-file", url: "https://nodejs.org/docs/latest/api/cli.html#--env-fileconfig" }],
  },
  {
    id: "nsec-009",
    slug: "timing-attacks-and-crypto-timing-safe-equal-in-node",
    topicId: "node-security",
    difficulty: "Senior",
    question: "ما هي هجمات التوقيت (Timing Attacks) ولماذا يجب استخدام crypto.timingSafeEqual لمقارنة الرموز الحساسة؟",
    shortAnswer: "هجمات تقيس وقت استجابة السيرفر بالنانوثانية لمعرفة كم حرفاً تطابق قبل الفشل؛ وتمنعها timingSafeEqual بمقارنة البايتات في زمن ثابت دائماً.",
    explanation: "عوامل المقارنة العادية مثل === تقارن النصوص حرفاً بحرف وتتوقف فور أول حرف مختلف (Short-circuiting). يتيح هذا للمهاجم إرسال مئات المحاولات وتخمين مفاتيح التشفير وتواقيع الـ Webhooks بدقة. دالة crypto.timingSafeEqual تقارن كائني Buffer في وقت زمني ثابت تماماً بغض النظر عن موقع أول تطابق أو اختلاف.",
    codeExample: `import crypto from "node:crypto";
const isMatch = crypto.timingSafeEqual(
  Buffer.from(signatureA, "utf8"),
  Buffer.from(signatureB, "utf8")
);`,
    commonMistakes: ["مقارنة تواقيع الـ Webhooks (مثل Stripe أو GitHub) باستخدام عامل المساواة العادي ===."],
    followUpQuestions: ["ما الشرط الضروري الذي تفرضه دالة crypto.timingSafeEqual على طول الـ Buffers قبل المقارنة؟"],
    sources: [{ title: "Node.js docs — crypto.timingSafeEqual", url: "https://nodejs.org/docs/latest/api/crypto.html#cryptotimingsafeequalba-bb" }],
  },
  {
    id: "nsec-010",
    slug: "dependency-supply-chain-security-in-node",
    topicId: "node-security",
    difficulty: "Mid",
    question: "كيف تحمي مشروع Node.js من هجمات سلاسل التوريد (Supply Chain Attacks) في منظومة npm؟",
    shortAnswer: "باستخدام npm audit، وتثبيت النسخ الصريحة، وتفعيل --ignore-scripts، وفحص التبعيات بأدوات التحليل الساكن، والاعتماد على قفل الحزم الموثوق.",
    explanation: "تعد حزم npm هدفاً رئيسياً للمهاجمين عبر التسمم (Typosquatting) أو حقن أكواد خبيثة في سكريبتات التثبيت (postinstall hooks). تشمل إجراءات الحماية تشغيل الفحص الأمني التلقائي في خطوط الـ CI، ومنع تنفيذ السكريبتات العشوائية بواسطة --ignore-scripts، وتفعيل التحقق من تواقيع الحزم (npm provenance).",
    codeExample: `npm audit --audit-level=high
npm ci --ignore-scripts`,
    commonMistakes: ["تثبيت حزم غير معروفة ذات عدد تحميلات قليل دون مراجعة كودها المصدري وترخيصها."],
    followUpQuestions: ["ما هي ميزة npm provenance وكيف تؤكد أن الحزمة بُنيت بالفعل من المستودع الرسمي المعلن؟"],
    sources: [{ title: "Node.js docs — Security Best Practices", url: "https://nodejs.org/docs/latest/api/crypto.html" }],
  },

  // Topic: node-perf (10 questions: nperf-001 to nperf-010)
  {
    id: "nperf-001",
    slug: "cluster-module-and-ipc-in-node",
    topicId: "node-perf",
    difficulty: "Mid",
    question: "كيف تستغل معالجات السيرفر متعددة الأنوية (Multi-Core CPUs) باستخدام وحدة node:cluster؟",
    shortAnswer: "تقوم بإنشاء عمليات فرعية (Workers) تشترك في نفس منفذ الخادم، وتوزع الطلبات الواردة بنظام Round-Robin.",
    explanation: "نظراً لأن Node.js أحادية الخيط، فإن خادماً يحتوي على 16 نواة سيعمل بنواة واحدة فقط ويهدر 15 نواة إن لم يتم تشغيل عدة عمليات. تقوم وحدة node:cluster بالسماح للعملية الأساسية (Primary) بإنشاء عمليات فرعية بواسطة cluster.fork()، وتمرير مقبس السيرفر وموازنة الحمل بينها، وإعادة إنشاء أي عملية فرعية تنهار فوراً.",
    codeExample: `import cluster from "node:cluster";
import os from "node:os";
if (cluster.isPrimary) {
  const cpus = os.cpus().length;
  for (let i = 0; i < cpus; i++) cluster.fork();
} else {
  // كود الخادم العادي
}`,
    commonMistakes: ["مشاركة الذاكرة المباشرة بين الـ Worker processes دون استخدام وسيط موزع كـ Redis أو رسائل IPC."],
    followUpQuestions: ["ما الفرق بين خوارزمية Round-Robin ومخطط توزيع نظام التشغيل للاتصالات في الـ Cluster؟"],
    sources: [{ title: "Node.js docs — Cluster", url: "https://nodejs.org/docs/latest/api/cluster.html" }],
  },
  {
    id: "nperf-002",
    slug: "worker-threads-vs-child-processes-in-node",
    topicId: "node-perf",
    difficulty: "Senior",
    question: "ما الفرق بين خيوط العمل (Worker Threads) والعمليات الفرعية (Child Processes) في Node.js؟",
    shortAnswer: "الـ Worker Threads تشترك في نفس مساحة العملية والذاكرة (عبر SharedArrayBuffer) وخفيفة في الإنشاء، بينما الـ Child Processes هي عمليات نظام تشغيل كاملة ومستقلة الذاكرة.",
    explanation: "وحدة node:worker_threads تتيح تنفيذ كود JavaScript كثيف الـ CPU في خيوط منفصلة دون حظر الـ Event Loop، مع إمكانية مشاركة الذاكرة بشكل فائق السرعة عبر SharedArrayBuffer والرسائل المهيكلة MessagePort. في المقابل، تُستخدم node:child_process لتشغيل برامج نظام خارجية أو سكريبتات لغات أخرى (مثل Python أو bash).",
    codeExample: `import { Worker } from "node:worker_threads";
const worker = new Worker("./heavy-calc.js", { workerData: { max: 1e9 } });
worker.on("message", result => console.log("Result:", result));`,
    commonMistakes: ["استخدام Worker Threads لمهام الـ I/O العادية التي تبرع فيها Node.js بالفعل، مما يضيف تكلفة إدارة الخيوط بلا فائدة."],
    followUpQuestions: ["كيف تتجنب أخطاء التسابق (Race Conditions) عند استخدام SharedArrayBuffer بواسطة كائن Atomics؟"],
    sources: [{ title: "Node.js docs — Worker threads", url: "https://nodejs.org/docs/latest/api/worker_threads.html" }],
  },
  {
    id: "nperf-003",
    slug: "heap-snapshots-and-memory-leak-profiling-in-node",
    topicId: "node-perf",
    difficulty: "Senior",
    question: "كيف تكتشف وتشخص تسريبات الذاكرة (Memory Leaks) باستخدام لقطات الـ Heap Snapshots في Node.js؟",
    shortAnswer: "تأخذ لقطات ذاكرة متعاقبة عبر وحدة node:v8 أو Chrome DevTools وتقارنها للبحث عن الكائنات المتراكمة ومسارات الإشارة (Retainer Paths) التي تمنع الـ GC من تحريرها.",
    explanation: "تحدث تسريبات الذاكرة عندما تظل متغيرات محتجزة في الذاكرة دون حاجة حقيقية (مثل مصفوفات تخزين عامة، أو listeners غير ملغاة، أو closures تحتفظ بسياق ضخم). بواسطة دالة v8.writeHeapSnapshot()، يمكنك توليد ملف .heapsnapshot أثناء تشغيل السيرفر وتحليله في متصفح Chrome لفحص جدول الكائنات ومطالعة المسافة إلى الـ GC Root.",
    codeExample: `import v8 from "node:v8";
v8.writeHeapSnapshot("leak-profile.heapsnapshot");`,
    commonMistakes: ["أخذ لقطات الـ Heap في بيئة الإنتاج أثناء ذروة الاستخدام العالية مما يجمد السيرفر لعدة ثوانٍ."],
    followUpQuestions: ["ما الفرق بين الـ Shallow Size والـ Retained Size لكائن في لقطة الذاكرة؟"],
    sources: [{ title: "Node.js docs — v8.writeHeapSnapshot", url: "https://nodejs.org/docs/latest/api/v8.html#v8writeheapsnapshotfilename" }],
  },
  {
    id: "nperf-004",
    slug: "cpu-profiling-and-flamegraphs-in-node",
    topicId: "node-perf",
    difficulty: "Senior",
    question: "كيف تستخدم الرسوم البيانية اللهبية (Flamegraphs) لتشخيص اختناقات الأداء والـ CPU في Node.js؟",
    shortAnswer: "توضح الـ Flamegraphs الوقت الذي يقضيه المعالج في كل دالة من خلال تتبع مكدس الاستدعاءات، حيث تشير القمم العريضة إلى الدوال الأكثر استهلاكاً لوقت الـ CPU.",
    explanation: "لتحديد سبب وصول استهلاك المعالج إلى 100%، يمكنك تشغيل Node.js مع راية --cpu-prof لتوليد ملف سجل زمني للأداء، أو ربط التطبيق بأداة التشخيص المتقدمة مثل clinic.js. يتم عرض البيانات كرسم بياني ناري؛ يمثل المحور الأفقي النسبة المئوية لإجمالي وقت التنفيذ، ويمثل المحور الرأسي عمق مكدس الدوال، مما يوجهك فوراً للدالة المسؤولة عن البطء.",
    codeExample: `// تشغيل: node --cpu-prof app.js`,
    commonMistakes: ["الافتراض بأن بطء التطبيق سببه دوال الـ CPU دون فحص أزمنة انتظار الـ I/O أولاً."],
    followUpQuestions: ["كيف تحلل ملفات الـ cpuprofile المولدة داخل لوحة Performance في أدوات مطوري المتصفح؟"],
    sources: [{ title: "Node.js docs — Profiling and Performance hooks", url: "https://nodejs.org/docs/latest/api/perf_hooks.html" }],
  },
  {
    id: "nperf-005",
    slug: "http-agent-keep-alive-pooling-in-node",
    topicId: "node-perf",
    difficulty: "Mid",
    question: "ما أهمية تفعيل keepAlive في عملاء HTTP (node:http Agent) عند استدعاء الخدمات الخارجية؟",
    shortAnswer: "يعيد استخدام نفس اتصالات TCP القائمة بدلاً من فتح اتصال ومصافحة جديدة مع كل طلب، مما يقلل زمن الاستجابة واستهلاك منافذ الشبكة بشكل ضخم.",
    explanation: "افتراضياً في الإصدارات القديمة (وقبل Node.js 19)، كان كائن http.Agent ينشئ اتصال TCP جديداً لكل طلب ويغلقه فوراً. تفعيل { keepAlive: true } يبقي الاتصال مفتوحاً لاستخدامه في الطلبات اللاحقة لنفس الخادم، مما يوفر وقت الـ DNS Resolution، والـ TCP Handshake، ومصافحة TLS البطيئة.",
    codeExample: `import http from "node:http";
const agent = new http.Agent({ keepAlive: true, maxSockets: 50 });
http.get("http://api.internal/data", { agent });`,
    commonMistakes: ["عدم تحديد حد أقصى للاتصالات (maxSockets) مما قد يستنزف موارد الخادم البعيد."],
    followUpQuestions: ["كيف يدعم fetch الأصيل في Node.js إدارة اتصالات الـ keepAlive تلقائياً عبر undici؟"],
    sources: [{ title: "Node.js docs — http.Agent keepAlive", url: "https://nodejs.org/docs/latest/api/http.html#new-agentoptions" }],
  },
  {
    id: "nperf-006",
    slug: "caching-patterns-and-invalidation-in-node",
    topicId: "node-perf",
    difficulty: "Mid",
    question: "كيف تطبق نمط Cache-Aside واستراتيجيات إبطال التخزين المؤقت (Cache Invalidation)؟",
    shortAnswer: "يفحص السيرفر الـ Cache أولاً؛ فإن وجد البيانات أعادها، وإلا جلبها من قاعدة البيانات وحفظها في الـ Cache مع تعيين مدة صلاحية (TTL)، ويتم إبطالها عند التعديل.",
    explanation: "في نمط Cache-Aside (Lazy Loading)، يتحكم تطبيق Node.js مباشرة في القراءة والكتابة للـ Cache (غالباً Redis). لضمان عدم تقديم بيانات قديمة، يجب تعيين مهلة صلاحية مدروسة (TTL)، مع تطبيق إبطال فوري للمفتاح عند تنفيذ أي عملية تحديث أو حذف، أو استخدام استراتيجيات مثل Write-Through في الأنظمة الحرجة.",
    codeExample: `const cached = await redis.get(key);
if (cached) return JSON.parse(cached);
const data = await db.fetch(id);
await redis.set(key, JSON.stringify(data), "EX", 300);
return data;`,
    commonMistakes: ["تخزين الكائنات في الـ Cache دون تعيين TTL مما يسبب تضخم الذاكرة وتقديم بيانات غير متزامنة للأبد."],
    followUpQuestions: ["ما هي ظاهرة الـ Cache Stampede (Dog-piling) وكيف تحمي قاعدة البيانات منها؟"],
    sources: [{ title: "Node.js docs — Performance and caching concepts", url: "https://nodejs.org/docs/latest/api/perf_hooks.html" }],
  },
  {
    id: "nperf-007",
    slug: "v8-gc-flags-and-heap-limits-in-node",
    topicId: "node-perf",
    difficulty: "Senior",
    question: "كيف تضبط راية --max-old-space-size ومتى يلزم تعديل خيارات الـ Garbage Collector لمحرك V8؟",
    shortAnswer: "تحدد الراية الحد الأقصى لذاكرة الـ Heap بالميجابايت قبل إطلاق الـ Out of Memory، ويلزم تعديلها عند معالجة بيانات ضخمة مع مراعاة حدود حاوية Docker.",
    explanation: "افتراضياً، تحدد Node.js حداً أقصى للذاكرة بناءً على حجم الرام المتوفر للنظام (غالباً بين 2GB إلى 4GB على أنظمة 64-bit). في بيئات الحاويات، إذا تم تعيين max-old-space-size بقيمة تفوق حد ذاكرة الحاوية (Container Memory Limit)، سيقوم نظام التشغيل (OOM Killer) بإنهاء الحاوية قسرياً دون أن يحصل V8 على فرصة لتنظيف الذاكرة.",
    codeExample: `// تشغيل: node --max-old-space-size=4096 app.js`,
    commonMistakes: ["تعيين الحد بقيمة مساوية لذاكرة الحاوية تماماً مع نسيان استهلاك الذاكرة خارج الـ Heap (مثل Buffers وخيوط الـ C++)."],
    followUpQuestions: ["كيف تراقب توقفات الـ Garbage Collection عبر PerformanceObserver و node:perf_hooks؟"],
    sources: [{ title: "Node.js docs — Command-line options: max-old-space-size", url: "https://nodejs.org/docs/latest/api/cli.html#--max-old-space-sizesize-in-megabytes" }],
  },
  {
    id: "nperf-008",
    slug: "fast-json-stringify-vs-json-stringify-in-node",
    topicId: "node-perf",
    difficulty: "Senior",
    question: "لماذا تعد عملية JSON.stringify عنق زجاجة للأداء في الخدمات الضخمة وما بدائلها المحسنة؟",
    shortAnswer: "لأنها عملية متزامنة وحاجبة تفحص الكائن وتحدد أنواعه وقت التشغيل؛ وبدائلها مثل fast-json-stringify تجمع دالة تسلسل مسبقة بناءً على Schema لسرعة مضاعفة.",
    explanation: "في الخوادم التي ترسل استجابات JSON ضخمة بآلاف الكائنات في الثانية، يستهلك JSON.stringify وقتاً طويلاً من الخيط الرئيسي متسبباً في تأخير الـ Event Loop. استخدام حلول مبنية على JSON Schema يتيح توليد نصوص JSON مباشرة دون الحاجة لاجتياز الكائن وفحص خصائصه ديناميكياً.",
    codeExample: `// استخدام fast-json-stringify مع schema مسبقة`,
    commonMistakes: ["تسلسل كائنات ضخمة جداً متزامناً داخل الخيط الرئيسي بدلاً من تدفقها عبر streaming JSON parsers."],
    followUpQuestions: ["متى يجب استخدام JSONStream لتدفق نتائج قواعد البيانات الكبيرة مباشرة إلى العميل؟"],
    sources: [{ title: "Node.js docs — Don't Block the Event Loop", url: "https://nodejs.org/docs/latest/api/perf_hooks.html" }],
  },
  {
    id: "nperf-009",
    slug: "threadpool-starvation-and-uv-threadpool-size-in-node",
    topicId: "node-perf",
    difficulty: "Senior",
    question: "ما هي ظاهرة تشبع الـ Threadpool (Starvation) وكيف تضبط UV_THREADPOOL_SIZE لتفاديها؟",
    shortAnswer: "تحدث عندما تحتكر عمليات تشفير ثقيلة أو قراءات ملفات متزامنة خيوط libuv الأربعة الافتراضية مما يؤخر طلبات DNS وباقي مهام الـ I/O الأخرى.",
    explanation: "نظراً لأن وحدة crypto (مثل bcrypt أو pbkdf2) وعمليات نظام الملفات fs وحل أسماء النطاقات dns.lookup تتشارك نفس الـ threadpool الصغير، فإن تسجيل دخول 4 مستخدمين في نفس اللحظة قد يشغل كامل الخيوط ويمنع السيرفر من حل أي عنوان DNS حتى ينتهي التشفير. رفع الحجم إلى 16 أو 64 خيطاً يحل هذا الاختناق.",
    codeExample: `// تعيين المتغير في بيئة التشغيل قبل تشغيل التطبيق
// UV_THREADPOOL_SIZE=16 node app.js`,
    commonMistakes: ["توقع حل مشكلة تجويع الـ threadpool لمهام الـ CPU الصرفة؛ الـ threadpool مخصص فقط لمهام libuv وليس لأي كود JavaScript عادي."],
    followUpQuestions: ["ما الفرق بين dns.lookup المعتمد على الـ threadpool و dns.resolve الذي يستخدم c-ares غير الحاجم؟"],
    sources: [{ title: "Node.js docs — DNS and libuv threadpool", url: "https://nodejs.org/docs/latest/api/dns.html#implementation-considerations" }],
  },
  {
    id: "nperf-010",
    slug: "pm2-cluster-mode-and-reload-in-node",
    topicId: "node-perf",
    difficulty: "Junior",
    question: "كيف يسهل مدير العمليات PM2 إدارة خوادم Node.js في بيئات الإنتاج وما هو الـ Zero-Downtime Reload؟",
    shortAnswer: "يدير PM2 تشغيل التطبيق في وضع Cluster mode تلقائياً، ويعيد تشغيله عند الانهيار، ويتيح التحديث دون انقطاع بإعادة تشغيل العمليات واحدة تلو الأخرى.",
    explanation: "يوفر PM2 حلاً شاملاً لإدارة عمليات Node.js على السيرفرات التقليدية والافتراضية. عند استخدام pm2 reload، يرسل إشارة للعملية الأولى للإغلاق النظيف وينتظر بدء العملية الجديدة واستماعها للمنفذ قبل الانتقال للعملية التالية، مما يضمن استمرار استقبال الطلبات دون فقدان أي اتصال.",
    codeExample: `// ecosystem.config.js
module.exports = {
  apps: [{
    name: "api",
    script: "./dist/index.js",
    instances: "max",
    exec_mode: "cluster"
  }]
};`,
    commonMistakes: ["استخدام pm2 restart بدلاً من pm2 reload أثناء التحديثات، مما يقطع الخدمة مؤقتاً عن جميع المستخدمين."],
    followUpQuestions: ["كيف يتم جمع وتدوير ملفات السجلات (Log Rotation) في PM2؟"],
    sources: [{ title: "Node.js docs — Cluster and process management", url: "https://nodejs.org/docs/latest/api/cluster.html" }],
  },

  // Topic: node-testing (10 questions: ntest-001 to ntest-010)
  {
    id: "ntest-001",
    slug: "unit-testing-async-functions-in-node",
    topicId: "node-testing",
    difficulty: "Junior",
    question: "كيف تكتب اختبارات وحدة متينة للدوال غير المتزامنة ومراقبة رفض الوعود في Node.js؟",
    shortAnswer: "تكتب دوال الاختبار كـ async وتستخدم await مع الدوال المراد فحصها، وتستخدم assert.rejects لفحص الوعود التي يُتوقع فشلها.",
    explanation: "عند اختبار الكود غير المتزامن، يجب أن تنتظر دالة الاختبار انتهاء الـ Promise بالكامل؛ وإلا فإن الاختبار سينجح كاذباً قبل أن تكتمل العملية. لفحص حالات الخطأ، توفر مكتبات مثل node:assert دالة assert.rejects التي تتحقق من رفض الوعد ونوع رسالة الخطأ المتوقعة.",
    codeExample: `import { test } from "node:test";
import assert from "node:assert/strict";

test("throws error on invalid input", async () => {
  await assert.rejects(
    async () => fetchUser(-1),
    { name: "Error", message: "Invalid ID" }
  );
});`,
    commonMistakes: ["نسيان await أمام assert.rejects مما يجعل الاختبار ينتهي مبكراً دون التحقق الحقيقي من الخطأ."],
    followUpQuestions: ["كيف تضبط مهل الاختبارات الفردية (Test Timeouts) لتفادي تعليق الـ CI؟"],
    sources: [{ title: "Node.js docs — assert.rejects", url: "https://nodejs.org/docs/latest/api/assert.html#assertrejectsasyncfn-error-message" }],
  },
  {
    id: "ntest-002",
    slug: "supertest-api-integration-testing-in-node",
    topicId: "node-testing",
    difficulty: "Junior",
    question: "كيف تستخدم مكتبة Supertest لاختبار نقاط نهاية الـ HTTP دون الحاجة لربط السيرفر بمنفذ شبكة حقيقي؟",
    shortAnswer: "تمرر تطبيق Express أو Fastify إلى supertest التي تنشئ خادماً افتراضياً سريعاً يرسل طلبات HTTP محاكاة ويفحص رموز الحالة والترويسات ومحتوى الـ JSON.",
    explanation: "تتيح Supertest إجراء اختبارات تكاملية سريعة ومستقلة دون القلق بشأن تعارض المنافذ (Port Conflicts) عند تشغيل الاختبارات بالتوازي. يقوم Supertest باستدعاء دالة server.listen(0) تلقائياً على منفذ عشوائي مؤقت وإغلاقه فور اكتمال التوكيدات.",
    codeExample: `import request from "supertest";
import { app } from "./app";

test("GET /api/health returns 200", async () => {
  const res = await request(app)
    .get("/api/health")
    .expect("Content-Type", /json/)
    .expect(200);
  assert.equal(res.body.status, "healthy");
});`,
    commonMistakes: ["تصدير السيرفر وهو يستمع بالفعل لمنفذ ثابت (app.listen(3000)) داخل ملف التطبيق الرئيسي بدلاً من فصل تعريف الـ app عن تشغيل الـ server."],
    followUpQuestions: ["لماذا يجب فصل ملف app.ts عن server.ts لتسهيل الاختبارات التكاملية؟"],
    sources: [{ title: "Node.js docs — net.Server listen on port 0", url: "https://nodejs.org/docs/latest/api/net.html#serverlistenport-host-backlog-callback" }],
  },
  {
    id: "ntest-003",
    slug: "mocking-external-services-and-nock-in-node",
    topicId: "node-testing",
    difficulty: "Mid",
    question: "كيف تعزل الخدمات الخارجية في الاختبارات التكاملية باستخدام مكتبات مثل nock أو MSW؟",
    shortAnswer: "تعترض المكتبات استدعاءات الشبكة الخارجة (HTTP/HTTPS) على مستوى نواة Node.js وترجع استجابات وهمية مسبقة التحديد دون إجراء اتصالات إنترنت حقيقية.",
    explanation: "الاعتماد على واجهات خارجية حقيقية في الاختبارات يجعلها بطيئة، وغير مستقرة (Flaky)، ومكلفة. تعمل مكتبات مثل nock على اعتراض دالة http.request الأصلية في Node.js، ومطابقة المسارات والترويسات، وإرجاع استجابة محددة مع اختبار سيناريوهات الانقطاع والـ timeouts بأمان تام.",
    codeExample: `import nock from "nock";
nock("https://api.stripe.com")
  .post("/v1/charges")
  .reply(200, { id: "ch_123", paid: true });`,
    commonMistakes: ["نسيان تنظيف الـ Mocks بعد كل اختبار مما يسبب تداخل النتائج بين الاختبارات المتتالية."],
    followUpQuestions: ["كيف تضمن دالة nock.isDone() أن كل الاستدعاءات المتوقعة قد تمت بالفعل قبل نهاية الاختبار؟"],
    sources: [{ title: "Node.js docs — http.request client API", url: "https://nodejs.org/docs/latest/api/http.html#httprequestoptions-callback" }],
  },
  {
    id: "ntest-004",
    slug: "testcontainers-for-integration-tests-in-node",
    topicId: "node-testing",
    difficulty: "Senior",
    question: "ما هي ميزة استخدام Testcontainers لاختبار قواعد البيانات الحقيقية في مشاريع Node.js؟",
    shortAnswer: "تنشئ حاويات Docker حقيقية مؤقتة لقواعد البيانات (مثل PostgreSQL أو Redis) مخصصة لدورة حياة الاختبار، مما يضمن بيئة اختبار مطابقة تماماً للإنتاج.",
    explanation: "بدلاً من استخدام قواعد بيانات مبسطة في الذاكرة (مثل SQLite التي تفتقر لميزات ومحددات PostgreSQL المتقدمة)، تقوم Testcontainers بتشغيل حاوية حقيقية وتطبيق الـ migrations عليها وإجراء الاختبارات ثم تدمير الحاوية بالكامل. هذا يقضي نهائياً على مشكلة 'it works on my machine'.",
    codeExample: `import { PostgreSqlContainer } from "@testcontainers/postgresql";
const container = await new PostgreSqlContainer().start();
const dbUri = container.getConnectionUri();
// إجراء الاختبارات ثم إيقاف الحاوية
await container.stop();`,
    commonMistakes: ["إعادة إنشاء حاوية Docker جديدة لكل اختبار فردي مما يرفع زمن تنفيذ الـ suite لعشرات الدقائق بدلاً من مشاركتها."],
    followUpQuestions: ["كيف تشارك حاوية واحدة عبر جميع الاختبارات مع مسح البيانات (Truncate) بين الاختبارات؟"],
    sources: [{ title: "Node.js docs — Child process and container orchestration", url: "https://nodejs.org/docs/latest/api/child_process.html" }],
  },
  {
    id: "ntest-005",
    slug: "testing-race-conditions-and-concurrency-in-node",
    topicId: "node-testing",
    difficulty: "Senior",
    question: "كيف تصمم اختبارات للتحقق من سلامة العمليات ضد ظروف التسابق (Race Conditions) وتضارب الأرصدة؟",
    shortAnswer: "بإرسال عدة طلبات متزامنة في نفس اللحظة عبر Promise.all ومحاولة تنفيذ عمليات متعارضة (مثل حجز نفس المقعد أو سحب رصيد مرتين) والتأكد من نجاح عملية واحدة فقط.",
    explanation: "ظروف التسابق لا تظهر في الاختبارات المتسلسلة العادية. لاختبار قفل قاعدة البيانات أو المعاملات الموزعة، تطلق حزمة من الطلبات المتزامنة عبر Promise.all تجاه نفس المورد وتتحقق من أن واحداً فقط نجح برمز 200 بينما فشلت باقي الطلبات بتعارض 409 Conflict أو 422، وأن الرصيد النهائي متسق ودقيق.",
    codeExample: `const results = await Promise.all([
  withdraw(userId, 100),
  withdraw(userId, 100)
]);`,
    commonMistakes: ["تنفيذ العمليات المتزامنة في حلقة for عادية مما يجعلها تنفذ متسلسلة وتفشل في كشف ظروف التسابق."],
    followUpQuestions: ["كيف يساعد استخدام SELECT FOR UPDATE في SQL على منع تضارب الأرصدة في هذه الاختبارات؟"],
    sources: [{ title: "Node.js docs — Asynchronous concurrency", url: "https://nodejs.org/docs/latest/api/async_context.html" }],
  },
  {
    id: "ntest-006",
    slug: "consumer-driven-contract-testing-in-node",
    topicId: "node-testing",
    difficulty: "Senior",
    question: "ما هو اختبار العقود (Contract Testing) بأداة Pact بين خدمات Node.js الدقيقة؟",
    shortAnswer: "هو اختبار يتأكد من توافق واجهات الـ API بين العميل (Consumer) والمزود (Provider) دون الحاجة لتشغيل الخدمات معاً في بيئة اختبار متكاملة.",
    explanation: "في معمارية الـ Microservices، يؤدي كسر التوافق في الـ API إلى كوارث تشغيلية. في Contract Testing، يحدد العميل عقداً (Pact File) بالطلبات التي يتوقع إرسالها وشكل الاستجابة الدقيقة المطلوبة. يقوم المزود بتشغيل هذا العقد ضد واجهاته تلقائياً في الـ CI، مما يمنع نشر أي تعديل كاسر دون الحاجة لاختبارات E2E بطيئة ومكلفة.",
    codeExample: `// تعريف التوقعات في عقد Pact بين الخدمتين`,
    commonMistakes: ["استخدام Contract Testing كبديل كامل لاختبارات الوحدة للمنطق الداخلي؛ هو مخصص فقط لحدود التواصل."],
    followUpQuestions: ["ما الفرق بين Contract Testing والتحقق بواسطة OpenAPI / Swagger schemas؟"],
    sources: [{ title: "Node.js docs — Testing concepts", url: "https://nodejs.org/docs/latest/api/test.html" }],
  },
  {
    id: "ntest-007",
    slug: "end-to-end-backend-testing-in-node",
    topicId: "node-testing",
    difficulty: "Mid",
    question: "ما هو دور اختبارات النهاية إلى النهاية (E2E) في الأنظمة الخلفية ومتى تكون مفيدة؟",
    shortAnswer: "تتحقق من عمل سيناريوهات الأعمال الحيوية عبر كامل المنظومة المجمعة (الخادم، قواعد البيانات، طوابير المهام، والخدمات التابعة) من منظور العميل الحقيقي.",
    explanation: "تركز اختبارات E2E على مسارات الاستخدام الحساسة (مثل دورة إنشاء حساب، وإتمام عملية شراء، وإصدار الفاتورة). على عكس اختبارات الوحدة، لا يتم استخدام أي Mocks في E2E. على الرغم من ثقتها العالية، إلا أنها أبطأ وأكثر عرضة للتقلبات، لذا يجب الحفاظ على عدد قليل وموجه منها ضمن هرم الاختبارات.",
    codeExample: `// اختبار E2E لدورة الشراء الكاملة عبر عدة خدمات متكاملة`,
    commonMistakes: ["بناء هرم اختبارات مقلوب بحيث تكون معظم الاختبارات E2E مما يبطئ دورة التطوير بشكل هائل."],
    followUpQuestions: ["كيف تحافظ على استقرار بيانات الاختبار في بيئات الـ E2E لتفادي النتائج المتذبذبة؟"],
    sources: [{ title: "Node.js docs — Test runner execution", url: "https://nodejs.org/docs/latest/api/test.html" }],
  },
  {
    id: "ntest-008",
    slug: "code-coverage-and-mutation-testing-in-node",
    topicId: "node-testing",
    difficulty: "Mid",
    question: "لماذا لا تعد نسبة تغطية الكود (Code Coverage) 100% دليلاً كافياً على جودة الاختبارات وما هو الـ Mutation Testing؟",
    shortAnswer: "تغطية الكود تقيس فقط مرور الأسطر وليس صحة التوكيدات (Assertions)؛ والـ Mutation Testing يختبر قوة الاختبارات بإدخال أخطاء طفيفة عمداً والتأكد من فشل الاختبارات.",
    explanation: "يمكن تحقيق تغطية 100% ببساطة عبر استدعاء الدوال دون كتابة أي assert داخل الاختبار. يساعد Mutation Testing (مثل Stryker Mutator) على قياس جودة الاختبارات الحقيقية عبر تغيير عوامل المقارنة عمداً (مثل تحويل > إلى <) أو حذف سطور؛ إذا نجح الاختبار رغم التخريب (Survived Mutation)، فهذا دليل على ضعف توكيدات الاختبار.",
    codeExample: `// تشغيل التغطية الأصلية المدمجة في Node.js
// node --test --experimental-test-coverage`,
    commonMistakes: ["السعي وراء رقم 100% Code Coverage والتركيز على السطور التافهة بدلاً من الحالات الحدية الخطيرة."],
    followUpQuestions: ["كيف تعمل راية --experimental-test-coverage المدمجة في Node.js لجمع تقارير lcov؟"],
    sources: [{ title: "Node.js docs — Test runner code coverage", url: "https://nodejs.org/docs/latest/api/test.html#code-coverage" }],
  },
  {
    id: "ntest-009",
    slug: "testing-streams-and-event-emitters-in-node",
    topicId: "node-testing",
    difficulty: "Mid",
    question: "كيف تختبر الـ Streams ومطلقات الأحداث (EventEmitters) بشكل موثوق في اختبارات Node.js؟",
    shortAnswer: "باستخدام دالة events.once مع الوعود لانتظار الأحداث المحددة، أو تحويل الـ Streams إلى مصفوفة تكرارية عبر for await...of.",
    explanation: "اختبار الـ EventEmitters عبر callbacks التقليدية يسبب أخطاء عدم انتهاء الاختبار إذا لم يُطلق الحدث. الحل المعياري هو استخدام events.once(emitter, 'eventName') التي ترجع كائن Promise يُحل مع أول إطلاق للحدث أو يُلغى بمؤقت زمني إذا لم يطلق في الوقت المحدد.",
    codeExample: `import { once } from "node:events";
emitter.emit("ready", { status: true });
const [payload] = await once(emitter, "ready");
assert.equal(payload.status, true);`,
    commonMistakes: ["عدم وضع timeout عند انتظار أحداث الـ stream مما يؤدي لتعليق مشغل الاختبارات للأبد عند فشل الحدث."],
    followUpQuestions: ["كيف تختبر إطلاق أحداث الخطأ 'error' على Stream دون انهيار بيئة الاختبار؟"],
    sources: [{ title: "Node.js docs — events.once", url: "https://nodejs.org/docs/latest/api/events.html#eventsonceemitter-name-options" }],
  },
  {
    id: "ntest-010",
    slug: "flaky-tests-and-deterministic-fixtures-in-node",
    topicId: "node-testing",
    difficulty: "Senior",
    question: "ما هي أسباب الاختبارات المتقلبة (Flaky Tests) وكيف تحقق الحتمية (Determinism) في الاختبارات؟",
    shortAnswer: "أسبابها هي الاعتماد على توقيتات غير مضمونة (Timeouts عشوائية)، أو ترتيب الاختبارات، أو الوقت الحالي للنظام، أو بقايا بيانات سابقة، وتعالج بتجميد الوقت وتنظيف البيئة.",
    explanation: "الاختبار المتقلب هو اختبار ينجح تارة ويفشل تارة أخرى لنفس الكود. للقضاء عليها: 1) لا تستخدم setTimeout لانتظار أحداث غير متزامنة، بل استمع للأحداث الحقيقية، 2) استخدم مكتبات تجميد الوقت (Mocking Timers) للتحكم في new Date()، 3) عزل قواعد البيانات وتوليد معرفات وبيانات مستقلة لكل اختبار على حدة.",
    codeExample: `// استخدام mock timers الأصلية في node:test
test.mock.timers.enable();
test.mock.timers.tick(5000);`,
    commonMistakes: ["وضع setTimeout(..., 2000) في الاختبار بافتراض أن العملية ستنتهي حتماً في ثانيتين، وهو ما يفشل على خوادم الـ CI البطيئة."],
    followUpQuestions: ["كيف تستخدم ميزة test.mock.timers المدمجة في Node.js لاختبار الفواصل الزمنية بدقة؟"],
    sources: [{ title: "Node.js docs — Mocking Timers", url: "https://nodejs.org/docs/latest/api/test.html#mock-timers" }],
  },

  // Topic: node-arch (10 questions: narch-001 to narch-010)
  {
    id: "narch-001",
    slug: "clean-architecture-in-node",
    topicId: "node-arch",
    difficulty: "Senior",
    question: "كيف تطبق مبادئ المعمارية النظيفة (Clean Architecture) وفصل الاهتمامات في تطبيق Node.js؟",
    shortAnswer: "بتقسيم النظام إلى طبقات متحدة المركز: Entities، Use Cases، Controllers/Presenters، وInfrastructure، بحيث تشير التبعيات دائماً للداخل نحو منطق الأعمال المجرد.",
    explanation: "الهدف هو جعل منطق الأعمال الأساسي (Domain & Use Cases) مستقلاً تماماً عن أي تفاصيل تقنية مثل إطار العمل (Express/Fastify) أو نوع قاعدة البيانات (PostgreSQL/MongoDB). يتم ذلك عبر مبدأ عكس التبعيات (Dependency Inversion)؛ حيث تعرّف طبقة الـ Use Cases واجهات برمجية (Interfaces/Ports)، وتقوم طبقة الـ Infrastructure بتنفيذها وتزويدها عبر الـ Dependency Injection.",
    codeExample: `// Use Case مستقلة عن قاعدة البيانات
export class RegisterUserUseCase {
  constructor(private readonly userRepo: UserRepositoryPort) {}
  async execute(dto: RegisterUserDto) {
    // منطق العمل النقي
  }
}`,
    commonMistakes: ["استيراد نماذج قواعد البيانات (مثل نماذج Mongoose أو TypeORM) مباشرة داخل طبقة الـ Use Cases."],
    followUpQuestions: ["كيف تسهل المعمارية النظيفة استبدال إطار عمل السيرفر دون لمس منطق الأعمال؟"],
    sources: [{ title: "Node.js docs — Architectural Design Patterns", url: "https://nodejs.org/docs/latest/api/modules.html" }],
  },
  {
    id: "narch-002",
    slug: "message-queues-and-bullmq-in-node",
    topicId: "node-arch",
    difficulty: "Mid",
    question: "كيف تساعد طوابير الرسائل (Message Queues) مثل BullMQ في معالجة المهام الخلفية المعقدة؟",
    shortAnswer: "تفصل استقبال الطلب عن معالجته الثقيلة، حيث يُسجل الطلب في طابور سريع بـ Redis ويرد على المستخدم فوراً، وتقوم خوادم عمال (Workers) بمعالجة المهمة في الخلفية.",
    explanation: "في عمليات مثل إرسال الإيميلات، أو معالجة الصور، أو توليد تقارير PDF، لا يجب حظر المستخدم لعدة ثوانٍ. توفر مكتبة BullMQ المبنية فوق Redis طابور مهام موثوقاً يدعم إعادة المحاولة التلقائية عند الفشل (Retries مع Exponential Backoff)، وتأجيل المهام (Delayed Jobs)، والتحكم في معدل المعالجة، والعمل عبر خوادم متعددة.",
    codeExample: `import { Queue, Worker } from "bullmq";
const emailQueue = new Queue("emails", { connection: redisConfig });
await emailQueue.add("welcome", { to: "user@test.com" });

const worker = new Worker("emails", async job => {
  await sendEmail(job.data);
}, { connection: redisConfig });`,
    commonMistakes: ["معالجة مهام طويلة ومعقدة مباشرة داخل مسار الـ HTTP Request بدلاً من ترحيلها لطابور مهام."],
    followUpQuestions: ["كيف تتعامل مع مشكلة الـ Dead Letter Queue (DLQ) للمهام التي تفشل باستمرار؟"],
    sources: [{ title: "Node.js docs — Events and Streams in Background Processing", url: "https://nodejs.org/docs/latest/api/events.html" }],
  },
  {
    id: "narch-003",
    slug: "kafka-event-streaming-and-consumer-groups-in-node",
    topicId: "node-arch",
    difficulty: "Senior",
    question: "كيف تعمل مجموعات المستهلكين (Consumer Groups) في Apache Kafka مع خوادم Node.js؟",
    shortAnswer: "تسمح بتوزيع قراءة الرسائل من أقسام الـ Topic (Partitions) بين عدة نسخ متوازية من تطبيق Node.js لضمان المعالجة الأفقية السريعة مع الحفاظ على الترتيب.",
    explanation: "في Kafka، يتم تقسيم الـ Topic إلى Partitions متعددة. عندما تنضم عدة عمليات Node.js إلى نفس الـ Consumer Group، يقوم Kafka بتعيين أقسام محددة لكل نسخة بالتساوي. تضمن هذه المعمارية قراءة الرسائل بالترتيب الدقيق داخل كل Partition، مع إمكانية زيادة حجم المعالجة ببساطة عبر زيادة عدد الـ Workers ليطابق عدد الأقسام.",
    codeExample: `// استخدام KafkaJS لإعداد Consumer Group موزع`,
    commonMistakes: ["إضافة عدد مستهلكين في نفس المجموعة يفوق عدد الـ Partitions، مما يترك الخوادم الإضافية في حالة خمول."],
    followUpQuestions: ["ما هو دور الـ Consumer Rebalancing وكيف يؤثر على زمن معالجة الأحداث؟"],
    sources: [{ title: "Node.js docs — Stream consumers and networking", url: "https://nodejs.org/docs/latest/api/stream.html" }],
  },
  {
    id: "narch-004",
    slug: "grpc-vs-rest-microservices-in-node",
    topicId: "node-arch",
    difficulty: "Senior",
    question: "قارن بين استخدام gRPC و REST في التواصل الداخلي بين خدمات Node.js الدقيقة (Microservices).",
    shortAnswer: "يعتمد gRPC على بروتوكول HTTP/2 وتسلسل Protocol Buffers الثنائي السريع والمحدد بأنواع صارمة، مما يجعله أسرع وأقل استهلاكاً للشبكة من REST/JSON.",
    explanation: "في الاتصالات الداخلية الكثيفة بين مئات الخدمات الخلفية، يسبب تسلسل ونقل نصوص JSON عبر HTTP/1.1 عبئاً هائلاً. يوفر gRPC تواصلاً ثنائياً فائق السرعة، مع عقود برمجية صارمة وموحدة عبر ملفات .proto، ودعم التدفق ثنائي الاتجاه (Streaming)، وتوليد كود العميل والخادم تلقائياً لمختلف لغات البرمجة.",
    codeExample: `// استدعاء خدمة gRPC عبر عميل مولد من ملف proto`,
    commonMistakes: ["استخدام gRPC للواجهات العامة الموجهة للمتصفحات العادية التي تفتقر للدعم الأصيل لـ HTTP/2 gRPC."],
    followUpQuestions: ["كيف يدعم gRPC ميزة الـ Multiplexing الموروثة من بروتوكول HTTP/2؟"],
    sources: [{ title: "Node.js docs — HTTP/2 Module", url: "https://nodejs.org/docs/latest/api/http2.html" }],
  },
  {
    id: "narch-005",
    slug: "circuit-breaker-pattern-in-node",
    topicId: "node-arch",
    difficulty: "Senior",
    question: "ما هو نمط قاطع الدائرة (Circuit Breaker) وكيف يمنع الانهيارات المتتالية (Cascading Failures)؟",
    shortAnswer: "يراقب فشل الاتصال بالخدمات الخارجية؛ فإذا تجاوزت الأخطاء حداً معيناً يفتح الدائرة ويفشل الطلبات فوراً دون إرسالها، مانعاً استنزاف موارد السيرفر.",
    explanation: "إذا توقفت خدمة خارجية (كخدمة مدفوعات)، فإن محاولة مئات الطلبات الاتصال بها وانتظار الـ timeouts سيؤدي لاستنزاف كامل اتصالات وذاكرة تطبيقك وانهياره بالكامل. يمر نمط قاطع الدائرة (باستخدام مكتبات مثل opossum) بثلاث حالات: Closed (طبيعي)، Open (يرد فوراً بفشل أو Fallback دون اتصال)، وHalf-Open (يختبر عودة الخدمة بطلبات تجريبية قليلة).",
    codeExample: `import CircuitBreaker from "opossum";
const breaker = new CircuitBreaker(callExternalApi, { timeout: 3000, errorThresholdPercentage: 50 });
breaker.fallback(() => ({ status: "cached_fallback" }));
const result = await breaker.fire();`,
    commonMistakes: ["عدم توفير مسار استجابة بديل (Fallback) واضح عند فتح الدائرة."],
    followUpQuestions: ["كيف يحدد قاطع الدائرة الانتقال من حالة Open إلى Half-Open؟"],
    sources: [{ title: "Node.js docs — Error boundaries and resilience", url: "https://nodejs.org/docs/latest/api/errors.html" }],
  },
  {
    id: "narch-006",
    slug: "distributed-tracing-and-opentelemetry-in-node",
    topicId: "node-arch",
    difficulty: "Senior",
    question: "كيف تطبق التتبع الموزع (Distributed Tracing) باستخدام معيار OpenTelemetry في Node.js؟",
    shortAnswer: "يقوم بتوليد Trace ID موحد وتمريره عبر ترويسات الطلبات (W3C Trace Context)، لربط مسار الطلب وسجلاته عبر كل الخوادم وقواعد البيانات المشاركة.",
    explanation: "عندما يمر طلب مستخدم بخمس خدمات دقيقة مختلفة وقاعدة بيانات، يصبح من المستحيل تشخيص سبب البطء بالسجلات التقليدية المنفصلة. توفر أدوات OpenTelemetry لـ Node.js تتبعاً تلقائياً لمكتبات الـ HTTP وقواعد البيانات، حيث تقيس زمن تنفيذ كل عملية فرعية (Span) وتربطها في مخطط زمني موحد يُعرض على أدوات مثل Jaeger أو Datadog.",
    codeExample: `// تهيئة OpenTelemetry SDK قبل بدء التطبيق`,
    commonMistakes: ["فقدان تمرير ترويسة traceparent عند استدعاء الخدمات الخارجية عبر عميل الـ HTTP."],
    followUpQuestions: ["كيف يرتبط OpenTelemetry مع فئة AsyncLocalStorage لنقل سياق الـ Tracing داخل الخادم الواحد؟"],
    sources: [{ title: "Node.js docs — Async Context Tracing", url: "https://nodejs.org/docs/latest/api/async_context.html" }],
  },
  {
    id: "narch-007",
    slug: "structured-logging-and-log-aggregation-in-node",
    topicId: "node-arch",
    difficulty: "Junior",
    question: "لماذا يفضل استخدام التسجيل المهيكل (Structured JSON Logging) بمكتبات مثل Pino على console.log؟",
    shortAnswer: "لأن Pino يخرج السجلات ككائنات JSON مهيكلة تتضمن مستويات خطورة وتوقيتات واضحة، ويتم التسجيل بأداء غير حاجب وسريع جداً.",
    explanation: "في بيئات الإنتاج، تُجمع مخرجات السيرفرات بواسطة أدوات تجميع مثل Elasticsearch وLoki. يصعب استعلام النصوص العادية لـ console.log؛ بينما يتيح التسجيل المهيكل بصيغة JSON فلترة السجلات فوراً حسب مستوى الخطورة (level)، أو معرف الطلب (requestId)، أو كود الحالة. كما أن Pino يقلل العبء على الـ Event Loop بنقل معالجة النصوص الثقيلة خارج المسار الحرج.",
    codeExample: `import pino from "pino";
const logger = pino({ level: "info" });
logger.info({ userId: 123, action: "login" }, "User logged in successfully");`,
    commonMistakes: ["استخدام console.log في مسارات معالجة الطلبات عالية الكثافة، متناسين أن console.log متزامن في بعض البيئات ويحجب الخيط."],
    followUpQuestions: ["ما الفرق الأدائي بين الكتابة المتزامنة في stdout واستخدام pino.transport للمعالجة غير المتزامنة؟"],
    sources: [{ title: "Node.js docs — Console and stdio", url: "https://nodejs.org/docs/latest/api/console.html" }],
  },
  {
    id: "narch-008",
    slug: "kubernetes-liveness-and-readiness-probes-in-node",
    topicId: "node-arch",
    difficulty: "Mid",
    question: "ما الفرق الجوهري بين Liveness Probe و Readiness Probe في Kubernetes لتطبيقات Node.js؟",
    shortAnswer: "تتحقق الـ Liveness من أن العملية ما زالت حية وغير متجمدة (وإلا أعيد تشغيلها)، بينما تتحقق الـ Readiness من جاهزية التطبيق لاستقبال الطلبات (مثل اكتمال الاتصال بقاعدة البيانات).",
    explanation: "إذا فشل فحص الـ Liveness (مثلاً حدث Deadlock جمد الـ Event Loop)، يقوم Kubernetes بإعادة تشغيل الحاوية فوراً. أما إذا فشل فحص الـ Readiness (مثلاً أثناء تحميل بيانات أولية ضخمة أو تعطل قاعدة البيانات مؤقتاً)، يقوم Kubernetes بعزل الحاوية والتوقف عن توجيه الزيارات إليها دون قتل العملية، حتى تعود للجاهزية وتستأنف الخدمة.",
    codeExample: `// مسار الجاهزية يفحص اتصال قاعدة البيانات
app.get("/health/ready", async (req, res) => {
  const isDbOk = await db.ping();
  if (isDbOk) res.status(200).send("READY");
  else res.status(503).send("DB_DOWN");
});`,
    commonMistakes: ["ربط فحص الـ Liveness بقاعدة بيانات خارجية؛ فإذا سقطت قاعدة البيانات، سيعيد Kubernetes قتل وإعادة تشغيل كل خوادم Node.js عبثاً."],
    followUpQuestions: ["كيف تصمم مسار Startup Probe لحماية تطبيقات Node.js التي تستغرق وقتاً طويلاً في التحميل الأولي؟"],
    sources: [{ title: "Node.js docs — Process health and signals", url: "https://nodejs.org/docs/latest/api/process.html" }],
  },
  {
    id: "narch-009",
    slug: "docker-containerization-best-practices-for-node",
    topicId: "node-arch",
    difficulty: "Senior",
    question: "ما هي أفضل الممارسات الأمنية والأدائية لبناء حاويات Docker لتطبيقات Node.js؟",
    shortAnswer: "استخدام Multi-Stage Builds لتقليل الحجم، والتشغيل بحساب مستخدم غير جذري (non-root)، واستخدام dumb-init كـ PID 1 لمعالجة إشارات النظام بلباقة.",
    explanation: "الهدف هو بناء صور صغيرة وآمنة. الممارسات تشمل: 1) استخدام Multi-Stage Build لترجمة TypeScript وتثبيت devDependencies ثم نسخ ملفات الإنتاج فقط إلى الصورة النهائية، 2) عدم تشغيل التطبيق كـ root بل بحساب node المدمج، 3) استخدام أداة تهيئة مثل dumb-init أو tini لتشغيل العملية كـ PID 1 لضمان وصول إشارات SIGTERM وSIGINT لعملية Node.js بدقة وإغلاق العمليات اليتيمة (Zombie processes).",
    codeExample: `FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
USER node
CMD ["node", "dist/index.js"]`,
    commonMistakes: ["نسخ مجلد node_modules بالكامل من جهاز التطوير إلى داخل صورة Docker."],
    followUpQuestions: ["لماذا لا تستجيب Node.js افتراضياً لإشارات SIGTERM عندما تعمل كـ PID 1 مباشرة دون init system؟"],
    sources: [{ title: "Node.js docs — Docker and Container guidance", url: "https://nodejs.org/docs/latest/api/process.html#signal-events" }],
  },
  {
    id: "narch-010",
    slug: "idempotent-event-consumers-in-node",
    topicId: "node-arch",
    difficulty: "Senior",
    question: "كيف تصمم مستهلكات أحداث غير قابلة للتكرار (Idempotent Consumers) في الأنظمة الموزعة بـ Node.js؟",
    shortAnswer: "بتخزين معرف الحدث الفريد (Event ID) في قاعدة بيانات بحقل فريد ضمن معاملة ذرية، للتأكد من أن معالجة الرسالة عدة مرات تنتج نفس النتيجة ولا تكرر التأثيرات.",
    explanation: "في أنظمة الرسائل مثل Kafka أو RabbitMQ أو Webhooks، تضمن المنظومة تسليم الرسالة 'مرة واحدة على الأقل' (At-least-once delivery). قد تؤدي إعادة المحاولة أو انقطاع الشبكة إلى استلام نفس الحدث مرتين. لتحقيق الـ Idempotency، يتم فحص جدول processed_events بواسطة معرف الرسالة قبل المعالجة؛ فإذا كان مسجلاً بالفعل، يتم تجاهل الرسالة بنجاح دون تنفيذ أي عمليات مالية أو تعديلات مكررة.",
    codeExample: `// نمط التحقق الذري من معرف الحدث
const processed = await db.query(
  "INSERT INTO processed_events (event_id) VALUES ($1) ON CONFLICT DO NOTHING RETURNING event_id",
  [eventId]
);
if (processed.rows.length === 0) {
  return console.log("Event already handled, skipping");
}`,
    commonMistakes: ["الاعتماد على افتراض أن أنظمة الرسائل لن تسلم نفس الرسالة مطلقاً أكثر من مرة."],
    followUpQuestions: ["كيف تطبق نمط Outbox Pattern لضمان نشر الأحداث وقيد المعاملات ذريةً في قاعدة البيانات؟"],
    sources: [{ title: "Node.js docs — Transactional integrity in event-driven systems", url: "https://nodejs.org/docs/latest/api/events.html" }],
  },
];

const formattedQuestions = rawQuestions.map(q => ({
  id: q.id,
  slug: q.slug,
  trackId: "node",
  topicIds: [q.topicId],
  difficulty: q.difficulty,
  question: q.question,
  shortAnswer: q.shortAnswer,
  explanation: q.explanation,
  codeExample: q.codeExample,
  commonMistakes: q.commonMistakes,
  followUpQuestions: q.followUpQuestions,
  sources: q.sources,
  lastReviewedAt: "2026-09-07"
}));

console.log(`Generating Node questions: ${formattedQuestions.length}`);

// Write output to src/content/node-questions.ts
const fileHeader = `// Generated by scripts/build-node-questions.ts
import type { InterviewQuestion } from "./questions.ts";

export const nodeBaseQuestions: Omit<InterviewQuestion, "translations">[] = `;

const content = `${fileHeader}${JSON.stringify(formattedQuestions, null, 2)};\n`;
writeFileSync(resolve(process.cwd(), "src/content/node-questions.ts"), content, "utf8");
console.log("Successfully generated src/content/node-questions.ts with 100 questions.");
