import type { InterviewQuestion } from "../questions.ts";

export const uiComposeQuestions: Omit<InterviewQuestion, "translations">[] = [
  // android-ui (6 questions)
  {
    id: "aui-001",
    slug: "view-hierarchy-and-custom-views",
    trackId: "android-native",
    topicIds: ["android-ui"],
    difficulty: "Junior",
    question: "ما هي المراحل الثلاث الأساسية لرسم أي View على الشاشة في أندرويد؟",
    shortAnswer: "تمر بثلاث مراحل متتالية: القياس (Measure) ثم التموضع (Layout) ثم الرسم (Draw).",
    explanation: "في مرحلة onMeasure يحدد الـ View حجمه بناءً على قيود الأب (MeasureSpec: EXACTLY, AT_MOST, UNSPECIFIED). في مرحلة onLayout يتم حساب إحداثيات الزوايا الأربع للـ View وموضعه بالنسبة للأب. في مرحلة onDraw يقوم الـ View برسم محتواه البصري على كائن الـ Canvas باستخدام الـ Paint.",
    codeExample: `class CircleView(context: Context, attrs: AttributeSet?) : View(context, attrs) {
    private val paint = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = Color.BLUE }

    override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
        setMeasuredDimension(200, 200) // تحديد الحجم
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        canvas.drawCircle(width / 2f, height / 2f, width / 2f, paint)
    }
}`,
    commonMistakes: [
      "إنشاء كائنات جديدة مثل Paint أو Path داخل دالة onDraw مما يرهق الـ Garbage Collector ويسبب تقطيع الإطارات (Jank).",
      "استدعاء requestLayout بدلاً من invalidate عند الرغبة فقط في تحديث الألوان دون تغيير أبعاد الـ View.",
    ],
    followUpQuestions: [
      "ما الفرق بين invalidate() و requestLayout() ومتى تستخدم كلاً منهما؟",
    ],
    sources: [
      {
        title: "Android Developers — Custom View components",
        url: "https://developer.android.com/guide/topics/ui/custom-components",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "aui-002",
    slug: "viewbinding-vs-databinding",
    trackId: "android-native",
    topicIds: ["android-ui"],
    difficulty: "Junior",
    question: "ما الفرق بين ViewBinding و DataBinding في تطوير أندرويد؟",
    shortAnswer: "ViewBinding يوفر وصولاً سريعًا وآمنًا للأنواع (Type-safe) لعناصر الـ XML بدون كلفة ترجمة ثقيلة، بينما DataBinding يدعم ربط البيانات ثنائي الاتجاه داخل ملف الـ XML نفسه.",
    explanation: "يحل ViewBinding محل findViewById و Kotlin Synthetics بالكامل، وهو أسرع في وقت الترجمة ولا يتطلب تاجات <layout> خاصة. أما DataBinding فهو أثقل ويسمح بكتابة تعبيرات منطقية وربط كائنات الـ Observable أو LiveData مباشرة داخل ملفات التصميم الـ XML، مع دعم Two-way Binding (@={}).",
    codeExample: `// ViewBinding:
class ProfileActivity : AppCompatActivity() {
    private lateinit var binding: ActivityProfileBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityProfileBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.usernameTextView.text = "Ahmed"
    }
}`,
    commonMistakes: [
      "الاعتماد على DataBinding فقط للوصول إلى عناصر الـ View بالمعرفات دون استخدام ميزاته البرمجية داخل XML، مما يبطئ وقت البناء بلا داع.",
      "عدم تفريغ كائن الـ binding (_binding = null) داخل onDestroyView في الـ Fragments مما يسبب تسريب الذاكرة.",
    ],
    followUpQuestions: [
      "لماذا يعتبر ViewBinding أكثر أمانًا من findViewById في تجنب NullPointerExceptions؟",
    ],
    sources: [
      {
        title: "Android Developers — View Binding",
        url: "https://developer.android.com/topic/libraries/view-binding",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "aui-003",
    slug: "recyclerview-viewholder-pattern",
    trackId: "android-native",
    topicIds: ["android-ui"],
    difficulty: "Junior",
    question: "كيف يعمل نمط ViewHolder داخل الـ RecyclerView ولماذا يعتبر فعالاً؟",
    shortAnswer: "يعيد تدوير الـ Views التي تخرج عن نطاق الشاشة لعرض عناصر جديدة بدل إنشائها من الصفر، مما يمنع استدعاءات findViewById المتكررة.",
    explanation: "يحتفظ ViewHolder بمراجع عناصر الواجهة في الذاكرة. عند التمرير، لا يقوم الـ RecyclerView بإنشاء View جديدة، بل يستدعي onCreateViewHolder فقط لعدد كافٍ لملء الشاشة مع هامش بسيط، ثم يعيد استخدام هذه الحاويات عبر onBindViewHolder لتحديث النصوص والصور فقط، مما يوفر سلاسة فائقة بمعدل 60/120 إطار في الثانية.",
    codeExample: `class UserAdapter : RecyclerView.Adapter<UserAdapter.UserViewHolder>() {
    class UserViewHolder(val binding: ItemUserBinding) : RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): UserViewHolder {
        val binding = ItemUserBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return UserViewHolder(binding)
    }

    override fun onBindViewHolder(holder: UserViewHolder, position: Int) {
        holder.binding.nameText.text = items[position].name
    }
}`,
    commonMistakes: [
      "تنفيذ عمليات معالجة مكلفة أو حسابات معقدة داخل onBindViewHolder مما يسبب تقطيعاً ملحوظاً أثناء التمرير.",
      "نسيان ضبط setHasFixedSize(true) عندما تكون أبعاد القائمة ثابتة ومستقلة عن محتوياتها.",
    ],
    followUpQuestions: [
      "ما الفرق بين onCreateViewHolder و onBindViewHolder من حيث عدد مرات الاستدعاء؟",
    ],
    sources: [
      {
        title: "Android Developers — Create dynamic lists with RecyclerView",
        url: "https://developer.android.com/develop/ui/views/layout/recyclerview",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "aui-004",
    slug: "diffutil-and-listadapter",
    trackId: "android-native",
    topicIds: ["android-ui"],
    difficulty: "Mid",
    question: "ما فائدة DiffUtil و ListAdapter مقارنة باستدعاء notifyDataSetChanged()؟",
    shortAnswer: "يحسب DiffUtil الفروقات بين قائمتين في خلفية غير متزامنة ويطبق تحريكات دقيقة وموضعية للعناصر المتغيرة فقط بدلاً من إعادة رسم القائمة بأكملها.",
    explanation: "استدعاء notifyDataSetChanged يعيد بناء وتحديث كل عنصر مرئي على الشاشة ويلغي أنيميشن التمرير. يحسب DiffUtil أصغر تسلسل من عمليات التعديل (إضافة، حذف، تحريك، تعديل جزئي) باستخدام خوارزمية Eugene W. Myers. ويغلف ListAdapter هذا المنطق في كلاس جاهز يرسل القوائم الجديدة تلقائيًا عبر submitList على background thread.",
    codeExample: `class UserDiffCallback : DiffUtil.ItemCallback<User>() {
    override fun areItemsTheSame(oldItem: User, newItem: User): Boolean = oldItem.id == newItem.id
    override fun areContentsTheSame(oldItem: User, newItem: User): Boolean = oldItem == newItem
}

class UserListAdapter : ListAdapter<User, UserViewHolder>(UserDiffCallback()) { ... }

// التحديث السلس:
userListAdapter.submitList(newList)`,
    commonMistakes: [
      "تمرير نفس المرجع القابل للتعديل (MutableList) إلى submitList دون إنشاء قائمة جديدة، مما يمنع DiffUtil من اكتشاف أي تغيير.",
      "كتابة شروط خاطئة داخل areItemsTheSame تجعل الـ ID يتطابق مع عناصر مختلفة تمامًا.",
    ],
    followUpQuestions: [
      "متى نستخدم getChangePayload في DiffUtil لتنفيذ تحديثات بصرية جزئية (Partial Binds)؟",
    ],
    sources: [
      {
        title: "Android Developers — DiffUtil",
        url: "https://developer.android.com/reference/androidx/recyclerview/widget/DiffUtil",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "aui-005",
    slug: "constraintlayout-flat-hierarchy",
    trackId: "android-native",
    topicIds: ["android-ui"],
    difficulty: "Mid",
    question: "كيف يساهم ConstraintLayout في تحسين أداء واجهة المستخدم مقارنة بـ LinearLayouts المتداخلة؟",
    shortAnswer: "يتيح بناء واجهات مستخدم معقدة بتسلسل هرمي مسطح (Flat Hierarchy) دون تداخل الحاويات، مما يقلل كلفة Measure و Layout المزدوجة.",
    explanation: "عند تداخل عدة LinearLayouts تستخدم layout_weight، يضطر النظام لتنفيذ دورات قياس متعددة لكل مستوى تداخل (Double Taxation)، مما يؤثر سلبًا على الـ UI Rendering. يحل ConstraintLayout كل العلاقات النسبية بين العناصر (كالمحاذاة والنسب المئوية والـ Chains والـ Guidelines) في خطوة قياس رياضية واحدة مستوية.",
    codeExample: `<!-- واجهة مسطحة باستخدام قيود واضحة -->
<androidx.constraintlayout.widget.ConstraintLayout ...>
    <ImageView
        android:id="@+id/avatar"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" ... />

    <TextView
        android:id="@+id/title"
        app:layout_constraintStart_toEndOf="@id/avatar"
        app:layout_constraintTop_toTopOf="@id/avatar" ... />
</androidx.constraintlayout.widget.ConstraintLayout>`,
    commonMistakes: [
      "استخدام ConstraintLayout في كل مكان حتى للواجهات البسيطة جدًا المكونة من عنصرين، حيث يكون LinearLayout العادي أسرع وأخف.",
    ],
    followUpQuestions: [
      "ما هي الـ Chains والـ Guidelines في ConstraintLayout وكيف تساعد في توزيع العناصر؟",
    ],
    sources: [
      {
        title: "Android Developers — Build a Responsive UI with ConstraintLayout",
        url: "https://developer.android.com/develop/ui/views/layout/constraint-layout",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "aui-006",
    slug: "custom-views-drawing-and-touch",
    trackId: "android-native",
    topicIds: ["android-ui"],
    difficulty: "Senior",
    question: "كيف تدير أحداث اللمس المتعدد والاعتراض (Touch Interception) في Custom ViewGroup؟",
    shortAnswer: "تتحكم في مسار اللمس عبر dispatchTouchEvent، وتقرر الحاوية اعتراضا عبر onInterceptTouchEvent، بينما تتعامل الـ View مع اللمس الفعلي في onTouchEvent.",
    explanation: "تبدأ لمسة المستخدم من أعلى الشجرة نزولاً للأبناء عبر dispatchTouchEvent. يمكن للـ ViewGroup فحص اللمسة واعتراضها بالعودة بـ true من onInterceptTouchEvent (مثل حركة التمرير في ScrollView)، مما يرسل حدث ACTION_CANCEL للابن الحالي ويوجه بقية الأحداث لـ onTouchEvent الخاص بالحاوية. كما يمكن للابن طلب عدم اعتراض اللمسة عبر requestDisallowInterceptTouchEvent(true).",
    codeExample: `override fun onInterceptTouchEvent(ev: MotionEvent): Boolean {
    return when (ev.actionMasked) {
        MotionEvent.ACTION_MOVE -> shouldInterceptScroll(ev) // اعتراض التمرير
        else -> false
    }
}

override fun onTouchEvent(event: MotionEvent): Boolean {
    // تنفيذ حركة السحب الفعلية
    return gestureDetector.onTouchEvent(event)
}`,
    commonMistakes: [
      "إرجاع true في ACTION_DOWN داخل onInterceptTouchEvent دون قصد، مما يمنع الأبناء من استقبال أي أحداث نقر تمامًا.",
    ],
    followUpQuestions: [
      "ما هو دور NestedScrollingChild و NestedScrollingParent في حل تعارض التمرير بين قائمتين؟",
    ],
    sources: [
      {
        title: "Android Developers — Manage touch events in a ViewGroup",
        url: "https://developer.android.com/training/gestures/viewgroup",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },

  // jetpack-compose (10 questions)
  {
    id: "compose-001",
    slug: "declarative-vs-imperative-ui",
    trackId: "android-native",
    topicIds: ["jetpack-compose"],
    difficulty: "Junior",
    question: "ما هو Jetpack Compose وما الفرق بين الواجهات التصريحية والإجرائية؟",
    shortAnswer: "Compose إطار عمل تصريحي (Declarative) يصف شكل الواجهة بناءً على الحالة الحالية، بينما النهج الإجرائي القديم (Imperative) يعتمد على تعديل شجرة الـ Views يدويًا.",
    explanation: "في نظام Views التقليدي (Imperative)، تقوم بتهيئة الـ View وتعديل خصائصها يدويًا مثل textView.setText() أو visibility = GONE، مما قد يسبب عدم اتساق بين البيانات المعروضة والحالة الفعلية. في Jetpack Compose، تصف الواجهة كدالة تستقبل الحالة، وعندما تتغير الحالة يعيد Compose استدعاء الدوال المتأثرة تلقائيًا (Recomposition).",
    codeExample: `@Composable
fun Greeting(name: String, isVisible: Boolean) {
    if (isVisible) {
        Text(text = "مرحبًا بك، \$name!", style = MaterialTheme.typography.bodyLarge)
    }
}`,
    commonMistakes: [
      "محاولة الاحتفاظ بمرجع لدالة الـ Composable أو محاولة تعديل خصائصها بعد تنفيذها كما كان يحدث مع كائنات View القديمة.",
    ],
    followUpQuestions: [
      "كيف تترجم دوال Composable إلى شجرة مكونات حقيقية على شاشة أندرويد؟",
    ],
    sources: [
      {
        title: "Android Developers — Thinking in Compose",
        url: "https://developer.android.com/develop/ui/compose/mental-model",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "compose-002",
    slug: "recomposition-and-composable-lifecycle",
    trackId: "android-native",
    topicIds: ["jetpack-compose"],
    difficulty: "Junior",
    question: "ما هي الـ Recomposition في Jetpack Compose وكيف تعمل بكفاءة؟",
    shortAnswer: "هي عملية إعادة استدعاء دوال الـ Composable تلقائيًا عندما تتغير حالتها (State) لتحديث الشاشة مع تخطي المكونات التي لم تتغير مدخلاتها.",
    explanation: "تعتبر Recomposition ذكية (Intelligent Skipping)؛ حيث يقارن Compose المعاملات الجديدة بالقديمة، وإذا كانت متطابقة ومستقرة، فإنه يتجاوز تنفيذ جسم الدالة تمامًا. يمكن للـ Recomposition أن تحدث بتردد عالٍ، ويجب ألا تحتوي دوال الـ Composable على أي Side Effects مباشرة داخل جسمها.",
    codeExample: `@Composable
fun Counter() {
    var count by remember { mutableStateOf(0) }

    Button(onClick = { count++ }) {
        Text("العدد: \$count") // فقط هذا الجزء يعاد تكوينه عند تغير count
    }
}`,
    commonMistakes: [
      "وضع عمليات حسابية مكلفة أو إنشاء كائنات جديدة داخل جسم Composable دون استخدام remember، مما يتسبب في تكرارها في كل إطار.",
    ],
    followUpQuestions: [
      "هل تضمن دوال الـ Composable الترتيب الزمني نفسه للتنفيذ في كل دورة Recomposition؟",
    ],
    sources: [
      {
        title: "Android Developers — Lifecycle of composables",
        url: "https://developer.android.com/develop/ui/compose/lifecycle",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "compose-003",
    slug: "state-hoisting-in-compose",
    trackId: "android-native",
    topicIds: ["jetpack-compose"],
    difficulty: "Junior",
    question: "ما هو مبدأ رفع الحالة (State Hoisting) في Jetpack Compose؟",
    shortAnswer: "هو نمط نقل إدارة الحالة إلى المكون الأب لجعل المكون الابن عديم الحالة (Stateless)، قابلاً لإعادة الاستخدام وسهل الاختبار.",
    explanation: "يتم تطبيق State Hoisting باستبدال المتغير الداخلي بمعاملين: القيمة الحالية (value: T) ودالة رد الاتصال للأحداث (onValueChange: (T) -> Unit). يضمن هذا النمط تدفق البيانات في اتجاه واحد (Unidirectional Data Flow)، حيث تتدفق الحالة للأسفل وتتدفق الأحداث للأعلى.",
    codeExample: `// Stateless Composable قابل للاختبار وإعادة الاستخدام
@Composable
fun SearchInput(
    query: String,
    onQueryChange: (String) -> Unit
) {
    TextField(
        value = query,
        onValueChange = onQueryChange,
        label = { Text("ابحث هنا...") }
    )
}`,
    commonMistakes: [
      "تضمين إدارة الحالة والـ ViewModel مباشرة داخل المكونات البصرية الفرعية، مما يمنع إعادة استخدامها في أماكن أخرى أو في Preview.",
    ],
    followUpQuestions: [
      "ما هي فوائد State Hoisting بالنسبة لكتابة Unit Tests لاختبار الـ UI؟",
    ],
    sources: [
      {
        title: "Android Developers — Where to hoist state",
        url: "https://developer.android.com/develop/ui/compose/state-hoisting",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "compose-004",
    slug: "remember-vs-remembersaveable",
    trackId: "android-native",
    topicIds: ["jetpack-compose"],
    difficulty: "Mid",
    question: "ما الفرق بين remember و rememberSaveable في Jetpack Compose؟",
    shortAnswer: "remember تحتفظ بالحالة عبر دورات الـ Recomposition فقط، بينما rememberSaveable تحتفظ بها عبر دورات دوران الشاشة وموت العملية (Process Death).",
    explanation: "تخزن remember القيمة في شجرة الـ Composition وتفقد قيمتها عند إعادة إنشاء الـ Activity (مثل تدوير الجهاز). أما rememberSaveable فتستخدم آلية SavedInstanceState الداخلية لنظام أندرويد لحفظ القيم واسترجاعها تلقائيًا للأنواع الأولية أو للكائنات المخصصة باستخدام Saver مخصص أو Parcelize.",
    codeExample: `@Composable
fun SearchScreen() {
    // تبقى القيمة محفوظة حتى بعد دوران الهاتف:
    var text by rememberSaveable { mutableStateOf("") }

    TextField(value = text, onValueChange = { text = it })
}`,
    commonMistakes: [
      "استخدام remember لحفظ مدخلات المستخدم في النماذج دون إدراك أنها ستضيع فور تدوير الهاتف.",
      "تمرير كائنات معقدة لا تطبق Parcelable أو ليس لها Saver مخصص إلى rememberSaveable مما يسبب كراش وقت التشغيل.",
    ],
    followUpQuestions: [
      "كيف يمكنك كتابة Custom Saver لتخزين كائن مخصص داخل rememberSaveable؟",
    ],
    sources: [
      {
        title: "Android Developers — State and Jetpack Compose / Restore state",
        url: "https://developer.android.com/develop/ui/compose/state#restore-ui-state",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "compose-005",
    slug: "side-effects-launchedeffect-and-disposableeffect",
    trackId: "android-native",
    topicIds: ["jetpack-compose"],
    difficulty: "Mid",
    question: "ما هي الآثار الجانبية (Side Effects) في Compose وما الفرق بين LaunchedEffect و DisposableEffect؟",
    shortAnswer: "LaunchedEffect يطلق Coroutine لإجراء مهمة غير متزامنة عند تغير مفتاح؛ DisposableEffect ينفذ كودًا مع توفير تنظيف إلزامي (onDispose) عند خروج المكون.",
    explanation: "الـ Side Effect هو أي تغيير في حالة التطبيق يحدث خارج نطاق دالة الـ Composable. ينفذ LaunchedEffect الكود في CoroutineScope مرتبط بدورة حياة المكون ويلغى تلقائيًا إذا غادر الشاشة أو تغيرت المفاتيح (Key). أما DisposableEffect فيُستخدم لتسجيل المستمعين (Observers/Callbacks) التي تتطلب إلغاء اشتراك واضح داخل كتلة onDispose.",
    codeExample: `// LaunchedEffect: استدعاء API عند تغيير userId
LaunchedEffect(userId) {
    viewModel.loadUserDetails(userId)
}

// DisposableEffect: تسجيل مستمع وإلغاءه
DisposableEffect(lifecycleOwner) {
    val observer = LifecycleEventObserver { _, event -> ... }
    lifecycleOwner.lifecycle.addObserver(observer)
    onDispose {
        lifecycleOwner.lifecycle.removeObserver(observer)
    }
}`,
    commonMistakes: [
      "إطلاق Coroutine أو استدعاء عمليات شبكية مباشرة داخل جسم دالة Composable بدون استخدام Side-effect API.",
      "نسيان إضافة المفتاح المناسب لـ LaunchedEffect(key) مما يمنع إعادة تشغيله عند تغير المعطيات.",
    ],
    followUpQuestions: [
      "متى نستخدم rememberCoroutineScope بدلاً من LaunchedEffect لإطلاق Coroutine في Compose؟",
    ],
    sources: [
      {
        title: "Android Developers — Side-effects in Compose",
        url: "https://developer.android.com/develop/ui/compose/side-effects",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "compose-006",
    slug: "compositionlocal-implicit-dependencies",
    trackId: "android-native",
    topicIds: ["jetpack-compose"],
    difficulty: "Mid",
    question: "ما هو دور CompositionLocal في Jetpack Compose ومتى يجب استخدامه؟",
    shortAnswer: "أداة لتمرير البيانات والتبعيات ضمنيًا عبر شجرة المكونات دون الحاجة لتمريرها كمعامل في كل دالة Composable فرعية.",
    explanation: "يُستخدم CompositionLocal للمعلومات المنتشرة في كل مكان وتتشاركها الشاشات مثل الثيمات (MaterialTheme.colorScheme) أو سياق أندرويد (LocalContext.current) أو إدارة لوحة المفاتيح (LocalSoftwareKeyboardController). يوفر نمطين للإنشاء: compositionLocalOf للمتغيرات متكررة التغير، و staticCompositionLocalOf للقيم الثابتة نادرًا ما تتغير لتحسين أداء Recomposition.",
    codeExample: `// توفير قيمة داخل نطاق محدد:
val LocalSpacing = staticCompositionLocalOf { Spacing() }

CompositionLocalProvider(LocalSpacing provides CustomSpacing()) {
    // يمكن لأي Composable فرعي الوصول للقيمة مباشرة:
    val spacing = LocalSpacing.current
}`,
    commonMistakes: [
      "استخدام CompositionLocal لتمرير حالات أو بيانات عادية لـ Feature معينة بدلاً من تمريرها صراحة بالمعاملات، مما يجعل تدفق البيانات غامضًا وصعب التتبع.",
    ],
    followUpQuestions: [
      "ما الفرق الدقيق في الأداء بين staticCompositionLocalOf و compositionLocalOf؟",
    ],
    sources: [
      {
        title: "Android Developers — Locally scoped data with CompositionLocal",
        url: "https://developer.android.com/develop/ui/compose/compositionlocal",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "compose-007",
    slug: "derivedstateof-vs-remember-keys",
    trackId: "android-native",
    topicIds: ["jetpack-compose"],
    difficulty: "Mid",
    question: "متى نستخدم derivedStateOf في Compose ولماذا تختلف عن remember(keys)؟",
    shortAnswer: "تُستخدم derivedStateOf لتحديث الحالة فقط عندما تتغير نتيجة الحساب الفعلية، فتمنع الـ Recomposition غير الضرورية الناتجة عن التغيرات المستمرة في المدخلات.",
    explanation: "تعتبر derivedStateOf الخيار الذهبي لمراقبة حالات تتغير بسرعة أكبر من حاجتنا، مثل مراقبة موضع تمرير قائمة (LazyListState.firstVisibleItemIndex). لو استخدمنا remember(state.firstVisibleItemIndex) سيعاد حساب وتكوين الدالة مع كل بكسل يتم تمريره؛ بينما تضمن derivedStateOf ألا تنطلق Recomposition إلا إذا تغير الشرط النهائي فقط (مثل ظهور زر العودة للأعلى).",
    codeExample: `val listState = rememberLazyListState()

// صحيح: Recomposition تحدث فقط عندما يتحول الناتج من false إلى true والعكس
val showScrollToTopButton by remember {
    derivedStateOf { listState.firstVisibleItemIndex > 5 }
}`,
    commonMistakes: [
      "استخدام derivedStateOf مع كائنات ليست من نوع State، حيث لا تقدم أي ميزة إضافية في هذه الحالة.",
      "استخدام remember(key) لمراقبة Scroll Position بدلاً من derivedStateOf مما يسبب بطء التمرير وهبوط الإطارات.",
    ],
    followUpQuestions: [
      "لماذا يعتبر استخدام derivedStateOf غير ضروري عند دمج حالتي State نادرتي التغير؟",
    ],
    sources: [
      {
        title: "Android Developers — derivedStateOf in Jetpack Compose",
        url: "https://developer.android.com/develop/ui/compose/side-effects#derivedstateof",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "compose-008",
    slug: "compose-modifiers-order-of-execution",
    trackId: "android-native",
    topicIds: ["jetpack-compose"],
    difficulty: "Mid",
    question: "لماذا يعد ترتيب استدعاء الـ Modifiers جوهريًا في Jetpack Compose؟",
    shortAnswer: "لأن الـ Modifiers تطبق بالتسلسل من الخارج للداخل؛ فالترتيب يحدد منطقة النقر والأبعاد وحواف الرسم بدقة.",
    explanation: "تُعامل الـ Modifiers كسلسلة مغلفة؛ فإذا وضعت clickable قبل padding، فإن مساحة النقر ستشمل الـ padding الخارجي. أما إذا عكست الترتيب (padding أولاً ثم clickable) فستكون مساحة النقر محصورة فقط داخل العنصر دون الهوامش. كذلك وضع background قبل padding يلون الحاوية كاملة بينما وضعها بعده يلون المحتوى الداخلي فقط.",
    codeExample: `// النقر يشمل الهوامش واللون يغطي الحاوية:
Modifier
    .background(Color.Yellow)
    .clickable { }
    .padding(16.dp)

// النقر لا يشمل الهوامش واللون يغطي المحتوى الداخلي فقط:
Modifier
    .padding(16.dp)
    .background(Color.Yellow)
    .clickable { }`,
    commonMistakes: [
      "الافتراض بأن ترتيب الـ Modifiers تجميلي ولا يؤثر على منطقة التفاعل (Touch Target) أو المساحة المحجوزة.",
    ],
    followUpQuestions: [
      "كيف يؤثر Modifier.fillMaxWidth متبوعًا بـ Modifier.wrapContentWidth على المحاذاة؟",
    ],
    sources: [
      {
        title: "Android Developers — Compose modifiers overview",
        url: "https://developer.android.com/develop/ui/compose/modifiers",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "compose-009",
    slug: "lazycolumn-performance-and-keys",
    trackId: "android-native",
    topicIds: ["jetpack-compose"],
    difficulty: "Senior",
    question: "كيف تضمن أعلى أداء وسلاسة للقوائم الكبيرة في LazyColumn؟",
    shortAnswer: "بتوفير key ثابت وفريد لكل عنصر، وتحديد contentType، والابتعاد عن العمليات الحسابية داخل العناصر أثناء التمرير.",
    explanation: "عند غياب الـ key، يعتمد Compose على موضع العنصر (Position) في القائمة، فإذا حُذف عنصر من البداية، يعاد تكوين القائمة بأكملها وتضيع حالات الرسوم المتحركة وعناصر التمرير. توفير key فريد يسمح لـ Compose بتتبع العناصر وتحريكها بكفاءة، بينما يساعد contentType مجمع العناصر على إعادة استخدام التكوين المشابه كما في نمط ViewType القديم.",
    codeExample: `LazyColumn {
    items(
        items = messages,
        key = { message -> message.id }, // مفتاح فريد وثابت
        contentType = { message -> message.type } // تصنيف نوع العنصر
    ) { message ->
        MessageItem(message)
    }
}`,
    commonMistakes: [
      "استخدام مؤشر القائمة (index) كـ key، مما يلغي فائدة تتبع العناصر عند الإضافة أو الحذف.",
      "تضمين كائنات قابلة للتعديل وغير مستقرة (مثل Unstable Lists) كمعاملات لعناصر القائمة مما يمنع skipping.",
    ],
    followUpQuestions: [
      "كيف يفيد contentType في تجنب إعادة حساب قياس العناصر في القوائم غير المتجانسة؟",
    ],
    sources: [
      {
        title: "Android Developers — Lazy lists in Compose",
        url: "https://developer.android.com/develop/ui/compose/lists",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "compose-010",
    slug: "compose-stability-and-skipping",
    trackId: "android-native",
    topicIds: ["jetpack-compose"],
    difficulty: "Senior",
    question: "كيف يحدد Compose استقرار البيانات (Stability) لتخطي الـ Recomposition (Smart Skipping)؟",
    shortAnswer: "يصنف المترجم الأنواع كـ Stable أو Immutable بناءً على ثبات قيمها؛ إذا كانت كل معاملات الدالة مستقرة ولم تتغير قيمها، يتم تخطي الدالة بالكامل.",
    explanation: "يعتبر النوع Immutable إذا كانت كل خصائصه المعلنة val من أنواع بدائية أو أنواع غير قابلة للتغيير. أما النوع Stable فيضمن إشعار Compose عند حدوث أي تعديل (مثل MutableState). المشكلة الشائعة تحدث مع مجموعات Kotlin القياسية (مثل List<T>) التي يعتبرها مترجم Compose غير مستقرة لأنها قد تكون MutableList في الحقيقة، مما يمنع skipping حتى لو لم تتغير المحتويات.",
    codeExample: `// كلاس مستقر يسمح بتخطي التكوين
@Immutable
data class UserUiModel(val id: String, val name: String)

// لتفادي اعتبار List غير مستقرة، نستخدم Kotlinx Immutable Collections:
@Composable
fun UserList(users: PersistentList<UserUiModel>) {
    // تتخطى دالة التكوين بنجاح إذا لم تتغير القائمة
}`,
    commonMistakes: [
      "تمرير List عادية من وحدة خارجية تجعل المترجم يصنف المكون كـ Non-skippable دون انتباه المطور.",
      "استخدام دوال لامدا تلتقط متغيرات متغيرة دون تذكرها عبر remember.",
    ],
    followUpQuestions: [
      "ما هي أداة Compose Compiler Metrics وكيف تستخدمها لتحليل استقرار المكونات؟",
    ],
    sources: [
      {
        title: "Android Developers — Jetpack Compose Stability",
        url: "https://developer.android.com/develop/ui/compose/performance/stability",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
];
