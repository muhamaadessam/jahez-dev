import type { InterviewQuestion } from "../questions.ts";

export const networkingStorageQuestions: Omit<InterviewQuestion, "translations">[] = [
  // networking-android (6 questions)
  {
    id: "anet-001",
    slug: "retrofit-architecture-and-converters",
    trackId: "android-native",
    topicIds: ["networking-android"],
    difficulty: "Junior",
    question: "كيف تعمل مكتبة Retrofit وما دور Converter.Factory و CallAdapter.Factory؟",
    shortAnswer: "تحول واجهات الـ Java/Kotlin Interface إلى طلبات HTTP عبر الـ Dynamic Proxies؛ يتولى Converter تحويل JSON لكائنات، بينما يحول CallAdapter الـ Call إلى Coroutines Suspend أو RxJava.",
    explanation: "تستخدم Retrofit مكتبة OkHttp كعميل شبكة داخلي. عند استدعاء دالة الـ API، تقوم الـ Converter.Factory (مثل Moshi أو Kotlinx.Serialization) بتحويل جسم الطلب والاستجابة من وإلى نصوص JSON. أما CallAdapter.Factory فيسمح للدالة بإرجاع أنواع مخصصة مثل Response<T> أو العمل مباشرة مع Coroutines عبر الكلمة المفتاحية suspend.",
    codeExample: `interface UserApiService {
    @GET("users/{id}")
    suspend fun getUser(@Path("id") userId: String): UserDto
}

val retrofit = Retrofit.Builder()
    .baseUrl("https://api.example.com/")
    .addConverterFactory(Json.asConverterFactory("application/json".toMediaType()))
    .build()`,
    commonMistakes: [
      "نسيان إضافة شرطة مائلة (/) في نهاية baseUrl مما يؤدي لخطأ IllegalArgumentException عند إنشاء Retrofit.",
      "تنفيذ استدعاءات الـ API القديمة المتزامنة (call.execute()) على الـ Main Thread مما يسبب NetworkOnMainThreadException.",
    ],
    followUpQuestions: [
      "كيف تترجم Retrofit دوال الـ suspend داخليًا دون الحاجة لـ CallAdapter خارجي؟",
    ],
    sources: [
      {
        title: "Android Developers — Connect to the network",
        url: "https://developer.android.com/training/basics/network-ops/connecting",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "anet-002",
    slug: "okhttp-interceptors-application-vs-network",
    trackId: "android-native",
    topicIds: ["networking-android"],
    difficulty: "Junior",
    question: "ما الفرق بين Application Interceptor و Network Interceptor في مكتبة OkHttp؟",
    shortAnswer: "Application Interceptor يُستدعى مرة واحدة فقط لكل طلب من التطبيق دون النظر لإعادة المحاولة أو الكاش؛ بينما Network Interceptor يراقب حركة الشبكة الحقيقية عبر السلك (Over-the-wire).",
    explanation: "يُوضع Application Interceptor في أعلى السلسلة، وهو مثالي لإضافة Headers ثابتة مثل Authorization Bearer Token أو قياس زمن المعالجة الإجمالي. أما Network Interceptor فيوضع بالقرب من السلك الفعلي، ويستدعى مع كل إعادة توجيه (Redirect) أو محاولة اتصال جديدة، ولا يُستدعى إطلاقًا إذا تم تلبية الطلب من الـ Cache المحلي دون اتصال بالشبكة.",
    codeExample: `val okHttpClient = OkHttpClient.Builder()
    // 1. Application Interceptor: إضافة مفتاح الدخول
    .addInterceptor { chain ->
        val request = chain.request().newBuilder()
            .addHeader("Authorization", "Bearer \$token")
            .build()
        chain.proceed(request)
    }
    // 2. Network Interceptor: مراقبة الـ Headers الحقيقية وسرعة النقل
    .addNetworkInterceptor(HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.HEADERS
    })
    .build()`,
    commonMistakes: [
      "محاولة إضافة Headers لتخطي الكاش في Network Interceptor وتوقع عملها محليًا قبل استشارة السلك.",
    ],
    followUpQuestions: [
      "ما هو دور Authenticator في OkHttp لإعادة تجديد التوكن (Token Refresh) تلقائيًا عند استقبال 401 Unauthorized؟",
    ],
    sources: [
      {
        title: "Android Developers — Perform network operations",
        url: "https://developer.android.com/training/basics/network-ops",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "anet-003",
    slug: "json-parsing-moshi-vs-kotlinx-serialization",
    trackId: "android-native",
    topicIds: ["networking-android"],
    difficulty: "Mid",
    question: "لماذا يفضل استخدام Moshi أو Kotlinx Serialization بدلاً من Gson في كود Kotlin الحديث؟",
    shortAnswer: "لأنهما يدعمان نظام Null Safety في Kotlin بشكل أصيل ولا يتجاوزان القيم الافتراضية للخصائص كما يفعل Gson باستخدام الـ Reflection غير الآمن.",
    explanation: "يقوم Gson بإنشاء الكائنات باستخدام Unsafe Allocator دون استدعاء الـ Constructors، مما قد يؤدي لإسناد قيمة null لخاصية معلنة كـ Non-Nullable String في Kotlin، مسببًا NullPointerException مفاجئًا لاحقًا. يوفر Moshi و Kotlinx.Serialization توليد كود سريع وقت الترجمة (Code Generation) وفحصًا صارمًا للأنواع والقيم الافتراضية.",
    codeExample: `@Serializable // Kotlinx Serialization وقت الترجمة بدون انعكاس بطيء
data class UserDto(
    val id: Long,
    val username: String,
    val bio: String = "لا توجد نبذة" // تحافظ على القيمة الافتراضية بأمان
)`,
    commonMistakes: [
      "الاعتماد على Gson مع كائنات Kotlin Data Class وتوقع رمي استثناء عند استقبال حقول فارغة مخالفة للـ Non-Null contract.",
    ],
    followUpQuestions: [
      "كيف تختلف Kotlinx Serialization في دعم مشاركة الكود مع Kotlin Multiplatform (KMP)؟",
    ],
    sources: [
      {
        title: "Kotlin Docs — Kotlinx serialization guide",
        url: "https://kotlinlang.org/docs/serialization.html",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "anet-004",
    slug: "network-error-handling-and-result-pattern",
    trackId: "android-native",
    topicIds: ["networking-android"],
    difficulty: "Mid",
    question: "كيف تطبق نمط Result لتغليف استجابات الشبكة وأخطائها بأمان؟",
    shortAnswer: "باستخدام Sealed Interface أو Result<T> يمثل النجاح مع البيانات أو الفشل مع نوع الخطأ، مما يجبر المستهلك على معالجة كل السيناريوهات.",
    explanation: "بدلاً من ترك استثناءات IOException و HttpException ترمى عشوائيًا وتصل للواجهة، يغلف الـ Repository استدعاءات الشبكة داخل كتلة آمنة. هذا يحول أخطاء الشبكة الشائعة (مثل عدم توفر إنترنت، انتهاء المهلة، أو خطأ 404/500) إلى حالات واضحة تترجمها الواجهة إلى رسائل مفهومة للمستخدم دون انهيار التطبيق.",
    codeExample: `sealed interface NetworkResult<out T> {
    data class Success<T>(val data: T) : NetworkResult<T>
    data class Error(val code: Int, val message: String?) : NetworkResult<Nothing>
    data class Exception(val throwable: Throwable) : NetworkResult<Nothing>
}

suspend fun safeApiCall(apiCall: suspend () -> T): NetworkResult<T> {
    return try {
        NetworkResult.Success(apiCall())
    } catch (e: HttpException) {
        NetworkResult.Error(e.code(), e.message())
    } catch (e: IOException) {
        NetworkResult.Exception(e)
    }
}`,
    commonMistakes: [
      "التقاط Throwable بشكل أعمى بدون تمييز CancellationException، مما يمنع إلغاء الكوروتين عند مغادرة الشاشة.",
    ],
    followUpQuestions: [
      "لماذا يجب عدم ابتلاع CancellationException داخل دوال الـ safeApiCall؟",
    ],
    sources: [
      {
        title: "Android Developers — Loading data and error handling",
        url: "https://developer.android.com/topic/architecture/data-layer#handling-errors",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "anet-005",
    slug: "ssl-pinning-in-android",
    trackId: "android-native",
    topicIds: ["networking-android"],
    difficulty: "Senior",
    question: "ما هو الـ SSL/Certificate Pinning وكيف يتم تنفيذه لحماية التطبيق من هجمات MITM؟",
    shortAnswer: "هو تقييد الاتصال بالخادم بشهادة أمان أو بصمة مفتاح عام (Public Key Hash) محددة مسبقًا داخل التطبيق بدلاً من الثقة في كل الشهادات الموثقة بالنظام.",
    explanation: "يحمي تثبيت الشهادات التطبيق من هجمات Man-in-the-Middle (MITM) حتى لو قام المهاجم بتثبيت شهادة جذرية خبيثة (Root CA) على جهاز المستخدم. يتم ضبطه في OkHttp باستخدام CertificatePinner أو في ملف Network Security Config. يجب دائمًا تضمين بصمة لمفتاح بديل (Backup Pin) لتفادي توقف التطبيق عند تجديد شهادات السيرفر.",
    codeExample: `val certificatePinner = CertificatePinner.Builder()
    .add("api.example.com", "sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=")
    .add("api.example.com", "sha256/BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB=") // Backup pin
    .build()

val client = OkHttpClient.Builder()
    .certificatePinner(certificatePinner)
    .build()`,
    commonMistakes: [
      "تثبيت بصمة شهادة واحدة فقط بدون مفتاح احتياطي (Backup Pin)، مما يعطل التطبيق تمامًا فور انتهاء صلاحية شهادة الخادم.",
      "تثبيت الشهادة بالكامل بدلاً من تثبيت المفتاح العام (SPKI Pinning) الذي يبقى ثابتًا حتى عند تجديد الشهادة بنفس المفاتيح.",
    ],
    followUpQuestions: [
      "كيف تنفذ تثبيت الشهادات عبر ملف res/xml/network_security_config.xml بدلاً من كود OkHttp؟",
    ],
    sources: [
      {
        title: "Android Developers — Network security configuration",
        url: "https://developer.android.com/privacy-and-security/security-config",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "anet-006",
    slug: "http-caching-and-etag-support",
    trackId: "android-native",
    topicIds: ["networking-android"],
    difficulty: "Senior",
    question: "كيف تدير التخزين المؤقت للشبكة (HTTP Caching) ودعم ETag في أندرويد؟",
    shortAnswer: "بتهيئة كائن okhttp3.Cache مع مسار وحجم محدد، لتقوم OkHttp تلقائيًا بإرسال If-None-Match واستقبال 304 Not Modified دون إعادة تنزيل البيانات.",
    explanation: "يحترم OkHttp ترويسات Cache-Control القادمة من السيرفر. عند استقبال ETag، يرسل العميل هذا المعرف في الطلبات اللاحقة؛ إذا لم تتغير البيانات، يعيد السيرفر كود 304 مع حمولة فارغة، فتقرأ OkHttp البيانات فورًا من القرص المحلي، مما يوفر استهلاك باقة البيانات وطاقة البطارية وزمن الاستجابة.",
    codeExample: `val cacheSize = 10L * 1024 * 1024 // 10 MB
val httpCache = Cache(File(context.cacheDir, "http_cache"), cacheSize)

val client = OkHttpClient.Builder()
    .cache(httpCache)
    .build()`,
    commonMistakes: [
      "وضع ملفات الـ HTTP Cache في مسار التخزين الداخلي الدائم بدلاً من context.cacheDir الذي يحرره النظام عند امتلاء الذاكرة.",
    ],
    followUpQuestions: [
      "كيف تجبر OkHttp على جلب البيانات من الكاش فقط عند انقطاع الإنترنت عبر Force-Cache؟",
    ],
    sources: [
      {
        title: "Android Developers — Optimize network data usage",
        url: "https://developer.android.com/topic/performance/network-overview",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },

  // local-storage-android (6 questions)
  {
    id: "astor-001",
    slug: "room-architecture-entity-dao-database",
    trackId: "android-native",
    topicIds: ["local-storage-android"],
    difficulty: "Junior",
    question: "ما هي المكونات الثلاثة الأساسية لمكتبة Room وما دور كل منها؟",
    shortAnswer: "Entity لتمثيل جداول قاعدة البيانات وأعمدتها، و DAO لتعريف عمليات الاستعلام والإدخال، و RoomDatabase كنقطة الوصول المركزية للاتصال.",
    explanation: "توفر Room طبقة تجريد قوية فوق SQLite مع فحص استعلامات SQL وقت الترجمة (Compile-time Verification). الـ Entity عبارة عن data class موسومة بـ @Entity. الـ DAO عبارة عن interface يحتوي دوال الإدخال والتعديل والاستعلام مع دعم أصيل لـ Coroutines Flow. أما الـ RoomDatabase فيجمع الجداول ويدير فتح الاتصال وتحديث النسخ.",
    codeExample: `@Entity(tableName = "notes")
data class NoteEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val title: String,
    val content: String
)

@Dao
interface NoteDao {
    @Query("SELECT * FROM notes ORDER BY id DESC")
    fun getAllNotes(): Flow<List<NoteEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(note: NoteEntity)
}`,
    commonMistakes: [
      "تنفيذ استعلامات Room المتزامنة على الـ Main Thread مما يسبب كراش فوري (IllegalStateException).",
      "إنشاء أكثر من نسخة من RoomDatabase بدلاً من استخدام نمط الـ Singleton لحقن نسخة وحيدة.",
    ],
    followUpQuestions: [
      "ما الفائدة من إرجاع Flow<List<T>> من دالة الـ DAO بدلاً من List<T> عادية؟",
    ],
    sources: [
      {
        title: "Android Developers — Save data in a local database using Room",
        url: "https://developer.android.com/training/data-storage/room",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "astor-002",
    slug: "datastore-vs-sharedpreferences",
    trackId: "android-native",
    topicIds: ["local-storage-android"],
    difficulty: "Junior",
    question: "لماذا ينصح بالانتقال من SharedPreferences إلى Jetpack DataStore؟",
    shortAnswer: "لأن DataStore آمن تمامًا للـ Threads، ويعتمد على Kotlin Coroutines و Flow، ويتعامل مع الأخطاء بأمان دون حجب الـ UI أو التسبب في أخطاء ANR.",
    explanation: "كانت SharedPreferences تعتمد على عمليات قراءة وكتابة قد تحجب الـ UI Thread (عبر apply أو commit المتزامن) مما يسبب ANR، بالإضافة لعدم وجود آلية موحدة للإبلاغ عن أخطاء الكتابة على القرص. يوفر DataStore معالجة غير متزامنة بالكامل تضمن التماسك الذري للبيانات ويدعم نمطين: Preferences DataStore و Proto DataStore.",
    codeExample: `// قراءة تدفق الإعدادات بأمان:
val IS_DARK_MODE = booleanPreferencesKey("is_dark_mode")

val isDarkModeFlow: Flow<Boolean> = context.dataStore.data
    .map { preferences -> preferences[IS_DARK_MODE] ?: false }

// حفظ الإعداد بشكل غير متزامن:
suspend fun setDarkMode(enabled: Boolean) {
    context.dataStore.edit { preferences ->
        preferences[IS_DARK_MODE] = enabled
    }
}`,
    commonMistakes: [
      "محاولة قراءة قيمة DataStore بطريقة متزامنة بحجب الخيط (runBlocking) مما يعيد إنتاج نفس مشاكل SharedPreferences.",
    ],
    followUpQuestions: [
      "كيف تهاجر البيانات الحالية المخزنة في SharedPreferences إلى DataStore تلقائيًا؟",
    ],
    sources: [
      {
        title: "Android Developers — DataStore overview",
        url: "https://developer.android.com/topic/libraries/architecture/datastore",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "astor-003",
    slug: "room-type-converters",
    trackId: "android-native",
    topicIds: ["local-storage-android"],
    difficulty: "Mid",
    question: "كيف تخزن أنواع بيانات مخصصة (كالتاريخ أو القوائم) في Room باستخدام TypeConverters؟",
    shortAnswer: "بتعريف دوال تحمل وسم @TypeConverter لتحويل النوع المخصص إلى نوع بدائي تفهمه SQLite (كالنص أو الرقم) وعكسه عند القراءة.",
    explanation: "تدعم SQLite أنواعًا محدودة (NULL, INTEGER, REAL, TEXT, BLOB). إذا كان لديك حقل من نوع Date أو List<String> في الـ Entity، تقوم بإنشاء كلاس وسيط يحول التاريخ إلى Long (Timestamp) وبالعكس، أو يحول القائمة إلى نص JSON، ثم تسجل الكلاس في الـ Database عبر @TypeConverters.",
    codeExample: `class Converters {
    @TypeConverter
    fun fromTimestamp(value: Long?): Date? = value?.let { Date(it) }

    @TypeConverter
    fun dateToTimestamp(date: Date?): Long? = date?.time
}

@Database(entities = [Note::class], version = 1)
@TypeConverters(Converters::class)
abstract class AppDatabase : RoomDatabase()`,
    commonMistakes: [
      "استخدام TypeConverter لتحويل كائنات كاملة مرتبطة بعلاقات One-to-Many بدلاً من إنشاء جداول وعلاقات أصلية في قاعدة البيانات.",
    ],
    followUpQuestions: [
      "أين يمكن وضع وسم @TypeConverters: هل في قاعدة البيانات فقط أم في كلاس الـ Entity أو الـ DAO؟",
    ],
    sources: [
      {
        title: "Android Developers — Use type converters in Room",
        url: "https://developer.android.com/training/data-storage/room/referencing-data",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "astor-004",
    slug: "room-database-migrations-automated-vs-manual",
    trackId: "android-native",
    topicIds: ["local-storage-android"],
    difficulty: "Mid",
    question: "كيف تتعامل مع ترقية مخطط قاعدة البيانات (Room Database Migrations) دون فقد بيانات المستخدم؟",
    shortAnswer: "بزيادة رقم الـ version وكتابة كائن Migration ينفذ أوامر ALTER TABLE المناسبة، أو الاعتماد على AutoMigration إذا كان التعديل بسيطًا.",
    explanation: "إذا عدلت Entity دون كتابة Migration وزادت النسخة، سينهار التطبيق مع IllegalStateException. يتيح Room كتابة Manual Migration بتنفيذ استعلامات SQL دقيقة، كما يوفر AutoMigration تلقائيًا بدءًا من Room 2.4 للعمليات الشائعة كإضافة أعمدة جديدة أو جداول مع التحقق التام وقت الترجمة عبر ملفات الـ schema export.",
    codeExample: `val MIGRATION_1_2 = object : Migration(1, 2) {
    override fun migrate(database: SupportSQLiteDatabase) {
        database.execSQL("ALTER TABLE notes ADD COLUMN is_pinned INTEGER NOT NULL DEFAULT 0")
    }
}

Room.databaseBuilder(context, AppDatabase::class.java, "notes.db")
    .addMigrations(MIGRATION_1_2)
    .build()`,
    commonMistakes: [
      "استخدام fallbackToDestructiveMigration() في كود الإنتاج (Production)، مما يمسح قاعدة بيانات المستخدم بالكامل عند كل تعديل.",
      "نسيان إضافة exportSchema = true في كلاس قاعدة البيانات لاختبار ومراقبة الـ Migrations.",
    ],
    followUpQuestions: [
      "كيف تختبر صحة الـ Migrations آليًا باستخدام MigrationTestHelper؟",
    ],
    sources: [
      {
        title: "Android Developers — Migrate Room databases",
        url: "https://developer.android.com/training/data-storage/room/migrating-db-versions",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "astor-005",
    slug: "room-relationships-embedded-and-relation",
    trackId: "android-native",
    topicIds: ["local-storage-android"],
    difficulty: "Mid",
    question: "كيف تصمم العلاقات بين الجداول (One-to-Many و Many-to-Many) في Room؟",
    shortAnswer: "باستخدام كائنات البيانات الوسيطة مع وسمي @Embedded و @Relation لتحديد المفتاح الأجنبي والمفتاح الرئيسي دون تعقيد الاستعلامات يدويًا.",
    explanation: "لا تدعم Room العلاقات المباشرة عبر المراجع كما في الـ ORM التقليدي لتفادي التحميل الكسول البطيء (Lazy Loading) على الـ UI Thread. بدلاً من ذلك، تصمم data class خاصة تضم الكائن الرئيسي مع وسم @Embedded، وقائمة الكائنات التابعة مع وسم @Relation يحدد parentColumn و entityColumn، وتتولى Room تنفيذ الاستعلامات وربطها تلقائيًا داخل @Transaction.",
    codeExample: `data class UserWithPlaylists(
    @Embedded val user: UserEntity,
    @Relation(
        parentColumn = "userId",
        entityColumn = "creatorId"
    )
    val playlists: List<PlaylistEntity>
)

@Transaction
@Query("SELECT * FROM users WHERE userId = :id")
suspend fun getUserWithPlaylists(id: Long): UserWithPlaylists`,
    commonMistakes: [
      "نسيان إضافة وسم @Transaction في دالة الـ DAO التي تسترجع كائنًا يحتوي على @Relation، مما قد يسبب قراءة غير متناسقة للبيانات.",
    ],
    followUpQuestions: [
      "كيف يتم تصميم علاقة Many-to-Many باستخدام وسم @Junction في Room؟",
    ],
    sources: [
      {
        title: "Android Developers — Define relationships between objects in Room",
        url: "https://developer.android.com/training/data-storage/room/relationships",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
  {
    id: "astor-006",
    slug: "proto-datastore-vs-preferences-datastore",
    trackId: "android-native",
    topicIds: ["local-storage-android"],
    difficulty: "Senior",
    question: "ما الفرق بين Preferences DataStore و Proto DataStore ومتى تختار Proto DataStore؟",
    shortAnswer: "Preferences DataStore يخزن أزواج مفتاح-قيمة بدون Schema محددة مسبقًا؛ بينما Proto DataStore يخزن كائنات مخصصة بأنواع بيانات صارمة وآمنة باستخدام Protocol Buffers.",
    explanation: "في Preferences DataStore لا يوجد ضمان لسلامة نوع البيانات المرجوعة لكل مفتاح، وقد تقع أخطاء وقت التشغيل عند تغيير النوع. في المقابل، يحدد Proto DataStore هيكل البيانات بدقة في ملف .proto، ويقوم المترجم بتوليد كلاسات مهيكلة وصغيرة الحجم وسريعة جدًا في فك التشفير، مما يجعله الخيار الأمثل للإعدادات المعقدة والحساسة للأنواع.",
    codeExample: `// 1. ملف user_prefs.proto:
// message UserPreferences {
//     bool show_completed = 1;
// }

// 2. القراءة في Kotlin بنوع صارم تمامًا:
val showCompletedFlow: Flow<Boolean> = context.userPreferencesStore.data
    .map { preferences -> preferences.showCompleted }`,
    commonMistakes: [
      "استخدام Proto DataStore للإعدادات البسيطة جدًا المكونة من مفتاحين أو ثلاثة، حيث يضيف Protocol Buffers عبء إعداد وبناء غير ضروري.",
    ],
    followUpQuestions: [
      "ما هي آلية الـ Serializer المطلوبة لتهيئة وتشفير كائنات Proto DataStore؟",
    ],
    sources: [
      {
        title: "Android Developers — Working with Proto DataStore",
        url: "https://developer.android.com/topic/libraries/architecture/datastore#proto-datastore",
      },
    ],
    lastReviewedAt: "2026-09-01",
  },
];
