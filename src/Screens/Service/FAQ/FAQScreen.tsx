import React, { useEffect, useRef, useState } from 'react'
import { Animated, Easing, FlatList, Image, LayoutAnimation, Linking, Platform, Pressable, StyleSheet, Text, UIManager, View } from 'react-native'
import { ComputerIcon, DownArrowIconBig, EmailIcon, LeftArrowIcon, PhoneIcon, WhatsAppIcon } from '../../../../assets/svgs/Svg'
import { hp, wp } from '../../../Services/hooks/ResponsivePercentage'
import { useTranslation } from '../../../Services/hooks/useTranslation'

const faq = [
    {
        title: 'من هي رتال؟',
        content:
            'شركة سعودية لجيل جديد من المطورين العقاريين وأحد رواد التطوير العمراني في المملكة، تسابق الزمن في تطوير مجتمعات برؤى جديدة لترتقي بالبيئة العمرانية السعودية إلى أعلى مستوى، وتدعم جودة حياة الإنسان نحو مستقبل واعد يحقق الاستدامة والابتكار من أجل الأجيال القادمة.',
    },
    {
        title: 'ما هو هدفنـــا في التطوير العمراني؟',
        content:
            'استثمارنا الحقيقي والجوهري في نهضة العمران من أجل الإنسان، فهو هدف التطوير والتنمية ومحورها ليستمتع ويسعد بالعيش في بيئة مثالية راقية تلبي جميع احتياجاته وتحقق أمنياته.',
    },
    {
        title: 'ما هو دورنا في رؤية المملكة 2030؟',
        content:
            'يعمل فريقنا بطموح ليساهم في تحقيق رؤية مملكتنا الطموحة 2030، وتمكننا برامج الرؤية من أداء دور حيوي في تعزيز الاقتصاد وتنوعه، ودعم برنامج الإسكان، وبرنامج جودة الحياة.',
    },
    {
        title: 'ماذا يميزنا؟',
        content:
            'رتال تعمل مع نخبة من الشركات المتخصصة في كيان واحد، وهذا سيقدم لك منتج سكني بمعايير ومواصفات عالية، وأسعار تنافسية وتصاميم مميزة تلبي المتطلبات العصرية.',
    },
    {
        title: 'ما هي نوعية المشاريع المطورة، قيد التطوير؟',
        content: 'تنوع مشاريعنا إلى خمسة أنواع رئيسية: سكنية، تجارية، متعدد الاستخدامات، الضيافة، الأعمال، وتتسم بالحيوية والتنوع والشمول، والإتقان العمراني.',
    },
    {
        title: 'ما هي رحلة التطوير التي يمر بها المجتمع السكني؟',
        hasImage: true,
        content: `يمر المجتمع السكني بخمسة مراحل رئيسية
1: كوادر شبابية طموحة ترسم خارطة الطريق لتطوير مشاريع جديدة بأفكار وحلول مبتكرة، تخدم القطاع العقاري وتحقق أحد مستهدفات رؤية المملكة 2030 "برنامج الإسكان".
2: تقدم رتال خدماتها عبر منظومة متكاملة من المراحل التي تبدأ مع شركة معمار للاستشارات الهندسية المتخصصة في التصميم المعماري وإعداد الرسومات الهندسية.
3: لتكون المرحلة الثانية مع شركة BCC أو نساج، متخصصين في إدارة المشاريع والإشراف على الموقع وإدارة التشييد.بـاختلاف أنواعهـــا كالمشـــاريع الســـكنية، والتجارية، وغيرها.
4: لتكون المرحلة الثالثة مع شركة LDPI العالمية المتخصصة في تصميم الإضاءة المعمارية.
5: لتكون المرحلة الأخيرة مع شركة أراك، متخصصة في التصميم المعماري والداخلي.`,
    },
    {
        title: 'أين تقع مجتمعات رتال؟',
        content: 'تتوزع مشاريع ومجتمعات رتال في مدن المملكة المنطقة الوسطى و المنطقة الشرقية و المنطقة الغربية.',
    },
    {
        title: 'ما هي آلية حجز الوحدة السكنية؟',
        content: `تبدأ رحلتك معنا في تملك منزل العمر بالخطوة الأولى، وهي تسجيل اهتمامك من هنا:
https://retal.com.sa/register-your-interest/`,
    },
    {
        title: 'كيف يمكنني معرفة المشاريع الجديدة؟',
        content: 'يتم الإعلان عن المشاريع الجديدة لرتال عبر حسابات التواصل الاجتماعي.',
        icon: true,
    },
    {
        title: 'ما هي المعايير والمواصفات المعتمدة لدى رتال؟',
        content:
            'أولويتنا تلبية تطلعات كل عائلة بامتلاك مسكن راقي وعصري بأعلى معايير الجودة والمواصفات التي ترقى لتطلعات عملائنا وتواكب التطور الحالي، مطبقين كود البناء السعودي في البناء والتشييد لضمان السلامة والصحة العامة.',
    },
    {
        title: 'ما هي الجهات التمويلية المعتمدة لدى رتال؟',
        content: `نعمل مع شركاء استراتيجيين لتوفير حلول تمويلية ميسرة لعملائنا.
البنوك المعتمدة
( مصرف الراجحي، البنك الأهلي، بنك الإنماء،  بنك الرياض، البنك العربي، البنك الفرنسي، بنك البلاد،  البنك الأول).`,
    },
    {
        title: 'هل يمكن الحصول على دعم من وزارة الإسكان عند شراء منزل من رتال؟',
        content: 'يمكن لجميع المواطنين السعوديين المؤهلين والمستحقين للدعم من برنامج سكني لجميع مشاريعنا السكنية.',
    },
    {
        title: 'أين يُدرج سهم شركة رتال؟',
        content:
            "يُدرج سهم شركة رتال للتطوير العمراني في أكبر سوق مالية في منطقة دول مجلس التعاون الخليجي ومنطقة الشرق الأوسط وشمال افريقيا، 'تداول السعودية'.",
    },
]
const imageUrls = [
    require('../../../../assets/images/Image1.jpeg'),
    require('../../../../assets/images/Image2.png'),
    require('../../../../assets/images/Image3.png'),
    require('../../../../assets/images/Image4.png'),
    require('../../../../assets/images/Image5.png'),
    require('../../../../assets/images/Image6.png'),
]
interface Props {
    readonly title: string
    readonly content: string
    readonly index: number
    readonly icon?: boolean
    readonly hasImage?: boolean
}

if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true)
}

export default function FAQ() {
    const { language: selectedLanguage } = useTranslation()
    const fadeAnim = useRef(new Animated.Value(0)).current

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start()
    }, [fadeAnim])

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            {/* {searchBar} */}
            <FlatList
                data={faq}
                renderItem={({ item, index }) => <FAQItem index={index} title={item.title} content={item.content} icon={item.icon} hasImage={item.hasImage} />}
                contentContainerStyle={{ paddingBottom: hp('2%') }}
            />
        </Animated.View>
    )
}

function FAQItem({ title, content, icon, hasImage, index }: Props) {
    const [open, setOpen] = useState(false)
    const { language: selectedLanguage } = useTranslation()
    const scaleAnim = useRef(new Animated.Value(0)).current
    const opacityAnim = useRef(new Animated.Value(0)).current
    const translateYAnim = useRef(new Animated.Value(0)).current

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 500,
                easing: Easing.ease,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: open ? 1 : 0.5,
                friction: 10,
                useNativeDriver: true,
            }),
            Animated.timing(translateYAnim, {
                toValue: open ? 0 : 100,
                duration: 1000,
                easing: Easing.out(Easing.exp),
                useNativeDriver: true,
            }),
        ]).start()
    }, [open])

    const toggleExpanded = () => {
        LayoutAnimation.configureNext({
            duration: 500,
            update: {
                type: LayoutAnimation.Types.easeInEaseOut,
                property: LayoutAnimation.Properties.scaleXY,
            },
            create: {
                type: LayoutAnimation.Types.spring,
                springDamping: 0.1,
                property: LayoutAnimation.Properties.opacity,
            },
            delete: {
                type: LayoutAnimation.Types.easeInEaseOut,
                property: LayoutAnimation.Properties.scaleXY,
            },
        })

        setOpen(!open)
    }

    const getTitleStyle = () => (selectedLanguage === 'en' ? { textAlign: 'right' } : { textAlign: 'left' })
    const getContentStyle = () => (selectedLanguage === 'en' ? { textAlign: 'right' } : { textAlign: 'left' })

    const renderClickableLinks = (text: string) => {
        const regex = /(https?:\/\/[^\s]+)/g
        return text.split(regex).map((part, index) =>
            part.match(regex) ? (
                <Text key={index} style={styles.link} onPress={() => Linking.openURL(part)}>
                    {part}
                </Text>
            ) : (
                part
            )
        )
    }

    const renderContentWithImages = (content: string) => {
        const regex = /\n\d+:/
        const steps = content.split(regex)
        const introduction = steps.shift().trim()
        const filteredSteps = steps.filter(Boolean)

        return (
            <>
                <Text style={[styles.answer, getContentStyle()]}>{introduction}</Text>
                {filteredSteps.map((step, index) => {
                    let imagesToRender = []

                    if (index === 2) {
                        imagesToRender.push(imageUrls[index], imageUrls[index + 1])
                    } else {
                        let adjustedIndex = index >= 3 ? index + 1 : index
                        imagesToRender.push(imageUrls[adjustedIndex])
                    }
                    return (
                        <View style={{ alignItems: 'center' }} key={index}>
                            <View style={styles.imageContainer}>
                                {imagesToRender.map(
                                    (imageUrl, imgIndex) =>
                                        hasImage &&
                                        imageUrl && (
                                            <Image key={imgIndex} source={imageUrl} resizeMode='contain' style={{ width: hp('10%'), height: hp('8%') }} />
                                        )
                                )}
                            </View>

                            <Text style={[styles.answer, getContentStyle()]}>{step}</Text>
                        </View>
                    )
                })}
            </>
        )
    }

    return (
        <Pressable
            onPress={toggleExpanded}
            style={[
                styles.questionContainer,
                {
                    alignItems: selectedLanguage === 'en' ? 'flex-end' : 'flex-start',
                    borderBottomWidth: index < faq.length - 1 ? 1 : undefined,
                    borderBottomColor: '#E5E5E5',
                },
            ]}>
            <View style={styles.titleContainer}>
                {selectedLanguage === 'en' ? !open ? <LeftArrowIcon /> : <DownArrowIconBig /> : undefined}
                <Text style={[styles.title, getTitleStyle(), { color: open ? '#85553A' : '#121212' }]}>{renderClickableLinks(title)}</Text>
                {selectedLanguage === 'ar' ? !open ? <LeftArrowIcon /> : <DownArrowIconBig /> : undefined}
            </View>

            <Animated.View
                style={{
                    opacity: opacityAnim,
                    transform: [{ scale: scaleAnim }, { translateX: translateYAnim }],
                    overflow: 'hidden',
                }}>
                {open &&
                    (hasImage ? renderContentWithImages(content) : <Text style={[styles.answer, getContentStyle()]}>{renderClickableLinks(content)}</Text>)}

                {icon && open && (
                    <View style={styles.iconContainer}>
                        <Pressable onPress={() => Linking.openURL('https://retal.com.sa')}>
                            <ComputerIcon />
                        </Pressable>
                        <Pressable onPress={() => Linking.openURL('tel:8003030888')}>
                            <PhoneIcon />
                        </Pressable>
                        <Pressable onPress={() => Linking.openURL('mailto:sales@retal.com.sa')}>
                            <EmailIcon />
                        </Pressable>
                        <Pressable onPress={() => Linking.openURL('https://api.whatsapp.com/send?phone=9668003030888')}>
                            <WhatsAppIcon />
                        </Pressable>
                    </View>
                )}
            </Animated.View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fcfcfc',
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: wp(100),
        paddingHorizontal: wp(5),
        paddingVertical: wp(6),
    },
    imageContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: wp(50),
        justifyContent: 'center',
        gap: wp(7),
        paddingVertical: hp(1),
    },
    title: {
        fontSize: wp(5),
        fontFamily: 'medium',
        color: '#121212',
    },
    link: { color: '#49499b', textDecorationLine: 'underline' },

    iconContainer: {
        paddingHorizontal: wp(4.75),
        paddingBottom: wp(3),
        display: 'flex',
        flexDirection: 'row',
        gap: wp(3),
        alignItems: 'center',
        alignSelf: 'flex-end',
    },
    answer: {
        paddingHorizontal: wp(5),
        fontSize: wp(5),
        fontFamily: 'regular',
        color: '#666666',
        paddingBottom: wp(2),
    },
    questionContainer: {
        justifyContent: 'space-between',
    },
})
