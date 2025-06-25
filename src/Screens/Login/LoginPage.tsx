import { useIsFocused, useNavigation } from '@react-navigation/native'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Keyboard, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native'
import PhoneInput from 'react-native-phone-input'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { useAuthMutation } from 'src/Services/API'
import MaintButton from '../../Components/Shared/MaintButton'
import { useTranslation } from '../../Services/hooks/useTranslation'

export default function LoginPage() {
    const navigation = useNavigation()
    const { translate, language } = useTranslation()
    const isFocused = useIsFocused()
    const [auth, authMutation] = useAuthMutation()

    const phoneInputRef = React.useRef<PhoneInput>(null)

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onChange',
    })

    const onSubmit = async (data: { email: string; password: string }) => {
        try {
            // await auth({
            //     email: data.email,
            //     password: data.password,
            // })
            //     .then(async (response) => {
            //         await SecureStore.setItemAsync('token', response.data.token)
            //         navigation.replace('TabNavigator')
            //     })
            //     .catch(() => {
            //         Toast.show({
            //             type: ALERT_TYPE.DANGER,
            //             title: translate('Unauthorized access'),
            //             textBody: translate('Invalid email or password.'),
            //         })
            //     })
                navigation.replace('TabNavigator')

        } catch (error) {
            console.error('Login error:', error)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Pressable onPress={Keyboard.dismiss}>
                <StatusBar barStyle='dark-content' backgroundColor='white' />
                <Text style={styles.subtitle}>{translate('Please enter your informations to connect to your account.')}</Text>

                <Text style={styles.inputLabel}>{translate('Email')}</Text>
                <Controller
                    control={control}
                    name='email'
                    rules={{ required: translate('Email is required') }}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={styles.inputField}
                            placeholder={translate('Enter your email')}
                            value={value}
                            onChangeText={onChange}
                            keyboardType='email-address'
                            autoCapitalize='none'
                        />
                    )}
                />
                {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

                <Text style={styles.inputLabel}>{translate('Password')}</Text>
                <Controller
                    control={control}
                    name='password'
                    rules={{ required: translate('Password is required') }}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={{ ...styles.inputField, marginBottom: hp('5%') }}
                            placeholder={translate('Enter your password')}
                            value={value}
                            onChangeText={onChange}
                            secureTextEntry
                        />
                    )}
                />

                {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

                <MaintButton
                    title={translate('Connect')}
                    action={handleSubmit(onSubmit)}
                    backgroundColor='black'
                    textColor='white'
                    hasActivityIndicator={authMutation.isLoading}
                />

                <View style={styles.separatorContainer}>
                    <View style={styles.separator} />
                    <Text style={styles.separatorText}>{translate('OR')}</Text>
                    <View style={styles.separator} />
                </View>

                <Pressable style={styles.buttonContainer} onPress={() => navigation.navigate('CreateAccount')}>
                    <Text style={styles.buttonText}>{translate('Create an account')}</Text>
                </Pressable>
            </Pressable>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: wp('100%'),
        backgroundColor: '#fcfcfc',
    },
    title: {
        fontSize: wp('10%'),
        color: '#121212',
        fontFamily: 'regular',
        marginTop: hp('2%'),
        paddingHorizontal: wp('5%'),
        textAlign: 'left',
    },
    subtitle: {
        fontSize: wp('5.75'),
        color: 'black',
        marginVertical: hp('2%'),
        marginTop: hp('3%'),
        paddingHorizontal: wp('5%'),
        fontFamily: 'medium',
        textAlign: 'left',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: wp('90%'),
        height: hp('7.25%'),
        backgroundColor: '#F2F2F2',
        paddingHorizontal: wp('3%'),
    },
    inputLabel: {
        fontFamily: 'regular',
        fontSize: wp('5.5%'),
        color: '#121212',
        marginLeft: wp('5%'),
        marginBottom: hp('2%'),
        textAlign: 'left',
    },
    input: {
        fontSize: wp('4%'),
        color: '#121212',
        width: wp('74%'),
        height: hp('8%'),
    },
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: wp('90%'),
        marginLeft: wp('5%'),
        marginVertical: hp('4%'),
    },
    separator: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E5E5',
    },
    separatorText: {
        fontSize: wp('5%'),
        fontFamily: 'regular',
        color: '#121212',
        marginHorizontal: wp('5%'),
    },
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: hp('8%'),
        width: wp('90%'),
        borderRadius: 10,
        alignSelf: 'center',
        backgroundColor: '#F2F2F2',
        flexDirection: 'row',
    },
    buttonText: {
        color: 'black',
        fontSize: wp('6%'),
        fontFamily: 'medium',
        marginHorizontal: wp('5%'),
    },
    inputsContainer: {
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: wp('90%'),
        alignSelf: 'center',
        marginBottom: hp('2.5%'),
    },
    inputField: {
        width: wp('90%'),
        height: hp('7%'),
        backgroundColor: '#F2F2F2',
        alignSelf: 'center',
        paddingHorizontal: wp('4%'),
        borderRadius: 5,
        fontSize: wp('4%'),
        marginBottom: hp('1.5%'),
    },
    errorText: {
        color: 'red',
        fontSize: wp('3.5%'),
        marginLeft: wp('5%'),
        marginBottom: hp('1%'),
    },
})
