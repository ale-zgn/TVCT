import React, { useEffect, useRef } from 'react'
import { Animated, ImageBackground, StyleSheet, Text, View } from 'react-native'
import { hp, wp } from '../../../Services/hooks/ResponsivePercentage'
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
            content: `نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية عند استخدام تطبيقنا. من خلال هذه السياسة، نوضّح لك كيف نجمع بياناتك ونستخدمها.`,
        },
        {
            id: 1,
            title: 'ما البيانات التي نجمعها؟',
            content: `قد نجمع بعض المعلومات مثل: الاسم، البريد الإلكتروني، رقم الهاتف، الموقع، والمعلومات التقنية مثل نوع الجهاز ونظام التشغيل.`,
        },
        {
            id: 2,
            title: 'كيف نستخدم بياناتك؟',
            content: `نستخدم البيانات لتحسين تجربتك، مثل تقديم محتوى مخصص أو دعم فني. لا نشارك بياناتك مع أي جهة دون موافقتك، إلا إذا كان ذلك مطلوبًا بموجب القانون.`,
        },
        {
            id: 3,
            title: 'أمان بياناتك',
            content: `نستخدم إجراءات أمان لحماية بياناتك من الوصول غير المصرح به أو الاستخدام الخاطئ.`,
        },
        {
            id: 4,
            title: 'حقوقك',
            content: `يحق لك الوصول إلى بياناتك، أو طلب تعديلها أو حذفها في أي وقت عن طريق التواصل معنا.`,
        },
    ]

    const sectionsEn = [
        {
            id: 0,
            title: 'Introduction',
            content: `We respect your privacy and are committed to protecting your personal data when using our app. This policy explains what data we collect and how we use it.`,
        },
        {
            id: 1,
            title: 'What Data We Collect',
            content: `We may collect your name, email, phone number, location, and technical info like device type and OS.`,
        },
        {
            id: 2,
            title: 'How We Use Your Data',
            content: `We use your data to improve your experience — such as offering personalized content or support. We don’t share your data without your consent unless required by law.`,
        },
        {
            id: 3,
            title: 'Data Security',
            content: `We apply appropriate security measures to protect your personal data from unauthorized access or misuse.`,
        },
        {
            id: 4,
            title: 'Your Rights',
            content: `You can access, update, or request to delete your personal data at any time by contacting us.`,
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
                    contentContainerStyle={{ paddingBottom: hp('10%', { showPixel: false }), paddingTop: hp('2%', { showPixel: false }) }}
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
        fontSize: wp(4.5, { showPixel: false }),
        fontWeight: 'bold',
        marginTop: wp(5.5, { showPixel: false }),
        color: '#121212',
        paddingHorizontal: wp(2.5, { showPixel: false }),
    },
    sectionContainer: {
        marginVertical: wp(4, { showPixel: false }),
        paddingHorizontal: wp(2.5, { showPixel: false }),
    },
    sectionTitle: {
        fontSize: wp(4, { showPixel: false }),
        fontWeight: 'bold',
        color: '#85553A',
        textAlign: 'left',
        marginBottom: wp(3, { showPixel: false }),
    },
    sectionContent: {
        textAlign: 'left',
        fontSize: wp(3.5, { showPixel: false }),
        color: '#666666',
    },
})

export default PrivacyPolicyScreen
