import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { ALERT_TYPE, Toast } from 'react-native-alert-notification'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { useCreateCarMutation, useGetUserQuery } from 'src/Services/API'
import { PlusIcon } from '../../../assets/svgs/Svg'
import Input from '../../Components/Shared/Input'
import MaintButton from '../../Components/Shared/MaintButton'
import useOcrImagePicker from '../../Services/hooks/useOcr'
import { useTranslation } from '../../Services/hooks/useTranslation'

export default function AddCarPage() {
    const { translate } = useTranslation()
    const { data: user } = useGetUserQuery({})
    const navigation = useNavigation()
    const [scanVisible, setScanVisible] = useState(false)
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm()
    const { firstImage, secondImage, chooseImageSource, processImages } = useOcrImagePicker()
    const [createCar] = useCreateCarMutation()

    const applyOcrResult = (dataFromApi) => {
        Object.entries(dataFromApi).forEach(([name, value]) => {
            if (value !== undefined && value !== null) {
                setValue(name, value, {
                    shouldValidate: true,
                    shouldDirty: true,
                })
            }
        })
    }

    const handleScan = async () => {
        try {
            const ocrResult = await processImages()
            applyOcrResult(ocrResult.data)
        } catch (e) {
            console.error(e)
            alert('Erreur lors du scan OCR.')
        }
    }

    const onSubmit = async (data: any) => {
        try {
            await createCar(data).unwrap() // unwrap if you're using RTK Query

            Toast.show({
                type: ALERT_TYPE.SUCCESS,
                title: translate('Car created successfully'),
            })
            navigation.goBack()
        } catch (error: any) {
            console.error(error)
        } // handle API call here
    }

    const fieldSections = [
        {
            sectionTitle: 'Vehicle Information',
            fields: [
                { name: 'matricule', label: 'Registration Number' },
                { name: 'genre', label: 'Category' },
                { name: 'type', label: 'Vehicle Type' },
                { name: 'construteur', label: 'Manufacturer' },
                { name: 'serie', label: 'Type Serial Number' },
                { name: 'typemoteur', label: 'Engine Type' },
                { name: 'dpmc', label: 'Date of First Registration (DPMC)' },
            ],
        },
        {
            sectionTitle: 'Specifications',
            fields: [
                { name: 'place', label: 'Number of Seats' },
                { name: 'porte', label: 'Number of Doors' },
                { name: 'inscrit', label: 'Registration Date' },
            ],
        },
        {
            sectionTitle: 'Owner',
            fields: [
                { name: 'nom', label: 'Full Name' },
                { name: 'adresse', label: 'Address' },
                { name: 'cin', label: 'National ID (CIN)' },
            ],
        },
        {
            sectionTitle: 'Commercial',
            fields: [{ name: 'commercial', label: 'Commercial Type' }],
        },
    ]

    return (
        <KeyboardAwareScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.sectionContainer}>
                    {scanVisible && (
                        <>
                            <Text style={styles.sectionTitle}>{translate('Add 2 images')}</Text>

                            <View style={[styles.inputsContainer, { justifyContent: 'flex-start', gap: 10 }]}>
                                <Pressable
                                    onPress={() => chooseImageSource('first')}
                                    style={{
                                        height: hp('20%'),
                                        width: hp('20%'),
                                        borderColor: 'black',
                                        borderWidth: 1,
                                        borderStyle: 'dashed',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                    {firstImage ? (
                                        <Image source={{ uri: firstImage.uri }} style={{ width: '100%', height: '100%', resizeMode: 'stretch' }} />
                                    ) : (
                                        <PlusIcon />
                                    )}
                                </Pressable>
                                <Pressable
                                    onPress={() => chooseImageSource('second')}
                                    style={{
                                        height: hp('20%'),
                                        width: hp('20%'),
                                        borderColor: 'black',
                                        borderWidth: 1,
                                        borderStyle: 'dashed',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                    {secondImage ? (
                                        <Image source={{ uri: secondImage.uri }} style={{ width: '100%', height: '100%', resizeMode: 'stretch' }} />
                                    ) : (
                                        <PlusIcon />
                                    )}
                                </Pressable>
                            </View>
                        </>
                    )}
                </View>

                <MaintButton
                    action={() => {
                        scanVisible ? handleScan() : setScanVisible(true)
                    }}
                    title={translate(scanVisible ? 'Scan' : 'Quick scan')}
                    backgroundColor='grey'
                    textColor='white'
                />
                {fieldSections.map((section) => (
                    <View key={section.sectionTitle} style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>{translate(section.sectionTitle)}</Text>

                        {section.fields.map((field) => (
                            <View style={styles.inputsContainer} key={field.name}>
                                <Input
                                    name={field.name}
                                    title={translate(field.label)}
                                    placeholder={translate(field.label)}
                                    control={control}
                                    rules={{ required: `${translate('This field is required')}` }}
                                    errors={errors}
                                    containerStyle={{ width: wp('90%') }}
                                    width={90}
                                />
                            </View>
                        ))}
                    </View>
                ))}

                <MaintButton action={handleSubmit(onSubmit)} title={translate('Submit')} backgroundColor='black' textColor='white' />
            </ScrollView>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: wp('100%'),
        backgroundColor: '#fcfcfc',
        paddingBottom: hp('10%'),
    },
    title: {
        fontSize: wp('10%'),
        color: '#121212',
        fontFamily: 'regular',
        marginVertical: hp('2%'),
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
    sectionContainer: {
        marginTop: 20,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontFamily: 'regular',
        fontSize: wp('6%'),
        width: '100%',
        color: '#121212',
        flex: 1,
        marginBottom: hp('2%'),
    },
})
