// Generated for Flutter specialized expansion (Animations & Internals)
import type { InterviewQuestion } from "./questions.ts";

export const flutterExpansionBaseQuestions: Omit<InterviewQuestion, "translations">[] = [
  {
    "id": "fanim-001",
    "slug": "flutter-implicit-vs-explicit-animations",
    "trackId": "flutter",
    "topicIds": [
      "flutter-animations"
    ],
    "difficulty": "Junior",
    "question": "ما الفرق الأساسي بين الـ Implicit Animations والـ Explicit Animations في Flutter ومتى تختار كلاً منهما؟",
    "shortAnswer": "الـ Implicit Animations تدير الـ Controller تلقائياً بمجرد تغيير قيمة الـ Property (مثل AnimatedContainer)، بينما الـ Explicit تمنحك تحكماً كاملاً عبر AnimationController لبدء الحركة، إيقافها، عكسها، أو تكرارها.",
    "explanation": "تعتمد الـ Implicit Animations على ويدجتس جاهزة ترث من ImplicitlyAnimatedWidget، حيث تتولى إدارة مدة الحركة (Duration) والمنحنى (Curve) داخلياً بمجرد عمل rebuild بقيمة جديدة. أما الـ Explicit Animations فتتطلب TickerProviderStateMixin وإدارة يدوية لدورة حياة الـ AnimationController، وتُستخدم عند الحاجة لحركات معقدة، متزامنة، متكررة بلا نهاية (Looping)، أو مقيدة بإيماءات سحب المستخدم (Gesture-driven).",
    "codeExample": "// مثال Implicit Animation:\nAnimatedContainer(\n  duration: const Duration(milliseconds: 300),\n  curve: Curves.easeInOut,\n  width: isExpanded ? 200.0 : 100.0,\n  height: 50.0,\n  color: isExpanded ? Colors.blue : Colors.grey,\n)",
    "commonMistakes": [
      "بناء AnimationController مخصص ومعقد لحركة بسيطة جداً كتحريك العرض أو الشفافية، بينما يكفي استخدام AnimatedContainer أو AnimatedOpacity.",
      "نسيان استدعاء dispose() على الـ AnimationController في Explicit Animations مما يسبب تسريباً في الذاكرة (Memory Leak)."
    ],
    "followUpQuestions": [
      "كيف يعمل TweenAnimationBuilder لعمل حركة Implicit لأي قيمة مخصصة غير متوفرة في الويدجتس الجاهزة؟"
    ],
    "sources": [
      {
        "title": "Flutter Animations Overview",
        "url": "https://docs.flutter.dev/ui/animations"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fanim-002",
    "slug": "flutter-animation-controller-ticker-provider",
    "trackId": "flutter",
    "topicIds": [
      "flutter-animations"
    ],
    "difficulty": "Mid",
    "question": "ما هو دور الـ Ticker والـ TickerProvider (vsync) في تشغيل الحركات داخل Flutter؟",
    "shortAnswer": "الـ Ticker يُرسل إشعاراً مع كل فريم شاشة يطلبه المحرك (عادة 60 أو 120 هرتز)، والـ vsync يضمن ربط الـ Ticker بدورة حياة الشاشة لإيقاف تشغيل الحركة عند اختفاء الويدجت منعاً لهدر المعالج والبطارية.",
    "explanation": "يعمل TickerProvider كواجهة تمنح الـ AnimationController وصولاً إلى Ticker مربوط بالـ SchedulerBinding. يمنع استخدام vsync هدر الطاقة، فإذا كانت الشاشة الحالية مغطاة بشاشة أخرى في الـ Navigator أو غير مرئية، يتوقف الـ Ticker عن إطلاق الـ ticks. يتم استخدام SingleTickerProviderStateMixin عند وجود Controller واحد، أو TickerProviderStateMixin عند وجود عدة Controllers.",
    "codeExample": "class _PulseState extends State<PulseWidget> with SingleTickerProviderStateMixin {\n  late final AnimationController _controller = AnimationController(\n    duration: const Duration(seconds: 2),\n    vsync: this,\n  )..repeat(reverse: true);\n\n  @override\n  void dispose() {\n    _controller.dispose();\n    super.dispose();\n  }\n}",
    "commonMistakes": [
      "استخدام TickerProviderStateMixin بدلاً من SingleTickerProviderStateMixin عند استخدام وحدة تحكم واحدة، مما يضيف أعباء غير ضرورية.",
      "عدم تمرير vsync أو محاولة تهيئة الـ Controller قبل توفر الـ State المناسبة."
    ],
    "followUpQuestions": [
      "ما الفرق بين CurvedAnimation و Tween عند تطبيق التدرج على AnimationController؟"
    ],
    "sources": [
      {
        "title": "AnimationController API Documentation",
        "url": "https://api.flutter.dev/flutter/animation/AnimationController-class.html"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fanim-003",
    "slug": "flutter-animated-builder-vs-animated-widget",
    "trackId": "flutter",
    "topicIds": [
      "flutter-animations"
    ],
    "difficulty": "Mid",
    "question": "كيف يحسن AnimatedBuilder أداء الواجهة مقارنة بإعادة بناء الشجرة عبر setState() أثناء الحركة؟",
    "shortAnswer": "يقوم AnimatedBuilder بإعادة رسم وبناء الويدجت الفرعي المتحرك فقط في كل فريم، مع إمكانية تمرير الشجرة الثابتة كـ child جاهز يتم تفاديه تماماً من الـ Rebuild.",
    "explanation": "استدعاء addListener(() => setState(...)) على AnimationController يؤدي لإعادة استدعاء دالة build() للويدجت بالكامل 60 أو 120 مرة في الثانية، مما يهدر الـ CPU ويسبب سقوط الفريمات (Jank). في المقابل، يستمع AnimatedBuilder للـ Listenable مباشرة ويقتصر الـ rebuild على محتواه الداخلي فقط، وعند تمرير الـ child المعقد، لا يتم استدعاء بناء هذا الـ child نهائياً، بل يُعاد استخدامه في طبقة العرض مباشرة.",
    "codeExample": "AnimatedBuilder(\n  animation: _controller,\n  child: const HeavyComplexChildWidget(), // يتم بناؤه مرة واحدة فقط!\n  builder: (context, child) {\n    return Transform.scale(\n      scale: _animation.value,\n      child: child, // يعاد استخدامه دون إعادة بنائه\n    );\n  },\n)",
    "commonMistakes": [
      "بناء الويدجت الثابت داخل دالة builder الخاصة بـ AnimatedBuilder بدلاً من تمريره عبر معامل child، مما يهدر ميزة الأداء بالكامل."
    ],
    "followUpQuestions": [
      "متى تفضل إنشاء ويدجت مستقل يرث من AnimatedWidget بدلاً من AnimatedBuilder؟"
    ],
    "sources": [
      {
        "title": "AnimatedBuilder class documentation",
        "url": "https://api.flutter.dev/flutter/widgets/AnimatedBuilder-class.html"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fanim-004",
    "slug": "flutter-staggered-animations-interval-curves",
    "trackId": "flutter",
    "topicIds": [
      "flutter-animations"
    ],
    "difficulty": "Senior",
    "question": "كيف تصمم حركة متسلسلة (Staggered Animation) متناسقة باستخدام AnimationController واحد و Interval curves؟",
    "shortAnswer": "عبر تقسيم المجال الزمني للـ AnimationController الواحد (من 0.0 إلى 1.0) إلى فترات زمنية متداخلة أو متتالية باستخدام فئات CurvedAnimation المزودة بـ Interval(start, end, curve).",
    "explanation": "بدلاً من إنشاء AnimationController منفصل لكل عنصر وتنسيق توقيتاتها يدوياً، تُبنى حركات Staggered باستخدام Controller رئيسي واحد. يتم تعريف Animations متعددة (للشفافية، الموقع، القياس) وكل منها مربوط بـ CurvedAnimation تحدد Interval مثل Interval(0.0, 0.5) للأول و Interval(0.4, 1.0) للثاني. هذا يضمن تزامن الحركات بدقة متناهية وسهولة إدارتها وعكسها ككتلة متحدة.",
    "codeExample": "final opacityAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(\n  CurvedAnimation(\n    parent: controller,\n    curve: const Interval(0.0, 0.4, curve: Curves.easeIn),\n  ),\n);\nfinal slideAnimation = Tween<Offset>(begin: const Offset(0, 1), end: Offset.zero).animate(\n  CurvedAnimation(\n    parent: controller,\n    curve: const Interval(0.3, 1.0, curve: Curves.easeOutCubic),\n  ),\n);",
    "commonMistakes": [
      "محاولة إنشاء عشرات وحدات التحكم المنفصلة وربطها بـ await Future.delayed()، مما يؤدي لتعقيد شديد وفقدان التزامن وسلوك غير مستقر عند إلغاء الحركة."
    ],
    "followUpQuestions": [
      "كيف يؤثر تغيير مدة الـ AnimationController الكلية تلقائياً على سرعة كافة الأجزاء داخل الـ Intervals؟"
    ],
    "sources": [
      {
        "title": "Staggered Animations tutorial",
        "url": "https://docs.flutter.dev/ui/animations/staggered-animations"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fanim-005",
    "slug": "flutter-hero-transitions-flight-shuttle",
    "trackId": "flutter",
    "topicIds": [
      "flutter-animations"
    ],
    "difficulty": "Mid",
    "question": "كيف تعمل ويدجت Hero في Flutter وما هو دور flightShuttleBuilder و createRectTween؟",
    "shortAnswer": "تنشئ Hero حركة انتقال سلسة لعنصر مشترك بين مسارين في الـ Navigator عبر نقله في طبقة الـ Overlay؛ ويتحكم flightShuttleBuilder في شكل العنصر أثناء الطيران بينما يحدد createRectTween مسار الحركة الفيزيائي.",
    "explanation": "عند الانتقال بين شاشتين تحتويان على ويدجت Hero بنفس الـ tag، يقوم الـ HeroController بحساب إحداثيات ومقاسات العنصر في المسار الأصلي والمسار الجديد. بعد ذلك ينشئ العنصر في طبقة الـ Overlay المشتركة ويحركه عبر RectTween. يتيح flightShuttleBuilder تخصيص مظهر العنصر أثناء الطيران (مثلاً لإخفاء نصوص أو تغيير زوايا التدوير)، بينما يتيح createRectTween تغيير مسار الحركة من خط مستقيم إلى مسار منحني أو قوسي (مثل MaterialRectArcTween).",
    "codeExample": "Hero(\n  tag: 'avatar-user-42',\n  createRectTween: (begin, end) => MaterialRectArcTween(begin: begin, end: end),\n  flightShuttleBuilder: (flightContext, animation, direction, fromContext, toContext) {\n    return const CircleAvatar(radius: 40, backgroundColor: Colors.teal);\n  },\n  child: const CircleAvatar(radius: 40),\n)",
    "commonMistakes": [
      "تكرار نفس الـ Hero tag في نفس الشاشة، مما يسبب استثناءً صريحاً وتوقف الـ Transition.",
      "استخدام Hero لعناصر ضخمة ومعقدة تحتوي على State داخلي معقد قد يفقد حالته أثناء الطيران في الـ Overlay."
    ],
    "followUpQuestions": [
      "كيف تتفادى مشاكل تشوه الخطوط والنصوص (Text distortion) أثناء انتقال الـ Hero؟"
    ],
    "sources": [
      {
        "title": "Hero Animations guide",
        "url": "https://docs.flutter.dev/ui/animations/hero-animations"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fanim-006",
    "slug": "flutter-custom-painter-canvas-should-repaint",
    "trackId": "flutter",
    "topicIds": [
      "flutter-animations"
    ],
    "difficulty": "Senior",
    "question": "ما هي اعتبارات الأداء القصوى عند استخدام CustomPainter وما الذي يتحكم به shouldRepaint()؟",
    "shortAnswer": "يحدد shouldRepaint() ما إذا كانت هناك حاجة لإعادة تنفيذ أوامر الرسم على الـ Canvas عند إعادة البناء؛ وعدم التحقق الدقيق من الحقول يؤدي لإعادة رسم فادحة وغير مبررة تستهلك الـ GPU.",
    "explanation": "ينفذ CustomPainter أوامر رسم منخفضة المستوى عبر RenderCustomPaint. دالة paint() تستقبل Canvas و Size. للوصول لأعلى أداء: (1) يجب إنشاء كائنات Paint ومسارات Path خارج دالة paint() وتفادي إنشاء كائنات جديدة في كل فريم. (2) يجب أن تقارن shouldRepaint() القيم الحقيقية المؤثرة على الرسم وترجع false إذا لم تتغير. (3) وضع الـ CustomPaint داخل RepaintBoundary لعزل الطبقة الرسومية عن شجرة الواجهة المحيطة.",
    "codeExample": "class CircleProgressPainter extends CustomPainter {\n  final double progress;\n  final Color color;\n  CircleProgressPainter({required this.progress, required this.color});\n\n  @override\n  void paint(Canvas canvas, Size size) {\n    final paint = Paint()..color = color..strokeWidth = 4.0..style = PaintingStyle.stroke;\n    canvas.drawCircle(size.center(Offset.zero), size.width / 2, paint);\n  }\n\n  @override\n  bool shouldRepaint(covariant CircleProgressPainter oldDelegate) {\n    return oldDelegate.progress != progress || oldDelegate.color != color;\n  }\n}",
    "commonMistakes": [
      "إرجاع true دائماً من shouldRepaint() ظناً أنها ممارسة آمنة، مما يجبر المحرك على إعادة استهلاك الموارد الرسومية مع كل rebuild.",
      "تخصيص ذاكرة وإنشاء مصفوفات ومسارات ضخمة داخل دالة paint() المكررة في كل فريم."
    ],
    "followUpQuestions": [
      "متى نحتاج لتنفيذ دالة shouldRebuildSemantics في الـ CustomPainter لتسهيل إمكانية الوصول؟"
    ],
    "sources": [
      {
        "title": "CustomPainter class API",
        "url": "https://api.flutter.dev/flutter/rendering/CustomPainter-class.html"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fanim-007",
    "slug": "flutter-physics-based-simulations-spring",
    "trackId": "flutter",
    "topicIds": [
      "flutter-animations"
    ],
    "difficulty": "Senior",
    "question": "كيف تبني حركات تفاعلية قائمة على المحاكاة الفيزيائية (Physics-based simulation) مثل النوابض (Springs)؟",
    "shortAnswer": "باستخدام AnimationController.animateWith() وتمرير محاكاة فيزيائية مشتقة من Simulation مثل SpringSimulation مع تحديد الكتلة والصلابة ونسبة التخميد.",
    "explanation": "على عكس الحركات المعتمدة على وقت محدد مسبقاً (Duration-based)، تنتهي الحركات الفيزيائية عندما تفقد الطاقة وتستقر فيزيائياً. تتيح SpringSimulation تحديد mass (الكتلة)، stiffness (صلابة النابض)، و damping (التخميد). هذا النمط هو الأساس لبناء تجارب لمس مذهلة تحاكي الواقع وتستجيب لسرعة سحب إصبع المستخدم (Fling velocity).",
    "codeExample": "void _runSpring(double velocity) {\n  final spring = SpringDescription(mass: 1.0, stiffness: 100.0, damping: 10.0);\n  final simulation = SpringSimulation(spring, _controller.value, 1.0, velocity);\n  _controller.animateWith(simulation);\n}",
    "commonMistakes": [
      "محاولة محاكاة ارتداد واقعي عبر منحنيات Curves.bounceOut الثابتة بدلاً من استخدام فيزياء حقيقية تأخذ سرعة السحب اللحظية في الحسبان."
    ],
    "followUpQuestions": [
      "كيف تستفيد ويدجت InteractiveViewer من ClampingScrollSimulation و FrictionSimulation لدعم التكبير والتصغير الفيزيائي؟"
    ],
    "sources": [
      {
        "title": "Animate a widget using a physics simulation",
        "url": "https://docs.flutter.dev/cookbook/animation/physics-simulation"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fanim-008",
    "slug": "flutter-page-route-builder-custom-transitions",
    "trackId": "flutter",
    "topicIds": [
      "flutter-animations"
    ],
    "difficulty": "Mid",
    "question": "كيف تبني انتقالات مخصصة بين الشاشات باستخدام PageRouteBuilder و transitionsBuilder؟",
    "shortAnswer": "من خلال استبدال MaterialPageRoute بـ PageRouteBuilder وتمرير دالة transitionsBuilder التي تستقبل الـ animation والـ secondaryAnimation لتطبيق مؤثرات مثل الانزلاق والتلاشي.",
    "explanation": "يوفر PageRouteBuilder طريقة تصريحية لإنشاء مسار جديد دون الالتزام بسلوك النظام الافتراضي (مثل انتقال iOS الساحب أو انتقال Android التكبيري). توفر دالة transitionsBuilder متغيرين للأنيميشن: animation للشاشة القادمة، و secondaryAnimation للشاشة الحالية عند مغادرتها، مما يتيح تنسيق تأثيرات ثنائية مذهلة للشاشتين معاً.",
    "codeExample": "Navigator.of(context).push(\n  PageRouteBuilder(\n    pageBuilder: (context, animation, secondaryAnimation) => const DetailsScreen(),\n    transitionsBuilder: (context, animation, secondaryAnimation, child) {\n      const begin = Offset(1.0, 0.0);\n      final tween = Tween(begin: begin, end: Offset.zero).chain(CurveTween(curve: Curves.easeInOut));\n      return SlideTransition(position: animation.drive(tween), child: child);\n    },\n  ),\n);",
    "commonMistakes": [
      "بناء هيكل الصفحة المعقدة داخل transitionsBuilder بدلاً من pageBuilder، مما يؤدي لإعادة بنائها مع كل حركة فريم."
    ],
    "followUpQuestions": [
      "كيف تدعم إيماءة الرجوع بالسحب من الحافة (Cupertino swipe-back gesture) عند استخدام مسار مخصص؟"
    ],
    "sources": [
      {
        "title": "PageRouteBuilder class API",
        "url": "https://api.flutter.dev/flutter/widgets/PageRouteBuilder-class.html"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fanim-009",
    "slug": "flutter-repaint-boundary-animation-performance",
    "trackId": "flutter",
    "topicIds": [
      "flutter-animations"
    ],
    "difficulty": "Senior",
    "question": "ما هو دور RepaintBoundary في تسريع الحركات المعقدة ومنع إعادة رسم أجزاء الشاشة الثابتة؟",
    "shortAnswer": "تنشئ RepaintBoundary طبقة عرض منفصلة (Render Layer) في الـ Render Tree، مما يمنع انتقال إشارة الرسم غير الصالح (Paint Dirty Flag) إلى الـ Parent وباقي عناصر الشاشة.",
    "explanation": "افتراضياً في شجرة الرندر، عندما يطلب RenderObject إعادة الرسم عبر markNeedsPaint()، يصعد الطلب إلى أقرب سلف يمتلك Repaint Boundary ليعاد رسم كامل تلك الشجرة. عند تشغيل حركة مستمرة لعنصر ما، يتم إعادة رسم الشاشة بأكملها إن لم يُحط العنصر بـ RepaintBoundary. تغليف العنصر المتحرك بـ RepaintBoundary يعزله في Display List مستقلة، فيعيد الـ GPU رسم هذا الجزء فقط دون لمس الخلفية أو القوائم المحيطة.",
    "codeExample": "// عزل العداد أو المؤشر المتحرك عن بقية الصفحة المعقدة:\nRepaintBoundary(\n  child: ComplexAnimatedIndicator(value: animation.value),\n)",
    "commonMistakes": [
      "الإفراط في استخدام RepaintBoundary على عناصر بسيطة جداً، حيث يستهلك إنشاء الطبقات المستقلة ذاكرة إضافية وقد يضر الأداء إن استُخدم بلا حاجة."
    ],
    "followUpQuestions": [
      "كيف يساعد مؤشر debugRepaintRainbowEnabled في أدوات مطوري Flutter في اكتشاف مشاكل إعادة الرسم الزائدة؟"
    ],
    "sources": [
      {
        "title": "RepaintBoundary class documentation",
        "url": "https://api.flutter.dev/flutter/widgets/RepaintBoundary-class.html"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fanim-010",
    "slug": "flutter-lottie-rive-vs-code-animations",
    "trackId": "flutter",
    "topicIds": [
      "flutter-animations"
    ],
    "difficulty": "Mid",
    "question": "متى تستخدم مكتبات المتجهات مثل Rive و Lottie في مقابل كتابة الحركات برمجياً بكود Flutter الخالص؟",
    "shortAnswer": "تُستخدم Rive و Lottie للرسوم التوضيحية الفنية المعقدة والحركات الفيكتورية التفاعلية المصممة عبر برامج تصميم، بينما تُفضل الحركات الكودية الخالصة للـ Micro-interactions البسيطة وعناصر واجهة المستخدم القابلة للتخصيص الديناميكي.",
    "explanation": "تعتمد Lottie على تصدير ملفات JSON من Adobe After Effects ويتم تفسيرها في وقت التشغيل عبر مسارات Canvas، وقد تستهلك معالجة مكثفة في الحركات الضخمة. بينما تعمل Rive عبر State Machines مدمجة ومحرك رسم منخفض المستوى عالي الأداء يدعم تفاعل العناصر مع إيماءات اللمس وإحداثيات المؤشر في وقت التشغيل. في المقابل، توفر حركات Flutter الكودية أصغر حجم حزمة وتكاملاً تاماً مع ثيمات التطبيق وقياسات الشاشات المختلفة دون اعتمادات خارجية.",
    "codeExample": "// استخدام Rive مع آلة الحالة (State Machine) للتفاعل مع اللمس:\n// RiveAnimation.asset('assets/button.riv', stateMachines: ['ButtonStateMachine'])",
    "commonMistakes": [
      "استخدام Lottie لتحريك عناصر بسيطة كأيقونات التحميل الدائرية أو أزرار التبديل، مما يضخم حجم التطبيق واستهلاك الذاكرة دون مبرر."
    ],
    "followUpQuestions": [
      "كيف تختلف طريقة تصيير Rive عن Lottie من حيث استهلاك الـ CPU والـ Frame Budget؟"
    ],
    "sources": [
      {
        "title": "Flutter Animations Overview & Ecosystem",
        "url": "https://docs.flutter.dev/ui/animations"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fint-001",
    "slug": "flutter-widget-element-renderobject-tree-lifecycle",
    "trackId": "flutter",
    "topicIds": [
      "flutter-internals"
    ],
    "difficulty": "Senior",
    "question": "اشرح المعمارية الداخلية للأشجار الثلاثة في Flutter (Widget, Element, RenderObject) وكيف تتزامن دورة حياتها؟",
    "shortAnswer": "الـ Widget هو توصيف تصريحي ثابت خفيف وغير قابل للتعديل (Immutable Configuration)، والـ Element يدير الهوية وشجرة البناء وموقع الحالة في الذاكرة، والـ RenderObject يتولى حساب الحجم والـ Layout والرسم واللمس الفعلي على الشاشة.",
    "explanation": "عند تشغيل التطبيق، يُنشئ كل Widget عنصراً نظيراً Element عبر createElement(). يحتفظ الـ Element بمرجع للـ Widget والـ RenderObject. عندما يتغير الـ Widget أثناء الـ Rebuild، يتحقق الـ Element عبر دالة Widget.canUpdate() من مطابقة runtimeType والـ Key. إذا تطابقا، يقوم الـ Element بتحديث مرجعه فقط وتحديث خصائص الـ RenderObject دون إعادة بناء الشجرة من الصفر، محققاً سرعة فائقة في الأداء (O(N) reconciliation).",
    "codeExample": "// مبدأ المطابقة الداخلي في فئة Widget:\n// static bool canUpdate(Widget oldWidget, Widget newWidget) {\n//   return oldWidget.runtimeType == newWidget.runtimeType && oldWidget.key == newWidget.key;\n// }",
    "commonMistakes": [
      "الاعتقاد بأن إنشاء كائنات Widget جديدة مع كل build مكلف للذاكرة، متجاهلين أن الـ Widgets خفيفة جداً ويتم تدميرها وجمعها فورياً بواسطة Dart Garbage Collector بينما تبقى كائنات الـ Elements والـ RenderObjects حية."
    ],
    "followUpQuestions": [
      "متى يتم استدعاء mount() و unmount() و deactivate() على كائن الـ Element؟"
    ],
    "sources": [
      {
        "title": "Flutter architectural overview",
        "url": "https://docs.flutter.dev/resources/architectural-overview"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fint-002",
    "slug": "flutter-build-context-element-internals",
    "trackId": "flutter",
    "topicIds": [
      "flutter-internals"
    ],
    "difficulty": "Senior",
    "question": "ما هو BuildContext في حقيقته البرمجية تحت الغطاء وما أسباب الخطأ الشائع 'Looking up a deactivated widget ancestor is unsafe'؟",
    "shortAnswer": "الـ BuildContext هو في الواقع واجهة برمجية يطبقها كائن الـ Element نفسه لتمثيل موقعه في الشجرة؛ والخطأ يحدث عند محاولة استخدام context بعد إزالة أو فصل الـ Element عن الشجرة النشطة عبر عملية غير متزامنة.",
    "explanation": "في كود فئة Element في إطار عمل Flutter: abstract class Element extends DiagnosticableTree implements BuildContext. هذا يعني أن كل context تمرره دالة build() هو حرفياً الـ Element المرتبط بهذا الـ Widget. عند تنفيذ عملية async مثل await Future.delayed(...)، قد يقوم المستخدم بمغادرة الشاشة فيتم استدعاء deactivate() ثم unmount() على الـ Element. إذا حاولت استخدام context لاحقاً (مثلاً لقراءة Theme أو Navigator)، يفشل الـ lookup ويرمى استثناء الأمان لأن الـ Element لم يعد متصلاً بالشجرة.",
    "codeExample": "// الفحص الآمن لسلامة الـ context بعد العمليات غير المتزامنة:\nfinal data = await fetchUserData();\nif (!mounted) return; // يفحص bool get mounted => _element != null;\nNavigator.of(context).pop();",
    "commonMistakes": [
      "الظن بأن BuildContext هو مجرد معرّف أو كائن بيانات وهمي، بدلاً من إدراك أنه الـ Element نفسه الذي يدير دورة حياة الشجرة."
    ],
    "followUpQuestions": [
      "كيف تختلف طريقة إيجاد السلف عبر findAncestorWidgetOfExactType مقارنة بـ dependOnInheritedWidgetOfExactType من حيث الأداء وإعادة البناء؟"
    ],
    "sources": [
      {
        "title": "BuildContext interface documentation",
        "url": "https://api.flutter.dev/flutter/widgets/BuildContext-class.html"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fint-003",
    "slug": "flutter-renderbox-layout-protocol-constraints",
    "trackId": "flutter",
    "topicIds": [
      "flutter-internals"
    ],
    "difficulty": "Senior",
    "question": "اشرح بروتوكول القيود الصارم في شجرة الرندر: 'Constraints go down. Sizes go up. Parent sets position'؟",
    "shortAnswer": "يمرر العنصر الأب قيود الحجم (Constraints) للابن لأسفل، ويحدد الابن حجمه الخاص (Size) ويرفعه لأعلى ضمن تلك القيود، ثم يحدد الأب الإحداثيات الموضعية للابن (Position/Offset).",
    "explanation": "هذا البروتوكول الصارم المكون من مسار واحد (One-pass layout O(N)) يضمن سرعة قياسية في تخطيط الشاشة. يمرر الأب كائن BoxConstraints يحدد minWidth, maxWidth, minHeight, maxHeight. لا يمكن للابن بأي حال من الأحوال تجاوز هذه الحدود، فهو يختار Size صالحاً ويرفعه للأب في دالة performLayout(). بعدها يقوم الأب بوضع الابن في موقعه عبر ضبط BoxParentData.offset. هذا يفسر لماذا يتجاهل عنصر محاط بـ Container أبعاده المحددة إذا كان الأب يفرض قيوداً محكمة (Tight constraints) كشاشة الهاتف بالكامل.",
    "codeExample": "// في داخل دالة performLayout الخاصة بـ RenderBox مخصص:\n@override\nvoid performLayout() {\n  child?.layout(constraints.loosen(), parentUsesSize: true);\n  size = constraints.constrain(Size(child?.size.width ?? 0, 100));\n  (child?.parentData as BoxParentData).offset = const Offset(0, 10);\n}",
    "commonMistakes": [
      "الافتراض بأن تعيين width و height في Container يضمن تطبيقهما دائماً، متجاهلين أن الـ Parent constraints تلغي أي حجم يتعارض معها."
    ],
    "followUpQuestions": [
      "ما هي مخاطر تمرير parentUsesSize: true داخل استدعاء child.layout() على كفاءة إعادة التخطيط؟"
    ],
    "sources": [
      {
        "title": "Understanding constraints in Flutter",
        "url": "https://docs.flutter.dev/ui/layout/constraints"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fint-004",
    "slug": "flutter-frame-pipeline-pipeline-owner-phases",
    "trackId": "flutter",
    "topicIds": [
      "flutter-internals"
    ],
    "difficulty": "Senior",
    "question": "ما هي المراحل المتتالية لخط إنتاج الفريم (Frame Pipeline) داخل المحرك ومن يديرها عبر PipelineOwner؟",
    "shortAnswer": "يمر كل فريم بـ 5 مراحل متتالية: Transient Callbacks (الأنيميشن) -> Microtasks -> Build Phase (بناء الودجت) -> Layout Phase (حساب القياسات) -> Compositing Bits -> Paint Phase (تسجيل أوامر الرسم) -> Semantics -> Composite (إرسال المشهد للـ GPU).",
    "explanation": "يدير PipelineOwner شجرة الرندر وينظم مراحلها بكفاءة لتجنب تكرار العمل. تبدأ الدورة بطلب Vsync من الشاشة. يُشغل المحرك أحداث الأنيميشن عبر Tickers، ثم تُنفذ دالة BuildOwner.buildScope() لمعالجة العناصر المتسخة (Dirty Elements). بعد استقرار الشجرة، يتولى PipelineOwner.flushLayout() حساب أبعاد العناصر التي طُلب لها markNeedsLayout()، يليه flushCompositingBits()، ثم flushPaint() لإعادة تسجيل أوامر الرسم للـ RenderObjects المتسخة، وأخيراً ترسل طبقات المشهد SceneBuilder للـ GPU عبر Window.render().",
    "codeExample": "// الترتيب المنطقي الداخلي في WidgetsBinding.drawFrame():\n// 1. buildOwner.buildScope();\n// 2. pipelineOwner.flushLayout();\n// 3. pipelineOwner.flushCompositingBits();\n// 4. pipelineOwner.flushPaint();\n// 5. renderView.compositeFrame(); // GPU Dispatch",
    "commonMistakes": [
      "استدعاء setState() أثناء مرحلة الـ build أو الـ layout مما يؤدي لرمي استثناء 'setState() or markNeedsBuild() called during build'."
    ],
    "followUpQuestions": [
      "كيف تستفيد دالة WidgetsBinding.instance.addPostFrameCallback من نهاية مراحل الـ Frame Pipeline لضمان توفر القياسات النهائية؟"
    ],
    "sources": [
      {
        "title": "PipelineOwner class API",
        "url": "https://api.flutter.dev/flutter/rendering/PipelineOwner-class.html"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fint-005",
    "slug": "flutter-gesture-arena-and-hit-testing",
    "trackId": "flutter",
    "topicIds": [
      "flutter-internals"
    ],
    "difficulty": "Senior",
    "question": "كيف يكتشف Flutter تفاعلات اللمس عبر Hit Testing وكيف تحسم الـ GestureArena النزاع بين الإيماءات المتنافسة؟",
    "shortAnswer": "يقوم الـ Hit Testing بالبحث بعمق الشجرة لتجميع كائنات RenderObject التي تقع تحت موضع اللمس، ثم تتنافس الـ GestureRecognizers في حلبة (GestureArena) لتحديد الفائز بناءً على حركة المستخدم أو سحب الإيماءات الأخرى.",
    "explanation": "عند لمس الشاشة، يرسل المحرك PointerDownEvent ويبدأ استدعاء hitTest() نزولاً من RenderView إلى أعمق أوراق الشجرة، وكل عنصر يقبل اللمس يسجل نفسه في HitTestResult. بعد ذلك، تشترك الـ GestureRecognizers المربوطة (مثل TapGestureRecognizer و HorizontalDragGestureRecognizer) في GestureArena. ترسل الحلبة أحداث الحركة، وإذا سحب المستخدم أفقياً لمسافة تتجاوز عتبة الـ Drag، يقبل الـ Drag الإيماءة ويقوم الـ Arena بحل النزاع ورفض الـ Tap (Sweep).",
    "codeExample": "// تخصيص سلوك فحص اللمس عبر HitTestBehavior:\nListener(\n  behavior: HitTestBehavior.opaque, // يلتقط اللمس حتى في المساحات الفارغة الشفافة\n  onPointerDown: (event) => print('Touch at ${event.position}'),\n  child: Container(height: 100),\n)",
    "commonMistakes": [
      "عدم ضبط HitTestBehavior.opaque على الحاويات ذات الخلفيات الشفافة، مما يؤدي لتمرير أحداث اللمس للعناصر الخلفية وتجاهل الـ GestureDetector."
    ],
    "followUpQuestions": [
      "ما الفرق بين HitTestBehavior.deferToChild و opaque و translucent؟"
    ],
    "sources": [
      {
        "title": "Gestures in Flutter overview",
        "url": "https://docs.flutter.dev/ui/interactivity/gestures"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fint-006",
    "slug": "flutter-inherited-element-o1-dependency-lookup",
    "trackId": "flutter",
    "topicIds": [
      "flutter-internals"
    ],
    "difficulty": "Senior",
    "question": "كيف يحقق InheritedWidget سرعة بحث O(1) عبر الشجرة وكيف يتتبع الـ InheritedElement التبعيات المسجلة؟",
    "shortAnswer": "يحتفظ كل Element بجدول تجزئة موروث (Map<Type, InheritedElement>) يمرره للأبناء، مما يجعل البحث O(1) فورياً، ويقوم الـ InheritedElement بتسجيل الـ Elements التابعة في Set لتحديثها عند تغير البيانات.",
    "explanation": "بدلاً من التسلق لأعلى الشجرة خطوة بخطوة عند استدعاء of(context)، يمتلك كل Element حقلاً داخلياً _inheritedElements يحتوي على خريطة بكل أنواع InheritedWidgets المتوفرة في أسلافه تم نسخها وإثراؤها أثناء مرحلة mount(). عند استدعاء dependOnInheritedWidgetOfExactType<T>()، يقرأ المرجع في O(1) ويسجل الـ context الحالي في قائمة الـ dependents الخاصة بذلك الـ InheritedElement. عند استدعاء updateShouldNotify() وترجع true، يطلب الـ InheritedElement عمل markNeedsBuild() فقط لتلك العناصر المسجلة.",
    "codeExample": "// المفهوم الداخلي لتسجيل التبعية في دالة of:\n// static MyTheme of(BuildContext context) {\n//   final element = context.getElementForInheritedWidgetOfExactType<MyThemeInheritedWidget>();\n//   context.dependOnInheritedElement(element);\n//   return element.widget.data;\n// }",
    "commonMistakes": [
      "استدعاء dependOnInheritedWidgetOfExactType داخل دالة initState()، مما يرمي خطأ صريحاً لأن الـ Element لم يكتمل ربطه وتجهيزه للتسجيل في قائمة التبعيات."
    ],
    "followUpQuestions": [
      "لماذا يعتبر استدعاء getElementForInheritedWidgetOfExactType حلاً مناسباً للقراءة لمرة واحدة دون تسجيل تبعية للـ Rebuild؟"
    ],
    "sources": [
      {
        "title": "InheritedWidget class documentation",
        "url": "https://api.flutter.dev/flutter/widgets/InheritedWidget-class.html"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fint-007",
    "slug": "flutter-global-key-reparenting-and-performance",
    "trackId": "flutter",
    "topicIds": [
      "flutter-internals"
    ],
    "difficulty": "Senior",
    "question": "ما هي التكلفة الباطنية لاستخدام GlobalKey وكيف يتيح ميزة الـ Reparenting دون فقدان حالة العنصر؟",
    "shortAnswer": "يحافظ GlobalKey على بقاء الـ Element وحالته (State) والـ RenderObject التابع له حياً حتى لو تغير موقعه بالكامل في شجرة الودجت (Reparenting)، لكنه مكلف جداً لأنه يسجل في جدول عالمي ويجبر المحرك على فحص الشجرة بالكامل.",
    "explanation": "تعتمد الـ LocalKeys (مثل ValueKey) على مطابقة العناصر بين الإخوة فقط في نفس الـ Parent. بينما يسجل GlobalKey الـ Element التابع له في سجل عام يديره BuildOwner. عند نقل ويدجت يحمل GlobalKey إلى شجرة أخرى في نفس الفريم، يكتشف المحرك ذلك ويفصل الـ Element من موقعه القديم ويعيد ربطه في موقعه الجديد دون استدعاء dispose()، محافظاً على حالة المحتوى ومدخلات المستخدم. تكلفته تكمن في استهلاك الذاكرة وتأخير الـ reconciliation لأنه يتطلب O(N) traversal للتحقق من تفرد المفتاح والتعامل مع النقل.",
    "codeExample": "// نقل نموذج معقد أو فيديو بلا انقطاع بين شاشتين أو مكانين في الشجرة:\nfinal myGlobalKey = GlobalKey<FormState>();\n// استخدام myGlobalKey.currentState يحفظ الإدخال حتى مع إعادة التموضع",
    "commonMistakes": [
      "إنشاء GlobalKey جديد داخل دالة build() مع كل إعادة رسم (مثل key = GlobalKey())، مما يدمر شجرة الـ Element مع كل فريم ويعيد إنشاء الحالة بالكامل."
    ],
    "followUpQuestions": [
      "ما الفرق بين GlobalObjectKey و LabeledGlobalKey من حيث إدارة الهوية والتصادم؟"
    ],
    "sources": [
      {
        "title": "GlobalKey class documentation",
        "url": "https://api.flutter.dev/flutter/widgets/GlobalKey-class.html"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fint-008",
    "slug": "flutter-impeller-engine-vs-skia-shaders",
    "trackId": "flutter",
    "topicIds": [
      "flutter-internals"
    ],
    "difficulty": "Senior",
    "question": "لماذا طورت Google محرك الرسم الجديد Impeller كبديل لـ Skia في Flutter وما هي مشكلة الـ Shader Compilation Jank؟",
    "shortAnswer": "طور Impeller للتخلص التام من تقطيع الفريمات (Jank) الناتج عن ترجمة الـ Shaders وقت التشغيل لأول مرة في Skia، وذلك عبر ترجمة وتجميع جميع الـ Shaders مسبقاً في وقت بناء التطبيق (AOT).",
    "explanation": "في محرك Skia التقليدي، عندما يواجه التطبيق تأثيراً بصرياً أو حركة لأول مرة (مثل ظل جديد أو تدرج لوني معقد)، يتوقف خيط الرسم لترجمة كود الـ Shader إلى كود لغة الآلة لبطاقة الرسوميات (GPU Driver compilation)، مما يستغرق أحياناً مئات المللي ثواني ويسقط الفريمات. يحل Impeller هذه المشكلة بالكامل عن طريق تجميع كل الـ Shaders والـ pipelines مسبقاً في وقت الترجمة (AOT compilation)، مع استخدام مباشر لـ Metal على iOS و Vulkan على Android، واستخدام أفضل للـ concurrency وتعدد خيوط المعالجة.",
    "codeExample": "// في Flutter 3.10+ على iOS و 3.16+ على Android:\n// يعمل Impeller افتراضياً بدون أي تدخل برمجي، محققاً 60/120 FPS مستقرة تماماً",
    "commonMistakes": [
      "الاعتقاد بأن حل مشكلة تقطيع الـ Shaders في Skia كان عبر زيادة قوة الهاتف، بينما المشكلة بنيوية في طريقة الترجمة اللحظية للـ GPU Pipelines."
    ],
    "followUpQuestions": [
      "كيف يتعامل Impeller مع الـ Custom Shaders المكتوبة بلغة GLSL والمدعومة عبر FragmentProgram؟"
    ],
    "sources": [
      {
        "title": "Impeller rendering engine documentation",
        "url": "https://docs.flutter.dev/perf/impeller"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fint-009",
    "slug": "flutter-platform-channels-vs-dart-ffi",
    "trackId": "flutter",
    "topicIds": [
      "flutter-internals"
    ],
    "difficulty": "Senior",
    "question": "قارن بين معمارية Platform Channels التقليدية و Dart FFI في الاتصال بالطبقة الأصلية (Native) وما الفرق في الأداء؟",
    "shortAnswer": "تعتمد Platform Channels على نقل الرسائل غير المتزامن وتسلسل الـ Binary عبر خيط المنصة، بينما يتصل Dart FFI مباشرة بدوال C/C++ في الذاكرة المشتركة بشكل متزامن وبسرعة الكود المترجم الأصلي.",
    "explanation": "في MethodChannel، يمر كل استدعاء عبر: تشفير المعاملات بواسطة StandardMessageCodec، الإرسال عبر Flutter Engine إلى الـ Platform Thread، فك التشفير، تنفيذ الكود في Java/Kotlin أو Obj-C/Swift، وتكرار نفس الدورة في رحلة العودة غير المتزامنة. هذا يسبب اختناقاً إذا كان معدل نقل البيانات ضخماً (مثل معالجة الكاميرا أو تدفقات البلوتوث). في المقابل، يتيح Dart FFI (Foreign Function Interface) توجيه المؤشرات في الذاكرة واستدعاء دوال المكتبات المجمعة مباشرة دون أي وسيط أو تسلسل، مما يجعله مثالياً لمعالجة الإشارات وخوارزميات التشفير والصور.",
    "codeExample": "// مثال اتصال فوري متزامن عبر FFI بدون أي Platform Channel:\n// typedef NativeAdd = Int32 Function(Int32, Int32);\n// typedef DartAdd = int Function(int, int);\n// final add = dylib.lookupFunction<NativeAdd, DartAdd>('native_add');\n// final result = add(20, 22); // استدعاء مباشر في الذاكرة النانو-ثانية!",
    "commonMistakes": [
      "استخدام MethodChannel لنقل بيانات فيديو خام (Raw Video Frames) بدقة عالية، مما يتسبب في إجهاد شديد للـ Memory Bandwidth وتقطيع الواجهة."
    ],
    "followUpQuestions": [
      "متى نستخدم Pigeon لتوليد كود Platform Channels آمن الأنواع (Type-safe) بدلاً من كتابة القنوات يدوياً؟"
    ],
    "sources": [
      {
        "title": "C interop using dart:ffi",
        "url": "https://dart.dev/interop/c-interop"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "fint-010",
    "slug": "flutter-layer-tree-compositing-rasterization",
    "trackId": "flutter",
    "topicIds": [
      "flutter-internals"
    ],
    "difficulty": "Senior",
    "question": "كيف تتحول شجرة الرسوم إلى شجرة طبقات (Layer Tree) وكيف يتم إرسالها إلى الـ Rasterizer؟",
    "shortAnswer": "تقوم الـ RenderObjects بتسجيل أوامر الرسم في طبقات هندسية (ContainerLayer, PictureLayer)، ثم يقوم الـ SceneBuilder بدمجها في Scene موحد يُرسل عبر RenderView إلى خيط الـ Rasterizer لمعالجته على الـ GPU.",
    "explanation": "لا يتم رسم الـ RenderObjects مباشرة على الشاشة، بل تودع مخرجاتها في شجرة طبقات (Layer Tree). تحتوي هذه الشجرة على PictureLayers التي تسجل أوامر الرسم كـ Display List، وطبقات ContainerLayer للقص (ClipLayer) والتعتيم (OpacityLayer) والتحويل الهندسي (TransformLayer). في نهاية مرحلة الرسم، تستدعي RenderView دالة compositeFrame() التي تستخدم SceneBuilder لتجميع هذه الطبقات في كائن Scene واحد. يُسلّم هذا المشهد لمحرك الرسم في خيط الـ Rasterizer حيث يقوم الـ GPU بتلوين البيكسلات وعرضها على الشاشة.",
    "codeExample": "// مفهوم إنشاء Scene وإرساله للمحرك في RenderView:\n// final SceneBuilder builder = SceneBuilder();\n// layer!.buildScene(builder);\n// final Scene scene = builder.build();\n// window.render(scene);",
    "commonMistakes": [
      "الخلط بين خيط واجهة المستخدم (UI Thread) الذي ينفذ كود Dart وينشئ الـ Layer Tree، وخيط التصيير (Raster Thread) الذي يوجه الأوامر للـ GPU."
    ],
    "followUpQuestions": [
      "كيف تكتشف ما إذا كان سبب بطء التطبيق يرجع لاختناق في خيط الـ UI أم في خيط الـ Raster عبر أدوات DevTools؟"
    ],
    "sources": [
      {
        "title": "Flutter architectural overview - The engine",
        "url": "https://docs.flutter.dev/resources/architectural-overview#the-engine"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  }
];
