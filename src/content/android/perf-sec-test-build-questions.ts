import type { InterviewQuestion } from "../questions.ts";

export const perfSecTestBuildQuestions: Omit<InterviewQuestion, "translations">[] = [
  // performance-memory (6 questions)
  {
    id: "aperf-001",
    slug: "anr-causes-and-detection",
    trackId: "android-native",
    topicIds: ["performance-memory"],
    difficulty: "Junior",
    question: "ما هو خطأ ANR (Application Not Responding) وما أسبابه الرئيسية وكيفية تتبعه؟",
    shortAnswer: "يحدث عندما يحجب التطبيق الـ Main Thread لأكثر من 5 ثوانٍ أثناء التفاعل مع المستخدم أو أكثر من 10 ثوانٍ في BroadcastReceiver؛ وسببه عمليات الشبكة أو الحسابات الثقيلة على خيط الواجهة.",
    explanation: "يراقب نظام أندرويد استجابة الـ Main Thread. عند حجب الخيط (UI Thread Blocking)، يظهر مربع الحوار الشهير لإجبار التطبيق على الإغلاق. يتم فحص مسبباته عن طريق فحص ملف /data/anr/traces.txt أو عبر أداة StrictMode و Google Play Console Android Vitals التي تسجل الـ Call Stack للـ Main Thread لحظة التجمد.",
    codeExample: `// تفعيل StrictMode في مرحلة التطوير لاكتشاف حجب الـ UI فورًا:
if (BuildConfig.DEBUG) {
    StrictMode.setThreadPolicy(
        StrictMode.ThreadPolicy.Builder()
            .detectDiskReads()
            .detectDiskWrites()
            .detectNetwork()
            .penaltyLog()
            .build()
    )
}`,
    commonMistakes: [
      "القيام بعمليات قراءة ملفات ضخمة أو تشفير أو استعلامات قواعد بيانات على الـ Main Thread.",
      "حدوث حالة Deadlock بين خيط الواجهة وخيوط عمل في الخلفية.",
    ],
    followUpQuestions: [
      "ما هي المدة المحددة لظهور ANR في Foreground Services مقارنة بأحداث اللمس؟",
    ],
    sources: [
      {
        title: "Android Developers — ANRs overview",
        url: "https://developer.android.com/topic/performance/vitals/anr",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "aperf-002",
    slug: "memory-leaks-and-leakcanary",
    trackId: "android-native",
    topicIds: ["performance-memory"],
    difficulty: "Mid",
    question: "ما هو تسريب الذاكرة (Memory Leak) في أندرويد وكيف تساعد أداة LeakCanary في اكتشافه؟",
    shortAnswer: "يحدث عندما يحتفظ كائن طويل العمر بمرجع قوي (Strong Reference) لكائن انتهت دورة حياته (كالـ Activity)، مما يمنع مجمع النفايات (GC) من تحريره؛ وتكتشفه LeakCanary بتتبع كائنات مفرغة عبر مراجع ضعيفة.",
    explanation: "تراقب LeakCanary كائنات الـ Activity و Fragment بعد استدعاء onDestroy. تنتظر 5 ثوانٍ ثم تشغل الـ Garbage Collection؛ إذا بقي الكائن في الذاكرة، تقوم بأخذ تفريغ للذاكرة (Heap Dump) عبر Hprof، وتحلل شجرة المراجع (Retention Path) لتظهر للمطور السطر الدقيق الذي تسبب في منع تفريغ الكائن.",
    codeExample: `// إضافة LeakCanary كـ debug dependency فقط في build.gradle:
// debugImplementation 'com.squareup.leakcanary:leakcanary-android:2.14'

// مثال لتسريب كلاسيكي:
object SingletonManager {
    // خطأ فادح: الاحتفاظ بـ Activity Context داخل كائن ثابت!
    var leakedActivity: Activity? = null
}`,
    commonMistakes: [
      "تسجيل مستمعين ومراقبين (Listeners/Callbacks) في كائنات Singleton دون إلغاء الاشتراك عند إغلاق الشاشة.",
      "تخزين مراجع الـ Views في كائنات CoroutineScope أو خيوط عمل طويلة.",
    ],
    followUpQuestions: [
      "ما الفرق بين Strong Reference و Weak Reference و Soft Reference في إدارة الذاكرة؟",
    ],
    sources: [
      {
        title: "Android Developers — Manage your app's memory",
        url: "https://developer.android.com/topic/performance/memory",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "aperf-003",
    slug: "app-startup-time-optimization",
    trackId: "android-native",
    topicIds: ["performance-memory"],
    difficulty: "Mid",
    question: "ما الفرق بين أنواع إقلاع التطبيق (Cold, Warm, Hot Start) وكيف تحسن وقت الإقلاع البارد؟",
    shortAnswer: "Cold Start يبدأ من الصفر بإنشاء العملية والـ Application؛ Warm يعيد إنشاء الـ Activity فقط؛ و Hot يعيد التطبيق فورًا للمقدمة من الذاكرة. يتم تحسين الإقلاع بتأخير تهيئة المكتبات غير الضرورية.",
    explanation: "يعتبر Cold Start الأطول والأكثر حساسية لانطباع المستخدم. لتحسينه، يجب تقليل الكود المنفذ داخل Application.onCreate()، واستخدام مكتبة App Startup لتجميع مزودي المحتوى (ContentProviders) في مهيئ واحد، وتجنب استخدام الانعكاس الديناميكي (Reflection) أو القراءة المتزامنة من القرص أثناء فتح التطبيق.",
    codeExample: `// استخدام Jetpack App Startup لتنظيم التهيئة:
class AnalyticsInitializer : Initializer<Analytics> {
    override fun create(context: Context): Analytics {
        return Analytics.init(context)
    }
    override fun dependencies(): List<Class<out Initializer<*>>> = emptyList()
}`,
    commonMistakes: [
      "تهيئة جميع مكتبات التحليلات والإعلانات والأدوات بالتتابع وبشكل متزامن داخل Application.onCreate().",
    ],
    followUpQuestions: [
      "كيف تساعد شاشة البداية الرسمية (SplashScreen API) في تحسين تجربة الإقلاع البارد بصريًا؟",
    ],
    sources: [
      {
        title: "Android Developers — App startup time",
        url: "https://developer.android.com/topic/performance/vitals/launch-time",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "aperf-004",
    slug: "bitmap-memory-management",
    trackId: "android-native",
    topicIds: ["performance-memory"],
    difficulty: "Mid",
    question: "كيف تدير ذاكرة الصور والـ Bitmaps في أندرويد لتجنب أخطاء OutOfMemoryError (OOM)؟",
    shortAnswer: "بتصغير أبعاد الصورة وقت فك التشفير باستخدام inSampleSize، وإعادة تدوير كائنات الـ Bitmap السابقة عبر inBitmap، والاعتماد على مكتبات متخصصة كـ Coil.",
    explanation: "تحجز الصورة في الذاكرة مساحة تعتمد على أبعادها بالبكسل وليس على حجم الملف على القرص (العرض × الارتفاع × 4 بايت لـ ARGB_8888). إذا عرضت صورة 4K داخل ImageView صغير بمقاس 100x100، فستستهلك عشرات الميجابايتات دون فائدة. يحدد BitmapFactory.Options.inSampleSize نسبة تصغير دقيقة تقرأ فقط البكسلات المطلوبة للشاشة.",
    codeExample: `val options = BitmapFactory.Options().apply {
    inJustDecodeBounds = true // قراءة الأبعاد فقط دون حجز ذاكرة
    BitmapFactory.decodeFile(imagePath, this)

    // حساب نسبة التصغير بناءً على حجم الشاشة المطلوب:
    inSampleSize = calculateInSampleSize(this, reqWidth = 200, reqHeight = 200)
    inJustDecodeBounds = false
}
val safeBitmap = BitmapFactory.decodeFile(imagePath, options)`,
    commonMistakes: [
      "تحميل الصور الأصلية ذات الدقة العالية مباشرة في الذاكرة دون حساب inSampleSize.",
      "كتابة كود معالجة وتخزين مؤقت للصور يدويًا بدلاً من استخدام مكتبة حديثة مثل Coil المبنية على Coroutines.",
    ],
    followUpQuestions: [
      "ما هي صيغة الألوان HARDWARE (Bitmap.Config.HARDWARE) وكيف توفر ذاكرة RAM في أندرويد 8.0+؟",
    ],
    sources: [
      {
        title: "Android Developers — Loading large bitmaps efficiently",
        url: "https://developer.android.com/topic/performance/graphics/load-bitmap",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "aperf-005",
    slug: "systrace-and-perfetto-profiling",
    trackId: "android-native",
    topicIds: ["performance-memory"],
    difficulty: "Senior",
    question: "كيف تكتشف تقطيع الإطارات (Jank) وأسباب هبوط معدل الـ 60/120 FPS باستخدام أداة Perfetto؟",
    shortAnswer: "بتسجيل تتبع زمني لأداء المعالج ومطابقة خط زمني لإطارات الشاشة (Choreographer frame budget) لمعرفة ما إذا كانت معالجة إطار استغرقت أكثر من 16.6ms أو 8.3ms.",
    explanation: "لتفادي الـ Jank، يجب ألا يتجاوز زمن معالجة كل إطار ميزانية العرض (16.6ms لشاشات 60Hz). تتيح Perfetto و Android Studio Profiler تتبع مسارات الأنوية وخطوات Choreographer#doFrame. باستخدام androidx.tracing يمكنك تمييز دوال محددة بأقسام مخصصة تظهر في التتبع للوقوف على الدوال التي تحجب المعالج.",
    codeExample: `import androidx.tracing.trace

inline fun <T> measureTrace(sectionName: String, block: () -> T): T {
    return trace(sectionName) {
        block()
    }
}`,
    commonMistakes: [
      "الاعتماد على التخمين لتحسين الأداء بدلاً من أخذ قراءات حقيقية وأدلة رقمية من الـ Profiler.",
    ],
    followUpQuestions: [
      "ما هي أداة Macrobenchmark وكيف تستخدمها لقياس زمن التمرير والإقلاع بصورة آلية؟",
    ],
    sources: [
      {
        title: "Android Developers — Overview of system tracing",
        url: "https://developer.android.com/topic/performance/tracing",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "aperf-006",
    slug: "baseline-profiles-and-dex-optimization",
    trackId: "android-native",
    topicIds: ["performance-memory"],
    difficulty: "Senior",
    question: "ما هي الـ Baseline Profiles وكيف تسرع إقلاع التطبيق وسلاسة التمرير بنسبة تصل إلى 30%؟",
    shortAnswer: "هي مواصفات مدمجة داخل حزمة APK تحدد مسارات الكود الحرجة ليقوم نظام تشغيل أندرويد (ART) بترجمتها مسبقًا إلى كود آلة أصلي (AOT Compilation) أثناء التثبيت.",
    explanation: "يعتمد وقت تشغيل أندرويد (Android Runtime - ART) على الترجمة أثناء التنفيذ (JIT) والملاحظة الميدانية لترجمة الكود الشائع. بدون Baseline Profiles، يمر الكود بمرحلة تفسير بطيئة في أول فتح للتطبيق. تضمين Baseline Profiles المجمعة عبر Macrobenchmark يجعل الكود الحرج مترجمًا بالكامل قبل أول تشغيل، مما يلغي بطء التفسير الأولي تمامًا.",
    codeExample: `// كتابة مولد Baseline Profile باستخدام Macrobenchmark:
@OptIn(ExperimentalBaselineProfilesApi::class)
class BaselineProfileGenerator {
    @get:Rule val baselineProfileRule = BaselineProfileRule()

    @Test
    fun generateBaselineProfile() = baselineProfileRule.collect(
        packageName = "com.example.app"
    ) {
        pressHome()
        startActivityAndWait() // تسجيل مسار الإقلاع الحرج
    }
}`,
    commonMistakes: [
      "تضمين التطبيق بأكمله داخل Baseline Profile مما يزيد من حجم الحزمة المثبتة دون فائدة للأماكن النادرة الاستخدام.",
    ],
    followUpQuestions: [
      "كيف تقوم خوادم Google Play Cloud بالتنسيق مع Baseline Profiles لتحسين حزم المستخدمين الجدد؟",
    ],
    sources: [
      {
        title: "Android Developers — Baseline Profiles overview",
        url: "https://developer.android.com/topic/performance/baselineprofiles/overview",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },

  // security-android (4 questions)
  {
    id: "asec-001",
    slug: "android-keystore-system",
    trackId: "android-native",
    topicIds: ["security-android"],
    difficulty: "Junior",
    question: "ما هو نظام Android Keystore وما الميزة الأمنية التي يقدمها مقارنة بالتخزين العادي للمفاتيح؟",
    shortAnswer: "هو مستودع آمن يسمح بإنشاء وحفظ المفاتيح التشفيرية داخل بيئة أجهزة مخصصة ومعزولة (TEE أو StrongBox) بحيث لا يمكن للتطبيق أو المهاجم استخراج المادة الخام للمفتاح.",
    explanation: "في التخزين العادي، يتم قراءة المفتاح إلى ذاكرة RAM حيث يمكن سرقته إذا تم عمل Root للجهاز. في Android Keystore، تنفذ عمليات التشفير وفك التشفير والتوقيع الرقمي داخل الشريحة الأمنية المعزولة نفسها دون أن تغادر مفاتيح التشفير العتاد الصلب إطلاقًا، مع إمكانية ربط استخدام المفتاح بمصادقة بصمة المستخدم.",
    codeExample: `val keyStore = KeyStore.getInstance("AndroidKeyStore").apply { load(null) }
val keyGenerator = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, "AndroidKeyStore")

val keyGenParameterSpec = KeyGenParameterSpec.Builder(
    "MySecretKeyAlias",
    KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT
)
    .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
    .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
    .setUserAuthenticationRequired(true) // يتطلب مصادقة حيوية
    .build()

keyGenerator.init(keyGenParameterSpec)
keyGenerator.generateKey()`,
    commonMistakes: [
      "كتابة مفاتيح التشفير بشكل صريح (Hardcoded Strings) داخل الكود المصدري للتطبيق، مما يسهل كشفها فورًا بفك الحزمة (Decompilation).",
    ],
    followUpQuestions: [
      "ما الفرق بين Trusted Execution Environment (TEE) وشريحة StrongBox المخصصة؟",
    ],
    sources: [
      {
        title: "Android Developers — Android Keystore system",
        url: "https://developer.android.com/privacy-and-security/keystore",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "asec-002",
    slug: "r8-and-proguard-obfuscation",
    trackId: "android-native",
    topicIds: ["security-android"],
    difficulty: "Mid",
    question: "ما دور أداة R8 في حماية التطبيق وتقليص حجمه وما الفرق بين Shrinking و Obfuscation؟",
    shortAnswer: "Shrinking يحذف الكود والموارد غير المستخدمة؛ بينما Obfuscation يشوش أسماء الكلاسات والدوال بأسماء قصيرة مبهمة (مثل a.b.c) لتصعيب الهندسة العكسية.",
    explanation: "يحل R8 محل ProGuard كأداة الترجمة والتحسين المباشرة في Android Gradle Plugin. يقوم R8 بأربع مهام: تقليص الكود (Code Shrinking)، تقليص الموارد (Resource Shrinking)، التحسين الموضعي للـ bytecode (Optimization)، والتشويش (Obfuscation). يتطلب R8 قواعد -keep خاصة للكلاسات التي يتم الوصول إليها عبر Reflection كـ Data Classes المستخدمة في JSON.",
    codeExample: `// في ملف proguard-rules.pro:
# الحفاظ على أسماء الحقول للكلاسات المستخدمة مع مكتبات التسلسل:
-keepclassmembers class * {
    @com.google.gson.annotations.SerializedName <fields>;
}

# الحفاظ على كلاسات محددة بالكامل:
-keep class com.example.models.** { *; }`,
    commonMistakes: [
      "نسيان إضافة قواعد -keep لكلاسات نماذج الـ API مما يؤدي لتشويش أسمائها وانهيار فك تشفير الـ JSON بعد تفعيل R8 في نسخة Release.",
      "تجاهل الاحتفاظ بملف mapping.txt لكل إصدار يتم رفعه، مما يجعل من المستحيل فك تشفير تقارير الكراش المبهمة (De-obfuscate Crash Stacks).",
    ],
    followUpQuestions: [
      "كيف يؤثر الـ Optimization في R8 على دمج الكلاسات الفردية وتوسيع الدوال الساكنة؟",
    ],
    sources: [
      {
        title: "Android Developers — Shrink, obfuscate, and optimize your app",
        url: "https://developer.android.com/build/shrink-code",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "asec-003",
    slug: "biometric-authentication-api",
    trackId: "android-native",
    topicIds: ["security-android"],
    difficulty: "Mid",
    question: "كيف تطبق المصادقة الحيوية باستخدام مكتبة BiometricPrompt الموحدة؟",
    shortAnswer: "باستخدام BiometricManager للتحقق من دعم الجهاز وجاهزيته، ثم إطلاق BiometricPrompt مع تحديد مستوى الأمان (Strong أو Weak).",
    explanation: "توفر BiometricPrompt واجهة نظام موحدة وآمنة للمصادقة عبر بصمة الإصبع أو بصمة الوجه. تضمن المكتبة التعامل مع أنواع التشفير المتقدمة عبر BiometricPrompt.CryptoObject لربط مفاتيح Android Keystore بالمصادقة الناجحة، بحيث لا يتم فك تشفير البيانات الحساسة إلا بعد تأكيد هوية المستخدم بيولوجيًا.",
    codeExample: `val biometricPrompt = BiometricPrompt(
    activity,
    executor,
    object : BiometricPrompt.AuthenticationCallback() {
        override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
            super.onAuthenticationSucceeded(result)
            // نجحت المصادقة الحيوية
        }
    }
)

val promptInfo = BiometricPrompt.PromptInfo.Builder()
    .setTitle("تسجيل الدخول بالبصمة")
    .setNegativeButtonText("إلغاء")
    .setAllowedAuthenticators(BiometricManager.Authenticators.BIOMETRIC_STRONG)
    .build()

biometricPrompt.authenticate(promptInfo)`,
    commonMistakes: [
      "افتراض نجاح المصادقة تلقائيًا دون فحص canAuthenticate() لاحتمال عدم تعيين المستخدم لبصمة في إعدادات الهاتف.",
    ],
    followUpQuestions: [
      "ما الفرق بين BIOMETRIC_STRONG و BIOMETRIC_WEAK و DEVICE_CREDENTIAL؟",
    ],
    sources: [
      {
        title: "Android Developers — Show a biometric authentication dialog",
        url: "https://developer.android.com/training/sign-in/biometric-auth",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "asec-004",
    slug: "root-detection-and-play-integrity",
    trackId: "android-native",
    topicIds: ["security-android"],
    difficulty: "Senior",
    question: "كيف تحمي التطبيقات الحساسة (كالتطبيقات المصرفية) من التلاعب وبيئات الـ Root باستخدام Play Integrity API؟",
    shortAnswer: "تطلب توكن أمان مشفر من Play Integrity API وترسله لخادمك الخلفي لفك تشفيره والتحقق من سلامة نظام التشغيل وحزمة التطبيق وحساب المستخدم.",
    explanation: "تعتمد الحماية القديمة على فحص وجود ملفات su أو كشف حزم الـ Magisk محليًا، وهي طرق سهلة الالتفاف عليها باستخدام أدوات الإخفاء. يوفر Play Integrity API فحصًا سحابيًا مشفرًا موثقًا من جوجل يضمن سلامة الجهاز (MEETS_DEVICE_INTEGRITY)، وسلامة الثنائيات الأصلية غير المعدلة (MEETS_APP_INTEGRITY)، مع التحقق من عدم تشغيل التطبيق داخل محاكي زائف.",
    codeExample: `// في التطبيق: طلب الـ Integrity Token وتمريره للسيرفر:
val integrityManager = PlayIntegrityFactory.create(context)
val response = integrityManager.requestIntegrityToken(
    IntegrityTokenRequest.builder()
        .setCloudProjectNumber(GOOGLE_CLOUD_PROJECT_NUMBER)
        .build()
).await()

val integrityToken = response.token()
apiService.validateTokenOnBackend(integrityToken) // التحقق الصارم في الباك إند فقط`,
    commonMistakes: [
      "التحقق من صحة توكن الأمان داخل التطبيق محليًا بدلاً من إرساله للخادم، مما يمكن المهاجم من التلاعب بنتيجة الفحص بسهولة.",
    ],
    followUpQuestions: [
      "لماذا يجب تضمين Nonce فريد وعشوائي في كل طلب لـ Play Integrity لمنع هجمات إعادة الإرسال (Replay Attacks)؟",
    ],
    sources: [
      {
        title: "Android Developers — Play Integrity API overview",
        url: "https://developer.android.com/google/play/integrity/overview",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },

  // testing-android (5 questions)
  {
    id: "atest-001",
    slug: "testing-pyramid-in-android",
    trackId: "android-native",
    topicIds: ["testing-android"],
    difficulty: "Junior",
    question: "ما هو هرم الاختبارات (Testing Pyramid) في أندرويد وما النسبة المقترحة لكل نوع؟",
    shortAnswer: "يقسم الاختبارات إلى: Unit Tests سريعة ورخيصة في القاعدة (70%)، Integration Tests في الوسط (20%)، و End-to-End UI Tests شاملة وبطيئة في القمة (10%).",
    explanation: "تركز اختبارات الوحدة (Unit Tests) على فحص منطق الـ ViewModel والـ Use Cases والـ Repositories وتعمل بسرعة فائقة على الـ JVM المحلي. تركز اختبارات التكامل (Integration Tests) على فحص تفاعل المكونات معًا كقواعد بيانات Room. أما اختبارات الـ UI (End-to-End) فتتحقق من تجربة المستخدم الحقيقية على محاكي أو جهاز حقيقي وتعتبر الأبطأ والأكثر حساسية للأعطال (Flaky).",
    codeExample: `// Unit Test سريع يعمل على JVM دون الحاجة لجهاز أو محاكي:
@Test
fun calculateDiscount_returnsCorrectValue() {
    val calculator = PriceCalculator()
    val total = calculator.applyDiscount(100.0, 0.1)
    assertEquals(90.0, total, 0.001)
}`,
    commonMistakes: [
      "الاعتماد الكامل على اختبارات الـ UI المعقدة وإهمال اختبارات الوحدة السريعة، مما يجعل عملية الـ CI/CD شديدة البطء وغير مستقرة.",
    ],
    followUpQuestions: [
      "كيف يؤثر وضع الاختبار في المجلد test مقابل androidTest على بيئة التشغيل والسرعة؟",
    ],
    sources: [
      {
        title: "Android Developers — Fundamentals of testing Android apps",
        url: "https://developer.android.com/training/testing/fundamentals",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "atest-002",
    slug: "mockk-and-unit-testing-viewmodels",
    trackId: "android-native",
    topicIds: ["testing-android"],
    difficulty: "Mid",
    question: "كيف تختبر منطق الـ ViewModel باستخدام مكتبة MockK ومجسمات المحاكاة (Mocks)؟",
    shortAnswer: "بمحاكاة التبعيات عبر mockk() وتحديد سلوكها المتوقع بواسطة every أو coEvery، ثم التحقق من استدعاء الدوال عبر verify أو coVerify.",
    explanation: "تعتبر MockK مكتبة مصممة أصلاً للغة Kotlin وتدعم Suspend Functions و Coroutines بسلاسة فائقة عبر coEvery و coVerify، بعكس Mockito التي تتطلب إعدادات إضافية. تتيح اختبار الـ ViewModel بمعزل عن الشبكة وقاعدة البيانات عن طريق استبدال الـ Repository بنسخة مقلدة وتأكيد أن الـ UiState تعكس النتيجة بشكل صحيح.",
    codeExample: `class UserViewModelTest {
    private val repository = mockk<UserRepository>()
    private lateinit var viewModel: UserViewModel

    @Test
    fun loadUser_updatesStateToSuccess() = runTest {
        coEvery { repository.getUser("1") } returns User(1, "Sara")

        viewModel = UserViewModel(repository)
        viewModel.loadUser("1")

        assertEquals(User(1, "Sara"), viewModel.uiState.value.user)
        coVerify(exactly = 1) { repository.getUser("1") }
    }
}`,
    commonMistakes: [
      "الإفراط في استخدام Mocks لكل شيء؛ إذ يفضل دائمًا استخدام Fake Repositories حقيقية بسيطة في الذاكرة كلما كان ذلك متاحًا لتقليل هشاشة الاختبارات.",
    ],
    followUpQuestions: [
      "ما الفرق بين Mock و Fake و Stub في اختبارات البرمجيات؟",
    ],
    sources: [
      {
        title: "Android Developers — Test ViewModels",
        url: "https://developer.android.com/topic/architecture/ui-layer/testing#viewmodels",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "atest-003",
    slug: "testing-coroutines-standardtestdispatcher",
    trackId: "android-native",
    topicIds: ["testing-android"],
    difficulty: "Mid",
    question: "كيف تختبر كود يعتمد على الكوروتينات باستخدام runTest وموزعات الاختبار (TestDispatchers)؟",
    shortAnswer: "باستخدام runTest التي تقفز تلقائيًا عبر تأخيرات الوقت (delay skipping)، واستبدال Dispatchers.Main بموزع اختبار عبر Dispatchers.setMain.",
    explanation: "بدون runTest، فإن استدعاء دالة تحتوي على delay(10_000L) سيجعل الاختبار ينتظر 10 ثوانٍ حقيقية. تقوم بيئة runTest بالتحكم في Virtual Time والقفز التلقائي للوقت الافتراضي. يوفر StandardTestDispatcher جدولة يدوية للمهام عبر advanceUntilIdle() أو advanceTimeBy()، بينما ينفذ UnconfinedTestDispatcher المهام الجديدة بشغف فوري دون انتظار.",
    codeExample: `@OptIn(ExperimentalCoroutinesApi::class)
class CoroutineTest {
    private val testDispatcher = StandardTestDispatcher()

    @Before
    fun setUp() { Dispatchers.setMain(testDispatcher) }

    @After
    fun tearDown() { Dispatchers.resetMain() }

    @Test
    fun delayedOperation_completesImmediately() = runTest(testDispatcher) {
        val deferred = async { delay(5000L); "Done" }
        advanceUntilIdle() // يقفز عبر 5 ثوانٍ افتراضية في جزء من الميلي ثانية!
        assertEquals("Done", deferred.getCompleted())
    }
}`,
    commonMistakes: [
      "نسيان استدعاء Dispatchers.setMain في بداية الاختبارات التي تستخدم viewModelScope، مما يسبب كراش IllegalStateException لفقدان Looper الخيط الرئيسي.",
    ],
    followUpQuestions: [
      "ما الفرق العملي في السلوك بين StandardTestDispatcher و UnconfinedTestDispatcher في اختبارات Flow؟",
    ],
    sources: [
      {
        title: "Kotlin Docs — Testing Coroutines",
        url: "https://kotlinlang.org/docs/test-coroutine.html",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "atest-004",
    slug: "robolectric-vs-instrumentation-tests",
    trackId: "android-native",
    topicIds: ["testing-android"],
    difficulty: "Mid",
    question: "ما الفرق بين اختبارات Robolectric واختبارات الأجهزة الحقيقية (Instrumentation Tests)؟",
    shortAnswer: "تنفذ Robolectric اختبارات معتمدة على Android SDK مباشرة على جهاز الحاسوب (JVM) بمحاكاة كائنات أندرويد وظلالها (Shadows) بسرعة فائقة ودون الحاجة لتشغيل محاكي أو جهاز حقيقي.",
    explanation: "تتطلب اختبارات الـ Instrumentation تثبيت APK على محاكي، مما يجعلها بطيئة في التنفيذ على خوادم CI. يوفر إطار عمل Robolectric طبقة محاكاة كاملة لبيئة أندرويد (تضخيم الواجهات، قواعد البيانات، الصلاحيات) ويعمل داخل بيئة JVM العادية، محققًا سرعة فائقة مع قدرة عالية على فحص سلوك مكونات أندرويد.",
    codeExample: `@RunWith(RobolectricTestRunner::class)
class MainActivityTest {
    @Test
    fun clickingButton_updatesTextView() {
        val activity = Robolectric.buildActivity(MainActivity::class.java).setup().get()
        val button = activity.findViewById<Button>(R.id.button)
        val textView = activity.findViewById<TextView>(R.id.text)

        button.performClick()
        assertEquals("تم النقر", textView.text.toString())
    }
}`,
    commonMistakes: [
      "الاعتماد الحصري على Robolectric وافتراض تطابق محاكاته بنسبة 100% مع أجهزة الهواتف الحقيقية، وخصوصًا في تفاصيل عتاد الكاميرا ورسوم OpenGL.",
    ],
    followUpQuestions: [
      "ما هي كائنات الظلال (Shadow Objects) في Robolectric وكيف تستخدمها لتعديل استجابات النظام؟",
    ],
    sources: [
      {
        title: "Android Developers — Test in Android / Tools",
        url: "https://developer.android.com/training/testing/fundamentals/tools",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "atest-005",
    slug: "compose-ui-tests-and-semantics",
    trackId: "android-native",
    topicIds: ["testing-android"],
    difficulty: "Senior",
    question: "كيف تعمل اختبارات واجهة المستخدم في Jetpack Compose بالاعتماد على شجرة الـ Semantics؟",
    shortAnswer: "تستخدم ComposeTestRule للبحث في شجرة المعاني (Semantics Tree) ومطابقة العناصر بنصوصها أو دورها والتحقق من التفاعل معها بشكل مستقل عن تفاصيل الرسم الداخلي.",
    explanation: "لا يمتلك Compose عناصر Views تقليدية يمكن البحث عنها بـ findViewById. بدلاً من ذلك، يولد شجرة Semantics موازية تصف الغرض الوظيفي لكل مكون (لخدمة إمكانية الوصول والاختبارات). تتيح أدوات مثل onNodeWithText و onNodeWithTag التفاعل مع المكونات (performClick) ومزامنة أوقات الرسوم المتحركة آليًا مع خيط الاختبار.",
    codeExample: `class CounterTest {
    @get:Rule
    val composeTestRule = createComposeRule()

    @Test
    fun incrementCounter_updatesCountText() {
        composeTestRule.setContent {
            CounterScreen()
        }

        composeTestRule.onNodeWithText("العدد: 0").assertIsDisplayed()
        composeTestRule.onNodeWithText("زيادة").performClick()
        composeTestRule.onNodeWithText("العدد: 1").assertIsDisplayed()
    }
}`,
    commonMistakes: [
      "الإفراط في وضع modifier.testTag واستخدامها كطريقة وحيدة للبحث، بدلاً من البحث بالنصوص وإمكانية الوصول لضمان جودة تطبيقك لذوي الاحتياجات الخاصة.",
    ],
    followUpQuestions: [
      "كيف تضبط composeTestRule.mainClock للتحكم في الرسوم المتحركة خطوة بخطوة أثناء الاختبار؟",
    ],
    sources: [
      {
        title: "Android Developers — Testing your Compose layout",
        url: "https://developer.android.com/develop/ui/compose/testing",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },

  // build-gradle (4 questions)
  {
    id: "abld-001",
    slug: "gradle-build-lifecycle-phases",
    trackId: "android-native",
    topicIds: ["build-gradle"],
    difficulty: "Junior",
    question: "ما هي المراحل الثلاث الأساسية لدورة حياة بناء المشروع في Gradle؟",
    shortAnswer: "مرحلة التهيئة (Initialization)، ثم مرحلة الإعداد (Configuration)، ثم مرحلة التنفيذ الفعلي (Execution).",
    explanation: "في مرحلة Initialization يحدد Gradle المشاريع الفرعية المضمنة في settings.gradle ويُنشئ كائنات Project. في مرحلة Configuration يقرأ ملفات build.gradle لكل وحدة ويبني شجرة المهام (Task Execution Graph) ويقيم الكود خارج كتل doFirst و doLast. في مرحلة Execution ينفذ فقط المهام المطلوبة ومهامها التابعة وفق الترتيب المخطط.",
    codeExample: `// مثال يوضح الفرق بين الإعداد والتنفيذ:
tasks.register("myTask") {
    // ينفذ دائمًا في مرحلة Configuration عند أي عملية مزامنة (Sync)!
    println("Configuration phase: تهيئة المهمة")

    doLast {
        // ينفذ فقط في مرحلة Execution عند طلب المهمة صراحة:
        println("Execution phase: جاري تنفيذ المهمة الآن")
    }
}`,
    commonMistakes: [
      "كتابة كود معالجة ملفات مكلف أو استدعاءات شبكة داخل جسم المهمة مباشرة دون وضعه داخل doLast، مما يبطئ عملية مزامنة المشروع (Gradle Sync).",
    ],
    followUpQuestions: [
      "ما هو التخزين المؤقت للإعداد (Configuration Cache) في Gradle وكيف يسرع البناء المتكرر؟",
    ],
    sources: [
      {
        title: "Android Developers — Configure your build",
        url: "https://developer.android.com/build",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "abld-002",
    slug: "build-variants-flavors-and-types",
    trackId: "android-native",
    topicIds: ["build-gradle"],
    difficulty: "Mid",
    question: "كيف يتم إنشاء الـ Build Variants بدمج Product Flavors و Build Types في Gradle؟",
    shortAnswer: "الـ Build Variant هو حاصل الضرب التبادلي بين كل Product Flavor (ميزات التطبيق) وكل Build Type (إعدادات البناء كـ debug و release).",
    explanation: "تحدد الـ Build Types (مثل debug و release) خيارات التوقيع والتشويش عبر R8 والـ debuggable. بينما تحدد الـ Product Flavors (مثل demo و full، أو dev و staging و prod) تخصيصات المنتج كـ applicationId ومصادر الموارد وعناوين الـ API الأساسية. دمج flavor (free) مع type (release) ينتج الـ Variant النهائي: freeRelease.",
    codeExample: `android {
    buildTypes {
        debug { applicationIdSuffix ".debug"; isMinifyEnabled false }
        release { isMinifyEnabled true; proguardFiles(...) }
    }
    flavorDimensions += "tier"
    productFlavors {
        create("free") { dimension = "tier"; applicationIdSuffix = ".free" }
        create("paid") { dimension = "tier" }
    }
}
// ينتج: freeDebug, freeRelease, paidDebug, paidRelease`,
    commonMistakes: [
      "نسيان تحديد flavorDimensions عند تعريف أكثر من Product Flavor مما يسبب فشل البناء.",
      "تكرار ملفات الموارد كاملة داخل كل flavor بدلاً من مشاركة الملفات المشتركة في مجلد src/main.",
    ],
    followUpQuestions: [
      "كيف تختلف أولوية دمج الموارد (Resource Merging Priority) بين مجلدات Flavor و Main و BuildType؟",
    ],
    sources: [
      {
        title: "Android Developers — Configure build variants",
        url: "https://developer.android.com/build/build-variants",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "abld-003",
    slug: "version-catalogs-toml",
    trackId: "android-native",
    topicIds: ["build-gradle"],
    difficulty: "Mid",
    question: "ما هي ميزة استخدام Gradle Version Catalogs (ملف libs.versions.toml) لإدارة التبعيات؟",
    shortAnswer: "توفر مكانًا مركزيًا وموحدًا لإدارة إصدارات المكتبات والـ Plugins عبر جميع وحدات المشروع، مع دعم الإكمال التلقائي والتحقق الصارم من الأنواع في ملفات kts.",
    explanation: "في المشاريع الكبيرة متعددة الوحدات، كان تكرار أسماء المكتبات يسبب تضاربًا في الإصدارات وصعوبة في الترقية. يقسم ملف libs.versions.toml التبعيات إلى أربعة أقسام: [versions] للإصدارات، [libraries] للمكتبات، [bundles] لتجميع مكتبات ذات صلة في متغير واحد، و [plugins] لإضافات Gradle، مما يمنع الأخطاء المطبعية تمامًا.",
    codeExample: `// 1. ملف gradle/libs.versions.toml:
[versions]
retrofit = "2.11.0"

[libraries]
retrofit-core = { group = "com.squareup.retrofit2", name = "retrofit", version.ref = "retrofit" }

// 2. الاستخدام في build.gradle.kts:
dependencies {
    implementation(libs.retrofit.core)
}`,
    commonMistakes: [
      "تثبيت إصدارات مختلفة لنفس المكتبة يدويًا داخل بعض الوحدات الفرعية متجاوزًا الـ Version Catalog.",
    ],
    followUpQuestions: [
      "ما هي فائدة [bundles] في Version Catalogs لربط مكتبات شائعة مثل Compose BOM؟",
    ],
    sources: [
      {
        title: "Android Developers — Migrate your build to version catalogs",
        url: "https://developer.android.com/build/migrate-to-catalogs",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "abld-004",
    slug: "modularization-strategies-feature-vs-layer",
    trackId: "android-native",
    topicIds: ["build-gradle"],
    difficulty: "Senior",
    question: "ما هي أفضل ممارسات تقسيم تطبيق أندرويد إلى وحدات متعددة (Multi-module Architecture) وما أثرها على سرعة البناء؟",
    shortAnswer: "التقسيم حسب الميزة (Modularization by Feature) مع استخراج وحدات النواة المشتركة (Core/Domain/UI)، مما يتيح توازي عمليات البناء وتفعيل الـ Build Cache.",
    explanation: "في التطبيق المكون من وحدة واحدة (Monolith)، فإن أي تعديل بسيط يجبر Gradle على إعادة ترجمة الكود بالكامل. في المعمارية المجزأة، إذا عدلت كود داخل :feature:auth، فإن Gradle يعيد بناء هذه الوحدة فقط ويعيد استخدام مخرجات باقي الوحدات من الـ Cache، مع تقليص وقت البناء التزايدي (Incremental Build) بنسبة هائلة وفرض حدود معمارية صارمة تمنع تشابك التبعيات.",
    codeExample: `// نموذج هيكلي موصى به:
// :app (تجميع الـ Features وحقن التبعيات)
// :feature:login (يعتمد على :core:model و :core:ui)
// :feature:checkout
// :core:network
// :core:database
// :core:model (نقي تمامًا بدون تبعيات أندرويد)`,
    commonMistakes: [
      "التقسيم فقط حسب الطبقات (Module for UI, Module for Data) مما يخلق وحدات ضخمة تعتمد على بعضها دائريًا وتفقد ميزة عزل الميزات واستقلالية الفرق.",
      "إنشاء تبعيات دائرية (Circular Dependencies) بين الوحدات وهو ما يمنعه Gradle بشكل صارم.",
    ],
    followUpQuestions: [
      "كيف تمنع تسريب التبعيات الداخلية بين الوحدات باستخدام api مقابل implementation في Gradle؟",
    ],
    sources: [
      {
        title: "Android Developers — Guide to Android app modularization",
        url: "https://developer.android.com/topic/modularization",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
];
