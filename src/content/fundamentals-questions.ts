// Generated for Software Fundamentals Track (100 in-depth CS questions across 10 topics)
import type { InterviewQuestion } from "./questions.ts";

export const fundamentalsBaseQuestions: Omit<InterviewQuestion, "translations">[] = [
  {
    "id": "foop-001",
    "slug": "oop-four-pillars-encapsulation-abstraction",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-oop"
    ],
    "difficulty": "Junior",
    "question": "ما هي الأركان الأربعة للبرمجة كائنية التوجه (OOP) وما الفرق بين التغليف (Encapsulation) والتجريد (Abstraction)؟",
    "shortAnswer": "الأركان الأربعة هي: التغليف، التجريد، الوراثة، وتعدد الأشكال. التغليف يركز على إخفاء الحالة الداخلية وحمايتها، بينما التجريد يركز على إخفاء تفاصيل التنفيذ المعقدة وإبراز الواجهة الضرورية فقط.",
    "explanation": "التغليف (Encapsulation) يدمج البيانات والعمليات التي تعمل عليها في وحدة واحدة (Class) ويقيد الوصول المباشر إلى المتغيرات إلا عبر Getters/Setters أو دوال محددة لضمان تكامل الحالة. بينما التجريد (Abstraction) يُعنى بتبسيط الرؤية البرمجية للمستخدم (كالضغط على زر تشغيل السيارة دون الحاجة لفهم دورة الاحتراق الداخلي).",
    "codeExample": "class BankAccount {\n  private balance: number = 0;\n\n  public deposit(amount: number): void {\n    if (amount <= 0) throw new Error('Invalid amount');\n    this.balance += amount;\n  }\n\n  public getBalance(): number {\n    return this.balance;\n  }\n}",
    "commonMistakes": [
      "الخلط بين التغليف ومجرد كتابة دوال Getters و Setters لكل حقل دون أي منطق تحقق وحماية.",
      "اعتبار التجريد والتغليف اسماً لمعنى واحد، متجاهلين أن أحدهما لإخفاء البيانات والآخر لإخفاء التعقيد."
    ],
    "followUpQuestions": [
      "كيف يؤدي غياب التغليف إلى ظهور نموذج الدومين الفقير (Anemic Domain Model)؟"
    ],
    "sources": [
      {
        "title": "Refactoring Guru — OOP Basics",
        "url": "https://refactoring.guru/design-patterns/oop"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "foop-002",
    "slug": "oop-composition-over-inheritance-benefits",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-oop"
    ],
    "difficulty": "Junior",
    "question": "لماذا ينصح مبدأ 'Composition over Inheritance' بتفضيل التركيب على الوراثة الكلاسيكية؟",
    "shortAnswer": "لأن الوراثة تنشئ ارتباطاً وثيقاً ثابتاً وقت الترجمة (Compile-time Coupling) وتؤدي لمشكلة الفئة الأساسية الهشة، بينما يتيح التركيب تبديل السلوك ديناميكياً وقت التشغيل وبمرونة عالية.",
    "explanation": "تعتبر الوراثة علاقة 'is-a' تفضح تفاصيل الفئة الأب للابن (White-box reuse)، وأي تعديل في الأب قد يكسر الأبناء دون قصد (Fragile Base Class Problem). بينما يمثل التركيب علاقة 'has-a' (Black-box reuse) حيث يمتلك الكائن مراجع لكائنات أخرى تنفذ واجهات محددة، مما يسهل الاختبار واستبدال المكونات.",
    "codeExample": "// بدلاً من الوراثة الصلبة: class FlyingSwimmingDuck extends Duck\nclass Duck {\n  constructor(private flyBehavior: FlyBehavior, private swimBehavior: SwimBehavior) {}\n  performFly() { this.flyBehavior.fly(); }\n}",
    "commonMistakes": [
      "استخدام الوراثة لمجرد إعادة استخدام بضعة أسطر من الكود دون وجود علاقة منطقية حقيقية بين النوعين."
    ],
    "followUpQuestions": [
      "متى تكون الوراثة خياراً ممتازاً ومبرراً هندسياً؟"
    ],
    "sources": [
      {
        "title": "Composition over inheritance - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Composition_over_inheritance"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "foop-003",
    "slug": "oop-polymorphism-static-vs-dynamic-dispatch",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-oop"
    ],
    "difficulty": "Mid",
    "question": "ما هو تعدد الأشكال (Polymorphism) وما الفرق بين الإرسال الثابت (Static Dispatch) والإرسال الديناميكي (Dynamic Dispatch)؟",
    "shortAnswer": "تعدد الأشكال هو قدرة الكائنات المختلفة على الاستجابة لنفس الرسالة بطرق متباينة. الإرسال الثابت يُحسم وقت الترجمة (مثل Method Overloading)، بينما الديناميكي يُحسم وقت التشغيل عبر جداول الدوال الافتراضية (vtable).",
    "explanation": "في اللغات ذات الكتابة الثابتة (مثل C++ و C# و Java)، يتم تنفيذ Dynamic Dispatch عن طريق Virtual Method Table (vtable). يحتوي كل كائن على مؤشر للـ vtable الخاصة بفئته، وعند استدعاء دالة افتراضية يتم قراءة عنوان الدالة في وقت التشغيل، مما يضيف كلفة معالجة طفيفة جداً لكنه يمنح مرونة معمارية هائلة.",
    "codeExample": "interface Shape {\n  draw(): void;\n}\nclass Circle implements Shape { draw() { console.log('Circle'); } }\nclass Square implements Shape { draw() { console.log('Square'); } }\n\nfunction render(shapes: Shape[]) {\n  for (const s of shapes) s.draw(); // Dynamic Dispatch وقت التشغيل\n}",
    "commonMistakes": [
      "الاعتقاد بأن Overloading و Overriding يعملان بنفس الطريقة في الذاكرة ووقت التنفيذ."
    ],
    "followUpQuestions": [
      "كيف تؤثر دوال Inline والمترجمات الذكية على تقليل تكلفة الـ vtable lookup؟"
    ],
    "sources": [
      {
        "title": "Virtual method table - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Virtual_method_table"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "foop-004",
    "slug": "oop-diamond-problem-multiple-inheritance",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-oop"
    ],
    "difficulty": "Mid",
    "question": "ما هي معضلة الألماس (The Diamond Problem) في الوراثة المتعددة وكيف تحلها اللغات الحديثة؟",
    "shortAnswer": "تحدث المعضلة عندما ترث فئة من فئتين تشتركان في فئة أب مشتركة، مما يسبب غموضاً حول أي نسخة من دوال أو خصائص الأب يجب أن ترثها الفئة الابنة.",
    "explanation": "إذا كانت الكلاس A تمتلك دالة foo()، وقامت كل من B و C بوراثة A وتعديل foo()، ثم ورثت الفئة D من B و C معاً، فعند استدعاء D.foo() لا يستطيع المترجم تحديد أي دالة يقصدها المبرمج. منعت لغات مثل Java و C# الوراثة المتعددة للفئات واكتفت بتعدد واجهات (Interfaces)، بينما حلتها C++ بالوراثة الافتراضية (Virtual Inheritance) واستخدمت Python خوارزمية C3 Linearization (MRO).",
    "codeExample": "// تمثيل المعضلة:\n//     [A]\n//    /   \\\n//  [B]   [C]\n//    \\   /\n//     [D] -> أي foo() سيتم استدعاؤها؟",
    "commonMistakes": [
      "الاعتقاد بأن تطبيق كلاس لعدة Interfaces يسبب مشكلة الألماس، في حين أن الواجهات بلا كود تنفيذي أصلي لا تحدث أي تصادم في الحالة."
    ],
    "followUpQuestions": [
      "كيف تساهم الميكسنز (Mixins) والـ Traits في حل مشاركة الكود بدون مساوئ الوراثة المتعددة؟"
    ],
    "sources": [
      {
        "title": "Multiple inheritance and diamond problem - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Multiple_inheritance"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "foop-005",
    "slug": "oop-abstract-classes-vs-interfaces",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-oop"
    ],
    "difficulty": "Junior",
    "question": "ما الفرق المعماري الدقيق بين الفئة المجردة (Abstract Class) والواجهة (Interface)؟",
    "shortAnswer": "الفئة المجردة تمثل هوية جزئية مشتركة ('is-a') ويمكنها الاحتفاظ بحالة (State) وتنفيذ افتراضي للدوال، بينما الواجهة تمثل عقداً سلوكياً ('can-do') يحدد ماذا تفعل الكائنات دون احتفاظ بحالة الفئة.",
    "explanation": "تُستخدم Abstract Classes عندما تشترك عدة فئات في كود تنفيذي مشترك وحالة محددة (Protected fields)، وتكون هناك علاقة وراثية عميقة. أما الواجهات (Interfaces) فتُستخدم لفصل واجهة الاستخدام تماماً عن التنفيذ وتحقيق فك الارتباط الكامل (Decoupling) وتمكين الاختبارات وعزل التبعيات.",
    "codeExample": "abstract class Animal {\n  constructor(public name: string) {} // تحتفظ بحالة\n  abstract makeSound(): void;\n  sleep() { console.log('Zzz...'); } // تنفيذ مشترك\n}\n\ninterface Flyable {\n  fly(): void; // عقد سلوكي بحت\n}",
    "commonMistakes": [
      "استخدام الفئات المجردة فقط كعقود فارغة دون أي كود مشترك بدلاً من استخدام الواجهات الأبسط والأخف."
    ],
    "followUpQuestions": [
      "لماذا أضافت لغات حديثة مثل Java 8+ و C# 8+ ميزة Default Interface Methods وما هي محاذيرها المعمارية؟"
    ],
    "sources": [
      {
        "title": "Interfaces vs Abstract Classes - Microsoft Docs",
        "url": "https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/tutorials/oop"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "foop-006",
    "slug": "oop-law-of-demeter-principle-least-knowledge",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-oop"
    ],
    "difficulty": "Senior",
    "question": "ما هو قانون ديميتر (Law of Demeter / Principle of Least Knowledge) وكيف تحمي الشفرة من سلاسل الاستدعاء الطويلة؟",
    "shortAnswer": "ينص القانون على أن المكون البرمجي يجب أن يتحدث فقط مع أصدقائه المقربين المباشرين، ولا ينبغي له معرفة الهيكل الداخلي للكائنات الفرعية التي يتعامل معها.",
    "explanation": "تعتبر استدعاءات 'Train Wrecks' مثل a.getB().getC().getD().doSomething() انتهاكاً صارخاً لقانون ديميتر؛ لأنها تجعل الكائن A معتمداً بشدة على تفاصيل الهيكلة الداخلية لـ B و C و D. إذا تغيرت تركيبة C ينهار كود A. الحل هو تفويض المسؤولية (Tell, Don't Ask) بإضافة دالة وسيطة في B تقوم بالمطلوب مباشرة a.getB().doActionOnD().",
    "codeExample": "// انتهاك صارخ: a.getInvoice().getCustomer().getAddress().getCity();\n// متوافق مع قانون ديميتر:\nconst city = invoice.getCustomerCity();",
    "commonMistakes": [
      "تطبيق قانون ديميتر على الـ Fluent Interfaces أو الـ Builder Pattern أو استعلامات LINQ/Streams، حيث أن تلك السلاسل ترجع نفس السياق ولا تنتهك التغليف."
    ],
    "followUpQuestions": [
      "ما العلاقة بين انتهاك قانون ديميتر وصعوبة كتابة اختبارات الوحدة باستخدام الـ Mocks؟"
    ],
    "sources": [
      {
        "title": "Law of Demeter - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Law_of_Demeter"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "foop-007",
    "slug": "oop-coupling-and-cohesion-metrics",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-oop"
    ],
    "difficulty": "Senior",
    "question": "ما الفرق بين الاقتران (Coupling) والتماسك (Cohesion) ولماذا نسعى دائماً إلى 'High Cohesion, Low Coupling'؟",
    "shortAnswer": "التماسك يقيس مدى ترابط وتركيز المسؤوليات داخل الوحدة الواحدة، بينما الاقتران يقيس درجة اعتماد الوحدات المختلفة على بعضها البعض.",
    "explanation": "التماسك العالي (High Cohesion) يعني أن الفئة تقوم بمهمة واحدة محددة وتخدم هدفاً موحداً، مما يجعلها سهلة الفهم والصيانة وإعادة الاستخدام. الاقتران المنخفض (Low Coupling) يعني أن تغيير فئة ما لن يجبرك على تعديل عشرات الفئات الأخرى. العمارة الممتازة تجمع المهام المتشابهة معاً وتفصل التبعيات عبر واجهات مجردة مستقرة.",
    "codeExample": "// فئة منخفضة التماسك وعالية الاقتران (God Object):\nclass OrderManager {\n  processOrder() { /*...*/ }\n  sendEmail() { /*...*/ }\n  renderHtmlInvoice() { /*...*/ }\n  executeSql() { /*...*/ }\n}",
    "commonMistakes": [
      "الاعتقاد بأن الاقتران المنخفض يعني عدم وجود أي تواصل بين الفئات نهائياً؛ الهدف هو تقليل الاعتماد على التفاصيل والتنفيذ الملموس."
    ],
    "followUpQuestions": [
      "ما هي مقاييس Afferent Coupling و Efferent Coupling وكيف تحسب عدم استقرار الحزمة (Instability Metric)؟"
    ],
    "sources": [
      {
        "title": "Coupling and Cohesion - Martin Fowler",
        "url": "https://martinfowler.com/articles/refactoring-2nd-ed.html"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "foop-008",
    "slug": "oop-value-objects-vs-entities-ddd",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-oop"
    ],
    "difficulty": "Mid",
    "question": "ما هو الفرق الجوهري بين كائن القيمة (Value Object) والكيان (Entity) في النمذجة كائنية التوجه؟",
    "shortAnswer": "الكيان يمتلك هوية مميزة فريدة (Identity / ID) تمتد عبر الزمن حتى لو تغيرت خصائصه، بينما يُعرّف كائن القيمة فقط بمحتوى خصائصه وهو غير قابل للتغيير (Immutable) ولا يمتلك ID.",
    "explanation": "المستخدم (User) هو Entity؛ لأن تغيير اسمه أو بريده لا يجعله شخصاً آخر وله معرف فريد ثابت (User ID). بينما المبلغ المالي (Money) أو العنوان (Address) يمثلان Value Objects؛ ورقة 100 دولار تطابق أي ورقة 100 دولار أخرى في القيمة، وتغيير المبلغ يعني إنشاء كائن قيمة جديد تماماً. تدعم Value Objects تكامل الدومين وتمنع الأخطاء الشائعة بمقارنة القيم (Structural Equality).",
    "codeExample": "class Money {\n  constructor(readonly amount: number, readonly currency: string) {\n    Object.freeze(this); // Immutability\n  }\n  equals(other: Money): boolean {\n    return this.amount === other.amount && this.currency === other.currency;\n  }\n}",
    "commonMistakes": [
      "إعطاء معرفات ID فريدة لكائنات القيمة مثل عناوين الشحن أو تواريخ النطاق وتخزينها ككيانات مستقلة مما يعقد النظام."
    ],
    "followUpQuestions": [
      "كيف تساهم كائنات القيمة في التخلص من رائحة الكود المسماة Primitive Obsession؟"
    ],
    "sources": [
      {
        "title": "Martin Fowler — Value Object",
        "url": "https://martinfowler.com/bliki/ValueObject.html"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "foop-009",
    "slug": "oop-anemic-vs-rich-domain-model",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-oop"
    ],
    "difficulty": "Senior",
    "question": "قارن بين نموذج الدومين الفقير (Anemic Domain Model) ونموذج الدومين الثري (Rich Domain Model)؟",
    "shortAnswer": "النموذج الفقير يفصل البيانات في كائنات بلا سلوك (مجموعات Getters/Setters) ويضع المنطق في خدمات خارجية، بينما يدمج النموذج الثري البيانات والمنطق وقواعد العمل معاً داخل الكيان.",
    "explanation": "وصف مارتن فاولر النموذج الفقير بأنه مضاد نمط (Anti-pattern) في البرمجة كائنية التوجه؛ لأنه يعيدنا للبرمجة الإجرائية القديمة (Procedural)، حيث تكون الفئات مجرد هياكل بيانات صامتة ويتبعثر منطق التحقق وقواعد العمل في طبقات الخدمات (Services). في المقابل، يضمن النموذج الثري عدم وصول الكيان إلى حالة غير صالحة أبداً (Always-valid state) عبر تغليف العمليات الحقيقية داخله.",
    "codeExample": "// نموذج ثري: الكيان يحمي شروطه:\nclass Order {\n  private items: OrderItem[] = [];\n  private status: OrderStatus = 'Draft';\n\n  public cancel(): void {\n    if (this.status === 'Shipped') throw new Error('Cannot cancel shipped order');\n    this.status = 'Cancelled';\n  }\n}",
    "commonMistakes": [
      "وضع منطق البنية التحتية مثل استعلامات قاعدة البيانات أو إرسال الإيميلات داخل كيان الدومين الثري؛ الكيان يحتوي على منطق العمل فقط."
    ],
    "followUpQuestions": [
      "متى يكون استخدام DTOs البسيطة فقيراً ومقبولاً في طبقات النقل والتواصل؟"
    ],
    "sources": [
      {
        "title": "Martin Fowler — AnemicDomainModel",
        "url": "https://martinfowler.com/bliki/AnemicDomainModel.html"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "foop-010",
    "slug": "oop-method-overriding-covariance-contravariance",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-oop"
    ],
    "difficulty": "Senior",
    "question": "ما هي مفاهيم الـ Covariance والـ Contravariance في بارامترات وقيم إرجاع الدوال عند عمل Override؟",
    "shortAnswer": "عند استبدال دالة في الفئة الابنة: يجب أن تكون قيمة الإرجاع متوافقة أو أكثر تخصيصاً (Covariant)، بينما يجب أن تكون معاملات الإدخال متوافقة أو أكثر عمومية (Contravariant).",
    "explanation": "وفقاً لمبدأ الاستبدال، إذا كان الكود يتوقع دالة ترجع Animal، فإن الفئة المشتقة يمكنها إرجاع Dog (تخصيص للناتج - Covariance) لأن الكلب هو حيوان ولن ينكسر الكود الطالب. أما بالنسبة لمعاملات الدالة، فإذا كانت الفئة الأصلية تقبل Dog، فلا يجوز للابن تضييق المعامل ليشترط GermanShepherd فقط، بل يجب أن يقبل Dog أو أكثر عمومية Animal (Contravariance) لضمان عدم حدوث أخطاء استدعاء غير متوقعة.",
    "codeExample": "class AnimalShelter {\n  getResident(): Animal { return new Animal(); }\n}\nclass DogShelter extends AnimalShelter {\n  @override\n  getResident(): Dog { return new Dog(); } // Covariant return type: صحيح وآمن\n}",
    "commonMistakes": [
      "محاولة تضييق نوع معامل الدالة في الفئة الابنة، مما يكسر التوافق التشغيلي ويرمي خطأ في أنظمة الأنواع المتقدمة."
    ],
    "followUpQuestions": [
      "لماذا تسبب مصفوفات Java الموروثة معضلة شهيرة بسبب كونها Covariant تاريخياً؟"
    ],
    "sources": [
      {
        "title": "Covariance and contravariance - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Covariance_and_contravariance_(computer_science)"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fsld-001",
    "slug": "solid-single-responsibility-principle-definition",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-solid"
    ],
    "difficulty": "Junior",
    "question": "ما هو المعنى الحقيقي لمبدأ المسؤولية الواحدة (SRP) وما هو المقياس لتحديد 'المسؤولية'؟",
    "shortAnswer": "ينص SRP على أن الوحدة البرمجية يجب أن تمتلك سبباً واحداً فقط للتغيير، والمقياس الحقيقي هو خدمة جهة فاعلة واحدة (Single Actor) في المنظومة.",
    "explanation": "كما يوضح روبرت مارتن (Uncle Bob)، لا يعني SRP أن الدالة تفعل شيئاً واحداً فقط؛ بل يعني أن الفئة مسؤولة أمام شخص أو جهة واحدة (مثل المدير المالي، أو مدير العمليات، أو مسؤول قاعدة البيانات). إذا كانت فئة Employee تحتوي على calculatePay() (مسؤولية المحاسبة) و save() (مسؤولية البنية التحتية) و reportHours() (مسؤولية الموارد البشرية)، فإن أي تعديل في سياسة أحد الأطراف يهدد استقرار الفئة لدى الأطراف الأخرى.",
    "codeExample": "// انتهاك: فئة تجمع بين حساب الرواتب وحفظ السجلات في قاعدة البيانات\n// التصحيح: فصل المسؤوليات\nclass PayrollCalculator {\n  calculateNetSalary(emp: Employee): number { /*...*/ }\n}\nclass EmployeeRepository {\n  save(emp: Employee): void { /*...*/ }\n}",
    "commonMistakes": [
      "تفتيت الكود إلى فئات مجهرية تحتوي على دالة واحدة فقط وتسمية ذلك تطبيقاً لـ SRP، مما يرفع التعقيد الإدراكي دون فائدة."
    ],
    "followUpQuestions": [
      "كيف تكتشف انتهاك مبدأ SRP من خلال مراجعة تكرار تعارضات الدمج (Merge Conflicts) في مستودع Git؟"
    ],
    "sources": [
      {
        "title": "Uncle Bob — The Single Responsibility Principle",
        "url": "https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fsld-002",
    "slug": "solid-open-closed-principle-real-world",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-solid"
    ],
    "difficulty": "Mid",
    "question": "كيف تطبق مبدأ الانفتاح والإغلاق (Open/Closed Principle) دون الوقوع في فخ التعقيد المفرط؟",
    "shortAnswer": "يكون الكود مفتوحاً للتوسيع (إضافة ميزات جديدة) ومغلقاً للتعديل (دون الحاجة لتغيير الكود المجرب مسبقاً) عبر الاعتماد على الواجهات والاستراتيجيات المجردة.",
    "explanation": "الهدف هو إضافة ميزة جديدة بمجرد كتابة فئة جديدة تنفذ واجهة محددة دون فتح وتعديل ملفات الكود الحالية بسلاسل switch-case طويلة. ولكن يجب تطبيقه بحذر فقط عند محاور التغيير المؤكدة (Axes of Change)، وليس على كل سطر تحسباً لمستقبل وهمي (YAGNI).",
    "codeExample": "interface PaymentGateway {\n  process(amount: number): Promise<void>;\n}\nclass StripeGateway implements PaymentGateway { /*...*/ }\nclass PayPalGateway implements PaymentGateway { /*...*/ }\n\nclass PaymentProcessor {\n  constructor(private gateway: PaymentGateway) {}\n  execute(amount: number) { return this.gateway.process(amount); }\n}",
    "commonMistakes": [
      "تعديل كود مجرب ويعمل في الإنتاج بإضافة شروط if/else جديدة لكل عميل جديد، بدلاً من استخدام نمط الاستراتيجية (Strategy)."
    ],
    "followUpQuestions": [
      "ما العلاقة الوثيقة بين مبدأ OCP واستخدام الـ Plugins والمكتبات الخارجية في النظم الكبيرة؟"
    ],
    "sources": [
      {
        "title": "Open-closed principle - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fsld-003",
    "slug": "solid-liskov-substitution-pre-post-conditions",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-solid"
    ],
    "difficulty": "Senior",
    "question": "اشرح مبدأ استبدال لسكوف (LSP) ومفهوم الشروط المسبقة (Preconditions) واللاحقة (Postconditions) ومثال المستطيل والمربع الشهير؟",
    "shortAnswer": "ينص LSP على أن كائنات الفئة المشتقة يجب أن تحل محل كائنات الفئة الأساسية دون تغيير صحة وسلوك البرنامج. ولا يجوز للابن تشديد الشروط المسبقة أو إضعاف الشروط اللاحقة.",
    "explanation": "المثال الكلاسيكي: كلاس Square ترث من Rectangle. إذا قمت بتغيير setWidth() في المربع، فإنك مجبر على تغيير height أيضاً للحفاظ على التساوي. لكن الكود الذي يتعامل مع Rectangle يتوقع أن تغيير العرض لا يؤثر على الارتفاع! عند استبدال المستطيل بمربع ينكسر منطق الحسابات. قواعد لسكوف الصارمة: (1) الشروط المسبقة لا يمكن تقويتها في الابن. (2) الشروط اللاحقة لا يمكن إضعافها. (3) ثوابت الفئة (Invariants) يجب الحفاظ عليها بالكامل. (4) لا يجوز رمي استثناءات غير متوقعة في الفئة الأب.",
    "codeExample": "class Rectangle {\n  constructor(protected w: number, protected h: number) {}\n  setWidth(val: number) { this.w = val; }\n  setHeight(val: number) { this.h = val; }\n  getArea(): number { return this.w * this.h; }\n}\n// انتهاك LSP: المربع يغير سلوك الارتفاع خفية عند تغيير العرض!",
    "commonMistakes": [
      "وراثة فئة ورمي NotImplementedException في بعض دوالها، وهو انتهاك مباشر لمبدأ لسكوف يكسر توقعات المستدعي."
    ],
    "followUpQuestions": [
      "كيف تكتشف انتهاك LSP إذا رأيت شفرة تستخدم كتل if (obj instanceof SubClass) للتعامل مع كائنات مشتقة؟"
    ],
    "sources": [
      {
        "title": "Liskov substitution principle - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Liskov_substitution_principle"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fsld-004",
    "slug": "solid-interface-segregation-fat-interfaces",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-solid"
    ],
    "difficulty": "Junior",
    "question": "لماذا يحذر مبدأ فصل الواجهات (Interface Segregation Principle) من الواجهات الضخمة (Fat Interfaces)؟",
    "shortAnswer": "لأنه لا ينبغي إجبار أي عميل برمجي على الاعتماد على دوال أو واجهات لا يستخدمها، مما يمنع الاقتران غير الضروري وإعادة الترجمة غير المبررة.",
    "explanation": "عندما تحتوي الواجهة على عشرات الدوال المتنوعة (God Interface)، فإن أي فئة تطبقها ستضطر لكتابة دوال فارغة أو رمي أخطاء للوظائف التي لا تلزمها، وأي تعديل على دالة واحدة في الواجهة يجبر جميع الفئات المطبقة لها على إعادة الترجمة والاختبار. الحل هو تقسيم الواجهة الضخمة إلى واجهات أصغر وأدق تركز على أدوار محددة (Role Interfaces).",
    "codeExample": "// واجهات مفصولة بدقة:\ninterface Printer {\n  print(doc: Document): void;\n}\ninterface Scanner {\n  scan(): Document;\n}\nclass BasicPrinter implements Printer {\n  print(doc: Document) { /*...*/ }\n}",
    "commonMistakes": [
      "دمج كل عمليات CRUD وعمليات التقارير وعمليات التصدير في واجهة مستودع موحدة وعريضة لكل الكيانات."
    ],
    "followUpQuestions": [
      "كيف يدعم مبدأ ISP تطبيق بنية المنافذ والمحولات (Ports and Adapters) في العمارة السداسية؟"
    ],
    "sources": [
      {
        "title": "Interface segregation principle - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Interface_segregation_principle"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fsld-005",
    "slug": "solid-dependency-inversion-principle-layers",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-solid"
    ],
    "difficulty": "Mid",
    "question": "ما هو جوهر مبدأ عكس التبعية (Dependency Inversion Principle) وكيف يختلف عن حقن التبعية (DI)؟",
    "shortAnswer": "DIP هو مبدأ معماري يفرض أن الوحدات عالية المستوى والتفاصيل منخفضة المستوى يجب أن تعتمد كلاهما على التجريدات (Abstractions)، بينما DI هو نمط برمجي لتمرير التبعيات من الخارج.",
    "explanation": "في المعماريات التقليدية، تعتمد طبقة الأعمال (High-level Business Logic) مباشرة على طبقة البيانات (SQL Database Client). مبدأ DIP يعكس هذا الاتجاه: طبقة الأعمال تحدد واجهة تجريدية (Port/Contract) تلبي احتياجاتها، وطبقة البيانات تنفذ هذه الواجهة (Adapter). بذلك تصبح قواعد العمل مستقلة تماماً عن تفاصيل قواعد البيانات أو مزودي الخدمات السحابية.",
    "codeExample": "// طبقة الأعمال تمتلك العقد:\ninterface NotificationSender {\n  send(message: string): Promise<void>;\n}\n// طبقة الأعمال تعتمد على الواجهة المجردة:\nclass OrderService {\n  constructor(private notifier: NotificationSender) {}\n}",
    "commonMistakes": [
      "اعتبار أن استخدام مكتبات مثل Inversify أو Dagger هو تطبيق تلقائي لـ DIP، في حين أن جوهر المبدأ هو ملكية الواجهة والاتجاه المعماري للتبعية."
    ],
    "followUpQuestions": [
      "لماذا يجب أن تُعرّف الواجهة المجردة في نفس الحزمة مع المستدعي (Client-owned interface) وليس مع المنفذ؟"
    ],
    "sources": [
      {
        "title": "Dependency inversion principle - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Dependency_inversion_principle"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fsld-006",
    "slug": "solid-ioc-containers-and-dependency-injection",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-solid"
    ],
    "difficulty": "Mid",
    "question": "ما هو الفرق بين نمط Service Locator وحاويات حقن التبعيات (IoC Containers) ولماذا يُعتبر الأول مضاد نمط أحياناً؟",
    "shortAnswer": "يعتمد Service Locator على استدعاء مركزي صريح من داخل الفئة لجلب التبعيات مما يخفيها، بينما يقوم DI بتمرير التبعيات علانية عبر الـ Constructor مما يجعل متطلبات الفئة واضحة وصريحة.",
    "explanation": "يخفي Service Locator التبعيات الحقيقية للفئة؛ فعند النظر إلى منشئ الفئة يبدو فارغاً، لكن الكود ينفجر وقت التشغيل إذا لم يتم تسجيل خدمة معينة في السجل المركزي. كما أنه يصعب كتابة اختبارات الوحدة لأنه يتطلب إعداد الحالة العامة للـ Locator. في المقابل، يفرض Constructor Injection عقداً معلناً لا يمكن إنشاء الكائن بدونه.",
    "codeExample": "// مضاد نمط (Service Locator):\nclass InvoiceService {\n  private db = ServiceLocator.get<Database>(); // تبعية مخفية وغير مرئية من الخارج\n}\n// حقن التبعية الصريح:\nclass InvoiceService {\n  constructor(private db: Database) {} // واضحة تماماً وسهلة الـ Mock\n}",
    "commonMistakes": [
      "استخدام Service Locator داخل خدمات الدومين العميقة، مما يجعل تتبع شجرة التبعيات أمراً شديد التعقيد."
    ],
    "followUpQuestions": [
      "متى يكون استخدام Service Locator مقبولاً أو اضطرارياً في بعض أطر العمل القديمة؟"
    ],
    "sources": [
      {
        "title": "Martin Fowler — Inversion of Control Containers and the Dependency Injection pattern",
        "url": "https://martinfowler.com/articles/injection.html"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fsld-007",
    "slug": "solid-di-lifecycles-singleton-scoped-transient",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-solid"
    ],
    "difficulty": "Senior",
    "question": "ما هي دورات حياة الكائنات في حاويات DI (Transient, Scoped, Singleton) وما هي مشكلة التبعية الأسيرة (Captive Dependency)؟",
    "shortAnswer": "الـ Transient ينشئ كائناً جديداً في كل طلب، والـ Scoped ينشئ كائناً واحداً لكل طلب HTTP/سياق عمل، والـ Singleton ينشئ نسخة واحدة لكل عمر التطبيق. وتحدث التبعية الأسيرة عندما يعتمد Singleton على Scoped/Transient.",
    "explanation": "تعتبر التبعية الأسيرة (Captive Dependency) خطأ فادحاً يهدد أمان وتماسك البيانات: إذا تم حقن خدمة Scoped (مثل DbContext مخصص لطلب المستخدم الحالي) داخل خدمة من نوع Singleton، فسيتم أسر كائن قاعدة البيانات داخل الـ Singleton ولن يُحرر أبداً، مما يؤدي لتسريب الذاكرة (Memory Leak) ومشاركة سياق المستخدم الخاطئ بين طلبات مستخدمين مختلفين عبر الـ Threads!",
    "codeExample": "// خطأ كارثي (Captive Dependency):\n// خدمات Singleton طويلة العمر لا يجوز أن تحقن بداخلها خدمات Scoped أو Transient محملة بحالة طلب معينة",
    "commonMistakes": [
      "تسجيل خدمة تعتمد على سياق المستخدم والمصادقة كـ Singleton، مما يخلط بيانات العملاء ببعضها في وقت التشغيل."
    ],
    "followUpQuestions": [
      "كيف تكتشف حاويات حقن التبعيات الحديثة التبعيات الأسيرة تلقائياً أثناء تشغيل بيئة التطوير؟"
    ],
    "sources": [
      {
        "title": "Dependency injection in .NET - Lifecycles",
        "url": "https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection#service-lifetimes"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fsld-008",
    "slug": "solid-over-engineering-and-speculative-generality",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-solid"
    ],
    "difficulty": "Senior",
    "question": "متى يصبح تطبيق مبادئ SOLID مفرطاً وهندسة زائدة (Over-engineering) وما هي علامات رائحة الكود Speculative Generality؟",
    "shortAnswer": "يحدث الإفراط عندما تُبنى طبقات تجريد وواجهات وسيطة لميزات غير مطلوبة بدعوى الاستعداد للمستقبل، مما يضاعف تكلفة قراءة الشفرة وصيانتها دون أي عائد حقيقي.",
    "explanation": "تظهر رائحة 'التعميم التخميني' عندما تجد واجهات برمجية لا تملك سوى تنفيذ واحد فقط، وفئات محولة (Adapters) لوظائف لن تتغير قط، ومرور المعاملات عبر خمس طبقات وسيطة لا تفعل شيئاً سوى إعادة التمرير. يجب تطبيق SOLID كعلاج لضغط التغيير الواقعي والتعقيد المتزايد، وليس كقالب إلزامي على كل سطر في تطبيق بسيط.",
    "codeExample": "// مثال هندسة مفرطة: إضافة 4 ملفات interface و factory لجمع رقمين!\n// القاعدة: ابدأ بأبسط حل يعمل، ثم أعد الهيكلة (Refactor) بمجرد ظهور متطلب التغيير الثاني.",
    "commonMistakes": [
      "إنشاء واجهة Interface لكل فئة حتى لو كانت الفئة داخلية وغير مرشحة للاستبدال، فقط لإرضاء فكرة 'البرمجة ضد الواجهات'."
    ],
    "followUpQuestions": [
      "ما هي قاعدة الثلاثة (Rule of Three) في هندسة البرمجيات لتجنب التجريد المبكر؟"
    ],
    "sources": [
      {
        "title": "Martin Fowler — Speculative Generality",
        "url": "https://refactoring.guru/smells/speculative-generality"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fsld-009",
    "slug": "solid-refactoring-legacy-code-characterization-tests",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-solid"
    ],
    "difficulty": "Senior",
    "question": "كيف تبدأ بإعادة هيكلة كود قديم معقد (Legacy Code) ليتوافق مع مبادئ SOLID بأمان تام ودون كسر الوظائف الحالية؟",
    "shortAnswer": "عبر تثبيت السلوك القائم أولاً باستخدام اختبارات التوصيف (Characterization Tests)، ثم إيجاد خطوط الفصل (Seams) وتفكيك التبعيات تدريجياً خطوة بخطوة.",
    "explanation": "كما وثق مايكل فيذرز في كتاب 'Working Effectively with Legacy Code'، لا يجوز أبداً إعادة كتابة كود معقد يعمل في الإنتاج دون شبكة أمان. الخطوات العملية: (1) كتابة Golden Master / Characterization Tests لتسجيل المدخلات والمخرجات الحقيقية الحالية. (2) استخدام تقنية Sprout Method أو Wrap Class لإضافة التغييرات الجديدة معزولة. (3) كسر الاعتماد المباشر على الموارد الخارجية عبر Extract Interface وحقنها تدريجياً.",
    "codeExample": "// عزل كود قديم داخل Seam:\n// استخراج واجهة للمكون الخارجي لتسهيل عزله وتمريره:\ninterface LegacyOrderSeam {\n  executeLegacyValidation(orderId: string): boolean;\n}",
    "commonMistakes": [
      "البدء في إعادة كتابة (Rewrite) كاملة للنظام من الصفر، وهي مخاطرة كارثية تؤدي غالباً لفشل المشاريع وإدخال أخطاء مجهولة."
    ],
    "followUpQuestions": [
      "ما الفرق بين الـ Seam ونقطة الدخول المفصلية (Enabling Point) عند اختبار كود لا يملك منشئات مرنة؟"
    ],
    "sources": [
      {
        "title": "Working Effectively with Legacy Code - Michael Feathers",
        "url": "https://en.wikipedia.org/wiki/Michael_Feathers"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fsld-010",
    "slug": "solid-dry-vs-srp-accidental-duplication",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-solid"
    ],
    "difficulty": "Mid",
    "question": "ما الفرق بين التكرار الحقيقي (True Duplication) والتكرار العرضي (Accidental Duplication) ومتى يكون تكرار الكود أفضل من التجريد الخاطئ؟",
    "shortAnswer": "التكرار الحقيقي يحدث عندما يتطابق المنطق والسبب في التغيير، بينما التكرار العرضي هو تشابه في الشكل السطحي لكود يخدم جهتين فاعلتين مختلفتين ستتغير متطلباتهما بشكل مستقل مستقبلاً.",
    "explanation": "إذا كان كود حساب خصم المتجر الإلكتروني يشبه سطرين من كود تقرير الضرائب، فدمجهما في دالة واحدة انتهاك لمبدأ SRP باسم DRY! مستقبلاً عندما تتغير قوانين الضرائب، سيعدل المطور الدالة فينكسر حساب المتجر دون قصد. التكرار العرضي أقل تكلفة بكثير من التجريد الخاطئ (The Wrong Abstraction is far worse than Duplication).",
    "codeExample": "// الأفضل إبقاء الكودين منفصلين إذا كان أحدهما لعملاء التجزئة والآخر للمؤسسات، لأن أسباب تغييرهما متباينة تماماً.",
    "commonMistakes": [
      "الاستعجال في دمج أي دالتين متشابهتين في دالة عامة معقدة مليئة بـ flags وشروط if/else للتعامل مع الفروق الطفيفة."
    ],
    "followUpQuestions": [
      "ما هي مقولة ساندي ميتز الشهيرة حول تفضيل التكرار على التجريد الخاطئ؟"
    ],
    "sources": [
      {
        "title": "Sandi Metz — The Wrong Abstraction",
        "url": "https://sandimetz.com/blog/2016/1/20/the-wrong-abstraction"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fpat-001",
    "slug": "design-patterns-creational-structural-behavioral-overview",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-patterns"
    ],
    "difficulty": "Junior",
    "question": "ما هي التصنيفات الثلاثة الرئيسية لأنماط التصميم (Design Patterns) وما هو الغرض الأساسي لكل فئة؟",
    "shortAnswer": "التصنيفات هي: الإنشائية (Creational) لإدارة إنشاء الكائنات، الهيكلية (Structural) لتركيب وتنظيم العلاقات بين الفئات، والسلوكية (Behavioral) لتنظيم التواصل وتوزيع المسؤوليات.",
    "explanation": "أنماط التصميم هي حلول مجربة وموثقة لمشاكل هندسية شائعة. الأنماط الإنشائية (مثل Factory و Singleton) تفصل عملية إنشاء الكائنات عن استخدامها. الأنماط الهيكلية (مثل Adapter و Decorator) توضح كيفية دمج الكائنات المختلفة لتكوين هياكل أكبر وأكثر مرونة. والأنماط السلوكية (مثل Strategy و Observer) تحدد كيفية تدفق البيانات والرسائل وتوزيع الأدوار بين الكائنات بسلاسة.",
    "codeExample": "// أمثلة التصنيفات:\n// Creational: Factory, Builder, Singleton\n// Structural: Adapter, Decorator, Facade\n// Behavioral: Observer, Strategy, Command",
    "commonMistakes": [
      "التعامل مع أنماط التصميم كقوالب كود جاهزة يتم نسخها حرفياً بدلاً من فهم المشكلة المعمارية التي تعالجها."
    ],
    "followUpQuestions": [
      "لماذا يعتبر كتاب عصابة الأربعة (Gang of Four - GoF) المرجع الكلاسيكي الأساسي لهذه الأنماط؟"
    ],
    "sources": [
      {
        "title": "Refactoring Guru — Design Patterns",
        "url": "https://refactoring.guru/design-patterns"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fpat-002",
    "slug": "design-patterns-factory-method-vs-abstract-factory",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-patterns"
    ],
    "difficulty": "Mid",
    "question": "ما هو الفرق الجوهري بين نمط Factory Method ونمط Abstract Factory؟",
    "shortAnswer": "نمط Factory Method يعتمد على الوراثة لإنشاء نوع واحد من الكائنات عبر دالة مخصصة، بينما Abstract Factory يعتمد على التركيب لإنشاء عائلات كاملة من الكائنات المترابطة دون تحديد فئاتها الملموسة.",
    "explanation": "في Factory Method، تمتلك الفئة دالة createProduct() تترك للفئات المشتقة حرية اختيار المنتج الملموس. أما في Abstract Factory، توجد واجهة برمجية كاملة تحتوي على عدة دوال إنشائية لإنشاء عائلة كاملة من المنتجات المتوافقة (مثل واجهة GUIFactory التي تنشئ Button و Checkbox لأنظمة مختلفة: WindowsFactory و MacFactory).",
    "codeExample": "interface GUIFactory {\n  createButton(): Button;\n  createCheckbox(): Checkbox;\n}\nclass WinFactory implements GUIFactory {\n  createButton() { return new WinButton(); }\n  createCheckbox() { return new WinCheckbox(); }\n}",
    "commonMistakes": [
      "استدعاء أي دالة ثابتة تنشئ كائناً (مثل User.create()) باسم Abstract Factory؛ الدوال الثابتة البسيطة تسمى Simple Factory."
    ],
    "followUpQuestions": [
      "كيف يضمن نمط Abstract Factory توافق المنتجات المنشأة مع بعضها البعض (Compatibility)?"
    ],
    "sources": [
      {
        "title": "Abstract Factory Pattern - Refactoring Guru",
        "url": "https://refactoring.guru/design-patterns/abstract-factory"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fpat-003",
    "slug": "design-patterns-singleton-pattern-pitfalls",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-patterns"
    ],
    "difficulty": "Mid",
    "question": "لماذا يعتبر نمط السينجلتون (Singleton Pattern) مضاد نمط (Anti-pattern) في معظم تطبيقات المؤسسات الحديثة؟",
    "shortAnswer": "لأنه يدخل حالة عامة مشتركة (Global Mutable State) تخفي التبعيات وتجعل الاختبار المستقل مستحيلاً، فضلاً عن تعقيدات الأمان وتعدد الخيوط (Thread Safety).",
    "explanation": "السينجلتون ينتهك مبدأ المسؤولية الواحدة (SRP) لأنه يدير دورة حياته بنفسه بالإضافة لأداء وظيفته الأساسية. في بيئات تعدد الخيوط والـ Unit Testing، تحتفظ الكائنات العامة بحالتها بين الاختبارات مما يؤدي لفشل عشوائي متسلسل وغير مفهوم. في النظم الحديثة، يتم الاعتماد على حاويات حقن التبعيات (DI Containers) لتسجيل الخدمات كـ Singleton Lifecycle مع إبقاء الكود نفسه عادياً وقابلاً للاختبار والـ Mock.",
    "codeExample": "class Singleton {\n  private static instance: Singleton;\n  private constructor() {} // منع الإنشاء المباشر\n  public static getInstance(): Singleton {\n    if (!Singleton.instance) Singleton.instance = new Singleton();\n    return Singleton.instance;\n  }\n}",
    "commonMistakes": [
      "تطبيق السينجلتون في بيئة متعددة الخيوط دون مزامنة ملائمة، مما يسبب إنشاء عدة نسخ متزامنة في الذاكرة (Race Condition)."
    ],
    "followUpQuestions": [
      "كيف يعمل أسلوب Double-Checked Locking لضمان Thread Safety في السينجلتون؟"
    ],
    "sources": [
      {
        "title": "Singleton Pattern - Refactoring Guru",
        "url": "https://refactoring.guru/design-patterns/singleton"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fpat-004",
    "slug": "design-patterns-strategy-pattern-vs-state-pattern",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-patterns"
    ],
    "difficulty": "Mid",
    "question": "ما الفرق بين نمط الاستراتيجية (Strategy Pattern) ونمط الحالة (State Pattern) رغم تشابه هيكل الكود بينهما؟",
    "shortAnswer": "يكمن الفرق في النية البرمجية (Intent): الاستراتيجية تمثل خوارزميات مستقلة يختار العميل إحداها، بينما الحالة تمثل سلوكاً داخلياً يتغير تلقائياً مع تغير الحالة الداخلية للكائن دون علم العميل.",
    "explanation": "في نمط Strategy، تكون الاستراتيجيات المختلفة غير واعية بوجود بعضها ولا تقرر التبديل بينها؛ بل يحدد المستدعي الخوارزمية المطلوبة (مثل استراتيجية الدفع: نقدي أو بطاقة). أما في نمط State، فإن حالات الكائن المختلفة تعرف بعضها وتتولى الانتقال التلقائي من حالة إلى أخرى (مثل دورة حياة الطلب: Draft -> Paid -> Shipped).",
    "codeExample": "// State: الحالة تنتقل داخلياً\nclass DraftState implements OrderState {\n  next(order: Order) { order.setState(new PaidState()); }\n}\n// Strategy: العميل يمرر الخوارزمية\nconst sorter = new Sorter(new QuickSortStrategy());",
    "commonMistakes": [
      "استخدام سلاسل if/else عملاقة لإدارة الحالات المعقدة، مما يسبب تعقيداً شديداً وصعوبة في إضافة حالات جديدة."
    ],
    "followUpQuestions": [
      "كيف يساعد نمط State في تطبيق آلات الحالة المحدودة (Finite State Machines) بشكل نظيف؟"
    ],
    "sources": [
      {
        "title": "Strategy Pattern - Refactoring Guru",
        "url": "https://refactoring.guru/design-patterns/strategy"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fpat-005",
    "slug": "design-patterns-observer-vs-pub-sub-architecture",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-patterns"
    ],
    "difficulty": "Senior",
    "question": "ما الفرق المعماري بين نمط المراقب (Observer Pattern) ونمط الناشر والمشترك (Publish-Subscribe Pattern)؟",
    "shortAnswer": "في Observer، يعرف الموضوع (Subject) مراقبيه مباشرة ويحتفظ بقائمتهم في نفس مساحة الذاكرة، بينما في Pub-Sub، يفصل وسيط رسائل خارجي (Message Broker) بين الناشر والمشترك تماماً دون أي معرفة متبادلة.",
    "explanation": "الـ Observer نمط تصميم متزامن داخل نفس التطبيق والذاكرة (In-process)، حيث يستدعي الـ Subject دالة update() في المراقبين مباشرة. أما الـ Pub-Sub فهو نمط معماري للأنظمة الموزعة؛ يرسل الناشر حدثاً إلى وسيط (مثل Kafka أو RabbitMQ أو Redis)، ويقوم الوسيط بتوصيله إلى مئات المشتركين بشكل غير متزامن تماماً، مع فصل كامل في المكان والزمان ومسار التنفيذ.",
    "codeExample": "// Observer: ارتباط مباشر في الذاكرة\nsubject.attach(observer);\nsubject.notify();\n\n// Pub-Sub: وسيط وسيط وسيط مستقل تماماً\nmessageBroker.publish('order.created', payload);",
    "commonMistakes": [
      "نسيان إلغاء الاشتراك (Unsubscribe) في نمط Observer مما يؤدي لتسريب الذاكرة الشهير المسمى Lapsed Listener Problem."
    ],
    "followUpQuestions": [
      "كيف تمنع تسريبات الذاكرة في نمط Observer باستخدام المؤشرات الضعيفة (Weak References)؟"
    ],
    "sources": [
      {
        "title": "Observer vs Publish-Subscribe - Microsoft Docs",
        "url": "https://learn.microsoft.com/en-us/azure/architecture/patterns/publisher-subscriber"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fpat-006",
    "slug": "design-patterns-decorator-vs-adapter-vs-proxy",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-patterns"
    ],
    "difficulty": "Mid",
    "question": "قارن بين الأنماط الهيكلية الثلاثة المتشابهة: Decorator و Adapter و Proxy من حيث الغرض؟",
    "shortAnswer": "الـ Adapter يغير واجهة كائن موجود ليتوافق مع واجهة أخرى، والـ Decorator يضيف وظائف ومسؤوليات جديدة لنفس الواجهة، والـ Proxy يتحكم في الوصول للكائن مع الاحتفاظ بنفس الواجهة تماماً.",
    "explanation": "الـ Adapter مثل محول الكهرباء للمسافرين: يحول واجهة غير متوافقة إلى واجهة يتوقعها العميل. الـ Decorator مثل ارتداء معطف فوق الملابس: يغلف الكائن الأصلي ويضيف سلوكيات جديدة (مثل التخزين المؤقت Caching أو التسجيل Logging) دون تعديل الفئة الأصلية. أما الـ Proxy فهو وكيل يقف أمام الكائن للتحكم فيه (مثل التحقق من الصلاحيات Security Proxy أو التحميل الكسول Lazy Loading أو حماية الاتصال عن بعد Remote Proxy).",
    "codeExample": "// Decorator: نفس الواجهة + سلوك إضافي\nclass LoggingNotifier implements Notifier {\n  constructor(private inner: Notifier) {}\n  send(msg: string) { console.log('Log'); this.inner.send(msg); }\n}",
    "commonMistakes": [
      "استخدام نمط Adapter لتعديل سلوك الكائن، في حين أن مهمته الوحيدة هي ترجمة الواجهات دون المساس بالسلوك الأصلي."
    ],
    "followUpQuestions": [
      "كيف يطبق نمط Dynamic Proxy في أطر العمل لإنشاء المعاملات التلقائية (Declarative Transactions)؟"
    ],
    "sources": [
      {
        "title": "Decorator Pattern - Refactoring Guru",
        "url": "https://refactoring.guru/design-patterns/decorator"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fpat-007",
    "slug": "design-patterns-builder-pattern-immutability",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-patterns"
    ],
    "difficulty": "Junior",
    "question": "متى نستخدم نمط الباني (Builder Pattern) وكيف يحل مشكلة المنشئات التلسكوبية (Telescoping Constructors)؟",
    "shortAnswer": "يُستخدم Builder لبناء كائنات معقدة تحتوي على العديد من المعاملات الاختيارية خطوة بخطوة، وتجنب المنشئات الطويلة المربكة وضمان الحفاظ على عدم قابلية التعديل (Immutability).",
    "explanation": "عندما يمتلك كائن 10 حقول، يضطر المطور لكتابة منشئات تلسكوبية: new User(name), new User(name, email), new User(name, email, age, phone, ...)، مما يسبب أخطاء فادحة في ترتيب المعاملات المتشابهة في النوع. يوفر نمط Builder واجهة متسلسلة (Fluent API) لتمرير المعاملات بوضوح، مع دالة build() نهائية تتحقق من صحة كافة الحقول وتنشئ كائناً نهائياً مجمداً وغير قابل للتعديل.",
    "codeExample": "const query = new QueryBuilder()\n  .select(['id', 'name'])\n  .from('users')\n  .where('age > 18')\n  .orderBy('created_at')\n  .build();",
    "commonMistakes": [
      "استخدام نمط Builder لكائنات بسيطة لا تحتوي إلا على حقلين أو ثلاثة، مما يضيف كوداً زائداً بلا مبرر."
    ],
    "followUpQuestions": [
      "ما الفرق بين Builder البسيط و Builder المقترن بفئة مدير (Director Class)؟"
    ],
    "sources": [
      {
        "title": "Builder Pattern - Refactoring Guru",
        "url": "https://refactoring.guru/design-patterns/builder"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fpat-008",
    "slug": "design-patterns-command-pattern-undo-redo",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-patterns"
    ],
    "difficulty": "Senior",
    "question": "كيف يعمل نمط الأمر (Command Pattern) وكيف يتيح ميزة التراجع والإعادة (Undo/Redo) وجدولة العمليات؟",
    "shortAnswer": "يقوم Command بتغليف الطلب أو العملية بالكامل ككائن مستقل يحتوي على جميع البيانات اللازمة لتنفيذه أو التراجع عنه في وقت لاحق.",
    "explanation": "بدلاً من استدعاء دوال الحفظ أو الحذف مباشرة من واجهة المستخدم، يتم إنشاء كائن أمر يطبق واجهة Command التي تحتوي على execute() و undo(). يتيح ذلك للبرنامج الاحتفاظ بسجل تاريخي (History Stack) من الأوامر المنفذة. للتراجع (Undo)، يتم سحب آخر أمر واستدعاء undo() عليه، وللإعادة (Redo)، يُعاد استدعاء execute(). كما يتيح هذا النمط تخزين الأوامر في طوابير (Queues) وتنفيذها في الخلفية.",
    "codeExample": "interface Command {\n  execute(): void;\n  undo(): void;\n}\nclass InsertTextCommand implements Command {\n  constructor(private doc: Document, private text: string) {}\n  execute() { this.doc.append(this.text); }\n  undo() { this.doc.removeLast(this.text.length); }\n}",
    "commonMistakes": [
      "تخزين حالة ضخمة جداً داخل كائن الأمر مما يؤدي لاستهلاك الذاكرة عند الاحتفاظ بسجل تراجع طويل."
    ],
    "followUpQuestions": [
      "كيف يندمج نمط Command مع نمط Memento لحفظ واستعادة الحالة المعقدة دون انتهاك التغليف؟"
    ],
    "sources": [
      {
        "title": "Command Pattern - Refactoring Guru",
        "url": "https://refactoring.guru/design-patterns/command"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fpat-009",
    "slug": "design-patterns-repository-and-unit-of-work",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-patterns"
    ],
    "difficulty": "Senior",
    "question": "ما هو الغرض المشترك لنمطي المستودع (Repository) ووحدة العمل (Unit of Work) في إدارة المعاملات وقواعد البيانات؟",
    "shortAnswer": "يعزل المستودع منطق استرجاع وحفظ الكيانات كمجموعة كائنات في الذاكرة، بينما تتابع وحدة العمل كل التغييرات وتضمن تنفيذها في معاملة قاعدة بيانات واحدة متكاملة (Atomic Transaction).",
    "explanation": "بدون هذين النمطين، يمتلئ كود الأعمال باستعلامات SQL واستدعاءات db.save() متفرقة، مما يؤدي لمشاكل تجزئة المعاملات وأداء ضعيف بسبب كثرة الاتصالات بالشبكة. يقوم نمط Unit of Work بتتبع كل الكائنات التي تم إنشاؤها أو تعديلها أو حذفها أثناء سياق العمل، وعند استدعاء commit()، يقوم بفتح معاملة وحيدة وإرسال كافة التعديلات في دفعة واحدة منسقة مع إمكانية التراجع الكامل عند حدوث أي خطأ.",
    "codeExample": "// استخدام النمطين معاً:\nconst uow = new UnitOfWork();\nuow.users.add(newUser);\nuow.accounts.updateBalance(accountId, 500);\nawait uow.commit(); // تنفيذ كل العمليات داخل معاملة واحدة متكاملة",
    "commonMistakes": [
      "استدعاء commit() بعد كل عملية فردية في المستودع، مما يدمر فكرة وحدة العمل ويضاعف زمن الاستجابة."
    ],
    "followUpQuestions": [
      "ما هي معضلة تسريب تجريدات الـ ORM مثل IQueryable عبر واجهة الـ Repository؟"
    ],
    "sources": [
      {
        "title": "Martin Fowler — Unit of Work",
        "url": "https://martinfowler.com/eaaCatalog/unitOfWork.html"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fpat-010",
    "slug": "design-patterns-chain-of-responsibility-middleware",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-patterns"
    ],
    "difficulty": "Mid",
    "question": "كيف يعمل نمط سلسلة المسؤولية (Chain of Responsibility) وما علاقته بمعمارية الـ Middleware في خوادم الويب الحديثة؟",
    "shortAnswer": "يمرر النمط الطلب عبر سلسلة من المعالجات، حيث يقرر كل معالج إما معالجة الطلب وتمريره للمعالج التالي أو إيقاف السلسلة ورفض الطلب فوراً.",
    "explanation": "هذا النمط هو الأساس المعماري لأنظمة الـ Middleware في Express و ASP.NET و Fastify و Laravel. عند وصول طلب HTTP، يمر أولاً بـ LoggingMiddleware، ثم CorsMiddleware، ثم AuthenticationMiddleware (الذي قد يقطع السلسلة ويرد بـ 401)، ثم RateLimitingMiddleware، وصولاً إلى معالج المسار النهائي (Route Handler). هذا يفصل اهتمامات البنية التحتية تماماً عن كود الخدمة.",
    "codeExample": "interface Handler {\n  setNext(h: Handler): Handler;\n  handle(req: Request): Response | null;\n}",
    "commonMistakes": [
      "نسيان تمرير الطلب للمعالج التالي عبر next()، مما يسبب تعليق الطلب للأبد دون استجابة."
    ],
    "followUpQuestions": [
      "كيف تختلف سلسلة المسؤولية الكلاسيكية (حيث يعالج الطلب عنصر واحد فقط) عن نموذج الـ Pipeline/Interceptors؟"
    ],
    "sources": [
      {
        "title": "Chain of Responsibility - Refactoring Guru",
        "url": "https://refactoring.guru/design-patterns/chain-of-responsibility"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fcln-001",
    "slug": "clean-code-meaningful-naming-cqs-principle",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-clean-code"
    ],
    "difficulty": "Junior",
    "question": "ما هي قواعد التسمية المعبرة ومبدأ فصل الأوامر عن الاستعلامات (Command-Query Separation - CQS) في الشفرة النظيفة؟",
    "shortAnswer": "التسمية المعبرة توضح القصد والهدف والسياق دون الحاجة لتعليقات مفسرة، ومبدأ CQS يفرض أن الدالة إما أن تغير حالة النظام (Command) أو ترجع إجابة وبيانات (Query) ولكن ليس كلاهما معاً.",
    "explanation": "تجنب الأسماء المبهمة مثل data أو info أو x. دالة get يجب ألا تعدل البيانات خلسة، ودالة set لا يجب أن ترجع نتائج معقدة. انتهاك CQS (مثل دالة loginUser() التي تعيد مصفوفة الأصدقاء وتعدل كلمة المرور) ينتج عنه آثار جانبية خفية (Side Effects) تجعل تتبع الأخطاء واختبار النظام كابوساً للمطورين.",
    "codeExample": "// انتهاك CQS: الدالة تقرأ وتعدل في نفس الوقت\nfunction getUserAndIncrementLoginCount(id: string): User { /*...*/ }\n\n// متوافق مع CQS: عمليتان منفصلتان\nfunction incrementLoginCount(id: string): void { /*...*/ }\nfunction getUser(id: string): User { /*...*/ }",
    "commonMistakes": [
      "استخدام أسماء مختصرة غير مفهومة لتوفير بضعة أحرف في الكتابة، مما يرفع الجهد الإدراكي لكل من يقرأ الكود لاحقاً.",
      "كتابة تعليقات تشرح 'ماذا يفعل الكود' بدلاً من تحسين تسمية المتغيرات والدوال ليتحدث الكود عن نفسه."
    ],
    "followUpQuestions": [
      "ما هي الاستثناءات النادرة لمبدأ CQS مثل عمليات طوابير البيانات (Stack.pop())؟"
    ],
    "sources": [
      {
        "title": "Martin Fowler — Command Query Separation",
        "url": "https://martinfowler.com/bliki/CommandQuerySeparation.html"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fcln-002",
    "slug": "clean-code-code-smells-god-object-feature-envy",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-clean-code"
    ],
    "difficulty": "Mid",
    "question": "ما هي روائح الكود (Code Smells) واشرح رائحتي 'God Object' و 'Feature Envy' وكيف تتخلص منهما؟",
    "shortAnswer": "روائح الكود هي مؤشرات سطحية في الشفرة تدل على وجود مشاكل تصميمية ومعمارية أعمق. 'God Object' هي فئة عملاقة تعرف وتفعل كل شيء، و'Feature Envy' تحدث عندما تكون الدالة مهتمة ببيانات فئة أخرى أكثر من بيانات فئتها.",
    "explanation": "علاج God Object هو استخدام Extract Class وتقسيم المسؤوليات وفقاً لـ SRP. أما علاج Feature Envy فهو تطبيق أسلوب Move Method؛ إذا وجدت دالة في OrderService تستدعي عشرات الـ Getters من كائن Customer لحساب نقاط الولاء، فهذا يعني أن هذا المنطق ينتمي في الأصل داخل فئة Customer، فننقل الدالة إلى هناك ونستدعيها ببساطة.",
    "codeExample": "// Feature Envy: دالة تتدخل في بيانات كائن آخر وتطلب بياناته الداخلية بدلاً من تفويضه\nclass OrderPrinter {\n  printCustomer(c: Customer) {\n    // استدعاء 5 خصائص من العميل لحساب التنسيق\n  }\n}",
    "commonMistakes": [
      "اعتبار أن Code Smell هو خطأ برمجي مباشر (Bug)؛ الروائح لا توقف البرنامج عن العمل ولكنها تجعل صيانته وتطويره مستحيلاً وبطيئاً."
    ],
    "followUpQuestions": [
      "ما هي رائحة الكود المسماة Shotgun Surgery وكيف تختلف عن Divergent Change؟"
    ],
    "sources": [
      {
        "title": "Refactoring Guru — Code Smells",
        "url": "https://refactoring.guru/refactoring/smells"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fcln-003",
    "slug": "clean-code-cyclomatic-complexity-reduction",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-clean-code"
    ],
    "difficulty": "Mid",
    "question": "ما هو مقياس التعقيد الدوري (Cyclomatic Complexity) وكيف تقلله لتحسين قابلية الاختبار؟",
    "shortAnswer": "هو مقياس كمي لعدد المسارات المنطقية المستقلة داخل الدالة، ويُحسب بعدد نقاط التفرع (if, while, for, case, &&, ||) مضافاً إليها واحد.",
    "explanation": "كلما زاد التعقيد الدوري (فوق 10)، كلما تطلب الكود كتابة عدد أكبر من اختبارات الوحدة لتغطية كل السيناريوهات، وزادت احتمالية الأخطاء غير المتوقعة. تقنيات تخفيض التعقيد: (1) استخدام حراس الإرجاع المبكر (Guard Clauses) للتخلص من التداخل العميق (Arrow Anti-pattern). (2) استبدال الشروط بتعدد الأشكال (Replace Conditional with Polymorphism). (3) استخراج الدوال المعقدة (Extract Method).",
    "codeExample": "// قبل (تعقيد عالي وتداخل عميق):\nfunction process(user) {\n  if (user != null) {\n    if (user.isActive) {\n      if (user.hasPermission) { doSomething(); }\n    }\n  }\n}\n// بعد (Guard Clauses - تعقيد منخفض ومسطح):\nfunction process(user) {\n  if (!user || !user.isActive || !user.hasPermission) return;\n  doSomething();\n}",
    "commonMistakes": [
      "كتابة كتل if متداخلة لـ 5 أو 6 مستويات، مما يجعل قراءة الكود صعبة جداً وتتبع الحالات مستحيلاً."
    ],
    "followUpQuestions": [
      "كيف تساعد أدوات التحليل الساكن (Static Analyzers) في تحديد سقف التعقيد الدوري في مسارات CI/CD؟"
    ],
    "sources": [
      {
        "title": "Cyclomatic complexity - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Cyclomatic_complexity"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fcln-004",
    "slug": "clean-code-boy-scout-rule-technical-debt",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-clean-code"
    ],
    "difficulty": "Junior",
    "question": "ما هي قاعدة الكشافة (The Boy Scout Rule) في إدارة وتخفيض الدين الفني (Technical Debt)؟",
    "shortAnswer": "تنص القاعدة على: 'اترك مكان التخييم أنظف مما وجدته'. أي أنه مع كل تعديل أو مهمة برمجية جديدة، يجب عليك تحسين جزء صغير من الكود المحيط قبل تسليم المهمة.",
    "explanation": "الدين الفني يتراكم تدريجياً نتيجة الاختصارات السريعة لضغط المواعيد، وإذا تم تجاهله يتصلب النظام بالكامل. بدلاً من طلب أسابيع كاملة من الإدارة لإعادة كتابة الكود (وهو ما يُرفض عادة)، يضمن تطبيق قاعدة الكشافة تنظيفاً مستمراً وتدريجياً: تغيير اسم متغير غامض، استخراج دالة صغيرة، حذف كود ميت، أو إضافة اختبار لوحدة ناقصة.",
    "codeExample": "// سلوك الكشاف: قمت بإضافة حقل للمستخدم، وقمت أيضاً بحذف دالة مهجورة غير مستخدمة منذ عام كامل",
    "commonMistakes": [
      "القيام بإعادة هيكلة ضخمة شاملة للمشروع بأكمله أثناء العمل على مهمة إصلاح bug حرجة ومستعجلة."
    ],
    "followUpQuestions": [
      "ما الفرق بين الدين الفني المتعمد (Prudent Debt) والدين الفني غير المبالي (Reckless Debt) في مصفوفة مارتن فاولر؟"
    ],
    "sources": [
      {
        "title": "Martin Fowler — Technical Debt Quadrant",
        "url": "https://martinfowler.com/bliki/TechnicalDebtQuadrant.html"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fcln-005",
    "slug": "clean-code-exception-handling-fail-fast",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-clean-code"
    ],
    "difficulty": "Mid",
    "question": "ما هي أفضل ممارسات معالجة الاستثناءات ومبدأ الإخفاق السريع (Fail-Fast) وتجنب ابتلاع الأخطاء (Exception Swallowing)؟",
    "shortAnswer": "مبدأ Fail-Fast يقتضي الكشف عن المشاكل فور حدوثها في أقرب نقطة ورمي استثناء واضح، وتجنب كتل try-catch الفارغة التي تبتلع الأخطاء وتخفي الكوارث.",
    "explanation": "ابتلاع الاستثناء عبر catch (e) {} دون تسجيله أو معالجته يُعتبر جريمة برمجية؛ لأنه يترك النظام يعمل في حالة فاسدة وغير متسقة تقود إلى أخطاء غامضة بعد دقائق في مكان آخر تماماً. الممارسات الصحيحة: (1) التحقق من صحة المدخلات في بداية الدالة ورمي استثناء دقيق فوراً. (2) إنشاء استثناءات دومين مخصصة وذات مغزى (Domain Exceptions). (3) المعالجة في أعلى مستوى مناسب (مثل Global Error Handler).",
    "codeExample": "// خطأ كارثي (ابتلاع الخطأ):\ntry { saveTransaction(); } catch (err) { /* صمت مطبق */ }\n\n// صحيح (Fail-Fast):\nif (amount <= 0) throw new InvalidTransactionAmountException(amount);",
    "commonMistakes": [
      "استخدام الاستثناءات (Exceptions) لإدارة التدفق المنطقي العادي للبرنامج (Flow Control) بدلاً من معالجة الحالات الاستثنائية الحقيقية."
    ],
    "followUpQuestions": [
      "متى تفضل استخدام نمط النتيجة (Result Pattern / Either Monad) بدلاً من رمي الاستثناءات؟"
    ],
    "sources": [
      {
        "title": "Fail-fast system - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Fail-fast"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fcln-006",
    "slug": "clean-code-defensive-programming-vs-contract",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-clean-code"
    ],
    "difficulty": "Senior",
    "question": "قارن بين البرمجة الدفاعية (Defensive Programming) ومبدأ التصميم بالتعاقد (Design by Contract - DbC)؟",
    "shortAnswer": "البرمجة الدفاعية تفترض أن جميع المدخلات غير موثوقة ويجب فحصها في كل دالة لتفادي الانهيار، بينما Design by Contract يحدد عقداً صريحاً بين المستدعي والمستدعى يتحمل كل طرف مسؤوليته فيه.",
    "explanation": "الإفراط في البرمجة الدفاعية يؤدي لملء كل دالة داخلية بفحوصات if (arg == null) متكررة في كل طبقة حتى داخل الدومين الآمن. أما DbC فيحدد: الشروط المسبقة تقع على عاتق المستدعي (لو أرسلت قيمة سالبة فالخطأ خطؤك أنت)، والشروط اللاحقة يضمنها المنفذ. في الأنظمة الحديثة، تُستخدم البرمجة الدفاعية الصارمة على حدود النظام الخارجية (API Gateways, User Inputs)، بينما يعتمد الدومين الداخلي على DbC والأنواع القوية (Type Safety) لمنع التكرار.",
    "codeExample": "// حدود النظام (Defensive Validation):\nconst body = validateSchema(req.body); // دفاعي صارم على الحدود\n// منطق الدومين الداخلي (Contract):\nexecuteTransfer(source, target, body.amount); // يثق في صحة النوع المنقى",
    "commonMistakes": [
      "تطبيق البرمجة الدفاعية على كل دالة private داخلية، مما يؤدي لتضخم الكود وإخفاء الأخطاء المنطقية بدلاً من كشفها في الاختبارات."
    ],
    "followUpQuestions": [
      "كيف تساهم الأنواع غير القابلة للقيم الفارغة (Null Safety) في القضاء على الحاجة لمعظم الفحوصات الدفاعية التقليدية؟"
    ],
    "sources": [
      {
        "title": "Design by contract - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Design_by_contract"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fcln-007",
    "slug": "clean-code-refactoring-techniques-extract-replace-conditional",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-clean-code"
    ],
    "difficulty": "Mid",
    "question": "اشرح تقنيتي إعادة الهيكلة: Extract Method و Replace Conditional with Polymorphism ومتى تطبقهما؟",
    "shortAnswer": "Extract Method تستخرج قطعة كود مترابطة في دالة مستقلة باسم يوضح قصدها، و Replace Conditional with Polymorphism تستبدل كتل switch/case المعقدة بهيكل فئات ترث واجهة مشتركة.",
    "explanation": "عندما تجد دالة طويلة تحتوي على تعليق يشرح ماذا تفعل الفقرة التالية، فهذا هو الوقت المثالي لـ Extract Method وتحويل الفقرة لدالة مستقلة باسم التعليق. وعندما تجد شروط switch مبنية على أنواع الحسابات تتكرر في 5 دوال مختلفة في النظام، فإن تطبيق Replace Conditional with Polymorphism يجعل كل فئة مسؤولة عن تنفيذ سلوكها الخاص، فتختفي كل شروط switch تلقائياً.",
    "codeExample": "// استبدال switch بتعدد الأشكال:\ninterface EmployeeType {\n  calculateBonus(salary: number): number;\n}\nclass ManagerType implements EmployeeType {\n  calculateBonus(salary: number) { return salary * 0.3; }\n}",
    "commonMistakes": [
      "إجراء إعادة الهيكلة دون وجود اختبارات وحدة مؤتمتة وسريعة تعمل وتمر بنجاح بنسبة 100% قبل البدء."
    ],
    "followUpQuestions": [
      "ما هي تقنية التفكيك المسماة Branch by Abstraction لإجراء إعادة هيكلة ضخمة في الإنتاج دون الحاجة لفروع Git طويلة العمر؟"
    ],
    "sources": [
      {
        "title": "Refactoring — Replace Conditional with Polymorphism",
        "url": "https://refactoring.guru/replace-conditional-with-polymorphism"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fcln-008",
    "slug": "clean-code-code-reviews-effective-collaboration",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-clean-code"
    ],
    "difficulty": "Junior",
    "question": "ما هي معايير مراجعة الكود الفعالة (Code Review) وكيف تفرق بين التنسيقات السطحية والنقاشات المعمارية؟",
    "shortAnswer": "المراجعة الفعالة تركز على التصميم، الأمان، الأداء، ومنطق العمل، وتترك التنسيقات السطحية (المسافات والفواصل) لأدوات الفحص والتهيئة الآلية (Linters & Formatters).",
    "explanation": "يجب ألا تستهلك مراجعة الكود في نقاشات عقيمة حول موضع القوس أو أسماء المتغيرات المتطابقة مع معايير الشركة؛ فهذه مهمة Pre-commit hooks و Linters. يجب أن يركز المراجع على: هل يعالج الكود متطلبات العمل؟ هل توجد ثغرات أمنية كحقن SQL؟ هل توجد حالات سباق في التزامن؟ هل الاختبارات كافية وذات جودة؟ مع تقديم تعليقات بناءة ومحترمة بصيغة اقتراحات وليس أوامر.",
    "codeExample": "// تعليق مراجعة غير فعال: 'ضع مسافة هنا'\n// تعليق مراجعة فعال وبناء:\n// 'اقتراح: استدعاء دالة قاعدة البيانات داخل الـ Loop قد يسبب مشكلة N+1 في الإنتاج، هل يمكننا جلبها كدفعة واحدة عبر whereIn؟'",
    "commonMistakes": [
      "إرسال Pull Request عملاق يحتوي على 2000 سطر وتوقع مراجعة جيدة؛ يجب تقسيم التغييرات إلى PRs صغيرة لا تتجاوز 200-400 سطر."
    ],
    "followUpQuestions": [
      "ما هو مفهوم Conventional Comments (مثل praise, suggestion, issue, question) في توحيد ثقافة فرق التطوير؟"
    ],
    "sources": [
      {
        "title": "Google Engineering Practices — Code Review Developer Guide",
        "url": "https://en.wikipedia.org/wiki/Code_review"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fcln-009",
    "slug": "clean-code-primitive-obsession-solution",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-clean-code"
    ],
    "difficulty": "Mid",
    "question": "ما هي رائحة الكود المسماة هوس الأنواع الأولية (Primitive Obsession) وكيف يحلها إنشاء Value Objects؟",
    "shortAnswer": "تحدث عندما يتم استخدام الأنواع الأولية البسيطة (مثل string, int, double) لتمثيل مفاهيم دومين معقدة تحتوي على قواعد عمل محددة (مثل البريد، الهاتف، العملة، ورقم الهوية).",
    "explanation": "تمثيل رقم الهاتف كـ string يعني أنه يمكن تمرير أي نص عشوائي للدالة ('abc123')، مما يجبر كل دالة في النظام على تكرار التحقق من صحة الرقم عبر Regex. الحل هو إنشاء كائن قيمة مخصص مثل PhoneNumber أو Email؛ يقوم الـ Constructor بالتحقق من القواعد مرة واحدة فقط عند الإنشاء، مما يضمن أن أي كائن موجود في النظام صالح بنسبة 100% ويمنع تمرير بيانات فاسدة للمنطق الداخلي.",
    "codeExample": "class EmailAddress {\n  private readonly value: string;\n  constructor(raw: string) {\n    if (!raw.includes('@')) throw new InvalidEmailException(raw);\n    this.value = raw.toLowerCase().trim();\n  }\n  getValue() { return this.value; }\n}",
    "commonMistakes": [
      "تمرير معرفات الكيانات كأرقام أو نصوص مجردة، مما يؤدي للخلط الكارثي بين customerId و orderId في معاملات الدوال المتشابهة."
    ],
    "followUpQuestions": [
      "كيف تساعد مكتبات التحقق من صحة النماذج (مثل Zod أو FluentValidation) في دمج هذا المفهوم على حدود النظام؟"
    ],
    "sources": [
      {
        "title": "Primitive Obsession - Refactoring Guru",
        "url": "https://refactoring.guru/smells/primitive-obsession"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fcln-010",
    "slug": "clean-code-yagni-kiss-minimalist-architecture",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-clean-code"
    ],
    "difficulty": "Junior",
    "question": "ما هما مبدآ KISS و YAGNI ولماذا يعتبران أهم صمام أمان ضد تعقيد وتضخم المشاريع؟",
    "shortAnswer": "KISS ينص على 'اجعل الأمر بسيطاً للغاية' وتجنب التعقيد، و YAGNI ينص على 'لن تحتاجه على الإطلاق' ويحظر كتابة أي وظيفة أو بنية لم تطلبها المتطلبات الحالية فوراً.",
    "explanation": "المشاريع لا تفشل بسبب نقص الميزات المستقبلية، بل تنهار تحت وطأة التعقيد الإدراكي وصعوبة صيانة آلاف الأسطر المكتوبة تحسباً لاحتمالات نادراً ما تحدث. كل سطر كود تكتبه يمثل التزاماً مستقبلياً بالصيانة والاختبار وإصلاح الأخطاء. المطور المحترف هو من يحل المشكلة المعقدة بأبسط كود ممكن ومفهوم، ويرفض بناء عوالم افتراضية قبل أوانها.",
    "codeExample": "// YAGNI: العميل طلب حفظ المستخدمين في ملف محلي بسيط، فلا تقم ببناء بنية Microservices موزعة مع Kafka و Redis!",
    "commonMistakes": [
      "تبرير الكود السيء والمهمل باسم KISS؛ البساطة تعني كوداً نظيفاً ومقروءاً ومصمماً بعناية، وليس كوداً عشوائياً بدون بنية."
    ],
    "followUpQuestions": [
      "ما هي العلاقة بين YAGNI وتسليم الميزات الرشيقة (Agile Delivery) في شكل MVP؟"
    ],
    "sources": [
      {
        "title": "Martin Fowler — YAGNI",
        "url": "https://martinfowler.com/bliki/Yagni.html"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fds-001",
    "slug": "data-structures-arrays-vs-linked-lists-cache-locality",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-data-structures"
    ],
    "difficulty": "Junior",
    "question": "لماذا تتفوق المصفوفات (Arrays) على القوائم المترابطة (Linked Lists) في سرعة التكرار حتى لو كانت بنفس التعقيد الزمني O(N)؟",
    "shortAnswer": "بسبب التموضع المكاني في الذاكرة (Spatial Locality) ومواءمتها مع خطوط التخزين المؤقت للمعالج (CPU Cache Lines)، بينما تتوزع عقد القائمة المترابطة عشوائياً في الـ Heap.",
    "explanation": "تُخزن عناصر المصفوفة في كتل متجاورة فيزيائياً في الذاكرة (Contiguous Memory). عندما يقرأ المعالج عنصراً، يقوم تلقائياً بجلب الكتلة المحيطة بالكامل (Cache Line عادة 64 بايت) إلى الـ L1/L2 Cache، فتكون العناصر التالية جاهزة بسرعة نانو ثانية دون التوجه للـ RAM. في المقابل، كل عقدة (Node) في Linked List تُخصص في مكان عشوائي في الذاكرة وتتطلب مؤشراً إضافياً، مما يسبب إخفاقات مستمرة في التخزين المؤقت (Cache Misses).",
    "codeExample": "// مصفوفة متصلة:\n// [Elem0 | Elem1 | Elem2 | Elem3] -> تقرأ دفعة واحدة في خط كاش واحد\n// قائمة مترابطة:\n// [Node0] -> مؤشر -> [Node1 بعيد في الذاكرة] -> Cache Miss مستمر!",
    "commonMistakes": [
      "الاعتقاد بأن Linked List أفضل دائماً من Array للإدراج في البداية O(1)، متجاهلين أن كلفة تخصيص الذاكرة للعقدة والـ Cache Misses تجعل المصفوفة الديناميكية أسرع في معظم الحالات العملية الصغيرة."
    ],
    "followUpQuestions": [
      "متى تكون القائمة المترابطة خياراً متفوقاً بالفعل على المصفوفة؟"
    ],
    "sources": [
      {
        "title": "Locality of reference - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Locality_of_reference"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fds-002",
    "slug": "data-structures-hash-tables-collision-resolution",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-data-structures"
    ],
    "difficulty": "Mid",
    "question": "كيف تعمل جداول التجزئة (Hash Tables) وما الفرق بين حل التصادمات عبر Chaining وعبر Open Addressing؟",
    "shortAnswer": "تقوم دالة التجزئة بتحويل المفتاح إلى مؤشر رقمي في مصفوفة داخلية لتحقيق وصول O(1). وعندما ينتج نفس المؤشر لمفتاحين مختلفين (Collision)، تُحل عبر ربط القوائم (Chaining) أو البحث في الفهارس الشاغرة (Open Addressing).",
    "explanation": "في Separate Chaining، يحتوي كل موضع في الجدول على قائمة مترابطة أو شجرة بحث حمراء-سوداء تجمع العناصر المتصادمة في نفس الـ Bucket. في Open Addressing (مثل Linear Probing أو Quadratic Probing)، تظل كل العناصر داخل المصفوفة الرئيسية نفسها؛ وعند حدوث تصادم، يبحث الخوارزمي عن الخانة التالية الفارغة وفقاً لمعادلة فحص محددة. يحدد عامل التحميل (Load Factor) متى يجب مضاعفة حجم الجدول وإعادة التجزئة (Rehashing).",
    "codeExample": "// Chaining:\n// Index 3 -> [KeyA: Val1] -> [KeyB: Val2]\n// Open Addressing (Linear Probing):\n// Index 3 -> [KeyA: Val1]\n// Index 4 -> [KeyB: Val2] (تم وضعه في الخانة التالية الشاغرة)",
    "commonMistakes": [
      "استخدام دالة تجزئة (Hash Function) رديئة توزع العناصر في فهارس متجاورة، مما يحول جدول التجزئة إلى قائمة خطية بطيئة O(N)."
    ],
    "followUpQuestions": [
      "ما هي مشكلة التكتل الأولي (Primary Clustering) في أسلوب Linear Probing؟"
    ],
    "sources": [
      {
        "title": "Hash table - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Hash_table"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fds-003",
    "slug": "data-structures-binary-search-trees-avl-red-black",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-data-structures"
    ],
    "difficulty": "Mid",
    "question": "ما هي أشجار البحث الثنائية (BST) ولماذا نحتاج لأشجار متوازنة ذاتياً مثل AVL و Red-Black Trees؟",
    "shortAnswer": "تضمن شجرة BST أن الابن الأيسر أصغر من العقدة والأيمن أكبر، لكن إدخال عناصر مرتبة يحولها إلى خط مستقيم مائل O(N)، لذا تتدخل الأشجار المتوازنة عبر الدوران (Rotations) لضمان عمق O(log N).",
    "explanation": "أشجار AVL تفرض توازناً صارماً جداً؛ حيث لا يزيد فارق الارتفاع بين أي شجرتين فرعيتين عن 1، مما يجعلها مثالية للبحث السريع المتكرر. أشجار Red-Black تستخدم توازناً أكثر تساهلاً يعتمد على قواعد تلوين العقد بالأحمر والأسود، مما يقلل عدد الدورات المطلوبة أثناء الإدخال والحذف، ولذلك تُستخدم كبنية افتراضية في مكتبات اللغات الكبرى مثل TreeMap في Java و std::map في C++.",
    "codeExample": "// شجرة متدهورة غير متوازنة (Worst Case):\n// 1 -> 2 -> 3 -> 4 (تتحول لقائمة خطية O(N))\n// شجرة متوازنة ذاتياً (Self-Balancing):\n//     [2]\n//    /   \\\n//  [1]   [3] (عمق لوغاريثمي O(log N))",
    "commonMistakes": [
      "الاعتقاد بأن BST تضمن دائماً O(log N) دون الحاجة لآليات توازن ذاتي."
    ],
    "followUpQuestions": [
      "كيف تختلف تكلفة الإدخال والحذف بين شجرة AVL وشجرة Red-Black في السيناريوهات المكثفة؟"
    ],
    "sources": [
      {
        "title": "Red-black tree - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Red%E2%80%93black_tree"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fds-004",
    "slug": "data-structures-stack-queue-monotonic-stack",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-data-structures"
    ],
    "difficulty": "Junior",
    "question": "قارن بين الطابور (Queue) والمكدس (Stack) وما هي المكدسات الرتيبة (Monotonic Stacks)؟",
    "shortAnswer": "المكدس يعمل بنظام 'من يدخل آخراً يخرج أولاً' (LIFO)، والطابور بنظام 'من يدخل أولاً يخرج أولاً' (FIFO). والمكدس الرتيب يحافظ على ترتيب تصاعدي أو تنازلي صارم لعناصره لحل مسائل النطاقات بـ O(N).",
    "explanation": "تُستخدم الـ Stacks في تتبع استدعاء الدوال (Call Stack)، التراجع (Undo)، والتحقق من الأقواس المتوازنة. وتُستخدم الـ Queues في جدولة المهام ومعالجة الطلبات بالترتيب. أما الـ Monotonic Stack فيُستخدم في مسائل الخوارزميات المتقدمة (مثل إيجاد أول عنصر أكبر Next Greater Element أو حساب مساحة المستطيلات في الهيستوجرام)، حيث يتم إخراج العناصر التي تخل بالترتيب الرتيب قبل الإضافة.",
    "codeExample": "// Stack: push(1), push(2) -> pop() يعيد 2\n// Queue: enqueue(1), enqueue(2) -> dequeue() يعيد 1",
    "commonMistakes": [
      "استخدام مصفوفة عادية في لغة لا تدعم إزالة العنصر الأول بـ O(1) للطابور (مثل array.shift()) مما يسبب كلفة O(N) مع كل عملية خروج."
    ],
    "followUpQuestions": [
      "كيف تبني طابوراً ذا طرفين (Deque / Double-Ended Queue) وما هي استخداماته في خوارزميات Sliding Window؟"
    ],
    "sources": [
      {
        "title": "Stack (abstract data type) - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Stack_(abstract_data_type)"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fds-005",
    "slug": "data-structures-heaps-priority-queues-heapify",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-data-structures"
    ],
    "difficulty": "Mid",
    "question": "كيف يعمل الكوم الثنائي (Binary Heap) وكيف تمثله مصفوفة بسيطة بدون مؤشرات عقد مع عملية Heapify؟",
    "shortAnswer": "الكوم الثنائي هو شجرة ثنائية شبه مكتملة تحقق خاصية الكوم (العنصر الأب أصغر من أبنائه في Min-Heap أو أكبر في Max-Heap)، ويُمثل بكفاءة في مصفوفة حيث أبناء العنصر عند المؤشر i يقعان عند 2i+1 و 2i+2.",
    "explanation": "لأن الشجرة مكتملة دائماً، لا نحتاج لتخزين مؤشرات pointers في الذاكرة؛ فالأب عند index يمتلك ابنه الأيسر عند 2*i + 1 والأيمن عند 2*i + 2، والأب عند floor((i-1)/2). تتيح عملية Heapify تحويل مصفوفة عشوائية إلى Heap في زمن خطي مدهش O(N) بدلاً من O(N log N) عبر بناء المستويات من الأسفل للأعلى، بينما يستغرق استخراج القمة O(log N).",
    "codeExample": "// تمثيل المصفوفة: [Min, Child1, Child2, Grandchild1, ...]\n// Left child = 2*i + 1\n// Right child = 2*i + 2\n// Parent = (i - 1) / 2",
    "commonMistakes": [
      "الخلط بين شجرة البحث الثنائية (BST) والكوم الثنائي (Binary Heap)؛ الـ Heap لا يرتب الأبناء الأيسر والأيمن بالنسبة لبعضهما بل بالنسبة للأب فقط."
    ],
    "followUpQuestions": [
      "لماذا تستغرق خوارزمية Heapify على مصفوفة كاملة زمناً قدره O(N) رياضياً وليس O(N log N)؟"
    ],
    "sources": [
      {
        "title": "Binary heap - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Binary_heap"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fds-006",
    "slug": "data-structures-graphs-adjacency-matrix-vs-list",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-data-structures"
    ],
    "difficulty": "Mid",
    "question": "ما الفرق بين مصفوفة التجاور (Adjacency Matrix) وقائمة التجاور (Adjacency List) في تمثيل الرسوم البيانية (Graphs)؟",
    "shortAnswer": "مصفوفة التجاور تستخدم شبكة ثنائية الأبعاد V×V ممتازة للرسوم الكثيفة وتوفر فحص وجود ضلع بـ O(1)، بينما قائمة التجاور تخزن جيران كل رأس في قائمة موفرة للذاكرة O(V + E) ومثالية للرسوم المتناثرة.",
    "explanation": "في معظم التطبيقات العملية (كالشبكات الاجتماعية وشبكات الطرق)، تكون الرسوم متناثرة (Sparse Graphs) حيث عدد الأضلاع E أقل بكثير من V^2؛ لذلك تستهلك مصفوفة التجاور ذاكرة هائلة O(V^2) معظمها أصفار. قائمة التجاور تحتفظ فقط بالعلاقات الفعلية، مما يتيح التكرار السريع على الجيران في خوارزميات BFS و DFS بزمن O(V + E).",
    "codeExample": "// مصفوفة التجاور (Matrix):\n//   A B C\n// A 0 1 0\n// B 1 0 1\n// قائمة التجاور (List):\n// A -> [B]\n// B -> [A, C]",
    "commonMistakes": [
      "اختيار مصفوفة تجاور لرسم بياني يحتوي على 1,000,000 رأس، مما يتطلب مصفوفة بتريليون خانة وتتسبب فوراً في Out Of Memory."
    ],
    "followUpQuestions": [
      "كيف تُمثل الأوزان والاتجاهات (Directed & Weighted Graphs) في كل من البنيتين؟"
    ],
    "sources": [
      {
        "title": "Adjacency list - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Adjacency_list"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fds-007",
    "slug": "data-structures-trie-prefix-tree-autocomplete",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-data-structures"
    ],
    "difficulty": "Senior",
    "question": "كيف تعمل شجرة البادئات (Trie / Prefix Tree) ولماذا تتفوق على جداول التجزئة في البحث بالبادئة والإكمال التلقائي؟",
    "shortAnswer": "تخزن شجرة Trie السلاسل النصية حرفاً بحرف بحيث تشترك الكلمات ذات البادئة المتطابقة في نفس المسار، مما يتيح البحث واسترجاع البادئات بزمن O(L) حيث L هو طول الكلمة مستقلاً تماماً عن عدد الكلمات المخزنة.",
    "explanation": "في جداول التجزئة، يجب معرفة الكلمة بالكامل لحساب الـ Hash، ولا يمكنك البحث عن كل الكلمات التي تبدأ بـ 'car' إلا بالمرور على كل عناصر الجدول O(N). أما في Trie، فتصل إلى العقدة 'c' ثم 'a' ثم 'r' في 3 خطوات فقط، ومنها تستطيع استعراض الشجرة الفرعية بالكامل للحصول على كافة مقترحات الإكمال التلقائي (Autocomplete) فورياً.",
    "codeExample": "// Trie:\n//        (root)\n//          |\n//         [c]\n//          |\n//         [a]\n//        /   \\\n//      [r]   [t]\n//     (car) (cat)",
    "commonMistakes": [
      "استهلاك الذاكرة العالي في Trie التقليدي بسبب كثرة المؤشرات الفارغة، وعلاج ذلك باستخدام Radix Tree أو Compressed Trie."
    ],
    "followUpQuestions": [
      "كيف تعمل شجرة Radix Tree (Patricia Trie) على ضغط المسارات ذات الحرف الواحد لتوفير الذاكرة؟"
    ],
    "sources": [
      {
        "title": "Trie - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Trie"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fds-008",
    "slug": "data-structures-lru-cache-implementation-details",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-data-structures"
    ],
    "difficulty": "Senior",
    "question": "كيف تصمم ذاكرة مؤقتة بنظام الأقل استخداماً مؤخراً (LRU Cache) تحقق عمليات Get و Put بزمن O(1) صارم؟",
    "shortAnswer": "عبر دمج هيكلين للبيانات معاً: جدول تجزئة (Hash Map) للبحث الفوري O(1)، وقائمة مترابطة مزدوجة (Doubly Linked List) لتتبع ترتيب الاستخدام وإضافة وحذف العناصر في O(1).",
    "explanation": "يحتفظ الـ Hash Map بمفتاح العنصر وقيمة تشير مباشرة إلى عقدة في القائمة المترابطة المزدوجة. تحتوي القائمة على رأس وهمي (Head) وذيل وهمي (Tail). عند استدعاء get(key) أو تعديل قيمة، نحدد العقدة من الـ Map وننقلها إلى بداية القائمة (Most Recently Used). وعند امتلاء السعة واستدعاء put()، نقوم بحذف العقدة الموجودة قبل الذيل مباشرة (Least Recently Used) وحذفها من الـ Map في O(1) ثابت.",
    "codeExample": "class LRUCache {\n  private map = new Map<string, Node>();\n  private head = new Node('', 0);\n  private tail = new Node('', 0);\n  // ربط Head بـ Tail والتحريك عند كل وصول\n}",
    "commonMistakes": [
      "استخدام مصفوفة عادية وتحديث موقع العنصر عبر إزاحة بقية العناصر، مما يرفع كلفة التحديث إلى O(N) ويفقد الذاكرة المؤقتة سرعتها."
    ],
    "followUpQuestions": [
      "ما الفرق بين سياسة الإخلاء LRU (Least Recently Used) وسياسة LFU (Least Frequently Used)؟"
    ],
    "sources": [
      {
        "title": "LRU cache implementation - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Cache_replacement_policies#LRU"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fds-009",
    "slug": "data-structures-segment-tree-fenwick-tree",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-data-structures"
    ],
    "difficulty": "Senior",
    "question": "متى نستخدم شجرة المقاطع (Segment Tree) وشجرة فينويك (Fenwick Tree / BIT) في استعلامات النطاقات؟",
    "shortAnswer": "عند الحاجة للقيام باستعلامات حسابية على نطاقات متغيرة من مصفوفة (Range Queries مثل المجموع أو القيمة الصغرى) مع تحديث العناصر بشكل ديناميكي متكرر في زمن O(log N).",
    "explanation": "إذا كانت المصفوفة ثابتة، يكفي جدول المجموع التراكمي (Prefix Sum) لحساب المجموع في O(1) ولكن كلفة التحديث O(N). وإذا حدثت العناصر مباشرة تكون كلفة التحديث O(1) والاستعلام O(N). تحل Segment Tree و Fenwick Tree هذه المعضلة بموازنة الطرفين؛ حيث تحقق كل من التحديث (Update) واستعلام النطاق (Range Query) في زمن لوغاريثمي O(log N). تتميز شجرة Fenwick بسهولة كتابتها وتوفيرها للذاكرة، بينما تدعم Segment Tree استعلامات أكثر تعقيداً كالحد الأدنى وتحديث النطاقات (Lazy Propagation).",
    "codeExample": "// Fenwick Tree تستخدم العمليات الثنائية (LSB) للتنقل:\n// index += (index & -index);",
    "commonMistakes": [
      "كتابة Segment Tree كاملة لمصفوفة ثابتة لا تتغير عناصرها إطلاقاً، حيث تكفي مصفوفة Prefix Sum البسيطة لتوفير زمن O(1)."
    ],
    "followUpQuestions": [
      "كيف تعمل تقنية Lazy Propagation في Segment Tree لتحديث نطاق كامل بزمن O(log N)؟"
    ],
    "sources": [
      {
        "title": "Segment tree - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Segment_tree"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fds-010",
    "slug": "data-structures-stack-vs-heap-memory-layout",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-data-structures"
    ],
    "difficulty": "Junior",
    "question": "ما الفرق الجوهري بين ذاكرة المكدس (Stack Memory) وذاكرة الكومة (Heap Memory) في إدارة موارد البرنامج؟",
    "shortAnswer": "الـ Stack هو مساحة ذاكرة خطية سريعة جداً تُدار تلقائياً بواسطة المعالج لتخزين المتغيرات المحلية وإطارات الدوال، بينما الـ Heap مساحة ديناميكية ضخمة لحجز كائنات متغيرة الحجم يديرها المبرمج أو جامع القمامة (GC).",
    "explanation": "يتحرك مؤشر الـ Stack بمجرد زيادة أو إنقاص سجل المؤشر (Stack Pointer) مع دخول وخروج الدوال؛ تخصيصها لحظي وتحريرها تلقائي ومحمي من التجزئة، لكن حجمها محدود وأي تجاوز يسبب Stack Overflow. أما الـ Heap فيتطلب البحث عن كتلة حرة وحجزها (malloc/new)، وهي أبطأ بكثير وعرضة لتجزئة الذاكرة (Memory Fragmentation) وتتطلب إدارة واعية لمنع تسريب الذاكرة.",
    "codeExample": "// المتغيرات المحلية الصغيرة على الـ Stack:\nint count = 42;\n// الكائنات الديناميكية على الـ Heap مع مؤشر محلي على الـ Stack:\nUser* user = new User('Alice');",
    "commonMistakes": [
      "الاعتقاد بأن لغات الـ Managed مثل Java و C# و JavaScript لا تستخدم الـ Stack؛ جميع اللغات تستخدم الـ Stack لإطارات الاستدعاء والمتغيرات الأولية."
    ],
    "followUpQuestions": [
      "كيف يعمل تحليل الهروب (Escape Analysis) في المترجمات الحديثة لتخصيص الكائنات على الـ Stack بدلاً من الـ Heap؟"
    ],
    "sources": [
      {
        "title": "Memory management - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Memory_management"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "falg-001",
    "slug": "algorithms-big-o-omega-theta-notations",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-algorithms"
    ],
    "difficulty": "Junior",
    "question": "ما هو الفرق الدقيق بين ترميزات Big-O و Big-Omega و Big-Theta في تحليل تعقيد الخوارزميات؟",
    "shortAnswer": "ترميز Big-O يمثل الحد الأعلى المقارب للنمو (السيناريو الأسوأ Worst Case)، و Big-Omega يمثل الحد الأدنى (السيناريو الأفضل Best Case)، و Big-Theta يمثل حداً محكماً يطابق سلوك الخوارزمية في جميع الحالات.",
    "explanation": "عندما نقول خوارزمية O(N^2)، فإننا نضمن رياضياً أن استهلاكها للوقت لن ينمو أسرع من ثابت مضروب في N^2 عندما تقترب المدخلات من اللانهاية. أما Big-Omega (Ω) فتحدد أقل زمن ممكن. وإذا كان أفضل وأسوأ سيناريو متطابقين في معدل النمو (مثل MergeSort التي تأخذ N log N في كل الأحوال)، فنصفها بأنها Θ(N log N). يركز مهندسو البرمجيات على Big-O لضمان عدم انهيار النظام تحت الحمل الأقصى.",
    "codeExample": "// تحليل التعقيد:\n// O(1) < O(log N) < O(N) < O(N log N) < O(N^2) < O(2^N) < O(N!)",
    "commonMistakes": [
      "إهمال تعقيد الذاكرة والمساحة (Space Complexity) والتركيز فقط على تعقيد الوقت (Time Complexity)."
    ],
    "followUpQuestions": [
      "لماذا نتجاهل الثوابت الرياضية (Constants) والحدود الدنيا في تحليل Big-O للأنظمة الكبيرة؟"
    ],
    "sources": [
      {
        "title": "Big O notation - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Big_O_notation"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "falg-002",
    "slug": "algorithms-quicksort-vs-mergesort-stability",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-algorithms"
    ],
    "difficulty": "Mid",
    "question": "قارن بين خوارزميتي QuickSort و MergeSort من حيث التعقيد المكاني، استقرار الترتيب (Stability)، وأسوأ سيناريو؟",
    "shortAnswer": "ترتيب MergeSort مستقر (Stable) ويضمن دائماً O(N log N) لكنه يستهلك ذاكرة إضافية O(N)، بينما QuickSort يرتب في نفس المكان (In-place O(1) auxiliary space) وأسرع عملياً لكنه غير مستقر وأسوأ سيناريو له O(N^2).",
    "explanation": "الترتيب المستقر (Stable Sort) يحافظ على الترتيب النسبي للعناصر المتساوية في القيمة، وهو أمر حيوي عند الترتيب المتعدد (مثل ترتيب الطلاب حسب الاسم ثم حسب الدرجة). في خوارزمية QuickSort، إذا تم اختيار Pivot سيئ دائماً (مثل اختيار أول عنصر في مصفوفة مرتبة مسبقاً)، يتدهور التقسيم إلى O(N^2). تعالج الخوارزميات الحديثة ذلك بـ Randomized QuickSort أو هجين IntroSort المستخدم في C++ std::sort.",
    "codeExample": "// MergeSort: يقسم المصفوفة إلى نصفين ويدمجهما بذاكرة إضافية\n// QuickSort: يختار Pivot ويقسم العناصر حوله في نفس المكان",
    "commonMistakes": [
      "استخدام QuickSort الكلاسيكي دون اختيار عشوائي للـ Pivot على بيانات مرتبة جزئياً، مما يسبب بطئاً شديداً."
    ],
    "followUpQuestions": [
      "كيف تعمل خوارزمية TimSort الهجينة المستخدمة في Python و Java لترتيب البيانات الحقيقية بسرعة قياسية؟"
    ],
    "sources": [
      {
        "title": "Quicksort - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Quicksort"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "falg-003",
    "slug": "algorithms-binary-search-bounds-space-reduction",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-algorithms"
    ],
    "difficulty": "Junior",
    "question": "كيف تعمل خوارزمية البحث الثنائي (Binary Search) وما هي الحيل الرياضية لتفادي مشكلة Integer Overflow؟",
    "shortAnswer": "تعمل على مصفوفة مرتبة مسبقاً بتقسيم نطاق البحث إلى النصف في كل خطوة بزمن O(log N)، ولتفادي طفحان الأعداد الصحيحة يُحسب المنتصف عبر low + (high - low) / 2 بدلاً من (low + high) / 2.",
    "explanation": "إذا كانت قيمتا low و high قريبتين من الحد الأقصى للأعداد الصحيحة (مثل 2^31 - 1)، فإن جمعهما (low + high) يسبب طفحاناً عددياً (Integer Overflow) يتحول إلى رقم سالب في لغات مثل Java و C++، مما يؤدي لرمي ArrayIndexOutOfBoundsException. يمكن أيضاً تطبيق البحث الثنائي ليس فقط على مصفوفات الأرقام، بل على فضاءات الإجابات المستمرة (Binary Search on Answer Space) لحل مسائل التحسين والحد الأدنى للحد الأقصى.",
    "codeExample": "function binarySearch(arr: number[], target: number): number {\n  let low = 0, high = arr.length - 1;\n  while (low <= high) {\n    const mid = low + Math.floor((high - low) / 2); // آمن من الـ Overflow\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) low = mid + 1;\n    else high = mid - 1;\n  }\n  return -1;\n}",
    "commonMistakes": [
      "تطبيق البحث الثنائي على مصفوفة غير مرتبة وتوقع نتائج صحيحة."
    ],
    "followUpQuestions": [
      "كيف تختلف خوارزميتا Lower Bound و Upper Bound عند البحث عن أول أو آخر ظهور لعنصر مكرر؟"
    ],
    "sources": [
      {
        "title": "Binary search algorithm - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Binary_search_algorithm"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "falg-004",
    "slug": "algorithms-bfs-vs-dfs-applications",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-algorithms"
    ],
    "difficulty": "Mid",
    "question": "قارن بين البحث بالعرض (BFS) والبحث بالعمق (DFS) في استكشاف الرسوم البيانية ومتى تختار كلاً منهما؟",
    "shortAnswer": "يستكشف BFS الجيران مستوى بمستوى باستخدام طابور (Queue) وهو مثالي لإيجاد أقصر مسار في الرسوم غير الموزونة، بينما يتعمق DFS لأقصى مسار ممكن باستخدام مكدس (Stack/Recursion) ومثالي لاكتشاف الدورات والمطابقة الطوبولوجية.",
    "explanation": "يضمن BFS زيارة كافة العقد الواقعة على بُعد خطوة واحدة أولاً، ثم خطوتين، مما يجعله الخوارزمي الأسرع لإيجاد أقصر مسار في شبكات التواصل ومسارات المتاهات غير الموزونة، لكنه يستهلك ذاكرة أكبر لحفظ طبقة الجيران O(W). بينما يتعمق DFS مستكشفاً فرعاً حتى آخره، مما يجعله ممتازاً لحل مسائل المتاهات الكاملة، الترتيب الطوبولوجي (Topological Sort)، كشف الدورات (Cycle Detection)، وحساب المكونات المتصلة بقوة (Strongly Connected Components).",
    "codeExample": "// BFS: يستخدم Queue\nconst queue = [startNode];\n// DFS: يستخدم Stack أو استدعاء ذاتي Recursion\nfunction dfs(node) { visited.add(node); for (const n of node.neighbors) dfs(n); }",
    "commonMistakes": [
      "نسيان تسجيل العقد التي تمت زيارتها في Set أو مصفوفة visited، مما يسبب دوراناً لا نهائياً (Infinite Loop) في الرسوم التي تحتوي على دورات."
    ],
    "followUpQuestions": [
      "كيف تختلف مساحة الذاكرة المستهلكة بين BFS و DFS في شجرة متوازنة ذات عمق كبير وتفرع عريض؟"
    ],
    "sources": [
      {
        "title": "Breadth-first search - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Breadth-first_search"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "falg-005",
    "slug": "algorithms-dijkstra-vs-bellman-ford-shortest-path",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-algorithms"
    ],
    "difficulty": "Senior",
    "question": "متى تخفق خوارزمية ديكسترا (Dijkstra) في إيجاد أقصر مسار ولماذا نلجأ إلى خوارزمية بلمان-فورد (Bellman-Ford)؟",
    "shortAnswer": "تخفق ديكسترا عند وجود أضلاع ذات أوزان سالبة لأنها تفترض جشعاً (Greedy) أن المسار المحسوب لا يمكن أن يقصر مستقبلاً، بينما تعالج Bellman-Ford الأوزان السالبة وتكتشف الدورات السالبة (Negative Cycles).",
    "explanation": "تستخدم ديكسترا طابور أولوية (Min-Priority Queue) وتصل لتعقيد O((V + E) log V). عند وجود ضلع سالب، قد تجد الخوارزمية مساراً يبدو أطول لكنه يصبح أقصر لاحقاً بفضل القيمة السالبة، مما يربك منطق التثبيت الجشع. خوارزمية Bellman-Ford تكرر عملية الاسترخاء (Relaxation) لجميع الأضلاع V-1 مرة بتعقيد O(V * E)، وإذا أمكن تقصير أي مسار في الخطوة V، فهذا دليل قاطع على وجود دورة سالبة تؤدي لانهيار مفهوم أقصر مسار (-Infinity).",
    "codeExample": "// Dijkstra: سريعة جداً وتتطلب أوزاناً موجبة فقط\n// Bellman-Ford: تدعم الأوزان السالبة وتكتشف فخاخ التكلفة اللانهائية",
    "commonMistakes": [
      "تشغيل ديكسترا على شبكة مالية أو تحكيم عملات قد تحتوي على هوامش ربح سالبة، مما يعطي مسارات غير صحيحة."
    ],
    "followUpQuestions": [
      "كيف تستفيد خوارزمية A* Search من دوال الاستدلال (Heuristics) لتسريع ديكسترا في ألعاب الفيديو والخرائط؟"
    ],
    "sources": [
      {
        "title": "Dijkstra's algorithm - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "falg-006",
    "slug": "algorithms-two-pointers-and-sliding-window",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-algorithms"
    ],
    "difficulty": "Junior",
    "question": "كيف تحول تقنيتا المؤشرين (Two Pointers) والنافذة المنزلقة (Sliding Window) المسائل التربيعية O(N^2) إلى خطية O(N)؟",
    "shortAnswer": "عبر الاحتفاظ بمؤشرين يتحركان في اتجاه محدد بدلاً من فحص كل الأزواج الممكنة بحلقتين متداخلتين، مما يضمن زيارة كل عنصر عدداً ثابتاً من المرات.",
    "explanation": "في تقنية Two Pointers (مثل مسألة Two Sum على مصفوفة مرتبة)، نضع مؤشراً في البداية والآخر في النهاية، فإذا كان المجموع صغيراً نحرك الأيسر للأمام، وإذا كان كبيراً نحرك الأيمن للخلف بزمن O(N). وفي Sliding Window (مثل إيجاد أطول سلسلة فرعية بدون تكرار)، نوسع النافذة بزيادة المؤشر الأيمن، وعند اختراق الشرط نقوم بتقليصها بزيادة المؤشر الأيسر، محافظين على فحص النطاق المتحرك بزمن خطي ثابت.",
    "codeExample": "let left = 0;\nfor (let right = 0; right < s.length; right++) {\n  // توسيع النافذة\n  while (windowConditionBroken()) {\n    // تقليص النافذة من اليسار\n    left++;\n  }\n  maxLength = Math.max(maxLength, right - left + 1);\n}",
    "commonMistakes": [
      "محاولة استخدام Two Pointers على مصفوفة غير مرتبة لمسائل الأرقام، مما يقود لقرارات توجيه خاطئة."
    ],
    "followUpQuestions": [
      "ما الفرق بين النافذة المنزلقة ذات الحجم الثابت (Fixed-size) والنافذة ذات الحجم الديناميكي (Variable-size)؟"
    ],
    "sources": [
      {
        "title": "Sliding window protocol and algorithms",
        "url": "https://en.wikipedia.org/wiki/Sliding_window_protocol"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "falg-007",
    "slug": "algorithms-dynamic-programming-memoization-tabulation",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-algorithms"
    ],
    "difficulty": "Senior",
    "question": "ما هي الشروط الأساسية لتطبيق البرمجة الديناميكية (DP) وما الفرق بين Memoization و Tabulation؟",
    "shortAnswer": "تتطلب DP شرطين: مشاكل فرعية متداخلة (Overlapping Subproblems) وبنية تحتية مثالية (Optimal Substructure). Memoization نهج من الأعلى للأسفل (Top-Down مع كاش)، و Tabulation نهج من الأسفل للأعلى (Bottom-Up مع جدول).",
    "explanation": "البنية التحتية المثالية تعني أن الحل الأمثل للمسألة الكبيرة يمكن تركيبه من الحلول المثالية للمسائل الأصغر. والمشاكل المتداخلة تعني أن نفس الحسابات تتكرر مراراً (مثل شجرة متتالية فيبوناتشي). في Top-Down Memoization، نستخدم الاستدعاء الذاتي العادي ونخزن النتيجة في Map لمنع إعادة الحساب. في Bottom-Up Tabulation، نبدأ بحل الحالات الأساسية (Base Cases) ونملأ جدول مصفوفة خطوة بخطوة، مما يوفر مساحة إطارات الـ Call Stack ويتيح تحسين استهلاك الذاكرة (Space Optimization).",
    "codeExample": "// Tabulation مع تحسين الذاكرة لمسألة فيبوناتشي بزمن O(N) ومساحة O(1):\nlet prev2 = 0, prev1 = 1;\nfor (let i = 2; i <= n; i++) {\n  const curr = prev1 + prev2;\n  prev2 = prev1;\n  prev1 = curr;\n}",
    "commonMistakes": [
      "محاولة حل مسألة باستخدام البرمجة الديناميكية بينما لا تحتوي على مشاكل فرعية متداخلة (مثل MergeSort التي تعتبر Divide and Conquer وليست DP)."
    ],
    "followUpQuestions": [
      "كيف تكتشف انتقال الحالة (State Transition Equation) في مسألة حقيبة الظهر الشهيرة (0/1 Knapsack Problem)؟"
    ],
    "sources": [
      {
        "title": "Dynamic programming - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Dynamic_programming"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "falg-008",
    "slug": "algorithms-greedy-choice-property-knapsack",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-algorithms"
    ],
    "difficulty": "Mid",
    "question": "ما هي خاصية الاختيار الجشع (Greedy Choice Property) ولماذا تنجح الخوارزميات الجشعة في Fractional Knapsack وتفشل في 0/1 Knapsack؟",
    "shortAnswer": "خاصية الاختيار الجشع تعني أن اختيار أفضل حل محلي لحظي يقود بالضرورة للحل الأمثل الشامل، وتنجح عند إمكانية تجزئة العناصر وتفشل عند اشتراط أخذ العنصر كاملاً أو تركه.",
    "explanation": "في مسألة Fractional Knapsack، يمكننا ترتيب العناصر حسب النسبة بين القيمة والوزن (Value/Weight Ratio) واختيار أعلى نسبة دائماً وأخذ أجزاء كسرية من العنصر الأخير، محققين الحل الأمثل بـ O(N log N). لكن في 0/1 Knapsack، قد يؤدي اختيار عنصر ذي كثافة قيمة عالية إلى إشغال مساحة تمنع وضع عنصرين آخرين مجموعهما أفضل، مما يجعل الأسلوب الجشع قاصراً ويجبرنا على اللجوء للبرمجة الديناميكية.",
    "codeExample": "// الأسلوب الجشع يختار الأفضل فوراً دون ندم أو تراجع:\nitems.sort((a, b) => (b.value / b.weight) - (a.value / a.weight));",
    "commonMistakes": [
      "الافتراض بأن الحل الجشع صحيح دائماً بمجرد أنه يبدو منطقياً وبديهياً، دون إثبات رياضي لصحة الاختيار."
    ],
    "followUpQuestions": [
      "كيف تبرهن خوارزميات شهيرة مثل Kruskal و Prim لحساب شجرة الامتداد الصغرى (MST) صحة خياراتها الجشعة؟"
    ],
    "sources": [
      {
        "title": "Greedy algorithm - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Greedy_algorithm"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "falg-009",
    "slug": "algorithms-backtracking-pruning-n-queens",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-algorithms"
    ],
    "difficulty": "Senior",
    "question": "كيف تعمل خوارزميات التراجع (Backtracking) وما هو دور التقليم (Pruning) في استكشاف شجرة فضاء الحالات لمسألة N-Queens؟",
    "shortAnswer": "يقوم Backtracking ببناء الحل تدريجياً، وبمجرد اكتشاف أن المسار الحالي ينتهك الشروط، يتراجع خطوة للوراء (Backtracks)؛ ويقوم التقليم (Pruning) بإلغاء فروع الشجرة المستحيلة مسبقاً لتوفير الوقت.",
    "explanation": "في مسألة N-Queens، بدلاً من تجربة كافة التباديل البالغة N^N بأسلوب القوة الغاشمة (Brute Force)، نضع ملكة في الصف الأول، ثم نبحث في الصف التالي عن عمود غير مهدد. إذا وجدنا أن وضع الملكة في خانة معينة يهدد قطرياً أو عمودياً، نقوم بالتقليم (Pruning) ونتجاهل استكشاف كل الصفوف اللاحقة المتفرعة من هذا الموضع، ونعود للوراء لتغيير موقع الملكة السابقة. هذا يقلص فضاء البحث من أرقام فلكية إلى بضعة آلاف خطوة.",
    "codeExample": "function solve(row) {\n  if (row === N) { result.push([...board]); return; }\n  for (let col = 0; col < N; col++) {\n    if (isValid(row, col)) {\n      placeQueen(row, col);\n      solve(row + 1); // تعمق\n      removeQueen(row, col); // تراجع (Backtrack)\n    }\n  }\n}",
    "commonMistakes": [
      "نسيان عكس التغييرات واستعادة حالة المتغيرات عند الرجوع من الاستدعاء الذاتي (Undo State)."
    ],
    "followUpQuestions": [
      "كيف تحل تقنية التقليم ذاتها مسائل خوارزمية Sudoku ومسألة توليد المجموعات الجزئية (Subsets)؟"
    ],
    "sources": [
      {
        "title": "Backtracking - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Backtracking"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "falg-010",
    "slug": "algorithms-bit-manipulation-tricks-masks",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-algorithms"
    ],
    "difficulty": "Mid",
    "question": "ما هي أهم حيل معالجة البتات (Bit Manipulation) مثل فحص القوى الثنائية وحساب عدد البتات وإيجاد العنصر الفريد عبر XOR؟",
    "shortAnswer": "العمليات الثنائية تنفذ على مستوى دوائر المعالج في دورة ساعة واحدة (Single CPU Cycle)؛ فحص قوى 2 يتم عبر (n & (n - 1)) == 0، وإيجاد العنصر الفريد الوحيد يتم بتطبيق XOR على جميع الأرقام.",
    "explanation": "خواص XOR المذهلة: A ^ A = 0 و A ^ 0 = A، والعملية تبادلية وتجميعية. فإذا كانت مصفوفة تحتوي على كل الأرقام مكررة مرتين عدا رقم واحد، فإن تطبيق XOR التراكمي يلغي كل العناصر المكررة ويتبقى الرقم الفردي تلقائياً بزمن O(N) ومساحة O(1)! حيلة n & (n - 1) تقوم بحذف البت الأحادي الأيمن الأخير (Least Significant Bit)، وتُستخدم في خوارزمية Brian Kernighan لعد البتات المضاءة بزمن يتناسب مع عدد الآحاد فقط.",
    "codeExample": "// فحص هل الرقم قوة لـ 2 (Power of Two):\nconst isPowerOfTwo = (n > 0) && ((n & (n - 1)) === 0);\n\n// إيجاد العنصر الفريد الفردي:\nconst singleNumber = (nums: number[]) => nums.reduce((acc, num) => acc ^ num, 0);",
    "commonMistakes": [
      "نسيان وضع الأقواس حول العمليات الثنائية؛ حيث تمتلك معاملات المقارنة مثل == أولوية أعلى من & في معظم اللغات البرمجية."
    ],
    "followUpQuestions": [
      "كيف تُمثل الأقنعة الثنائية (Bitmasks) المجموعات المكونة من حتى 64 عنصراً لتمكين العمليات الرياضية في خطوة واحدة؟"
    ],
    "sources": [
      {
        "title": "Bitwise operation - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Bitwise_operation"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fcnc-001",
    "slug": "concurrency-threads-vs-processes-memory-layout",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-concurrency"
    ],
    "difficulty": "Junior",
    "question": "ما هو الفرق الجوهري بين العمليات (Processes) وخيوط التنفيذ (Threads) وتكلفة التبديل السياقي (Context Switching)؟",
    "shortAnswer": "العملية تمثل برنامجاً مستقلاً يمتلك مساحة عنوان ذاكرة افتراضية معزولة خاصة به، بينما تتشارك الخيوط داخل نفس العملية نفس الذاكرة والملفات ومساحة الكومة (Heap) وتمتلك مكدساً مستقلاً فقط.",
    "explanation": "تبديل السياق بين عمليتين (Process Context Switch) مكلف وبطيء جداً؛ لأنه يتطلب من نواة نظام التشغيل (Kernel) تبديل جداول الصفحات (Page Tables) وتفريغ الـ TLB (Translation Lookaside Buffer) ومسح خطوط كاش المعالج. في المقابل، التبديل بين خيوط نفس العملية (Thread Context Switch) أسرع بكثير لأن مساحة الذاكرة والـ Page Tables لا تتغير، لكن مشاركة الذاكرة تفتح الباب على مصراعيه لحالات السباق وفساد البيانات.",
    "codeExample": "// Process 1 (Memory Isolated) <--- IPC (Sockets/Pipes) ---> Process 2 (Memory Isolated)\n// Process 1:\n//   ├── Thread A (Own Stack) ──┐\n//   └── Thread B (Own Stack) ──┴──> Shared Heap & Open Files",
    "commonMistakes": [
      "الاعتقاد بأن إنشاء آلاف الخيوط يسرع البرنامج دائماً؛ كثرة الخيوط تسبب ظاهرة تسمى Thread Thrashing حيث يقضي المعالج معظم وقته في التبديل السياقي بدلاً من الحسابات الفعلية."
    ],
    "followUpQuestions": [
      "ما هي خيوط المستخدم الخفيفة (Green Threads / Goroutines / Virtual Threads) وكيف تختلف عن خيوط نظام التشغيل (OS Threads)؟"
    ],
    "sources": [
      {
        "title": "Thread (computing) - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Thread_(computing)"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fcnc-002",
    "slug": "concurrency-race-conditions-and-critical-sections",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-concurrency"
    ],
    "difficulty": "Junior",
    "question": "ما هي حالة السباق (Race Condition) وما هو القسم الحرج (Critical Section) في البرمجة المتزامنة؟",
    "shortAnswer": "القسم الحرج هو جزء الشفرة الذي يصل إلى مورد مشترك قابل للتعديل، وحالة السباق تحدث عندما تتنافس خيوط متعددة للوصول والتعديل على هذا المورد في نفس الوقت دون تزامن مناسب.",
    "explanation": "المثال الكلاسيكي هو عملية count++ البسيطة؛ على مستوى لغة الآلة تتكون من 3 تعليمات: (1) قراءة القيمة من الذاكرة إلى السجل (Read). (2) إضافة واحد (Increment). (3) كتابة القيمة في الذاكرة (Write). إذا دخل خيطان في نفس الوقت، قد يقرأ كلاهما القيمة 5 معاً، ويحسبان 6، ويكتبان 6 في الذاكرة بدلاً من 7! هذا الفقدان العشوائي للبيانات يمثل حالة سباق كارثية.",
    "codeExample": "// كود غير آمن متعدد الخيوط:\nint counter = 0;\nvoid increment() {\n  counter++; // غير ذرية (Not Atomic) وتسبب Race Condition\n}",
    "commonMistakes": [
      "الاعتقاد بأن سطراً واحداً من الكود (مثل x++) هو عملية ذرية آمنة في بيئة متعددة الخيوط."
    ],
    "followUpQuestions": [
      "كيف تساعد أدوات ThreadSanitizer في اكتشاف حالات السباق الخفية أثناء تشغيل الاختبارات؟"
    ],
    "sources": [
      {
        "title": "Race condition - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Race_condition"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fcnc-003",
    "slug": "concurrency-mutex-semaphore-spinlock-readwrite",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-concurrency"
    ],
    "difficulty": "Mid",
    "question": "قارن بين أدوات المزامنة: Mutex و Semaphore و Spinlock و Read-Write Lock ومتى تختار كلاً منها؟",
    "shortAnswer": "الـ Mutex قفل متبادل يملكه خيط واحد فقط، والـ Semaphore إشارة تسمح بعدد N من الخيوط المتزامنة، والـ Spinlock يدور في حلقة مشغولة دون تعليق الخيط، والـ ReadWrite Lock يسمح بقراء متعددين أو كاتب واحد فقط.",
    "explanation": "إذا كان القسم الحرج قصيراً للغاية (بضعة تعليمات نانوثانية)، فإن الـ Spinlock ممتاز لأنه يتجنب كلفة التبديل السياقي لوضع الخيط في النوم وإيقاظه. وإذا كان لديك مورد مقيد (مثل حوض اتصالات قاعدة بيانات يستوعب 10 اتصالات)، فالـ Counting Semaphore هو الحل الأمثل. وإذا كان الكود يقرأ البيانات آلاف المرات ويكتب نادراً، فالـ Reader-Writer Lock يضاعف سرعة الأداء بالسماح بالقراءة المتزامنة دون أي حجب حتى يأتي كاتب جديد.",
    "codeExample": "// Mutex: حصر متبادل لخيط واحد\nmutex.lock();\ntry { criticalWork(); } finally { mutex.unlock(); }\n\n// Semaphore: يسمح لـ 5 خيوط كحد أقصى بالتزامن\nsemaphore.acquire();\nservice();\nsemaphore.release();",
    "commonMistakes": [
      "استخدام Spinlock في نظام أحادي النواة (Single Core)، مما يسبب تجميد المعالج بالكامل في حلقة دوران بلا فائدة."
    ],
    "followUpQuestions": [
      "ما هو القفل التكراري (Reentrant Lock / Recursive Mutex) ومتى تحتاجه الدالة لتفادي إقفال نفسها؟"
    ],
    "sources": [
      {
        "title": "Lock (computer science) - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Lock_(computer_science)"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fcnc-004",
    "slug": "concurrency-deadlocks-coffman-conditions",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-concurrency"
    ],
    "difficulty": "Senior",
    "question": "ما هي شروط كوفمان الأربعة (Coffman Conditions) لحدوث الجمود (Deadlock) وكيف تكسر أحدها لحل المشكلة؟",
    "shortAnswer": "شروط الجمود الأربعة هي: (1) الحصر المتبادل (Mutual Exclusion). (2) التعليق والانتظار (Hold and Wait). (3) عدم انتزاع القفل قسراً (No Preemption). (4) الانتظار الدائري (Circular Wait). وكسر أي شرط منها يمنع الجمود نهائياً.",
    "explanation": "يحدث الجمود الكلاسيكي عندما يمسك الخيط 1 بالقفل A وينتظر القفل B، بينما يمسك الخيط 2 بالقفل B وينتظر القفل A؛ يتوقف النظام للأبد. أسهل وأقوى استراتيجية هندسية لكسر الجمود هي كسر شرط الانتظار الدائري عبر فرض ترتيب صارم لاكتساب الأقفال (Lock Ordering): يجب على جميع خيوط النظام دائماً حجز القفل A قبل القفل B وفقاً لترتيب هرمي ثابت وموحد.",
    "codeExample": "// كسر الجمود بفرض ترتيب القفل عالمياً:\nvoid transfer(Account from, Account to) {\n  Account first = from.id < to.id ? from : to;\n  Account second = from.id < to.id ? to : from;\n  synchronized(first) {\n    synchronized(second) {\n      // مستحيل حدوث Deadlock لأن الترتيب موحد لكل العمليات!\n    }\n  }\n}",
    "commonMistakes": [
      "محاولة حل الجمود بإضافة تأخير زمني عشوائي Thread.sleep() بدلاً من معالجة ترتيب الأقفال بنيوياً."
    ],
    "followUpQuestions": [
      "ما هي خوارزمية المصرفي (Banker's Algorithm) لإدارة وتجنب الجمود في أنظمة التشغيل؟"
    ],
    "sources": [
      {
        "title": "Deadlock - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Deadlock"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fcnc-005",
    "slug": "concurrency-memory-visibility-volatile-barriers",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-concurrency"
    ],
    "difficulty": "Senior",
    "question": "ما هي مشكلة رؤية الذاكرة (Memory Visibility) وما هو دور الكلمة المفتاحية volatile وحواجز الذاكرة (Memory Barriers)؟",
    "shortAnswer": "تقوم المعالجات بتخزين المتغيرات في كاش محلي (L1/L2) وإعادة ترتيب التعليمات، مما يجعل التعديلات التي يجريها خيط غير مرئية فوراً للخيوط الأخرى؛ وتضمن volatile القراءة والكتابة المباشرة في الذاكرة المشتركة.",
    "explanation": "بدون إشارات مزامنة، قد يدخل الخيط A في حلقة while (!flag) {}. إذا عدل الخيط B قيمة flag إلى true، قد لا يرى الخيط A هذا التغيير أبداً لأن المعالج وضع flag في سجل محلي وافترض أنها لن تتغير من داخل الحلقة. كلمة volatile تخبر المترجم والمعالج بعدم إعادة ترتيب التعليمات المحيطة وتفرض حاجز ذاكرة (Memory Barrier / Fence) يجبر المعالج على تفريغ القيمة إلى الذاكرة الرئيسية وقراءتها منها دائماً.",
    "codeExample": "// يضمن رؤية المتغير فوراً عبر كافة النوى بدون كاش معزول:\nprivate volatile boolean isRunning = true;",
    "commonMistakes": [
      "الاعتقاد بأن volatile توفر عمليات ذرية (Atomicity)؛ فهي تحل مشكلة الرؤية فقط (Visibility) ولا تحمي count++ من الـ Race Conditions."
    ],
    "followUpQuestions": [
      "ما هو نموذج الذاكرة (Java/C++ Memory Model) وعلاقة 'Happens-Before' الرياضية؟"
    ],
    "sources": [
      {
        "title": "Volatile (computer programming) - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Volatile_(computer_programming)"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fcnc-006",
    "slug": "concurrency-atomic-operations-compare-and-swap",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-concurrency"
    ],
    "difficulty": "Senior",
    "question": "كيف تعمل خوارزميات المقارنة والتبديل (Compare-And-Swap - CAS) وبناء هياكل البيانات غير المقفلة (Lock-Free)؟",
    "shortAnswer": "تعتمد تعليمات CAS على تعليمة ذرية مدمجة بالمعالج تقارن محتوى الذاكرة بقيمة متوقعة، وإذا تطابقت تستبدلها بالقيمة الجديدة بنجاح؛ وإذا فشلت يعيد الخيط المحاولة دون حجز أي قفل.",
    "explanation": "الأقفال التقليدية تضع الخيط في النوم عند التعارض وتكلف تبديلاً سياقياً باهظاً. أما المتغيرات الذرية (مثل AtomicInteger في Java أو std::atomic في C++) فتستخدم حلقة متكررة خفيفة (CAS Loop): يقرأ الخيط القيمة الحالية، يحسب القيمة الجديدة، وينفذ تعليمة CAS. إذا عدل خيط آخر القيمة في نفس النانوثانية، تفشل التعليمة فيدور الخيط ثانية ويقرأ القيمة المحدثة فوراً، محققاً أداءً فائقاً وإنتاجية هائلة (High Throughput).",
    "codeExample": "// مفهوم حلقة CAS الذرية بدون أقفال:\ndo {\n  current = value.get();\n  next = current + 1;\n} while (!value.compareAndSet(current, next));",
    "commonMistakes": [
      "تعرض خوارزميات CAS لمشكلة ABA الشهيرة، حيث تتغير القيمة من A إلى B ثم تعود إلى A دون أن يكتشف الخيط أن المحتوى قد تم تعديله بالفعل."
    ],
    "followUpQuestions": [
      "كيف تحل الـ AtomicStampedReference مشكلة ABA بإضافة عداد إصدارات تراكمي مع كل تعديل؟"
    ],
    "sources": [
      {
        "title": "Compare-and-swap - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Compare-and-swap"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fcnc-007",
    "slug": "concurrency-thread-pools-sizing-work-stealing",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-concurrency"
    ],
    "difficulty": "Mid",
    "question": "كيف تدير أحواض الخيوط (Thread Pools) المهام وما هي معادلة الحجم المثالي للـ CPU-bound مقابل I/O-bound؟",
    "shortAnswer": "تدير أحواض الخيوط طابوراً من المهام مع عدد محدد من الخيوط الجاهزة وتمنع انهيار النظام؛ وحجم الحوض للعمليات الحسابية يساوي عدد النوى (N_cpu)، بينما لعمليات الإدخال/الإخراج يساوي N_cpu * (1 + Wait_Time / Compute_Time).",
    "explanation": "إنشاء وتدمير خيط لكل طلب مستخدم يؤدي لانهيار السيرفر بسبب استهلاك الذاكرة. يحتفظ الـ Thread Pool بعدد ثابت من الخيوط العاملة التي تلتقط المهام من BlockingQueue. إذا كانت المهام CPU-bound (تشفير أو ضغط)، فزيادة الخيوط عن عدد النوى يضر الأداء بسبب الـ Context Switching. أما إذا كانت I/O-bound (انتظار قاعدة البيانات أو الشبكة حيث يقضي الخيط 90% من وقته في الانتظار)، فيمكن زيادة الخيوط لـ 10 إلى 50 ضعفاً لتشغيل النوى أثناء انتظار الآخرين.",
    "codeExample": "// ForkJoinPool تستخدم خوارزمية سرقة العمل (Work-Stealing):\n// عندما ينتهي خيط من طابوره الخاص، يسرق مهام من ذيل طوابير الخيوط المزدحمة لضمان أقصى كفاءة!",
    "commonMistakes": [
      "استخدام نفس الـ Thread Pool المشترك للعمليات الحسابية السريعة والعمليات الخارجية البطيئة، مما يؤدي لاختناق المهام السريعة وتعطل الخادم."
    ],
    "followUpQuestions": [
      "ما هي استراتيجيات التعامل مع طفحان طابور الحوض (Saturation Policies: Abort, CallerRuns, Discard)؟"
    ],
    "sources": [
      {
        "title": "Thread pool - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Thread_pool"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fcnc-008",
    "slug": "concurrency-event-loop-vs-thread-per-request",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-concurrency"
    ],
    "difficulty": "Mid",
    "question": "قارن بين نموذج الخيط لكل طلب (Thread-per-request) ونموذج حلقة الأحداث غير المحجوبة (Event Loop with Non-blocking I/O)؟",
    "shortAnswer": "نموذج الخيط لكل طلب يخصص خيطاً كاملاً لكل اتصال مستخدم ويحجزه طوال فترة الانتظار، بينما تعتمد حلقة الأحداث على خيط واحد يستمع لأحداث المقابس عبر آليات النواة (epoll/kqueue) دون حجب.",
    "explanation": "في السيرفرات الكلاسيكية (مثل Apache Tomcat القديم)، حجز خيط لكل طلب يعني أنه عند وصول 10,000 اتصال متزامن يحتاج السيرفر لـ 10,000 خيط، مما يستهلك عدة غيغابايت من الذاكرة للمكدسات (Stacks) وينهار تحت وطأة الـ Context Switching (معضلة C10K). في المقابل، يعمل Node.js و Nginx و Netty بحلقة أحداث واحدة: يُسجل مقبس العميل مع النواة، وعند وصول بايتات من الشبكة، تطلق النواة إشعاراً ليلتقطه الـ Event Loop وينفذ الـ Callback بسرعة ويعود للاستماع فوراً.",
    "codeExample": "// Event Loop:\n// Single Thread -> epoll_wait() -> ينفذ الـ Callbacks الجاهزة فقط ويعود في ميكروثانية\n// Thread-per-request:\n// Client 1 -> Thread 1 (Blocked waiting for DB)\n// Client 2 -> Thread 2 (Blocked waiting for DB)",
    "commonMistakes": [
      "تشغيل عملية حسابية ثقيلة (CPU-intensive مثل تشفير معقد أو تعدين) على خيط الـ Event Loop، مما يجمد معالجة كافة طلبات المستخدمين الآخرين في نفس اللحظة."
    ],
    "followUpQuestions": [
      "كيف أغلقت ميزة Virtual Threads في Java 21 فجوة كفاءة الذاكرة بين النموذجين؟"
    ],
    "sources": [
      {
        "title": "The C10K problem",
        "url": "https://en.wikipedia.org/wiki/C10k_problem"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fcnc-009",
    "slug": "concurrency-producer-consumer-bounded-buffer",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-concurrency"
    ],
    "difficulty": "Mid",
    "question": "كيف تصمم نمط المنتج والمستهلك (Producer-Consumer) باستخدام حاجز مقيد (Bounded Buffer) مع الضغط العكسي (Backpressure)؟",
    "shortAnswer": "باستخدام طابور ذي سعة قصوى مدعوم بمتغيرات الشروط (Condition Variables)؛ يتوقف المنتج عن العمل عندما يمتلئ الطابور، ويتوقف المستهلك عندما يفرغ الطابور.",
    "explanation": "إذا كان المنتج ينتج 10,000 عنصر في الثانية والمستهلك يعالج 1,000 فقط، فإن الطابور غير المحدود (Unbounded Queue) سينمو حتى يبتلع كل ذاكرة النظام ويسبب OutOfMemoryError. استخدام حاجز مقيد بسعة محددة (مثل 100 عنصر) يفرض الضغط العكسي (Backpressure) الطبيعي: عندما يمتلئ الطابور، يستدعي المنتج notFull.await() ويتوقف تلقائياً حتى يستهلك الطرف الآخر عنصراً ويطلق notFull.signal()، مما يوازن سرعة المنظومة بتناغم وأمان تام.",
    "codeExample": "class BlockingQueue<T> {\n  private queue: T[] = [];\n  constructor(private capacity: number) {}\n  // انتظار عند الامتلاء (Put) وانتظار عند الفراغ (Take)\n}",
    "commonMistakes": [
      "استخدام طوابير غير محدودة في معالجة طلبات الإنتاج، مما يجعل السيرفر فريسة سهلة لانهيارات الذاكرة عند حدوث هجمات أو أوقات الذروة."
    ],
    "followUpQuestions": [
      "كيف تترجم مكتبات Reactive Streams (مثل RxJava أو Project Reactor) الضغط العكسي عبر بروتوكول request(n)؟"
    ],
    "sources": [
      {
        "title": "Producer–consumer problem - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Producer%E2%80%93consumer_problem"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fcnc-010",
    "slug": "concurrency-optimistic-vs-pessimistic-locking",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-concurrency"
    ],
    "difficulty": "Senior",
    "question": "قارن بين القفل التفاؤلي (Optimistic Concurrency) والقفل التشاؤمي (Pessimistic Concurrency) في قواعد البيانات والذاكرة؟",
    "shortAnswer": "القفل التشاؤمي يحجز المورد فوراً ويمنع الآخرين من القراءة أو التعديل حتى انتهاء المعاملة، بينما القفل التفاؤلي يسمح للجميع بالتعديل المتزامن مع فحص إصدار السجل (Version) عند الحفظ ورفض المعاملة إذا تغير.",
    "explanation": "القفل التشاؤمي (مثل SELECT ... FOR UPDATE) ممتاز عندما تكون احتمالية التعارض عالية جداً (High Contention) مثل حجز المقعد الأخير في طائرة أو شراء سلعة محدودة المخزون؛ لأنه يضمن عدم إهدار وقت المعالجة. أما القفل التفاؤلي فمثالي عندما يكون التعارض نادراً (Low Contention) والقراءة أكثر بكثير من الكتابة؛ حيث نقوم بتحديث السجل بشرط WHERE version = @currentVersion مع زيادة العداد. إذا كان الصف قد عُدل بالفعل، ترجع العملية 0 صفوف متأثرة فنطلب من المستخدم إعادة المحاولة دون أي حجز أو أقفال قاعدة بيانات باهظة.",
    "codeExample": "// قفل تفاؤلي عبر رقم الإصدار في SQL:\nUPDATE products\nSET stock = stock - 1, version = version + 1\nWHERE id = 42 AND version = 5;\n// إذا كانت النتيجة 0 rows، فهذا يعني أن خيطاً آخر قد عدل المخزون قبلك!",
    "commonMistakes": [
      "استخدام الأقفال التشاؤمية لمعاملات طويلة تتضمن مدخلات مستخدم تفاعلية، مما يعلق جداول قاعدة البيانات للأبد."
    ],
    "followUpQuestions": [
      "كيف تتعامل أنظمة التوزيع الحديثة مع القفل التفاؤلي عبر تقنية MVCC (Multi-Version Concurrency Control)؟"
    ],
    "sources": [
      {
        "title": "Optimistic concurrency control - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Optimistic_concurrency_control"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fsys-001",
    "slug": "system-design-horizontal-vs-vertical-scaling-stateless",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-system-design"
    ],
    "difficulty": "Junior",
    "question": "ما الفرق بين التوسع الأفقي (Horizontal Scaling) والتوسع الرأسي (Vertical Scaling) ولماذا تعتبر الخوادم عديمة الحالة (Stateless) شرطاً أساسياً؟",
    "shortAnswer": "التوسع الرأسي (Scale Up) يعني زيادة موارد نفس السيرفر (RAM, CPU)، بينما التوسع الأفقي (Scale Out) يعني إضافة المزيد من الخوادم المتوازية خلف موزع أحمال (Load Balancer). وتعتبر الخوادم عديمة الحالة شرطاً للتوسع الأفقي لتمكين توجيه أي طلب لأي خادم عشوائياً.",
    "explanation": "التوسع الرأسي له سقف عتادي صارم (Hardware Limit) وتكلفة متزايدة بشكل أسي ومخاطرة وجود نقطة فشل مفردة (Single Point of Failure). التوسع الأفقي غير محدود عملياً ويمكنه التكيف التلقائي مع الحمل (Auto-scaling). لكن إذا كان السيرفر يخزن جلسة المستخدم (User Session) في ذاكرته المحلية، فإن توجيه الطلب التالي لسيرفر آخر يسجل خروج المستخدم؛ لذا يتم نقل الجلسات إلى كاش مركزي مشترك (مثل Redis) لتصبح الخوادم عديمة الحالة بالكامل (Stateless).",
    "codeExample": "// بنية خوادم عديمة الحالة (Stateless Architecture):\n// [Clients] -> [Load Balancer] -> [App Server 1 | App Server 2 | App Server 3]\n//                                        │                │                │\n//                                        └────────┬───────┴────────┬───────┘\n//                                                 ▼                ▼\n//                                           [Redis Cache]   [Postgres DB]",
    "commonMistakes": [
      "تخزين ملفات المستخدم المرفوعة أو جلسات الدخول على القرص الصلب أو ذاكرة خادم التطبيق بدلاً من خدمات التخزين السحابي (S3/Redis)."
    ],
    "followUpQuestions": [
      "ما هي استراتيجية الـ Sticky Sessions (Session Affinity) وما هي عيوبها عند حدوث فشل في السيرفر؟"
    ],
    "sources": [
      {
        "title": "Scalability - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Scalability"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fsys-002",
    "slug": "system-design-cap-theorem-and-pacelc",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-system-design"
    ],
    "difficulty": "Senior",
    "question": "اشرح نظرية CAP ونظرية PACELC وما الذي تختاره الأنظمة الموزعة عند حدوث انقطاع في الشبكة (Network Partition)؟",
    "shortAnswer": "تنص نظرية CAP على أنه في أي نظام موزع عند حدوث انقسام في الشبكة (Partition - P)، يستحيل الجمع بين الاتساق الكامل (Consistency - C) والتوافر التام (Availability - A)؛ فيجب التضحية بأحدهما.",
    "explanation": "إذا انقطع الاتصال بين مركز بيانات في أوروبا وآخر في أمريكا (Network Partition): إذا اخترت الاتساق (CP System مثل HBase أو Zookeeper)، فإن النظام يرفض كتابات جديدة أو يعيد خطأ حتى تعود الشبكة منعاً للتعارض. إذا اخترت التوافر (AP System مثل Cassandra أو DynamoDB)، يتيح النظام القراءة والكتابة في كلا المركزين ولكن يضحي بالاتساق اللحظي معتمداً على الاتساق النهائي (Eventual Consistency). نظرية PACELC توسع ذلك: إذا كان هناك انقسام (P) اختر بين A و C، وإلا (Else - E) اختر بين زمن الاستجابة (Latency - L) والاتساق (Consistency - C).",
    "codeExample": "// الاختيار أثناء انقطاع الشبكة:\n// CP: ضمان صحة الرصيد البنكي حتى لو توقفت الخدمة مؤقتاً\n// AP: بقاء التغريدات ومنشورات السوشيال ميديا متاحة حتى لو تأخرت بضع ثوان في المزامنة",
    "commonMistakes": [
      "الاعتقاد بأنه يمكنك اختيار 'CA System' في الأنظمة الموزعة؛ انقطاعات الشبكة (Partitions) أمر حتمي فيزيائياً في العالم الحقيقي، لذا فإن الاختيار الحقيقي محصور بين CP أو AP."
    ],
    "followUpQuestions": [
      "كيف تحل متجهات الساعات (Vector Clocks) وخوارزمية Last-Write-Wins تعارضات البيانات في أنظمة AP؟"
    ],
    "sources": [
      {
        "title": "CAP theorem - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/CAP_theorem"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fsys-003",
    "slug": "system-design-caching-strategies-stampede",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-system-design"
    ],
    "difficulty": "Mid",
    "question": "قارن بين استراتيجيات التخزين المؤقت: Cache-Aside و Write-Through و Write-Back وما هي ظاهرة تدافع الكاش (Cache Stampede)؟",
    "shortAnswer": "في Cache-Aside يقرأ التطبيق من الكاش أولاً ويملأه عند الفشل، وفي Write-Through يكتب في الكاش وقاعدة البيانات معاً، وفي Write-Back يكتب في الكاش ويؤجل كتابة قاعدة البيانات للدفعة. وتدافع الكاش يحدث عندما تنتهي صلاحية مفتاح شائع فتهجم آلاف الطلبات المتزامنة على قاعدة البيانات في نفس اللحظة.",
    "explanation": "استراتيجية Cache-Aside هي الأكثر شيوعاً ومرونة. Write-Through تضمن أن الكاش محدث دائماً لكنها تزيد زمن الكتابة. Write-Back سريعة جداً في الكتابة لكنها مهددة بفقدان البيانات إذا تعطل الكاش قبل تفريغها في الذاكرة الدائمة. لمنع Cache Stampede (تدافع الكاش / Thundering Herd): (1) استخدام أقفال المزامنة الموزعة (Mutex) بحيث يقوم طلب واحد فقط بإعادة الاستعلام من قاعدة البيانات وتحديث الكاش بينما ينتظر البقية. (2) إضافة تباين عشوائي لوقت انتهاء الصلاحية (Jitter / Randomized TTL). (3) إعادة الحساب المبكر في الخلفية (Probabilistic Early Expiration).",
    "codeExample": "// منع تدافع الكاش باستخدام قفل موزع:\nconst data = await redis.get(key);\nif (!data) {\n  if (await redis.set('lock:' + key, '1', 'NX', 'EX', 5)) {\n    const dbData = await fetchFromDB();\n    await redis.set(key, dbData, 'EX', 3600);\n    await redis.del('lock:' + key);\n  }\n}",
    "commonMistakes": [
      "تعيين نفس وقت انتهاء الصلاحية (TTL) الدقيق لجميع المفتايح الحيوية في نفس الثانية، مما يسبب سقوطها جميعاً في وقت واحد وانهيار قاعدة البيانات."
    ],
    "followUpQuestions": [
      "ما هي تقنية Cache Invalidation الأفضل: الإبطال الصريح (Eviction) أم التحديث الفوري عند الكتابة؟"
    ],
    "sources": [
      {
        "title": "Cache-aside pattern - Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fsys-004",
    "slug": "system-design-load-balancing-consistent-hashing",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-system-design"
    ],
    "difficulty": "Senior",
    "question": "كيف تعمل خوارزمية التجزئة المتسقة (Consistent Hashing) ولماذا تتفوق على خوارزمية Modulo التقليدية في توزيع الأحمال والكاش؟",
    "shortAnswer": "التجزئة المتسقة ترتب الخوادم والمفاتيح في حلقة دائرية افتراضية، وعند إضافة أو إزالة سيرفر، يُعاد تعيين نسبة طفيفة جداً من المفاتيح (K/N) بدلاً من إعادة توزيع كافة البيانات كما يحدث في خوارزمية Modulo.",
    "explanation": "في خوارزمية hash(key) % N التقليدية، إذا كان لديك 4 خوادم وأضفت خادماً خامساً ليصبح N=5، فإن نتيجة العملية الحسابية تتغير لـ 99% من المفاتيح تقريباً، مما يتسبب في إفراغ كامل للكاش واختفاء البيانات (Massive Cache Invalidation) وانهيار قواعد البيانات تحت الضغط. تحل Consistent Hashing ذلك برسم حلقة من 0 إلى 2^32 - 1. يوضع السيرفر على الحلقة، ويتم البحث عن أول سيرفر يقع في اتجاه عقارب الساعة لكل مفتاح. تُستخدم العقد الافتراضية (Virtual Nodes) لضمان التوزيع العادل والموحد للأحمال وتفادي البقع الساخنة (Hotspots).",
    "codeExample": "// حلقة التجزئة المتسقة (Consistent Hash Ring):\n// Key K يُوجه لأول سيرفر يليه باتجاه عقارب الساعة في الحلقة الدائرية\n// إضافة خادم جديد تأخذ فقط شريحة صغيرة من الجار المباشر دون المساس ببقية السيرفرات",
    "commonMistakes": [
      "تطبيق التجزئة المتسقة دون استخدام العقد الافتراضية (Virtual Nodes)، مما يسبب تفاوتاً غير عادل في توزيع الحمل بين الخوادم."
    ],
    "followUpQuestions": [
      "كيف تستخدم أنظمة التخزين الموزعة مثل DynamoDB و Apache Cassandra التجزئة المتسقة لتوزيع أقسام البيانات (Partitions)؟"
    ],
    "sources": [
      {
        "title": "Consistent hashing - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Consistent_hashing"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fsys-005",
    "slug": "system-design-database-sharding-vs-partitioning",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-system-design"
    ],
    "difficulty": "Senior",
    "question": "ما هو تقسيم قواعد البيانات (Sharding) وما هي تحديات اختيار مفتاح التقسيم (Shard Key) والاستعلامات المشتركة؟",
    "shortAnswer": "التقسيم هو توزيع بيانات الجدول أفقياً عبر قواعد بيانات أو خوادم فيزيائية مستقلة لزيادة سعة التخزين والإنتاجية؛ والتحدي الأكبر هو اختيار Shard Key يضمن التوزيع العادل وتجنب الاستعلامات عبر الخوادم (Cross-shard joins).",
    "explanation": "إذا اخترت Shard Key سيئاً مثل Country وكان 90% من عملائك في مصر، فسيحدث اختناق شديد في خادم واحد (Hot Shard) بينما تظل بقية الخوادم خاملة. كما أن الاستعلامات التي لا تحتوي على الـ Shard Key في جملة WHERE تضطر لإرسال الاستعلام لجميع السيرفرات بالتوازي (Scatter-Gather Query) مما يدمر الأداء. علاوة على ذلك، تفقد قواعد البيانات المنفصلة المعاملات الذرية الشاملة (ACID Transactions) وتتطلب حلولاً معقدة مثل Two-Phase Commit أو أنماط Saga.",
    "codeExample": "// توزيع المستخدمين بناءً على UserID Hash:\n// Shard = hash(userId) % TotalShards\n// كل سيرفر يحتوي على قاعدة بيانات مستقلة تماماً بجزء من البيانات",
    "commonMistakes": [
      "اللجوء للتقسيم (Sharding) مبكراً قبل استنفاد خيارات الفهرسة السليمة، تقسيم الجداول رأسياً، التخزين المؤقت، واستخدام النسخ الاحتياطية للقراءة (Read Replicas)."
    ],
    "followUpQuestions": [
      "ما هي معضلة إعادة تقسيم البيانات (Resharding) عند نمو النظام وازدياد عدد السيرفرات؟"
    ],
    "sources": [
      {
        "title": "Shard (database architecture) - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Shard_(database_architecture)"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fsys-006",
    "slug": "system-design-relational-vs-nosql-acid-base",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-system-design"
    ],
    "difficulty": "Junior",
    "question": "قارن بين قواعد البيانات العلائقية (SQL) وغير العلائقية (NoSQL) من حيث معايير ACID مقابل BASE؟",
    "shortAnswer": "قواعد SQL تضمن معايير ACID الصارمة وتتميز بجداول منظمة وعلاقات قوية، بينما تعتمد NoSQL على نموذج BASE وتضحي بالاتساق الفوري لصالح التوسع الأفقي الهائل والمرونة في شكل البيانات.",
    "explanation": "معايير ACID: الذرية (Atomicity)، الاتساق (Consistency)، العزل (Isolation)، والمتانة (Durability) وهي ضرورية للمعاملات المالية والحسابية. أما نموذج BASE فيعتمد على: التوافر الأساسي (Basically Available)، الحالة اللينة المرنة (Soft state)، والاتساق النهائي (Eventual consistency)، وهو مثالي لأنظمة التخزين الضخمة، تحليل السجلات (Log Analytics)، والبيانات غير المهيكلة (كالملفات الوثائقية في MongoDB ومخازن المفاتيح في Redis وقواعد البيانات العمودية في Cassandra).",
    "codeExample": "// SQL: التزام صارم بالـ Schema ومفتاح أجنبي وضمانات المعاملات\n// NoSQL: مستندات JSON ديناميكية، سهولة تقسيم أفقية، وتحديثات غير مقيدة",
    "commonMistakes": [
      "استخدام NoSQL للمعاملات المحاسبية المعقدة التي تتطلب حركات ذرية متعددة بين عدة جداول وحسابات."
    ],
    "followUpQuestions": [
      "ما هي مستويات عزل المعاملات (Isolation Levels) في SQL: Read Uncommitted, Read Committed, Repeatable Read, Serializable؟"
    ],
    "sources": [
      {
        "title": "ACID vs BASE - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Eventual_consistency"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fsys-007",
    "slug": "system-design-message-queues-kafka-vs-rabbitmq",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-system-design"
    ],
    "difficulty": "Mid",
    "question": "قارن بين وسيط الرسائل المعتمد على الطوابير (RabbitMQ) وسجل الالتزام الموزع (Apache Kafka) ومتى تستخدم كلاً منهما؟",
    "shortAnswer": "يتميز RabbitMQ بتوجيه الرسائل المعقد والمرن (Smart Broker, Dumb Consumer) وحذف الرسالة بمجرد معالجتها، بينما يعتبر Kafka سجل أحداث متسلسلاً فائق السرعة يحتفظ بالرسائل لفترات طويلة وتتتبع جهات الاستهلاك موضعها بنفسها (Dumb Broker, Smart Consumer).",
    "explanation": "RabbitMQ ممتاز لمهام الخلفية المتفرقة ومعالجة الطلبات غير المتزامنة التي تتطلب توجيهاً دقيقاً (Routing Keys, Topic Exchanges) وأولويات للرسائل. في المقابل، Kafka مصمم لتدفق البيانات الضخمة (Event Streaming) وملايين الأحداث في الثانية؛ حيث تُكتب الأحداث في أقسام (Partitions) متسلسلة على القرص، ويستطيع المشتركون قراءة الرسائل أو إعادة تشغيلها من البداية (Replay events) في أي وقت دون أن تُحذف.",
    "codeExample": "// RabbitMQ: مهام فردية، إقرارات لحظية، وحذف فوري للرسالة المستهلكة\n// Kafka: سجل أحداث ثابت غير قابل للتعديل (Append-Only Log) يدعم القراءة المكررة وملايين الرسائل/ثانية",
    "commonMistakes": [
      "استخدام Kafka لإدارة مهام الخلفية البسيطة الفردية، مما يضيف تعقيداً تشغيلياً هائلاً للبنية التحتية دون داعٍ."
    ],
    "followUpQuestions": [
      "كيف تضمن مجموعات المستهلكين (Consumer Groups) في Kafka معالجة الأحداث بالتوازي مع الحفاظ على الترتيب داخل القسم؟"
    ],
    "sources": [
      {
        "title": "Apache Kafka Architecture",
        "url": "https://en.wikipedia.org/wiki/Apache_Kafka"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fsys-008",
    "slug": "system-design-rate-limiting-token-bucket-leaky-bucket",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-system-design"
    ],
    "difficulty": "Senior",
    "question": "كيف تعمل خوارزميات تحديد معدل الطلبات (Rate Limiting): خوارزمية Token Bucket وخوارزمية Leaky Bucket؟",
    "shortAnswer": "تعتمد Token Bucket على إضافة رموز إلى دلو بمعدل ثابت وتسمح برشقات من الطلبات طالما توفرت رموز، بينما تمرر Leaky Bucket الطلبات بمعدل تدفق ثابت تماماً كقطرات الماء دون السماح بأي طفرات مفاجئة.",
    "explanation": "في خوارزمية Token Bucket، يمتلك الدلو سعة قصوى C، وتضاف الرموز بمعدل R رمز/ثانية. مع كل طلب، يُخصم رمز واحد؛ إذا فرغ الدلو يُرفض الطلب بخطأ 429 Too Many Requests. ميزتها أنها تسمح بمرور رشقة سريعة (Burst) طالما لم يتجاوز الحجم سعة الدلو. أما خوارزمية Leaky Bucket فتضع الطلبات في طابور وتخرجها بمعدل خروج ثابت وصارم، مما يضمن حملاً منتظماً تماماً على الأنظمة الحساسة التي لا تتحمل أي قفزات مفاجئة.",
    "codeExample": "// خوارزمية Token Bucket في Redis:\n// يتم التحقق من الوقت المنقضي وإضافة الرموز الحسابية رياضياً دون الحاجة لمؤقتات خلفية مستمرة!",
    "commonMistakes": [
      "استخدام خوارزمية Fixed Window Counter البسيطة، التي تعاني من عيب خطير يسمح بضعف معدل الطلبات المسموح به عند حافة النافذة الزمنية (Boundary Burst)."
    ],
    "followUpQuestions": [
      "كيف تحل خوارزمية Sliding Window Log مشكلة حواف النوافذ وما هي تكلفتها على استهلاك ذاكرة Redis؟"
    ],
    "sources": [
      {
        "title": "Token bucket - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Token_bucket"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fsys-009",
    "slug": "system-design-circuit-breaker-resiliency-pattern",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-system-design"
    ],
    "difficulty": "Mid",
    "question": "كيف يحمي نمط قاطع الدائرة (Circuit Breaker) الأنظمة الموزعة من الانهيار المتسلسل (Cascading Failure)؟",
    "shortAnswer": "عبر مراقبة إخفاقات الخدمة التابعة وقطع الاتصال بها فوراً (Open State) بمجرد تجاوز عتبة الخطأ، للرد المباشر ببدائل سريعة دون تعليق موارد وسلاسل خيوط الخادم في طلبات فاشلة.",
    "explanation": "إذا توقفت خدمة المدفوعات الخارجية، فإن كل طلب مستخدم يعلق لانتظار الـ Timeout (مثلاً 30 ثانية). خلال دقائق، تنفد جميع خيوط الاتصال بالسيرفر ويتوقف النظام بأكمله عن الاستجابة لجميع المستخدمين. يعمل Circuit Breaker بثلاث حالات: (1) مغلق (Closed): الطلبات تمر طبيعياً ويتم حساب نسبة الفشل. (2) مفتوح (Open): إذا تجاوزت الأخطاء 50%، يفتح القاطع ويمنع إرسال أي طلب للخادم المنهار ويرجع Fallback فوري. (3) نصف مفتوح (Half-Open): بعد انتهاء فترة تجريبية، يسمح بمرور بضعة طلبات؛ إذا نجحت يغلق القاطع، وإن فشلت يعود لحالة الفتح.",
    "codeExample": "// حالات قاطع الدائرة:\n// [Closed] ──(أخطاء متكررة)──> [Open] ──(انتظار فترة الهدوء)──> [Half-Open]\n//    ▲                                                              │\n//    └────────────────────(نجاح الطلبات التجريبية)──────────────────┘",
    "commonMistakes": [
      "إعادة المحاولة الفورية اللانهائية (Aggressive Retry) لخدمة منهارة بالفعل، مما يضاعف الحمل عليها ويمنعها من التعافي نهائياً."
    ],
    "followUpQuestions": [
      "لماذا يجب دائماً دمج خوارزمية Exponential Backoff مع تباين عشوائي (Full Jitter) في سياسات إعادة المحاولة؟"
    ],
    "sources": [
      {
        "title": "Circuit Breaker pattern - Martin Fowler",
        "url": "https://martinfowler.com/bliki/CircuitBreaker.html"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fsys-010",
    "slug": "system-design-saga-pattern-vs-two-phase-commit",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-system-design"
    ],
    "difficulty": "Senior",
    "question": "كيف تدير المعاملات الموزعة في بنية المايكروسيرفس وما الفرق بين Two-Phase Commit ونمط Saga؟",
    "shortAnswer": "بروتوكول 2PC يفرض قفلاً موزعاً متزامناً عبر منسق مركزي يضمن الاتساق الصارم لكنه يعاني من بطء شديد ونقطة فشل مفردة، بينما يدير نمط Saga المعاملات كسلسلة من المعاملات المحلية المنفصلة مع معاملات تعويضية (Compensating Transactions) للتراجع عند الفشل.",
    "explanation": "في نمط Saga، تنفذ كل خدمة معاملتها المحلية وتطلق حدثاً يخبر الخدمة التالية لإكمال دورها. إذا فشلت خطوة في المنتصف (مثل رفض بطاقة الائتمان في خدمة الدفع بعد حجز المقعد في خدمة التذاكر)، تطلق الخدمة حدث فشل وتبدأ خطة التراجع بتنفيذ معاملات تعويضية بالعكس (إلغاء حجز المقعد). ينقسم Saga إلى: Choreography (حيث تتواصل الخدمات ذاتياً عبر الأحداث) أو Orchestration (حيث يوجه منسق مركزي الأوامر والتعويضات).",
    "codeExample": "// نمط Saga مع التعويض:\n// 1. CreateOrder (محلي) -> 2. ReserveInventory (محلي) -> 3. ChargeCard (فشل!)\n// التعويض: 4. CancelInventoryReservation -> 5. MarkOrderFailed",
    "commonMistakes": [
      "استخدام بروتوكول Two-Phase Commit (2PC) في بيئات الخدمات السحابية واسعة النطاق، مما يسبب بطئاً شديداً وحجب الموارد عند أي اضطراب شبكي."
    ],
    "followUpQuestions": [
      "ما هي معضلة القراءة غير النظيفة (Dirty Reads) التي قد تواجهها أنظمة Saga أثناء تنفيذ المعاملات التعويضية؟"
    ],
    "sources": [
      {
        "title": "Saga pattern - Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/azure/architecture/patterns/saga"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fnet-001",
    "slug": "networking-osi-vs-tcpip-model-encapsulation",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-networking"
    ],
    "difficulty": "Junior",
    "question": "قارن بين نموذج OSI المكون من 7 طبقات ونموذج TCP/IP وكيف تعمل عملية التغليف (Encapsulation) لحزم البيانات؟",
    "shortAnswer": "نموذج OSI هو إطار نظري مرجعي من 7 طبقات، بينما TCP/IP هو النموذج العملي الحقيقي للإنترنت المكون من 4 طبقات؛ وتغليف البيانات يعني إضافة ترويسة (Header) خاصة بكل طبقة أثناء هبوط البيانات للأسفل.",
    "explanation": "طبقات OSI: التطبيق (Application)، العرض (Presentation)، الجلسة (Session)، النقل (Transport)، الشبكة (Network)، ربط البيانات (Data Link)، والفيزيائية (Physical). في TCP/IP، دُمجت الطبقات الثلاث العليا في طبقة التطبيق. عند إرسال طلب، تضاف ترويسة TCP في طبقة النقل (لتصبح Segment)، ثم ترويسة IP في طبقة الشبكة (لتصبح Packet)، ثم ترويسة Ethernet في طبقة الرابط (لتصبح Frame)، ثم تُحول لإشارات كهربائية/ضوئية (Bits) عبر الأسلاك.",
    "codeExample": "// تدفق التغليف (Encapsulation):\n// [Data] -> [TCP | Data] -> [IP | TCP | Data] -> [Ethernet | IP | TCP | Data | FCS]",
    "commonMistakes": [
      "الخلط بين عنوان الـ IP (طبقة الشبكة للتوجيه العالمي بين الراوترات) وعنوان الـ MAC (طبقة الرابط للتوصيل المحلي بين الأجهزة المباشرة)."
    ],
    "followUpQuestions": [
      "كيف تعمل عملية فك التغليف (Decapsulation) العكسية عند استقبال الحزمة لدى الخادم المستلم؟"
    ],
    "sources": [
      {
        "title": "OSI model - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/OSI_model"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fnet-002",
    "slug": "networking-tcp-vs-udp-handshake-reliability",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-networking"
    ],
    "difficulty": "Junior",
    "question": "قارن بين بروتوكول TCP وبروتوكول UDP وكيف تضمن مصافحة الـ 3-Way Handshake موثوقية الاتصال؟",
    "shortAnswer": "بروتوكول TCP موثوق، موجه بالاتصال (Connection-oriented)، يضمن وصول وترتيب الحزم والتحكم بالتدفق، بينما UDP بروتوكول عديم الاتصال وسريع جداً دون أي ضمان للوصول أو الترتيب.",
    "explanation": "تؤسس مصافحة TCP الثلاثية الاتصال عبر: (1) إرسال العميل حزمة SYN برقم تسلسلي مبدئي. (2) رد الخادم بـ SYN-ACK لتأكيد الاستلام وإرسال رقمه الخاص. (3) رد العميل بـ ACK لبدء نقل البيانات. يعيد TCP إرسال الحزم المفقودة تلقائياً (Retransmission) ويتحكم بالازدحام (Congestion Control). في المقابل، يرسل UDP الحزم فوراً دون انتظار، مما يجعله الخيار الأمثل للبث المباشر (Video Streaming)، ألعاب الفيديو التنافسية، واستعلامات DNS السريعة.",
    "codeExample": "// TCP 3-Way Handshake:\n// Client ─── SYN (Seq=X) ───> Server\n// Client <── SYN-ACK (Seq=Y, Ack=X+1) ── Server\n// Client ─── ACK (Ack=Y+1) ───> Server",
    "commonMistakes": [
      "استخدام TCP للبث الصوتي الحي في الألعاب، مما يسبب تقطيعاً وتراكماً للتأخير عند ضياع حزمة غير هامة ومحاولة إعادة إرسالها."
    ],
    "followUpQuestions": [
      "كيف تعمل مصافحة الإنهاء الرباعية (4-Way Handshake / FIN-ACK) لإغلاق اتصال TCP بأمان؟"
    ],
    "sources": [
      {
        "title": "Transmission Control Protocol - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Transmission_Control_Protocol"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fnet-003",
    "slug": "networking-http1-vs-http2-vs-http3-quic",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-networking"
    ],
    "difficulty": "Senior",
    "question": "تتبع التطور التاريخي لبروتوكول HTTP: من HTTP/1.1 إلى HTTP/2 والـ Multiplexing وصولاً إلى HTTP/3 ومحرك QUIC القائم على UDP؟",
    "shortAnswer": "عالج HTTP/2 مشكلة حجب صدارة الطابور على مستوى التطبيق بدمج كل الطلبات في اتصال TCP واحد عبر Multiplexing، بينما حل HTTP/3 المشكلة على مستوى النقل بالكامل باستبدال TCP ببروتوكول QUIC فوق UDP.",
    "explanation": "في HTTP/1.1، يتطلب كل طلب اتصالاً مستقلاً أو ينتظر انتهاء الطلب السابق (Head-of-Line Blocking). حل HTTP/2 ذلك بتقسيم البيانات إلى إطارات ثنائية (Binary Frames) ونقل تيارات متزامنة عبر نفس اتصال TCP وميزة ضغط الترويسات (HPACK). لكن عند ضياع حزمة TCP واحدة بسبب تشويش الشبكة، يتوقف بروتوكول TCP عن تمرير كافة التيارات الأخرى حتى تُعاد تلك الحزمة المفقودة! جاء HTTP/3 المبني على QUIC فوق UDP ليعالج ذلك: كل تيار بيانات مستقل تماماً، وضياع حزمة في تدفق لا يؤثر مطلقاً على باقي التيارات، مع دمج مصافحة TLS 1.3 في خطوة واحدة (0-RTT).",
    "codeExample": "// HTTP/1.1: عدة اتصالات متوازية مع استهلاك عالي لموارد الخادم\n// HTTP/2: اتصال TCP واحد + Multiplexing ثنائي (يعاني من HOL Blocking عند ضياع باكت)\n// HTTP/3: مبني على QUIC عبر UDP (انعدام تام لـ HOL Blocking + اتصال لحظي 0-RTT)",
    "commonMistakes": [
      "الاعتقاد بأن HTTP/3 غير آمن لأنه يستخدم UDP؛ بروتوكول QUIC يدمج تشفير TLS 1.3 إلزامياً في كل حزمة ولا يمكن تشغيله كنص خام غير مشفر."
    ],
    "followUpQuestions": [
      "كيف تساهم ميزة Server Push في HTTP/2 وميزة مقاومة انتقال الشبكات (Connection Migration) في QUIC في تحسين تجربة الهواتف الذكية؟"
    ],
    "sources": [
      {
        "title": "HTTP/3 and QUIC - MDN Web Docs",
        "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fnet-004",
    "slug": "networking-https-tls-ssl-handshake-process",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-networking"
    ],
    "difficulty": "Mid",
    "question": "كيف تؤمن بروتوكولات HTTPS و TLS الاتصالات وما هي مراحل مصافحة TLS (TLS Handshake) وتبادل المفاتيح؟",
    "shortAnswer": "يؤمن TLS الاتصال بالجمع بين التشفير غير المتماثل (Asymmetric) لتبادل المفاتيح والمصادقة، والتشفير المتماثل (Symmetric) السريع لتشفير تدفق البيانات الفعلي.",
    "explanation": "المراحل: (1) Client Hello: يرسل العميل إصدارات TLS المدعومة وقائمة خوارزميات التشفير (Cipher Suites) وقيمة عشوائية. (2) Server Hello: يختار الخادم الخوارزمية ويرسل شهادته الرقمية (SSL Certificate) التي تحتوي على مفتاحه العام (Public Key). (3) التحقق: يفحص المتصفح الشهادة وسلسلة الثقة عبر السلطات المعتمدة (CA). (4) تبادل المفاتيح (عبر Diffie-Hellman): يولد الطرفان مفتاح جلسة سري مشترك (Session Key). (5) التشفير المتماثل: تُشفر جميع البيانات اللاحقة بمفتاح الجلسة باستخدام خوارزميات فائقة السرعة مثل AES-GCM.",
    "codeExample": "// الأمان الثلاثي الذي يوفره TLS:\n// 1. السرية (Confidentiality): التشفير يمنع التنصت\n// 2. النزاهة (Integrity): منع التلاعب بالحزم (HMAC)\n// 3. المصادقة (Authentication): إثبات هوية الخادم الحقيقي عبر شهادة الـ CA",
    "commonMistakes": [
      "تجاهل ميزة السرية التوجيهية للأمام (Forward Secrecy - PFS) والاعتقاد بأن تسريب المفتاح الخاص للخادم مستقبلاً يكشف الاتصالات المشفرة السابقة المسجلة."
    ],
    "followUpQuestions": [
      "ما هي شهادات Let's Encrypt وكيف تعمل آلية التجديد التلقائي عبر بروتوكول ACME؟"
    ],
    "sources": [
      {
        "title": "Transport Layer Security - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Transport_Layer_Security"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fnet-005",
    "slug": "networking-dns-resolution-recursive-iterative",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-networking"
    ],
    "difficulty": "Junior",
    "question": "كيف تجري دورة حياة دقة نظام أسماء النطاقات (DNS Resolution) وما الفرق بين الاستعلامات المتكررة والمتتالية؟",
    "shortAnswer": "يقوم DNS بترجمة أسماء النطاقات البشرية (example.com) إلى عناوين IP رقمية؛ في الاستعلام التكراري (Recursive) يتولى الخادم الوسيط جلب الإجابة الكاملة للعميل، بينما في الاستعلام المتتالي (Iterative) يوجه الخادم السائل إلى الخادم التالي في التسلسل الهرمي.",
    "explanation": "عند كتابة رابط في المتصفح: (1) فحص الكاش المحلي في المتصفح ثم نظام التشغيل ثم الروتر. (2) إرسال استعلام لمحلل DNS لمزود الإنترنت (DNS Resolver). (3) يستعلم المحلل خوادم الجذر (Root Servers) التي توجهه لخوادم نطاق المستوى الأعلى (.com TLD Servers). (4) يوجه خادم TLD المحلل إلى خادم الأسماء المعتمد للنطاق (Authoritative Name Server). (5) يجلب المحلل سجل A ويحفظه في الكاش وفقاً لـ TTL ويرسله للمتصفح ليبدأ الاتصال.",
    "codeExample": "// مسار دقة الـ DNS الهرمي:\n// Browser -> Local Cache -> DNS Resolver -> Root (.) -> TLD (.com) -> Authoritative (example.com) -> IP",
    "commonMistakes": [
      "ضبط قيمة TTL (Time to Live) طويلة جداً في سجلات الـ DNS قبل إجراء عملية نقل أو ترقية لخوادم الموقع، مما يؤدي لبقاء الزوار عالقين في السيرفرات القديمة لساعات."
    ],
    "followUpQuestions": [
      "ما الفرق بين أنواع سجلات DNS الأساسية: A و AAAA و CNAME و MX و TXT؟"
    ],
    "sources": [
      {
        "title": "Domain Name System - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Domain_Name_System"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fnet-006",
    "slug": "networking-websockets-vs-long-polling-sse",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-networking"
    ],
    "difficulty": "Mid",
    "question": "قارن بين تقنيات الاتصال اللحظي: WebSockets و Server-Sent Events (SSE) و Long Polling ومتى تختار كلاً منها؟",
    "shortAnswer": "الـ WebSockets يوفر اتصالاً ثنائي الاتجاه كاملاً (Full-Duplex) فوق اتصال TCP واحد مستمر، والـ SSE يوفر تدفقاً أحادي الاتجاه من الخادم للعميل فوق HTTP القياسي، والـ Long Polling يعتمد على إبقاء طلبات HTTP معلقة حتى تتوفر بيانات جديدة.",
    "explanation": "إذا كان التطبيق يتطلب تواصلاً سريعاً في الاتجاهين (مثل غرف الدردشة الجماعية، الألعاب متعددة اللاعبين، والبورصات اللحظية)، فالـ WebSockets هو الخيار الأفضل لأنه يزيل ترويسات HTTP المتكررة. إذا كان التطبيق يتطلب بث بيانات من الخادم فقط دون إرسال من العميل (مثل أسعار العملات، إشعارات التطبيق، وتدفق نصوص ChatGPT)، فالـ SSE ممتاز وبسيط للغاية ويدعم إعادة الاتصال التلقائي ومرور الجدران النارية والبروكسيات بسهولة عبر HTTP.",
    "codeExample": "// WebSockets: ثنائي الاتجاه (Client <───> Server) عبر ws:// أو wss://\n// SSE: أحادي الاتجاه (Server ───> Client) عبر Content-Type: text/event-stream\n// Long Polling: طلبات متتالية تنتظر الرد وتفتح طلباً جديداً فوراً",
    "commonMistakes": [
      "استخدام WebSockets لبث إشعارات بسيطة أحادية الاتجاه، مما يضيف تعقيداً في الحفاظ على الـ Handshake وإدارة الخوادم وحجب الـ Proxies بدون داع."
    ],
    "followUpQuestions": [
      "كيف تمنع تسريبات اتصالات الـ WebSockets الخاملة عبر آلية Heartbeats (Ping/Pong Frames)؟"
    ],
    "sources": [
      {
        "title": "WebSockets API - MDN Web Docs",
        "url": "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fnet-007",
    "slug": "networking-rest-api-principles-idempotency",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-networking"
    ],
    "difficulty": "Junior",
    "question": "ما هي مبادئ معمارية REST وما معنى أن تكون العملية متكررة النتائج (Idempotent)؟",
    "shortAnswer": "تعتمد REST على بنية عميل/خادم عديمة الحالة (Stateless)، وموارد محددة بروابط URI موحدة، واستخدام أفعال HTTP القياسية؛ وتكون العملية Idempotent إذا كان تكرار تنفيذها N مرة ينتج نفس الحالة النهائية للنظام تماماً كمرة واحدة.",
    "explanation": "أفعال GET و PUT و DELETE و HEAD و OPTIONS كلها Idempotent؛ فإذا حذفت المورد DELETE /users/42 عشر مرات، فإن النتيجة النهائية على قاعدة البيانات هي حذف المستخدم ولا يختلف أثره في المرة الثانية عن الأولى. بينما يعتبر POST غير متكرر النتائج (Non-Idempotent)؛ لأن إرساله مرتين سينشئ سجلين أو معاملتين ماليتين مكررتين ما لم يُحمى بمفتاح عدم تكرار (Idempotency Key).",
    "codeExample": "// GET, PUT, DELETE: Idempotent (آمن للتكرار عند انقطاع الشبكة)\n// POST: Non-Idempotent (يتطلب حماية مفتاح idempotency-key)",
    "commonMistakes": [
      "استخدام أفعال GET لتعديل أو حذف البيانات في السيرفر (مثل /delete-user?id=5)، مما يسمح لمحركات البحث والـ Prefetching بحذف بيانات المستخدمين دون قصد!"
    ],
    "followUpQuestions": [
      "ما هو معيار HATEOAS (Hypermedia as the Engine of Application State) وأعلى درجات نضج ريتشاردسون (Richardson Maturity Model)؟"
    ],
    "sources": [
      {
        "title": "Representational state transfer - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/REST"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fnet-008",
    "slug": "networking-cors-preflight-options-headers",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-networking"
    ],
    "difficulty": "Junior",
    "question": "ما هي آلية مشاركة الموارد عبر الأصول (CORS) ولماذا يرسل المتصفح طلب Preflight من نوع OPTIONS تلقائياً؟",
    "shortAnswer": "الـ CORS هي آلية أمان تطبقها المتصفحات لمنع مواقع خبيثة من قراءة بيانات موقعك، ويرسل المتصفح طلب Preflight استطلاعي بنوع OPTIONS للتأكد من موافقة السيرفر قبل إرسال الطلبات المعدلة أو المعقدة.",
    "explanation": "سياسة الأصل الواحد (Same-Origin Policy - SOP) تمنع السكريبت من نطاق foo.com من قراءة استجابة api.bar.com. إذا كان الطلب معقداً (يستخدم PUT/DELETE، أو ترويسات مخصصة مثل Authorization، أو Content-Type غير تقليدي مثل application/json)، يرسل المتصفح أولاً طلب OPTIONS يحتوي على Access-Control-Request-Method. إذا رد الخادم بترويسات قبول متوافقة (Access-Control-Allow-Origin)، يرسل المتصفح الطلب الفعلي، وإلا يمنعه ويرمي خطأ في الكونسول.",
    "codeExample": "// استجابة السيرفر المسموح بها:\nAccess-Control-Allow-Origin: https://myapp.com\nAccess-Control-Allow-Methods: GET, POST, PUT, DELETE\nAccess-Control-Allow-Headers: Authorization, Content-Type",
    "commonMistakes": [
      "وضع Access-Control-Allow-Origin: * جنباً إلى جنب مع السماح بملفات تعريف الارتباط credentials: true، وهو أمر يحظره المتصفح تماماً لأسباب أمنية."
    ],
    "followUpQuestions": [
      "لماذا تفشل استدعاءات API من متصفح الويب بسبب CORS بينما تنجح نفس الاستدعاءات 100% من تطبيق الهاتف أو أداة Postman؟"
    ],
    "sources": [
      {
        "title": "Cross-Origin Resource Sharing (CORS) - MDN",
        "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fnet-009",
    "slug": "networking-security-mitm-syn-flood-ddos",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-networking"
    ],
    "difficulty": "Senior",
    "question": "كيف تحدث هجمات الرجل في المنتصف (MITM) وهجمات إغراق المزامنة (SYN Flood) وكيف تعمل تقنية SYN Cookies؟",
    "shortAnswer": "تحدث هجمات MITM عند اعتراض وتعديل البيانات بين طرفين دون علمهما ويحميها التشفير والشهادات الموثوقة، وهجمات SYN Flood تغرق الخادم بطلبات اتصال وهمية لملء طابور الاتصالات واستنزاف موارده.",
    "explanation": "في هجوم SYN Flood، يرسل المهاجم ملايين حزم SYN بعناوين IP وهمية (Spoofed IPs)، فيرد الخادم بـ SYN-ACK وينتظر رد ACK النهائي واضعاً الاتصال في طابور نصف المكتمل (SYN Queue / Backlog). تمتلئ ذاكرة الخادم ويتوقف عن استقبال أي مستخدم حقيقي. تعالج تقنية SYN Cookies ذلك بعبقرية: لا يخصص الخادم أي ذاكرة على الإطلاق في البداية! بل يشفر بيانات الاتصال والوقت في الرقم التسلسلي المبدئي (Initial Sequence Number)، وعندما يرد العميل الشرعي بـ ACK، يتحقق الخادم من صحة التشفير حسابياً ويفتح الاتصال فوراً.",
    "codeExample": "// SYN Cookies تشفر حالة الاتصال رياضياً داخل Sequence Number بدلاً من حجز ذاكرة الخادم",
    "commonMistakes": [
      "تعطيل فحص الشهادات الرقمية (SSL Verification) في بيئة التطوير ونسيان إعادة تفعيله في الإنتاج، مما يجعل التطبيق عرضة فورية لاختراق MITM."
    ],
    "followUpQuestions": [
      "كيف تحمي شبكات Anycast وموزعات الحماية العالمية مثل Cloudflare من هجمات الحرمان من الخدمة الموزعة (DDoS)؟"
    ],
    "sources": [
      {
        "title": "SYN cookies - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/SYN_cookies"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fnet-010",
    "slug": "networking-cdn-edge-caching-anycast-routing",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-networking"
    ],
    "difficulty": "Mid",
    "question": "كيف تعمل شبكات توصيل المحتوى (CDNs) وكيف توجه تقنية Anycast Routing المستخدمين لأقرب خادم حافة (Edge Server)؟",
    "shortAnswer": "توزع الـ CDNs المحتوى الثابت والوسائط جغرافياً على مئات الخوادم المحيطة بالمستخدمين؛ وتعلن تقنية Anycast عن نفس عنوان الـ IP من عشرات المواقع عالمياً ليوجه بروتوكول BGP الزائر لأقرب نقطة بأقل زمن تأخير.",
    "explanation": "في التوجيه التقليدي (Unicast)، يملك السيرفر عنوان IP فريد في مكان واحد، مما يعني أن مستخدم اليابان سيعاني من تأخير 250 مللي ثانية للوصول لخادم في نيويورك. باستخدام Anycast وشبكات CDN (مثل Cloudflare و Fastly)، يعلن كل خادم حافة محلي عن نفس الـ IP، فتقوم راوترات الإنترنت بتوجيه حزم المستخدم لأقرب سيرفر على بعد بضعة كيلومترات (Edge Node) في 5 مللي ثانية فقط، مما يخفف الحمل عن الخادم الأصلي (Origin) بنسبة 90% ويوفر حماية ضخمة ضد هجمات الـ DDoS.",
    "codeExample": "// المستخدم يطلب الصورة -> يتصل بـ Anycast Edge محلي في ثوان -> إن كانت في الكاش تُسلم فوراً\n// إن لم تكن في الكاش -> يجلبها الحافة من الـ Origin مرة واحدة ويخزنها للبقية",
    "commonMistakes": [
      "نسيان إضافة ترويسات Cache-Control: no-cache لملفات HTML أو نقاط الـ API الحساسة، مما يؤدي لتخزين بيانات شخصية للعملاء وتوزيعها لزوار آخرين عبر الـ CDN."
    ],
    "followUpQuestions": [
      "كيف تعمل ميزة Edge Functions و Cloudflare Workers لتنفيذ كود برمجي عند الحافة بالقرب من المستخدم؟"
    ],
    "sources": [
      {
        "title": "Content delivery network - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Content_delivery_network"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "ftst-001",
    "slug": "testing-pyramid-unit-integration-e2e-cost-ratio",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-testing"
    ],
    "difficulty": "Junior",
    "question": "ما هو هرم الاختبارات (The Test Pyramid) وما هو التوازن المثالي بين اختبارات الوحدة، التكامل، والاختبارات الشاملة (E2E)؟",
    "shortAnswer": "يقترح هرم الاختبارات قاعدة عريضة من اختبارات الوحدة السريعة والرخيصة في الأسفل، تليها اختبارات التكامل في المنتصف، وقمة مدببة من الاختبارات الشاملة (E2E) المعقدة والبطيئة.",
    "explanation": "اختبارات الوحدة (Unit Tests) تختبر دوال وفئات معزولة بالميكروثانية وتمنح تشخيصاً لحظياً دقيقاً لمكان الخطأ ورخيصة الصيانة. اختبارات التكامل (Integration Tests) تتحقق من سلامة تفاعل عدة مكونات حقيقية معاً (مثل الخدمة مع قاعدة البيانات). أما اختبارات E2E فتحاكي المستخدم الحقيقي في المتصفح؛ وهي ممتازة لزرع الثقة قبل الشحن ولكنها بطيئة جداً ومكلفة وعرضة للاهتزاز (Flakiness). الاعتماد على هرم مقلوب (Ice Cream Cone Anti-pattern) يقتل سرعة فرق التطوير.",
    "codeExample": "// Test Pyramid:\n//       /\\    E2E (بطيء، مكلف، ثقة شاملة)\n//      /  \\   Integration (متوسط السرعة والتكلفة)\n//     /____\\  Unit Tests (فائق السرعة، رخيص، تغطية شاملة)",
    "commonMistakes": [
      "كتابة معظم الاختبارات كـ E2E متجاهلين اختبارات الوحدة، مما يجعل بناء الـ CI/CD يستغرق ساعات طويلة ويفشل عشوائياً."
    ],
    "followUpQuestions": [
      "ما هو نموذج قرص العسل (Testing Honeycomb) المفضل في بنية المايكروسيرفس بدلاً من الهرم التقليدي؟"
    ],
    "sources": [
      {
        "title": "Martin Fowler — The Practical Test Pyramid",
        "url": "https://martinfowler.com/articles/practical-test-pyramid.html"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "ftst-002",
    "slug": "testing-tdd-red-green-refactor-cycle",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-testing"
    ],
    "difficulty": "Junior",
    "question": "ما هي الدورة الثلاثية للتطوير الموجه بالاختبارات (TDD: Red-Green-Refactor) وما هي ميزتها التصميمية وليست الاختبارية فقط؟",
    "shortAnswer": "تبدأ بكتابة اختبار صغير يفشل أولاً (Red)، ثم كتابة أقل كود كافٍ لنجاح الاختبار (Green)، ثم إعادة تحسين وهيكلة الكود وتنظيفه مع ضمان بقاء الاختبار ناجحاً (Refactor).",
    "explanation": "الميزة الكبرى لـ TDD ليست مجرد فحص الأخطاء، بل هي أداة تصميم هندسي (Design Feedback Tool). عندما تكتب الاختبار قبل الكود، فإنك تجبر نفسك على التفكير كمستخدم للواجهة البرمجية (API Consumer) وليس كصانع لها، مما ينتج واجهات بديهية وسهلة الاستخدام ووحدات مفكوكة الارتباط بطبيعتها وقابلة للاختبار (Testable by design).",
    "codeExample": "// 1. Red: اكتب اختباراً يستدعي دالة غير موجودة بعد -> يفشل\n// 2. Green: اكتب الدالة بأبسط شكل ممكن حتى يمر الاختبار\n// 3. Refactor: أزل التكرار وحسن التسميات ونظم الكود مع الحفاظ على اللون الأخضر",
    "commonMistakes": [
      "تجاهل خطوة الـ Refactor بعد النجاح (Green) والقفز للمهمة التالية، مما يترك الكود مليئاً بالترقيعات السريعة وتراكم الديون الفنية."
    ],
    "followUpQuestions": [
      "ما الفرق بين أسلوب مدرسة شيكاغو (Classicist/Detroit TDD) ومدرسة لندن (Mockist/London TDD)؟"
    ],
    "sources": [
      {
        "title": "Test-driven development - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Test-driven_development"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "ftst-003",
    "slug": "testing-doubles-taxonomy-dummy-stub-fake-mock-spy",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-testing"
    ],
    "difficulty": "Mid",
    "question": "اشرح تصنيف بدلاء الاختبار (Test Doubles) بحسب جيرارد ميسزاروس: ما الفرق بين Dummy و Stub و Fake و Mock و Spy؟",
    "shortAnswer": "البدلاء هم كائنات تُستبدل في الاختبار بالتبعية الحقيقية: الـ Dummy لملء البارامترات فقط، والـ Stub يعيد إجابات ثابتة معدة مسبقاً، والـ Spy يسجل معلومات الاستدعاءات، والـ Mock يضع توقعات ويتحقق من السلوك، والـ Fake تطبيق حقيقي خفيف كقاعدة بيانات في الذاكرة.",
    "explanation": "الـ Dummy مثل كائن فارغ يُمرر لدالة تطلب 3 معاملات وأنت تحتاج واحداً فقط. الـ Stub يعيد دوماً true عند استدعاء isValid(). الـ Spy يراقب ويسجل: كم مرة استُدعيت دالة sendEmail() وما هي المعاملات التي مُررت لها. الـ Mock يحدد الشروط مسبقاً: 'أتوقع استدعاء save() مرة واحدة بالضبط'، ويفشل الاختبار إذا لم يُستدع. أما الـ Fake فهو تنفيذ يعمل بالكامل لكنه مبسط ولا يناسب الإنتاج، مثل فئة InMemoryUserRepository.",
    "codeExample": "// Fake: تطبيق شغال بالكامل في الذاكرة بدون قاعدة بيانات حقيقية\nclass FakeUserRepository implements UserRepository {\n  private users = new Map<string, User>();\n  async save(u: User) { this.users.set(u.id, u); }\n  async findById(id: string) { return this.users.get(id) ?? null; }\n}",
    "commonMistakes": [
      "الإفراط في استخدام الـ Mocks للتحقق من تفاصيل التنفيذ الداخلي للدوال بدلاً من التحقق من المخرجات والنتائج النهائية (State Verification vs Interaction Verification)."
    ],
    "followUpQuestions": [
      "لماذا يفضل مارتن فاولر استخدام الـ Fakes على الـ Mocks لتفادي كسر الاختبارات عند كل Refactoring بسيط؟"
    ],
    "sources": [
      {
        "title": "Martin Fowler — TestDouble",
        "url": "https://martinfowler.com/bliki/TestDouble.html"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "ftst-004",
    "slug": "testing-first-principles-unit-testing",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-testing"
    ],
    "difficulty": "Junior",
    "question": "ما هي مبادئ F.I.R.S.T الخمسة لكتابة اختبارات وحدة احترافية وموثوقة؟",
    "shortAnswer": "المبادئ هي: سريعة (Fast)، مستقلة (Independent)، قابلة للتكرار في أي بيئة (Repeatable)، ذاتية التحقق والنتيجة (Self-Validating)، وتُكتب في الوقت المناسب (Timely).",
    "explanation": "سريعة: يجب أن تعمل آلاف الاختبارات في ثوان لكي يكررها المطور مع كل تغيير. مستقلة: لا يجوز أن يعتمد اختبار على ناتج أو ترتيب اختبار آخر، وأي اختبار يجب أن يعمل منفرداً بنجاح. قابلة للتكرار: تنجح على جهاز المطور، على سيرفر الـ CI، وبدون اتصال بالإنترنت في أي وقت. ذاتية التحقق: ترجع نتيجة واضحة إما Pass أو Fail دون الحاجة لقراءة ملفات سجل أو فحص يدوي. مكتوبة في الوقت المناسب: تُكتب أثناء أو قبل كتابة كود الميزة وليس بعد أشهر من نسيان التفاصيل.",
    "codeExample": "// اختبار مستقل وسريع وذاتي التحقق:\ntest('calculates discount correctly', () => {\n  const cart = new Cart();\n  cart.add(new Item(100));\n  expect(cart.totalWithDiscount(0.1)).toBe(90);\n});",
    "commonMistakes": [
      "كتابة اختبارات تعتمد على وجود سجل معين في قاعدة بيانات مشتركة أنشأه اختبار سابق، مما يسبب فشلها عند التشغيل المتوازي."
    ],
    "followUpQuestions": [
      "ما هي مشكلة الاختبارات المتسربة (Shared State Leaks) وكيف تعالجها دوال beforeEach و afterEach؟"
    ],
    "sources": [
      {
        "title": "F.I.R.S.T principles of testing",
        "url": "https://en.wikipedia.org/wiki/Unit_testing"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "ftst-005",
    "slug": "testing-code-coverage-vs-mutation-testing",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-testing"
    ],
    "difficulty": "Senior",
    "question": "لماذا تعتبر نسبة تغطية الكود (Code Coverage) مقياساً مضللاً أحياناً وما هي اختبارات الطفرات (Mutation Testing)؟",
    "shortAnswer": "تغطية الكود تقيس فقط الأسطر التي مر عليها التنفيذ دون التحقق من جودة وصحة الـ Assertions؛ بينما تقوم اختبارات الطفرات بحقن أخطاء متعمدة في الشفرة وتفحص قدرة الاختبارات على اكتشافها وقتلها (Kill Mutants).",
    "explanation": "يمكنك بسهولة الحصول على تغطية 100% بكتابة اختبار يستدعي كل الدوال دون كتابة سطر assert واحد! أدوات Mutation Testing (مثل Stryker أو Pitest) تقوم بتغيير الرموز في الكود المصدري سراً (تغيير > إلى <، حذف استدعاء دالة، أو استبدال true بـ false). إذا ظل الاختبار ناجحاً بعد هذا التغيير الخبيث، فهذا دليل على نجاة الطافرة (Survived Mutant) وضعف الاختبار وعدم فاعليته.",
    "codeExample": "// إذا غيرت أداة الطفرات: if (age >= 18) إلى if (age > 18)\n// ونجح الاختبار، فهذا يعني أن اختباراتك لم تغط حالة الحافة (Edge Case) عند age === 18!",
    "commonMistakes": [
      "اشتراط نسبة تغطية 100% في مسار الـ CI كهدف إداري، مما يدفع المطورين لكتابة اختبارات شكلية فارغة من الفحص الحقيقي لإرضاء النسبة فقط."
    ],
    "followUpQuestions": [
      "ما هي مقاييس Branch Coverage و Path Coverage وكيف تتفوق على Line Coverage البسيطة؟"
    ],
    "sources": [
      {
        "title": "Mutation testing - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Mutation_testing"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "ftst-006",
    "slug": "testing-flaky-tests-root-causes-mitigation",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-testing"
    ],
    "difficulty": "Mid",
    "question": "ما هي الاختبارات المتقلبة (Flaky Tests) وما هي أسبابها الجذرية وكيف تقضي عليها في بيئات الـ CI/CD؟",
    "shortAnswer": "هي الاختبارات التي تنجح وتفشل عشوائياً لنفس الكود دون أي تغيير؛ وتنتج عادة عن الاعتماد على توقيتات غير متزامنة، حالات مشتركة بين الاختبارات، أو تقلبات الاتصال الخارجي والشبكة.",
    "explanation": "تعتبر الاختبارات المتقلبة سماً قاتلاً لثقة الفريق؛ لأن المطورين يبدأون في تجاهل فشل الـ CI والضغط على زر 'Re-run' حتى يمر الاختبار صدفة. الأسباب وعلاجها: (1) استخدام sleep/delay زمني ثابت بدلاً من انتظار الشروط صراحة (Await Polling / waitFor). (2) بقاء بيانات في الذاكرة أو قاعدة البيانات بين الاختبارات وعلاجها بالتنظيف التام بعد كل اختبار. (3) التبعيات على خدمات خارجية واستبدالها بـ Mocks ومحاكيات محلية (مثل WireMock / Testcontainers).",
    "codeExample": "// خطأ يسبب Flakiness:\nawait sleep(1000); expect(result).toBeReady();\n// كود قوي ومستقر:\nawait waitFor(() => expect(result).toBeReady(), { timeout: 5000 });",
    "commonMistakes": [
      "إخفاء مشكلة الاختبار المتقلب بإضافة إعادة محاولة آلية (Auto-retry 3 times) في إعدادات الـ CI بدلاً من إصلاح السبب الجذري للسباق في التزامن."
    ],
    "followUpQuestions": [
      "ما هي استراتيجية الحجر الصحي للاختبارات (Test Quarantine) لحماية الفروع الرئيسية من الإيقاف العشوائي؟"
    ],
    "sources": [
      {
        "title": "Flaky tests in software engineering",
        "url": "https://en.wikipedia.org/wiki/Flaky_test"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "ftst-007",
    "slug": "testing-property-based-testing-vs-example-based",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-testing"
    ],
    "difficulty": "Senior",
    "question": "ما هو الاختبار القائم على الخصائص (Property-Based Testing) وكيف يكشف حالات الحافة المجهولة مقارنة بالاختبار القائم على الأمثلة؟",
    "shortAnswer": "بدلاً من فحص أمثلة ومدخلات محددة يكتبها المبرمج يدوياً، يحدد المبرمج خصائص عامة صادقة دائماً (Invariants) وتقوم أداة الاختبار بتوليد مئات الآلاف من المدخلات العشوائية والمتطرفة لاكتشاف أي كسر لتلك الخصائص.",
    "explanation": "في Example-based Testing، تفحص: sort([3, 1, 2]) == [1, 2, 3]. في Property-based Testing (مثل مكتبات QuickCheck أو Fast-Check)، نحدد الخصائص: (1) طول المصفوفة المرتبة يجب أن يطابق المصفوفة الأصلية. (2) كل عنصر يجب أن يكون <= العنصر التالي له. (3) كل عنصر في المصفوفة الأصلية موجود في الناتجة. تقوم الأداة بتوليد مصفوفات فارغة، سالبة، ضخمة، أو مكررة، وإذا وجدت خطأً، تقوم بتقليص المدخلات (Shrinking) للوصول لأصغر مدخل يسبب الانهيار.",
    "codeExample": "// خاصية الانعكاس في فك وضغط البيانات (Roundtrip property):\n// forall x: decompress(compress(x)) === x",
    "commonMistakes": [
      "الاعتماد فقط على الأمثلة الإيجابية السعيدة (Happy Path) وتجاهل القيم القصوى والرموز الخاصة والأرقام السالبة والقيم الفارغة."
    ],
    "followUpQuestions": [
      "كيف تساعد عملية التقليص (Shrinking) المبرمج في فهم سبب الخطأ العشوائي في ثوان معدودة؟"
    ],
    "sources": [
      {
        "title": "Property-based testing - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/QuickCheck"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "ftst-008",
    "slug": "testing-bdd-given-when-then-ubiquitous-language",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-testing"
    ],
    "difficulty": "Junior",
    "question": "ما هو التطوير الموجه بالسلوك (Behavior-Driven Development - BDD) وصيغة Given-When-Then؟",
    "shortAnswer": "هو تطور لـ TDD يهدف لتوحيد لغة التواصل بين المطورين ومحللي الأعمال باستخدام لغة دومين موحدة (Ubiquitous Language)، مع صياغة سيناريوهات الاختبار بصيغة Given (السياق) و When (الحدث) و Then (النتيجة المتوقعة).",
    "explanation": "تساعد صيغة Given-When-Then في جعل مواصفات الاختبار مفهومة لجميع الأطراف المعنية (مثل استخدام ملفات Gherkin في أدوات Cucumber). تصف Given الحالة الابتدائية للنظام (المستخدم مسجل دخول ورصيده 100)، وتصف When الإجراء الذي اتخذه المستخدم (قام بسحب 40)، وتصف Then الحالة النهائية للنظام (يصبح رصيده 60 ويتم إصدار إشعار بالسحب). هذا يضمن أن الفريق يبني الشيء الصحيح المطلوب للأعمال.",
    "codeExample": "Scenario: Successful withdrawal\n  Given a customer with balance of $100\n  When they request to withdraw $40\n  Then the remaining balance should be $60\n  And they should receive $40 cash",
    "commonMistakes": [
      "كتابة تفاصيل تقنية سطحية في سيناريوهات BDD (مثل: Given I click on button with id #submit_btn)، مما يفقدها هدفها الدوميني."
    ],
    "followUpQuestions": [
      "كيف تترجم أدوات مثل Cucumber و SpecFlow سيناريوهات النصوص الطبيعية إلى دوال برمجية قابلة للتنفيذ؟"
    ],
    "sources": [
      {
        "title": "Behavior-driven development - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Behavior-driven_development"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "ftst-009",
    "slug": "testing-contract-testing-microservices-pact",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-testing"
    ],
    "difficulty": "Senior",
    "question": "ما هي اختبارات التعاقد (Contract Testing) وكيف تحمي خدمات المايكروسيرفس الموزعة دون الحاجة لتشغيل بيئات E2E مجمعة؟",
    "shortAnswer": "تتحقق اختبارات التعاقد من توافق واجهات الـ API بين المستهلك (Consumer) والمزود (Provider) بشكل مستقل ومنفصل دون الحاجة لتشغيل النظام الموزع بالكامل في بيئة اختبار موحدة.",
    "explanation": "في معمارية المايكروسيرفس، تشغيل 50 خدمة معاً لاختبارات E2E بطيء جداً وغير مستقر ومكلف. بدلاً من ذلك، في Consumer-Driven Contract Testing (باستخدام أدوات مثل Pact)، يكتب المستهلك اختباراً يحدد ما يتوقعه من المزود (عقد Contract بصيغة JSON). يُرسل هذا العقد لوسيط (Pact Broker)، ثم يقوم المزود بتشغيل اختبار ضد هذا العقد للتحقق من التزامه به. إذا قام المزود بتغيير حقل حاسم يكسر المستهلك، يفشل بناء المزود فوراً قبل النشر دون أي حاجة لبيئات متصلة.",
    "codeExample": "// عقد المستهلك: أتوقع من GET /users/1 أن يعيد حقل 'fullName' بنوع string\n// المزود يختبر واجهته ضد هذا العقد ويضمن عدم كسر التطبيقات التابعة له",
    "commonMistakes": [
      "الاعتماد على افتراضات شفهية أو توثيق يدوي قديم بين فرق الـ Frontend والـ Backend، مما يؤدي لكسر الإنتاج عند النشر المستقل."
    ],
    "followUpQuestions": [
      "ما الفرق بين Consumer-Driven Contracts و Provider-Driven Contracts؟"
    ],
    "sources": [
      {
        "title": "Pact Contract Testing Documentation",
        "url": "https://en.wikipedia.org/wiki/Contract_testing"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "ftst-010",
    "slug": "testing-ci-cd-strategies-parallelization-splitting",
    "trackId": "fundamentals",
    "topicIds": [
      "fund-testing"
    ],
    "difficulty": "Mid",
    "question": "كيف تحسن زمن تنفيذ الاختبارات في مسارات التكامل المستمر (CI Pipelines) عبر التوازي وتقسيم الأحمال؟",
    "shortAnswer": "عبر تقسيم مجموعة الاختبارات الكبيرة إلى حزم متوازية تعمل على عدة خوادم في نفس الوقت (Test Parallelization / Matrix)، وتشغيل الاختبارات المتأثرة فقط بالتغيير الأخير (Test Impact Analysis).",
    "explanation": "إذا كان جناح الاختبارات يستغرق ساعة كاملة للعمل على خادم واحد، فإن دورة تسليم الكود تصبح بالغة البطء. الحلول الفعالة: (1) تقسيم الاختبارات عبر خوارزميات التوقيت التاريخي (Timing-based Test Splitting) لتوزيع الحزم بالتساوي بين 4 أو 8 عمال (Workers). (2) تشغيل اختبارات التكامل التي تتطلب قواعد بيانات باستخدام حاويات خفيفة معزولة في الذاكرة (tmpfs). (3) عزل واختبار الميزات عبر Test Impact Analysis لتشغيل الاختبارات المرتبطة فقط بالملفات المعدلة في الـ PR.",
    "codeExample": "// تكوين GitHub Actions لتقسيم الاختبارات على 4 أجهزة متوازية:\nstrategy:\n  matrix:\n    ci_node_total: [4]\n    ci_node_index: [0, 1, 2, 3]",
    "commonMistakes": [
      "تشغيل الاختبارات المتوازية على قاعدة بيانات واحدة مشتركة مما يسبب تصادم البيانات وفشل الاختبارات عشوائياً."
    ],
    "followUpQuestions": [
      "كيف تساهم أدوات Caching (مثل Nx أو Turborepo) في تخطي إعادة تشغيل الاختبارات التي لم تتغير مدخلاتها البرمجية؟"
    ],
    "sources": [
      {
        "title": "Continuous integration - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Continuous_integration"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  }
];
