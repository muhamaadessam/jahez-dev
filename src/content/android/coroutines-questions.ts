import type { InterviewQuestion } from "../questions.ts";

export const coroutinesQuestions: Omit<InterviewQuestion, "translations">[] = [
  {
    id: "coro-001",
    slug: "coroutines-vs-threads",
    trackId: "android-native",
    topicIds: ["coroutines-concurrency"],
    difficulty: "Junior",
    question: "ما هي الـ Coroutines في Kotlin وكيف تختلف عن الـ Threads التقليدية لنظام التشغيل؟",
    shortAnswer: "هي خيوط عمل خفيفة جدًا (Lightweight Threads) يديرها وقت تشغيل Kotlin في وضع المستخدم (User-space) بدلاً من أن يديرها نظام التشغيل مباشرة.",
    explanation: "تخصيص Thread في نظام التشغيل يستهلك حوالي 1MB من الذاكرة ويحتاج إلى Context Switching مكلف عبر نواة النظام (Kernel). بينما الـ Coroutine لا تحجز مساحة مكدس (Stack) مخصصة؛ يمكن إيقافها واستئنافها دون حجب الـ Thread الفعلي، مما يسمح بتشغيل مئات الآلاف من الـ Coroutines في وقت واحد بكفاءة عالية على عدد محدود من الـ Threads.",
    codeExample: `// إطلاق 100,000 كوروتين خفيف بسلاسة دون استنزاف الذاكرة:
fun main() = runBlocking {
    repeat(100_000) {
        launch {
            delay(1000L)
            print(".")
        }
    }
}`,
    commonMistakes: [
      "حجب الـ Thread بواسطة Thread.sleep() داخل Coroutine بدلاً من استخدام دالة التعليق delay() غير الحاجبة.",
      "الاعتقاد بأن Coroutine تعني دائمًا العمل على Background Thread؛ إذ يمكن أن تعمل على الـ Main Thread إذا حُدد Dispatchers.Main.",
    ],
    followUpQuestions: [
      "ماذا يحدث للـ Thread الأصلي عندما يتم تعليق Coroutine عبر delay()؟",
    ],
    sources: [
      {
        title: "Kotlin Docs — Coroutines basics",
        url: "https://kotlinlang.org/docs/coroutines-basics.html",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "coro-002",
    slug: "suspend-functions-internal-working",
    trackId: "android-native",
    topicIds: ["coroutines-concurrency"],
    difficulty: "Junior",
    question: "كيف تعمل الـ Suspend Function في Kotlin تحت الغطاء (Under the hood)؟",
    shortAnswer: "يحولها المترجم باستخدام نمط تمرير الاستمرار (Continuation-Passing Style - CPS) إلى آلة حالات (State Machine) تستقبل كائن Continuation كمعامل إضافي.",
    explanation: "عند تعريف دالة بـ suspend، يضيف المترجم معامل Continuation<T> في الـ Bytecode. في كل نقطة تعليق (Suspension Point)، تحفظ آلة الحالة موضع التنفيذ والمتغيرات المحلية، وتُرجع علامة خاصة COROUTINE_SUSPENDED. عندما تنتهي العملية غير المتزامنة، يُستدعى continuation.resumeWith() لاستئناف التنفيذ من نفس النقطة بدون حجب.",
    codeExample: `// كود Kotlin الأصلي:
suspend fun fetchUserData(): String

// ما يولده المترجم تقريبًا في Bytecode:
fun fetchUserData(continuation: Continuation<String>): Any?`,
    commonMistakes: [
      "محاولة استدعاء Suspend Function من دالة عادية غير متزامنة دون إطلاق CoroutineScope مناسب.",
    ],
    followUpQuestions: [
      "ما هو دور كائن Continuation في حفظ وإعادة بناء الـ Call Stack للـ Coroutine؟",
    ],
    sources: [
      {
        title: "Kotlin Docs — Coroutines under the hood",
        url: "https://kotlinlang.org/docs/coroutines-guide.html",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "coro-003",
    slug: "coroutine-dispatchers",
    trackId: "android-native",
    topicIds: ["coroutines-concurrency"],
    difficulty: "Junior",
    question: "ما الفرق بين الموزعات المختلفة (Dispatchers: Main, IO, Default, Unconfined) في أندرويد؟",
    shortAnswer: "Main مخصص للواجهة والتفاعل، IO مخصص لعمليات الإدخال والإخراج والشبكة، Default مخصص للعمليات الحسابية المكثفة للمعالج، و Unconfined يبدأ على الخيط الحالي دون تقييد.",
    explanation: "Dispatchers.Main يدير المهام على الـ UI Thread. Dispatchers.IO يمتلك مجمع خيوط مرن (تصل إلى 64 خيطًا افتراضيًا) ومصمم لعمليات الانتظار الطويلة كقراءة الملفات والشبكة وقواعد البيانات. Dispatchers.Default يعتمد على عدد أنوية المعالج (CPU Cores) ومناسب لمعالجة الصور والـ JSON الكبير والخوارزميات المعقدة.",
    codeExample: `// استخدام withContext للتبديل السلس بين الخيوط:
suspend fun loadAndParseData(): Result = withContext(Dispatchers.IO) {
    val rawJson = networkClient.download() // IO work
    withContext(Dispatchers.Default) {
        parseHeavyJson(rawJson) // CPU work
    }
}`,
    commonMistakes: [
      "تنفيذ عمليات فك تشفير صور ضخمة أو فرز قوائم عملاقة على Dispatchers.IO بدلاً من Dispatchers.Default.",
      "تنفيذ استعلامات قواعد البيانات أو مكالمات الشبكة على Dispatchers.Main مما يسبب تجميد الواجهة والـ ANR.",
    ],
    followUpQuestions: [
      "كيف يمكنك ضبط موزع مخصص (Custom Dispatcher) باستخدام مُجمّع خيوط محدد ExecutorService؟",
    ],
    sources: [
      {
        title: "Kotlin Docs — Coroutine context and dispatchers",
        url: "https://kotlinlang.org/docs/coroutine-context-and-dispatchers.html",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "coro-004",
    slug: "launch-vs-async-in-coroutines",
    trackId: "android-native",
    topicIds: ["coroutines-concurrency"],
    difficulty: "Mid",
    question: "ما الفرق بين باني الكوروتين launch وباني async ومتى نستخدم كل منهما؟",
    shortAnswer: "launch يطلق كوروتين بنمط 'أطلق وانسَ' (Fire-and-forget) ويعيد كائن Job؛ بينما async يطلق مهمة تعيد نتيجة متوقعة كـ Deferred<T> وتُسترجع عبر await().",
    explanation: "يُستخدم launch عندما لا نحتاج لقيمة معادة من الكوروتين (مثل تسجيل حدث أو حفظ سجل). أما async فيُستخدم عند الرغبة في حساب قيمة، وخصوصًا لتشغيل عدة طلبات متزامنة في الخلفية والانتظار حتى تكتمل جميعها عبر await() أو awaitAll(). لاحظ أن الاستثناءات في async تُكتم ولا تظهر حتى يتم استدعاء await().",
    codeExample: `// تنفيذ طلبين شبكيين متزامنين لتقليل زمن الانتظار:
suspend fun fetchDashboardData(): Dashboard = coroutineScope {
    val profileDeferred = async { api.getProfile() }
    val statsDeferred = async { api.getStats() }

    // ينتظر اكتمال الاثنين بالتوازي:
    Dashboard(profileDeferred.await(), statsDeferred.await())
}`,
    commonMistakes: [
      "استخدام async بدلاً من launch دون استدعاء await()، مما يؤدي لابتلاع الأخطاء وعدم إدراك حدوث أي مشكلة.",
      "استدعاء await() فور استدعاء async في سطر متتابع مباشرة، مما يلغي ميزة التوازي ويجعل الكود متسلسلاً بطيئًا.",
    ],
    followUpQuestions: [
      "ماذا يحدث إذا فشل أحد الطلبين داخل coroutineScope عند استخدام async؟",
    ],
    sources: [
      {
        title: "Kotlin Docs — Composing suspending functions",
        url: "https://kotlinlang.org/docs/composing-suspending-functions.html",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "coro-005",
    slug: "structured-concurrency-and-jobs",
    trackId: "android-native",
    topicIds: ["coroutines-concurrency"],
    difficulty: "Mid",
    question: "ما هو مبدأ التزامن الهيكلي (Structured Concurrency) في Kotlin Coroutines؟",
    shortAnswer: "هو مبدأ تنظيمي يضمن عدم تسريب أي كوروتين، بحيث تُرتب الكوروتينات في تسلسل هرمي كأبناء لأب لا ينتهي إلا بانتهاء جميع أبنائه، وإذا أُلغي الأب يُلغى كل أبنائه تلقائيًا.",
    explanation: "يمنع التزامن الهيكلي مشكلة المهام المعلقة التي تعمل في الخلفية وتهدر الذاكرة والبطارية بعد مغادرة المستخدم للشاشة. عندما تنتهي دورة حياة ViewModel (onCleared) أو الـ Activity، يقوم الـ CoroutineScope بإلغاء الـ Parent Job، مما ينشر إشارة الإلغاء فورًا لجميع العمليات والأبناء المتفرعين منها.",
    codeExample: `// coroutineScope يضمن عدم خروج الدالة حتى تكتمل كل المهام الفرعية:
suspend fun processOrder() = coroutineScope {
    launch { validateInventory() }
    launch { reservePayment() }
    // لا تنتهي processOrder إلا بنجاح الاثنين، وإذا فشل أحدهما يلغى الآخر فورًا
}`,
    commonMistakes: [
      "استخدام GlobalScope.launch الذي يكسر Structured Concurrency ويعزل الكوروتين عن أي دورة حياة، مسببًا تسريب ذاكرة خطيرًا.",
    ],
    followUpQuestions: [
      "لماذا يعتبر GlobalScope غير مستحسن في 99% من سيناريوهات تطبيقات أندرويد؟",
    ],
    sources: [
      {
        title: "Kotlin Docs — Structured concurrency",
        url: "https://kotlinlang.org/docs/coroutines-basics.html#structured-concurrency",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "coro-006",
    slug: "coroutine-cancellation-cooperative",
    trackId: "android-native",
    topicIds: ["coroutines-concurrency"],
    difficulty: "Mid",
    question: "لماذا يقال إن إلغاء الـ Coroutine عملية تعاونية (Cooperative Cancellation) وكيف تتأكد من استجابتها؟",
    shortAnswer: "لأن الكوروتين لا يمكن إيقافها قسرًا من الخارج؛ بل يجب أن يتحقق الكود دوريًا من حالة الإلغاء (isActive) أو يستدعي دوال تعليق قياسية تفحص الإلغاء.",
    explanation: "عند استدعاء job.cancel()، تتحول حالة الكوروتين إلى إيقاف، وتطلق دوال التعليق القياسية في المكتبة (مثل delay و yield) استثناء CancellationException. إذا كان الكود يحتوي على حلقة تكرار حسابية مكثفة (CPU Loop) دون استدعاء دوال تعليق، فلن يتوقف الكوروتين ما لم تفحص يدوياً شرط isActive أو تستدعي ensureActive().",
    codeExample: `val job = scope.launch(Dispatchers.Default) {
    var i = 0
    while (isActive) { // فحص التعاون مع الإلغاء
        doCpuHeavyWork(i++)
    }
}
job.cancel() // سيستجيب الكوروتين في الدورة القادمة ويتوقف`,
    commonMistakes: [
      "التقاط Exception بشكل عام (catch (e: Exception)) دون إعادة رمي CancellationException، مما يبتلع إشارة الإلغاء ويمنع الكوروتين من التوقف.",
    ],
    followUpQuestions: [
      "كيف تنفذ عملية تنظيف غير قابلة للإلغاء (مثل إغلاق ملف) بعد إلغاء الكوروتين باستخدام withContext(NonCancellable)؟",
    ],
    sources: [
      {
        title: "Kotlin Docs — Cancellation and timeouts",
        url: "https://kotlinlang.org/docs/cancellation-and-timeouts.html",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "coro-007",
    slug: "exception-handling-coroutineexceptionhandler",
    trackId: "android-native",
    topicIds: ["coroutines-concurrency"],
    difficulty: "Mid",
    question: "كيف تتم معالجة الأخطاء غير الملتقطة في الكوروتين باستخدام CoroutineExceptionHandler؟",
    shortAnswer: "يعمل كصمام أمان أخير (Global Catch) لالتقاط الاستثناءات غير المعالجة في الـ Root Coroutine المطلقة بواسطة launch لمنع كراش التطبيق.",
    explanation: "يُثبت CoroutineExceptionHandler على مستوى الـ CoroutineScope أو الـ Root Job. لا يمنع المعالج إلغاء الكوروتين نفسه أو انتشار الفشل للأب في الـ Job العادية، لكنه يوفر مكانًا مركزيًا لتسجيل الخطأ (Logging) وعرض رسالة للمستخدم بدلاً من انهيار التطبيق. لا يؤثر المعالج على async لأنه يحتفظ بالاستثناء داخل كائن Deferred ليرميه عند await().",
    codeExample: `val handler = CoroutineExceptionHandler { _, exception ->
    Log.e("Coroutines", "Caught unhandled exception: \$exception")
}

val scope = CoroutineScope(Dispatchers.Main + Job() + handler)
scope.launch {
    throw RuntimeException("Network crash!") // يلتقطه handler بأمان
}`,
    commonMistakes: [
      "محاولة تثبيت CoroutineExceptionHandler داخل كوروتين ابن (Child Coroutine)، حيث يتجاهله النظام ولا يستجيب إلا إذا كان على الـ Root.",
      "توقع أن يمنع المعالج الكوروتين الفاشل من إيقاف بقية العمليات المرتبطة به في الـ Standard Job.",
    ],
    followUpQuestions: [
      "لماذا لا يؤثر CoroutineExceptionHandler على الاستثناءات الناتجة داخل كتل async؟",
    ],
    sources: [
      {
        title: "Kotlin Docs — Coroutine exceptions handling",
        url: "https://kotlinlang.org/docs/exception-handling.html",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "coro-008",
    slug: "supervisorjob-vs-job-failure-propagation",
    trackId: "android-native",
    topicIds: ["coroutines-concurrency"],
    difficulty: "Senior",
    question: "ما الفرق الجوهري بين Job عادية و SupervisorJob في انتشار الاستثناءات؟",
    shortAnswer: "في Job العادية، فشل أي ابن يؤدي لإلغاء الأب وجميع الأبناء الآخرين فورًا؛ بينما في SupervisorJob، يتم عزل الفشل ولا يؤثر تعطل ابن على باقي الأبناء.",
    explanation: "يعتبر هذا الفرق حاسمًا في بناء واجهات المستخدم ومكتبات أندرويد (مثل viewModelScope المعتمد على SupervisorJob). لو فشل طلب جلب صورة في الشاشة فلن ترغب في إلغاء طلب جلب معلومات المستخدم الأساسية. باستخدام SupervisorJob، يعالج كل ابن خطأه باستقلالية تامة دون هدم شجرة العمليات بأكملها.",
    codeExample: `val supervisorScope = CoroutineScope(Dispatchers.IO + SupervisorJob())

supervisorScope.launch {
    throw RuntimeException("فشل هذا الابن فقط")
}

supervisorScope.launch {
    // هذا الابن يستمر في العمل بنجاح ولا يتأثر بفشل جاره!
    delay(1000L)
    println("ما زلت أعمل بنجاح")
}`,
    commonMistakes: [
      "تمرير SupervisorJob كوسيط في دالة launch(SupervisorJob()) وتوقع عزل أخطاء الأبناء داخلها، فالـ launch ينشئ دائمًا Standard Job لابنه ما لم يُستخدم supervisorScope {}.",
    ],
    followUpQuestions: [
      "ما الفرق بين استخدام كائن SupervisorJob() واستدعاء الدالة المعلقة supervisorScope {}؟",
    ],
    sources: [
      {
        title: "Kotlin Docs — Supervision in coroutines",
        url: "https://kotlinlang.org/docs/exception-handling.html#supervision",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "coro-009",
    slug: "cold-flow-vs-hot-flow",
    trackId: "android-native",
    topicIds: ["coroutines-concurrency"],
    difficulty: "Senior",
    question: "ما الفرق المعماري بين التدفق البارد (Cold Flow) والتدفق الساخن (Hot Flow) في Kotlin؟",
    shortAnswer: "التدفق البارد (Flow) لا ينفذ كوده إلا عند وجود مستهلك (Collector)، بينما التدفق الساخن (StateFlow/SharedFlow) يبث البيانات دائمًا في الذاكرة حتى لو لم يوجد أي مستمع.",
    explanation: "يشبه التدفق البارد أسطوانة CD لا تصدر صوتًا إلا عند تشغيلها من قبل مستمع محدد، وكل مستهلك جديد يبدأ السلسلة من الصفر (مثل استعلام قاعدة بيانات). التدفق الساخن يشبه البث الإذاعي المباشر؛ يعيش مستقلاً في الذاكرة ويشارك نفس البيانات مع عدة مستمعين في وقت واحد (Multicasting) ويحتفظ بآخر قيمة (StateFlow) أو تخزين مؤقت Replay Cache (SharedFlow).",
    codeExample: `// Cold Flow: يبدأ من الصفر مع كل collect()
fun getNumbers(): Flow<Int> = flow {
    emit(1); emit(2)
}

// Hot Flow: يحتفظ بالحالة في الذاكرة ويبثها للمراقبين الحاليين
val stateFlow = MutableStateFlow("Initial Value")`,
    commonMistakes: [
      "تحويل Cold Flow إلى Hot Flow باستخدام shareIn أو stateIn دون تحديد CoroutineScope وسياسة SharingStarted المناسبة، مما يسبب تسريب استهلاك البيانات.",
    ],
    followUpQuestions: [
      "ما الفرق بين SharingStarted.Eagerly و SharingStarted.Lazily و SharingStarted.WhileSubscribed(5000)؟",
    ],
    sources: [
      {
        title: "Kotlin Docs — Asynchronous Flow",
        url: "https://kotlinlang.org/docs/flow.html",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "coro-010",
    slug: "channels-vs-flows-in-kotlin",
    trackId: "android-native",
    topicIds: ["coroutines-concurrency"],
    difficulty: "Senior",
    question: "متى تستخدم Channel ومتى تفضل استخدام Flow في معمارية تطبيقات أندرويد؟",
    shortAnswer: "تُستخدم Channel للاتصال من نقطة لنقطة وتوزيع المهام (Queue) حيث يستهلك القيمة مستقبل واحد فقط؛ بينما يُستخدم Flow لبث البيانات المتجددة (Streams) لمستمعين متعددين.",
    explanation: "تمثل الـ Channel قناة اتصال ساخنة (Hot Communication Pipeline) مناسبة لتمرير الأحداث الفردية التي يجب معالجتها مرة واحدة بدقة (مثل رغبات التنقل بين الشاشات أو إضافة عناصر لطابور إرسال). أما Flow فهو الخيار القياسي لتمثيل حالات الواجهة وتدفقات قواعد البيانات ومراقبة حالة الشبكة المستمرة.",
    codeExample: `val eventChannel = Channel<UiEffect>(Channel.BUFFERED)

// إرسال حدث فردي:
eventChannel.send(UiEffect.ShowToast("تم الحفظ بنجاح"))

// استهلاك الحدث مرة واحدة فقط:
val effect = eventChannel.receive()`,
    commonMistakes: [
      "استخدام Channel لإدارة حالة واجهة مستخدم (UI State)، لأنها تفقد قيمتها بمجرد استهلاكها من أول مراقب ولا تحتفظ بقيمة حالية ليعاد رسمها عند تدوير الشاشة.",
    ],
    followUpQuestions: [
      "ما هي استراتيجيات امتلاء الـ Buffer المختلفة في Channel (مثل DROP_OLDEST و SUSPEND)؟",
    ],
    sources: [
      {
        title: "Kotlin Docs — Channels",
        url: "https://kotlinlang.org/docs/channels.html",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
];
