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
  { id: 'react-native-core', prefix: 'rncore', name: 'React Native Architecture & Bridge / New Architecture' },
  { id: 'react-native-components', prefix: 'rncomp', name: 'Core Components & Primitives' },
  { id: 'react-native-styling', prefix: 'rnstyle', name: 'Styling, Layout & Flexbox' },
  { id: 'react-native-navigation', prefix: 'rnnav', name: 'React Navigation & Screen Stacks' },
  { id: 'react-native-state-storage', prefix: 'rnstore', name: 'State & Local Storage (AsyncStorage, MMKV)' },
  { id: 'react-native-animations', prefix: 'rnanim', name: 'Animations & Gestures (Reanimated & RNGH)' },
  { id: 'react-native-device-native', prefix: 'rndev', name: 'Native Modules & Hardware APIs' },
  { id: 'react-native-performance', prefix: 'rnperf', name: 'Performance & Memory Optimization' },
  { id: 'react-native-expo', prefix: 'rnexpo', name: 'Expo Ecosystem & EAS' },
  { id: 'react-native-deployment', prefix: 'rndeploy', name: 'Release, App Stores & CI/CD' },
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
  'react-native-core': [
    {
      title: 'ما هي معمارية React Native التقليدية (The Bridge) وما هي الاختناقات الأدائية المرتبطة بها؟',
      shortAnswer: 'تعتمد المعمارية القديمة على جسر تسلسلي (Bridge) يتبادل رسائل JSON غير متزامنة ومجمعة بين خيط JavaScript وخيط Native (UI/Main Thread)؛ مما يسبب اختناقاً (Bottleneck) عند تمرير بيانات مكثفة.',
      detailedAnswer: 'يتألف النظام الكلاسيكي من ثلاثة خيوط رئيسية: خيط JavaScript، خيط Native/UI، وخيط Shadow Tree لحساب التخطيط عبر Yoga. الاتصال بين JS و Native كان يمر عبر الـ Bridge في هيئة سلاسل نصوص JSON غير متزامنة. عند التعامل مع حركات سريعة أو تمرير قوائم ضخمة، يزدحم الـ Bridge بالرسائل مما يؤدي لتأخر الاستجابة وسقوط الفريمات (Dropped Frames).',
      codeExample: `// تدفق البيانات القديم عبر الـ Bridge:
// [JS Thread] -> JSON.stringify(payload) -> [Asynchronous Bridge] -> JSON.parse -> [Native UI Thread]`,
      commonMistakes: 'الاعتقاد بأن المعمارية القديمة تحول كود JavaScript مباشرة إلى كود آلي من لغات Objective-C أو Java.',
      followUp: 'كيف أحدث محرك Hermes وواجهة JSI ثورة ألغت الحاجة لجسر الـ JSON بالكامل؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react-native', 'bridge', 'architecture', 'threads'],
      docUrl: 'https://reactnative.dev/docs/architecture-overview'
    },
    {
      title: 'ما هي الـ New Architecture في React Native وما هو دور الـ JSI (JavaScript Interface)؟',
      shortAnswer: 'الـ JSI هي طبقة برمجية وسيطة مكتوبة بـ C++ تسمح لخيط JavaScript بالاحتفاظ بمراجع مباشرة لكائنات C++/Native واستدعاء دوالها بشكل متزامن دون أي تسلسل JSON أو وسطاء.',
      detailedAnswer: 'تلغي المعمارية الجديدة الـ Bridge تماماً. باستخدام JSI، يمكن لمحرك الـ JS (مثل Hermes) استدعاء دوال النظام الأصلية مباشرة كأنها دوال JavaScript عادية مع وصول مشترك للذاكرة المشتركة (Shared Memory)، مما يرفع سرعة الاتصال إلى سرعات الكود الأصلي المباشر ويفتح الباب أمام استدعاءات متزامنة وغير متزامنة فائقة السرعة.',
      codeExample: `// مفهوم استدعاء C++ المباشر عبر JSI:
// في JavaScript:
// const result = nativeModule.fastSyncMethod(); // استدعاء فوري مباشر متزامن بدون Bridge!`,
      commonMistakes: 'الاعتقاد بأن JSI مخصص فقط لنظام iOS، في حين أنه مبني بلغة C++ ويعمل بالتساوي على iOS و Android.',
      followUp: 'كيف استفادت مكتبات الطرف الثالث مثل react-native-mmkv من JSI لتحقيق سرعات قراءة تفوق AsyncStorage بـ 30 ضعفاً؟',
      difficulty: 'senior',
      importance: 'essential',
      tags: ['react-native', 'jsi', 'new-architecture', 'c++'],
      docUrl: 'https://reactnative.dev/docs/the-new-architecture/landing-page'
    },
    {
      title: 'ما هو نظام Fabric وما الفرق بينه وبين نظام التصيير القديم في React Native؟',
      shortAnswer: 'نظام Fabric هو محرك التصيير الجديد (Renderer) المعتمد على C++، حيث يدمج مباشرة مع شجرة React 18 Concurrency ويوفر رسم متزامن لعناصر الواجهة وتكامل فوري مع Yoga.',
      detailedAnswer: 'في المحرك القديم، كان حساب التخطيط في Shadow Thread ينقل الأبعاد للـ Native UI عبر الـ Bridge مما يسبب وميضاً وتأخراً في الرسوم. في Fabric، تم توحيد كود الـ Shadow Tree والتخطيط بلغة C++ موحدة، وأصبح بالإمكان إنشاء شجرة عناصر الـ UI بشكل متزامن مع دعم كامل لـ Concurrent React وميزات مثل Suspense و Transitions.',
      codeExample: `// تسلسل Fabric الجديد:
// [React Component] -> [C++ Element Tree] -> [Yoga Layout C++] -> [Direct Host View Mutation]`,
      commonMistakes: 'الاعتقاد بأن تفعيل Fabric يتطلب إعادة كتابة كود شاشات JSX بالكامل، فالتغييرات تكمن في طبقة المكتبات والـ Native Modules.',
      followUp: 'كيف يمنع Fabric ظهور القفزات البيضاء المؤقتة (White Jumps) أثناء تمرير القوائم الطويلة بسرعة فائقة؟',
      difficulty: 'senior',
      importance: 'advanced',
      tags: ['react-native', 'fabric', 'renderer', 'c++'],
      docUrl: 'https://reactnative.dev/docs/the-new-architecture/fabric-renderer'
    },
    {
      title: 'ما هي الـ TurboModules وكيف تحسن من سرعة إقلاع التطبيق (Startup Time)؟',
      shortAnswer: 'هي نظام الوحدات الأصلية الجديد الذي يقوم بتحميل الوحدات بطريقة كسولة (Lazy Loading) عند أول استدعاء فقط بدلاً من تهيئتها دفعة واحدة عند إقلاع التطبيق كما كان يحدث سابقاً.',
      detailedAnswer: 'في المعمارية السابقة، كان يتم تحميل وتهيئة كافة الـ Native Modules المسجلة في التطبيق (الكاميرا، الموقع، البلوتوث) أثناء بدء التشغيل حتى لو لم يحتج المستخدم سوى شاشة تسجيل دخول بسيطة. باستخدام TurboModules و JSI، لا يتم حجز الذاكرة أو إنشاء الوحدة الأصلية إلا في اللحظة التي يستدعي فيها كود JS تلك الوحدة فعلياً.',
      codeExample: `// استيراد TurboModule يتم بإنشاء واجهة Typed Spec:
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  getDeviceModel(): string;
}

export default TurboModuleRegistry.getEnforcing<Spec>('DeviceDetails');`,
      commonMistakes: 'تطبيق أنماط التهيئة الثقيلة داخل دوال البناء (Constructors) لوحدات TurboModule بدلاً من تأجيلها للاستدعاء الفعلي.',
      followUp: 'ما هو دور أداة Codegen في توليد واجهات C++ و Java و Obj-C تلقائياً لـ TurboModules؟',
      difficulty: 'senior',
      importance: 'advanced',
      tags: ['react-native', 'turbomodules', 'lazy-loading', 'codegen'],
      docUrl: 'https://reactnative.dev/docs/the-new-architecture/turbomodules'
    },
    {
      title: 'ما هو دور محرك Hermes ولماذا أصبح المحرك الافتراضي في React Native؟',
      shortAnswer: 'هو محرك JavaScript مفتوح المصدر تم تحسينه خصيصاً لتطبيقات الهواتف، حيث يقوم بالترجمة المسبقة للكود إلى Bytecode أثناء الـ Build Time، مما يقلص زمن الإقلاع وحجم الحزمة واستهلاك الذاكرة.',
      detailedAnswer: 'خلافاً لمحركات مثل V8 أو JavaScriptCore التي تقوم بتفسير وترجمة الكود في وقت التشغيل (JIT Compilation) داخل جهاز المستخدم، يقوم Hermes بتحويل شفرة التطبيق بالكامل إلى Bytecode مسبق التجميع (AOT) أثناء البناء. ينتج عن ذلك إقلاع فوري للتطبيق (Faster TTI)، وتقليل استهلاك ذاكرة الوصول العشوائي (RAM)، وتصغير حجم ملفات الـ APK/IPA.',
      codeExample: `// تفعيل Hermes في android/app/build.gradle:
// project.ext.react = [
//   enableHermes: true
// ]`,
      commonMistakes: 'الاعتماد على ميزات جافاسكربت حديثة جداً أو تعبيرات RegExp متقدمة دون التحقق من دعم محرك Hermes لها.',
      followUp: 'كيف يتعامل Hermes مع استهلاك الذاكرة وتفعيل الـ Garbage Collector الخفيف مقارنة بـ JSC؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react-native', 'hermes', 'bytecode', 'performance'],
      docUrl: 'https://reactnative.dev/docs/hermes'
    },
    {
      title: 'ما هي خيوط المعالجة الرئيسية (Threads) في تطبيق React Native وكيف يتم التوزيع بينها؟',
      shortAnswer: 'يتكون التطبيق من ثلاثة خيوط أساسية: Main/UI Thread (لرسم الشاشة واللمس)، و JS Thread (لتشغيل كود المنطق وريأكت)، و Shadow Thread (لحساب أبعاد ومواقع العناصر بمحرك Yoga).',
      detailedAnswer: 'يعمل كود JavaScript بالكامل داخل خيط JS Thread المستقل. عندما يتغير التخطيط، يتولى Shadow Thread الحسابات الهندسية دون تعطيل الـ JS Thread. بينما يظل Main Thread حراً لمعالجة تفاعلات اللمس والرسوم الأصلية بمعدل 60/120 إطار في الثانية دون تقطيع، ما لم يتم إرهاق خيط الـ UI بحسابات ثقيلة.',
      codeExample: `// مثال مفاهيمي لتوزيع المهام بين الخيوط:
// 1. UI Thread: يلتقط لمسة الشاشة (Gesture)
// 2. JS Thread: يحسب الـ State الجديد ويطلب تعديل التخطيط
// 3. Shadow Thread: يحسب مواقع العناصر وأبعادها بدقة
// 4. UI Thread: يرسم المكونات في موضعها النهائي على الشاشة`,
      commonMistakes: 'تشغيل دوال متزامنة ثقيلة في كود الجافاسكربت مما يوقف استجابة الـ JS Thread لأحداث الواجهة.',
      followUp: 'كيف تتأكد من فك ارتباط الحركات والأنيميشن عن خيط JS Thread باستخدام useNativeDriver؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react-native', 'multithreading', 'ui-thread', 'yoga'],
      docUrl: 'https://reactnative.dev/docs/performance#javascript-thread-execution'
    },
    {
      title: 'ما هي أداة Codegen في معمارية React Native الجديدة ولماذا تعد إلزامية؟',
      shortAnswer: 'هي أداة تقوم بقراءة ملفات الـ TypeScript/Flow Types وإنشاء كود C++ و Java و Swift/Obj-C المطابق تلقائياً لضمان توافق الأنواع الكامل ومنع أخطاء النوع بين JS والـ Native.',
      detailedAnswer: 'تمنع أداة Codegen الأعطال الناتجة عن عدم تطابق المعاملات بين لغة الـ JavaScript والشيفرة الأصلية. بدلاً من التحقق اليدوي البطيء من معلمات الـ Bridge، تقوم Codegen أثناء عملية الـ Build بإنشاء كود وسيط C++ قوي وصارم يضمن أمان الأنواع على كلا الطرفين قبل تشغيل التطبيق.',
      codeExample: `// تعريف الواجهة التي تقرأها أداة Codegen:
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  multiply(a: number, b: number): Promise<number>;
}

export default TurboModuleRegistry.get<Spec>('Calculator');`,
      commonMistakes: 'استخدام أنواع غير مدعومة مثل Any أو Union types معقدة في ملف مواصفات Codegen.',
      followUp: 'كيف يتم دمج سكربت Codegen في حلقة البناء لنظامي Gradle في أندرويد و CocoaPods في iOS؟',
      difficulty: 'senior',
      importance: 'advanced',
      tags: ['react-native', 'codegen', 'new-architecture', 'type-safety'],
      docUrl: 'https://reactnative.dev/docs/the-new-architecture/what-is-codegen'
    },
    {
      title: 'ما الفرق بين React Native CLI الخالص (Bare Workflow) و Expo Managed Workflow؟',
      shortAnswer: 'المسار الخالص (Bare) يتيح وصولاً كاملاً وتعديلاً مباشراً لمجلدي android و ios وكود Native، بينما Expo Managed يخفي المجلدات الأصلية ويدير البناء والتحديثات سحابياً عبر Prebuild و Config Plugins.',
      detailedAnswer: 'يوفر الـ Bare Workflow مرونة مطلقة لكتابة كود أصلي مخصص لكنه يتطلب صيانة دورية لملفات البناء و Xcode و Gradle. بينما في Expo المعاصر، بفضل ميزة Continuous Native Generation (CNG) واستخدام Config Plugins، يمكن الوصول لأي مكتبة أصلية بدون كتابة كود يدوي في مجلدي أندرويد و iOS، مما يوفر سرعة إنتاجية فائقة وترقيات سلسة.',
      codeExample: `// تخصيص إعدادات Native في Expo دون لمس مجلد أندرويد/آيفون (app.json):
{
  "expo": {
    "name": "MyApp",
    "plugins": [
      ["expo-camera", { "cameraPermission": "السماح بالوصول للكاميرا لالتقاط الصور" }]
    ]
  }
}`,
      commonMistakes: 'الاعتقاد القديم بأن Expo لا يدعم مكتبات الـ Native المخصصة أو البلوتوث كما كان في 2018.',
      followUp: 'كيف يعمل أمر npx expo prebuild في توليد مجلدي android و ios بصورة نظيفة وقابلة للإعادة؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react-native', 'expo', 'bare-workflow', 'prebuild'],
      docUrl: 'https://docs.expo.dev/bare/overview/'
    },
    {
      title: 'كيف يتم الربط بين مكتبة Yoga Layout ونظام التصيير في React Native؟',
      shortAnswer: 'مكتبة Yoga هي محرك تخطيط مفتوح المصدر مكتوب بـ C++، يقوم بترجمة خصائص الـ Flexbox إلى إحداثيات بكسل دقيقة (x, y, width, height) يفهمها نظاما iOS و Android.',
      detailedAnswer: 'نظراً لأن أنظمة iOS و Android لا تدعم Flexbox في واجهاتها الأصلية، طور فيسبوك محرك Yoga ليقوم بحساب التخطيطات المعقدة بسرعة C++ فائقة داخل الـ Shadow Thread، وإرسال المواقع الهندسية النهائية إلى عناصر UIView في iOS وعناصر ViewGroup في أندرويد.',
      codeExample: `// كود الـ Flexbox في ريأكت نيتف يتم حسابه بواسطة Yoga C++:
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
});`,
      commonMistakes: 'الاعتقاد بأن متصفح ويب مصغر (WebView) هو المسؤول عن حساب وتطبيق تنسيقات Flexbox.',
      followUp: 'لماذا يكون الاتجاه الافتراضي لـ flexDirection في React Native هو column وليس row كما في متصفحات الويب؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react-native', 'yoga', 'flexbox', 'layout-engine'],
      docUrl: 'https://reactnative.dev/docs/flexbox'
    },
    {
      title: 'كيف تتعامل مع معضلة הـ App State (Active, Background, Inactive) وحفظ الطاقة؟',
      shortAnswer: 'باستخدام وحدة AppState للاستماع إلى تحولات حالة التطبيق بين العمل في الواجهة (active) أو الانتقال للخلفية (background) لإيقاف المؤقتات والتتبع المكلف للحفاظ على بطارية الهاتف.',
      detailedAnswer: 'عندما يغادر المستخدم التطبيق أو يستقبل مكالمة هاتفية، ينتقل التطبيق إلى وضع "inactive" ثم "background". من الضروري إيقاف اشتراكات تحديد الموقع (GPS)، وتجميد مؤقتات setInterval، وتشفير البيانات الحساسة على الشاشة لمنع ظهورها في لقطات مبدل التطبيقات (App Switcher).',
      codeExample: `import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';

function useAppStateListener() {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (nextState === 'background') {
        // إيقاف خدمات التتبع المكلفة وحفظ المسودات فوراً
        stopLiveTracking();
      }
    });

    return () => subscription.remove();
  }, []);
}`,
      commonMistakes: 'الاستمرار في استهلاك طلبات الـ Polling وتحديد الموقع بعد انتقال التطبيق إلى وضع الخلفية مما يسبب استنزاف البطارية وإغلاق النظام للتطبيق قسراً.',
      followUp: 'ما الفرق بين وضع background و inactive على أجهزة نظام iOS؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react-native', 'app-state', 'lifecycle', 'battery-saving'],
      docUrl: 'https://reactnative.dev/docs/appstate'
    }
  ],
  'react-native-components': [
    {
      title: 'لماذا يعتبر FlatList خياراً أفضل بكثير من ScrollView مع القوائم الطويلة في React Native؟',
      shortAnswer: 'لأن FlatList يعتمد على التحميل الكسول وإعادة تدوير العناصر المرئية فقط (Virtualization)، بينما ScrollView يقوم بتصيير وحجز ذاكرة لكافة عناصر القائمة دفعة واحدة.',
      detailedAnswer: 'إذا كانت قائمتك تحتوي على 500 عنصر واستخدمت ScrollView، سيحاول النظام إنشاء 500 عقدة Native فوراً مما يستهلك مئات الميجابايتات ويجمد الشاشة. FlatList يقوم برسم العناصر الظاهرة على الشاشة فقط وهامش صغير حولها، ويتخلص من العناصر البعيدة عن مجال الرؤية لتوفير الذاكرة وسلاسة التمرير بمعدل 60 إطاراً في الثانية.',
      codeExample: `import { FlatList, Text, View } from 'react-native';

function ProductList({ items }: { items: { id: string; name: string }[] }) {
  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={{ padding: 16 }}>
          <Text>{item.name}</Text>
        </View>
      )}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={5}
    />
  );
}`,
      commonMistakes: 'استخدام دوال مجهولة مدمجة (Inline Arrow Functions) داخل renderItem مما يسبب إعادة تصيير كافة الصفوف عند كل تحديث.',
      followUp: 'ما هي مكتبة FlashList المطورة من Shopify ولماذا تتفوق على FlatList بـ 5 أضعاف في سرعة إعادة التدوير؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react-native', 'flatlist', 'scrollview', 'virtualization'],
      docUrl: 'https://reactnative.dev/docs/flatlist'
    },
    {
      title: 'ما هي أهم خصائص ضبط أداء FlatList (مثل windowSize و initialNumToRender و getItemLayout)؟',
      shortAnswer: 'خاصية getItemLayout تلغي الحاجة لحساب أبعاد العناصر ديناميكياً مما يسرع القفز المباشر، و windowSize تحدد عدد الشاشات المحفوظة خارج مجال الرؤية، و initialNumToRender تحدد العناصر المرسومة أولاً.',
      detailedAnswer: 'لحساب مواضع العناصر بدقة، يحتاج FlatList لقياس كل عنصر بعد رسمه. إذا كانت العناصر ذات ارتفاع ثابت، فإن توفير getItemLayout يلغي هذه الحسابات تماماً ويوفر قفزاً فورياً وسلساً عبر scrollToItem. تقليل windowSize يقلل استهلاك الرام، بينما ضبط initialNumToRender بحجم الشاشة الأولى يحسن زمن الإقلاع الأولي.',
      codeExample: `const ITEM_HEIGHT = 70;

const getItemLayout = (_: any, index: number) => ({
  length: ITEM_HEIGHT,
  offset: ITEM_HEIGHT * index,
  index,
});

<FlatList
  data={users}
  getItemLayout={getItemLayout}
  initialNumToRender={8}
  windowSize={3}
  removeClippedSubviews={true}
  renderItem={renderRow}
/>;`,
      commonMistakes: 'استخدام getItemLayout عندما تكون العناصر ذات أبعاد وارتفاعات متغيرة وديناميكية، مما يسبب تداخلاً وتشوهاً بصرياً في القائمة.',
      followUp: 'كيف تعمل خاصية removeClippedSubviews وما هي مخاطرها على أجهزة أندرويد في بعض سيناريوهات الحركات السريعة؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react-native', 'flatlist-optimization', 'getitemlayout', 'windowsize'],
      docUrl: 'https://reactnative.dev/docs/flatlist#getitemlayout'
    },
    {
      title: 'ما الفرق بين TouchableOpacity و TouchableHighlight و Pressable ومتى نعتمد Pressable دائماً؟',
      shortAnswer: 'مكون Pressable هو المكون الأحدث والأكثر مرونة ودقة، حيث يوفر وصولاً دقيقاً لحالات الضغط المتعددة (Pressed, Hovered, Focused) وتأخير الضغط الطويل دون تعقيدات التغليف القديمة.',
      detailedAnswer: 'المكونات القديمة مثل TouchableOpacity كانت مجرد أغلفة تعتمد على أنظمة تحريك محددة مسبقاً (تعديل الشفافية opacity فقط). بينما صُمم Pressable ليكون الأساس الموحد لكافة التفاعلات اللمسية في ريأكت نيتف، حيث يستقبل دالة لتنسيق العنصر بناءً على حالة { pressed } بدقة فائقة ويدعم سمات إمكانية الوصول والتفاعل العصري.',
      codeExample: `import { Pressable, Text, StyleSheet } from 'react-native';

function ActionButton({ onPress, title }: { onPress: () => void; title: string }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { opacity: pressed ? 0.7 : 1.0, transform: [{ scale: pressed ? 0.98 : 1.0 }] }
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}`,
      commonMistakes: 'استخدام TouchableOpacity لتأثيرات معقدة تتطلب تعديل خصائص متعددة غير الشفافية (مثل تغيير لون الخلفية أو الحجم).',
      followUp: 'ما هي خاصية hitSlop في Pressable وكيف تحسن من سهولة النقر على الأيقونات الصغيرة في الهواتف؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react-native', 'pressable', 'touchableopacity', 'gestures'],
      docUrl: 'https://reactnative.dev/docs/pressable'
    },
    {
      title: 'كيف يعمل مكون Image في React Native وما هي قيود ومشاكل الكاش الشائعة معه؟',
      shortAnswer: 'يقوم Image بتحميل وعرض الصور المحلية والشبكية؛ لكنه يعاني من ضعف إمكانيات الكاش على أجهزة أندرويد وتكرار إعادة التنزيل والوميض مقارنة بمكتبات متخصصة مثل expo-image.',
      detailedAnswer: 'يتطلب مكون Image تمرير كائن { uri: "..." } للصور الشبكية و require("./img.png") للصور المحلية. الكاش الافتراضي لنظام التشغيل غير كافٍ للتطبيقات التي تعتمد على الصور بكثافة (مثل منصات التواصل). لذلك ينصح المجتمع باستخدام expo-image أو react-native-fast-image التي تدعم صيغ WebP و AVIF وتوفر كاش قوي على القرص وإظهار بلور مؤقت (Blurhash).',
      codeExample: `import { Image, StyleSheet } from 'react-native';

function ProfileAvatar({ avatarUrl }: { avatarUrl: string }) {
  return (
    <Image
      source={{ uri: avatarUrl }}
      style={styles.avatar}
      resizeMode="cover"
      defaultSource={require('./assets/placeholder.png')} // لـ iOS أثناء التحميل
    />
  );
}`,
      commonMistakes: 'نسيان تحديد عرض (width) وارتفاع (height) صريحين للصور الشبكية، مما يمنع ظهورها نهائياً.',
      followUp: 'لماذا تعتبر مكتبة expo-image الخيار القياسي الحديث لكافة مشاريع React Native المعاصرة؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react-native', 'image', 'caching', 'expo-image'],
      docUrl: 'https://reactnative.dev/docs/image'
    },
    {
      title: 'كيف تستخدم مكون SectionList لعرض البيانات المقسمة إلى مجموعات مصنفة مع رؤوس ثابتة (Sticky Headers)؟',
      shortAnswer: 'يستخدم SectionList لعرض بيانات هيكلية مقسمة إلى أقسام (Sections) لكل منها عنوان ومجموعة عناصر، مع دعم تثبيت الترويسة أعلى الشاشة تلقائياً أثناء التمرير.',
      detailedAnswer: 'يستقبل SectionList مصفوفة من كائنات الأقسام بصيغة [{ title: "...", data: [...] }]، ويوفر خاصية renderSectionHeader لرسم ترويسة كل قسم، وخاصية renderItem لرسم العناصر الفردية. خاصية stickySectionHeadersEnabled تفعل التثبيت التلقائي للعنوان حتى انتهاء القسم.',
      codeExample: `import { SectionList, Text, View } from 'react-native';

const SECTIONS = [
  { title: 'أ', data: ['أحمد', 'أمجد', 'أيمن'] },
  { title: 'ب', data: ['باسم', 'براء', 'بلال'] }
];

function ContactsList() {
  return (
    <SectionList
      sections={SECTIONS}
      keyExtractor={(item, index) => item + index}
      renderItem={({ item }) => <Text style={{ padding: 12 }}>{item}</Text>}
      renderSectionHeader={({ section: { title } }) => (
        <View style={{ backgroundColor: '#eee', padding: 8 }}>
          <Text style={{ fontWeight: 'bold' }}>{title}</Text>
        </View>
      )}
      stickySectionHeadersEnabled={true}
    />
  );
}`,
      commonMistakes: 'تمرير مصفوفة مسطحة بدلاً من الهيكل الإلزامي للأقسام المتضمن خاصية data كمصفوفة فرعية.',
      followUp: 'كيف تخصص خلفية الترويسة المثبتة لتفادي شفافية المحتوى الذي يمر خلفها أثناء التمرير؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react-native', 'sectionlist', 'sticky-headers', 'lists'],
      docUrl: 'https://reactnative.dev/docs/sectionlist'
    },
    {
      title: 'كيف تتعامل مع مشكلة حجب لوحة المفاتيح للمدخلات باستخدام KeyboardAvoidingView؟',
      shortAnswer: 'نغلف حقول الإدخال بمكون KeyboardAvoidingView ونحدد خاصية behavior المناسبة ("padding" لنظام iOS و "height" أو التعديل في AndroidManifest لأندرويد).',
      detailedAnswer: 'عند فتح لوحة المفاتيح الافتراضية، فإنها تغطي الجزء السفلي من الشاشة وقد تحجب حقل الإدخال الذي يكتب فيه المستخدم. يوفر KeyboardAvoidingView إمكانية ضبط التمرير تلقائياً ورفع الحاوية للأعلى بمقدار ارتفاع لوحة المفاتيح. في المشاريع الكبيرة غالباً ما تستخدم مكتبات متطورة مثل react-native-keyboard-controller لتجربة أكثر ثباتاً.',
      codeExample: `import { KeyboardAvoidingView, Platform, TextInput, StyleSheet } from 'react-native';

function LoginForm() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <TextInput placeholder="اسم المستخدم" style={styles.input} />
      <TextInput placeholder="كلمة المرور" secureTextEntry style={styles.input} />
    </KeyboardAvoidingView>
  );
}`,
      commonMistakes: 'استخدام behavior="padding" على أجهزة أندرويد دون داعٍ، حيث يتكفل نظام أندرويد بتعديل الشاشة افتراضياً عبر windowSoftInputMode="adjustResize".',
      followUp: 'كيف تتكامل مكتبة react-native-keyboard-aware-scroll-view لحل مشكلات النماذج الطويلة؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react-native', 'keyboardavoidingview', 'forms', 'inputs'],
      docUrl: 'https://reactnative.dev/docs/keyboardavoidingview'
    },
    {
      title: 'ما هي الـ Modal في React Native وكيف يتم التعامل مع النوافذ المنبثقة بشكل سليم؟',
      shortAnswer: 'مكون Modal يعرض محتوى في نافذة تطفو فوق شاشة التطبيق الحالية، ويعتمد على وحدات النظام الأصلية مع دعم حركات الظهور والتلاشي وإغلاق مفتاح الرجوع في أندرويد.',
      detailedAnswer: 'يوفر Modal خصائص مثل animationType ("slide" أو "fade")، و transparent لجعل الخلفية شبه شفافة، وخاصية onRequestClose الإلزامية للتعامل مع نقر المستخدم على زر الرجوع الفعلي في هواتف أندرويد. في أجهزة iOS الحديثة، يتم استخدام Presentation Controllers لتطبيق نمط البطاقات المنسدلة (Page Sheets).',
      codeExample: `import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';

function ConfirmModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose} // ضروري لأجهزة أندرويد
    >
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          <Text>هل أنت متأكد؟</Text>
          <Pressable onPress={onClose}><Text>إلغاء</Text></Pressable>
        </View>
      </View>
    </Modal>
  );
}`,
      commonMistakes: 'نسيان توفير خاصية onRequestClose مما يجعل زر الرجوع في أندرويد غير مستجيب تماماً أثناء فتح الـ Modal.',
      followUp: 'لماذا يفضل الكثير من المطورين استخدام BottomSheet القائمة على الإيماءات (مثل @gorhom/bottom-sheet) كبديل للـ Modal التقليدي؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react-native', 'modal', 'overlays', 'android-back'],
      docUrl: 'https://reactnative.dev/docs/modal'
    },
    {
      title: 'ما هو مكون SafeAreaView وكيف تطور في React Native وتكامله مع react-native-safe-area-context؟',
      shortAnswer: 'يضمن SafeAreaView عدم تغطية المحتوى بواسطة نتوءات الشاشة (Notches)، والجزر التفاعلية (Dynamic Island)، وزوايا الشاشات المستديرة وأشرطة التنقل السفلية.',
      detailedAnswer: 'يعمل SafeAreaView المدمج فقط على iOS وبطريقة محدودة. لذلك أصبح المعيار المعتمد في المنظومة هو مكتبة react-native-safe-area-context، حيث توفر SafeAreaProvider وخطاف useSafeAreaInsets() لحساب الهوامش الدقيقة (top, bottom, left, right) وتطبيقها بسلاسة على كافة أنظمة وتشعبات الأجهزة مع دعم الرسوم.',
      codeExample: `import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';

function CustomHeader() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top, backgroundColor: '#6200ee' }}>
      <Text style={{ color: '#fff', fontSize: 18, padding: 16 }}>عنوان الشاشة</Text>
    </View>
  );
}`,
      commonMistakes: 'استخدام SafeAreaView المدمج القديم وتوقع عمله التلقائي على نتوءات كاميرات هواتف أندرويد الحديثة.',
      followUp: 'كيف تتأكد من تغليف شجرة التطبيق بالكامل داخل <SafeAreaProvider> عند نقطة الإقلاع الأساسية؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react-native', 'safeareaview', 'notch', 'dynamic-island'],
      docUrl: 'https://reactnative.dev/docs/safeareaview'
    },
    {
      title: 'كيف تدير مدخلات النصوص المتعددة (TextInput) وحركات التبديل بين الحقول بالـ Focus؟',
      shortAnswer: 'باستخدام الـ Refs لربط عناصر TextInput واستدعاء .focus() على الحقل التالي عند الضغط على زر الإدخال (onSubmitEditing) في لوحة المفاتيح مع تحديد returnKeyType="next".',
      detailedAnswer: 'لتحسين تجربة إدخال المستخدم، نقوم بتعريف كائن ref لكل حقل. عند كتابة البريد والنقر على زر الانتقال في الكيبورد، نقوم برمجياً بنقل مؤشر الكتابة مباشرة لحقل كلمة المرور، مع ضبط نوع لوحة المفاتيح المناسب (keyboardType="email-address" أو "numeric") وتعطيل التصحيح التلقائي للحقول الحساسة.',
      codeExample: `function Form() {
  const passwordRef = useRef<TextInput>(null);

  return (
    <View>
      <TextInput
        placeholder="البريد الإلكتروني"
        returnKeyType="next"
        keyboardType="email-address"
        autoCapitalize="none"
        onSubmitEditing={() => passwordRef.current?.focus()}
      />
      <TextInput
        ref={passwordRef}
        placeholder="كلمة المرور"
        secureTextEntry
        returnKeyType="done"
      />
    </View>
  );
}`,
      commonMistakes: 'عدم تعطيل autoCorrect و autoCapitalize في حقول البريد الإلكتروني وكلمات المرور مما يربك المستخدم.',
      followUp: 'كيف تضبط خاصية textContentType لتمكين الملء التلقائي لكلمات المرور ورموز الـ OTP من الرسائل؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react-native', 'textinput', 'focus', 'keyboard-ux'],
      docUrl: 'https://reactnative.dev/docs/textinput'
    },
    {
      title: 'ما الفرق بين مكون Switch ومكون ActivityIndicator وكيف تخصص مظهرهما عبر المنصتين؟',
      shortAnswer: 'مكون Switch يعرض زر تبديل منطقي (On/Off) أصلي لنظام التشغيل، بينما ActivityIndicator يعرض سبينر تحميل دائري؛ وكلاهما يدعم تخصيص الألوان والحجم ليتناسب مع هوية التطبيق.',
      detailedAnswer: 'يستخدم Switch خصائص مثل trackColor و thumbColor لتوحيد ألوان المفتاح بين iOS وأندرويد مع الحفاظ على الرسوم الحركية الخاصة بكل نظام. بينما يقبل ActivityIndicator أحجام "small" أو "large" مع خاصية color لتغيير لون الدائرة المتحركة بما يتناسب مع ثيم الشاشة الحالي.',
      codeExample: `import { Switch, ActivityIndicator, View } from 'react-native';

function SettingsItem({ enabled, onToggle, loading }: { enabled: boolean; onToggle: () => void; loading: boolean }) {
  if (loading) {
    return <ActivityIndicator size="small" color="#0066cc" />;
  }

  return (
    <Switch
      value={enabled}
      onValueChange={onToggle}
      trackColor={{ false: '#767577', true: '#81b0ff' }}
      thumbColor={enabled ? '#0066cc' : '#f4f3f4'}
    />
  );
}`,
      commonMistakes: 'محاولة تمرير قيم بكسل رقمية عشوائية لخاصية size في ActivityIndicator، حيث تقبل فقط "small" أو "large" في النظام القياسي.',
      followUp: 'كيف تنشئ مؤشر تحميل مخصص يعتمد على SVG أو Lottie animations للهويات البصرية المتقدمة؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react-native', 'switch', 'activityindicator', 'primitives'],
      docUrl: 'https://reactnative.dev/docs/switch'
    }
  ],
  'react-native-styling': [
    {
      title: 'ما هي الفروقات الرئيسية بين CSS على المتصفح ونظام التنسيق في React Native؟',
      shortAnswer: 'في React Native لا توجد ملفات CSS تقليدية، وتكتب الخصائص بصيغة camelCase ككائنات JavaScript، وتدعم Flexbox فقط بدون Grid أو float، ويكون flexDirection الافتراضي column، وتكون كافة الأبعاد بلا وحدات (Density-independent Pixels).',
      detailedAnswer: 'لا يتعامل محرك Yoga مع محددات الـ CSS (Selectors مثل .class أو #id) أو التوريث (Inheritance) التلقائي للتنسيقات فيما عدا النصوص المتداخلة داخل وسم <Text>. كافة الأبعاد تعتبر بوحدات dp (نظام النقطة المستقلة عن الكثافة)، ولا توجد وسوم مثل <div> بل يتم استخدام <View> و <Text> مع كائنات التنسيق الصريحة.',
      codeExample: `// مقارنة الصيغة:
// CSS: background-color: #fff; margin-top: 10px;
// React Native:
const styles = StyleSheet.create({
  box: {
    backgroundColor: '#ffffff',
    marginTop: 10,
    borderRadius: 8,
  }
});`,
      commonMistakes: 'كتابة وحدات قياس مثل "px" أو "rem" أو "em" داخل التنسيقات الرقمية، مما يؤدي لخطأ فادح في التشغيل.',
      followUp: 'لماذا تورث عناصر <Text> المتداخلة خصائص الخط من بعضها البعض بينما لا تورث عناصر <View> أي تنسيق أبداً؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react-native', 'styling', 'css-differences', 'flexbox'],
      docUrl: 'https://reactnative.dev/docs/style'
    },
    {
      title: 'لماذا يعتبر StyleSheet.create مفضلاً على استخدام Inline Styles المباشرة؟',
      shortAnswer: 'لأنه يتحقق من صحة أسماء وقيم التنسيقات عند الإنشاء، ويوفر أمان الأنواع في TypeScript، ويرسل التنسيقات مرة واحدة عبر الذاكرة الأصلية لربطها بمعرفات رقمية ثابتة (IDs) بدلاً من إنشاء كائنات جديدة في كل دورة تصيير.',
      detailedAnswer: 'كتابة style={{ padding: 16 }} مباشرة داخل JSX تؤدي إلى إنشاء كائن JavaScript جديد تماماً في كل مرة يتم فيها تصيير المكون. هذا يثقل عمل الـ Garbage Collector ويفشل مقارنة الفحص السطحي للـ Props. يضمن StyleSheet.create تجميع التنسيقات وثبات مراجعها وتسهيل قراءتها وتنظيمها خارج الـ JSX.',
      codeExample: `import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  }
});

function Card() {
  return <View style={styles.card} />;
}`,
      commonMistakes: 'إعادة إنشاء StyleSheet.create داخل جسم دالة المكون بدلاً من وضعها خارج نطاق الدالة في أسفل الملف.',
      followUp: 'متى نضطر لاستخدام Inline Styles لتطبيق قيم متغيرة ديناميكياً صادرة من Props أو حسابات آنية؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react-native', 'stylesheet', 'performance', 'inline-styles'],
      docUrl: 'https://reactnative.dev/docs/stylesheet'
    },
    {
      title: 'كيف تتعامل مع تصميم واجهات متجاوبة (Responsive Layouts) لمختلف أحجام الهواتف والتابلت؟',
      shortAnswer: 'باستخدام useWindowDimensions لمراقبة تغييرات الحجم وتدوير الشاشة، مقترنة بنسب Flexbox المئوية والمكتبات المساعدة لحساب مقاييس متناسبة (Scaling utilities).',
      detailedAnswer: 'تختلف مقاسات الشاشات من هواتف صغيرة 4.7 إنش إلى أجهزة تابلت 12.9 إنش. يوفر useWindowDimensions قراءات فورية لـ width و height ويتحدث تلقائياً عند تدوير الجهاز. يتم استخدام نقاط توقف (Breakpoints) لتحديد هل الجهاز هاتف أم لوحي وتغيير اتجاه العرض أو عدد الأعمدة في القوائم تبعاً لذلك.',
      codeExample: `import { useWindowDimensions, View, StyleSheet } from 'react-native';

function ResponsiveContainer({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <View style={[styles.base, isTablet ? styles.tabletLayout : styles.phoneLayout]}>
      {children}
    </View>
  );
}`,
      commonMistakes: 'استخدام Dimensions.get("window") الثابت خارج المكونات مما يمنع تحديث التخطيط عند تدوير الهاتف (Orientation Change) أو في وضع الشاشات المقسمة.',
      followUp: 'ما الفرق بين الأبعاد الناتجة عن "window" والأبعاد الناتجة عن "screen" في أجهزة أندرويد؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react-native', 'responsive-design', 'usewindowdimensions', 'tablet'],
      docUrl: 'https://reactnative.dev/docs/usewindowdimensions'
    },
    {
      title: 'كيف يتم التعامل مع الظلال (Shadows & Elevation) بين نظامي iOS و Android؟',
      shortAnswer: 'نظام iOS يستخدم خصائص shadowColor و shadowOffset و shadowOpacity و shadowRadius، بينما يستخدم أندرويد خاصية واحدة مدمجة هي elevation ترتبط بارتفاع العنصر عن الخلفية.',
      detailedAnswer: 'بسبب اختلاف محركات الرسم بين المنصتين، لا يفهم نظام أندرويد خصائص shadow* الخاصة بـ iOS، بينما يفهم خاصية elevation التي تعتمد على عمق Material Design. لإنشاء ظل متناسق عبر المنصتين، ندمج خصائص المنصتين معاً في كائن التنسيق، أو نلجأ إلى مكتبات متطورة مثل react-native-drop-shadow لتوليد ظلال متطابقة بصرياً.',
      codeExample: `const styles = StyleSheet.create({
  cardShadow: {
    backgroundColor: '#fff',
    // إعدادات الظل لنظام iOS:
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    // إعدادات الظل لنظام Android:
    elevation: 5,
  }
});`,
      commonMistakes: 'تطبيق خاصية elevation في أندرويد على عنصر ليس له backgroundColor صريح، مما يمنع ظهور الظل أو يشوه حوافه.',
      followUp: 'كيف تتأكد من ظهور الظلال على عناصر تضع خاصية overflow: "hidden" لقص الحواف الدائرية؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react-native', 'shadows', 'elevation', 'cross-platform'],
      docUrl: 'https://reactnative.dev/docs/shadow-props'
    },
    {
      title: 'كيف تدعم وتخصص الخطوط المخصصة (Custom Fonts) والتعامل مع مشاكل الارتفاع والـ Line Height؟',
      shortAnswer: 'بإضافة ملفات الخطوط (TTF/OTF) وربطها عبر Expo Font أو مجلد assets في البناء الخالص، واستخدام اسم الخط الصحيح في fontFamily، مع ضبط lineHeight بما يناسب تكبير النظام.',
      detailedAnswer: 'تتطلب الخطوط تسمية دقيقة تتطابق مع اسم الخط المدمج في نظام التشغيل (PostScript Name على iOS واسم الملف على Android). تختلف أبعاد الخطوط العربية أحياناً مسببة قصاً في أطراف الأحرف العلوية والسفلية، مما يستوجب ضبط includeFontPadding: false على أندرويد مع حساب lineHeight كافٍ.',
      codeExample: `// استخدام الخط المخصص بأمان في React Native
const styles = StyleSheet.create({
  arabicHeading: {
    fontFamily: 'Cairo-Bold',
    fontSize: 20,
    lineHeight: 30, // ضروري لمنع قص الأحرف العربية
    textAlign: 'right',
  }
});`,
      commonMistakes: 'الجمع بين fontFamily لخط مخصص مع خاصية fontWeight: "bold" مما يدفع النظام للبحث عن نمط غير موجود واستبداله بخط النظام الافتراضي (Fall back).',
      followUp: 'لماذا يجب تفعيل includeFontPadding: false في أندرويد لضبط محاذاة النصوص عمودياً داخل الأزرار؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react-native', 'custom-fonts', 'line-height', 'typography'],
      docUrl: 'https://reactnative.dev/docs/text#style'
    },
    {
      title: 'كيف تدعم اتجاه الكتابة من اليمين لليسار (RTL Support) وتخطيط الواجهات للغة العربية؟',
      shortAnswer: 'باستخدام وحدة I18nManager وخصائص Flexbox المحايدة للاتجاه مثل marginStart و marginEnd و paddingStart و paddingEnd بدلاً من left و right.',
      detailedAnswer: 'عند التحويل للغة العربية، ينعكس اتجاه التطبيق بالكامل ليصبح من اليمين لليسار. استخدام خصائص left و right الثابتة يمنع انعكاس التصميم تلقائياً ويسبب تشوهاً. استخدام start و end يجعل النظام يعكس الهوامش والمحاذاة تلقائياً بناءً على اتجاه لغة الجهاز المكتشف بواسطة I18nManager.isRTL.',
      codeExample: `const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    // ينعكس تلقائياً في العربية والإنجليزية:
    paddingStart: 16,
    paddingEnd: 8,
    marginEnd: 12,
  }
});`,
      commonMistakes: 'استخدام marginLeft و marginRight الصلبة، مما يجبر المطور على كتابة شروط يدوية مضنية لكل عنصر في التطبيق.',
      followUp: 'لماذا يتطلب التبديل اليدوي للـ RTL استدعاء I18nManager.forceRTL() متبوعاً بإعادة تشغيل التطبيق (Reload/Restart) لتحديث محرك Yoga؟',
      difficulty: 'senior',
      importance: 'essential',
      tags: ['react-native', 'rtl', 'i18nmanager', 'arabic-localization'],
      docUrl: 'https://reactnative.dev/docs/i18nmanager'
    },
    {
      title: 'ما هي مكتبة NativeWind وكيف تمكن المطورين من استخدام Tailwind CSS داخل React Native؟',
      shortAnswer: 'هي مكتبة تقوم بترجمة فئات Tailwind CSS إلى كائنات StyleSheet متوافقة مع React Native في وقت التجميع (Build-time)، مما يتيح كتابة فئات className قياسية فائقة السرعة والأناقة.',
      detailedAnswer: 'تسمح NativeWind بمشاركة نفس منظومة تصميم Tailwind بين مواقع الويب وتطبيقات الهاتف. الإصدار الرابع (v4) يعتمد على محرك Tailwind v4 ومترجم SWC لتحويل الفئات مثل className="flex-1 bg-slate-900 p-4 rounded-xl" مباشرة إلى كائنات تنسيق محسنة في الذاكرة بدون أي بطء في وقت التشغيل.',
      codeExample: `// كتابة فئات Tailwind المألوفة في React Native بواسطة NativeWind
import { View, Text } from 'react-native';

export function UserCard({ name }: { name: string }) {
  return (
    <View className="p-4 bg-white dark:bg-zinc-800 rounded-2xl shadow-md flex-row items-center space-x-3">
      <Text className="text-lg font-bold text-gray-900 dark:text-white">{name}</Text>
    </View>
  );
}`,
      commonMistakes: 'محاولة استخدام فئات CSS غير المدعومة في محرك Yoga كـ grid و subgrid دون الاستعانة بالبدائل المتوافقة.',
      followUp: 'كيف تتعامل NativeWind مع الوضع الليلي (Dark Mode) والمقاييس المتجاوبة breakpoints؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react-native', 'nativewind', 'tailwind-css', 'styling'],
      docUrl: 'https://reactnative.dev/docs/style'
    },
    {
      title: 'كيف تدير الوضع الليلي والنهاري (Dark & Light Mode) بسلاسة بالاعتماد على useColorScheme؟',
      shortAnswer: 'باستخدام خطاف useColorScheme للاستماع لسمة نظام تشغيل الجهاز، وربطه بكائن ألوان ديناميكي أو Theme Provider لتحديث ألوان الشاشات فورياً.',
      detailedAnswer: 'يراقب useColorScheme إعدادات مظهر الجهاز في الوقت الفعلي ويعيد "light" أو "dark" أو null. نقوم بإنشاء لوحة ألوان (Color Palette) مركزية تستخرج القيم الصحيحة بناءً على السمة النشطة، مع إمكانية توفير خيار للمستخدم لاختيار الثيم يدوياً وتخزينه في التخزين المحلي لتجاوز إعدادات النظام.',
      codeExample: `import { useColorScheme, View, Text, StyleSheet } from 'react-native';

function ThemedScreen() {
  const theme = useColorScheme() ?? 'light';
  const isDark = theme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#ffffff' }]}>
      <Text style={{ color: isDark ? '#ffffff' : '#000000' }}>مرحباً بك في التطبيق</Text>
    </View>
  );
}`,
      commonMistakes: 'استخدام Appearance.getColorScheme() الثابت غير التفاعلي بدلاً من خطاف useColorScheme التفاعلي الذي يستمع للتبديل الفوري.',
      followUp: 'كيف تتأكد من تحديث لون شريط الحالة (StatusBar style) ليتطابق مع مظهر الثيم الداكن والفاتح؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react-native', 'usecolorscheme', 'dark-mode', 'theming'],
      docUrl: 'https://reactnative.dev/docs/usecolorscheme'
    },
    {
      title: 'ما الفرق بين position: "relative" و position: "absolute" في تخطيط React Native؟',
      shortAnswer: 'العناصر ذات التنسيق relative تظل ضمن التدفق الطبيعي للـ Flexbox وتتحرك بالنسبة لموضعها الأصلي، بينما absolute تُستثنى تماماً من تدفق المحاذاة وتثبت بالنسبة لأقرب حاوية أب.',
      detailedAnswer: 'في React Native، الوضع الافتراضي لكافة العناصر هو relative. عند تعيين position: "absolute"، لا تحتاج الحاوية الأب لوضع relative صراحة (كالمتصفح)، بل يعتبر العنصر الأب المباشر هو الإطار المرجعي تلقائياً، وتستخدم قيم top و bottom و left/start و right/end لتحديد موقعه الدقيق.',
      codeExample: `// تثبيت شارة تنبيه (Badge) على زاوية أيقونة
const styles = StyleSheet.create({
  iconContainer: {
    width: 48,
    height: 48,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  }
});`,
      commonMistakes: 'محاولة استخدام zIndex لعناصر absolute على أجهزة أندرويد دون مراعاة ترتيب تسلسل الأبناء في الشجرة الأصلية، مما قد يفشل ظهور العنصر في المقدمة.',
      followUp: 'كيف يحل StyleSheet.absoluteFillObject اختصار كتابة { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react-native', 'absolute-position', 'layout', 'badges'],
      docUrl: 'https://reactnative.dev/docs/layout-props#position'
    },
    {
      title: 'ما هي فائدة واستخدامات خاصية AspectRatio في بناء البطاقات والصور المرنة؟',
      shortAnswer: 'تتحكم خاصية aspectRatio في نسبة العرض إلى الارتفاع لأي عنصر مرئي تلقائياً (مثل 16/9 أو 1/1)، مما يجعل الارتفاع يتكيف بمرونة ودقة فور تغير عرض الشاشة.',
      detailedAnswer: 'بدلاً من حساب ارتفاع الصور وبطاقات الفيديو برمجياً باستخدام معادلات الأبعاد، تسمح خاصية aspectRatio بتحديد النسبة الهندسية الثابتة. يقوم محرك Yoga بحساب البعد الآخر تلقائياً بناءً على المساحة المتوفرة، مما يمنع تشوه الوسائط ويضمن تجربة خالية من التكسر عبر كافة مقاسات الأجهزة.',
      codeExample: `const styles = StyleSheet.create({
  videoThumbnail: {
    width: '100%',
    aspectRatio: 16 / 9, // يحافظ دائماً على نسبة الفيديو السينمائية
    borderRadius: 8,
  },
  squareAvatar: {
    width: '30%',
    aspectRatio: 1, // مربع مثالي متطابق الأضلاع
    borderRadius: 50,
  }
});`,
      commonMistakes: 'تحديد عرض وارتفاع صلبين مع خاصية aspectRatio في نفس الوقت، مما يلغي مرونة النسبة ويقيد الحسابات.',
      followUp: 'كيف تتفاعل خاصية aspectRatio مع خاصية resizeMode="cover" في معالجة الصور؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react-native', 'aspectratio', 'images', 'responsive-ui'],
      docUrl: 'https://reactnative.dev/docs/layout-props#aspectratio'
    }
  ],
  'react-native-navigation': [
    {
      title: 'ما هو الفرق الجوهري بين Native Stack Navigator و Stack Navigator في React Navigation؟',
      shortAnswer: 'الـ Native Stack يستفيد من مكونات التنقل الأصلية لنظامي التشغيل (UINavigationController على iOS و FragmentManager على Android) لأداء فائق بمعدل 60fps، بينما الـ Stack العادي يحاكي الحركات بكود JavaScript خالص داخل الـ JS Thread.',
      detailedAnswer: 'يوفر @react-navigation/native-stack أداءً أصلياً حقيقياً، مع دعم الحركات الانتقالية الافتراضية للنظام (مثل حركة السحب للرجوع الإيمائية التفاعلية في iOS دون أي تقطيع)، وتثبيت شريط العنوان الأصلي واستخدام ذاكرة أقل. بينما يوفر @react-navigation/stack العادي مرونة أكبر لتخصيص الحركات المعقدة غير القياسية عبر الجافاسكربت على حساب الأداء.',
      codeExample: `import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function AppNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerBackTitleVisible: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
}`,
      commonMistakes: 'استخدام Stack Navigator الكلاسيكي المبني بالـ JS في التطبيقات الحديثة دون حاجة لتخصيصات شاذة، مما يسبب ثقلاً في الحركات الانتقالية.',
      followUp: 'ما هي مكتبة react-native-screens وكيف تمثل العمود الفقري الذي يعتمد عليه Native Stack Navigator؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react-native', 'react-navigation', 'native-stack', 'performance'],
      docUrl: 'https://reactnavigation.org/docs/native-stack-navigator'
    },
    {
      title: 'كيف تطبق أمان الأنواع الكامل (Type-Safe Navigation) في React Navigation مع TypeScript؟',
      shortAnswer: 'بتعريف RootStackParamList يحدد أسماء كافة المسارات ونوع المعاملات المقبولة، واستخدامه مع NativeStackScreenProps أو خطاف useNavigation.',
      detailedAnswer: 'يمنع هذا النمط أخطاء أسماء المسارات الإملائية وتمرير معاملات ناقصة أو غير صالحة بين الشاشات. يتيح تعريف أنواع عامة (Global Type Augmentation) لـ ReactNavigation.RootParamList الاستفادة التلقائية من الإكمال الذكي للروابط (Autocomplete) في كافة أرجاء التطبيق.',
      codeExample: `export type RootStackParamList = {
  Feed: undefined;
  Profile: { userId: string; source?: string };
};

// داخل مكون الشاشة:
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

function ProfileScreen({ route, navigation }: Props) {
  const { userId } = route.params; // التحقق الصارم من نوع المعاملات
  return <Text>معرف المستخدم: {userId}</Text>;
}`,
      commonMistakes: 'استخدام useNavigation<any>() مما يلغي كافة مزايا TypeScript ويسمح بتسرب أخطاء runtime غير المكتشفة.',
      followUp: 'كيف تعرف الـ Static Navigation API الجديدة التي تم إطلاقها في React Navigation v7 لتبسيط تعريف الأنواع؟',
      difficulty: 'senior',
      importance: 'essential',
      tags: ['react-native', 'typescript', 'type-safety', 'react-navigation'],
      docUrl: 'https://reactnavigation.org/docs/typescript/'
    },
    {
      title: 'كيف تنظم مسارات التطبيق المتداخلة (Nested Navigators) كالجمع بين Bottom Tabs و Stack؟',
      shortAnswer: 'بجعل مكون الـ Tab Navigator شاشة فرعية واحدة داخل الـ Root Stack Navigator، مما يسمح بفتح شاشات التفاصيل بكامل حجم الشاشة فوق شريط التبويبات السفلي.',
      detailedAnswer: 'الهيكلية الأكثر شيوعاً واحترافية هي وضع شاشات ملء الشاشة (مثل تفاصيل المنتج، صفحة الدفع، النوافذ المنبثقة) في الـ Root Stack، ووضع الشاشات الرئيسية ذات التبويبات في BottomTabNavigator مستقل، مما يضمن اختفاء شريط الـ Bottom Tab بسلاسة عند التنقل لشاشات الشراء أو الإعدادات العميقة.',
      codeExample: `const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MainTabs" component={HomeTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
    </Stack.Navigator>
  );
}`,
      commonMistakes: 'تغليف الـ Root Stack بداخل كل تبويب في الـ Bottom Tab بشكل منفصل، مما يسبب تكرار الـ Stacks واستهلاكاً ضخماً للذاكرة وبقاء شريط التبويب ظاهراً فوق شاشات الدفع.',
      followUp: 'كيف تتنقل برمجياً إلى مسار عميق متداخل باستخدام بنية navigate("MainTabs", { screen: "Profile" })؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react-native', 'nested-navigators', 'bottom-tabs', 'architecture'],
      docUrl: 'https://reactnavigation.org/docs/nesting-navigators'
    },
    {
      title: 'كيف تدير الروابط العميقة (Deep Linking & Universal Links) لفتح شاشات محددة من الروابط الخارجية؟',
      shortAnswer: 'بتهيئة كائن linking في NavigationContainer مع تحديد الـ prefixes (Scheme و Web Domain) وربط روابط الـ URL بمسارات الشاشات ومعاملاتها.',
      detailedAnswer: 'تتيح الروابط العميقة للمستخدمين النقر على رابط مثل https://myapp.com/products/42 أو myapp://products/42 ليقوم النظام بفتح التطبيق مباشرة والتوجيه لشاشة المنتج المحددة. يتضمن الربط إعداد Universal Links (iOS) و App Links (Android) عبر ملفات التوثيق apple-app-site-association و assetlinks.json.',
      codeExample: `const linking = {
  prefixes: ['myapp://', 'https://myapp.com'],
  config: {
    screens: {
      MainTabs: {
        screens: {
          Feed: 'feed',
        },
      },
      Details: 'product/:id',
    },
  },
};

<NavigationContainer linking={linking} fallback={<LoadingSpinner />}>
  <RootNavigator />
</NavigationContainer>;`,
      commonMistakes: 'نسيان دعم حالة التراجع والـ Fallback للمسارات العميقة مما يؤدي لتعطل التطبيق عند زيارة رابط بمعاملات خاطئة.',
      followUp: 'كيف يتعامل Deep Linking مع المستخدم غير المسجل عند النقر على رابط محمي وإعادة توجيهه بعد تسجيل الدخول؟',
      difficulty: 'senior',
      importance: 'advanced',
      tags: ['react-native', 'deep-linking', 'universal-links', 'app-links'],
      docUrl: 'https://reactnavigation.org/docs/deep-linking'
    },
    {
      title: 'ما هي أحداث دورة حياة الشاشة في React Navigation (useFocusEffect و useIsFocused)؟',
      shortAnswer: 'نظراً لأن الشاشات تظل معلقة في الذاكرة داخل مكدس الـ Stack عند الانتقال للأمام، فإن useEffect العادي لا يعمل عند الرجوع؛ لذلك نستخدم useFocusEffect لتشغيل المنطق في كل مرة تصبح فيها الشاشة نشطة ومعروضة.',
      detailedAnswer: 'عندما ينتقل المستخدم من الشاشة A إلى الشاشة B، تظل الشاشة A مركبة في الشجرة (Mounted) دون إزالتها لتسهيل الرجوع الفوري. إذا كنت تريد تحديث البيانات أو إعادة الاستماع لحدث ما بمجرد عودة المستخدم للشاشة، نستخدم useFocusEffect مقترنة بـ useCallback لإعادة تشغيل الكود وتنظيفه فور مغادرة الشاشة.',
      codeExample: `import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

function UserProfileScreen() {
  useFocusEffect(
    useCallback(() => {
      // ينفذ فور أن تصبح الشاشة في بؤرة التركيز
      fetchLatestProfileData();

      return () => {
        // دالة تنظيف تنفذ عند فقدان التركيز
        stopPolling();
      };
    }, [])
  );

  return <View>{/* ... */}</View>;
}`,
      commonMistakes: 'نسيان تغليف الدالة داخل useFocusEffect بـ useCallback مما يسبب تشغيلها في كل إعادة تصيير بلا توقف.',
      followUp: 'ما الفرق بين useIsFocused البسيط و useFocusEffect في إدارة التأثيرات ذات دوال التنظيف؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react-native', 'usefocuseffect', 'screen-lifecycle', 'react-navigation'],
      docUrl: 'https://reactnavigation.org/docs/use-focus-effect'
    },
    {
      title: 'كيف تطبق تدفق المصادقة المشروط (Conditional Authentication Flow) بأفضل ممارسة؟',
      shortAnswer: 'عبر التصيير الشرطي لشاشات الـ Auth أو شاشات الـ Main App داخل نفس الـ Navigator بناءً على حالة المستخدم الموثقة، بدلاً من التوجيه البرمجي اليدوي بـ navigate.',
      detailedAnswer: 'توصي وثائق React Navigation الرسمية بعدم استخدام navigation.navigate("Home") يدوياً بعد تسجيل الدخول. بدلاً من ذلك، نستخدم متغيراً يمثل حالة المصادقة (isLoggedIn). عند تغيير هذه الحالة من false إلى true، يقوم الراوتر تلقائياً بإزالة شاشات الدخول من المكدس وعرض شاشات التطبيق الرئيسية، مما يمنع المستخدم تماماً من الضغط على زر الرجوع للعودة لشاشة الدخول.',
      codeExample: `function AppNavigator({ userToken }: { userToken: string | null }) {
  return (
    <Stack.Navigator>
      {userToken == null ? (
        // مسارات المستخدم غير المسجل:
        <Stack.Screen name="SignIn" component={SignInScreen} />
      ) : (
        // مسارات المستخدم الموثق:
        <>
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}`,
      commonMistakes: 'استخدام navigation.replace أو Reset يدوياً بعد تسجيل الدخول، مما يجعل الكود هشاً ومعقداً مقارنة بالتحكم الشرطي الصريح.',
      followUp: 'كيف تعرض شاشة Splash Screen تمهيدية أثناء قراءة التوكن المخزن محلياً قبل حسم الشرط؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react-native', 'auth-flow', 'conditional-rendering', 'architecture'],
      docUrl: 'https://reactnavigation.org/docs/auth-flow'
    },
    {
      title: 'ما هي معمارية Expo Router وكيف تختلف بنية File-based Routing عن React Navigation التقليدي؟',
      shortAnswer: 'يعتمد Expo Router على هيكل الملفات والمجلدات لتوليد مسارات التطبيق تلقائياً (كما في Next.js) مع دعم الروابط العميقة و Universal Links افتراضياً وتوحيد كود الويب والهاتف.',
      detailedAnswer: 'بدلاً من كتابة ملفات تكوين مسارات ضخمة، يمثل كل ملف داخل مجلد app/ شاشة في التطبيق (مثل app/index.tsx لشاشة البداية، و app/profile/[id].tsx للشاشات الديناميكية). يوفر Expo Router ميزات خارقة مثل Nested Layouts عبر _layout.tsx، ودعم Type-safe Routes تلقائياً مع الاستفادة من محرك React Navigation في الخلفية.',
      codeExample: `// هيكل المجلدات في Expo Router:
// app/
//   _layout.tsx       // الحاوية والـ Stack الرئيسي
//   index.tsx         // الشاشة الرئيسية (/)
//   user/
//     [id].tsx        // شاشة ديناميكية (/user/42)

// استخدام التوجيه:
import { Link } from 'expo-router';
<Link href="/user/42">زيارة الملف الشخصي</Link>;`,
      commonMistakes: 'تسمية الملفات بأسماء تتعارض مع أنماط Expo Router الخاصة مثل استخدام أسماء تبدأ بشرطة سفلية _ دون قصد حجزها كـ Layouts.',
      followUp: 'كيف يعمل الـ Static Rendering للويب وميزة SEO المتكاملة مع Expo Router في التطبيقات الموحدة؟',
      difficulty: 'senior',
      importance: 'essential',
      tags: ['react-native', 'expo-router', 'file-based-routing', 'nextjs-for-native'],
      docUrl: 'https://docs.expo.dev/router/introduction/'
    },
    {
      title: 'كيف تخصص شريط العنوان العلوي (Custom Navigation Header) مع الحفاظ على أداء الـ Native؟',
      shortAnswer: 'باستخدام خاصية headerTitle لتمرير مكون مخصص أو تخصيص headerStyle و headerTintColor، وتجنب استخدام header الكامل المكتوب بـ JS إن لم تكن هناك حاجة قاهرة.',
      detailedAnswer: 'يوفر Native Stack خيارات ممتازة لتخصيص العنوان عبر إعدادات أصلية مثل headerLargeTitle (في iOS)، وأزرار جانبية عبر headerRight و headerLeft. إذا استبدلت الـ Header بالكامل بمكون JS عبر header: () => <CustomHeader />، تفقد ميزات الرسوم الأصلية وشريط البحث المدمج Native Search Bar وسلاسة حركات الـ Blur.',
      codeExample: `<Stack.Screen
  name="Inbox"
  component={InboxScreen}
  options={{
    headerTitle: 'صندوق الوارد',
    headerLargeTitle: true, // ميزة iOS الأصلية للترويسات الكبيرة
    headerSearchBarOptions: {
      placeholder: 'ابحث في الرسائل...',
      onChangeText: (event) => searchMessages(event.nativeEvent.text),
    },
    headerRight: () => (
      <Pressable onPress={openSettings}><Icon name="settings" /></Pressable>
    ),
  }}
/>`,
      commonMistakes: 'استبدال الهيدر كاملاً بمكون واجهة عادية داخل كل شاشة مما يسبب قفزات بصرية أثناء الانتقال واختفاء دعم الترويسات الكبيرة الأصلية.',
      followUp: 'كيف تتكامل ميزة headerTransparent مع صور الغلاف التي تمتد خلف شريط العنوان الشفاف؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react-native', 'navigation-header', 'native-stack', 'ios-features'],
      docUrl: 'https://reactnavigation.org/docs/native-stack-navigator#options'
    },
    {
      title: 'كيف تتعامل مع زر الرجوع الفعلي (Hardware Back Button) في أجهزة أندرويد داخل شاشاتك؟',
      shortAnswer: 'باستخدام وحدة BackHandler لإضافة مستمع للحدث "hardwareBackPress"، وإرجاع true لمنع الرجوع الافتراضي وتنفيذ إجراء مخصص (مثل تأكيد الخروج أو غلق نافذة).',
      detailedAnswer: 'في أجهزة أندرويد، يتوقع المستخدم سلوكاً مألوفاً عند الضغط على زر الرجوع الفعلي أو إيماءة الرجوع من الحافة. إذا كان هناك نموذج يحتوي على تعديلات غير محفوظة، يمكن استخدام BackHandler لاعتراض الرجوع وعرض مربع حوار تأكيدي. يجب إرجاع false إذا أردت السماح للنظام بإكمال الرجوع الطبيعي.',
      codeExample: `import { useEffect } from 'react';
import { BackHandler, Alert } from 'react-native';

function EditProfileScreen() {
  useEffect(() => {
    const onBackPress = () => {
      Alert.alert('تنبيه', 'هل تريد المغادرة دون حفظ التغييرات؟', [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'مغادرة', onPress: () => BackHandler.exitApp() }
      ]);
      return true; // يمنع الرجوع الفوري الافتراضي
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, []);
}`,
      commonMistakes: 'نسيان إرجاع دالة التنظيف sub.remove()، مما يجعل اعتراض الرجوع سارياً على كافة الشاشات الأخرى في التطبيق.',
      followUp: 'كيف يوفر حدث navigation.addListener("beforeRemove") في React Navigation طريقة موحدة تعمل على iOS وأندرويد معاً؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react-native', 'backhandler', 'android-back', 'navigation-lifecycle'],
      docUrl: 'https://reactnative.dev/docs/backhandler'
    },
    {
      title: 'ما هي استراتيجيات تحسين الذاكرة وتجنب تراكم الشاشات في الـ Navigation Stack (Memory Pressure)؟',
      shortAnswer: 'باستخدام navigation.replace بدلاً من push للتنقلات المتكررة في نفس السياق، وتحديد unmountOnBlur للشاشات الثقيلة، واستغلال react-native-screens لتجميد الشاشات غير النشطة.',
      detailedAnswer: 'إذا واصل المستخدم التنقل بين شاشات التفاصيل عبر navigation.push، يتراكم مئات المكونات والصور في الذاكرة دون تحريرها. مكتبة react-native-screens تقوم تلقائياً بفصل عقد الواجهة (Views) الخاصة بالشاشات غير الظاهرة من شجرة العرض الأصلية، مما يقلل استهلاك الذاكرة العشوائية ويمنع إغلاق النظام للتطبيق (OOM Crash).',
      codeExample: `// استبدال الشاشة الحالية بدلاً من تكديسها (مثلاً في صفحات الإتمام أو التبديل)
navigation.replace('OrderConfirmation', { orderId });`,
      commonMistakes: 'استخدام navigation.push في شاشات التبديل المتكرر مما يؤدي لامتلاء المكدس بآلاف الشاشات واستهلاك الذاكرة بالكامل.',
      followUp: 'كيف تعمل ميزة freezeOnBlur في مكتبة react-native-screens لمنع إعادة تصيير الشاشات الخلفية المعلقة؟',
      difficulty: 'senior',
      importance: 'advanced',
      tags: ['react-native', 'memory-optimization', 'react-native-screens', 'oom'],
      docUrl: 'https://reactnavigation.org/docs/performance'
    }
  ],
  'react-native-state-storage': [
    {
      title: 'ما الفرق بين AsyncStorage ومكتبة react-native-mmkv ولماذا تعتبر MMKV أسرع بمراحل؟',
      shortAnswer: 'تعتمد MMKV على C++ و JSI المباشر وتخزين memory-mapped files (mmap) للتزامن الفوري المتزامن (Synchronous)، بينما AsyncStorage تعمل بشكل غير متزامن وتمر عبر الـ Bridge البطيء وملفات التخزين التقليدية.',
      detailedAnswer: 'تعتبر مكتبة MMKV (المطورة من Tencent) أسرع بحوالي 30 ضعفاً من AsyncStorage. نظراً لأن MMKV تستخدم تقنية mmap، فإنها تقرأ وتكتب الذاكرة مباشرة دون كلفة الـ I/O التقليدية. وبفضل JSI، يمكن قراءة البيانات واسترجاعها برمجياً بشكل متزامن فوري مثل storage.getString("token") دون الحاجة لـ await أو معالجة Promises.',
      codeExample: `import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

// حفظ متزامن فوري بدون await:
storage.set('user_token', 'xyz_secure_jwt');

// قراءة فورية سريعة:
const token = storage.getString('user_token');`,
      commonMistakes: 'استخدام AsyncStorage في مسارات إقلاع التطبيق الحرجة لقراءة الإعدادات والثيم، مما يؤخر ظهور الشاشة الأولى بانتظار الـ Promises.',
      followUp: 'كيف تدعم MMKV تشفير البيانات المخزنة محلياً باستخدام مفاتيح أمنية متوافقة مع التخزين الآمن؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react-native', 'mmkv', 'asyncstorage', 'local-storage'],
      docUrl: 'https://reactnative.dev/docs/asyncstorage'
    },
    {
      title: 'كيف تخزن الرموز الحساسة (Tokens & Secrets) بأمان باستخدام Keychain (iOS) و Keystore (Android)؟',
      shortAnswer: 'باستخدام مكتبات متخصصة مثل expo-secure-store أو react-native-keychain لحفظ الرموز السرية داخل أجهزة التشفير العتادية الآمنة في الهاتف وليس في التخزين المحلي العادي.',
      detailedAnswer: 'لا يجوز مطلقاً حفظ كلمات المرور أو رموز JWT في AsyncStorage أو التخزين غير المشفر لأنه يمكن استخراجها بسهولة في الهواتف المكسورة الحماية (Rooted/Jailbroken) أو عبر النسخ الاحتياطية غير المشفرة. تستخدم هذه المكتبات نظام iOS Keychain ونظام Android EncryptedSharedPreferences المحمي بواسطة معالج الأمان المادي في الجهاز (Secure Enclave / TEE).',
      codeExample: `import * as SecureStore from 'expo-secure-store';

async function saveAuthToken(token: string) {
  await SecureStore.setItemAsync('auth_jwt', token, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
}

async function getAuthToken(): Promise<string | null> {
  return await SecureStore.getItemAsync('auth_jwt');
}`,
      commonMistakes: 'تخزين رموز المصادقة والبيانات البنكية في AsyncStorage أو Redux Persist دون تشفير عتادي حقيقي.',
      followUp: 'ما هي معايير حماية Keychain عند إغلاق الشاشة (WHEN_UNLOCKED_THIS_DEVICE_ONLY) وما فائدتها؟',
      difficulty: 'senior',
      importance: 'essential',
      tags: ['react-native', 'keychain', 'keystore', 'secure-storage'],
      docUrl: 'https://docs.expo.dev/versions/latest/sdk/securestore/'
    },
    {
      title: 'كيف تستخدم Zustand مع MMKV لإنشاء مخزن حالة عالمي متزامن ومحفوظ محلياً (Persistent Store)؟',
      shortAnswer: 'بدمج خاصية persist middleware في Zustand وتمرير محول تخزين مخصص (Custom Storage Engine) يوجه عمليات القراءة والكتابة إلى MMKV المتزامنة.',
      detailedAnswer: 'يوفر هذا الدمج الحل الأمثل لحفظ واسترجاع حالة التطبيق تلقائياً (مثل تفضيلات الثيم، بيانات الجلسة، واللغة). نظراً لأن MMKV متزامنة، فإن استعادة الحالة تكون فورية وخالية من وميض الشاشة الافتراضية، مع إمكانية تحديد الحقول المراد حفظها فقط عبر partialize.',
      codeExample: `import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();
const mmkvStorage = {
  setItem: (name: string, value: string) => storage.set(name, value),
  getItem: (name: string) => storage.getString(name) ?? null,
  removeItem: (name: string) => storage.delete(name),
};

export const useUserStore = create(
  persist<{ name: string; setName: (n: string) => void }>(
    (set) => ({
      name: '',
      setName: (name) => set({ name }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);`,
      commonMistakes: 'حفظ كائنات غير قابلة للتسلسل (كالـ functions أو circular objects) داخل الـ persistent store.',
      followUp: 'كيف تعالج ترقية هيكل البيانات المحفوظة القديمة باستخدام ميزة migrate في persist middleware؟',
      difficulty: 'senior',
      importance: 'essential',
      tags: ['react-native', 'zustand', 'mmkv', 'persistence'],
      docUrl: 'https://reactnative.dev/docs/state'
    },
    {
      title: 'متى نستخدم قاعدة بيانات SQLite محلية (مثل OP-SQLite أو WatermelonDB) بدلاً من Key-Value Storage؟',
      shortAnswer: 'عندما يحتوي التطبيق على آلاف السجلات المرتبطة (Relations)، أو يحتاج لعمليات فرز وبحث نصي معقدة، أو عند بناء تطبيقات تعمل كلياً دون اتصال بالإنترنت (Offline-first Apps).',
      detailedAnswer: 'تخزين مصفوفات ضخمة داخل Key-Value storage يجبرك على قراءة وتحليل كامل مصفوفة الـ JSON في الذاكرة لتعديل عنصر واحد فقط. قواعد بيانات مثل SQLite تتيح استعلامات SQL سريعة وفهارس واسترجاع الصفوف المطلوبة فقط. بينما توفر WatermelonDB استجابة تفاعلية فائقة السرعة بفضل بنية التهيئة الكسولة (Lazy Loading) المبنية على SQLite.',
      codeExample: `// مثال استعلام SQLite سريع عبر SQL مباشر:
// SELECT * FROM messages WHERE conversation_id = ? ORDER BY timestamp DESC LIMIT 50;`,
      commonMistakes: 'تخزين قاعدة بيانات كاملة للرسائل أو المنتجات في ملفات JSON داخل AsyncStorage ومحاولة فلترتها بدوال filter() في الجافاسكربت.',
      followUp: 'كيف تتفوق مكتبة op-sqlite المبنية بـ JSI على مكتبات SQLite القديمة في سرعة تنفيذ المعاملات؟',
      difficulty: 'senior',
      importance: 'advanced',
      tags: ['react-native', 'sqlite', 'watermelondb', 'offline-first'],
      docUrl: 'https://reactnative.dev/docs/state'
    },
    {
      title: 'كيف تدير التزامن دون اتصال بالإنترنت (Offline Sync) واستراتيجيات مزامنة البيانات مع الخادم؟',
      shortAnswer: 'بحفظ الإجراءات في طابور محلي (Local Mutation Queue) عند انقطاع الشبكة، وإعادة إرسالها بالترتيب فور استعادة الاتصال مع معالجة تعارض التعديلات (Conflict Resolution).',
      detailedAnswer: 'تعتمد تطبيقات Offline-first على مكتبات مثل TanStack Query أو WatermelonDB. يتم تخزين حالة التعديل محلياً أولاً مع تحديث الواجهة تفاؤلياً (Optimistic UI)، ويسجل الإجراء في طابور. عند استعادة الإنترنت عبر NetInfo، يتم تفريغ الطابور، مع الاعتماد على توقيتات التعديل (Timestamps) أو CRDTs لحل التعارض إذا كان السيرفر يحمل بيانات أحدث.',
      codeExample: `import NetInfo from '@react-native-community/netinfo';

// مراقبة عودة الاتصال وتفريغ طابور العمليات المعلقة
NetInfo.addEventListener(state => {
  if (state.isConnected && pendingQueue.length > 0) {
    flushPendingSyncQueue();
  }
});`,
      commonMistakes: 'تجاهل سيناريو تعارض التعديل عندما يقوم مستخدمان بتعديل نفس السجل أثناء انقطاع الشبكة.',
      followUp: 'ما هي استراتيجية Last-Write-Wins وكيف تقارن بآليات الدمج الخوارزمية كـ Vector Clocks؟',
      difficulty: 'senior',
      importance: 'advanced',
      tags: ['react-native', 'offline-sync', 'netinfo', 'optimistic-updates'],
      docUrl: 'https://reactnative.dev/docs/state'
    },
    {
      title: 'كيف تراقب حالة اتصال الشبكة في React Native باستخدام @react-native-community/netinfo؟',
      shortAnswer: 'باستخدام خطاف useNetInfo أو دالة addEventListener للاستماع المستمر لتغير نوع الاتصال (WiFi, Cellular, None) ومعرفة هل الإنترنت متاح فعلياً (isInternetReachable).',
      detailedAnswer: 'يوفر NetInfo معلومات تفصيلية عن حالة الشبكة. يجب الانتباه للفارق بين isConnected (الجهاز متصل بمودم أو برج اتصالات) و isInternetReachable (هل يمكن للجهاز الوصول فعلياً إلى الإنترنت وتجاوز بوابات التحقق Captive Portals).',
      codeExample: `import { useNetInfo } from '@react-native-community/netinfo';
import { View, Text } from 'react-native';

function NetworkBanner() {
  const netInfo = useNetInfo();

  if (netInfo.isConnected === false || netInfo.isInternetReachable === false) {
    return (
      <View style={{ backgroundColor: '#b00020', padding: 8 }}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>لا يوجد اتصال بالإنترنت</Text>
      </View>
    );
  }

  return null;
}`,
      commonMistakes: 'الاعتماد على isConnected فقط، بينما قد يكون الهاتف متصلاً بشبكة WiFi تتطلب تسجيل دخول ولا تمرر أي بيانات فعلية.',
      followUp: 'كيف تتأكد من فك تسجيل مستمع NetInfo عند انتهاء دورة حياة المكون لمنع تسريب الذاكرة؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react-native', 'netinfo', 'connectivity', 'offline'],
      docUrl: 'https://reactnative.dev/docs/network'
    },
    {
      title: 'كيف تتعامل مع تخزين وإدارة البيانات الكبيرة المؤقتة (Caching) باستخدام TanStack Query؟',
      shortAnswer: 'بضبط gcTime و staleTime وتكوين كاش دائم (Persistent Cache) يحفظ استجابات الـ API في MMKV لاستعادتها فورياً عند إقلاع التطبيق دون اتصال.',
      detailedAnswer: 'في تطبيقات الهاتف، يعتبر الاحتفاظ بالبيانات عبر جلسات التشغيل ضرورياً لتجنب شاشات التحميل البيضاء عند فتح التطبيق. باستخدام createAsyncStoragePersister أو محول MMKV مع persistQueryClient، يتم حفظ الكاش على القرص وتجاوز طلبات الشبكة للبيانات المستقرة، مما يعطي إحساساً بالسرعة اللحظية.',
      codeExample: `import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // الاحتفاظ بالكاش 24 ساعة
      staleTime: 1000 * 60 * 5,     // تعتبر البيانات صالحة لمدة 5 دقائق
    },
  },
});`,
      commonMistakes: 'تعيين staleTime بقيمة صفر دائماً مما يجبر التطبيق على إعادة تنزيل البيانات في كل مرة ينتقل فيها المستخدم بين الشاشات.',
      followUp: 'كيف تفيد ميزة prefetchQuery في جلب بيانات الشاشة التالية استباقياً قبل نقر المستخدم؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react-native', 'react-query', 'caching', 'persistence'],
      docUrl: 'https://reactnative.dev/docs/state'
    },
    {
      title: 'ما هي ضوابط حفظ وتأمين تفضيلات المستخدم (User Preferences) في التطبيق؟',
      shortAnswer: 'حفظ الإعدادات البسيطة (اللغة، الثيم، تفعيل الإشعارات) في تخزين سريع خفيف كـ MMKV، مع توفير قيم افتراضية واضحة والتزامن الدوري مع الخادم عند توفر الاتصال.',
      detailedAnswer: 'يجب عزل تفضيلات المستخدم عن البيانات الحساسة. لا يجب خلط تفضيل لون الواجهة مع كلمة المرور. يفضل حفظ التفضيلات محلياً أولاً لتطبيقها لحظياً عند التشغيل، ثم إرسال تحديث للـ API بالخلفية لضمان مزامنة نفس التفضيلات إذا فتح المستخدم حسابه من جهاز لوحي آخر.',
      codeExample: `interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  language: 'ar' | 'en';
}

const DEFAULT_PREFS: UserPreferences = {
  theme: 'system',
  notificationsEnabled: true,
  language: 'ar',
};`,
      commonMistakes: 'انتظار استجابة الخادم لتطبيق لغة التطبيق أو الثيم عند كل إقلاع، مما يسبب وميضاً مربكاً للمستخدم.',
      followUp: 'كيف تدير استعادة الإعدادات السحابية عند تسجيل الدخول من جهاز هاتف جديد؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react-native', 'preferences', 'settings', 'best-practices'],
      docUrl: 'https://reactnative.dev/docs/state'
    },
    {
      title: 'كيف تتعامل مع مسح بيانات المستخدم بالكامل عند تسجيل الخروج (Logout Cleansing)؟',
      shortAnswer: 'بإلغاء كافة الرموز من التخزين الآمن (SecureStore/Keychain)، ومسح بيانات الكاش في MMKV و QueryClient، وإعادة ضبط مخازن الحالة العالمية (Zustand/Redux) لحالتها الابتدائية.',
      detailedAnswer: 'إهمال تنظيف البيانات عند تسجيل الخروج يمثل خطراً أمنياً فادحاً، حيث يمكن للمستخدم التالي على نفس الجهاز رؤية رسائل أو بيانات المستخدم السابق المخزنة في الكاش. يتم إنشاء دالة تنظيف مركزية تقوم بتنفيذ storage.clearAll()، و SecureStore.deleteItemAsync()، و queryClient.clear() دفعة واحدة.',
      codeExample: `async function handleUserLogout() {
  // 1. مسح رموز التوثيق المشفرة
  await SecureStore.deleteItemAsync('auth_token');
  // 2. مسح كاش الـ API
  queryClient.clear();
  // 3. إعادة ضبط مخازن الحالة
  useUserStore.getState().reset();
  // 4. حذف التخزين المحلي السريع
  storage.clearAll();
}`,
      commonMistakes: 'الاكتفاء بمسح الـ token من الـ State في الذاكرة دون حذفه من التخزين الدائم أو كاش الاستعلامات.',
      followUp: 'كيف تتأكد من إلغاء تسجيل توكن الإشعارات (Push Notification Token) من السيرفر عند تسجيل الخروج؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react-native', 'security', 'logout', 'data-cleansing'],
      docUrl: 'https://reactnative.dev/docs/security'
    },
    {
      title: 'ما هي معمارية State Machine وكيف تستخدم مكتبة XState لإدارة التدفقات الحساسة؟',
      shortAnswer: 'آلة الحالة المحدودة (Finite State Machine) تضمن وجود التطبيق في حالة واحدة صريحة في أي لحظة مع تحديد مسارات الانتقال المسموح بها، مما يمنع الحالات المستحيلة (Impossible States).',
      detailedAnswer: 'في عمليات معقدة مثل الدفع الإلكتروني أو حجز رحلة، قد يؤدي الاعتماد على متغيرات boolean مستقلة متعددة (isSubmitting, isSuccess, isError, isCanceled) إلى تناقضات برمجية خطيرة كأن يكون الخطأ والنجاح true معاً. تمنع XState هذه الفوضى بحصر الحالات والانتقالات رياضياً.',
      codeExample: `import { createMachine } from 'xstate';

export const checkoutMachine = createMachine({
  id: 'checkout',
  initial: 'cart',
  states: {
    cart: { on: { PROCEED_TO_PAY: 'processing' } },
    processing: {
      on: {
        PAYMENT_SUCCESS: 'success',
        PAYMENT_FAILURE: 'failed',
      }
    },
    success: { type: 'final' },
    failed: { on: { RETRY: 'processing' } }
  }
});`,
      commonMistakes: 'الاعتماد على عشرات الـ boolean flags المتفرقة لإدارة تدفقات معقدة متعددة الخطوات.',
      followUp: 'كيف تسهل آلات الحالة عملية الاختبار الآلي عبر توليد كافة المسارات الممكنة تلقائياً؟',
      difficulty: 'senior',
      importance: 'advanced',
      tags: ['react-native', 'xstate', 'state-machine', 'architecture'],
      docUrl: 'https://reactnative.dev/docs/state'
    }
  ],
  'react-native-animations': [
    {
      title: 'لماذا يعتبر Animated API المدمج بطيئاً ولماذا تعد مكتبة React Native Reanimated هي المعيار الصناعي؟',
      shortAnswer: 'لأن Animated المدمج غالباً ما يمر عبر خيط JavaScript البطيء أو يقتصر useNativeDriver فيه على التعتيم والتحويل، بينما Reanimated تنفذ كود الحركة بالكامل على خيط الـ UI مباشرة بواسطة Worklets بمعدل 60-120fps.',
      detailedAnswer: 'عند استخدام Animated التقليدي دون useNativeDriver، يتم حساب كل إطار حركي في خيط الـ JS وإرساله عبر الـ Bridge، مما يسبب تقطيعاً وتجميداً فورياً للحركة إذا كان التطبيق يجري أي عملية منطقية. بينما تستخدم Reanimated تقنية Worklets لتجميع دوال JavaScript الصغيرة وتشغيلها مباشرة داخل خيط الـ UI بشكل منفصل تماماً عن خيط الـ JS.',
      codeExample: `// مثال Reanimated فائق السلاسة ينفذ على الـ UI Thread:
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

function Box() {
  const offset = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  return <Animated.View style={[styles.box, animatedStyles]} />;
}`,
      commonMistakes: 'الاعتقاد بأن useNativeDriver في النظام المدمج يدعم تحريك خصائص العرض والارتفاع أو الألوان، حيث يدعم فقط transform و opacity.',
      followUp: 'ما هي تقنية Worklets في Reanimated وكيف تميزها الكلمة التوجيهية "worklet"; في أعلى الدالة؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react-native', 'reanimated', 'animations', 'worklets'],
      docUrl: 'https://reactnative.dev/docs/animated'
    },
    {
      title: 'ما هو مفهوم الـ Shared Values في Reanimated وكيف تختلف عن useState؟',
      shortAnswer: 'الـ Shared Values تحتفظ ببيانات رقمية حركية قابلة للتعديل والوصول المتزامن من كلا الخيطين (JS و UI)، وتعديلها لا يطلق دورة إعادة تصيير (Re-render) في شجرة ريأكت بل يغير عقد الرسم مباشرة.',
      detailedAnswer: 'يتم إنشاء القيمة المشتركة عبر useSharedValue(initialValue). عندما تتغير sharedValue.value، لا يقوم ريأكت بتشغيل دالة المكون من جديد كما في useState، بل يتم تحديث خاصية الرسم فورياً على خيط الـ UI من خلال useAnimatedStyle، مما يضمن أداء 120 إطاراً في الثانية دون أي استهلاك لمعالج الـ JS.',
      codeExample: `const progress = useSharedValue(0);

const handlePress = () => {
  // تحديث حركي مرن بدون أي re-render
  progress.value = withSpring(1);
};`,
      commonMistakes: 'محاولة قراءة أو كتابة sharedValue.value مباشرة داخل مرحلة الـ Render لدالة المكون.',
      followUp: 'كيف تحافظ القيم المشتركة على تزامنها بين الخيوط دون حدوث مشاكل سباق الذاكرة (Race Conditions)؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react-native', 'shared-values', 'reanimated', 'performance'],
      docUrl: 'https://reactnative.dev/docs/animations'
    },
    {
      title: 'كيف تدمج React Native Gesture Handler (RNGH) مع Reanimated لبناء تفاعلات إيماءات لمسية فورية؟',
      shortAnswer: 'باستخدام Gesture.Pan() أو Gesture.Tap() وتمرير معالجات الأحداث الحركية (onUpdate, onEnd) لتعديل Shared Values مباشرة على خيط الـ UI بدون أي تأخير لمسي.',
      detailedAnswer: 'تعترض مكتبة RNGH تفاعلات اللمس على المستوى الأصلي للنظام (Native Touch Handlers) دون المرور بآلية أحداث ريأكت التقليدية. بالتكامل مع Reanimated، يتم تطبيق إيماءات السحب والرمي (Fling / Pan) بحسابات فيزيائية مباشرة على الـ UI Thread، مما يمنح المستخدم تجربة سريعة وخالية تماماً من الـ Latency.',
      codeExample: `import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

function DraggableBall() {
  const translationX = useSharedValue(0);

  const pan = Gesture.Pan()
    .onChange((event) => {
      translationX.value += event.changeX;
    })
    .onEnd(() => {
      translationX.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translationX.value }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.ball, animatedStyle]} />
    </GestureDetector>
  );
}`,
      commonMistakes: 'نسيان تغليف جذر التطبيق بالكامل بمكون <GestureHandlerRootView>، مما يعطل عمل الإيماءات في أندرويد.',
      followUp: 'ما الفرق بين واجهة Gesture API الحديثة في RNGH v2 والواجهة القديمة المبنية على PanGestureHandler؟',
      difficulty: 'senior',
      importance: 'essential',
      tags: ['react-native', 'gesture-handler', 'reanimated', 'pan-gesture'],
      docUrl: 'https://reactnative.dev/docs/animations'
    },
    {
      title: 'ما هي حركات التخطيط التلقائية (Layout Animations) في Reanimated v3؟',
      shortAnswer: 'هي ميزة تتيح للعناصر التحرك تلقائياً بحركات دخول وخروج وانتقال (Entering, Exiting, Layout) عند إضافتها أو حذفها أو تغيير حجمها في الـ DOM دون كتابة كود حركة معقد.',
      detailedAnswer: 'بمجرد استبدال View العادية بـ Animated.View وتمرير خصائص مثل entering={FadeIn.duration(300)} و exiting={SlideOutRight} و layout={Layout.springify()}، تتولى Reanimated تحريك العناصر المضافة والمحذوفة وتحريك بقية العناصر في القائمة لملء الفراغ تلقائياً بسلاسة مذهلة.',
      codeExample: `import Animated, { FadeInUp, FadeOutDown, Layout } from 'react-native-reanimated';

function TodoItem({ text, onDelete }: { text: string; onDelete: () => void }) {
  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutDown}
      layout={Layout.springify()} // تحريك العناصر المجاورة تلقائياً عند الحذف
      style={styles.card}
    >
      <Text>{text}</Text>
      <Button title="حذف" onPress={onDelete} />
    </Animated.View>
  );
}`,
      commonMistakes: 'نسيان إضافة key فريد وثابت للعناصر المتحركة داخل القوائم، مما يمنع خوارزمية Layout Animation من تتبع العنصر.',
      followUp: 'كيف تفيد ميزة Layout.stiffness و Layout.damping في تخصيص ارتداد الحركات الفيزيائية؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react-native', 'layout-animations', 'reanimated', 'ux'],
      docUrl: 'https://reactnative.dev/docs/animations'
    },
    {
      title: 'ما هي حركات العناصر المشتركة (Shared Element Transitions) بين الشاشات وكيف تنفذها؟',
      shortAnswer: 'هي حركة انتقال سلسة لعنصر بصري (مثل صورة منتج) أثناء الانتقال من شاشة القائمة إلى شاشة التفاصيل ليتوسع بسلاسة من موضعه الأصلي إلى موضعه النهائي في الشاشة الجديدة.',
      detailedAnswer: 'توفر Reanimated v3 دعماً مدمجاً لحركات العناصر المشتركة عبر خاصية sharedTransitionTag. عندما تحتوي الشاشة الأولى والشاشة الثانية على عنصرين يحملان نفس الـ tag، يقوم محرك الحركات بحساب مسار التحول ومطابقة أبعاد العنصر وموضعه بسلاسة سينمائية دون أي انقطاع أثناء تنقل الراوتر.',
      codeExample: `// في شاشة القائمة:
<Animated.Image
  source={{ uri: item.imageUrl }}
  sharedTransitionTag={\`image-\${item.id}\`}
  style={styles.thumbnail}
/>

// في شاشة التفاصيل:
<Animated.Image
  source={{ uri: item.imageUrl }}
  sharedTransitionTag={\`image-\${item.id}\`}
  style={styles.fullHeroImage}
/>`,
      commonMistakes: 'استخدام sharedTransitionTag متطابق لأكثر من عنصر ظاهر على نفس الشاشة مما يسبب تعارض المعرفات.',
      followUp: 'كيف تتكامل Shared Element Transitions مع Native Stack Navigator في React Navigation؟',
      difficulty: 'senior',
      importance: 'advanced',
      tags: ['react-native', 'shared-element-transitions', 'reanimated', 'navigation-transitions'],
      docUrl: 'https://reactnative.dev/docs/animations'
    },
    {
      title: 'متى نستخدم Lottie Animations وكيف نتحكم في تشغيل ملفات JSON الحركية في React Native؟',
      shortAnswer: 'نستخدم Lottie لعرض الرسوم المعقدة التي يصممها محترفو الأنيميشن على Adobe After Effects وتصديرها كملفات JSON متجهة خفيفة، باستخدام مكتبة lottie-react-native.',
      detailedAnswer: 'توفر ملفات Lottie رسوماً متحركة مبهرة (أيقونات تفاعلية، شاشات نجاح، رسوم بيانية) بحجم ملفات ضئيل جداً مقارنة بالفيديو أو الـ GIFs، مع الحفاظ على دقة المتجهات (Vector Graphics) دون أي بكسلة على مختلف مقاسات الشاشات، مع إمكانية التحكم برمجياً في التقدم والسرعة والإيقاف المؤقت.',
      codeExample: `import LottieView from 'lottie-react-native';
import { useRef } from 'react';

function SuccessAnimation() {
  const animationRef = useRef<LottieView>(null);

  return (
    <LottieView
      ref={animationRef}
      source={require('./assets/success-check.json')}
      autoPlay
      loop={false}
      style={{ width: 120, height: 120 }}
    />
  );
}`,
      commonMistakes: 'استخدام ملفات Lottie غير محسنة تحتوي على صور مدمجة بصيغة Base64 مما يضخم حجم ملف الـ JSON ويستهلك الذاكرة.',
      followUp: 'كيف تدعم مكتبة dotLottie ضغط ملفات الأنيميشن لتصبح أصغر بنسبة تصل لـ 80% مقارنة بـ JSON العادي؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react-native', 'lottie', 'vector-animations', 'after-effects'],
      docUrl: 'https://reactnative.dev/docs/animations'
    },
    {
      title: 'ما هي حركات النوابض الفيزيائية (Spring Physics) ومزاياها مقارنة بالحركات التوقيتية (Timing Animations)؟',
      shortAnswer: 'حركات الـ Spring تحاكي القوانين الفيزيائية الحقيقية (الكتلة والصلابة والتخميد) دون تحديد مدة زمنية ثابتة، وتتكيف طبيعياً مع سرعة إيماءة إصبع المستخدم دون توقف مصطنع.',
      detailedAnswer: 'الحركات المعتمدة على المدة الزمنية الثابتة (Timing مع Duration و Easing) تبدو آلية وجافة وغالباً ما تصطدم بحركة إصبع المستخدم إذا كان سريعاً. بينما تحسب فيزياء الـ Spring سرعة الانطلاق (Velocity)، والتخميد (Damping)، والصلابة (Stiffness)، مما يمنح الواجهة ملمساً طبيعياً ومرناً يشبه سحب الأجسام الحقيقية.',
      codeExample: `import { withSpring } from 'react-native-reanimated';

// حركة نابض فيزيائية عالية الاستجابة
offset.value = withSpring(100, {
  damping: 12,
  stiffness: 100,
  mass: 0.5,
});`,
      commonMistakes: 'ضبط قيمة تخميد (damping) منخفضة جداً مما يجعل العنصر يرتد ويتذبذب إلى ما لا نهاية ويشتت المستخدم.',
      followUp: 'ما الفرق بين تكوين mass و stiffness في تحديد استجابة وسرعة ارتداد الأزرار عند الضغط؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react-native', 'spring-physics', 'reanimated', 'ux-motion'],
      docUrl: 'https://reactnative.dev/docs/animations'
    },
    {
      title: 'كيف تبني مؤشر تمرير مخصص (Custom Scroll Interpolation) باستخدام useAnimatedScrollHandler؟',
      shortAnswer: 'باستخدام useAnimatedScrollHandler لتسجيل إزاحة التمرير (contentOffset.y) في قيمة Shared Value، واستخدام interpolate لربطها بتغيير شفافية أو حجم شريط العنوان بسلاسة.',
      detailedAnswer: 'يتيح useAnimatedScrollHandler الاستماع لأحداث التمرير بدقة 60 إطاراً في الثانية على الـ UI Thread. من خلال دالة interpolate، نقوم بتعيين مجال الإدخال (مثلاً التمرير من 0 إلى 150 بكسل) إلى مجال الإخراج (تقليص حجم العنوان من 1 إلى 0.8 وتغيير خلفية الهيدر من شفافة إلى معتمة).',
      codeExample: `const scrollY = useSharedValue(0);

const scrollHandler = useAnimatedScrollHandler({
  onScroll: (event) => {
    scrollY.value = event.contentOffset.y;
  },
});

const headerStyle = useAnimatedStyle(() => ({
  opacity: interpolate(scrollY.value, [0, 100], [0, 1], Extrapolate.CLAMP),
}));

<Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16}>
  {/* المحتوى */}
</Animated.ScrollView>;`,
      commonMistakes: 'نسيان تحديد خاصية scrollEventThrottle={16} مما يجعل نظام iOS يرسل أحداث التمرير على فترات متباعدة وغير سلسة.',
      followUp: 'ما هي أهمية استخدام Extrapolate.CLAMP لمنع تمدد قيم الإخراج خارج الحدود المحددة؟',
      difficulty: 'senior',
      importance: 'essential',
      tags: ['react-native', 'scroll-interpolation', 'reanimated', 'extrapolate'],
      docUrl: 'https://reactnative.dev/docs/animations'
    },
    {
      title: 'ما هي مكتبة React Native Skia وكيف تستخدم للرسوم البيانية والمؤثرات البصرية ثنائية الأبعاد فائقة السرعة؟',
      shortAnswer: 'هي غلاف عالي الأداء لمحرك Google Skia المكتوب بـ C++، يتيح الرسم المباشر على الـ Canvas، وإنشاء التدرجات اللونية الحركية (Shaders)، والرسوم البيانية المخصصة بطلاقة 120fps.',
      detailedAnswer: 'محرك Skia هو نفس المحرك الذي يغذي Google Chrome ونظام Android ومكتبة Flutter. عبر @shopify/react-native-skia، يمكنك رسم خطوط وأقواس وأشكال معقدة ومؤثرات ضبابية (Glassmorphism Blur) وفلاتر ألوان مباشرة على كرت الشاشة (GPU) دون أي تكلفة لإنشاء عقد DOM أو Views نظام التشغيل.',
      codeExample: `import { Canvas, Circle, Paint } from '@shopify/react-native-skia';

function SkiaGraphic() {
  return (
    <Canvas style={{ width: 200, height: 200 }}>
      <Circle cx={100} cy={100} r={50} color="#00ffcc" />
    </Canvas>
  );
}`,
      commonMistakes: 'استخدام مكونات View عادية ومكتبات SVG بطيئة لبناء رسوم بيانية تفاعلية حية تتطلب معالجة آلاف النقاط في الثانية.',
      followUp: 'كيف تتكامل مكتبة Skia بسلاسة مع Reanimated Shared Values لتحريك مسارات الرسوم البيانية؟',
      difficulty: 'senior',
      importance: 'advanced',
      tags: ['react-native', 'skia', 'canvas', 'gpu-rendering'],
      docUrl: 'https://reactnative.dev/docs/animations'
    },
    {
      title: 'كيف تكتشف وتعالج تقطيع الفريمات وسقوط الإطارات (Dropped Frames) أثناء الحركات؟',
      shortAnswer: 'باستخدام شاشة FPS Monitor في قائمة المطورين ومراقبة عدادي UI FPS و JS FPS لتحديد الخيط المسؤول عن التقطيع، مقترنة بأداة Flipper أو React Profiler.',
      detailedAnswer: 'إذا كان JS FPS منخفضاً (أقل من 60) بينما UI FPS عند 60، فإن الحسابات الثقيلة تجري في الجافاسكربت لكن الحركات مستمرة على الـ Native بنجاح. أما إذا انخفض UI FPS، فهذا يعني أن مشهد الرسم معقد جداً (تراكب طبقات شفافة كثيرة Overdraw، أو استخدام ظلال غير محسنة، أو إرهاق الـ Main Thread).',
      codeExample: `// فتح قائمة المطورين وفحص الإطارات:
// في المحاكي: Cmd + D (iOS) أو Cmd + M (Android) -> Show Perf Monitor`,
      commonMistakes: 'الاعتقاد بأن بطء الأداء في بيئة التطوير (Dev Mode) يطابق بيئة الإنتاج، حيث يضيف Dev Mode أعباء فحص وتحذيرات ثقيلة.',
      followUp: 'لماذا يجب دائماً قياس معدل الإطارات على أجهزة حقيقية وفي وضع Release Build؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react-native', 'fps-monitor', 'dropped-frames', 'performance-profiling'],
      docUrl: 'https://reactnative.dev/docs/performance'
    }
  ],
  'react-native-device-native': [
    {
      title: 'كيف تدير طلب أذونات النظام الحساسة (Permissions) على iOS و Android بطريقة متوافقة مع متطلبات المتاجر؟',
      shortAnswer: 'بطلب الإذن في سياق الاستخدام الفعلي (In-context) وشرح السبب للمستخدم مسبقاً، وإضافة التوصيفات الإلزامية في Info.plist و AndroidManifest.xml، والتعامل مع حالات الرفض الدائم.',
      detailedAnswer: 'ترفض شركتا Apple و Google التطبيقات التي تطلب أذونات (كالكاميرا أو الموقع) فور تشغيل التطبيق دون مبرر واضح. يجب تقديم شاشة تمهيدية تشرح فائدة الميزة للمستخدم أولاً، وعند الرفض المتكرر يجب توجيه المستخدم برمجياً إلى إعدادات النظام عبر Linking.openSettings().',
      codeExample: `import { Camera } from 'expo-camera';
import { Linking, Alert } from 'react-native';

async function requestCameraPermission() {
  const { status, canAskAgain } = await Camera.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    if (!canAskAgain) {
      Alert.alert('الإذن مطلوب', 'يرجى تفعيل إذن الكاميرا من إعدادات الهاتف للمتابعة', [
        { text: 'فتح الإعدادات', onPress: () => Linking.openSettings() }
      ]);
    }
  }
}`,
      commonMistakes: 'نسيان إضافة نصوص التبرير الإلزامية (مثل NSCameraUsageDescription في Info.plist) مما يتسبب في انهيار فوري للتطبيق على أجهزة iOS عند استدعاء الإذن.',
      followUp: 'ما الفرق في أسلوب إدارة أذونات التتبع الدقيق للموقع الجغرافي بين "Foreground" و "Background"؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react-native', 'permissions', 'info-plist', 'app-store-compliance'],
      docUrl: 'https://reactnative.dev/docs/permissionsandroid'
    },
    {
      title: 'كيف تبني Custom Native Module في أندرويد (Kotlin) وتربطه بـ React Native؟',
      shortAnswer: 'بإنشاء فئة ترث ReactContextBaseJavaModule، ووضع وسم @ReactMethod على الدوال المصدرة، وتسجيلها في ReactPackage مخصص لإضافته إلى getPackages() في MainApplication.',
      detailedAnswer: 'يتم تحديد اسم الوحدة عبر دالة getName(). الدوال الموسومة بـ @ReactMethod يمكنها استقبال معاملات أساسية (Strings, Numbers, ReadableMap) واستخدام كائن Promise لإرجاع النتائج أو الأخطاء بشكل غير متزامن إلى شفرة الـ JavaScript.',
      codeExample: `// كود Kotlin في مجلد android:
class BatteryModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "BatteryModule"

    @ReactMethod
    fun getBatteryLevel(promise: Promise) {
        try {
            val level = 85 // قراءة من نظام أندرويد
            promise.resolve(level)
        } catch (e: Exception) {
            promise.reject("ERROR_BATTERY", e.message)
        }
    }
}`,
      commonMistakes: 'محاولة إرجاع كائنات مخصصة معقدة مباشرة دون تحويلها إلى WritableMap أو أنواع مدعومة من الـ Bridge.',
      followUp: 'كيف تختلف كتابة هذه الوحدة في المعمارية الجديدة عبر TurboModule Spec وتوليد واجهات C++ بواسطة Codegen؟',
      difficulty: 'senior',
      importance: 'advanced',
      tags: ['react-native', 'native-modules', 'android', 'kotlin'],
      docUrl: 'https://reactnative.dev/docs/native-modules-android'
    },
    {
      title: 'كيف تبني Custom Native Module في نظام iOS (Swift / Objective-C)؟',
      shortAnswer: 'بإنشاء فئة Swift تحتوي على الدوال المرغوبة، واستخدام ملف جسر Objective-C (Bridging Header) وماكرو RCT_EXTERN_MODULE لتسجيلها في شجرة وحدات React Native.',
      detailedAnswer: 'نظراً لأن نواة React Native القديمة تعتمد على Objective-C، فإن ربط كود Swift يتطلب كتابة ملف Objective-C صغير لتصدير الفئة والدوال باستخدام RCT_EXTERN_MODULE و RCT_EXTERN_METHOD، مع تحديد ما إذا كانت الوحدة تتطلب التنفيذ على الـ Main Queue أو خيط منفصل.',
      codeExample: `// في ملف Swift:
@objc(BatteryModule)
class BatteryModule: NSObject {
  @objc(getBatteryLevel:rejecter:)
  func getBatteryLevel(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
    resolve(UIDevice.current.batteryLevel * 100)
  }
}

// في ملف Objective-C المصدر (BatteryModule.m):
#import <React/RCTBridgeModule.h>
@interface RCT_EXTERN_MODULE(BatteryModule, NSObject)
RCT_EXTERN_METHOD(getBatteryLevel:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
@end`,
      commonMistakes: 'نسيان إضافة علامة @objc перед الفئات والدوال في Swift مما يمنع محرك Objective-C من رؤيتها.',
      followUp: 'كيف تدعم الوحدات إرسال أحداث مستمرة إلى الجافاسكربت عبر وراثة RCTEventEmitter؟',
      difficulty: 'senior',
      importance: 'advanced',
      tags: ['react-native', 'native-modules', 'ios', 'swift'],
      docUrl: 'https://reactnative.dev/docs/native-modules-ios'
    },
    {
      title: 'كيف تستخدم مستشعرات الحركة والعتاد (Accelerometer, Gyroscope, Barometer) في React Native؟',
      shortAnswer: 'باستخدام حزمة expo-sensors للاشتراك في تدفق قراءات المستشعرات وتحديد وتيرة التحديث بالمللي ثانية (Update Interval) مع إلغاء الاشتراك فور مغادرة الشاشة.',
      detailedAnswer: 'توفر مستشعرات الهاتف بيانات ثلاثية الأبعاد (x, y, z) لحركة وميلان الجهاز. للاستفادة منها دون استنزاف بطارية الهاتف، يجب ضبط تردد التحديث بدقة (مثلاً 100ms) وتجميع القراءات، والتأكد من استدعاء subscription.remove() في دالة تنظيف الـ Effect لتفادي تشغيل المستشعر بالخلفية.',
      codeExample: `import { Accelerometer } from 'expo-sensors';
import { useEffect, useState } from 'react';

function MotionTracker() {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    Accelerometer.setUpdateInterval(100);
    const subscription = Accelerometer.addListener(setData);
    return () => subscription.remove();
  }, []);

  return <Text>الميلان: X: {data.x.toFixed(2)}, Y: {data.y.toFixed(2)}</Text>;
}`,
      commonMistakes: 'تعيين وتيرة التحديث بتردد فائق (مثل 16ms) دون داعٍ مما يسبب استنزافاً سريعاً لبطارية الهاتف وسخونة المعالج.',
      followUp: 'كيف يتم دمج قراءات المستشعرات مع مكتبة Reanimated لتحريك عناصر الواجهة وفق ميلان الهاتف (Parallax Effect)؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react-native', 'sensors', 'accelerometer', 'hardware'],
      docUrl: 'https://docs.expo.dev/versions/latest/sdk/accelerometer/'
    },
    {
      title: 'كيف تتعامل مع المصادقة الحيوية (Biometrics - FaceID & Fingerprint) في التطبيق؟',
      shortAnswer: 'باستخدام expo-local-authentication لفحص توفر العتاد الحيوي أولاً، ثم استدعاء authenticateAsync مع رسالة واضحة للمستخدم ودعم إدخال رمز الهاتف كبديل عند الفشل.',
      detailedAnswer: 'تمنح المصادقة الحيوية تجربة دخول آمنة وسريعة للمحافظ الرقمية والتطبيقات البنكية. يجب دائماً فحص hasHardwareAsync و isEnrolledAsync للتأكد من أن المستخدم قد سجل بصمة بالفعل على هاتفه، مع توفير مسار بديل لإدخال كلمة المرور في حال فشل المستشعر المتكرر.',
      codeExample: `import * as LocalAuthentication from 'expo-local-authentication';

async function authenticateWithBiometrics(): Promise<boolean> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();

  if (!hasHardware || !isEnrolled) return false;

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'المصادقة للوصول إلى الحساب',
    fallbackLabel: 'استخدام رمز المرور',
  });

  return result.success;
}`,
      commonMistakes: 'الاعتماد على نتيجة المصادقة الحيوية لتخويل عمليات مالية خطيرة دون تأكيد التوقيع الرقمي مع الخادم بمفتاح مشفر.',
      followUp: 'كيف يتم ربط نجاح المصادقة الحيوية باستخراج مفتاح سري محمي داخل الـ Secure Enclave في iOS؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react-native', 'biometrics', 'face-id', 'fingerprint'],
      docUrl: 'https://docs.expo.dev/versions/latest/sdk/local-authentication/'
    },
    {
      title: 'كيف تدير الإشعارات اللحظية المحلية والبعيدة (Push & Local Notifications) وإدارة التوكنات؟',
      shortAnswer: 'باستخدام expo-notifications أو Notifee للحصول على تصريح المستخدم، واستخراج Push Token الخاص بالجهاز وإرساله للسيرفر، والاستماع لأحداث النقر على الإشعار للتوجيه المباشر.',
      detailedAnswer: 'يتطلب التعامل مع الإشعارات تكوين شهادات APNs لنظام iOS وخدمة Firebase Cloud Messaging (FCM) لنظام Android. عند إقلاع التطبيق، نطلب إذن الإشعارات، ونحصل على Expo Push Token الفريد ونخزنه في قاعدة بيانات الخادم بجانب حساب المستخدم. عند استلام الإشعار، يتم التعامل مع فتح التطبيق من الإشعار عبر addNotificationResponseReceivedListener.',
      codeExample: `import * as Notifications from 'expo-notifications';

async function registerForPushNotifications(): Promise<string | null> {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return null;

  const tokenData = await Notifications.getExpoPushTokenAsync();
  return tokenData.data; // إرسال هذا التوكن لخادم الـ Backend
}`,
      commonMistakes: 'تجاهل إعداد قنوات الإشعارات (Notification Channels) الإلزامية في نظام أندرويد، مما يمنع ظهور الإشعارات أو انطلاق أصوات التنبيه.',
      followUp: 'كيف يتم توجيه المستخدم لشاشة معينة (Deep Linking) عند النقر على إشعار وارد أثناء إغلاق التطبيق تماماً؟',
      difficulty: 'senior',
      importance: 'essential',
      tags: ['react-native', 'push-notifications', 'fcm', 'apns'],
      docUrl: 'https://docs.expo.dev/push-notifications/overview/'
    },
    {
      title: 'كيف تدير التتبع الدقيق للموقع الجغرافي بالخلفية (Background Geolocation) دون إغلاق التطبيق؟',
      shortAnswer: 'بتسجيل مهمة خلفية عبر TaskManager و expo-location مع ضبط نوع النشاط ومسافة التحديث، وضمان الحصول على إذن ACCESS_BACKGROUND_LOCATION الصريح.',
      detailedAnswer: 'يفرض كلا النظامين قيوداً صارمة جداً على تتبع الموقع أثناء نوم الشاشة لمنع التجسس وتوفير الطاقة. يتطلب أندرويد إظهار خدمة أمامية دائمة (Foreground Service Notification) توضح للمستخدم أن التطبيق يتتبع موقعه، بينما يتطلب iOS تحديد السبب الدقيق في UIBackgroundModes.',
      codeExample: `import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

const LOCATION_TASK_NAME = 'background-location-task';

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) return;
  if (data) {
    const { locations } = data as any;
    console.log("الموقع في الخلفية:", locations);
  }
});

// بدء التتبع:
await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
  accuracy: Location.Accuracy.Balanced,
  distanceInterval: 50, // التحديث كل 50 متراً فقط
  showsBackgroundLocationIndicator: true,
});`,
      commonMistakes: 'استخدام أقصى دقة للموقع (Highest Accuracy) طوال الوقت مما يستنزف كامل طاقة بطارية الهاتف في أقل من ساعتين.',
      followUp: 'ما هي الشروط الصارمة التي تفرضها متاجر التطبيقات لقبول التطبيقات التي تستخدم تتبع الموقع في الخلفية؟',
      difficulty: 'senior',
      importance: 'advanced',
      tags: ['react-native', 'geolocation', 'background-tasks', 'expo-location'],
      docUrl: 'https://docs.expo.dev/versions/latest/sdk/location/'
    },
    {
      title: 'كيف تتعامل مع الاهتزازات التفاعلية اللمسية (Haptic Feedback) لتحسين تجربة المستخدم؟',
      shortAnswer: 'باستخدام مكتبة expo-haptics لإطلاق نبضات اهتزازية دقيقة وخفيفة (Light, Medium, Heavy, Success, Error) عند النقر على الأزرار أو السحب لتأكيد الإجراء فيزيائياً.',
      detailedAnswer: 'الاهتزازات اللمسية الذكية تمنح التطبيق طابع الفخامة والأصالة عبر محاكاة ملمس الأزرار المادية الحقيقية (Taptic Engine). ينصح بإطلاق Haptics.impactAsync(ImpactFeedbackStyle.Light) عند الضغط على أزرار التبديل، و notificationAsync(NotificationFeedbackType.Success) عند نجاح عملية الدفع.',
      codeExample: `import * as Haptics from 'expo-haptics';

function ConfirmButton({ onConfirm }: { onConfirm: () => void }) {
  const handlePress = () => {
    // نبضة لمسية خفيفة تؤكد اللمس
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onConfirm();
  };

  return <Pressable onPress={handlePress}><Text>تأكيد الطلب</Text></Pressable>;
}`,
      commonMistakes: 'الإفراط في إطلاق الاهتزازات اللمسية في كل حركة وتمرير مما يزعج المستخدم ويجعله يعطل إشعارات التطبيق.',
      followUp: 'كيف تتأكد من احترام تفضيلات المستخدم إذا كان قد عطل الاهتزازات في إعدادات إمكانية الوصول في هاتفه؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react-native', 'haptics', 'ux', 'taptic-engine'],
      docUrl: 'https://docs.expo.dev/versions/latest/sdk/haptics/'
    },
    {
      title: 'كيف تدمج ميزة مسح وقراءة الباركود ورموز الاستجابة السريعة (QR Code Scanning)؟',
      shortAnswer: 'باستخدام expo-camera أو expo-barcode-scanner مع تحديد خاصية onBarcodeScanned وتحديد أنواع الأكواد المستهدفة لمنع الاستهلاك العشوائي للمعالج.',
      detailedAnswer: 'يتم تشغيل معاينة الكاميرا والاستماع لأكواد الباركود. بمجرد التقاط كود صالح، يجب تعطيل المسح فوراً عبر حالة boolean (مثل const [scanned, setScanned] = useState(false)) لمنع استدعاء معالج الحدث عشرات المرات في الثانية الواحدة لنفس الكود.',
      codeExample: `import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';

function BarcodeScanner() {
  const [scanned, setScanned] = useState(false);

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    alert(\`تم قراءة الكود: \${data}\`);
  };

  return (
    <CameraView
      style={{ flex: 1 }}
      barcodeScannerSettings={{ barcodeTypes: ['qr', 'ean13'] }}
      onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
    />
  );
}`,
      commonMistakes: 'عدم تعطيل خاصية onBarcodeScanned بعد أول قراءة ناجحة مما يطلق سيل طلبات متكررة لنفس الرمز.',
      followUp: 'كيف ترسم إطاراً مربعاً مرئياً حول منطقة المسح المستهدفة لتوجيه عين المستخدم؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react-native', 'camera', 'barcode-scanner', 'qr-code'],
      docUrl: 'https://docs.expo.dev/versions/latest/sdk/camera/'
    },
    {
      title: 'كيف تدير حفظ وقراءة الملفات المحلية باستخدام FileSystem ومشاركة المحتوى عبر Sharing API؟',
      shortAnswer: 'باستخدام expo-file-system لتنزيل الملفات وتخزينها في DocumentDirectory أو CacheDirectory، واستدعاء expo-sharing لمشاركة الملفات مع التطبيقات الأخرى.',
      detailedAnswer: 'DocumentDirectory مخصص للملفات الدائمة التي يملكها المستخدم والتي تظل محفوظة أثناء النسخ الاحتياطي، بينما CacheDirectory للملفات المؤقتة التي يمكن للنظام حذفها عند انخفاض مساحة الهاتف. توفر Sharing.shareAsync فتح نافذة المشاركة الأصلية في النظام لإرسال التقارير و PDF عبر البريد أو واتساب.',
      codeExample: `import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

async function downloadAndSharePDF(url: string) {
  const fileUri = FileSystem.documentDirectory + 'invoice.pdf';
  const downloadResult = await FileSystem.downloadAsync(url, fileUri);

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(downloadResult.uri);
  }
}`,
      commonMistakes: 'حفظ ملفات كاش ضخمة ومؤقتة في DocumentDirectory مما يضخم حجم النسخ الاحتياطي للتطبيق على iCloud و Google Drive.',
      followUp: 'كيف تتأكد من فحص مساحة التخزين المتبقية في الجهاز قبل بدء تنزيل ملفات فيديو أو تحديثات ضخمة؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react-native', 'filesystem', 'sharing', 'storage-management'],
      docUrl: 'https://docs.expo.dev/versions/latest/sdk/filesystem/'
    }
  ],
  'react-native-performance': [
    {
      title: 'كيف تكتشف وتعالج تسريبات الذاكرة (Memory Leaks) في تطبيقات React Native؟',
      shortAnswer: 'بأخذ لقطات ذاكرة ومراقبة Xcode Memory Gauge و Android Studio Profiler للبحث عن كائنات Native وأنشطة غير محررة، ومراجعة دوال التنظيف في useEffect للـ Timers والاشتراكات.',
      detailedAnswer: 'تحدث التسريبات عندما لا يتم فك ارتباط مستمعي الأحداث، أو عند الاحتفاظ بمراجع لصور ضخمة في متغيرات عامة، أو عند تشغيل عمليات غير متزامنة تحدث حالة مكون تم حذفه من الشاشة (Unmounted). يؤدي تراكم الذاكرة لإطلاق النظام لحدث Out of Memory (OOM) وإغلاق التطبيق قسراً.',
      codeExample: `// منع تسريب الذاكرة أثناء طلبات الشبكة الطويلة:
useEffect(() => {
  const controller = new AbortController();

  fetchUserData({ signal: controller.signal })
    .then(data => setUser(data))
    .catch(err => { if (err.name !== 'AbortError') console.error(err); });

  return () => controller.abort(); // إلغاء فوري عند مغادرة الشاشة
}, [userId]);`,
      commonMistakes: 'تجاهل تنظيف مؤقتات setInterval ومستمعي AppState عند فك المكون.',
      followUp: 'كيف يساعد Profiler أندرويد في اكتشاف تسريبات الـ Bitmaps الناتجة عن فك تشفير صور ضخمة بدقة تفوق دقة الشاشة؟',
      difficulty: 'senior',
      importance: 'essential',
      tags: ['react-native', 'memory-leaks', 'profiler', 'oom-crashes'],
      docUrl: 'https://reactnative.dev/docs/performance'
    },
    {
      title: 'ما هي ظاهرة الـ Overdraw في أجهزة أندرويد وكيف تؤثر على سلاسة رسم الواجهة؟',
      shortAnswer: 'هي قيام النظام برسم نفس البكسل على الشاشة عدة مرات في نفس الإطار نتيجة لتراكم خلفيات ملونة غير ضرورية في حاويات <View> المتداخلة، مما يهدر طاقة كرت الشاشة (GPU).',
      detailedAnswer: 'يمكن تفعيل خيار "Show GPU Overdraw" في خيارات مطور أندرويد. العناصر التي تظهر باللون الأزرق رسمت مرة واحدة (ممتاز)، بينما اللون الأخضر مرتان، والوردي والأحمر 3 إلى 4 مرات (سيء). لحل المشكلة، نقوم بإزالة خصائص backgroundColor من الحاويات الداخلية والاعتماد على خلفية الحاوية الرئيسية فقط.',
      codeExample: `// نمط سيء يسبب Overdraw عالي:
// <View style={{ backgroundColor: '#fff' }}>
//   <View style={{ backgroundColor: '#fff' }}>
//     <View style={{ backgroundColor: '#fff' }}><Text>نص</Text></View>
//   </View>
// </View>

// نمط سليم ومحسن: خلفية واحدة فقط
<View style={{ backgroundColor: '#fff' }}>
  <View>
    <View><Text>نص</Text></View>
  </View>
</View>`,
      commonMistakes: 'وضع لون خلفية صريح لكل طبقة من طبقات المكونات الفرعية داخل البطاقات والقوائم.',
      followUp: 'كيف يساعد تقليل التداخل الهرمي للشجرة (Flattening View Hierarchy) في تخفيف عبء الـ GPU؟',
      difficulty: 'senior',
      importance: 'advanced',
      tags: ['react-native', 'overdraw', 'gpu', 'android-performance'],
      docUrl: 'https://reactnative.dev/docs/performance#overdraw'
    },
    {
      title: 'كيف تحسن من حجم حزمة التطبيق النهائية (App Bundle Size Reduction) في أندرويد و iOS؟',
      shortAnswer: 'بتفعيل تمكين ProGuard/R8، وتقسيم ملفات الـ APK حسب معمارية المعالج (ABI Splitting)، واستخدام صيغ الصور الحديثة WebP، وضغط الخطوط، وإزالة المكتبات غير المستخدمة بـ Bundle Visualizer.',
      detailedAnswer: 'في أندرويد، يضمن تفعيل enableProguardInReleaseBuilds حذف الأكواد والوحدات الأصلية غير المستخدمة وتقليص حجم الشيفرة (Tree Shaking). بدلاً من بناء Universal APK ضخم يضم مكتبات ARM و x86 معاً، نعتمد على نظام Android App Bundle (.aab) ليقوم متجر Google Play بتقديم حزمة مخصصة لجهاز كل مستخدم على حدة.',
      codeExample: `// في android/app/build.gradle:
def enableProguardInReleaseBuilds = true

android {
  splits {
    abi {
      enable true
      reset()
      include "armeabi-v7a", "arm64-v8a"
      universalApk false
    }
  }
}`,
      commonMistakes: 'تضمين صور ومقاطع فيديو عالية الدقة بصيغة PNG أو MP4 غير مضغوطة داخل حزمة الأصول المدمجة (Assets).',
      followUp: 'كيف تستخدم أداة react-native-bundle-visualizer لتحليل وتحديد أكبر مكتبات الجافاسكربت وزناً داخل الحزمة؟',
      difficulty: 'senior',
      importance: 'essential',
      tags: ['react-native', 'bundle-size', 'r8', 'proguard', 'abi-splitting'],
      docUrl: 'https://reactnative.dev/docs/performance'
    },
    {
      title: 'كيف تسرع وقت بدء تشغيل التطبيق (Time to Interactive - TTI)؟',
      shortAnswer: 'بالاعتماد على محرك Hermes لتشغيل الـ Bytecode مسبقاً، وتأجيل تهيئة حزم الـ SDK غير العاجلة بالخلفية، وتفادي استدعاءات التخزين والشبكة المتزامنة الثقيلة أثناء عرض الشاشة الأولى.',
      detailedAnswer: 'يقاس TTI بالفترة من لحظة نقر أيقونة التطبيق حتى تصبح الشاشة مرسومة بالكامل وقابلة للتفاعل. يتم تسريعه بعرض Splash Screen أصلية فورية، وتجنب استيراد ملفات برميلية ضخمة (Barrel files)، واستخدام الإنشاء الكسول (Lazy initialization) لمكتبات التحليلات (Analytics) والإعلانات حتى بعد اكتمال رسم أول شاشة للمستخدم.',
      codeExample: `// تأجيل تهيئة SDK التحليلات الثقيلة لما بعد أول تصيير
useEffect(() => {
  const timer = setTimeout(() => {
    initializeAnalytics();
  }, 2000);
  return () => clearTimeout(timer);
}, []);`,
      commonMistakes: 'تنفيذ استعلامات شبكية متتالية وحظر واجهة البداية بانتظار استجابة السيرفر قبل السماح بظهور واجهة التطبيق.',
      followUp: 'كيف تفيد ميزة Inline Requires في مترجم Metro في تسريع تحميل ملفات الجافاسكربت عند الإقلاع؟',
      difficulty: 'senior',
      importance: 'essential',
      tags: ['react-native', 'tti', 'startup-time', 'hermes', 'metro'],
      docUrl: 'https://reactnative.dev/docs/performance'
    },
    {
      title: 'ما هي خاصية removeClippedSubviews ومتى يكون تفعيلها سلاحاً ذا حدين؟',
      shortAnswer: 'تقوم بفصل عناصر الـ Native Views التي تقع خارج حدود نافذة العرض من شجرة الرسم الأصلية لتوفير الذاكرة، لكنها قد تسبب وميضاً أو اختفاءً مؤقتاً لبعض العناصر أثناء التمرير السريع.',
      detailedAnswer: 'تعتبر removeClippedSubviews مفيدة جداً لتقليل استهلاك الذاكرة في القوائم الضخمة. لكن في بعض إصدارات أندرويد أو مع العناصر التي تحتوي على حقول إدخال وخرائط ونوافذ ويب، قد يؤدي فصلها المفاجئ إلى فقدان حالة التركيز أو ظهور مساحات فارغة بيضاء حتى يلحق النظام بإعادة تركيبها.',
      codeExample: `<FlatList
  data={heavyItems}
  removeClippedSubviews={Platform.OS === 'android'}
  renderItem={renderItem}
/>`,
      commonMistakes: 'تفعيل removeClippedSubviews على عناصر تتضمن مدخلات نصوص معقدة، مما قد يسبب مشاكل في اختفاء لوحة المفاتيح والتركيز.',
      followUp: 'كيف تتغلب مكتبة FlashList على مشاكل removeClippedSubviews بإعادة تدوير العناصر دون تدميرها؟',
      difficulty: 'mid',
      importance: 'advanced',
      tags: ['react-native', 'removeclippedsubviews', 'memory', 'flatlist'],
      docUrl: 'https://docs.expo.dev/versions/latest/sdk/camera/'
    },
    {
      title: 'كيف تتعامل مع أخطاء تصيير وتكبير حجم الصور (Image Downscaling) في وقت التشغيل؟',
      shortAnswer: 'بطلب أبعاد الصورة المناسبة لحجم العرض من السيرفر (عبر CDN Image Resizing)، وتجنب تنزيل صور بدقة 4K لعرضها في أيقونة صغيرة بحجم 50x50 مما يستنزف الذاكرة.',
      detailedAnswer: 'عندما يقوم الهاتف بفك ضغط صورة 4K (3840x2160)، يحجز النظام مصفوفة بكسلات غير مضغوطة في الذاكرة العشوائية (RAM) بحجم يتجاوز 30 ميجابايت للصورة الواحدة حتى لو كان حجم ملف الـ JPG الأصلي 200 كيلوبايت فقط! تنزيل أبعاد مطابقة لحجم الشاشة يمنع استنزاف الذاكرة وانهيار التطبيق فوراً.',
      codeExample: `// طلب صورة مصغرة بدقة مطابقة لحجم شاشة الهاتف
const optimizedUrl = \`https://cdn.example.com/img.jpg?w=\${Math.round(avatarWidth * PixelRatio.get())}\`;

<Image source={{ uri: optimizedUrl }} style={{ width: avatarWidth, height: avatarHeight }} />;`,
      commonMistakes: 'الاعتقاد بأن صغر حجم ملف الصورة المضغوط على القرص يعني بالضرورة صغر حجم استهلاكها للذاكرة العشوائية بعد فك الضغط (Bitmap Decoding).',
      followUp: 'ما هو دور PixelRatio.get() في احتساب الكثافة النقطية الحقيقية لشاشات Retina و High-DPI؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react-native', 'images', 'bitmap', 'pixelratio', 'memory'],
      docUrl: 'https://reactnative.dev/docs/image#resizemode'
    },
    {
      title: 'كيف يؤثر استخدام console.log المفرط على أداء تطبيق React Native في بيئة الإنتاج؟',
      shortAnswer: 'عمليات console.log متزامنة وتمر عبر الـ Bridge وتقوم بتسلسل الكائنات الضخمة إلى نصوص، مما يسبب تجميداً ملحوظاً وسقوطاً للفريمات إذا تركت في كود الإنتاج.',
      detailedAnswer: 'في بيئة التطوير، يعتبر console مفيداً. لكن في نسخة الإنتاج، يؤدي تسجيل مئات الكائنات في كل إطار تمرير إلى استهلاك مكثف للـ CPU والـ Bridge وتسجيل البيانات في نظام سجلات الهاتف (Logcat / Console log) مما يفتح ثغرة تسريب لبيانات المستخدمين الحساسة. يجب حذفها آلياً عبر إضافات Babel مثل babel-plugin-transform-remove-console.',
      codeExample: `// في ملف babel.config.js لحذف الاستدعاءات في الإنتاج تلقائياً:
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  env: {
    production: {
      plugins: ['transform-remove-console'],
    },
  },
};`,
      commonMistakes: 'ترك استدعاءات console.log لبيانات الـ API الحساسة ككلمات المرور والبطاقات في كود الـ Release.',
      followUp: 'كيف يمكنك استبدال console.log بنظام تسجيل أخطاء متخصص (مثل Sentry أو Datadog) يجمع الأخطاء الحرجة فقط؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react-native', 'console-log', 'babel', 'production-optimization'],
      docUrl: 'https://reactnative.dev/docs/performance#consolelog-statements'
    },
    {
      title: 'ما هي معمارية FlashList من Shopify ولماذا تحل كافة مشاكل FlatList التقليدية؟',
      shortAnswer: 'تقوم FlashList بإعادة تدوير خلايا الـ Native Views القائمة واستبدال محتواها الداخلي فقط (Cell Recycling) بدلاً من تدمير وإنشاء مكونات جديدة عند التمرير.',
      detailedAnswer: 'عند التمرير في FlatList، يقوم النظام بإنشاء عناصر جديدة وتدمير القديمة، مما يسبب ظهور فراغات بيضاء عند التمرير السريع واستهلاكاً مستمراً للذاكرة. تعتمد FlashList على خوارزمية إعادة التدوير الشبيهة بـ RecyclerView في أندرويد و UICollectionView في iOS، وتتطلب فقط تحديد estimatedItemSize لتعمل بسرعة تفوق FlatList بـ 5 إلى 10 أضعاف.',
      codeExample: `import { FlashList } from '@shopify/flash-list';

function ProductFeed({ items }: { items: Product[] }) {
  return (
    <FlashList
      data={items}
      renderItem={({ item }) => <ProductRow item={item} />}
      estimatedItemSize={100} // تحديد متوسط الارتفاع لإعادة التدوير الفورية
    />
  );
}`,
      commonMistakes: 'تحديد قيمة estimatedItemSize بعيدة جداً عن الارتفاع الحقيقي مما يربك حسابات شريط التمرير.',
      followUp: 'كيف تتعامل FlashList مع العناصر ذات الأنواع المختلفة (getItemType) لضمان إعادة تدوير القوالب المطابقة؟',
      difficulty: 'senior',
      importance: 'essential',
      tags: ['react-native', 'flashlist', 'shopify', 'recycling', 'flatlist-alternative'],
      docUrl: 'https://reactnative.dev/docs/flatlist'
    },
    {
      title: 'كيف تستخدم React Profiler لتحديد أسباب إعادة تصيير المكونات في شاشات الموبايل؟',
      shortAnswer: 'بتغليف الشاشات بمكون <Profiler> لتسجيل معايير actualDuration و baseDuration، أو باستخدام Flipper React DevTools لتسجيل الفروقات وتحليل أسباب الـ Re-render.',
      detailedAnswer: 'يساعد الـ Profiler في معرفة المكونات التي تعيد التصيير بشكل غير ضروري وتحديد الزمن الذي يستغرقه كل مكون بالمللي ثانية. من خلال تحليل الأسباب (تغير الـ props أو الـ Context)، يتم التدخل واستخدام React.memo أو useMemo أو إعادة هيكلة تمرير البيانات لحصر التحديث في الأجزاء المعنية فقط.',
      codeExample: `import { Profiler } from 'react';

function onRenderCallback(id: string, phase: string, actualDuration: number) {
  if (actualDuration > 16) {
    console.warn(\`المكون \${id} استغرق وقتاً طويلاً: \${actualDuration}ms في مرحلة \${phase}\`);
  }
}

<Profiler id="HomeScreen" onRender={onRenderCallback}>
  <HomeScreen />
</Profiler>;`,
      commonMistakes: 'ترك مكونات الـ Profiler نشطة في إصدارات الإنتاج النهائية للمستخدمين.',
      followUp: 'ما الفرق بين فحص الأداء على محاكي الجهاز (Simulator) وفحصه على هاتف فعلي متصل عبر الكابل؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react-native', 'react-profiler', 'benchmarking', 'devtools'],
      docUrl: 'https://reactnative.dev/docs/profiling'
    },
    {
      title: 'كيف تمنع تجميد الشاشة أثناء تنفيذ العمليات الحسابية الضخمة باستخدام InteractionManager؟',
      shortAnswer: 'بتأجيل تنفيذ المهام الثقيلة (مثل معالجة البيانات المعقدة أو التخزين) حتى تنتهي كافة الرسوم الحركية وتفاعلات اللمس الحالية باستخدام InteractionManager.runAfterInteractions.',
      detailedAnswer: 'إذا حاول التطبيق معالجة مصفوفة ضخمة بالتزامن مع حركة انتقال الشاشة (Screen Transition Animation)، سيتجمد الإطار وتظهر الحركة متقطعة ومزعجة. يضمن InteractionManager تأجيل العمليات الحسابية غير العاجلة حتى تكتمل حركة الانتقال وتستقر الشاشة بسلاسة بمعدل 60 إطاراً في الثانية.',
      codeExample: `import { InteractionManager } from 'react-native';
import { useEffect } from 'react';

function AnalyticsScreen() {
  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      // لن يعمل هذا الكود إلا بعد اكتمال أنيميشن فتح الشاشة بالكامل
      runHeavyDataCalculations();
    });

    return () => task.cancel();
  }, []);

  return <View>{/* ... */}</View>;
}`,
      commonMistakes: 'تنفيذ استعلامات مكثفة فور الدخول إلى الشاشة مما يقطع أنيميشن الانتقال الأصلي للنظام.',
      followUp: 'كيف تتكامل ميزات React 18 useTransition الحديثة كبديل معاصر وأكثر مرونة لـ InteractionManager؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react-native', 'interactionmanager', 'smooth-transitions', 'threading'],
      docUrl: 'https://reactnative.dev/docs/interactionmanager'
    }
  ],
  'react-native-expo': [
    {
      title: 'ما هي معمارية Expo الحديثة وما هو مفهوم Continuous Native Generation (CNG)؟',
      shortAnswer: 'معمارية CNG تعتمد على توليد مجلدي android و ios برمجياً وبشكل نظيف وقابل للحذف عند الطلب من خلال app.json والـ Config Plugins بدلاً من تعديل الملفات الأصلية يدوياً.',
      detailedAnswer: 'في السابق كان مطورو ريأكت نيتف يضطرون لتعديل ملفات AppDelegate و AndroidManifest و Gradle يدوياً، مما يجعل ترقية إصدارات React Native كابوساً شاقاً ومعرضاً للتعارضات. في معمارية CNG، تصبح مجلدات الـ Native مجرد ناتج تجميع (Build Artifact) يمكن حذفه وإعادة إنشاؤه بأمر npx expo prebuild بنقاء تام.',
      codeExample: `// لتوليد المجلدات الأصلية أو إعادة بنائها نظيفة:
// npx expo prebuild --clean`,
      commonMistakes: 'تعديل كود الـ Native يدوياً داخل مجلدي android أو ios دون توثيقه في Config Plugin، مما يؤدي لمسحه عند تشغيل prebuild.',
      followUp: 'كيف تسهل معمارية CNG تحديث إصدارات React Native و SDKs الكبيرة في دقائق معدودة؟',
      difficulty: 'senior',
      importance: 'essential',
      tags: ['react-native', 'expo', 'cng', 'prebuild'],
      docUrl: 'https://docs.expo.dev/workflow/prebuild/'
    },
    {
      title: 'ما هي الـ Expo Config Plugins وكيف تسمح بتعديل كود ومكتبات الـ Native بأمان؟',
      shortAnswer: 'هي دوال برمجية بلغة JavaScript/TypeScript تنفذ أثناء npx expo prebuild لتعديل ملفات البناء الأصلية (مثل Info.plist و AndroidManifest.xml و build.gradle) تلقائياً دون لمسها يدوياً.',
      detailedAnswer: 'تسمح الـ Config Plugins لأي مكتبة خارجية بنقل إعداداتها الأصلية إلى ملف app.json أو app.config.js. يمكن للمطور كتابة Plugin مخصص لإضافة أذونات، أو تعديل إعدادات التجميع، أو حقن أكواد في كود البداية (AppDelegate/MainActivity) مع ضمان بقاء الكود نقياً وخالياً من الأخطاء البشرية.',
      codeExample: `// مثال Plugin مخصص لتعديل Info.plist برمجياً:
const { withInfoPlist } = require('@expo/config-plugins');

const withCustomSetting = (config) => {
  return withInfoPlist(config, (config) => {
    config.modResults.NSMicrophoneUsageDescription = "نحتاج الميكروفون لتسجيل الرسائل الصوتية";
    return config;
  });
};

module.exports = withCustomSetting;`,
      commonMistakes: 'محاولة كتابة إضافات Config Plugins معقدة تعتمد على تعديل نصوص عشوائية عبر Regex بدلاً من استخدام الـ Modifiers الهيكلية الرسمية.',
      followUp: 'ما الفرق بين الـ Static Modifiers والـ Dangerous Modifiers في نظام إضافات إكسبو؟',
      difficulty: 'senior',
      importance: 'advanced',
      tags: ['react-native', 'config-plugins', 'expo', 'native-configuration'],
      docUrl: 'https://docs.expo.dev/config-plugins/introduction/'
    },
    {
      title: 'ما هو نظام EAS Build وكيف يختلف عن البناء المحلي على جهاز المطور؟',
      shortAnswer: 'نظام EAS Build هو خدمة سحابية متكاملة تقوم بتشغيل خوادم macOS ولينكس مخصصة ومجهزة بـ Xcode و Android SDK لإنشاء ملفات APK و AAB و IPA دون استهلاك طاقة ومساحة جهاز المطور.',
      detailedAnswer: 'يتطلب بناء تطبيقات iOS محلياً امتلاك جهاز Mac حديث مع تنزيل Xcode بحجم 40 جيجابايت وصيانة شهادات التوقيع. يتيح EAS Build لأي مطور (حتى على أجهزة Windows أو Linux) بناء حزم إنتاجية موقعة ومجهزة للمتاجر بنقرة زر واحدة عبر السحابة، مع إدارة آمنة للشهادات والبيئات المتعددة.',
      codeExample: `// ملف eas.json لتكوين ملفات البناء:
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  }
}`,
      commonMistakes: 'الاعتقاد بأن خدمة EAS Build تتطلب نشر كود التطبيق علنياً أو أنها لا تدعم مشاريع الـ Bare اليدوية.',
      followUp: 'كيف تدعم EAS Build البناء الموازي وتخزين كاش الـ Pods و Gradle لتسريع زمن البناء إلى بضع دقائق؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react-native', 'eas-build', 'cloud-ci', 'expo'],
      docUrl: 'https://docs.expo.dev/build/introduction/'
    },
    {
      title: 'ما هو التحديث عبر الهواء (Over-The-Air - OTA Updates) بواسطة EAS Update ومخاطره؟',
      shortAnswer: 'هو إرسال تحديثات وإصلاحات فورية لحزم الـ JavaScript والأصول إلى أجهزة المستخدمين مباشرة دون الحاجة لإعادة بناء التطبيق أو انتظار مراجعة متجر App Store / Google Play.',
      detailedAnswer: 'عندما تكتشف خطأ برمجياً حرجاً في واجهة المستخدم أو كود الجافاسكربت، يمكنك تشغيل eas update لينزل التحديث في الخلفية على هواتف المستخدمين فور فتح التطبيق. المخاطر تكمن في أن التحديث لا يمكن أن يغير كود الـ Native (مثل إضافة مكتبة أصلية جديدة)، وانتهاك سياسات المتاجر إذا تم استخدامه لتغيير الوظيفة الجوهرية للتطبيق سراً.',
      codeExample: `// إرسال تحديث فوري لقناة الإنتاج:
// eas update --branch production --message "إصلاح خطأ واجهة الدفع"`,
      commonMistakes: 'محاولة إرسال تحديث OTA يحتوي على مكتبة أصلية جديدة تتطلب تعديلات في كود C++/Java/Swift دون إصدار حزمة جديدة للمتاجر، مما يسبب انهيار فوري للتطبيق.',
      followUp: 'كيف يمنع معرف وقت التشغيل (Runtime Version) إرسال تحديثات جافاسكربت غير متوافقة مع إصدار التطبيق المثبت؟',
      difficulty: 'senior',
      importance: 'essential',
      tags: ['react-native', 'eas-update', 'ota', 'hot-patching'],
      docUrl: 'https://docs.expo.dev/eas-update/introduction/'
    },
    {
      title: 'ما هو Expo Dev Client ولماذا حل محل تطبيق Expo Go التقليدي للتطوير الاحترافي؟',
      shortAnswer: 'هو تطبيق مخصص للبناء التجريبي يتضمن كافة مكتبات الـ Native والمواصفات الخاصة بمشروعك مع واجهة تصحيح متطورة، متجاوزاً قيود Expo Go التي تقتصر على مكتبات محددة مسبقاً.',
      detailedAnswer: 'يعد تطبيق Expo Go رائعاً للمبتدئين، لكنه لا يستطيع تشغيل أي مكتبة تتطلب كود Native مخصص أو تكوين خارجي (مثل البلوتوث الخاص أو مشغلات الفيديو المتطورة). يتيح Expo Dev Client للمطور إنشاء نسخته التجريبية الخاصة التي تجمع بين حرية الكود الأصلي الكاملة وسرعة التطوير الفائقة مع الـ Fast Refresh.',
      codeExample: `// تثبيت حزمة عميل التطوير:
// npx expo install expo-dev-client
// ثم البناء:
// eas build --profile development --platform ios`,
      commonMistakes: 'محاولة استيراد مكتبات تتطلب كود C++ أو أذونات متقدمة داخل تطبيق Expo Go العادي.',
      followUp: 'كيف يسهل Dev Client مشاركة النسخ التجريبية مع أعضاء الفريق والعملاء عبر روابط التثبيت الداخلي المباشرة؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react-native', 'expo-dev-client', 'expo-go', 'development-workflow'],
      docUrl: 'https://docs.expo.dev/develop/development-builds/introduction/'
    },
    {
      title: 'كيف تدير المتغيرات البيئية (Environment Variables) في Expo بأمان وموثوقية؟',
      shortAnswer: 'باستخدام بادئة EXPO_PUBLIC_ للمتغيرات المسموح بكشفها في جانب العميل، وحفظ المفاتيح السرية في EAS Secrets واستخدامها فقط أثناء عملية البناء السحابي.',
      detailedAnswer: 'في Expo الحديث، أي متغير يبدأ بـ EXPO_PUBLIC_ (مثل EXPO_PUBLIC_API_URL) يتم تضمينه تلقائياً في شفرة الـ JavaScript ويكون مرئياً في كود العميل. أما المفاتيح الخاصة والحساسة (مثل مفاتيح توقيع الخادم) فيجب ألا تحمل هذه البادئة، ويتم تمريرها عبر eas secret:create لتستخدمها نصوص البناء في الخادم دون تسريبها لملفات العميل.',
      codeExample: `// في ملف .env:
EXPO_PUBLIC_API_URL=https://api.example.com
PRIVATE_DEPLOY_KEY=secret_not_exposed_to_client

// في كود التطبيق:
const apiUrl = process.env.EXPO_PUBLIC_API_URL; // آمن وصحيح`,
      commonMistakes: 'تسمية مفاتيح التشفير السرية ورموز الـ API الخاصة بالدفع ببادئة EXPO_PUBLIC_ مما يجعلها قابلة للاستخراج من ملفات الـ JS.',
      followUp: 'كيف تدير المتغيرات البيئية المختلفة لبيئات التطوير (Dev) والاختبار (Staging) والإنتاج (Prod) في eas.json؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react-native', 'env-vars', 'expo-public', 'security'],
      docUrl: 'https://docs.expo.dev/guides/environment-variables/'
    },
    {
      title: 'ما هي معمارية Expo Modules API وكيف تبسط كتابة وحدات أصلية متوافقة مع Swift و Kotlin؟',
      shortAnswer: 'هي واجهة برمجية عصرية وموحدة لكتابة وحدات Native بلغات Swift و Kotlin الحديثة بتعليمات تصريحية واضحة ودقيقة تشبه لغات البرمجة العصرية، بدلاً من تعقيدات الـ Bridge القديمة.',
      detailedAnswer: 'صممت Expo Modules API لتسهيل كتابة وصيانة كود الـ Native. تتيح كتابة كود Swift و Kotlin بأسلوب DSL مختصر وموحد، وتتكفل تلقائياً بتحويل الأنواع، ودعم الـ Async/Await، ودورة حياة التطبيق، مع دعم فوري لـ TurboModules و JSI والمعمارية الجديدة دون كتابة أكواد C++ يدوية.',
      codeExample: `// كتابة وحدة بنظام Expo Modules API في Swift:
import ExpoModulesCore

public class MyModule: Module {
  public func definition() -> ModuleDefinition {
    Name("MyModule")

    Function("hello") { () -> String in
      return "مرحباً من كود Swift المباشر!"
    }
  }
}`,
      commonMistakes: 'الاعتقاد بأن وحدات Expo Modules تعمل فقط داخل مشاريع Expo، في حين يمكن تثبيتها واستخدامها في أي مشروع React Native خالص.',
      followUp: 'كيف تدعم Expo Modules إنشاء مكونات واجهة رسومية أصلية (View Components) بسهولة؟',
      difficulty: 'senior',
      importance: 'advanced',
      tags: ['react-native', 'expo-modules', 'swift', 'kotlin', 'modern-native'],
      docUrl: 'https://docs.expo.dev/modules/overview/'
    },
    {
      title: 'كيف تدير شاشات البداية والـ Splash Screen الاحترافية باستخدام expo-splash-screen؟',
      shortAnswer: 'باستدعاء SplashScreen.preventAutoHideAsync() لمنع إخفاء الشاشة الافتتاحية تلقائياً، والانتظار حتى اكتمال تحميل الموارد والبيانات الأساسية ثم إخفائها بـ hideAsync() مع حركة تلاشٍ ناعمة.',
      detailedAnswer: 'تعتبر الشاشة الافتتاحية الانطباع الأول للمستخدم. لضمان عدم ظهور شاشات فارغة أو وميض أبيض أثناء تحميل الخطوط أو استرجاع الجلسة المحفوظة، نمنع إخفاء الـ Splash Screen فوراً، ونقوم بتهيئة التطبيق بالخلفية، ثم نطلق إخفاءها بحركة انسيابية عند جاهزية الشاشة الأولى.',
      codeExample: `import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      await loadAppResourcesAsync();
      setAppIsReady(true);
      await SplashScreen.hideAsync();
    }
    prepare();
  }, []);

  if (!appIsReady) return null;
  return <MainNavigator />;
}`,
      commonMistakes: 'نسيان استدعاء SplashScreen.hideAsync() عند حدوث خطأ في استدعاء الموارد، مما يترك التطبيق معلقاً على شاشة الـ Splash للأبد.',
      followUp: 'كيف يتم تكوين ألوان وأبعاد صورة الـ Splash Screen بدقة في ملف app.json لتتوافق مع مختلف مقاسات الشاشات؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react-native', 'splash-screen', 'expo-splash-screen', 'startup-ux'],
      docUrl: 'https://docs.expo.dev/versions/latest/sdk/splash-screen/'
    },
    {
      title: 'ما هي معايير واختبارات القبول الصارمة للـ App Clips (iOS) و Instant Apps (Android) في Expo؟',
      shortAnswer: 'هي أجزاء مصغرة من التطبيق تفتح فورياً من خلال روابط الويب أو رموز NFC دون تثبيت كامل، وتتطلب حداً أقصى لحجم الحزمة (عادة أقل من 10-15 ميجابايت) واستقلالية تامة في الوظيفة.',
      detailedAnswer: 'تتيح تقنية App Clips للمستخدم دفع حساب فاتورة مطعم أو استئجار دراجة فورياً عند مسح رمز الاستجابة السريعة دون تحميل التطبيق الكامل من المتجر. يوفر Expo دعماً لبنائها عبر Config Plugins ومسارات مستقلة في Expo Router مع قيود صارمة جداً على حجم الأصول والمكتبات المستوردة لضمان فتحها في أقل من ثانيتين.',
      codeExample: `// تكوين App Clip كهدف بناء فرعي في Expo عبر إضافات التكوين`,
      commonMistakes: 'استيراد المكتبات الشاملة للتطبيق الكامل داخل كود الـ App Clip مما يتجاوز الحد الأقصى للحجم المصرح به من آبل.',
      followUp: 'كيف تتشارك الـ App Clip البيانات مع التطبيق الكامل عند قيام المستخدم بتثبيته لاحقاً عبر App Groups؟',
      difficulty: 'senior',
      importance: 'advanced',
      tags: ['react-native', 'app-clips', 'instant-apps', 'apple-guidelines'],
      docUrl: 'https://docs.expo.dev/guides/app-clips/'
    },
    {
      title: 'كيف يتم تشخيص وتحليل تقارير الأعطال (Crash Reporting) باستخدام Sentry في تطبيقات Expo؟',
      shortAnswer: 'بدمج حزمة sentry-expo لتسجيل استثناءات كود الجافاسكربت وكود الـ Native والأخطاء غير المعالجة، ورفع ملفات Source Maps تلقائياً أثناء البناء عبر EAS لمعرفة السطر المتسبب في العطل بدقة.',
      detailedAnswer: 'نظراً لأن كود الإنتاج يكون مصغراً ومجمعاً (Minified Bytecode)، فإن تقارير الأعطال الخام تظهر أرقام أسطر مشوهة لا معنى لها. تقوم إضافة Sentry في EAS Build برفع ملفات الـ Source Maps ورموز الـ dSYM الأصلية تلقائياً، لتعرض لك في لوحة التحكم مسار الخطأ بالضبط في ملف الـ TypeScript الأصلي وسياق جهاز المستخدم.',
      codeExample: `import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://your_dsn@sentry.io/project',
  enableInExpoDevelopment: false,
  debug: false,
});

export default Sentry.wrap(App);`,
      commonMistakes: 'عدم رفع ملفات Source Maps و dSYM مما يجعل تتبع الأخطاء في بيئة الإنتاج مستحيلاً بسبب الكود المشفر.',
      followUp: 'كيف تفيد ميزة Breadcrumbs في Sentry في معرفة آخر الشاشات والنقرات التي قام بها المستخدم قبل وقوع الانهيار بثوانٍ؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react-native', 'sentry', 'crash-reporting', 'source-maps'],
      docUrl: 'https://docs.expo.dev/guides/using-sentry/'
    }
  ],
  'react-native-deployment': [
    {
      title: 'ما هي المتطلبات الصارمة لنشر التطبيقات على متجر Apple App Store ومراجعات إرشادات آبل؟',
      shortAnswer: 'الالتزام بحذف الحساب المباشر من داخل التطبيق، واستخدام Apple In-App Purchase للمنتجات الرقمية، وتوفير رابط سياسة الخصوصية، وتبرير كافة الأذونات المطلوبة في Info.plist، وتوفير حساب تجريبي صالح للمراجعة.',
      detailedAnswer: 'تعتبر مراجعة آبل هي الأدق والأكثر صرامة في الصناعة. أكثر أسباب الرفض شيوعاً هي: عدم عمل أزرار تسجيل الدخول الاجتماعي (Sign in with Apple إلزامي إذا كان هناك خيارات أخرى كـ Google أو Facebook)، والروابط المكسورة، وغياب زر صريح لحذف الحساب وحذف كافة بيانات المستخدم فورياً، واستخدام بوابات دفع خارجية لشراء العملات الافتراضية أو الاشتراكات الرقمية.',
      codeExample: `// شرط إلزامي من آبل: توفير زر حذف الحساب النهائي
async function handleDeleteAccount() {
  Alert.alert('تأكيد الحذف', 'سيتم حذف حسابك وكافة بياناتك نهائياً ولن تتمكن من استعادتها.', [
    { text: 'إلغاء', style: 'cancel' },
    { text: 'حذف نهائي', style: 'destructive', onPress: executeAccountDeletion }
  ]);
}`,
      commonMistakes: 'استخدام بوابات دفع كـ Stripe أو PayPal لشراء ميزات رقمية داخل التطبيق بدلاً من نظام Apple In-App Purchases الإلزامي.',
      followUp: 'ما هي متطلبات إشعار App Tracking Transparency (ATT) عند استخدام أي مكتبات إعلانية أو تتبعية؟',
      difficulty: 'senior',
      importance: 'essential',
      tags: ['react-native', 'app-store', 'apple-review-guidelines', 'deployment'],
      docUrl: 'https://reactnative.dev/docs/publishing-to-app-store'
    },
    {
      title: 'كيف تعد تطبيق أندرويد للنشر على متجر Google Play وما هي صيغة Android App Bundle (AAB)؟',
      shortAnswer: 'صيغة AAB هي المعيار الإلزامي في متجر Google Play، حيث تتضمن كافة الأكواد والموارد، ويقوم المتجر بإنشاء وتقديم ملفات APK مخصصة ومصغرة لكل جهاز مستخدم بناءً على لغته وكثافة شاشته ومعمارية معالجه.',
      detailedAnswer: 'لم يعد متجر جوجل يقبل ملفات APK التقليدية للتطبيقات الجديدة. يتطلب النشر إنشاء مفتاح توقيع رقمي للمطور (Keystore)، وتهيئة إعدادات البناء في gradle، وتفعيل Google Play App Signing، والتأكد من مطابقة التطبيق لمستوى Target SDK الأحدث المطلوب سنوياً من شركة Google.',
      codeExample: `// توليد مفتاح التوقيع في التيرمينال:
// keytool -genkey -v -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000`,
      commonMistakes: 'فقدان مفتاح التوقيع الأصلي (Keystore) قبل تفعيل Google Play App Signing، مما يجعل تحديث التطبيق على المتجر مستحيلاً للأبد.',
      followUp: 'ما هي متطلبات نموذج إعلان أمان البيانات (Data Safety Section) الإلزامية في لوحة تحكم Google Play Console؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react-native', 'google-play', 'aab', 'keystore', 'android-signing'],
      docUrl: 'https://reactnative.dev/docs/signed-apk-android'
    },
    {
      title: 'كيف تدير شهادات التوقيع الرقمي (Code Signing) في iOS باستخدام Fastlane Match؟',
      shortAnswer: 'يقوم Fastlane Match بأتمتة إدارة شهادات التطوير والتوزيع وملفات التعريف (Provisioning Profiles) ومشاركتها بأمان وتشفير كامل عبر مستودع Git خاص مشفر بين كافة أعضاء الفريق وسيرفرات CI/CD.',
      detailedAnswer: 'تعتبر مشاكل شهادات iOS وكود التوقيع من أكثر العقبات إرباكاً للمطورين. يقوم نمط Match بحل المشكلة مركزياً: بدلاً من قيام كل مطور بإنشاء شهادات عشوائية خاصة به وإفساد حساب المطورين، يتم توليد شهادة توزيع موحدة وتشفيرها بواسطة كلمة مرور، ويقوم Fastlane بمزامنتها تلقائياً على أي جهاز أو سيرفر بضغطة زر واحدة.',
      codeExample: `// في ملف Fastfile:
lane :release do
  match(type: "appstore", readonly: is_ci)
  build_app(workspace: "MyApp.xcworkspace", scheme: "MyApp")
  upload_to_app_store
end`,
      commonMistakes: 'انتهاء صلاحية شهادات التوزيع دون تجديدها قبل موعد التجميع التلقائي في خطوط الـ CI/CD.',
      followUp: 'كيف تتكامل خدمة EAS Credentials السحابية كبديل متكامل يغني عن إعداد Fastlane Match يدوياً؟',
      difficulty: 'senior',
      importance: 'advanced',
      tags: ['react-native', 'fastlane', 'code-signing', 'ios-certificates'],
      docUrl: 'https://reactnative.dev/docs/publishing-to-app-store'
    },
    {
      title: 'ما هي استراتيجيات توزيع النسخ التجريبية للمختبرين (TestFlight & Internal App Sharing)؟',
      shortAnswer: 'استخدام TestFlight لنظام iOS لإرسال النسخ تلقائياً للمختبرين الداخليين والخارجيين (حتى 10,000 مختبر)، واستخدام Internal Testing أو Firebase App Distribution لنظام أندرويد للتوزيع الفوري.',
      detailedAnswer: 'يوفر TestFlight إمكانية فحص سلوك التطبيق في بيئة مطابقة تماماً للمتجر الحقيقي، مع جمع لقطات الشاشة وتقارير الأعطال من المستخدمين مباشرة. في أندرويد، تتيح مسارات الفحص الداخلي (Internal Testing Tracks) في Google Play تحديث النسخ للمختبرين في دقائق معدودة وبدون الحاجة لانتظار مراجعة جوجل الطويلة.',
      codeExample: `// رفع نسخة تجريبية فورية لـ TestFlight و Google Internal عبر EAS:
// eas build --profile preview --auto-submit`,
      commonMistakes: 'توزيع ملفات APK عادية غير موقعة بشهادات إنتاجية لاختبار ميزات تعتمد على خدمات المتاجر كالشراء داخل التطبيق أو إشعارات الإنتاج.',
      followUp: 'ما الفرق بين فئات المختبرين الداخليين (Internal Testers - بدون مراجعة آبل) والمختبرين الخارجيين (External Testers) في TestFlight؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react-native', 'testflight', 'internal-testing', 'qa-distribution'],
      docUrl: 'https://docs.expo.dev/distribution/uploading-apps/'
    },
    {
      title: 'كيف تبني خط أتمتة مستمر (CI/CD Pipeline) متكامل لمشاريع React Native باستخدام GitHub Actions؟',
      shortAnswer: 'بإنشاء Workflow يقوم بالتحقق من جودة الكود والفحص الساكن (Lint, Typecheck, Unit Tests)، ثم استدعاء EAS CLI أو Gradle/Fastlane لبناء الحزم وتوزيعها تلقائياً عند الدمج في فرع main.',
      detailedAnswer: 'يضمن خط الـ CI/CD عدم دمج أي كود يكسر البناء الأصلي. يتضمن الخط خطوات تثبيت الاعتماديات مع كاش سريع، وتشغيل اختبارات Jest، والتحقق من سلامة نصوص TypeScript، ثم استدعاء eas-cli بمفتاح EXPO_TOKEN لبناء حزم الإنتاج ورفعها تلقائياً لمتاجر التطبيقات دون تدخل بشري يدوي.',
      codeExample: `name: CI/CD Pipeline
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'npm' }
      - run: npm ci
      - run: npm run lint
      - run: npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: \${{ secrets.EXPO_TOKEN }}
      - run: eas build --platform all --profile production --non-interactive`,
      commonMistakes: 'محاولة بناء مشاريع iOS الأصلية على خوادم أوبونتو في GitHub Actions بدلاً من خوادم macos-runner أو استخدام EAS السحابي.',
      followUp: 'كيف تحمي مفاتيح التوقيع والـ Tokens الحساسة داخل GitHub Encrypted Secrets لمنع تسريبها؟',
      difficulty: 'senior',
      importance: 'essential',
      tags: ['react-native', 'github-actions', 'ci-cd', 'automation'],
      docUrl: 'https://docs.expo.dev/build-reference/gh-actions/'
    },
    {
      title: 'ما هي استراتيجيات الترقية الدورية لإصدارات React Native (Upgrading Strategy)؟',
      shortAnswer: 'بالاعتماد على أداة React Native Upgrade Helper لمقارنة الفروقات الدقيقة بين الإصدارات سطراً بسطر، أو استخدام npx expo install --fix لتحديث كافة الحزم المتوافقة تلقائياً.',
      detailedAnswer: 'تعتبر ترقية إصدارات React Native الخالصة عملية حساسة لتغير إعدادات Gradle و Xcode و C++ Dependencies. توفر أداة Upgrade Helper موقعاً يقارن الملفات الأصلية لنسختك الحالية مع النسخة المستهدفة لدمج التعديلات بدقة. أما في مشاريع Expo، فإن الترقية تقتصر على ترقية رقم SDK وسيقوم أمر التثبيت بضبط كافة التبعيات المتوافقة تلقائياً.',
      codeExample: `// ترقية مشروع إكسبو للإصدار الأحدث بأمان:
// npx expo install expo@latest
// npx expo install --fix`,
      commonMistakes: 'تحديث رقم إصدار react-native في package.json عشوائياً دون تحديث ملفات البناء في مجلدي android و ios المتطابقين.',
      followUp: 'كيف يساهم تشغيل اختبارات E2E ومسارات الـ Smoke Tests في التحقق السريع من نجاح الترقية قبل النشر؟',
      difficulty: 'senior',
      importance: 'essential',
      tags: ['react-native', 'upgrade-helper', 'maintenance', 'dependencies'],
      docUrl: 'https://reactnative.dev/docs/upgrading'
    },
    {
      title: 'كيف تدير أرقام الإصدارات (Versioning) بين versionCode و versionName و CFBundleVersion؟',
      shortAnswer: 'يمثل versionName (في أندرويد) و CFBundleShortVersionString (في iOS) رقم الإصدار الظاهر للمستخدم (مثل 1.2.0)، بينما versionCode و CFBundleVersion يمثلان رقم البناء الداخلي التراكمي الإلزامي لكل رفع جديد للمتجر.',
      detailedAnswer: 'ترفض المتاجر رفع أي حزمة جديدة تحمل نفس رقم البناء (Build Number) لحزمة سابقة. يجب زيادة رقم البناء مع كل رفع تجريبي أو إنتاجي (مثل 101 ثم 102). يمكن أتمتة هذه الزيادة تلقائياً في أدوات مثل EAS Build عبر إعداد autoIncrement: true لتجنب أخطاء رفض الحزم بسبب تكرار الأرقام.',
      codeExample: `// في app.json:
{
  "expo": {
    "version": "1.2.0", // رقم النسخة العام للمستخدمين
    "ios": {
      "buildNumber": "15" // رقم البناء التراكمي الإلزامي لـ Apple
    },
    "android": {
      "versionCode": 15 // رقم صحيح متزايد إلزامي لـ Google
    }
  }
}`,
      commonMistakes: 'محاولة رفع تحديث جديد للمتجر بنفس رقم versionCode أو buildNumber السابق مما يؤدي لرفض الحزمة فورياً من خوادم المتجر.',
      followUp: 'كيف تطبق معايير Semantic Versioning (SemVer) للتمييز بين التحديثات الفرعية والإصلاحية والجوهرية؟',
      difficulty: 'junior',
      importance: 'essential',
      tags: ['react-native', 'versioning', 'build-number', 'store-deployment'],
      docUrl: 'https://docs.expo.dev/workflow/configuration/'
    },
    {
      title: 'ما هي الفحوصات الأمنية وقواعد حماية الكود المصدري ضد الهندسة العكسية (Reverse Engineering)؟',
      shortAnswer: 'بتفعيل Hermes لتشفير الكود إلى Bytecode، واستخدام ProGuard/R8 لتشويش كود أندرويد الأصلي، وتفعيل شهادات التثبيت الآمن (SSL Pinning) لمنع اعتراض هجمات Man-In-The-Middle.',
      detailedAnswer: 'في تطبيقات الهاتف، يمكن لأي شخص استخراج ملف الـ APK أو IPA وقراءة أكواد الـ JavaScript إذا كانت نصوصاً صريحة. استخدام Hermes يحول الكود إلى ملف Bytecode ثنائي يصعب تفكيكه. كما يحمي SSL Pinning حركة البيانات الشبكية من الاعتراض عبر أدوات مثل Charles أو Burp Suite عبر التحقق الصارم من شهادة الخادم.',
      codeExample: `// التحقق من سلامة بيئة الهاتف (Jailbreak / Root Detection):
import * as Device from 'expo-device';

async function verifyDeviceSecurity() {
  const isRooted = await Device.isRootedExperimentalAsync();
  if (isRooted) {
    // إيقاف تشغيل المعاملات الحساسة
    throw new Error("لا يمكن تشغيل التطبيق على أجهزة مكسورة الحماية");
  }
}`,
      commonMistakes: 'تضمين مفاتيح API الخاصة بالخادم أو الـ Private Keys داخل كود التطبيق ظناً أنه كود محمي من القراءة.',
      followUp: 'كيف تمنع لقطات الشاشة وتسجيل الفيديو في الشاشات الحساسة (مثل شاشات البنوك) باستخدام FlagSecure؟',
      difficulty: 'senior',
      importance: 'advanced',
      tags: ['react-native', 'security', 'ssl-pinning', 'obfuscation', 'reverse-engineering'],
      docUrl: 'https://reactnative.dev/docs/security'
    },
    {
      title: 'كيف تدير الشراء داخل التطبيق (In-App Purchases - IAP) واشتراكات المتاجر باستخدام RevenueCat؟',
      shortAnswer: 'باستخدام منصة ومكتبة RevenueCat (react-native-purchases) لإدارة الاشتراكات عبر iOS و Android بواجهة برمجية موحدة تتكفل بالتحقق من الإيصالات، وتجديد الاشتراكات، والتعامل مع فترات السماح.',
      detailedAnswer: 'تعتبر إدارة الاشتراكات مباشرة مع Apple StoreKit و Google Play Billing من أصعب المهام لكثرة الحالات المعقدة (الإلغاء، الاسترجاع، انتهاء البطاقة، الترقية). توفر RevenueCat خطافات مسبقة الصنع واستجابات مشفرة من السيرفر، مع فحص حالة الصلاحية entitlement فورياً لتفعيل الميزات المدفوعة للمستخدم.',
      codeExample: `import Purchases from 'react-native-purchases';

async function initIAP(userId: string) {
  Purchases.configure({ apiKey: "public_revcat_key", appUserID: userId });
}

async function buyProSubscription(packageToBuy: any) {
  try {
    const { customerInfo } = await Purchases.purchasePackage(packageToBuy);
    if (customerInfo.entitlements.active['pro_access']) {
      // تفعيل ميزات الحساب المدفوع بنجاح
    }
  } catch (e: any) {
    if (!e.userCancelled) console.error(e);
  }
}`,
      commonMistakes: 'الاعتماد على إيصال الشراء المباشر من جهاز المستخدم دون التحقق منه عبر خادم خلفي آمن لمنع الشراء الوهمي عبر أدوات الاختراق.',
      followUp: 'ما هي سياسة الـ Grace Period وكيف تحافظ على وصول المستخدم مؤقتاً عند تعثر تجديد اشتراكه البنكي؟',
      difficulty: 'senior',
      importance: 'essential',
      tags: ['react-native', 'in-app-purchases', 'revenuecat', 'subscriptions', 'storekit'],
      docUrl: 'https://docs.expo.dev/guides/in-app-purchases/'
    },
    {
      title: 'ما هي معايير إطلاق التحديثات التدريجية (Phased / Staged Rollouts) وكيف تنقذك من الكوارث غير المكتشفة؟',
      shortAnswer: 'بإطلاق النسخة الجديدة لنسبة مئوية صغيرة من المستخدمين أولاً (مثل 1% ثم 5% ثم 20% ثم 100%) ومراقبة تقارير الأخطاء ومعدل الانهيار (Crash Rate) قبل تعميمها للجميع.',
      detailedAnswer: 'مهما كانت الاختبارات دقيقة، قد تظهر مشاكل نادرة على أنواع معينة من الأجهزة لا تظهر في بيئة الاختبار. توفر كل من Apple (Phased Release على مدى 7 أيام) و Google (Staged Rollout بالنسبة المئوية المخصصة) خيار النشر التدريجي. في حال اكتشاف انهيار حاد، يمكن إيقاف النشر فوراً وتثبيت النسخة للمتضررين دون التأثير على ملايين المستخدمين الآخرين.',
      codeExample: `// جدول الإطلاق التدريجي في App Store:
// اليوم 1: 1%
// اليوم 2: 2%
// اليوم 3: 5%
// اليوم 4: 10%
// اليوم 5: 20%
// اليوم 6: 50%
// اليوم 7: 100%`,
      commonMistakes: 'النشر الفوري بنسبة 100% لكافة المستخدمين لتحديث رئيسي يتضمن إعادة هيكلة شاملة للتطبيق أو قواعد البيانات.',
      followUp: 'ما هو مؤشر Crash-free Users الذي تحدده الفرق كخط أحمر لوقف التحديث التدريجي فور انخفاضه عن 99.5%؟',
      difficulty: 'mid',
      importance: 'essential',
      tags: ['react-native', 'staged-rollout', 'phased-release', 'risk-management'],
      docUrl: 'https://docs.expo.dev/distribution/uploading-apps/'
    }
  ]
};

function main() {
  const outputFilePath = path.resolve(process.cwd(), 'src/content/react-native-questions.ts');

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
      const slugSuffix = q.tags.filter(t => t !== 'react-native').join('-') || 'concept';
      const slug = `rn-${slugSuffix}-${numStr}`;

      questions.push({
        id: questionId,
        slug,
        trackId: 'react-native',
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

  console.log(`Generating React Native questions: ${totalQuestions}`);

  const fileHeader = `// Generated by scripts/build-react-native-questions.ts
import type { InterviewQuestion } from "./questions.ts";

export const reactNativeBaseQuestions: Omit<InterviewQuestion, "translations">[] = `;

  const fileContent = `${fileHeader}${JSON.stringify(questions, null, 2)};\n`;

  fs.writeFileSync(outputFilePath, fileContent, 'utf-8');
  console.log(`Successfully generated ${outputFilePath} with ${totalQuestions} questions.`);
}

main();
