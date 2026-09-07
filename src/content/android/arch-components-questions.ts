import type { InterviewQuestion } from "../questions.ts";

export const archComponentsQuestions: Omit<InterviewQuestion, "translations">[] = [
  {
    id: "aarch-001",
    slug: "viewmodel-purpose-and-lifecycle",
    trackId: "android-native",
    topicIds: ["architecture-components"],
    difficulty: "Junior",
    question: "ما هو دور الـ ViewModel في بنية تطبيقات أندرويد وكيف تختلف دورة حياته عن الـ Activity؟",
    shortAnswer: "يفصل بيانات ومنطق الواجهة عن دورة حياة الشاشة، ويبقى حيًا في الذاكرة أثناء إعادة إنشاء الـ Activity عند تدوير الجهاز ولا ينتهي إلا بإغلاق الشاشة نهائيًا.",
    explanation: "يُنشأ الـ ViewModel بواسطة ViewModelProvider وتديره ViewModelStoreOwner. عند حدوث Configuration Change كدوران الشاشة، لا يُدمر الـ ViewModel بل يُعاد ربطه بنسخة الـ Activity الجديدة. يستدعى onCleared() الخاص به فقط عند انتهاء دورة حياة المالك الحقيقية (استدعاء finish() أو خروج المستخدم من الـ Backstack).",
    codeExample: `class UserViewModel : ViewModel() {
    private val _users = MutableStateFlow<List<User>>(emptyList())
    val users: StateFlow<List<User>> = _users.asStateFlow()

    override fun onCleared() {
        super.onCleared()
        // تنظيف الموارد والاشتراكات النشطة
    }
}`,
    commonMistakes: [
      "تمرير مرجع للـ Activity أو Context أو أي كائن View داخل الـ ViewModel، مما يسبب تسريب ذاكرة مؤكدًا (Memory Leak).",
      "إنشاء نسخة ViewModel يدويًا عبر UserViewModel() بدلاً من استخدام ViewModelProvider أو Delegate من Jetpack (by viewModels()).",
    ],
    followUpQuestions: [
      "إذا كنت بحاجة إلى Context داخل ViewModel، فما هو البديل الآمن؟",
    ],
    sources: [
      {
        title: "Android Developers — ViewModel overview",
        url: "https://developer.android.com/topic/libraries/architecture/viewmodel",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "aarch-002",
    slug: "livedata-vs-stateflow-in-viewmodel",
    trackId: "android-native",
    topicIds: ["architecture-components"],
    difficulty: "Junior",
    question: "ما الفرق بين LiveData و StateFlow ولماذا يُفضل StateFlow في تطبيقات Kotlin الحديثة؟",
    shortAnswer: "LiveData مدمجة مع دورة حياة أندرويد وتعمل فقط على الـ Main Thread؛ بينما StateFlow تنتمي لـ Kotlin Coroutines وتدعم مشغلات التدفق والعمل على أي Dispatcher وتعتبر نقية من تبعيات أندرويد.",
    explanation: "تعتبر LiveData حلاً كلاسيكيًا مرتبطًا بـ Android SDK، مما يجعلها غير صالحة لطبقات الـ Domain أو بيئة Kotlin Multiplatform. في المقابل، توفر StateFlow دائمًا قيمة أولية (Initial Value)، وتدعم مشغلات Flow القوية (مثل map, filter, combine, debounce)، ويمكن جمع بياناتها في واجهات أندرويد بأمان باستخدام repeatOnLifecycle.",
    codeExample: `// StateFlow النظيف في ViewModel:
class CounterViewModel : ViewModel() {
    private val _count = MutableStateFlow(0)
    val count: StateFlow<Int> = _count.asStateFlow()

    fun increment() { _count.value++ }
}`,
    commonMistakes: [
      "جمع بيانات StateFlow داخل الـ UI باستخدام lifecycleScope.launch العادي دون repeatOnLifecycle، مما يبقي جمع البيانات نشطًا في الخلفية ويهدر الموارد.",
    ],
    followUpQuestions: [
      "ما هي أداة collectAsStateWithLifecycle في Jetpack Compose وكيف تضمن أمان دورة الحياة؟",
    ],
    sources: [
      {
        title: "Android Developers — StateFlow and SharedFlow",
        url: "https://developer.android.com/kotlin/flow/stateflow-and-sharedflow",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "aarch-003",
    slug: "unidirectional-data-flow-in-android",
    trackId: "android-native",
    topicIds: ["architecture-components"],
    difficulty: "Junior",
    question: "ما هو نمط تدفق البيانات أحادي الاتجاه (Unidirectional Data Flow - UDF)؟",
    shortAnswer: "نمط معماري تتدفق فيه الحالة (State) للأسفل نحو الواجهة، وتتدفق الأحداث وتفاعلات المستخدم (Events) للأعلى نحو الـ ViewModel.",
    explanation: "يضمن UDF وجود مصدر وحيد للحقيقة (Single Source of Truth). لا تقوم واجهة المستخدم بتعديل المتغيرات مباشرة؛ بل تطلق Intent/Event (مثل OnItemClicked). يستقبل الـ ViewModel هذا الحدث، وينفذ منطق العمل المطلوب عبر المستودعات، ثم ينتج حالة جديدة غير قابلة للتغيير (Immutable State) تلتقطها الواجهة وتعيد رسم نفسها.",
    codeExample: `// 1. الحالة تتدفق للأسفل
val uiState: StateFlow<NewsUiState>

// 2. الأحداث تتدفق للأعلى
fun onEvent(event: NewsUiEvent) {
    when (event) {
        is NewsUiEvent.Refresh -> fetchNews()
        is NewsUiEvent.Bookmark -> saveArticle(event.articleId)
    }
}`,
    commonMistakes: [
      "تعديل الحالة من أماكن متعددة داخل الواجهة بدلاً من جعل الـ ViewModel هو المسؤول الحصري عن إصدار الحالات.",
    ],
    followUpQuestions: [
      "كيف يسهل نمط UDF كتابة اختبارات آلية واضحة ومستقلة لطبقة الـ ViewModel؟",
    ],
    sources: [
      {
        title: "Android Developers — Architecture guide / UI Layer",
        url: "https://developer.android.com/topic/architecture/ui-layer",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "aarch-004",
    slug: "viewmodel-savedstatehandle",
    trackId: "android-native",
    topicIds: ["architecture-components"],
    difficulty: "Mid",
    question: "ما هي فائدة SavedStateHandle وكيف تحمي التطبيق من موت العملية (Process Death)؟",
    shortAnswer: "تخزن وتسترجع البيانات الحساسة للـ ViewModel تلقائيًا عند إنهاء النظام لعملية التطبيق في الخلفية، وتعمل كـ Map مفتاح-قيمة مدمج مع StateFlow.",
    explanation: "بينما يحمي الـ ViewModel من دوران الشاشة، فإنه لا يحمي من قتل النظام للعملية بالكامل لتوفير الذاكرة. يحقن Hilt تلقائيًا SavedStateHandle في ViewModel، وتتيح قراءة معاملات الـ Navigation وحفظ الحالات الخفيفة عبر دالة getStateFlow()، فتستعاد تلقائيًا وبسلاسة بمجرد إعادة تشغيل الشاشة.",
    codeExample: `class DetailViewModel(
    private val savedStateHandle: SavedStateHandle
) : ViewModel() {
    // قراءة معامل مرسل عبر Navigation Component:
    val userId: String = checkNotNull(savedStateHandle["userId"])

    // تحويل القيمة لتدفق متفاعل:
    val query: StateFlow<String> = savedStateHandle.getStateFlow("query", "")

    fun updateQuery(newQuery: String) {
        savedStateHandle["query"] = newQuery
    }
}`,
    commonMistakes: [
      "تخزين كائنات معقدة أو قوائم ضخمة في SavedStateHandle، مما يتجاوز حد الـ 1MB المسموح به لنظام Binder.",
    ],
    followUpQuestions: [
      "ما هو الحد المسموح لحجم البيانات المخزنة في SavedStateHandle وما الاستثناء الذي يطلقه النظام عند تجاوزه؟",
    ],
    sources: [
      {
        title: "Android Developers — Saved State module for ViewModel",
        url: "https://developer.android.com/topic/libraries/architecture/viewmodel/viewmodel-savedstate",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "aarch-005",
    slug: "mvi-vs-mvvm-in-android",
    trackId: "android-native",
    topicIds: ["architecture-components"],
    difficulty: "Mid",
    question: "ما الفرق المعماري بين نمط MVVM ونمط MVI في أندرويد؟",
    shortAnswer: "يعتمد MVVM عادة على عدة تدفقات لحالات مستقلة، بينما يفرض MVI حالة موحدة وحيدة غير قابلة للتعديل (Single Immutable State) مع تدفق صارم للأحداث (Intents) والآثار الجانبية (Side Effects).",
    explanation: "في MVVM التقليدي قد تجد isLoading و users و errorMessage كـ StateFlows منفصلة، مما قد يسبب حالات غير متناسقة أحيانًا. في MVI (Model-View-Intent) تُمثل شاشة العرض كحالة واحدة شاملة عبر data class أو sealed interface، ويتم استقبال رغبات المستخدم كـ Intent والتعبير عن الأحداث الفردية السريعة (مثل التنقل أو عرض Snackbar) كـ Single-event Side Effects.",
    codeExample: `// MVI State
data class ProfileState(
    val isLoading: Boolean = false,
    val profile: Profile? = null,
    val error: String? = null
)

// MVI Intent
sealed interface ProfileIntent {
    data object Load : ProfileIntent
    data class UpdateBio(val newBio: String) : ProfileIntent
}`,
    commonMistakes: [
      "إعادة إرسال نفس الحدث العابر (One-off Event) كإظهار Toast في كل مرة يعاد فيها تكوين الواجهة في MVI لعدم عزله عن State.",
    ],
    followUpQuestions: [
      "كيف يتم التعامل مع One-off Events مثل فتح شاشة أو إظهار Snackbar في MVI بدون إعادة تكرارها عند تدوير الشاشة؟",
    ],
    sources: [
      {
        title: "Android Developers — Architecture guide / UI events",
        url: "https://developer.android.com/topic/architecture/ui-layer/events",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "aarch-006",
    slug: "clean-architecture-layers-in-android",
    trackId: "android-native",
    topicIds: ["architecture-components"],
    difficulty: "Mid",
    question: "ما هي طبقات Clean Architecture الموصى بها في أندرويد وما اتجاه التبعيات بينها؟",
    shortAnswer: "تتكون من: Presentation (UI, ViewModel)، Domain (Use Cases, Models)، و Data (Repositories, Data Sources). تعتمد الطبقات الخارجية على الداخلية ويكون الـ Domain نقيًا ومستقلاً تمامًا.",
    explanation: "تحافظ Clean Architecture على استقلالية منطق العمل (Domain Layer) عن أي إطار عمل خارجي أو مكتبات أندرويد. تطلب Presentation البيانات من الـ Use Cases، وتقوم Use Cases بتنفيذ القواعد وتنسيق البيانات عبر واجهات Repositories (Dependency Inversion). توفر Data Layer التطبيق الفعلي للمستودع عبر مصادر البيانات المحلية (Room) والبعيدة (Retrofit).",
    codeExample: `// Domain Layer (Pure Kotlin):
class GetRecentOrdersUseCase(private val repository: OrderRepository) {
    operator fun invoke(): Flow<List<Order>> = repository.getOrders()
}

// Data Layer (Implements Domain Interface):
class OrderRepositoryImpl(
    private val remoteSource: ApiService,
    private val localSource: OrderDao
) : OrderRepository { ... }`,
    commonMistakes: [
      "إنشاء Use Case لكل دالة في الـ Repository بشكل أعمى بدون وجود منطق عمل حقيقي (Forwarding Use Case)، مما يضيف تعقيدًا غير مبرر.",
      "تسريب كائنات أندرويد (مثل Context أو Intent) إلى داخل كلاسات الـ Domain Layer.",
    ],
    followUpQuestions: [
      "متى تكون طبقة الـ Domain اختيارية ويمكن للـ ViewModel التخاطب مباشرة مع الـ Repository؟",
    ],
    sources: [
      {
        title: "Android Developers — Guide to app architecture",
        url: "https://developer.android.com/topic/architecture",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "aarch-007",
    slug: "repository-pattern-and-single-source-of-truth",
    trackId: "android-native",
    topicIds: ["architecture-components"],
    difficulty: "Mid",
    question: "كيف يحقق نمط المستودع (Repository Pattern) مبدأ المصدر الوحيد للحقيقة (Single Source of Truth)؟",
    shortAnswer: "يخفي تفاصيل جلب وتخزين البيانات ويوجه تدفق القراءة دائمًا من قاعدة البيانات المحلية (الكاش)، بينما تستقبل البيانات الجديدة من الشبكة وتحدث الكاش فقط.",
    explanation: "بدلاً من أن تقرر الواجهة متى تجلب البيانات من الشبكة أو الكاش، يوفر الـ Repository واجهة موحدة. يقوم التطبيق بمراقبة قاعدة البيانات المحلية (مثل Room عبر Flow) كمصدر وحيد للحقيقة؛ وعند استدعاء refresh يقوم الـ Repository بجلب البيانات من الخادم، وتحديث قاعدة البيانات، لتقوم Room تلقائيًا ببث البيانات الجديدة لكل المراقبين.",
    codeExample: `class UserRepository(
    private val userDao: UserDao,
    private val userApi: UserApi
) {
    // الواجهة تراقب الكاش المحلي دائمًا
    val users: Flow<List<User>> = userDao.getAllUsers()

    suspend fun refreshUsers() {
        val remoteUsers = userApi.fetchUsers()
        userDao.insertAll(remoteUsers) // التحديث ينعكس تلقائيًا في users Flow
    }
}`,
    commonMistakes: [
      "إرجاع البيانات من دالة الـ API مباشرة إلى الـ ViewModel وتجاوز قاعدة البيانات المحلية، مما يفقد التطبيق دعمه للعمل دون إنترنت (Offline-first).",
    ],
    followUpQuestions: [
      "كيف توازن بين عرض الكاش القديم فورًا وإشعار المستخدم بوجود تحديث جديد في معمارية Offline-first؟",
    ],
    sources: [
      {
        title: "Android Developers — Architecture guide / Data Layer",
        url: "https://developer.android.com/topic/architecture/data-layer",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "aarch-008",
    slug: "repeatonlifecycle-vs-lifecycle-scope",
    trackId: "android-native",
    topicIds: ["architecture-components"],
    difficulty: "Mid",
    question: "لماذا ينصح باستخدام repeatOnLifecycle بدلاً من إطلاق lifecycleScope.launch المباشر عند جمع تدفقات الـ Flow في الـ UI؟",
    shortAnswer: "لأن repeatOnLifecycle توقف جمع التدفقات تلقائيًا وتلغي الكوروتين عندما تذهب الشاشة للخلفية (مثل onStop) وتعيد إطلاقه عند العودة، لتوفير المعالج والبطارية.",
    explanation: "عند استخدام lifecycleScope.launch العادي، يستمر جمع بيانات الـ Flow حتى يتم تدمير الـ Activity نهائيًا (onDestroy). هذا يعني أن التطبيق في الخلفية سيستمر في معالجة تحديثات الموقع أو الشبكة واستهلاك الذاكرة. تضمن repeatOnLifecycle(Lifecycle.State.STARTED) تجميد وإلغاء الاستهلاك بمجرد أن تصبح الشاشة غير مرئية للمستخدم.",
    codeExample: `viewLifecycleOwner.lifecycleScope.launch {
    viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
        viewModel.articles.collect { articles ->
            adapter.submitList(articles)
        }
    }
}`,
    commonMistakes: [
      "جمع Flow داخل lifecycleScope.launch العادي بدون repeatOnLifecycle وافتراض أنه يتوقف في الخلفية تلقائيًا.",
    ],
    followUpQuestions: [
      "ما المكافئ المباشر لـ repeatOnLifecycle عند استخدام Jetpack Compose؟",
    ],
    sources: [
      {
        title: "Android Developers — RepeatOnLifecycle",
        url: "https://developer.android.com/reference/androidx/lifecycle/RepeatOnLifecycleKt",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "aarch-009",
    slug: "navigation-component-deep-linking-and-backstack",
    trackId: "android-native",
    topicIds: ["architecture-components"],
    difficulty: "Senior",
    question: "كيف يدير Jetpack Navigation الـ Backstack والـ Deep Links المعقدة؟",
    shortAnswer: "ينشئ NavHost مع NavController لتوحيد الانتقالات، ويوفر Safe Args لتمرير المعاملات بأمان، ويبني مسار العودة الصحيح (Synthetic Backstack) تلقائيًا عند الدخول عبر Deep Link.",
    explanation: "يضمن Navigation Component التماسك التام لزر الرجوع (Up/Back Button). عند وصول المستخدم عبر رابط خارجي (Deep Link) لصفحة عميقة (مثل تفاصيل طلب معين)، يقوم المكون بإنشاء تسلسل الأنشطة والشاشات السابقة منطقيًا في الـ Backstack، بحيث إذا ضغط المستخدم رجوعًا فإنه يعود للصفحة الرئيسية للتطبيق بدلاً من إغلاقه مباشرة.",
    codeExample: `<!-- تعريف Deep Link في nav_graph.xml -->
<fragment
    android:id="@+id/orderDetailFragment"
    android:name="com.example.OrderDetailFragment">
    <deepLink app:uri="myapp://orders/{orderId}" />
    <argument
        android:name="orderId"
        app:argType="string" />
</fragment>`,
    commonMistakes: [
      "تمرير كائنات ضخمة بين الشاشات عبر Navigation Args بدلاً من تمرير الـ ID فقط وجلب البيانات من الـ Repository.",
      "كسر الـ Backstack الافتراضي باستخدام popUpTo بطريقة غير محسوبة تحذف شاشات أساسية.",
    ],
    followUpQuestions: [
      "كيف تختلف مكتبة Navigation Compose في إعلان الشاشات والـ Deep Links مقارنة بـ XML NavGraph التقليدي؟",
    ],
    sources: [
      {
        title: "Android Developers — Principles of navigation",
        url: "https://developer.android.com/guide/navigation/principles",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "aarch-010",
    slug: "paging-3-library-architecture",
    trackId: "android-native",
    topicIds: ["architecture-components"],
    difficulty: "Senior",
    question: "ما هي المكونات المعمارية لمكتبة Paging 3 وكيف تدير التخزين المؤقت المتقدم؟",
    shortAnswer: "تتكون من PagingSource لتحميل البيانات، و Pager لإنشاء التدفق، و RemoteMediator للدمج بين الكاش المحلي والشبكة، وتدفق PagingData لربطها بالواجهة.",
    explanation: "تعتبر Paging 3 متوافقة أصليًا مع Coroutines و Flow. يتولى RemoteMediator اكتشاف وصول المستخدم لنهاية البيانات المخزنة محليًا (Boundary Callback)، فيطلب الصفحة التالية من الـ API ويحفظها في قاعدة بيانات Room. تعمل Room بعد ذلك كـ PagingSource المستمر، مما يتيح التمرير اللانهائي واستعادة موضع القائمة بعد إغلاق التطبيق.",
    codeExample: `class PostRemoteMediator(
    private val database: AppDatabase,
    private val networkApi: NetworkApi
) : RemoteMediator<Int, PostEntity>() {
    override suspend fun load(
        loadType: LoadType,
        state: PagingState<Int, PostEntity>
    ): MediatorResult {
        // حساب مفتاح الصفحة وجلب البيانات وتخزينها في Room داخل Transaction
        return MediatorResult.Success(endOfPaginationReached = ...)
    }
}`,
    commonMistakes: [
      "إجراء عمليات تحويل أو تصفية (filter/map) على تدفق PagingData بعد وصوله للـ UI بدلاً من تنفيذها في الـ ViewModel عبر cachedIn(viewModelScope).",
    ],
    followUpQuestions: [
      "لماذا يجب استدعاء .cachedIn(viewModelScope) مع Paging 3 وماذا يحدث إذا أهملتها؟",
    ],
    sources: [
      {
        title: "Android Developers — Paging 3 library overview",
        url: "https://developer.android.com/topic/libraries/architecture/paging/v3-overview",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
];
