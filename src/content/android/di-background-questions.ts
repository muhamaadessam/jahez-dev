import type { InterviewQuestion } from "../questions.ts";

export const diBackgroundQuestions: Omit<InterviewQuestion, "translations">[] = [
  // dependency-injection (6 questions)
  {
    id: "adi-001",
    slug: "dependency-injection-fundamentals",
    trackId: "android-native",
    topicIds: ["dependency-injection"],
    difficulty: "Junior",
    question: "ما هو حقن التبعيات (Dependency Injection) وما الفوائد الأساسية لتطبيقه في أندرويد؟",
    shortAnswer: "هو نمط تصميمي يقضي بتمرير التبعيات التي يحتاجها الكائن من الخارج بدلاً من قيام الكائن بإنشائها بنفسه داخل الـ Constructor.",
    explanation: "يحقق حقن التبعيات مبدأ Inversion of Control ويفصل بين مسؤولية استخدام الكائن ومسؤولية تكوينه. يسهل DI كتابة اختبارات الوحدة (Unit Testing) عن طريق استبدال التبعيات الحقيقية بمجسمات وهمية (Fakes/Mocks)، كما يقلل الاقتران الوثيق (Coupling) ويسهل صيانة وتعديل أجزاء التطبيق مستقبلاً.",
    codeExample: `// بدون DI (اقتران وثيق يصعب اختباره):
class Car {
    private val engine = Engine() // ينشئ تبعيته بنفسه
}

// مع DI (مرن وسهل الاستبدال في الاختبار):
class Car(private val engine: Engine) { // يستقبل تبعيته من الخارج
}`,
    commonMistakes: [
      "الخلط بين مكتبات حقن التبعيات الحقيقية ومحددات الخدمة (Service Locator) التي تخفي التبعيات وتصعب اكتشاف الأخطاء وقت الترجمة.",
    ],
    followUpQuestions: [
      "ما الفرق بين Constructor Injection و Field Injection وأيهما أفضل دائمًا؟",
    ],
    sources: [
      {
        title: "Android Developers — Dependency injection in Android",
        url: "https://developer.android.com/training/dependency-injection",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "adi-002",
    slug: "dagger-vs-hilt",
    trackId: "android-native",
    topicIds: ["dependency-injection"],
    difficulty: "Junior",
    question: "ما هو Hilt وما المزايا التي يقدمها فوق مكتبة Dagger 2 لتطبيقات أندرويد؟",
    shortAnswer: "Hilt هي مكتبة رسمية مبنية فوق Dagger لتبسيط استخدامها في أندرويد عبر توفير مكونات مسبقة التعريف (Standard Components) لدورة حياة الشاشات وإلغاء الحاجة لكتابة كود الـ Boilerplate المعقد يدويًا.",
    explanation: "في Dagger 2 التقليدي، كان المطور يضطر لكتابة Components و Subcomponents وإدارتها يدويًا ومتابعة دورة حياة كل Activity و Fragment. يوفر Hilt تكاملاً أصيلاً مع مكونات أندرويد (Activity, Fragment, ViewModel, WorkManager)، ويدير إنشاء شجرة التبعيات في وقت الترجمة (Compile-time Validation) بدون أي تضحية في الأداء.",
    codeExample: `@HiltAndroidApp
class MyApplication : Application()

@AndroidEntryPoint
class MainActivity : AppCompatActivity() {
    @Inject lateinit var analytics: AnalyticsTracker
}`,
    commonMistakes: [
      "نسيان إضافة @HiltAndroidApp في كلاس الـ Application، مما يمنع Hilt من بدء إنشاء رسم التبعيات بالكامل ويفشل البناء.",
    ],
    followUpQuestions: [
      "لماذا تعتبر Hilt أسرع وأكثر أمانًا من مكتبات الانعكاس الديناميكي (Reflection-based DI) وقت التشغيل؟",
    ],
    sources: [
      {
        title: "Android Developers — Dependency injection with Hilt",
        url: "https://developer.android.com/training/dependency-injection/hilt-android",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "adi-003",
    slug: "hilt-annotations-androidentrypoint-inject",
    trackId: "android-native",
    topicIds: ["dependency-injection"],
    difficulty: "Mid",
    question: "ما دور الوسوم الأساسية في Hilt: @HiltAndroidApp و @AndroidEntryPoint و @Inject؟",
    shortAnswer: "@HiltAndroidApp ينشئ الحاوية الجذرية، و @AndroidEntryPoint يهيئ مكونات أندرويد لحقن التبعيات، و @Inject يطلب التبعية أو يعرف كيفية إنشائها.",
    explanation: "@HiltAndroidApp يولد الكود الأساسي لمستوى التطبيق. @AndroidEntryPoint يُوضع على الـ Activities و Fragments و Services لتمكين Field Injection فيها؛ لأن نظام التشغيل هو من ينشئ هذه الكائنات ولا يمكن استخدام Constructor Injection معها. أما @Inject constructor فيُستخدم مع الكلاسات العادية لتعليم Hilt كيفية إنشائها وحقن معاملاتها تلقائيًا.",
    codeExample: `// 1. تعريف كيفية إنشاء الكائن عبر Constructor Injection:
class UserRepository @Inject constructor(
    private val apiService: ApiService
)

// 2. طلب الحقن في Activity عبر Field Injection:
@AndroidEntryPoint
class HomeActivity : AppCompatActivity() {
    @Inject lateinit var repository: UserRepository
}`,
    commonMistakes: [
      "استخدام @AndroidEntryPoint على Fragment بينما الـ Activity الحاضنة له غير موسومة بـ @AndroidEntryPoint، مما يسبب كراش فوري.",
      "محاولة جعل الحقول الموسومة بـ @Inject خاصة (private)، حيث يتطلب Hilt أن تكون الحقول عامة أو package-private لتمكينه من تعيين قيمها.",
    ],
    followUpQuestions: [
      "كيف يتم حقن ViewModel باستخدام وسم @HiltViewModel؟",
    ],
    sources: [
      {
        title: "Android Developers — Hilt architecture and annotations",
        url: "https://developer.android.com/training/dependency-injection/hilt-android#android-classes",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "adi-004",
    slug: "hilt-modules-provides-vs-binds",
    trackId: "android-native",
    topicIds: ["dependency-injection"],
    difficulty: "Mid",
    question: "ما الفرق بين @Provides و @Binds داخل كلاسات الـ Module في Hilt؟",
    shortAnswer: "@Binds دالة مجردة (abstract) سريعة لربط الواجهة (Interface) بتطبيقها المباشر؛ بينما @Provides دالة عادية تستخدم عندما يتطلب بناء الكائن منطقًا أو عندما يكون الكائن من مكتبة خارجية.",
    explanation: "تعتبر @Binds أكثر كفاءة لأن Dagger لا يولد أي كود تنفيذي لها في الـ bytecode؛ فقط يربط النوعين. أما @Provides فتُستخدم عندما لا تملك حق الوصول للـ Constructor الخاص بالكائن (مثل Retrofit, RoomDatabase, OkHttpClient) أو عند الحاجة لإجراء خطوات تهيئة شرطية قبل إرجاع الكائن.",
    codeExample: `@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {
    // @Binds لربط الواجهة بتطبيقها الفعلي بكفاءة:
    @Binds
    abstract fun bindAuthRepo(impl: AuthRepositoryImpl): AuthRepository
}

@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {
    // @Provides لبناء كائن من مكتبة خارجية:
    @Provides
    fun provideRetrofit(): Retrofit = Retrofit.Builder().baseUrl("https://api.com/").build()
}`,
    commonMistakes: [
      "استخدام @Provides بدلاً من @Binds لربط كلاسات التطبيق الداخلية البسيطة، مما يولد كود وسيط غير ضروري ويبطئ وقت الترجمة.",
    ],
    followUpQuestions: [
      "لماذا يجب أن يكون الكلاس أو الـ Module المعرّف لـ @Binds كلاسًا مجردًا (abstract class أو interface)؟",
    ],
    sources: [
      {
        title: "Android Developers — Hilt modules",
        url: "https://developer.android.com/training/dependency-injection/hilt-android#hilt-modules",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "adi-005",
    slug: "hilt-scopes-and-component-hierarchy",
    trackId: "android-native",
    topicIds: ["dependency-injection"],
    difficulty: "Mid",
    question: "كيف تعمل هرمية المكونات ونطاقات دورة الحياة (Scopes) في Hilt؟",
    shortAnswer: "تربط النطاقات كائنات التبعيات بدورة حياة مكونات أندرويد المحددة: @Singleton للتطبيق بالكامل، @ActivityScoped للنشاط، و @ViewModelScoped لدورة حياة الـ ViewModel.",
    explanation: "إذا لم تحدد نطاقًا (Unscoped)، ينشئ Hilt نسخة جديدة من الكائن في كل مرة يُطلب فيها. تحديد @Singleton يضمن وجود نسخة واحدة فقط في التطبيق بالكامل داخل SingletonComponent. تحديد @ActivityScoped يضمن مشاركة نفس النسخة طوال بقاء الـ Activity، بينما يضمن @ViewModelScoped بقاء النسخة حية عبر Configuration Changes مع الـ ViewModel.",
    codeExample: `@Module
@InstallIn(ViewModelComponent::class)
object FeatureModule {
    @Provides
    @ViewModelScoped
    fun provideFeatureState(): FeatureState = FeatureState()
}`,
    commonMistakes: [
      "استخدام @Singleton على كل شيء مما يستهلك الذاكرة دون مبرر ويبقي كائنات غير ضرورية حية طوال الوقت.",
      "محاولة حقن كائن معرف بنطاق ضيق (مثل @ActivityScoped) داخل كائن ذي نطاق أوسع (مثل @Singleton)، مما يسبب خطأ وقت الترجمة.",
    ],
    followUpQuestions: [
      "ما هو المكون المقابل لـ Fragment في هرمية Hilt وما هو الـ Scope المرتبط به؟",
    ],
    sources: [
      {
        title: "Android Developers — Component scopes in Hilt",
        url: "https://developer.android.com/training/dependency-injection/hilt-android#component-scopes",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "adi-006",
    slug: "qualifiers-and-custom-annotations-hilt",
    trackId: "android-native",
    topicIds: ["dependency-injection"],
    difficulty: "Senior",
    question: "كيف تحل تعارض توفير نسختين مختلفتين من نفس النوع باستخدام الـ Qualifiers في Hilt؟",
    shortAnswer: "بتعريف وسوم مخصصة (Custom Annotations) موسومة بـ @Qualifier لتمييز كل نسخة (مثل عميل شبكة موثق وعميل شبكة عام).",
    explanation: "عندما يحتاج التطبيق إلى نسختين من OkHttpClient أو Retrofit بإعدادات مختلفة، يفشل Dagger وقت الترجمة لعدم قدرته على التمييز بينهما. بحل هذا التعارض عبر @Qualifier، نربط كل نسخة بوسم فريد، ثم نستخدم نفس الوسم عند نقطة الحقن ليعرف Hilt أي نسخة محددة يجب تقديمها.",
    codeExample: `@Qualifier
@Retention(AnnotationRetention.BINARY)
annotation class AuthInterceptorOkHttpClient

@Qualifier
@Retention(AnnotationRetention.BINARY)
annotation class PublicOkHttpClient

// في نقطة التوفير:
@Provides
@AuthInterceptorOkHttpClient
fun provideAuthClient(): OkHttpClient = ...

// في نقطة الاستخدام:
class UserRemoteDataSource @Inject constructor(
    @AuthInterceptorOkHttpClient private val client: OkHttpClient
)`,
    commonMistakes: [
      "استخدام @Named مع نصوص يدوية بدلاً من كتابة Custom Qualifiers قوية، مما يسبب أخطاء هجائية صعبة الاكتشاف وقت التشغيل.",
    ],
    followUpQuestions: [
      "لماذا تعتبر الـ Custom Qualifiers أفضل وأكثر أمانًا من استخدام @Named(\"...\")؟",
    ],
    sources: [
      {
        title: "Android Developers — Qualifiers in Hilt",
        url: "https://developer.android.com/training/dependency-injection/hilt-android#qualifiers",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },

  // background-processing (5 questions)
  {
    id: "abg-001",
    slug: "android-services-types-and-lifecycle",
    trackId: "android-native",
    topicIds: ["background-processing"],
    difficulty: "Junior",
    question: "ما هي أنواع الـ Services في أندرويد وما الفرق الجوهري بينها؟",
    shortAnswer: "ثلاثة أنواع: Foreground Service التي تعرض إشعارًا مستمرًا للمستخدم لمهام ملحوظة، و Background Service للمهام غير المرئية، و Bound Service التي ترتبط بمكون عبر واجهة اتصال.",
    explanation: "لا تعمل الـ Service على خيط مستقل تلقائيًا بل تنفذ كودها على الـ Main Thread افتراضيًا ما لم تنشئ كوروتين أو خيط عمل. فرض نظام أندرويد قيودًا صارمة على Background Services لمنعها من العمل عندما يكون التطبيق مغلقًا، وألزم استخدام Foreground Services مع إشعار مرئي دائم (مثل تشغيل الموسيقى أو تتبع الرحلات).",
    codeExample: `class LocationService : Service() {
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // تحويلها لـ Foreground Service مع إشعار دائم
        val notification = buildTrackingNotification()
        startForeground(NOTIFICATION_ID, notification)
        return START_STICKY
    }
    override fun onBind(intent: Intent?): IBinder? = null
}`,
    commonMistakes: [
      "الاعتقاد بأن الـ Service تنشئ خيطًا منفصلاً تلقائيًا وتنفيذ عمليات حسابية ثقيلة فيها على الـ Main Thread مما يسبب ANR.",
      "إطلاق Background Service عندما يكون التطبيق في الخلفية في إصدارات أندرويد الحديثة، مما يسبب IllegalStateException فوري.",
    ],
    followUpQuestions: [
      "ما الفرق بين START_STICKY و START_NOT_STICKY و START_REDELIVER_INTENT في دالة onStartCommand؟",
    ],
    sources: [
      {
        title: "Android Developers — Services overview",
        url: "https://developer.android.com/guide/components/services",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "abg-002",
    slug: "workmanager-architecture-and-constraints",
    trackId: "android-native",
    topicIds: ["background-processing"],
    difficulty: "Mid",
    question: "ما هي معمارية WorkManager ولماذا تعتبر الحل الموصى به للمهام المضمونة والمؤجلة؟",
    shortAnswer: "هي مكتبة لإدارة المهام المضمونة التنفيذ حتى لو أُغلق التطبيق أو أُعيد تشغيل الجهاز، مع إمكانية ربطها بشروط (Constraints) مثل الاتصال بالإنترنت أو الشحن.",
    explanation: "تعتمد WorkManager داخليًا على JobScheduler في الإصدارات الحديثة وتخزن المهام في قاعدة بيانات SQLite محلية لضمان استمراريتها. تتيح تحديد شروط لتنفيذ المهمة، وإذا انقطعت الشروط أثناء العمل، يتم إيقاف العامل بأمان وإعادة جدولته تلقائيًا باستخدام سياسات التراجع التدريجي (Exponential Backoff).",
    codeExample: `val constraints = Constraints.Builder()
    .setRequiredNetworkType(NetworkType.UNMETERED) // يتطلب شبكة Wi-Fi
    .setRequiresCharging(true) // يتطلب الاتصال بالشاحن
    .build()

val uploadWork = OneTimeWorkRequestBuilder<UploadWorker>()
    .setConstraints(constraints)
    .setBackoffCriteria(BackoffPolicy.EXPONENTIAL, 15, TimeUnit.MINUTES)
    .build()

WorkManager.getInstance(context).enqueue(uploadWork)`,
    commonMistakes: [
      "استخدام WorkManager للمهام الفورية السريعة التي يجب أن تكتمل في اللحظة الحالية فقط أثناء تفاعل المستخدم، حيث يكون CoroutineScope العادي أفضل بكثير.",
    ],
    followUpQuestions: [
      "كيف تختلف فئة CoroutineWorker عن فئة Worker العادية في كتابة مهام WorkManager؟",
    ],
    sources: [
      {
        title: "Android Developers — Getting started with WorkManager",
        url: "https://developer.android.com/topic/libraries/architecture/workmanager/basics",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "abg-003",
    slug: "periodic-work-vs-one-time-work",
    trackId: "android-native",
    topicIds: ["background-processing"],
    difficulty: "Mid",
    question: "ما الفرق بين OneTimeWorkRequest و PeriodicWorkRequest وما هو الحد الأدنى للفاصل الزمني؟",
    shortAnswer: "OneTimeWorkRequest ينفذ المهمة مرة واحدة فقط، بينما PeriodicWorkRequest ينفذها بصفة دورية متكررة والحد الأدنى للفاصل الزمني هو 15 دقيقة لتوفير الطاقة.",
    explanation: "يمنع نظام أندرويد جدولة مهام PeriodicWorkRequest بفواصل أقل من 15 دقيقة (ExistingPeriodicWorkPolicy) لتفادي استنزاف موارد الجهاز والبطارية. كما تدعم المهام الدورية نافذة مرونة (Flex Period) تحدد متى يمكن للنظام تشغيل المهمة داخل كل دورة تكرار وفق الشروط المحددة وتجميع مهام النظام في وقت واحد (Batching).",
    codeExample: `// مهمة دورية تنفذ كل 6 ساعات بحد أقصى:
val syncRequest = PeriodicWorkRequestBuilder<SyncWorker>(
    repeatInterval = 6,
    repeatIntervalTimeUnit = TimeUnit.HOURS,
    flexTimeInterval = 30, // نافذة مرونة 30 دقيقة
    flexTimeIntervalUnit = TimeUnit.MINUTES
).build()

WorkManager.getInstance(context).enqueueUniquePeriodicWork(
    "SyncWork",
    ExistingPeriodicWorkPolicy.KEEP,
    syncRequest
)`,
    commonMistakes: [
      "محاولة ضبط repeatInterval أقل من 15 دقيقة، حيث يتجاهل WorkManager القيمة ويعيد ضبطها قسرًا على 15 دقيقة كحد أدنى تلقائيًا.",
    ],
    followUpQuestions: [
      "ما الفرق بين سياسات ExistingPeriodicWorkPolicy: KEEP و UPDATE و CANCEL_AND_REENQUEUE؟",
    ],
    sources: [
      {
        title: "Android Developers — Schedule periodic work",
        url: "https://developer.android.com/topic/libraries/architecture/workmanager/how-to/define-work#periodic_work",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "abg-004",
    slug: "foreground-services-and-notifications",
    trackId: "android-native",
    topicIds: ["background-processing"],
    difficulty: "Mid",
    question: "ما هي المتطلبات الصارمة لتشغيل Foreground Service في إصدارات أندرويد الحديثة (Android 14+)؟",
    shortAnswer: "يجب إعلان نوع محدد للخدمة (foregroundServiceType) في الـ Manifest وطلب صلاحيته الخاصة وإطلاق إشعار دائم مرئي للمستخدم عبر startForeground خلال ثوانٍ معدودة.",
    explanation: "منذ أندرويد 14، أصبح من الإلزامي تحديد نوع الخدمة بدقة (مثل location, mediaPlayback, dataSync)؛ ولا يسمح النظام بإطلاق الخدمة إذا لم تكن تتطابق مع الصلاحيات المصرح بها. بالإضافة إلى ذلك، إذا لم تستدعِ startForeground(id, notification) خلال 10 ثوانٍ من استدعاء startForegroundService()، سينهار التطبيق فورًا بخطأ ForegroundServiceDidNotStartInTimeException.",
    codeExample: `<!-- في ملف AndroidManifest.xml -->
<service
    android:name=".PlaybackService"
    android:foregroundServiceType="mediaPlayback" />

// في كود الكلاس:
override fun onCreate() {
    super.onCreate()
    val notification = createNotification()
    startForeground(1001, notification)
}`,
    commonMistakes: [
      "التأخر في استدعاء startForeground() بعد إطلاق الخدمة مما يسبب كراش فوري للتطبيق.",
      "استخدام نوع generic للخدمة دون تبرير واضح في سياسات متجر Google Play.",
    ],
    followUpQuestions: [
      "ما هي القيود المفروضة على بدء Foreground Services من الخلفية (Background Start Restrictions) في أندرويد 12+؟",
    ],
    sources: [
      {
        title: "Android Developers — Foreground services",
        url: "https://developer.android.com/develop/background-work/services/foreground-services",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "abg-005",
    slug: "doze-mode-and-app-standby",
    trackId: "android-native",
    topicIds: ["background-processing"],
    difficulty: "Senior",
    question: "كيف يدير نظام أندرويد استهلاك الطاقة عبر Doze Mode و App Standby وما تأثيرهما على المهام الخلفية؟",
    shortAnswer: "Doze Mode يعلق وصول التطبيقات للشبكة والـ WakeLocks والمزامنة الدورية عند سكون الجهاز وشاشته مغلقة؛ بينما App Standby يقيد التطبيقات التي لم يفتحها المستخدم لفترة طويلة.",
    explanation: "يدخل الجهاز في Doze Mode عندما يترك المستخدم الهاتف ثابتًا على سطح دون شحن مع إطفاء الشاشة. يوفر النظام فترات صيانة قصيرة (Maintenance Windows) دورية لتفريغ الأعمال المتراكمة، ثم يعود للنوم العميق. لتجاوز هذه القيود للمهام الحرجة، يُعتمد على إشعارات FCM عالية الأولوية (High Priority) أو منبهات AlarmManager الحتمية (setExactAndAllowWhileIdle).",
    codeExample: `// جدولة منبه حتمي يعمل حتى أثناء وضع Doze:
val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
alarmManager.setExactAndAllowWhileIdle(
    AlarmManager.RTC_WAKEUP,
    triggerTimeMillis,
    pendingIntent
)`,
    commonMistakes: [
      "الإفراط في استخدام WakeLocks وإبقاء المعالج نشطًا مما يستنزف البطارية ويصنف التطبيق كـ Bad Behavior في Google Play Vitals.",
    ],
    followUpQuestions: [
      "ما هو وضع Standby Buckets وكيف يقسم أندرويد التطبيقات إلى فئات (Active, Working set, Frequent, Rare)؟",
    ],
    sources: [
      {
        title: "Android Developers — Optimize for Doze and App Standby",
        url: "https://developer.android.com/training/monitoring-device-state/doze-standby",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
];
