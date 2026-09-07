import type { InterviewQuestion } from "../questions.ts";

export const fundamentalsQuestions: Omit<InterviewQuestion, "translations">[] = [
  {
    id: "afund-001",
    slug: "activity-lifecycle-states-and-callbacks",
    trackId: "android-native",
    topicIds: ["android-fundamentals"],
    difficulty: "Junior",
    question: "ما هي المراحل الأساسية لدورة حياة الـ Activity في أندرويد وكيف تنتقل بينها؟",
    shortAnswer: "تمر بست مراحل رئيسية: onCreate و onStart و onResume و onPause و onStop و onDestroy، وتكون مرئية وتفاعلية في onResume.",
    explanation: "يتم إنشاء الـ View وربط البيانات في onCreate. تنتقل الـ Activity إلى onStart عندما تصبح مرئية للمستخدم ولكن دون تفاعل كامل. عند وصولها إلى onResume تكون في قمة الـ Backstack وجاهزة للتفاعل. عند ظهور Dialog كامل أو إشعار أو فتح Activity أخرى تنتقل إلى onPause، ثم onStop عند حجبها كليًا، وأخيرًا onDestroy لتحرير الموارد أو عند استدعاء finish().",
    codeExample: `class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
    }

    override fun onResume() {
        super.onResume()
        // استئناف تحديثات الموقع أو الكاميرا
    }

    override fun onPause() {
        super.onPause()
        // إيقاف العمليات الحساسة لتوفير البطارية
    }
}`,
    commonMistakes: [
      "تنفيذ عمليات طويلة أو حجب الـ Main Thread داخل onPause مما يسبب ANR وبطء الانتقال للشاشة التالية.",
      "الاعتماد على onDestroy لحفظ بيانات المستخدم الحساسة، لأن النظام قد ينهي العملية مباشرة دون استدعائها عند نقص الذاكرة.",
    ],
    followUpQuestions: [
      "ما هي الحالات التي تستدعى فيها onPause دون أن تتبعها onStop؟",
      "متى يجب استخدام onRestart في دورة حياة الـ Activity؟",
    ],
    sources: [
      {
        title: "Android Developers — The Activity Lifecycle",
        url: "https://developer.android.com/guide/components/activities/activity-lifecycle",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "afund-002",
    slug: "fragment-lifecycle-vs-activity-lifecycle",
    trackId: "android-native",
    topicIds: ["android-fundamentals"],
    difficulty: "Junior",
    question: "ما الفرق بين دورة حياة الـ Fragment ودورة حياة الـ Activity ولماذا نستخدم viewLifecycleOwner؟",
    shortAnswer: "يمتلك الـ Fragment دورتي حياة: واحدة للـ Fragment نفسه وأخرى لواجهته (View)، ويجب استخدام viewLifecycleOwner لمراقبة البيانات لتفادي تسريب الذاكرة.",
    explanation: "عند إضافة الـ Fragment إلى الـ Backstack واستبداله، يتم تدمير واجهته فقط (onDestroyView) بينما يبقى كائن الـ Fragment حيًا في الذاكرة. إذا تم تسجيل مراقب (Observer) باستخدام this، فسيستمر في استقبال البيانات والاحتفاظ بواجهات قديمة مهملة، لذلك يجب دائمًا استخدام viewLifecycleOwner الذي ينتهي بمجرد تدمير الـ View.",
    codeExample: `class UserFragment : Fragment(R.layout.fragment_user) {
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // الصحيح: استخدام viewLifecycleOwner
        viewModel.userFlow.collectWithLifecycle(viewLifecycleOwner) { user ->
            bindUser(user)
        }
    }
}`,
    commonMistakes: [
      "تمرير this كـ LifecycleOwner لمراقبة LiveData أو Flow داخل الـ Fragment بدلاً من viewLifecycleOwner.",
      "الاحتفاظ بمرجع قوي لـ ViewBinding دون تفريغه في onDestroyView، مما يسبب Memory Leak.",
    ],
    followUpQuestions: [
      "ماذا يحدث لواجهة الـ Fragment عند نقله إلى الـ Backstack عبر addToBackStack؟",
    ],
    sources: [
      {
        title: "Android Developers — Fragment lifecycle",
        url: "https://developer.android.com/guide/fragments/lifecycle",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "afund-003",
    slug: "context-application-vs-activity",
    trackId: "android-native",
    topicIds: ["android-fundamentals"],
    difficulty: "Junior",
    question: "ما الفرق بين Application Context و Activity Context ومتى تستخدم كلاً منهما؟",
    shortAnswer: "Activity Context مرتبط بدورة حياة الشاشة والثيمات وواجهات المستخدم، بينما Application Context يعيش طوال فترة تشغيل التطبيق وتستخدمه للعمليات العامة والـ Singletons.",
    explanation: "يحتوي Activity Context على معلومات الثيم (Theme) والـ Window Manager، لذلك يجب استخدامه لعرض Dialogs وبدء شاشات جديدة وتضخيم الواجهات (Inflating Views). أما Application Context فيُستخدم للعمليات المستمرة مثل تهيئة قواعد البيانات والمكتبات المركزية؛ وتمرير Activity Context لكائن يعيش طويلاً (كـ Singleton) يؤدي لتسريب الـ Activity بالكامل في الذاكرة.",
    codeExample: `// صحيح للـ Singletons ومستودعات البيانات:
class Repository(private val appContext: Context) // تمرير applicationContext

// مطلوب لإنشاء الـ Dialogs وعرض الـ UI:
val builder = AlertDialog.Builder(activity) // استخدام Activity Context`,
    commonMistakes: [
      "تمرير Activity Context إلى كلاس Singleton أو كائن ثابت (Static) مما يمنع الـ Garbage Collector من تحرير الـ Activity.",
      "استخدام Application Context لإنشاء Dialog أو Toast بدون ثيم مناسب مما يسبب كراش أو أخطاء مظهرية.",
    ],
    followUpQuestions: [
      "هل يمكن استخدام Application Context لتضخيم ملفات الـ Layout بأمان؟",
    ],
    sources: [
      {
        title: "Android Developers — Context",
        url: "https://developer.android.com/reference/android/content/Context",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "afund-004",
    slug: "explicit-vs-implicit-intents",
    trackId: "android-native",
    topicIds: ["android-fundamentals"],
    difficulty: "Junior",
    question: "ما الفرق بين الـ Explicit Intent والـ Implicit Intent في أندرويد؟",
    shortAnswer: "الـ Explicit يحدد المكون المستهدف بالاسم الصريح داخل التطبيق، بينما الـ Implicit يعلن عن الإجراء المطلوب (Action) ليقوم النظام باختيار التطبيق المناسب.",
    explanation: "يُستخدم Explicit Intent للتنقل الداخلي بين أنشطة التطبيق (Activities) وخدماته بكتابة الكلاس المستهدف مباشرة. أما Implicit Intent فيصف عملية عامة مثل فتح رابط ويب (ACTION_VIEW) أو التقاط صورة أو إرسال بريد؛ يقوم نظام أندرويد بمطابقة هذا الطلب مع الـ Intent Filters المسجلة في الـ Manifest لجميع التطبيقات وتخيير المستخدم.",
    codeExample: `// Explicit Intent
val internalIntent = Intent(context, ProfileActivity::class.java)
startActivity(internalIntent)

// Implicit Intent
val webIntent = Intent(Intent.ACTION_VIEW, Uri.parse("https://developer.android.com"))
if (webIntent.resolveActivity(packageManager) != null) {
    startActivity(webIntent)
}`,
    commonMistakes: [
      "استدعاء startActivity مع Implicit Intent دون التحقق من وجود تطبيق قادر على التعامل معه، مما يؤدي إلى ActivityNotFoundException.",
    ],
    followUpQuestions: [
      "كيف تحمي المكونات الداخلية في الـ Manifest من الاستدعاء الخارجي غير المصرح به عبر android:exported؟",
    ],
    sources: [
      {
        title: "Android Developers — Intents and Intent Filters",
        url: "https://developer.android.com/guide/components/intents-filters",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "afund-005",
    slug: "activity-launch-modes",
    trackId: "android-native",
    topicIds: ["android-fundamentals"],
    difficulty: "Mid",
    question: "ما هي أنماط الإطلاق (Launch Modes) للـ Activity وما تأثيرها على الـ Backstack؟",
    shortAnswer: "تحدد كيفية فتح الـ Activity في المهام: standard (نسخة جديدة دائمًا)، singleTop (إعادة استخدام القمة)، singleTask (نسخة واحدة في المهمة)، و singleInstance (مهمة معزولة).",
    explanation: "standard ينشئ نسخة جديدة في كل استدعاء. singleTop يعيد استخدام النشاط إذا كان بالفعل في قمة الـ stack ويستدعي onNewIntent(). singleTask ينشئ مهمة جديدة أو يوجه المستخدم إلى النشاط إذا كان موجودًا في المهمة مع حذف كل الأنشطة التي تعلوه (Clear Top). singleInstance يعزل النشاط في مهمة مستقلة تمامًا ولا يسمح بفتح أنشطة أخرى داخل نفس المهمة.",
    codeExample: `<!-- تعريف launchMode في AndroidManifest.xml -->
<activity
    android:name=".SearchActivity"
    android:launchMode="singleTop" />

// استقبال البيانات عند إعادة الاستخدام:
override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    setIntent(intent)
    handleSearchQuery(intent)
}`,
    commonMistakes: [
      "نسيان استدعاء setIntent(intent) داخل onNewIntent() مما يبقي الـ Activity معتمدة على الـ Intent القديم.",
      "الإفراط في استخدام singleTask و singleInstance لكسر السلوك الطبيعي للـ Backstack مما يربك المستخدم.",
    ],
    followUpQuestions: [
      "ما الفرق بين تحديد Launch Mode في الـ Manifest واستخدام Intent Flags مثل FLAG_ACTIVITY_CLEAR_TOP؟",
    ],
    sources: [
      {
        title: "Android Developers — Tasks and the back stack",
        url: "https://developer.android.com/guide/components/activities/tasks-and-back-stack",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "afund-006",
    slug: "configuration-changes-and-state-loss",
    trackId: "android-native",
    topicIds: ["android-fundamentals"],
    difficulty: "Mid",
    question: "ماذا يحدث عند حدوث Configuration Change (كدوران الشاشة) وكيف نحافظ على البيانات؟",
    shortAnswer: "يقوم النظام بإعادة إنشاء الـ Activity بالكامل؛ ونحافظ على البيانات غير العابرة عبر ViewModel والبيانات الحساسة عبر SavedStateHandle أو onSaveInstanceState.",
    explanation: "أثناء تغيير اللغة أو دوران الشاشة، تُدمج الموارد الجديدة بإعادة بناء الـ Activity (تستدعى onDestroy ثم onCreate). يحتفظ ViewModel بالبيانات الثقيلة وحالات الشاشة طالما أن الـ Activity لم تُغلق عمدًا، بينما يُستخدم onSaveInstanceState أو SavedStateHandle لحفظ البيانات النصية ومعرفات العناصر الخفيفة التي تكفي لإعادة بناء الشاشة عند موت العملية.",
    codeExample: `class DetailViewModel(
    private val savedStateHandle: SavedStateHandle
) : ViewModel() {
    // يستعيد المعرف حتى بعد قتل النظام للتطبيق
    val itemId: String = checkNotNull(savedStateHandle["item_id"])
}`,
    commonMistakes: [
      "محاولة تخزين كائنات ضخمة أو Bitmap داخل onSaveInstanceState Bundle، مما يسبب TransactionTooLargeException.",
      "استخدام android:configChanges في الـ Manifest للهروب من معالجة إعادة بناء الشاشة بشكل صحيح.",
    ],
    followUpQuestions: [
      "ما هو الحد الأقصى الآمن لحجم البيانات التي يمكن تخزينها في الـ SavedInstanceState؟",
    ],
    sources: [
      {
        title: "Android Developers — Handle configuration changes",
        url: "https://developer.android.com/guide/topics/resources/runtime-changes",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "afund-007",
    slug: "content-providers-and-data-sharing",
    trackId: "android-native",
    topicIds: ["android-fundamentals"],
    difficulty: "Mid",
    question: "ما هو دور الـ ContentProvider في معمارية أندرويد ومتى تحتاجه؟",
    shortAnswer: "هو مكوّن مركزي لإدارة ومشاركة البيانات المهيكلة بين التطبيقات المختلفة بأمان عبر واجهة تعتمد على مسارات الـ Uri.",
    explanation: "يعمل ContentProvider كوسيط آمن بين التطبيقات، ويغلف قاعدة البيانات الداخلية أو الملفات ويقدم واجهة CRUD قياسية. تحتاجه عند الرغبة في مشاركة بيانات تطبيقك مع تطبيقات خارجية، أو عند التعامل مع بيانات النظام مثل جهات الاتصال (Contacts) والوسائط (MediaStore)، أو لاستخدام FileProvider لمشاركة ملفات آمنة دون كشف مسار التخزين الحقيقي.",
    codeExample: `val cursor = contentResolver.query(
    MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
    arrayOf(MediaStore.Images.Media._ID, MediaStore.Images.Media.DISPLAY_NAME),
    null, null, null
)
cursor?.use {
    while (it.moveToNext()) {
        val name = it.getString(it.getColumnIndexOrThrow(MediaStore.Images.Media.DISPLAY_NAME))
    }
}`,
    commonMistakes: [
      "تنفيذ استعلامات ContentResolver على الـ Main Thread مما يسبب تعليق الواجهة وبطء التمرير.",
      "عدم إغلاق الـ Cursor بعد الانتهاء منه مما يسبب تسريبًا في مراجع قواعد البيانات وذاكرة المؤشرات.",
    ],
    followUpQuestions: [
      "كيف يعمل FileProvider وما فائدته الأمنية مقارنة بمشاركة مسارات الـ file:// المباشرة؟",
    ],
    sources: [
      {
        title: "Android Developers — Content provider basics",
        url: "https://developer.android.com/guide/topics/providers/content-provider-basics",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "afund-008",
    slug: "broadcast-receivers-static-vs-dynamic",
    trackId: "android-native",
    topicIds: ["android-fundamentals"],
    difficulty: "Mid",
    question: "ما الفرق بين BroadcastReceiver المسجل استاتيكيًا والمسجل ديناميكيًا؟",
    shortAnswer: "المسجل استاتيكيًا يُعرّف في Manifest ويستيقظ التطبيق لاستقباله، بينما الديناميكي يُسجل برمجيًا في الكود ويعيش مع دورة حياة المكون المسجل له.",
    explanation: "قامت إصدارات أندرويد الحديثة (بدءًا من Android 8.0) بتقييد معظم الـ Implicit Broadcasts في الـ Manifest للحد من استنزاف البطارية وإيقاظ التطبيقات غير الضروري. لذلك تُسجل معظم الأحداث الحساسة (مثل تغير الاتصال بالشبكة) ديناميكيًا عبر registerReceiver في onStart وتُلغى في onStop لتفادي التسريب.",
    codeExample: `val receiver = object : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        // تنفيذ معالجة سريعة
    }
}

override fun onStart() {
    super.onStart()
    registerReceiver(receiver, IntentFilter(Intent.ACTION_AIRPLANE_MODE_CHANGED))
}

override fun onStop() {
    super.onStop()
    unregisterReceiver(receiver)
}`,
    commonMistakes: [
      "نسيان استدعاء unregisterReceiver عند تدمير المكون مما يؤدي إلى تسريب الـ Context وكراش عند التكرار.",
      "تنفيذ عمليات معقدة أو استدعاءات شبكة طويلة داخل onReceive المحدودة بزمن استجابة قصير جدًا.",
    ],
    followUpQuestions: [
      "ما هي مدة المهلة القصوى لتنفيذ كود داخل دالة onReceive قبل أن يطلق النظام خطأ ANR؟",
    ],
    sources: [
      {
        title: "Android Developers — Broadcasts overview",
        url: "https://developer.android.com/guide/components/broadcasts",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "afund-009",
    slug: "process-death-vs-activity-destruction",
    trackId: "android-native",
    topicIds: ["android-fundamentals"],
    difficulty: "Senior",
    question: "ما الفرق بين موت العملية الكامل (Process Death) وإغلاق الـ Activity بواسطة المستخدم؟",
    shortAnswer: "إغلاق المستخدم ينهي الـ Activity ويمسح كائناتها وحالتها بإرادته، بينما موت العملية يحدث قسرًا بواسطة النظام لتفريغ الذاكرة مع حفظ الـ SavedState لاستعادتها لاحقًا.",
    explanation: "عندما يكون التطبيق في الخلفية، قد يقرر الـ Low Memory Killer (LMK) قتل عملية التطبيق بالكامل لتحرير RAM لتطبيق نشط آخر. عند عودة المستخدم، ينشئ النظام عملية جديدة تمامًا وتكون كائنات الـ Singleton والـ ViewModel القديمة ممسوحة من الذاكرة، ويقوم النظام فقط بتمرير الـ Bundle المحفوظة إلى onCreate و SavedStateHandle لإعادة بناء الحالة.",
    codeExample: `// اختبار موت العملية عبر adb:
// adb shell am kill com.example.app

class ProfileViewModel(savedStateHandle: SavedStateHandle) : ViewModel() {
    // يستعيد المعرف بأمان حتى بعد Process Death
    val userId: StateFlow<String> = savedStateHandle.getStateFlow("user_id", "")
}`,
    commonMistakes: [
      "الاعتماد الكامل على المتغيرات الثابتة (Static Singletons) أو الـ In-Memory Cache وافتراض بقائها حية دائمًا أثناء تنقل المستخدم.",
      "عدم اختبار سلوك التطبيق تحت سيناريو Process Death مما يؤدي لكراشات مفاجئة بسبب Null Pointer عند إعادة الدخول.",
    ],
    followUpQuestions: [
      "كيف يمكنك اختبار سيناريو Process Death بدقة داخل بيئة Android Studio أو عبر سطر الأوامر؟",
    ],
    sources: [
      {
        title: "Android Developers — Processes and app lifecycle",
        url: "https://developer.android.com/guide/components/activities/process-lifecycle",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "afund-010",
    slug: "android-permissions-runtime-model",
    trackId: "android-native",
    topicIds: ["android-fundamentals"],
    difficulty: "Senior",
    question: "كيف تطبق نموذج الصلاحيات الديناميكية (Runtime Permissions) في أندرويد الحديث؟",
    shortAnswer: "تطلب الصلاحيات الخطرة (Dangerous Permissions) وقت الحاجة إليها فقط أثناء تشغيل التطبيق مع تقديم تبرير منطقي (Rationale) والتعامل مع الرفض الدائم.",
    explanation: "بدءًا من Android 6.0 أصبحت الصلاحيات التي تمس خصوصية المستخدم (كالكاميرا والموقع والميكروفون وإشعارات Android 13+) تتطلب موافقة وقت التشغيل عبر Activity Result API (ActivityResultContracts.RequestPermission). يجب فحص shouldShowRequestPermissionRationale لتوضيح سبب الحاجة للصلاحية للمستخدم قبل توجيهه للإعدادات في حال الرفض المتكرر.",
    codeExample: `val requestPermissionLauncher = registerForActivityResult(
    ActivityResultContracts.RequestPermission()
) { isGranted: Boolean ->
    if (isGranted) {
        startCamera()
    } else {
        showRationaleOrSettingsDialog()
    }
}

// طلب الصلاحية عند ضغط زر الكاميرا:
requestPermissionLauncher.launch(Manifest.permission.CAMERA)`,
    commonMistakes: [
      "طلب جميع الصلاحيات دفعة واحدة عند إقلاع التطبيق لأول مرة مما يقلل ثقة المستخدم ويزيد معدل الرفض.",
      "تجاهل إضافة الصلاحية في AndroidManifest.xml وافتراض أن طلبها وقت التشغيل فقط يكفي.",
    ],
    followUpQuestions: [
      "كيف تختلف صلاحيات الوصول للموقع في الخلفية (ACCESS_BACKGROUND_LOCATION) عن صلاحيات الموقع أثناء الاستخدام؟",
    ],
    sources: [
      {
        title: "Android Developers — Request app permissions",
        url: "https://developer.android.com/training/permissions/requesting",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
];
