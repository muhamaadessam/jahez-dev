import type { InterviewQuestion } from "./questions.ts";

export const uiUxBaseQuestions: Omit<InterviewQuestion, "translations">[] = [
  {
    "id": "uxr-001",
    "slug": "qualitative-vs-quantitative-ux-research",
    "trackId": "ui-ux",
    "topicIds": [
      "ux-research"
    ],
    "difficulty": "Junior",
    "question": "ما الفرق الجوهري بين البحث النوعي (Qualitative) والبحث الكمي (Quantitative) في تجربة المستخدم؟",
    "shortAnswer": "البحث النوعي يجيب عن 'لماذا' و'كيف' يفكر المستخدم ويفسر مشاعره ودوافعه، بينما البحث الكمي يجيب عن 'كم' و'ماذا' بالبيانات الإحصائية والنسب المئوية.",
    "explanation": "البحث النوعي (مثل المقابلات المتعمقة واختبارات قابلية الاستخدام المباشرة) يركز على فهم الدوافع ونقاط الألم العميقة لدى عينة صغيرة من المستخدمين. أما البحث الكمي (مثل استطلاعات الرأي الضخمة وتحليلات Google Analytics وA/B Testing) فيقيس السلوكيات ويتحقق من الفرضيات إحصائياً على نطاق واسع. التصميم الاحترافي يدمج بينهما: البحث النوعي لاكتشاف المشكلة والبحث الكمي للتحقق من حجم تأثيرها.",
    "commonMistakes": [
      "الاعتماد على الأرقام وحدها دون معرفة أسباب سلوك المستخدم خلف الشاشات.",
      "تعميم استنتاجات مقابلة 5 مستخدمين كأنها حقائق إحصائية تمثل كل الجمهور."
    ],
    "followUpQuestions": [
      "متى تبدأ بالبحث النوعي ومتى تبدأ بالبحث الكمي في دورة حياة المنتج؟",
      "كيف يؤثر Triangulation (تثليث مصادر البيانات) على دقة قرارات التصميم؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Quantitative vs. Qualitative Usability Testing",
        "url": "https://www.nngroup.com/articles/quant-vs-qual/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxr-002",
    "slug": "user-interviews-avoiding-leading-questions",
    "trackId": "ui-ux",
    "topicIds": [
      "ux-research"
    ],
    "difficulty": "Mid",
    "question": "كيف تصمم وتجري مقابلات المستخدمين (User Interviews) مع تجنب الأسئلة الموجهة (Leading Questions)؟",
    "shortAnswer": "اسأل أسئلة مفتوحة تركز على سلوكيات وتجارب المستخدمين السابقة الفعلية بدلاً من آرائهم أو تخيلاتهم المستقبلية، وتجنب تضمين الإجابة المتوقعة داخل السؤال.",
    "explanation": "الناس سيئون جداً في التنبؤ بسلوكهم المستقبلي (مثلاً: 'هل ستشتري هذا المنتج لو أضفنا ميزة كذا؟' سيجيب معظمهم بنعم مجاملة). الصواب هو سؤالهم: 'حدثني عن آخر مرة واجهت فيها هذه المشكلة؟ كيف تصرفت؟'. استخدم أسلوب الصمت التكتيكي (Tactical Silence) لإعطاء المستخدم فرصة للاسترسال، واسأل 'لماذا؟' للوصول إلى الجذر النفسي والدافع الحقيقي بدون توجيهه نحو إجابة محددة.",
    "commonMistakes": [
      "طرح أسئلة مغلقة تبدأ بـ 'هل أعجبك...' مما يضطر المستخدم للمجاملة.",
      "شرح فكرة التصميم والدفاع عنها أثناء المقابلة بدلاً من الاستماع التام للمستخدم."
    ],
    "followUpQuestions": [
      "ما هي تقنية The Mom Test في إجراء مقابلات العملاء بدون تزييف الحقائق؟",
      "كيف تتعامل مع المستخدم الخجول أو المقتضب في إجاباته؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — User Interviews: How to Conduct Them",
        "url": "https://www.nngroup.com/articles/user-interviews/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxr-003",
    "slug": "usability-testing-think-aloud-protocol",
    "trackId": "ui-ux",
    "topicIds": [
      "ux-research"
    ],
    "difficulty": "Junior",
    "question": "ما هو بروتوكول التفكير بصوت عالٍ (Think-Aloud Protocol) في اختبارات قابلية الاستخدام وما فائدته؟",
    "shortAnswer": "هو أسلوب يُطلب فيه من المستخدم نطق كل ما يدور في ذهنه ومشاعره وتوقعاته بصوت مسموع أثناء تنفيذ مهام محددة على النموذج الأولي.",
    "explanation": "يعد Think-Aloud البروتوكول الأكثر فعالية في كشف النماذج الذهنية للمستخدمين وفهم أين يتعثرون ولماذا. يكشف الفجوة بين ما يتوقعه المستخدم وما يراه في الواجهة. دور الباحث هنا هو المراقبة وتشجيع المستخدم بلطف إذا صمت عبر جمل محايدة مثل: 'ما الذي تفكر فيه الآن؟'، دون إرشاده إلى الحل أو زر الخطوة التالية إطلاقاً.",
    "commonMistakes": [
      "مساعدة المستخدم أو إخباره بالزر الصحيح عند ارتباكه، مما يفسد نتائج الاختبار.",
      "مقاطعة تدفق أفكار المستخدم بأسئلة متكررة تشتت تركيزه عن المهمة الأساسية."
    ],
    "followUpQuestions": [
      "ما الفرق بين Concurrent Think-Aloud و Retrospective Think-Aloud؟",
      "كم عدد المستخدمين الكافي في اختبار قابلية الاستخدام لكشف 85% من المشاكل؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Thinking Aloud: The #1 Usability Tool",
        "url": "https://www.nngroup.com/articles/thinking-aloud-the-number-one-usability-tool/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxr-004",
    "slug": "user-personas-vs-jobs-to-be-done",
    "trackId": "ui-ux",
    "topicIds": [
      "ux-research"
    ],
    "difficulty": "Mid",
    "question": "قارن بين شخصيات المستخدمين (Personas) وإطار المهام المراد إنجازها (Jobs to be Done - JTBD)؟",
    "shortAnswer": "الشخصيات تركز على هوية المستخدم وصفاته الديموغرافية والنفسية، بينما JTBD يركز على السياق والهدف والمهمة الوظيفية والعاطفية التي يريد المستخدم إنجازها بغض النظر عن هويته.",
    "explanation": "الـ Personas التقليدية قد تقع في فخ التركيز على تفاصيل غير مؤثرة (مثل العمر، الهوايات، الحالة الاجتماعية). في المقابل، إطار JTBD ينص على أن: 'المستخدم لا يشتري المنتج، بل يستأجره لينجز مهمة محددة في سياق معين'. الجمع الأفضل هو استخدام Proto-Personas مدعومة بـ Job Stories بصيغة: 'عندما أكون في (سياق)، أريد أن (دافع)، حتى أتمكن من (النتيجة المتوقعة)'.",
    "commonMistakes": [
      "صناعة شخصيات خيالية مبنية على تخمينات الفريق الداخلي بدون مقابلات واقعية.",
      "حشو الـ Persona بمعلومات ديموغرافية سطحية لا تؤثر على قرارات التفاعل والواجهة."
    ],
    "followUpQuestions": [
      "متى تفشل الـ Personas الديموغرافية في قيادة قرارات تصميم الميزات المعقدة؟",
      "كيف تترجم Job Story إلى تسلسل شاشات تفاعلية؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Personas vs. Jobs-to-be-Done",
        "url": "https://www.nngroup.com/articles/personas-jobs-be-done/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxr-005",
    "slug": "card-sorting-open-vs-closed-mental-models",
    "trackId": "ui-ux",
    "topicIds": [
      "ux-research"
    ],
    "difficulty": "Mid",
    "question": "ما الفرق بين فرز البطاقات المفتوح (Open Card Sorting) والمغلق (Closed Card Sorting)؟",
    "shortAnswer": "الفرز المفتوح يتيح للمستخدمين تجميع الموضوعات في مجموعات وتسميتها بأنفسهم، بينما الفرز المغلق يطلب منهم توزيع الموضوعات داخل تصنيفات محددة مسبقاً.",
    "explanation": "يُستخدم الفرز المفتوح في المراحل الأولى لتوليد الأفكار واكتشاف النماذج الذهنية للمستخدمين وفهم كيف يصنفون المعلومات بطبيعتهم ومصطلحاتهم الخاصة. بينما يُستخدم الفرز المغلق لاختبار هيكل التصنيف القائم بالفعل وتقييم ما إذا كانت المسميات والفئات المقترحة واضحة ومنطقية لهم.",
    "commonMistakes": [
      "استخدام الفرز المغلق في مرحلة مبكرة جداً قبل معرفة مصطلحات المستخدمين.",
      "كتابة بطاقات تحتوي على نفس كلمات التصنيف مما يقود المستخدمين آلياً لنفس الحل."
    ],
    "followUpQuestions": [
      "كيف يساعد الفرز المختلط (Hybrid Card Sorting) في تطوير المنتجات القائمة؟",
      "كيف تترجم نتائج مصفوفة التشابه (Similarity Matrix) إلى بنية ملاحة فعلية؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Card Sorting: Uncover Users' Mental Models",
        "url": "https://www.nngroup.com/articles/card-sorting-definition/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxr-006",
    "slug": "tree-testing-information-architecture-validation",
    "trackId": "ui-ux",
    "topicIds": [
      "ux-research"
    ],
    "difficulty": "Mid",
    "question": "ما هو اختبار الشجرة (Tree Testing) ولماذا يُعرف بالهندسة المعمارية العكسية للمعلومات؟",
    "shortAnswer": "هو اختبار يقيس قابلية العثور على المعلومات (Findability) عبر هيكل شجري نصي مجرد من أي عناصر بصرية أو واجهات رسومية.",
    "explanation": "عبر إزالة الألوان والأزرار ومشتتات التصميم، يركز Tree Testing فقط على بنية القوائم والمسميات (Taxonomy). يُطلب من المستخدم: 'أين تجد وثيقة سداد الفواتير؟' ويتنقل عبر الفئات المتداخلة فقط. إذا فشل المستخدم في العثور عليها، فهذا يعني أن المشكلة في تنظيم المعلومات والـ IA وليس في تصميم الأزرار أو الألوان.",
    "commonMistakes": [
      "تنفيذ اختبار الشجرة على واجهات ملونة كاملة مما يخلط بين قابلية الاستخدام وقابلية العثور.",
      "صياغة سيناريو الاختبار باستخدام نفس كلمات الرابط النهائي (مما يلغي قيمة الاختبار)."
    ],
    "followUpQuestions": [
      "ما الفرق بين مؤشر النجاح المباشر (Directness) ومعدل النجاح الإجمالي (Success Rate)؟",
      "كيف يتكامل Card Sorting مع Tree Testing في دورة بناء الـ Navigation؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Tree Testing: Fast, Iterative Evaluation of Menu Labels and Categories",
        "url": "https://www.nngroup.com/articles/tree-testing/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxr-007",
    "slug": "nielsen-ten-usability-heuristics",
    "trackId": "ui-ux",
    "topicIds": [
      "ux-research"
    ],
    "difficulty": "Junior",
    "question": "ما هي مبادئ نيلسن العشرة لقابلية الاستخدام (Nielsen's 10 Usability Heuristics) وما أهميتها؟",
    "shortAnswer": "هي قواعد استرشادية معيارية لتقييم واجهات المستخدم وكشف مشاكل قابلية الاستخدام الشائعة بدون الحاجة لاختبار مستخدمين فوري.",
    "explanation": "تشمل: 1) وضوح حالة النظام (Visibility of system status). 2) المواءمة بين النظام والعالم الحقيقي. 3) حرية المستخدم وتحكمه (توفير زر تراجع). 4) الاتساق والمعايير. 5) منع الأخطاء قبل وقوعها. 6) التعرف بدلاً من التذكر. 7) المرونة وكفاءة الاستخدام للمحترفين. 8) التصميم الجمالي والبسيط (Minimalist). 9) مساعدة المستخدمين في التعرف على الأخطاء وعلاجها. 10) المساعدة والتوثيق عند اللزوم.",
    "commonMistakes": [
      "الاعتماد على التقييم الاستكشافي كبديل كامل عن اختبار المستخدمين الحقيقيين.",
      "فحص الواجهات دون سيناريوهات استخدام واضحة مما يؤدي لملاحظات شكلية غير مؤثرة."
    ],
    "followUpQuestions": [
      "ما الفرق بين مبدأ منع الخطأ (Error Prevention) ومبدأ معالجة الخطأ (Error Recovery)؟",
      "كيف تطبق مبدأ Recognition over Recall في تصميم محركات البحث وقوائم التصفية؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — 10 Usability Heuristics for User Interface Design",
        "url": "https://www.nngroup.com/articles/ten-usability-heuristics/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxr-008",
    "slug": "customer-journey-map-vs-user-flow",
    "trackId": "ui-ux",
    "topicIds": [
      "ux-research"
    ],
    "difficulty": "Mid",
    "question": "ما الفرق بين خريطة رحلة المستخدم (Customer Journey Map) ومخطط التدفق (User Flow)؟",
    "shortAnswer": "خريطة الرحلة توثق التجربة الشاملة والمشاعر ونقاط الألم عبر نقاط اتصال متعددة وزمن طويل، بينما مخطط التدفق يرسم المسار التقني للخطوات والشاشات داخل النظام لإنجاز مهمة محددة.",
    "explanation": "الـ Journey Map تركز على البعد الإنساني والعاطفي (ماذا يرى، يفكر، يشعر المستخدم، وما هي نقاط الإحباط في كل مرحلة من الوعي إلى الشراء والاستخدام). أما الـ User Flow فيركز على الهندسة التفاعلية: شاشة تسجيل الدخول -> التحقق -> نجاح العملية -> التوجيه للشاشة الرئيسية مع القرارات الشرطية (If/Else).",
    "commonMistakes": [
      "رسم شاشات التطبيق فقط وتسميتها Journey Map دون توثيق الدوافع والمشاعر ونقاط الألم.",
      "إهمال المسارات البديلة والحالات الخاطئة (Unhappy Paths) في مخططات التدفق."
    ],
    "followUpQuestions": [
      "كيف تترجم نقاط الألم (Pain Points) في رحلة العميل إلى متطلبات ميزات في الـ Flow؟",
      "ما هي مكونات الـ Service Blueprint مقارنة بـ Journey Map؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Journey Mapping 101",
        "url": "https://www.nngroup.com/articles/journey-mapping-101/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxr-009",
    "slug": "contextual-inquiry-and-ethnographic-research",
    "trackId": "ui-ux",
    "topicIds": [
      "ux-research"
    ],
    "difficulty": "Senior",
    "question": "ما هو الاستفسار السياقي (Contextual Inquiry) وكيف يكشف الاحتياجات الكامنة للمستخدمين؟",
    "shortAnswer": "هو أسلوب بحث إثنوغرافي يقوم فيه الباحث بملاحظة المستخدم وإجراء مقابلات معه في بيئة عمله الطبيعية والواقعية أثناء تأدية مهامه المعتادة.",
    "explanation": "يعتمد على مبدأ المتدرب والأستاذ (Master-Apprentice Relationship): المستخدم هو المعلم الذي يؤدي عمله، والباحث هو المتدرب الذي يلاحظ ويسأل عن القرارات والأسباب فور حدوثها. ميزته الكبرى أنه يكشف الـ Workarounds (الحيل غير الرسمية التي يخترعها المستخدم للتغلب على عيوب الأنظمة القديمة مثل أوراق Post-it الملصقة على الشاشات) والتي لا يذكرها أبداً في المقابلات المكتبية.",
    "commonMistakes": [
      "الجلوس كضيف سلبي دون مقاطعة مهذبة للاستفسار عن الحركات غير المفهومة في وقتها.",
      "محاولة توجيه المستخدم أو تقديم نصائح له حول كيفية تحسين أسلوب عمله أثناء الجلسة."
    ],
    "followUpQuestions": [
      "ما هي المبادئ الأربعة للـ Contextual Inquiry (Context, Partnership, Interpretation, Focus)؟",
      "كيف تحلل بيانات الملاحظة الميدانية وتستخرج منها فرص تصميم غير مسبوقة؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Contextual Inquiry: Inspire Design by Observing and Interviewing Users in Their Context",
        "url": "https://www.nngroup.com/articles/contextual-inquiry/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxr-010",
    "slug": "synthesizing-research-affinity-diagrams",
    "trackId": "ui-ux",
    "topicIds": [
      "ux-research"
    ],
    "difficulty": "Senior",
    "question": "كيف تحلل البيانات النوعية غير المنظمة وتستخرج منها رؤى قابلة للتنفيذ عبر مخططات التقارب (Affinity Diagrams)؟",
    "shortAnswer": "عبر تفريغ الملاحظات والاقتباسات على بطاقات منفردة، ثم تجميعها تصاعدياً (Bottom-up) بناءً على العلاقات والأنماط المشتركة لتكوين محاور ورؤى رئيسية.",
    "explanation": "تبدأ العملية بجمع مئات الملاحظات الفردية من مقابلات المستخدمين، وكتابة كل فكرة على بطاقة مستقلة. يجتمع الفريق لتجميع البطاقات المتشابهة في مجموعات بصمت في البداية لتجنب تحيز المناقشات. بعد التجميع، يُطلق اسم وصفي لكل محور (Theme)، وتُصاغ الرؤى (Insights) التي تفسر جذور السلوك وتتحول إلى فرص تصميم بصيغة 'How Might We' (كيف يمكننا أن...؟).",
    "commonMistakes": [
      "التجميع المسبق للملاحظات داخل فئات محددة سلفاً (Top-down) مما يحجب الأنماط الجديدة غير المتوقعة.",
      "الاكتفاء بتلخيص ما قاله المستخدمون دون الغوص وراء الدوافع النفسية غير المصرح بها."
    ],
    "followUpQuestions": [
      "كيف تحول مخرجات الـ Affinity Diagram إلى خريطة أولويات الـ Product Backlog؟",
      "ما الفرق بين البيانات الخام (Data) والنتائج (Findings) والرؤى الاستراتيجية (Insights)؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Affinity Diagramming: Collaboratively Sort UX Findings & Ideas",
        "url": "https://www.nngroup.com/articles/affinity-diagram/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxp-001",
    "slug": "fittss-law-touch-and-desktop-interfaces",
    "trackId": "ui-ux",
    "topicIds": [
      "ux-principles"
    ],
    "difficulty": "Junior",
    "question": "ما هو قانون فيتس (Fitts's Law) وكيف يؤثر على تصميم الأزرار وتجربة اللمس في الهواتف؟",
    "shortAnswer": "ينص على أن الوقت اللازم للوصول إلى هدف ما يعتمد على المسافة إليه وحجم مساحته؛ فكلما كان الهدف أكبر وأقرب، كان النقر عليه أسرع وأسهل.",
    "explanation": "في الهواتف الذكية، الأهداف الواقعة في أسفل الشاشة (ضمن منطقة الإبهام Thumb Zone) هي الأقرب والأسرع وصولاً، بينما أعلى الشاشة أبعد ويتطلب جهداً أكبر. يفرض القانون جعل الأزرار الهامة ذات مساحة لمس كافية (48x48dp كحد أدنى)، واستغلال حواف الشاشات وزواياها في الشاشات المكتبية لأنها ذات مساحة وصول لا نهائية فيزيائياً لمؤشر الفأرة.",
    "commonMistakes": [
      "وضع أزرار الإجراءات الأساسية (Primary CTAs) في الزوايا العلوية البعيدة عن يد المستخدم في الهواتف.",
      "تصميم مساحات نقر صغيرة جداً تجعل المستخدم ينقر بالخطأ على العناصر المجاورة."
    ],
    "followUpQuestions": [
      "كيف يؤثر Fitts's Law على تصميم القوائم السياقية (Contextual Menus) ومجموعات الأزرار؟",
      "ما هي المسافة التفاعلية المثلى في شاشات الحواسيب ذات الأبعاد العريضة جداً؟"
    ],
    "sources": [
      {
        "title": "Laws of UX — Fitts's Law",
        "url": "https://lawsofux.com/fittss-law/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxp-002",
    "slug": "hicks-law-reducing-cognitive-choices",
    "trackId": "ui-ux",
    "topicIds": [
      "ux-principles"
    ],
    "difficulty": "Junior",
    "question": "ما هو قانون هيك (Hick's Law) وكيف يساعد في منع شلل اتخاذ القرار (Decision Paralysis)؟",
    "shortAnswer": "ينص على أن الوقت المطلوب لاتخاذ القرار يزداد لوغاريتمياً مع زيادة عدد الخيارات المتاحة ودرجة تعقيدها.",
    "explanation": "عندما يواجه المستخدم عدداً هائلاً من الخيارات (مثل قوائم ملاحة ممتدة أو نماذج دفع تحتوي 20 حقلاً في صفحة واحدة)، يصاب بالإرهاق الذهني وقد يتراجع عن الشراء. التطبيق العملي هو: تقليص الخيارات المتاحة في اللحظة الواحدة، تجزئة العمليات المعقدة إلى خطوات متعاقبة (Wizard / Stepper)، وتسليط الضوء على خيار موصى به واحد لتسهيل القرار السريع.",
    "commonMistakes": [
      "عرض كافة الميزات والخيارات المتقدمة في الواجهة الرئيسية بحجة تسهيل وصول المستخدم إليها.",
      "تصميم قوائم منسدلة عملاقة تحتوي عشرات العناصر دون تقسيم هرمي أو إمكانية بحث سريع."
    ],
    "followUpQuestions": [
      "متى لا ينطبق قانون هيك على الواجهات التفاعلية؟",
      "كيف ترتب الخيارات في شاشات التسعير (Pricing Tiers) وفق قانون هيك؟"
    ],
    "sources": [
      {
        "title": "Laws of UX — Hick's Law",
        "url": "https://lawsofux.com/hicks-law/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxp-003",
    "slug": "jakobs-law-familiarity-and-mental-models",
    "trackId": "ui-ux",
    "topicIds": [
      "ux-principles"
    ],
    "difficulty": "Junior",
    "question": "ما هو قانون جاكوب (Jakob's Law) ولماذا يجب ألا تعيد اختراع العجلة في تصميم التفاعل؟",
    "shortAnswer": "ينص على أن المستخدمين يقضون معظم وقتهم على مواقع وتطبيقات أخرى، لذا يتوقعون أن يعمل موقعك بنفس الطريقة المألوفة التي اعتادوا عليها.",
    "explanation": "المستخدمون يأتون بنماذج ذهنية مسبقة (Mental Models)؛ مثلاً يتوقعون سلة التسوق في أعلى اليمين أو اليسار، وشعار الموقع يعيد للصفحة الرئيسية، وأيقونة الترس للإعدادات. عندما يبتكر المصمم نظام ملاحة غريباً وغير مألوف، يضطر المستخدم لإهدار طاقته الذهنية في تعلم الواجهة بدلاً من التركيز على هدفه ومحتوى المنصة.",
    "commonMistakes": [
      "تغيير مواضع العناصر الاصطلاحية القياسية (مثل حقل البحث وسلة الشراء) لمجرد التميز البصري.",
      "استخدام أيقونات مبتكرة غير مفهومة بدون نصوص توضيحية مصاحبة."
    ],
    "followUpQuestions": [
      "متى يكون من المقبول كسر النمط السائد في السوق وابتكار نمط تفاعل جديد كلياً؟",
      "كيف نوازن بين الإبداع البصري للعلامة التجارية وبين الألفة الوظيفية للمستخدم؟"
    ],
    "sources": [
      {
        "title": "Laws of UX — Jakob's Law",
        "url": "https://lawsofux.com/jakobs-law/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxp-004",
    "slug": "millers-law-and-cognitive-chunking",
    "trackId": "ui-ux",
    "topicIds": [
      "ux-principles"
    ],
    "difficulty": "Mid",
    "question": "ما المعنى الحقيقي لقانون ميلر (Miller's Law) وما هو التفسير الخاطئ الشائع حول رقم 7؟",
    "shortAnswer": "ينص على أن الذاكرة العاملة للإنسان قادرة على معالجة 7 ± 2 من قطع المعلومات (Chunks) في المرة الواحدة؛ ولا يعني حصر عناصر القوائم بسبعة أزرار إطلاقاً.",
    "explanation": "الخطأ الشائع هو افتراض أن أي واجهة لا يجب أن تحتوي أكثر من 7 عناصر. الحقيقة أن القانون يدعو إلى 'التجزئة الإدراكية' (Chunking)، أي تنظيم المعلومات المترابطة في كتل بصرية ذات معنى لتسهيل تذكرها ومعالجتها؛ مثل تقسيم أرقام بطاقات الائتمان إلى 4 مجموعات (4-4-4-4) أو تجزئة أرقام الهواتف.",
    "commonMistakes": [
      "تقييد خيارات القوائم الرئيسية برقم 7 فقط وتشتيت الخيارات الضرورية الأخرى.",
      "عرض بيانات رقمية طويلة كنص متصل بدون مسافات أو فواصل تنظم القراءة."
    ],
    "followUpQuestions": [
      "كيف تساهم التجزئة (Chunking) في خفض الحمل المعرفي في لوحات التحكم المعقدة (Dashboards)؟",
      "ما الفرق بين الذاكرة قصيرة المدى (Working Memory) والذاكرة طويلة المدى في استيعاب الواجهات؟"
    ],
    "sources": [
      {
        "title": "Laws of UX — Miller's Law",
        "url": "https://lawsofux.com/millers-law/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxp-005",
    "slug": "gestalt-principles-in-ui-design",
    "trackId": "ui-ux",
    "topicIds": [
      "ux-principles"
    ],
    "difficulty": "Mid",
    "question": "كيف توظف مبادئ الجشطالت (Gestalt Principles) مثل التقارب والتشابه في إدراك الواجهات؟",
    "shortAnswer": "مبادئ الجشطالت تفسر كيف يدرك الدماغ البشري العناصر البصرية ككل منظم بدلاً من تفاصيل متفرقة، وأهمها التقارب (Proximity) والتشابه (Similarity) والإغلاق (Closure).",
    "explanation": "مبدأ التقارب يعني أن العناصر القريبة من بعضها يراها الدماغ كمجموعة مترابطة وظيفياً؛ لذا يجب أن تكون المسافة بين حقل الإدخال وعنوانه أقرب بكثير من المسافة مع الحقل التالي. مبدأ التشابه يعني أن العناصر ذات الشكل أو اللون أو الحجم المتطابق (مثل أزرار الروابط النصية الزرقاء) تفيد بأن لها نفس الوظيفة والسلوك.",
    "commonMistakes": [
      "وضع مسافات بيضاء عشوائية تجعل عنوان الحقل يظهر في منتصف المسافة بين حقلين مختلفين.",
      "استخدام نفس التنسيق البصري للزر الأساسي الفعال وزر الحذف الخطر مما يربك المستخدم."
    ],
    "followUpQuestions": [
      "كيف يعمل مبدأ المصير المشترك (Common Fate) في التحريك والتمرير بالواجهات؟",
      "كيف يساهم مبدأ الاستمرارية (Continuity) في توجيه عين المستخدم نحو مسارات القراءة؟"
    ],
    "sources": [
      {
        "title": "Laws of UX — Law of Proximity",
        "url": "https://lawsofux.com/law-of-proximity/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxp-006",
    "slug": "peak-end-rule-in-product-experience",
    "trackId": "ui-ux",
    "topicIds": [
      "ux-principles"
    ],
    "difficulty": "Mid",
    "question": "ما هي قاعدة الذروة والنهاية (Peak-End Rule) وكيف تؤثر على انطباع المستخدم الدائم عن المنتج؟",
    "shortAnswer": "تنص على أن المستخدم يحكم على التجربة ويتذكرها بناءً على ما شعر به عند نقطة ذروتها (سواء كانت الأكثر متعة أو الأكثر إحباطاً) وعند نهايتها، وليس بناءً على متوسط كل لحظات التجربة.",
    "explanation": "التجربة التي تتضمن 10 خطوات عادية ولكنها تنتهي بلحظة تأكيد مبهجة واحتفالية ومطمئنة (مثل شاشات النجاح المبتكرة في Mailchimp عند إرسال الحملة) تترك أثراً إيجابياً يدوم طويلاً. في المقابل، إذا كانت كل الخطوات ممتازة ولكن اللحظة الأخيرة شهدت خطأ غير مفهوم في بوابة الدفع أو صعوبة في إلغاء الاشتراك، سيتذكر المستخدم التطبيق بأنه فاشل ومزعج.",
    "commonMistakes": [
      "إهمال شاشات النهاية (مثل شاشة الشكر أو تأكيد الحجز) وجعلها باهتة ومجردة من الإرشاد.",
      "تجاهل إصلاح أشد لحظة إحباط في رحلة المستخدم (مثل تعطل رفع الملفات) بحجة أن باقي التطبيق سريع."
    ],
    "followUpQuestions": [
      "كيف تصمم تجربة إيقاف أو إلغاء الاشتراك (Offboarding) وفق قاعدة Peak-End Rule لترك انطباع محترم؟",
      "كيف تعزز Micro-copy والرسوم التفاعلية المشاعر الإيجابية في لحظات الذروة؟"
    ],
    "sources": [
      {
        "title": "Laws of UX — Peak-End Rule",
        "url": "https://lawsofux.com/peak-end-rule/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxp-007",
    "slug": "von-restorff-effect-and-cta-design",
    "trackId": "ui-ux",
    "topicIds": [
      "ux-principles"
    ],
    "difficulty": "Junior",
    "question": "ما هو تأثير فون ريستورف (Von Restorff Effect) وكيف يُستخدم في تصميم أزرار الإجراء (CTAs)؟",
    "shortAnswer": "يُعرف أيضاً بتأثير العزل (Isolation Effect)؛ وينص على أنه عندما توجد عدة عناصر متشابهة، فإن العنصر الذي يختلف بصرياً عن البقية هو الأكثر ترجيحاً للتذكر وجذب الانتباه.",
    "explanation": "يُطبق هذا المبدأ بوضوح في تصميم باقات الأسعار (Pricing Tables): جعل باقة 'الأكثر شعبية' أكبر حجماً وبلون مميز مع شارة خاصة لتبرز فوراً بين الباقات الأخرى. ويُستخدم في شاشات الحوار (Dialogs) لجعل زر الإجراء الإيجابي بارزاً وممتلئاً بلون مميز، بينما زر الإلغاء باهت أو مجرد رابط نصي بسيط.",
    "commonMistakes": [
      "تمييز أكثر من عنصر في نفس الوقت على الشاشة، مما يخلق تضارباً بصرية ويلغي تأثير العزل تماماً.",
      "استخدام لون تمييز صارخ لعنصر ثانوي غير مرغوب فيه مما يشتت المستخدم عن الهدف الرئيسي."
    ],
    "followUpQuestions": [
      "كيف تمنع الوقوع في فخ Banner Blindness (عمى الإعلانات) عند تطبيق تأثير العزل؟",
      "ما هي العلاقة بين التأثير والتباين اللوني المعتمد في معايير إمكانية الوصول WCAG؟"
    ],
    "sources": [
      {
        "title": "Laws of UX — Von Restorff Effect",
        "url": "https://lawsofux.com/von-restorff-effect/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxp-008",
    "slug": "aesthetic-usability-effect-and-its-risks",
    "trackId": "ui-ux",
    "topicIds": [
      "ux-principles"
    ],
    "difficulty": "Mid",
    "question": "ما هو تأثير الجمالية على قابلية الاستخدام (Aesthetic-Usability Effect) وما خطورته أثناء الاختبارات؟",
    "shortAnswer": "ينص على أن المستخدمين يميلون لإدراك التصميمات الجذابة بصرياً على أنها أكثر سهولة في الاستخدام وأكثر كفاءة، ويكونون أكثر تسامحاً مع مشاكل الاستخدام البسيطة.",
    "explanation": "الجمال البصري يولد استجابة عاطفية إيجابية تخفف من توتر المستخدم أثناء التفاعل. لكن خطورته تكمن في أبحاث المستخدمين: قد يقول المستخدم في المقابلة: 'الموقع رائع وسهل جداً!' فقط لأنه مبهر بصرياً، بينما في الواقع يستغرق وقتاً مضاعفاً لإيجاد المنتج أو يرتكب أخطاء جسيمة. لذلك يجب على الباحث مراقبة الأفعال ومعدلات الإنجاز الفعلية وليس الانطباع البصري اللفظي.",
    "commonMistakes": [
      "تلميع واجهات غير وظيفية بألوان ورسوم حديثة لإخفاء مشاكل هيكلية في الملاحة وتدفق المهام.",
      "أخذ آراء المستخدمين الإيجابية حول جمال الشكل كدليل على خلو الواجهة من عيوب الاستخدام."
    ],
    "followUpQuestions": [
      "كيف تفصل بين جاذبية واجهة المستخدم (UI Aesthetics) وقابلية استخدامها (Usability) أثناء التحليل؟",
      "كيف يؤثر التناغم بين الخطوط والألوان والمساحات في بناء الثقة الفورية (Credibility)؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — The Aesthetic-Usability Effect",
        "url": "https://www.nngroup.com/articles/aesthetic-usability-effect/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxp-009",
    "slug": "doherty-threshold-and-perceived-performance",
    "trackId": "ui-ux",
    "topicIds": [
      "ux-principles"
    ],
    "difficulty": "Mid",
    "question": "ما هي عتبة دوهرتي (Doherty Threshold) وما هي تقنيات تحسين الأداء المُدرك (Perceived Performance)؟",
    "shortAnswer": "تنص على أن الإنتاجية تزداد بشكل كبير عندما يتفاعل الحاسوب والإنسان بوتيرة لا تتجاوز 400 مللي ثانية للرد؛ وإذا زادت المدة يتشتت انتباه المستخدم.",
    "explanation": "عندما يستغرق طلب الشبكة أكثر من 400ms، يجب تقديم تغذية بصرية فورية (Visual Feedback) تؤكد استلام الطلب. تشمل استراتيجيات الأداء المدرك: شاشات الهيكل العظمي (Skeleton Screens) التي توحي بأن الصفحة تتشكل، التحديث التفاؤلي للواجهة (Optimistic UI) الذي يظهر الإعجاب أو الرسالة فوراً قبل رد السيرفر، ومؤشرات التقدم المحددة بدلاً من الدوائر الدوارة البطيئة.",
    "commonMistakes": [
      "ترك الزر صامتاً وبلا أي استجابة حركية فورية لعدة ثوانٍ أثناء انتظار رد الشبكة، مما يدفع المستخدم للنقر المتكرر.",
      "استخدام دوائر التحميل الدوارة (Spinners) لكل شاشة مما يشعر المستخدم بأن النظام بطيء وثقيل."
    ],
    "followUpQuestions": [
      "ما الفرق بين زمن الاستجابة الحقيقي وزمن الاستجابة المدرك نفسياً لدى المستخدم؟",
      "متى يكون من الأفضل تأخير الواجهة اصطناعياً (Artificial Delay) لزيادة ثقة المستخدم في النتيجة؟"
    ],
    "sources": [
      {
        "title": "Laws of UX — Doherty Threshold",
        "url": "https://lawsofux.com/doherty-threshold/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxp-010",
    "slug": "progressive-disclosure-reducing-cognitive-load",
    "trackId": "ui-ux",
    "topicIds": [
      "ux-principles"
    ],
    "difficulty": "Senior",
    "question": "كيف يعمل مبدأ الإفصاح التدريجي (Progressive Disclosure) على إدارة التعقيد في التطبيقات الاحترافية؟",
    "shortAnswer": "هو أسلوب تصميم يقدم المعلومات والميزات الأساسية والضرورية فقط في البداية، ويؤجل عرض التفاصيل والخيارات المتقدمة إلى أن يطلبها المستخدم صراحة.",
    "explanation": "يحل الإفصاح التدريجي المعضلة الكلاسيكية: كيف تصمم واجهة سهلة للمبتدئين وتلبي احتياجات المحترفين في آن واحد؟ يتم ذلك عبر وضع الميزات الأكثر استخداماً (80% من الحالات) في الواجهة المباشرة، مع توفير أزرار 'خيارات متقدمة' أو قوائم فرعية للتفاصيل المعقدة. هذا يمنع إغراق الواجهة بالفوضى ويحافظ على سرعة إنجاز المهام الشائعة.",
    "commonMistakes": [
      "دفن خيارات حيوية وأساسية داخل قوائم خفية يصعب على المستخدم العادي العثور عليها.",
      "عرض كافة المعاملات البرمجية أو خيارات التصفية المعقدة دفعة واحدة في الشاشة الأولى."
    ],
    "followUpQuestions": [
      "كيف تصمم Accordion أو Stepper يطبق الإفصاح التدريجي دون إرهاق المستخدم بالتنقل المتكرر؟",
      "ما هي معايير الفصل بين الميزات الأساسية والميزات المتقدمة استناداً إلى بيانات التحليلات؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Progressive Disclosure",
        "url": "https://www.nngroup.com/articles/progressive-disclosure/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxia-001",
    "slug": "four-pillars-of-information-architecture",
    "trackId": "ui-ux",
    "topicIds": [
      "information-architecture"
    ],
    "difficulty": "Junior",
    "question": "ما هي الركائز الأربع الأساسية لهندسة المعلومات (Information Architecture - IA) وفقاً لـ Rosenfeld و Morville؟",
    "shortAnswer": "الركائز الأربع هي: 1) أنظمة التنظيم (Organization). 2) أنظمة التسمية (Labeling). 3) أنظمة الملاحة (Navigation). 4) أنظمة البحث (Search).",
    "explanation": "نظام التنظيم يحدد كيفية هيكلة المحتوى وتقسيمه (هرمياً، زمنياً، أبجدياً، أو حسب الموضوع). نظام التسمية يحدد المصطلحات واللغة المفهومة للمستخدمين بدلاً من مصطلحات الشركة التقنية. نظام الملاحة يحدد كيفية تنقل المستخدم وتحديد موقعه الحالي ومساراته السابقة واللاحقة. ونظام البحث يساعد المستخدم في الاستعلام والفلترة والوصول المباشر دون تصفح طويل.",
    "commonMistakes": [
      "البدء في تصميم الشاشات والألوان قبل الاتفاق على هيكل وتصنيف محتوى التطبيق.",
      "استخدام مسميات داخلية خاصة بالمبرمجين أو الإدارة لا يفهمها المستخدم النهائي."
    ],
    "followUpQuestions": [
      "كيف تترجم ركائز هندسة المعلومات إلى Sitemap تفاعلي واضح؟",
      "ما الفرق بين الفرز حسب الجمهور (Audience-specific) والفرز حسب المهام (Task-oriented)؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Information Architecture: Study Guide",
        "url": "https://www.nngroup.com/articles/ia-study-guide/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxia-002",
    "slug": "flat-vs-deep-navigation-hierarchies",
    "trackId": "ui-ux",
    "topicIds": [
      "information-architecture"
    ],
    "difficulty": "Mid",
    "question": "قارن بين هياكل الملاحة المسطحة (Flat Navigation) والعميقة (Deep Navigation) ومتى تختار كلاً منهما؟",
    "shortAnswer": "الملاحة المسطحة تقدم خيارات واسعة في المستوى الأول وعمقاً قليلاً (نقرات أقل)، بينما الملاحة العميقة تقدم خيارات قليلة في البداية وتتفرع لمستويات متعددة في العمق.",
    "explanation": "الملاحة المسطحة (Wide/Flat) تقلل الجهد المعرفي للوصول لأن معظم المحتوى يظهر بوضوح، ولكنها قد تسبب فوضى إذا تجاوزت الحدود المعقولة. الملاحة العميقة تقلل عدد الخيارات أمام العين دفعة واحدة، لكنها تزيد من النقر ومخاطر ضياع المستخدم في المستويات السفلية ونسيان مسار العودة. القاعدة المعاصرة تميل إلى جعل الهيكل مسطحاً قدر الإمكان مع تصنيفات واضحة.",
    "commonMistakes": [
      "بناء ملاحة عميقة تطلب من المستخدم 6 أو 7 نقرات متتالية للوصول لصفحة حيوية.",
      "حشر عشرات الأقسام غير المتجانسة في قائمة أفقية واحدة بدعوى التسطيح."
    ],
    "followUpQuestions": [
      "ما هي قاعدة الثلاث نقرات (3-Click Rule) وهل هي قاعدة علمية صحيحة أم خرافة في الـ UX؟",
      "كيف تساهم Breadcrumbs (فتات الخبز) في إنقاذ المستخدم من الضياع في الهياكل العميقة؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Flat vs. Deep Website Hierarchies",
        "url": "https://www.nngroup.com/articles/flat-vs-deep-hierarchy/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxia-003",
    "slug": "search-vs-browse-user-behaviors",
    "trackId": "ui-ux",
    "topicIds": [
      "information-architecture"
    ],
    "difficulty": "Junior",
    "question": "كيف تختلف سلوكيات المستخدمين بين البحث (Search) والتصفح (Browse) وكيف تدعمهما معاً؟",
    "shortAnswer": "المستخدمون ينقسمون إلى نوعين: الباحثون الذين يعرفون هدفهم بدقة ويريدون الوصول الفوري، والمتصفحون الذين يستكشفون الخيارات ويحتاجون إلى إرشاد وتصنيفات ملهمة.",
    "explanation": "الباحث الموجه بالهدف (Search-dominant) يحتاج إلى شريط بحث بارز، إكمال تلقائي ذكي (Autocomplete)، دعم للأخطاء الإملائية، وفلاتر دقيقة. أما المتصفح (Browse-dominant) فيحتاج إلى قوائم مرتبة، بطاقات مقترحات، تصنيفات شهيرة، ومسارات ملاحة بصرية واضحة. التطبيق الممتاز يدعم الاثنين بسلاسة، ويتيح للباحث العودة للتصفح إذا لم يجد نتيجته الدقيقة.",
    "commonMistakes": [
      "إخفاء شريط البحث في مواقع التجارة الإلكترونية الضخمة داخل أيقونة صغيرة أو قائمة جانبية.",
      "عرض صفحة 'لا توجد نتائج' فارغة وجافة دون اقتراح مسارات بديلة أو منتجات شائعة."
    ],
    "followUpQuestions": [
      "كيف يؤثر الـ Faceted Search (البحث متعدد الأوجه) على معدلات التحويل في المتاجر الكبيرة؟",
      "ما هي أفضل ممارسات تصميم الاقتراحات التلقائية (Auto-suggestions) لمنع التشتيت؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Search Is Not Always the Best Strategy",
        "url": "https://www.nngroup.com/articles/search-not-always-best/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxia-004",
    "slug": "wayfinding-principles-and-breadcrumbs",
    "trackId": "ui-ux",
    "topicIds": [
      "information-architecture"
    ],
    "difficulty": "Mid",
    "question": "ما هي مبادئ الاستدلال المكاني (Wayfinding) وكيف تصمم مسارات فتات الخبز (Breadcrumbs) باحتراف؟",
    "shortAnswer": "الاستدلال المكاني يجيب عن 3 أسئلة دائمة في عقل المستخدم: أين أنا الآن؟ أين كنت؟ وإلى أين يمكنني الذهاب من هنا؟ وتعد Breadcrumbs الحل البصري الأمثل لذلك.",
    "explanation": "تعتبر Breadcrumbs أداة ملاحة ثانوية تدعم الملاحة الأساسية ولا تحل محلها. تنقسم إلى نوعين: هرمية قائمة على الموقع (Location-based: Home > Men > Shoes > Sneakers)، وتاريخية قائمة على المسار (Path-based). يجب دائماً جعل العنصر الأخير (الصفحة الحالية) غير قابل للنقر لتمييزه، واستخدام فواصل بصرية واضحة ومقروءة مثل '>' أو '/'.",
    "commonMistakes": [
      "استبدال القائمة الرئيسية بـ Breadcrumbs أو الاعتماد عليها وحدها في الملاحة.",
      "إظهار مسارات طويلة جداً وغير مستقرة تتغير بحسب كيفية وصول المستخدم للصفحة بدلاً من الهيكل الثابت."
    ],
    "followUpQuestions": [
      "متى تكون مسارات Breadcrumbs غير مجدية على واجهات الهواتف المحمولة؟",
      "كيف تؤثر Breadcrumbs على تحسين محركات البحث وتجربة مستخدمي Google Search؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Breadcrumbs: 11 Design Guidelines for Desktop and Mobile",
        "url": "https://www.nngroup.com/articles/breadcrumbs/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxia-005",
    "slug": "mobile-navigation-tabs-vs-hamburger-drawer",
    "trackId": "ui-ux",
    "topicIds": [
      "information-architecture"
    ],
    "difficulty": "Junior",
    "question": "قارن بين شريط التنقل السفلي (Bottom Navigation Bar) وقائمة الهامبرغر الجانبية (Hamburger Drawer) في الهواتف؟",
    "shortAnswer": "شريط التنقل السفلي يضع الأقسام الرئيسية (3 إلى 5) ظاهرة دائماً وفي متناول الإبهام، بينما قائمة الهامبرغر تخفي الملاحة وتقلل من اكتشاف المحتوى واستخدامه.",
    "explanation": "القاعدة المعروفة في الـ UX هي: 'ما يغيب عن العين يغيب عن الذهن' (Out of sight, out of mind). أظهرت الدراسات أن معدل استخدام الشاشات المخفية داخل الهامبرغر ينخفض بنسبة تصل إلى 50% مقارنة بالـ Bottom Tabs. استخدم شريط التنقل السفلي لأهم مسارات التطبيق اليومية، واقصر القائمة الجانبية على الإعدادات والصفحات الثانوية ونادراً ما يُحتاج إليها.",
    "commonMistakes": [
      "وضع أكثر من 5 خيارات في شريط التنقل السفلي مما يجعل الأزرار ضيقة ومتداخلة.",
      "إخفاء الأقسام الأساسية للمنتج داخل قائمة هامبرغر في تطبيقات المتاجر أو الخدمات الرئيسية."
    ],
    "followUpQuestions": [
      "ما هو نمط الملاحة الهجين (Tabs + More Menu) ومتى يُعتبر حلاً عملياً؟",
      "كيف يؤثر التمرير الإخفائي (Scroll-to-hide) لشريط الملاحة السفلي على تجربة القراءة؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Hamburger Menus and Hidden Navigation Hurt UX Metrics",
        "url": "https://www.nngroup.com/articles/hamburger-menus/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxia-006",
    "slug": "empty-states-and-zero-data-architecture",
    "trackId": "ui-ux",
    "topicIds": [
      "information-architecture"
    ],
    "difficulty": "Mid",
    "question": "كيف تصمم حالات الفراغ (Empty States) لتحويل الشاشات الخالية إلى فرص توجيه وتفاعل فعالة؟",
    "shortAnswer": "حالة الفراغ ليست مجرد شاشة بيضاء، بل هي مساحة إرشادية تعليمية تخبر المستخدم عن سبب فراغ الشاشة، وتوجهه بخطوة واضحة وإجراء مباشر للبدء وملء البيانات.",
    "explanation": "تحدث حالات الفراغ في عدة سياقات: عند أول استخدام للمنتج (First-use)، عند إتمام وحذف كافة المهام (Cleared/Success)، أو عند عدم العثور على نتائج بحث (No results). يجب أن تحتوي دائماً على: رسم توضيحي معبر، رسالة مقتضبة وواضحة، وزر إجراء فوري وبارز (Call to Action) مثل 'أنشئ أول مشروع لك الآن'.",
    "commonMistakes": [
      "ترك الصفحة خالية تماماً مما يدفع المستخدم للاعتقاد بأن التطبيق معطل أو فشل في الاتصال بالإنترنت.",
      "كتابة رسالة سلبية جافة مثل 'لا توجد بيانات' دون توضيح كيفية إضافة بيانات."
    ],
    "followUpQuestions": [
      "كيف تساهم بيانات العرض التوضيحية (Starter Templates) في حل مشكلة الشاشة الفارغة الأولى؟",
      "ما الفرق بين Empty State الترحيبي و Empty State الناتج عن أخطاء الاتصال؟"
    ],
    "sources": [
      {
        "title": "Material Design — Empty States and Communication",
        "url": "https://material.io/design/communication/empty-states.html"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxia-007",
    "slug": "taxonomies-vs-folksonomies-content-classification",
    "trackId": "ui-ux",
    "topicIds": [
      "information-architecture"
    ],
    "difficulty": "Senior",
    "question": "قارن بين التصنيف الصارم الموجه (Taxonomy) والتصنيف الشعبي الحر بالوسوم (Folksonomy)؟",
    "shortAnswer": "الـ Taxonomy هو هيكل هرمي منظم يتم تعريفه مسبقاً من قِبل خبراء النظام، بينما الـ Folksonomy هو تصنيف تشاركي مفتوح ينشئه المستخدمون بحرية عبر الوسوم (Tags).",
    "explanation": "الـ Taxonomy ممتاز في ضمان الدقة والتناغم ومنع تكرار الفئات (مثل التصنيفات الطبية أو أقسام المتاجر الكبرى المنظمة). لكن عيبه الجمود وبطء مواكبة المصطلحات الجديدة. أما الـ Folksonomy (كما في Twitter أو Medium) فيتميز بالمرونة والتعبير التلقائي عن اهتمامات المجتمع، لكنه يسبب فوضى ترادف وتعدد كتابة نفس الكلمة (مثل #ux و #ui_ux). الأنظمة الاحترافية تجمع بين شجرة تصنيف أساسية مدعومة بنظام وسوم مرن.",
    "commonMistakes": [
      "الاعتماد الكامل على وسوم المستخدمين دون أي هيكل تحكم، مما يجعل البحث مستحيلاً بعد نمو المحتوى.",
      "فرض تصنيفات بالغة الصرامة والتعقيد تجبر المستخدم على قضاء وقت طويل في فرز كل محتوى يرفعه."
    ],
    "followUpQuestions": [
      "كيف تصمم نظام Controlled Vocabulary يدمج المرونة مع ضبط الجودة في المنصات الكبيرة؟",
      "كيف تستخدم تحليلات البحث الداخلي لتحديث تصنيفات الموقع وتسمياته دورياً؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Tagging and Folksonomies: 7 Best Practices",
        "url": "https://www.nngroup.com/articles/tagging-best-practices/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxia-008",
    "slug": "user-onboarding-guided-tours-vs-contextual-discovery",
    "trackId": "ui-ux",
    "topicIds": [
      "information-architecture"
    ],
    "difficulty": "Mid",
    "question": "لماذا تفشل الجولات التعريفية الشاملة (Guided Tours) وما هو بديلها الأفضل في تأهيل المستخدم (Onboarding)؟",
    "shortAnswer": "الجولات التي تطلق 10 نوافذ متتالية فور فتح التطبيق تفشل لأن المستخدم يعاني من حمل معرفي زائد ويتخطاها دون قراءة؛ والبديل الأفضل هو التعلم في السياق الفعلي (Contextual / Just-in-Time Onboarding).",
    "explanation": "المستخدم يقوم بتنزيل التطبيق لإنجاز مهمة عاجلة وليس لدراسة كتالوج إرشادي. بدلاً من الجولات الإجبارية المعقدة، اعتمد على: 1) إدخال المستخدم فورا في تجربة القيمة الأساسية (Time-to-Value). 2) تقديم التلميحات البسيطة (Tooltips) في اللحظة التي يحتاج إليها المستخدم فقط أثناء سيره في التدفق. 3) توفير عينات محتوى تفاعلية يجرب التعديل عليها.",
    "commonMistakes": [
      "حجب الشاشة بسلسلة طويلة من النوافذ المنبثقة الإجبارية فور أول تشغيل للتطبيق.",
      "شرح كل عناصر الواجهة الواضحة بديهياً والتركيز على أزرار عادية بدلاً من القيمة الفريدة للمنتج."
    ],
    "followUpQuestions": [
      "ما هو مؤشر Time to Value (TTV) وكيف يؤثر تقليصه على نسبة التمسك بالمنتج (Retention)؟",
      "كيف تصمم شاشات جمع التفضيلات الأولية دون تحويلها إلى استمارة مرهقة؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Mobile Onboarding: 8 Guidelines",
        "url": "https://www.nngroup.com/articles/mobile-onboarding/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxia-009",
    "slug": "content-audit-and-content-modeling",
    "trackId": "ui-ux",
    "topicIds": [
      "information-architecture"
    ],
    "difficulty": "Senior",
    "question": "ما هي منهجية تدقيق المحتوى (Content Audit) وبناء نموذج المحتوى (Content Modeling) في مشاريع إعادة التصميم؟",
    "shortAnswer": "تدقيق المحتوى هو حصر وتقييم شامل لكل المحتوى الحالي لمعرفة ما يجب حذفه أو تحديثه أو دمجه، بينما نمذجة المحتوى هي تفكيك المحتوى إلى عناصره البنائية المستقلة عن التصميم الشكلي.",
    "explanation": "في تدقيق المحتوى (ROT Analysis)، نفحص كل صفحة لتحديد هل المحتوى متكرر (Redundant)، قديم (Outdated)، أو تافه (Trivial). في نمذجة المحتوى، نقوم بتجريد نوع المحتوى (مثلاً 'دورة تدريبية') إلى حقوله الأساسية: عنوان، مدرب، مدة، متطلبات سابقة، ونتائج تعليمية. هذا يضمن أن بنية المحتوى مرنة وقابلة للعرض في أي شاشة وتغذية الـ Headless CMS دون الاعتماد على صفحة ثابتة واحدة.",
    "commonMistakes": [
      "نقل كافة ملفات ومقالات الموقع القديم إلى التصميم الجديد دون فحص جودتها وحداثتها.",
      "تصميم قوالب الصفحات بناءً على نصوص وهمية (Lorem Ipsum) دون معرفة أطوال المحتوى الواقعي وطبيعته."
    ],
    "followUpQuestions": [
      "كيف يمنع تدقيق المحتوى انهيار التصميمات في مرحلة إدخال البيانات الحقيقية؟",
      "ما الفرق بين تدقيق المحتوى الكمي (Inventory) والتدقيق النوعي (Qualitative Assessment)؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Content Audits and Inventories",
        "url": "https://www.nngroup.com/articles/content-audits/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxia-010",
    "slug": "cross-platform-ia-parity-vs-platform-conventions",
    "trackId": "ui-ux",
    "topicIds": [
      "information-architecture"
    ],
    "difficulty": "Senior",
    "question": "كيف توازن في هندسة المعلومات بين التماثل عبر المنصات (Parity) واحترام خصوصية المنصة (iOS vs Android vs Web)؟",
    "shortAnswer": "الحل هو توحيد النموذج الذهني وبنية البيانات والمهام الأساسية، مع تكييف أدوات التحكم والملاحة والأنماط التفاعلية لكل منصة بحسب معاييرها الخاصة.",
    "explanation": "يجب أن تكون المصطلحات ونطاق الميزات وحساب المستخدم متطابقة على كل الأجهزة حتى لا يشعر المستخدم بنقص عند التبديل بين اللابتوب والهاتف. ومع ذلك، في iOS يجب اتباع Human Interface Guidelines (مثل أشرطة الأدوات العلوية وزر العودة بالتمرير السريع)، وفي Android اتباع Material Design (مثل أزرار FAB وتصرف زر الرجوع على مستوى النظام). فرض تصميم iOS على Android أو العكس يدمر الراحة الذهنية للمستخدم.",
    "commonMistakes": [
      "نسخ واجهة موقع الويب حرفياً داخل تطبيق الهاتف دون مراعاة قيود شاشات اللمس.",
      "تطبيق نمط مرئي خاص بنظام تشغيل معين على النظام المنافس (مثل نقل شريط علامات تبويب iOS لأسفل تطبيق أندرويد بطريقة تخالف العادات)."
    ],
    "followUpQuestions": [
      "كيف تترجم القوائم المعقدة الضخمة على الويب المكتبي (Mega Menus) إلى شاشات الهواتف بذكاء؟",
      "ما هي استراتيجية Adaptive IA في دعم الشاشات القابلة للطي (Foldables) والأجهزة اللوحية؟"
    ],
    "sources": [
      {
        "title": "Apple Developer — Human Interface Guidelines",
        "url": "https://developer.apple.com/design/human-interface-guidelines/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxpr-001",
    "slug": "low-fidelity-vs-high-fidelity-prototyping",
    "trackId": "ui-ux",
    "topicIds": [
      "wireframing-prototyping"
    ],
    "difficulty": "Junior",
    "question": "متى تستخدم النماذج الأولية منخفضة الدقة (Low-Fi) ومتى تنتقل إلى عالية الدقة (High-Fi)؟",
    "shortAnswer": "النماذج منخفضة الدقة (الورقية والمخططات السلكية البسيطة) تُستخدم في المراحل المبكرة لاختبار المفاهيم والتدفقات بسرعة وبأقل تكلفة، بينما عالية الدقة تُستخدم لاختبار التفاعل والجماليات الدقيقة قبل التطوير البرمجي.",
    "explanation": "إذا عرضت تصميماً عالي الدقة مبكراً، سينشغل أصحاب المصلحة والمستخدمون بمناقشة درجات الألوان وظلال الأزرار ويتجاهلون المنطق المعماري والخلل في رحلة المستخدم. النماذج السلكية بالأبيض والأسود ترغم الجميع على التركيز على المحتوى، التسلسل الهرمي، وهل الفكرة تحل المشكلة أصلاً. بمجرد استقرار الهيكل، ننتقل للنماذج عالية الدقة المزودة بأنظمة الألوان والحركات الواقعية.",
    "commonMistakes": [
      "البدء في Figma برسم أيقونات وألوان وتفاصيل دقيقة في أول جلسة عصف ذهني للمشروع.",
      "اختبار سهولة قراءة النصوص وتباين الألوان عبر نماذج سلكية منخفضة الدقة."
    ],
    "followUpQuestions": [
      "كيف يؤثر نوع النموذج الأولي على صدق ومصداقية ملاحظات المستخدمين في جلسات الاختبار؟",
      "ما هي مخاطر الوقوع في حب النموذج الأولي الأول (IKEA Effect) وكيف تتفاداها؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Prototyping: Low-Fidelity vs. High-Fidelity",
        "url": "https://www.nngroup.com/articles/ux-prototype-hi-lo-fidelity/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxpr-002",
    "slug": "rapid-prototyping-build-measure-learn",
    "trackId": "ui-ux",
    "topicIds": [
      "wireframing-prototyping"
    ],
    "difficulty": "Mid",
    "question": "ما هي دورة النماذج الأولية السريعة (Rapid Prototyping Cycle: Build - Measure - Learn)؟",
    "shortAnswer": "هي عملية تكرارية تهدف إلى بناء نموذج أولي سريع بأقل جهد، واختباره فوراً مع مستخدمين حقيقيين، والتعلم من النتائج لتحسين الفكرة في جولات متتالية قصيرة.",
    "explanation": "الهدف ليس صناعة نموذج مثالي، بل الإجابة عن سؤال محدد أو التحقق من فرضية بأسرع وقت (Failing Fast & Cheap). بدلاً من قضاء شهرين في إعداد مواصفات نظرية، يصمم الفريق نموذجاً في يومين، ويختبره مع 5 مستخدمين في اليوم الثالث، ويحلل المخرجات في اليوم الرابع لتقرير: هل نعدل المسار (Pivot) أم نستمر ونعمق التفاصيل؟",
    "commonMistakes": [
      "التعامل مع النموذج الأولي كأنه كود نهائي قابل للشحن، مما يبطئ وتيرة التعديل والتجربة.",
      "تجاهل نتائج الاختبار والتمسك بالتصميم فقط لأن الفريق بذل فيه وقتاً كبيراً."
    ],
    "followUpQuestions": [
      "كيف تضع فرضيات قابلة للقياس (Testable Hypotheses) قبل البدء في رسم النموذج؟",
      "ما الفرق بين إثبات المفهوم (PoC) والنموذج الأولي التفاعلي (Prototype)؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Rapid Prototyping: What It Is and How to Do It",
        "url": "https://www.nngroup.com/articles/rapid-prototyping/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxpr-003",
    "slug": "micro-interactions-four-parts-dan-saffer",
    "trackId": "ui-ux",
    "topicIds": [
      "wireframing-prototyping"
    ],
    "difficulty": "Mid",
    "question": "ما هي الأجزاء الأربعة المكونة للتفاعل الدقيق (Micro-interaction) وفقاً لدان سافر (Dan Saffer)؟",
    "shortAnswer": "يتكون كل تفاعل دقيق من 4 أجزاء: 1) المُشغّل (Trigger). 2) القواعد (Rules). 3) التغذية الراجعة (Feedback). 4) الحلقات والأوضاع (Loops & Modes).",
    "explanation": "المُشغّل يبدأ التفاعل (قد يكون يدوياً بنقر زر، أو نظامياً كوصول إشعار). القواعد تحدد ما يحدث برمجياً فور تفعيل المشغل (مثل: لا يمكنك الإرسال إذا كان الحقل فارغاً). التغذية الراجعة تُعلم المستخدم بما حدث بصرياً أو صوتياً أو بالاهتزاز (مثل تحول الزر لعلامة صح واهتزاز الهاتف). الحلقات والأوضاع تحدد ما يحدث مع مرور الوقت أو إذا تكرر الإجراء (مثل زر 'تذكرني' أو تغيير حالة الزر بعد أول نقرة).",
    "commonMistakes": [
      "إضافة حركات جمالية مبهرة لا تقدم أي تغذية راجعة وظيفية للمستخدم حول حالة النظام.",
      "تجاهل تحديد القواعد المنطقية والحالات الاستثنائية للتفاعل والاكتفاء برسم الحالة المثالية."
    ],
    "followUpQuestions": [
      "كيف تمنع تحول التفاعلات الدقيقة المبهجة إلى مصدر إزعاج وتشتيت عند الاستخدام اليومي المتكرر؟",
      "ما هي أفضل الأدوات المتقدمة لمحاكاة التفاعلات الدقيقة المعقدة (مثل Protopie و Framer)؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Microinteractions in User Experience",
        "url": "https://www.nngroup.com/articles/microinteractions/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxpr-004",
    "slug": "designing-for-edge-cases-and-unhappy-paths",
    "trackId": "ui-ux",
    "topicIds": [
      "wireframing-prototyping"
    ],
    "difficulty": "Senior",
    "question": "لماذا يفشل التصميم الذي يقتصر على المسار المثالي (Happy Path) وكيف تصمم للحالات الحدية (Edge Cases)؟",
    "shortAnswer": "المسار المثالي يمثل جزءاً يسيراً من الواقع؛ إهمال الحالات الحدية (مثل بطء الاتصال، النصوص الطويلة، الصلاحيات المرفوضة، والأرصدة الصفرية) يؤدي لانهيار تجربة المستخدم في بيئة الإنتاج.",
    "explanation": "المصمم المحترف يصمم للحالات الصعبة أولاً: 1) نصوص بأسماء طويلة تكسر تخطيط البطاقات. 2) لغات تكتب من اليمين لليسار (RTL) مقارنة بـ LTR. 3) حالات انقطاع الإنترنت وإعادة المحاولة. 4) الإدخال بحروف ورموز غير متوقعة. 5) حالات انتهاء صلاحية الجلسة أثناء كتابة نموذج طويل. توثيق هذه السيناريوهات يحمي التطبيق من التوقف غير المتوقع ويوفر إرشادات استرداد بديهية.",
    "commonMistakes": [
      "استخدام نصوص قصيرة ومثالية من كلمتين في النماذج وتفاجؤ الفريق بكسر التصميم بالبيانات الحقيقية.",
      "ترك حالات الخطأ دون توجيه المستخدم لكيفية حل المشكلة أو المحاولة لاحقاً."
    ],
    "followUpQuestions": [
      "كيف تصنع مصفوفة حالات الحافة (Edge-Case Matrix) بالتعاون مع مهندسي البرمجيات والـ QA؟",
      "كيف تصمم استراتيجيات التراجع التلقائي (Graceful Degradation) عند فشل خدمات الطرف الثالث؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Error Message Guidelines",
        "url": "https://www.nngroup.com/articles/error-message-guidelines/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxpr-005",
    "slug": "developer-handoff-specifications-and-tokens",
    "trackId": "ui-ux",
    "topicIds": [
      "wireframing-prototyping"
    ],
    "difficulty": "Mid",
    "question": "ما هي المكونات الأساسية لتسليم التصميم للمطورين (Design Handoff) لضمان دقة التنفيذ؟",
    "shortAnswer": "التسليم الناجح يتجاوز مجرد مشاركة رابط Figma؛ بل يتطلب توفير: توثيق الحالات المختلفة للمكونات، محاذاة Design Tokens مع كود البرمجة، وتحديد قواعد التجاوب وقيود التخطيط (Responsive Constraints).",
    "explanation": "يجب أن يتضمن ملف التسليم: 1) شجرة المكونات وحالاتها (Default, Hover, Active, Focused, Disabled, Error, Loading). 2) تحديد التباعد باستخدام مقياس الـ 8pt والرموز الدلالية (Spacing Tokens). 3) تحديد سلوك الخطوط والنصوص الطويلة (Truncation vs Multiline Wrap). 4) مواصفات الرسوم المتحركة (المدة، منحنى التسارع Easing Curve). الجلوس في جلسة مراجعة مسبقة (Pre-handoff Walkthrough) يمنع إعادة العمل وسوء الفهم.",
    "commonMistakes": [
      "تسليم إطارات ثابتة غير مرتبطة بمكونات ودون تحديد ما يحدث على شاشات الهواتف المختلفة.",
      "استخدام قيم ألوان ومسافات اعتباطية (Hardcoded Values) تخالف نظام التصميم المشترك مع المطورين."
    ],
    "followUpQuestions": [
      "كيف تسهم أدوات مثل Figma Dev Mode و Storybook في تضييق الفجوة بين التصميم والإنتاج؟",
      "ما هي أفضل صيغة لتوثيق المنطق التفاعلي المعقد (Interactive Logic) للواجهات المعقدة؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Design Handoff: Collaborative Workflows",
        "url": "https://www.nngroup.com/articles/design-handoff/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxpr-006",
    "slug": "storyboarding-and-scenario-based-prototyping",
    "trackId": "ui-ux",
    "topicIds": [
      "wireframing-prototyping"
    ],
    "difficulty": "Junior",
    "question": "ما هو التخطيط القصصي (Storyboarding) وكيف يساعد الفريق في فهم السياق الإنساني لاستخدام المنتج؟",
    "shortAnswer": "هو تمثيل بصري متسلسل يشبه القصص المصورة يوضح كيف ومتى ولماذا يستخدم شخص ما المنتج في حياته اليومية لحل مشكلة واقعية.",
    "explanation": "القصص المصورة لا تركز على عناصر الواجهة أو الأزرار، بل على البيئة والمشاعر والسياق المحيط بالمستخدم: هل هو يركب الحافلة ممسكاً بالهاتف بيد واحدة وضوء الشمس يعمي الشاشة؟ هل هو في مكتب هادئ أم في مستودع صاخب؟ هذا السياق يوضح للفريق لماذا نحتاج لأزرار ضخمة أو تباين لوني عالٍ أو تغذية راجعة صوتية، مما يجعل قرارات التصميم مبررة إنسانياً.",
    "commonMistakes": [
      "رسم شاشات التطبيق داخل إطارات القصة بدلاً من رسم المستخدم وتفاعله مع بيئته الحقيقية.",
      "المبالغة في جودة الرسم الفني وإضاعة الوقت بدلاً من التركيز على سرد المشكلة والحل بوضوح."
    ],
    "followUpQuestions": [
      "كيف يساعد Storyboarding في مواءمة الرؤية بين فريقي إدارة المنتجات والتسويق مع المصممين؟",
      "ما الفرق بين السيناريو النصي (User Scenario) والقصة المصورة البصرية (Storyboard)؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Storyboards Help Visualize UX Ideas",
        "url": "https://www.nngroup.com/articles/storyboards-visualize-ideas/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxpr-007",
    "slug": "testing-with-realistic-data-vs-lorem-ipsum",
    "trackId": "ui-ux",
    "topicIds": [
      "wireframing-prototyping"
    ],
    "difficulty": "Mid",
    "question": "لماذا يعد استخدام النصوص الوهمية (Lorem Ipsum) والصور المثالية خطراً كبيراً في النماذج الأولية؟",
    "shortAnswer": "لأن البيانات الحقيقية تتميز بالتفاوت وعدم التناسق، واستخدام نصوص وهمية يخلق وهماً زائفاً بنظافة التخطيط ويحجب مشاكل القراءة والكسر التي تظهر فور تغذية النظام ببيانات الواقع.",
    "explanation": "في الواقع، قد يكون اسم المستخدم 'محمد' المكون من 4 أحرف أو اسماً ألمانياً مركباً من 35 حرفاً. صور المنتجات في الحياة الواقعية قد تكون رديئة الإضاءة وذات خلفيات غير متجانسة وليست كصور النماذج الإعلانية. ملء النماذج الأولية بمحتوى واقعي ومترجم يكشف عيوب المساحات، ويساعد المشاركين في اختبارات قابلية الاستخدام على التفاعل بجدية وتصديق التجربة.",
    "commonMistakes": [
      "اختبار الواجهات بنصوص لاتينية لا يفهمها المستخدم، مما يشتت انتباهه في محاولة فك الكلمات.",
      "تصميم بطاقات المنتجات معتمدة على صور ذات خلفية بيضاء نقية تتشوه بمجرد رفع صور حقيقية."
    ],
    "followUpQuestions": [
      "كيف تستخدم ملحقات Figma لجلب بيانات حقيقية من Google Sheets أو APIs أثناء التصميم؟",
      "كيف تصمم حلول التراجع للنصوص الطويلة (Text Clamping and Tooltips)؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Why Real Content Matters in Prototypes",
        "url": "https://www.nngroup.com/articles/real-content-prototypes/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxpr-008",
    "slug": "service-blueprints-vs-user-journey-maps",
    "trackId": "ui-ux",
    "topicIds": [
      "wireframing-prototyping"
    ],
    "difficulty": "Senior",
    "question": "ما هو مخطط الخدمة (Service Blueprint) وما الفرق بين كواليس الواجهة (Frontstage) وخلفيتها (Backstage)؟",
    "shortAnswer": "مخطط الخدمة هو خريطة تفصيلية توضح كيف تدعم العمليات الداخلية والتقنية في الكواليس (Backstage) رحلة المستخدم وتفاعلاته الظاهرة على السطح (Frontstage).",
    "explanation": "بينما تركز خريطة رحلة العميل على مشاعر وتصرفات المستخدم فقط، يتعمق الـ Service Blueprint ليوضح ما يجب أن يفعله الموظفون الداخليون، الأنظمة البرمجية، وقواعد البيانات في كل خطوة لجعل تلك التجربة ممكنة. يشمل 5 طبقات: إجراءات العميل، أفعال الواجهة الظاهرة (Frontstage)، أفعال الكواليس الخفية (Backstage)، العمليات والأنظمة الداعمة، والأدلة المادية.",
    "commonMistakes": [
      "تصميم تجربة مستخدم مبهرة على الشاشة دون التحقق من إمكانية تنفيذ الأنظمة اللوجستية والتقنية لدعمها.",
      "الخلط بين رحلة المستخدم التي تركز على العميل ومخطط الخدمة الذي يدمج العمليات التشغيلية للمنظمة."
    ],
    "followUpQuestions": [
      "ما هو 'خط الرؤية' (Line of Visibility) في مخطط الخدمة وما أهميته؟",
      "كيف يكشف Service Blueprint نقاط الاختناق (Bottlenecks) في تطبيقات التوصيل والخدمات اللوجستية؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Service Blueprints: Definition",
        "url": "https://www.nngroup.com/articles/service-blueprints-definition/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxpr-009",
    "slug": "interactive-prototyping-logic-and-variables",
    "trackId": "ui-ux",
    "topicIds": [
      "wireframing-prototyping"
    ],
    "difficulty": "Senior",
    "question": "كيف تنقل النماذج الأولية من شاشات ثابتة مترابطة إلى نماذج ذكية معتمدة على المتغيرات والشروط (Variables & Logic)؟",
    "shortAnswer": "باستخدام ميزات المتغيرات (Variables)، التعبيرات الرياضية، والعبارات الشرطية (Conditionals) لمحاكاة سلوك التطبيق الحقيقي كأنظمة السلال والحسابات وتسجيل الدخول دون الحاجة لبرمجة كود حقيقي.",
    "explanation": "النماذج التقليدية كانت تتطلب إنشاء 20 شاشة مكررة لمحاكاة إضافة عنصر لسلة التسوق وتعديل كميته وحساب المجموع الكلي. في النماذج المتقدمة الحديثة، يتم استخدام متغير رقمي (CartCount) يتغير بالنقر على زر (+) أو (-)، مع شروط (If CartCount == 0 show EmptyState). هذا يرفع دقة اختبارات قابلية الاستخدام ويسمح للمستخدمين بتجربة مدخلاتهم الخاصة بحرية تامة.",
    "commonMistakes": [
      "المبالغة في برمجة النماذج المعقدة جداً التي تستغرق أسابيع بدلاً من إنتاج كود أولي حقيقي.",
      "الاعتماد على روابط الشاشات المباشرة فقط في اختبارات تعتمد على التفاعل الحسابي والبيانات."
    ],
    "followUpQuestions": [
      "متى يكون استخدام أدوات متقدمة مثل ProtoPie أو Framer ضرورياً مقارنة بنماذج Figma؟",
      "كيف تساهم النماذج المبنية على المتغيرات في اختبار حالات الدفع متعددة الخطوات بواقعية تامة؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Interactive Prototypes in UX Testing",
        "url": "https://www.nngroup.com/articles/ux-prototype-hi-lo-fidelity/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxpr-010",
    "slug": "wizard-and-stepper-complex-workflows",
    "trackId": "ui-ux",
    "topicIds": [
      "wireframing-prototyping"
    ],
    "difficulty": "Mid",
    "question": "كيف تصمم المعالجات التدريجية (Wizards / Steppers) للمهام المعقدة دون خلق إحباط لدى المستخدم؟",
    "shortAnswer": "بتجزئة العملية الطويلة المرهقة إلى خطوات منطقية صغيرة ومترابطة، مع إظهار مؤشر تقدم واضح، وتمكين المستخدم من الحفظ والتراجع بحرية دون فقدان البيانات.",
    "explanation": "أفضل ممارسات الـ Stepper: 1) إظهار عدد الخطوات ومسمياتها بوضوح (الخطوة 2 من 4: بيانات الشحن). 2) السماح بالتنقل للخطوات السابقة لتعديل البيانات وتأكيد حفظ المسودات تلقائياً. 3) تخصيص كل خطوة لموضوع واحد متجانس. 4) عرض شاشة مراجعة نهائية (Review & Confirm) قبل التنفيذ المصيري.",
    "commonMistakes": [
      "إخفاء إجمالي عدد الخطوات مما يجعل المستخدم يشعر بنفق لا نهائي ويدفعه للتخلي عن العملية.",
      "مسح البيانات المدخلة في الخطوات السابقة بمجرد نقر المستخدم على زر 'السابق'."
    ],
    "followUpQuestions": [
      "متى يكون Stepper الأفقي أفضل من الرأسي في واجهات الهواتف والويب؟",
      "كيف تصمم معالجاً مرناً يدعم الخطوات الاختيارية والمسارات المتشعبة (Conditional Branching)؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Wizards: Definition and Design Recommendations",
        "url": "https://www.nngroup.com/articles/wizards/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxds-001",
    "slug": "design-system-vs-component-library-vs-style-guide",
    "trackId": "ui-ux",
    "topicIds": [
      "ui-design-systems"
    ],
    "difficulty": "Junior",
    "question": "ما الفرق بين نظام التصميم (Design System) ومكتبة المكونات (Component Library) ودليل الأسلوب (Style Guide)؟",
    "shortAnswer": "دليل الأسلوب يحدد الهوية البصرية (ألوان وخطوط)، ومكتبة المكونات توفر عناصر برمجية قابلة لإعادة الاستخدام، بينما نظام التصميم هو المنظومة الشاملة التي تدمج الأدلة والمكونات والقواعد والمعايير والحوكمة.",
    "explanation": "دليل الأسلوب (Style Guide) وثيقة توضح كيفية تمثيل العلامة التجارية بصرياً. مكتبة المكونات (Component Library) هي كود برمجي (مثل React components أو ملف Figma) يحتوي عناصر جاهزة كالأزرار والحقول. أما نظام التصميم (Design System) فهو 'المنتج الذي يخدم المنتجات الأخرى'؛ يشمل المكونات البرمجية، رموز التصميم (Tokens)، إرشادات إمكانية الوصول، نبرة الصوت (Tone of Voice)، وأساليب الحوكمة والمساهمة بين المصممين والمطورين.",
    "commonMistakes": [
      "اعتبار ملف Figma الذي يضم مجموعة أزرار وألوان نظام تصميم متكامل.",
      "بناء مكتبة مكونات برمجية دون توثيق مبادئ استخدامها وقواعد تفاعلها."
    ],
    "followUpQuestions": [
      "كيف تبرر للإدارة الاستثمار في بناء نظام تصميم بدلاً من المكونات العشوائية؟",
      "ما هي دورة حياة المكون داخل نظام التصميم من الاقتراح حتى الاستهلاك؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Design Systems 101",
        "url": "https://www.nngroup.com/articles/design-systems-101/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxds-002",
    "slug": "atomic-design-methodology-brad-frost",
    "trackId": "ui-ux",
    "topicIds": [
      "ui-design-systems"
    ],
    "difficulty": "Junior",
    "question": "ما هي منهجية التصميم الذري (Atomic Design) لبراد فروست (Brad Frost) وما هي مراحلها الخمس؟",
    "shortAnswer": "هي منهجية لتفكيك الواجهات وبنائها هرمياً من أصغر العناصر إلى أكملها، وتشمل: الذرات (Atoms)، الجزيئات (Molecules)، الكائنات (Organisms)، القوالب (Templates)، والصفحات (Pages).",
    "explanation": "الذرات هي العناصر غير القابلة للتجزئة (الألوان، الخطوط، الأزرار الفردية، وحقول الإدخال). الجزيئات تجمع ذرتين أو أكثر لتعمل معاً كوحدة وظيفية (مثل حقل بحث مدمج به زر 'بحث'). الكائنات تدمج عدة جزيئات لتكوين قسم مستقل من الواجهة (مثل الهيدر الكامل أو بطاقة منتج تفاعلية). القوالب ترتب الكائنات في تخطيط هيكلي خالي من المحتوى. وأخيراً الصفحات تملأ القوالب بالمحتوى والبيانات الواقعية لاختبار قوة التصميم.",
    "commonMistakes": [
      "التعامل مع التصميم الذري كعملية خطية جامدة بدلاً من كونه أسلوباً ذهنياً لفهم العلاقات التركيبية.",
      "إنشاء جزيئات معقدة جداً يصعب إعادة استخدامها في سياقات مختلفة."
    ],
    "followUpQuestions": [
      "كيف تنعكس مراحل التصميم الذري على تنظيم المجلدات في Figma ومكتبات React/Flutter؟",
      "ما الفرق بين القالب (Template) والصفحة (Page) في قياس مرونة التصميم؟"
    ],
    "sources": [
      {
        "title": "Material Design — Understanding Layout and Components",
        "url": "https://material.io/design/layout/understanding-layout.html"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxds-003",
    "slug": "design-tokens-levels-and-architecture",
    "trackId": "ui-ux",
    "topicIds": [
      "ui-design-systems"
    ],
    "difficulty": "Senior",
    "question": "ما هي رموز التصميم (Design Tokens) وما الفرق بين المستويات العالمية والدلالية والخاصة بالمكون؟",
    "shortAnswer": "رموز التصميم هي القرارات البصرية المجردة المخزنة كمتغيرات مستقلة عن المنصة (مثل JSON)، وتنقسم إلى 3 طبقات: الرموز العالمية (Global)، الرموز الدلالية (Semantic/Alias)، والرموز المخصصة للمكون (Component-specific).",
    "explanation": "الرموز العالمية تعرف القيم الخام المجردة (مثل: color-blue-500 = #0066FF). الرموز الدلالية تصف الغرض الوظيفي للرمز وترتبط بالرمز العالمي (مثل: color-action-primary = color-blue-500). رموز المكون تخصص الاستخدام لعنصر محدد (مثل: button-primary-bg = color-action-primary). هذه المعمارية ثلاثية الطبقات هي ما يتيح دعم الوضع الليلي وتعدد العلامات التجارية (Multi-brand) بضغطة زر واحدة دون لمس كود المكونات.",
    "commonMistakes": [
      "ربط المكونات مباشرة بالرموز العالمية الخام (مثل كتابة blue-500 للزر)، مما يجعل تفعيل الوضع الليلي مستحيلاً لاحقاً.",
      "تسمية الرموز الدلالية بأسماء ألوان بدلاً من وظيفتها (مثل تسمية الخلفية bg-white بدلاً من bg-surface)."
    ],
    "followUpQuestions": [
      "كيف تحول أداة Style Dictionary رموز JSON إلى متغيرات CSS وSwift وKotlin آلياً؟",
      "كيف تدير الـ Modes في Figma Variables لمحاكاة الثيمات المتعددة بسلاسة؟"
    ],
    "sources": [
      {
        "title": "Material Design — Design Tokens Architecture",
        "url": "https://material.io/blog/design-tokens"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxds-004",
    "slug": "figma-auto-layout-and-component-properties",
    "trackId": "ui-ux",
    "topicIds": [
      "ui-design-systems"
    ],
    "difficulty": "Mid",
    "question": "كيف تبني مكونات مرنة واحترافية في Figma باستخدام Auto Layout و Component Properties؟",
    "shortAnswer": "باستخدام Auto Layout لمحاكاة نموذج Flexbox البرمجي، وتوظيف خصائص المكونات (Boolean, Text, Instance Swap, Variant) لتقليص عدد أشكال المكونات وجعلها متوافقة تماماً مع الكود.",
    "explanation": "قديماً كان المصممون ينسخون مئات التوليفات لزر واحد ليغطوا الأيقونة والحجم والحالة. مع Component Properties الحديثة، يُنشأ مكون واحد بخاصية Boolean لإظهار الأيقونة، وخاصية Text لتعديل التسمية، و Variant لتغيير الحجم أو الثيم. يضمن Auto Layout تمدد الأزرار والبطاقات وانكماشها تلقائياً عند تغيير النصوص، محاكياً بدقة سلوك متصفحات الويب وشاشات الهواتف.",
    "commonMistakes": [
      "استخدام التجميع العادي (Group) بدلاً من الإطارات المتجاوبة (Auto Layout Frames) في بناء المكونات.",
      "تفجير عدد الـ Variants لعشرات العناصر المتشابهة بدلاً من استخدام خصائص المكونات الذكية."
    ],
    "followUpQuestions": [
      "ما الفرق بين قيود التمدد (Fill Container) والاحتواء (Hug Contents) والثبات (Fixed Width)؟",
      "كيف تصمم بطاقة متجاوبة بالكامل تتكيف مع كافة أحجام الشاشات دون تشوه عناصرها؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Component-Based Design in UI Systems",
        "url": "https://www.nngroup.com/articles/design-systems-101/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxds-005",
    "slug": "design-system-governance-and-contribution-models",
    "trackId": "ui-ux",
    "topicIds": [
      "ui-design-systems"
    ],
    "difficulty": "Senior",
    "question": "كيف تدير حوكمة نظام التصميم (Design System Governance) ونماذج المساهمة لمنع الفوضى أو الجمود؟",
    "shortAnswer": "باعتماد نموذج مساهمة هجين وتعيين فريق أساسي (Core Team) يضع المعايير ويدير مراجعات المكونات، مع فتح الباب للمصممين والمطورين لتقديم مقترحات واحتياجات جديدة عبر مسار تدقيق معتمد (RFC Process).",
    "explanation": "الحوكمة الصارمة المركزية تصيب النظام بالجمود وتدفع الفرق لتجاوزه وبناء حلول خاصة سرية. الحوكمة الفوضوية تلوث النظام بمكونات عشوائية مكررة. النموذج الأمثل هو 'الاتحادي' (Federated Model): المصممون في فرق المنتجات يحددون الاحتياجات الجديدة ويصنعون مسوداتها، بينما الفريق الأساسي يراجع توافقها مع إمكانية الوصول وDesign Tokens ويضمن تعميمها على الجميع بعد اعتمادها.",
    "commonMistakes": [
      "إغلاق نظام التصميم ومنع أي تعديل أو إضافة، مما يجبر الفرق على كسر النظام وتكرار العمل المنفصل.",
      "قبول أي مكون يرسله أي مصمم وإضافته للمكتبة العامة دون تدقيق لتوحيد المعايير."
    ],
    "followUpQuestions": [
      "ما هي معايير قبول مكون جديد (Acceptance Criteria) في نظام التصميم المؤسسي؟",
      "كيف تدير دورة التغييرات الجذرية (Breaking Changes) وإصدار النسخ وفق معيار Semantic Versioning؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — A Governance Process for Design Systems",
        "url": "https://www.nngroup.com/articles/design-system-governance/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxds-006",
    "slug": "theming-and-multi-brand-design-systems",
    "trackId": "ui-ux",
    "topicIds": [
      "ui-design-systems"
    ],
    "difficulty": "Senior",
    "question": "كيف تصمم معمارية نظام تصميم يدعم علامات تجارية متعددة (Multi-brand) والوضع الليلي (Dark Mode)؟",
    "shortAnswer": "بفصل بنية المكون ومنطقه الهيكلي عن مظهره البصري، واستبدال كافة القيم اللونية المباشرة برموز دلالية (Semantic Tokens) تتغير قيمتها بحسب السياق أو الثيم المفعل.",
    "explanation": "في النظام متعدد العلامات (مثل شركة تمتلك 3 تطبيقات تابعة)، يكون للمكون (مثل بطاقة المنتج) نفس تخطيط Auto Layout ونفس قواعد التفاعل. تختلف العلامات عبر ملف الرموز الدلالية فقط: العلامة (أ) تستخدم درجات أزرق وزوايا مستديرة (radius-sm)، والعلامة (ب) تستخدم درجات أسود وزوايا حادة (radius-none). عند تفعيل الوضع الليلي، يُعاد تعيين الرموز الدلالية السطحية (Surface Tokens) لدرجات معتمة دون الحاجة لإنشاء مكونات جديدة.",
    "commonMistakes": [
      "إنشاء مكتبة مكونات كاملة منفصلة لكل علامة تجارية أو لكل وضع إضاءة، مما يضاعف تكلفة الصيانة.",
      "استخدام قيم ألوان مباشرة (Hardcoded Hex Codes) داخل كود المكونات البرمجية أو إطارات Figma."
    ],
    "followUpQuestions": [
      "كيف تتفادى مشاكل تباين الألوان التلقائي عند قلب الثيم من الفاتح إلى الداكن؟",
      "ما هي استراتيجية Elevation Tokens (طبقات الارتفاع) في الوضع الليلي دون استخدام ظلال مفرطة؟"
    ],
    "sources": [
      {
        "title": "Material Design — Dark Theme Implementation and Contrast",
        "url": "https://material.io/design/color/dark-theme.html"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxds-007",
    "slug": "measuring-design-system-adoption-and-roi",
    "trackId": "ui-ux",
    "topicIds": [
      "ui-design-systems"
    ],
    "difficulty": "Senior",
    "question": "كيف تقيس معدل تبني نظام التصميم (Adoption Rate) وعائد الاستثمار (ROI) للشركة؟",
    "shortAnswer": "عبر قياس نسبة المكونات البرمجية المشتقة من النظام في كود الإنتاج مقارنة بالمكونات المخصصة، وحساب تسريع وتيرة شحن الميزات وانخفاض أخطاء التصميم وإعادة العمل.",
    "explanation": "مؤشرات الأداء الأساسية (KPIs) لنظام التصميم تشمل: 1) نسبة التغطية (Figma & Code Component Coverage). 2) استخدام Design Tokens في الكود. 3) وقت إطلاق الميزات الجديدة (Time to Market) مقارنة بالفترة السابقة للنظام. 4) توفير ساعات العمل المحسوبة بضرب عدد المصممين والمطورين في الساعات الموفرة شهرياً، مما يثبت الجدوى المالية المباشرة لإدارة الشركة.",
    "commonMistakes": [
      "قياس نجاح نظام التصميم بعدد المكونات المنشورة في Figma بدلاً من نسبة استهلاكها الفعلية في الإنتاج.",
      "تجاهل استطلاعات رضا المصممين والمطورين واستجابتهم لتحديثات النظام الدورية."
    ],
    "followUpQuestions": [
      "كيف تستخدم أدوات الفحص الآلي (Linters) لحساب نسبة الرموز المخصصة غير المعتمدة في الكود؟",
      "ما هي استراتيجية إقناع الفرق المتأخرة بالهجرة التدريجية إلى نظام التصميم الموحد؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Measuring the Impact of Design Systems",
        "url": "https://www.nngroup.com/articles/design-systems-101/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxds-008",
    "slug": "responsive-grids-and-8pt-spacing-system",
    "trackId": "ui-ux",
    "topicIds": [
      "ui-design-systems"
    ],
    "difficulty": "Junior",
    "question": "لماذا تعتمد معظم أنظمة التصميم العالمية على مقياس التباعد بـ 8 نقاط (8pt Spacing Grid)؟",
    "shortAnswer": "لأن الرقم 8 قابل للقسمة والمضاعفة بسهولة على أغلب مقاسات الشاشات وكثافات البكسل المختلفة (1x, 2x, 3x) دون إنتاج كسور بكسل عشرية تشوش وضوح العناصر.",
    "explanation": "يعتمد نظام الـ 8pt على مضاعفات ثابتة: (4, 8, 16, 24, 32, 40, 48, 64px) لكل أبعاد العناصر والمسافات البينية (Paddings & Margins). الرقم 4 يُستخدم كخطوة فرعية دقيقة (Half-step) للعناصر الدقيقة كالأيقونات ومسافات النصوص الضيقة. يضمن هذا النظام التناغم البصري الفوري بين الشاشات ويلغي الخلافات العشوائية بين المصمم والمطور حول المسافات.",
    "commonMistakes": [
      "استخدام مسافات فردية عشوائية (مثل 13px أو 27px) لا تتبع مقياس المسافات المعتمد.",
      "تجاهل ارتفاع السطر الطباعي (Line Height) وجعله غير متوافق مع شبكة الـ 4pt/8pt."
    ],
    "followUpQuestions": [
      "كيف تضبط ارتفاع سطور الخطوط (Baseline Grid) ليتطابق بسلاسة مع شبكة الـ 8pt؟",
      "ما الفرق بين Grid الأعمدة المتجاوبة (Column Grid) والشبكة الفراغية المكانية (Spatial Spacing System)؟"
    ],
    "sources": [
      {
        "title": "Material Design — Responsive Layout Grid and Spacing",
        "url": "https://material.io/design/layout/responsive-layout-grid.html"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxds-009",
    "slug": "component-documentation-dos-and-donts",
    "trackId": "ui-ux",
    "topicIds": [
      "ui-design-systems"
    ],
    "difficulty": "Mid",
    "question": "ما هي أفضل الممارسات لتوثيق مكونات نظام التصميم وكتابة إرشادات 'افعل ولا تفعل' (Dos and Don'ts)؟",
    "shortAnswer": "يجب ألا يقتصر التوثيق على وصف شكل المكون، بل يجب أن يشرح سياق الاستخدام، والبدائل المناسبة، وإرشادات إمكانية الوصول، وأمثلة بصرية ملونة توضح الممارسات الصحيحة والخاطئة.",
    "explanation": "التوثيق الفعال يحتوي على: 1) وصف مختصر للغرض الوظيفي للمكون. 2) متى تستخدمه ومتى تستخدم مكوناً آخر بديلاً. 3) أمثلة Dos and Don'ts واضحة وموضحة بصرياً (مثلاً: لا تضع أكثر من زر رئيسي واحد في بطاقة). 4) إرشادات الكتابة والنبرة (Content Guidelines). 5) معايير لوحة المفاتيح وقارئات الشاشة للمطورين.",
    "commonMistakes": [
      "كتابة توثيق نظري مطول يخلو من الأمثلة البصرية التي يقارن بها المصمم عمله سريعاً.",
      "إهمال توثيق السلوكيات التفاعلية وحالات الخطأ وإمكانية الوصول للمكون."
    ],
    "followUpQuestions": [
      "كيف يساهم دمج التوثيق المباشر داخل Storybook في تشجيع المطورين على قراءته؟",
      "كيف تكتب نصوص الخطأ والمساعدة المصاحبة للمكون وفق إرشادات UX Writing الموحدة؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Documenting Design Systems",
        "url": "https://www.nngroup.com/articles/design-systems-101/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxds-010",
    "slug": "design-system-versioning-and-breaking-changes",
    "trackId": "ui-ux",
    "topicIds": [
      "ui-design-systems"
    ],
    "difficulty": "Senior",
    "question": "كيف تدير إصدارات نظام التصميم والتغييرات الجذرية (Breaking Changes) باستخدام Semantic Versioning؟",
    "shortAnswer": "باستخدام ترقيم النسخ الدلالي (Major.Minor.Patch)؛ حيث تشير Major للتغييرات الجذرية التي قد تكسر شاشات المنتجات، و Minor للميزات الجديدة المتوافقة رجعياً، و Patch لإصلاح العيوب البصرية البسيطة.",
    "explanation": "إذا قمت بتغيير اسم خاصية (Prop Rename) أو حذفت خياراً أساسياً في المكون أو غيرت تصرف الحاوية الهيكلي، فهذا تغيير جذري (Major Release) يتطلب تنبيهاً مسبقاً ودليلاً للهجرة (Migration Guide) لفرق المنتجات. توفير فترة تعايش (Deprecation Period) يتيح للفرق جدولة تحديث واجهاتها دون تعطيل أعمالها، ويمنع انهيار الشاشات العاملة في بيئة الإنتاج.",
    "commonMistakes": [
      "نشر تعديلات جذرية في مكتبة Figma المشتركة دون التنسيق المسبق مع المطورين، مما يحدث فجوة بين التصميم والكود.",
      "تعديل أحجام أو هوامش مكون مستخدم في آلاف الشاشات دون دراسة تأثير التغيير على تخطيط الصفحات القائمة."
    ],
    "followUpQuestions": [
      "كيف تجري اختبارات الانحدار البصري (Visual Regression Testing) قبل إطلاق إصدار جديد لنظام التصميم؟",
      "كيف تدير عملية استهلاك تحديثات مكتبات Figma للفرق الكبيرة دون إرباك المشروعات الجارية؟"
    ],
    "sources": [
      {
        "title": "Material Design — Updating and Maintaining Design Systems",
        "url": "https://material.io/design"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxvd-001",
    "slug": "visual-hierarchy-core-principles",
    "trackId": "ui-ux",
    "topicIds": [
      "visual-design"
    ],
    "difficulty": "Junior",
    "question": "ما هي الركائز الأساسية لبناء التسلسل الهرمي البصري (Visual Hierarchy) في واجهات المستخدم؟",
    "shortAnswer": "هي توظيف الحجم، والتباين اللوني، والوزن، والمسافات البيضاء، والمحاذاة لتوجيه عين المستخدم تلقائياً نحو المعلومات الأكثر أهمية أولاً.",
    "explanation": "بدون تسلسل هرمي واضح، تتنافس كل العناصر على جذب انتباه المستخدم مما يصيبه بالإرهاق البصري. يعتمد الترتيب الفعال على جعل العنوان الأهم هو الأكبر حجماً والأغمق وزناً، وتوفير مساحة بيضاء رحبة تفصله عما حوله، وجعل النصوص الداعمة ذات ألوان محايدة وحجم أصغر. هذا يتيح للمستخدم مسح الصفحة في أجزاء من الثانية واستيعاب الرسالة قبل البدء في القراءة المتعمقة.",
    "commonMistakes": [
      "جعل كل العناصر بارزة وبنفس الحجم واللون الصارخ مما يفقد الصفحة مركز الثقل البصري.",
      "تجاهل تباين الألوان بين النصوص والخلفيات مما يجعل قراءة المحتوى الثانوي مجهدة للعين."
    ],
    "followUpQuestions": [
      "ما هي أنماط المسح البصري الشائعة (F-Pattern و Z-Pattern) ومتى ينطبق كل منهما؟",
      "كيف يؤثر التباين في الموضع والمحاذاة على جذب الانتباه الفوري مقارنة بالألوان وحدها؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Visual Hierarchy in UX: Definitions and Guidelines",
        "url": "https://www.nngroup.com/articles/visual-hierarchy-ux-definition/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxvd-002",
    "slug": "sixty-thirty-ten-color-rule-in-ui",
    "trackId": "ui-ux",
    "topicIds": [
      "visual-design"
    ],
    "difficulty": "Junior",
    "question": "كيف تطبق قاعدة 60-30-10 في توزيع ألوان واجهة المستخدم باحترافية؟",
    "shortAnswer": "بتخصيص 60% من الشاشة للون السطح المهيمن (عادة خلفية محايدة بيضاء أو رمادية هادئة)، و 30% للون الثانوي الهيكلي (كالبطاقات والقوائم)، و 10% فقط للون التمييز (Accent Color) المخصص لأزرار الإجراء والدعوات الحيوية.",
    "explanation": "تضمن هذه القاعدة الكلاسيكية التوازن البصري وتمنع طغيان الألوان على المحتوى. عندما يكون 10% فقط من الصفحة باللون المميز (مثل الأزرق أو البرتقالي المخصص للـ CTA)، يبرز الزر الأساسي فوراً كمنارة تجذب العين دون أي مجهود، بينما استخدام اللون الصارخ في مساحات واسعة يفقد الأزرار أهميتها ويرهق المستخدم.",
    "commonMistakes": [
      "استخدام لون العلامة التجارية الصارخ كخلفية لمساحات شاسعة من الصفحة مما يشوش المحتوى.",
      "تشتيت المستخدم بوجود 5 ألوان مميزة مختلفة للأزرار في نفس الشاشة دون دلالة واضحة."
    ],
    "followUpQuestions": [
      "كيف تختار لوحة الألوان الدلالية (Success, Warning, Danger, Info) لتتسق مع اللون الأساسي؟",
      "ما هي استراتيجيات التعامل مع ألوان البراندينج الصعبة ذات التباين المنخفض مع الأبيض؟"
    ],
    "sources": [
      {
        "title": "Material Design — The Color System: Key Color Roles",
        "url": "https://material.io/design/color/the-color-system.html"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxvd-003",
    "slug": "typographic-hierarchy-and-modular-scale",
    "trackId": "ui-ux",
    "topicIds": [
      "visual-design"
    ],
    "difficulty": "Mid",
    "question": "كيف تبني مقياساً طباعياً هرمياً (Typographic Modular Scale) يضمن تناغم النصوص وتجاوبها؟",
    "shortAnswer": "باستخدام نسبة تكبير وتصغير ثابتة (مثل Major Second 1.125 أو Minor Third 1.200 أو Perfect Fourth 1.333) لتوليد أحجام متدرجة منطقياً للخطوط من أصغر تعليق توضيحي حتى أكبر عنوان رئيسي.",
    "explanation": "بدلاً من اختيار أحجام نصوص عشوائية (مثل 13, 17, 21px)، يعتمد المقياس الطباعي على حجم أساسي (Base Size، غالباً 16px) ويتم ضربه أو قسمته على النسبة الثابتة. يرافق ذلك ضبط دقيق لارتفاع السطر (Line Height: 1.4 إلى 1.6 للنصوص المقروءة و 1.1 إلى 1.2 للعناوين الكبيرة) ومسافات التباعد بين الحروف (Letter Spacing: تباعد طفيف للنصوص الصغيرة وضغط طفيف للعناوين الضخمة).",
    "commonMistakes": [
      "استخدام ارتفاع سطر ضيق جداً (Line-height: 1.0) للفقرات الطويلة مما يسبب تداخل السطور.",
      "دمج أكثر من خطين غير متجانسين في نفس الواجهة مما يخلق فوضى شكلية وتشتيتاً للقارئ."
    ],
    "followUpQuestions": [
      "كيف تحدد الطول الأمثل للسطر الطباعي (Measure: 45 إلى 75 حرفاً) لراحة العين في القراءة المستمرة؟",
      "ما هي مميزات استخدام الخطوط المرنة (Variable Fonts) في تحسين أداء وتجاوب الواجهات؟"
    ],
    "sources": [
      {
        "title": "Material Design — Typography: Hierarchy and Scales",
        "url": "https://material.io/design/typography/the-type-system.html"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxvd-004",
    "slug": "affordance-vs-signifier-don-norman",
    "trackId": "ui-ux",
    "topicIds": [
      "visual-design"
    ],
    "difficulty": "Mid",
    "question": "ما الفرق بين الإتاحة (Affordance) والدلالة البصرية (Signifier) وفقاً لدون نورمان (Don Norman)؟",
    "shortAnswer": "الإتاحة هي الخاصية الفيزيائية أو البرمجية التي تجعل الشيء قابلاً لفعل معين (مثل إمكانية النقر على الزر)، بينما الدلالة هي العلامة أو الإشارة البصرية التي تخبر المستخدم بوجود هذا الفعل وكيفية أدائه.",
    "explanation": "في العالم الرقمي، الشاشة الزجاجية تمتلك إتاحة اللمس فيزيائياً في كل مليمتر منها. لكن الدلالة البصرية (Signifier) هي التي ترشد المستخدم: الظل الخفيف والحدود المرتفعة واللون المختلف للزر تخبر الدماغ البشري: 'هذه المساحة بالذات معدة لتضغط عليها!'. إذا كان العنصر قابلاً للنقر ولكن تصميمه يبدو كنص مسطح عادي خالي من أي دلالة، تفشل الواجهة في توجيه المستخدم.",
    "commonMistakes": [
      "تصميم أزرار تبدو تماماً كالبطاقات النصية الثابتة الخالية من أي ظل أو تباين أو حدود (False Signifier).",
      "وضع خطوط تحت نصوص عادية غير تفاعلية مما يوحي للمستخدم بأنها روابط قابلة للنقر."
    ],
    "followUpQuestions": [
      "ما هي الإتاحة السلبية (Negative Affordance) وكيف تظهر في تصميم الأزرار المعطلة (Disabled State)؟",
      "كيف تؤثر حركات الفأرة والـ Hover States كدلالات تفاعلية ديناميكية في واجهات الحواسيب؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Affordances and Signifiers in UI Design",
        "url": "https://www.nngroup.com/articles/affordances-and-signifiers/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxvd-005",
    "slug": "color-contrast-ratios-wcag-standards",
    "trackId": "ui-ux",
    "topicIds": [
      "visual-design"
    ],
    "difficulty": "Junior",
    "question": "ما هي نسب التباين اللوني المعتمدة في معايير إمكانية الوصول (WCAG 2.1 Contrast Ratios) للنصوص والعناصر؟",
    "shortAnswer": "تتطلب المعايير نسبة تباين لا تقل عن 4.5:1 للنصوص العادية، و 3:1 للنصوص الكبيرة (18pt فأكثر أو 14pt عريض) ولعناصر الواجهة الرسومية والأيقونات الأساسية لمستوى AA.",
    "explanation": "التباين اللوني يقيس الفرق بين لمعان النص ولون الخلفية خلفه. يضمن التباين الصحيح تمكن ضعاف البصر وكبار السن وأي شخص يتصفح هاتفه تحت أشعة الشمس المباشرة من قراءة المحتوى بوضوح دون إجهاد. للوصول للمستوى الأرقى (AAA)، ترتفع النسبة المطلوبة إلى 7:1 للنصوص العادية و 4.5:1 للنصوص الكبيرة.",
    "commonMistakes": [
      "استخدام نصوص رمادية باهتة على خلفيات بيضاء فاتحة لمجرد أنها تبدو 'عصرية وناعمة'.",
      "الاعتماد على نص فوق صور غير مستقرة الإضاءة دون وضع طبقة تعتيم (Overlay) تضمن ثبات التباين."
    ],
    "followUpQuestions": [
      "كيف تفحص وتضمن التباين اللوني آلياً داخل Figma وأدوات فحص المتصفح؟",
      "ما هي استثناءات معايير التباين في إرشادات WCAG (مثل الشعارات والعناصر المعطلة غير الفعالة)؟"
    ],
    "sources": [
      {
        "title": "W3C — Web Content Accessibility Guidelines (WCAG) Contrast",
        "url": "https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxvd-006",
    "slug": "dark-mode-design-principles-and-elevation",
    "trackId": "ui-ux",
    "topicIds": [
      "visual-design"
    ],
    "difficulty": "Mid",
    "question": "ما هي المبادئ التصميمية لإنشاء وضع داكن (Dark Mode) مريح للعين ولا يقتصر على قلب الألوان عشوائياً؟",
    "shortAnswer": "تجنب استخدام الأسود النقي المطلق (#000000) للخلفيات، واستخدام الرمادي الداكن السطحي، وتوضيح العمق والارتفاع (Elevation) عبر تفتيح نغمة الأسطح بدلاً من الاعتماد على الظلال السوداء.",
    "explanation": "الأسود النقي (#000000) مع النصوص البيضاء الصريحة (#FFFFFF) يسبب تبايناً شديد القسوة وظاهرة الهالات المزعجة للعين (Halation Effect). الممارسة القياسية (وفق Material Design) هي استخدام درجات رمادي غامق كـ #121212 كقاعدة. في الوضع الداكن، لا يمكن للظلال السوداء أن تظهر عمق العناصر؛ لذا يتم التعبير عن ارتفاع العنصر (Elevation) بزيادة نسبة لمعان السطح تدريجياً ليكون أقرب لمصدر الضوء الافتراضي.",
    "commonMistakes": [
      "قلب الألوان تلقائياً في البرمجة مما يشوه صور المستخدمين ويفسد دلالات الألوان التنبيهية.",
      "استخدام نفس تشبع الألوان الفاقعة الخاصة بالوضع الفاتح في الوضع الداكن مما يسبب اهتزازاً بصرياً مجهداً."
    ],
    "followUpQuestions": [
      "كيف تضبط تشبع الألوان (Desaturating Accents) في الوضع الداكن لضمان راحة المشاهدة؟",
      "ما الفرق بين شاشات OLED وشاشات LCD في توفير طاقة البطارية عند استخدام الألوان الداكنة؟"
    ],
    "sources": [
      {
        "title": "Material Design — Dark Theme Guidelines and Surface Depths",
        "url": "https://material.io/design/color/dark-theme.html"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxvd-007",
    "slug": "iconography-consistency-and-optical-sizing",
    "trackId": "ui-ux",
    "topicIds": [
      "visual-design"
    ],
    "difficulty": "Mid",
    "question": "كيف تبني نظام أيقونات (Iconography System) متسقاً بصرياً من حيث الوزن والمحاذاة البصرية وشبكة الرسم؟",
    "shortAnswer": "برسم كافة الأيقونات على شبكة قياسية موحدة (مثل 24x24px)، مع توحيد سمك الخط (Stroke Weight)، وزوايا الاستدارة، وضبط المحاذاة البصرية (Optical Alignment) بدلاً من المحاذاة الهندسية الرياضية الجامدة.",
    "explanation": "الأشكال الهندسية المختلفة لا تملك نفس الوزن البصري؛ فالدائرة أو المثلث بحجم 24x24px يبدو أصغر حجماً للعين البشرية من المربع الكامل 24x24px. لذا توفر شبكات الأيقونات الاحترافية خطوط إرشاد داخلية (Keyline Shapes) تسمح بزيادة أبعاد الدائرة والمثلث قليلاً لتعادل مساحتها كتلة المربع. الاتساق في اتجاه الإضاءة ومستوى التفاصيل يمنع ظهور أيقونة كأنها نشاز مأخوذ من مكتبة غريبة.",
    "commonMistakes": [
      "خلط أيقونات مفرغة (Outlined) وأيقونات ممتلئة (Filled) في نفس شريط الملاحة دون دلالة على الحالة النشطة.",
      "استخدام أيقونات بأوزان خطوط مختلفة وتفاصيل غير متجانسة في شاشة واحدة."
    ],
    "followUpQuestions": [
      "متى يجب أن تكون الأيقونة مصحوبة بنص توضيحي (Text Label) ومتى تستطيع الوقوف وحدها؟",
      "كيف يؤثر تصدير الأيقونات بصيغة SVG ذات كود نظيف على سرعة تحميل واجهة الويب والتطبيقات؟"
    ],
    "sources": [
      {
        "title": "Material Design — Iconography System and Keyline Shapes",
        "url": "https://material.io/design/iconography/system-icons.html"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxvd-008",
    "slug": "evolution-of-ui-styles-skeuomorphism-to-glassmorphism",
    "trackId": "ui-ux",
    "topicIds": [
      "visual-design"
    ],
    "difficulty": "Senior",
    "question": "كيف تطورت لغات التصميم البصري من Skeuomorphism إلى Flat Design وصولاً إلى Glassmorphism و Modern Depth؟",
    "shortAnswer": "تطورت من محاكاة مواد العالم الواقعي لتعليم المستخدمين الأوائل تفاعل اللمس، ثم التسطيح المفرط لتقليص الشوائب وسرعة التحميل، ثم عودة العمق المحسوب والطبقات الزجاجية التفاعلية بفضل قوة بطاقات الرسوم الحديثة.",
    "explanation": "الـ Skeuomorphism (محاكاة الجلد والخشب والأزرار البلاستيكية اللامعة) كان ضرورياً عند إطلاق الهواتف الذكية لمساعدة الناس على فهم أن الأزرار قابلة للضغط. في 2013 تحول العالم نحو Flat Design لتنظيف الشاشات ورفع الكفاءة، لكنه أفرط في التسطيح ومحا الدلالات البصرية (Affordances). اليوم نعيش مرحلة Modern Functional Depth والـ Glassmorphism: أسطح بلورية نصف شفافة مع خلفيات مموهة (Background Blur) تعبر بذكاء عن تراكب الطبقات وعمق بنية التطبيق دون فوضى شكلية.",
    "commonMistakes": [
      "استخدام مؤثرات الزجاج والظلال الملونة في كل تفاصيل الواجهة مما يثقل تجربة المستخدم ويضعف المقروئية.",
      "التضحية بالدلالات الوظيفية للأزرار والمكونات تفضيلاً لاتباع صيحات الموضة البصرية المؤقتة."
    ],
    "followUpQuestions": [
      "كيف تؤثر المؤثرات البصرية الثقيلة كـ Backdrop Filter على أداء هواتف الفئات المتوسطة واستهلاك البطارية؟",
      "ما هي معايير Apple في توظيف الخامات الشفافة (Vibrancy & Materials) في نظام iOS و macOS؟"
    ],
    "sources": [
      {
        "title": "Apple Developer — Materials and Vibrancy in Human Interface Guidelines",
        "url": "https://developer.apple.com/design/human-interface-guidelines/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxvd-009",
    "slug": "optical-balance-and-visual-adjustments-in-ui",
    "trackId": "ui-ux",
    "topicIds": [
      "visual-design"
    ],
    "difficulty": "Mid",
    "question": "ما هو التوازن البصري (Optical Balance) ولماذا تخطئ المحاذاة الرياضية الصارمة أحياناً في الواجهات؟",
    "shortAnswer": "هو التعديل اليدوي لمواضع وأبعاد العناصر لتبدو متوازنة ومريحة ومضبوطة للعين البشرية، متجاوزاً المحاذاة الرياضية المجردة لبرامج التصميم.",
    "explanation": "المثال الأشهر هو أيقونة زر التشغيل 'Play' داخل دائرة: إذا قمت بمحاذاة المثلث في مركز الدائرة رياضياً (Center Alignment)، سيبدو المثلث منحازاً إلى اليسار بصرياً لأن معظم كتلته وثقله يقع في ضلعه الأيمن الرأسي. المصمم المحترف يزيح المثلث قليلاً نحو اليمين ليتطابق المركز البصري (Optical Center) مع مركز الدائرة. ينطبق هذا أيضاً على الكلمات الإنجليزية والشرطات وعلامات الاقتباس في النصوص الكبيرة.",
    "commonMistakes": [
      "الاعتماد الأعمى على أزرار المحاذاة التلقائية في Figma دون مراجعة النتيجة بالعين المجردة.",
      "محاذاة نصوص ذات خطوط متباينة الأوزان بحسب الإطار المحيط (Bounding Box) بدلاً من خط الأساس (Baseline)."
    ],
    "followUpQuestions": [
      "كيف يؤثر التعديل البصري على تصميم الشعارات والأيقونات الدائرية مقارنة بالمربعة؟",
      "ما هو مفهوم الـ Optical Kerning في تصميم الخطوط واللوحات الطباعية المتقنة؟"
    ],
    "sources": [
      {
        "title": "Material Design — Layout and Optical Alignment Principles",
        "url": "https://material.io/design/layout/understanding-layout.html"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxvd-010",
    "slug": "white-space-as-an-active-design-tool",
    "trackId": "ui-ux",
    "topicIds": [
      "visual-design"
    ],
    "difficulty": "Junior",
    "question": "لماذا تعتبر المساحة البيضاء (White Space / Negative Space) عنصراً تصميمياً فعالاً وليست مساحة مهدرة؟",
    "shortAnswer": "لأن المساحة البيضاء هي التي تمنح العين مساحة للتنفس، وتفصل بين الكتل المعرفية، وتبرز العناصر ذات القيمة العالية، وتمنح التطبيق شعوراً بالفخامة والوضوح والاحترافية.",
    "explanation": "العملاء غير المتخصصين غالباً ما يطالبون بملء كل مليمتر فارغ بإعلانات أو معلومات خوفاً من 'إهدار الشاشة'. الحقيقة المثبتة في علم النفس الإدراكي هي أن تكديس العناصر يرفع الحمل المعرفي ويقلل من قدرة المستخدم على الاستيعاب بنسبة تزيد عن 30%. المساحة الفارغة تعمل كإطار يوجه التركيز نحو زر الشراء أو الرسالة الجوهرية، وتمثل علامة فارقة بين المنتجات الممتازة والمنتجات الرديئة.",
    "commonMistakes": [
      "ضغط المسافات وتكديس الأزرار والنصوص بحجة تقليل الحاجة لتمرير الصفحة (Scroll).",
      "استخدام مساحات بيضاء غير منتظمة ولا تخضع لنظام شبكي موحد مما يعطي انطباعاً بالفوضى أو فراغ الصفحات الخاطئ."
    ],
    "followUpQuestions": [
      "ما الفرق بين المساحات البيضاء الدقيقة (Micro White Space) والمساحات الكبرى (Macro White Space)؟",
      "كيف ترتبط المساحات البيضاء بتصور المستخدمين لمستوى فخامة وجودة الخدمة المقدمة؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — The Power of White Space in UI",
        "url": "https://www.nngroup.com/articles/principles-visual-design/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxim-001",
    "slug": "purpose-of-motion-in-ux-design",
    "trackId": "ui-ux",
    "topicIds": [
      "interaction-motion"
    ],
    "difficulty": "Junior",
    "question": "ما هو الغرض الوظيفي للتحريك (Motion Design) في تجربة المستخدم ومتى يتحول إلى مصدر إزعاج؟",
    "shortAnswer": "الغرض الوظيفي هو توضيح العلاقات المكانية بين الشاشات، وتقديم تغذية راجعة فورية للأفعال، وتوجيه الانتباه؛ ويتحول إلى إزعاج عندما يكون بطيئاً أو استعراضياً مفرطاً يعطل سرعة إنجاز المهام.",
    "explanation": "التحريك الممتاز في الـ UX يبدو طبيعياً وغير ملحوظ لذاته، مثل تحرك البطاقة لتملأ الشاشة مما يوضح للمستخدم مصدر المحتوى وأين سيعود عند الإغلاق. في المقابل، التحريك الزائد الذي يفرض على المستخدم الانتظار ثانية كاملة لظهور كل عنصر في القائمة يصيب المستخدم بالإحباط ويدمر كفاءة الاستخدام.",
    "commonMistakes": [
      "استخدام حركات بهلوانية استعراضية طويلة تؤخر إمكانية النقر على أزرار الواجهة.",
      "غياب الحركة تماماً في الانتقالات المفاجئة (Jump Cuts) مما يفقد المستخدم إحساسه بموقعه داخل التطبيق."
    ],
    "followUpQuestions": [
      "كيف تساهم الحركة في بناء التوجيه المكاني (Spatial Awareness) في تطبيقات الجوال؟",
      "ما هي القواعد التي تفصل بين الحركة الوظيفية الهادفة والحركة الجمالية الثانوية؟"
    ],
    "sources": [
      {
        "title": "Material Design — Understanding Motion Principles",
        "url": "https://material.io/design/motion/understanding-motion.html"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxim-002",
    "slug": "easing-curves-ease-in-ease-out-and-spring-physics",
    "trackId": "ui-ux",
    "topicIds": [
      "interaction-motion"
    ],
    "difficulty": "Mid",
    "question": "قارن بين منحنيات التسارع (Easing Curves: Linear, Ease-In, Ease-Out) والفيزياء الزنبركية (Spring Physics)؟",
    "shortAnswer": "الحركة الخطية (Linear) تبدو صناعية وروبوتية قاسية، بينما Ease-Out يبدأ سريعاً ويتباطأ عند الوصول (مثالي لدخول العناصر للشاشة)، و Ease-In يتسارع (مثالي لخروج العناصر)، والفيزياء الزنبركية تحاكي العالم الحقيقي بكتلة وارتداد طبيعي.",
    "explanation": "في العالم الواقعي، لا يبدأ أي جسم حركته أو يتوقف فجأة دون تسارع واحتكاك. في الواجهات، العناصر القادمة من خارج الشاشة يجب أن تدخل بـ Deceleration (Ease-Out) حتى يستوعبها المستخدم بسرعة وتستقر بسلاسة. الأجسام التي تخرج من الشاشة تستخدم Acceleration (Ease-In) لتختفي بأقصى سرعة دون تعطيل المستخدم. Spring Physics تضيف شعوراً بالاستجابة اللمسية الحية عبر تفاعلات السحب والإفلات.",
    "commonMistakes": [
      "استخدام Linear Motion في تحريك القوائم والنوافذ المنبثقة مما يجعلها تبدو جامدة ومزعجة بصرياً.",
      "استخدام ارتداد زنبركي مبالغ فيه (Over-bouncing) يجعل الواجهة تهتز طويلاً وتتأخر عن استقرارها."
    ],
    "followUpQuestions": [
      "ما هي معاملات الـ Spring Physics (Damping, Stiffness, Mass) وكيف تؤثر على الشعور بالحركة؟",
      "كيف تترجم منحنيات Bezier المنطقية (Cubic-bezier) إلى كود CSS أو Flutter؟"
    ],
    "sources": [
      {
        "title": "Material Design — The Motion System: Speed and Easing",
        "url": "https://material.io/design/motion/speed.html"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxim-003",
    "slug": "motion-duration-guidelines-and-performance",
    "trackId": "ui-ux",
    "topicIds": [
      "interaction-motion"
    ],
    "difficulty": "Junior",
    "question": "ما هي المدد الزمنية المعيارية للحركات التفاعلية (Duration Guidelines) في واجهات المستخدم؟",
    "shortAnswer": "تتراوح الحركات الدقيقة وتغييرات الحالة بين 100 إلى 200 مللي ثانية، وانتقالات النوافذ والعناصر المتوسطة بين 200 إلى 300 مللي ثانية، بينما الانتقالات الكبرى للشاشات الكاملة لا ينبغي أن تتجاوز 400 إلى 500 مللي ثانية.",
    "explanation": "أي حركة تقل مدتها عن 100ms تصبح غير مرئية للعين وتتحول لومضة مزعجة. وأي حركة تزيد مدتها عن 500ms تجعل الواجهة تبدو بطيئة وثقيلة الاستجابة. في الشاشات الكبيرة (أجهزة سطح المكتب واللوحيات)، تزداد المسافات المقطوعة لذا يمكن زيادة المدة قليلاً، بينما في شاشات الهواتف الصغيرة يجب أن تكون الحركة خاطفة ومباشرة.",
    "commonMistakes": [
      "ضبط مدة فتح القائمة أو الإشعار على ثانية كاملة (1000ms) مما يضيع وقت المستخدم الثمين.",
      "تطبيق نفس المدة الزمنية لحركة زر صغير وحركة ملء شاشة كاملة دون مراعاة المسافة."
    ],
    "followUpQuestions": [
      "كيف تؤثر سرعة الإطارات (60fps و 120Hz ProMotion) على انسيابية الحركة والشعور بالاستجابة؟",
      "ما هي أسباب الـ Animation Jank وكيف يتفاداه مصممو الـ UX بالتعاون مع المطورين؟"
    ],
    "sources": [
      {
        "title": "Material Design — Motion Speed and Duration",
        "url": "https://material.io/design/motion/speed.html"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxim-004",
    "slug": "staggered-animations-and-choreography",
    "trackId": "ui-ux",
    "topicIds": [
      "interaction-motion"
    ],
    "difficulty": "Mid",
    "question": "ما هو التحريك المتتابع (Staggered Animation) وكيف تصمم سيناريو حركي متناغم (Choreography) للقوائم والبطاقات؟",
    "shortAnswer": "هو تأخير زمني طفيف ومتسلسل (غالباً بين 20 إلى 50 مللي ثانية) بين ظهور العناصر المتتالية في القائمة لإنشاء تدفق بصري طبيعي يوجه عين المستخدم دون فوضى متزامنة.",
    "explanation": "إذا ظهرت 20 بطاقة في نفس اللحظة فجأة، تعجز العين عن التركيز على نقطة بداية. عبر الـ Staggering، تظهر البطاقة الأولى تليها الثانية بفارق زمني خاطف، مما يقود انتباه المستخدم من أعلى الصفحة لأسفلها وفق اتجاه القراءة. القاعدة الأساسية هي ألا يتجاوز إجمالي وقت ظهور كافة عناصر القائمة مجتمعة حاجز الـ 400ms لتفادي الملل.",
    "commonMistakes": [
      "وضع تأخير زمني كبير (100ms لكل عنصر) مما يجعل قائمة من 10 عناصر تستغرق أكثر من ثانية للظهور.",
      "تطبيق تحريك متتابع عشوائي يتحرك في اتجاهات متضاربة يربك مسار القراءة الطبيعي."
    ],
    "followUpQuestions": [
      "كيف تحدد اتجاه الحركة المتتابعة بناءً على لغة الواجهة (RTL للعربية و LTR للإنجليزية)؟",
      "كيف تستخدم الحركة المتتالية لتأكيد التغييرات الناتجة عن تصفية أو فرز عناصر القائمة؟"
    ],
    "sources": [
      {
        "title": "Material Design — Choreographing Motion",
        "url": "https://material.io/design/motion/choreography.html"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxim-005",
    "slug": "haptic-feedback-and-multimodal-interactions",
    "trackId": "ui-ux",
    "topicIds": [
      "interaction-motion"
    ],
    "difficulty": "Senior",
    "question": "كيف توظف ردود الفعل اللمسية الاهتزازية (Haptic Feedback) لتعزيز الثقة في المعاملات الحساسة؟",
    "shortAnswer": "باستخدام اهتزازات ميكانيكية دقيقة ومحسوبة بالمللي ثانية (مثل Apple Taptic Engine) تتزامن مع التغذية البصرية والصوتية لتأكيد حدوث الأفعال المهمة وإشعار المستخدم بنجاحها أو فشلها فيزيائياً.",
    "explanation": "ردود الفعل اللمسية تخلق بعداً حسياً إضافياً يربط الزجاج الافتراضي بالواقع الملموس. في تطبيقات الدفع المالي (Fintech)، تزامن صوت النغمة الخافتة مع حركة علامة الصح الخضراء واهتزاز هابتي خفيف ومطمئن يمنح المستخدم ثقة ويقيناً بنجاح تحويل الأموال. كما تُستخدم الهابتكس التحذيرية المزدوجة لتنبيه المستخدم عند محاولة حذف ملف مصيري.",
    "commonMistakes": [
      "الإفراط في استخدام الاهتزازات مع كل نقرة زر عادية مما يستنزف البطارية ويزعج يد المستخدم.",
      "استخدام نمط اهتزاز مجهول الشدة دون التمييز بين حالات النجاح البسيطة والأخطاء الجسيمة."
    ],
    "followUpQuestions": [
      "ما هي فئات الـ Haptic Feedback القياسية في نظام iOS (Impact, Notification, Selection)؟",
      "كيف تضمن مراعاة إمكانية الوصول للمستخدمين ذوي الإعاقات السمعية أو البصرية عبر الهابتكس؟"
    ],
    "sources": [
      {
        "title": "Apple Developer — Playing Haptics in Human Interface Guidelines",
        "url": "https://developer.apple.com/design/human-interface-guidelines/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxim-006",
    "slug": "gestural-interfaces-affordance-and-discovery",
    "trackId": "ui-ux",
    "topicIds": [
      "interaction-motion"
    ],
    "difficulty": "Mid",
    "question": "ما هي تحديات تصميم الواجهات القائمة على الإيماءات (Gestures) وكيف تضمن سهولة اكتشافها وفهمها؟",
    "shortAnswer": "التحدي الأكبر هو أن الإيماءات اللمسية غير مرئية بطبيعتها وتفتقر للإتاحة البصرية المباشرة؛ والحل هو توفير تلميحات بصرية متحركة، ودعم الإيماءات بأزرار بديلة صريحة دائماً.",
    "explanation": "إيماءة مثل 'السحب لليسار للأرشفة' (Swipe to Archive) رائعة وسريعة للمستخدم المتقدم، لكن المستخدم الجديد لا يستطيع تخمين وجودها دون إشارة. تشمل استراتيجيات الاكتشاف: ارتداد العنصر قليلاً عند أول استخدام ليكشف ما تحته (Peek / Bounce Animation)، أو عرض جولة إرشادية مختصرة في أول مرة، وتوفير خيار الأرشفة دائماً كزر واضح داخل القائمة التقليدية للمستخدمين الأقل دراية.",
    "commonMistakes": [
      "جعل الإيماءات المعقدة هي الطريقة الوحيدة الحصرية لإنجاز مهام أساسية ومصيرية في التطبيق.",
      "تطبيق إيماءات تخالف إيماءات النظام التشغيلي الافتراضية (مثل تعارض سحب الصفحة مع سحب الـ Back في النظام)."
    ],
    "followUpQuestions": [
      "ما هي معايير WCAG 2.5.1 و 2.5.4 الخاصة بإلغاء وإتاحة بدائل للإيماءات المعقدة والمتزامنة؟",
      "كيف تصمم حالات السحب غير المكتمل (Cancelled Swipe) وتأكيد الإلغاء بسلاسة؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Gestural Interfaces: A Step Backwards in Usability",
        "url": "https://www.nngroup.com/articles/gestural-interfaces-usability/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxim-007",
    "slug": "skeleton-screens-vs-spinners-perceived-speed",
    "trackId": "ui-ux",
    "topicIds": [
      "interaction-motion"
    ],
    "difficulty": "Junior",
    "question": "لماذا تتفوق شاشات الهيكل العظمي (Skeleton Screens) على دوائر التحميل الدوارة (Spinners)؟",
    "shortAnswer": "لأنها تقدم هيكلاً بصرياً تدريجياً يوحي بأن المحتوى يكتمل ويقترب من الجاهزية، مما يقلل من الوقت المدرك للانتظار (Perceived Wait Time) ويمنع قفزات التخطيط الفجائية.",
    "explanation": "دوائر التحميل الدوارة (Spinners) تحصر تركيز المستخدم على نقطة واحدة تدور في الفراغ وتذكره باستمرار بأنه عالق ينتظر. في المقابل، الشاشات الهيكلية ترسم أشكالاً رمادية باهتة تطابق موضع العناوين والبطاقات القادمة، مع لمعان حركي هادئ (Shimmer Animation) من اليسار إلى اليمين. هذا يجعل المستخدم يشعر بأن التطبيق فوري الاستجابة ويعرف أين سينظر فور اكتمال جلب البيانات.",
    "commonMistakes": [
      "تصميم شاشات هيكلية بأبعاد تختلف تماماً عن البطاقات الحقيقية مما يسبب قفزة تخطيطية مفاجئة (Layout Shift).",
      "استخدام الشاشات الهيكلية لعمليات سريعة جداً تقل عن 300ms مما يظهر كفلاش رمادي مزعج."
    ],
    "followUpQuestions": [
      "متى يكون استخدام Spinner الصغير أفضل من Skeleton Screen (مثل داخل زر الإرسال)؟",
      "كيف تؤثر شاشات الهيكل العظمي على تحسين مقياس Cumulative Layout Shift (CLS) في تجربة الويب؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Skeleton Screens 101",
        "url": "https://www.nngroup.com/articles/skeleton-screens/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxim-008",
    "slug": "accessibility-in-motion-prefers-reduced-motion",
    "trackId": "ui-ux",
    "topicIds": [
      "interaction-motion"
    ],
    "difficulty": "Senior",
    "question": "كيف تصمم الحركات مع مراعاة المستخدمين الذين يعانون من اضطرابات الجهاز الدهليزي (Vestibular Disorders) وخاصية Prefers-Reduced-Motion؟",
    "shortAnswer": "بتوفير بدائل حركية هادئة (كالتلاشي التدريجي Fade بدلاً من التكبير والقفز المفاجئ والبارالاكس)، واحترام تفضيل النظام لتقليص الحركة (prefers-reduced-motion) برمجياً.",
    "explanation": "التحريكات الكبيرة السريعة وتأثيرات اختلاف المنظر (Parallax Scrolling) والتكبير والتصغير المباغت قد تسبب للمصابين باضطرابات التوازن الدهليزي والصرع دواراً وصداعاً وغثياناً حاداً. احترام معيار إمكانية الوصول يقتضي: 1) فحص خيار تقليل الحركة على مستوى النظام. 2) استبدال حركات الإزاحة بحركات ظهور ناعمة فورية. 3) توفير زر مباشر لإيقاف أي حركة أو فيديو تلقائي التشغيل في المنصة.",
    "commonMistakes": [
      "تجاهل إعدادات تقليل الحركة على نظام التشغيل وإجبار جميع المستخدمين على مشاهدة حركات انتقالية صاخبة.",
      "تصميم خلفيات فيديو متحركة أو تأثيرات Parallax معقدة دون إمكانية إيقافها مؤقتاً."
    ],
    "followUpQuestions": [
      "ما هي معايير WCAG 2.3.3 الخاصة بالحركات الناتجة عن التفاعل (Animation from Interactions)؟",
      "كيف تبرمج استعلام @media (prefers-reduced-motion) في تصميمات الواجهات التفاعلية؟"
    ],
    "sources": [
      {
        "title": "W3C — Understanding WCAG: Animation from Interactions",
        "url": "https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxim-009",
    "slug": "error-recovery-micro-animations",
    "trackId": "ui-ux",
    "topicIds": [
      "interaction-motion"
    ],
    "difficulty": "Mid",
    "question": "كيف تساهم الحركات الدقيقة في مساعدة المستخدم على إدراك الخطأ ومعالجته (Error Recovery Micro-animations)؟",
    "shortAnswer": "بتوجيه انتباه المستخدم بطريقة بديهية إلى موضع الخلل بدقة (مثل حركة الاهتزاز الخفيفة لحقل كلمة المرور غير الصحيحة)، مما يعبر عن الرفض الحركي الإنساني المألوف دون كلمات تقنية جافة.",
    "explanation": "حركة الاهتزاز الأفقي اللطيف (Horizontal Shake) مأخوذة من إيماءة هز الرأس الإنسانية للتعبير عن الرفض؛ عند إدخال رمز خطأ أو كلمة سر خاطئة، اهتزاز الحقل يلفت النظر فوراً للسبب دون الحاجة لقراءة رسالة طويلة. كما تشمل الحركات الفعالة: التمرير التلقائي السلس نحو أول حقل خاطئ في النماذج الطويلة لتجنيب المستخدم البحث عن سبب فشل الإرسال.",
    "commonMistakes": [
      "استخدام اهتزاز عنيف أو مؤثرات حمراء وامضة مزعجة تصيب المستخدم بالتوتر والارتباك.",
      "الاكتفاء بالحركة دون توفير نص توضيحي مساند يشرح ما الذي يجب على المستخدم فعله لإصلاح الخطأ."
    ],
    "followUpQuestions": [
      "كيف تمنع اهتزاز الحقول من أن يبدو كأنه عطل برمجي في استقرار الصفحة؟",
      "ما هي أفضل ممارسات توقيت ظهور نصوص التحذير المتزامنة مع الحركة؟"
    ],
    "sources": [
      {
        "title": "Material Design — Motion and Error Communication",
        "url": "https://material.io/design/communication/confirmation-acknowledgement.html"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxim-010",
    "slug": "direct-vs-indirect-manipulation",
    "trackId": "ui-ux",
    "topicIds": [
      "interaction-motion"
    ],
    "difficulty": "Senior",
    "question": "قارن بين المعالجة المباشرة (Direct Manipulation) والمعالجة غير المباشرة (Indirect Manipulation) في تفاعل الشاشات؟",
    "shortAnswer": "المعالجة المباشرة تتيح للمستخدم التفاعل مع العنصر نفسه مباشرة فيزيائياً بأصابعه أو مؤشره (كالضغط على الصورة وتكبيرها بالإصبعين وسحبها)، بينما غير المباشرة تستخدم وسطاء تحكم خارجيين (كالضغط على منزلق أو كتابة أرقام في حقل لتغيير الحجم).",
    "explanation": "المعالجة المباشرة (المصطلح الذي صاغه بن شنايدرمان) تمثل قمة التفاعل الطبيعي والبديهي: 1) تمثيل مستمر للعنصر المراد التحكم به. 2) أفعال فيزيائية مباشرة بدلاً من كتابة أوامر. 3) نتائج فورية مرئية وقابلة للتراجع السريع. في المقابل، تظل المعالجة غير المباشرة مفيدة في المهام الدقيقة جداً (مثل إدخال زوايا دوران بالدرجة في برامج الهندسة المعمارية حيث يتعذر الضبط الدقيق بالأصابع).",
    "commonMistakes": [
      "إجبار المستخدم على استخدام عناصر تحكم معقدة ومخفية لمهام بديهية يمكن إنجازها بسحب العنصر مباشرة.",
      "تأخر استجابة العنصر لحركة الإصبع (Touch Latency) مما يفقد تجربة المعالجة المباشرة سحرها الطبيعي."
    ],
    "followUpQuestions": [
      "كيف يؤثر الـ Physics-based Manipulation على شعور المستخدم بالتحكم والملكية في الواجهات ثلاثية الأبعاد؟",
      "ما هي حدود المعالجة المباشرة في واجهات الهواتف ذات الشاشات المحدودة؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Direct Manipulation in User Interfaces",
        "url": "https://www.nngroup.com/articles/direct-manipulation/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxac-001",
    "slug": "wcag-pour-principles-explained",
    "trackId": "ui-ux",
    "topicIds": [
      "accessibility-inclusive"
    ],
    "difficulty": "Junior",
    "question": "ما هي المبادئ الأربعة لإمكانية الوصول وفق إرشادات (WCAG POUR Principles)؟",
    "shortAnswer": "المبادئ الأربعة هي: 1) الإدراك (Perceivable). 2) القابلية للتشغيل (Operable). 3) الفهم (Understandable). 4) المتانة والاستقرار (Robust).",
    "explanation": "مبدأ الإدراك يعني ألا تعتمد الواجهة على حاسة واحدة فقط؛ فإذا كان هناك صوت يجب توفير نص مرئي، وإذا كانت هناك صورة يجب توفير وصف نصي بديل لقارئ الشاشة. مبدأ القابلية للتشغيل يضمن إمكانية التنقل والتحكم عبر لوحة المفاتيح وحدها أو بالأوامر الصوتية. مبدأ الفهم يضمن وضوح اللغة وبساطة التفاعل وتوقع السلوك ومنع الأخطاء. ومبدأ المتانة يضمن توافق الموقع مع مختلف المتصفحات والتقنيات المساعدة (Assistive Technologies) الحالية والمستقبلية.",
    "commonMistakes": [
      "حصر مفهوم إمكانية الوصول في دعم المكفوفين فقط وإهمال ذوي الإعاقات الحركية والسمعية والإدراكية.",
      "تطبيق نصوص مساندة عشوائية لا توضح سياق العنصر لبرامج قراءة الشاشة."
    ],
    "followUpQuestions": [
      "كيف تترجم مبادئ POUR إلى معايير قبول (Acceptance Criteria) في تذاكر التصميم والتطوير؟",
      "ما هي الإعاقات المؤقتة والظرفية (Situational Disabilities) وكيف يعالجها مبدأ الإدراك؟"
    ],
    "sources": [
      {
        "title": "W3C — Accessibility Principles (POUR)",
        "url": "https://www.w3.org/WAI/fundamentals/accessibility-principles/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxac-002",
    "slug": "wcag-conformance-levels-a-aa-aaa",
    "trackId": "ui-ux",
    "topicIds": [
      "accessibility-inclusive"
    ],
    "difficulty": "Senior",
    "question": "ما الفرق بين مستويات الامتثال لمعايير الوصول (WCAG Levels: A, AA, AAA) وما هو المعيار القانوني العالمي؟",
    "shortAnswer": "المستوى A يمثل الحد الأدنى المطلق لمنع الحجب التام للوصول، والمستوى AA هو المعيار الذهبي والقانوني العالمي المطلوب تجارياً وحكومياً، بينما المستوى AAA هو الأرقى والأكثر صرامة ومخصص لبيئات استثنائية متخصصة.",
    "explanation": "معظم القوانين الدولية مثل قانون الأمريكيين ذوي الإعاقة (ADA) وقانون إمكانية الوصول الأوروبي (EAA) تشترط الامتثال للمستوى AA من WCAG 2.1/2.2. يتطلب هذا المستوى: تباين لوني 4.5:1 على الأقل للنصوص، دعم كامل للوحة المفاتيح دون فخاخ (No Keyboard Trap)، تسميات توضيحية للفيديو، وتوافق مع قارئات الشاشة. المستوى AAA يصعب تحقيقه في كافة الصفحات العامة (مثل اشتراط تباين 7:1 وتوفير ترجمة بلغة الإشارة لكل صوت).",
    "commonMistakes": [
      "الاستهانة بالمعايير القانونية مما يعرض الشركات العالمية لغرامات مالية ودعاوى قضائية باهظة.",
      "محاولة تطبيق معايير المستوى AAA على كل أجزاء الموقع مما يعقد تصميم العلامة التجارية دون مبرر وظيفي."
    ],
    "followUpQuestions": [
      "ما هي أبرز التحديثات التي أدخلها معيار WCAG 2.2 في مجالات أهداف اللمس والمساعدة المتسقة؟",
      "كيف تؤثر الشهادة الطوعية لإمكانية الوصول للمنتج (VPAT Report) على مبيعات البرمجيات المؤسسية (B2B)؟"
    ],
    "sources": [
      {
        "title": "W3C — WCAG 2 Overview and Conformance Levels",
        "url": "https://www.w3.org/WAI/standards-guidelines/wcag/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxac-003",
    "slug": "designing-for-screen-readers-and-alt-text",
    "trackId": "ui-ux",
    "topicIds": [
      "accessibility-inclusive"
    ],
    "difficulty": "Mid",
    "question": "كيف تصمم واجهات متوافقة مع قارئات الشاشة (Screen Readers) وكيف تصيغ النصوص البديلة (Alt Text) باحتراف؟",
    "shortAnswer": "بضمان ترتيب قراءة منطقي ومتسق (DOM Order)، وتسمية كل عنصر تفاعلي بوضوح (Accessible Name)، وكتابة نصوص بديلة تصف الغرض الوظيفي والمعنى السياقي للصورة بدلاً من تفاصيلها الشكلية السطحية.",
    "explanation": "قارئ الشاشة (مثل VoiceOver و TalkBack) يقرأ الشاشة خطياً. إذا كانت الصورة زخرفية بحتة لا تحمل معلومة جديدة، يجب تعليمها كـ Decorative (alt='') ليتجاهلها القارئ ولا يعطل المستخدم. وإذا كانت الصورة رسماً بيانياً أو زراً تفاعلياً، يجب أن يصف النص البديل الخلاصة أو الوظيفة (مثلاً: 'زر إغلاق النافذة' بدلاً من 'أيقونة علامة X رمادية').",
    "commonMistakes": [
      "كتابة نصوص بديلة تبدأ بعبارة 'صورة لـ...'؛ فقارئ الشاشة يعلن تلقائياً للمستخدم أنها صورة.",
      "ترك الأزرار المعتمدة على أيقونات مجردة بدون تسمية نصية مخفية (Aria-label) فيقرأها البرنامج كزر غامض مجهول الهوية."
    ],
    "followUpQuestions": [
      "كيف يؤثر ترتيب المحتوى في شجرة المكونات (Focus Order) على فهم مستخدم قارئ الشاشة؟",
      "ما هي أدوار ARIA (Accessible Rich Internet Applications) ومتى تكون غير ضرورية؟"
    ],
    "sources": [
      {
        "title": "W3C — Images Concepts: An alt Decision Tree",
        "url": "https://www.w3.org/WAI/tutorials/images/decision-tree/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxac-004",
    "slug": "color-blindness-and-color-independence",
    "trackId": "ui-ux",
    "topicIds": [
      "accessibility-inclusive"
    ],
    "difficulty": "Junior",
    "question": "لماذا يحظر الاعتماد على اللون وحده لتوصيل المعلومات وكيف تدعم المصابين بعمى الألوان (Color Blindness)؟",
    "shortAnswer": "لأن حوالي 8% من الرجال و 0.5% من النساء يعانون من أشكال مختلفة من عمى الألوان؛ والاعتماد على اللون وحده يجعلهم عاجزين عن التمييز بين حالات النظام المختلفة (كالنجاح والفشل).",
    "explanation": "الأنواع الشائعة لعمى الألوان تشمل عدم تمييز الأحمر والأخضر (Deuteranopia و Protanopia) وعدم تمييز الأزرق والأصفر (Tritanopia). الحل التصميمي المعتمد هو 'الاستقلال اللوني' (Color Independence): إقران اللون دائماً بعنصر بصري مساند؛ مثل إضافة أيقونة صح (✓) بجانب اللون الأخضر، وأيقونة تعجب (!) بجانب اللون الأحمر، وخط سفلي للروابط النصية لتمييزها عن النص العادي.",
    "commonMistakes": [
      "تصميم حقول الإدخال الخاطئة بإطار أحمر فقط دون أيقونة تنبيهية أو نص خطأ يشرح المشكلة.",
      "تصميم الرسوم البيانية الدائرية معتمدة على درجات متقاربة من الأخضر والأحمر لتمثيل الأرباح والخسائر."
    ],
    "followUpQuestions": [
      "كيف تستخدم أدوات محاكاة عمى الألوان (Color Blindness Simulators) في Figma لفحص شاشاتك؟",
      "كيف تصمم مؤشرات التبديل (Toggles / Switches) لتوضح حالتي التشغيل والإيقاف بدون الاعتماد على اللون فقط؟"
    ],
    "sources": [
      {
        "title": "W3C — Use of Color: Understanding SC 1.4.1",
        "url": "https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxac-005",
    "slug": "touch-target-sizes-mobile-ergonomics",
    "trackId": "ui-ux",
    "topicIds": [
      "accessibility-inclusive"
    ],
    "difficulty": "Junior",
    "question": "ما هي المعايير القياسية لأبعاد أهداف اللمس (Touch Target Sizes) عبر المنصات المختلفة؟",
    "shortAnswer": "الحد الأدنى لمساحة اللمس هو 48x48dp في نظام أندرويد (Material Design)، و 44x44pt في نظام آبل (iOS HIG)، و 24x24px كحد أدنى في معيار WCAG 2.2.",
    "explanation": "في الهواتف، الأصابع البشرية ليست كالسهم المدبب للفأرة؛ مساحة تلامس وسادة الإصبع مع الزجاج تتراوح بين 9 إلى 11 مليمتر. إذا كانت الأزرار متقاربة وأصغر من 48dp، يرتكب المستخدمون أخطاء نقر متكررة ومحبطة. يمكن أن يكون الرمز البصري للأيقونة صغيراً (مثلاً 20x20px) ولكن يجب أن تكون مساحة النقر المحيطة به (Padding / Target Area) واسعة ومطابقة للحد الأدنى.",
    "commonMistakes": [
      "تصميم روابط نصية متراصة في سطرين دون مسافة رأسية كافية مما يجعل النقر على الرابط الصحيح مهمة شاقة.",
      "وضع أزرار الحذف بجوار أزرار التعديل مباشرة بمساحات نقر بالغة الصغر."
    ],
    "followUpQuestions": [
      "ما هي استثناءات معيار أهداف اللمس في WCAG 2.2 (مثل الروابط المضمنة في فقرات النصوص)؟",
      "كيف يؤثر التباعد بين أهداف اللمس (Touch Target Spacing) على خفض نسبة الأخطاء اللمسية؟"
    ],
    "sources": [
      {
        "title": "Material Design — Accessibility: Touch Target Sizes and Spacing",
        "url": "https://material.io/design/usability/accessibility.html"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxac-006",
    "slug": "focus-states-and-keyboard-navigation",
    "trackId": "ui-ux",
    "topicIds": [
      "accessibility-inclusive"
    ],
    "difficulty": "Mid",
    "question": "لماذا تعد حالات التركيز (Focus States) ومؤشرات لوحة المفاتيح ضرورة قصوى وما هي مواصفاتها المثلى؟",
    "shortAnswer": "لأن المستخدمين الذين يعتمدون على لوحة المفاتيح للتنقل (بسبب إعاقات حركية أو تفضيل الكفاءة) يعتمدون كلياً على مؤشر التركيز لمعرفة العنصر المحدد حالياً قبل الضغط على Enter أو Space.",
    "explanation": "إلغاء حلقة التركيز في الكود (مثل كتابة outline: none بدون بديل) يعد جريمة في قابلية الاستخدام لأنه يجعل المستخدم يتنقل في الظلام. مؤشر التركيز المثالي يجب أن يكون: 1) مرئياً بوضوح شديد. 2) متبايناً لونياً بنسبة 3:1 على الأقل مع الخلفية والعنصر نفسه. 3) ذو سمك لا يقل عن 2px ومحيط بالعنصر أو مزاح قليلاً عنه (Offset Focus Ring) لتجنب اختفائه خلف حدود العنصر.",
    "commonMistakes": [
      "إزالة حدود التركيز الافتراضية للمتصفح دون استبدالها بتصميم بصري مخصص وواضح.",
      "تصميم ترتيب انتقال غير منطقي (Broken Tab Order) يقفز بين زوايا الشاشة عشوائياً بدلاً من الترتيب البصري."
    ],
    "followUpQuestions": [
      "ما هو معيار WCAG 2.4.7 الخاص بظهور التركيز ومعيار WCAG 2.4.11 الجديد لعدم حجب التركيز؟",
      "كيف تبرمج ميزة 'تخطي إلى المحتوى الرئيسي' (Skip to Main Content Link) لمستخدمي لوحة المفاتيح؟"
    ],
    "sources": [
      {
        "title": "W3C — Focus Visible: Understanding Success Criterion 2.4.7",
        "url": "https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxac-007",
    "slug": "cognitive-accessibility-and-plain-language",
    "trackId": "ui-ux",
    "topicIds": [
      "accessibility-inclusive"
    ],
    "difficulty": "Mid",
    "question": "ما هي إمكانية الوصول الإدراكي (Cognitive Accessibility) وكيف تجعل الواجهات سهلة الفهم للجميع؟",
    "shortAnswer": "هي ممارسة تصميمية تراعي المستخدمين ذوي صعوبات التعلم وعسر القراءة وتشتت الانتباه وكبار السن، عبر تبسيط اللغة وهيكلة الواجهات وجعل السلوكيات متوقعة وثابتة.",
    "explanation": "تشمل إمكانية الوصول الإدراكي: 1) استخدام لغة مبسطة ومباشرة (Plain Language) وتجنب المصطلحات التقنية المعقدة. 2) إعطاء المستخدم وقتاً كافياً أو خيار إيقاف المؤقتات الزمنية للجلسات. 3) تقليل المشتتات والرسوم المتحركة التلقائية. 4) توفير خطوات تراجع وإلغاء واضحة للمهام الحساسة. 5) تقسيم المهام الطويلة إلى خطوات إرشادية تدريجية.",
    "commonMistakes": [
      "وضع عدادات وقت تنازلية صارمة في استمارات التقديم تطرد المستخدم فجأة دون سابق إنذار.",
      "كتابة نصوص إرشادية مطولة بلغة قانونية معقدة يصعب على القارئ العادي استيعابها."
    ],
    "followUpQuestions": [
      "كيف تساهم مقاييس مقروئية النصوص (مثل Flesch-Kincaid Grade Level) في تقييم محتوى الواجهات؟",
      "ما هي أفضل ممارسات تصميم الخطوط والمسافات لمساعدة المصابين بعسر القراءة (Dyslexia)؟"
    ],
    "sources": [
      {
        "title": "W3C — Cognitive Accessibility Guidance",
        "url": "https://www.w3.org/WAI/cognitive/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxac-008",
    "slug": "inclusive-design-vs-universal-design-vs-accessible-design",
    "trackId": "ui-ux",
    "topicIds": [
      "accessibility-inclusive"
    ],
    "difficulty": "Senior",
    "question": "قارن بين التصميم الشامل (Inclusive Design) والتصميم العالمي (Universal Design) والتصميم القابل للنفاذ (Accessible Design)؟",
    "shortAnswer": "التصميم القابل للنفاذ يركز على الامتثال التقني للمعايير واللوائح لذوي الإعاقة، والتصميم العالمي يسعى لإنشاء حل وحيد يناسب الجميع، بينما التصميم الشامل منهجية تشرك الفئات المهمشة وتصمم حلولاً متنوعة تناسب احتياجات بشرية مختلفة.",
    "explanation": "التصميم الشامل (الذي روجت له Microsoft Design) يقوم على مبدأ 'حل لفئة واحدة ويمتد النفع للجميع' (Solve for one, extend to many). على سبيل المثال: تصميم تسميات توضيحية للفيديو موجه أساساً لفاقدي السمع (إعاقة دائمة)، ولكنه يفيد الراكب في قطار مزدحم بدون سماعات (إعاقة ظرفية)، أو الأم التي تحمل طفلاً نائماً (إعاقة مؤقتة). إنه يرى الإعاقة كتفاوت بين قدرات الإنسان والبيئة المصممة وليست نقصاً شخصياً.",
    "commonMistakes": [
      "التعامل مع إمكانية الوصول كقائمة فحص تقنية في نهاية المشروع بدلاً من تبني الشمولية كعقلية في التفكير.",
      "افتراض وجود مستخدم 'عادي ومتوسط' وتصميم كل شيء وفق هذا الوهم الإحصائي."
    ],
    "followUpQuestions": [
      "ما هي بطاقات الشخصيات الشاملة (Persona Spectrums) وكيف تكشف الإعاقات الدائمة والمؤقتة والظرفية؟",
      "كيف تنظم جلسات Co-design تشاركية يشارك فيها ذوو الإعاقة في مراحل التخطيط الأولى؟"
    ],
    "sources": [
      {
        "title": "Microsoft Design — Inclusive Design Principles",
        "url": "https://www.microsoft.com/design/inclusive/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxac-009",
    "slug": "accessible-form-design-and-error-prevention",
    "trackId": "ui-ux",
    "topicIds": [
      "accessibility-inclusive"
    ],
    "difficulty": "Mid",
    "question": "كيف تصمم استمارات ونماذج إدخال (Forms) متوافقة تماماً مع إمكانية الوصول وتمنع الأخطاء مسبقاً؟",
    "shortAnswer": "بإبقاء التسميات (Labels) ظاهرة وثابتة دائماً، واستخدام نصوص مساعدة واضحة، وتوضيح الأخطاء في مكانها (Inline Validation) فور الإدخال مع رسائل تصحيحية واضحة.",
    "explanation": "من أكبر أخطاء النماذج استخدام النصوص البديلة داخل الحقل (Placeholder as Label)؛ لأنها تختفي بمجرد بدء الكتابة وتفتقر للتباين الكافي وتضلل قارئات الشاشة. النموذج الذي يراعي الوصول يوفر: 1) وسماً نصياً ثابتاً فوق الحقل. 2) إشارة واضحة للحقول الإلزامية نصياً وليس بلون النجمة فقط. 3) اقتراحات استباقية لمعالجة الأخطاء قبل إرسال النموذج. 4) شاشة مراجعة نهائية قبل العمليات المالية لتأكيد الرغبة ومنع الخطأ.",
    "commonMistakes": [
      "الاعتماد على Placeholders كبديل وحيد لعناوين الحقول لتوفير المساحة الشكلية.",
      "عرض أخطاء الإدخال بعد الضغط على الإرسال في أعلى الصفحة فقط دون ربطها بالحقول المعنية."
    ],
    "followUpQuestions": [
      "كيف تربط رسائل الخطأ بالحقل المقابل برمجياً عبر خاصية aria-describedby؟",
      "ما هي متطلبات الملء التلقائي (Autocomplete Attributes) في معيار WCAG 1.3.5 لتسهيل الإدخال؟"
    ],
    "sources": [
      {
        "title": "W3C — Forms Concepts: Labeling Controls",
        "url": "https://www.w3.org/WAI/tutorials/forms/labels/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxac-010",
    "slug": "media-accessibility-captions-transcripts-and-audio-descriptions",
    "trackId": "ui-ux",
    "topicIds": [
      "accessibility-inclusive"
    ],
    "difficulty": "Senior",
    "question": "ما هي المتطلبات الصارمة لإمكانية وصول الوسائط المتعددة (فيديو وصوت) وفق معايير الويب الدولية؟",
    "shortAnswer": "توفير ترجمات نصية دقيقة متزامنة (Captions)، ونصوص مفرغة كاملة (Transcripts)، ووصف صوتي للأحداث البصرية الصامتة (Audio Description)، مع منع التشغيل التلقائي للصوتيات تماماً.",
    "explanation": "الترجمات النصية المغلقة (Closed Captions) لا تكتفي بنقل كلمات الحوار فقط، بل تصف المؤثرات الصوتية المعبرة (مثل [موسيقى حزينة]، [صوت تصفيق حاد]). النص المفرغ الكامل يسمح للمكفوفين بقراءة الفيديو بأجهزة برايل أو بالبحث السريع داخل النص. وأي وسائط تفاعلية يجب أن تمنح المستخدم تحكماً كاملاً في مستوى الصوت والتقديم والتأخير دون أي مفاجآت.",
    "commonMistakes": [
      "تشغيل مقاطع الفيديو أو الإعلانات الترويجية بالصوت تلقائياً فور فتح الموقع مما يزعج مستخدمي قارئات الشاشة.",
      "الاعتماد على الترجمات التلقائية الآلية دون مراجعة بشرية للتدقيق اللغوي والمصطلحات."
    ],
    "followUpQuestions": [
      "ما الفرق بين Closed Captions (CC) و Open Captions (Hardcoded) في المرونة والتخصيص؟",
      "ما هي شروط تجنب ومضات الضوء السريعة (Three Flashes Rule) لمنع نوبات الصرع البصري؟"
    ],
    "sources": [
      {
        "title": "W3C — Making Audio and Video Media Accessible",
        "url": "https://www.w3.org/WAI/media/av/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxpm-001",
    "slug": "google-heart-framework-metrics",
    "trackId": "ui-ux",
    "topicIds": [
      "product-metrics"
    ],
    "difficulty": "Senior",
    "question": "ما هو إطار عمل HEART من Google وكيف تحول أهداف تجربة المستخدم إلى مقاييس رقمية دقيقة؟",
    "shortAnswer": "هو إطار يقيس تجربة المستخدم عبر 5 أبعاد: السعادة (Happiness)، التفاعل (Engagement)، التبني (Adoption)، الاحتفاظ (Retention)، ونجاح المهام (Task Success)، باستخدام مصفوفة الأهداف والإشارات والمقاييس (Goals - Signals - Metrics).",
    "explanation": "الميزة الكبرى لـ HEART هي جدول (GSM Matrix): تبدأ بتحديد 'الهدف' السامي على مستوى التجربة (مثل: مساعدة المستخدم في العثور على ما يريد بسهولة)، ثم تبحث عن 'الإشارة' السلوكية التي تدل على تحقيق الهدف (مثل: النقر على النتيجة الأولى دون تعديل البحث)، ثم تضع 'المقياس' الرقمي القابل للرصد في التحليلات (مثل: نسبة النقرات الناجحة من المحاولة الأولى). هذا يمنع الغرق في مقاييس سطحية مضللة.",
    "commonMistakes": [
      "جمع مقاييس عامة عشوائية دون تحديد الهدف الإنساني والتجاري وراء قياسها مسبقاً.",
      "التركيز الحصري على التفاعل (Engagement) حتى لو كان ناتجاً عن تخبط المستخدم واحتياجه لوقت أطول لإيجاد الزر."
    ],
    "followUpQuestions": [
      "كيف تفرق بين التبني (Adoption) لميزة جديدة والاحتفاظ بها (Retention) على المدى الطويل؟",
      "ما هي مقاييس السعادة (Happiness) وكيف تُجمع عبر استطلاعات الرأي داخل المنتج (In-app Surveys)؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Google's HEART Framework for Measuring UX",
        "url": "https://www.nngroup.com/articles/heart-framework/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxpm-002",
    "slug": "system-usability-scale-sus-calculation-and-benchmarking",
    "trackId": "ui-ux",
    "topicIds": [
      "product-metrics"
    ],
    "difficulty": "Mid",
    "question": "ما هو مقياس قابلية استخدام النظام (System Usability Scale - SUS) وكيف تحسب درجته وتفسرها؟",
    "shortAnswer": "هو استبيان معياري سريع مكون من 10 أسئلة متناوبة بين الإيجابية والسلبية يقيس قابلية استخدام المنتج برقم إجمالي يتراوح بين 0 إلى 100 نقطة.",
    "explanation": "للأسئلة الفردية (الإيجابية)، يُطرح 1 من تقييم المستخدم. وللأسئلة الزوجية (السلبية)، يُطرح تقييم المستخدم من 5. تُجمع النقاط وتُضرب في 2.5 للحصول على الدرجة النهائية. المتوسط المعياري العالمي لمقياس SUS هو 68 نقطة؛ أي درجة أعلى من 68 تعني قابلية استخدام مقبولة وجيدة (درجة C فأعلى)، ودرجة 80 فأعلى تعني منتجاً استثنائياً وسهل الاستخدام جداً (درجة A).",
    "commonMistakes": [
      "اعتبار درجة SUS نسبة مئوية مباشرة؛ فالدرجة 68 ليست 68% بل تمثل أداءً متوسطاً يقع عند الشريحة المئينية 50th Percentile.",
      "تعديل نصوص الأسئلة العشرة المعيارية مما يفقد النتائج مصداقيتها الإحصائية ومقارنتها العالمية."
    ],
    "followUpQuestions": [
      "ما الفرق بين قابلية الاستخدام المدركة عبر SUS والسهولة اللحظية للمهمة عبر مقياس SEQ (Single Ease Question)؟",
      "كم عدد العينات المطلوبة إحصائياً للحصول على نتيجة SUS ذات دلالة موثوقة؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Measuring Usability with the System Usability Scale (SUS)",
        "url": "https://www.nngroup.com/articles/measuring-usability/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxpm-003",
    "slug": "nps-vs-csat-vs-ces-user-satisfaction",
    "trackId": "ui-ux",
    "topicIds": [
      "product-metrics"
    ],
    "difficulty": "Mid",
    "question": "قارن بين صافي نقاط الترويج (NPS) ورضا العملاء (CSAT) ونقاط جهد العميل (Customer Effort Score - CES)؟",
    "shortAnswer": "الـ NPS يقيس ولاء العميل واستعداده للتوصية بالمنتج، والـ CSAT يقيس الرضا اللحظي عن تجربة أو خدمة محددة، بينما CES يقيس مدى سهولة أو صعوبة إنجاز المعاملة من وجهة نظر العميل.",
    "explanation": "الـ NPS يسأل: 'ما مدى احتمالية ترشيحك لمنصتنا لصديق؟' ويقسم المستخدمين لمروجين ومحايدين ومنتقدين. الـ CSAT يسأل: 'ما مدى رضاك عن هذه الميزة؟' بمقياس من 1 إلى 5. الـ CES يسأل: 'ما مدى سهولة إنجاز هذه المعاملة؟' وهو المقياس الأكثر ارتباطاً بقابلية الاستخدام وتوقع ولاء العملاء مستقبلاً، لأن تقليل المجهود هو جوهر التجربة الناجحة.",
    "commonMistakes": [
      "الاعتماد على NPS كمقياس وحيد لقابلية استخدام الواجهات؛ فالولاء يتأثر بالسعر والدعاية وليس بالواجهة فقط.",
      "إرسال استطلاعات CSAT في أوقات غير مناسبة تشتت المستخدم أثناء انهماكه في إتمام مهمة حرجة."
    ],
    "followUpQuestions": [
      "لماذا يعتبر خفض نقاط الجهد (Customer Effort Score) أكثر تأثيراً في منع التسرب من محاولات إبهار العميل؟",
      "كيف تحلل التعليقات النصية المصاحبة لدرجات الاستطلاعات لفهم الأسباب الحقيقية وراء الأرقام؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — NPS and Other Loyalty Metrics in UX",
        "url": "https://www.nngroup.com/articles/nps-ux/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxpm-004",
    "slug": "task-completion-rate-and-time-on-task",
    "trackId": "ui-ux",
    "topicIds": [
      "product-metrics"
    ],
    "difficulty": "Junior",
    "question": "كيف تقيس معدل إتمام المهمة (Task Completion Rate) والوقت المستغرق (Time on Task) وما دلالتهما؟",
    "shortAnswer": "معدل إتمام المهمة يقيس الفعالية (Effectiveness: نسبة المستخدمين الذين أكملوا الهدف بنجاح)، بينما الوقت المستغرق يقيس الكفاءة (Efficiency: كم دقيقة استغرقوها للإنجاز).",
    "explanation": "إذا كان معدل إتمام مهمة تسجيل الحساب 60% فقط، فهذا يعني وجود خلل جسيم في التصميم يدفع 40% للاستسلام والفشل. في الوقت المستغرق، القاعدة ليست دائماً 'الوقت الأقصر أفضل': في مهام المعاملات (كالتحويل البنكي وشراء تذكرة)، السرعة تعني كفاءة ونجاح؛ أما في مهام الاستكشاف وقراءة المقالات والتعلم، فالوقت الأطول يعني تفاعلاً واهتماماً أعلى من المستخدم.",
    "commonMistakes": [
      "اعتبار المستخدم الذي وصل للشاشة النهائية ناجحاً دون فحص ما إذا كانت البيانات المدخلة صحيحة.",
      "تفسير قضاء وقت طويل داخل صفحة الدفع على أنه تفاعل إيجابي بدلاً من كونه دليلاً على الارتباك والتردد."
    ],
    "followUpQuestions": [
      "كيف يؤثر معدل الخطأ لكل مهمة (Task Error Rate) على الوقت المستغرق للإنجاز؟",
      "ما هي طريقة حساب النطاق التقديري للمتوسط (Confidence Intervals) لمعدلات الإتمام؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Task Completion Rate: The Fundamental UX Metric",
        "url": "https://www.nngroup.com/articles/task-completion-rate/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxpm-005",
    "slug": "conversion-funnels-and-drop-off-analysis",
    "trackId": "ui-ux",
    "topicIds": [
      "product-metrics"
    ],
    "difficulty": "Mid",
    "question": "كيف تحلل مسارات التحويل (Conversion Funnels) واكتشاف نقاط التسرب (Drop-offs) في الواجهات؟",
    "shortAnswer": "بتتبع خطوات الرحلة بالتسلسل من نقطة البداية حتى الهدف النهائي، وتحديد الخطوة التي تشهد أعلى نسبة خروج وتوقف للمستخدمين للتركيز على فحص واجهتها وعلاج مشاكلها.",
    "explanation": "في متجر إلكتروني، يبدأ المسار بـ: مشاهدة السلة -> إدخال العنوان -> خيارات الشحن -> إدخال الدفع -> الشاشة النهائية. إذا أظهرت التحليلات أن 70% من المستخدمين يتسربون عند شاشة الشحن، فهذا يوجه المصممين فوراً للتحقيق: هل تكاليف الشحن غير واضحة ومفاجئة؟ هل الحقول معقدة؟ هل خيارات الدفع المحلية غير متوفرة؟ التحليل يحدد 'أين' تحدث المشكلة، بينما أبحاث المستخدمين تكشف 'لماذا'.",
    "commonMistakes": [
      "تعديل الواجهة بناءً على تخمينات شخصية بدلاً من الاستعانة ببيانات مسارات التحويل في تحديد موضع الخلل.",
      "تجاهل تتبع المستخدمين عبر الأجهزة المتعددة (Cross-device Funnels) عند حساب نسب التسرب."
    ],
    "followUpQuestions": [
      "كيف تساهم الخرائط الحرارية (Heatmaps) وتسجيلات الجلسات (Session Replays) في تفسير أسباب التسرب؟",
      "ما هو مفهوم التكلفة غير المحسوبة في عملية الدفع (Friction Audit) وكيف تقلصها؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Conversion Rates and UX",
        "url": "https://www.nngroup.com/articles/conversion-rates/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxpm-006",
    "slug": "ab-testing-statistical-significance-and-sample-size",
    "trackId": "ui-ux",
    "topicIds": [
      "product-metrics"
    ],
    "difficulty": "Senior",
    "question": "ما هي الشروط المنهجية لإجراء اختبارات أ/ب (A/B Testing) وما معنى الدلالة الإحصائية (p-value < 0.05)؟",
    "shortAnswer": "يتطلب إجراء الاختبار وجود فرضية محددة وعينة مستخدمين كافية وتوزيعاً عشوائياً موحداً واختبار متغير واحد فقط في كل مرة، وتأكيد الدلالة الإحصائية لضمان أن النتيجة ليست وليدة الصدفة.",
    "explanation": "قيمة P-value أقل من 0.05 تعني أن هناك ثقة بنسبة 95% بأن الفارق في معدل التحويل بين التصميم (A) والتصميم (B) ناتج عن التغيير التصميمي وليس تقلبات عشوائية في حركة الزوار. التسرع في إيقاف الاختبار بعد يومين بمجرد تقدم نسخة معينة هو خطأ علمي شهير (Peeking Problem)؛ يجب تشغيل الاختبار لدورات أسبوعية كاملة لتمثيل تقلبات سلوك المستخدمين بين أيام العمل وعطلات نهاية الأسبوع.",
    "commonMistakes": [
      "تغيير 10 عناصر مختلفة في النسخة (B) معاً مما يجعل من المستحيل معرفة أي عنصر كان سبباً في تغيير النتيجة.",
      "إيقاف الاختبار قبل الوصول لحجم العينة المحسوب إحصائياً مما يؤدي لنتائج إيجابية كاذبة (False Positives)."
    ],
    "followUpQuestions": [
      "متى يكون اختبار المتغيرات المتعددة (Multivariate Testing - MVT) أفضل من A/B Testing البسيط؟",
      "كيف يؤثر التغيير الجديد على المدى الطويل ضد تأثير الحداثة المؤقت (Novelty Effect)؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — A/B Testing 101",
        "url": "https://www.nngroup.com/articles/ab-testing/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxpm-007",
    "slug": "continuous-discovery-and-feedback-loops",
    "trackId": "ui-ux",
    "topicIds": [
      "product-metrics"
    ],
    "difficulty": "Mid",
    "question": "ما هي منهجية الاكتشاف المستمر (Continuous Discovery Habits) وكيف تضمن تدفق الملاحظات دورياً؟",
    "shortAnswer": "هي ممارسة يقوم فيها فريق المنتج (المصمم ومدير المنتج والمهندس الرئيسي) بإجراء أبحاث ومقابلات أسبوعية منتظمة ومباشرة مع المستخدمين لتوجيه القرارات باستمرار بدلاً من الأبحاث المتقطعة الموسمية.",
    "explanation": "المنهجية التقليدية كانت تقوم على إجراء بحث ضخم لمدة شهر في بداية السنة ثم إيقاف التحدث للمستخدمين والانكفاء على البرمجة لشهور. الاكتشاف المستمر (وفق تيريزا توريس Teresa Torres) يفرض قاعدة ذهبية: مقابلة مستخدم حقيقي واحد على الأقل كل أسبوع. هذا يمنح الفريق نبضاً حياً عن تطور الاحتياجات ويحول شجرة الفرص والحلول (Opportunity Solution Tree) إلى بوصلة يومية توجه تطوير المنتج.",
    "commonMistakes": [
      "الاعتماد على التقارير السنوية أو بحوث السوق النظرية المتقادمة في اتخاذ قرارات الميزات الأسبوعية.",
      "حصر المقابلات في إظهار النماذج والتحقق من التصميم بدلاً من الاستماع المفتوح للمشاكل اليومية للمستخدم."
    ],
    "followUpQuestions": [
      "كيف تبني قنوات مؤتمتة تجذب مشاركين مؤهلين للمقابلات الأسبوعية بدون جهد لوجستي معطل؟",
      "كيف تترجم مخرجات جلسات الاكتشاف الأسبوعية إلى Opportunity Solution Tree واضحة؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Continuous User Research Strategies",
        "url": "https://www.nngroup.com/articles/user-interviews/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxpm-008",
    "slug": "measuring-and-managing-design-debt",
    "trackId": "ui-ux",
    "topicIds": [
      "product-metrics"
    ],
    "difficulty": "Senior",
    "question": "ما هو الدين التصميمي (Design Debt) وما هي تكلفته غير المرئية على المنتج وسرعة الفريق؟",
    "shortAnswer": "هو التراكم التدريجي للمكونات غير المتناسقة، والأنماط التفاعلية المتباينة، والحلول المؤقتة السريعة التي تضاف للمنتج مع مرور الوقت دون تنقيح، مما يثقل تجربة المستخدم ويبطئ التطوير.",
    "explanation": "مثلما يدفع المبرمجون ثمن الدين التقني، يعاني المستخدم من الدين التصميمي: وجود 14 درجة مختلفة من اللون الأزرق، و 6 أنماط للأزرار، ورسائل خطأ متباينة في كل قسم. تكلفته تظهر في: 1) إرباك المستخدم وتراجع ثقته في احترافية المنصة. 2) إهدار وقت المصممين والمطورين في نقاش تفاصيل مكررة. 3) صعوبة تبني ميزات جديدة. الحل يكمن في تنظيم جلسات دورية لتنظيف الدين التصميمي (Design Debt Sprint).",
    "commonMistakes": [
      "تجاهل توثيق القرارات التصميمية المرتجلة والمستعجلة وتركها تتراكم لسنوات حتى تصبح المنصة غير متجانسة.",
      "افتراض أن إعادة التصميم الكاملة الجذرية من الصفر هي الحل الوحيد لتنظيف الدين التصميمي."
    ],
    "followUpQuestions": [
      "كيف تجري جرد ومراجعة بصرية (Design Debt Audit) لحصر التناقضات بالأرقام وعرضها على الإدارة؟",
      "كيف ترتب أولويات معالجة الدين التصميمي بناءً على مسار القيمة الأكثر تأثيراً على العملاء؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Design Debt and How to Manage It",
        "url": "https://www.nngroup.com/articles/design-systems-101/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxpm-009",
    "slug": "user-churn-and-respectful-offboarding-design",
    "trackId": "ui-ux",
    "topicIds": [
      "product-metrics"
    ],
    "difficulty": "Senior",
    "question": "كيف تصمم تجربة إيقاف وإلغاء الاشتراك (Offboarding) باحترام وتتجنب الأنماط المظلمة (Dark Patterns)؟",
    "shortAnswer": "بجعل زر إلغاء الحساب واضحاً وسهل الوصول ومباشراً بخطوات قليلة ومحترمة، وسؤال المستخدم عن سبب المغادرة بلطف، دون استخدام حيل الإخفاء أو الخداع النفسي (Roach Motel).",
    "explanation": "الأنماط المظلمة مثل إجبار المستخدم على الاتصال برقم هاتفي لإلغاء الاشتراك أو إخفاء رابط الإلغاء بلون باهت في تذييل الصفحة وتمريره عبر 10 صفحات تأكيد معقدة (Confirmshaming) قد تؤخر التسرب مؤقتاً، لكنها تدمر سمعة الشركة وتضمن عدم عودة المستخدم للأبد. التجربة الراقية تتيح الإلغاء بسهولة بضغطة زر، وتوفر خيارات مرنة كإيقاف الاشتراك مؤقتاً (Pause)، وتقدم تجربة وداع راقية تترك الباب مفتوحاً لعودته مستقبلاً.",
    "commonMistakes": [
      "استخدام صياغات محرجة وابتزازية عاطفياً في أزرار الإلغاء (مثل: 'نعم، أنا لا أحب توفير المال').",
      "حجب زر الإلغاء تماماً من التطبيق وإجبار المستخدم على التحدث مع موظف دعم مبيعات متمرس لمنعه."
    ],
    "followUpQuestions": [
      "كيف تحلل أسباب التسرب النوعية وتستخدمها لتحسين ميزات المنتج الأساسية؟",
      "ما هي القوانين الدولية الصارمة (مثل مبادرة Click-to-Cancel الفيدرالية وقوانين الاتحاد الأوروبي) ضد تعقيد الإلغاء؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Dark Patterns in UX and Deceptive Design",
        "url": "https://www.nngroup.com/articles/deceptive-design/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxpm-010",
    "slug": "data-informed-vs-data-driven-design",
    "trackId": "ui-ux",
    "topicIds": [
      "product-metrics"
    ],
    "difficulty": "Senior",
    "question": "ما الفرق الجوهري بين التصميم الموجه بالبيانات (Data-Driven) والتصميم المستنير بالبيانات (Data-Informed)؟",
    "shortAnswer": "التصميم الموجه بالبيانات يجعل الأرقام المجردة هي صانع القرار الوحيد والمطلق، بينما التصميم المستنير بالبيانات يعتبر الأرقام مدخلاً مهماً يُدمج مع التعاطف الإنساني وخبرة التصميم وسياق الاستخدام لاتخاذ القرار النهائي.",
    "explanation": "الانصياع الأعمى للبيانات (Data-driven) قد يقود المصمم لجعل زر الموقع أحمر وامضاً وضخماً لأنه حقق أعلى نسبة نقر في تجربة A/B، متجاهلاً أنه أفسد تجربة القراءة ودمر مصداقية العلامة التجارية على المدى البعيد. المصمم المستنير بالبيانات (Data-informed) ينظر للأرقام كإشارات تدل على أين يبحث، ولكنه يستخدم حكمه الإنساني والأخلاقي وأبحاث المستخدمين النوعية لتفسير تلك الأرقام وتطوير حلول مستدامة تخدم البشر والعمل معاً.",
    "commonMistakes": [
      "استبدال التفكير الإبداعي والتعاطف مع مشاكل المستخدمين بأرقام لوحات التحكم والتحليلات الآلية فقط.",
      "تجاهل البيانات والإحصائيات تماماً وتصميم الواجهات بناءً على الذوق الشخصي والحدس الفردي البحت."
    ],
    "followUpQuestions": [
      "كيف تتفادى الوقوع في فخ التحسين المحلي الضيق (Local Maximum) على حساب الرؤية الكبرى للمنتج؟",
      "كيف تتواصل مع فرق البيانات ومديري المنتجات لترجمة الأرقام الجافة إلى قرارات إنسانية حكيمة؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Analytics and UX: Better Together",
        "url": "https://www.nngroup.com/articles/analytics-user-experience/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxmg-001",
    "slug": "apple-hig-vs-material-design-three-philosophies",
    "trackId": "ui-ux",
    "topicIds": [
      "mobile-platform-guidelines"
    ],
    "difficulty": "Senior",
    "question": "قارن بين الفلسفة الجوهرية لإرشادات آبل (Apple HIG) وإرشادات جوجل (Material Design 3 - Material You)؟",
    "shortAnswer": "تركز Apple HIG على الوضوح وتراجع الواجهة لمصلحة المحتوى والعمق المستند إلى الخامات الفيزيائية (Materials & Vibrancy)، بينما Material Design 3 تركز على التعبير الشخصي والألوان الديناميكية المستخرجة من خلفية المستخدم (Color Extraction) والأسطح المرتفعة الصريحة.",
    "explanation": "فلسفة Apple تقوم على: 1) الوضوح (Clarity): النص مقروء في كل الأحجام والأيقونات دقيقة. 2) التقدير (Deference): واجهة النظام لا تنافس محتوى المستخدم بل تبرزه. 3) العمق (Depth): طبقات زجاجية تعبر عن التسلسل الهرمي. بالمقابل، Material Design 3 أحدثت ثورة عبر نظام الألوان الديناميكية (Dynamic Color) حيث تتكيف كل أزرار وعناصر التطبيق تلقائياً مع لوحة ألوان خلفية شاشة المستخدم، مع أشكال أزرار بيضاوية ضخمة واستخدام جريء للمساحات.",
    "commonMistakes": [
      "نسخ واجهة مستخدم مصممة لـ iOS وتصديرها لتطبيق أندرويد بحذافيرها والعكس، مما يربك المستخدمين.",
      "تجاهل معايير خطوط النظام الافتراضية (San Francisco في آبل و Roboto في جوجل) دون بديل عالي التوافق."
    ],
    "followUpQuestions": [
      "كيف تترجم الهوية البصرية لعلامتك التجارية لتعيش بانسجام داخل بيئتي iOS و Android دون أن تفقد طابعها؟",
      "ما هي الفروق في تصميم شريط العناوين العلوي (Top App Bar vs Navigation Bar) بين المنصتين؟"
    ],
    "sources": [
      {
        "title": "Apple Developer — Human Interface Guidelines Overview",
        "url": "https://developer.apple.com/design/human-interface-guidelines/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxmg-002",
    "slug": "mobile-thumb-zone-and-one-handed-ergonomics",
    "trackId": "ui-ux",
    "topicIds": [
      "mobile-platform-guidelines"
    ],
    "difficulty": "Junior",
    "question": "ما هي منطقة الإبهام (Thumb Zone) وكيف تصمم واجهات هواتف مريحة للاستخدام بيد واحدة؟",
    "shortAnswer": "هي النطاق الطبيعي الذي يمكن لإبهام المستخدم الوصول إليه على شاشة الهاتف بسهولة ودون الحاجة لتغيير قبضة يده أو استخدام اليد الأخرى؛ وتقسم إلى: منطقة سهلة (Natural)، ومنطقة مجهدة (Stretch)، ومنطقة صعبة الوصول (Hard).",
    "explanation": "أبحاث ستيفن هوبر (Steven Hoober) أثبتت أن أكثر من 49% من الأشخاص يمسكون هواتفهم بيد واحدة ويعتمدون كلياً على الإبهام للتفاعل. مع زيادة أحجام الهواتف الحديثة، أصبحت الزوايا العلوية للشاشة مناطق خطرة تتطلب جهداً كبيراً. التصميم المريح يضع أزرار الإجراءات الأساسية، وحقول البحث، وأشرطة الملاحة، والقوائم السفلية في النصف السفلي من الشاشة (المنطقة الطبيعية السهلة).",
    "commonMistakes": [
      "وضع زر الحفظ أو المتابعة الأساسي في أقصى الزاوية العلوية اليمنى أو اليسرى للهاتف.",
      "إجبار المستخدم على التمدد بأصابعه للأعلى في كل شاشة لإتمام إجراءات روتينية متكررة."
    ],
    "followUpQuestions": [
      "كيف تطبق شركات مثل Samsung (One UI) مفهوم 'مساحة المشاهدة في الأعلى ومساحة التفاعل في الأسفل'؟",
      "كيف يؤثر اختلاف المستخدمين في استخدام اليد اليمنى مقابل اليد اليسرى على تصميم مناطق اللمس؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Mobile Thumb Zone and One-Handed Ergonomics",
        "url": "https://www.nngroup.com/articles/mobile-navigation-patterns/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxmg-003",
    "slug": "safe-area-insets-and-dynamic-island-design",
    "trackId": "ui-ux",
    "topicIds": [
      "mobile-platform-guidelines"
    ],
    "difficulty": "Mid",
    "question": "كيف تصمم واجهات تحترم مساحات الأمان (Safe Area Insets) والجزيرة التفاعلية (Dynamic Island) وحواف الشاشات؟",
    "shortAnswer": "بفصل خلفية الشاشة (التي يجب أن تمتد بحرية إلى الحواف المطلقة للشاشة Edge-to-Edge) عن العناصر التفاعلية والنصوص التي يجب حصرها داخل حدود منطقة الأمان (Safe Area) لمنع حجبها بواسطة النتوءات وزوايا الشاشات الدائرية وشريط التنقل السفلي للنظام.",
    "explanation": "الهواتف الحديثة تخلت عن الحواف المستقيمة وأصبحت تحتوي على زوايا دائرية، شريط إيماءات العودة للشاشة الرئيسية في الأسفل (Home Indicator)، والجزيرة التفاعلية (Dynamic Island) أو ثقب الكاميرا في الأعلى. يجب أن تتمدد ألوان الخلفيات والصور لتملأ كامل الشاشة، بينما تبقى الأزرار والنصوص داخل الهوامش الآمنة حتى لا تتداخل مع مؤشرات النظام أو تصبح عصية على النقر.",
    "commonMistakes": [
      "وضع أزرار النقر قريبة جداً من شريط Home Bar السفلي في الآيفون مما يؤدي لخروج المستخدم من التطبيق بالخطأ عند محاولة الضغط عليها.",
      "قص المحتوى الهام أو الشعارات خلف فتحة الكاميرا الأمامية أو النتوء العلوي (Notch)."
    ],
    "followUpQuestions": [
      "كيف تصمم أنشطة حية (Live Activities) تتكامل بانسيابية مع الـ Dynamic Island في iOS؟",
      "ما هي معايير Android 14 و 15 الصارمة لفرض تجربة الشاشة الكاملة الحقيقية (Edge-to-Edge by default)؟"
    ],
    "sources": [
      {
        "title": "Apple Developer — Designing for the Safe Area and Dynamic Island",
        "url": "https://developer.apple.com/design/human-interface-guidelines/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxmg-004",
    "slug": "native-mobile-navigation-back-gestures",
    "trackId": "ui-ux",
    "topicIds": [
      "mobile-platform-guidelines"
    ],
    "difficulty": "Mid",
    "question": "قارن بين سلوك الرجوع في iOS (Swipe from edge) وسلوك الرجوع التنبؤي في أندرويد (Predictive Back Gesture)؟",
    "shortAnswer": "في iOS يتم الرجوع بالسحب من الحافة اليسرى للشاشة ويكشف الشاشة السابقة تفاعلياً، بينما في Android الحديث يتيح السحب من أي من الحافتين مع ميزة المعاينة التنبؤية (Predictive Back) التي توضح للمستخدم وجهته قبل أن يحرر إصبعه.",
    "explanation": "الرجوع التنبؤي في Android يحل مشكلة تاريخية شائعة: هل سيؤدي الرجوع إلى إغلاق التطبيق والعودة للشاشة الرئيسية أم العودة للصفحة السابقة؟ بفضل المعاينة الحركية، تنكمش الشاشة الحالية لتكشف ما وراءها، فإذا رأى المستخدم شاشة الهاتف الرئيسية وأراد البقاء في التطبيق، يمكنه ببساطة إلغاء السحب دون مغادرة التطبيق. يجب على المصممين تجنب وضع عناصر تمرير أفقية عند حواف الشاشة تتعارض مع إيماءة الرجوع.",
    "commonMistakes": [
      "وضع معرض صور أفقي (Carousel) يلتصق بحافة الشاشة تماماً مما يجعل سحب الصور يتداخل مع إيماءة الرجوع للنظام.",
      "تعطيل إيماءة الرجوع بالسحب في شاشات iOS وإجبار المستخدم على النقر على سهم الرجوع العلوي الصغير فقط."
    ],
    "followUpQuestions": [
      "كيف تصمم تنبيهاً لتأكيد الخروج عندما يحتوي النموذج الحالي على بيانات غير محفوظة أثناء إيماءة الرجوع؟",
      "ما هي المعايير الخاصة بتسلسل التنقل الهرمي (Hierarchical) مقابل التنقل التاريخي (Historical) في تطبيقات الجوال؟"
    ],
    "sources": [
      {
        "title": "Material Design — Predictive Back Design and Navigation",
        "url": "https://material.io/design/navigation/understanding-navigation.html"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxmg-005",
    "slug": "bottom-sheets-modal-vs-persistent-vs-expandable",
    "trackId": "ui-ux",
    "topicIds": [
      "mobile-platform-guidelines"
    ],
    "difficulty": "Junior",
    "question": "ما هي اللوحات السفلية (Bottom Sheets) وما الفرق بين اللوحة المؤقتة (Modal) والثابتة (Persistent)؟",
    "shortAnswer": "اللوحة السفلية المؤقتة (Modal Bottom Sheet) تنبثق فوق المحتوى مع تعتيم الخلفية لإنجاز مهمة فورية وتمنع التفاعل مع باقي الشاشة، بينما اللوحة الثابتة (Persistent / Standard) تظل ظاهرة ومتكاملة مع الشاشة وتسمح بالتفاعل المتزامن مع المحتوى خلفها.",
    "explanation": "الـ Modal Bottom Sheet مثالية للقوائم السريعة، وخيارات المشاركة، وتأكيد الإجراءات؛ لأنها تظهر في نطاق الإبهام وتغلق بسهولة بالسحب لأسفل. أما اللوحة الثابتة أو القابلة للتمدد (مثل مشغل الموسيقى المصغر في Spotify أو بطاقة مسار الرحلة في Google Maps) فتسمح للمستخدم برؤية الخريطة والتنقل فيها بينما تظل اللوحة السفلية قابلة للسحب لأعلى لمعرفة تفاصيل المسار الكاملة دون حجب التجربة.",
    "commonMistakes": [
      "استخدام Bottom Sheet لعمليات طويلة ومعقدة تتطلب نماذج إدخال متفرعة يسهل إغلاقها بالخطأ وفقدان البيانات.",
      "إهمال إضافة مقبض سحب بصري (Drag Handle) في أعلى اللوحة لإرشاد المستخدم بإمكانية سحبها وإغلاقها."
    ],
    "followUpQuestions": [
      "كيف تمنع التعارض بين التمرير الداخلي لمحتوى اللوحة وإيماءة سحب اللوحة لإغلاقها؟",
      "ما هي نقاط التوقف (Detents: Large, Medium, Custom) المعتمدة في تصميم اللوحات السفلية على iOS؟"
    ],
    "sources": [
      {
        "title": "Material Design — Bottom Sheets: Types and Interactions",
        "url": "https://material.io/components/bottom-sheets"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxmg-006",
    "slug": "responsive-web-vs-native-app-ux-expectations",
    "trackId": "ui-ux",
    "topicIds": [
      "mobile-platform-guidelines"
    ],
    "difficulty": "Senior",
    "question": "ما هي الفروق الجوهرية في توقعات تجربة المستخدم بين موقع الويب المتجاوب (Responsive Web) والتطبيق الأصيل (Native App)؟",
    "shortAnswer": "يتوقع المستخدم من التطبيق الأصيل استجابة لمسية فورية (60/120fps)، ودعماً للإيماءات السلسة، وعملاً دون اتصال بالإنترنت، واندماجاً مع عتاد الهاتف (الكاميرا، الحساسات، المحفظة الرقمية)، بينما يقبل من موقع الويب وتيرة أهدأ وتركيزاً على الاستهلاك السريع للمعلومات دون تنزيل.",
    "explanation": "تطبيقات الويب تعاني غالباً من تأخير طفيف في استجابة اللمس وتفتقر للتكامل مع إيماءات النظام العميقة. التطبيق الأصيل يملك وصولاً مباشراً للإشعارات الفورية الغنية، والبيومترية الفورية، والملاحة المستقرة بلا إعادة تحميل للصفحات. تصميم التطبيق الأصيل يتطلب احترام عادات المنصة (HIG و Material)، بينما الويب يتيح مساحة أكبر لفرض لغة العلامة التجارية الموحدة عبر كافة المتصفحات.",
    "commonMistakes": [
      "تصميم تطبيق أصيل كأنه مجرد Webview يعرض صفحات ويب بطيئة تفتقر للحس الحركي واللمسي للتطبيقات الحقيقية.",
      "مطالبة زوار موقع الويب بتحميل التطبيق فور فتح أول صفحة بحجب الشاشة بلافتات إجبارية مزعجة."
    ],
    "followUpQuestions": [
      "ما هي تطبيقات الويب التقدمية (PWA) وأين تقف بين الويب والتطبيقات الأصيلة في تجربة المستخدم؟",
      "كيف توازن بين تكلفة تطوير تطبيقين أصيلين مستقلين وبين إطلاق تطبيق هجين متعدد المنصات؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Mobile: Native Apps vs. Responsive Web",
        "url": "https://www.nngroup.com/articles/mobile-native-apps/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxmg-007",
    "slug": "push-notifications-permission-priming-and-ux",
    "trackId": "ui-ux",
    "topicIds": [
      "mobile-platform-guidelines"
    ],
    "difficulty": "Mid",
    "question": "كيف تصمم تجربة طلب صلاحيات الإشعارات (Push Notifications) لتفادي الرفض الفوري الصارم؟",
    "shortAnswer": "باستخدام استراتيجية 'التهيئة المسبقة' (Permission Priming): عرض شاشة حوار داخلية من التطبيق تشرح القيمة والمزايا الملموسة التي سيجنيها المستخدم أولاً، ولا تطلب إذن النظام الرسمي إلا بعد أن يبدي المستخدم موافقته المبدئية وفي اللحظة السياقية المناسبة.",
    "explanation": "إذا طلبت إذن إرسال الإشعارات عبر نافذة النظام فور أول ثانية لفتح التطبيق، سيرفض أكثر من 70% من المستخدمين الطلب فوراً خوفاً من الإعلانات المزعجة. بمجرد أن يرفض المستخدم إذن النظام الرسمي، يستحيل إظهار النافذة مرة أخرى برمجياً ويجب عليه الذهاب للإعدادات المعقدة يدوياً. الحل هو تأجيل الطلب حتى يحجز المستخدم طلباً ويحتاج لمتابعة وصوله، وتوضيح القيمة: 'سنرسل لك إشعاراً فقط عندما يقترب السائق من منزلك'.",
    "commonMistakes": [
      "إطلاق نافذة إذن الإشعارات الرسمية فور ظهور شاشة البداية (Splash Screen) قبل أن يتعرف المستخدم على التطبيق.",
      "إرسال إشعارات تسويقية غير مخصصة في أوقات نوم المستخدمين دون توفير خيارات لتخصيص التفضيلات."
    ],
    "followUpQuestions": [
      "كيف تصمم مركز تفضيلات الإشعارات (Notification Settings Center) داخل التطبيق لمنح المستخدم تحكماً كاملاً؟",
      "ما هي الإشعارات التفاعلية المؤقتة (Time-Sensitive Notifications) وما هي شروط استخدامها في iOS؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Asking for Permission in Mobile Apps",
        "url": "https://www.nngroup.com/articles/permission-requests/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxmg-008",
    "slug": "adaptive-layouts-tablets-foldables-and-split-views",
    "trackId": "ui-ux",
    "topicIds": [
      "mobile-platform-guidelines"
    ],
    "difficulty": "Senior",
    "question": "كيف تصمم واجهات تكيفية متقدمة (Adaptive Layouts) تدعم الأجهزة اللوحية والشاشات القابلة للطي (Foldables)؟",
    "shortAnswer": "بتصميم واجهات تنتقل بذكاء من العرض أحادي العمود في وضع الهاتف المطوي إلى التخطيط متعدد الأعمدة (List-Detail / Master-Detail Split View) عند فتح الشاشة الكبيرة، بدلاً من مجرد مد وتكبير عناصر الهاتف لتملأ الفراغ.",
    "explanation": "الشاشات الكبيرة كالأجهزة اللوحية والهواتف القابلة للطي (Foldables) توفر مساحة عرض تفاعلية رحبة. إذا قمت بتكبير بطاقة الهاتف لتمتد بعرض 12 بوصة، ستبدو مروعة ومشتتة. التصميم التكيفي الحقيقي يعرض قائمة العناصر في العمود الأيمن والتفاصيل الكاملة فوراً في العمود الأيسر، مستفيداً من الشاشتين في آن واحد، ومراعياً خط الطي المادي (Hinge Position) لضمان عدم وقوع النصوص أو الأزرار فوق المفصلة الفيزيائية.",
    "commonMistakes": [
      "مد عناصر الهاتف الصغيرة وأزراره عبر شاشات الآيباد الكبيرة مما يخلق مساحات فارغة قبيحة وغير مريحة للنقر.",
      "تجاهل اختبار التطبيق أثناء عملية فتح وقفل الشاشة الحية (Fold / Unfold Transitions) مما يسبب إعادة تشغيل الصفحة وفقدان البيانات."
    ],
    "followUpQuestions": [
      "ما هي نقاط التوقف التكيفية (Window Size Classes: Compact, Medium, Expanded) في معايير Material Design؟",
      "كيف تصمم تجارب تعدد المهام وتقسيم الشاشة المتزامن (Split Screen Multi-tasking) باحتراف؟"
    ],
    "sources": [
      {
        "title": "Material Design — Layout: Window Size Classes and Large Screens",
        "url": "https://material.io/design/layout/responsive-layout-grid.html"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxmg-009",
    "slug": "biometric-authentication-ux-and-fallback-flows",
    "trackId": "ui-ux",
    "topicIds": [
      "mobile-platform-guidelines"
    ],
    "difficulty": "Mid",
    "question": "كيف تصمم تجربة المصادقة البيومترية (Face ID / Fingerprint) وتدير مسارات التراجع والبدائل بأمان؟",
    "shortAnswer": "بجعل المصادقة البيومترية خيار تسريع اختياري للمستخدم وليس بديلاً مطلقاً عن كلمة المرور، مع توفير زر تراجع بديهي وسريع لإدخال رمز المرور (PIN/Password) فور فشل التعرف على الوجه أو البصمة.",
    "explanation": "البيومترية تفشل في مواقف كثيرة واقعية: ارتداء قناع، الإضاءة الخافتة، الأيدي المبللة، أو استخدام الهاتف بزاوية مائلة على المكتب. التصميم السلس يجب أن يقدم محاولة التعرف تلقائياً مع زر فوري: 'إدخال رمز المرور'. عند تفعيل ميزة حساسة (مثل أول تحويل مالي بعد تغيير الهاتف)، يجب طلب رمز المرور الأساسي لتعزيز الأمان والتأكد من هوية صاحب الحساب.",
    "commonMistakes": [
      "حظر المستخدم أو قفل الحساب فور محاولة بيومترية فاشلة واحدة دون إتاحة إدخال كلمة السر فوراً.",
      "تفعيل المصادقة بالبصمة أو الوجه تلقائياً دون استئذان المستخدم أو شرح كيفية تعطيلها من الإعدادات."
    ],
    "followUpQuestions": [
      "كيف تسهم مفاتيح المرور الرقمية (Passkeys) في إعادة تشكيل تجربة تسجيل الدخول عبر المنصات؟",
      "ما هي أفضل ممارسات تصميم شاشات التحقق بخطوتين (2FA) وتعبئة رموز الرسائل تلقائياً؟"
    ],
    "sources": [
      {
        "title": "Apple Developer — Authenticating with Face ID and Touch ID",
        "url": "https://developer.apple.com/design/human-interface-guidelines/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  },
  {
    "id": "uxmg-010",
    "slug": "offline-first-mobile-ux-and-sync-indicators",
    "trackId": "ui-ux",
    "topicIds": [
      "mobile-platform-guidelines"
    ],
    "difficulty": "Senior",
    "question": "كيف تصمم تجربة مستخدم تعمل في وضع عدم الاتصال أولاً (Offline-First UX) وتوضح حالات المزامنة؟",
    "shortAnswer": "بتمكين المستخدم من تصفح البيانات المخزنة محلياً بالكامل وإجراء التعديلات والإنشاء في وضع عدم الاتصال عبر واجهة تفاؤلية (Optimistic UI)، مع إظهار مؤشر مزامنة هادئ يوضح حالة حفظ البيانات ومزامنتها عند عودة الإنترنت.",
    "explanation": "في الهواتف، انقطاع الإنترنت ليس حدثاً استثنائياً، بل هو واقع يومي في المصاعد ومحطات المترو وأثناء السفر. التطبيق المحترف لا يعرض شاشة حظر خطأ حمراء تطرد المستخدم؛ بل يسمح له بكتابة رسالته أو إعداد مشروعه وتخزينه في قائمة الانتظار المحلية (Local Outbox)، مع إشارة لطيفة: 'تم الحفظ محلياً - ستتم المزامنة فور الاتصال'. هذا يمنح المستخدم شعوراً بالأمان والإنتاجية غير المنقطعة.",
    "commonMistakes": [
      "تعطيل إمكانية فتح التطبيق أو تصفح المحتوى الذي تم تنزيله مسبقاً لمجرد فقدان الاتصال بالشبكة.",
      "مسح التعديلات التي قام بها المستخدم أثناء عدم الاتصال أو الكتابة فوقها دون إشعار واضح لحل النزاع (Conflict Resolution)."
    ],
    "followUpQuestions": [
      "كيف تصمم واجهات حل نزاع تعديل البيانات (Merge Conflict Resolution) عندما تتصادم التعديلات المحلية مع السيرفر؟",
      "ما هي أفضل ممارسات إشعار المستخدم بالانتقال التلقائي بين شبكة Wi-Fi وبيانات الهاتف المحمول؟"
    ],
    "sources": [
      {
        "title": "Nielsen Norman Group — Mobile UX in Offline Mode",
        "url": "https://www.nngroup.com/articles/mobile-navigation-patterns/"
      }
    ],
    "lastReviewedAt": "2026-09-07"
  }
];
