import * as FileSystem from 'expo-file-system'
import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react'
import { Alert } from 'react-native'
const API_BASE_URL = 'http://localhost:5000/api'

const useOcrImagePicker = () => {
    const [firstImage, setFirstImage] = useState(null)
    const [secondImage, setSecondImage] = useState(null)

    const chooseImageSource = (imageType: 'first' | 'second') => {
        Alert.alert(
            'Sélectionner une option',
            'Voulez-vous prendre une photo ou choisir depuis la galerie ?',
            [
                { text: 'Appareil photo', onPress: () => captureImage(imageType) },
                { text: 'Galerie', onPress: () => selectImage(imageType) },
                { text: 'Annuler', style: 'cancel' },
            ],
            { cancelable: true }
        )
    }

    const requestPermissions = async () => {
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync()
        const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync()

        if (cameraStatus !== 'granted' || galleryStatus !== 'granted') {
            alert('Permissions caméra/galerie requises.')
            return false
        }
        return true
    }

    const captureImage = async (imageType: 'first' | 'second') => {
        const allowed = await requestPermissions()
        if (!allowed) return

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        })

        handlePickedImage(result, imageType)
    }

    const selectImage = async (imageType: 'first' | 'second') => {
        const allowed = await requestPermissions()
        if (!allowed) return

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        })

        handlePickedImage(result, imageType)
    }

    const handlePickedImage = async (result, imageType) => {
        if (!result.canceled && result.assets?.length) {
            const image = result.assets[0]
            const persistedUri = await saveImageToFileSystem(image.uri)
            const fullImage = { ...image, uri: persistedUri }

            if (imageType === 'first') setFirstImage(fullImage)
            else setSecondImage(fullImage)
        }
    }

    const saveImageToFileSystem = async (uri: string) => {
        try {
            const fileName = uri.split('/').pop()
            const newUri = `${FileSystem.documentDirectory}${fileName}`

            const fileInfo = await FileSystem.getInfoAsync(newUri)
            if (!fileInfo.exists) {
                await FileSystem.copyAsync({ from: uri, to: newUri })
            }

            return newUri
        } catch (err) {
            console.log('Error saving image:', err)
            return uri
        }
    }

    const getBase64FromUri = async (uri: string) => {
        return await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
        })
    }

    const processImages = async () => {
        if (!firstImage || !secondImage) {
            alert('Veuillez sélectionner les deux images')
            return null
        }

        const firstBase64 = await getBase64FromUri(firstImage.uri)
        const secondBase64 = await getBase64FromUri(secondImage.uri)

        const response = await fetch(`${API_BASE_URL}/process`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstImage: `data:image/jpeg;base64,${firstBase64}`,
                secondImage: `data:image/jpeg;base64,${secondBase64}`,
            }),
        })
        console.log('response', response)

        const data = await response.json()

        if (!response.ok) throw new Error(data.error || 'Erreur inconnue')
        if (!data.success) throw new Error('Traitement OCR échoué')
        return data.data
    }

    return {
        firstImage,
        secondImage,
        chooseImageSource,
        processImages,
    }
}

export default useOcrImagePicker
