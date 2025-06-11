import * as FileSystem from 'expo-file-system'
import * as ImagePicker from 'expo-image-picker'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { PlusIcon } from '../../../assets/svgs/Svg'
import Input from '../../Components/Shared/Input'
import MaintButton from '../../Components/Shared/MaintButton'
import { useTranslation } from '../../Services/hooks/useTranslation'
const API_BASE_URL = 'http://192.168.1.27:5000/api'

export default function AddCarPage() {
    const { translate } = useTranslation()
    const [firstImage, setFirstImage] = useState(null)
    const [secondImage, setSecondImage] = useState(null)
    const [scanVisible, setScanVisible] = useState(false)
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm()

    const chooseImageSource = (imageType) => {
        Alert.alert(
            'Sélectionner une option',
            'Voulez-vous prendre une photo ou choisir depuis la galerie ?',
            [
                {
                    text: 'Appareil photo',
                    onPress: () => captureImage(imageType),
                },
                {
                    text: 'Galerie',
                    onPress: () => selectImage(imageType),
                },
                {
                    text: 'Annuler',
                    style: 'cancel',
                },
            ],
            { cancelable: true }
        )
    }

    // Request permission for camera and media library
    const requestPermissions = async () => {
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync()
        const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync()

        if (cameraStatus !== 'granted' || mediaLibraryStatus !== 'granted') {
            alert('Nous avons besoin des permissions de caméra et galerie pour fonctionner correctement!')
            return false
        }
        return true
    }

    // Function to handle image capture
    const captureImage = async (imageType) => {
        const hasPermission = await requestPermissions()
        if (!hasPermission) return

        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            })

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const selectedImage = result.assets[0]

                // Save image to app's file system for persistence
                const persistedUri = await saveImageToFileSystem(selectedImage.uri)
                const persistedImage = { ...selectedImage, uri: persistedUri }

                if (imageType === 'first') {
                    setFirstImage(persistedImage)
                } else {
                    setSecondImage(persistedImage)
                }
            }
        } catch (error) {
            console.log('Error capturing image:', error)
            alert("Erreur lors de la capture d'image: ", error.message)
        }
    }

    // Function to handle image selection from gallery
    const selectImage = async (imageType) => {
        const hasPermission = await requestPermissions()
        if (!hasPermission) return

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            })

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const selectedImage = result.assets[0]

                // Save image to app's file system for persistence
                const persistedUri = await saveImageToFileSystem(selectedImage.uri)
                const persistedImage = { ...selectedImage, uri: persistedUri }

                if (imageType === 'first') {
                    setFirstImage(persistedImage)
                } else {
                    setSecondImage(persistedImage)
                }
            }
        } catch (error) {
            console.log('Error selecting image:', error)
            alert("Erreur lors de la sélection d'image: " + error.message)
        }
    }

    // Function to save image to FileSystem for persistence
    const saveImageToFileSystem = async (uri) => {
        try {
            const fileName = uri.split('/').pop()
            const destinationUri = `${FileSystem.documentDirectory}${fileName}`

            // Check if file already exists at destination to avoid unnecessary copying
            const fileInfo = await FileSystem.getInfoAsync(destinationUri)
            if (fileInfo.exists) return destinationUri

            // Copy the file to a permanent location
            await FileSystem.copyAsync({
                from: uri,
                to: destinationUri,
            })

            return destinationUri
        } catch (error) {
            console.log('Error saving image to file system:', error)
            // Return original URI if there's an error
            return uri
        }
    }

    // Function to get base64 data from an image
    const getBase64FromUri = async (uri) => {
        try {
            const base64 = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            })
            return base64
        } catch (error) {
            console.log('Error converting image to base64:', error)
            throw error
        }
    }

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

    // Function to process the images with the OCR system via API
    const processImages = async () => {
        if (!firstImage || !secondImage) {
            alert('Veuillez sélectionner les deux images')
            return
        }

        /* if (!apiConnected) {
            await checkApiConnection()
            if (!apiConnected) {
                alert('Impossible de se connecter au serveur OCR. Vérifiez votre connexion et réessayez.')
                return
            }
        } */

        // Convert images to base64
        const firstImageBase64 = await getBase64FromUri(firstImage.uri)
        const secondImageBase64 = await getBase64FromUri(secondImage.uri)

        console.log('Envoi des images au serveur pour traitement...')

        // Send the images to the API
        const response = await fetch(`${API_BASE_URL}/process`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstImage: `data:image/jpeg;base64,${firstImageBase64}`,
                secondImage: `data:image/jpeg;base64,${secondImageBase64}`,
            }),
        })

        const result = await response.json()
        console.log('API response received:', result)

        if (!response.ok) {
            throw new Error(result.error || 'Erreur inconnue')
        }

        if (result.success) {
            console.log('Traitement OCR réussi')
            // Mettre à jour formData avec les résultats tout en préservant les champs personnalisés
            applyOcrResult(result.data) //  👈  populate the form
        } else {
            throw new Error('Le traitement a échoué')
        }
    }

    const onSubmit = async (data: any) => {
        console.log('Car info submitted:', data)
        // handle API call here
    }

    const fieldSections = [
        {
            sectionTitle: 'Informations du véhicule',
            fields: [
                { name: 'matricule', label: "Numéro d'immatriculation" },
                { name: 'genre', label: 'Genre' },
                { name: 'type', label: 'Type de véhicule' },
                { name: 'construteur', label: 'Constructeur' },
                { name: 'serie', label: 'Numéro de série du type' },
                { name: 'typemoteur', label: 'Type du moteur' },
                { name: 'dpmc', label: 'Date de première mise en circulation (DPMC)' },
            ],
        },
        {
            sectionTitle: 'Caractéristiques',
            fields: [
                { name: 'place', label: 'Nombre de places' },
                { name: 'porte', label: 'Nombre de portes' },
                { name: 'inscrit', label: "Date d'inscription" },
            ],
        },
        {
            sectionTitle: 'Propriétaire',
            fields: [
                { name: 'nom', label: 'Nom et prénom' },
                { name: 'adresse', label: 'Adresse' },
                { name: 'cin', label: 'CIN' },
            ],
        },
        {
            sectionTitle: 'Commercial',
            fields: [{ name: 'commercial', label: 'Type commercial' }],
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
                        scanVisible ? processImages() : setScanVisible(true)
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
