import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { useGetUserQuery } from 'src/Services/API'
import useImagePicker from '../../Components/Shared/usePhoto'
import useSocket from '../../Services/hooks/useSocket'
import { useTranslation } from '../../Services/hooks/useTranslation'

export default function PersonalInformationModal() {
    const [showActivityIndicator, setShowActivityIndicator] = useState(true)

    const { images, showImagePickerActionSheet } = useImagePicker()
    const { data: user, refetch: userRefetch, isFetching: userIsFetching } = useGetUserQuery({})
    /*  const [updateUser, updateUserMutation] = useUpdateUserMeMutation()
    const [requestUserFile, requestUserFileMutation] = useRequestFileMutation()
    const [updateUserImage, updateUserImageMutation] = useUpdateUserImageMutation() */

    const [isEditingFirstName, setIsEditingFirstName] = useState(false)
    const [firstName, setFirstName] = useState(user?.full_name)

    const [isEditingLastName, setIsEditingLastName] = useState(false)
    const [lastName, setLastName] = useState(user?.last_name)

    const { translate } = useTranslation()

    useEffect(() => {
        userRefetch()
    }, [user])

    const uploadImage = async () => {
        try {
            /*  await requestUserFile('users/images')
                .unwrap()
                .then(async (response) => {
                    console.log('res', response)
                    const image = response.file

                    const url = response.url
                    let blobData
                    //@ts-ignore
                    if (images[0].assets[0].uri) {
                        //@ts-ignore
                        const blob = await uriToBlob(images[0].assets[0].uri)
                        blobData = blob
                    }
                    let s3res = await fetch(url, {
                        method: 'PUT',
                        headers: {
                            'x-amz-acl': 'public-read',
                        },
                        body: blobData, // ImageObj can be a base64 or a blob
                    })
                    if (s3res) {
                        setShowActivityIndicator(true)

                        updateUserImage(image)
                            .unwrap()
                            .then((response) => console.log('test sucess', response))
                            .catch((err) => console.log('error', err))
                    }
                }) */
        } catch (error) {
            console.error('Error:', error)
        }
    }

    const uriToBlob = async (uri: any) => {
        return await (await fetch(uri)).blob()
    }

    useEffect(() => {
        uploadImage()
    }, [images])

    const navigation = useNavigation()
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            fullname: user?.full_name,
            phoneNumber: user?.phone_number,
            email: user?.email,
        },
    })

    const onSubmit = (data: any) => {
        /*   updateUser({ first_name: firstName, last_name: lastName })
            .unwrap()
            .then((response) => {
                if (response) {
                    Toast.show({
                        title: 'Success',
                        textBody: 'Your profile has been updated successfully',
                        type: ALERT_TYPE.WARNING,
                    })
                    navigation.goBack()
                }
            }) */
    }

    useSocket({
        onReactive: async (event) => {
            if (event.action === 'update' && event.model === 'User') {
                userRefetch()
            }
        },
    })

    const saveFirstName = () => {
        setIsEditingFirstName(false)
    }

    const saveLastName = () => {
        setIsEditingLastName(false)
    }

    return (
        <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            keyboardOpeningTime={Number.MAX_SAFE_INTEGER}
            contentContainerStyle={{
                flexGrow: 1,
            }}>
            <View style={styles.wrapper}>
                {/* <Pressable style={styles.titleContainer} onPress={showImagePickerActionSheet}>
                    <Text style={styles.title}>{translate('Change my profile photo')}</Text>
                    <View>
                        <S3Image file={user?.image} folder={'users/images'} customStyle={styles.image} />
                        <View style={styles.coinsContainer}>
                            <PhotoIcon />
                        </View>
                    </View>
                </Pressable> */}

                {/* <PersonalInformationItem
                    title={translate("First name")}
                    name="name"
                    control={control}
                    rules={{
                        required: {
                            value: true,
                            message: "Name is required",
                        },
                    }}
                    errors={errors}
                    placeholder="Enter your name"
                />
                <PersonalInformationItem
                    title={translate("Last name")}
                    name="lastname"
                    control={control}
                    rules={{
                        required: {
                            value: true,
                            message: "Lastname is required",
                        },
                    }}
                    errors={errors}
                    placeholder="Enter your lastname"
                /> */}
                <Pressable style={styles.textContainer} onPress={() => setIsEditingFirstName(true)}>
                    <Text style={styles.inputTitle}>{translate('Full name')}</Text>
                    {/*   {isEditingFirstName ? (
                        <TextInput style={styles.inputTitle} value={firstName} onChangeText={setFirstName} onEndEditing={saveFirstName} autoFocus />
                    ) : ( */}
                    <Text style={styles.value}>{firstName}</Text>
                </Pressable>

                <Pressable
                    style={styles.textContainer}
                    /*   onPress={() => {
                        //@ts-ignore
                        navigation.navigate('UpdatePersonalInfo', { formType: 'phone' })
                    }} */
                >
                    <Text style={styles.inputTitle}>{translate('Phone number')}</Text>
                    <Text style={styles.value}>{user?.phone} </Text>
                </Pressable>

                <Pressable
                    style={styles.textContainer}
                    /*   onPress={() => {
                        //@ts-ignore
                        navigation.navigate('UpdatePersonalInfo', { formType: 'email' })
                    }} */
                >
                    <Text style={styles.inputTitle}>{translate('Email')}</Text>
                    <Text style={styles.value}>{user?.email} </Text>
                </Pressable>

                {/*   <View style={styles.buttonContainer}>
                    <MaintButton
                        title='Update Personal Information'
                        action={handleSubmit(onSubmit)}
                        backgroundColor='black'
                        textColor='white'
                        //hasActivityIndicator={updateUserMutation.isLoading ? true : false}
                    />
                </View> */}
            </View>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#fcfcfc',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: wp('100%'),
        alignSelf: 'center',
        paddingHorizontal: wp('7.5%'),
        backgroundColor: '#fff',
        borderColor: '#F1F1F1',
        borderTopWidth: 1,
        paddingVertical: hp('1.3%'),
        marginBottom: hp('2%'),
    },
    termsContainer: {
        bottom: hp('15%'),
        width: wp('90%'),
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        position: 'absolute',
    },
    coinsContainer: {
        position: 'absolute',
        bottom: hp('-1%'),
        right: wp('-2.5%'),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#85553A',
        borderRadius: 30,
        width: 30,
        height: 30,
        borderWidth: 2,
        borderColor: '#fff',
    },
    image: {
        width: wp('15%'),
        height: wp('15%'),
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#F2F2F2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: wp('6%'),
        fontFamily: 'medium',
        color: '#000',
    },
    inputTitle: {
        fontSize: wp('5%'),
        fontFamily: 'regular',
        color: '#666666',
        alignSelf: 'flex-start',
    },
    value: {
        fontSize: wp('5%'),
        fontFamily: 'regular',
        color: '#000',
        marginTop: hp('0.25%'),
        alignSelf: 'flex-start',
    },
    itemContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: wp('7.5%'),
        paddingVertical: hp('2.5%'),
        borderColor: '#F1F1F1',
        borderBottomWidth: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    confirmedTitle: {
        fontSize: wp('3.75%'),
        fontFamily: 'medium',
        color: '#85553A',
        marginRight: wp('2%'),
    },
    confirmedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
        width: wp('100%'),
        backgroundColor: 'white',
        paddingVertical: hp('1.75%'),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    textContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: wp('7.5%'),
        paddingVertical: hp('2.5%'),
        borderColor: '#F1F1F1',
        borderBottomWidth: 1,
        justifyContent: 'space-between',
    },
})
