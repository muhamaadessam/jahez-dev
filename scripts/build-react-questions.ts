import * as fs from 'node:fs';
import * as path from 'node:path';

interface QuestionDef {
  id: string;
  topicId: string;
  title: string;
  shortAnswer: string;
  detailedAnswer: string;
  codeExample: string;
  commonMistakes: string;
  followUp: string;
  difficulty: 'junior' | 'mid' | 'senior';
  importance: 'essential' | 'advanced';
  tags: string[];
  docUrl: string;
}

const topics = [
  { id: 'react-core', prefix: 'rcore', name: 'React Core & Virtual DOM' },
  { id: 'react-hooks', prefix: 'rhook', name: 'Hooks Fundamentals' },
  { id: 'react-hooks-advanced', prefix: 'rhookadv', name: 'Advanced Hooks & Custom Hooks' },
  { id: 'react-state-management', prefix: 'rstate', name: 'State Management & Context' },
  { id: 'react-routing-navigation', prefix: 'rroute', name: 'Routing & Single Page Apps' },
  { id: 'react-performance', prefix: 'rperf', name: 'Performance Optimization & Profiling' },
  { id: 'react-rendering-ssr', prefix: 'rrender', name: 'SSR, SSG & Server Components' },
  { id: 'react-forms-validation', prefix: 'rform', name: 'Forms & Data Handling' },
  { id: 'react-testing', prefix: 'rtest', name: 'Testing React Components' },
  { id: 'react-architecture-patterns', prefix: 'rpat', name: 'Architecture, Component Patterns & Best Practices' },
];

const rawData: Record<string, {
  title: string;
  shortAnswer: string;
  detailedAnswer: string;
  codeExample: string;
  commonMistakes: string;
  followUp: string;
  difficulty: 'junior' | 'mid' | 'senior';
  importance: 'essential' | 'advanced';
  tags: string[];
  docUrl: string;
}[]> = {
  'react-core': [
    {
      title: 'ما هو Virtual DOM في ريأكت وكيف يعمل خوارزمية الـ Reconciliation (Diffing)؟',
      shortAnswer: 'الـ Virtual DOM هو تمثيل خفيف في الذاكرة لشجرة DOM الحقيقية، تستخدمه خوارزمية Reconciliation لحساب الفروقات بدقة وإجراء أقل عدد ممكن من التعديلات المباشرة على متصفح الـ DOM.',
      detailedAnswer: 'عند تغير حالة مكون (State) في ريأكت، يتم إنشاء شجرة Virtual DOM جديدة. تقارن خوارزمية Diffing الشجرة الجديدة بالشجرة السابقة بناءً على فرضيتين: عناصر بنوعين مختلفين تنتج أشجاراً مختلفة، والمفاتيح (Keys) تتيح تتبع العناصر المستقرة عبر عمليات إعادة التصيير. بعد حساب الفروقات (Diffs)، يتم تطبيقها دفعة واحدة في خطوة Commit على الـ Real DOM.',
      codeExample: `// مثال توضيحي لنمط عمل العناصر الافتراضية
function Welcome({ name }: { name: string }) {
  // يترجم JSX إلى React.createElement("h1", null, \`مرحباً \${name}\`)
  return <h1 className="greeting">مرحباً {name}</h1>;
}`,
      commonMistakes: 'الاعتقاد بأن Virtual DOM أسرع دائماً من المعالجة المباشرة بالـ DOM الخام دون اعتبار تكلفة المقارنة في الذاكرة.',
      followUp: 'كيف يختلف محرك React Fiber الحديث عن محرك الـ Stack Reconciler القديم في جدولة الأولويات؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react', 'virtual-dom', 'reconciliation', 'core'],
      docUrl: 'https://react.dev/learn/preserving-and-resetting-state'
    },
    {
      title: 'لماذا تعتبر الـ Keys مهمة جداً عند عرض القوائم وما مخاطر استخدام فهرس المصفوفة (Index) كـ Key؟',
      shortAnswer: 'المفاتيح (Keys) تمكّن ريأكت من معرفة هوية العناصر الفريدة بين عمليات إعادة التصيير لمعرفة أيها أضيف أو أزيل أو تم تحريكه؛ استخدام الـ Index يؤدي لمشاكل في الحالة واختلال ترتيب المدخلات عند التعديل.',
      detailedAnswer: 'تعتمد خوارزمية الـ Diffing على الـ Key لمطابقة المكونات الفرعية عبر دورات الـ render. إذا استخدمت index المصفوفة كـ key وتمت إضافة عنصر في بداية القائمة أو حذف عنصر في المنتصف، يتغير فهرس جميع العناصر التالية، مما يجعل ريأكت تعيد استخدام نفس حالات المكونات الداخلية (مثل عناصر الـ input والـ animations) مع بيانات خاطئة.',
      codeExample: `// الاستخدام السليم: استخدام معرف فريد وثابت
function TodoList({ todos }: { todos: { id: string; text: string }[] }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}`,
      commonMistakes: 'استخدام Math.random() كـ key، مما يجبر ريأكت على تدمير وإعادة إنشاء الشجرة في كل render.',
      followUp: 'متى يعتبر استخدام index كمفتاح مقبولاً وآمناً بنسبة 100%؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react', 'lists', 'keys', 'rendering'],
      docUrl: 'https://react.dev/learn/rendering-lists'
    },
    {
      title: 'ما هو JSX وما الذي يحدث له خلف الكواليس أثناء عملية الـ Compilation؟',
      shortAnswer: 'JSX هو امتداد نحوي لـ JavaScript يسمح بكتابة بنية تشبه HTML داخل الكود، ويقوم المترجم (مثل Babel أو SWC) بتحويله إلى استدعاءات دوال إنشاء العناصر (React.createElement أو jsx runtime).',
      detailedAnswer: 'JSX ليس لغة مستقلة ولا يفهمه المتصفح مباشرة. يقوم Babel أو مترجمات TypeScript بتحويل كل وسم JSX إلى استدعاء دالة مثل _jsx("div", { children: "Hello" }). هذه الدوال تعيد كائنات JavaScript عادية تسمى React Elements، والتي تصف نوع العنصر والـ props والأبناء.',
      codeExample: `// كود JSX الأصلي:
const element = <button className="btn">انقر هنا</button>;

// ما يترجم إليه خلف الكواليس بواسطة React 17+ JSX Transform:
import { jsx as _jsx } from 'react/jsx-runtime';
const compiled = _jsx("button", { className: "btn", children: "انقر هنا" });`,
      commonMistakes: 'الاعتقاد بأن JSX يكتب عناصر DOM حقيقية مباشرة في المتصفح، أو محاولة استخدام كلمات محجوزة مثل class و for بدلاً من className و htmlFor.',
      followUp: 'ما الفرق بين الـ New JSX Transform الذي أُطلق في React 17 ونظام React.createElement القديم؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react', 'jsx', 'compiler', 'babel'],
      docUrl: 'https://react.dev/learn/writing-markup-with-jsx'
    },
    {
      title: 'ما هو مفهوم الـ Pure Components و Purity في دوال ريأكت (Pure Functions)؟',
      shortAnswer: 'الدالة أو المكون النقي هو الذي ينتج دائماً نفس المخرجات لنفس المدخلات (Props) دون إحداث أي آثار جانبية (Side Effects) خارج نطاقه أثناء الـ Render.',
      detailedAnswer: 'في ريأكت، يجب أن تكون مرحلة التصيير (Render Phase) خالية من الآثار الجانبية. لا يجوز لمكون أثناء تنفيذه أن يغير متغيرات عامة سابقة، أو يرسل طلبات HTTP، أو يعدل DOM مباشرة. الآثار الجانبية يجب أن تقع فقط داخل Event Handlers أو useEffect.',
      codeExample: `// مكون نقي: يعتمد فقط على الـ props
function Cup({ guest }: { guest: number }) {
  return <h2>كوب الشاي للضيف رقم #{guest}</h2>;
}`,
      commonMistakes: 'تعديل مصفوفة أو كائن ممرر في الـ props مباشرة داخل جسم الدالة (Mutation).',
      followUp: 'كيف يساعد StrictMode في كشف الدوال غير النقية عبر استدعائها مرتين في بيئة التطوير؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react', 'pure-functions', 'strict-mode', 'architecture'],
      docUrl: 'https://react.dev/learn/keeping-components-pure'
    },
    {
      title: 'ما هو دور React Fiber وما الفرق بين Render Phase و Commit Phase؟',
      shortAnswer: 'مرحلة Render تحسب التغييرات في الذاكرة ويمكن مقاطعتها وتأجيلها بواسطة Fiber لضمان استجابة الواجهة، بينما مرحلة Commit تطبق التغييرات على الـ DOM الحقيقي دفعة واحدة وتعمل بشكل متزامن دون مقاطعة.',
      detailedAnswer: 'محرك React Fiber يقسم العمل إلى وحدات عمل صغيرة (Fibers). خلال مرحلة Render، يقوم ريأكت باستدعاء المكونات ومقارنة الأشجار، ويمكنه إيقاف أو إرجاء التحديث إذا كانت هناك أحداث ذات أولوية أعلى (مثل إدخال المستخدم). بمجرد انتهاء الحسابات، تبدأ مرحلة Commit حيث يتم تحديث الـ DOM واستدعاء useLayoutEffect ثم useEffect.',
      codeExample: `// تمثيل تسلسل المراحل
// 1. Render Phase (Pure, no DOM changes, interruptible):
//    استدعاء Component(props) -> إرجاع Virtual DOM -> حساب الفروقات (Fiber tree diff)
// 2. Commit Phase (Mutates DOM, non-interruptible):
//    تحديث الـ Real DOM -> تنفيذ useLayoutEffect -> تنفيذ useEffect`,
      commonMistakes: 'وضع آثار جانبية كالـ fetch أو تغيير document.title مباشرة في مرحلة الـ Render بدلاً من useEffect.',
      followUp: 'كيف استفادت ميزات Concurrent React (مثل useTransition و Suspense) من بنية Fiber القابلة للمقاطعة؟',
      difficulty: 'senior',
      importance: 'advanced',
      tags: ['react', 'fiber', 'concurrency', 'render-pipeline'],
      docUrl: 'https://react.dev/learn/render-and-commit'
    },
    {
      title: 'كيف يعمل الـ Event Pooling والـ SyntheticEvent System في ريأكت؟',
      shortAnswer: 'يوفر ريأكت كائناً موحداً يدعى SyntheticEvent يغلف أحداث المتصفح الأصلية لضمان توافق سلوك الأحداث عبر كافة المتصفحات، مع إدارة الأحداث عبر Event Delegation عند جذر التطبيق.',
      detailedAnswer: 'بدلاً من ربط event listener لكل عنصر DOM على حدة، يقوم ريأكت بتسجيل مستمع واحد عند جذر الـ DOM (root container). عند وقوع الحدث، يتم توجيهه للمكون المناسب. كان هناك مفهوم Event Pooling لإعادة تدوير كائنات الأحداث في React 16 وما قبله، لكن تم إلغاؤه في React 17 لتبسيط التعامل مع العمليات غير المتزامنة.',
      codeExample: `function Button() {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // e هو SyntheticEvent موحد عبر كل المتصفحات
    console.log("إحداثيات النقر:", e.clientX, e.clientY);
  };

  return <button onClick={handleClick}>تسجيل الحدث</button>;
}`,
      commonMistakes: 'محاولة استدعاء e.persist() في React 17+ حيث أصبح كائن الحدث لا يخضع للـ Pooling ولا يتم مسح حقوله تلقائياً.',
      followUp: 'أين يتم تثبيت معالجات الأحداث بالضبط في React 17+ مقارنة بنظام document القديم في React 16؟',
      difficulty: 'mid',
      importance: 'advanced',
      tags: ['react', 'events', 'syntheticevent', 'delegation'],
      docUrl: 'https://react.dev/learn/responding-to-events'
    },
    {
      title: 'ما هي الـ Portals في ريأكت ومتى يجب استخدامها؟',
      shortAnswer: 'الـ Portals تتيح تصيير عنصر ابن في عقدة DOM تقع خارج التسلسل الهرمي للمكون الأب، مع الحفاظ على تصاعد الأحداث وسياق الـ Context كأنه عنصر ابن طبيعي.',
      detailedAnswer: 'تستخدم createPortal(children, domNode) لنقل عناصر مثل النوافذ المنبثقة (Modals)، ومربعات الحوار (Dialogs)، والتلميحات (Tooltips) إلى نهاية body المتصفح لتفادي مشاكل الـ z-index والـ overflow: hidden الخاصة بالحاوية الأب، مع استمرار عمل Event Bubbling وفق شجرة مكونات ريأكت وليس شجرة الـ DOM.',
      codeExample: `import { createPortal } from 'react-dom';

function Modal({ children, isOpen }: { children: React.ReactNode; isOpen: boolean }) {
  if (!isOpen) return null;

  const modalRoot = document.getElementById('modal-root') || document.body;
  return createPortal(
    <div className="modal-backdrop">
      <div className="modal-content">{children}</div>
    </div>,
    modalRoot
  );
}`,
      commonMistakes: 'نسيان أن الـ Events الصادرة من داخل الـ Portal ستتصاعد (Bubble) عبر شجرة مكونات ريأكت إلى المكون الأب حتى لو كان الـ DOM منفصلاً تماماً.',
      followUp: 'كيف تتصرف الـ Context Providers مع المكونات المعروضة عبر createPortal؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react', 'portals', 'dom', 'modals'],
      docUrl: 'https://react.dev/reference/react-dom/createPortal'
    },
    {
      title: 'ما هو الـ StrictMode وما هي الفحوصات والتدقيقات التي يجريها في بيئة التطوير؟',
      shortAnswer: 'الـ StrictMode هو أداة تساعد المطورين على رصد الممارسات القديمة والمشاكل الخفية في الكود، حيث يقوم بإعادة تصيير المكونات وإعادة تشغيل الـ Effects مرتين في بيئة التطوير.',
      detailedAnswer: 'لا ينتج StrictMode أي واجهة مرئية في الـ DOM. في بيئة التطوير فقط، يقوم بتشغيل الـ render مرتين لاكتشاف الدوال غير النقية (Impure Functions)، وتشغيل Setup والـ Cleanup في useEffect مرتين للتأكد من التخلص من الاشتراكات وتسريبات الذاكرة، بالإضافة للتحذير من استخدام دوال دورة الحياة المهجورة أو findDOMNode.',
      codeExample: `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);`,
      commonMistakes: 'الاعتقاد بأن استدعاء useEffect مرتين هو خطأ في ريأكت ومحاولة تعطيل StrictMode بدلاً من كتابة دالة cleanup سليمة.',
      followUp: 'هل يؤثر StrictMode على أداء تطبيق ريأكت النهائي في بيئة الإنتاج (Production)؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react', 'strict-mode', 'debugging', 'lifecycle'],
      docUrl: 'https://react.dev/reference/react/StrictMode'
    },
    {
      title: 'ما هو مبدأ الـ Lifting State Up ومتى نلجأ إليه؟',
      shortAnswer: 'هو نقل الحالة المشتركة إلى أقرب سلف (Ancestor) مشترك بين عدة مكونات تحتاج للتزامن مع نفس البيانات وتعديلها.',
      detailedAnswer: 'عندما يحتاج مكونان شقيقان للوصول لنفس البيانات أو تعديلها معاً، بدلاً من تكرار الحالة أو محاولة مزامنة حالتين محليتين، يتم رفع الحالة إلى المكون الأب المشترك وتمرير القيمة الحالية ودالة التحديث عبر الـ props.',
      codeExample: `// رفع حالة الفلتر للأب المشترك
function FilterableList() {
  const [filter, setFilter] = useState('');

  return (
    <div>
      <SearchBar filter={filter} onFilterChange={setFilter} />
      <ProductList filter={filter} />
    </div>
  );
}`,
      commonMistakes: 'الاحتفاظ بنسخة مكررة من الحالة في كل من الأب والابن ومحاولة مزامنتها داخل useEffect.',
      followUp: 'متى يصبح رفع الحالة مفرطاً ويتطلب الانتقال إلى Context أو مكتبة State Management؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react', 'state', 'lifting-state-up', 'architecture'],
      docUrl: 'https://react.dev/learn/sharing-state-between-components'
    },
    {
      title: 'ما هي الـ Error Boundaries وكيف تتعامل مع الأخطاء غير المتوقعة في شجرة المكونات؟',
      shortAnswer: 'هي مكونات خاصة تعترض أخطاء JavaScript في شجرة المكونات التابعة لها أثناء الـ Render و lifecycle methods، وتعرض واجهة بديلة (Fallback UI) دون انهيار التطبيق كاملاً.',
      detailedAnswer: 'يتم إنشاء الـ Error Boundary باستخدام Class Component يطبق إحدى دالتي getDerivedStateFromError (لتحديث الـ state وعرض واجهة بديلة) أو componentDidCatch (لتسجيل تفاصيل الخطأ لخدمات المراقبة). لا تعترض الـ Error Boundaries أخطاء معالجات الأحداث (Event Handlers) أو العمليات غير المتزامنة كـ setTimeout.',
      codeExample: `import React, { Component, ReactNode } from 'react';

interface Props { children: ReactNode; fallback: ReactNode }
interface State { hasError: boolean }

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("خطأ تم التقاطه في الواجهة:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}`,
      commonMistakes: 'محاولة استخدام try/catch داخل دالة الـ JSX المرتجعة للتعامل مع أخطاء تصيير المكونات الفرعية.',
      followUp: 'لماذا لا يوجد حتى الآن Hook مدمج بديل لـ Error Boundaries وما هي مكتبة react-error-boundary المستخدمة عادة؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react', 'error-boundary', 'lifecycle', 'resilience'],
      docUrl: 'https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary'
    }
  ],
  'react-hooks': [
    {
      title: 'ما هي قواعد الـ Hooks (Rules of Hooks) ولماذا يفرضها ريأكت بصرامة؟',
      shortAnswer: 'القاعدتان هما: استدعاء الـ Hooks فقط في المستوى الأعلى للدالة (Top Level)، واستدعاؤها فقط من داخل دوال مكونات ريأكت أو Custom Hooks، لضمان استقرار ترتيب المصفوفة الداخلية للحالات.',
      detailedAnswer: 'ريأكت يخزن حالات المكونات في قائمة مترابطة (Linked List) داخل الـ Fiber Node، ويعتمد حصرياً على الترتيب المتسلسل لاستدعاءات الـ Hooks في كل render لربط كل hook بحالته الخاصة. إذا وُضع الـ Hook داخل شرط (if) أو حلقة تكرار (loop)، فإن تخطي استدعائه سيتسبب في انزياح المؤشر وخلط الحالات بين الـ Hooks المختلفة.',
      codeExample: `// خاطئ: استدعاء داخل شرط
if (isLoggedIn) {
  useEffect(() => { ... }, []); // سيتسبب في خطأ فادح
}

// صحيح: استدعاء في المستوى الأعلى ووضع الشرط داخل الـ Hook
useEffect(() => {
  if (isLoggedIn) {
    // كود مشروط داخل الـ Hook السليم
  }
}, [isLoggedIn]);`,
      commonMistakes: 'محاولة استدعاء useState داخل دالة مساعدة عادية غير معرفة كـ Custom Hook يبدأ بـ use.',
      followUp: 'كيف يكتشف linter الـ eslint-plugin-react-hooks انتهاك قواعد الـ Hooks بشكل آلي أثناء التطوير؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react', 'hooks', 'rules-of-hooks', 'eslint'],
      docUrl: 'https://react.dev/warnings/invalid-hook-call-warning'
    },
    {
      title: 'ما الفرق بين تمرير قيمة مباشرة لدالة setState وتمرير دالة تحديث وظيفية (Updater Function)؟',
      shortAnswer: 'تمرير دالة تحديث (Functional Updater) يضمن قراءة أحدث حالة متوفرة في الطابور وحساب القيمة الجديدة بناءً عليها حتى مع وجود تحديثات مجمعة متعددة أو إغلاقات قديمة (Stale Closures).',
      detailedAnswer: 'التحديث في ريأكت غير متزامن ومجمع (Batched). إذا قمت باستدعاء setCount(count + 1) ثلاث مرات متتالية داخل نفس معالج الحدث، فستقرأ جميعها نفس قيمة count الأولية وتزيدها بمقدار 1 فقط. أما setCount(c => c + 1) فتأخذ القيمة السابقة من طابور التحديثات وتضمن زيادة القيمة ثلاث مرات.',
      codeExample: `// مثال الزيادة التراكمية الصحيحة
function Counter() {
  const [count, setCount] = useState(0);

  const incrementThreeTimes = () => {
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    setCount(prev => prev + 1); // النتيجة النهائية ستكون 3
  };

  return <button onClick={incrementThreeTimes}>القيمة: {count}</button>;
}`,
      commonMistakes: 'استخدام setCount(count + 1) داخل دوال غير متزامنة مثل setTimeout أو عند توالي العمليات، مما يسبب مشكلة Stale State.',
      followUp: 'كيف تعمل ميزة Automatic Batching التي تم تطبيقها في React 18 عبر جميع معالجات الأحداث والـ Promises؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react', 'usestate', 'batching', 'closures'],
      docUrl: 'https://react.dev/reference/react/useState#updating-state-based-on-the-previous-state'
    },
    {
      title: 'ما هي دورة حياة الـ useEffect وكيف تعمل دالة التنظيف (Cleanup Function)؟',
      shortAnswer: 'دالة الـ Cleanup تنفذ قبل كل تشغيل جديد للـ Effect وعند إزالة المكون من الـ DOM (Unmount)، ووظيفتها إلغاء الاشتراكات والاتصالات ومسح الـ Timers لتجنب تسريب الذاكرة.',
      detailedAnswer: 'يعمل useEffect بعد أن تكتمل مرحلة الـ Commit وتحديث الشاشة. إذا أعاد الـ effect دالة، فإن ريأكت يحتفظ بها ويشغلها قبل تنفيذ الـ effect التالي (عند تغير التبعيات) وقبل تدمير المكون نهائياً، مما يضمن بيئة نظيفة خالية من التعارضات أو محاولة تعديل حالة مكون تم حذفه.',
      codeExample: `useEffect(() => {
  const controller = new AbortController();

  fetch('/api/user-status', { signal: controller.signal })
    .then(res => res.json())
    .then(data => setStatus(data));

  return () => {
    // دالة التنظيف تلغي الطلب عند فك المكون أو إعادة التنفيذ
    controller.abort();
  };
}, [userId]);`,
      commonMistakes: 'نسيان تنظيف مستمعي الأحداث كـ window.addEventListener أو WebSockets داخل دالة الإرجاع للـ Effect.',
      followUp: 'لماذا تنفذ دالة الـ Cleanup قبل تنفيذ الـ Effect التالي وليس فقط عند الـ Unmount؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react', 'useeffect', 'cleanup', 'memory-leaks'],
      docUrl: 'https://react.dev/reference/react/useEffect'
    },
    {
      title: 'ما هي مشكلة الـ Stale Closures مع useEffect و useCallback وكيف نتغلب عليها؟',
      shortAnswer: 'تحدث عندما تلتقط الدالة متغيراً من الـ Scope الخارجي وقت إنشائها وتظل تحتفظ بقيمته القديمة حتى بعد تحديثه في دورات الـ render اللاحقة بسبب غيابه عن مصفوفة التبعيات (Dependency Array).',
      detailedAnswer: 'دوال JavaScript تغلق على المتغيرات في نطاق تعريفها. في ريأكت، كل render له نطاقه وقيمه الخاصة. إذا قمت بإنشاء دالة useCallback أو useEffect ولم تضع المتغير المستخدم في مصفوفة التبعيات، فإن الـ callback سيحتفظ بنسخة المتغير من الـ render الأول للأبد.',
      codeExample: `// مثال Stale Closure مع setInterval
useEffect(() => {
  const id = setInterval(() => {
    // سيطبع 0 دائماً إذا لم يوضع count في التبعيات أو لم نستخدم updater
    console.log("العدد الحالي:", count);
  }, 1000);
  return () => clearInterval(id);
}, []); // خطأ: غياب count من مصفوفة التبعيات

// الحل الصحيح: إما إدراج count أو استخدام functional updater
setCount(prev => prev + 1);`,
      commonMistakes: 'إسكات تحذيرات eslint-plugin-react-hooks بحذف مصفوفة التبعيات أو تجاهلها بدلاً من حل التبعية المفقودة.',
      followUp: 'كيف يفيد استخدام useRef في كسر الـ Stale Closures للقيم سريعة التغير؟',
      difficulty: 'senior',
      importance: 'essential',
      tags: ['react', 'closures', 'useeffect', 'usecallback'],
      docUrl: 'https://react.dev/learn/lifecycle-of-reactive-effects'
    },
    {
      title: 'متى يجب استخدام useRef وما الفارق الجوهري بينه وبين useState؟',
      shortAnswer: 'يستخدم useRef لتخزين قيم قابلة للتعديل تدوم طوال عمر المكون دون التسبب في إعادة التصيير (Re-render) عند تعديلها، وكذلك للوصول المباشر لعقد الـ DOM.',
      detailedAnswer: 'كائن الـ ref هو كائن JavaScript عادي يحتوي على خاصية .current. تعديل ref.current لا يشعر ريأكت بحدوث تغيير ولذلك لا يطلق دورة تصيير جديدة. يستخدم لتخزين معرّفات الـ Timers، وتخزين الحالة السابقة، والتحكم بالتركيز والوسائط داخل عناصر الـ DOM مباشرة.',
      codeExample: `function TextInputWithFocusButton() {
  const inputEl = useRef<HTMLInputElement>(null);

  const onButtonClick = () => {
    // الوصول المباشر لعنصر الـ DOM وتركيز المؤشر عليه
    inputEl.current?.focus();
  };

  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>تركيز المؤشر</button>
    </>
  );
}`,
      commonMistakes: 'قراءة أو كتابة ref.current أثناء مرحلة الـ Render بدلاً من معالجات الأحداث أو الـ Effects.',
      followUp: 'ما الفرق بين Callback Refs والـ Object Refs في التعامل مع القوائم الديناميكية؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react', 'useref', 'dom', 'rendering'],
      docUrl: 'https://react.dev/reference/react/useRef'
    },
    {
      title: 'ما الفرق بين useMemo و useCallback ومتى يكون استخدامهما ضاراً بالأداء؟',
      shortAnswer: 'دالة useMemo تحفظ نتيجة عملية حسابية معقدة، بينما useCallback تحفظ هوية دالة ممررة بين عمليات الـ Render لتفادي إعادة تصيير المكونات المحسنة بـ React.memo؛ استخدامهما للعمليات البسيطة يضيف عبء ذاكرة ومقارنة لا داعي له.',
      detailedAnswer: 'يقوم useMemo بتنفيذ الدالة وحفظ ناتجها، وإعادة حسابه فقط عند تغير التبعيات. أما useCallback(fn, deps) فهو معادل تماماً لـ useMemo(() => fn, deps). استخدام هذه الهوكس مع عمليات حسابية بدائية (مثل جمع عددين) يكلف المتصفح ذاكرة إضافية ومقارنة مصفوفات التبعيات في كل render دون أي فائدة حقيقية.',
      codeExample: `// useMemo لعملية تصفية ثقيلة
const filteredList = useMemo(() => {
  return hugeList.filter(item => item.score > threshold);
}, [hugeList, threshold]);

// useCallback لتثبيت مرجع الدالة لتمريره لمكون مغلف بـ React.memo
const handleSelect = useCallback((id: string) => {
  setSelectedId(id);
}, []);`,
      commonMistakes: 'تغليف كل دالة في التطبيق بـ useCallback دون أن تكون ممررة لمكون نقي مدعوم بـ memo أو مصفوفة تبعيات لـ hook آخر.',
      followUp: 'كيف يقوم مترجم React Compiler (المعروف سابقاً بـ Forget) بأتمتة Memoization تلقائياً؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react', 'usememo', 'usecallback', 'performance'],
      docUrl: 'https://react.dev/reference/react/useMemo'
    },
    {
      title: 'ما هو useReducer ومتى يفضل اختياره كبديل لـ useState؟',
      shortAnswer: 'هو hook لإدارة الحالات المعقدة التي تتضمن انتقالات حالات متعددة أو عندما تعتمد الحالة التالية على خطوات متفرقة، حيث يفصل منطق تعديل الحالة في دالة Reducer نقية ومستقلة.',
      detailedAnswer: 'يتبع useReducer نمط Redux، حيث يستقبل دالة reducer بصيغة (state, action) => newState مع حالة ابتدائية، ويعيد [state, dispatch]. يفضل استخدامه عندما تتألف الحالة من كائن معقد ذي حقول متداخلة، أو عندما يكون منطق التحديث قابلاً للاختبار بمعزل عن المكون، أو عند الحاجة لتفادي تمرير callbacks متعددة واستبدالها بدالة dispatch مستقرة.',
      codeExample: `type Action = { type: 'inc' } | { type: 'dec' } | { type: 'reset' };

function reducer(state: number, action: Action): number {
  switch (action.type) {
    case 'inc': return state + 1;
    case 'dec': return state - 1;
    case 'reset': return 0;
    default: return state;
  }
}

function Counter() {
  const [count, dispatch] = useReducer(reducer, 0);
  return (
    <div>
      <p>العدد: {count}</p>
      <button onClick={() => dispatch({ type: 'inc' })}>+</button>
      <button onClick={() => dispatch({ type: 'reset' })}>إعادة ضبط</button>
    </div>
  );
}`,
      commonMistakes: 'تنفيذ آثار جانبية (كالـ API calls) مباشرة داخل دالة الـ reducer بدلاً من إبقائها دالة نقية 100%.',
      followUp: 'كيف يسهل useReducer تحسين الأداء عند تمرير dispatch لأسفل شجرة المكونات العميقة بدلاً من دوال الـ callbacks؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react', 'usereducer', 'state-machine', 'redux-pattern'],
      docUrl: 'https://react.dev/reference/react/useReducer'
    },
    {
      title: 'ما الفرق بين useEffect و useLayoutEffect وتوقيت تنفيذهما بالنسبة لرسم الشاشة؟',
      shortAnswer: 'دالة useLayoutEffect تعمل بشكل متزامن بعد تعديل الـ DOM وقبل أن يقوم المتصفح برسم الشاشة (Paint)، بينما useEffect تعمل بشكل غير متزامن بعد انتهاء رسم الشاشة.',
      detailedAnswer: 'إذا كان لديك كود يقوم بحساب أبعاد عنصر في الـ DOM وتعديل مظهره (مثل موضع tooltip أو scroll)، فإن تنفيذه في useEffect يسبب وميضاً مرئياً (Flicker) لأن المتصفح يرسم الواجهة أولاً ثم يعيد ريأكت تعديلها. useLayoutEffect يوقف رسم المتصفح حتى ينتهي تنفيذ الكود المتزامن ليظهر التعديل النهائي دفعة واحدة للمستخدم.',
      codeExample: `useLayoutEffect(() => {
  const rect = tooltipRef.current?.getBoundingClientRect();
  if (rect) {
    setPosition({ top: rect.bottom + 8, left: rect.left });
  }
}, []);`,
      commonMistakes: 'الإفراط في استخدام useLayoutEffect للعمليات العادية كالـ fetching، مما يسبب تجميد رسم المتصفح وتعطيل الاستجابة.',
      followUp: 'لماذا يطلق SSR تحذيراً عند استخدام useLayoutEffect على الخادم وما هو الحل البديل؟',
      difficulty: 'senior',
      importance: 'advanced',
      tags: ['react', 'uselayouteffect', 'dom-measure', 'flicker'],
      docUrl: 'https://react.dev/reference/react/useLayoutEffect'
    },
    {
      title: 'ما هو useContext وكيف تتصرف المكونات المشتركة عند تحديث قيمة الـ Context Provider؟',
      shortAnswer: 'هو hook يتيح للمكونات قراءة البيانات من Provider أعلى الشجرة مباشرة دون Prop Drilling؛ وعندما تتغير قيمة الـ Provider يعاد تصيير كافة المكونات المستهلكة له تلقائياً.',
      detailedAnswer: 'عندما تتغير الخاصية value في الـ Context.Provider، فإن كل مكون يستدعي useContext(MyContext) التابع له يعاد تصييره فوراً بغض النظر عما إذا كان المكون الأب محمياً بـ React.memo أو لا. لتفادي إعادة تصيير المكونات غير المعنية، يفضل تقسيم الـ Contexts حسب تكرار التحديث أو فصل حالة القراءة عن دوال التحديث.',
      codeExample: `const ThemeContext = createContext<'light' | 'dark'>('light');

function DisplayMode() {
  const theme = useContext(ThemeContext);
  return <div className={\`theme-\${theme}\`}>الوضع المختار: {theme}</div>;
}`,
      commonMistakes: 'تمرير كائن جديد غير معالج بـ useMemo كـ value للـ Provider، مما يسبب إعادة تصيير لكافة المستهلكين في كل دورة.',
      followUp: 'كيف يمكنك تجنب مشكلة إعادة التصيير المفرطة دون الاستعانة بمكتبة خارجية لإدارة الحالة؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react', 'usecontext', 'prop-drilling', 'state'],
      docUrl: 'https://react.dev/reference/react/useContext'
    },
    {
      title: 'ما هو useImperativeHandle وكيف نستخدمه مع forwardRef للتحكم في واجهة المكون الابن؟',
      shortAnswer: 'يستخدم useImperativeHandle لتخصيص الخصائص والدوال التي يتم كشفها للمكون الأب عبر الـ Ref، بدلاً من تعريضه لكامل عقدة الـ DOM الداخلية.',
      detailedAnswer: 'عند استخدام forwardRef، يحصل المكون الأب على إمكانية الوصول لعنصر DOM الداخلي. أحياناً ترغب في حماية المكون الداخلي وكشف أفعال محددة فقط (مثل scrollIntoView أو focus أو reset). يقوم useImperativeHandle بتعريف كائن واجهة برمجية مخصص مرتبط بالـ ref.',
      codeExample: `import { forwardRef, useImperativeHandle, useRef } from 'react';

export interface FancyInputHandle {
  focusInput: () => void;
}

export const FancyInput = forwardRef<FancyInputHandle, {}>((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focusInput: () => {
      inputRef.current?.focus();
    }
  }));

  return <input ref={inputRef} className="fancy-styled-input" />;
});`,
      commonMistakes: 'الإفراط في استخدام useImperativeHandle لتحويل البرمجة من النمط التقريري (Declarative) إلى النمط الإجرائي (Imperative).',
      followUp: 'كيف أتاح React 19 استقبال الـ ref مباشرة كـ prop طبيعي دون الحاجة لاستخدام forwardRef؟',
      difficulty: 'senior',
      importance: 'advanced',
      tags: ['react', 'useimperativehandle', 'forwardref', 'imperative'],
      docUrl: 'https://react.dev/reference/react/useImperativeHandle'
    }
  ],
  'react-hooks-advanced': [
    {
      title: 'كيف تبني Custom Hook لإدارة استهلاك الـ LocalStorage مع دعم التزامن بين النوافذ؟',
      shortAnswer: 'نبني Hook يجمع بين useState للقيمة المحلية و useEffect للاستماع لأحداث window.addEventListener("storage") لقراءة التحديثات الصادرة من النوافذ والتبويبات الأخرى.',
      detailedAnswer: 'يجب على الـ Hook قراءة القيمة الأولية بأمان من localStorage مع معالجة أخطاء JSON parsing و SSR (عدم توفر window على الخادم). لتسجيل التغييرات بين مختلف التبويبات في المتصفح، يتم الاستماع لحدث "storage" وتحديث الحالة المحلية تلقائياً.',
      codeExample: `function useLocalStorage<T>(key: string, initialValue: T): [T, (val: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (val: T | ((prev: T) => T)) => {
    const valueToStore = val instanceof Function ? val(storedValue) : val;
    setStoredValue(valueToStore);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    }
  };

  return [storedValue, setValue];
}`,
      commonMistakes: 'قراءة localStorage مباشرة في جسم المكون أثناء SSR مما يؤدي لانهيار السيرفر أو خطأ Hydration mismatch.',
      followUp: 'كيف نستخدم useSyncExternalStore كبديل حديث وأكثر كفاءة لبناء هذا الـ Hook في React 18؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react', 'custom-hooks', 'localstorage', 'browser-api'],
      docUrl: 'https://react.dev/learn/reusing-logic-with-custom-hooks'
    },
    {
      title: 'ما هو دور useSyncExternalStore ولماذا تم تقديمه في React 18 لحل مشكلة الـ Tearing؟',
      shortAnswer: 'يقوم useSyncExternalStore بالاشتراك في مخازن البيانات الخارجية (External Stores) بشكل متزامن لمنع ظاهرة Tearing الناتجة عن تعديل البيانات أثناء تشغيل التحديثات المتزامنة المقاطعة (Concurrent Rendering).',
      detailedAnswer: 'في الوضع التوافقي (Concurrent Mode)، يمكن لريأكت مقاطعة الـ render واستئنافه لاحقاً. إذا تغير مصدر بيانات خارجي (مثل Redux أو window.history) أثناء المقاطعة، قد تعرض بعض المكونات القيمة القديمة بينما تعرض مكونات أخرى القيمة الجديدة على نفس الشاشة، وهو ما يعرف بالـ Tearing. يضمن هذا الـ hook قراءة متسقة ذرية.',
      codeExample: `import { useSyncExternalStore } from 'react';

function subscribe(callback: () => void) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true // القيمة الافتراضية على الخادم أثناء SSR
  );
}`,
      commonMistakes: 'إرجاع كائن جديد دائماً في دالة getSnapshot مما يدخل المكون في حلقة لا نهائية من إعادة التصيير.',
      followUp: 'كيف تستفيد مكتبات الحالة كـ Redux و Zustand من useSyncExternalStore؟',
      difficulty: 'senior',
      importance: 'advanced',
      tags: ['react', 'usesyncexternalstore', 'concurrency', 'tearing'],
      docUrl: 'https://react.dev/reference/react/useSyncExternalStore'
    },
    {
      title: 'ما هو useTransition وكيف يحسن استجابة واجهة المستخدم في العمليات الثقيلة؟',
      shortAnswer: 'هو hook يتيح تمييز تحديث حالة معينة كـ Transition غير عاجلة، مما يسمح للمتصفح بإعطاء الأولوية للتفاعلات العاجلة (كالطباعة والنقر) ومقاطعة تحديثات الانتقال البطيئة.',
      detailedAnswer: 'يعيد useTransition مصفوفة تحتوي على [isPending, startTransition]. عند تغليف تحديث الحالة بداخل startTransition، يخبر ريأكت بأن هذا التحديث يمكن تأجيله أو التخلي عنه إذا قام المستخدم بإجراء تفاعل جديد، مع توفير مؤشر isPending لعرض شريط تحميل أو حالة انتظار.',
      codeExample: `function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('home');

  function selectTab(nextTab: string) {
    startTransition(() => {
      setTab(nextTab); // تحديث غير عاجل يمكن مقاطعته
    });
  }

  return (
    <div>
      <button onClick={() => selectTab('heavy-reports')}>عرض التقارير</button>
      {isPending && <p>جاري تحميل التقرير...</p>}
      <HeavyTabContent tab={tab} />
    </div>
  );
}`,
      commonMistakes: 'تغليف مدخلات النص المتزامنة كـ input onChange بـ startTransition مما يجعل حقل الإدخال يبدو متأخراً وبطيئاً.',
      followUp: 'ما الفرق بين useTransition ودالة startTransition المنفصلة التي تستورد مباشرة من React؟',
      difficulty: 'senior',
      importance: 'essential',
      tags: ['react', 'usetransition', 'concurrency', 'performance'],
      docUrl: 'https://react.dev/reference/react/useTransition'
    },
    {
      title: 'ما هو useDeferredValue وكيف يختلف عن مفهوم الـ Debounce / Throttle التقليدي؟',
      shortAnswer: 'يقوم useDeferredValue بتأجيل تحديث جزء من الشاشة ليتبع التحديث العاجل تلقائياً بناءً على سرعة معالج الجهاز، دون فرض مهلة زمنية ثابتة (Timeout) كما يفعل Debounce.',
      detailedAnswer: 'يقبل useDeferredValue قيمة ويعيد نسخة مؤجلة منها. أثناء الـ render السريع، يحتفظ بالقيمة القديمة حتى ينتهي المتصفح من العمل العاجل، ثم يطلق عملية render بالخلفية بالقيمة الجديدة فور توفر طاقة المعالجة. هذا يوفر تجربة أكثر مرونة وتكيفاً مع أجهزة المستخدمين مقارنة بفترات التأخير الثابتة (e.g. 300ms).',
      codeExample: `function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      {/* القائمة الثقيلة تتلقى القيمة المؤجلة لمنع تجميد حقل الإدخال */}
      <SlowList search={deferredQuery} />
    </div>
  );
}`,
      commonMistakes: 'الاعتقاد بأن useDeferredValue يمنع استدعاءات الـ Network عند كتابة نصوص سريعة بدلاً من دوره الأساسي في تخفيف عبء الـ CPU Rendering.',
      followUp: 'متى ندمج بين Debouncing للطلبات الشبكية و useDeferredValue لتصيير القوائم الثقيلة؟',
      difficulty: 'mid',
      importance: 'advanced',
      tags: ['react', 'usedeferredvalue', 'debounce', 'performance'],
      docUrl: 'https://react.dev/reference/react/useDeferredValue'
    },
    {
      title: 'ما هو useId ولماذا يعتبر ضرورياً لإنشاء معرفات فريدة متوافقة مع إمكانية الوصول (Accessibility) في SSR؟',
      shortAnswer: 'يقوم useId بتوليد معرّف نصي فريد ومستقر يكون متطابقاً بنسبة 100% بين السيرفر والعميل، مما يمنع تعارض الهوية وأخطاء الـ Hydration Mismatch.',
      detailedAnswer: 'في تطبيقات SSR، يؤدي توليد معرفات عشوائية بواسطة Math.random() إلى اختلاف قيمة الـ ID المنشأة على الخادم عن تلك المنشأة في المتصفح، مسبباً Hydration mismatch. يوفر useId معرفاً هرمياً يعتمد على موضع المكون في شجرة الشفرة، وهو مثالي لربط عناصر aria-describedby وحقول النماذج بملصقاتها (labels).',
      codeExample: `function PasswordField() {
  const passwordHintId = useId();

  return (
    <div>
      <label>كلمة المرور: <input type="password" aria-describedby={passwordHintId} /></label>
      <p id={passwordHintId}>يجب أن تتكون من 8 أحرف على الأقل.</p>
    </div>
  );
}`,
      commonMistakes: 'استخدام useId لإنشاء المفاتيح (keys) في القوائم والمصفوفات.',
      followUp: 'لماذا يحذر التوثيق الرسمي لريأكت من استخدام useId لتوليد الـ keys في القوائم التكرارية؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react', 'useid', 'accessibility', 'ssr'],
      docUrl: 'https://react.dev/reference/react/useId'
    },
    {
      title: 'كيف تصمم Custom Hook للـ Debouncing للقيم أو الدوال مع إلغاء العمليات السابقة؟',
      shortAnswer: 'نصمم Hook يستقبل القيمة ومدة التأخير، ويستخدم useState للقيمة المؤجلة مع useEffect يحتوي على setTimeout لإطلاق التحديث ودالة cleanup تقوم بـ clearTimeout.',
      detailedAnswer: 'يعمل Hook التهدئة (Debounce) على تجميع التغييرات المتكررة وتأجيل تنفيذها حتى يستقر التفاعل لفترة زمنية محددة. بفضل آلية الـ cleanup في useEffect، يتم إلغاء الـ timer السابق في كل مرة تتغير فيها القيمة قبل انقضاء المهلة.',
      codeExample: `function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}`,
      commonMistakes: 'عدم توفير دالة تنظيف للـ timeout مما يسبب تشغيل استدعاءات متأخرة متراكبة.',
      followUp: 'كيف نحول هذا النمط ليعمل مع الدوال الإجرائية بدلاً من مجرد تأخير القيم المتغيرة؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react', 'custom-hooks', 'debounce', 'timers'],
      docUrl: 'https://react.dev/learn/reusing-logic-with-custom-hooks'
    },
    {
      title: 'ما هو useInsertionEffect وما هي الحالات الاستثنائية جداً التي يتطلب فيها استخدامه؟',
      shortAnswer: 'هو hook مخصص حصرياً لمطوري مكتبات CSS-in-JS (مثل Emotion و Styled Components) لحقن وسوم الـ <style> في الـ DOM قبل قراءة أي قياسات تخطيطية بواسطة useLayoutEffect.',
      detailedAnswer: 'يعمل useInsertionEffect قبل كل عمليات useLayoutEffect وقبل إجراء المتصفح لحسابات التنسيق والـ Layout. يمنع هذا الـ hook إعادة حساب الـ CSSOM والتخطيط مراراً وتكراراً أثناء الـ render. لا يحق له الوصول للـ refs أو إطلاق تحديثات حالة، ولا ينبغي استخدامه في كود التطبيقات العادية.',
      codeExample: `import { useInsertionEffect } from 'react';

// استخدام حصري في مكتبات التنسيق CSS-in-JS
function useCSS(rule: string) {
  useInsertionEffect(() => {
    const style = document.createElement('style');
    style.textContent = rule;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, [rule]);
}`,
      commonMistakes: 'استخدام useInsertionEffect في كود التطبيق المعتاد لتنفيذ منطق تجاري أو قراءة عناصر الـ DOM.',
      followUp: 'لماذا تنصح التوجهات الحديثة مثل Tailwind و CSS Modules بتجنب حقن الـ CSS أثناء وقت التشغيل تماماً؟',
      difficulty: 'senior',
      importance: 'advanced',
      tags: ['react', 'useinsertioneffect', 'css-in-js', 'internals'],
      docUrl: 'https://react.dev/reference/react/useInsertionEffect'
    },
    {
      title: 'كيف تبني Custom Hook للـ Infinite Scroll باستخدام IntersectionObserver؟',
      shortAnswer: 'ننشئ Hook يراقب عنصراً مستهدفاً (Sentinel Ref) في أسفل القائمة، وعند تقاطعه مع الـ viewport يطلق دالة جلب المزيد من البيانات تلقائياً.',
      detailedAnswer: 'باستخدام IntersectionObserver داخل useEffect مع تنظيف المراقب عند فك المكون، نقوم بفحص ظهور العنصر الأخير. يفيد تمرير حالات مثل hasMore و isLoading لمنع تكرار إطلاق الطلبات الشبكية أثناء انتظار الاستجابة أو عند استنفاد كافة البيانات.',
      codeExample: `function useInfiniteScroll(onLoadMore: () => void, hasMore: boolean, loading: boolean) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore || loading) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        onLoadMore();
      }
    });

    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [onLoadMore, hasMore, loading]);

  return sentinelRef;
}`,
      commonMistakes: 'الاستماع لحدث scroll المباشر على window دون تقييد (throttling)، مما يسبب استهلاكاً مكثفاً للمعالج.',
      followUp: 'كيف تتأكد من إلغاء وتحديث مراقب الـ Observer عندما تتغير أبعاد القائمة بسرعة؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react', 'custom-hooks', 'infinite-scroll', 'intersection-observer'],
      docUrl: 'https://react.dev/learn/reusing-logic-with-custom-hooks'
    },
    {
      title: 'ما هي الـ Action Hooks الجديدة في React 19 (مثل useActionState و useFormStatus و useOptimistic)؟',
      shortAnswer: 'هي منظومة متكاملة لتبسيط إدارة النماذج والعمليات غير المتزامنة، حيث تتعامل تلقائياً مع حالات التحميل والخطأ والتحديث التفاؤلي (Optimistic UI) دون الحاجة لتعريف حالات يدوية متعددة.',
      detailedAnswer: 'يقدم React 19 ميزات لدعم دورة حياة الـ Actions: يقوم useActionState بإدارة نتيجة وحالة تنفيذ دالة غير متزامنة، ويتيح useFormStatus للأزرار والحقول معرفة حالة تقديم النموذج الأب دون تمرير props، بينما يوفر useOptimistic عرضاً فورياً للنتيجة المتوقعة للمستخدم قبل اكتمال رد الخادم مع الرجوع التلقائي عند الفشل.',
      codeExample: `import { useOptimistic, useTransition } from 'react';

function LikeButton({ initialLikes }: { initialLikes: number }) {
  const [isPending, startTransition] = useTransition();
  const [likes, setOptimisticLikes] = useOptimistic(
    initialLikes,
    (state, delta: number) => state + delta
  );

  async function handleLike() {
    startTransition(async () => {
      setOptimisticLikes(1); // تحديث الواجهة فوراً
      await api.likePost();   // استدعاء السيرفر
    });
  }

  return <button onClick={handleLike} disabled={isPending}>إعجاب ({likes})</button>;
}`,
      commonMistakes: 'محاولة استدعاء دالة التحديث التفاؤلي خارج نطاق startTransition أو بدون Action مدعوم.',
      followUp: 'كيف غيرت ميزات React 19 أسلوب بناء نماذج الويب مقارنة بالـ Controlled Inputs التقليدية؟',
      difficulty: 'senior',
      importance: 'advanced',
      tags: ['react', 'react19', 'actions', 'optimistic-ui'],
      docUrl: 'https://react.dev/reference/react/useOptimistic'
    },
    {
      title: 'كيف تتعامل مع مشكلة الـ Hook Factory وتفادي إعادة إنشاء الدوال داخلياً مع useEffectEvent؟',
      shortAnswer: 'تفصل دالة useEffectEvent المنطق التفاعلي (الذي يجب أن يقرأ أحدث المتغيرات دائماً) عن مصفوفة تبعيات الـ Effect (التي يجب ألا تتسبب في إعادة تشغيل الـ Effect غير المرغوب).',
      detailedAnswer: 'كثيراً ما نحتاج لقراءة متغيرات حديثة (مثل theme أو callback) داخل useEffect دون أن نريد إعادة تشغيل الـ Effect في كل مرة يتغير فيها هذا المتغير. توفر تجربة useEffectEvent حلاً ثورياً يسمح باستدعاء دوال تقرأ أحدث الـ props/state دون إدراجها في مصفوفة التبعيات.',
      codeExample: `// مثال بالنمط التجريبي الرسمي لـ useEffectEvent
import { useEffect, experimental_useEffectEvent as useEffectEvent } from 'react';

function ChatRoom({ roomId, theme }: { roomId: string; theme: string }) {
  const onConnected = useEffectEvent(() => {
    showNotification("تم الاتصال!", theme);
  });

  useEffect(() => {
    const connection = createConnection(roomId);
    connection.on('connected', () => onConnected());
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // يعاد الاتصال فقط بتغير roomId، وليس بتغير theme
}`,
      commonMistakes: 'استدعاء دالة مسجلة بـ useEffectEvent أثناء الـ Render بدلاً من داخل الـ Effect نفسه.',
      followUp: 'ما هي الطريقة التقليدية السابقة لتحقيق نفس هذا السلوك باستخدام useRef؟',
      difficulty: 'senior',
      importance: 'advanced',
      tags: ['react', 'useeffectevent', 'closures', 'react-experimental'],
      docUrl: 'https://react.dev/reference/react/experimental_useEffectEvent'
    }
  ],
  'react-state-management': [
    {
      title: 'ما هو الفرق الجوهري بين Server State و Client State ومتى نتوقف عن استخدام Redux لهما معاً؟',
      shortAnswer: 'حالة الخادم (Server State) مملوكة للخارج وغير متزامنة وتتطلب كاش ومزامنة مستمرة، بينما حالة العميل (Client State) محلية وتزامنية ومملوكة للمتصفح؛ دمج الاثنين في Redux يسبب تعقيداً مفرطاً.',
      detailedAnswer: 'تتطلب بيانات الخادم استراتيجيات كاش وإعادة جلب في الخلفية (Background Revalidation) ومعالجة حالات التحميل والأخطاء، وهو ما تجيده مكتبات متخصصة مثل TanStack Query (React Query) و SWR. بينما حالة العميل (مثل النوافذ المفتوحة أو الثيم أو مسودات النماذج) تناسبها مكتبات بسيطة مثل Zustand أو Context.',
      codeExample: `// فصل إدارة الحالتين
// 1. Server State بواسطة TanStack Query:
const { data: user, isLoading } = useQuery({ queryKey: ['user', id], queryFn: fetchUser });

// 2. Client UI State بواسطة Zustand:
const isSidebarOpen = useUIStore(state => state.isSidebarOpen);`,
      commonMistakes: 'تخزين استجابات كل استدعاء API في Redux store يدوياً مع كتابة مئات أسطر الـ actions والـ reducers المتكررة.',
      followUp: 'كيف أحدث ظهور مكتبات الـ Data Fetching تحولاً جذرياً في تصغير حجم الـ Global State Stores في التطبيقات الكبيرة؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react', 'state-management', 'server-state', 'react-query'],
      docUrl: 'https://react.dev/learn/managing-state'
    },
    {
      title: 'كيف تمنع إعادة التصيير المفرطة (Re-render Hell) عند استخدام React Context للتطبيقات المتوسطة؟',
      shortAnswer: 'عبر تقسيم الـ Context لعدة سياقات صغيرة متخصصة، وفصل سياق الحالة (State Context) عن سياق دوال التحديث (Dispatch Context)، وتغليف الـ values بـ useMemo.',
      detailedAnswer: 'عندما يتغير أي حقل في كائن الـ Context، يعاد تصيير كل مكوّن يستمع لهذا الـ Context حتى لو كان لا يستخدم سوى حقل آخر لم يتغير. لحل ذلك: نقسم البيانات (مثلاً UserContext و SettingsContext)، ونفصل الحالة عن دوال التعديل حتى لا تعاد تصيير المكونات التي ترسل أحداثاً فقط، ونستعين بـ useMemo لمنع إنتاج مراجع كائنات جديدة.',
      codeExample: `const UserStateContext = createContext<User | null>(null);
const UserDispatchContext = createContext<UserDispatch | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, dispatch] = useReducer(userReducer, null);

  return (
    <UserStateContext.Provider value={user}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}`,
      commonMistakes: 'وضع كافة بيانات التطبيق (المستخدم، الإشعارات، الثيم، السلة) في Context مركزي واحد ضخم.',
      followUp: 'كيف تحل مكتبات مثل Zustand أو Jotai مشكلة الـ Selector والاشتراك الذري بدقة أفضل من Context؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react', 'context', 're-renders', 'optimization'],
      docUrl: 'https://react.dev/learn/passing-data-deeply-with-context'
    },
    {
      title: 'ما هو نمط الـ Atomic State في مكتبات مثل Jotai و Recoil وكيف يقارن بنمط الـ Single Store مثل Redux؟',
      shortAnswer: 'يعتمد نمط الـ Atomic على تقسيم الحالة إلى وحدات ذرية صغيرة مستقلة (Atoms) تشترك المكونات فيها بدقة عالية، على عكس الـ Single Store الذي يجمع الحالة في شجرة مركزية ضخمة.',
      detailedAnswer: 'في Redux، الحالة عبارة عن شجرة كائن مركزي موحد، ويتم استخدام selectors للحصول على الأجزاء المطلوبة. في Jotai، تمثل الذرة (Atom) وحدة حالة قائمة بذاتها وقابلة للاشتقاق والتجميع مع ذرات أخرى (Derived Atoms)، مما يقلل من boilerplate الأفعال والـ Reducers ويوفر تكاملاً فائق السلاسة مع React Suspense.',
      codeExample: `import { atom, useAtom } from 'jotai';

// ذرة أساسية
const countAtom = atom(0);
// ذرة مشتقة محسوبة تلقائياً
const doubleCountAtom = atom((get) => get(countAtom) * 2);

function Counter() {
  const [count, setCount] = useAtom(countAtom);
  const [double] = useAtom(doubleCountAtom);
  return <button onClick={() => setCount(c => c + 1)}>القيمة: {count} - المضاعف: {double}</button>;
}`,
      commonMistakes: 'تخزين كائنات ضخمة معقدة داخل ذرة واحدة دون تفكيكها لذرات مشتقة أصغر.',
      followUp: 'كيف يدعم نمط الذرات استقلالية المكونات وسهولة تقسيم الكود (Code Splitting)؟',
      difficulty: 'senior',
      importance: 'advanced',
      tags: ['react', 'state-management', 'jotai', 'atomic-state'],
      docUrl: 'https://react.dev/learn/choosing-the-state-structure'
    },
    {
      title: 'كيف يعمل Redux Toolkit (RTK) وما التطورات التي أضافها مقارنة بـ Redux الكلاسيكي؟',
      shortAnswer: 'يقدم RTK دوال مدمجة مثل createSlice و configureStore تدمج كتابة الـ Actions والـ Reducers معاً، وتستخدم Immer للسماح بكتابة تحديثات طافية متحولة ظاهرياً مع الحفاظ على الـ Immutability التامة.',
      detailedAnswer: 'حل RTK مشكلة كثرة الأكواد المتكررة في Redux التقليدي. من خلال دمج Immer داخلياً، يمكنك كتابة state.value += 1 دون نسخ الكائن يدوياً بواسطة spread operator. كما يتضمن configureStore إعدادات افتراضية مسبقة لـ Redux Thunk و DevTools وفحص عدم الطفرات (Immutability Check) في بيئة التطوير.',
      codeExample: `import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      // Immer يحول التعديل المباشر إلى نسخة غير قابلة للتغيير تلقائياً
      state.value += 1;
    },
    addByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    }
  }
});

export const { increment, addByAmount } = counterSlice.actions;
export const store = configureStore({ reducer: { counter: counterSlice.reducer } });`,
      commonMistakes: 'محاولة استخدام الـ spread operator مع Immer وكتابة return لكائن جديد بالخطأ أثناء تعديل الحقول المباشرة.',
      followUp: 'ما هو RTK Query وكيف ينافس مكتبات إدارة استدعاءات الخادم مثل React Query؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react', 'redux-toolkit', 'immer', 'state-management'],
      docUrl: 'https://react.dev/learn/extracting-state-logic-into-a-reducer'
    },
    {
      title: 'ما هي مكتبة Zustand ولماذا تحظى بشعبية طاغية كبديل خفيف وسريع لـ Redux؟',
      shortAnswer: 'هي مكتبة إدارة حالة بسيطة للغاية تعتمد على نموذج Hook مباشر بدون Context أو Boilerplate، مع دعم الـ Selectors الدقيقة والتحديث خارج شجرة ريأكت (Transient Updates).',
      detailedAnswer: 'تتميز Zustand بصغر حجمها (أقل من 2KB) وعدم حاجتها لتغليف التطبيق بـ Providers. يتم إنشاء Store عبر دالة create، ويمكن لأي مكوّن الاشتراك في جزء محدد من الحالة عبر Selector لمنع الـ Re-renders غير اللازمة، كما تدعم المزامنة السهلة مع التخزين المحلي عبر middleware مدمج.',
      codeExample: `import { create } from 'zustand';

interface BearStore {
  bears: number;
  increasePopulation: () => void;
}

export const useBearStore = create<BearStore>((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
}));

function BearCounter() {
  // يشترك المكون فقط في خاصية bears
  const bears = useBearStore((state) => state.bears);
  return <h1>عدد الدببة: {bears}</h1>;
}`,
      commonMistakes: 'استدعاء كامل الـ store بدون selector مثل const store = useStore()، مما يؤدي لإعادة تصيير المكون عند أي تعديل لأي حقل.',
      followUp: 'كيف تنفذ تحديثات الحالة غير المقترنة بالتصيير (Transient Updates) باستخدام getState و subscribe في Zustand؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react', 'zustand', 'state-management', 'selectors'],
      docUrl: 'https://react.dev/learn/scaling-up-with-reducer-and-context'
    },
    {
      title: 'كيف تتعامل مع مشكلة الـ Prop Drilling وما هي أفضل الحلول البديلة؟',
      shortAnswer: 'هي مشكلة تمرير البيانات عبر عدة مستويات من المكونات الوسيطة التي لا تحتاجها فقط لإيصالها لمكون فرعي عميق؛ تحل عن طريق Component Composition أو الـ Context أو مكتبات الحالة.',
      detailedAnswer: 'قبل القفز فوراً إلى Context أو مكتبات الـ Global State، تنصح وثائق ريأكت الرسمية باستخدام نمط تركيب المكونات (Component Composition) بتمرير المكون كـ children أو كـ prop جاهز، مما يتيح للمكون الأب التحكم بالبيانات مباشرة دون إشراك المكونات الوسيطة.',
      codeExample: `// حل Prop Drilling باستخدام التركيب (Component Composition)
function Page({ user }: { user: User }) {
  // نمرر المكون الجاهز بدلاً من تمرير user عبر Header و Navigation
  return (
    <Header>
      <Avatar user={user} />
    </Header>
  );
}`,
      commonMistakes: 'اعتبار Context هو الحل الأول والوحيد دائماً لكل مشكلة تمرير props بدلاً من التفكير في هيكلة المكونات.',
      followUp: 'كيف يساعد تركيب فتحات المكونات (Slots Pattern) في تبسيط كود الواجهات العميقة؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react', 'prop-drilling', 'composition', 'architecture'],
      docUrl: 'https://react.dev/learn/passing-data-deeply-with-context'
    },
    {
      title: 'ما هي قواعد الـ Immutability في إدارة حالة ريأكت ولماذا يمنع التعديل المباشر (Direct Mutation)؟',
      shortAnswer: 'يجب معاملة الحالة دائماً كأنها غير قابلة للتغيير (Read-only)؛ التعديل المباشر لا يغير مرجع الكائن في الذاكرة مما يمنع ريأكت من اكتشاف التغيير وتخطي إعادة التصيير وظهور أخطاء تعارض خفية.',
      detailedAnswer: 'تعتمد مقارنة الحالات في ريأكت على مرجع المؤشر في الذاكرة (Shallow Comparison: Object.is). إذا قمت بكتابة user.name = "Ali" دون نسخ الكائن، فإن مؤشر الذاكرة لكائن user يظل ثابتاً، وبالتالي يعتقد ريأكت أن الحالة لم تتغير إطلاقاً ويتخطى الـ render، ناهيك عن تشويه التاريخ اللازم لميزات السفر عبر الزمن والـ Concurrency.',
      codeExample: `// خاطئ: تعديل مباشر
// state.items.push(newItem);

// صحيح: إنشاء مرجع جديد كلياً
setItems(prevItems => [...prevItems, newItem]);

// تعديل حقل في كائن متداخل
setUser(prev => ({
  ...prev,
  profile: {
    ...prev.profile,
    avatar: 'new_url.jpg'
  }
}));`,
      commonMistakes: 'استخدام Object.assign دون تمرير كائن هدف فارغ {}، أو تعديل المصفوفات بواسطة دالات طافرة مثل splice و sort.',
      followUp: 'ما فائدة مكتبة Immer في التخلص من تعقيد الـ Nested Spread Operator؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react', 'immutability', 'state', 'object-is'],
      docUrl: 'https://react.dev/learn/updating-objects-in-react-state'
    },
    {
      title: 'كيف تدير الـ Optimistic UI Updates وتتعامل مع حالات الفشل والتراجع (Rollback)؟',
      shortAnswer: 'يتم تحديث واجهة المستخدم بالحالة المتوقعة فور تفاعل المستخدم، مع الاحتفاظ بلقطة من الحالة السابقة للرجوع إليها وإظهار تنبيه خطأ إذا فشل الطلب على الخادم.',
      detailedAnswer: 'يحسن التحديث التفاؤلي سرعة الاستجابة الظاهرية للتطبيق. على سبيل المثال عند الضغط على زر الإعجاب، يتم زيادة العداد وتلوين الزر فورياً، وإرسال طلب للـ API. إذا نجح الطلب يتم تثبيت التغيير؛ وإذا رفض السيرفر الطلب، يتم تنفيذ Rollback فوري لإعادة العداد لحالته السابقة.',
      codeExample: `async function handleToggleFavorite(todoId: string) {
  const previousState = todos;
  // 1. تحديث تفاؤلي فوري
  setTodos(todos.map(t => t.id === todoId ? { ...t, fav: !t.fav } : t));

  try {
    await api.toggleFavorite(todoId);
  } catch (error) {
    // 2. تراجع عند الخطأ
    setTodos(previousState);
    toast.error("فشل حفظ التفضيل، يرجى المحاولة ثانية");
  }
}`,
      commonMistakes: 'نسيان حفظ مرجع الحالة الأصلية بدقة قبل إجراء التعديل التفاؤلي.',
      followUp: 'كيف توفر مكتبة TanStack Query دعماً مدمجاً للتحديثات التفاؤلية عبر onMutate و onError؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react', 'optimistic-ui', 'rollback', 'ux'],
      docUrl: 'https://react.dev/learn/reacting-to-input-with-state'
    },
    {
      title: 'متى تكون الحالة المشتقة (Derived State) أفضل من تخزينها في useState مستقل؟',
      shortAnswer: 'دائماً يفضل حساب القيم المشتقة فورياً أثناء الـ render إذا كانت معتمدة كلياً على Props أو State موجودة، بدلاً من حفظها في useState ومحاولة مزامنتها يدوياً.',
      detailedAnswer: 'تخزين بيانات يمكن حسابها من بيانات أخرى في useState يؤدي لازدواجية مصادر الحقيقة (Single Source of Truth) وظهور حالات غير متناسقة وحاجة مستمرة لـ useEffect لمزامنتها. حساب القيمة في جسم الدالة مباشرة (مع useMemo إذا كانت العملية مكلفة جداً) يضمن اتساقها الدائم وخلوها من الأخطاء.',
      codeExample: `// خاطئ: تخزين قيمة مشتقة ومزامنتها بـ useEffect
// const [fullName, setFullName] = useState('');
// useEffect(() => setFullName(\`\${firstName} \${lastName}\`), [firstName, lastName]);

// صحيح: حساب مباشر أثناء الـ render
const fullName = \`\${firstName} \${lastName}\`;
const activeUsers = useMemo(() => users.filter(u => u.isActive), [users]);`,
      commonMistakes: 'تعريف useState مستقل لكل تفرع أو تجميع حسابي ومزامنته بواسطة useEffect.',
      followUp: 'ما هي المعايير التي تحدد متى نحتاج useMemo لحساب الحالة المشتقة ومتى يكفي الحساب المباشر؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react', 'derived-state', 'single-source-of-truth', 'anti-patterns'],
      docUrl: 'https://react.dev/learn/choosing-the-state-structure#avoid-redundant-state'
    },
    {
      title: 'كيف تتعامل مع حفظ ومزامنة حالة الواجهة في رابط الصفحة (URL Search Params كـ State)؟',
      shortAnswer: 'باستخدام الـ URL Search Params لتخزين عوامل التصفية والبحث ورقم الصفحة، لتمكين المستخدم من مشاركة الرابط أو العودة إليه بنفس الحالة بالضبط.',
      detailedAnswer: 'تخزين معايير البحث والترتيب في الـ URL يجعل الصفحة سهلة المشاركة ويدعم أزرار الرجوع والتقدم في المتصفح وتوافق الـ SEO. توفر أطر العمل والمكتبات (مثل react-router أو Next.js nuqs) هوكس متخصصة مثل useSearchParams لقراءة وكتابة هذه المعاملات بشكل متزامن.',
      codeExample: `import { useSearchParams } from 'react-router-dom';

function ProductFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || 'all';

  const setCategory = (cat: string) => {
    setSearchParams(prev => {
      prev.set('category', cat);
      return prev;
    });
  };

  return <button onClick={() => setCategory('electronics')}>إلكترونيات</button>;
}`,
      commonMistakes: 'تخزين الفلاتر في useState محلي غير متصل بالـ URL مما يؤدي لضياع الحالة بمجرد تحديث الصفحة (Refresh).',
      followUp: 'كيف تتجنب إنشاء إدخالات تاريخ تصفح مفرطة في المتصفح باستخدام خيار replace: true؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react', 'url-state', 'search-params', 'routing'],
      docUrl: 'https://react.dev/learn/sharing-state-between-components'
    }
  ],
  'react-routing-navigation': [
    {
      title: 'ما الفرق بين Client-Side Routing و Server-Side Routing في تطبيقات الويب؟',
      shortAnswer: 'في Client-Side Routing يتم تبديل المكونات وتحديث الـ URL داخل المتصفح عبر History API دون إعادة تحميل الصفحة كاملاً، بينما Server-Side Routing يرسل طلباً للخادم ليرد بصفحة HTML جديدة كلياً.',
      detailedAnswer: 'تطبيقات الصفحة الواحدة (SPAs) تقوم بتحميل حزمة الـ JavaScript مرة واحدة، وعند تنقل المستخدم بين الروابط، يقوم الراوتر (مثل React Router) باعتراض الرابط وتحديث واجهة المستخدم والـ URL محلياً، مما يوفر تجربة مستخدم فورية وشبيهة بتطبيقات سطح المكتب دون وميض إعادة تحميل الشاشة.',
      codeExample: `// التنقل من جانب العميل بدون إعادة تحميل كاملة
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      {/* Link يعترض النقر ويستخدم history.pushState */}
      <Link to="/dashboard">لوحة التحكم</Link>
    </nav>
  );
}`,
      commonMistakes: 'استخدام وسم <a href="/path"> العادي داخل تطبيق SPA مما يؤدي لإعادة تحميل الصفحة ومسح كامل حالة التطبيق في الذاكرة.',
      followUp: 'كيف يتم تكوين خوادم الويب (مثل Nginx أو Caddy) لخدمة مسارات SPAs لتفادي أخطاء 404 عند تحديث الصفحة؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react', 'routing', 'spa', 'history-api'],
      docUrl: 'https://react.dev/learn'
    },
    {
      title: 'كيف يعمل الـ Data Loading والـ Loaders في الإصدارات الحديثة من React Router (v6.4+ Data APIs)؟',
      shortAnswer: 'تقوم دوال الـ loaders بجلب البيانات بالتوازي مع تحميل كود الصفحة قبل بدء عرض المكون، مما يمنع ظاهرة الشلال المتتالي للطلبات (Network Waterfalls).',
      detailedAnswer: 'في النمط القديم كان المكون يتم تحميله أولاً، ثم داخل useEffect يبدأ إرسال طلب البيانات مما يؤخر العرض. في React Router Data APIs، يتم تعريف loader لكل مسار يبدأ جلب البيانات في نفس لحظة النقر على الرابط، ويصل المكون للبيانات فوراً وجاهزة عبر دالة useLoaderData().',
      codeExample: `import { createBrowserRouter, RouterProvider, useLoaderData } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: "/user/:id",
    loader: async ({ params }) => {
      return fetch(\`/api/user/\${params.id}\`);
    },
    element: <UserProfile />
  }
]);

function UserProfile() {
  const user = useLoaderData() as User;
  return <h1>أهلاً بك، {user.name}</h1>;
}`,
      commonMistakes: 'جلب البيانات داخل useEffect داخل المكون مع استخدام Data Router مما يلغي ميزة جلب البيانات المسبق المتوازي.',
      followUp: 'كيف تتكامل ميزة الـ Actions في React Router مع معالجة تقديم النماذج (Form Submissions)؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react', 'react-router', 'loaders', 'waterfalls'],
      docUrl: 'https://react.dev/learn'
    },
    {
      title: 'ما هي المسارات المتداخلة (Nested Routes) وكيف نستخدم وسم <Outlet /> في هيكلة الواجهات؟',
      shortAnswer: 'المسارات المتداخلة تسمح بتركيب واجهات فرعية داخل هيكل عام مشترك (مثل لوحة تحكم بشريط جانبي ثابت)، ويعمل <Outlet /> كموضع محجوز لعرض المكون الفرعي المطابق للرابط.',
      detailedAnswer: 'تتيح المسارات المتداخلة تنظيم وتفريع الصفحات بطريقة هرمية تتطابق مع شجرة الـ URL. المكون الأب يحتوي على عناصر الواجهة الدائمة (Navbar, Sidebar) ويضع <Outlet /> في منطقة المحتوى. عندما ينتقل الرابط من /settings إلى /settings/security، لا يعاد تصيير الهيكل الأب، بل يتم فقط استبدال محتوى الـ Outlet.',
      codeExample: `// تعريف المسارات المتداخلة
<Route path="/dashboard" element={<DashboardLayout />}>
  <Route index element={<DashboardOverview />} />
  <Route path="analytics" element={<AnalyticsView />} />
</Route>

// داخل DashboardLayout:
function DashboardLayout() {
  return (
    <div className="layout">
      <Sidebar />
      <main><Outlet /></main>
    </div>
  );
}`,
      commonMistakes: 'نسيان وضع وسم <Outlet /> في المكون الأب، مما يمنع ظهور المكونات الفرعية رغم صحة الرابط في المتصفح.',
      followUp: 'كيف يمكن مشاركة سياق أو بيانات من المكون الأب إلى المكونات المعروضة في الـ Outlet باستخدام useOutletContext()؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react', 'react-router', 'nested-routes', 'outlet'],
      docUrl: 'https://react.dev/learn'
    },
    {
      title: 'كيف تطبق حماية المسارات (Protected Routes & Auth Guards) وتوجيه المستخدم غير المصرح له؟',
      shortAnswer: 'بإنشاء مكون وسيط يفحص حالة تسجيل الدخول، فإذا كان المستخدم موثقاً يعرض المحتوى المطلوب عبر <Outlet />، وإذا لم يكن مسجلاً يعيد توجيهه لصفحة الدخول عبر <Navigate /> مع حفظ الرابط للرجوع إليه.',
      detailedAnswer: 'تعتمد حماية المسارات على التحقق من وجود رمز التوثيق (Token) أو حالة المستخدم الحالية. يتم تمرير الرابط الأصلي الذي كان المستخدم يحاول الوصول إليه عبر state={{ from: location }} حتى تتمكن صفحة تسجيل الدخول من إعادته لنفس وجهته بعد نجاح المصادقة.',
      codeExample: `import { Navigate, Outlet, useLocation } from 'react-router-dom';

function ProtectedRoute({ isAuthenticated }: { isAuthenticated: boolean }) {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}`,
      commonMistakes: 'الاعتماد على حماية المسارات في جانب العميل فقط دون تأمين واجهات الـ Backend APIs ضد الوصول غير المصرح.',
      followUp: 'كيف تتعامل مع شاشات التحميل (Loading Skeletons) عندما تكون حالة المصادقة الأولية غير محسومة بعد؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react', 'auth', 'protected-routes', 'security'],
      docUrl: 'https://react.dev/learn'
    },
    {
      title: 'ما هو الـ Lazy Loading للراوتر وكيف يقترن مع React.lazy و Suspense لتجزئة الكود (Code Splitting)؟',
      shortAnswer: 'يقوم بتأجيل تنزيل كود صفحات التطبيق حتى يحتاج المستخدم لزيارتها فعلياً، مما يقلص حجم الحزمة الأولية (Initial Bundle Size) ويسرع زمن تحميل الموقع.',
      detailedAnswer: 'بدلاً من استيراد كافة المكونات الثقيلة في أعلى الملف، نستخدم React.lazy لاستيراد الصفحة بشكل ديناميكي عند الطلب، وتغليفها بمكون <Suspense fallback={<Spinner />}> لعرض شاشة انتظار أثناء تنزيل حزمة الـ JavaScript الخاصة بالمسار.',
      codeExample: `import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const AdminPanel = lazy(() => import('./pages/AdminPanel'));

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Suspense>
  );
}`,
      commonMistakes: 'استدعاء React.lazy داخل جسم دالة المكون أثناء الـ render بدلاً من تعريفه في النطاق الخارجي للملف.',
      followUp: 'كيف تدعم دوال route.lazy في الإصدارات الأحدث تقسيم الـ Component والـ Loader معاً في ملف واحد؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react', 'code-splitting', 'lazy-loading', 'suspense'],
      docUrl: 'https://react.dev/reference/react/lazy'
    },
    {
      title: 'كيف تتعامل مع أخطاء المسارات غير الموجودة (404 Not Found) وصفحات الخطأ المخصصة؟',
      shortAnswer: 'نستخدم مساراً عاماً (Catch-all Route) بالرمز path="*" في نهاية شجرة المسارات لعرض صفحة 404، أو نستخدم خاصية errorElement في Data Routers للتعامل مع أخطاء الـ Loader والتصيير.',
      detailedAnswer: 'في React Router، يطابق النمط path="*" أي مسار لم تتطابق معه المسارات السابقة لعرض صفحة Not Found ودية. علاوة على ذلك، في أجهزة التوجيه الحديثة تتيح خاصية errorElement التقاط الاستثناءات الصادرة من الخادم أو أعطال الشبكة واستخدام useRouteError للتعرف على نوع الخطأ ورمزه.',
      codeExample: `const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />, // يلتقط أي خطأ غير متوقع في هذا الفرع
    children: [
      { path: "*", element: <NotFoundPage /> }
    ]
  }
]);`,
      commonMistakes: 'وضع مسار path="*" في بداية شجرة المسارات مما يحجب بقية الصفحات الصحيحة.',
      followUp: 'كيف يفرق useRouteError بين أخطاء الـ Response الرميّة (isRouteErrorResponse) وأخطاء كود الجافاسكربت العادية؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react', 'router', 'error-handling', '404'],
      docUrl: 'https://react.dev/learn'
    },
    {
      title: 'كيف يتم التنقل البرمجي (Programmatic Navigation) والتعامل مع معلمات المسار (Params)؟',
      shortAnswer: 'نستخدم خطاف useNavigate لتوجيه المستخدم برمجياً كاستجابة لحدث ما، وخطاف useParams لاستخراج المعاملات الديناميكية من الـ URL.',
      detailedAnswer: 'يوفر useNavigate دالة تنقل تستقبل مساراً أو رقماً للتنقل في السجل (مثل navigate(-1) للرجوع)، مع خيارات للتحكم في استبدال التاريخ replace. بينما يحلل useParams الأجزاء المعرفة بنقطتين رأسيتين مثل :id ويحولها لكائن يحمل تلك القيم.',
      codeExample: `import { useParams, useNavigate } from 'react-router-dom';

function OrderDetails() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const handleComplete = () => {
    // إجراء منطق إنهاء الطلب ثم التوجيه لصفحة الشكر
    navigate('/thank-you', { replace: true });
  };

  return <div>طلب رقم: {orderId} <button onClick={handleComplete}>إنهاء</button></div>;
}`,
      commonMistakes: 'استدعاء navigate مباشرة في جسم دالة المكون أثناء مرحلة الـ Render بدلاً من معالجات الأحداث أو useEffect.',
      followUp: 'ما هي المخاطر التقنية لمحاولة التوجيه المتزامن أثناء عملية الـ Rendering؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react', 'useparams', 'usenavigate', 'navigation'],
      docUrl: 'https://react.dev/learn'
    },
    {
      title: 'ما هي استراتيجيات إعادة ضبط الـ Scroll إلى أعلى الصفحة تلقائياً عند تغيير المسار (Scroll Restoration)؟',
      shortAnswer: 'يمكن استخدام مكون <ScrollRestoration /> المدمج في React Router Data APIs أو كتابة useEffect يستمع لتغير الـ pathname وينفذ window.scrollTo(0, 0).',
      detailedAnswer: 'في تطبيقات الـ SPA، لا يعيد المتصفح ضبط موضع الـ Scroll تلقائياً عند تغيير المسار في بعض الحالات مما يترك المستخدم في منتصف الصفحة الجديدة. يوفر React Router مكون ScrollRestoration لمحاكاة سلوك المتصفح الطبيعي وحفظ مواضع الـ Scroll لكل صفحة في السجل بدقة.',
      codeExample: `import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}`,
      commonMistakes: 'استخدام behavior: "smooth" في التنقلات السريعة، مما يؤدي لحركات اهتزازية مربكة للمستخدم أثناء تحميل الصفحات.',
      followUp: 'كيف يتعامل ScrollRestoration مع استعادة موضع القوائم الطويلة عند الضغط على زر الرجوع في المتصفح؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react', 'scroll-restoration', 'ux', 'router'],
      docUrl: 'https://react.dev/learn'
    },
    {
      title: 'ما الفرق بين MemoryRouter و BrowserRouter و HashRouter ومتى نستخدم كلاً منها؟',
      shortAnswer: 'BrowserRouter يستخدم HTML5 History API لتطبيقات الويب الحديثة، و HashRouter يستخدم # في الرابط للخوادم البسيطة، بينما MemoryRouter يحتفظ بالمسارات في الذاكرة ومثالي لبيئات الاختبار (Jest/Vitest).',
      detailedAnswer: 'BrowserRouter هو الخيار القياسي لإنتاج روابط نظيفة تتطلب تهيئة السيرفر لرد index.html لجميع المسارات. HashRouter يستخدم التجزئة (#) ولا يحتاج لأي تكوين في السيرفر لكنه ضار بـ SEO. MemoryRouter لا يتعامل مع متصفح أو شريط عناوين إطلاقاً ويستخدم خصيصاً في وحدات الاختبار وبيئات التفاعل غير المتصفحية مثل React Native.',
      codeExample: `// مثال لاختبار مكون تنقل باستخدام MemoryRouter
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

test('يعرض صفحة الملف الشخصي', () => {
  render(
    <MemoryRouter initialEntries={['/profile/42']}>
      <AppRoutes />
    </MemoryRouter>
  );
  expect(screen.getByText(/الملف الشخصي/i)).toBeInTheDocument();
});`,
      commonMistakes: 'استخدام BrowserRouter داخل بيئة Node.js الخاصة باختبارات Unit Tests دون توفر نافذة window/history كاملة.',
      followUp: 'لماذا ينصح بتفادي HashRouter في التطبيقات التي تعتمد على تحسين محركات البحث SEO؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react', 'browser-router', 'memory-router', 'testing'],
      docUrl: 'https://react.dev/learn'
    },
    {
      title: 'كيف يتم إدارة الـ View Transitions API في التوجيه لإنشاء انتقالات سلسة بين الصفحات؟',
      shortAnswer: 'تستفيد ميزة View Transitions من واجهة المتصفح document.startViewTransition لأخذ لقطات للواجهة القديمة والجديدة وتطبيق حركات انتقال متدفقة (Cross-fade animations) بين الصفحات تلقائياً.',
      detailedAnswer: 'تدعم الإصدارات الحديثة من React Router خيار viewTransition في المكون <Link to="..." viewTransition> أو عبر navigate(to, { viewTransition: true }). يقوم هذا الخيار بتغليف تغيير الـ DOM بواجهة المتصفح، مما يتيح لك تخصيص حركات التنقل في الـ CSS عبر الفئات الزائفة ::view-transition-old و ::view-transition-new.',
      codeExample: `// تفعيل الانتقال السلس في الرابط
<Link to="/gallery" viewTransition>
  معرض الصور
</Link>

/* في ملف CSS */
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.3s;
}`,
      commonMistakes: 'تفعيل View Transitions على متصفحات قديمة دون التحقق من توفر الدالة عبر التحقق التوافقي (Feature Detection).',
      followUp: 'كيف يمكن تخصيص اسم الانتقال (view-transition-name) لعنصر معين كصورة الغلاف للحفاظ على حركتها الممتدة بين صفحتين؟',
      difficulty: 'senior',
      importance: 'advanced',
      tags: ['react', 'view-transitions', 'animations', 'css'],
      docUrl: 'https://react.dev/learn'
    }
  ],
  'react-performance': [
    {
      title: 'كيف تحدد وتعالج مشاكل الـ Unnecessary Re-renders باستخدام React DevTools Profiler؟',
      shortAnswer: 'نسجل جلسة تفاعل بالـ Profiler ونفحص المخطط اللوني (Flamegraph) لمعرفة المكونات التي أعيد تصييرها وزمن تنفيذها، مع مراجعة تبويب "Why did this render?".',
      detailedAnswer: 'يساعد React DevTools Profiler في تحديد الاختناقات الأدائية. في شاشة الإعدادات نقوم بتفعيل خيار "Record why each component rendered". المكونات التي تأخذ لوناً مائلاً للأصفر/البرتقالي تستغرق وقتاً أطول. من خلال فحص السبب (تغير props أو تغير hook معين)، نحدد ما إذا كان المكون بحاجة لـ React.memo أو تثبيت مرجع الـ callbacks.',
      codeExample: `// مراجعة أسباب إعادة التصيير وتغليف المكون الثقيل
import React, { memo } from 'react';

export const ExpensiveChart = memo(function ExpensiveChart({ data }: { data: number[] }) {
  // عمليات حسابية ورسوم بيانية ثقيلة
  return <div className="chart-canvas">{/* ... */}</div>;
});`,
      commonMistakes: 'تخمين أسباب بطء التطبيق دون تشغيل الـ Profiler للتحقق بالأرقام والزمن الفعلي.',
      followUp: 'ما الفرق بين Render Duration و Base Duration في قراءات الـ Profiler؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react', 'performance', 'profiler', 'devtools'],
      docUrl: 'https://react.dev/reference/react/Profiler'
    },
    {
      title: 'ما هو الـ Virtualization (Windowing) وكيف تستخدم مكتبة TanStack Virtual لعرض قوائم ضخمة؟',
      shortAnswer: 'هو تقنية تحصر تصيير عناصر الـ DOM فقط على العناصر الظاهرة حالياً داخل نافذة العرض (Viewport)، مما يحافظ على خفة الـ DOM وسرعة استجابة المتصفح حتى مع ملايين الصفوف.',
      detailedAnswer: 'إذا حاولت تصيير 10,000 عقدة DOM دفعة واحدة، سيتجمد المتصفح بسبب استهلاك الذاكرة وحسابات التخطيط. تقنية الـ Windowing تحسب موضع الـ Scroll الحالي وتنشئ فقط الـ 20 أو 30 عنصراً المرئية مع حشو مساحات فارغة علوية وسفلية للمحافظة على موضع شريط التمرير الصحيح.',
      codeExample: `import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

function VirtualList({ items }: { items: string[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  });

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: \`\${rowVirtualizer.getTotalSize()}px\`, position: 'relative' }}>
        {rowVirtualizer.getVirtualItems().map(virtualRow => (
          <div key={virtualRow.index} style={{ position: 'absolute', top: 0, transform: \`translateY(\${virtualRow.start}px)\` }}>
            {items[virtualRow.index]}
          </div>
        ))}
      </div>
    </div>
  );
}`,
      commonMistakes: 'محاولة معالجة بطء القوائم الكبيرة بتغليف كل صف بـ React.memo بدلاً من تطبيق الـ Virtualization الحقيقي.',
      followUp: 'كيف يتم التعامل مع العناصر ذات الارتفاعات الديناميكية المتغيرة (Dynamic Heights) في القوائم الافتراضية؟',
      difficulty: 'senior',
      importance: 'essential',
      tags: ['react', 'virtualization', 'tanstack-virtual', 'windowing'],
      docUrl: 'https://react.dev/learn'
    },
    {
      title: 'ما هي تكلفة React.memo ولماذا لا يجب استخدامه افتراضياً على كافة المكونات؟',
      shortAnswer: 'لأن React.memo يضيف مقارنة فحص سطحي (Shallow Compare) لكافة الـ Props في كل render؛ فإذا كانت الـ props تتغير دائماً أو كان المكون بسيطاً، فإن المقارنة تكون عبئاً إضافياً دون جدوى.',
      detailedAnswer: 'يقوم React.memo بمقارنة prevProps و nextProps بواسطة Object.is. إذا كان المكون يتلقى دائماً كائنات جديدة أو دوال غير مثبتة أو كان يستهلك أجزاء سريعة التغير، فإن كلفة إجراء المقارنة السطحية تضاف إلى كلفة الـ render بدلاً من توفيرها. يفضل قصر memo على المكونات الثقيلة برمجياً أو التي تعيد نفس المخرجات كثيراً.',
      codeExample: `// لا داعي لاستخدام memo هنا لصغر المكون
function SimpleBadge({ label }: { label: string }) {
  return <span className="badge">{label}</span>;
}

// استخدام سليم لـ memo لمكون ثقيل يعاد تصييره مع ثبات الـ props
export const HeavyTable = React.memo(function HeavyTable({ rows }: { rows: Row[] }) {
  return <table>{/* آلاف العمليات الحسابية */}</table>;
});`,
      commonMistakes: 'تغليف مكون بـ React.memo مع تمرير كائن جديد أو inline callback مثل onClick={() => doSomething()} دون useCallback.',
      followUp: 'كيف يمكنك تمرير دالة مقارنة مخصصة arePropsEqual لـ React.memo ومتى يكون ذلك ضرورياً؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react', 'memo', 'shallow-compare', 'performance'],
      docUrl: 'https://react.dev/reference/react/memo'
    },
    {
      title: 'كيف يؤثر تقسيم الشفرة (Code Splitting) الديناميكي على مقاييس Core Web Vitals (LCP, FID/INP, CLS)؟',
      shortAnswer: 'يقلل حجم حزمة الجافاسكربت الأولية مما يسرع وقت تفسير وتحميل الكود في المتصفح، مما يحسن درجات LCP و INP ويمنع تجميد الخيط الرئيسي (Main Thread Blocking).',
      detailedAnswer: 'تقوم حزم الـ JavaScript الضخمة بتعطيل معالج المتصفح أثناء التفسير والتحليل (Parse & Compile)، مما يرفع زمن الاستجابة للتفاعل (Interaction to Next Paint - INP). بتجزئة الصفحات غير الضرورية والمكتبات الثقيلة عبر Dynamic Imports، يصبح المتصفح جاهزاً للتفاعل أسرع بكثير.',
      codeExample: `// تحميل مكتبة تصدير الـ PDF الثقيلة ديناميكياً فقط عند نقر الزر
async function handleExportPDF() {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  doc.text("تقرير المبيعات", 10, 10);
  doc.save("report.pdf");
}`,
      commonMistakes: 'تحميل مكتبات ضخمة في البداية (كالمخططات البيانية أو محررات النصوص الغنية) رغم أنها لا تظهر إلا في شاشات نادرة أو بعد تفاعل المستخدم.',
      followUp: 'كيف يساعد استباق التحميل (Prefetching / Preloading) في تحميل الحزم بالخلفية قبل نقر المستخدم للرابط؟',
      difficulty: 'senior',
      importance: 'advanced',
      tags: ['react', 'web-vitals', 'code-splitting', 'inp'],
      docUrl: 'https://react.dev/learn'
    },
    {
      title: 'ما هي مشكلة الـ Layout Thrashing وكيف نتجنبها في مكونات ريأكت؟',
      shortAnswer: 'تحدث عندما يتعاقب قراءة قياسات الـ DOM (مثل offsetHeight) مع تعديل أنماط الـ DOM في حلقة سريعة، مما يجبر المتصفح على إعادة حساب التخطيط (Reflow) بشكل متكرر ومكلف.',
      detailedAnswer: 'يجمع المتصفح تعديلات الـ DOM ويطبقها دفعة واحدة. لكن إذا قمت بقراءة خصائص التخطيط الهندسي فور إجراء تعديل، يضطر المتصفح لإيقاف التنفيذ فوراً وحساب التخطيط الجديد قسرياً (Forced Synchronous Layout). في ريأكت يتم تجنب هذا بقراءة كافة القياسات دفعة واحدة أولاً، ثم تطبيق تعديلات الحالة في خطوة موحدة.',
      codeExample: `// نمط سيء: قراءة وكتابة متناوبة تجبر Reflow متكرر
// elements.forEach(el => { const h = el.offsetHeight; el.style.height = (h + 10) + 'px'; });

// نمط سليم: تجميع القراءات ثم تجميع التعديلات
const heights = elements.map(el => el.offsetHeight);
elements.forEach((el, i) => {
  el.style.height = \`\${heights[i] + 10}px\`;
});`,
      commonMistakes: 'تنفيذ قياسات مستمرة للعناصر داخل معالج حدث onScroll دون استخدام requestAnimationFrame.',
      followUp: 'كيف يمكن الاستفادة من ResizeObserver لقياس تغير أبعاد العناصر بكفاءة دون التسبب في Reflows متزامنة؟',
      difficulty: 'senior',
      importance: 'advanced',
      tags: ['react', 'layout-thrashing', 'reflow', 'dom-performance'],
      docUrl: 'https://react.dev/learn'
    },
    {
      title: 'كيف تستخدم Web Workers في تطبيقات ريأكت لنقل العمليات الحسابية الشاقة خارج الـ Main Thread؟',
      shortAnswer: 'باستخدام Web Workers لتشغيل أكواد معالجة البيانات الضخمة وفك تشفير الملفات في خيط معالجة منفصل بالخلفية، مما يحافظ على سلاسة واجهة المستخدم واستجابتها بمعدل 60fps دون أي تقطيع.',
      detailedAnswer: 'نظراً لأن JavaScript تعمل في خيط أحادي (Single Threaded)، فإن العمليات الحسابية الشاقة تجمد تفاعل الواجهة تماماً. يتيح Web Worker تشغيل نصوص برمجية في الخلفية والتواصل مع مكون ريأكت عبر postMessage و onmessage، وهو ما توفره أدوات حديثة مثل Comlink لتسهيل الاستدعاء كدوال عادية.',
      codeExample: `// إنشاء واستخدام Worker
const worker = new Worker(new URL('./heavy-calc.worker.ts', import.meta.url));

function runCalculation(data: BigData) {
  worker.postMessage(data);
  worker.onmessage = (e) => {
    setResult(e.data);
  };
}`,
      commonMistakes: 'محاولة تمرير كائنات DOM أو دوال غير قابلة للتسلسل (Functions) عبر postMessage للـ Worker.',
      followUp: 'ما هي خوارزمية Structured Clone المستخدمة في نقل البيانات إلى الـ Web Worker وما هي أنواع البيانات غير المدعومة؟',
      difficulty: 'senior',
      importance: 'advanced',
      tags: ['react', 'web-workers', 'multithreading', 'performance'],
      docUrl: 'https://react.dev/learn'
    },
    {
      title: 'ما هي استراتيجيات تحسين تحميل الصور في تطبيقات ريأكت لتفادي الـ Cumulative Layout Shift (CLS)؟',
      shortAnswer: 'عبر تحديد أبعاد width و height ثابتة أو aspect-ratio مسبقاً في الـ CSS، واستخدام تقنية التحميل الكسول loading="lazy" وتوفير صيغ صور حديثة مثل WebP و AVIF.',
      detailedAnswer: 'يحدث الـ CLS عندما تظهر الصورة فجأة بعد اكتمال تنزيلها وتدفع المحتوى السفلي للأسفل مسببة قفزة مزعجة للمستخدم. بحجز المساحة مسبقاً باستخدام أبعاد صريحة ومربعات حجز مؤقتة (Placeholders أو Blurhash)، يحافظ المتصفح على الهيكل ثابتاً من اللحظة الأولى.',
      codeExample: `function OptimizedImage({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      width={600}
      height={400}
      loading="lazy"
      decoding="async"
      style={{ aspectRatio: '600 / 400', objectFit: 'cover' }}
    />
  );
}`,
      commonMistakes: 'إهمال تحديد أبعاد الصور مما يسبب انهيار درجة الـ CLS في تقارير Google Lighthouse.',
      followUp: 'كيف يقوم مكون Image في أطر مثل Next.js بأتمتة خدمة الصور بالأبعاد الصحيحة وفقاً لحجم شاشة العميل؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react', 'images', 'cls', 'core-web-vitals'],
      docUrl: 'https://react.dev/learn'
    },
    {
      title: 'كيف تكشف تسريبات الذاكرة (Memory Leaks) الشائعة في تطبيقات ريأكت باستخدام Chrome Memory Tab؟',
      shortAnswer: 'بأخذ لقطات ذاكرة (Heap Snapshots) ومقارنتها قبل وبعد فتح شاشات التطبيق وإغلاقها للبحث عن مراجع الكائنات المنفصلة (Detached DOM Nodes) أو المكونات غير المحررة.',
      detailedAnswer: 'تحدث تسريبات الذاكرة عندما يحتفظ كود الـ JavaScript بمراجع لعناصر تم إزالتها من الـ DOM، كأن يسجل المكون مستمع حدث على window أو ينشئ setInterval دون تنظيفها في cleanup دالة useEffect. في Chrome DevTools نأخذ Heap Snapshot، نقوم بالإجراء، ثم نأخذ Snapshot ثانية ونبحث بمقارنة (Comparison) عن كائنات Detached.',
      codeExample: `// سبب شائع لتسريب الذاكرة: نسيان إزالة المستمع
useEffect(() => {
  const onResize = () => setWidth(window.innerWidth);
  window.addEventListener('resize', onResize);
  // التصحيح الإلزامي: دالة تنظيف
  return () => window.removeEventListener('resize', onResize);
}, []);`,
      commonMistakes: 'الاحتفاظ بمراجع كائنات ضخمة في متغيرات عامة (Global Variables) خارج نطاق المكونات دون مسحها.',
      followUp: 'ما الفرق بين الـ Shallow Size والـ Retained Size في تقرير الـ Heap Snapshot؟',
      difficulty: 'senior',
      importance: 'advanced',
      tags: ['react', 'memory-leaks', 'heap-snapshot', 'devtools'],
      docUrl: 'https://react.dev/learn'
    },
    {
      title: 'كيف تتجنب إنشاء كائنات ومراجع جديدة في جسم المكون (Inline Objects & Arrays) أثناء الـ Render؟',
      shortAnswer: 'بتعريف الثوابت خارج نطاق دالة المكون إذا كانت لا تعتمد على الـ Props، أو تغليف الكائنات المعتمدة بـ useMemo لتثبيت المرجع الممرض للمكونات الفرعية.',
      detailedAnswer: 'في كل مرة يُعاد فيها تصيير المكون، يتم إنشاء مراجع جديدة لأي كائن أو مصفوفة معرّفة بداخله (مثل style={{ margin: 10 }} أو options={["a", "b"]}). هذا المرجع الجديد يفشل مقارنة Object.is ويؤدي لإعادة تصيير المكونات الفرعية المحمية بـ memo دون داعٍ.',
      codeExample: `// ثوابت ثابتة تعرف خارج نطاق المكون تماماً
const DEFAULT_OPTIONS = ['الكل', 'المفعلة', 'المعطلة'];

function FilterBar({ onSelect }: { onSelect: (val: string) => void }) {
  // استخدام الثابت الخارجي الموحد
  return <OptionsList items={DEFAULT_OPTIONS} onSelect={onSelect} />;
}`,
      commonMistakes: 'كتابة inline objects كـ props في مكونات تكرارية داخل حلقات map.',
      followUp: 'متى يتولى محرك الجافاسكربت تحسين الـ Short-lived Objects ومتى يصبح التخصيص المستمر عبئاً على الـ Garbage Collector؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react', 'garbage-collection', 'references', 'memoization'],
      docUrl: 'https://react.dev/learn'
    },
    {
      title: 'ما هي فوائد وتحديات تفعيل خيار Transitions لتقسيم العمليات في ريأكت 18؟',
      shortAnswer: 'الفائدة تكمن في الحفاظ على استجابة الشاشة بنسبة 100% دون تجميدها أثناء العمليات الثقيلة، والتحدي هو إدارة الحالات المؤقتة (Pending States) وفهم تسلسل تحديثات الواجهة المتزامنة.',
      detailedAnswer: 'قبل React 18، كانت كافة التحديثات عاجلة وغير قابلة للمقاطعة، فإذا استغرق تحديث مصفوفة ضخمة 200ms تظلم الشاشة ويتجمد المؤشر. باستخدام startTransition، يقوم ريأكت بحساب التغييرات في خيط عمل موازٍ متقطع، مما يسمح لأي نقرة جديدة بإلغاء العمل القديم والبدء في الجديد فوراً.',
      codeExample: `startTransition(() => {
  setSearchResults(heavyFilterAlgorithm(rawSearchTerm));
});`,
      commonMistakes: 'محاولة وضع مدخلات التحكم في النماذج (Controlled Inputs text) داخل startTransition مما يشعر المستخدم ببطء استجابة لوحة المفاتيح.',
      followUp: 'كيف تتكامل ميزة Transitions مع Suspense لعرض حالات الانتظار دون إخفاء الواجهة الحالية تماماً؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react', 'transitions', 'concurrency', 'responsiveness'],
      docUrl: 'https://react.dev/reference/react/useTransition'
    }
  ],
  'react-rendering-ssr': [
    {
      title: 'ما الفرق بين CSR و SSR و SSG و ISR في منظومة تطبيقات ريأكت الحديثة؟',
      shortAnswer: 'CSR يبني الواجهة في المتصفح، و SSR يبني صفحة الـ HTML عند كل طلب في الخادم، و SSG يبني الصفحات وقت تجميع المشروع (Build time)، بينما ISR يعيد توليد الصفحات الثابتة دورياً في الخلفية عند الطلب.',
      detailedAnswer: 'يتميز CSR بالمرونة بعد التحميل الأولي لكنه يعاني من بطء التحميل الأولي وضعف الـ SEO. الـ SSR يقدم محتوى فوري ومثالي لمحركات البحث لبيانات تتغير باستمرار. الـ SSG فائق السرعة عبر CDNs للمدونات والمواقع التوثيقية، بينما يوفر ISR التوازن المثالي بتحديث الصفحات الثابتة فور انتهاء مدة الكاش دون إعادة تجميع كامل الموقع.',
      codeExample: `// مثال مفاهيمي لـ ISR في خوادم ريأكت الحديثة
export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }];
}
// إعادة التحقق من الصفحة الثابتة كل 60 ثانية
export const revalidate = 60;`,
      commonMistakes: 'استخدام SSR الكامل لصفحات تحتوي على بيانات ثابتة لا تتغير، مما يضع عبء حوسبي وتكاليف استضافة لا لزوم لها على الخادم.',
      followUp: 'كيف تؤثر كل استراتيجية تصيير على تكاليف استضافة الـ Serverless ووقت الاستجابة للمستخدم (TTFB)؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react', 'rendering-patterns', 'ssr', 'ssg', 'isr'],
      docUrl: 'https://react.dev/learn'
    },
    {
      title: 'ما هي معضلة الـ Hydration وما هي مسببات الـ Hydration Mismatch الشهيرة؟',
      shortAnswer: 'هي عملية ربط أحداث JavaScript بشجرة الـ HTML المبنية مسبقاً من الخادم؛ ويحدث الـ Mismatch عندما تختلف بنية الشجرة المكونة على السيرفر عن بنية الشجرة التي يريد العميل إنشاؤها.',
      detailedAnswer: 'عندما يستلم المتصفح HTML من SSR، يقوم React بمطابقة عناصر الـ DOM القائمة مع ناتج الـ render للعميل. إذا كان هناك اختلاف (مثل استخدام Date.now()، أو نافذة window، أو صياغة HTML غير صالحة مثل وضع <p> داخل <p>)، يفشل التطابق ويضطر ريأكت للتخلي عن الشجرة القديمة وإعادة بنائها مع إطلاق خطأ تحذيري.',
      codeExample: `// سبب شائع للـ Mismatch: الاعتماد على تاريخ متغير في الخادم والعميل
function Timestamp() {
  // خطأ: السيرفر له توقيت والعميل له توقيت آخر
  // return <span>{new Date().toLocaleTimeString()}</span>;

  // حل سليم: إظهار التوقيت بعد اكتمال الـ mount في المتصفح فقط
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    setTime(new Date().toLocaleTimeString());
  }, []);

  return <span>{time || "جاري التحميل..."}</span>;
}`,
      commonMistakes: 'محاولة إخفاء الخطأ بوضع suppressHydrationWarning في كل مكان بدلاً من إصلاح سبب عدم التوافق.',
      followUp: 'كيف يسهم استخدام مكتبة التنسيق السليمة في تجنب مشاكل الـ Hydration للأنماط والخطوط؟',
      difficulty: 'senior',
      importance: 'essential',
      tags: ['react', 'hydration', 'ssr', 'debugging'],
      docUrl: 'https://react.dev/reference/react-dom/client/hydrateRoot'
    },
    {
      title: 'ما هي مكونات خادم ريأكت (React Server Components - RSC) وكيف تختلف جوهرياً عن SSR؟',
      shortAnswer: 'الـ RSCs هي مكونات تنفذ حصرياً على الخادم ولا ترسل أي كود JavaScript إلى حزمة العميل على الإطلاق، على عكس SSR الذي يرسل كود JS لكافة المكونات ليتم عمل Hydrate لها.',
      detailedAnswer: 'في نظام SSR التقليدي، يعمل كود المكون على السيرفر لإنتاج الـ HTML الأولي، ولكن يجب أيضاً إرسال كود المكون إلى المتصفح للقيام بالـ Hydration. مكونات الـ Server Components تنفذ على الخادم فقط، وتتمتع بوصول مباشر لقواعد البيانات ونظام الملفات، وترسل للمتصفح تمثيلاً بيانياً تسلسلياً (RSC Payload) صفر بايت من كود الجافاسكربت للمتصفح.',
      codeExample: `// هذا المكون ينفذ على الخادم فقط ولا يحمل أي كود JS للمتصفح
import db from '@/lib/db';

export async function ProductReviewList({ productId }: { productId: string }) {
  // استعلام مباشر بقاعدة البيانات بدون إنشاء API endpoint
  const reviews = await db.reviews.findMany({ where: { productId } });

  return (
    <div>
      {reviews.map(r => (
        <p key={r.id}>{r.comment}</p>
      ))}
    </div>
  );
}`,
      commonMistakes: 'الاعتقاد بأن RSC تلغي الحاجة لـ Client Components، فالمكونات التفاعلية (مع onClick و useState) لا تزال تتطلب التوجيه "use client".',
      followUp: 'كيف تتواصل Server Components مع Client Components عبر تمرير الـ Props والـ Children؟',
      difficulty: 'senior',
      importance: 'advanced',
      tags: ['react', 'rsc', 'server-components', 'architecture'],
      docUrl: 'https://react.dev/reference/rsc/server-components'
    },
    {
      title: 'ما هو التوجيه "use client" ومتى يجب استخدامه في بنية RSC؟',
      shortAnswer: 'هو علامة ترسيمية (Boundary) تحدد نقطة الانتقال من بيئة عمل المكونات الخادومية إلى مكونات العميل التفاعلية التي تتطلب استخدام الـ State والـ Effects وأحداث المتصفح.',
      detailedAnswer: 'افتراضياً في بنية RSC تكون كافة المكونات هي Server Components. عند الحاجة لتفاعل المستخدم (مثل استخدام useState, useEffect, onClick)، نضع السطر "use client" في أول الملف لتعريفه كـ Client Component. المكونات المستوردة داخل هذا الملف تصبح تلقائياً جزءاً من حزمة المتصفح.',
      codeExample: `'use client';

import { useState } from 'react';

export function UpvoteButton() {
  const [votes, setVotes] = useState(0);

  return (
    <button onClick={() => setVotes(v => v + 1)}>
      تصويت ({votes})
    </button>
  );
}`,
      commonMistakes: 'وضع "use client" في قمة ملف التخطيط الأساسي (Root Layout)، مما يحول التطبيق بالكامل إلى CSR ويفقد مزايا الخادم.',
      followUp: 'لماذا تنصح أفضل الممارسات بنقل "use client" إلى أدنى ورقة في شجرة المكونات (Leaf Components)؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react', 'use-client', 'rsc', 'boundaries'],
      docUrl: 'https://react.dev/reference/rsc/use-client'
    },
    {
      title: 'ما هو الـ Streaming SSR وكيف يعمل مع دالة renderToPipeableStream في Node.js؟',
      shortAnswer: 'هو تقنية تتيح إرسال أجزاء الـ HTML المكتملة إلى المتصفح بشكل تدفقي متتابع عبر Streams دون انتظار اكتمال تحميل أثقل أجزاء الصفحة، مما يقلص زمن ظهور أول بايت وأول محتوى مرئي.',
      detailedAnswer: 'باستخدام renderToPipeableStream في خوادم Node.js مقترناً بـ React Suspense، يقوم السيرفر بضخ هيكل الصفحة الأساسي فوراً للمتصفح مع شاشات انتظار (Fallbacks)، وعندما تكتمل استعلامات البيانات البطيئة في الخادم، يتم دفق محتوى الـ HTML النهائي مع سكربت صغير لإدراجه في موضعه دون إعادة تحميل.',
      codeExample: `// استخدام renderToPipeableStream على الخادم
import { renderToPipeableStream } from 'react-dom/server';

app.get('/', (req, res) => {
  const { pipe } = renderToPipeableStream(<App />, {
    bootstrapScripts: ['/main.js'],
    onShellReady() {
      res.setHeader('content-type', 'text/html');
      pipe(res); // بدء بث الهيكل الأساسي فوراً
    },
    onError(error) {
      console.error(error);
    }
  });
});`,
      commonMistakes: 'استخدام الدالة القديمة renderToString التي كانت تحبس الاستجابة وتمنع إرسال أي بايت حتى يكتمل تجهيز كامل شجرة المكونات.',
      followUp: 'كيف يتعامل Streaming SSR مع محركات البحث وعناكب الفهرسة التي لا تنتظر دفق البيانات المتأخر؟',
      difficulty: 'senior',
      importance: 'advanced',
      tags: ['react', 'streaming', 'ssr', 'rendertopipeablestream'],
      docUrl: 'https://react.dev/reference/react-dom/server/renderToPipeableStream'
    },
    {
      title: 'كيف يعمل Suspense لجلب البيانات (Data Fetching) وإدارة حالات التحميل المتداخلة؟',
      shortAnswer: 'يتيح Suspense للمكونات إيقاف تصييرها مؤقتاً عند انتظار بيانات غير متزامنة، ويعرض أقرب واجهة بديلة (Fallback) محددة في الشجرة حتى تكتمل البيانات دون كتابة شروط isLoading يدوية.',
      detailedAnswer: 'عندما "يعلق" مكون بانتظار promise معلق، يلتقط Suspense هذا التعليق ويعرض الـ fallback. يتيح Suspense تجزئة الصفحة إلى مناطق مستقلة بحيث تظهر المكونات السريعة فوراً بينما تستمر المكونات البطيئة في عرض مؤشر تحميل خاص بها دون تعطيل باقي الصفحة.',
      codeExample: `function Dashboard() {
  return (
    <div>
      <h1>لوحة التحكم</h1>
      <Suspense fallback={<MetricsSkeleton />}>
        <RealtimeMetrics />
      </Suspense>
      <Suspense fallback={<RecentOrdersSkeleton />}>
        <RecentOrders />
      </Suspense>
    </div>
  );
}`,
      commonMistakes: 'تغليف الصفحة كاملة بـ Suspense واحد فقط، مما يؤدي لاختفاء كامل الصفحة وعرض سبينر مركزي كبير عند تأخر جزء فرعي بسيط.',
      followUp: 'كيف تتكامل ميزة use() الجديدة في ريأكت لقراءة الـ Promises مباشرة داخل المكون مع Suspense؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react', 'suspense', 'data-fetching', 'ux'],
      docUrl: 'https://react.dev/reference/react/Suspense'
    },
    {
      title: 'ما هي دالة use() الجديدة في React 19 وكيف تتعامل مع الـ Promises والـ Context؟',
      shortAnswer: 'دالة use() تقبل إما Promise أو Context، وتتميز عن باقي الـ Hooks بإمكانية استدعائها مشروطة داخل جمل if أو حلقات التكرار، وتتكامل تلقائياً مع Suspense.',
      detailedAnswer: 'تعتبر use() استثناءً فريداً لقواعد الـ Hooks الكلاسيكية، حيث يمكنك استدعاؤها داخل جمل شرطية. عند تمرير Promise لها، فإنها توقف تصيير المكون حتى يتم حل الـ Promise (معتمدة على Suspense)، وعند تمرير Context فإنها تقرأ قيمته تماماً مثل useContext ولكن بشكل مشروط.',
      codeExample: `import { use } from 'react';

function UserBadge({ userPromise, shouldShow }: { userPromise: Promise<User>; shouldShow: boolean }) {
  if (!shouldShow) return null; // استدعاء مشروط سليم تماماً مع use()

  const user = use(userPromise);
  return <span>{user.name}</span>;
}`,
      commonMistakes: 'إنشاء الـ Promise داخل جسم المكون في كل render بدلاً من تمريره من خادم أو كاش، مما يسبب حلقة تعليق لا نهائية.',
      followUp: 'لماذا لا يمكن استدعاء use() داخل كتل try/catch وما هو البديل للتعامل مع أخطاء الـ Promises؟',
      difficulty: 'senior',
      importance: 'advanced',
      tags: ['react', 'react19', 'use-api', 'promises'],
      docUrl: 'https://react.dev/reference/react/use'
    },
    {
      title: 'كيف تتعامل مع معالجة الـ SEO والوسوم الوصفية (Metadata & Open Graph) في تطبيقات ريأكت؟',
      shortAnswer: 'في تطبيقات CSR نستخدم مكتبات تعديل الـ Head أو نوفر Pre-rendering، وفي SSR و Next.js نستخدم الـ Metadata API لتوليد وسوم title و meta و og ديناميكياً على السيرفر قبل إرسال الصفحة.',
      detailedAnswer: 'لا تقوم كافة عناكب محركات البحث ومنصات التواصل الاجتماعي (مثل Facebook و Twitter) بتنفيذ أكواد الـ JavaScript لقراءة الوسوم الديناميكية المنشأة في المتصفح. لذلك يعد توليد وسوم Open Graph و Canonical URLs في مرحلة الـ SSR بالخادم أمراً جوهرياً لظهور الروابط بشكل سليم وغني.',
      codeExample: `// مثال تعريف Metadata في Server Component
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticle(params.id);
  return {
    title: article.title,
    description: article.summary,
    openGraph: {
      images: [article.coverImage],
    },
  };
}`,
      commonMistakes: 'الاعتماد على تعديل document.title في useEffect لصفحات تتطلب أرشفة قوية في محركات البحث.',
      followUp: 'كيف يتم توليد صور Open Graph الديناميكية تلقائياً على حافة الخادم (Edge OG Images)؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react', 'seo', 'metadata', 'open-graph'],
      docUrl: 'https://react.dev/learn'
    },
    {
      title: 'ما هي استراتيجية الـ Islands Architecture وكيف تقارن بـ React Hydration التقليدي؟',
      shortAnswer: 'تقوم معمارية الجزر بعرض الصفحة كـ HTML ثابت كلياً، وتفعيل الـ JavaScript والـ Hydration فقط في جزر صغيرة مستقلة وتفاعلية، مما يحذف أكواد الجافاسكربت غير المستخدمة.',
      detailedAnswer: 'في ريأكت التقليدي، يتم عمل Hydrate لكامل الشجرة من الجذر إلى الأوراق حتى لو كانت 90% من الصفحة نصوصاً ثابتة. معمارية الجزر (الشهيرة في أطر مثل Astro) تبقي أجزاء الصفحة الثابتة بدون أي JS، وتشغل ريأكت فقط في الأزرار والنماذج التي تحتاج تفاعلاً، مما يقلل حجم الحزمة إلى الصفر للمحتوى النصي.',
      codeExample: `<!-- مثال مفهومي لمعمارية الجزر -->
<header>HTML ثابت بدون أي JavaScript</header>
<article>محتوى المقال الثابت فائق السرعة</article>
<!-- جزيرة تفاعلية فقط لمكون التعليقات المكتوب بريأكت -->
<CommentsIsland client:visible />`,
      commonMistakes: 'الاعتقاد بأن كل شاشة في الموقع تحتاج لـ React Hydration كامل حتى لو كانت محتوى قراءة فقط.',
      followUp: 'كيف أثر مفهوم الجزر على طريقة تطوير وتصميم ميزات React Server Components الحديثة؟',
      difficulty: 'senior',
      importance: 'advanced',
      tags: ['react', 'islands-architecture', 'astro', 'hydration'],
      docUrl: 'https://react.dev/learn'
    },
    {
      title: 'كيف تتعامل مع مشاكل الـ Cookies والجلسات والـ Caching في بيئة الـ Edge Runtime مع ريأكت؟',
      shortAnswer: 'عبر قراءة ملفات تعريف الارتباط في خوادم الحافة (Edge Handlers) وضبط ترويسات Cache-Control بدقة واستخدام الـ Middleware لتفادي تسريب بيانات المستخدمين بين الطلبات المخبأة.',
      detailedAnswer: 'تعمل بيئات الـ Edge على خوادم موزعة قريبة من المستخدم (مثل Cloudflare Workers). نظراً لطبيعتها الحسابية الخفيفة ومشاركتها للكاش العالمي، يجب الحذر من تخزين بيانات شخصية في ردود تخضع لـ CDN Caching (مثل s-maxage). يجب فصل الـ Cache العام المشترك عن بيانات الجلسات الخاصة بواسطة ترويسة Vary: Cookie.',
      codeExample: `// فحص الكوكيز على الحافة
export function middleware(request: Request) {
  const token = request.headers.get('cookie')?.includes('session_token');
  if (!token) {
    return Response.redirect(new URL('/login', request.url));
  }
}`,
      commonMistakes: 'تخزين كاش استجابات تحتوي على معلومات شخصية لمستخدم في CDN مشترك مع مستخدمين آخرين.',
      followUp: 'ما الفرق في بيئة التشغيل والواجهات المدعومة بين Node.js Runtime وبيئة الـ Edge Runtime المبنية على V8 Isolates؟',
      difficulty: 'senior',
      importance: 'advanced',
      tags: ['react', 'edge-runtime', 'caching', 'cookies'],
      docUrl: 'https://react.dev/learn'
    }
  ],
  'react-forms-validation': [
    {
      title: 'ما الفرق بين Controlled Components و Uncontrolled Components ومتى نفضل كلاً منهما؟',
      shortAnswer: 'المكون المضبوط (Controlled) تدار قيمته عبر حالة ريأكت (useState)، بينما غير المضبوط (Uncontrolled) يحتفظ بقيمته في الـ DOM الداخلي ويتم قراءته عبر Ref أو استخراج FormData.',
      detailedAnswer: 'المكونات المضبوطة توفر تحكماً فورياً للتحقق من صحة المدخلات وإخفاء أو تعطيل الحقول لحظة بلحظة، لكنها تطلق re-render في كل ضغطة زر. المكونات غير المضبوطة أفضل في الأداء وسهولة التكامل مع مكتبات DOM الخارجية والنماذج الضخمة حيث نقرأ البيانات فقط عند تقديم النموذج (onSubmit).',
      codeExample: `// Controlled Component
const [email, setEmail] = useState('');
<input value={email} onChange={e => setEmail(e.target.value)} />

// Uncontrolled Component
const emailRef = useRef<HTMLInputElement>(null);
<input ref={emailRef} defaultValue="test@example.com" />`,
      commonMistakes: 'التحويل غير المقصود لعنصر من Uncontrolled إلى Controlled عن طريق تمرير قيمة undefined أولاً ثم قيمة نصية لاحقاً.',
      followUp: 'لماذا يظهر خطأ: "A component is changing an uncontrolled input to be controlled" وكيف نتفاداه؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react', 'forms', 'controlled', 'uncontrolled'],
      docUrl: 'https://react.dev/reference/react-dom/components/input'
    },
    {
      title: 'لماذا تعتبر مكتبة React Hook Form (RHF) متفوقة في الأداء مقارنة بنماذج Formik التقليدية؟',
      shortAnswer: 'لأن React Hook Form تعتمد على النمط غير المضبوط (Uncontrolled) وتسجيل المدخلات عبر Refs، مما يمنع إعادة تصيير كامل النموذج عند كل ضغطة زر على عكس Formik التي تعتمد على الـ Controlled State.',
      detailedAnswer: 'في Formik، يتم تحديث حالة مركزية مع كل حرف يكتبه المستخدم مما يعيد تصيير كافة حقول النموذج مسبباً ثقلاً وبطئاً ملحوظاً في الشاشات الكبيرة. بينما تسجل RHF الحقول وتستمع لأحداث التغيير محلياً، ولا تعيد تصيير سوى الحقل المعني بالخطأ فقط مع استهلاك ذاكرة منخفض للغاية.',
      codeExample: `import { useForm } from 'react-hook-form';

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<{ email: string }>();

  const onSubmit = (data: { email: string }) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email", { required: "البريد الإلكتروني مطلوب" })} />
      {errors.email && <span>{errors.email.message}</span>}
      <button type="submit">دخول</button>
    </form>
  );
}`,
      commonMistakes: 'استخدام watch() في أعلى المكون دون تحديد حقول معينة مما يعيد تصيير كامل المكون ويفقد ميزة RHF الأساسية.',
      followUp: 'كيف يتم ربط مكونات واجهة المستخدم المخصصة (مثل مكاتب MUI أو Radix) مع RHF باستخدام مكون Controller؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react', 'react-hook-form', 'formik', 'performance'],
      docUrl: 'https://react.dev/reference/react-dom/components/input'
    },
    {
      title: 'كيف تدمج مكتبة Zod مع نماذج ريأكت لتوفير التحقق من النوع من البداية للنهاية (End-to-End Type-Safety)؟',
      shortAnswer: 'نعرف مخطط التحقق (Zod Schema) ونستخرج نوع TypeScript منه بواسطة z.infer، ثم نربطه بنموذج ريأكت عبر zodResolver للتحقق المتزامن من البيانات.',
      detailedAnswer: 'يوفر Zod أسلوباً تعريفياً للتحقق من صحة البيانات على العميل والخادم في آن واحد. عبر دمج zodResolver مع React Hook Form، يتم فحص المدخلات تلقائياً ومطابقة الرسائل التوضيحية وتوفير الإكمال التلقائي لأنواع الـ Form بدقة تامة وبدون أي تكرار لتعريف الـ Types.',
      codeExample: `import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
  email: z.string().email("بريد إلكتروني غير صالح"),
  password: z.string().min(8, "كلمة المرور يجب ألا تقل عن 8 خانات")
});

type LoginFormValues = z.infer<typeof loginSchema>;

function Form() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });
  // استخدام آمن للأنواع مع التحقق التلقائي
}`,
      commonMistakes: 'تكرار كتابة واجهة TypeScript منفصلة تماماً عن كائن التحقق Zod Schema.',
      followUp: 'كيف يمكن استخدام مخطط Zod نفسه في مسارات واجهة الخادم (API Routes) لضمان عدم تكرار كود التحقق؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react', 'zod', 'validation', 'typescript'],
      docUrl: 'https://react.dev/reference/react-dom/components/input'
    },
    {
      title: 'كيف تتعامل مع رفع الملفات المتعددة (File Uploads) ومؤشرات تقدم الرفع في نماذج ريأكت؟',
      shortAnswer: 'نستخدم مدخل type="file" لقراءة مصفوفة الملفات عبر e.target.files، ونقوم بتغليفها في كائن FormData وإرسالها بواسطة XMLHttpRequest أو Axios للاستماع لحدث onUploadProgress.',
      detailedAnswer: 'لا تدعم دالة fetch المدمجة في المتصفح مراقبة نسبة تقدم الرفع (Upload Progress) بسهولة حتى الآن. لذلك نلجأ إلى Axios أو XMLHttpRequest الذي يوفر حدث progress لمعرفة البايتات المرسلة وتحديث شريط التقدم في الواجهة، مع الحرص على عدم وضع Content-Type يدوياً ليقوم المتصفح بإضافة boundary الـ multipart تلقائياً.',
      codeExample: `async function handleUpload(files: FileList) {
  const formData = new FormData();
  Array.from(files).forEach(file => formData.append('attachments', file));

  await axios.post('/api/upload', formData, {
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setProgress(percent);
      }
    }
  });
}`,
      commonMistakes: 'وضع الترويسة headers: { "Content-Type": "multipart/form-data" } يدوياً، مما يفقد المتصفح توليد الـ boundary الصحيح ويفشل الرفع.',
      followUp: 'كيف نولد روابط معاينة فورية للصور قبل رفعها باستخدام URL.createObjectURL وما هي دالة التنظيف المطلوبة لها؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react', 'file-upload', 'form-data', 'progress'],
      docUrl: 'https://react.dev/reference/react-dom/components/input'
    },
    {
      title: 'كيف تدير النماذج الديناميكية التي تحتوي على مصفوفة حقول متغيرة (Dynamic Field Arrays)؟',
      shortAnswer: 'نستخدم خطاف useFieldArray في React Hook Form لإضافة وحذف وتحريك الحقول ديناميكياً مع تزويد كل حقل بمفتاح فريد (Key) ثابت ومخصص.',
      detailedAnswer: 'تتطلب نماذج الفواتير وقوائم المهام إضافة حقول أو إزالتها أثناء ملء النموذج. استخدام useState التقليدي لمصفوفة من الكائنات يسبب مشاكل في حفظ التركيز وأداء بطيء عند الحذف. يوفر useFieldArray دوال append و remove و move مسبقة الضبط مع معالجة هوية المفاتيح عبر field.id التلقائي.',
      codeExample: `import { useForm, useFieldArray } from 'react-hook-form';

function InvoiceForm() {
  const { control, register } = useForm();
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  return (
    <div>
      {fields.map((field, index) => (
        <div key={field.id}>
          <input {...register(\`items.\${index}.name\`)} />
          <button type="button" onClick={() => remove(index)}>حذف</button>
        </div>
      ))}
      <button type="button" onClick={() => append({ name: '' })}>إضافة صنف</button>
    </div>
  );
}`,
      commonMistakes: 'استخدام index المصفوفة كـ key لعناصر الحقول الديناميكية، مما يسبب اختلال محتوى الحقول وقيمها عند حذف صف وسطي.',
      followUp: 'كيف تتأكد من مطابقة التحقق في Zod لمصفوفة كائنات متغيرة بأبعاد غير محددة؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react', 'forms', 'usefieldarray', 'dynamic-forms'],
      docUrl: 'https://react.dev/reference/react-dom/components/input'
    },
    {
      title: 'ما هي الـ Server Actions في React 19 وكيف تحدث ثورة في إرسال النماذج بدون جافاسكربت؟',
      shortAnswer: 'هي دوال غير متزامنة تنفذ حصرياً على الخادم ويمكن ربطها مباشرة بخاصية action في وسم <form>، وتعمل حتى لو تم تعطيل JavaScript في متصفح العميل (Progressive Enhancement).',
      detailedAnswer: 'بدلاً من كتابة معالج onSubmit يدوي وتغليفه بـ e.preventDefault() واستدعاء API خارجي، يتيح React 19 تمرير دالة Server Action مباشرة للنموذج. يستقبل السيرفر كائن FormData، ويقوم بتعديل قاعدة البيانات، ثم يعيد ريأكت تحديث وتصيير الصفحة تلقائياً مع معالجة التحقق والتحديثات التفاؤلية.',
      codeExample: `// خادم: دالة Server Action
async function updateUsername(formData: FormData) {
  'use server';
  const newName = formData.get('username');
  await db.user.update({ name: String(newName) });
}

// مكون عميل أو خادم
function ProfileForm() {
  return (
    <form action={updateUsername}>
      <input name="username" defaultValue="أحمد" />
      <button type="submit">حفظ الاسم</button>
    </form>
  );
}`,
      commonMistakes: 'الاعتقاد بأن Server Actions محمية تلقائياً من ثغرات CSRF أو أنها لا تحتاج للتحقق من تصاريح المصادقة.',
      followUp: 'كيف يتم تأمين وحماية دوال Server Actions ضد هجمات تزوير الطلبات والتحقق من صلاحية المستخدم؟',
      difficulty: 'senior',
      importance: 'advanced',
      tags: ['react', 'react19', 'server-actions', 'progressive-enhancement'],
      docUrl: 'https://react.dev/reference/rsc/server-actions'
    },
    {
      title: 'كيف تتعامل مع حفظ مسودات النماذج تلقائياً (Auto-save) لمنع ضياع مدخلات المستخدم؟',
      shortAnswer: 'عبر مراقبة قيم النموذج بالـ Debounce وحفظها في localStorage أو إرسالها للخادم في الخلفية تلقائياً، مع تنظيف المسودة فور نجاح التقديم النهائي.',
      detailedAnswer: 'لحماية جهد المستخدم من الإغلاق المفاجئ أو انقطاع الاتصال، نقوم بمراقبة التغييرات وتأخير عملية الحفظ لفترة زمنية (مثل ثانيتين من توقف الكتابة). عند فتح المكون مجدداً، يتم استرجاع المسودة وعرض إشعار للمستخدم يتيح له المتابعة أو مسح المسودة والبدء من جديد.',
      codeExample: `useEffect(() => {
  const subscription = watch((values) => {
    const timer = setTimeout(() => {
      localStorage.setItem('form_draft', JSON.stringify(values));
    }, 1500);
    return () => clearTimeout(timer);
  });
  return () => subscription.unsubscribe();
}, [watch]);`,
      commonMistakes: 'حفظ كلمات المرور أو أرقام البطاقات الائتمانية الحساسة في الـ localStorage كمسودات غير مشفرة.',
      followUp: 'كيف تستخدم حدث beforeunload لتحذير المستخدم عند محاولة إغلاق الصفحة بوجود تغييرات غير محفوظة؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react', 'auto-save', 'localstorage', 'ux'],
      docUrl: 'https://react.dev/reference/react-dom/components/input'
    },
    {
      title: 'ما هي معايير إتاحة النماذج للأشخاص ذوي الإعاقة (Form Accessibility - a11y)؟',
      shortAnswer: 'ربط كل حقل إدخال بـ <label> صريح عبر htmlFor و id، وتحديد سمات aria-invalid و aria-describedby لرسائل الخطأ، ودعم التنقل الكامل بلوحة المفاتيح والتركيز التلقائي.',
      detailedAnswer: 'لا تستطيع قارئات الشاشة التعرف على وظيفة الحقل إذا اعتمد المطور على placeholder فقط دون label. عند حدوث خطأ، يجب إضافة aria-invalid="true" للحقل وربطه بمعرف رسالة الخطأ عبر aria-describedby حتى يقرأه البرنامج الناطق للمكفوفين فور انتقال التركيز إليه، مع نقل الـ Focus تلقائياً لأول حقل خاطئ عند محاولة التقديم.',
      codeExample: `<div>
  <label htmlFor="user-email">البريد الإلكتروني:</label>
  <input
    id="user-email"
    type="email"
    aria-invalid={Boolean(errors.email)}
    aria-describedby={errors.email ? "email-error" : undefined}
  />
  {errors.email && <p id="email-error" role="alert">{errors.email.message}</p>}
</div>`,
      commonMistakes: 'الاعتماد على لون الحقل الأحمر فقط كدلالة وحيدة على وجود خطأ دون إرفاق نص توضيحي أو سمات إتاحة.',
      followUp: 'ما هو دور السمة role="alert" في قارئات الشاشة عند ظهور رسائل الأخطاء الديناميكية؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react', 'accessibility', 'a11y', 'forms'],
      docUrl: 'https://react.dev/reference/react-dom/components/input'
    },
    {
      title: 'كيف تمنع النقر المزدوج وتقديم النموذج المتكرر (Double Submissions)؟',
      shortAnswer: 'بتعطيل زر الإرسال بمجرد بدء الطلب باستخدام حالة isSubmitting، مع إلغاء أو تجاهل أي طلبات لاحقة أثناء معالجة الطلب الأول.',
      detailedAnswer: 'إذا نقر المستخدم زر الحفظ عدة مرات بسرعة، قد يتم إرسال طلبات متعددة للخادم وتكرار الخصم المالي أو إنشاء سجلات مكررة. يتم حل هذه المشكلة بالواجهة بتعطيل الزر (disabled={isSubmitting}) وإظهار مؤشر تحميل، مع تطبيق آليات الـ Idempotency Keys في الخادم كخط دفاع أساسي.',
      codeExample: `function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <button type="submit" disabled={isSubmitting} className="btn-primary">
      {isSubmitting ? "جاري المعالجة..." : "تأكيد الدفع"}
    </button>
  );
}`,
      commonMistakes: 'الاعتماد فقط على تعطيل الزر في المتصفح دون حماية الخادم بواسطة Idempotency Tokens.',
      followUp: 'كيف تعمل مفاتيح عدم التكرار (Idempotency Keys) في المعاملات المالية الحساسة؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react', 'forms', 'ux', 'double-submission'],
      docUrl: 'https://react.dev/reference/react-dom/components/input'
    },
    {
      title: 'كيف تبني معالج نماذج متعدد الخطوات (Multi-step Wizard Form) مع الحفاظ على البيانات عند الرجوع؟',
      shortAnswer: 'نعرف حالة مركزية تخزن بيانات جميع الخطوات في المكون الأب، ونعرض المكون المقابل لرقم الخطوة الحالية مع تزويده بزر للرجوع والتقدم دون فقدان المدخلات السابقة.',
      detailedAnswer: 'يمكن تقسيم النماذج الطويلة إلى خطوات منطقية. يتم التحقق من صحة حقول الخطوة الحالية فقط قبل السماح بالانتقال للخطوة التالية. يتم الاحتفاظ بكامل البيانات المجمعة في كائن موحد، بحيث يتم إرسال الكائن النهائي للخادم فقط في الخطوة الأخيرة.',
      codeExample: `function Wizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const nextStep = (stepData: object) => {
    setFormData(prev => ({ ...prev, ...stepData }));
    setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => Math.max(1, s - 1));

  return (
    <div>
      {step === 1 && <PersonalInfo onNext={nextStep} defaultValues={formData} />}
      {step === 2 && <BillingInfo onNext={nextStep} onBack={prevStep} defaultValues={formData} />}
    </div>
  );
}`,
      commonMistakes: 'تدمير بيانات الخطوات السابقة عند الرجوع بسبب إعادة تهيئة الـ State المحلية في كل خطوة.',
      followUp: 'كيف يمكنك استخدام مسارات الـ URL لتمثيل كل خطوة في الـ Wizard لدعم زر الرجوع في المتصفح؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react', 'wizard', 'multi-step-form', 'state-structure'],
      docUrl: 'https://react.dev/learn/choosing-the-state-structure'
    }
  ],
  'react-testing': [
    {
      title: 'ما هي فلسفة React Testing Library (RTL) وكيف تختلف عن اختبارات الـ Enzyme القديمة؟',
      shortAnswer: 'فلسفة RTL تقوم على اختبار المكونات كما يتفاعل معها المستخدم الحقيقي (عبر النصوص والأزرار ودورات الوصول)، بدلاً من اختبار تفاصيل التنفيذ الداخلي (Internal Implementation Details) كالـ State والـ Class Methods.',
      detailedAnswer: 'كانت مكتبات مثل Enzyme تفحص حالة المكون الداخلية (مثل wrapper.state().count) والمكونات الفرعية المعزولة (Shallow Rendering). هذا النوع من الاختبارات سريع الكسر عند أي إعادة هيكلة (Refactor) حتى لو ظلت الواجهة تعمل كما هي للمستخدم. تركز RTL على الاستعلام بواسطة الأدوار والنصوص الظاهرة (getByRole, getByText) لضمان متانة الاختبار وثقته العالية.',
      codeExample: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Counter from './Counter';

test('يزيد العداد عند النقر على الزر', async () => {
  render(<Counter />);
  const button = screen.getByRole('button', { name: /زيادة/i });
  await userEvent.click(button);
  expect(screen.getByText(/العدد: 1/i)).toBeInTheDocument();
});`,
      commonMistakes: 'محاولة استخراج واستدعاء دوال الحالة الداخلية أو فحص الـ props بدلاً من اختبار ما يظهر للمستخدم في الـ DOM.',
      followUp: 'لماذا تنصح RTL دائماً بتقديم getByRole على getByTestId في استعلامات البحث؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react', 'testing', 'rtl', 'enzyme'],
      docUrl: 'https://react.dev/learn'
    },
    {
      title: 'ما الفرق بين getBy و queryBy و findBy في استعلامات React Testing Library؟',
      shortAnswer: 'دالة getBy تعيد العنصر فوراً أو تطلق خطأ إذا لم يوجد، و queryBy تعيد null عند عدم وجوده (مثالية لفحص الاختفاء)، بينما findBy غير متزامنة وتنتظر ظهور العنصر (مع معالجة الـ Promises والـ Animations).',
      detailedAnswer: 'استخدم getBy للعناصر التي يجب أن تكون حاضرة في الـ DOM فوراً. استخدم queryBy عندما تريد التحقق من عدم وجود عنصر، مثل expect(screen.queryByText(/خطأ/)).not.toBeInTheDocument(). استخدم findBy عندما تنتظر بيانات غير متزامنة من السيرفر أو تأثيراً مؤجلاً، حيث تقوم بالانتظار والمحاولة المتكررة حتى تنتهي مهلة timeout.',
      codeExample: `// 1. عنصر حاضر متزامن
const title = screen.getByRole('heading');

// 2. التحقق من عدم الظهور
expect(screen.queryByText('رسالة خطأ')).toBeNull();

// 3. انتظار ظهور عنصر بعد استدعاء API
const successMessage = await screen.findByText('تم الحفظ بنجاح', {}, { timeout: 3000 });`,
      commonMistakes: 'استخدام getBy داخل expect(...).not.toBeInTheDocument()، مما يطلق استثناءً ويفشل الاختبار فوراً قبل وصوله لـ expect.',
      followUp: 'ما هي القيمة الافتراضية للمهلة الزمنية في دوال findBy وكيف يمكن تغييرها؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react', 'testing-library', 'queries', 'async-testing'],
      docUrl: 'https://react.dev/learn'
    },
    {
      title: 'لماذا يفضل استخدام userEvent بدلاً من fireEvent في اختبار تفاعلات المستخدم؟',
      shortAnswer: 'يقوم userEvent بمحاكاة السلسلة الكاملة من أحداث المتصفح الواقعية (مثل hover ثم focus ثم keydown ثم input)، بينما يطلق fireEvent الحدث المستهدف فقط بشكل جاف ومصطنع.',
      detailedAnswer: 'عندما ينقر مستخدم حقيقي على زر، يطلق المتصفح أحداث mouseOver, mouseEnter, mouseDown, focus, mouseUp, و click بالترتيب. يطبق userEvent هذه الدورة الكاملة مما يكشف المشاكل الحقيقية في التفاعل، بينما يكتفي fireEvent.click بإرسال حدث النقر مباشرة متجاهلاً فحوصات التعطيل (disabled) والتركيز.',
      codeExample: `import userEvent from '@testing-library/user-event';

test('كتابة نص في الحقل', async () => {
  const user = userEvent.setup();
  render(<SearchInput />);
  const input = screen.getByPlaceholderText('ابحث هنا...');

  // يحاكي النقر على الحقل ثم كتابة كل حرف تلو الآخر
  await user.type(input, 'هاتف ذكي');
  expect(input).toHaveValue('هاتف ذكي');
});`,
      commonMistakes: 'نسيان استدعاء userEvent.setup() في بداية الاختبار أو نسيان كلمة await قبل استدعاءات userEvent.',
      followUp: 'كيف يتعامل userEvent مع التفاعلات المركبة كالسحب والإفلات (Drag and Drop) وتحديد النصوص؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react', 'user-event', 'fire-event', 'testing'],
      docUrl: 'https://react.dev/learn'
    },
    {
      title: 'ما هو Mock Service Worker (MSW) ولماذا هو المعيار الذهبي لاختبار طلبات الـ API في ريأكت؟',
      shortAnswer: 'يقوم MSW باعتراض طلبات الشبكة على مستوى طبقة الشبكة (Network Layer) باستخدام Service Worker أو Node.js interceptors، دون تعديل كود استدعاءات الـ fetch الأصلية في التطبيق.',
      detailedAnswer: 'بدلاً من استخدام jest.spyOn(global, "fetch") والاضطرار لمحاكاة كائنات Response يدوياً واختراق شفرة التطبيق، يسمح MSW بكتابة معالجات طلبات واقعية جداً تحاكي السيرفر بدقة. نفس هذه الـ mocks يمكن استخدامها في اختبارات Jest، وتطوير الواجهات محلياً في المتصفح، واختبارات E2E دون تكرار أي كود.',
      codeExample: `import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

export const server = setupServer(
  http.get('/api/user', () => {
    return HttpResponse.json({ id: '1', name: 'أحمد' });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());`,
      commonMistakes: 'نسيان استدعاء server.resetHandlers() بعد كل اختبار، مما يسبب تسريب إعدادات أخطاء مخصصة بين الاختبارات المتتالية.',
      followUp: 'كيف يمكنك محاكاة سيناريوهات انقطاع الشبكة أو أخطاء الخادم 500 لاختبار محدد فقط باستخدام server.use()؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react', 'msw', 'mocking', 'api-testing'],
      docUrl: 'https://react.dev/learn'
    },
    {
      title: 'ما هو التحذير الشهير: "act(...) warning" ولماذا يظهر وكيف نعالجه بشكل صحيح؟',
      shortAnswer: 'يظهر عندما يتم تحديث حالة المكون (State update) خارج نطاق act()، وعادة ما يحدث بسبب انتهاء عملية غير متزامنة (Promise أو Timer) بعد أن انتهى الاختبار من التحقق.',
      detailedAnswer: 'تضمن دالة act() من ريأكت تنفيذ كافة تحديثات الحالة ورسم الـ DOM واستدعاءات الـ Effects قبل المضي قدماً في التحقق من النتيجة. يظهر التحذير عندما يطلق كود غير متزامن في الخلفية setState دون أن يكون الاختبار ينتظره. الحل الصحيح ليس تغليف كل سطر بـ act() يدوياً، بل استخدام دوال الانتظار الصحيحة مثل findBy أو waitFor.',
      codeExample: `// خاطئ: التحقق فوراً قبل انتظار انتهاء الطلب غير المتزامن
// fireEvent.click(submitBtn);
// expect(screen.getByText('تم الحفظ')).toBeInTheDocument(); // سيطلق تحذير act

// صحيح: انتظار ظهور النتيجة غير المتزامنة
await user.click(submitBtn);
await expect(screen.findByText('تم الحفظ')).resolves.toBeInTheDocument();`,
      commonMistakes: 'محاولة كتم تحذير act عبر تغليف استدعاءات عشوائية بدوال act() وهمية بدلاً من انتظار الـ Promise المعلق.',
      followUp: 'لماذا تم أتمتة دمج act() داخلياً في كافة دوال userEvent و findBy في الإصدارات الحديثة لـ RTL؟',
      difficulty: 'senior',
      importance: 'essential',
      tags: ['react', 'act-warning', 'async', 'debugging'],
      docUrl: 'https://react.dev/learn'
    },
    {
      title: 'كيف تختبر Custom Hook بشكل منفصل باستخدام renderHook من RTL؟',
      shortAnswer: 'باستخدام renderHook(() => useCustomHook()) التي تنشئ مكوناً وهمياً لتشغيل الـ Hook وإرجاع كائن result يحمل قيمته الحالية ودالة rerender لتحديثه.',
      detailedAnswer: 'نظراً لأن الـ Hooks لا يمكن استدعاؤها خارج مكونات ريأكت، توفر RTL دالة renderHook لتشغيل الـ Hook واختباره بمعزل عن واجهة المستخدم. يتم الوصول للقيم المرتجعة عبر result.current، وعند استدعاء أفعال تحدث الحالة يجب تغليفها أحياناً بـ act() إذا كانت دوال إجرائية مباشرة.',
      codeExample: `import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

test('يزيد القيمة في Custom Hook', () => {
  const { result } = renderHook(() => useCounter(0));

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});`,
      commonMistakes: 'تخزين result.current في متغير محلي منفصل ومحاولة قراءته لاحقاً، مما يفقد قراءة القيمة المحدثة بسبب تغير المرجع الداخلي.',
      followUp: 'كيف تمرر Context Provider إلى الـ Hook داخل renderHook باستخدام خاصية wrapper؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react', 'renderhook', 'custom-hooks', 'unit-testing'],
      docUrl: 'https://react.dev/learn'
    },
    {
      title: 'ما الفرق بين اختبارات المكونات (Component Tests) واختبارات النهاية إلى النهاية (E2E) بواسطة Playwright؟',
      shortAnswer: 'اختبارات المكونات تفحص وحدة واجهة معزولة داخل بيئة DOM افتراضية (jsdom)، بينما اختبارات E2E تشغل متصفحاً حقيقياً وتختبر مسار المستخدم الكامل عبر السيرفر والواجهة الحقيقية.',
      detailedAnswer: 'تتميز اختبارات RTL و Vitest بالسرعة الفائقة وإمكانية تشغيل آلاف الاختبارات في ثوانٍ لاكتشاف أخطاء المنطق الداخلي والحالات المتطرفة. بينما تضمن اختبارات E2E عبر Playwright تكامل النظام ككل وتوافق المتصفحات الحقيقية (Chromium, Firefox, WebKit) والـ Cookies الحقيقية لكنها أبطأ وأكثر كلفة في التشغيل.',
      codeExample: `// اختبار E2E بـ Playwright
import { test, expect } from '@playwright/test';

test('مسار تسجيل الدخول الكامل', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.fill('input[type="email"]', 'user@example.com');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/.*dashboard/);
});`,
      commonMistakes: 'محاولة تغطية كل تفاصيل وحالات المكونات المتطرفة عبر اختبارات E2E البطيئة بدلاً من توزيعها في Unit/Integration tests.',
      followUp: 'ما هو دور Testing Trophy في تحديد النسبة المثالية بين اختبارات Unit و Integration و E2E؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react', 'playwright', 'e2e', 'testing-strategy'],
      docUrl: 'https://react.dev/learn'
    },
    {
      title: 'كيف تختبر المكونات التي تعتمد على React Context دون الحاجة لتشغيل التطبيق كاملاً؟',
      shortAnswer: 'بتغليف المكون المستهدف بالـ Context.Provider المطلوب داخل دالة الـ render مع تزويده بالبيانات الوهمية المخصصة للاختبار.',
      detailedAnswer: 'لتجنب تشغيل شجرة التطبيق كاملة، يمكننا إما تمرير custom wrapper إلى دالة render، أو إنشاء دالة مساعدة عامة renderWithProviders تقوم بتغليف أي مكون بكافة الـ Providers الأساسية (مثل ThemeProvider، QueryClientProvider، Router) مع تمكين تخصيص الحالة الابتدائية لكل اختبار.',
      codeExample: `function renderWithTheme(ui: React.ReactElement, theme = 'dark') {
  return render(
    <ThemeContext.Provider value={theme}>
      {ui}
    </ThemeContext.Provider>
  );
}

test('يعرض المظهر الليلي', () => {
  renderWithTheme(<UserProfile />, 'dark');
  expect(screen.getByTestId('profile-container')).toHaveClass('theme-dark');
});`,
      commonMistakes: 'نسيان تغليف المكون بـ Context إلزامي يستهلكه المكون، مما يسبب خطأ TypeError: Cannot read properties of undefined.',
      followUp: 'كيف تبني Custom Render موحد يعاد استخدامه عبر كامل مجلد الاختبارات في المشروع؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react', 'context', 'test-wrapper', 'custom-render'],
      docUrl: 'https://react.dev/learn'
    },
    {
      title: 'ما هي اختبارات اللقطات (Snapshot Testing) وما هي محاذير الإفراط في استخدامها؟',
      shortAnswer: 'تقوم بمقارنة هيكل الـ DOM للمكون بنسخة نصية محفوظة مسبقاً، والإفراط فيها يؤدي لإنشاء اختبارات هشة يتم تحديثها عشوائياً عند أي تغيير بسيط دون قراءة الفروقات الحقيقية.',
      detailedAnswer: 'تعتبر الـ Snapshots مفيدة للتأكد من عدم تغير بنية نصوص أو أكواد SVG ثابتة عن طريق الخطأ. لكن المطورين غالباً ما يضغطون حرف "u" لتحديث اللقطات تلقائياً عند فشل الاختبار دون فحص التغيير الحقيقي، مما يفرغ الاختبار من قيمته ويسمح بتسرب الأخطاء.',
      codeExample: `test('يطابق لقطة زر الشراء الثابتة', () => {
  const { container } = render(<BuyButton label="شراء الآن" />);
  expect(container.firstChild).toMatchSnapshot();
});`,
      commonMistakes: 'الاعتماد الكلي على Snapshot Testing كبديل لاختبار الوظائف وسلوك المستخدم الحقيقي.',
      followUp: 'متى تكون الـ Inline Snapshots أفضل وأكثر وضوحاً في مراجعات الكود (PRs) من الملفات الخارجية؟',
      difficulty: 'junior',
      importance: 'advanced',
      tags: ['react', 'snapshots', 'regression', 'jest'],
      docUrl: 'https://react.dev/learn'
    },
    {
      title: 'كيف تختبر إمكانية الوصول (Accessibility Testing) في مكونات ريأكت باستخدام axe-core؟',
      shortAnswer: 'بدمج أداة jest-axe داخل اختبارات المكونات لفحص عقد الـ DOM بعد تصييرها وتأكيد خلوها من أي انتهاكات لمعايير WCAG.',
      detailedAnswer: 'تتيح مكتبة jest-axe أتمتة اكتشاف مخالفات الإتاحة الشائعة (مثل تباين الألوان الضعيف، غياب سمات alt في الصور، أو الحقول غير المرتبطة بتسميات). يتم تشغيل الفحص على حاوية الـ render والتحقق من عدم وجود انتهاكات برمجياً قبل دمج الكود.',
      codeExample: `import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

test('لا يحتوي نموذج الدخول على انتهاكات إتاحة', async () => {
  const { container } = render(<LoginForm />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});`,
      commonMistakes: 'الاعتقاد بأن اجتياز فحص axe يعني ضمان إتاحة الموقع بنسبة 100%، حيث لا تكتشف الفحوصات الآلية سوى حوالي 30-40% من مشاكل الإتاحة.',
      followUp: 'كيف تتأكد يدوياً من تجربة التنقل بلوحة المفاتيح عبر استخدام زر Tab ومقارنتها بنتائج الفحص الآلي؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react', 'accessibility', 'axe-core', 'wcag'],
      docUrl: 'https://react.dev/learn'
    }
  ],
  'react-architecture-patterns': [
    {
      title: 'ما هو نمط Compound Components وكيف يستخدم لبناء مكونات واجهة مرنة ومعقدة؟',
      shortAnswer: 'هو نمط تصميمي يسمح لمجموعة من المكونات بالتعاون ومشاركة الحالة ضمنياً عبر Context داخلي، مما يمنح المستخدم حرية كاملة في ترتيب وتخصيص هيكل الواجهة (مثل Tabs أو Select).',
      detailedAnswer: 'بدلاً من إنشاء مكون واحد ضخم يستقبل عشرات الـ Props لتخصيص كل زر ورمز، يقسم نمط المكونات المركبة الواجهة إلى أجزاء صغيرة (Tabs.List, Tabs.Tab, Tabs.Panel). تشترك هذه الأجزاء في الحالة عبر React Context مخفي، مما يوفر واجهة برمجية نظيفة ومرنة تشبه وسوم HTML الطبيعية مثل <select> و <option>.',
      codeExample: `// استخدام المكون المركب بنظافة فائقة
function App() {
  return (
    <Tabs defaultValue="tab1">
      <Tabs.List>
        <Tabs.Tab value="tab1">الملف الشخصي</Tabs.Tab>
        <Tabs.Tab value="tab2">الأمان</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="tab1">بيانات المستخدم...</Tabs.Panel>
      <Tabs.Panel value="tab2">إعدادات كلمة المرور...</Tabs.Panel>
    </Tabs>
  );
}`,
      commonMistakes: 'محاولة استخراج الأبناء بواسطة React.Children.map مما يكسر التضمين في حال تغليف المكون الفرعي بـ div وسيط، بدلاً من الاعتماد على Context.',
      followUp: 'كيف تعتمد مكتبات مثل Radix UI و Headless UI على هذا النمط لتقديم مكونات غير منسقة (Unstyled) وقابلة للتخصيص الكامل؟',
      difficulty: 'senior',
      importance: 'essential',
      tags: ['react', 'design-patterns', 'compound-components', 'architecture'],
      docUrl: 'https://react.dev/learn'
    },
    {
      title: 'ما الفرق بين Higher-Order Components (HOC) و Custom Hooks ولماذا حلت الهوكس محل الـ HOCs؟',
      shortAnswer: 'الـ HOC هي دالة تستقبل مكوناً وتعيد مكوناً جديداً مغلفاً، بينما Custom Hooks هي دوال تشارك منطق الحالة فقط دون التلاعب بشجرة الـ DOM وتجنب التعشيش المفرط (Wrapper Hell).',
      detailedAnswer: 'كانت الـ HOCs شائعة جداً لمشاركة المنطق (مثل withAuth أو withRouter). عيوبها شملت: تعارض أسماء الـ Props، صعوبة تتبع مصدر كل prop في TypeScript، ونشوء "Wrapper Hell" في شجرة المكونات. وفرت الـ Custom Hooks نفس القدرة على إعادة استخدام المنطق بصيغة أنظف وأكثر مرونة وبدون أي تأثير سلبي على هيكل شجرة المكونات.',
      codeExample: `// النمط القديم: Higher-Order Component
// const ProtectedProfile = withAuth(ProfileComponent);

// النمط الحديث: Custom Hook مباشر داخل المكون
function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <LoginPrompt />;
  return <h1>أهلاً، {user.name}</h1>;
}`,
      commonMistakes: 'استخدام HOC داخل جسم دالة المكون أثناء الـ render مما يؤدي لإعادة إنشاء نوع المكون في كل دورة وضياع حالته.',
      followUp: 'ما هي الحالات النادرة القليلة التي لا يزال فيها استخدام الـ HOC مفيداً اليوم؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react', 'hoc', 'custom-hooks', 'refactoring'],
      docUrl: 'https://react.dev/learn/reusing-logic-with-custom-hooks'
    },
    {
      title: 'ما هو نمط الـ Headless UI ولماذا يعتبر التوجه الأبرز في بناء أنظمة التصميم الحديثة (Design Systems)؟',
      shortAnswer: 'هو نمط يوفر المكونات بكامل منطق السلوك وإمكانية الوصول (Accessibility) والتنقل بلوحة المفاتيح دون أي تنسيق CSS، مما يترك للمطور الحرية الكاملة في تطبيق هوية التصميم الخاصة به.',
      detailedAnswer: 'بناء مكونات معقدة مثل الـ Modals والـ Combobox يتطلب مئات ساعات العمل لإتقان معايير ARIA وتركيز لوحة المفاتيح. مكتبات الـ Headless (مثل Radix UI أو React Aria) تتكفل بكافة هذه التعقيدات التقنية كمنطق خالص، وتترك التنسيق للمطور باستخدام Tailwind أو CSS Modules بحرية تامة وبدون صراع لتخطي تنسيقات المكتبة الافتراضية.',
      codeExample: `import * as Dialog from '@radix-ui/react-dialog';

function AccessibleModal() {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="btn">فتح النافذة</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="overlay" />
        <Dialog.Content className="modal-body">
          <Dialog.Title>تأكيد العملية</Dialog.Title>
          <Dialog.Close>إلغاء</Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}`,
      commonMistakes: 'محاولة إعادة اختراع منطق المكونات المعقدة كالقوائم المنسدلة من الصفر دون تطبيق سمات الإتاحة الضرورية.',
      followUp: 'كيف أسهم مفهوم الـ Headless في نجاح مكتبات التوزيع المباشر للكود مثل shadcn/ui؟',
      difficulty: 'senior',
      importance: 'essential',
      tags: ['react', 'headless-ui', 'design-systems', 'radix-ui'],
      docUrl: 'https://react.dev/learn'
    },
    {
      title: 'كيف تطبق مبدأ المسؤولية الواحدة (Single Responsibility) وفصل الـ Container والمكونات التقديمية؟',
      shortAnswer: 'بفصل المكونات التي تجلب البيانات وتدير الحالة (Container / Smart) عن المكونات التي تهتم فقط بعرض البيانات وتنسيق الواجهة (Presentational / Dumb).',
      detailedAnswer: 'يقوم المكون الذكي بجلب البيانات والاشتراك في الـ Stores والتعامل مع الخطأ، ثم يمرر البيانات النقية ودوال الأحداث كمجرد Props للمكون التقديمي. هذا الفصل يجعل المكونات التقديمية سهلة الاختبار للغاية وسهلة العرض في Storybook وقابلة لإعادة الاستخدام في سياقات مختلفة تماماً.',
      codeExample: `// 1. Presentational Component (نقي وسهل الاختبار)
function UserCardView({ name, email, onFollow }: UserCardProps) {
  return (
    <div className="card">
      <h3>{name}</h3>
      <p>{email}</p>
      <button onClick={onFollow}>متابعة</button>
    </div>
  );
}

// 2. Container Component (مسؤول عن جلب البيانات والمنطق)
function UserCardContainer({ userId }: { userId: string }) {
  const { data: user } = useQuery(['user', userId], fetchUser);
  const handleFollow = () => api.followUser(userId);

  if (!user) return <Skeleton />;
  return <UserCardView name={user.name} email={user.email} onFollow={handleFollow} />;
}`,
      commonMistakes: 'خلط عمليات الاستعلام من قاعدة البيانات وإرسال الأحداث والتنسيق المعقد داخل ملف مكون واحد ضخم يتجاوز 500 سطر.',
      followUp: 'كيف وفرت Custom Hooks بديلاً عصرياً قلل من الحاجة للفصل الهرمي بين Container و Presentational components؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react', 'container-presentational', 'solid', 'architecture'],
      docUrl: 'https://react.dev/learn'
    },
    {
      title: 'ما هي معمارية Feature-Sliced Design (FSD) وكيف تنظم مشاريع ريأكت الضخمة بمقياس Enterprise؟',
      shortAnswer: 'هو معيار هيكلي يقسم التطبيق إلى طبقات صارمة (app, pages, widgets, features, entities, shared) تضمن تدفق التبعيات في اتجاه واحد من الأعلى للأسفل وتمنع التشابك الفوضوي للكود.',
      detailedAnswer: 'في المشاريع الكبيرة، يفشل التقسيم التقليدي (components, hooks, services) مع توسع الفريق. تفرض FSD طبقات دقيقة: الطبقة shared للأساسيات العامة، entities لكيانات الأعمال (مثل User, Product)، features للتفاعلات المحددة (مثل AddToCart)، widgets لتجميعات الواجهة، و pages للصفحات. لا يمكن لأي طبقة استيراد شيء من طبقة تعلوها، مما يمنع التبعيات الدائرية تماماً.',
      codeExample: `// تسلسل الاستيراد المسموح في FSD (من الأعلى للأسفل فقط)
// pages/ProductPage
//   -> widgets/ProductDetails
//     -> features/AddToCart
//       -> entities/Product
//         -> shared/ui/Button`,
      commonMistakes: 'استيراد كود من طبقة عليا إلى طبقة سفلى، مما يخلق تبعية دائرية تكسر استقلالية الوحدات.',
      followUp: 'كيف يساعد مفهوم Public API (ملفات index.ts) في حماية الحدود الداخلية لكل شريحة (Slice)؟',
      difficulty: 'senior',
      importance: 'advanced',
      tags: ['react', 'fsd', 'architecture', 'scalability'],
      docUrl: 'https://react.dev/learn'
    },
    {
      title: 'كيف تبني نظام تصميمي متكامل يدعم الـ Dark Mode وأنظمة السمات المتعددة (Theming)؟',
      shortAnswer: 'باستخدام متغيرات CSS المتوافقة محلياً (CSS Custom Properties) مع فئة على عنصر الجذر <html>، أو عبر CSS-in-JS ومكتبات مثل next-themes لمنع وميض الشاشة عند التحميل (FOUC).',
      detailedAnswer: 'لتجنب وميض اللون الأبيض عند تحميل الصفحة للمستخدمين المفضلين للوضع الليلي، يجب قراءة التفضيل من localStorage أو ترويسة المتصفح وحقن كود JavaScript مصغر متزامن في الـ <head> قبل رسم الـ DOM لضبط سمة class="dark" على وسم html، مع ربط كافة ألوان التطبيق بمتغيرات CSS ديناميكية.',
      codeExample: `:root {
  --bg-color: #ffffff;
  --text-color: #0f172a;
}

[data-theme='dark'] {
  --bg-color: #0f172a;
  --text-color: #f8fafc;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.2s ease;
}`,
      commonMistakes: 'الاعتماد على حالة useState لتطبيق الثيم بعد اكتمال الـ render مما يسبب وميضاً ساطعاً مزعجاً عند كل تحميل.',
      followUp: 'كيف تستمع لتبديل نظام التشغيل بين الوضع الفاتح والليلي عبر window.matchMedia("(prefers-color-scheme: dark)")؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react', 'dark-mode', 'theming', 'css-variables'],
      docUrl: 'https://react.dev/learn'
    },
    {
      title: 'ما هو نمط Render Props وما هي استخداماته المعاصرة؟',
      shortAnswer: 'هو نمط يتم فيه تمرير دالة كـ prop (أو كـ children) للمكون، ويقوم المكون باستدعائها وتزويدها ببياناته الداخلية للتحكم في كيفية تصيير المخرجات.',
      detailedAnswer: 'كان هذا النمط وسيلة شائعة لمشاركة السلوك (مثل تتبع حركة الفأرة أو التحقق من التمرير) قبل ظهور الهوكس. على الرغم من أن الـ Custom Hooks غطت معظم حالاته، إلا أن Render Props لا تزال تستخدم بكفاءة في المكونات الافتراضية (Virtualizers) ومكتبات الرسوم البيانية لتخصيص رسم العناصر الفردية.',
      codeExample: `interface MouseTrackerProps {
  render: (mouse: { x: number; y: number }) => React.ReactNode;
}

function MouseTracker({ render }: MouseTrackerProps) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  return (
    <div onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}>
      {render(pos)}
    </div>
  );
}`,
      commonMistakes: 'تمرير دوال مجهولة مباشرة في كل render مما قد يمنع استفادة المكونات الفرعية من React.memo.',
      followUp: 'قارن بين نمط Render Props ونمط الـ Custom Hook المقابل في سهولة قراءة الكود واختباره.',
      difficulty: 'mid',
      importance: 'advanced',
      tags: ['react', 'render-props', 'patterns', 'design'],
      docUrl: 'https://react.dev/learn'
    },
    {
      title: 'كيف تتعامل مع التبعيات الدائرية (Circular Dependencies) في مشاريع ريأكت الضخمة؟',
      shortAnswer: 'تحدث عندما يستورد الملف A الملف B ويقوم الملف B باستيراد الملف A سواء بشكل مباشر أو غير مباشر؛ ونحلها بفصل الشيفرة المشتركة في ملف ثالث C أو استخدام Dynamic Imports.',
      detailedAnswer: 'تتسبب التبعيات الدائرية في أخطاء غامضة أثناء وقت التشغيل كظهور متغيرات بقيمة undefined أو انهيار دورة حياة المكونات، وتعرقل عمل أدوات التحزيم وتجزئة الكود. يمكن كشفها آلياً باستخدام أدوات مثل madge و eslint-plugin-import، وحلها بإعادة هيكلة المجلدات بحيث تعتمد الوحدات على تجريدات أدنى.',
      codeExample: `// حل التبعية الدائرية
// الملف المشترك types.ts
export interface User { id: string; name: string }

// المكون UserCard.tsx يستورد types.ts فقط
import { User } from './types';

// المكون UserList.tsx يستورد types.ts و UserCard.tsx دون عكس التبعية`,
      commonMistakes: 'استيراد مكون من ملف برميل (Barrel file - index.ts) داخل مكون آخر موجود في نفس المجلد.',
      followUp: 'كيف تكشف أداة Madge التبعيات الدائرية داخل خطوط الـ CI/CD قبل دمج الفروع؟',
      difficulty: 'senior',
      importance: 'advanced',
      tags: ['react', 'circular-dependency', 'architecture', 'bundling'],
      docUrl: 'https://react.dev/learn'
    },
    {
      title: 'ما هي استراتيجيات التعامل مع الـ Micro-frontends في ريأكت باستخدام Webpack Module Federation؟',
      shortAnswer: 'تسمح Module Federation لتطبيق ريأكت مستضيف (Host) بتحميل مكونات وواجهات منفصلة مبنية ومستضافة بشكل مستقل (Remotes) أثناء وقت التشغيل، مع مشاركة حزم مكتبات موحدة كـ React.',
      detailedAnswer: 'تتيح المعمارية لفرق العمل المتعددة في الشركات الضخمة نشر تطبيقاتهم دون الحاجة لإعادة تجميع التطبيق الرئيسي كاملاً. تضمن ميزة shared في Module Federation عدم تحميل React أو ReactDOM مرتين في الذاكرة، مع تحديد متطلبات التوافق الإصداري (Semantic Versioning) بين التطبيقات.',
      codeExample: `// تكوين Module Federation في webpack.config.js
new ModuleFederationPlugin({
  name: 'host_app',
  remotes: {
    checkout: 'checkoutApp@https://cdn.example.com/remoteEntry.js',
  },
  shared: {
    react: { singleton: true, requiredVersion: '^18.0.0' },
    'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
  },
});`,
      commonMistakes: 'عدم ضبط react كـ singleton، مما يؤدي لوجود نسختين من مكتبة ريأكت في المتصفح وانهيار كافة الـ Hooks.',
      followUp: 'كيف تتعامل مع أخطاء انقطاع الاتصال عند فشل تحميل أحد التطبيقات الفرعية (Remote failure) باستخدام Error Boundaries؟',
      difficulty: 'senior',
      importance: 'advanced',
      tags: ['react', 'micro-frontends', 'module-federation', 'webpack'],
      docUrl: 'https://react.dev/learn'
    },
    {
      title: 'كيف تطبق مبادئ البرمجة النظيفة (Clean Code) في تنظيم مجلدات وهيكلة ملفات ريأكت؟',
      shortAnswer: 'بتجميع الملفات حسب الميزة (Feature-based Folder Structure)، وجعل أسماء الملفات دالة على محتواها، وتجنب الملفات البرميلية الضخمة (Overused Barrel Files)، والالتزام بقاعدة 200 سطر للمكون.',
      detailedAnswer: 'التنظيم الحديث يبتعد عن المجلدات حسب النوع (مثل وضع كافة المكونات في مجلد components وكافة الـ hooks في مجلد hooks). بدلاً من ذلك، نجمع كل ميزة في مجلد مستقل يحتوي على المكون والـ hook الخاص به واختباراته وتنسيقاته، مما يسهل حذف الميزة أو نقلها أو صيانتها دون البحث عبر ملفات المشروع المشتتة.',
      codeExample: `// هيكل الميزات النظيف الموصى به
src/
  features/
    auth/
      components/LoginForm.tsx
      hooks/useAuth.ts
      api/login.ts
      types.ts
      index.ts // تصدير الواجهة العامة فقط
    billing/
      ...`,
      commonMistakes: 'تسمية الملفات بأسماء عامة مضللة مثل utils.ts أو helpers.ts حيث تتحول لسلة مهملات لكافة الأكواد غير المصنفة.',
      followUp: 'كيف تؤثر ملفات index.ts البرميلية سلباً على سرعة بناء واختبار وميزة Tree-Shaking في التطبيق؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react', 'clean-code', 'project-structure', 'best-practices'],
      docUrl: 'https://react.dev/learn'
    }
  ]
};

function main() {
  const outputFilePath = path.resolve(process.cwd(), 'src/content/react-questions.ts');

  let totalQuestions = 0;
  const questions: any[] = [];

  const difficultyMap: Record<string, "Junior" | "Mid" | "Senior"> = {
    junior: "Junior",
    mid: "Mid",
    senior: "Senior"
  };

  for (const topic of topics) {
    const topicRawQuestions = rawData[topic.id] || [];
    if (topicRawQuestions.length !== 10) {
      throw new Error(`Topic ${topic.id} has ${topicRawQuestions.length} questions, expected exactly 10!`);
    }

    topicRawQuestions.forEach((q, index) => {
      const numStr = String(index + 1).padStart(3, '0');
      const questionId = `${topic.prefix}-${numStr}`;
      const slugSuffix = q.tags.filter(t => t !== 'react').join('-') || 'concept';
      const slug = `react-${slugSuffix}-${numStr}`;

      questions.push({
        id: questionId,
        slug,
        trackId: 'react',
        topicIds: [topic.id],
        difficulty: difficultyMap[q.difficulty] || 'Mid',
        question: q.title,
        shortAnswer: q.shortAnswer,
        explanation: q.detailedAnswer,
        codeExample: q.codeExample,
        commonMistakes: [q.commonMistakes],
        followUpQuestions: [q.followUp],
        sources: [{ title: `${topic.name} Documentation`, url: q.docUrl }],
        lastReviewedAt: '2026-09-07'
      });
      totalQuestions++;
    });
  }

  console.log(`Generating React questions: ${totalQuestions}`);

  const fileHeader = `// Generated by scripts/build-react-questions.ts
import type { InterviewQuestion } from "./questions.ts";

export const reactBaseQuestions: Omit<InterviewQuestion, "translations">[] = `;

  const fileContent = `${fileHeader}${JSON.stringify(questions, null, 2)};\n`;

  fs.writeFileSync(outputFilePath, fileContent, 'utf-8');
  console.log(`Successfully generated ${outputFilePath} with ${totalQuestions} questions.`);
}

main();
