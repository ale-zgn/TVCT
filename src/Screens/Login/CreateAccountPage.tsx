import React, { useState } from 'react'
import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'

import { useNavigation } from '@react-navigation/native'
import { useForm } from 'react-hook-form'
import { ALERT_TYPE, Toast } from 'react-native-alert-notification'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Input from '../../Components/Shared/Input'
import MaintButton from '../../Components/Shared/MaintButton'
import { useCreateUserMutation, useLazyGetAddressPredictionsQuery } from '../../Services/API'
import { useTranslation } from '../../Services/hooks/useTranslation'

export default function CreateAccountPage() {
    const { translate, language } = useTranslation()
    const [getAddress] = useLazyGetAddressPredictionsQuery()
    const [addressSuggestions, setAddressSuggestions] = useState<{ description: string; place_id: string }[]>([])
    const [selectedAddress, setSelectedAddress] = useState<string>('')
    const [createUser, createUserMutation] = useCreateUserMutation()
    const [faceId, setFaceId] = React.useState(false)
    const navigation = useNavigation()
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        getValues,
    } = useForm({
        defaultValues: {
            fullname: '',
            password: '',
            email: '',
            confirmPassword: '',
            city: '',
            phone: '',
        },
    })

    const onSubmit = async (data: any) => {
        try {
            setAddressSuggestions([]) // Optional: Hide suggestions on submit

            await createUser({
                phone: data.phone,
                email: data.email,
                full_name: data.fullname,
                password: data.password,
                address: data.city,
            }).unwrap() // unwrap if you're using RTK Query

            Toast.show({
                type: ALERT_TYPE.SUCCESS,
                title: translate('Account created successfully'),
            })
            navigation.goBack()
        } catch (error: any) {
            console.error(error)
        }
    }

    console.log(addressSuggestions)

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
                        placeholder={translate('Full name')}
                        title={translate('Full name')}
                        control={control}
                        name='fullname'
                        rules={{
                            required: `${translate('This field is required')}`,
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
                        placeholder={translate('Email')}
                        title={translate('Email')}
                        control={control}
                        name='email'
                        rules={{
                            required: `${translate('This field is required')}`,
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
                        placeholder={translate('Phone')}
                        title={translate('Phone')}
                        control={control}
                        name='phone'
                        rules={{
                            required: `${translate('This field is required')}`,
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
                        secureTextEntry
                    />
                </View>

                <View style={styles.inputsContainer}>
                    <Input
                        placeholder={translate('Confirm Password')}
                        title={translate('Confirm Password')}
                        control={control}
                        name='confirmPassword'
                        rules={{
                            required: translate('This field is required'),
                            validate: (value: string) => value === getValues('password') || translate('Passwords do not match'),
                        }}
                        errors={errors}
                        containerStyle={{
                            width: wp('90%'),
                        }}
                        width={90}
                        secureTextEntry
                    />
                </View>

                <View style={styles.inputsContainer}>
                    <Text
                        style={{
                            fontFamily: 'regular',
                            fontSize: wp('5%'),
                            color: '#666666',
                            marginBottom: hp('1%'),
                            textAlign: 'left',
                        }}>
                        City
                    </Text>
                    <TextInput
                        onChangeText={(value) => {
                            setSelectedAddress(value)
                            if (value.length > 2) {
                                getAddress(value).then((res) => {
                                    console.log('res', res)

                                    const predictions = res?.data || []
                                    const mapped = predictions.map((item: any) => ({
                                        description: item.description,
                                        place_id: item.place_id,
                                    }))
                                    setAddressSuggestions(mapped)
                                })
                            } else {
                                setAddressSuggestions([])
                            }
                        }}
                        value={selectedAddress}
                        style={{
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            height: hp('7.25%'),
                            width: '100%',
                            backgroundColor: '#F2F2F2',
                            paddingHorizontal: wp('3'),
                        }}
                    />
                </View>
                {addressSuggestions.length > 0 && (
                    <FlatList
                        data={addressSuggestions}
                        keyExtractor={(item) => item.place_id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={{
                                    paddingVertical: hp('1.5%'),
                                    paddingHorizontal: wp('3%'),
                                    borderBottomColor: '#ccc',
                                    borderBottomWidth: 1,
                                    backgroundColor: '#F2F2F2',
                                    width: '100%',
                                }}
                                onPress={() => {
                                    setValue('city', item.place_id)
                                    setSelectedAddress(item.description)
                                    setAddressSuggestions([])
                                }}>
                                <Text style={{ fontSize: wp('4%') }}>{item.description}</Text>
                            </TouchableOpacity>
                        )}
                        style={{
                            backgroundColor: '#fff',
                            maxHeight: hp('30%'),
                            alignSelf: 'center',
                            borderRadius: 4,
                            elevation: 3,
                        }}
                        contentContainerStyle={{ width: wp('90%') }}
                    />
                )}

                <View style={styles.separator} />

                <MaintButton
                    action={handleSubmit(onSubmit)}
                    title={translate('Continue')}
                    backgroundColor='black'
                    textColor='white'
                    style={styles.ContinueBotton}
                    hasActivityIndicator={createUserMutation.isLoading}
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
