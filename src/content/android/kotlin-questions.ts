import type { InterviewQuestion } from "../questions.ts";

export const kotlinQuestions: Omit<InterviewQuestion, "translations">[] = [
  {
    id: "kt-001",
    slug: "val-vs-var-in-kotlin",
    trackId: "android-native",
    topicIds: ["kotlin"],
    difficulty: "Junior",
    question: "ما الفرق بين val و var في لغة Kotlin؟",
    shortAnswer: "val تعرّف مرجعًا غير قابل لإعادة التعيين (Read-Only)، بينما var تعرّف متغيرًا قابلاً للتعديل وإعادة التعيين (Mutable).",
    explanation: "في Kotlin يُفضَّل دائمًا استخدام val لتعزيز مبدأ Immutability وتجنب الآثار الجانبية أثناء تعدد المسارات. لاحظ أن val تمنع إعادة توجيه المرجع لكائن آخر، لكن إذا كان الكائن نفسه قابلاً للتعديل (مثل MutableList) فيمكن تعديل محتوياته الداخلية.",
    codeExample: `val name = "Android" // لا يمكن إعادة تعيينه
// name = "Kotlin" // خطأ وقت الترجمة

var counter = 0
counter += 1 // مسموح

val list = mutableListOf("A", "B")
list.add("C") // مسموح لأن الكائن نفسه قابل للتعديل`,
    commonMistakes: [
      "الاعتقاد بأن val تعني أن محتويات الكائن غير قابلة للتغيير تمامًا (Deep Immutability) مثل const.",
      "استخدام var بدون حاجة فعلية لتعديل القيمة، مما يقلل وضوح الكود ويزيد من احتمالية الأخطاء.",
    ],
    followUpQuestions: [
      "كيف تختلف val عن const val في Kotlin؟",
      "هل تدعم val وجود custom getter يعيد قيمة مختلفة في كل مرة؟",
    ],
    sources: [
      {
        title: "Kotlin Docs — Basic syntax / Variables",
        url: "https://kotlinlang.org/docs/basic-syntax.html#variables",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "kt-002",
    slug: "const-val-vs-val-in-kotlin",
    trackId: "android-native",
    topicIds: ["kotlin"],
    difficulty: "Junior",
    question: "ما الفرق بين const val و val في Kotlin؟",
    shortAnswer: "const val ثابت معروف وقت الترجمة (Compile-time constant) للأنواع الأولية والنصوص فقط، بينما val يُسند وقت التشغيل (Runtime).",
    explanation: "يجب تعريف const val على مستوى الملف (top-level) أو داخل object/companion object، وتكون قيمتها محددة مسبقًا ويتم تضمينها مباشرة في bytecode عند كل استدعاء بدون دالة get. أما val العادية فيمكن أن تستقبل نتيجة دالة تُحسب وقت التشغيل مثل System.currentTimeMillis().",
    codeExample: `const val TIMEOUT_SECONDS = 30 // Compile-time constant
// const val CURRENT_TIME = System.currentTimeMillis() // خطأ: غير مسموح

val currentTime = System.currentTimeMillis() // مسموح: Runtime evaluation`,
    commonMistakes: [
      "محاولة استخدام const val مع كائنات مخصصة (Custom Objects) لا تنتمي للأنواع الأولية أو String.",
      "تعريف const val كمتغير محلي داخل دالة أو داخل كلاس عادي مباشرة.",
    ],
    followUpQuestions: [
      "أين يتم استبدال قيمة const val في الـ bytecode؟",
    ],
    sources: [
      {
        title: "Kotlin Docs — Compile-time constants",
        url: "https://kotlinlang.org/docs/properties.html#compile-time-constants",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "kt-003",
    slug: "null-safety-and-elvis-operator",
    trackId: "android-native",
    topicIds: ["kotlin"],
    difficulty: "Junior",
    question: "كيف يحمي نظام Null Safety في Kotlin من NullPointerException؟",
    shortAnswer: "يفصل Kotlin بين الأنواع غير القابلة لـ null والأنواع التي تقبلها (?)، ويوفر Safe Call (?.) و Elvis Operator (?:).",
    explanation: "بشكل افتراضي، لا يمكن للمتغيرات حمل قيمة null إلا إذا أُضيفت علامة الاستفهام للنوع (Nullable Types). يمنع المترجم الوصول المباشر لخصائص المتغيرات القابلة لـ null دون فحص مسبق، أو باستخدام Safe Call (?.)، كما يتيح Elvis Operator (?:) تحديد قيمة بديلة أو تنفيذ return/throw عند وجود null.",
    codeExample: `var nonNullable: String = "Hello"
// nonNullable = null // خطأ وقت الترجمة

var nullable: String? = null
val length: Int = nullable?.length ?: 0 // Safe call مع Elvis operator

val safeValue = nullable ?: throw IllegalArgumentException("Value is missing")`,
    commonMistakes: [
      "الإفراط في استخدام مشغل التأكيد القطعي (!!) الذي يلغي ميزة Null Safety ويسبب NullPointerException عند الخطأ.",
      "تجاهل استخدام Elvis Operator للتعامل مع الحالات الفارغة بشكل نظيف والاكتفاء بفحوصات if التقليدية المتكررة.",
    ],
    followUpQuestions: [
      "متى يكون استخدام مشغل !! مقبولاً ومبرراً في الكود؟",
      "كيف يتعامل Kotlin مع كود Java القديم الذي لا يحتوي على Nullability annotations؟",
    ],
    sources: [
      {
        title: "Kotlin Docs — Null safety",
        url: "https://kotlinlang.org/docs/null-safety.html",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "kt-004",
    slug: "data-classes-in-kotlin",
    trackId: "android-native",
    topicIds: ["kotlin"],
    difficulty: "Junior",
    question: "ما هي الـ Data Class في Kotlin وما الميثودات التي تولدها تلقائيًا؟",
    shortAnswer: "هي كلاسات مخصصة لحمل البيانات وتولّد تلقائيًا equals() و hashCode() و toString() و copy() ودوال الـ componentN().",
    explanation: "توفر data class كتابة كمية كبيرة من boilerplate code في Java. لتعريفها يجب أن يحتوي الـ primary constructor على معامل واحد على الأقل معرّف بـ val أو var، ولا يمكن للكلاس أن يكون abstract أو open أو inner. دالة copy() تتيح نسخ الكائن مع تعديل بعض الخصائص بسهولة لدعم الـ immutability.",
    codeExample: `data class User(val id: Int, val name: String, val email: String)

val user1 = User(1, "Ahmed", "ahmed@example.com")
val user2 = user1.copy(email = "new_email@example.com") // Immutability pattern

val (id, name) = user1 // Destructuring declaration عبر component1() و component2()`,
    commonMistakes: [
      "تعريف خصائص داخل جسم الكلاس وتوقع تضمينها في equals() و copy()، حيث تعتمد هذه الدوال فقط على معاملات الـ primary constructor.",
      "جعل data class ترث من كلاس مفتوح أو محاولة جعلها open.",
    ],
    followUpQuestions: [
      "كيف تؤثر الخصائص المعرفة في جسم الـ data class على دوال equals و hashCode؟",
    ],
    sources: [
      {
        title: "Kotlin Docs — Data classes",
        url: "https://kotlinlang.org/docs/data-classes.html",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "kt-005",
    slug: "type-checks-and-smart-casts",
    trackId: "android-native",
    topicIds: ["kotlin"],
    difficulty: "Junior",
    question: "كيف يعمل الـ Smart Cast في Kotlin؟",
    shortAnswer: "يقوم المترجم تلقائيًا بتحويل النوع (Cast) بعد التحقق منه بواسطة is دون حاجة لتحويل صريح يدويًا.",
    explanation: "عند فحص نوع متغير باستخدام is أو عند التحقق من عدم كونه null، يقوم المترجم بتتبعه وتحويله تلقائيًا إلى النوع الأضيق داخل نطاق الفحص (scope). يعمل Smart Cast مع المتغيرات المحلية من نوع val والخصائص الخاصة التي يضمن المترجم عدم تعديلها بين وقت الفحص ووقت الاستخدام.",
    codeExample: `fun printLength(obj: Any) {
    if (obj is String) {
        // Smart Cast تلقائي إلى String
        println(obj.length)
    }
}

val text: String? = "Hello"
if (text != null) {
    println(text.length) // Smart cast من String? إلى String
}`,
    commonMistakes: [
      "توقع عمل Smart Cast مع متغيرات var أو خصائص مفتوحة (open properties) يمكن تعديلها بواسطة thread آخر بين وقت الفحص والاستخدام.",
      "استخدام Unsafe Cast (as) بدلاً من Safe Cast (as?) عند وجود احتمال لعدم تطابق النوع.",
    ],
    followUpQuestions: [
      "لماذا لا يمكن للمترجم تطبيق Smart Cast على خصائص var العامة (public var)؟",
    ],
    sources: [
      {
        title: "Kotlin Docs — Type checks and casts",
        url: "https://kotlinlang.org/docs/typecasts.html",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "kt-006",
    slug: "sealed-classes-vs-enums",
    trackId: "android-native",
    topicIds: ["kotlin"],
    difficulty: "Mid",
    question: "ما الفرق بين Sealed Class و Enum في Kotlin ومتى نستخدم كل منهما؟",
    shortAnswer: "Enum يمثل مجموعة ثابتة من القيم الفردية المتطابقة، بينما Sealed Class تمثل تسلسلاً هرميًا مقيدًا يسمح لكل فرع بامتلاك حالته وبياناته الخاصة.",
    explanation: "تعتبر Sealed Class/Interface الخيار المثالي لتمثيل حالات واجهة المستخدم (UI State) وأحداثها في معمارية MVI/MVVM؛ لأن كل حالة (مثل Loading أو Success أو Error) قد تحتاج لبيانات مختلفة تمامًا. كلا النوعين يتيح استخدام when التعبيري بصورة حصرية وشاملة (Exhaustive) دون الحاجة لفرع else.",
    codeExample: `sealed interface UiState {
    data object Loading : UiState
    data class Success(val data: List<String>) : UiState
    data class Error(val exception: Throwable) : UiState
}

fun render(state: UiState) = when (state) {
    is UiState.Loading -> showProgressBar()
    is UiState.Success -> showList(state.data)
    is UiState.Error -> showError(state.exception.message)
    // لا حاجة لـ else لأن جميع الحالات مغطاة بالكامل
}`,
    commonMistakes: [
      "استخدام Enum لحالات تحتاج بيانات متغيرة مثل رسالة الخطأ أو قائمة البيانات.",
      "إضافة فرع else غير ضروري في when مع Sealed Classes، مما يحرم المطور من تنبيه المترجم عند إضافة حالة جديدة لاحقًا.",
    ],
    followUpQuestions: [
      "ما الفرق بين sealed class و sealed interface ومتى تفضل استخدام الـ interface؟",
    ],
    sources: [
      {
        title: "Kotlin Docs — Sealed classes and interfaces",
        url: "https://kotlinlang.org/docs/sealed-classes.html",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "kt-007",
    slug: "extension-functions-and-properties",
    trackId: "android-native",
    topicIds: ["kotlin"],
    difficulty: "Mid",
    question: "كيف تعمل الـ Extension Functions داخليًا في Kotlin؟",
    shortAnswer: "تُترجم كـ Static Methods في الـ Bytecode تستقبل الكائن الممتد (Receiver) كأول معامل، ولا تعدل الكلاس الأصلي.",
    explanation: "تتيح Extension Functions إضافة وظائف للكلاسات الموجودة (حتى لو كانت من مكتبات خارجية) دون وراثة. يتم حل استدعاء دوال الامتداد بشكل ثابت (Statically resolved) في وقت الترجمة اعتمادًا على النوع المعلن للمتغير، وليس ديناميكيًا وقت التشغيل (Dynamic Dispatch) كما في الدوال العادية.",
    codeExample: `fun View.visible() {
    this.visibility = View.VISIBLE
}

// في الـ Java Bytecode تُترجم إلى:
// public static final void visible(View receiver) {
//     receiver.setVisibility(View.VISIBLE);
// }`,
    commonMistakes: [
      "الاعتقاد بأن دوال الامتداد يمكنها الوصول إلى الحقول الخاصة (private members) في الكلاس الأصلي.",
      "توقع عمل الـ Polymorphism مع Extension Functions إذا كان لكلاس وابنه دالة امتداد بنفس الاسم.",
    ],
    followUpQuestions: [
      "إذا احتوى الكلاس الأصلي ودالة الامتداد على نفس التوقيع (Signature)، أي منهما له الأولوية في التنفيذ؟",
    ],
    sources: [
      {
        title: "Kotlin Docs — Extensions",
        url: "https://kotlinlang.org/docs/extensions.html",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "kt-008",
    slug: "scope-functions-let-run-apply-also-with",
    trackId: "android-native",
    topicIds: ["kotlin"],
    difficulty: "Mid",
    question: "ما الفروق الأساسية بين دوال النطاق (Scope Functions) في Kotlin؟",
    shortAnswer: "تختلف في طريقة الإشارة للكائن (this أو it) وفي القيمة المعادة (الكائن نفسه Context Object أو نتيجة اللامدا Lambda Result).",
    explanation: "تُستخدم apply و also لتهيئة الكائن وتنفيذ آثار جانبية وتُعيد الكائن نفسه (Context Object)، حيث تستخدم apply الإشارة this بينما تستخدم also المعامل it. أما let و run و with فتُعيد نتيجة تعبير اللامدا؛ تُستخدم let مع it لفحص null والتحويل، و run مع this لتجميع العمليات وحساب قيمة، بينما with تأخذ الكائن كمعامل مستقل.",
    codeExample: `// apply: تهيئة الكائن وإرجاعه
val intent = Intent().apply {
    action = Intent.ACTION_VIEW
    data = Uri.parse("https://developer.android.com")
}

// let: فحص null وتحويل النوع وإرجاع النتيجة
val length = text?.let { it.trim().length } ?: 0

// also: تنفيذ logging أو آثار جانبية وإرجاع الكائن
val user = createUser().also { log("User created: \${it.id}") }`,
    commonMistakes: [
      "تداخل أكثر من Scope Function بشكل معقد مما يجعل الكود غامضًا وصعب القراءة والصيانة.",
      "استخدام let فقط لفحص null عندما يكون if (x != null) أبسط وأوضح وأخف أداءً.",
    ],
    followUpQuestions: [
      "متى تفضل استخدام also على apply عند الرغبة في إرجاع الكائن الأصلي؟",
    ],
    sources: [
      {
        title: "Kotlin Docs — Scope functions",
        url: "https://kotlinlang.org/docs/scope-functions.html",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "kt-009",
    slug: "higher-order-functions-and-lambdas",
    trackId: "android-native",
    topicIds: ["kotlin"],
    difficulty: "Mid",
    question: "ما هي الدالة ذات الرتبة العليا (Higher-Order Function) في Kotlin؟",
    shortAnswer: "هي دالة تأخذ دالة أخرى كمعامل أو تعيد دالة كنتيجة.",
    explanation: "تتعامل Kotlin مع الدوال كـ First-Class Citizens، مما يسمح بتخزين الدوال في متغيرات وتمريرها وإرجاعها باستخدام Function Types مثل (T) -> R. عندما تكون اللامدا هي المعامل الأخير للدالة، يمكن كتابتها خارج قوسي استدعاء الدالة (Trailing Lambda Syntax).",
    codeExample: `fun filterTransactions(
    transactions: List<Double>,
    predicate: (Double) -> Boolean
): List<Double> {
    val result = mutableListOf<Double>()
    for (t in transactions) {
        if (predicate(t)) result.add(t)
    }
    return result
}

// Trailing lambda
val highValue = filterTransactions(transactions) { it > 1000.0 }`,
    commonMistakes: [
      "تجاهل تكلفة إنشاء كائنات Function في الذاكرة الحلقية عند تكرار استدعاء اللامدا دون استخدام inline.",
    ],
    followUpQuestions: [
      "كيف تؤثر دوال inline على استخدام الـ Higher-Order Functions من حيث الأداء؟",
    ],
    sources: [
      {
        title: "Kotlin Docs — Higher-order functions and lambdas",
        url: "https://kotlinlang.org/docs/lambdas.html",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "kt-010",
    slug: "delegated-properties-and-by-lazy",
    trackId: "android-native",
    topicIds: ["kotlin"],
    difficulty: "Mid",
    question: "كيف تعمل الـ Delegated Properties وما فائدة by lazy في Kotlin؟",
    shortAnswer: "تفوّض getter و setter لكائن Delegate، وتضمن by lazy تهيئة القيمة مرة واحدة فقط عند أول وصول إليها.",
    explanation: "تستخدم Delegated Properties الكلمة المفتاحية by لتمرير منطق القراءة والتعديل لكلاس يطبق getValue و setValue. الـ delegate الشائع by lazy يؤجل التهيئة الثقيلة حتى أول استدعاء ويكون Thread-Safe افتراضيًا (LazyThreadSafetyMode.SYNCHRONIZED)، مما يحافظ على سرعة الإقلاع واستهلاك الذاكرة.",
    codeExample: `val database: AppDatabase by lazy {
    Room.databaseBuilder(context, AppDatabase::class.java, "app.db").build()
}

// Custom delegate
class PreferenceDelegate<T>(val key: String, val default: T) {
    operator fun getValue(thisRef: Any?, property: KProperty<*>): T = ...
    operator fun setValue(thisRef: Any?, property: KProperty<*>, value: T) = ...
}`,
    commonMistakes: [
      "استخدام by lazy مع المتغيرات القابلة للتعديل var (lazy تدعم val فقط).",
      "الاعتماد على by lazy للوصول إلى Context أو View قبل اكتمال مرحلة onCreate في الـ Activity.",
    ],
    followUpQuestions: [
      "ما هي أنماط الـ ThreadSafetyMode المتاحة لـ lazy ومتى نستخدم NONE؟",
    ],
    sources: [
      {
        title: "Kotlin Docs — Delegated properties",
        url: "https://kotlinlang.org/docs/delegated-properties.html",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "kt-011",
    slug: "inline-noinline-and-crossinline",
    trackId: "android-native",
    topicIds: ["kotlin"],
    difficulty: "Senior",
    question: "ما الفرق بين inline و noinline و crossinline في Kotlin؟",
    shortAnswer: "inline تدمج كود الدالة واللامدا في مكان الاستدعاء؛ noinline تمنع دمج لامدا معينة؛ crossinline تسمح بالدمج وتمنع non-local returns.",
    explanation: "تزيل inline عبء تخصيص كائنات للـ lambdas وتستبدل الاستدعاء بالكود المباشر. إذا كانت الدالة تستقبل أكثر من لامدا ونريد تمرير إحداها ككائن عادي نستخدم noinline. أما crossinline فتُستخدم عندما تُستدعى اللامدا داخل نطاق آخر (كـ Runnable أو Coroutine)، فتمنع اللامدا من تنفيذ return خارجي غير موضعي ينهي الدالة الأصلية.",
    codeExample: `inline fun performWork(
    crossinline onAsyncCallback: () -> Unit,
    noinline normalCallback: () -> Unit
) {
    Executor { onAsyncCallback() } // crossinline تمنع non-local return هنا
    saveCallback(normalCallback) // noinline تسمح بتخزينها ككائن
}`,
    commonMistakes: [
      "جعل الدوال الضخمة inline مما يؤدي لتضخم حجم الـ bytecode (Code Bloat).",
      "محاولة استخدام inline على دوال عادية لا تستقبل معاملات من نوع Lambda دون تحقيق أي فائدة من التضمين.",
    ],
    followUpQuestions: [
      "ما هو الـ non-local return وكيف يؤثر على التحكم في مسار التنفيذ؟",
    ],
    sources: [
      {
        title: "Kotlin Docs — Inline functions",
        url: "https://kotlinlang.org/docs/inline-functions.html",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "kt-012",
    slug: "reified-type-parameters",
    trackId: "android-native",
    topicIds: ["kotlin"],
    difficulty: "Senior",
    question: "ما فائدة الكلمة المفتاحية reified في Kotlin وكيف تتجاوز Type Erasure؟",
    shortAnswer: "تحتفظ بمعلومات النوع الحقيقي (Generics) وقت التشغيل بفضل دمج الكود في مكان الاستدعاء عبر دالة inline.",
    explanation: "بسبب قيود JVM، يتم حذف معلومات Generic Types وقت الترجمة (Type Erasure)، فلا يمكن فحص T::class.java أو T is String مباشرة. بفضل inline مع reified، ينسخ المترجم الكود الفعلي ويستبدل T بالنوع الحقيقي المستدعى مباشرة في الـ bytecode، مما يتيح فحص النوع وبدء الـ Activities بدون تمرير Class<T> يدويًا.",
    codeExample: `// بدون reified
fun <T> start(context: Context, clazz: Class<T>) = Intent(context, clazz)

// مع inline و reified
inline fun <reified T : Activity> Context.launchActivity() {
    val intent = Intent(this, T::class.java)
    startActivity(intent)
}

// الاستدعاء النظيف:
context.launchActivity<MainActivity>()`,
    commonMistakes: [
      "محاولة استخدام reified في دوال عادية ليست inline.",
      "محاولة استدعاء دالة تحتوي على reified من كود لغة Java القديم (غير مدعوم لأن Java لا تفهم inlining).",
    ],
    followUpQuestions: [
      "لماذا لا يمكن استدعاء دوال reified من لغة Java؟",
    ],
    sources: [
      {
        title: "Kotlin Docs — Inline functions / Reified type parameters",
        url: "https://kotlinlang.org/docs/inline-functions.html#reified-type-parameters",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
];
