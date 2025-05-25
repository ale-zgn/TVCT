import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { useGetUserMeQuery, useUpdateUserMeMutation } from '../../Services/API'

import { useForm } from 'react-hook-form'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import PhoneInput from 'react-native-phone-input'
import Input from '../../Components/Shared/Input'
import MaintButton from '../../Components/Shared/MaintButton'
import { useTranslation } from '../../Services/hooks/useTranslation'

export default function CreateAccountPage() {
    const navigation = useNavigation()
    const fullNameRef = React.useRef<TextInput>(null)
    const [updateUser, updateUserMutation] = useUpdateUserMeMutation()
    const { data: user } = useGetUserMeQuery({})
    const { translate, language } = useTranslation()
    const phoneInputRef = React.useRef<PhoneInput>(null)

    const [faceId, setFaceId] = React.useState(false)

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({
        defaultValues: {
            fullname: '',
            password: '',
            confirmPassword: '',
            city: '',
        },
    })

    const onSubmit = async (data: any) => {}

    return (
        <KeyboardAwareScrollView
            style={{ backgroundColor: 'white' }}
            showsVerticalScrollIndicator={false}
            keyboardOpeningTime={Number.MAX_SAFE_INTEGER}
            contentContainerStyle={{
                flexGrow: 1,
            }}>
            <ScrollView style={styles.container}>
                <Text style={styles.title}>{translate('Welcome')}</Text>
                <Text style={styles.subtitle}>{translate('Please fill out the form below to register and create your account.')}</Text>

                <View style={styles.inputsContainer}>
                    <Input
                        ref={fullNameRef}
                        onSubmitEditing={() => {
                            fullNameRef.current?.focus()
                        }}
                        placeholder={translate('First name')}
                        title={translate('First name')}
                        control={control}
                        name='fullName'
                        rules={{
                            required: `${translate(`${translate('This field is required')}`)}`,
                        }}
                        errors={errors}
                        containerStyle={{
                            width: wp('90%'),
                        }}
                        width={90}
                    />
                </View>
                <View style={styles.inputsContainer}>
                    <Text style={styles.inputLabel}>{translate('Phone number')}</Text>

                    <View style={[styles.inputContainer, { width: wp('90%') }]}>
                        <PhoneInput
                            autoFormat={true}
                            ref={phoneInputRef}
                            initialCountry='sa'
                            confirmText={translate('Done')}
                            cancelText={translate('Cancel')}
                            onChangePhoneNumber={(text) => {}}
                            textStyle={styles.input}
                        />
                    </View>
                </View>
                <View style={styles.inputsContainer}>
                    <Input
                        placeholder={translate('Password')}
                        title={translate('Password')}
                        control={control}
                        name='password'
                        rules={{
                            required: `${translate('This field is required')}`,
                            minLength: {
                                value: 6,
                                message: translate('Password must be at least 6 characters'),
                            },
                        }}
                        errors={errors}
                        containerStyle={{
                            width: wp('90%'),
                        }}
                        width={90}
                    />
                </View>

                <View style={styles.inputsContainer}>
                    <Input
                        placeholder={translate('Confirm Password')}
                        title={translate('Confirm Password')}
                        control={control}
                        name='confirmPassword'
                        rules={{
                            required: `${translate('This field is required')}`,
                            validate: (value: string, formValues: any) => value === formValues.password || translate('Passwords do not match'),
                        }}
                        errors={errors}
                        containerStyle={{
                            width: wp('90%'),
                        }}
                        width={90}
                    />
                </View>

                <View style={styles.inputsContainer}>
                    <Input
                        placeholder={translate('City')}
                        title={translate('City')}
                        control={control}
                        name='city'
                        rules={{
                            required: `${translate('This field is required')}`,
                            validate: (value: string, formValues: any) => value === formValues.password || translate('Passwords do not match'),
                        }}
                        errors={errors}
                        containerStyle={{
                            width: wp('90%'),
                        }}
                        width={90}
                    />
                </View>

                <View style={styles.separator} />

                <MaintButton
                    action={handleSubmit(onSubmit)}
                    title={translate('Continue')}
                    backgroundColor='black'
                    textColor='white'
                    style={styles.ContinueBotton}
                    hasActivityIndicator={updateUserMutation.isLoading ? true : false}
                />
                {/* <Text style={styles.newAccount}>
                    {translate("Already have an account?")}
                    <Text style={styles.newAccountSpan} onPress={() => navigation.navigate("LoginPage")}>
                        {" "}
                        {translate("Log in")}
                    </Text>
                </Text> */}
            </ScrollView>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: wp('100%'),
        backgroundColor: 'white',
    },
    title: {
        fontSize: wp('10%'),
        color: '#121212',
        fontFamily: 'regular',
        paddingHorizontal: wp('5%'),
        textAlign: 'left',
        marginTop: hp('5%'),
    },
    subtitle: {
        fontSize: wp('4.75'),
        color: '#666666',
        marginVertical: hp('2%'),
        paddingHorizontal: wp('5%'),
        fontFamily: 'regular',
        textAlign: 'left',
    },

    input: {
        fontSize: 16,
        color: '#666666',
        width: wp('80%'),
        height: hp('8%'),
    },
    separator: {
        width: wp('90%'),
        height: 1,
        backgroundColor: '#F2F2F2',
        alignSelf: 'center',
        marginTop: hp('14%'),
        marginBottom: hp('3%'),
    },
    faceIdContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: wp('90%'),
        alignSelf: 'center',
        marginBottom: hp('5%'),
    },
    ContinueBotton: {
        marginBottom: hp('2%'),
    },
    faceIdTextContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: wp('60%'),
    },
    faceIdTitle: {
        fontSize: wp('4.5%'),
        color: '#121212',
        fontFamily: 'medium',
    },
    faceIdSubtitle: {
        fontSize: wp('4.25%'),
        color: '#666666',
        maxWidth: wp('55%'),
        fontFamily: 'regular',
        alignSelf: 'flex-start',
        textAlign: 'left',
    },
    newAccount: {
        fontSize: wp('4.25%'),
        color: '#121212',
        alignSelf: 'center',
        marginVertical: hp('3.25%'),
        fontFamily: 'regular',
    },
    newAccountSpan: {
        fontSize: wp('4.25%'),
        color: '#121212',
        fontFamily: 'medium',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: wp('90%'),
        height: hp('8%'),
        backgroundColor: '#F2F2F2',

        paddingHorizontal: wp('3%'),
    },
    inputsContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: wp('90%'),
        alignSelf: 'center',
        flexWrap: 'wrap',
        marginBottom: hp('2%'),
    },
    error: {
        fontSize: 12,
        color: 'red',
        alignSelf: 'flex-start',
        marginTop: hp('1%'),
    },
    inputLabel: {
        fontFamily: 'regular',
        fontSize: wp('5.5%'),
        color: '#666666',
        marginBottom: hp('1%'),
        textAlign: 'left',
    },
})
