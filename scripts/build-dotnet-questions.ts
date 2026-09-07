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

// 10 topics x 10 questions = 100 questions for .NET / C#
const rawQuestions: RawQuestion[] = [
  // Topic: dotnet-csharp (10 questions: ncsharp-001 to ncsharp-010)
  {
    id: "ncsharp-001",
    slug: "csharp-value-types-vs-reference-types",
    topicId: "dotnet-csharp",
    difficulty: "Junior",
    question: "ما الفرق الأساسي بين Value Types و Reference Types في لغة C# وكيف تخزن في الذاكرة؟",
    shortAnswer: "الـ Value Types ترث من System.ValueType وتخزن قيمتها مباشرة (غالباً في الـ Stack أو داخل الكائن الحاوي)، بينما الـ Reference Types ترث من System.Object وتخزن مراجعها في الـ Stack وتشير لبيانات في الـ Managed Heap.",
    explanation: "تشمل أنواع القيمة (structs والـ primitives والـ enums) وتتميز بالنسخ بالقيمة عند التمرير. أما أنواع المرجع (classes والـ interfaces والـ strings والـ arrays) فتمرر كمراجع تشير لنفس المساحة في الـ Managed Heap، ويدير الـ Garbage Collector استرجاعها.",
    codeExample: `// Value type
int a = 10;
int b = a; // نسخ القيمة
b = 20; // a تظل 10

// Reference type
var user1 = new User { Name = "Ali" };
var user2 = user1; // نسخ المرجع
user2.Name = "Zaid"; // user1.Name يتغير لـ Zaid`,
    commonMistakes: ["الاعتقاد بأن كل الـ Value Types تخزن حصراً في الـ Stack دائماً؛ إذا كانت الخاصية داخل كائن class، فإنها تخزن في الـ Heap كجزء منه."],
    followUpQuestions: ["ما هي ظاهرة الـ Boxing والـ Unboxing وما هو أثرها على الأداء والذاكرة؟"],
    sources: [{ title: "Microsoft Learn — Value types and Reference types", url: "https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/value-types" }],
  },
  {
    id: "ncsharp-002",
    slug: "csharp-boxing-and-unboxing-performance",
    topicId: "dotnet-csharp",
    difficulty: "Mid",
    question: "ما هي عمليتا Boxing و Unboxing في C# ولماذا يجب تجنبهما في المسارات البرمجية عالية الكثافة؟",
    shortAnswer: "Boxing هو تحويل Value Type إلى كائن object في الـ Heap مع حجز ذاكرة إضافي، وUnboxing هو استخراج القيمة الأصلية؛ وتكرارهما يرهق الـ Garbage Collector ويبطئ الأداء.",
    explanation: "عند إسناد قيمة بدائية مثل int إلى متغير من نوع object أو واجهة interface، يضطر الـ CLR لتخصيص كائن جديد في الـ Heap ونسخ القيمة بداخله (Boxing). وعند استرجاعها كـ (int)obj، يتم فحص النوع ونسخ القيمة مجدداً (Unboxing). استخدام الـ Generics (مثل List<int> بدلاً من ArrayList القديمة) يقضي تماماً على هذه التكلفة.",
    codeExample: `int val = 42;
object boxed = val; // Boxing: حجز كائن جديد في الـ Heap
int unboxed = (int)boxed; // Unboxing: فحص النوع واستخراج القيمة`,
    commonMistakes: ["استخدام واجهات غير عامة مثل IList غير الجنيس مع آلاف القيم الرقمية مما يولد ملايين عمليات الـ Boxing غير الضرورية."],
    followUpQuestions: ["كيف يساعد نمط Generic Constraints (where T : struct) في منع الـ Boxing أثناء معالجة الأنواع البدائية؟"],
    sources: [{ title: "Microsoft Learn — Boxing and Unboxing", url: "https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/types/boxing-and-unboxing" }],
  },
  {
    id: "ncsharp-003",
    slug: "csharp-records-vs-classes-and-immutability",
    topicId: "dotnet-csharp",
    difficulty: "Junior",
    question: "ما الفرق بين Record و Class في C# الحديثة ومتى تفضل استخدام Records؟",
    shortAnswer: "الـ Records مصممة لكائنات القيمة غير القابلة للتعديل (Immutability) وتوفر مقارنة تلقائية استناداً للقيم (Value-based equality) مع دعم تعبير with للنسخ غير التدميري.",
    explanation: "تعتمد الـ Classes العادية على المقارنة المرجعية (Reference Equality)؛ حيث يختلف كائنان حتى لو تطابقت كل خصائصهما. في المقابل، تقوم الـ Records بمقارنة القيم تلقائياً وتولد دوال Equals و GetHashCode ومطبوعات ToString منسقة. كما تتيح الـ Positional Records تعريفا موجزاً بسطر واحد public record UserDto(int Id, string Name); مع خصائص init-only افتراضياً.",
    codeExample: `public record Point(int X, int Y);
var p1 = new Point(1, 2);
var p2 = new Point(1, 2);
Console.WriteLine(p1 == p2); // True (مقارنة بالقيم)

var p3 = p1 with { Y = 5 }; // نسخ غير تدميري`,
    commonMistakes: ["استخدام Classes عادية لتمثيل DTOs وكائنات القيمة في DDD مع الاضطرار لكتابة دالات Equals و GetHashCode يدوياً."],
    followUpQuestions: ["ما الفرق بين record class و record struct في C# 10+؟"],
    sources: [{ title: "Microsoft Learn — Records (C# reference)", url: "https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/records" }],
  },
  {
    id: "ncsharp-004",
    slug: "csharp-nullable-reference-types-and-flow-analysis",
    topicId: "dotnet-csharp",
    difficulty: "Junior",
    question: "كيف تعمل ميزة Nullable Reference Types في C# وما دور التحليل الثابت لمسار الكود (Flow Analysis)؟",
    shortAnswer: "تميز المراجع التي تقبل null (مثل string?) عن التي لا تقبله (string)، ويقوم المترجم بالتحليل الثابت لتحذيرك قبل الوقوع في NullReferenceException وقت التشغيل.",
    explanation: "منذ C# 8، أصبح بإمكان المطورين تفعيل <Nullable>enable</Nullable>. في هذا الوضع، يفترض المترجم أن كل مراجع الكائنات غير قابلة للقيم الفارغة ما لم تُحدد بعلامة الاستفهام صراحة. يقوم المحرك بتحليل مسار الكود (Static Flow Analysis)؛ فإذا قمت بفحص if (user != null)، يدرك المترجم داخل الكتلة أن المتغير آمن ويسمح باستدعاء خصائصه دون تحذيرات.",
    codeExample: `string nonNull = "Hello"; // لا يقبل null
string? canBeNull = null; // مسموح

// Console.WriteLine(canBeNull.Length); // تحذير من المترجم!
if (canBeNull != null) {
    Console.WriteLine(canBeNull.Length); // آمن بعد فحص التدفق
}`,
    commonMistakes: ["استخدام عامل القمع القسري (Null-forgiving operator !) مثل user!.Name لتجاوز تحذير المترجم دون فحص حقيقي مما يسبب انهيار وقت التشغيل."],
    followUpQuestions: ["ما هو دور سمات الفحص المتقدمة مثل [NotNullWhen(true)] في دوال TryParse؟"],
    sources: [{ title: "Microsoft Learn — Nullable reference types", url: "https://learn.microsoft.com/en-us/dotnet/csharp/nullable-references" }],
  },
  {
    id: "ncsharp-005",
    slug: "csharp-pattern-matching-and-switch-expressions",
    topicId: "dotnet-csharp",
    difficulty: "Mid",
    question: "كيف تطورت ميزة Pattern Matching وتعبيرات switch في C# الحديثة؟",
    shortAnswer: "أصبحت تدعم أنماط الخصائص (Property Patterns)، والأنماط الموضعية (Positional)، والأنماط العلائقية (Relational)، والـ List Patterns لصياغة شروط معقدة بسلاسة وأمان.",
    explanation: "تعبيرات switch الحديثة تسمح بفحص أنواع وهياكل الكائنات بدقة مذهلة. يمكنك فحص نطاقات الأرقام (>= 10 and <= 50)، أو فحص خصائص متداخلة دون استخراجها يدوياً (Order { Customer.IsVip: true, Total: > 100 })، وتضمن التحقق الشامل (Exhaustiveness checking) حيث ينبهك المترجم إذا لم تغطِ جميع الاحتمالات الممكنة.",
    codeExample: `public static decimal GetDiscount(Customer customer) => customer switch {
    { IsVip: true, TotalOrders: > 10 } => 0.20m,
    { IsVip: true } => 0.10m,
    { TotalOrders: > 5 } => 0.05m,
    _ => 0.00m
};`,
    commonMistakes: ["نسيان الحالة الافتراضية _ (Discard) في تعبير switch مما يرمي SwitchExpressionException وقت التشغيل عند وصول قيمة غير متوقعة."],
    followUpQuestions: ["كيف تستخدم List Patterns المضافة في C# 11 لمطابقة مصفوفات البيانات مثل [var first, .., var last]؟"],
    sources: [{ title: "Microsoft Learn — Pattern matching overview", url: "https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/functional/pattern-matching" }],
  },
  {
    id: "ncsharp-006",
    slug: "csharp-delegates-func-action-and-events",
    topicId: "dotnet-csharp",
    difficulty: "Junior",
    question: "ما الفرق بين Delegate و Action و Func وما دور كلمة event في حماية التغليف؟",
    shortAnswer: "الـ Delegate هو مؤشر دالة آمن للأنواع؛ Func تعيد قيمة وAction لا تعيد شيئاً، وكلمة event تمنع المشتركين الخارجيين من استدعاء أو مسح قائمة المستمعين باستثناء += و -=.",
    explanation: "الـ Delegate هو نوع يمثل توقيع دالة. بدلاً من تعريف delegate مخصص لكل حالة، وفرت مايكروسوفت Func<T, TResult> للدوال ذات المخرجات، و Action<T> للدوال void. استخدام كلمة event مع الـ delegate يضيف حماية للمغلف (Encapsulation)؛ بحيث لا يستطيع كود خارج الفئة إطلاق الحدث مباشرة (invoke) أو مسح مستمعي الآخرين عبر = null، ويقتصر على الاشتراك += وإلغاء الاشتراك -=.",
    codeExample: `public class OrderProcessor {
    public event Action<Order>? OrderCompleted;
    public void Process(Order order) {
        OrderCompleted?.Invoke(order); // يطلق من داخل الفئة فقط
    }
}`,
    commonMistakes: ["عدم إلغاء الاشتراك من الأحداث (-=) في الكائنات طويلة العمر مما يمنع الـ Garbage Collector من تحرير الكائنات المستمعة ويسبب تسريب ذاكرة."],
    followUpQuestions: ["كيف يساعد نمط WeakEventManager في منع تسريبات الذاكرة عند الاشتراك في الأحداث؟"],
    sources: [{ title: "Microsoft Learn — Events overview", url: "https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/events/" }],
  },
  {
    id: "ncsharp-007",
    slug: "csharp-span-and-memory-allocation-free",
    topicId: "dotnet-csharp",
    difficulty: "Senior",
    question: "ما هي بنية Span<T> و ReadOnlySpan<T> وكيف تتيح معالجة البيانات دون أي تخصيص في الـ Heap (Zero-Allocation)؟",
    shortAnswer: "هي ref struct تمثل نافذة متجاورة متصلة على أي مساحة ذاكرة (Stack, Heap, أو Unmanaged Memory) وتسمح بتقطيع ومعالجة البيانات دون نسخ أو حجز مصفوفات جديدة.",
    explanation: "قديماً، كان استخراج مقطع من نص string.Substring() ينشئ كائناً نصياً جديداً تماماً في الـ Heap، مسبباً ضغطاً هائلاً على الـ GC في معالجة الطلبات الكثيفة. بنية ReadOnlySpan<char> تمثل مجرد مؤشر (Pointer) وطول (Length) لنطاق الذاكرة القائمة بالفعل. استدعاء .AsSpan(0, 10) يوفر إمكانية قراءة وتقطيع النصوص والمصفوفات دون تخصيص بايت واحد جديد في الـ Heap.",
    codeExample: `string text = "Order:12345:Success";
ReadOnlySpan<char> span = text.AsSpan();
int secondColon = span.LastIndexOf(':');
ReadOnlySpan<char> status = span.Slice(secondColon + 1); // صفر تخصيص في الذاكرة!`,
    commonMistakes: ["محاولة استخدام Span<T> داخل فئات عادية أو دوال async؛ نظراً لكونها ref struct مخصصة حصراً للـ Stack، لا يمكن ترحيلها للـ Heap."],
    followUpQuestions: ["ما هي فئة Memory<T> ومتى تستخدم كبديل لـ Span<T> في العمليات غير المتزامنة (async/await)؟"],
    sources: [{ title: "Microsoft Learn — All about Span: Exploring a New .NET Mainstay", url: "https://learn.microsoft.com/en-us/dotnet/api/system.span-1" }],
  },
  {
    id: "ncsharp-008",
    slug: "csharp-idisposable-and-finalizers",
    topicId: "dotnet-csharp",
    difficulty: "Mid",
    question: "كيف يطبق نمط التخلص القياسي (IDisposable Pattern) وما الفرق بين الموارد المدارة وغير المدارة (Managed vs Unmanaged)؟",
    shortAnswer: "الموارد المدارة يتحكم بها الـ CLR تلقائياً، بينما غير المدارة (مثل مقابض ملفات نظام التشغيل ومقابس الشبكة) تتطلب تحريراً صريحاً عبر IDisposable ودالة Dispose().",
    explanation: "الـ Garbage Collector لا يعلم متى وكيف يغلق مقبض ملف لنظام التشغيل أو اتصال قاعدة بيانات مغلق. تطبيق واجهة IDisposable يتيح استخدام كتلة using (أو using declaration) لضمان استدعاء Dispose() فور الخروج من النطاق. نمط Dispose(bool disposing) المتقدم يحمي الموارد غير المدارة عبر Finalizer (~Class()) كملاذ أخير في حال نسيان المطور استدعاء Dispose().",
    codeExample: `public class ResourceHolder : IDisposable {
    private bool _disposed;
    public void Dispose() {
        Dispose(true);
        GC.SuppressFinalize(this); // إلغاء الـ Finalizer لتوفير موارد الـ GC
    }
    protected virtual void Dispose(bool disposing) {
        if (!_disposed) {
            if (disposing) { /* تحرير الموارد المدارة */ }
            /* تحرير الموارد غير المدارة */
            _disposed = true;
        }
    }
}`,
    commonMistakes: ["نسيان استدعاء GC.SuppressFinalize(this) داخل Dispose() مما يجبر الـ GC على إبقاء الكائن لدورة تنظيف إضافية غير ضرورية."],
    followUpQuestions: ["كيف تعمل واجهة IAsyncDisposable وعبارة await using للموارد التي تتطلب تحريراً غير متزامن؟"],
    sources: [{ title: "Microsoft Learn — Implement a Dispose method", url: "https://learn.microsoft.com/en-us/dotnet/standard/garbage-collection/implementing-dispose" }],
  },
  {
    id: "ncsharp-009",
    slug: "csharp-generic-variance-covariance-contravariance",
    topicId: "dotnet-csharp",
    difficulty: "Senior",
    question: "ما هو مفهوم التباين الجيني (Variance) في C# وما الفرق بين التغاير (out Covariance) والتباين العكسي (in Contravariance)؟",
    shortAnswer: "التغاير (out) يتيح استخدام نوع أكثر تحديداً كمخرجات (Assignment to base)، بينما التباين العكسي (in) يتيح استخدام نوع أكثر عمومية كمدخلات.",
    explanation: "تتيح الـ Variance مرونة أمان الأنواع في الواجهات والـ Delegates العامة. في Covariance (out T)، مثل IEnumerable<out T>، يمكنك إسناد IEnumerable<Dog> إلى متغير من نوع IEnumerable<Animal> لأنك تقرأ الحيوانات فقط ولا تدخلها. في Contravariance (in T)، مثل IComparer<in T>، يمكنك تمرير كائن مقارنة للحيوانات IComparer<Animal> لدالة تفرز الكلاب IComparer<Dog> بأمان تام.",
    codeExample: `// Covariance (out)
IEnumerable<string> strings = new List<string>();
IEnumerable<object> objects = strings; // مسموح لأن T مسبوقة بـ out

// Contravariance (in)
Action<object> actObject = (obj) => Console.WriteLine(obj);
Action<string> actString = actObject; // مسموح لأن T مسبوقة بـ in`,
    commonMistakes: ["محاولة استخدام out مع معلمات يتم استقبالها كمدخلات في دوال الواجهة، وهو ما يرفضه المترجم لحماية النوع."],
    followUpQuestions: ["لماذا لا تدعم الـ Classes العادية والـ Structs كلمات out و in وتقتصر حصراً على الواجهات والـ Delegates؟"],
    sources: [{ title: "Microsoft Learn — Covariance and Contravariance", url: "https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/covariance-contravariance/" }],
  },
  {
    id: "ncsharp-010",
    slug: "csharp-source-generators-and-roslyn",
    topicId: "dotnet-csharp",
    difficulty: "Senior",
    question: "ما هي مولدات الشيفرة المصدرية (C# Source Generators) وكيف تفوقت على الـ Reflection وقت التشغيل؟",
    shortAnswer: "هي ميزة في مجمع Roslyn تفحص الكود أثناء الترجمة وتولد ملفات C# حقيقية تدمج في البناء، مما يوفر أداءً فائقاً ويفحص الأنواع مسبقاً دون تكلفة Reflection.",
    explanation: "تعتمد المكتبات الكلاسيكية (مثل JSON serializers القديمة ومحركات التوجيه) على Reflection لفحص الخصائص وقت التشغيل، وهو ما يستهلك زمناً ويمنع التحسين الساكن (AOT Compilation). تسمح Source Generators للـ Analyzer بقراءة الـ Syntax Tree وقت الترجمة وتوليد كود C# نظيف مجمع ومباشر، كما في مولد System.Text.Json ومولد التعبيرات النمطية GeneratedRegex.",
    codeExample: `// توليد محلل التعبيرات النمطية مسبقاً وقت الترجمة
[GeneratedRegex(@"^\\d{5}$")]
private static partial Regex ZipCodeRegex();`,
    commonMistakes: ["محاولة تعديل كود برمجي قائم بواسطة Source Generator؛ المولدات المصدرية مقتصرة حصراً على إضافة كود جديد (Additive only)."],
    followUpQuestions: ["كيف تسهم Source Generators في دعم النشر المترجم مسبقاً للآلة (Native AOT) في .NET 8+؟"],
    sources: [{ title: "Microsoft Learn — Source Generators overview", url: "https://learn.microsoft.com/en-us/dotnet/csharp/roslyn-sdk/source-generators-overview" }],
  },

  // Topic: dotnet-runtime (10 questions: nruntime-001 to nruntime-010)
  {
    id: "nruntime-001",
    slug: "dotnet-garbage-collection-generations",
    topicId: "dotnet-runtime",
    difficulty: "Mid",
    question: "كيف يعمل مجمع المهملات (Garbage Collector) في .NET وما هي الأجيال الثلاثة (Gen 0, Gen 1, Gen 2)؟",
    shortAnswer: "يقسم الـ Heap إلى 3 أجيال بناءً على عمر الكائنات: Gen 0 للكائنات حديثة الإنشاء، Gen 1 كمنطقة وسيطة، وGen 2 للكائنات طويلة العمر، مما يسرع التنظيف ويركز على الأكثر موتاً.",
    explanation: "يعتمد الـ GC على فرضية أن معظم الكائنات تموت بعد وقت قصير جداً من إنشائها. يتم تخصيص الكائنات في Gen 0؛ وعند امتلائه، يُنفذ تنظيف سريع جداً لا يتطلب فحص كامل الذاكرة. الكائنات التي تنجو من التنظيف تُرقّى إلى Gen 1 ثم Gen 2. تنظيف Gen 2 يسمى Full GC وهو الأكثر استهلاكاً لوقت المعالج ويتطلب تجميد خيوط التطبيق في الأنماط غير المتزامنة.",
    codeExample: `Console.WriteLine("User gen: " + GC.GetGeneration(user));
Console.WriteLine("Total Memory: " + GC.GetTotalMemory(false));`,
    commonMistakes: ["استدعاء GC.Collect() يدوياً في الكود الإنتاجي مما يربك خوارزميات الـ CLR الذكية ويفسد توازن الأجيال."],
    followUpQuestions: ["ما هو جيل Large Object Heap (LOH) وما الحد الأدنى لحجم الكائن ليدخل فيه؟"],
    sources: [{ title: "Microsoft Learn — Fundamentals of garbage collection", url: "https://learn.microsoft.com/en-us/dotnet/standard/garbage-collection/fundamentals" }],
  },
  {
    id: "nruntime-002",
    slug: "dotnet-large-object-heap-and-fragmentation",
    topicId: "dotnet-runtime",
    difficulty: "Senior",
    question: "ما هو الـ Large Object Heap (LOH) في .NET ولماذا يعد عرضة لتفتت الذاكرة (Memory Fragmentation)؟",
    shortAnswer: "منطقة مخصصة للكائنات التي تتجاوز 85,000 بايت (مثل المصفوفات الضخمة)؛ ولا يتم ضغطها افتراضياً لتوفير كلفة نقل البيانات الكبيرة، مما يخلق فجوات ذاكرة تؤدي للـ OOM.",
    explanation: "نظراً لأن نسخ كائنات الـ 85KB+ في الذاكرة أثناء الـ Garbage Collection يستهلك وقتاً ضخماً، كان الـ GC ينظفها دون ضغط (Compaction)، تاركاً فراغات بين المساحات المحررة. مع تكرار تخصيص وحذف مصفوفات ضخمة، تتفتت الذاكرة ويعجز السيرفر عن إيجاد مساحة متصلة لكائن جديد فينهار التطبيق بـ OutOfMemoryException. الحل هو استخدام ArrayPool<T> لإعادة تدوير المصفوفات الكبيرة.",
    codeExample: `// استخدام ArrayPool لتجنب تخصيص الـ LOH والتفتت
var pool = ArrayPool<byte>.Shared;
byte[] buffer = pool.Rent(100_000); // استعارة من الـ Pool
try {
    // معالجة البيانات
} finally {
    pool.Return(buffer); // إرجاع للـ Pool
}`,
    commonMistakes: ["حجز مصفوفات بايتات مؤقتة كبيرة في كل طلب معالجة ملفات بدلاً من استعارتها من ArrayPool."],
    followUpQuestions: ["كيف تفعل ضغط الـ LOH عند الضرورة عبر GCSettings.LargeObjectHeapCompactionMode؟"],
    sources: [{ title: "Microsoft Learn — The large object heap on Windows systems", url: "https://learn.microsoft.com/en-us/dotnet/standard/garbage-collection/large-object-heap" }],
  },
  {
    id: "nruntime-003",
    slug: "dotnet-server-gc-vs-workstation-gc",
    topicId: "dotnet-runtime",
    difficulty: "Senior",
    question: "ما الفرق الجوهري بين Workstation GC و Server GC في بيئات تشغيل .NET؟",
    shortAnswer: "Workstation GC يشارك خيوط المعالجة ويهدف للاستجابة السريعة لواجهات المستخدم، بينما Server GC ينشئ Managed Heap وخيط GC مستقل لكل نواة معالج لتحقيق أقصى إنتاجية للخوادم.",
    explanation: "في خوادم الويب (ASP.NET Core)، يتم تفعيل Server GC افتراضياً. إذا كان الخادم يمتلك 16 نواة CPU، ينشئ الـ CLR عدد 16 Gen 0/1/2 Heaps مستقلة و16 خيط تنظيف متخصص. يتيح ذلك تخصيص وتنظيف الذاكرة بالتوازي عبر الأنوية دون تنافس، مما يرفع سقف معالجة الطلبات المتزامنة (Throughput) بشكل هائل، ولكنه يستهلك مساحة رام أولية أكبر.",
    codeExample: `// في ملف csproj أو runtimeconfig.json
<PropertyGroup>
  <ServerGarbageCollection>true</ServerGarbageCollection>
  <ConcurrentGarbageCollection>true</ConcurrentGarbageCollection>
</PropertyGroup>`,
    commonMistakes: ["تشغيل Server GC في حاويات Docker ذات حدود ذاكرة صارمة جداً (مثل 512MB) مع عدد أنوية كبير، مما قد يسبب قتل الحاوية مبكراً."],
    followUpQuestions: ["كيف يؤثر وضع Non-concurrent GC على توقف استجابة الخادم مقارنة بـ Background GC؟"],
    sources: [{ title: "Microsoft Learn — Workstation and server garbage collection", url: "https://learn.microsoft.com/en-us/dotnet/standard/garbage-collection/workstation-server-gc" }],
  },
  {
    id: "nruntime-004",
    slug: "dotnet-clr-execution-model-il-and-jit",
    topicId: "dotnet-runtime",
    difficulty: "Junior",
    question: "كيف ينفذ الـ CLR كود C# وما هي اللغة الوسيطة (CIL/IL) ودور مجمع الـ JIT؟",
    shortAnswer: "يترجم مترجم Roslyn كود C# إلى لغة وسيطة (IL) مستقلة عن المنصة؛ وعند تشغيل البرنامج، يقوم الـ JIT Compiler بترجمة الـ IL إلى تعليمات المعالج الأصلية (Machine Code).",
    explanation: "يضمن هذا النموذج مبدأ 'Build Once, Run Anywhere'. ملفات .dll في .NET لا تحتوي كود آلة خالصاً بل بايتات CIL وبيانات وصفية (Metadata). عند استدعاء دالة لأول مرة، يتدخل مجمع Just-In-Time (JIT) لترجمتها لتعليمات المعالج الدقيقة (x64 أو ARM64) وحفظ العنوان في الذاكرة لتنفيذه مباشرة في الاستدعاءات التالية بسرعة فائقة.",
    codeExample: `// C# -> Roslyn -> IL (.dll) -> CLR JIT -> Machine Code (Native)`,
    commonMistakes: ["الاعتقاد بأن ملفات .dll في .NET هي ملفات ثنائية أصلية خاصة بنظام Windows فقط."],
    followUpQuestions: ["ما هي ميزة Tiered Compilation وكيف توازن بين سرعة بدء التشغيل وجودة تحسين الكود؟"],
    sources: [{ title: "Microsoft Learn — Common Language Runtime (CLR) overview", url: "https://learn.microsoft.com/en-us/dotnet/standard/clr" }],
  },
  {
    id: "nruntime-005",
    slug: "dotnet-native-aot-compilation",
    topicId: "dotnet-runtime",
    difficulty: "Senior",
    question: "ما هي ميزة Native AOT في .NET 8+ وما هي المكاسب والقيود المرتبطة بها؟",
    shortAnswer: "تترجم الكود مباشرة إلى ملف تنفيذي أصلي للآلة دون الحاجة لوجود مجمع JIT أو تثبيت .NET Runtime، مما يقلل زمن البدء واستهلاك الذاكرة ولكن مع قيود على Reflection.",
    explanation: "في Native Ahead-Of-Time (AOT)، يتم تقليم الأكواد غير المستخدمة (Trimming) وتجميع كامل التطبيق إلى ملف تنفيذي ذاتي مستقل بحجم صغير جداً. المكاسب هائلة لوظائف الـ Serverless والحاويات المصغرة حيث يقل زمن الإقلاع لعشرات المللي ثوانٍ ويقل استهلاك الرام للنصف. القيد الأبرز هو حظر توليد الأكواد الديناميكية وReflection غير المتوافق مع التحليل الساكن.",
    codeExample: `<PropertyGroup>
  <PublishAot>true</PublishAot>
</PropertyGroup>`,
    commonMistakes: ["محاولة نشر تطبيق يعتمد على مكتبات قديمة تستخدم Reflection كثيف كـ Native AOT دون استبدالها بـ Source Generators."],
    followUpQuestions: ["كيف تنبهك تحذيرات Trimming Warnings وقت البناء إلى الأكواد غير المتوافقة مع AOT؟"],
    sources: [{ title: "Microsoft Learn — Native AOT deployment overview", url: "https://learn.microsoft.com/en-us/dotnet/core/deploying/native-aot/" }],
  },
  {
    id: "nruntime-006",
    slug: "dotnet-tiered-compilation-and-pgo",
    topicId: "dotnet-runtime",
    difficulty: "Senior",
    question: "كيف تعمل الترجمة المتدرجة (Tiered Compilation) والتحسين المستند للملف الشخصي (Dynamic PGO)؟",
    shortAnswer: "يبدأ JIT بترجمة سريعة دون تحسينات (Tier 0) لسرعة الإقلاع، ثم يراقب الدوال الأكثر استخداماً ويعيد تجميعها بأعلى تحسينات مخصصة للمعالج (Tier 1 و PGO).",
    explanation: "يجمع Tiered Compilation بين ميزتي الإقلاع الفوري والأداء الأقصى. دالة Tier 0 تترجم بسرعة وبلا تحسينات لمساعدة التطبيق على الاستجابة فوراً. إذا رصد المحرك استدعاء الدالة مئات المرات (Hot Method)، يقوم في الخلفية بتسجيل أنماط بياناتها واستدعاءاتها عبر Dynamic PGO (Profile-Guided Optimization)، ثم يعيد ترجمتها بحسابات متقدمة وفرد للحلقات (Loop Unrolling) لسرعة خارقة.",
    codeExample: `// مفعل تلقائياً في .NET 8+
<PropertyGroup>
  <TieredPGO>true</TieredPGO>
</PropertyGroup>`,
    commonMistakes: ["إجراء اختبارات قياس الأداء (Benchmarks) في الدقائق الأولى لتشغيل السيرفر قبل أن ينتهي الـ JIT من مرحلة ترقية Tier 1 PGO."],
    followUpQuestions: ["كيف تساعد أداة BenchmarkDotNet في عزل فترات الإحماء (Warmup) لضمان قياس أداء كود Tier 1 بدقة؟"],
    sources: [{ title: "Microsoft Learn — Tiered compilation", url: "https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-core-3-0#tiered-compilation" }],
  },
  {
    id: "nruntime-007",
    slug: "dotnet-assembly-load-context-and-plugins",
    topicId: "dotnet-runtime",
    difficulty: "Senior",
    question: "كيف تستخدم فئة AssemblyLoadContext لعزل وتفريغ الإضافات (Plugins) من الذاكرة ديناميكياً؟",
    shortAnswer: "توفر نطاق عزل لتحميل ملفات .dll مستقلة مع إمكانية تفريغها بالكامل من الذاكرة (Collectibility) عند الانتهاء دون إيقاف العملية الرئيسية.",
    explanation: "افتراضياً في .NET، لا يمكن تفريغ أي تجميعة (Assembly) يتم تحميلها في الـ Default Context حتى تموت العملية بأكملها. باستخدام فئة مشتقة من AssemblyLoadContext محددة بـ isCollectible: true، يمكنك تحميل إضافات برمجية خارجية، وتشغيلها، ثم استدعاء alc.Unload() والتأكد من إزالة كل المراجع ليقوم الـ GC بمسح التجميعة بالكامل من الرام.",
    codeExample: `var alc = new AssemblyLoadContext("PluginContext", isCollectible: true);
var assembly = alc.LoadFromAssemblyPath(pluginPath);
// تنفيذ الكود ثم التفريغ
alc.Unload();`,
    commonMistakes: ["الاحتفاظ بمراجع غير مباشرة لكائنات أو أنواع قادمة من الـ Plugin في الـ Host الرئيسي مما يمنع تفريغ الـ Context."],
    followUpQuestions: ["كيف تتحقق من اكتمال تفريغ الـ AssemblyLoadContext باستخدام WeakReference؟"],
    sources: [{ title: "Microsoft Learn — Understanding AssemblyLoadContext", url: "https://learn.microsoft.com/en-us/dotnet/core/dependency-loading/understanding-assemblyloadcontext" }],
  },
  {
    id: "nruntime-008",
    slug: "dotnet-memory-pinning-and-fixed-statement",
    topicId: "dotnet-runtime",
    difficulty: "Senior",
    question: "ما هو تثبيت الذاكرة (Memory Pinning) وعبارة fixed وما مخاطرها على الـ Garbage Collector؟",
    shortAnswer: "تثبيت الكائن في موقع محدد بالـ RAM لمنع الـ GC من تحريكه أثناء تمريره لكود غير مدار (C/C++)؛ ومخاطره إعاقة ضغط الذاكرة وخلق تفتت حاد في الـ Heap.",
    explanation: "يقوم الـ GC عادة بضغط الذاكرة ونقل الكائنات لتوفير مساحات متصلة. إذا كنت تتعامل مع دالة C أصلية عبر P/Invoke تتوقع مؤشراً ثابتاً لعنوان الذاكرة، فإن عبارة fixed تضع علامة تثبيت (Pinning) على الكائن تمنع الـ GC من تحريكه طوال مدة الكتلة. الإفراط في تثبيت كائنات في Gen 0/1 يعيق حركة الـ GC ويجبره على القفز فوقها مسبباً تفتت الذاكرة.",
    codeExample: `unsafe {
    byte[] buffer = new byte[100];
    fixed (byte* p = buffer) {
        // المؤشر p ثابت ولا يمكن للـ GC تحريكه هنا
        NativeMethods.FillBuffer(p, 100);
    }
}`,
    commonMistakes: ["تثبيت الكائنات لفترات طويلة جداً مما يمنع ضغط الـ Heap ويؤدي للـ Memory Fragmentation."],
    followUpQuestions: ["كيف توفر ميزة GCHandle.Alloc(obj, GCHandleType.Pinned) تثبيتاً يدوياً خارج نطاق الكتل غير الآمنة؟"],
    sources: [{ title: "Microsoft Learn — fixed statement (C# reference)", url: "https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/statements/fixed" }],
  },
  {
    id: "nruntime-009",
    slug: "dotnet-threadpool-starvation-and-sync-over-async",
    topicId: "dotnet-runtime",
    difficulty: "Senior",
    question: "ما هي كارثة تجويع الـ ThreadPool (Starvation) الناتجة عن ممارسة Sync-over-Async (.Result / .Wait())؟",
    shortAnswer: "تحدث عندما يحجب خيط من الـ ThreadPool بانتظار نتيجة Task غير مكتملة، مما يستنزف خيوط المسبح ويجعل التطبيق عاجزاً عن خدمة أي طلبات جديدة حتى الموت.",
    explanation: "يحتوي الـ ThreadPool على عدد أولي من الخيوط ويزيدها ببطء شديد (حوالي خيط أو اثنين في الثانية). إذا استدعى كود متزامن task.Result أو task.Wait()، يُقفل الخيط الحالي في حالة خمول بانتظار انتهاء المهمة التي تحتاج هي الأخرى لخيط من نفس المسبح لتكتمل. في حالة وصول عشرات الطلبات المتزامنة، تتجمد كل الخيوط في انتظار بعضها وتحدث الوفاة التامة للخادم (Deadlock / Starvation).",
    codeExample: `// خطأ مميت يدمر الخادم:
public IActionResult GetData() {
    var data = _service.GetDataAsync().Result; // حظر خيط الـ ThreadPool!
    return Ok(data);
}

// الطريقة الصحيحة دائماً:
public async Task<IActionResult> GetData() {
    var data = await _service.GetDataAsync();
    return Ok(data);
}`,
    commonMistakes: ["استدعاء .GetAwaiter().GetResult() كبديل ظناً أنه آمن؛ هو يحجب الخيط تماماً مثل .Result."],
    followUpQuestions: ["كيف تراقب عدد خيوط الـ ThreadPool النشطة ومعدل نموها باستخدام عدادات الـ dotnet-counters؟"],
    sources: [{ title: "Microsoft Learn — Asynchronous programming scenarios", url: "https://learn.microsoft.com/en-us/dotnet/csharp/asynchronous-programming/" }],
  },
  {
    id: "nruntime-010",
    slug: "dotnet-diagnostics-eventpipe-and-dumps",
    topicId: "dotnet-runtime",
    difficulty: "Senior",
    question: "كيف تشخص أعطال الذاكرة والـ Deadlocks في بيئات الإنتاج بـ Linux باستخدام dotnet-dump و dotnet-trace؟",
    shortAnswer: "تجمع ملف تفريغ الذاكرة (Memory Dump) بـ dotnet-dump دون إيقاف السيرفر، وتحلله بأوامر SOS مثل dumpheap -stat لتحديد تسريبات الكائنات وأقفال الخيوط.",
    explanation: "في بيئات الحاويات وLinux السحابية، لا يمكنك تشغيل Visual Studio المباشر. توفر مايكروسوفت أدوات تشخيص عالمية عبر مقبس EventPipe. باستخدام dotnet-dump collect -p <pid>، يتم التقاط لقطة ذاكرة كاملة للحاوية، ثم استخدام dotnet-dump analyze لفحص كائنات الـ Managed Heap، ومعرفة الخيوط العالقة في sync-blocks، ومسارات الجذور المسببة للـ Memory Leaks بدقة.",
    codeExample: `// جمع لقطة تفريغ في بيئة الإنتاج:
// dotnet-dump collect -p 1234
// dotnet-dump analyze core_dump
// > dumpheap -stat
// > clrstack -all`,
    commonMistakes: ["أخذ ملفات تفريغ ذاكرة كاملة (Full Dumps) في سيرفرات تمتلك مساحات رام هائلة ومساحة قرص محدودة مما يملأ القرص."],
    followUpQuestions: ["كيف تسجل مقاييس الأداء الحية للـ GC ومعدلات الاستجابة عبر dotnet-counters monitor؟"],
    sources: [{ title: "Microsoft Learn — Diagnostic tools in .NET", url: "https://learn.microsoft.com/en-us/dotnet/core/diagnostics/" }],
  },

  // Topic: dotnet-aspnet (10 questions: nasp-001 to nasp-010)
  {
    id: "nasp-001",
    slug: "aspnet-core-minimal-apis-vs-controllers",
    topicId: "dotnet-aspnet",
    difficulty: "Junior",
    question: "ما الفرق بين Minimal APIs ومتحكمات Controllers التقليدية في ASP.NET Core؟",
    shortAnswer: "الـ Minimal APIs توجه المسارات مباشرة عبر Lambdas خفيفة بأقل تكلفة إضافية وأسرع إقلاع، بينما الـ Controllers توفر هيكلية كلاسيكية تناسب المشاريع الضخمة المعقدة.",
    explanation: "صُممت Minimal APIs لتوفير أداء فائق وسرعة إقلاع قصوى بدون أعباء الـ MVC الكلاسيكية (مثل Model Binders المعقدة والمرشحات الثقيلة)، وهي مثالية للـ Microservices ووظائف الـ Serverless. في المقابل، توفر فئات ControllerBase هيكلية متكاملة مفضلة للمشاريع الكبيرة مع دعم واسع لـ Action Filters و Model Conventions.",
    codeExample: `// Minimal API (Program.cs)
var app = builder.Build();
app.MapGet("/users/{id}", async (int id, IUserService service) => 
    await service.GetUserAsync(id) is { } user ? Results.Ok(user) : Results.NotFound());`,
    commonMistakes: ["حشو مئات المسارات والمنطق البرمجي مباشرة داخل ملف Program.cs في Minimal APIs بدلاً من تنظيمها في فئات توسعية (Endpoint Route Groups)."],
    followUpQuestions: ["كيف تنظم وتجمع مسارات Minimal APIs عبر MapGroup() في ملفات منفصلة؟"],
    sources: [{ title: "Microsoft Learn — Minimal APIs overview", url: "https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis" }],
  },
  {
    id: "nasp-002",
    slug: "aspnet-core-middleware-pipeline-and-order",
    topicId: "dotnet-aspnet",
    difficulty: "Junior",
    question: "كيف يعمل خط أنابيب الـ Middlewares في ASP.NET Core ولماذا يعد ترتيب التسجيل حرجاً للغاية؟",
    shortAnswer: "ينفذ كل وسيط الكود قبل استدعاء next() ثم ينتظر عودة الاستجابة؛ والترتيب حرج لأن وسيط المصادقة UseAuthentication يجب أن يسبق التفويض UseAuthorization.",
    explanation: "يتم بناء الـ Pipeline كحلقات دائرية متداخلة من دوال RequestDelegate. إذا عكست الترتيب وجعلت UseAuthorization تسبق UseAuthentication، ستفحص الصلاحيات قبل التحقق من هوية المستخدم وستفشل كل الطلبات برمز 401 أو 403. القاعدة الذهبية هي: معالجة الأخطاء أولاً (UseExceptionHandler)، تليها التوجيه والـ CORS، ثم المصادقة، ثم الصلاحيات، وأخيراً الـ Endpoints.",
    codeExample: `app.UseExceptionHandler("/error");
app.UseRouting();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();`,
    commonMistakes: ["وضع app.UseCors() في نهاية الـ pipeline بعد التوجيه والمصادقة مما يمنع إرسال ترويسات CORS في حالات أخطاء المصادقة."],
    followUpQuestions: ["ما الفرق بين app.Use() و app.Run() في تسجيل الـ Middlewares؟"],
    sources: [{ title: "Microsoft Learn — ASP.NET Core Middleware", url: "https://learn.microsoft.com/en-us/aspnet/core/fundamentals/middleware/" }],
  },
  {
    id: "nasp-003",
    slug: "aspnet-core-kestrel-web-server-architecture",
    topicId: "dotnet-aspnet",
    difficulty: "Senior",
    question: "كيف صُمم خادم Kestrel ليصبح أحد أسرع خوادم الويب في العالم وما هو الـ Reverse Proxy؟",
    shortAnswer: "صُمم Kestrel بنظام I/O غير حاجب مبني فوق مسبار المقابس (Socket Pipelines) وذاكرة MemoryPools؛ ويوضع خلف Reverse Proxy (كـ Nginx أو IIS) للحماية وإدارة الـ SSL.",
    explanation: "يعتمد Kestrel على واجهة System.IO.Pipelines التي تقرأ البيانات مباشرة من مقابس الشبكة إلى كتل ذاكرة مشتركة بدون تخصيص متكرر في الـ Heap. في بنية الإنتاج، يفضل وضع خادم Reverse Proxy أمامه للتعامل مع شهادات SSL، والتحكم في مهل الاتصال البطيئة (Slowloris)، وموازنة الحمل بين نسخ Kestrel المتعددة.",
    codeExample: `// تكوين حدود Kestrel في Program.cs
builder.WebHost.ConfigureKestrel(options => {
    options.Limits.MaxConcurrentConnections = 1000;
    options.Limits.MaxRequestBodySize = 10 * 1024 * 1024; // 10MB
});`,
    commonMistakes: ["كشف Kestrel مباشرة للإنترنت دون ضبط حدود حجم الطلبات ومهل الاتصالات الأمنية."],
    followUpQuestions: ["ما أهمية استخدام app.UseForwardedHeaders() عند تشغيل Kestrel خلف Nginx أو AWS ALB؟"],
    sources: [{ title: "Microsoft Learn — Kestrel web server implementation in ASP.NET Core", url: "https://learn.microsoft.com/en-us/aspnet/core/fundamentals/servers/kestrel" }],
  },
  {
    id: "nasp-004",
    slug: "aspnet-core-filters-pipeline-types",
    topicId: "dotnet-aspnet",
    difficulty: "Mid",
    question: "ما هي المراحل الخمس لمرشحات (Filters) في متحكمات ASP.NET Core وما هو ترتيب تنفيذها؟",
    shortAnswer: "الترتيب هو: Authorization Filters أولاً، ثم Resource Filters، ثم Action Filters، ثم Exception Filters، وأخيراً Result Filters.",
    explanation: "تسمح الـ Filters بحقن كود مخصص في مراحل محددة لمعالجة الطلب. تبدأ بـ Authorization Filters لتأكيد الأذونات. تليها Resource Filters (المفيدة جداً في استرجاع الكاش قبل إنشاء المتحكم). ثم Action Filters قبل وبعد تنفيذ دالة الـ Action. إذا رُمي أي استثناء، يتدخل Exception Filter لمعالجته. وأخيراً تنفذ Result Filters قبل وبعد إخراج الـ Result إلى العميل.",
    codeExample: `public class CustomActionFilter : IActionFilter {
    public void OnActionExecuting(ActionExecutingContext context) { /* قبل */ }
    public void OnActionExecuted(ActionExecutedContext context) { /* بعد */ }
}`,
    commonMistakes: ["محاولة تنفيذ كود يعتمد على نتيجة الموديل داخل Resource Filter قبل أن يتم تشغيل الـ Model Binder أصلاً."],
    followUpQuestions: ["لماذا لا تلتقط الـ Exception Filters الأخطاء التي تقع خارج نطاق الـ Controller (مثل أخطاء الـ Middlewares)؟"],
    sources: [{ title: "Microsoft Learn — Filters in ASP.NET Core", url: "https://learn.microsoft.com/en-us/aspnet/core/mvc/controllers/filters" }],
  },
  {
    id: "nasp-005",
    slug: "aspnet-core-model-binding-and-validation",
    topicId: "dotnet-aspnet",
    difficulty: "Junior",
    question: "كيف يعمل الـ Model Binding في ASP.NET Core وما الفرق بين [FromBody] و [FromRoute] و [FromQuery]؟",
    shortAnswer: "يستخرج البيانات من الطلب ويحولها لكائنات C# قوية الأنواع؛ حيث يقرأ [FromBody] نص الـ JSON، ويقرأ [FromRoute] قيم مسار الـ URL، ويقرأ [FromQuery] متغيرات الاستعلام.",
    explanation: "يقوم الـ Model Binder بفحص معاملات دالة الـ Action ومطابقتها بمصادر الطلب المختلفة. يمكن استخدام سمات صريحة لتوجيه المحرك: [FromRoute] لمسارات مثل /api/orders/{id}، و [FromQuery] لخيارات الفلترة /orders?page=2، و [FromBody] لقراءة جسم الـ POST/PUT عبر JSON Formatter، و [FromHeader] للترويسات، مع تطبيق قواعد DataAnnotations مثل [Required] و [Range] تلقائياً.",
    codeExample: `[HttpPost("users/{departmentId}")]
public async Task<IActionResult> CreateUser(
    [FromRoute] int departmentId,
    [FromQuery] bool notify,
    [FromBody] CreateUserDto dto) { ... }`,
    commonMistakes: ["محاولة قراءة أكثر من معامل واحد بواسطة [FromBody] لنفس الـ Action، حيث لا يمكن قراءة تدفق الطلب كـ JSON إلا مرة واحدة."],
    followUpQuestions: ["كيف تجعل دالة الـ API ترفض الطلبات غير المطابقة تلقائياً برمز 400 عبر سمة [ApiController]؟"],
    sources: [{ title: "Microsoft Learn — Model Binding in ASP.NET Core", url: "https://learn.microsoft.com/en-us/aspnet/core/mvc/models/model-binding" }],
  },
  {
    id: "nasp-006",
    slug: "aspnet-core-options-pattern-and-reload",
    topicId: "dotnet-aspnet",
    difficulty: "Mid",
    question: "ما الفرق بين IOptions و IOptionsSnapshot و IOptionsMonitor في نمط الخيارات (Options Pattern)؟",
    shortAnswer: "IOptions هو Singleton ثابت لا يتغير، وIOptionsSnapshot يُعاد حسابه مع كل طلب HTTP لدعم التحديث الحي، بينما IOptionsMonitor هو Singleton يتلقى إشعارات التغيير الفوري للملفات دون الحاجة لسياق طلب.",
    explanation: "يوفر نمط Options ربطاً قوياً لملف appsettings.json مع فئات C# نقية. IOptions خفيف ولكنه لا يقرأ التغييرات التي تحدث على الملف بعد الإقلاع. IOptionsSnapshot مخصص لخدمات Scoped ويقرأ التعديلات مع كل طلب جديد. أما IOptionsMonitor فيستخدم في خدمات Singleton والمهام الخلفية BackgroundServices ويطلق حدث OnChange عند تعديل الملف لحظياً.",
    codeExample: `// التسجيل
builder.Services.Configure<PaymentOptions>(builder.Configuration.GetSection("Payment"));

// الاستخدام في الخدمة
public class PaymentService(IOptionsSnapshot<PaymentOptions> options) {
    private readonly PaymentOptions _options = options.Value;
}`,
    commonMistakes: ["حقن IOptionsSnapshot داخل خدمة مسجلة كـ Singleton مما يرمي خطأ فادحاً في الـ Dependency Injection لتضارب النطاقات."],
    followUpQuestions: ["كيف تتحقق من صحة قيم الإعدادات عند الإقلاع باستخدام ValidateDataAnnotations() و ValidateOnStart()؟"],
    sources: [{ title: "Microsoft Learn — Options pattern in ASP.NET Core", url: "https://learn.microsoft.com/en-us/aspnet/core/fundamentals/configuration/options" }],
  },
  {
    id: "nasp-007",
    slug: "aspnet-core-rate-limiting-middleware",
    topicId: "dotnet-aspnet",
    difficulty: "Mid",
    question: "كيف تطبق وسيط تحديد معدل الطلبات المدمج (Rate Limiting Middleware) في .NET 7+؟",
    shortAnswer: "باستخدام builder.Services.AddRateLimiter وضبط خوارزميات مثل FixedWindow أو SlidingWindow أو TokenBucket وتطبيقها بـ [EnableRateLimiting].",
    explanation: "أضافت .NET وسيطاً أصيلاً شديد القوة لتحديد معدل الطلبات دون الحاجة لمكتبات طرف ثالث. يدعم خوارزميات متعددة: Fixed Window لنافذة ثابتة، Sliding Window لنافذة متحركة تمنع الهجمات عند حواف الدقائق، Token Bucket للسماح بدفقات سريعة من الطلبات (Bursts)، وConcurrency Limiter لقصر عدد الاتصالات المفتوحة في نفس اللحظة.",
    codeExample: `builder.Services.AddRateLimiter(options => {
    options.AddFixedWindowLimiter("fixed", opt => {
        opt.PermitLimit = 100;
        opt.Window = TimeSpan.FromMinutes(1);
    });
});
app.UseRateLimiter();`,
    commonMistakes: ["عدم تخصيص OnRejected Handler لإرجاع استجابة JSON مهيكلة وترويسة Retry-After واضحة عند حظر العميل برمز 429."],
    followUpQuestions: ["كيف تبني PartitionedRateLimiter يقيد الطلبات بحسب معرّف المستخدم أو عنوان IP العميل؟"],
    sources: [{ title: "Microsoft Learn — Rate limiting middleware in ASP.NET Core", url: "https://learn.microsoft.com/en-us/aspnet/core/performance/rate-limit" }],
  },
  {
    id: "nasp-008",
    slug: "aspnet-core-problem-details-rfc7807",
    topicId: "dotnet-aspnet",
    difficulty: "Junior",
    question: "ما هو معيار ProblemDetails (RFC 7807) وكيف تفعله تلقائياً للأخطاء في ASP.NET Core؟",
    shortAnswer: "معيار قياسي لتوحيد صيغة استجابات أخطاء الـ HTTP بصيغة JSON مهيكلة؛ ويفعل باستدعاء builder.Services.AddProblemDetails().",
    explanation: "بدلاً من إرجاع رسائل أخطاء عشوائية تختلف بين كل مسار، يفرض معيار ProblemDetails حقائق موحدة: type (رابط وثيقة الخطأ)، title (عنوان المشكلة)، status (كود الـ HTTP)، detail (شرح الخطأ للعميل)، وinstance (رابط الطلب الحالي)، بالإضافة لمعرف التتبع traceId. هذا يسهل على عملاء الواجهات الأمامية وتطبيقات الموبايل فهم ومعالجة الأخطاء بموثوقية.",
    codeExample: `builder.Services.AddProblemDetails();
var app = builder.Build();
app.UseExceptionHandler(); // يستخدم ProblemDetails تلقائياً للأخطاء 500`,
    commonMistakes: ["إظهار حقل ExceptionDetails في بيئة الإنتاج مما يسرب تفاصيل قواعد البيانات وسطور الكود للمستخدم."],
    followUpQuestions: ["كيف تضيف بيانات مخصصة (Custom Extensions) إلى كائن ProblemDetails عبر دالة CustomizeProblemDetails؟"],
    sources: [{ title: "Microsoft Learn — Handle errors in ASP.NET Core web APIs", url: "https://learn.microsoft.com/en-us/aspnet/core/web-api/handle-errors" }],
  },
  {
    id: "nasp-009",
    slug: "aspnet-core-output-caching-middleware",
    topicId: "dotnet-aspnet",
    difficulty: "Senior",
    question: "كيف يتفوق وسيط Output Caching في .NET 7+ على وسيط Response Caching القديم؟",
    shortAnswer: "يخزن الاستجابات بالكامل في ذاكرة الخادم أو Redis ويدعم إبطال الكاش بالوسوم (Tags) والتأمين بقفل لمنع الـ Stampede، بينما القديم يقتصر على ترويسات العميل فقط.",
    explanation: "وسيط ResponseCaching القديم كان يعتمد حصراً على ترويسات المتصفح ولا يوفر أي وسيلة للمطور لإبطال الكاش برمجياً عند تعديل البيانات. وسيط OutputCaching الحديث يوفر تحكماً خادومياً مطلقاً؛ فيمكنك وسوم المسار بـ Tag('products') وعند تحديث أي منتج تستدعي IOutputCacheStore.EvictByTagAsync('products') لإبطال كل الاستجابات المخزنة فوراً مع دعم ميزة Locking التلقائية لمنع تدافع الطلبات.",
    codeExample: `app.MapGet("/products", async (IProductService s) => await s.GetAllAsync())
   .CacheOutput(p => p.Expire(TimeSpan.FromHours(1)).Tag("products"));`,
    commonMistakes: ["تفعيل Output Caching على مسارات تتطلب مصادقة المستخدم دون تضمين الـ User ID في مفتاح التخزين عبر VaryByValue."],
    followUpQuestions: ["كيف توجه Output Caching لاستخدام مخزن Redis موزع لمشاركة الاستجابات عبر خوادم متعددة؟"],
    sources: [{ title: "Microsoft Learn — Output caching middleware in ASP.NET Core", url: "https://learn.microsoft.com/en-us/aspnet/core/performance/caching/output" }],
  },
  {
    id: "nasp-010",
    slug: "aspnet-core-backgroundservice-and-ihostedservice",
    topicId: "dotnet-aspnet",
    difficulty: "Mid",
    question: "كيف تنفذ المهام الخلفية المستمرة باستخدام فئة BackgroundService وما مخاطر حقن الخدمات الـ Scoped بداخلها؟",
    shortAnswer: "تنفذ بالوراثة من BackgroundService وكتابة المنطق داخل ExecuteAsync()؛ ولا يمكن حقن الخدمات الـ Scoped فيها مباشرة لأنها Singleton ويجب إنشاء نطاق يدوياً عبر IServiceScopeFactory.",
    explanation: "فئة BackgroundService هي الطريقة القياسية لتشغيل مهام طويلة الأمد (مثل سحب رسائل من طابور أو معالجة دورية). نظراً لأن الـ BackgroundService تسجل كـ Singleton طوال عمر التطبيق، فإن حقن DbContext (وهو Scoped) في الباني سيرمي خطأ InvalidOperationException. الحل الصحيح هو حقن IServiceScopeFactory وإنشاء نطاق يدوي using (var scope = _scopeFactory.CreateScope()) داخل كل دورة.",
    codeExample: `public class QueueConsumer(IServiceScopeFactory scopeFactory) : BackgroundService {
    protected override async Task ExecuteAsync(CancellationToken stoppingToken) {
        while (!stoppingToken.IsCancellationRequested) {
            using var scope = scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            await db.ProcessPendingOrdersAsync(stoppingToken);
            await Task.Delay(5000, stoppingToken);
        }
    }
}`,
    commonMistakes: ["تجاهل CancellationToken stoppingToken مما يمنع التطبيق من إتمام عملية الإغلاق النظيف (Graceful Shutdown) عند استلام إشارة التوقف."],
    followUpQuestions: ["ما الفرق بين واجهة IHostedService الأساسية والفئة المجردة BackgroundService؟"],
    sources: [{ title: "Microsoft Learn — Background tasks with hosted services in ASP.NET Core", url: "https://learn.microsoft.com/en-us/aspnet/core/fundamentals/host/hosted-services" }],
  },

  // Topic: dotnet-di (10 questions: ndi-001 to ndi-010)
  {
    id: "ndi-001",
    slug: "dotnet-di-service-lifetimes-transient-scoped-singleton",
    topicId: "dotnet-di",
    difficulty: "Junior",
    question: "ما الفرق الجوهري بين فترات حياة الخدمات (Lifetimes): Transient و Scoped و Singleton في .NET؟",
    shortAnswer: "Transient تنشئ نسخة جديدة مع كل طلب حقن، وScoped تنشئ نسخة واحدة لكل طلب HTTP تشترك فيها كل المكونات، وSingleton تنشئ نسخة واحدة للأبد تشاركها كامل العملية.",
    explanation: "تعد إدارة فترات الحياة الركيزة الأساسية للـ Dependency Injection. استخدم Transient للخدمات الخفيفة عديمة الحالة. استخدم Scoped للخدمات التي تحتفظ بحالة الطلب الحالي أو تتشارك سياقاً مثل Entity Framework DbContext. استخدم Singleton للخدمات باهظة الإنشاء التي تحتفظ بذاكرة كاش مشتركة أو تدير مقابس شبكة دائمة.",
    codeExample: `builder.Services.AddTransient<IEmailSender, EmailSender>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddSingleton<ICacheManager, MemoryCacheManager>();`,
    commonMistakes: ["حقن خدمة Scoped داخل خدمة Singleton مما يخلق خطأ Captive Dependency الكارثي."],
    followUpQuestions: ["ما هو خطأ Captive Dependency وكيف تفعله .NET تلقائياً في بيئة التطوير عبر ValidateScopes؟"],
    sources: [{ title: "Microsoft Learn — Dependency injection in .NET", url: "https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection" }],
  },
  {
    id: "ndi-002",
    slug: "dotnet-di-captive-dependencies-and-scoped-validation",
    topicId: "dotnet-di",
    difficulty: "Senior",
    question: "ما هي تبعية الأسير (Captive Dependency) في حاوية الـ DI بـ .NET وكيف تكتشفها وتمنعها؟",
    shortAnswer: "تحدث عندما تُحقن خدمة ذات نطاق أقصر (مثل Scoped) داخل خدمة ذات نطاق أطول (مثل Singleton)، مما يحبس النسخة الـ Scoped في الذاكرة للأبد ويمنع تنظيفها.",
    explanation: "إذا قمت بحقن DbContext (وهو Scoped) داخل فئة CacheService (وهي Singleton)، سيظل نفس كائن الـ DbContext حياً طوال عمر التطبيق ولن يتم استدعاء Dispose عليه مطلقاً. هذا يؤدي لتضخم الذاكرة (Memory Leak) ومحاولة استخدام نفس الاتصال عبر خيوط متزامنة مما يرمي أخطاء Concurrency. توفر .NET خيار ValidateScopes الذي يرمي استثناء فورياً عند الإقلاع في بيئة Development إذا وجد هذه التبعية.",
    codeExample: `// مفعل تلقائياً في Development:
builder.Host.UseDefaultServiceProvider(options => {
    options.ValidateScopes = true;
    options.ValidateOnBuild = true;
});`,
    commonMistakes: ["تعطيل ValidateScopes في بيئة التطوير لتجاوز الخطأ بدلاً من إصلاح التبعيات."],
    followUpQuestions: ["كيف تحل الحاجة لاستخدام خدمة Scoped داخل Singleton بأمان باستخدام IServiceScopeFactory؟"],
    sources: [{ title: "Microsoft Learn — Dependency injection guidelines: Captive dependencies", url: "https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection-guidelines#captive-dependency" }],
  },
  {
    id: "ndi-003",
    slug: "dotnet-di-keyed-services-in-dotnet8",
    topicId: "dotnet-di",
    difficulty: "Mid",
    question: "كيف تعمل الخدمات ذات المفاتيح (Keyed Services) المضافة في .NET 8 وكيف حلت معضلة تعدد التطبيقات؟",
    shortAnswer: "تسمح بتسجيل عدة تطبيقات لنفس الواجهة بمفاتيح تمييز صريحة واستدعائها بدقة عبر سمة [FromKeyedServices(\"key\")] دون الحاجة لمصانع مخصصة.",
    explanation: "قديماً، إذا كان لديك تطبيقان لواجهة IPaymentService (أحدهما لـ Stripe والآخر لـ PayPal)، كان المطور يضطر لبناء Factory Pattern معقد أو استخدام حاويات خارجية مثل Autofac. في .NET 8، أضيف دعم أصيل: builder.Services.AddKeyedScoped<IPaymentService, StripePayment>('stripe')، ويتم حقن النسخة المطلوبة مباشرة في المتحكم بوضع السمة [FromKeyedServices('stripe')].",
    codeExample: `builder.Services.AddKeyedSingleton<INotificationSender, EmailSender>("email");
builder.Services.AddKeyedSingleton<INotificationSender, SmsSender>("sms");

// الاستخدام في المتحكم
public class AlertController([FromKeyedServices("sms")] INotificationSender sender) { ... }`,
    commonMistakes: ["محاولة حقن خدمة بـ [FromKeyedServices] دون تسجيل المفتاح في الـ Container مما يرمي InvalidOperationException."],
    followUpQuestions: ["كيف تسترجع خدمة ذات مفتاح برمجياً من IServiceProvider عبر GetKeyedService<T>(key)؟"],
    sources: [{ title: "Microsoft Learn — Keyed services in dependency injection", url: "https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-8/overview#keyed-di-services" }],
  },
  {
    id: "ndi-004",
    slug: "dotnet-di-idisposable-and-service-cleanup",
    topicId: "dotnet-di",
    difficulty: "Mid",
    question: "من المسؤول عن استدعاء دالة Dispose() للخدمات التي تطبق IDisposable عند استخدام حاوية .NET DI؟",
    shortAnswer: "حاوية الـ DI هي المسؤولة حصراً عن استدعاء Dispose() تلقائياً لجميع الخدمات التي أنشأتها هي، عند انتهاء فترة حياة النطاق (Scope) أو انتهاء التطبيق للـ Singletons.",
    explanation: "قاعدة أساسية: من يُنشئ المورد هو من ينظفه. إذا قامت الحاوية بإنشاء خدمة Scoped تطبق IDisposable، ستقوم الحاوية تلقائياً باستدعاء Dispose() عليها فور اكتمال طلب الـ HTTP وتدمير النطاق. استثناء وحيد خطير: إذا قمت بتسجيل نسخة جاهزة مسبقاً بنفسك عبر services.AddSingleton(new MyService())، فإن الحاوية لن تستدعي Dispose() عليها ويجب عليك تنظيفها يدوياً.",
    codeExample: `// الحاوية تنشئ الكائن وستستدعي Dispose() تلقائياً:
builder.Services.AddScoped<MyDisposableService>();

// الحاوية لا تمتلك النسخة ولن تستدعي Dispose():
builder.Services.AddSingleton(new MyDisposableService());`,
    commonMistakes: ["استدعاء دالة Dispose() يدوياً داخل كود المتحكم لخدمة تم حقنها بواسطة الـ DI Container."],
    followUpQuestions: ["كيف تتعامل الحاوية مع الخدمات التي تطبق واجهة IAsyncDisposable عند إغلاق النطاق؟"],
    sources: [{ title: "Microsoft Learn — Disposal of services in dependency injection", url: "https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection-guidelines#disposal-of-services" }],
  },
  {
    id: "ndi-005",
    slug: "dotnet-di-scrutor-and-assembly-scanning",
    topicId: "dotnet-di",
    difficulty: "Senior",
    question: "كيف تسهل مكتبة Scrutor فحص التجميعات وتسجيل الخدمات تلقائياً (Assembly Scanning) بنمط Convention-over-Configuration؟",
    shortAnswer: "تفحص فئات المشروع آلياً وتسجل الفئات التي تطبق واجهات مطابقة (Matching Interfaces) بنطاقات محددة بسطر واحد دون كتابة مئات سطور AddScoped اليدوية.",
    explanation: "في المشاريع الضخمة التي تحتوي على مئات الـ Services والـ Repositories، يصبح تسجيل كل فئة يدوياً في Program.cs كابوساً معمارياً معرضاً للنسيان. تضيف مكتبة Scrutor دوال توسعية لحاوية .NET الرسمية تتيح مسح التجميعات وتسجيل كل ما ينتهي بـ Service أو Repository مع الواجهة المنفذة تلقائياً، بالإضافة لدعم نمط الـ Decorator Pattern بأناقة.",
    codeExample: `builder.Services.Scan(scan => scan
    .FromAssemblyOf<IUserService>()
    .AddClasses(classes => classes.Where(type => type.Name.EndsWith("Service")))
    .AsImplementedInterfaces()
    .WithScopedLifetime());`,
    commonMistakes: ["مسح التجميعات وتطبيق فترات حياة عشوائية دون استثناء الخدمات التي تتطلب إعدادات خاصة أو معاملات محددة."],
    followUpQuestions: ["كيف تطبق نمط Decorator لتغليف الخدمات بميزات الكاش أو التسجيل عبر Scrutor بـ services.Decorate<TInterface, TDecorator>()؟"],
    sources: [{ title: "Microsoft Learn — Dependency injection in .NET architecture", url: "https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection" }],
  },
  {
    id: "ndi-006",
    slug: "dotnet-di-service-locator-anti-pattern",
    topicId: "dotnet-di",
    difficulty: "Mid",
    question: "لماذا يعد نمط Service Locator (حقن IServiceProvider مباشرة) نمطاً مضاداً (Anti-pattern) في C#؟",
    shortAnswer: "لأنه يخفي التبعيات الحقيقية للفئة، ويعطل فحص المترجم الساكن، ويصعب كتابة اختبارات الوحدة، وقد يؤدي لأخطاء وقت التشغيل عند طلب خدمات غير مسجلة.",
    explanation: "عندما تطلب الفئة IServiceProvider في الباني، لا يعلم المطور الخارجي ما هي التبعيات الفعلية التي تحتاجها الفئة لتعمل، ويفشل فحص التبعيات عند الإنشاء. الممارسة الهندسية الصحيحة هي التصريح الصريح عن كل التبعيات في الباني (Constructor Injection)، مما يجعل الفئة ذات مسؤولية واضحة ويسهل استبدال التبعيات بـ Mocks في اختبارات الوحدة.",
    codeExample: `// نمط مضاد سيء (Service Locator):
public class OrderService(IServiceProvider provider) {
    public void Process() {
        var repo = provider.GetRequiredService<IOrderRepo>(); // تبعية مخفية!
    }
}

// الطريقة الصحيحة الصريحة (Constructor Injection):
public class OrderService(IOrderRepo repo) { ... }`,
    commonMistakes: ["حقن IServiceProvider لتفادي كتابة 5 معاملات في الباني، بدلاً من إدراك أن الفئة متضخمة وتنتهك مبدأ Single Responsibility."],
    followUpQuestions: ["متى يكون استخدام IServiceProvider مبرراً ومقبولاً (مثلاً في مصانع الفئات المتقدمة أو Middleware Invoke)؟"],
    sources: [{ title: "Microsoft Learn — Dependency injection guidelines: Service locator", url: "https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection-guidelines" }],
  },
  {
    id: "ndi-007",
    slug: "dotnet-di-factory-pattern-and-open-generics",
    topicId: "dotnet-di",
    difficulty: "Senior",
    question: "كيف تسجل وتستدعي الأنواع الجنيسة المفتوحة (Open Generics) مثل IRepository<> في حاوية .NET؟",
    shortAnswer: "بتسجيل نوع الواجهة المفتوحة ونوع التطبيق المفتوح بدون تحديد المعامل عبر typeof(IRepository<>) و typeof(Repository<>)، لتقوم الحاوية بتوليد النوع المغلق تلقائياً.",
    explanation: "بدلاً من تسجيل IRepository<User> و IRepository<Order> بشكل فردي لمئات الجداول، تتيح الحاوية تسجيل النوع المفتوح typeof(IRepository<>). عندما يطلب متحكم IRepository<User>، يقوم الـ CLR تلقائياً بإنشاء نسخة مغلقة من Repository<User>، مما يقلل كتابة الكود التكراري ويوفر معمارية مستودعات فائقة المرونة.",
    codeExample: `// تسجيل Open Generic
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

// الاستخدام: الحاوية تحقن Repository<Product> تلقائياً
public class ProductController(IRepository<Product> repo) { ... }`,
    commonMistakes: ["استخدام generics مغلقة في التسجيل وتوقع أن تتعامل الحاوية مع باقي الكيانات تلقائياً."],
    followUpQuestions: ["كيف يدعم MediatR تسجيل معالجات الطلبات عبر Open Generics مثل IRequestHandler<,>؟"],
    sources: [{ title: "Microsoft Learn — Register open generic types in DI", url: "https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection" }],
  },
  {
    id: "ndi-008",
    slug: "dotnet-di-action-injection-fromservices",
    topicId: "dotnet-di",
    difficulty: "Junior",
    question: "ما هي ميزة سمة [FromServices] ومتى تفضل حقن الخدمة في دالة الـ Action بدلاً من الباني؟",
    shortAnswer: "تسمح بحقن التبعية مباشرة كمعامل في دالة الـ Action المحددة فقط، وتفضل عندما تكون الخدمة باهظة وتستخدم حصراً في مسار واحد دون باقي المتحكم.",
    explanation: "إذا كان المتحكم يحتوي على 10 مسارات سريعة ومسار واحد فقط يحتاج لخدمة ثقيلة (مثل PDFGeneratorService)، فإن حقنها في الباني سيجبر التطبيق على إنشاء الخدمة مع كل طلب يزور أي مسار في ذلك المتحكم. استخدام [FromServices] في دالة التصدير فقط يوفر الموارد ويضمن عدم إنشاء الخدمة الثقيلة إلا عندما يطلب المستخدم ذلك المسار بالتحديد.",
    codeExample: `[HttpPost("export-pdf")]
public async Task<IActionResult> ExportPdf(
    int id,
    [FromServices] IPdfGeneratorService pdfService) {
    var file = await pdfService.GenerateAsync(id);
    return File(file, "application/pdf");
}`,
    commonMistakes: ["حقن كل التبعيات عبر [FromServices] مما يشتت توقيع الدوال ويصعب فحص الفئة ككل."],
    followUpQuestions: ["كيف تتعامل Minimal APIs مع حقن الخدمات تلقائياً دون الحاجة لكتابة سمة [FromServices]؟"],
    sources: [{ title: "Microsoft Learn — Action injection with FromServices", url: "https://learn.microsoft.com/en-us/aspnet/core/mvc/controllers/dependency-injection#action-injection-with-fromservices" }],
  },
  {
    id: "ndi-009",
    slug: "dotnet-di-multiple-implementations-resolution",
    topicId: "dotnet-di",
    difficulty: "Mid",
    question: "ماذا يحدث عند تسجيل عدة فئات تطبق نفس الواجهة في حاوية .NET وكيف تسترجعها جميعاً؟",
    shortAnswer: "طلب الواجهة الفردية IService يعيد آخر فئة تم تسجيلها فقط، بينما حقن مصفوفة IEnumerable<IService> يسترجع جميع التطبيقات المسجلة بالترتيب.",
    explanation: "إذا قمت بتسجيل 3 خدمات تدقيق: services.AddScoped<IValidator, A>(); services.AddScoped<IValidator, B>(); services.AddScoped<IValidator, C>(); فإن طلب IValidator منفرد سيعيد الفئة C دائماً (Last In Wins). لاسترجاع وتشغيل كل أدوات التدقيق معاً، يتم حقن IEnumerable<IValidator> في الباني، حيث تمرر الحاوية مصفوفة تحتوي على النسخ الثلاث جاهزة للتكرار عليها في حلقة.",
    codeExample: `public class CompositeValidator(IEnumerable<IValidator> validators) {
    public void ValidateAll(Order order) {
        foreach (var v in validators) v.Validate(order);
    }
}`,
    commonMistakes: ["استخدام AddScoped بدلاً من TryAddEnumerable عند الرغبة في منع تكرار تسجيل نفس التطبيق بالخطأ."],
    followUpQuestions: ["كيف تحمي مكتبات البنية التحتية خدماتها من التكرار باستخدام دالة services.TryAddScoped()؟"],
    sources: [{ title: "Microsoft Learn — Dependency injection: Multiple implementations", url: "https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection" }],
  },
  {
    id: "ndi-010",
    slug: "dotnet-di-custom-containers-autofac",
    topicId: "dotnet-di",
    difficulty: "Senior",
    question: "متى تلجأ لاستبدال الحاوية المدمجة في .NET بحاوية متقدمة مثل Autofac؟",
    shortAnswer: "عند الحاجة لميزات متقدمة غير مدعومة أصلياً مثل Property Injection، والـ Interception للبرمجة الموجهة للجوانب (AOP)، والنطاقات المخصصة المعقدة.",
    explanation: "صُممت حاوية .NET الافتراضية (Microsoft.Extensions.DependencyInjection) لتكون خفيفة وسريعة وتغطي 95% من الاحتياجات الشائعة. إذا كان مشروعك يتطلب حقن الخصائص تلقائياً، أو اعتراض الاستدعاءات ديناميكياً لتطبيق الكاش والتسجيل (AOP Interception)، أو تنظيم الخدمات بنظام Autofac Modules، يمكنك استبدال موفر الخدمات بسهولة عبر builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory()).",
    codeExample: `// دمج Autofac في Host
builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());
builder.Host.ConfigureContainer<ContainerBuilder>(container => {
    container.RegisterModule(new ApplicationModule());
});`,
    commonMistakes: ["الانتقال لحاوية خارجية معقدة لمجرد التعود عليها في مشاريع سابقة دون وجود متطلب حقيقي يبرر التكلفة الإضافية."],
    followUpQuestions: ["ما هو العبء الأدائي لاستخدام حزم الـ Dynamic Interception في حاويات مثل Autofac؟"],
    sources: [{ title: "Microsoft Learn — Dependency injection: Third-party containers", url: "https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection" }],
  },

  // Topic: dotnet-efcore (10 questions: nef-001 to nef-010)
  {
    id: "nef-001",
    slug: "efcore-change-tracker-and-asnotracking",
    topicId: "dotnet-efcore",
    difficulty: "Junior",
    question: "كيف يعمل متبع التغييرات (Change Tracker) في EF Core ولماذا يجب استخدام AsNoTracking() لاستعلامات القراءة؟",
    shortAnswer: "يحتفظ الـ Change Tracker بنسخة من الكائنات في الذاكرة لمراقبة تعديلاتها وحفظها بـ SaveChanges()؛ وAsNoTracking يلغي هذه المراقبة مما يوفر الذاكرة ويسرع استعلامات القراءة بشكل ضخم.",
    explanation: "عند تنفيذ أي استعلام عادي في EF Core، يقوم المحرك بإنشاء كائن ومطابقته بلقطة أصلية (Snapshot) في ذاكرة الـ DbContext لمراقبة أي تغيير يطرأ على الخصائص. في استعلامات القراءة فقط (مثل واجهات العرض والـ APIs)، لا توجد نية لتعديل البيانات وحفظها، لذا فإن استخدام .AsNoTracking() يمنع إنشاء لقطات التتبع، مما يخفض استهلاك الـ RAM ويسرع زمن الاستعلام بنسبة تفوق 40%.",
    codeExample: `// استعلام قراءة فائق السرعة دون حجز ذاكرة تتبع
var users = await dbContext.Users
    .AsNoTracking()
    .Where(u => u.IsActive)
    .ToListAsync();`,
    commonMistakes: ["استدعاء AsNoTracking() على كائن ترغب في تعديله ثم التساؤل عن سبب عدم حفظ التغييرات عند استدعاء SaveChangesAsync()."],
    followUpQuestions: ["كيف تضبط سلوك عدم التتبع كافتراضي لكامل سياق قاعدة البيانات عبر QueryTrackingBehavior.NoTracking؟"],
    sources: [{ title: "Microsoft Learn — Tracking vs. No-Tracking Queries in EF Core", url: "https://learn.microsoft.com/en-us/ef/core/querying/tracking" }],
  },
  {
    id: "nef-002",
    slug: "efcore-n-plus-one-and-include-split-queries",
    topicId: "dotnet-efcore",
    difficulty: "Mid",
    question: "ما هي مشكلة الـ Cartesian Explosion عند تضمين عدة علاقات بـ Include وكيف تحلها تقنية Split Queries؟",
    shortAnswer: "تحدث عندما يُولد Include المتعدد استعلام JOIN عملاقاً يضاعف الصفوف المسترجعة بشكل أسي؛ وتحلها AsSplitQuery() بتقسيم الاستعلام إلى استعلامات SQL منفصلة لكل علاقة.",
    explanation: "إذا كان لدى المدونة مقالات، وكل مقال يحتوي تعليقات ووسوماً، فإن استعلام .Include(p => p.Comments).Include(p => p.Tags) يولد استعلام SQL واحد يحتوي على عدة LEFT JOINs. إذا كان للمقال 20 تعليقاً و10 وسوم، سيعيد خادم SQL عدد 200 صف لنفس المقال مكرراً نصوصه (انفجار ديكارتي). ميزة AsSplitQuery() تفصل العملية لاستعلامات مستقلة تجلب المقالات، ثم التعليقات، ثم الوسوم، وتجمعها في الذاكرة بكفاءة وأمان.",
    codeExample: `var blogs = await dbContext.Blogs
    .Include(b => b.Posts)
        .ThenInclude(p => p.Comments)
    .AsSplitQuery() // يمنع الانفجار الديكارتي ويسرع الشبكة
    .ToListAsync();`,
    commonMistakes: ["استخدام AsSplitQuery دون التأكد من أن قاعدة البيانات تدعم التناسق أو في حالات غياب المعاملات عند تحديث البيانات أثناء القراءة."],
    followUpQuestions: ["كيف تفعل Split Queries كإعداد افتراضي لكامل الـ DbContext؟"],
    sources: [{ title: "Microsoft Learn — Single vs. Split Queries in EF Core", url: "https://learn.microsoft.com/en-us/ef/core/querying/single-split-queries" }],
  },
  {
    id: "nef-003",
    slug: "efcore-dbcontext-threading-and-pooling",
    topicId: "dotnet-efcore",
    difficulty: "Senior",
    question: "لماذا لا يعد DbContext آمناً للخيوط المتزامنة (Not Thread-Safe) وما هي ميزة DbContext Pooling؟",
    shortAnswer: "لا يمكن استخدام نفس نسخة DbContext في عمليتين غير متزامنتين معاً في نفس اللحظة؛ وميزة AddDbContextPool تعيد استخدام نسخ السياق المفتوحة مسبقاً لتوفير كلفة إنشائها المتكرر.",
    explanation: "الـ DbContext يحتفظ بحالة اتصال ومتبع تغييرات غير محمي بأقفال متزامنة. إذا حاولت تشغيل استعلامين بـ Task.WhenAll(db.Users.ToListAsync(), db.Orders.ToListAsync()) على نفس النسخة، سيرمي EF Core خطأ فورياً. ميزة AddDbContextPool تحتفظ بحمام نُسخ مفحوصة ومنظفة من الـ DbContext وتعيد تدويرها بين طلبات الـ HTTP، مما يرفع كفاءة معالجة الطلبات في الثانية بنسبة ملحوظة.",
    codeExample: `// تفعيل حمام DbContext
builder.Services.AddDbContextPool<AppDbContext>(options =>
    options.UseSqlServer(connectionString));`,
    commonMistakes: ["مشاركة نسخة واحدة من DbContext عبر عدة خيوط متزامنة أو تخزينها كـ Singleton."],
    followUpQuestions: ["ما الشروط الواجب توفرها في فئة DbContext لتكون متوافقة مع الـ DbContext Pooling (مثل عدم الاحتفاظ بحالة داخلية خاصة)؟"],
    sources: [{ title: "Microsoft Learn — DbContext Pooling", url: "https://learn.microsoft.com/en-us/ef/core/performance/advanced-performance-topics#dbcontext-pooling" }],
  },
  {
    id: "nef-004",
    slug: "efcore-global-query-filters-and-soft-delete",
    topicId: "dotnet-efcore",
    difficulty: "Mid",
    question: "كيف تطبق مرشحات الاستعلام العامة (Global Query Filters) لتنفيذ الحذف اللين والـ Multi-Tenancy في EF Core؟",
    shortAnswer: "بتعريف شرط بـ HasQueryFilter داخل OnModelCreating يدمج شرط WHERE تلقائياً في كل استعلامات النموذج ما لم يُعطل بـ IgnoreQueryFilters().",
    explanation: "تضمن Global Query Filters عدم نسيان شرط الأمان أو الحذف اللين في أي مكان في التطبيق. بتحديد modelBuilder.Entity<Order>().HasQueryFilter(o => !o.IsDeleted && o.TenantId == _tenantId)، يضمن EF Core أن كل استعلام SELECT (بما في ذلك العلاقات عبر Include) سيحتوي تلقائياً على هذه الشروط، مانعاً تسريب بيانات مستأجر لآخر.",
    codeExample: `protected override void OnModelCreating(ModelBuilder modelBuilder) {
    modelBuilder.Entity<User>()
        .HasQueryFilter(u => !u.IsDeleted);
}
// لطلب المحذوفات عمداً:
var allUsers = await db.Users.IgnoreQueryFilters().ToListAsync();`,
    commonMistakes: ["عدم توفير فهارس مركبة تشمل أعمدة الـ Query Filters (مثل IsDeleted و TenantId) مما يبطئ كل استعلامات النظام."],
    followUpQuestions: ["كيف تتأكد من أن التنقل بين المستأجرين (Tenant Change) يحدث بأمان داخل DbContext ذي النطاق المشترك؟"],
    sources: [{ title: "Microsoft Learn — Global Query Filters in EF Core", url: "https://learn.microsoft.com/en-us/ef/core/querying/filters" }],
  },
  {
    id: "nef-005",
    slug: "efcore-migrations-in-production-and-bundles",
    topicId: "dotnet-efcore",
    difficulty: "Senior",
    question: "لماذا يحذر من استخدام Database.Migrate() التلقائي عند إقلاع السيرفر وما هي Migration Bundles؟",
    shortAnswer: "لأنه يفشل في الخوادم المتعددة المتزامنة مسبباً تعارض أقفال وقد يسقط التطبيق؛ وMigration Bundles هي ملف تنفيذي مستقل يُشغل في خطوط الـ CI/CD قبل نشر الكود.",
    explanation: "إذا كان لديك 10 نسخ من تطبيقك تقلع معاً في Kubernetes واستدعت جميعها db.Database.Migrate()، ستحاول جميعها تعديل جدول المخطط في نفس اللحظة، مما يسبب أقفالاً ميتة أو فشل الإقلاع بالكامل. الممارسة الاحترافية في DevOps هي إنشاء Migration Bundle ملف تنفيذي مستقل عبر dotnet ef migrations bundle وتشغيله كخطوة منفصلة مسبقة في خط النشر قبل تشغيل الحاويات الجديدة.",
    codeExample: `// توليد ملف الترحيل التنفيذي المستقل:
// dotnet ef migrations bundle --output efbundle
// تشغيله في الـ CI/CD:
// ./efbundle --connection "Server=...;"`,
    commonMistakes: ["تشغيل الترحيلات التلقائية أثناء استقبال زيارات حقيقية للمستخدمين دون التحقق من التوافق الخلفي للجداول."],
    followUpQuestions: ["كيف تولد سكريبتات SQL مسبقة الترحيل عبر dotnet ef migrations script لفحصها بواسطة مديري قواعد البيانات؟"],
    sources: [{ title: "Microsoft Learn — Applying Migrations in Production", url: "https://learn.microsoft.com/en-us/ef/core/managing-schemas/migrations/applying" }],
  },
  {
    id: "nef-006",
    slug: "efcore-raw-sql-queries-and-sqlinjection",
    topicId: "nef-006",
    difficulty: "Mid",
    question: "ما الفرق بين FromSqlInterpolated و FromSqlRaw في EF Core وأيهما آمن ضد SQL Injection؟",
    shortAnswer: "FromSqlInterpolated آمن تلقائياً لأنه يحول متغيرات السلسلة النصية إلى معلمات SqlParameter مجهزة، بينما FromSqlRaw يعامل السلسلة كنص خام ويعرضك للحقن إذا دمجت متغيرات.",
    explanation: "يقوم FromSqlInterpolated باستغلال نوع FormattableString في C#؛ فعندما تكتب $\"WHERE Name = {input}\"، لا يقوم بدمج النص بل يستخرج المعامل ويستبدله بـ @p0 ويرسل القيمة كمعامل منفصل محمي تماماً. في المقابل، إذا استخدمت FromSqlRaw ودمجت النصوص بـ +، سيتم حقن الأوامر التخريبية مباشرة في محرك قاعدة البيانات.",
    codeExample: `// آمن تماماً ضد SQL Injection (يولد SqlParameter تلقائياً)
var users = await db.Users
    .FromSqlInterpolated($"SELECT * FROM Users WHERE City = {city}")
    .ToListAsync();`,
    commonMistakes: ["استخدام FromSqlRaw مع string concatenation بحجة أن القيمة تم فحصها مسبقاً."],
    followUpQuestions: ["ما هي القيود المفروضة على بنية الأعمدة المعادة من استعلامات FromSql لتتوافق مع نموذج الكيان؟"],
    sources: [{ title: "Microsoft Learn — Raw SQL Queries in EF Core", url: "https://learn.microsoft.com/en-us/ef/core/querying/raw-sql" }],
  },
  {
    id: "nef-007",
    slug: "efcore-concurrency-conflicts-and-rowversion",
    topicId: "nef-007",
    difficulty: "Senior",
    question: "كيف تطبق القفل التفاؤلي (Optimistic Concurrency) وحل التعارضات باستخدام RowVersion في EF Core؟",
    shortAnswer: "بإضافة خاصية [Timestamp] byte[] RowVersion للنموذج؛ حيث يرفض التحديث ويرمي DbUpdateConcurrencyException إذا قام مستخدم آخر بتعديل السجل أثناء قراءتك له.",
    explanation: "في القفل التفاؤلي، لا يتم حجز أقفال على قاعدة البيانات أثناء قراءة المستخدم للبيانات. يقوم عمود RowVersion (أو xmin في PostgreSQL) بتوليد قيمة ثنائية جديدة تلقائياً مع كل تعديل للصف. عند الحفظ، ينفذ EF Core استعلام UPDATE ... WHERE Id = @id AND RowVersion = @originalRowVersion. إذا تغيرت البصمة، لا يتأثر أي صف ويرمي EF Core استثناء التعارض لتتمكن من دمج التعديلات أو إشعار المستخدم.",
    codeExample: `public class BankAccount {
    public int Id { get; set; }
    public decimal Balance { get; set; }

    [Timestamp]
    public byte[] RowVersion { get; set; } = null!;
}`,
    commonMistakes: ["تجاهل التقاط DbUpdateConcurrencyException مما يؤدي لفقدان بيانات المستخدمين وإعادة الكتابة فوقها (Blind Overwrite)."],
    followUpQuestions: ["كيف تستخدم خاصية entry.OriginalValues و entry.CurrentValues و entry.GetDatabaseValues() لحل التعارض برمجياً؟"],
    sources: [{ title: "Microsoft Learn — Handling Concurrency Conflicts in EF Core", url: "https://learn.microsoft.com/en-us/ef/core/saving/concurrency" }],
  },
  {
    id: "nef-008",
    slug: "efcore-compiled-queries-performance",
    topicId: "nef-008",
    difficulty: "Senior",
    question: "ما هي الاستعلامات المجمعة مسبقاً (Compiled Queries) في EF Core ومتى تستحق استخدامها؟",
    shortAnswer: "استعلامات تجمع شجرة تعبيرات LINQ إلى دالة مفوضة جاهزة مسبقاً، لتفادي تكلفة تحليل وترجمة LINQ إلى SQL مع كل استدعاء متكرر لنفس المسار.",
    explanation: "مع أن EF Core يخزن استعلامات SQL الناتجة مؤقتاً، إلا أن مطابقة شجرة LINQ وبناء خطة التنفيذ في كل استدعاء يستهلك وقتاً طفيفاً. باستخدام EF.CompileAsyncQuery()، يتم تجميع الاستعلام مرة واحدة في حقل إستاتيكي، مما يتيح تنفيذه مباشرة بأزمنة استجابة خارقة تضاهي سرعة ميكرو-ORMs مثل Dapper في المسارات الحيوية متكررة الاستدعاء.",
    codeExample: `private static readonly Func<AppDbContext, int, Task<User?>> GetUserCompiled =
    EF.CompileAsyncQuery((AppDbContext db, int id) =>
        db.Users.AsNoTracking().FirstOrDefault(u => u.Id == id));

// الاستخدام الفائق السرعة:
var user = await GetUserCompiled(dbContext, userId);`,
    commonMistakes: ["تجميع كل استعلامات التطبيق مسبقاً دون حاجة حقيقية، متناسين تعقيد الكود وعدم الحاجة لذلك إلا في مسارات الـ Hot Paths."],
    followUpQuestions: ["ما القيود البرمجية التي تمنع استخدام Compiled Queries مع استعلامات LINQ الديناميكية متغيرة الشروط؟"],
    sources: [{ title: "Microsoft Learn — Compiled queries in EF Core", url: "https://learn.microsoft.com/en-us/ef/core/performance/advanced-performance-topics#compiled-queries" }],
  },
  {
    id: "nef-009",
    slug: "efcore-bulk-operations-executeupdate-executedelete",
    topicId: "nef-009",
    difficulty: "Mid",
    question: "كيف توفر دوال ExecuteUpdate و ExecuteDelete في EF Core 7+ أداءً ثورياً للعمليات الجماعية؟",
    shortAnswer: "تنفذ أوامر UPDATE و DELETE مباشرة في قاعدة البيانات في استعلام واحد دون الحاجة لتحميل السجلات إلى الذاكرة وتتبعها وحفظها بـ SaveChanges().",
    explanation: "قديماً، لحذف 1,000 مستخدم خامل، كان المطور يضطر لجلب 1,000 كائن في ذاكرة الخادم، وإخبار الـ Change Tracker بحذف كل منها، ثم استدعاء SaveChanges() مما يولد 1,000 أمر SQL منفصل. دوال ExecuteUpdateAsync و ExecuteDeleteAsync تترجم شروط LINQ مباشرة إلى استعلام SQL واحد صريح: DELETE FROM Users WHERE LastLogin < @date، وتنفذ في بضعة مللي ثوانٍ مع صفر استهلاك لذاكرة الخادم.",
    codeExample: `// حذف جماعي فوري باستعلام واحد دون تحميل الكائنات
await dbContext.Users
    .Where(u => !u.IsActive && u.CreatedAt < cutoffDate)
    .ExecuteDeleteAsync();`,
    commonMistakes: ["توقع أن ExecuteUpdate و ExecuteDelete ستطلق أحداث وتحديثات الـ Change Tracker في الذاكرة؛ هي تتجاوز الذاكرة تماماً."],
    followUpQuestions: ["كيف تستخدم ExecuteUpdateAsync لتعديل خصائص متعددة في استعلام واحد عبر SetProperty؟"],
    sources: [{ title: "Microsoft Learn — ExecuteUpdate and ExecuteDelete in EF Core", url: "https://learn.microsoft.com/en-us/ef/core/saving/execute-insert-update-delete" }],
  },
  {
    id: "nef-010",
    slug: "efcore-table-per-hierarchy-tph-vs-tpt",
    topicId: "nef-010",
    difficulty: "Senior",
    question: "قارن بين استراتيجيات الوراثة في EF Core: Table-Per-Hierarchy (TPH) و Table-Per-Type (TPT).",
    shortAnswer: "TPH تخزن كل الفئات المشتقة في جدول واحد باستخدام عمود تمييز (Discriminator) وهي الأسرع، بينما TPT تنشئ جدولاً لكل فئة فرعية وتربطها بـ JOIN وهي أبطأ في الاستعلامات المعقدة.",
    explanation: "الاستراتيجية الافتراضية في EF Core هي TPH؛ فإذا كان لديك كلاس أساسي Payment وكلاسين مشتقين CreditCardPayment و PaypalPayment، يتم حفظ الجميع في جدول واحد Payments مع عمود Discriminator يحدد النوع. تتميز TPH بالسرعة القصوى لعدم الحاجة لـ JOINs، ولكن عيبها هو وجود أعمدة فارغة (Nullable). في المقابل، توفر TPT تطبيعاً تاماً لقاعدة البيانات لكنها تتطلب استعلامات JOIN معقدة ومكلفة جداً مع تفرع الوراثة.",
    codeExample: `// تكوين TPH الافتراضي الأسرع
modelBuilder.Entity<Payment>()
    .HasDiscriminator<string>("payment_type")
    .HasValue<CreditCardPayment>("credit_card")
    .HasValue<PaypalPayment>("paypal");`,
    commonMistakes: ["اختيار TPT في المشاريع الضخمة دون إدراك أن استعلام جلب قائمة الكيانات سينفذ استعلامات JOIN بطيئة جداً عبر عشرات الجداول."],
    followUpQuestions: ["ما هي استراتيجية Table-Per-Concrete-Type (TPC) المضافة في EF Core 7 ومتى تفضلها على TPH؟"],
    sources: [{ title: "Microsoft Learn — Inheritance mapping in EF Core", url: "https://learn.microsoft.com/en-us/ef/core/modeling/inheritance" }],
  },

  // Topic: dotnet-async (10 questions: nasyncnet-001 to nasyncnet-010)
  {
    id: "nasyncnet-001",
    slug: "dotnet-async-task-vs-valuetask",
    topicId: "dotnet-async",
    difficulty: "Mid",
    question: "ما الفرق بين Task<T> و ValueTask<T> ومتى يجب اختيار ValueTask في دوال C#؟",
    shortAnswer: "الـ Task هو كائن Reference Type يحجز مساحة في الـ Heap مع كل إنشاء، بينما ValueTask هو struct يوفر صفر تخصيص في الذاكرة عندما تكتمل العملية تزامناً من الكاش.",
    explanation: "في الدوال التي تُستدعى ملايين المرات وتكتمل نتيجتها غالباً من الـ Memory Cache أو Buffer دون انتظار فعلي للشبكة، فإن إرجاع new Task<T>() يولد ملايين الكائنات غير الضرورية في الـ Heap. بنية ValueTask<T> تعالج ذلك؛ فإذا كانت البيانات جاهزة فوراً، تعاد القيمة في الـ Stack بصفر تكلفة للـ GC، ولا يُنشأ كائن Task في الـ Heap إلا عند الانتظار الفعلي للـ I/O غير المتزامن.",
    codeExample: `public ValueTask<string> GetCachedDataAsync(string key) {
    if (_cache.TryGetValue(key, out var val)) {
        return ValueTask.FromResult(val); // صفر حجز في الـ Heap
    }
    return new ValueTask<string>(FetchFromNetworkAsync(key));
}`,
    commonMistakes: ["استدعاء await مرتين على نفس كائن ValueTask أو استدعاء .AsTask() دون داعٍ حيث إن ValueTask لا تدعم تكرار الـ await."],
    followUpQuestions: ["لماذا يحظر تخزين ValueTask في متغيرات وانتظارها لاحقاً عبر Task.WhenAll؟"],
    sources: [{ title: "Microsoft Learn — Understanding the Whys, Whats, and Whens of ValueTask", url: "https://learn.microsoft.com/en-us/dotnet/api/system.threading.tasks.valuetask-1" }],
  },
  {
    id: "nasyncnet-002",
    slug: "dotnet-async-configureawait-false",
    topicId: "dotnet-async",
    difficulty: "Senior",
    question: "ما هو دور ConfigureAwait(false) ولماذا كان إلزامياً في تطبيقات المكتب والمكتبات وتغير دوره في ASP.NET Core؟",
    shortAnswer: "يوجه المحرك بعدم العودة إلى نفس الـ SynchronizationContext الأصلي بعد انتهاء الـ await؛ وكان يمنع الـ Deadlocks في تطبيقات واجهات المستخدم والمكتبات.",
    explanation: "في بيئات مثل WPF أو ASP.NET الكلاسيكي، كان يوجد SynchronizationContext يفرض تنفيذ ما بعد await على نفس الخيط الأساسي. إذا استخدم كود متزامن .Result، واستدعى الكود الداخلي await، فإنه ينتظر الخيط الأساسي المحجوز مسبقاً وتحدث Deadlock. كتابة ConfigureAwait(false) تتيح استئناف التنفيذ على أي خيط متاح من الـ ThreadPool. في ASP.NET Core الحديث، أُلغي الـ SynchronizationContext تماماً، لكن يظل استخدام ConfigureAwait(false) ممارسة مثالية وموصى بها في كتابة المكتبات العامة (Class Libraries).",
    codeExample: `// في المكتبات المشتركة:
await httpClient.GetStringAsync(url).ConfigureAwait(false);`,
    commonMistakes: ["الاعتقاد بأن عدم كتابة ConfigureAwait(false) في ASP.NET Core سيسبب Deadlock؛ الـ SynchronizationContext غير موجود أصلاً في ASP.NET Core."],
    followUpQuestions: ["كيف يؤثر ConfigureAwait(false) على تدفق سياق AsyncLocal والمصادقة في نفس مسار الطلب؟"],
    sources: [{ title: "Microsoft Learn — ConfigureAwait FAQ", url: "https://learn.microsoft.com/en-us/dotnet/fundamentals/code-analysis/quality-rules/ca2007" }],
  },
  {
    id: "nasyncnet-003",
    slug: "dotnet-async-cancellationtoken-propagation",
    topicId: "dotnet-async",
    difficulty: "Junior",
    question: "كيف تمرر وتتعامل مع CancellationToken في سلاسل استدعاءات الدوال غير المتزامنة بـ ASP.NET Core؟",
    shortAnswer: "تستقبل الرمز في معلمات المتحكم وتمرره تكرارياً لجميع دوال الـ async وقواعد البيانات، لإلغاء العمليات وتحرير الموارد فور إغلاق العميل للمتصفح.",
    explanation: "عندما يطلب مستخدم تقريراً يستغرق 30 ثانية ثم يغلق الصفحة بعد ثانيتين، فإن عدم تمرير CancellationToken يجعل الخادم يواصل استعلام قاعدة البيانات وحساب العمليات حتى النهاية دون فائدة. استقبال CancellationToken cancellationToken في الـ Action وتمريره لـ ToListAsync(cancellationToken) يوقف استعلام SQL في الخادم فور انقطاع اتصال العميل ويرمي OperationCanceledException محرراً الموارد فوراً.",
    codeExample: `[HttpGet("export")]
public async Task<IActionResult> Export(CancellationToken ct) {
    var data = await db.Reports.ToListAsync(ct); // يتوقف فوراً إذا أغلق المستخدم المتصفح
    return Ok(data);
}`,
    commonMistakes: ["ابتلاع OperationCanceledException في كتل catch عادية ومعاملتها كخطأ 500 غير متوقع للخادم."],
    followUpQuestions: ["كيف تنشئ رمز إلغاء مرتبطاً بمهلة زمنية قصوى عبر CancellationTokenSource.CreateLinkedTokenSource؟"],
    sources: [{ title: "Microsoft Learn — Recommended guidelines for CancellationToken", url: "https://learn.microsoft.com/en-us/dotnet/standard/threading/cancellation-in-managed-threads" }],
  },
  {
    id: "nasyncnet-004",
    slug: "dotnet-async-task-whenall-vs-waitall",
    topicId: "dotnet-async",
    difficulty: "Junior",
    question: "ما الفرق بين Task.WhenAll و Task.WaitAll في إدارة المهام المتزامنة بـ C#؟",
    shortAnswer: "الـ Task.WhenAll غير حاجزة وتعيد Task يمكن انتظاره بـ await دون تعطيل الخيط، بينما Task.WaitAll متزامنة وتحجب الخيط بالكامل حتى اكتمال جميع المهام.",
    explanation: "لتشغيل عدة طلبات خارجية بالتوازي (مثل جلب بيانات مستخدم، ورصيده، وسجل طلباته في نفس اللحظة)، تطلق المهام وتجمعها في مصفوفة. استخدام await Task.WhenAll(t1, t2, t3) يحرر خيط الخادم لخدمة عملاء آخرين حتى تنتهي العمليات الثلاث. في المقابل، فإن Task.WaitAll تجمد الخيط الحالي في مكانها مسببة استنزاف الـ ThreadPool.",
    codeExample: `var userTask = userService.GetAsync(id);
var ordersTask = orderService.GetAsync(id);

// تنفيذ متوازي حقيقي دون حجب الخيط
await Task.WhenAll(userTask, ordersTask);
var user = await userTask;
var orders = await ordersTask;`,
    commonMistakes: ["استخدام await أمام كل مهمة فور استدعائها (await task1; await task2;) مما يجعلها تنفذ متسلسلة ويلغي التوازي تماماً."],
    followUpQuestions: ["كيف تلتقط جميع الاستثناءات الناتجة عن مهام متعددة فشلت معاً داخل Task.WhenAll عبر task.Exception.InnerExceptions؟"],
    sources: [{ title: "Microsoft Learn — Task.WhenAll method", url: "https://learn.microsoft.com/en-us/dotnet/api/system.threading.tasks.task.whenall" }],
  },
  {
    id: "nasyncnet-005",
    slug: "dotnet-async-semaphoreslim-for-throttling",
    topicId: "dotnet-async",
    difficulty: "Senior",
    question: "كيف تستخدم SemaphoreSlim للتحكم في التزامن (Concurrency Throttling) وحماية الموارد الحساسة في كود الـ async؟",
    shortAnswer: "تستخدم كقفل غير حاجب يسمح لعدد محدد من الخيوط بدخول الكتلة الحرجة عبر await semaphore.WaitAsync() وتحريره دائماً بـ semaphore.Release() في finally.",
    explanation: "كلمة lock في C# متزامنة تماماً ولا يمكن استخدام await بداخلها. فئة SemaphoreSlim حلت هذه المعضلة؛ فهي توفر دالة WaitAsync() غير حاجبة للخيوط. إذا حددت الحجم بـ (1, 1)، فإنها تعمل كـ Async Lock حصري لطلب واحد. وإذا حددت الحجم بـ (10, 10)، فإنها تعمل كبوابة تمنع تشغيل أكثر من 10 استدعاءات متزامنة في نفس اللحظة لحماية الخوادم الخارجية من الاختناق.",
    codeExample: `private static readonly SemaphoreSlim _gate = new(initialCount: 5, maxCount: 5);

public async Task<Data> FetchThrottledAsync() {
    await _gate.WaitAsync();
    try {
        return await CallExternalServiceAsync();
    } finally {
        _gate.Release(); // إلزامي دائماً في finally
    }
}`,
    commonMistakes: ["نسيان وضع _gate.Release() داخل كتلة finally، مما يؤدي لنفاد تصاريح الـ Semaphore تدريجياً وتعليق النظام للأبد."],
    followUpQuestions: ["ما الفرق بين SemaphoreSlim المخصص لنفس العملية و Semaphore النظامي المشترك عبر عدة برامج نظام تشغيل؟"],
    sources: [{ title: "Microsoft Learn — Semaphore and SemaphoreSlim", url: "https://learn.microsoft.com/en-us/dotnet/api/system.threading.semaphoreslim" }],
  },
  {
    id: "nasyncnet-006",
    slug: "dotnet-async-channels-producer-consumer",
    topicId: "dotnet-async",
    difficulty: "Senior",
    question: "كيف تعمل مكتبة System.Threading.Channels وما هي مميزاتها لتطبيق نمط المنتج والمستهلك (Producer-Consumer)؟",
    shortAnswer: "توفر قنوات تدفق بيانات غير متزامنة عالية الأداء وخالية من الأقفال (Lock-Free) لنقل البيانات بين خيوط الإنتاج والاستهلاك مع دعم كامل للـ Backpressure.",
    explanation: "بدلاً من استخدام BlockingCollection الكلاسيكية التي تحجب الخيوط، صُممت Channels لتكون متوافقة بالكامل مع نموذج async/await الحديث. يمكنك إنشاء Channel.CreateBounded<T>(1000) لتحديد سعة المخزن؛ فإذا حاول المنتج الكتابة والمخزن ممتلئ، ينتظر غير متزامن بـ await writer.WriteAsync() دون تجميد الخيط، بينما يقرأ المستهلكون التدفق بسلاسة عبر await foreach.",
    codeExample: `var channel = Channel.CreateBounded<Order>(100);

// منتج يكتب
await channel.Writer.WriteAsync(new Order());

// مستهلك يقرأ
await foreach (var order in channel.Reader.ReadAllAsync()) {
    await ProcessOrderAsync(order);
}`,
    commonMistakes: ["استخدام Unbounded Channels دون سقف أقصى للذاكرة مما يهدد بنفاد الذاكرة في حال تفوق سرعة الإنتاج على الاستهلاك."],
    followUpQuestions: ["كيف تزيد كفاءة القنوات بضبط خيارات SingleReader و SingleWriter؟"],
    sources: [{ title: "Microsoft Learn — An Introduction to System.Threading.Channels", url: "https://learn.microsoft.com/en-us/dotnet/core/extensions/channels" }],
  },
  {
    id: "nasyncnet-007",
    slug: "dotnet-async-iasyncenumerable-streaming",
    topicId: "dotnet-async",
    difficulty: "Mid",
    question: "ما هي واجهة IAsyncEnumerable<T> وكيف تتيح تدفق نتائج البيانات الكبيرة في ASP.NET Core؟",
    shortAnswer: "تمثل مكرراً غير متزامن يجمع بين الـ Async والـ Yield، مما يتيح تدفق السجلات للعميل سطراً بسطر فور توفرها دون انتظار تحميل كامل القائمة في الذاكرة.",
    explanation: "قديماً، كان إرجاع قائمة بيانات ضخمة يتطلب جلب كل السجلات في Task<List<T>> قبل إرسال أول بايت للعميل. باستخدام IAsyncEnumerable<T> وحلقة await foreach، يستطيع السيرفر قراءة السجلات من قاعدة البيانات وتدفقها مباشرة كـ JSON Stream للعميل فور جهوزيتها، مما يخفض زمن استلام أول بايت (TTFB) ويحافظ على ذاكرة السيرفر.",
    codeExample: `[HttpGet("stream")]
public async IAsyncEnumerable<ProductDto> StreamProducts([EnumeratorCancellation] CancellationToken ct) {
    await foreach (var p in db.Products.AsAsyncEnumerable().WithCancellation(ct)) {
        yield return new ProductDto(p.Id, p.Name);
    }
}`,
    commonMistakes: ["نسيان إضافة سمة [EnumeratorCancellation] لمعامل الـ CancellationToken في دالة الـ IAsyncEnumerable."],
    followUpQuestions: ["كيف تدعم المتصفحات قراءة استجابات IAsyncEnumerable المتدفقة عبر Fetch API Streams؟"],
    sources: [{ title: "Microsoft Learn — IAsyncEnumerable<T> Interface", url: "https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.iasyncenumerable-1" }],
  },
  {
    id: "nasyncnet-008",
    slug: "dotnet-async-threadlocal-vs-asynclocal",
    topicId: "dotnet-async",
    difficulty: "Senior",
    question: "ما الفرق الجوهري بين ThreadLocal<T> و AsyncLocal<T> في بيئات المعالجة غير المتزامنة بـ .NET؟",
    shortAnswer: "الـ ThreadLocal يربط القيمة بخيط نظام التشغيل الحالي ويفقد سياقه عند تبديل الخيوط بعد await، بينما AsyncLocal يتدفق مع سياق التنفيذ المنطقي عبر كل خيوط الـ await.",
    explanation: "في البرمجة غير المتزامنة، ينتقل تنفيذ ما بعد await غالباً إلى خيط مختلف من خيوط الـ ThreadPool. إذا استخدمت ThreadLocal لحفظ معرف الطلب أو المستخدم، ستفقد القيمة أو تقرأ قيمة خيط آخر فور أول await. فئة AsyncLocal<T> صُممت خصيصاً لتتدفق مع الـ ExecutionContext؛ فحيثما انتقل كود الـ async عبر الخيوط، ترافقه القيمة المنطقية بأمان وتناسق.",
    codeExample: `private static readonly AsyncLocal<string> _traceId = new();

public async Task Process() {
    _traceId.Value = Guid.NewGuid().ToString();
    await Task.Delay(100); // قد يعود التنفيذ على خيط آخر تماماً
    Console.WriteLine(_traceId.Value); // تظل القيمة محفوظة بدقة
}`,
    commonMistakes: ["استخدام ThreadLocal لتخزين سياق طلب الـ HTTP في خوادم الويب غير المتزامنة الحديثة."],
    followUpQuestions: ["كيف يمنع استدعاء ExecutionContext.SuppressFlow() تدفق السياق غير المتزامن لحماية الأمان أو زيادة الأداء؟"],
    sources: [{ title: "Microsoft Learn — AsyncLocal<T> Class", url: "https://learn.microsoft.com/en-us/dotnet/api/system.threading.asynclocal-1" }],
  },
  {
    id: "nasyncnet-009",
    slug: "dotnet-async-void-hazards-and-exceptions",
    topicId: "dotnet-async",
    difficulty: "Junior",
    question: "لماذا يحظر استخدام async void في C# وما هو الاستثناء الوحيد المقبول لاستخدامها؟",
    shortAnswer: "يحظر لأن الأخطاء التي تقع داخل async void لا يمكن التقاطها بكتل try/catch الخارجية وتسقط التطبيق فوراً؛ والاستثناء المقبول الوحيد هو معالجات الأحداث (Event Handlers).",
    explanation: "الدوال غير المتزامنة يجب أن تعيد دائماً Task أو Task<T> لتتيح للمستدعي انتظارها بـ await والتقاط أي استثناء داخل كتلة try/catch. عندما تعيد الدالة async void، لا يمتلك المستدعي أي كائن Task ليتتبعه، وأي استثناء غير معالج بداخلها يُرمى مباشرة على الـ SynchronizationContext ويسقط عملية الخادم بالكامل كخطأ غير معالج.",
    codeExample: `// خطأ فادح: يسقط السيرفر ولا يمكن التقاط خطئه
public async void ProcessBad() {
    throw new Exception("Crash");
}

// الطريقة الصحيحة دائماً:
public async Task ProcessGood() {
    throw new Exception("Safely caught");
}`,
    commonMistakes: ["كتابة async void في مسارات الـ Background Tasks أو دوال المتحكمات."],
    followUpQuestions: ["كيف تكتب اختبار وحدة لدالة async void ولماذا يعد ذلك شبه مستحيل بالطرق التقليدية؟"],
    sources: [{ title: "Microsoft Learn — Async Return Types (C#)", url: "https://learn.microsoft.com/en-us/dotnet/csharp/asynchronous-programming/async-return-types" }],
  },
  {
    id: "nasyncnet-010",
    slug: "dotnet-async-parallel-foreachasync",
    topicId: "dotnet-async",
    difficulty: "Mid",
    question: "كيف تنفذ معالجة متوازية للمهام غير المتزامنة باستخدام Parallel.ForEachAsync في .NET 6+؟",
    shortAnswer: "توفر دالة رسمية لتنفيذ مجموعة عناصر متوازية مع كود async وتحديد سقف دقيق لعدد الخيوط المتزامنة بـ MaxDegreeOfParallelism ودعم الإلغاء.",
    explanation: "قديماً كان Parallel.ForEach الكلاسيكي محصوراً في الكود المتزامن فقط ويحجب الخيوط. أضافت .NET ميزة Parallel.ForEachAsync المصممة للـ async/await؛ حيث تتيح معالجة مصفوفة ضخمة مع تقييد عدد المهام غير المتزامنة التي تجري في نفس اللحظة (مثلاً 8 مهام بالتوازي) وتمرير CancellationToken لإلغاء المعالجة فوراً.",
    codeExample: `await Parallel.ForEachAsync(urls, new ParallelOptions { MaxDegreeOfParallelism = 8 }, async (url, ct) => {
    var content = await httpClient.GetStringAsync(url, ct);
    await ProcessContentAsync(content, ct);
});`,
    commonMistakes: ["استخدام Parallel.ForEach الكلاسيكي القديم مع كود غير متزامن عبر async void داخل المعامل مما يفشل في انتظار العمليات."],
    followUpQuestions: ["ما الفرق الأدائي بين Parallel.ForEachAsync و Task.WhenAll مع تقسيم البيانات إلى دفعات (Batching)؟"],
    sources: [{ title: "Microsoft Learn — Parallel.ForEachAsync Method", url: "https://learn.microsoft.com/en-us/dotnet/api/system.threading.tasks.parallel.foreachasync" }],
  },

  // Topic: dotnet-security (10 questions: nsecnet-001 to nsecnet-010)
  {
    id: "nsecnet-001",
    slug: "dotnet-jwt-authentication-and-validation-parameters",
    topicId: "dotnet-security",
    difficulty: "Mid",
    question: "كيف تضبط إعدادات التحقق من رموز JWT بأمان في TokenValidationParameters بـ ASP.NET Core؟",
    shortAnswer: "بتفعيل التحقق الصارم من التوقيع (ValidateIssuerSigningKey)، والنطاق (ValidateIssuer)، والجمهور المستهدف (ValidateAudience)، وتعيين ClockSkew لصفر.",
    explanation: "حزمة JwtBearer توفر التحقق التلقائي من التوكن عبر Middleware. الأمان الصارم يتطلب تعيين ValidateLifetime: true وتخفيض ClockSkew الافتراضي (وهو 5 دقائق) إلى TimeSpan.Zero لمنع قبول التوكن بعد لحظة انتهاء صلاحيته الفعلية، وتحديد ValidateIssuer و ValidateAudience بدقة لمنع استخدام توكن مصدر لنظام آخر في نظامك.",
    codeExample: `builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        options.TokenValidationParameters = new TokenValidationParameters {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
            ValidateIssuer = true,
            ValidIssuer = "https://my-auth.com",
            ValidateAudience = true,
            ValidAudience = "my-api",
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero // إلغاء مهلة السماح الإضافية
        };
    });`,
    commonMistakes: ["ترك ClockSkew بالقيمة الافتراضية (5 دقائق) في أنظمة تتطلب إبطالاً دقيقاً وسريعاً لصلاحية الجلسات."],
    followUpQuestions: ["كيف تتعامل مع تجديد الرموز المنتهية عبر آلية Refresh Tokens في ASP.NET Core Web API؟"],
    sources: [{ title: "Microsoft Learn — Overview of ASP.NET Core authentication", url: "https://learn.microsoft.com/en-us/aspnet/core/security/authentication/" }],
  },
  {
    id: "nsecnet-002",
    slug: "dotnet-policy-based-and-claims-authorization",
    topicId: "dotnet-security",
    difficulty: "Mid",
    question: "كيف تطبق الصلاحيات المعتمدة على السياسات (Policy-Based Authorization) وحقن متطلبات IAuthorizationRequirement؟",
    shortAnswer: "تُعرف سياسات في AddAuthorization تقبل متطلبات خاصة (Requirements)، وتنفذ فئة AuthorizationHandler لفحص شروط معقدة مثل مطابقة ملكية المورد أو السن.",
    explanation: "بدلاً من تقييد التطبيق بالأدوار الثابتة القديمة [Authorize(Roles = 'Admin')]، يوفر نظام السياسات في .NET مرونة برمجية فائقة. يمكنك إنشاء متطلب مثل MinimumAgeRequirement(18) وتطبيقه عبر فئة AuthorizationHandler<T> التي تفحص مطالبات الـ Claims في التوكن وسجل قاعدة البيانات قبل منح الإذن عبر context.Succeed(requirement).",
    codeExample: `builder.Services.AddAuthorization(options => {
    options.AddPolicy("AtLeast18", policy =>
        policy.Requirements.Add(new MinimumAgeRequirement(18)));
});

// التطبيق على المتحكم أو الـ Endpoint
[Authorize(Policy = "AtLeast18")]
public IActionResult ViewAdultContent() { ... }`,
    commonMistakes: ["حشو منطق فحص الصلاحيات داخل كود الـ Controller مباشرة بدلاً من عزله في Authorization Handlers مستقلة قابلة للاختبار."],
    followUpQuestions: ["كيف تنفذ فحص صلاحيات الوصول للموارد الفردية عبر IAuthorizationService.AuthorizeAsync(user, resource, policy)؟"],
    sources: [{ title: "Microsoft Learn — Policy-based authorization in ASP.NET Core", url: "https://learn.microsoft.com/en-us/aspnet/core/security/authorization/policies" }],
  },
  {
    id: "nsecnet-003",
    slug: "dotnet-data-protection-api-and-keys-storage",
    topicId: "dotnet-security",
    difficulty: "Senior",
    question: "ما هي واجهة برمجة حماية البيانات (Data Protection API) في .NET وأين يجب تخزين مفاتيحها في خوادم الإنتاج الموزعة؟",
    shortAnswer: "نظام تشفير مدمج لتأمين الكوكيز ورموز إعادة تعيين كلمات المرور؛ وفي الخوادم الموزعة يجب تخزين المفاتيح في مخزن مركزي (كـ Redis أو Azure Blob) وتشفيرها بـ Key Vault.",
    explanation: "تستخدم الـ Data Protection API لتشفير كل ما هو مؤقت وحساس في التطبيق. افتراضياً، تحفظ المفاتيح في مجلد محلي على القرص. إذا نشرت تطبيقك على عدة خوادم خلف Load Balancer، فإن خادماً لن يستطيع فك تشفير الكوكي الصادرة من خادم آخر. الحل الحتمي هو ضبط PersistKeysToStackExchangeRedis أو قاعدة بيانات مشتركة، وتشفير حلقة المفاتيح عبر ProtectKeysWithCertificate أو Azure Key Vault.",
    codeExample: `builder.Services.AddDataProtection()
    .PersistKeysToStackExchangeRedis(redisConnection, "DataProtection-Keys")
    .SetApplicationName("SharedApp");`,
    commonMistakes: ["ترك المفاتيح في المجلد المحلي الافتراضي في بيئات الحاويات السحابية مما يؤدي لخروج المستخدمين مع كل إعادة تشغيل للحاوية."],
    followUpQuestions: ["ما أهمية توحيد SetApplicationName عبر جميع الخوادم والخدمات المشتركة لنفس النظام؟"],
    sources: [{ title: "Microsoft Learn — ASP.NET Core Data Protection overview", url: "https://learn.microsoft.com/en-us/aspnet/core/security/data-protection/introduction" }],
  },
  {
    id: "nsecnet-004",
    slug: "dotnet-cross-site-scripting-and-html-encoding",
    topicId: "dotnet-security",
    difficulty: "Junior",
    question: "كيف تحمي محركات العرض ومتحكمات ASP.NET Core التطبيق من هجمات البرمجة عبر المواقع (XSS)؟",
    shortAnswer: "يقوم محرك Razor بترميز مخرجات @Model تلقائياً بواسطة HtmlEncoder لتحييد الرموز الخطرة، مع توفير JavaScriptEncoder لتأمين حقن البيانات داخل السكريبتات.",
    explanation: "في صفحات Razor، يتم تحويل أي نص يطبع بواسطة @Model.Text إلى نصوص مشفرة آمنة (مثل تحويل < إلى &lt;). للبيانات التي تُحقن داخل وسوم <script>، توفر مايكروسوفت دوال JavaScriptEncoder.Default.Encode لمنع كسر سياق المتغيرات. لا يجوز استخدام @Html.Raw إلا لمحتوى نظيف وموثوق تم تطهيره مسبقاً بمكتبات مثل Ganss.Xss.HtmlSanitizer.",
    codeExample: `<!-- مشفر وآمن تلقائياً -->
<p>@Model.UserComment</p>

<!-- خطير جداً ولا يستخدم إلا مع مدخلات موثوقة ومطهرة: -->
<!-- @Html.Raw(Model.UserComment) -->`,
    commonMistakes: ["استخدام @Html.Raw لعرض تعليقات المستخدمين غير المطهرة مما يفتح ثغرة XSS مخزنة مباشرة."],
    followUpQuestions: ["كيف تضبط سياسة ترويسات Content-Security-Policy (CSP) في وسائط ASP.NET Core لتعزيز الحماية؟"],
    sources: [{ title: "Microsoft Learn — Prevent Cross-Site Scripting (XSS) in ASP.NET Core", url: "https://learn.microsoft.com/en-us/aspnet/core/security/cross-site-scripting" }],
  },
  {
    id: "nsecnet-005",
    slug: "dotnet-csrf-antiforgery-tokens-in-apis",
    topicId: "dotnet-security",
    difficulty: "Junior",
    question: "كيف تعمل خدمة IAntiforgery في حماية نماذج الويب ومتى تكون غير ضرورية في واجهات الـ REST API؟",
    shortAnswer: "تولد رمزي تحقق (واحد في كوكي مشفر والآخر في حقل مخفي بالنموذج)؛ وهي غير ضرورية لواجهات الـ REST API التي تعتمد حصراً على ترويسة Authorization: Bearer ولا تستخدم الكوكيز.",
    explanation: "هجوم CSRF يستغل إرسال المتصفح للكوكيز تلقائياً مع طلبات المواقع الخارجية. تقوم سمة [ValidateAntiForgeryToken] أو [AutoValidateAntiforgeryToken] بفحص تطابق رمز الكوكي مع الرمز المرسل في الطلب. في واجهات الـ API الصرفة حيث يخزن العميل التوكن في الذاكرة ويرسله يدوياً في ترويسة Authorization، لا يمتلك المتصفح أي آلية لإرفاقه تلقائياً، وبالتالي تسقط مخاطر الـ CSRF تماماً.",
    codeExample: `// في تطبيقات Blazor / MVC
[HttpPost]
[ValidateAntiForgeryToken]
public IActionResult UpdateProfile(ProfileDto dto) { ... }`,
    commonMistakes: ["تعطيل حماية الـ Antiforgery في نماذج MVC وتطبيقات الـ Razor Pages دون فهم المخاطر."],
    followUpQuestions: ["كيف تحمي تطبيقات الـ SPA (مثل Angular/React) من CSRF عند استخدام كوكيز الجلسات مع ASP.NET Core؟"],
    sources: [{ title: "Microsoft Learn — Prevent Cross-Site Request Forgery (XSRF/CSRF) attacks in ASP.NET Core", url: "https://learn.microsoft.com/en-us/aspnet/core/security/anti-request-forgery" }],
  },
  {
    id: "nsecnet-006",
    slug: "dotnet-secrets-manager-and-key-vault-integration",
    topicId: "dotnet-security",
    difficulty: "Junior",
    question: "كيف تدير الأسرار وسلاسل الاتصال بأمان أثناء التطوير بـ Secret Manager وفي الإنتاج بـ Azure Key Vault؟",
    shortAnswer: "يحفظ Secret Manager الأسرار في مجلد محلي خارج ملفات المشروع لمنع رفعها للـ Git، بينما في الإنتاج تُسحب الأسرار مشفرة من Azure Key Vault أو AWS Secrets Manager.",
    explanation: "أداة dotnet user-secrets مخصصة لبيئة التطوير المحلي؛ فهي تحفظ المفاتيح في مجلد المستخدم الخاص بنظام التشغيل وتدمجها تلقائياً مع builder.Configuration. في بيئات الإنتاج والسحاب، يتم ربط التطبيق بمخزن مركزي آمن مثل Azure Key Vault عبر مكتبة Azure.Security.KeyVault.Secrets واستخدام الهويات المدارة (Managed Identity) دون الحاجة لحفظ أي كلمة مرور في ملفات الإعدادات.",
    codeExample: `// التطوير المحلي عبر الـ CLI:
// dotnet user-secrets init
// dotnet user-secrets set "DbPassword" "SuperSecret123"

// في كود الإنتاج مع الهوية المدارة:
builder.Configuration.AddAzureKeyVault(new Uri(keyVaultUrl), new DefaultAzureCredential());`,
    commonMistakes: ["كتابة كلمات مرور قواعد البيانات الحقيقية داخل ملف appsettings.json ورفعها إلى مستودعات Git."],
    followUpQuestions: ["كيف تدير تدوير الأسرار (Secret Rotation) في بيئات السحاب دون الحاجة لإعادة تشغيل خوادم الويب؟"],
    sources: [{ title: "Microsoft Learn — Safe storage of app secrets in development in ASP.NET Core", url: "https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets" }],
  },
  {
    id: "nsecnet-007",
    slug: "dotnet-sql-injection-and-dapper-parameterization",
    topicId: "dotnet-security",
    difficulty: "Junior",
    question: "كيف تحمي استعلامات Dapper و ADO.NET من ثغرات SQL Injection؟",
    shortAnswer: "باستخدام الاستعلامات المجهزة المعتمدة على المعلمات النائبة (@param) وتمرير كائنات مجهولة لـ Dapper، وحظر دمج النصوص المباشر نهائياً.",
    explanation: "في الـ Micro-ORMs مثل Dapper، يكتب المطور استعلامات SQL بيده. الخطر الأكبر هو دمج متغيرات المستخدم بنصوص الـ string interpolation. الطريقة الآمنة الحتمية هي استخدام المعلمات المصرحة (@email)، حيث يقوم Dapper بتوليد كائنات DbParameter وإرسال القيم معزولة لقاعدة البيانات لحمايتها من أي استغلال خبيث.",
    codeExample: `// آمن تماماً بواسطة Dapper Parameterization
var user = await connection.QueryFirstOrDefaultAsync<User>(
    "SELECT * FROM Users WHERE Email = @Email AND Status = @Status",
    new { Email = inputEmail, Status = "Active" }
);`,
    commonMistakes: ["كتابة $\"SELECT * FROM Users WHERE Email = '{inputEmail}'\" مع Dapper مما يفتح ثغرة حقن SQL فادحة."],
    followUpQuestions: ["كيف تحمي استعلامات جملة IN في Dapper عند تمرير مصفوفة قيم معلمات ديناميكية؟"],
    sources: [{ title: "Microsoft Learn — Security in .NET data access", url: "https://learn.microsoft.com/en-us/dotnet/framework/data/adonet/sql/sql-server-security" }],
  },
  {
    id: "nsecnet-008",
    slug: "dotnet-mass-assignment-and-dto-overposting",
    topicId: "dotnet-security",
    difficulty: "Junior",
    question: "ما هي ثغرة الإفراط في النشر (Overposting / Mass Assignment) في ASP.NET Core وكيف تقضي عليها؟",
    shortAnswer: "تحدث عندما يقبل المتحكم نموذج الكيان الداخلي مباشرة في معلمات الـ Action مما يتيح للعميل حقن حقول حساسة؛ وتقضي عليها باستخدام DTOs مخصصة حصراً لكل طلب.",
    explanation: "إذا كانت دالة الـ Action تقبل public IActionResult Update(User user)، يمكن للمهاجم إرسال حقل IsAdmin: true في الـ JSON وسيقوم الـ Model Binder بإسناده للكيان وحفظه في قاعدة البيانات. القاعدة الهندسية الصارمة هي عدم استخدام كائنات EF Core Entities في معلمات الـ API مطلقاً، واستخدام نماذج نقل بيانات (Request DTOs) مخصصة لا تحتوي إلا على الحقول المسموح للمستخدم بتعديلها صراحة.",
    codeExample: `// DTO آمن ومخصص لما يحق للمستخدم تعديله فقط
public record UpdateProfileRequest(string DisplayName, string Bio);

[HttpPut("profile")]
public async Task<IActionResult> Update(UpdateProfileRequest request) { ... }`,
    commonMistakes: ["الاعتماد على سمات [Bind] القديمة في المتحكمات بدلاً من تطبيق فصل الـ DTOs الصريح."],
    followUpQuestions: ["كيف تساعد مكتبات مثل AutoMapper أو Mapster في نقل البيانات من الـ DTOs للكيانات بأمان؟"],
    sources: [{ title: "Microsoft Learn — Prevent overposting in ASP.NET Core", url: "https://learn.microsoft.com/en-us/aspnet/core/tutorials/first-web-api#prevent-overposting" }],
  },
  {
    id: "nsecnet-009",
    slug: "dotnet-cryptography-random-and-hashing",
    topicId: "dotnet-security",
    difficulty: "Mid",
    question: "لماذا يحظر استخدام فئة System.Random للأغراض الأمنية وما هو البديل التشفيري المعتمد؟",
    shortAnswer: "لأن System.Random خوارزمية شبه عشوائية حتمية يسهل التنبؤ بقيمها التالية؛ والبديل التشفيري الآمن هو RandomNumberGenerator في System.Security.Cryptography.",
    explanation: "تعتمد فئة Random على بذرة زمنية بسيطة (Clock Seed)، مما يمكن المهاجم من تخمين الرموز الأمنية، ورموز تفعيل الحسابات، ومفاتيح الجلسات بعد مراقبة بضع قيم سابقة. توفر فئة RandomNumberGenerator واجهة آمنة تشفيرياً (CSPRNG) تسحب عشوائيتها من أحداث العتاد ونواة نظام التشغيل، وتوفر دوالاً مريحة مثل RandomNumberGenerator.GetInt32() و GetBytes().",
    codeExample: `// توليد رمز OTP آمن تشفيرياً مكون من 6 أرقام
int otp = RandomNumberGenerator.GetInt32(100000, 1000000);

// توليد مفتاح عشوائي مشفر
byte[] salt = RandomNumberGenerator.GetBytes(32);`,
    commonMistakes: ["استخدام new Random().Next() لإنشاء رموز إعادة تعيين كلمات المرور أو التواقيع الأمنية."],
    followUpQuestions: ["ما هي فئة CryptographicOperations وما دور CryptographicOperations.FixedTimeEquals في منع هجمات التوقيت؟"],
    sources: [{ title: "Microsoft Learn — RandomNumberGenerator Class", url: "https://learn.microsoft.com/en-us/dotnet/api/system.security.cryptography.randomnumbergenerator" }],
  },
  {
    id: "nsecnet-010",
    slug: "dotnet-secure-enclaves-and-always-encrypted",
    topicId: "dotnet-security",
    difficulty: "Senior",
    question: "ما هي ميزة Always Encrypted مع Secure Enclaves في SQL Server و .NET؟",
    shortAnswer: "تقنية تشفير تضمن بقاء البيانات الحساسة مشفرة في الذاكرة والقرص لدى قاعدة البيانات، ولا تُفك شفرتها إلا داخل خادم التطبيق المعتمد أو جيب معالج آمن (Enclave).",
    explanation: "صُممت Always Encrypted لحماية البيانات فائقة الحساسية (مثل أرقام بطاقات الائتمان والهويات الوطنية) حتى من مديري قواعد البيانات (DBAs) ومخترقي السيرفرات السحابية. يقوم مشغل Microsoft.Data.SqlClient بتشفير البيانات في خادم .NET قبل إرسالها عبر الشبكة، وتخزن قاعدة البيانات قيماً مشفرة. وبفضل Secure Enclaves، يمكن لقاعدة البيانات إجراء حسابات وفهارس على البيانات المشفرة داخل جيب عتادي معزول دون كشف النص الأصلي.",
    codeExample: `// يتم تفعيل ميزة التشفير الشفاف في سلسلة الاتصال
"Server=...;Database=...;Column Encryption Setting=Enabled;Enclave Attestation Url=...;"`,
    commonMistakes: ["الخلط بين Transparent Data Encryption (TDE) التي تشفر القرص فقط، و Always Encrypted التي تشفر البيانات من طرف لطرف."],
    followUpQuestions: ["كيف يدير عميل .NET مفاتيح تشفير الأعمدة الرئيسية (Column Master Keys) المخزنة في Azure Key Vault؟"],
    sources: [{ title: "Microsoft Learn — Always Encrypted with secure enclaves overview", url: "https://learn.microsoft.com/en-us/sql/relational-databases/security/encryption/always-encrypted-enclaves" }],
  },

  // Topic: dotnet-perf (10 questions: nperfnet-001 to nperfnet-010)
  {
    id: "nperfnet-001",
    slug: "dotnet-memorypool-and-arraypool-recycling",
    topicId: "dotnet-perf",
    difficulty: "Senior",
    question: "كيف تساعد فئات ArrayPool<T> و MemoryPool<T> في القضاء على ضغط مجمع المهملات (GC Pressure)؟",
    shortAnswer: "توفر مخزناً للمصفوفات وكتل الذاكرة يعاد استخدامها واستئجارها (Rent) وإرجاعها (Return) بدلاً من حجز مصفوفات جديدة وحذفها في كل طلب.",
    explanation: "في الخوادم التي تعالج آلاف الطلبات في الثانية، حجز مصفوفات byte[] لقراءة حزم الشبكة والملفات يملأ Gen 0 بسرعة ويجبر الـ GC على إيقاف العمليات دورياً. استخدام ArrayPool<T>.Shared.Rent(minSize) يستعير مصفوفة موجودة مسبقاً في الـ Pool في كسر من الميكروثانية، وعند الانتهاء بكتلة finally يُستدعى pool.Return(array)، مما يحقق استقراراً فائقاً للذاكرة وصفر ضغط على الـ GC.",
    codeExample: `var pool = ArrayPool<byte>.Shared;
byte[] buffer = pool.Rent(4096);
try {
    int bytesRead = await stream.ReadAsync(buffer);
    Process(buffer.AsSpan(0, bytesRead));
} finally {
    pool.Return(buffer); // إعادة تدوير المصفوفة
}`,
    commonMistakes: ["نسيان إرجاع المصفوفة المستعارة في كتلة finally مما يفرغ الـ Pool ويفقد الميزة فاعليتها."],
    followUpQuestions: ["لماذا قد تكون المصفوفة المعادة من pool.Rent أكبر حجماً من الحجم الذي طلبته صراحة؟"],
    sources: [{ title: "Microsoft Learn — ArrayPool<T> Class", url: "https://learn.microsoft.com/en-us/dotnet/api/system.buffers.arraypool-1" }],
  },
  {
    id: "nperfnet-002",
    slug: "dotnet-benchmarkdotnet-methodology",
    topicId: "dotnet-perf",
    difficulty: "Mid",
    question: "كيف تستخدم مكتبة BenchmarkDotNet لقياس أداء كود C# بدقة وما هي القواعد الذهبية للقياس؟",
    shortAnswer: "تنشئ مشروع Console منفصل وتستخدم سمة [Benchmark]؛ وتقوم المكتبة بالإحماء التلقائي وعزل المعالج وقياس الزمن وتخصيصات الذاكرة بـ [MemoryDiagnoser].",
    explanation: "القياس اليدوي باستخدام Stopwatch يعطي نتائج مضللة وغير علمية بسبب تداخل الـ JIT compilation وتوقفات الـ GC وتقلبات تردد المعالج. تقوم أداة BenchmarkDotNet بعزل بيئة التشغيل، وتشغيل دورات إحماء (Warmup) متكررة حتى يستقر الكود في أقصى تحسين (Tier 1 JIT)، وإجراء مئات التكرارات الإحصائية وتوليد جداول دقيقة بالنانوثانية وكمية البايتات المحجوزة في الـ Heap.",
    codeExample: `[MemoryDiagnoser]
public class StringBenchmarks {
    [Benchmark]
    public string UsingStringBuilder() {
        var sb = new StringBuilder();
        for (int i = 0; i < 100; i++) sb.Append(i);
        return sb.ToString();
    }
}`,
    commonMistakes: ["تشغيل اختبارات الأداء في وضع Debug بدلاً من Release مما يعطي نتائج مشوهة لغياب تحسينات المترجم."],
    followUpQuestions: ["كيف تفسر عمود Allocated في تقارير BenchmarkDotNet لتحديد تسريبات الذاكرة؟"],
    sources: [{ title: "Microsoft Learn — Performance testing and benchmarking in .NET", url: "https://learn.microsoft.com/en-us/dotnet/standard/base-types/best-practices-strings#performance-and-best-practices-for-stringbuilder" }],
  },
  {
    id: "nperfnet-003",
    slug: "dotnet-string-allocation-and-stringbuilder",
    topicId: "dotnet-perf",
    difficulty: "Junior",
    question: "لماذا تعد كائنات string غير قابلة للتعديل (Immutable) ومتى يجب استخدام StringBuilder أو String.Create؟",
    shortAnswer: "لأن كل عملية تعديل أو دمج (+) تنشئ كائناً نصياً جديداً تماماً في الـ Heap؛ ويستخدم StringBuilder للحلقات التكرارية وString.Create لتوليد النصوص ذات الحجم المعروف بصفر تخصيص.",
    explanation: "إذا دمجت نصوصاً داخل حلقة تكرارية لـ 1,000 عنصر بـ text += item، ستقوم بحجز 1,000 كائن نصي مؤقت في الـ Heap وسرعان ما تمتلئ الذاكرة. يستخدم StringBuilder لتجميع المقاطع في مصفوفة داخلية واحدة قابلة للتمدد. وفي الأداء الفائق (.NET Core+)، تتيح دالة string.Create(length, state, action) حجز مساحة النص النهائي مباشرة والكتابة في الـ Span الداخلي الخاص به بصفر كائنات مؤقتة.",
    codeExample: `// أداء فائق وسرعة قصوى لإنشاء النصوص دون مصفوفات مؤقتة
string id = string.Create(8, state, (span, s) => {
    // تعبئة الـ span مباشرة
});`,
    commonMistakes: ["استخدام StringBuilder لدمج نصين أو ثلاثة نصوص بسيطة في سطر واحد؛ دمج السطور البسيطة بـ + يجمعه المترجم تلقائياً بكفاءة تفوق StringBuilder."],
    followUpQuestions: ["ما أهمية تحديد السعة الأولية (Capacity) عند إنشاء StringBuilder لتفادي إعادة الحجز والتوسيع المتكرر؟"],
    sources: [{ title: "Microsoft Learn — How to concatenate multiple strings", url: "https://learn.microsoft.com/en-us/dotnet/csharp/how-to/concatenate-multiple-strings" }],
  },
  {
    id: "nperfnet-004",
    slug: "dotnet-inlining-and-aggressive-inlining",
    topicId: "dotnet-perf",
    difficulty: "Senior",
    question: "ما هو تضمين الدوال (Method Inlining) ومتى تستخدم سمة [MethodImpl(MethodImplOptions.AggressiveInlining)]؟",
    shortAnswer: "هو استبدال استدعاء الدالة بكود جسمها مباشرة لتوفير تكلفة الـ Call Stack والقفز بالمعالج؛ وتستخدم للدوائر السريعة والصغيرة جداً في المسارات الحيوية.",
    explanation: "يقوم مجمع JIT تلقائياً بتضمين الدوال الصغيرة التي يقل حجمها عن حد معين. استدعاء الدالة العادي يتطلب دفع المعاملات في الـ Stack وقفز مسار المعالج (Call/Return). استخدام AggressiveInlining يجبر الـ JIT على دمج الدالة في كود المستدعي مباشرة. ومع ذلك، فإن الإفراط في استخدامها مع دوال كبيرة يؤدي لتضخم حجم كود الآلة (Code Bloat) وخروج الكود من كاش المعالج السريع (L1/L2 Instruction Cache).",
    codeExample: `[MethodImpl(MethodImplOptions.AggressiveInlining)]
public static int FastMax(int a, int b) => a > b ? a : b;`,
    commonMistakes: ["وضع AggressiveInlining على دوال كبيرة ومعقدة تحتوي على استثناءات مما يؤدي لتدهور كفاءة الكاش وتراجع الأداء."],
    followUpQuestions: ["لماذا ينصح بفصل رمي الاستثناءات في دوال مساعدة منفصلة (Throw Helpers) لتسهيل تضمين الدالة الرئيسية؟"],
    sources: [{ title: "Microsoft Learn — MethodImplOptions Enum", url: "https://learn.microsoft.com/en-us/dotnet/api/system.runtime.compilerservices.methodimploptions" }],
  },
  {
    id: "nperfnet-005",
    slug: "dotnet-memory-diagnostics-counters-and-metrics",
    topicId: "dotnet-perf",
    difficulty: "Senior",
    question: "كيف ترصد مقاييس الأداء واستهلاك الذاكرة حياً في تطبيقات .NET باستخدام System.Diagnostics.Metrics و OpenTelemetry؟",
    shortAnswer: "باستخدام فئات Meter و Counter لتسجيل مقاييس الأعمال والأداء، وتصديرها بصيغة Prometheus القياسية لمراقبتها في لوحات Grafana.",
    explanation: "في .NET الحديثة، تم توحيد نظام المقاييس تحت فضاء System.Diagnostics.Metrics المتوافق مع OpenTelemetry. بدلاً من الاعتماد على Performance Counters القديمة الخاصة بـ Windows فقط، تتيح فئة Meter إنشاء عدادات خفيفة وموحدة (Counters و Histograms و UpDownCounters) تعمل عبر Linux و Windows وتصدر تلقائياً للأنظمة الموزعة عبر مسار /metrics.",
    codeExample: `private static readonly Meter MyMeter = new("MyApp.Orders");
private static readonly Counter<int> OrdersPlaced = MyMeter.CreateCounter<int>("orders_total");

public void PlaceOrder() {
    OrdersPlaced.Add(1, new KeyValuePair<string, object?>("country", "EG"));
}`,
    commonMistakes: ["إنشاء نُسخ جديدة من كائن Meter مع كل طلب بدلاً من تعريفه كـ static أو مشاركته كـ Singleton."],
    followUpQuestions: ["كيف تراقب أزمنة تنفيذ طلبات HTTP عبر كائن Histogram<double>؟"],
    sources: [{ title: "Microsoft Learn — System.Diagnostics.Metrics overview", url: "https://learn.microsoft.com/en-us/dotnet/core/diagnostics/metrics" }],
  },
  {
    id: "nperfnet-006",
    slug: "dotnet-simd-and-hardware-intrinsics",
    topicId: "dotnet-perf",
    difficulty: "Senior",
    question: "ما هي تعليمات SIMD و Hardware Intrinsics في .NET وكيف تسرع معالجة المصفوفات الحسابية؟",
    shortAnswer: "تسمح بتنفيذ عملية حسابية واحدة على عدة بيانات بالتوازي في نفس نبضة المعالج (Single Instruction, Multiple Data) عبر فئات Vector<T> ومكتبات AVX2/SSE.",
    explanation: "بدلاً من معالجة مصفوفة رقمية عنصراً بعنصر في حلقة تكرارية، تستغل فئة Vector<T> مسجلات المعالج العريضة (128-bit أو 256-bit أو 512-bit). في المعالجات التي تدعم AVX-512، يمكن جمع 16 رقماً عائماً (float) في نبضة ساعة واحدة متزامنة، مما يرفع سرعة الحسابات الرياضية، ومعالجة الصور، والتشفير بعشرات الأضعاف بمجرد تفعيل الدعم في الكود.",
    codeExample: `// جمع مصفوفتين باستخدام متجهات الـ SIMD
int vectorSize = Vector<int>.Count;
for (int i = 0; i <= length - vectorSize; i += vectorSize) {
    var v1 = new Vector<int>(arrayA, i);
    var v2 = new Vector<int>(arrayB, i);
    (v1 + v2).CopyTo(result, i);
}`,
    commonMistakes: ["افتراض دعم كل المعالجات لنفس تعليمات الـ Intrinsics دون فحص الخصائص التوافقية مثل Avx2.IsSupported."],
    followUpQuestions: ["كيف تدعم فئة Vector64 و Vector128 و Vector256 في System.Runtime.Intrinsics التفاعل المباشر مع عتاد المعالج؟"],
    sources: [{ title: "Microsoft Learn — Hardware intrinsics in .NET", url: "https://learn.microsoft.com/en-us/dotnet/standard/simd" }],
  },
  {
    id: "nperfnet-007",
    slug: "dotnet-struct-layout-and-memory-alignment",
    topicId: "dotnet-perf",
    difficulty: "Senior",
    question: "كيف يؤثر ترتيب الخصائص (Struct Layout & Padding) على استهلاك الذاكرة وتراصف البايتات في C#؟",
    shortAnswer: "يقوم المحرك بإضافة حشوات بايتية فارغة (Padding) لمحاذاة المتغيرات مع حدود الذاكرة الطبيعية؛ وإعادة ترتيب الخصائص من الأكبر للأصغر يقلل حجم الـ struct.",
    explanation: "في معالجات 64-bit، تتطلب الأرقام 8-byte أن تبدأ عند عنوان يقبل القسمة على 8. إذا كان لديك struct يحتوي على: byte (1 byte), long (8 bytes), byte (1 byte)، سيضيف المترجم 7 بايت حشوة بعد البايت الأول و7 بايت في النهاية، فيصبح الحجم الإجمالي 24 بايت! إذا أعدت ترتيبها: long ثم byte ثم byte، سيهبط الحجم إلى 16 بايت فقط، مما يوفر ملايين البايتات في المصفوفات الضخمة.",
    codeExample: `// حجمه 16 بايت بدلاً من 24 بفضل الترتيب الأمثل
[StructLayout(LayoutKind.Sequential)]
public struct OptimizedStruct {
    public long BigNumber; // 8 bytes
    public byte Flag1;     // 1 byte
    public byte Flag2;     // 1 byte
    // 6 bytes padding
}`,
    commonMistakes: ["تجاهل محاذاة الذاكرة عند تبادل هياكل البيانات مع مكتبات C عبر P/Invoke."],
    followUpQuestions: ["كيف تجبر المحرك على رص المتغيرات بدون أي حشوات عبر [StructLayout(LayoutKind.Sequential, Pack = 1)]؟"],
    sources: [{ title: "Microsoft Learn — StructLayoutAttribute Class", url: "https://learn.microsoft.com/en-us/dotnet/api/system.runtime.interopservices.structlayoutattribute" }],
  },
  {
    id: "nperfnet-008",
    slug: "dotnet-regex-source-generator-performance",
    topicId: "dotnet-perf",
    difficulty: "Junior",
    question: "لماذا يتفوق GeneratedRegex في .NET 7+ على إنشاء كائنات new Regex() وقت التشغيل؟",
    shortAnswer: "لأنه يقوم بتحليل وتجميع التعبير النمطي وقت البناء إلى كود C# صريح وخوارزمية فحص محددة الحالة (DFA)، مع صفر تحليل وقت التشغيل وسرعة تفوق بأضعاف.",
    explanation: "في الماضي، كان استخدام new Regex(pattern) يتطلب تفسيراً ديناميكياً للتعبير في كل مرة. خيار RegexOptions.Compiled كان يترجم التعبير بـ Reflection.Emit ولكنه بطيء الإقلاع وغير متوافق مع AOT. ميزة [GeneratedRegex] تفحص النص أثناء الترجمة بواسطة Roslyn وتولد دالة C# خالية من التراجع الكارثي (Catastrophic Backtracking) وبأقصى سرعة ممكنة دون أي تكلفة إقلاع.",
    codeExample: `[GeneratedRegex(@"^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$", RegexOptions.IgnoreCase)]
private static partial Regex EmailRegex();

bool isValid = EmailRegex().IsMatch(input);`,
    commonMistakes: ["إنشاء كائنات new Regex() داخل دوال متكررة في مسارات معالجة الطلبات مما يسبب عبئاً متواصلاً على المعالج والذاكرة."],
    followUpQuestions: ["كيف تحمي محركات التعبيرات النمطية في .NET من هجمات ReDoS عبر تعيين MatchTimeout؟"],
    sources: [{ title: "Microsoft Learn — .NET regular expression source generators", url: "https://learn.microsoft.com/en-us/dotnet/standard/base-types/regular-expression-source-generators" }],
  },
  {
    id: "nperfnet-009",
    slug: "dotnet-collections-capacity-and-dictionary-hashing",
    topicId: "dotnet-perf",
    difficulty: "Junior",
    question: "ما أهمية تحديد السعة الأولية (Initial Capacity) عند إنشاء List<T> و Dictionary<TKey, TValue>؟",
    shortAnswer: "تمنع عمليات إعادة تخصيص المصفوفات الداخلية المتكررة ونسخ البيانات في الـ Heap في كل مرة تتجاوز فيها المجموعة حجمها الحالي.",
    explanation: "تبدأ List<T> بمصفوفة داخلية صغيرة (مثلاً 4 عناصر). عند إضافة العنصر الخامس، تنشئ مصفوفة جديدة بضعف الحجم (8) وتنسخ كل العناصر إليها وتترك القديمة للـ GC. إذا كنت ستضيف 10,000 عنصر، ستتكرر هذه العملية المكلفة 12 مرة. تحديد new List<T>(10000) يخصص المصفوفة بالحجم المطلوب مرة واحدة فقط بصفر نسخ إضافي وسرعة قصوى.",
    codeExample: `// تخصيص السعة مسبقاً
var list = new List<Customer>(expectedCount);
var dict = new Dictionary<int, Customer>(expectedCount);`,
    commonMistakes: ["إنشاء قوائم وقواميس دون سعة أولية عند قراءة بيانات معلومة الحجم مسبقاً من قواعد البيانات."],
    followUpQuestions: ["كيف تختار دالة GetHashCode متوازنة التوزيع لتفادي تصادم المفاتيح (Hash Collisions) في Dictionary؟"],
    sources: [{ title: "Microsoft Learn — List<T>.Capacity Property", url: "https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.list-1.capacity" }],
  },
  {
    id: "nperfnet-010",
    slug: "dotnet-system-text-json-vs-newtonsoft",
    topicId: "dotnet-perf",
    difficulty: "Mid",
    question: "لماذا يعد System.Text.Json أسرع بكثير من Newtonsoft.Json (Json.NET) وما المعمارية المبني عليها؟",
    shortAnswer: "يعتمد على معالجة تدفقات UTF-8 مباشرة (ReadOnlySpan<byte>) دون تحويل لنصوص UTF-16، ويتجنب تخصيص الكائنات في الـ Heap ويدعم الـ Source Generation.",
    explanation: "قديماً، كانت مكتبة Newtonsoft تقرأ البيانات كنصوص string، وتنشئ كائنات وسيطة كثيرة وتعتمد بشدة على Reflection. صُمم System.Text.Json من الصفر في .NET Core للاستفادة من بنى الأداء الفائق مثل Utf8JsonReader و ArrayPool. مع دعم JsonSourceGeneration، يتم تسلسل وفك تسلسل البيانات بسرعة فائقة وصفر تخصيصات إضافية وتوافق تام مع Native AOT.",
    codeExample: `[JsonSerializable(typeof(UserDto))]
internal partial class AppJsonSerializerContext : JsonSerializerContext {}

// استخدام المولد المسبق فائق السرعة
var json = JsonSerializer.Serialize(user, AppJsonSerializerContext.Default.UserDto);`,
    commonMistakes: ["الاحتفاظ بمكتبة Newtonsoft.Json في المشاريع الحديثة دون مسوغ حقيقي، مما يحرم التطبيق من مضاعفة سرعة تسلسل الـ JSON."],
    followUpQuestions: ["كيف تنشئ Custom JsonConverter مخصصاً لمعالجة تنسيق التواريخ أو التعدادات المعقدة؟"],
    sources: [{ title: "Microsoft Learn — System.Text.Json overview", url: "https://learn.microsoft.com/en-us/dotnet/standard/serialization/system-text-json/overview" }],
  },

  // Topic: dotnet-testing (10 questions: ntestnet-001 to ntestnet-010)
  {
    id: "ntestnet-001",
    slug: "dotnet-xunit-vs-nunit-architecture",
    topicId: "dotnet-testing",
    difficulty: "Junior",
    question: "ما الفلسفة المعمارية لإطار xUnit وكيف يعزل الاختبارات عبر إنشاء نسخة فئة جديدة لكل اختبار؟",
    shortAnswer: "ينشئ xUnit نسخة جديدة تماماً من فئة الاختبار لكل دالة [Fact] لضمان استقلال الحالات ومنع التداخل، ويعتمد على الباني و IDisposable بدلاً من Setup و Teardown.",
    explanation: "في NUnit، يُعاد استخدام نفس نسخة الفئة لجميع الاختبارات ما لم يُطلب العكس، مما قد يسبب تداخلاً غير مقصود في حالة المتغيرات. تبنى xUnit مبدأ العزل الصارم؛ فلكل اختبار يتم تشغيل الباني وإنشاء الفئة وتدميرها عبر Dispose(). لمشاركة بيانات باهظة التكلفة بين عدة اختبارات، يوفر xUnit فئات Fixtures مخصصة عبر واجهة IClassFixture<T>.",
    codeExample: `public class CalculatorTests : IDisposable {
    private readonly Calculator _calc = new(); // نظيف وجديد لكل Fact

    [Fact]
    public void AddsCorrectly() => Assert.Equal(4, _calc.Add(2, 2));

    public void Dispose() { /* تنظيف بعد كل اختبار */ }
}`,
    commonMistakes: ["الاعتماد على متغيرات الفئة العامة لمشاركة الحالة بين اختبارات xUnit دون إدراك أنها نسخ منفصلة تماماً."],
    followUpQuestions: ["كيف تشارك سياق قاعدة بيانات واحدة بين عدة فئات اختبارات عبر ICollectionFixture<T>؟"],
    sources: [{ title: "Microsoft Learn — Unit testing C# with xUnit and .NET", url: "https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-with-dotnet-test" }],
  },
  {
    id: "ntestnet-002",
    slug: "dotnet-webapplicationfactory-integration-testing",
    topicId: "dotnet-testing",
    difficulty: "Mid",
    question: "كيف تستخدم WebApplicationFactory<Program> لإجراء اختبارات تكاملية حقيقية لخوادم ASP.NET Core؟",
    shortAnswer: "تنشئ خادماً تجريبياً في الذاكرة (TestServer) يشغل كامل خط أنابيب التطبيق الحقيقي ويوفر عميل HttpClient لإرسال الطلبات وفحص الاستجابات بدقة.",
    explanation: "حزمة Microsoft.AspNetCore.Mvc.Testing توفر أداة WebApplicationFactory الأقوى في اختبارات الـ Integration. تقوم بإقلاع ملف Program.cs الفعلي، وتشغيل كل الـ Middlewares والـ Routing والمصادقة، مع إمكانية استبدال خدمات محددة (مثل استبدال قاعدة البيانات بـ Testcontainers أو InMemory) عبر WithWebHostBuilder.",
    codeExample: `public class ApiTests(WebApplicationFactory<Program> factory) : IClassFixture<WebApplicationFactory<Program>> {
    private readonly HttpClient _client = factory.CreateClient();

    [Fact]
    public async Task Health_ReturnsOk() {
        var res = await _client.GetAsync("/health");
        Assert.Equal(HttpStatusCode.OK, res.StatusCode);
    }
}`,
    commonMistakes: ["نسيان جعل فئة Program عامة public partial class Program { } في مشاريع الـ Top-level statements حتى يتمكن مشروع الاختبار من رؤيتها."],
    followUpQuestions: ["كيف تستبدل خدمات الـ DI الحقيقية بخدمات وهمية في WebApplicationFactory عبر ConfigureTestServices؟"],
    sources: [{ title: "Microsoft Learn — Integration tests in ASP.NET Core", url: "https://learn.microsoft.com/en-us/aspnet/core/test/integration-tests" }],
  },
  {
    id: "ntestnet-003",
    slug: "dotnet-nsubstitute-vs-moq",
    topicId: "dotnet-testing",
    difficulty: "Junior",
    question: "قارن بين مكتبتي Moq و NSubstitute في إنشاء الكائنات الوهمية (Mocks) لاختبارات C#.",
    shortAnswer: "NSubstitute توفر صياغة طبيعية وأنيقة جداً خالية من الـ Lambda Expressions المعقدة (Substitute.For<T>()) وأصبحت الخيار الأكثر أماناً وشعبية في المجتمع الحديث.",
    explanation: "تستخدم كلاهما لعزل التبعيات والتحقق من استدعاء الدوال. في NSubstitute، كتابة الكود تبدو ككود C# عادي: substitute.Get(1).Returns(user) والتحقق: substitute.Received(1).Save(user)، مقارنة بصياغة Moq المعقدة بالأقواس والـ Expressions: mock.Setup(x => x.Get(1)).Returns(user) و mock.Verify(x => x.Save(user), Times.Once).",
    codeExample: `// NSubstitute
var repo = Substitute.For<IUserRepository>();
repo.GetByIdAsync(1).Returns(new User { Name = "Ali" });

var service = new UserService(repo);
var user = await service.GetUserAsync(1);

Assert.Equal("Ali", user.Name);
await repo.Received(1).GetByIdAsync(1);`,
    commonMistakes: ["محاولة عمل Mock لفئات عادية لا تمتلك دوالاً افتراضية (Virtual Methods) دون استخدام واجهات (Interfaces)."],
    followUpQuestions: ["كيف تحاكي الدوال التي تقبل أو تعيد دوالاً غير متزامنة Task في NSubstitute؟"],
    sources: [{ title: "Microsoft Learn — Unit testing best practices with .NET Core", url: "https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-best-practices" }],
  },
  {
    id: "ntestnet-004",
    slug: "dotnet-fluentassertions-expressive-testing",
    topicId: "dotnet-testing",
    difficulty: "Junior",
    question: "ما هي ميزة مكتبات التوكيد التعبيري مثل FluentAssertions أو AwesomeAssertions في اختبارات .NET؟",
    shortAnswer: "تحول التوكيدات إلى لغة طبيعية مقروءة بأسلوب السلسلة (Fluent Syntax) وتقدم رسائل أخطاء تفصيلية وواضحة جداً عند فشل الاختبار.",
    explanation: "بدلاً من كتابة Assert.Equal(expected, actual) والارتباك التقليدي في ترتيب المعاملين، توفر FluentAssertions صياغة بديهية: actual.Should().Be(expected). تتميز بمقارنة الكائنات العميقة الشاملة: order.Should().BeEquivalentTo(expectedOrder)، وفحص استثناءات الـ async بسلاسة، وتقديم شروحات دقيقة توضح الفارق الحرفي بين القيمتين عند الفشل.",
    codeExample: `user.Email.Should().NotBeNullOrWhiteSpace();
user.Age.Should().BeGreaterThanOrEqualTo(18);
user.Roles.Should().Contain("Admin").And.HaveCount(2);`,
    commonMistakes: ["مقارنة كائنات تحتوي على معرفات عشوائية أو تواريخ دون استثناء الحقول المتغيرة عبر options.Excluding()."],
    followUpQuestions: ["كيف تفحص رمي الاستثناءات غير المتزامنة بدقة عبر act.Should().ThrowAsync<InvalidOperationException>()؟"],
    sources: [{ title: "Microsoft Learn — Unit testing best practices", url: "https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-best-practices" }],
  },
  {
    id: "ntestnet-005",
    slug: "dotnet-testcontainers-for-database-testing",
    topicId: "dotnet-testing",
    difficulty: "Senior",
    question: "كيف تستخدم Testcontainers.MsSql أو Testcontainers.PostgreSql لاختبار EF Core بقواعد بيانات حقيقية؟",
    shortAnswer: "تشغل حاوية Docker حقيقية لقاعدة البيانات أثناء تشغيل الاختبارات، وتطبق الـ migrations عليها، وتدمرها تلقائياً بعد الانتهاء، مما يقضي على مشاكل الفروق بين InMemory والواقع.",
    explanation: "استخدام EF Core InMemory Database في الاختبارات خطير جداً؛ لأنها لا تدعم الـ Transactions الحقيقية، ولا تفحص الـ Foreign Keys، ولا تدعم استعلامات الـ Raw SQL أو ميزات المحرك الأصلية. توفر حزمة Testcontainers تشغيل حاوية SQL حقيقية متطابقة مع الإنتاج في ثوانٍ، مما يضمن ثقة بنسبة 100% في صحة استعلامات قاعدة البيانات وتوافق الفهارس والقيود.",
    codeExample: `public class DatabaseFixture : IAsyncLifetime {
    private readonly MsSqlContainer _container = new MsSqlBuilder().Build();
    public string ConnectionString => _container.GetConnectionString();

    public async Task InitializeAsync() => await _container.StartAsync();
    public async Task DisposeAsync() => await _container.DisposeAsync();
}`,
    commonMistakes: ["إعادة تشغيل حاوية جديدة لكل اختبار فردي بدلاً من مشاركة الحاوية عبر IClassFixture وتنظيف الجداول بالـ Respawn."],
    followUpQuestions: ["كيف تستخدم مكتبة Respawn لتصفية جداول قاعدة البيانات في أجزاء من الثانية بين الاختبارات؟"],
    sources: [{ title: "Microsoft Learn — Testing EF Core Applications against real databases", url: "https://learn.microsoft.com/en-us/ef/core/testing/testing-against-your-database" }],
  },
  {
    id: "ntestnet-006",
    slug: "dotnet-testing-time-abstraction-timeprovider",
    topicId: "dotnet-testing",
    difficulty: "Mid",
    question: "ما هي فئة TimeProvider المضافة في .NET 8 وكيف حلت معضلة اختبار الأكواد المعتمدة على الوقت والمؤقتات؟",
    shortAnswer: "تجريد رسمي للوقت والمؤقتات يُحقن في الخدمات كـ TimeProvider؛ ويتيح في الاختبارات تجميد وتمرير الوقت يدوياً عبر FakeTimeProvider دون انتظار حقيقي.",
    explanation: "قديماً، كان المطورون يكتبون واجهات مخصصة مثل IDateTimeProvider لاستبدال DateTime.UtcNow في الاختبارات. في .NET 8، وفرت مايكروسوفت TimeProvider كمعيار موحد في الـ BCL. في بيئة الاختبار، تحقن حزمة Microsoft.Extensions.Time.Testing فئة FakeTimeProvider؛ وتستطيع استدعاء fakeTime.Advance(TimeSpan.FromMinutes(10)) ليتم إطلاق المؤقتات وفحص انتهاء الصلاحيات لحظياً وبصفر انتظار.",
    codeExample: `// في خدمة الأعمال
public class TokenService(TimeProvider timeProvider) {
    public bool IsExpired(Token t) => timeProvider.GetUtcNow() > t.ExpiresAt;
}

// في الاختبار
var fakeTime = new FakeTimeProvider();
var service = new TokenService(fakeTime);
fakeTime.Advance(TimeSpan.FromDays(2));`,
    commonMistakes: ["استمرار استخدام DateTime.UtcNow أو Task.Delay المباشر في كود الخدمات مما يمنع اختبارها بحتمية وسرعة."],
    followUpQuestions: ["كيف تنشئ مؤقتاً غير متزامن يتبع للـ TimeProvider عبر timeProvider.CreateTimer()؟"],
    sources: [{ title: "Microsoft Learn — TimeProvider Class", url: "https://learn.microsoft.com/en-us/dotnet/api/system.timeprovider" }],
  },
  {
    id: "ntestnet-007",
    slug: "dotnet-architecture-testing-netarchtest",
    topicId: "dotnet-testing",
    difficulty: "Senior",
    question: "كيف تطبق اختبارات المعمارية (Architecture Tests) باستخدام مكتبات مثل NetArchTest في .NET؟",
    shortAnswer: "تكتب اختبارات وحدة تفحص التجميعات وتفرض القواعد المعمارية؛ كأن تمنع طبقة الـ Domain من الإشارة لطبقة الـ Infrastructure أو تفرض تسميات موحدة للمتحكمات.",
    explanation: "في الفرق الكبيرة، يسهل كسر قواعد المعمارية النظيفة (Clean Architecture) بالخطأ كأن يستورد مطور كود SQL داخل كيان الـ Domain. تقوم مكتبة NetArchTest بفحص شجرة الأنواع في الـ Assemblies برمجياً؛ فإذا قامت أي فئة في Domain بتوريث أو استيراد كلاس من Infrastructure، يفشل اختبار الـ CI فوراً ويمنع دمج الكود قبل وصوله للإنتاج.",
    codeExample: `[Fact]
public void Domain_Should_Not_DependOn_Infrastructure() {
    var result = Types.InAssembly(typeof(DomainEntity).Assembly)
        .ShouldNot()
        .HaveDependencyOn("Infrastructure")
        .GetResult();

    Assert.True(result.IsSuccessful);
}`,
    commonMistakes: ["الاعتماد حصراً على مراجعة الكود اليدوية (Code Review) لاكتشاف انتهاكات المعمارية النظيفة بدلاً من أتمتتها."],
    followUpQuestions: ["كيف تختبر قاعدة أن جميع الـ Commands في تطبيقك يجب أن تطبق واجهة IRequest<T> وتنتهي بكلمة Command؟"],
    sources: [{ title: "Microsoft Learn — Common Application Architecture Design", url: "https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures" }],
  },
  {
    id: "ntestnet-008",
    slug: "dotnet-mutation-testing-stryker",
    topicId: "dotnet-testing",
    difficulty: "Senior",
    question: "ما هو فحص الطفرات (Mutation Testing) بأداة Stryker.NET وكيف يقيس الجودة الحقيقية للتوكيدات؟",
    shortAnswer: "يقوم بتعديل شروط الكود عمداً (مثل عكس الشروط أو حذف السطور)؛ فإذا نجحت الاختبارات رغم التخريب (Survived)، فهذا يكشف ضعف التوكيدات وحالات حدية غير مغطاة.",
    explanation: "نسبة تغطية الكود (Code Coverage) لا تعني جودة الاختبارات. تقوم أداة dotnet-stryker بحقن طفرات في الـ IL والـ Syntax (Mutants)؛ مثل استبدال > بـ >= أو استبدال true بـ false. إذا فشل الاختبار عند حدوث الطفرة، يُعد الطافر مقتولاً (Killed)، أما إذا نجح الاختبار، فهذا إنذار بوجود كود غير مفحوص بتوكيد حقيقي أو اختبار سطحي لا قيمة له.",
    codeExample: `// تشغيل فحص الطفرات من موجه الأوامر:
// dotnet tool install -g dotnet-stryker
// dotnet-stryker`,
    commonMistakes: ["الافتخار بتحقيق 100% Code Coverage مع وجود نسبة Mutation Score متدنية جداً تكشف هشاشة الاختبارات."],
    followUpQuestions: ["كيف تستثني دوال السجلات أو الأكواد المولدة تلقائياً من فحص الطفرات في ملف stryker-config.json؟"],
    sources: [{ title: "Microsoft Learn — Unit testing best practices", url: "https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-best-practices" }],
  },
  {
    id: "ntestnet-009",
    slug: "dotnet-theory-and-inline-data-testing",
    topicId: "dotnet-testing",
    difficulty: "Junior",
    question: "ما الفرق بين سمة [Fact] وسمة [Theory] في إطار xUnit وكيف تمرر مجموعات بيانات بـ [InlineData]؟",
    shortAnswer: "الـ [Fact] اختبار مفرد ينفذ مرة واحدة بشروط ثابتة، بينما [Theory] اختبار معياري يقبل معاملات وينفذ عدة مرات لكل صف بيانات في [InlineData] أو [MemberData].",
    explanation: "إذا أردت اختبار دالة التحقق من البريد الإلكتروني مع 10 مدخلات مختلفة، فإن كتابة 10 دوال [Fact] تكرار غير مبرر. باستخدام [Theory] و [InlineData('valid@test.com', true)]، يمكنك تغذية نفس دالة الاختبار بقيم صحيحة وخاطئة متعددة وتجربة الحالات الحدية بسهولة فائقة في دالة واحدة موجزة.",
    codeExample: `[Theory]
[InlineData(2, true)]
[InlineData(3, false)]
[InlineData(4, true)]
public void IsEven_ReturnsCorrectResult(int number, bool expected) {
    Assert.Equal(expected, MathUtils.IsEven(number));
}`,
    commonMistakes: ["تمرير كائنات معقدة غير ثابتة داخل [InlineData]؛ تقبل InlineData ثوابت ثابتة فقط، وللكائنات المعقدة يجب استخدام [MemberData] أو [ClassData]."],
    followUpQuestions: ["كيف تنظم وتستدعي بيانات اختبارات ضخمة من فئة منفصلة باستخدام [ClassData] في xUnit؟"],
    sources: [{ title: "Microsoft Learn — Create unit tests with xUnit", url: "https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-with-dotnet-test" }],
  },
  {
    id: "ntestnet-010",
    slug: "dotnet-testing-httpclient-mocking",
    topicId: "dotnet-testing",
    difficulty: "Mid",
    question: "كيف تختبر عملاء HttpClient بأمان دون إرسال طلبات شبكة حقيقية باستخدام MockHttpMessageHandler؟",
    shortAnswer: "باستبدال معالج الرسائل الأساسي (HttpMessageHandler) بمعالج وهمي يعترض استدعاء SendAsync ويرجع استجابة HttpResponseMessage محددة مسبقاً.",
    explanation: "فئة HttpClient لا تمتلك دوالاً افتراضية لتطبيق Mock عليها مباشرة. الطريقة المعمارية الرسمية لاختبارها هي استبدال المعالج الداخلي HttpMessageHandler بفئة وهمية مخصصة (أو باستخدام مكتبة RichardSzalay.MockHttp). يقوم هذا المعالج باعتراض الطلب وفحص الروابط والترويسات وإرجاع كود الحالة والـ JSON المتوقع دون لمس شبكة الإنترنت إطلاقاً.",
    codeExample: `var handler = new MockHttpMessageHandler();
handler.When("https://api.github.com/users/*")
       .Respond("application/json", "{'name':'octocat'}");

var client = new HttpClient(handler);
var service = new GitHubService(client);
var result = await service.GetUserNameAsync("octocat");
Assert.Equal("octocat", result);`,
    commonMistakes: ["استدعاء خوادم إنترنت حقيقية في اختبارات الوحدة مما يجعلها تفشل عند انقطاع الشبكة أو بطء الخادم الخارجي."],
    followUpQuestions: ["كيف تدمج المعالج الوهمي مع IHttpClientFactory عبر services.AddHttpClient().ConfigurePrimaryHttpMessageHandler()؟"],
    sources: [{ title: "Microsoft Learn — Mocking HttpClient in ASP.NET Core tests", url: "https://learn.microsoft.com/en-us/dotnet/architecture/microservices/implement-resilient-applications/use-httpclientfactory-to-implement-resilient-http-requests" }],
  },

  // Topic: dotnet-architecture (10 questions: narchnet-001 to narchnet-010)
  {
    id: "narchnet-001",
    slug: "dotnet-clean-architecture-layers-and-dependencies",
    topicId: "dotnet-architecture",
    difficulty: "Senior",
    question: "كيف تنظم طبقات المعمارية النظيفة (Clean Architecture) في حلول .NET Enterprise؟",
    shortAnswer: "بتقسيم الحل إلى 4 مشاريع: Domain (الكيانات ومنطق الأعمال النقي)، Application (حالات الاستخدام والواجهات)، Infrastructure (قواعد البيانات والـ APIs)، و WebApi (المتحكمات)، مع اتجاه التبعيات دائماً للداخل.",
    explanation: "الهدف الجوهري هو عزل منطق الأعمال الأساسي عن أي تفاصيل تقنية قابلة للتغيير. مشروع Domain لا يعتمد على أي مشروع آخر ولا يثبت أي حزم خارجية. مشروع Application يعرف حالات الاستخدام عبر MediatR Interfaces. بينما يعتمد مشروع Infrastructure على Application لتنفيذ الواجهات (مثل EF Core DbContext)، وتقوم طبقة WebApi بربط الجميع عبر الـ Dependency Injection.",
    codeExample: `// هيكل التبعيات:
// WebApi -> Infrastructure -> Application -> Domain (Core)`,
    commonMistakes: ["إضافة مرجع لـ EF Core أو ASP.NET Core داخل مشروع Domain مما يلوث نقاء منطق الأعمال."],
    followUpQuestions: ["كيف تحافظ على استقلالية كائنات الـ Domain Entities عن قيود قاعدة البيانات باستخدام Fluent API في طبقة Infrastructure؟"],
    sources: [{ title: "Microsoft Learn — Common web application architectures", url: "https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures" }],
  },
  {
    id: "narchnet-002",
    slug: "dotnet-cqrs-and-mediatr-pattern",
    topicId: "dotnet-architecture",
    difficulty: "Mid",
    question: "ما هو نمط CQRS وكيف تسهل مكتبة MediatR فصل القراءة عن الكتابة في مشاريع C#؟",
    shortAnswer: "يفصل عمليات تعديل الحالة (Commands) عن استعلامات جلب البيانات (Queries)؛ وتعمل MediatR كناقل رسائل وسيط (In-process Mediator) يربط كل طلب بمعالجه المستقل IRequestHandler.",
    explanation: "في أنظمة Command Query Responsibility Segregation (CQRS)، تختلف متطلبات القراءة عن الكتابة. في الكتابة، تحتاج لـ Domain Models وتدقيق صارم ومعاملات ذرية. في القراءة، تحتاج لسرعة فائقة واستعلامات DTO مسطحة دون أعباء التتبع. توفر MediatR عزل كامل؛ حيث يرسل المتحكم الأمر mediator.Send(new CreateOrderCommand(dto)) وتتوجه الرسالة للمعالج المخصص دون معرفة المتحكم بالتفاصيل.",
    codeExample: `public record GetUserQuery(int Id) : IRequest<UserDto?>;

public class GetUserHandler(AppDbContext db) : IRequestHandler<GetUserQuery, UserDto?> {
    public async Task<UserDto?> Handle(GetUserQuery request, CancellationToken ct) =>
        await db.Users.AsNoTracking().Where(u => u.Id == request.Id).ProjectToDto().FirstOrDefaultAsync(ct);
}`,
    commonMistakes: ["تعديل بيانات الكيان داخل معالجات الـ Queries؛ يجب أن تكون الاستعلامات خالية تماماً من أي آثار جانبية (Side Effects)."],
    followUpQuestions: ["كيف تطبق وسائط معالجة مدمجة مثل التدقيق والتسجيل التلقائي عبر MediatR IPipelineBehavior؟"],
    sources: [{ title: "Microsoft Learn — CQRS pattern in Microservices", url: "https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/apply-simplified-cqrs-cqrs-s-architecture" }],
  },
  {
    id: "narchnet-003",
    slug: "dotnet-mediatr-pipeline-behaviors",
    topicId: "dotnet-architecture",
    difficulty: "Senior",
    question: "ما هي سلوكيات خط الأنابيب (Pipeline Behaviors) في MediatR وكيف تطبق البرمجة الموجهة للجوانب (AOP)؟",
    shortAnswer: "وسائط داخلية تعترض كل طلب IRequest قبل وصوله للـ Handler، وتستخدم لتنفيذ مهام متقاطعة مثل التحقق من المدخلات بـ FluentValidation، والتسجيل، والكاش، وإدارة المعاملات.",
    explanation: "بدلاً من كتابة كود فحص الصلاحيات أو قياس زمن التنفيذ داخل كل معالج بشكل متكرر، تتيح فئة IPipelineBehavior<TRequest, TResponse> اعتراض أي طلب يمر عبر MediatR. يمكنك مثلاً إنشاء ValidationBehavior يفحص ما إذا كان هناك أي قواعد FluentValidation للطلب ويرمي ValidationException قبل تشغيل الـ Handler، محافظاً على نقاء منطق الأعمال.",
    codeExample: `public class LoggingBehavior<TRequest, TResponse>(ILogger<TRequest> logger)
    : IPipelineBehavior<TRequest, TResponse> where TRequest : notnull {
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken ct) {
        logger.LogInformation("Handling {RequestName}", typeof(TRequest).Name);
        var response = await next();
        logger.LogInformation("Handled {RequestName}", typeof(TRequest).Name);
        return response;
    }
}`,
    commonMistakes: ["نسيان استدعاء await next() داخل الـ Behavior مما يقطع تدفق الطلب ويمنع وصوله للـ Handler."],
    followUpQuestions: ["كيف تسجل الـ Pipeline Behaviors بالترتيب الصحيح داخل الـ Dependency Injection Container؟"],
    sources: [{ title: "Microsoft Learn — Cross-cutting concerns in ASP.NET Core microservices", url: "https://learn.microsoft.com/en-us/dotnet/architecture/microservices/net-core-net-framework-differences/" }],
  },
  {
    id: "narchnet-004",
    slug: "dotnet-domain-driven-design-entities-aggregates",
    topicId: "dotnet-architecture",
    difficulty: "Senior",
    question: "ما الفرق بين الكيانات (Entities) وكائنات القيمة (Value Objects) وجذور التجميع (Aggregate Roots) في DDD؟",
    shortAnswer: "الـ Entity تتميز بهوية فريدة مستمرة (Id)، والـ Value Object تتميز بقيمها وليس لها هوية، والـ Aggregate Root هو الكيان القائد الذي يضمن اتساق وتعديل كامل المجموعة التابعة له.",
    explanation: "في التصميم الموجه بالنطاق (DDD)، يمثل الـ Aggregate Root (مثل Order) الحارس الوحيد لقواعد العمل؛ فلا يمكن لكود خارجي تعديل بنود الطلب (OrderItems) مباشرة بل من خلال دوال الـ Order (مثل order.AddItem(...)) لضمان عدم خرق أي قاعدة عمل (Invariants). كائنات القيمة (مثل Address أو Money) تعامل كـ Immutable Records وتتطابق بتطابق قيمها.",
    codeExample: `public class Order : AggregateRoot {
    public OrderId Id { get; private set; }
    private readonly List<OrderItem> _items = [];
    public IReadOnlyCollection<OrderItem> Items => _items.AsReadOnly();

    public void AddItem(ProductId productId, decimal price, int quantity) {
        // حماية قواعد العمل والاتساق الذاتي
        _items.Add(new OrderItem(productId, price, quantity));
    }
}`,
    commonMistakes: ["كشف مجموعات الكائنات التابعة كـ public List<T> مع إمكانية التعديل المباشر من الخارج مما يكسر حماية الـ Aggregate Root."],
    followUpQuestions: ["كيف تطلق كائنات الـ Aggregate أحداث النطاق (Domain Events) لإشعار الأنظمة الأخرى بالتغييرات؟"],
    sources: [{ title: "Microsoft Learn — Design a DDD-oriented microservice", url: "https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/ddd-oriented-microservice" }],
  },
  {
    id: "narchnet-005",
    slug: "dotnet-event-sourcing-and-martendb",
    topicId: "dotnet-architecture",
    difficulty: "Senior",
    question: "ما هو نمط استقصاء الأحداث (Event Sourcing) وكيف تختلف قواعد بيانات الأحداث عن قواعد البيانات التقليدية؟",
    shortAnswer: "بدلاً من حفظ الحالة الحالية فقط، يسجل النظام كل تغيير كحدث تاريخي غير قابل للتعديل (Append-Only Event)، وتُبنى الحالة الحالية بإعادة تطبيق سلسلة الأحداث من البداية.",
    explanation: "في الأنظمة المالية وتتبع الشحنات، لا يكفي معرفة أن رصيد الحساب 500$؛ بل يجب معرفة السجل الكامل لكل عملية إيداع وسحب وقعت تاريخياً. يوفر Event Sourcing سجلاً تدقيقياً كاملاً لا يمكن تزويره. توفر مكتبات مثل Marten (فوق PostgreSQL) أو EventStoreDB دعماً أصيلاً لتسجيل الأحداث وتوليد إسقاطات القراءة السريعة (Read Projections) تلقائياً.",
    codeExample: `// الأحداث المخزنة غير القابلة للتعديل
public record AccountCreated(Guid Id, string Owner);
public record MoneyDeposited(Guid Id, decimal Amount);
public record MoneyWithdrawn(Guid Id, decimal Amount);`,
    commonMistakes: ["تعديل أو حذف أحداث سابقة مخزنة في الـ Event Store؛ سجل الأحداث ثابت للأبد (Immutable) ويتم التصحيح بإضافة حدث جديد."],
    followUpQuestions: ["كيف تحل مشكلة بطء بناء الحالة للحسابات التي تمتلك ملايين الأحداث باستخدام الـ Snapshots؟"],
    sources: [{ title: "Microsoft Learn — Event Sourcing pattern", url: "https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing" }],
  },
  {
    id: "narchnet-006",
    slug: "dotnet-outbox-pattern-and-masstransit",
    topicId: "dotnet-architecture",
    difficulty: "Senior",
    question: "ما هي مشكلة الإرسال المزدوج (Dual-Write) وكيف يحلها نمط صندوق الصادر (Transactional Outbox) بـ MassTransit؟",
    shortAnswer: "تحدث عند محاولة حفظ البيانات في قاعدة البيانات ونشر رسالة لـ RabbitMQ/Kafka معاً وفشل أحدهما؛ وتحلها Outbox بحفظ الرسالة في جدول محلي داخل نفس المعاملة ثم نشرها لاحقاً.",
    explanation: "لا يمكنك عمل Distributed Transaction موثوقة بين قاعدة بيانات و Message Broker. إذا حفظت الطلب في SQL وفشلت الشبكة قبل إرسال الرسالة، لن يعلم المستودع بالطلب. مع نمط Outbox، يتم إدراج الرسالة في جدول OutboxMessages بنفس معاملة قاعدة البيانات. يقوم عامل خلفي مستقل (أو حزمة MassTransit Outbox) بقراءة الجدول ونشر الرسائل للموزع مع ضمان تسليم 'مرة واحدة على الأقل'.",
    codeExample: `// تفعيل MassTransit Transactional Outbox
builder.Services.AddMassTransit(x => {
    x.AddEntityFrameworkOutbox<AppDbContext>(o => {
        o.UsePostgres();
        o.UseBusOutbox();
    });
});`,
    commonMistakes: ["إرسال رسائل الـ Message Broker مباشرة داخل دوال المتحكمات قبل التأكد من نجاح حفظ معاملة قاعدة البيانات."],
    followUpQuestions: ["كيف يتعامل مستهلك الرسائل مع احتمال وصول رسائل مكررة بتطبيق الـ Idempotency؟"],
    sources: [{ title: "Microsoft Learn — Asynchronous message-based communication", url: "https://learn.microsoft.com/en-us/dotnet/architecture/microservices/architect-microservice-container-applications/asynchronous-message-based-communication" }],
  },
  {
    id: "narchnet-007",
    slug: "dotnet-polly-v8-resilience-pipelines",
    topicId: "dotnet-architecture",
    difficulty: "Mid",
    question: "كيف تصمم خطوط الصمود (Resilience Pipelines) باستخدام مكتبة Polly v8 المدمجة في .NET 8؟",
    shortAnswer: "باستخدام Microsoft.Extensions.Resilience لدمج استراتيجيات Retry و Circuit Breaker و Timeout و Rate Limiter في خط دفاع موحد ومرن لاستدعاءات الشبكة.",
    explanation: "أعادت Polly v8 بناء هندستها بالكامل لتصبح فائقة السرعة وخالية من التخصيصات الزائدة، ودُمجت رسمياً مع عملاء HTTP في .NET عبر AddResilienceHandler(). يمكنك تكوين خط دفاع يحتوي على: إعادة المحاولة مع Exponential Backoff و Jitter للشبكات المتذبذبة، وقاطع دائرة لحماية الخادم عند تعطل الخدمة التابعة، ومهلة قصوى لكل محاولة.",
    codeExample: `builder.Services.AddHttpClient("ExternalService")
    .AddStandardResilienceHandler(options => {
        options.Retry.MaxRetryAttempts = 3;
        options.CircuitBreaker.SamplingDuration = TimeSpan.FromSeconds(30);
    });`,
    commonMistakes: ["إعادة المحاولة الفورية بدون Jitter (تأخير عشوائي) مما يسبب هجوماً متزامناً يسقط الخادم البعيد (Thundering Herd Problem)."],
    followUpQuestions: ["ما أهمية استراتيجية Fallback في إرجاع بيانات بديلة أو مخزنة مؤقتاً عند فشل جميع محاولات Polly؟"],
    sources: [{ title: "Microsoft Learn — Build resilient HTTP apps: Key development patterns", url: "https://learn.microsoft.com/en-us/dotnet/core/resilience/http-resilience" }],
  },
  {
    id: "narchnet-008",
    slug: "dotnet-grpc-services-and-protobuf",
    topicId: "dotnet-architecture",
    difficulty: "Mid",
    question: "كيف تبني خدمات gRPC عالية السرعة في .NET وما دور ملفات البروتوكول .proto؟",
    shortAnswer: "تعرف عقود الخدمات والرسائل بأنواع صارمة في ملفات .proto، ويولد مجمع C# فئات أساسية سريعة تتواصل بتسلسل ثنائي مضغوط فوق بروتوكول HTTP/2.",
    explanation: "تعد gRPC الخيار الأمثل للاتصالات المباشرة بين خدمات الـ Microservices في .NET. بفضل استخدام Protocol Buffers الثنائي بدلاً من نصوص JSON، ينخفض حجم البيانات المنقولة عبر الشبكة بنسبة تصل لـ 70%، ويقل زمن معالجة التسلسل بنسبة 80%، مع دعم أصيل للتدفق المزدوج (Client & Server Streaming) وعقود برمجية محصنة بين مختلف اللغات.",
    codeExample: `// Greeter.proto
syntax = "proto3";
service Greeter {
  rpc SayHello (HelloRequest) returns (HelloReply);
}
message HelloRequest { string name = 1; }
message HelloReply { string message = 1; }`,
    commonMistakes: ["استخدام أرقام حقول مكررة أو تعديل أرقام الحقول القديمة في ملف .proto مما يكسر التوافق الثنائي للنسخ السابقة."],
    followUpQuestions: ["كيف تدمج gRPC-JSON transcoding لإتاحة نفس خدمة gRPC كـ RESTful JSON API للمتصفحات العادية؟"],
    sources: [{ title: "Microsoft Learn — Overview for gRPC on .NET", url: "https://learn.microsoft.com/en-us/aspnet/core/grpc/" }],
  },
  {
    id: "narchnet-009",
    slug: "dotnet-opentelemetry-distributed-tracing",
    topicId: "dotnet-architecture",
    difficulty: "Senior",
    question: "كيف تطبق التتبع والمراقبة الموزعة (Distributed Tracing) باستخدام فئة Activity و OpenTelemetry في .NET؟",
    shortAnswer: "فئة Activity هي التمثيل المدمج لـ Span في .NET؛ وتجمع OpenTelemetry مسارات الطلبات عبر الخدمات وتمرر ترويسة traceparent القياسية بين الخوادم.",
    explanation: "تتمتع .NET بدعم استثنائي أصيل للـ Tracing عبر System.Diagnostics.ActivitySource. عند تفعيل OpenTelemetry SDK، يتم تتبع مسار كل طلب HTTP، واستعلام SQL في EF Core، ورسالة في MassTransit تلقائياً، وتمرير معرف الـ TraceId عبر ترويسات W3C Trace Context، لتظهر الرحلة الكاملة للطلب كمخطط زمني شامل على لوحات Jaeger و Aspire Dashboard.",
    codeExample: `builder.Services.AddOpenTelemetry()
    .WithTracing(tracing => tracing
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddEntityFrameworkCoreInstrumentation()
        .AddOtlpExporter());`,
    commonMistakes: ["عدم تتبع ونقل ترويسات الـ Tracing داخل خيوط المهام الخلفية أو قنوات الـ Channels."],
    followUpQuestions: ["كيف تنشئ ActivitySource مخصصاً داخل نطاق عملك لقياس فترات العمليات الحسابية الخاصة؟"],
    sources: [{ title: "Microsoft Learn — .NET distributed tracing", url: "https://learn.microsoft.com/en-us/dotnet/core/diagnostics/distributed-tracing" }],
  },
  {
    id: "narchnet-010",
    slug: "dotnet-aspire-cloud-native-orchestration",
    topicId: "dotnet-architecture",
    difficulty: "Senior",
    question: "ما هو .NET Aspire وكيف يسهل بناء ومراقبة التطبيقات السحابية الموزعة (Cloud-Native)؟",
    shortAnswer: "إطار عمل يجمع بين تنسيق الخدمات محلياً (Orchestration)، ومكونات جاهزة مسبقاً (Components) مزودة بأفضل ممارسات الصمود، ولوحة تحكم مركزية للتشخيص.",
    explanation: "أطلقت مايكروسوفت .NET Aspire لحل تعقيدات إدارة الـ Microservices في بيئات التطوير والسحاب. يتكون من: AppHost لتحديد العلاقات وتشغيل حاويات Redis وقواعد البيانات وخدمات الـ API تلقائياً، وحزم Aspire Components المجهزة مسبقاً بفحوصات الجاهزية (Health Checks) والتتبع الموزع ومكتبات Polly، ولوحة تحكم مدمجة (Aspire Dashboard) لمراقبة السجلات والمقاييس حياً.",
    codeExample: `// AppHost/Program.cs
var builder = DistributedApplication.CreateBuilder(args);
var redis = builder.AddRedis("cache");
var postgres = builder.AddPostgres("db");
builder.AddProject<Projects.MyApi>("api")
       .WithReference(redis)
       .WithReference(postgres);
builder.Build().Run();`,
    commonMistakes: ["اعتبار .NET Aspire بديلاً عن Kubernetes؛ هو أداة تنسيق للتطوير وتبسيط البنية تترجم بسهولة لنشر Kubernetes أو Azure Container Apps."],
    followUpQuestions: ["كيف يدعم .NET Aspire نشر التطبيقات السحابية عبر أداة azure developer cli (azd) بملف manifest موحد؟"],
    sources: [{ title: "Microsoft Learn — .NET Aspire overview", url: "https://learn.microsoft.com/en-us/dotnet/aspire/get-started/aspire-overview" }],
  },
];

function getDotnetTopicId(id: string): string {
  if (id.startsWith("ncsharp-")) return "dotnet-csharp";
  if (id.startsWith("nruntime-")) return "dotnet-runtime";
  if (id.startsWith("nasp-")) return "dotnet-aspnet";
  if (id.startsWith("ndi-")) return "dotnet-di";
  if (id.startsWith("nef-")) return "dotnet-efcore";
  if (id.startsWith("nasyncnet-")) return "dotnet-async";
  if (id.startsWith("nsecnet-")) return "dotnet-security";
  if (id.startsWith("nperfnet-")) return "dotnet-perf";
  if (id.startsWith("ntestnet-")) return "dotnet-testing";
  if (id.startsWith("narchnet-")) return "dotnet-architecture";
  return "dotnet-csharp";
}

const formattedQuestions = rawQuestions.map((q) => ({
  id: q.id,
  slug: q.slug,
  trackId: "dotnet",
  topicIds: [getDotnetTopicId(q.id)],
  difficulty: q.difficulty,
  question: q.question,
  shortAnswer: q.shortAnswer,
  explanation: q.explanation,
  codeExample: q.codeExample,
  commonMistakes: q.commonMistakes,
  followUpQuestions: q.followUpQuestions,
  sources: q.sources,
  lastReviewedAt: "2026-09-07",
}));

console.log(`Generating .NET questions: ${formattedQuestions.length}`);

// Write output to src/content/dotnet-questions.ts
const fileHeader = `// Generated by scripts/build-dotnet-questions.ts
import type { InterviewQuestion } from "./questions.ts";

export const dotnetBaseQuestions: Omit<InterviewQuestion, "translations">[] = `;

const content = `${fileHeader}${JSON.stringify(formattedQuestions, null, 2)};\n`;
writeFileSync(resolve(process.cwd(), "src/content/dotnet-questions.ts"), content, "utf8");
console.log("Successfully generated src/content/dotnet-questions.ts with 100 questions.");
