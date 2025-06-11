import React, { useEffect, useRef, useState } from 'react'
import { Animated, Easing, FlatList, Image, LayoutAnimation, Linking, Platform, Pressable, StyleSheet, Text, UIManager, View } from 'react-native'
import { ComputerIcon, DownArrowIconBig, EmailIcon, LeftArrowIcon, PhoneIcon, RightArrowIcon3, WhatsAppIcon } from '../../../../assets/svgs/Svg'
import { hp, wp } from '../../../Services/hooks/ResponsivePercentage'
import { useTranslation } from '../../../Services/hooks/useTranslation'

const faqAr = [
    {
        title: 'ما هو تطبيق تفقد المركبات الفنية؟',
        content: 'هو تطبيق يتيح للمستخدمين حجز مواعيد لفحص سياراتهم في مراكز معتمدة، ومتابعة نتائج الفحص الفني بكل سهولة.',
    },
    {
        title: 'كيف يمكنني حجز موعد فحص؟',
        content: 'يمكنك حجز الموعد من خلال التطبيق عبر تحديد نوع السيارة، المركز المناسب، واختيار الوقت والتاريخ المتاح.',
    },
    {
        title: 'هل أستطيع تعديل أو إلغاء الموعد بعد الحجز؟',
        content: 'نعم، يمكنك تعديل أو إلغاء الموعد من خلال قسم "مواعيدي" في التطبيق قبل موعد الفحص بوقت كافٍ.',
    },
    {
        title: 'ماذا أحتاج لإحضاره عند الفحص؟',
        content: 'يجب إحضار المركبة نفسها، والرخصة الأصلية، وأي مستندات أخرى قد يطلبها المركز.',
    },
    {
        title: 'هل يتم إرسال نتيجة الفحص عبر التطبيق؟',
        content: 'نعم، ستصلك نتيجة الفحص فور توفرها على حسابك في التطبيق، ويمكنك تحميلها أو مشاركتها.',
    },
    {
        title: 'هل الفحص يشمل كل أجزاء السيارة؟',
        content: 'نعم، يشمل الفحص الفني الكامل المحرك، المكابح، الإضاءة، نظام العادم، والإطارات وغيرها حسب نوع الفحص.',
    },
    {
        title: 'هل أستطيع الدفع من خلال التطبيق؟',
        content: 'نعم، يوفر التطبيق خيارات دفع إلكتروني آمنة لتسهيل عملية الدفع المسبق.',
    },
    {
        title: 'ماذا أفعل إذا رسبت السيارة في الفحص؟',
        content: 'ستظهر لك الملاحظات والأسباب، ويمكنك إجراء الإصلاحات المطلوبة ثم إعادة جدولة فحص جديد.',
    },
]
const faqEn = [
    {
        title: 'What is the Technical Vehicle Check app?',
        content: 'It’s an app that allows users to book inspection appointments at certified centers and track vehicle test results with ease.',
    },
    {
        title: 'How can I book an inspection appointment?',
        content: 'You can book through the app by selecting your vehicle type, preferred center, and choosing an available date and time.',
    },
    {
        title: 'Can I modify or cancel my appointment?',
        content: 'Yes, you can modify or cancel your appointment from the "My Appointments" section in the app before the scheduled time.',
    },
    {
        title: 'What should I bring to the inspection?',
        content: 'You need to bring the vehicle, original registration, and any documents required by the center.',
    },
    {
        title: 'Will I receive the test results in the app?',
        content: 'Yes, your test result will be available in your account once ready, and you can download or share it directly from the app.',
    },
    {
        title: 'Does the inspection cover all parts of the car?',
        content: 'Yes, the technical inspection includes the engine, brakes, lights, exhaust system, tires, and more depending on the test type.',
    },
    {
        title: 'Can I pay through the app?',
        content: 'Yes, the app offers secure online payment options for easy and fast pre-payment.',
    },
    {
        title: 'What happens if my vehicle fails the test?',
        content: 'You’ll see detailed notes and reasons. You can repair the issues and then reschedule a new inspection.',
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
                data={selectedLanguage === 'ar' ? faqAr : faqEn}
                renderItem={({ item, index }) => <FAQItem index={index} title={item.title} content={item.content} icon={item.icon} hasImage={item.hasImage} />}
                contentContainerStyle={{ paddingBottom: hp('2%', { showPixel: false }) }}
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

    const getTitleStyle = () => (selectedLanguage === 'en' ? { textAlign: 'left' } : { textAlign: 'left' })
    const getContentStyle = () => (selectedLanguage === 'en' ? { textAlign: 'left' } : { textAlign: 'left' })

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
                                            <Image
                                                key={imgIndex}
                                                source={imageUrl}
                                                resizeMode='contain'
                                                style={{ width: hp('10%', { showPixel: false }), height: hp('8%', { showPixel: false }) }}
                                            />
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
                    borderBottomWidth: index < faqAr.length - 1 ? 1 : undefined,
                    borderBottomColor: '#E5E5E5',
                },
            ]}>
            <View style={styles.titleContainer}>
                <Text style={[styles.title, getTitleStyle(), { color: open ? '#85553A' : '#121212' }]}>{renderClickableLinks(title)}</Text>
                {selectedLanguage === 'en' ? !open ? <RightArrowIcon3 /> : <DownArrowIconBig /> : undefined}
                {selectedLanguage === 'ar' ? !open ? <LeftArrowIcon /> : <DownArrowIconBig /> : undefined}
            </View>

            <Animated.View
                style={{
                    opacity: opacityAnim,
                    transform: [{ scale: scaleAnim }, { translateX: translateYAnim }],
                    overflow: 'hidden',
                }}>
                {open && <Text style={[styles.answer, getContentStyle()]}>{renderClickableLinks(content)}</Text>}

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
        width: wp('100%', { showPixel: false }),
        paddingHorizontal: wp('5%', { showPixel: false }),
        paddingVertical: wp('6%', { showPixel: false }),
    },
    imageContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: wp('50%', { showPixel: false }),
        justifyContent: 'center',
        gap: wp('7%', { showPixel: false }),
        paddingVertical: hp('1%', { showPixel: false }),
    },
    title: {
        fontSize: wp('5%', { showPixel: false }),
        fontFamily: 'medium',
        color: '#121212',
    },
    link: { color: '#49499b', textDecorationLine: 'underline', textAlign: 'left' },

    iconContainer: {
        paddingHorizontal: wp('4.75%', { showPixel: false }),
        paddingBottom: wp('3%', { showPixel: false }),
        display: 'flex',
        flexDirection: 'row',
        gap: wp('3%', { showPixel: false }),
        alignItems: 'center',
        alignSelf: 'flex-end',
    },
    answer: {
        paddingHorizontal: wp('5%', { showPixel: false }),
        fontSize: wp('5%', { showPixel: false }),
        fontFamily: 'regular',
        color: '#666666',
        paddingBottom: wp('2%', { showPixel: false }),
    },
    questionContainer: {
        justifyContent: 'space-between',
    },
})
