import React, { useEffect, useRef } from 'react'
import { Animated, ImageBackground, StyleSheet, Text, View } from 'react-native'
import { wp } from '../../../Services/hooks/ResponsivePercentage'
import { useTranslation } from '../../../Services/hooks/useTranslation'

const PrivacyPolicyScreen = () => {
    const { language } = useTranslation()
    const fadeAnim = useRef(new Animated.Value(0)).current
    const slideAnim = useRef(new Animated.Value(40)).current // Initial position off-screen
    const scaleAnim = useRef(new Animated.Value(0)).current // Initial scale

    useEffect(() => {
        Animated.timing(scaleAnim, {
            toValue: 1, // Final scale
            duration: 700,
            useNativeDriver: true,
        }).start()
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start()
    }, [scaleAnim, fadeAnim])

    const sectionsAr = [
        {
            id: 0,
            title: 'مقدمة',
            content: `مرحبًا بكم في سياسة الخصوصية الخاصة بشركة رتال للتطوير العمراني.

تؤكد رتال على احترامها خصوصيّتك، والتزامها بحماية بياناتك الشخصية. من خلال سياسة الخصوصية هذه، ستتعرّف على كيفية الاعتناء ببياناتك الشخصية عند زيارتك لموقعنا الإلكتروني www.retal.com.sa
(بغض النظر عن مكان زيارتك له)، وسنخبرك بحقوق خصوصيتك والحماية القانونية التي تتمتع بها.`,
        },
        {
            id: 1,
            title: 'المعلومات المهمة',
            content: `الغرض من سياسة الخصوصية

تزوّدك سياسة الخصوصيّة هذه بمعلومات حول ما تقوم به رتال لجمع بياناتك الشخصية ومعالجتها عبر استخدام هذا الموقع الإلكتروني، بما في ذلك أي بيانات قد تقدّمها عبر الموقع.

من المهم قراءة سياسة الخصوصية هذه مع أي سياسة خصوصية أخرى أو سياسة معالجة عادلة قد نقدمها في مناسبات محددة عندما نقوم بجمع أو معالجة بياناتك الشخصية، حتى تكون على دراية تامة بكيفية وأسباب استخدامنا لبياناتك. وتأتي سياسة الخصوصية هذه لتستكمل بقية الإشعارات وسياسات الخصوصية دون تجاوزها.

الجهة الرقابيّة

تعتبر رتال الجهة الرقابية المسؤولة عن بياناتك الشخصية (يشار إليها مجتمعة في سياسة الخصوصية هذه باسم “رتال” أو “نحن” أو “لنا”).

تفاصيل جهات الاتصال

للإجابة عن أي استفسار حول سياسة الخصوصية هذه أو ممارساتنا المعنية بالخصوصية ، يرجى التواصل مع مدير الامتثال عبر القنوات التالية

الموقع الإلكتروني : compliance@retal.com.sa

العنوان البريدي: 1448، الخبر 31952، المملكة العربية السعودية

التغييرات في سياسة الخصوصية وواجبك لإعلامنا بالتغييرات

نحن نحافظ على إجراء مراجعة دورية لسياستنا المعنية بالخصوصية.

من المهم أن تكون البيانات الشخصية التي نحتفظ بها عنك دقيقة وحديثة. يرجى إبلاغنا في حال تغيرت بياناتك الشخصية أثناء علاقتك معنا.

روابط من أطراف ثالثة

قد يحتوي هذا الموقع الإلكتروني على روابط لمواقع إلكترونية أو مكوّنات إضافية أو تطبيقات تخصّ أطرافًا ثالثة. وقد يسمح النقر على تلك الروابط، أو تمكين هذه الروابط، لأطراف ثالثة بجمع بيانات عنك أو مشاركتها. نحن لا نمتلك قدرة التحكم بالمواقع الإلكترونية الخارجية تلك، ولا نتحمل مسؤولية بيانات خصوصيتها. وعندما تغادر موقعنا، ندعوك لقراءة سياسة خصوصية جميع المواقع الإلكترونية التي تزورها.`,
        },
        {
            id: 2,
            title: 'البيانات التي نجمعها عنك',
            content: `البيانات الشخصية، أو المعلومات الشخصية، يُقصد بها أي معلومات تتيح التعرّف على هذا الشخص. ولا تشمل البيانات التي تمت إزالة الهوية فيها (بيانات مجهولة). قد نعمد إلى جمع واستخدام وتخزين ونقل أنواع مختلفة من البيانات الشخصية عنك، والتي جمعناها معًا على النحو التالي:

•بيانات الهوية بيانات الهوية تتضمن الاسم الأول، والاسم الأوسط والاسم الأخير، واسم المستخدم أو أي اسم معرّف مماثل، والحالة الاجتماعية، واللقب وتاريخ الميلاد والجنس.

•بيانات جهات الاتصال بيانات جهات الاتصال وتتضمن عنوان الفواتير، وعنوان التسليم، والبريد الإلكتروني وأرقام الهواتف.

•البيانات الماليّة وتتضمن الحساب المصرفي، وتفاصيل بطاقة الدفع.

•بيانات التعاملات التجارية وتتضمن تفاصيل حول المدفوعات الواردة إليك، والصادرة عنك، وتفاصيل أخرى عن المنتجات والخدمات التي اشتريتها منا.

•بيانات الملف الشخصي تتضمن ما يخصّك من اسم المستخدم وكلمة المرور، والمشتريات وطلبات الشراء، وتفضيلاتك واهتماماتك وملاحظاتك وإجاباتك عن الاستبيانات.

•البيانات التقنية قد تتضمن البيانات الفنيّة عنوان بروتوكول الإنترنت (IP)، وبيانات تسجيل الدخول، ونوع المتصفح وإصداره، وإعدادات المنطقة الزمنية والموقع، وأنواع وإصدارات التوصيل بالمتصفح، ونظام التشغيل والمنصة، وغيرها من التقنيات على الأجهزة التي تستخدمها للوصول إلى هذا الموقع.

•بيانات الملف الشخصي تتضمن ما يخصّك من اسم المستخدم وكلمة المرور، والمشتريات وطلبات الشراء، وتفضيلاتك واهتماماتك وملاحظاتك وإجاباتك عن الاستبيانات.

•بيانات الاستخدام تتضمن معلومات حول كيفية استخدامك لموقعنا ومنتجاتنا وخدماتنا.

•بيانات التسويق والاتصالات تتضمن تفضيلاتك المعنية بالتسويق واستلام المشتريات منا أو من الأطراف الخارجية، وتفضيلات التواصل الخاصة بك.

إذا لم تتمكن من تقديم البيانات الشخصية
عندما نحتاج إلى جمع البيانات الشخصية بموجب القانون أو شروط العقد المبرم بيننا، ولم تتمكن من تقديم تلك البيانات عند الطلب، قد نعجز عن تنفيذ العقد الذي نبرمه أو نحاول إبرامه معك (على سبيل المثال، تزويدك بالسلع أو الخدمات). وفي هذه الحالة، قد نضطر إلى إلغاء منتج أو خدمة لديك معنا.

كيف يتم جمع بياناتك الشخصية؟
نستخدم أساليب مختلفة لجمع البيانات منك، ومن بينها:

•التفاعلات المباشرة، بإمكانك تزويدنا بهويتك وبيانات الاتصال بك، وبياناتك المالية، عبر تعبئة النماذج، أو التواصل معنا عبر البريد أو الهاتف أو البريد الإلكتروني أو غيرها.

•التفاعلات أو التقنيات الآلية،خلال عملية تفاعلك مع موقعنا الإلكتروني، سنعمل تلقائيًا على جمع البيانات الفنية الخاصة بمعدّاتك وأنماط وإجراءات التصفّح. وسنجمع هذه البيانات الشخصية اعتمادًا على ملفات تعريف الارتباط سجلات الخادم وغيرها من التقنيات المماثلة. قد نتلقى أيضًا بيانات فنية عنك إذا قمت بزيارة مواقع إلكترونية أخرى تستخدم ملفات تعريف الارتباط لدينا

•بيانات الاتصال والشؤون المالية والمعاملات من مزوّدي الخدمات الفنية وخدمات الدفع والتسليم.

•بيانات الهوية والاتصال من وسطاء البيانات أو جهات التجميع.

•بيانات الهوية والاتصال من المصادر المتاحة للجمهور.`,
        },
        {
            id: 3,
            title: 'متى نستخدم بياناتك الشخصية ؟',
            content: `لن نستخدم بياناتك الشخصية إلا وفقًا لما تسمح به اللأنظمة واللوائح المعمول بها في المملكة العربية السعودية. وفي الغالب، سنستخدم بياناتك الشخصية في الحالات التالية:

•عندما نحتاج إلى تنفيذ العقد المبرم معك أو الذي نحن بصدد توقيعه معك.

•عندما يكون هذا الأمر ضروريًا لمصلحتنا المشروعة (أو مصالح طرف ثالث) دون أن تتجاوز مصالحك وحقوقك الأساسية تلك المصالح.

•حين تود التقدم بطلب للحصول على عمل.

•حيث ينبغي علينا الامتثال لالتزام قانوني.

الأغراض التي سنستخدم بياناتك الشخصية من أجلها
قد نعالج بياناتك الشخصية لأكثر من أساس قانوني واحد اعتمادًا على الغرض المحدد الذي نستخدم من أجله بياناتك.
عروضنا الترويجيّة

قد نستخدم هويتك، وما يخصّك من بيانات اتصال وبيانات فنية وبيانات الاستخدام وبيانات الملف الشخصي لتكوين رؤية حول ما نعتقد أنك قد تريده أو تحتاج إليه، أو ما قد يهمك. وبهذه الطريقة، نتخذ القرار بشأن المنتجات والخدمات والعروض التي قد تكون ذات صلة بك (ندعو ذلك بالتسويق).

ستتلقى منا رسائل تسويقية إذا كنت قد طلبت معلومات منا، أو اشتريت وحدة عقارية منا، ولم تمانع تلقّي المزيد من إعلانات التسويق.
خيار الانسحاب

يمكنك أن تطلب منا التوقف عن توجيه رسائل تسويقية لك في أي وقت عبر تسجيل الدخول إلى الموقع الإلكتروني وتحديد مربعات الاختيار ذات الصلة، أو إلغاء تحديدها لضبط تفضيلاتك التسويقية، أو عبر اتباع روابط الاشتراك في أي رسالة تسويقية موجهة إليك، أو عبر الاتصال بنا في أي وقت..

إذا اخترت الانسحاب من تلقي هذه الرسائل التسويقية، فلن ينطبق ذلك على البيانات الشخصية المقدمة إلينا نتيجة شراء منتج أو خدمة أو تسجيل الضمان أو تجربة المنتج/الخدمة أو غيرها من المعاملات.
جمع المعلومات الحاسوبية مجهولة المصدر /”ملفات تعريف الارتباط”

كغيره من المواقع الإلكترونية، يجمع هذا الموقع الإلكتروني معلومات مجهولة المصدر تعرف باسم “ملفات تعريف الارتباط” إذا تم تعيين جهاز الكمبيوتر الخاص بك للسماح بهذا النوع من الجمع أو، عند الحاجة، موافقتك على ملفات تعريف الارتباط. “ملفات تعريف الارتباط” عبارة عن بيانات يرسلها موقع إلكتروني ليتم تخزينها على متصفّح الويب الخاص بمستخدم الموقع الإلكتروني، بينما يتصفح المستخدم موقعًا إلكترونيًا. وتتيح ملفات تعريف الارتباط تعزيز تجربتك في الموقع عبر مساعدتنا في فهم كيفية استخدام المستخدم للموقع وتقييم أداء الموقع.

تغيير الغرض
لن يتم استخدام بياناتك الشخصية إلا للأغراض التي جمعناها لها، ما لم نعتبر بشكل معقول أننا بحاجة إلى استخدامها لسبب آخر متوافق مع الغرض الأصلي.
يرجى ملاحظة أنه يجوز لنا معالجة بياناتك الشخصية دون علمك أو موافقتك، وفقًا للقواعد المذكورة أعلاه، عندما يكون ذلك مطلوبًا أو مسموحًا به بموجب القانون.`,
        },
        {
            id: 4,
            title: 'الإفصاح عن بياناتك الشخصية',
            content: `قد نشارك بياناتك الشخصية مع الشركات التابعة لنا أو الجهات الخارجية الأخرى التي تستعين بمصادر خارجية لخدمات معينة في مثل هذه الحالة ، سنضمن التزام موفري الخدمات لدينا بتنفيذ تدابير حماية وأمن البيانات الكافية والحفاظ عليها ، وإذا طُلب منا الامتثال للقوانين واللوائح المعمول بها ، لفرض التزام تعاقدي معك ، وفي حالة إعادة التنظيم أو الدمج أو سحب الاستثمارات أو أي بيع آخر لبعض أو كل أصولنا أو مخزوننا.`,
        },
        {
            id: 5,
            title: 'لتحويلات الدولية',
            content: `عندما ننقل بيانات الشخصية الى خارج المملكة العربية السعودية، فإننا نضمن منحها درجة مماثلة من بيع أخرى لبعض أو جميع أصولنا أو أسهمنا . ., …`,
        },
        {
            id: 6,
            title: 'أمن البيانات',
            content: `وضعنا تدابير أمنية مناسبة لمنع الفقدان العرَضي لبياناتك الشخصية أو استخدامها أو الوصول إليها بطريقة غير مصرح بها أو تغييرها أو الإفصاح عنها. وإضافة إلى ذلك ، نحد من الوصول إلى بياناتك الشخصية للموظفين والوكلاء والمقاولين وغيرهم من الأطراف الخارجية التي لديها حاجة عملية لمعرفة تلك البيانات. وسيتولون معالجة بياناتك الشخصية فقط بناءً على تعليماتنا، وسيكونون ملتزمين بالحفاظ على السرّية.`,
        },
        {
            id: 7,
            title: 'حقوقك القانونية و الاحتفاظ بالبيانات',
            content: `لن نحتفظ ببياناتك الشخصية إلا وفقًا للأنظمة والقوانين واللوائح المعمول بها وبقدر ما يكون ضروريًا بشكل معقول لتحقيق الأغراض التي جمعناها، بما في ذلك تلبية أي متطلبات قانونية أو تنظيمية أو ضريبية أو محاسبية أو إعداد تقارير. قد نحتفظ ببياناتك الشخصية لفترة أطول في حالة تقديم شكوى أو إذا كنا نعتقد بوجود احتمال للتقاضي فيما يتعلق بعلاقتنا معك.`,
        },
        {
            id: 8,
            title: 'حقوقك القانونية',
            content: `تمتلك الحق في:

عادةً، لا توجد رسوم مفروضة لن تضطر إلى دفع رسوم للوصول إلى بياناتك الشخصية (أو لممارسة أي من الحقوق الأخرى).
طلب الوصول إلى بياناتك الشخصية (المعروف باسم “طلب وصول صاحب البيانات”) ويتيح لك ذلك الحصول على نسخة من البيانات الشخصية التي نحتفظ بها عنك، والتحقق من معالجتنا لها بشكل قانوني.

طلب تصحيح بياناتك الشخصية التي نحتفظ بها عنك. يتيح لك ذلك تصحيح أي بيانات غير مكتملة أو غير دقيقة نحتفظ بها، على الرغم من أننا قد نحتاج إلى التحقق من دقة البيانات الجديدة التي تقدمها لنا.

طلب حذف بياناتك الشخصية. يتيح لك ذلك التقدم بطلب لحذف أو إزالة البيانات الشخصية في حال عدم وجود سبب وجيه لمواصلة معالجتها. ويحق لك طلب حذف أو إزالة بياناتك الشخصية عندما تمارس بنجاح حقك في الاعتراض على المعالجة، حيث ربما أخطأنا في معالجة معلوماتك بشكل غير قانوني، أو عندما يطلب منا مسح بياناتك الشخصية للامتثال للقانون المحلي. ومع ذلك، تجدر الإشارة إلى أنه قد لا نتمكن دائمًا من الامتثال لطلبك للمسح لأسباب قانونية محددة سيتم إخطارك بها، عند الاقتضاء، في وقت طلبك.

سحب الموافقة في أي وقت نعتمد فيه على الموافقة على معالجة بياناتك الشخصية. ومع ذلك، لن يؤثر ذلك على قانونية أي عملية تتم قبل سحب موافقتك. إذا سحبت موافقتك، قد لا نتمكن من تزويدك بمنتجات أو خدمات معينة. وسنبلغك بما إذا كان هذا هو الحال وقت سحب موافقتك.`,
        },
    ]

    const sectionsEn = [
        {
            id: 0,
            title: 'Introduction',
            content: `Welcome to the Retal Urban Development Company (Retal) privacy policy.

Retal respects your privacy and is committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website www.retal.com.sa (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.`,
        },
        {
            id: 1,
            title: 'IMPORTANT INFORMATION',
            content: `Purpose of this privacy policy

This privacy policy aims to give you information on how Retal collects and processes your personal data through your use of this website, including any data you may provide through this website.

It is important that you read this privacy policy together with any other privacy policy or fair processing policy we may provide on specific occasions when we are collecting or processing personal data about you so that you are fully aware of how and why we are using your data. This privacy policy supplements other notices and privacy policies if any and is not intended to override them.

Controller

Retal is the controller and responsible for your personal data (collectively referred to as “Retal”, “we”, “us” or “our” in this privacy policy).

Contact details

If you have any questions about this privacy policy or our privacy practices, please contact our Compliance Department in the following way:

Email address: compliance@retal.com.sa

Postal address: 1448, Khobar 31952, KSA

Changes to the privacy policy and your duty to inform us of changes

We keep our privacy policy under regular review.

It is important that the personal data we hold about you is accurate and current. Please keep us informed if your personal data changes during your relationship with us.

Third-party links

This website may include links to third-party websites, plug-ins and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements. When you leave our website, we encourage you to read the privacy policy of every website you visit.`,
        },
        {
            id: 2,
            title: 'THE DATA WE COLLECT ABOUT YOU',
            content: `Personal data, or personal information, means any information about an individual from which that person can be identified. It does not include data where the identity has been removed (anonymous data). We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:

•Identity Data includes first name, middle name, last name, username or similar identifier, marital status, title, date of birth and gender.

•Contact Data includes billing address, delivery address, email address and telephone numbers.

•Financial Data includes bank account and payment card details.

•Transaction Data includes details about payments to and from you and other details of products and services you have purchased from us.

•Technical Data may includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.

•Profile Data includes your username and password, purchases or orders made by you, your interests, preferences, feedback and survey responses.

•Usage Data includes information about how you use our website, products and services.

•Marketing and Communications Data includes your preferences in receiving marketing from us and our third parties and your communication preferences.

•Employment Data includes resume, certificates and qualification reports which will be used for your employment request. If you fail to provide personal data

Where we need to collect personal data by law, or under the terms of a contract we have with you, and you fail to provide that data when requested, we may not be able to perform the contract we have or are trying to enter into with you (for example, to provide you with goods or services). In this case, we may have to cancel a product or service you have with us . How is your personal data collected? We use different methods to collect data from and about you including through:

•Direct interactions, you may give us your Identity, Contact and Financial Data by filling in forms or by corresponding with us by post, phone, email or otherwise.

•Automated technologies or interactions, as you interact with our website, we will automatically collect Technical Data about your equipment, browsing actions and patterns. We collect this personal data by using cookies, server logs and other similar technologies. We may also receive Technical Data about you if you visit other websites employing our cookies.

•Contact, Financial and Transaction Data from providers of technical, payment and delivery services.

•Identity and Contact Data from data brokers or aggregators.

•Identity and Contact Data from publicly available sources.`,
        },
        {
            id: 3,
            title: 'WHEN WE USE YOUR PERSONAL DATA?',
            content: `We will only use your personal data as the Applicable Laws and Regulations in Kingdom of Saudi Arabia allow us to. Most commonly, we will use your personal data in the following circumstances:

•Where we need to perform the contract we are about to enter into or have entered into with you.

•Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.

•Where you want to apply for a position.

•Where we need to comply with a legal obligation.

Purposes for which we will use your personal data
We may process your personal data for more than one lawful ground depending on the specific purpose for which we are using your data.
Promotional offers from us

We may use your Identity, Contact, Technical, Usage and Profile Data to form a view on what we think you may want or need, or what may be of interest to you. This is how we decide which products, services and offers may be relevant for you (we call this marketing).

You will receive marketing communications from us if you have requested information from us or purchased real estate unit from us and you have not opted out of receiving that marketing.
Opting out

You can ask us to stop sending you marketing messages at any time by logging into the website and checking or unchecking relevant boxes to adjust your marketing preferences or by following the opt-out links on any marketing message sent to you or by contacting us at any time.

Where you opt out of receiving these marketing messages, this will not apply to personal data provided to us as a result of a product purchase, warranty registration, product/service experience or other transactions.
Collection of Anonymous Computer Information /“Cookies”
Like virtually all websites, this website collects anonymous information known as “cookies” if your computer is set to allow that type of collection or, where required, you consent to cookies. “Cookies” are small pieces of data sent from a website and stored on website user’s web browser while a user is browsing a website. Cookies allows us to enhance your experience on the site by helping us better understand how user’s use the site and evaluate how the Site performs.
Change of purpose

We will only use your personal data for the purposes for which we collected it, unless we reasonably consider that we need to use it for another reason and that reason is compatible with the original purpose.
Please note that we may process your personal data without your knowledge or consent, in compliance with the above rules, where this is required or permitted by law.
DISCLOSURES OF YOUR PERSONAL DATA
We may share your Personal Data with our affiliates or other third parties outsourcing certain services in such event we will ensure our services providers are committed to implement and maintain adequate data protection and security measures and if we are requested to comply with Applicable Laws and Regulations, to enforce a contractual commitment with you, and in the event of a reorganization, merger, divestment or other sale of some or all of our assets or stock.`,
        },
        {
            id: 4,
            title: 'DISCLOSURES OF YOUR PERSONAL DATA',
            content: `We may share your Personal Data with our affiliates or other third parties outsourcing certain services in such event we will ensure our services providers are committed to implement and maintain adequate data protection and security measures and if we are requested to comply with Applicable Laws and Regulations, to enforce a contractual commitment with you, and in the event of a reorganization, merger, divestment or other sale of some or all of our assets or stock.`,
        },
        {
            id: 5,
            title: 'INTERNATIONAL TRANSFERS',
            content: `Whenever we transfer your personal data out of the Kingdom of Saudi Arabia, we ensure a similar degree of protection is afforded to it.
`,
        },
        {
            id: 6,
            title: 'DATA SECURITY',
            content: `We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know. They will only process your personal data on our instructions and they are subject to a duty of confidentiality.`,
        },
        {
            id: 7,
            title: 'DATA RETENTION',
            content: `We will only retain your personal data in compliance with the Applicable Laws and Regulations and for as long as reasonably necessary to fulfil the purposes we collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting or reporting requirements. We may retain your personal data for a longer period in the event of a complaint or if we reasonably believe there is a prospect of litigation in respect to our relationship with you.`,
        },
        {
            id: 8,
            title: 'YOUR LEGAL RIGHTS',
            content: `You have the right to:
            
No fee usually required, you will not have to pay a fee to access your personal data (or to exercise any of the other rights).

Request access to your personal data (commonly known as a “data subject access request”). This enables you to receive a copy of the personal data we hold about you and to check that we are lawfully processing it.

Request correction of the personal data that we hold about you. This enables you to have any incomplete or inaccurate data we hold about you corrected, though we may need to verify the accuracy of the new data you provide to us.

Request erasure of your personal data. This enables you to ask us to delete or remove personal data where there is no good reason for us continuing to process it. You also have the right to ask us to delete or remove your personal data where you have successfully exercised your right to object to processing, where we may have processed your information unlawfully or where we are required to erase your personal data to comply with local law. Note, however, that we may not always be able to comply with your request of erasure for specific legal reasons which will be notified to you, if applicable, at the time of your request.

Withdraw consent at any time where we are relying on consent to process your personal data. However, this will not affect the lawfulness of any processing carried out before you withdraw your consent. If you withdraw your consent, we may not be able to provide certain products or services to you. We will advise you if this is the case at the time you withdraw your consent.`,
        },
    ]

    const renderSection = ({ title, content }: { title: string; content: string }) => {
        return (
            <Animated.View style={[styles.sectionContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
                <Text style={styles.sectionTitle}>{title}</Text>
                <Text style={styles.sectionContent}>{content}</Text>
            </Animated.View>
        )
    }

    return (
        <View style={styles.container}>
            <ImageBackground style={styles.container} source={require('../../../../assets/images/warrenty_back.png')} resizeMode='cover'>
                <Animated.FlatList
                    data={language === 'ar' ? sectionsAr : sectionsEn}
                    renderItem={({ item }) => renderSection({ ...item })}
                    contentContainerStyle={{ paddingBottom: hp('10%'), paddingTop: hp('2%') }}
                    showsVerticalScrollIndicator={false}
                />
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fcfcfc',
    },
    title: {
        fontSize: wp(4.5),
        fontWeight: 'bold',
        marginTop: wp(5.5),
        color: '#121212',
        paddingHorizontal: wp(2.5),
    },
    sectionContainer: {
        marginVertical: wp(4),
        paddingHorizontal: wp(2.5),
    },
    sectionTitle: {
        fontSize: wp(4),
        fontWeight: 'bold',
        color: '#85553A',
        textAlign: 'left',
        marginBottom: wp(3),
    },
    sectionContent: {
        textAlign: 'left',
        fontSize: wp(3.5),
        color: '#666666',
    },
})

export default PrivacyPolicyScreen
